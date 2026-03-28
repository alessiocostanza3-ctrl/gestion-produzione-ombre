// PROD — Features / Hives Test Annuale
// Estratto da script.js — 28 marzo 2026
// Pagina sperimentale: stub pronto per future implementazioni

import { applicaFade } from '../core/ui.js';

function caricaPaginaHivesTest() {
    const cont = document.getElementById('contenitore-dati');
    if (!cont) return;
    cont.innerHTML = '<div class="centered-msg">Pagina di test momentaneamente non disponibile.</div>';
    applicaFade(cont);
}

export function registerGlobals() {
    // Nessuna funzione hives chiamata da HTML onclick per ora
}

export { caricaPaginaHivesTest };
