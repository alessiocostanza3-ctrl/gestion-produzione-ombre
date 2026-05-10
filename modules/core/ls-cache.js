// PROD — Core / LS-Cache
// Cache leggera su localStorage con TTL in millisecondi.
// Usata da acquisti.js, impostazioni.js e script.js per salvare HTML precompilato.

/**
 * Recupera un valore dalla cache localStorage se non scaduto.
 * @param {string} key
 * @param {number} ttlMs  millisecondi di validità
 * @returns {string|null} il valore salvato, oppure null se assente/scaduto
 */
export function lsCacheGet(key, ttlMs) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.ts < ttlMs) return parsed.data;
        return null; // scaduta
    } catch(e) { return null; }
}

/**
 * Salva un valore in localStorage con timestamp.
 * Ignora stringhe > 1.5 MB per non saturare la quota.
 * @param {string} key
 * @param {string} data
 */
export function lsCacheSet(key, data) {
    try {
        const str = (typeof data === 'string') ? data : JSON.stringify(data);
        if (str.length > 2500000) return;
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: str }));
    } catch(e) {} // quota exceeded: ignora silenziosamente
}

/**
 * Rimuove una voce dalla cache localStorage.
 * @param {string} key
 */
export function lsCacheDel(key) {
    try { localStorage.removeItem(key); } catch(e) {}
}

/**
 * Elimina tutte le voci HTML cache (prefisso _html_) da localStorage.
 * Chiamata quando un cambiamento remoto invalida i dati di qualsiasi pagina.
 */
export function lsCacheFlushAllHtml() {
    try {
        const toDelete = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('_html_')) toDelete.push(k);
        }
        toDelete.forEach(k => localStorage.removeItem(k));
    } catch(e) {}
}
