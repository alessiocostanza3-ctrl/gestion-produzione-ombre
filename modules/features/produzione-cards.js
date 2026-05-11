// PROD — Produzione / Card Generators
// Generazione HTML per ordini, articoli e archivio

import { isStatoFinale } from './produzione-state.js';
import { _esc } from '../core/ui.js';
import { utenteAttuale } from '../core/session.js';

// Converte data CSV (DD/MM/YYYY o YYYY-MM-DD) in timestamp Unix ms. Ritorna 0 se non valida.
function _parseDataCSV(s) {
    if (!s) return 0;
    const str = String(s).trim();
    // DD/MM/YYYY
    const m1 = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m1) return new Date(+m1[3], +m1[2] - 1, +m1[1]).getTime();
    // YYYY-MM-DD
    const m2 = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m2) return new Date(+m2[1], +m2[2] - 1, +m2[3]).getTime();
    return 0;
}

// Formatta timestamp → gg/mm/aa
function _fmtData(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
}

// Colore urgenza data consegna: rosso se scaduta, giallo se ≤7gg, verde se ≤14gg, grigio altrimenti
function _urgenzaConsegna(ts) {
    if (!ts) return '';
    const now = Date.now();
    const diff = ts - now;
    const giorni = diff / 86400000;
    if (giorni < 0)   return 'color:#dc2626;font-weight:700'; // scaduta
    if (giorni <= 7)  return 'color:#ea580c;font-weight:600'; // urgente
    if (giorni <= 14) return 'color:#ca8a04;font-weight:600'; // presto
    return 'color:#64748b';
}

export function generaBloccoOrdiniUnificato(dati, isArchivio) {
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
        // CSV_REVIEW: righe da attenzionare sempre in cima
        const _hasRevA = gruppi[a].some(r => String(r.last_modified_by || '').startsWith('CSV_REVIEW'));
        const _hasRevB = gruppi[b].some(r => String(r.last_modified_by || '').startsWith('CSV_REVIEW'));
        if (_hasRevA && !_hasRevB) return -1;
        if (!_hasRevA && _hasRevB) return 1;
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
        const _hasReviewRows = righe.some(r => String(r.last_modified_by || '').startsWith('CSV_REVIEW'));
        const _reviewWrapCls = _hasReviewRows ? ' csv-review-order' : '';
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
                    righe.flatMap(r => (!isStatoFinale(r.stato) && r.assegna && r.assegna !== '' && r.assegna !== 'undefined')
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
                const _giaSonoOrd = righe.some(r => !isStatoFinale(r.stato) && r.assegna && r.assegna.split(',').some(n => n.trim().toUpperCase() === _mioN));
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
        if (!isArchivio) {
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
            _menuVoci += `<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();apriInfoOrdine('${_nOrdEsc}')"><i class="fa-solid fa-circle-info"></i> Info ordine</button>`;
            _menuVoci += `<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aChiedi}"><i class="fa-regular fa-envelope"></i> Chiedi</button>`;
            _menuVoci += `<button class="ord-menu-item ord-menu-item--danger" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aArchivia}"><i class="fa-solid fa-box-archive"></i> Archivia</button>`;
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

        // Data attributes per filtri avanzati
        const _statiGruppo = [...new Set(righe.map(r => (r.stato || 'IN ATTESA').toUpperCase()))].join(',');
        const _consegnaMin = (() => {
            let min = Infinity;
            righe.forEach(r => { const ts = _parseDataCSV(r.data_consegna); if (ts && ts < min) min = ts; });
            return min === Infinity ? '' : String(min);
        })();
        const _ordineTs = (() => {
            for (const r of righe) { const ts = _parseDataCSV(r.data_ordine); if (ts) return String(ts); }
            return '';
        })();
        const _haRimanente = righe.some(r => {
            const qT = parseFloat(r.qty) || 0;
            const qE = parseFloat(r.qty_evasa) || 0;
            return r.qty_evasa !== '' && r.qty_evasa !== undefined && qT > qE;
        }) ? '1' : '0';

        // Data consegna minima del gruppo per header
        const _consegnaHdrHtml = _consegnaMin ? (() => {
            const ts = parseInt(_consegnaMin);
            const urgStyle = _urgenzaConsegna(ts);
            const fmtC = _fmtData(ts);
            return `<span class="ord-hdr-date" style="${urgStyle}"><i class="fas fa-truck" style="font-size:.6rem;margin-right:3px;opacity:.75"></i>${fmtC}</span>`;
        })() : '';

        html += `
        <div class="ordine-wrapper ${classWrapper}${_reviewWrapCls}" data-ordine="${nOrd}" data-cliente="${(cliente || '').toLowerCase().replace(/"/g, '')}" data-riferimento="${(riferimento || '').toLowerCase().replace(/"/g, '')}" data-codici="${righe.map(a => (a.codice && a.codice !== 'false' ? a.codice : '')).join('|').toLowerCase()}" data-stati="${_statiGruppo}" data-consegna-min="${_consegnaMin}" data-ordine-ts="${_ordineTs}" data-ha-rimanente="${_haRimanente}">
            <div class="riga-ordine ${classHeader}" onclick="toggleAccordion(this)">
                <div class="flex-grow">
                    <span class="order-title" style="--order-color:${colorCliente}" title="${_esc(cliente)}">${_esc(cliente)} ${htmlRiferimento}</span>
                    ${_consegnaHdrHtml}
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

export function generaCardArticolo(art, nOrd, cliente) {
    const TW = window.TW;
    const statoAttuale = (art.stato || "IN ATTESA").toUpperCase();
    const configStato = window.listaStati.find(s => s.nome === statoAttuale) || {colore: "#e2e8f0"};
    const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";

    const _csvFlag = String(art.last_modified_by || '');
    const _isCsvReview = _csvFlag.startsWith('CSV_REVIEW');
    const _csvBlinkCls = _isCsvReview ? ` csv-review-blink${_csvFlag === 'CSV_REVIEW_MISSING' ? ' csv-review-missing' : ' csv-review-finish'}` : '';
    let _csvBanner = '';
    if (_csvFlag === 'CSV_REVIEW_MISSING') {
        _csvBanner = `<div class="csv-review-banner"><span class="csv-review-badge missing"><i class="fas fa-exclamation-triangle"></i> Assente dal CSV</span><button class="btn-csv-resolve" onclick="event.stopPropagation();csvReviewResolve('${art.id_riga}',this)"><i class="fas fa-check"></i> Risolvi</button></div>`;
    } else if (_csvFlag === 'CSV_REVIEW_FINISH') {
        _csvBanner = `<div class="csv-review-banner"><span class="csv-review-badge finish"><i class="fas fa-paint-brush"></i> Finitura rilevata</span><button class="btn-csv-resolve" onclick="event.stopPropagation();csvReviewResolve('${art.id_riga}',this)"><i class="fas fa-check"></i> Risolvi</button></div>`;
    }

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
        const _btnAutoAssign = !_assegnatiCard.some(n => n.toUpperCase() === _mioMasterNorm)
            ? `<button class="btn-assegnami btn-assegnami-inline" onclick="autoAssegnami('${art.id_riga}','${nOrd}',this)" title="Assegnami"><i class="fas fa-user-plus"></i></button>`
            : '';
        opZoneCard = `<div class="op-assign-inline"><div class="op-dropdown" data-id-riga="${art.id_riga}" data-assegna="${(art.assegna||'').replace(/"/g,'&quot;')}" data-nord="${nOrd}"><button type="button" class="op-trigger" onclick="toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${_lbl}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${_opts}</div></div>${_btnAutoAssign}</div>`;
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
    <div class="item-card ${TW.card}${_csvBlinkCls}" data-id-riga="${art.id_riga}" data-codice="${codicePrincipale.toLowerCase().replace(/"/g, '')}">
        ${_csvBanner}
        <div><span class="label-sm ${TW.label}">Codice Prodotto</span><b class="${TW.value}">${codicePrincipale}</b></div>
        ${(() => {
            const tsO = _parseDataCSV(art.data_ordine);
            const tsC = _parseDataCSV(art.data_consegna);
            if (!tsO && !tsC) return '';
            const fmtO = tsO ? _fmtData(tsO) : '\u2014';
            const fmtC = tsC ? `<span style="${_urgenzaConsegna(tsC)}">${_fmtData(tsC)}</span>` : '\u2014';
            return `<div class="card-date-row"><span class="label-sm ${TW.label}" style="margin-bottom:1px">Date</span><span class="card-date-vals"><span class="card-date-item"><i class="fas fa-file-signature" style="color:#94a3b8;font-size:.7rem;margin-right:3px"></i><span class="card-date-lbl">Ord.</span> ${fmtO}</span><span class="card-date-sep">\u00b7</span><span class="card-date-item"><i class="fas fa-truck" style="color:#94a3b8;font-size:.7rem;margin-right:3px"></i><span class="card-date-lbl">Cons.</span> ${fmtC}</span></span></div>`;
        })()}
        <div class="qty-cell">
            <span class="label-sm ${TW.label}">Quantit\u00e0</span>
            <div class="qty-row">
                <b class="${TW.value} qty-totale">${art.qty}</b>
                ${(() => {
                    const qT = parseFloat(art.qty) || 0;
                    const qE = parseFloat(art.qty_evasa);
                    const hasEvasa = !isNaN(qE) && String(art.qty_evasa || '').trim() !== '';
                    if (!hasEvasa) return '';
                    const rim = Math.max(0, qT - qE);
                    const rimColor = rim === 0 ? '#22c55e' : (rim < qT * 0.25 ? '#ea580c' : '#475569');
                    return `<span class="qty-rim-inline"><span class="qty-rim-lbl">Evasa</span><b class="qty-rimanente-val" style="color:#64748b">${qE}</b><span class="qty-rim-lbl" style="margin-left:5px">Rim.</span><b class="qty-rimanente-val" style="color:${rimColor}">${rim}</b></span>`;
                })()}
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

export function generaCardArchivio(art, nOrd) {
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
