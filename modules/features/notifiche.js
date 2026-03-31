// PROD — Features / Notifiche
// Estratto da script.js — 28 marzo 2026
// Dipendenze: ../core/config.js, ../core/session.js, ../core/ui.js

import { URL_GOOGLE } from '../core/config.js';
import { utenteAttuale } from '../core/session.js';
import { notificaElegante } from '../core/ui.js';

const NOTIF_RETENTION_DAYS = 7;
const NOTIF_RETENTION_MS = NOTIF_RETENTION_DAYS * 24 * 60 * 60 * 1000;

function _parseNotifTsMs_(raw) {
    if (!raw) return 0;
    if (raw instanceof Date) return raw.getTime();
    const s = String(raw).trim();
    if (!s) return 0;

    const m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) {
        const dd = parseInt(m[1], 10);
        const mm = parseInt(m[2], 10) - 1;
        let yy = parseInt(m[3] || String(new Date().getFullYear()), 10);
        if (yy < 100) yy += 2000;
        const hh = parseInt(m[4], 10);
        const mi = parseInt(m[5], 10);
        const ss = parseInt(m[6] || '0', 10);
        return new Date(yy, mm, dd, hh, mi, ss).getTime();
    }

    const d = new Date(s);
    return Number.isFinite(d.getTime()) ? d.getTime() : 0;
}

function _pruneNotificheExpired_(arr) {
    const now = Date.now();
    return (arr || []).filter(function(n) {
        const ts = _parseNotifTsMs_(n && n._ts);
        // Se manca timestamp non eliminiamo per compatibilità con storico vecchio
        if (!ts) return true;
        return (now - ts) <= NOTIF_RETENTION_MS;
    });
}

// === NOTIFICHE UI ===
function apriPopupNotifiche(e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const modal = document.getElementById('modal-notifiche');
    if (!modal) return;
    modal.classList.add('is-open');
    renderNotificheList();
    // Azzera badge immediatamente e segna lette sul server
    aggiornaBadgeNotifiche(0);
    try { localStorage.setItem('_notifBadgeCount', '0'); } catch {}
    if (utenteAttuale && utenteAttuale.nome) {
        fetch(URL_GOOGLE + '?azione=segnaLetteNotifiche&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase())).catch(function(){});
    }
}
function chiudiPopupNotifiche() {
    const modal = document.getElementById('modal-notifiche');
    if (!modal) return;
    modal.classList.remove('is-open');
}
async function rispondiAccessoApp(richiestaId, nome, risposta, btnEl) {
    // Disabilita entrambi i pulsanti mentre si attende la risposta
    const wrap = btnEl ? btnEl.closest('.notif-azioni-accesso') : null;
    if (wrap) {
        wrap.querySelectorAll('button').forEach(function(b) { b.disabled = true; });
        wrap.innerHTML = '<span class="notif-risposta-wait">\u23f3 Invio in corso\u2026</span>';
    }
    try {
        const url = URL_GOOGLE + '?azione=rispondiAccessoFuoriOrario&id=' + encodeURIComponent(richiestaId) + '&ok=' + encodeURIComponent(risposta) + '&json=1';
        const res  = await fetch(url);
        const data = await res.json();
        if (data.status === 'ok') {
            const msg = risposta === 'SI' ? '\u2705 Accesso consentito' : '\ud83d\udeab Accesso negato';
            // Persisti il risultato in localStorage: la prossima apertura del pannello
            // non mostrer\u00e0 pi\u00f9 i pulsanti per questa richiesta
            _segnaAccessoGestito_(richiestaId, msg);
            if (wrap) wrap.innerHTML = '<span class="notif-risposta-ok">' + msg + '</span>';
        } else {
            if (wrap) wrap.innerHTML = '<span class="notif-risposta-err">\u26a0\ufe0f ' + (data.msg || 'Errore') + '</span>';
        }
    } catch (err) {
        if (wrap) wrap.innerHTML = '<span class="notif-risposta-err">\u26a0\ufe0f Errore di rete</span>';
    }
}
function _getAccessiGestiti_() {
    try { return JSON.parse(localStorage.getItem('_accRispIdx_') || '{}'); } catch { return {}; }
}
function _segnaAccessoGestito_(id, msg) {
    try {
        const h = _getAccessiGestiti_();
        h[id] = msg;
        localStorage.setItem('_accRispIdx_', JSON.stringify(h));
    } catch {}
}
async function eliminaNotificaApp(rid, titoloEnc, corpoEnc, btnEl) {
    const titolo = decodeURIComponent(titoloEnc || '');
    const corpo  = decodeURIComponent(corpoEnc || '');
    const rowId  = String(rid || '').trim();
    const card   = btnEl ? btnEl.closest('.notifica-item') : null;

    if (card) {
        card.classList.add('notif-removing');
        await new Promise(function(resolve) { setTimeout(resolve, 190); });
    }
    _rimuoviNotificaInLocale_(rowId, titolo, corpo);
    if (card) card.remove();
    const list = document.getElementById('notifiche-list');
    if (list && !list.querySelector('.notifica-item')) {
        list.innerHTML = _notifHtml_([]);
    }

    try {
        const uname = (utenteAttuale && utenteAttuale.nome) ? utenteAttuale.nome.toUpperCase() : '';
        if (!uname) return;
        const url = URL_GOOGLE
            + '?azione=eliminaNotifica'
            + '&username=' + encodeURIComponent(uname)
            + '&rid=' + encodeURIComponent(rowId)
            + '&titolo=' + encodeURIComponent(titolo)
            + '&corpo=' + encodeURIComponent(corpo);
        const res = await fetch(url);
        const data = await res.json().catch(() => ({}));
        if (data.status !== 'ok' && data.status !== 'not_found') {
            console.warn('[notifiche] eliminaNotifica non ok:', data);
        }
    } catch (err) {
        console.warn('[notifiche] eliminaNotifica errore rete:', err);
    }
}
function _rimuoviNotificaInLocale_(rid, titolo, corpo) {
    try {
        const arr = JSON.parse(localStorage.getItem('_notificheArr') || '[]');
        let removed = false;
        const next = arr.filter(function(n) {
            if (removed) return true;
            const sameRid = rid && String(n.rid || '') === String(rid);
            const sameTxt = String(n.titolo || '') === String(titolo || '') && String(n.corpo || '') === String(corpo || '');
            if (sameRid || sameTxt) {
                removed = true;
                return false;
            }
            return true;
        });
        localStorage.setItem('_notificheArr', JSON.stringify(next));
    } catch {}
}
function _chiudiNotificheOutside(e) { /* dismesso */ }
function aggiornaBadgeNotifiche(count) {
    const badgeDesk = document.getElementById('badge-notifiche-desktop');
    const badgeMob = document.getElementById('badge-notifiche-mobile');
    const badgeMobMenu = document.getElementById('badge-notifiche-mobile-menu');
    if (badgeDesk) {
        badgeDesk.textContent = count > 0 ? count : '';
        badgeDesk.style.display = count > 0 ? 'flex' : 'none';
    }
    if (badgeMob) {
        badgeMob.textContent = count > 0 ? count : '';
        badgeMob.style.display = count > 0 ? 'flex' : 'none';
    }
    if (badgeMobMenu) {
        badgeMobMenu.textContent = count > 0 ? count : '';
        badgeMobMenu.style.display = count > 0 ? 'flex' : 'none';
    }
}
function _notifIcona_(titolo) {
    if (!titolo) return 'fa-bell';
    if (/stato/i.test(titolo))     return 'fa-rotate';
    if (/richiesta|comunic/i.test(titolo)) return 'fa-comment-dots';
    if (/assegnaz/i.test(titolo))  return 'fa-user-check';
    return 'fa-bell';
}
function _escapeHtml_(value) {
    return String(value == null ? '' : value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function _notifHtml_(arr) {
    if (!arr.length) return '<div class="notif-empty"><i class="far fa-bell-slash"></i><p>Nessuna notifica recente</p></div>';
    return arr.map(function(n, idx) {
        const icon   = _notifIcona_(n.titolo || '');
        const titolo = _escapeHtml_(n.titolo || 'Notifica');
        const ridRaw = _escapeHtml_(n.rid || '');
        const titoloEnc = encodeURIComponent(n.titolo || '');
        const corpoEnc  = encodeURIComponent(n.corpo || '');
        const tsVal  = _escapeHtml_(n._ts || '');
        const ts     = tsVal ? `<span class="notifica-ts">${tsVal}</span>` : '';
        // Rilevamento notifica accesso_richiesta (corpo \u00e8 JSON strutturato)
        let corpoHtml = '';
        try {
            const parsed = JSON.parse(n.corpo || '');
            if (parsed && parsed.tipo === 'accesso_richiesta') {
                const rid  = _escapeHtml_(parsed.id   || '');
                const nome = _escapeHtml_(parsed.nome || '');
                // Controlla se Alessio ha gi\u00e0 risposto (persistito in localStorage)
                const gestiti = _getAccessiGestiti_();
                if (gestiti[parsed.id]) {
                    corpoHtml = `<div class="notifica-corpo"><span class="notif-risposta-ok">${_escapeHtml_(gestiti[parsed.id])}</span></div>`;
                } else {
                    corpoHtml = `<div class="notifica-corpo">Vuole entrare fuori orario.</div>
                  <div class="notif-azioni-accesso">
                                        <button class="notif-btn-consenti" onclick="event.stopPropagation(); rispondiAccessoApp('${rid}','${nome}','SI',this)">✅ Consenti</button>
                                        <button class="notif-btn-nega"    onclick="event.stopPropagation(); rispondiAccessoApp('${rid}','${nome}','NO',this)">🚫 Nega</button>
                  </div>`;
                }
            }
        } catch (_) {}
        if (!corpoHtml) {
            corpoHtml = `<div class="notifica-corpo">${_escapeHtml_(n.corpo || '')}</div>`;
        }
                                return `<div class="notifica-item" onclick="apriDettaglioNotifica(${idx})" role="button" tabindex="0">
                    <button class="notif-del-btn" title="Elimina notifica"
                                                onclick="event.stopPropagation(); eliminaNotificaApp('${ridRaw}','${titoloEnc}','${corpoEnc}',this)">×</button>
          <div class="notifica-icon-badge"><i class="fas ${icon}"></i></div>
          <div class="notifica-body">
            <div class="notifica-titolo">${titolo}</div>
            ${corpoHtml}
            ${ts}
          </div>
        </div>`;
    }).join('');
}
function renderNotificheList() {
    const list = document.getElementById('notifiche-list');
    if (!list) return;
    const arr = _pruneNotificheExpired_(JSON.parse(localStorage.getItem('_notificheArr') || '[]'));
    try { localStorage.setItem('_notificheArr', JSON.stringify(arr)); } catch {}
    list.innerHTML = _notifHtml_(arr);
    // Aggiorna dal server lo storico degli ultimi 7 giorni (non marca lette)
    if (utenteAttuale && utenteAttuale.nome) {
        fetch(
            URL_GOOGLE
            + '?azione=getStoricoNotifiche&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase())
            + '&days=' + encodeURIComponent(String(NOTIF_RETENTION_DAYS))
        )
            .then(function(r) { return r.json(); })
            .then(function(d) {
                if (d && d.status === 'ok' && d.all && d.all.length) {
                    _salvaNotificheInLocale_(d.all);
                    list.innerHTML = _notifHtml_(JSON.parse(localStorage.getItem('_notificheArr') || '[]'));
                }
            })
            .catch(function(err) { console.warn('[notifiche] renderNotificheList fetch fallito:', err); });
    }
}

/** Salva nuove notifiche in localStorage (ricevute dal SW postMessage o da fetch) */
function _salvaNotificheInLocale_(all) {
    try {
        const ts = new Date().toLocaleString('it-IT', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});
        const withTs = all.map(function(n) { return Object.assign({}, n, { _ts: n._ts || ts }); });
        const existing = JSON.parse(localStorage.getItem('_notificheArr') || '[]');
        const map = {};
        withTs.forEach(function(n) { map[n.titolo + '||' + n.corpo] = n; });
        existing.forEach(function(n) { const k = n.titolo + '||' + n.corpo; if (!map[k]) map[k] = n; });
        const merged = _pruneNotificheExpired_(Object.values(map)).slice(0, 200);
        localStorage.setItem('_notificheArr', JSON.stringify(merged));
        // Aggiorna badge count SOLO se ci sono notifiche nuove rispetto all'ultima lettura
        const prevCount = parseInt(localStorage.getItem('_notifBadgeCount') || '0');
        if (all.length > prevCount || all.length > 0 && prevCount === 0) {
            localStorage.setItem('_notifBadgeCount', String(all.length));
        }
        aggiornaBadgeNotifiche(parseInt(localStorage.getItem('_notifBadgeCount') || '0'));
    } catch(e) {}
}

function _isPushVisibleUtenteEsente_() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const nome = String(utenteAttuale.nome).toUpperCase().trim();
    return nome === 'ALESSIO' || nome === '0000' || utenteAttuale.ruolo === 'MASTER';
}

function _isOrarioRiepilogoNotifiche_() {
    const now  = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    return mins >= 9 * 60 && mins < 19 * 60 + 30; // 09:00 \u2013 19:30
}

function _mostraToastRiepilogoNotifiche_(count) {
    if (!count || count <= 0) return;
    if (!utenteAttuale || !utenteAttuale.nome) return;
    if (_isPushVisibleUtenteEsente_()) return;
    if (!_isOrarioRiepilogoNotifiche_()) return;
    try {
        const giorno = new Date().toLocaleDateString('it-IT');
        const key = '_notifMorningToast_' + String(utenteAttuale.nome).toUpperCase().trim() + '_' + giorno;
        if (localStorage.getItem(key) === '1') return;
        localStorage.setItem(key, '1');
    } catch(e) {}
    notificaElegante('\ud83d\udd14 Hai ' + count + ' notific' + (count === 1 ? 'a' : 'he') + ' da leggere');
}

/** Inizializza il badge notifiche all'avvio: legge prima da localStorage, poi fetch fresco dal server */
function _initBadgeNotifiche() {
    // Usa _notifBadgeCount (azzerato all'apertura del modal), NON la lunghezza dello storico
    try {
        const count = parseInt(localStorage.getItem('_notifBadgeCount') || '0');
        if (count > 0) aggiornaBadgeNotifiche(count);
    } catch(e) {}
    if (!utenteAttuale || !utenteAttuale.nome) return;
    fetch(URL_GOOGLE + '?azione=getNotifiche&username=' + encodeURIComponent(utenteAttuale.nome.toUpperCase()) + '&markRead=0')
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (d && d.status === 'ok' && d.all && d.all.length) {
                _salvaNotificheInLocale_(d.all);
                _mostraToastRiepilogoNotifiche_(d.all.length);
            }
        })
        .catch(function(err) { console.warn('[notifiche] _initBadgeNotifiche fetch fallito:', err); });
}

function _extractSearchFromNotifica_(n) {
    var titolo = String((n && n.titolo) || '');
    var corpo = String((n && n.corpo) || '');
    var text = (titolo + ' ' + corpo).replace(/\s+/g, ' ').trim();
    if (!text) return '';

    var mOrd = text.match(/\bORD(?:INE)?\.?\s*[:#-]?\s*([A-Z0-9\/-]{2,})/i);
    if (mOrd && mOrd[1]) return String(mOrd[1]).trim();

    // fallback: prende un codice prodotto comune (es. VELOP-35-L)
    var mCod = text.match(/\b([A-Z]{2,}[A-Z0-9]*-[A-Z0-9-]{2,})\b/i);
    if (mCod && mCod[1]) return String(mCod[1]).trim();

    return '';
}

async function apriDettaglioNotifica(idx, forcedQuery) {
    try {
        var query = String(forcedQuery || '').trim();
        if (!query) {
            var arr = JSON.parse(localStorage.getItem('_notificheArr') || '[]');
            var n = arr[Number(idx)];
            if (!n) return;
            query = _extractSearchFromNotifica_(n);
        }
        chiudiPopupNotifiche();

        if (!query) {
            notificaElegante('Nessun riferimento ordine/codice trovato in questa notifica');
            return;
        }

        if (typeof window.cambiaPagina === 'function') {
            await window.cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null);
        }

        setTimeout(function() {
            ['universal-search', 'mobile-search'].forEach(function(id) {
                var el = document.getElementById(id);
                if (!el) return;
                el.value = query;
                el.dispatchEvent(new Event('input'));
            });
            if (typeof window.filtraUniversale === 'function') window.filtraUniversale();
        }, 280);
    } catch (e) {
        console.warn('[notifiche] apriDettaglioNotifica errore:', e);
    }
}

// ── Espone su window le funzioni chiamate da index.html ──
export function registerGlobals() {
    window.apriPopupNotifiche    = apriPopupNotifiche;
    window.chiudiPopupNotifiche  = chiudiPopupNotifiche;
    window.eliminaNotificaApp    = eliminaNotificaApp;
    window.rispondiAccessoApp    = rispondiAccessoApp;
    window.apriDettaglioNotifica = apriDettaglioNotifica;
}

export {
    aggiornaBadgeNotifiche,
    _initBadgeNotifiche,
    _salvaNotificheInLocale_
};
