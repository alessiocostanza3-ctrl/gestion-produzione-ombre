// PROD â€” Features / Richieste
// Estratto da script.js â€” 27 marzo 2026
// Dipendenze: ../core/config.js, ../core/cache.js, ../core/session.js, ../core/ui.js, ../core/revision-poller.js

import { URL_GOOGLE } from '../core/config.js';
import ProdCache from '../core/cache.js';
import { utenteAttuale } from '../core/session.js';
import { notificaElegante, applicaFade, mostraConferma } from '../core/ui.js';
import RevisionPoller from '../core/revision-poller.js';
import { prefetch } from '../core/state.js';
import { lsCacheGet as _lsCacheGet, lsCacheSet as _lsCacheSet, lsCacheDel as _lsCacheDel } from '../core/ls-cache.js';

// â”€â”€â”€ Stato interno â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let _ordiniAutocompleteCache = [];

// â”€â”€â”€ Stato fabbisogno compilabile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let _fabbisognoOrdiniSel   = new Set(); // ordini selezionati nel modal (reset a ogni load)
let _fabbisognoRawRows     = [];        // righe di produzione grezze per ricalcolo client-side
let _ordiniSelezionabili   = [];        // { ordine, cliente } unici, ordinati

// â”€â”€â”€ Alias _normNome (definita in script.js, dipende da _NOME_CANON) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const _normNome = n => window._normNome ? window._normNome(n) : (n ? String(n).trim() : n);

// â”€â”€â”€ Helper: invalida cache STORICO_RICHIESTE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _invalidaCacheRichieste() {
    if (window.cacheContenuti)  delete window.cacheContenuti['STORICO_RICHIESTE'];
    if (window.cacheFetchTime)  delete window.cacheFetchTime['STORICO_RICHIESTE'];
    _lsCacheDel('_html_STORICO_RICHIESTE');
    prefetch.rqBundle = null;
    prefetch.rqPromise = null;
    ProdCache.invalidate('STORICO_RICHIESTE').catch(() => {});
}

function _persistRichiesteHtmlSnapshot() {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    if (window.cacheContenuti) window.cacheContenuti['STORICO_RICHIESTE'] = contenitore.innerHTML;
    if (window.cacheFetchTime) window.cacheFetchTime['STORICO_RICHIESTE'] = Date.now();
    _lsCacheSet('_html_STORICO_RICHIESTE', contenitore.innerHTML);
}

function _removeRichiestaCardOptimistic(idRiga) {
    const selectors = [
        `.req-card[data-id-riga="${CSS.escape(String(idRiga))}"]`,
        `.scad-card[data-id-riga="${CSS.escape(String(idRiga))}"]`,
        `#box-conferma-${CSS.escape(String(idRiga))}`,
        `#box-risposta-${CSS.escape(String(idRiga))}`,
        `#rc-body-${CSS.escape(String(idRiga))}`
    ];
    for (const sel of selectors) {
        const el = document.querySelector(sel);
        const card = el?.classList?.contains('req-card') || el?.classList?.contains('scad-card') ? el : el?.closest('.req-card, .scad-card');
        if (card) {
            // Aggiorna il badge contatore del gruppo padre (rg-count)
            const group = card.closest('.req-group');
            if (group) {
                const countEl = group.querySelector('.rg-count');
                if (countEl) {
                    const prev = parseInt(countEl.textContent, 10) || 0;
                    if (prev <= 1) { countEl.remove(); }
                    else { countEl.textContent = prev - 1; }
                }
            }
            card.remove();
            return true;
        }
    }
    return false;
}

// â”€â”€â”€ Helper: verifica se utente Ã¨ esente (ALESSIO/MASTER) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _isUtenteEsente() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const nome = utenteAttuale.nome.toUpperCase();
    return nome === 'ALESSIO' || nome === '0000' || utenteAttuale.ruolo === 'MASTER';
}

// â”€â”€â”€ Badge richieste su sidebar e bottom nav â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function aggiornaBadgeRichieste(messaggi) {
    const badgeSidebar = document.getElementById('badge-richieste-count');
    const nomeSidebar  = document.getElementById('nome-utente-sidebar');
    const imgAvatar    = document.getElementById('img-avatar-sidebar');

    if (!badgeSidebar) return;

    const vistaAttiva = (utenteAttuale.vistaSimulata || 'MASTER').toUpperCase().trim();

    if (nomeSidebar) nomeSidebar.innerText = vistaAttiva;
    if (imgAvatar)   imgAvatar.src = `https://ui-avatars.com/api/?name=${vistaAttiva}&background=2563eb&color=fff`;

    // Se si Ã¨ giÃ  sulla pagina richieste, il badge rimane nascosto
    if (window.paginaAttuale === 'STORICO_RICHIESTE') {
        badgeSidebar.style.display = 'none';
        badgeSidebar.classList.remove('badge-sollecito-attivo');
        return;
    }

    const rilevanti = messaggi.filter(m => {
        const nonRisolto = String(m.RISOLTO).toLowerCase() !== 'true';
        if (vistaAttiva === 'MASTER') return nonRisolto;
        // Il campo A puÃ² contenere destinatari multipli separati da virgola
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
    if (modal.style.display === 'flex') return;  // guard: giÃ  aperto

    modal._openedAt = Date.now();   // grace-period backdrop
    modal.style.display = 'flex';
    modal.offsetHeight; // Forza il reflow per l'animazione
    modal.classList.add('active');

    // Titolo piÃ¹ coerente: Messaggio invece di Supporto
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

    // Reset del campo testo â€” modal sempre in modalitÃ  DOMANDA
    document.getElementById('messaggio-aiuto').value = "";
    setTipoAzione('DOMANDA');
}

// Apri modal per creare una nuova richiesta libera (da bottom nav "+")
// Supporta opzioni = { ordine, cliente, prodotto } per precompilazione da riga produzione
export function apriNuovaRichiesta(opzioni = {}) {
    const modal = document.getElementById('modalAiuto');
    // Guard DOM-based: se il modal Ã¨ giÃ  visibile (aperto o in fase di chiusura), non fare nulla
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
        fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ pagina: 'PROGRAMMA PRODUZIONE DEL MESE' }) })
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
    // Aggiorna il dataset del modal affinchÃ© confermaInvioSupporto usi il valore corretto
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

    // 1. Porta subito display a '' cosÃ¬ il guard DOM blocca riaperture durante il fade-out
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

    // â”€â”€ Chiudi subito il modal e dai feedback immediato â”€â”€
    document.getElementById('messaggio-aiuto').value = '';
    chiudiModal();
    notificaElegante(tipoAzione === 'ASSEGNAZIONE' ? '\u2705 Assegnazione inviata' : '\u2705 Richiesta inviata');

    // Invalida cache richieste in anticipo (client-side + prefetch bundle)
    _invalidaCacheRichieste();

    // â”€â”€ Fire-and-forget: entrambe le chiamate in background â”€â”€
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
        tipoAzione === 'ASSEGNAZIONE' ? fetch(urlAssegnazione).catch(() => notificaElegante('Errore assegnazione operatore.', 'error')) : Promise.resolve(),
        fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) }).catch(() => notificaElegante('Errore invio richiesta.', 'error'))
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
            // Scroll al box dopo che la tastiera iOS si Ã¨ aperta (~400ms)
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
    // â”€â”€ Reset UI immediato â”€â”€
    input.value = '';
    toggleAreaRisposta(idRiga); // chiude il box risposta subito
    notificaElegante('\u2705 Risposta inviata');

    // Invalida cache in anticipo
    _invalidaCacheRichieste();

    // â”€â”€ Fire-and-forget â”€â”€
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
        .catch(() => notificaElegante('Errore invio risposta.', 'error'));
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

// â”€â”€ Fabbisogno Produzione: navigazione e modals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

function _fabprodEscHtml_(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function _fabprodBuildPrintRows_() {
    const grouped = new Map();
    for (const riga of (_fabbisognoRawRows || [])) {
        if (!riga || !riga.ordine) continue;
        if (String(riga.archiviato || '').toUpperCase() === 'TRUE') continue;
        if (_isStatoEsclusoFabbisogno_(riga.stato)) continue;
        const ordine = String(riga.ordine || '').trim();
        if (!ordine || !_fabbisognoOrdiniSel.has(ordine)) continue;

        const qtyTotale = _parseQtyProduzione_(riga.qty);
        const qtyEvasa = _parseQtyProduzione_(riga.qty_evasa);
        const qtyNetta = Math.max(qtyTotale - qtyEvasa, 0);
        if (qtyNetta <= 0) continue;

        const prodotto = String(riga.prodotto || '').trim();
        if (!prodotto) continue;

        const codice = String(riga.codice || '').trim();
        const descrizione = String(
            riga.descrizione || riga.dettaglio || riga.riferimento || riga.rif_articolo || riga.note || ''
        ).trim();

        const key = `${codice.toUpperCase()}|${prodotto.toUpperCase()}`;
        if (!grouped.has(key)) {
            grouped.set(key, {
                codice,
                prodotto,
                descrizione,
                qtyTotale: 0,
                ordiniMap: new Map() // key=ordine, value={ ordine, cliente, qty }
            });
        }

        const entry = grouped.get(key);
        entry.qtyTotale += qtyNetta;
        if (!entry.descrizione && descrizione) entry.descrizione = descrizione;

        const cliente = String(riga.cliente || '').trim();
        if (!entry.ordiniMap.has(ordine)) {
            entry.ordiniMap.set(ordine, { ordine, cliente, qty: 0 });
        }
        entry.ordiniMap.get(ordine).qty += qtyNetta;
    }

    const rows = [...grouped.values()].map(entry => {
        const ordini = [...entry.ordiniMap.values()].sort((a, b) =>
            a.ordine.localeCompare(b.ordine, 'it', { numeric: true, sensitivity: 'base' })
        );
        const addendi = ordini.map(o => _formatQtyProduzione_(o.qty));
        const formulaQty = ordini.length > 1
            ? `${addendi.join(' + ')} = ${_formatQtyProduzione_(entry.qtyTotale)}`
            : _formatQtyProduzione_(entry.qtyTotale);

        return {
            codice: entry.codice,
            prodotto: entry.prodotto,
            descrizione: entry.descrizione,
            ordini,
            qtyTotale: entry.qtyTotale,
            formulaQty
        };
    });

    rows.sort((a, b) => {
        const prodCmp = a.prodotto.localeCompare(b.prodotto, 'it', { sensitivity: 'base' });
        if (prodCmp !== 0) return prodCmp;
        return (a.codice || '').localeCompare(b.codice || '', 'it', { sensitivity: 'base' });
    });

    return rows;
}

function _fabprodBuildPrintHtml_(rows) {
    const generatedAt = new Date();
    const ordini = [..._fabbisognoOrdiniSel].sort((a, b) => a.localeCompare(b, 'it', { numeric: true, sensitivity: 'base' }));
    const ordiniLabel = ordini.length <= 6
        ? ordini.join(', ')
        : `${ordini.slice(0, 6).join(', ')} +${ordini.length - 6}`;
    const totaleQty = rows.reduce((sum, r) => sum + (Number(r.qtyTotale) || 0), 0);

    const bodyRows = rows.map(r => `
        <tr>
            <td>${_fabprodEscHtml_(r.codice || '-')}</td>
            <td>${_fabprodEscHtml_(r.prodotto)}</td>
            <td>${_fabprodEscHtml_(r.descrizione || '-')}</td>
            <td>${r.ordini.map(o => `ORD. ${_fabprodEscHtml_(o.ordine)}${o.cliente ? ` · ${_fabprodEscHtml_(o.cliente)}` : ''}`).join('<br>')}</td>
            <td class="qty">${_fabprodEscHtml_(r.formulaQty)}</td>
        </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fabbisogno per ordini: ${_fabprodEscHtml_(ordiniLabel)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Roboto:wght@400;500;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --ink:#0f172a; --muted:#64748b; --line:#cbd5e1; --paper:#fff; --bg:#e5e7eb; }
        * { box-sizing: border-box; }
        html, body { margin:0; padding:0; background:var(--bg); color:var(--ink); font-family:'Roboto','Segoe UI',sans-serif; }
        .toolbar {
            position: sticky; top: 0; z-index: 9;
            display:flex; align-items:center; justify-content:space-between; gap:12px;
            padding:14px 18px; background:rgba(15,23,42,0.96); color:#fff;
        }
        .toolbar-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
        .toolbar-actions { display:flex; gap:8px; }
        .toolbar button {
            border:1px solid rgba(255,255,255,.16); border-radius:999px; padding:10px 16px;
            font-size:12px; font-weight:700; cursor:pointer;
            background:#fff; color:#0f172a;
        }
        .toolbar .ghost { background:transparent; color:#fff; }
        .stage { padding:28px 18px 46px; }
        .page {
            width:210mm; min-height:297mm; margin:0 auto; background:var(--paper);
            box-shadow:0 24px 50px rgba(15,23,42,.14); padding:18mm 16mm 14mm;
        }
        .title { font-family:'Lora', Georgia, serif; font-size:38px; font-weight:700; line-height:1.05; }
        .subtitle { margin-top:4px; color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.06em; }
        .meta { margin-top:14px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
        .meta-card { border:1px solid var(--line); background:#f8fafc; padding:10px 12px; }
        .meta-k { color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:.06em; font-weight:700; }
        .meta-v { color:var(--ink); font-size:13px; margin-top:4px; font-weight:700; }
        .orders { margin-top:12px; padding:10px 12px; border:1px dashed var(--line); color:#334155; font-size:12px; }
        .orders strong { color:#0f172a; }
        table { width:100%; border-collapse:collapse; margin-top:14px; border:1px solid #94a3b8; }
        th, td { border:1px solid var(--line); padding:8px; font-size:12px; vertical-align:top; }
        th { background:#f8fafc; text-align:left; font-size:10px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); }
        td.qty { text-align:right; font-weight:800; }
        .footer { margin-top:12px; color:var(--muted); font-size:11px; }
        @page { size:A4; margin:12mm; }
        @media print {
            html, body { background:#fff; }
            .toolbar { display:none !important; }
            .stage { padding:0; }
            .page { width:auto; min-height:auto; margin:0; box-shadow:none; padding:0; }
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <div class="toolbar-title">Fabbisogno per ordini</div>
        <div class="toolbar-actions">
            <button type="button" onclick="window.print()">Stampa</button>
            <button type="button" class="ghost" onclick="window.close()">Chiudi</button>
        </div>
    </div>
    <div class="stage">
        <div class="page">
            <div class="title">Fabbisogno per ordini</div>
            <div class="subtitle">Documento operativo per produzione e approvvigionamento</div>
            <div class="meta">
                <div class="meta-card"><div class="meta-k">Data emissione</div><div class="meta-v">${_fabprodEscHtml_(generatedAt.toLocaleString('it-IT'))}</div></div>
                <div class="meta-card"><div class="meta-k">Ordini selezionati</div><div class="meta-v">${_fabprodEscHtml_(String(ordini.length))}</div></div>
                <div class="meta-card"><div class="meta-k">Totale quantità</div><div class="meta-v">${_fabprodEscHtml_(_formatQtyProduzione_(totaleQty))} pz</div></div>
            </div>
            <div class="orders"><strong>Fabbisogno per ordini:</strong> ${_fabprodEscHtml_(ordiniLabel)}</div>
            <table>
                <thead>
                    <tr>
                        <th style="width:12%">Codice</th>
                        <th style="width:24%">Prodotto</th>
                        <th>Descrizione</th>
                        <th style="width:26%">Ordini di riferimento</th>
                        <th style="width:16%">Quantità totale</th>
                    </tr>
                </thead>
                <tbody>${bodyRows || '<tr><td colspan="5">Nessuna riga disponibile per la stampa.</td></tr>'}</tbody>
            </table>
            <div class="footer">Generato da PROD - ${_fabprodEscHtml_(String(utenteAttuale?.nome || 'Sistema'))}</div>
        </div>
    </div>
</body>
</html>`;
}

function _fabprodStampaFabbisognoSel() {
    if (!_fabbisognoOrdiniSel.size) {
        notificaElegante('Seleziona almeno un ordine prima di stampare il fabbisogno.', 'warning');
        return;
    }
    const rows = _fabprodBuildPrintRows_();
    if (!rows.length) {
        notificaElegante('Nessuna riga utile da stampare per gli ordini selezionati.', 'warning');
        return;
    }
    const win = window.open('', '_blank');
    if (!win) {
        notificaElegante('Popup bloccato: abilita l\'anteprima di stampa.', 'warning');
        return;
    }
    win.document.open();
    win.document.write(_fabprodBuildPrintHtml_(rows));
    win.document.close();
    win.focus();
}

// â”€â”€â”€ Fabbisogno compilabile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function _aggiornaPannelloFabbisogno() {
    const listEl   = document.getElementById('fabprod-list');
    const badgeSel = document.getElementById('fabprod-sel-badge');
    const badgeCnt = document.getElementById('fabprod-cnt-badge');
    if (!listEl) return;

    const rawFiltrate = _fabbisognoRawRows.filter(r => {
        if (!r || !r.ordine) return false;
        return _fabbisognoOrdiniSel.has(String(r.ordine).trim());
    });
    const rows = _buildFabbisognoProduzioneRows_(rawFiltrate);

    // Aggiorna lista con mini-render inline (non _renderFabbisogno di closure)
    if (!rows.length) {
        listEl.innerHTML = _fabbisognoOrdiniSel.size === 0
            ? `<div class="fabprod-empty-sel"><i class="fas fa-hand-pointer fabprod-empty-sel-icon"></i><div class="fabprod-empty-sel-text">Seleziona gli ordini per vedere il fabbisogno</div></div>`
            : `<div class="empty-msg" style="margin:16px 0 8px">Nessun articolo attivo per gli ordini selezionati.</div>`;
    } else {
        window._fabprodCurrentRows = rows;
        listEl.innerHTML = rows.map((row, idx) => {
            const pillsHtml = row.ordini.map(o => {
                const safeOrd = o.ordine.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                const safeCli = (o.cliente || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                return `<span class="fabprod-order-pill fabprod-order-pill--click" onclick="event.stopPropagation();_fabprodApriModalOrdine('${safeOrd}','${safeCli}')">ORD. ${o.ordine}${o.cliente ? `<span class="fabprod-pill-cliente"> \u00b7 ${o.cliente}</span>` : ''}</span>`;
            }).join('');
            const breakdownHtml = row.ordini.length > 1
                ? `<div class="fabprod-qty-breakdown">${row.ordini.map(o => `${_formatQtyProduzione_(o.qty)}\u00a0(${o.ordine})`).join(' + ')}</div>`
                : '';
            return `<div class="fabprod-card" onclick="_fabprodCardClick(${idx})">
                <div class="fabprod-top">
                    <div class="fabprod-name">${row.codice ? `<span class="fabprod-code">${row.codice}</span>` : ''}${row.prodotto}</div>
                    <span class="fabprod-qty">${_formatQtyProduzione_(row.qty)} pz</span>
                </div>
                ${breakdownHtml}
                <div class="fabprod-orders">${pillsHtml}</div>
            </div>`;
        }).join('');
    }

    // Badge "N selezionati" nel bottone
    const nSel = _fabbisognoOrdiniSel.size;
    if (badgeSel) {
        badgeSel.textContent = nSel;
        badgeSel.style.display = nSel > 0 ? '' : 'none';
    }
    // Badge conteggio articoli nella summary
    if (badgeCnt) {
        badgeCnt.textContent = rows.length;
        badgeCnt.style.display = rows.length > 0 ? '' : 'none';
    }
    const printBtn = document.getElementById('fabprod-print-btn');
    if (printBtn) printBtn.disabled = _fabbisognoOrdiniSel.size === 0;
}

function _apriModalFabbisognoSel() {
    document.getElementById('fabprod-sel-modal')?.remove();

    const buildItemsHtml = (filter) => {
        const q = (filter || '').trim().toLowerCase();
        const list = q
            ? _ordiniSelezionabili.filter(o =>
                o.ordine.toLowerCase().includes(q) ||
                (o.cliente || '').toLowerCase().includes(q))
            : _ordiniSelezionabili;

        if (!list.length && !_ordiniSelezionabili.length) {
            return `<div class="empty-msg" style="margin:16px 0">Nessun ordine attivo disponibile.</div>`;
        }
        if (!list.length) {
            return `<div class="empty-msg" style="margin:16px 0">Nessun ordine trovato.</div>`;
        }
        return list.map(o => {
            const checked = _fabbisognoOrdiniSel.has(o.ordine) ? ' checked' : '';
            const safeOrd = o.ordine.replace(/"/g, '&quot;');
            return `<label class="fabprod-sel-item${checked ? ' fabprod-sel-item--checked' : ''}">
                <input type="checkbox" class="fabprod-sel-chk" value="${safeOrd}"${checked}>
                <div class="fabprod-sel-item-info">
                    <span class="fabprod-sel-ord">ORD. ${o.ordine}</span>
                    ${o.cliente ? `<span class="fabprod-sel-cli">${o.cliente}</span>` : ''}
                </div>
            </label>`;
        }).join('');
    };

    const el = document.createElement('div');
    el.id = 'fabprod-sel-modal';
    el.className = 'fabprod-sel-modal-overlay';
    el.innerHTML = `
        <div class="fabprod-sel-modal-box">
            <div class="fabprod-sel-modal-header">
                <span><i class="fas fa-sliders"></i> Seleziona ordini</span>
                <button type="button" class="fabprod-sel-modal-close" onclick="_chiudiModalFabbisognoSel()"><i class="fas fa-times"></i></button>
            </div>
            <div class="fabprod-sel-search-wrap">
                <i class="fas fa-search fabprod-sel-search-icon"></i>
                <input type="text" class="fabprod-sel-search" id="fabprod-sel-search"
                    placeholder="Cerca per ordine o cliente..." autocomplete="off">
            </div>
            <div class="fabprod-sel-modal-body" id="fabprod-sel-modal-body">
                ${buildItemsHtml('')}
            </div>
            <div class="fabprod-sel-footer">
                <button type="button" class="fabprod-sel-btn-cancel" onclick="_chiudiModalFabbisognoSel()">Annulla</button>
                <button type="button" class="fabprod-sel-btn-apply" id="fabprod-sel-apply" onclick="_applicaSelFabbisogno()">Applica</button>
            </div>
        </div>`;

    // Aggiorna badge Applica al cambio checkbox
    el.addEventListener('change', e => {
        if (!e.target.classList.contains('fabprod-sel-chk')) return;
        // toggle classe --checked sulla label
        e.target.closest('.fabprod-sel-item')?.classList.toggle('fabprod-sel-item--checked', e.target.checked);
        const n = el.querySelectorAll('.fabprod-sel-chk:checked').length;
        const btn = el.querySelector('#fabprod-sel-apply');
        if (btn) btn.textContent = n > 0 ? `Applica (${n})` : 'Applica';
    });

    // Ricerca in tempo reale
    el.addEventListener('input', e => {
        if (e.target.id !== 'fabprod-sel-search') return;
        // Prima salva lo stato corrente delle checkbox visibili
        el.querySelectorAll('.fabprod-sel-chk').forEach(chk => {
            if (chk.checked) _fabbisognoOrdiniSel.add(chk.value);
            else _fabbisognoOrdiniSel.delete(chk.value);
        });
        const body = el.querySelector('#fabprod-sel-modal-body');
        if (body) body.innerHTML = buildItemsHtml(e.target.value);
        const n = _fabbisognoOrdiniSel.size;
        const btn = el.querySelector('#fabprod-sel-apply');
        if (btn) btn.textContent = n > 0 ? `Applica (${n})` : 'Applica';
    });

    // Inizializza conteggio
    const initN = _fabbisognoOrdiniSel.size;
    const applyBtn = el.querySelector('#fabprod-sel-apply');
    if (applyBtn && initN > 0) applyBtn.textContent = `Applica (${initN})`;

    el.addEventListener('click', e => { if (e.target === el) _chiudiModalFabbisognoSel(); });
    document.body.appendChild(el);
    requestAnimationFrame(() => {
        el.classList.add('fabprod-sel-modal-overlay--in');
        el.querySelector('#fabprod-sel-search')?.focus();
    });
}

function _applicaSelFabbisogno() {
    const modal = document.getElementById('fabprod-sel-modal');
    if (!modal) return;
    _fabbisognoOrdiniSel = new Set(
        [...modal.querySelectorAll('.fabprod-sel-chk:checked')].map(c => c.value)
    );
    _chiudiModalFabbisognoSel();
    _aggiornaPannelloFabbisogno();
}

function _chiudiModalFabbisognoSel() {
    document.getElementById('fabprod-sel-modal')?.remove();
}

function _fabprodApriSezioneDaScadenze_() {
    const details = document.getElementById('rg-fabbisogno-produzione');
    if (!details) return;
    if (!details.open) {
        details.open = true;
        _saveReqGroup('fabbisogno_produzione', details);
    }
    details.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function _fabprodOrdiniDaScadenze_(onlyFlaggati) {
    const cards = [...document.querySelectorAll('.scad-card[data-ordine]')];
    if (!cards.length) return [];

    const allOrdiniAttivi = new Set((_ordiniSelezionabili || []).map(o => String(o.ordine || '').trim()));
    const ordini = [];

    cards.forEach(card => {
        const chk = card.querySelector('.scad-fab-chk');
        if (onlyFlaggati && !chk?.checked) return;
        const ordine = String(card.dataset.ordine || '').trim();
        if (!ordine || !allOrdiniAttivi.has(ordine)) return;
        ordini.push(ordine);
    });

    return [...new Set(ordini)].sort((a, b) => a.localeCompare(b, 'it', { numeric: true, sensitivity: 'base' }));
}

function _fabprodDaScadenzeTutte() {
    const ordini = _fabprodOrdiniDaScadenze_(false);
    if (!ordini.length) {
        notificaElegante('Nessuna scadenza utile trovata per creare il fabbisogno.', 'warning');
        return;
    }
    _fabbisognoOrdiniSel = new Set(ordini);
    _aggiornaPannelloFabbisogno();
    _fabprodApriSezioneDaScadenze_();
    notificaElegante(`Fabbisogno impostato su ${ordini.length} ordini da scadenze.`, 'success');
}

function _fabprodDaScadenzeFlaggate() {
    const ordini = _fabprodOrdiniDaScadenze_(true);
    if (!ordini.length) {
        notificaElegante('Flagga almeno una scadenza per creare il fabbisogno.', 'warning');
        return;
    }
    _fabbisognoOrdiniSel = new Set(ordini);
    _aggiornaPannelloFabbisogno();
    _fabprodApriSezioneDaScadenze_();
    notificaElegante(`Fabbisogno impostato su ${ordini.length} ordini selezionati.`, 'success');
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
            if (!entry.ordini.has(nOrd)) {
                entry.ordini.set(nOrd, { cliente: cli, qty: 0 });
            }
            entry.ordini.get(nOrd).qty += qtyNetta;
        }
    });

    return Array.from(grouped.values())
        .map(entry => ({
            prodotto: entry.prodotto,
            codice: entry.codice,
            qty: entry.qty,
            ordini: Array.from(entry.ordini.entries())
                .map(([ord, { cliente, qty }]) => ({ ordine: ord, cliente, qty }))
                .sort((a, b) => a.ordine.localeCompare(b.ordine, 'it'))
        }))
        .sort((a, b) => (a.codice || '').localeCompare(b.codice || '', 'it', { sensitivity: 'base' }));
}

async function _loadFabbisognoRawRows_() {
    const attiviProd = window._attiviProd;
    if (Array.isArray(attiviProd) && attiviProd.length) {
        return attiviProd;
    }

    let dashBundle = null;
    if (prefetch.dashBundle) {
        dashBundle = prefetch.dashBundle;
        prefetch.dashBundle = null;
        prefetch.dashPromise = null;
    } else if (prefetch.dashPromise) {
        dashBundle = await prefetch.dashPromise;
        prefetch.dashBundle = null;
        prefetch.dashPromise = null;
    } else {
        const dashResp = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'getAllDashboard', includeArchivio: false })
        });
        if (!dashResp.ok) throw new Error(`HTTP ${dashResp.status}`);
        dashBundle = await dashResp.json();
    }

    return (dashBundle && dashBundle.produzione) || [];
}

async function _loadFabbisognoProduzioneRows_() {
    return _buildFabbisognoProduzioneRows_(await _loadFabbisognoRawRows_());
}

/** Fetch del bundle richieste (+ fabbisogno produzione) dal GAS o dal prefetch in volo. */
export async function _fetchDatiRichieste(signal = null) {
    async function _fetchRqBundle_() {
        if (prefetch.rqBundle) {
            const b = prefetch.rqBundle;
            prefetch.rqBundle = null;
            prefetch.rqPromise = null;
            return b;
        }
        if (prefetch.rqPromise) {
            const b = await prefetch.rqPromise;
            prefetch.rqBundle = null;
            prefetch.rqPromise = null;
            return b;
        }
        const resp = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'getAllRichieste' }),
            ...(signal ? { signal } : {})
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
    }
    const [bundle, fabbisognoRaw] = await Promise.all([
        _fetchRqBundle_(),
        _loadFabbisognoRawRows_().catch(e => { console.warn('Fabbisogno Produzione non disponibile:', e); return []; })
    ]);
    if (!bundle) throw new Error('bundle vuoto');
    const fabbisogno = _buildFabbisognoProduzioneRows_(fabbisognoRaw);
    return { attive: bundle.attive || [], archivio: bundle.archivio || [], fabbisogno, fabbisognoRaw };
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

    const messaggiAttivi   = _dati.attive        || [];
    const messaggiArchivio = _dati.archivio      || [];
    const fabbisognoRows   = _dati.fabbisogno    || [];

    // Inizializza stato fabbisogno compilabile (reset a ogni render)
    _fabbisognoRawRows   = _dati.fabbisognoRaw || [];
    _fabbisognoOrdiniSel = new Set();
    // Costruisce lista ordini selezionabili: unici, non esclusi, ordinati per numero ordine
    {
        const seenOrd = new Set();
        _ordiniSelezionabili = [];
        for (const riga of _fabbisognoRawRows) {
            if (!riga || !riga.ordine) continue;
            if (String(riga.archiviato || '').toUpperCase() === 'TRUE') continue;
            if (_isStatoEsclusoFabbisogno_(riga.stato)) continue;
            const nOrd = String(riga.ordine).trim();
            if (!nOrd || seenOrd.has(nOrd)) continue;
            seenOrd.add(nOrd);
            _ordiniSelezionabili.push({ ordine: nOrd, cliente: String(riga.cliente || '').trim() });
        }
        _ordiniSelezionabili.sort((a, b) => a.ordine.localeCompare(b.ordine, 'it'));
    }

    const io = (utenteAttuale?.nome || '').toUpperCase().trim();

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

        /* â”€â”€ Filtro: ogni operatore vede solo thread in cui Ã¨ coinvolto â”€â”€ */
        const _coinvolto = (() => {
            if (_isUtenteEsente()) return () => true;          // MASTER / ALESSIO vedono tutto
            const ioN = _normNome(utenteAttuale?.nome || '').toUpperCase();
            return (msgs) => msgs.some(m => {
                if (_normNome(m.DA || '').toUpperCase() === ioN) return true;
                // Il campo A puÃ² contenere destinatari multipli separati da virgola
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

        // Separa per tipo â€” le scadenze vengono scorporate dal thread e messe in gScadenze a parte
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
        const _renderFabbisogno = (rows) => {
            if (!rows || !rows.length) {
                if (_fabbisognoOrdiniSel.size === 0) {
                    return `<div class="fabprod-empty-sel">
                        <i class="fas fa-hand-pointer fabprod-empty-sel-icon"></i>
                        <div class="fabprod-empty-sel-text">Seleziona gli ordini per vedere il fabbisogno</div>
                    </div>`;
                }
                return `<div class="empty-msg" style="margin:16px 0 8px">Nessun articolo attivo per gli ordini selezionati.</div>`;
            }
            window._fabprodCurrentRows = rows;
            return rows.map((row, idx) => {
                const pillsHtml = row.ordini.map(o => {
                    const safeOrd = o.ordine.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    const safeCli = (o.cliente || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    return `<span class="fabprod-order-pill fabprod-order-pill--click" onclick="event.stopPropagation();_fabprodApriModalOrdine('${safeOrd}','${safeCli}')">ORD. ${o.ordine}${o.cliente ? `<span class="fabprod-pill-cliente"> \u00b7 ${o.cliente}</span>` : ''}</span>`;
                }).join('');
                const breakdownHtml = row.ordini.length > 1
                    ? `<div class="fabprod-qty-breakdown">${row.ordini.map(o => `${_formatQtyProduzione_(o.qty)}\u00a0(${o.ordine})`).join(' + ')}</div>`
                    : '';
                return `
                <div class="fabprod-card" onclick="_fabprodCardClick(${idx})">
                    <div class="fabprod-top">
                        <div class="fabprod-name">${row.codice ? `<span class="fabprod-code">${row.codice}</span>` : ''}${row.prodotto}</div>
                        <span class="fabprod-qty">${_formatQtyProduzione_(row.qty)} pz</span>
                    </div>
                    ${breakdownHtml}
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
                            <span class="rg-count rg-count-fabb" id="fabprod-cnt-badge" style="${_fabbisognoOrdiniSel.size > 0 && fabbisognoRows.length > 0 ? '' : 'display:none'}">0</span>
                        </span>
                        <span class="fabprod-actions-wrap">
                            <button type="button" class="fabprod-sel-btn" id="fabprod-sel-btn"
                                onclick="event.stopPropagation();_apriModalFabbisognoSel()">
                                <i class="fas fa-sliders"></i>
                                Seleziona ordini
                                <span class="fabprod-sel-badge" id="fabprod-sel-badge" style="display:none">0</span>
                            </button>
                            <button type="button" class="fabprod-print-btn" id="fabprod-print-btn"
                                onclick="event.stopPropagation();_fabprodStampaFabbisognoSel()" disabled>
                                <i class="fas fa-print"></i>
                                Stampa
                            </button>
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="fabprod-list" id="fabprod-list">${_renderFabbisogno([])}</div>
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

                <details id="rg-scadenze" class="req-group" ${scadOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('scadenze', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-scadenza"><i class="fa-solid fa-clock"></i></span>
                            <span class="rg-title">SCADENZE</span>
                            ${cntS > 0 ? `<span class="rg-count rg-count-scad">${cntS}</span>` : ''}
                        </span>
                        <span class="scad-actions-wrap">
                            <button type="button" class="scad-fab-btn"
                                onclick="event.stopPropagation();_fabprodDaScadenzeTutte()"
                                ${cntS > 0 ? '' : 'disabled'}>
                                <i class="fas fa-layer-group"></i> Tutte -> Fabbisogno
                            </button>
                            <button type="button" class="scad-fab-btn"
                                onclick="event.stopPropagation();_fabprodDaScadenzeFlaggate()"
                                ${cntS > 0 ? '' : 'disabled'}>
                                <i class="fas fa-check-square"></i> Flaggate -> Fabbisogno
                            </button>
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${_renderScadenze()}</div>
                </details>

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
// â”€â”€â”€ Sync Richieste â†’ Produzione â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Pulisce ottimisticamente l'assegnazione dal DOM di Produzione (se caricato)
 * e aggiorna _attiviProd in-memory.
 */
function _clearAssegnazioneProduzione(nOrd) {
    if (!nOrd) return;
    // Aggiorna _attiviProd in-memory via funzione esposta da produzione.js
    if (typeof window._setAssegnaLocalByOrdine === 'function') {
        window._setAssegnaLocalByOrdine(nOrd, '');
    }
    // Aggiorna il DOM della pagina Produzione se l'ordine Ã¨ attualmente nel DOM
    const wrapper = document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(nOrd)}"]`);
    if (wrapper) {
        // Celle singola riga: visualizza-operatori e op-dropdown
        wrapper.querySelectorAll('.visualizza-operatori').forEach(cont => {
            cont.dataset.assegna = '';
            cont.innerHTML = '<span class="operatore-libero">Libero</span>';
        });
        wrapper.querySelectorAll('.op-dropdown[data-id-riga]').forEach(d => {
            d.dataset.assegna = '';
            const lbl = d.querySelector('.op-trigger-label');
            if (lbl) lbl.textContent = 'Libero';
            d.querySelectorAll('.op-option').forEach(o => {
                o.classList.remove('is-selected');
                o.querySelector('.op-check-icon')?.remove();
            });
        });
        // Header ordine: op-dropdown-ord
        const headDd = wrapper.querySelector('.op-dropdown-ord');
        if (headDd) {
            headDd.dataset.assegnaOrd = '';
            const lbl = headDd.querySelector('.op-trigger-label');
            if (lbl) lbl.textContent = 'Libero';
            headDd.querySelectorAll('.op-option').forEach(o => {
                o.classList.remove('is-selected');
                o.querySelector('.op-check-icon')?.remove();
            });
        }
    }
    // Refresh carico operatori + overview
    if (typeof window._repaintOpColors === 'function') window._repaintOpColors();
    if (typeof window._refreshOverview === 'function') window._refreshOverview();
}

/**
 * Fire-and-forget: salva assegna='' nel backend per l'ordine specificato.
 */
async function _sincronizzaCancellaAssegna(nOrd) {
    try {
        const mitt = (utenteAttuale?.nome || '').toUpperCase().trim();
        await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'assegnaOperatori', ordine: nOrd, operatori: '', mittente: mitt }) });
    } catch (e) {
        console.warn('[_sincronizzaCancellaAssegna] Errore:', e);
    }
}

async function aggiornaRichiesta(idRiga, tipoAzione, tuttiIds) {
    const contenitore = document.getElementById('contenitore-dati');
    const prevHtml = contenitore ? contenitore.innerHTML : '';
    const optimisticArchive = tipoAzione === 'risolto';

    // Se stiamo archiviando una card ASSEGNAZIONE, ricaviamo l'ordine dal DOM
    // per sincronizzare anche la pagina Produzione
    let ordineAssegnazione = null;
    if (optimisticArchive) {
        const card = document.querySelector(`.req-card[data-id-riga="${CSS.escape(String(idRiga))}"]`);
        if (card) {
            const group = card.closest('.req-group');
            if (group && group.id === 'rg-assegnazioni') {
                ordineAssegnazione = card.dataset.ordine || null;
            }
        }
    }
    try {
        const body = { azione: 'aggiorna_richiesta_stato', tipo: tipoAzione, mittente: utenteAttuale?.nome?.toUpperCase().trim() || 'SISTEMA' };
        if (tipoAzione === 'risolto' && tuttiIds && tuttiIds.length > 1) {
            body.id_righe = tuttiIds;
        } else {
            body.id_riga = idRiga;
        }
        if (optimisticArchive) {
            // Pausiamo il poller per 20s: evita che la nuova revision (pubblicata dal backend
            // subito dopo la POST) sovrascriva l'aggiornamento ottimistico prima che sia visibile
            RevisionPoller.pauseFor(20000);
            _removeRichiestaCardOptimistic(idRiga);
            _persistRichiesteHtmlSnapshot();
            // Se era un'ASSEGNAZIONE: aggiorna subito anche il DOM di Produzione
            if (ordineAssegnazione) {
                _clearAssegnazioneProduzione(ordineAssegnazione);
            }
        }
        const res = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(body) });
        const r = await res.json();
        if (r && r.status === 'auth_error') { window._gestisciAuthError_?.(r.message); return; }
        if (!r || (r.status !== 'success' && r.status !== 'ok')) throw new Error('Aggiornamento non salvato');
        _invalidaCacheRichieste();
        if (!optimisticArchive) caricaRichieste();
        // Se era un'ASSEGNAZIONE: cancella assegna nel backend (fire-and-forget)
        if (ordineAssegnazione) {
            _sincronizzaCancellaAssegna(ordineAssegnazione);
        }
    } catch (e) {
        if (optimisticArchive && contenitore && prevHtml) {
            contenitore.innerHTML = prevHtml;
            _persistRichiesteHtmlSnapshot();
        }
        notificaElegante('Errore aggiornamento.', 'error');
    }
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
        notificaElegante('Errore durante il sollecito.', 'error');
    }
}
function formattaData(stringaData) {
    if (!stringaData) return "N.D.";

    let d;
    // Se Ã¨ un timestamp numerico
    if (!isNaN(stringaData) && typeof stringaData !== 'string') {
        d = new Date(Number(stringaData));
    } else {
        d = new Date(stringaData);
        // Se fallisce, proviamo formato italiano GG/MM/AAAA HH:MM
        if (isNaN(d.getTime())) {
            const match = String(stringaData).match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
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

    // Controlla se almeno un messaggio del gruppo Ã¨ sollecitato
    const isSollecitata = msgs.some(m => String(m.SOLLECITO).toLowerCase() === 'true');

    // Mittente e destinatario presi dal PRIMO messaggio (le risposte non cambiano il mittente originale)
    const mittenteUnico = _normNome(primo.DA) || '\u2013';
    // Raccoglie destinatari da TUTTI i messaggi del thread (retrocompatibile con vecchio formato una-riga-per-op)
    const destinatariOriginali = [...new Set(
        msgs.flatMap(m => String(m.A || '').split(',').map(d => _normNome(d.trim())).filter(Boolean))
    )];
    const destinatariHtml = destinatariOriginali.length > 1
        ? destinatariOriginali.map(d => `<span class="rc-val rc-val-a">${d}</span>`).join('<span style="color:#cbd5e1;margin:0 1px">,</span> ')
        : `<span class="rc-val rc-val-a">${destinatariOriginali[0] || '\u2013'}</span>`;

    // Icona tipo â€” usa il tipo del PRIMO messaggio, non delle risposte
    const tipoRaw = (primo.TIPO || 'MSG').toUpperCase();
    // Array di tutti gli id_riga del thread (per archiviazione bulk)
    const tuttiIds = msgs.map(m => m.id_riga).join(',');
    const isAssegnazione = tipoRaw === 'ASSEGNAZIONE';
    const tipoIconaHtml = isAssegnazione
        ? `<span class="rc-tipo rc-tipo-assegna" title="Assegnazione"><i class="fas fa-arrow-right"></i></span>`
        : `<span class="rc-tipo rc-tipo-domanda" title="Richiesta"><i class="fas fa-question"></i></span>`;

    return `
        <div class="req-card${isArchiviata ? ' archiviata' : ''}${isSollecitata ? ' sollecitata' : ''}" data-id-riga="${String(ultimo.id_riga || '')}" data-ordine="${String(nOrd || '')}" data-cliente="${(nomeCliente || '').toLowerCase().replace(/"/g, '')}" data-riferimento="${(ultimo.RIFERIMENTO || '').toLowerCase().replace(/"/g, '')}">

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
                ${!isAssegnazione ? `<span class="rc-msgcount">${msgs.length} <i class="fa-regular fa-comment"></i></span>` : ''}
            </div>

            ${!isAssegnazione ? `
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
            </div>` : ''}

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
    <div class="scad-card ${urgClass}" data-id-riga="${String(msg.id_riga || '')}" data-ordine="${_fabprodEscHtml_(nOrd)}" data-cliente="${(cliente).toLowerCase().replace(/"/g,'')}">
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
            <label class="scad-fab-pick" onclick="event.stopPropagation()" title="Seleziona questa scadenza per il fabbisogno">
                <input type="checkbox" class="scad-fab-chk" value="${_fabprodEscHtml_(nOrd)}">
                <span>Fabbisogno</span>
            </label>
            <button onclick="aggiornaRichiesta('${msg.id_riga}', 'risolto')" class="rc-btn rc-btn-arch" title="Archivia scadenza"><i class="fa-solid fa-check"></i></button>
        </div>
    </div>`;
}
/* ---- FINE SCADENZE ---- */

// â”€â”€â”€ Registrazione globals (onclick inline su HTML) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    window._fabprodCardClick          = _fabprodCardClick;
    window._fabprodApriModalOrdine    = _fabprodApriModalOrdine;
    window._fabprodApriModalArticolo = _fabprodApriModalArticolo;
    window._fabprodVaiOrdine          = _fabprodVaiOrdine;
    window._aggiornaPannelloFabbisogno = _aggiornaPannelloFabbisogno;
    window._apriModalFabbisognoSel    = _apriModalFabbisognoSel;
    window._applicaSelFabbisogno      = _applicaSelFabbisogno;
    window._chiudiModalFabbisognoSel  = _chiudiModalFabbisognoSel;
    window._fabprodDaScadenzeTutte    = _fabprodDaScadenzeTutte;
    window._fabprodDaScadenzeFlaggate = _fabprodDaScadenzeFlaggate;
    window._fabprodStampaFabbisognoSel = _fabprodStampaFabbisognoSel;
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

// â”€â”€â”€ Init: event listeners DOM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function init() {
    // FAB "+" â€” un solo listener 'click'.
    // Il 300ms delay Ã¨ eliminato dal CSS (touch-action: manipulation).
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

    // â”€â”€ Chiudi box risposta/conferma toccando fuori dalla card (mobile) â”€â”€
    document.addEventListener('click', function(e) {
        // Se il click Ã¨ dentro una req-card, non chiudere nulla
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
