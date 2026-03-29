// head-init.js — PROD
// Script caricato con defer, contiene:
//   1. Global error/promise handler (installato prima possibile)
//   2. Font Awesome: converte preload → stylesheet dopo DOMContentLoaded
//   3. Funzioni login disponibili indipendentemente da script.bundle.js

'use strict';

// ─── 1. Global error handler ────────────────────────────────────────────────
(function() {
    var NOISE = ['ResizeObserver loop', 'Script error', 'AbortError',
                 'NetworkError', 'Load failed', 'Failed to fetch'];
    function isNoise(msg) {
        var s = msg ? String(msg) : '';
        return NOISE.some(function(p) { return s.indexOf(p) !== -1; });
    }
    function showCriticalToast() {
        function _show() {
            var el = document.getElementById('toast-notifica');
            if (!el) {
                el = document.createElement('div');
                el.id = 'toast-notifica';
                document.body.appendChild(el);
            }
            el.className = 'toast-notifica toast-error';
            el.innerText = '\u26a0 Errore imprevisto. Ricarica se l\u2019app non risponde.';
            void el.offsetWidth;
            el.classList.add('visible');
            clearTimeout(el._hideTimer);
            el._hideTimer = setTimeout(function() { el.classList.remove('visible'); }, 5000);
        }
        if (document.body) { _show(); }
        else { document.addEventListener('DOMContentLoaded', _show, { once: true }); }
    }
    window.onerror = function(msg, src, line, col, err) {
        if (isNoise(msg)) return false;
        console.error('[APP ERROR]', { message: msg, source: src, line: line, col: col, error: err });
        showCriticalToast();
        return false;
    };
    window.onunhandledrejection = function(evt) {
        var r = evt && evt.reason;
        var msg = r && r.message ? r.message : String(r);
        if (isNoise(msg) || (r && r.name === 'AbortError')) return;
        console.error('[UNHANDLED PROMISE]', r);
        showCriticalToast();
    };
})();

// ─── 2. Font Awesome: converti preload → stylesheet dopo DOMContentLoaded ───
document.addEventListener('DOMContentLoaded', function() {
    var fa = document.querySelector('link[data-fa-nonblock]');
    if (fa) { fa.rel = 'stylesheet'; fa.removeAttribute('as'); }
}, { once: true });

// ─── 3. Funzioni login ────────────────────────────────────────────────────────
var _GAS_URL_LOGIN_ = 'https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec';

function setLoginMode(mode) {
    var isAdmin = mode === 'admin';
    var vu  = document.getElementById('login-view-utente');
    var va  = document.getElementById('login-view-admin');
    var err = document.getElementById('login-error');
    if (vu) vu.style.display  = isAdmin ? 'none' : '';
    if (va) va.style.display  = isAdmin ? ''     : 'none';
    if (err) err.innerText = '';
    if (isAdmin) setTimeout(function() { var c = document.getElementById('login-codice'); if (c) c.focus(); }, 80);
}

function togglePasswordVisibility() {
    var pwd  = document.getElementById('login-password');
    var icon = document.getElementById('eye-icon');
    if (!pwd) return;
    var isHidden = pwd.type === 'password';
    pwd.type = isHidden ? 'text' : 'password';
    if (icon) icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
}

function verificaAccesso() {
    var errorDiv = document.getElementById('login-error');
    if (errorDiv) errorDiv.innerText = '';

    var adminView = document.getElementById('login-view-admin');
    var isAdmin   = adminView && adminView.style.display !== 'none';

    if (isAdmin) {
        var codice = (document.getElementById('login-codice') ? document.getElementById('login-codice').value : '').trim();
        if (!codice) { if (errorDiv) errorDiv.innerText = 'Inserisci il PIN.'; return; }
        var btnAdmin = document.querySelector('#login-view-admin .btn-login');
        if (btnAdmin) btnAdmin.disabled = true;
        if (errorDiv) errorDiv.innerText = 'Verifica in corso...';
        // PIN trasmesso via POST (non più in querystring/URL)
        fetch(_GAS_URL_LOGIN_, {
            method: 'POST',
            body: JSON.stringify({ azione: 'verificaPinAdmin', pin: codice })
        })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data && data.status === 'ok') {
                    try { localStorage.setItem('sessioneUtente', JSON.stringify(data.sessione)); } catch(e) {}
                    try { sessionStorage.setItem('sessioneUtente', JSON.stringify(data.sessione)); } catch(e) {}
                    try { document.documentElement.classList.remove('needs-login'); } catch(e) {}
                    window.location.reload();
                } else {
                    if (errorDiv) errorDiv.innerText = (data && data.msg) ? data.msg : 'PIN non valido.';
                    var input = document.getElementById('login-codice');
                    if (input) { input.value = ''; input.focus(); }
                    if (btnAdmin) btnAdmin.disabled = false;
                }
            })
            .catch(function() {
                if (errorDiv) errorDiv.innerText = 'Errore di connessione. Riprova.';
                if (btnAdmin) btnAdmin.disabled = false;
            });
        return;
    }

    // ── LOGIN UTENTE ── delega a script.bundle.js
    if (typeof _verificaAccessoUtente === 'function') {
        _verificaAccessoUtente();
    } else if (errorDiv) {
        errorDiv.innerText = 'Caricamento in corso, riprova tra un secondo.';
    }
}

function creaAccount() {
    var errorDiv = document.getElementById('login-error');
    if (errorDiv) errorDiv.innerText = '';
    if (typeof _creaAccountUtente === 'function') {
        _creaAccountUtente();
    } else if (errorDiv) {
        errorDiv.innerText = 'Caricamento in corso, riprova tra un secondo.';
    }
}

// ─── 4. Fallback DOMContentLoaded: aggiorna UI con sessione salvata ──────────
document.addEventListener('DOMContentLoaded', function() {
    var sessione = null;
    try { sessione = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente'); } catch (e) {}
    if (!sessione) return;
    var utente = null;
    try { utente = JSON.parse(sessione); } catch (e) { return; }

    var overlay = document.getElementById('login-overlay');
    if (overlay) overlay.style.display = 'none';

    var nameEl      = document.getElementById('user-name-display');
    var avatarEl    = document.getElementById('user-avatar-icon');
    var avatarElMob = document.getElementById('user-avatar-icon-mobile');
    if (utente && utente.nome) {
        if (nameEl)      nameEl.innerText      = String(utente.nome).toUpperCase();
        if (avatarEl)    avatarEl.innerText    = String(utente.nome).charAt(0).toUpperCase();
        if (avatarElMob) avatarElMob.innerText = String(utente.nome).charAt(0).toUpperCase();
        try {
            var k = String(utente.nome).toUpperCase().trim();
            var savedColor = localStorage.getItem('avatarColor_' + k);
            if (savedColor) document.documentElement.style.setProperty('--avatar-user-color', savedColor);
        } catch (e) {}
    }
});
