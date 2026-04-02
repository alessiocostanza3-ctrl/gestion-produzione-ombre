// PROD — Features / Manuali Prodotti

'use strict';

import ProdCache from '../core/cache.js';
import { notificaElegante, applicaFade, _esc } from '../core/ui.js';
import {
    fetchManuali,
    createManuale,
    updateManuale,
    fetchStoricoManuale
} from '../core/repository.js';

const CACHE_KEY = 'MANUALI_PRODOTTI';
const MAX_STEP = 12;
const MAX_IMG_DATA_LEN = 1_200_000;

let _manuali = [];
let _manualiById = {};
let _activeModalId = null;

function _formatTs(ts) {
    if (!ts) return '-';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return String(ts);
    return d.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function _normalizeSteps(steps) {
    const arr = Array.isArray(steps) ? steps : [];
    const out = arr.map(function(s) {
        return {
            titolo: String((s && s.titolo) || '').trim(),
            descrizione: String((s && s.descrizione) || '').trim(),
            foto: String((s && s.foto) || '').trim()
        };
    }).filter(function(s) {
        return !!(s.titolo || s.descrizione || s.foto);
    });
    return out.slice(0, MAX_STEP);
}

function _safeImgSrc(raw) {
    const src = String(raw || '').trim();
    if (!src) return '';

    // Consenti solo immagini data URL o URL http/https.
    if (/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(src)) return src;
    if (/^https?:\/\/[^\s]+$/i.test(src)) return src;
    return '';
}

function _buildManualeCard(m) {
    const stepsCount = Array.isArray(m.steps) ? m.steps.length : 0;
    const cover = _safeImgSrc(m.copertina);
    const coverHtml = cover
        ? `<img src="${cover}" alt="copertina" class="w-full h-40 object-cover rounded-t-xl">`
        : `<div class="w-full h-40 bg-slate-100 rounded-t-xl flex items-center justify-center text-slate-400 text-3xl"><i class="fas fa-book-open"></i></div>`;
    return `
    <article class="manuale-card materiale-card ${window.TW?.card || ''} !p-0 overflow-hidden" data-codice="${_esc((m.titolo || '') + ' ' + (m.categoria || ''))}">
        ${coverHtml}
        <div class="p-4">
            <div class="flex items-start justify-between gap-2">
                <div>
                    <h3 class="text-slate-900 font-semibold text-base">${_esc(m.titolo || '(Senza titolo)')}</h3>
                    <p class="text-xs text-slate-500 mt-1">${_esc(m.categoria || 'Generale')}</p>
                </div>
                <span class="${window.TW?.pill || ''}">v${Number(m.version || 1)}</span>
            </div>
            <div class="mt-3 text-xs text-slate-600 space-y-1">
                <p><b>Step:</b> ${stepsCount}</p>
                <p><b>Aggiornato:</b> ${_esc(_formatTs(m.updatedAt))}</p>
                <p><b>Da:</b> ${_esc(m.updatedBy || '-')}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
                <button type="button" class="${window.TW?.btnPrimary || ''}" onclick="apriManuale('${_esc(m.id)}')"><i class="fas fa-eye"></i> Apri</button>
                <button type="button" class="${window.TW?.btn || ''}" onclick="apriFormManuale('${_esc(m.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                <button type="button" class="${window.TW?.btn || ''}" onclick="apriStoricoManuale('${_esc(m.id)}')"><i class="fas fa-clock-rotate-left"></i> Storico</button>
            </div>
        </div>
    </article>`;
}

function _renderLista() {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    const cards = _manuali.map(_buildManualeCard).join('');
    contenitore.innerHTML = `
    <section class="manuali-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title">Manuali Prodotti</h3>
                <p class="acquisti-subtitle">Procedure operative interne con step fotografici</p>
            </div>
            <button type="button" class="btn-nuovo-fisso ${window.TW?.btnPrimaryLg || ''}" onclick="apriFormManuale()">
                <i class="fas fa-plus"></i><span class="btn-label-nuovo"> Nuovo manuale</span>
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            ${cards || '<div class="empty-msg">Nessun manuale disponibile.</div>'}
        </div>
    </section>

    <div id="manuali-modal-host"></div>
    <div id="manuali-storico-host"></div>`;

    applicaFade(contenitore);
    window.aggiornaListaFiltrabili?.();
}

function _makeStepEditor(step, idx) {
    const title = _esc(step.titolo || '');
    const desc = _esc(step.descrizione || '');
    const foto = _safeImgSrc(step.foto);
    const img = foto ? `<img src="${foto}" alt="step-${idx + 1}" style="max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0">` : '<div class="text-xs text-slate-400">Nessuna foto</div>';

    return `
    <div class="manuale-step-edit border border-slate-200 rounded-xl p-3 bg-white" data-step-idx="${idx}">
        <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-semibold text-slate-800">Step ${idx + 1}</h4>
            <button type="button" class="${window.TW?.btnDanger || ''}" onclick="rimuoviStepManuale(${idx})"><i class="fas fa-trash"></i></button>
        </div>
        <div class="grid gap-2">
            <input type="text" class="input-field-modern" placeholder="Titolo step (opzionale)" data-field="titolo" value="${title}">
            <textarea class="input-field-modern" data-field="descrizione" rows="3" placeholder="Descrizione step">${desc}</textarea>
            <div class="grid gap-2">
                ${img}
                <input type="file" accept="image/*" onchange="cambiaFotoStepManuale(this, ${idx})">
            </div>
        </div>
    </div>`;
}

function _renderModalForm(mode, data) {
    const host = document.getElementById('manuali-modal-host');
    if (!host) return;
    const current = data || {
        id: '',
        titolo: '',
        categoria: '',
        copertina: '',
        steps: [ { titolo: '', descrizione: '', foto: '' } ]
    };

    const coverImg = _safeImgSrc(current.copertina);
    const coverPreview = coverImg
        ? `<img id="manuali-copertina-preview" src="${coverImg}" alt="copertina" style="max-width:100%;max-height:200px;border-radius:10px;border:1px solid #e2e8f0">`
        : `<div id="manuali-copertina-preview" class="text-xs text-slate-400">Nessuna copertina</div>`;

    const stepHtml = (current.steps || []).map(_makeStepEditor).join('');
    host.innerHTML = `
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
      <div class="modal-content" style="max-width:920px;max-height:90vh;overflow:auto;">
        <h2>${mode === 'edit' ? 'Modifica manuale' : 'Nuovo manuale'}</h2>
        <div class="grid gap-2">
            <label class="modal-label">Titolo manuale</label>
            <input id="manuali-titolo" class="input-field-modern" type="text" value="${_esc(current.titolo || '')}" placeholder="Es. Installazione Testa LED 500mA">
            <label class="modal-label">Categoria</label>
            <input id="manuali-categoria" class="input-field-modern" type="text" value="${_esc(current.categoria || '')}" placeholder="Es. Assemblaggio">

            <label class="modal-label">Immagine di copertina</label>
            <div id="manuali-copertina-wrap" class="grid gap-2">
                ${coverPreview}
                <input type="file" accept="image/*" onchange="cambiaCopertina(this)">
            </div>
        </div>

        <div class="mt-3 mb-2 flex items-center justify-between">
            <label class="modal-label" style="margin:0">Step operativi</label>
            <button type="button" class="${window.TW?.btn || ''}" onclick="aggiungiStepManuale()"><i class="fas fa-plus"></i> Aggiungi step</button>
        </div>
        <div id="manuali-steps-edit" class="grid gap-2">${stepHtml}</div>

        <div class="modal-actions" style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" class="btn-modal-cancel" onclick="chiudiFormManuale()">Annulla</button>
            <button type="button" class="btn-modal-send" onclick="salvaManualeCorrente()">Salva manuale</button>
        </div>
      </div>
    </div>`;

    _activeModalId = mode === 'edit' ? current.id : null;
}

function _collectStepsFromDom() {
    const root = document.getElementById('manuali-steps-edit');
    if (!root) return [];
    const boxes = Array.from(root.querySelectorAll('.manuale-step-edit'));
    return boxes.map(function(box) {
        return {
            titolo: String(box.querySelector('[data-field="titolo"]')?.value || '').trim(),
            descrizione: String(box.querySelector('[data-field="descrizione"]')?.value || '').trim(),
            foto: String(box.getAttribute('data-foto') || '').trim()
        };
    }).filter(function(s) {
        return !!(s.titolo || s.descrizione || s.foto);
    });
}

async function _toBase64(file) {
    return new Promise(function(resolve, reject) {
        const fr = new FileReader();
        fr.onload = function() { resolve(String(fr.result || '')); };
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

async function _resizeFotoBase64(base64, maxPx = 900) {
    return new Promise(function(resolve) {
        const img = new Image();
        img.onload = function() {
            const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(base64);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.72));
        };
        img.onerror = function() { resolve(base64); };
        img.src = base64;
    });
}

async function cambiaCopertina(inputEl) {
    try {
        const file = inputEl?.files && inputEl.files[0];
        if (!file) return;
        const b64 = await _toBase64(file);
        const resized = await _resizeFotoBase64(b64, 900);
        if (!resized || resized.length > MAX_IMG_DATA_LEN) {
            notificaElegante('Immagine di copertina troppo grande, riduci la risoluzione.', 'warning');
            return;
        }
        const wrap = document.getElementById('manuali-copertina-wrap');
        if (!wrap) return;
        wrap.setAttribute('data-copertina', resized);
        let img = wrap.querySelector('img');
        if (img) {
            img.src = resized;
        } else {
            const oldPreview = wrap.querySelector('#manuali-copertina-preview');
            if (oldPreview) oldPreview.remove();
            const newImg = document.createElement('img');
            newImg.id = 'manuali-copertina-preview';
            newImg.src = resized;
            newImg.alt = 'copertina';
            newImg.style.maxWidth = '100%';
            newImg.style.maxHeight = '200px';
            newImg.style.borderRadius = '10px';
            newImg.style.border = '1px solid #e2e8f0';
            wrap.insertBefore(newImg, wrap.firstChild);
        }
    } catch (_) {
        notificaElegante('Errore nel caricamento immagine di copertina.', 'error');
    }
}

async function cambiaFotoStepManuale(inputEl, idx) {
    try {
        const file = inputEl?.files && inputEl.files[0];
        if (!file) return;
        const b64 = await _toBase64(file);
        const resized = await _resizeFotoBase64(b64, 900);
        if (!resized || resized.length > MAX_IMG_DATA_LEN) {
            notificaElegante('Immagine troppo grande, riduci la risoluzione.', 'warning');
            return;
        }
        const box = document.querySelector(`.manuale-step-edit[data-step-idx="${idx}"]`);
        if (!box) return;
        box.setAttribute('data-foto', resized);
        const img = box.querySelector('img');
        if (img) img.src = resized;
        else {
            const wrap = box.querySelector('.grid.gap-2');
            if (wrap) {
                const top = document.createElement('img');
                top.src = resized;
                top.alt = 'preview-step';
                top.style.maxWidth = '100%';
                top.style.maxHeight = '180px';
                top.style.borderRadius = '10px';
                top.style.border = '1px solid #e2e8f0';
                wrap.insertBefore(top, wrap.firstChild);
            }
        }
    } catch (_) {
        notificaElegante('Errore nel caricamento immagine.', 'error');
    }
}

function apriFormManuale(id) {
    if (!id) {
        _renderModalForm('new', null);
        return;
    }
    const m = _manualiById[id];
    if (!m) {
        notificaElegante('Manuale non trovato.', 'warning');
        return;
    }
    _renderModalForm('edit', {
        id: m.id,
        titolo: m.titolo,
        categoria: m.categoria,
        copertina: m.copertina || '',
        steps: (m.steps || []).map(function(s) {
            return { titolo: s.titolo || '', descrizione: s.descrizione || '', foto: s.foto || '' };
        })
    });

    // Salva copertina nel data-attribute del wrapper
    const coverWrap = document.getElementById('manuali-copertina-wrap');
    const safeCover = _safeImgSrc(m.copertina);
    if (coverWrap && safeCover) coverWrap.setAttribute('data-copertina', safeCover);

    const boxes = Array.from(document.querySelectorAll('.manuale-step-edit'));
    boxes.forEach(function(box, idx) {
        const foto = _safeImgSrc((m.steps && m.steps[idx] && m.steps[idx].foto) || '');
        if (foto) box.setAttribute('data-foto', foto);
    });
}

function chiudiFormManuale() {
    const modal = document.getElementById('manuali-modal');
    if (modal && modal.parentElement) modal.parentElement.innerHTML = '';
    _activeModalId = null;
}

function aggiungiStepManuale() {
    const root = document.getElementById('manuali-steps-edit');
    if (!root) return;
    const count = root.querySelectorAll('.manuale-step-edit').length;
    if (count >= MAX_STEP) {
        notificaElegante('Hai raggiunto il massimo numero di step.', 'warning');
        return;
    }
    root.insertAdjacentHTML('beforeend', _makeStepEditor({ titolo: '', descrizione: '', foto: '' }, count));
}

function rimuoviStepManuale(idx) {
    const box = document.querySelector(`.manuale-step-edit[data-step-idx="${idx}"]`);
    if (!box) return;
    box.remove();

    const root = document.getElementById('manuali-steps-edit');
    if (!root) return;
    const all = Array.from(root.querySelectorAll('.manuale-step-edit'));
    all.forEach(function(el, i) {
        el.setAttribute('data-step-idx', String(i));
        const title = el.querySelector('h4');
        if (title) title.textContent = 'Step ' + (i + 1);
        const input = el.querySelector('input[type="file"]');
        if (input) input.setAttribute('onchange', `cambiaFotoStepManuale(this, ${i})`);
        const del = el.querySelector('button');
        if (del) del.setAttribute('onclick', `rimuoviStepManuale(${i})`);
    });
}

async function salvaManualeCorrente() {
    const titolo = String(document.getElementById('manuali-titolo')?.value || '').trim();
    const categoria = String(document.getElementById('manuali-categoria')?.value || '').trim();
    const copertina = String(document.getElementById('manuali-copertina-wrap')?.getAttribute('data-copertina') || '').trim();
    const steps = _normalizeSteps(_collectStepsFromDom());

    if (!titolo) {
        notificaElegante('Inserisci un titolo manuale.', 'warning');
        return;
    }
    if (!steps.length) {
        notificaElegante('Inserisci almeno uno step valido.', 'warning');
        return;
    }

    try {
        notificaElegante('Salvataggio manuale in corso...', 'info');
        let res;
        if (_activeModalId) {
            res = await updateManuale({ id: _activeModalId, titolo: titolo, categoria: categoria, copertina: copertina, steps: steps });
        } else {
            res = await createManuale({ titolo: titolo, categoria: categoria, copertina: copertina, steps: steps });
        }

        if (!res || res.status !== 'ok') {
            throw new Error((res && (res.message || res.msg)) || 'Errore salvataggio manuale');
        }

        await ProdCache.invalidate(CACHE_KEY);
        delete window.cacheContenuti?.MANUALI_PRODOTTI;
        delete window.cacheFetchTime?.MANUALI_PRODOTTI;
        chiudiFormManuale();
        await caricaManuali(null, null, false);
        notificaElegante('Manuale salvato correttamente.', 'success');
    } catch (e) {
        notificaElegante((e && e.message) || 'Errore durante il salvataggio.', 'error');
    }
}

function apriManuale(id) {
    const m = _manualiById[id];
    if (!m) return;

    const stepsHtml = (m.steps || []).map(function(step, idx) {
        const safeStepImg = _safeImgSrc(step.foto);
        const img = safeStepImg
            ? `<img src="${safeStepImg}" alt="step-${idx + 1}" style="max-width:100%;border-radius:10px;border:1px solid #e2e8f0">`
            : '<div class="text-xs text-slate-400">Nessuna immagine</div>';
        return `
        <details class="border border-slate-200 rounded-xl p-3 bg-white" ${idx === 0 ? 'open' : ''}>
            <summary class="cursor-pointer font-semibold text-slate-800">Step ${idx + 1}${step.titolo ? ' - ' + _esc(step.titolo) : ''}</summary>
            <div class="mt-2 grid gap-2">
                ${img}
                <p class="text-sm text-slate-700">${_esc(step.descrizione || '-')}</p>
            </div>
        </details>`;
    }).join('');

    const coverDetail = _safeImgSrc(m.copertina);
    const coverDetailHtml = coverDetail
        ? `<img src="${coverDetail}" alt="copertina" style="max-width:100%;max-height:260px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:12px">`
        : '';

    const host = document.getElementById('manuali-modal-host');
    if (!host) return;
    host.innerHTML = `
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
      <div class="modal-content" style="max-width:920px;max-height:90vh;overflow:auto;">
        <h2>${_esc(m.titolo || '(Senza titolo)')}</h2>
        <p class="text-xs text-slate-500 mb-3">${_esc(m.categoria || 'Generale')} · v${Number(m.version || 1)} · aggiornato ${_esc(_formatTs(m.updatedAt))}</p>
        ${coverDetailHtml}
        <div class="grid gap-2">${stepsHtml || '<div class="empty-msg">Nessuno step disponibile.</div>'}</div>
        <div class="modal-actions" style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" class="btn-modal-cancel" onclick="chiudiFormManuale()">Chiudi</button>
        </div>
      </div>
    </div>`;
}

async function apriStoricoManuale(id) {
    const host = document.getElementById('manuali-storico-host');
    if (!host) return;
    host.innerHTML = `
    <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
      <div class="modal-content" style="max-width:980px;max-height:90vh;overflow:auto;">
        <h2>Storico versioni</h2>
        <div class="centered-msg">Caricamento storico...</div>
      </div>
    </div>`;

    try {
        const res = await fetchStoricoManuale(id);
        if (!res || res.status !== 'ok') throw new Error('Storico non disponibile');
        const list = Array.isArray(res.storico) ? res.storico : [];
        const rows = list.map(function(v, i) {
            const snap = v.snapshot || {};
            const stepsCount = Array.isArray(snap.steps) ? snap.steps.length : 0;
            return `
            <details class="border border-slate-200 rounded-xl p-3 bg-white" ${i === 0 ? 'open' : ''}>
                <summary class="cursor-pointer font-semibold text-slate-800">
                    v${Number(v.version || 0)} · ${_esc(v.changeType || 'UPDATE')} · ${_esc(_formatTs(v.changedAt))}
                </summary>
                <div class="mt-2 text-sm text-slate-700 grid gap-1">
                    <p><b>Titolo:</b> ${_esc(snap.titolo || '-')}</p>
                    <p><b>Categoria:</b> ${_esc(snap.categoria || '-')}</p>
                    <p><b>Step:</b> ${stepsCount}</p>
                    <p><b>Utente:</b> ${_esc(v.changedBy || '-')}</p>
                </div>
            </details>`;
        }).join('');

        host.innerHTML = `
        <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
          <div class="modal-content" style="max-width:980px;max-height:90vh;overflow:auto;">
            <h2>Storico versioni</h2>
            <div class="grid gap-2">${rows || '<div class="empty-msg">Nessuna versione trovata.</div>'}</div>
            <div class="modal-actions" style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
                <button type="button" class="btn-modal-cancel" onclick="chiudiStoricoManuale()">Chiudi</button>
            </div>
          </div>
        </div>`;
    } catch (e) {
        host.innerHTML = `
        <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
          <div class="modal-content" style="max-width:760px;max-height:90vh;overflow:auto;">
            <h2>Storico versioni</h2>
            <div class="centered-error-bold">Errore nel caricamento storico.</div>
            <div class="modal-actions" style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
                <button type="button" class="btn-modal-cancel" onclick="chiudiStoricoManuale()">Chiudi</button>
            </div>
          </div>
        </div>`;
    }
}

function chiudiStoricoManuale() {
    const host = document.getElementById('manuali-storico-host');
    if (host) host.innerHTML = '';
}

export async function caricaManuali(expectedRequestId = null, signal = null, isBackground = false) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    if (!isBackground) {
        contenitore.innerHTML = "<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento manuali...</div>";
    }

    try {
        let data = null;
        if (!isBackground) {
            try {
                data = await ProdCache.get(CACHE_KEY);
            } catch (_) {}
        }

        if (data && Array.isArray(data.manuali) && data.manuali.length) {
            _manuali = data.manuali;
            _manualiById = {};
            _manuali.forEach(function(m) { _manualiById[m.id] = m; });
            _renderLista();
            if (!isBackground) return;
        }

        const res = await fetchManuali();
        if (signal?.aborted) return;
        if (!res || res.status !== 'ok') throw new Error((res && (res.message || res.msg)) || 'Errore caricamento manuali');

        _manuali = Array.isArray(res.manuali) ? res.manuali : [];
        _manualiById = {};
        _manuali.forEach(function(m) { _manualiById[m.id] = m; });

        await ProdCache.set(CACHE_KEY, { manuali: _manuali });
        _renderLista();

        if (window.cacheContenuti) {
            window.cacheContenuti.MANUALI_PRODOTTI = contenitore.innerHTML;
        }
        if (window.cacheFetchTime) {
            window.cacheFetchTime.MANUALI_PRODOTTI = Date.now();
        }
    } catch (e) {
        if (isBackground) return;
        contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento manuali.</div>";
    }
}

export function registerGlobals() {
    window.caricaManuali = caricaManuali;
    window.apriManuale = apriManuale;
    window.apriFormManuale = apriFormManuale;
    window.chiudiFormManuale = chiudiFormManuale;
    window.aggiungiStepManuale = aggiungiStepManuale;
    window.rimuoviStepManuale = rimuoviStepManuale;
    window.cambiaFotoStepManuale = cambiaFotoStepManuale;
    window.cambiaCopertina = cambiaCopertina;
    window.salvaManualeCorrente = salvaManualeCorrente;
    window.apriStoricoManuale = apriStoricoManuale;
    window.chiudiStoricoManuale = chiudiStoricoManuale;
}

export function init() {
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('manuali-modal');
        if (modal && e.target === modal) chiudiFormManuale();
        const storico = document.getElementById('manuali-storico-modal');
        if (storico && e.target === storico) chiudiStoricoManuale();
    });
}

export default caricaManuali;
