// PROD — Core / Repository
// Unico punto di ingresso per le call verso il backend GAS.
// Per migrare verso un database diverso: riscrivere SOLO questo file.
//
// Ogni funzione ha JSDoc con input/output per facilitare la futura migrazione.

'use strict';

import { gasRequest, gasRequestWithTimeout } from './api.js';
import { URL_GOOGLE } from './config.js';

// ── LETTURA ───────────────────────────────────────────────────────────────────

/**
 * Recupera il bundle principale dashboard (produzione + archivio + statistiche).
 * @param {{ limit?: number, offset?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<{ produzione: object[], archivio: object[], attivi: object[], prodTotal: number }>}
 */
export async function fetchDashboard({ limit = 100, offset = 0, signal } = {}) {
    const params = { azione: 'getAllDashboard', limit };
    if (offset > 0) params.offset = offset;
    return signal
        ? gasRequestWithTimeout(params, 8000)
        : gasRequestWithTimeout(params, 8000);
}

/**
 * Recupera storico richieste dell'utente corrente.
 * @returns {Promise<{ attive: object[], completate: object[] }>}
 */
export async function fetchRichieste() {
    return gasRequestWithTimeout({ azione: 'getAllRichieste' }, 8000);
}

/**
 * Recupera la pagina MATERIALE DA ORDINARE (catalogo + carrello).
 * @returns {Promise<object>}
 */
export async function fetchMateriale() {
    const res = await fetch(URL_GOOGLE + '?pagina=' + encodeURIComponent('MATERIALE DA ORDINARE'));
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
}

/**
 * Recupera impostazioni di sistema (stati, operatori, config).
 * @returns {Promise<{ stati: object[], operatori: string[], ... }>}
 */
export async function fetchImpostazioni() {
    return gasRequestWithTimeout({ azione: 'getImpostazioni' }, 8000);
}

/**
 * Recupera il numero di revisione corrente (check polling).
 * @returns {Promise<{ revision: number }>}
 */
export async function fetchRevision() {
    const res = await fetch(URL_GOOGLE + '?azione=getRevision');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
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
    const res = await fetch(URL_GOOGLE + '?azione=getAvatarColors');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
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
