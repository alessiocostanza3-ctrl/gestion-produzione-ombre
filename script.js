/*******************************************************************************
* 1. CONFIGURAZIONE, VARIABILI GLOBALI E STATO
*******************************************************************************/
const URL_GOOGLE = "https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec";

// Fallback: se una sessione è già presente, nascondi subito l'overlay (evita blocchi/flicker
// se il browser ritarda l'esecuzione di window.onload).
try {
    if (localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente')) {
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'none';
    }
} catch (e) {}

let paginaAttuale = null; // NON leggere subito da localStorage
let modifichePendenti = false;
let listaOperatori = [];
let listaStati = [];
let tipoTrascinamento = "";
const cacheContenuti = {};
const cacheFetchTime = {}; // timestamp dell'ultimo fetch per pagina
const CACHE_TTL_MS = 30000; // 30 secondi: sotto questa soglia non fare background refresh

// ---- runtime guards (anti doppio init / race rendering) ----
let _bootCompleted = false;
let _pageInitDone = false;
let _bindingsInitDone = false;
let _navRequestSerial = 0;
let _latestNavRequest = 0;
let _navAbortController = null; // annulla fetch in-volo a ogni cambio pagina
let _lastNavClickTime = 0;     // debounce click rapidissimi (<80ms)

/*******************************************************************************
* NOTIFICHE PUSH  –  VAPID native (nessun servizio di terze parti)
* Chiavi gestite in Google Apps Script (ScriptProperties).
* Requisiti: browser con Push API; iPhone richiede iOS 16.4+ e PWA installata.
*******************************************************************************/

// Chiave VAPID pubblica (la privata sta SOLO in GAS > ScriptProperties)
const _VAPID_PUBLIC_KEY = 'BAHqp3uv56mQSAeTv_66-f4GYkzaESwuJNOP5DJCVMi197n-EKl9TW9XPrKeIIDpzBz0HTM42AcUCXWmOP5BSYI';

/**
 * Registra / aggiorna la sottoscrizione push VAPID per l'utente corrente.
 * Da chiamare dopo ogni login / avvio con sessione valida.
 */
async function _initPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('[Push] Non supportato da questo browser');
        return;
    }
    try {
        const reg = await navigator.serviceWorker.register('sw.js', { scope: './' });
        await navigator.serviceWorker.ready;
        console.log('[Push] SW pronto');
        // Salva username nel Cache API: accessibile dal Service Worker
        if ('caches' in window) {
            const c = await caches.open('prod-auth');
            await c.put('username', new Response(utenteAttuale.nome.toUpperCase()));
        }
        let sub = await reg.pushManager.getSubscription();
        const perm = Notification.permission;
        console.log('[Push] permesso=' + perm + ' sub=' + (sub ? sub.endpoint.substring(0,50) : 'null'));

        // Se il permesso è già stato concesso ma non c'è subscription → sottoscrivi automaticamente
        if (!sub && perm === 'granted') {
            try {
                sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: _vapidB64ToUint8_(_VAPID_PUBLIC_KEY)
                });
                console.log('[Push] Auto-subscribed:', sub.endpoint.substring(0, 60));
            } catch (subErr) {
                console.warn('[Push] Auto-subscribe failed:', subErr);
                try { localStorage.setItem('_pushStato', 'errore-subscribe'); } catch {}
                return;
            }
        }
        if (!sub) {
            console.log('[Push] Nessuna subscription e permesso non concesso');
            try { localStorage.setItem('_pushStato', 'no-permesso'); } catch {}
            return;
        }

        // Salva/aggiorna la subscription nel backend
        const j = sub.toJSON();
        const result = await _salvaSubVAPID_({ endpoint: j.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth });
        console.log('[Push] Subscription saved:', result);
        if (result && (result.status === 'saved' || result.status === 'updated')) {
            try { localStorage.setItem('_pushStato', 'ok'); } catch {}
        } else {
            try { localStorage.setItem('_pushStato', 'errore-salvataggio'); } catch {}
        }
        _aggiornaUINotifiche();
    } catch (err) {
        console.warn('[Push] initPush:', err);
        try { localStorage.setItem('_pushStato', 'errore:' + err.message); } catch {}
    }
}

/** Forza una ri-registrazione completa: unsubscribe + re-subscribe + salva su GAS */
async function _forzaRiregistraPush() {
    const btn = document.getElementById('btn-force-regpush');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Registrazione...'; }
    try {
        const reg = await navigator.serviceWorker.register('sw.js', { scope: './' });
        await navigator.serviceWorker.ready;
        // 1. Elimina subscription esistente
        let oldSub = await reg.pushManager.getSubscription();
        if (oldSub) {
            await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'eliminaSottoscrizione', endpoint: oldSub.endpoint }) }).catch(() => {});
            await oldSub.unsubscribe();
        }
        // 2. Crea subscription nuova
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
            notificaElegante('Permesso notifiche negato', 'error');
            if (btn) { btn.disabled = false; btn.textContent = '🔄 Ri-registra subscription'; }
            return;
        }
        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: _vapidB64ToUint8_(_VAPID_PUBLIC_KEY)
        });
        // 3. Salva username in Cache
        if ('caches' in window) {
            const c = await caches.open('prod-auth');
            await c.put('username', new Response(utenteAttuale.nome.toUpperCase()));
        }
        // 4. Salva su GAS
        const j = sub.toJSON();
        const result = await _salvaSubVAPID_({ endpoint: j.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth });
        if (result && (result.status === 'saved' || result.status === 'updated')) {
            try { localStorage.setItem('_pushStato', 'ok'); } catch {}
            notificaElegante('✅ Subscription registrata con successo!');
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
        console.log('[Push] testPush:', json);
        if (json.sent > 0) {
            notificaElegante('\uD83D\uDCE4 Test inviato a ' + json.sent + ' dispositivo/i \u2013 attendi la notifica');
        } else if (json.status === 'no_devices') {
            notificaElegante('\u26A0\uFE0F Nessun dispositivo registrato. Clicca prima "Ri-registra subscription".', 'error');
        } else {
            notificaElegante('\u26A0\uFE0F ' + (json.msg || 'Risposta inattesa dal server'), 'error');
        }
    } catch (err) {
        notificaElegante('Errore test push: ' + err.message, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '📨 Invia notifica di test'; }
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
    notificaElegante('Preferenze notifiche salvate ✓');
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
            // ── Disattiva ──────────────────────────────────────────────────
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
            // ── Attiva ─────────────────────────────────────────────────────
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') { notificaElegante('Permesso notifiche negato', 'error'); return; }
            sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: _vapidB64ToUint8_(_VAPID_PUBLIC_KEY)
            });
            const j = sub.toJSON();
            const saveResult = await _salvaSubVAPID_({ endpoint: j.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth });
            if (saveResult && (saveResult.status === 'saved' || saveResult.status === 'updated')) {
                try { localStorage.setItem('_pushStato', 'ok'); } catch {}
                notificaElegante('Notifiche push attivate ✓ (registrate su server)');
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
            if (ps === 'ok')                   statoServer = ' ✓ registrato sul server';
            else if (ps === 'errore-salvataggio') statoServer = ' ⚠ non salvato sul server';
            else if (ps === 'errore-subscribe')   statoServer = ' ⚠ errore subscribe';
            else if (ps && ps.startsWith('errore:')) statoServer = ' ⚠ ' + ps.replace('errore:', '');
        } catch {}
        if (btn)   btn.innerHTML = on
            ? '<i class="fas fa-bell-slash"></i> Disattiva notifiche'
            : '<i class="fas fa-bell"></i> Attiva notifiche push';
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

/** POST una subscription VAPID al backend GAS. */
async function _salvaSubVAPID_(sub) {
    try {
        // IMPORTANTE: nessun Content-Type custom → GAS non gestisce preflight CORS
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione:   'salvaSottoscrizione',
                username: utenteAttuale.nome.toUpperCase(),
                endpoint: sub.endpoint,
                p256dh:   sub.p256dh  || '',
                auth:     sub.auth    || ''
            })
        });
        const json = await res.json().catch(() => ({}));
        console.log('[Push] salvaSottoscrizione:', json);
        return json;
    } catch (err) {
        console.warn('[Push] _salvaSubVAPID_ error:', err);
    }
}

// ---- search optimisation helpers ----
let elementiDaFiltrareCache = null;
let ricercaTimeout = null;

// small DOM shortcuts
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Tailwind utility presets (keeps templates consistent + easy to tweak)
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

function aggiornaListaFiltrabili() {
    elementiDaFiltrareCache = document.querySelectorAll('.ordine-wrapper, .chat-card, .materiale-card');
}

// helper per richieste REST
// Cache raw ordini per autocomplete nel modal
let _ordiniAutocompleteCache = [];
let _attiviProd = [];  // cache per il chart overview nella pagina produzione

async function fetchJson(pagina, signal) {
    const url = URL_GOOGLE + "?pagina=" + encodeURIComponent(pagina);
    const res = await fetch(url, signal ? { signal } : {});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function applicaFade(elem) {
    if (elem) {
        elem.classList.add('fade-in');
        setTimeout(() => elem.classList.remove('fade-in'), 300);
    }
}



let utenteAttuale = {
    nome: "",
    ruolo: "",
    vistaSimulata: ""
};

window.onload = async function() {
    if (_bootCompleted) return;
    _bootCompleted = true;
    console.log("Inizializzazione sistema...");

    // 1. Gestione immediata dell'interfaccia per evitare "lampi"
    const overlay = document.getElementById('login-overlay');
    let sessione = null;
    try { sessione = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente'); } catch (e) {}

    if (sessione) {
        // Se c'è una sessione, la leggiamo subito
        utenteAttuale = JSON.parse(sessione);

        // AGGIORNAMENTO IMMEDIATO: Prima ancora di scaricare i dati da Sheets
        // Questo sovrascrive "MASTER" o "Caricamento..." all'istante
        aggiornaProfiloSidebar();
        _initPush();      // Registra / aggiorna subscription push VAPID

        if (overlay) overlay.style.display = 'none';
        console.log("Sessione trovata per:", utenteAttuale.nome);
    } else {
        // Se non c'è sessione, forziamo il login
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
    }

    try {
        // 2. CARICAMENTO DATI DAL SERVER (OPERATORI, ECC)
        if (typeof caricaDatiIniziali === "function") {
            await caricaDatiIniziali();
        }

        if (sessione) {
            // Verifica integrità sessione
            if (utenteAttuale.ruolo !== "MASTER" && !utenteAttuale.nome) {
                throw new Error("Sessione corrotta");
            }
            // Il caricamento della pagina è già gestito da DOMContentLoaded → cambiaPagina()
            // Non chiamare caricaPaginaRichieste() qui per evitare doppio caricamento
        }

    } catch (e) {
        console.warn("Errore caricamento dati iniziali:", e);
        let sessioneEsistente = null;
        try { sessioneEsistente = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente'); } catch (e) {}
        // Cancella sessione e mostra login SOLO se è esplicitamente corrotta
        // mai per errori di rete, timeout GAS o altri errori non critici
        if (e && e.message === "Sessione corrotta") {
            try { localStorage.removeItem('sessioneUtente'); } catch (e) {}
            try { sessionStorage.removeItem('sessioneUtente'); } catch (e) {}
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
        } else if (!sessioneEsistente) {
            // Nessuna sessione in localStorage → mostra login
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
        }
        // Se c'è una sessione valida, l'utente resta dentro — l'errore è solo di rete
    }
};






//ACCESSO E INIZIALIZZAZIONE//
function setLoginMode(mode) {
    const isAdmin = mode === 'admin';
    document.getElementById('login-view-utente').style.display = isAdmin ? 'none' : '';
    document.getElementById('login-view-admin').style.display  = isAdmin ? ''     : 'none';
    document.getElementById('login-error').innerText = '';
    if (isAdmin) setTimeout(() => document.getElementById('login-codice')?.focus(), 50);
}
function togglePasswordVisibility() {
    const pwd  = document.getElementById('login-password');
    const icon = document.getElementById('eye-icon');
    const isHidden = pwd.type === 'password';
    pwd.type = isHidden ? 'text' : 'password';
    icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
}
async function hashSHA256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
async function _verificaAccessoUtente() {
    const errorDiv = document.getElementById('login-error');
    errorDiv.innerText = "";
    errorDiv.style.color = "";

    const isAdmin = document.getElementById('login-view-admin')?.style.display !== 'none';

    // — Modalità ADMIN —
    if (isAdmin) {
        const codice = (document.getElementById('login-codice')?.value || '').trim();
        if (codice === '0000') {
            utenteAttuale = { nome: "MASTER", ruolo: "MASTER", vistaSimulata: "MASTER" };
            salvaEApriDashboard();
        } else {
            errorDiv.innerText = "Codice non valido.";
        }
        return;
    }

    // — Modalità UTENTE —
    const email    = (document.getElementById('login-email')?.value    || '').trim().toLowerCase();
    const username = (document.getElementById('login-username')?.value || '').trim();
    const password = (document.getElementById('login-password')?.value || '');
    if (!email || !username || !password) {
        errorDiv.innerText = "Compila tutti i campi: email, nome utente e password.";
        return;
    }
    const btn = document.getElementById('btn-login');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifica...';
    try {
        const hash = await hashSHA256(password);
        const res  = await fetch(`${URL_GOOGLE}?azione=verificaLogin&email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&hash=${encodeURIComponent(hash)}`);
        const r    = await res.json();
        if (r.status === "success") {
            utenteAttuale = { nome: r.nome, ruolo: r.ruolo, email: r.email, vistaSimulata: r.nome };
            salvaEApriDashboard();
        } else {
            errorDiv.innerText = r.message || "Credenziali non valide.";
        }
    } catch (e) {
        errorDiv.innerText = "Errore di connessione. Riprova.";
    }
    btn.disabled = false;
    btn.innerHTML = 'Entra nel Sistema <i class="fas fa-arrow-right"></i>';
}
async function _creaAccountUtente() {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) errorDiv.innerText = "";
    if (errorDiv) errorDiv.style.color = "";

    const email    = (document.getElementById('login-email')?.value    || '').trim().toLowerCase();
    const username = (document.getElementById('login-username')?.value || '').trim();
    const password = (document.getElementById('login-password')?.value || '');

    if (!email || !username || !password) {
        if (errorDiv) errorDiv.innerText = "Per creare l'account compila email, nome utente e password.";
        return;
    }

    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const oldLogin = btnLogin ? btnLogin.innerHTML : '';
    const oldSignup = btnSignup ? btnSignup.innerHTML : '';

    if (btnLogin) btnLogin.disabled = true;
    if (btnSignup) {
        btnSignup.disabled = true;
        btnSignup.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creazione...';
    }

    try {
        const hash = await hashSHA256(password);
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'creaUtentePubblico',
                email,
                username,
                hash
            })
        });
        const r = await res.json();

        if (r.status === 'success') {
            if (errorDiv) errorDiv.style.color = '#22c55e';
            if (errorDiv) errorDiv.innerText = 'Account creato. Accesso in corso...';
            await _verificaAccessoUtente();
        } else {
            if (errorDiv) errorDiv.style.color = '';
            if (errorDiv) errorDiv.innerText = r.message || 'Impossibile creare l\'account.';
        }
    } catch (e) {
        if (errorDiv) errorDiv.style.color = '';
        if (errorDiv) errorDiv.innerText = 'Errore di connessione. Riprova.';
    } finally {
        if (btnLogin) {
            btnLogin.disabled = false;
            btnLogin.innerHTML = oldLogin || 'Entra nel Sistema <i class="fas fa-arrow-right"></i>';
        }
        if (btnSignup) {
            btnSignup.disabled = false;
            btnSignup.innerHTML = oldSignup || '<i class="fas fa-user-plus"></i> Nuovo utente? Crea account';
        }
    }
}
function aggiornaProfiloSidebar() {
    const nomeDisplay = document.getElementById('user-name-display');
    const avatarIcon = document.getElementById('user-avatar-icon');
    const ddropAvatar = document.getElementById('account-ddrop-avatar');
    const ddropName = document.getElementById('account-ddrop-name');
    const ddropRole = document.getElementById('account-ddrop-role');

    if (utenteAttuale && utenteAttuale.nome) {
        const iniziale = utenteAttuale.nome.charAt(0).toUpperCase();
        const nomeUp = utenteAttuale.nome.toUpperCase();

        if (nomeDisplay) nomeDisplay.innerText = nomeUp;
        if (avatarIcon) avatarIcon.innerText = iniziale;
        if (ddropAvatar) ddropAvatar.innerText = iniziale;
        if (ddropName) ddropName.innerText = nomeUp;
        if (ddropRole) ddropRole.innerText = (utenteAttuale.ruolo || 'Utente').toUpperCase();
    }
    _initAvatarColor();
}

/** Restituisce il colore avatar salvato per un operatore (UPPERCASE). Fallback: grigio */
function _getOpColor(nome) {
    try {
        return localStorage.getItem('avatarColor_' + String(nome || '').toUpperCase().trim()) || '#374151';
    } catch { return '#374151'; }
}

/** Applica il colore al pulsante avatar, al ddrop-avatar, all'input colore e agli swatch */
const _PREDEFINED_AVATAR_COLORS = ['#8fe45e','#6366f1','#f59e0b','#ec4899','#06b6d4','#f87171','#a78bfa','#34d399'];
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
    _PREDEFINED_AVATAR_COLORS.forEach(color => {
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
    const container = document.getElementById('avatar-custom-swatches');
    if (!container) return;
    const recenti = _avatarLoadRecenti();
    container.innerHTML = '';
    recenti.forEach((color, idx) => {
        const btn = document.createElement('button');
        btn.className = 'avatar-color-swatch avatar-color-custom-swatch';
        btn.style.background = color;
        btn.dataset.color = color;
        btn.title = 'Clicca per modificare o eliminare';
        btn.onclick = (e) => { e.stopPropagation(); _avatarEditCustom(idx, e); };
        container.appendChild(btn);
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
        // Nuovo custom
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
    // Per predefiniti: il click applica il colore direttamente, ✓ lo conferma
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

function _applyAvatarColorUI(color) {
    const btn = document.getElementById('user-avatar-btn');
    const ddp = document.getElementById('account-ddrop-avatar');
    if (btn) {
        btn.style.setProperty('background', color, 'important');
        btn.style.setProperty('box-shadow', `0 2px 8px ${color}66`, 'important');
    }
    if (ddp) ddp.style.setProperty('background', color, 'important');
    document.querySelectorAll('.avatar-color-swatch').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.color === color);
    });
}

/** Imposta e salva il colore avatar per l'utente corrente */
function _setAvatarColor(color) {
    if (!utenteAttuale || !utenteAttuale.nome) return;
    const nomeKey = utenteAttuale.nome.toUpperCase().trim();
    try { localStorage.setItem('avatarColor_' + nomeKey, color); } catch {}
    _applyAvatarColorUI(color);
}

/** Legge il colore salvato e lo applica all'avvio */
function _initAvatarColor() {
    if (!utenteAttuale || !utenteAttuale.nome) return;
    const saved = _getOpColor(utenteAttuale.nome);
    _renderCustomSwatches();
    _applyAvatarColorUI(saved);
}

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

// Chiude il dropdown cliccando fuori
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('account-dropdown');
    const btn = document.getElementById('user-avatar-btn');
    if (dropdown && dropdown.classList.contains('open')) {
        if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    }
});

/* ---- SIDEBAR TOGGLE ---- */
function toggleSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    if (!sidebar) return;
    const isCollapsed = sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    try { localStorage.setItem('sidebarCollapsed', isCollapsed ? '1' : '0'); } catch(e) {}
}

function initSidebarState() {
    try {
        const saved = localStorage.getItem('sidebarCollapsed');
        const sidebar = document.getElementById('main-sidebar');
        if (saved === '1') {
            if (sidebar) sidebar.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        }
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', initSidebarState);
/* ---- FINE SIDEBAR TOGGLE ---- */ // QUESTA FUNZIONE È QUELLA CHE SCRIVE I DATI NELLA TUA SIDEBAR
async function salvaEApriDashboard() {
    try { localStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}
    try { sessionStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}

    const overlay = document.getElementById('login-overlay');
    overlay.style.transition = "opacity 0.4s ease";
    overlay.style.opacity = '0';

    // Carica impostazioni (stati, operatori, sezioni, ecc.) IN PARALLELO col fade
    // così quando la dashboard appare tutti i controlli sono già pronti.
    // L'errore di rete non blocca l'accesso: l'utente può rientrare normalmente.
    await Promise.all([
        caricaImpostazioni().catch(e => console.warn("caricaImpostazioni post-login:", e)),
        new Promise(r => setTimeout(r, 400))
    ]);

    overlay.style.display = 'none';
    if (typeof aggiornaProfiloSidebar === 'function') aggiornaProfiloSidebar();
    _initPush();      // Registra / aggiorna subscription push VAPID

    // Naviga alla pagina salvata (stessa logica del DOMContentLoaded normale)
    let paginaSalvata = null;
    try { paginaSalvata = localStorage.getItem('ultimaPaginaProduzione'); } catch (e) {}
    if (!paginaSalvata || paginaSalvata === "undefined" || paginaSalvata === "null") {
        paginaSalvata = "PROGRAMMA PRODUZIONE DEL MESE";
    }
    const tastoMenu = document.querySelector(`.menu-item[data-page="${paginaSalvata}"]`);
    cambiaPagina(paginaSalvata, tastoMenu);
}
function logout() {
    try {
        // Preserva i colori avatar (sono per-device, non legati alla sessione)
        const coloriAvatar = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && (k.startsWith('avatarColor_') || k.startsWith('avatarColorRecenti_') || k.startsWith('avatarColorHidden_'))) coloriAvatar[k] = localStorage.getItem(k);
        }

        // 1. Pulizia totale della memoria del browser
        localStorage.clear();
        sessionStorage.clear();

        // Ripristina i colori avatar
        Object.entries(coloriAvatar).forEach(([k, v]) => { try { localStorage.setItem(k, v); } catch {} });

        // 2. Reindirizzamento pulito alla pagina iniziale
        // Aggiungiamo un parametro casuale per evitare che il browser usi la cache vecchia
        window.location.href = window.location.origin + window.location.pathname + "?logout=" + Date.now();

    } catch (error) {
        // Se c'è un errore imprevisto, forziamo comunque il ricaricamento
        console.error("Errore durante il logout:", error);
        window.location.reload();
    }
}
// Badge unico sidebar: conta richieste non risolte, diventa arancione pulsante se ci sono sollecitati
function aggiornaBadgeNotifiche() {} // no-op: accorpata in aggiornaBadgeSidebar

/* ── Modal di conferma generico ─────────────────────── */
function mostraConferma(titolo, messaggio, onOk, labelOk) {
    const modal  = document.getElementById('modal-conferma');
    const btnOk  = document.getElementById('modal-conferma-ok');
    document.getElementById('modal-conferma-titolo').innerText = titolo;
    document.getElementById('modal-conferma-msg').innerText    = messaggio;
    btnOk.innerText = labelOk || 'Conferma';
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    btnOk.onclick = () => { _chiudiConferma(); onOk(); };
}
function _chiudiConferma() {
    const modal = document.getElementById('modal-conferma');
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}
/* chiudi anche notifica toast */
function notificaElegante(msg, tipo) {
    let el = document.getElementById('toast-notifica');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast-notifica';
        document.body.appendChild(el);
    }
    el.className = 'toast-notifica' + (tipo === 'error' ? ' toast-error' : '');
    el.innerText = msg;
    // forza reflow per ripartire l'animazione
    void el.offsetWidth;
    el.classList.add('visible');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => { el.classList.remove('visible'); }, 3000);
}
function aggiornaBadgeSidebar(messaggi) {
    const badgeSidebar = document.getElementById('badge-richieste-count');
    const nomeSidebar  = document.getElementById('nome-utente-sidebar');
    const imgAvatar    = document.getElementById('img-avatar-sidebar');

    if (!badgeSidebar) return;

    const vistaAttiva = (utenteAttuale.vistaSimulata || 'MASTER').toUpperCase().trim();

    if (nomeSidebar) nomeSidebar.innerText = vistaAttiva;
    if (imgAvatar)   imgAvatar.src = `https://ui-avatars.com/api/?name=${vistaAttiva}&background=2563eb&color=fff`;

    // Se si è già sulla pagina richieste, il badge rimane nascosto
    if (paginaAttuale === 'STORICO_RICHIESTE') {
        badgeSidebar.style.display = 'none';
        badgeSidebar.classList.remove('badge-sollecito-attivo');
        return;
    }

    const rilevanti = messaggi.filter(m => {
        const dest      = String(m.A || '').toUpperCase().trim();
        const nonRisolto = String(m.RISOLTO).toLowerCase() !== 'true';
        if (vistaAttiva === 'MASTER') return nonRisolto;
        return dest === vistaAttiva && nonRisolto;
    });

    const conteggio    = rilevanti.length;
    const sollecitati  = rilevanti.filter(m => String(m.SOLLECITO).toLowerCase() === 'true').length;

    if (conteggio > 0) {
        badgeSidebar.innerText = conteggio;
        badgeSidebar.style.display = 'inline-block';
        // Arancione pulsante se ci sono sollecitati, rosso normale altrimenti
        if (sollecitati > 0) {
            badgeSidebar.classList.add('badge-sollecito-attivo');
        } else {
            badgeSidebar.classList.remove('badge-sollecito-attivo');
        }
    } else {
        badgeSidebar.style.display = 'none';
        badgeSidebar.classList.remove('badge-sollecito-attivo');
    }

    // Sincronizza anche il badge nell'app bar mobile
    const badgeMobile = document.getElementById('badge-mobile-notif');
    if (badgeMobile) {
        if (conteggio > 0 && paginaAttuale !== 'STORICO_RICHIESTE') {
            badgeMobile.innerText = conteggio;
            badgeMobile.style.display = 'inline-block';
            badgeMobile.style.background = sollecitati > 0 ? '#f97316' : '#ef4444';
        } else {
            badgeMobile.style.display = 'none';
        }
    }

    // Sincronizza il badge nel bottom nav
    const badgeBottom = document.getElementById('badge-bottom-richieste');
    if (badgeBottom) {
        if (conteggio > 0 && paginaAttuale !== 'STORICO_RICHIESTE') {
            badgeBottom.innerText = conteggio;
            badgeBottom.style.display = 'inline-block';
            if (sollecitati > 0) badgeBottom.classList.add('badge-sollecito-attivo');
            else badgeBottom.classList.remove('badge-sollecito-attivo');
        } else {
            badgeBottom.style.display = 'none';
            badgeBottom.classList.remove('badge-sollecito-attivo');
        }
    }
}
function cambiaPagina(nomeFoglio, elementoMenu) {
    // ── Debounce: ignora click entro 80ms dal precedente ──
    const now = Date.now();
    if (now - _lastNavClickTime < 80) return;
    _lastNavClickTime = now;

    // ── Abort qualsiasi fetch in-volo della navigazione precedente ──
    if (_navAbortController) {
        try { _navAbortController.abort(); } catch (_) {}
    }
    _navAbortController = new AbortController();
    const navSignal = _navAbortController.signal;

    const requestId = ++_navRequestSerial;
    _latestNavRequest = requestId;

    // reset possible filter cache when switching pages
    elementiDaFiltrareCache = null;

    // 1. Reset immediato della ricerca (per evitare di vedere dati filtrati della pagina precedente)
    const searchInput = document.getElementById('universal-search');
    if (searchInput) searchInput.value = "";
    const deskSearch = document.getElementById('desk-search-input');
    if (deskSearch) deskSearch.value = "";

    // 2. Validazione e salvataggio Stato
    if (!nomeFoglio || nomeFoglio === "undefined" || nomeFoglio === "null") {
        nomeFoglio = "PROGRAMMA PRODUZIONE DEL MESE";
    }
    localStorage.setItem('ultimaPaginaProduzione', nomeFoglio);
    paginaAttuale = nomeFoglio;

    // 3. UI: Gestione Sidebar (Classe Active) + Tab Bar active
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(item => item.classList.remove('active'));
    if (!elementoMenu) {
        elementoMenu = document.querySelector(`.menu-item[data-page="${nomeFoglio}"]`);
    }
    if (elementoMenu) elementoMenu.classList.add('active');
    // Tab bar: marca attivo il tab corrispondente
    const bottomTab = document.querySelector(`.tab-item[data-page="${nomeFoglio}"]`);
    if (bottomTab) bottomTab.classList.add('active');

    // 4. UI: Aggiornamento Titolo Dinamico
    const titoli = {
        'IMPOSTAZIONI': "Impostazioni Sistema",
        'STORICO_RICHIESTE': "La mia Casella",
        'ARCHIVIO_ORDINI': "Archivio Ordini",
        'MATERIALE DA ORDINARE': "Gestione Acquisti",
        'PROGRAMMA PRODUZIONE DEL MESE': "Dashboard Produzione"
    };
    const titolo = document.getElementById('titolo-pagina');
    if (titolo) titolo.innerText = titoli[nomeFoglio] || nomeFoglio;
    const titoloDesk = document.getElementById('page-title-desktop');
    if (titoloDesk) titoloDesk.innerText = titoli[nomeFoglio] || nomeFoglio;

    // 5. UI: Gestione Elementi Condizionali (Carrello)
    const btnCarrello = document.getElementById('floating-cart-btn');
    if (btnCarrello) {
        const isAcquisti = (nomeFoglio === "MATERIALE DA ORDINARE");
        btnCarrello.style.display = isAcquisti ? "flex" : "none";
        if (!isAcquisti && typeof chiudiModalCarrello === "function") chiudiModalCarrello();
    }

    // 6. Rendering Contenuto (Cache o Server)
    const contenitore = document.getElementById('contenitore-dati');
    // Skeleton istantaneo solo se non c'è cache (rimane visibile fino a che il loader scrive)
    if (!cacheContenuti[nomeFoglio]) {
        contenitore.innerHTML = `<div class="nav-skeleton">
            <div class="nav-skel-bar" style="width:60%"></div>
            <div class="nav-skel-bar" style="width:85%"></div>
            <div class="nav-skel-bar" style="width:45%"></div>
            <div class="nav-skel-bar" style="width:75%"></div>
        </div>`;
    } else {
        contenitore.innerHTML = ""; // sarà sovrascritto subito dalla cache sotto
    }

    // Chiudi tutti i modali aperti quando si cambia pagina
    ['modalAiuto', 'modal-conferma', 'modal-gestione-articolo', 'modal-carrello'].forEach(id => {
        const m = document.getElementById(id);
        if (!m) return;
        if (id === 'modal-carrello') { m.classList.remove('cart-open'); return; }
        if (id === 'modal-gestione-articolo') { m.classList.remove('active'); setTimeout(() => { if (!m.classList.contains('active')) m.style.display = 'none'; }, 300); return; }
        m.classList.remove('active');
        setTimeout(() => { if (!m.classList.contains('active')) m.style.display = 'none'; }, 300);
    });

    // Azzeramento badge appena si apre "La mia Casella" (con o senza cache)
    if (nomeFoglio === 'STORICO_RICHIESTE') {
        const badgeSidebar = document.getElementById('badge-richieste-count');
        if (badgeSidebar) {
            badgeSidebar.style.display = 'none';
            badgeSidebar.classList.remove('badge-sollecito-attivo');
        }
        const badgeMobile = document.getElementById('badge-mobile-notif');
        if (badgeMobile) badgeMobile.style.display = 'none';
        const badgeBottom = document.getElementById('badge-bottom-richieste');
        if (badgeBottom) { badgeBottom.style.display = 'none'; badgeBottom.classList.remove('badge-sollecito-attivo'); }
    }

    if (cacheContenuti[nomeFoglio]) {
        contenitore.innerHTML = cacheContenuti[nomeFoglio];
        applicaFade(contenitore);
        aggiornaListaFiltrabili();
        // Riattiva DnD kanban dopo restore da cache
        requestAnimationFrame(_initKanbanDnd);
        console.log("Rendering da cache:", nomeFoglio);

        // Aggiornamento dati in background solo se la cache è scaduta (> 30s)
        const ora = Date.now();
        const ultimoFetch = cacheFetchTime[nomeFoglio] || 0;
        if (ora - ultimoFetch > CACHE_TTL_MS) {
            if (nomeFoglio === "PROGRAMMA PRODUZIONE DEL MESE") caricaDati(nomeFoglio, true, requestId, navSignal);
            if (nomeFoglio === "MATERIALE DA ORDINARE") caricaMateriali(true, requestId, navSignal);
        }
        return;
    }

    // 7. Smistamento Caricamento (Router)
    console.log("Caricamento dal server:", nomeFoglio);

    switch (nomeFoglio) {
        case 'IMPOSTAZIONI':
            caricaInterfacciaImpostazioni();
            break;
        case 'STORICO_RICHIESTE':
            caricaPaginaRichieste(requestId, navSignal);
            break;
        case 'ARCHIVIO_ORDINI':
            caricaArchivio();
            break;
        case 'MATERIALE DA ORDINARE':
            caricaMateriali(false, requestId, navSignal);
            break;
        default:
            caricaDati(nomeFoglio, false, requestId, navSignal);
    }
}







//PAGINA PRODUZIONE//

async function caricaDati(nomeFoglio, isBackgroundUpdate = false, expectedRequestId = null, signal = null) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!isBackgroundUpdate) {
        contenitore.innerHTML = "<div class='inline-msg' id='_prod-loader'>Caricamento Dashboard...</div>";
        applicaFade(contenitore);
    }

    // Retry button dopo 12s se ancora in caricamento
    const retryTimer = isBackgroundUpdate ? null : setTimeout(() => {
        const el = document.getElementById('_prod-loader');
        if (el) el.innerHTML = `⚠️ Connessione lenta o server non raggiungibile.<br>
            <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                style="margin-top:12px;padding:8px 20px;background:#2563eb;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`;
    }, 12000);

    try {
        // Scarichiamo entrambi i fogli in parallelo
        const [datiProd, datiArch] = await Promise.all([
            fetchJson("PROGRAMMA PRODUZIONE DEL MESE", signal),
            fetchJson("ARCHIVIO_ORDINI", signal)
        ]);
        if (retryTimer) clearTimeout(retryTimer);

        if (paginaAttuale !== nomeFoglio) return;
        if (expectedRequestId !== null && expectedRequestId !== _latestNavRequest) return;

        // --- OVERVIEW STATI ---
        const attivi = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
        _attiviProd = attivi;
        const STATI_OV = ['CONTROLLARE MAGAZZINO','PREPARARE PER LAVORAZIONE','IN LAVORAZIONE','TORNATO DALLA LAVORAZIONE','IN PRODUZIONE','IMBALLATO'];
        const numInFocus = attivi.filter(r => STATI_OV.includes((r.stato||'').toUpperCase())).length;

        // --- SEZIONE ATTIVA ---
        let htmlAttivi = generaBloccoOrdiniUnificato(datiProd, false);

        // --- SEZIONE ARCHIVIATA ---
        let htmlArchiviati = generaBloccoOrdiniUnificato(datiArch, true);

        const isMobileOv = window.innerWidth <= 600;
        const ovContent = isMobileOv
            ? '<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>'
            : _buildOverviewInnerHtml(attivi);

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
                    <span>📦 ARCHIVIO STORICO ORDINI</span>
                    <i class="fas fa-chevron-down archivio-chevron"></i>
                </summary>
                <div class="sezione-archiviata">
                    ${htmlArchiviati || "<div class='empty-msg'>L'archivio è vuoto.</div>"}
                </div>
            </details>
        `;
        cacheContenuti[nomeFoglio] = contenitore.innerHTML;
        cacheFetchTime[nomeFoglio] = Date.now();
        applicaFade(contenitore);
        aggiornaListaFiltrabili();
        // Observer: apri archivio quando ci si scorre sopra
        _osservaArchivio('archivio-prod-details');
        // Attiva drag & drop kanban (solo desktop)
        requestAnimationFrame(_initKanbanDnd);

        // Salva raw data per autocomplete del modal
        _ordiniAutocompleteCache = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE').map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '' }));
        // Deduplication by ordine
        const seen = new Set();
        _ordiniAutocompleteCache = _ordiniAutocompleteCache.filter(o => { if (seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });

    } catch (e) {
        if (retryTimer) clearTimeout(retryTimer);
        if (e.name === 'AbortError') return; // navigazione annullata, fetch interrotto
        console.error("Errore Dashboard:", e);
        contenitore.innerHTML = `<div class='inline-error'>Errore nel caricamento dati.
            <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                style="margin-left:8px;padding:4px 12px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer">
                &#x21bb; Riprova</button></div>`;
        applicaFade(contenitore);
    }
}
function generaBloccoOrdiniUnificato(dati, isArchivio) {
    if (!dati || dati.length === 0) return "";

    const gruppi = {};
    dati.forEach(r => {
        if (!isArchivio && String(r.archiviato).toUpperCase() === "TRUE") return;
        const nOrd = r.ordine || "N.D.";
        if (!gruppi[nOrd]) gruppi[nOrd] = [];
        gruppi[nOrd].push(r);
    });

    let html = "";
    Object.keys(gruppi).forEach(nOrd => {
        const righe = gruppi[nOrd];
        const cliente = righe[0].cliente;
        const riferimento = righe[0].riferimento || "";
        const htmlRiferimento = riferimento ? `<span class="riferimento-label">(${riferimento})</span>` : '';

        // Definizione Header e Bottoni in base allo stato
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
            nOrdBadge = nOrd.length > 14 ? nOrd.substring(0, 14) + '…' : nOrd;
        }

        const bottoniHeader = isArchivio
            ? `<button class="btn-ripristina ${TW.btnWarning}" onclick="event.stopPropagation(); gestisciRipristino('${nOrd}', 'ORDINE')">
                   <i class="fa-solid fa-rotate-left"></i> <span class="btn-txt">Ripristina</span>
               </button>`
            : `<button class="btn-chiedi-assegna ${TW.btnPrimary}" onclick="event.stopPropagation(); apriModalAiuto(null, 'INTERO ORDINE', '${nOrd}')">
                   <i class="fa-regular fa-envelope"></i> <span class="btn-txt">Chiedi</span>
               </button>
               <button class="btn-archivia-prod ${TW.btnSuccess}" onclick="event.stopPropagation(); gestisciArchiviazione('${nOrd}')">
                   <i class="fa-solid fa-box-archive"></i> <span class="btn-txt">Archivia</span>
               </button>`;

        html += `
        <div class="ordine-wrapper ${classWrapper}" data-ordine="${nOrd}" data-cliente="${(cliente || '').toLowerCase().replace(/"/g, '')}">
            <div class="riga-ordine ${classHeader}" onclick="toggleAccordion(this)">
                <div class="flex-grow">
                    <span class="order-title" style="--order-color:${colorCliente}" title="${cliente}">${cliente} ${htmlRiferimento}</span>
                </div>
                <div class="order-info">
                    <div class="badge-count ${TW.pill}" title="ORD.${nOrd}"><span class="badge-ord-num">ORD.${nOrdBadge}</span><span class="badge-sep">·</span>${righe.length} ART.</div>
                    ${bottoniHeader}
                </div>
            </div>
            <div class="dettagli-container${isArchivio ? ' hidden' : ''}">
                ${righe.map(art => isArchivio ? generaCardArchivio(art, nOrd) : generaCardArticolo(art, nOrd)).join('')}
            </div>
        </div>`;
    });
    return html;
}
function generaCardArticolo(art, nOrd) {
    const statoAttuale = (art.stato || "IN ATTESA").toUpperCase();
    const configStato = listaStati.find(s => s.nome === statoAttuale) || {colore: "#e2e8f0"};
    const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";

    // Gestione visualizzazione operatori (trasforma la stringa in badge colorati)
    const displayOperatori = (art.assegna && art.assegna !== "" && art.assegna !== "undefined")
        ? art.assegna.split(',').map(op => {
            const nome = op.trim();
            const col  = _getOpColor(nome);
            return `<span class="badge-operatore" style="background:${col};border-color:${col}">${nome}</span>`;
          }).join('')
        : `<span class="operatore-libero">Libero</span>`;

    return `
    <div class="item-card ${TW.card}">
        <div><span class="label-sm ${TW.label}">Codice Prodotto</span><b class="${TW.value}">${codicePrincipale}</b></div>
        <div><span class="label-sm ${TW.label}">Quantità</span><b class="${TW.value}">${art.qty}</b></div>
        <div>
            <span class="label-sm ${TW.label}">Stato</span>
            <div class="stato-dropdown" data-id-riga="${art.id_riga}">
                <button type="button" class="stato-trigger" onclick="toggleStatoDropdown(this)">
                    <span class="stato-dot" style="background:${configStato.colore}"></span>
                    <span class="stato-label-txt">${statoAttuale}</span>
                    <i class="fas fa-chevron-down stato-chevron"></i>
                </button>
                <div class="stato-popup">
                    ${listaStati.map(s => `<button type="button" class="stato-option${s.nome === statoAttuale ? ' is-selected' : ''}" onclick="selezionaStato(this, '${art.id_riga}', '${s.colore}')"><span class="stato-opt-dot" style="background:${s.colore}"></span><span>${s.nome}</span>${s.nome === statoAttuale ? '<i class="fas fa-check stato-check-icon"></i>' : ''}</button>`).join('')}
                </div>
            </div>
        </div>
        <div>
            <span class="label-sm ${TW.label}">Operatore/i Assegnati</span>
            <div class="visualizza-operatori">${displayOperatori}</div>
        </div>
        <div class="order-info-col">
            <button class="btn-chiedi-assegna ${TW.btnPrimary}" onclick="apriModalAiuto('${art.id_riga}', '${codicePrincipale}', '${nOrd}')">
                <i class="fa-regular fa-envelope"></i> Chiedi/Assegna
            </button>
        </div>
    </div>`;
}
/* ---- STATO DROPDOWN CUSTOM ---- */
function toggleStatoDropdown(btn) {
    const dropdown = btn.closest('.stato-dropdown');
    const itemCard = btn.closest('.item-card');
    const isOpen = dropdown.classList.contains('open');
    // chiudi tutti gli altri e togli la classe di elevazione
    document.querySelectorAll('.stato-dropdown.open').forEach(d => {
        d.classList.remove('open');
        const c = d.closest('.item-card');
        if (c) c.classList.remove('stato-aperto');
    });
    if (!isOpen) {
        dropdown.classList.add('open');
        if (itemCard) itemCard.classList.add('stato-aperto');
    }
}
function selezionaStato(optBtn, idRiga, colore) {
    const nuovoStato = optBtn.querySelector('span:not(.stato-opt-dot)').textContent.trim();
    const dropdown = optBtn.closest('.stato-dropdown');
    const trigger = dropdown.querySelector('.stato-trigger');
    const labelEl = trigger.querySelector('.stato-label-txt');
    const dot = trigger.querySelector('.stato-dot');
    // aggiorna dot e testo del trigger direttamente via style inline
    if (dot) dot.style.background = colore || '#94a3b8';
    labelEl.textContent = nuovoStato;
    // aggiorna selezione nelle opzioni
    dropdown.querySelectorAll('.stato-option').forEach(o => {
        o.classList.remove('is-selected');
        const existing = o.querySelector('.stato-check-icon');
        if (existing) existing.remove();
    });
    optBtn.classList.add('is-selected');
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check stato-check-icon';
    optBtn.appendChild(checkIcon);
    // chiudi
    dropdown.classList.remove('open');
    const card = dropdown.closest('.item-card');
    if (card) card.classList.remove('stato-aperto');
    // salva
    aggiornaDato(null, idRiga, 'stato', nuovoStato);
    // aggiorna cache _attiviProd
    if (_attiviProd) {
        const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
        if (r) r.stato = nuovoStato;
    }
    // sposta la card nel kanban senza ricaricare
    _syncKanbanFromStato(idRiga, nuovoStato);
}
// chiudi dropdown cliccando fuori
document.addEventListener('click', function(e) {
    if (!e.target.closest('.stato-dropdown')) {
        document.querySelectorAll('.stato-dropdown.open').forEach(d => {
            d.classList.remove('open');
            const c = d.closest('.item-card');
            if (c) c.classList.remove('stato-aperto');
        });
    }
}, true);
/* ---- FINE STATO DROPDOWN CUSTOM ---- */

function toggleAccordion(elemento) {
    elemento.classList.toggle('open');
    const container = elemento.nextElementSibling;
    container.style.display = elemento.classList.contains('open') ? 'block' : 'none';
}
async function aggiornaDato(selectEl, idRiga, campo, nuovoValore) {
    // Feedback visivo immediato sull'elemento
    if (selectEl) selectEl.style.opacity = '0.5';
    try {
        await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione:    'aggiorna_produzione',
                id_riga:   idRiga,
                colonna:   campo,
                valore:    nuovoValore,
                mittente:  (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : ''
            })
        });
        if (selectEl) selectEl.style.opacity = '1';
    } catch (e) {
        console.error('aggiornaDato error:', e);
        if (selectEl) selectEl.style.opacity = '1';
        notificaElegante('Errore nel salvataggio dello stato. Riprova.');
    }
}

/* Sposta la card nel kanban alla colonna giusta (senza ricaricare). */
function _syncKanbanFromStato(idRiga, newStato) {
    const grid = document.getElementById('ov-kanban-grid');
    if (!grid) return;
    // Cerca per id_riga diretto o dentro un gruppo (data-id-righe)
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
    // Piccola animazione di ingresso
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
function apriModalAiuto(idRiga, riferimento, nOrdine) {
    const modal = document.getElementById('modalAiuto');

    modal.style.display = 'flex';
    modal.offsetHeight; // Forza il reflow per l'animazione
    modal.classList.add('active');

    // Titolo più coerente: Messaggio invece di Supporto
    document.getElementById('modal-titolo').innerText = idRiga ?
        `Messaggio Art. ${riferimento}` :
        `Messaggio Ordine ${nOrdine}`;

    // Generazione lista operatori
    document.getElementById('wrapper-operatori').innerHTML = listaOperatori.map(op => `
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${op.email}" data-nome="${op.nome}">
            <span><b>${op.nome}</b> <small class="text-muted">(${op.reparto || 'Team'})</small></span>
        </label>
    `).join('');

    modal.dataset.idRiga = idRiga || "";
    modal.dataset.nOrdine = nOrdine;

    // Nascondi sempre il campo ordine libero (visibile solo da apriNuovaRichiesta)
    const ordineRow = document.getElementById('modal-ordine-row');
    if (ordineRow) ordineRow.style.display = 'none';

    // Reset del campo testo e partiamo sempre da ASSEGNAZIONE
    document.getElementById('messaggio-aiuto').value = "";
    setTipoAzione('Assegnazione');
}

// Apri modal per creare una nuova richiesta libera (da bottom nav "+")
let _apriNuovaRichiestaLock = false;
function apriNuovaRichiesta() {
    if (_apriNuovaRichiestaLock) return;
    _apriNuovaRichiestaLock = true;
    setTimeout(() => { _apriNuovaRichiestaLock = false; }, 600);
    const modal = document.getElementById('modalAiuto');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    document.getElementById('modal-titolo').innerText = 'Nuova Richiesta';
    document.getElementById('wrapper-operatori').innerHTML = listaOperatori.map(op => `
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${op.email}" data-nome="${op.nome}">
            <span><b>${op.nome}</b> <small class="text-muted">(${op.reparto || 'Team'})</small></span>
        </label>
    `).join('');
    modal.dataset.idRiga = '';
    modal.dataset.nOrdine = '';
    document.getElementById('messaggio-aiuto').value = '';
    setTipoAzione('Assegnazione');
    // Mostra il campo numero ordine con autocomplete
    const ordineRow = document.getElementById('modal-ordine-row');
    if (ordineRow) {
        ordineRow.style.display = 'block';
        const input = document.getElementById('modal-ordine-input');
        if (input) {
            input.value = '';
            _setupOrdineAutocomplete(input);
        }
    }
    // Se cache vuota prova a caricare
    if (_ordiniAutocompleteCache.length === 0) {
        fetchJson('PROGRAMMA PRODUZIONE DEL MESE').then(dati => {
            const seen = new Set();
            _ordiniAutocompleteCache = dati
                .filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE')
                .map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '' }))
                .filter(o => { if (!o.ordine || seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });
        }).catch(() => {});
    }
}

function _setupOrdineAutocomplete(input) {
    // Evita duplicare listener
    input.oninput = function() {
        const q = this.value.trim().toLowerCase();
        const list = document.getElementById('ordine-autocomplete');
        if (!list) return;
        if (!q) { list.style.display = 'none'; list.innerHTML = ''; return; }
        const matches = _ordiniAutocompleteCache.filter(o =>
            o.ordine.toLowerCase().includes(q) || o.cliente.toLowerCase().includes(q)
        ).slice(0, 8);
        if (matches.length === 0) { list.style.display = 'none'; list.innerHTML = ''; return; }
        list.innerHTML = matches.map(o => `
            <div class="autocomplete-item" onmousedown="_selezionaOrdine('${o.ordine.replace(/'/g, "\\'")}',' ${o.cliente.replace(/'/g, "\\'")}')">  
                <span class="ac-ordine">ORD. ${o.ordine}</span>
                <span class="ac-cliente">${o.cliente}</span>
            </div>
        `).join('');
        list.style.display = 'block';
    };
    input.onblur = function() {
        setTimeout(() => {
            const list = document.getElementById('ordine-autocomplete');
            if (list) list.style.display = 'none';
        }, 200);
    };
}

function _selezionaOrdine(ordine, cliente) {
    const input = document.getElementById('modal-ordine-input');
    if (input) input.value = ordine;
    const list = document.getElementById('ordine-autocomplete');
    if (list) { list.style.display = 'none'; list.innerHTML = ''; }
    // Aggiorna il dataset del modal affinché confermaInvioSupporto usi il valore corretto
    const modal = document.getElementById('modalAiuto');
    if (modal) modal.dataset.nOrdine = ordine;
}
function setTipoAzione(tipo) {
    const tipoUp = tipo.toUpperCase();
    document.getElementById('modalAiuto').dataset.tipoAzione = tipoUp;
    document.getElementById('btn-tipo-assegna').classList.toggle('active', tipoUp === 'ASSEGNAZIONE');
    document.getElementById('btn-tipo-domanda').classList.toggle('active', tipoUp === 'DOMANDA');
}
function chiudiModal() {
    const modal = document.getElementById('modalAiuto');

    // 1. Togli la classe active per avviare il fade-out
    modal.classList.remove('active');

    // 2. Aspetta la fine dell'animazione (300ms) prima di mettere display: none
    setTimeout(() => {
        // Controlliamo che nel frattempo l'utente non l'abbia riaperto
        if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
        }
    }, 300);
}
async function confermaInvioSupporto() {
    const modalElement = document.getElementById('modalAiuto');
    if (!modalElement) return;

    const idRiga = modalElement.dataset.idRiga;
    // Se il campo ordine libero è visibile (nuova richiesta dal "++"), usa quello
    const ordineRow = document.getElementById('modal-ordine-row');
    const ordineInput = document.getElementById('modal-ordine-input');
    const nOrd = (ordineRow && ordineRow.style.display !== 'none' && ordineInput && ordineInput.value.trim())
        ? ordineInput.value.trim()
        : modalElement.dataset.nOrdine;
    const messaggioVal = document.getElementById('messaggio-aiuto').value;
    const tipoAzione = modalElement.dataset.tipoAzione;

    const checkboxSelezionate = document.querySelectorAll('input[name="destinatario"]:checked');

    if (checkboxSelezionate.length === 0) {
        alert("Per favore, seleziona almeno un operatore.");
        return;
    }

    const listaNomiStr = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome')).join(', ');
    const listaNomiDestinatari = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome'));

    try {
        // --- AZIONE A: Aggiorna i Badge nella Produzione ---
        const urlAssegnazione = `${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(listaNomiStr)}&id_riga=${idRiga}`;
        await fetch(urlAssegnazione);

        // --- AZIONE B: Salva nello Storico Messaggi ---
        const payload = {
            azione: 'supporto_multiplo',
            n_ordine: nOrd,
            tipo: tipoAzione,
            // Testo di default aggiornato
            messaggio: messaggioVal || (tipoAzione === 'ASSEGNAZIONE' ? "Nuova assegnazione" : "Nuova domanda"),
            mittente: utenteAttuale.nome.toUpperCase().trim(),
            destinatari: listaNomiDestinatari
        };

        const response = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            document.getElementById('messaggio-aiuto').value = "";
            chiudiModal();

            // Invalida la cache richieste così la prossima apertura recupera dati freschi
            delete cacheContenuti['STORICO_RICHIESTE'];
            delete cacheFetchTime['STORICO_RICHIESTE'];

            if (paginaAttuale === 'STORICO_RICHIESTE') {
                await caricaPaginaRichieste();
            } else {
                // Aggiorna il badge in background anche se non siamo sulla pagina richieste
                fetchJson("STORICO_RICHIESTE").then(msgs => { aggiornaBadgeSidebar(msgs); aggiornaBadgeNotifiche(msgs); }).catch(() => {});
                await caricaDati(paginaAttuale);
            }
        }

    } catch (e) {
        console.error("Errore durante l'operazione:", e);
        alert("Errore nell'invio delle informazioni.");
    }
}
function toggleAreaRisposta(id) {
    const box = document.getElementById('box-risposta-' + id);
    const boxConf = document.getElementById('box-conferma-' + id);
    if (!box) return;
    if (boxConf) { boxConf.style.display = 'none'; boxConf.style.opacity = '0'; }

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        setTimeout(() => { box.style.opacity = '1'; box.style.transform = 'translateY(0)'; }, 10);
        document.getElementById('input-risposta-' + id).focus();
    } else {
        box.style.opacity = '0';
        box.style.transform = 'translateY(-10px)';
        setTimeout(() => { box.style.display = 'none'; }, 300);
    }
}
function toggleBoxArchivia(id) {
    const box = document.getElementById('box-conferma-' + id);
    const boxResp = document.getElementById('box-risposta-' + id);
    if (!box) return;
    if (boxResp) { boxResp.style.display = 'none'; boxResp.style.opacity = '0'; }

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        setTimeout(() => { box.style.opacity = '1'; box.style.transform = 'translateY(0)'; }, 10);
    } else {
        box.style.opacity = '0';
        box.style.transform = 'translateY(-10px)';
        setTimeout(() => { box.style.display = 'none'; }, 300);
    }
}
async function inviaRisposta(idRiga, nOrdine, destinatario) {
    const input = document.getElementById('input-risposta-' + idRiga);
    const testo = input.value.trim();
    if (!testo) return;

    try {
        const payload = {
            azione: 'supporto_multiplo',
            n_ordine: nOrdine,
            tipo: 'RISPOSTA',
            messaggio: testo,
            mittente: utenteAttuale.nome.toUpperCase().trim(),
            destinatari: [destinatario.toUpperCase().trim()]
        };

        const response = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) });
        if (response.ok) {
            input.value = "";
            await caricaPaginaRichieste(); // Ricarica la chat aggiornata
        }
    } catch (e) {
        alert("Errore durante l'invio.");
    }
}


//SEZIONE ARICHIVIO ORDINI//

function generaCardArchivio(art, nOrd) {
    const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";
    const statoArchiviato = (art.stato || "COMPLETATO").toUpperCase();

    // LOGICA PULIZIA OPERATORE
    // Se art.assegna è nullo, vuoto o la stringa "false", scriviamo "Nessuno"
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
            <span class="label-sm ${TW.label}">Quantità</span>
            <b class="archivio-qty-val ${TW.value}">${art.qty}</b>
        </div>

        <div>
            <span class="label-sm ${TW.label}">Ultimo Stato</span>
            <span class="archivio-stato ${TW.value}">${statoArchiviato}</span>
        </div>

        <div>
            <span class="label-sm ${TW.label}">Operatore</span>
            <span class="archivio-operatore ${TW.value}">${operatoreValore}</span>
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
async function gestisciArchiviazione(nOrd, tipo) {
    mostraConferma(
        'Archivia Ordine',
        `Vuoi spostare l'ordine ${nOrd} nell'archivio?`,
        async () => {
            try {
                const url = URL_GOOGLE + "?azione=archiviaOrdine&ordine=" + encodeURIComponent(nOrd);
                const response = await fetch(url);
                const risultato = await response.json();
                if (risultato.status === "success") {
                    notificaElegante('Ordine ' + nOrd + ' archiviato.');
                    caricaDati(paginaAttuale);
                } else {
                    notificaElegante('Errore: ' + risultato.message, 'error');
                }
            } catch (errore) {
                notificaElegante('Errore di connessione al server.', 'error');
            }
        },
        'Archivia'
    );
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
                caricaDati(paginaAttuale);
            } else {
                notificaElegante('Errore: ' + risultato.message, 'error');
            }
        } catch (e) {
            notificaElegante('Errore durante il ripristino.', 'error');
        }
    }, 'Ripristina');
}





//OVERVIEW HELPERS (usati da caricaDati)//

// 4 stati: focus su articolo (raggruppati per codice)
// 2 stati: focus su ordine completo
const _OV_STATI_ART  = ['CONTROLLARE MAGAZZINO','PREPARARE PER LAVORAZIONE','IN LAVORAZIONE','TORNATO DALLA LAVORAZIONE'];
const _OV_STATI_ORD  = ['IN PRODUZIONE','IMBALLATO'];
const _OV_STATI_ALL  = [..._OV_STATI_ART, ..._OV_STATI_ORD];

// Lazy load overview su mobile
function _ovLoadIfNeeded(summary) {
    const details = summary.parentElement;
    // Se si sta aprendo (era chiuso), costruisci il contenuto se non ancora fatto
    if (!details.open) {
        const contentDiv = document.getElementById('ov-content');
        if (contentDiv && contentDiv.querySelector('.ov-lazy-placeholder')) {
            contentDiv.innerHTML = _buildOverviewInnerHtml(_attiviProd);
            requestAnimationFrame(_initKanbanDnd);
        }
    }
}

// Apri archivio collassabile e scrolla
function _apriArchivio(id) {
    const det = document.getElementById(id);
    if (!det) return;
    det.open = true;
    requestAnimationFrame(() => {
        det.querySelector('summary').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// IntersectionObserver: apre l'archivio quando si scorre fino al summary
function _osservaArchivio(id) { /* disabilitato: apri solo col tasto */ }

function _buildCaricoOperatoriHtml(attivi) {
    // Costruisce mappa operatore → array di righe assegnate
    const map = new Map();
    attivi.forEach(r => {
        if (!r.assegna || r.assegna === '' || r.assegna === 'undefined') return;
        r.assegna.split(',').forEach(op => {
            const nome = op.trim();
            if (!nome) return;
            if (!map.has(nome)) map.set(nome, []);
            map.get(nome).push(r);
        });
    });

    const coloriStati = {};
    (listaStati || []).forEach(s => { coloriStati[s.nome.toUpperCase()] = s.colore; });

    // ── Card 1: "Chi sta lavorando" ──
    const attivi_ops = [...map.entries()].sort((a, b) => b[1].length - a[1].length);
    const card1Body = attivi_ops.length === 0
        ? '<span class="ov-empty-lbl">— nessun operatore assegnato</span>'
        : attivi_ops.map(([nome, items]) => {
            const col = _getOpColor(nome);
            const itemsHtml = items.map(r => {
                const stato = (r.stato || 'IN ATTESA').toUpperCase().trim();
                const colStato = coloriStati[stato] || '#94a3b8';
                const cod = (r.codice && r.codice !== 'false') ? r.codice : (r.riferimento || '—');
                const lbl = cod.length > 16 ? cod.substring(0, 15) + '\u2026' : cod;
                return `<div class="ov-op-item">
                    <span class="ov-op-item-dot" style="background:${colStato}"></span>
                    <span class="ov-op-item-cod">${lbl}</span>
                    <span class="ov-op-item-qty">${r.qty || 1} pz</span>
                </div>`;
            }).join('');
            return `<div class="ov-op-row">
                <div class="ov-op-header">
                    <span class="ov-op-badge" style="background:${col}">${nome.charAt(0).toUpperCase()}</span>
                    <span class="ov-op-nome">${nome}</span>
                    <span class="ov-op-count" style="background:${col}33;color:${col}">${items.length}</span>
                </div>
                <div class="ov-op-items">${itemsHtml}</div>
            </div>`;
        }).join('');

    // ── Card 2: "Riepilogo operatori" ──
    const opNomiAssegnati = new Set(map.keys());
    const tuttOps = (listaOperatori || []).map(op => {
        const nome = op.nome;
        const items = map.get(nome) || [];
        return { nome, count: items.length, col: _getOpColor(nome) };
    });
    // Aggiungi operatori che risultano assegnati ma non in listaOperatori
    map.forEach((items, nome) => {
        if (!tuttOps.find(o => o.nome === nome)) {
            tuttOps.push({ nome, count: items.length, col: _getOpColor(nome) });
        }
    });
    tuttOps.sort((a, b) => b.count - a.count);

    const maxCount = tuttOps.length > 0 ? Math.max(...tuttOps.map(o => o.count), 1) : 1;
    const card2Body = tuttOps.length === 0
        ? '<span class="ov-empty-lbl">— nessun operatore</span>'
        : tuttOps.map(({ nome, count, col }) => {
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

    const card1 = `<details class="ov-stato-card" open>
        <summary class="ov-stato-header" style="--ov-col:#6366f1">
            <span class="ov-stato-dot" style="background:#6366f1"></span>
            <span class="ov-stato-nome">Chi sta lavorando</span>
            <span class="ov-stato-tot" style="background:#6366f133;color:#6366f1">${attivi_ops.length} op.</span>
            <i class="fas fa-chevron-down ov-sub-chevron"></i>
        </summary>
        <div class="ov-stato-body ov-op-card-body">${card1Body}</div>
    </details>`;

    const card2 = `<details class="ov-stato-card" open>
        <summary class="ov-stato-header" style="--ov-col:#f59e0b">
            <span class="ov-stato-dot" style="background:#f59e0b"></span>
            <span class="ov-stato-nome">Carico operatori</span>
            <span class="ov-stato-tot" style="background:#f59e0b33;color:#f59e0b">${tuttOps.length} tot.</span>
            <i class="fas fa-chevron-down ov-sub-chevron"></i>
        </summary>
        <div class="ov-stato-body ov-op-card-body">${card2Body}</div>
    </details>`;

    return card1 + card2;
}

function _buildOverviewInnerHtml(attivi) {
    const coloriStati = {};
    (listaStati || []).forEach(s => { coloriStati[s.nome.toUpperCase()] = s.colore; });
    const coloreDefault = '#94a3b8';

    const cardsHtml = _OV_STATI_ALL.map(stato => {
        // .trim() evita spazi extra nel nome stato (fix IN LAVORAZIONE)
        const righe = attivi.filter(r => (r.stato || '').toUpperCase().trim() === stato.trim());
        const colore = coloriStati[stato] || coloreDefault;
        const isEmpty = righe.length === 0;

        // ── Raggruppa righe per codice (stesso articolo in più ordini = 1 card) ──
        const gruppiMap = new Map();
        const gruppiOrd = [];
        righe.forEach(r => {
            const codice = String(r.codice && r.codice !== 'false' ? r.codice : r.riferimento || '—').trim();
            if (gruppiMap.has(codice)) {
                gruppiMap.get(codice).push(r);
            } else {
                const arr = [r];
                gruppiMap.set(codice, arr);
                gruppiOrd.push({ codice, rows: arr });
            }
        });

        const contenuto = gruppiOrd.map(({ codice, rows }) => {
            const lbl = codice.length > 24 ? codice.substring(0, 24) + '\u2026' : codice;
            const ids = rows.map(r => String(r.id_riga)).join(',');

            // Sub-riga: raggruppa per cliente → stesso cliente = ordini uniti, cliente scritto una volta
            // Helper: abbrevia nome (prime 2 parole, max 14 char)
            function _abbr(s) {
                const w = (s || '').trim().split(/\s+/).slice(0, 2).join(' ');
                return w.length > 14 ? w.substring(0, 13) + '\u2026' : w;
            }
            // Determina etichetta cliente: se "DA DEFINIRE" (o vuoto) usa riferimento
            function _cliLabel(r) {
                const cli = String(r.cliente || '').trim().toUpperCase();
                if (!cli || cli === 'DA DEFINIRE') {
                    const rif = String(r.riferimento || '').trim();
                    return _abbr(rif) || '';
                }
                return _abbr(r.cliente);
            }
            // Raggruppa le righe per etichetta cliente
            const cliGroupMap = new Map();
            const cliGroupOrd = [];
            rows.forEach(r => {
                const key = _cliLabel(r);
                if (cliGroupMap.has(key)) {
                    cliGroupMap.get(key).push(r);
                } else {
                    cliGroupMap.set(key, [r]);
                    cliGroupOrd.push(key);
                }
            });
            const subParts = cliGroupOrd.map(cliKey => {
                const grp = cliGroupMap.get(cliKey);
                // Tutti gli ordini di questo cliente, abbreviati e uniti con " / "
                const ordsStr = grp.map(r => {
                    const o = String(r.ordine || '').trim();
                    return o.length > 12 ? o.substring(0, 12) + '\u2026' : o;
                }).filter(Boolean).join(' / ');
                if (!ordsStr && !cliKey) return '';
                return ordsStr + (cliKey ? ' <em>' + cliKey + '</em>' : '');
            }).filter(Boolean);
            const subLine = subParts.join(' · ');

            // Quantità: "7 pz" se singolo, "7pz+3pz" se multiplo
            const qtyStr = rows.length > 1
                ? rows.map(r => (r.qty || 1) + 'pz').join('+')
                : (rows[0].qty || 1) + ' pz';

            return `<div class="ov-stato-row ov-kanban-item"
                data-id-riga="${rows[0].id_riga}"
                data-id-righe="${ids}"
                data-count="${rows.length}"
                data-codice="${codice.replace(/"/g, '&quot;')}"
                data-ordine="${rows.map(r => r.ordine || '').join(',')}"
                data-stato-corrente="${stato}">
                <span class="ov-drag-handle"><i class="fas fa-grip-vertical"></i></span>
                <span class="ov-row-main">
                    <span class="ov-row-label" title="${codice}">${lbl}</span>
                    ${subLine ? `<span class="ov-row-sub">${subLine}</span>` : ''}
                </span>
                <span class="ov-badge-qty">${qtyStr}</span>
            </div>`;
        }).join('');

        const totLabel = righe.length + ' art.';

        return `<details class="ov-stato-card${isEmpty ? ' ov-stato-card-empty' : ''}" open>
            <summary class="ov-stato-header" style="--ov-col:${colore}">
                <span class="ov-stato-dot" style="background:${colore}"></span>
                <span class="ov-stato-nome">${stato}</span>
                <span class="ov-stato-tot" style="background:${colore}22;color:${colore}" data-stato-count="${stato}">${totLabel}</span>
                <i class="fas fa-chevron-down ov-sub-chevron"></i>
            </summary>
            <div class="ov-stato-body" data-stato-drop="${stato}">${isEmpty ? '<span class="ov-empty-lbl">— nessun articolo</span>' : contenuto}</div>
        </details>`;
    }).join('');

    return `<div class="ov-board-wrapper">
        <div class="ov-stati-grid" id="ov-kanban-grid">${cardsHtml}</div>
        <div class="ov-operatori-panel">${_buildCaricoOperatoriHtml(attivi)}</div>
    </div>`;
}

function _buildOverviewChart() { /* non più usato */ }

/* ────────────────────────────────────────────────────────────────
   KANBAN DRAG & DROP DINAMICO  –  solo desktop (≥ 601 px)
   Usa pointer events per un ghost element che segue il cursore
   in tempo reale. Al rilascio sposta l'elemento nel DOM senza
   ricaricare e salva sul backend tramite aggiornaDato().
   ──────────────────────────────────────────────────────────────── */
function _initKanbanDnd() {
    if (window.innerWidth <= 600) return;
    const grid = document.getElementById('ov-kanban-grid');
    if (!grid || grid._dndInit) return;
    grid._dndInit = true;

    let dragEl     = null;
    let ghost      = null;
    let srcStato   = null;
    let activeBody = null;   // colonna attualmente evidenziata
    let offX = 0, offY = 0;

    /* ── Trova la colonna destinazione nascondendo temporaneamente il ghost ── */
    function _bodyAtPoint(x, y) {
        if (ghost) ghost.style.visibility = 'hidden';
        const el = document.elementFromPoint(x, y);
        if (ghost) ghost.style.visibility = '';
        if (!el) return null;
        // Caso 1: cursore sopra il body o un suo figlio
        const body = el.closest('.ov-stato-body');
        if (body) return body;
        // Caso 2: cursore sopra il summary/header di una colonna → restituisce il body fratello
        const header = el.closest('.ov-stato-header, .ov-stato-card > summary');
        if (header) {
            const card = header.closest('.ov-stato-card');
            if (card) return card.querySelector('.ov-stato-body');
        }
        return null;
    }

    /* ── Evidenziazione colonna ── */
    function _highlight(body) {
        if (body === activeBody) return;
        grid.querySelectorAll('.ov-stato-body').forEach(b => b.classList.remove('ov-drop-over'));
        activeBody = body;
        if (body && body.dataset.statoDrop !== srcStato) {
            body.classList.add('ov-drop-over');
        }
    }

    /* ── Pulizia stato drag ── */
    function _cleanup() {
        if (ghost) { ghost.remove(); ghost = null; }
        if (dragEl) { dragEl.classList.remove('ov-drag-active'); dragEl = null; }
        grid.querySelectorAll('.ov-stato-body').forEach(b => b.classList.remove('ov-drop-over'));
        srcStato = null;
        activeBody = null;
    }

    /* ── Inizio del drag ── */
    grid.addEventListener('pointerdown', e => {
        // Solo tasto sinistro del mouse
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        const item = e.target.closest('.ov-kanban-item');
        if (!item) return;

        e.preventDefault();
        dragEl   = item;
        srcStato = item.dataset.statoCorrente;

        const rect = item.getBoundingClientRect();
        offX = e.clientX - rect.left;
        offY = e.clientY - rect.top;

        // Ghost: clone visivo che segue il cursore
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
            'z-index:99999',
            'border-radius:8px',
            'box-shadow:0 10px 32px rgba(0,0,0,0.55)',
            'transform:scale(1.05) rotate(-1.2deg)',
            'transition:transform 0.1s',
            'background:#1e2d3d',
            'border:1.5px solid #6366f1'
        ].join(';');
        document.body.appendChild(ghost);

        // Placeholder opaco nella posizione originale
        dragEl.classList.add('ov-drag-active');

        // Pointer capture: riceve tutti gli eventi anche fuori dal grid
        grid.setPointerCapture(e.pointerId);
    });

    /* ── Movimento del ghost ── */
    grid.addEventListener('pointermove', e => {
        if (!dragEl || !ghost) return;
        ghost.style.left = (e.clientX - offX) + 'px';
        ghost.style.top  = (e.clientY - offY) + 'px';
        _highlight(_bodyAtPoint(e.clientX, e.clientY));
    });

    /* ── Rilascio: sposta il nodo nel DOM ed aggiorna il backend ── */
    grid.addEventListener('pointerup', e => {
        if (!dragEl) return;
        const body     = _bodyAtPoint(e.clientX, e.clientY);
        const newStato = body?.dataset?.statoDrop;
        const elDrop   = dragEl;   // snapshot prima di _cleanup()
        const oldStato = srcStato; // snapshot

        _cleanup();

        if (!newStato || newStato === oldStato || !body) return;

        const idRiga  = elDrop.dataset.idRiga;
        // Supporto gruppi: aggiorna tutte le righe della card
        const idRighe = (elDrop.dataset.idRighe || idRiga).split(',').map(s => s.trim()).filter(Boolean);
        const colore = (listaStati.find(s => s.nome === newStato) || {}).colore || '#94a3b8';

        // Sposta il nodo reale nel DOM immediatamente
        body.querySelectorAll('.ov-empty-lbl').forEach(el => el.remove());
        elDrop.dataset.statoCorrente = newStato;
        body.appendChild(elDrop);

        const destCard = body.closest('.ov-stato-card');
        if (destCard) destCard.open = true;

        _aggiornaKanbanCount(grid);
        _checkKanbanEmpty(grid);

        // Piccola animazione di "atterraggio"
        elDrop.style.transition = 'transform 0.18s, opacity 0.18s';
        elDrop.style.transform  = 'scale(1.04)';
        elDrop.style.opacity    = '0.6';
        requestAnimationFrame(() => {
            elDrop.style.transform = '';
            elDrop.style.opacity   = '';
            setTimeout(() => { elDrop.style.transition = ''; }, 200);
        });

        // Salva backend per tutte le righe del gruppo
        idRighe.forEach(id => {
            aggiornaDato(null, id, 'stato', newStato);
            if (_attiviProd) {
                const r = _attiviProd.find(x => String(x.id_riga) === id);
                if (r) r.stato = newStato;
            }
        });
        _syncStatoItemCard(idRiga, newStato, colore);
        notificaElegante(`Stato → ${newStato}`);
    });

    /* ── Annullamento (es. tasto Esc o interruzione sistema) ── */
    grid.addEventListener('pointercancel', _cleanup);

    // Previeni il drag HTML5 nativo che interferisce
    grid.addEventListener('dragstart', e => e.preventDefault());
}

function _aggiornaKanbanCount(grid) {
    grid.querySelectorAll('.ov-stato-body').forEach(body => {
        const stato = body.dataset.statoDrop;
        // Somma data-count di ogni card (una card può raggruppare più articoli)
        let count = 0;
        body.querySelectorAll('.ov-kanban-item').forEach(item => {
            count += parseInt(item.dataset.count || '1', 10);
        });
        const badge = grid.querySelector(`[data-stato-count="${stato}"]`);
        if (badge) badge.textContent = count + ' art.';
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
            lbl.textContent = '— nessun articolo';
            body.appendChild(lbl);
        }
    });
}

function _syncStatoItemCard(idRiga, newStato, colore) {
    // Aggiorna il dropdown stato nel pannello articoli (item-card) corrispondente
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

//PAGINA RICHIESTE//

async function caricaPaginaRichieste(expectedRequestId = null, signal = null) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    // Messaggio di caricamento con id univoco per il retry-timer
    contenitore.innerHTML = "<div class='centered-msg' id='_ric-loader'>Caricamento messaggi in corso...</div>";

    // Retry button dopo 12s se ancora in caricamento (GAS cold-start / rete lenta)
    const retryTimer = setTimeout(() => {
        const el = document.getElementById('_ric-loader');
        if (el) el.innerHTML = `⚠️ Connessione lenta o server non raggiungibile.<br>
            <button onclick="cambiaPagina('STORICO_RICHIESTE', null)"
                style="margin-top:12px;padding:8px 20px;background:#2563eb;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`;
    }, 12000);

    try {
        const [messaggiAttivi, messaggiArchivio] = await Promise.all([
            fetchJson("STORICO_RICHIESTE", signal),
            fetchJson("ARCHIVIO_RICHIESTE", signal)
        ]);
        clearTimeout(retryTimer);

        // Guard requestId: se arriva una risposta di una navigazione superata, aggiorna solo i badge
        if (expectedRequestId !== null && expectedRequestId !== _latestNavRequest) {
            aggiornaBadgeSidebar(messaggiAttivi);
            return;
        }

        // Aggiorna badge sidebar (sempre, indipendentemente dalla pagina attuale)
        aggiornaBadgeSidebar(messaggiAttivi);
        aggiornaBadgeNotifiche(messaggiAttivi);

        // Guard pagina: renderizza HTML solo se siamo ancora su STORICO_RICHIESTE
        if (paginaAttuale !== 'STORICO_RICHIESTE') return;

        const io = utenteAttuale.nome.toUpperCase().trim();

        const raggruppa = (dati) => {
            const gruppi = {};
            dati.forEach(m => {
                if (!gruppi[m.ORDINE]) gruppi[m.ORDINE] = [];
                gruppi[m.ORDINE].push(m);
            });
            return gruppi;
        };

        const gruppiAttivi = raggruppa(messaggiAttivi);
        const gruppiArchivio = raggruppa(messaggiArchivio);

        let html = `
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="_apriArchivio('archivio-req-details')">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>
            <div class="chat-inbox">`;

        // 1. RICHIESTE ATTIVE
        Object.keys(gruppiAttivi).reverse().forEach(nOrd => {
            html += generaCardRichiesta(gruppiAttivi[nOrd], io, false);
        });

        // 2. DIVISORE + ARCHIVIO COLLASSABILE
        let htmlArchReq = '';
        if (Object.keys(gruppiArchivio).length === 0) {
            htmlArchReq = `<div class="empty-msg" style="margin:20px 0">Nessuna richiesta archiviata.</div>`;
        } else {
            Object.keys(gruppiArchivio).reverse().forEach(nOrd => {
                htmlArchReq += generaCardRichiesta(gruppiArchivio[nOrd], io, true);
            });
        }
        html += `
        </div>
        <details id="archivio-req-details" class="archivio-details">
            <summary class="separatore-archivio archivio-summary" style="list-style:none">
                <span>ARCHIVIO</span>
                <i class="fas fa-chevron-down archivio-chevron"></i>
            </summary>
            <div class="chat-inbox">${htmlArchReq}</div>
        </details>`;

        contenitore.innerHTML = html;
        cacheContenuti['STORICO_RICHIESTE'] = html; // salva dopo archivio
        applicaFade(contenitore);
        aggiornaListaFiltrabili();
        _osservaArchivio('archivio-req-details');

        // Reset barra di ricerca al caricamento
        ['universal-search', 'mobile-search'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

    } catch (e) {
        clearTimeout(retryTimer);
        if (e.name === 'AbortError') return; // navigazione annullata
        console.error("Errore caricamento richieste:", e);
        contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento. <button onclick=\"cambiaPagina('STORICO_RICHIESTE',null)\" style=\"margin-left:8px;padding:4px 12px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer\">Riprova</button></div>";
        applicaFade(contenitore);
    }
}
function cambiaVistaUtente(valoreSelezionato) {
    // Salviamo la vista simulata
    utenteAttuale.vistaSimulata = valoreSelezionato;

    // CRUCIALE: Cambiamo il nome attuale in base alla selezione per "ingannare" il sistema al momento dell'invio
    if (valoreSelezionato === "MASTER") {
        utenteAttuale.nome = "MASTER";
    } else {
        // Se scelgo ALESSIO, il sistema deve firmare come ALESSIO
        utenteAttuale.nome = valoreSelezionato;
    }

    // Ricarichiamo la pagina per aggiornare bolle e filtri
    caricaPaginaRichieste();
}
async function aggiornaRichiesta(idRiga, tipoAzione) {
    try {
        await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'aggiorna_richiesta_stato',
                id_riga: idRiga,
                tipo: tipoAzione
            })
        });
        delete cacheContenuti['STORICO_RICHIESTE'];
        delete cacheFetchTime['STORICO_RICHIESTE'];
        caricaPaginaRichieste(); // Rinfresca la vista
    } catch (e) { notificaElegante('Errore aggiornamento.', 'error'); }
}
function _sollecitaConferma(idRiga) {
    mostraConferma('Sollecita Richiesta', 'Inviare un sollecito per questa richiesta?', () => sollecitaRichiesta(idRiga), 'Sollecita');
}
function _archiviaConferma(idRiga) {
    mostraConferma('Archivia Richiesta', 'Archiviare definitivamente questa discussione?', () => aggiornaRichiesta(idRiga, 'risolto'), 'Archivia');
}
async function sollecitaRichiesta(idRiga) {
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'aggiorna_richiesta_stato',
                id_riga: idRiga,
                tipo: 'sollecita'
            })
        });
        const json = await res.json();
        if (json.status === 'success') {
            delete cacheContenuti['STORICO_RICHIESTE'];
            delete cacheFetchTime['STORICO_RICHIESTE'];
            notificaElegante('Sollecito inviato!');
            caricaPaginaRichieste();
        }
    } catch (e) {
        alert('Errore durante il sollecito.');
    }
}
function formattaData(stringaData) {
    if (!stringaData) return "N.D.";

    let d;
    // Se è un timestamp numerico
    if (!isNaN(stringaData) && typeof stringaData !== 'string') {
        d = new Date(Number(stringaData));
    } else {
        d = new Date(stringaData);
        // Se fallisce, proviamo formato italiano GG/MM/AAAA HH:MM
        if (isNaN(d.getTime())) {
            const match = String(stringaData).match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
            if (match) {
                const [, g, m, a] = match;
                const oraMatch = String(stringaData).match(/(\d{2}):(\d{2})/);
                const h = oraMatch ? oraMatch[1] : "00";
                const min = oraMatch ? oraMatch[2] : "00";
                d = new Date(`${a}-${m}-${g}T${h}:${min}:00`);
            }
        }
    }

    if (!d || isNaN(d.getTime())) return stringaData;

    const giorno = String(d.getDate()).padStart(2, '0');
    const mese = String(d.getMonth() + 1).padStart(2, '0');
    const anno = d.getFullYear();
    const ore = String(d.getHours()).padStart(2, '0');
    const minuti = String(d.getMinutes()).padStart(2, '0');

    // Restituisce il formato pulito
    return `${giorno}/${mese}/${anno} ${ore}:${minuti}`;
}
function generaCardRichiesta(msgs, io, isArchiviata) {
    const ultimo = msgs[msgs.length - 1];
    const nOrd = ultimo.ORDINE;
    const nomeCliente = ultimo.CLIENTE || "";

    // Controlla se almeno un messaggio del gruppo è sollecitato
    const isSollecitata = msgs.some(m => String(m.SOLLECITO).toLowerCase() === 'true');

    // Icona tipo: freccia verde = assegnazione, ? azzurro = domanda
    const tipoRaw = (ultimo.TIPO || 'MSG').toUpperCase();
    const isDomanda = tipoRaw === 'AIUTO' || tipoRaw === 'DOMANDA';
    const tipoIconaHtml = isDomanda
        ? `<span class="chat-tipo-dot chat-tipo-domanda" title="Domanda"><i class="fas fa-question"></i></span>`
        : `<span class="chat-tipo-dot chat-tipo-assegna" title="Assegnazione"><i class="fas fa-arrow-right"></i></span>`;

    return `
        <div class="chat-card${isArchiviata ? ' archiviata' : ''}${isSollecitata ? ' sollecitata' : ''} ${TW.card}" data-ordine="${String(nOrd || '')}" data-cliente="${(nomeCliente || '').toLowerCase().replace(/"/g, '')}">

            <div class="chat-header${isArchiviata ? ' archiviata' : ''}">
                <div>
                    ${tipoIconaHtml}
                    ${isSollecitata ? `<span class="badge-sollecito"><i class="fa-solid fa-bullhorn"></i> SOLLECITATA</span>` : ''}
                    <span class="chat-order-label">ORD. ${nOrd}</span>${nomeCliente ? `<span class="chat-cliente-label"> • ${nomeCliente}</span>` : ''}
                </div>
                <span class="chat-date">${formattaData(ultimo["DATA ORA"])}</span>
            </div>

            <div class="chat-body">
                ${msgs.map(m => {
                    const amIMittente = (String(m.DA).toUpperCase().trim() === io);
                    const testo = String(m.MESSAGGIO || "").includes("|") ? m.MESSAGGIO.split("|")[1] : m.MESSAGGIO;
                    return `
                        <div class="chat-bubble-wrapper ${amIMittente ? 'sent' : 'received'}">
                            <div class="chat-bubble">
                                <div class="chat-bubble-name">${m.DA}</div>
                                <div class="chat-bubble-text">${testo}</div>
                            </div>
                        </div>`;
                }).join('')}
            </div>

            ${!isArchiviata ? `
                <div id="box-conferma-${ultimo.id_riga}" class="box-conferma box-hidden">
                    <div class="box-message">Archiviare definitivamente questa discussione?</div>
                    <div class="box-actions">
                        <button onclick="toggleBoxArchivia('${ultimo.id_riga}')" class="btn-cancel button-small">Annulla</button>
                        <button onclick="aggiornaRichiesta('${ultimo.id_riga}', 'risolto')" class="btn-archive-action button-small">Sì, Archivia</button>
                    </div>
                </div>

                <div id="box-risposta-${ultimo.id_riga}" class="box-risposta box-hidden">
                    <div class="reply-wrapper">
                        <textarea id="input-risposta-${ultimo.id_riga}" class="reply-input" placeholder="Scrivi una risposta..."></textarea>
                        <div class="reply-footer">
                            <span class="reply-hint"><i class="fa-regular fa-paper-plane"></i> Risposta a <b>${ultimo.DA === io ? ultimo.A : ultimo.DA}</b></span>
                            <button onclick="inviaRisposta('${ultimo.id_riga}', '${nOrd}', '${ultimo.DA === io ? ultimo.A : ultimo.DA}')" class="btn-reply-send">
                                <i class="fa-solid fa-paper-plane"></i> Invia
                            </button>
                        </div>
                    </div>
                </div>

                <div class="chat-actions">
                    <div class="chat-to-info">
                        <span class="chat-to-dest">A: <b>${ultimo.A}</b></span>
                    </div>
                    <div class="chat-action-btns">
                        <button onclick="toggleAreaRisposta('${ultimo.id_riga}')" class="btn-reply button-small ${TW.btn}" title="Rispondi"><i class="fa-regular fa-comment"></i> <span class="btn-txt">Rispondi</span></button>
                        <button onclick="_sollecitaConferma('${ultimo.id_riga}')" class="btn-alert button-small ${TW.btnWarning}" title="Sollecita"><i class="fa-solid fa-bullhorn"></i> <span class="btn-txt">Sollecita</span></button>
                        <button onclick="_archiviaConferma('${ultimo.id_riga}')" class="btn-archive button-small ${TW.btnSuccess}" title="Archivia"><i class="fa-solid fa-box-archive"></i> <span class="btn-txt">Archivia</span></button>
                    </div>
                </div>
            ` : `
                <div class="chat-archiviata-note">
                    <span class="chat-archiviata-label">✓ ARCHIVIATA</span>
                </div>
            `}
        </div>`;
}







//PAGINA IMPOSTAZIONI//

async function caricaImpostazioni() {
        try {
            const res = await fetch(URL_GOOGLE + "?azione=getImpostazioni");
            const settings = await res.json();
            listaStati = settings.stati || [];
            listaOperatori = settings.operatori || [];
        } catch (e) { console.error("Errore caricamento impostazioni"); }
    }
function toggleSettingsSection(sectionId, rowEl) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const arrow = rowEl.querySelector('.settings-row-arrow');
    const isOpen = section.style.display === 'block';
    section.style.display = isOpen ? 'none' : 'block';
    if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
    rowEl.classList.toggle('settings-row-active', !isOpen);
    // Carica lista utenti quando aperta
    if (!isOpen && (sectionId === 'section-utenti' || sectionId === 'section-team-utenti')) caricaListaUtenti();
}

/* ─── GESTIONE UTENTI ────────────────────────────────────── */
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
                        <div class="avatar-circle">${(username.charAt(0) || '?').toUpperCase()}</div>
                        <input type="text" class="input-flat" id="ut-username-${id}" value="${username.replace(/"/g, '&quot;')}" onchange="" placeholder="Username">
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
    if (password) hash = await hashSHA256(password);

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
        const hash = await hashSHA256(password);
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
function caricaInterfacciaImpostazioni() {
        const contenitore = document.getElementById('contenitore-dati');
        if (!contenitore) return;

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
                ` : ''}

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
                        <button id="btn-toggle-push" class="settings-action-btn" onclick="_togglePushPermission()">
                            <i class="fas fa-bell"></i> Attiva notifiche push
                        </button>
                        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
                            <button id="btn-force-regpush" class="settings-action-btn" style="background:rgba(99,102,241,0.15);font-size:0.82rem;padding:8px 12px" onclick="_forzaRiregistraPush()">
                                🔄 Ri-registra subscription
                            </button>
                            <button id="btn-test-push" class="settings-action-btn" style="background:rgba(34,197,94,0.12);font-size:0.82rem;padding:8px 12px" onclick="_testPushNotifica()">
                                📨 Invia notifica di test
                            </button>
                        </div>
                        <div style="margin-top:20px;border-top:1px solid rgba(255,255,255,0.07);padding-top:16px">
                            <div style="font-size:0.78rem;font-weight:600;color:#9ca3af;letter-spacing:.5px;margin-bottom:12px">TIPOLOGIE DI AVVISI</div>
                            <label class="notif-pref-row">
                                <input type="checkbox" id="np-richieste" onchange="_onNotifPrefChange()"
                                    ${_getNotifPrefs().richieste ? 'checked' : ''}>
                                <span><i class="fas fa-comment-dots" style="color:#60a5fa"></i>&nbsp;Nuove richieste / messaggi</span>
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

            </div>

            <div class="centered-fullwidth my-30">
                <button type="button" class="${TW.btnPrimaryLg}" onclick="salvaTutteImpostazioni()">
                    <i class="fas fa-save"></i> Salva Modifiche
                </button>
            </div>
        `;
        applicaFade(contenitore);
        // Chiama initSortable subito (gli elementi esistono nel DOM anche se hidden)
        initSortable('lista-stati-config', (container) => {
            const rows = [...container.querySelectorAll('[data-idx]')];
            const nuovoOrdine = rows.map(el => listaStati[+el.dataset.idx]);
            listaStati.length = 0;
            nuovoOrdine.forEach((s, i) => { listaStati.push(s); rows[i].dataset.idx = i; });
            segnaModifica();
        });
    }
function azioneEliminaStato(i) {
         if(confirm("Sei sicuro di voler eliminare questo stato?")) {
             listaStati.splice(i, 1);
             segnaModifica();
             caricaInterfacciaImpostazioni();
         }
     }
function azioneAggiungiStato() {
         listaStati.push({nome: 'NUOVO', colore: '#94a3b8'});
         segnaModifica();
         caricaInterfacciaImpostazioni();
     }
// azioneEliminaOp e azioneAggiungiOp rimossi: operatori derivati da UTENTI
function segnaModifica() {
    modifichePendenti = true;
    const btn = document.getElementById('btn-salva-globale');
    if (btn) {
        btn.style.background = "#ef4444"; // Diventa rosso per segnalare modifiche
        btn.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Salva Modifiche Ora!";
    }
} // Funzione per attivare l'allerta salvataggio

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
                body: JSON.stringify({ azione: 'salva_impostazioni_globali', stati: listaStati, operatori: [] })
            });
            const json = await res.json().catch(() => ({}));
            if (json.status === 'success') {
                notificaElegante('Impostazioni salvate correttamente!');
                modifichePendenti = false;
                const btn = document.getElementById('btn-salva-globale');
                if (btn) {
                    btn.style.background = '';
                    btn.innerHTML = "<i class='fas fa-save'></i> Salva Impostazioni";
                }
            } else {
                notificaElegante('Errore: ' + (json.message || 'risposta inattesa dal server'), 'error');
            }
        } catch (e) {
            notificaElegante('Errore nel salvataggio.', 'error');
        }
    }






  // --- PAGINA ACQUISTI ---
  let carrelloLocale = [];
  let sezioniMateriali = JSON.parse(localStorage.getItem('sezioniMateriali') || '["Strumenti","Bombolette","Rifiuti"]');

  // Carica le sezioni dal backend (sovrascrive il localStorage se il backend le ha)
  async function _caricaSezioniDaBackend() {
    try {
      const res = await fetch(URL_GOOGLE + '?pagina=SEZIONI_CONFIG');
      const sezioniRemote = await res.json();
      if (Array.isArray(sezioniRemote) && sezioniRemote.length > 0) {
        sezioniMateriali = sezioniRemote;
        localStorage.setItem('sezioniMateriali', JSON.stringify(sezioniMateriali));
      }
    } catch (e) {
      console.warn('Sezioni: fallback a localStorage', e);
    }
  }

  async function _salvaSezioniSuBackend() {
    try {
      await fetch(URL_GOOGLE, {
        method: 'POST',
        body: JSON.stringify({ azione: 'salvaSezioni', sezioni: sezioniMateriali })
      });
    } catch (e) {
      console.warn('Impossibile salvare sezioni sul backend', e);
    }
  }

  async function caricaMateriali(silenzioso = false, expectedRequestId = null, signal = null) {
    // --- PROTEZIONE AGGIORNAMENTO ---
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
        const materiali = await fetchJson("MATERIALE DA ORDINARE", signal);

        // Guard anti-stale
        if (expectedRequestId !== null && expectedRequestId !== _latestNavRequest) return;
        if (!silenzioso && paginaAttuale !== 'MATERIALE DA ORDINARE') return;
        await _caricaSezioniDaBackend();

        // Aggiungi in sezioniMateriali eventuali sezioni già presenti nei dati ma non ancora in lista
        materiali.forEach(item => {
            const s = (item.SEZIONE || '').trim();
            if (s && !sezioniMateriali.includes(s)) {
                sezioniMateriali.push(s);
            }
        });

        // Guard anti-stale: se l'utente ha cambiato pagina mentre il fetch era in corso, ignorare
        if (!silenzioso && paginaAttuale !== 'MATERIALE DA ORDINARE') return;

        if (!materiali || materiali.length === 0) {
            contenitore.innerHTML = "<div class='empty-msg'>Nessun materiale trovato nel catalogo.</div>";
            applicaFade(contenitore);
            return;
        }

        // Raggruppa per sezione
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
                const fornitore = (item.FORNITORE || "Generico").replace(/"/g, '&quot;');
                const codice = (item.CODICE || "").replace(/"/g, '&quot;');
                const qtyId = `qty-item-${index}`;
                const idRiga = item.id_riga;
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
        cacheContenuti["MATERIALE DA ORDINARE"] = html;
        cacheFetchTime["MATERIALE DA ORDINARE"] = Date.now();
        contenitore.innerHTML = html;
        applicaFade(contenitore);
        aggiornaListaFiltrabili();

    } catch (e) {
        if (e.name === 'AbortError') return; // navigazione annullata
        console.error("Errore caricamento materiali:", e);
        if (contenitore) {
            contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento del catalogo.</div>";
            applicaFade(contenitore);
        }
    }
}
  function cambiaQty(inputId, delta) {
      const el = document.getElementById(inputId);
      if (!el) return;
      const val = (parseInt(el.value) || 1) + delta;
      el.value = Math.max(1, val);
  }
  function aggiungiAlCarrello(nome, fornitore, inputId) {
      const qtyInput = document.getElementById(inputId);
      const qty = parseInt(qtyInput.value) || 1; // Prende il valore attuale dell'input

      // Recuperiamo l'immagine se presente
      const container = document.querySelector(`[data-prod="${nome}"]`);
      const imgPreview = container ? container.querySelector('img') : null;
      const fotoBase64 = imgPreview ? imgPreview.src : null;

      carrelloLocale.push({
          prodotto: nome,
          quantita: qty,
          fornitore: fornitore,
          foto: fotoBase64
      });

      aggiornaBadgeCarrello();

      // Feedback visivo: solo icona ✓ verde per 1.4s
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
      const modal = document.getElementById('modal-carrello');
      const lista = document.getElementById('lista-articoli-carrello');
      const btnInvia = document.getElementById('btn-invia-alessio');

      if (carrelloLocale.length === 0) {
          lista.innerHTML = "<p class='empty-cart-msg'>Il tuo carrello è vuoto.</p>";
          if (btnInvia) btnInvia.style.display = 'none';
      } else {
          let html = "";
          carrelloLocale.forEach((item, index) => {
              html += `
              <div class="cart-item-row">
                  ${item.foto ? `<img src="${item.foto}" class="cart-item-photo">` : `<div class="cart-item-placeholder"><i class="fas fa-shopping-basket cart-item-icon"></i></div>`}
                  <div class="flex-grow">
                      <div class="cart-item-name">${item.prodotto}</div>
                      <div class="cart-item-details">Qt: ${item.quantita} - ${item.fornitore}</div>
                  </div>
                  <button onclick="rimuoviDalCarrello(${index})" class="btn-inline-trash"><i class="fas fa-trash"></i></button>
              </div>`;
          });
          lista.innerHTML = html;
          if (btnInvia) btnInvia.style.display = 'block';
      }
      modal.style.display = 'flex';
      requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('cart-open')));
  }
  function rimuoviDalCarrello(index) {
      carrelloLocale.splice(index, 1);
      aggiornaBadgeCarrello();
      toggleMostraCarrello(); // Refresh della lista
  }
  function chiudiModalCarrello() {
      const modal = document.getElementById('modal-carrello');
      modal.classList.remove('cart-open');
      setTimeout(() => { modal.style.display = 'none'; }, 300);
  }
  // Alias: il floating button chiama apriModalCarrello
  function apriModalCarrello() { toggleMostraCarrello(); }
  function aggiornaBadgeCarrello() {
      const count = carrelloLocale.length;

      // Aggiorna tutti i badge presenti nel DOM
      const b1 = document.getElementById('badge-carrello-count');
      const b2 = document.getElementById('cart-qty-val');

      if (b1) {
          b1.innerText = count;
          b1.style.display = count > 0 ? 'flex' : 'none';
      }
      if (b2) b2.innerText = count;
  }
  async function inviaOrdineAcquisti() {
      if (carrelloLocale.length === 0) {
          alert("Il carrello è vuoto!");
          return;
      }

      const conferma = confirm(`Vuoi inviare la lista di ${carrelloLocale.length} articoli all'ufficio acquisti?`);
      if (!conferma) return;

      // Mostriamo un loader sul bottone di invio se esiste
      const btnInvia = document.getElementById('btn-invia-alessio');
      const testoOriginale = btnInvia ? btnInvia.innerText : "";
      if (btnInvia) {
          btnInvia.disabled = true;
          btnInvia.innerText = "Invio in corso...";
      }

      try {
          const payload = {
              azione: "inviaOrdineAcquisti",
              operatore: (typeof utenteAttuale !== 'undefined') ? utenteAttuale.nome : "Utente",
              articoli: carrelloLocale
          };

          const res = await fetch(URL_GOOGLE, {
              method: 'POST',
              body: JSON.stringify(payload)
          });

          const result = await res.json();

          if (result.status === "success") {
              alert("✅ Ordine inviato con successo ad Alessio!");
              carrelloLocale = [];
              aggiornaBadgeCarrello();
              if (typeof chiudiModalCarrello === "function") chiudiModalCarrello();
              cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE');
          } else {
              throw new Error(result.message);
          }
      } catch (e) {
          alert("❌ Errore nell'invio dell'ordine: " + e.message);
      } finally {
          if (btnInvia) {
              btnInvia.disabled = false;
              btnInvia.innerText = testoOriginale;
          }
      }
  }
  function scattaFoto(nomeProdotto) {
      // Usiamo CSS.escape per gestire nomi con spazi, virgolette o caratteri speciali
      const selettore = `[data-prod="${nomeProdotto.replace(/"/g, '\\"')}"]`;
      const container = document.querySelector(selettore);

      if (!container) return;

      // Se c'è già una foto → apri fullscreen. Rimozione solo dal menu ⋮
      if (container.querySelector('img')) {
          const src = container.querySelector('img').src;
          apriImmagineIntera(src);
          return;
      }

      const input = document.createElement('input');
      input.type = 'file';
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

              // Mostra voce "Elimina foto" nel menu ⋮ di questa card
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
          // Nasconde di nuovo voce "Elimina foto" nel menu
          const card = container.closest('.materiale-card');
          if (card) {
              const btnFoto = card.querySelector('.btn-menu-elimina-foto');
              if (btnFoto) btnFoto.style.display = 'none';
          }
      }
  }
  function apriImmagineIntera(src) {
      // Crea un overlay temporaneo per vedere la foto grande
      const overlay = document.createElement('div');
      overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:200000; display:flex; justify-content:center; align-items:center; cursor:zoom-out;";
      overlay.innerHTML = `<img src="${src}" class="overlay-img">`;
      overlay.onclick = () => document.body.removeChild(overlay);
      document.body.appendChild(overlay);
  }
  function toggleMenuOpzioni(event, index) {
      event.preventDefault();
      event.stopPropagation();

      // Chiudi tutti gli altri menu
      document.querySelectorAll('.menu-popup-opzioni').forEach(m => {
          if (m.id !== `menu-opzioni-${index}`) m.classList.remove('open');
      });

      const menu = document.getElementById(`menu-opzioni-${index}`);
      if (menu) menu.classList.toggle('open');
  }

// Chiudi i menu se clicchi altrove
document.addEventListener('click', () => {
        document.querySelectorAll('.menu-popup-opzioni.open').forEach(m => m.classList.remove('open'));
});
  function apriModalNuovo() {
    document.getElementById('titolo-modal-articolo').innerText = "Nuovo Articolo";
    document.getElementById('edit-id-riga').value = "";
    document.getElementById('edit-nome').value = "";
    document.getElementById('edit-codice').value = "";
    document.getElementById('edit-fornitore').value = "";
    const modal = document.getElementById('modal-gestione-articolo');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
  }
  function apriModalModifica(id, nome, fornitore, codice) {
    const modal = document.getElementById('modal-gestione-articolo');
    document.getElementById('titolo-modal-articolo').innerText = id ? "Modifica Articolo" : "Nuovo Articolo";
    document.getElementById('edit-id-riga').value = id || "";
    document.getElementById('edit-nome').value = nome || "";
    document.getElementById('edit-codice').value = (codice && codice !== 'undefined') ? codice : "";
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

  const btn = document.getElementById('btn-salva-articolo');

  const nome = document.getElementById('edit-nome').value.trim();

  if (!nome) return alert("Inserisci il nome!");



  const payload = {

      azione: "gestisciMateriale",

      id_riga: document.getElementById('edit-id-riga').value,

      nome: nome,

      codice: document.getElementById('edit-codice').value,

      fornitore: document.getElementById('edit-fornitore').value

  };



  // Feedback immediato

  btn.innerText = "Salvataggio...";

  btn.disabled = true;



  try {

      const res = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) });

      const r = await res.json();

      if (r.status === "success") {

          chiudiModalArticolo(); // CHIUDI PRIMA DI RICARICARE

          caricaMateriali();     // RICARICA DOPO

      }

  } catch (e) {

      alert("Errore salvataggio!");

  } finally {

      btn.innerText = "Salva";

      btn.disabled = false;

  }

}
  async function duplicaArticolo(idRiga, nome, fornitore, codice) {
    mostraConferma('Duplica Articolo', `Duplicare l'articolo: "${nome}"?`, async () => {

    const cardOriginale = document.querySelector(`[data-id="${idRiga}"]`).closest('.materiale-card');

    // Generiamo un ID temporaneo basato sul tempo per rendere il menu unico
    const tempIndex = Date.now();
    const qtyId = `qty-item-temp-${tempIndex}`;

    const divScatola = document.createElement('div');
    divScatola.innerHTML = `
        <div class="materiale-card ${TW.card}">

            <!-- Area immagine -->
            <div class="mat-card-img img-preview-container"
                 data-prod="${nome}" data-fornitore="${fornitore}"
                 onclick="scattaFoto('${nome.replace(/'/g, "\\'")}')">
                <i class="fas fa-camera mat-img-icon"></i>
                <span class="mat-img-hint">Scatta foto</span>
                <span class="mat-badge-fornitore">${fornitore}</span>
            </div>

            <!-- Info prodotto -->
            <div class="materiale-info">
                <div class="materiale-nome">${nome}</div>
                ${codice ? `<div class="materiale-codice">${codice}</div>` : ''}
                <div class="materiale-fornitore mat-fornitore-mobile">${fornitore}</div>
            </div>

            <!-- Footer azioni -->
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

            <!-- Menu opzioni + checkbox -->
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
    nuovaCard.style.opacity = '0';
    nuovaCard.style.transform = 'translateY(-10px)';
    cardOriginale.after(nuovaCard);
    requestAnimationFrame(() => {
        nuovaCard.style.transition = 'opacity 0.3s, transform 0.3s';
        nuovaCard.style.opacity = '1';
        nuovaCard.style.transform = 'translateY(0)';
    });

    // Salvataggio reale in background
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: "duplicaMateriale",
                id_riga: idRiga,
                nome: nome,
                codice: codice,
                fornitore: fornitore
            })
        });
        const r = await res.json();
        if (r.status === "success") caricaMateriali(true);
    } catch (e) {
        nuovaCard.style.border = "1px solid red";
        notificaElegante('Errore di sincronizzazione.', 'error');
    }
    }, 'Duplica');
  } // fine duplicaArticolo


  // ── sezioni acquisti ──────────────────────────────────────────
  function toggleSezione(gridId) {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      const isOpen = grid.style.display !== 'none';
      grid.style.display = isOpen ? 'none' : '';
      const wrapper = grid.closest('.sezione-materiali-wrapper');
      const arrow = wrapper?.querySelector('.sezione-arrow');
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
      const idRiga = document.getElementById('sposta-id-riga').value;
      const sezione = document.getElementById('sposta-sezione-select').value;
      chiudiModalSpostaSezione();
      try {
          await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'spostaSezione', id_riga: idRiga, sezione }) });
          delete cacheContenuti['MATERIALE DA ORDINARE'];
          caricaMateriali(false);
      } catch (e) { notificaElegante('Errore durante lo spostamento.', 'error'); }
  }

  function apriModalRinominaSezione(nomeVecchio) {
      document.getElementById('rinomina-sezione-nome').value = nomeVecchio;
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
      const nuovoNome = document.getElementById('rinomina-sezione-nome').value.trim();
      const vecchioNome = document.getElementById('rinomina-sezione-vecchio').value;
      if (!nuovoNome || nuovoNome === vecchioNome) { chiudiModalRinominaSezione(); return; }
      if (sezioniMateriali.includes(nuovoNome)) { notificaElegante('Esiste già una sezione con questo nome.', 'error'); return; }
      chiudiModalRinominaSezione();
      // Aggiorna array locale
      sezioniMateriali = sezioniMateriali.map(s => s === vecchioNome ? nuovoNome : s);
      localStorage.setItem('sezioniMateriali', JSON.stringify(sezioniMateriali));
      try {
          await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'rinominaSezione', vecchioNome, nuovoNome }) });
          delete cacheContenuti['MATERIALE DA ORDINARE'];
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
          _salvaSezioniSuBackend(); // Persiste sul backend per tutti i dispositivi
      }
      chiudiModalNuovaSezione();
      delete cacheContenuti['MATERIALE DA ORDINARE'];
      caricaMateriali(false);
  }
  // ─────────────────────────────────────────────────────────────

  function toggleSelezioneMultipla() {
    const grid = document.getElementById('lista-materiali-grid');
    const btnElimina = document.getElementById('btn-delete-selected');
    const btn = document.getElementById('btn-mode-select');
    if (!grid) return;
    const isOn = grid.classList.toggle('grid-sel-mode');
    // Reset conteggio e deseleziona tutto
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
    const btnElimina = document.getElementById('btn-delete-selected');
    document.getElementById('count-selected').innerText = selezionati;
    if (selezionati > 0) btnElimina.classList.add('visible');
    else btnElimina.classList.remove('visible');
  }
  async function eliminaArticolo(idRiga) {
    mostraConferma('Elimina Articolo', 'Eliminare definitivamente questo articolo dal catalogo?', async () => {
        const card = document.querySelector(`[data-id="${idRiga}"]`).closest('.materiale-card');
        card.style.transition = "all 0.3s ease";
        card.style.transform = "scale(0.8)";
        card.style.opacity = "0";
        setTimeout(() => card.style.display = "none", 300);
        try {
            const res = await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: "eliminaMateriale", id_riga: idRiga })
            });
            const r = await res.json();
            if (r.status !== "success") throw new Error();
            caricaMateriali(true);
        } catch (e) {
            card.style.display = "flex";
            card.style.opacity = "1";
            card.style.transform = "";
            notificaElegante('Errore durante l\'eliminazione.', 'error');
        }
    }, 'Elimina');
  }
  async function eliminaSelezionati() {
    // Filtriamo gli ID per ignorare quelli "temp" non ancora salvati su Google
    const checkboxes = document.querySelectorAll('.mat-sel-chk:checked');
    const selezionati = Array.from(checkboxes)
                             .map(c => c.getAttribute('data-id'))
                             .filter(id => id && id !== "temp" && id !== "null");

    if (selezionati.length === 0) {
        alert("Nessun articolo valido selezionato. Attendi il salvataggio dei nuovi duplicati prima di eliminarli.");
        return;
    }

    if (!confirm(`Sei sicuro di voler eliminare ${selezionati.length} articoli?`)) return;

    try {
        // Feedback visivo immediato (oscuriamo le card selezionate)
        checkboxes.forEach(cb => {
            const card = cb.closest('.materiale-card');
            if (card) {
                card.style.opacity = "0.3";
                card.style.pointerEvents = "none";
            }
        });

        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: "eliminaMateriale",
                id_riga: selezionati
            })
        });

        const r = await res.json();
        if (r.status === "success") {
            notificaElegante("Articoli eliminati con successo");

            // Disattiva la modalità selezione prima di ricaricare
            const btnDelete = document.getElementById('btn-delete-selected');
            if (btnDelete) btnDelete.classList.remove('visible');

            caricaMateriali(false); // Ricarica completa per pulire la griglia
        } else {
            throw new Error(r.message);
        }
    } catch (e) {
        alert("Errore durante l'eliminazione multipla: " + e.message);
        caricaMateriali(true); // Ripristina la visualizzazione in caso di errore
    }
}

//FUNZIONE CONTRO IL FREEZE//

  async function eseguiAzioneServer(payload) {

    try {

        console.log("Invio azione:", payload.azione);

        const response = await fetch(URL_GOOGLE, {

            method: 'POST',

            mode: 'no-cors', // Spesso necessario con Google Apps Script se non è configurato CORS

            body: JSON.stringify(payload)

        });



        // Se usi 'no-cors', non puoi leggere la risposta JSON.

        // Se non lo usi, procedi come sotto:

        /*

        const res = await response.json();

        if (r.status === "success") return true;

        */



        // Per ora facciamo un approccio sicuro:

        setTimeout(() => {

            notificaElegante("Operazione completata");

            caricaMateriali(); // Ricarica dopo 1 secondo per dare tempo al server

        }, 1500);



        return true;

    } catch (e) {

        console.error("Errore critico:", e);

        alert("Errore di connessione. Riprova.");

        return false;

    }

}





//FUNZIONI UNIVERSALI//

// Escapa i caratteri speciali regex nell'input utente
function _escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Restituisce true se la stringa inizia con il termine (prima parola)
function _matchFirstWord(text, term) {
    if (!term) return true;
    return text.trimStart().startsWith(term);
}

function filtraUniversale() {
    clearTimeout(ricercaTimeout);
    ricercaTimeout = setTimeout(() => {
        // Legge da tutti gli input di ricerca (top bar desktop + mobile)
        const topVal    = (document.getElementById('universal-search')?.value || '').toLowerCase().trim();
        const mobVal    = (document.getElementById('mobile-search')?.value    || '').toLowerCase().trim();
        const input = topVal || mobVal;
        const grid = document.getElementById('lista-materiali-grid');

        if (!elementiDaFiltrareCache) aggiornaListaFiltrabili();
        if (!elementiDaFiltrareCache) return;

        // ── Matching a due livelli ──────────────────────────────────────────
        // PRIMARIO  : il testo inizia per il termine digitato (sempre attivo)
        // SECONDARIO: il testo contiene il termine (attivo solo da 3 caratteri)
        const isNumericOnly  = input !== '' && /^\d+$/.test(input);
        const secondaryOn    = input.length >= 3;

        elementiDaFiltrareCache.forEach(el => {
            let primary = false;
            let secondary = false;

            if (input === '') {
                primary = true;
            } else if (el.classList.contains('ordine-wrapper') || el.classList.contains('chat-card')) {
                const ordine  = String(el.dataset.ordine  || '');
                const cliente = String(el.dataset.cliente || '');
                if (isNumericOnly) {
                    primary = ordine.startsWith(input);
                } else {
                    primary = _matchFirstWord(cliente, input);
                    if (!primary && secondaryOn) secondary = cliente.includes(input);
                }
            } else {
                // Acquisti (materiale-card)
                const ds = String(el.dataset.search || el.textContent || '').toLowerCase();
                primary = _matchFirstWord(ds, input);
                if (!primary && secondaryOn) secondary = ds.includes(input);
            }

            const visible = primary || secondary;
            el.classList.toggle('hidden-search', !visible);
            // Marca visivamente i risultati secondari (sfondo leggermente distinto)
            el.classList.toggle('search-secondary', !primary && secondary);
        });

        // ── Modalità ricerca acquisti: appiattisce le sezioni ─────────────────
        if (grid) {
            if (input !== '') {
                grid.classList.add('search-active');
                document.querySelectorAll('.sezione-materiali-wrapper').forEach(wrapper => {
                    const visibili = wrapper.querySelectorAll('.materiale-card:not(.hidden-search)').length;
                    wrapper.classList.toggle('sez-no-results', visibili === 0);
                });
            } else {
                grid.classList.remove('search-active');
                document.querySelectorAll('.sezione-materiali-wrapper').forEach(w => {
                    w.classList.remove('sez-no-results');
                    w.style.display = '';
                });
            }
        }

        const sezioneArchivio = document.getElementById('sezione-archivio');
        if (sezioneArchivio) sezioneArchivio.style.display = input === '' ? 'block' : 'none';
    }, 120);
}
function notificaElegante(messaggio) {
    // Crea l'elemento notifica
    const toast = document.createElement('div');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${messaggio}`;

    // Stile della notifica
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1e293b',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: '100000',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: '0',
        transition: 'all 0.4s ease'
    });

    document.body.appendChild(toast);

    // Animazione entrata
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.bottom = '30px';
    }, 100);

    // Auto-distruzione dopo 3 secondi
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '20px';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
document.addEventListener('DOMContentLoaded', async function() {
    if (_pageInitDone) return;
    _pageInitDone = true;

    let hasSession = false;
    try { hasSession = !!(localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente')); } catch (e) {}
    if (!hasSession) return;

    // 1️⃣ Carica prima le impostazioni (operatori + stati)
    await caricaImpostazioni();

    // 2️⃣ Recupera pagina salvata
    let paginaSalvata = localStorage.getItem('ultimaPaginaProduzione');

    if (!paginaSalvata || paginaSalvata === "undefined" || paginaSalvata === "null") {
        paginaSalvata = "PROGRAMMA PRODUZIONE DEL MESE";
    }

    // 3️⃣ Trova il tasto
    const tastoMenu = document.querySelector(`.menu-item[data-page="${paginaSalvata}"]`);

    // 4️⃣ Cambia pagina (questa farà il fetch corretto)
    cambiaPagina(paginaSalvata, tastoMenu);
});
document.addEventListener('click', function (e) {
    if (window.innerWidth > 768) return; // Non toccare nulla su Desktop

    // Close mobile sidebar when tapping the backdrop
    if (document.body.classList.contains('sidebar-is-open')) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.contains(e.target) && !e.target.closest('#btn-mobile-menu')) {
            sidebar.classList.remove('mobile-open');
            document.body.classList.remove('sidebar-is-open');
            return;
        }
    }

    const card = e.target.closest('.riga-ordine');
    if (card) {
        // Se clicchi un bottone, esegui il comando e non chiudere
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

        // Toggle della classe espansa
        card.classList.toggle('espansa');
    }
});

// Fallback helpers and bindings to ensure critical controls work
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('mobile-open');
    // Toggle body overlay class to block scroll and show backdrop
    document.body.classList.toggle('sidebar-is-open');
}

document.addEventListener('DOMContentLoaded', function () {
    if (_bindingsInitDone) return;
    _bindingsInitDone = true;

    // Bind login button safely (keeps existing inline onclick as fallback)
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin && !btnLogin.hasAttribute('onclick') && typeof verificaAccesso === 'function') {
        btnLogin.addEventListener('click', function (ev) {
            ev.preventDefault();
            try { verificaAccesso(); } catch (e) { console.error('verificaAccesso error', e); }
        });
    }

    // Bind logout (nel dropdown account)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout && typeof logout === 'function') {
        btnLogout.addEventListener('click', function (ev) {
            ev.preventDefault();
            chiudiAccountMenu();
            try { logout(); } catch (e) { console.error('logout error', e); }
        });
    }

    // Bind universal search input (input event is less intrusive than keyup)
    const searchInput = document.getElementById('universal-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            try { if (typeof filtraUniversale === 'function') filtraUniversale(); } catch (e) { console.error('filtraUniversale error', e); }
        });
        // compositionend: copre tastiere mobili con input predittivo (iOS/Android)
        searchInput.addEventListener('compositionend', function () {
            try { if (typeof filtraUniversale === 'function') filtraUniversale(); } catch (e) { console.error('filtraUniversale error', e); }
        });
    }

    // === FIX TASTIERA iOS: nasconde mobile-tab-bar quando la tastiera è aperta ===
    // Evita che mobile-tab-bar (position:fixed) si sovrapponga alla tastiera o al contenuto
    if (window.innerWidth <= 768) {
        let _keyboardTimer = null;
        document.addEventListener('focusin', function (e) {
            if (e.target.matches('input, textarea, select')) {
                clearTimeout(_keyboardTimer);
                document.body.classList.add('keyboard-open');
            }
        });
        document.addEventListener('focusout', function (e) {
            if (e.target.matches('input, textarea, select')) {
                // piccolo delay: evita flickering quando si passa da un campo all'altro
                _keyboardTimer = setTimeout(() => {
                    document.body.classList.remove('keyboard-open');
                }, 300);
            }
        });
    }

    // Mobile header hamburger (if present)
    const mobileToggle = document.getElementById('btn-mobile-menu');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function (ev) {
            ev.preventDefault();
            try { toggleMobileMenu(); } catch (e) { console.error('toggleMobileMenu error', e); }
        });
    }

    // Auto-close sidebar on mobile when a menu item is clicked
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) sidebar.classList.remove('mobile-open');
                document.body.classList.remove('sidebar-is-open');
            }
        });
    });

    // Allow pressing Enter in the login input to trigger login
    const emailInput = document.getElementById('email-access');
    if (emailInput) {
        emailInput.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                try { verificaAccesso(); } catch (e) { console.error('verificaAccesso error', e); }
            }
        });
    }

    // Chiudi modal cliccando sul backdrop (area scura esterna al box)
    const modalAiuto = document.getElementById('modalAiuto');
    if (modalAiuto) {
        modalAiuto.addEventListener('click', function(e) {
            if (e.target === this) chiudiModal();
        });
    }

    // ── PULL TO REFRESH (solo mobile) ────────────────────────────
    (function initPullToRefresh() {
        const scroller = document.getElementById('contenitore-dati');
        const indicator = document.getElementById('ptr-indicator');
        if (!scroller || !indicator) return;

        const THRESHOLD = 70;   // px da trascinare per attivare refresh
        const MAX_PULL  = 100;  // limite visivo massimo
        let startY = 0, pulling = false, currentY = 0;

        function _isMobile() { return window.innerWidth <= 768; }

        function _refresh() {
            indicator.classList.add('ptr-loading');
            // Svuota cache della pagina attuale e ricarica
            if (typeof paginaAttuale !== 'undefined' && paginaAttuale) {
                delete cacheContenuti[paginaAttuale];
                cambiaPagina(paginaAttuale);
            }
            // Nascondi indicatore dopo breve attesa
            setTimeout(() => {
                indicator.classList.remove('ptr-visible', 'ptr-loading');
                scroller.style.transform = '';
                const arrow = indicator.querySelector('.ptr-arrow');
                if (arrow) arrow.classList.remove('rotated');
            }, 900);
        }

        scroller.addEventListener('touchstart', function(e) {
            if (!_isMobile()) return;
            if (scroller.scrollTop > 0) return;
            startY = e.touches[0].clientY;
            pulling = true;
        }, { passive: true });

        scroller.addEventListener('touchmove', function(e) {
            if (!pulling || !_isMobile()) return;
            if (scroller.scrollTop > 2) { pulling = false; return; }
            const dy = Math.min(e.touches[0].clientY - startY, MAX_PULL);
            if (dy <= 0) return;
            currentY = dy;
            // Mostra indicatore
            indicator.classList.add('ptr-visible');
            indicator.classList.remove('ptr-loading');
            const arrow = indicator.querySelector('.ptr-arrow');
            const label = indicator.querySelector('.ptr-label');
            if (dy >= THRESHOLD) {
                if (arrow) arrow.classList.add('rotated');
                if (label) label.textContent = 'Rilascia per aggiornare';
            } else {
                if (arrow) arrow.classList.remove('rotated');
                if (label) label.textContent = 'Tira per aggiornare';
            }
            // Resistenza elastica: scorri il contenuto leggermente
            scroller.style.transform = `translateY(${dy * 0.4}px)`;
        }, { passive: true });

        scroller.addEventListener('touchend', function() {
            if (!pulling || !_isMobile()) return;
            pulling = false;
            scroller.style.transform = '';
            if (currentY >= THRESHOLD) {
                _refresh();
            } else {
                indicator.classList.remove('ptr-visible');
                const arrow = indicator.querySelector('.ptr-arrow');
                if (arrow) arrow.classList.remove('rotated');
            }
            currentY = 0;
        });
    })();
    // ────────────────────────────────────────────────────────────
});
