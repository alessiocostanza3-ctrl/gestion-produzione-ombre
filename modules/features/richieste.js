// PROD — Features / Richieste
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ../core/config.js, ../core/cache.js, ../core/session.js, ../core/ui.js, ../core/revision-poller.js

import { URL_GOOGLE } from '../core/config.js';
import ProdCache from '../core/cache.js';
import { utenteAttuale } from '../core/session.js';
import { notificaElegante, applicaFade, mostraConferma } from '../core/ui.js';
import RevisionPoller from '../core/revision-poller.js';

// ─── Stato interno ────────────────────────────────────────────────────────────
let _ordiniAutocompleteCache = [];

// ─── Alias _normNome (definita in script.js, dipende da _NOME_CANON) ──────────
const _normNome = n => window._normNome ? window._normNome(n) : (n ? String(n).trim() : n);

// ─── localStorage helpers (copia da script.js) ───────────────────────────────
function _lsCacheGet(key, ttlMs) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.ts < ttlMs) return parsed.data;
        return null;
    } catch(e) { return null; }
}
function _lsCacheSet(key, data) {
    try {
        const str = (typeof data === 'string') ? data : JSON.stringify(data);
        if (str.length > 2500000) return;
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: str }));
    } catch(e) {}
}
function _lsCacheDel(key) {
    try { localStorage.removeItem(key); } catch(e) {}
}

// ─── Helper: invalida cache STORICO_RICHIESTE ─────────────────────────────────
function _invalidaCacheRichieste() {
    if (window.cacheContenuti)  delete window.cacheContenuti['STORICO_RICHIESTE'];
    if (window.cacheFetchTime)  delete window.cacheFetchTime['STORICO_RICHIESTE'];
    _lsCacheDel('_html_STORICO_RICHIESTE');
    window._prefetchRqBundle  = null;
    window._prefetchRqPromise = null;
}

// ─── Helper: verifica se utente è esente (ALESSIO/MASTER) ────────────────────
function _isUtenteEsente() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const nome = utenteAttuale.nome.toUpperCase();
    return nome === 'ALESSIO' || nome === '0000' || utenteAttuale.ruolo === 'MASTER';
}

// ─── Badge richieste su sidebar e bottom nav ──────────────────────────────────
export function aggiornaBadgeRichieste(messaggi) {
    const badgeSidebar = document.getElementById('badge-richieste-count');
    const nomeSidebar  = document.getElementById('nome-utente-sidebar');
    const imgAvatar    = document.getElementById('img-avatar-sidebar');

    if (!badgeSidebar) return;

    const vistaAttiva = (utenteAttuale.vistaSimulata || 'MASTER').toUpperCase().trim();

    if (nomeSidebar) nomeSidebar.innerText = vistaAttiva;
    if (imgAvatar)   imgAvatar.src = `https://ui-avatars.com/api/?name=${vistaAttiva}&background=2563eb&color=fff`;

    // Se si è già sulla pagina richieste, il badge rimane nascosto
    if (window.paginaAttuale === 'STORICO_RICHIESTE') {
        badgeSidebar.style.display = 'none';
        badgeSidebar.classList.remove('badge-sollecito-attivo');
        return;
    }

    const rilevanti = messaggi.filter(m => {
        const nonRisolto = String(m.RISOLTO).toLowerCase() !== 'true';
        if (vistaAttiva === 'MASTER') return nonRisolto;
        // Il campo A può contenere destinatari multipli separati da virgola
        var destMatch = String(m.A || '').split(',').some(function(d) {
            return d.trim().toUpperCase() === vistaAttiva;
        });
        return destMatch && nonRisolto;
    });

    const conteggio    = rilevanti.length;
    const sollecitati  = rilevanti.filter(m => String(m.SOLLECITO).toLowerCase() === 'true').length;

    if (conteggio > 0) {
        badgeSidebar.innerText = conteggio;
        badgeSidebar.style.display = 'inline-block';
        // Arancione pulsante se ci sono sollecitati, rosso normale altrimenti
        if (sollecitati > 0) {
            badgeSidebar.classList.add('badge-sollecito-attivo');
        } else {
            badgeSidebar.classList.remove('badge-sollecito-attivo');
        }
    } else {
        badgeSidebar.style.display = 'none';
        badgeSidebar.classList.remove('badge-sollecito-attivo');
    }

    // Sincronizza anche il badge nell'app bar mobile
    const badgeMobile = document.getElementById('badge-mobile-notif');
    if (badgeMobile) {
        if (conteggio > 0 && window.paginaAttuale !== 'STORICO_RICHIESTE') {
            badgeMobile.innerText = conteggio;
            badgeMobile.style.display = 'inline-block';
            badgeMobile.style.background = sollecitati > 0 ? '#f97316' : '#ef4444';
        } else {
            badgeMobile.style.display = 'none';
        }
    }

    // Sincronizza il badge nel bottom nav
    const badgeBottom = document.getElementById('badge-bottom-richieste');
    if (badgeBottom) {
        if (conteggio > 0 && window.paginaAttuale !== 'STORICO_RICHIESTE') {
            badgeBottom.innerText = conteggio;
            badgeBottom.style.display = 'inline-block';
            if (sollecitati > 0) badgeBottom.classList.add('badge-sollecito-attivo');
            else badgeBottom.classList.remove('badge-sollecito-attivo');
        } else {
            badgeBottom.style.display = 'none';
            badgeBottom.classList.remove('badge-sollecito-attivo');
        }
    }
}

/* ---- MODAL SOLLECITO ---- */
function apriModalSollecito(idRiga, nOrd, cliente, rifArt) {
    const modal = document.getElementById('modalSollecito');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    document.getElementById('sollecito-titolo').textContent =
        (rifArt && rifArt !== 'Intero Ordine') ? `Sollecita \u2013 ${rifArt}` : `Sollecita \u2013 Ord. ${nOrd}`;
    document.getElementById('sollecito-id-riga').value = idRiga || '';
    document.getElementById('sollecito-nord').value    = nOrd;
    document.getElementById('sollecito-cliente').value = cliente || '';
    document.getElementById('sollecito-rif').value     = rifArt  || '';
    document.getElementById('sollecito-data').value    = '';
    document.getElementById('sollecito-note').value    = '';
}
function chiudiModalSollecito() {
    const modal = document.getElementById('modalSollecito');
    modal.style.display = '';
    modal.classList.remove('active');
}
async function confermaInvioSollecito() {
    const nOrd    = document.getElementById('sollecito-nord').value;
    const idRiga  = document.getElementById('sollecito-id-riga').value;
    const cliente = document.getElementById('sollecito-cliente').value;
    const rifArt  = document.getElementById('sollecito-rif').value;
    const data    = document.getElementById('sollecito-data').value;
    const note    = document.getElementById('sollecito-note').value.trim();
    if (!data) { notificaElegante('Seleziona una data di scadenza.', 'error'); return; }
    chiudiModalSollecito();
    RevisionPoller.pauseFor(6000);
    _invalidaCacheRichieste();
    const payload = {
        azione: 'supporto_multiplo',
        n_ordine: nOrd,
        cliente:  cliente,
        prodotto: rifArt && rifArt !== 'Intero Ordine' ? rifArt : '',
        tipo:     'SCADENZA',
        messaggio: `SCAD:${data}|${note || '\u2013'}`,
        mittente:  utenteAttuale.nome.toUpperCase().trim(),
        destinatari: ['ALESSIO']
    };
    try {
        await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) });
        notificaElegante('\u2705 Scadenza aggiunta');
        // Se siamo sulla pagina richieste, ricarica per mostrare la card in Scadenze
        if (window.paginaAttuale === 'STORICO_RICHIESTE') caricaRichieste();
    } catch { notificaElegante('\u2705 Scadenza aggiunta'); }
}
/* ---- FINE MODAL SOLLECITO ---- */

/* ---- MODAL AIUTO ---- */
function apriModalAiuto(idRiga, riferimento, nOrdine, cliente) {
    const modal = document.getElementById('modalAiuto');
    if (modal.style.display === 'flex') return;  // guard: già aperto

    modal._openedAt = Date.now();   // grace-period backdrop
    modal.style.display = 'flex';
    modal.offsetHeight; // Forza il reflow per l'animazione
    modal.classList.add('active');

    // Titolo più coerente: Messaggio invece di Supporto
    document.getElementById('modal-titolo').innerText = idRiga ?
        `Messaggio Art. ${riferimento}` :
        `Messaggio Ordine ${nOrdine}`;

    // Generazione lista operatori (nomi normalizzati Title Case)
    const listaOp = window.listaOperatori || [];
    document.getElementById('wrapper-operatori').innerHTML = listaOp.map(op => `
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${op.email}" data-nome="${_normNome(op.nome)}">
            <span><b>${_normNome(op.nome)}</b> <small class="text-muted">(${op.reparto || 'Team'})</small></span>
        </label>
    `).join('');

    modal.dataset.idRiga = idRiga || "";
    modal.dataset.nOrdine = nOrdine;
    modal.dataset.cliente = cliente || "";

    // Nascondi sempre il campo ordine libero (visibile solo da apriNuovaRichiesta)
    const ordineRow = document.getElementById('modal-ordine-row');
    if (ordineRow) ordineRow.style.display = 'none';

    // Reset del campo testo — modal sempre in modalità DOMANDA
    document.getElementById('messaggio-aiuto').value = "";
    setTipoAzione('DOMANDA');
}

// Apri modal per creare una nuova richiesta libera (da bottom nav "+")
// Supporta opzioni = { ordine, cliente, prodotto } per precompilazione da riga produzione
export function apriNuovaRichiesta(opzioni = {}) {
    const modal = document.getElementById('modalAiuto');
    // Guard DOM-based: se il modal è già visibile (aperto o in fase di chiusura), non fare nulla
    if (modal.style.display === 'flex') return;
    modal._openedAt = Date.now();   // timestamp per grace-period backdrop
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    document.getElementById('modal-titolo').innerText = 'Nuova Richiesta';
    const listaOp = window.listaOperatori || [];
    document.getElementById('wrapper-operatori').innerHTML = listaOp.map(op => `
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${op.email}" data-nome="${op.nome}">
            <span><b>${op.nome}</b> <small class="text-muted">(${op.reparto || 'Team'})</small></span>
        </label>
    `).join('');
    modal.dataset.idRiga = '';
    modal.dataset.nOrdine = opzioni.ordine || '';
    modal.dataset.cliente  = opzioni.cliente || '';
    document.getElementById('messaggio-aiuto').value = '';
    setTipoAzione('DOMANDA');
    // Mostra il campo numero ordine con autocomplete
    const ordineRow = document.getElementById('modal-ordine-row');
    if (ordineRow) {
        ordineRow.style.display = 'block';
        const input = document.getElementById('modal-ordine-input');
        if (input) {
            input.value = opzioni.ordine || '';
            if (opzioni.ordine) {
                modal.dataset.nOrdine = opzioni.ordine;
                modal.dataset.cliente  = opzioni.cliente || '';
            }
            _setupOrdineAutocomplete(input);
        }
    }
    // Se cache vuota prova a caricare
    if (_ordiniAutocompleteCache.length === 0) {
        fetch(URL_GOOGLE + '?pagina=' + encodeURIComponent('PROGRAMMA PRODUZIONE DEL MESE'))
            .then(r => r.json())
            .then(dati => {
                const seen = new Set();
                _ordiniAutocompleteCache = dati
                    .filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE')
                    .map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '', riferimento: r.riferimento || '' }))
                    .filter(o => { if (!o.ordine || seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });
            }).catch(() => {});
    }
}

function _setupOrdineAutocomplete(input) {
    // Evita duplicare listener
    input.oninput = function() {
        const q = this.value.trim().toLowerCase();
        const list = document.getElementById('ordine-autocomplete');
        if (!list) return;
        if (!q) { list.style.display = 'none'; list.innerHTML = ''; return; }
        const matches = _ordiniAutocompleteCache.filter(o =>
            o.ordine.toLowerCase().includes(q) || o.cliente.toLowerCase().includes(q)
        ).slice(0, 8);
        if (matches.length === 0) { list.style.display = 'none'; list.innerHTML = ''; return; }
        list.innerHTML = matches.map(o => `
            <div class="autocomplete-item" onmousedown="_selezionaOrdine('${o.ordine.replace(/'/g, "\\'")}','${o.cliente.replace(/'/g, "\\'")}')">  
                <span class="ac-ordine">ORD. ${o.ordine}</span>
                <span class="ac-cliente">${o.cliente}</span>
            </div>
        `).join('');
        list.style.display = 'block';
    };
    input.onblur = function() {
        setTimeout(() => {
            const list = document.getElementById('ordine-autocomplete');
            if (list) list.style.display = 'none';
        }, 200);
    };
}

function _selezionaOrdine(ordine, cliente) {
    const input = document.getElementById('modal-ordine-input');
    if (input) input.value = ordine;
    const list = document.getElementById('ordine-autocomplete');
    if (list) { list.style.display = 'none'; list.innerHTML = ''; }
    // Aggiorna il dataset del modal affinché confermaInvioSupporto usi il valore corretto
    const modal = document.getElementById('modalAiuto');
    if (modal) {
        modal.dataset.nOrdine = ordine;
        modal.dataset.cliente = cliente || '';
    }
}
function setTipoAzione(tipo) {
    const tipoUp = tipo.toUpperCase();
    document.getElementById('modalAiuto').dataset.tipoAzione = tipoUp;
    document.getElementById('btn-tipo-assegna').classList.toggle('active', tipoUp === 'ASSEGNAZIONE');
    document.getElementById('btn-tipo-domanda').classList.toggle('active', tipoUp === 'DOMANDA');
}
function chiudiModal() {
    const modal = document.getElementById('modalAiuto');

    // 1. Porta subito display a '' così il guard DOM blocca riaperture durante il fade-out
    modal.style.display = '';

    // 2. Togli la classe active per avviare il fade-out
    modal.classList.remove('active');
}
async function confermaInvioSupporto() {
    const modalElement = document.getElementById('modalAiuto');
    if (!modalElement) return;
    RevisionPoller.pauseFor(6000);

    try {
    const idRiga = modalElement.dataset.idRiga;
    const ordineRow   = document.getElementById('modal-ordine-row');
    const ordineInput = document.getElementById('modal-ordine-input');
    const nOrd = (ordineRow && ordineRow.style.display !== 'none' && ordineInput && ordineInput.value.trim())
        ? ordineInput.value.trim()
        : modalElement.dataset.nOrdine;
    const messaggioVal = document.getElementById('messaggio-aiuto').value;
    const tipoAzione   = modalElement.dataset.tipoAzione;

    const checkboxSelezionate = document.querySelectorAll('input[name="destinatario"]:checked');
    if (checkboxSelezionate.length === 0) {
        alert("Per favore, seleziona almeno un operatore.");
        return;
    }

    const listaNomiStr        = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome')).join(', ');
    const listaNomiDestinatari = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome'));

    // ── Chiudi subito il modal e dai feedback immediato ──
    document.getElementById('messaggio-aiuto').value = '';
    chiudiModal();
    notificaElegante(tipoAzione === 'ASSEGNAZIONE' ? '\u2705 Assegnazione inviata' : '\u2705 Richiesta inviata');

    // Invalida cache richieste in anticipo (client-side + prefetch bundle)
    _invalidaCacheRichieste();

    // ── Fire-and-forget: entrambe le chiamate in background ──
    const urlAssegnazione = `${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(listaNomiStr)}&id_riga=${idRiga}&mittente=${encodeURIComponent(utenteAttuale.nome.toUpperCase().trim())}&registra=0`;
    const clienteVal = (modalElement.dataset.cliente || '').trim();
    const payload = {
        azione: 'supporto_multiplo',
        n_ordine: nOrd,
        cliente: clienteVal,
        tipo: tipoAzione,
        messaggio: messaggioVal || (tipoAzione === 'ASSEGNAZIONE' ? 'Nuova assegnazione' : 'Nuova domanda'),
        mittente: utenteAttuale.nome.toUpperCase().trim(),
        destinatari: listaNomiDestinatari
    };

    Promise.all([
        fetch(urlAssegnazione).catch(() => {}),
        fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) }).catch(() => {})
    ]).then(() => {
        // Aggiorna dati in background dopo che il server ha risposto
        if (window.paginaAttuale === 'STORICO_RICHIESTE') {
            caricaRichieste().catch(() => {});
        } else {
            _fetchDatiRichieste().then(d => aggiornaBadgeRichieste(d.attive)).catch(() => {});
            window.caricaDati?.(window.paginaAttuale).catch(() => {});
        }
    });
    } catch (e) { notificaElegante('Errore invio richiesta.', 'error'); }
}
/* ---- FINE MODAL AIUTO ---- */

function toggleAreaRisposta(id) {
    const box = document.getElementById('box-risposta-' + id);
    const boxConf = document.getElementById('box-conferma-' + id);
    if (!box) return;
    if (boxConf) { boxConf.style.display = 'none'; boxConf.style.opacity = '0'; }

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        setTimeout(() => { box.style.opacity = '1'; box.style.transform = 'translateY(0)'; }, 10);
        const input = document.getElementById('input-risposta-' + id);
        if (input) {
            input.focus();
            // Scroll al box dopo che la tastiera iOS si è aperta (~400ms)
            setTimeout(() => {
                box.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
        }
    } else {
        box.style.opacity = '0';
        box.style.transform = 'translateY(-10px)';
        setTimeout(() => { box.style.display = 'none'; }, 300);
    }
}
function toggleBoxArchivia(id) {
    const box = document.getElementById('box-conferma-' + id);
    const boxResp = document.getElementById('box-risposta-' + id);
    if (!box) return;
    if (boxResp) { boxResp.style.display = 'none'; boxResp.style.opacity = '0'; }

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        setTimeout(() => { box.style.opacity = '1'; box.style.transform = 'translateY(0)'; }, 10);
    } else {
        box.style.opacity = '0';
        box.style.transform = 'translateY(-10px)';
        setTimeout(() => { box.style.display = 'none'; }, 300);
    }
}
async function inviaRisposta(idRiga, nOrdine, destinatario, cliente) {
    try {
    const input = document.getElementById('input-risposta-' + idRiga);
    const testo = input.value.trim();
    if (!testo) return;

    RevisionPoller.pauseFor(6000);
    // ── Reset UI immediato ──
    input.value = '';
    toggleAreaRisposta(idRiga); // chiude il box risposta subito
    notificaElegante('\u2705 Risposta inviata');

    // Invalida cache in anticipo
    _invalidaCacheRichieste();

    // ── Fire-and-forget ──
    const payload = {
        azione: 'supporto_multiplo',
        n_ordine: nOrdine,
        cliente: (cliente || '').trim(),
        tipo: 'RISPOSTA',
        messaggio: testo,
        mittente: utenteAttuale.nome.toUpperCase().trim(),
        destinatari: String(destinatario).split(',').map(d => d.trim().toUpperCase()).filter(Boolean)
    };
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) })
        .then(() => { if (window.paginaAttuale === 'STORICO_RICHIESTE') caricaRichieste().catch(() => {}); })
        .catch(() => {});
    } catch (e) { notificaElegante('Errore invio risposta.', 'error'); }
}

//PAGINA RICHIESTE//

/** Salva lo stato open/closed di un gruppo richieste */
function _saveReqGroup(id, el) {
    try { localStorage.setItem('_rg_' + id, el.open ? '1' : '0'); } catch {}
}

function _parseQtyProduzione_(value) {
    const raw = String(value == null ? '' : value).trim();
    if (!raw) return 0;
    const normalized = raw.replace(/\./g, '').replace(',', '.');
    const qty = Number(normalized);
    return Number.isFinite(qty) ? qty : 0;
}

function _formatQtyProduzione_(value) {
    if (!Number.isFinite(value)) return '0';
    if (Math.abs(value - Math.round(value)) < 0.0001) return String(Math.round(value));
    return value.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function _isStatoEsclusoFabbisogno_(stato) {
    const key = String(stato || '').trim().toUpperCase();
    return [
        'IMBALLATO',
        'SPEDITO',
        'CONSEGNATO',
        'SPEDITO/CONSEGNATO',
        'SPEDITI/CONSEGNATI',
        'ANNULLATO',
        'ANNULLATI'
    ].includes(key);
}

// ── Fabbisogno Produzione: navigazione e modals ──────────────────────────────
function _fabprodVaiOrdine(nOrd) {
    document.querySelectorAll('.fabprod-modal-overlay').forEach(el => el.remove());
    window.cambiaPagina?.('PROGRAMMA PRODUZIONE DEL MESE', null);
    setTimeout(() => {
        ['universal-search', 'mobile-search'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.value = nOrd; el.dispatchEvent(new Event('input')); }
        });
        if (typeof window.filtraUniversale === 'function') window.filtraUniversale();
    }, 420);
}

function _fabprodApriModalOrdine(nOrd, cliente) {
    document.getElementById('fabprod-modal-ordine')?.remove();
    const cli = cliente ? ` \u00b7 ${cliente}` : '';
    const safeOrd = nOrd.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const el = document.createElement('div');
    el.id = 'fabprod-modal-ordine';
    el.className = 'fabprod-modal-overlay';
    el.innerHTML = `
        <div class="fabprod-modal-box">
            <div class="fabprod-modal-title"><i class="fas fa-box-open"></i> Vai all'ordine?</div>
            <div class="fabprod-modal-body">ORD. <strong>${nOrd}</strong>${cli ? `<span class="fabprod-modal-sub">${cli}</span>` : ''}</div>
            <div class="fabprod-modal-btns">
                <button class="fabprod-btn-cancel" onclick="document.getElementById('fabprod-modal-ordine').remove()">Annulla</button>
                <button class="fabprod-btn-confirm" onclick="_fabprodVaiOrdine('${safeOrd}')">Vai <i class='fas fa-arrow-right'></i></button>
            </div>
        </div>`;
    el.addEventListener('click', e => { if (e.target === el) el.remove(); });
    document.body.appendChild(el);
}

function _fabprodApriModalArticolo(idx) {
    const rows = window._fabprodCurrentRows;
    if (!rows || !rows[idx]) return;
    const row = rows[idx];
    document.getElementById('fabprod-modal-articolo')?.remove();
    const pillsHtml = row.ordini.map(o => {
        const safeOrd = o.ordine.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const safeCli = (o.cliente || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `<span class="fabprod-order-pill fabprod-order-pill--click" onclick="document.getElementById('fabprod-modal-articolo').remove();_fabprodApriModalOrdine('${safeOrd}','${safeCli}')">ORD. ${o.ordine}${o.cliente ? `<span class="fabprod-pill-cliente"> \u00b7 ${o.cliente}</span>` : ''}</span>`;
    }).join('');
    const el = document.createElement('div');
    el.id = 'fabprod-modal-articolo';
    el.className = 'fabprod-modal-overlay';
    el.innerHTML = `
        <div class="fabprod-modal-box fabprod-modal-box--art">
            <button class="fabprod-modal-close" onclick="document.getElementById('fabprod-modal-articolo').remove()"><i class="fas fa-times"></i></button>
            ${row.codice ? `<div class="fabprod-modal-art-code">${row.codice}</div>` : ''}
            <div class="fabprod-modal-art-name">${row.prodotto}</div>
            <div class="fabprod-modal-art-qty">${_formatQtyProduzione_(row.qty)} pz totali richiesti</div>
            <div class="fabprod-modal-art-orders">${pillsHtml || '<span style="color:#94a3b8;font-size:0.8rem">Nessun ordine</span>'}</div>
        </div>`;
    el.addEventListener('click', e => { if (e.target === el) el.remove(); });
    document.body.appendChild(el);
}

function _fabprodCardClick(idx) {
    if (window.innerWidth <= 768) _fabprodApriModalArticolo(idx);
    // desktop: pills gestiscono il click da soli
}

function _buildFabbisognoProduzioneRows_(righeProduzione) {
    const grouped = new Map();
    (righeProduzione || []).forEach(riga => {
        if (!riga) return;
        if (String(riga.archiviato || '').toUpperCase() === 'TRUE') return;
        if (_isStatoEsclusoFabbisogno_(riga.stato)) return;

        const prodotto = String(riga.prodotto || '').trim();
        if (!prodotto) return;

        const qtyTotale = _parseQtyProduzione_(riga.qty);
        const qtyEvasa = _parseQtyProduzione_(riga.qty_evasa);
        const qtyNetta = Math.max(qtyTotale - qtyEvasa, 0);
        if (qtyNetta <= 0) return;

        const key = prodotto.toLocaleUpperCase('it-IT');
        if (!grouped.has(key)) {
            grouped.set(key, {
                prodotto,
                codice: String(riga.codice || '').trim(),
                qty: 0,
                ordini: new Map()   // key=nOrdine, value=cliente
            });
        }

        const entry = grouped.get(key);
        if (!entry.codice && riga.codice) entry.codice = String(riga.codice).trim();
        entry.qty += qtyNetta;
        if (riga.ordine) {
            const nOrd = String(riga.ordine).trim();
            const cli  = String(riga.cliente || '').trim();
            if (!entry.ordini.has(nOrd) || !entry.ordini.get(nOrd)) entry.ordini.set(nOrd, cli);
        }
    });

    return Array.from(grouped.values())
        .map(entry => ({
            prodotto: entry.prodotto,
            codice: entry.codice,
            qty: entry.qty,
            ordini: Array.from(entry.ordini.entries())
                .map(([ord, cli]) => ({ ordine: ord, cliente: cli }))
                .sort((a, b) => a.ordine.localeCompare(b.ordine, 'it'))
        }))
        .sort((a, b) => (a.codice || '').localeCompare(b.codice || '', 'it', { sensitivity: 'base' }));
}

async function _loadFabbisognoProduzioneRows_() {
    const attiviProd = window._attiviProd;
    if (Array.isArray(attiviProd) && attiviProd.length) {
        return _buildFabbisognoProduzioneRows_(attiviProd);
    }

    let dashBundle = null;
    if (window._prefetchDashBundle) {
        dashBundle = window._prefetchDashBundle;
    } else if (window._prefetchDashPromise) {
        dashBundle = await window._prefetchDashPromise;
    } else {
        const dashResp = await fetch(URL_GOOGLE + '?azione=getAllDashboard');
        if (!dashResp.ok) throw new Error(`HTTP ${dashResp.status}`);
        dashBundle = await dashResp.json();
    }

    const produzione = (dashBundle && dashBundle.produzione) || [];
    return _buildFabbisognoProduzioneRows_(produzione);
}

/** Fetch del bundle richieste (+ fabbisogno produzione) dal GAS o dal prefetch in volo. */
export async function _fetchDatiRichieste(signal = null) {
    let bundle = null;
    if (window._prefetchRqBundle) {
        bundle = window._prefetchRqBundle;
        window._prefetchRqBundle = null;
        window._prefetchRqPromise = null;
    } else if (window._prefetchRqPromise) {
        bundle = await window._prefetchRqPromise;
        window._prefetchRqBundle = null;
        window._prefetchRqPromise = null;
    } else {
        const resp = await fetch(URL_GOOGLE + '?azione=getAllRichieste', signal ? { signal } : {});
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        bundle = await resp.json();
    }
    if (!bundle) throw new Error('bundle vuoto');
    let fabbisogno = [];
    try { fabbisogno = await _loadFabbisognoProduzioneRows_(); } catch (e) { console.warn('Fabbisogno Produzione non disponibile:', e); }
    return { attive: bundle.attive || [], archivio: bundle.archivio || [], fabbisogno };
}

export async function caricaRichieste(expectedRequestId = null, signal = null) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    contenitore.innerHTML = "<div class='centered-msg' id='_ric-loader'>Caricamento messaggi in corso...</div>";

    const retryTimer = setTimeout(() => {
        const el = document.getElementById('_ric-loader');
        if (el) el.innerHTML = `\u26a0\ufe0f Connessione lenta o server non raggiungibile.<br>
            <button onclick="cambiaPagina('STORICO_RICHIESTE', null)"
                style="margin-top:12px;padding:8px 20px;background:#242424;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`;
    }, 12000);

    try {
        const dati = await _fetchDatiRichieste(signal);
        clearTimeout(retryTimer);

        aggiornaBadgeRichieste(dati.attive);
        if (expectedRequestId !== null && expectedRequestId !== window._latestNavRequest) return;

        window.aggiornaBadgeNotifiche?.(dati.attive);
        _renderDatiRichieste(dati);

    } catch (e) {
        clearTimeout(retryTimer);
        if (e.name === 'AbortError') return;
        console.error("Errore caricamento richieste:", e);
        contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento. <button onclick=\"cambiaPagina('STORICO_RICHIESTE',null)\" style=\"margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer\">Riprova</button></div>";
        applicaFade(contenitore);
    }
}

/**
 * Renderizza la pagina STORICO_RICHIESTE dai dati grezzi e aggiorna tutte le cache.
 *
 * @param {{ attive: any[], archivio: any[], fabbisogno: any[] }} _dati
 */
export function _renderDatiRichieste(_dati) {
    if (window.paginaAttuale !== 'STORICO_RICHIESTE') return;

    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    const messaggiAttivi   = _dati.attive     || [];
    const messaggiArchivio = _dati.archivio   || [];
    const fabbisognoRows   = _dati.fabbisogno || [];

    const io = utenteAttuale.nome.toUpperCase().trim();

        const raggruppa = (dati) => {
            const gruppi = {};
            dati.forEach(m => {
                if (!gruppi[m.ORDINE]) gruppi[m.ORDINE] = [];
                gruppi[m.ORDINE].push(m);
            });
            return gruppi;
        };

        const _gruppiAttiviAll   = raggruppa(messaggiAttivi);
        const _gruppiArchivioAll = raggruppa(messaggiArchivio);

        /* ── Filtro: ogni operatore vede solo thread in cui è coinvolto ── */
        const _coinvolto = (() => {
            if (_isUtenteEsente()) return () => true;          // MASTER / ALESSIO vedono tutto
            const ioN = _normNome(utenteAttuale.nome).toUpperCase();
            return (msgs) => msgs.some(m => {
                if (_normNome(m.DA || '').toUpperCase() === ioN) return true;
                // Il campo A può contenere destinatari multipli separati da virgola
                var destStr = String(m.A || '');
                return destStr.split(',').some(function(d) {
                    return _normNome(d.trim()).toUpperCase() === ioN;
                });
            });
        })();
        const _filtraGruppi = (g) => {
            const out = {};
            Object.keys(g).forEach(k => { if (_coinvolto(g[k])) out[k] = g[k]; });
            return out;
        };
        const gruppiAttivi   = _filtraGruppi(_gruppiAttiviAll);
        const gruppiArchivio = _filtraGruppi(_gruppiArchivioAll);

        // Separa per tipo — le scadenze vengono scorporate dal thread e messe in gScadenze a parte
        const gAssegnazioni = {};
        const gRichieste    = {};
        const gScadenze     = {};
        Object.keys(gruppiAttivi).forEach(nOrd => {
            const msgs = gruppiAttivi[nOrd];
            const scadMsgs = msgs.filter(m => (m.TIPO || '').toUpperCase() === 'SCADENZA');
            const restMsgs = msgs.filter(m => (m.TIPO || '').toUpperCase() !== 'SCADENZA');
            // Messaggi non-scadenza: classificati in base al primo
            if (restMsgs.length > 0) {
                const primo = restMsgs[0];
                const tipoFirst = (primo.TIPO || 'MSG').toUpperCase();
                if (tipoFirst === 'ASSEGNAZIONE') gAssegnazioni[nOrd] = restMsgs;
                else                             gRichieste[nOrd]    = restMsgs;
            }
            // Messaggi scadenza: sezione separata (chiave nOrd_scad per evitare collisioni)
            if (scadMsgs.length > 0) {
                gScadenze[nOrd + '_scad'] = scadMsgs;
            }
        });

        // Stato open/closed persistito
        const asseOpen = localStorage.getItem('_rg_assegnazioni') !== '0';
        const richOpen = localStorage.getItem('_rg_richieste') !== '0';
        const scadOpen = localStorage.getItem('_rg_scadenze')    !== '0';
        const fabbOpen = localStorage.getItem('_rg_fabbisogno_produzione') !== '0';
        const cntA = Object.keys(gAssegnazioni).length;
        const cntR = Object.keys(gRichieste).length;
        const cntS = Object.values(gScadenze).reduce((n, ms) => n + ms.length, 0);
        const cntF = fabbisognoRows.length;

        const _renderGroup = (gruppi, io) => {
            let s = '';
            Object.keys(gruppi).reverse().forEach(nOrd => {
                s += generaCardRichiesta(gruppi[nOrd], io, false);
            });
            return s || `<div class="empty-msg" style="margin:16px 0 8px">Nessun elemento.</div>`;
        };
        const _renderScadenze = () => {
            const allMsgs = Object.values(gScadenze).flat();
            allMsgs.sort((a, b) => {
                const da = _getScadDate(a), db = _getScadDate(b);
                if (!da && !db) return 0; if (!da) return 1; if (!db) return -1;
                return da - db;
            });
            return allMsgs.map(m => generaCardScadenza(m, io)).join('')
                || `<div class="empty-msg" style="margin:16px 0 8px">Nessuna scadenza.</div>`;
        };
        const _renderFabbisogno = () => {
            if (!fabbisognoRows.length) {
                return `<div class="empty-msg" style="margin:16px 0 8px">Nessun articolo attivo da produrre.</div>`;
            }
            window._fabprodCurrentRows = fabbisognoRows;
            return fabbisognoRows.map((row, idx) => {
                const pillsHtml = row.ordini.map(o => {
                    const safeOrd = o.ordine.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    const safeCli = (o.cliente || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    return `<span class="fabprod-order-pill fabprod-order-pill--click" onclick="event.stopPropagation();_fabprodApriModalOrdine('${safeOrd}','${safeCli}')">ORD. ${o.ordine}${o.cliente ? `<span class="fabprod-pill-cliente"> \u00b7 ${o.cliente}</span>` : ''}</span>`;
                }).join('');
                return `
                <div class="fabprod-card" onclick="_fabprodCardClick(${idx})">
                    <div class="fabprod-top">
                        <div class="fabprod-name">${row.codice ? `<span class="fabprod-code">${row.codice}</span>` : ''}${row.prodotto}</div>
                        <span class="fabprod-qty">${_formatQtyProduzione_(row.qty)} pz</span>
                    </div>
                    <div class="fabprod-orders">${pillsHtml}</div>
                </div>`;
            }).join('');
        };

        let htmlArchReq = '';
        if (Object.keys(gruppiArchivio).length === 0) {
            htmlArchReq = `<div class="empty-msg" style="margin:20px 0">Nessuna richiesta archiviata.</div>`;
        } else {
            Object.keys(gruppiArchivio).reverse().forEach(nOrd => {
                htmlArchReq += generaCardRichiesta(gruppiArchivio[nOrd], io, true);
            });
        }

        let html = `
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="_apriArchivio('archivio-req-details')">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>

            <div class="req-groups">

                <details id="rg-fabbisogno-produzione" class="req-group" ${fabbOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('fabbisogno_produzione', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-fabbisogno"><i class="fas fa-boxes-stacked"></i></span>
                            <span class="rg-title">FABBISOGNO PRODUZIONE</span>
                            ${cntF > 0 ? `<span class="rg-count rg-count-fabb">${cntF}</span>` : ''}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="fabprod-list">${_renderFabbisogno()}</div>
                </details>

                <details id="rg-assegnazioni" class="req-group" ${asseOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('assegnazioni', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-assegna"><i class="fas fa-arrow-right"></i></span>
                            <span class="rg-title">ASSEGNAZIONI</span>
                            ${cntA > 0 ? `<span class="rg-count">${cntA}</span>` : ''}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${_renderGroup(gAssegnazioni, io)}</div>
                </details>

                <details id="rg-richieste" class="req-group" ${richOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('richieste', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-domanda"><i class="fas fa-question"></i></span>
                            <span class="rg-title">RICHIESTE</span>
                            ${cntR > 0 ? `<span class="rg-count rg-count-dom">${cntR}</span>` : ''}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${_renderGroup(gRichieste, io)}</div>
                </details>

                ${_isUtenteEsente() ? `
                <details id="rg-scadenze" class="req-group" ${scadOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('scadenze', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-scadenza"><i class="fa-solid fa-clock"></i></span>
                            <span class="rg-title">SCADENZE</span>
                            ${cntS > 0 ? `<span class="rg-count rg-count-scad">${cntS}</span>` : ''}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${_renderScadenze()}</div>
                </details>` : ''}

            </div>

            <details id="archivio-req-details" class="archivio-details">
                <summary class="separatore-archivio archivio-summary" style="list-style:none">
                    <span>ARCHIVIO</span>
                    <i class="fas fa-chevron-down archivio-chevron"></i>
                </summary>
                <div class="chat-inbox">${htmlArchReq}</div>
            </details>`;

        contenitore.innerHTML = html;
        if (window.cacheContenuti) window.cacheContenuti['STORICO_RICHIESTE'] = html;
        if (window.cacheFetchTime) window.cacheFetchTime['STORICO_RICHIESTE'] = Date.now();
        _lsCacheSet('_html_STORICO_RICHIESTE', html); // cache cross-session
        // Salva in IndexedDB (sopravvive al reload)
        ProdCache.set('STORICO_RICHIESTE', _dati).catch(() => {});
        applicaFade(contenitore);
        window.aggiornaListaFiltrabili?.();
        window._osservaArchivio?.('archivio-req-details');

        ['universal-search', 'mobile-search'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
}
function cambiaVistaUtente(valoreSelezionato) {
    // Salviamo la vista simulata
    utenteAttuale.vistaSimulata = valoreSelezionato;

    // CRUCIALE: Cambiamo il nome attuale in base alla selezione per "ingannare" il sistema al momento dell'invio
    if (valoreSelezionato === "MASTER") {
        utenteAttuale.nome = "MASTER";
    } else {
        // Se scelgo ALESSIO, il sistema deve firmare come ALESSIO
        utenteAttuale.nome = valoreSelezionato;
    }

    // Ricarichiamo la pagina per aggiornare bolle e filtri
    caricaRichieste();
}
async function aggiornaRichiesta(idRiga, tipoAzione, tuttiIds) {
    try {
        const body = { azione: 'aggiorna_richiesta_stato', tipo: tipoAzione };
        if (tipoAzione === 'risolto' && tuttiIds && tuttiIds.length > 1) {
            body.id_righe = tuttiIds;
        } else {
            body.id_riga = idRiga;
        }
        const res = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(body) });
        const r = await res.json();
        if (r && r.status === 'auth_error') { window._gestisciAuthError_?.(r.message); return; }
        _invalidaCacheRichieste();
        caricaRichieste(); // Rinfresca la vista
    } catch (e) { notificaElegante('Errore aggiornamento.', 'error'); }
}
function _sollecitaConferma(idRiga) {
    mostraConferma('Sollecita Richiesta', 'Inviare un sollecito per questa richiesta?', () => sollecitaRichiesta(idRiga), 'Sollecita');
}
function _archiviaConferma(idRiga, tuttiIds) {
    mostraConferma('Archivia Richiesta', 'Archiviare definitivamente questa discussione?', () => aggiornaRichiesta(idRiga, 'risolto', tuttiIds), 'Archivia');
}

async function sollecitaRichiesta(idRiga) {
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'aggiorna_richiesta_stato',
                id_riga: idRiga,
                tipo: 'sollecita'
            })
        });
        const json = await res.json();
        if (json.status === 'success') {
            _invalidaCacheRichieste();
            notificaElegante('Sollecito inviato!');
            caricaRichieste();
        }
    } catch (e) {
        alert('Errore durante il sollecito.');
    }
}
function formattaData(stringaData) {
    if (!stringaData) return "N.D.";

    let d;
    // Se è un timestamp numerico
    if (!isNaN(stringaData) && typeof stringaData !== 'string') {
        d = new Date(Number(stringaData));
    } else {
        d = new Date(stringaData);
        // Se fallisce, proviamo formato italiano GG/MM/AAAA HH:MM
        if (isNaN(d.getTime())) {
            const match = String(stringaData).match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
            if (match) {
                const [, g, m, a] = match;
                const oraMatch = String(stringaData).match(/(\d{2})[:.](\d{2})/);
                const h = oraMatch ? oraMatch[1] : "00";
                const min = oraMatch ? oraMatch[2] : "00";
                d = new Date(`${a}-${m}-${g}T${h}:${min}:00`);
            }
        }
    }

    if (!d || isNaN(d.getTime())) return stringaData;

    const giorno = String(d.getDate()).padStart(2, '0');
    const mese = String(d.getMonth() + 1).padStart(2, '0');
    const anno = d.getFullYear();
    const ore = String(d.getHours()).padStart(2, '0');
    const minuti = String(d.getMinutes()).padStart(2, '0');

    // Restituisce il formato pulito
    return `${giorno}/${mese}/${anno} ${ore}:${minuti}`;
}
function generaCardRichiesta(msgs, io, isArchiviata) {
    const ultimo = msgs[msgs.length - 1]; // per id_riga, DATA ORA e riferimento (ultimo aggiornamento)
    const primo  = msgs[0];               // per tipo, mittente e destinatario originali del thread
    const nOrd = primo.ORDINE || ultimo.ORDINE;
    // Usa il CLIENTE salvato nel record; se mancante (record vecchi) prova la cache degli ordini di produzione
    const nomeCliente = primo.CLIENTE || ultimo.CLIENTE || ((_ordiniAutocompleteCache || []).find(o => o.ordine === nOrd) || {}).cliente || "";

    // Controlla se almeno un messaggio del gruppo è sollecitato
    const isSollecitata = msgs.some(m => String(m.SOLLECITO).toLowerCase() === 'true');

    // Mittente e destinatario presi dal PRIMO messaggio (le risposte non cambiano il mittente originale)
    const mittenteUnico = _normNome(primo.DA) || '\u2013';
    // Supporta destinatari multipli separati da virgola (es. "RICCARDO, FABIO T.")
    const destinatariOriginali = String(primo.A || '').split(',').map(d => _normNome(d.trim())).filter(Boolean);
    const destinatariHtml = destinatariOriginali.length > 1
        ? destinatariOriginali.map(d => `<span class="rc-val rc-val-a">${d}</span>`).join('<span style="color:#cbd5e1;margin:0 1px">,</span> ')
        : `<span class="rc-val rc-val-a">${destinatariOriginali[0] || '\u2013'}</span>`;

    // Icona tipo — usa il tipo del PRIMO messaggio, non delle risposte
    const tipoRaw = (primo.TIPO || 'MSG').toUpperCase();
    // Array di tutti gli id_riga del thread (per archiviazione bulk)
    const tuttiIds = msgs.map(m => m.id_riga).join(',');
    const isAssegnazione = tipoRaw === 'ASSEGNAZIONE';
    const tipoIconaHtml = isAssegnazione
        ? `<span class="rc-tipo rc-tipo-assegna" title="Assegnazione"><i class="fas fa-arrow-right"></i></span>`
        : `<span class="rc-tipo rc-tipo-domanda" title="Richiesta"><i class="fas fa-question"></i></span>`;

    return `
        <div class="req-card${isArchiviata ? ' archiviata' : ''}${isSollecitata ? ' sollecitata' : ''}" data-ordine="${String(nOrd || '')}" data-cliente="${(nomeCliente || '').toLowerCase().replace(/"/g, '')}" data-riferimento="${(ultimo.RIFERIMENTO || '').toLowerCase().replace(/"/g, '')}">

            <div class="rc-top">
                <div class="rc-ordine-wrap">
                    ${tipoIconaHtml}
                    <span class="rc-ordine">ORD. ${nOrd}</span>
                </div>
                ${isSollecitata ? `<span class="badge-sollecito badge-sollecito-sm"><i class="fa-solid fa-bullhorn"></i></span>` : ''}
                ${isArchiviata ? `<span class="rc-arch-badge">\u2713</span>` : ''}
            </div>

            <div class="rc-cliente">${nomeCliente || '<span class="rc-no-val">\u2013</span>'}</div>

            <div class="rc-info">
                <div class="rc-info-row">
                    <span class="rc-lbl">Da</span>
                    <span class="rc-val">${mittenteUnico}</span>
                </div>
                <div class="rc-info-row">
                    <span class="rc-lbl">A</span>
                    <div class="rc-vals-wrap">${destinatariHtml}</div>
                </div>
            </div>

            <div class="rc-foot">
                <span class="rc-date">${formattaData(ultimo["DATA ORA"])}</span>
                <span class="rc-msgcount">${msgs.length} <i class="fa-regular fa-comment"></i></span>
            </div>

            <button class="rc-expand-btn" onclick="_toggleRcBody('${ultimo.id_riga}', this)" title="Mostra/nascondi messaggi">
                <i class="fa-solid fa-chevron-down"></i>
                <span>${msgs.length === 1 ? '1 messaggio' : msgs.length + ' messaggi'}</span>
            </button>

            <div id="rc-body-${ultimo.id_riga}" class="rc-body">
                ${msgs.map(m => {
                    const amIMittente = (String(m.DA).toUpperCase().trim() === io);
                    const testo = String(m.MESSAGGIO || "").includes("|") ? m.MESSAGGIO.split("|")[1] : m.MESSAGGIO;
                    const orarioMsg = m['DATA ORA'] ? formattaData(m['DATA ORA']) : '';
                    return `
                        <div class="chat-bubble-wrapper ${amIMittente ? 'sent' : 'received'}">
                            <div class="chat-bubble">
                                <div class="chat-bubble-name">${_normNome(m.DA)}</div>
                                <div class="chat-bubble-text">${testo}</div>
                                ${orarioMsg ? `<span class="chat-bubble-time">${orarioMsg}</span>` : ''}
                            </div>
                        </div>`;
                }).join('')}
            </div>

            ${!isArchiviata ? `
                <div id="box-conferma-${ultimo.id_riga}" class="box-conferma box-hidden">
                    <div class="box-message">Archiviare definitivamente questa discussione?</div>
                    <div class="box-actions">
                        <button onclick="toggleBoxArchivia('${ultimo.id_riga}')" class="btn-cancel button-small">Annulla</button>
                        <button onclick="aggiornaRichiesta('${ultimo.id_riga}', 'risolto', [${tuttiIds}])" class="btn-archive-action button-small">S\u00ec, Archivia</button>
                    </div>
                </div>

                <div id="box-risposta-${ultimo.id_riga}" class="box-risposta box-hidden">
                    <div class="reply-wrapper">
                        <textarea id="input-risposta-${ultimo.id_riga}" class="reply-input" placeholder="Scrivi una risposta..."></textarea>
                        <div class="reply-footer">
                            <span class="reply-hint"><i class="fa-regular fa-paper-plane"></i> Risposta a <b>${_normNome(primo.DA).toUpperCase() === io ? destinatariOriginali.join(', ') : _normNome(primo.DA)}</b></span>
                            <button onclick="inviaRisposta('${ultimo.id_riga}', '${nOrd}', '${primo.DA.toUpperCase().trim() === io ? String(primo.A || '').trim() : primo.DA}', '${nomeCliente.replace(/'/g,"\\'")}')" class="btn-reply-send">
                                <i class="fa-solid fa-paper-plane"></i> Invia
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rc-actions">
                    <button onclick="_archiviaConferma('${ultimo.id_riga}', ${JSON.stringify(msgs.map(m => m.id_riga))})" class="rc-btn rc-btn-arch" title="Archivia"><i class="fa-solid fa-check"></i></button>
                    <button onclick="_sollecitaConferma('${ultimo.id_riga}')" class="rc-btn rc-btn-soll" title="Sollecita"><i class="fa-solid fa-bullhorn"></i></button>
                    <button onclick="toggleAreaRisposta('${ultimo.id_riga}')" class="rc-btn rc-btn-reply" title="Rispondi"><i class="fa-solid fa-reply"></i></button>
                    <button onclick="apriModalSollecito('${ultimo.id_riga}', '${nOrd}', '${nomeCliente.replace(/'/g,"\\'")}', '${(ultimo.RIFERIMENTO||'').replace(/'/g,"\\'")}');" class="rc-btn rc-btn-scad" title="Aggiungi scadenza"><i class="fa-solid fa-clock"></i></button>
                </div>` : ''}
        </div>`;
}

function _toggleRcBody(idRiga, btn) {
    const body = document.getElementById('rc-body-' + idRiga);
    if (!body) return;
    const isOpen = body.classList.toggle('open');
    if (btn) btn.classList.toggle('open', isOpen);
}

/* ---- SCADENZE (inviate dai commerciali) ---- */
function _getScadDate(msg) {
    const parts = String(msg.MESSAGGIO || '').split('|');
    if (parts.length >= 2) {
        const s = parts[1] || '';
        if (s.startsWith('SCAD:')) { const d = new Date(s.slice(5)); if (!isNaN(d)) return d; }
    }
    return null;
}
function generaCardScadenza(msg, io) {
    const parts   = String(msg.MESSAGGIO || '').split('|');
    let scadDate = null, nota = '\u2013';
    if (parts.length >= 2) {
        const sp = parts[1] || '';
        if (sp.startsWith('SCAD:')) { scadDate = new Date(sp.slice(5)); if (isNaN(scadDate)) scadDate = null; }
        nota = parts.slice(2).join('|').trim() || '\u2013';
    }
    const nOrd    = msg.ORDINE   || '\u2013';
    const cliente = msg.CLIENTE  || '';
    const prodotto= (msg.PRODOTTO && msg.PRODOTTO !== '') ? msg.PRODOTTO : '';
    const mitt    = _normNome(msg.DA || '');
    const dataOra = msg['DATA ORA'] || '';

    let urgClass = 'scad-ok', scadLabel = '\u2013';
    if (scadDate) {
        const diff = Math.ceil((scadDate - new Date()) / 86400000);
        scadLabel = scadDate.toLocaleDateString('it-IT', { day:'2-digit', month:'short', year:'numeric' });
        if      (diff <  0) urgClass = 'scad-scaduta';
        else if (diff <= 3) urgClass = 'scad-urgente';
        else if (diff <= 7) urgClass = 'scad-vicina';
        else                urgClass = 'scad-ok';
    }
    return `
    <div class="scad-card ${urgClass}" data-ordine="${nOrd}" data-cliente="${(cliente).toLowerCase().replace(/"/g,'')}">
        <div class="scad-top">
            <div class="scad-ordine-wrap">
                <span class="rc-tipo rc-tipo-scadenza" title="Scadenza"><i class="fa-solid fa-clock"></i></span>
                <span class="rc-ordine">ORD.&nbsp;${nOrd}</span>
                ${prodotto ? `<span class="scad-art">&bull; <b>${prodotto}</b></span>` : '<span class="scad-art scad-int-ord">intero ordine</span>'}
            </div>
            <span class="scad-date-badge ${urgClass}">${scadLabel}</span>
        </div>
        ${cliente ? `<div class="rc-cliente">${cliente}</div>` : ''}
        <div class="scad-nota">${nota !== '\u2013' ? nota : '<span class="scad-no-nota">Nessuna nota</span>'}</div>
        <div class="rc-foot">
            <span class="rc-lbl">Da</span>
            <span class="rc-val">${mitt}</span>
            <span class="rc-date" style="margin-left:auto">${formattaData(dataOra)}</span>
        </div>
        <div class="rc-actions">
            <button onclick="aggiornaRichiesta('${msg.id_riga}', 'risolto')" class="rc-btn rc-btn-arch" title="Archivia scadenza"><i class="fa-solid fa-check"></i></button>
        </div>
    </div>`;
}
/* ---- FINE SCADENZE ---- */

// ─── Registrazione globals (onclick inline su HTML) ───────────────────────────
export function registerGlobals() {
    window.chiudiModal             = chiudiModal;
    window.confermaInvioSupporto   = confermaInvioSupporto;
    window.setTipoAzione           = setTipoAzione;
    window.chiudiModalSollecito    = chiudiModalSollecito;
    window.confermaInvioSollecito  = confermaInvioSollecito;
    window.apriNuovaRichiesta      = apriNuovaRichiesta;
    window.apriModalAiuto          = apriModalAiuto;
    window.apriModalSollecito      = apriModalSollecito;
    window.toggleAreaRisposta      = toggleAreaRisposta;
    window.toggleBoxArchivia       = toggleBoxArchivia;
    window.inviaRisposta           = inviaRisposta;
    window._selezionaOrdine        = _selezionaOrdine;
    window.aggiornaBadgeRichieste  = aggiornaBadgeRichieste;
    window.aggiornaBadgeSidebar    = aggiornaBadgeRichieste; // backward compat
    window.caricaRichieste         = caricaRichieste;
    window._fetchDatiRichieste     = _fetchDatiRichieste;
    window._renderDatiRichieste    = _renderDatiRichieste;
    window._saveReqGroup           = _saveReqGroup;
    window._fabprodCardClick       = _fabprodCardClick;
    window._fabprodApriModalOrdine = _fabprodApriModalOrdine;
    window._fabprodApriModalArticolo = _fabprodApriModalArticolo;
    window._fabprodVaiOrdine       = _fabprodVaiOrdine;
    window.aggiornaRichiesta       = aggiornaRichiesta;
    window._sollecitaConferma      = _sollecitaConferma;
    window._archiviaConferma       = _archiviaConferma;
    window.sollecitaRichiesta      = sollecitaRichiesta;
    window.cambiaVistaUtente       = cambiaVistaUtente;
    window._toggleRcBody           = _toggleRcBody;
    window.formattaData            = formattaData;
    window.generaCardRichiesta     = generaCardRichiesta;
    window.generaCardScadenza      = generaCardScadenza;
    window._getScadDate            = _getScadDate;
}

// ─── Init: event listeners DOM ────────────────────────────────────────────────
export function init() {
    // FAB "+" — un solo listener 'click'.
    // Il 300ms delay è eliminato dal CSS (touch-action: manipulation).
    // Il guard in apriNuovaRichiesta() controlla il DOM (display === 'flex').
    const fabBtn = document.getElementById('btn-nuova-richiesta');
    if (fabBtn) {
        fabBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            apriNuovaRichiesta();
        });
    }

    // Chiudi modal cliccando sul backdrop (area scura esterna al box)
    // Ignora click entro 800ms dall'apertura: previene click-through da tap mobile
    const modalAiuto = document.getElementById('modalAiuto');
    if (modalAiuto) {
        modalAiuto.addEventListener('click', function(e) {
            if (e.target !== this) return;
            if (Date.now() - (this._openedAt || 0) < 800) return;  // grace period
            chiudiModal();
        });
    }

    // ── Chiudi box risposta/conferma toccando fuori dalla card (mobile) ──
    document.addEventListener('click', function(e) {
        // Se il click è dentro una req-card, non chiudere nulla
        if (e.target.closest('.req-card')) return;
        // Chiudi tutti i box-risposta e box-conferma aperti
        document.querySelectorAll('.box-risposta, .box-conferma').forEach(function(box) {
            if (box.style.display !== 'none' && box.style.display !== '') {
                box.style.opacity = '0';
                box.style.transform = 'translateY(-10px)';
                setTimeout(function() { box.style.display = 'none'; }, 300);
            }
        });
    });
}

export default caricaRichieste;
