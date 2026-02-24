/*******************************************************************************
* 1. CONFIGURAZIONE, VARIABILI GLOBALI E STATO
*******************************************************************************/
const URL_GOOGLE = "https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec";

// Fallback: se una sessione è già presente, nascondi subito l'overlay (evita blocchi/flicker
// se il browser ritarda l'esecuzione di window.onload).
try {
    if (localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente')) {
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'none';
    }
} catch (e) {}

let paginaAttuale = null; // NON leggere subito da localStorage
let modifichePendenti = false;
let listaOperatori = [];
let listaStati = [];
let tipoTrascinamento = "";
const cacheContenuti = {};
const cacheFetchTime = {}; // timestamp dell'ultimo fetch per pagina
const CACHE_TTL_MS = 30000; // 30 secondi: sotto questa soglia non fare background refresh

// ---- runtime guards (anti doppio init / race rendering) ----
let _bootCompleted = false;
let _pageInitDone = false;
let _bindingsInitDone = false;
let _navRequestSerial = 0;
let _latestNavRequest = 0;

// ---- search optimisation helpers ----
let elementiDaFiltrareCache = null;
let ricercaTimeout = null;

// small DOM shortcuts
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Tailwind utility presets (keeps templates consistent + easy to tweak)
const TW = {
    card: 'bg-white/90 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow',
    cardGrid: 'grid gap-3',
    label: 'text-[10px] uppercase tracking-wide text-slate-500 font-semibold',
    value: 'text-slate-900 font-semibold',
    btn: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] transition',
    btnPrimary: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.99] transition',
    btnSuccess: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.99] transition',
    btnWarning: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 active:scale-[0.99] transition',
    btnDanger: 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.99] transition',
    btnPrimaryLg: 'inline-flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] transition shadow-sm',
    pill: 'inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600',
};

function aggiornaListaFiltrabili() {
    elementiDaFiltrareCache = document.querySelectorAll('.ordine-wrapper, .chat-card, .materiale-card');
}

// helper per richieste REST
// Cache raw ordini per autocomplete nel modal
let _ordiniAutocompleteCache = [];
let _attiviProd = [];  // cache per il chart overview nella pagina produzione

async function fetchJson(pagina) {
    const url = URL_GOOGLE + "?pagina=" + encodeURIComponent(pagina);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function applicaFade(elem) {
    if (elem) {
        elem.classList.add('fade-in');
        setTimeout(() => elem.classList.remove('fade-in'), 300);
    }
}



let utenteAttuale = {
    nome: "",
    ruolo: "",
    vistaSimulata: ""
};

window.onload = async function() {
    if (_bootCompleted) return;
    _bootCompleted = true;
    console.log("Inizializzazione sistema...");

    // 1. Gestione immediata dell'interfaccia per evitare "lampi"
    const overlay = document.getElementById('login-overlay');
    let sessione = null;
    try { sessione = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente'); } catch (e) {}

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
            // Il caricamento della pagina è già gestito da DOMContentLoaded → cambiaPagina()
            // Non chiamare caricaPaginaRichieste() qui per evitare doppio caricamento
        }

    } catch (e) {
        console.warn("Errore caricamento dati iniziali:", e);
        let sessioneEsistente = null;
        try { sessioneEsistente = localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente'); } catch (e) {}
        // Cancella sessione e mostra login SOLO se è esplicitamente corrotta
        // mai per errori di rete, timeout GAS o altri errori non critici
        if (e && e.message === "Sessione corrotta") {
            try { localStorage.removeItem('sessioneUtente'); } catch (e) {}
            try { sessionStorage.removeItem('sessioneUtente'); } catch (e) {}
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
        } else if (!sessioneEsistente) {
            // Nessuna sessione in localStorage → mostra login
            if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
        }
        // Se c'è una sessione valida, l'utente resta dentro — l'errore è solo di rete
    }
};






//ACCESSO E INIZIALIZZAZIONE//
function setLoginMode(mode) {
    const isAdmin = mode === 'admin';
    document.getElementById('login-view-utente').style.display = isAdmin ? 'none' : '';
    document.getElementById('login-view-admin').style.display  = isAdmin ? ''     : 'none';
    document.getElementById('login-error').innerText = '';
    if (isAdmin) setTimeout(() => document.getElementById('login-codice')?.focus(), 50);
}
function togglePasswordVisibility() {
    const pwd  = document.getElementById('login-password');
    const icon = document.getElementById('eye-icon');
    const isHidden = pwd.type === 'password';
    pwd.type = isHidden ? 'text' : 'password';
    icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
}
async function hashSHA256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
async function _verificaAccessoUtente() {
    const errorDiv = document.getElementById('login-error');
    errorDiv.innerText = "";
    errorDiv.style.color = "";

    const isAdmin = document.getElementById('login-view-admin')?.style.display !== 'none';

    // — Modalità ADMIN —
    if (isAdmin) {
        const codice = (document.getElementById('login-codice')?.value || '').trim();
        if (codice === '0000') {
            utenteAttuale = { nome: "MASTER", ruolo: "MASTER", vistaSimulata: "MASTER" };
            salvaEApriDashboard();
        } else {
            errorDiv.innerText = "Codice non valido.";
        }
        return;
    }

    // — Modalità UTENTE —
    const email    = (document.getElementById('login-email')?.value    || '').trim().toLowerCase();
    const username = (document.getElementById('login-username')?.value || '').trim();
    const password = (document.getElementById('login-password')?.value || '');
    if (!email || !username || !password) {
        errorDiv.innerText = "Compila tutti i campi: email, nome utente e password.";
        return;
    }
    const btn = document.getElementById('btn-login');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifica...';
    try {
        const hash = await hashSHA256(password);
        const res  = await fetch(`${URL_GOOGLE}?azione=verificaLogin&email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&hash=${encodeURIComponent(hash)}`);
        const r    = await res.json();
        if (r.status === "success") {
            utenteAttuale = { nome: r.nome, ruolo: r.ruolo, email: r.email, vistaSimulata: r.nome };
            salvaEApriDashboard();
        } else {
            errorDiv.innerText = r.message || "Credenziali non valide.";
        }
    } catch (e) {
        errorDiv.innerText = "Errore di connessione. Riprova.";
    }
    btn.disabled = false;
    btn.innerHTML = 'Entra nel Sistema <i class="fas fa-arrow-right"></i>';
}
async function _creaAccountUtente() {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) errorDiv.innerText = "";
    if (errorDiv) errorDiv.style.color = "";

    const email    = (document.getElementById('login-email')?.value    || '').trim().toLowerCase();
    const username = (document.getElementById('login-username')?.value || '').trim();
    const password = (document.getElementById('login-password')?.value || '');

    if (!email || !username || !password) {
        if (errorDiv) errorDiv.innerText = "Per creare l'account compila email, nome utente e password.";
        return;
    }

    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const oldLogin = btnLogin ? btnLogin.innerHTML : '';
    const oldSignup = btnSignup ? btnSignup.innerHTML : '';

    if (btnLogin) btnLogin.disabled = true;
    if (btnSignup) {
        btnSignup.disabled = true;
        btnSignup.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creazione...';
    }

    try {
        const hash = await hashSHA256(password);
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'creaUtentePubblico',
                email,
                username,
                hash
            })
        });
        const r = await res.json();

        if (r.status === 'success') {
            if (errorDiv) errorDiv.style.color = '#22c55e';
            if (errorDiv) errorDiv.innerText = 'Account creato. Accesso in corso...';
            await _verificaAccessoUtente();
        } else {
            if (errorDiv) errorDiv.style.color = '';
            if (errorDiv) errorDiv.innerText = r.message || 'Impossibile creare l\'account.';
        }
    } catch (e) {
        if (errorDiv) errorDiv.style.color = '';
        if (errorDiv) errorDiv.innerText = 'Errore di connessione. Riprova.';
    } finally {
        if (btnLogin) {
            btnLogin.disabled = false;
            btnLogin.innerHTML = oldLogin || 'Entra nel Sistema <i class="fas fa-arrow-right"></i>';
        }
        if (btnSignup) {
            btnSignup.disabled = false;
            btnSignup.innerHTML = oldSignup || '<i class="fas fa-user-plus"></i> Nuovo utente? Crea account';
        }
    }
}
function aggiornaProfiloSidebar() {
    const nomeDisplay = document.getElementById('user-name-display');
    const avatarIcon = document.getElementById('user-avatar-icon');
    const ddropAvatar = document.getElementById('account-ddrop-avatar');
    const ddropName = document.getElementById('account-ddrop-name');
    const ddropRole = document.getElementById('account-ddrop-role');

    if (utenteAttuale && utenteAttuale.nome) {
        const iniziale = utenteAttuale.nome.charAt(0).toUpperCase();
        const nomeUp = utenteAttuale.nome.toUpperCase();

        if (nomeDisplay) nomeDisplay.innerText = nomeUp;
        if (avatarIcon) avatarIcon.innerText = iniziale;
        if (ddropAvatar) ddropAvatar.innerText = iniziale;
        if (ddropName) ddropName.innerText = nomeUp;
        if (ddropRole) ddropRole.innerText = (utenteAttuale.ruolo || 'Utente').toUpperCase();
    }
}

function toggleAccountMenu(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('account-dropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('open');
}

function chiudiAccountMenu() {
    const dropdown = document.getElementById('account-dropdown');
    if (dropdown) dropdown.classList.remove('open');
}

// Chiude il dropdown cliccando fuori
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('account-dropdown');
    const btn = document.getElementById('user-avatar-btn');
    if (dropdown && dropdown.classList.contains('open')) {
        if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    }
});

/* ---- SIDEBAR TOGGLE ---- */
function toggleSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    if (!sidebar) return;
    const isCollapsed = sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    try { localStorage.setItem('sidebarCollapsed', isCollapsed ? '1' : '0'); } catch(e) {}
}

function initSidebarState() {
    try {
        const saved = localStorage.getItem('sidebarCollapsed');
        const sidebar = document.getElementById('main-sidebar');
        if (saved === '1') {
            if (sidebar) sidebar.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        }
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', initSidebarState);
/* ---- FINE SIDEBAR TOGGLE ---- */ // QUESTA FUNZIONE È QUELLA CHE SCRIVE I DATI NELLA TUA SIDEBAR
function salvaEApriDashboard() {
    try { localStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}
    try { sessionStorage.setItem('sessioneUtente', JSON.stringify(utenteAttuale)); } catch (e) {}

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
    try {
        // 1. Pulizia totale della memoria del browser
        localStorage.clear();
        sessionStorage.clear();

        // 2. Reindirizzamento pulito alla pagina iniziale
        // Aggiungiamo un parametro casuale per evitare che il browser usi la cache vecchia
        window.location.href = window.location.origin + window.location.pathname + "?logout=" + Date.now();

    } catch (error) {
        // Se c'è un errore imprevisto, forziamo comunque il ricaricamento
        console.error("Errore durante il logout:", error);
        window.location.reload();
    }
}
// Badge unico sidebar: conta richieste non risolte, diventa arancione pulsante se ci sono sollecitati
function aggiornaBadgeNotifiche() {} // no-op: accorpata in aggiornaBadgeSidebar

/* ── Modal di conferma generico ─────────────────────── */
function mostraConferma(titolo, messaggio, onOk, labelOk) {
    const modal  = document.getElementById('modal-conferma');
    const btnOk  = document.getElementById('modal-conferma-ok');
    document.getElementById('modal-conferma-titolo').innerText = titolo;
    document.getElementById('modal-conferma-msg').innerText    = messaggio;
    btnOk.innerText = labelOk || 'Conferma';
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    btnOk.onclick = () => { _chiudiConferma(); onOk(); };
}
function _chiudiConferma() {
    const modal = document.getElementById('modal-conferma');
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}
/* chiudi anche notifica toast */
function notificaElegante(msg, tipo) {
    let el = document.getElementById('toast-notifica');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast-notifica';
        document.body.appendChild(el);
    }
    el.className = 'toast-notifica' + (tipo === 'error' ? ' toast-error' : '');
    el.innerText = msg;
    // forza reflow per ripartire l'animazione
    void el.offsetWidth;
    el.classList.add('visible');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => { el.classList.remove('visible'); }, 3000);
}
function aggiornaBadgeSidebar(messaggi) {
    const badgeSidebar = document.getElementById('badge-richieste-count');
    const nomeSidebar  = document.getElementById('nome-utente-sidebar');
    const imgAvatar    = document.getElementById('img-avatar-sidebar');

    if (!badgeSidebar) return;

    const vistaAttiva = (utenteAttuale.vistaSimulata || 'MASTER').toUpperCase().trim();

    if (nomeSidebar) nomeSidebar.innerText = vistaAttiva;
    if (imgAvatar)   imgAvatar.src = `https://ui-avatars.com/api/?name=${vistaAttiva}&background=2563eb&color=fff`;

    // Se si è già sulla pagina richieste, il badge rimane nascosto
    if (paginaAttuale === 'STORICO_RICHIESTE') {
        badgeSidebar.style.display = 'none';
        badgeSidebar.classList.remove('badge-sollecito-attivo');
        return;
    }

    const rilevanti = messaggi.filter(m => {
        const dest      = String(m.A || '').toUpperCase().trim();
        const nonRisolto = String(m.RISOLTO).toLowerCase() !== 'true';
        if (vistaAttiva === 'MASTER') return nonRisolto;
        return dest === vistaAttiva && nonRisolto;
    });

    const conteggio    = rilevanti.length;
    const sollecitati  = rilevanti.filter(m => String(m.SOLLECITO).toLowerCase() === 'true').length;

    if (conteggio > 0) {
        badgeSidebar.innerText = conteggio;
        badgeSidebar.style.display = 'inline-block';
        // Arancione pulsante se ci sono sollecitati, rosso normale altrimenti
        if (sollecitati > 0) {
            badgeSidebar.classList.add('badge-sollecito-attivo');
        } else {
            badgeSidebar.classList.remove('badge-sollecito-attivo');
        }
    } else {
        badgeSidebar.style.display = 'none';
        badgeSidebar.classList.remove('badge-sollecito-attivo');
    }

    // Sincronizza anche il badge nell'app bar mobile
    const badgeMobile = document.getElementById('badge-mobile-notif');
    if (badgeMobile) {
        if (conteggio > 0 && paginaAttuale !== 'STORICO_RICHIESTE') {
            badgeMobile.innerText = conteggio;
            badgeMobile.style.display = 'inline-block';
            badgeMobile.style.background = sollecitati > 0 ? '#f97316' : '#ef4444';
        } else {
            badgeMobile.style.display = 'none';
        }
    }

    // Sincronizza il badge nel bottom nav
    const badgeBottom = document.getElementById('badge-bottom-richieste');
    if (badgeBottom) {
        if (conteggio > 0 && paginaAttuale !== 'STORICO_RICHIESTE') {
            badgeBottom.innerText = conteggio;
            badgeBottom.style.display = 'inline-block';
            if (sollecitati > 0) badgeBottom.classList.add('badge-sollecito-attivo');
            else badgeBottom.classList.remove('badge-sollecito-attivo');
        } else {
            badgeBottom.style.display = 'none';
            badgeBottom.classList.remove('badge-sollecito-attivo');
        }
    }
}
function cambiaPagina(nomeFoglio, elementoMenu) {
    const requestId = ++_navRequestSerial;
    _latestNavRequest = requestId;

    // reset possible filter cache when switching pages
    elementiDaFiltrareCache = null;

    // 1. Reset immediato della ricerca (per evitare di vedere dati filtrati della pagina precedente)
    const searchInput = document.getElementById('universal-search');
    if (searchInput) searchInput.value = "";
    const deskSearch = document.getElementById('desk-search-input');
    if (deskSearch) deskSearch.value = "";

    // 2. Validazione e salvataggio Stato
    if (!nomeFoglio || nomeFoglio === "undefined" || nomeFoglio === "null") {
        nomeFoglio = "PROGRAMMA PRODUZIONE DEL MESE";
    }
    localStorage.setItem('ultimaPaginaProduzione', nomeFoglio);
    paginaAttuale = nomeFoglio;

    // 3. UI: Gestione Sidebar (Classe Active) + Tab Bar active
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(item => item.classList.remove('active'));
    if (!elementoMenu) {
        elementoMenu = document.querySelector(`.menu-item[data-page="${nomeFoglio}"]`);
    }
    if (elementoMenu) elementoMenu.classList.add('active');
    // Tab bar: marca attivo il tab corrispondente
    const bottomTab = document.querySelector(`.tab-item[data-page="${nomeFoglio}"]`);
    if (bottomTab) bottomTab.classList.add('active');

    // 4. UI: Aggiornamento Titolo Dinamico
    const titoli = {
        'IMPOSTAZIONI': "Impostazioni Sistema",
        'STORICO_RICHIESTE': "La mia Casella",
        'ARCHIVIO_ORDINI': "Archivio Ordini",
        'MATERIALE DA ORDINARE': "Gestione Acquisti",
        'PROGRAMMA PRODUZIONE DEL MESE': "Dashboard Produzione"
    };
    const titolo = document.getElementById('titolo-pagina');
    if (titolo) titolo.innerText = titoli[nomeFoglio] || nomeFoglio;
    const titoloDesk = document.getElementById('page-title-desktop');
    if (titoloDesk) titoloDesk.innerText = titoli[nomeFoglio] || nomeFoglio;

    // 5. UI: Gestione Elementi Condizionali (Carrello)
    const btnCarrello = document.getElementById('floating-cart-btn');
    if (btnCarrello) {
        const isAcquisti = (nomeFoglio === "MATERIALE DA ORDINARE");
        btnCarrello.style.display = isAcquisti ? "flex" : "none";
        if (!isAcquisti && typeof chiudiModalCarrello === "function") chiudiModalCarrello();
    }

    // 6. Rendering Contenuto (Cache o Server)
    const contenitore = document.getElementById('contenitore-dati');
    contenitore.innerHTML = ""; // Svuotamento preventivo per evitare accavallamenti

    // Chiudi tutti i modali aperti quando si cambia pagina
    ['modalAiuto', 'modal-conferma', 'modal-gestione-articolo', 'modal-carrello'].forEach(id => {
        const m = document.getElementById(id);
        if (!m) return;
        if (id === 'modal-carrello') { m.classList.remove('cart-open'); return; }
        if (id === 'modal-gestione-articolo') { m.classList.remove('active'); setTimeout(() => { if (!m.classList.contains('active')) m.style.display = 'none'; }, 300); return; }
        m.classList.remove('active');
        setTimeout(() => { if (!m.classList.contains('active')) m.style.display = 'none'; }, 300);
    });

    // Azzeramento badge appena si apre "La mia Casella" (con o senza cache)
    if (nomeFoglio === 'STORICO_RICHIESTE') {
        const badgeSidebar = document.getElementById('badge-richieste-count');
        if (badgeSidebar) {
            badgeSidebar.style.display = 'none';
            badgeSidebar.classList.remove('badge-sollecito-attivo');
        }
        const badgeMobile = document.getElementById('badge-mobile-notif');
        if (badgeMobile) badgeMobile.style.display = 'none';
        const badgeBottom = document.getElementById('badge-bottom-richieste');
        if (badgeBottom) { badgeBottom.style.display = 'none'; badgeBottom.classList.remove('badge-sollecito-attivo'); }
    }

    if (cacheContenuti[nomeFoglio]) {
        contenitore.innerHTML = cacheContenuti[nomeFoglio];
        applicaFade(contenitore);
        aggiornaListaFiltrabili();
        console.log("Rendering da cache:", nomeFoglio);

        // Aggiornamento dati in background solo se la cache è scaduta (> 30s)
        const ora = Date.now();
        const ultimoFetch = cacheFetchTime[nomeFoglio] || 0;
        if (ora - ultimoFetch > CACHE_TTL_MS) {
            if (nomeFoglio === "PROGRAMMA PRODUZIONE DEL MESE") caricaDati(nomeFoglio, true, requestId);
            if (nomeFoglio === "MATERIALE DA ORDINARE") caricaMateriali(true);
        }
        return;
    }

    // 7. Smistamento Caricamento (Router)
    console.log("Caricamento dal server:", nomeFoglio);

    switch (nomeFoglio) {
        case 'IMPOSTAZIONI':
            caricaInterfacciaImpostazioni();
            break;
        case 'STORICO_RICHIESTE':
            caricaPaginaRichieste();
            break;
        case 'ARCHIVIO_ORDINI':
            caricaArchivio();
            break;
        case 'MATERIALE DA ORDINARE':
            caricaMateriali(false);
            break;
        default:
            caricaDati(nomeFoglio, false, requestId);
    }
}







//PAGINA PRODUZIONE//

async function caricaDati(nomeFoglio, isBackgroundUpdate = false, expectedRequestId = null) {
    const contenitore = document.getElementById('contenitore-dati');
    if (!isBackgroundUpdate) {
        contenitore.innerHTML = "<div class='inline-msg'>Caricamento Dashboard...</div>";
        applicaFade(contenitore);
    }

    try {
        // Scarichiamo entrambi i fogli in parallelo
        const [datiProd, datiArch] = await Promise.all([
            fetchJson("PROGRAMMA PRODUZIONE DEL MESE"),
            fetchJson("ARCHIVIO_ORDINI")
        ]);

        if (paginaAttuale !== nomeFoglio) return;
        if (expectedRequestId !== null && expectedRequestId !== _latestNavRequest) return;

        // --- OVERVIEW STATI ---
        const attivi = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE');
        _attiviProd = attivi;
        const STATI_OV = ['CONTROLLARE MAGAZZINO','PREPARARE PER LAVORAZIONE','IN LAVORAZIONE','TORNATO DALLA LAVORAZIONE','IN PRODUZIONE','IMBALLATO'];
        const numInFocus = attivi.filter(r => STATI_OV.includes((r.stato||'').toUpperCase())).length;

        // --- SEZIONE ATTIVA ---
        let htmlAttivi = generaBloccoOrdiniUnificato(datiProd, false);

        // --- SEZIONE ARCHIVIATA ---
        let htmlArchiviati = generaBloccoOrdiniUnificato(datiArch, true);

        contenitore.innerHTML = `
            <details class="ov-accordion" id="ov-accordion" open>
                <summary class="ov-accordion-summary">
                    <span class="ov-summary-label"><i class="fas fa-layer-group"></i> Stato Avanzamento</span>
                    <span class="ov-summary-meta">${numInFocus} art. in lavorazione</span>
                    <i class="fas fa-chevron-down ov-summary-chevron"></i>
                </summary>
                <div class="riepilogo-page">
                    ${_buildOverviewInnerHtml(attivi)}
                </div>
            </details>
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="document.getElementById('sezione-archivio').scrollIntoView({behavior:'smooth'})">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>
            <div class="sezione-attiva">
                ${htmlAttivi || "<div class='empty-msg'>Nessun ordine in produzione.</div>"}
            </div>

            <div id="sezione-archivio" class="separatore-archivio">
                <span>📦 ARCHIVIO STORICO ORDINI</span>
            </div>

            <div class="sezione-archiviata">
                ${htmlArchiviati || "<div class='empty-msg'>L'archivio è vuoto.</div>"}
            </div>
        `;
        cacheContenuti[nomeFoglio] = contenitore.innerHTML;
        cacheFetchTime[nomeFoglio] = Date.now();
        applicaFade(contenitore);
        aggiornaListaFiltrabili();

        // Salva raw data per autocomplete del modal
        _ordiniAutocompleteCache = datiProd.filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE').map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '' }));
        // Deduplication by ordine
        const seen = new Set();
        _ordiniAutocompleteCache = _ordiniAutocompleteCache.filter(o => { if (seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });

    } catch (e) {
        console.error("Errore Dashboard:", e);
        contenitore.innerHTML = "<div class='inline-error'>Errore nel caricamento dati.</div>";
        applicaFade(contenitore);
    }
}
function generaBloccoOrdiniUnificato(dati, isArchivio) {
    if (!dati || dati.length === 0) return "";

    const gruppi = {};
    dati.forEach(r => {
        if (!isArchivio && String(r.archiviato).toUpperCase() === "TRUE") return;
        const nOrd = r.ordine || "N.D.";
        if (!gruppi[nOrd]) gruppi[nOrd] = [];
        gruppi[nOrd].push(r);
    });

    let html = "";
    Object.keys(gruppi).forEach(nOrd => {
        const righe = gruppi[nOrd];
        const cliente = righe[0].cliente;
        const riferimento = righe[0].riferimento || "";
        const htmlRiferimento = riferimento ? `<span class="riferimento-label">(${riferimento})</span>` : '';

        // Definizione Header e Bottoni in base allo stato
        const classWrapper = isArchivio ? 'archivio-wrapper' : '';
        const classHeader = isArchivio ? 'archivio-header' : '';
        const colorCliente = isArchivio ? '#475569' : 'inherit';

        let nOrdBadge;
        if (nOrd.includes('/')) {
            const slashIdx = nOrd.indexOf('/');
            const base = nOrd.substring(0, slashIdx);
            const sez  = nOrd.substring(slashIdx + 1);
            const sezTrunc = sez.length > 3 ? sez.substring(0, 3) + '.' : sez;
            nOrdBadge = `${base}/${sezTrunc}`;
        } else {
            nOrdBadge = nOrd.length > 14 ? nOrd.substring(0, 14) + '…' : nOrd;
        }

        const bottoniHeader = isArchivio
            ? `<button class="btn-ripristina ${TW.btnWarning}" onclick="event.stopPropagation(); gestisciRipristino('${nOrd}', 'ORDINE')">
                   <i class="fa-solid fa-rotate-left"></i> <span class="btn-txt">Ripristina</span>
               </button>`
            : `<button class="btn-chiedi-assegna ${TW.btnPrimary}" onclick="event.stopPropagation(); apriModalAiuto(null, 'INTERO ORDINE', '${nOrd}')">
                   <i class="fa-regular fa-envelope"></i> <span class="btn-txt">Chiedi</span>
               </button>
               <button class="btn-archivia-prod ${TW.btnSuccess}" onclick="event.stopPropagation(); gestisciArchiviazione('${nOrd}')">
                   <i class="fa-solid fa-box-archive"></i> <span class="btn-txt">Archivia</span>
               </button>`;

        html += `
        <div class="ordine-wrapper ${classWrapper}" data-ordine="${nOrd}" data-cliente="${(cliente || '').toLowerCase().replace(/"/g, '')}">
            <div class="riga-ordine ${classHeader}" onclick="toggleAccordion(this)">
                <div class="flex-grow">
                    <span class="order-title" style="--order-color:${colorCliente}" title="${cliente}">${cliente} ${htmlRiferimento}</span>
                </div>
                <div class="order-info">
                    <div class="badge-count ${TW.pill}" title="ORD.${nOrd}"><span class="badge-ord-num">ORD.${nOrdBadge}</span><span class="badge-sep">·</span>${righe.length} ART.</div>
                    ${bottoniHeader}
                </div>
            </div>
            <div class="dettagli-container${isArchivio ? ' hidden' : ''}">
                ${righe.map(art => isArchivio ? generaCardArchivio(art, nOrd) : generaCardArticolo(art, nOrd)).join('')}
            </div>
        </div>`;
    });
    return html;
}
function generaCardArticolo(art, nOrd) {
    const statoAttuale = (art.stato || "IN ATTESA").toUpperCase();
    const configStato = listaStati.find(s => s.nome === statoAttuale) || {colore: "#e2e8f0"};
    const codicePrincipale = art.codice && art.codice !== "false" ? art.codice : "Senza Codice";

    // Gestione visualizzazione operatori (trasforma la stringa J in badge)
    const displayOperatori = (art.assegna && art.assegna !== "" && art.assegna !== "undefined")
        ? art.assegna.split(',').map(op => `<span class="badge-operatore">${op.trim()}</span>`).join('')
        : `<span class="operatore-libero">Libero</span>`;

    return `
    <div class="item-card ${TW.card}">
        <div><span class="label-sm ${TW.label}">Codice Prodotto</span><b class="${TW.value}">${codicePrincipale}</b></div>
        <div><span class="label-sm ${TW.label}">Quantità</span><b class="${TW.value}">${art.qty}</b></div>
        <div>
            <span class="label-sm ${TW.label}">Stato</span>
            <div class="stato-dropdown" data-id-riga="${art.id_riga}">
                <button type="button" class="stato-trigger" onclick="toggleStatoDropdown(this)">
                    <span class="stato-dot" style="background:${configStato.colore}"></span>
                    <span class="stato-label-txt">${statoAttuale}</span>
                    <i class="fas fa-chevron-down stato-chevron"></i>
                </button>
                <div class="stato-popup">
                    ${listaStati.map(s => `<button type="button" class="stato-option${s.nome === statoAttuale ? ' is-selected' : ''}" onclick="selezionaStato(this, '${art.id_riga}', '${s.colore}')"><span class="stato-opt-dot" style="background:${s.colore}"></span><span>${s.nome}</span>${s.nome === statoAttuale ? '<i class="fas fa-check stato-check-icon"></i>' : ''}</button>`).join('')}
                </div>
            </div>
        </div>
        <div>
            <span class="label-sm ${TW.label}">Operatore/i Assegnati</span>
            <div class="visualizza-operatori">${displayOperatori}</div>
        </div>
        <div class="order-info-col">
            <button class="btn-chiedi-assegna ${TW.btnPrimary}" onclick="apriModalAiuto('${art.id_riga}', '${codicePrincipale}', '${nOrd}')">
                <i class="fa-regular fa-envelope"></i> Chiedi/Assegna
            </button>
        </div>
    </div>`;
}
/* ---- STATO DROPDOWN CUSTOM ---- */
function toggleStatoDropdown(btn) {
    const dropdown = btn.closest('.stato-dropdown');
    const itemCard = btn.closest('.item-card');
    const isOpen = dropdown.classList.contains('open');
    // chiudi tutti gli altri e togli la classe di elevazione
    document.querySelectorAll('.stato-dropdown.open').forEach(d => {
        d.classList.remove('open');
        const c = d.closest('.item-card');
        if (c) c.classList.remove('stato-aperto');
    });
    if (!isOpen) {
        dropdown.classList.add('open');
        if (itemCard) itemCard.classList.add('stato-aperto');
    }
}
function selezionaStato(optBtn, idRiga, colore) {
    const nuovoStato = optBtn.querySelector('span:not(.stato-opt-dot)').textContent.trim();
    const dropdown = optBtn.closest('.stato-dropdown');
    const trigger = dropdown.querySelector('.stato-trigger');
    const labelEl = trigger.querySelector('.stato-label-txt');
    const dot = trigger.querySelector('.stato-dot');
    // aggiorna dot e testo del trigger direttamente via style inline
    if (dot) dot.style.background = colore || '#94a3b8';
    labelEl.textContent = nuovoStato;
    // aggiorna selezione nelle opzioni
    dropdown.querySelectorAll('.stato-option').forEach(o => {
        o.classList.remove('is-selected');
        const existing = o.querySelector('.stato-check-icon');
        if (existing) existing.remove();
    });
    optBtn.classList.add('is-selected');
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check stato-check-icon';
    optBtn.appendChild(checkIcon);
    // chiudi
    dropdown.classList.remove('open');
    const card = dropdown.closest('.item-card');
    if (card) card.classList.remove('stato-aperto');
    // salva
    aggiornaDato(null, idRiga, 'stato', nuovoStato);
}
// chiudi dropdown cliccando fuori
document.addEventListener('click', function(e) {
    if (!e.target.closest('.stato-dropdown')) {
        document.querySelectorAll('.stato-dropdown.open').forEach(d => {
            d.classList.remove('open');
            const c = d.closest('.item-card');
            if (c) c.classList.remove('stato-aperto');
        });
    }
}, true);
/* ---- FINE STATO DROPDOWN CUSTOM ---- */

function toggleAccordion(elemento) {
    elemento.classList.toggle('open');
    const container = elemento.nextElementSibling;
    container.style.display = elemento.classList.contains('open') ? 'block' : 'none';
}
async function aggiornaDato(selectEl, idRiga, campo, nuovoValore) {
    // Feedback visivo immediato sull'elemento
    const original = selectEl ? selectEl.style.opacity : null;
    if (selectEl) selectEl.style.opacity = '0.5';
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'aggiorna_produzione', id_riga: idRiga, colonna: campo, valore: nuovoValore })
        });
        if (selectEl) selectEl.style.opacity = '1';
    } catch (e) {
        console.error('aggiornaDato error:', e);
        if (selectEl) selectEl.style.opacity = '1';
        notificaElegante('Errore nel salvataggio dello stato. Riprova.');
    }
}
function apriModalAiuto(idRiga, riferimento, nOrdine) {
    const modal = document.getElementById('modalAiuto');

    modal.style.display = 'flex';
    modal.offsetHeight; // Forza il reflow per l'animazione
    modal.classList.add('active');

    // Titolo più coerente: Messaggio invece di Supporto
    document.getElementById('modal-titolo').innerText = idRiga ?
        `Messaggio Art. ${riferimento}` :
        `Messaggio Ordine ${nOrdine}`;

    // Generazione lista operatori
    document.getElementById('wrapper-operatori').innerHTML = listaOperatori.map(op => `
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${op.email}" data-nome="${op.nome}">
            <span><b>${op.nome}</b> <small class="text-muted">(${op.reparto || 'Team'})</small></span>
        </label>
    `).join('');

    modal.dataset.idRiga = idRiga || "";
    modal.dataset.nOrdine = nOrdine;

    // Nascondi sempre il campo ordine libero (visibile solo da apriNuovaRichiesta)
    const ordineRow = document.getElementById('modal-ordine-row');
    if (ordineRow) ordineRow.style.display = 'none';

    // Reset del campo testo e partiamo sempre da ASSEGNAZIONE
    document.getElementById('messaggio-aiuto').value = "";
    setTipoAzione('Assegnazione');
}

// Apri modal per creare una nuova richiesta libera (da bottom nav "+")
let _apriNuovaRichiestaLock = false;
function apriNuovaRichiesta() {
    if (_apriNuovaRichiestaLock) return;
    _apriNuovaRichiestaLock = true;
    setTimeout(() => { _apriNuovaRichiestaLock = false; }, 600);
    const modal = document.getElementById('modalAiuto');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    document.getElementById('modal-titolo').innerText = 'Nuova Richiesta';
    document.getElementById('wrapper-operatori').innerHTML = listaOperatori.map(op => `
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${op.email}" data-nome="${op.nome}">
            <span><b>${op.nome}</b> <small class="text-muted">(${op.reparto || 'Team'})</small></span>
        </label>
    `).join('');
    modal.dataset.idRiga = '';
    modal.dataset.nOrdine = '';
    document.getElementById('messaggio-aiuto').value = '';
    setTipoAzione('Assegnazione');
    // Mostra il campo numero ordine con autocomplete
    const ordineRow = document.getElementById('modal-ordine-row');
    if (ordineRow) {
        ordineRow.style.display = 'block';
        const input = document.getElementById('modal-ordine-input');
        if (input) {
            input.value = '';
            _setupOrdineAutocomplete(input);
        }
    }
    // Se cache vuota prova a caricare
    if (_ordiniAutocompleteCache.length === 0) {
        fetchJson('PROGRAMMA PRODUZIONE DEL MESE').then(dati => {
            const seen = new Set();
            _ordiniAutocompleteCache = dati
                .filter(r => String(r.archiviato || '').toUpperCase() !== 'TRUE')
                .map(r => ({ ordine: r.ordine || '', cliente: r.cliente || '' }))
                .filter(o => { if (!o.ordine || seen.has(o.ordine)) return false; seen.add(o.ordine); return true; });
        }).catch(() => {});
    }
}

function _setupOrdineAutocomplete(input) {
    // Evita duplicare listener
    input.oninput = function() {
        const q = this.value.trim().toLowerCase();
        const list = document.getElementById('ordine-autocomplete');
        if (!list) return;
        if (!q) { list.style.display = 'none'; list.innerHTML = ''; return; }
        const matches = _ordiniAutocompleteCache.filter(o =>
            o.ordine.toLowerCase().includes(q) || o.cliente.toLowerCase().includes(q)
        ).slice(0, 8);
        if (matches.length === 0) { list.style.display = 'none'; list.innerHTML = ''; return; }
        list.innerHTML = matches.map(o => `
            <div class="autocomplete-item" onmousedown="_selezionaOrdine('${o.ordine.replace(/'/g, "\\'")}',' ${o.cliente.replace(/'/g, "\\'")}')">  
                <span class="ac-ordine">ORD. ${o.ordine}</span>
                <span class="ac-cliente">${o.cliente}</span>
            </div>
        `).join('');
        list.style.display = 'block';
    };
    input.onblur = function() {
        setTimeout(() => {
            const list = document.getElementById('ordine-autocomplete');
            if (list) list.style.display = 'none';
        }, 200);
    };
}

function _selezionaOrdine(ordine, cliente) {
    const input = document.getElementById('modal-ordine-input');
    if (input) input.value = ordine;
    const list = document.getElementById('ordine-autocomplete');
    if (list) { list.style.display = 'none'; list.innerHTML = ''; }
    // Aggiorna il dataset del modal affinché confermaInvioSupporto usi il valore corretto
    const modal = document.getElementById('modalAiuto');
    if (modal) modal.dataset.nOrdine = ordine;
}
function setTipoAzione(tipo) {
    const tipoUp = tipo.toUpperCase();
    document.getElementById('modalAiuto').dataset.tipoAzione = tipoUp;
    document.getElementById('btn-tipo-assegna').classList.toggle('active', tipoUp === 'ASSEGNAZIONE');
    document.getElementById('btn-tipo-domanda').classList.toggle('active', tipoUp === 'DOMANDA');
}
function chiudiModal() {
    const modal = document.getElementById('modalAiuto');

    // 1. Togli la classe active per avviare il fade-out
    modal.classList.remove('active');

    // 2. Aspetta la fine dell'animazione (300ms) prima di mettere display: none
    setTimeout(() => {
        // Controlliamo che nel frattempo l'utente non l'abbia riaperto
        if (!modal.classList.contains('active')) {
            modal.style.display = 'none';
        }
    }, 300);
}
async function confermaInvioSupporto() {
    const modalElement = document.getElementById('modalAiuto');
    if (!modalElement) return;

    const idRiga = modalElement.dataset.idRiga;
    // Se il campo ordine libero è visibile (nuova richiesta dal "++"), usa quello
    const ordineRow = document.getElementById('modal-ordine-row');
    const ordineInput = document.getElementById('modal-ordine-input');
    const nOrd = (ordineRow && ordineRow.style.display !== 'none' && ordineInput && ordineInput.value.trim())
        ? ordineInput.value.trim()
        : modalElement.dataset.nOrdine;
    const messaggioVal = document.getElementById('messaggio-aiuto').value;
    const tipoAzione = modalElement.dataset.tipoAzione;

    const checkboxSelezionate = document.querySelectorAll('input[name="destinatario"]:checked');

    if (checkboxSelezionate.length === 0) {
        alert("Per favore, seleziona almeno un operatore.");
        return;
    }

    const listaNomiStr = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome')).join(', ');
    const listaNomiDestinatari = Array.from(checkboxSelezionate).map(cb => cb.getAttribute('data-nome'));

    try {
        // --- AZIONE A: Aggiorna i Badge nella Produzione ---
        const urlAssegnazione = `${URL_GOOGLE}?azione=assegnaOperatori&ordine=${encodeURIComponent(nOrd)}&operatori=${encodeURIComponent(listaNomiStr)}&id_riga=${idRiga}`;
        await fetch(urlAssegnazione);

        // --- AZIONE B: Salva nello Storico Messaggi ---
        const payload = {
            azione: 'supporto_multiplo',
            n_ordine: nOrd,
            tipo: tipoAzione,
            // Testo di default aggiornato
            messaggio: messaggioVal || (tipoAzione === 'ASSEGNAZIONE' ? "Nuova assegnazione" : "Nuova domanda"),
            mittente: utenteAttuale.nome.toUpperCase().trim(),
            destinatari: listaNomiDestinatari
        };

        const response = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            document.getElementById('messaggio-aiuto').value = "";
            chiudiModal();

            // Invalida la cache richieste così la prossima apertura recupera dati freschi
            delete cacheContenuti['STORICO_RICHIESTE'];
            delete cacheFetchTime['STORICO_RICHIESTE'];

            if (paginaAttuale === 'STORICO_RICHIESTE') {
                await caricaPaginaRichieste();
            } else {
                // Aggiorna il badge in background anche se non siamo sulla pagina richieste
                fetchJson("STORICO_RICHIESTE").then(msgs => { aggiornaBadgeSidebar(msgs); aggiornaBadgeNotifiche(msgs); }).catch(() => {});
                await caricaDati(paginaAttuale);
            }
        }

    } catch (e) {
        console.error("Errore durante l'operazione:", e);
        alert("Errore nell'invio delle informazioni.");
    }
}
function toggleAreaRisposta(id) {
    const box = document.getElementById('box-risposta-' + id);
    const boxConf = document.getElementById('box-conferma-' + id);
    if (!box) return;
    if (boxConf) { boxConf.style.display = 'none'; boxConf.style.opacity = '0'; }

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        setTimeout(() => { box.style.opacity = '1'; box.style.transform = 'translateY(0)'; }, 10);
        document.getElementById('input-risposta-' + id).focus();
    } else {
        box.style.opacity = '0';
        box.style.transform = 'translateY(-10px)';
        setTimeout(() => { box.style.display = 'none'; }, 300);
    }
}
function toggleBoxArchivia(id) {
    const box = document.getElementById('box-conferma-' + id);
    const boxResp = document.getElementById('box-risposta-' + id);
    if (!box) return;
    if (boxResp) { boxResp.style.display = 'none'; boxResp.style.opacity = '0'; }

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        setTimeout(() => { box.style.opacity = '1'; box.style.transform = 'translateY(0)'; }, 10);
    } else {
        box.style.opacity = '0';
        box.style.transform = 'translateY(-10px)';
        setTimeout(() => { box.style.display = 'none'; }, 300);
    }
}
async function inviaRisposta(idRiga, nOrdine, destinatario) {
    const input = document.getElementById('input-risposta-' + idRiga);
    const testo = input.value.trim();
    if (!testo) return;

    try {
        const payload = {
            azione: 'supporto_multiplo',
            n_ordine: nOrdine,
            tipo: 'RISPOSTA',
            messaggio: testo,
            mittente: utenteAttuale.nome.toUpperCase().trim(),
            destinatari: [destinatario.toUpperCase().trim()]
        };

        const response = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) });
        if (response.ok) {
            input.value = "";
            await caricaPaginaRichieste(); // Ricarica la chat aggiornata
        }
    } catch (e) {
        alert("Errore durante l'invio.");
    }
}


//SEZIONE ARICHIVIO ORDINI//

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
    <div class="item-card archivio-layout ${TW.card}">
        <div>
            <span class="label-sm ${TW.label}">Codice Prodotto</span>
            <b class="archivio-codice ${TW.value}">${codicePrincipale}</b>
        </div>

        <div class="archivio-qty">
            <span class="label-sm ${TW.label}">Quantità</span>
            <b class="archivio-qty-val ${TW.value}">${art.qty}</b>
        </div>

        <div>
            <span class="label-sm ${TW.label}">Ultimo Stato</span>
            <span class="archivio-stato ${TW.value}">${statoArchiviato}</span>
        </div>

        <div>
            <span class="label-sm ${TW.label}">Operatore</span>
            <span class="archivio-operatore ${TW.value}">${operatoreValore}</span>
        </div>

        <div class="item-actions">
            <button class="btn-archive-action primary ${TW.btnPrimary}" title="Reso Cliente" onclick="gestisciRipristino('${art.id_riga}', 'RIGA', 'RESO')">
                <i class="fa-solid fa-box"></i>
            </button>
            <button class="btn-archive-action warning ${TW.btnWarning}" title="Errore Archiviazione" onclick="gestisciRipristino('${art.id_riga}', 'RIGA', 'ERRORE')">
                <i class="fa-solid fa-rotate"></i>
            </button>
        </div>
    </div>`;
}
async function gestisciArchiviazione(nOrd, tipo) {
    mostraConferma(
        'Archivia Ordine',
        `Vuoi spostare l'ordine ${nOrd} nell'archivio?`,
        async () => {
            try {
                const url = URL_GOOGLE + "?azione=archiviaOrdine&ordine=" + encodeURIComponent(nOrd);
                const response = await fetch(url);
                const risultato = await response.json();
                if (risultato.status === "success") {
                    notificaElegante('Ordine ' + nOrd + ' archiviato.');
                    caricaDati(paginaAttuale);
                } else {
                    notificaElegante('Errore: ' + risultato.message, 'error');
                }
            } catch (errore) {
                notificaElegante('Errore di connessione al server.', 'error');
            }
        },
        'Archivia'
    );
}
async function gestisciRipristino(id_o_numero, tipo) {
    const msgConferma = tipo === 'ORDINE'
        ? `Riportare l'intero ordine ${id_o_numero} in PRODUZIONE?`
        : `Riportare questo articolo in PRODUZIONE?`;

    mostraConferma('Ripristina', msgConferma, async () => {
        try {
            const url = URL_GOOGLE + "?azione=ripristinaOrdine&ordine=" + encodeURIComponent(id_o_numero) + "&tipo=" + tipo;
            const response = await fetch(url);
            const risultato = await response.json();
            if (risultato.status === "success") {
                caricaDati(paginaAttuale);
            } else {
                notificaElegante('Errore: ' + risultato.message, 'error');
            }
        } catch (e) {
            notificaElegante('Errore durante il ripristino.', 'error');
        }
    }, 'Ripristina');
}





//OVERVIEW HELPERS (usati da caricaDati)//

// 4 stati: focus su articolo (raggruppati per codice)
// 2 stati: focus su ordine completo
const _OV_STATI_ART  = ['CONTROLLARE MAGAZZINO','PREPARARE PER LAVORAZIONE','IN LAVORAZIONE','TORNATO DALLA LAVORAZIONE'];
const _OV_STATI_ORD  = ['IN PRODUZIONE','IMBALLATO'];
const _OV_STATI_ALL  = [..._OV_STATI_ART, ..._OV_STATI_ORD];

function _buildOverviewInnerHtml(attivi) {
    const coloriStati = {};
    (listaStati || []).forEach(s => { coloriStati[s.nome.toUpperCase()] = s.colore; });
    const coloreDefault = '#94a3b8';

    const cardsHtml = _OV_STATI_ALL.map(stato => {
        const righe = attivi.filter(r => (r.stato || '').toUpperCase() === stato);
        const colore = coloriStati[stato] || coloreDefault;
        const isArtMode = _OV_STATI_ART.includes(stato);
        const isEmpty = righe.length === 0;

        let contenuto = '';
        if (isArtMode) {
            // Raggruppa per codice articolo
            const byArt = {};
            righe.forEach(r => {
                const key = (r.codice || r.riferimento || '—').trim();
                if (!byArt[key]) byArt[key] = { key, count: 0, ordini: new Set() };
                byArt[key].count++;
                if (r.ordine) byArt[key].ordini.add(r.ordine);
            });
            contenuto = Object.values(byArt)
                .sort((a,b) => b.count - a.count)
                .map(a => {
                    const lbl = a.key.length > 24 ? a.key.substring(0,24)+'…' : a.key;
                    return `<div class="ov-stato-row">
                        <span class="ov-row-label" title="${a.key}">${lbl}</span>
                        <span class="ov-row-badges">
                            <span class="ov-badge-count">${a.count}</span>
                            <span class="ov-badge-ord">${a.ordini.size} ord.</span>
                        </span>
                    </div>`;
                }).join('');
        } else {
            // Raggruppa per ordine
            const byOrd = {};
            righe.forEach(r => {
                const key = r.ordine || '—';
                if (!byOrd[key]) byOrd[key] = { ordine: key, cliente: r.cliente || '', count: 0 };
                byOrd[key].count++;
            });
            contenuto = Object.values(byOrd)
                .sort((a,b) => b.count - a.count)
                .map(o => {
                    const cli = o.cliente.length > 16 ? o.cliente.substring(0,16)+'…' : o.cliente;
                    const lbl = o.ordine + (cli ? ' · '+cli : '');
                    return `<div class="ov-stato-row">
                        <span class="ov-row-label" title="${o.ordine} – ${o.cliente}">${lbl}</span>
                        <span class="ov-badge-count">${o.count} art.</span>
                    </div>`;
                }).join('');
        }

        return `<div class="ov-stato-card${isEmpty ? ' ov-stato-card-empty' : ''}">
            <div class="ov-stato-header" style="--ov-col:${colore}">
                <span class="ov-stato-dot" style="background:${colore}"></span>
                <span class="ov-stato-nome">${stato}</span>
                <span class="ov-stato-tot" style="background:${colore}22;color:${colore}">${righe.length}</span>
            </div>
            <div class="ov-stato-body">${isEmpty ? '<span class="ov-empty-lbl">—</span>' : contenuto}</div>
        </div>`;
    }).join('');

    return `<div class="ov-stati-grid">${cardsHtml}</div>`;
}

function _buildOverviewChart() { /* non più usato */ }

//PAGINA RICHIESTE//

async function caricaPaginaRichieste() {
    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    contenitore.innerHTML = "<div class='centered-msg'>Caricamento messaggi in corso...</div>";

    try {
        const [messaggiAttivi, messaggiArchivio] = await Promise.all([
            fetchJson("STORICO_RICHIESTE"),
            fetchJson("ARCHIVIO_RICHIESTE")
        ]);

        // Aggiorna sempre badge sidebar e campanellina (indipendentemente dalla pagina corrente)
        aggiornaBadgeSidebar(messaggiAttivi);
        aggiornaBadgeNotifiche(messaggiAttivi);

        // Guard anti-stale: se l'utente ha cambiato pagina mentre il fetch era in corso, ignorare
        if (paginaAttuale !== 'STORICO_RICHIESTE') return;

        const io = utenteAttuale.nome.toUpperCase().trim();

        const raggruppa = (dati) => {
            const gruppi = {};
            dati.forEach(m => {
                if (!gruppi[m.ORDINE]) gruppi[m.ORDINE] = [];
                gruppi[m.ORDINE].push(m);
            });
            return gruppi;
        };

        const gruppiAttivi = raggruppa(messaggiAttivi);
        const gruppiArchivio = raggruppa(messaggiArchivio);

        let html = `
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="document.getElementById('sezione-archivio').scrollIntoView({behavior:'smooth'})">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>
            <div class="chat-inbox">`;

        // 1. RICHIESTE ATTIVE
        Object.keys(gruppiAttivi).reverse().forEach(nOrd => {
            html += generaCardRichiesta(gruppiAttivi[nOrd], io, false);
        });

        // 2. DIVISORE ARCHIVIO
        html += `
            <div id="sezione-archivio" class="separatore-archivio">
                <span>ARCHIVIO</span>
            </div>`;

        // 3. RICHIESTE ARCHIVIATE
        if (Object.keys(gruppiArchivio).length === 0) {
            html += `<div class="empty-msg" style="margin:20px 0">Nessuna richiesta archiviata.</div>`;
        } else {
            Object.keys(gruppiArchivio).reverse().forEach(nOrd => {
                html += generaCardRichiesta(gruppiArchivio[nOrd], io, true);
            });
        }

        html += `</div>`;
        contenitore.innerHTML = html;
        cacheContenuti['STORICO_RICHIESTE'] = html; // salva dopo archivio
        applicaFade(contenitore);
        aggiornaListaFiltrabili();

        // Reset barra di ricerca al caricamento
        ['universal-search', 'mobile-search'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

    } catch (e) {
        console.error("Errore:", e);
        contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento. Riprova.</div>";
        applicaFade(contenitore);
    }
}
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
        delete cacheContenuti['STORICO_RICHIESTE'];
        delete cacheFetchTime['STORICO_RICHIESTE'];
        caricaPaginaRichieste(); // Rinfresca la vista
    } catch (e) { notificaElegante('Errore aggiornamento.', 'error'); }
}
function _sollecitaConferma(idRiga) {
    mostraConferma('Sollecita Richiesta', 'Inviare un sollecito per questa richiesta?', () => sollecitaRichiesta(idRiga), 'Sollecita');
}
function _archiviaConferma(idRiga) {
    mostraConferma('Archivia Richiesta', 'Archiviare definitivamente questa discussione?', () => aggiornaRichiesta(idRiga, 'risolto'), 'Archivia');
}
async function sollecitaRichiesta(idRiga) {
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: 'aggiorna_richiesta_stato',
                id_riga: idRiga,
                tipo: 'sollecita'
            })
        });
        const json = await res.json();
        if (json.status === 'success') {
            delete cacheContenuti['STORICO_RICHIESTE'];
            delete cacheFetchTime['STORICO_RICHIESTE'];
            notificaElegante('Sollecito inviato!');
            caricaPaginaRichieste();
        }
    } catch (e) {
        alert('Errore durante il sollecito.');
    }
}
function formattaData(stringaData) {
    if (!stringaData) return "N.D.";

    let d;
    // Se è un timestamp numerico
    if (!isNaN(stringaData) && typeof stringaData !== 'string') {
        d = new Date(Number(stringaData));
    } else {
        d = new Date(stringaData);
        // Se fallisce, proviamo formato italiano GG/MM/AAAA HH:MM
        if (isNaN(d.getTime())) {
            const match = String(stringaData).match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
            if (match) {
                const [, g, m, a] = match;
                const oraMatch = String(stringaData).match(/(\d{2}):(\d{2})/);
                const h = oraMatch ? oraMatch[1] : "00";
                const min = oraMatch ? oraMatch[2] : "00";
                d = new Date(`${a}-${m}-${g}T${h}:${min}:00`);
            }
        }
    }

    if (!d || isNaN(d.getTime())) return stringaData;

    const giorno = String(d.getDate()).padStart(2, '0');
    const mese = String(d.getMonth() + 1).padStart(2, '0');
    const anno = d.getFullYear();
    const ore = String(d.getHours()).padStart(2, '0');
    const minuti = String(d.getMinutes()).padStart(2, '0');

    // Restituisce il formato pulito
    return `${giorno}/${mese}/${anno} ${ore}:${minuti}`;
}
function generaCardRichiesta(msgs, io, isArchiviata) {
    const ultimo = msgs[msgs.length - 1];
    const nOrd = ultimo.ORDINE;
    const nomeCliente = ultimo.CLIENTE || "";

    // Controlla se almeno un messaggio del gruppo è sollecitato
    const isSollecitata = msgs.some(m => String(m.SOLLECITO).toLowerCase() === 'true');

    // Icona tipo: freccia verde = assegnazione, ? azzurro = domanda
    const tipoRaw = (ultimo.TIPO || 'MSG').toUpperCase();
    const isDomanda = tipoRaw === 'AIUTO' || tipoRaw === 'DOMANDA';
    const tipoIconaHtml = isDomanda
        ? `<span class="chat-tipo-dot chat-tipo-domanda" title="Domanda"><i class="fas fa-question"></i></span>`
        : `<span class="chat-tipo-dot chat-tipo-assegna" title="Assegnazione"><i class="fas fa-arrow-right"></i></span>`;

    return `
        <div class="chat-card${isArchiviata ? ' archiviata' : ''}${isSollecitata ? ' sollecitata' : ''} ${TW.card}" data-ordine="${String(nOrd || '')}" data-cliente="${(nomeCliente || '').toLowerCase().replace(/"/g, '')}">

            <div class="chat-header${isArchiviata ? ' archiviata' : ''}">
                <div>
                    ${tipoIconaHtml}
                    ${isSollecitata ? `<span class="badge-sollecito"><i class="fa-solid fa-bullhorn"></i> SOLLECITATA</span>` : ''}
                    <span class="chat-order-label">ORD. ${nOrd}</span>${nomeCliente ? `<span class="chat-cliente-label"> • ${nomeCliente}</span>` : ''}
                </div>
                <span class="chat-date">${formattaData(ultimo["DATA ORA"])}</span>
            </div>

            <div class="chat-body">
                ${msgs.map(m => {
                    const amIMittente = (String(m.DA).toUpperCase().trim() === io);
                    const testo = String(m.MESSAGGIO || "").includes("|") ? m.MESSAGGIO.split("|")[1] : m.MESSAGGIO;
                    return `
                        <div class="chat-bubble-wrapper ${amIMittente ? 'sent' : 'received'}">
                            <div class="chat-bubble">
                                <div class="chat-bubble-name">${m.DA}</div>
                                <div class="chat-bubble-text">${testo}</div>
                            </div>
                        </div>`;
                }).join('')}
            </div>

            ${!isArchiviata ? `
                <div id="box-conferma-${ultimo.id_riga}" class="box-conferma box-hidden">
                    <div class="box-message">Archiviare definitivamente questa discussione?</div>
                    <div class="box-actions">
                        <button onclick="toggleBoxArchivia('${ultimo.id_riga}')" class="btn-cancel button-small">Annulla</button>
                        <button onclick="aggiornaRichiesta('${ultimo.id_riga}', 'risolto')" class="btn-archive-action button-small">Sì, Archivia</button>
                    </div>
                </div>

                <div id="box-risposta-${ultimo.id_riga}" class="box-risposta box-hidden">
                    <div class="reply-wrapper">
                        <textarea id="input-risposta-${ultimo.id_riga}" class="reply-input" placeholder="Scrivi una risposta..."></textarea>
                        <div class="reply-footer">
                            <span class="reply-hint"><i class="fa-regular fa-paper-plane"></i> Risposta a <b>${ultimo.DA === io ? ultimo.A : ultimo.DA}</b></span>
                            <button onclick="inviaRisposta('${ultimo.id_riga}', '${nOrd}', '${ultimo.DA === io ? ultimo.A : ultimo.DA}')" class="btn-reply-send">
                                <i class="fa-solid fa-paper-plane"></i> Invia
                            </button>
                        </div>
                    </div>
                </div>

                <div class="chat-actions">
                    <div class="chat-to-info">
                        <span class="chat-to-dest">A: <b>${ultimo.A}</b></span>
                    </div>
                    <div class="chat-action-btns">
                        <button onclick="toggleAreaRisposta('${ultimo.id_riga}')" class="btn-reply button-small ${TW.btn}" title="Rispondi"><i class="fa-regular fa-comment"></i> <span class="btn-txt">Rispondi</span></button>
                        <button onclick="_sollecitaConferma('${ultimo.id_riga}')" class="btn-alert button-small ${TW.btnWarning}" title="Sollecita"><i class="fa-solid fa-bullhorn"></i> <span class="btn-txt">Sollecita</span></button>
                        <button onclick="_archiviaConferma('${ultimo.id_riga}')" class="btn-archive button-small ${TW.btnSuccess}" title="Archivia"><i class="fa-solid fa-box-archive"></i> <span class="btn-txt">Archivia</span></button>
                    </div>
                </div>
            ` : `
                <div class="chat-archiviata-note">
                    <span class="chat-archiviata-label">✓ ARCHIVIATA</span>
                </div>
            `}
        </div>`;
}







//PAGINA IMPOSTAZIONI//

async function caricaImpostazioni() {
        try {
            const res = await fetch(URL_GOOGLE + "?azione=getImpostazioni");
            const settings = await res.json();
            listaStati = settings.stati || [];
            listaOperatori = settings.operatori || [];
        } catch (e) { console.error("Errore caricamento impostazioni"); }
    }
function toggleSettingsSection(sectionId, rowEl) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const arrow = rowEl.querySelector('.settings-row-arrow');
    const isOpen = section.style.display === 'block';
    section.style.display = isOpen ? 'none' : 'block';
    if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
    rowEl.classList.toggle('settings-row-active', !isOpen);
    // Carica lista utenti quando aperta
    if (!isOpen && (sectionId === 'section-utenti' || sectionId === 'section-team-utenti')) caricaListaUtenti();
}

/* ─── GESTIONE UTENTI ────────────────────────────────────── */
async function caricaListaUtenti() {
    const container = document.getElementById('lista-utenti-config');
    if (!container) return;
    container.innerHTML = '<div class="centered-msg small">Caricamento...</div>';
    try {
        const res  = await fetch(`${URL_GOOGLE}?azione=getUtenti`);
        const list = await res.json();
        if (!list.length) {
            container.innerHTML = '<p class="centered-msg small">Nessun utente creato. Clicca "+ Aggiungi Utente".</p>';
            return;
        }
        container.innerHTML = list.map(u => {
            const id = u.id_riga;
            const username = (u.username || '').trim();
            const email = (u.email || '').trim();
            const ruolo = (u.ruolo || 'OPERATORE').trim().toUpperCase();
            const maxU = Number(u.max_utenti) || 1;
            return `
            <div class="config-row-modern utente-row" data-id="${id}">
                <div class="settings-actions-row" style="gap:12px">
                    <div class="settings-options-row" style="gap:10px">
                        <div class="avatar-circle">${(username.charAt(0) || '?').toUpperCase()}</div>
                        <input type="text" class="input-flat" id="ut-username-${id}" value="${username.replace(/"/g, '&quot;')}" onchange="" placeholder="Username">
                    </div>
                    <div class="settings-options-row" style="gap:8px">
                        <button type="button" class="btn-modal-send" onclick="salvaModificheUtente(${id})" title="Salva modifiche">
                            <i class="fas fa-save"></i>
                        </button>
                        <button type="button" class="btn-trash-modern" onclick="eliminaUtente(${id}, ${JSON.stringify(username)})" title="Elimina utente">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="grid-2col gap-8" style="margin-top:10px">
                    <input type="email" class="input-field-modern" id="ut-email-${id}" placeholder="Email" value="${email.replace(/"/g, '&quot;')}">
                    <select class="input-field-modern" id="ut-ruolo-${id}">
                        <option value="OPERATORE" ${ruolo === 'OPERATORE' ? 'selected' : ''}>Operatore</option>
                        <option value="MASTER" ${ruolo === 'MASTER' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div class="grid-2col gap-8" style="margin-top:10px">
                    <input type="number" class="input-field-modern" id="ut-max-${id}" min="1" max="10" value="${maxU}">
                    <input type="password" class="input-field-modern" id="ut-pass-${id}" placeholder="Nuova password (opzionale)">
                </div>
                <div class="utente-max" style="margin-top:8px; opacity:0.85">Lascia la password vuota per non cambiarla.</div>
            </div>`;
        }).join('');
    } catch (e) {
        container.innerHTML = '<p class="centered-msg small text-danger">Errore nel caricamento utenti.</p>';
    }
}

async function salvaModificheUtente(idRiga) {
    const id = Number(idRiga);
    if (!id) return;

    const emailEl = document.getElementById(`ut-email-${id}`);
    const userEl  = document.getElementById(`ut-username-${id}`);
    const ruoloEl = document.getElementById(`ut-ruolo-${id}`);
    const maxEl   = document.getElementById(`ut-max-${id}`);
    const passEl  = document.getElementById(`ut-pass-${id}`);

    const email = (emailEl?.value || '').trim();
    const username = (userEl?.value || '').trim();
    const ruolo = (ruoloEl?.value || 'OPERATORE').trim().toUpperCase();
    const maxU = parseInt(maxEl?.value || '1', 10);
    const password = (passEl?.value || '').trim();

    if (!email || !username) {
        notificaElegante('Email e username sono obbligatori.', 'error');
        return;
    }
    if (password && password.length < 4) {
        notificaElegante('La password deve essere di almeno 4 caratteri.', 'error');
        return;
    }

    let hash = '';
    if (password) hash = await hashSHA256(password);

    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'aggiornaUtente', id_riga: id, email, username, ruolo, max_utenti: maxU, hash })
        });
        const r = await res.json();
        if (r.status === 'success') {
            notificaElegante('Utente aggiornato.');
            if (passEl) passEl.value = '';
            caricaListaUtenti();
        } else {
            notificaElegante(r.message || 'Errore aggiornamento utente.', 'error');
        }
    } catch (e) {
        notificaElegante('Errore di connessione.', 'error');
    }
}
function apriFormNuovoUtente() {
    const form = document.getElementById('form-nuovo-utente');
    if (form) {
        form.style.display = 'block';
        document.getElementById('nu-email').value    = '';
        document.getElementById('nu-username').value = '';
        document.getElementById('nu-password').value = '';
        document.getElementById('nu-ruolo').value    = 'OPERATORE';
        document.getElementById('nu-max').value      = '1';
    }
}
async function salvaUtenteNuovo() {
    const email    = (document.getElementById('nu-email')?.value   || '').trim();
    const username = (document.getElementById('nu-username')?.value || '').trim();
    const password = (document.getElementById('nu-password')?.value || '').trim();
    const ruolo    = (document.getElementById('nu-ruolo')?.value    || 'OPERATORE');
    const maxU     = parseInt(document.getElementById('nu-max')?.value || '1');

    if (!email || !username || !password) {
        notificaElegante('Compila tutti i campi: email, username, password.', 'error');
        return;
    }
    if (password.length < 4) {
        notificaElegante('La password deve essere di almeno 4 caratteri.', 'error');
        return;
    }
    const btn = document.querySelector('#form-nuovo-utente .btn-modal-send');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
        const hash = await hashSHA256(password);
        const res  = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({ azione: 'creaUtente', email, username, hash, ruolo, max_utenti: maxU })
        });
        const r = await res.json();
        if (r.status === 'success') {
            notificaElegante(`Utente "${username}" creato con successo!`);
            document.getElementById('form-nuovo-utente').style.display = 'none';
            caricaListaUtenti();
        } else {
            notificaElegante(r.message || 'Errore nella creazione utente.', 'error');
        }
    } catch (e) {
        notificaElegante('Errore di connessione.', 'error');
    }
    btn.disabled = false;
    btn.innerHTML = 'Salva Utente';
}
function eliminaUtente(idRiga, username) {
    mostraConferma('Elimina Utente', `Eliminare l'utente "${username}"? Non potrà più accedere.`, async () => {
        try {
            const res = await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: 'eliminaUtente', id_riga: idRiga })
            });
            const r = await res.json();
            if (r.status === 'success') {
                notificaElegante(`Utente "${username}" eliminato.`);
                caricaListaUtenti();
            } else {
                notificaElegante(r.message || 'Errore durante eliminazione.', 'error');
            }
        } catch (e) {
            notificaElegante('Errore di connessione.', 'error');
        }
    }, 'Elimina');
}
function caricaInterfacciaImpostazioni() {
        const contenitore = document.getElementById('contenitore-dati');
        if (!contenitore) return;

        contenitore.innerHTML = `
            <div class="settings-accordion">

                <!-- ROW: Stati Produzione -->
                <div class="settings-row" onclick="toggleSettingsSection('section-stati', this)">
                    <div class="settings-row-left">
                        <div class="settings-row-icon"><i class="fas fa-tag"></i></div>
                        <div>
                            <div class="settings-row-title">Stati Produzione</div>
                            <div class="settings-row-sub">${listaStati.length} stati configurati</div>
                        </div>
                    </div>
                    <i class="fas fa-chevron-down settings-row-arrow"></i>
                </div>
                <div id="section-stati" class="settings-section-body" style="display:none">
                    <div class="card-settings">
                        <div id="lista-stati-config">
                            ${listaStati.map((s, i) => `
                                <div class="config-row-modern row" draggable="true" data-idx="${i}">
                                    <i class="fas fa-grip-vertical drag-handle"></i>
                                    <div class="color-picker-wrapper">
                                        <input type="color" value="${s.colore}" class="color-overlay"
                                               onchange="listaStati[${i}].colore=this.value; segnaModifica(); caricaInterfacciaImpostazioni();">
                                        <div class="status-dot-custom" style="--bg-color:${s.colore};"></div>
                                    </div>
                                    <input type="text" class="input-flat flex-grow" value="${s.nome || s.stato}" onchange="listaStati[${i}].nome=this.value.toUpperCase(); segnaModifica();">
                                    <button type="button" class="btn-trash-modern" onclick="azioneEliminaStato(${i})"><i class="fas fa-trash"></i></button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn-add-dashed" onclick="azioneAggiungiStato()">+ Aggiungi Stato</button>
                    </div>
                </div>

                <!-- ROW: Team + Utenti (solo MASTER) -->
                ${utenteAttuale.ruolo === "MASTER" ? `
                <div class="settings-row" onclick="toggleSettingsSection('section-team-utenti', this)">
                    <div class="settings-row-left">
                        <div class="settings-row-icon"><i class="fas fa-user-lock"></i></div>
                        <div>
                            <div class="settings-row-title">Gestione Utenti</div>
                            <div class="settings-row-sub">Email, username, password e ruoli di accesso</div>
                        </div>
                    </div>
                    <i class="fas fa-chevron-down settings-row-arrow"></i>
                </div>
                <div id="section-team-utenti" class="settings-section-body" style="display:none">
                    <div class="card-settings">

                        <h3 style="margin:0 0 10px 0">Gestione Utenti</h3>
                        <div id="lista-utenti-config"></div>
                        <button class="btn-add-dashed" onclick="apriFormNuovoUtente()">+ Aggiungi Utente</button>
                        <div id="form-nuovo-utente" class="form-nuovo-utente" style="display:none">
                            <div class="form-utente-grid">
                                <input type="email" id="nu-email" placeholder="Email" class="input-field-modern">
                                <input type="text"  id="nu-username" placeholder="Nome utente" class="input-field-modern">
                                <input type="password" id="nu-password" placeholder="Password" class="input-field-modern">
                                <select id="nu-ruolo" class="input-field-modern">
                                    <option value="OPERATORE">Operatore</option>
                                    <option value="MASTER">Admin</option>
                                </select>
                                <input type="number" id="nu-max" placeholder="Max utenti/email (es. 3)" class="input-field-modern" value="1" min="1" max="10">
                            </div>
                            <div class="form-utente-actions">
                                <button class="btn-modal-cancel" onclick="document.getElementById('form-nuovo-utente').style.display='none'">Annulla</button>
                                <button class="btn-modal-send" onclick="salvaUtenteNuovo()">Salva Utente</button>
                            </div>
                        </div>

                        <div style="height:6px"></div>
                    </div>
                </div>
                ` : ''}

            </div>

            <div class="centered-fullwidth my-30">
                <button type="button" class="${TW.btnPrimaryLg}" onclick="salvaTutteImpostazioni()">
                    <i class="fas fa-save"></i> Salva Modifiche
                </button>
            </div>
        `;
        applicaFade(contenitore);
        // Chiama initSortable subito (gli elementi esistono nel DOM anche se hidden)
        initSortable('lista-stati-config', (container) => {
            const rows = [...container.querySelectorAll('[data-idx]')];
            const nuovoOrdine = rows.map(el => listaStati[+el.dataset.idx]);
            listaStati.length = 0;
            nuovoOrdine.forEach((s, i) => { listaStati.push(s); rows[i].dataset.idx = i; });
            segnaModifica();
        });
    }
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
// azioneEliminaOp e azioneAggiungiOp rimossi: operatori derivati da UTENTI
function segnaModifica() {
    modifichePendenti = true;
    const btn = document.getElementById('btn-salva-globale');
    if (btn) {
        btn.style.background = "#ef4444"; // Diventa rosso per segnalare modifiche
        btn.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Salva Modifiche Ora!";
    }
} // Funzione per attivare l'allerta salvataggio

// Sortable generico: DnD fluido su qualsiasi lista, senza re-render
function initSortable(containerId, onReorder) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let dragSrc = null;

    container.addEventListener('dragstart', function(e) {
        const hasHandle = !!container.querySelector('.dnd-handle, .drag-handle');
        if (hasHandle && !e.target.closest('.dnd-handle, .drag-handle')) return;
        dragSrc = e.target.closest('[draggable="true"]');
        if (!dragSrc || !container.contains(dragSrc)) { dragSrc = null; return; }
        dragSrc.classList.add('dnd-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        if (!dragSrc) return;
        const over = e.target.closest('[draggable="true"]');
        if (!over || over === dragSrc || !container.contains(over)) return;
        const rect = over.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
            container.insertBefore(dragSrc, over);
        } else {
            container.insertBefore(dragSrc, over.nextSibling);
        }
    });

    container.addEventListener('dragend', function(e) {
        if (dragSrc) {
            dragSrc.classList.remove('dnd-dragging');
            if (onReorder) onReorder(container);
        }
        dragSrc = null;
    });

    container.addEventListener('drop', function(e) { e.preventDefault(); e.stopPropagation(); });

    // ── Touch DnD (mobile) ───────────────────────────────────────
    let touchSrc = null;
    let touchGhost = null;
    let touchOffX = 0, touchOffY = 0;

    container.addEventListener('touchstart', function(e) {
        const hasHandle = !!container.querySelector('.dnd-handle, .drag-handle');
        const src = e.target.closest('[draggable="true"]');
        if (!src || !container.contains(src)) return;
        if (hasHandle && !e.target.closest('.dnd-handle, .drag-handle')) return;
        touchSrc = src;
        const t = e.touches[0];
        const r = src.getBoundingClientRect();
        touchOffX = t.clientX - r.left;
        touchOffY = t.clientY - r.top;
        touchGhost = src.cloneNode(true);
        touchGhost.style.cssText = `position:fixed;width:${r.width}px;height:${r.height}px;opacity:0.85;pointer-events:none;z-index:99999;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.25);left:${r.left}px;top:${r.top}px;transition:none;transform:scale(1.04) rotate(-1deg);`;
        document.body.appendChild(touchGhost);
        src.style.opacity = '0.25';
        src.style.transform = 'scale(0.97)';
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
        if (!touchSrc || !touchGhost) return;
        e.preventDefault();
        const t = e.touches[0];
        touchGhost.style.left = (t.clientX - touchOffX) + 'px';
        touchGhost.style.top  = (t.clientY - touchOffY) + 'px';
        touchGhost.style.display = 'none';
        const below = document.elementFromPoint(t.clientX, t.clientY);
        touchGhost.style.display = '';
        const over = below?.closest('[draggable="true"]');
        if (over && over !== touchSrc && container.contains(over)) {
            const rect = over.getBoundingClientRect();
            container.insertBefore(touchSrc, t.clientY < rect.top + rect.height / 2 ? over : over.nextSibling);
        }
    }, { passive: false });

    container.addEventListener('touchend', function() {
        if (!touchSrc) return;
        touchSrc.style.opacity = '';
        touchSrc.style.transform = '';
        if (touchGhost) { touchGhost.remove(); touchGhost = null; }
        if (onReorder) onReorder(container);
        touchSrc = null;
    });
}
async function salvaTutteImpostazioni() {
        try {
            await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: 'salva_impostazioni_globali', stati: listaStati, operatori: [] })
            });
            notificaElegante('Impostazioni salvate correttamente!');
        } catch (e) { notificaElegante('Errore nel salvataggio.', 'error'); }
    }






  // --- PAGINA ACQUISTI ---
  let carrelloLocale = [];
  let sezioniMateriali = JSON.parse(localStorage.getItem('sezioniMateriali') || '["Strumenti","Bombolette","Rifiuti"]');

  // Carica le sezioni dal backend (sovrascrive il localStorage se il backend le ha)
  async function _caricaSezioniDaBackend() {
    try {
      const res = await fetch(URL_GOOGLE + '?pagina=SEZIONI_CONFIG');
      const sezioniRemote = await res.json();
      if (Array.isArray(sezioniRemote) && sezioniRemote.length > 0) {
        sezioniMateriali = sezioniRemote;
        localStorage.setItem('sezioniMateriali', JSON.stringify(sezioniMateriali));
      }
    } catch (e) {
      console.warn('Sezioni: fallback a localStorage', e);
    }
  }

  async function _salvaSezioniSuBackend() {
    try {
      await fetch(URL_GOOGLE, {
        method: 'POST',
        body: JSON.stringify({ azione: 'salvaSezioni', sezioni: sezioniMateriali })
      });
    } catch (e) {
      console.warn('Impossibile salvare sezioni sul backend', e);
    }
  }

  async function caricaMateriali(silenzioso = false) {
    // --- PROTEZIONE AGGIORNAMENTO ---
    const isInSelectionMode = document.getElementById('btn-delete-selected')?.classList.contains('visible');
    if (silenzioso && isInSelectionMode) {
        console.log("Aggiornamento silenzioso ignorato: modalità selezione attiva.");
        return;
    }

    const modalArticolo = document.getElementById('modal-gestione-articolo');
    if (modalArticolo) modalArticolo.style.display = 'none';
    document.body.style.overflow = 'auto';

    const contenitore = document.getElementById('contenitore-dati');
    if (!contenitore) return;

    if (!silenzioso) {
        contenitore.innerHTML = "<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento catalogo materiali...</div>";
        applicaFade(contenitore);
    }

    try {
        const materiali = await fetchJson("MATERIALE DA ORDINARE");

        // Aggiorna la lista sezioni dal backend prima di renderizzare
        await _caricaSezioniDaBackend();

        // Aggiungi in sezioniMateriali eventuali sezioni già presenti nei dati ma non ancora in lista
        materiali.forEach(item => {
            const s = (item.SEZIONE || '').trim();
            if (s && !sezioniMateriali.includes(s)) {
                sezioniMateriali.push(s);
            }
        });

        // Guard anti-stale: se l'utente ha cambiato pagina mentre il fetch era in corso, ignorare
        if (!silenzioso && paginaAttuale !== 'MATERIALE DA ORDINARE') return;

        if (!materiali || materiali.length === 0) {
            contenitore.innerHTML = "<div class='empty-msg'>Nessun materiale trovato nel catalogo.</div>";
            applicaFade(contenitore);
            return;
        }

        // Raggruppa per sezione
        function _iconaPerNome(nome) {
            const n = nome.toLowerCase();
            if (/strument|utensil|attrez|chiave|cacciavit|trapan|pinze|martell/.test(n)) return 'fa-screwdriver-wrench';
            if (/bombole|spray|aerosol|vernic|smalto|lacca/.test(n)) return 'fa-spray-can';
            if (/rifiut|spazzatur|scarto|smalt/.test(n)) return 'fa-trash-can';
            if (/pulizia|detersi|detergent|solvente|diluente|sgras/.test(n)) return 'fa-broom';
            if (/nastro|carta|fogli|sacch|busta|plastica/.test(n)) return 'fa-tape';
            if (/scatol|imball|cartone|pacch|box/.test(n)) return 'fa-box-open';
            if (/vite|bullone|dado|chiod|rivett|raccord/.test(n)) return 'fa-gear';
            if (/elettr|cavo|filo|led|presa|batteria/.test(n)) return 'fa-bolt';
            if (/sicurezz|protezione|guant|occhial|mascherina|elmett/.test(n)) return 'fa-shield-halved';
            if (/colori|pigment|tint|inchiostro|pennello/.test(n)) return 'fa-palette';
            if (/tessuto|stoffa|panno|tela|gomma|schiuma/.test(n)) return 'fa-layer-group';
            if (/cibo|aliment|acqua|bevand|coff/.test(n)) return 'fa-utensils';
            if (/ufficio|penna|matita|block|quadern/.test(n)) return 'fa-pen';
            if (/misura|metro|calibro|riga|squadra/.test(n)) return 'fa-ruler';
            if (/prodotto|articol|merce|stock|magazzin/.test(n)) return 'fa-boxes-stacked';
            return 'fa-folder';
        }
        const _groups = {};
        sezioniMateriali.forEach(s => { _groups[s] = []; });
        materiali.forEach((item, gi) => {
            const s = (item.SEZIONE || '').trim();
            const target = sezioniMateriali.includes(s) ? s : sezioniMateriali[0];
            _groups[target].push({ item, gi });
        });

        let html = `
            <div class="acquisti-header header-flex">
                <div>
                    <h3 class="acquisti-title">Catalogo Materiali</h3>
                    <p class="acquisti-subtitle">Gestisci o ordina i materiali.</p>
                </div>
                <div class="acquisti-actions-wrapper">
                    <button id="btn-delete-selected" type="button" onclick="eliminaSelezionati()" class="${TW.btnDanger} btn-fade-action">
                        <i class="fas fa-trash"></i><span class="btn-elimina-label"> Elimina (<span id="count-selected">0</span>)</span>
                    </button>
                    <button id="btn-mode-select" type="button" onclick="toggleSelezioneMultipla()" class="${TW.btn}">
                        <i class="fas fa-tasks"></i><span class="btn-sel-txt"> Seleziona</span>
                    </button>
                    <button type="button" class="btn-nuovo-fisso btn-sezione-new ${TW.btn}" onclick="apriModalNuovaSezione()" title="Nuova sezione">
                        <i class="fas fa-folder-plus"></i>
                    </button>
                    <button type="button" class="btn-nuovo-fisso ${TW.btnSuccess}" onclick="apriModalNuovo()">
                        <i class="fas fa-plus"></i><span class="btn-label-nuovo"> Nuovo</span>
                    </button>
                </div>
            </div>
            <div id="lista-materiali-grid">`;

        const isMobile = window.innerWidth <= 768;

        sezioniMateriali.forEach((sez, si) => {
            const sezItems = _groups[sez] || [];
            const icon = _iconaPerNome(sez);
            html += `
                <div class="sezione-materiali-wrapper">
                    <div class="sezione-header" onclick="toggleSezione('sezione-grid-${si}')">
                        <div class="sezione-header-left">
                            <i class="fas ${icon} sezione-icon"></i>
                            <span class="sezione-nome">${sez}</span>
                            <span class="sezione-count">${sezItems.length}</span>
                        </div>
                        <div class="sezione-header-right">
                            <button type="button" class="btn-sezione-edit" title="Rinomina sezione" onclick="event.stopPropagation(); apriModalRinominaSezione('${sez}')"><i class="fas fa-pen"></i></button>
                            <i class="fas fa-chevron-down sezione-arrow"${isMobile ? ' style="transform:rotate(-90deg)"' : ''}></i>
                        </div>
                    </div>
                    <div class="sezione-grid materiali-grid" id="sezione-grid-${si}" data-sezione="${sez}"${isMobile ? ' style="display:none"' : ''}>`;


            if (sezItems.length === 0) {
                html += `<p class="sezione-empty">Nessun articolo. Usa <b>Sezione</b> dal menu ⋮ per spostare qui un articolo.</p>`;
            }

            sezItems.forEach(({ item, gi: index }) => {
                const nomeProdotto = (item.OGGETTO || "Senza nome").replace(/"/g, '&quot;');
                const fornitore = (item.FORNITORE || "Generico").replace(/"/g, '&quot;');
                const codice = (item.CODICE || "").replace(/"/g, '&quot;');
                const qtyId = `qty-item-${index}`;
                const idRiga = item.id_riga;
                const nomePulitoJS = nomeProdotto.replace(/'/g, "\\'").replace(/"/g, '&quot;');

                html += `
                <div class="materiale-card ${TW.card}" data-idx="${index}" data-search="${(nomeProdotto + ' ' + fornitore + ' ' + codice).toLowerCase().replace(/"/g, '')}">
                    <div class="mat-card-img img-preview-container"
                         data-prod="${nomeProdotto}"
                         data-fornitore="${fornitore}"
                         onclick="scattaFoto('${nomePulitoJS}')">
                        <i class="fas fa-camera mat-img-icon"></i>
                        <span class="mat-img-hint">Scatta foto</span>
                        <span class="mat-badge-fornitore">${fornitore}</span>
                    </div>
                    <div class="materiale-info">
                        <div class="materiale-nome">${nomeProdotto}</div>
                        ${codice ? `<div class="materiale-codice">${codice}</div>` : ''}
                        <div class="materiale-fornitore mat-fornitore-mobile">${fornitore}</div>
                    </div>
                    <div class="materiale-actions">
                        <div class="qty-order-container">
                            <button type="button" class="btn-qty-step" onclick="cambiaQty('${qtyId}', -1)"><i class="fas fa-minus"></i></button>
                            <input type="number" value="1" min="1" id="${qtyId}">
                            <button type="button" class="btn-qty-step" onclick="cambiaQty('${qtyId}', 1)"><i class="fas fa-plus"></i></button>
                        </div>
                        <button type="button" class="btn-add-cart" onclick="aggiungiAlCarrello(\`${nomeProdotto}\`, \`${fornitore}\`, '${qtyId}')" title="Aggiungi al carrello">
                            <i class="fas fa-cart-plus"></i><span class="btn-cart-txt"> Aggiungi</span>
                        </button>
                    </div>
                    <div class="mat-card-opts">
                        <input type="checkbox" class="select-materiale mat-sel-chk" data-id="${idRiga}" onclick="aggiornaConteggioSelezionati()">
                        <button type="button" onclick="toggleMenuOpzioni(event, ${index})" class="btn-opt-trigger">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div id="menu-opzioni-${index}" class="menu-popup-opzioni">
                            <button type="button" class="menu-item-opt" onclick="apriModalModifica('${idRiga}', \`${nomeProdotto}\`, \`${fornitore}\`, \`${codice}\`)"><i class="fas fa-edit"></i> Modifica</button>
                            <button type="button" class="menu-item-opt" onclick="duplicaArticolo('${idRiga}', \`${nomeProdotto}\`, \`${fornitore}\`, \`${codice}\`)"><i class="fas fa-copy"></i> Duplica</button>
                            <button type="button" class="menu-item-opt" onclick="apriModalSpostaSezione('${idRiga}')"><i class="fas fa-folder-open"></i> Sezione</button>
                            <button type="button" class="menu-item-opt btn-menu-elimina-foto" style="display:none" onclick="resetFoto('${nomePulitoJS}')"><i class="fas fa-image"></i> Elimina foto</button>
                            <button type="button" class="menu-item-opt text-danger" onclick="eliminaArticolo('${idRiga}')"><i class="fas fa-trash"></i> Elimina</button>
                        </div>
                    </div>
                </div>`;
            });

            html += `
                    </div>
                </div>`;
        });

        html += `</div>`;
        cacheContenuti["MATERIALE DA ORDINARE"] = html;
        cacheFetchTime["MATERIALE DA ORDINARE"] = Date.now();
        contenitore.innerHTML = html;
        applicaFade(contenitore);
        aggiornaListaFiltrabili();

    } catch (e) {
        console.error("Errore caricamento materiali:", e);
        if (contenitore) {
            contenitore.innerHTML = "<div class='centered-error-bold'>Errore nel caricamento del catalogo.</div>";
            applicaFade(contenitore);
        }
    }
}
  function cambiaQty(inputId, delta) {
      const el = document.getElementById(inputId);
      if (!el) return;
      const val = (parseInt(el.value) || 1) + delta;
      el.value = Math.max(1, val);
  }
  function aggiungiAlCarrello(nome, fornitore, inputId) {
      const qtyInput = document.getElementById(inputId);
      const qty = parseInt(qtyInput.value) || 1; // Prende il valore attuale dell'input

      // Recuperiamo l'immagine se presente
      const container = document.querySelector(`[data-prod="${nome}"]`);
      const imgPreview = container ? container.querySelector('img') : null;
      const fotoBase64 = imgPreview ? imgPreview.src : null;

      carrelloLocale.push({
          prodotto: nome,
          quantita: qty,
          fornitore: fornitore,
          foto: fotoBase64
      });

      aggiornaBadgeCarrello();

      // Feedback visivo: solo icona ✓ verde per 1.4s
      const btn = event.target.closest('button');
      const testoOriginale = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
      btn.style.boxShadow = '0 2px 8px rgba(16,185,129,0.45)';

      setTimeout(() => {
          btn.innerHTML = testoOriginale;
          btn.style.background = '';
          btn.style.boxShadow = '';
          qtyInput.value = 1;
      }, 1400);
  }
  function toggleMostraCarrello() {
      const modal = document.getElementById('modal-carrello');
      const lista = document.getElementById('lista-articoli-carrello');
      const btnInvia = document.getElementById('btn-invia-alessio');

      if (carrelloLocale.length === 0) {
          lista.innerHTML = "<p class='empty-cart-msg'>Il tuo carrello è vuoto.</p>";
          if (btnInvia) btnInvia.style.display = 'none';
      } else {
          let html = "";
          carrelloLocale.forEach((item, index) => {
              html += `
              <div class="cart-item-row">
                  ${item.foto ? `<img src="${item.foto}" class="cart-item-photo">` : `<div class="cart-item-placeholder"><i class="fas fa-shopping-basket cart-item-icon"></i></div>`}
                  <div class="flex-grow">
                      <div class="cart-item-name">${item.prodotto}</div>
                      <div class="cart-item-details">Qt: ${item.quantita} - ${item.fornitore}</div>
                  </div>
                  <button onclick="rimuoviDalCarrello(${index})" class="btn-inline-trash"><i class="fas fa-trash"></i></button>
              </div>`;
          });
          lista.innerHTML = html;
          if (btnInvia) btnInvia.style.display = 'block';
      }
      modal.style.display = 'flex';
      requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('cart-open')));
  }
  function rimuoviDalCarrello(index) {
      carrelloLocale.splice(index, 1);
      aggiornaBadgeCarrello();
      toggleMostraCarrello(); // Refresh della lista
  }
  function chiudiModalCarrello() {
      const modal = document.getElementById('modal-carrello');
      modal.classList.remove('cart-open');
      setTimeout(() => { modal.style.display = 'none'; }, 300);
  }
  // Alias: il floating button chiama apriModalCarrello
  function apriModalCarrello() { toggleMostraCarrello(); }
  function aggiornaBadgeCarrello() {
      const count = carrelloLocale.length;

      // Aggiorna tutti i badge presenti nel DOM
      const b1 = document.getElementById('badge-carrello-count');
      const b2 = document.getElementById('cart-qty-val');

      if (b1) {
          b1.innerText = count;
          b1.style.display = count > 0 ? 'flex' : 'none';
      }
      if (b2) b2.innerText = count;
  }
  async function inviaOrdineAcquisti() {
      if (carrelloLocale.length === 0) {
          alert("Il carrello è vuoto!");
          return;
      }

      const conferma = confirm(`Vuoi inviare la lista di ${carrelloLocale.length} articoli all'ufficio acquisti?`);
      if (!conferma) return;

      // Mostriamo un loader sul bottone di invio se esiste
      const btnInvia = document.getElementById('btn-invia-alessio');
      const testoOriginale = btnInvia ? btnInvia.innerText : "";
      if (btnInvia) {
          btnInvia.disabled = true;
          btnInvia.innerText = "Invio in corso...";
      }

      try {
          const payload = {
              azione: "inviaOrdineAcquisti",
              operatore: (typeof utenteAttuale !== 'undefined') ? utenteAttuale.nome : "Utente",
              articoli: carrelloLocale
          };

          const res = await fetch(URL_GOOGLE, {
              method: 'POST',
              body: JSON.stringify(payload)
          });

          const result = await res.json();

          if (result.status === "success") {
              alert("✅ Ordine inviato con successo ad Alessio!");
              carrelloLocale = [];
              aggiornaBadgeCarrello();
              if (typeof chiudiModalCarrello === "function") chiudiModalCarrello();
              cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE');
          } else {
              throw new Error(result.message);
          }
      } catch (e) {
          alert("❌ Errore nell'invio dell'ordine: " + e.message);
      } finally {
          if (btnInvia) {
              btnInvia.disabled = false;
              btnInvia.innerText = testoOriginale;
          }
      }
  }
  function scattaFoto(nomeProdotto) {
      // Usiamo CSS.escape per gestire nomi con spazi, virgolette o caratteri speciali
      const selettore = `[data-prod="${nomeProdotto.replace(/"/g, '\\"')}"]`;
      const container = document.querySelector(selettore);

      if (!container) return;

      // Se c'è già una foto → apri fullscreen. Rimozione solo dal menu ⋮
      if (container.querySelector('img')) {
          const src = container.querySelector('img').src;
          apriImmagineIntera(src);
          return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = e => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = event => {
              const base64String = event.target.result;
              const fornitore = container.getAttribute('data-fornitore') || '';

              container.innerHTML = `
                  <img src="${base64String}"
                       class="modal-img"
                       onclick="event.stopPropagation(); apriImmagineIntera('${base64String}')">
                  ${fornitore ? `<span class="mat-badge-fornitore">${fornitore}</span>` : ''}`;

              container.style.border = '';

              // Mostra voce "Elimina foto" nel menu ⋮ di questa card
              const card = container.closest('.materiale-card');
              if (card) {
                  const btnFoto = card.querySelector('.btn-menu-elimina-foto');
                  if (btnFoto) btnFoto.style.display = '';
              }
          };
          reader.readAsDataURL(file);
      };
      input.click();
  }
  function resetFoto(nomeProdotto) {
      if (confirm("Vuoi rimuovere l'immagine da questo prodotto?")) {
          const container = document.querySelector(`[data-prod="${nomeProdotto}"]`);
          if (!container) return;
          const fornitore = container.getAttribute('data-fornitore') || '';
          container.innerHTML = `
              <i class="fas fa-camera mat-img-icon"></i>
              <span class="mat-img-hint">Scatta foto</span>
              ${fornitore ? `<span class="mat-badge-fornitore">${fornitore}</span>` : ''}`;
          container.style.border = '';
          // Nasconde di nuovo voce "Elimina foto" nel menu
          const card = container.closest('.materiale-card');
          if (card) {
              const btnFoto = card.querySelector('.btn-menu-elimina-foto');
              if (btnFoto) btnFoto.style.display = 'none';
          }
      }
  }
  function apriImmagineIntera(src) {
      // Crea un overlay temporaneo per vedere la foto grande
      const overlay = document.createElement('div');
      overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:200000; display:flex; justify-content:center; align-items:center; cursor:zoom-out;";
      overlay.innerHTML = `<img src="${src}" class="overlay-img">`;
      overlay.onclick = () => document.body.removeChild(overlay);
      document.body.appendChild(overlay);
  }
  function toggleMenuOpzioni(event, index) {
      event.preventDefault();
      event.stopPropagation();

      // Chiudi tutti gli altri menu
      document.querySelectorAll('.menu-popup-opzioni').forEach(m => {
          if (m.id !== `menu-opzioni-${index}`) m.classList.remove('open');
      });

      const menu = document.getElementById(`menu-opzioni-${index}`);
      if (menu) menu.classList.toggle('open');
  }

// Chiudi i menu se clicchi altrove
document.addEventListener('click', () => {
        document.querySelectorAll('.menu-popup-opzioni.open').forEach(m => m.classList.remove('open'));
});
  function apriModalNuovo() {
    document.getElementById('titolo-modal-articolo').innerText = "Nuovo Articolo";
    document.getElementById('edit-id-riga').value = "";
    document.getElementById('edit-nome').value = "";
    document.getElementById('edit-codice').value = "";
    document.getElementById('edit-fornitore').value = "";
    const modal = document.getElementById('modal-gestione-articolo');
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
  }
  function apriModalModifica(id, nome, fornitore, codice) {
    const modal = document.getElementById('modal-gestione-articolo');
    document.getElementById('titolo-modal-articolo').innerText = id ? "Modifica Articolo" : "Nuovo Articolo";
    document.getElementById('edit-id-riga').value = id || "";
    document.getElementById('edit-nome').value = nome || "";
    document.getElementById('edit-codice').value = (codice && codice !== 'undefined') ? codice : "";
    document.getElementById('edit-fornitore').value = fornitore || "";
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
  }
  function chiudiModalArticolo() {
    const modal = document.getElementById('modal-gestione-articolo');
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
  }
  async function salvaArticolo() {

  const btn = document.getElementById('btn-salva-articolo');

  const nome = document.getElementById('edit-nome').value.trim();

  if (!nome) return alert("Inserisci il nome!");



  const payload = {

      azione: "gestisciMateriale",

      id_riga: document.getElementById('edit-id-riga').value,

      nome: nome,

      codice: document.getElementById('edit-codice').value,

      fornitore: document.getElementById('edit-fornitore').value

  };



  // Feedback immediato

  btn.innerText = "Salvataggio...";

  btn.disabled = true;



  try {

      const res = await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify(payload) });

      const r = await res.json();

      if (r.status === "success") {

          chiudiModalArticolo(); // CHIUDI PRIMA DI RICARICARE

          caricaMateriali();     // RICARICA DOPO

      }

  } catch (e) {

      alert("Errore salvataggio!");

  } finally {

      btn.innerText = "Salva";

      btn.disabled = false;

  }

}
  async function duplicaArticolo(idRiga, nome, fornitore, codice) {
    mostraConferma('Duplica Articolo', `Duplicare l'articolo: "${nome}"?`, async () => {

    const cardOriginale = document.querySelector(`[data-id="${idRiga}"]`).closest('.materiale-card');

    // Generiamo un ID temporaneo basato sul tempo per rendere il menu unico
    const tempIndex = Date.now();
    const qtyId = `qty-item-temp-${tempIndex}`;

    const divScatola = document.createElement('div');
    divScatola.innerHTML = `
        <div class="materiale-card ${TW.card}">

            <!-- Area immagine -->
            <div class="mat-card-img img-preview-container"
                 data-prod="${nome}" data-fornitore="${fornitore}"
                 onclick="scattaFoto('${nome.replace(/'/g, "\\'")}')">
                <i class="fas fa-camera mat-img-icon"></i>
                <span class="mat-img-hint">Scatta foto</span>
                <span class="mat-badge-fornitore">${fornitore}</span>
            </div>

            <!-- Info prodotto -->
            <div class="materiale-info">
                <div class="materiale-nome">${nome}</div>
                ${codice ? `<div class="materiale-codice">${codice}</div>` : ''}
                <div class="materiale-fornitore mat-fornitore-mobile">${fornitore}</div>
            </div>

            <!-- Footer azioni -->
            <div class="materiale-actions">
                <div class="qty-order-container">
                    <button type="button" class="btn-qty-step" onclick="cambiaQty('${qtyId}', -1)"><i class="fas fa-minus"></i></button>
                    <input type="number" value="1" min="1" id="${qtyId}">
                    <button type="button" class="btn-qty-step" onclick="cambiaQty('${qtyId}', 1)"><i class="fas fa-plus"></i></button>
                </div>
                <button type="button" class="btn-add-cart" onclick="aggiungiAlCarrello(\`${nome}\`, \`${fornitore}\`, '${qtyId}')" title="Aggiungi al carrello">
                    <i class="fas fa-cart-plus"></i><span class="btn-cart-txt"> Aggiungi</span>
                </button>
            </div>

            <!-- Menu opzioni + checkbox -->
            <div class="mat-card-opts">
                <input type="checkbox" class="select-materiale mat-sel-chk" data-id="temp" onclick="aggiornaConteggioSelezionati()">
                <button type="button" class="btn-opt-trigger" onclick="toggleMenuOpzioni(event, 'temp-${tempIndex}')">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div id="menu-opzioni-temp-${tempIndex}" class="menu-popup-opzioni">
                    <button type="button" class="menu-item-opt" onclick="apriModalModifica('', \`${nome}\`, \`${fornitore}\`, \`${codice}\`)">
                        <i class="fas fa-edit"></i> Modifica
                    </button>
                    <button type="button" class="menu-item-opt" onclick="duplicaArticolo('temp', \`${nome}\`, \`${fornitore}\`, \`${codice}\`)">
                        <i class="fas fa-copy"></i> Duplica
                    </button>
                    <button type="button" class="menu-item-opt btn-menu-elimina-foto" style="display:none" onclick="resetFoto('${nome.replace(/'/g, "\\'")}')">
                        <i class="fas fa-image"></i> Elimina foto
                    </button>
                    <button type="button" class="menu-item-opt text-danger" onclick="this.closest('.materiale-card').remove()">
                        <i class="fas fa-trash"></i> Elimina
                    </button>
                </div>
            </div>
        </div>`;

    const nuovaCard = divScatola.firstElementChild;
    nuovaCard.style.opacity = '0';
    nuovaCard.style.transform = 'translateY(-10px)';
    cardOriginale.after(nuovaCard);
    requestAnimationFrame(() => {
        nuovaCard.style.transition = 'opacity 0.3s, transform 0.3s';
        nuovaCard.style.opacity = '1';
        nuovaCard.style.transform = 'translateY(0)';
    });

    // Salvataggio reale in background
    try {
        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: "duplicaMateriale",
                id_riga: idRiga,
                nome: nome,
                codice: codice,
                fornitore: fornitore
            })
        });
        const r = await res.json();
        if (r.status === "success") caricaMateriali(true);
    } catch (e) {
        nuovaCard.style.border = "1px solid red";
        notificaElegante('Errore di sincronizzazione.', 'error');
    }
    }, 'Duplica');
  } // fine duplicaArticolo


  // ── sezioni acquisti ──────────────────────────────────────────
  function toggleSezione(gridId) {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      const isOpen = grid.style.display !== 'none';
      grid.style.display = isOpen ? 'none' : '';
      const wrapper = grid.closest('.sezione-materiali-wrapper');
      const arrow = wrapper?.querySelector('.sezione-arrow');
      if (arrow) arrow.style.transform = isOpen ? 'rotate(-90deg)' : '';
  }

  function apriModalSpostaSezione(idRiga) {
      document.querySelectorAll('.menu-popup-opzioni.open').forEach(m => m.classList.remove('open'));
      const sel = document.getElementById('sposta-sezione-select');
      sel.innerHTML = sezioniMateriali.map(s => `<option value="${s}">${s}</option>`).join('');
      document.getElementById('sposta-id-riga').value = idRiga;
      const modal = document.getElementById('modal-sposta-sezione');
      modal.style.display = 'flex';
      modal.offsetHeight;
      modal.classList.add('active');
  }
  function chiudiModalSpostaSezione() {
      const modal = document.getElementById('modal-sposta-sezione');
      modal.classList.remove('active');
      setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
  }
  async function confermaSpostaSezione() {
      const idRiga = document.getElementById('sposta-id-riga').value;
      const sezione = document.getElementById('sposta-sezione-select').value;
      chiudiModalSpostaSezione();
      try {
          await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'spostaSezione', id_riga: idRiga, sezione }) });
          delete cacheContenuti['MATERIALE DA ORDINARE'];
          caricaMateriali(false);
      } catch (e) { notificaElegante('Errore durante lo spostamento.', 'error'); }
  }

  function apriModalRinominaSezione(nomeVecchio) {
      document.getElementById('rinomina-sezione-nome').value = nomeVecchio;
      document.getElementById('rinomina-sezione-vecchio').value = nomeVecchio;
      const modal = document.getElementById('modal-rinomina-sezione');
      modal.style.display = 'flex';
      modal.offsetHeight;
      modal.classList.add('active');
      setTimeout(() => { const inp = document.getElementById('rinomina-sezione-nome'); if (inp) { inp.focus(); inp.select(); } }, 100);
  }
  function chiudiModalRinominaSezione() {
      const modal = document.getElementById('modal-rinomina-sezione');
      modal.classList.remove('active');
      setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
  }
  async function confermaRinominaSezione() {
      const nuovoNome = document.getElementById('rinomina-sezione-nome').value.trim();
      const vecchioNome = document.getElementById('rinomina-sezione-vecchio').value;
      if (!nuovoNome || nuovoNome === vecchioNome) { chiudiModalRinominaSezione(); return; }
      if (sezioniMateriali.includes(nuovoNome)) { notificaElegante('Esiste già una sezione con questo nome.', 'error'); return; }
      chiudiModalRinominaSezione();
      // Aggiorna array locale
      sezioniMateriali = sezioniMateriali.map(s => s === vecchioNome ? nuovoNome : s);
      localStorage.setItem('sezioniMateriali', JSON.stringify(sezioniMateriali));
      try {
          await fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'rinominaSezione', vecchioNome, nuovoNome }) });
          delete cacheContenuti['MATERIALE DA ORDINARE'];
          caricaMateriali(false);
          notificaElegante(`Sezione rinominata in "${nuovoNome}"`, 'success');
      } catch (e) { notificaElegante('Errore durante il salvataggio.', 'error'); }
  }

  function apriModalNuovaSezione() {
      document.getElementById('nuova-sezione-nome').value = '';
      const modal = document.getElementById('modal-nuova-sezione');
      modal.style.display = 'flex';
      modal.offsetHeight;
      modal.classList.add('active');
      setTimeout(() => document.getElementById('nuova-sezione-nome')?.focus(), 100);
  }
  function chiudiModalNuovaSezione() {
      const modal = document.getElementById('modal-nuova-sezione');
      modal.classList.remove('active');
      setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
  }
  function confermaNuovaSezione() {
      const nome = document.getElementById('nuova-sezione-nome').value.trim();
      if (!nome) return;
      if (!sezioniMateriali.includes(nome)) {
          sezioniMateriali = [...sezioniMateriali, nome];
          localStorage.setItem('sezioniMateriali', JSON.stringify(sezioniMateriali));
          _salvaSezioniSuBackend(); // Persiste sul backend per tutti i dispositivi
      }
      chiudiModalNuovaSezione();
      delete cacheContenuti['MATERIALE DA ORDINARE'];
      caricaMateriali(false);
  }
  // ─────────────────────────────────────────────────────────────

  function toggleSelezioneMultipla() {
    const grid = document.getElementById('lista-materiali-grid');
    const btnElimina = document.getElementById('btn-delete-selected');
    const btn = document.getElementById('btn-mode-select');
    if (!grid) return;
    const isOn = grid.classList.toggle('grid-sel-mode');
    // Reset conteggio e deseleziona tutto
    grid.querySelectorAll('.mat-sel-chk').forEach(c => { c.checked = false; });
    if (btnElimina) btnElimina.classList.remove('visible');
    if (btn) btn.innerHTML = isOn
        ? '<i class="fas fa-times"></i> <span class="btn-txt">Annulla</span>'
        : '<i class="fas fa-tasks"></i> <span class="btn-txt">Seleziona</span>';
    const counter = document.getElementById('count-selected');
    if (counter) counter.innerText = '0';
  }
  function aggiornaConteggioSelezionati() {
    const selezionati = document.querySelectorAll('.mat-sel-chk:checked').length;
    const btnElimina = document.getElementById('btn-delete-selected');
    document.getElementById('count-selected').innerText = selezionati;
    if (selezionati > 0) btnElimina.classList.add('visible');
    else btnElimina.classList.remove('visible');
  }
  async function eliminaArticolo(idRiga) {
    mostraConferma('Elimina Articolo', 'Eliminare definitivamente questo articolo dal catalogo?', async () => {
        const card = document.querySelector(`[data-id="${idRiga}"]`).closest('.materiale-card');
        card.style.transition = "all 0.3s ease";
        card.style.transform = "scale(0.8)";
        card.style.opacity = "0";
        setTimeout(() => card.style.display = "none", 300);
        try {
            const res = await fetch(URL_GOOGLE, {
                method: 'POST',
                body: JSON.stringify({ azione: "eliminaMateriale", id_riga: idRiga })
            });
            const r = await res.json();
            if (r.status !== "success") throw new Error();
            caricaMateriali(true);
        } catch (e) {
            card.style.display = "flex";
            card.style.opacity = "1";
            card.style.transform = "";
            notificaElegante('Errore durante l\'eliminazione.', 'error');
        }
    }, 'Elimina');
  }
  async function eliminaSelezionati() {
    // Filtriamo gli ID per ignorare quelli "temp" non ancora salvati su Google
    const checkboxes = document.querySelectorAll('.mat-sel-chk:checked');
    const selezionati = Array.from(checkboxes)
                             .map(c => c.getAttribute('data-id'))
                             .filter(id => id && id !== "temp" && id !== "null");

    if (selezionati.length === 0) {
        alert("Nessun articolo valido selezionato. Attendi il salvataggio dei nuovi duplicati prima di eliminarli.");
        return;
    }

    if (!confirm(`Sei sicuro di voler eliminare ${selezionati.length} articoli?`)) return;

    try {
        // Feedback visivo immediato (oscuriamo le card selezionate)
        checkboxes.forEach(cb => {
            const card = cb.closest('.materiale-card');
            if (card) {
                card.style.opacity = "0.3";
                card.style.pointerEvents = "none";
            }
        });

        const res = await fetch(URL_GOOGLE, {
            method: 'POST',
            body: JSON.stringify({
                azione: "eliminaMateriale",
                id_riga: selezionati
            })
        });

        const r = await res.json();
        if (r.status === "success") {
            notificaElegante("Articoli eliminati con successo");

            // Disattiva la modalità selezione prima di ricaricare
            const btnDelete = document.getElementById('btn-delete-selected');
            if (btnDelete) btnDelete.classList.remove('visible');

            caricaMateriali(false); // Ricarica completa per pulire la griglia
        } else {
            throw new Error(r.message);
        }
    } catch (e) {
        alert("Errore durante l'eliminazione multipla: " + e.message);
        caricaMateriali(true); // Ripristina la visualizzazione in caso di errore
    }
}

//FUNZIONE CONTRO IL FREEZE//

  async function eseguiAzioneServer(payload) {

    try {

        console.log("Invio azione:", payload.azione);

        const response = await fetch(URL_GOOGLE, {

            method: 'POST',

            mode: 'no-cors', // Spesso necessario con Google Apps Script se non è configurato CORS

            body: JSON.stringify(payload)

        });



        // Se usi 'no-cors', non puoi leggere la risposta JSON.

        // Se non lo usi, procedi come sotto:

        /*

        const res = await response.json();

        if (r.status === "success") return true;

        */



        // Per ora facciamo un approccio sicuro:

        setTimeout(() => {

            notificaElegante("Operazione completata");

            caricaMateriali(); // Ricarica dopo 1 secondo per dare tempo al server

        }, 1500);



        return true;

    } catch (e) {

        console.error("Errore critico:", e);

        alert("Errore di connessione. Riprova.");

        return false;

    }

}





//FUNZIONI UNIVERSALI//

// Escapa i caratteri speciali regex nell'input utente
function _escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Restituisce true se la stringa inizia con il termine (prima parola)
function _matchFirstWord(text, term) {
    if (!term) return true;
    return text.trimStart().startsWith(term);
}

function filtraUniversale() {
    clearTimeout(ricercaTimeout);
    ricercaTimeout = setTimeout(() => {
        // Legge da tutti gli input di ricerca (top bar desktop + mobile)
        const topVal    = (document.getElementById('universal-search')?.value || '').toLowerCase().trim();
        const mobVal    = (document.getElementById('mobile-search')?.value    || '').toLowerCase().trim();
        const input = topVal || mobVal;
        const grid = document.getElementById('lista-materiali-grid');

        if (!elementiDaFiltrareCache) aggiornaListaFiltrabili();
        if (!elementiDaFiltrareCache) return;

        // ── Matching a due livelli ──────────────────────────────────────────
        // PRIMARIO  : il testo inizia per il termine digitato (sempre attivo)
        // SECONDARIO: il testo contiene il termine (attivo solo da 3 caratteri)
        const isNumericOnly  = input !== '' && /^\d+$/.test(input);
        const secondaryOn    = input.length >= 3;

        elementiDaFiltrareCache.forEach(el => {
            let primary = false;
            let secondary = false;

            if (input === '') {
                primary = true;
            } else if (el.classList.contains('ordine-wrapper') || el.classList.contains('chat-card')) {
                const ordine  = String(el.dataset.ordine  || '');
                const cliente = String(el.dataset.cliente || '');
                if (isNumericOnly) {
                    primary = ordine.startsWith(input);
                } else {
                    primary = _matchFirstWord(cliente, input);
                    if (!primary && secondaryOn) secondary = cliente.includes(input);
                }
            } else {
                // Acquisti (materiale-card)
                const ds = String(el.dataset.search || el.textContent || '').toLowerCase();
                primary = _matchFirstWord(ds, input);
                if (!primary && secondaryOn) secondary = ds.includes(input);
            }

            const visible = primary || secondary;
            el.classList.toggle('hidden-search', !visible);
            // Marca visivamente i risultati secondari (sfondo leggermente distinto)
            el.classList.toggle('search-secondary', !primary && secondary);
        });

        // ── Modalità ricerca acquisti: appiattisce le sezioni ─────────────────
        if (grid) {
            if (input !== '') {
                grid.classList.add('search-active');
                document.querySelectorAll('.sezione-materiali-wrapper').forEach(wrapper => {
                    const visibili = wrapper.querySelectorAll('.materiale-card:not(.hidden-search)').length;
                    wrapper.classList.toggle('sez-no-results', visibili === 0);
                });
            } else {
                grid.classList.remove('search-active');
                document.querySelectorAll('.sezione-materiali-wrapper').forEach(w => {
                    w.classList.remove('sez-no-results');
                    w.style.display = '';
                });
            }
        }

        const sezioneArchivio = document.getElementById('sezione-archivio');
        if (sezioneArchivio) sezioneArchivio.style.display = input === '' ? 'block' : 'none';
    }, 120);
}
function notificaElegante(messaggio) {
    // Crea l'elemento notifica
    const toast = document.createElement('div');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${messaggio}`;

    // Stile della notifica
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1e293b',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: '100000',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: '0',
        transition: 'all 0.4s ease'
    });

    document.body.appendChild(toast);

    // Animazione entrata
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.bottom = '30px';
    }, 100);

    // Auto-distruzione dopo 3 secondi
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '20px';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
document.addEventListener('DOMContentLoaded', async function() {
    if (_pageInitDone) return;
    _pageInitDone = true;

    let hasSession = false;
    try { hasSession = !!(localStorage.getItem('sessioneUtente') || sessionStorage.getItem('sessioneUtente')); } catch (e) {}
    if (!hasSession) return;

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
document.addEventListener('click', function (e) {
    if (window.innerWidth > 768) return; // Non toccare nulla su Desktop

    // Close mobile sidebar when tapping the backdrop
    if (document.body.classList.contains('sidebar-is-open')) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.contains(e.target) && !e.target.closest('#btn-mobile-menu')) {
            sidebar.classList.remove('mobile-open');
            document.body.classList.remove('sidebar-is-open');
            return;
        }
    }

    const card = e.target.closest('.riga-ordine');
    if (card) {
        // Se clicchi un bottone, esegui il comando e non chiudere
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

        // Toggle della classe espansa
        card.classList.toggle('espansa');
    }
});

// Fallback helpers and bindings to ensure critical controls work
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('mobile-open');
    // Toggle body overlay class to block scroll and show backdrop
    document.body.classList.toggle('sidebar-is-open');
}

document.addEventListener('DOMContentLoaded', function () {
    if (_bindingsInitDone) return;
    _bindingsInitDone = true;

    // Bind login button safely (keeps existing inline onclick as fallback)
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin && !btnLogin.hasAttribute('onclick') && typeof verificaAccesso === 'function') {
        btnLogin.addEventListener('click', function (ev) {
            ev.preventDefault();
            try { verificaAccesso(); } catch (e) { console.error('verificaAccesso error', e); }
        });
    }

    // Bind logout (nel dropdown account)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout && typeof logout === 'function') {
        btnLogout.addEventListener('click', function (ev) {
            ev.preventDefault();
            chiudiAccountMenu();
            try { logout(); } catch (e) { console.error('logout error', e); }
        });
    }

    // Bind universal search input (input event is less intrusive than keyup)
    const searchInput = document.getElementById('universal-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            try { if (typeof filtraUniversale === 'function') filtraUniversale(); } catch (e) { console.error('filtraUniversale error', e); }
        });
        // compositionend: copre tastiere mobili con input predittivo (iOS/Android)
        searchInput.addEventListener('compositionend', function () {
            try { if (typeof filtraUniversale === 'function') filtraUniversale(); } catch (e) { console.error('filtraUniversale error', e); }
        });
    }

    // === FIX TASTIERA iOS: nasconde mobile-tab-bar quando la tastiera è aperta ===
    // Evita che mobile-tab-bar (position:fixed) si sovrapponga alla tastiera o al contenuto
    if (window.innerWidth <= 768) {
        let _keyboardTimer = null;
        document.addEventListener('focusin', function (e) {
            if (e.target.matches('input, textarea, select')) {
                clearTimeout(_keyboardTimer);
                document.body.classList.add('keyboard-open');
            }
        });
        document.addEventListener('focusout', function (e) {
            if (e.target.matches('input, textarea, select')) {
                // piccolo delay: evita flickering quando si passa da un campo all'altro
                _keyboardTimer = setTimeout(() => {
                    document.body.classList.remove('keyboard-open');
                }, 300);
            }
        });
    }

    // Mobile header hamburger (if present)
    const mobileToggle = document.getElementById('btn-mobile-menu');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function (ev) {
            ev.preventDefault();
            try { toggleMobileMenu(); } catch (e) { console.error('toggleMobileMenu error', e); }
        });
    }

    // Auto-close sidebar on mobile when a menu item is clicked
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) sidebar.classList.remove('mobile-open');
                document.body.classList.remove('sidebar-is-open');
            }
        });
    });

    // Allow pressing Enter in the login input to trigger login
    const emailInput = document.getElementById('email-access');
    if (emailInput) {
        emailInput.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                try { verificaAccesso(); } catch (e) { console.error('verificaAccesso error', e); }
            }
        });
    }

    // Chiudi modal cliccando sul backdrop (area scura esterna al box)
    const modalAiuto = document.getElementById('modalAiuto');
    if (modalAiuto) {
        modalAiuto.addEventListener('click', function(e) {
            if (e.target === this) chiudiModal();
        });
    }

    // ── PULL TO REFRESH (solo mobile) ────────────────────────────
    (function initPullToRefresh() {
        const scroller = document.getElementById('contenitore-dati');
        const indicator = document.getElementById('ptr-indicator');
        if (!scroller || !indicator) return;

        const THRESHOLD = 70;   // px da trascinare per attivare refresh
        const MAX_PULL  = 100;  // limite visivo massimo
        let startY = 0, pulling = false, currentY = 0;

        function _isMobile() { return window.innerWidth <= 768; }

        function _refresh() {
            indicator.classList.add('ptr-loading');
            // Svuota cache della pagina attuale e ricarica
            if (typeof paginaAttuale !== 'undefined' && paginaAttuale) {
                delete cacheContenuti[paginaAttuale];
                cambiaPagina(paginaAttuale);
            }
            // Nascondi indicatore dopo breve attesa
            setTimeout(() => {
                indicator.classList.remove('ptr-visible', 'ptr-loading');
                scroller.style.transform = '';
                const arrow = indicator.querySelector('.ptr-arrow');
                if (arrow) arrow.classList.remove('rotated');
            }, 900);
        }

        scroller.addEventListener('touchstart', function(e) {
            if (!_isMobile()) return;
            if (scroller.scrollTop > 0) return;
            startY = e.touches[0].clientY;
            pulling = true;
        }, { passive: true });

        scroller.addEventListener('touchmove', function(e) {
            if (!pulling || !_isMobile()) return;
            if (scroller.scrollTop > 2) { pulling = false; return; }
            const dy = Math.min(e.touches[0].clientY - startY, MAX_PULL);
            if (dy <= 0) return;
            currentY = dy;
            // Mostra indicatore
            indicator.classList.add('ptr-visible');
            indicator.classList.remove('ptr-loading');
            const arrow = indicator.querySelector('.ptr-arrow');
            const label = indicator.querySelector('.ptr-label');
            if (dy >= THRESHOLD) {
                if (arrow) arrow.classList.add('rotated');
                if (label) label.textContent = 'Rilascia per aggiornare';
            } else {
                if (arrow) arrow.classList.remove('rotated');
                if (label) label.textContent = 'Tira per aggiornare';
            }
            // Resistenza elastica: scorri il contenuto leggermente
            scroller.style.transform = `translateY(${dy * 0.4}px)`;
        }, { passive: true });

        scroller.addEventListener('touchend', function() {
            if (!pulling || !_isMobile()) return;
            pulling = false;
            scroller.style.transform = '';
            if (currentY >= THRESHOLD) {
                _refresh();
            } else {
                indicator.classList.remove('ptr-visible');
                const arrow = indicator.querySelector('.ptr-arrow');
                if (arrow) arrow.classList.remove('rotated');
            }
            currentY = 0;
        });
    })();
    // ────────────────────────────────────────────────────────────
});
