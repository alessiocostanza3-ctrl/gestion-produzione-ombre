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
const MAX_PROC_STEPS = 20;
const MAX_SCHEDA_ROWS = 30;
const MAX_OCCORRENTE = 20;
const MAX_IMG_DATA_LEN = 1_200_000;

const SCHEDA_VOCI_STANDARD = [
    'Dimensione della sfera',
    'Finiture',
    'Ottiche',
    'Grado di Protezione IP',
    'Tipologia di installazione',
    'Potenza assorbita',
    'Alimentazione',
    'Dimmerazione',
    'Temperatura colore',
    'Indice di resa cromatica',
    'Tolleranza cromatica',
    'Flusso luminoso',
    'Efficienza luminosa',
    'Mantenimento del flusso luminoso',
    'Temperatura di esercizio'
];

let _manuali = [];
let _manualiById = {};
let _activeModalId = null;

function _formatTs(ts) {
    if (!ts) return '-';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return String(ts);
    return d.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function _safeImgSrc(raw) {
    const src = String(raw || '').trim();
    if (!src) return '';
    if (/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(src)) return src;
    if (/^https?:\/\/[^\s]+$/i.test(src)) return src;
    return '';
}

// Restituisce l'oggetto sections se formato v2, null se vecchio formato (steps)
function _getSections(m) {
    if (m && m.sections && m.sections._v === 2) return m.sections;
    return null;
}

function _imgPreviewHtml(src, alt) {
    if (src) return `<img src="${src}" alt="${alt}" style="max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0;display:block;margin-bottom:6px">`;
    return `<div class="text-xs text-slate-400" style="margin-bottom:6px">Nessuna foto</div>`;
}

function _buildManualeCard(m) {
    const sections = _getSections(m);
    const procCount = sections
        ? (Array.isArray(sections.procedimenti) ? sections.procedimenti.length : 0)
        : (Array.isArray(m.steps) ? m.steps.length : 0);
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
                <p><b>Procedimenti:</b> ${procCount}</p>
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

// ─── Editor sezioni ─────────────────────────────────────────────────────────────

// Riga standard: etichetta fissa a sinistra, solo valore editabile a destra
function _makeSchedaRowStandard(voce, valore, idx) {
    return `
    <div class="scheda-row" data-row-idx="${idx}" data-voce="${_esc(voce)}" style="display:grid;grid-template-columns:1fr 1fr 36px;gap:6px;align-items:center">
        <span style="padding:8px 10px;font-size:.875rem;font-weight:500;color:#334155">${_esc(voce)}</span>
        <input type="text" class="input-field-modern" data-field="valore" placeholder="Valore" value="${_esc(valore || '')}">
        <button type="button" class="${window.TW?.btnDanger || ''}" onclick="rimuoviSchedaRow(${idx})" title="Rimuovi"><i class="fas fa-trash"></i></button>
    </div>`;
}

// Riga custom: entrambi i campi editabili (aggiunta manuale)
function _makeSchedaRowCustom(voce, valore, idx) {
    return `
    <div class="scheda-row scheda-row-custom" data-row-idx="${idx}" style="display:grid;grid-template-columns:1fr 1fr 36px;gap:6px;align-items:center">
        <input type="text" class="input-field-modern" data-field="voce" placeholder="Caratteristica aggiuntiva" value="${_esc(voce || '')}">
        <input type="text" class="input-field-modern" data-field="valore" placeholder="Valore" value="${_esc(valore || '')}">
        <button type="button" class="${window.TW?.btnDanger || ''}" onclick="rimuoviSchedaRow(${idx})" title="Rimuovi"><i class="fas fa-trash"></i></button>
    </div>`;
}

function _makeOccorrenteItem(item, idx) {
    const foto = _safeImgSrc((item && item.foto) || '');
    return `
    <div class="occorrente-item border border-slate-200 rounded-xl p-3 bg-white" data-item-idx="${idx}"${foto ? ` data-foto="${_esc(foto)}"` : ''}>
        <div style="display:grid;grid-template-columns:54px 1fr 1fr 36px;gap:6px;align-items:center;margin-bottom:8px">
            <input type="text" class="input-field-modern" data-field="lettera" placeholder="A" value="${_esc((item && item.lettera) || '')}" style="text-align:center;font-weight:700">
            <input type="text" class="input-field-modern" data-field="nome" placeholder="Nome componente" value="${_esc((item && item.nome) || '')}">
            <input type="text" class="input-field-modern" data-field="codice" placeholder="Codice (es. LB4PIY062B-1)" value="${_esc((item && item.codice) || '')}">
            <button type="button" class="${window.TW?.btnDanger || ''}" onclick="rimuoviOccorrenteItem(${idx})" title="Rimuovi"><i class="fas fa-trash"></i></button>
        </div>
        ${_imgPreviewHtml(foto, `occ-${idx}`)}
        <input type="file" accept="image/*" onchange="cambiaFotoOccorrente(this, ${idx})">
    </div>`;
}

function _makeProcStep(proc, idx) {
    const foto = _safeImgSrc((proc && proc.foto) || '');
    return `
    <div class="proc-step border border-slate-200 rounded-xl p-3 bg-white" data-step-idx="${idx}"${foto ? ` data-foto="${_esc(foto)}"` : ''}>
        <div class="flex items-center justify-between" style="margin-bottom:8px">
            <h4 class="text-sm font-semibold text-slate-800">Step ${idx + 1}</h4>
            <button type="button" class="${window.TW?.btnDanger || ''}" onclick="rimuoviProcStep(${idx})"><i class="fas fa-trash"></i></button>
        </div>
        ${_imgPreviewHtml(foto, `proc-${idx}`)}
        <input type="file" accept="image/*" onchange="cambiaFotoProcedimento(this, ${idx})" style="margin-bottom:6px">
        <textarea class="input-field-modern" data-field="descrizione" rows="3" placeholder="Descrizione del passaggio...">${_esc((proc && proc.descrizione) || '')}</textarea>
    </div>`;
}

function _makeDisegnoSection(foto) {
    const safe = _safeImgSrc(foto || '');
    return `
    <div id="manuali-disegno-wrap"${safe ? ` data-foto="${_esc(safe)}"` : ''} class="border border-slate-200 rounded-xl p-3 bg-white">
        ${_imgPreviewHtml(safe, 'disegno-tecnico')}
        <input type="file" accept="image/*" onchange="cambiaFotoDisegno(this)">
    </div>`;
}

function _renderModalForm(mode, data) {
    const host = document.getElementById('manuali-modal-host');
    if (!host) return;

    const sections = _getSections(data);
    // Sezione 2: Scheda Tecnica
    const st = sections ? (sections.schedaTecnica || []) : [];
    // Sezione 3: Occorrente
    const occ = sections ? (sections.occorrente || []) : [];
    // Sezione 4: Procedimento (con retrocompatibilità steps v1)
    const proc = sections
        ? (sections.procedimenti || [])
        : (Array.isArray(data?.steps) ? data.steps.map(function(s) {
            return { descrizione: (s.descrizione || s.titolo || ''), foto: s.foto || '' };
        }) : []);
    // Sezione 5: Disegno Tecnico
    const dtFoto = sections ? (sections.disegnoTecnico?.foto || '') : '';

    // Costruisci scheda: prima le voci standard (con valore salvato se esiste), poi le custom
    const savedMap = {};
    const customRows = [];
    st.forEach(function(r) {
        if (SCHEDA_VOCI_STANDARD.includes(r.voce)) {
            savedMap[r.voce] = r.valore;
        } else {
            customRows.push(r);
        }
    });
    let _ri = 0;
    const schedaRows = SCHEDA_VOCI_STANDARD.map(function(voce) {
        return _makeSchedaRowStandard(voce, savedMap[voce] || '', _ri++);
    }).join('') + customRows.map(function(r) {
        return _makeSchedaRowCustom(r.voce, r.valore, _ri++);
    }).join('');
    const occItems = occ.length > 0
        ? occ.map(function(o, i) { return _makeOccorrenteItem(o, i); }).join('')
        : _makeOccorrenteItem(null, 0);
    const procSteps = proc.length > 0
        ? proc.map(function(p, i) { return _makeProcStep(p, i); }).join('')
        : _makeProcStep(null, 0);

    const coverImg = _safeImgSrc(data?.copertina || '');
    const coverPreview = coverImg
        ? `<img id="manuali-copertina-preview" src="${coverImg}" alt="copertina" style="max-width:100%;max-height:200px;border-radius:10px;border:1px solid #e2e8f0;display:block;margin-bottom:6px">`
        : `<div id="manuali-copertina-preview" class="text-xs text-slate-400" style="margin-bottom:6px">Nessuna copertina</div>`;

    const secTitle = (icon, label) =>
        `<h3 style="font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#64748b;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #e2e8f0"><i class="${icon}"></i> &nbsp;${label}</h3>`;

    host.innerHTML = `
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
      <div class="modal-content" style="max-width:960px;max-height:90vh;overflow-y:auto;">
        <h2 style="margin-bottom:20px">${mode === 'edit' ? 'Modifica manuale' : 'Nuovo manuale'}</h2>

        <!-- ① COPERTINA E INFO -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          ${secTitle('fas fa-image', 'Copertina e info')}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div>
              <label class="modal-label">Titolo manuale *</label>
              <input id="manuali-titolo" class="input-field-modern" type="text" value="${_esc(data?.titolo || '')}" placeholder="Es. BONA 7/12">
            </div>
            <div>
              <label class="modal-label">Categoria</label>
              <input id="manuali-categoria" class="input-field-modern" type="text" value="${_esc(data?.categoria || '')}" placeholder="Es. Lampade a Picchetto">
            </div>
          </div>
          <label class="modal-label">Immagine di copertina</label>
          <div id="manuali-copertina-wrap"${coverImg ? ` data-copertina="${_esc(coverImg)}"` : ''}>
            ${coverPreview}
            <input type="file" accept="image/*" onchange="cambiaCopertina(this)">
          </div>
        </div>

        <!-- ② SCHEDA TECNICA -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            ${secTitle('fas fa-table', 'Scheda Tecnica')}
            <button type="button" class="${window.TW?.btn || ''}" onclick="aggiungiSchedaRow()" style="margin-bottom:10px"><i class="fas fa-plus"></i> Aggiungi voce</button>
          </div>
          <div id="manuali-scheda-edit" class="grid gap-2">${schedaRows}</div>
        </div>

        <!-- ③ MATERIALE OCCORRENTE -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            ${secTitle('fas fa-boxes-stacked', 'Materiale Occorrente')}
            <button type="button" class="${window.TW?.btn || ''}" onclick="aggiungiOccorrenteItem()" style="margin-bottom:10px"><i class="fas fa-plus"></i> Aggiungi</button>
          </div>
          <div id="manuali-occorrente-edit" class="grid gap-3">${occItems}</div>
        </div>

        <!-- ④ PROCEDIMENTO -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            ${secTitle('fas fa-list-check', 'Procedimento')}
            <button type="button" class="${window.TW?.btn || ''}" onclick="aggiungiProcStep()" style="margin-bottom:10px"><i class="fas fa-plus"></i> Aggiungi step</button>
          </div>
          <div id="manuali-proc-edit" class="grid gap-3">${procSteps}</div>
        </div>

        <!-- ⑤ DISEGNO TECNICO -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          ${secTitle('fas fa-drafting-compass', 'Disegno Tecnico')}
          ${_makeDisegnoSection(dtFoto)}
        </div>

        <div class="modal-actions" style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" class="btn-modal-cancel" onclick="chiudiFormManuale()">Annulla</button>
          <button type="button" class="btn-modal-send" onclick="salvaManualeCorrente()"><i class="fas fa-save"></i> Salva manuale</button>
        </div>
      </div>
    </div>`;

    _activeModalId = mode === 'edit' ? (data?.id || null) : null;
}

function _collectSectionsFromDom() {
    // Scheda Tecnica
    const schedaTecnica = [];
    document.querySelectorAll('#manuali-scheda-edit .scheda-row').forEach(function(row) {
        // Le righe standard hanno data-voce; le custom hanno un input[data-field="voce"]
        const voce = String(row.getAttribute('data-voce') || row.querySelector('[data-field="voce"]')?.value || '').trim();
        const valore = String(row.querySelector('[data-field="valore"]')?.value || '').trim();
        if (voce || valore) schedaTecnica.push({ voce: voce, valore: valore });
    });

    // Occorrente
    const occorrente = [];
    document.querySelectorAll('#manuali-occorrente-edit .occorrente-item').forEach(function(item) {
        const lettera = String(item.querySelector('[data-field="lettera"]')?.value || '').trim();
        const nome = String(item.querySelector('[data-field="nome"]')?.value || '').trim();
        const codice = String(item.querySelector('[data-field="codice"]')?.value || '').trim();
        const foto = String(item.getAttribute('data-foto') || '').trim();
        if (lettera || nome || codice || foto) occorrente.push({ lettera: lettera, nome: nome, codice: codice, foto: foto });
    });

    // Procedimenti
    const procedimenti = [];
    document.querySelectorAll('#manuali-proc-edit .proc-step').forEach(function(step) {
        const descrizione = String(step.querySelector('[data-field="descrizione"]')?.value || '').trim();
        const foto = String(step.getAttribute('data-foto') || '').trim();
        if (descrizione || foto) procedimenti.push({ descrizione: descrizione, foto: foto });
    });

    // Disegno Tecnico
    const dtWrap = document.getElementById('manuali-disegno-wrap');
    const disegnoTecnico = { foto: String(dtWrap?.getAttribute('data-foto') || '').trim() };

    return { _v: 2, schedaTecnica: schedaTecnica, occorrente: occorrente, procedimenti: procedimenti, disegnoTecnico: disegnoTecnico };
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

async function _handleImageUpload(file, onSuccess) {
    try {
        const b64 = await _toBase64(file);
        const resized = await _resizeFotoBase64(b64, 900);
        if (!resized || resized.length > MAX_IMG_DATA_LEN) {
            notificaElegante('Immagine troppo grande, riduci la risoluzione.', 'warning');
            return;
        }
        onSuccess(resized);
    } catch (_) {
        notificaElegante('Errore nel caricamento immagine.', 'error');
    }
}

function _setFotoOnWrap(wrap, resized) {
    wrap.setAttribute('data-foto', resized);
    let img = wrap.querySelector('img');
    if (img) {
        img.src = resized;
    } else {
        const placeholder = wrap.querySelector('div.text-xs');
        if (placeholder) placeholder.remove();
        const newImg = document.createElement('img');
        newImg.src = resized;
        newImg.style.cssText = 'max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0;display:block;margin-bottom:6px';
        const fileInput = wrap.querySelector('input[type="file"]');
        wrap.insertBefore(newImg, fileInput);
    }
}

async function cambiaFotoOccorrente(inputEl, idx) {
    const file = inputEl?.files && inputEl.files[0];
    if (!file) return;
    await _handleImageUpload(file, function(resized) {
        const item = document.querySelector(`.occorrente-item[data-item-idx="${idx}"]`);
        if (item) _setFotoOnWrap(item, resized);
    });
}

async function cambiaFotoProcedimento(inputEl, idx) {
    const file = inputEl?.files && inputEl.files[0];
    if (!file) return;
    await _handleImageUpload(file, function(resized) {
        const step = document.querySelector(`.proc-step[data-step-idx="${idx}"]`);
        if (step) _setFotoOnWrap(step, resized);
    });
}

async function cambiaFotoDisegno(inputEl) {
    const file = inputEl?.files && inputEl.files[0];
    if (!file) return;
    await _handleImageUpload(file, function(resized) {
        const wrap = document.getElementById('manuali-disegno-wrap');
        if (wrap) _setFotoOnWrap(wrap, resized);
    });
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
    _renderModalForm('edit', m);
}

function chiudiFormManuale() {
    const modal = document.getElementById('manuali-modal');
    if (modal && modal.parentElement) modal.parentElement.innerHTML = '';
    _activeModalId = null;
}

// ─── CRUD sezioni ────────────────────────────────────────────────────────────────

function _reindexSection(containerSel, itemSel, attrName, removeFn, reindexFileOnchange) {
    const root = document.querySelector(containerSel);
    if (!root) return;
    root.querySelectorAll(itemSel).forEach(function(el, i) {
        el.setAttribute(attrName, String(i));
        const del = el.querySelector('button');
        if (del) del.setAttribute('onclick', `${removeFn}(${i})`);
        if (reindexFileOnchange) {
            const inp = el.querySelector('input[type="file"]');
            if (inp) inp.setAttribute('onchange', `${reindexFileOnchange}(this, ${i})`);
        }
    });
}

function aggiungiSchedaRow() {
    const root = document.getElementById('manuali-scheda-edit');
    if (!root) return;
    const count = root.querySelectorAll('.scheda-row').length;
    if (count >= MAX_SCHEDA_ROWS) { notificaElegante('Numero massimo voci raggiunto.', 'warning'); return; }
    root.insertAdjacentHTML('beforeend', _makeSchedaRowCustom('', '', count));
}

function rimuoviSchedaRow(idx) {
    const row = document.querySelector(`.scheda-row[data-row-idx="${idx}"]`);
    if (row) row.remove();
    _reindexSection('#manuali-scheda-edit', '.scheda-row', 'data-row-idx', 'rimuoviSchedaRow', null);
}

function aggiungiOccorrenteItem() {
    const root = document.getElementById('manuali-occorrente-edit');
    if (!root) return;
    const count = root.querySelectorAll('.occorrente-item').length;
    if (count >= MAX_OCCORRENTE) { notificaElegante('Numero massimo elementi raggiunto.', 'warning'); return; }
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    root.insertAdjacentHTML('beforeend', _makeOccorrenteItem({ lettera: letters[count] || '', nome: '', codice: '', foto: '' }, count));
}

function rimuoviOccorrenteItem(idx) {
    const item = document.querySelector(`.occorrente-item[data-item-idx="${idx}"]`);
    if (item) item.remove();
    _reindexSection('#manuali-occorrente-edit', '.occorrente-item', 'data-item-idx', 'rimuoviOccorrenteItem', 'cambiaFotoOccorrente');
}

function aggiungiProcStep() {
    const root = document.getElementById('manuali-proc-edit');
    if (!root) return;
    const count = root.querySelectorAll('.proc-step').length;
    if (count >= MAX_PROC_STEPS) { notificaElegante('Numero massimo step raggiunto.', 'warning'); return; }
    root.insertAdjacentHTML('beforeend', _makeProcStep(null, count));
}

function rimuoviProcStep(idx) {
    const step = document.querySelector(`.proc-step[data-step-idx="${idx}"]`);
    if (step) step.remove();
    const root = document.getElementById('manuali-proc-edit');
    if (!root) return;
    root.querySelectorAll('.proc-step').forEach(function(el, i) {
        el.setAttribute('data-step-idx', String(i));
        const title = el.querySelector('h4');
        if (title) title.textContent = 'Step ' + (i + 1);
        const del = el.querySelector('button');
        if (del) del.setAttribute('onclick', `rimuoviProcStep(${i})`);
        const inp = el.querySelector('input[type="file"]');
        if (inp) inp.setAttribute('onchange', `cambiaFotoProcedimento(this, ${i})`);
    });
}

async function salvaManualeCorrente() {
    const titolo = String(document.getElementById('manuali-titolo')?.value || '').trim();
    const categoria = String(document.getElementById('manuali-categoria')?.value || '').trim();
    const copertina = String(document.getElementById('manuali-copertina-wrap')?.getAttribute('data-copertina') || '').trim();
    const sections = _collectSectionsFromDom();

    if (!titolo) {
        notificaElegante('Inserisci un titolo manuale.', 'warning');
        return;
    }

    try {
        notificaElegante('Salvataggio manuale in corso...', 'info');
        let res;
        if (_activeModalId) {
            res = await updateManuale({ id: _activeModalId, titolo: titolo, categoria: categoria, copertina: copertina, sections: sections });
        } else {
            res = await createManuale({ titolo: titolo, categoria: categoria, copertina: copertina, sections: sections });
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

    const host = document.getElementById('manuali-modal-host');
    if (!host) return;

    const coverDetail = _safeImgSrc(m.copertina);
    const coverHtml = coverDetail
        ? `<img src="${coverDetail}" alt="copertina" style="max-width:100%;max-height:260px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:16px">`
        : '';

    const secLabel = (icon, label) =>
        `<h3 style="font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#64748b;margin:18px 0 8px;padding-bottom:6px;border-bottom:2px solid #e2e8f0"><i class="${icon}"></i> &nbsp;${label}</h3>`;

    const sections = _getSections(m);
    let contentHtml = '';

    if (sections) {
        // ── Scheda Tecnica ──
        const schedaRows = (sections.schedaTecnica || []).map(function(r) {
            return `<tr>
                <td style="padding:7px 10px;font-weight:500;color:#334155;border-bottom:1px solid #f1f5f9">${_esc(r.voce || '')}</td>
                <td style="padding:7px 10px;color:#64748b;border-bottom:1px solid #f1f5f9">${_esc(r.valore || '')}</td>
            </tr>`;
        }).join('');
        if (schedaRows) {
            contentHtml += secLabel('fas fa-table', 'Scheda Tecnica') + `
            <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
                <thead><tr style="background:#f8fafc">
                    <th style="padding:7px 10px;text-align:left;font-size:.75rem;color:#94a3b8;font-weight:600">Caratteristica</th>
                    <th style="padding:7px 10px;text-align:left;font-size:.75rem;color:#94a3b8;font-weight:600">Valore</th>
                </tr></thead>
                <tbody>${schedaRows}</tbody>
            </table>`;
        }

        // ── Occorrente ──
        const occItems = (sections.occorrente || []).map(function(o) {
            const fotoSafe = _safeImgSrc(o.foto || '');
            return `<div style="padding:10px;border:1px solid #e2e8f0;border-radius:10px;background:#fff">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:${fotoSafe ? '8px' : '0'}">
                    <span style="min-width:28px;height:28px;border-radius:50%;background:#1e293b;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem">${_esc(o.lettera || '')}</span>
                    <div>
                        <strong class="text-sm">${_esc(o.nome || '')}</strong>
                        ${o.codice ? `<br><span class="text-xs text-slate-400">${_esc(o.codice)}</span>` : ''}
                    </div>
                </div>
                ${fotoSafe ? `<img src="${fotoSafe}" alt="occ" style="max-width:100%;max-height:140px;border-radius:8px;border:1px solid #e2e8f0">` : ''}
            </div>`;
        }).join('');
        if (occItems) {
            contentHtml += secLabel('fas fa-boxes-stacked', 'Materiale Occorrente') +
                `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">${occItems}</div>`;
        }

        // ── Procedimento ──
        const procHtml = (sections.procedimenti || []).map(function(p, i) {
            const fotoSafe = _safeImgSrc(p.foto || '');
            return `<details class="border border-slate-200 rounded-xl p-3 bg-white" ${i === 0 ? 'open' : ''}>
                <summary class="cursor-pointer font-semibold text-slate-800">Step ${i + 1}</summary>
                <div class="mt-2 grid gap-2">
                    ${fotoSafe ? `<img src="${fotoSafe}" alt="step-${i + 1}" style="max-width:100%;border-radius:10px;border:1px solid #e2e8f0">` : ''}
                    <p class="text-sm text-slate-700">${_esc(p.descrizione || '-')}</p>
                </div>
            </details>`;
        }).join('');
        if (procHtml) {
            contentHtml += secLabel('fas fa-list-check', 'Procedimento') +
                `<div class="grid gap-2">${procHtml}</div>`;
        }

        // ── Disegno Tecnico ──
        const dtFoto = _safeImgSrc(sections.disegnoTecnico?.foto || '');
        if (dtFoto) {
            contentHtml += secLabel('fas fa-drafting-compass', 'Disegno Tecnico') +
                `<img src="${dtFoto}" alt="disegno-tecnico" style="max-width:100%;border-radius:10px;border:1px solid #e2e8f0">`;
        }

    } else {
        // ── Retrocompatibilità v1 ──
        contentHtml = (m.steps || []).map(function(step, idx) {
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
    }

    host.innerHTML = `
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
      <div class="modal-content" style="max-width:920px;max-height:90vh;overflow:auto;">
        <h2>${_esc(m.titolo || '(Senza titolo)')}</h2>
        <p class="text-xs text-slate-500 mb-3">${_esc(m.categoria || 'Generale')} · v${Number(m.version || 1)} · aggiornato ${_esc(_formatTs(m.updatedAt))}</p>
        ${coverHtml}
        <div>${contentHtml || '<div class="empty-msg">Nessun contenuto disponibile.</div>'}</div>
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
    // Scheda Tecnica
    window.aggiungiSchedaRow = aggiungiSchedaRow;
    window.rimuoviSchedaRow = rimuoviSchedaRow;
    // Occorrente
    window.aggiungiOccorrenteItem = aggiungiOccorrenteItem;
    window.rimuoviOccorrenteItem = rimuoviOccorrenteItem;
    window.cambiaFotoOccorrente = cambiaFotoOccorrente;
    // Procedimento
    window.aggiungiProcStep = aggiungiProcStep;
    window.rimuoviProcStep = rimuoviProcStep;
    window.cambiaFotoProcedimento = cambiaFotoProcedimento;
    // Disegno Tecnico
    window.cambiaFotoDisegno = cambiaFotoDisegno;
    // Copertina
    window.cambiaCopertina = cambiaCopertina;
    // Salva
    window.salvaManualeCorrente = salvaManualeCorrente;
    // Storico
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
