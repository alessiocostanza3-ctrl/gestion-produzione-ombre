// PROD — Core / State
// Stato applicativo centralizzato.
// Importa questo modulo invece di accedere a window.cacheContenuti ecc.
// Prerequisito per la migrazione verso un backend diverso da GAS.

'use strict';

/**
 * Stato della cache HTML (per pagina).
 * Acceduto da script.js, produzione.js, richieste.js, acquisti.js.
 */
export const cacheContenuti = {};

/**
 * Timestamp dell'ultimo fetch per pagina (ms epoch).
 */
export const cacheFetchTime = {};

/**
 * Bundle di prefetch GAS (riempiti da _prefetchBackground in script.js).
 * Letti da produzione.js (_fetchDatiProduzione) e richieste.js.
 */
export const prefetch = {
    dashBundle:   null,
    dashPromise:  null,
    rqBundle:     null,
    rqPromise:    null,
    matBundle:    null,
    matPromise:   null,
    ordiniBundle: null,
    ordiniPromise: null,
};

/**
 * Stato navigazione (usato da cambiaPagina in script.js).
 */
export const navState = {
    paginaAttuale:    null,
    requestSerial:    0,
    latestRequest:    0,
    abortController:  null,
    lastClickTime:    0,
};
