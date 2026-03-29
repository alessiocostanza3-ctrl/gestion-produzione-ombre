// PROD — Auth / Session UI
// Estratto da script.js — 28 marzo 2026
// Profilo sidebar, avatar, blocco orario, richiesta accesso fuori orario

import { URL_GOOGLE } from '../core/config.js';
import { utenteAttuale } from '../core/session.js';

// ── Profilo Sidebar ──────────────────────────────────────────────────────────

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
}

// ── Avatar Colors ──────────────────────────────────────────────────────────

/** Restituisce il colore avatar salvato per un operatore (UPPERCASE). Fallback: grigio */
let _avatarColorsCache = {};

function _getOpColor(nome) {
    try {
        const k = String(nome || '').toUpperCase().trim();
        if (_avatarColorsCache[k]) return _avatarColorsCache[k];
        return localStorage.getItem('avatarColor_' + k) || '#374151';
    } catch { return '#374151'; }
}

const _NOME_CANON = {
    'ALESSIO'  : 'Alessio',
    'RICCARDO' : 'Riccardo',
    'FABIO'    : 'Fabio T.',
    'FABIO T'  : 'Fabio T.',
    'FABIO T.' : 'Fabio T.',
    'NICCOLO'  : 'Niccol\u00f2',
    "NICCOLO'" : 'Niccol\u00f2',
    'NICCOL\u00d2\'': 'Niccol\u00f2',
    'RAYMOND'  : 'Raymond',
    'SIMONE'   : 'Simone',
    'GIACOMO'  : 'Giacomo',
};
function _normNome(n) {
    if (!n) return n;
    const k = String(n).trim().toUpperCase();
    if (_NOME_CANON[k]) return _NOME_CANON[k];
    return String(n).trim().toLowerCase().replace(/(?:^|\s|\.)\S/g, c => c.toUpperCase());
}

const _PREDEFINED_AVATAR_COLORS = ['#8fe45e','#6366f1','#f59e0b','#ec4899','#06b6d4','#f87171','#a78bfa','#34d399'];

function _initAvatarColor() {
    if (!utenteAttuale || !utenteAttuale.nome) return;
    const saved = _getOpColor(utenteAttuale.nome);
    if (window._renderCustomSwatches) window._renderCustomSwatches();
    if (window._applyAvatarColorUI) window._applyAvatarColorUI(saved);
}

async function _caricaColoriAvatarDaServer() {
    try {
        const res = await fetch(`${URL_GOOGLE}?azione=getAvatarColors`);
        if (!res.ok) return;
        const map = await res.json();
        if (typeof map !== 'object' || Array.isArray(map)) return;
        Object.entries(map).forEach(([nome, colore]) => {
            if (!colore) return;
            const k = nome.toUpperCase().trim();
            _avatarColorsCache[k] = colore;
            try { localStorage.setItem('avatarColor_' + k, colore); } catch {}
        });
        if (utenteAttuale?.nome) {
            const mioColore = map[utenteAttuale.nome.toUpperCase().trim()];
            if (mioColore && window._applyAvatarColorUI) window._applyAvatarColorUI(mioColore);
        }
        // Ri-vernicia i badge degli altri operatori gi\u00e0 nel DOM
        if (typeof window._repaintOpColors === 'function') window._repaintOpColors();
    } catch (e) {
        console.warn('_caricaColoriAvatarDaServer:', e);
    }
}

// ── Blocco orario accesso ──────────────────────────────────────────────────

function _isUtenteEsente() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const nome = utenteAttuale.nome.toUpperCase();
    return nome === 'ALESSIO' || nome === '0000' || utenteAttuale.ruolo === 'MASTER';
}

function _isCommerciale() {
    if (!utenteAttuale) return false;
    return String(utenteAttuale.ruolo || '').toUpperCase() === 'COMMERCIALE';
}
function _isOrarioConsentito() {
    const now  = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    return mins >= 8 * 60 + 30 && mins < 19 * 60 + 30; // 08:30 \u2013 19:30
}

function _checkOrarioAccesso(mostraMessaggio) {
    if (sessionStorage.getItem('_accesso_extra_') === '1') {
        _sbloccaSchermo_();
        return true;
    }
    if (_isUtenteEsente() || _isOrarioConsentito()) {
        _sbloccaSchermo_();
        return true;
    }
    if (mostraMessaggio !== false) {
        _bloccaSchermo_();
    }
    return false;
}

function _bloccaSchermo_() {
    if (document.getElementById('_lock-screen_')) return;
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
        <div style="font-size:3rem">\ud83d\udd12</div>
        <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.02em">App bloccata</div>
        <div style="font-size:0.95rem;color:#94a3b8;text-align:center;max-width:280px;line-height:1.5">
            L'app \u00e8 disponibile dalle <strong style="color:#e2e8f0">08:30</strong> alle
            <strong style="color:#e2e8f0">19:30</strong>.<br>
            Si sbloccher\u00e0 automaticamente.
        </div>
        ${identitaBlock}
        <button id="_btn-chiedi-accesso_"
            onclick="_richiestaAccessoFuoriOrario_()"
            style="margin-top:16px;padding:12px 28px;border-radius:12px;border:none;
                   background:#f59e0b;color:#0f172a;font-weight:700;font-size:0.95rem;
                   cursor:pointer;letter-spacing:0.02em;transition:background 0.15s">
            \ud83d\udd13 Chiedi accesso a Alessio
        </button>
        <div id="_lock-stato_" style="font-size:0.82rem;color:#64748b;min-height:1.2em;text-align:center;max-width:260px"></div>`;
    document.body.appendChild(div);
}

function _sbloccaSchermo_() {
    const el = document.getElementById('_lock-screen_');
    if (el) el.remove();
    _stopPollingAccesso_();
}

// ── Richiesta accesso fuori orario ───────────────────────────────────────────
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

    let nome = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome : '';
    if (!nome) {
        const inputEl = document.getElementById('_lock-nome_');
        nome = inputEl ? inputEl.value.trim() : '';
    }
    if (!nome) {
        statoEl.textContent = '\u26a0\ufe0f Inserisci prima il tuo nome utente nel campo sopra.';
        return;
    }

    btn.disabled = true;
    btn.textContent = '\u23f3 Invio richiesta\u2026';
    statoEl.textContent = '';

    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'richiestaAccessoFuoriOrario', nome })
        });
        const json = await res.json().catch(() => ({}));
        if (json.status === 'ok' && json.id) {
            _accessoRichiestaId = json.id;
            btn.textContent = '\ud83d\udce8 Richiesta inviata';
            statoEl.textContent = 'In attesa di approvazione da Alessio\u2026';
            const inputEl = document.getElementById('_lock-nome_');
            if (inputEl) inputEl.disabled = true;
            _accessoPollingTimer = setInterval(_pollAccessoApprovato_, 4000);
        } else {
            btn.disabled = false;
            btn.textContent = '\ud83d\udd13 Chiedi accesso a Alessio';
            statoEl.textContent = '\u26a0\ufe0f Errore nell\'invio. Riprova.';
        }
    } catch {
        btn.disabled = false;
        btn.textContent = '\ud83d\udd13 Chiedi accesso a Alessio';
        statoEl.textContent = '\u26a0\ufe0f Errore di rete. Riprova.';
    }
}

async function _pollAccessoApprovato_() {
    if (!_accessoRichiestaId) return;
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
            sessionStorage.setItem('_accesso_extra_', '1');
            const t = document.createElement('div');
            t.textContent = '\u2705 Accesso consentito da Alessio!';
            t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:12px 24px;border-radius:12px;font-weight:700;font-size:0.95rem;z-index:99998;box-shadow:0 4px 20px rgba(0,0,0,0.35);pointer-events:none';
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 4000);
            if (typeof window.caricaDati === 'function') window.caricaDati(window.paginaAttuale);
        } else if (json.esito === 'DENIED') {
            _stopPollingAccesso_();
            const statoEl = document.getElementById('_lock-stato_');
            const btn     = document.getElementById('_btn-chiedi-accesso_');
            if (statoEl) statoEl.textContent = '\ud83d\udeab Accesso negato da Alessio.';
            if (btn) { btn.disabled = false; btn.textContent = '\ud83d\udd13 Richiedi di nuovo'; }
        }
    } catch { /* ignora errori di rete, riprova al prossimo tick */ }
}

// Controllo ogni minuto mentre l'app \u00e8 aperta
setInterval(function() {
    if (utenteAttuale && utenteAttuale.nome) _checkOrarioAccesso(true);
}, 60 * 1000);

// ── Exports ──────────────────────────────────────────────────────────────────

export function registerGlobals() {
    window._richiestaAccessoFuoriOrario_ = _richiestaAccessoFuoriOrario_;
    window._normNome                   = _normNome;
    window._PREDEFINED_AVATAR_COLORS   = _PREDEFINED_AVATAR_COLORS;
    window._avatarColorsCache          = _avatarColorsCache;
    window._getOpColor                 = _getOpColor;
    window._isUtenteEsente             = _isUtenteEsente;
    window._isCommerciale              = _isCommerciale;
}

export {
    aggiornaProfiloSidebar,
    _caricaColoriAvatarDaServer,
    _checkOrarioAccesso,
    _isUtenteEsente,
    _bloccaSchermo_,
    _normNome,
    _PREDEFINED_AVATAR_COLORS,
    _avatarColorsCache,
    _isOrarioConsentito
};
