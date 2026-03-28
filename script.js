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

// === NOTIFICHE UI ===
function apriPopupNotifiche(e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const modal = document.getElementById('modal-notifiche');
    if (!modal) return;
    modal.classList.add('is-open');
    renderNotificheList();
    // Azzera badge immediatamente e segna lette sul server
    aggiornaBadgeNotifiche(0);
    try { localStorage.setItem('_notifBadgeCount', '0'); } catch {}
    if (utenteAttuale && utenteAttuale.nome) {
        fetch(URL_GOOGLE + '?azione=segnaLetteNotifiche&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase())).catch(function(){});
    }
}
function chiudiPopupNotifiche() {
    const modal = document.getElementById('modal-notifiche');
    if (!modal) return;
    modal.classList.remove('is-open');
}
async function rispondiAccessoApp(richiestaId, nome, risposta, btnEl) {
    // Disabilita entrambi i pulsanti mentre si attende la risposta
    const wrap = btnEl ? btnEl.closest('.notif-azioni-accesso') : null;
    if (wrap) {
        wrap.querySelectorAll('button').forEach(function(b) { b.disabled = true; });
        wrap.innerHTML = '<span class="notif-risposta-wait">â³ Invio in corsoâ€¦</span>';
    }
    try {
        const url = URL_GOOGLE + '?azione=rispondiAccessoFuoriOrario&id=' + encodeURIComponent(richiestaId) + '&ok=' + encodeURIComponent(risposta) + '&json=1';
        const res  = await fetch(url);
        const data = await res.json();
        if (data.status === 'ok') {
            const msg = risposta === 'SI' ? 'âœ… Accesso consentito' : 'ðŸš« Accesso negato';
            // Persisti il risultato in localStorage: la prossima apertura del pannello
            // non mostrerÃ  piÃ¹ i pulsanti per questa richiesta
            _segnaAccessoGestito_(richiestaId, msg);
            if (wrap) wrap.innerHTML = '<span class="notif-risposta-ok">' + msg + '</span>';
        } else {
            if (wrap) wrap.innerHTML = '<span class="notif-risposta-err">âš ï¸ ' + (data.msg || 'Errore') + '</span>';
        }
    } catch (err) {
        if (wrap) wrap.innerHTML = '<span class="notif-risposta-err">âš ï¸ Errore di rete</span>';
    }
}
function _getAccessiGestiti_() {
    try { return JSON.parse(localStorage.getItem('_accRispIdx_') || '{}'); } catch { return {}; }
}
function _segnaAccessoGestito_(id, msg) {
    try {
        const h = _getAccessiGestiti_();
        h[id] = msg;
        localStorage.setItem('_accRispIdx_', JSON.stringify(h));
    } catch {}
}
async function eliminaNotificaApp(rid, titoloEnc, corpoEnc, btnEl) {
    const titolo = decodeURIComponent(titoloEnc || '');
    const corpo  = decodeURIComponent(corpoEnc || '');
    const rowId  = String(rid || '').trim();
    const card   = btnEl ? btnEl.closest('.notifica-item') : null;

    if (card) {
        card.classList.add('notif-removing');
        await new Promise(function(resolve) { setTimeout(resolve, 190); });
    }
    _rimuoviNotificaInLocale_(rowId, titolo, corpo);
    if (card) card.remove();
    const list = document.getElementById('notifiche-list');
    if (list && !list.querySelector('.notifica-item')) {
        list.innerHTML = _notifHtml_([]);
    }

    try {
        const uname = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : '';
        if (!uname) return;
        const url = URL_GOOGLE
            + '?azione=eliminaNotifica'
            + '&username=' + encodeURIComponent(uname)
            + '&rid=' + encodeURIComponent(rowId)
            + '&titolo=' + encodeURIComponent(titolo)
            + '&corpo=' + encodeURIComponent(corpo);
        const res = await fetch(url);
        const data = await res.json().catch(() => ({}));
        if (data.status !== 'ok' && data.status !== 'not_found') {
            console.warn('[notifiche] eliminaNotifica non ok:', data);
        }
    } catch (err) {
        console.warn('[notifiche] eliminaNotifica errore rete:', err);
    }
}
function _rimuoviNotificaInLocale_(rid, titolo, corpo) {
    try {
        const arr = JSON.parse(localStorage.getItem('_notificheArr') || '[]');
        let removed = false;
        const next = arr.filter(function(n) {
            if (removed) return true;
            const sameRid = rid && String(n.rid || '') === String(rid);
            const sameTxt = String(n.titolo || '') === String(titolo || '') && String(n.corpo || '') === String(corpo || '');
            if (sameRid || sameTxt) {
                removed = true;
                return false;
            }
            return true;
        });
        localStorage.setItem('_notificheArr', JSON.stringify(next));
    } catch {}
}
function _chiudiNotificheOutside(e) { /* dismesso */ }
function aggiornaBadgeNotifiche(count) {
    const badgeDesk = document.getElementById('badge-notifiche-desktop');
    const badgeMob = document.getElementById('badge-notifiche-mobile');
    const badgeMobMenu = document.getElementById('badge-notifiche-mobile-menu');
    if (badgeDesk) {
        badgeDesk.textContent = count > 0 ? count : '';
        badgeDesk.style.display = count > 0 ? 'flex' : 'none';
    }
    if (badgeMob) {
        badgeMob.textContent = count > 0 ? count : '';
        badgeMob.style.display = count > 0 ? 'flex' : 'none';
    }
    if (badgeMobMenu) {
        badgeMobMenu.textContent = count > 0 ? count : '';
        badgeMobMenu.style.display = count > 0 ? 'flex' : 'none';
    }
}
function _notifIcona_(titolo) {
    if (!titolo) return 'fa-bell';
    if (/stato/i.test(titolo))     return 'fa-rotate';
    if (/richiesta|comunic/i.test(titolo)) return 'fa-comment-dots';
    if (/assegnaz/i.test(titolo))  return 'fa-user-check';
    return 'fa-bell';
}
function _escapeHtml_(value) {
    return String(value == null ? '' : value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function _notifHtml_(arr) {
    if (!arr.length) return '<div class="notif-empty"><i class="far fa-bell-slash"></i><p>Nessuna notifica recente</p></div>';
    return arr.map(function(n) {
        const icon   = _notifIcona_(n.titolo || '');
        const titolo = _escapeHtml_(n.titolo || 'Notifica');
        const ridRaw = _escapeHtml_(n.rid || '');
        const titoloEnc = encodeURIComponent(n.titolo || '');
        const corpoEnc  = encodeURIComponent(n.corpo || '');
        const tsVal  = _escapeHtml_(n._ts || '');
        const ts     = tsVal ? `<span class="notifica-ts">${tsVal}</span>` : '';
        // Rilevamento notifica accesso_richiesta (corpo Ã¨ JSON strutturato)
        let corpoHtml = '';
        try {
            const parsed = JSON.parse(n.corpo || '');
            if (parsed && parsed.tipo === 'accesso_richiesta') {
                const rid  = _escapeHtml_(parsed.id   || '');
                const nome = _escapeHtml_(parsed.nome || '');
                // Controlla se Alessio ha giÃ  risposto (persistito in localStorage)
                const gestiti = _getAccessiGestiti_();
                if (gestiti[parsed.id]) {
                    corpoHtml = `<div class="notifica-corpo"><span class="notif-risposta-ok">${_escapeHtml_(gestiti[parsed.id])}</span></div>`;
                } else {
                    corpoHtml = `<div class="notifica-corpo">Vuole entrare fuori orario.</div>
                  <div class="notif-azioni-accesso">
                    <button class="notif-btn-consenti" onclick="rispondiAccessoApp('${rid}','${nome}','SI',this)">âœ… Consenti</button>
                    <button class="notif-btn-nega"    onclick="rispondiAccessoApp('${rid}','${nome}','NO',this)">ðŸš« Nega</button>
                  </div>`;
                }
            }
        } catch (_) {}
        if (!corpoHtml) {
            corpoHtml = `<div class="notifica-corpo">${_escapeHtml_(n.corpo || '')}</div>`;
        }
                return `<div class="notifica-item">
                    <button class="notif-del-btn" title="Elimina notifica"
                        onclick="eliminaNotificaApp('${ridRaw}','${titoloEnc}','${corpoEnc}',this)">Ã—</button>
          <div class="notifica-icon-badge"><i class="fas ${icon}"></i></div>
          <div class="notifica-body">
            <div class="notifica-titolo">${titolo}</div>
            ${corpoHtml}
            ${ts}
          </div>
        </div>`;
    }).join('');
}
function renderNotificheList() {
    const list = document.getElementById('notifiche-list');
    if (!list) return;
    const arr = JSON.parse(localStorage.getItem('_notificheArr') || '[]');
    list.innerHTML = _notifHtml_(arr);
    // Aggiorna dal server senza segnare come lette (lo fa l'utente aprendo il modal)
    if (utenteAttuale && utenteAttuale.nome) {
        fetch(URL_GOOGLE + '?azione=getNotifiche&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase()) + '&markRead=0')
            .then(function(r) { return r.json(); })
            .then(function(d) {
                if (d && d.status === 'ok' && d.all && d.all.length) {
                    _salvaNotificheInLocale_(d.all);
                    list.innerHTML = _notifHtml_(JSON.parse(localStorage.getItem('_notificheArr') || '[]'));
                }
            })
            .catch(function(err) { console.warn('[notifiche] renderNotificheList fetch fallito:', err); });
    }
}

/** Salva nuove notifiche in localStorage (ricevute dal SW postMessage o da fetch) */
function _salvaNotificheInLocale_(all) {
    try {
        const ts = new Date().toLocaleString('it-IT', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});
        const withTs = all.map(function(n) { return Object.assign({}, n, { _ts: n._ts || ts }); });
        const existing = JSON.parse(localStorage.getItem('_notificheArr') || '[]');
        const map = {};
        withTs.forEach(function(n) { map[n.titolo + '||' + n.corpo] = n; });
        existing.forEach(function(n) { const k = n.titolo + '||' + n.corpo; if (!map[k]) map[k] = n; });
        const merged = Object.values(map).slice(0, 30);
        localStorage.setItem('_notificheArr', JSON.stringify(merged));
        // Aggiorna badge count SOLO se ci sono notifiche nuove rispetto all'ultima lettura
        const prevCount = parseInt(localStorage.getItem('_notifBadgeCount') || '0');
        if (all.length > prevCount || all.length > 0 && prevCount === 0) {
            localStorage.setItem('_notifBadgeCount', String(all.length));
        }
        aggiornaBadgeNotifiche(parseInt(localStorage.getItem('_notifBadgeCount') || '0'));
    } catch(e) {}
}

function _isPushVisibleUtenteEsente_() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const nome = String(utenteAttuale.nome).toUpperCase().trim();
    return nome === 'ALESSIO' || nome === '0000' || utenteAttuale.ruolo === 'MASTER';
}

function _isOrarioRiepilogoNotifiche_() {
    const now  = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    return mins >= 9 * 60 && mins < 19 * 60 + 30; // 09:00 â€“ 19:30
}

function _mostraToastRiepilogoNotifiche_(count) {
    if (!count || count <= 0) return;
    if (!utenteAttuale || !utenteAttuale.nome) return;
    if (_isPushVisibleUtenteEsente_()) return;
    if (!_isOrarioRiepilogoNotifiche_()) return;
    try {
        const giorno = new Date().toLocaleDateString('it-IT');
        const key = '_notifMorningToast_' + String(utenteAttuale.nome).toUpperCase().trim() + '_' + giorno;
        if (localStorage.getItem(key) === '1') return;
        localStorage.setItem(key, '1');
    } catch(e) {}
    notificaElegante('ðŸ”” Hai ' + count + ' notific' + (count === 1 ? 'a' : 'he') + ' da leggere');
}

/** Inizializza il badge notifiche all'avvio: legge prima da localStorage, poi fetch fresco dal server */
function _initBadgeNotifiche() {
    // Usa _notifBadgeCount (azzerato all'apertura del modal), NON la lunghezza dello storico
    try {
        const count = parseInt(localStorage.getItem('_notifBadgeCount') || '0');
        if (count > 0) aggiornaBadgeNotifiche(count);
    } catch(e) {}
    if (!utenteAttuale || !utenteAttuale.nome) return;
    fetch(URL_GOOGLE + '?azione=getNotifiche&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase()) + '&markRead=0')
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (d && d.status === 'ok' && d.all && d.all.length) {
                _salvaNotificheInLocale_(d.all);
                _mostraToastRiepilogoNotifiche_(d.all.length);
            }
        })
        .catch(function(err) { console.warn('[notifiche] _initBadgeNotifiche fetch fallito:', err); });
}

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
            registerPipGlobals();
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
            try { localStorage.removeItem('sessioneUtente'); } catch (e) {}
            try { sessionStorage.removeItem('sessioneUtente'); } catch (e) {}
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
        } else if (!sessioneEsistente) {
            // Nessuna sessione in localStorage â†’ mostra login
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
        }
        // Se c'Ã¨ una sessione valida, l'utente resta dentro â€” l'errore Ã¨ solo di rete
    }
};






// setLoginMode, togglePasswordVisibility → definite in index.html (inline script)
// hashSHA256, _verificaAccessoUtente, _creaAccountUtente → modules/auth/login.js
function aggiornaProfiloSidebar() {
    const nomeDisplay = document.getElementById('user-name-display');
    const avatarIcon = document.getElementById('user-avatar-icon');
    const ddropAvatar = document.getElementById('account-ddrop-avatar');
    const ddropName = document.getElementById('account-ddrop-name');
    const ddropRole = document.getElementById('account-ddrop-role');
    // Mobile avatar
    const avatarIconMob = document.getElementById('user-avatar-icon-mobile');
    const ddropAvatarMob = document.getElementById('account-ddrop-avatar-mob');
    const ddropNameMob = document.getElementById('account-ddrop-name-mob');
    const ddropRoleMob = document.getElementById('account-ddrop-role-mob');

    if (utenteAttuale && utenteAttuale.nome) {
        const iniziale = utenteAttuale.nome.charAt(0).toUpperCase();
        const nomeUp = utenteAttuale.nome.toUpperCase();

        if (nomeDisplay) nomeDisplay.innerText = nomeUp;
        if (avatarIcon) avatarIcon.innerText = iniziale;
        if (ddropAvatar) ddropAvatar.innerText = iniziale;
        if (ddropName) ddropName.innerText = nomeUp;
        if (ddropRole) ddropRole.innerText = (utenteAttuale.ruolo || 'Utente').toUpperCase();
        // Mobile
        if (avatarIconMob) avatarIconMob.innerText = iniziale;
        if (ddropAvatarMob) ddropAvatarMob.innerText = iniziale;
        if (ddropNameMob) ddropNameMob.innerText = nomeUp;
        if (ddropRoleMob) ddropRoleMob.innerText = (utenteAttuale.ruolo || 'Utente').toUpperCase();
    }
    _initAvatarColor();
    _syncHivesTestVisibility();
}

/** Restituisce il colore avatar salvato per un operatore (UPPERCASE). Fallback: grigio */
let _avatarColorsCache = {}; // { NOME_UPPERCASE: '#hex' } â€” popolato da server al boot

function _getOpColor(nome) {
    try {
        const k = String(nome || '').toUpperCase().trim();
        if (_avatarColorsCache[k]) return _avatarColorsCache[k];
        return localStorage.getItem('avatarColor_' + k) || '#374151';
    } catch { return '#374151'; }
}

/**
 * Normalizza un nome operatore verso il formato canonico Title Case.
 * Unifica varianti: FABIO / FABIO T / FABIO T. â†’ Fabio T.
 *                   NICCOLO / NICCOLO' / NICCOLÃ’ â†’ NiccolÃ²
 */
const _NOME_CANON = {
    'ALESSIO'  : 'Alessio',
    'RICCARDO' : 'Riccardo',
    'FABIO'    : 'Fabio T.',
    'FABIO T'  : 'Fabio T.',
    'FABIO T.' : 'Fabio T.',
    'NICCOLO'  : 'NiccolÃ²',
    "NICCOLO'" : 'NiccolÃ²',
    'NICCOLÃ’'  : 'NiccolÃ²',
    'RAYMOND'  : 'Raymond',
    'SIMONE'   : 'Simone',
    'GIACOMO'  : 'Giacomo',
};
function _normNome(n) {
    if (!n) return n;
    const k = String(n).trim().toUpperCase();
    if (_NOME_CANON[k]) return _NOME_CANON[k];
    // fallback: Title Case generico
    return String(n).trim().toLowerCase().replace(/(?:^|\s|\.)\S/g, c => c.toUpperCase());
}

/** Applica il colore al pulsante avatar, al ddrop-avatar, all'input colore e agli swatch */
const _PREDEFINED_AVATAR_COLORS = ['#8fe45e','#6366f1','#f59e0b','#ec4899','#06b6d4','#f87171','#a78bfa','#34d399'];
/** Legge il colore salvato e lo applica all'avvio */
function _initAvatarColor() {
    if (!utenteAttuale || !utenteAttuale.nome) return;
    const saved = _getOpColor(utenteAttuale.nome);
    if (window._renderCustomSwatches) window._renderCustomSwatches();
    if (window._applyAvatarColorUI) window._applyAvatarColorUI(saved);
}

/** Carica tutti i colori avatar dal server, aggiorna cache e localStorage, ri-applica il proprio */
async function _caricaColoriAvatarDaServer() {
    try {
        const res = await fetch(`${URL_GOOGLE}?azione=getAvatarColors`);
        if (!res.ok) return;
        const map = await res.json(); // { NOME: '#hex', ... }
        if (typeof map !== 'object' || Array.isArray(map)) return;
        Object.entries(map).forEach(([nome, colore]) => {
            if (!colore) return;
            const k = nome.toUpperCase().trim();
            _avatarColorsCache[k] = colore;
            try { localStorage.setItem('avatarColor_' + k, colore); } catch {}
        });
        // Ri-applica il colore dell'utente corrente se presente
        if (utenteAttuale?.nome) {
            const mioColore = map[utenteAttuale.nome.toUpperCase().trim()];
            if (mioColore && window._applyAvatarColorUI) window._applyAvatarColorUI(mioColore);
        }
        // Ri-vernicia i badge degli altri operatori giÃ  nel DOM
        _repaintOpColors();
    } catch (e) {
        console.warn('_caricaColoriAvatarDaServer:', e);
    }
}

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
    registerPipGlobals();
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
// aggiornaBadgeNotifiche Ã¨ definita all'inizio del file (riga 22) â€” NON ridichiarare qui

/* â”€â”€ Blocco orario accesso â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   L'app Ã¨ utilizzabile dalle 08:30 alle 19:30.
   Sono esenti: account ALESSIO e account 0000 (MASTER).
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function _isUtenteEsente() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const nome = utenteAttuale.nome.toUpperCase();
    return nome === 'ALESSIO' || nome === '0000' || utenteAttuale.ruolo === 'MASTER';
}
const _ENABLE_HIVES_TEST_PAGE = true;
const _HIVES_TEST_PAGE_ID = 'TEST_HIVES_ANNUALE';
function _isAlessioOnly() {
    const nome = String((utenteAttuale && utenteAttuale.nome) || '').toUpperCase().trim();
    const email = String((utenteAttuale && utenteAttuale.email) || '').toLowerCase().trim();
    return nome === 'ALESSIO' || email === 'alessio@ombre-1.com';
}
function _canOpenHivesTestPage() {
    return _ENABLE_HIVES_TEST_PAGE && _isAlessioOnly();
}
function _syncHivesTestVisibility() {
    const show = _canOpenHivesTestPage();
    const menuBtn = document.getElementById('menu-item-hives-test');
    if (menuBtn) menuBtn.style.display = show ? '' : 'none';
    if (!show && paginaAttuale === _HIVES_TEST_PAGE_ID) cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null);
}
function _isCommerciale() {
    if (!utenteAttuale) return false;
    return String(utenteAttuale.ruolo || '').toUpperCase() === 'COMMERCIALE';
}
function _isOrarioConsentito() {
    const now  = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    return mins >= 8 * 60 + 30 && mins < 19 * 60 + 30; // 08:30 â€“ 19:30
}
/**
 * Verifica se l'utente corrente puÃ² accedere in base all'orario.
 * Se non puÃ², esegue il logout con messaggio.
 * Restituisce true se l'accesso Ã¨ consentito, false altrimenti.
 */
function _checkOrarioAccesso(mostraMessaggio) {
    // Accesso extra temporaneo concesso da Alessio (valido solo per questa sessione browser)
    if (sessionStorage.getItem('_accesso_extra_') === '1') {
        _sbloccaSchermo_();
        return true;
    }
    if (_isUtenteEsente() || _isOrarioConsentito()) {
        // Se siamo rientrati in orario e c'era il blocco schermo, rimuovilo
        _sbloccaSchermo_();
        return true;
    }
    if (mostraMessaggio !== false) {
        // In entrambi i casi (dentro app o al login) mostriamo il lock screen.
        // Il lock screen ha z-index:99999 e compare sopra tutto, incluso il login overlay.
        _bloccaSchermo_();
    }
    return false;
}

function _bloccaSchermo_() {
    if (document.getElementById('_lock-screen_')) return; // giÃ  attivo
    const nome = utenteAttuale && utenteAttuale.nome ? utenteAttuale.nome : '';
    const div = document.createElement('div');
    div.id = '_lock-screen_';
    div.style.cssText = [
        'position:fixed','top:0','left:0','width:100%','height:100%',
        'background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
        'z-index:99999','display:flex','flex-direction:column',
        'align-items:center','justify-content:center','gap:16px',
        'color:#e2e8f0','font-family:inherit'
    ].join(';');
    // Se l'utente non Ã¨ loggato mostriamo un input per il nome utente
    const identitaBlock = nome
        ? `<div style="margin-top:8px;font-size:0.82rem;color:#64748b">
               Accesso come: <strong style="color:#94a3b8">${_normNome ? _normNome(nome) : nome}</strong>
           </div>`
        : `<input id="_lock-nome_" type="text" placeholder="Il tuo nome utente"
               autocomplete="username" spellcheck="false"
               style="margin-top:12px;padding:10px 16px;border-radius:10px;border:1px solid #334155;
                      background:#0f172a;color:#e2e8f0;font-size:0.95rem;text-align:center;
                      width:220px;outline:none;">`;
    div.innerHTML = `
        <div style="font-size:3rem">ðŸ”’</div>
        <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.02em">App bloccata</div>
        <div style="font-size:0.95rem;color:#94a3b8;text-align:center;max-width:280px;line-height:1.5">
            L'app Ã¨ disponibile dalle <strong style="color:#e2e8f0">08:30</strong> alle
            <strong style="color:#e2e8f0">19:30</strong>.<br>
            Si sbloccherÃ  automaticamente.
        </div>
        ${identitaBlock}
        <button id="_btn-chiedi-accesso_"
            onclick="_richiestaAccessoFuoriOrario_()"
            style="margin-top:16px;padding:12px 28px;border-radius:12px;border:none;
                   background:#f59e0b;color:#0f172a;font-weight:700;font-size:0.95rem;
                   cursor:pointer;letter-spacing:0.02em;transition:background 0.15s">
            ðŸ”‘ Chiedi accesso a Alessio
        </button>
        <div id="_lock-stato_" style="font-size:0.82rem;color:#64748b;min-height:1.2em;text-align:center;max-width:260px"></div>`;
    document.body.appendChild(div);
}

function _sbloccaSchermo_() {
    const el = document.getElementById('_lock-screen_');
    if (el) el.remove();
    _stopPollingAccesso_();
}

// â”€â”€ Richiesta accesso fuori orario â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let _accessoRichiestaId  = null;
let _accessoPollingTimer = null;

function _stopPollingAccesso_() {
    if (_accessoPollingTimer) { clearInterval(_accessoPollingTimer); _accessoPollingTimer = null; }
    _accessoRichiestaId = null;
}

async function _richiestaAccessoFuoriOrario_() {
    const btn     = document.getElementById('_btn-chiedi-accesso_');
    const statoEl = document.getElementById('_lock-stato_');
    if (!btn || !statoEl) return;

    // Nome: da profilo loggato oppure dall'input manuale (quando si accede da login screen)
    let nome = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome : '';
    if (!nome) {
        const inputEl = document.getElementById('_lock-nome_');
        nome = inputEl ? inputEl.value.trim() : '';
    }
    if (!nome) {
        statoEl.textContent = 'âš ï¸ Inserisci prima il tuo nome utente nel campo sopra.';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'â³ Invio richiestaâ€¦';
    statoEl.textContent = '';

    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'richiestaAccessoFuoriOrario', nome })
        });
        const json = await res.json().catch(() => ({}));
        if (json.status === 'ok' && json.id) {
            _accessoRichiestaId = json.id;
            btn.textContent = 'ðŸ“¨ Richiesta inviata';
            statoEl.textContent = 'In attesa di approvazione da Alessioâ€¦';
            // Blocca l'input nome per evitare modifiche durante il polling
            const inputEl = document.getElementById('_lock-nome_');
            if (inputEl) inputEl.disabled = true;
            // Inizia polling ogni 4 secondi
            _accessoPollingTimer = setInterval(_pollAccessoApprovato_, 4000);
        } else {
            btn.disabled = false;
            btn.textContent = 'ðŸ”‘ Chiedi accesso a Alessio';
            statoEl.textContent = 'âš ï¸ Errore nell\'invio. Riprova.';
        }
    } catch {
        btn.disabled = false;
        btn.textContent = 'ðŸ”‘ Chiedi accesso a Alessio';
        statoEl.textContent = 'âš ï¸ Errore di rete. Riprova.';
    }
}

async function _pollAccessoApprovato_() {
    if (!_accessoRichiestaId) return;
    // Nome: da profilo loggato o dall'input manuale nel lock screen
    let nome = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : '';
    if (!nome) {
        const inputEl = document.getElementById('_lock-nome_');
        nome = inputEl ? inputEl.value.trim().toUpperCase() : '';
    }
    try {
        const res = await fetch(URL_GOOGLE +
            '?azione=verificaAccessoFuoriOrario&id=' + encodeURIComponent(_accessoRichiestaId) +
            '&usr=' + encodeURIComponent(nome));
        const json = await res.json().catch(() => ({}));
        if (json.esito === 'APPROVED') {
            _stopPollingAccesso_();
            _sbloccaSchermo_();
            // Segna in sessionStorage: accesso temporaneo concesso (si resetta alla chiusura)
            sessionStorage.setItem('_accesso_extra_', '1');
            // Toast di benvenuto
            const t = document.createElement('div');
            t.textContent = 'âœ… Accesso consentito da Alessio!';
            t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:12px 24px;border-radius:12px;font-weight:700;font-size:0.95rem;z-index:99998;box-shadow:0 4px 20px rgba(0,0,0,0.35);pointer-events:none';
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 4000);
            // Ricarica l'app sotto se necessario
            if (typeof caricaDati === 'function') caricaDati(paginaAttuale);
        } else if (json.esito === 'DENIED') {
            _stopPollingAccesso_();
            const statoEl = document.getElementById('_lock-stato_');
            const btn     = document.getElementById('_btn-chiedi-accesso_');
            if (statoEl) statoEl.textContent = 'ðŸš« Accesso negato da Alessio.';
            if (btn) { btn.disabled = false; btn.textContent = 'ðŸ”‘ Richiedi di nuovo'; }
        }
    } catch { /* ignora errori di rete, riprova al prossimo tick */ }
}

// Controllo ogni minuto mentre l'app Ã¨ aperta
setInterval(function() {
    if (utenteAttuale && utenteAttuale.nome) _checkOrarioAccesso(true);
}, 60 * 1000);
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
function cambiaPagina(nomeFoglio, elementoMenu) {
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
    if (nomeFoglio !== 'PIPISTRELLI') resetPipFetch();

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
            caricaPipistrelli();
            break;
        case 'TEST_HIVES_ANNUALE':
            caricaPaginaHivesTest();
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

// — funzioni definite in questo file chiamate da HTML onclick/oninput
window.cambiaPagina                = cambiaPagina;
window.aggiornaListaFiltrabili     = aggiornaListaFiltrabili;
window.apriPopupNotifiche          = apriPopupNotifiche;
window.chiudiPopupNotifiche        = chiudiPopupNotifiche;
window.eliminaNotificaApp          = eliminaNotificaApp;
window.rispondiAccessoApp          = rispondiAccessoApp;
window.filtraUniversale            = filtraUniversale;
window.toggleSidebar               = toggleSidebar;
window.logout                      = logout;
window._richiestaAccessoFuoriOrario_ = _richiestaAccessoFuoriOrario_;
window.salvaEApriDashboard         = salvaEApriDashboard;

// — variabili/oggetti condivisi letti e scritti dai moduli via window.*
window.cacheContenuti              = cacheContenuti;   // oggetto: le mutation sono condivise
window.TW                          = TW;               // oggetto stili Tailwind
window.listaStati                  = listaStati;       // array: impostazioni.js lo sostituisce
window.listaOperatori              = listaOperatori;   // array: impostazioni.js lo sostituisce

// — funzioni di script.js usate dai moduli via window.*
window._VAPID_PUBLIC_KEY           = _VAPID_PUBLIC_KEY;
window._salvaSubVAPID_             = _salvaSubVAPID_;
window._gestisciAuthError_         = _gestisciAuthError_;
window._getSessionToken_           = _getSessionToken_;
window._defaultListaStati_         = _defaultListaStati_;
window._normNome                   = _normNome;
window._PREDEFINED_AVATAR_COLORS   = _PREDEFINED_AVATAR_COLORS;
window._avatarColorsCache          = _avatarColorsCache;
