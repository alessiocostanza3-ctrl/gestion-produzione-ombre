// PROD — Features / Produzione
// Estratto da script.js — 28 marzo 2026

import { URL_GOOGLE } from '../core/config.js';
import ProdCache, { caricaSezioneConCache } from '../core/cache.js';
import { notificaElegante, applicaFade, mostraModalConflitto, mostraConferma, _esc } from '../core/ui.js';
import { utenteAttuale } from '../core/session.js';
import RevisionPoller from '../core/revision-poller.js';
import { lsCacheSet as _lsCacheSet, lsCacheDel as _lsCacheDel } from '../core/ls-cache.js';
import { cacheContenuti, cacheFetchTime, prefetch } from '../core/state.js';

// (Paginazione rimossa: tutti gli ordini caricati in un colpo)

// ── Stato interno del modulo ────────────────────────────────────────────
let _ultimiDatiProduzione = null;
let _pollProdTimer = null;
const _POLL_PROD_MS = 10000;
let _lastKanbanDragTs = 0;
let _mutationInFlight = 0;          // contatore di salvataggi in corso
let _mutationLastDone = 0;          // timestamp ultimo salvataggio completato
let _prodCacheInvalidateTimer = null;
let _attiviProd = [];
let _ordiniAutocompleteCache = [];
let _ovStatiArt = ['PREPARARE','MANDA IN LAVORAZIONE','IN LAVORAZIONE','TORNATO DALLA LAVORAZIONE'];
let _ovStatiOrd = ['IN PRODUZIONE','IMBALLATO'];
let _datiArchLazy = null;  // dati archivio: renderizzati lazy solo all'apertura della sezione

function _getOvStatiAll() { return [..._ovStatiArt, ..._ovStatiOrd]; }

function _isStatoFinale_(stato) {
    const s = String(stato || '').toUpperCase().trim();
    return s === 'IMBALLATO' || s === 'SPEDITO/CONSEGNATO' || s === 'SPEDITO' || s === 'CONSEGNATO';
}

function _invalidateProduzioneCache({ resetFetchTime = true, invalidatePersistent = true } = {}) {
    delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
    if (resetFetchTime) cacheFetchTime['PROGRAMMA PRODUZIONE DEL MESE'] = 0;
    _lsCacheDel('_html_PROGRAMMA PRODUZIONE DEL MESE');
    if (!invalidatePersistent) return;

    // Debounce invalidazioni IndexedDB nelle raffiche di update.
    if (_prodCacheInvalidateTimer) clearTimeout(_prodCacheInvalidateTimer);
    _prodCacheInvalidateTimer = setTimeout(() => {
        _prodCacheInvalidateTimer = null;
        ProdCache.invalidate('PROGRAMMA_PRODUZIONE').catch(() => {});
    }, 1200);
}

// Aggiorna last_modified in-memory dopo assegnazione operatori
// (evita falsi positivi di conflitto su modifiche stato successive)
function _syncAssegnaTimestamp(nOrd, idRiga, lastModified) {
    if (!lastModified) return;
    const sources = [_ultimiDatiProduzione?.produzione, _attiviProd];
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
    _ultimiDatiProduzione = dati;

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
    _attiviProd = attivi;
    const STATI_OV = _getOvStatiAll();
    const numInFocus = attivi.filter(r => STATI_OV.includes((r.stato||'').toUpperCase().trim())).length;

    // --- SEZIONE ATTIVA --- (tutti gli ordini)
    const _attProdFull  = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
    let htmlAttivi = generaBloccoOrdiniUnificato(_attProdFull, false);

    // --- SEZIONE ARCHIVIATA --- lazy: render solo all'apertura (+100-500ms risparmio)
    _datiArchLazy = datiArch;
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
    _osservaArchivio('archivio-prod-details');
    requestAnimationFrame(_initKanbanDnd);
    requestAnimationFrame(() => {
        if (_attiviProd) {
            _attiviProd.forEach(r => {
                if (parseFloat(r.qty_evasa) > 0) {
                    const block = document.getElementById('qty-evasa-block-' + r.id_riga);
                    const btn   = block && block.closest('.qty-cell')?.querySelector('.btn-qty-evasa-toggle');
                    if (block) block.style.display = 'inline-flex';
                    if (btn)   btn.classList.add('active');
                }
            });
        }
    });
    _startPollingProduzione();

    // Salva raw data per autocomplete del modal
    _ordiniAutocompleteCache = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE').map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '', riferimento: r.riferimento || '' }));
    const seen = new Set();
    _ordiniAutocompleteCache = _ordiniAutocompleteCache.filter(o => { if (seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });
    window._ordiniAutocompleteCache = _ordiniAutocompleteCache;
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
//  B) CARD GENERATORS
// ═══════════════════════════════════════════════════════════════════

function generaBloccoOrdiniUnificato(dati, isArchivio) {
    if (!dati || dati.length === 0) return "";
    const TW = window.TW;

    const gruppi = {};
    dati.forEach(r => {
        if (!isArchivio && String(r.archiviato).toUpperCase() === "TRUE") return;
        const nOrd = r.ordine || "N.D.";
        if (!gruppi[nOrd]) gruppi[nOrd] = [];
        gruppi[nOrd].push(r);
    });

    let html = "";
    const _ordKeys = Object.keys(gruppi).sort((a, b) => {
        const _cliA = (gruppi[a][0].cliente || '').trim().toUpperCase();
        const _nA   = (!_cliA || _cliA === 'DA DEFINIRE') ? (gruppi[a][0].riferimento || a).toUpperCase() : _cliA;
        const _cliB = (gruppi[b][0].cliente || '').trim().toUpperCase();
        const _nB   = (!_cliB || _cliB === 'DA DEFINIRE') ? (gruppi[b][0].riferimento || b).toUpperCase() : _cliB;
        return _nA < _nB ? -1 : _nA > _nB ? 1 : (a < b ? -1 : a > b ? 1 : 0);
    });
    _ordKeys.forEach(nOrd => {
        const righe = gruppi[nOrd];
        const cliente = righe[0].cliente;
        const riferimento = righe[0].riferimento || "";
        const htmlRiferimento = riferimento ? `<span class="riferimento-label">(${_esc(riferimento)})</span>` : '';;

        const classWrapper = isArchivio ? 'archivio-wrapper' : '';
        const classHeader = isArchivio ? 'archivio-header' : '';
        const colorCliente = isArchivio ? '#475569' : 'inherit';

        let nOrdBadge;
        if (nOrd.includes('/')) {
            const slashIdx = nOrd.indexOf('/');
            const base = nOrd.substring(0, slashIdx);
            const sez  = nOrd.substring(slashIdx + 1);
            const sezTrunc = sez.length > 3 ? sez.substring(0, 3) + '.' : sez;
            nOrdBadge = `${base}/${sezTrunc}`;
        } else {
            nOrdBadge = nOrd.length > 14 ? nOrd.substring(0, 14) + '\u2026' : nOrd;
        }

        // Zona operatori nell'header (solo ordini attivi)
        let _opZoneOrd = '';
        if (!isArchivio) {
            if (window._isUtenteEsente()) {
                const _allAss = [...new Set(
                    righe.flatMap(r => (!_isStatoFinale_(r.stato) && r.assegna && r.assegna !== '' && r.assegna !== 'undefined')
                        ? r.assegna.split(',').map(n => window._normNome(n.trim())).filter(Boolean) : [])
                )];
                const _lblOrd = _allAss.length ? _allAss.map(window._normNome).join(', ') : 'Libero';
                const _opOptsOrd = window.listaOperatori.map(op => {
                    const _sel = _allAss.some(a => a.toUpperCase() === window._normNome(op.nome).toUpperCase());
                    const _col = window._getOpColor(op.nome.trim());
                    const _ns  = op.nome.trim().replace(/'/g, "\\'");
                    const _nOrdS = nOrd.replace(/'/g, "\\'");
                    return `<button type="button" class="op-option${_sel ? ' is-selected' : ''}" onclick="selezionaOpAssegnaOrdine(this,'${_nOrdS}','${_ns}')"><span class="op-opt-dot" style="background:${_col}"></span><span>${window._normNome(op.nome)}</span>${_sel ? '<i class="fas fa-check op-check-icon"></i>' : ''}</button>`;
                }).join('');
                _opZoneOrd = `<div class="op-dropdown op-dropdown-ord" data-nord="${nOrd}" data-assegna-ord="${_allAss.join(',').replace(/"/g,'&quot;')}"><button type="button" class="op-trigger op-trigger-ord" onclick="event.stopPropagation(); toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${_lblOrd}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${_opOptsOrd}</div></div>`;
            } else {
                const _mioN = (utenteAttuale?.nome || '').toUpperCase().trim();
                const _giaSonoOrd = righe.some(r => !_isStatoFinale_(r.stato) && r.assegna && r.assegna.split(',').some(n => n.trim().toUpperCase() === _mioN));
                if (!_giaSonoOrd) {
                    const _nOrdS = nOrd.replace(/'/g, "\\'");
                    _opZoneOrd = `<button class="btn-assegnami btn-assegnami-ord" onclick="event.stopPropagation(); autoAssegnamiOrdine('${_nOrdS}')" title="Assegnami a tutto l'ordine"><i class="fas fa-user-plus"></i></button>`;
                }
            }
        }
        const _nOrdEsc  = nOrd.replace(/'/g, "\\'");
        const _cliEsc   = (cliente || '').replace(/'/g, "\\'");
        const _idRiga0  = righe[0].id_riga;

        // Dropdown STATO per l'ordine (bulk change tutte righe)
        let _statoZoneOrd = '';
        if (!isArchivio && window._isUtenteEsente()) {
            const _statiBulk = righe
                .map(r => String(r.stato || 'IN ATTESA').toUpperCase().trim())
                .filter((s, i, arr) => arr.indexOf(s) === i);
            const _statoBulkLbl = _statiBulk.length === 1 ? _statiBulk[0] : `${_statiBulk.length} Stati`;
            const _configStato = window.listaStati.find(s => s.nome === _statiBulk[0]) || {colore: "#e2e8f0"};
            const _statoOptsOrd = window.listaStati.map(st => {
                const _nOrdS = nOrd.replace(/'/g, "\\'");
                return `<button type="button" class="stato-option" onclick="event.stopPropagation(); selezionaStatoOrdine(this,'${_nOrdS}','${st.nome}','${st.colore}')"><span class="stato-opt-dot" style="background:${st.colore}"></span><span>${st.nome}</span></button>`;
            }).join('');
            _statoZoneOrd = `<div class="stato-dropdown stato-dropdown-ord" data-nord="${nOrd}"><button type="button" class="stato-trigger" onclick="event.stopPropagation(); toggleStatoDropdown(this)" title="Cambia stato tutte righe"><span class="stato-dot" style="background:${_configStato.colore}"></span><span class="stato-label-txt">${_statoBulkLbl}</span><i class="fas fa-chevron-down stato-chevron"></i></button><div class="stato-popup">${_statoOptsOrd}</div></div>`;
        } else if (isArchivio || !window._isUtenteEsente()) {
        }

        // Azioni disponibili per questo ordine
        const _aChiedi   = `apriModalAiuto('${_idRiga0}', 'INTERO ORDINE', '${_nOrdEsc}', '${_cliEsc}')`;
        const _aArchivia = `gestisciArchiviazione('${_nOrdEsc}')`;
        const _aSollecit = `apriModalSollecito('','${_nOrdEsc}','${_cliEsc}','Intero Ordine')`;
        const _aRiprist  = `gestisciRipristino('${_nOrdEsc}', 'ORDINE')`;

        let _menuVoci = '';
        if (isArchivio) {
            _menuVoci = `<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aRiprist}"><i class="fa-solid fa-rotate-left"></i> Ripristina</button>`;
        } else {
            _menuVoci += `<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aChiedi}"><i class="fa-regular fa-envelope"></i> Chiedi</button>`;
            if (window._isUtenteEsente()) {
                _menuVoci += `<button class="ord-menu-item ord-menu-item--danger" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aArchivia}"><i class="fa-solid fa-box-archive"></i> Archivia</button>`;
            }
            if (window._isCommerciale() || window._isUtenteEsente()) {
                _menuVoci += `<button class="ord-menu-item ord-menu-item--warn" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aSollecit}"><i class="fa-solid fa-calendar-alt"></i> Scadenza</button>`;
            }
        }

        const _desktopBtns = isArchivio ? '' : `${_opZoneOrd}${_statoZoneOrd}`;

        const _mobileTrigger = `<div class="ord-azioni-menu" onclick="event.stopPropagation()">
            <button class="ord-azioni-trigger" onclick="toggleMenuAzioni(this)" title="Azioni">
                <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="ord-azioni-popup">${_menuVoci}</div>
        </div>`;

        const bottoniHeader = _desktopBtns + _mobileTrigger;

        html += `
        <div class="ordine-wrapper ${classWrapper}" data-ordine="${nOrd}" data-cliente="${(cliente || '').toLowerCase().replace(/"/g, '')}" data-riferimento="${(riferimento || '').toLowerCase().replace(/"/g, '')}" data-codici="${righe.map(a => (a.codice && a.codice !== 'false' ? a.codice : '')).join('|').toLowerCase()}">
            <div class="riga-ordine ${classHeader}" onclick="toggleAccordion(this)">
                <div class="flex-grow">
                    <span class="order-title" style="--order-color:${colorCliente}" title="${_esc(cliente)}">${_esc(cliente)} ${htmlRiferimento}</span>
                </div>
                <div class="order-info">
                    <div class="badge-count ${TW.pill}" title="ORD.${nOrd}"><span class="badge-ord-num">ORD.${nOrdBadge}</span><span class="badge-sep">\u00b7</span>${righe.length} ART.</div>
                    ${bottoniHeader}
                </div>
            </div>
            <div class="dettagli-container${isArchivio ? ' hidden' : ''}">
                ${righe.map(art => isArchivio ? generaCardArchivio(art, nOrd) : generaCardArticolo(art, nOrd, cliente)).join('')}
            </div>
        </div>`;
    });
    return html;
}

function generaCardArticolo(art, nOrd, cliente) {
    const TW = window.TW;
    const statoAttuale = (art.stato || "IN ATTESA").toUpperCase();
    const configStato = window.listaStati.find(s => s.nome === statoAttuale) || {colore: "#e2e8f0"};
    const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";

    const _assegnatiCard = (art.assegna && art.assegna !== '' && art.assegna !== 'undefined')
        ? art.assegna.split(',').map(n => window._normNome(n.trim())).filter(Boolean) : [];
    let opZoneCard;
    if (window._isUtenteEsente()) {
        const _lbl = _assegnatiCard.length ? _assegnatiCard.map(window._normNome).join(', ') : 'Libero';
        const _opts = window.listaOperatori.map(op => {
            const _sel = _assegnatiCard.some(a => a.toUpperCase() === window._normNome(op.nome).toUpperCase());
            const _col = window._getOpColor(op.nome.trim());
            const _ns  = op.nome.trim().replace(/'/g, "\\'");
            return `<button type="button" class="op-option${_sel ? ' is-selected' : ''}" onclick="selezionaOpAssegna(this,'${art.id_riga}','${nOrd}','${_ns}')"><span class="op-opt-dot" style="background:${_col}"></span><span>${window._normNome(op.nome)}</span>${_sel ? '<i class="fas fa-check op-check-icon"></i>' : ''}</button>`;
        }).join('');
        const _mioMasterNorm = window._normNome(utenteAttuale?.nome||'').toUpperCase().trim();
        opZoneCard = `<div class="op-dropdown" data-id-riga="${art.id_riga}" data-assegna="${(art.assegna||'').replace(/"/g,'&quot;')}" data-nord="${nOrd}"><button type="button" class="op-trigger" onclick="toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${_lbl}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${_opts}</div></div>${!_assegnatiCard.some(n => n.toUpperCase() === _mioMasterNorm) ? `<button class="btn-assegnami" onclick="autoAssegnami('${art.id_riga}','${nOrd}',this)" title="Assegnami"><i class="fas fa-user-plus"></i></button>` : ''}`;
    } else {
        const _mio = window._normNome(utenteAttuale?.nome || '').toUpperCase().trim();
        const _bdg = _assegnatiCard.map(n => {
            const _col = window._getOpColor(n); const _ns = n.replace(/'/g, "\\'");
            const _xBtn = n.toUpperCase() === _mio ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${art.id_riga}','${nOrd}','${_ns}')" title="Rimuovi assegnazione">&times;</button>` : '';
            return `<span class="badge-operatore" data-nome="${n}" style="background:${_col};border-color:${_col}">${n}${_xBtn}</span>`;
        }).join('');
        const _giaIo = _assegnatiCard.some(n => n.toUpperCase() === _mio);
        const _btnIo = !_giaIo ? `<button class="btn-assegnami" onclick="autoAssegnami('${art.id_riga}','${nOrd}',this)"><i class="fas fa-user-plus"></i> Assegnami</button>` : '';
        opZoneCard = `<div class="visualizza-operatori" data-id-riga="${art.id_riga}" data-assegna="${(art.assegna||'').replace(/"/g,'&quot;')}" data-nord="${nOrd}">${_bdg || '<span class="operatore-libero">Libero</span>'}${_btnIo}</div>`;
    }

    return `
    <div class="item-card ${TW.card}" data-codice="${codicePrincipale.toLowerCase().replace(/"/g, '')}">
        <div><span class="label-sm ${TW.label}">Codice Prodotto</span><b class="${TW.value}">${codicePrincipale}</b></div>
        <div class="qty-cell">
            <span class="label-sm ${TW.label}">Quantit\u00e0</span>
            <div class="qty-row">
                <b class="${TW.value} qty-totale">${art.qty}</b>
                <button class="btn-qty-evasa-toggle" title="Imposta quantit\u00e0 evasa" onclick="toggleQtyEvasa(this, '${art.id_riga}', ${parseFloat(art.qty)||0})" aria-label="Quantit\u00e0 parziale">
                    <i class="fas fa-flag-checkered"></i>
                </button>
                <span class="qty-evasa-block" id="qty-evasa-block-${art.id_riga}" style="display:none">
                    <input type="number" class="qty-evasa-input" id="qty-evasa-input-${art.id_riga}"
                        min="0" max="${parseFloat(art.qty)||9999}" step="1"
                        value="${parseFloat(art.qty_evasa)||''}"
                        placeholder="Evasa"
                        onchange="salvaQtyEvasa('${art.id_riga}', ${parseFloat(art.qty)||0}, this.value)"
                        oninput="aggiornaRimanente('${art.id_riga}', ${parseFloat(art.qty)||0}, this.value)"
                    />
                    <span class="qty-rimanente-wrap">
                        <span class="qty-rim-lbl">Rim.</span>
                        <b class="qty-rimanente" id="qty-rimanente-${art.id_riga}">${
                            (parseFloat(art.qty_evasa) > 0)
                                ? Math.max(0, parseFloat(art.qty) - parseFloat(art.qty_evasa))
                                : '\u2014'
                        }</b>
                    </span>
                </span>
            </div>
        </div>
        <div>
            <span class="label-sm ${TW.label}">Stato</span>
            <div class="stato-dropdown" data-id-riga="${art.id_riga}">
                <button type="button" class="stato-trigger" onclick="toggleStatoDropdown(this)">
                    <span class="stato-dot" style="background:${configStato.colore}"></span>
                    <span class="stato-label-txt">${statoAttuale}</span>
                    <i class="fas fa-chevron-down stato-chevron"></i>
                </button>
                <div class="stato-popup">
                    ${window.listaStati.map(s => `<button type="button" class="stato-option${s.nome === statoAttuale ? ' is-selected' : ''}" onclick="selezionaStato(this, '${art.id_riga}', '${s.colore}')"><span class="stato-opt-dot" style="background:${s.colore}"></span><span>${s.nome}</span>${s.nome === statoAttuale ? '<i class="fas fa-check stato-check-icon"></i>' : ''}</button>`).join('')}
                </div>
            </div>
        </div>
        <div>
            <span class="label-sm ${TW.label}">Operatore/i Assegnati</span>
            ${opZoneCard}
        </div>
        <div class="order-info-col">
            <button class="btn-chiedi-assegna ${TW.btnPrimary}" onclick="apriModalAiuto('${art.id_riga}', '${codicePrincipale}', '${nOrd}', '${(cliente||'').replace(/'/g,"\\'")}')">\n                <i class="fa-regular fa-envelope"></i> Chiedi\n            </button>\n            ${(window._isCommerciale() || window._isUtenteEsente()) ? `<button class="btn-sollecita" onclick="apriModalSollecito('${art.id_riga}','${nOrd}','${(cliente||'').replace(/'/g,"\\'")  }','${codicePrincipale.replace(/'/g,"\\'")  }')"><i class="fa-solid fa-calendar-alt"></i> Scadenza</button>` : ''}\n        </div>
    </div>`;
}

function generaCardArchivio(art, nOrd) {
    const TW = window.TW;
    const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";
    const statoArchiviato = (art.stato || "COMPLETATO").toUpperCase();

    let operatoreValore = art.assegna;
    if (!operatoreValore || operatoreValore === "false" || operatoreValore === "") {
        operatoreValore = "Nessuno";
    }

    return `
    <div class="item-card archivio-layout ${TW.card}">
        <div>
            <span class="label-sm ${TW.label}">Codice Prodotto</span>
            <b class="archivio-codice ${TW.value}">${codicePrincipale}</b>
        </div>

        <div class="archivio-qty">
            <span class="label-sm ${TW.label}">Quantit\u00e0</span>
            <b class="archivio-qty-val ${TW.value}">${art.qty}</b>
        </div>

        <div>
            <span class="label-sm ${TW.label}">Ultimo Stato</span>
            <span class="archivio-stato ${TW.value}">${statoArchiviato}</span>
        </div>

        <div>
            <span class="label-sm ${TW.label}">Operatore</span>
            <span class="archivio-operatore ${TW.value}">${_esc(operatoreValore)}</span>
        </div>

        <div class="item-actions">
            <button class="btn-archive-action primary ${TW.btnPrimary}" title="Reso Cliente" onclick="gestisciRipristino('${art.id_riga}', 'RIGA', 'RESO')">
                <i class="fa-solid fa-box"></i>
            </button>
            <button class="btn-archive-action warning ${TW.btnWarning}" title="Errore Archiviazione" onclick="gestisciRipristino('${art.id_riga}', 'RIGA', 'ERRORE')">
                <i class="fa-solid fa-rotate"></i>
            </button>
        </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════
//  C) STATO & OPERATORI INTERACTION
// ═══════════════════════════════════════════════════════════════════

async function rimuoviOperatore(idRiga, nOrd, nomeOperatore) {
    const container = document.querySelector(`.visualizza-operatori[data-id-riga="${idRiga}"]`);
    if (!container) return;

    const _normOp = window._normNome(nomeOperatore);
    const assegnaCorrente = container.dataset.assegna || '';
    const restanti = assegnaCorrente.split(',')
        .map(o => window._normNome(o.trim()))
        .filter(o => o && o.toUpperCase() !== _normOp.toUpperCase())
        .join(',');

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
        _invalidateProduzioneCache();
    fetch(url).then(r => r.json()).then(j => _syncAssegnaTimestamp(nOrd, idRiga, j.last_modified))
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
    if (idx >= 0) correnti.splice(idx, 1); else correnti.push(nomeOpNorm);
    const nuovaAssegna = correnti.join(',');

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
        _invalidateProduzioneCache();
    fetch(`${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(nuovaAssegna)}&id_riga=${idRiga}&mittente=${encodeURIComponent(mitt)}`)
        .then(r => r.json()).then(j => _syncAssegnaTimestamp(nOrd, idRiga, j.last_modified))
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
            const curr = (d.dataset.assegna || '').split(',').map(n => window._normNome(n.trim())).filter(Boolean);
            const i2 = curr.findIndex(n => n.toUpperCase() === nomeOpNorm.toUpperCase());
            if (idx >= 0 && i2 >= 0) curr.splice(i2, 1);
            else if (idx < 0 && i2 < 0)  curr.push(nomeOpNorm);
            d.dataset.assegna = curr.join(',');
            const l2 = curr.length ? curr.map(window._normNome).join(', ') : 'Libero';
            const lbl2 = d.querySelector('.op-trigger-label'); if (lbl2) lbl2.textContent = l2;
            d.querySelectorAll('.op-option').forEach(o => {
                const nn = o.querySelector('span:not(.op-opt-dot)')?.textContent.trim() || '';
                const isNow = curr.some(c => window._normNome(c) === nn);
                o.classList.toggle('is-selected', isNow);
                let ck = o.querySelector('.op-check-icon');
                if (isNow && !ck) { ck = document.createElement('i'); ck.className='fas fa-check op-check-icon'; o.appendChild(ck); }
                else if (!isNow && ck) ck.remove();
            });
        });
    }

    const mitt = (utenteAttuale?.nome || '').toUpperCase().trim();
    _invalidateProduzioneCache();
    fetch(`${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(nuovaAssegna)}&mittente=${encodeURIComponent(mitt)}`)
        .then(r => r.json()).then(j => _syncAssegnaTimestamp(nOrd, null, j.last_modified))
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
    container.dataset.assegna = nuova;
    const _mioUp = mio.toUpperCase();
    container.innerHTML = correnti.map(n => {
        const col = window._getOpColor(n); const ns = n.replace(/'/g, "\\'");
        const xBtn = n.toUpperCase() === _mioUp ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${idRiga}','${nOrd}','${ns}')" title="Rimuovi assegnazione">&times;</button>` : '';
        return `<span class="badge-operatore" data-nome="${_esc(n)}" style="background:${col};border-color:${col}">${_esc(n)}${xBtn}</span>`;
    }).join('');
    if (btnEl && btnEl.parentNode) btnEl.remove();
    const mitt = mio.toUpperCase().trim();
    _invalidateProduzioneCache();
    fetch(`${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(nuova)}&id_riga=${idRiga}&mittente=${encodeURIComponent(mitt)}`)
        .then(r => r.json()).then(j => _syncAssegnaTimestamp(nOrd, idRiga, j.last_modified))
        .catch(() => notificaElegante('\u26a0\ufe0f Assegnazione non salvata \u2013 riprova', 'error'));
}

function autoAssegnamiOrdine(nOrd) {
    const mio = window._normNome((utenteAttuale?.nome || '').trim());
    if (!mio) return;
    const mitt = mio.toUpperCase().trim();
    const wrapper = document.querySelector(`.ordine-wrapper[data-ordine="${nOrd}"]`);
    if (wrapper) {
        wrapper.querySelectorAll('.visualizza-operatori[data-id-riga]').forEach(cont => {
            const curr = (cont.dataset.assegna || '').split(',').map(n => window._normNome(n.trim())).filter(Boolean);
            if (curr.some(n => n.toUpperCase() === mitt)) return;
            curr.push(mio);
            cont.dataset.assegna = curr.join(',');
            const _mioUp = mio.toUpperCase();
            cont.innerHTML = curr.map(n => {
                const col = window._getOpColor(n); const idR = cont.dataset.idRiga; const ns = n.replace(/'/g,"\\'");
                const xBtn = n.toUpperCase() === _mioUp ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${idR}','${nOrd}','${ns}')" title="Rimuovi assegnazione">&times;</button>` : '';
                return `<span class="badge-operatore" data-nome="${_esc(n)}" style="background:${col};border-color:${col}">${_esc(n)}${xBtn}</span>`;
            }).join('');
        });
        const btnOrd = wrapper.querySelector('.btn-assegnami-ord');
        if (btnOrd) btnOrd.remove();
    }
    _invalidateProduzioneCache();
    fetch(`${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(mio)}&mittente=${encodeURIComponent(mitt)}`)
        .then(r => r.json()).then(j => _syncAssegnaTimestamp(nOrd, null, j.last_modified))
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
    const prevProd = _attiviProd ? _attiviProd.find(x => String(x.id_riga) === String(idRiga)) : null;
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
    if (_attiviProd && prevProd) prevProd.stato = nuovoStato;
    _syncKanbanFromStato(idRiga, nuovoStato);

    if (card) { card.classList.add('optimistic-pending'); card.style.opacity = '0.7'; card.style.transition = 'opacity 0.3s'; }

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
            if (_attiviProd && prevProd && prevStatoProd !== null) prevProd.stato = prevStatoProd;
            _syncKanbanFromStato(idRiga, statoPrec.testo);
            notificaElegante('\u26a0\ufe0f Modifica non salvata \u2013 riprova', 'error');
            console.error('[selezionaStato] Rollback', { idRiga, nuovoStato, statoPrec: statoPrec.testo });
        }
    }).catch(err => {
        if (card) { card.classList.remove('optimistic-pending'); card.style.opacity = ''; }
        if (dot) dot.style.background = statoPrec.colore;
        labelEl.textContent = statoPrec.testo;
        if (_attiviProd && prevProd && prevStatoProd !== null) prevProd.stato = prevStatoProd;
        _syncKanbanFromStato(idRiga, statoPrec.testo);
        notificaElegante('\u26a0\ufe0f Modifica non salvata \u2013 riprova', 'error');
        console.error('[selezionaStato] Errore + Rollback', err, { idRiga, nuovoStato });
    });
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
        const r = _attiviProd ? _attiviProd.find(x => String(x.id_riga) === String(idRiga)) : null;
        statiPrecRighe[idRiga] = r ? r.stato : null;
    });

    // Optimistic UI: aggiorna subito tutto
    righe.forEach(idRiga => {
        if (_attiviProd) {
            const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
            if (r) r.stato = nuovoStato;
        }
        _syncKanbanFromStato(idRiga, nuovoStato);
        _syncStatoItemCard(idRiga, nuovoStato, nuovoColore);
    });

    wrapper.classList.add('optimistic-pending');
    wrapper.style.opacity = '0.7'; wrapper.style.transition = 'opacity 0.3s';

    // UNA sola POST bulk per tutte le righe
    _aggiornaDatoBulk(righe, 'stato', nuovoStato).then(ok => {
        wrapper.classList.remove('optimistic-pending'); wrapper.style.opacity = '';
        if (ok) {
            notificaElegante(`\u2714 Ordine ${nOrdine} aggiornato a ${nuovoStato}`, 'success');
            _invalidateProduzioneCache();
        } else {
            // Rollback
            righe.forEach(idRiga => {
                const prev = statiPrecRighe[idRiga];
                if (prev) {
                    if (_attiviProd) {
                        const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
                        if (r) r.stato = prev;
                    }
                    const prevColore = (window.listaStati.find(s => s.nome === prev) || {}).colore || '#e2e8f0';
                    _syncKanbanFromStato(idRiga, prev);
                    _syncStatoItemCard(idRiga, prev, prevColore);
                }
            });
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
            if (prev && _attiviProd) {
                const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
                if (r) r.stato = prev;
            }
            if (prev) {
                const prevColore = (window.listaStati.find(s => s.nome === prev) || {}).colore || '#e2e8f0';
                _syncKanbanFromStato(idRiga, prev);
                _syncStatoItemCard(idRiga, prev, prevColore);
            }
        });
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
    _mutationInFlight++;
    let clientTimestamp = null;
    if (_ultimiDatiProduzione && _ultimiDatiProduzione.produzione) {
        const row = _ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
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
                            if (_ultimiDatiProduzione && _ultimiDatiProduzione.produzione) {
                                const rowf = _ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
                                if (rowf) { rowf.last_modified = rf.last_modified; rowf[campo] = nuovoValore; }
                            }
                            if (_attiviProd) {
                                const rowf = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
                                if (rowf) { rowf.last_modified = rf.last_modified; rowf[campo] = nuovoValore; }
                            }
                        }
                        notificaElegante('\u2714 Modifica forzata salvata');
                        _invalidateProduzioneCache();
                    } catch(eForce) { notificaElegante('\u26a0\ufe0f Errore durante il salvataggio forzato.', 'error'); }
                },
                onSceglioServer: () => {
                    if (selectEl) { selectEl.value = serverData[campo] || serverData.stato || ''; selectEl.style.opacity = '1'; }
                    if (_ultimiDatiProduzione && _ultimiDatiProduzione.produzione) {
                        const rowS = _ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
                        if (rowS) {
                            if (serverData.stato)             rowS.stato = serverData.stato;
                            if (serverData.last_modified)     rowS.last_modified = serverData.last_modified;
                            if (serverData.last_modified_by)  rowS.last_modified_by = serverData.last_modified_by;
                        }
                    }
                    if (_attiviProd) {
                        const rowS = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
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
            if (_ultimiDatiProduzione && _ultimiDatiProduzione.produzione) {
                const row = _ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
                if (row) {
                    row.last_modified = r.last_modified;
                    row[campo] = nuovoValore;
                    if (campo === 'stato' && _isStatoFinale_(nuovoValore)) row.assegna = '';
                }
            }
            if (_attiviProd) {
                const row = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
                if (row) {
                    row.last_modified = r.last_modified;
                    row[campo] = nuovoValore;
                    if (campo === 'stato' && _isStatoFinale_(nuovoValore)) row.assegna = '';
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
        _mutationInFlight = Math.max(0, _mutationInFlight - 1);
        _mutationLastDone = Date.now();
    }
}

/**
 * Aggiornamento bulk: una sola POST per N righe (backend supporta id_righe[]).
 * Restituisce true se tutto ok, false altrimenti.
 */
async function _aggiornaDatoBulk(idRighe, campo, nuovoValore) {
    RevisionPoller.pauseFor(15000);
    _mutationInFlight++;
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
                if (_ultimiDatiProduzione && _ultimiDatiProduzione.produzione) {
                    const row = _ultimiDatiProduzione.produzione.find(x => String(x.id_riga) === String(idRiga));
                    if (row) {
                        row.last_modified = r.last_modified;
                        row[campo] = nuovoValore;
                        if (campo === 'stato' && _isStatoFinale_(nuovoValore)) row.assegna = '';
                    }
                }
                if (_attiviProd) {
                    const row = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
                    if (row) {
                        row.last_modified = r.last_modified;
                        row[campo] = nuovoValore;
                        if (campo === 'stato' && _isStatoFinale_(nuovoValore)) row.assegna = '';
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
        _mutationInFlight = Math.max(0, _mutationInFlight - 1);
        _mutationLastDone = Date.now();
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
            if (_attiviProd) {
                _attiviProd = _attiviProd.filter(r => String(r.ordine || '').trim() !== String(nOrd).trim());
            }
            const kanbanItem = document.querySelector(`.ov-kanban-item[data-codice="${CSS.escape(nOrd)}"], .ov-kanban-item[data-ordine*="${nOrd}"]`);
            if (kanbanItem) kanbanItem.remove();

            const _eseguiArchivia = async () => {
                const url = URL_GOOGLE + "?azione=archiviaOrdine&ordine=" + encodeURIComponent(nOrd);
                const response = await fetch(url);
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
    if (_attiviProd) {
        const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
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
            const url = URL_GOOGLE + "?azione=ripristinaOrdine&ordine=" + encodeURIComponent(id_o_numero) + "&tipo=" + tipo;
            const response = await fetch(url);
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
    _pollProdTimer = setInterval(_pollProdStep, _POLL_PROD_MS);
}
function _stopPollingProduzione() {
    if (_pollProdTimer) { clearInterval(_pollProdTimer); _pollProdTimer = null; }
}

async function _pollProdStep() {
    if (window.paginaAttuale !== 'PROGRAMMA PRODUZIONE DEL MESE') { _stopPollingProduzione(); return; }
    if (document.visibilityState === 'hidden') return;
    if (document.querySelector('.stato-dropdown.open, .op-dropdown.open')) return;
    if (Date.now() - _lastKanbanDragTs < 5000) return;
    // Skip polling while saves are in-flight or just completed (< 12s)
    if (_mutationInFlight > 0) return;
    if (Date.now() - _mutationLastDone < 12000) return;
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
    if (_attiviProd && _attiviProd.length) {
        const newHtml = _buildCaricoOperatoriHtml(_attiviProd);
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
    if (!_attiviProd) return;

    const oldIds = new Set(_attiviProd.map(r => String(r.id_riga)));
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
        const oldRow = _attiviProd.find(r => String(r.id_riga) === idStr);
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
        }

        const newAssegna = String(newRow.assegna || '').trim();
        const oldAssegna = String(oldRow.assegna || '').trim();
        if (newAssegna !== oldAssegna) {
            anyChange = true;
            oldRow.assegna = newAssegna;
            const opEl = contenitore.querySelector(`.visualizza-operatori[data-id-riga="${idStr}"], .op-dropdown[data-id-riga="${idStr}"]`);
            if (opEl) opEl.dataset.assegna = newAssegna;
        }
    });

    if (anyChange) {
        _attiviProd = newAttivi;
        delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
        cacheFetchTime['PROGRAMMA PRODUZIONE DEL MESE'] = Date.now();
    }
}

function _backgroundRefreshProduzione(allProd, allArch) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    const openSet = new Set();
    contenitore.querySelectorAll('.ordine-wrapper').forEach(w => {
        if (w.querySelector('.riga-ordine.open')) openSet.add(w.dataset.ordine);
    });
    const attivi = (allProd || []).filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
    _attiviProd = attivi;
    const htmlAttivi    = generaBloccoOrdiniUnificato(allProd, false);
    const htmlArchiviati = generaBloccoOrdiniUnificato(allArch, true);
    const isMobileOv   = window.innerWidth <= 600;
    const ovContent    = isMobileOv ? '<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>' : _buildOverviewInnerHtml(attivi);
    const numInFocus   = attivi.filter(r => _getOvStatiAll().includes((r.stato||'').toUpperCase().trim())).length;

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
    let item = grid.querySelector(`.ov-kanban-item[data-id-riga="${idRiga}"]`);
    if (!item) {
        grid.querySelectorAll('.ov-kanban-item').forEach(el => {
            if ((el.dataset.idRighe || '').split(',').map(s => s.trim()).includes(String(idRiga))) item = el;
        });
    }
    if (!item) return;
    if (item.dataset.statoCorrente === newStato) return;
    const destBody = grid.querySelector(`.ov-stato-body[data-stato-drop="${newStato}"]`);
    if (!destBody) return;
    destBody.querySelectorAll('.ov-empty-lbl').forEach(el => el.remove());
    item.dataset.statoCorrente = newStato;
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
//  G) OVERVIEW / KANBAN
// ═══════════════════════════════════════════════════════════════════

function _ovLoadIfNeeded(summary) {
    const details = summary.parentElement;
    if (!details.open) {
        const contentDiv = document.getElementById('ov-content');
        if (contentDiv && contentDiv.querySelector('.ov-lazy-placeholder')) {
            contentDiv.innerHTML = _buildOverviewInnerHtml(_attiviProd);
            requestAnimationFrame(_initKanbanDnd);
        }
    }
}

function _apriArchivio(id) {
    const det = document.getElementById(id);
    if (!det) return;

    // Lazy render: alla prima apertura inserisce il contenuto archivio nel DOM
    const sezArch = det.querySelector('.sezione-archiviata');
    const archData = _datiArchLazy || (_ultimiDatiProduzione && _ultimiDatiProduzione.archivio);
    if (sezArch && archData && (_datiArchLazy || !sezArch.children.length)) {
        const htmlArch = generaBloccoOrdiniUnificato(archData, true);
        const archHtml = htmlArch || "<div class='empty-msg'>L'archivio \u00e8 vuoto.</div>"
        sezArch.innerHTML = archHtml;
        window.aggiornaListaFiltrabili?.();
        if (!cacheContenuti['ARCHIVIO_ORDINI']) {
            cacheContenuti['ARCHIVIO_ORDINI'] = archHtml;
            cacheFetchTime['ARCHIVIO_ORDINI'] = Date.now();
            _lsCacheSet('_html_ARCHIVIO_ORDINI', archHtml);
        }
        _datiArchLazy = null;
    }

    det.open = true;
    requestAnimationFrame(() => {
        det.querySelector('summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function _osservaArchivio(id) { /* disabilitato: apri solo col tasto */ }

function _buildCaricoOperatoriHtml(attivi) {
    const attiviOp = (attivi || []).filter(r => !_isStatoFinale_(r.stato));
    const OPS_PROD = ['Riccardo', 'Fabio T.', 'Niccol\u00f2', 'Alessio'];
    const map = new Map();
    OPS_PROD.forEach(op => map.set(op, []));
    const seenOrdine = new Map();
    OPS_PROD.forEach(op => seenOrdine.set(op, new Set()));

    function _findOp(nome) {
        const nNorm = window._normNome(nome);
        return OPS_PROD.find(o => o === nNorm || o.toUpperCase() === String(nome).trim().toUpperCase());
    }

    attiviOp.forEach(r => {
        if (!r.assegna || r.assegna === '' || r.assegna === 'undefined') return;
        const ordineKey = String(r.ordine || '').trim();
        if (!ordineKey) return;
        r.assegna.split(',').forEach(op => {
            const nome = op.trim();
            if (!nome) return;
            const found = _findOp(nome);
            if (found && !seenOrdine.get(found).has(ordineKey)) {
                seenOrdine.get(found).add(ordineKey);
                map.get(found).push(r);
            }
        });
    });

    const coloriStati = {};
    (window.listaStati || []).forEach(s => { coloriStati[s.nome.toUpperCase()] = s.colore; });

    function _clienteLabel(r) {
        const cli = String(r.cliente || '').trim().toUpperCase();
        if (!cli || cli === 'DA DEFINIRE') {
            const rif = String(r.riferimento || '').trim();
            return rif ? rif : '';
        }
        const w = r.cliente.trim().split(/\s+/).slice(0, 2).join(' ');
        return w.length > 14 ? w.substring(0, 13) + '\u2026' : w;
    }

    const card1Body = OPS_PROD.map(nome => {
        const items = map.get(nome) || [];
        const col = window._getOpColor(nome);
        const itemsHtml = items.length === 0
            ? '<div class="ov-op-item ov-op-item-free"><span class="ov-op-item-cod" style="color:#475569">Libero</span></div>'
            : items.map(r => {
                const stato = (r.stato || 'IN ATTESA').toUpperCase().trim();
                const colStato = coloriStati[stato] || '#94a3b8';
                const ordine = String(r.ordine || '').trim();
                const cli = _clienteLabel(r);
                const ordLbl = ordine.length > 10 ? ordine.substring(0, 9) + '\u2026' : ordine;
                return `<div class="ov-op-item">
                    <span class="ov-op-item-dot" style="background:${colStato}"></span>
                    <span class="ov-op-item-cod">${ordLbl}${cli ? ' <em style="color:#7c8fa8;font-style:italic">' + cli + '</em>' : ''}</span>
                </div>`;
            }).join('');
        return `<div class="ov-op-row">
            <div class="ov-op-header">
                <span class="ov-op-badge" style="background:${col}">${nome.charAt(0).toUpperCase()}</span>
                <span class="ov-op-nome">${nome}</span>
                ${items.length > 0 ? `<span class="ov-op-count" style="background:${col}33;color:${col}">${items.length}</span>` : '<span class="ov-op-free-badge">Libero</span>'}
            </div>
            <div class="ov-op-items">${itemsHtml}</div>
        </div>`;
    }).join('');

    const maxCount = Math.max(...OPS_PROD.map(n => (map.get(n) || []).length), 1);
    const card2Body = OPS_PROD.map(nome => {
        const count = (map.get(nome) || []).length;
        const col = window._getOpColor(nome);
        const pct = Math.round((count / maxCount) * 100);
        const isLibero = count === 0;
        return `<div class="ov-op-summary-row">
            <span class="ov-op-badge" style="background:${isLibero ? '#374151' : col}">${nome.charAt(0).toUpperCase()}</span>
            <div class="ov-op-summary-info">
                <div class="ov-op-summary-top">
                    <span class="ov-op-nome">${nome}</span>
                    ${isLibero
                        ? '<span class="ov-op-free-badge">Libero</span>'
                        : `<span class="ov-op-count" style="background:${col}33;color:${col}">${count} art.</span>`}
                </div>
                ${isLibero ? '' : `<div class="ov-op-bar-track"><div class="ov-op-bar-fill" style="width:${pct}%;background:${col}"></div></div>`}
            </div>
        </div>`;
    }).join('');

    const card1 = `<details class="ov-stato-card" open style="grid-column:4;grid-row:1">
        <summary class="ov-stato-header" style="--ov-col:#242424" onclick="if(window.innerWidth>600){event.preventDefault();return false;}">
            <span class="ov-stato-dot" style="background:#242424"></span>
            <span class="ov-stato-nome">Operatori</span>
            <span class="ov-stato-tot" style="background:#24242422;color:#475569">${OPS_PROD.length} op.</span>
            <i class="fas fa-chevron-down ov-sub-chevron"></i>
        </summary>
        <div class="ov-stato-body ov-op-card-body">${card1Body}</div>
    </details>`;

    const card2 = `<details class="ov-stato-card" open style="grid-column:4;grid-row:2">
        <summary class="ov-stato-header" style="--ov-col:#f59e0b" onclick="if(window.innerWidth>600){event.preventDefault();return false;}">
            <span class="ov-stato-dot" style="background:#f59e0b"></span>
            <span class="ov-stato-nome">Carico operatori</span>
            <span class="ov-stato-tot" style="background:#f59e0b33;color:#f59e0b">${OPS_PROD.length} tot.</span>
            <i class="fas fa-chevron-down ov-sub-chevron"></i>
        </summary>
        <div class="ov-stato-body ov-op-card-body">${card2Body}</div>
    </details>`;

    return card1 + card2;
}

function _buildOverviewInnerHtml(attivi) {
    const coloriStati = {};
    (window.listaStati || []).forEach(s => { coloriStati[s.nome.toUpperCase()] = s.colore; });
    const coloreDefault = '#94a3b8';

    const cardsHtml = _getOvStatiAll().map(stato => {
        const righe = attivi.filter(r => (r.stato || '').toUpperCase().trim() === stato.trim());
        const colore = coloriStati[stato] || coloreDefault;
        const isEmpty = righe.length === 0;

        const isOrdMode = _ovStatiOrd.includes(stato);
        let contenuto = '';
        let totLabel  = '';

        if (isOrdMode) {
            const gruppiMap = new Map();
            const gruppiOrd = [];
            righe.forEach(r => {
                const key = String(r.ordine || '\u2014').trim();
                if (gruppiMap.has(key)) { gruppiMap.get(key).push(r); }
                else { gruppiMap.set(key, [r]); gruppiOrd.push({ ordine: key, rows: gruppiMap.get(key) }); }
            });
            gruppiOrd.sort((a, b) => {
                const _cliA = (a.rows[0].cliente || '').trim().toUpperCase();
                const _nA   = (!_cliA || _cliA === 'DA DEFINIRE') ? (a.rows[0].riferimento || a.ordine).toUpperCase() : _cliA;
                const _cliB = (b.rows[0].cliente || '').trim().toUpperCase();
                const _nB   = (!_cliB || _cliB === 'DA DEFINIRE') ? (b.rows[0].riferimento || b.ordine).toUpperCase() : _cliB;
                return _nA < _nB ? -1 : _nA > _nB ? 1 : 0;
            });
            contenuto = gruppiOrd.map(({ ordine, rows }) => {
                const ids = rows.map(r => String(r.id_riga)).join(',');
                const primaRiga = rows[0];
                function _abbr(s) {
                    const w = (s || '').trim().split(/\s+/).slice(0, 2).join(' ');
                    return w.length > 18 ? w.substring(0, 17) + '\u2026' : w;
                }
                const cli      = String(primaRiga.cliente || '').trim().toUpperCase();
                const cliLabel = (!cli || cli === 'DA DEFINIRE') ? _abbr(primaRiga.riferimento || '') || ordine : _abbr(primaRiga.cliente);
                const ordLabel = ordine.length > 12 ? ordine.substring(0, 12) + '\u2026' : ordine;
                const artCount = rows.length;
                const qtyTot   = rows.reduce((s, r) => s + (parseInt(r.qty) || 1), 0);
                return `<div class="ov-stato-row ov-kanban-item"
                    data-id-riga="${primaRiga.id_riga}"
                    data-id-righe="${ids}"
                    data-count="${artCount}"
                    data-codice="${ordine.replace(/"/g, '&quot;')}"
                    data-ordine="${rows.map(r => r.ordine || '').join(',')}"
                    data-stato-corrente="${stato}"
                    title="Doppio clic \u2192 vai all'ordine nella lista">
                    <span class="ov-drag-handle"><i class="fas fa-grip-vertical"></i></span>
                    <span class="ov-row-main">
                        <span class="ov-row-label" title="${ordine}">${ordLabel} <em>${cliLabel}</em></span>
                        <span class="ov-row-sub">${artCount} art. \u00b7 ${qtyTot} pz</span>
                    </span>
                </div>`;
            }).join('');
            totLabel = gruppiOrd.length + ' ord.';

        } else {
            const gruppiMap = new Map();
            const gruppiOrd = [];
            righe.forEach(r => {
                const codice = String(r.codice && r.codice !== 'false' ? r.codice : r.riferimento || '\u2014').trim();
                if (gruppiMap.has(codice)) { gruppiMap.get(codice).push(r); }
                else { gruppiMap.set(codice, [r]); gruppiOrd.push({ codice, rows: gruppiMap.get(codice) }); }
            });
            gruppiOrd.sort((a, b) => a.codice < b.codice ? -1 : a.codice > b.codice ? 1 : 0);
            contenuto = gruppiOrd.map(({ codice, rows }) => {
                const lbl = codice.length > 24 ? codice.substring(0, 24) + '\u2026' : codice;
                const ids = rows.map(r => String(r.id_riga)).join(',');
                function _abbr(s) {
                    const w = (s || '').trim().split(/\s+/).slice(0, 2).join(' ');
                    return w.length > 14 ? w.substring(0, 13) + '\u2026' : w;
                }
                function _cliLabel(r) {
                    const cli = String(r.cliente || '').trim().toUpperCase();
                    if (!cli || cli === 'DA DEFINIRE') return _abbr(r.riferimento || '') || '';
                    return _abbr(r.cliente);
                }
                const cliGroupMap = new Map(); const cliGroupOrd = [];
                rows.forEach(r => {
                    const key = _cliLabel(r);
                    if (cliGroupMap.has(key)) { cliGroupMap.get(key).push(r); }
                    else { cliGroupMap.set(key, [r]); cliGroupOrd.push(key); }
                });
                const subParts = cliGroupOrd.map(cliKey => {
                    const grp = cliGroupMap.get(cliKey);
                    const ordsStr = grp.map(r => { const o = String(r.ordine || '').trim(); return o.length > 12 ? o.substring(0, 12) + '\u2026' : o; }).filter(Boolean).join(' / ');
                    if (!ordsStr && !cliKey) return '';
                    return ordsStr + (cliKey ? ' <em>' + cliKey + '</em>' : '');
                }).filter(Boolean);
                const subLine = subParts.join(' \u00b7 ');
                const qtyStr  = rows.length > 1 ? rows.map(r => (r.qty || 1) + 'pz').join('+') : (rows[0].qty || 1) + ' pz';
                return `<div class="ov-stato-row ov-kanban-item"
                    data-id-riga="${rows[0].id_riga}"
                    data-id-righe="${ids}"
                    data-count="${rows.length}"
                    data-codice="${codice.replace(/"/g, '&quot;')}"
                    data-ordine="${rows.map(r => r.ordine || '').join(',')}"
                    data-stato-corrente="${stato}"
                    title="Doppio clic \u2192 vai all'ordine nella lista">
                    <span class="ov-drag-handle"><i class="fas fa-grip-vertical"></i></span>
                    <span class="ov-row-main">
                        <span class="ov-row-label" title="${codice}">${lbl}</span>
                        ${subLine ? `<span class="ov-row-sub">${subLine}</span>` : ''}
                    </span>
                    <span class="ov-badge-qty">${qtyStr}</span>
                </div>`;
            }).join('');
            totLabel = righe.length + ' art.';
        }

        return `<details class="ov-stato-card${isEmpty ? ' ov-stato-card-empty' : ''}" open>
            <summary class="ov-stato-header" style="--ov-col:${colore}" onclick="if(window.innerWidth>600){event.preventDefault();return false;}">
                <span class="ov-stato-dot" style="background:${colore}"></span>
                <span class="ov-stato-nome">${stato}</span>
                <span class="ov-stato-tot" style="background:${colore}22;color:${colore}" data-stato-count="${stato}">${totLabel}</span>
                <i class="fas fa-chevron-down ov-sub-chevron"></i>
            </summary>
            <div class="ov-stato-body" data-stato-drop="${stato}">${isEmpty ? '<span class="ov-empty-lbl">\u2014 nessun articolo</span>' : contenuto}</div>
        </details>`;
    }).join('');

    return `<div class="ov-board-wrapper">
        <div class="ov-stati-grid" id="ov-kanban-grid">${cardsHtml}</div>
        <div class="ov-operatori-panel">${_buildCaricoOperatoriHtml(attivi)}</div>
    </div>`;
}

function _buildOverviewChart() { /* non più usato */ }

function _scrollToOrdineList(ordine) {
    if (!ordine) return;
    const wrapper = [...document.querySelectorAll('.ordine-wrapper')].find(el => el.dataset.ordine === ordine);
    if (!wrapper) return;
    const riga = wrapper.querySelector('.riga-ordine');
    const det  = wrapper.querySelector('.dettagli-container');
    if (riga && !riga.classList.contains('open')) {
        riga.classList.add('open');
        if (det) det.style.display = 'block';
    }
    setTimeout(() => { wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
    wrapper.style.transition = 'box-shadow 0.2s ease';
    wrapper.style.boxShadow = '0 0 0 3px #f59e0b99, 0 4px 24px #f59e0b33';
    setTimeout(() => { wrapper.style.transition = 'box-shadow 0.7s ease'; wrapper.style.boxShadow = ''; }, 1800);
}

// ═══════════════════════════════════════════════════════════════════
//  KANBAN DRAG & DROP
// ═══════════════════════════════════════════════════════════════════

function _initKanbanDnd() {
    const isMobileKanban = window.innerWidth <= 600;
    const grid = document.getElementById('ov-kanban-grid');
    if (!grid || grid._dndInit) return;
    grid._dndInit = true;

    grid.addEventListener('click', e => {
        const summary = e.target.closest('.ov-stato-header');
        if (!isMobileKanban && summary) e.preventDefault();
    }, true);

    let dragEl     = null;
    let ghost      = null;
    let srcStato   = null;
    let activeBody = null;
    let dragPointerId = null;
    let pendingTouchDrag = null;
    const TOUCH_HOLD_MS = 380;
    const TOUCH_MOVE_CANCEL_PX = 10;
    let offX = 0, offY = 0;

    function _bodyAtPoint(x, y) {
        if (ghost) ghost.style.visibility = 'hidden';
        const el = document.elementFromPoint(x, y);
        if (ghost) ghost.style.visibility = '';
        if (!el) return null;
        const body = el.closest('.ov-stato-body');
        if (body) return body;
        const header = el.closest('.ov-stato-header, .ov-stato-card > summary');
        if (header) {
            const card = header.closest('.ov-stato-card');
            if (card) return card.querySelector('.ov-stato-body');
        }
        return null;
    }

    function _highlight(body) {
        if (body === activeBody) return;
        grid.querySelectorAll('.ov-stato-body').forEach(b => b.classList.remove('ov-drop-over'));
        activeBody = body;
        if (body && body.dataset.statoDrop !== srcStato) {
            body.classList.add('ov-drop-over');
        }
    }

    function _cleanup() {
        if (pendingTouchDrag && pendingTouchDrag.pressTimer) {
            clearTimeout(pendingTouchDrag.pressTimer);
            if (pendingTouchDrag.item) pendingTouchDrag.item.classList.remove('ov-touch-hold-pending');
            pendingTouchDrag = null;
        }
        if (dragEl && dragPointerId != null) {
            try {
                if (dragEl.hasPointerCapture && dragEl.hasPointerCapture(dragPointerId)) {
                    dragEl.releasePointerCapture(dragPointerId);
                }
            } catch (_) {}
        }
        if (ghost) { ghost.remove(); ghost = null; }
        if (dragEl) { 
            dragEl.classList.remove('ov-drag-active');
            dragEl.style.userSelect = '';
            dragEl = null;
        }
        grid.querySelectorAll('.ov-stato-body').forEach(b => b.classList.remove('ov-drop-over'));
        srcStato = null;
        activeBody = null;
        dragPointerId = null;
    }

    let _lastPointerDownTime = 0;
    let _lastPointerDownItem = null;

    function _startDrag(item, clientX, clientY, pointerId) {
        dragEl = item;
        srcStato = item.dataset.statoCorrente;
        dragPointerId = pointerId;

        const rect = item.getBoundingClientRect();
        offX = clientX - rect.left;
        offY = clientY - rect.top;

        ghost = item.cloneNode(true);
        ghost.removeAttribute('id');
        ghost.style.cssText = [
            'position:fixed',
            `width:${rect.width}px`,
            `height:${rect.height}px`,
            `left:${rect.left}px`,
            `top:${rect.top}px`,
            'opacity:0.92',
            'pointer-events:none',
            'user-select:none',
            '-webkit-user-select:none',
            'z-index:99999',
            'border-radius:8px',
            'box-shadow:0 10px 32px rgba(0,0,0,0.55)',
            'transform:scale(1.05) rotate(-1.2deg)',
            'transition:transform 0.1s',
            'background:#1e2d3d',
            'border:1.5px solid #475569'
        ].join(';');
        document.body.appendChild(ghost);

        item.style.userSelect = 'none';
        dragEl.classList.add('ov-drag-active');

        try {
            if (dragEl.setPointerCapture) dragEl.setPointerCapture(pointerId);
            else if (grid.setPointerCapture) grid.setPointerCapture(pointerId);
        } catch (_) {}
    }

    grid.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        const item = e.target.closest('.ov-kanban-item');
        if (!item) return;

        const now = Date.now();
        if (_lastPointerDownItem === item && now - _lastPointerDownTime < 280) {
            _lastPointerDownTime = 0;
            _lastPointerDownItem = null;
            const ordine = (item.dataset.ordine || '').split(',')[0].trim();
            if (ordine) _scrollToOrdineList(ordine);
            return;
        }
        _lastPointerDownTime = now;
        _lastPointerDownItem = item;

        if (e.pointerType === 'touch') {
            if (pendingTouchDrag && pendingTouchDrag.pressTimer) {
                clearTimeout(pendingTouchDrag.pressTimer);
                if (pendingTouchDrag.item) pendingTouchDrag.item.classList.remove('ov-touch-hold-pending');
            }
            item.classList.add('ov-touch-hold-pending');
            pendingTouchDrag = {
                item,
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                pressTimer: setTimeout(() => {
                    if (!pendingTouchDrag || pendingTouchDrag.pointerId !== e.pointerId || dragEl) return;
                    pendingTouchDrag.item.classList.remove('ov-touch-hold-pending');
                    _startDrag(item, pendingTouchDrag.startX, pendingTouchDrag.startY, e.pointerId);
                    pendingTouchDrag = null;
                }, TOUCH_HOLD_MS)
            };
            return;
        }

        e.preventDefault();
        _startDrag(item, e.clientX, e.clientY, e.pointerId);
    });

    function _onPointerMove(e) {
        if (pendingTouchDrag && !dragEl && e.pointerId === pendingTouchDrag.pointerId) {
            const dx = Math.abs(e.clientX - pendingTouchDrag.startX);
            const dy = Math.abs(e.clientY - pendingTouchDrag.startY);
            if (dx > TOUCH_MOVE_CANCEL_PX || dy > TOUCH_MOVE_CANCEL_PX) {
                clearTimeout(pendingTouchDrag.pressTimer);
                pendingTouchDrag.item.classList.remove('ov-touch-hold-pending');
                pendingTouchDrag = null;
            }
        }
        if (!dragEl || !ghost) return;
        ghost.style.left = (e.clientX - offX) + 'px';
        ghost.style.top  = (e.clientY - offY) + 'px';
        _highlight(_bodyAtPoint(e.clientX, e.clientY));
    }
    grid.addEventListener('pointermove', _onPointerMove);
    window.addEventListener('pointermove', _onPointerMove, { passive: true });

    function _onPointerUp(e) {
        if (pendingTouchDrag && !dragEl && e.pointerId === pendingTouchDrag.pointerId) {
            clearTimeout(pendingTouchDrag.pressTimer);
            pendingTouchDrag.item.classList.remove('ov-touch-hold-pending');
            pendingTouchDrag = null;
            return;
        }
        if (!dragEl) return;
        const body     = _bodyAtPoint(e.clientX, e.clientY);
        const newStato = body?.dataset?.statoDrop;
        const elDrop   = dragEl;
        const oldStato = srcStato;

        _cleanup();

        if (!newStato || newStato === oldStato || !body) return;

        const idRiga  = elDrop.dataset.idRiga;
        const idRighe = (elDrop.dataset.idRighe || idRiga).split(',').map(s => s.trim()).filter(Boolean);
        const colore = (window.listaStati.find(s => s.nome === newStato) || {}).colore || '#94a3b8';

        body.querySelectorAll('.ov-empty-lbl').forEach(el => el.remove());
        elDrop.dataset.statoCorrente = newStato;
        body.appendChild(elDrop);

        const destCard = body.closest('.ov-stato-card');
        if (destCard) destCard.open = true;

        _aggiornaKanbanCount(grid);
        _checkKanbanEmpty(grid);

        elDrop.style.transition = 'transform 0.18s, opacity 0.18s';
        elDrop.style.transform  = 'scale(1.04)';
        elDrop.style.opacity    = '0.6';
        requestAnimationFrame(() => {
            elDrop.style.transform = '';
            elDrop.style.opacity   = '';
            setTimeout(() => { elDrop.style.transition = ''; }, 200);
        });

        const _kanbanStatiPrec = {};
        idRighe.forEach(id => {
            const r = _attiviProd ? _attiviProd.find(x => String(x.id_riga) === id) : null;
            _kanbanStatiPrec[id] = r ? r.stato : oldStato;
        });

        idRighe.forEach(id => {
            if (_attiviProd) {
                const r = _attiviProd.find(x => String(x.id_riga) === id);
                if (r) r.stato = newStato;
            }
        });

        elDrop.classList.add('optimistic-pending');
        elDrop.style.opacity = '0.7'; elDrop.style.transition = 'opacity 0.3s';

        _lastKanbanDragTs = Date.now();
        (async () => {
            let anyFailed = false;
            for (const id of idRighe) {
                const ok = await aggiornaDato(null, id, 'stato', newStato);
                if (!ok) anyFailed = true;
            }
            elDrop.classList.remove('optimistic-pending'); elDrop.style.opacity = '';
            if (anyFailed) {
                const srcBody = grid.querySelector(`.ov-stato-body[data-stato-drop="${oldStato}"]`);
                if (srcBody) {
                    elDrop.dataset.statoCorrente = oldStato;
                    srcBody.querySelectorAll('.ov-empty-lbl').forEach(el => el.remove());
                    srcBody.appendChild(elDrop);
                }
                idRighe.forEach(id => {
                    const prev = _kanbanStatiPrec[id] || oldStato;
                    if (_attiviProd) {
                        const r = _attiviProd.find(x => String(x.id_riga) === id);
                        if (r) r.stato = prev;
                    }
                    const prevCol = (window.listaStati.find(s => s.nome === prev) || {}).colore || '#94a3b8';
                    _syncStatoItemCard(id, prev, prevCol);
                });
                _aggiornaKanbanCount(grid);
                _checkKanbanEmpty(grid);
                notificaElegante('\u26a0\ufe0f Modifica non salvata \u2013 riprova', 'error');
                console.error('[Kanban DnD] Rollback', { idRighe, newStato, oldStato });
            } else {
                _invalidateProduzioneCache();
            }
        })();
        idRighe.forEach(id => _syncStatoItemCard(id, newStato, colore));
        notificaElegante(`\u2714 Stato \u2192 ${newStato}`);
    }
    grid.addEventListener('pointerup', _onPointerUp);
    window.addEventListener('pointerup', _onPointerUp, { passive: true });

    grid.addEventListener('pointercancel', _cleanup);
    window.addEventListener('pointercancel', _cleanup, { passive: true });

    grid.addEventListener('dragstart', e => e.preventDefault());
}

function _aggiornaKanbanCount(grid) {
    grid.querySelectorAll('.ov-stato-body').forEach(body => {
        const stato = body.dataset.statoDrop;
        const isOrd = _ovStatiOrd.includes(stato);
        const items = body.querySelectorAll('.ov-kanban-item');
        let count = 0;
        if (isOrd) {
            count = items.length;
        } else {
            items.forEach(item => { count += parseInt(item.dataset.count || '1', 10); });
        }
        const badge = grid.querySelector(`[data-stato-count="${stato}"]`);
        if (badge) badge.textContent = count + (isOrd ? ' ord.' : ' art.');
        const card = body.closest('.ov-stato-card');
        if (card) card.classList.toggle('ov-stato-card-empty', count === 0);
    });
}

function _checkKanbanEmpty(grid) {
    grid.querySelectorAll('.ov-stato-body').forEach(body => {
        const hasItems = body.querySelectorAll('.ov-kanban-item').length > 0;
        if (!hasItems && !body.querySelector('.ov-empty-lbl')) {
            const lbl = document.createElement('span');
            lbl.className = 'ov-empty-lbl';
            lbl.textContent = '\u2014 nessun articolo';
            body.appendChild(lbl);
        }
    });
}

function _syncStatoItemCard(idRiga, newStato, colore) {
    const dropdown = document.querySelector(`.stato-dropdown[data-id-riga="${idRiga}"]`);
    if (!dropdown) return;
    const trigger = dropdown.querySelector('.stato-trigger');
    if (!trigger) return;
    const dot = trigger.querySelector('.stato-dot');
    const lbl = trigger.querySelector('.stato-label-txt');
    if (dot) dot.style.background = colore;
    if (lbl) lbl.textContent = newStato;
    dropdown.querySelectorAll('.stato-option').forEach(o => {
        const oName = o.querySelector('span:not(.stato-opt-dot)')?.textContent.trim();
        o.classList.toggle('is-selected', oName === newStato);
        const existing = o.querySelector('.stato-check-icon');
        if (existing) existing.remove();
        if (oName === newStato) {
            const chk = document.createElement('i');
            chk.className = 'fas fa-check stato-check-icon';
            o.appendChild(chk);
        }
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
//  REGISTER GLOBALS & INIT
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
