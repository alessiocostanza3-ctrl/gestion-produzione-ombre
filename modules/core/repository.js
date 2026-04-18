// PROD — Core / Repository
// Unico punto di ingresso per le call verso il backend GAS.
// Per migrare verso un database diverso: riscrivere SOLO questo file.
//
// Ogni funzione ha JSDoc con input/output per facilitare la futura migrazione.

'use strict';

import { gasRequest, gasRequestWithTimeout, gasGetWithTimeout } from './api.js';

// ── LETTURA ───────────────────────────────────────────────────────────────────

/**
 * Recupera il bundle principale dashboard (produzione + archivio + statistiche).
 * @param {{ limit?: number, offset?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<{ produzione: object[], archivio: object[], attivi: object[], prodTotal: number }>}
 */
export async function fetchDashboard({ limit = 100, offset = 0, signal } = {}) {
    const params = { azione: 'getAllDashboard', limit };
    if (offset > 0) params.offset = offset;
    return gasRequestWithTimeout(params, 8000, { signal, retries: 2 });
}

/**
 * Recupera storico richieste dell'utente corrente.
 * @returns {Promise<{ attive: object[], completate: object[] }>}
 */
export async function fetchRichieste() {
    return gasRequestWithTimeout({ azione: 'getAllRichieste' }, 8000, { retries: 2 });
}

/**
 * Recupera la pagina MATERIALE DA ORDINARE (catalogo + carrello).
 * @returns {Promise<object>}
 */
export async function fetchMateriale() {
    return gasRequestWithTimeout({ pagina: 'MATERIALE DA ORDINARE' }, 8000, { retries: 2 });
}

/**
 * Recupera impostazioni di sistema (stati, operatori, config).
 * @returns {Promise<{ stati: object[], operatori: string[], ... }>}
 */
export async function fetchImpostazioni() {
    return gasRequestWithTimeout({ azione: 'getImpostazioni' }, 8000, { retries: 2 });
}

/**
 * Recupera il numero di revisione corrente (check polling).
 * @returns {Promise<{ revision: number }>}
 */
export async function fetchRevision() {
    return gasGetWithTimeout({ azione: 'getRevision' }, 5000, { retries: 2 });
}

/**
 * Recupera la lista utenti (solo ruolo MASTER).
 * @returns {Promise<object[]>}
 */
export async function fetchUtenti() {
    return gasRequest({ azione: 'getUtenti' });
}

/**
 * Recupera i colori avatar di tutti gli utenti.
 * @returns {Promise<Record<string, string>>}
 */
export async function fetchAvatarColors() {
    return gasRequestWithTimeout({ azione: 'getAvatarColors' }, 8000, { retries: 2 });
}

// ── SCRITTURA ─────────────────────────────────────────────────────────────────

/**
 * Aggiorna lo stato di una riga produzione.
 * @param {{ id_riga: string, stato: string, assegna?: string }} data
 * @returns {Promise<{ status: string }>}
 */
export async function patchStatoRiga(data) {
    return gasRequest({ azione: 'aggiornaStato', ...data });
}

/**
 * Invia una nuova richiesta.
 * @param {{ testo: string, tipo: string, priorita?: string }} data
 * @returns {Promise<{ status: string, id: string }>}
 */
export async function inviaRichiesta(data) {
    return gasRequest({ azione: 'inviaRichiesta', ...data });
}

/**
 * Aggiorna un colore avatar utente.
 * @param {{ username: string, color: string }} data
 * @returns {Promise<{ status: string }>}
 */
export async function setAvatarColor(data) {
    return gasRequest({ azione: 'setAvatarColor', ...data });
}

/**
 * Aggiunge un articolo al catalogo materiali.
 * @param {object} articolo
 * @returns {Promise<{ status: string }>}
 */
export async function addMateriale(articolo) {
    return gasRequest({ azione: 'addMateriale', ...articolo });
}

/**
 * Invia un ordine di acquisto.
 * @param {object[]} items
 * @returns {Promise<{ status: string }>}
 */
export async function inviaOrdine(items) {
    return gasRequest({ azione: 'inviaOrdine', items });
}

/**
 * Recupera l'elenco dei manuali prodotto correnti.
 * @returns {Promise<{status:string, manuali: object[]}>}
 */
export async function fetchManuali() {
    return gasRequestWithTimeout({ azione: 'getManuali' }, 10000, { retries: 2 });
}

/**
 * Crea un nuovo manuale prodotto.
 * @param {{ titolo: string, categoria?: string, steps: Array<{titolo?:string, descrizione?:string, foto?:string}> }} payload
 * @returns {Promise<{status:string, manuale?:object}>}
 */
export async function createManuale(payload) {
    return gasRequestWithTimeout({ azione: 'salvaManualeNuovo', ...payload }, 60000);
}

/**
 * Aggiorna un manuale esistente con nuova versione.
 * @param {{ id: string, titolo: string, categoria?: string, steps: Array<{titolo?:string, descrizione?:string, foto?:string}> }} payload
 * @returns {Promise<{status:string, manuale?:object}>}
 */
export async function updateManuale(payload) {
    return gasRequestWithTimeout({ azione: 'aggiornaManuale', ...payload }, 60000);
}

/**
 * Legge lo storico versioni di un manuale.
 * @param {string} idManuale
 * @returns {Promise<{status:string, storico: object[]}>}
 */
export async function fetchStoricoManuale(idManuale) {
    return gasRequestWithTimeout({ azione: 'getStoricoManuale', id: idManuale }, 10000, { retries: 2 });
}
