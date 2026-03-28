// PROD — Core / Session
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ./config.js

import { SESSION_DURATION_MS } from './config.js';

// ── Stato in-memory della sessione corrente ───────────────────────────────────
// Usare setUtenteAttuale() per aggiornare; leggere utenteAttuale direttamente.
export let utenteAttuale = null;

export function setUtenteAttuale(utente) {
    utenteAttuale = utente;
}

// ── Lettura token ─────────────────────────────────────────────────────────────
/** Restituisce il sessionToken attivo, o '' se la sessione è assente/scaduta. */
export function getSessionToken() {
    // Priorità allo storage condiviso tra tab: evita uso di token in-memory obsoleto.
    try {
        const rawShared = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente');
        if (rawShared) {
            const s = JSON.parse(rawShared);
            // Verifica scadenza lato client
            if (s && s.expiresAt && Date.now() > s.expiresAt) {
                clearSession();
                utenteAttuale = null;
                const ov = document.getElementById('login-overlay');
                if (ov) { ov.style.display = 'flex'; ov.style.opacity = '1'; }
                return '';
            }
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

// ── Salvataggio sessione ──────────────────────────────────────────────────────
/**
 * Salva utenteObj in localStorage + sessionStorage aggiungendo expiresAt,
 * e aggiorna il riferimento in-memory utenteAttuale.
 */
export function saveSession(utenteObj) {
    const toSave = Object.assign({}, utenteObj, {
        expiresAt: Date.now() + SESSION_DURATION_MS
    });
    try { localStorage.setItem('sessioneUtente', JSON.stringify(toSave)); } catch (_e) {}
    try { sessionStorage.setItem('sessioneUtente', JSON.stringify(toSave)); } catch (_e) {}
    utenteAttuale = toSave;
}

// ── Caricamento sessione ──────────────────────────────────────────────────────
/**
 * Legge la sessione da localStorage/sessionStorage.
 * Restituisce l'oggetto utente se valido, null altrimenti
 * (chiama clearSession() se scaduta).
 */
export function loadSession() {
    try {
        const raw = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente');
        if (!raw) return null;
        const s = JSON.parse(raw);
        if (!s || !s.sessionToken) return null;
        if (s.expiresAt && Date.now() > s.expiresAt) {
            clearSession();
            return null;
        }
        return s;
    } catch (e) {
        return null;
    }
}

// ── Cancellazione sessione ────────────────────────────────────────────────────
/** Rimuove sessioneUtente da localStorage e sessionStorage. */
export function clearSession() {
    try { localStorage.removeItem('sessioneUtente'); } catch (_e) {}
    try { sessionStorage.removeItem('sessioneUtente'); } catch (_e) {}
}

// ── Rinnovo scadenza ──────────────────────────────────────────────────────────
/** Aggiorna expiresAt a Date.now() + SESSION_DURATION_MS in entrambi gli storage. */
export function refreshSessionExpiry() {
    try {
        const raw = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente');
        if (!raw) return;
        const s = JSON.parse(raw);
        if (!s || !s.sessionToken) return;
        s.expiresAt = Date.now() + SESSION_DURATION_MS;
        if (utenteAttuale) utenteAttuale.expiresAt = s.expiresAt;
        try { localStorage.setItem('sessioneUtente', JSON.stringify(s)); } catch (_e) {}
        try { sessionStorage.setItem('sessioneUtente', JSON.stringify(s)); } catch (_e) {}
    } catch (e) {}
}
