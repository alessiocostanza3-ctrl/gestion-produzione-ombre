// PROD — Features / Impostazioni
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ../core/config.js, ../core/cache.js, ../core/session.js, ../core/ui.js, ../core/revision-poller.js

import { URL_GOOGLE, POSTAZIONI } from '../core/config.js';
import ProdCache from '../core/cache.js';
import { utenteAttuale } from '../core/session.js';
import { notificaElegante, applicaFade, mostraConferma, _esc } from '../core/ui.js';
import RevisionPoller from '../core/revision-poller.js';
import { lsCacheGet as _lsCacheGet, lsCacheSet as _lsCacheSet, lsCacheDel as _lsCacheDel } from '../core/ls-cache.js';

// ─── localStorage helpers (→ modules/core/ls-cache.js) ──────────────────────

// ─── Helper: hashSHA256 (definita in script.js) ─────────────────────────────
function _hashSHA256(text) { return window.hashSHA256(text); }

// ═══════════════════════════════════════════════════════════════════════════════
//  AVATAR EDITOR — Desktop + Mobile
// ═══════════════════════════════════════════════════════════════════════════════

// _avatarEditTarget: null = nuovo custom | {type:'custom', idx:N} | {type:'predefined', color:'#xxx'}
let _avatarEditTarget = null;

function _avatarCustomKey()  { if (!utenteAttuale?.nome) return null; return 'avatarColorRecenti_' + utenteAttuale.nome.toUpperCase().trim(); }
function _avatarHiddenKey()  { if (!utenteAttuale?.nome) return null; return 'avatarColorHidden_'  + utenteAttuale.nome.toUpperCase().trim(); }

function _avatarLoadRecenti() { const k = _avatarCustomKey(); if (!k) return []; try { return JSON.parse(localStorage.getItem(k)||'[]'); } catch { return []; } }
function _avatarSaveRecenti(l){ const k = _avatarCustomKey(); if (!k) return; try { localStorage.setItem(k, JSON.stringify(l.slice(0,7))); } catch {} }
function _avatarLoadHidden()  { const k = _avatarHiddenKey();  if (!k) return []; try { return JSON.parse(localStorage.getItem(k)||'[]'); } catch { return []; } }
function _avatarSaveHidden(l) { const k = _avatarHiddenKey();  if (!k) return; try { localStorage.setItem(k, JSON.stringify(l)); } catch {} }

function _renderPredefinedSwatches() {
    const container = document.getElementById('avatar-predefined-swatches');
    if (!container) return;
    const hidden = _avatarLoadHidden();
    container.innerHTML = '';
    (window._PREDEFINED_AVATAR_COLORS || []).forEach(color => {
        if (hidden.includes(color)) return;
        const btn = document.createElement('button');
        btn.className = 'avatar-color-swatch';
        btn.style.background = color;
        btn.dataset.color = color;
        btn.title = 'Clicca per applicare o eliminare';
        btn.onclick = (e) => { e.stopPropagation(); _avatarEditPredefined(color, e); };
        container.appendChild(btn);
    });
}

function _renderCustomSwatches() {
    const ids = ['avatar-custom-swatches', 'avatar-custom-swatches-mob'];
    const recenti = _avatarLoadRecenti();
    ids.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const isMob = containerId.endsWith('-mob');
        container.innerHTML = '';
        recenti.forEach((color, idx) => {
            const btn = document.createElement('button');
            btn.className = 'avatar-color-swatch avatar-color-custom-swatch';
            btn.style.background = color;
            btn.dataset.color = color;
            btn.title = 'Clicca per modificare o eliminare';
            btn.onclick = isMob
                ? (e) => { e.stopPropagation(); _avatarEditCustomMob(idx, e); }
                : (e) => { e.stopPropagation(); _avatarEditCustom(idx, e); };
            container.appendChild(btn);
        });
    });
}

function _avatarShowEditor(color, showDelete) {
    const ed  = document.getElementById('avatar-color-editor');
    const inp = document.getElementById('avatar-color-edit-input');
    const del = document.getElementById('avatar-editor-delete');
    if (!ed || !inp) return;
    inp.value = color || '#ff0000';
    if (del) del.style.display = showDelete ? '' : 'none';
    ed.style.display = 'flex';
}
function _avatarHideEditor() {
    const ed = document.getElementById('avatar-color-editor');
    if (ed) ed.style.display = 'none';
    _avatarEditTarget = null;
}
function _avatarStartAdd(e) {
    if (e) e.stopPropagation();
    _avatarEditTarget = null;
    _avatarShowEditor('#ff0000', false);
}
function _avatarEditCustom(idx, e) {
    if (e) e.stopPropagation();
    const recenti = _avatarLoadRecenti();
    _avatarEditTarget = { type: 'custom', idx };
    _avatarShowEditor(recenti[idx] || '#ff0000', true);
}
function _avatarEditPredefined(color, e) {
    if (e) e.stopPropagation();
    _avatarEditTarget = { type: 'predefined', color };
    _avatarShowEditor(color, true);
}
function _avatarConfirmEdit(e) {
    if (e) e.stopPropagation();
    const inp = document.getElementById('avatar-color-edit-input');
    if (!inp) return;
    const color = inp.value;
    if (_avatarEditTarget === null) {
        const recenti = _avatarLoadRecenti();
        recenti.unshift(color);
        _avatarSaveRecenti(recenti);
        _renderCustomSwatches();
    } else if (_avatarEditTarget.type === 'custom') {
        const recenti = _avatarLoadRecenti();
        recenti[_avatarEditTarget.idx] = color;
        _avatarSaveRecenti(recenti);
        _renderCustomSwatches();
    }
    _avatarHideEditor();
    _setAvatarColor(color);
}
function _avatarCancelEdit(e) {
    if (e) e.stopPropagation();
    _avatarHideEditor();
}
function _avatarDeleteEdit(e) {
    if (e) e.stopPropagation();
    if (!_avatarEditTarget) return;
    if (_avatarEditTarget.type === 'custom') {
        const recenti = _avatarLoadRecenti();
        recenti.splice(_avatarEditTarget.idx, 1);
        _avatarSaveRecenti(recenti);
        _renderCustomSwatches();
    } else if (_avatarEditTarget.type === 'predefined') {
        const hidden = _avatarLoadHidden();
        if (!hidden.includes(_avatarEditTarget.color)) hidden.push(_avatarEditTarget.color);
        _avatarSaveHidden(hidden);
        _renderPredefinedSwatches();
    }
    _avatarHideEditor();
}
function _avatarRipristinaPredefiniti(e) {
    if (e) e.stopPropagation();
    _avatarSaveHidden([]);
    _renderPredefinedSwatches();
}

/* ── Editor colore avatar MOBILE (usa IDs con suffisso -mob) ── */
function _avatarShowEditorMob(color, showDelete) {
    const ed  = document.getElementById('avatar-color-editor-mob');
    const inp = document.getElementById('avatar-color-edit-input-mob');
    const del = document.getElementById('avatar-editor-delete-mob');
    if (!ed || !inp) return;
    inp.value = color || '#ff0000';
    if (del) del.style.display = showDelete ? '' : 'none';
    ed.style.display = 'flex';
}
function _avatarHideEditorMob() {
    const ed = document.getElementById('avatar-color-editor-mob');
    if (ed) ed.style.display = 'none';
    _avatarEditTarget = null;
}
function _avatarStartAddMob(e) {
    if (e) e.stopPropagation();
    _avatarEditTarget = null;
    _avatarShowEditorMob('#ff0000', false);
}
function _avatarEditCustomMob(idx, e) {
    if (e) e.stopPropagation();
    const recenti = _avatarLoadRecenti();
    _avatarEditTarget = { type: 'custom', idx };
    _avatarShowEditorMob(recenti[idx] || '#ff0000', true);
}
function _avatarConfirmEditMob(e) {
    if (e) e.stopPropagation();
    const inp = document.getElementById('avatar-color-edit-input-mob');
    if (!inp) return;
    const color = inp.value;
    if (_avatarEditTarget === null) {
        const recenti = _avatarLoadRecenti();
        recenti.unshift(color);
        _avatarSaveRecenti(recenti);
        _renderCustomSwatches();
    } else if (_avatarEditTarget.type === 'custom') {
        const recenti = _avatarLoadRecenti();
        recenti[_avatarEditTarget.idx] = color;
        _avatarSaveRecenti(recenti);
        _renderCustomSwatches();
    }
    _avatarHideEditorMob();
    _setAvatarColor(color);
}
function _avatarCancelEditMob(e) {
    if (e) e.stopPropagation();
    _avatarHideEditorMob();
}
function _avatarDeleteEditMob(e) {
    if (e) e.stopPropagation();
    if (!_avatarEditTarget) return;
    if (_avatarEditTarget.type === 'custom') {
        const recenti = _avatarLoadRecenti();
        recenti.splice(_avatarEditTarget.idx, 1);
        _avatarSaveRecenti(recenti);
        _renderCustomSwatches();
    }
    _avatarHideEditorMob();
}

function _applyAvatarColorUI(color) {
    // Aggiorna la CSS variable globale usata dal CSS statico
    document.documentElement.style.setProperty('--avatar-user-color', color);
    const btn = document.getElementById('user-avatar-btn');
    const ddp = document.getElementById('account-ddrop-avatar');
    const btnMob = document.getElementById('user-avatar-btn-mobile');
    const ddpMob = document.getElementById('account-ddrop-avatar-mob');
    if (btn) {
        btn.style.setProperty('background', color, 'important');
        btn.style.setProperty('box-shadow', `0 2px 8px ${color}66`, 'important');
    }
    if (btnMob) {
        btnMob.style.setProperty('background', color, 'important');
        btnMob.style.setProperty('box-shadow', `0 2px 8px ${color}66`, 'important');
    }
    if (ddp) ddp.style.setProperty('background', color, 'important');
    if (ddpMob) ddpMob.style.setProperty('background', color, 'important');
    document.querySelectorAll('.avatar-color-swatch').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.color === color);
    });
}

/** Imposta e salva il colore avatar per l'utente corrente */
function _setAvatarColor(color) {
    if (!utenteAttuale || !utenteAttuale.nome) return;
    const nomeKey = utenteAttuale.nome.toUpperCase().trim();
    try { localStorage.setItem('avatarColor_' + nomeKey, color); } catch {}
    if (window._avatarColorsCache) window._avatarColorsCache[nomeKey] = color;
    if (utenteAttuale.nome) {
        fetch(`${URL_GOOGLE}?azione=setAvatarColor&username=${encodeURIComponent(utenteAttuale.nome)}&color=${encodeURIComponent(color)}`)
            .catch(() => {});
    }
    _applyAvatarColorUI(color);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ACCOUNT MENU — Desktop + Mobile
// ═══════════════════════════════════════════════════════════════════════════════

function toggleAccountMenu(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('account-dropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('open');
}

function chiudiAccountMenu() {
    const dropdown = document.getElementById('account-dropdown');
    if (dropdown) dropdown.classList.remove('open');
}

/** Aggiorna la pagina corrente: svuota cache, ricarica impostazioni e ricarica dati dal server */
async function _aggiornaPagina() {
    _lsCacheDel('_impostazioni_cache');
    try {
        if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg) await reg.update();
        }
    } catch (e) {
        console.warn('[refresh] update service worker:', e);
    }
    await _fetchImpostazioniDaServer();
    if (window.paginaAttuale) {
        if (window.cacheContenuti) delete window.cacheContenuti[window.paginaAttuale];
        _lsCacheDel('_html_' + window.paginaAttuale);
    }
    window.location.reload();
}

function toggleAccountMenuMobile(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('account-dropdown-mobile');
    if (!dropdown) return;
    dropdown.classList.toggle('open');
}

function chiudiAccountMenuMobile() {
    const dropdown = document.getElementById('account-dropdown-mobile');
    if (dropdown) dropdown.classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DIAGNOSTICA PUSH
// ═══════════════════════════════════════════════════════════════════════════════

/** Mostra la diagnostica push (solo MASTER): lista dispositivi registrati per ogni utente */
async function _mostraDiagnosticaPush() {
    try {
        const res  = await fetch(URL_GOOGLE + '?azione=pushInfo');
        const json = await res.json().catch(() => ({}));
        const subs = json.subscriptions || [];
        if (!subs.length) {
            notificaElegante('Nessun dispositivo registrato in PUSH_SUBSCRIPTIONS', 'error');
            return;
        }
        const byUser = {};
        subs.forEach(s => {
            if (!byUser[s.user]) byUser[s.user] = 0;
            byUser[s.user]++;
        });
        const righe = Object.entries(byUser)
            .sort((a,b) => a[0].localeCompare(b[0]))
            .map(([u, n]) => `<tr><td style="padding:6px 10px;font-weight:600">${u}</td><td style="padding:6px 10px;text-align:center">${n} dispositivo${n>1?'i':''}</td></tr>`)
            .join('');
        const html = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center" onclick="this.remove()">
            <div style="background:#fff;border-radius:16px;padding:24px 28px;max-width:420px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.18)" onclick="event.stopPropagation()">
                <div style="font-size:1.05rem;font-weight:700;margin-bottom:16px">🔍 Diagnostica Push — Dispositivi registrati (${subs.length})</div>
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
                    <thead><tr style="background:#f1f5f9"><th style="padding:6px 10px;text-align:left">Utente</th><th style="padding:6px 10px">Dispositivi</th></tr></thead>
                    <tbody>${righe}</tbody>
                </table>
                <p style="font-size:0.77rem;color:#64748b;margin-top:14px">Tocca fuori per chiudere. Se un utente non compare in questa lista, le sue notifiche NON arriveranno.</p>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
    } catch(err) {
        notificaElegante('Errore diagnostica: ' + err.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PUSH NOTIFICATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Forza una ri-registrazione completa: unsubscribe + re-subscribe + salva su GAS */
async function _forzaRiregistraPush() {
    const btn = document.getElementById('btn-force-regpush');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Registrazione...'; }
    try {
        const reg = await navigator.serviceWorker.register('sw.js', { scope: './' });
        await navigator.serviceWorker.ready;
        let oldSub = await reg.pushManager.getSubscription();
        if (oldSub) {
            await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'eliminaSottoscrizione', endpoint: oldSub.endpoint }) }).catch(() => {});
            await oldSub.unsubscribe();
        }
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
            notificaElegante('Permesso notifiche negato', 'error');
            if (btn) { btn.disabled = false; btn.textContent = '🔄 Ri-registra subscription'; }
            return;
        }
        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: _vapidB64ToUint8_(window._VAPID_PUBLIC_KEY)
        });
        if ('caches' in window) {
            const c = await caches.open('prod-auth');
            await c.put('username', new Response(utenteAttuale.nome.toUpperCase()));
        }
        const j = sub.toJSON();
        const result = await window._salvaSubVAPID_({ endpoint: j.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth });
        if (result && (result.status === 'saved' || result.status === 'updated')) {
            try { localStorage.setItem('_pushStato', 'ok'); } catch {}
            notificaElegante('✅ Subscription registrata con successo!');
        } else if (result && result.status === 'errore-verifica') {
            try { localStorage.setItem('_pushStato', 'errore-verifica'); } catch {}
            notificaElegante('⚠️ Subscription creata ma NON confermata sul server. Riprova più tardi.', 'error');
        } else {
            notificaElegante('⚠️ Subscription creata ma salvataggio GAS incerto: ' + JSON.stringify(result), 'error');
        }
        _aggiornaUINotifiche();
    } catch (err) {
        console.warn('[Push] forzaRiregistra:', err);
        notificaElegante('Errore ri-registrazione: ' + err.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '🔄 Ri-registra subscription'; }
    }
}

/** Invia una notifica push di test all'utente corrente */
async function _testPushNotifica() {
    const btn = document.getElementById('btn-test-push');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Invio...'; }
    try {
        const url = URL_GOOGLE + '?azione=testPush&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase());
        const res = await fetch(url);
        const json = await res.json().catch(() => ({}));
        if (json.sent > 0) {
            const logInfo = (json.log || []).map(r => 'HTTP ' + r.status + (r.body ? ' (' + String(r.body).substring(0,80) + ')' : '')).join(' | ');
            notificaElegante('\uD83D\uDCE4 Test inviato (' + json.sent + ' disp.) — ' + (logInfo || '—'));
        } else if (json.status === 'no_devices') {
            notificaElegante('\u26A0\uFE0F Nessun dispositivo registrato. Clicca "Ri-registra subscription".', 'error');
        } else {
            notificaElegante('\u26A0\uFE0F Risposta server: ' + JSON.stringify(json), 'error');
        }
    } catch (err) {
        notificaElegante('Errore test push: ' + err.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '🔨 Invia notifica di test'; }
    }
}

function _getNotifPrefs() {
    try {
        return JSON.parse(localStorage.getItem('notifPrefs') ||
            '{"richieste":true,"assegnazioni":true,"stato":false}');
    } catch { return { richieste: true, assegnazioni: true, stato: false }; }
}

function _saveNotifPrefs(prefs) {
    try { localStorage.setItem('notifPrefs', JSON.stringify(prefs)); } catch {}
    notificaElegante('Preferenze notifiche salvate ✔');
}

function _onNotifPrefChange() {
    const prefs = {
        richieste:    !!(document.getElementById('np-richieste')?.checked),
        assegnazioni: !!(document.getElementById('np-assegnazioni')?.checked),
        stato:        !!(document.getElementById('np-stato')?.checked)
    };
    _saveNotifPrefs(prefs);
}

/** Attiva o disattiva le push per questo dispositivo. */
async function _togglePushPermission() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        notificaElegante('Questo browser non supporta le notifiche push', 'error');
        return;
    }
    try {
        const reg = await navigator.serviceWorker.register('sw.js', { scope: './' });
        await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();
        if (sub) {
            const endpt = sub.endpoint;
            await sub.unsubscribe();
            try {
                await fetch(URL_GOOGLE, {
                    method: 'POST',
                    body: JSON.stringify({ azione: 'eliminaSottoscrizione', endpoint: endpt })
                });
            } catch {}
            try { localStorage.removeItem('_pushStato'); } catch {}
            notificaElegante('Notifiche push disattivate');
        } else {
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') { notificaElegante('Permesso notifiche negato', 'error'); return; }
            sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: _vapidB64ToUint8_(window._VAPID_PUBLIC_KEY)
            });
            const j = sub.toJSON();
            const saveResult = await window._salvaSubVAPID_({ endpoint: j.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth });
            if (saveResult && (saveResult.status === 'saved' || saveResult.status === 'updated')) {
                try { localStorage.setItem('_pushStato', 'ok'); } catch {}
                notificaElegante('Notifiche push attivate ✔ (registrate su server)');
            } else if (saveResult && saveResult.status === 'errore-verifica') {
                try { localStorage.setItem('_pushStato', 'errore-verifica'); } catch {}
                notificaElegante('⚠ Push attivate ma NON confermate sul server — usa "Ri-registra subscription"', 'error');
            } else {
                try { localStorage.setItem('_pushStato', 'errore-salvataggio'); } catch {}
                notificaElegante('⚠ Push attivate localmente ma salvataggio server incerto', 'error');
            }
            if ('caches' in window) {
                const c = await caches.open('prod-auth');
                await c.put('username', new Response(utenteAttuale.nome.toUpperCase()));
            }
        }
        setTimeout(_aggiornaUINotifiche, 400);
    } catch (err) {
        console.warn('[Push] toggle:', err);
        notificaElegante('Errore attivazione notifiche push', 'error');
    }
}

async function _aggiornaUINotifiche() {
    const btn   = document.getElementById('btn-toggle-push');
    const dot   = document.getElementById('push-status-dot');
    const label = document.getElementById('push-status-text');
    if (!btn && !dot) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        if (label) label.textContent = 'Non supportate da questo browser';
        if (btn)   btn.disabled = true;
        return;
    }
    try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        const on  = !!sub;
        let statoServer = '';
        try {
            const ps = localStorage.getItem('_pushStato');
            if (ps === 'ok')                      statoServer = ' ✔ registrato sul server';
            else if (ps === 'errore-verifica')    statoServer = ' ⚠ salvato ma non confermato — ri-registra';
            else if (ps === 'errore-salvataggio') statoServer = ' ⚠ non salvato sul server';
            else if (ps === 'errore-subscribe')   statoServer = ' ⚠ errore subscribe';
            else if (ps && ps.startsWith('errore:')) statoServer = ' ⚠ ' + ps.replace('errore:', '');
        } catch {}
        if (btn) {
            btn.innerHTML = on
                ? '<i class="fas fa-bell-slash"></i> Disattiva notifiche push'
                : '<i class="fas fa-bell"></i> Attiva notifiche push';
            btn.style.background    = on ? '#14532d' : '';
            btn.style.borderColor   = on ? '#16a34a' : '';
            btn.style.color         = on ? '#86efac' : '';
        }
        if (dot)   dot.style.background = on ? '#22c55e' : '#6b7280';
        if (label) label.textContent    = on
            ? 'Attive su questo dispositivo' + statoServer
            : 'Non attive su questo dispositivo';
    } catch {}
}

/** base64url → Uint8Array (serve a pushManager.subscribe) */
function _vapidB64ToUint8_(b64url) {
    const pad  = '='.repeat((4 - b64url.length % 4) % 4);
    const b64  = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/');
    const raw  = window.atob(b64);
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CSV IMPORT
// ═══════════════════════════════════════════════════════════════════════════════

async function importaCSVDaFile(input) {
    const file = input && input.files && input.files[0];
    const labelNome = document.getElementById('csv-upload-filename');
    const risultato = document.getElementById('csv-upload-result');
    if (!file) return;

    if (labelNome) labelNome.textContent = file.name;
    if (risultato) { risultato.style.display = 'none'; risultato.innerHTML = ''; }

    const csvText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file, 'UTF-8');
    });

    const primaRiga = csvText.split('\n')[0] || '';
    const separatore = (primaRiga.split(';').length >= primaRiga.split(',').length) ? ';' : ',';

    if (risultato) {
        risultato.style.display = 'block';
        risultato.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:#64748b;font-size:0.88rem"><i class="fas fa-spinner fa-spin"></i> Analisi CSV in corso…</div>`;
    }

    try {
        const preview = await _csvImportRequest_(csvText, separatore, {});
        if (preview.status === 'error') {
            if (risultato) risultato.innerHTML = _csvImportErrorHtml_(preview.msg || preview.message || 'Errore sconosciuto');
            input.value = '';
            return;
        }

        const applyImport = async (decisioni) => {
            if (risultato) {
                risultato.style.display = 'block';
                risultato.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:#64748b;font-size:0.88rem"><i class="fas fa-spinner fa-spin"></i> Applico le modifiche selezionate…</div>`;
            }
            const json = await _csvImportRequest_(csvText, separatore, Object.assign({ confermaImportCSV: true }, decisioni || {}));
            if (risultato) {
                if (json.status === 'ok') {
                    risultato.innerHTML = _csvImportSuccessHtml_(json);
                    setTimeout(() => { if (typeof window.caricaDati === 'function') window.caricaDati('PROGRAMMA PRODUZIONE DEL MESE', true); }, 800);
                } else {
                    risultato.innerHTML = _csvImportErrorHtml_(json.msg || json.message || 'Errore sconosciuto');
                }
            }
        };

        if (preview.reviewRequired) {
            _apriCsvImportReviewModal_(preview, async (decisioni) => {
                await applyImport(decisioni);
            }, () => {
                if (risultato) {
                    risultato.style.display = 'block';
                    risultato.innerHTML = `<div style="background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#9a3412"><strong>⚠ Importazione sospesa</strong><br><span>Nessuna modifica applicata: chiudi o conferma il modal per procedere.</span></div>`;
                }
            });
        } else {
            await applyImport({ applyMissingCsvChanges: false, finishStateDecisions: {} });
        }
    } catch (err) {
        if (risultato) {
            risultato.innerHTML = _csvImportErrorHtml_(err.message);
        }
    }
    input.value = '';
}

async function _csvImportRequest_(csvText, separatore, extraPayload) {
    const res = await fetch(URL_GOOGLE, {
        method: 'POST',
        body: JSON.stringify(Object.assign({ azione: 'importaOrdiniCSV', csvText, separatore }, extraPayload || {}))
    });
    return await res.json().catch(() => ({}));
}

function _csvImportSuccessHtml_(json) {
    return `
        <div style="background:#dcfce7;border:1px solid #86efac;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#166534">
            <strong>✅ Importazione completata</strong><br>
            <span>Nuovi ordini inseriti: <strong>${json.nuove || 0}</strong></span><br>
            <span>Duplicati saltati: <strong>${json.saltate || 0}</strong></span>
            ${json.aggiornate > 0 ? `<br><span>Quantità aggiornate: <strong>${json.aggiornate}</strong></span>` : ''}
            ${json.finiture > 0 ? `<br><span>Finiture rilevate dal CSV: <strong>${json.finiture}</strong></span>` : ''}
            ${json.defaultStato > 0 ? `<br><span>Stato default "MANDA IN LAVORAZIONE": <strong>${json.defaultStato}</strong></span>` : ''}
            ${json.evasi > 0 ? `<br><span>🚚 Spostati a SPEDITO: <strong>${json.evasi}</strong></span>` : ''}
            ${json.missingSkipped > 0 ? `<br><span>Ordini assenti lasciati invariati: <strong>${json.missingSkipped}</strong></span>` : ''}
        </div>`;
}

function _csvImportErrorHtml_(msg) {
    return `<div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#991b1b"><strong>❌ Errore:</strong> ${msg || 'Errore sconosciuto'}</div>`;
}

function _csvImportEsc_(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function _csvImportStateOptionsHtml_(selected) {
    const stati = ['MANDA IN LAVORAZIONE', 'IN PRODUZIONE', 'IMBALLATO', 'SPEDITO', 'CONSEGNATO'];
    const current = String(selected || 'MANDA IN LAVORAZIONE').trim().toUpperCase();
    return stati.map(st => `<option value="${st}" ${st === current ? 'selected' : ''}>${st}</option>`).join('');
}

function _ensureCsvImportReviewModal_() {
    let modal = document.getElementById('csv-import-review-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'csv-import-review-modal';
    modal.className = 'csv-import-review-overlay';
    modal.innerHTML = `
        <div class="csv-import-review-box" onclick="event.stopPropagation()">
            <div class="csv-import-review-head">
                <div>
                    <h3>Revisione import CSV</h3>
                    <p>Controlla ordini assenti dal CSV e righe con finiture/colori rilevati prima di applicare l'import.</p>
                </div>
                <button type="button" class="csv-import-review-close" onclick="_chiudiCsvImportReviewModal_(true)">✕</button>
            </div>
            <div id="csv-import-review-body" class="csv-import-review-body"></div>
            <div class="csv-import-review-actions">
                <button type="button" class="hives-btn hives-btn-soft" onclick="_chiudiCsvImportReviewModal_(true)">Annulla</button>
                <button type="button" class="hives-btn" id="csv-import-review-confirm">Conferma import</button>
            </div>
        </div>`;
    modal.addEventListener('click', () => _chiudiCsvImportReviewModal_(true));
    document.body.appendChild(modal);
    return modal;
}

let _csvImportReviewHandlers = { onConfirm: null, onCancel: null };

function _apriCsvImportReviewModal_(preview, onConfirm, onCancel) {
    const modal = _ensureCsvImportReviewModal_();
    const body = document.getElementById('csv-import-review-body');
    const btn = document.getElementById('csv-import-review-confirm');
    if (!modal || !body || !btn) return;

    _csvImportReviewHandlers = { onConfirm: onConfirm || null, onCancel: onCancel || null };

    const missingHtml = (preview.missingCandidates || []).length ? `
        <section class="csv-import-review-section">
            <div class="csv-import-review-section-title">Ordini assenti dal CSV</div>
            <p class="csv-import-review-note">Se confermi, questi ordini verranno impostati a <strong>SPEDITO</strong>. Se lasci l'opzione su "non modificare", resteranno invariati. Gli ordini già <strong>IMBALLATO</strong> sono esclusi automaticamente.</p>
            <div class="csv-import-review-choice">
                <label><input type="radio" name="csv-missing-action" value="skip" checked> Non modificare gli ordini assenti</label>
                <label><input type="radio" name="csv-missing-action" value="apply"> Segna come SPEDITO gli ordini assenti</label>
            </div>
            <div class="csv-import-review-list">
                ${(preview.missingCandidates || []).map(item => `
                    <article class="csv-import-review-item">
                        <div><strong>Ordine ${_csvImportEsc_(item.ordine)}</strong> · ${_csvImportEsc_(item.codice)}</div>
                        <div>Cliente: ${_csvImportEsc_(item.cliente || '—')}</div>
                        <div>Rif: ${_csvImportEsc_(item.rif || '—')} · Stato attuale: <strong>${_csvImportEsc_(item.statoAttuale || 'VUOTO')}</strong></div>
                    </article>`).join('')}
            </div>
        </section>` : '';

    const finishHtml = (preview.finishCandidates || []).length ? `
        <section class="csv-import-review-section">
            <div class="csv-import-review-section-title">Righe con finiture/colori rilevati</div>
            <p class="csv-import-review-note">Per queste righe puoi scegliere lo stato da impostare. Le righe che hanno già uno stato diverso da <strong>MANDA IN LAVORAZIONE</strong> non vengono mostrate qui e restano intatte.</p>
            <div class="csv-import-review-table-wrap">
                <table class="csv-import-review-table">
                    <thead><tr><th>Ordine</th><th>Codice</th><th>Finitura rilevata</th><th>Stato da impostare</th></tr></thead>
                    <tbody>
                        ${(preview.finishCandidates || []).map(item => `
                            <tr>
                                <td>
                                    <div><strong>${_csvImportEsc_(item.ordine)}</strong></div>
                                    <div class="csv-import-review-cell-sub">${_csvImportEsc_(item.rif || '—')}</div>
                                </td>
                                <td>
                                    <div>${_csvImportEsc_(item.codice)}</div>
                                    <div class="csv-import-review-cell-sub">${_csvImportEsc_(item.prodotto || '')}</div>
                                </td>
                                <td>${_csvImportEsc_(item.tag)}</td>
                                <td>
                                    <select class="csv-import-review-select" data-key="${_csvImportEsc_(item.key)}">
                                        ${_csvImportStateOptionsHtml_(item.statoAttuale || 'MANDA IN LAVORAZIONE')}
                                    </select>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </section>` : '';

    body.innerHTML = `
        <div class="csv-import-review-summary">
            <div>Nuove righe previste: <strong>${preview.preview?.nuove || 0}</strong></div>
            <div>Quantità da aggiornare: <strong>${preview.preview?.aggiornate || 0}</strong></div>
            <div>Righe con finiture: <strong>${(preview.finishCandidates || []).length}</strong></div>
            <div>Ordini assenti da valutare: <strong>${(preview.missingCandidates || []).length}</strong></div>
        </div>
        ${missingHtml}
        ${finishHtml}`;

    btn.onclick = async () => {
        const selectedMissing = document.querySelector('input[name="csv-missing-action"]:checked');
        const applyMissingCsvChanges = !!selectedMissing && selectedMissing.value === 'apply';
        const finishStateDecisions = {};
        body.querySelectorAll('.csv-import-review-select').forEach(sel => {
            const key = sel.getAttribute('data-key');
            const value = String(sel.value || '').trim();
            if (key && value) finishStateDecisions[key] = value;
        });
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 180);
        if (_csvImportReviewHandlers.onConfirm) {
            await _csvImportReviewHandlers.onConfirm({ applyMissingCsvChanges, finishStateDecisions });
        }
    };

    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _chiudiCsvImportReviewModal_(notifyCancel) {
    const modal = document.getElementById('csv-import-review-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 180);
    if (notifyCancel && _csvImportReviewHandlers.onCancel) _csvImportReviewHandlers.onCancel();
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGINA IMPOSTAZIONI
// ═══════════════════════════════════════════════════════════════════════════════

async function caricaImpostazioni() {
    try {
        const res = await fetch(URL_GOOGLE + "?azione=getImpostazioni");
        const settings = await res.json();
        window.listaStati = settings.stati || [];
        window.listaOperatori = settings.operatori || [];
    } catch (e) { console.error("Errore caricamento impostazioni"); }
}

/**
 * Carica stati e operatori al boot dell'app.
 * Prima tenta la cache localStorage (TTL 5 min), poi il server GAS.
 */
async function caricaDatiIniziali() {
    const LS_KEY = '_impostazioni_cache';
    const TTL_MS = 5 * 60 * 1000;
    // Stale-while-revalidate: leggi cache ignorando la scadenza → listaStati sempre pronto
    const cachedAny = _lsCacheGet(LS_KEY, Infinity);
    if (cachedAny) {
        try {
            const parsed = (typeof cachedAny === 'string') ? JSON.parse(cachedAny) : cachedAny;
            if (parsed.stati && parsed.stati.length) {
                window.listaStati     = parsed.stati;
                window.listaOperatori = parsed.operatori || [];
                _applicaOverviewConfig(parsed.overviewStati);
                // Se i dati sono scaduti: aggiorna in background senza bloccare la UI
                if (!_lsCacheGet(LS_KEY, TTL_MS)) {
                    _fetchImpostazioniDaServer().catch(e => console.warn('[impostazioni] bg refresh:', e));
                }
                return; // non blocca mai se c'è almeno un valore in cache
            }
        } catch(e) { console.warn('[impostazioni] cache JSON corrotta, ricarico dal server:', e); }
        _lsCacheDel(LS_KEY);
    }
    // Nessun dato in cache (prima apertura assoluta): fetch bloccante necessario
    await _fetchImpostazioniDaServer();
}

/** Fetch fresco dal server e aggiorna cache LS + variabili globali */
async function _fetchImpostazioniDaServer() {
    const LS_KEY = '_impostazioni_cache';
    try {
        const res = await fetch(URL_GOOGLE + '?azione=getImpostazioni');
        const settings = await res.json();
        window.listaStati     = (settings.stati && settings.stati.length) ? settings.stati : window._defaultListaStati_();
        window.listaOperatori = settings.operatori || [];
        _applicaOverviewConfig(settings.overviewStati);
        _lsCacheSet(LS_KEY, JSON.stringify({
            stati: window.listaStati, operatori: window.listaOperatori,
            overviewStati: settings.overviewStati
        }));
    } catch(e) {
        console.warn('[Boot] _fetchImpostazioniDaServer:', e);
    }
}

/** Popola le variabili overview dai dati server (con fallback ai default) */
function _applicaOverviewConfig(ov) {
    if (!ov) return;
    if (Array.isArray(ov.art) && ov.art.length) window._ovStatiArt = ov.art.map(s => s.toUpperCase().trim());
    if (Array.isArray(ov.ord) && ov.ord.length) window._ovStatiOrd = ov.ord.map(s => s.toUpperCase().trim());
}

function toggleSettingsSection(sectionId, rowEl) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const arrow = rowEl.querySelector('.settings-row-arrow');
    const isOpen = section.style.display === 'block';
    section.style.display = isOpen ? 'none' : 'block';
    if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
    rowEl.classList.toggle('settings-row-active', !isOpen);
    if (!isOpen && (sectionId === 'section-utenti' || sectionId === 'section-team-utenti')) caricaListaUtenti();
    if (!isOpen && sectionId === 'section-qr-postazioni') requestAnimationFrame(() => _qrRenderListaCanvas());
}

/* ─── GESTIONE UTENTI ──────────────────────────────────────── */
async function caricaListaUtenti() {
    const container = document.getElementById('lista-utenti-config');
    if (!container) return;
    container.innerHTML = '<div class="centered-msg small">Caricamento...</div>';
    try {
        const res  = await fetch(`${URL_GOOGLE}?azione=getUtenti`);
        const list = await res.json();
        if (!list.length) {
            container.innerHTML = '<p class="centered-msg small">Nessun utente creato. Clicca "+ Aggiungi Utente".</p>';
            return;
        }
        container.innerHTML = list.map(u => {
            const id = u.id_riga;
            const username = (u.username || '').trim();
            const email = (u.email || '').trim();
            const ruolo = (u.ruolo || 'OPERATORE').trim().toUpperCase();
            const maxU = Number(u.max_utenti) || 1;
            return `
            <div class="config-row-modern utente-row" data-id="${id}">
                <div class="settings-actions-row" style="gap:12px">
                    <div class="settings-options-row" style="gap:10px">
                        <div class="avatar-circle">${(_esc(username.charAt(0)) || '?').toUpperCase()}</div>
                        <input type="text" class="input-flat" id="ut-username-${id}" value="${_esc(username).replace(/"/g, '&quot;')}" onchange="" placeholder="Username">
                    </div>
                    <div class="settings-options-row" style="gap:8px">
                        <button type="button" class="btn-modal-send" onclick="salvaModificheUtente(${id})" title="Salva modifiche">
                            <i class="fas fa-save"></i>
                        </button>
                        <button type="button" class="btn-trash-modern" onclick="eliminaUtente(${id}, ${JSON.stringify(username)})" title="Elimina utente">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="grid-2col gap-8" style="margin-top:10px">
                    <input type="email" class="input-field-modern" id="ut-email-${id}" placeholder="Email" value="${email.replace(/"/g, '&quot;')}">
                    <select class="input-field-modern" id="ut-ruolo-${id}">
                        <option value="OPERATORE" ${ruolo === 'OPERATORE' ? 'selected' : ''}>Operatore</option>
                        <option value="COMMERCIALE" ${ruolo === 'COMMERCIALE' ? 'selected' : ''}>Commerciale</option>
                        <option value="MASTER" ${ruolo === 'MASTER' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div class="grid-2col gap-8" style="margin-top:10px">
                    <input type="number" class="input-field-modern" id="ut-max-${id}" min="1" max="10" value="${maxU}">
                    <input type="password" class="input-field-modern" id="ut-pass-${id}" placeholder="Nuova password (opzionale)">
                </div>
                <div class="utente-max" style="margin-top:8px; opacity:0.85">Lascia la password vuota per non cambiarla.</div>
            </div>`;
        }).join('');
    } catch (e) {
        container.innerHTML = '<p class="centered-msg small text-danger">Errore nel caricamento utenti.</p>';
    }
}

async function salvaModificheUtente(idRiga) {
    const id = Number(idRiga);
    if (!id) return;

    const emailEl = document.getElementById(`ut-email-${id}`);
    const userEl  = document.getElementById(`ut-username-${id}`);
    const ruoloEl = document.getElementById(`ut-ruolo-${id}`);
    const maxEl   = document.getElementById(`ut-max-${id}`);
    const passEl  = document.getElementById(`ut-pass-${id}`);

    const email = (emailEl?.value || '').trim();
    const username = (userEl?.value || '').trim();
    const ruolo = (ruoloEl?.value || 'OPERATORE').trim().toUpperCase();
    const maxU = parseInt(maxEl?.value || '1', 10);
    const password = (passEl?.value || '').trim();

    if (!email || !username) {
        notificaElegante('Email e username sono obbligatori.', 'error');
        return;
    }
    if (password && password.length < 4) {
        notificaElegante('La password deve essere di almeno 4 caratteri.', 'error');
        return;
    }

    let hash = '';
    if (password) hash = await _hashSHA256(password);

    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'aggiornaUtente', id_riga: id, email, username, ruolo, max_utenti: maxU, hash })
        });
        const r = await res.json();
        if (r.status === 'success') {
            notificaElegante('Utente aggiornato.');
            if (passEl) passEl.value = '';
            caricaListaUtenti();
        } else {
            notificaElegante(r.message || 'Errore aggiornamento utente.', 'error');
        }
    } catch (e) {
        notificaElegante('Errore di connessione.', 'error');
    }
}

function apriFormNuovoUtente() {
    const form = document.getElementById('form-nuovo-utente');
    if (form) {
        form.style.display = 'block';
        document.getElementById('nu-email').value    = '';
        document.getElementById('nu-username').value = '';
        document.getElementById('nu-password').value = '';
        document.getElementById('nu-ruolo').value    = 'OPERATORE';
        document.getElementById('nu-max').value      = '1';
    }
}

async function salvaUtenteNuovo() {
    const email    = (document.getElementById('nu-email')?.value   || '').trim();
    const username = (document.getElementById('nu-username')?.value || '').trim();
    const password = (document.getElementById('nu-password')?.value || '').trim();
    const ruolo    = (document.getElementById('nu-ruolo')?.value    || 'OPERATORE');
    const maxU     = parseInt(document.getElementById('nu-max')?.value || '1');

    if (!email || !username || !password) {
        notificaElegante('Compila tutti i campi: email, username, password.', 'error');
        return;
    }
    if (password.length < 4) {
        notificaElegante('La password deve essere di almeno 4 caratteri.', 'error');
        return;
    }
    const btn = document.querySelector('#form-nuovo-utente .btn-modal-send');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
        const hash = await _hashSHA256(password);
        const res  = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'creaUtente', email, username, hash, ruolo, max_utenti: maxU })
        });
        const r = await res.json();
        if (r.status === 'success') {
            notificaElegante(`Utente "${username}" creato con successo!`);
            document.getElementById('form-nuovo-utente').style.display = 'none';
            caricaListaUtenti();
        } else {
            notificaElegante(r.message || 'Errore nella creazione utente.', 'error');
        }
    } catch (e) {
        notificaElegante('Errore di connessione.', 'error');
    }
    btn.disabled = false;
    btn.innerHTML = 'Salva Utente';
}

function eliminaUtente(idRiga, username) {
    mostraConferma('Elimina Utente', `Eliminare l'utente "${username}"? Non potrà più accedere.`, async () => {
        try {
            const res = await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: 'eliminaUtente', id_riga: idRiga })
            });
            const r = await res.json();
            if (r.status === 'success') {
                notificaElegante(`Utente "${username}" eliminato.`);
                caricaListaUtenti();
            } else {
                notificaElegante(r.message || 'Errore durante eliminazione.', 'error');
            }
        } catch (e) {
            notificaElegante('Errore di connessione.', 'error');
        }
    }, 'Elimina');
}

function _fmtSessionTs_(ts) {
    const num = Number(ts || 0);
    if (!num) return '-';
    try { return new Date(num).toLocaleString('it-IT'); } catch (e) { return '-'; }
}

async function _caricaSessionStats_() {
    if (!utenteAttuale || utenteAttuale.ruolo !== 'MASTER') return;
    const wrap = document.getElementById('session-stats-wrap');
    if (!wrap) return;
    wrap.innerHTML = '<div style="font-size:12px;color:#64748b">Caricamento sessioni...</div>';
    try {
        const url = URL_GOOGLE + '?azione=getSessionStats&username=' + encodeURIComponent(String(utenteAttuale.nome || '').toUpperCase()) + '&email=' + encodeURIComponent(String(utenteAttuale.email || '').toLowerCase());
        const res = await fetch(url);
        const r = await res.json();
        if (!r || r.status !== 'success') {
            wrap.innerHTML = '<div style="font-size:12px;color:#b91c1c">Impossibile caricare statistiche sessioni.</div>';
            return;
        }

        const totals = r.totals || {};
        const byUser = Array.isArray(r.byUser) ? r.byUser : [];
        const top = byUser.slice(0, 8);

        wrap.innerHTML = `
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Sessioni attive: <strong>${totals.activeSessions || 0}</strong></span>
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Utenti attivi: <strong>${totals.usersWithSessions || 0}</strong></span>
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Righe sessione: <strong>${totals.rows || 0}</strong></span>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
                <div style="display:grid;grid-template-columns:1.2fr .6fr .8fr;background:#f8fafc;padding:8px 10px;font-size:11px;font-weight:700;color:#475569">
                    <div>Utente</div><div>Sessioni</div><div>Ultimo accesso</div>
                </div>
                ${top.length ? top.map(function(u) {
                    return `<div style="display:grid;grid-template-columns:1.2fr .6fr .8fr;padding:8px 10px;font-size:12px;border-top:1px solid #f1f5f9">
                        <div>${u.username || '-'}</div>
                        <div>${u.activeSessions || 0}</div>
                        <div>${_fmtSessionTs_(u.latestSeenTs)}</div>
                    </div>`;
                }).join('') : `<div style="padding:10px;font-size:12px;color:#64748b">Nessuna sessione attiva</div>`}
            </div>
        `;
    } catch (e) {
        wrap.innerHTML = '<div style="font-size:12px;color:#b91c1c">Errore rete durante il caricamento sessioni.</div>';
    }
}

async function _revocaSessioniUtenteDaUI_() {
    const usernameTarget = (document.getElementById('session-username-target')?.value || '').trim().toUpperCase();
    if (!usernameTarget) {
        notificaElegante('Inserisci uno username da revocare.', 'error');
        return;
    }
    if (!confirm('Revocare tutte le sessioni per ' + usernameTarget + '?')) return;
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'revocaSessioniUtente', usernameTarget })
        });
        const r = await res.json();
        if (r && r.status === 'success') {
            notificaElegante('Sessioni revocate: ' + (r.removed || 0));
            _caricaSessionStats_();
            return;
        }
        notificaElegante((r && (r.message || r.msg)) || 'Revoca non riuscita.', 'error');
    } catch (e) {
        notificaElegante('Errore rete durante revoca sessioni.', 'error');
    }
}

async function _revocaTutteSessioniDaUI_() {
    if (!confirm('Revocare TUTTE le sessioni (eccetto quella corrente)?')) return;
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'revocaTutteSessioni' })
        });
        const r = await res.json();
        if (r && r.status === 'success') {
            notificaElegante('Sessioni globali revocate: ' + (r.removed || 0));
            _caricaSessionStats_();
            return;
        }
        notificaElegante((r && (r.message || r.msg)) || 'Revoca globale non riuscita.', 'error');
    } catch (e) {
        notificaElegante('Errore rete durante revoca globale.', 'error');
    }
}

function caricaInterfacciaImpostazioni() {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    const listaStati = window.listaStati || [];
    const TW = window.TW || {};

    contenitore.innerHTML = `
        <div class="settings-accordion">

            <!-- ROW: Stati Produzione -->
            <div class="settings-row" onclick="toggleSettingsSection('section-stati', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-tag"></i></div>
                    <div>
                        <div class="settings-row-title">Stati Produzione</div>
                        <div class="settings-row-sub">${listaStati.length} stati configurati</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-stati" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div id="lista-stati-config">
                        ${listaStati.map((s, i) => `
                            <div class="config-row-modern row" draggable="true" data-idx="${i}">
                                <i class="fas fa-grip-vertical drag-handle"></i>
                                <div class="color-picker-wrapper">
                                    <input type="color" value="${s.colore}" class="color-overlay"
                                           onchange="listaStati[${i}].colore=this.value; segnaModifica(); caricaInterfacciaImpostazioni();">
                                    <div class="status-dot-custom" style="--bg-color:${s.colore};"></div>
                                </div>
                                <input type="text" class="input-flat flex-grow" value="${s.nome || s.stato}" onchange="listaStati[${i}].nome=this.value.toUpperCase(); segnaModifica();">
                                <button type="button" class="btn-trash-modern" onclick="azioneEliminaStato(${i})"><i class="fas fa-trash"></i></button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-add-dashed" onclick="azioneAggiungiStato()">+ Aggiungi Stato</button>
                </div>
            </div>

            <!-- ROW: Team + Utenti (solo MASTER) -->
            ${utenteAttuale.ruolo === "MASTER" ? `
            <div class="settings-row" onclick="toggleSettingsSection('section-team-utenti', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-user-lock"></i></div>
                    <div>
                        <div class="settings-row-title">Gestione Utenti</div>
                        <div class="settings-row-sub">Email, username, password e ruoli di accesso</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-team-utenti" class="settings-section-body" style="display:none">
                <div class="card-settings">

                    <h3 style="margin:0 0 10px 0">Gestione Utenti</h3>
                    <div id="lista-utenti-config"></div>
                    <button class="btn-add-dashed" onclick="apriFormNuovoUtente()">+ Aggiungi Utente</button>
                    <div id="form-nuovo-utente" class="form-nuovo-utente" style="display:none">
                        <div class="form-utente-grid">
                            <input type="email" id="nu-email" placeholder="Email" class="input-field-modern">
                            <input type="text"  id="nu-username" placeholder="Nome utente" class="input-field-modern">
                            <input type="password" id="nu-password" placeholder="Password" class="input-field-modern">
                            <select id="nu-ruolo" class="input-field-modern">
                                <option value="OPERATORE">Operatore</option>
                                <option value="COMMERCIALE">Commerciale</option>
                                <option value="MASTER">Admin</option>
                            </select>
                            <input type="number" id="nu-max" placeholder="Max utenti/email (es. 3)" class="input-field-modern" value="1" min="1" max="10">
                        </div>
                        <div class="form-utente-actions">
                            <button class="btn-modal-cancel" onclick="document.getElementById('form-nuovo-utente').style.display='none'">Annulla</button>
                            <button class="btn-modal-send" onclick="salvaUtenteNuovo()">Salva Utente</button>
                        </div>
                    </div>

                    <div style="height:6px"></div>
                </div>
            </div>

            <div class="settings-row" onclick="toggleSettingsSection('section-sessioni-attive', this); setTimeout(_caricaSessionStats_, 120)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-shield-alt"></i></div>
                    <div>
                        <div class="settings-row-title">Sicurezza Sessioni</div>
                        <div class="settings-row-sub">Monitor sessioni attive e revoca accessi</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-sessioni-attive" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
                        <input id="session-username-target" type="text" class="input-field-modern" placeholder="Username da revocare" style="max-width:220px">
                        <button class="qr-post-btn" style="padding:8px 12px;height:auto" onclick="_revocaSessioniUtenteDaUI()">Revoca utente</button>
                        <button class="qr-post-btn qr-post-btn-danger" style="padding:8px 12px;height:auto" onclick="_revocaTutteSessioniDaUI()">Revoca globale</button>
                        <button class="qr-post-btn" style="padding:8px 12px;height:auto" onclick="_caricaSessionStats_()"><i class="fas fa-sync"></i></button>
                    </div>
                    <div id="session-stats-wrap"></div>
                </div>
            </div>
            ` : ''}

            <!-- ROW: Importa CSV Ordini (solo MASTER) -->
            ${utenteAttuale.ruolo === "MASTER" ? `
            <div class="settings-row" onclick="toggleSettingsSection('section-importa-csv', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-file-csv"></i></div>
                    <div>
                        <div class="settings-row-title">Importa Ordini da CSV</div>
                        <div class="settings-row-sub">Carica il CSV del gestionale direttamente, senza passare da Sheets</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-importa-csv" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <h3 style="margin:0 0 8px 0">Importa Ordini da CSV</h3>
                    <p style="margin:0 0 14px 0;font-size:0.85rem;color:#64748b">Seleziona il file CSV esportato dal gestionale (separatore <strong>;</strong>). I duplicati vengono saltati automaticamente.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                        <label style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:#f1f5f9;border:2px dashed #94a3b8;border-radius:10px;cursor:pointer;font-size:0.88rem;font-weight:600;color:#334155;transition:background 0.15s" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                            <i class="fas fa-folder-open" style="color:#3b82f6"></i>
                            Scegli file CSV
                            <input type="file" id="csv-upload-input" accept=".csv,text/csv" style="display:none" onchange="importaCSVDaFile(this)">
                        </label>
                        <span id="csv-upload-filename" style="font-size:0.82rem;color:#64748b;font-style:italic">Nessun file selezionato</span>
                    </div>
                    <div id="csv-upload-result" style="margin-top:14px;display:none"></div>
                </div>
            </div>
            ` : ''}

            <!-- ROW: Postazioni QR -->
            <div class="settings-row" onclick="toggleSettingsSection('section-qr-postazioni', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-qrcode"></i></div>
                    <div>
                        <div class="settings-row-title">Postazioni QR Code</div>
                        <div class="settings-row-sub">${_qrPostazioniArr.length} postazioni configurate</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-qr-postazioni" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div id="qr-postazioni-lista">
                        ${_qrPostazioniArr.length === 0
                            ? `<div style="text-align:center;color:#9ca3af;padding:20px;font-size:13px">Nessuna postazione configurata</div>`
                            : _qrPostazioniArr.map((p, i) => `
                            <div class="qr-post-row" data-idx="${i}">
                                <img class="qr-post-canvas" id="qr-list-canvas-${i}" alt="QR" style="width:56px;height:56px;border-radius:6px;background:#f8fafc;flex-shrink:0">
                                <div class="qr-post-info">
                                    <span class="qr-post-nome">${p.icona || '📍'} ${p.nome}</span>
                                    <span class="qr-post-codice">${p.codice}</span>
                                </div>
                                <div class="qr-post-actions">
                                    <button class="qr-post-btn" onclick="_qrApriModalModifica(${i})" title="Modifica"><i class="fas fa-pen"></i></button>
                                    <button class="qr-post-btn qr-post-btn-print" onclick="_qrStampaSingolaIdx(${i})" title="Stampa QR"><i class="fas fa-print"></i></button>
                                    <button class="qr-post-btn qr-post-btn-danger" onclick="_qrEliminaPostazione(${i})" title="Elimina"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>`).join('')}
                    </div>
                    <div class="qr-post-footer-btns">
                        <button class="qr-post-btn-add" onclick="_qrApriModalNuova()"><i class="fas fa-plus"></i> Aggiungi Postazione</button>
                        <button class="qr-post-btn-print-all" onclick="_qrStampaTutte()"><i class="fas fa-print"></i> Stampa tutte</button>
                    </div>
                </div>
            </div>

            <!-- ROW: Notifiche Push -->
            <div class="settings-row" onclick="toggleSettingsSection('section-notifiche', this); setTimeout(_aggiornaUINotifiche, 200)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-bell"></i></div>
                    <div>
                        <div class="settings-row-title">Notifiche Push</div>
                        <div class="settings-row-sub">Ricevi avvisi su questo dispositivo</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-notifiche" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                        <span id="push-status-dot" style="width:10px;height:10px;border-radius:50%;background:#6b7280;flex-shrink:0"></span>
                        <span id="push-status-text" style="font-size:0.85rem;color:#9ca3af">Controlla stato...</span>
                    </div>
                    <button id="btn-toggle-push" class="settings-action-btn" onclick="_togglePushPermission()" style="width:100%;padding:14px 18px;font-size:0.97rem;font-weight:700;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.2s">
                        <i class="fas fa-bell"></i> Attiva notifiche push
                    </button>
                    <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
                        <button id="btn-force-regpush" onclick="_forzaRiregistraPush()" style="flex:1;min-width:140px;padding:10px 14px;font-size:0.82rem;font-weight:600;border-radius:10px;border:1px solid #e2e8f0;background:#fff;color:#1e293b;cursor:pointer;transition:background 0.15s">
                            🔄 Ri-registra subscription
                        </button>
                        <button id="btn-test-push" onclick="_testPushNotifica()" style="flex:1;min-width:120px;padding:10px 14px;font-size:0.82rem;font-weight:600;border-radius:10px;border:1px solid #e2e8f0;background:#fff;color:#1e293b;cursor:pointer;transition:background 0.15s">
                            🔨 Invia notifica di test
                        </button>
                        ${utenteAttuale.ruolo === 'MASTER' ? `<button onclick="_mostraDiagnosticaPush()" style="flex:1;min-width:120px;padding:10px 14px;font-size:0.82rem;font-weight:600;border-radius:10px;border:1px solid #fcd34d;background:#fefce8;color:#92400e;cursor:pointer;transition:background 0.15s">🔍 Diagnostica Push</button>` : ''}
                    </div>
                    <div style="margin-top:20px;border-top:1px solid rgba(255,255,255,0.07);padding-top:16px">
                        <div style="font-size:0.78rem;font-weight:600;color:#9ca3af;letter-spacing:.5px;margin-bottom:12px">TIPOLOGIE DI AVVISI</div>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-richieste" onchange="_onNotifPrefChange()"
                                ${_getNotifPrefs().richieste ? 'checked' : ''}>
                            <span><i class="fas fa-comment-dots" style="color:#242424"></i>&nbsp;Nuove richieste / messaggi</span>
                        </label>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-assegnazioni" onchange="_onNotifPrefChange()"
                                ${_getNotifPrefs().assegnazioni ? 'checked' : ''}>
                            <span><i class="fas fa-user-check" style="color:#34d399"></i>&nbsp;Assegnazioni ordine</span>
                        </label>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-stato" onchange="_onNotifPrefChange()"
                                ${_getNotifPrefs().stato ? 'checked' : ''}>
                            <span><i class="fas fa-sync-alt" style="color:#f59e0b"></i>&nbsp;Cambi di stato articoli</span>
                        </label>
                    </div>
                </div>
            </div>

            ${utenteAttuale.ruolo === 'MASTER' ? `
            <!-- ROW: Diagnostica Sync -->
            <div class="settings-row" onclick="toggleSettingsSection('section-diag-sync', this); if(document.getElementById('section-diag-sync').style.display==='block') _aggiornaDiagnosticaSync()">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-stethoscope"></i></div>
                    <div>
                        <div class="settings-row-title">Diagnostica Sync</div>
                        <div class="settings-row-sub">Revisione, polling e cache in tempo reale</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-diag-sync" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div style="display:grid;grid-template-columns:max-content 1fr;gap:6px 12px;font-size:0.86rem;align-items:baseline">
                        <span style="font-weight:600;color:#64748b">Revision attuale:</span>
                        <span id="diag-revision" style="font-family:monospace;color:#1e293b">—</span>
                        <span style="font-weight:600;color:#64748b">Ultimo check:</span>
                        <span id="diag-lastcheck" style="font-family:monospace;color:#1e293b">—</span>
                        <span style="font-weight:600;color:#64748b">Utenti online:</span>
                        <span id="diag-online" style="color:#1e293b">—</span>
                        <span style="font-weight:600;color:#64748b">Cache IndexedDB:</span>
                        <div id="diag-cache" style="color:#1e293b">—</div>
                    </div>
                    <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
                        <button onclick="_aggiornaDiagnosticaSync()" style="padding:8px 14px;font-size:0.83rem;font-weight:600;border-radius:9px;border:1px solid #e2e8f0;background:#fff;color:#1e293b;cursor:pointer">
                            <i class="fas fa-sync-alt"></i> Aggiorna
                        </button>
                        <button onclick="_forceRevisionBump()" style="padding:8px 14px;font-size:0.83rem;font-weight:600;border-radius:9px;border:1px solid #fcd34d;background:#fefce8;color:#92400e;cursor:pointer">
                            <i class="fas fa-broadcast-tower"></i> Forza refresh globale
                        </button>
                        <button onclick="_svuotaCacheLocale()" style="padding:8px 14px;font-size:0.83rem;font-weight:600;border-radius:9px;border:1px solid #fca5a5;background:#fff5f5;color:#b91c1c;cursor:pointer">
                            <i class="fas fa-trash-alt"></i> Svuota cache locale
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}

        </div>

        <div class="centered-fullwidth my-30">
            <button type="button" class="${TW.btnPrimaryLg || 'inline-flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] transition shadow-sm'}" onclick="salvaTutteImpostazioni()">
                <i class="fas fa-save"></i> Salva Modifiche
            </button>
        </div>
    `;
    applicaFade(contenitore);
    requestAnimationFrame(() => _qrRenderListaCanvas());
    initSortable('lista-stati-config', (container) => {
        const rows = [...container.querySelectorAll('[data-idx]')];
        const nuovoOrdine = rows.map(el => (window.listaStati || [])[+el.dataset.idx]);
        if (window.listaStati) {
            window.listaStati.length = 0;
            nuovoOrdine.forEach((s, i) => { window.listaStati.push(s); rows[i].dataset.idx = i; });
        }
        segnaModifica();
    });
}

/* ── Diagnostica Sync (solo MASTER) ────────────────────────────────── */
async function _aggiornaDiagnosticaSync() {
    const elRev   = document.getElementById('diag-revision');
    const elCheck = document.getElementById('diag-lastcheck');
    const elOnl   = document.getElementById('diag-online');
    const elCache = document.getElementById('diag-cache');
    if (!elRev) return;

    elRev.textContent = RevisionPoller.lastRevisionValue !== null
        ? String(RevisionPoller.lastRevisionValue) : '—';

    if (RevisionPoller.lastCheckTs) {
        const d = new Date(RevisionPoller.lastCheckTs);
        elCheck.textContent = d.toLocaleTimeString('it-IT');
    } else {
        elCheck.textContent = '—';
    }

    const ol = RevisionPoller.lastOnlineList;
    if (ol && ol.length > 0) {
        elOnl.textContent = ol.map(u => u.nome + (u.pagina ? ' (' + u.pagina + ')' : '')).join(', ');
    } else {
        elOnl.textContent = 'Nessuno';
    }

    try {
        const entries = await ProdCache.listEntries();
        if (!entries.length) {
            elCache.textContent = 'Vuota';
        } else {
            elCache.innerHTML = entries.map(entry => {
                const age = Math.round((Date.now() - entry.timestamp) / 1000);
                const stale = (Date.now() - entry.timestamp) > ProdCache.TTL;
                return `<span style="display:block;font-family:monospace;font-size:0.78rem;color:${stale ? '#ef4444' : '#16a34a'}">${entry.chiave} <em style="color:#94a3b8">(${age}s fa${stale ? ' · stale' : ''})</em></span>`;
            }).join('');
        }
    } catch (_) {
        elCache.textContent = 'Errore lettura cache';
    }
}

async function _forceRevisionBump() {
    try {
        const resp = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'forceRevisionBump', sessionToken: window._getSessionToken_() })
        });
        const r = await resp.json();
        if (r && r.status === 'ok') {
            notificaElegante('✔ Revision bumped a ' + r.nuovaRevision + ' — tutti i client aggiorneranno entro 15s');
        } else if (r && r.status === 'auth_error') {
            if (window._gestisciAuthError_) window._gestisciAuthError_(r.message);
        } else {
            notificaElegante('⚠️ ' + (r && r.message ? r.message : 'Errore'), 'error');
        }
    } catch (e) {
        notificaElegante('⚠️ Errore di rete', 'error');
    }
}

async function _svuotaCacheLocale() {
    if (!confirm('Svuota la cache IndexedDB e ricarica la pagina?')) return;
    try { await ProdCache.clear(); } catch (_) {}
    location.reload();
}

function azioneEliminaStato(i) {
    if (confirm("Sei sicuro di voler eliminare questo stato?")) {
        (window.listaStati || []).splice(i, 1);
        segnaModifica();
        caricaInterfacciaImpostazioni();
    }
}

function azioneAggiungiStato() {
    (window.listaStati || []).push({nome: 'NUOVO', colore: '#94a3b8'});
    segnaModifica();
    caricaInterfacciaImpostazioni();
}

function segnaModifica() {
    window.modifichePendenti = true;
    const btn = document.getElementById('btn-salva-globale');
    if (btn) {
        btn.style.background = "#ef4444";
        btn.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Salva Modifiche Ora!";
    }
}

// Sortable generico: DnD fluido su qualsiasi lista, senza re-render
function initSortable(containerId, onReorder) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let dragSrc = null;

    container.addEventListener('dragstart', function(e) {
        const hasHandle = !!container.querySelector('.dnd-handle, .drag-handle');
        if (hasHandle && !e.target.closest('.dnd-handle, .drag-handle')) return;
        dragSrc = e.target.closest('[draggable="true"]');
        if (!dragSrc || !container.contains(dragSrc)) { dragSrc = null; return; }
        dragSrc.classList.add('dnd-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        if (!dragSrc) return;
        const over = e.target.closest('[draggable="true"]');
        if (!over || over === dragSrc || !container.contains(over)) return;
        const rect = over.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
            container.insertBefore(dragSrc, over);
        } else {
            container.insertBefore(dragSrc, over.nextSibling);
        }
    });

    container.addEventListener('dragend', function(e) {
        if (dragSrc) {
            dragSrc.classList.remove('dnd-dragging');
            if (onReorder) onReorder(container);
        }
        dragSrc = null;
    });

    container.addEventListener('drop', function(e) { e.preventDefault(); e.stopPropagation(); });

    // ── Touch DnD (mobile) ───────────────────────────────────────
    let touchSrc = null;
    let touchGhost = null;
    let touchOffX = 0, touchOffY = 0;

    container.addEventListener('touchstart', function(e) {
        const hasHandle = !!container.querySelector('.dnd-handle, .drag-handle');
        const src = e.target.closest('[draggable="true"]');
        if (!src || !container.contains(src)) return;
        if (hasHandle && !e.target.closest('.dnd-handle, .drag-handle')) return;
        touchSrc = src;
        const t = e.touches[0];
        const r = src.getBoundingClientRect();
        touchOffX = t.clientX - r.left;
        touchOffY = t.clientY - r.top;
        touchGhost = src.cloneNode(true);
        touchGhost.style.cssText = `position:fixed;width:${r.width}px;height:${r.height}px;opacity:0.85;pointer-events:none;z-index:99999;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.25);left:${r.left}px;top:${r.top}px;transition:none;transform:scale(1.04) rotate(-1deg);`;
        document.body.appendChild(touchGhost);
        src.style.opacity = '0.25';
        src.style.transform = 'scale(0.97)';
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
        if (!touchSrc || !touchGhost) return;
        e.preventDefault();
        const t = e.touches[0];
        touchGhost.style.left = (t.clientX - touchOffX) + 'px';
        touchGhost.style.top  = (t.clientY - touchOffY) + 'px';
        touchGhost.style.display = 'none';
        const below = document.elementFromPoint(t.clientX, t.clientY);
        touchGhost.style.display = '';
        const over = below?.closest('[draggable="true"]');
        if (over && over !== touchSrc && container.contains(over)) {
            const rect = over.getBoundingClientRect();
            container.insertBefore(touchSrc, t.clientY < rect.top + rect.height / 2 ? over : over.nextSibling);
        }
    }, { passive: false });

    container.addEventListener('touchend', function() {
        if (!touchSrc) return;
        touchSrc.style.opacity = '';
        touchSrc.style.transform = '';
        if (touchGhost) { touchGhost.remove(); touchGhost = null; }
        if (onReorder) onReorder(container);
        touchSrc = null;
    });
}

async function salvaTutteImpostazioni() {
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'salva_impostazioni_globali', stati: window.listaStati || [], operatori: [] })
        });
        const json = await res.json().catch(() => ({}));
        if (json.status === 'success') {
            notificaElegante('Impostazioni salvate correttamente!');
            window.modifichePendenti = false;
            const btn = document.getElementById('btn-salva-globale');
            if (btn) {
                btn.style.background = '';
                btn.innerHTML = "<i class='fas fa-save'></i> Salva Impostazioni";
            }
            _lsCacheDel('_impostazioni_cache');
            if (window.cacheContenuti) Object.keys(window.cacheContenuti).forEach(k => delete window.cacheContenuti[k]);
            Object.keys(localStorage).filter(k => k.startsWith('_html_')).forEach(k => localStorage.removeItem(k));
            await _fetchImpostazioniDaServer();
        } else {
            notificaElegante('Errore: ' + (json.message || 'risposta inattesa dal server'), 'error');
        }
    } catch (e) {
        notificaElegante('Errore nel salvataggio.', 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SEZIONE QR CODE — SCANSIONE POSTAZIONE
// ═══════════════════════════════════════════════════════════════════════════════

/** Array postazioni (sorgente dati). Salvato in localStorage. */
let _qrPostazioniArr = [];

/** Dizionario codice→postazione (usato dallo scanner). Ricostruito da _qrPostazioniArr. */
let QR_POSTAZIONI = {};

function _qrCaricaPostazioni() {
    try {
        const saved = localStorage.getItem('qrPostazioni');
        _qrPostazioniArr = saved ? JSON.parse(saved) : [...POSTAZIONI];
    } catch { _qrPostazioniArr = [...POSTAZIONI]; }
    _qrRicostruisciDict();
}
function _qrSalvaPostazioniLS() {
    try { localStorage.setItem('qrPostazioni', JSON.stringify(_qrPostazioniArr)); } catch {}
    _qrRicostruisciDict();
}
function _qrRicostruisciDict() {
    QR_POSTAZIONI = {};
    _qrPostazioniArr.forEach(p => { QR_POSTAZIONI[p.codice.toUpperCase()] = p; });
}

let _qrStream            = null;  // MediaStream attivo
let _qrAnimFrame         = null;  // requestAnimationFrame handle
let _qrPostazioneAttuale = null;
let _qrStatoScelto       = null;
let _qrOrdineSelezionato = null;

/** Rilevamento iOS PWA (standalone) */
function _isIosPwa() {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const standalone = window.navigator.standalone === true ||
                       window.matchMedia('(display-mode: standalone)').matches;
    return ios && standalone;
}

/** Apre il modale scanner QR e avvia la fotocamera posteriore. */
let _apriScannerQRLock = false;
async function apriScannerQR() {
    if (_apriScannerQRLock) return;
    _apriScannerQRLock = true;
    setTimeout(() => { _apriScannerQRLock = false; }, 800);

    const modal  = document.getElementById('modal-qr-scanner');
    const errDiv = document.getElementById('qr-error-msg');
    if (!modal) return;

    if (errDiv) errDiv.style.display = 'none';
    const mi = document.getElementById('qr-manual-input');
    if (mi) mi.value = '';

    // ── iOS PWA: usa input file per evitare ReplayKit / recording indicator ──
    if (_isIosPwa()) {
        const input = document.createElement('input');
        input.type    = 'file';
        input.accept  = 'image/*';
        input.capture = 'environment';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.onchange = () => {
            const file = input.files && input.files[0];
            document.body.removeChild(input);
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const img = new Image();
                img.onload = () => {
                    if (typeof jsQR === 'undefined') {
                        alert('⚠️ Libreria scanner non caricata. Usa il campo manuale.');
                        return;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width; canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
                    if (code && code.data) {
                        try { if (navigator.vibrate) navigator.vibrate(80); } catch {}
                        _processaQR(code.data.trim());
                    } else {
                        modal.style.display = 'flex';
                        modal.offsetHeight;
                        modal.classList.add('active');
                        if (errDiv) { errDiv.textContent = '⚠️ QR non riconosciuto nell\'immagine. Riprova o usa il campo manuale.'; errDiv.style.display = 'block'; }
                    }
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.oncancel = () => document.body.removeChild(input);
        input.click();
        return;
    }

    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');

    if (typeof jsQR === 'undefined') {
        if (errDiv) { errDiv.textContent = '⚠️ Libreria scanner non caricata. Usa il campo manuale.'; errDiv.style.display = 'block'; }
        return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (errDiv) { errDiv.textContent = '⚠️ Fotocamera non supportata da questo browser. Usa il campo manuale.'; errDiv.style.display = 'block'; }
        return;
    }
    try {
        if (!_qrStream || !_qrStream.active) {
            _qrStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
            try { localStorage.setItem('qrCameraGranted', '1'); } catch {}
        }
        const video = document.getElementById('qr-video');
        video.srcObject = _qrStream;
        await video.play();
        _avviaScansione();
    } catch (err) {
        let msg = '⚠️ Impossibile avviare la fotocamera.';
        if (err.name === 'NotAllowedError')  msg = '⚠️ Permesso fotocamera negato. Abilitalo dalle impostazioni del browser, poi riprova.';
        if (err.name === 'NotFoundError')    msg = '⚠️ Nessuna fotocamera trovata sul dispositivo.';
        if (err.name === 'NotReadableError') msg = '⚠️ Fotocamera occupata da un\'altra applicazione.';
        if (errDiv) { errDiv.textContent = msg; errDiv.style.display = 'block'; }
    }
}

/** Loop di scansione: legge ogni frame con jsQR. */
function _avviaScansione() {
    const video  = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');

    function scan() {
        if (!_qrStream) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width  = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
            if (code && code.data) {
                try { if (navigator.vibrate) navigator.vibrate(80); } catch {}
                _chiudiScannerQR();
                _processaQR(code.data.trim());
                return;
            }
        }
        _qrAnimFrame = requestAnimationFrame(scan);
    }
    _qrAnimFrame = requestAnimationFrame(scan);
}

/** Ferma la fotocamera (stoppa stream + cancelAnimationFrame) e chiude il modale scanner. */
function _chiudiScannerQR() {
    if (_qrAnimFrame) { cancelAnimationFrame(_qrAnimFrame); _qrAnimFrame = null; }
    // Stoppa tutti i track dello stream per rilasciare la fotocamera
    if (_qrStream) {
        _qrStream.getTracks().forEach(t => t.stop());
        _qrStream = null;
    }
    const video = document.getElementById('qr-video');
    if (video) { video.pause(); video.srcObject = null; }
    const modal = document.getElementById('modal-qr-scanner');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

/** Interpreta il codice QR scansionato. */
function _processaQR(codice) {
    if (!codice) return;
    const postazione = QR_POSTAZIONI[codice.toUpperCase()];
    if (!postazione) {
        notificaElegante('⚠️ QR non riconosciuto come postazione: ' + codice, 'error');
        return;
    }
    _qrPostazioneAttuale = { codice: codice.toUpperCase(), ...postazione };
    _apriModalePostazione();
}

/** Apre il modale di azione postazione (dopo QR riconosciuto). */
function _apriModalePostazione() {
    const post = _qrPostazioneAttuale;
    if (!post) return;

    _qrOrdineSelezionato = null;
    _qrStatoScelto       = null;

    document.getElementById('qr-badge-nome').textContent = post.icona + '  ' + post.nome;
    document.getElementById('qr-azione-domanda').textContent = post.domanda;

    const si = document.getElementById('qr-search-input');
    if (si) { si.value = ''; setTimeout(() => si.focus(), 350); }
    const dd = document.getElementById('qr-search-dropdown');
    if (dd) { dd.style.display = 'none'; dd.innerHTML = ''; }

    document.getElementById('qr-articoli-wrap').style.display = 'none';
    document.getElementById('qr-stato-wrap').style.display    = 'none';
    document.getElementById('btn-qr-conferma').disabled       = true;

    // Pre-carica cache ordini se vuota
    const _ordiniAutocompleteCache = window._ordiniAutocompleteCache || [];
    if (_ordiniAutocompleteCache.length === 0) {
        window.fetchJson('PROGRAMMA PRODUZIONE DEL MESE').then(dati => {
            const seen = new Set();
            window._ordiniAutocompleteCache = dati
                .filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE')
                .map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '', riferimento: r.riferimento || '' }))
                .filter(o => { if (!o.ordine || seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });
        }).catch(() => {});
    }

    const modal = document.getElementById('modal-qr-azione');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

/** Chiude il modale azione postazione. */
function _chiudiModaleQRAzione() {
    const modal = document.getElementById('modal-qr-azione');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
    _qrPostazioneAttuale = null;
    _qrOrdineSelezionato = null;
    _qrStatoScelto       = null;
}

/** Filtra gli ordini nel dropdown mentre l'utente digita. */
function _qrFiltroOrdini(q) {
    const dropdown = document.getElementById('qr-search-dropdown');
    if (!dropdown) return;
    const query = (q || '').trim().toLowerCase();

    document.getElementById('qr-articoli-wrap').style.display = 'none';
    document.getElementById('qr-stato-wrap').style.display    = 'none';
    document.getElementById('btn-qr-conferma').disabled       = true;
    _qrOrdineSelezionato = null;
    _qrStatoScelto       = null;

    if (!query) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }

    const _ordiniAutocompleteCache = window._ordiniAutocompleteCache || [];
    const matches = _ordiniAutocompleteCache.filter(o =>
        o.ordine.toLowerCase().includes(query) ||
        o.cliente.toLowerCase().includes(query) ||
        (o.riferimento || '').toLowerCase().includes(query)
    ).slice(0, 8);

    if (matches.length === 0) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }

    dropdown.innerHTML = matches.map(o => `
        <div class="autocomplete-item"
             onmousedown="event.preventDefault(); _qrSelezionaOrdine('${o.ordine.replace(/'/g,"\\'")}','${o.cliente.replace(/'/g,"\\'")}')"
             ontouchend="event.preventDefault(); _qrSelezionaOrdine('${o.ordine.replace(/'/g,"\\'")}','${o.cliente.replace(/'/g,"\\'")}')">
            <span class="ac-ordine">ORD. ${_esc(o.ordine)}</span>
            <span class="ac-cliente">${_esc(o.cliente)}${o.riferimento ? ' <em style="color:#94a3b8;font-size:11px">('+_esc(o.riferimento)+')</em>' : ''}</span>
        </div>`).join('');
    dropdown.style.display = 'block';
}

/** Seleziona un ordine dal dropdown e mostra i suoi articoli. */
async function _qrSelezionaOrdine(nOrd, cliente) {
    const si = document.getElementById('qr-search-input');
    if (si) si.value = `ORD. ${nOrd} — ${cliente}`;
    const dd = document.getElementById('qr-search-dropdown');
    if (dd) { dd.style.display = 'none'; dd.innerHTML = ''; }

    _qrOrdineSelezionato = nOrd;

    const articoliWrap = document.getElementById('qr-articoli-wrap');
    const articoliList = document.getElementById('qr-articoli-list');
    const ordHdr       = document.getElementById('qr-ordine-header');
    if (ordHdr) ordHdr.innerHTML = `<span class="qr-ord-lbl"><b>ORD. ${_esc(nOrd)}</b></span><span class="qr-cli-lbl">${_esc(cliente)}</span>`;
    if (articoliList) articoliList.innerHTML = '<div class="qr-loading"><i class="fas fa-spinner fa-spin"></i> Caricamento articoli...</div>';
    articoliWrap.style.display = 'block';

    let righe = [];
    const _attiviProd = window._attiviProd || [];
    if (_attiviProd.length > 0) {
        righe = _attiviProd.filter(r =>
            String(r.ordine || '').trim() === String(nOrd).trim() &&
            String(r.archiviato || '').toUpperCase() !== 'TRUE'
        );
    }
    if (righe.length === 0) {
        try {
            const tutti = await window.fetchJson('PROGRAMMA PRODUZIONE DEL MESE');
            righe = tutti.filter(r =>
                String(r.ordine || '').trim() === String(nOrd).trim() &&
                String(r.archiviato || '').toUpperCase() !== 'TRUE'
            );
        } catch {
            if (articoliList) articoliList.innerHTML = '<div class="qr-loading" style="color:#ef4444">Errore caricamento. Riprova.</div>';
            return;
        }
    }

    if (righe.length === 0) {
        if (articoliList) articoliList.innerHTML = '<div class="qr-loading">Nessun articolo attivo trovato per questo ordine.</div>';
        return;
    }

    const listaStati = window.listaStati || [];
    articoliList.innerHTML = righe.map(art => {
        const codice   = art.codice && art.codice !== 'false' ? art.codice : 'Senza Codice';
        const statoConf = listaStati.find(s => s.nome.toUpperCase() === (art.stato || '').toUpperCase()) || { colore: '#94a3b8' };
        return `
        <label class="qr-articolo-row" for="qr-art-${art.id_riga}">
            <input type="checkbox" id="qr-art-${art.id_riga}" class="qr-art-chk" data-id-riga="${art.id_riga}" checked>
            <div class="qr-art-info">
                <span class="qr-art-codice">${codice}</span>
                <span class="qr-art-qty">× ${art.qty}</span>
                <span class="qr-art-stato-badge" style="border-color:${statoConf.colore};color:${statoConf.colore}">${(art.stato || 'IN ATTESA').toUpperCase()}</span>
            </div>
        </label>`;
    }).join('');

    document.querySelectorAll('.qr-art-chk').forEach(c => c.addEventListener('change', _qrAggiornaBtnConferma));

    _qrRenderStatoPills();
    document.getElementById('qr-stato-wrap').style.display = 'block';
    _qrAggiornaBtnConferma();
}

/** Renderizza i pill degli stati disponibili, pre-selezionando quello della postazione. */
function _qrRenderStatoPills() {
    const post     = _qrPostazioneAttuale;
    const pillsDiv = document.getElementById('qr-stato-pills');
    if (!pillsDiv) return;

    const statoDefault = post ? post.statoDefault.toUpperCase() : '';
    const listaStati = window.listaStati || [];
    const stati = (listaStati.length > 0) ? listaStati : [
        { nome: 'IN ATTESA',                    colore: '#94a3b8' },
        { nome: 'PREPARARE PER LAVORAZIONE',    colore: '#64748b' },
        { nome: 'IN LAVORAZIONE',               colore: '#f59e0b' },
        { nome: 'IN PRODUZIONE',                colore: '#242424' },
        { nome: 'IMBALLATO',                    colore: '#22c55e' }
    ];

    _qrStatoScelto = null;
    pillsDiv.innerHTML = stati.map(s => {
        const isSel = s.nome.toUpperCase() === statoDefault;
        if (isSel) _qrStatoScelto = s.nome;
        return `<button type="button"
                    class="qr-stato-pill${isSel ? ' qr-stato-pill-sel' : ''}"
                    data-stato="${s.nome}"
                    style="border-color:${s.colore};${isSel ? 'background:'+s.colore+';color:#fff' : 'color:'+s.colore}"
                    onclick="_qrScegliStato(this,'${s.nome.replace(/'/g,"\\'")}')">
                    <span class="qr-pill-dot" style="background:${s.colore}"></span>
                    ${s.nome}
                </button>`;
    }).join('');
}

/** Seleziona uno stato tra i pill. */
function _qrScegliStato(btn, stato) {
    _qrStatoScelto = stato;
    const listaStati = window.listaStati || [];
    document.querySelectorAll('.qr-stato-pill').forEach(p => {
        const conf = listaStati.find(x => x.nome === p.dataset.stato);
        const col  = conf ? conf.colore : '#94a3b8';
        p.classList.remove('qr-stato-pill-sel');
        p.style.background = '';
        p.style.color      = col;
        p.style.borderColor= col;
    });
    const conf = listaStati.find(x => x.nome === btn.dataset.stato);
    const col  = conf ? conf.colore : '#94a3b8';
    btn.classList.add('qr-stato-pill-sel');
    btn.style.background = col;
    btn.style.color      = '#fff';
    btn.style.borderColor= col;
    _qrAggiornaBtnConferma();
}

function _qrSelezionaTutti()    { document.querySelectorAll('.qr-art-chk').forEach(c => c.checked = true);  _qrAggiornaBtnConferma(); }
function _qrDeselezionaTutti()  { document.querySelectorAll('.qr-art-chk').forEach(c => c.checked = false); _qrAggiornaBtnConferma(); }

function _qrAggiornaBtnConferma() {
    const btn = document.getElementById('btn-qr-conferma');
    if (!btn) return;
    const n = document.querySelectorAll('.qr-art-chk:checked').length;
    btn.disabled = !(n > 0 && _qrStatoScelto);
}

/** Aggiorna lo stato di tutti gli articoli selezionati e chiude il modale. */
async function _confermaSpostaPostazione() {
    if (!_qrStatoScelto || !_qrOrdineSelezionato) return;
    const checkboxes = Array.from(document.querySelectorAll('.qr-art-chk:checked'));
    if (checkboxes.length === 0) { notificaElegante('Seleziona almeno un articolo.', 'error'); return; }

    const btn = document.getElementById('btn-qr-conferma');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvataggio...'; }

    const idRighe = checkboxes.map(c => c.dataset.idRiga);

    const statiPrec = {};
    const _attiviProd = window._attiviProd || [];
    idRighe.forEach(idRiga => {
        const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
        statiPrec[idRiga] = r ? r.stato : null;
    });

    // Optimistic: aggiorna cache + kanban SUBITO
    idRighe.forEach(idRiga => {
        const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
        if (r) r.stato = _qrStatoScelto;
        if (window._syncKanbanFromStato) window._syncKanbanFromStato(idRiga, _qrStatoScelto);
    });

    // Backend
    let errori = 0;
    const falliti = [];
    for (const idRiga of idRighe) {
        const ok = await window.aggiornaDato(null, idRiga, 'stato', _qrStatoScelto, true);
        if (!ok) { errori++; falliti.push(idRiga); }
    }

    if (errori === 0) {
        notificaElegante(`✅ ${idRighe.length} articolo/i → ${_qrStatoScelto}`);
        if (window.cacheContenuti) delete window.cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
        _lsCacheDel('_html_PROGRAMMA PRODUZIONE DEL MESE');
        ProdCache.invalidate('PROGRAMMA_PRODUZIONE').catch(() => {});
    } else {
        // Rollback righe fallite
        falliti.forEach(idRiga => {
            const prev = statiPrec[idRiga];
            const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
            if (prev && r) r.stato = prev;
            if (prev && window._syncKanbanFromStato) window._syncKanbanFromStato(idRiga, prev);
        });
        notificaElegante(`⚠️ ${errori} errori su ${idRighe.length} articoli — riprova`, 'error');
        console.error('[QR Postazione] Rollback', { falliti, statiPrec });
    }
    _chiudiModaleQRAzione();
}

/* ═══════════════════════════════════════════════════════════════════
   GESTIONE POSTAZIONI — IMPOSTAZIONI (CRUD)
═══════════════════════════════════════════════════════════════════ */

function _qrApriModalNuova() {
    _qrApriModalEdit(null);
}

function _qrApriModalModifica(idx) {
    _qrApriModalEdit(idx);
}

function _qrApriModalEdit(idx) {
    const isNuova = idx === null || idx === undefined;
    const p = isNuova ? { icona: '📍', nome: '', codice: '', domanda: '', statoDefault: '' } : _qrPostazioniArr[idx];

    document.getElementById('qr-edit-titolo').innerHTML =
        `<i class="fas fa-map-marker-alt" style="margin-right:8px"></i>${isNuova ? 'Nuova Postazione' : 'Modifica Postazione'}`;
    document.getElementById('qr-edit-icona').value   = p.icona    || '';
    document.getElementById('qr-edit-nome').value    = p.nome     || '';
    document.getElementById('qr-edit-codice').value  = p.codice   || '';
    document.getElementById('qr-edit-domanda').value = p.domanda  || '';
    document.getElementById('qr-edit-idx').value     = isNuova ? '' : idx;

    const sel = document.getElementById('qr-edit-stato');
    const listaStati = window.listaStati || [];
    const stati = (listaStati.length > 0) ? listaStati : POSTAZIONI.map(d => ({ nome: d.statoDefault, colore: '#94a3b8' }));
    const unici = [...new Map(stati.map(s => [s.nome, s])).values()];
    sel.innerHTML = unici.map(s =>
        `<option value="${s.nome}" ${s.nome === (p.statoDefault || '') ? 'selected' : ''}>${s.nome}</option>`
    ).join('');

    const modal = document.getElementById('modal-qr-edit');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');

    requestAnimationFrame(() => _qrAggiornaPrevQR());
}

function _qrChiudiModalEdit() {
    const modal = document.getElementById('modal-qr-edit');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

function _qrAggiornaCodice() {
    const nome   = (document.getElementById('qr-edit-nome')?.value || '').trim();
    const codice = 'PROD:' + nome.toUpperCase()
        .replace(/[ÀÁÂÃÄÅ]/g, 'A').replace(/[ÈÉÊË]/g, 'E').replace(/[ÌÍÎÏ]/g, 'I')
        .replace(/[ÒÓÔÕÖ]/g, 'O').replace(/[ÙÚÛÜ]/g, 'U')
        .replace(/[^A-Z0-9]/g, '');
    const el = document.getElementById('qr-edit-codice');
    if (el) el.value = codice;
}

function _qrRicalcolaCodice() {
    _qrAggiornaCodice();
    _qrAggiornaPrevQR();
}

async function _qrAggiornaPrevQR() {
    const codice = (document.getElementById('qr-edit-codice')?.value || '').trim();
    const nome   = (document.getElementById('qr-edit-nome')?.value  || '').trim();
    const img    = document.getElementById('qr-preview-canvas');
    const nomeEl = document.getElementById('qr-preview-nome');
    const codEl  = document.getElementById('qr-preview-codice');
    if (nomeEl) nomeEl.textContent = nome || '—';
    if (codEl)  codEl.textContent  = codice || '—';
    if (!img || !codice) return;
    try {
        if (typeof QRCode !== 'undefined' && typeof QRCode.toDataURL === 'function') {
            img.src = await QRCode.toDataURL(codice, { width: 160, margin: 2, color: { dark: '#111827', light: '#ffffff' } });
        } else {
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(codice)}`;
        }
    } catch (e) {
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(codice)}`;
    }
}

function _qrSalvaPostazione() {
    const icona    = (document.getElementById('qr-edit-icona')?.value  || '').trim() || '📍';
    const nome     = (document.getElementById('qr-edit-nome')?.value   || '').trim();
    const codice   = (document.getElementById('qr-edit-codice')?.value || '').trim().toUpperCase();
    const domanda  = (document.getElementById('qr-edit-domanda')?.value|| '').trim();
    const stato    = document.getElementById('qr-edit-stato')?.value   || '';
    const idxStr   = document.getElementById('qr-edit-idx')?.value;

    if (!nome)   { notificaElegante('Inserisci un nome per la postazione.', 'error'); return; }
    if (!codice) { notificaElegante('Il codice QR non può essere vuoto.', 'error'); return; }

    const obj = { icona, nome, codice, domanda, statoDefault: stato };
    const idx = idxStr !== '' && idxStr !== null && idxStr !== undefined ? parseInt(idxStr) : null;

    if (idx !== null && !isNaN(idx)) {
        _qrPostazioniArr[idx] = obj;
    } else {
        _qrPostazioniArr.push(obj);
    }
    _qrSalvaPostazioniLS();
    _qrChiudiModalEdit();
    notificaElegante('✅ Postazione salvata.');
    caricaInterfacciaImpostazioni();
    setTimeout(() => _qrRiapriSezioneImpostazioni(), 120);
}

function _qrEliminaPostazione(idx) {
    const p = _qrPostazioniArr[idx];
    if (!p) return;
    mostraConferma(
        'Elimina Postazione',
        `Vuoi eliminare la postazione "${p.nome}"? Il QR code stampato associato non funzionerà più.`,
        () => {
            _qrPostazioniArr.splice(idx, 1);
            _qrSalvaPostazioniLS();
            notificaElegante('Postazione eliminata.');
            caricaInterfacciaImpostazioni();
            setTimeout(() => _qrRiapriSezioneImpostazioni(), 120);
        },
        'Elimina'
    );
}

function _qrRiapriSezioneImpostazioni() {
    const sec = document.getElementById('section-qr-postazioni');
    if (!sec) return;
    sec.style.display = 'block';
    const row = sec.previousElementSibling;
    if (row) {
        row.classList.add('settings-row-active');
        const arrow = row.querySelector('.settings-row-arrow');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
}

async function _qrRenderListaCanvas() {
    for (let i = 0; i < _qrPostazioniArr.length; i++) {
        const img = document.getElementById(`qr-list-canvas-${i}`);
        if (!img) continue;
        const codice = _qrPostazioniArr[i].codice || '';
        if (!codice) continue;
        try {
            if (typeof QRCode !== 'undefined' && typeof QRCode.toDataURL === 'function') {
                img.src = await QRCode.toDataURL(codice, { width: 56, margin: 1, color: { dark: '#0f172a', light: '#f8fafc' } });
            } else {
                img.src = `https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(codice)}`;
            }
        } catch (e) {
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(codice)}`;
        }
    }
}

function _qrStampaSingola() {
    const codice  = (document.getElementById('qr-edit-codice')?.value || '').trim();
    const nome    = (document.getElementById('qr-edit-nome')?.value   || '').trim();
    const icona   = (document.getElementById('qr-edit-icona')?.value  || '').trim() || '📍';
    const domanda = (document.getElementById('qr-edit-domanda')?.value|| '').trim();
    if (!codice) { notificaElegante('Inserisci nome e codice prima di stampare.', 'error'); return; }
    _qrApriFinestroStampa([{ codice, nome, icona, domanda }]);
}

function _qrStampaSingolaIdx(idx) {
    const p = _qrPostazioniArr[idx];
    if (p) _qrApriFinestroStampa([p]);
}

function _qrStampaTutte() {
    if (_qrPostazioniArr.length === 0) { notificaElegante('Nessuna postazione da stampare.', 'error'); return; }
    _qrApriFinestroStampa(_qrPostazioniArr);
}

async function _qrApriFinestroStampa(postazioni) {
    const items = await Promise.all(postazioni.map(async p => {
        let dataUrl = '';
        try {
            if (typeof QRCode !== 'undefined' && typeof QRCode.toDataURL === 'function')
                dataUrl = await QRCode.toDataURL(p.codice, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } });
        } catch {}
        if (!dataUrl) dataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(p.codice)}`;
        return { ...p, dataUrl };
    }));

    const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>QR Code Postazioni — PROD</title>
<style>
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Segoe UI',sans-serif; background:#fff; padding:20px; }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:24px; }
.card { background:#fff; border:2px solid #e2e8f0; border-radius:14px;
        padding:20px 16px 16px; text-align:center;
        page-break-inside:avoid; break-inside:avoid; display:flex; flex-direction:column; align-items:center; gap:10px; }
.card img { display:block; width:200px; height:200px; }
.nome { font-size:16px; font-weight:800; color:#0f172a; letter-spacing:0.3px; }
button { position:fixed; top:16px; right:16px; background:#111827; color:#fff;
         border:none; border-radius:10px; padding:9px 18px; font-size:13px;
         font-weight:700; cursor:pointer; z-index:999; }
@media print {
  body { padding:6px; }
  button { display:none; }
  .grid { grid-template-columns:repeat(3,1fr); gap:16px; }
  .card { border:1.5px solid #cbd5e1; }
}
</style>
</head>
<body>
<button onclick="window.print()">🖨️ Stampa</button>
<div class="grid">
${items.map(p => `
<div class="card">
  <img src="${p.dataUrl}" alt="QR ${p.nome}">
  <div class="nome">${p.icona || ''} ${p.nome}</div>
</div>`).join('')}
</div>
<script>setTimeout(()=>window.print(),800);<\/script>
</body>
</html>`;

    const _blob    = new Blob([html], { type: 'text/html; charset=utf-8' });
    const _blobUrl = URL.createObjectURL(_blob);
    const win = window.open(_blobUrl, '_blank', 'width=900,height=700');
    if (win) { setTimeout(() => URL.revokeObjectURL(_blobUrl), 30000); }
    else { URL.revokeObjectURL(_blobUrl); notificaElegante('⚠️ Abilita i popup per la stampa.', 'error'); }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { caricaInterfacciaImpostazioni, caricaDatiIniziali, _fetchImpostazioniDaServer };

export function registerGlobals() {
    // Avatar editor (desktop)
    window._avatarStartAdd        = _avatarStartAdd;
    window._avatarConfirmEdit     = _avatarConfirmEdit;
    window._avatarCancelEdit      = _avatarCancelEdit;
    window._avatarDeleteEdit      = _avatarDeleteEdit;
    window._avatarRipristinaPredefiniti = _avatarRipristinaPredefiniti;
    window._renderPredefinedSwatches    = _renderPredefinedSwatches;
    window._renderCustomSwatches       = _renderCustomSwatches;
    window._applyAvatarColorUI    = _applyAvatarColorUI;
    window._setAvatarColor        = _setAvatarColor;
    // Avatar editor (mobile)
    window._avatarStartAddMob     = _avatarStartAddMob;
    window._avatarConfirmEditMob  = _avatarConfirmEditMob;
    window._avatarCancelEditMob   = _avatarCancelEditMob;
    window._avatarDeleteEditMob   = _avatarDeleteEditMob;
    // Account menu
    window.toggleAccountMenu       = toggleAccountMenu;
    window.chiudiAccountMenu       = chiudiAccountMenu;
    window._aggiornaPagina         = _aggiornaPagina;
    window.toggleAccountMenuMobile = toggleAccountMenuMobile;
    window.chiudiAccountMenuMobile = chiudiAccountMenuMobile;
    // Push / Notifiche
    window._vapidB64ToUint8_       = _vapidB64ToUint8_;
    window._mostraDiagnosticaPush  = _mostraDiagnosticaPush;
    window._forzaRiregistraPush    = _forzaRiregistraPush;
    window._testPushNotifica       = _testPushNotifica;
    window._togglePushPermission   = _togglePushPermission;
    window._aggiornaUINotifiche    = _aggiornaUINotifiche;
    window._onNotifPrefChange      = _onNotifPrefChange;
    window._getNotifPrefs          = _getNotifPrefs;
    // CSV Import
    window.importaCSVDaFile        = importaCSVDaFile;
    window._chiudiCsvImportReviewModal_ = _chiudiCsvImportReviewModal_;
    // Pagina Impostazioni
    window.caricaInterfacciaImpostazioni = caricaInterfacciaImpostazioni;
    window.caricaDatiIniziali      = caricaDatiIniziali;
    window._fetchImpostazioniDaServer = _fetchImpostazioniDaServer;
    window.toggleSettingsSection   = toggleSettingsSection;
    window.caricaListaUtenti       = caricaListaUtenti;
    window.salvaModificheUtente    = salvaModificheUtente;
    window.apriFormNuovoUtente     = apriFormNuovoUtente;
    window.salvaUtenteNuovo        = salvaUtenteNuovo;
    window.eliminaUtente           = eliminaUtente;
    window._caricaSessionStats_    = _caricaSessionStats_;
    window._revocaSessioniUtenteDaUI  = _revocaSessioniUtenteDaUI_;
    window._revocaTutteSessioniDaUI   = _revocaTutteSessioniDaUI_;
    window._aggiornaDiagnosticaSync   = _aggiornaDiagnosticaSync;
    window._forceRevisionBump         = _forceRevisionBump;
    window._svuotaCacheLocale         = _svuotaCacheLocale;
    window.azioneEliminaStato      = azioneEliminaStato;
    window.azioneAggiungiStato     = azioneAggiungiStato;
    window.segnaModifica           = segnaModifica;
    window.salvaTutteImpostazioni  = salvaTutteImpostazioni;
    // QR Scanner
    window.apriScannerQR           = apriScannerQR;
    window._chiudiScannerQR        = _chiudiScannerQR;
    window._processaQR             = _processaQR;
    window._chiudiModaleQRAzione   = _chiudiModaleQRAzione;
    window._qrFiltroOrdini         = _qrFiltroOrdini;
    window._qrSelezionaOrdine      = _qrSelezionaOrdine;
    window._qrScegliStato          = _qrScegliStato;
    window._qrSelezionaTutti       = _qrSelezionaTutti;
    window._qrDeselezionaTutti     = _qrDeselezionaTutti;
    window._confermaSpostaPostazione = _confermaSpostaPostazione;
    // QR Postazioni CRUD
    window._qrApriModalNuova       = _qrApriModalNuova;
    window._qrApriModalModifica    = _qrApriModalModifica;
    window._qrChiudiModalEdit      = _qrChiudiModalEdit;
    window._qrAggiornaCodice       = _qrAggiornaCodice;
    window._qrRicalcolaCodice      = _qrRicalcolaCodice;
    window._qrSalvaPostazione      = _qrSalvaPostazione;
    window._qrEliminaPostazione    = _qrEliminaPostazione;
    window._qrStampaSingola        = _qrStampaSingola;
    window._qrStampaSingolaIdx     = _qrStampaSingolaIdx;
    window._qrStampaTutte          = _qrStampaTutte;
    window._qrAggiornaPrevQR       = _qrAggiornaPrevQR;
}

export function init() {
    // Carica postazioni QR da localStorage
    _qrCaricaPostazioni();

    // Account dropdown desktop — chiudi al click fuori
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('account-dropdown');
        const btn = document.getElementById('user-avatar-btn');
        if (dropdown && dropdown.classList.contains('open')) {
            if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        }
    });

    // Account dropdown mobile — chiudi al click fuori
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('account-dropdown-mobile');
        const btn = document.getElementById('user-avatar-btn-mobile');
        if (!dropdown || !btn) return;
        if (dropdown.classList.contains('open')) {
            if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        }
    });

    // Auto-chiudi fotocamera quando l'app va in background
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden' && _qrStream) {
            _chiudiScannerQR();
        }
    });
}

export default caricaInterfacciaImpostazioni;
