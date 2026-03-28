import {
  URL_GOOGLE, CACHE_TTL_MS
} from './modules/core/config.js';
import ProdCache, { caricaSezioneConCache } from './modules/core/cache.js';
import {
  utenteAttuale, setUtenteAttuale,
  getSessionToken, refreshSessionExpiry
} from './modules/core/session.js';
// api.js is imported by revision-poller.js and pipistrelli.js
import RevisionPoller, { configurePoller } from './modules/core/revision-poller.js';
import { caricaPipistrelli, resetPipFetch, registerGlobals as registerPipGlobals } from './modules/features/pipistrelli.js';
import { notificaElegante, applicaFade, mostraModalConflitto, mostraConferma, registerUIGlobals } from './modules/core/ui.js';
import { caricaAcquisti, registerGlobals as registerAcquistiGlobals } from './modules/features/acquisti.js';
import { caricaRichieste, _fetchDatiRichieste, _renderDatiRichieste, init as initRichieste, registerGlobals as registerRichiesteGlobals } from './modules/features/richieste.js';
import { caricaInterfacciaImpostazioni, caricaDatiIniziali, registerGlobals as registerImpostazioniGlobals, init as initImpostazioni } from './modules/features/impostazioni.js';
import {
  _fetchDatiProduzione, _renderDatiProduzione, caricaDati, caricaArchivio,
  _startPollingProduzione, _stopPollingProduzione, _initKanbanDnd,
  _aggiornaVisibilitaFiltroArticoli,
  registerGlobals as registerProduzioneGlobals, init as initProduzione
} from './modules/features/produzione.js';
import { registerGlobals as registerLoginGlobals } from './modules/auth/login.js';
import { aggiornaBadgeNotifiche, _initBadgeNotifiche, _salvaNotificheInLocale_, registerGlobals as registerNotificheGlobals } from './modules/features/notifiche.js';
import {
  aggiornaProfiloSidebar, _caricaColoriAvatarDaServer, _checkOrarioAccesso,
  _isUtenteEsente, _bloccaSchermo_, _HIVES_TEST_PAGE_ID, _canOpenHivesTestPage,
  _normNome, _PREDEFINED_AVATAR_COLORS, _avatarColorsCache, _isOrarioConsentito,
  registerGlobals as registerSessionUIGlobals
} from './modules/auth/session-ui.js';

// Rimuovi il CSS critico inline: da qui in poi il JS gestisce l'overlay
try { const _ci = document.getElementById('critical-init'); if (_ci) _ci.remove(); } catch(_e) {}

/** Listener per messaggi dal Service Worker (push ricevuta in background) */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'NUOVE_NOTIFICHE') {
            _salvaNotificheInLocale_(event.data.notifiche || []);
        }
    });
}

/*******************************************************************************
* 1. CONFIGURAZIONE, VARIABILI GLOBALI E STATO
*******************************************************************************/
// URL_GOOGLE importato da modules/core/config.js

let _fetchSessionPatchDone = false;
let _sessionRefreshTimer = null;
let _refreshAuthFailCount_ = 0; // conta auth_error consecutivi dal refresh silenzioso
function _getSessionToken_() {
    // Delegato a modules/core/session.js
    return getSessionToken();
}

/** Aggiorna expiresAt in entrambi gli storage â€” delegato a modules/core/session.js */
function _refreshSessionExpiry_() {
    refreshSessionExpiry();
}
function _patchFetchWithSession_() {
    if (_fetchSessionPatchDone || typeof window.fetch !== 'function') return;
    const originalFetch = window.fetch.bind(window);

    // Intercetta auth_error in background su ogni risposta GAS, senza consumare il body originale
    function _intercettaAuthError_(resp) {
        _refreshSessionExpiry_(); // rinnova expiresAt ad ogni chiamata verso GAS
        resp.clone().text().then(function(txt) {
            try {
                const data = JSON.parse(txt);
                if (data && data.status === 'auth_error') {
                    _gestisciAuthError_(data.message || data.msg || 'Sessione scaduta.');
                }
            } catch (e) {}
        }).catch(function() {});
        return resp;
    }

    window.fetch = function(input, init) {
        try {
            const token = _getSessionToken_();
            const rawUrl = (typeof input === 'string') ? input : (input && input.url ? input.url : '');
            if (!rawUrl || rawUrl.indexOf(URL_GOOGLE) !== 0) return originalFetch(input, init);

            const method = String((init && init.method) || 'GET').toUpperCase();
            if (method === 'GET') {
                const urlConToken = (token && rawUrl.indexOf('sessionToken=') === -1)
                    ? rawUrl + (rawUrl.indexOf('?') === -1 ? '?' : '&') + 'sessionToken=' + encodeURIComponent(token)
                    : rawUrl;
                return originalFetch(urlConToken, init).then(_intercettaAuthError_);
            }
            if (method === 'POST' && init && typeof init.body === 'string') {
                try {
                    const payload = JSON.parse(init.body || '{}');
                    if (token && !payload.sessionToken) {
                        payload.sessionToken = token;
                        const nextInit = Object.assign({}, init, { body: JSON.stringify(payload) });
                        return originalFetch(input, nextInit).then(_intercettaAuthError_);
                    }
                } catch (e) {}
            }
            return originalFetch(input, init).then(_intercettaAuthError_);
        } catch (e) {}
        return originalFetch(input, init);
    };
    _fetchSessionPatchDone = true;
}
_patchFetchWithSession_();

async function _refreshSessionSilenzioso_() {
    const token = _getSessionToken_();
    if (!token) return;

    let profilo = utenteAttuale || null;
    if (!profilo) {
        try {
            const raw = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente');
            profilo = raw ? JSON.parse(raw) : null;
        } catch (e) {}
    }

    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'refreshSession',
                sessionToken: token,
                username: (profilo && profilo.nome) ? String(profilo.nome) : '',
                email: (profilo && profilo.email) ? String(profilo.email) : ''
            })
        });
        const r = await res.json();
        if (r && r.status === 'success' && r.sessionToken) {
            _refreshAuthFailCount_ = 0; // reset contatore su successo
            if (!utenteAttuale) setUtenteAttuale({});
            utenteAttuale.sessionToken = r.sessionToken;
            utenteAttuale.sessionExpiresAt = r.sessionExpiresAt || '';
            utenteAttuale.expiresAt = Date.now() + (8 * 60 * 60 * 1000);
            if (!utenteAttuale.nome && r.nome) utenteAttuale.nome = r.nome;
            if (!utenteAttuale.email && r.email) utenteAttuale.email = r.email;
            if (!utenteAttuale.ruolo && r.ruolo) utenteAttuale.ruolo = r.ruolo;
            try { localStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}
            try { sessionStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}
            // window.storage event: propaga expiresAt aggiornato alle altre tab
            return;
        }
        if (r && r.status === 'auth_error') {
            _refreshAuthFailCount_++;
            // Solo dopo 3 auth_error consecutivi eseguiamo il logout (evita logout per glitch temporanei)
            if (_refreshAuthFailCount_ >= 3) {
                _refreshAuthFailCount_ = 0;
                logout();
            }
        }
    } catch (e) {
        // rete momentaneamente assente: riproverÃ  al prossimo ciclo
    }
}

function _startSessionRefreshTicker_() {
    if (_sessionRefreshTimer) clearInterval(_sessionRefreshTimer);
    _sessionRefreshTimer = setInterval(_refreshSessionSilenzioso_, 5 * 60 * 1000);
}

_startSessionRefreshTicker_();
window.addEventListener('storage', function(ev) {
    if (ev.key !== 'sessioneUtente' || !ev.newValue) return;
    try {
        const s = JSON.parse(ev.newValue);
        if (!s || !s.sessionToken) return;
        if (!utenteAttuale) setUtenteAttuale({});
        utenteAttuale.sessionToken = String(s.sessionToken);
        if (s.sessionExpiresAt) utenteAttuale.sessionExpiresAt = s.sessionExpiresAt;
    } catch (e) {}
});
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) _refreshSessionSilenzioso_();
});

/**
 * Gestisce risposte auth_error dal server GAS.
 * Mostra un messaggio e forza il re-login dopo 2 secondi.
 */
let _authErrorLogoutScheduled_ = false;
function _gestisciAuthError_(messaggio) {
    // Se il logout Ã¨ giÃ  schedulato o siamo sulla pagina di login, non ripetere
    if (_authErrorLogoutScheduled_) return;
    var ov = document.getElementById('login-overlay');
    if (ov && ov.style.display !== 'none') return;
    _authErrorLogoutScheduled_ = true;
    notificaElegante(
        messaggio || 'Sessione scaduta. Effettua nuovamente il login.',
        'error'
    );
    setTimeout(function() { logout(); }, 2000);
}

// Fallback: se una sessione Ã¨ giÃ  presente E ha un sessionToken valido,
// nascondi subito l'overlay (evita blocchi/flicker prima di window.onload).
try {
    const _rawSess = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente');
    if (_rawSess) {
        const _parsedSess = JSON.parse(_rawSess);
        if (_parsedSess && _parsedSess.sessionToken) {
            const overlay = document.getElementById('login-overlay');
            if (overlay) overlay.style.display = 'none';
            document.documentElement.classList.add('has-session');
        }
    }
} catch (e) {}

let paginaAttuale = null; // NON leggere subito da localStorage
let filtroRicercaArticoli = false; // filtro ricerca per codice articolo
window.filtroRicercaArticoli = filtroRicercaArticoli;
let modifichePendenti = false;
let listaOperatori = [];

function _defaultListaStati_() {
    return [
        { nome: 'PREPARARE', colore: '#94a3b8' },
        { nome: 'PREPARARE PER LAVORAZIONE', colore: '#64748b' },
        { nome: 'MANDA IN LAVORAZIONE', colore: '#475569' },
        { nome: 'IN LAVORAZIONE', colore: '#f59e0b' },
        { nome: 'TORNATO DALLA LAVORAZIONE', colore: '#7c3aed' },
        { nome: 'IN PRODUZIONE', colore: '#242424' },
        { nome: 'IMBALLATO', colore: '#22c55e' },
        { nome: 'SPEDITO/CONSEGNATO', colore: '#06b6d4' }
    ];
}
let listaStati = [];
let tipoTrascinamento = "";
const cacheContenuti = {};
const cacheFetchTime = {}; // timestamp dell'ultimo fetch per pagina
// CACHE_TTL_MS importato da modules/core/config.js

// ---- runtime guards (anti doppio init / race rendering) ----
let _bootCompleted = false;
let _pageInitDone = false;
let _bindingsInitDone = false;
let _navRequestSerial = 0;
let _latestNavRequest = 0;
let _navAbortController = null; // annulla fetch in-volo a ogni cambio pagina
let _lastNavClickTime = 0;     // debounce click rapidissimi (<80ms)
let _pipModule = null;   // lazy-loaded: modules/features/pipistrelli.js
let _hivesModule = null; // lazy-loaded: modules/features/hives.js

/*******************************************************************************
* NOTIFICHE PUSH  â€“  VAPID native (nessun servizio di terze parti)
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

        // Se il permesso Ã¨ giÃ  stato concesso ma non c'Ã¨ subscription â†’ sottoscrivi automaticamente
        if (!sub && perm === 'granted') {
            try {
                sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: window._vapidB64ToUint8_ ? window._vapidB64ToUint8_(_VAPID_PUBLIC_KEY) : null
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
        } else if (result && result.status === 'errore-verifica') {
            try { localStorage.setItem('_pushStato', 'errore-verifica'); } catch {}
            notificaElegante('âš ï¸ Subscription creata ma NON confermata sul server. Riprova "Ri-registra subscription".', 'error');
        } else {
            try { localStorage.setItem('_pushStato', 'errore-salvataggio'); } catch {}
        }
        if (window._aggiornaUINotifiche) window._aggiornaUINotifiche();
    } catch (err) {
        console.warn('[Push] initPush:', err);
        try { localStorage.setItem('_pushStato', 'errore:' + err.message); } catch {}
    }
}

/** POST una subscription VAPID al backend GAS. Ritorna anche la verifica server-side. */
async function _salvaSubVAPID_(sub) {
    try {
        // IMPORTANTE: nessun Content-Type custom â†’ GAS non gestisce preflight CORS
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
        // Verifica server-side: conferma che l'endpoint Ã¨ davvero nel foglio
        if (json && (json.status === 'saved' || json.status === 'updated')) {
            try {
                const verUrl = URL_GOOGLE + '?azione=verificaIscrizione&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase()) + '&endpoint=' + encodeURIComponent(sub.endpoint);
                const verRes = await fetch(verUrl);
                const verJson = await verRes.json().catch(() => ({}));
                if (!verJson.found) {
                    console.warn('[Push] verificaIscrizione: endpoint NON trovato nel foglio dopo il salvataggio!');
                    json.status = 'errore-verifica';
                } else {
                    console.log('[Push] verificaIscrizione: âœ“ endpoint confermato nel foglio');
                }
            } catch (verErr) {
                console.warn('[Push] verificaIscrizione error:', verErr);
            }
        }
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
// Chiavi: '_html_<nomeFoglio>' contengono { ts, data: <htmlString> }
// TTL default 5 minuti. Usata come fallback istantaneo prima del fetch GAS.
function _lsCacheGet(key, ttlMs) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.ts < ttlMs) return parsed.data;
        return null; // scaduta
    } catch(e) { return null; }
}
function _lsCacheSet(key, data) {
    try {
        // Evita di salvare stringhe enormi (> 1.5 MB) per non riempire la quota
        const str = (typeof data === 'string') ? data : JSON.stringify(data);
        if (str.length > 1500000) return;
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: str }));
    } catch(e) {} // quota exceeded: ignora silenziosamente
}
function _lsCacheDel(key) {
    try { localStorage.removeItem(key); } catch(e) {}
}

// applicaFade → modules/core/ui.js

/**
 * Avvia in background appena l'app si apre:
 * 1. riscalda il runtime GAS (elimina il cold start sul primo click)
 * 2. espone window._prefetchDashPromise / window._prefetchRqPromise
 * 3. caricaDati e caricaPaginaRichieste le attendono invece di fare una seconda fetch
 */
function _prefetchBackground() {
    if (typeof URL_GOOGLE === 'undefined') return;
    // Rimuovi eventuale cache LS degli ordini salvata da versioni precedenti (dati real-time: non vanno in LS)
    _lsCacheDel('_html__acq_ordini');
    // Avvia subito senza delay per massimizzare il tempo disponibile prima del click
    window._prefetchDashPromise = fetch(URL_GOOGLE + '?azione=getAllDashboard')
        .then(function(r) { return r.ok ? r.json() : null; })
        .catch(function() { return null; });
    window._prefetchRqPromise   = fetch(URL_GOOGLE + '?azione=getAllRichieste')
        .then(function(r) { return r.ok ? r.json() : null; })
        .catch(function() { return null; });
    window._prefetchMatPromise  = fetch(URL_GOOGLE + '?pagina=MATERIALE+DA+ORDINARE')
        .then(function(r) { return r.ok ? r.json() : null; })
        .catch(function() { return null; });
    // Salva il risultato anche nelle var bundle per accesso rapido successivo
    window._prefetchDashPromise.then(function(b) { if (b) window._prefetchDashBundle = b; });
    window._prefetchRqPromise.then(function(b)   { if (b) window._prefetchRqBundle   = b; });
    window._prefetchMatPromise.then(function(b)  { if (b) window._prefetchMatBundle  = b; });
}



// utenteAttuale importato da modules/core/session.js (live binding)

/**
 * Restituisce true se l'utente Ã¨ MASTER.
 * Se non lo Ã¨, mostra una notifica e restituisce false.
 * Usata come guard per azioni riservate (elimina, sposta righe).
 */

window.onload = async function() {
    if (_bootCompleted) return;
    _bootCompleted = true;
    console.log("Inizializzazione sistema...");

    // 1. Gestione immediata dell'interfaccia per evitare "lampi"
    const overlay = document.getElementById('login-overlay');
    let sessione = null;
    try { sessione = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente'); } catch (e) {}

    if (sessione) {
        // Se c'Ã¨ una sessione, la leggiamo subito
        setUtenteAttuale(JSON.parse(sessione));

        // Verifica scadenza lato client
        if (utenteAttuale.expiresAt && Date.now() > utenteAttuale.expiresAt) {
            setUtenteAttuale(null);
            try { localStorage.removeItem('sessioneUtente'); sessionStorage.removeItem('sessioneUtente'); } catch (_e) {}
            document.documentElement.classList.remove('has-session');
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
            const _errScad = document.getElementById('login-error');
            if (_errScad) { _errScad.innerText = 'Sessione scaduta. Effettua nuovamente il login.'; _errScad.style.color = '#ef4444'; }
            return;
        }

        // Verifica che la sessione includa un sessionToken (aggiunto con il nuovo sistema di auth).
        // Se manca (login effettuato prima dell'aggiornamento del backend), forza il re-login.
        if (utenteAttuale.ruolo !== 'MASTER' && !utenteAttuale.sessionToken) {
            setUtenteAttuale(null);
            try { localStorage.removeItem('sessioneUtente'); sessionStorage.removeItem('sessioneUtente'); } catch(_e) {}
            document.documentElement.classList.remove('has-session');
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
            const _errDiv = document.getElementById('login-error');
            if (_errDiv) {
                _errDiv.innerText = 'Sessione non piÃ¹ valida. Effettua di nuovo il login.';
                _errDiv.style.color = '#ef4444';
            }
            return;
        }

        // Blocco orario: se fuori orario e non esente â†’ blocca schermo (senza return, carica l'app sotto)
        const _fuoriOrario = !_isUtenteEsente() && !_isOrarioConsentito();

        // AGGIORNAMENTO IMMEDIATO: Prima ancora di scaricare i dati da Sheets
        aggiornaProfiloSidebar();
        _initPush();           // Registra / aggiorna subscription push VAPID
        _initBadgeNotifiche(); // Mostra badge se ci sono notifiche non lette
        // Colori avatar: prima lettura rapida (500ms), poi aggiornamento completo dopo cold-start GAS
        setTimeout(function() { _caricaColoriAvatarDaServer(); }, 500);
        setTimeout(function() { _caricaColoriAvatarDaServer(); }, 5000);

        if (overlay) overlay.style.display = 'none';

        // Mostra blocco schermo sopra l'app se fuori orario (non fa logout, sessione preservata)
        if (_fuoriOrario) _bloccaSchermo_();

        console.log("Sessione trovata per:", utenteAttuale.nome);
    } else {
        // Se non c'Ã¨ sessione, forziamo il login
        document.documentElement.classList.remove("has-session");
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
            // Verifica integrità  sessione
            if (utenteAttuale.ruolo !== "MASTER" && !utenteAttuale.nome) {
                throw new Error("Sessione corrotta");
            }
            // Inizializzazione completa per sessioni ritornanti (stesso path del login fresco)
            _patchFetchWithSession_();
            if (_pipModule) _pipModule.registerGlobals();
            registerUIGlobals();
            registerAcquistiGlobals();
            registerRichiesteGlobals();
            initRichieste();
            registerImpostazioniGlobals();
            initImpostazioni();
            registerProduzioneGlobals();
            initProduzione();
            window.cambiaPagina = cambiaPagina;
            window.aggiornaListaFiltrabili = aggiornaListaFiltrabili;
            configurePoller({
                onRemoteChange: function(nomeUtente) {
                    notificaElegante('🔄 ' + nomeUtente + ' ha aggiornato i dati');
                    switch (paginaAttuale) {
                        case 'PROGRAMMA PRODUZIONE DEL MESE':
                            caricaSezioneConCache('PROGRAMMA_PRODUZIONE', _fetchDatiProduzione, _renderDatiProduzione, true);
                            break;
                        case 'STORICO_RICHIESTE':
                            caricaRichieste();
                            break;
                        case 'MATERIALE DA ORDINARE':
                            caricaAcquisti(null);
                            break;
                        case 'ARCHIVIO_ORDINI':
                            if (typeof caricaArchivio === 'function') caricaArchivio();
                            break;
                    }
                },
                onUsersOnline: function(lista) { _aggiornaIndicatoreOnline(lista); },
                getUtenteAttuale: function() { return utenteAttuale; },
                getPaginaCorrente: function() { return paginaAttuale; }
            });
            RevisionPoller.start();
            // Naviga all'ultima pagina salvata
            let paginaSalvata = null;
            try { paginaSalvata = localStorage.getItem('ultimaPaginaProduzione'); } catch (_e) {}
            if (!paginaSalvata || paginaSalvata === 'undefined' || paginaSalvata === 'null') {
                paginaSalvata = 'PROGRAMMA PRODUZIONE DEL MESE';
            }
            const _tastoMenu = document.querySelector(`.menu-item[data-page="${paginaSalvata}"]`);
            cambiaPagina(paginaSalvata, _tastoMenu);
        }

    } catch (e) {
        console.warn("Errore caricamento dati iniziali:", e);
        let sessioneEsistente = null;
        try { sessioneEsistente = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente'); } catch (e) {}
        // Cancella sessione e mostra login SOLO se Ã¨ esplicitamente corrotta
        // mai per errori di rete, timeout GAS o altri errori non critici
        if (e && e.message === "Sessione corrotta") {
            document.documentElement.classList.remove("has-session");
            try { localStorage.removeItem('sessioneUtente'); } catch (e) {}
            try { sessionStorage.removeItem('sessioneUtente'); } catch (e) {}
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
        } else if (!sessioneEsistente) {
            // Nessuna sessione in localStorage â†’ mostra login
            document.documentElement.classList.remove('has-session');
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
        }
        // Se c'Ã¨ una sessione valida, l'utente resta dentro â€” l'errore Ã¨ solo di rete
    }
};







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
/* ---- FINE SIDEBAR TOGGLE ---- */ // QUESTA FUNZIONE Ãˆ QUELLA CHE SCRIVE I DATI NELLA TUA SIDEBAR
async function salvaEApriDashboard() {
    // Blocco orario: impedisce l'accesso fuori dalle 08:30-19:30 (tranne esenti)
    if (!_checkOrarioAccesso(true)) return;
    if (utenteAttuale) utenteAttuale.expiresAt = Date.now() + (8 * 60 * 60 * 1000);
    try { localStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}
    try { sessionStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}
    _startSessionRefreshTicker_();
    _refreshSessionSilenzioso_();

    const overlay = document.getElementById('login-overlay');
    overlay.style.transition = "opacity 0.4s ease";
    overlay.style.opacity = '0';

    // Avvia prefetch GAS e impostazioni SUBITO (non bloccano la navigazione)
    _prefetchBackground();
    caricaDatiIniziali().catch(e => console.warn("caricaDatiIniziali post-login:", e));

    // Aspetta solo il fade visivo (400ms), non la risposta GAS
    await new Promise(r => setTimeout(r, 400));

    overlay.style.display = 'none';
    document.documentElement.classList.add('has-session');
    if (typeof aggiornaProfiloSidebar === 'function') aggiornaProfiloSidebar();
    _initPush();           // Registra / aggiorna subscription push VAPID
    _initBadgeNotifiche(); // Mostra badge se ci sono notifiche non lette
    // Colori avatar: prima lettura rapida (500ms), poi aggiornamento completo dopo cold-start GAS
    setTimeout(function() { _caricaColoriAvatarDaServer(); }, 500);
    setTimeout(function() { _caricaColoriAvatarDaServer(); }, 5000);

    // Naviga alla pagina salvata (stessa logica del DOMContentLoaded normale)
    let paginaSalvata = null;
    try { paginaSalvata = localStorage.getItem('ultimaPaginaProduzione'); } catch (e) {}
    if (!paginaSalvata || paginaSalvata === "undefined" || paginaSalvata === "null") {
        paginaSalvata = "PROGRAMMA PRODUZIONE DEL MESE";
    }
    const tastoMenu = document.querySelector(`.menu-item[data-page="${paginaSalvata}"]`);
    cambiaPagina(paginaSalvata, tastoMenu);

    configurePoller({
        onRemoteChange: function(nomeUtente) {
            notificaElegante('\uD83D\uDD04 ' + nomeUtente + ' ha aggiornato i dati');
            switch (paginaAttuale) {
                case 'PROGRAMMA PRODUZIONE DEL MESE':
                    caricaSezioneConCache('PROGRAMMA_PRODUZIONE', _fetchDatiProduzione, _renderDatiProduzione, true);
                    break;
                case 'STORICO_RICHIESTE':
                    caricaRichieste();
                    break;
                case 'MATERIALE DA ORDINARE':
                    caricaAcquisti(null);
                    break;
                case 'ARCHIVIO_ORDINI':
                    if (typeof caricaArchivio === 'function') caricaArchivio();
                    break;
            }
        },
        onUsersOnline: function(lista) {
            _aggiornaIndicatoreOnline(lista);
        },
        getUtenteAttuale: function() { return utenteAttuale; },
        getPaginaCorrente: function() { return paginaAttuale; }
    });
    RevisionPoller.start();
    if (_pipModule) _pipModule.registerGlobals();
    registerUIGlobals();
    registerAcquistiGlobals();
    registerRichiesteGlobals();
    initRichieste();
    registerImpostazioniGlobals();
    initImpostazioni();
    registerProduzioneGlobals();
    initProduzione();
    window.cambiaPagina = cambiaPagina;
    window.aggiornaListaFiltrabili = aggiornaListaFiltrabili;
}
function logout() {
    if (logout._running) return;   // anti-rientro
    logout._running = true;
    RevisionPoller.stop();
    _stopPollingProduzione();
    try {
        // (a) Revoca token lato server â€” fire-and-forget (non blocca il redirect)
        const tokenLogout = _getSessionToken_();
        if (tokenLogout) {
            fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: 'logout', sessionToken: tokenLogout })
            }).catch(function() {});
        }

        if (_sessionRefreshTimer) {
            clearInterval(_sessionRefreshTimer);
            _sessionRefreshTimer = null;
        }

        // (b) Cancella IndexedDB ProdCache (fire-and-forget, non blocca)
        try { ProdCache.clear(); } catch (_e) {}

        // Preserva i dati per-device (non legati alla sessione utente)
        const datiDevice = {};
        const keysDevice = ['notifPrefs', '_pushStato', 'mlPipQty', 'mlPipCaricato', 'mlPipMovimenti', 'mlPipPronti'];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && (k.startsWith('avatarColor_') || k.startsWith('avatarColorRecenti_') || k.startsWith('avatarColorHidden_') || keysDevice.includes(k))) datiDevice[k] = localStorage.getItem(k);
        }

        // (c) + (d) Pulizia totale della memoria del browser
        localStorage.clear();
        sessionStorage.clear();

        // Ripristina i dati per-device
        Object.entries(datiDevice).forEach(([k, v]) => { try { localStorage.setItem(k, v); } catch {} });

        // (e) Reindirizzamento pulito alla pagina iniziale
        window.location.href = window.location.origin + window.location.pathname + "?logout=" + Date.now();

    } catch (error) {
        console.error("Errore durante il logout:", error);
        window.location.reload();
    }
}

// RevisionPoller importato da modules/core/revision-poller.js

function _aggiornaIndicatoreOnline(lista) {
    var nomeAttuale = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : '';
    var altriOnline = lista.filter(function(u) { return u.nome.toUpperCase() !== nomeAttuale; });
    var avatarDesktop = document.getElementById('user-avatar-btn');
    var avatarMobile  = document.getElementById('user-avatar-btn-mobile');
    if (altriOnline.length === 0) {
        var _oi = document.getElementById('online-indicator');
        if (_oi) _oi.remove();
        var _oim = document.getElementById('online-indicator-mob');
        if (_oim) _oim.remove();
        return;
    }
    var titolo = 'Online ora: ' + altriOnline.map(function(u) {
        return u.nome + (u.pagina ? ' (' + u.pagina + ')' : '');
    }).join(', ');
    [{ parent: avatarDesktop, id: 'online-indicator' }, { parent: avatarMobile, id: 'online-indicator-mob' }].forEach(function(pair) {
        if (!pair.parent) return;
        var dot = document.getElementById(pair.id);
        if (!dot) {
            dot = document.createElement('span');
            dot.id = pair.id;
            pair.parent.appendChild(dot);
        }
        dot.title = titolo;
    });
}

// RevisionPoller: check immediato quando la tab torna visibile
document.addEventListener('visibilitychange', function() {
    if (!RevisionPoller._timer) return;
    if (!document.hidden) {
        RevisionPoller._check();
        RevisionPoller._schedule(RevisionPoller.INTERVAL_FOCUS_MS);
    } else {
        RevisionPoller._schedule(RevisionPoller.INTERVAL_BG_MS);
    }
});

// RevisionPoller: check immediato quando si torna online
window.addEventListener('online', function() {
    if (RevisionPoller._timer) RevisionPoller._check();
});

/* â”€â”€ Modal conflitto di modifica (optimistic locking) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
// mostraModalConflitto, _conflittoScegli → modules/core/ui.js
// mostraConferma, _chiudiConferma → modules/core/ui.js
// notificaElegante → modules/core/ui.js

/* ── aggiornaBadgeSidebar → modules/features/richieste.js (aggiornaBadgeRichieste) */
async function cambiaPagina(nomeFoglio, elementoMenu) {
    // â”€â”€ Debounce: ignora click entro 80ms dal precedente â”€â”€
    const now = Date.now();
    if (now - _lastNavClickTime < 80) return;
    _lastNavClickTime = now;

    // â”€â”€ Abort qualsiasi fetch in-volo della navigazione precedente â”€â”€
    if (_navAbortController) {
        try { _navAbortController.abort(); } catch (_) {}
    }
    _navAbortController = new AbortController();
    const navSignal = _navAbortController.signal;

    const requestId = ++_navRequestSerial;
    _latestNavRequest = requestId;

    // reset possible filter cache when switching pages
    elementiDaFiltrareCache = null;
    // Ferma il polling produzione se si naviga altrove
    if (nomeFoglio !== 'PROGRAMMA PRODUZIONE DEL MESE') _stopPollingProduzione();

    // 1. Reset immediato della ricerca (per evitare di vedere dati filtrati della pagina precedente)
    const searchInput = document.getElementById('universal-search');
    if (searchInput) searchInput.value = "";
    const deskSearch = document.getElementById('desk-search-input');
    if (deskSearch) deskSearch.value = "";

    // 2. Validazione e salvataggio Stato
    if (!nomeFoglio || nomeFoglio === "undefined" || nomeFoglio === "null") {
        nomeFoglio = "PROGRAMMA PRODUZIONE DEL MESE";
    }
    if (nomeFoglio === _HIVES_TEST_PAGE_ID && !_canOpenHivesTestPage()) {
        nomeFoglio = 'PROGRAMMA PRODUZIONE DEL MESE';
    }
    localStorage.setItem('ultimaPaginaProduzione', nomeFoglio);
    paginaAttuale = nomeFoglio;
    window.paginaAttuale = nomeFoglio; // sync per i moduli che leggono window.paginaAttuale
    // Gestisce visibilitÃ  pulsante filtro articoli (solo su pagina Produzione)
    _aggiornaVisibilitaFiltroArticoli(nomeFoglio);
    // Classe sul body per eccezioni CSS by-page (es. landscape su PIPISTRELLI)
    document.body.classList.toggle('page-pip', nomeFoglio === 'PIPISTRELLI');
    document.body.classList.toggle('page-hives-test', nomeFoglio === _HIVES_TEST_PAGE_ID);
    // Reset flag fetch pip quando si lascia la pagina (cosÃ¬ al prossimo accesso rilegge dal server)
    if (nomeFoglio !== 'PIPISTRELLI' && _pipModule) _pipModule.resetPipFetch();

    // Mostra/nasconde la tab bar Acquisti
    // Se si naviga su Acquisti da sidebar/tab (elementoMenu != null) â†’ reset a catalogo
    const _acqTabBarEl = document.getElementById('acq-tab-bar');
    if (_acqTabBarEl) {
        _acqTabBarEl.style.display = nomeFoglio === 'MATERIALE DA ORDINARE' ? 'flex' : 'none';
    }

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

        'PROGRAMMA PRODUZIONE DEL MESE': "Dashboard Produzione",
        'PIPISTRELLI': "ðŸ¦‡ Pipistrelli",
        'TEST_HIVES_ANNUALE': "ðŸ§ª Test Hives Annuale"
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

    // Ripristino da localStorage se la cache RAM Ã¨ vuota (garantisce render istantaneo dopo reload)
    if (!cacheContenuti[nomeFoglio]) {
        const _lsKey = '_html_' + nomeFoglio;
        const _lsHtml = _lsCacheGet(_lsKey, 300000); // conserva fino a 5 minuti
        if (_lsHtml) {
            cacheContenuti[nomeFoglio] = _lsHtml;
            // Usa il timestamp REALE dell'LS cache cosÃ¬ il bg refresh scatta
            // solo se i dati sono davvero scaduti, non ad ogni reload
            try {
                const _raw = localStorage.getItem(_lsKey);
                const _parsed = _raw ? JSON.parse(_raw) : null;
                cacheFetchTime[nomeFoglio] = (_parsed && _parsed.ts) ? _parsed.ts : (Date.now() - CACHE_TTL_MS - 1000);
            } catch(e) {
                cacheFetchTime[nomeFoglio] = Date.now() - CACHE_TTL_MS - 1000;
            }
        }
    }

    // Skeleton istantaneo solo se non c'Ã¨ cache (rimane visibile fino a che il loader scrive)
    if (!cacheContenuti[nomeFoglio]) {
        contenitore.innerHTML = `<div class="nav-skeleton">
            <div class="nav-skel-bar" style="width:60%"></div>
            <div class="nav-skel-bar" style="width:85%"></div>
            <div class="nav-skel-bar" style="width:45%"></div>
            <div class="nav-skel-bar" style="width:75%"></div>
        </div>`;
    } else {
        contenitore.innerHTML = ""; // sarÃ  sovrascritto subito dalla cache sotto
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

        // Avvia polling live se si torna su Produzione
        if (nomeFoglio === 'PROGRAMMA PRODUZIONE DEL MESE') _startPollingProduzione();

        // Aggiornamento dati in background solo se la cache Ã¨ scaduta
        const ora = Date.now();
        const ultimoFetch = cacheFetchTime[nomeFoglio] || 0;
        if (ora - ultimoFetch > CACHE_TTL_MS) {
            if (nomeFoglio === 'PROGRAMMA PRODUZIONE DEL MESE') caricaDati(nomeFoglio, true, requestId, navSignal);
            else if (nomeFoglio === 'MATERIALE DA ORDINARE')    caricaAcquisti(null, requestId, navSignal);
            else if (nomeFoglio === 'STORICO_RICHIESTE')        caricaRichieste(requestId, navSignal);
            else if (nomeFoglio === 'ARCHIVIO_ORDINI')          caricaArchivio();
        }
        return;
    }

    // 7. Smistamento Caricamento (Router)
    console.log("Caricamento dal server:", nomeFoglio);

    switch (nomeFoglio) {
        case 'IMPOSTAZIONI':
            caricaInterfacciaImpostazioni();
            break;
        case 'STORICO_RICHIESTE': {
            const _rqCont = document.getElementById('contenitore-dati');
            if (_rqCont) {
                _rqCont.innerHTML = "<div class='centered-msg' id='_ric-loader'>Caricamento messaggi in corso...</div>";
            }
            caricaSezioneConCache('STORICO_RICHIESTE', _fetchDatiRichieste, _renderDatiRichieste)
                .catch(async e => {
                    if (e && e.name === 'AbortError') return;
                    let cached = null;
                    try { cached = await ProdCache.get('STORICO_RICHIESTE'); } catch (_) {}
                    if (cached) {
                        const ora = new Date(cached.timestamp);
                        const hh = String(ora.getHours()).padStart(2, '0');
                        const mm = String(ora.getMinutes()).padStart(2, '0');
                        notificaElegante('Connessione assente â€” mostro dati salvati alle ' + hh + ':' + mm, 'warning');
                    } else {
                        const c = document.getElementById('contenitore-dati');
                        if (c) {
                            c.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento. <button onclick=\"cambiaPagina('STORICO_RICHIESTE',null)\" style=\"margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer\">Riprova</button></div>";
                            applicaFade(c);
                        }
                    }
                });
            break;
        }
        case 'ARCHIVIO_ORDINI':
            caricaArchivio();
            break;
        case 'MATERIALE DA ORDINARE':
            caricaAcquisti(elementoMenu ? 'catalogo' : null, requestId, navSignal);
            break;
        case 'ORDINI_ACQUISTI':
            caricaAcquisti('ordini', requestId, navSignal);
            return;
        case 'PIPISTRELLI':
            if (!_pipModule) {
                _pipModule = await import('./modules/features/pipistrelli.js');
                _pipModule.registerGlobals();
            }
            _pipModule.caricaPipistrelli();
            break;
        case 'TEST_HIVES_ANNUALE':
            if (!_hivesModule) {
                _hivesModule = await import('./modules/features/hives.js');
                _hivesModule.registerGlobals();
            }
            _hivesModule.caricaPaginaHivesTest();
            break;
        default: {
            const _cpCont = document.getElementById('contenitore-dati');
            if (_cpCont) {
                _cpCont.innerHTML = "<div class='inline-msg' id='_prod-loader'>Caricamento Dashboard...</div>";
                applicaFade(_cpCont);
            }
            caricaSezioneConCache('PROGRAMMA_PRODUZIONE', _fetchDatiProduzione, _renderDatiProduzione)
                .catch(async e => {
                    if (e && e.name === 'AbortError') return;
                    // Mostra messaggio cache-aware
                    let cached = null;
                    try { cached = await ProdCache.get('PROGRAMMA_PRODUZIONE'); } catch (_) {}
                    if (cached) {
                        const ora = new Date(cached.timestamp);
                        const hh = String(ora.getHours()).padStart(2, '0');
                        const mm = String(ora.getMinutes()).padStart(2, '0');
                        notificaElegante('Connessione assente â€” mostro dati salvati alle ' + hh + ':' + mm, 'warning');
                    } else {
                        const c = document.getElementById('contenitore-dati');
                        if (c) {
                            c.innerHTML = `<div class='inline-error'>Errore nel caricamento dati.
                                <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                                    style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                                    &#x21bb; Riprova</button></div>`;
                            applicaFade(c);
                        }
                    }
                });
        }
    }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PIPISTRELLI â†’ modules/features/pipistrelli.js
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

//FUNZIONI UNIVERSALI//

// Escapa i caratteri speciali regex nell'input utente
function _escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Restituisce true se la stringa inizia con il termine (prima parola)
function _matchFirstWord(text, term) {
    if (!term) return true;
    // Matcha dall'inizio del testo O dall'inizio di qualsiasi parola (es. "GHP" in "DA DEFINIRE (GHP)")
    if (text.trimStart().startsWith(term)) return true;
    return text.split(/[\s(,;]+/).some(w => w.toLowerCase().startsWith(term));
}

function filtraUniversale() {
    clearTimeout(ricercaTimeout);
    ricercaTimeout = setTimeout(function() {
        const deskInput = document.getElementById('universal-search');
        const mobInput  = document.getElementById('mobile-search');
        const raw = (deskInput && deskInput.value !== '')
            ? deskInput.value
            : ((mobInput && mobInput.value !== '') ? mobInput.value : (deskInput ? deskInput.value : ''));
        const input = String(raw || '').trim().toLowerCase();

        if (!elementiDaFiltrareCache) aggiornaListaFiltrabili();

        // Sincronizza con lo stato condiviso usato dal modulo produzione.
        if (typeof window.filtroRicercaArticoli !== 'undefined') {
            filtroRicercaArticoli = !!window.filtroRicercaArticoli;
        }

        const isArticoloMode = !!filtroRicercaArticoli;
        const matcher = input ? new RegExp(_escapeRegex(input), 'i') : null;

        (elementiDaFiltrareCache || []).forEach(function(el) {
            if (!input) {
                el.classList.remove('hidden-search');
                return;
            }

            const text = (el.textContent || '').toLowerCase();
            const codice = (el.getAttribute('data-codice') || '').toLowerCase();

            let match = false;
            if (isArticoloMode) {
                match = codice ? codice.indexOf(input) !== -1 : text.indexOf(input) !== -1;
            } else {
                const starts = _matchFirstWord(text, input);
                const contains = matcher ? matcher.test(text) : false;
                match = starts || (input.length >= 3 && contains);
            }

            el.classList.toggle('hidden-search', !match);
        });

        const sezioneArchivio = document.getElementById('sezione-archivio');
        if (sezioneArchivio) sezioneArchivio.style.display = input === '' ? 'block' : 'none';
    }, 120);
}

// Fallback minimo: evita errori runtime se la pagina test viene aperta mentre il modulo
// sperimentale non è presente in script.js.
function caricaPaginaHivesTest() {
    const cont = document.getElementById('contenitore-dati');
    if (!cont) return;
    cont.innerHTML = '<div class="centered-msg">Pagina di test momentaneamente non disponibile.</div>';
    applicaFade(cont);
}

// ═══════════════════════════════════════════════════════════════════════
//  REGISTRAZIONE GLOBALS — espone su window tutto ciò che è chiamato
//  da index.html onclick/oninput e dai moduli via window.*
//  Chiamata subito (top-level) così è disponibile prima del login.
// ═══════════════════════════════════════════════════════════════════════

// — auth/login.js (hashSHA256, _verificaAccessoUtente, _creaAccountUtente)
registerLoginGlobals();

// — notifiche.js
registerNotificheGlobals();

// — auth/session-ui.js (profilo, avatar, blocco orario)
registerSessionUIGlobals();

// — funzioni definite in questo file chiamate da HTML onclick/oninput
window.cambiaPagina                = cambiaPagina;
window.aggiornaListaFiltrabili     = aggiornaListaFiltrabili;
window.filtraUniversale            = filtraUniversale;
window.toggleSidebar               = toggleSidebar;
window.logout                      = logout;
window.salvaEApriDashboard         = salvaEApriDashboard;

// — variabili/oggetti condivisi letti e scritti dai moduli via window.*
window.cacheContenuti              = cacheContenuti;
window.TW                          = TW;
window.listaStati                  = listaStati;
window.listaOperatori              = listaOperatori;

// — funzioni di script.js usate dai moduli via window.*
window._VAPID_PUBLIC_KEY           = _VAPID_PUBLIC_KEY;
window._salvaSubVAPID_             = _salvaSubVAPID_;
window._gestisciAuthError_         = _gestisciAuthError_;
window._getSessionToken_           = _getSessionToken_;
window._defaultListaStati_         = _defaultListaStati_;
