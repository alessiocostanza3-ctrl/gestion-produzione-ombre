// PROD — Core / LS Keys
// Registro centralizzato delle chiavi localStorage.
// Importare da qui evita typo e centralizza la logica di cleanup al logout.

'use strict';

// ── Sessione ──────────────────────────────────────────────────────────────────
export const LS_SESSION = 'sessioneUtente';

// ── UI / Navigazione ──────────────────────────────────────────────────────────
export const LS_SIDEBAR_COLLAPSED = 'sidebarCollapsed';
export const LS_ULTIMA_PAGINA     = 'ultimaPaginaProduzione';

// ── Push Notifications ────────────────────────────────────────────────────────
export const LS_PUSH_STATO  = '_pushStato';
export const LS_NOTIF_PREFS = 'notifPrefs';

// ── Notifiche (array + badge) ─────────────────────────────────────────────────
export const LS_NOTIF_ARR        = '_notificheArr';
export const LS_NOTIF_LAST_READ  = '_notifLastRead';
export const LS_NOTIF_BADGE      = '_notifBadgeCount';
export const LS_NOTIF_ACC_RISP   = '_accRispIdx_';

// ── Pipistrelli ───────────────────────────────────────────────────────────────
export const LS_PIP_QTY      = 'mlPipQty';
export const LS_PIP_CARICATO = 'mlPipCaricato';
export const LS_PIP_PRONTI   = 'mlPipPronti';
export const LS_PIP_MOVIMENTI = 'mlPipMovimenti';
export const LS_PIP_LOCAL_TS  = 'pip_local_ts';

// ── Acquisti ──────────────────────────────────────────────────────────────────
export const LS_SEZIONI_MATERIALI = 'sezioniMateriali';

// ── QR Postazioni ─────────────────────────────────────────────────────────────
export const LS_QR_POSTAZIONI    = 'qrPostazioni';
export const LS_QR_CAMERA_GRANT  = 'qrCameraGranted';

// ── Prefissi dinamici (per-utente) ────────────────────────────────────────────
export const LS_PREFIX_AVATAR_COLOR   = 'avatarColor_';
export const LS_PREFIX_AVATAR_RECENTI = 'avatarColorRecenti_';
export const LS_PREFIX_AVATAR_HIDDEN  = 'avatarColorHidden_';
export const LS_PREFIX_HTML_CACHE     = '_html_';
export const LS_PREFIX_RG             = '_rg_';

// ── Chiavi da preservare al logout ────────────────────────────────────────────
// Usate dalla funzione logout() in script.js per ripristinare dati per-device.
export const LS_DEVICE_KEYS = [
    LS_NOTIF_PREFS, LS_PUSH_STATO,
    LS_PIP_QTY, LS_PIP_CARICATO, LS_PIP_MOVIMENTI, LS_PIP_PRONTI
];
export const LS_DEVICE_PREFIXES = [
    LS_PREFIX_AVATAR_COLOR, LS_PREFIX_AVATAR_RECENTI, LS_PREFIX_AVATAR_HIDDEN
];
