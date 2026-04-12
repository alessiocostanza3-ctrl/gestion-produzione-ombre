// PROD — Core / Config
// Estratto da script.js — 27 marzo 2026
// Dipendenze: nessuna (modulo foglia — nessun import)

// ── Endpoint backend ─────────────────────────────────────────────────────────
export const URL_GOOGLE =
    'https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec';

// ── PWA / Service Worker ──────────────────────────────────────────────────────
export const APP_URL = 'https://alessiocostanza3-ctrl.github.io/gestion-produzione-ombre/';

// ── Sessione ──────────────────────────────────────────────────────────────────
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;   // 8 ore

// ── Cache ─────────────────────────────────────────────────────────────────────
export const CACHE_TTL_MS = 5 * 60 * 1000;   // 5 minuti

// ── Polling revisione / Ping keep-alive ───────────────────────────────────────
export const REVISION_POLL_INTERVAL_MS = 20000;   // intervallo normale
export const REVISION_POLL_FOCUS_MS    = 12000;   // tab in primo piano
export const REVISION_POLL_SLOW_MS     = 30000;   // tab in background
export const PING_INTERVAL_MS          = 60000;   // keep-alive server

// ── Operatori ─────────────────────────────────────────────────────────────────
// Nomi canonici (Title Case). Mantenere in sync con _NOME_CANON in session.js.
export const OPERATORI = [
    'Alessio', 'Riccardo', 'Fabio T.', 'Niccolò',
    'Raymond', 'Simone',   'Giacomo',
];

// ── Postazioni QR ─────────────────────────────────────────────────────────────
// Valori di default — usati solo al primo avvio se localStorage è vuoto.
export const POSTAZIONI = [
    { codice: 'PROD:IMBALLAGGI',   icona: '📦', nome: 'Tavolo Imballaggi',         domanda: 'Cosa stai imballando?',    statoDefault: 'IMBALLATO' },
    { codice: 'PROD:LAVORAZIONE',  icona: '🔧', nome: 'Postazione Lavorazione',    domanda: 'Cosa stai lavorando?',     statoDefault: 'IN LAVORAZIONE' },
    { codice: 'PROD:ASSEMBLAGGIO', icona: '🛠️', nome: 'Postazione Assemblaggio',   domanda: 'Cosa stai assemblando?',   statoDefault: 'IN LAVORAZIONE' },
    { codice: 'PROD:CONTROLLO',    icona: '🔍', nome: 'Controllo Qualità',          domanda: 'Cosa stai controllando?',  statoDefault: 'IN PRODUZIONE' },
    { codice: 'PROD:MAGAZZINO',    icona: '🏭', nome: 'Magazzino / Preparazione',   domanda: 'Cosa stai preparando?',    statoDefault: 'PREPARARE PER LAVORAZIONE' },
    { codice: 'PROD:SPEDIZIONI',   icona: '🚚', nome: 'Spedizioni',                 domanda: 'Cosa stai spedendo?',      statoDefault: 'IMBALLATO' },
];
