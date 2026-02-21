# Copilot Instructions for AI Agents

## Overview
Questo progetto è una semplice applicazione web per la gestione della produzione di ombrelloni. La struttura è composta da tre file principali:
- **index.html**: contiene la struttura della pagina e i riferimenti agli altri file.
- **script.js**: gestisce la logica e le interazioni JavaScript.
- **style.css**: definisce lo stile visivo dell'applicazione.

## Architettura e Flussi
- Tutta la logica è client-side, non ci sono backend o API esterne.
- I dati e le interazioni sono gestiti tramite DOM e JavaScript puro.
- Le modifiche ai dati avvengono direttamente nel browser, senza persistenza.

## Convenzioni e Pattern
- Segui la separazione tra struttura (HTML), logica (JS) e stile (CSS).
- Utilizza nomi di variabili e funzioni descrittivi, preferibilmente in italiano.
- Le funzioni JavaScript sono generalmente collegate ad eventi DOM (es. click, input).
- Gli elementi HTML chiave (es. form, tabelle) sono referenziati tramite `id`.

## Workflow Sviluppo
- Non è richiesto alcun build: basta aprire `index.html` in un browser.
- Per il debugging, usa gli strumenti di sviluppo del browser (console, inspector).
- Non sono presenti test automatici o script di build.

## Esempi di Pattern
- Aggiornamento dinamico della tabella:
  - La funzione JS recupera dati dal form, aggiorna la tabella tramite manipolazione DOM.
- Validazione input:
  - Le funzioni JS controllano i valori prima di aggiungerli alla tabella.

## Dipendenze e Integrazioni
- Nessuna dipendenza esterna (librerie, framework, API).
- Tutto il codice è locale e autonomo.

## File Chiave
- [index.html](index.html): punto di ingresso, struttura e riferimenti.
- [script.js](script.js): logica di gestione produzione.
- [style.css](style.css): stile visivo.

## Suggerimenti per AI
- Mantieni la coerenza con la struttura esistente.
- Documenta le funzioni JS con commenti brevi e chiari.
- Se aggiungi nuove funzionalità, aggiorna la struttura HTML e JS in modo sincronizzato.
- Evita l'introduzione di dipendenze esterne salvo richiesta esplicita.

---

Sezione da aggiornare: aggiungi dettagli su workflow, convenzioni o architettura se il progetto viene ampliato.
