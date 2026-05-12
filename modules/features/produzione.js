// PROD — Features / Produzione
// Estratto da script.js — 28 marzo 2026

import { URL_GOOGLE } from '../core/config.js';
import ProdCache, { caricaSezioneConCache } from '../core/cache.js';
import { notificaElegante, applicaFade, mostraModalConflitto, mostraConferma, _esc } from '../core/ui.js';
import { utenteAttuale } from '../core/session.js';
import RevisionPoller from '../core/revision-poller.js';
import { lsCacheSet as _lsCacheSet, lsCacheDel as _lsCacheDel } from '../core/ls-cache.js';
import { cacheContenuti, cacheFetchTime, prefetch } from '../core/state.js';
import { createGhost, moveGhost, removeGhost, dropTargetAtPoint } from '../core/dnd.js';
import { prodState, getOvStatiAll, isStatoFinale } from './produzione-state.js';
import { generaBloccoOrdiniUnificato } from './produzione-cards.js';
import {
    _refreshOverview, _ovLoadIfNeeded, _apriArchivio,
    _buildOverviewInnerHtml, _buildCaricoOperatoriHtml,
    _initKanbanDnd, _aggiornaKanbanCount, _checkKanbanEmpty,
    _syncStatoItemCard, _scrollToOrdineList
} from './produzione-overview.js';

// (Paginazione rimossa: tutti gli ordini caricati in un colpo)

// ── Lock anti-doppio-render per polling ─────────────────────────────────────
let _pollingRenderInFlight = false;
let _bgRefreshDebounceTimer = null;

// ── Stato interno del modulo → condiviso via produzione-state.js ────

function _invalidateProduzioneCache({ resetFetchTime = true, invalidatePersistent = true } = {}) {
    delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
    if (resetFetchTime) cacheFetchTime['PROGRAMMA PRODUZIONE DEL MESE'] = 0;
    _lsCacheDel('_html_PROGRAMMA PRODUZIONE DEL MESE');
    prefetch.dashBundle = null;
    prefetch.dashPromise = null;
    if (!invalidatePersistent) return;

    // Debounce invalidazioni IndexedDB nelle raffiche di update.
    if (prodState.prodCacheInvalidateTimer) clearTimeout(prodState.prodCacheInvalidateTimer);
    prodState.prodCacheInvalidateTimer = setTimeout(() => {
        prodState.prodCacheInvalidateTimer = null;
        ProdCache.invalidate('PROGRAMMA_PRODUZIONE').catch(() => {});
    }, 1200);
}

function _persistProduzioneHtmlSnapshot() {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'] = contenitore.innerHTML;
    cacheFetchTime['PROGRAMMA PRODUZIONE DEL MESE'] = Date.now();
    _lsCacheSet('_html_PROGRAMMA PRODUZIONE DEL MESE', contenitore.innerHTML);
}

// Aggiorna last_modified in-memory dopo assegnazione operatori
// (evita falsi positivi di conflitto su modifiche stato successive)
function _syncAssegnaTimestamp(nOrd, idRiga, lastModified) {
    if (!lastModified) return;
    const sources = [prodState.ultimiDatiProduzione?.produzione, prodState.attiviProd];
    for (const arr of sources) {
        if (!arr) continue;
        for (const row of arr) {
            const match = idRiga
                ? String(row.id_riga) === String(idRiga)
                : String(row.ordine || row.nOrd || '').trim() === String(nOrd).trim();
            if (match) row.last_modified = lastModified;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
//  A) FETCH & RENDER
// ═══════════════════════════════════════════════════════════════════

async function _fetchDatiProduzione(signal = null) {
    let _dashBundle = null;
    if (prefetch.dashBundle) {
        _dashBundle = prefetch.dashBundle;
        prefetch.dashBundle = null;
        prefetch.dashPromise = null;
    } else if (prefetch.dashPromise) {
        _dashBundle = await prefetch.dashPromise;
        prefetch.dashBundle = null;
        prefetch.dashPromise = null;
    } else {
        const _dashResp = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'getAllDashboard', includeArchivio: false }),
            ...(signal ? { signal } : {})
        });
        if (!_dashResp.ok) throw new Error(`HTTP ${_dashResp.status}`);
        _dashBundle = await _dashResp.json();
    }
    if (!_dashBundle) throw new Error('bundle vuoto');
    return { produzione: _dashBundle.produzione || [], archivio: _dashBundle.archivio || [], avatarColors: _dashBundle.avatarColors || null, prodTotal: _dashBundle.prodTotal || 0 };
}

function _renderDatiProduzione(dati, _isBackground = null) {
    if (window.paginaAttuale !== 'PROGRAMMA PRODUZIONE DEL MESE') return;
    // Sincronizza colori avatar degli operatori PRIMA di renderizzare
    if (dati.avatarColors) _syncAvatarColors(dati.avatarColors);
    prodState.ultimiDatiProduzione = dati;

    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    const nomeFoglio = 'PROGRAMMA PRODUZIONE DEL MESE';
    const datiProd = dati.produzione || [];
    const datiArch = dati.archivio || [];

    const isBackgroundUpdate = _isBackground !== null
        ? _isBackground
        : !!contenitore.querySelector('.ordine-wrapper');

    // --- OVERVIEW STATI ---
    const attivi = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
    prodState.attiviProd = attivi;
    const STATI_OV = getOvStatiAll();
    const numInFocus = attivi.filter(r => STATI_OV.includes((r.stato||'').toUpperCase().trim())).length;

    // --- SEZIONE ATTIVA --- (tutti gli ordini)
    const _attProdFull  = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
    let htmlAttivi = generaBloccoOrdiniUnificato(_attProdFull, false);

    // --- SEZIONE ARCHIVIATA --- lazy: render solo all'apertura (+100-500ms risparmio)
    prodState.datiArchLazy = datiArch;
    const htmlArchiviati = ''; // sezione chiusa: render on-demand in _apriArchivio()

    const isMobileOv = window.innerWidth <= 600;
    const ovContent = isMobileOv
        ? '<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>'
        : _buildOverviewInnerHtml(attivi);

    // Snapshot accordions aperti prima di sostituire il DOM
    const _openOrdini = new Set();
    if (isBackgroundUpdate) {
        contenitore.querySelectorAll('.ordine-wrapper').forEach(w => {
            if (w.querySelector('.riga-ordine.open')) _openOrdini.add(w.dataset.ordine);
        });
    }

    contenitore.innerHTML = `
            <details class="ov-accordion" id="ov-accordion"${isMobileOv ? '' : ' open'}>
                <summary class="ov-accordion-summary" onclick="_ovLoadIfNeeded(this)">
                    <span class="ov-summary-label"><i class="fas fa-layer-group"></i> Stato Avanzamento</span>
                    <span class="ov-summary-meta">${numInFocus} art. in lavorazione</span>
                    <i class="fas fa-chevron-down ov-summary-chevron"></i>
                </summary>
                <div class="riepilogo-page" id="ov-content">
                    ${ovContent}
                </div>
            </details>
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="_apriArchivio('archivio-prod-details')">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>
            <div class="sezione-attiva">
                <div id="prod-filter-bar"></div>
                ${htmlAttivi || "<div class='empty-msg'>Nessun ordine in produzione.</div>"}
            </div>

            <details id="archivio-prod-details" class="archivio-details">
                <summary class="separatore-archivio archivio-summary">
                    <span>\u{1F4E6} ARCHIVIO STORICO ORDINI</span>
                    <i class="fas fa-chevron-down archivio-chevron"></i>
                </summary>
                <div class="sezione-archiviata">
                    ${htmlArchiviati || "<div class='empty-msg'>L'archivio \u00e8 vuoto.</div>"}
                </div>
            </details>
        `;
    cacheContenuti[nomeFoglio] = contenitore.innerHTML;
    cacheFetchTime[nomeFoglio] = Date.now();
    _lsCacheSet('_html_' + nomeFoglio, contenitore.innerHTML);

    ProdCache.set('PROGRAMMA_PRODUZIONE', dati).catch(() => {});

        // ARCHIVIO_ORDINI: cache popolata lazy in _apriArchivio() al primo click

    applicaFade(contenitore);

    // Ripristina accordion aperti dopo background update
    if (isBackgroundUpdate && _openOrdini.size) {
        contenitore.querySelectorAll('.ordine-wrapper').forEach(w => {
            if (_openOrdini.has(w.dataset.ordine)) {
                const riga = w.querySelector('.riga-ordine');
                const det  = w.querySelector('.dettagli-container');
                if (riga && det) { riga.classList.add('open'); det.style.display = 'block'; }
            }
        });
    }

    window.aggiornaListaFiltrabili();
    requestAnimationFrame(_initKanbanDnd);
    requestAnimationFrame(() => {
        if (prodState.attiviProd) {
            prodState.attiviProd.forEach(r => {
                if (parseFloat(r.qty_evasa) > 0) {
                    const block = document.getElementById('qty-evasa-block-' + r.id_riga);
                    const btn   = block && block.closest('.qty-cell')?.querySelector('.btn-qty-evasa-toggle');
                    if (block) block.style.display = 'inline-flex';
                    if (btn)   btn.classList.add('active');
                }
            });
        }
        _renderProdFilterBar();
        if (_pfHasActiveFilters()) _applicaFiltriProd();
    });
    _startPollingProduzione();

    // Salva raw data per autocomplete del modal
    prodState.ordiniAutocompleteCache = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE').map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '', riferimento: r.riferimento || '' }));
    const seen = new Set();
    prodState.ordiniAutocompleteCache = prodState.ordiniAutocompleteCache.filter(o => { if (seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });
    window._ordiniAutocompleteCache = prodState.ordiniAutocompleteCache;
}

async function caricaDati(nomeFoglio, isBackgroundUpdate = false, expectedRequestId = null, signal = null) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!isBackgroundUpdate && contenitore) {
        contenitore.innerHTML = "<div class='inline-msg' id='_prod-loader'>Caricamento Dashboard...</div>";
        applicaFade(contenitore);
    }

    const slowTimer = isBackgroundUpdate ? null : setTimeout(() => {
        const el = document.getElementById('_prod-loader');
        if (el) {
            el.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Connessione lenta, sto ancora caricando...";
        }
    }, 3500);

    const retryTimer = isBackgroundUpdate ? null : setTimeout(() => {
        const el = document.getElementById('_prod-loader');
        if (el) el.innerHTML = `\u26a0\ufe0f Server occupato o rete instabile.<br>
            <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                style="margin-top:12px;padding:8px 20px;background:#242424;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`;
    }, 8000);

    try {
        const dati = await _fetchDatiProduzione(signal);
        if (slowTimer) clearTimeout(slowTimer);
        if (retryTimer) clearTimeout(retryTimer);

        if (window.paginaAttuale !== nomeFoglio) return;
        if (expectedRequestId !== null && expectedRequestId !== window._latestNavRequest) return;

        _renderDatiProduzione(dati, isBackgroundUpdate);

    } catch (e) {
        if (slowTimer) clearTimeout(slowTimer);
        if (retryTimer) clearTimeout(retryTimer);
        if (e.name === 'AbortError') return;
        console.error("Errore Dashboard:", e);
        if (isBackgroundUpdate) {
            console.warn('Background refresh fallito, il polling riproverà:', e.message);
        } else {
            contenitore.innerHTML = `<div class='inline-error'>Errore nel caricamento dati.
                <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                    style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                    &#x21bb; Riprova</button></div>`;
            applicaFade(contenitore);
        }
    }
}

async function caricaArchivio() {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    contenitore.innerHTML = "<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento archivio...</div>";
    try {
        let _aBundle = null;
        if (prefetch.dashBundle) {
            _aBundle = prefetch.dashBundle;
            prefetch.dashBundle = null;
            prefetch.dashPromise = null;
        } else if (prefetch.dashPromise) {
            _aBundle = await prefetch.dashPromise;
            prefetch.dashBundle = null;
            prefetch.dashPromise = null;
        } else {
            const _aResp = await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: 'getAllDashboard', includeArchivio: true })
            });
            if (!_aResp.ok) throw new Error(`HTTP ${_aResp.status}`);
            _aBundle = await _aResp.json();
        }
        if (!_aBundle) throw new Error('bundle vuoto');
        const datiArch = _aBundle.archivio || [];
        const htmlArch = generaBloccoOrdiniUnificato(datiArch, true);
        const _archHtml = htmlArch || "<div class='empty-msg'>L'archivio \u00e8 vuoto.</div>";
        contenitore.innerHTML = _archHtml;
        cacheContenuti['ARCHIVIO_ORDINI'] = _archHtml;
        cacheFetchTime['ARCHIVIO_ORDINI'] = Date.now();
        _lsCacheSet('_html_ARCHIVIO_ORDINI', _archHtml);
        applicaFade(contenitore);
        window.aggiornaListaFiltrabili();
    } catch(e) {
        if (e.name === 'AbortError') return;
        contenitore.innerHTML = `<div class='inline-error'>Errore archivio.
            <button onclick="cambiaPagina('ARCHIVIO_ORDINI', null)"
               style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
               &#x21bb; Riprova</button></div>`;
        applicaFade(contenitore);
    }
}

// ═══════════════════════════════════════════════════════════════════
//  C) STATO & OPERATORI INTERACTION
// ═══════════════════════════════════════════════════════════════════

function _setAssegnaLocalByRow(idRiga, assegna) {
    const id = String(idRiga);
    const val = String(assegna || '');
    if (Array.isArray(prodState.attiviProd)) {
        prodState.attiviProd.forEach(r => {
            if (String(r.id_riga) === id) r.assegna = val;
        });
    }
    if (prodState.ultimiDatiProduzione && Array.isArray(prodState.ultimiDatiProduzione.produzione)) {
        prodState.ultimiDatiProduzione.produzione.forEach(r => {
            if (String(r.id_riga) === id) r.assegna = val;
        });
    }
}

function _setAssegnaLocalByOrdine(nOrd, assegna) {
    const ord = String(nOrd || '').trim();
    const val = String(assegna || '');
    const apply = arr => {
        if (!Array.isArray(arr)) return;
        arr.forEach(r => {
            if (String(r.ordine || '').trim() === ord && !isStatoFinale(r.stato)) r.assegna = val;
        });
    };
    apply(prodState.attiviProd);
    if (prodState.ultimiDatiProduzione && Array.isArray(prodState.ultimiDatiProduzione.produzione)) {
        apply(prodState.ultimiDatiProduzione.produzione);
    }
}

async function rimuoviOperatore(idRiga, nOrd, nomeOperatore) {
    const container = document.querySelector(`.visualizza-operatori[data-id-riga="${idRiga}"]`);
    if (!container) return;

    const _normOp = window._normNome(nomeOperatore);
    const assegnaCorrente = container.dataset.assegna || '';
    const restanti = assegnaCorrente.split(',')
        .map(o => window._normNome(o.trim()))
        .filter(o => o && o.toUpperCase() !== _normOp.toUpperCase())
        .join(',');

    _setAssegnaLocalByRow(idRiga, restanti);

    container.dataset.assegna = restanti;
    if (!restanti) {
        container.innerHTML = `<span class="operatore-libero">Libero</span>`;
    } else {
        const _mioR = window._normNome(utenteAttuale?.nome || '').toUpperCase().trim();
        container.innerHTML = restanti.split(',').map(op => {
            const nome = window._normNome(op.trim());
            const col  = window._getOpColor(nome);
            const nomeSafe = nome.replace(/'/g, "\\'");
            const xBtn = nome.toUpperCase() === _mioR ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${idRiga}','${nOrd}','${nomeSafe}')" title="Rimuovi assegnazione">&times;</button>` : '';
            return `<span class="badge-operatore" data-nome="${_esc(nome)}" style="background:${col};border-color:${col}">${_esc(nome)}${xBtn}</span>`;
        }).join('');
    }

    const mittente = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase().trim() : '';
    const url = `${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(restanti)}&id_riga=${idRiga}&mittente=${encodeURIComponent(mittente)}`;
    fetch(url).then(r => r.json()).then(j => {
        if (!j || (j.status !== 'ok' && j.status !== 'success')) throw new Error('Assegnazione non salvata');
        _syncAssegnaTimestamp(nOrd, idRiga, j.last_modified);
        _invalidateProduzioneCache();
        _repaintOpColors();
    })
        .catch(e => { console.error('Errore rimozione operatore', e); notificaElegante('\u26a0\ufe0f Rimozione non salvata \u2013 riprova', 'error'); });
}

function toggleOpDropdown(btn) {
    const dropdown = btn.closest('.op-dropdown');
    const itemCard  = btn.closest('.item-card');
    const rigaOrd   = btn.closest('.riga-ordine');
    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.op-dropdown.open').forEach(d => {
        d.classList.remove('open');
        const c = d.closest('.item-card');    if (c) c.classList.remove('op-aperto');
        const r = d.closest('.riga-ordine'); if (r) r.classList.remove('op-aperto-ord');
    });
    if (!isOpen) {
        dropdown.classList.add('open');
        if (itemCard) itemCard.classList.add('op-aperto');
        if (rigaOrd)  rigaOrd.classList.add('op-aperto-ord');
    }
}

function toggleStatoDropdown(btn) {
    const dropdown = btn.closest('.stato-dropdown');
    const itemCard = btn.closest('.item-card');
    const rigaOrd  = btn.closest('.riga-ordine');
    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.stato-dropdown.open').forEach(d => {
        d.classList.remove('open');
        const c = d.closest('.item-card');   if (c) c.classList.remove('stato-aperto');
        const r = d.closest('.riga-ordine'); if (r) r.classList.remove('stato-aperto-ord');
    });
    if (!isOpen) {
        dropdown.classList.add('open');
        if (itemCard) itemCard.classList.add('stato-aperto');
        if (rigaOrd)  rigaOrd.classList.add('stato-aperto-ord');
    }
}

function chiudiTuttiMenuAzioni() {
    document.querySelectorAll('.ord-azioni-menu.open').forEach(m => {
        m.classList.remove('open');
        const r = m.closest('.riga-ordine');
        if (r) r.classList.remove('azioni-aperto-ord');
    });
}

function toggleMenuAzioni(btn) {
    const menu = btn.closest('.ord-azioni-menu');
    const rigaOrd = btn.closest('.riga-ordine');
    const isOpen = menu.classList.contains('open');
    chiudiTuttiMenuAzioni();
    if (!isOpen) {
        menu.classList.add('open');
        if (rigaOrd) rigaOrd.classList.add('azioni-aperto-ord');
    }
}

function selezionaOpAssegna(optBtn, idRiga, nOrd, nomeOp) {
    const dropdown = optBtn.closest('.op-dropdown');
    const assegnaCorrente = dropdown.dataset.assegna || '';
    const correnti = assegnaCorrente.split(',').map(n => window._normNome(n.trim())).filter(Boolean);
    const nomeOpNorm = window._normNome(nomeOp);
    const idx = correnti.findIndex(n => n.toUpperCase() === nomeOpNorm.toUpperCase());
    if (idx >= 0) {
        correnti.splice(idx, 1);
    } else {
        correnti.push(nomeOpNorm);
    }
    const nuovaAssegna = correnti.join(',');
    _setAssegnaLocalByRow(idRiga, nuovaAssegna);

    dropdown.dataset.assegna = nuovaAssegna;
    const lbl = correnti.length ? correnti.map(window._normNome).join(', ') : 'Libero';
    dropdown.querySelector('.op-trigger-label').textContent = lbl;
    optBtn.classList.toggle('is-selected', idx < 0);
    let check = optBtn.querySelector('.op-check-icon');
    if (idx < 0) {
        if (!check) { check = document.createElement('i'); check.className = 'fas fa-check op-check-icon'; optBtn.appendChild(check); }
    } else {
        if (check) check.remove();
    }

    const mitt = (utenteAttuale?.nome || '').toUpperCase().trim();
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'assegnaOperatori', ordine: nOrd, operatori: nuovaAssegna, id_riga: idRiga, mittente: mitt }) })
        .then(r => r.json()).then(j => {
            if (!j || (j.status !== 'ok' && j.status !== 'success')) throw new Error('Assegnazione non salvata');
            _syncAssegnaTimestamp(nOrd, idRiga, j.last_modified);
            _invalidateProduzioneCache();
            _repaintOpColors();
        })
        .catch(() => notificaElegante('\u26a0\ufe0f Assegnazione non salvata \u2013 riprova', 'error'));
}

function selezionaOpAssegnaOrdine(optBtn, nOrd, nomeOp) {
    const dropdown = optBtn.closest('.op-dropdown');
    const assegnaCorrente = dropdown.dataset.assegnaOrd || '';
    const correnti = assegnaCorrente.split(',').map(n => window._normNome(n.trim())).filter(Boolean);
    const nomeOpNorm = window._normNome(nomeOp);
    const idx = correnti.findIndex(n => n.toUpperCase() === nomeOpNorm.toUpperCase());
    if (idx >= 0) correnti.splice(idx, 1); else correnti.push(nomeOpNorm);
    const nuovaAssegna = correnti.join(',');

    dropdown.dataset.assegnaOrd = nuovaAssegna;
    const lbl = correnti.length ? correnti.map(window._normNome).join(', ') : 'Libero';
    dropdown.querySelector('.op-trigger-label').textContent = lbl;
    optBtn.classList.toggle('is-selected', idx < 0);
    let check = optBtn.querySelector('.op-check-icon');
    if (idx < 0) {
        if (!check) { check = document.createElement('i'); check.className = 'fas fa-check op-check-icon'; optBtn.appendChild(check); }
    } else {
        if (check) check.remove();
    }

    const wrapper = dropdown.closest('.ordine-wrapper');
    if (wrapper) {
        wrapper.querySelectorAll('.op-dropdown[data-id-riga]').forEach(d => {
            d.dataset.assegna = nuovaAssegna;
            const l2 = correnti.length ? correnti.map(window._normNome).join(', ') : 'Libero';
            const lbl2 = d.querySelector('.op-trigger-label'); if (lbl2) lbl2.textContent = l2;
            d.querySelectorAll('.op-option').forEach(o => {
                const nn = o.querySelector('span:not(.op-opt-dot)')?.textContent.trim() || '';
                const isNow = correnti.some(c => window._normNome(c) === nn);
                o.classList.toggle('is-selected', isNow);
                let ck = o.querySelector('.op-check-icon');
                if (isNow && !ck) { ck = document.createElement('i'); ck.className='fas fa-check op-check-icon'; o.appendChild(ck); }
                else if (!isNow && ck) ck.remove();
            });
        });
        wrapper.querySelectorAll('.visualizza-operatori[data-id-riga]').forEach(cont => {
            cont.dataset.assegna = nuovaAssegna;
        });
    }

    _setAssegnaLocalByOrdine(nOrd, nuovaAssegna);
    _repaintOpColors();

    const mitt = (utenteAttuale?.nome || '').toUpperCase().trim();
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'assegnaOperatori', ordine: nOrd, operatori: nuovaAssegna, mittente: mitt }) })
        .then(r => r.json()).then(j => {
            if (!j || (j.status !== 'ok' && j.status !== 'success')) throw new Error('Assegnazione non salvata');
            _syncAssegnaTimestamp(nOrd, null, j.last_modified);
            _invalidateProduzioneCache();
            _repaintOpColors();
        })
        .catch(() => notificaElegante('\u26a0\ufe0f Assegnazione non salvata \u2013 riprova', 'error'));
}

function autoAssegnami(idRiga, nOrd, btnEl) {
    const mio = window._normNome((utenteAttuale?.nome || '').trim());
    if (!mio) return;
    const container = document.querySelector(`.visualizza-operatori[data-id-riga="${idRiga}"]`);
    if (!container) return;
    const correnti = (container.dataset.assegna || '').split(',').map(n => window._normNome(n.trim())).filter(Boolean);
    if (correnti.some(n => n.toUpperCase() === mio.toUpperCase())) return;
    correnti.push(mio);
    const nuova = correnti.join(',');
    _setAssegnaLocalByRow(idRiga, nuova);
    container.dataset.assegna = nuova;
    const _mioUp = mio.toUpperCase();
    container.innerHTML = correnti.map(n => {
        const col = window._getOpColor(n); const ns = n.replace(/'/g, "\\'");
        const xBtn = n.toUpperCase() === _mioUp ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${idRiga}','${nOrd}','${ns}')" title="Rimuovi assegnazione">&times;</button>` : '';
        return `<span class="badge-operatore" data-nome="${_esc(n)}" style="background:${col};border-color:${col}">${_esc(n)}${xBtn}</span>`;
    }).join('');
    if (btnEl && btnEl.parentNode) btnEl.remove();
    const mitt = mio.toUpperCase().trim();
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'assegnaOperatori', ordine: nOrd, operatori: nuova, id_riga: idRiga, mittente: mitt }) })
        .then(r => r.json()).then(j => {
            if (!j || (j.status !== 'ok' && j.status !== 'success')) throw new Error('Assegnazione non salvata');
            _syncAssegnaTimestamp(nOrd, idRiga, j.last_modified);
            _invalidateProduzioneCache();
            _repaintOpColors();
        })
        .catch(() => notificaElegante('\u26a0\ufe0f Assegnazione non salvata \u2013 riprova', 'error'));
}

function autoAssegnamiOrdine(nOrd) {
    const mio = window._normNome((utenteAttuale?.nome || '').trim());
    if (!mio) return;
    const mitt = mio.toUpperCase().trim();
    const wrapper = document.querySelector(`.ordine-wrapper[data-ordine="${nOrd}"]`);
    if (wrapper) {
        wrapper.querySelectorAll('.visualizza-operatori[data-id-riga]').forEach(cont => {
            const curr = [mio];
            cont.dataset.assegna = mio;
            const _mioUp = mio.toUpperCase();
            cont.innerHTML = curr.map(n => {
                const col = window._getOpColor(n); const idR = cont.dataset.idRiga; const ns = n.replace(/'/g,"\\'");
                const xBtn = n.toUpperCase() === _mioUp ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${idR}','${nOrd}','${ns}')" title="Rimuovi assegnazione">&times;</button>` : '';
                return `<span class="badge-operatore" data-nome="${_esc(n)}" style="background:${col};border-color:${col}">${_esc(n)}${xBtn}</span>`;
            }).join('');
        });
        wrapper.querySelectorAll('.op-dropdown[data-id-riga]').forEach(d => {
            d.dataset.assegna = mio;
            const lbl = d.querySelector('.op-trigger-label'); if (lbl) lbl.textContent = mio;
            d.querySelectorAll('.op-option').forEach(o => {
                const nn = o.querySelector('span:not(.op-opt-dot)')?.textContent.trim() || '';
                const isNow = window._normNome(nn).toUpperCase() === mio.toUpperCase();
                o.classList.toggle('is-selected', isNow);
                let ck = o.querySelector('.op-check-icon');
                if (isNow && !ck) { ck = document.createElement('i'); ck.className='fas fa-check op-check-icon'; o.appendChild(ck); }
                else if (!isNow && ck) ck.remove();
            });
        });
        const headDd = wrapper.querySelector('.op-dropdown-ord');
        if (headDd) {
            headDd.dataset.assegnaOrd = mio;
            const headLbl = headDd.querySelector('.op-trigger-label');
            if (headLbl) headLbl.textContent = mio;
        }
        const btnOrd = wrapper.querySelector('.btn-assegnami-ord');
        if (btnOrd) btnOrd.remove();
    }
    _setAssegnaLocalByOrdine(nOrd, mio);
    _repaintOpColors();
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'assegnaOperatori', ordine: nOrd, operatori: mio, mittente: mitt }) })
        .then(r => r.json()).then(j => {
            if (!j || (j.status !== 'ok' && j.status !== 'success')) throw new Error('Assegnazione non salvata');
            _syncAssegnaTimestamp(nOrd, null, j.last_modified);
            _invalidateProduzioneCache();
            _repaintOpColors();
        })
        .catch(() => notificaElegante('\u26a0\ufe0f Assegnazione non salvata \u2013 riprova', 'error'));
}

function selezionaStato(optBtn, idRiga, colore) {
    const nuovoStato = optBtn.querySelector('span:not(.stato-opt-dot)').textContent.trim();
    const dropdown = optBtn.closest('.stato-dropdown');
    const trigger = dropdown.querySelector('.stato-trigger');
    const labelEl = trigger.querySelector('.stato-label-txt');
    const dot = trigger.querySelector('.stato-dot');

    const statoPrec = {
        testo:  labelEl.textContent,
        colore: dot ? dot.style.background : '',
        selectedBtn: dropdown.querySelector('.stato-option.is-selected')
    };
    const prevProd = prodState.attiviProd ? prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga)) : null;
    const prevStatoProd = prevProd ? prevProd.stato : null;

    if (dot) dot.style.background = colore || '#94a3b8';
    labelEl.textContent = nuovoStato;
    dropdown.querySelectorAll('.stato-option').forEach(o => {
        o.classList.remove('is-selected');
        const existing = o.querySelector('.stato-check-icon');
        if (existing) existing.remove();
    });
    optBtn.classList.add('is-selected');
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check stato-check-icon';
    optBtn.appendChild(checkIcon);
    dropdown.classList.remove('open');
    const card = dropdown.closest('.item-card');
    if (card) card.classList.remove('stato-aperto');
    if (prodState.attiviProd && prevProd) prevProd.stato = nuovoStato;
    _syncStatoOrdineDropdown(dropdown.closest('.ordine-wrapper')?.dataset.ordine || '');
    _refreshOverview();
    _persistProduzioneHtmlSnapshot();

    if (card) { card.classList.add('optimistic-pending'); card.style.transition = 'opacity 0.3s'; }

    aggiornaDato(null, idRiga, 'stato', nuovoStato, true).then(ok => {
        if (card) { card.classList.remove('optimistic-pending'); card.style.opacity = ''; }
        if (ok) {
            _invalidateProduzioneCache();
        } else {
            if (dot) dot.style.background = statoPrec.colore;
            labelEl.textContent = statoPrec.testo;
            dropdown.querySelectorAll('.stato-option').forEach(o => {
                o.classList.remove('is-selected');
                const ic = o.querySelector('.stato-check-icon'); if (ic) ic.remove();
            });
            if (statoPrec.selectedBtn) {
                statoPrec.selectedBtn.classList.add('is-selected');
                const ic = document.createElement('i'); ic.className = 'fas fa-check stato-check-icon';
                statoPrec.selectedBtn.appendChild(ic);
            }
            if (prodState.attiviProd && prevProd && prevStatoProd !== null) prevProd.stato = prevStatoProd;
            _syncStatoOrdineDropdown(dropdown.closest('.ordine-wrapper')?.dataset.ordine || '');
            _refreshOverview();
            _persistProduzioneHtmlSnapshot();
            notificaElegante('\u26a0\ufe0f Modifica non salvata \u2013 riprova', 'error');
            console.error('[selezionaStato] Rollback', { idRiga, nuovoStato, statoPrec: statoPrec.testo });
        }
    }).catch(err => {
        if (card) { card.classList.remove('optimistic-pending'); card.style.opacity = ''; }
        if (dot) dot.style.background = statoPrec.colore;
        labelEl.textContent = statoPrec.testo;
        if (prodState.attiviProd && prevProd && prevStatoProd !== null) prevProd.stato = prevStatoProd;
        _syncStatoOrdineDropdown(dropdown.closest('.ordine-wrapper')?.dataset.ordine || '');
        _refreshOverview();
        _persistProduzioneHtmlSnapshot();
        notificaElegante('\u26a0\ufe0f Modifica non salvata \u2013 riprova', 'error');
        console.error('[selezionaStato] Errore + Rollback', err, { idRiga, nuovoStato });
    });
}

// Aggiorna il dropdown generale dell'ordine (.stato-dropdown-ord) in base allo stato
// attuale di tutte le sue righe in prodState.attiviProd.
function _syncStatoOrdineDropdown(nOrd) {
    if (!nOrd) return;
    const ddOrd = document.querySelector(`.stato-dropdown-ord[data-nord="${CSS.escape(nOrd)}"]`);
    if (!ddOrd) return;
    const righeOrd = (prodState.attiviProd || []).filter(r => (r.ordine || '') === nOrd);
    if (!righeOrd.length) return;
    const statiDistinct = [...new Set(righeOrd.map(r => (r.stato || 'IN ATTESA').toUpperCase().trim()))];
    const label  = statiDistinct.length === 1 ? statiDistinct[0] : `${statiDistinct.length} Stati`;
    const colore = statiDistinct.length === 1
        ? ((window.listaStati || []).find(s => s.nome === statiDistinct[0]) || { colore: '#e2e8f0' }).colore
        : '#e2e8f0';
    const lbl = ddOrd.querySelector('.stato-label-txt');
    const dot = ddOrd.querySelector('.stato-dot');
    if (lbl) lbl.textContent = label;
    if (dot) dot.style.background = colore;
}

function selezionaStatoOrdine(optBtn, nOrdine, nuovoStato, nuovoColore) {
    event.stopPropagation();
    const dropdown = optBtn.closest('.stato-dropdown-ord');
    if (!dropdown) return;

    const trigger = dropdown.querySelector('.stato-trigger');
    const labelEl = trigger ? trigger.querySelector('.stato-label-txt') : null;
    const dot     = trigger ? trigger.querySelector('.stato-dot') : null;

    const statoPrec = {
        testo:  labelEl ? labelEl.textContent : '',
        colore: dot ? dot.style.background : ''
    };

    if (labelEl) labelEl.textContent = nuovoStato;
    if (dot && nuovoColore) dot.style.background = nuovoColore;
    dropdown.classList.remove('open');
    const rigaOrd = dropdown.closest('.riga-ordine');
    if (rigaOrd) rigaOrd.classList.remove('stato-aperto-ord');

    const wrapper = document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(nOrdine)}"]`);
    if (!wrapper) return;

    const righe = Array.from(wrapper.querySelectorAll('[data-id-riga]')).map(el => el.dataset.idRiga);

    const statiPrecRighe = {};
    righe.forEach(idRiga => {
        const r = prodState.attiviProd ? prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga)) : null;
        statiPrecRighe[idRiga] = r ? r.stato : null;
    });

    // Optimistic UI: aggiorna subito tutto
    righe.forEach(idRiga => {
        if (prodState.attiviProd) {
            const r = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
            if (r) r.stato = nuovoStato;
        }
        _syncStatoItemCard(idRiga, nuovoStato, nuovoColore);
    });
    _refreshOverview();
    _persistProduzioneHtmlSnapshot();

    wrapper.classList.add('optimistic-pending');
    wrapper.style.transition = 'opacity 0.3s';

    notificaElegante(`\u2714 Ordine ${nOrdine} → ${nuovoStato}`, 'success');

    // UNA sola POST bulk per tutte le righe
    _aggiornaDatoBulk(righe, 'stato', nuovoStato).then(ok => {
        wrapper.classList.remove('optimistic-pending'); wrapper.style.opacity = '';
        if (ok) {
            _invalidateProduzioneCache();
        } else {
            // Rollback
            righe.forEach(idRiga => {
                const prev = statiPrecRighe[idRiga];
                if (prev) {
                    if (prodState.attiviProd) {
                        const r = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
                        if (r) r.stato = prev;
                    }
                    const prevColore = (window.listaStati.find(s => s.nome === prev) || {}).colore || '#e2e8f0';
                    _syncStatoItemCard(idRiga, prev, prevColore);
                }
            });
            _refreshOverview();
            _persistProduzioneHtmlSnapshot();
            if (labelEl) labelEl.textContent = statoPrec.testo;
            if (dot) dot.style.background = statoPrec.colore;
            notificaElegante('\u26a0\ufe0f Modifica non salvata \u2013 riprova', 'error');
            console.error('[selezionaStatoOrdine] Rollback — bulk save failed', { nOrdine, nuovoStato });
        }
    }).catch(err => {
        wrapper.classList.remove('optimistic-pending'); wrapper.style.opacity = '';
        if (labelEl) labelEl.textContent = statoPrec.testo;
        if (dot) dot.style.background = statoPrec.colore;
        righe.forEach(idRiga => {
            const prev = statiPrecRighe[idRiga];
            if (prev && prodState.attiviProd) {
                const r = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
                if (r) r.stato = prev;
            }
            if (prev) {
                const prevColore = (window.listaStati.find(s => s.nome === prev) || {}).colore || '#e2e8f0';
                _syncStatoItemCard(idRiga, prev, prevColore);
            }
        });
        _refreshOverview();
        notificaElegante('\u26a0\ufe0f Modifica non salvata \u2013 riprova', 'error');
        console.error('[selezionaStatoOrdine] Rollback', err, { nOrdine, nuovoStato });
    });
}

// ═══════════════════════════════════════════════════════════════════
//  D) ACCORDION & aggiornaDato (core save)
// ═══════════════════════════════════════════════════════════════════

function toggleAccordion(elemento) {
    elemento.classList.toggle('open');
    const container = elemento.nextElementSibling;
    container.style.display = elemento.classList.contains('open') ? 'block' : 'none';
}

async function aggiornaDato(selectEl, idRiga, campo, nuovoValore, skipForceSync = false) {
    RevisionPoller.pauseFor(15000);
    prodState.mutationInFlight++;
    let clientTimestamp = null;
    if (prodState.ultimiDatiProduzione && prodState.ultimiDatiProduzione.produzione) {
        const row = prodState.ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
        if (row && row.last_modified) clientTimestamp = row.last_modified;
    }

    if (selectEl) selectEl.style.opacity = '0.5';
    try {
        const bodyObj = {
            azione:    'aggiorna_produzione',
            id_riga:   idRiga,
            colonna:   campo,
            valore:    nuovoValore,
            mittente:  (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : ''
        };
        if (clientTimestamp) bodyObj.clientTimestamp = clientTimestamp;

        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify(bodyObj)
        });
        if (selectEl) selectEl.style.opacity = '1';
        const r = await res.json();
        if (r && r.status === 'auth_error') {
            window._gestisciAuthError_(r.message);
            return false;
        }

        // Conflict detection (optimistic locking)
        if (r && r.status === 'conflict') {
            if (selectEl) selectEl.style.opacity = '1';
            const serverData = r.serverData || {};
            mostraModalConflitto({
                altroUtente:    r.lastModifiedBy || serverData.last_modified_by || '',
                tuaModifica:    nuovoValore,
                serverModifica: campo === 'stato' ? (serverData.stato || '') : (serverData[campo] || ''),
                onSceglioClient: async () => {
                    RevisionPoller.pauseFor(15000);
                    const bodyForce = {
                        azione:   'aggiorna_produzione',
                        id_riga:  idRiga,
                        colonna:  campo,
                        valore:   nuovoValore,
                        mittente: (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : '',
                        force:    '1'
                    };
                    try {
                        const resForce = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(bodyForce) });
                        const rf = await resForce.json();
                        if (rf && rf.status === 'auth_error') { window._gestisciAuthError_(rf.message); return; }
                        if (rf && rf.last_modified) {
                            if (prodState.ultimiDatiProduzione && prodState.ultimiDatiProduzione.produzione) {
                                const rowf = prodState.ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
                                if (rowf) { rowf.last_modified = rf.last_modified; rowf[campo] = nuovoValore; }
                            }
                            if (prodState.attiviProd) {
                                const rowf = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
                                if (rowf) { rowf.last_modified = rf.last_modified; rowf[campo] = nuovoValore; }
                            }
                        }
                        notificaElegante('\u2714 Modifica forzata salvata');
                        _invalidateProduzioneCache();
                    } catch(eForce) { notificaElegante('\u26a0\ufe0f Errore durante il salvataggio forzato.', 'error'); }
                },
                onSceglioServer: () => {
                    if (selectEl) { selectEl.value = serverData[campo] || serverData.stato || ''; selectEl.style.opacity = '1'; }
                    if (prodState.ultimiDatiProduzione && prodState.ultimiDatiProduzione.produzione) {
                        const rowS = prodState.ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
                        if (rowS) {
                            if (serverData.stato)             rowS.stato = serverData.stato;
                            if (serverData.last_modified)     rowS.last_modified = serverData.last_modified;
                            if (serverData.last_modified_by)  rowS.last_modified_by = serverData.last_modified_by;
                        }
                    }
                    if (prodState.attiviProd) {
                        const rowS = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
                        if (rowS && serverData.stato) rowS.stato = serverData.stato;
                    }
                    notificaElegante('\ud83d\udd04 Aggiornato con la versione del server');
                }
            });
            return false;
        }

        if (r && r.status !== 'success') {
            console.warn('Backend response:', r);
            if (!skipForceSync) notificaElegante('\u26a0\ufe0f Cambio non salvato. Riprova.', 'warning');
            return false;
        }
        if (r.last_modified) {
            if (prodState.ultimiDatiProduzione && prodState.ultimiDatiProduzione.produzione) {
                const row = prodState.ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
                if (row) {
                    row.last_modified = r.last_modified;
                    row[campo] = nuovoValore;
                    if (campo === 'stato' && isStatoFinale(nuovoValore)) row.assegna = '';
                }
            }
            _persistProduzioneHtmlSnapshot();
            if (prodState.attiviProd) {
                const row = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
                if (row) {
                    row.last_modified = r.last_modified;
                    row[campo] = nuovoValore;
                    if (campo === 'stato' && isStatoFinale(nuovoValore)) row.assegna = '';
                }
            }
        }

        if (!skipForceSync) notificaElegante('\u2714 ' + (campo === 'stato' ? 'Stato' : 'Modifica') + ' salvato', 'success');
        _invalidateProduzioneCache();
        
        return true;
    } catch (e) {
        console.error('aggiornaDato error:', e);
        if (selectEl) selectEl.style.opacity = '1';
        if (!skipForceSync) notificaElegante('\u2717 Errore: cambio NON salvato. Riprova.', 'error');
        return false;
    } finally {
        prodState.mutationInFlight = Math.max(0, prodState.mutationInFlight - 1);
        prodState.mutationLastDone = Date.now();
    }
}

/**
 * Aggiornamento bulk: una sola POST per N righe (backend supporta id_righe[]).
 * Restituisce true se tutto ok, false altrimenti.
 */
async function _aggiornaDatoBulk(idRighe, campo, nuovoValore) {
    RevisionPoller.pauseFor(15000);
    prodState.mutationInFlight++;
    try {
        const bodyObj = {
            azione:    'aggiorna_produzione',
            id_righe:  idRighe,
            colonna:   campo,
            valore:    nuovoValore,
            mittente:  (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : ''
        };
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify(bodyObj)
        });
        const r = await res.json();
        if (r && r.status === 'auth_error') {
            window._gestisciAuthError_(r.message);
            return false;
        }
        if (r && r.status !== 'success') {
            console.warn('[_aggiornaDatoBulk] Backend response:', r);
            return false;
        }
        // Aggiorna in-memory data per tutte le righe
        if (r.last_modified) {
            idRighe.forEach(idRiga => {
                if (prodState.ultimiDatiProduzione && prodState.ultimiDatiProduzione.produzione) {
                    const row = prodState.ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
                    if (row) {
                        row.last_modified = r.last_modified;
                        row[campo] = nuovoValore;
                        if (campo === 'stato' && isStatoFinale(nuovoValore)) row.assegna = '';
                    }
                }
                if (prodState.attiviProd) {
                    const row = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
                    if (row) {
                        row.last_modified = r.last_modified;
                        row[campo] = nuovoValore;
                        if (campo === 'stato' && isStatoFinale(nuovoValore)) row.assegna = '';
                    }
                }
            });
        }
        _invalidateProduzioneCache();
        return true;
    } catch (e) {
        console.error('[_aggiornaDatoBulk] error:', e);
        return false;
    } finally {
        prodState.mutationInFlight = Math.max(0, prodState.mutationInFlight - 1);
        prodState.mutationLastDone = Date.now();
    }
}

async function gestisciArchiviazione(nOrd, tipo) {
    mostraConferma(
        'Archivia Ordine',
        `Vuoi spostare l'ordine ${nOrd} nell'archivio?`,
        () => {
            const wrapper = document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(nOrd)}"]`);
            const wrapperHTML = wrapper ? wrapper.outerHTML : null;
            const wrapperParent = wrapper ? wrapper.parentElement : null;
            const wrapperNext = wrapper ? wrapper.nextSibling : null;
            if (wrapper) {
                wrapper.style.transition = 'opacity 0.15s, transform 0.15s';
                wrapper.style.opacity = '0';
                wrapper.style.transform = 'scale(0.97)';
                setTimeout(() => wrapper.remove(), 150);
            }
            if (prodState.attiviProd) {
                prodState.attiviProd = prodState.attiviProd.filter(r => String(r.ordine || '').trim() !== String(nOrd).trim());
            }
            const kanbanItem = document.querySelector(`.ov-kanban-item[data-codice="${CSS.escape(nOrd)}"], .ov-kanban-item[data-ordine*="${nOrd}"]`);
            if (kanbanItem) kanbanItem.remove();

            const _eseguiArchivia = async () => {
                const response = await fetch(URL_GOOGLE, {
                    method: 'POST',
                    body: JSON.stringify({ azione: 'archiviaOrdine', ordine: nOrd })
                });
                const text = await response.text();
                let risultato;
                try { risultato = JSON.parse(text); }
                catch { throw new Error('Risposta non valida dal server.'); }
                return risultato;
            };

            (async () => {
                try {
                    let risultato;
                    try { risultato = await _eseguiArchivia(); }
                    catch { await new Promise(r => setTimeout(r, 2000)); risultato = await _eseguiArchivia(); }

                    if (risultato.status === "success") {
                        delete cacheContenuti['ARCHIVIO_ORDINI'];
                        _lsCacheDel('_html_ARCHIVIO_ORDINI');
                        _invalidateProduzioneCache();
                        notificaElegante('\u2714 Ordine ' + nOrd + ' archiviato', 'success');
                    } else {
                        if (wrapperHTML && wrapperParent) {
                            wrapperParent.insertBefore(
                                Object.assign(document.createElement('div'), { outerHTML: wrapperHTML }),
                                wrapperNext
                            );
                            const restored = wrapperParent.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(nOrd)}"]`);
                            if (restored) { restored.style.opacity = '1'; restored.style.transform = ''; }
                        }
                        const msgErr = (risultato.message || risultato.error || 'Errore sconosciuto').toString();
                        notificaElegante('\u2717 ' + msgErr + ' \u2013 ordine ripristinato', 'error');
                    }
                } catch (errore) {
                    if (wrapperHTML && wrapperParent) {
                        const tmp = document.createElement('template');
                        tmp.innerHTML = wrapperHTML;
                        const node = tmp.content.firstChild;
                        wrapperParent.insertBefore(node, wrapperNext);
                        const restored = wrapperParent.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(nOrd)}"]`);
                        if (restored) { restored.style.opacity = '1'; restored.style.transform = ''; }
                    }
                    notificaElegante('\u2717 ' + (errore.message || 'Errore di rete') + ' \u2013 ordine ripristinato', 'error');
                }
            })();
        },
        'Archivia'
    );
}

function toggleQtyEvasa(btn, idRiga, qtyTot) {
    const block = document.getElementById('qty-evasa-block-' + idRiga);
    if (!block) return;
    const isOpen = block.style.display !== 'none';
    block.style.display = isOpen ? 'none' : 'inline-flex';
    btn.classList.toggle('active', !isOpen);
    if (!isOpen) {
        const inp = document.getElementById('qty-evasa-input-' + idRiga);
        if (inp) { inp.focus(); inp.select(); }
    }
}

function aggiornaRimanente(idRiga, qtyTot, val) {
    const el = document.getElementById('qty-rimanente-' + idRiga);
    if (!el) return;
    const evasa = parseFloat(val);
    if (!isNaN(evasa) && evasa >= 0) {
        el.textContent = Math.max(0, qtyTot - evasa);
        el.style.color = (qtyTot - evasa) <= 0 ? '#22c55e' : '';
    } else {
        el.textContent = '\u2014';
        el.style.color = '';
    }
}

async function salvaQtyEvasa(idRiga, qtyTot, val) {
    const evasa = parseFloat(val);
    if (isNaN(evasa) || evasa < 0) return;
    aggiornaRimanente(idRiga, qtyTot, evasa);
    if (prodState.attiviProd) {
        const r = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
        if (r) r.qty_evasa = String(evasa);
    }
    await aggiornaDato(null, idRiga, 'qty_evasa', evasa);
}

async function gestisciRipristino(id_o_numero, tipo) {
    const msgConferma = tipo === 'ORDINE'
        ? `Riportare l'intero ordine ${id_o_numero} in PRODUZIONE?`
        : `Riportare questo articolo in PRODUZIONE?`;

    mostraConferma('Ripristina', msgConferma, async () => {
        try {
            const response = await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: 'ripristinaOrdine', ordine: id_o_numero, tipo })
            });
            const risultato = await response.json();
            if (risultato.status === "success") {
                    delete cacheContenuti['ARCHIVIO_ORDINI'];
                    _lsCacheDel('_html_ARCHIVIO_ORDINI');
                    _invalidateProduzioneCache();
                    caricaDati(window.paginaAttuale);
                } else {
                notificaElegante('Errore: ' + risultato.message, 'error');
            }
        } catch (e) {
            notificaElegante('Errore durante il ripristino.', 'error');
        }
    }, 'Ripristina');
}

// ═══════════════════════════════════════════════════════════════════
//  F) LIVE SYNC — polling + patch chirurgica del DOM
// ═══════════════════════════════════════════════════════════════════

function _startPollingProduzione() {
    _stopPollingProduzione();
    prodState.pollProdTimer = setInterval(_pollProdStep, prodState.POLL_PROD_MS);
}
function _stopPollingProduzione() {
    if (prodState.pollProdTimer) { clearInterval(prodState.pollProdTimer); prodState.pollProdTimer = null; }
}

async function _pollProdStep() {
    if (window.paginaAttuale !== 'PROGRAMMA PRODUZIONE DEL MESE') { _stopPollingProduzione(); return; }
    if (document.visibilityState === 'hidden') return;
    if (document.querySelector('.stato-dropdown.open, .op-dropdown.open')) return;
    if (Date.now() - prodState.lastKanbanDragTs < 5000) return;
    // Skip polling while saves are in-flight or just completed (< 12s)
    if (prodState.mutationInFlight > 0) return;
    if (Date.now() - prodState.mutationLastDone < 12000) return;
    if (_pollingRenderInFlight) return;
    _pollingRenderInFlight = true;
    try {
        const resp = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'getAllDashboard', includeArchivio: false })
        });
        if (!resp.ok) return;
        const bundle = await resp.json();
        if (!bundle || !bundle.produzione) return;
        if (bundle.avatarColors) _syncAvatarColors(bundle.avatarColors);
        const newAttivi = (bundle.produzione || []).filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
        _patchProduzione(newAttivi, bundle.produzione, bundle.archivio || []);
    } catch (_) { /* errore di rete silenzioso */ }
    finally { _pollingRenderInFlight = false; }
}

function _syncAvatarColors(serverMap) {
    if (!serverMap || typeof serverMap !== 'object') return;
    let changed = false;
    Object.entries(serverMap).forEach(([nome, colore]) => {
        if (!colore) return;
        const k = nome.toUpperCase().trim();
        if (window._avatarColorsCache[k] !== colore) {
            window._avatarColorsCache[k] = colore;
            try { localStorage.setItem('avatarColor_' + k, colore); } catch {}
            changed = true;
        }
    });
    if (!changed) return;
    if (utenteAttuale?.nome) {
        const mio = serverMap[utenteAttuale.nome.toUpperCase().trim()];
        if (mio && window._applyAvatarColorUI) window._applyAvatarColorUI(mio);
    }
    _repaintOpColors();
}

function _repaintOpColors() {
    const cont = document.getElementById('contenitore-dati');
    if (!cont) return;
    cont.querySelectorAll('.badge-operatore[data-nome]').forEach(el => {
        const col = window._getOpColor(el.dataset.nome);
        el.style.background = col;
        el.style.borderColor = col;
    });
    if (prodState.attiviProd && prodState.attiviProd.length) {
        const newHtml = _buildCaricoOperatoriHtml(prodState.attiviProd);
        const cards = cont.querySelectorAll('.ov-stato-card');
        const opCards = Array.from(cards).filter(c => /grid-column.*4/.test(c.getAttribute('style') || ''));
        if (opCards.length >= 2) {
            const tmp = document.createElement('div');
            tmp.innerHTML = newHtml;
            const newCards = tmp.querySelectorAll('.ov-stato-card');
            newCards.forEach((nc, i) => { if (opCards[i]) opCards[i].replaceWith(nc); });
        }
    }
    cont.querySelectorAll('.op-opt-dot').forEach(dot => {
        const btn = dot.closest('.op-option');
        if (!btn) return;
        const spans = btn.querySelectorAll('span');
        const nomeTxt = spans[1]?.textContent?.trim() || spans[0]?.textContent?.trim();
        if (nomeTxt) dot.style.background = window._getOpColor(nomeTxt);
    });
}

function _patchProduzione(newAttivi, allProd, allArch) {
    if (!prodState.attiviProd) return;

    const oldIds = new Set(prodState.attiviProd.map(r => String(r.id_riga)));
    const newIds = new Set(newAttivi.map(r => String(r.id_riga)));
    let structural = oldIds.size !== newIds.size;
    if (!structural) { for (const id of oldIds) { if (!newIds.has(id)) { structural = true; break; } } }
    if (!structural) { for (const id of newIds) { if (!oldIds.has(id)) { structural = true; break; } } }

    if (structural) {
        _backgroundRefreshProduzione(allProd, allArch);
        return;
    }

    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    let anyChange = false;

    newAttivi.forEach(newRow => {
        const idStr = String(newRow.id_riga);
        const oldRow = prodState.attiviProd.find(r => String(r.id_riga) === idStr);
        if (!oldRow) return;

        // Skip rows with optimistic-pending (save in-flight)
        const pendingCard = contenitore.querySelector(
            `.item-card.optimistic-pending[data-id-riga="${idStr}"], .ordine-wrapper.optimistic-pending`
        );
        if (pendingCard) return;

        const newStato = (newRow.stato || 'IN ATTESA').toUpperCase().trim();
        const oldStato = (oldRow.stato || 'IN ATTESA').toUpperCase().trim();
        if (newStato !== oldStato) {
            anyChange = true;
            const dd = contenitore.querySelector(`.stato-dropdown[data-id-riga="${idStr}"]`);
            if (dd) {
                const cfg = (window.listaStati || []).find(s => s.nome === newStato) || { colore: '#e2e8f0' };
                const dot = dd.querySelector('.stato-dot');
                const lbl = dd.querySelector('.stato-label-txt');
                if (dot) dot.style.background = cfg.colore;
                if (lbl) lbl.textContent = newStato;
                dd.querySelectorAll('.stato-option').forEach(opt => {
                    const nome = opt.querySelector('span:not(.stato-opt-dot)')?.textContent?.trim();
                    const sel  = nome === newStato;
                    opt.classList.toggle('is-selected', sel);
                    opt.querySelector('.stato-check-icon')?.remove();
                    if (sel) { const ic = document.createElement('i'); ic.className = 'fas fa-check stato-check-icon'; opt.appendChild(ic); }
                });
            }
            oldRow.stato = newStato;
            _syncKanbanFromStato(idStr, newStato);
            _syncStatoOrdineDropdown(newRow.ordine || '');
        }

        const newAssegna = String(newRow.assegna || '').trim();
        const oldAssegna = String(oldRow.assegna || '').trim();
        if (newAssegna !== oldAssegna) {
            anyChange = true;
            oldRow.assegna = newAssegna;
            const visEl = contenitore.querySelector(`.visualizza-operatori[data-id-riga="${idStr}"]`);
            if (visEl) visEl.dataset.assegna = newAssegna;
            const ddEl = contenitore.querySelector(`.op-dropdown[data-id-riga="${idStr}"]`);
            if (ddEl) {
                ddEl.dataset.assegna = newAssegna;
                const arr = newAssegna.split(',').map(n => window._normNome(n.trim())).filter(Boolean);
                const lbl = ddEl.querySelector('.op-trigger-label');
                if (lbl) lbl.textContent = arr.length ? arr.join(', ') : 'Libero';
            }
        }
    });

    if (anyChange) {
        prodState.attiviProd = newAttivi;
        delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
        cacheFetchTime['PROGRAMMA PRODUZIONE DEL MESE'] = Date.now();
        _repaintOpColors();
    }
}

function _backgroundRefreshProduzione(allProd, allArch) {
    // Debounce: due patch strutturali ravvicinate generano un solo re-render
    if (_bgRefreshDebounceTimer) clearTimeout(_bgRefreshDebounceTimer);
    _bgRefreshDebounceTimer = setTimeout(() => {
        _bgRefreshDebounceTimer = null;
        _doBackgroundRefresh(allProd, allArch);
    }, 400);
}

function _doBackgroundRefresh(allProd, allArch) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    const openSet = new Set();
    contenitore.querySelectorAll('.ordine-wrapper').forEach(w => {
        if (w.querySelector('.riga-ordine.open')) openSet.add(w.dataset.ordine);
    });
    const attivi = (allProd || []).filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
    prodState.attiviProd = attivi;
    const htmlAttivi    = generaBloccoOrdiniUnificato(allProd, false);
    const htmlArchiviati = generaBloccoOrdiniUnificato(allArch, true);
    const isMobileOv   = window.innerWidth <= 600;
    const ovContent    = isMobileOv ? '<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>' : _buildOverviewInnerHtml(attivi);
    const numInFocus   = attivi.filter(r => getOvStatiAll().includes((r.stato||'').toUpperCase().trim())).length;

    contenitore.innerHTML = `
        <details class="ov-accordion" id="ov-accordion"${isMobileOv ? '' : ' open'}>
            <summary class="ov-accordion-summary" onclick="_ovLoadIfNeeded(this)">
                <span class="ov-summary-label"><i class="fas fa-layer-group"></i> Stato Avanzamento</span>
                <span class="ov-summary-meta">${numInFocus} art. in lavorazione</span>
                <i class="fas fa-chevron-down ov-summary-chevron"></i>
            </summary>
            <div class="riepilogo-page" id="ov-content">${ovContent}</div>
        </details>
        <div class="scroll-wrapper">
            <button class="scroll-btn" onclick="_apriArchivio('archivio-prod-details')">
                <i class="fa-solid fa-box-archive"></i> Archivio
            </button>
        </div>
        <div class="sezione-attiva">
            ${htmlAttivi || "<div class='empty-msg'>Nessun ordine in produzione.</div>"}
        </div>
        <details id="archivio-prod-details" class="archivio-details">
            <summary class="separatore-archivio archivio-summary">
                <span>\u{1F4E6} ARCHIVIO STORICO ORDINI</span>
                <i class="fas fa-chevron-down archivio-chevron"></i>
            </summary>
            <div class="sezione-archiviata">
                ${htmlArchiviati || "<div class='empty-msg'>L'archivio \u00e8 vuoto.</div>"}
            </div>
        </details>`;

    if (openSet.size) {
        contenitore.querySelectorAll('.ordine-wrapper').forEach(w => {
            if (openSet.has(w.dataset.ordine)) {
                const riga = w.querySelector('.riga-ordine');
                const det  = w.querySelector('.dettagli-container');
                if (riga && det) { riga.classList.add('open'); det.style.display = 'block'; }
            }
        });
    }

    cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'] = contenitore.innerHTML;
    cacheFetchTime['PROGRAMMA PRODUZIONE DEL MESE'] = Date.now();
    window.aggiornaListaFiltrabili();
    requestAnimationFrame(_initKanbanDnd);
}

function _syncKanbanFromStato(idRiga, newStato) {
    const grid = document.getElementById('ov-kanban-grid');
    if (!grid) return;
    const newStatoUpper = (newStato || '').toUpperCase().trim();
    let item = grid.querySelector(`.ov-kanban-item[data-id-riga="${idRiga}"]`);
    if (!item) {
        grid.querySelectorAll('.ov-kanban-item').forEach(el => {
            if ((el.dataset.idRighe || '').split(',').map(s => s.trim()).includes(String(idRiga))) item = el;
        });
    }
    if (!item) return;
    if ((item.dataset.statoCorrente || '').toUpperCase().trim() === newStatoUpper) return;
    const destBody = grid.querySelector(`.ov-stato-body[data-stato-drop="${newStatoUpper}"]`);
    if (!destBody) return;
    destBody.querySelectorAll('.ov-empty-lbl').forEach(el => el.remove());
    item.dataset.statoCorrente = newStatoUpper;
    item.style.transition = 'opacity 0.18s, transform 0.18s';
    item.style.opacity    = '0';
    item.style.transform  = 'scale(0.92)';
    destBody.appendChild(item);
    const destCard = destBody.closest('.ov-stato-card');
    if (destCard) destCard.open = true;
    _aggiornaKanbanCount(grid);
    _checkKanbanEmpty(grid);
    requestAnimationFrame(() => {
        item.style.opacity   = '1';
        item.style.transform = '';
        setTimeout(() => { item.style.transition = ''; }, 200);
    });
}

// ═══════════════════════════════════════════════════════════════════
//  H) FILTRO ARTICOLI
// ═══════════════════════════════════════════════════════════════════

function toggleFiltroArticoli() {
    window.filtroRicercaArticoli = !window.filtroRicercaArticoli;
    document.querySelectorAll('.btn-filtro-articoli').forEach(btn => {
        btn.classList.toggle('active', window.filtroRicercaArticoli);
    });
    const ph = window.filtroRicercaArticoli ? 'Cerca codice articolo...' : 'Cerca in tutte le pagine...';
    const phMob = window.filtroRicercaArticoli ? 'Cerca articolo' : 'Cerca';
    const deskInput = document.getElementById('universal-search');
    const mobInput  = document.getElementById('mobile-search');
    if (deskInput) deskInput.placeholder = ph;
    if (mobInput)  mobInput.placeholder  = phMob;
    document.querySelectorAll('.item-card.hidden-search').forEach(c => c.classList.remove('hidden-search'));
    window.filtraUniversale();
}

function _aggiornaVisibilitaFiltroArticoli(nomeFoglio) {
    const isProduzione = nomeFoglio === 'PROGRAMMA PRODUZIONE DEL MESE';
    document.querySelectorAll('.btn-filtro-articoli').forEach(btn => {
        btn.style.display = isProduzione ? 'flex' : 'none';
    });
    if (!isProduzione && window.filtroRicercaArticoli) {
        window.filtroRicercaArticoli = false;
        document.querySelectorAll('.btn-filtro-articoli').forEach(btn => btn.classList.remove('active'));
        const deskInput = document.getElementById('universal-search');
        const mobInput  = document.getElementById('mobile-search');
        if (deskInput) deskInput.placeholder = 'Cerca in tutte le pagine...';
        if (mobInput)  mobInput.placeholder  = 'Cerca';
        document.querySelectorAll('.item-card.hidden-search').forEach(c => c.classList.remove('hidden-search'));
    }
}

// ═══════════════════════════════════════════════════════════════════
//  I) FILTRI AVANZATI PRODUZIONE
// ═══════════════════════════════════════════════════════════════════

const _PF_LS_KEY = '_prod_filtri_v1';
const _pfState = (() => {
    try { return JSON.parse(localStorage.getItem(_PF_LS_KEY)) || {}; } catch { return {}; }
})();
if (!_pfState.stati)         _pfState.stati = [];
if (!_pfState.sortBy)        _pfState.sortBy = 'default';
if (!_pfState.soloRimanente) _pfState.soloRimanente = false;

function _pfSave() {
    try { localStorage.setItem(_PF_LS_KEY, JSON.stringify(_pfState)); } catch {}
}

function _pfHasActiveFilters() {
    return _pfState.stati.length > 0 || _pfState.sortBy !== 'default' || _pfState.soloRimanente;
}

function _renderProdFilterBar() {
    const bar = document.getElementById('prod-filter-bar');
    if (!bar) return;
    const listaS = window.listaStati || [];
    const hasActive = _pfHasActiveFilters();
    const activeCount = _pfState.stati.length + (_pfState.sortBy !== 'default' ? 1 : 0) + (_pfState.soloRimanente ? 1 : 0);
    const sorts = [
        { key: 'default',       label: 'Predefinito' },
        { key: 'cliente_az',    label: 'Cliente A \u2192 Z' },
        { key: 'consegna_asc',  label: 'Consegna urgente prima' },
        { key: 'ordine_az',     label: 'N. Ordine A \u2192 Z' },
        { key: 'ordine_za',     label: 'N. Ordine Z \u2192 A' },
        { key: 'ordine_ts_asc', label: 'Data ordine (pi\u00f9 vecchi prima)' },
    ];
    // Mantieni panel aperto se era aperto
    const wasOpen = document.getElementById('pf-panel') && document.getElementById('pf-panel').style.display !== 'none';
    bar.innerHTML = `
    <div class="pf-wrap">
      <button type="button" class="pf-trigger-btn${hasActive ? ' pf-trigger-active' : ''}" id="pf-trigger-btn" onclick="event.stopPropagation();_pfTogglePanel()">
        <i class="fas fa-sliders-h" style="font-size:.75rem"></i>
        <span>Filtra / Ordina</span>
        ${hasActive ? `<span class="pf-active-badge">${activeCount}</span>` : ''}
        <i class="fas fa-chevron-down pf-caret" id="pf-caret"></i>
      </button>
      ${hasActive ? `<button type="button" class="pf-reset-btn" onclick="event.stopPropagation();_pfReset()" title="Rimuovi tutti i filtri"><i class="fas fa-times"></i></button>` : ''}
      <div class="pf-panel" id="pf-panel" style="display:${wasOpen ? 'block' : 'none'}">
        <div class="pf-panel-section">
          <div class="pf-panel-title">Ordina per</div>
          ${sorts.map(s => {
              const on = _pfState.sortBy === s.key;
              return `<label class="pf-row" onclick="event.stopPropagation();_pfSetSort('${s.key}')">
            <span class="pf-radio${on ? ' pf-radio-on' : ''}"></span>
            <span class="pf-row-lbl">${s.label}</span>
          </label>`;
          }).join('')}
        </div>
        <div class="pf-panel-sep"></div>
        <div class="pf-panel-section">
          <div class="pf-panel-title">Filtra per stato</div>
          ${listaS.map(s => {
              const sel = _pfState.stati.includes(s.nome);
              const safe = s.nome.replace(/'/g, "\\'");
              return `<label class="pf-row" onclick="event.stopPropagation();_pfToggleStato('${safe}')">
            <span class="pf-check${sel ? ' pf-check-on' : ''}"><i class="fas fa-check" style="font-size:.55rem;color:#fff;opacity:${sel ? 1 : 0}"></i></span>
            <span class="pf-stato-dot" style="background:${s.colore}"></span>
            <span class="pf-row-lbl">${s.nome}</span>
          </label>`;
          }).join('')}
        </div>
        <div class="pf-panel-sep"></div>
        <div class="pf-panel-section">
          <label class="pf-row" onclick="event.stopPropagation();_pfToggleRimanente()">
            <span class="pf-check${_pfState.soloRimanente ? ' pf-check-on' : ''}"><i class="fas fa-check" style="font-size:.55rem;color:#fff;opacity:${_pfState.soloRimanente ? 1 : 0}"></i></span>
            <span class="pf-row-lbl">Solo con rimanente &gt; 0</span>
          </label>
        </div>
      </div>
    </div>`;
}

function _pfTogglePanel() {
    const panel = document.getElementById('pf-panel');
    const caret = document.getElementById('pf-caret');
    if (!panel) return;
    const open = panel.style.display !== 'none';
    panel.style.display = open ? 'none' : 'block';
    if (caret) caret.style.transform = open ? '' : 'rotate(180deg)';
}

function _applicaFiltriProd() {
    const sezione = document.querySelector('.sezione-attiva');
    if (!sezione) return;
    const wrappers = [...sezione.querySelectorAll('.ordine-wrapper')];
    if (!wrappers.length) return;

    const stati = _pfState.stati;
    const sort = _pfState.sortBy;
    const soloRim = _pfState.soloRimanente;

    // Filtra visibilità
    wrappers.forEach(w => {
        let show = true;
        if (stati.length > 0) {
            const wStati = (w.dataset.stati || '').split(',').map(s => s.trim().toUpperCase());
            show = stati.some(s => wStati.includes(s.toUpperCase()));
        }
        if (show && soloRim) {
            show = w.dataset.haRimanente === '1';
        }
        w.style.display = show ? '' : 'none';
    });

    // Ordina
    if (sort !== 'default') {
        const visible = wrappers.filter(w => w.style.display !== 'none');
        visible.sort((a, b) => {
            if (sort === 'cliente_az') {
                const cA = (a.dataset.cliente || '').toLowerCase();
                const cB = (b.dataset.cliente || '').toLowerCase();
                return cA < cB ? -1 : cA > cB ? 1 : 0;
            }
            if (sort === 'consegna_asc') {
                const tsA = parseInt(a.dataset.consegnaMin) || 0;
                const tsB = parseInt(b.dataset.consegnaMin) || 0;
                if (!tsA && !tsB) return 0;
                if (!tsA) return 1;
                if (!tsB) return -1;
                return tsA - tsB;
            }
            if (sort === 'ordine_az') {
                const oA = (a.dataset.ordine || '').toUpperCase();
                const oB = (b.dataset.ordine || '').toUpperCase();
                return oA < oB ? -1 : oA > oB ? 1 : 0;
            }
            if (sort === 'ordine_za') {
                const oA = (a.dataset.ordine || '').toUpperCase();
                const oB = (b.dataset.ordine || '').toUpperCase();
                return oA > oB ? -1 : oA < oB ? 1 : 0;
            }
            if (sort === 'ordine_ts_asc') {
                const tsA = parseInt(a.dataset.ordineTs) || 0;
                const tsB = parseInt(b.dataset.ordineTs) || 0;
                if (!tsA && !tsB) return 0;
                if (!tsA) return 1;
                if (!tsB) return -1;
                return tsA - tsB;
            }
            return 0;
        });
        const bar = document.getElementById('prod-filter-bar');
        visible.forEach(w => sezione.appendChild(w));
        if (bar) sezione.insertBefore(bar, sezione.firstChild);
    }
}

function _pfToggleStato(nome) {
    const idx = _pfState.stati.indexOf(nome);
    if (idx >= 0) _pfState.stati.splice(idx, 1);
    else _pfState.stati.push(nome);
    _pfSave();
    _renderProdFilterBar();
    _applicaFiltriProd();
}

function _pfSetSort(key) {
    _pfState.sortBy = _pfState.sortBy === key && key !== 'default' ? 'default' : key;
    _pfSave();
    _renderProdFilterBar();
    _applicaFiltriProd();
}

function _pfToggleRimanente() {
    _pfState.soloRimanente = !_pfState.soloRimanente;
    _pfSave();
    _renderProdFilterBar();
    _applicaFiltriProd();
}

function _pfReset() {
    _pfState.stati = [];
    _pfState.sortBy = 'default';
    _pfState.soloRimanente = false;
    _pfSave();
    _renderProdFilterBar();
    _applicaFiltriProd();
}

// ── CSV Review resolve ──────────────────────────────────────────────
async function csvReviewResolve(idRiga, btnEl) {
    if (btnEl) { btnEl.disabled = true; btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'csvReviewResolve',
                id_riga: idRiga,
                mittente: (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : ''
            })
        });
        const r = await res.json();
        if (r && r.status === 'auth_error') { window._gestisciAuthError_(r.message); return; }
        if (r && r.status === 'ok') {
            const card = btnEl ? btnEl.closest('.item-card') : null;
            if (card) {
                card.classList.remove('csv-review-blink', 'csv-review-missing', 'csv-review-finish');
                const banner = card.querySelector('.csv-review-banner');
                if (banner) banner.remove();
            }
            // aggiorna anche dati locali
            if (prodState.attiviProd) {
                const row = prodState.attiviProd.find(x => String(x.id_riga) === String(idRiga));
                if (row) row.last_modified_by = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : '';
            }
            // rimuovi classe ordine se non ci sono più righe review
            if (card) {
                const wrapper = card.closest('.ordine-wrapper');
                if (wrapper && !wrapper.querySelector('.csv-review-blink')) {
                    wrapper.classList.remove('csv-review-order');
                }
            }
            _invalidateProduzioneCache();
            notificaElegante('✓ Riga risolta', 'success');
        } else {
            notificaElegante('⚠️ Errore risoluzione — riprova', 'error');
            if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = '<i class="fas fa-check"></i> Risolvi'; }
        }
    } catch (e) {
        console.error('[csvReviewResolve]', e);
        notificaElegante('⚠️ Errore rete — riprova', 'error');
        if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = '<i class="fas fa-check"></i> Risolvi'; }
    }
}

// ═══════════════════════════════════════════════════════════════════
//  REGISTER GLOBALS & INIT
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
//  J) INFO ORDINE — panel riepilogativo date/qty
// ═══════════════════════════════════════════════════════════════════

function apriInfoOrdine(nOrd) {
    // Rimuovi eventuale panel precedente
    const prev = document.getElementById('_info-ord-panel');
    if (prev) { prev.remove(); if (prev.dataset.nord === nOrd) return; }

    const righe = (prodState.attiviProd || []).filter(r => (r.ordine || '') === nOrd);
    if (!righe.length) return;
    const cliente = righe[0].cliente || 'N.D.';

    const rows = righe.map(r => {
        const cod  = r.codice && r.codice !== 'false' ? r.codice : 'Senza Codice';
        const qty  = r.qty || '\u2014';
        const qE   = (r.qty_evasa !== undefined && r.qty_evasa !== '') ? r.qty_evasa : '\u2014';
        const qR   = (r.qty_evasa !== undefined && r.qty_evasa !== '' && r.qty)
            ? String(Math.max(0, parseFloat(r.qty || 0) - parseFloat(r.qty_evasa || 0))) : '\u2014';
        const dO   = r.data_ordine || '\u2014';
        const dC   = r.data_consegna || '\u2014';
        return `<tr><td class="iop-td">${cod}</td><td class="iop-td iop-num">${qty}</td><td class="iop-td iop-num">${qE}</td><td class="iop-td iop-num">${qR}</td><td class="iop-td">${dO}</td><td class="iop-td">${dC}</td></tr>`;
    }).join('');

    const panel = document.createElement('div');
    panel.id = '_info-ord-panel';
    panel.dataset.nord = nOrd;
    panel.className = 'iop-overlay';
    panel.innerHTML = `
      <div class="iop-box" onclick="event.stopPropagation()">
        <div class="iop-header">
          <span class="iop-title"><i class="fas fa-circle-info" style="margin-right:6px;color:#6366f1"></i>${_esc(cliente)} — ORD.${nOrd}</span>
          <button class="iop-close" onclick="document.getElementById('_info-ord-panel').remove()"><i class="fas fa-times"></i></button>
        </div>
        <div class="iop-table-wrap">
          <table class="iop-table">
            <thead><tr>
              <th class="iop-th">Codice</th>
              <th class="iop-th iop-num">Qty</th>
              <th class="iop-th iop-num">Evasa</th>
              <th class="iop-th iop-num">Rim.</th>
              <th class="iop-th">Data ordine</th>
              <th class="iop-th">Data consegna</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <p class="iop-hint">Date e qty evasa vengono aggiornate al caricamento del CSV Yello.</p>
      </div>`;
    panel.addEventListener('click', () => panel.remove());
    document.body.appendChild(panel);
}

// ═══════════════════════════════════════════════════════════════════

function registerGlobals() {
    // Funzioni chiamate da onclick inline nell'HTML generato
    window.toggleAccordion = toggleAccordion;
    window.toggleStatoDropdown = toggleStatoDropdown;
    window.selezionaStato = selezionaStato;
    window.selezionaStatoOrdine = selezionaStatoOrdine;
    window.toggleOpDropdown = toggleOpDropdown;
    window.selezionaOpAssegna = selezionaOpAssegna;
    window.selezionaOpAssegnaOrdine = selezionaOpAssegnaOrdine;
    window.autoAssegnami = autoAssegnami;
    window.autoAssegnamiOrdine = autoAssegnamiOrdine;
    window.rimuoviOperatore = rimuoviOperatore;
    window.gestisciArchiviazione = gestisciArchiviazione;
    window.gestisciRipristino = gestisciRipristino;
    window.toggleQtyEvasa = toggleQtyEvasa;
    window.aggiornaRimanente = aggiornaRimanente;
    window.salvaQtyEvasa = salvaQtyEvasa;
    window.chiudiTuttiMenuAzioni = chiudiTuttiMenuAzioni;
    window.toggleMenuAzioni = toggleMenuAzioni;
    window.aggiornaDato = aggiornaDato;
    window.toggleFiltroArticoli = toggleFiltroArticoli;
    window._aggiornaVisibilitaFiltroArticoli = _aggiornaVisibilitaFiltroArticoli;
    window._renderProdFilterBar = _renderProdFilterBar;
    window._applicaFiltriProd   = _applicaFiltriProd;
    window._pfToggleStato       = _pfToggleStato;
    window._pfSetSort           = _pfSetSort;
    window._pfToggleRimanente   = _pfToggleRimanente;
    window._pfReset             = _pfReset;
    window._pfTogglePanel       = _pfTogglePanel;
    window.apriInfoOrdine       = apriInfoOrdine;
    window._pfHasActiveFilters  = _pfHasActiveFilters;
    window._getAttiviProd       = () => prodState.attiviProd;
    window._ovLoadIfNeeded = _ovLoadIfNeeded;
    window._apriArchivio = _apriArchivio;
    window._scrollToOrdineList = _scrollToOrdineList;
    window._initKanbanDnd = _initKanbanDnd;
    window._startPollingProduzione = _startPollingProduzione;
    window._stopPollingProduzione = _stopPollingProduzione;
    window._pollProdStep = _pollProdStep;
    window._repaintOpColors = _repaintOpColors;
    window.caricaDati = caricaDati;
    window.caricaArchivio = caricaArchivio;
    window._syncKanbanFromStato = _syncKanbanFromStato;
    window._setAssegnaLocalByOrdine = _setAssegnaLocalByOrdine;
    window._refreshOverview = _refreshOverview;
    window._invalidateProduzioneCache = _invalidateProduzioneCache;
    window.csvReviewResolve = csvReviewResolve;
}

function init() {
    // Chiude menu azioni se si clicca fuori
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.ord-azioni-menu')) chiudiTuttiMenuAzioni();
    });
    // Chiudi op-dropdown cliccando fuori
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.op-dropdown')) {
            document.querySelectorAll('.op-dropdown.open').forEach(d => {
                d.classList.remove('open');
                const c = d.closest('.item-card');    if (c) c.classList.remove('op-aperto');
                const r = d.closest('.riga-ordine'); if (r) r.classList.remove('op-aperto-ord');
            });
        }
    }, true);
    // Chiudi stato-dropdown cliccando fuori
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.stato-dropdown') && !e.target.closest('.stato-dropdown-ord')) {
            document.querySelectorAll('.stato-dropdown.open, .stato-dropdown-ord.open').forEach(d => {
                d.classList.remove('open');
                const c = d.closest('.item-card');
                if (c) c.classList.remove('stato-aperto');
                const r = d.closest('.riga-ordine');
                if (r) r.classList.remove('stato-aperto-ord');
            });
        }
    }, true);
    // Chiude filter panel se si clicca fuori
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.pf-wrap')) {
            const panel = document.getElementById('pf-panel');
            const caret = document.getElementById('pf-caret');
            if (panel && panel.style.display !== 'none') {
                panel.style.display = 'none';
                if (caret) caret.style.transform = '';
            }
        }
    });
    // Quando l'utente torna sulla tab, poll immediato su Produzione
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && window.paginaAttuale === 'PROGRAMMA PRODUZIONE DEL MESE') {
            _pollProdStep();
        }
    });
}

// ── Named exports ───────────────────────────────────────────────────
export {
    _fetchDatiProduzione,
    _renderDatiProduzione,
    caricaDati,
    caricaArchivio,
    _startPollingProduzione,
    _stopPollingProduzione,
    _pollProdStep,
    _initKanbanDnd,
    toggleFiltroArticoli,
    _aggiornaVisibilitaFiltroArticoli,
    registerGlobals,
    init
};
