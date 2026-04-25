// PROD — Core / UI
// Estratto da script.js — 27 marzo 2026
// Dipendenze: nessuna (DOM only)

// ─── Escape HTML (XSS prevention) ────────────────────────────────────────────
const _ESC_MAP = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
export function _esc(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, c => _ESC_MAP[c]);
}

// DEV DEBUG: intercetta tutte le chiamate a classList.add/remove per "fade-in"
(function() {
    try {
        const origAdd = DOMTokenList.prototype.add;
        const origRemove = DOMTokenList.prototype.remove;
        DOMTokenList.prototype.add = function(...args) {
            try {
                if (args.indexOf && args.indexOf('fade-in') >= 0) {
                    console.debug('[DOMTokenList.add] adding fade-in', this);
                    console.trace();
                }
            } catch (e) {}
            return origAdd.apply(this, args);
        };
        DOMTokenList.prototype.remove = function(...args) {
            try {
                if (args.indexOf && args.indexOf('fade-in') >= 0) {
                    console.debug('[DOMTokenList.remove] removing fade-in', this);
                    console.trace();
                }
            } catch (e) {}
            return origRemove.apply(this, args);
        };
    } catch (e) {}
})();

// ─── Toast notifica ───────────────────────────────────────────────────────────

/**
 * Mostra un toast message non bloccante.
 *
 * @param {string} msg  - Testo del messaggio
 * @param {string} [tipo] - 'error' per stile rosso
 */
export function notificaElegante(msg, tipo) {
    let el = document.getElementById('toast-notifica');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast-notifica';
        document.body.appendChild(el);
    }
    el.className = 'toast-notifica' + (tipo === 'error' ? ' toast-error' : '');
    el.innerText = msg;
    void el.offsetWidth; // forza reflow per ripartire l'animazione
    el.classList.add('visible');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => { el.classList.remove('visible'); }, 3000);
}

// ─── Fade transizione pagina ──────────────────────────────────────────────────

/**
 * Applica una breve animazione fade-in a un elemento DOM.
 * Usata ogni volta che si cambia pagina / si aggiorna il contenitore principale.
 *
 * @param {HTMLElement} elem
 */
export function applicaFade(elem) {
    if (elem) {
        try {
            // Debug: log caller stack to trace unexpected fade triggers
            console.debug('[applicaFade] apply to element', elem.id || elem.className || elem.tagName);
            console.trace();
        } catch (e) {}
        elem.classList.add('fade-in');
        setTimeout(() => elem.classList.remove('fade-in'), 300);
    }
}

// ─── Spinner generico ─────────────────────────────────────────────────────────

/**
 * Aggiunge la classe CSS 'loading' all'elemento con l'id specificato.
 *
 * @param {string} elementId
 */
export function mostraSpinner(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.add('loading');
}

/**
 * Rimuove la classe CSS 'loading' dall'elemento con l'id specificato.
 *
 * @param {string} elementId
 */
export function nascondiSpinner(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.remove('loading');
}

// ─── Modal conflitto di modifica (optimistic locking) ────────────────────────

let _conflittoCallbackClient = null;
let _conflittoCallbackServer = null;

/**
 * Apre il modal di conflitto di modifica concorrente.
 *
 * @param {Object} opzioni
 * @param {Function} [opzioni.onSceglioClient] - callback se l'utente sceglie la propria versione
 * @param {Function} [opzioni.onSceglioServer] - callback se l'utente sceglie la versione server
 * @param {string}   [opzioni.altroUtente]     - nome dell'altro utente che ha salvato
 * @param {string}   [opzioni.tuaModifica]     - testo della modifica locale
 * @param {string}   [opzioni.serverModifica]  - testo della modifica server
 */
export function mostraModalConflitto(opzioni) {
    _conflittoCallbackClient = opzioni.onSceglioClient || null;
    _conflittoCallbackServer = opzioni.onSceglioServer || null;
    const altroUtente = opzioni.altroUtente
        ? String(opzioni.altroUtente).charAt(0).toUpperCase() + String(opzioni.altroUtente).slice(1).toLowerCase()
        : 'un altro utente';
    document.getElementById('conflitto-desc').textContent =
        altroUtente + ' ha salvato questa riga mentre stavi modificando. Cosa vuoi fare?';
    document.getElementById('conflitto-tua').textContent    = opzioni.tuaModifica    || '—';
    document.getElementById('conflitto-server').textContent = opzioni.serverModifica  || '—';
    document.getElementById('conflitto-altroUtente').textContent = altroUtente.toUpperCase();
    document.getElementById('conflitto-btn-altro').textContent   = altroUtente;
    const m = document.getElementById('modal-conflitto');
    m.style.display = 'flex';
    requestAnimationFrame(() => m.classList.add('active'));
}

/**
 * Chiude il modal conflitto e invoca il callback della scelta.
 * Esposta su window da registerUIGlobals() (usata negli onclick HTML).
 *
 * @param {'client'|'server'} scelta
 */
export function _conflittoScegli(scelta) {
    const m = document.getElementById('modal-conflitto');
    m.classList.remove('active');
    setTimeout(() => { m.style.display = 'none'; }, 300);
    if (scelta === 'client' && typeof _conflittoCallbackClient === 'function') {
        _conflittoCallbackClient();
    } else if (scelta === 'server' && typeof _conflittoCallbackServer === 'function') {
        _conflittoCallbackServer();
    }
    _conflittoCallbackClient = null;
    _conflittoCallbackServer = null;
}

// ─── Modal conferma generico ──────────────────────────────────────────────────

/**
 * Apre il modal di conferma generico.
 *
 * @param {string}   titolo   - Titolo del modal
 * @param {string}   messaggio - Testo del messaggio
 * @param {Function} onOk     - Callback invocata alla conferma
 * @param {string}   [labelOk] - Etichetta del pulsante OK (default: 'Conferma')
 */
export function mostraConferma(titolo, messaggio, onOk, labelOk) {
    const modal   = document.getElementById('modal-conferma');
    const titoloEl = document.getElementById('modal-conferma-titolo');
    const msgEl    = document.getElementById('modal-conferma-msg');
    const okBtn    = document.getElementById('modal-conferma-ok');
    if (!modal) return;
    if (titoloEl) titoloEl.textContent = titolo   || '';
    if (msgEl)    msgEl.textContent    = messaggio || '';
    if (okBtn) {
        okBtn.textContent = labelOk || 'Conferma';
        okBtn.onclick = () => { _chiudiConferma(); if (typeof onOk === 'function') onOk(); };
    }
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('active'));
}

/**
 * Chiude il modal di conferma generico.
 * Esposta su window da registerUIGlobals() (usata negli onclick HTML).
 */
export function _chiudiConferma() {
    const modal = document.getElementById('modal-conferma');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

// ─── Registrazione globali HTML ───────────────────────────────────────────────

/**
 * Espone su window le funzioni UI richiamabili dagli onclick inline dell'HTML.
 * Da chiamare una sola volta durante l'inizializzazione dell'app.
 */
export function registerUIGlobals() {
    window._conflittoScegli = _conflittoScegli;
    window._chiudiConferma  = _chiudiConferma;
}
