// PROD — Core / API
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ./config.js, ./session.js

import { URL_GOOGLE } from './config.js';
import { getSessionToken, clearSession } from './session.js';

/**
 * Esegue una request verso Google Apps Script.
 * Inietta automaticamente il token di sessione.
 * In caso di auth_error, fa clearSession() e lancia un errore dedicato.
 *
 * @param {Object} params  — corpo della request (verrà serializzato in JSON)
 * @returns {Promise<any>} — risposta JSON parsata
 */
export async function gasRequest(params) {
    const token = getSessionToken();
    const body = token ? { ...params, _token: token } : { ...params };
    const res = await fetch(URL_GOOGLE, {
        method: 'POST',
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.status === 'auth_error') {
        clearSession();
        const err = new Error('auth_error');
        err.authError = true;
        throw err;
    }
    return data;
}

/**
 * Come gasRequest, ma con un timeout esplicito via AbortController.
 *
 * @param {Object} params
 * @param {number} [timeoutMs=8000]
 * @returns {Promise<any>}
 */
export async function gasRequestWithTimeout(params, timeoutMs = 8000, { signal } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    // Se un signal esterno viene fornito, aborta anche il nostro controller
    if (signal) {
        if (signal.aborted) { clearTimeout(timer); throw new DOMException('Aborted', 'AbortError'); }
        signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
    const token = getSessionToken();
    const body = token ? { ...params, _token: token } : { ...params };
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify(body),
            signal: controller.signal
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && data.status === 'auth_error') {
            clearSession();
            const err = new Error('auth_error');
            err.authError = true;
            throw err;
        }
        return data;
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

/**
 * Chiamata leggera per RevisionPoller: GET ?azione=getRevision con AbortController a 5 s.
 * Non inietta token (call non autenticata, solo lettura revisione globale).
 *
 * @returns {Promise<{status:string, revision:number, utente:string}>}
 */
export async function getRevision() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
        const res = await fetch(URL_GOOGLE + '?azione=getRevision', { signal: controller.signal });
        clearTimeout(timer);
        return await res.json();
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

/**
 * Esegue una richiesta GET verso GAS con timeout e gestione auth_error.
 *
 * @param {Record<string,string>} queryParams  — parametri query string
 * @param {number} [timeoutMs=8000]
 * @returns {Promise<any>}
 */
export async function gasGetWithTimeout(queryParams, timeoutMs = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const qs = new URLSearchParams(queryParams).toString();
        const res = await fetch(URL_GOOGLE + '?' + qs, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && data.status === 'auth_error') {
            clearSession();
            const err = new Error('auth_error');
            err.authError = true;
            throw err;
        }
        return data;
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}
