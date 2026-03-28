// PROD — Core / RevisionPoller
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ./api.js, ./config.js

import { getRevision, gasRequest } from './api.js';
import {
    URL_GOOGLE,
    REVISION_POLL_INTERVAL_MS,
    REVISION_POLL_SLOW_MS,
    PING_INTERVAL_MS
} from './config.js';

// Callback che script.js registra per reagire agli aggiornamenti
let _onRemoteChange = null;
let _onUsersOnline = null;
let _getUtenteAttuale = null;
let _getPaginaCorrente = null;

/**
 * Configura i callback usati da RevisionPoller per interagire con l'app.
 *
 * @param {Object} opzioni
 * @param {Function} opzioni.onRemoteChange     - fn(nomeUtente)   — altro utente ha modificato dati
 * @param {Function} opzioni.onUsersOnline      - fn(listaUtenti)  — lista utenti online aggiornata
 * @param {Function} opzioni.getUtenteAttuale   - fn() => {nome,...} — utente corrente
 * @param {Function} opzioni.getPaginaCorrente  - fn() => string    — pagina aperta
 */
export function configurePoller(opzioni) {
    _onRemoteChange    = opzioni.onRemoteChange;
    _onUsersOnline     = opzioni.onUsersOnline;
    _getUtenteAttuale  = opzioni.getUtenteAttuale;
    _getPaginaCorrente = opzioni.getPaginaCorrente;
}

/* ── RevisionPoller: polling globale revisione dati ──────────────────────
   Controlla ogni 15s (8s in focus) se altri utenti hanno scritto dati.
   Se la revisione è cambiata, chiama _onRemoteChange(nomeUtente).
───────────────────────────────────────────────────────────────────────── */
export const RevisionPoller = {
    INTERVAL_MS: REVISION_POLL_INTERVAL_MS,
    INTERVAL_FOCUS_MS: 8000,
    INTERVAL_BG_MS: REVISION_POLL_SLOW_MS,
    PING_INTERVAL_MS: PING_INTERVAL_MS,
    _timer: null,
    _pingTimer: null,
    _lastRevision: null,
    _lastCheck: 0,
    _paused: false,
    lastRevisionValue: null,
    lastOnlineList: [],
    lastCheckTs: 0,

    start: function() {
        this.stop();
        this._lastRevision = null;
        this._paused = false;
        this._schedule(document.hidden ? this.INTERVAL_BG_MS : this.INTERVAL_FOCUS_MS);
        // Primo ping dopo 5s, poi ogni PING_INTERVAL_MS
        this._schedulePing(5000);
    },

    stop: function() {
        if (this._timer)     { clearTimeout(this._timer);     this._timer     = null; }
        if (this._pingTimer) { clearTimeout(this._pingTimer); this._pingTimer = null; }
        this._lastRevision = null;
        this._paused = false;
        // Rimuovi indicatore online dal DOM
        var _oi = document.getElementById('online-indicator');
        if (_oi) _oi.remove();
        var _oim = document.getElementById('online-indicator-mob');
        if (_oim) _oim.remove();
    },

    pauseFor: function(resumeAfterMs) {
        if (!resumeAfterMs) resumeAfterMs = 5000;
        this._paused = true;
        var self = this;
        setTimeout(function() { self._paused = false; }, resumeAfterMs);
    },

    _schedule: function(ms) {
        if (this._timer) clearTimeout(this._timer);
        var self = this;
        this._timer = setTimeout(function() { self._tick(); }, ms);
    },

    _tick: function() {
        var self = this;
        this._check().finally(function() {
            var interval = document.hidden ? self.INTERVAL_BG_MS
                : (document.hasFocus && document.hasFocus() ? self.INTERVAL_FOCUS_MS : self.INTERVAL_MS);
            self._schedule(interval);
        });
    },

    _check: async function() {
        if (this._paused) return;
        try {
            var data = await getRevision();
            if (!data || data.status !== 'ok') return;
            var rev = Number(data.revision);
            this._lastCheck = Date.now();
            this.lastRevisionValue = rev;
            this.lastCheckTs = Date.now();

            if (this._lastRevision === null) {
                this._lastRevision = rev;
                return;
            }
            if (rev === this._lastRevision) return;

            var utente = _getUtenteAttuale ? _getUtenteAttuale() : null;
            var nomeAttuale = (utente && utente.nome) ? utente.nome.toUpperCase() : '';
            var utenteRev = data.utente ? String(data.utente).toUpperCase() : '';

            this._lastRevision = rev;

            if (utenteRev === nomeAttuale) return;

            var chi = data.utente || 'Qualcuno';
            if (_onRemoteChange) _onRemoteChange(chi);
        } catch (e) {
            if (e && e.name !== 'AbortError') console.warn('[RevisionPoller]', e);
        }
    },

    _schedulePing: function(ms) {
        if (this._pingTimer) clearTimeout(this._pingTimer);
        var self = this;
        this._pingTimer = setTimeout(function() {
            self._pingServer().finally(function() { self._schedulePing(self.PING_INTERVAL_MS); });
        }, ms);
    },

    _pingServer: async function() {
        var utente = _getUtenteAttuale ? _getUtenteAttuale() : null;
        if (!utente || !utente.nome) return;
        var url = URL_GOOGLE + '?azione=ping'
            + '&username=' + encodeURIComponent(utente.nome)
            + '&pagina='   + encodeURIComponent((_getPaginaCorrente ? _getPaginaCorrente() : '') || '');
        try {
            var resp = await fetch(url);
            var data = await resp.json();
            if (data && data.status === 'ok' && Array.isArray(data.online)) {
                if (_onUsersOnline) _onUsersOnline(data.online);
                RevisionPoller.lastOnlineList = data.online;
            }
        } catch (e) { /* rete offline o GAS non risponde */ }
    }
};

export default RevisionPoller;
