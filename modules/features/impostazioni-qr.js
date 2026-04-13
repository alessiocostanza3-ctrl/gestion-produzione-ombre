// PROD — Features / Impostazioni — QR Scanner & Postazioni
// Estratto da impostazioni.js

import { POSTAZIONI } from '../core/config.js';
import ProdCache from '../core/cache.js';
import { notificaElegante, mostraConferma, _esc } from '../core/ui.js';
import { lsCacheDel as _lsCacheDel } from '../core/ls-cache.js';

// ═══════════════════════════════════════════════════════════════════════════════
//  SEZIONE QR CODE — SCANSIONE POSTAZIONE
// ═══════════════════════════════════════════════════════════════════════════════

/** Array postazioni (sorgente dati). Salvato in localStorage. */
let _qrPostazioniArr = [];

/** Dizionario codice→postazione (usato dallo scanner). Ricostruito da _qrPostazioniArr. */
let QR_POSTAZIONI = {};

function _qrCaricaPostazioni() {
    try {
        const saved = localStorage.getItem('qrPostazioni');
        _qrPostazioniArr = saved ? JSON.parse(saved) : [...POSTAZIONI];
    } catch { _qrPostazioniArr = [...POSTAZIONI]; }
    _qrRicostruisciDict();
}
function _qrSalvaPostazioniLS() {
    try { localStorage.setItem('qrPostazioni', JSON.stringify(_qrPostazioniArr)); } catch {}
    _qrRicostruisciDict();
}
function _qrRicostruisciDict() {
    QR_POSTAZIONI = {};
    _qrPostazioniArr.forEach(p => { QR_POSTAZIONI[p.codice.toUpperCase()] = p; });
}

let _qrStream            = null;  // MediaStream attivo
let _qrAnimFrame         = null;  // requestAnimationFrame handle
let _qrPostazioneAttuale = null;
let _qrStatoScelto       = null;
let _qrOrdineSelezionato = null;

/** Rilevamento iOS PWA (standalone) */
function _isIosPwa() {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const standalone = window.navigator.standalone === true ||
                       window.matchMedia('(display-mode: standalone)').matches;
    return ios && standalone;
}

/** Apre il modale scanner QR e avvia la fotocamera posteriore. */
let _apriScannerQRLock = false;
async function apriScannerQR() {
    if (_apriScannerQRLock) return;
    _apriScannerQRLock = true;
    setTimeout(() => { _apriScannerQRLock = false; }, 800);

    const modal  = document.getElementById('modal-qr-scanner');
    const errDiv = document.getElementById('qr-error-msg');
    if (!modal) return;

    if (errDiv) errDiv.style.display = 'none';
    const mi = document.getElementById('qr-manual-input');
    if (mi) mi.value = '';

    // ── iOS PWA: usa input file per evitare ReplayKit / recording indicator ──
    if (_isIosPwa()) {
        const input = document.createElement('input');
        input.type    = 'file';
        input.accept  = 'image/*';
        input.capture = 'environment';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.onchange = () => {
            const file = input.files && input.files[0];
            document.body.removeChild(input);
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const img = new Image();
                img.onload = () => {
                    if (typeof jsQR === 'undefined') {
                        alert('⚠️ Libreria scanner non caricata. Usa il campo manuale.');
                        return;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width; canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
                    if (code && code.data) {
                        try { if (navigator.vibrate) navigator.vibrate(80); } catch {}
                        _processaQR(code.data.trim());
                    } else {
                        modal.style.display = 'flex';
                        modal.offsetHeight;
                        modal.classList.add('active');
                        if (errDiv) { errDiv.textContent = '⚠️ QR non riconosciuto nell\'immagine. Riprova o usa il campo manuale.'; errDiv.style.display = 'block'; }
                    }
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.oncancel = () => document.body.removeChild(input);
        input.click();
        return;
    }

    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');

    if (typeof jsQR === 'undefined') {
        if (errDiv) { errDiv.textContent = '⚠️ Libreria scanner non caricata. Usa il campo manuale.'; errDiv.style.display = 'block'; }
        return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (errDiv) { errDiv.textContent = '⚠️ Fotocamera non supportata da questo browser. Usa il campo manuale.'; errDiv.style.display = 'block'; }
        return;
    }
    try {
        if (!_qrStream || !_qrStream.active) {
            _qrStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
            try { localStorage.setItem('qrCameraGranted', '1'); } catch {}
        }
        const video = document.getElementById('qr-video');
        video.srcObject = _qrStream;
        await video.play();
        _avviaScansione();
    } catch (err) {
        let msg = '⚠️ Impossibile avviare la fotocamera.';
        if (err.name === 'NotAllowedError')  msg = '⚠️ Permesso fotocamera negato. Abilitalo dalle impostazioni del browser, poi riprova.';
        if (err.name === 'NotFoundError')    msg = '⚠️ Nessuna fotocamera trovata sul dispositivo.';
        if (err.name === 'NotReadableError') msg = '⚠️ Fotocamera occupata da un\'altra applicazione.';
        if (errDiv) { errDiv.textContent = msg; errDiv.style.display = 'block'; }
    }
}

/** Loop di scansione: legge ogni frame con jsQR. */
function _avviaScansione() {
    const video  = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');

    function scan() {
        if (!_qrStream) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width  = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
            if (code && code.data) {
                try { if (navigator.vibrate) navigator.vibrate(80); } catch {}
                _chiudiScannerQR();
                _processaQR(code.data.trim());
                return;
            }
        }
        _qrAnimFrame = requestAnimationFrame(scan);
    }
    _qrAnimFrame = requestAnimationFrame(scan);
}

/** Ferma la fotocamera (stoppa stream + cancelAnimationFrame) e chiude il modale scanner. */
function _chiudiScannerQR() {
    if (_qrAnimFrame) { cancelAnimationFrame(_qrAnimFrame); _qrAnimFrame = null; }
    // Stoppa tutti i track dello stream per rilasciare la fotocamera
    if (_qrStream) {
        _qrStream.getTracks().forEach(t => t.stop());
        _qrStream = null;
    }
    const video = document.getElementById('qr-video');
    if (video) { video.pause(); video.srcObject = null; }
    const modal = document.getElementById('modal-qr-scanner');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

/** Interpreta il codice QR scansionato. */
function _processaQR(codice) {
    if (!codice) return;
    const postazione = QR_POSTAZIONI[codice.toUpperCase()];
    if (!postazione) {
        notificaElegante('⚠️ QR non riconosciuto come postazione: ' + codice, 'error');
        return;
    }
    _qrPostazioneAttuale = { codice: codice.toUpperCase(), ...postazione };
    _apriModalePostazione();
}

/** Apre il modale di azione postazione (dopo QR riconosciuto). */
function _apriModalePostazione() {
    const post = _qrPostazioneAttuale;
    if (!post) return;

    _qrOrdineSelezionato = null;
    _qrStatoScelto       = null;

    document.getElementById('qr-badge-nome').textContent = post.icona + '  ' + post.nome;
    document.getElementById('qr-azione-domanda').textContent = post.domanda;

    const si = document.getElementById('qr-search-input');
    if (si) { si.value = ''; setTimeout(() => si.focus(), 350); }
    const dd = document.getElementById('qr-search-dropdown');
    if (dd) { dd.style.display = 'none'; dd.innerHTML = ''; }

    document.getElementById('qr-articoli-wrap').style.display = 'none';
    document.getElementById('qr-stato-wrap').style.display    = 'none';
    document.getElementById('btn-qr-conferma').disabled       = true;

    // Pre-carica cache ordini se vuota
    const _ordiniAutocompleteCache = window._ordiniAutocompleteCache || [];
    if (_ordiniAutocompleteCache.length === 0) {
        window.fetchJson('PROGRAMMA PRODUZIONE DEL MESE').then(dati => {
            const seen = new Set();
            window._ordiniAutocompleteCache = dati
                .filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE')
                .map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '', riferimento: r.riferimento || '' }))
                .filter(o => { if (!o.ordine || seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });
        }).catch(() => {});
    }

    const modal = document.getElementById('modal-qr-azione');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

/** Chiude il modale azione postazione. */
function _chiudiModaleQRAzione() {
    const modal = document.getElementById('modal-qr-azione');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
    _qrPostazioneAttuale = null;
    _qrOrdineSelezionato = null;
    _qrStatoScelto       = null;
}

/** Filtra gli ordini nel dropdown mentre l'utente digita. */
function _qrFiltroOrdini(q) {
    const dropdown = document.getElementById('qr-search-dropdown');
    if (!dropdown) return;
    const query = (q || '').trim().toLowerCase();

    document.getElementById('qr-articoli-wrap').style.display = 'none';
    document.getElementById('qr-stato-wrap').style.display    = 'none';
    document.getElementById('btn-qr-conferma').disabled       = true;
    _qrOrdineSelezionato = null;
    _qrStatoScelto       = null;

    if (!query) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }

    const _ordiniAutocompleteCache = window._ordiniAutocompleteCache || [];
    const matches = _ordiniAutocompleteCache.filter(o =>
        o.ordine.toLowerCase().includes(query) ||
        o.cliente.toLowerCase().includes(query) ||
        (o.riferimento || '').toLowerCase().includes(query)
    ).slice(0, 8);

    if (matches.length === 0) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }

    dropdown.innerHTML = matches.map(o => `
        <div class="autocomplete-item"
             onmousedown="event.preventDefault(); _qrSelezionaOrdine('${o.ordine.replace(/'/g,"\\'")}','${o.cliente.replace(/'/g,"\\'")}')"
             ontouchend="event.preventDefault(); _qrSelezionaOrdine('${o.ordine.replace(/'/g,"\\'")}','${o.cliente.replace(/'/g,"\\'")}')">
            <span class="ac-ordine">ORD. ${_esc(o.ordine)}</span>
            <span class="ac-cliente">${_esc(o.cliente)}${o.riferimento ? ' <em style="color:#94a3b8;font-size:11px">('+_esc(o.riferimento)+')</em>' : ''}</span>
        </div>`).join('');
    dropdown.style.display = 'block';
}

/** Seleziona un ordine dal dropdown e mostra i suoi articoli. */
async function _qrSelezionaOrdine(nOrd, cliente) {
    const si = document.getElementById('qr-search-input');
    if (si) si.value = `ORD. ${nOrd} — ${cliente}`;
    const dd = document.getElementById('qr-search-dropdown');
    if (dd) { dd.style.display = 'none'; dd.innerHTML = ''; }

    _qrOrdineSelezionato = nOrd;

    const articoliWrap = document.getElementById('qr-articoli-wrap');
    const articoliList = document.getElementById('qr-articoli-list');
    const ordHdr       = document.getElementById('qr-ordine-header');
    if (ordHdr) ordHdr.innerHTML = `<span class="qr-ord-lbl"><b>ORD. ${_esc(nOrd)}</b></span><span class="qr-cli-lbl">${_esc(cliente)}</span>`;
    if (articoliList) articoliList.innerHTML = '<div class="qr-loading"><i class="fas fa-spinner fa-spin"></i> Caricamento articoli...</div>';
    articoliWrap.style.display = 'block';

    let righe = [];
    const _attiviProd = window._attiviProd || [];
    if (_attiviProd.length > 0) {
        righe = _attiviProd.filter(r =>
            String(r.ordine || '').trim() === String(nOrd).trim() &&
            String(r.archiviato || '').toUpperCase() !== 'TRUE'
        );
    }
    if (righe.length === 0) {
        try {
            const tutti = await window.fetchJson('PROGRAMMA PRODUZIONE DEL MESE');
            righe = tutti.filter(r =>
                String(r.ordine || '').trim() === String(nOrd).trim() &&
                String(r.archiviato || '').toUpperCase() !== 'TRUE'
            );
        } catch {
            if (articoliList) articoliList.innerHTML = '<div class="qr-loading" style="color:#ef4444">Errore caricamento. Riprova.</div>';
            return;
        }
    }

    if (righe.length === 0) {
        if (articoliList) articoliList.innerHTML = '<div class="qr-loading">Nessun articolo attivo trovato per questo ordine.</div>';
        return;
    }

    const listaStati = window.listaStati || [];
    articoliList.innerHTML = righe.map(art => {
        const codice   = art.codice && art.codice !== 'false' ? art.codice : 'Senza Codice';
        const statoConf = listaStati.find(s => s.nome.toUpperCase() === (art.stato || '').toUpperCase()) || { colore: '#94a3b8' };
        return `
        <label class="qr-articolo-row" for="qr-art-${art.id_riga}">
            <input type="checkbox" id="qr-art-${art.id_riga}" class="qr-art-chk" data-id-riga="${art.id_riga}" checked>
            <div class="qr-art-info">
                <span class="qr-art-codice">${codice}</span>
                <span class="qr-art-qty">× ${art.qty}</span>
                <span class="qr-art-stato-badge" style="border-color:${statoConf.colore};color:${statoConf.colore}">${(art.stato || 'IN ATTESA').toUpperCase()}</span>
            </div>
        </label>`;
    }).join('');

    document.querySelectorAll('.qr-art-chk').forEach(c => c.addEventListener('change', _qrAggiornaBtnConferma));

    _qrRenderStatoPills();
    document.getElementById('qr-stato-wrap').style.display = 'block';
    _qrAggiornaBtnConferma();
}

/** Renderizza i pill degli stati disponibili, pre-selezionando quello della postazione. */
function _qrRenderStatoPills() {
    const post     = _qrPostazioneAttuale;
    const pillsDiv = document.getElementById('qr-stato-pills');
    if (!pillsDiv) return;

    const statoDefault = post ? post.statoDefault.toUpperCase() : '';
    const listaStati = window.listaStati || [];
    const stati = (listaStati.length > 0) ? listaStati : [
        { nome: 'IN ATTESA',                    colore: '#94a3b8' },
        { nome: 'PREPARARE PER LAVORAZIONE',    colore: '#64748b' },
        { nome: 'IN LAVORAZIONE',               colore: '#f59e0b' },
        { nome: 'IN PRODUZIONE',                colore: '#242424' },
        { nome: 'IMBALLATO',                    colore: '#22c55e' }
    ];

    _qrStatoScelto = null;
    pillsDiv.innerHTML = stati.map(s => {
        const isSel = s.nome.toUpperCase() === statoDefault;
        if (isSel) _qrStatoScelto = s.nome;
        return `<button type="button"
                    class="qr-stato-pill${isSel ? ' qr-stato-pill-sel' : ''}"
                    data-stato="${s.nome}"
                    style="border-color:${s.colore};${isSel ? 'background:'+s.colore+';color:#fff' : 'color:'+s.colore}"
                    onclick="_qrScegliStato(this,'${s.nome.replace(/'/g,"\\'")}')">
                    <span class="qr-pill-dot" style="background:${s.colore}"></span>
                    ${s.nome}
                </button>`;
    }).join('');
}

/** Seleziona uno stato tra i pill. */
function _qrScegliStato(btn, stato) {
    _qrStatoScelto = stato;
    const listaStati = window.listaStati || [];
    document.querySelectorAll('.qr-stato-pill').forEach(p => {
        const conf = listaStati.find(x => x.nome === p.dataset.stato);
        const col  = conf ? conf.colore : '#94a3b8';
        p.classList.remove('qr-stato-pill-sel');
        p.style.background = '';
        p.style.color      = col;
        p.style.borderColor= col;
    });
    const conf = listaStati.find(x => x.nome === btn.dataset.stato);
    const col  = conf ? conf.colore : '#94a3b8';
    btn.classList.add('qr-stato-pill-sel');
    btn.style.background = col;
    btn.style.color      = '#fff';
    btn.style.borderColor= col;
    _qrAggiornaBtnConferma();
}

function _qrSelezionaTutti()    { document.querySelectorAll('.qr-art-chk').forEach(c => c.checked = true);  _qrAggiornaBtnConferma(); }
function _qrDeselezionaTutti()  { document.querySelectorAll('.qr-art-chk').forEach(c => c.checked = false); _qrAggiornaBtnConferma(); }

function _qrAggiornaBtnConferma() {
    const btn = document.getElementById('btn-qr-conferma');
    if (!btn) return;
    const n = document.querySelectorAll('.qr-art-chk:checked').length;
    btn.disabled = !(n > 0 && _qrStatoScelto);
}

/** Aggiorna lo stato di tutti gli articoli selezionati e chiude il modale. */
async function _confermaSpostaPostazione() {
    if (!_qrStatoScelto || !_qrOrdineSelezionato) return;
    const checkboxes = Array.from(document.querySelectorAll('.qr-art-chk:checked'));
    if (checkboxes.length === 0) { notificaElegante('Seleziona almeno un articolo.', 'error'); return; }

    const btn = document.getElementById('btn-qr-conferma');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvataggio...'; }

    const idRighe = checkboxes.map(c => c.dataset.idRiga);

    const statiPrec = {};
    const _attiviProd = window._attiviProd || [];
    idRighe.forEach(idRiga => {
        const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
        statiPrec[idRiga] = r ? r.stato : null;
    });

    // Optimistic: aggiorna cache + kanban SUBITO
    idRighe.forEach(idRiga => {
        const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
        if (r) r.stato = _qrStatoScelto;
        if (window._syncKanbanFromStato) window._syncKanbanFromStato(idRiga, _qrStatoScelto);
    });

    // Backend
    let errori = 0;
    const falliti = [];
    for (const idRiga of idRighe) {
        const ok = await window.aggiornaDato(null, idRiga, 'stato', _qrStatoScelto, true);
        if (!ok) { errori++; falliti.push(idRiga); }
    }

    if (errori === 0) {
        notificaElegante(`✅ ${idRighe.length} articolo/i → ${_qrStatoScelto}`);
        if (window.cacheContenuti) delete window.cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
        _lsCacheDel('_html_PROGRAMMA PRODUZIONE DEL MESE');
        ProdCache.invalidate('PROGRAMMA_PRODUZIONE').catch(() => {});
    } else {
        // Rollback righe fallite
        falliti.forEach(idRiga => {
            const prev = statiPrec[idRiga];
            const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
            if (prev && r) r.stato = prev;
            if (prev && window._syncKanbanFromStato) window._syncKanbanFromStato(idRiga, prev);
        });
        notificaElegante(`⚠️ ${errori} errori su ${idRighe.length} articoli — riprova`, 'error');
        console.error('[QR Postazione] Rollback', { falliti, statiPrec });
    }
    _chiudiModaleQRAzione();
}

/* ═══════════════════════════════════════════════════════════════════
   GESTIONE POSTAZIONI — IMPOSTAZIONI (CRUD)
═══════════════════════════════════════════════════════════════════ */

function _qrApriModalNuova() {
    _qrApriModalEdit(null);
}

function _qrApriModalModifica(idx) {
    _qrApriModalEdit(idx);
}

function _qrApriModalEdit(idx) {
    const isNuova = idx === null || idx === undefined;
    const p = isNuova ? { icona: '📍', nome: '', codice: '', domanda: '', statoDefault: '' } : _qrPostazioniArr[idx];

    document.getElementById('qr-edit-titolo').innerHTML =
        `<i class="fas fa-map-marker-alt" style="margin-right:8px"></i>${isNuova ? 'Nuova Postazione' : 'Modifica Postazione'}`;
    document.getElementById('qr-edit-icona').value   = p.icona    || '';
    document.getElementById('qr-edit-nome').value    = p.nome     || '';
    document.getElementById('qr-edit-codice').value  = p.codice   || '';
    document.getElementById('qr-edit-domanda').value = p.domanda  || '';
    document.getElementById('qr-edit-idx').value     = isNuova ? '' : idx;

    const sel = document.getElementById('qr-edit-stato');
    const listaStati = window.listaStati || [];
    const stati = (listaStati.length > 0) ? listaStati : POSTAZIONI.map(d => ({ nome: d.statoDefault, colore: '#94a3b8' }));
    const unici = [...new Map(stati.map(s => [s.nome, s])).values()];
    sel.innerHTML = unici.map(s =>
        `<option value="${s.nome}" ${s.nome === (p.statoDefault || '') ? 'selected' : ''}>${s.nome}</option>`
    ).join('');

    const modal = document.getElementById('modal-qr-edit');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');

    requestAnimationFrame(() => _qrAggiornaPrevQR());
}

function _qrChiudiModalEdit() {
    const modal = document.getElementById('modal-qr-edit');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

function _qrAggiornaCodice() {
    const nome   = (document.getElementById('qr-edit-nome')?.value || '').trim();
    const codice = 'PROD:' + nome.toUpperCase()
        .replace(/[ÀÁÂÃÄÅ]/g, 'A').replace(/[ÈÉÊË]/g, 'E').replace(/[ÌÍÎÏ]/g, 'I')
        .replace(/[ÒÓÔÕÖ]/g, 'O').replace(/[ÙÚÛÜ]/g, 'U')
        .replace(/[^A-Z0-9]/g, '');
    const el = document.getElementById('qr-edit-codice');
    if (el) el.value = codice;
}

function _qrRicalcolaCodice() {
    _qrAggiornaCodice();
    _qrAggiornaPrevQR();
}

async function _qrAggiornaPrevQR() {
    const codice = (document.getElementById('qr-edit-codice')?.value || '').trim();
    const nome   = (document.getElementById('qr-edit-nome')?.value  || '').trim();
    const img    = document.getElementById('qr-preview-canvas');
    const nomeEl = document.getElementById('qr-preview-nome');
    const codEl  = document.getElementById('qr-preview-codice');
    if (nomeEl) nomeEl.textContent = nome || '—';
    if (codEl)  codEl.textContent  = codice || '—';
    if (!img || !codice) return;
    try {
        if (typeof QRCode !== 'undefined' && typeof QRCode.toDataURL === 'function') {
            img.src = await QRCode.toDataURL(codice, { width: 160, margin: 2, color: { dark: '#111827', light: '#ffffff' } });
        } else {
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(codice)}`;
        }
    } catch (e) {
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(codice)}`;
    }
}

function _qrSalvaPostazione() {
    const icona    = (document.getElementById('qr-edit-icona')?.value  || '').trim() || '📍';
    const nome     = (document.getElementById('qr-edit-nome')?.value   || '').trim();
    const codice   = (document.getElementById('qr-edit-codice')?.value || '').trim().toUpperCase();
    const domanda  = (document.getElementById('qr-edit-domanda')?.value|| '').trim();
    const stato    = document.getElementById('qr-edit-stato')?.value   || '';
    const idxStr   = document.getElementById('qr-edit-idx')?.value;

    if (!nome)   { notificaElegante('Inserisci un nome per la postazione.', 'error'); return; }
    if (!codice) { notificaElegante('Il codice QR non può essere vuoto.', 'error'); return; }

    const obj = { icona, nome, codice, domanda, statoDefault: stato };
    const idx = idxStr !== '' && idxStr !== null && idxStr !== undefined ? parseInt(idxStr) : null;

    if (idx !== null && !isNaN(idx)) {
        _qrPostazioniArr[idx] = obj;
    } else {
        _qrPostazioniArr.push(obj);
    }
    _qrSalvaPostazioniLS();
    _qrChiudiModalEdit();
    notificaElegante('✅ Postazione salvata.');
    window.caricaInterfacciaImpostazioni();
    setTimeout(() => _qrRiapriSezioneImpostazioni(), 120);
}

function _qrEliminaPostazione(idx) {
    const p = _qrPostazioniArr[idx];
    if (!p) return;
    mostraConferma(
        'Elimina Postazione',
        `Vuoi eliminare la postazione "${p.nome}"? Il QR code stampato associato non funzionerà più.`,
        () => {
            _qrPostazioniArr.splice(idx, 1);
            _qrSalvaPostazioniLS();
            notificaElegante('Postazione eliminata.');
            window.caricaInterfacciaImpostazioni();
            setTimeout(() => _qrRiapriSezioneImpostazioni(), 120);
        },
        'Elimina'
    );
}

function _qrRiapriSezioneImpostazioni() {
    const sec = document.getElementById('section-qr-postazioni');
    if (!sec) return;
    sec.style.display = 'block';
    const row = sec.previousElementSibling;
    if (row) {
        row.classList.add('settings-row-active');
        const arrow = row.querySelector('.settings-row-arrow');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
}

async function _qrRenderListaCanvas() {
    for (let i = 0; i < _qrPostazioniArr.length; i++) {
        const img = document.getElementById(`qr-list-canvas-${i}`);
        if (!img) continue;
        const codice = _qrPostazioniArr[i].codice || '';
        if (!codice) continue;
        try {
            if (typeof QRCode !== 'undefined' && typeof QRCode.toDataURL === 'function') {
                img.src = await QRCode.toDataURL(codice, { width: 56, margin: 1, color: { dark: '#0f172a', light: '#f8fafc' } });
            } else {
                img.src = `https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(codice)}`;
            }
        } catch (e) {
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(codice)}`;
        }
    }
}

function _qrStampaSingola() {
    const codice  = (document.getElementById('qr-edit-codice')?.value || '').trim();
    const nome    = (document.getElementById('qr-edit-nome')?.value   || '').trim();
    const icona   = (document.getElementById('qr-edit-icona')?.value  || '').trim() || '📍';
    const domanda = (document.getElementById('qr-edit-domanda')?.value|| '').trim();
    if (!codice) { notificaElegante('Inserisci nome e codice prima di stampare.', 'error'); return; }
    _qrApriFinestroStampa([{ codice, nome, icona, domanda }]);
}

function _qrStampaSingolaIdx(idx) {
    const p = _qrPostazioniArr[idx];
    if (p) _qrApriFinestroStampa([p]);
}

function _qrStampaTutte() {
    if (_qrPostazioniArr.length === 0) { notificaElegante('Nessuna postazione da stampare.', 'error'); return; }
    _qrApriFinestroStampa(_qrPostazioniArr);
}

async function _qrApriFinestroStampa(postazioni) {
    const items = await Promise.all(postazioni.map(async p => {
        let dataUrl = '';
        try {
            if (typeof QRCode !== 'undefined' && typeof QRCode.toDataURL === 'function')
                dataUrl = await QRCode.toDataURL(p.codice, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } });
        } catch {}
        if (!dataUrl) dataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(p.codice)}`;
        return { ...p, dataUrl };
    }));

    /* eslint-disable no-useless-escape */
    const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>QR Code Postazioni — PROD</title>
<style>
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Segoe UI',sans-serif; background:#fff; padding:20px; }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:24px; }
.card { background:#fff; border:2px solid #e2e8f0; border-radius:14px;
        padding:20px 16px 16px; text-align:center;
        page-break-inside:avoid; break-inside:avoid; display:flex; flex-direction:column; align-items:center; gap:10px; }
.card img { display:block; width:200px; height:200px; }
.nome { font-size:16px; font-weight:800; color:#0f172a; letter-spacing:0.3px; }
button { position:fixed; top:16px; right:16px; background:#111827; color:#fff;
         border:none; border-radius:10px; padding:9px 18px; font-size:13px;
         font-weight:700; cursor:pointer; z-index:999; }
@media print {
  body { padding:6px; }
  button { display:none; }
  .grid { grid-template-columns:repeat(3,1fr); gap:16px; }
  .card { border:1.5px solid #cbd5e1; }
}
</style>
</head>
<body>
<button onclick="window.print()">🖨️ Stampa</button>
<div class="grid">
${items.map(p => `
<div class="card">
  <img src="${p.dataUrl}" alt="QR ${p.nome}">
  <div class="nome">${p.icona || ''} ${p.nome}</div>
</div>`).join('')}
</div>
<script>setTimeout(()=>window.print(),800);<\/script>
</body>
</html>`;
    /* eslint-enable no-useless-escape */

    const _blob    = new Blob([html], { type: 'text/html; charset=utf-8' });
    const _blobUrl = URL.createObjectURL(_blob);
    const win = window.open(_blobUrl, '_blank', 'width=900,height=700');
    if (win) { setTimeout(() => URL.revokeObjectURL(_blobUrl), 30000); }
    else { URL.revokeObjectURL(_blobUrl); notificaElegante('⚠️ Abilita i popup per la stampa.', 'error'); }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
    _qrPostazioniArr,
    _qrCaricaPostazioni,
    _chiudiScannerQR,
    _qrRenderListaCanvas,
    apriScannerQR,
    _processaQR,
    _chiudiModaleQRAzione,
    _qrFiltroOrdini,
    _qrSelezionaOrdine,
    _qrScegliStato,
    _qrSelezionaTutti,
    _qrDeselezionaTutti,
    _confermaSpostaPostazione,
    _qrApriModalNuova,
    _qrApriModalModifica,
    _qrChiudiModalEdit,
    _qrAggiornaCodice,
    _qrRicalcolaCodice,
    _qrSalvaPostazione,
    _qrEliminaPostazione,
    _qrStampaSingola,
    _qrStampaSingolaIdx,
    _qrStampaTutte,
    _qrAggiornaPrevQR
};
