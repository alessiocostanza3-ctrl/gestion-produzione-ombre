// PROD — Core / Cache
// Estratto da script.js — 27 marzo 2026
// Dipendenze: ./config.js

import { CACHE_TTL_MS } from './config.js';
import { notificaElegante } from './ui.js';
import { trackMetric } from './telemetry.js';

/* ══════════════════════════════════════════════════════════════════
   PROD CACHE — IndexedDB stale-while-revalidate
   Permette all'app di mostrare istantaneamente i dati dell'ultima
   visita mentre GAS è in cold-start o la rete è lenta.
   ══════════════════════════════════════════════════════════════════ */
const ProdCache = {
    DB_NAME:    'prod-cache',
    DB_VERSION: 1,
    STORE:      'pagine',
    TTL:        CACHE_TTL_MS, // 5 minuti → dopo: "stale"

    _db: null,

    /** Apre (o riusa) la connessione IndexedDB. Restituisce Promise<IDBDatabase>. */
    open() {
        if (this._db) return Promise.resolve(this._db);
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            req.onupgradeneeded = (ev) => {
                const db = ev.target.result;
                if (!db.objectStoreNames.contains(this.STORE)) {
                    db.createObjectStore(this.STORE, { keyPath: 'chiave' });
                }
            };
            req.onsuccess = (ev) => {
                this._db = ev.target.result;
                resolve(this._db);
            };
            req.onerror = (ev) => reject(ev.target.error);
        });
    },

    /** Salva dati per una chiave insieme al timestamp corrente. */
    async set(chiave, dati) {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx   = db.transaction(this.STORE, 'readwrite');
                const store = tx.objectStore(this.STORE);
                const req   = store.put({ chiave, dati, timestamp: Date.now() });
                req.onsuccess = () => resolve();
                req.onerror   = (ev) => reject(ev.target.error);
            });
        } catch (e) {
            console.warn('[ProdCache] set error:', e);
        }
    },

    /**
     * Legge i dati per una chiave.
     * Restituisce { dati, timestamp, isStale } oppure null se non trovato.
     */
    async get(chiave) {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx    = db.transaction(this.STORE, 'readonly');
                const store = tx.objectStore(this.STORE);
                const req   = store.get(chiave);
                req.onsuccess = (ev) => {
                    const record = ev.target.result;
                    if (!record) { resolve(null); return; }
                    resolve({
                        dati:      record.dati,
                        timestamp: record.timestamp,
                        isStale:   (Date.now() - record.timestamp) > ProdCache.TTL
                    });
                };
                req.onerror = (ev) => reject(ev.target.error);
            });
        } catch (e) {
            console.warn('[ProdCache] get error:', e);
            return null;
        }
    },

    /** Cancella una chiave specifica (forza refresh al prossimo caricamento). */
    async invalidate(chiave) {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx    = db.transaction(this.STORE, 'readwrite');
                const store = tx.objectStore(this.STORE);
                const req   = store.delete(chiave);
                req.onsuccess = () => resolve();
                req.onerror   = (ev) => reject(ev.target.error);
            });
        } catch (e) {
            console.warn('[ProdCache] invalidate error:', e);
        }
    },

    /** Cancella l'intero DB (da chiamare al logout). */
    async clear() {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx    = db.transaction(this.STORE, 'readwrite');
                const store = tx.objectStore(this.STORE);
                const req   = store.clear();
                req.onsuccess = () => resolve();
                req.onerror   = (ev) => reject(ev.target.error);
            });
        } catch (e) {
            console.warn('[ProdCache] clear error:', e);
        }
    },

    /** Elenca tutte le entry con chiave e timestamp (per diagnostica). */
    async listEntries() {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx    = db.transaction(this.STORE, 'readonly');
                const store = tx.objectStore(this.STORE);
                const req   = store.getAll();
                req.onsuccess = (ev) => resolve(ev.target.result || []);
                req.onerror   = (ev) => reject(ev.target.error);
            });
        } catch (e) {
            console.warn('[ProdCache] listEntries error:', e);
            return [];
        }
    }
};

const _L1_TTL_MS = 60 * 1000;
const _l1Cache = new Map();

function _l1Get(chiave) {
    const entry = _l1Cache.get(chiave);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
        _l1Cache.delete(chiave);
        return null;
    }
    return entry.data;
}

function _l1Set(chiave, data, ttlMs = _L1_TTL_MS) {
    _l1Cache.set(chiave, { data, expiresAt: Date.now() + ttlMs });
}

function _l1Invalidate(chiave) {
    _l1Cache.delete(chiave);
}

/**
 * Carica una sezione usando il pattern stale-while-revalidate.
 *
 * @param {string}   chiave       Chiave cache (es. 'PROGRAMMA_PRODUZIONE')
 * @param {Function} fetchFn      async () => dati grezzi da GAS
 * @param {Function} renderFn     (dati) => aggiorna la UI
 * @param {boolean}  [forceRefresh] Se true, salta la cache e va diretto a GAS
 */
export async function caricaSezioneConCache(chiave, fetchFn, renderFn, forceRefresh) {
    function _oraFormattata(ts) {
        if (!ts) return '';
        const d = new Date(ts);
        return d.getHours().toString().padStart(2, '0') + ':' +
               d.getMinutes().toString().padStart(2, '0');
    }

    // 1. Leggi la cache (skip se forceRefresh)
    let cached = null;

    let datiMostrati = null;

    if (!forceRefresh) {
        datiMostrati = _l1Get(chiave);
        if (datiMostrati != null) {
            trackMetric('cache_hit', { action: chiave, status: 'l1' }, { sampleRate: 0.2 });
            try { renderFn(datiMostrati); } catch (e) { console.warn('[ProdCache] renderFn (l1):', e); }
            return;
        }

        try { cached = await ProdCache.get(chiave); } catch (_e) {}

        // 2. Se disponibile: mostra subito
        if (cached) {
            datiMostrati = cached.dati;
            _l1Set(chiave, cached.dati);
            trackMetric('cache_hit', {
                action: chiave,
                status: cached.isStale ? 'idb_stale' : 'idb_fresh'
            }, { sampleRate: 0.35 });
            try { renderFn(cached.dati); } catch (e) { console.warn('[ProdCache] renderFn (cache):', e); }
        } else {
            trackMetric('cache_miss', { action: chiave, status: 'idb_miss' }, { sampleRate: 0.35 });
        }
    } else {
        // forceRefresh: leggi la cache come fallback ma non renderizzarla
        try { cached = await ProdCache.get(chiave); } catch (_e) {}
    }

    // 3. Esegui sempre fetchFn in parallelo
    try {
        const startedAt = Date.now();
        const nuoviDati = await fetchFn();

        // 4a. Salva in cache
        _l1Set(chiave, nuoviDati);
        try { await ProdCache.set(chiave, nuoviDati); } catch (_e) {}

        // 4b. Aggiorna UI solo se i dati sono cambiati
        const nuoviJson   = JSON.stringify(nuoviDati);
        const mostratJson = JSON.stringify(datiMostrati);
        if (nuoviJson !== mostratJson) {
            try { renderFn(nuoviDati); } catch (e) { console.warn('[ProdCache] renderFn (fetch):', e); }
        }
        trackMetric('cache_refresh', {
            action: chiave,
            status: 'ok',
            durationMs: Date.now() - startedAt
        }, { sampleRate: 0.35 });

    } catch (errFetch) {
        // AbortError = cambio pagina, non serve fare nulla
        if (errFetch && errFetch.name === 'AbortError') return;

        if (cached) {
            trackMetric('cache_refresh', {
                action: chiave,
                status: 'fallback_cache',
                error: errFetch && errFetch.message ? errFetch.message : String(errFetch || '')
            }, { sampleRate: 0.6 });
            // 5. Fallback: dati in cache disponibili → mostra toast con orario
            const ora = _oraFormattata(cached.timestamp);
            try {
                notificaElegante('Dati offline — ultimo aggiornamento ' + ora, 'warning');
            } catch (_e) {}
        } else {
            trackMetric('cache_refresh', {
                action: chiave,
                status: 'error',
                error: errFetch && errFetch.message ? errFetch.message : String(errFetch || '')
            }, { sampleRate: 1 });
            // 6. Nessuna cache: rilancia l'errore per la gestione esistente
            throw errFetch;
        }
    }
}

export { ProdCache };
export default ProdCache;

const _origInvalidate = ProdCache.invalidate.bind(ProdCache);
ProdCache.invalidate = async function(chiave) {
    _l1Invalidate(chiave);
    return _origInvalidate(chiave);
};

const _origClear = ProdCache.clear.bind(ProdCache);
ProdCache.clear = async function() {
    _l1Cache.clear();
    return _origClear();
};
