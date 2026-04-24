// PROD — Features / Kit Prodotti
// Modulo configurabile multi-kit (sostituto di pipistrelli.js)
// Dipendenze: ../core/config.js, ../core/session.js, ../core/api.js, ../core/ui.js

import { URL_GOOGLE } from '../core/config.js';
import { utenteAttuale } from '../core/session.js';
import { gasRequest } from '../core/api.js';
import { notificaElegante, applicaFade, _esc } from '../core/ui.js';

// ─── LS keys ──────────────────────────────────────────────────────────────────
const _KIT_LS_KEY  = '_mlKitData';        // { kits: [...], ts: number }
const _KIT_LS_TS   = '_mlKitDataTs';      // timestamp locale

// ─── fetch flag ───────────────────────────────────────────────────────────────
let _fetched = false;

export function resetKitFetch() { _fetched = false; }

// ─── localStorage helpers ─────────────────────────────────────────────────────
function _kitLoad() {
    try {
        const raw = localStorage.getItem(_KIT_LS_KEY);
        if (!raw) return { kits: [] };
        return JSON.parse(raw);
    } catch { return { kits: [] }; }
}

function _kitSave(kits) {
    try {
        localStorage.setItem(_KIT_LS_KEY, JSON.stringify({ kits }));
        localStorage.setItem(_KIT_LS_TS, Date.now());
    } catch {}
    _kitPushToServer(kits);
}

// ─── Sync server ──────────────────────────────────────────────────────────────
let _kitPushTimer = null;

function _kitPushToServer(kits) {
    clearTimeout(_kitPushTimer);
    _kitPushTimer = setTimeout(function () {
        gasRequest({ azione: 'setKitData', kits })
            .catch(function (e) { console.warn('[kit-prodotti] salvataggio remoto fallito:', e); });
    }, 1500);
}

function _kitFetchFromServer(cb) {
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'getKitData' }) })
        .then(r => r.json())
        .then(d => {
            if (d && Array.isArray(d.kits)) {
                const serverTs = parseInt(d.ts || 0);
                const localTs  = parseInt(localStorage.getItem(_KIT_LS_TS) || 0);
                if (serverTs > 0 && serverTs > localTs) {
                    try { localStorage.setItem(_KIT_LS_KEY, JSON.stringify({ kits: d.kits })); } catch {}
                    try { localStorage.setItem(_KIT_LS_TS, serverTs); } catch {}
                    if (cb) cb(true);
                    return;
                }
            }
            if (cb) cb(false);
        })
        .catch(() => { if (cb) cb(false); });
}

// ─── UUID helper ──────────────────────────────────────────────────────────────
function _uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Permessi ─────────────────────────────────────────────────────────────────
function _kitCanEdit() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const n = String(utenteAttuale.nome).toUpperCase().trim();
    return n === 'ALESSIO' || n === '0000' || utenteAttuale.ruolo === 'MASTER';
}

// ═════════════════════════════════════════════════════════════════════════════
// CALCOLI
// ═════════════════════════════════════════════════════════════════════════════

/** Calcola il fabbisogno totale per componente, sommando qty*coeff di ogni variante */
function _kitCalcFabbisogno(kit) {
    const fab = {};
    for (const sez of (kit.sezioni || [])) {
        for (const comp of (sez.componenti || [])) {
            let tot = 0;
            for (const [vKey, qty] of Object.entries(kit.qtaDaProdurre || {})) {
                tot += (parseInt(qty) || 0) * (parseInt(comp.qtaPerVariante?.[vKey]) || 0);
            }
            fab[comp.id] = tot;
        }
    }
    return fab;
}

/** Calcola i componenti impegnati dai sub-assembly pronti */
function _kitCalcImpegnati(kit) {
    const imp = {};
    for (const sa of (kit.sottoAssembly || [])) {
        const pronti = parseInt(kit.pronti?.[sa.id]) || 0;
        if (!pronti) continue;
        const vKey = sa.varianteKey;
        for (const sez of (kit.sezioni || [])) {
            for (const comp of (sez.componenti || [])) {
                const coeff = parseInt(comp.qtaPerVariante?.[vKey]) || 0;
                if (coeff > 0) imp[comp.id] = (imp[comp.id] || 0) + pronti * coeff;
            }
        }
    }
    return imp;
}

/** Calcola quanti sub-assembly completabili per variante */
function _kitCalcSpedizionabili(kit) {
    const result = {};
    for (const sa of (kit.sottoAssembly || [])) {
        const vKey = sa.varianteKey;
        let minU = Infinity;
        let hasComp = false;
        const imp = _kitCalcImpegnati(kit);
        for (const sez of (kit.sezioni || [])) {
            for (const comp of (sez.componenti || [])) {
                const coeff = parseInt(comp.qtaPerVariante?.[vKey]) || 0;
                if (!coeff) continue;
                hasComp = true;
                const libero = Math.max(0, (parseInt(comp.caricato) || 0) - (imp[comp.id] || 0));
                minU = Math.min(minU, Math.floor(libero / coeff));
            }
        }
        result[sa.id] = hasComp ? (minU === Infinity ? 0 : minU) : 0;
    }
    return result;
}

// ═════════════════════════════════════════════════════════════════════════════
// RENDER HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function _kitVarianteLabel(kit, vKey) {
    const v = (kit.varianti || []).find(x => x.key === vKey);
    return v ? _esc(v.nome) : _esc(vKey);
}

function _ts() {
    return new Date().toLocaleString('it-IT', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGINA PRINCIPALE: griglia kit
// ═════════════════════════════════════════════════════════════════════════════

export function caricaKitProdotti() {
    if (!_fetched) {
        _fetched = true;
        _kitFetchFromServer(function (hasDati) {
            if (hasDati) caricaKitProdotti();
        });
    }

    const { kits } = _kitLoad();
    const contenitore = document.getElementById('contenitore-dati');

    const cardsHtml = kits.map(kit => {
        const nVarianti = (kit.varianti || []).length;
        const nComp    = (kit.sezioni || []).reduce((s, z) => s + (z.componenti || []).length, 0);
        const nSA      = (kit.sottoAssembly || []).length;
        const totPronti = Object.values(kit.pronti || {}).reduce((s, v) => s + (parseInt(v) || 0), 0);
        return `
        <div class="kit-card" onclick="_kitOpenView('${_esc(kit.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${_esc(kit.nome)}</span>
                <button class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${_esc(kit.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
            </div>
            <div class="kit-card-meta">
                <span class="kit-meta-pill"><i class="fas fa-layer-group"></i> ${nVarianti} variant${nVarianti===1?'e':'i'}</span>
                <span class="kit-meta-pill"><i class="fas fa-list"></i> ${nComp} comp.</span>
                ${nSA ? `<span class="kit-meta-pill"><i class="fas fa-puzzle-piece"></i> ${nSA} sub-asm.</span>` : ''}
                ${totPronti ? `<span class="kit-meta-pill kit-meta-pill--pronti"><i class="fas fa-check"></i> ${totPronti} pronti</span>` : ''}
            </div>
        </div>`;
    }).join('');

    contenitore.innerHTML = `
    <div class="kit-page">
        <div class="kit-page-header">
            <div class="kit-page-title"><i class="fas fa-boxes-stacked"></i> Kit Prodotti</div>
            <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>
        </div>
        ${kits.length === 0
            ? `<div class="kit-empty-state">
                <i class="fas fa-box-open kit-empty-icon"></i>
                <p>Nessun kit configurato.</p>
                <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
               </div>`
            : `<div class="kit-grid">${cardsHtml}</div>`
        }
    </div>`;

    applicaFade(contenitore);
}

// ═════════════════════════════════════════════════════════════════════════════
// VISTA OPERATIVA DI UN KIT (4 tab: BOM / Pronti / Movimenti / Spedizione)
// ═════════════════════════════════════════════════════════════════════════════

let _kitViewId   = null;
let _kitViewTab  = 'bom';

function _kitOpenView(id) {
    _kitViewId  = id;
    _kitViewTab = 'bom';
    _kitRenderView();
}

function _kitRenderView() {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitViewId);
    if (!kit) { caricaKitProdotti(); return; }

    const contenitore = document.getElementById('contenitore-dati');
    const fab  = _kitCalcFabbisogno(kit);
    const imp  = _kitCalcImpegnati(kit);
    const sped = _kitCalcSpedizionabili(kit);

    const varsList = kit.varianti || [];
    const varCols  = varsList.map(v => `<th class="kit-col-coeff" title="${_esc(v.nome)}">× ${_esc(v.key)}</th>`).join('');

    // ─── Tab BOM ─────────────────────────────────────────────────────────────
    let righeHtml = '';
    for (const sez of (kit.sezioni || [])) {
        const comps = sez.componenti || [];
        if (!comps.length) continue;
        righeHtml += `<tr class="kit-bom-sez-row"><td colspan="${6 + varsList.length}" class="kit-bom-sez-cell">${_esc(sez.nome)}</td></tr>`;
        for (const comp of comps) {
            const fabI = fab[comp.id] || 0;
            const car  = parseInt(comp.caricato) || 0;
            const impI = imp[comp.id] || 0;
            const lib  = Math.max(0, car - impI);
            const ord  = Math.max(0, fabI - car);
            const ordCls = fabI === 0 ? 'kit-ord-zero' : (ord > 0 ? 'kit-ord-manca' : 'kit-ord-ok');

            const coeffCells = varsList.map(v => {
                const c = parseInt(comp.qtaPerVariante?.[v.key]) || 0;
                return c > 0
                    ? `<td class="kit-coeff kit-coeff-on">${c}</td>`
                    : `<td class="kit-coeff kit-coeff-off">—</td>`;
            }).join('');

            righeHtml += `<tr data-cid="${_esc(comp.id)}" data-sid="${_esc(sez.id)}">
                <td class="kit-mat">${_esc(comp.nome)}</td>
                ${coeffCells}
                <td class="kit-fab${fabI===0?' kit-fab-zero':''}">${fabI>0?fabI:'—'}</td>
                <td class="kit-car-cell">
                    <input class="kit-car-input" type="number" min="0" value="${car}"
                           data-cid="${_esc(comp.id)}" data-sid="${_esc(sez.id)}"
                           oninput="_kitAggiornaCar(this)" onchange="_kitAggiornaCar(this)">
                    <span class="kit-car-liberi" ${impI>0?'':'style="display:none"'}>${lib} lib.</span>
                </td>
                <td class="${ordCls}">${fabI===0?'—':ord}</td>
            </tr>`;
        }
    }

    const matOptions = [];
    for (const sez of (kit.sezioni || [])) {
        for (const comp of (sez.componenti || [])) {
            matOptions.push(`<option value="${_esc(comp.id)}" data-sid="${_esc(sez.id)}">[${_esc(sez.nome)}] ${_esc(comp.nome)}</option>`);
        }
    }

    // ─── Tab QTÀ ─────────────────────────────────────────────────────────────
    const qtyInputs = varsList.map(v => {
        const q = parseInt(kit.qtaDaProdurre?.[v.key]) || 0;
        return `<div class="kit-qty-item">
            <label>${_esc(v.nome)}</label>
            <input class="kit-qty-input" id="kit-qty-${_esc(v.key)}" type="number" min="0" value="${q}"
                   data-vkey="${_esc(v.key)}"
                   oninput="_kitAggiornaQty('${_esc(kit.id)}')" onchange="_kitAggiornaQty('${_esc(kit.id)}')">
        </div>`;
    }).join('');
    const totProd = Object.values(kit.qtaDaProdurre || {}).reduce((s, v) => s + (parseInt(v)||0), 0);

    // ─── Tab SPEDIZIONE ───────────────────────────────────────────────────────
    const saRows = (kit.sottoAssembly || []).map(sa => {
        const pronti  = parseInt(kit.pronti?.[sa.id]) || 0;
        const maxSped = sped[sa.id] || 0;
        const vLabel  = _kitVarianteLabel(kit, sa.varianteKey);
        return `<div class="kit-sped-sa-row">
            <div class="kit-sped-sa-label"><i class="fas fa-puzzle-piece"></i> ${_esc(sa.nome)} <span class="kit-sped-var-pill">${vLabel}</span></div>
            <div class="kit-sped-sa-stats">
                <span class="kit-sped-pronti-cnt">${pronti} pronti</span>
                <span class="kit-sped-max ${maxSped>0?'kit-sped-max--ok':'kit-sped-max--zero'}">${maxSped} assemb.</span>
            </div>
            <div class="kit-pronti-ctrl">
                <button class="kit-pronti-btn" onclick="_kitAggiornaPronti('${_esc(kit.id)}','${_esc(sa.id)}',-1)">−</button>
                <input class="kit-pronti-input${pronti>0?' kit-pronti-val-on':''}" type="number" min="0"
                       value="${pronti}" data-said="${_esc(sa.id)}"
                       oninput="_kitSetPronti('${_esc(kit.id)}','${_esc(sa.id)}',this.value)"
                       onchange="_kitSetPronti('${_esc(kit.id)}','${_esc(sa.id)}',this.value)">
                <button class="kit-pronti-btn" onclick="_kitAggiornaPronti('${_esc(kit.id)}','${_esc(sa.id)}',1)">+</button>
            </div>
        </div>`;
    }).join('');

    const hasPronti = (kit.sottoAssembly || []).some(sa => (parseInt(kit.pronti?.[sa.id]) || 0) > 0);

    // ─── Tab MOVIMENTI ────────────────────────────────────────────────────────
    const canEdit = _kitCanEdit();
    const movHtml = _kitRenderMovimentiHtml(kit, canEdit);

    contenitore.innerHTML = `
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${_esc(kit.nome)}</span>
            <button class="kit-gear-btn-inline" onclick="_kitOpenConfig('${_esc(kit.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <!-- Tabs -->
        <div class="kit-tabs">
            <button class="kit-tab ${_kitViewTab==='bom'?'kit-tab--active':''}" onclick="_kitSwitchTab('bom')"><i class="fas fa-list"></i> BOM</button>
            <button class="kit-tab ${_kitViewTab==='qty'?'kit-tab--active':''}" onclick="_kitSwitchTab('qty')"><i class="fas fa-hashtag"></i> Quantità</button>
            <button class="kit-tab ${_kitViewTab==='sped'?'kit-tab--active':''}" onclick="_kitSwitchTab('sped')">
                <i class="fas fa-truck"></i> Pronti
                ${hasPronti?'<span class="kit-tab-badge"></span>':''}
            </button>
            <button class="kit-tab ${_kitViewTab==='mov'?'kit-tab--active':''}" onclick="_kitSwitchTab('mov')"><i class="fas fa-boxes-stacked"></i> Mag.</button>
        </div>

        <!-- TAB BOM -->
        <div class="kit-tab-panel ${_kitViewTab==='bom'?'kit-tab-panel--active':''}">
            <div class="kit-table-wrap">
                <table class="kit-table">
                    <thead>
                        <tr>
                            <th>COMPONENTE</th>
                            ${varCols}
                            <th>FABBISOGNO</th>
                            <th>CARICATO</th>
                            <th>DA ORDINARE</th>
                        </tr>
                    </thead>
                    <tbody id="kit-tbody-${_esc(kit.id)}">${righeHtml}</tbody>
                </table>
            </div>
            <div class="kit-legend">
                <span class="kit-leg-item kit-ord-manca" style="padding:2px 7px;border-radius:5px">● mancante</span>
                <span class="kit-leg-item kit-ord-ok" style="padding:2px 7px;border-radius:5px">● disponibile</span>
                <span class="kit-leg-item" style="color:#9ca3af">— = non necessario</span>
            </div>
        </div>

        <!-- TAB QUANTITÀ -->
        <div class="kit-tab-panel ${_kitViewTab==='qty'?'kit-tab-panel--active':''}">
            <div class="kit-qty-card">
                <div class="kit-qty-label">QTÀ DA PRODURRE</div>
                <div class="kit-qty-inputs">${qtyInputs}
                    <div class="kit-qty-total-box">
                        <div class="kit-qty-total-label">TOTALE</div>
                        <div class="kit-qty-total-val" id="kit-tot-${_esc(kit.id)}">${totProd}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB PRONTI / SPEDIZIONE -->
        <div class="kit-tab-panel ${_kitViewTab==='sped'?'kit-tab-panel--active':''}">
            ${(kit.sottoAssembly||[]).length === 0
                ? `<div class="kit-empty-state" style="padding:40px 20px">
                    <i class="fas fa-puzzle-piece" style="font-size:2rem;color:#cbd5e1;margin-bottom:12px"></i>
                    <p>Nessun sub-assembly configurato.</p>
                    <button class="kit-btn-secondary" onclick="_kitOpenConfig('${_esc(kit.id)}')">Configura sub-assembly</button>
                   </div>`
                : `<div class="kit-sped-section">
                    <div class="kit-sped-title"><i class="fas fa-truck"></i> PRONTI DA SPEDIRE</div>
                    <div class="kit-sped-sa-list">${saRows}</div>
                    <div class="kit-sped-footer">
                        <input type="text" id="kit-sped-nota-${_esc(kit.id)}" class="kit-sped-nota-input"
                               placeholder="Note spedizione…" maxlength="80">
                        <button class="kit-spedisci-btn" onclick="_kitApriModalSped('${_esc(kit.id)}')">
                            <i class="fas fa-truck"></i> Registra Spedizione
                        </button>
                    </div>
                   </div>`
            }
        </div>

        <!-- TAB MOVIMENTI -->
        <div class="kit-tab-panel ${_kitViewTab==='mov'?'kit-tab-panel--active':''}">
            <div class="kit-mov-form">
                <div class="kit-mov-form-field" style="grid-column:1/3">
                    <label class="kit-mov-form-label">Componente</label>
                    <select id="kit-mov-mat-${_esc(kit.id)}">${matOptions.join('')}</select>
                </div>
                <div class="kit-mov-form-field">
                    <label class="kit-mov-form-label">Quantità</label>
                    <input type="number" id="kit-mov-qty-${_esc(kit.id)}" min="1" value="1">
                </div>
                <div class="kit-mov-form-field">
                    <label class="kit-mov-form-label">Note (opz.)</label>
                    <input type="text" id="kit-mov-nota-${_esc(kit.id)}" placeholder="es. DDT 123…" maxlength="60">
                </div>
                <button class="kit-mov-btn-carico" onclick="_kitSalvaMovimento('${_esc(kit.id)}','carico')">
                    <i class="fas fa-arrow-down"></i> Carico
                </button>
                <button class="kit-mov-btn-scarico" onclick="_kitSalvaMovimento('${_esc(kit.id)}','scarico')">
                    <i class="fas fa-arrow-up"></i> Scarico
                </button>
            </div>
            <div id="kit-mov-list-${_esc(kit.id)}" class="kit-mov-list">${movHtml}</div>
        </div>

        <!-- Pulsanti azione globale -->
        <div class="kit-actions-bar">
            <button class="kit-reso-btn" onclick="_kitApriModalReso('${_esc(kit.id)}')">
                <i class="fas fa-rotate-left"></i> Reso
            </button>
            <button class="kit-save-btn" id="kit-save-btn" onclick="_kitSalvaManuale('${_esc(kit.id)}')">
                <i class="fas fa-cloud-arrow-up"></i> <span id="kit-save-label">Salva</span>
            </button>
        </div>
    </div>`;

    applicaFade(contenitore);
}

function _kitBack() {
    _kitViewId  = null;
    caricaKitProdotti();
}

function _kitSwitchTab(tab) {
    _kitViewTab = tab;
    _kitRenderView();
}

// ─── Aggiorna quantità da produrre ───────────────────────────────────────────
function _kitAggiornaQty(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    if (!kit.qtaDaProdurre) kit.qtaDaProdurre = {};
    for (const v of (kit.varianti || [])) {
        const inp = document.getElementById('kit-qty-' + v.key);
        if (inp) kit.qtaDaProdurre[v.key] = Math.max(0, parseInt(inp.value) || 0);
    }
    const tot = Object.values(kit.qtaDaProdurre).reduce((s, v) => s + v, 0);
    const totEl = document.getElementById('kit-tot-' + kitId);
    if (totEl) totEl.textContent = tot;
    _kitSave(kits);
    _kitRefreshBomTotals(kit);
}

function _kitRefreshBomTotals(kit) {
    const fab = _kitCalcFabbisogno(kit);
    const varsList = kit.varianti || [];
    const tbody = document.getElementById('kit-tbody-' + kit.id);
    if (!tbody) return;
    for (const tr of tbody.querySelectorAll('tr[data-cid]')) {
        const cid  = tr.dataset.cid;
        const sid  = tr.dataset.sid;
        const sez  = (kit.sezioni||[]).find(s => s.id === sid);
        const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
        if (!comp) continue;
        const fabI = fab[cid] || 0;
        const car  = parseInt(comp.caricato) || 0;
        const ord  = Math.max(0, fabI - car);

        const fabTd = tr.querySelector('.kit-fab, .kit-fab-zero');
        if (fabTd) { fabTd.textContent = fabI > 0 ? fabI : '—'; fabTd.className = fabI===0?'kit-fab kit-fab-zero':'kit-fab'; }
        const ordTd = tr.querySelector('.kit-ord-zero,.kit-ord-manca,.kit-ord-ok');
        if (ordTd) { ordTd.textContent = fabI===0?'—':ord; ordTd.className = fabI===0?'kit-ord-zero':(ord>0?'kit-ord-manca':'kit-ord-ok'); }
    }
}

// ─── Aggiorna caricato ────────────────────────────────────────────────────────
function _kitAggiornaCar(input) {
    const cid = input.dataset.cid;
    const sid = input.dataset.sid;
    const car = Math.max(0, parseInt(input.value) || 0);
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitViewId);
    if (!kit) return;
    const sez  = (kit.sezioni||[]).find(s => s.id === sid);
    const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
    if (!comp) return;
    comp.caricato = car;
    _kitSave(kits);

    const fab = _kitCalcFabbisogno(kit);
    const fabI = fab[cid] || 0;
    const ord  = Math.max(0, fabI - car);
    const imp  = _kitCalcImpegnati(kit);
    const impI = imp[cid] || 0;

    const tr   = input.closest('tr');
    if (!tr) return;
    const ordTd = tr.querySelector('.kit-ord-zero,.kit-ord-manca,.kit-ord-ok');
    if (ordTd) { ordTd.textContent = fabI===0?'—':ord; ordTd.className = fabI===0?'kit-ord-zero':(ord>0?'kit-ord-manca':'kit-ord-ok'); }
    const span = tr.querySelector('.kit-car-liberi');
    if (span) {
        if (impI>0) { span.textContent = Math.max(0,car-impI)+' lib.'; span.style.display=''; }
        else span.style.display='none';
    }
}

// ─── Pronti ───────────────────────────────────────────────────────────────────
function _kitAggiornaPronti(kitId, saId, delta) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    if (!kit.pronti) kit.pronti = {};
    kit.pronti[saId] = Math.max(0, (parseInt(kit.pronti[saId]) || 0) + delta);
    _kitSave(kits);
    if (_kitViewId === kitId) _kitRenderView();
}

function _kitSetPronti(kitId, saId, val) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    if (!kit.pronti) kit.pronti = {};
    kit.pronti[saId] = Math.max(0, parseInt(val) || 0);
    _kitSave(kits);
    const inp = document.querySelector(`.kit-pronti-input[data-said="${saId}"]`);
    if (inp) { inp.value = kit.pronti[saId]; inp.classList.toggle('kit-pronti-val-on', kit.pronti[saId] > 0); }
}

// ─── Movimenti ────────────────────────────────────────────────────────────────
function _kitRenderMovimentiHtml(kit, canEdit) {
    const movimenti = kit.movimenti || [];
    if (!movimenti.length) return '<div class="kit-mov-empty">Nessun movimento registrato.</div>';
    return movimenti.map(m => {
        const delBtn = canEdit
            ? `<button class="kit-mov-del" onclick="_kitEliminaMovimento('${_esc(kit.id)}',${m.id})" title="Elimina">✕</button>`
            : '<span style="width:22px;flex-shrink:0"></span>';
        const editBtn = (canEdit && (m.tipo==='carico'||m.tipo==='scarico'))
            ? `<button class="kit-mov-edit" onclick="_kitModificaMovimento('${_esc(kit.id)}',${m.id})" title="Modifica">✎</button>`
            : '<span style="width:22px;flex-shrink:0"></span>';

        if (m.tipo === 'spedizione') {
            const totPz = (m.righe||[]).reduce((s,r)=>s+r.qty,0);
            const righeHtml = (m.righe||[]).map(r=>
                `<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${_esc(r.mat)}</span><span class="kit-mov-qty scarico">−${r.qty}</span></div>`
            ).join('');
            const itemsHtml = (m.items||[]).map(it=>
                `<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${_esc(it.nome)}</span><span class="kit-mov-qty scarico">×${it.qty}</span></div>`
            ).join('');
            return `<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">🚚 Spediz. ×${totPz} pz</span>
                ${m.nota?`<span class="kit-mov-nota">${_esc(m.nota)}</span>`:''}
                <span class="kit-mov-ts">${m.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${delBtn}
              </summary>
              <div class="kit-assemb-sub-list">${itemsHtml}<div class="kit-sped-bom-divider">componenti scaricati</div>${righeHtml}</div>
            </details>`;
        }

        if (m.tipo === 'reso') {
            const totPz = m.totPz || 0;
            const itemsHtml = (m.items||[]).map(it=>
                `<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${_esc(it.nome)}</span><span class="kit-mov-qty carico">×${it.qty}</span></div>`
            ).join('');
            const recHtml = (m.righe||[]).map(r=>
                `<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">✓ ${_esc(r.mat)}</span><span class="kit-mov-qty carico">+${r.qty}</span></div>`
            ).join('');
            const scartHtml = (m.scartate||[]).map(r=>
                `<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${_esc(r.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">✕ ${r.qty}</span></div>`
            ).join('');
            return `<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">📦 Rientro ×${totPz} pz</span>
                ${m.nota?`<span class="kit-mov-nota">${_esc(m.nota)}</span>`:''}
                <span class="kit-mov-ts">${m.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${delBtn}
              </summary>
              <div class="kit-assemb-sub-list">
                ${itemsHtml}
                ${recHtml?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${recHtml}`:''}
                ${scartHtml?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${scartHtml}`:''}
              </div>
            </details>`;
        }

        return `<div class="kit-mov-item ${_esc(m.tipo)}">
            <span class="kit-mov-badge ${_esc(m.tipo)}">${m.tipo==='carico'?'CARICO':'SCARICO'}</span>
            <span class="kit-mov-mat">${_esc(m.mat)}</span>
            <span class="kit-mov-qty ${_esc(m.tipo)}">${m.tipo==='carico'?'+':'−'}${m.qty}</span>
            ${m.nota?`<span class="kit-mov-nota">${_esc(m.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${m.ts}</span>
            ${editBtn}${delBtn}
        </div>`;
    }).join('');
}

function _kitSalvaMovimento(kitId, tipo) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const matSel  = document.getElementById('kit-mov-mat-' + kitId);
    const qtyEl   = document.getElementById('kit-mov-qty-' + kitId);
    const notaEl  = document.getElementById('kit-mov-nota-' + kitId);
    if (!matSel || !qtyEl) return;

    const cid  = matSel.value;
    const sid  = matSel.options[matSel.selectedIndex]?.dataset.sid;
    const qty  = Math.max(1, parseInt(qtyEl.value) || 1);
    const nota = (notaEl?.value || '').trim();

    const sez  = (kit.sezioni||[]).find(s => s.id === sid);
    const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
    if (!comp) return;

    if (tipo === 'carico') comp.caricato = (parseInt(comp.caricato)||0) + qty;
    else comp.caricato = Math.max(0, (parseInt(comp.caricato)||0) - qty);

    if (!kit.movimenti) kit.movimenti = [];
    kit.movimenti.unshift({
        id: Date.now(), cid, sid, tipo, qty, nota,
        mat: comp.nome,
        ts: _ts()
    });

    _kitSave(kits);
    if (qtyEl) qtyEl.value = 1;
    if (notaEl) notaEl.value = '';

    const listEl = document.getElementById('kit-mov-list-' + kitId);
    if (listEl) listEl.innerHTML = _kitRenderMovimentiHtml(kit, _kitCanEdit());

    // aggiorna riga BOM se visibile
    const inp = document.querySelector(`#kit-tbody-${kitId} input[data-cid="${cid}"]`);
    if (inp) { inp.value = comp.caricato; _kitAggiornaCar(inp); }
}

function _kitEliminaMovimento(kitId, id) {
    if (!_kitCanEdit()) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const mov = (kit.movimenti||[]).find(m => m.id === id);
    if (!mov) return;
    _kitApriModalDelMov(kitId, id, mov);
}

function _kitApriModalDelMov(kitId, id, mov) {
    const modal = document.getElementById('modal-kit-del-mov');
    if (!modal) return;
    const descEl = document.getElementById('kit-del-mov-desc');
    let descHtml;
    if (mov.tipo === 'spedizione') {
        const totPz = (mov.righe||[]).reduce((s,r)=>s+r.qty,0);
        descHtml = `<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione ×${totPz} pz</strong>`;
    } else if (mov.tipo === 'reso') {
        descHtml = `<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro ×${mov.totPz||0} pz</strong>`;
    } else {
        const tipo = mov.tipo==='carico'?'CARICO':'SCARICO';
        descHtml = `<span class="kit-mov-badge ${_esc(mov.tipo)}" style="font-size:.75rem">${tipo}</span> <strong>${_esc(mov.mat)}</strong> ${mov.tipo==='carico'?'+':'−'}${mov.qty} pz`;
    }
    if (descEl) descEl.innerHTML = descHtml;
    const btn = document.getElementById('btn-kit-del-ok');
    if (btn) btn.onclick = () => _kitConfermaEliminaMov(kitId, id);
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _kitChiudiModalDelMov() {
    const modal = document.getElementById('modal-kit-del-mov');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display='none'; }, 300);
}

function _kitConfermaEliminaMov(kitId, id) {
    _kitChiudiModalDelMov();
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const mov = (kit.movimenti||[]).find(m => m.id === id);
    if (!mov) return;

    if (mov.tipo === 'spedizione') {
        // ripristina caricato e pronti
        const sez  = (kit.sezioni||[]).find(s => s.id === mov.sid);
        for (const r of (mov.righe||[])) {
            for (const sz of (kit.sezioni||[])) {
                const c = (sz.componenti||[]).find(x=>x.id===r.cid||x.nome===r.mat);
                if (c) c.caricato = (parseInt(c.caricato)||0) + r.qty;
            }
        }
        // ripristina pronti sa
        for (const it of (mov.items||[])) {
            if (it.saId && kit.pronti) kit.pronti[it.saId] = (parseInt(kit.pronti[it.saId])||0) + it.qty;
        }
    } else if (mov.tipo === 'reso') {
        for (const r of (mov.righe||[])) {
            for (const sz of (kit.sezioni||[])) {
                const c = (sz.componenti||[]).find(x=>x.id===r.cid||x.nome===r.mat);
                if (c) c.caricato = Math.max(0,(parseInt(c.caricato)||0) - r.qty);
            }
        }
    } else if (mov.tipo === 'carico') {
        for (const sz of (kit.sezioni||[])) {
            const c = (sz.componenti||[]).find(x=>x.id===mov.cid);
            if (c) c.caricato = Math.max(0,(parseInt(c.caricato)||0) - mov.qty);
        }
    } else if (mov.tipo === 'scarico') {
        for (const sz of (kit.sezioni||[])) {
            const c = (sz.componenti||[]).find(x=>x.id===mov.cid);
            if (c) c.caricato = (parseInt(c.caricato)||0) + mov.qty;
        }
    }

    kit.movimenti = (kit.movimenti||[]).filter(m => m.id !== id);
    _kitSave(kits);
    if (_kitViewId === kitId) _kitRenderView();
    notificaElegante('Movimento eliminato ✓');
}

function _kitModificaMovimento(kitId, id) {
    if (!_kitCanEdit()) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const mov = (kit.movimenti||[]).find(m => m.id === id);
    if (!mov) return;
    const modal  = document.getElementById('modal-kit-edit-mov');
    if (!modal) return;
    const matEl  = document.getElementById('kit-edit-mov-mat');
    const qtyEl  = document.getElementById('kit-edit-mov-qty');
    const notaEl = document.getElementById('kit-edit-mov-nota');
    if (matEl)  matEl.innerHTML  = `<span class="kit-mov-badge ${_esc(mov.tipo)}" style="font-size:.75rem">${mov.tipo==='carico'?'CARICO':'SCARICO'}</span> <strong>${_esc(mov.mat)}</strong>`;
    if (qtyEl)  qtyEl.value  = mov.qty;
    if (notaEl) notaEl.value = mov.nota||'';
    modal.dataset.kitId = kitId;
    modal.dataset.movId = id;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    setTimeout(() => notaEl && notaEl.focus(), 80);
}

function _kitChiudiModalEditMov() {
    const modal = document.getElementById('modal-kit-edit-mov');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display='none'; }, 300);
}

function _kitConfermaModificaMov() {
    const modal = document.getElementById('modal-kit-edit-mov');
    if (!modal) return;
    const kitId = modal.dataset.kitId;
    const id    = Number(modal.dataset.movId);
    _kitChiudiModalEditMov();

    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const idx = (kit.movimenti||[]).findIndex(m => m.id === id);
    if (idx === -1) return;
    const mov = kit.movimenti[idx];

    const newQty  = parseInt(document.getElementById('kit-edit-mov-qty')?.value);
    const newNota = (document.getElementById('kit-edit-mov-nota')?.value||'').trim();
    if (isNaN(newQty)||newQty<=0) { notificaElegante('Quantità non valida ⚠️'); return; }

    if (newQty !== mov.qty) {
        const diff = newQty - mov.qty;
        for (const sz of (kit.sezioni||[])) {
            const c = (sz.componenti||[]).find(x=>x.id===mov.cid);
            if (c) {
                if (mov.tipo==='carico')  c.caricato = Math.max(0,(parseInt(c.caricato)||0)+diff);
                else                      c.caricato = Math.max(0,(parseInt(c.caricato)||0)-diff);
                break;
            }
        }
    }
    kit.movimenti[idx] = { ...mov, qty: newQty, nota: newNota };
    _kitSave(kits);
    if (_kitViewId === kitId) _kitRenderView();
    notificaElegante('Movimento aggiornato ✓');
}

// ─── Modal spedizione ─────────────────────────────────────────────────────────
function _kitApriModalSped(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const hasPronti = (kit.sottoAssembly||[]).some(sa => (parseInt(kit.pronti?.[sa.id])||0) > 0);
    if (!hasPronti) { notificaElegante('Nessun sub-assembly pronto — imposta le quantità prima ⚠️'); return; }

    const modal = document.getElementById('modal-kit-sped');
    if (!modal) return;

    const listEl = document.getElementById('kit-sped-items-list');
    if (listEl) {
        listEl.innerHTML = (kit.sottoAssembly||[])
            .filter(sa => (parseInt(kit.pronti?.[sa.id])||0) > 0)
            .map(sa => {
                const qty = parseInt(kit.pronti?.[sa.id])||0;
                const vLabel = _kitVarianteLabel(kit, sa.varianteKey);
                return `<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${_esc(sa.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${_esc(sa.nome)} <span class="kit-sped-var-pill">${vLabel}</span></span>
                        <span class="kit-sped-item-qty">×${qty}</span>
                    </span>
                </label>`;
            }).join('');
    }

    const notaEl = document.getElementById('kit-sped-nota-' + kitId);
    const notaModalEl = document.getElementById('kit-sped-modal-nota');
    if (notaModalEl && notaEl) notaModalEl.value = notaEl.value || '';
    if (notaModalEl && !notaEl) notaModalEl.value = '';

    modal.dataset.kitId = kitId;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _kitChiudiModalSped() {
    const modal = document.getElementById('modal-kit-sped');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display='none'; }, 300);
}

function _kitConfermaSpedizione() {
    const modal = document.getElementById('modal-kit-sped');
    if (!modal) return;
    const kitId = modal.dataset.kitId;
    _kitChiudiModalSped();

    const checked = [...document.querySelectorAll('.kit-sped-chk:checked')].map(c => c.dataset.said);
    if (!checked.length) return;

    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const nota = (document.getElementById('kit-sped-modal-nota')?.value||'').trim();
    const items = [];
    const righe = [];

    for (const saId of checked) {
        const sa  = (kit.sottoAssembly||[]).find(s => s.id === saId);
        if (!sa) continue;
        const qty = parseInt(kit.pronti?.[saId])||0;
        if (!qty) continue;
        items.push({ saId, nome: sa.nome, qty });

        for (const sez of (kit.sezioni||[])) {
            for (const comp of (sez.componenti||[])) {
                const coeff = parseInt(comp.qtaPerVariante?.[sa.varianteKey])||0;
                if (!coeff) continue;
                const qtyTot = qty * coeff;
                comp.caricato = Math.max(0,(parseInt(comp.caricato)||0)-qtyTot);
                const ex = righe.find(r=>r.cid===comp.id);
                if (ex) ex.qty += qtyTot;
                else righe.push({ cid: comp.id, mat: comp.nome, qty: qtyTot });
            }
        }
        if (!kit.pronti) kit.pronti = {};
        delete kit.pronti[saId];
    }

    if (!kit.movimenti) kit.movimenti = [];
    kit.movimenti.unshift({ id: Date.now(), tipo: 'spedizione', items, righe, nota, ts: _ts() });
    _kitSave(kits);

    const totPz = items.reduce((s,i)=>s+i.qty,0);
    notificaElegante(`Spedizione registrata: ${totPz} pz ✓`);
    if (_kitViewId === kitId) _kitRenderView();
}

// ─── Modal reso ───────────────────────────────────────────────────────────────
function _kitApriModalReso(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const modal = document.getElementById('modal-kit-reso');
    if (!modal) return;

    const listEl = document.getElementById('kit-reso-items-list');
    if (listEl) {
        const saList = kit.sottoAssembly || [];
        listEl.innerHTML = saList.length === 0
            ? '<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>'
            : saList.map(sa => {
                const vLabel = _kitVarianteLabel(kit, sa.varianteKey);
                return `<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${_esc(sa.nome)} <span class="kit-sped-var-pill">${vLabel}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${_esc(sa.id)}',-1)">−</button>
                        <input type="number" id="kit-reso-qty-${_esc(sa.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${_esc(kitId)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${_esc(sa.id)}',1)">+</button>
                    </div>
                </div>`;
            }).join('');
    }

    const notaEl = document.getElementById('kit-reso-nota');
    if (notaEl) notaEl.value = '';

    _kitResoAggiornaBOM(kitId);
    modal.dataset.kitId = kitId;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _kitChiudiModalReso() {
    const modal = document.getElementById('modal-kit-reso');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display='none'; }, 300);
}

function _kitResoQtyChange(saId, delta) {
    const inp = document.getElementById('kit-reso-qty-' + saId);
    if (!inp) return;
    inp.value = Math.max(0, (parseInt(inp.value)||0) + delta);
    const modal = document.getElementById('modal-kit-reso');
    if (modal?.dataset.kitId) _kitResoAggiornaBOM(modal.dataset.kitId);
}

function _kitResoAggiornaBOM(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const totComp = {};
    for (const sa of (kit.sottoAssembly||[])) {
        const inp = document.getElementById('kit-reso-qty-' + sa.id);
        const n = parseInt(inp?.value)||0;
        if (!n) continue;
        for (const sez of (kit.sezioni||[])) {
            for (const comp of (sez.componenti||[])) {
                const coeff = parseInt(comp.qtaPerVariante?.[sa.varianteKey])||0;
                if (!coeff) continue;
                totComp[comp.id] = { mat: comp.nome, qty: (totComp[comp.id]?.qty||0) + n*coeff };
            }
        }
    }
    const listEl = document.getElementById('kit-reso-bom-list');
    if (!listEl) return;
    const entries = Object.entries(totComp).filter(([,v])=>v.qty>0);
    if (!entries.length) {
        listEl.innerHTML = '<div class="kit-reso-bom-empty">Inserisci le quantità sopra per vedere i componenti da recuperare.</div>';
        return;
    }
    listEl.innerHTML = entries.map(([cid,{mat,qty}])=>
        `<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${_esc(cid)}" data-qty="${qty}" checked>
            <span class="kit-reso-bom-mat">${_esc(mat)}</span>
            <span class="kit-reso-bom-qty">+${qty}</span>
        </label>`
    ).join('');
}

function _kitConfermaReso() {
    const modal = document.getElementById('modal-kit-reso');
    if (!modal) return;
    const kitId = modal.dataset.kitId;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const items = [];
    for (const sa of (kit.sottoAssembly||[])) {
        const n = parseInt(document.getElementById('kit-reso-qty-' + sa.id)?.value)||0;
        if (n > 0) items.push({ saId: sa.id, nome: sa.nome, qty: n });
    }
    if (!items.length) { notificaElegante('Inserisci almeno un articolo rientrato ⚠️'); return; }

    const righe    = [];
    const scartate = [];
    document.querySelectorAll('.kit-reso-bom-chk').forEach(chk => {
        const cid = chk.dataset.cid;
        const qty = parseInt(chk.dataset.qty);
        const mat = [...(kit.sezioni||[])].flatMap(s=>s.componenti||[]).find(c=>c.id===cid)?.nome || '?';
        if (chk.checked) righe.push({ cid, mat, qty });
        else scartate.push({ cid, mat, qty });
    });

    for (const r of righe) {
        for (const sez of (kit.sezioni||[])) {
            const c = (sez.componenti||[]).find(x=>x.id===r.cid);
            if (c) { c.caricato = (parseInt(c.caricato)||0)+r.qty; break; }
        }
    }

    const nota   = (document.getElementById('kit-reso-nota')?.value||'').trim();
    const totPz  = items.reduce((s,i)=>s+i.qty,0);
    if (!kit.movimenti) kit.movimenti = [];
    kit.movimenti.unshift({ id: Date.now(), tipo: 'reso', items, righe, scartate, nota, ts: _ts(), totPz });
    _kitSave(kits);

    _kitChiudiModalReso();
    notificaElegante(`Reso registrato: ${totPz} pz — ${righe.length} comp. recuperati ✓`);
    if (_kitViewId === kitId) _kitRenderView();
}

// ─── Salva manuale ────────────────────────────────────────────────────────────
function _kitSalvaManuale(kitId) {
    const btn   = document.getElementById('kit-save-btn');
    const label = document.getElementById('kit-save-label');
    if (!btn || !label) return;
    btn.disabled = true;
    btn.classList.add('kit-save-loading');
    label.textContent = 'Salvataggio…';
    const { kits } = _kitLoad();
    gasRequest({ azione: 'setKitData', kits })
        .then(() => {
            try { localStorage.setItem(_KIT_LS_TS, Date.now()); } catch {}
            btn.classList.remove('kit-save-loading');
            btn.classList.add('kit-save-ok');
            label.textContent = 'Salvato ✓';
            setTimeout(() => { btn.classList.remove('kit-save-ok'); label.textContent='Salva'; btn.disabled=false; }, 2500);
        })
        .catch(() => {
            btn.classList.remove('kit-save-loading');
            btn.classList.add('kit-save-err');
            label.textContent = 'Errore ✗';
            setTimeout(() => { btn.classList.remove('kit-save-err'); label.textContent='Salva'; btn.disabled=false; }, 3000);
        });
}

// ═════════════════════════════════════════════════════════════════════════════
// CONFIGURATORE
// ═════════════════════════════════════════════════════════════════════════════

let _kitConfigId  = null;
let _kitConfigTab = 'info';

function _kitNuovoKit() {
    const { kits } = _kitLoad();
    const kit = {
        id: _uid(),
        nome: 'Nuovo Kit',
        varianti: [],
        sezioni: [],
        sottoAssembly: [],
        qtaDaProdurre: {},
        pronti: {},
        movimenti: []
    };
    kits.push(kit);
    _kitSave(kits);
    _kitOpenConfig(kit.id);
}

function _kitOpenConfig(id) {
    _kitConfigId  = id;
    _kitConfigTab = 'info';
    _kitRenderConfig();
}

function _kitRenderConfig() {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitConfigId);
    if (!kit) { caricaKitProdotti(); return; }

    const contenitore = document.getElementById('contenitore-dati');

    // migra eventuale vecchia chiave tab
    if (_kitConfigTab === 'sezioni') _kitConfigTab = 'bom';

    const tabs = ['info', 'varianti', 'bom', 'sa'];
    const tabLabels = { info: 'Info', varianti: 'Varianti', bom: 'Materiali BOM', sa: 'Sub-Assembly' };

    // ─── Tab Info ───
    const nV  = (kit.varianti||[]).length;
    const nC  = (kit.sezioni||[]).reduce((a,s) => a + (s.componenti||[]).length, 0);
    const nSA = (kit.sottoAssembly||[]).length;
    const recapHtml = nV ? `
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div><strong>${nV}</strong> variante/i:
                    ${(kit.varianti||[]).map(v => `<span class="kit-cfg-sa-var-badge">${_esc(v.nome)}</span>`).join(' ')}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${nC}</strong> componenti BOM in <strong>${(kit.sezioni||[]).length}</strong> sezioni</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-hammer"></i>
                <div><strong>${nSA}</strong> sub-assembly (parti da tracciare come pronti)</div>
            </div>
        </div>` : `<div class="kit-cfg-help">💡 Inizia dalla tab <strong>Varianti</strong> per definire le versioni del prodotto (es. 500mA, 600mA, 700mA).</div>`;

    const infoHtml = `
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${_esc(kit.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${_esc(kit.id)}',this.value)">
        </div>
        ${recapHtml}
        <div class="kit-cfg-danger">
            <button class="kit-btn-danger" onclick="_kitElimina('${_esc(kit.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`;

    // ─── Tab Varianti ───
    const varHtml = (kit.varianti||[]).map((v,i) => `
        <div class="kit-cfg-row" data-vi="${i}">
            <div class="kit-cfg-var-field">
                <label class="kit-cfg-label" style="margin:0">Chiave breve</label>
                <input class="kit-cfg-input kit-cfg-input-small" value="${_esc(v.key)}" maxlength="8" placeholder="es. 500"
                       onchange="_kitCfgUpdateVar('${_esc(kit.id)}',${i},'key',this.value)">
            </div>
            <div class="kit-cfg-var-field" style="flex:1">
                <label class="kit-cfg-label" style="margin:0">Nome variante</label>
                <input class="kit-cfg-input" value="${_esc(v.nome)}" maxlength="40" placeholder="es. 500mA"
                       onchange="_kitCfgUpdateVar('${_esc(kit.id)}',${i},'nome',this.value)">
            </div>
            <button class="kit-cfg-del-btn" style="align-self:flex-end;margin-bottom:1px" onclick="_kitCfgDelVar('${_esc(kit.id)}',${i})"><i class="fas fa-times"></i></button>
        </div>`).join('');

    const variantiHtml = `
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>varianti</strong> sono le versioni del prodotto (es. 500mA, 600mA, 700mA).<br>
                La <strong>chiave breve</strong> è un'abbreviazione interna (es. <code>500</code>) che appare come intestazione colonna nel BOM.
            </div>
            ${varHtml || '<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessuna variante ancora.</div>'}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddVar('${_esc(kit.id)}')"><i class="fas fa-plus"></i> Aggiungi variante</button>
        </div>`;

    // ─── Tab Materiali BOM ───
    const varHeaderCells = (kit.varianti||[]).map(v => {
        const lbl = v.nome.length > 9 ? v.nome.substring(0,8)+'…' : v.nome;
        return `<span class="kit-cfg-coeff-lbl" title="${_esc(v.nome)}">${_esc(lbl)}</span>`;
    }).join('');

    const sezioniHtml = (kit.sezioni||[]).map((sez,si) => {
        const compRows = (sez.componenti||[]).map((comp,ci) => {
            const varInputs = (kit.varianti||[]).map(v =>
                `<input class="kit-cfg-coeff" type="number" min="0" value="${parseInt(comp.qtaPerVariante?.[v.key])||0}"
                        title="${_esc(v.nome)}: pezzi di '${_esc(comp.nome)}' per UNA unità"
                        onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','coeff','${_esc(v.key)}',this.value)">`
            ).join('');
            return `<div class="kit-cfg-comp-row">
                <input class="kit-cfg-input kit-cfg-input-comp" value="${_esc(comp.nome)}" maxlength="60" placeholder="es. Profilo alluminio"
                       onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','nome','',this.value)">
                <div class="kit-cfg-coeffs">${varInputs}</div>
                <button class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}')"><i class="fas fa-times"></i></button>
            </div>`;
        }).join('');

        const compHeader = (kit.varianti||[]).length ? `
            <div class="kit-cfg-comp-header">
                <span style="flex:1;font-size:0.67rem;color:#94a3b8">Componente</span>
                ${varHeaderCells}
                <span style="width:28px"></span>
            </div>` : '';

        return `<div class="kit-cfg-sez-block" data-si="${si}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${_esc(sez.nome)}" maxlength="40" placeholder="Nome sezione (es. TESTA)"
                       onchange="_kitCfgUpdateSez('${_esc(kit.id)}','${_esc(sez.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${_esc(kit.id)}','${_esc(sez.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${compHeader}
            ${compRows}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${_esc(kit.id)}','${_esc(sez.id)}')"><i class="fas fa-plus"></i> Aggiungi componente</button>
        </div>`;
    }).join('');

    const sezioniPanelHtml = `
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                I <strong>componenti</strong> sono le materie prime. Per ogni riga, inserisci quanti pezzi
                servono per produrre <strong>UNA</strong> unità di ciascuna variante (coefficiente).<br>
                Usa le <strong>sezioni</strong> per raggruppare (es. una sezione <em>TESTA</em>, una <em>CORDONE</em>).
            </div>
            ${!(kit.varianti||[]).length ? `<div class="kit-cfg-warn">⚠️ Aggiungi prima le varianti nella tab <strong>Varianti</strong>.</div>` : ''}
            ${sezioniHtml}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${_esc(kit.id)}')"><i class="fas fa-plus"></i> Aggiungi sezione</button>
        </div>`;

    // ─── Tab Sub-Assembly — raggruppati per variante ───
    let saGroupedHtml = '';
    if (!(kit.varianti||[]).length) {
        saGroupedHtml = `<div class="kit-cfg-warn">⚠️ Aggiungi prima le varianti nella tab <strong>Varianti</strong>.</div>`;
    } else {
        saGroupedHtml = (kit.varianti||[]).map(v => {
            const items = (kit.sottoAssembly||[])
                .map((sa, i) => ({ sa, i }))
                .filter(({ sa }) => sa.varianteKey === v.key);

            const rows = items.map(({ sa, i }) => `
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${_esc(sa.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${_esc(kit.id)}',${i},'nome',this.value)">
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${_esc(kit.id)}',${i})"><i class="fas fa-times"></i></button>
                </div>`).join('');

            return `<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${_esc(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${items.length} part${items.length!==1?'i':'e'}</span>
                </div>
                ${rows || '<div class="kit-cfg-sa-empty">Nessuna parte — aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${_esc(kit.id)}','${_esc(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${_esc(v.nome)}</button>
            </div>`;
        }).join('');
    }

    const saPanelHtml = `
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                I <strong>sub-assembly</strong> sono le parti da costruire, tracciate separatamente per variante.<br>
                Es.: per il pipistrello crei <em>Testa</em> e <em>Cordone</em> per ogni variante (500mA, 600mA, 700mA).<br>
                Nel tab <strong>Pronti</strong> segni quante ne hai assemblate. Nel tab <strong>BOM</strong> nomina le sezioni uguale (es. <em>TESTA</em>) per coerenza.
            </div>
            ${saGroupedHtml}
        </div>`;

    const panels = { info: infoHtml, varianti: variantiHtml, bom: sezioniPanelHtml, sa: saPanelHtml };
    const tabNav = tabs.map(t => `<button class="kit-tab ${_kitConfigTab===t?'kit-tab--active':''}" onclick="_kitCfgSwitchTab('${t}')">${tabLabels[t]}</button>`).join('');

    contenitore.innerHTML = `
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${_esc(kit.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${_esc(kit.nome)}</span>
        </div>
        <div class="kit-tabs">${tabNav}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${panels[_kitConfigTab]}</div>
    </div>`;

    applicaFade(contenitore);
}

function _kitCfgBack(kitId) {
    // se stavamo configurando, torna alla vista (se esiste) o alla griglia
    if (kitId && _kitViewId === kitId) { _kitRenderView(); return; }
    _kitViewId = kitId;
    _kitRenderView();
}

function _kitCfgSwitchTab(tab) { _kitConfigTab = tab; _kitRenderConfig(); }

function _kitCfgSaveNome(kitId, val) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    kit.nome = val.trim() || 'Kit senza nome';
    _kitSave(kits);
}

function _kitElimina(kitId) {
    if (!confirm('Eliminare questo kit e tutti i suoi dati?')) return;
    const { kits } = _kitLoad();
    _kitSave(kits.filter(k => k.id !== kitId));
    _kitConfigId = null;
    _kitViewId   = null;
    caricaKitProdotti();
}

// ─── Varianti ─────────────────────────────────────────────────────────────────
function _kitCfgAddVar(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const idx = (kit.varianti||[]).length + 1;
    kit.varianti = kit.varianti || [];
    kit.varianti.push({ id: _uid(), key: 'v'+idx, nome: 'Variante '+idx });
    _kitSave(kits);
    _kitRenderConfig();
}

function _kitCfgUpdateVar(kitId, vi, field, val) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit || !kit.varianti[vi]) return;
    kit.varianti[vi][field] = val.trim();
    _kitSave(kits);
}

function _kitCfgDelVar(kitId, vi) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    kit.varianti.splice(vi, 1);
    _kitSave(kits);
    _kitRenderConfig();
}

// ─── Sezioni / Componenti ─────────────────────────────────────────────────────
function _kitCfgAddSez(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    kit.sezioni = kit.sezioni || [];
    kit.sezioni.push({ id: _uid(), nome: 'Nuova sezione', componenti: [] });
    _kitSave(kits);
    _kitRenderConfig();
}

function _kitCfgUpdateSez(kitId, sid, field, val) {
    const { kits } = _kitLoad();
    const kit  = kits.find(k => k.id === kitId);
    const sez  = kit && (kit.sezioni||[]).find(s => s.id === sid);
    if (!sez) return;
    sez[field] = val.trim();
    _kitSave(kits);
}

function _kitCfgDelSez(kitId, sid) {
    if (!confirm('Eliminare questa sezione e tutti i suoi componenti?')) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    kit.sezioni = (kit.sezioni||[]).filter(s => s.id !== sid);
    _kitSave(kits);
    _kitRenderConfig();
}

function _kitCfgAddComp(kitId, sid) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    const sez = kit && (kit.sezioni||[]).find(s => s.id === sid);
    if (!sez) return;
    sez.componenti = sez.componenti || [];
    sez.componenti.push({ id: _uid(), nome: 'Nuovo componente', qtaPerVariante: {}, caricato: 0 });
    _kitSave(kits);
    _kitRenderConfig();
}

function _kitCfgUpdateComp(kitId, sid, cid, field, vKey, val) {
    const { kits } = _kitLoad();
    const kit  = kits.find(k => k.id === kitId);
    const sez  = kit && (kit.sezioni||[]).find(s => s.id === sid);
    const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
    if (!comp) return;
    if (field === 'coeff') {
        comp.qtaPerVariante = comp.qtaPerVariante || {};
        comp.qtaPerVariante[vKey] = Math.max(0, parseInt(val)||0);
    } else {
        comp[field] = val.trim();
    }
    _kitSave(kits);
}

function _kitCfgDelComp(kitId, sid, cid) {
    const { kits } = _kitLoad();
    const kit  = kits.find(k => k.id === kitId);
    const sez  = kit && (kit.sezioni||[]).find(s => s.id === sid);
    if (!sez) return;
    sez.componenti = (sez.componenti||[]).filter(c => c.id !== cid);
    _kitSave(kits);
    _kitRenderConfig();
}

// ─── Sub-Assembly ─────────────────────────────────────────────────────────────
function _kitCfgAddSA(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    kit.sottoAssembly = kit.sottoAssembly || [];
    kit.sottoAssembly.push({ id: _uid(), nome: '', varianteKey: (kit.varianti||[])[0]?.key || '' });
    _kitSave(kits);
    _kitRenderConfig();
}

function _kitCfgAddSAForVariant(kitId, varKey) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    kit.sottoAssembly = kit.sottoAssembly || [];
    kit.sottoAssembly.push({ id: _uid(), nome: '', varianteKey: varKey });
    _kitSave(kits);
    _kitRenderConfig();
}

function _kitCfgUpdateSA(kitId, i, field, val) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit || !kit.sottoAssembly[i]) return;
    kit.sottoAssembly[i][field] = val.trim();
    _kitSave(kits);
}

function _kitCfgDelSA(kitId, i) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    kit.sottoAssembly.splice(i, 1);
    _kitSave(kits);
    _kitRenderConfig();
}

// ═════════════════════════════════════════════════════════════════════════════
// GLOBALS
// ═════════════════════════════════════════════════════════════════════════════

export function registerGlobals() {
    window._kitOpenView              = _kitOpenView;
    window._kitOpenConfig            = _kitOpenConfig;
    window._kitNuovoKit              = _kitNuovoKit;
    window._kitBack                  = _kitBack;
    window._kitSwitchTab             = _kitSwitchTab;
    window._kitAggiornaQty           = _kitAggiornaQty;
    window._kitAggiornaCar           = _kitAggiornaCar;
    window._kitAggiornaPronti        = _kitAggiornaPronti;
    window._kitSetPronti             = _kitSetPronti;
    window._kitApriModalSped         = _kitApriModalSped;
    window._kitChiudiModalSped       = _kitChiudiModalSped;
    window._kitConfermaSpedizione    = _kitConfermaSpedizione;
    window._kitApriModalReso         = _kitApriModalReso;
    window._kitChiudiModalReso       = _kitChiudiModalReso;
    window._kitResoQtyChange         = _kitResoQtyChange;
    window._kitResoAggiornaBOM       = _kitResoAggiornaBOM;
    window._kitConfermaReso          = _kitConfermaReso;
    window._kitSalvaMovimento        = _kitSalvaMovimento;
    window._kitEliminaMovimento      = _kitEliminaMovimento;
    window._kitModificaMovimento     = _kitModificaMovimento;
    window._kitChiudiModalEditMov    = _kitChiudiModalEditMov;
    window._kitConfermaModificaMov   = _kitConfermaModificaMov;
    window._kitChiudiModalDelMov     = _kitChiudiModalDelMov;
    window._kitConfermaEliminaMov    = _kitConfermaEliminaMov;
    window._kitSalvaManuale          = _kitSalvaManuale;
    window._kitElimina               = _kitElimina;
    window._kitCfgBack               = _kitCfgBack;
    window._kitCfgSwitchTab          = _kitCfgSwitchTab;
    window._kitCfgSaveNome           = _kitCfgSaveNome;
    window._kitCfgAddVar             = _kitCfgAddVar;
    window._kitCfgUpdateVar          = _kitCfgUpdateVar;
    window._kitCfgDelVar             = _kitCfgDelVar;
    window._kitCfgAddSez             = _kitCfgAddSez;
    window._kitCfgUpdateSez          = _kitCfgUpdateSez;
    window._kitCfgDelSez             = _kitCfgDelSez;
    window._kitCfgAddComp            = _kitCfgAddComp;
    window._kitCfgUpdateComp         = _kitCfgUpdateComp;
    window._kitCfgDelComp            = _kitCfgDelComp;
    window._kitCfgAddSA              = _kitCfgAddSA;
    window._kitCfgAddSAForVariant    = _kitCfgAddSAForVariant;
    window._kitCfgUpdateSA           = _kitCfgUpdateSA;
    window._kitCfgDelSA              = _kitCfgDelSA;
}

export default caricaKitProdotti;
