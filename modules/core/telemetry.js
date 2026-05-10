// PROD — Core / Telemetry
// Metriche client leggere con invio batch best-effort al backend GAS.

import { URL_GOOGLE } from './config.js';
import { getSessionToken } from './session.js';

const _QUEUE_MAX = 120;
const _FLUSH_BATCH_SIZE = 20;
const _FLUSH_INTERVAL_MS = 15000;
const _queue = [];
let _flushTimer = null;
let _flushInFlight = false;

function _nowIso() {
    try { return new Date().toISOString(); } catch (_e) { return ''; }
}

function _safePage() {
    try { return String(location && location.pathname || '').slice(0, 160); } catch (_e) { return ''; }
}

function _sanitizeText(v, maxLen = 240) {
    return String(v == null ? '' : v).slice(0, maxLen);
}

function _pushEntry(entry) {
    _queue.push(entry);
    if (_queue.length > _QUEUE_MAX) {
        _queue.splice(0, _queue.length - _QUEUE_MAX);
    }
}

function _ensureFlushTimer() {
    if (_flushTimer) return;
    _flushTimer = setInterval(() => {
        void flushMetrics();
    }, _FLUSH_INTERVAL_MS);
}

function _shouldSample(sampleRate) {
    const s = Number(sampleRate);
    if (!(s > 0 && s <= 1)) return true;
    return Math.random() <= s;
}

export function trackMetric(eventName, payload = {}, options = {}) {
    if (!_shouldSample(options.sampleRate == null ? 1 : options.sampleRate)) return;
    const name = _sanitizeText(eventName || 'unknown_event', 64);
    const entry = {
        event: name,
        ts: _nowIso(),
        page: _safePage(),
        action: _sanitizeText(payload.action || '', 64),
        status: _sanitizeText(payload.status || '', 24),
        durationMs: Number(payload.durationMs || 0) || 0,
        detail: _sanitizeText(payload.detail || payload.error || '', 240)
    };
    _pushEntry(entry);
    _ensureFlushTimer();
    if (options.immediate) {
        void flushMetrics();
    }
}

export async function flushMetrics() {
    if (_flushInFlight) return;
    if (!_queue.length) return;
    const token = getSessionToken();
    if (!token) return;

    _flushInFlight = true;
    const batch = _queue.splice(0, _FLUSH_BATCH_SIZE);
    try {
        await fetch(URL_GOOGLE, {
            method: 'POST',
            headers: { 'X-Session-Token': token },
            body: JSON.stringify({
                azione: 'clientMetrics',
                sessionToken: token,
                entries: batch
            }),
            keepalive: true
        });
    } catch (_e) {
        _queue.unshift(...batch);
        if (_queue.length > _QUEUE_MAX) {
            _queue.splice(_QUEUE_MAX);
        }
    } finally {
        _flushInFlight = false;
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            void flushMetrics();
        }
    });
}
