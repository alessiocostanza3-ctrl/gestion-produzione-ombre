// PROD — Auth / Login
// Estratto da script.js — 28 marzo 2026
// Dipendenze: ../core/config.js, ../core/session.js

import { URL_GOOGLE } from '../core/config.js';
import { setUtenteAttuale } from '../core/session.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function hashSHA256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// ── Rate limiting: blocco temporaneo dopo troppi tentativi falliti ────────────
let _loginFailCount = 0;
let _loginLockUntil = 0;

function _loginIsLocked() { return Date.now() < _loginLockUntil; }
function _loginRecordFail() {
    _loginFailCount++;
    if (_loginFailCount >= 5) {
        _loginLockUntil = Date.now() + 30000;
        _loginFailCount = 0;
    }
}
function _loginRecordSuccess() { _loginFailCount = 0; _loginLockUntil = 0; }

// ── Login / Registrazione ─────────────────────────────────────────────────────

async function _verificaAccessoUtente() {
    const errorDiv = document.getElementById('login-error');
    errorDiv.innerText = "";
    errorDiv.style.color = "";

    const isAdmin = document.getElementById('login-view-admin')?.style.display !== 'none';

    // — Modalità ADMIN —
    if (isAdmin) {
        const codice = (document.getElementById('login-codice')?.value || '').trim();
        // PIN locale rimosso: la verifica avviene sempre via GAS server-side
        errorDiv.innerText = "Usa il pulsante Entra per accedere come admin.";
        return;
    }

    // — Blocco rate limiting —
    if (_loginIsLocked()) {
        const secs = Math.ceil((_loginLockUntil - Date.now()) / 1000);
        errorDiv.innerText = 'Troppi tentativi. Riprova tra ' + secs + ' secondi.';
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
            _loginRecordSuccess();
            setUtenteAttuale({
                nome: r.nome,
                ruolo: r.ruolo,
                email: r.email,
                vistaSimulata: r.nome,
                sessionToken: r.sessionToken || '',
                sessionExpiresAt: r.sessionExpiresAt || ''
            });
            window.salvaEApriDashboard();
        } else {
            _loginRecordFail();
            if (_loginIsLocked()) {
                errorDiv.innerText = 'Troppi tentativi. Riprova tra 30 secondi.';
            } else {
                errorDiv.innerText = r.message || "Credenziali non valide.";
            }
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
            if (errorDiv) errorDiv.innerText = r.message || "Impossibile creare l'account.";
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

// ── Espone su window le funzioni chiamate da index.html inline scripts ────────
export function registerGlobals() {
    window.hashSHA256              = hashSHA256;
    window._verificaAccessoUtente  = _verificaAccessoUtente;
    window._creaAccountUtente      = _creaAccountUtente;
}

export { hashSHA256, _verificaAccessoUtente, _creaAccountUtente };
