// PROD — Features / Ordini Fornitori (Lista di Carico)
// Dashboard ordini di acquisto dai fornitori, caricata via CSV "Lista di Carico"

import { CACHE_TTL_MS } from '../core/config.js';
import { gasRequestWithTimeout } from '../core/api.js';
import { notificaElegante, applicaFade, _esc } from '../core/ui.js';
import { lsCacheGet as _lsCacheGet, lsCacheSet as _lsCacheSet } from '../core/ls-cache.js';
import ProdCache from '../core/cache.js';

// ─── Cache locale ─────────────────────────────────────────────────────────────
const _ofCache   = {};  // { 'ORDINI_FORNITORI': html }
const _ofCacheTs = {};  // { chiave: timestamp }
const IDB_KEY = 'ORDINI_FORNITORI';
const LS_KEY  = '_html_ORDINI_FORNITORI';

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

    const ordKeys = Object.keys(gruppi).sort((a, b) => {
        const fA = (gruppi[a][0].fornitore || '').toUpperCase();
        const fB = (gruppi[b][0].fornitore || '').toUpperCase();
        if (fA < fB) return -1;
        if (fA > fB) return 1;
        return a < b ? -1 : a > b ? 1 : 0;
    });

    let html = '';
    ordKeys.forEach(nOrd => {
        const items = gruppi[nOrd];
        const fornitore = items[0].fornitore || '-';
        const dataCons = items[0].data_consegna || '-';
        const totQty = items.reduce((s, r) => s + r.quantita, 0);
        const totEvasa = items.reduce((s, r) => s + r.qta_evasa, 0);
        const pct = totQty > 0 ? Math.round((totEvasa / totQty) * 100) : 0;
        const barColor = pct === 100 ? '#22c55e' : pct > 0 ? '#f59e0b' : '#e2e8f0';

        const nOrdBadge = nOrd.length > 14 ? nOrd.substring(0, 14) + '\u2026' : nOrd;

        html += `<div class="ordine-wrapper of-ordine-wrapper">
            <div class="riga-ordine of-riga-ordine" onclick="this.nextElementSibling.classList.toggle('collapsed')">
                <div class="riga-ordine-left">
                    <span class="ordine-badge">${_esc(nOrdBadge)}</span>
                    <span class="cliente-nome" style="color:inherit"><i class="fas fa-truck" style="font-size:.75rem;opacity:.5;margin-right:4px"></i>${_esc(fornitore)}</span>
                </div>
                <div class="riga-ordine-right">
                    <span class="of-data-badge" title="Data consegna"><i class="far fa-calendar-alt"></i> ${_esc(dataCons)}</span>
                    <span class="of-count-badge">${items.length} art.</span>
                    <div class="of-progress-mini" title="${pct}% evaso">
                        <div class="of-progress-bar" style="width:${pct}%;background:${barColor}"></div>
                    </div>
                    <i class="fas fa-chevron-down dettagli-chevron"></i>
                </div>
            </div>
            <div class="dettagli-container collapsed">
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

    const evPct = qty > 0 ? Math.round((qtaEvasa / qty) * 100) : 0;
    const evColor = evPct === 100 ? '#22c55e' : evPct > 0 ? '#f59e0b' : '#94a3b8';

    // Encode data as attributes for the modal
    const dataAttrs = `data-codice="${codice}" data-prodotto="${prodottoFull}" data-fornitore="${fornitore}" data-ordine="${nOrdine}" data-data="${dataCons}" data-qty="${qty}" data-evasa="${qtaEvasa}" data-daconsegnare="${qtaDaCons}" data-importo="${importo}"`;

    return `<div class="item-card of-item-card" onclick="_apriDettaglioOF(this)" ${dataAttrs}>
        <div class="of-card-main">
            <div class="of-card-codice"><span class="label-sm">Codice</span><b>${codice}</b></div>
            <div class="of-card-prodotto"><span class="label-sm">Prodotto</span><span>${prodotto}</span></div>
        </div>
        <div class="of-card-qty">
            <div class="of-qty-group">
                <span class="label-sm">Ordinata</span><b>${qty}</b>
            </div>
            <div class="of-qty-group">
                <span class="label-sm">Evasa</span><b style="color:${evColor}">${qtaEvasa}</b>
            </div>
            <div class="of-qty-group">
                <span class="label-sm">Da consegnare</span><b>${qtaDaCons}</b>
            </div>
            <div class="of-qty-group of-importo-group">
                <span class="label-sm">Importo</span><b>${importo}</b>
            </div>
        </div>
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
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Importo</span>
                <span class="of-modal-value of-modal-big">${d.importo}</span>
            </div>
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
}

// ─── Register globals ───────────────────────────────────────────────────────────
export function registerGlobals() {
    window._apriDettaglioOF    = _apriDettaglioOF;
    window._chiudiDettaglioOF  = _chiudiDettaglioOF;
    window.caricaOrdiniFornitori = caricaOrdiniFornitori;
    window.invalidateOFCache   = invalidateOFCache;
}
