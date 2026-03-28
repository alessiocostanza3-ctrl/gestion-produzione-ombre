// PROD — Features / Acquisti
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ../core/config.js, ../core/session.js, ../core/ui.js, ../core/revision-poller.js

import { URL_GOOGLE, CACHE_TTL_MS } from '../core/config.js';
import { utenteAttuale } from '../core/session.js';
import { notificaElegante, applicaFade, mostraConferma } from '../core/ui.js';
import RevisionPoller from '../core/revision-poller.js';

// ─── Stato interno ────────────────────────────────────────────────────────────
let carrelloLocale = [];
let _acquistTabAttivo = 'catalogo';
let sezioniMateriali = JSON.parse(localStorage.getItem('sezioniMateriali') || '["Strumenti","Bombolette","Rifiuti"]');

// ─── Cache locale (sostituisce cacheContenuti[] per questa sezione) ───────────
const _acqCache   = {};  // { 'MATERIALE DA ORDINARE': html, '_acq_ordini': html }
const _acqCacheTs = {};  // { chiave: timestamp }

// ─── Tailwind utility presets (copia identica da script.js) ──────────────────
const TW = {
    card: 'bg-white/90 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow',
    cardGrid: 'grid gap-3',
    label: 'text-[10px] uppercase tracking-wide text-slate-500 font-semibold',
    value: 'text-slate-900 font-semibold',
    btn: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] transition',
    btnPrimary: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.99] transition',
    btnSuccess: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.99] transition',
    btnWarning: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 active:scale-[0.99] transition',
    btnDanger: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.99] transition',
    btnPrimaryLg: 'inline-flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] transition shadow-sm',
    pill: 'inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600',
};

// ─── localStorage helpers (saranno consolidati in cache.js in futuro) ─────────
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
        if (str.length > 1500000) return;
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: str }));
    } catch(e) {}
}
function _lsCacheDel(key) {
    try { localStorage.removeItem(key); } catch(e) {}
}

// ─── Tiny fetch wrapper per GET JSON ─────────────────────────────────────────
function fetchJson(pagina, signal) {
    const url = URL_GOOGLE + '?pagina=' + encodeURIComponent(pagina);
    return fetch(url, signal ? { signal } : {})
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
}

/* ─── TAB ACQUISTI ────────────────────────────────────────────────────────── */

function _aggiornaTabAcquisti() {
    const tc = document.getElementById('acq-tab-catalogo');
    const to = document.getElementById('acq-tab-ordini');
    if (tc) tc.classList.toggle('active', _acquistTabAttivo === 'catalogo');
    if (to) to.classList.toggle('active', _acquistTabAttivo === 'ordini');
}

export function _switchAcquistiTab(tab) {
    _acquistTabAttivo = tab;
    _aggiornaTabAcquisti();
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    if (tab === 'ordini') {
        const _cached = _acqCache['_acq_ordini'];
        const _ts     = _acqCacheTs['_acq_ordini'] || 0;
        if (_cached && (Date.now() - _ts < CACHE_TTL_MS)) {
            contenitore.innerHTML = _cached;
            applicaFade(contenitore);
            window.aggiornaListaFiltrabili?.();
            return;
        }
        caricaOrdiniAcquisti(null, null);
    } else {
        const _cached = _acqCache['MATERIALE DA ORDINARE'];
        const _ts     = _acqCacheTs['MATERIALE DA ORDINARE'] || 0;
        if (_cached && (Date.now() - _ts < CACHE_TTL_MS)) {
            contenitore.innerHTML = _cached;
            applicaFade(contenitore);
            window.aggiornaListaFiltrabili?.();
            return;
        }
        const _lsHtml = _lsCacheGet('_html_MATERIALE DA ORDINARE', CACHE_TTL_MS);
        if (_lsHtml) {
            _acqCache['MATERIALE DA ORDINARE'] = _lsHtml;
            _acqCacheTs['MATERIALE DA ORDINARE'] = Date.now();
            contenitore.innerHTML = _lsHtml;
            applicaFade(contenitore);
            window.aggiornaListaFiltrabili?.();
            return;
        }
        caricaMateriali(false, null, null);
    }
}

/* ─── ORDINI ACQUISTI ────────────────────────────────────────────────────── */

async function caricaOrdiniAcquisti(expectedRequestId = null, signal = null) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    contenitore.innerHTML = "<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento ordini...</div>";

    const isAlessio = utenteAttuale?.nome?.toUpperCase().trim() === 'ALESSIO';
    const opParam   = isAlessio ? '' : (utenteAttuale?.nome || '');

    try {
        const res  = await fetch(`${URL_GOOGLE}?azione=getOrdiniAcquisti&operatore=${encodeURIComponent(opParam)}`);
        if (signal?.aborted) return;
        const rows = await res.json();

        if (!Array.isArray(rows) || rows.length === 0) {
            contenitore.innerHTML = `<div class='empty-msg'>${isAlessio ? 'Nessun ordine ricevuto.' : 'Non hai ancora inviato ordini.'}</div>`;
            applicaFade(contenitore);
            return;
        }

        const gruppi = {};
        rows.forEach(r => {
            const key = r.id_gruppo || (r.data + '_' + r.operatore);
            if (!gruppi[key]) gruppi[key] = { data: r.data, operatore: r.operatore, items: [] };
            gruppi[key].items.push(r);
        });

        const chiavi = Object.keys(gruppi).reverse();
        const pendingCount = rows.filter(r => r.stato !== 'ORDINATO').length;

        let html = `<div class="ordini-acq-page">
            <div class="acquisti-header header-flex">
                <div>
                    <h3 class="acquisti-title">${isAlessio ? 'Ordini Ricevuti' : 'I Miei Ordini'}</h3>
                    <p class="acquisti-subtitle">${isAlessio
                        ? (pendingCount > 0 ? `${pendingCount} articoli in attesa` : 'Tutto ordinato ✅')
                        : 'Storico ordini inviati'}</p>
                </div>
                ${isAlessio ? '' : `<button class="btn-nuovo-fisso ${TW.btnSuccess}" onclick="_switchAcquistiTab('catalogo')">
                    <i class="fas fa-cart-plus"></i><span class="btn-label-nuovo"> Nuovo ordine</span>
                </button>`}
            </div>
            <div class="ordini-groups">`;

        chiavi.forEach(key => {
            const g = gruppi[key];
            const tot = g.items.length;
            const ord = g.items.filter(i => i.stato === 'ORDINATO').length;
            const allDone = ord === tot;
            html += `
            <details class="ordine-group ${allDone ? 'all-done' : ''}" ${!allDone ? 'open' : ''}>
                <summary class="ordine-group-summary">
                    <span class="og-left">
                        ${isAlessio ? `<span class="og-operatore">${g.operatore}</span>` : ''}
                        <span class="og-data">${_fmtDataOrdine(g.data)}</span>
                        <span class="og-progress">${ord}/${tot}</span>
                        ${allDone ? '<span class="og-done-badge"><i class="fas fa-check-circle"></i> Completato</span>' : ''}
                    </span>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </summary>
                <div class="ordine-items">
                    ${g.items.map(item => _renderOrdineItem(item, isAlessio)).join('')}
                </div>
            </details>`;
        });

        html += `</div></div>`;
        _acqCache['_acq_ordini']   = html;
        _acqCacheTs['_acq_ordini'] = Date.now();
        contenitore.innerHTML = html;
        applicaFade(contenitore);
        window.aggiornaListaFiltrabili?.();
    } catch(e) {
        if (e.name === 'AbortError') return;
        contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento ordini.</div>";
    }
}

function _resizeFotoBase64(src, maxPx) {
    if (!src) return Promise.resolve(null);
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.72));
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

function _fmtDataOrdine(str) {
    try {
        const d = new Date(str);
        if (isNaN(d)) return str;
        const pad = n => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch(e) { return str; }
}

function _renderOrdineItem(item, isAlessio) {
    const ok = item.stato === 'ORDINATO';
    return `
    <div class="ordine-item ${ok ? 'is-ordinato' : ''}" id="oi-${item.id_riga}" data-search="${String(item.articolo).toLowerCase()} ${String(item.fornitore).toLowerCase()}">
        ${isAlessio
            ? `<button class="oi-check-btn ${ok ? 'checked' : ''}" onclick="_toggleOrdinato(${item.id_riga}, this)" title="${ok ? 'Segna In Attesa' : 'Segna Ordinato'}">
                <i class="fas ${ok ? 'fa-check-circle' : 'fa-circle'}"></i>
               </button>`
            : `<span class="oi-stato-dot ${ok ? 'dot-ordinato' : 'dot-attesa'}"></span>`
        }
        ${item.foto ? `<img src="${item.foto}" class="oi-thumb" alt="" loading="lazy">` : ''}
        <div class="oi-info">
            <span class="oi-nome">${item.articolo}</span>
            <span class="oi-details">Qt. ${item.quantita}${item.fornitore ? ' · ' + item.fornitore : ''}</span>
        </div>
        <span class="oi-stato-badge ${ok ? 'badge-ordinato-sm' : 'badge-attesa-sm'}">${ok ? '<i class="fas fa-circle-check"></i> ORDINATO' : 'IN ATTESA'}</span>
    </div>`;
}

async function _toggleOrdinato(idRiga, btn) {
    const row = document.getElementById('oi-' + idRiga);
    if (!row) return;
    const wasOrdinato = row.classList.contains('is-ordinato');
    const nuovoStato  = wasOrdinato ? 'IN ATTESA' : 'ORDINATO';
    btn.disabled = true;
    RevisionPoller.pauseFor(6000);
    try {
        const r = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'setArticoloOrdinato', id_riga: idRiga, stato: nuovoStato })
        }).then(x => x.json());
        if (r.status !== 'ok') throw new Error('err');

        row.classList.toggle('is-ordinato');
        btn.classList.toggle('checked');
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'fas ' + (row.classList.contains('is-ordinato') ? 'fa-check-circle' : 'fa-circle');
        const badge = row.querySelector('.oi-stato-badge');
        if (badge) {
            const ordNow = row.classList.contains('is-ordinato');
            badge.className = 'oi-stato-badge ' + (ordNow ? 'badge-ordinato-sm' : 'badge-attesa-sm');
            badge.innerHTML = ordNow ? '<i class="fas fa-circle-check"></i> ORDINATO' : 'IN ATTESA';
        }
        const dot = row.querySelector('.oi-stato-dot');
        if (dot) dot.className = 'oi-stato-dot ' + (row.classList.contains('is-ordinato') ? 'dot-ordinato' : 'dot-attesa');

        const gruppo = row.closest('.ordine-group');
        if (gruppo) {
            const allItems = gruppo.querySelectorAll('.ordine-item');
            const totG = allItems.length;
            const ordG = gruppo.querySelectorAll('.ordine-item.is-ordinato').length;
            const prog = gruppo.querySelector('.og-progress');
            if (prog) prog.textContent = ordG + '/' + totG;
            if (ordG === totG) {
                gruppo.classList.add('all-done');
                const left = gruppo.querySelector('.og-left');
                if (left && !left.querySelector('.og-done-badge')) {
                    left.insertAdjacentHTML('beforeend', '<span class="og-done-badge"><i class="fas fa-check-circle"></i> Completato</span>');
                }
            } else {
                gruppo.classList.remove('all-done');
                const db = gruppo.querySelector('.og-done-badge');
                if (db) db.remove();
            }
        }
        const sub = document.querySelector('.acquisti-subtitle');
        if (sub) {
            const allPending = document.querySelectorAll('.ordine-item:not(.is-ordinato)').length;
            sub.textContent = allPending > 0 ? `${allPending} articoli in attesa` : 'Tutto ordinato ✅';
        }
        const _cont = document.getElementById('contenitore-dati');
        if (_cont) {
            _acqCache['_acq_ordini']   = _cont.innerHTML;
            _acqCacheTs['_acq_ordini'] = Date.now();
        }
    } catch(e) {
        notificaElegante('Errore aggiornamento', 'error');
    }
    btn.disabled = false;
}

/* ─── SEZIONI CATALOGO ───────────────────────────────────────────────────── */

async function _caricaSezioniDaBackend() {
    const _cached = _lsCacheGet('_sezioniMateriali_cache', 600000);
    if (_cached) {
        try {
            const arr = typeof _cached === 'string' ? JSON.parse(_cached) : _cached;
            if (Array.isArray(arr) && arr.length > 0) { sezioniMateriali = arr; return; }
        } catch(e) {}
    }
    try {
        const res = await fetch(URL_GOOGLE + '?pagina=SEZIONI_CONFIG');
        const sezioniRemote = await res.json();
        if (Array.isArray(sezioniRemote) && sezioniRemote.length > 0) {
            sezioniMateriali = sezioniRemote;
            localStorage.setItem('sezioniMateriali', JSON.stringify(sezioniMateriali));
            _lsCacheSet('_sezioniMateriali_cache', JSON.stringify(sezioniMateriali));
        }
    } catch (e) {
        console.warn('Sezioni: fallback a localStorage', e);
    }
}

async function _salvaSezioniSuBackend() {
    _lsCacheDel('_sezioniMateriali_cache');
    try {
        await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'salvaSezioni', sezioni: sezioniMateriali })
        });
    } catch (e) {
        console.warn('Impossibile salvare sezioni sul backend', e);
    }
}

/* ─── CATALOGO MATERIALI ─────────────────────────────────────────────────── */

async function caricaMateriali(silenzioso = false, expectedRequestId = null, signal = null) {
    const isInSelectionMode = document.getElementById('btn-delete-selected')?.classList.contains('visible');
    if (silenzioso && isInSelectionMode) {
        console.log("Aggiornamento silenzioso ignorato: modalità selezione attiva.");
        return;
    }

    const modalArticolo = document.getElementById('modal-gestione-articolo');
    if (modalArticolo) modalArticolo.style.display = 'none';
    document.body.style.overflow = 'auto';

    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    if (!silenzioso) {
        contenitore.innerHTML = "<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento catalogo materiali...</div>";
        applicaFade(contenitore);
    }

    try {
        let materiali = null;
        if (window._prefetchMatBundle) {
            materiali = window._prefetchMatBundle;
            window._prefetchMatBundle = null;
            window._prefetchMatPromise = null;
        } else if (window._prefetchMatPromise) {
            materiali = await window._prefetchMatPromise;
            window._prefetchMatBundle = null;
            window._prefetchMatPromise = null;
        } else {
            materiali = await fetchJson('MATERIALE DA ORDINARE', signal);
        }
        if (!materiali) materiali = [];

        if (signal?.aborted) return;
        await _caricaSezioniDaBackend();

        materiali.forEach(item => {
            const s = (item.SEZIONE || '').trim();
            if (s && !sezioniMateriali.includes(s)) sezioniMateriali.push(s);
        });

        if (signal?.aborted) return;

        if (!materiali || materiali.length === 0) {
            contenitore.innerHTML = "<div class='empty-msg'>Nessun materiale trovato nel catalogo.</div>";
            applicaFade(contenitore);
            return;
        }

        function _iconaPerNome(nome) {
            const n = nome.toLowerCase();
            if (/strument|utensil|attrez|chiave|cacciavit|trapan|pinze|martell/.test(n)) return 'fa-screwdriver-wrench';
            if (/bombole|spray|aerosol|vernic|smalto|lacca/.test(n)) return 'fa-spray-can';
            if (/rifiut|spazzatur|scarto|smalt/.test(n)) return 'fa-trash-can';
            if (/pulizia|detersi|detergent|solvente|diluente|sgras/.test(n)) return 'fa-broom';
            if (/nastro|carta|fogli|sacch|busta|plastica/.test(n)) return 'fa-tape';
            if (/scatol|imball|cartone|pacch|box/.test(n)) return 'fa-box-open';
            if (/vite|bullone|dado|chiod|rivett|raccord/.test(n)) return 'fa-gear';
            if (/elettr|cavo|filo|led|presa|batteria/.test(n)) return 'fa-bolt';
            if (/sicurezz|protezione|guant|occhial|mascherina|elmett/.test(n)) return 'fa-shield-halved';
            if (/colori|pigment|tint|inchiostro|pennello/.test(n)) return 'fa-palette';
            if (/tessuto|stoffa|panno|tela|gomma|schiuma/.test(n)) return 'fa-layer-group';
            if (/cibo|aliment|acqua|bevand|coff/.test(n)) return 'fa-utensils';
            if (/ufficio|penna|matita|block|quadern/.test(n)) return 'fa-pen';
            if (/misura|metro|calibro|riga|squadra/.test(n)) return 'fa-ruler';
            if (/prodotto|articol|merce|stock|magazzin/.test(n)) return 'fa-boxes-stacked';
            return 'fa-folder';
        }

        const _groups = {};
        sezioniMateriali.forEach(s => { _groups[s] = []; });
        materiali.forEach((item, gi) => {
            const s = (item.SEZIONE || '').trim();
            const target = sezioniMateriali.includes(s) ? s : sezioniMateriali[0];
            _groups[target].push({ item, gi });
        });

        let html = `
            <div class="acquisti-header header-flex">
                <div>
                    <h3 class="acquisti-title">Catalogo Materiali</h3>
                    <p class="acquisti-subtitle">Gestisci o ordina i materiali.</p>
                </div>
                <div class="acquisti-actions-wrapper">
                    <button id="btn-delete-selected" type="button" onclick="eliminaSelezionati()" class="${TW.btnDanger} btn-fade-action">
                        <i class="fas fa-trash"></i><span class="btn-elimina-label"> Elimina (<span id="count-selected">0</span>)</span>
                    </button>
                    <button id="btn-mode-select" type="button" onclick="toggleSelezioneMultipla()" class="${TW.btn}">
                        <i class="fas fa-tasks"></i><span class="btn-sel-txt"> Seleziona</span>
                    </button>
                    <button type="button" class="btn-nuovo-fisso btn-sezione-new ${TW.btn}" onclick="apriModalNuovaSezione()" title="Nuova sezione">
                        <i class="fas fa-folder-plus"></i>
                    </button>
                    <button type="button" class="btn-nuovo-fisso ${TW.btnSuccess}" onclick="apriModalNuovo()">
                        <i class="fas fa-plus"></i><span class="btn-label-nuovo"> Nuovo</span>
                    </button>
                </div>
            </div>
            <div id="lista-materiali-grid">`;

        const isMobile = window.innerWidth <= 768;

        sezioniMateriali.forEach((sez, si) => {
            const sezItems = _groups[sez] || [];
            const icon = _iconaPerNome(sez);
            html += `
                <div class="sezione-materiali-wrapper">
                    <div class="sezione-header" onclick="toggleSezione('sezione-grid-${si}')">
                        <div class="sezione-header-left">
                            <i class="fas ${icon} sezione-icon"></i>
                            <span class="sezione-nome">${sez}</span>
                            <span class="sezione-count">${sezItems.length}</span>
                        </div>
                        <div class="sezione-header-right">
                            <button type="button" class="btn-sezione-edit" title="Rinomina sezione" onclick="event.stopPropagation(); apriModalRinominaSezione('${sez}')"><i class="fas fa-pen"></i></button>
                            <i class="fas fa-chevron-down sezione-arrow"${isMobile ? ' style="transform:rotate(-90deg)"' : ''}></i>
                        </div>
                    </div>
                    <div class="sezione-grid materiali-grid" id="sezione-grid-${si}" data-sezione="${sez}"${isMobile ? ' style="display:none"' : ''}>`;

            if (sezItems.length === 0) {
                html += `<p class="sezione-empty">Nessun articolo. Usa <b>Sezione</b> dal menu ⋮ per spostare qui un articolo.</p>`;
            }

            sezItems.forEach(({ item, gi: index }) => {
                const nomeProdotto = (item.OGGETTO || "Senza nome").replace(/"/g, '&quot;');
                const fornitore    = (item.FORNITORE || "Generico").replace(/"/g, '&quot;');
                const codice       = (item.CODICE || "").replace(/"/g, '&quot;');
                const qtyId        = `qty-item-${index}`;
                const idRiga       = item.id_riga;
                const nomePulitoJS = nomeProdotto.replace(/'/g, "\\'").replace(/"/g, '&quot;');

                html += `
                <div class="materiale-card ${TW.card}" data-idx="${index}" data-search="${(nomeProdotto + ' ' + fornitore + ' ' + codice).toLowerCase().replace(/"/g, '')}">
                    <div class="mat-card-img img-preview-container"
                         data-prod="${nomeProdotto}"
                         data-fornitore="${fornitore}"
                         onclick="scattaFoto('${nomePulitoJS}')">
                        <i class="fas fa-camera mat-img-icon"></i>
                        <span class="mat-img-hint">Scatta foto</span>
                        <span class="mat-badge-fornitore">${fornitore}</span>
                    </div>
                    <div class="materiale-info">
                        <div class="materiale-nome">${nomeProdotto}</div>
                        ${codice ? `<div class="materiale-codice">${codice}</div>` : ''}
                        <div class="materiale-fornitore mat-fornitore-mobile">${fornitore}</div>
                    </div>
                    <div class="materiale-actions">
                        <div class="qty-order-container">
                            <button type="button" class="btn-qty-step" onclick="cambiaQty('${qtyId}', -1)"><i class="fas fa-minus"></i></button>
                            <input type="number" value="1" min="1" id="${qtyId}">
                            <button type="button" class="btn-qty-step" onclick="cambiaQty('${qtyId}', 1)"><i class="fas fa-plus"></i></button>
                        </div>
                        <button type="button" class="btn-add-cart" onclick="aggiungiAlCarrello(\`${nomeProdotto}\`, \`${fornitore}\`, '${qtyId}')" title="Aggiungi al carrello">
                            <i class="fas fa-cart-plus"></i><span class="btn-cart-txt"> Aggiungi</span>
                        </button>
                    </div>
                    <div class="mat-card-opts">
                        <input type="checkbox" class="select-materiale mat-sel-chk" data-id="${idRiga}" onclick="aggiornaConteggioSelezionati()">
                        <button type="button" onclick="toggleMenuOpzioni(event, ${index})" class="btn-opt-trigger">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div id="menu-opzioni-${index}" class="menu-popup-opzioni">
                            <button type="button" class="menu-item-opt" onclick="apriModalModifica('${idRiga}', \`${nomeProdotto}\`, \`${fornitore}\`, \`${codice}\`)"><i class="fas fa-edit"></i> Modifica</button>
                            <button type="button" class="menu-item-opt" onclick="duplicaArticolo('${idRiga}', \`${nomeProdotto}\`, \`${fornitore}\`, \`${codice}\`)"><i class="fas fa-copy"></i> Duplica</button>
                            <button type="button" class="menu-item-opt" onclick="apriModalSpostaSezione('${idRiga}')"><i class="fas fa-folder-open"></i> Sezione</button>
                            <button type="button" class="menu-item-opt btn-menu-elimina-foto" style="display:none" onclick="resetFoto('${nomePulitoJS}')"><i class="fas fa-image"></i> Elimina foto</button>
                            <button type="button" class="menu-item-opt text-danger" onclick="eliminaArticolo('${idRiga}')"><i class="fas fa-trash"></i> Elimina</button>
                        </div>
                    </div>
                </div>`;
            });

            html += `
                    </div>
                </div>`;
        });

        html += `</div>`;
        _acqCache['MATERIALE DA ORDINARE']   = html;
        _acqCacheTs['MATERIALE DA ORDINARE'] = Date.now();
        _lsCacheSet('_html_MATERIALE DA ORDINARE', html);
        contenitore.innerHTML = html;
        applicaFade(contenitore);
        window.aggiornaListaFiltrabili?.();

    } catch (e) {
        if (e.name === 'AbortError') return;
        console.error("Errore caricamento materiali:", e);
        if (contenitore) {
            contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento del catalogo.</div>";
            applicaFade(contenitore);
        }
    }
}

/* ─── CARRELLO ───────────────────────────────────────────────────────────── */

function cambiaQty(inputId, delta) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.value = Math.max(1, (parseInt(el.value) || 1) + delta);
}

function aggiungiAlCarrello(nome, fornitore, inputId) {
    const qtyInput = document.getElementById(inputId);
    const qty = parseInt(qtyInput.value) || 1;
    const container = document.querySelector(`[data-prod="${nome}"]`);
    const imgPreview = container ? container.querySelector('img') : null;
    const fotoBase64 = imgPreview ? imgPreview.src : null;

    carrelloLocale.push({ prodotto: nome, quantita: qty, fornitore, foto: fotoBase64 });
    aggiornaBadgeCarrello();

    const btn = event.target.closest('button');
    const testoOriginale = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
    btn.style.boxShadow = '0 2px 8px rgba(16,185,129,0.45)';
    setTimeout(() => {
        btn.innerHTML = testoOriginale;
        btn.style.background = '';
        btn.style.boxShadow = '';
        qtyInput.value = 1;
    }, 1400);
}

function toggleMostraCarrello() {
    const modal   = document.getElementById('modal-carrello');
    const lista   = document.getElementById('lista-articoli-carrello');
    const btnInvia = document.getElementById('btn-invia-alessio');

    if (carrelloLocale.length === 0) {
        lista.innerHTML = "<p class='empty-cart-msg'>Il tuo carrello è vuoto.</p>";
        if (btnInvia) btnInvia.style.display = 'none';
    } else {
        lista.innerHTML = carrelloLocale.map((item, index) => `
            <div class="cart-item-row">
                ${item.foto ? `<img src="${item.foto}" class="cart-item-photo">` : `<div class="cart-item-placeholder"><i class="fas fa-shopping-basket cart-item-icon"></i></div>`}
                <div class="flex-grow">
                    <div class="cart-item-name">${item.prodotto}</div>
                    <div class="cart-item-details">Qt: ${item.quantita} - ${item.fornitore}</div>
                </div>
                <button onclick="rimuoviDalCarrello(${index})" class="btn-inline-trash"><i class="fas fa-trash"></i></button>
            </div>`).join('');
        if (btnInvia) btnInvia.style.display = 'block';
    }
    modal.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('cart-open')));
}

function rimuoviDalCarrello(index) {
    carrelloLocale.splice(index, 1);
    aggiornaBadgeCarrello();
    toggleMostraCarrello();
}

function chiudiModalCarrello() {
    const modal = document.getElementById('modal-carrello');
    modal.classList.remove('cart-open');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

function apriModalCarrello() { toggleMostraCarrello(); }

export function aggiornaBadgeCarrello() {
    const count = carrelloLocale.length;
    const b1 = document.getElementById('badge-carrello-count');
    const b2 = document.getElementById('cart-qty-val');
    if (b1) { b1.innerText = count; b1.style.display = count > 0 ? 'flex' : 'none'; }
    if (b2) b2.innerText = count;
}

async function inviaOrdineAcquisti() {
    if (carrelloLocale.length === 0) { alert("Il carrello è vuoto!"); return; }
    const conferma = confirm(`Vuoi inviare la lista di ${carrelloLocale.length} articoli all'ufficio acquisti?`);
    if (!conferma) return;

    RevisionPoller.pauseFor(6000);
    const btnInvia = document.getElementById('btn-invia-alessio');
    if (btnInvia) { btnInvia.disabled = true; btnInvia.innerText = 'Invio in corso...'; }

    const idGruppo = String(Date.now());
    try {
        const articoliConFoto = await Promise.all(carrelloLocale.map(async art => ({
            ...art,
            foto: await _resizeFotoBase64(art.foto, 80)
        })));
        const payload = {
            azione: 'inviaOrdineAcquisti',
            operatore: utenteAttuale?.nome || 'Utente',
            id_gruppo: idGruppo,
            articoli: articoliConFoto
        };
        const res = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) });
        const result = await res.json();

        if (result.status === 'success') {
            carrelloLocale = [];
            aggiornaBadgeCarrello();
            chiudiModalCarrello();
            notificaElegante('✅ Ordine inviato ad Alessio!');
            delete _acqCache['_acq_ordini'];
            delete _acqCacheTs['_acq_ordini'];
            _lsCacheDel('_html__acq_ordini');
            _acquistTabAttivo = 'ordini';
            setTimeout(() => window.cambiaPagina?.('MATERIALE DA ORDINARE', null), 800);
        } else {
            throw new Error(result.message);
        }
    } catch (e) {
        notificaElegante('Errore invio ordine: ' + e.message, 'error');
    } finally {
        if (btnInvia) { btnInvia.disabled = false; btnInvia.innerText = 'Invia ad Alessio'; }
    }
}

/* ─── FOTO PRODOTTO ──────────────────────────────────────────────────────── */

function scattaFoto(nomeProdotto) {
    const selettore = `[data-prod="${nomeProdotto.replace(/"/g, '\\"')}"]`;
    const container = document.querySelector(selettore);
    if (!container) return;
    if (container.querySelector('img')) {
        apriImmagineIntera(container.querySelector('img').src);
        return;
    }
    const input = document.createElement('input');
    input.type  = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = event => {
            const base64String = event.target.result;
            const fornitore = container.getAttribute('data-fornitore') || '';
            container.innerHTML = `
                <img src="${base64String}"
                     class="modal-img"
                     onclick="event.stopPropagation(); apriImmagineIntera('${base64String}')">
                ${fornitore ? `<span class="mat-badge-fornitore">${fornitore}</span>` : ''}`;
            container.style.border = '';
            const card = container.closest('.materiale-card');
            if (card) {
                const btnFoto = card.querySelector('.btn-menu-elimina-foto');
                if (btnFoto) btnFoto.style.display = '';
            }
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function resetFoto(nomeProdotto) {
    if (confirm("Vuoi rimuovere l'immagine da questo prodotto?")) {
        const container = document.querySelector(`[data-prod="${nomeProdotto}"]`);
        if (!container) return;
        const fornitore = container.getAttribute('data-fornitore') || '';
        container.innerHTML = `
            <i class="fas fa-camera mat-img-icon"></i>
            <span class="mat-img-hint">Scatta foto</span>
            ${fornitore ? `<span class="mat-badge-fornitore">${fornitore}</span>` : ''}`;
        container.style.border = '';
        const card = container.closest('.materiale-card');
        if (card) {
            const btnFoto = card.querySelector('.btn-menu-elimina-foto');
            if (btnFoto) btnFoto.style.display = 'none';
        }
    }
}

function apriImmagineIntera(src) {
    const overlay = document.createElement('div');
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:200000;display:flex;justify-content:center;align-items:center;cursor:zoom-out;";
    overlay.innerHTML = `<img src="${src}" class="overlay-img">`;
    overlay.onclick = () => document.body.removeChild(overlay);
    document.body.appendChild(overlay);
}

/* ─── MENU OPZIONI CARD ──────────────────────────────────────────────────── */

function toggleMenuOpzioni(event, index) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelectorAll('.menu-popup-opzioni').forEach(m => {
        if (m.id !== `menu-opzioni-${index}`) m.classList.remove('open');
    });
    const menu = document.getElementById(`menu-opzioni-${index}`);
    if (menu) menu.classList.toggle('open');
}

document.addEventListener('click', () => {
    document.querySelectorAll('.menu-popup-opzioni.open').forEach(m => m.classList.remove('open'));
});

/* ─── MODAL ARTICOLO ─────────────────────────────────────────────────────── */

function apriModalNuovo() {
    document.getElementById('titolo-modal-articolo').innerText = "Nuovo Articolo";
    document.getElementById('edit-id-riga').value    = "";
    document.getElementById('edit-nome').value       = "";
    document.getElementById('edit-codice').value     = "";
    document.getElementById('edit-fornitore').value  = "";
    const modal = document.getElementById('modal-gestione-articolo');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function apriModalModifica(id, nome, fornitore, codice) {
    const modal = document.getElementById('modal-gestione-articolo');
    document.getElementById('titolo-modal-articolo').innerText = id ? "Modifica Articolo" : "Nuovo Articolo";
    document.getElementById('edit-id-riga').value   = id || "";
    document.getElementById('edit-nome').value      = nome || "";
    document.getElementById('edit-codice').value    = (codice && codice !== 'undefined') ? codice : "";
    document.getElementById('edit-fornitore').value = fornitore || "";
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function chiudiModalArticolo() {
    const modal = document.getElementById('modal-gestione-articolo');
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

async function salvaArticolo() {
    const btn  = document.getElementById('btn-salva-articolo');
    const nome = document.getElementById('edit-nome').value.trim();
    if (!nome) return alert("Inserisci il nome!");
    RevisionPoller.pauseFor(6000);
    const payload = {
        azione: "gestisciMateriale",
        id_riga:   document.getElementById('edit-id-riga').value,
        nome,
        codice:    document.getElementById('edit-codice').value,
        fornitore: document.getElementById('edit-fornitore').value
    };
    btn.innerText = "Salvataggio...";
    btn.disabled  = true;
    try {
        const res = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) });
        const r   = await res.json();
        if (r && r.status === 'auth_error') { window._gestisciAuthError_?.(r.message); return; }
        if (r.status === "success") {
            chiudiModalArticolo();
            caricaMateriali();
        }
    } catch (e) {
        alert("Errore salvataggio!");
    } finally {
        btn.innerText = "Salva";
        btn.disabled  = false;
    }
}

async function duplicaArticolo(idRiga, nome, fornitore, codice) {
    mostraConferma('Duplica Articolo', `Duplicare l'articolo: "${nome}"?`, async () => {
        RevisionPoller.pauseFor(6000);
        const cardOriginale = document.querySelector(`[data-id="${idRiga}"]`).closest('.materiale-card');
        const tempIndex = Date.now();
        const qtyId     = `qty-item-temp-${tempIndex}`;

        const divScatola = document.createElement('div');
        divScatola.innerHTML = `
            <div class="materiale-card ${TW.card}">
                <div class="mat-card-img img-preview-container"
                     data-prod="${nome}" data-fornitore="${fornitore}"
                     onclick="scattaFoto('${nome.replace(/'/g, "\\'")}')">
                    <i class="fas fa-camera mat-img-icon"></i>
                    <span class="mat-img-hint">Scatta foto</span>
                    <span class="mat-badge-fornitore">${fornitore}</span>
                </div>
                <div class="materiale-info">
                    <div class="materiale-nome">${nome}</div>
                    ${codice ? `<div class="materiale-codice">${codice}</div>` : ''}
                    <div class="materiale-fornitore mat-fornitore-mobile">${fornitore}</div>
                </div>
                <div class="materiale-actions">
                    <div class="qty-order-container">
                        <button type="button" class="btn-qty-step" onclick="cambiaQty('${qtyId}', -1)"><i class="fas fa-minus"></i></button>
                        <input type="number" value="1" min="1" id="${qtyId}">
                        <button type="button" class="btn-qty-step" onclick="cambiaQty('${qtyId}', 1)"><i class="fas fa-plus"></i></button>
                    </div>
                    <button type="button" class="btn-add-cart" onclick="aggiungiAlCarrello(\`${nome}\`, \`${fornitore}\`, '${qtyId}')" title="Aggiungi al carrello">
                        <i class="fas fa-cart-plus"></i><span class="btn-cart-txt"> Aggiungi</span>
                    </button>
                </div>
                <div class="mat-card-opts">
                    <input type="checkbox" class="select-materiale mat-sel-chk" data-id="temp" onclick="aggiornaConteggioSelezionati()">
                    <button type="button" class="btn-opt-trigger" onclick="toggleMenuOpzioni(event, 'temp-${tempIndex}')">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div id="menu-opzioni-temp-${tempIndex}" class="menu-popup-opzioni">
                        <button type="button" class="menu-item-opt" onclick="apriModalModifica('', \`${nome}\`, \`${fornitore}\`, \`${codice}\`)">
                            <i class="fas fa-edit"></i> Modifica
                        </button>
                        <button type="button" class="menu-item-opt" onclick="duplicaArticolo('temp', \`${nome}\`, \`${fornitore}\`, \`${codice}\`)">
                            <i class="fas fa-copy"></i> Duplica
                        </button>
                        <button type="button" class="menu-item-opt btn-menu-elimina-foto" style="display:none" onclick="resetFoto('${nome.replace(/'/g, "\\'")}')">
                            <i class="fas fa-image"></i> Elimina foto
                        </button>
                        <button type="button" class="menu-item-opt text-danger" onclick="this.closest('.materiale-card').remove()">
                            <i class="fas fa-trash"></i> Elimina
                        </button>
                    </div>
                </div>
            </div>`;

        const nuovaCard = divScatola.firstElementChild;
        nuovaCard.style.opacity   = '0';
        nuovaCard.style.transform = 'translateY(-10px)';
        cardOriginale.after(nuovaCard);
        requestAnimationFrame(() => {
            nuovaCard.style.transition = 'opacity 0.3s, transform 0.3s';
            nuovaCard.style.opacity    = '1';
            nuovaCard.style.transform  = 'translateY(0)';
        });

        try {
            const res = await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: "duplicaMateriale", id_riga: idRiga, nome, codice, fornitore })
            });
            const r = await res.json();
            if (r.status === "success") caricaMateriali(true);
        } catch (e) {
            nuovaCard.style.border = "1px solid red";
            notificaElegante('Errore di sincronizzazione.', 'error');
        }
    }, 'Duplica');
}

/* ─── GESTIONE SEZIONI ───────────────────────────────────────────────────── */

function toggleSezione(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const isOpen = grid.style.display !== 'none';
    grid.style.display = isOpen ? 'none' : '';
    const wrapper = grid.closest('.sezione-materiali-wrapper');
    const arrow   = wrapper?.querySelector('.sezione-arrow');
    if (arrow) arrow.style.transform = isOpen ? 'rotate(-90deg)' : '';
}

function apriModalSpostaSezione(idRiga) {
    document.querySelectorAll('.menu-popup-opzioni.open').forEach(m => m.classList.remove('open'));
    const sel = document.getElementById('sposta-sezione-select');
    sel.innerHTML = sezioniMateriali.map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById('sposta-id-riga').value = idRiga;
    const modal = document.getElementById('modal-sposta-sezione');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function chiudiModalSpostaSezione() {
    const modal = document.getElementById('modal-sposta-sezione');
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

async function confermaSpostaSezione() {
    const idRiga  = document.getElementById('sposta-id-riga').value;
    const sezione = document.getElementById('sposta-sezione-select').value;
    chiudiModalSpostaSezione();
    RevisionPoller.pauseFor(6000);
    try {
        await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'spostaSezione', id_riga: idRiga, sezione }) });
        delete _acqCache['MATERIALE DA ORDINARE'];
        _lsCacheDel('_html_MATERIALE DA ORDINARE');
        caricaMateriali(false);
    } catch (e) { notificaElegante('Errore durante lo spostamento.', 'error'); }
}

function apriModalRinominaSezione(nomeVecchio) {
    document.getElementById('rinomina-sezione-nome').value  = nomeVecchio;
    document.getElementById('rinomina-sezione-vecchio').value = nomeVecchio;
    const modal = document.getElementById('modal-rinomina-sezione');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    setTimeout(() => { const inp = document.getElementById('rinomina-sezione-nome'); if (inp) { inp.focus(); inp.select(); } }, 100);
}

function chiudiModalRinominaSezione() {
    const modal = document.getElementById('modal-rinomina-sezione');
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

async function confermaRinominaSezione() {
    const nuovoNome   = document.getElementById('rinomina-sezione-nome').value.trim();
    const vecchioNome = document.getElementById('rinomina-sezione-vecchio').value;
    if (!nuovoNome || nuovoNome === vecchioNome) { chiudiModalRinominaSezione(); return; }
    if (sezioniMateriali.includes(nuovoNome)) { notificaElegante('Esiste già una sezione con questo nome.', 'error'); return; }
    chiudiModalRinominaSezione();
    RevisionPoller.pauseFor(6000);
    sezioniMateriali = sezioniMateriali.map(s => s === vecchioNome ? nuovoNome : s);
    localStorage.setItem('sezioniMateriali', JSON.stringify(sezioniMateriali));
    try {
        await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'rinominaSezione', vecchioNome, nuovoNome }) });
        delete _acqCache['MATERIALE DA ORDINARE'];
        _lsCacheDel('_html_MATERIALE DA ORDINARE');
        caricaMateriali(false);
        notificaElegante(`Sezione rinominata in "${nuovoNome}"`, 'success');
    } catch (e) { notificaElegante('Errore durante il salvataggio.', 'error'); }
}

function apriModalNuovaSezione() {
    document.getElementById('nuova-sezione-nome').value = '';
    const modal = document.getElementById('modal-nuova-sezione');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    setTimeout(() => document.getElementById('nuova-sezione-nome')?.focus(), 100);
}

function chiudiModalNuovaSezione() {
    const modal = document.getElementById('modal-nuova-sezione');
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

function confermaNuovaSezione() {
    const nome = document.getElementById('nuova-sezione-nome').value.trim();
    if (!nome) return;
    if (!sezioniMateriali.includes(nome)) {
        sezioniMateriali = [...sezioniMateriali, nome];
        localStorage.setItem('sezioniMateriali', JSON.stringify(sezioniMateriali));
        _salvaSezioniSuBackend();
    }
    chiudiModalNuovaSezione();
    delete _acqCache['MATERIALE DA ORDINARE'];
    _lsCacheDel('_html_MATERIALE DA ORDINARE');
    caricaMateriali(false);
}

/* ─── SELEZIONE MULTIPLA ─────────────────────────────────────────────────── */

function toggleSelezioneMultipla() {
    const grid      = document.getElementById('lista-materiali-grid');
    const btnElimina = document.getElementById('btn-delete-selected');
    const btn       = document.getElementById('btn-mode-select');
    if (!grid) return;
    const isOn = grid.classList.toggle('grid-sel-mode');
    grid.querySelectorAll('.mat-sel-chk').forEach(c => { c.checked = false; });
    if (btnElimina) btnElimina.classList.remove('visible');
    if (btn) btn.innerHTML = isOn
        ? '<i class="fas fa-times"></i> <span class="btn-txt">Annulla</span>'
        : '<i class="fas fa-tasks"></i> <span class="btn-txt">Seleziona</span>';
    const counter = document.getElementById('count-selected');
    if (counter) counter.innerText = '0';
}

function aggiornaConteggioSelezionati() {
    const selezionati = document.querySelectorAll('.mat-sel-chk:checked').length;
    const btnElimina  = document.getElementById('btn-delete-selected');
    document.getElementById('count-selected').innerText = selezionati;
    if (selezionati > 0) btnElimina.classList.add('visible');
    else btnElimina.classList.remove('visible');
}

async function eliminaArticolo(idRiga) {
    mostraConferma('Elimina Articolo', 'Eliminare definitivamente questo articolo dal catalogo?', async () => {
        RevisionPoller.pauseFor(6000);
        const card = document.querySelector(`[data-id="${idRiga}"]`).closest('.materiale-card');
        card.style.transition = "all 0.3s ease";
        card.style.transform  = "scale(0.8)";
        card.style.opacity    = "0";
        setTimeout(() => card.style.display = "none", 300);
        try {
            const res = await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: "eliminaMateriale", id_riga: idRiga })
            });
            const r = await res.json();
            if (r && r.status === 'auth_error') { window._gestisciAuthError_?.(r.message); return; }
            if (r.status !== "success") throw new Error();
            caricaMateriali(true);
        } catch (e) {
            card.style.display   = "flex";
            card.style.opacity   = "1";
            card.style.transform = "";
            notificaElegante("Errore durante l'eliminazione.", 'error');
        }
    }, 'Elimina');
}

async function eliminaSelezionati() {
    const checkboxes  = document.querySelectorAll('.mat-sel-chk:checked');
    const selezionati = Array.from(checkboxes)
                             .map(c => c.getAttribute('data-id'))
                             .filter(id => id && id !== "temp" && id !== "null");

    if (selezionati.length === 0) {
        alert("Nessun articolo valido selezionato. Attendi il salvataggio dei nuovi duplicati prima di eliminarli.");
        return;
    }
    if (!confirm(`Sei sicuro di voler eliminare ${selezionati.length} articoli?`)) return;

    try {
        checkboxes.forEach(cb => {
            const card = cb.closest('.materiale-card');
            if (card) { card.style.opacity = "0.3"; card.style.pointerEvents = "none"; }
        });
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: "eliminaMateriale", id_riga: selezionati })
        });
        const r = await res.json();
        if (r && r.status === 'auth_error') { window._gestisciAuthError_?.(r.message); return; }
        if (r.status === "success") {
            notificaElegante("Articoli eliminati con successo");
            const btnDelete = document.getElementById('btn-delete-selected');
            if (btnDelete) btnDelete.classList.remove('visible');
            caricaMateriali(false);
        } else {
            throw new Error(r.message);
        }
    } catch (e) {
        alert("Errore durante l'eliminazione multipla: " + e.message);
        caricaMateriali(true);
    }
}

/* ─── ENTRY POINT PUBBLICO ───────────────────────────────────────────────── */

/**
 * Carica la sezione Acquisti (catalogo o ordini).
 * Chiamato da cambiaPagina() in script.js in sostituzione di caricaMateriali / caricaOrdiniAcquisti.
 * @param {string|null}  tab                'catalogo' | 'ordini' | null (= usa tab corrente)
 * @param {number|null}  expectedRequestId  Guard anti-stale da cambiaPagina
 * @param {AbortSignal|null} signal         AbortSignal dal navController di cambiaPagina
 */
export async function caricaAcquisti(tab = null, expectedRequestId = null, signal = null) {
    if (tab !== null) _acquistTabAttivo = tab;
    _aggiornaTabAcquisti();
    if (_acquistTabAttivo === 'ordini') {
        await caricaOrdiniAcquisti(expectedRequestId, signal);
    } else {
        await caricaMateriali(false, expectedRequestId, signal);
    }
}

/* ─── REGISTRAZIONE WINDOW GLOBALS ──────────────────────────────────────── */

export function registerGlobals() {
    window.caricaAcquisti               = caricaAcquisti;
    window._switchAcquistiTab           = _switchAcquistiTab;
    window._aggiornaTabAcquisti         = _aggiornaTabAcquisti;
    window._toggleOrdinato              = _toggleOrdinato;
    window.aggiornaBadgeCarrello        = aggiornaBadgeCarrello;
    window.apriModalCarrello            = apriModalCarrello;
    window.chiudiModalCarrello          = chiudiModalCarrello;
    window.rimuoviDalCarrello           = rimuoviDalCarrello;
    window.toggleMostraCarrello         = toggleMostraCarrello;
    window.inviaOrdineAcquisti          = inviaOrdineAcquisti;
    window.cambiaQty                    = cambiaQty;
    window.aggiungiAlCarrello           = aggiungiAlCarrello;
    window.scattaFoto                   = scattaFoto;
    window.resetFoto                    = resetFoto;
    window.apriImmagineIntera           = apriImmagineIntera;
    window.toggleMenuOpzioni            = toggleMenuOpzioni;
    window.apriModalNuovo               = apriModalNuovo;
    window.apriModalModifica            = apriModalModifica;
    window.chiudiModalArticolo          = chiudiModalArticolo;
    window.salvaArticolo                = salvaArticolo;
    window.duplicaArticolo              = duplicaArticolo;
    window.toggleSezione                = toggleSezione;
    window.apriModalSpostaSezione       = apriModalSpostaSezione;
    window.chiudiModalSpostaSezione     = chiudiModalSpostaSezione;
    window.confermaSpostaSezione        = confermaSpostaSezione;
    window.apriModalRinominaSezione     = apriModalRinominaSezione;
    window.chiudiModalRinominaSezione   = chiudiModalRinominaSezione;
    window.confermaRinominaSezione      = confermaRinominaSezione;
    window.apriModalNuovaSezione        = apriModalNuovaSezione;
    window.chiudiModalNuovaSezione      = chiudiModalNuovaSezione;
    window.confermaNuovaSezione         = confermaNuovaSezione;
    window.toggleSelezioneMultipla      = toggleSelezioneMultipla;
    window.aggiornaConteggioSelezionati = aggiornaConteggioSelezionati;
    window.eliminaArticolo              = eliminaArticolo;
    window.eliminaSelezionati           = eliminaSelezionati;
}

export default caricaAcquisti;
