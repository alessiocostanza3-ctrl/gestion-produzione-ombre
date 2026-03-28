// PROD — Features / Pipistrelli
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ../core/config.js, ../core/session.js, ../core/api.js, ../core/cache.js, ../core/ui.js

import { URL_GOOGLE } from '../core/config.js';
import { utenteAttuale } from '../core/session.js';
import { gasRequest } from '../core/api.js';
import ProdCache from '../core/cache.js';
import { notificaElegante, applicaFade } from '../core/ui.js';

// ─── Flag fetch (sostituisce caricaPaginaPipistrello._fetched) ───────────────
let _fetched = false;

/** Resetta il flag di fetch: va chiamato da cambiaPagina quando si lascia PIPISTRELLI */
export function resetPipFetch() { _fetched = false; }

// ─────────────────────────────────────────────────────────────────
// PAGINA PIPISTRELLI
// Pianificazione mensile + fabbisogno materiali (100% client-side)
// ─────────────────────────────────────────────────────────────────
const _PIP_LS_QTY    = 'mlPipQty';       // { p, m, g }
const _PIP_LS_CARIC  = 'mlPipCaricato';  // { [idx]: valore }
const _PIP_LS_MOV    = 'mlPipMovimenti'; // array di movimenti
const _PIP_LS_PRONTI = 'mlPipPronti';    // { t_p, t_m, t_g, c_p, c_m, c_g }

const _PIP_BOM = [
  // [sezione, materiale, xPicc, xMedio, xGrande]
  ['TESTA',   'Testa piccola',     1, 0, 0],
  ['',        'Testa media',        0, 1, 0],
  ['',        'Testa grande',       0, 0, 1],
  ['',        'Catenaria piccola',  1, 0, 0],
  ['',        'Catenaria media',    0, 1, 0],
  ['',        'Catenaria grande',   0, 0, 1],
  ['',        'Tappino nero',       2, 2, 2],
  ['',        'Wago',               0, 2, 2],
  ['',        'Viti 2x6',           8, 0, 0],
  ['',        'Viti 2,5x6',         0, 8, 4],
  ['CORDONE', 'Case superiore',     1, 1, 1],
  ['',        'Case inf. 500mA',    1, 0, 0],
  ['',        'Case inf. 600mA',    0, 1, 0],
  ['',        'Case inf. 700mA',    0, 0, 1],
  ['',        'Pulsante',           1, 1, 1],
  ['',        'Viti nere',          2, 2, 2],
  ['',        'Plug 1,5m',          1, 0, 0],
  ['',        'Plug 2m',            0, 1, 1],
  ['',        'Cavo out 500mA',     1, 0, 0],
  ['',        'Cavo out 600mA',     0, 1, 0],
  ['',        'Cavo out 700mA',     0, 0, 1],
  ['',        'Alimentatore',       1, 1, 1],  // idx 21 — comune a tutti i tipi
  ['',        'Interruttore 500mA', 1, 0, 0],  // idx 22 — nel guscio cordone piccolo
  ['',        'Interruttore 600mA', 0, 1, 0],  // idx 23 — nel guscio cordone medio
  ['',        'Interruttore 700mA', 0, 0, 1],  // idx 24 — nel guscio cordone grande
];

// Composizione BOM degli assemblati completi
// chiave: idx _PIP_BOM → qty per singolo assemblato
const _PIP_ASSEMB = {
  TESTA: {
    p: [[0,1],[3,1],[6,2],[8,8]],               // piccolo 500mA (no Wago)
    m: [[1,1],[4,1],[6,2],[7,2],[9,8]],           // medio 600mA
    g: [[2,1],[5,1],[6,2],[7,2],[9,4]]            // grande 700mA (Wago 2x)
  },
  CORDONE: {
    p: [[10,1],[11,1],[14,1],[15,2],[16,1],[18,1],[22,1]], // piccolo 500mA + Interrupt.500mA
    m: [[10,1],[12,1],[14,1],[15,2],[17,1],[19,1],[23,1]], // medio 600mA + Interrupt.600mA
    g: [[10,1],[13,1],[14,1],[15,2],[17,1],[20,1],[24,1]]  // grande 700mA + Interrupt.700mA
  },
  ALIMENTATORE: {
    _: [[21,1]] // alimentatore unico (non differenziato per formato)
  }
};

const _PIP_KEY_MAP = [
  {key:'t_p', tipo:'TESTA',        fmt:'p', tipoLabel:'Testa',        fmtLabel:'Piccolo', emoji:'🔩', mA:'500mA'},
  {key:'t_m', tipo:'TESTA',        fmt:'m', tipoLabel:'Testa',        fmtLabel:'Medio',   emoji:'🔩', mA:'600mA'},
  {key:'t_g', tipo:'TESTA',        fmt:'g', tipoLabel:'Testa',        fmtLabel:'Grande',  emoji:'🔩', mA:'700mA'},
  {key:'c_p', tipo:'CORDONE',      fmt:'p', tipoLabel:'Cordone',      fmtLabel:'Piccolo', emoji:'🔌', mA:'500mA'},
  {key:'c_m', tipo:'CORDONE',      fmt:'m', tipoLabel:'Cordone',      fmtLabel:'Medio',   emoji:'🔌', mA:'600mA'},
  {key:'c_g', tipo:'CORDONE',      fmt:'g', tipoLabel:'Cordone',      fmtLabel:'Grande',  emoji:'🔌', mA:'700mA'},
  {key:'a',   tipo:'ALIMENTATORE', fmt:'_', tipoLabel:'Alimentatore', fmtLabel:'', emoji:'🔋', mA:''},
];

const _PIP_RESO_ITEMS = [
  {key:'t_p', tipo:'TESTA',        fmt:'p', label:'Testa Piccola',   emoji:'🔩', mA:'500mA'},
  {key:'t_m', tipo:'TESTA',        fmt:'m', label:'Testa Media',     emoji:'🔩', mA:'600mA'},
  {key:'t_g', tipo:'TESTA',        fmt:'g', label:'Testa Grande',    emoji:'🔩', mA:'700mA'},
  {key:'c_p', tipo:'CORDONE',      fmt:'p', label:'Cordone Piccolo', emoji:'🔌', mA:'500mA'},
  {key:'c_m', tipo:'CORDONE',      fmt:'m', label:'Cordone Medio',   emoji:'🔌', mA:'600mA'},
  {key:'c_g', tipo:'CORDONE',      fmt:'g', label:'Cordone Grande',  emoji:'🔌', mA:'700mA'},
  {key:'a',   tipo:'ALIMENTATORE', fmt:'_', label:'Alimentatore',    emoji:'🔋', mA:''},
];

// ─── localStorage helpers ────────────────────────────────────────────────────
function _pipLoadQty()    { try { return JSON.parse(localStorage.getItem(_PIP_LS_QTY))    || {p:0,m:0,g:0}; } catch { return {p:0,m:0,g:0}; } }
function _pipLoadCaric()  { try { return JSON.parse(localStorage.getItem(_PIP_LS_CARIC))  || {}; }             catch { return {}; } }
function _pipLoadPronti() { try { return JSON.parse(localStorage.getItem(_PIP_LS_PRONTI)) || {}; }             catch { return {}; } }
function _pipSaveQty(o)   { try { localStorage.setItem(_PIP_LS_QTY,    JSON.stringify(o)); localStorage.setItem('pip_local_ts', Date.now()); } catch {} _pipPushToServer(); }
function _pipSaveCaric(o) { try { localStorage.setItem(_PIP_LS_CARIC,  JSON.stringify(o)); localStorage.setItem('pip_local_ts', Date.now()); } catch {} _pipPushToServer(); }
function _pipSavePronti(o){ try { localStorage.setItem(_PIP_LS_PRONTI, JSON.stringify(o)); localStorage.setItem('pip_local_ts', Date.now()); } catch {} _pipPushToServer(); }
function _pipLoadMov()    { try { return JSON.parse(localStorage.getItem(_PIP_LS_MOV))    || []; }             catch { return []; } }
function _pipSaveMov(a)   { try { localStorage.setItem(_PIP_LS_MOV,    JSON.stringify(a)); localStorage.setItem('pip_local_ts', Date.now()); } catch {} _pipPushToServer(); }

// ─── Sync server ─────────────────────────────────────────────────────────────
let _pipPushTimer = null;

/** Invia (con debounce 1.5s) tutti i dati pipistrelli al server GAS */
function _pipPushToServer() {
    clearTimeout(_pipPushTimer);
    _pipPushTimer = setTimeout(function() {
        gasRequest({
            azione:    'setPipData',
            qty:       _pipLoadQty(),
            caricato:  _pipLoadCaric(),
            pronti:    _pipLoadPronti(),
            movimenti: _pipLoadMov()
        }).catch(function(err) { console.warn('[pipistrelli] salvataggio remoto fallito:', err); });
    }, 1500);
}

/**
 * Carica i dati pipistrelli dal server e, se trovati, aggiorna localStorage.
 * Sovrascrive SOLO se il server ha un timestamp più recente di quello locale.
 * Chiama cb(true) se ha applicato dati dal server, cb(false) altrimenti.
 */
function _pipFetchFromServer(cb) {
    fetch(URL_GOOGLE + '?azione=getPipData')
        .then(function(r) { return r.json(); })
        .then(function(d) {
            var serverTs = parseInt(d.ts || 0);
            var localTs  = parseInt(localStorage.getItem('pip_local_ts') || 0);
            if (serverTs > 0 && serverTs > localTs) {
                if (d.qty)      { try { localStorage.setItem(_PIP_LS_QTY,    JSON.stringify(d.qty));      } catch {} }
                if (d.caricato) { try { localStorage.setItem(_PIP_LS_CARIC,  JSON.stringify(d.caricato)); } catch {} }
                if (d.pronti)   { try { localStorage.setItem(_PIP_LS_PRONTI, JSON.stringify(d.pronti));   } catch {} }
                if (d.movimenti && Array.isArray(d.movimenti) && d.movimenti.length > 0) {
                    try { localStorage.setItem(_PIP_LS_MOV, JSON.stringify(d.movimenti)); } catch {}
                }
                try { localStorage.setItem('pip_local_ts', serverTs); } catch {}
                if (cb) cb(true);
            } else {
                if (cb) cb(false);
            }
        })
        .catch(function() { if (cb) cb(false); });
}

// ─── Utility di recovery (esposta su window) ─────────────────────────────────
window.pipRecovery = {
    stato: function() {
        const pr = _pipLoadPronti();
        const ca = _pipLoadCaric();
        const ts = localStorage.getItem('pip_local_ts');
        console.group('%c[pipRecovery] Stato localStorage pipistrelli', 'color:#1a237e;font-weight:bold');
        console.log('📅 pip_local_ts:', ts, ts ? '(' + new Date(parseInt(ts)).toLocaleString('it-IT') + ')' : '(mai salvato)');
        console.log('🔄 PRONTI:', JSON.stringify(pr));
        console.log('   — TESTA  P/M/G:', pr.t_p||0, pr.t_m||0, pr.t_g||0);
        console.log('   — CORDONE P/M/G:', pr.c_p||0, pr.c_m||0, pr.c_g||0);
        const hasPronti = Object.values(pr).some(v => v > 0);
        console.log(hasPronti ? '✅ Pronti presenti → puoi usare pipRecovery.forzaRipristino()' : '⚠️ Pronti tutti 0 → usa pipRecovery.reimpostaPronti({t_p:X,t_m:X,...})');
        console.log('📦 CARICATO keys:', Object.keys(ca).length, '— valori:', JSON.stringify(ca));
        console.groupEnd();
        return { pronti: pr, caricato: ca };
    },
    forzaRipristino: function() {
        const payload = {
            azione:    'setPipData',
            qty:       _pipLoadQty(),
            caricato:  _pipLoadCaric(),
            pronti:    _pipLoadPronti(),
            movimenti: _pipLoadMov()
        };
        localStorage.setItem('pip_local_ts', Date.now());
        gasRequest(payload)
            .then(d => console.log('%c[pipRecovery] ✅ Ripristino inviato al server:', 'color:green', d))
            .catch(e => console.error('[pipRecovery] ❌ Errore:', e));
        console.log('[pipRecovery] Invio in corso...');
    },
    reimpostaPronti: function(obj) {
        const campiValidi = ['t_p','t_m','t_g','c_p','c_m','c_g'];
        const nuovi = {};
        campiValidi.forEach(k => { nuovi[k] = parseInt(obj[k]) || 0; });
        console.log('[pipRecovery] Imposto pronti:', JSON.stringify(nuovi));
        _pipSavePronti(nuovi);
        // _pipAggiornaUI_Pip non esiste nel modulo — invocare caricaPipistrelli() dalla console se necessario
        console.log('%c[pipRecovery] ✅ Pronti impostati e push al server avviato', 'color:green');
    }
};

// ─── Logica di calcolo ────────────────────────────────────────────────────────

/**
 * Ricostruisce mlPipCaricato dai movimenti di carico/scarico/spedizione.
 */
function _pipRicostruisciDaMovimenti() {
    const movimenti = _pipLoadMov();
    if (!movimenti.length) return null;
    const caric = {};
    [...movimenti].reverse().forEach(m => {
        if (m.tipo === 'carico') {
            const i = parseInt(m.idx);
            if (!isNaN(i)) caric[i] = (Number(caric[i] || 0)) + (m.qty || 0);
        } else if (m.tipo === 'scarico') {
            const i = parseInt(m.idx);
            if (!isNaN(i)) caric[i] = Math.max(0, (Number(caric[i] || 0)) - (m.qty || 0));
        } else if (m.tipo === 'spedizione' || m.tipo === 'assemb') {
            (m.righe || []).forEach(r => {
                const i = parseInt(r.idx);
                if (!isNaN(i)) caric[i] = Math.max(0, (Number(caric[i] || 0)) - (r.qty || 0));
            });
        }
    });
    return caric;
}

/** Calcola quanti pz di ogni componente BOM sono "impegnati" nei pronti */
function _pipCalcImpegnati() {
    const pronti = _pipLoadPronti();
    const imp = {};
    [['TESTA','p','t_p'],['TESTA','m','t_m'],['TESTA','g','t_g'],
     ['CORDONE','p','c_p'],['CORDONE','m','c_m'],['CORDONE','g','c_g']]
    .forEach(([tipo, fmt, key]) => {
        const n = pronti[key] || 0;
        if (!n) return;
        (_PIP_ASSEMB[tipo]?.[fmt] || []).forEach(([idx, coeff]) => {
            imp[idx] = (imp[idx] || 0) + n * coeff;
        });
    });
    const nAlim = pronti['a'] || 0;
    if (nAlim) imp[21] = (imp[21] || 0) + nAlim;
    return imp;
}

/** Ricalcola e aggiorna il badge "liberi" in ogni riga della tabella BOM */
function _pipAggiornaLiberi() {
    const imp   = _pipCalcImpegnati();
    const caric = _pipLoadCaric();
    document.querySelectorAll('#pip-tbody tr').forEach(tr => {
        const idx  = parseInt(tr.dataset.idx);
        const car  = Number(caric[idx] || 0);
        const impI = imp[idx] || 0;
        const span = tr.querySelector('.pip-car-liberi');
        if (!span) return;
        if (impI > 0) {
            span.textContent = Math.max(0, car - impI) + ' lib.';
            span.style.display = '';
        } else {
            span.style.display = 'none';
        }
    });
}

/** Aggiorna contatore pronti (+1/-1) e ricalcola i liberi */
function _pipAggiornaPronti(key, delta) {
    const pronti  = _pipLoadPronti();
    pronti[key]   = Math.max(0, (pronti[key] || 0) + delta);
    _pipSavePronti(pronti);
    _pipAggiornaLiberi();
    _pipRenderPronti();
}

/** Imposta direttamente il valore (da input manuale) */
function _pipSetPronti(key, val) {
    const pronti = _pipLoadPronti();
    pronti[key]  = Math.max(0, parseInt(val) || 0);
    _pipSavePronti(pronti);
    _pipAggiornaLiberi();
    const inp = document.querySelector(`.pip-pronti-input[data-key="${key}"]`);
    if (inp) {
        inp.value = pronti[key];
        inp.classList.toggle('pip-pronti-val-on', pronti[key] > 0);
    }
}

/** Ridisegna i contatori nella card PRONTI DA SPEDIRE */
function _pipRenderPronti() {
    const pronti = _pipLoadPronti();
    const sezioni = [
        {
            titolo: '🔩 Teste',
            items: [
                {key:'t_p', label:'Testa',   mA:'500mA', emoji:'🔩'},
                {key:'t_m', label:'Testa',   mA:'600mA', emoji:'🔩'},
                {key:'t_g', label:'Testa',   mA:'700mA', emoji:'🔩'},
            ]
        },
        {
            titolo: '🔌 Cordoni',
            items: [
                {key:'c_p', label:'Cordone', mA:'500mA', emoji:'🔌'},
                {key:'c_m', label:'Cordone', mA:'600mA', emoji:'🔌'},
                {key:'c_g', label:'Cordone', mA:'700mA', emoji:'🔌'},
            ]
        },
        {
            titolo: '🔋 Alimentatori',
            items: [
                {key:'a', label:'Alimentatore', mA:'', emoji:'🔋'},
            ]
        },
    ];
    const grid = document.getElementById('pip-pronti-grid');
    if (!grid) return;
    grid.innerHTML = sezioni.map(sez => {
        const righe = sez.items.map(c => {
            const n = pronti[c.key] || 0;
            return `<div class="pip-pronti-row">
        <span class="pip-pronti-lbl">${c.emoji} ${c.label}${c.mA ? ` <span class="pip-pronti-ma">${c.mA}</span>` : ''}</span>
        <div class="pip-pronti-ctrl">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${c.key}',-1)">−</button>
          <input class="pip-pronti-input${n > 0 ? ' pip-pronti-val-on' : ''}" type="number" min="0"
                 data-key="${c.key}" value="${n}"
                 oninput="_pipSetPronti('${c.key}', this.value)"
                 onchange="_pipSetPronti('${c.key}', this.value)">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${c.key}',1)">+</button>
        </div>
      </div>`;
        }).join('');
        return `<div class="pip-pronti-sezione"><div class="pip-pronti-sezione-titolo">${sez.titolo}</div>${righe}</div>`;
    }).join('');
}

/** Calcola il rowspan per la colonna SEZIONE */
function _pipRowspan(startIdx) {
    let count = 1;
    for (let i = startIdx + 1; i < _PIP_BOM.length; i++) {
        if (_PIP_BOM[i][0] !== '') break;
        count++;
    }
    return count;
}

/** Aggiorna i totali quando cambiano le quantità */
function _pipAggiornaQty() {
    const p = Math.max(0, parseInt(document.getElementById('pip-qty-p')?.value) || 0);
    const m = Math.max(0, parseInt(document.getElementById('pip-qty-m')?.value) || 0);
    const g = Math.max(0, parseInt(document.getElementById('pip-qty-g')?.value) || 0);
    _pipSaveQty({p, m, g});

    const totEl = document.getElementById('pip-tot');
    if (totEl) totEl.textContent = p + m + g;

    const caric = _pipLoadCaric();
    document.querySelectorAll('#pip-tbody tr').forEach(tr => {
        const idx = parseInt(tr.dataset.idx);
        const row = _PIP_BOM[idx];
        const fab = p * row[2] + m * row[3] + g * row[4];
        const car = Number(caric[idx] || 0);
        const ord = Math.max(0, fab - car);

        const fabTd = tr.querySelector('.pip-fab, .pip-fab-zero');
        const ordTd = tr.querySelector('[class^="pip-ord"]');

        if (fabTd) {
            fabTd.textContent = fab > 0 ? fab : '—';
            fabTd.className = fab === 0 ? 'pip-fab pip-fab-zero' : 'pip-fab';
        }
        if (ordTd) {
            ordTd.textContent = fab === 0 ? '—' : ord;
            ordTd.className = fab === 0 ? 'pip-ord-zero' : (ord > 0 ? 'pip-ord-manca' : 'pip-ord-ok');
        }
    });
}

/** Aggiorna "DA ORDINARE" quando si modifica il CARICATO */
function _pipAggiornaCar(input) {
    const idx   = parseInt(input.dataset.idx);
    const car   = Math.max(0, parseInt(input.value) || 0);
    const caric = _pipLoadCaric();
    caric[idx]  = car;
    _pipSaveCaric(caric);

    const qty = _pipLoadQty();
    const row = _PIP_BOM[idx];
    const fab = qty.p * row[2] + qty.m * row[3] + qty.g * row[4];
    const ord = Math.max(0, fab - car);

    const tr    = input.closest('tr');
    const ordTd = tr?.querySelector('[class^="pip-ord"]');
    if (ordTd) {
        ordTd.textContent = fab === 0 ? '—' : ord;
        ordTd.className = fab === 0 ? 'pip-ord-zero' : (ord > 0 ? 'pip-ord-manca' : 'pip-ord-ok');
    }
    const imp   = _pipCalcImpegnati();
    const impI  = imp[idx] || 0;
    const span  = tr?.querySelector('.pip-car-liberi');
    if (span) {
        if (impI > 0) { span.textContent = Math.max(0, car - impI) + ' lib.'; span.style.display = ''; }
        else span.style.display = 'none';
    }
}

/** Salva manualmente tutti i dati sul server con feedback visivo */
function _pipSalvaManuale() {
    const btn   = document.getElementById('pip-save-btn');
    const label = document.getElementById('pip-save-label');
    if (!btn || !label) return;

    btn.disabled = true;
    btn.classList.remove('pip-save-ok', 'pip-save-err');
    btn.classList.add('pip-save-loading');
    label.textContent = 'Salvataggio…';

    gasRequest({
        azione:    'setPipData',
        qty:       _pipLoadQty(),
        caricato:  _pipLoadCaric(),
        pronti:    _pipLoadPronti(),
        movimenti: _pipLoadMov()
    })
        .then(function() {
            try { localStorage.setItem('pip_local_ts', Date.now()); } catch {}
            btn.classList.remove('pip-save-loading');
            btn.classList.add('pip-save-ok');
            label.textContent = 'Salvato ✓';
            setTimeout(function() {
                btn.classList.remove('pip-save-ok');
                label.textContent = 'Salva';
                btn.disabled = false;
            }, 2500);
        })
        .catch(function() {
            btn.classList.remove('pip-save-loading');
            btn.classList.add('pip-save-err');
            label.textContent = 'Errore ✗';
            setTimeout(function() {
                btn.classList.remove('pip-save-err');
                label.textContent = 'Salva';
                btn.disabled = false;
            }, 3000);
        });
}

/** Salva un movimento di carico o scarico */
function _pipSalvaMovimento(tipo) {
    const idxEl  = document.getElementById('pip-mov-mat');
    const qtyEl  = document.getElementById('pip-mov-qty');
    const notaEl = document.getElementById('pip-mov-nota');
    if (!idxEl || !qtyEl) return;

    const idx  = parseInt(idxEl.value);
    const qty  = Math.max(1, parseInt(qtyEl.value) || 1);
    const nota = (notaEl?.value || '').trim();
    const mat  = _PIP_BOM[idx]?.[1] || '?';

    const caric = _pipLoadCaric();
    if (tipo === 'carico') {
        caric[idx] = (Number(caric[idx] || 0)) + qty;
    } else {
        caric[idx] = Math.max(0, (Number(caric[idx] || 0)) - qty);
    }
    _pipSaveCaric(caric);

    const carInput = document.querySelector(`#pip-tbody input[data-idx="${idx}"]`);
    if (carInput) {
        carInput.value = caric[idx];
        _pipAggiornaCar(carInput);
    }

    const movimenti = _pipLoadMov();
    movimenti.unshift({
        id: Date.now(),
        idx, tipo, qty, nota, mat,
        ts: new Date().toLocaleString('it-IT', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'})
    });
    _pipSaveMov(movimenti);

    qtyEl.value  = 1;
    if (notaEl) notaEl.value = '';

    _pipRenderMovimenti();
}

/** Elimina un movimento per id, ripristinando il caricato */
function _pipEliminaMovimento(id) {
    if (!_pipCanEditMov()) return;
    const movimenti = _pipLoadMov();
    const mov = movimenti.find(m => m.id === id);
    if (!mov) return;
    _pipApriModalDel(id, mov);
}

function _pipApriModalDel(id, mov) {
    const modal = document.getElementById('modal-pip-del-mov');
    if (!modal) return;
    const descEl = document.getElementById('pip-del-mov-desc');
    let descHtml;
    if (mov.tipo === 'reso') {
        const totPz  = mov.totPz || 0;
        const nRecup = (mov.righe    || []).length;
        const nScart = (mov.scartate || []).length;
        descHtml = `<span class="pip-mov-badge reso" style="font-size:0.75rem">RESO</span>
     <strong>Rientro ×${totPz} pz</strong>
     <br><span style="color:#64748b;font-size:0.82rem">${nRecup} comp. recuperati · ${nScart} comp. scartati</span>
     ${mov.nota ? `<br><span style="color:#64748b;font-size:0.82rem">${mov.nota}</span>` : ''}`;
    } else {
        const tipo = mov.tipo === 'carico' ? 'CARICO' : 'SCARICO';
        descHtml = `<span class="pip-mov-badge ${mov.tipo}" style="font-size:0.75rem">${tipo}</span>
     <strong>${mov.mat}</strong> &nbsp;${mov.tipo === 'carico' ? '+' : '−'}${mov.qty} pz
     ${mov.nota ? `<br><span style="color:#64748b;font-size:0.82rem">${mov.nota}</span>` : ''}`;
    }
    if (descEl) descEl.innerHTML = descHtml;
    const btn = document.getElementById('btn-pip-del-ok');
    if (btn) btn.onclick = () => _pipConfermaEliminaMov(id);
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _pipChiudiModalDel() {
    const modal = document.getElementById('modal-pip-del-mov');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

function _pipConfermaEliminaMov(id) {
    _pipChiudiModalDel();
    const movimenti = _pipLoadMov();
    const mov = movimenti.find(m => m.id === id);
    if (!mov) return;
    const caric = _pipLoadCaric();
    if (mov.tipo === 'assemb' || mov.tipo === 'spedizione') {
        (mov.righe || []).forEach(r => {
            caric[r.idx] = (Number(caric[r.idx] || 0)) + r.qty;
        });
        _pipSaveCaric(caric);
        (mov.righe || []).forEach(r => {
            const inp = document.querySelector(`#pip-tbody input[data-idx="${r.idx}"]`);
            if (inp) { inp.value = caric[r.idx]; _pipAggiornaCar(inp); }
        });
    } else if (mov.tipo === 'reso') {
        (mov.righe || []).forEach(r => {
            caric[r.idx] = Math.max(0, (Number(caric[r.idx] || 0)) - r.qty);
        });
        _pipSaveCaric(caric);
        (mov.righe || []).forEach(r => {
            const inp = document.querySelector(`#pip-tbody input[data-idx="${r.idx}"]`);
            if (inp) { inp.value = caric[r.idx]; _pipAggiornaCar(inp); }
        });
    } else {
        if (mov.tipo === 'carico') {
            caric[mov.idx] = Math.max(0, (Number(caric[mov.idx] || 0)) - mov.qty);
        } else {
            caric[mov.idx] = (Number(caric[mov.idx] || 0)) + mov.qty;
        }
        _pipSaveCaric(caric);
        const carInput = document.querySelector(`#pip-tbody input[data-idx="${mov.idx}"]`);
        if (carInput) { carInput.value = caric[mov.idx]; _pipAggiornaCar(carInput); }
    }
    _pipSaveMov(movimenti.filter(m => m.id !== id));
    _pipRenderMovimenti();
    notificaElegante('Movimento eliminato ✓');
}

/** Renderizza la lista movimenti nel DOM */
function _pipRenderMovimenti() {
    const list = document.getElementById('pip-mov-list');
    if (!list) return;
    const movimenti = _pipLoadMov();
    const canEdit = _pipCanEditMov();

    if (movimenti.length === 0) {
        list.innerHTML = '<div class="pip-mov-empty">Nessun movimento registrato</div>';
        return;
    }

    list.innerHTML = movimenti.map(m => {
        const delBtn = canEdit
            ? `<button class="pip-mov-del" onclick="_pipEliminaMovimento(${m.id})" title="Elimina">✕</button>`
            : '<span style="width:22px;flex-shrink:0"></span>';
        const editBtn = (canEdit && (m.tipo === 'carico' || m.tipo === 'scarico'))
            ? `<button class="pip-mov-edit" onclick="_pipModificaMovimento(${m.id})" title="Modifica">✎</button>`
            : '<span style="width:22px;flex-shrink:0"></span>';

        if (m.tipo === 'spedizione') {
            const totPz = (m.items || []).reduce((s, i) => s + i.qty, 0);
            const mAGroup = {};
            (m.items || []).forEach(it => { mAGroup[it.mA] = (mAGroup[it.mA] || 0) + it.qty; });
            const mALabel = Object.entries(mAGroup).map(([ma, q]) => `<span class="pip-sped-ma-pill">${ma} ×${q}</span>`).join('');
            const itemsHtml = (m.items || []).map(it =>
                `<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${it.emoji} ${it.tipoLabel} ${it.fmtLabel} <span class="pip-pronti-ma">${it.mA}</span></span>
          <span class="pip-mov-qty scarico">×${it.qty}</span>
        </div>`
            ).join('');
            const bomHtml = (m.righe || []).map(r =>
                `<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8">${r.mat}</span>
          <span class="pip-mov-qty scarico">−${r.qty}</span>
        </div>`
            ).join('');
            return `
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge spedizione">SPED.</span>
            <span class="pip-mov-assemb-label">🚚 Spediz. ×${totPz} pz ${mALabel}</span>
            ${m.nota ? `<span class="pip-mov-nota">${m.nota}</span>` : ''}
            <span class="pip-mov-ts">${m.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${delBtn}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${itemsHtml}</div>
            <div class="pip-sped-bom-divider">componenti scaricati</div>
            ${bomHtml}
          </div>
        </details>`;
        }

        if (m.tipo === 'assemb') {
            const emoji   = m.assembTipo === 'Testa' ? '🔩' : '🔌';
            const mALabel = m.assembFmt === 'Piccolo' ? '500mA' : m.assembFmt === 'Medio' ? '600mA' : '700mA';
            const righeHtml = (m.righe || []).map(r =>
                `<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat">${r.mat}</span>
          <span class="pip-mov-qty scarico">−${r.qty}</span>
        </div>`
            ).join('');
            return `
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge assemb">${mALabel}</span>
            <span class="pip-mov-assemb-label">${emoji} ${m.assembTipo} ${m.assembFmt} ×${m.assembQty}</span>
            ${m.nota ? `<span class="pip-mov-nota">${m.nota}</span>` : ''}
            <span class="pip-mov-ts">${m.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${delBtn}
          </summary>
          <div class="pip-assemb-sub-list">${righeHtml}</div>
        </details>`;
        }

        if (m.tipo === 'reso') {
            const totPz = m.totPz || 0;
            const itemsHtml = (m.items || []).map(it =>
                `<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${it.emoji} ${it.label}${it.mA ? ` <span class="pip-pronti-ma">${it.mA}</span>` : ''}</span>
          <span class="pip-mov-qty carico">×${it.qty}</span>
        </div>`
            ).join('');
            const recuperatiHtml = (m.righe || []).map(r =>
                `<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#15803d">✓ ${r.mat}</span>
          <span class="pip-mov-qty carico">+${r.qty}</span>
        </div>`
            ).join('');
            const scartatiHtml = (m.scartate || []).map(r =>
                `<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${r.mat}</span>
          <span class="pip-mov-qty" style="color:#94a3b8">✕ ${r.qty}</span>
        </div>`
            ).join('');
            return `
        <details class="pip-mov-assemb-group pip-mov-reso-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge reso">RESO</span>
            <span class="pip-mov-assemb-label">📦 Rientro ×${totPz} pz</span>
            ${m.nota ? `<span class="pip-mov-nota">${m.nota}</span>` : ''}
            <span class="pip-mov-ts">${m.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${delBtn}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${itemsHtml}</div>
            ${recuperatiHtml ? `<div class="pip-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${recuperatiHtml}` : ''}
            ${scartatiHtml ? `<div class="pip-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${scartatiHtml}` : ''}
          </div>
        </details>`;
        }

        return `
      <div class="pip-mov-item ${m.tipo}">
        <span class="pip-mov-badge ${m.tipo}">${m.tipo === 'carico' ? 'CARICO' : 'SCARICO'}</span>
        <span class="pip-mov-mat">${m.mat}</span>
        <span class="pip-mov-qty ${m.tipo}">${m.tipo === 'carico' ? '+' : '−'}${m.qty}</span>
        ${m.nota ? `<span class="pip-mov-nota">${m.nota}</span>` : '<span class="pip-mov-nota"></span>'}
        <span class="pip-mov-ts">${m.ts}</span>
        ${editBtn}${delBtn}
      </div>`;
    }).join('');
}

/** Permesso modifica/cancellazione movimenti: MASTER o ALESSIO */
function _pipCanEditMov() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const nome = String(utenteAttuale.nome).toUpperCase().trim();
    return nome === 'ALESSIO' || nome === '0000' || utenteAttuale.ruolo === 'MASTER';
}

/** Modifica la quantità e/o la nota di un movimento singolo (carico/scarico) */
function _pipModificaMovimento(id) {
    if (!_pipCanEditMov()) return;
    const movimenti = _pipLoadMov();
    const mov = movimenti.find(m => m.id === id);
    if (!mov) return;
    const modal  = document.getElementById('modal-pip-edit-mov');
    if (!modal) return;
    const matEl  = document.getElementById('pip-edit-mov-mat');
    const qtyEl  = document.getElementById('pip-edit-mov-qty');
    const notaEl = document.getElementById('pip-edit-mov-nota');
    if (matEl)  matEl.innerHTML  = `<span class="pip-mov-badge ${mov.tipo}" style="font-size:0.75rem">${mov.tipo === 'carico' ? 'CARICO' : 'SCARICO'}</span> <strong>${mov.mat}</strong>`;
    if (qtyEl)  { qtyEl.value   = mov.qty; }
    if (notaEl) { notaEl.value  = mov.nota || ''; }
    modal.dataset.movId = id;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    setTimeout(() => notaEl && notaEl.focus(), 80);
}

function _pipChiudiModalEdit() {
    const modal = document.getElementById('modal-pip-edit-mov');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

function _pipConfermaModificaMov() {
    const modal = document.getElementById('modal-pip-edit-mov');
    if (!modal) return;
    const id = Number(modal.dataset.movId);
    _pipChiudiModalEdit();

    const movimenti = _pipLoadMov();
    const idx = movimenti.findIndex(m => m.id === id);
    if (idx === -1) return;
    const mov = movimenti[idx];

    const newQty  = parseInt(document.getElementById('pip-edit-mov-qty')?.value);
    const newNota = (document.getElementById('pip-edit-mov-nota')?.value || '').trim();
    if (isNaN(newQty) || newQty <= 0) { notificaElegante('Quantità non valida ⚠️'); return; }

    const qtyChanged  = newQty  !== mov.qty;
    const notaChanged = newNota !== (mov.nota || '').trim();
    if (!qtyChanged && !notaChanged) return;

    if (qtyChanged) {
        const diff  = newQty - mov.qty;
        const caric = _pipLoadCaric();
        if (mov.tipo === 'carico') {
            caric[mov.idx] = Math.max(0, (Number(caric[mov.idx] || 0)) + diff);
        } else {
            caric[mov.idx] = Math.max(0, (Number(caric[mov.idx] || 0)) - diff);
        }
        _pipSaveCaric(caric);
        const inp = document.querySelector(`#pip-tbody input[data-idx="${mov.idx}"]`);
        if (inp) { inp.value = caric[mov.idx]; _pipAggiornaCar(inp); }
    }

    movimenti[idx] = { ...mov, qty: newQty, nota: newNota };
    _pipSaveMov(movimenti);
    _pipRenderMovimenti();
    notificaElegante('Movimento aggiornato ✓');
}

// ─── Modal spedizione ─────────────────────────────────────────────────────────

/** Apre il modal di selezione/conferma spedizione */
function _pipScaricoTuttiPronti() {
    const pronti = _pipLoadPronti();
    const items  = _PIP_KEY_MAP.filter(k => (pronti[k.key] || 0) > 0).map(k => ({ ...k, qty: pronti[k.key] }));

    if (!items.length) {
        notificaElegante('Nessun articolo da spedire — imposta le quantità prima ⚠️');
        return;
    }

    const listEl = document.getElementById('pip-sped-items');
    if (listEl) {
        listEl.innerHTML = items.map(it => `
      <label class="pip-sped-item-row">
        <input type="checkbox" class="pip-sped-chk" data-key="${it.key}" checked>
        <span class="pip-sped-item-info">
          <span class="pip-sped-item-emoji">${it.emoji}</span>
          <span class="pip-sped-item-label">${it.tipoLabel}${it.mA ? ` <span class="pip-pronti-ma">${it.mA}</span>` : ''}</span>
          <span class="pip-sped-item-qty">×${it.qty}</span>
        </span>
      </label>`).join('');

        listEl.querySelectorAll('.pip-sped-chk').forEach(chk =>
            chk.addEventListener('change', _pipAggiornaSpeWarning)
        );
    }

    _pipAggiornaSpeWarning();

    const modal = document.getElementById('modal-pip-spedizione');
    if (modal) {
        modal.style.display = 'flex';
        modal.offsetHeight;
        modal.classList.add('active');
    }
}

/** Ricalcola il warning di squilibrio in base alle checkbox selezionate */
function _pipAggiornaSpeWarning() {
    const checked = [...document.querySelectorAll('.pip-sped-chk:checked')].map(c => c.dataset.key);
    const hasTesta        = checked.some(k => k.startsWith('t_'));
    const hasCordone      = checked.some(k => k.startsWith('c_'));
    const hasAlimentatore = checked.includes('a');

    const warn    = document.getElementById('pip-sped-warning');
    const warnMsg = document.getElementById('pip-sped-warning-msg');
    const okBtn   = document.getElementById('btn-pip-sped-ok');

    if (!checked.length) {
        if (warn) warn.style.display = 'flex';
        if (warnMsg) warnMsg.textContent = 'Nessun articolo selezionato.';
        if (okBtn) okBtn.disabled = true;
        return;
    }

    if (okBtn) okBtn.disabled = false;

    const mancanti = [];
    if (!hasTesta)        mancanti.push('Teste');
    if (!hasCordone)      mancanti.push('Cordoni');
    if (!hasAlimentatore) mancanti.push('Alimentatori');

    if (mancanti.length > 0 && mancanti.length < 3) {
        if (warn) warn.style.display = 'flex';
        if (warnMsg) warnMsg.textContent =
            `Attenzione: stai spedendo senza ${mancanti.join(' e ')} — normalmente Testa, Cordone e Alimentatore vanno spediti insieme. Confermi comunque?`;
    } else {
        if (warn) warn.style.display = 'none';
    }
}

/** Esegue lo scarico degli item selezionati nel modal */
function _pipConfermaSpedizione() {
    const checked = [...document.querySelectorAll('.pip-sped-chk:checked')].map(c => c.dataset.key);
    if (!checked.length) return;

    const pronti = _pipLoadPronti();
    const items  = _PIP_KEY_MAP
        .filter(k => checked.includes(k.key) && (pronti[k.key] || 0) > 0)
        .map(k => ({ ...k, qty: pronti[k.key] }));

    if (!items.length) return;

    const nota  = (document.getElementById('pip-spedizione-nota')?.value || '').trim();
    const caric = _pipLoadCaric();
    const righeMap = {};

    items.forEach(item => {
        const bom = _PIP_ASSEMB[item.tipo]?.[item.fmt];
        if (!bom) return;
        bom.forEach(([idx, coeff]) => {
            const qtyTot = item.qty * coeff;
            caric[idx] = Math.max(0, (Number(caric[idx] || 0)) - qtyTot);
            if (righeMap[idx]) righeMap[idx].qty += qtyTot;
            else righeMap[idx] = { idx, mat: _PIP_BOM[idx]?.[1] || '?', qty: qtyTot };
        });
    });

    const righe = Object.values(righeMap);
    _pipSaveCaric(caric);

    const ts = new Date().toLocaleString('it-IT', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'});
    const movimenti = _pipLoadMov();
    movimenti.unshift({ id: Date.now(), tipo: 'spedizione', items, righe, nota, ts });
    _pipSaveMov(movimenti);

    const nuoviPronti = { ..._pipLoadPronti() };
    checked.forEach(k => { delete nuoviPronti[k]; });
    _pipSavePronti(nuoviPronti);

    const rimanenti = _PIP_KEY_MAP.filter(k => (nuoviPronti[k.key] || 0) > 0);
    if (!rimanenti.length) {
        const notaEl = document.getElementById('pip-spedizione-nota');
        if (notaEl) notaEl.value = '';
    }

    righe.forEach(r => {
        const inp = document.querySelector(`#pip-tbody input[data-idx="${r.idx}"]`);
        if (inp) { inp.value = caric[r.idx]; _pipAggiornaCar(inp); }
    });

    _pipChiudiModalSped();
    _pipRenderPronti();
    _pipAggiornaLiberi();
    _pipRenderMovimenti();

    const totPz = items.reduce((s, i) => s + i.qty, 0);
    notificaElegante(`Spedizione registrata: ${totPz} pz scaricati ✓`);
}

function _pipChiudiModalSped() {
    const modal = document.getElementById('modal-pip-spedizione');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

// ─── Gestione resi ────────────────────────────────────────────────────────────

function _pipApriModalReso() {
    const modal = document.getElementById('modal-pip-reso');
    if (!modal) return;
    _PIP_RESO_ITEMS.forEach(it => {
        const inp = document.getElementById('pip-reso-qty-' + it.key);
        if (inp) inp.value = 0;
    });
    const notaEl = document.getElementById('pip-reso-nota');
    if (notaEl) notaEl.value = '';
    _pipResoAggiornaBOM();
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _pipChiudiModalReso() {
    const modal = document.getElementById('modal-pip-reso');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

function _pipResoQtyChange(key, delta) {
    const inp = document.getElementById('pip-reso-qty-' + key);
    if (!inp) return;
    inp.value = Math.max(0, (parseInt(inp.value) || 0) + delta);
    _pipResoAggiornaBOM();
}

/** Ricalcola la griglia componenti da recuperare in base alle qty inserite */
function _pipResoAggiornaBOM() {
    const totComp = {};
    _PIP_RESO_ITEMS.forEach(it => {
        const n = parseInt(document.getElementById('pip-reso-qty-' + it.key)?.value) || 0;
        if (!n) return;
        const bom = _PIP_ASSEMB[it.tipo]?.[it.fmt] || [];
        bom.forEach(([idx, coeff]) => {
            totComp[idx] = (totComp[idx] || 0) + n * coeff;
        });
        if (it.key === 'a') {
            totComp[21] = (totComp[21] || 0) + n;
        }
    });

    const listEl = document.getElementById('pip-reso-bom-list');
    if (!listEl) return;
    const entries = Object.entries(totComp).filter(([, q]) => q > 0);
    if (!entries.length) {
        listEl.innerHTML = '<div class="pip-reso-bom-empty">Inserisci le quantità sopra per vedere i componenti da recuperare.</div>';
        return;
    }
    listEl.innerHTML = entries.map(([idx, qty]) => {
        const mat = _PIP_BOM[parseInt(idx)]?.[1] || '?';
        return `<label class="pip-reso-bom-row">
      <input type="checkbox" class="pip-reso-bom-chk" data-idx="${idx}" data-qty="${qty}" checked>
      <span class="pip-reso-bom-mat">${mat}</span>
      <span class="pip-reso-bom-qty">+${qty}</span>
    </label>`;
    }).join('');
}

function _pipConfermaReso() {
    const items = [];
    _PIP_RESO_ITEMS.forEach(it => {
        const n = parseInt(document.getElementById('pip-reso-qty-' + it.key)?.value) || 0;
        if (n > 0) items.push({ ...it, qty: n });
    });
    if (!items.length) { notificaElegante('Inserisci almeno un articolo rientrato ⚠️'); return; }

    const righe    = [];
    const scartate = [];
    document.querySelectorAll('.pip-reso-bom-chk').forEach(chk => {
        const idx = parseInt(chk.dataset.idx);
        const qty = parseInt(chk.dataset.qty);
        const mat = _PIP_BOM[idx]?.[1] || '?';
        if (chk.checked) righe.push({ idx, mat, qty });
        else             scartate.push({ idx, mat, qty });
    });

    const nota = (document.getElementById('pip-reso-nota')?.value || '').trim();

    const caric = _pipLoadCaric();
    righe.forEach(r => {
        caric[r.idx] = (Number(caric[r.idx] || 0)) + r.qty;
    });
    _pipSaveCaric(caric);

    righe.forEach(r => {
        const inp = document.querySelector(`#pip-tbody input[data-idx="${r.idx}"]`);
        if (inp) { inp.value = caric[r.idx]; _pipAggiornaCar(inp); }
    });

    const ts = new Date().toLocaleString('it-IT', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'});
    const movimenti = _pipLoadMov();
    const totPz = items.reduce((s, i) => s + i.qty, 0);
    movimenti.unshift({ id: Date.now(), tipo: 'reso', items, righe, scartate, nota, ts, totPz });
    _pipSaveMov(movimenti);

    _pipChiudiModalReso();
    _pipRenderMovimenti();
    _pipAggiornaLiberi();
    notificaElegante(`Reso registrato: ${totPz} pz — ${righe.length} componenti recuperati ✓`);
}

// ─── Toggle movimenti / reset ─────────────────────────────────────────────────

function _pipToggleMov(btn) {
    const body = document.getElementById('pip-mov-body');
    if (!body) return;
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? '' : 'none';
    const icon = btn.querySelector('i');
    if (icon) icon.className = hidden ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
}

/** Reset completo della pagina */
function _pipReset() {
    if (!confirm('Vuoi azzerare tutto (quantità, magazzino e movimenti)?')) return;
    _pipSaveQty({p:0, m:0, g:0});
    _pipSaveCaric({});
    _pipSaveMov([]);
    _pipSavePronti({});
    caricaPipistrelli();
}

// ─── Entry point ─────────────────────────────────────────────────────────────

/**
 * Entry point principale della sezione Pipistrelli.
 * Sostituisce caricaPaginaPipistrello() di script.js.
 * Il flag _fetched persiste finché resetPipFetch() non viene chiamato
 * (da cambiaPagina quando si lascia PIPISTRELLI).
 */
export function caricaPipistrelli() {
    if (!_fetched) {
        _fetched = true;
        _pipFetchFromServer(function(hasDati) {
            if (hasDati) caricaPipistrelli(); // _fetched=true → non rifetcha
        });
    }

    // Auto-ricostruzione: se caricato è tutto 0 ma ci sono movimenti → ricostruisco
    const _caricCheck = _pipLoadCaric();
    const _movCheck   = _pipLoadMov();
    const _tuttoZero  = Object.keys(_caricCheck).length === 0 ||
                        Object.values(_caricCheck).every(v => Number(v) === 0);
    if (_tuttoZero && _movCheck.some(m => m.tipo === 'carico' || m.tipo === 'scarico')) {
        const ricostruito = _pipRicostruisciDaMovimenti();
        if (ricostruito && Object.values(ricostruito).some(v => v > 0)) {
            try { localStorage.setItem(_PIP_LS_CARIC, JSON.stringify(ricostruito)); } catch {}
        }
    }

    const contenitore = document.getElementById('contenitore-dati');
    const qty   = _pipLoadQty();
    const caric = _pipLoadCaric();
    const imp   = _pipCalcImpegnati();

    const righeHtml = _PIP_BOM.map((row, i) => {
        const [sez, mat, xP, xM, xG] = row;
        const fab  = qty.p * xP + qty.m * xM + qty.g * xG;
        const car  = Number(caric[i] || 0);
        const impI = imp[i] || 0;
        const lib  = Math.max(0, car - impI);
        const ord  = Math.max(0, fab - car);
        const ordCls = fab === 0 ? 'pip-ord-zero' : (ord > 0 ? 'pip-ord-manca' : 'pip-ord-ok');

        const sezCell = sez
            ? `<td class="pip-sez-cell" rowspan="${_pipRowspan(i)}">${sez}</td>`
            : '';

        const coeffCells = [xP, xM, xG].map(v =>
            v > 0
                ? `<td class="pip-coeff pip-coeff-on">${v}</td>`
                : `<td class="pip-coeff pip-coeff-off">—</td>`
        ).join('');

        return `<tr data-idx="${i}" class="${sez ? 'pip-row-sez-start' : ''}">
      ${sezCell}
      <td class="pip-mat">${mat}</td>
      ${coeffCells}
      <td class="pip-fab${fab === 0 ? ' pip-fab-zero' : ''}">${fab > 0 ? fab : '—'}</td>
      <td class="pip-car-cell">
        <input class="pip-car-input" type="number" min="0" value="${car}"
               data-idx="${i}" oninput="_pipAggiornaCar(this)" onchange="_pipAggiornaCar(this)">
        <span class="pip-car-liberi"${impI > 0 ? '' : ' style="display:none"'}>${lib} lib.</span>
      </td>
      <td class="${ordCls}">${fab === 0 ? '—' : ord}</td>
    </tr>`;
    }).join('');

    const matOptions = _PIP_BOM.map((row, i) =>
        `<option value="${i}">[${row[0] || _PIP_BOM.slice(0, i).reverse().find(r => r[0])?.[ 0] || '?'}] ${row[1]}</option>`
    ).join('');

    contenitore.innerHTML = `
    <div class="pip-page">
      <!-- TITOLO -->
      <div class="pip-header">
        <div class="pip-header-title">
          <span class="pip-header-icon">🦇</span>
          <div>
            <div class="pip-header-brand">MARTINELLI LUCE</div>
            <div class="pip-header-product">Pipistrello — Pianificazione Mensile</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
          <button class="pip-reset-btn" onclick="_pipReset()" title="Reset tutto">
            <i class="fas fa-rotate-left"></i> Reset
          </button>
          <button class="pip-save-btn" id="pip-save-btn" onclick="_pipSalvaManuale()" title="Salva dati sul server">
            <i class="fas fa-cloud-arrow-up"></i> <span id="pip-save-label">Salva</span>
          </button>
        </div>
      </div>

      <!-- CARD QTÀ -->
      <div class="pip-qty-card">
        <div class="pip-qty-label">QTÀ DA PRODURRE QUESTO MESE</div>
        <div class="pip-qty-inputs">
          <div class="pip-qty-item">
            <label>🔵 Piccolo<br><small>500mA</small></label>
            <input class="pip-qty-input" id="pip-qty-p" type="number" min="0" value="${qty.p}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>🟣 Medio<br><small>600mA</small></label>
            <input class="pip-qty-input" id="pip-qty-m" type="number" min="0" value="${qty.m}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>🔴 Grande<br><small>700mA</small></label>
            <input class="pip-qty-input" id="pip-qty-g" type="number" min="0" value="${qty.g}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-total-box">
            <div class="pip-qty-total-label">TOTALE</div>
            <div class="pip-qty-total-val" id="pip-tot">${qty.p + qty.m + qty.g}</div>
          </div>
        </div>
      </div>

      <!-- TABELLA BOM -->
      <div class="pip-table-wrap">
        <table class="pip-table">
          <thead>
            <tr>
              <th>SEZIONE</th>
              <th>MATERIALE</th>
              <th class="pip-col-coeff" title="Piccolo 500mA">× P</th>
              <th class="pip-col-coeff" title="Medio 600mA">× M</th>
              <th class="pip-col-coeff" title="Grande 700mA">× G</th>
              <th>FABBISOGNO</th>
              <th>CARICATO</th>
              <th>DA ORDINARE</th>
            </tr>
          </thead>
          <tbody id="pip-tbody">
            ${righeHtml}
          </tbody>
        </table>
      </div>

      <!-- LEGENDA -->
      <div class="pip-legend">
        <span class="pip-leg-item pip-ord-manca" style="padding:2px 7px;border-radius:5px;">● mancante</span>
        <span class="pip-leg-item pip-ord-ok" style="padding:2px 7px;border-radius:5px;">● disponibile</span>
        <span class="pip-leg-item" style="color:#9ca3af">— = non necessario</span>
      </div>

      <!-- PRONTI DA SPEDIRE + SCARICO -->
      <div class="pip-assemb-card pip-pronti-card-wrap">
        <div class="pip-assemb-title"><i class="fas fa-truck"></i> PRONTI DA SPEDIRE <span class="pip-pronti-hint">— imposta le quantità e premi Registra Spedizione per scaricare i componenti</span></div>
        <div class="pip-pronti-grid" id="pip-pronti-grid"></div>
        <div class="pip-pronti-footer">
          <input type="text" id="pip-spedizione-nota" class="pip-pronti-nota-input" placeholder="Note spedizione (es. Ordine 1234, Cliente Rossi…)" maxlength="80">
          <button class="pip-assemb-btn pip-spedisci-btn" onclick="_pipScaricoTuttiPronti()">
            <i class="fas fa-truck"></i> Registra Spedizione
          </button>
        </div>
      </div>

      <!-- MOVIMENTI MAGAZZINO -->
      <div class="pip-mov-section">
        <div class="pip-mov-header">
          <div class="pip-mov-header-title">
            <i class="fas fa-boxes-stacked"></i> MOVIMENTI MAGAZZINO
          </div>
          <div class="pip-mov-header-actions">
            <button class="pip-reso-open-btn" onclick="_pipApriModalReso()">
              <i class="fas fa-rotate-left"></i> Reso
            </button>
            <button class="pip-mov-toggle-btn" onclick="_pipToggleMov(this)">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
        <div class="pip-mov-body" id="pip-mov-body">
          <!-- FORM -->
          <div class="pip-mov-form">
            <div class="pip-mov-form-field" style="grid-column:1/3">
              <label class="pip-mov-form-label">Materiale</label>
              <select id="pip-mov-mat">${matOptions}</select>
            </div>
            <div class="pip-mov-form-field">
              <label class="pip-mov-form-label">Quantità</label>
              <input type="number" id="pip-mov-qty" min="1" value="1" placeholder="0">
            </div>
            <div class="pip-mov-form-field">
              <label class="pip-mov-form-label">Note (opz.)</label>
              <input type="text" id="pip-mov-nota" placeholder="es. DDT 123…" maxlength="60">
            </div>
            <button class="pip-mov-btn-carico" onclick="_pipSalvaMovimento('carico')">
              <i class="fas fa-arrow-down"></i> Carico
            </button>
            <button class="pip-mov-btn-scarico" onclick="_pipSalvaMovimento('scarico')">
              <i class="fas fa-arrow-up"></i> Scarico
            </button>
          </div>
          <!-- LISTA -->
          <div id="pip-mov-list"></div>
        </div>
      </div>
    </div>`;

    _pipRenderMovimenti();
    _pipRenderPronti();
    applicaFade(contenitore);
}

// ─── Registrazione globali (onclick HTML) ────────────────────────────────────

export function registerGlobals() {
    window._pipAggiornaPronti      = _pipAggiornaPronti;
    window._pipSetPronti           = _pipSetPronti;
    window._pipAggiornaQty         = _pipAggiornaQty;
    window._pipAggiornaCar         = _pipAggiornaCar;
    window._pipScaricoTuttiPronti  = _pipScaricoTuttiPronti;
    window._pipAggiornaSpeWarning  = _pipAggiornaSpeWarning;
    window._pipChiudiModalSped     = _pipChiudiModalSped;
    window._pipConfermaSpedizione  = _pipConfermaSpedizione;
    window._pipSalvaMovimento      = _pipSalvaMovimento;
    window._pipEliminaMovimento    = _pipEliminaMovimento;
    window._pipModificaMovimento   = _pipModificaMovimento;
    window._pipChiudiModalEdit     = _pipChiudiModalEdit;
    window._pipConfermaModificaMov = _pipConfermaModificaMov;
    window._pipChiudiModalDel      = _pipChiudiModalDel;
    window._pipConfermaEliminaMov  = _pipConfermaEliminaMov;
    window._pipApriModalReso       = _pipApriModalReso;
    window._pipChiudiModalReso     = _pipChiudiModalReso;
    window._pipResoQtyChange       = _pipResoQtyChange;
    window._pipResoAggiornaBOM     = _pipResoAggiornaBOM;
    window._pipConfermaReso        = _pipConfermaReso;
    window._pipToggleMov           = _pipToggleMov;
    window._pipSalvaManuale        = _pipSalvaManuale;
    window._pipReset               = _pipReset;
}

export default caricaPipistrelli;
