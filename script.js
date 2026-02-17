/*******************************************************************************
* 1. CONFIGURAZIONE, VARIABILI GLOBALI E STATO
*******************************************************************************/
const URL_GOOGLE = "https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec";

let paginaAttuale = null; // NON leggere subito da localStorage
let modifichePendenti = false;
let listaOperatori = [];
let listaStati = [];
let tipoTrascinamento = "";
const cacheContenuti = {};


let utenteAttuale = {
    nome: "",
    ruolo: "",
    vistaSimulata: ""
};

window.onload = async function() {
    console.log("Inizializzazione sistema...");

    // 1. Gestione immediata dell'interfaccia per evitare "lampi"
    const overlay = document.getElementById('login-overlay');
    const sessione = localStorage.getItem('sessioneUtente');

    if (sessione) {
        // Se c'è una sessione, la leggiamo subito
        utenteAttuale = JSON.parse(sessione);

        // AGGIORNAMENTO IMMEDIATO: Prima ancora di scaricare i dati da Sheets
        // Questo sovrascrive "MASTER" o "Caricamento..." all'istante
        aggiornaProfiloSidebar();

        if (overlay) overlay.style.display = 'none';
        console.log("Sessione trovata per:", utenteAttuale.nome);
    } else {
        // Se non c'è sessione, forziamo il login
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
    }

    try {
        // 2. CARICAMENTO DATI DAL SERVER (OPERATORI, ECC)
        if (typeof caricaDatiIniziali === "function") {
            await caricaDatiIniziali();
        }

        if (sessione) {
            // Verifica integrità sessione
            if (utenteAttuale.ruolo !== "MASTER" && !utenteAttuale.nome) {
                throw new Error("Sessione corrotta");
            }

            // 3. CARICA LE RICHIESTE FILTRATE
            caricaPaginaRichieste();
        }

    } catch (e) {
        console.warn("Errore o sessione corrotta:", e);
        localStorage.removeItem('sessioneUtente');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
    }
};

// QUESTA FUNZIONE È QUELLA CHE SCRIVE I DATI NELLA TUA SIDEBAR
function aggiornaProfiloSidebar() {
    // Cerchiamo solo gli elementi effettivamente presenti nell'HTML
    const nomeDisplay = document.getElementById('user-name-display');
    const avatarIcon = document.getElementById('user-avatar-icon');

    // Verifichiamo che l'utente sia loggato e abbia un nome
    if (utenteAttuale && utenteAttuale.nome) {

        // Scriviamo il nome (es. SIMONE)
        if (nomeDisplay) {
            nomeDisplay.innerText = utenteAttuale.nome.toUpperCase();
        }

        // Mettiamo l'iniziale nell'avatar (es. S)
        if (avatarIcon) {
            avatarIcon.innerText = utenteAttuale.nome.charAt(0).toUpperCase();
        }
    }
}

function verificaAccesso() {
    const inputField = document.getElementById('email-access');
    const input = inputField.value.trim().toLowerCase();
    const errorDiv = document.getElementById('login-error');

    // Reset errore
    errorDiv.innerText = "";

    // 1. Caso Master
    if (input === "0000") {
        utenteAttuale = { nome: "MASTER", ruolo: "MASTER", vistaSimulata: "MASTER" };
        salvaEApriDashboard();
        return;
    }

    // 2. Caso Operatore
    if (typeof listaOperatori === "undefined" || listaOperatori.length === 0) {
        errorDiv.innerText = "Sincronizzazione in corso... attendi 2 secondi.";
        return;
    }

    const opTrovato = listaOperatori.find(op => op.email && op.email.toLowerCase() === input);

    if (opTrovato) {
        utenteAttuale = {
            nome: opTrovato.nome.toUpperCase(),
            ruolo: "OPERATORE",
            vistaSimulata: opTrovato.nome.toUpperCase()
        };
        salvaEApriDashboard();
    } else {
        errorDiv.innerText = "Email non autorizzata. Verifica nelle impostazioni.";
    }
}

function salvaEApriDashboard() {
    localStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale));

    const overlay = document.getElementById('login-overlay');
    overlay.style.transition = "opacity 0.4s ease";
    overlay.style.opacity = '0';

    setTimeout(() => {
        overlay.style.display = 'none';
        // Ora caricaPaginaRichieste userà utenteAttuale correttamente
        caricaPaginaRichieste();
        if(typeof aggiornaProfiloSidebar === 'function') aggiornaProfiloSidebar();
    }, 400);
}

function logout() {
    // Cancella i dati dell'utente dal browser
    localStorage.removeItem('sessioneUtente');
    // Ricarica la pagina: window.onload non troverà più la sessione e mostrerà il login
    location.reload();
}


// Funzione per generare la pagina Richieste
// Funzione di utilità per formattare la data in modo leggibile
function formattaDataSocial(stringaData) {
    if(!stringaData) return "Data N.D.";
    const d = new Date(stringaData);
    if(isNaN(d)) return stringaData; // Se è già una stringa formattata da Sheets
    return d.toLocaleDateString('it-IT') + " alle " + d.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
}

// Funzioni di supporto per la conversazione
function toggleAreaRisposta(id) {
    const box = document.getElementById('box-risposta-' + id);
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

async function inviaRisposta(idRiga) {
    const areaTesto = document.getElementById('input-risposta-' + idRiga);
    const testo = areaTesto.value.trim();

    if (!testo) {
        alert("Scrivi qualcosa prima di inviare!");
        return;
    }

    try {
        const response = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'aggiungi_risposta',
                id_riga: idRiga,
                testo: testo,
                da: utenteAttuale.nome
            })
        });

        if (response.ok) {
            areaTesto.value = "";
            caricaPaginaRichieste(); // Ricarica la vista per vedere il messaggio aggiornato
        }
    } catch (e) {
        console.error("Errore invio risposta:", e);
        alert("Errore durante l'invio della risposta.");
    }
}

// 1. MODIFICA QUESTA FUNZIONE: Serve a cambiare chi "firma" il messaggio
// 1. MODIFICA QUESTA FUNZIONE: Serve a cambiare chi "firma" il messaggio
function cambiaVistaUtente(valoreSelezionato) {
    // Salviamo la vista simulata
    utenteAttuale.vistaSimulata = valoreSelezionato;

    // CRUCIALE: Cambiamo il nome attuale in base alla selezione per "ingannare" il sistema al momento dell'invio
    if (valoreSelezionato === "MASTER") {
        utenteAttuale.nome = "MASTER";
    } else {
        // Se scelgo ALESSIO, il sistema deve firmare come ALESSIO
        utenteAttuale.nome = valoreSelezionato;
    }

    // Ricarichiamo la pagina per aggiornare bolle e filtri
    caricaPaginaRichieste();
}

async function caricaPaginaRichieste() {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    // Messaggio di caricamento
    contenitore.innerHTML = "<div style='text-align:center; padding:50px; color:#94a3b8;'>Caricamento messaggi...</div>";

    try {
        // 1. SCARICO I DATI (Fondamentale: definisce la variabile 'messaggi')
        const response = await fetch(URL_GOOGLE + "?pagina=STORICO_RICHIESTE");
        const messaggi = await response.json();

        if (typeof aggiornaBadgeNotifiche === 'function') aggiornaBadgeNotifiche(messaggi);
        if (typeof aggiornaBadgeSidebar === 'function') aggiornaBadgeSidebar(messaggi);

        // 2. DEFINISCO LA VISTA ATTIVA
        const vistaAttiva = (utenteAttuale.ruolo === "MASTER")
                            ? (utenteAttuale.vistaSimulata || "MASTER")
                            : utenteAttuale.nome.toUpperCase();

        // 3. SELETTORE MASTER (Appare solo se sei Master)
        let selettoreMaster = "";
        if (utenteAttuale.ruolo === "MASTER") {
            selettoreMaster = `
                <div style="background: white; padding: 15px; border-radius: 16px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: 700; color: #1e293b; font-size: 14px;">👁️ Vista Master:</span>
                        <select onchange="cambiaVistaUtente(this.value)" style="padding: 8px 15px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-weight: 600; color: #3b82f6; cursor:pointer;">
                            <option value="MASTER" ${vistaAttiva === 'MASTER' ? 'selected' : ''}>TUTTI</option>
                            ${listaOperatori.map(op => `<option value="${op.nome.toUpperCase()}" ${vistaAttiva === op.nome.toUpperCase() ? 'selected' : ''}>${op.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>`;
        }

        // 4. FILTRO DEI MESSAGGI
        let filtrati = (vistaAttiva === "MASTER")
            ? messaggi
            : messaggi.filter(m => {
                const dest = String(m.A || "").toUpperCase().trim();
                const mitt = String(m.DA || "").toUpperCase().trim();
                const target = vistaAttiva.toUpperCase().trim();
                return dest === target || mitt === target;
            });

        // 5. GENERAZIONE HTML (Chat Cards)
        let html = selettoreMaster + `<div class="chat-inbox">`;

        filtrati.slice().reverse().forEach(m => {
            const isRisolto = (String(m.RISOLTO).toLowerCase() === "true");
            const isSollecitato = (String(m.SOLLECITO).toLowerCase() === "true");
            const amIMittente = String(m.DA || "").toUpperCase().trim() === vistaAttiva;

            html += `
                <div class="chat-card" style="opacity: ${isRisolto ? '0.7' : '1'}; border-left: ${isSollecitato ? '5px solid #ef4444' : '5px solid #e2e8f0'}; margin-bottom:15px; background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                    <div class="chat-header" style="padding:12px 15px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700; margin-right:8px;">${m.TIPO || 'MSG'}</span>
                            <b style="font-size:14px;">ORD. ${m.ORDINE}</b>
                        </div>
                        <span style="font-size: 11px; color: #94a3b8;">📅 ${m["DATA ORA"] || ''}</span>
                    </div>
                    <div class="chat-body" style="padding:15px;">
                        <div style="display:flex; justify-content:${amIMittente ? 'flex-end' : 'flex-start'}">
                            <div style="max-width:85%; background:${amIMittente ? '#dbeafe' : '#f8fafc'}; padding:10px; border-radius:12px; border:1px solid ${amIMittente ? '#bfdbfe' : '#e2e8f0'}">
                                <div style="font-size:10px; font-weight:800; color:${amIMittente ? '#2563eb' : '#64748b'}; margin-bottom:4px;">${m.DA}</div>
                                <div style="font-size:13px; color:#1e293b;">${m.MESSAGGIO}</div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-footer" style="padding:10px 15px; background:#f8fafc; border-top:1px solid #f1f5f9; display:flex; align-items:center; gap:10px;">
                        ${!isRisolto ? `
                            <button onclick="toggleAreaRisposta('${m.id_riga}')" style="padding:5px 10px; border-radius:6px; border:1px solid #cbd5e1; background:white; cursor:pointer; font-size:12px;">Rispondi</button>
                            <button onclick="aggiornaRichiesta('${m.id_riga}', 'risolto')" style="padding:5px 10px; border-radius:6px; border:none; background:#22c55e; color:white; cursor:pointer; font-size:12px; margin-left:auto;">✓ Risolto</button>
                        ` : '<span style="color:#22c55e; font-size:12px; font-weight:700;">✓ Archiviato</span>'}
                    </div>
                </div>`;
        });

        html += `</div>`;
        contenitore.innerHTML = html;
        cacheContenuti['STORICO_RICHIESTE'] = html;

    } catch (e) {
        console.error("Errore caricamento richieste:", e);
        contenitore.innerHTML = "<div style='text-align:center; padding:50px; color:#ef4444;'>Errore tecnico nel caricamento dei dati.</div>";
    }
}

// 1. GESTIONE CAMPANELLINA (SOLO SOLLECITI)
function aggiornaBadgeNotifiche(messaggi) {
    const badge = document.getElementById('badge-count');
    const bell = document.getElementById('bell-icon');
    if (!badge) return;

    const vistaAttuale = (utenteAttuale.vistaSimulata || "MASTER").toUpperCase().trim();

    let notifiche = messaggi.filter(m => {
        const perMe = (vistaAttuale === "MASTER") ? true : (String(m.A).toUpperCase().trim() === vistaAttuale);
        const nonRisolto = (String(m.RISOLTO).toLowerCase() !== "true");
        const sollecitato = (String(m.SOLLECITO).toLowerCase() === "true");
        return perMe && nonRisolto && sollecitato;
    }).length;

    if (notifiche > 0) {
        badge.innerText = notifiche;
        badge.style.display = 'block';
        if (bell) bell.classList.add('shake');
    } else {
        badge.style.display = 'none';
        if (bell) bell.classList.remove('shake');
    }
}

// 2. GESTIONE BADGE SIDEBAR (TOTALE RICHIESTE ATTIVE)
function aggiornaBadgeSidebar(messaggi) {
    const badgeSidebar = document.getElementById('badge-richieste-count');
    const nomeSidebar = document.getElementById('nome-utente-sidebar');
    const imgAvatar = document.getElementById('img-avatar-sidebar');

    if (!badgeSidebar) return;

    const vistaAttiva = (utenteAttuale.vistaSimulata || "MASTER").toUpperCase().trim();

    // Aggiornamento testuale sidebar
    if(nomeSidebar) nomeSidebar.innerText = vistaAttiva;
    if(imgAvatar) imgAvatar.src = `https://ui-avatars.com/api/?name=${vistaAttiva}&background=2563eb&color=fff`;

    // Conta TUTTE le richieste non risolte per la vista selezionata
    let conteggio = messaggi.filter(m => {
        const destinatario = String(m.A || "").toUpperCase().trim();
        const nonRisolto = (String(m.RISOLTO).toLowerCase() !== "true");

        if (vistaAttiva === "MASTER") return nonRisolto;
        return (destinatario === vistaAttiva) && nonRisolto;
    }).length;

    if (conteggio > 0) {
        badgeSidebar.innerText = conteggio;
        badgeSidebar.style.display = 'inline-block';
    } else {
        badgeSidebar.style.display = 'none';
    }
}
async function aggiornaRichiesta(idRiga, tipoAzione) {
    try {
        await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'aggiorna_richiesta_stato',
                id_riga: idRiga,
                tipo: tipoAzione
            })
        });
        caricaPaginaRichieste(); // Rinfresca la vista
    } catch (e) { alert("Errore aggiornamento"); }
}



    async function caricaImpostazioni() {
        try {
            const res = await fetch(URL_GOOGLE + "?azione=getImpostazioni");
            const settings = await res.json();
            listaStati = settings.stati || [];
            listaOperatori = settings.operatori || [];
        } catch (e) { console.error("Errore caricamento impostazioni"); }
    }

    async function caricaDati(nomeFoglio, isBackgroundUpdate = false) {
        const contenitore = document.getElementById('contenitore-dati');

        // Mostriamo il caricamento solo se NON è un aggiornamento in background
        if (!isBackgroundUpdate) {
            contenitore.innerHTML = "<div style='padding:20px; color:#64748b;'>Caricamento produzione...</div>";
        }

        try {
            const response = await fetch(URL_GOOGLE + "?pagina=" + encodeURIComponent(nomeFoglio));
            const dati = await response.json();

            // --- CONTROLLO DI SICUREZZA ANTI-ACCAVALLAMENTO ---
            // Se mentre aspettavamo il server l'utente ha cambiato pagina, ci fermiamo qui.
            if (paginaAttuale !== nomeFoglio) {
                console.log("Abortito: l'utente ha già cambiato pagina.");
                return;
            }

            const gruppi = {};
            dati.forEach(r => {
                if (String(r.archiviato).toUpperCase() === "TRUE") return;
                const nOrd = r.ordine || "N.D.";
                if (!gruppi[nOrd]) gruppi[nOrd] = [];
                gruppi[nOrd].push(r);
            });

            let html = "";
            Object.keys(gruppi).forEach(nOrd => {
                const righe = gruppi[nOrd];
                const cliente = righe[0].cliente;

                html += `
                <div class="ordine-wrapper">
                    <div class="riga-ordine" onclick="toggleAccordion(this)">
                        <div style="flex-grow:1;">
                            <span style="font-weight:800; font-size:1.1rem;">${cliente}</span>
                            <span style="color:var(--text-muted); margin-left:15px;">ORD. ${nOrd}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <button class="btn-chiedi-assegna" onclick="event.stopPropagation(); apriModalAiuto(null, 'INTERO ORDINE', '${nOrd}')">
                                ✉ Chiedi/Assegna Tutto
                            </button>
                            <button class="btn-sos-small" style="background:#22c55e; color:white; border:none;" onclick="event.stopPropagation(); gestisciArchiviazione('${nOrd}', 'ORDINE')">
                                ✅ ARCHIVIA ORDINE
                            </button>
                            <div class="badge-count">${righe.length} ARTICOLI</div>
                        </div>
                    </div>
                    <div class="dettagli-container">
                        ${righe.map(art => generaCardArticolo(art, nOrd)).join('')}
                    </div>
                </div>`;
            });

            const contenutoFinale = html || "<div style='padding:20px;'>Tutto archiviato o nessun dato trovato.</div>";

            // Scriviamo solo se siamo ancora sulla pagina giusta
            if (paginaAttuale === nomeFoglio) {
                contenitore.innerHTML = contenutoFinale;
                cacheContenuti[nomeFoglio] = contenutoFinale;
            }

        } catch (e) {
            console.error("Errore Produzione:", e);
            if (!isBackgroundUpdate) {
                contenitore.innerHTML = "<div style='padding:20px; color:red;'>Errore nel caricamento produzione.</div>";
            }
        }
    }

    function generaCardArticolo(art, nOrd) {
        const statoAttuale = (art.stato || "IN ATTESA").toUpperCase();
        const configStato = listaStati.find(s => s.nome === statoAttuale) || {colore: "#e2e8f0"};
        const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";

        // Gestione visualizzazione operatori (trasforma la stringa J in badge)
        const displayOperatori = (art.assegna && art.assegna !== "" && art.assegna !== "undefined")
            ? art.assegna.split(',').map(op => `<span class="badge-operatore">${op.trim()}</span>`).join('')
            : `<span style="color:#94a3b8; font-style:italic; font-size:12px;">Libero</span>`;

        return `
        <div class="item-card">
            <div><span class="label-sm">Codice Prodotto</span><b>${codicePrincipale}</b></div>
            <div><span class="label-sm">Quantità</span><b>${art.qty}</b></div>
            <div>
                <span class="label-sm">Stato</span>
                <select class="select-interattivo" style="border-left: 5px solid ${configStato.colore};"
                    onchange="aggiornaDato('${art.id_riga}', 'stato', this.value); this.style.borderLeftColor=listaStati.find(s=>s.nome===this.value).colore">
                    ${listaStati.map(s => `<option value="${s.nome}" ${s.nome === statoAttuale ? 'selected' : ''}>${s.nome}</option>`).join('')}
                </select>
            </div>
            <div>
                <span class="label-sm">Operatore/i Assegnati</span>
                <div class="visualizza-operatori">${displayOperatori}</div>
            </div>
            <div style="text-align: right; display:flex; flex-direction:column; justify-content: center; gap:5px;">
                <button class="btn-chiedi-assegna" onclick="apriModalAiuto('${art.id_riga}', '${codicePrincipale}', '${nOrd}')">
                    ✉ Chiedi/Assegna
                </button>
            </div>
        </div>`;
    }

    function toggleAccordion(elemento) {
        elemento.classList.toggle('open');
        const container = elemento.nextElementSibling;
        container.style.display = elemento.classList.contains('open') ? 'block' : 'none';
    }

    async function aggiornaDato(idRiga, campo, nuovoValore) {
        try {
            await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: 'aggiorna_produzione', id_riga: idRiga, colonna: campo, valore: nuovoValore })
            });
        } catch (e) { alert("Errore salvataggio"); }
    }

    /* --- LOGICA MODAL SUPPORTO --- */
    function apriModalAiuto(idRiga, riferimento, nOrdine) {
        const modal = document.getElementById('modalAiuto');

        // Titolo dinamico: se idRiga esiste è un supporto articolo, altrimenti è tutto l'ordine
        document.getElementById('modal-titolo').innerText = idRiga ?
            `Supporto Art. ${riferimento}` :
            `Supporto Ordine ${nOrdine}`;

        // Generazione lista operatori con checkbox
        // Aggiungiamo data-nome per recuperare facilmente il nome da scrivere nei badge
        document.getElementById('wrapper-operatori').innerHTML = listaOperatori.map(op => `
            <label class="op-label">
                <input type="checkbox" name="destinatario" value="${op.email}" data-nome="${op.nome}">
                <span><b>${op.nome}</b> <small style="color:var(--text-muted)">(${op.reparto || 'Team'})</small></span>
            </label>
        `).join('');

        // Salviamo i dati necessari nel dataset del modal per usarli quando clicchiamo "Invia"
        modal.dataset.idRiga = idRiga || ""; // Se vuoto, la funzione .gs capirà che è per tutto l'ordine
        modal.dataset.nOrdine = nOrdine;

        // Reset del campo testo e impostazione tab iniziale
        document.getElementById('messaggio-aiuto').value = "";
        setTipoAzione('ASSEGNAZIONE');

        modal.style.display = 'flex';
    }

    function setTipoAzione(tipo) {
        document.getElementById('modalAiuto').dataset.tipoAzione = tipo;
        document.getElementById('btn-tipo-assegna').classList.toggle('active', tipo === 'ASSEGNAZIONE');
        document.getElementById('btn-tipo-domanda').classList.toggle('active', tipo === 'DOMANDA');
    }

    function chiudiModal() { document.getElementById('modalAiuto').style.display = 'none'; }
    async function confermaInvioSupporto() {
        const modal = document.getElementById('modalAiuto');
        const idRiga = modal.dataset.idRiga;
        const nOrd = modal.dataset.nOrdine;
        const messaggio = document.getElementById('messaggio-aiuto').value;
        const tipoAzione = modal.dataset.tipoAzione;

        const checkboxSelezionate = document.querySelectorAll('input[name="destinatario"]:checked');

        if (checkboxSelezionate.length === 0) {
            alert("Per favore, seleziona almeno un operatore.");
            return;
        }

        // 1. Nomi per i Badge (Dashboard Produzione - Colonna J)
        const listaNomi = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome')).join(', ');

        // 2. Nomi per il Destinatario (Storico_Richieste - Colonna G)
        // Usiamo i nomi perché la tua "Casella" filtra per NOME, non per email
        const listaNomiDestinatari = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome'));

        try {
            // --- AZIONE A: Aggiorna i Badge nella Produzione ---
            const urlAssegnazione = `${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(listaNomi)}&id_riga=${idRiga}`;
            await fetch(urlAssegnazione);

            // --- AZIONE B: Salva nello Storico Messaggi ---
            const payload = {
                azione: 'supporto_multiplo',
                n_ordine: nOrd,
                tipo: tipoAzione,
                messaggio: messaggio || (tipoAzione === 'ASSEGNAZIONE' ? "Nuova assegnazione" : "Richiesta supporto"),
                mittente: "MASTER",
                destinatari: listaNomiDestinatari // Ora inviamo i Nomi, così Alessio li vede!
            };

            await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            // Chiudi e ricarica
            chiudiModal();
            caricaDati(paginaAttuale);

        } catch (e) {
            console.error("Errore durante l'operazione:", e);
            alert("Errore nell'invio delle informazioni.");
        }
    }

    /* --- GESTIONE PAGINE & IMPOSTAZIONI --- */
    /*******************************************************************************
     * 2. MOTORE DI NAVIGAZIONE (GESTIONE REFRESH E FLUIDITÀ)
     *******************************************************************************/

     function cambiaPagina(nomeFoglio, elementoMenu) {
       // 1. Validazione input
       if (!nomeFoglio || nomeFoglio === "undefined" || nomeFoglio === "null") {
           nomeFoglio = "PROGRAMMA PRODUZIONE DEL MESE";
       }

       // 2. Aggiornamento Stato e Memoria
       localStorage.setItem('ultimaPaginaProduzione', nomeFoglio);
       paginaAttuale = nomeFoglio;

       // 3. UI: Sidebar (Gestione classi active immediata)
       document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
       if (!elementoMenu) {
           elementoMenu = document.querySelector(`.menu-item[data-page="${nomeFoglio}"]`);
       }
       if (elementoMenu) elementoMenu.classList.add('active');

       // 4. UI: Titolo
       const titolo = document.getElementById('titolo-pagina');
       if (titolo) {
           const titoli = {
               'IMPOSTAZIONI': "Impostazioni Sistema",
               'STORICO_RICHIESTE': "La mia Casella",
               'ARCHIVIO_ORDINI': "Archivio Ordini",
               'PROGRAMMA PRODUZIONE DEL MESE': "Dashboard Produzione"
           };
           titolo.innerText = titoli[nomeFoglio] || nomeFoglio;
       }

       const contenitore = document.getElementById('contenitore-dati');

       // --- FIX ACCAVALLAMENTO: SVUOTAMENTO TOTALE ---
       // Questo impedisce che i vecchi dati restino visibili mentre carichiamo i nuovi
       contenitore.innerHTML = "";

       // 5. GESTIONE CACHE
       if (cacheContenuti[nomeFoglio]) {
           // Mostriamo subito quello che abbiamo in memoria (velocità fulminea)
           contenitore.innerHTML = cacheContenuti[nomeFoglio];
           console.log("Rendering istantaneo da cache:", nomeFoglio);

           // Se è la produzione, aggiorniamo i dati dal server in background (silenzioso)
           if (nomeFoglio === "PROGRAMMA PRODUZIONE DEL MESE") {
               // Passiamo 'true' come secondo argomento per indicare che è un aggiornamento silente
               caricaDati(nomeFoglio, true);
           }
           return; // Fermiamo qui l'esecuzione perché abbiamo già renderizzato la cache
       }

       // 6. CARICAMENTO STANDARD (Solo se la cache è vuota o è il primo avvio)
       console.log("Cache vuota, caricamento dal server per:", nomeFoglio);

       if (nomeFoglio === 'IMPOSTAZIONI') {
           caricaInterfacciaImpostazioni();
       } else if (nomeFoglio === 'STORICO_RICHIESTE') {
           caricaPaginaRichieste();
       } else if (nomeFoglio === 'ARCHIVIO_ORDINI') {
           caricaArchivio();
       } else {
           // Caricamento standard (non silenzioso, mostrerà il messaggio "Caricamento...")
           caricaDati(nomeFoglio, false);
       }
   }


    /*******************************************************************************
     * 3. INTERFACCIA IMPOSTAZIONI (CESTINO ELEGANTE E SALVATAGGIO)
     *******************************************************************************/

     function caricaInterfacciaImpostazioni() {
         const contenitore = document.getElementById('contenitore-dati');
         if (!contenitore) return;

         contenitore.innerHTML = `
             <div class="settings-container">

                 <div class="card-settings">
                     <h3><i class="fas fa-tag"></i> Stati Produzione</h3>
                     <div id="lista-stati-config">
                         ${listaStati.map((s, i) => `
                             <div class="config-row-modern" style="flex-direction: row; align-items: center; gap: 12px;">
                                 <div style="position:relative; width:32px; height:32px;">
                                     <input type="color" value="${s.colore}"
                                            style="position:absolute; opacity:0; width:100%; height:100%; cursor:pointer; z-index:2;"
                                            onchange="listaStati[${i}].colore=this.value; segnaModifica(); caricaInterfacciaImpostazioni();">
                                     <div class="status-dot-custom" style="background:${s.colore};"></div>
                                 </div>
                                 <input type="text" class="input-flat" style="flex:1;" value="${s.nome || s.stato}" onchange="listaStati[${i}].nome=this.value.toUpperCase(); segnaModifica();">
                                 <button class="btn-trash-modern" onclick="azioneEliminaStato(${i})"><i class="fas fa-trash"></i></button>
                             </div>
                         `).join('')}
                     </div>
                     <button class="btn-add-dashed" onclick="azioneAggiungiStato()">+ Aggiungi Stato</button>
                 </div>

                 <div class="card-settings">
                     <h3><i class="fas fa-user-check"></i> Team</h3>
                     <div id="lista-op-config">
                         ${listaOperatori.map((op, i) => `
                             <div class="config-row-modern">
                                 <div style="display:flex; align-items:center; justify-content:space-between;">
                                     <div style="display:flex; align-items:center; gap:10px;">
                                         <div class="avatar-circle">${op.nome.charAt(0)}</div>
                                         <input type="text" class="input-flat" value="${op.nome}" onchange="listaOperatori[${i}].nome=this.value; segnaModifica();">
                                     </div>
                                     <button class="btn-trash-modern" onclick="azioneEliminaOp(${i})"><i class="fas fa-trash"></i></button>
                                 </div>
                                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                     <input type="text" class="input-field-modern" placeholder="Email" value="${op.email || ''}" onchange="listaOperatori[${i}].email=this.value; segnaModifica();">
                                     <input type="text" class="input-field-modern" placeholder="Reparto" value="${op.reparto || ''}" onchange="listaOperatori[${i}].reparto=this.value; segnaModifica();">
                                 </div>
                             </div>
                         `).join('')}
                     </div>
                     <button class="btn-add-dashed" onclick="azioneAggiungiOp()">+ Aggiungi Operatore</button>
                 </div>

             </div>

             <div style="width:100%; text-align:center; margin: 30px 0;">
                 <button class="btn-update" style="background:#1e293b; color:white; padding:14px 40px; border-radius:12px; font-weight:700; font-size:14px; border:none; cursor:pointer;" onclick="salvaTutteImpostazioni()">
                     Salva Modifiche
                 </button>
             </div>
         `;
     }
     /* --- FUNZIONI SUPPORTO IMPOSTAZIONI --- */

     /* --- LOGICA SUPPORTO IMPOSTAZIONI --- */
     function azioneEliminaStato(i) {
         if(confirm("Sei sicuro di voler eliminare questo stato?")) {
             listaStati.splice(i, 1);
             segnaModifica();
             caricaInterfacciaImpostazioni();
         }
     }

     function azioneAggiungiStato() {
         listaStati.push({nome: 'NUOVO', colore: '#94a3b8'});
         segnaModifica();
         caricaInterfacciaImpostazioni();
     }

     function azioneEliminaOp(i) {
         if(confirm("Rimuovere questo operatore dal sistema?")) {
             listaOperatori.splice(i, 1);
             segnaModifica();
             caricaInterfacciaImpostazioni();
         }
     }

     function azioneAggiungiOp() {
         listaOperatori.push({nome: 'Nuovo Operatore', email: '', reparto: ''});
         segnaModifica();
         caricaInterfacciaImpostazioni();
     }

    // Funzione per attivare l'allerta salvataggio
function segnaModifica() {
    modifichePendenti = true;
    const btn = document.getElementById('btn-salva-globale');
    if (btn) {
        btn.style.background = "#ef4444"; // Diventa rosso per segnalare modifiche
        btn.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Salva Modifiche Ora!";
    }
}

    function handleDrop(e, target, tipo) {
        const source = e.dataTransfer.getData('text');
        if (tipo !== tipoTrascinamento) return;
        const arr = tipo === 'stati' ? listaStati : listaOperatori;
        const [removed] = arr.splice(source, 1);
        arr.splice(target, 0, removed);
        caricaInterfacciaImpostazioni();
    }

    async function salvaTutteImpostazioni() {
        try {
            await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: 'salva_impostazioni_globali', stati: listaStati, operatori: listaOperatori })
            });
            alert("Salvato correttamente!");
        } catch (e) { alert("Errore nel salvataggio"); }
    }

    async function aggiornaCorrente() {
      const contenitore = document.getElementById('contenitore-dati');
      if (!contenitore) return;

      console.log("Forzo aggiornamento dati per:", paginaAttuale);

      // 1. Pulizia Cache
      if (paginaAttuale === 'IMPOSTAZIONI') {
          // Se aggiorniamo le impostazioni, svuotiamo TUTTA la cache
          // perché i nomi operatori o stati potrebbero cambiare ovunque
          for (let key in cacheContenuti) delete cacheContenuti[key];
      } else {
          // Altrimenti eliminiamo solo la cache della pagina in cui ci troviamo
          delete cacheContenuti[paginaAttuale];
      }

      // 2. Feedback visivo: Svuotiamo e mostriamo il caricamento
      contenitore.innerHTML = "<div style='padding:20px; color:#64748b;'>Aggiornamento in corso...</div>";

      // 3. Smistamento caricamento
      try {
          if (paginaAttuale === 'IMPOSTAZIONI') {
              await caricaImpostazioni(); // Ricarica i dati da Google
              caricaInterfacciaImpostazioni(); // Disegna l'interfaccia
          }
          else if (paginaAttuale === 'STORICO_RICHIESTE') {
              await caricaPaginaRichieste();
          }
          else if (paginaAttuale === 'ARCHIVIO_ORDINI') {
              await caricaArchivio();
          }
          else {
              // Per tutte le pagine di produzione
              await caricaDati(paginaAttuale);
          }
          console.log("Aggiornamento completato con successo.");
      } catch (errore) {
          console.error("Errore durante l'aggiornamento:", errore);
          contenitore.innerHTML = "<div style='padding:20px; color:red;'>Errore durante l'aggiornamento dei dati.</div>";
      }
  }

    function formattaData(stringaData) {
    if (!stringaData) return "";
    try {
        const d = new Date(stringaData);
        // Verifica se la data è valida
        if (isNaN(d.getTime())) return stringaData;

        const giorno = String(d.getDate()).padStart(2, '0');
        const mese = String(d.getMonth() + 1).padStart(2, '0');
        const anno = d.getFullYear();
        const ore = String(d.getHours()).padStart(2, '0');
        const minuti = String(d.getMinutes()).padStart(2, '0');

        return `${giorno}/${mese}/${anno} ${ore}:${minuti}`;
    } catch (e) {
        return stringaData;
    }
}
async function caricaArchivio() {
    const contenitore = document.getElementById('contenitore-dati');
    contenitore.innerHTML = "<div style='padding:20px; color:#64748b;'>Caricamento archivio in corso...</div>";

    try {
        const response = await fetch(URL_GOOGLE + "?pagina=ARCHIVIO_ORDINI");
        const dati = await response.json();

        if (!dati || dati.length === 0) {
            const msgVuoto = "<div style='padding:20px;'>Nessun dato trovato nel foglio ARCHIVIO_ORDINI.</div>";
            contenitore.innerHTML = msgVuoto;
            cacheContenuti['ARCHIVIO_ORDINI'] = msgVuoto;
            return;
        }

        const gruppi = {};
        dati.forEach(r => {
            const nOrd = r.ordine || "N.D.";
            if (!gruppi[nOrd]) gruppi[nOrd] = [];
            gruppi[nOrd].push(r);
        });

        let html = "";
        Object.keys(gruppi).forEach(nOrd => {
            const righe = gruppi[nOrd];
            const cliente = righe[0].cliente;

            html += `
            <div class="ordine-wrapper" style="opacity: 0.9; border-color: #cbd5e1; margin-bottom:15px;">
                <div class="riga-ordine" onclick="toggleAccordion(this)" style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <div style="flex-grow:1;">
                        <span style="font-weight:800; color:#475569;">${cliente}</span>
                        <span style="color:#94a3b8; margin-left:15px;">ORD. ${nOrd}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button class="btn-sos-small"
                                style="background:#f97316; color:white; border:none; padding: 5px 10px; border-radius:6px; cursor:pointer;"
                                onclick="event.stopPropagation(); gestisciRipristino('${nOrd}', 'ORDINE', 'ERRORE')">
                                🔄 Ripristina Ordine
                        </button>
                        <div class="badge-count" style="background:#e2e8f0; color:#475569; padding:2px 8px; border-radius:4px; font-size:11px;">${righe.length} ART.</div>
                    </div>
                </div>
                <div class="dettagli-container" style="display:none; padding:10px; background:#f1f5f9;">
                    ${righe.map(art => generaCardArchivio(art, nOrd)).join('')}
                </div>
            </div>`;
        });

        contenitore.innerHTML = html;
        // Salva in cache con la chiave specifica
        cacheContenuti['ARCHIVIO_ORDINI'] = html;

    } catch (e) {
        console.error(e);
        contenitore.innerHTML = "<div style='padding:20px; color:red;'>Errore nel caricamento del foglio ARCHIVIO_ORDINI.</div>";
    }
}
function generaCardArchivio(art, nOrd) {
    const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";
    const statoArchiviato = (art.stato || "COMPLETATO").toUpperCase();

    // LOGICA PULIZIA OPERATORE
    // Se art.assegna è nullo, vuoto o la stringa "false", scriviamo "Nessuno"
    let operatoreValore = art.assegna;
    if (!operatoreValore || operatoreValore === "false" || operatoreValore === "") {
        operatoreValore = "Nessuno";
    }

    return `
    <div class="item-card archivio-layout">
        <div>
            <span class="label-sm">Codice Prodotto</span>
            <b style="color:#1e293b;">${codicePrincipale}</b>
        </div>

        <div style="text-align:center;">
            <span class="label-sm">Quantità</span>
            <b style="font-size:16px;">${art.qty}</b>
        </div>

        <div>
            <span class="label-sm">Ultimo Stato</span>
            <span style="color:#64748b; font-weight:700;">${statoArchiviato}</span>
        </div>

        <div>
            <span class="label-sm">Operatore</span>
            <span style="color:#64748b; font-weight:600;">${operatoreValore}</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:5px;">
            <button class="btn-archive-action"
                    style="background:#3b82f6; color:white; border:none;"
                    onclick="gestisciRipristino('${art.id_riga}', 'RIGA', 'RESO')">
                📦 Reso Cliente
            </button>
            <button class="btn-archive-action"
                    style="background:white; color:#f97316; border:1px solid #f97316;"
                    onclick="gestisciRipristino('${art.id_riga}', 'RIGA', 'ERRORE')">
                🔄 Errore Archiv.
            </button>
        </div>
    </div>`;
}
// --- FUNZIONE PER ARCHIVIARE (DALLA PRODUZIONE ALL'ARCHIVIO) ---
async function gestisciArchiviazione(nOrd, tipo) {
    if (!confirm("Vuoi spostare l'ordine " + nOrd + " nell'archivio?")) return;

    // Feedback visivo sul tasto (opzionale)
    const tasto = event.target;
    const testoOriginale = tasto.innerHTML;
    tasto.innerHTML = "⏳ Archiviazione...";
    tasto.style.opacity = "0.7";

    try {
        // Usiamo 'azione' perché nel tuo .gs hai scritto: var azione = e.parameter.azione;
        const url = URL_GOOGLE + "?azione=archiviaOrdine&ordine=" + encodeURIComponent(nOrd);

        const response = await fetch(url);
        const risultato = await response.json();

        if (risultato.status === "success") {
            alert("Ordine " + nOrd + " archiviato correttamente!");
            // IMPORTANTE: ricarica la pagina per far sparire l'ordine che hai appena spostato
            caricaDati(paginaAttuale);
        } else {
            alert("Errore dal server: " + risultato.message);
            tasto.innerHTML = testoOriginale;
            tasto.style.opacity = "1";
        }
    } catch (errore) {
        console.error("Errore critico:", errore);
        alert("Errore di connessione al server Google.");
        tasto.innerHTML = testoOriginale;
        tasto.style.opacity = "1";
    }
}

// --- FUNZIONE PER RIPRISTINARE (DALL'ARCHIVIO ALLA PRODUZIONE) ---
async function gestisciRipristino(id_o_numero, tipo, motivo) {
    const msg = tipo === 'ORDINE'
        ? `Vuoi riportare l'intero ordine ${id_o_numero} in PRODUZIONE?`
        : `Vuoi riportare questo articolo in PRODUZIONE?`;

    if(!confirm(msg)) return;

    try {
        // Usiamo 'azione=ripristinaOrdine' come definito nel .gs
        // Se tipo è 'RIGA' dovremo gestire la riga singola, ma per ora lo script .gs
        // sposta l'intero ordine per sicurezza.
        const url = URL_GOOGLE + "?azione=ripristinaOrdine&ordine=" + encodeURIComponent(id_o_numero);

        const response = await fetch(url);
        const risultato = await response.json();

        if (risultato.status === "success") {
            alert("Spostato in Produzione!");
            caricaArchivio(); // Ricarica la pagina archivio per aggiornare la lista
        } else {
            alert("Nota: " + risultato.message);
        }
    } catch (e) {
        alert("Errore durante il ripristino.");
    }
}







//--SMARTPHONE--//

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    // Aggiunge o toglie la classe che sposta la sidebar con transform
    sidebar.classList.toggle('mobile-open');
}























//--FUNZIONE FINALE--//

document.addEventListener('DOMContentLoaded', async function() {

    // 1️⃣ Carica prima le impostazioni (operatori + stati)
    await caricaImpostazioni();

    // 2️⃣ Recupera pagina salvata
    let paginaSalvata = localStorage.getItem('ultimaPaginaProduzione');

    if (!paginaSalvata || paginaSalvata === "undefined" || paginaSalvata === "null") {
        paginaSalvata = "PROGRAMMA PRODUZIONE DEL MESE";
    }

    // 3️⃣ Trova il tasto
    const tastoMenu = document.querySelector(`.menu-item[data-page="${paginaSalvata}"]`);

    // 4️⃣ Cambia pagina (questa farà il fetch corretto)
    cambiaPagina(paginaSalvata, tastoMenu);
});
