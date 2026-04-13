// PROD — Produzione / Overview & Kanban UI
// Costruzione HTML overview, kanban drag-and-drop, archivio lazy

import { prodState, getOvStatiAll, isStatoFinale } from './produzione-state.js';
import { generaBloccoOrdiniUnificato } from './produzione-cards.js';
import { createGhost, moveGhost, removeGhost } from '../core/dnd.js';
import { notificaElegante } from '../core/ui.js';
import { cacheContenuti, cacheFetchTime } from '../core/state.js';
import { lsCacheSet as _lsCacheSet } from '../core/ls-cache.js';

// ═══════════════════════════════════════════════════════════════════
//  OVERVIEW / KANBAN
// ═══════════════════════════════════════════════════════════════════

/**
 * Ricostruisce l'intera overview a partire da prodState.attiviProd (già aggiornato ottimisticamente).
 * Usata dopo ogni cambio di stato per aggiornare il kanban con creazione/rimozione di card.
 */
export function _refreshOverview() {
    // Aggiorna sempre il contatore nel summary (visibile anche con accordion chiuso)
    const STATI_OV = getOvStatiAll();
    const numInFocus = (prodState.attiviProd || []).filter(r => STATI_OV.includes((r.stato || '').toUpperCase().trim())).length;
    const summaryMeta = document.querySelector('#ov-accordion .ov-summary-meta');
    if (summaryMeta) summaryMeta.textContent = `${numInFocus} art. in lavorazione`;

    const ovContent = document.getElementById('ov-content');
    if (!ovContent) return;
    // Su mobile il contenuto è lazy: rimuovi placeholder e costruisci subito
    if (ovContent.querySelector('.ov-lazy-placeholder')) {
        // Solo se l'accordion è aperto ricostruiamo subito; altrimenti lascia fare a _ovLoadIfNeeded
        const accordion = document.getElementById('ov-accordion');
        if (!accordion || !accordion.open) return;
        ovContent.innerHTML = _buildOverviewInnerHtml(prodState.attiviProd);
        requestAnimationFrame(_initKanbanDnd);
        return;
    }
    ovContent.innerHTML = _buildOverviewInnerHtml(prodState.attiviProd);
    requestAnimationFrame(_initKanbanDnd);
}

export function _ovLoadIfNeeded(summary) {
    const details = summary.parentElement;
    if (!details.open) {
        const contentDiv = document.getElementById('ov-content');
        if (contentDiv && contentDiv.querySelector('.ov-lazy-placeholder')) {
            contentDiv.innerHTML = _buildOverviewInnerHtml(prodState.attiviProd);
            requestAnimationFrame(_initKanbanDnd);
        }
    }
}

export function _apriArchivio(id) {
    const det = document.getElementById(id);
    if (!det) return;

    // Lazy render: alla prima apertura inserisce il contenuto archivio nel DOM
    const sezArch = det.querySelector('.sezione-archiviata');
    const archData = prodState.datiArchLazy || (prodState.ultimiDatiProduzione && prodState.ultimiDatiProduzione.archivio);
    if (sezArch && archData && (prodState.datiArchLazy || !sezArch.children.length)) {
        const htmlArch = generaBloccoOrdiniUnificato(archData, true);
        const archHtml = htmlArch || "<div class='empty-msg'>L'archivio \u00e8 vuoto.</div>"
        sezArch.innerHTML = archHtml;
        window.aggiornaListaFiltrabili?.();
        if (!cacheContenuti['ARCHIVIO_ORDINI']) {
            cacheContenuti['ARCHIVIO_ORDINI'] = archHtml;
            cacheFetchTime['ARCHIVIO_ORDINI'] = Date.now();
            _lsCacheSet('_html_ARCHIVIO_ORDINI', archHtml);
        }
        prodState.datiArchLazy = null;
    }

    det.open = true;
    requestAnimationFrame(() => {
        det.querySelector('summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

export function _buildCaricoOperatoriHtml(attivi) {
    const attiviOp = (attivi || []).filter(r => !isStatoFinale(r.stato));
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

export function _buildOverviewInnerHtml(attivi) {
    const coloriStati = {};
    (window.listaStati || []).forEach(s => { coloriStati[s.nome.toUpperCase()] = s.colore; });
    const coloreDefault = '#94a3b8';

    const cardsHtml = getOvStatiAll().map(stato => {
        const righe = attivi.filter(r => (r.stato || '').toUpperCase().trim() === stato.trim());
        const colore = coloriStati[stato] || coloreDefault;
        const isEmpty = righe.length === 0;

        const isOrdMode = prodState.ovStatiOrd.includes(stato);
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

export function _scrollToOrdineList(ordine) {
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

export function _initKanbanDnd() {
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
        if (ghost) { removeGhost(ghost); ghost = null; }
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

        const g = createGhost(item, clientX, clientY, {
            opacity: 0.92,
            scale: '1.05',
            rotate: '-1.2deg',
            borderRadius: '8px',
            shadow: '0 10px 32px rgba(0,0,0,0.55)',
            background: '#1e2d3d',
            border: '1.5px solid #475569',
            transition: 'transform 0.1s'
        });
        ghost = g.ghost;
        offX = g.offX;
        offY = g.offY;

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
        moveGhost(ghost, e.clientX, e.clientY, offX, offY);
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
            const r = prodState.attiviProd ? prodState.attiviProd.find(x => String(x.id_riga) === id) : null;
            _kanbanStatiPrec[id] = r ? r.stato : oldStato;
        });

        idRighe.forEach(id => {
            if (prodState.attiviProd) {
                const r = prodState.attiviProd.find(x => String(x.id_riga) === id);
                if (r) r.stato = newStato;
            }
        });

        elDrop.classList.add('optimistic-pending');
        elDrop.style.transition = 'opacity 0.3s';

        prodState.lastKanbanDragTs = Date.now();
        (async () => {
            let anyFailed = false;
            for (const id of idRighe) {
                // aggiornaDato is exposed via window by registerGlobals
                const ok = await window.aggiornaDato(null, id, 'stato', newStato);
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
                    if (prodState.attiviProd) {
                        const r = prodState.attiviProd.find(x => String(x.id_riga) === id);
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
                // _invalidateProduzioneCache exposed via window
                window._invalidateProduzioneCache();
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

export function _aggiornaKanbanCount(grid) {
    grid.querySelectorAll('.ov-stato-body').forEach(body => {
        const stato = body.dataset.statoDrop;
        const isOrd = prodState.ovStatiOrd.includes(stato);
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

export function _checkKanbanEmpty(grid) {
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

export function _syncStatoItemCard(idRiga, newStato, colore) {
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
