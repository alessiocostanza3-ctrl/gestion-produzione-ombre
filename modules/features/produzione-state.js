// PROD — Produzione / Shared State
// Stato mutabile condiviso tra produzione.js e i sotto-moduli

export const prodState = {
    ultimiDatiProduzione: null,
    pollProdTimer: null,
    POLL_PROD_MS: 10000,
    lastKanbanDragTs: 0,
    mutationInFlight: 0,
    mutationLastDone: 0,
    prodCacheInvalidateTimer: null,
    attiviProd: [],
    ordiniAutocompleteCache: [],
    ovStatiArt: ['PREPARARE','MANDA IN LAVORAZIONE','IN LAVORAZIONE','TORNATO DALLA LAVORAZIONE'],
    ovStatiOrd: ['IN PRODUZIONE','IMBALLATO'],
    datiArchLazy: null,
};

export function getOvStatiAll() { return [...prodState.ovStatiArt, ...prodState.ovStatiOrd]; }

export function isStatoFinale(stato) {
    const s = String(stato || '').toUpperCase().trim();
    return s === 'IMBALLATO' || s === 'SPEDITO/CONSEGNATO' || s === 'SPEDITO' || s === 'CONSEGNATO';
}
