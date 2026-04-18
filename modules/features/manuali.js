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
import { utenteAttuale } from '../core/session.js';

const CACHE_KEY = 'MANUALI_PRODOTTI';
const MAX_PROC_STEPS = 20;
const MAX_SCHEDA_ROWS = 30;
const MAX_OCCORRENTE = 20;
const MAX_IMG_DATA_LEN = 4_000_000;

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
let _occLightboxItems = []; // foto items per lightbox occorrente
let _pptxPendingSlides = []; // slide estratte dal PPTX in attesa di conferma

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

function _imgPreviewHtml(src, alt, deleteFnStr) {
    if (src) {
        const xBtn = deleteFnStr
            ? `<button type="button" onclick="${deleteFnStr}" title="Rimuovi foto" style="position:absolute;top:-7px;right:-7px;background:#ef4444;border:none;color:#fff;width:22px;height:22px;border-radius:50%;font-size:1.1rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3)">&times;</button>`
            : '';
        return `<div class="foto-wrapper" style="position:relative;display:inline-block;max-width:100%;margin-bottom:6px"><img src="${src}" alt="${alt}" style="max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0;display:block">${xBtn}</div>`;
    }
    return `<div class="text-xs text-slate-400" style="margin-bottom:6px">Nessuna foto</div>`;
}

function _fileInputHtml(onchange) {
    return `
    <input type="file" class="manuale-file-input" accept="image/*" onchange="${onchange}">
    <label class="manuale-file-label" onclick="this.previousElementSibling.click()"><i class="fas fa-upload"></i> Carica foto</label>`;
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
    const _isAlessio = utenteAttuale?.nome?.toUpperCase().trim() === 'ALESSIO';
    contenitore.innerHTML = `
    <section class="manuali-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title">Manuali Prodotti</h3>
                <p class="acquisti-subtitle">Procedure operative interne con step fotografici</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                ${_isAlessio ? `<button type="button" onclick="importaPptx()" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;white-space:nowrap;line-height:1.2">
                    <i class="fas fa-file-powerpoint"></i><span class="btn-label-nuovo"> Importa PPTX</span>
                </button>` : ''}
                <button type="button" class="btn-nuovo-fisso ${window.TW?.btnPrimaryLg || ''}" onclick="apriFormManuale()">
                    <i class="fas fa-plus"></i><span class="btn-label-nuovo"> Nuovo manuale</span>
                </button>
            </div>
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
        ${_imgPreviewHtml(foto, `occ-${idx}`, 'eliminaFotoOccorrente(this)')}
        ${_fileInputHtml(`cambiaFotoOccorrente(this, ${idx})`)}
    </div>`;
}

function _makeProcStep(proc, idx) {
    const foto  = _safeImgSrc((proc && proc.foto)  || '');
    const foto2 = _safeImgSrc((proc && proc.foto2) || '');
    return `
    <div class="proc-step border border-slate-200 rounded-xl p-3 bg-white" data-step-idx="${idx}">
        <div class="flex items-center justify-between" style="margin-bottom:8px">
            <h4 class="text-sm font-semibold text-slate-800">Step ${idx + 1}</h4>
            <button type="button" class="${window.TW?.btnDanger || ''}" onclick="rimuoviProcStep(${idx})"><i class="fas fa-trash"></i></button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px">
            <div class="proc-foto-slot" data-slot="1"${foto ? ` data-foto="${_esc(foto)}"` : ''}>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:3px">Foto 1</div>
                ${_imgPreviewHtml(foto, `proc-${idx}-1`, 'eliminaFotoProcedimento(this)')}
                ${_fileInputHtml(`cambiaFotoProcedimento(this,${idx},1)`)}
            </div>
            <div class="proc-foto-slot" data-slot="2"${foto2 ? ` data-foto="${_esc(foto2)}"` : ''}>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:3px">Foto 2 <span style="opacity:.6">(opzionale)</span></div>
                ${_imgPreviewHtml(foto2, `proc-${idx}-2`, 'eliminaFotoProcedimento(this)')}
                ${_fileInputHtml(`cambiaFotoProcedimento(this,${idx},2)`)}
            </div>
        </div>
        <textarea class="input-field-modern" data-field="descrizione" rows="3" placeholder="Descrizione del passaggio...">${_esc((proc && proc.descrizione) || '')}</textarea>
    </div>`;
}

function _makeDisegnoSection(foto) {
    const safe = _safeImgSrc(foto || '');
    return `
    <div id="manuali-disegno-wrap"${safe ? ` data-foto="${_esc(safe)}"` : ''} class="border border-slate-200 rounded-xl p-3 bg-white">
        ${_imgPreviewHtml(safe, 'disegno-tecnico', 'eliminaFotoDisegno(this)')}
        ${_fileInputHtml('cambiaFotoDisegno(this)')}
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
      <div class="modal-content" style="width:90vw;max-width:1280px;max-height:90vh;overflow-y:auto;">
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
            ${_fileInputHtml('cambiaCopertina(this)')}
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
        const slot1 = step.querySelector('.proc-foto-slot[data-slot="1"]');
        const slot2 = step.querySelector('.proc-foto-slot[data-slot="2"]');
        // fallback a data-foto sul wrapper per retrocompatibilità
        const foto  = String(slot1?.getAttribute('data-foto') || step.getAttribute('data-foto') || '').trim();
        const foto2 = String(slot2?.getAttribute('data-foto') || '').trim();
        if (descrizione || foto || foto2) procedimenti.push({ descrizione, foto, foto2 });
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

async function _resizeFotoBase64(base64, maxPx = 1200) {
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
            resolve(canvas.toDataURL('image/jpeg', 0.80));
        };
        img.onerror = function() { resolve(base64); };
        img.src = base64;
    });
}

// Crop center-square + resize for PPTX import
async function _cropSquareAndResize(base64, maxPx = 800) {
    return new Promise(function(resolve) {
        const img = new Image();
        img.onload = function() {
            const side = Math.min(img.width, img.height);
            const sx = Math.round((img.width - side) / 2);
            const sy = Math.round((img.height - side) / 2);
            const outSide = Math.min(side, maxPx);
            const canvas = document.createElement('canvas');
            canvas.width = outSide;
            canvas.height = outSide;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(base64);
            ctx.drawImage(img, sx, sy, side, side, 0, 0, outSide, outSide);
            resolve(canvas.toDataURL('image/jpeg', 0.80));
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
        const resized = await _resizeFotoBase64(b64, 800);
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
            newImg.style.cssText = 'max-width:100%;max-height:200px;border-radius:10px;border:1px solid #e2e8f0;display:block;margin-bottom:6px';
            wrap.insertBefore(newImg, wrap.firstChild);
        }
    } catch (_) {
        notificaElegante('Errore nel caricamento immagine di copertina.', 'error');
    }
}

async function _handleImageUpload(file, onSuccess) {
    try {
        const b64 = await _toBase64(file);
        const resized = await _resizeFotoBase64(b64, 800);
        if (!resized || resized.length > MAX_IMG_DATA_LEN) {
            notificaElegante('Immagine troppo grande, riduci la risoluzione.', 'warning');
            return;
        }
        onSuccess(resized);
    } catch (_) {
        notificaElegante('Errore nel caricamento immagine.', 'error');
    }
}

function _setFotoOnWrap(wrap, resized, deleteFnStr) {
    wrap.setAttribute('data-foto', resized);
    const existing = wrap.querySelector('.foto-wrapper');
    if (existing) {
        existing.querySelector('img').src = resized;
        return;
    }
    let img = wrap.querySelector('img');
    if (img) {
        img.src = resized;
        return;
    }
    const placeholder = wrap.querySelector('div.text-xs');
    if (placeholder) placeholder.remove();
    const fotoDiv = document.createElement('div');
    fotoDiv.className = 'foto-wrapper';
    fotoDiv.style.cssText = 'position:relative;display:inline-block;max-width:100%;margin-bottom:6px';
    const newImg = document.createElement('img');
    newImg.src = resized;
    newImg.style.cssText = 'max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0;display:block';
    fotoDiv.appendChild(newImg);
    if (deleteFnStr) {
        fotoDiv.insertAdjacentHTML('beforeend', `<button type="button" onclick="${deleteFnStr}" title="Rimuovi foto" style="position:absolute;top:-7px;right:-7px;background:#ef4444;border:none;color:#fff;width:22px;height:22px;border-radius:50%;font-size:1.1rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3)">&times;</button>`);
    }
    const anchor = wrap.querySelector('.manuale-file-input') || wrap.querySelector('input[type="file"]');
    wrap.insertBefore(fotoDiv, anchor);
}

function _clearFotoOnWrap(wrap) {
    wrap.removeAttribute('data-foto');
    const fotoWrapper = wrap.querySelector('.foto-wrapper');
    if (fotoWrapper) {
        const placeholder = document.createElement('div');
        placeholder.className = 'text-xs text-slate-400';
        placeholder.style.marginBottom = '6px';
        placeholder.textContent = 'Nessuna foto';
        fotoWrapper.replaceWith(placeholder);
    }
}

async function cambiaFotoOccorrente(inputEl, idx) {
    const file = inputEl?.files && inputEl.files[0];
    if (!file) return;
    await _handleImageUpload(file, function(resized) {
        const item = document.querySelector(`.occorrente-item[data-item-idx="${idx}"]`);
        if (item) _setFotoOnWrap(item, resized, 'eliminaFotoOccorrente(this)');
    });
}

async function cambiaFotoProcedimento(inputEl, idx, slot) {
    const file = inputEl?.files && inputEl.files[0];
    if (!file) return;
    await _handleImageUpload(file, function(resized) {
        const step = document.querySelector(`.proc-step[data-step-idx="${idx}"]`);
        if (!step) return;
        const slotEl = step.querySelector(`.proc-foto-slot[data-slot="${slot || 1}"]`) || step;
        _setFotoOnWrap(slotEl, resized, 'eliminaFotoProcedimento(this)');
    });
}

async function cambiaFotoDisegno(inputEl) {
    const file = inputEl?.files && inputEl.files[0];
    if (!file) return;
    await _handleImageUpload(file, function(resized) {
        const wrap = document.getElementById('manuali-disegno-wrap');
        if (wrap) _setFotoOnWrap(wrap, resized, 'eliminaFotoDisegno(this)');
    });
}

function eliminaFotoOccorrente(btn) {
    _chiediConferma('Rimuovere la foto da questo elemento?', function() {
        const wrap = btn.closest('.occorrente-item');
        if (wrap) _clearFotoOnWrap(wrap);
    });
}

function eliminaFotoProcedimento(btn) {
    _chiediConferma('Rimuovere la foto da questo step?', function() {
        // Preferisce il .proc-foto-slot, fallback al .proc-step per retrocompatibilità
        const wrap = btn.closest('.proc-foto-slot') || btn.closest('.proc-step');
        if (wrap) _clearFotoOnWrap(wrap);
    });
}

function eliminaFotoDisegno(btn) {
    _chiediConferma('Rimuovere la foto del disegno tecnico?', function() {
        const wrap = document.getElementById('manuali-disegno-wrap');
        if (wrap) _clearFotoOnWrap(wrap);
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

function _chiediConferma(messaggio, onConferma) {
    const existing = document.getElementById('manuali-confirm-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'manuali-confirm-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:11000;display:flex;align-items:center;justify-content:center';
    overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:28px 32px;max-width:380px;width:90%;box-shadow:0 20px 40px rgba(0,0,0,0.18);text-align:center">
        <div style="font-size:2rem;margin-bottom:12px">🗑️</div>
        <p style="font-size:.95rem;font-weight:600;color:#1e293b;margin-bottom:20px">${messaggio}</p>
        <div style="display:flex;gap:10px;justify-content:center">
            <button id="manuali-confirm-no" class="btn-modal-cancel" style="min-width:100px">Annulla</button>
            <button id="manuali-confirm-si" class="btn-modal-send" style="min-width:100px;background:#ef4444">Elimina</button>
        </div>
    </div>`;
    document.body.appendChild(overlay);
    document.getElementById('manuali-confirm-no').onclick = function() { overlay.remove(); };
    document.getElementById('manuali-confirm-si').onclick = function() { overlay.remove(); onConferma(); };
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

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
    _chiediConferma('Eliminare questa voce dalla scheda tecnica?', function() {
        const row = document.querySelector(`.scheda-row[data-row-idx="${idx}"]`);
        if (row) row.remove();
        _reindexSection('#manuali-scheda-edit', '.scheda-row', 'data-row-idx', 'rimuoviSchedaRow', null);
    });
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
    _chiediConferma('Eliminare questo elemento dal materiale occorrente?', function() {
        const item = document.querySelector(`.occorrente-item[data-item-idx="${idx}"]`);
        if (item) item.remove();
        _reindexSection('#manuali-occorrente-edit', '.occorrente-item', 'data-item-idx', 'rimuoviOccorrenteItem', 'cambiaFotoOccorrente');
    });
}

function aggiungiProcStep() {
    const root = document.getElementById('manuali-proc-edit');
    if (!root) return;
    const count = root.querySelectorAll('.proc-step').length;
    if (count >= MAX_PROC_STEPS) { notificaElegante('Numero massimo step raggiunto.', 'warning'); return; }
    root.insertAdjacentHTML('beforeend', _makeProcStep(null, count));
}

function rimuoviProcStep(idx) {
    _chiediConferma('Eliminare questo step del procedimento?', function() {
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
        _occLightboxItems = [];
        const occItems = (sections.occorrente || []).map(function(o) {
            const fotoSafe = _safeImgSrc(o.foto || '');
            let photoIdx = -1;
            if (fotoSafe) {
                _occLightboxItems.push({ lettera: o.lettera || '', nome: o.nome || '', foto: fotoSafe });
                photoIdx = _occLightboxItems.length - 1;
            }
            const clickOpen = fotoSafe ? `onclick="_apriLightboxOcc_(${photoIdx})"` : '';
            const cardStyle = `padding:10px;border:1px solid #e2e8f0;border-radius:10px;background:#fff${fotoSafe ? ';cursor:pointer' : ''}`;
            return `<div ${clickOpen} style="${cardStyle}">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:${fotoSafe ? '8px' : '0'}">
                    <span style="min-width:28px;height:28px;border-radius:50%;background:#1e293b;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem">${_esc(o.lettera || '')}</span>
                    <div>
                        <strong class="text-sm">${_esc(o.nome || '')}</strong>
                        ${o.codice ? `<br><span class="text-xs text-slate-400">${_esc(o.codice)}</span>` : ''}
                    </div>
                </div>
                ${fotoSafe ? `<img src="${fotoSafe}" alt="occ" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;pointer-events:none">` : ''}
            </div>`;
        }).join('');
        if (occItems) {
            contentHtml += secLabel('fas fa-boxes-stacked', 'Materiale Occorrente') +
                `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">${occItems}</div>`;
        }

        // ── Procedimento ──
        const procHtml = (sections.procedimenti || []).map(function(p, i) {
            const fotoSafe  = _safeImgSrc(p.foto  || '');
            const foto2Safe = _safeImgSrc(p.foto2 || '');
            const fotos = [fotoSafe, foto2Safe].filter(Boolean);
            const imgsHtml = fotos.length
                ? `<div style="display:grid;grid-template-columns:repeat(${fotos.length},1fr);gap:6px;margin-bottom:6px">${
                    fotos.map(src => `<img src="${src}" style="width:100%;border-radius:10px;border:1px solid #e2e8f0">`).join('')
                  }</div>`
                : '';
            return `<details class="border border-slate-200 rounded-xl p-3 bg-white" ${i === 0 ? 'open' : ''}>
                <summary class="cursor-pointer font-semibold text-slate-800">Step ${i + 1}</summary>
                <div class="mt-2 grid gap-2">
                    ${imgsHtml}
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
      <div class="modal-content" style="width:90vw;max-width:1200px;max-height:90vh;overflow:auto;">
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

function _apriLightboxOcc_(startIdx) {
    const items = _occLightboxItems;
    if (!items.length) return;
    let cur = startIdx;

    function _chiudi() {
        const el = document.getElementById('_occ_lightbox');
        if (el) el.remove();
        document.removeEventListener('keydown', _kbHandler);
    }

    function _mostra(idx) {
        cur = idx;
        const item = items[idx];
        document.getElementById('_occ_lb_img').src = item.foto;
        document.getElementById('_occ_lb_badge').textContent = item.lettera;
        document.getElementById('_occ_lb_nome').textContent = item.nome;
        document.getElementById('_occ_lb_counter').textContent = items.length > 1 ? `${idx + 1} / ${items.length}` : '';
    }

    function _nav(dir) {
        _mostra((cur + dir + items.length) % items.length);
    }

    function _kbHandler(e) {
        if (e.key === 'ArrowLeft')  _nav(-1);
        else if (e.key === 'ArrowRight') _nav(1);
        else if (e.key === 'Escape')  _chiudi();
    }

    // Rimuovi lightbox esistente
    document.getElementById('_occ_lightbox')?.remove();
    if (window._occLbKeyHandler) document.removeEventListener('keydown', window._occLbKeyHandler);

    const multi = items.length > 1;
    const arrowBtn = 'background:rgba(255,255,255,.15);border:none;color:#fff;width:48px;height:48px;border-radius:50%;font-size:1.8rem;cursor:pointer;flex-shrink:0;line-height:1;display:flex;align-items:center;justify-content:center;';

    const overlay = document.createElement('div');
    overlay.id = '_occ_lightbox';
    overlay.style.cssText = 'position:fixed;z-index:99999;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center';
    overlay.innerHTML = `
      <button id="_occ_lb_close" style="position:absolute;top:14px;right:18px;background:none;border:none;color:#fff;font-size:2rem;line-height:1;cursor:pointer;opacity:.75;padding:4px 8px">&#10005;</button>
      <div style="display:flex;align-items:center;gap:12px;width:92vw;max-width:880px">
        <button id="_occ_lb_prev" style="${arrowBtn}${multi ? '' : 'visibility:hidden'}">&#8249;</button>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;min-width:0">
          <div style="display:flex;align-items:center;gap:10px">
            <span id="_occ_lb_badge" style="min-width:36px;height:36px;border-radius:50%;background:#fff;color:#1e293b;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem"></span>
            <span id="_occ_lb_nome" style="color:#fff;font-weight:600;font-size:1rem"></span>
          </div>
          <img id="_occ_lb_img" src="" alt="" style="max-width:100%;max-height:72vh;border-radius:12px;object-fit:contain">
          <span id="_occ_lb_counter" style="color:#94a3b8;font-size:.85rem"></span>
        </div>
        <button id="_occ_lb_next" style="${arrowBtn}${multi ? '' : 'visibility:hidden'}">&#8250;</button>
      </div>`;

    document.body.appendChild(overlay);

    document.getElementById('_occ_lb_close').addEventListener('click', _chiudi);
    document.getElementById('_occ_lb_prev').addEventListener('click', function() { _nav(-1); });
    document.getElementById('_occ_lb_next').addEventListener('click', function() { _nav(1); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) _chiudi(); });

    // Swipe touch
    let _tx = 0;
    overlay.addEventListener('touchstart', function(e) { _tx = e.changedTouches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', function(e) {
        const dx = e.changedTouches[0].clientX - _tx;
        if (Math.abs(dx) > 50) _nav(dx < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener('keydown', _kbHandler);
    window._occLbKeyHandler = _kbHandler;

    _mostra(startIdx);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PPTX IMPORT — parser ZIP/PPTX strutturato, client-side (no dipendenze npm)
// Classifica le slide per tipo e mappa su tutte le sezioni del manuale PROD:
//   slide titolo    → titolo + copertina
//   slide con tabella → scheda tecnica (voce | valore)
//   slide con A/B/C   → materiale occorrente (lettera + nome + foto)
//   altre slide       → step del procedimento (testo + foto)
// ═══════════════════════════════════════════════════════════════════════════════

function _pptxR16(d, o) { return d[o] | (d[o + 1] << 8); }
function _pptxR32(d, o) { return ((d[o] | (d[o+1] << 8) | (d[o+2] << 16) | (d[o+3] << 24)) >>> 0); }

async function _pptxInflate(compData) {
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    const reader = ds.readable.getReader();
    writer.write(compData);
    writer.close();
    const chunks = [];
    let total = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        total += value.length;
    }
    const out = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) { out.set(c, off); off += c.length; }
    return out;
}

async function _pptxUnzip(uint8) {
    let eocd = -1;
    const minScan = Math.max(0, uint8.length - 65558);
    for (let i = uint8.length - 22; i >= minScan; i--) {
        if (uint8[i] === 0x50 && uint8[i+1] === 0x4B && uint8[i+2] === 0x05 && uint8[i+3] === 0x06) {
            eocd = i; break;
        }
    }
    if (eocd < 0) throw new Error('File ZIP non valido (EOCD non trovato)');
    const cdCount  = _pptxR16(uint8, eocd + 10);
    const cdOffset = _pptxR32(uint8, eocd + 16);
    const files    = Object.create(null);
    const dec      = new TextDecoder('utf-8', { fatal: false });
    let pos        = cdOffset;
    for (let i = 0; i < cdCount; i++) {
        if (_pptxR32(uint8, pos) !== 0x02014B50) break;
        const compression = _pptxR16(uint8, pos + 10);
        const compSize    = _pptxR32(uint8, pos + 20);
        const fnLen       = _pptxR16(uint8, pos + 28);
        const extraLen    = _pptxR16(uint8, pos + 30);
        const commentLen  = _pptxR16(uint8, pos + 32);
        const localOff    = _pptxR32(uint8, pos + 42);
        const filename    = dec.decode(uint8.slice(pos + 46, pos + 46 + fnLen));
        pos += 46 + fnLen + extraLen + commentLen;
        if (filename.endsWith('/') || filename.endsWith('\\')) continue;
        const lFnLen    = _pptxR16(uint8, localOff + 26);
        const lExLen    = _pptxR16(uint8, localOff + 28);
        const dataStart = localOff + 30 + lFnLen + lExLen;
        const compData  = uint8.slice(dataStart, dataStart + compSize);
        if (compression === 0) {
            files[filename] = compData;
        } else if (compression === 8) {
            // eslint-disable-next-line no-await-in-loop
            files[filename] = await _pptxInflate(compData);
        }
    }
    return files;
}

const _PPTX_NS_DRAW   = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const _PPTX_NS_RELS_R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const _PPTX_NS_PRES   = 'http://schemas.openxmlformats.org/presentationml/2006/main';

function _pptxParseXml(uint8) {
    const s = new TextDecoder('utf-8', { fatal: false }).decode(uint8);
    return new DOMParser().parseFromString(s, 'text/xml');
}
function _pptxGetRels(doc) {
    return [...doc.getElementsByTagName('Relationship')].map(el => ({
        id:     el.getAttribute('Id')     || '',
        type:   el.getAttribute('Type')   || '',
        target: el.getAttribute('Target') || '',
    }));
}

function _pptxSlideOrder(files) {
    const presData = files['ppt/presentation.xml'];
    const relData  = files['ppt/_rels/presentation.xml.rels'];
    if (!presData || !relData) return null;
    const rIdMap = {};
    _pptxGetRels(_pptxParseXml(relData)).forEach(r => { rIdMap[r.id] = r.target; });
    const presDoc = _pptxParseXml(presData);
    let sldIds = [...presDoc.getElementsByTagNameNS(_PPTX_NS_PRES, 'sldId')];
    if (!sldIds.length) sldIds = [...presDoc.getElementsByTagName('p:sldId')];
    const paths = []; const seen = new Set();
    sldIds.forEach(el => {
        const rId    = el.getAttributeNS(_PPTX_NS_RELS_R, 'id') || el.getAttribute('r:id') || '';
        const target = rIdMap[rId];
        if (!target) return;
        const clean = 'ppt/' + target.replace(/^\.\.\//, '');
        if (!seen.has(clean)) { seen.add(clean); paths.push(clean); }
    });
    return paths.length ? paths : null;
}

// ─── Structured extraction helpers ───────────────────────────────────────────

const _PPTX_IMG_RE   = /\.(jpe?g|png|gif|webp)$/i;
const _PPTX_MIME_MAP = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif', webp:'image/webp' };

// Build rId → image target map from a .rels Uint8Array
function _pptxBuildRIdMap(relsData) {
    if (!relsData) return {};
    const map = {};
    _pptxGetRels(_pptxParseXml(relsData)).forEach(r => {
        if (r.type.includes('image')) map[r.id] = r.target;
    });
    return map;
}

// Convert media file bytes → base64 data URL
function _pptxMediaToDataUrl(target, files) {
    const fname = target.split('/').pop();
    if (!_PPTX_IMG_RE.test(fname)) return null;
    const data = files['ppt/media/' + fname];
    if (!data) return null;
    const mime = _PPTX_MIME_MAP[fname.split('.').pop().toLowerCase()];
    if (!mime) return null;
    let bin = '';
    for (let i = 0; i < data.length; i += 8192)
        bin += String.fromCharCode(...data.subarray(i, Math.min(i + 8192, data.length)));
    return `data:${mime};base64,${btoa(bin)}`;
}

// Get EMU offset position from an element's xfrm descendant
function _pptxGetEmuPos(el) {
    const off = el.getElementsByTagNameNS(_PPTX_NS_DRAW, 'off')[0]
             || el.getElementsByTagName('a:off')[0];
    if (!off) return { x: 0, y: 0 };
    return { x: parseInt(off.getAttribute('x') || '0', 10), y: parseInt(off.getAttribute('y') || '0', 10) };
}

// Return ALL images in a slide, sorted top→bottom, left→right
// excludeMedia: Set of media filenames to skip (logos/watermarks)
function _pptxGetSlideImages(slideDoc, rIdMap, files, excludeMedia) {
    let pics = [...slideDoc.getElementsByTagNameNS(_PPTX_NS_PRES, 'pic')];
    if (!pics.length) pics = [...slideDoc.getElementsByTagName('p:pic')];
    const result = [];
    for (const pic of pics) {
        const blip = pic.getElementsByTagNameNS(_PPTX_NS_DRAW, 'blip')[0]
                  || pic.getElementsByTagName('a:blip')[0];
        if (!blip) continue;
        const rId = blip.getAttributeNS(_PPTX_NS_RELS_R, 'embed') || blip.getAttribute('r:embed') || '';
        if (!rId || !rIdMap[rId]) continue;
        const target = rIdMap[rId];
        const mediaFile = target.split('/').pop();
        if (excludeMedia && excludeMedia.has(mediaFile)) continue;
        const dataUrl = _pptxMediaToDataUrl(target, files);
        if (!dataUrl) continue;
        const pos = _pptxGetEmuPos(pic);
        result.push({ dataUrl, x: pos.x, y: pos.y });
    }
    return result.sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
}

// Extract table rows [{voce, valore}] from slide, or null if no table
function _pptxGetSlideTable(slideDoc) {
    let tbls = [...slideDoc.getElementsByTagNameNS(_PPTX_NS_DRAW, 'tbl')];
    if (!tbls.length) tbls = [...slideDoc.getElementsByTagName('a:tbl')];
    if (!tbls.length) return null;
    let rows = [...tbls[0].getElementsByTagNameNS(_PPTX_NS_DRAW, 'tr')];
    if (!rows.length) rows = [...tbls[0].getElementsByTagName('a:tr')];
    const result = [];
    for (const row of rows) {
        let cells = [...row.getElementsByTagNameNS(_PPTX_NS_DRAW, 'tc')];
        if (!cells.length) cells = [...row.getElementsByTagName('a:tc')];
        if (cells.length < 2) continue;
        const cellText = (c) => {
            let ts = [...c.getElementsByTagNameNS(_PPTX_NS_DRAW, 't')];
            if (!ts.length) ts = [...c.getElementsByTagName('a:t')];
            return ts.map(t => (t.textContent || '').trim()).filter(Boolean).join(' ');
        };
        const voce = cellText(cells[0]);
        const valore = cellText(cells[1]);
        if (voce) result.push({ voce, valore: valore || '' });
    }
    return result.length >= 2 ? result : null;
}

// Text blocks with EMU position, sorted top→bottom
function _pptxGetTextBlocks(slideDoc) {
    let sps = [...slideDoc.getElementsByTagNameNS(_PPTX_NS_PRES, 'sp')];
    if (!sps.length) sps = [...slideDoc.getElementsByTagName('p:sp')];
    const blocks = [];
    for (const sp of sps) {
        let ts = [...sp.getElementsByTagNameNS(_PPTX_NS_DRAW, 't')];
        if (!ts.length) ts = [...sp.getElementsByTagName('a:t')];
        const text = ts.map(t => (t.textContent || '').trim()).filter(Boolean).join(' ').trim();
        if (!text) continue;
        const pos = _pptxGetEmuPos(sp);
        blocks.push({ text, x: pos.x, y: pos.y });
    }
    return blocks.sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
}

// Classify slide: 'intro' | 'title' | 'scheda' | 'occorrente' | 'procedimento' | 'disegno'
function _pptxClassifySlide(table, textBlocks, images, slideIdx, hasTitleAlready) {
    const allText = textBlocks.map(b => b.text).join(' ');
    // Disegno tecnico: keyword esplicito + almeno un'immagine
    if (/disegno\s+tecnico/i.test(allText) && images.length >= 1) return 'disegno';
    // Scheda tecnica: tabella con ≥2 righe
    if (table && table.length >= 2) return 'scheda';
    // Occorrente keyword esplicito ("MATERIALE OCCORRENTE")
    if (/materiale\s+occorrente/i.test(allText)) return 'occorrente';
    // Pattern lettere per occorrente  — escludi codici prodotto (es. "O-1") e header
    const _isProductCode = t => /^[A-Z]-?\d/.test(t);  // "O-1", "O1" ecc.
    const _isOccLetter = t => (/^[A-Z][\s\-–\.\:]/.test(t) || /^[A-Z]$/.test(t)) && !_isProductCode(t);
    const occBlocks = textBlocks.filter(b => _isOccLetter(b.text.trim()));
    // Titolo prodotto: prima slide con esattamente 1 immagine, testo corto, nessun pattern lettera
    if (!hasTitleAlready && slideIdx < 4 && images.length === 1 && !table
        && allText.length < 300 && occBlocks.length === 0) return 'title';
    // Intro/copertina generica: slide iniziale senza immagine e senza pattern lettera
    if (slideIdx < 3 && images.length === 0 && !table && occBlocks.length === 0) return 'intro';
    // Occorrente: ≥2 blocchi "A.", "B " ecc.
    if (occBlocks.length >= 2) return 'occorrente';
    if (occBlocks.length === 1 && /^[A-Z]$/.test(occBlocks[0].text.trim()) && images.length >= 1) return 'occorrente';
    return 'procedimento';
}

// Parse occorrente items from a slide, building on the shared `occorrente` array
function _pptxParseOccSlide(textBlocks, images, occorrente) {
    const occPat    = /^([A-Z])[\s\-–\.\:]*(.*)/s;
    const letBlocks = textBlocks.filter(b => /^[A-Z][\s\-–\.\:]|^[A-Z]$/.test(b.text.trim()));
    for (const block of letBlocks) {
        const m = block.text.trim().match(occPat);
        if (!m) continue;
        const letter = m[1];
        const rest   = (m[2] || '').trim();
        const parts  = rest.split(/\s{2,}|\s+[-–]\s+/);
        const nome   = (parts[0] || '').trim().slice(0, 80);
        const codice = (parts[1] || '').trim().slice(0, 40);
        const existing = occorrente.find(o => o.lettera === letter);
        if (existing) {
            if (!existing.nome && nome) existing.nome = nome;
            if (!existing.codice && codice) existing.codice = codice;
        } else {
            occorrente.push({ lettera: letter, nome, codice, foto: '' });
        }
    }
    if (!images.length) return;
    // Assign images to letter items by proximity
    if (images.length === 1 && letBlocks.length === 1) {
        const letter = letBlocks[0].text.trim()[0];
        const item = occorrente.find(o => o.lettera === letter);
        if (item && !item.foto) item.foto = images[0].dataUrl;
    } else {
        const sorted = [...letBlocks].sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
        images.forEach((img, i) => {
            if (i < sorted.length) {
                const letter = sorted[i].text.trim()[0];
                const item = occorrente.find(o => o.lettera === letter);
                if (item && !item.foto) item.foto = img.dataUrl;
            }
        });
    }
}

// Split a procedimento slide into individual steps: (testo + immagine) pairs
function _pptxSplitProceduralSlide(textBlocks, images) {
    // Filtra header/label all-caps (es. "MANUALE BRANDY GLASS", "PROCEDIMENTO", "O-1", "REVISIONE 2022")
    const stepBlocks = textBlocks.filter(b => {
        const t = b.text.trim();
        if (/^REVISIONE\s/i.test(t)) return false;
        if (/^\d+$/.test(t)) return false;                     // numeri di pagina
        if (/^[<>]$/.test(t)) return false;                    // frecce navigazione
        if (t === t.toUpperCase() && t.length < 60 && /^[A-Z\s\d\-:;./]+$/.test(t)) return false;
        return true;
    });
    // Combina testi e immagini ordinati per Y
    const all = [
        ...stepBlocks.map(b => ({ kind: 'text', y: b.y, x: b.x || 0, v: b.text })),
        ...images.map(img => ({ kind: 'img',  y: img.y, x: img.x || 0, v: img.dataUrl }))
    ].sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
    const steps = [];
    let descParts = [];
    let stepImgs  = [];
    function flushStep() {
        const desc = descParts.join(' ').trim();
        const img  = stepImgs[0] || null;
        const img2 = stepImgs[1] || null;
        if (desc || img) steps.push({ descrizione: desc, imageBase64: img, imageBase642: img2 });
        descParts = [];
        stepImgs  = [];
    }
    for (const item of all) {
        if (item.kind === 'text') {
            // Nuovo testo dopo immagini → chiudi step precedente
            if (stepImgs.length > 0) flushStep();
            descParts.push(item.v);
        } else {
            stepImgs.push(item.v);
        }
    }
    flushStep();
    // Fallback: se non si riesce a splittare, crea un unico step
    if (!steps.length) {
        const desc = textBlocks.map(b => b.text).join(' ').trim();
        const img  = images.length ? images[0].dataUrl : null;
        const img2 = images.length > 1 ? images[1].dataUrl : null;
        if (desc || img) steps.push({ descrizione: desc, imageBase64: img, imageBase642: img2 });
    }
    return steps;
}

// Main structured parser — returns {titolo, copertina, categoria, schedaTecnica[], occorrente[], procedimenti[], disegnoTecnico}
async function _parsePptxStructured(arrayBuffer) {
    const uint8 = new Uint8Array(arrayBuffer);
    const files = await _pptxUnzip(uint8);
    if (!files['ppt/presentation.xml']) throw new Error('File non valido: manca ppt/presentation.xml');
    let paths = _pptxSlideOrder(files);
    if (!paths || !paths.length) {
        paths = Object.keys(files)
            .filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k))
            .sort((a, b) => {
                const na = parseInt(a.match(/(\d+)\.xml$/)?.[1] || '0', 10);
                const nb = parseInt(b.match(/(\d+)\.xml$/)?.[1] || '0', 10);
                return na - nb;
            });
    }
    // ── Pre-scan: rileva immagini logo/watermark ricorrenti su più del 40% delle slide ──
    const _mediaCount = {};
    for (const p of paths) {
        const sf = p.split('/').pop();
        const rd = files[`ppt/slides/_rels/${sf}.rels`];
        if (!rd) continue;
        const seenHere = new Set();
        for (const r of _pptxGetRels(_pptxParseXml(rd))) {
            if (!r.type.includes('image')) continue;
            const mf = r.target.split('/').pop();
            if (!seenHere.has(mf)) { seenHere.add(mf); _mediaCount[mf] = (_mediaCount[mf] || 0) + 1; }
        }
    }
    const excludeMedia = new Set();
    const threshold = Math.max(2, Math.ceil(paths.length * 0.4));
    for (const [mf, cnt] of Object.entries(_mediaCount)) {
        if (cnt >= threshold) excludeMedia.add(mf);
    }
    // ── Parsing slide per slide ──
    let titolo = '';
    let categoria = '';
    let copertina = '';
    const schedaTecnica  = [];
    const occorrente     = [];
    const procedimenti   = [];
    let   disegnoTecnico = { foto: '' };
    for (let idx = 0; idx < paths.length; idx++) {
        const slideData = files[paths[idx]];
        if (!slideData) continue;
        const slideDoc  = _pptxParseXml(slideData);
        const slideFile = paths[idx].split('/').pop();
        const rIdMap    = _pptxBuildRIdMap(files[`ppt/slides/_rels/${slideFile}.rels`]);
        const table     = _pptxGetSlideTable(slideDoc);
        const textBlocks= _pptxGetTextBlocks(slideDoc);
        const images    = _pptxGetSlideImages(slideDoc, rIdMap, files, excludeMedia);
        const type      = _pptxClassifySlide(table, textBlocks, images, idx, !!titolo);
        if (type === 'intro') {
            // Slide generica senza immagine (es. copertina manuale aziendale) — skip
        } else if (type === 'title') {
            if (!copertina && images.length) copertina = images[0].dataUrl;
            if (!titolo && textBlocks.length) {
                const imgY = images.length ? images[0].y : Infinity;
                const candidates = textBlocks
                    .filter(b => b.y <= imgY && b.text.length > 3)
                    .filter(b => !/^[A-Z0-9\-]+$/.test(b.text))
                    .filter(b => !/^REVISIONE\s/i.test(b.text));
                if (candidates.length >= 2) {
                    // Prima riga = categoria (es. "LAMPADE A PICCHETTO"), ultima = titolo prodotto
                    categoria = candidates[0].text.slice(0, 80).trim();
                    titolo    = candidates[candidates.length - 1].text.slice(0, 120).trim();
                } else if (candidates.length === 1) {
                    titolo = candidates[0].text.slice(0, 120).trim();
                } else {
                    titolo = textBlocks[0].text.slice(0, 120).trim();
                }
            }
        } else if (type === 'scheda') {
            table.forEach(r => {
                if (!schedaTecnica.find(x => x.voce === r.voce)) schedaTecnica.push(r);
            });
        } else if (type === 'occorrente') {
            _pptxParseOccSlide(textBlocks, images, occorrente);
        } else if (type === 'disegno') {
            if (!disegnoTecnico.foto && images.length) disegnoTecnico = { foto: images[0].dataUrl };
        } else {
            const steps = _pptxSplitProceduralSlide(textBlocks, images);
            for (const s of steps) {
                if (s.descrizione || s.imageBase64) procedimenti.push(s);
            }
        }
    }
    return { titolo, categoria, copertina, schedaTecnica, occorrente, procedimenti, disegnoTecnico };
}

// ─── UI: flusso import PPTX ──────────────────────────────────────────────────

function importaPptx() {
    if (utenteAttuale?.nome?.toUpperCase().trim() !== 'ALESSIO') return;
    let inp = document.getElementById('_pptx-file-inp');
    if (!inp) {
        inp = document.createElement('input');
        inp.type = 'file';
        inp.id = '_pptx-file-inp';
        inp.accept = '.pptx';
        inp.style.display = 'none';
        inp.addEventListener('change', function() { _onPptxSelected(inp); });
        document.body.appendChild(inp);
    }
    inp.value = '';
    inp.click();
}

async function _onPptxSelected(inputEl) {
    const file = inputEl?.files?.[0];
    if (!file) return;
    notificaElegante('Analisi PPTX in corso...', 'info');
    try {
        const buf    = await file.arrayBuffer();
        const result = await _parsePptxStructured(buf);
        const isEmpty = !result.titolo && !result.procedimenti.length
                     && !result.schedaTecnica.length && !result.occorrente.length;
        if (isEmpty) { notificaElegante('Nessun contenuto riconosciuto nel file.', 'warning'); return; }
        if (!result.titolo) result.titolo = file.name.replace(/\.pptx$/i, '').replace(/[-_]/g, ' ');
        _pptxPendingSlides = result;
        _mostraAnteprImportPptx(result);
    } catch (e) {
        console.error('[PPTX]', e);
        notificaElegante('Errore nel parsing PPTX: ' + (e?.message || 'file non valido'), 'error');
    }
}

function _mostraAnteprImportPptx(result) {
    const host = document.getElementById('manuali-modal-host');
    if (!host) return;

    const covHtml = result.copertina
        ? `<img src="${result.copertina}" style="width:80px;height:60px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;flex-shrink:0">`
        : `<div style="width:80px;height:60px;background:#f1f5f9;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#cbd5e1;font-size:10px;flex-shrink:0">nessuna</div>`;

    const schedaHtml = result.schedaTecnica.length
        ? result.schedaTecnica.slice(0, 6).map(r =>
            `<tr><td style="padding:3px 8px;color:#475569;font-size:11px;border-bottom:1px solid #f1f5f9">${_esc(r.voce)}</td><td style="padding:3px 8px;font-size:11px;color:#1e293b;border-bottom:1px solid #f1f5f9">${_esc(r.valore)}</td></tr>`
          ).join('') + (result.schedaTecnica.length > 6
            ? `<tr><td colspan="2" style="padding:3px 8px;color:#94a3b8;font-size:10px">+ altre ${result.schedaTecnica.length - 6} voci…</td></tr>` : '')
        : `<tr><td colspan="2" style="padding:6px 8px;color:#94a3b8;font-size:11px">Nessuna voce riconosciuta</td></tr>`;

    const occHtml = result.occorrente.length
        ? result.occorrente.slice(0, 8).map(o => {
            const thumb = o.foto
                ? `<img src="${o.foto}" style="width:36px;height:36px;object-fit:cover;border-radius:5px;border:1px solid #e2e8f0;flex-shrink:0">`
                : `<div style="width:36px;height:36px;background:#f1f5f9;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#94a3b8;flex-shrink:0">–</div>`;
            return `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f8fafc">
                <b style="font-size:13px;color:#3b82f6;flex-shrink:0;width:18px">${_esc(o.lettera)}</b>
                ${thumb}
                <span style="font-size:11px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${_esc(o.nome || '—')}</span>
                ${o.codice ? `<span style="font-size:10px;color:#94a3b8;flex-shrink:0">${_esc(o.codice)}</span>` : ''}
            </div>`;
          }).join('') + (result.occorrente.length > 8
            ? `<div style="font-size:10px;color:#94a3b8;padding:4px 0">+ altri ${result.occorrente.length - 8}…</div>` : '')
        : `<div style="font-size:11px;color:#94a3b8;padding:6px 0">Nessun componente riconosciuto</div>`;

    const procHtml = result.procedimenti.length
        ? result.procedimenti.slice(0, 4).map((p, i) => {
            const thumb = p.imageBase64
                ? `<img src="${p.imageBase64}" style="width:52px;height:40px;object-fit:cover;border-radius:5px;border:1px solid #e2e8f0;flex-shrink:0">`
                : `<div style="width:52px;height:40px;background:#f1f5f9;border-radius:5px;flex-shrink:0"></div>`;
            const desc = (p.descrizione || '').slice(0, 70) + ((p.descrizione || '').length > 70 ? '…' : '');
            return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f1f5f9">
                <span style="font-size:10px;color:#94a3b8;flex-shrink:0;width:18px">${i + 1}.</span>
                ${thumb}
                <span style="font-size:11px;color:#475569;overflow:hidden;min-width:0">${_esc(desc) || '<em style="color:#cbd5e1">nessun testo</em>'}</span>
            </div>`;
          }).join('') + (result.procedimenti.length > 4
            ? `<div style="font-size:10px;color:#94a3b8;padding:4px 0">+ altri ${result.procedimenti.length - 4} step…</div>` : '')
        : `<div style="font-size:11px;color:#94a3b8;padding:6px 0">Nessuno step riconosciuto</div>`;

    const sec = (icon, label, count) =>
        `<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:.72rem;font-weight:700;text-transform:uppercase;color:#64748b;letter-spacing:.04em">
            <i class="${icon}"></i> ${label}
            <span style="background:#e2e8f0;border-radius:99px;padding:1px 7px;font-size:10px">${count}</span>
         </div>`;
    const box = 'margin-bottom:12px;padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0';

    host.innerHTML = `
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
      <div class="modal-content" style="width:92vw;max-width:820px;max-height:90vh;overflow-y:auto">
        <h2 style="margin-bottom:4px;display:flex;align-items:center;gap:10px">
            <i class="fas fa-file-powerpoint" style="color:#7c3aed"></i> Anteprima PPTX
        </h2>
        <p style="font-size:.83rem;color:#64748b;margin-bottom:16px">Verifica il contenuto riconosciuto. Potrai modificare tutto nell'editor dopo l'importazione.</p>

        <div style="${box};display:flex;gap:14px;align-items:flex-start">
            ${covHtml}
            <div style="flex:1;min-width:0">
                <label class="modal-label">Titolo manuale *</label>
                <input id="pptx-titolo" class="input-field-modern" type="text" value="${_esc(result.titolo)}" placeholder="Inserisci titolo manuale">
                <label class="modal-label" style="margin-top:6px">Categoria</label>
                <input id="pptx-categoria" class="input-field-modern" type="text" value="${_esc(result.categoria || '')}" placeholder="Es. Lampade a Picchetto">
            </div>
        </div>

        <div style="${box}">
            ${sec('fas fa-table', 'Scheda Tecnica', result.schedaTecnica.length + ' voci')}
            <table style="width:100%;border-collapse:collapse">${schedaHtml}</table>
        </div>

        <div style="${box}">
            ${sec('fas fa-boxes-stacked', 'Materiale Occorrente', result.occorrente.length)}
            ${occHtml}
        </div>

        <div style="${box}">
            ${sec('fas fa-list-ol', 'Procedimento', result.procedimenti.length + ' step')}
            ${procHtml}
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
            <button class="btn-modal-cancel" onclick="chiudiFormManuale()">Annulla</button>
            <button id="pptx-btn-crea" class="btn-modal-ok" onclick="_confermImportPptx()">
                <i class="fas fa-arrow-right"></i> Apri nell'editor
            </button>
        </div>
      </div>
    </div>`;
}

async function _confermImportPptx() {
    const titolo = String(document.getElementById('pptx-titolo')?.value || '').trim();
    if (!titolo) { notificaElegante('Inserisci un titolo per il manuale.', 'warning'); return; }
    const categoriaEl = document.getElementById('pptx-categoria');
    const categoriaVal = String(categoriaEl?.value || '').trim();
    const btn = document.getElementById('pptx-btn-crea');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Elaborazione immagini…'; }

    const src = _pptxPendingSlides;
    if (!src || typeof src !== 'object' || Array.isArray(src)) {
        notificaElegante('Nessun risultato da importare.', 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-arrow-right"></i> Apri nell\'editor'; }
        return;
    }

    async function resizeIfNeeded(dataUrl) {
        if (!dataUrl) return '';
        try {
            const r = await _cropSquareAndResize(dataUrl, 800);
            return (r && r.length <= MAX_IMG_DATA_LEN) ? r : '';
        } catch (_) { return ''; }
    }

    const copertina = await resizeIfNeeded(src.copertina);

    const procedimenti = [];
    for (const p of (src.procedimenti || [])) {
        // eslint-disable-next-line no-await-in-loop
        const foto  = await resizeIfNeeded(p.imageBase64);
        // eslint-disable-next-line no-await-in-loop
        const foto2 = await resizeIfNeeded(p.imageBase642);
        procedimenti.push({ descrizione: p.descrizione || '', foto, foto2 });
    }

    const occorrente = [];
    for (const o of (src.occorrente || [])) {
        // eslint-disable-next-line no-await-in-loop
        const foto = await resizeIfNeeded(o.foto);
        occorrente.push({ lettera: o.lettera, nome: o.nome || '', codice: o.codice || '', foto });
    }

    const prefill = {
        titolo,
        categoria: categoriaVal,
        copertina,
        sections: {
            _v: 2,
            schedaTecnica: src.schedaTecnica || [],
            occorrente,
            procedimenti,
            disegnoTecnico: src.disegnoTecnico || { foto: '' },
        },
    };

    _pptxPendingSlides = [];
    _renderModalForm('new', prefill);
}

export function registerGlobals() {
    window.apriManuale = apriManuale;
    window._apriLightboxOcc_ = _apriLightboxOcc_;
    window.apriFormManuale = apriFormManuale;
    window.chiudiFormManuale = chiudiFormManuale;
    // Scheda Tecnica
    window.aggiungiSchedaRow = aggiungiSchedaRow;
    window.rimuoviSchedaRow = rimuoviSchedaRow;
    // Occorrente
    window.aggiungiOccorrenteItem = aggiungiOccorrenteItem;
    window.rimuoviOccorrenteItem = rimuoviOccorrenteItem;
    window.eliminaFotoOccorrente = eliminaFotoOccorrente;
    window.eliminaFotoProcedimento = eliminaFotoProcedimento;
    window.eliminaFotoDisegno = eliminaFotoDisegno;
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
    // Import PPTX (solo Alessio)
    window.importaPptx = importaPptx;
    window._confermImportPptx = _confermImportPptx;
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
