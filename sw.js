/* ============================================================
   Service Worker PROD — notifiche push VAPID native
   Nessun servizio di terze parti richiesto.
   Aggiornato: 2026-03-18
   v16: bump cache v51 - fix auth sessioni, orario 19:30
   ============================================================ */
'use strict';

var GAS_URL = 'https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec';
var APP_URL = 'https://alessiocostanza3-ctrl.github.io/gestion-produzione-ombre/';

var SHELL_CACHE = 'prod-shell-v97';
var SHELL_ASSETS = [
    APP_URL,
    APP_URL + 'index.html',
    APP_URL + 'style.css?v=20260325a',
    APP_URL + 'script.js?v=20260325d',
    APP_URL + 'manifest.json'
];

/* ---- ciclo di vita ---- */
self.addEventListener('install', function(e) {
    self.skipWaiting();
    // Pre-cacha la shell dell'app in background durante l'install
    e.waitUntil(
        caches.open(SHELL_CACHE).then(function(cache) {
            return cache.addAll(SHELL_ASSETS.map(function(url) {
                // usa no-cache per scaricare versioni fresche al deploy
                return new Request(url, { cache: 'no-cache' });
            })).catch(function(err) {
                // Se un asset fallisce non bloccare l'install
                console.warn('[SW] pre-cache parzialmente fallita:', err);
            });
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) {
                    return k.startsWith('prod-shell-') && k !== SHELL_CACHE;
                }).map(function(k) { return caches.delete(k); })
            );
        }).then(function() { return clients.claim(); })
    );
});

/* ---- intercetta fetch: network-first per shell, cache fallback per tutto il resto ---- */
self.addEventListener('fetch', function(e) {
    var url = e.request.url;
    // Non intercettare chiamate GAS, push, o cross-origin non-shell
    if (url.indexOf('script.google.com') !== -1) return;
    if (e.request.method !== 'GET') return;
    // Solo gli asset della shell usano cache-first
    var isShell = SHELL_ASSETS.some(function(a) { return url === a || url.replace(/\?.*$/, '') === a; });
    if (!isShell) return;

    e.respondWith(
        caches.open(SHELL_CACHE).then(function(cache) {
            return fetch(e.request, { cache: 'no-store' }).then(function(res) {
                if (res && res.ok) cache.put(e.request, res.clone());
                return res;
            }).catch(function(err) {
                console.warn('[SW] network fallita, uso cache per', e.request.url, err);
                return cache.match(e.request).then(function(cached) {
                    if (cached) return cached;
                    return fetch(e.request);
                });
            });
        })
    );
});

/* ---- ricezione push ---- */
self.addEventListener('push', function(event) {
    event.waitUntil(
        caches.open('prod-auth')
            .then(function(c) { return c.match('username'); })
            .then(function(r)  { return r ? r.text() : Promise.resolve(null); })
            .then(function(username) {
                if (!username) return _showNotif_('PROD', 'Hai nuove notifiche', null);
                // markRead=0: il SW legge senza segnare come lette (evita race condition multi-device)
                return fetch(GAS_URL + '?azione=getNotifiche&username=' + encodeURIComponent(username) + '&markRead=0')
                    .then(function(r) { return r.json(); })
                    .then(function(d) {
                        if (!d || d.status === 'none') {
                            return _leggiUltimaNotifCache_().then(function(n) {
                                var titolo = n ? n.titolo : 'PROD';
                                var corpo  = n ? n.corpo   : 'Nessuna nuova notifica';
                                if (!_deveMostrareNotificaVisibile_(username, titolo)) return;
                                return _showNotif_(titolo, corpo, username);
                            });
                        }
                        var titolo = d.titolo || 'PROD';
                        var corpo  = d.corpo  || '';
                        var all    = d.all    || [{ titolo: titolo, corpo: corpo }];
                        // Salva in cache come fallback per futuri fetch lenti/offline
                        _salvaUltimaNotifCache_(titolo, corpo);
                        // Broadcast all'app: aggiorna localStorage e badge
                        _broadcastNotifiche_(username, all);
                        if (!_deveMostrareNotificaVisibile_(username, titolo)) return;
                        return _showNotif_(titolo, corpo, username);
                    })
                    .catch(function() {
                        // Fetch GAS fallito (cold start / offline): usa l'ultima notifica in cache
                        return _leggiUltimaNotifCache_().then(function(n) {
                            var titolo = n ? n.titolo : 'PROD';
                            var corpo  = n ? n.corpo   : 'Hai nuove notifiche';
                            if (!_deveMostrareNotificaVisibile_(username, titolo)) return;
                            return _showNotif_(titolo, corpo, username);
                        });
                    });
            })
    );
});

/* ---- click sulla notifica ---- */
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var url      = (event.notification.data && event.notification.data.url) || APP_URL;
    var username = event.notification.data && event.notification.data.username;
    // Segna come lette sul server al click
    if (username) {
        fetch(GAS_URL + '?azione=segnaLetteNotifiche&username=' + encodeURIComponent(username)).catch(function(){});
    }
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].url.indexOf(APP_URL) !== -1 && 'focus' in list[i])
                    return list[i].focus();
            }
            return clients.openWindow(url);
        })
    );
});

/* ---- helper ---- */
function _showNotif_(titolo, corpo, username) {
    return self.registration.showNotification(titolo, {
        body:     corpo,
        icon:     APP_URL + 'logo.png',
        badge:    APP_URL + 'logo.png',
        tag:      'prod-notif',
        renotify: true,
        data:     { url: APP_URL, username: username || null }
    });
}

function _deveMostrareNotificaVisibile_(username, titolo) {
    // GAS filtra già l'orario lavorativo prima di mandare il ping push.
    // Qui mostriamo sempre la notifica: se il push è arrivato, va mostrato.
    return true;
}

function _isRiepilogoNotifiche_(titolo) {
    return /riepilogo notifiche|notifiche da leggere/i.test(String(titolo || ''));
}

function _isOrarioRiepilogoNotifiche_() {
    var now  = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    return mins >= 9 * 60 && mins < 19 * 60 + 30; // 09:00 – 19:30
}

/** Invia notifiche alle finestre aperte dell'app (aggiorna badge + lista in-app) */
function _broadcastNotifiche_(username, all) {
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
        list.forEach(function(client) {
            client.postMessage({ type: 'NUOVE_NOTIFICHE', username: username, notifiche: all });
        });
    });
}

/** Salva titolo+corpo dell'ultima notifica ricevuta (usata come fallback se il fetch GAS è lento) */
function _salvaUltimaNotifCache_(titolo, corpo) {
    caches.open('prod-last-notif').then(function(c) {
        c.put('last', new Response(JSON.stringify({ titolo: titolo, corpo: corpo })));
    }).catch(function(err) { console.warn('[SW] salvataggio ultima notifica in cache fallito:', err); });
}

/** Legge l'ultima notifica dalla cache. Restituisce null se non presente. */
function _leggiUltimaNotifCache_() {
    return caches.open('prod-last-notif')
        .then(function(c) { return c.match('last'); })
        .then(function(r) { return r ? r.json() : null; })
        .catch(function() { return null; });
}
