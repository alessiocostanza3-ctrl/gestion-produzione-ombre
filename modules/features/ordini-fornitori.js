// PROD — Features / Ordini Fornitori (Lista di Carico)
// Dashboard ordini di acquisto dai fornitori, caricata via CSV "Lista di Carico"

import { CACHE_TTL_MS } from '../core/config.js';
import { gasRequestWithTimeout } from '../core/api.js';
import { notificaElegante, applicaFade, _esc } from '../core/ui.js';
import { lsCacheGet as _lsCacheGet, lsCacheSet as _lsCacheSet } from '../core/ls-cache.js';
import ProdCache from '../core/cache.js';
import { utenteAttuale } from '../core/session.js';

// ─── Cache locale ─────────────────────────────────────────────────────────────
const _ofCache   = {};  // { 'ORDINI_FORNITORI': html }
const _ofCacheTs = {};  // { chiave: timestamp }
const IDB_KEY = 'ORDINI_FORNITORI';
const LS_KEY  = '_html_ORDINI_FORNITORI';

// ─── Default stati fornitori (usati come fallback se window.listaStatiFornitori non è pronto) ─
const _OF_STATI_FALLBACK = [
    { stato: 'IN ATTESA',   colore: '#94a3b8' },
    { stato: 'ORDINATO',    colore: '#fbbf24' },
    { stato: 'PARZ. EVASO', colore: '#f97316' },
    { stato: 'EVASO',       colore: '#22c55e' },
    { stato: 'ANNULLATO',   colore: '#ef4444' }
];

function _getStatiFornitori() {
    return (window.listaStatiFornitori && window.listaStatiFornitori.length)
        ? window.listaStatiFornitori
        : _OF_STATI_FALLBACK;
}

function _getColoreStato(nomeStato) {
    const stati = _getStatiFornitori();
    const found = stati.find(s => (s.stato || s.nome || '').toUpperCase() === (nomeStato || '').toUpperCase());
    return found ? (found.colore || '#94a3b8') : '#94a3b8';
}

// ─── Fetch dati ────────────────────────────────────────────────────────────────
async function _fetchOrdiniFornitori(signal) {
    const res = await gasRequestWithTimeout(
        { azione: 'getListaDiCarico' },
        10000,
        { signal, retries: 1 }
    );
    if (!res || res.status !== 'ok') throw new Error(res?.msg || 'Errore caricamento');
    return res.righe || [];
}

// ─── Rendering ─────────────────────────────────────────────────────────────────
function _renderOrdiniFornitori(righe) {
    if (!righe || righe.length === 0) {
        return `<div class="centered-msg" style="padding:40px 20px;text-align:center;color:#64748b">
            <i class="fas fa-truck" style="font-size:2rem;margin-bottom:12px;display:block;opacity:.4"></i>
            Nessun ordine fornitore caricato.<br>
            <span style="font-size:.85rem">Carica un CSV "Lista di Carico" dalle Impostazioni.</span>
        </div>`;
    }

    // Raggruppa per N. Ordine
    const gruppi = {};
    righe.forEach(r => {
        const key = r.n_ordine || 'N.D.';
        if (!gruppi[key]) gruppi[key] = [];
        gruppi[key].push(r);
    });

    // Separa ordini da revisionare (review_missing) dagli ordinari
    const ordKeysMissing = [];
    const ordKeysNormal  = [];
    Object.keys(gruppi).forEach(k => {
        const isMissing = gruppi[k].some(r => r.review_missing);
        if (isMissing) ordKeysMissing.push(k);
        else ordKeysNormal.push(k);
    });

    const _sortKeys = keys => keys.sort((a, b) => {
        const fA = (gruppi[a][0].fornitore || '').toUpperCase();
        const fB = (gruppi[b][0].fornitore || '').toUpperCase();
        if (fA < fB) return -1;
        if (fA > fB) return 1;
        return a < b ? -1 : a > b ? 1 : 0;
    });
    _sortKeys(ordKeysMissing);
    _sortKeys(ordKeysNormal);
    const ordKeys = [...ordKeysMissing, ...ordKeysNormal];

    const totArticoli = righe.length;
    const totOrdini = ordKeys.length;
    const totEvasi = righe.reduce((s, r) => s + r.qta_evasa, 0);
    const totQtyAll = righe.reduce((s, r) => s + r.quantita, 0);
    const pctGlobal = totQtyAll > 0 ? Math.round((totEvasi / totQtyAll) * 100) : 0;
    const nMissing = ordKeysMissing.length;

    let html = `<div class="acquisti-header header-flex">
        <div>
            <h3 class="acquisti-title">Ordini Fornitori</h3>
            <p class="acquisti-subtitle">${totOrdini} ordini · ${totArticoli} articoli · ${pctGlobal}% evaso${nMissing > 0 ? ` · <span style="color:#d97706;font-weight:600">⚠ ${nMissing} da revisionare</span>` : ''}</p>
        </div>
    </div>`;

    // Banner sezione "Da revisionare" se ci sono ordini mancanti
    if (ordKeysMissing.length > 0) {
        html += `<div class="of-review-banner">
            <i class="fas fa-exclamation-triangle"></i>
            <span><strong>${ordKeysMissing.length} ordini</strong> non presenti nell'ultimo CSV caricato — verificali e archiviali se non più necessari.</span>
        </div>`;
    }

    ordKeys.forEach(nOrd => {
        const items = gruppi[nOrd];
        const fornitore = items[0].fornitore || '-';
        const dataCons = items[0].data_consegna || '-';
        const totQty = items.reduce((s, r) => s + r.quantita, 0);
        const totEvasa = items.reduce((s, r) => s + r.qta_evasa, 0);
        const pct = totQty > 0 ? Math.round((totEvasa / totQty) * 100) : 0;
        const barColor = pct === 100 ? '#22c55e' : pct > 0 ? '#f59e0b' : '#e2e8f0';
        const nOrdBadge = nOrd.length > 14 ? nOrd.substring(0, 14) + '…' : nOrd;
        const isMissing = items.some(r => r.review_missing);
        const statoCorrente = items[0].stato || _OF_STATI_FALLBACK[0].stato;
        const coloreStato = _getColoreStato(statoCorrente);
        const statoOpts = _getStatiFornitori().map(s => {
            const n = s.stato || s.nome || '';
            const sel = n.toUpperCase() === statoCorrente.toUpperCase() ? ' selected' : '';
            return `<option value="${_esc(n)}"${sel}>${_esc(n)}</option>`;
        }).join('');

        const missingClass = isMissing ? ' of-ordine-missing' : '';
        const missingBadge = isMissing
            ? `<span class="of-badge-missing"><i class="fas fa-exclamation-triangle"></i> Da revisionare</span>`
            : '';
        const archiviaBtn = isMissing
            ? `<button class="of-btn-archivia" onclick="event.stopPropagation(); _archiviaOrdineOF('${_esc(nOrd)}')" title="Archivia ordine">
                   <i class="fas fa-archive"></i> Archivia
               </button>`
            : '';

        const nOrdEscaped = _esc(nOrd);

        html += `<div class="ordine-wrapper of-ordine-wrapper${missingClass}" data-nordine="${nOrdEscaped}">
            <div class="riga-ordine of-riga-ordine" onclick="toggleAccordion(this)">
                <div class="flex-grow of-header-left">
                    <span class="order-title"><i class="fas fa-truck" style="font-size:.75rem;opacity:.5;margin-right:6px"></i>${_esc(fornitore)}</span>
                    ${missingBadge}
                </div>
                <div class="order-info">
                    <div class="badge-count"><span class="badge-ord-num">${_esc(nOrdBadge)}</span><span class="badge-sep">·</span>${items.length} ART.</div>
                    <span class="of-data-badge" title="Data consegna"><i class="far fa-calendar-alt"></i> ${_esc(dataCons)}</span>
                    <div class="of-progress-mini" title="${pct}% evaso">
                        <div class="of-progress-bar" style="width:${pct}%;background:${barColor}"></div>
                    </div>
                    <div class="of-stato-wrapper" onclick="event.stopPropagation()">
                        <span class="of-stato-dot" style="background:${coloreStato}"></span>
                        <select class="of-stato-select" data-nordine="${nOrdEscaped}" onchange="_setStatoOF('${nOrdEscaped}', this.value, this)">
                            ${statoOpts}
                        </select>
                    </div>
                    ${archiviaBtn}
                    <i class="fas fa-chevron-down dettagli-chevron"></i>
                </div>
            </div>
            <div class="dettagli-container" style="display:none">
                ${items.map(art => _renderCardArticoloOF(art)).join('')}
            </div>
        </div>`;
    });

    return html;
}

function _renderCardArticoloOF(art) {
    const codice = _esc(art.codice || '-');
    const prodotto = _esc(_troncaProdotto(art.prodotto, 60));
    const prodottoFull = _esc(art.prodotto || '-');
    const fornitore = _esc(art.fornitore || '-');
    const nOrdine = _esc(art.n_ordine || '-');
    const dataCons = _esc(art.data_consegna || '-');
    const qty = art.quantita || 0;
    const qtaEvasa = art.qta_evasa || 0;
    const qtaDaCons = art.qta_da_consegnare || 0;
    const importo = _formatImporto(art.importo);
    const isAlessio = utenteAttuale?.nome?.toUpperCase().trim() === 'ALESSIO';

    const evPct = qty > 0 ? Math.round((qtaEvasa / qty) * 100) : 0;
    const evColor = evPct === 100 ? '#22c55e' : evPct > 0 ? '#f59e0b' : '#94a3b8';

    // Encode data as attributes for the modal (importo solo se Alessio)
    const dataAttrs = `data-codice="${codice}" data-prodotto="${prodottoFull}" data-fornitore="${fornitore}" data-ordine="${nOrdine}" data-data="${dataCons}" data-qty="${qty}" data-evasa="${qtaEvasa}" data-daconsegnare="${qtaDaCons}"${isAlessio ? ` data-importo="${importo}"` : ''}`;

    return `<div class="item-card of-item-card${isAlessio ? '' : ' of-item-card-no-importo'}" onclick="_apriDettaglioOF(this)" ${dataAttrs}>
        <div><span class="label-sm">Codice</span><b>${codice}</b></div>
        <div class="of-cell-prodotto"><span class="label-sm">Prodotto</span><span class="of-prodotto-text">${prodotto}</span></div>
        <div><span class="label-sm">Ordinata</span><b>${qty}</b></div>
        <div><span class="label-sm">Evasa</span><b style="color:${evColor}">${qtaEvasa}</b></div>
        <div><span class="label-sm">Da consegnare</span><b>${qtaDaCons}</b></div>
        ${isAlessio ? `<div class="of-cell-importo"><span class="label-sm">Importo</span><b style="color:#3b82f6">${importo}</b></div>` : ''}
    </div>`;
}

// ─── Modal Dettaglio ────────────────────────────────────────────────────────────
function _apriDettaglioOF(el) {
    // Rimuovi modal esistente
    const old = document.getElementById('modal-of-dettaglio');
    if (old) old.remove();

    const d = el.dataset;
    const modal = document.createElement('div');
    modal.id = 'modal-of-dettaglio';
    modal.className = 'modal-overlay active';
    modal.onclick = (e) => { if (e.target === modal) _chiudiDettaglioOF(); };

    modal.innerHTML = `<div class="modal-content of-modal-content">
        <h2 style="margin:0 0 16px 0;font-size:1.1rem;display:flex;align-items:center;gap:8px">
            <i class="fas fa-box-open" style="color:#3b82f6"></i> Dettaglio Articolo
        </h2>
        <div class="of-modal-grid">
            <div class="of-modal-field">
                <span class="of-modal-label">Codice</span>
                <span class="of-modal-value"><b>${d.codice}</b></span>
            </div>
            <div class="of-modal-field of-modal-field-wide">
                <span class="of-modal-label">Prodotto</span>
                <span class="of-modal-value">${d.prodotto}</span>
            </div>
            <div class="of-modal-field">
                <span class="of-modal-label">Fornitore</span>
                <span class="of-modal-value">${d.fornitore}</span>
            </div>
            <div class="of-modal-field">
                <span class="of-modal-label">N. Ordine</span>
                <span class="of-modal-value">${d.ordine}</span>
            </div>
            <div class="of-modal-field">
                <span class="of-modal-label">Data Consegna</span>
                <span class="of-modal-value">${d.data || '-'}</span>
            </div>
            <div class="of-modal-sep"></div>
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Quantità Ordinata</span>
                <span class="of-modal-value of-modal-big">${d.qty}</span>
            </div>
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Quantità Evasa</span>
                <span class="of-modal-value of-modal-big" style="color:#22c55e">${d.evasa}</span>
            </div>
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Da Consegnare</span>
                <span class="of-modal-value of-modal-big" style="color:#f59e0b">${d.daconsegnare}</span>
            </div>
            ${utenteAttuale?.nome?.toUpperCase().trim() === 'ALESSIO' ? `
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Importo</span>
                <span class="of-modal-value of-modal-big">${d.importo}</span>
            </div>` : ''}
        </div>
        <div style="text-align:right;margin-top:18px">
            <button class="btn-modal-cancel" onclick="_chiudiDettaglioOF()">Chiudi</button>
        </div>
    </div>`;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('active'));
}

function _chiudiDettaglioOF() {
    const m = document.getElementById('modal-of-dettaglio');
    if (m) {
        m.classList.remove('active');
        setTimeout(() => m.remove(), 200);
    }
}

// ─── Cambio stato ordine fornitore ──────────────────────────────────────────────
async function _setStatoOF(nOrdine, nuovoStato, selectEl) {
    // Optimistic update: aggiorna colore dot subito
    const wrapper = selectEl?.closest('.of-ordine-wrapper');
    const dot = wrapper?.querySelector('.of-stato-dot');
    if (dot) dot.style.background = _getColoreStato(nuovoStato);

    try {
        const res = await gasRequestWithTimeout(
            { azione: 'setStatoOrdineFornitori', n_ordine: nOrdine, stato: nuovoStato },
            8000, { retries: 1 }
        );
        if (!res || res.status !== 'ok') {
            notificaElegante('Errore salvataggio stato', 'error');
            return;
        }
        // Invalida cache per aggiornarsi al prossimo accesso
        invalidateOFCache();
    } catch (err) {
        notificaElegante('Errore connessione', 'error');
    }
}

// ─── Archivia ordine fornitore ──────────────────────────────────────────────────
async function _archiviaOrdineOF(nOrdine) {
    if (!confirm(`Archiviare l'ordine ${nOrdine}?\nNon comparirà più nella lista principale.`)) return;

    // Optimistic: rimuovi subito il wrapper dalla vista
    const wrapper = document.querySelector(`.of-ordine-wrapper[data-nordine="${nOrdine}"]`);
    if (wrapper) {
        wrapper.style.opacity = '0.4';
        wrapper.style.pointerEvents = 'none';
    }

    try {
        const res = await gasRequestWithTimeout(
            { azione: 'archiviaOrdineFornitori', n_ordine: nOrdine },
            8000, { retries: 1 }
        );
        if (!res || res.status !== 'ok') {
            notificaElegante('Errore archiviazione', 'error');
            if (wrapper) { wrapper.style.opacity = ''; wrapper.style.pointerEvents = ''; }
            return;
        }
        if (wrapper) wrapper.remove();
        // Aggiorna contatori nel subtitle
        const subtitle = document.querySelector('.acquisti-subtitle');
        if (subtitle) {
            const newRighe = document.querySelectorAll('.of-ordine-wrapper');
            const nMissing = document.querySelectorAll('.of-ordine-missing').length;
            const missingTxt = nMissing > 0 ? ` · <span style="color:#d97706;font-weight:600">⚠ ${nMissing} da revisionare</span>` : '';
            subtitle.innerHTML = `${newRighe.length} ordini${missingTxt}`;
        }
        // Rimuovi banner se non ci sono più ordini mancanti
        if (!document.querySelector('.of-ordine-missing')) {
            const banner = document.querySelector('.of-review-banner');
            if (banner) banner.remove();
        }
        invalidateOFCache();
    } catch (err) {
        notificaElegante('Errore connessione', 'error');
        if (wrapper) { wrapper.style.opacity = ''; wrapper.style.pointerEvents = ''; }
    }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────
function _troncaProdotto(testo, max) {
    if (!testo) return '-';
    return testo.length > max ? testo.substring(0, max) + '\u2026' : testo;
}

function _formatImporto(val) {
    if (!val && val !== 0) return '-';
    return Number(val).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20AC';
}

// ─── Entry point ────────────────────────────────────────────────────────────────
export async function caricaOrdiniFornitori(expectedRequestId, signal, silenzioso = false) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    // 1. Stale-while-revalidate: IndexedDB → localStorage → fetch
    if (!silenzioso) {
        // Try RAM cache
        const cached = _ofCache[IDB_KEY];
        const cacheTs = _ofCacheTs[IDB_KEY] || 0;
        if (cached && (Date.now() - cacheTs < CACHE_TTL_MS)) {
            contenitore.innerHTML = cached;
            applicaFade(contenitore);
            window.aggiornaListaFiltrabili?.();
            return;
        }

        // Try IndexedDB
        try {
            const idb = await ProdCache.get(IDB_KEY);
            if (idb && idb.dati) {
                contenitore.innerHTML = idb.dati;
                _ofCache[IDB_KEY] = idb.dati;
                _ofCacheTs[IDB_KEY] = idb.timestamp;
                applicaFade(contenitore);
                window.aggiornaListaFiltrabili?.();
                // If stale, refresh in background
                if (idb.isStale) {
                    _bgRefreshOF(signal);
                }
                return;
            }
        } catch (_) {}

        // Try localStorage
        const lsHtml = _lsCacheGet(LS_KEY, CACHE_TTL_MS);
        if (lsHtml) {
            contenitore.innerHTML = lsHtml;
            _ofCache[IDB_KEY] = lsHtml;
            _ofCacheTs[IDB_KEY] = Date.now();
            applicaFade(contenitore);
            window.aggiornaListaFiltrabili?.();
            return;
        }

        contenitore.innerHTML = `<div class="centered-msg" id="_of-loader">
            <i class="fas fa-spinner fa-spin"></i> Caricamento ordini fornitori…
        </div>`;
    }

    // 2. Fetch dal server
    try {
        const righe = await _fetchOrdiniFornitori(signal);
        // Check we're still on this tab
        if (window._acquistTabAttivo !== 'fornitori') return;

        const html = _renderOrdiniFornitori(righe);
        contenitore.innerHTML = html;
        applicaFade(contenitore);
        window.aggiornaListaFiltrabili?.();

        // Persist in all cache layers
        _ofCache[IDB_KEY] = html;
        _ofCacheTs[IDB_KEY] = Date.now();
        _lsCacheSet(LS_KEY, html);
        ProdCache.set(IDB_KEY, html).catch(() => {});
    } catch (err) {
        if (err && err.name === 'AbortError') return;
        if (!silenzioso) {
            const c = document.getElementById('contenitore-dati');
            if (c && c.querySelector('#_of-loader')) {
                c.innerHTML = `<div class="centered-error-bold">Errore nel caricamento.
                    <button onclick="_switchAcquistiTab('fornitori')"
                        style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                        Riprova</button></div>`;
                applicaFade(c);
            }
        }
    }
}

async function _bgRefreshOF(signal) {
    try {
        const righe = await _fetchOrdiniFornitori(signal);
        if (window._acquistTabAttivo !== 'fornitori') return;
        const html = _renderOrdiniFornitori(righe);
        const contenitore = document.getElementById('contenitore-dati');
        if (contenitore) {
            contenitore.innerHTML = html;
            window.aggiornaListaFiltrabili?.();
        }
        _ofCache[IDB_KEY] = html;
        _ofCacheTs[IDB_KEY] = Date.now();
        _lsCacheSet(LS_KEY, html);
        ProdCache.set(IDB_KEY, html).catch(() => {});
    } catch (_) {}
}

/** Invalida la cache (chiamato dopo un import CSV) */
export function invalidateOFCache() {
    delete _ofCache[IDB_KEY];
    delete _ofCacheTs[IDB_KEY];
    ProdCache.invalidate(IDB_KEY).catch(() => {});
    // Pulisce anche la cache localStorage così il prossimo accesso rifà il fetch
    try { localStorage.removeItem(LS_KEY); } catch (_) {}
}

// ─── Register globals ───────────────────────────────────────────────────────────
export function registerGlobals() {
    window._apriDettaglioOF    = _apriDettaglioOF;
    window._chiudiDettaglioOF  = _chiudiDettaglioOF;
    window._setStatoOF         = _setStatoOF;
    window._archiviaOrdineOF   = _archiviaOrdineOF;
    window.caricaOrdiniFornitori = caricaOrdiniFornitori;
    window.invalidateOFCache   = invalidateOFCache;
}
