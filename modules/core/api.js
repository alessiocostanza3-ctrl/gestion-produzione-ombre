// PROD — Core / API
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ./config.js, ./session.js

import { URL_GOOGLE } from './config.js';
import { getSessionToken, clearSession } from './session.js';

// ── Request deduplication ──────────────────────────────────────────────────────
// Se una richiesta identica (stessi params) è già in-flight, ritorna la stessa Promise.
const _inflight = new Map();

function _dedup(key, executor) {
    const existing = _inflight.get(key);
    if (existing) return existing;
    const promise = executor().finally(() => _inflight.delete(key));
    _inflight.set(key, promise);
    return promise;
}

// ── Retry with exponential backoff ─────────────────────────────────────────────
async function _withRetry(fn, maxRetries, baseDelayMs, signal) {
    for (let attempt = 0; ; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const canRetry = attempt < maxRetries
                && !err.authError
                && !(signal && signal.aborted);
            if (!canRetry) throw err;
            await new Promise(r => setTimeout(r, baseDelayMs * 2 ** attempt));
        }
    }
}

/**
 * Esegue una request verso Google Apps Script.
 * Inietta automaticamente il token di sessione.
 * In caso di auth_error, fa clearSession() e lancia un errore dedicato.
 *
 * @param {Object} params  — corpo della request (verrà serializzato in JSON)
 * @returns {Promise<any>} — risposta JSON parsata
 */
export function gasRequest(params) {
    const key = JSON.stringify(params);
    return _dedup(key, async () => {
        const token = getSessionToken();
        const body = token ? { ...params, sessionToken: token } : { ...params };
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            headers: token ? { 'X-Session-Token': token } : undefined,
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
    });
}

/**
 * Come gasRequest, ma con un timeout esplicito via AbortController.
 *
 * @param {Object} params
 * @param {number} [timeoutMs=8000]
 * @returns {Promise<any>}
 */
export function gasRequestWithTimeout(params, timeoutMs = 8000, { signal, retries = 0, noDedupe = false } = {}) {
    const effectiveTimeout = _resolveAdaptiveTimeout(timeoutMs);
    if (signal || noDedupe) {
        return _withRetry(() => _gasRequestWithTimeoutRaw(params, effectiveTimeout, signal || null), retries, 500, signal);
    }
    const key = JSON.stringify(params) + '|' + effectiveTimeout;
    return _dedup(key, () => _withRetry(() => _gasRequestWithTimeoutRaw(params, effectiveTimeout, null), retries, 500));
}

function _resolveAdaptiveTimeout(timeoutMs) {
    const requested = Number(timeoutMs) || 8000;
    try {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const et = String(connection && connection.effectiveType || '').toLowerCase();
        if (et === '2g' || et === 'slow-2g' || et === '3g') {
            return Math.min(requested, 5000);
        }
    } catch (_e) {}
    return requested;
}

async function _gasRequestWithTimeoutRaw(params, timeoutMs, signal) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new DOMException('Timeout: il server non ha risposto entro ' + Math.round(timeoutMs / 1000) + 's', 'TimeoutError')), timeoutMs);
    if (signal) {
        if (signal.aborted) { clearTimeout(timer); throw new DOMException('Aborted', 'AbortError'); }
        signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
    const token = getSessionToken();
    const body = token ? { ...params, sessionToken: token } : { ...params };
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            headers: token ? { 'X-Session-Token': token } : undefined,
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
export function gasGetWithTimeout(queryParams, timeoutMs = 8000, { retries = 0 } = {}) {
    const key = 'GET|' + JSON.stringify(queryParams) + '|' + timeoutMs;
    return _dedup(key, () => _withRetry(() => _gasGetRaw(queryParams, timeoutMs), retries, 500));
}

async function _gasGetRaw(queryParams, timeoutMs) {
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
