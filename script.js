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
        wrap.innerHTML = '<span class="notif-risposta-wait">⏳ Invio in corso…</span>';
    }
    try {
        const url = URL_GOOGLE + '?azione=rispondiAccessoFuoriOrario&id=' + encodeURIComponent(richiestaId) + '&ok=' + encodeURIComponent(risposta) + '&json=1';
        const res  = await fetch(url);
        const data = await res.json();
        if (data.status === 'ok') {
            const msg = risposta === 'SI' ? '✅ Accesso consentito' : '🚫 Accesso negato';
            // Persisti il risultato in localStorage: la prossima apertura del pannello
            // non mostrerà più i pulsanti per questa richiesta
            _segnaAccessoGestito_(richiestaId, msg);
            if (wrap) wrap.innerHTML = '<span class="notif-risposta-ok">' + msg + '</span>';
        } else {
            if (wrap) wrap.innerHTML = '<span class="notif-risposta-err">⚠️ ' + (data.msg || 'Errore') + '</span>';
        }
    } catch (err) {
        if (wrap) wrap.innerHTML = '<span class="notif-risposta-err">⚠️ Errore di rete</span>';
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
        // Rilevamento notifica accesso_richiesta (corpo è JSON strutturato)
        let corpoHtml = '';
        try {
            const parsed = JSON.parse(n.corpo || '');
            if (parsed && parsed.tipo === 'accesso_richiesta') {
                const rid  = _escapeHtml_(parsed.id   || '');
                const nome = _escapeHtml_(parsed.nome || '');
                // Controlla se Alessio ha già risposto (persistito in localStorage)
                const gestiti = _getAccessiGestiti_();
                if (gestiti[parsed.id]) {
                    corpoHtml = `<div class="notifica-corpo"><span class="notif-risposta-ok">${_escapeHtml_(gestiti[parsed.id])}</span></div>`;
                } else {
                    corpoHtml = `<div class="notifica-corpo">Vuole entrare fuori orario.</div>
                  <div class="notif-azioni-accesso">
                    <button class="notif-btn-consenti" onclick="rispondiAccessoApp('${rid}','${nome}','SI',this)">✅ Consenti</button>
                    <button class="notif-btn-nega"    onclick="rispondiAccessoApp('${rid}','${nome}','NO',this)">🚫 Nega</button>
                  </div>`;
                }
            }
        } catch (_) {}
        if (!corpoHtml) {
            corpoHtml = `<div class="notifica-corpo">${_escapeHtml_(n.corpo || '')}</div>`;
        }
                return `<div class="notifica-item">
                    <button class="notif-del-btn" title="Elimina notifica"
                        onclick="eliminaNotificaApp('${ridRaw}','${titoloEnc}','${corpoEnc}',this)">×</button>
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
    return mins >= 9 * 60 && mins < 19 * 60 + 30; // 09:00 – 19:30
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
    notificaElegante('🔔 Hai ' + count + ' notific' + (count === 1 ? 'a' : 'he') + ' da leggere');
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
const URL_GOOGLE = "https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec";

let _fetchSessionPatchDone = false;
let _sessionRefreshTimer = null;
let _refreshAuthFailCount_ = 0; // conta auth_error consecutivi dal refresh silenzioso
function _getSessionToken_() {
    // Priorità allo storage condiviso tra tab: evita uso di token in-memory obsoleto.
    try {
        const rawShared = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente');
        if (rawShared) {
            const s = JSON.parse(rawShared);
            if (s && s.sessionToken) {
                const t = String(s.sessionToken);
                if (utenteAttuale && utenteAttuale.sessionToken !== t) utenteAttuale.sessionToken = t;
                return t;
            }
        }
    } catch (e) {}
    try {
        if (utenteAttuale && utenteAttuale.sessionToken) return String(utenteAttuale.sessionToken);
    } catch (e) {}
    try {
        const raw = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente');
        if (!raw) return '';
        const s = JSON.parse(raw);
        return s && s.sessionToken ? String(s.sessionToken) : '';
    } catch (e) {
        return '';
    }
}
function _patchFetchWithSession_() {
    if (_fetchSessionPatchDone || typeof window.fetch !== 'function') return;
    const originalFetch = window.fetch.bind(window);

    // Intercetta auth_error in background su ogni risposta GAS, senza consumare il body originale
    function _intercettaAuthError_(resp) {
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
            if (!utenteAttuale) utenteAttuale = {};
            utenteAttuale.sessionToken = r.sessionToken;
            utenteAttuale.sessionExpiresAt = r.sessionExpiresAt || '';
            if (!utenteAttuale.nome && r.nome) utenteAttuale.nome = r.nome;
            if (!utenteAttuale.email && r.email) utenteAttuale.email = r.email;
            if (!utenteAttuale.ruolo && r.ruolo) utenteAttuale.ruolo = r.ruolo;
            try { localStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}
            try { sessionStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}
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
        // rete momentaneamente assente: riproverà al prossimo ciclo
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
        if (!utenteAttuale) utenteAttuale = {};
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
function _gestisciAuthError_(messaggio) {
    notificaElegante(
        messaggio || 'Sessione scaduta. Effettua nuovamente il login.',
        'error'
    );
    setTimeout(function() { logout(); }, 2000);
}

// Fallback: se una sessione è già presente E ha un sessionToken valido,
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
const CACHE_TTL_MS = 300000; // 5 minuti: sotto questa soglia non fare background refresh

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
        } else if (result && result.status === 'errore-verifica') {
            try { localStorage.setItem('_pushStato', 'errore-verifica'); } catch {}
            notificaElegante('⚠️ Subscription creata ma NON confermata sul server. Riprova "Ri-registra subscription".', 'error');
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
        console.log('[Push] testPush:', JSON.stringify(json));
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
            if (ps === 'ok')                      statoServer = ' ✓ registrato sul server';
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

/** Importa ordini dal CSV del gestionale direttamente sul foglio, senza passare da Sheets */
async function importaCSVDaFile(input) {
    const file = input && input.files && input.files[0];
    const labelNome = document.getElementById('csv-upload-filename');
    const risultato = document.getElementById('csv-upload-result');
    if (!file) return;

    if (labelNome) labelNome.textContent = file.name;
    if (risultato) { risultato.style.display = 'none'; risultato.innerHTML = ''; }

    // Legge il file come testo
    const csvText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file, 'UTF-8');
    });

    // Rileva automaticamente il separatore (; oppure ,)
    const primaRiga = csvText.split('\n')[0] || '';
    const separatore = (primaRiga.split(';').length >= primaRiga.split(',').length) ? ';' : ',';

    // Mostra stato caricamento
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
                    setTimeout(() => { if (typeof caricaDati === 'function') caricaDati('PROGRAMMA PRODUZIONE DEL MESE', true); }, 800);
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
    // Reset input per permettere di ricaricare lo stesso file
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
        // Raggruppa per utente
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

/** POST una subscription VAPID al backend GAS. Ritorna anche la verifica server-side. */
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
        // Verifica server-side: conferma che l'endpoint è davvero nel foglio
        if (json && (json.status === 'saved' || json.status === 'updated')) {
            try {
                const verUrl = URL_GOOGLE + '?azione=verificaIscrizione&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase()) + '&endpoint=' + encodeURIComponent(sub.endpoint);
                const verRes = await fetch(verUrl);
                const verJson = await verRes.json().catch(() => ({}));
                if (!verJson.found) {
                    console.warn('[Push] verificaIscrizione: endpoint NON trovato nel foglio dopo il salvataggio!');
                    json.status = 'errore-verifica';
                } else {
                    console.log('[Push] verificaIscrizione: ✓ endpoint confermato nel foglio');
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
// Cache raw ordini per autocomplete nel modal
let _ordiniAutocompleteCache = [];
let _attiviProd = [];  // cache per il chart overview nella pagina produzione
let _pollProdTimer = null; // timer polling produzione
const _POLL_PROD_MS = 10000; // 10 secondi (aumentato da 30s per risposta più rapida)
let _lastKanbanDragTs = 0; // timestamp ultimo drag kanban (evita revert poll)

async function fetchJson(pagina, signal) {
    const url = URL_GOOGLE + "?pagina=" + encodeURIComponent(pagina);
    const res = await fetch(url, signal ? { signal } : {});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// === CACHE localStorage PERSISTENTE (sopravvive al reload) ===
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

function applicaFade(elem) {
    if (elem) {
        elem.classList.add('fade-in');
        setTimeout(() => elem.classList.remove('fade-in'), 300);
    }
}

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



let utenteAttuale = {
    nome: "",
    ruolo: "",
    vistaSimulata: ""
};

/**
 * Restituisce true se l'utente è MASTER.
 * Se non lo è, mostra una notifica e restituisce false.
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
        // Se c'è una sessione, la leggiamo subito
        utenteAttuale = JSON.parse(sessione);

        // Verifica che la sessione includa un sessionToken (aggiunto con il nuovo sistema di auth).
        // Se manca (login effettuato prima dell'aggiornamento del backend), forza il re-login.
        if (utenteAttuale.ruolo !== 'MASTER' && !utenteAttuale.sessionToken) {
            utenteAttuale = null;
            try { localStorage.removeItem('sessioneUtente'); sessionStorage.removeItem('sessioneUtente'); } catch(_e) {}
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
            const _errDiv = document.getElementById('login-error');
            if (_errDiv) {
                _errDiv.innerText = 'Sessione non più valida. Effettua di nuovo il login.';
                _errDiv.style.color = '#ef4444';
            }
            return;
        }

        // Blocco orario: se fuori orario e non esente → blocca schermo (senza return, carica l'app sotto)
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
        const res  = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'verificaLogin',
                email,
                username,
                hash
            })
        });
        const r    = await res.json();
        if (r.status === "success") {
            utenteAttuale = {
                nome: r.nome,
                ruolo: r.ruolo,
                email: r.email,
                vistaSimulata: r.nome,
                sessionToken: r.sessionToken || '',
                sessionExpiresAt: r.sessionExpiresAt || ''
            };
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
let _avatarColorsCache = {}; // { NOME_UPPERCASE: '#hex' } — popolato da server al boot

function _getOpColor(nome) {
    try {
        const k = String(nome || '').toUpperCase().trim();
        if (_avatarColorsCache[k]) return _avatarColorsCache[k];
        return localStorage.getItem('avatarColor_' + k) || '#374151';
    } catch { return '#374151'; }
}

/**
 * Normalizza un nome operatore verso il formato canonico Title Case.
 * Unifica varianti: FABIO / FABIO T / FABIO T. → Fabio T.
 *                   NICCOLO / NICCOLO' / NICCOLÒ → Niccolò
 */
const _NOME_CANON = {
    'ALESSIO'  : 'Alessio',
    'RICCARDO' : 'Riccardo',
    'FABIO'    : 'Fabio T.',
    'FABIO T'  : 'Fabio T.',
    'FABIO T.' : 'Fabio T.',
    'NICCOLO'  : 'Niccolò',
    "NICCOLO'" : 'Niccolò',
    'NICCOLÒ'  : 'Niccolò',
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
    // 1. Salva in localStorage (fallback offline)
    try { localStorage.setItem('avatarColor_' + nomeKey, color); } catch {}
    // 2. Aggiorna cache in-memory (subito visibile a tutti i badge già renderizzati)
    _avatarColorsCache[nomeKey] = color;
    // 3. Persiste sul server (fire-and-forget)
    if (utenteAttuale.nome && typeof URL_GOOGLE !== 'undefined') {
        fetch(`${URL_GOOGLE}?azione=setAvatarColor&username=${encodeURIComponent(utenteAttuale.nome)}&color=${encodeURIComponent(color)}`)
            .catch(() => {});
    }
    _applyAvatarColorUI(color);
}

/** Legge il colore salvato e lo applica all'avvio */
function _initAvatarColor() {
    if (!utenteAttuale || !utenteAttuale.nome) return;
    const saved = _getOpColor(utenteAttuale.nome);
    _renderCustomSwatches();
    _applyAvatarColorUI(saved);
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
            if (mioColore) _applyAvatarColorUI(mioColore);
        }
        // Ri-vernicia i badge degli altri operatori già nel DOM
        _repaintOpColors();
    } catch (e) {
        console.warn('_caricaColoriAvatarDaServer:', e);
    }
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

/** Aggiorna la pagina corrente: svuota cache, ricarica impostazioni e ricarica dati dal server */
async function _aggiornaPagina() {
    // Invalida cache impostazioni e ricarica dal server
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
    if (typeof paginaAttuale !== 'undefined' && paginaAttuale) {
        delete cacheContenuti[paginaAttuale];
        if (typeof _lsCacheDel === 'function') _lsCacheDel('_html_' + paginaAttuale);
    }
    window.location.reload();
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

/* ── Account menu MOBILE ── */
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

// Chiude il dropdown mobile cliccando fuori
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
    // Blocco orario: impedisce l'accesso fuori dalle 08:30-19:30 (tranne esenti)
    if (!_checkOrarioAccesso(true)) return;
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
}
function logout() {
    try {
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

        // Preserva i dati per-device (non legati alla sessione utente)
        const datiDevice = {};
        const keysDevice = ['notifPrefs', '_pushStato', 'mlPipQty', 'mlPipCaricato', 'mlPipMovimenti', 'mlPipPronti'];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && (k.startsWith('avatarColor_') || k.startsWith('avatarColorRecenti_') || k.startsWith('avatarColorHidden_') || keysDevice.includes(k))) datiDevice[k] = localStorage.getItem(k);
        }

        // 1. Pulizia totale della memoria del browser
        localStorage.clear();
        sessionStorage.clear();

        // Ripristina i dati per-device
        Object.entries(datiDevice).forEach(([k, v]) => { try { localStorage.setItem(k, v); } catch {} });

        // 2. Reindirizzamento pulito alla pagina iniziale
        // Aggiungiamo un parametro casuale per evitare che il browser usi la cache vecchia
        window.location.href = window.location.origin + window.location.pathname + "?logout=" + Date.now();

    } catch (error) {
        // Se c'è un errore imprevisto, forziamo comunque il ricaricamento
        console.error("Errore durante il logout:", error);
        window.location.reload();
    }
}
// aggiornaBadgeNotifiche è definita all'inizio del file (riga 22) — NON ridichiarare qui

/* ── Blocco orario accesso ───────────────────────────────────────────────────
   L'app è utilizzabile dalle 08:30 alle 19:30.
   Sono esenti: account ALESSIO e account 0000 (MASTER).
─────────────────────────────────────────────────────────────────────────── */
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
    return mins >= 8 * 60 + 30 && mins < 19 * 60 + 30; // 08:30 – 19:30
}
/**
 * Verifica se l'utente corrente può accedere in base all'orario.
 * Se non può, esegue il logout con messaggio.
 * Restituisce true se l'accesso è consentito, false altrimenti.
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
    if (document.getElementById('_lock-screen_')) return; // già attivo
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
    // Se l'utente non è loggato mostriamo un input per il nome utente
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
        <div style="font-size:3rem">🔒</div>
        <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.02em">App bloccata</div>
        <div style="font-size:0.95rem;color:#94a3b8;text-align:center;max-width:280px;line-height:1.5">
            L'app è disponibile dalle <strong style="color:#e2e8f0">08:30</strong> alle
            <strong style="color:#e2e8f0">19:30</strong>.<br>
            Si sbloccherà automaticamente.
        </div>
        ${identitaBlock}
        <button id="_btn-chiedi-accesso_"
            onclick="_richiestaAccessoFuoriOrario_()"
            style="margin-top:16px;padding:12px 28px;border-radius:12px;border:none;
                   background:#f59e0b;color:#0f172a;font-weight:700;font-size:0.95rem;
                   cursor:pointer;letter-spacing:0.02em;transition:background 0.15s">
            🔑 Chiedi accesso a Alessio
        </button>
        <div id="_lock-stato_" style="font-size:0.82rem;color:#64748b;min-height:1.2em;text-align:center;max-width:260px"></div>`;
    document.body.appendChild(div);
}

function _sbloccaSchermo_() {
    const el = document.getElementById('_lock-screen_');
    if (el) el.remove();
    _stopPollingAccesso_();
}

// ── Richiesta accesso fuori orario ─────────────────────────────────────────
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
        statoEl.textContent = '⚠️ Inserisci prima il tuo nome utente nel campo sopra.';
        return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Invio richiesta…';
    statoEl.textContent = '';

    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'richiestaAccessoFuoriOrario', nome })
        });
        const json = await res.json().catch(() => ({}));
        if (json.status === 'ok' && json.id) {
            _accessoRichiestaId = json.id;
            btn.textContent = '📨 Richiesta inviata';
            statoEl.textContent = 'In attesa di approvazione da Alessio…';
            // Blocca l'input nome per evitare modifiche durante il polling
            const inputEl = document.getElementById('_lock-nome_');
            if (inputEl) inputEl.disabled = true;
            // Inizia polling ogni 4 secondi
            _accessoPollingTimer = setInterval(_pollAccessoApprovato_, 4000);
        } else {
            btn.disabled = false;
            btn.textContent = '🔑 Chiedi accesso a Alessio';
            statoEl.textContent = '⚠️ Errore nell\'invio. Riprova.';
        }
    } catch {
        btn.disabled = false;
        btn.textContent = '🔑 Chiedi accesso a Alessio';
        statoEl.textContent = '⚠️ Errore di rete. Riprova.';
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
            t.textContent = '✅ Accesso consentito da Alessio!';
            t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:12px 24px;border-radius:12px;font-weight:700;font-size:0.95rem;z-index:99998;box-shadow:0 4px 20px rgba(0,0,0,0.35);pointer-events:none';
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 4000);
            // Ricarica l'app sotto se necessario
            if (typeof caricaDati === 'function') caricaDati(paginaAttuale);
        } else if (json.esito === 'DENIED') {
            _stopPollingAccesso_();
            const statoEl = document.getElementById('_lock-stato_');
            const btn     = document.getElementById('_btn-chiedi-accesso_');
            if (statoEl) statoEl.textContent = '🚫 Accesso negato da Alessio.';
            if (btn) { btn.disabled = false; btn.textContent = '🔑 Richiedi di nuovo'; }
        }
    } catch { /* ignora errori di rete, riprova al prossimo tick */ }
}

// Controllo ogni minuto mentre l'app è aperta
setInterval(function() {
    if (utenteAttuale && utenteAttuale.nome) _checkOrarioAccesso(true);
}, 60 * 1000);

// Quando l'utente torna sulla tab dopo averla lasciata, poll immediato su Produzione
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && paginaAttuale === 'PROGRAMMA PRODUZIONE DEL MESE') {
        _pollProdStep();
    }
});

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
    // Gestisce visibilità pulsante filtro articoli (solo su pagina Produzione)
    _aggiornaVisibilitaFiltroArticoli(nomeFoglio);
    // Classe sul body per eccezioni CSS by-page (es. landscape su PIPISTRELLI)
    document.body.classList.toggle('page-pip', nomeFoglio === 'PIPISTRELLI');
    document.body.classList.toggle('page-hives-test', nomeFoglio === _HIVES_TEST_PAGE_ID);
    // Reset flag fetch pip quando si lascia la pagina (così al prossimo accesso rilegge dal server)
    if (nomeFoglio !== 'PIPISTRELLI') caricaPaginaPipistrello._fetched = false;

    // Mostra/nasconde la tab bar Acquisti
    // Se si naviga su Acquisti da sidebar/tab (elementoMenu != null) → reset a catalogo
    if (nomeFoglio === 'MATERIALE DA ORDINARE' && elementoMenu) _acquistTabAttivo = 'catalogo';
    const _acqTabBarEl = document.getElementById('acq-tab-bar');
    if (_acqTabBarEl) {
        _acqTabBarEl.style.display = nomeFoglio === 'MATERIALE DA ORDINARE' ? 'flex' : 'none';
        if (nomeFoglio === 'MATERIALE DA ORDINARE') _aggiornaTabAcquisti();
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
        'PIPISTRELLI': "🦇 Pipistrelli",
        'TEST_HIVES_ANNUALE': "🧪 Test Hives Annuale"
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

    // Ripristino da localStorage se la cache RAM è vuota (garantisce render istantaneo dopo reload)
    if (!cacheContenuti[nomeFoglio]) {
        const _lsKey = '_html_' + nomeFoglio;
        const _lsHtml = _lsCacheGet(_lsKey, 300000); // conserva fino a 5 minuti
        if (_lsHtml) {
            cacheContenuti[nomeFoglio] = _lsHtml;
            // Usa il timestamp REALE dell'LS cache così il bg refresh scatta
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

    if (cacheContenuti[nomeFoglio] && !(nomeFoglio === 'MATERIALE DA ORDINARE' && _acquistTabAttivo === 'ordini')) {
        contenitore.innerHTML = cacheContenuti[nomeFoglio];
        applicaFade(contenitore);
        aggiornaListaFiltrabili();
        // Riattiva DnD kanban dopo restore da cache
        requestAnimationFrame(_initKanbanDnd);
        console.log("Rendering da cache:", nomeFoglio);

        // Avvia polling live se si torna su Produzione
        if (nomeFoglio === 'PROGRAMMA PRODUZIONE DEL MESE') _startPollingProduzione();

        // Aggiornamento dati in background solo se la cache è scaduta
        const ora = Date.now();
        const ultimoFetch = cacheFetchTime[nomeFoglio] || 0;
        if (ora - ultimoFetch > CACHE_TTL_MS) {
            if (nomeFoglio === 'PROGRAMMA PRODUZIONE DEL MESE') caricaDati(nomeFoglio, true, requestId, navSignal);
            else if (nomeFoglio === 'MATERIALE DA ORDINARE')    caricaMateriali(true, requestId, navSignal);
            else if (nomeFoglio === 'STORICO_RICHIESTE')        caricaPaginaRichieste(requestId, navSignal);
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
        case 'STORICO_RICHIESTE':
            caricaPaginaRichieste(requestId, navSignal);
            break;
        case 'ARCHIVIO_ORDINI':
            caricaArchivio();
            break;
        case 'MATERIALE DA ORDINARE':
            _aggiornaTabAcquisti();
            if (_acquistTabAttivo === 'ordini') caricaOrdiniAcquisti(requestId, navSignal);
            else caricaMateriali(false, requestId, navSignal);
            break;
        case 'ORDINI_ACQUISTI':
            _acquistTabAttivo = 'ordini';
            cambiaPagina('MATERIALE DA ORDINARE', null);
            return;
        case 'PIPISTRELLI':
            caricaPaginaPipistrello();
            break;
        case 'TEST_HIVES_ANNUALE':
            caricaPaginaHivesTest();
            break;
        default:
            caricaDati(nomeFoglio, false, requestId, navSignal);
    }
}

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

function _pipLoadQty()    { try { return JSON.parse(localStorage.getItem(_PIP_LS_QTY))    || {p:0,m:0,g:0}; } catch { return {p:0,m:0,g:0}; } }
function _pipLoadCaric()  { try { return JSON.parse(localStorage.getItem(_PIP_LS_CARIC))  || {}; }             catch { return {}; } }
function _pipLoadPronti() { try { return JSON.parse(localStorage.getItem(_PIP_LS_PRONTI)) || {}; }             catch { return {}; } }
function _pipSaveQty(o)   { try { localStorage.setItem(_PIP_LS_QTY,    JSON.stringify(o)); localStorage.setItem('pip_local_ts', Date.now()); } catch {} _pipPushToServer(); }
function _pipSaveCaric(o) { try { localStorage.setItem(_PIP_LS_CARIC,  JSON.stringify(o)); localStorage.setItem('pip_local_ts', Date.now()); } catch {} _pipPushToServer(); }
function _pipSavePronti(o){ try { localStorage.setItem(_PIP_LS_PRONTI, JSON.stringify(o)); localStorage.setItem('pip_local_ts', Date.now()); } catch {} _pipPushToServer(); }
function _pipLoadMov()    { try { return JSON.parse(localStorage.getItem(_PIP_LS_MOV))    || []; }             catch { return []; } }
function _pipSaveMov(a)   { try { localStorage.setItem(_PIP_LS_MOV,    JSON.stringify(a)); localStorage.setItem('pip_local_ts', Date.now()); } catch {} _pipPushToServer(); }

/* ---- SYNC SERVER ---- */
let _pipPushTimer = null;
/** Invia (con debounce 1.5s) tutti i dati pipistrelli al server GAS */
function _pipPushToServer() {
  if (typeof URL_GOOGLE === 'undefined') return;
  clearTimeout(_pipPushTimer);
  _pipPushTimer = setTimeout(function() {
    const payload = {
      azione:    'setPipData',
      qty:       _pipLoadQty(),
      caricato:  _pipLoadCaric(),
      pronti:    _pipLoadPronti(),
      movimenti: _pipLoadMov()
    };
    fetch(URL_GOOGLE, {
      method: 'POST',
      body:   JSON.stringify(payload)
    }).catch(function(err) { console.warn('[pipistrelli] salvataggio remoto fallito:', err); });
  }, 1500);
}

/**
 * Carica i dati pipistrelli dal server e, se trovati, aggiorna localStorage.
 * Sovrascrive SOLO se il server ha un timestamp più recente di quello locale.
 * Chiama cb(true) se ha applicato dati dal server, cb(false) altrimenti.
 */
function _pipFetchFromServer(cb) {
  if (typeof URL_GOOGLE === 'undefined') { if (cb) cb(false); return; }
  fetch(URL_GOOGLE + '?azione=getPipData')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var serverTs = parseInt(d.ts || 0);
      var localTs  = parseInt(localStorage.getItem('pip_local_ts') || 0);
      // Applica solo se il server ha dati più nuovi (salvati esplicitamente da un altro dispositivo)
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

/**
 * Utilità di recovery per la console del browser.
 * Uso:
 *   pipRecovery.stato()          → mostra pronti/caricato attuali in localStorage
 *   pipRecovery.forzaRipristino() → scrive subito localStorage → server (bypass debounce)
 *   pipRecovery.reimpostaPronti({t_p:2, t_m:1, t_g:0, c_p:3, c_m:2, c_g:1})
 *              → imposta manualmente i pronti e li spinge al server
 */
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
    if (typeof URL_GOOGLE === 'undefined') { console.error('[pipRecovery] URL_GOOGLE non definita - sei sulla pagina giusta?'); return; }
    const payload = {
      azione:    'setPipData',
      qty:       _pipLoadQty(),
      caricato:  _pipLoadCaric(),
      pronti:    _pipLoadPronti(),
      movimenti: _pipLoadMov()
    };
    localStorage.setItem('pip_local_ts', Date.now());
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) })
      .then(r => r.json())
      .then(d => console.log('%c[pipRecovery] ✅ Ripristino inviato al server:', 'color:green', d))
      .catch(e => console.error('[pipRecovery] ❌ Errore:', e));
    console.log('[pipRecovery] Invio in corso...');
  },
  reimpostaPronti: function(obj) {
    // obj = { t_p, t_m, t_g, c_p, c_m, c_g }
    const campiValidi = ['t_p','t_m','t_g','c_p','c_m','c_g'];
    const nuovi = {};
    campiValidi.forEach(k => { nuovi[k] = parseInt(obj[k]) || 0; });
    console.log('[pipRecovery] Imposto pronti:', JSON.stringify(nuovi));
    _pipSavePronti(nuovi);
    _pipAggiornaUI_Pip && _pipAggiornaUI_Pip();
    console.log('%c[pipRecovery] ✅ Pronti impostati e push al server avviato', 'color:green');
  }
};

/**
 * Ricostruisce mlPipCaricato dai movimenti di carico/scarico/spedizione.
 * Usato per recuperare i dati quando il caricato risulta tutto 0
 * ma i movimenti contengono carichi registrati.
 */
function _pipRicostruisciDaMovimenti() {
  const movimenti = _pipLoadMov();
  if (!movimenti.length) return null;
  const caric = {};
  // Applico in ordine cronologico (il log è in ordine inverso: unshift)
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
  // Alimentatore unico
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
  // Aggiorna colore val senza ridisegnare tutto
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

function caricaPaginaPipistrello() {
  // Fetch dal server UNA SOLA VOLTA per apertura pagina.
  // _fetched rimane true finché non si cambia pagina (reset in cambiaPagina).
  if (!caricaPaginaPipistrello._fetched) {
    caricaPaginaPipistrello._fetched = true;
    _pipFetchFromServer(function(hasDati) {
      if (hasDati) caricaPaginaPipistrello(); // _fetched=true → non rifetcha
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

  // Opzioni materiale per il form movimenti
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
  requestAnimationFrame(_pipAsmPreview);
}

/** Calcola il rowspan per la colonna SEZIONE */
// Composizione BOM degli assemblati completi
// chiave: idx _PIP_BOM → qty per singolo assemblato
const _PIP_ASSEMB = {
  TESTA: {
    p: [[0,1],[3,1],[6,2],[8,8]],               // piccolo 500mA (no Wago)
    m: [[1,1],[4,1],[6,2],[7,2],[9,8]],           // medio 600mA
    g: [[2,1],[5,1],[6,2],[7,2],[9,4]]            // grande 700mA (Wago 2x)
  },
  CORDONE: {
    p: [[10,1],[11,1],[14,1],[15,2],[16,1],[18,1],[22,1]], // piccolo 500mA + Interrupt.500mA (alimentatore separato)
    m: [[10,1],[12,1],[14,1],[15,2],[17,1],[19,1],[23,1]], // medio 600mA + Interrupt.600mA
    g: [[10,1],[13,1],[14,1],[15,2],[17,1],[20,1],[24,1]]  // grande 700mA + Interrupt.700mA
  },
  ALIMENTATORE: {
    _: [[21,1]] // alimentatore unico (non differenziato per formato)
  }
};

/** Registra scarico di N assemblati salvando UN SOLO record 'assemb' con tutti i componenti */
/** Scarica tutti i pronti da spedire: scala la BOM per ogni voce > 0 e registra un unico movimento */
const _PIP_KEY_MAP = [
  {key:'t_p', tipo:'TESTA',        fmt:'p', tipoLabel:'Testa',        fmtLabel:'Piccolo', emoji:'🔩', mA:'500mA'},
  {key:'t_m', tipo:'TESTA',        fmt:'m', tipoLabel:'Testa',        fmtLabel:'Medio',   emoji:'🔩', mA:'600mA'},
  {key:'t_g', tipo:'TESTA',        fmt:'g', tipoLabel:'Testa',        fmtLabel:'Grande',  emoji:'🔩', mA:'700mA'},
  {key:'c_p', tipo:'CORDONE',      fmt:'p', tipoLabel:'Cordone',      fmtLabel:'Piccolo', emoji:'🔌', mA:'500mA'},
  {key:'c_m', tipo:'CORDONE',      fmt:'m', tipoLabel:'Cordone',      fmtLabel:'Medio',   emoji:'🔌', mA:'600mA'},
  {key:'c_g', tipo:'CORDONE',      fmt:'g', tipoLabel:'Cordone',      fmtLabel:'Grande',  emoji:'🔌', mA:'700mA'},
  {key:'a', tipo:'ALIMENTATORE', fmt:'_', tipoLabel:'Alimentatore', fmtLabel:'', emoji:'🔋', mA:''},
];

/** Apre il modal di selezione/conferma spedizione */
function _pipScaricoTuttiPronti() {
  const pronti = _pipLoadPronti();
  const items  = _PIP_KEY_MAP.filter(k => (pronti[k.key] || 0) > 0).map(k => ({ ...k, qty: pronti[k.key] }));

  if (!items.length) {
    notificaElegante('Nessun articolo da spedire — imposta le quantità prima ⚠️');
    return;
  }

  // Popola lista items con checkbox (tutti pre-selezionati)
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

    // Aggiorna warning ogni volta che una checkbox cambia
    listEl.querySelectorAll('.pip-sped-chk').forEach(chk =>
      chk.addEventListener('change', _pipAggiornaSpeWarning)
    );
  }

  _pipAggiornaSpeWarning();

  const modal = document.getElementById('modal-pip-spedizione');
  if (modal) {
    modal.style.display = 'flex';
    modal.offsetHeight; // force reflow
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
    // Almeno una categoria c'è ma non tutte e tre → avviso
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

  // Azzera solo le voci spedite, mantieni le altre
  const nuoviPronti = { ..._pipLoadPronti() };
  checked.forEach(k => { delete nuoviPronti[k]; });
  _pipSavePronti(nuoviPronti);

  // Nota: si svuota solo se sono stati spediti tutti
  const rimanenti = _PIP_KEY_MAP.filter(k => (nuoviPronti[k.key] || 0) > 0);
  if (!rimanenti.length) {
    const notaEl = document.getElementById('pip-spedizione-nota');
    if (notaEl) notaEl.value = '';
  }

  // Aggiorna celle BOM
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
  // Aggiorna badge liberi per questa riga
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
  if (typeof URL_GOOGLE === 'undefined') return;
  const btn   = document.getElementById('pip-save-btn');
  const label = document.getElementById('pip-save-label');
  if (!btn || !label) return;

  btn.disabled = true;
  btn.classList.remove('pip-save-ok', 'pip-save-err');
  btn.classList.add('pip-save-loading');
  label.textContent = 'Salvataggio…';

  const payload = {
    azione:    'setPipData',
    qty:       _pipLoadQty(),
    caricato:  _pipLoadCaric(),
    pronti:    _pipLoadPronti(),
    movimenti: _pipLoadMov()
  };

  fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) })
    .then(function(r) { return r.json(); })
    .then(function() {
      // Aggiorna timestamp locale: ora i dati del server coincidono con questi
      var nowTs = Date.now();
      try { localStorage.setItem('pip_local_ts', nowTs); } catch {}
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

  const idx = parseInt(idxEl.value);
  const qty = Math.max(1, parseInt(qtyEl.value) || 1);
  const nota = (notaEl?.value || '').trim();
  const mat = _PIP_BOM[idx]?.[1] || '?';

  // Aggiorna caricato
  const caric = _pipLoadCaric();
  if (tipo === 'carico') {
    caric[idx] = (Number(caric[idx] || 0)) + qty;
  } else {
    caric[idx] = Math.max(0, (Number(caric[idx] || 0)) - qty);
  }
  _pipSaveCaric(caric);

  // Aggiorna cella CARICATO e DA ORDINARE nella riga BOM
  const carInput = document.querySelector(`#pip-tbody input[data-idx="${idx}"]`);
  if (carInput) {
    carInput.value = caric[idx];
    _pipAggiornaCar(carInput);
  }

  // Aggiungi al log
  const movimenti = _pipLoadMov();
  movimenti.unshift({
    id: Date.now(),
    idx, tipo, qty, nota, mat,
    ts: new Date().toLocaleString('it-IT', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'})
  });
  _pipSaveMov(movimenti);

  // Resetta form
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
  // Mostra modal conferma invece di window.confirm
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
    // Il reso aveva AGGIUNTO i componenti recuperati → eliminar il reso li SOTTRAE
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
      // Riga espandibile per spedizione (accorpamento pronti)
      const totPz = (m.items || []).reduce((s, i) => s + i.qty, 0);
      // Raggruppa per mA e costruisce "500mA ×2 · 600mA ×1"
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
      // Riga espandibile per scarico assemblato (vecchio formato)
      const emoji  = m.assembTipo === 'Testa' ? '🔩' : '🔌';
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

    // Movimento singolo standard
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
  // Apri modal con campi pre-compilati
  const modal = document.getElementById('modal-pip-edit-mov');
  if (!modal) return;
  const matEl  = document.getElementById('pip-edit-mov-mat');
  const qtyEl  = document.getElementById('pip-edit-mov-qty');
  const notaEl = document.getElementById('pip-edit-mov-nota');
  if (matEl)  matEl.innerHTML  = `<span class="pip-mov-badge ${mov.tipo}" style="font-size:0.75rem">${mov.tipo === 'carico' ? 'CARICO' : 'SCARICO'}</span> <strong>${mov.mat}</strong>`;
  if (qtyEl)  { qtyEl.value  = mov.qty; }
  if (notaEl) { notaEl.value = mov.nota || ''; }
  // Salva l'id per usarlo alla conferma
  modal.dataset.movId = id;
  modal.style.display = 'flex';
  modal.offsetHeight;
  modal.classList.add('active');
  // Focus sul campo nota
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
    const diff = newQty - mov.qty;
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

/** Toggle visibilità corpo sezione movimenti */
// ─── GESTIONE RESI ────────────────────────────────────────────────────────────

const _PIP_RESO_ITEMS = [
  {key:'t_p', tipo:'TESTA',        fmt:'p', label:'Testa Piccola',   emoji:'🔩', mA:'500mA'},
  {key:'t_m', tipo:'TESTA',        fmt:'m', label:'Testa Media',     emoji:'🔩', mA:'600mA'},
  {key:'t_g', tipo:'TESTA',        fmt:'g', label:'Testa Grande',    emoji:'🔩', mA:'700mA'},
  {key:'c_p', tipo:'CORDONE',      fmt:'p', label:'Cordone Piccolo', emoji:'🔌', mA:'500mA'},
  {key:'c_m', tipo:'CORDONE',      fmt:'m', label:'Cordone Medio',   emoji:'🔌', mA:'600mA'},
  {key:'c_g', tipo:'CORDONE',      fmt:'g', label:'Cordone Grande',  emoji:'🔌', mA:'700mA'},
  {key:'a',   tipo:'ALIMENTATORE', fmt:'_', label:'Alimentatore',    emoji:'🔋', mA:''},
];

function _pipApriModalReso() {
  const modal = document.getElementById('modal-pip-reso');
  if (!modal) return;
  // Reset tutte le qty a 0
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
  // Somma componenti per tutti gli item selezionati
  const totComp = {}; // { idx: qty }
  _PIP_RESO_ITEMS.forEach(it => {
    const n = parseInt(document.getElementById('pip-reso-qty-' + it.key)?.value) || 0;
    if (!n) return;
    const bom = _PIP_ASSEMB[it.tipo]?.[it.fmt] || [];
    bom.forEach(([idx, coeff]) => {
      totComp[idx] = (totComp[idx] || 0) + n * coeff;
    });
    // Alimentatore separato (tracked via key 'a')
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
  // Raccoglie item rientrati
  const items = [];
  _PIP_RESO_ITEMS.forEach(it => {
    const n = parseInt(document.getElementById('pip-reso-qty-' + it.key)?.value) || 0;
    if (n > 0) items.push({ ...it, qty: n });
  });
  if (!items.length) { notificaElegante('Inserisci almeno un articolo rientrato ⚠️'); return; }

  // Raccoglie componenti da recuperare (checked) e da scartare (unchecked)
  const righe    = []; // recuperati → tornano in magazzino
  const scartate = []; // scartati  → non tornano
  document.querySelectorAll('.pip-reso-bom-chk').forEach(chk => {
    const idx = parseInt(chk.dataset.idx);
    const qty = parseInt(chk.dataset.qty);
    const mat = _PIP_BOM[idx]?.[1] || '?';
    if (chk.checked) righe.push({ idx, mat, qty });
    else             scartate.push({ idx, mat, qty });
  });

  const nota = (document.getElementById('pip-reso-nota')?.value || '').trim();

  // Aggiungi al caricato solo i componenti recuperati
  const caric = _pipLoadCaric();
  righe.forEach(r => {
    caric[r.idx] = (Number(caric[r.idx] || 0)) + r.qty;
  });
  _pipSaveCaric(caric);

  // Aggiorna DOM
  righe.forEach(r => {
    const inp = document.querySelector(`#pip-tbody input[data-idx="${r.idx}"]`);
    if (inp) { inp.value = caric[r.idx]; _pipAggiornaCar(inp); }
  });

  // Registra movimento
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

// ─── FINE GESTIONE RESI ───────────────────────────────────────────────────────

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
  caricaPaginaPipistrello();
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
                style="margin-top:12px;padding:8px 20px;background:#242424;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`;
    }, 12000);

    try {
        // Usa il bundle già fetchato al boot (o attende la Promise in volo)
        // così GAS viene chiamato UNA SOLA VOLTA invece di due volte in parallelo
        let _dashBundle = null;
        if (window._prefetchDashBundle) {
            _dashBundle = window._prefetchDashBundle;
            window._prefetchDashBundle = null;
            window._prefetchDashPromise = null;
        } else if (window._prefetchDashPromise) {
            _dashBundle = await window._prefetchDashPromise;
            window._prefetchDashBundle = null;
            window._prefetchDashPromise = null;
        } else {
            const _dashResp = await fetch(URL_GOOGLE + '?azione=getAllDashboard', signal ? { signal } : {});
            if (!_dashResp.ok) throw new Error(`HTTP ${_dashResp.status}`);
            _dashBundle = await _dashResp.json();
        }
        if (!_dashBundle) throw new Error('bundle vuoto');
        const [datiProd, datiArch] = [_dashBundle.produzione || [], _dashBundle.archivio || []];
        if (retryTimer) clearTimeout(retryTimer);

        if (paginaAttuale !== nomeFoglio) return;
        if (expectedRequestId !== null && expectedRequestId !== _latestNavRequest) return;

        // --- OVERVIEW STATI ---
        const attivi = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
        _attiviProd = attivi;
        const STATI_OV = _getOvStatiAll();
        const numInFocus = attivi.filter(r => STATI_OV.includes((r.stato||'').toUpperCase().trim())).length;

        // --- SEZIONE ATTIVA ---
        let htmlAttivi = generaBloccoOrdiniUnificato(datiProd, false);

        // --- SEZIONE ARCHIVIATA ---
        let htmlArchiviati = generaBloccoOrdiniUnificato(datiArch, true);

        const isMobileOv = window.innerWidth <= 600;
        const ovContent = isMobileOv
            ? '<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>'
            : _buildOverviewInnerHtml(attivi);

        // Snapshot accordions aperti prima di sostituire il DOM (preserva stato UI)
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
        _lsCacheSet('_html_' + nomeFoglio, contenitore.innerHTML); // cache cross-session

        // Pre-popola la cache ARCHIVIO_ORDINI come side effect (ARCHIVIO è incluso nel bundle)
        if (!cacheContenuti['ARCHIVIO_ORDINI']) {
            const _archSideHtml = generaBloccoOrdiniUnificato(datiArch, true) || "<div class='empty-msg'>L'archivio \u00e8 vuoto.</div>";
            cacheContenuti['ARCHIVIO_ORDINI'] = _archSideHtml;
            cacheFetchTime['ARCHIVIO_ORDINI'] = Date.now();
            _lsCacheSet('_html_ARCHIVIO_ORDINI', _archSideHtml);
        }

        applicaFade(contenitore);

        // Ripristina accordion aperti dopo background update (preserva stato UI)
        if (isBackgroundUpdate && _openOrdini.size) {
            contenitore.querySelectorAll('.ordine-wrapper').forEach(w => {
                if (_openOrdini.has(w.dataset.ordine)) {
                    const riga = w.querySelector('.riga-ordine');
                    const det  = w.querySelector('.dettagli-container');
                    if (riga && det) { riga.classList.add('open'); det.style.display = 'block'; }
                }
            });
        }

        aggiornaListaFiltrabili();
        // Observer: apri archivio quando ci si scorre sopra
        _osservaArchivio('archivio-prod-details');
        // Attiva drag & drop kanban (solo desktop)
        requestAnimationFrame(_initKanbanDnd);
        // Riapri automaticamente il blocco qty_evasa per le righe già valorizzate
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
        // Avvia (o riavvia) il polling live degli stati
        _startPollingProduzione();

        // Salva raw data per autocomplete del modal
        _ordiniAutocompleteCache = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE').map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '', riferimento: r.riferimento || '' }));
        // Deduplication by ordine
        const seen = new Set();
        _ordiniAutocompleteCache = _ordiniAutocompleteCache.filter(o => { if (seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });

    } catch (e) {
        if (retryTimer) clearTimeout(retryTimer);
        if (e.name === 'AbortError') return; // navigazione annullata, fetch interrotto
        console.error("Errore Dashboard:", e);
        contenitore.innerHTML = `<div class='inline-error'>Errore nel caricamento dati.
            <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                &#x21bb; Riprova</button></div>`;
        applicaFade(contenitore);
    }
}

/**
 * Pagina Archivio Ordini — carica solo la sezione archivio usando il bundle dashboard
 * (i dati sono già in cache GAS, risposta in < 300ms se il runtime è caldo).
 */
async function caricaArchivio() {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    contenitore.innerHTML = "<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento archivio...</div>";
    try {
        let _aBundle = null;
        if (window._prefetchDashBundle) {
            _aBundle = window._prefetchDashBundle;
            window._prefetchDashBundle = null;
            window._prefetchDashPromise = null;
        } else if (window._prefetchDashPromise) {
            _aBundle = await window._prefetchDashPromise;
            window._prefetchDashBundle = null;
            window._prefetchDashPromise = null;
        } else {
            const _aResp = await fetch(URL_GOOGLE + '?azione=getAllDashboard');
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
        aggiornaListaFiltrabili();
    } catch(e) {
        if (e.name === 'AbortError') return;
        contenitore.innerHTML = `<div class='inline-error'>Errore archivio.
            <button onclick="cambiaPagina('ARCHIVIO_ORDINI', null)"
               style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
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
    // ── Ordina alfabeticamente per nome cliente (con fallback su riferimento → numero ordine) ──
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

        // Zona operatori nell'header (solo ordini attivi)
        let _opZoneOrd = '';
        if (!isArchivio) {
            if (_isUtenteEsente()) {
                const _allAss = [...new Set(
                    righe.flatMap(r => (r.assegna && r.assegna !== '' && r.assegna !== 'undefined')
                        ? r.assegna.split(',').map(n => _normNome(n.trim())).filter(Boolean) : [])
                )];
                const _lblOrd = _allAss.length ? _allAss.map(_normNome).join(', ') : 'Libero';
                const _opOptsOrd = listaOperatori.map(op => {
                    const _sel = _allAss.some(a => a.toUpperCase() === _normNome(op.nome).toUpperCase());
                    const _col = _getOpColor(op.nome.trim());
                    const _ns  = op.nome.trim().replace(/'/g, "\\'");
                    const _nOrdS = nOrd.replace(/'/g, "\\'");
                    return `<button type="button" class="op-option${_sel ? ' is-selected' : ''}" onclick="selezionaOpAssegnaOrdine(this,'${_nOrdS}','${_ns}')"><span class="op-opt-dot" style="background:${_col}"></span><span>${_normNome(op.nome)}</span>${_sel ? '<i class="fas fa-check op-check-icon"></i>' : ''}</button>`;
                }).join('');
                _opZoneOrd = `<div class="op-dropdown op-dropdown-ord" data-nord="${nOrd}" data-assegna-ord="${_allAss.join(',').replace(/"/g,'&quot;')}"><button type="button" class="op-trigger op-trigger-ord" onclick="event.stopPropagation(); toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${_lblOrd}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${_opOptsOrd}</div></div>`;
            } else {
                const _mioN = (utenteAttuale?.nome || '').toUpperCase().trim();
                const _giaSonoOrd = righe.some(r => r.assegna && r.assegna.split(',').some(n => n.trim().toUpperCase() === _mioN));
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
        if (!isArchivio && _isUtenteEsente()) {
            const _statiBulk = righe
                .map(r => String(r.stato || 'IN ATTESA').toUpperCase().trim())
                .filter((s, i, arr) => arr.indexOf(s) === i); // unique
            const _statoBulkLbl = _statiBulk.length === 1 ? _statiBulk[0] : `${_statiBulk.length} Stati`;
            const _configStato = listaStati.find(s => s.nome === _statiBulk[0]) || {colore: "#e2e8f0"};
            const _statoOptsOrd = listaStati.map(st => {
                const _nOrdS = nOrd.replace(/'/g, "\\'");
                return `<button type="button" class="stato-option" onclick="event.stopPropagation(); selezionaStatoOrdine(this,'${_nOrdS}','${st.nome}','${st.colore}')"><span class="stato-opt-dot" style="background:${st.colore}"></span><span>${st.nome}</span></button>`;
            }).join('');
            _statoZoneOrd = `<div class="stato-dropdown stato-dropdown-ord" data-nord="${nOrd}"><button type="button" class="stato-trigger" onclick="event.stopPropagation(); toggleStatoDropdown(this)" title="Cambia stato tutte righe"><span class="stato-dot" style="background:${_configStato.colore}"></span><span class="stato-label-txt">${_statoBulkLbl}</span><i class="fas fa-chevron-down stato-chevron"></i></button><div class="stato-popup">${_statoOptsOrd}</div></div>`;
            console.log(`[Stato Dropdown] Ordine ${nOrd}: visibile per ${utenteAttuale?.nome}, stati=${_statiBulk.join(',')}`);
        } else if (isArchivio || !_isUtenteEsente()) {
            console.log(`[Stato Dropdown] Ordine ${nOrd}: NASCOSTO (isArchivio=${isArchivio}, esente=${_isUtenteEsente()})`);
        }

        // Azioni disponibili per questo ordine (active variant)
        const _aChiedi   = `apriModalAiuto('${_idRiga0}', 'INTERO ORDINE', '${_nOrdEsc}', '${_cliEsc}')`;
        const _aArchivia = `gestisciArchiviazione('${_nOrdEsc}')`;
        const _aSollecit = `apriModalSollecito('','${_nOrdEsc}','${_cliEsc}','Intero Ordine')`;
        const _aRiprist  = `gestisciRipristino('${_nOrdEsc}', 'ORDINE')`;

        // Costruisce la lista di voci del menu per questo ordine
        let _menuVoci = '';
        if (isArchivio) {
            _menuVoci = `<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aRiprist}"><i class="fa-solid fa-rotate-left"></i> Ripristina</button>`;
        } else {
            _menuVoci += `<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aChiedi}"><i class="fa-regular fa-envelope"></i> Chiedi</button>`;
            if (_isUtenteEsente()) {
                _menuVoci += `<button class="ord-menu-item ord-menu-item--danger" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aArchivia}"><i class="fa-solid fa-box-archive"></i> Archivia</button>`;
            }
            if (_isCommerciale() || _isUtenteEsente()) {
                _menuVoci += `<button class="ord-menu-item ord-menu-item--warn" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${_aSollecit}"><i class="fa-solid fa-calendar-alt"></i> Scadenza</button>`;
            }
        }

        // Dropdowns + menu hamburger (sempre visibile, anche desktop)
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
                    <span class="order-title" style="--order-color:${colorCliente}" title="${cliente}">${cliente} ${htmlRiferimento}</span>
                </div>
                <div class="order-info">
                    <div class="badge-count ${TW.pill}" title="ORD.${nOrd}"><span class="badge-ord-num">ORD.${nOrdBadge}</span><span class="badge-sep">·</span>${righe.length} ART.</div>
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
    const statoAttuale = (art.stato || "IN ATTESA").toUpperCase();
    const configStato = listaStati.find(s => s.nome === statoAttuale) || {colore: "#e2e8f0"};
    const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";

    // Zona operatori: dropdown completo per MASTER, badge+Assegnami per operatori
    // Normalizza sempre i nomi al parse (es. "Fabio" → "Fabio T.") così tutti i confronti downstream funzionano
    const _assegnatiCard = (art.assegna && art.assegna !== '' && art.assegna !== 'undefined')
        ? art.assegna.split(',').map(n => _normNome(n.trim())).filter(Boolean) : [];
    let opZoneCard;
    if (_isUtenteEsente()) {
        const _lbl = _assegnatiCard.length ? _assegnatiCard.map(_normNome).join(', ') : 'Libero';
        const _opts = listaOperatori.map(op => {
            const _sel = _assegnatiCard.some(a => a.toUpperCase() === _normNome(op.nome).toUpperCase());
            const _col = _getOpColor(op.nome.trim());
            const _ns  = op.nome.trim().replace(/'/g, "\\'");
            return `<button type="button" class="op-option${_sel ? ' is-selected' : ''}" onclick="selezionaOpAssegna(this,'${art.id_riga}','${nOrd}','${_ns}')"><span class="op-opt-dot" style="background:${_col}"></span><span>${_normNome(op.nome)}</span>${_sel ? '<i class="fas fa-check op-check-icon"></i>' : ''}</button>`;
        }).join('');
        const _mioMasterNorm = _normNome(utenteAttuale?.nome||'').toUpperCase().trim();
        opZoneCard = `<div class="op-dropdown" data-id-riga="${art.id_riga}" data-assegna="${(art.assegna||'').replace(/"/g,'&quot;')}" data-nord="${nOrd}"><button type="button" class="op-trigger" onclick="toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${_lbl}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${_opts}</div></div>${!_assegnatiCard.some(n => n.toUpperCase() === _mioMasterNorm) ? `<button class="btn-assegnami" onclick="autoAssegnami('${art.id_riga}','${nOrd}',this)" title="Assegnami"><i class="fas fa-user-plus"></i></button>` : ''}`;
    } else {
        const _mio = _normNome(utenteAttuale?.nome || '').toUpperCase().trim();
        const _bdg = _assegnatiCard.map(n => {
            const _col = _getOpColor(n); const _ns = n.replace(/'/g, "\\'");
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
            <span class="label-sm ${TW.label}">Quantità</span>
            <div class="qty-row">
                <b class="${TW.value} qty-totale">${art.qty}</b>
                <button class="btn-qty-evasa-toggle" title="Imposta quantità evasa" onclick="toggleQtyEvasa(this, '${art.id_riga}', ${parseFloat(art.qty)||0})" aria-label="Quantità parziale">
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
                                : '—'
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
                    ${listaStati.map(s => `<button type="button" class="stato-option${s.nome === statoAttuale ? ' is-selected' : ''}" onclick="selezionaStato(this, '${art.id_riga}', '${s.colore}')"><span class="stato-opt-dot" style="background:${s.colore}"></span><span>${s.nome}</span>${s.nome === statoAttuale ? '<i class="fas fa-check stato-check-icon"></i>' : ''}</button>`).join('')}
                </div>
            </div>
        </div>
        <div>
            <span class="label-sm ${TW.label}">Operatore/i Assegnati</span>
            ${opZoneCard}
        </div>
        <div class="order-info-col">
            <button class="btn-chiedi-assegna ${TW.btnPrimary}" onclick="apriModalAiuto('${art.id_riga}', '${codicePrincipale}', '${nOrd}', '${(cliente||'').replace(/'/g,"\\'")}')">\n                <i class="fa-regular fa-envelope"></i> Chiedi\n            </button>\n            ${(_isCommerciale() || _isUtenteEsente()) ? `<button class="btn-sollecita" onclick="apriModalSollecito('${art.id_riga}','${nOrd}','${(cliente||'').replace(/'/g,"\\'")  }','${codicePrincipale.replace(/'/g,"\\'")  }')"><i class="fa-solid fa-calendar-alt"></i> Scadenza</button>` : ''}\n        </div>
    </div>`;
}
/* ---- MODAL SOLLECITO (COMMERCIALE) ---- */
function apriModalSollecito(idRiga, nOrd, cliente, rifArt) {
    const modal = document.getElementById('modalSollecito');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    document.getElementById('sollecito-titolo').textContent =
        (rifArt && rifArt !== 'Intero Ordine') ? `Sollecita – ${rifArt}` : `Sollecita – Ord. ${nOrd}`;
    document.getElementById('sollecito-id-riga').value = idRiga || '';
    document.getElementById('sollecito-nord').value    = nOrd;
    document.getElementById('sollecito-cliente').value = cliente || '';
    document.getElementById('sollecito-rif').value     = rifArt  || '';
    document.getElementById('sollecito-data').value    = '';
    document.getElementById('sollecito-note').value    = '';
}
function chiudiModalSollecito() {
    const modal = document.getElementById('modalSollecito');
    modal.style.display = '';
    modal.classList.remove('active');
}
async function confermaInvioSollecito() {
    const nOrd    = document.getElementById('sollecito-nord').value;
    const idRiga  = document.getElementById('sollecito-id-riga').value;
    const cliente = document.getElementById('sollecito-cliente').value;
    const rifArt  = document.getElementById('sollecito-rif').value;
    const data    = document.getElementById('sollecito-data').value;
    const note    = document.getElementById('sollecito-note').value.trim();
    if (!data) { notificaElegante('Seleziona una data di scadenza.', 'error'); return; }
    chiudiModalSollecito();
    delete cacheContenuti['STORICO_RICHIESTE']; delete cacheFetchTime['STORICO_RICHIESTE'];
    _lsCacheDel('_html_STORICO_RICHIESTE');
    window._prefetchRqBundle = null; window._prefetchRqPromise = null;
    const payload = {
        azione: 'supporto_multiplo',
        n_ordine: nOrd,
        cliente:  cliente,
        prodotto: rifArt && rifArt !== 'Intero Ordine' ? rifArt : '',
        tipo:     'SCADENZA',
        messaggio: `SCAD:${data}|${note || '—'}`,
        mittente:  utenteAttuale.nome.toUpperCase().trim(),
        destinatari: ['ALESSIO']
    };
    try {
        await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) });
        notificaElegante('✅ Scadenza aggiunta');
        // Se siamo sulla pagina richieste, ricarica per mostrare la card in Scadenze
        if (paginaAttuale === 'STORICO_RICHIESTE') caricaPaginaRichieste();
    } catch { notificaElegante('✅ Scadenza aggiunta'); }
}
/* ---- FINE MODAL SOLLECITO ---- */

/* ---- RIMOZIONE OPERATORE DALLA CARD ---- */
async function rimuoviOperatore(idRiga, nOrd, nomeOperatore) {
    const container = document.querySelector(`.visualizza-operatori[data-id-riga="${idRiga}"]`);
    if (!container) return;

    const _normOp = _normNome(nomeOperatore);
    const assegnaCorrente = container.dataset.assegna || '';
    const restanti = assegnaCorrente.split(',')
        .map(o => _normNome(o.trim()))
        .filter(o => o && o.toUpperCase() !== _normOp.toUpperCase())
        .join(',');

    // Aggiorna subito il DOM (ottimistico)
    container.dataset.assegna = restanti;
    if (!restanti) {
        container.innerHTML = `<span class="operatore-libero">Libero</span>`;
    } else {
        const _mioR = _normNome(utenteAttuale?.nome || '').toUpperCase().trim();
        container.innerHTML = restanti.split(',').map(op => {
            const nome = _normNome(op.trim());
            const col  = _getOpColor(nome);
            const nomeSafe = nome.replace(/'/g, "\\'");
            const xBtn = nome.toUpperCase() === _mioR ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${idRiga}','${nOrd}','${nomeSafe}')" title="Rimuovi assegnazione">&times;</button>` : '';
            return `<span class="badge-operatore" data-nome="${nome}" style="background:${col};border-color:${col}">${nome}${xBtn}</span>`;
        }).join('');
    }

    // Chiama il backend in background (il DOM è già aggiornato)
    const mittente = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase().trim() : '';
    const url = `${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(restanti)}&id_riga=${idRiga}&mittente=${encodeURIComponent(mittente)}`;
    fetch(url).catch(e => console.error('Errore rimozione operatore', e));
}

/* ---- OPERATORE DROPDOWN ---- */
function toggleOpDropdown(btn) {
    const dropdown = btn.closest('.op-dropdown');
    const itemCard  = btn.closest('.item-card');
    const rigaOrd   = btn.closest('.riga-ordine');
    const isOpen = dropdown.classList.contains('open');
    // chiudi tutti gli altri e rimuovi le classi di elevazione
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
    const itemCard  = btn.closest('.item-card');
    const rigaOrd   = btn.closest('.riga-ordine');
    const isOpen = dropdown.classList.contains('open');
    // chiudi tutti gli altri stato-dropdown
    document.querySelectorAll('.stato-dropdown.open').forEach(d => {
        d.classList.remove('open');
        const c = d.closest('.item-card');    if (c) c.classList.remove('stato-aperto');
        const r = d.closest('.riga-ordine'); if (r) r.classList.remove('stato-aperto-ord');
    });
    if (!isOpen) {
        dropdown.classList.add('open');
        if (itemCard) itemCard.classList.add('stato-aperto');
        if (rigaOrd)  rigaOrd.classList.add('stato-aperto-ord');
    }
}

// ── Menu azioni mobile (tre puntini) ─────────────────────────────────────────
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

// Chiude menu azioni se si clicca fuori
document.addEventListener('click', function(e) {
    if (!e.target.closest('.ord-azioni-menu')) chiudiTuttiMenuAzioni();
});

// MASTER: toggle un operatore su una singola riga articolo
function selezionaOpAssegna(optBtn, idRiga, nOrd, nomeOp) {
    const dropdown = optBtn.closest('.op-dropdown');
    const assegnaCorrente = dropdown.dataset.assegna || '';
    const correnti = assegnaCorrente.split(',').map(n => _normNome(n.trim())).filter(Boolean);
    const nomeOpNorm = _normNome(nomeOp);
    const idx = correnti.findIndex(n => n.toUpperCase() === nomeOpNorm.toUpperCase());
    if (idx >= 0) correnti.splice(idx, 1); else correnti.push(nomeOpNorm);
    const nuovaAssegna = correnti.join(',');

    // aggiorna DOM del dropdown
    dropdown.dataset.assegna = nuovaAssegna;
    const lbl = correnti.length ? correnti.map(_normNome).join(', ') : 'Libero';
    dropdown.querySelector('.op-trigger-label').textContent = lbl;
    optBtn.classList.toggle('is-selected', idx < 0);
    let check = optBtn.querySelector('.op-check-icon');
    if (idx < 0) {
        if (!check) { check = document.createElement('i'); check.className = 'fas fa-check op-check-icon'; optBtn.appendChild(check); }
    } else {
        if (check) check.remove();
    }

    // backend
    const mitt = (utenteAttuale?.nome || '').toUpperCase().trim();
    fetch(`${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(nuovaAssegna)}&id_riga=${idRiga}&mittente=${encodeURIComponent(mitt)}`).catch(() => {});
}

// MASTER: toggle un operatore su TUTTE le righe di un ordine
function selezionaOpAssegnaOrdine(optBtn, nOrd, nomeOp) {
    const dropdown = optBtn.closest('.op-dropdown');
    const assegnaCorrente = dropdown.dataset.assegnaOrd || '';
    const correnti = assegnaCorrente.split(',').map(n => _normNome(n.trim())).filter(Boolean);
    const nomeOpNorm = _normNome(nomeOp);
    const idx = correnti.findIndex(n => n.toUpperCase() === nomeOpNorm.toUpperCase());
    if (idx >= 0) correnti.splice(idx, 1); else correnti.push(nomeOpNorm);
    const nuovaAssegna = correnti.join(',');

    // aggiorna DOM header
    dropdown.dataset.assegnaOrd = nuovaAssegna;
    const lbl = correnti.length ? correnti.map(_normNome).join(', ') : 'Libero';
    dropdown.querySelector('.op-trigger-label').textContent = lbl;
    optBtn.classList.toggle('is-selected', idx < 0);
    let check = optBtn.querySelector('.op-check-icon');
    if (idx < 0) {
        if (!check) { check = document.createElement('i'); check.className = 'fas fa-check op-check-icon'; optBtn.appendChild(check); }
    } else {
        if (check) check.remove();
    }

    // aggiorna anche i dropdown delle singole card dentro questo ordine
    const wrapper = dropdown.closest('.ordine-wrapper');
    if (wrapper) {
        wrapper.querySelectorAll('.op-dropdown[data-id-riga]').forEach(d => {
            const curr = (d.dataset.assegna || '').split(',').map(n => _normNome(n.trim())).filter(Boolean);
            const i2 = curr.findIndex(n => n.toUpperCase() === nomeOpNorm.toUpperCase());
            if (idx >= 0 && i2 >= 0) curr.splice(i2, 1);
            else if (idx < 0 && i2 < 0)  curr.push(nomeOpNorm);
            d.dataset.assegna = curr.join(',');
            const l2 = curr.length ? curr.map(_normNome).join(', ') : 'Libero';
            const lbl2 = d.querySelector('.op-trigger-label'); if (lbl2) lbl2.textContent = l2;
            // aggiorna is-selected nelle opzioni
            d.querySelectorAll('.op-option').forEach(o => {
                const nn = o.querySelector('span:not(.op-opt-dot)')?.textContent.trim() || '';
                const isNow = curr.some(c => _normNome(c) === nn);
                o.classList.toggle('is-selected', isNow);
                let ck = o.querySelector('.op-check-icon');
                if (isNow && !ck) { ck = document.createElement('i'); ck.className='fas fa-check op-check-icon'; o.appendChild(ck); }
                else if (!isNow && ck) ck.remove();
            });
        });
    }

    // backend — senza id_riga → aggiorna tutte le righe dell'ordine
    const mitt = (utenteAttuale?.nome || '').toUpperCase().trim();
    fetch(`${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(nuovaAssegna)}&mittente=${encodeURIComponent(mitt)}`).catch(() => {});
}

// OPERATORE: si autoassegna a una singola riga
function autoAssegnami(idRiga, nOrd, btnEl) {
    const mio = _normNome((utenteAttuale?.nome || '').trim()); // normalizza: "Fabio" → "Fabio T."
    if (!mio) return;
    const container = document.querySelector(`.visualizza-operatori[data-id-riga="${idRiga}"]`);
    if (!container) return;
    const correnti = (container.dataset.assegna || '').split(',').map(n => _normNome(n.trim())).filter(Boolean);
    if (correnti.some(n => n.toUpperCase() === mio.toUpperCase())) return;
    correnti.push(mio);
    const nuova = correnti.join(',');
    container.dataset.assegna = nuova;
    // ridisegna badge (× solo per sé)
    const _mioUp = mio.toUpperCase();
    container.innerHTML = correnti.map(n => {
        const col = _getOpColor(n); const ns = n.replace(/'/g, "\\'");
        const xBtn = n.toUpperCase() === _mioUp ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${idRiga}','${nOrd}','${ns}')" title="Rimuovi assegnazione">&times;</button>` : '';
        return `<span class="badge-operatore" data-nome="${n}" style="background:${col};border-color:${col}">${n}${xBtn}</span>`;
    }).join('');
    // rimuovi pulsante Assegnami
    if (btnEl && btnEl.parentNode) btnEl.remove();
    // backend
    const mitt = mio.toUpperCase().trim();
    fetch(`${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(nuova)}&id_riga=${idRiga}&mittente=${encodeURIComponent(mitt)}`).catch(() => {});
}

// OPERATORE: si autoassegna a TUTTE le righe di un ordine
function autoAssegnamiOrdine(nOrd) {
    const mio = _normNome((utenteAttuale?.nome || '').trim()); // normalizza: "Fabio" → "Fabio T."
    if (!mio) return;
    const mitt = mio.toUpperCase().trim();
    const wrapper = document.querySelector(`.ordine-wrapper[data-ordine="${nOrd}"]`);
    if (wrapper) {
        wrapper.querySelectorAll('.visualizza-operatori[data-id-riga]').forEach(cont => {
            const curr = (cont.dataset.assegna || '').split(',').map(n => _normNome(n.trim())).filter(Boolean);
            if (curr.some(n => n.toUpperCase() === mitt)) return;
            curr.push(mio);
            cont.dataset.assegna = curr.join(',');
            const _mioUp = mio.toUpperCase();
            cont.innerHTML = curr.map(n => {
                const col = _getOpColor(n); const idR = cont.dataset.idRiga; const ns = n.replace(/'/g,"\\'");
                const xBtn = n.toUpperCase() === _mioUp ? `<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${idR}','${nOrd}','${ns}')" title="Rimuovi assegnazione">&times;</button>` : '';
                return `<span class="badge-operatore" data-nome="${n}" style="background:${col};border-color:${col}">${n}${xBtn}</span>`;
            }).join('');
        });
        // rimuovi pulsante Assegnami header
        const btnOrd = wrapper.querySelector('.btn-assegnami-ord');
        if (btnOrd) btnOrd.remove();
    }
    fetch(`${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(mio)}&mittente=${encodeURIComponent(mitt)}`).catch(() => {});
}

// chiudi op-dropdown cliccando fuori
document.addEventListener('click', function(e) {
    if (!e.target.closest('.op-dropdown')) {
        document.querySelectorAll('.op-dropdown.open').forEach(d => {
            d.classList.remove('open');
            const c = d.closest('.item-card');    if (c) c.classList.remove('op-aperto');
            const r = d.closest('.riga-ordine'); if (r) r.classList.remove('op-aperto-ord');
        });
    }
}, true);
/* ---- FINE OPERATORE DROPDOWN ---- */

/* ---- STATO DROPDOWN CUSTOM ---- */
function toggleStatoDropdown(btn) {
    const dropdown = btn.closest('.stato-dropdown');
    const itemCard = btn.closest('.item-card');
    const rigaOrd  = btn.closest('.riga-ordine');
    const isOpen = dropdown.classList.contains('open');
    // chiudi tutti gli altri e togli la classe di elevazione
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
    // salva in background – skipForceSync=true: DOM già aggiornato ottimisticamente
    aggiornaDato(null, idRiga, 'stato', nuovoStato, true);
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
/* ---- FINE STATO DROPDOWN CUSTOM ---- */

/** Cambia lo stato di TUTTE le righe di un ordine e sincronizza */
function selezionaStatoOrdine(optBtn, nOrdine, nuovoStato, nuovoColore) {
    event.stopPropagation();
    const dropdown = optBtn.closest('.stato-dropdown-ord');
    if (!dropdown) return;

    const trigger = dropdown.querySelector('.stato-trigger');
    const labelEl = trigger ? trigger.querySelector('.stato-label-txt') : null;
    const dot     = trigger ? trigger.querySelector('.stato-dot') : null;

    // Aggiorna label e dot del trigger immediatamente
    if (labelEl) labelEl.textContent = nuovoStato;
    if (dot && nuovoColore) dot.style.background = nuovoColore;

    // Chiudi dropdown
    dropdown.classList.remove('open');
    const rigaOrd = dropdown.closest('.riga-ordine');
    if (rigaOrd) rigaOrd.classList.remove('stato-aperto-ord');

    notificaElegante(`⏳ Aggiornamento stato ordine ${nOrdine}...`, 'info');

    // Cambia stato su TUTTE le righe dell'ordine in parallelo (skipForceSync=true)
    (async () => {
        try {
            const wrapper = document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(nOrdine)}"]`);
            if (!wrapper) return;

            const righe = Array.from(wrapper.querySelectorAll('[data-id-riga]')).map(el => el.dataset.idRiga);

            const risultati = await Promise.all(
                righe.map(idRiga => aggiornaDato(null, idRiga, 'stato', nuovoStato, true))
            );
            const successi = risultati.filter(Boolean).length;

            if (successi === righe.length) {
                notificaElegante(`✓ Ordine ${nOrdine} aggiornato a ${nuovoStato}`, 'success');
            } else {
                notificaElegante(`⚠ ${successi}/${righe.length} righe aggiornate`, 'warning');
            }

            // Aggiorna cache _attiviProd per tutte le righe dell'ordine
            if (_attiviProd) {
                righe.forEach(idRiga => {
                    const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
                    if (r) r.stato = nuovoStato;
                });
            }
        } catch (err) {
            notificaElegante('✗ Errore aggiornamento ordine', 'error');
            console.error('Errore selezionaStatoOrdine:', err);
        }
    })();
}

function toggleAccordion(elemento) {
    elemento.classList.toggle('open');
    const container = elemento.nextElementSibling;
    container.style.display = elemento.classList.contains('open') ? 'block' : 'none';
}
async function aggiornaDato(selectEl, idRiga, campo, nuovoValore, skipForceSync = false) {
    // Feedback visivo immediato sull'elemento
    if (selectEl) selectEl.style.opacity = '0.5';
    try {
        const res = await fetch(URL_GOOGLE, {
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
        const r = await res.json();
        if (r && r.status === 'auth_error') {
            _gestisciAuthError_(r.message);
            return false;
        }
        if (r && r.status !== 'success') {
            console.warn('Backend response:', r);
            notificaElegante('⚠️ Cambio non salvato. Riprova.', 'warning');
            return false;
        }
        // ✓ Salvataggio confermato dal backend
        notificaElegante('✓ ' + (campo === 'stato' ? 'Stato' : 'Modifica') + ' salvato', 'success');
        
        // Invalida le cache
        delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
        cacheFetchTime['PROGRAMMA PRODUZIONE DEL MESE'] = 0;
        _lsCacheDel('_html_PROGRAMMA PRODUZIONE DEL MESE');
        
        // ═════ FORCE SYNC IMMEDIATO DELLA OVERVIEW ═════
        // Saltato se skipForceSync=true (il polling da 30s sincronizzerà)
        if (!skipForceSync && paginaAttuale === 'PROGRAMMA PRODUZIONE DEL MESE') {
            try {
                const bundle = await fetch(URL_GOOGLE + '?azione=getAllDashboard').then(x => x.json());
                if (bundle && bundle.produzione) {
                    const newAttivi = (bundle.produzione || []).filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
                    _patchProduzione(newAttivi, bundle.produzione, bundle.archivio || []);
                    console.log('[Force sync] Overview aggiornata immediatamente');
                }
            } catch (err) {
                console.warn('[Force sync] Errore nel fetch immediato:', err);
                // Se il force-sync fallisce, il polling lo farà entro 30s
            }
        }
        return true;
    } catch (e) {
        console.error('aggiornaDato error:', e);
        if (selectEl) selectEl.style.opacity = '1';
        notificaElegante('✗ Errore: cambio NON salvato. Riprova.', 'error');
        return false;
    }
}

/* ══════════════════════════════════════════════════════════════════
   LIVE SYNC – polling 30s + patch chirurgica del DOM
   Obiettivo: altri utenti vedono i cambi di stato/operatori in ~30s
   senza dover ricaricare manualmente la pagina.
   ══════════════════════════════════════════════════════════════════ */

// Auto-archivio gestito dal trigger GAS (backend) → nessun timer frontend necessario

function _startPollingProduzione() {
    _stopPollingProduzione();
    _pollProdTimer = setInterval(_pollProdStep, _POLL_PROD_MS);
}
function _stopPollingProduzione() {
    if (_pollProdTimer) { clearInterval(_pollProdTimer); _pollProdTimer = null; }
}

async function _pollProdStep() {
    if (paginaAttuale !== 'PROGRAMMA PRODUZIONE DEL MESE') { _stopPollingProduzione(); return; }
    if (document.visibilityState === 'hidden') return;
    // Non interrompere mentre l'utente ha un dropdown aperto
    if (document.querySelector('.stato-dropdown.open, .op-dropdown.open')) return;
    // Non eseguire il poll per 5s dopo un drag kanban (evita revert dell'update ottimistico)
    if (Date.now() - _lastKanbanDragTs < 5000) return;
    try {
        const resp = await fetch(URL_GOOGLE + '?azione=getAllDashboard');
        if (!resp.ok) return;
        const bundle = await resp.json();
        if (!bundle || !bundle.produzione) return;
        if (bundle.avatarColors) _syncAvatarColors(bundle.avatarColors);
        const newAttivi = (bundle.produzione || []).filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
        _patchProduzione(newAttivi, bundle.produzione, bundle.archivio || []);
    } catch (_) { /* errore di rete silenzioso */ }
}

/** Aggiorna i colori avatar ricevuti dal server; ri-vernicia i badge visibili se qualcosa è cambiato */
function _syncAvatarColors(serverMap) {
    if (!serverMap || typeof serverMap !== 'object') return;
    let changed = false;
    Object.entries(serverMap).forEach(([nome, colore]) => {
        if (!colore) return;
        const k = nome.toUpperCase().trim();
        if (_avatarColorsCache[k] !== colore) {
            _avatarColorsCache[k] = colore;
            try { localStorage.setItem('avatarColor_' + k, colore); } catch {}
            changed = true;
        }
    });
    if (!changed) return;
    // Ri-applica il colore del proprio avatar
    if (utenteAttuale?.nome) {
        const mio = serverMap[utenteAttuale.nome.toUpperCase().trim()];
        if (mio) _applyAvatarColorUI(mio);
    }
    // Aggiorna tutti i badge visibili nella pagina
    _repaintOpColors();
}

/** Ri-vernicia i badge operatore già nel DOM senza fare un re-render completo */
function _repaintOpColors() {
    const cont = document.getElementById('contenitore-dati');
    if (!cont) return;
    // 1. Badge inline nelle item-card (hanno data-nome)
    cont.querySelectorAll('.badge-operatore[data-nome]').forEach(el => {
        const col = _getOpColor(el.dataset.nome);
        el.style.background = col;
        el.style.borderColor = col;
    });
    // 2. Re-render delle card Operatori e Carico operatori (usano _getOpColor internamente)
    if (_attiviProd && _attiviProd.length) {
        const newHtml = _buildCaricoOperatoriHtml(_attiviProd);
        const cards = cont.querySelectorAll('.ov-stato-card');
        // Cerca le due card per grid-row in style
        const opCards = Array.from(cards).filter(c => /grid-column.*4/.test(c.getAttribute('style') || ''));
        if (opCards.length >= 2) {
            const tmp = document.createElement('div');
            tmp.innerHTML = newHtml;
            const newCards = tmp.querySelectorAll('.ov-stato-card');
            newCards.forEach((nc, i) => { if (opCards[i]) opCards[i].replaceWith(nc); });
        }
    }
    // 3. Dot nei popup operatori aperti (ri-colorati in tempo reale)
    cont.querySelectorAll('.op-opt-dot').forEach(dot => {
        const btn = dot.closest('.op-option');
        if (!btn) return;
        const spans = btn.querySelectorAll('span');
        // Il secondo span contiene il nome
        const nomeTxt = spans[1]?.textContent?.trim() || spans[0]?.textContent?.trim();
        if (nomeTxt) dot.style.background = _getOpColor(nomeTxt);
    });
}

function _patchProduzione(newAttivi, allProd, allArch) {
    if (!_attiviProd) return;

    const oldIds = new Set(_attiviProd.map(r => String(r.id_riga)));
    const newIds = new Set(newAttivi.map(r => String(r.id_riga)));
    // Cambiamento strutturale = ordini aggiunti o rimossi → re-render preservando accordions
    let structural = oldIds.size !== newIds.size;
    if (!structural) { for (const id of oldIds) { if (!newIds.has(id)) { structural = true; break; } } }
    if (!structural) { for (const id of newIds) { if (!oldIds.has(id)) { structural = true; break; } } }

    if (structural) {
        _backgroundRefreshProduzione(allProd, allArch);
        return;
    }

    // ── Patch chirurgica: solo righe cambiate ──────────────────────────────
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    let anyChange = false;

    newAttivi.forEach(newRow => {
        const idStr = String(newRow.id_riga);
        const oldRow = _attiviProd.find(r => String(r.id_riga) === idStr);
        if (!oldRow) return;

        // ── Stato ──
        const newStato = (newRow.stato || 'IN ATTESA').toUpperCase().trim();
        const oldStato = (oldRow.stato || 'IN ATTESA').toUpperCase().trim();
        if (newStato !== oldStato) {
            anyChange = true;
            const dd = contenitore.querySelector(`.stato-dropdown[data-id-riga="${idStr}"]`);
            if (dd) {
                const cfg = (listaStati || []).find(s => s.nome === newStato) || { colore: '#e2e8f0' };
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

        // ── Operatori assegnati ──
        const newAssegna = String(newRow.assegna || '').trim();
        const oldAssegna = String(oldRow.assegna || '').trim();
        if (newAssegna !== oldAssegna) {
            anyChange = true;
            oldRow.assegna = newAssegna;
            // Aggiorna il data-assegna del widget (operatore/dropdown)
            const opEl = contenitore.querySelector(`.visualizza-operatori[data-id-riga="${idStr}"], .op-dropdown[data-id-riga="${idStr}"]`);
            if (opEl) opEl.dataset.assegna = newAssegna;
        }
    });

    if (anyChange) {
        // Aggiorna il puntatore globale e invalida la cache HTML
        _attiviProd = newAttivi;
        delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
        cacheFetchTime['PROGRAMMA PRODUZIONE DEL MESE'] = Date.now();
    }
}

function _backgroundRefreshProduzione(allProd, allArch) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    // Salva quali accordions sono aperti (per data-ordine)
    const openSet = new Set();
    contenitore.querySelectorAll('.ordine-wrapper').forEach(w => {
        if (w.querySelector('.riga-ordine.open')) openSet.add(w.dataset.ordine);
    });
    // Full re-render in background
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
                <span>📦 ARCHIVIO STORICO ORDINI</span>
                <i class="fas fa-chevron-down archivio-chevron"></i>
            </summary>
            <div class="sezione-archiviata">
                ${htmlArchiviati || "<div class='empty-msg'>L'archivio è vuoto.</div>"}
            </div>
        </details>`;

    // Ripristina accordions aperti
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
    aggiornaListaFiltrabili();
    requestAnimationFrame(_initKanbanDnd);
}
/* ══ fine LIVE SYNC ══════════════════════════════════════════════ */

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
function apriModalAiuto(idRiga, riferimento, nOrdine, cliente) {
    const modal = document.getElementById('modalAiuto');
    if (modal.style.display === 'flex') return;  // guard: già aperto

    modal._openedAt = Date.now();   // grace-period backdrop
    modal.style.display = 'flex';
    modal.offsetHeight; // Forza il reflow per l'animazione
    modal.classList.add('active');

    // Titolo più coerente: Messaggio invece di Supporto
    document.getElementById('modal-titolo').innerText = idRiga ?
        `Messaggio Art. ${riferimento}` :
        `Messaggio Ordine ${nOrdine}`;

    // Generazione lista operatori (nomi normalizzati Title Case)
    document.getElementById('wrapper-operatori').innerHTML = listaOperatori.map(op => `
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${op.email}" data-nome="${_normNome(op.nome)}">
            <span><b>${_normNome(op.nome)}</b> <small class="text-muted">(${op.reparto || 'Team'})</small></span>
        </label>
    `).join('');

    modal.dataset.idRiga = idRiga || "";
    modal.dataset.nOrdine = nOrdine;
    modal.dataset.cliente = cliente || "";

    // Nascondi sempre il campo ordine libero (visibile solo da apriNuovaRichiesta)
    const ordineRow = document.getElementById('modal-ordine-row');
    if (ordineRow) ordineRow.style.display = 'none';

    // Reset del campo testo — modal sempre in modalità DOMANDA
    document.getElementById('messaggio-aiuto').value = "";
    setTipoAzione('DOMANDA');
}

// Apri modal per creare una nuova richiesta libera (da bottom nav "+")
function apriNuovaRichiesta() {
    const modal = document.getElementById('modalAiuto');
    // Guard DOM-based: se il modal è già visibile (aperto o in fase di chiusura), non fare nulla
    if (modal.style.display === 'flex') return;
    modal._openedAt = Date.now();   // timestamp per grace-period backdrop
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
    setTipoAzione('DOMANDA');
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
                .map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '', riferimento: r.riferimento || '' }))
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
    if (modal) {
        modal.dataset.nOrdine = ordine;
        modal.dataset.cliente = cliente || '';
    }
}
function setTipoAzione(tipo) {
    const tipoUp = tipo.toUpperCase();
    document.getElementById('modalAiuto').dataset.tipoAzione = tipoUp;
    document.getElementById('btn-tipo-assegna').classList.toggle('active', tipoUp === 'ASSEGNAZIONE');
    document.getElementById('btn-tipo-domanda').classList.toggle('active', tipoUp === 'DOMANDA');
}
function chiudiModal() {
    const modal = document.getElementById('modalAiuto');

    // 1. Porta subito display a '' così il guard DOM blocca riaperture durante il fade-out
    modal.style.display = '';

    // 2. Togli la classe active per avviare il fade-out
    modal.classList.remove('active');
}
async function confermaInvioSupporto() {
    const modalElement = document.getElementById('modalAiuto');
    if (!modalElement) return;

    const idRiga = modalElement.dataset.idRiga;
    const ordineRow   = document.getElementById('modal-ordine-row');
    const ordineInput = document.getElementById('modal-ordine-input');
    const nOrd = (ordineRow && ordineRow.style.display !== 'none' && ordineInput && ordineInput.value.trim())
        ? ordineInput.value.trim()
        : modalElement.dataset.nOrdine;
    const messaggioVal = document.getElementById('messaggio-aiuto').value;
    const tipoAzione   = modalElement.dataset.tipoAzione;

    const checkboxSelezionate = document.querySelectorAll('input[name="destinatario"]:checked');
    if (checkboxSelezionate.length === 0) {
        alert("Per favore, seleziona almeno un operatore.");
        return;
    }

    const listaNomiStr        = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome')).join(', ');
    const listaNomiDestinatari = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome'));

    // ── Chiudi subito il modal e dai feedback immediato ──
    document.getElementById('messaggio-aiuto').value = '';
    chiudiModal();
    notificaElegante(tipoAzione === 'ASSEGNAZIONE' ? '✅ Assegnazione inviata' : '✅ Richiesta inviata');

    // Invalida cache richieste in anticipo (client-side + prefetch bundle)
    delete cacheContenuti['STORICO_RICHIESTE'];
    delete cacheFetchTime['STORICO_RICHIESTE'];
    _lsCacheDel('_html_STORICO_RICHIESTE');
    window._prefetchRqBundle  = null;
    window._prefetchRqPromise = null;

    // ── Fire-and-forget: entrambe le chiamate in background ──
    const urlAssegnazione = `${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(listaNomiStr)}&id_riga=${idRiga}&mittente=${encodeURIComponent(utenteAttuale.nome.toUpperCase().trim())}&registra=0`;
    const clienteVal = (modalElement.dataset.cliente || '').trim();
    const payload = {
        azione: 'supporto_multiplo',
        n_ordine: nOrd,
        cliente: clienteVal,
        tipo: tipoAzione,
        messaggio: messaggioVal || (tipoAzione === 'ASSEGNAZIONE' ? 'Nuova assegnazione' : 'Nuova domanda'),
        mittente: utenteAttuale.nome.toUpperCase().trim(),
        destinatari: listaNomiDestinatari
    };

    Promise.all([
        fetch(urlAssegnazione).catch(() => {}),
        fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) }).catch(() => {})
    ]).then(() => {
        // Aggiorna dati in background dopo che il server ha risposto
        if (paginaAttuale === 'STORICO_RICHIESTE') {
            caricaPaginaRichieste().catch(() => {});
        } else {
            fetchJson('STORICO_RICHIESTE').then(msgs => { aggiornaBadgeSidebar(msgs); }).catch(() => {});
            caricaDati(paginaAttuale).catch(() => {});
        }
    });
}
function toggleAreaRisposta(id) {
    const box = document.getElementById('box-risposta-' + id);
    const boxConf = document.getElementById('box-conferma-' + id);
    if (!box) return;
    if (boxConf) { boxConf.style.display = 'none'; boxConf.style.opacity = '0'; }

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        setTimeout(() => { box.style.opacity = '1'; box.style.transform = 'translateY(0)'; }, 10);
        const input = document.getElementById('input-risposta-' + id);
        if (input) {
            input.focus();
            // Scroll al box dopo che la tastiera iOS si è aperta (~400ms)
            setTimeout(() => {
                box.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
        }
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
async function inviaRisposta(idRiga, nOrdine, destinatario, cliente) {
    const input = document.getElementById('input-risposta-' + idRiga);
    const testo = input.value.trim();
    if (!testo) return;

    // ── Reset UI immediato ──
    input.value = '';
    toggleAreaRisposta(idRiga); // chiude il box risposta subito
    notificaElegante('✅ Risposta inviata');

    // Invalida cache in anticipo
    delete cacheContenuti['STORICO_RICHIESTE'];
    delete cacheFetchTime['STORICO_RICHIESTE'];
    _lsCacheDel('_html_STORICO_RICHIESTE');

    // ── Fire-and-forget ──
    const payload = {
        azione: 'supporto_multiplo',
        n_ordine: nOrdine,
        cliente: (cliente || '').trim(),
        tipo: 'RISPOSTA',
        messaggio: testo,
        mittente: utenteAttuale.nome.toUpperCase().trim(),
        destinatari: [destinatario.toUpperCase().trim()]
    };
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) })
        .then(() => { if (paginaAttuale === 'STORICO_RICHIESTE') caricaPaginaRichieste().catch(() => {}); })
        .catch(() => {});
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
        () => {
            // ── Aggiornamento ottimistico: rimuovi subito dal DOM ──
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

            // ── Chiamata GAS in background ──
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
                        delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
                        _lsCacheDel('_html_ARCHIVIO_ORDINI');
                        _lsCacheDel('_html_PROGRAMMA PRODUZIONE DEL MESE');
                        notificaElegante('✓ Ordine ' + nOrd + ' archiviato', 'success');
                    } else {
                        // Ripristina la riga nel DOM
                        if (wrapperHTML && wrapperParent) {
                            wrapperParent.insertBefore(
                                Object.assign(document.createElement('div'), { outerHTML: wrapperHTML }),
                                wrapperNext
                            );
                            const restored = wrapperParent.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(nOrd)}"]`);
                            if (restored) { restored.style.opacity = '1'; restored.style.transform = ''; }
                        }
                        const msgErr = (risultato.message || risultato.error || 'Errore sconosciuto').toString();
                        notificaElegante('✗ ' + msgErr + ' — ordine ripristinato', 'error');
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
                    notificaElegante('✗ ' + (errore.message || 'Errore di rete') + ' — ordine ripristinato', 'error');
                }
            })();
        },
        'Archivia'
    );
}

/* ── QUANTITÀ EVASA / PARZIALE ────────────────────────────────── */
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
        el.textContent = '—';
        el.style.color = '';
    }
}
async function salvaQtyEvasa(idRiga, qtyTot, val) {
    const evasa = parseFloat(val);
    if (isNaN(evasa) || evasa < 0) return;
    aggiornaRimanente(idRiga, qtyTot, evasa);
    // Aggiorna cache in-memory
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
                    delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
                    _lsCacheDel('_html_ARCHIVIO_ORDINI');
                    _lsCacheDel('_html_PROGRAMMA PRODUZIONE DEL MESE');
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
// Overview: stati articolo + ordine — letti dal server (ScriptProperties OVERVIEW_STATI).
// Defaults usati solo se il server non restituisce overviewStati.
let _ovStatiArt = ['PREPARARE','PREPARARE PER LAVORAZIONE','IN LAVORAZIONE','TORNATO DALLA LAVORAZIONE'];
let _ovStatiOrd = ['IN PRODUZIONE','IMBALLATO'];
function _getOvStatiAll() { return [..._ovStatiArt, ..._ovStatiOrd]; }

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
    // Tutti gli articoli attivi (tutti gli stati, non solo IN PRODUZIONE)
    // così un operatore assegnato a qualsiasi stato risulta "occupato" e non "Libero"
    const attiviOp = attivi;

    // Operatori della produzione da mostrare (in ordine fisso) — Title Case canonical
    const OPS_PROD = ['Riccardo', 'Fabio T.', 'Niccolò', 'Alessio'];

    // Costruisce mappa operatore → array di righe assegnate (solo ops prod)
    const map = new Map();
    OPS_PROD.forEach(op => map.set(op, []));
    // Mappa ordine già inserito per operatore: evita che lo stesso n. ordine compaia più volte
    const seenOrdine = new Map();
    OPS_PROD.forEach(op => seenOrdine.set(op, new Set()));

    // Cerca la corrispondenza tramite _normNome (gestisce FABIO→Fabio T., NICCOLÒ→Niccolò, ecc.)
    function _findOp(nome) {
        const nNorm = _normNome(nome);
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
            // Un solo entry per ordine per operatore
            if (found && !seenOrdine.get(found).has(ordineKey)) {
                seenOrdine.get(found).add(ordineKey);
                map.get(found).push(r);
            }
        });
    });

    const coloriStati = {};
    (listaStati || []).forEach(s => { coloriStati[s.nome.toUpperCase()] = s.colore; });

    // Helper cliente/riferimento
    function _clienteLabel(r) {
        const cli = String(r.cliente || '').trim().toUpperCase();
        if (!cli || cli === 'DA DEFINIRE') {
            const rif = String(r.riferimento || '').trim();
            return rif ? rif : '';
        }
        const w = r.cliente.trim().split(/\s+/).slice(0, 2).join(' ');
        return w.length > 14 ? w.substring(0, 13) + '\u2026' : w;
    }

    // ── Card 1: "Operatori" ──
    const card1Body = OPS_PROD.map(nome => {
        const items = map.get(nome) || [];
        const col = _getOpColor(nome);
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

    // ── Card 2: "Carico operatori" ──
    const maxCount = Math.max(...OPS_PROD.map(n => (map.get(n) || []).length), 1);
    const card2Body = OPS_PROD.map(nome => {
        const count = (map.get(nome) || []).length;
        const col = _getOpColor(nome);
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
    (listaStati || []).forEach(s => { coloriStati[s.nome.toUpperCase()] = s.colore; });
    const coloreDefault = '#94a3b8';

    const cardsHtml = _getOvStatiAll().map(stato => {
        // .trim() evita spazi extra nel nome stato (fix IN LAVORAZIONE)
        const righe = attivi.filter(r => (r.stato || '').toUpperCase().trim() === stato.trim());
        const colore = coloriStati[stato] || coloreDefault;
        const isEmpty = righe.length === 0;

        const isOrdMode = _ovStatiOrd.includes(stato); // IN PRODUZIONE, IMBALLATO → per ordine
        let contenuto = '';
        let totLabel  = '';

        if (isOrdMode) {
            // ── MODALITÀ ORDINE: una card per numero ordine ─────────────────
            const gruppiMap = new Map();
            const gruppiOrd = [];
            righe.forEach(r => {
                const key = String(r.ordine || '—').trim();
                if (gruppiMap.has(key)) { gruppiMap.get(key).push(r); }
                else { gruppiMap.set(key, [r]); gruppiOrd.push({ ordine: key, rows: gruppiMap.get(key) }); }
            });
            // Ordina alfabeticamente per cliente
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
                    title="Doppio clic → vai all'ordine nella lista">
                    <span class="ov-drag-handle"><i class="fas fa-grip-vertical"></i></span>
                    <span class="ov-row-main">
                        <span class="ov-row-label" title="${ordine}">${ordLabel} <em>${cliLabel}</em></span>
                        <span class="ov-row-sub">${artCount} art. · ${qtyTot} pz</span>
                    </span>
                </div>`;
            }).join('');
            totLabel = gruppiOrd.length + ' ord.';

        } else {
            // ── MODALITÀ ARTICOLO: una card per codice (comportamento originale) ──
            const gruppiMap = new Map();
            const gruppiOrd = [];
            righe.forEach(r => {
                const codice = String(r.codice && r.codice !== 'false' ? r.codice : r.riferimento || '—').trim();
                if (gruppiMap.has(codice)) { gruppiMap.get(codice).push(r); }
                else { gruppiMap.set(codice, [r]); gruppiOrd.push({ codice, rows: gruppiMap.get(codice) }); }
            });
            // Ordina codici alfabeticamente
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
                const subLine = subParts.join(' · ');
                const qtyStr  = rows.length > 1 ? rows.map(r => (r.qty || 1) + 'pz').join('+') : (rows[0].qty || 1) + ' pz';
                return `<div class="ov-stato-row ov-kanban-item"
                    data-id-riga="${rows[0].id_riga}"
                    data-id-righe="${ids}"
                    data-count="${rows.length}"
                    data-codice="${codice.replace(/"/g, '&quot;')}"
                    data-ordine="${rows.map(r => r.ordine || '').join(',')}"
                    data-stato-corrente="${stato}"
                    title="Doppio clic → vai all'ordine nella lista">
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
            <div class="ov-stato-body" data-stato-drop="${stato}">${isEmpty ? '<span class="ov-empty-lbl">— nessun articolo</span>' : contenuto}</div>
        </details>`;
    }).join('');

    return `<div class="ov-board-wrapper">
        <div class="ov-stati-grid" id="ov-kanban-grid">${cardsHtml}</div>
        <div class="ov-operatori-panel">${_buildCaricoOperatoriHtml(attivi)}</div>
    </div>`;
}

function _buildOverviewChart() { /* non più usato */ }

// Doppio clic su item overview → apre e scrolla all'ordine nella lista principale
function _scrollToOrdineList(ordine) {
    if (!ordine) return;
    const wrapper = [...document.querySelectorAll('.ordine-wrapper')].find(el => el.dataset.ordine === ordine);
    if (!wrapper) return;
    // Apre l'accordion se chiuso
    const riga = wrapper.querySelector('.riga-ordine');
    const det  = wrapper.querySelector('.dettagli-container');
    if (riga && !riga.classList.contains('open')) {
        riga.classList.add('open');
        if (det) det.style.display = 'block';
    }
    // Scrolla con un piccolo delay per permettere al DOM di espandersi
    setTimeout(() => { wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
    // Flash highlight ambra per 1.8s
    wrapper.style.transition = 'box-shadow 0.2s ease';
    wrapper.style.boxShadow = '0 0 0 3px #f59e0b99, 0 4px 24px #f59e0b33';
    setTimeout(() => { wrapper.style.transition = 'box-shadow 0.7s ease'; wrapper.style.boxShadow = ''; }, 1800);
}

/* ────────────────────────────────────────────────────────────────
   KANBAN DRAG & DROP DINAMICO  –  solo desktop (≥ 601 px)
   Usa pointer events per un ghost element che segue il cursore
   in tempo reale. Al rilascio sposta l'elemento nel DOM senza
   ricaricare e salva sul backend tramite aggiornaDato().
   ──────────────────────────────────────────────────────────────── */
function _initKanbanDnd() {
    const isMobileKanban = window.innerWidth <= 600;
    const grid = document.getElementById('ov-kanban-grid');
    if (!grid || grid._dndInit) return;
    grid._dndInit = true;

    // Su desktop le colonne devono restare sempre aperte:
    // blocca il toggle nativo di <details> quando si clicca il <summary>
    grid.addEventListener('click', e => {
        const summary = e.target.closest('.ov-stato-header');
        if (!isMobileKanban && summary) e.preventDefault();
    }, true);

    let dragEl     = null;
    let ghost      = null;
    let srcStato   = null;
    let activeBody = null;   // colonna attualmente evidenziata
    let dragPointerId = null;
    let pendingTouchDrag = null;
    const TOUCH_HOLD_MS = 380;
    const TOUCH_MOVE_CANCEL_PX = 10;
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
            dragEl.style.userSelect = '';  /* ripristina selezione testo */
            dragEl = null;
        }
        grid.querySelectorAll('.ov-stato-body').forEach(b => b.classList.remove('ov-drop-over'));
        srcStato = null;
        activeBody = null;
        dragPointerId = null;
    }

    /* ── Doppio click rilevato lato pointerdown (prima che preventDefault blocchi dblclick) ── */
    let _lastPointerDownTime = 0;
    let _lastPointerDownItem = null;

    function _startDrag(item, clientX, clientY, pointerId) {
        dragEl = item;
        srcStato = item.dataset.statoCorrente;
        dragPointerId = pointerId;

        const rect = item.getBoundingClientRect();
        offX = clientX - rect.left;
        offY = clientY - rect.top;

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

        /* Impedisci selezione del testo durante il drag */
        item.style.userSelect = 'none';

        // Placeholder opaco nella posizione originale
        dragEl.classList.add('ov-drag-active');

        // Pointer capture robusto: prima sull'item, fallback sul grid
        try {
            if (dragEl.setPointerCapture) dragEl.setPointerCapture(pointerId);
            else if (grid.setPointerCapture) grid.setPointerCapture(pointerId);
        } catch (_) {}
    }

    /* ── Inizio del drag ── */
    grid.addEventListener('pointerdown', e => {
        // Solo tasto sinistro del mouse
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        const item = e.target.closest('.ov-kanban-item');
        if (!item) return;

        // Rileva doppio click manualmente (250ms): se è il secondo tap rapido navigiamo, non trasciniamo
        const now = Date.now();
        if (_lastPointerDownItem === item && now - _lastPointerDownTime < 280) {
            _lastPointerDownTime = 0;
            _lastPointerDownItem = null;
            const ordine = (item.dataset.ordine || '').split(',')[0].trim();
            if (ordine) _scrollToOrdineList(ordine);
            return; // Non avviare il drag
        }
        _lastPointerDownTime = now;
        _lastPointerDownItem = item;

        // Touch: avvia drag solo dopo un tocco leggermente prolungato
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

    /* ── Movimento del ghost ── */
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

    /* ── Rilascio: sposta il nodo nel DOM ed aggiorna il backend ── */
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

        // Aggiorna cache locale per tutti gli articoli del gruppo
        idRighe.forEach(id => {
            if (_attiviProd) {
                const r = _attiviProd.find(x => String(x.id_riga) === id);
                if (r) r.stato = newStato;
            }
        });
        // Salva backend in modo sequenziale + await per assicurare il salvataggio
        // Usa aggiornaDato che ha già session token + error handling + force-sync
        _lastKanbanDragTs = Date.now();
        (async () => {
            let anyFailed = false;
            for (const id of idRighe) {
                const ok = await aggiornaDato(null, id, 'stato', newStato);
                if (!ok) anyFailed = true;
            }
            if (anyFailed) {
                notificaElegante('⚠️ Qualche articolo potrebbe non essere stato salvato. Verifica.', 'warning');
            }
        })();
        // Sincronizza il dropdown stato per TUTTI gli articoli del gruppo nel pannello dettaglio
        idRighe.forEach(id => _syncStatoItemCard(id, newStato, colore));
        notificaElegante(`✓ Stato → ${newStato}`);

    }
    grid.addEventListener('pointerup', _onPointerUp);
    window.addEventListener('pointerup', _onPointerUp, { passive: true });

    /* ── Annullamento (es. tasto Esc o interruzione sistema) ── */
    grid.addEventListener('pointercancel', _cleanup);
    window.addEventListener('pointercancel', _cleanup, { passive: true });

    // Previeni il drag HTML5 nativo che interferisce
    grid.addEventListener('dragstart', e => e.preventDefault());
}

function _aggiornaKanbanCount(grid) {
    grid.querySelectorAll('.ov-stato-body').forEach(body => {
        const stato = body.dataset.statoDrop;
        const isOrd = _ovStatiOrd.includes(stato);
        const items = body.querySelectorAll('.ov-kanban-item');
        // Per stati ordine conta le card; per stati articolo somma data-count
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

/** Salva lo stato open/closed di un gruppo richieste */
function _saveReqGroup(id, el) {
    try { localStorage.setItem('_rg_' + id, el.open ? '1' : '0'); } catch {}
}

function _parseQtyProduzione_(value) {
    const raw = String(value == null ? '' : value).trim();
    if (!raw) return 0;
    const normalized = raw.replace(/\./g, '').replace(',', '.');
    const qty = Number(normalized);
    return Number.isFinite(qty) ? qty : 0;
}

function _formatQtyProduzione_(value) {
    if (!Number.isFinite(value)) return '0';
    if (Math.abs(value - Math.round(value)) < 0.0001) return String(Math.round(value));
    return value.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function _isStatoEsclusoFabbisogno_(stato) {
    const key = String(stato || '').trim().toUpperCase();
    return [
        'IMBALLATO',
        'SPEDITO',
        'CONSEGNATO',
        'SPEDITO/CONSEGNATO',
        'SPEDITI/CONSEGNATI',
        'ANNULLATO',
        'ANNULLATI'
    ].includes(key);
}

// ── Fabbisogno Produzione: navigazione e modals ──────────────────────────────
function _fabprodVaiOrdine(nOrd) {
    document.querySelectorAll('.fabprod-modal-overlay').forEach(el => el.remove());
    cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null);
    setTimeout(() => {
        ['universal-search', 'mobile-search'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.value = nOrd; el.dispatchEvent(new Event('input')); }
        });
        if (typeof filtraUniversale === 'function') filtraUniversale();
    }, 420);
}

function _fabprodApriModalOrdine(nOrd, cliente) {
    document.getElementById('fabprod-modal-ordine')?.remove();
    const cli = cliente ? ` · ${cliente}` : '';
    const safeOrd = nOrd.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const el = document.createElement('div');
    el.id = 'fabprod-modal-ordine';
    el.className = 'fabprod-modal-overlay';
    el.innerHTML = `
        <div class="fabprod-modal-box">
            <div class="fabprod-modal-title"><i class="fas fa-box-open"></i> Vai all'ordine?</div>
            <div class="fabprod-modal-body">ORD. <strong>${nOrd}</strong>${cli ? `<span class="fabprod-modal-sub">${cli}</span>` : ''}</div>
            <div class="fabprod-modal-btns">
                <button class="fabprod-btn-cancel" onclick="document.getElementById('fabprod-modal-ordine').remove()">Annulla</button>
                <button class="fabprod-btn-confirm" onclick="_fabprodVaiOrdine('${safeOrd}')">Vai <i class='fas fa-arrow-right'></i></button>
            </div>
        </div>`;
    el.addEventListener('click', e => { if (e.target === el) el.remove(); });
    document.body.appendChild(el);
}

function _fabprodApriModalArticolo(idx) {
    const rows = window._fabprodCurrentRows;
    if (!rows || !rows[idx]) return;
    const row = rows[idx];
    document.getElementById('fabprod-modal-articolo')?.remove();
    const pillsHtml = row.ordini.map(o => {
        const safeOrd = o.ordine.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const safeCli = (o.cliente || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `<span class="fabprod-order-pill fabprod-order-pill--click" onclick="document.getElementById('fabprod-modal-articolo').remove();_fabprodApriModalOrdine('${safeOrd}','${safeCli}')">ORD. ${o.ordine}${o.cliente ? `<span class="fabprod-pill-cliente"> · ${o.cliente}</span>` : ''}</span>`;
    }).join('');
    const el = document.createElement('div');
    el.id = 'fabprod-modal-articolo';
    el.className = 'fabprod-modal-overlay';
    el.innerHTML = `
        <div class="fabprod-modal-box fabprod-modal-box--art">
            <button class="fabprod-modal-close" onclick="document.getElementById('fabprod-modal-articolo').remove()"><i class="fas fa-times"></i></button>
            ${row.codice ? `<div class="fabprod-modal-art-code">${row.codice}</div>` : ''}
            <div class="fabprod-modal-art-name">${row.prodotto}</div>
            <div class="fabprod-modal-art-qty">${_formatQtyProduzione_(row.qty)} pz totali richiesti</div>
            <div class="fabprod-modal-art-orders">${pillsHtml || '<span style="color:#94a3b8;font-size:0.8rem">Nessun ordine</span>'}</div>
        </div>`;
    el.addEventListener('click', e => { if (e.target === el) el.remove(); });
    document.body.appendChild(el);
}

function _fabprodCardClick(idx) {
    if (window.innerWidth <= 768) _fabprodApriModalArticolo(idx);
    // desktop: pills gestiscono il click da soli
}
// ─────────────────────────────────────────────────────────────────────────────

function _buildFabbisognoProduzioneRows_(righeProduzione) {
    const grouped = new Map();
    (righeProduzione || []).forEach(riga => {
        if (!riga) return;
        if (String(riga.archiviato || '').toUpperCase() === 'TRUE') return;
        if (_isStatoEsclusoFabbisogno_(riga.stato)) return;

        const prodotto = String(riga.prodotto || '').trim();
        if (!prodotto) return;

        const qtyTotale = _parseQtyProduzione_(riga.qty);
        const qtyEvasa = _parseQtyProduzione_(riga.qty_evasa);
        const qtyNetta = Math.max(qtyTotale - qtyEvasa, 0);
        if (qtyNetta <= 0) return;

        const key = prodotto.toLocaleUpperCase('it-IT');
        if (!grouped.has(key)) {
            grouped.set(key, {
                prodotto,
                codice: String(riga.codice || '').trim(),
                qty: 0,
                ordini: new Map()   // key=nOrdine, value=cliente
            });
        }

        const entry = grouped.get(key);
        if (!entry.codice && riga.codice) entry.codice = String(riga.codice).trim();
        entry.qty += qtyNetta;
        if (riga.ordine) {
            const nOrd = String(riga.ordine).trim();
            const cli  = String(riga.cliente || '').trim();
            if (!entry.ordini.has(nOrd) || !entry.ordini.get(nOrd)) entry.ordini.set(nOrd, cli);
        }
    });

    return Array.from(grouped.values())
        .map(entry => ({
            prodotto: entry.prodotto,
            codice: entry.codice,
            qty: entry.qty,
            ordini: Array.from(entry.ordini.entries())
                .map(([ord, cli]) => ({ ordine: ord, cliente: cli }))
                .sort((a, b) => a.ordine.localeCompare(b.ordine, 'it'))
        }))
        .sort((a, b) => (a.codice || '').localeCompare(b.codice || '', 'it', { sensitivity: 'base' }));
}

async function _loadFabbisognoProduzioneRows_() {
    if (Array.isArray(_attiviProd) && _attiviProd.length) {
        return _buildFabbisognoProduzioneRows_(_attiviProd);
    }

    let dashBundle = null;
    if (window._prefetchDashBundle) {
        dashBundle = window._prefetchDashBundle;
    } else if (window._prefetchDashPromise) {
        dashBundle = await window._prefetchDashPromise;
    } else {
        const dashResp = await fetch(URL_GOOGLE + '?azione=getAllDashboard');
        if (!dashResp.ok) throw new Error(`HTTP ${dashResp.status}`);
        dashBundle = await dashResp.json();
    }

    const produzione = (dashBundle && dashBundle.produzione) || [];
    return _buildFabbisognoProduzioneRows_(produzione);
}

async function caricaPaginaRichieste(expectedRequestId = null, signal = null) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    contenitore.innerHTML = "<div class='centered-msg' id='_ric-loader'>Caricamento messaggi in corso...</div>";

    const retryTimer = setTimeout(() => {
        const el = document.getElementById('_ric-loader');
        if (el) el.innerHTML = `⚠️ Connessione lenta o server non raggiungibile.<br>
            <button onclick="cambiaPagina('STORICO_RICHIESTE', null)"
                style="margin-top:12px;padding:8px 20px;background:#242424;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`;
    }, 12000);

    try {
        let _rqBundle = null;
        if (window._prefetchRqBundle) {
            _rqBundle = window._prefetchRqBundle;
            window._prefetchRqBundle = null;
            window._prefetchRqPromise = null;
        } else if (window._prefetchRqPromise) {
            _rqBundle = await window._prefetchRqPromise;
            window._prefetchRqBundle = null;
            window._prefetchRqPromise = null;
        } else {
            const _rqResp = await fetch(URL_GOOGLE + '?azione=getAllRichieste', signal ? { signal } : {});
            if (!_rqResp.ok) throw new Error(`HTTP ${_rqResp.status}`);
            _rqBundle = await _rqResp.json();
        }
        if (!_rqBundle) throw new Error('bundle vuoto');
        const [messaggiAttivi, messaggiArchivio] = [_rqBundle.attive || [], _rqBundle.archivio || []];
        clearTimeout(retryTimer);

        if (expectedRequestId !== null && expectedRequestId !== _latestNavRequest) {
            aggiornaBadgeSidebar(messaggiAttivi);
            return;
        }

        aggiornaBadgeSidebar(messaggiAttivi);
        aggiornaBadgeNotifiche(messaggiAttivi);

        let fabbisognoRows = [];
        try {
            fabbisognoRows = await _loadFabbisognoProduzioneRows_();
        } catch (fabbErr) {
            console.warn('Fabbisogno Produzione non disponibile:', fabbErr);
        }

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

        const _gruppiAttiviAll   = raggruppa(messaggiAttivi);
        const _gruppiArchivioAll = raggruppa(messaggiArchivio);

        /* ── Filtro: ogni operatore vede solo thread in cui è coinvolto ── */
        const _coinvolto = (() => {
            if (_isUtenteEsente()) return () => true;          // MASTER / ALESSIO vedono tutto
            const ioN = _normNome(utenteAttuale.nome).toUpperCase();
            return (msgs) => msgs.some(m =>
                _normNome(m.DA || '').toUpperCase() === ioN ||
                _normNome(m.A  || '').toUpperCase() === ioN);
        })();
        const _filtraGruppi = (g) => {
            const out = {};
            Object.keys(g).forEach(k => { if (_coinvolto(g[k])) out[k] = g[k]; });
            return out;
        };
        const gruppiAttivi   = _filtraGruppi(_gruppiAttiviAll);
        const gruppiArchivio = _filtraGruppi(_gruppiArchivioAll);

        // Separa per tipo — le scadenze vengono scorporate dal thread e messe in gScadenze a parte
        const gAssegnazioni = {};
        const gRichieste    = {};
        const gScadenze     = {};
        Object.keys(gruppiAttivi).forEach(nOrd => {
            const msgs = gruppiAttivi[nOrd];
            const scadMsgs = msgs.filter(m => (m.TIPO || '').toUpperCase() === 'SCADENZA');
            const restMsgs = msgs.filter(m => (m.TIPO || '').toUpperCase() !== 'SCADENZA');
            // Messaggi non-scadenza: classificati in base al primo
            if (restMsgs.length > 0) {
                const primo = restMsgs[0];
                const tipoFirst = (primo.TIPO || 'MSG').toUpperCase();
                if (tipoFirst === 'ASSEGNAZIONE') gAssegnazioni[nOrd] = restMsgs;
                else                             gRichieste[nOrd]    = restMsgs;
            }
            // Messaggi scadenza: sezione separata (chiave nOrd_scad per evitare collisioni)
            if (scadMsgs.length > 0) {
                gScadenze[nOrd + '_scad'] = scadMsgs;
            }
        });

        // Stato open/closed persistito
        const asseOpen = localStorage.getItem('_rg_assegnazioni') !== '0';
        const richOpen = localStorage.getItem('_rg_richieste') !== '0';
        const scadOpen = localStorage.getItem('_rg_scadenze')    !== '0';
        const fabbOpen = localStorage.getItem('_rg_fabbisogno_produzione') !== '0';
        const cntA = Object.keys(gAssegnazioni).length;
        const cntR = Object.keys(gRichieste).length;
        const cntS = Object.values(gScadenze).reduce((n, ms) => n + ms.length, 0);
        const cntF = fabbisognoRows.length;

        const _renderGroup = (gruppi, io) => {
            let s = '';
            Object.keys(gruppi).reverse().forEach(nOrd => {
                s += generaCardRichiesta(gruppi[nOrd], io, false);
            });
            return s || `<div class="empty-msg" style="margin:16px 0 8px">Nessun elemento.</div>`;
        };
        const _renderScadenze = () => {
            const allMsgs = Object.values(gScadenze).flat();
            allMsgs.sort((a, b) => {
                const da = _getScadDate(a), db = _getScadDate(b);
                if (!da && !db) return 0; if (!da) return 1; if (!db) return -1;
                return da - db;
            });
            return allMsgs.map(m => generaCardScadenza(m, io)).join('')
                || `<div class="empty-msg" style="margin:16px 0 8px">Nessuna scadenza.</div>`;
        };
        const _renderFabbisogno = () => {
            if (!fabbisognoRows.length) {
                return `<div class="empty-msg" style="margin:16px 0 8px">Nessun articolo attivo da produrre.</div>`;
            }
            window._fabprodCurrentRows = fabbisognoRows;
            return fabbisognoRows.map((row, idx) => {
                const pillsHtml = row.ordini.map(o => {
                    const safeOrd = o.ordine.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    const safeCli = (o.cliente || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    return `<span class="fabprod-order-pill fabprod-order-pill--click" onclick="event.stopPropagation();_fabprodApriModalOrdine('${safeOrd}','${safeCli}')">ORD. ${o.ordine}${o.cliente ? `<span class="fabprod-pill-cliente"> · ${o.cliente}</span>` : ''}</span>`;
                }).join('');
                return `
                <div class="fabprod-card" onclick="_fabprodCardClick(${idx})">
                    <div class="fabprod-top">
                        <div class="fabprod-name">${row.codice ? `<span class="fabprod-code">${row.codice}</span>` : ''}${row.prodotto}</div>
                        <span class="fabprod-qty">${_formatQtyProduzione_(row.qty)} pz</span>
                    </div>
                    <div class="fabprod-orders">${pillsHtml}</div>
                </div>`;
            }).join('');
        };

        let htmlArchReq = '';
        if (Object.keys(gruppiArchivio).length === 0) {
            htmlArchReq = `<div class="empty-msg" style="margin:20px 0">Nessuna richiesta archiviata.</div>`;
        } else {
            Object.keys(gruppiArchivio).reverse().forEach(nOrd => {
                htmlArchReq += generaCardRichiesta(gruppiArchivio[nOrd], io, true);
            });
        }

        let html = `
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="_apriArchivio('archivio-req-details')">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>

            <div class="req-groups">

                <details id="rg-fabbisogno-produzione" class="req-group" ${fabbOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('fabbisogno_produzione', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-fabbisogno"><i class="fas fa-boxes-stacked"></i></span>
                            <span class="rg-title">FABBISOGNO PRODUZIONE</span>
                            ${cntF > 0 ? `<span class="rg-count rg-count-fabb">${cntF}</span>` : ''}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="fabprod-list">${_renderFabbisogno()}</div>
                </details>

                <details id="rg-assegnazioni" class="req-group" ${asseOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('assegnazioni', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-assegna"><i class="fas fa-arrow-right"></i></span>
                            <span class="rg-title">ASSEGNAZIONI</span>
                            ${cntA > 0 ? `<span class="rg-count">${cntA}</span>` : ''}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${_renderGroup(gAssegnazioni, io)}</div>
                </details>

                <details id="rg-richieste" class="req-group" ${richOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('richieste', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-domanda"><i class="fas fa-question"></i></span>
                            <span class="rg-title">RICHIESTE</span>
                            ${cntR > 0 ? `<span class="rg-count rg-count-dom">${cntR}</span>` : ''}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${_renderGroup(gRichieste, io)}</div>
                </details>

                ${_isUtenteEsente() ? `
                <details id="rg-scadenze" class="req-group" ${scadOpen ? 'open' : ''}
                         ontoggle="_saveReqGroup('scadenze', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-scadenza"><i class="fa-solid fa-clock"></i></span>
                            <span class="rg-title">SCADENZE</span>
                            ${cntS > 0 ? `<span class="rg-count rg-count-scad">${cntS}</span>` : ''}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${_renderScadenze()}</div>
                </details>` : ''}

            </div>

            <details id="archivio-req-details" class="archivio-details">
                <summary class="separatore-archivio archivio-summary" style="list-style:none">
                    <span>ARCHIVIO</span>
                    <i class="fas fa-chevron-down archivio-chevron"></i>
                </summary>
                <div class="chat-inbox">${htmlArchReq}</div>
            </details>`;

        contenitore.innerHTML = html;
        cacheContenuti['STORICO_RICHIESTE'] = html;
        cacheFetchTime['STORICO_RICHIESTE'] = Date.now();
        _lsCacheSet('_html_STORICO_RICHIESTE', html); // cache cross-session
        applicaFade(contenitore);
        aggiornaListaFiltrabili();
        _osservaArchivio('archivio-req-details');

        ['universal-search', 'mobile-search'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

    } catch (e) {
        clearTimeout(retryTimer);
        if (e.name === 'AbortError') return;
        console.error("Errore caricamento richieste:", e);
        contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento. <button onclick=\"cambiaPagina('STORICO_RICHIESTE',null)\" style=\"margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer\">Riprova</button></div>";
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
async function aggiornaRichiesta(idRiga, tipoAzione, tuttiIds) {
    try {
        const body = { azione: 'aggiorna_richiesta_stato', tipo: tipoAzione };
        if (tipoAzione === 'risolto' && tuttiIds && tuttiIds.length > 1) {
            body.id_righe = tuttiIds;
        } else {
            body.id_riga = idRiga;
        }
        const res = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(body) });
        const r = await res.json();
        if (r && r.status === 'auth_error') { _gestisciAuthError_(r.message); return; }
        delete cacheContenuti['STORICO_RICHIESTE'];
        delete cacheFetchTime['STORICO_RICHIESTE'];
        _lsCacheDel('_html_STORICO_RICHIESTE');
        caricaPaginaRichieste(); // Rinfresca la vista
    } catch (e) { notificaElegante('Errore aggiornamento.', 'error'); }
}
function _sollecitaConferma(idRiga) {
    mostraConferma('Sollecita Richiesta', 'Inviare un sollecito per questa richiesta?', () => sollecitaRichiesta(idRiga), 'Sollecita');
}
function _archiviaConferma(idRiga, tuttiIds) {
    mostraConferma('Archivia Richiesta', 'Archiviare definitivamente questa discussione?', () => aggiornaRichiesta(idRiga, 'risolto', tuttiIds), 'Archivia');
}

// ── Chiudi box risposta/conferma toccando fuori dalla card (mobile) ──
document.addEventListener('click', function(e) {
    // Se il click è dentro una req-card, non chiudere nulla
    if (e.target.closest('.req-card')) return;
    // Chiudi tutti i box-risposta e box-conferma aperti
    document.querySelectorAll('.box-risposta, .box-conferma').forEach(function(box) {
        if (box.style.display !== 'none' && box.style.display !== '') {
            box.style.opacity = '0';
            box.style.transform = 'translateY(-10px)';
            setTimeout(function() { box.style.display = 'none'; }, 300);
        }
    });
});

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
            _lsCacheDel('_html_STORICO_RICHIESTE');
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
                const oraMatch = String(stringaData).match(/(\d{2})[:.](\d{2})/);
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
    const ultimo = msgs[msgs.length - 1]; // per id_riga, DATA ORA e riferimento (ultimo aggiornamento)
    const primo  = msgs[0];               // per tipo, mittente e destinatario originali del thread
    const nOrd = primo.ORDINE || ultimo.ORDINE;
    // Usa il CLIENTE salvato nel record; se mancante (record vecchi) prova la cache degli ordini di produzione
    const nomeCliente = primo.CLIENTE || ultimo.CLIENTE || ((_ordiniAutocompleteCache || []).find(o => o.ordine === nOrd) || {}).cliente || "";

    // Controlla se almeno un messaggio del gruppo è sollecitato
    const isSollecitata = msgs.some(m => String(m.SOLLECITO).toLowerCase() === 'true');

    // Mittente e destinatario presi dal PRIMO messaggio (le risposte non cambiano il mittente originale)
    const mittenteUnico = _normNome(primo.DA) || '—';
    const destinatariOriginali = [_normNome(primo.A)].filter(Boolean);
    const destinatariHtml = destinatariOriginali.length > 1
        ? destinatariOriginali.map(d => `<span class="rc-val rc-val-a">${d}</span>`).join('<span style="color:#cbd5e1;margin:0 1px">,</span> ')
        : `<span class="rc-val rc-val-a">${destinatariOriginali[0] || '—'}</span>`;

    // Icona tipo — usa il tipo del PRIMO messaggio, non delle risposte
    const tipoRaw = (primo.TIPO || 'MSG').toUpperCase();
    // Array di tutti gli id_riga del thread (per archiviazione bulk)
    const tuttiIds = msgs.map(m => m.id_riga).join(',');
    const isAssegnazione = tipoRaw === 'ASSEGNAZIONE';
    const tipoIconaHtml = isAssegnazione
        ? `<span class="rc-tipo rc-tipo-assegna" title="Assegnazione"><i class="fas fa-arrow-right"></i></span>`
        : `<span class="rc-tipo rc-tipo-domanda" title="Richiesta"><i class="fas fa-question"></i></span>`;

    return `
        <div class="req-card${isArchiviata ? ' archiviata' : ''}${isSollecitata ? ' sollecitata' : ''}" data-ordine="${String(nOrd || '')}" data-cliente="${(nomeCliente || '').toLowerCase().replace(/"/g, '')}" data-riferimento="${(ultimo.RIFERIMENTO || '').toLowerCase().replace(/"/g, '')}">

            <div class="rc-top">
                <div class="rc-ordine-wrap">
                    ${tipoIconaHtml}
                    <span class="rc-ordine">ORD. ${nOrd}</span>
                </div>
                ${isSollecitata ? `<span class="badge-sollecito badge-sollecito-sm"><i class="fa-solid fa-bullhorn"></i></span>` : ''}
                ${isArchiviata ? `<span class="rc-arch-badge">✓</span>` : ''}
            </div>

            <div class="rc-cliente">${nomeCliente || '<span class="rc-no-val">—</span>'}</div>

            <div class="rc-info">
                <div class="rc-info-row">
                    <span class="rc-lbl">Da</span>
                    <span class="rc-val">${mittenteUnico}</span>
                </div>
                <div class="rc-info-row">
                    <span class="rc-lbl">A</span>
                    <div class="rc-vals-wrap">${destinatariHtml}</div>
                </div>
            </div>

            <div class="rc-foot">
                <span class="rc-date">${formattaData(ultimo["DATA ORA"])}</span>
                <span class="rc-msgcount">${msgs.length} <i class="fa-regular fa-comment"></i></span>
            </div>

            <button class="rc-expand-btn" onclick="_toggleRcBody('${ultimo.id_riga}', this)" title="Mostra/nascondi messaggi">
                <i class="fa-solid fa-chevron-down"></i>
                <span>${msgs.length === 1 ? '1 messaggio' : msgs.length + ' messaggi'}</span>
            </button>

            <div id="rc-body-${ultimo.id_riga}" class="rc-body">
                ${msgs.map(m => {
                    const amIMittente = (String(m.DA).toUpperCase().trim() === io);
                    const testo = String(m.MESSAGGIO || "").includes("|") ? m.MESSAGGIO.split("|")[1] : m.MESSAGGIO;
                    const orarioMsg = m['DATA ORA'] ? formattaData(m['DATA ORA']) : '';
                    return `
                        <div class="chat-bubble-wrapper ${amIMittente ? 'sent' : 'received'}">
                            <div class="chat-bubble">
                                <div class="chat-bubble-name">${_normNome(m.DA)}</div>
                                <div class="chat-bubble-text">${testo}</div>
                                ${orarioMsg ? `<span class="chat-bubble-time">${orarioMsg}</span>` : ''}
                            </div>
                        </div>`;
                }).join('')}
            </div>

            ${!isArchiviata ? `
                <div id="box-conferma-${ultimo.id_riga}" class="box-conferma box-hidden">
                    <div class="box-message">Archiviare definitivamente questa discussione?</div>
                    <div class="box-actions">
                        <button onclick="toggleBoxArchivia('${ultimo.id_riga}')" class="btn-cancel button-small">Annulla</button>
                        <button onclick="aggiornaRichiesta('${ultimo.id_riga}', 'risolto', [${tuttiIds}])" class="btn-archive-action button-small">Sì, Archivia</button>
                    </div>
                </div>

                <div id="box-risposta-${ultimo.id_riga}" class="box-risposta box-hidden">
                    <div class="reply-wrapper">
                        <textarea id="input-risposta-${ultimo.id_riga}" class="reply-input" placeholder="Scrivi una risposta..."></textarea>
                        <div class="reply-footer">
                            <span class="reply-hint"><i class="fa-regular fa-paper-plane"></i> Risposta a <b>${_normNome(ultimo.DA === io ? ultimo.A : ultimo.DA)}</b></span>
                            <button onclick="inviaRisposta('${ultimo.id_riga}', '${nOrd}', '${ultimo.DA === io ? ultimo.A : ultimo.DA}', '${nomeCliente.replace(/'/g,"\\'")}')" class="btn-reply-send">
                                <i class="fa-solid fa-paper-plane"></i> Invia
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rc-actions">
                    <button onclick="toggleAreaRisposta('${ultimo.id_riga}')" class="rc-btn rc-btn-reply" title="Rispondi"><i class="fa-regular fa-comment"></i></button>
                    ${tipoRaw !== 'ASSEGNAZIONE' ? `<button onclick="apriModalSollecito('${primo.id_riga}','${nOrd}','${nomeCliente.replace(/'/g,"\\'")  }','${(primo.PRODOTTO||'').replace(/'/g,"\\'")  }')" class="rc-btn rc-btn-cal" title="Aggiungi scadenza"><i class="fa-solid fa-calendar-alt"></i></button>` : ''}
                    <button onclick="_sollecitaConferma('${ultimo.id_riga}')" class="rc-btn rc-btn-sol" title="Sollecita"><i class="fa-solid fa-bullhorn"></i></button>
                    <button onclick="_archiviaConferma('${ultimo.id_riga}', [${tuttiIds}])" class="rc-btn rc-btn-arch" title="Archivia"><i class="fa-solid fa-box-archive"></i></button>
                </div>
            ` : ''}
        </div>`;
}

function _toggleRcBody(idRiga, btn) {
    const body = document.getElementById('rc-body-' + idRiga);
    if (!body) return;
    const isOpen = body.classList.toggle('open');
    if (btn) btn.classList.toggle('open', isOpen);
}

/* ---- SCADENZE (inviate dai commerciali) ---- */
function _getScadDate(msg) {
    const parts = String(msg.MESSAGGIO || '').split('|');
    if (parts.length >= 2) {
        const s = parts[1] || '';
        if (s.startsWith('SCAD:')) { const d = new Date(s.slice(5)); if (!isNaN(d)) return d; }
    }
    return null;
}
function generaCardScadenza(msg, io) {
    const parts   = String(msg.MESSAGGIO || '').split('|');
    let scadDate = null, nota = '—';
    if (parts.length >= 2) {
        const sp = parts[1] || '';
        if (sp.startsWith('SCAD:')) { scadDate = new Date(sp.slice(5)); if (isNaN(scadDate)) scadDate = null; }
        nota = parts.slice(2).join('|').trim() || '—';
    }
    const nOrd    = msg.ORDINE   || '—';
    const cliente = msg.CLIENTE  || '';
    const prodotto= (msg.PRODOTTO && msg.PRODOTTO !== '') ? msg.PRODOTTO : '';
    const mitt    = _normNome(msg.DA || '');
    const dataOra = msg['DATA ORA'] || '';

    let urgClass = 'scad-ok', scadLabel = '—';
    if (scadDate) {
        const diff = Math.ceil((scadDate - new Date()) / 86400000);
        scadLabel = scadDate.toLocaleDateString('it-IT', { day:'2-digit', month:'short', year:'numeric' });
        if      (diff <  0) urgClass = 'scad-scaduta';
        else if (diff <= 3) urgClass = 'scad-urgente';
        else if (diff <= 7) urgClass = 'scad-vicina';
        else                urgClass = 'scad-ok';
    }
    return `
    <div class="scad-card ${urgClass}" data-ordine="${nOrd}" data-cliente="${(cliente).toLowerCase().replace(/"/g,'')}">
        <div class="scad-top">
            <div class="scad-ordine-wrap">
                <span class="rc-tipo rc-tipo-scadenza" title="Scadenza"><i class="fa-solid fa-clock"></i></span>
                <span class="rc-ordine">ORD.&nbsp;${nOrd}</span>
                ${prodotto ? `<span class="scad-art">&bull; <b>${prodotto}</b></span>` : '<span class="scad-art scad-int-ord">intero ordine</span>'}
            </div>
            <span class="scad-date-badge ${urgClass}">${scadLabel}</span>
        </div>
        ${cliente ? `<div class="rc-cliente">${cliente}</div>` : ''}
        <div class="scad-nota">${nota !== '—' ? nota : '<span class="scad-no-nota">Nessuna nota</span>'}</div>
        <div class="rc-foot">
            <span class="rc-lbl">Da</span>
            <span class="rc-val">${mitt}</span>
            <span class="rc-date" style="margin-left:auto">${formattaData(dataOra)}</span>
        </div>
        <div class="rc-actions">
            <button onclick="aggiornaRichiesta('${msg.id_riga}', 'risolto')" class="rc-btn rc-btn-arch" title="Archivia scadenza"><i class="fa-solid fa-check"></i></button>
        </div>
    </div>`;
}
/* ---- FINE SCADENZE ---- */


//PAGINA IMPOSTAZIONI//

async function caricaImpostazioni() {
        try {
            const res = await fetch(URL_GOOGLE + "?azione=getImpostazioni");
            const settings = await res.json();
            listaStati = settings.stati || [];
            listaOperatori = settings.operatori || [];
        } catch (e) { console.error("Errore caricamento impostazioni"); }
    }

/**
 * Carica stati e operatori al boot dell'app.
 * Prima tenta la cache localStorage (TTL 5 min), poi il server GAS.
 * È chiamata da window.onload tramite `if (typeof caricaDatiIniziali === "function")`.
 */
async function caricaDatiIniziali() {
    const LS_KEY = '_impostazioni_cache';
    const TTL_MS = 5 * 60 * 1000; // 5 minuti
    const cached = _lsCacheGet(LS_KEY, TTL_MS);
    if (cached) {
        try {
            const parsed = (typeof cached === 'string') ? JSON.parse(cached) : cached;
            if (parsed.stati && parsed.stati.length) {
                listaStati     = parsed.stati;
                listaOperatori = parsed.operatori || [];
                _applicaOverviewConfig(parsed.overviewStati);
                return;
            }
            _lsCacheDel(LS_KEY);
        } catch(e) { console.warn('[impostazioni] cache JSON corrotta, ricarico dal server:', e); }
    }
    await _fetchImpostazioniDaServer();
}

/** Fetch fresco dal server e aggiorna cache LS + variabili globali */
async function _fetchImpostazioniDaServer() {
    const LS_KEY = '_impostazioni_cache';
    try {
        const res = await fetch(URL_GOOGLE + '?azione=getImpostazioni');
        const settings = await res.json();
        listaStati     = (settings.stati && settings.stati.length) ? settings.stati : _defaultListaStati_();
        listaOperatori = settings.operatori || [];
        _applicaOverviewConfig(settings.overviewStati);
        _lsCacheSet(LS_KEY, JSON.stringify({
            stati: listaStati, operatori: listaOperatori,
            overviewStati: settings.overviewStati
        }));
    } catch(e) {
        console.warn('[Boot] _fetchImpostazioniDaServer:', e);
    }
}

/** Popola le variabili overview dai dati server (con fallback ai default) */
function _applicaOverviewConfig(ov) {
    if (!ov) return;
    if (Array.isArray(ov.art) && ov.art.length) _ovStatiArt = ov.art.map(s => s.toUpperCase().trim());
    if (Array.isArray(ov.ord) && ov.ord.length) _ovStatiOrd = ov.ord.map(s => s.toUpperCase().trim());
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
    // Renderizza QR canvas quando si apre la sezione postazioni
    if (!isOpen && sectionId === 'section-qr-postazioni') requestAnimationFrame(() => _qrRenderListaCanvas());
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
                                📨 Invia notifica di test
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

            </div>

            <div class="centered-fullwidth my-30">
                <button type="button" class="${TW.btnPrimaryLg}" onclick="salvaTutteImpostazioni()">
                    <i class="fas fa-save"></i> Salva Modifiche
                </button>
            </div>
        `;
        applicaFade(contenitore);
        // Disegna i QR nelle righe della lista non appena il DOM è pronto
        requestAnimationFrame(() => _qrRenderListaCanvas());
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
                // Invalida TUTTE le cache frontend (HTML, impostazioni) e ricarica config dal server
                _lsCacheDel('_impostazioni_cache');
                Object.keys(cacheContenuti).forEach(k => delete cacheContenuti[k]);
                Object.keys(localStorage).filter(k => k.startsWith('_html_')).forEach(k => localStorage.removeItem(k));
                await _fetchImpostazioniDaServer();
            } else {
                notificaElegante('Errore: ' + (json.message || 'risposta inattesa dal server'), 'error');
            }
        } catch (e) {
            notificaElegante('Errore nel salvataggio.', 'error');
        }
    }






function _aggiornaTabAcquisti() {
    const tc = document.getElementById('acq-tab-catalogo');
    const to = document.getElementById('acq-tab-ordini');
    if (tc) tc.classList.toggle('active', _acquistTabAttivo === 'catalogo');
    if (to) to.classList.toggle('active', _acquistTabAttivo === 'ordini');
}
function _switchAcquistiTab(tab) {
    _acquistTabAttivo = tab;
    _aggiornaTabAcquisti();
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    if (tab === 'ordini') {
        // Usa cache RAM se presente e fresca (solo nella sessione corrente, no LS)
        const _cached = cacheContenuti['_acq_ordini'];
        const _ts     = cacheFetchTime['_acq_ordini'] || 0;
        if (_cached && (Date.now() - _ts < CACHE_TTL_MS)) {
            contenitore.innerHTML = _cached;
            applicaFade(contenitore);
            aggiornaListaFiltrabili();
            return;
        }
        // Nessuna cache LS per gli ordini: dati real-time, altri utenti li modificano
        caricaOrdiniAcquisti(null, null);
    } else {
        // Usa cache RAM se presente e fresca
        const _cached = cacheContenuti['MATERIALE DA ORDINARE'];
        const _ts     = cacheFetchTime['MATERIALE DA ORDINARE'] || 0;
        if (_cached && (Date.now() - _ts < CACHE_TTL_MS)) {
            contenitore.innerHTML = _cached;
            applicaFade(contenitore);
            aggiornaListaFiltrabili();
            return;
        }
        // Prova LS cache
        const _lsHtml = _lsCacheGet('_html_MATERIALE DA ORDINARE', CACHE_TTL_MS);
        if (_lsHtml) {
            cacheContenuti['MATERIALE DA ORDINARE'] = _lsHtml;
            cacheFetchTime['MATERIALE DA ORDINARE'] = Date.now();
            contenitore.innerHTML = _lsHtml;
            applicaFade(contenitore);
            aggiornaListaFiltrabili();
            return;
        }
        caricaMateriali(false, null, null);
    }
}

/* ─────────────────────────────── ORDINI ACQUISTI ─────────────────────────── */

async function caricaOrdiniAcquisti(expectedRequestId = null, signal = null) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;
    contenitore.innerHTML = "<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento ordini...</div>";

    const isAlessio = utenteAttuale?.nome?.toUpperCase().trim() === 'ALESSIO';
    const opParam   = isAlessio ? '' : (utenteAttuale?.nome || '');

    try {
        const res  = await fetch(`${URL_GOOGLE}?azione=getOrdiniAcquisti&operatore=${encodeURIComponent(opParam)}`);
        if (signal?.aborted || (expectedRequestId !== null && expectedRequestId !== _latestNavRequest)) return;
        const rows = await res.json();

        if (!Array.isArray(rows) || rows.length === 0) {
            contenitore.innerHTML = `<div class='empty-msg'>${isAlessio ? 'Nessun ordine ricevuto.' : 'Non hai ancora inviato ordini.'}</div>`;
            applicaFade(contenitore);
            return;
        }

        // Raggruppa per id_gruppo (fallback su data+operatore)
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
        cacheContenuti['_acq_ordini'] = html;
        cacheFetchTime['_acq_ordini'] = Date.now();
        // NO localStorage per gli ordini: dati real-time, ogni dispositivo deve leggere da GAS
        contenitore.innerHTML = html;
        applicaFade(contenitore);
        aggiornaListaFiltrabili();
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

        // Aggiorna contatore del gruppo
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
        // Aggiorna subtitle totale
        const sub = document.querySelector('.acquisti-subtitle');
        if (sub) {
            const allPending = document.querySelectorAll('.ordine-item:not(.is-ordinato)').length;
            sub.textContent = allPending > 0 ? `${allPending} articoli in attesa` : 'Tutto ordinato ✅';
        }
        // Aggiorna la cache RAM con lo stato DOM corrente (solo sessione, no LS)
        const _cont = document.getElementById('contenitore-dati');
        if (_cont) {
            cacheContenuti['_acq_ordini'] = _cont.innerHTML;
            cacheFetchTime['_acq_ordini'] = Date.now();
        }
    } catch(e) {
        notificaElegante('Errore aggiornamento', 'error');
    }
    btn.disabled = false;
}

/* ─────────────────────────────── fine ORDINI ACQUISTI ──────────────────── */

  // --- PAGINA ACQUISTI ---
  let carrelloLocale = [];
  let _acquistTabAttivo = 'catalogo';
  let sezioniMateriali = JSON.parse(localStorage.getItem('sezioniMateriali') || '["Strumenti","Bombolette","Rifiuti"]');

  // Carica le sezioni dal backend (sovrascrive il localStorage se il backend le ha)
  async function _caricaSezioniDaBackend() {
    // Prima prova LS cache (TTL 10 minuti): evita una fetch GAS extra
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
    _lsCacheDel('_sezioniMateriali_cache'); // invalida subito la cache locale
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
        // Usa il bundle pre-fetchato se disponibile (GAS già chiamato in background all'avvio)
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
        _lsCacheSet('_html_MATERIALE DA ORDINARE', html); // cache cross-session
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

      const btnInvia = document.getElementById('btn-invia-alessio');
      if (btnInvia) { btnInvia.disabled = true; btnInvia.innerText = 'Invio in corso...'; }

      const idGruppo = String(Date.now()); // identificatore univoco per questo invio

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
              if (typeof chiudiModalCarrello === 'function') chiudiModalCarrello();
              notificaElegante('✅ Ordine inviato ad Alessio!');
              // Invalida cache ordini così la prossima apertura vede il nuovo ordine
              delete cacheContenuti['_acq_ordini'];
              delete cacheFetchTime['_acq_ordini'];
              _lsCacheDel('_html__acq_ordini');
              // Mostra bottoncino per vedere lo storico
              _acquistTabAttivo = 'ordini';
              setTimeout(() => cambiaPagina('MATERIALE DA ORDINARE', null), 800);
          } else {
              throw new Error(result.message);
          }
      } catch (e) {
          notificaElegante('Errore invio ordine: ' + e.message, 'error');
      } finally {
          if (btnInvia) { btnInvia.disabled = false; btnInvia.innerText = 'Invia ad Alessio'; }
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

      if (r && r.status === 'auth_error') { _gestisciAuthError_(r.message); return; }

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
          _lsCacheDel('_html_MATERIALE DA ORDINARE');
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
          _salvaSezioniSuBackend(); // Persiste sul backend per tutti i dispositivi
      }
      chiudiModalNuovaSezione();
      delete cacheContenuti['MATERIALE DA ORDINARE'];
      _lsCacheDel('_html_MATERIALE DA ORDINARE');
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
            if (r && r.status === 'auth_error') { _gestisciAuthError_(r.message); return; }
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
        if (r && r.status === 'auth_error') { _gestisciAuthError_(r.message); return; }
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
    // Matcha dall'inizio del testo O dall'inizio di qualsiasi parola (es. "GHP" in "DA DEFINIRE (GHP)")
    if (text.trimStart().startsWith(term)) return true;
    return text.split(/[\s(,;]+/).some(w => w.toLowerCase().startsWith(term));
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
        const isArticoloMode = filtroRicercaArticoli; // modalità "cerca articolo"

        elementiDaFiltrareCache.forEach(el => {
            let primary = false;
            let secondary = false;

            if (input === '') {
                primary = true;
                // ── Reset item-card visibility quando input vuoto ──
                if (isArticoloMode && el.classList.contains('ordine-wrapper')) {
                    el.querySelectorAll('.item-card').forEach(c => c.classList.remove('hidden-search'));
                }
            } else if (el.classList.contains('ordine-wrapper') || el.classList.contains('chat-card')) {

                if (isArticoloMode && el.classList.contains('ordine-wrapper')) {
                    // ── MODALITÀ ARTICOLO: cerca nei data-codice delle singole card ──
                    const cards = el.querySelectorAll('.item-card');
                    let hasMatch = false;

                    cards.forEach(card => {
                        // 1) attributo data-codice (nuovo deploy)
                        const codAttr = card.dataset.codice || '';
                        if (codAttr && (codAttr.startsWith(input) || (secondaryOn && codAttr.includes(input)))) {
                            hasMatch = true;
                            return;
                        }
                        // 2) fallback: prima <b> nella card (codice prodotto)
                        const firstB = (card.querySelector('b')?.textContent || '').toLowerCase().trim();
                        if (firstB && (firstB.startsWith(input) || (secondaryOn && firstB.includes(input)))) {
                            hasMatch = true;
                        }
                    });

                    // 3) fallback su data-codici del wrapper (cache precedente al deploy)
                    if (!hasMatch) {
                        const codiciArr = (el.dataset.codici || '').split('|').filter(Boolean);
                        hasMatch = codiciArr.some(c => c.startsWith(input) || (secondaryOn && c.includes(input)));
                    }

                    if (hasMatch) {
                        primary = true;
                        // Assicura che tutte le item-card siano visibili (ordine completo)
                        el.querySelectorAll('.item-card.hidden-search').forEach(c => c.classList.remove('hidden-search'));
                        // Apri automaticamente l'accordion se chiuso
                        const rigaOrdine = el.querySelector('.riga-ordine');
                        const dettagli = el.querySelector('.dettagli-container');
                        if (rigaOrdine && dettagli && !rigaOrdine.classList.contains('open')) {
                            rigaOrdine.classList.add('open');
                            dettagli.style.display = 'block';
                        }
                    }

                } else {
                    // ── MODALITÀ STANDARD: cerca ordine/cliente/riferimento ──
                    const ordine     = String(el.dataset.ordine      || '').toLowerCase();
                    const cliente    = String(el.dataset.cliente     || '').toLowerCase();
                    const riferimento = String(el.dataset.riferimento || '').toLowerCase();
                    const full = cliente + ' ' + riferimento + ' ' + ordine;
                    if (isNumericOnly) {
                        primary = ordine.startsWith(input);
                    } else {
                        primary = full.split(/[\s(),;]+/).some(token => token.startsWith(input));
                        if (!primary) secondary = full.includes(input);
                    }
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

/* ── Toggle filtro "Cerca Articolo" sulla barra di ricerca ────────────── */
function toggleFiltroArticoli() {
    filtroRicercaArticoli = !filtroRicercaArticoli;
    // Aggiorna UI pulsanti (desktop + mobile)
    document.querySelectorAll('.btn-filtro-articoli').forEach(btn => {
        btn.classList.toggle('active', filtroRicercaArticoli);
    });
    // Aggiorna placeholder
    const ph = filtroRicercaArticoli ? 'Cerca codice articolo...' : 'Cerca in tutte le pagine...';
    const phMob = filtroRicercaArticoli ? 'Cerca articolo' : 'Cerca';
    const deskInput = document.getElementById('universal-search');
    const mobInput  = document.getElementById('mobile-search');
    if (deskInput) deskInput.placeholder = ph;
    if (mobInput)  mobInput.placeholder  = phMob;
    // Reset le item-card nascoste
    document.querySelectorAll('.item-card.hidden-search').forEach(c => c.classList.remove('hidden-search'));
    // Rilancia ricerca con il nuovo filtro
    filtraUniversale();
}

/* ── Mostra/nasconde il pulsante filtro articoli in base alla pagina ──── */
function _aggiornaVisibilitaFiltroArticoli(nomeFoglio) {
    const isProduzione = nomeFoglio === 'PROGRAMMA PRODUZIONE DEL MESE';
    document.querySelectorAll('.btn-filtro-articoli').forEach(btn => {
        btn.style.display = isProduzione ? 'flex' : 'none';
    });
    // Se si esce dalla produzione, resetta il filtro
    if (!isProduzione && filtroRicercaArticoli) {
        filtroRicercaArticoli = false;
        document.querySelectorAll('.btn-filtro-articoli').forEach(btn => btn.classList.remove('active'));
        const deskInput = document.getElementById('universal-search');
        const mobInput  = document.getElementById('mobile-search');
        if (deskInput) deskInput.placeholder = 'Cerca in tutte le pagine...';
        if (mobInput)  mobInput.placeholder  = 'Cerca';
        document.querySelectorAll('.item-card.hidden-search').forEach(c => c.classList.remove('hidden-search'));
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST PAGE (ALESSIO ONLY): Macro-ordine annuale fornitore (HIVES)
// Tutto client-side, salvato in localStorage, cancellabile in qualsiasi momento.
// ─────────────────────────────────────────────────────────────────────────────
const _HIVES_TEST_LS_KEY = 'prod_hives_test_v1';

function _hivesMonths2026_() {
        return [
                { id: '2026-02', label: 'FEB 2026' }, { id: '2026-03', label: 'MAR 2026' },
                { id: '2026-04', label: 'APR 2026' }, { id: '2026-05', label: 'MAG 2026' },
                { id: '2026-06', label: 'GIU 2026' }, { id: '2026-07', label: 'LUG 2026' },
                { id: '2026-08', label: 'AGO 2026' }, { id: '2026-09', label: 'SET 2026' },
                { id: '2026-10', label: 'OTT 2026' }, { id: '2026-11', label: 'NOV 2026' },
                { id: '2026-12', label: 'DIC 2026' }
        ];
}

function _hivesDefaultState_() {
        const months = _hivesMonths2026_();
    const codes = [
        'IPLM500mA-PRO',
        'LED Bat-1-PRO',
        'IPLM600mA-PRO',
        'LED Bat-2-PRO',
        'IPLM700mA-PRO',
        'LED Bat-3-RED-PRO',
        'LED Bat-3-BLACK-PRO'
    ];
    const monthlyByCode = {
        'IPLM500mA-PRO':      [0, 700, 1000, 500, 500, 500, 0, 500, 500, 100, 0],
        'LED Bat-1-PRO':      [0, 700, 1000, 500, 500, 500, 0, 500, 500, 100, 0],
        'IPLM600mA-PRO':      [650, 400, 1000, 500, 500, 500, 0, 500, 200, 0, 0],
        'LED Bat-2-PRO':      [650, 400, 1000, 500, 500, 500, 0, 500, 200, 0, 0],
        'IPLM700mA-PRO':      [200, 0, 0, 200, 200, 200, 0, 200, 200, 200, 200],
        'LED Bat-3-RED-PRO':  [200, 0, 0, 200, 200, 200, 0, 200, 200, 200, 200],
        'LED Bat-3-BLACK-PRO':[200, 0, 0, 200, 200, 200, 0, 200, 200, 200, 200]
    };
    const comps = codes.map((cod, i) => {
        const pianoMensile = {};
        months.forEach((m, ix) => { pianoMensile[m.id] = Number(monthlyByCode[cod][ix] || 0); });
        return {
            id: 'c' + (i + 1),
            codice: cod,
            nome: cod,
            prezzoUnit: 0,
            coeffPerPip: 1,
            pianoMensile,
            ricevuto: {}
        };
    });
    const planned = months.map(m => comps.reduce((s, c) => s + (Number((c.pianoMensile || {})[m.id]) || 0), 0));
        return {
                suppliers: [{
                        id: 'hives',
                        name: 'HIVES',
                        orders: [{
                                id: 'pipistrello-2026',
                                titolo: 'Pipistrello · Macro ordine 2026',
                                totalAccordoPz: 21900,
                                mesi: months.map((m, i) => ({
                                        id: m.id,
                                        label: m.label,
                                        qtyAccordo: planned[i] || 0,
                                        sottoOrdine: '',
                                        accontoValore: 0,
                                        saldoValore: 0
                                })),
                                componenti: comps,
                                note: 'TEST PAGE: visibile solo ad Alessio'
                        }]
                }]
        };
}

let _hivesState = null;
let _hivesModalCtx = null;

function _hivesLoad_() {
        try {
                const raw = localStorage.getItem(_HIVES_TEST_LS_KEY);
                if (!raw) return _hivesDefaultState_();
        const parsed = JSON.parse(raw);
        const ord = parsed?.suppliers?.[0]?.orders?.[0];
        const legacy = ord?.componenti?.some(c => String(c.codice || '').startsWith('MAT-00'));
        if (!ord || legacy) return _hivesDefaultState_();
        return parsed;
        } catch (_) {
                return _hivesDefaultState_();
        }
}
function _hivesSave_() {
        try { localStorage.setItem(_HIVES_TEST_LS_KEY, JSON.stringify(_hivesState)); } catch (_) {}
}
function _hivesOrder_() { return _hivesState.suppliers[0].orders[0]; }
function _hivesCompMonthQty_(ord, c, monthId) {
    if (c && c.pianoMensile && typeof c.pianoMensile[monthId] !== 'undefined') return Number(c.pianoMensile[monthId]) || 0;
    const m = ord.mesi.find(x => x.id === monthId);
    return Number(m?.qtyAccordo || 0) * Number(c?.coeffPerPip || 0);
}
function _hivesSyncMonthAccordo_(ord) {
    ord.mesi.forEach(m => {
        m.qtyAccordo = ord.componenti.reduce((s, c) => s + _hivesCompMonthQty_(ord, c, m.id), 0);
    });
}
function _hivesFmt_(n) { return new Intl.NumberFormat('it-IT').format(Math.round(Number(n) || 0)); }
function _hivesMoney_(n) {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(n) || 0);
}
function _hivesCalc_(ord) {
    _hivesSyncMonthAccordo_(ord);
        const totalAccordo = Number(ord.totalAccordoPz || 0);
        const totalPianificato = ord.mesi.reduce((s, m) => s + (Number(m.qtyAccordo) || 0), 0);
        const unitBudget = ord.componenti.reduce((s, c) => s + ((Number(c.prezzoUnit) || 0) * (Number(c.coeffPerPip) || 0)), 0);
        const budgetTotale = totalPianificato * unitBudget;
        const budgetPagato = ord.mesi.reduce((s, m) => s + (Number(m.accontoValore) || 0) + (Number(m.saldoValore) || 0), 0);
        const compStats = ord.componenti.map(c => {
            const need = ord.mesi.reduce((s, m) => s + _hivesCompMonthQty_(ord, c, m.id), 0);
                const arr = ord.mesi.reduce((s, m) => s + (Number((c.ricevuto || {})[m.id]) || 0), 0);
                return { id: c.id, need, arrived: arr, rem: Math.max(0, need - arr) };
        });
        let pipEqArrivati = totalPianificato;
        compStats.forEach(cs => {
                const comp = ord.componenti.find(c => c.id === cs.id);
                const coeff = Number(comp?.coeffPerPip || 0);
                if (coeff > 0) pipEqArrivati = Math.min(pipEqArrivati, Math.floor(cs.arrived / coeff));
        });
        if (!isFinite(pipEqArrivati)) pipEqArrivati = 0;
        return {
                totalAccordo,
                totalPianificato,
                residuoAccordo: Math.max(0, totalAccordo - totalPianificato),
                budgetTotale,
                budgetPagato,
                budgetResiduo: Math.max(0, budgetTotale - budgetPagato),
                pipEqArrivati,
                pipEqRimanenti: Math.max(0, totalPianificato - pipEqArrivati),
                compStats
        };
}

function caricaPaginaHivesTest() {
        if (!_canOpenHivesTestPage()) { cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null); return; }
        if (window.innerWidth < 992) { cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null); return; }
        _hivesState = _hivesLoad_();
        _renderHivesTest_();
}

function _renderHivesTest_() {
        const ord = _hivesOrder_();
        _hivesSyncMonthAccordo_(ord);
        const calc = _hivesCalc_(ord);
        const root = document.getElementById('contenitore-dati');
        if (!root) return;
        const unitBudget = ord.componenti.reduce((s, c) => s + ((Number(c.prezzoUnit) || 0) * (Number(c.coeffPerPip) || 0)), 0);
        const cs = id => calc.compStats.find(s => s.id === id) || { need: 0, arrived: 0, rem: 0 };
        root.innerHTML = `
            <section class="hives-wrap">
                <details class="hives-accordion" id="hives-main-accordion" open>
                    <summary class="hives-accordion-summary">
                        <div class="hives-head-left">
                            <div class="hives-head-title">🧪 TEST · ${ord.titolo}</div>
                            <div class="hives-head-sub">Fornitore <b>HIVES</b> · Frontend real-time · Dati locali cancellabili</div>
                        </div>
                        <div class="hives-head-actions">
                            <button class="hives-btn hives-btn-soft" onclick="event.stopPropagation();_hivesResetAll_()">Reset Test</button>
                            <i class="fas fa-chevron-down hives-chevron"></i>
                        </div>
                    </summary>
                    <div class="hives-accordion-body">
                        <div class="hives-kpi-grid">
                            <button class="hives-kpi hives-kpi-multi hives-kpi-btn" onclick="_hivesOpenKPIModal_('accordo')">
                                <div class="hives-kpi-row"><span>Accordo Totale</span><strong>${_hivesFmt_(calc.totalAccordo)} pz</strong></div>
                                <div class="hives-kpi-row"><span>Residuo</span><strong>${_hivesFmt_(calc.residuoAccordo)} pz</strong></div>
                            </button>
                            <button class="hives-kpi hives-kpi-multi hives-kpi-btn" onclick="_hivesOpenKPIModal_('budget')">
                                <div class="hives-kpi-row"><span>Totale</span><strong>${_hivesMoney_(calc.budgetTotale)}</strong></div>
                                <div class="hives-kpi-row"><span>Pagato</span><strong>${_hivesMoney_(calc.budgetPagato)}</strong></div>
                                <div class="hives-kpi-row"><span>Residuo</span><strong>${_hivesMoney_(calc.budgetResiduo)}</strong></div>
                            </button>
                            <button class="hives-kpi hives-kpi-comp hives-kpi-btn" onclick="_hivesOpenCompModal_('c1')">
                                <div class="hives-kpi-comp-lbl">IPLM 500mA-PRO</div>
                                <div class="hives-kpi-row"><span>Tot.</span><strong>${_hivesFmt_(cs('c1').need)} pz</strong></div>
                                <div class="hives-kpi-row"><span>Rim.</span><strong>${_hivesFmt_(cs('c1').rem)} pz</strong></div>
                            </button>
                            <button class="hives-kpi hives-kpi-comp hives-kpi-btn" onclick="_hivesOpenCompModal_('c3')">
                                <div class="hives-kpi-comp-lbl">IPLM 600mA-PRO</div>
                                <div class="hives-kpi-row"><span>Tot.</span><strong>${_hivesFmt_(cs('c3').need)} pz</strong></div>
                                <div class="hives-kpi-row"><span>Rim.</span><strong>${_hivesFmt_(cs('c3').rem)} pz</strong></div>
                            </button>
                            <button class="hives-kpi hives-kpi-comp hives-kpi-btn" onclick="_hivesOpenCompModal_('c5')">
                                <div class="hives-kpi-comp-lbl">IPLM 700mA-PRO</div>
                                <div class="hives-kpi-row"><span>Tot.</span><strong>${_hivesFmt_(cs('c5').need)} pz</strong></div>
                                <div class="hives-kpi-row"><span>Rim.</span><strong>${_hivesFmt_(cs('c5').rem)} pz</strong></div>
                            </button>
                            <button class="hives-kpi hives-kpi-comp hives-kpi-btn" onclick="_hivesOpenCompModal_('c2')">
                                <div class="hives-kpi-comp-lbl">LED Bat-1-PRO</div>
                                <div class="hives-kpi-row"><span>Tot.</span><strong>${_hivesFmt_(cs('c2').need)} pz</strong></div>
                                <div class="hives-kpi-row"><span>Rim.</span><strong>${_hivesFmt_(cs('c2').rem)} pz</strong></div>
                            </button>
                            <button class="hives-kpi hives-kpi-comp hives-kpi-btn" onclick="_hivesOpenCompModal_('c4')">
                                <div class="hives-kpi-comp-lbl">LED Bat-2-PRO</div>
                                <div class="hives-kpi-row"><span>Tot.</span><strong>${_hivesFmt_(cs('c4').need)} pz</strong></div>
                                <div class="hives-kpi-row"><span>Rim.</span><strong>${_hivesFmt_(cs('c4').rem)} pz</strong></div>
                            </button>
                            <button class="hives-kpi hives-kpi-comp hives-kpi-btn" onclick="_hivesOpenCompModal_('c6')">
                                <div class="hives-kpi-comp-lbl">LED Bat-3-RED-PRO</div>
                                <div class="hives-kpi-row"><span>Tot.</span><strong>${_hivesFmt_(cs('c6').need)} pz</strong></div>
                                <div class="hives-kpi-row"><span>Rim.</span><strong>${_hivesFmt_(cs('c6').rem)} pz</strong></div>
                            </button>
                            <button class="hives-kpi hives-kpi-comp hives-kpi-btn" onclick="_hivesOpenCompModal_('c7')">
                                <div class="hives-kpi-comp-lbl">LED Bat-3-BLACK-PRO</div>
                                <div class="hives-kpi-row"><span>Tot.</span><strong>${_hivesFmt_(cs('c7').need)} pz</strong></div>
                                <div class="hives-kpi-row"><span>Rim.</span><strong>${_hivesFmt_(cs('c7').rem)} pz</strong></div>
                            </button>
                        </div>
                        <div class="hives-section-title">Sotto-ordini Mensili (clicca per dettaglio)</div>
                        <div class="hives-month-grid">
                            ${ord.mesi.map(m => {
                                const meseBudget = (Number(m.qtyAccordo) || 0) * unitBudget;
                                const accontoTarget = meseBudget * 0.5;
                                const saldoTarget = meseBudget * 0.5;
                                const accontoDone = Number(m.accontoValore || 0) >= accontoTarget && accontoTarget > 0;
                                const saldoDone = Number(m.saldoValore || 0) >= saldoTarget && saldoTarget > 0;
                                return `<button class="hives-card" onclick="_hivesOpenMonthModal_('${m.id}')">
                                        <div class="hives-card-top"><b>${m.label}</b><span>${_hivesFmt_(m.qtyAccordo)} pz</span></div>
                                        <div class="hives-card-sub">Ordine: ${m.sottoOrdine || '—'}</div>
                                        <div class="hives-pay-row"><span class="${accontoDone ? 'ok' : ''}">Acconto</span><span>${_hivesMoney_(m.accontoValore || 0)}</span></div>
                                        <div class="hives-pay-row"><span class="${saldoDone ? 'ok' : ''}">Saldo</span><span>${_hivesMoney_(m.saldoValore || 0)}</span></div>
                                    </button>`;
                            }).join('')}
                        </div>
                        <div class="hives-section-title">Componenti (clicca per confermare arrivi)</div>
                        <div class="hives-comp-grid">
                            ${ord.componenti.map(c => {
                                const st = calc.compStats.find(s => s.id === c.id) || { arrived: 0, rem: 0 };
                                return `<button class="hives-card hives-card-comp" onclick="_hivesOpenCompModal_('${c.id}')">
                                    <div class="hives-card-top"><b>${c.nome}</b><span>${c.codice}</span></div>
                                    <div class="hives-card-sub">Coeff/Pip: ${Number(c.coeffPerPip) || 0} · Prezzo: ${_hivesMoney_(c.prezzoUnit || 0)}</div>
                                    <div class="hives-pay-row"><span>Arrivati</span><span>${_hivesFmt_(st.arrived)}</span></div>
                                    <div class="hives-pay-row"><span>Rimanenti</span><span>${_hivesFmt_(st.rem)}</span></div>
                                </button>`;
                            }).join('')}
                        </div>
                    </div>
                </details>
            </section>
            <div id="hives-modal-root"></div>
        `;
        applicaFade(root);
}

function _hivesOpenKPIModal_(type) {
    const ord = _hivesOrder_();
    _hivesModalCtx = { type: 'kpi', id: type };
    const mr = document.getElementById('hives-modal-root');
    if (!mr) return;
    if (type === 'accordo') {
        mr.innerHTML = `
            <div class="hives-modal-overlay" onclick="_hivesCloseModal_(event)">
                <div class="hives-modal-box" onclick="event.stopPropagation()">
                    <div class="hives-modal-head"><h3>Accordo Totale</h3><button class="hives-btn-x" onclick="_hivesCloseModal_()">✕</button></div>
                    <div class="hives-form-grid">
                        <label>Pezzi totali accordati<input id="hives-kpi-accordo" type="number" min="0" value="${Number(ord.totalAccordoPz)||0}"></label>
                    </div>
                    <div class="hives-actions-row" style="margin-top:14px">
                        <button class="hives-btn" onclick="_hivesKpiSaveAccordo_()">Salva</button>
                    </div>
                </div>
            </div>`;
    } else if (type === 'budget') {
        const unitBudget = ord.componenti.reduce((s, c) => s + ((Number(c.prezzoUnit)||0) * (Number(c.coeffPerPip)||0)), 0);
        const calc = _hivesCalc_(ord);
        const rows = ord.mesi.map(m => {
            const mb = (Number(m.qtyAccordo)||0) * unitBudget;
            return `<tr><td>${m.label}</td><td>${_hivesFmt_(m.qtyAccordo)} pz</td><td>${_hivesMoney_(mb)}</td><td>${_hivesMoney_(m.accontoValore||0)}</td><td>${_hivesMoney_(m.saldoValore||0)}</td></tr>`;
        }).join('');
        mr.innerHTML = `
            <div class="hives-modal-overlay" onclick="_hivesCloseModal_(event)">
                <div class="hives-modal-box hives-modal-box-lg" onclick="event.stopPropagation()">
                    <div class="hives-modal-head"><h3>Riepilogo Pagamenti</h3><button class="hives-btn-x" onclick="_hivesCloseModal_()">✕</button></div>
                    <div class="hives-inline-note">Totale: ${_hivesMoney_(calc.budgetTotale)} &middot; Pagato: ${_hivesMoney_(calc.budgetPagato)} &middot; Residuo: ${_hivesMoney_(calc.budgetResiduo)}</div>
                    <table class="hives-table"><thead><tr><th>Mese</th><th>Qta</th><th>Valore mese</th><th>Acconto</th><th>Saldo</th></tr></thead><tbody>${rows}</tbody></table>
                </div>
            </div>`;
    }
}
function _hivesKpiSaveAccordo_() {
    const val = Math.max(0, Number(document.getElementById('hives-kpi-accordo')?.value || 0));
    const ord = _hivesOrder_();
    ord.totalAccordoPz = val;
    _hivesSave_();
    _hivesCloseModal_();
    _renderHivesTest_();
}

function _hivesOpenMonthModal_(monthId) {
        const ord = _hivesOrder_();
        const m = ord.mesi.find(x => x.id === monthId);
        if (!m) return;
        _hivesSyncMonthAccordo_(ord);
        const unitBudget = ord.componenti.reduce((s, c) => s + ((Number(c.prezzoUnit) || 0) * (Number(c.coeffPerPip) || 0)), 0);
        const meseBudget = (Number(m.qtyAccordo) || 0) * unitBudget;
        _hivesModalCtx = { type: 'month', id: monthId };
        const rows = ord.componenti.map(c => `<tr><td>${c.codice}</td><td>${c.nome}</td><td>${_hivesFmt_(_hivesCompMonthQty_(ord, c, m.id))}</td></tr>`).join('');
        document.getElementById('hives-modal-root').innerHTML = `
            <div class="hives-modal-overlay" onclick="_hivesCloseModal_(event)">
                <div class="hives-modal-box" onclick="event.stopPropagation()">
                    <div class="hives-modal-head"><h3>${m.label}</h3><button class="hives-btn-x" onclick="_hivesCloseModal_()">✕</button></div>
                    <div class="hives-form-grid">
                        <label>Quantità accordata (pz)<input id="hives-m-qty" type="number" min="0" value="${Number(m.qtyAccordo)||0}" readonly></label>
                        <label>Sotto-ordine gestionale<input id="hives-m-sub" type="text" value="${m.sottoOrdine || ''}"></label>
                        <label>Acconto pagato (€)<input id="hives-m-acc" type="number" min="0" value="${Number(m.accontoValore)||0}"></label>
                        <label>Saldo pagato (€)<input id="hives-m-sal" type="number" min="0" value="${Number(m.saldoValore)||0}"></label>
                    </div>
                    <div class="hives-inline-note">Target 50% mese: ${_hivesMoney_(meseBudget * 0.5)} · Totale mese: ${_hivesMoney_(meseBudget)}</div>
                    <div class="hives-actions-row">
                        <button class="hives-btn hives-btn-soft" onclick="document.getElementById('hives-m-acc').value='${Math.round(meseBudget * 0.5)}'">Imposta acconto 50%</button>
                        <button class="hives-btn hives-btn-soft" onclick="document.getElementById('hives-m-sal').value='${Math.round(meseBudget * 0.5)}'">Imposta saldo 50%</button>
                        <button class="hives-btn" onclick="_hivesSaveMonthModal_()">Salva mese</button>
                    </div>
                    <table class="hives-table"><thead><tr><th>Codice</th><th>Componente</th><th>Qta mese</th></tr></thead><tbody>${rows}</tbody></table>
                </div>
            </div>`;
}

function _hivesOpenCompModal_(compId) {
        const ord = _hivesOrder_();
        const c = ord.componenti.find(x => x.id === compId);
        if (!c) return;
        _hivesModalCtx = { type: 'comp', id: compId };
        const rows = ord.mesi.map(m => {
        const fab = _hivesCompMonthQty_(ord, c, m.id);
                const arr = Number((c.ricevuto || {})[m.id]) || 0;
        return `<tr><td>${m.label}</td><td><input type="number" min="0" value="${fab}" onchange="_hivesSetCompPlanned_('${compId}','${m.id}', this.value)"></td><td><input type="number" min="0" value="${arr}" onchange="_hivesSetCompArrived_('${compId}','${m.id}', this.value)"></td><td><button class="hives-btn hives-btn-soft" onclick="_hivesSetCompArrived_('${compId}','${m.id}', '${fab}')">Completo</button></td></tr>`;
        }).join('');
        document.getElementById('hives-modal-root').innerHTML = `
            <div class="hives-modal-overlay" onclick="_hivesCloseModal_(event)">
                <div class="hives-modal-box hives-modal-box-lg" onclick="event.stopPropagation()">
                    <div class="hives-modal-head"><h3>${c.nome}</h3><button class="hives-btn-x" onclick="_hivesCloseModal_()">✕</button></div>
                    <div class="hives-form-grid">
                        <label>Codice materiale<input id="hives-c-code" type="text" value="${c.codice || ''}"></label>
                        <label>Nome componente<input id="hives-c-name" type="text" value="${c.nome || ''}"></label>
                        <label>Prezzo unitario (€)<input id="hives-c-price" type="number" min="0" value="${Number(c.prezzoUnit)||0}"></label>
                        <label>Coeff per Pipistrello<input id="hives-c-coeff" type="number" min="0" value="${Number(c.coeffPerPip)||0}"></label>
                    </div>
                    <div class="hives-actions-row"><button class="hives-btn" onclick="_hivesSaveCompMeta_()">Salva componente</button></div>
                    <table class="hives-table"><thead><tr><th>Mese</th><th>Qta pianificata</th><th>Arrivato</th><th></th></tr></thead><tbody>${rows}</tbody></table>
                </div>
            </div>`;
}

function _hivesSaveMonthModal_() {
        const ord = _hivesOrder_();
        const m = ord.mesi.find(x => x.id === _hivesModalCtx?.id);
        if (!m) return;
        m.sottoOrdine = String(document.getElementById('hives-m-sub')?.value || '').trim();
        m.accontoValore = Math.max(0, Number(document.getElementById('hives-m-acc')?.value || 0));
        m.saldoValore = Math.max(0, Number(document.getElementById('hives-m-sal')?.value || 0));
    _hivesSyncMonthAccordo_(ord);
        _hivesSave_();
        _hivesCloseModal_();
        _renderHivesTest_();
}

function _hivesSaveCompMeta_() {
        const ord = _hivesOrder_();
        const c = ord.componenti.find(x => x.id === _hivesModalCtx?.id);
        if (!c) return;
        c.codice = String(document.getElementById('hives-c-code')?.value || '').trim();
        c.nome = String(document.getElementById('hives-c-name')?.value || '').trim() || c.nome;
        c.prezzoUnit = Math.max(0, Number(document.getElementById('hives-c-price')?.value || 0));
        c.coeffPerPip = Math.max(0, Number(document.getElementById('hives-c-coeff')?.value || 0));
        _hivesSave_();
        _hivesCloseModal_();
        _renderHivesTest_();
}

function _hivesSetCompArrived_(compId, monthId, val) {
        const ord = _hivesOrder_();
        const c = ord.componenti.find(x => x.id === compId);
        if (!c) return;
        c.ricevuto = c.ricevuto || {};
        c.ricevuto[monthId] = Math.max(0, Number(val || 0));
        _hivesSave_();
        _hivesOpenCompModal_(compId);
}

    function _hivesSetCompPlanned_(compId, monthId, val) {
        const ord = _hivesOrder_();
        const c = ord.componenti.find(x => x.id === compId);
        if (!c) return;
        c.pianoMensile = c.pianoMensile || {};
        c.pianoMensile[monthId] = Math.max(0, Number(val || 0));
        _hivesSyncMonthAccordo_(ord);
        _hivesSave_();
        _hivesOpenCompModal_(compId);
    }

function _hivesCloseModal_(ev) {
        if (ev && ev.target && ev.target.className && String(ev.target.className).indexOf('hives-modal-overlay') === -1) return;
        const root = document.getElementById('hives-modal-root');
        if (root) root.innerHTML = '';
        _hivesModalCtx = null;
}

function _hivesResetAll_() {
        if (!confirm('Cancellare tutti i dati della pagina TEST HIVES?')) return;
        try { localStorage.removeItem(_HIVES_TEST_LS_KEY); } catch (_) {}
        _hivesState = _hivesDefaultState_();
        _renderHivesTest_();
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

    // 🔥 Avvia subito warm-up GAS in background (senza await: non blocca la navigazione)
    _prefetchBackground();
    // Carica impostazioni PRIMA del primo render della pagina.
    // Evita UI iniziale senza colori stati/operatori e dropdown monchi.
    try {
        await caricaDatiIniziali();
    } catch (e) {
        console.warn('[Boot] caricaDatiIniziali DOMContentLoaded:', e);
    }

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

/*******************************************************************************
 * SEZIONE QR CODE — SCANSIONE POSTAZIONE
 * Permette di inquadrare un QR stampato su ogni tavolo/postazione di produzione.
 * Il QR codifica l'ID della postazione (es. "PROD:IMBALLAGGI").
 * Dopo la scansione si apre un modale per scegliere l'ordine/gli articoli
 * e lo stato di destinazione, senza aprire la pagina produzione.
 *******************************************************************************/

/** Postazioni default — usate solo al primo avvio se localStorage è vuoto. */
const _QR_POSTAZIONI_DEFAULT = [
    { codice: 'PROD:IMBALLAGGI',   icona: '📦', nome: 'Tavolo Imballaggi',         domanda: 'Cosa stai imballando?',       statoDefault: 'IMBALLATO' },
    { codice: 'PROD:LAVORAZIONE',  icona: '🔧', nome: 'Postazione Lavorazione',    domanda: 'Cosa stai lavorando?',        statoDefault: 'IN LAVORAZIONE' },
    { codice: 'PROD:ASSEMBLAGGIO', icona: '🛠️', nome: 'Postazione Assemblaggio',   domanda: 'Cosa stai assemblando?',      statoDefault: 'IN LAVORAZIONE' },
    { codice: 'PROD:CONTROLLO',    icona: '🔍', nome: 'Controllo Qualità',          domanda: 'Cosa stai controllando?',     statoDefault: 'IN PRODUZIONE' },
    { codice: 'PROD:MAGAZZINO',    icona: '🏭', nome: 'Magazzino / Preparazione',   domanda: 'Cosa stai preparando?',       statoDefault: 'PREPARARE PER LAVORAZIONE' },
    { codice: 'PROD:SPEDIZIONI',   icona: '🚚', nome: 'Spedizioni',                 domanda: 'Cosa stai spedendo?',         statoDefault: 'IMBALLATO' },
];

/** Array postazioni (sorgente dati). Salvato in localStorage. */
let _qrPostazioniArr = [];

/** Dizionario codice→postazione (usato dallo scanner). Ricostruito da _qrPostazioniArr. */
let QR_POSTAZIONI = {};

function _qrCaricaPostazioni() {
    try {
        const saved = localStorage.getItem('qrPostazioni');
        _qrPostazioniArr = saved ? JSON.parse(saved) : [..._QR_POSTAZIONI_DEFAULT];
    } catch { _qrPostazioniArr = [..._QR_POSTAZIONI_DEFAULT]; }
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
// Carica subito alla definizione (lo script è eseguito prima di window.onload)
_qrCaricaPostazioni();

let _qrStream            = null;  // MediaStream attivo
let _qrAnimFrame         = null;  // requestAnimationFrame handle
let _qrPostazioneAttuale = null;  // { codice, nome, icona, domanda, statoDefault }
let _qrStatoScelto       = null;  // stringa stato scelto per lo spostamento
let _qrOrdineSelezionato = null;  // numero ordine selezionato

/** Rilevamento iOS PWA (standalone): getUserMedia usa ReplayKit → registrazione schermo attiva.
 *  Su iOS usiamo input[type=file capture=environment] + jsQR su immagine statica. */
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

    // Controllo libreria jsQR
    if (typeof jsQR === 'undefined') {
        if (errDiv) { errDiv.textContent = '⚠️ Libreria scanner non caricata. Usa il campo manuale.'; errDiv.style.display = 'block'; }
        return;
    }
    // Controllo supporto fotocamera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (errDiv) { errDiv.textContent = '⚠️ Fotocamera non supportata da questo browser. Usa il campo manuale.'; errDiv.style.display = 'block'; }
        return;
    }
    try {
        // Riusa lo stream esistente se già attivo (evita richiesta permesso ogni volta)
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
        if (!_qrStream) return; // scanner già chiuso
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

/** Ferma la fotocamera e chiude il modale scanner. */
function _chiudiScannerQR() {
    if (_qrAnimFrame) { cancelAnimationFrame(_qrAnimFrame); _qrAnimFrame = null; }
    // NON fermiamo i track: lo stream resta attivo così alla riapertura
    // non viene richiesto il permesso fotocamera di nuovo.
    // Lo stream verrà fermato solo allo scaricamento pagina (vedere window.onbeforeunload).
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
    if (_ordiniAutocompleteCache.length === 0) {
        fetchJson('PROGRAMMA PRODUZIONE DEL MESE').then(dati => {
            const seen = new Set();
            _ordiniAutocompleteCache = dati
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

    // Reset selezione
    document.getElementById('qr-articoli-wrap').style.display = 'none';
    document.getElementById('qr-stato-wrap').style.display    = 'none';
    document.getElementById('btn-qr-conferma').disabled       = true;
    _qrOrdineSelezionato = null;
    _qrStatoScelto       = null;

    if (!query) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }

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
            <span class="ac-ordine">ORD. ${o.ordine}</span>
            <span class="ac-cliente">${o.cliente}${o.riferimento ? ' <em style="color:#94a3b8;font-size:11px">('+o.riferimento+')</em>' : ''}</span>
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
    if (ordHdr) ordHdr.innerHTML = `<span class="qr-ord-lbl"><b>ORD. ${nOrd}</b></span><span class="qr-cli-lbl">${cliente}</span>`;
    if (articoliList) articoliList.innerHTML = '<div class="qr-loading"><i class="fas fa-spinner fa-spin"></i> Caricamento articoli...</div>';
    articoliWrap.style.display = 'block';

    // Recupera righe: prima dalla cache locale, poi dal server
    let righe = [];
    if (_attiviProd && _attiviProd.length > 0) {
        righe = _attiviProd.filter(r =>
            String(r.ordine || '').trim() === String(nOrd).trim() &&
            String(r.archiviato || '').toUpperCase() !== 'TRUE'
        );
    }
    if (righe.length === 0) {
        try {
            const tutti = await fetchJson('PROGRAMMA PRODUZIONE DEL MESE');
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

    // Render articoli con checkbox (tutti pre-selezionati)
    articoliList.innerHTML = righe.map(art => {
        const codice   = art.codice && art.codice !== 'false' ? art.codice : 'Senza Codice';
        const statoConf = (listaStati || []).find(s => s.nome.toUpperCase() === (art.stato || '').toUpperCase()) || { colore: '#94a3b8' };
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
    const stati = (listaStati && listaStati.length > 0) ? listaStati : [
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
    document.querySelectorAll('.qr-stato-pill').forEach(p => {
        const conf = (listaStati || []).find(x => x.nome === p.dataset.stato);
        const col  = conf ? conf.colore : '#94a3b8';
        p.classList.remove('qr-stato-pill-sel');
        p.style.background = '';
        p.style.color      = col;
        p.style.borderColor= col;
    });
    const conf = (listaStati || []).find(x => x.nome === btn.dataset.stato);
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
    let errori = 0;

    for (const idRiga of idRighe) {
        try {
            await aggiornaDato(null, idRiga, 'stato', _qrStatoScelto);
            if (_attiviProd) {
                const r = _attiviProd.find(x => String(x.id_riga) === String(idRiga));
                if (r) r.stato = _qrStatoScelto;
            }
            _syncKanbanFromStato(idRiga, _qrStatoScelto);
        } catch { errori++; }
    }

    if (errori === 0) {
        notificaElegante(`✅ ${idRighe.length} articolo/i → ${_qrStatoScelto}`);
        delete cacheContenuti['PROGRAMMA PRODUZIONE DEL MESE'];
        _lsCacheDel('_html_PROGRAMMA PRODUZIONE DEL MESE');
    } else {
        notificaElegante(`⚠️ ${errori} errori su ${idRighe.length} articoli`, 'error');
    }
    _chiudiModaleQRAzione();
}

/* ═══════════════════════════════════════════════════════════════
   GESTIONE POSTAZIONI — IMPOSTAZIONI
   CRUD completo: crea / modifica / elimina / stampa
═══════════════════════════════════════════════════════════════ */

/** Apre il modal in modalità CREAZIONE nuova postazione. */
function _qrApriModalNuova() {
    _qrApriModalEdit(null);
}

/** Apre il modal in modalità MODIFICA per la postazione all'indice idx. */
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

    // Popola select stati
    const sel = document.getElementById('qr-edit-stato');
    const stati = (listaStati && listaStati.length > 0) ? listaStati : _QR_POSTAZIONI_DEFAULT.map(d => ({ nome: d.statoDefault, colore: '#94a3b8' }));
    const unici = [...new Map(stati.map(s => [s.nome, s])).values()];
    sel.innerHTML = unici.map(s =>
        `<option value="${s.nome}" ${s.nome === (p.statoDefault || '') ? 'selected' : ''}>${s.nome}</option>`
    ).join('');

    const modal = document.getElementById('modal-qr-edit');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');

    // Aggiorna preview QR dopo che il modal è visibile (canvas deve avere dimensioni > 0)
    requestAnimationFrame(() => _qrAggiornaPrevQR());
}

function _qrChiudiModalEdit() {
    const modal = document.getElementById('modal-qr-edit');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

/** Auto-genera il codice QR a partire dal nome. */
function _qrAggiornaCodice() {
    const nome   = (document.getElementById('qr-edit-nome')?.value || '').trim();
    const codice = 'PROD:' + nome.toUpperCase()
        .replace(/[ÀÁÂÃÄÅ]/g, 'A').replace(/[ÈÉÊË]/g, 'E').replace(/[ÌÍÎÏ]/g, 'I')
        .replace(/[ÒÓÔÕÖ]/g, 'O').replace(/[ÙÚÛÜ]/g, 'U')
        .replace(/[^A-Z0-9]/g, '');
    const el = document.getElementById('qr-edit-codice');
    if (el) el.value = codice;
}

/** Richiamato da pulsante "↺" — ricalcola il codice dal nome attuale. */
function _qrRicalcolaCodice() {
    _qrAggiornaCodice();
    _qrAggiornaPrevQR();
}

/** Ridisegna il canvas di anteprima nel modal. */
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
            // Fallback: Google Charts API (non richiede lib locale)
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(codice)}`;
        }
    } catch (e) {
        // Fallback api esterna se lib fallisce
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(codice)}`;
    }
}

/** Salva la postazione dal modal (crea o aggiorna). */
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
    // Aggiorna la sezione impostazioni se è aperta
    caricaInterfacciaImpostazioni();
    setTimeout(() => _qrRiapriSezioneImpostazioni(), 120);
}

/** Elimina la postazione all'indice idx con conferma. */
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

/** Riapre la sezione postazioni dopo un re-render delle impostazioni. */
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

/** Disegna il QR code su ogni img nella lista delle postazioni. */
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

/** Stampa il QR della singola postazione aperta nel modal. */
function _qrStampaSingola() {
    const codice  = (document.getElementById('qr-edit-codice')?.value || '').trim();
    const nome    = (document.getElementById('qr-edit-nome')?.value   || '').trim();
    const icona   = (document.getElementById('qr-edit-icona')?.value  || '').trim() || '📍';
    const domanda = (document.getElementById('qr-edit-domanda')?.value|| '').trim();
    if (!codice) { notificaElegante('Inserisci nome e codice prima di stampare.', 'error'); return; }
    _qrApriFinestroStampa([{ codice, nome, icona, domanda }]);
}

/** Stampa il QR della postazione all'indice idx (da lista impostazioni). */
function _qrStampaSingolaIdx(idx) {
    const p = _qrPostazioniArr[idx];
    if (p) _qrApriFinestroStampa([p]);
}

/** Stampa tutti i QR code. */
function _qrStampaTutte() {
    if (_qrPostazioniArr.length === 0) { notificaElegante('Nessuna postazione da stampare.', 'error'); return; }
    _qrApriFinestroStampa(_qrPostazioniArr);
}

/**
 * Apre una finestra di stampa con i QR code delle postazioni passate.
 * @param {Array} postazioni
 */
async function _qrApriFinestroStampa(postazioni) {
    // Genera i QR come data URL per ogni postazione
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

    const win = window.open('', '_blank', 'width=900,height=700');
    if (win) { win.document.write(html); win.document.close(); }
    else { notificaElegante('⚠️ Abilita i popup per la stampa.', 'error'); }
}

/* ═══════════════════════════════════════════════════════════════
   FINE SEZIONE QR CODE
═══════════════════════════════════════════════════════════════ */

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
    // Ignora click entro 800ms dall'apertura: previene click-through da tap mobile
    const modalAiuto = document.getElementById('modalAiuto');
    if (modalAiuto) {
        modalAiuto.addEventListener('click', function(e) {
            if (e.target !== this) return;
            if (Date.now() - (this._openedAt || 0) < 800) return;  // grace period
            chiudiModal();
        });
    }

    // FAB "+" — un solo listener 'click'.
    // Il 300ms delay è eliminato dal CSS (touch-action: manipulation).
    // Il guard in apriNuovaRichiesta() controlla il DOM (display === 'flex').
    const fabBtn = document.getElementById('btn-nuova-richiesta');
    if (fabBtn) {
        fabBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            apriNuovaRichiesta();
        });
    }

    // ── PULL TO REFRESH (disabilitato: usa "Aggiorna" nel menu account) ─────
    (function initPullToRefresh() {
        // Rimosso: il refresh viene gestito dal pulsante "Aggiorna" nel menu account
    })();
});
