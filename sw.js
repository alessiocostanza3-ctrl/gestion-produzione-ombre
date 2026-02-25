/* ============================================================
   Service Worker PROD — notifiche push VAPID native
   Nessun servizio di terze parti richiesto.
   Aggiornato: 2026-02-25
   ============================================================ */
'use strict';

var GAS_URL = 'https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec';
var APP_URL = 'https://alessiocostanza3-ctrl.github.io/gestion-produzione-ombre/';

/* ---- ciclo di vita ---- */
self.addEventListener('install',  function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });

/* ---- ricezione push ---- */
self.addEventListener('push', function(event) {
    event.waitUntil(
        caches.open('prod-auth')
            .then(function(c) { return c.match('username'); })
            .then(function(r)  { return r ? r.text() : Promise.resolve(null); })
            .then(function(username) {
                if (!username) return _showNotif_('PROD', 'Hai nuove notifiche');
                return fetch(GAS_URL + '?azione=getNotifiche&username=' + encodeURIComponent(username))
                    .then(function(r) { return r.json(); })
                    .then(function(d) {
                        if (!d || d.status === 'none') return _showNotif_('PROD', 'Hai nuove notifiche');
                        return _showNotif_(d.titolo || 'PROD', d.corpo || '');
                    })
                    .catch(function() { return _showNotif_('PROD', 'Hai nuove notifiche'); });
            })
    );
});

/* ---- click sulla notifica ---- */
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var url = (event.notification.data && event.notification.data.url) || APP_URL;
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
function _showNotif_(titolo, corpo) {
    return self.registration.showNotification(titolo, {
        body:     corpo,
        icon:     APP_URL + 'logo.png',
        badge:    APP_URL + 'logo.png',
        tag:      'prod-notif',
        renotify: true,
        data:     { url: APP_URL }
    });
}
