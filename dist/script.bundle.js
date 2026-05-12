import{a as Ne,b as N,c as Pt}from"./chunk-chunk-VLVTJAKH.js";import{a as W,b as Ps,c as x,d as Me,e as ft,f as y,g,h as z,i as Yi,j as rt,k as Xi,l as gt,m as b,n as kt,o as tn,p as en,q as vt,r as Lt,s as zs,t as Et,u as ct,v as on,w as be}from"./chunk-chunk-NM2LGQZU.js";function ht(t,e){try{let o=localStorage.getItem(t);if(!o)return null;let i=JSON.parse(o);return Date.now()-i.ts<e?i.data:null}catch{return null}}function Z(t,e){try{let o=typeof e=="string"?e:JSON.stringify(e);if(o.length>25e5)return;localStorage.setItem(t,JSON.stringify({ts:Date.now(),data:o}))}catch{}}function U(t){try{localStorage.removeItem(t)}catch{}}function nn(){try{let t=[];for(let e=0;e<localStorage.length;e++){let o=localStorage.key(e);o&&o.startsWith("_html_")&&t.push(o)}t.forEach(e=>localStorage.removeItem(e))}catch{}}var xt=W(()=>{});var H,ot,A,Zt=W(()=>{"use strict";H={},ot={},A={dashBundle:null,dashPromise:null,rqBundle:null,rqPromise:null,matBundle:null,matPromise:null,ordiniBundle:null,ordiniPromise:null}});var Ms,Ns,qs,Ds,Bs,Us,Fs,Hs,js,an,sn,rn=W(()=>{"use strict";Ms="_pushStato",Ns="notifPrefs",qs="mlPipQty",Ds="mlPipCaricato",Bs="mlPipPronti",Us="mlPipMovimenti",Fs="avatarColor_",Hs="avatarColorRecenti_",js="avatarColorHidden_",an=[Ns,Ms,qs,Ds,Us,Bs],sn=[Fs,Hs,js]});function cn(t){No=t.onRemoteChange,qo=t.onUsersOnline,ye=t.getUtenteAttuale,Nt=t.getPaginaCorrente}var No,qo,ye,Nt,ln,M,Qt=W(()=>{be();ft();zs();No=null,qo=null,ye=null,Nt=null;ln={INTERVAL_MS:2e4,INTERVAL_FOCUS_MS:3e4,INTERVAL_BG_MS:3e4,PING_INTERVAL_MS:6e4,MAX_BACKOFF_MS:6e4,_timer:null,_pingTimer:null,_lastRevision:null,_lastCheck:0,_paused:!1,_errorStreak:0,_offPageTick:0,lastRevisionValue:null,lastOnlineList:[],lastCheckTs:0,start:function(){this.stop(),this._lastRevision=null,this._paused=!1,this._errorStreak=0,this._offPageTick=0,this._schedule(document.hidden?this.INTERVAL_BG_MS:this.INTERVAL_FOCUS_MS),this._schedulePing(5e3)},stop:function(){this._timer&&(clearTimeout(this._timer),this._timer=null),this._pingTimer&&(clearTimeout(this._pingTimer),this._pingTimer=null),this._lastRevision=null,this._paused=!1;var t=document.getElementById("online-indicator");t&&t.remove();var e=document.getElementById("online-indicator-mob");e&&e.remove()},pauseFor:function(t){t||(t=5e3),this._paused=!0;var e=this;setTimeout(function(){e._paused=!1},t)},_schedule:function(t){this._timer&&clearTimeout(this._timer);var e=this;this._timer=setTimeout(function(){e._tick()},t)},_tick:function(){var t=this;this._check().finally(function(){var e=Nt?String(Nt()||"").toUpperCase().trim():"",o=e==="PROGRAMMA PRODUZIONE DEL MESE",i=document.hidden?t.INTERVAL_BG_MS:document.hasFocus&&document.hasFocus()?t.INTERVAL_FOCUS_MS:t.INTERVAL_MS;o||(i=Math.max(i,t.INTERVAL_BG_MS));var n=i;if(t._errorStreak>0){var a=Math.min(4,1+t._errorStreak*.5);n=Math.min(t.MAX_BACKOFF_MS,Math.round(i*a))}t._schedule(n)})},_check:async function(){if(!this._paused){var t=Date.now(),e=Nt?String(Nt()||"").toUpperCase().trim():"",o=e==="PROGRAMMA PRODUZIONE DEL MESE";if(!(!o&&(this._offPageTick=(this._offPageTick+1)%3,this._offPageTick!==0)))try{var i=await on();if(!i||i.status!=="ok"){this._errorStreak=Math.min(this._errorStreak+1,10),Lt("poller_check",{action:e||"UNKNOWN_PAGE",status:"invalid_payload",durationMs:Date.now()-t},{sampleRate:.5});return}var n=Number(i.revision);if(this._errorStreak=0,this._lastCheck=Date.now(),this.lastRevisionValue=n,this.lastCheckTs=Date.now(),this._lastRevision===null){this._lastRevision=n,Lt("poller_check",{action:e||"UNKNOWN_PAGE",status:"baseline",durationMs:Date.now()-t},{sampleRate:.3});return}if(n===this._lastRevision){Lt("poller_check",{action:e||"UNKNOWN_PAGE",status:"unchanged",durationMs:Date.now()-t},{sampleRate:.2});return}var a=ye?ye():null,s=a&&a.nome?a.nome.toUpperCase():"",r=i.utente?String(i.utente).toUpperCase():"";if(this._lastRevision=n,r===s)return;var c=i.utente||"Qualcuno";Lt("poller_check",{action:e||"UNKNOWN_PAGE",status:"remote_change",durationMs:Date.now()-t,detail:String(c||"")},{sampleRate:1}),No&&No(c)}catch(l){this._errorStreak=Math.min(this._errorStreak+1,10),Lt("poller_check",{action:e||"UNKNOWN_PAGE",status:"error",durationMs:Date.now()-t,error:l&&l.message?l.message:String(l||"")},{sampleRate:.7}),l&&l.name!=="AbortError"&&console.warn("[RevisionPoller]",l)}}},_schedulePing:function(t){this._pingTimer&&clearTimeout(this._pingTimer);var e=this;this._pingTimer=setTimeout(function(){e._pingServer().finally(function(){e._schedulePing(e.PING_INTERVAL_MS)})},t)},_pingServer:async function(){var t=ye?ye():null;if(!(!t||!t.nome))try{var e=await Et({azione:"ping",pagina:(Nt?Nt():"")||""});e&&e.status==="ok"&&Array.isArray(e.online)&&(qo&&qo(e.online),ln.lastOnlineList=e.online,Lt("poller_ping",{action:"ping",status:"ok",detail:String(e.online.length)},{sampleRate:.3}))}catch(o){Lt("poller_ping",{action:"ping",status:"error",error:o&&o.message?o.message:String(o||"")},{sampleRate:.7})}}},M=ln});function pn(){return"ORDINI_ACQUISTI_"+(b?.nome?.toUpperCase()||"_")}function Bo(){let t=document.getElementById("contenitore-dati");t&&(pt._acq_ordini=t.innerHTML,At._acq_ordini=Date.now(),N.set(pn(),t.innerHTML).catch(()=>{}))}function Zs(){A.ordiniBundle=null,A.ordiniPromise=null}function dn(t,e,o){t.classList.toggle("is-ordinato",o),e.classList.toggle("checked",o),e.title=o?"Segna In Attesa":"Segna Ordinato";let i=e.querySelector("i");i&&(i.className="fas "+(o?"fa-check-circle":"fa-circle"));let n=t.querySelector(".oi-stato-badge");n&&(n.className="oi-stato-badge "+(o?"badge-ordinato-sm":"badge-attesa-sm"),n.innerHTML=o?'<i class="fas fa-circle-check"></i> ORDINATO':"IN ATTESA");let a=t.querySelector(".oi-stato-dot");a&&(a.className="oi-stato-dot "+(o?"dot-ordinato":"dot-attesa"));let s=t.closest(".ordine-group");if(s){let l=s.querySelectorAll(".ordine-item").length,d=s.querySelectorAll(".ordine-item.is-ordinato").length,u=s.querySelector(".og-progress");if(u&&(u.textContent=d+"/"+l),d===l){s.classList.add("all-done");let f=s.querySelector(".og-left");f&&!f.querySelector(".og-done-badge")&&f.insertAdjacentHTML("beforeend",'<span class="og-done-badge"><i class="fas fa-check-circle"></i> Completato</span>')}else{s.classList.remove("all-done");let f=s.querySelector(".og-done-badge");f&&f.remove()}}let r=document.querySelector(".acquisti-subtitle");if(r){let c=document.querySelectorAll(".ordine-item:not(.is-ordinato)").length;r.textContent=c>0?`${c} articoli in attesa`:"Tutto ordinato \u2705"}}function un(t,e){return fetch(x,{method:"POST",body:JSON.stringify({pagina:t}),...e?{signal:e}:{}}).then(o=>{if(!o.ok)throw new Error(`HTTP ${o.status}`);return o.json()})}function Fo(){let t=document.getElementById("acq-tab-catalogo"),e=document.getElementById("acq-tab-ordini"),o=document.getElementById("acq-tab-fornitori");t&&t.classList.toggle("active",dt==="catalogo"),e&&e.classList.toggle("active",dt==="ordini"),o&&o.classList.toggle("active",dt==="fornitori")}function Qs(t){if(t===dt)return;dt=t,window._acquistTabAttivo=t,Fo();let e=document.getElementById("contenitore-dati");if(e){if(t==="fornitori"){typeof window.caricaOrdiniFornitori=="function"&&window.caricaOrdiniFornitori(null,null,!1);return}if(t==="ordini"){let o=pt._acq_ordini,i=At._acq_ordini||0;if(o&&Date.now()-i<3e5){e.innerHTML=o,z(e),window.aggiornaListaFiltrabili?.();return}mn(null,null)}else{let o=pt["MATERIALE DA ORDINARE"],i=At["MATERIALE DA ORDINARE"]||0;if(o&&Date.now()-i<3e5){e.innerHTML=o,z(e),window.aggiornaListaFiltrabili?.();return}let n=ht("_html_MATERIALE DA ORDINARE",3e5);if(n){pt["MATERIALE DA ORDINARE"]=n,At["MATERIALE DA ORDINARE"]=Date.now(),e.innerHTML=n,z(e),window.aggiornaListaFiltrabili?.();return}bt(!1,null,null)}}}async function mn(t=null,e=null){if(we)return;we=!0;let o=document.getElementById("contenitore-dati");if(!o){we=!1;return}let i=b?.nome?.toUpperCase().trim()==="ALESSIO",n=i?"":b?.nome||"",a=pn(),s=!1;try{let r=await N.get(a);if(dt!=="ordini"){we=!1;return}r&&r.dati&&(o.innerHTML=r.dati,pt._acq_ordini=r.dati,At._acq_ordini=Date.now(),z(o),window.aggiornaListaFiltrabili?.(),s=!0)}catch{}if(s||(o.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento ordini...</div>"),!(s&&t!==null))try{let r;if(A.ordiniBundle?(r=A.ordiniBundle,A.ordiniBundle=null,A.ordiniPromise=null):A.ordiniPromise?(r=await A.ordiniPromise,A.ordiniBundle=null,A.ordiniPromise=null):r=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"getOrdiniAcquisti",operatore:n}),...e?{signal:e}:{}})).json(),e?.aborted)return;if(!Array.isArray(r)||r.length===0){o.innerHTML=`<div class='empty-msg'>${i?"Nessun ordine ricevuto.":"Non hai ancora inviato ordini."}</div>`,z(o);return}let c={};r.forEach(f=>{let p=f.id_gruppo||f.data+"_"+f.operatore;c[p]||(c[p]={data:f.data,operatore:f.operatore,items:[]}),c[p].items.push(f)});let l=Object.keys(c).reverse(),d=r.filter(f=>f.stato!=="ORDINATO").length,u=`<div class="ordini-acq-page">
            <div class="acquisti-header header-flex">
                <div>
                    <h3 class="acquisti-title">${i?"Ordini Ricevuti":"I Miei Ordini"}</h3>
                    <p class="acquisti-subtitle">${i?d>0?`${d} articoli in attesa`:"Tutto ordinato \u2705":"Storico ordini inviati"}</p>
                </div>
                ${i?"":`<button class="btn-nuovo-fisso ${qt.btnSuccess}" onclick="_switchAcquistiTab('catalogo')">
                    <i class="fas fa-cart-plus"></i><span class="btn-label-nuovo"> Nuovo ordine</span>
                </button>`}
            </div>
            <div class="ordini-groups">`;if(l.forEach(f=>{let p=c[f],m=p.items.length,h=p.items.filter(v=>v.stato==="ORDINATO").length,w=h===m;u+=`
            <details class="ordine-group ${w?"all-done":""}" ${w?"":"open"}>
                <summary class="ordine-group-summary">
                    <span class="og-left">
                        ${i?`<span class="og-operatore">${y(p.operatore)}</span>`:""}
                        <span class="og-data">${Ys(p.data)}</span>
                        <span class="og-progress">${h}/${m}</span>
                        ${w?'<span class="og-done-badge"><i class="fas fa-check-circle"></i> Completato</span>':""}
                    </span>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </summary>
                <div class="ordine-items">
                    ${p.items.map(v=>Xs(v,i)).join("")}
                </div>
            </details>`}),u+="</div></div>",t!==null&&t!==window._latestNavRequest||dt!=="ordini")return;N.set(a,u).catch(()=>{}),pt._acq_ordini=u,At._acq_ordini=Date.now(),o.innerHTML=u,z(o),window.aggiornaListaFiltrabili?.()}catch(r){if(r.name==="AbortError")return;o.innerHTML="<div class='centered-error-bold'>Errore nel caricamento ordini.</div>"}finally{we=!1}}function Ks(t,e){return t?new Promise(o=>{let i=new Image;i.onload=()=>{let n=Math.min(e/i.width,e/i.height,1),a=Math.round(i.width*n),s=Math.round(i.height*n),r=document.createElement("canvas");r.width=a,r.height=s,r.getContext("2d").drawImage(i,0,0,a,s),o(r.toDataURL("image/jpeg",.72))},i.onerror=()=>o(null),i.src=t}):Promise.resolve(null)}function Ys(t){try{let e=new Date(t);if(isNaN(e))return t;let o=i=>String(i).padStart(2,"0");return`${o(e.getDate())}/${o(e.getMonth()+1)}/${e.getFullYear()} ${o(e.getHours())}:${o(e.getMinutes())}`}catch{return t}}function Xs(t,e){let o=t.stato==="ORDINATO";return`
    <div class="ordine-item ${o?"is-ordinato":""}" id="oi-${t.id_riga}" data-search="${String(t.articolo).toLowerCase()} ${String(t.fornitore).toLowerCase()}">
        ${e?`<button class="oi-check-btn ${o?"checked":""}" onclick="_toggleOrdinato(${t.id_riga}, this)" title="${o?"Segna In Attesa":"Segna Ordinato"}">
                <i class="fas ${o?"fa-check-circle":"fa-circle"}"></i>
               </button>`:`<span class="oi-stato-dot ${o?"dot-ordinato":"dot-attesa"}"></span>`}
        ${t.foto?`<img src="${t.foto}" class="oi-thumb" alt="" loading="lazy">`:""}
        <div class="oi-info">
            <span class="oi-nome">${y(t.articolo)}</span>
            <span class="oi-details">Qt. ${y(String(t.quantita))}${t.fornitore?" \xB7 "+y(t.fornitore):""}</span>
        </div>
        <span class="oi-stato-badge ${o?"badge-ordinato-sm":"badge-attesa-sm"}">${o?'<i class="fas fa-circle-check"></i> ORDINATO':"IN ATTESA"}</span>
    </div>`}async function tr(t,e){let o=document.getElementById("oi-"+t);if(!o||o.dataset.fetching==="1")return;let i=o.classList.contains("is-ordinato"),n=i?"IN ATTESA":"ORDINATO";o.dataset.fetching="1",M.pauseFor(6e3),dn(o,e,!i),Zs(),Bo();try{if((await fetch(x,{method:"POST",body:JSON.stringify({azione:"setArticoloOrdinato",id_riga:t,stato:n})}).then(s=>s.json())).status!=="ok")throw new Error("err");Bo()}catch{dn(o,e,i),Bo(),g("Errore aggiornamento","error")}delete o.dataset.fetching}async function er(){let t=ht("_sezioniMateriali_cache",6e5);if(t)try{let e=typeof t=="string"?JSON.parse(t):t;if(Array.isArray(e)&&e.length>0){J=e;return}}catch{}try{let o=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"getSezioni"})})).json();Array.isArray(o)&&o.length>0&&(J=o,localStorage.setItem("sezioniMateriali",JSON.stringify(J)),Z("_sezioniMateriali_cache",JSON.stringify(J)))}catch(e){console.warn("Sezioni: fallback a localStorage",e)}}async function or(){U("_sezioniMateriali_cache");try{await fetch(x,{method:"POST",body:JSON.stringify({azione:"salvaSezioni",sezioni:J})})}catch(t){console.warn("Impossibile salvare sezioni sul backend",t)}}async function bt(t=!1,e=null,o=null){if(!Do){Do=!0;try{let i=document.getElementById("btn-delete-selected")?.classList.contains("visible");if(t&&i)return;let n=document.getElementById("modal-gestione-articolo");n&&(n.style.display="none"),document.body.style.overflow="auto";let a=document.getElementById("contenitore-dati");if(!a)return;if(!t)try{let s=await N.get("MATERIALE_DA_ORDINARE");if(dt!=="catalogo")return;s&&s.dati&&(a.innerHTML=s.dati,pt["MATERIALE DA ORDINARE"]=s.dati,At["MATERIALE DA ORDINARE"]=Date.now(),z(a),window.aggiornaListaFiltrabili?.(),t=!0)}catch{}if(t&&e!==null)return;t||(a.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento catalogo materiali...</div>",z(a));try{let r=function(u){let f=u.toLowerCase();return/strument|utensil|attrez|chiave|cacciavit|trapan|pinze|martell/.test(f)?"fa-screwdriver-wrench":/bombole|spray|aerosol|vernic|smalto|lacca/.test(f)?"fa-spray-can":/rifiut|spazzatur|scarto|smalt/.test(f)?"fa-trash-can":/pulizia|detersi|detergent|solvente|diluente|sgras/.test(f)?"fa-broom":/nastro|carta|fogli|sacch|busta|plastica/.test(f)?"fa-tape":/scatol|imball|cartone|pacch|box/.test(f)?"fa-box-open":/vite|bullone|dado|chiod|rivett|raccord/.test(f)?"fa-gear":/elettr|cavo|filo|led|presa|batteria/.test(f)?"fa-bolt":/sicurezz|protezione|guant|occhial|mascherina|elmett/.test(f)?"fa-shield-halved":/colori|pigment|tint|inchiostro|pennello/.test(f)?"fa-palette":/tessuto|stoffa|panno|tela|gomma|schiuma/.test(f)?"fa-layer-group":/cibo|aliment|acqua|bevand|coff/.test(f)?"fa-utensils":/ufficio|penna|matita|block|quadern/.test(f)?"fa-pen":/misura|metro|calibro|riga|squadra/.test(f)?"fa-ruler":/prodotto|articol|merce|stock|magazzin/.test(f)?"fa-boxes-stacked":"fa-folder"},s=null;if(A.matBundle?(s=A.matBundle,A.matBundle=null,A.matPromise=null):A.matPromise?(s=await A.matPromise,A.matBundle=null,A.matPromise=null):s=await un("MATERIALE DA ORDINARE",o),s||(s=[]),o?.aborted||(await er(),s.forEach(u=>{let f=(u.SEZIONE||"").trim();f&&!J.includes(f)&&J.push(f)}),o?.aborted))return;if(!s||s.length===0){a.innerHTML="<div class='empty-msg'>Nessun materiale trovato nel catalogo.</div>",z(a);return}let c={};J.forEach(u=>{c[u]=[]}),s.forEach((u,f)=>{let p=(u.SEZIONE||"").trim(),m=J.includes(p)?p:J[0];c[m].push({item:u,gi:f})});let l=`
            <div class="acquisti-header header-flex">
                <div>
                    <h3 class="acquisti-title">Catalogo Materiali</h3>
                    <p class="acquisti-subtitle">Gestisci o ordina i materiali.</p>
                </div>
                <div class="acquisti-actions-wrapper">
                    <button id="btn-delete-selected" type="button" onclick="eliminaSelezionati()" class="${qt.btnDanger} btn-fade-action">
                        <i class="fas fa-trash"></i><span class="btn-elimina-label"> Elimina (<span id="count-selected">0</span>)</span>
                    </button>
                    <button id="btn-mode-select" type="button" onclick="toggleSelezioneMultipla()" class="${qt.btn}">
                        <i class="fas fa-tasks"></i><span class="btn-sel-txt"> Seleziona</span>
                    </button>
                    <button type="button" class="btn-nuovo-fisso btn-sezione-new ${qt.btn}" onclick="apriModalNuovaSezione()" title="Nuova sezione">
                        <i class="fas fa-folder-plus"></i>
                    </button>
                    <button type="button" class="btn-nuovo-fisso ${qt.btnSuccess}" onclick="apriModalNuovo()">
                        <i class="fas fa-plus"></i><span class="btn-label-nuovo"> Nuovo</span>
                    </button>
                </div>
            </div>
            <div id="lista-materiali-grid">`,d=window.innerWidth<=768;if(J.forEach((u,f)=>{let p=c[u]||[],m=r(u);l+=`
                <div class="sezione-materiali-wrapper">
                    <div class="sezione-header" onclick="toggleSezione('sezione-grid-${f}')">
                        <div class="sezione-header-left">
                            <i class="fas ${m} sezione-icon"></i>
                            <span class="sezione-nome">${u}</span>
                            <span class="sezione-count">${p.length}</span>
                        </div>
                        <div class="sezione-header-right">
                            <button type="button" class="btn-sezione-edit" title="Rinomina sezione" onclick="event.stopPropagation(); apriModalRinominaSezione('${u}')"><i class="fas fa-pen"></i></button>
                            <i class="fas fa-chevron-down sezione-arrow"${d?' style="transform:rotate(-90deg)"':""}></i>
                        </div>
                    </div>
                    <div class="sezione-grid materiali-grid" id="sezione-grid-${f}" data-sezione="${u}"${d?' style="display:none"':""}>`,p.length===0&&(l+='<p class="sezione-empty">Nessun articolo. Usa <b>Sezione</b> dal menu \u22EE per spostare qui un articolo.</p>'),p.forEach(({item:h,gi:w})=>{let v=y(h.OGGETTO||"Senza nome"),E=y(h.FORNITORE||"Generico"),C=y(h.CODICE||""),_=`qty-item-${w}`,$=h.id_riga,k=v.replace(/'/g,"\\'").replace(/"/g,"&quot;");l+=`
                <div class="materiale-card ${qt.card}" data-idx="${w}" data-search="${(v+" "+E+" "+C).toLowerCase().replace(/"/g,"")}">
                    <div class="mat-card-img img-preview-container"
                         data-prod="${v}"
                         data-fornitore="${E}"
                         onclick="scattaFoto('${k}')">
                        <i class="fas fa-camera mat-img-icon"></i>
                        <span class="mat-img-hint">Scatta foto</span>
                        <span class="mat-badge-fornitore">${E}</span>
                    </div>
                    <div class="materiale-info">
                        <div class="materiale-nome">${v}</div>
                        ${C?`<div class="materiale-codice">${C}</div>`:""}
                        <div class="materiale-fornitore mat-fornitore-mobile">${E}</div>
                    </div>
                    <div class="materiale-actions">
                        <div class="qty-order-container">
                            <button type="button" class="btn-qty-step" onclick="cambiaQty('${_}', -1)"><i class="fas fa-minus"></i></button>
                            <input type="number" value="1" min="1" id="${_}">
                            <button type="button" class="btn-qty-step" onclick="cambiaQty('${_}', 1)"><i class="fas fa-plus"></i></button>
                        </div>
                        <button type="button" class="btn-add-cart" onclick="aggiungiAlCarrello(\`${v}\`, \`${E}\`, '${_}')" title="Aggiungi al carrello">
                            <i class="fas fa-cart-plus"></i><span class="btn-cart-txt"> Aggiungi</span>
                        </button>
                    </div>
                    <div class="mat-card-opts">
                        <input type="checkbox" class="select-materiale mat-sel-chk" data-id="${$}" onclick="aggiornaConteggioSelezionati()">
                        <button type="button" onclick="toggleMenuOpzioni(event, ${w})" class="btn-opt-trigger">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div id="menu-opzioni-${w}" class="menu-popup-opzioni">
                            <button type="button" class="menu-item-opt" onclick="apriModalModifica('${$}', \`${v}\`, \`${E}\`, \`${C}\`)"><i class="fas fa-edit"></i> Modifica</button>
                            <button type="button" class="menu-item-opt" onclick="duplicaArticolo('${$}', \`${v}\`, \`${E}\`, \`${C}\`)"><i class="fas fa-copy"></i> Duplica</button>
                            <button type="button" class="menu-item-opt" onclick="apriModalSpostaSezione('${$}')"><i class="fas fa-folder-open"></i> Sezione</button>
                            <button type="button" class="menu-item-opt btn-menu-elimina-foto" style="display:none" onclick="resetFoto('${k}')"><i class="fas fa-image"></i> Elimina foto</button>
                            <button type="button" class="menu-item-opt text-danger" onclick="eliminaArticolo('${$}')"><i class="fas fa-trash"></i> Elimina</button>
                        </div>
                    </div>
                </div>`}),l+=`
                    </div>
                </div>`}),l+="</div>",e!==null&&e!==window._latestNavRequest||dt!=="catalogo")return;N.set("MATERIALE_DA_ORDINARE",l).catch(()=>{}),pt["MATERIALE DA ORDINARE"]=l,At["MATERIALE DA ORDINARE"]=Date.now(),Z("_html_MATERIALE DA ORDINARE",l),a.innerHTML=l,z(a),window.aggiornaListaFiltrabili?.()}catch(s){if(s.name==="AbortError")return;console.error("Errore caricamento materiali:",s),a&&(a.innerHTML="<div class='centered-error-bold'>Errore nel caricamento del catalogo.</div>",z(a))}}finally{Do=!1}}}function ir(t,e){let o=document.getElementById(t);o&&(o.value=Math.max(1,(parseInt(o.value)||1)+e))}function nr(t,e,o){let i=document.getElementById(o),n=parseInt(i.value)||1,a=document.querySelector(`[data-prod="${t}"]`),s=a?a.querySelector("img"):null,r=s?s.src:null;It.push({prodotto:t,quantita:n,fornitore:e,foto:r}),qe();let c=event.target.closest("button"),l=c.innerHTML;c.innerHTML='<i class="fas fa-check"></i>',c.style.background="linear-gradient(135deg,#059669,#10b981)",c.style.boxShadow="0 2px 8px rgba(16,185,129,0.45)",setTimeout(()=>{c.innerHTML=l,c.style.background="",c.style.boxShadow="",i.value=1},1400)}function Ho(){let t=document.getElementById("modal-carrello"),e=document.getElementById("lista-articoli-carrello"),o=document.getElementById("btn-invia-alessio");It.length===0?(e.innerHTML="<p class='empty-cart-msg'>Il tuo carrello \xE8 vuoto.</p>",o&&(o.style.display="none")):(e.innerHTML=It.map((i,n)=>`
            <div class="cart-item-row">
                ${i.foto?`<img src="${y(i.foto)}" class="cart-item-photo">`:'<div class="cart-item-placeholder"><i class="fas fa-shopping-basket cart-item-icon"></i></div>'}
                <div class="flex-grow">
                    <div class="cart-item-name">${y(i.prodotto)}</div>
                    <div class="cart-item-details">Qt: ${y(String(i.quantita))} - ${y(i.fornitore)}</div>
                </div>
                <button onclick="rimuoviDalCarrello(${n})" class="btn-inline-trash"><i class="fas fa-trash"></i></button>
            </div>`).join(""),o&&(o.style.display="block")),t.style.display="flex",requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add("cart-open")))}function ar(t){It.splice(t,1),qe(),Ho()}function fn(){let t=document.getElementById("modal-carrello");t.classList.remove("cart-open"),setTimeout(()=>{t.style.display="none"},300)}function sr(){Ho()}function qe(){let t=It.length,e=document.getElementById("badge-carrello-count"),o=document.getElementById("cart-qty-val");e&&(e.innerText=t,e.style.display=t>0?"flex":"none"),o&&(o.innerText=t)}async function rr(){if(It.length===0){alert("Il carrello \xE8 vuoto!");return}if(!confirm(`Vuoi inviare la lista di ${It.length} articoli all'ufficio acquisti?`))return;M.pauseFor(6e3);let e=document.getElementById("btn-invia-alessio");e&&(e.disabled=!0,e.innerText="Invio in corso...");let o=String(Date.now());try{let i=await Promise.all(It.map(async r=>({...r,foto:await Ks(r.foto,80)}))),n={azione:"inviaOrdineAcquisti",operatore:b?.nome||"Utente",id_gruppo:o,articoli:i},s=await(await fetch(x,{method:"POST",body:JSON.stringify(n)})).json();if(s.status==="success")It=[],qe(),fn(),g("\u2705 Ordine inviato ad Alessio!"),delete pt._acq_ordini,delete At._acq_ordini,U("_html__acq_ordini"),dt="ordini",window._acquistTabAttivo="ordini",setTimeout(()=>window.cambiaPagina?.("MATERIALE DA ORDINARE",null),800);else throw new Error(s.message)}catch(i){g("Errore invio ordine: "+i.message,"error")}finally{e&&(e.disabled=!1,e.innerText="Invia ad Alessio")}}function cr(t){let e=`[data-prod="${t.replace(/"/g,'\\"')}"]`,o=document.querySelector(e);if(!o)return;if(o.querySelector("img")){gn(o.querySelector("img").src);return}let i=document.createElement("input");i.type="file",i.accept="image/*",i.onchange=n=>{let a=n.target.files[0];if(!a)return;let s=new FileReader;s.onload=r=>{let c=r.target.result,l=o.getAttribute("data-fornitore")||"";o.innerHTML=`
                <img src="${y(c)}"
                     class="modal-img"
                     onclick="event.stopPropagation(); apriImmagineIntera(this.src)">
                ${l?`<span class="mat-badge-fornitore">${y(l)}</span>`:""}`,o.style.border="";let d=o.closest(".materiale-card");if(d){let u=d.querySelector(".btn-menu-elimina-foto");u&&(u.style.display="")}},s.readAsDataURL(a)},i.click()}function lr(t){if(confirm("Vuoi rimuovere l'immagine da questo prodotto?")){let e=document.querySelector(`[data-prod="${t}"]`);if(!e)return;let o=e.getAttribute("data-fornitore")||"";e.innerHTML=`
            <i class="fas fa-camera mat-img-icon"></i>
            <span class="mat-img-hint">Scatta foto</span>
            ${o?`<span class="mat-badge-fornitore">${y(o)}</span>`:""}`,e.style.border="";let i=e.closest(".materiale-card");if(i){let n=i.querySelector(".btn-menu-elimina-foto");n&&(n.style.display="none")}}}function gn(t){let e=document.createElement("div");e.style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:200000;display:flex;justify-content:center;align-items:center;cursor:zoom-out;";let o=document.createElement("img");o.src=t,o.className="overlay-img",e.appendChild(o),e.onclick=()=>document.body.removeChild(e),document.body.appendChild(e)}function dr(t,e){t.preventDefault(),t.stopPropagation(),document.querySelectorAll(".menu-popup-opzioni").forEach(i=>{i.id!==`menu-opzioni-${e}`&&i.classList.remove("open")});let o=document.getElementById(`menu-opzioni-${e}`);o&&o.classList.toggle("open")}function pr(){document.getElementById("titolo-modal-articolo").innerText="Nuovo Articolo",document.getElementById("edit-id-riga").value="",document.getElementById("edit-nome").value="",document.getElementById("edit-codice").value="",document.getElementById("edit-fornitore").value="";let t=document.getElementById("modal-gestione-articolo");t.style.display="flex",t.offsetHeight,t.classList.add("active"),hn(),setTimeout(()=>{document.getElementById("edit-nome")?.focus()},180)}function ur(t,e,o,i){let n=document.getElementById("modal-gestione-articolo");document.getElementById("titolo-modal-articolo").innerText=t?"Modifica Articolo":"Nuovo Articolo",document.getElementById("edit-id-riga").value=t||"",document.getElementById("edit-nome").value=e||"",document.getElementById("edit-codice").value=i&&i!=="undefined"?i:"",document.getElementById("edit-fornitore").value=o||"",n.style.display="flex",n.offsetHeight,n.classList.add("active"),hn()}function vn(){let t=document.getElementById("modal-gestione-articolo");t.classList.remove("active"),bn(),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300)}function hn(){window.visualViewport&&(bn(),Dt=function(){let t=document.getElementById("modal-gestione-articolo");if(!t||t.style.display==="none")return;let e=window.visualViewport,o=Math.max(0,window.innerHeight-e.offsetTop-e.height),i=t.querySelector(".modal-articoli-box");i&&(i.style.marginBottom=o>0?o+"px":""),t.style.top=e.offsetTop+"px",t.style.height=e.height+"px"},window.visualViewport.addEventListener("resize",Dt),window.visualViewport.addEventListener("scroll",Dt))}function bn(){if(!window.visualViewport||!Dt)return;window.visualViewport.removeEventListener("resize",Dt),window.visualViewport.removeEventListener("scroll",Dt),Dt=null;let t=document.getElementById("modal-gestione-articolo");if(!t)return;t.style.top="",t.style.height="";let e=t.querySelector(".modal-articoli-box");e&&(e.style.marginBottom="")}async function mr(){let t=document.getElementById("btn-salva-articolo"),e=document.getElementById("edit-nome").value.trim();if(!e){g("Inserisci il nome del prodotto!","warning");return}t.textContent="Salvataggio...",t.disabled=!0,M.pauseFor(8e3);try{let o=await ct({azione:"gestisciMateriale",id_riga:document.getElementById("edit-id-riga").value,nome:e,codice:document.getElementById("edit-codice").value,fornitore:document.getElementById("edit-fornitore").value},1e4,{noDedupe:!0});if(o&&o.status==="auth_error"){window._gestisciAuthError_?.(o.message);return}if(o&&o.status==="forbidden"){g(o.message||"Non hai i permessi per questa operazione.","error");return}o&&o.status==="success"?(vn(),bt(!0)):g("Errore durante il salvataggio.","error")}catch(o){g(o?.name==="TimeoutError"?"Timeout: il server non risponde. Riprova.":"Errore di rete. Riprova.","error")}finally{t.textContent="Salva",t.disabled=!1}}async function fr(t,e,o,i){rt("Duplica Articolo",`Duplicare l'articolo: "${e}"?`,async()=>{M.pauseFor(6e3);let n=document.querySelector(`[data-id="${t}"]`).closest(".materiale-card"),a=Date.now(),s=`qty-item-temp-${a}`,r=document.createElement("div");r.innerHTML=`
            <div class="materiale-card ${qt.card}">
                <div class="mat-card-img img-preview-container"
                     data-prod="${y(e)}" data-fornitore="${y(o)}"
                     onclick="scattaFoto('${e.replace(/'/g,"\\'")}')">
                    <i class="fas fa-camera mat-img-icon"></i>
                    <span class="mat-img-hint">Scatta foto</span>
                    <span class="mat-badge-fornitore">${y(o)}</span>
                </div>
                <div class="materiale-info">
                    <div class="materiale-nome">${y(e)}</div>
                    ${i?`<div class="materiale-codice">${y(i)}</div>`:""}
                    <div class="materiale-fornitore mat-fornitore-mobile">${y(o)}</div>
                </div>
                <div class="materiale-actions">
                    <div class="qty-order-container">
                        <button type="button" class="btn-qty-step" onclick="cambiaQty('${s}', -1)"><i class="fas fa-minus"></i></button>
                        <input type="number" value="1" min="1" id="${s}">
                        <button type="button" class="btn-qty-step" onclick="cambiaQty('${s}', 1)"><i class="fas fa-plus"></i></button>
                    </div>
                    <button type="button" class="btn-add-cart" onclick="aggiungiAlCarrello(\`${e}\`, \`${o}\`, '${s}')" title="Aggiungi al carrello">
                        <i class="fas fa-cart-plus"></i><span class="btn-cart-txt"> Aggiungi</span>
                    </button>
                </div>
                <div class="mat-card-opts">
                    <input type="checkbox" class="select-materiale mat-sel-chk" data-id="temp" onclick="aggiornaConteggioSelezionati()">
                    <button type="button" class="btn-opt-trigger" onclick="toggleMenuOpzioni(event, 'temp-${a}')">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div id="menu-opzioni-temp-${a}" class="menu-popup-opzioni">
                        <button type="button" class="menu-item-opt" onclick="apriModalModifica('', \`${e}\`, \`${o}\`, \`${i}\`)">
                            <i class="fas fa-edit"></i> Modifica
                        </button>
                        <button type="button" class="menu-item-opt" onclick="duplicaArticolo('temp', \`${e}\`, \`${o}\`, \`${i}\`)">
                            <i class="fas fa-copy"></i> Duplica
                        </button>
                        <button type="button" class="menu-item-opt btn-menu-elimina-foto" style="display:none" onclick="resetFoto('${e.replace(/'/g,"\\'")}')">
                            <i class="fas fa-image"></i> Elimina foto
                        </button>
                        <button type="button" class="menu-item-opt text-danger" onclick="this.closest('.materiale-card').remove()">
                            <i class="fas fa-trash"></i> Elimina
                        </button>
                    </div>
                </div>
            </div>`;let c=r.firstElementChild;c.style.opacity="0",c.style.transform="translateY(-10px)",n.after(c),requestAnimationFrame(()=>{c.style.transition="opacity 0.3s, transform 0.3s",c.style.opacity="1",c.style.transform="translateY(0)"});try{let l=await ct({azione:"duplicaMateriale",id_riga:t,nome:e,codice:i,fornitore:o},1e4,{noDedupe:!0});if(l&&l.status==="auth_error"){window._gestisciAuthError_?.(l.message);return}if(l&&l.status==="forbidden"){c.remove(),g(l.message||"Non hai i permessi.","error");return}l&&l.status==="success"?bt(!0):(c.style.border="1px solid red",g("Errore di sincronizzazione.","error"))}catch(l){c.style.border="1px solid red",g(l?.name==="TimeoutError"?"Timeout: il server non risponde.":"Errore di rete.","error")}},"Duplica")}function gr(t){let e=document.getElementById(t);if(!e)return;let o=e.style.display!=="none";e.style.display=o?"none":"";let n=e.closest(".sezione-materiali-wrapper")?.querySelector(".sezione-arrow");n&&(n.style.transform=o?"rotate(-90deg)":"")}function vr(t){document.querySelectorAll(".menu-popup-opzioni.open").forEach(i=>i.classList.remove("open"));let e=document.getElementById("sposta-sezione-select");e.innerHTML=J.map(i=>`<option value="${y(i)}">${y(i)}</option>`).join(""),document.getElementById("sposta-id-riga").value=t;let o=document.getElementById("modal-sposta-sezione");o.style.display="flex",o.offsetHeight,o.classList.add("active")}function yn(){let t=document.getElementById("modal-sposta-sezione");t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300)}async function hr(){let t=document.getElementById("sposta-id-riga").value,e=document.getElementById("sposta-sezione-select").value;yn(),M.pauseFor(6e3);try{await fetch(x,{method:"POST",body:JSON.stringify({azione:"spostaSezione",id_riga:t,sezione:e})}),delete pt["MATERIALE DA ORDINARE"],U("_html_MATERIALE DA ORDINARE"),bt(!1)}catch{g("Errore durante lo spostamento.","error")}}function br(t){document.getElementById("rinomina-sezione-nome").value=t,document.getElementById("rinomina-sezione-vecchio").value=t;let e=document.getElementById("modal-rinomina-sezione");e.style.display="flex",e.offsetHeight,e.classList.add("active"),setTimeout(()=>{let o=document.getElementById("rinomina-sezione-nome");o&&(o.focus(),o.select())},100)}function Uo(){let t=document.getElementById("modal-rinomina-sezione");t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300)}async function yr(){let t=document.getElementById("rinomina-sezione-nome").value.trim(),e=document.getElementById("rinomina-sezione-vecchio").value;if(!t||t===e){Uo();return}if(J.includes(t)){g("Esiste gi\xE0 una sezione con questo nome.","error");return}Uo(),M.pauseFor(6e3),J=J.map(o=>o===e?t:o),localStorage.setItem("sezioniMateriali",JSON.stringify(J));try{await fetch(x,{method:"POST",body:JSON.stringify({azione:"rinominaSezione",vecchioNome:e,nuovoNome:t})}),delete pt["MATERIALE DA ORDINARE"],U("_html_MATERIALE DA ORDINARE"),bt(!1),g(`Sezione rinominata in "${t}"`,"success")}catch{g("Errore durante il salvataggio.","error")}}function wr(){document.getElementById("nuova-sezione-nome").value="";let t=document.getElementById("modal-nuova-sezione");t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>document.getElementById("nuova-sezione-nome")?.focus(),100)}function wn(){let t=document.getElementById("modal-nuova-sezione");t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300)}function Sr(){let t=document.getElementById("nuova-sezione-nome").value.trim();t&&(J.includes(t)||(J=[...J,t],localStorage.setItem("sezioniMateriali",JSON.stringify(J)),or()),wn(),delete pt["MATERIALE DA ORDINARE"],U("_html_MATERIALE DA ORDINARE"),bt(!1))}function _r(){let t=document.getElementById("lista-materiali-grid"),e=document.getElementById("btn-delete-selected"),o=document.getElementById("btn-mode-select");if(!t)return;let i=t.classList.toggle("grid-sel-mode");t.querySelectorAll(".mat-sel-chk").forEach(a=>{a.checked=!1}),e&&e.classList.remove("visible"),o&&(o.innerHTML=i?'<i class="fas fa-times"></i> <span class="btn-txt">Annulla</span>':'<i class="fas fa-tasks"></i> <span class="btn-txt">Seleziona</span>');let n=document.getElementById("count-selected");n&&(n.innerText="0")}function Er(){let t=document.querySelectorAll(".mat-sel-chk:checked").length,e=document.getElementById("btn-delete-selected");document.getElementById("count-selected").innerText=t,t>0?e.classList.add("visible"):e.classList.remove("visible")}async function xr(t){rt("Elimina Articolo","Eliminare definitivamente questo articolo dal catalogo?",async()=>{M.pauseFor(6e3);let e=document.querySelector(`[data-id="${t}"]`).closest(".materiale-card");e.style.transition="all 0.3s ease",e.style.transform="scale(0.8)",e.style.opacity="0",setTimeout(()=>e.style.display="none",300);try{let o=await ct({azione:"eliminaMateriale",id_riga:t},1e4,{noDedupe:!0});if(o&&o.status==="auth_error"){window._gestisciAuthError_?.(o.message);return}if(o&&o.status==="forbidden"){e.style.display="flex",e.style.opacity="1",e.style.transform="",g(o.message||"Non hai i permessi.","error");return}if(o&&o.status!=="success")throw new Error;bt(!0)}catch(o){e.style.display="flex",e.style.opacity="1",e.style.transform="",g(o?.name==="TimeoutError"?"Timeout: il server non risponde.":"Errore durante l'eliminazione.","error")}},"Elimina")}async function Ir(){let t=document.querySelectorAll(".mat-sel-chk:checked"),e=Array.from(t).map(o=>o.getAttribute("data-id")).filter(o=>o&&o!=="temp"&&o!=="null");if(e.length===0){alert("Nessun articolo valido selezionato. Attendi il salvataggio dei nuovi duplicati prima di eliminarli.");return}if(confirm(`Sei sicuro di voler eliminare ${e.length} articoli?`))try{t.forEach(i=>{let n=i.closest(".materiale-card");n&&(n.style.opacity="0.3",n.style.pointerEvents="none")});let o=await ct({azione:"eliminaMateriale",id_riga:e},1e4,{noDedupe:!0});if(o&&o.status==="auth_error"){window._gestisciAuthError_?.(o.message);return}if(o&&o.status==="forbidden"){g(o.message||"Non hai i permessi.","error"),bt(!0);return}if(o&&o.status==="success"){g("Articoli eliminati con successo");let i=document.getElementById("btn-delete-selected");i&&i.classList.remove("visible"),bt(!1)}else throw new Error(o&&o.message)}catch(o){alert("Errore durante l'eliminazione multipla: "+o.message),bt(!0)}}async function Se(t=null,e=null,o=null,i=!1){if(t!==null&&(dt=t,window._acquistTabAttivo=t),Fo(),dt==="fornitori"){await window.caricaOrdiniFornitori?.(e,o,i);return}dt==="ordini"?await mn(e,o):await bt(i,e,o)}function Sn(){window.caricaAcquisti=Se,window._switchAcquistiTab=Qs,window._aggiornaTabAcquisti=Fo,window._toggleOrdinato=tr,window.aggiornaBadgeCarrello=qe,window.apriModalCarrello=sr,window.chiudiModalCarrello=fn,window.rimuoviDalCarrello=ar,window.toggleMostraCarrello=Ho,window.inviaOrdineAcquisti=rr,window.cambiaQty=ir,window.aggiungiAlCarrello=nr,window.scattaFoto=cr,window.resetFoto=lr,window.apriImmagineIntera=gn,window.toggleMenuOpzioni=dr,window.apriModalNuovo=pr,window.apriModalModifica=ur,window.chiudiModalArticolo=vn,window.salvaArticolo=mr,window.duplicaArticolo=fr,window.toggleSezione=gr,window.apriModalSpostaSezione=vr,window.chiudiModalSpostaSezione=yn,window.confermaSpostaSezione=hr,window.apriModalRinominaSezione=br,window.chiudiModalRinominaSezione=Uo,window.confermaRinominaSezione=yr,window.apriModalNuovaSezione=wr,window.chiudiModalNuovaSezione=wn,window.confermaNuovaSezione=Sr,window.toggleSelezioneMultipla=_r,window.aggiornaConteggioSelezionati=Er,window.eliminaArticolo=xr,window.eliminaSelezionati=Ir,window.fetchJson=un}var It,dt,J,Dt,pt,At,we,Do,qt,_n=W(()=>{ft();vt();gt();Qt();be();xt();Zt();Pt();It=[],dt="catalogo";window._acquistTabAttivo="catalogo";J=JSON.parse(localStorage.getItem("sezioniMateriali")||'["Strumenti","Bombolette","Rifiuti"]'),Dt=null,pt={},At={},we=!1,Do=!1;qt={card:"bg-white/90 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow",cardGrid:"grid gap-3",label:"text-[10px] uppercase tracking-wide text-slate-500 font-semibold",value:"text-slate-900 font-semibold",btn:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] transition",btnPrimary:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.99] transition",btnSuccess:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.99] transition",btnWarning:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 active:scale-[0.99] transition",btnDanger:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.99] transition",btnPrimaryLg:"inline-flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] transition shadow-sm",pill:"inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600"};document.addEventListener("click",()=>{document.querySelectorAll(".menu-popup-opzioni.open").forEach(t=>t.classList.remove("open"))})});function xn(){return window.listaStatiFornitori&&window.listaStatiFornitori.length?window.listaStatiFornitori:En}function Ar(t){let o=xn().find(i=>(i.stato||i.nome||"").toUpperCase()===(t||"").toUpperCase());return o&&o.colore||"#94a3b8"}async function In(t){let e=await ct({azione:"getListaDiCarico"},1e4,{signal:t,retries:1});if(!e||e.status!=="ok")throw new Error(e?.msg||"Errore caricamento");return e.righe||[]}function An(t){if(!t||t.length===0)return`<div class="centered-msg" style="padding:40px 20px;text-align:center;color:#64748b">
            <i class="fas fa-truck" style="font-size:2rem;margin-bottom:12px;display:block;opacity:.4"></i>
            Nessun ordine fornitore caricato.<br>
            <span style="font-size:.85rem">Carica un CSV "Lista di Carico" dalle Impostazioni.</span>
        </div>`;let e={};t.forEach(p=>{let m=p.n_ordine||"N.D.";e[m]||(e[m]=[]),e[m].push(p)});let o=[],i=[];Object.keys(e).forEach(p=>{e[p].some(h=>h.review_missing)?o.push(p):i.push(p)});let n=p=>p.sort((m,h)=>{let w=(e[m][0].fornitore||"").toUpperCase(),v=(e[h][0].fornitore||"").toUpperCase();return w<v?-1:w>v?1:m<h?-1:m>h?1:0});n(o),n(i);let a=[...o,...i],s=t.length,r=a.length,c=t.reduce((p,m)=>p+m.qta_evasa,0),l=t.reduce((p,m)=>p+m.quantita,0),d=l>0?Math.round(c/l*100):0,u=o.length,f=`<div class="acquisti-header header-flex">
        <div>
            <h3 class="acquisti-title">Ordini Fornitori</h3>
            <p class="acquisti-subtitle">${r} ordini \xB7 ${s} articoli \xB7 ${d}% evaso${u>0?` \xB7 <span style="color:#d97706;font-weight:600">\u26A0 ${u} da revisionare</span>`:""}</p>
        </div>
    </div>`;return o.length>0&&(f+=`<div class="of-review-banner">
            <i class="fas fa-exclamation-triangle"></i>
            <span><strong>${o.length} ordini</strong> non presenti nell'ultimo CSV caricato \u2014 verificali e archiviali se non pi\xF9 necessari.</span>
        </div>`),a.forEach(p=>{let m=e[p],h=m[0].fornitore||"-",w=m[0].data_consegna||"-",v=m.reduce((I,T)=>I+T.quantita,0),E=m.reduce((I,T)=>I+T.qta_evasa,0),C=v>0?Math.round(E/v*100):0,_=C===100?"#22c55e":C>0?"#f59e0b":"#e2e8f0",$=p.length>14?p.substring(0,14)+"\u2026":p,k=m.some(I=>I.review_missing),R=y(p),O=m[0].stato||En[0].stato,q=Ar(O),G=xn().map(I=>{let T=I.stato||I.nome||"",B=I.colore||"#94a3b8",Y=T.toUpperCase()===O.toUpperCase(),st=Y?" is-selected":"",L=Y?'<i class="fas fa-check stato-check-icon"></i>':"";return`<button type="button" class="stato-option${st}" onclick="event.stopPropagation(); _selezionaStatoOF(this,'${R}','${y(T)}','${B}')"><span class="stato-opt-dot" style="background:${B}"></span><span>${y(T)}</span>${L}</button>`}).join(""),mt=k?" of-ordine-missing":"",at=k?'<span class="of-badge-missing"><i class="fas fa-exclamation-triangle"></i> Da revisionare</span>':"",P=`<button class="of-btn-archivia${k?"":" of-btn-archivia-quieta"}" onclick="event.stopPropagation(); _archiviaOrdineOF('${y(p)}')" title="Archivia ordine"><i class="fas fa-archive"></i>${k?" Archivia":""}</button>`;f+=`<div class="ordine-wrapper of-ordine-wrapper${mt}" data-nordine="${R}">
            <div class="riga-ordine of-riga-ordine" onclick="toggleAccordion(this)">
                <div class="flex-grow of-header-left">
                    <span class="order-title"><i class="fas fa-truck" style="font-size:.75rem;opacity:.5;margin-right:6px"></i>${y(h)}</span>
                    ${at}
                </div>
                <div class="order-info">
                    <div class="badge-count"><span class="badge-ord-num">${y($)}</span><span class="badge-sep">\xB7</span>${m.length} ART.</div>
                    <span class="of-data-badge" title="Data consegna"><i class="far fa-calendar-alt"></i> ${y(w)}</span>
                    <div class="of-progress-mini" title="${C}% evaso">
                        <div class="of-progress-bar" style="width:${C}%;background:${_}"></div>
                    </div>
                    <div class="stato-dropdown stato-dropdown-ord" data-nordine="${R}">
                        <button type="button" class="stato-trigger" onclick="event.stopPropagation(); _toggleStatoDropdownOF(this)" title="Cambia stato">
                            <span class="stato-dot" style="background:${q}"></span>
                            <span class="stato-label-txt">${y(O)}</span>
                            <i class="fas fa-chevron-down stato-chevron"></i>
                        </button>
                        <div class="stato-popup">${G}</div>
                    </div>
                    ${P}
                    <i class="fas fa-chevron-down dettagli-chevron"></i>
                </div>
            </div>
            <div class="dettagli-container" style="display:none">
                ${m.map(I=>Cr(I)).join("")}
            </div>
        </div>`}),f}function Cr(t){let e=y(t.codice||"-"),o=y(kr(t.prodotto,60)),i=y(t.prodotto||"-"),n=y(t.fornitore||"-"),a=y(t.n_ordine||"-"),s=y(t.data_consegna||"-"),r=t.quantita||0,c=t.qta_evasa||0,l=t.qta_da_consegnare||0,d=Lr(t.importo),u=b?.nome?.toUpperCase().trim()==="ALESSIO",f=r>0?Math.round(c/r*100):0,p=f===100?"#22c55e":f>0?"#f59e0b":"#94a3b8",m=`data-codice="${e}" data-prodotto="${i}" data-fornitore="${n}" data-ordine="${a}" data-data="${s}" data-qty="${r}" data-evasa="${c}" data-daconsegnare="${l}"${u?` data-importo="${d}"`:""}`;return`<div class="item-card of-item-card${u?"":" of-item-card-no-importo"}" onclick="_apriDettaglioOF(this)" ${m}>
        <div><span class="label-sm">Codice</span><b>${e}</b></div>
        <div class="of-cell-prodotto"><span class="label-sm">Prodotto</span><span class="of-prodotto-text">${o}</span></div>
        <div><span class="label-sm">Ordinata</span><b>${r}</b></div>
        <div><span class="label-sm">Evasa</span><b style="color:${p}">${c}</b></div>
        <div><span class="label-sm">Da consegnare</span><b>${l}</b></div>
        ${u?`<div class="of-cell-importo"><span class="label-sm">Importo</span><b style="color:#3b82f6">${d}</b></div>`:""}
    </div>`}function Or(t){let e=document.getElementById("modal-of-dettaglio");e&&e.remove();let o=t.dataset,i=document.createElement("div");i.id="modal-of-dettaglio",i.className="modal-overlay active",i.onclick=n=>{n.target===i&&Cn()},i.innerHTML=`<div class="modal-content of-modal-content">
        <h2 style="margin:0 0 16px 0;font-size:1.1rem;display:flex;align-items:center;gap:8px">
            <i class="fas fa-box-open" style="color:#3b82f6"></i> Dettaglio Articolo
        </h2>
        <div class="of-modal-grid">
            <div class="of-modal-field">
                <span class="of-modal-label">Codice</span>
                <span class="of-modal-value"><b>${o.codice}</b></span>
            </div>
            <div class="of-modal-field of-modal-field-wide">
                <span class="of-modal-label">Prodotto</span>
                <span class="of-modal-value">${o.prodotto}</span>
            </div>
            <div class="of-modal-field">
                <span class="of-modal-label">Fornitore</span>
                <span class="of-modal-value">${o.fornitore}</span>
            </div>
            <div class="of-modal-field">
                <span class="of-modal-label">N. Ordine</span>
                <span class="of-modal-value">${o.ordine}</span>
            </div>
            <div class="of-modal-field">
                <span class="of-modal-label">Data Consegna</span>
                <span class="of-modal-value">${o.data||"-"}</span>
            </div>
            <div class="of-modal-sep"></div>
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Quantit\xE0 Ordinata</span>
                <span class="of-modal-value of-modal-big">${o.qty}</span>
            </div>
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Quantit\xE0 Evasa</span>
                <span class="of-modal-value of-modal-big" style="color:#22c55e">${o.evasa}</span>
            </div>
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Da Consegnare</span>
                <span class="of-modal-value of-modal-big" style="color:#f59e0b">${o.daconsegnare}</span>
            </div>
            ${b?.nome?.toUpperCase().trim()==="ALESSIO"?`
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Importo</span>
                <span class="of-modal-value of-modal-big">${o.importo}</span>
            </div>`:""}
        </div>
        <div style="text-align:right;margin-top:18px">
            <button class="btn-modal-cancel" onclick="_chiudiDettaglioOF()">Chiudi</button>
        </div>
    </div>`,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("active"))}function Cn(){let t=document.getElementById("modal-of-dettaglio");t&&(t.classList.remove("active"),setTimeout(()=>t.remove(),200))}function $r(t){let e=t.closest(".stato-dropdown"),o=e.classList.contains("open");if(document.querySelectorAll(".of-ordine-wrapper .stato-dropdown.open").forEach(i=>{i.classList.remove("open");let n=i.closest(".riga-ordine");n&&n.classList.remove("stato-aperto-ord")}),!o){e.classList.add("open");let i=e.closest(".riga-ordine");i&&i.classList.add("stato-aperto-ord")}}function Tr(t,e,o,i){let n=t.closest(".stato-dropdown"),a=n.querySelector(".stato-dot"),s=n.querySelector(".stato-label-txt");a&&(a.style.background=i),s&&(s.textContent=o),n.querySelectorAll(".stato-option").forEach(l=>{l.classList.remove("is-selected");let d=l.querySelector(".stato-check-icon");d&&d.remove()}),t.classList.add("is-selected");let r=document.createElement("i");r.className="fas fa-check stato-check-icon",t.appendChild(r),n.classList.remove("open");let c=n.closest(".riga-ordine");c&&c.classList.remove("stato-aperto-ord"),On(e,o)}async function On(t,e){try{let o=await ct({azione:"setStatoOrdineFornitori",n_ordine:t,stato:e},8e3,{retries:1});if(!o||o.status!=="ok"){g("Errore salvataggio stato","error");return}jo()}catch{g("Errore connessione","error")}}async function Rr(t){if(!confirm(`Archiviare l'ordine ${t}?
Non comparir\xE0 pi\xF9 nella lista principale.`))return;let e=document.querySelector(`.of-ordine-wrapper[data-nordine="${t}"]`);e&&(e.style.opacity="0.4",e.style.pointerEvents="none");try{let o=await ct({azione:"archiviaOrdineFornitori",n_ordine:t},8e3,{retries:1});if(!o||o.status!=="ok"){g("Errore archiviazione","error"),e&&(e.style.opacity="",e.style.pointerEvents="");return}e&&e.remove();let i=document.querySelector(".acquisti-subtitle");if(i){let n=document.querySelectorAll(".of-ordine-wrapper"),a=document.querySelectorAll(".of-ordine-missing").length,s=a>0?` \xB7 <span style="color:#d97706;font-weight:600">\u26A0 ${a} da revisionare</span>`:"";i.innerHTML=`${n.length} ordini${s}`}if(!document.querySelector(".of-ordine-missing")){let n=document.querySelector(".of-review-banner");n&&n.remove()}jo()}catch{g("Errore connessione","error"),e&&(e.style.opacity="",e.style.pointerEvents="")}}function kr(t,e){return t?t.length>e?t.substring(0,e)+"\u2026":t:"-"}function Lr(t){return!t&&t!==0?"-":Number(t).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2})+" \u20AC"}async function Pr(t,e,o=!1){let i=document.getElementById("contenitore-dati");if(i){if(!o){let n=Yt[it],a=Xt[it]||0;if(n&&Date.now()-a<3e5){i.innerHTML=n,z(i),window.aggiornaListaFiltrabili?.();return}try{let r=await N.get(it);if(r&&r.dati){i.innerHTML=r.dati,Yt[it]=r.dati,Xt[it]=r.timestamp,z(i),window.aggiornaListaFiltrabili?.(),r.isStale&&zr(e);return}}catch{}let s=ht(De,3e5);if(s){i.innerHTML=s,Yt[it]=s,Xt[it]=Date.now(),z(i),window.aggiornaListaFiltrabili?.();return}i.innerHTML=`<div class="centered-msg" id="_of-loader">
            <i class="fas fa-spinner fa-spin"></i> Caricamento ordini fornitori\u2026
        </div>`}try{let n=await In(e);if(window._acquistTabAttivo!=="fornitori")return;let a=An(n);i.innerHTML=a,z(i),window.aggiornaListaFiltrabili?.(),Yt[it]=a,Xt[it]=Date.now(),Z(De,a),N.set(it,a).catch(()=>{})}catch(n){if(n&&n.name==="AbortError")return;if(!o){let a=document.getElementById("contenitore-dati");a&&a.querySelector("#_of-loader")&&(a.innerHTML=`<div class="centered-error-bold">Errore nel caricamento.
                    <button onclick="_switchAcquistiTab('fornitori')"
                        style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                        Riprova</button></div>`,z(a))}}}}async function zr(t){try{let e=await In(t);if(window._acquistTabAttivo!=="fornitori")return;let o=An(e),i=document.getElementById("contenitore-dati");i&&(i.innerHTML=o,window.aggiornaListaFiltrabili?.()),Yt[it]=o,Xt[it]=Date.now(),Z(De,o),N.set(it,o).catch(()=>{})}catch{}}function jo(){delete Yt[it],delete Xt[it],N.invalidate(it).catch(()=>{});try{localStorage.removeItem(De)}catch{}}function $n(){window._apriDettaglioOF=Or,window._chiudiDettaglioOF=Cn,window._setStatoOF=On,window._selezionaStatoOF=Tr,window._toggleStatoDropdownOF=$r,window._archiviaOrdineOF=Rr,window.caricaOrdiniFornitori=Pr,window.invalidateOFCache=jo,window._ofDropdownListenerAdded||(document.addEventListener("click",function(t){t.target.closest(".of-ordine-wrapper .stato-dropdown")||document.querySelectorAll(".of-ordine-wrapper .stato-dropdown.open").forEach(e=>{e.classList.remove("open");let o=e.closest(".riga-ordine");o&&o.classList.remove("stato-aperto-ord")})},!0),window._ofDropdownListenerAdded=!0)}var Yt,Xt,it,De,En,Tn=W(()=>{ft();be();gt();xt();Pt();vt();Yt={},Xt={},it="ORDINI_FORNITORI",De="_html_ORDINI_FORNITORI",En=[{stato:"IN ATTESA",colore:"#94a3b8"},{stato:"ORDINATO",colore:"#fbbf24"},{stato:"PARZ. EVASO",colore:"#f97316"},{stato:"EVASO",colore:"#22c55e"},{stato:"ANNULLATO",colore:"#ef4444"}]});function _e(){window.cacheContenuti&&delete window.cacheContenuti.STORICO_RICHIESTE,window.cacheFetchTime&&delete window.cacheFetchTime.STORICO_RICHIESTE,U("_html_STORICO_RICHIESTE"),A.rqBundle=null,A.rqPromise=null,N.invalidate("STORICO_RICHIESTE").catch(()=>{})}function kn(){let t=document.getElementById("contenitore-dati");t&&(window.cacheContenuti&&(window.cacheContenuti.STORICO_RICHIESTE=t.innerHTML),window.cacheFetchTime&&(window.cacheFetchTime.STORICO_RICHIESTE=Date.now()),Z("_html_STORICO_RICHIESTE",t.innerHTML))}function Mr(t){let e=[`.req-card[data-id-riga="${CSS.escape(String(t))}"]`,`.scad-card[data-id-riga="${CSS.escape(String(t))}"]`,`#box-conferma-${CSS.escape(String(t))}`,`#box-risposta-${CSS.escape(String(t))}`,`#rc-body-${CSS.escape(String(t))}`];for(let o of e){let i=document.querySelector(o),n=i?.classList?.contains("req-card")||i?.classList?.contains("scad-card")?i:i?.closest(".req-card, .scad-card");if(n){let a=n.closest(".req-group");if(a){let s=a.querySelector(".rg-count");if(s){let r=parseInt(s.textContent,10)||0;r<=1?s.remove():s.textContent=r-1}}return n.remove(),!0}}return!1}function Nr(){if(!b||!b.nome)return!1;let t=b.nome.toUpperCase();return t==="ALESSIO"||t==="0000"||b.ruolo==="MASTER"}function He(t){let e=document.getElementById("badge-richieste-count"),o=document.getElementById("nome-utente-sidebar"),i=document.getElementById("img-avatar-sidebar");if(!e)return;let n=(b.vistaSimulata||"MASTER").toUpperCase().trim();if(o&&(o.innerText=n),i&&(i.src=`https://ui-avatars.com/api/?name=${n}&background=2563eb&color=fff`),window.paginaAttuale==="STORICO_RICHIESTE"){e.style.display="none",e.classList.remove("badge-sollecito-attivo");return}let a=t.filter(d=>{let u=String(d.RISOLTO).toLowerCase()!=="true";if(n==="MASTER")return u;var f=String(d.A||"").split(",").some(function(p){return p.trim().toUpperCase()===n});return f&&u}),s=a.length,r=a.filter(d=>String(d.SOLLECITO).toLowerCase()==="true").length;s>0?(e.innerText=s,e.style.display="inline-block",r>0?e.classList.add("badge-sollecito-attivo"):e.classList.remove("badge-sollecito-attivo")):(e.style.display="none",e.classList.remove("badge-sollecito-attivo"));let c=document.getElementById("badge-mobile-notif");c&&(s>0&&window.paginaAttuale!=="STORICO_RICHIESTE"?(c.innerText=s,c.style.display="inline-block",c.style.background=r>0?"#f97316":"#ef4444"):c.style.display="none");let l=document.getElementById("badge-bottom-richieste");l&&(s>0&&window.paginaAttuale!=="STORICO_RICHIESTE"?(l.innerText=s,l.style.display="inline-block",r>0?l.classList.add("badge-sollecito-attivo"):l.classList.remove("badge-sollecito-attivo")):(l.style.display="none",l.classList.remove("badge-sollecito-attivo")))}function qr(t,e,o,i){let n=document.getElementById("modalSollecito");n.style.display="flex",n.offsetHeight,n.classList.add("active"),document.getElementById("sollecito-titolo").textContent=i&&i!=="Intero Ordine"?`Sollecita \u2013 ${i}`:`Sollecita \u2013 Ord. ${e}`,document.getElementById("sollecito-id-riga").value=t||"",document.getElementById("sollecito-nord").value=e,document.getElementById("sollecito-cliente").value=o||"",document.getElementById("sollecito-rif").value=i||"",document.getElementById("sollecito-data").value="",document.getElementById("sollecito-note").value=""}function Ln(){let t=document.getElementById("modalSollecito");t.style.display="",t.classList.remove("active")}async function Dr(){let t=document.getElementById("sollecito-nord").value,e=document.getElementById("sollecito-id-riga").value,o=document.getElementById("sollecito-cliente").value,i=document.getElementById("sollecito-rif").value,n=document.getElementById("sollecito-data").value,a=document.getElementById("sollecito-note").value.trim();if(!n){g("Seleziona una data di scadenza.","error");return}Ln(),M.pauseFor(6e3),_e();let s={azione:"supporto_multiplo",n_ordine:t,cliente:o,prodotto:i&&i!=="Intero Ordine"?i:"",tipo:"SCADENZA",messaggio:`SCAD:${n}|${a||"\u2013"}`,mittente:b.nome.toUpperCase().trim(),destinatari:["ALESSIO"]};try{await fetch(x,{method:"POST",body:JSON.stringify(s)}),g("\u2705 Scadenza aggiunta"),window.paginaAttuale==="STORICO_RICHIESTE"&&Ct()}catch{g("\u2705 Scadenza aggiunta")}}function Br(t,e,o,i){let n=document.getElementById("modalAiuto");if(n.style.display==="flex")return;n._openedAt=Date.now(),n.style.display="flex",n.offsetHeight,n.classList.add("active"),document.getElementById("modal-titolo").innerText=t?`Messaggio Art. ${e}`:`Messaggio Ordine ${o}`;let a=window.listaOperatori||[];document.getElementById("wrapper-operatori").innerHTML=a.map(r=>`
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${r.email}" data-nome="${yt(r.nome)}">
            <span><b>${yt(r.nome)}</b> <small class="text-muted">(${r.reparto||"Team"})</small></span>
        </label>
    `).join(""),n.dataset.idRiga=t||"",n.dataset.nOrdine=o,n.dataset.cliente=i||"";let s=document.getElementById("modal-ordine-row");s&&(s.style.display="none"),document.getElementById("messaggio-aiuto").value="",Jo("DOMANDA")}function Pn(t={}){let e=document.getElementById("modalAiuto");if(e.style.display==="flex")return;e._openedAt=Date.now(),e.style.display="flex",e.offsetHeight,e.classList.add("active"),document.getElementById("modal-titolo").innerText="Nuova Richiesta";let o=window.listaOperatori||[];document.getElementById("wrapper-operatori").innerHTML=o.map(n=>`
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${n.email}" data-nome="${n.nome}">
            <span><b>${n.nome}</b> <small class="text-muted">(${n.reparto||"Team"})</small></span>
        </label>
    `).join(""),e.dataset.idRiga="",e.dataset.nOrdine=t.ordine||"",e.dataset.cliente=t.cliente||"",document.getElementById("messaggio-aiuto").value="",Jo("DOMANDA");let i=document.getElementById("modal-ordine-row");if(i){i.style.display="block";let n=document.getElementById("modal-ordine-input");n&&(n.value=t.ordine||"",t.ordine&&(e.dataset.nOrdine=t.ordine,e.dataset.cliente=t.cliente||""),Ur(n))}Ue.length===0&&fetch(x,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(n=>n.json()).then(n=>{let a=new Set;Ue=n.filter(s=>String(s.archiviato||"").toUpperCase()!=="TRUE").map(s=>({ordine:s.ordine||"",cliente:s.cliente||"",riferimento:s.riferimento||""})).filter(s=>!s.ordine||a.has(s.ordine)?!1:(a.add(s.ordine),!0))}).catch(()=>{})}function Ur(t){t.oninput=function(){let e=this.value.trim().toLowerCase(),o=document.getElementById("ordine-autocomplete");if(!o)return;if(!e){o.style.display="none",o.innerHTML="";return}let i=Ue.filter(n=>n.ordine.toLowerCase().includes(e)||n.cliente.toLowerCase().includes(e)).slice(0,8);if(i.length===0){o.style.display="none",o.innerHTML="";return}o.innerHTML=i.map(n=>`
            <div class="autocomplete-item" onmousedown="_selezionaOrdine('${n.ordine.replace(/'/g,"\\'")}','${n.cliente.replace(/'/g,"\\'")}')">  
                <span class="ac-ordine">ORD. ${n.ordine}</span>
                <span class="ac-cliente">${n.cliente}</span>
            </div>
        `).join(""),o.style.display="block"},t.onblur=function(){setTimeout(()=>{let e=document.getElementById("ordine-autocomplete");e&&(e.style.display="none")},200)}}function Fr(t,e){let o=document.getElementById("modal-ordine-input");o&&(o.value=t);let i=document.getElementById("ordine-autocomplete");i&&(i.style.display="none",i.innerHTML="");let n=document.getElementById("modalAiuto");n&&(n.dataset.nOrdine=t,n.dataset.cliente=e||"")}function Jo(t){let e=t.toUpperCase();document.getElementById("modalAiuto").dataset.tipoAzione=e,document.getElementById("btn-tipo-assegna").classList.toggle("active",e==="ASSEGNAZIONE"),document.getElementById("btn-tipo-domanda").classList.toggle("active",e==="DOMANDA")}function Wo(){let t=document.getElementById("modalAiuto");t.style.display="",t.classList.remove("active")}async function Hr(){let t=document.getElementById("modalAiuto");if(t){M.pauseFor(6e3);try{let e=t.dataset.idRiga,o=document.getElementById("modal-ordine-row"),i=document.getElementById("modal-ordine-input"),n=o&&o.style.display!=="none"&&i&&i.value.trim()?i.value.trim():t.dataset.nOrdine,a=document.getElementById("messaggio-aiuto").value,s=t.dataset.tipoAzione,r=document.querySelectorAll('input[name="destinatario"]:checked');if(r.length===0){alert("Per favore, seleziona almeno un operatore.");return}let c=Array.from(r).map(p=>p.getAttribute("data-nome")).join(", "),l=Array.from(r).map(p=>p.getAttribute("data-nome"));document.getElementById("messaggio-aiuto").value="",Wo(),g(s==="ASSEGNAZIONE"?"\u2705 Assegnazione inviata":"\u2705 Richiesta inviata"),_e();let d=`${x}?azione=assegnaOperatori&ordine=${encodeURIComponent(n)}&operatori=${encodeURIComponent(c)}&id_riga=${e}&mittente=${encodeURIComponent(b.nome.toUpperCase().trim())}&registra=0`,u=(t.dataset.cliente||"").trim(),f={azione:"supporto_multiplo",n_ordine:n,cliente:u,tipo:s,messaggio:a||(s==="ASSEGNAZIONE"?"Nuova assegnazione":"Nuova domanda"),mittente:b.nome.toUpperCase().trim(),destinatari:l};Promise.all([s==="ASSEGNAZIONE"?fetch(d).catch(()=>g("Errore assegnazione operatore.","error")):Promise.resolve(),fetch(x,{method:"POST",body:JSON.stringify(f)}).catch(()=>g("Errore invio richiesta.","error"))]).then(()=>{window.paginaAttuale==="STORICO_RICHIESTE"?Ct().catch(()=>{}):(Ee().then(p=>He(p.attive)).catch(()=>{}),window.caricaDati?.(window.paginaAttuale).catch(()=>{}))})}catch{g("Errore invio richiesta.","error")}}}function zn(t){let e=document.getElementById("box-risposta-"+t),o=document.getElementById("box-conferma-"+t);if(e)if(o&&(o.style.display="none",o.style.opacity="0"),e.style.display==="none"||e.style.display===""){e.style.display="block",setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},10);let i=document.getElementById("input-risposta-"+t);i&&(i.focus(),setTimeout(()=>{e.scrollIntoView({behavior:"smooth",block:"center"})},400))}else e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>{e.style.display="none"},300)}function jr(t){let e=document.getElementById("box-conferma-"+t),o=document.getElementById("box-risposta-"+t);e&&(o&&(o.style.display="none",o.style.opacity="0"),e.style.display==="none"||e.style.display===""?(e.style.display="block",setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},10)):(e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>{e.style.display="none"},300)))}async function Gr(t,e,o,i){try{let n=document.getElementById("input-risposta-"+t),a=n.value.trim();if(!a)return;M.pauseFor(6e3),n.value="",zn(t),g("\u2705 Risposta inviata"),_e();let s={azione:"supporto_multiplo",n_ordine:e,cliente:(i||"").trim(),tipo:"RISPOSTA",messaggio:a,mittente:b.nome.toUpperCase().trim(),destinatari:String(o).split(",").map(r=>r.trim().toUpperCase()).filter(Boolean)};fetch(x,{method:"POST",body:JSON.stringify(s)}).then(()=>{window.paginaAttuale==="STORICO_RICHIESTE"&&Ct().catch(()=>{})}).catch(()=>g("Errore invio risposta.","error"))}catch{g("Errore invio risposta.","error")}}function Mn(t,e){try{localStorage.setItem("_rg_"+t,e.open?"1":"0")}catch{}}function je(t){let e=String(t??"").trim();if(!e)return 0;let o=e.replace(/\./g,"").replace(",","."),i=Number(o);return Number.isFinite(i)?i:0}function St(t){return Number.isFinite(t)?Math.abs(t-Math.round(t))<1e-4?String(Math.round(t)):t.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:2}):"0"}function Zo(t){let e=String(t||"").trim().toUpperCase();return["IMBALLATO","SPEDITO","CONSEGNATO","SPEDITO/CONSEGNATO","SPEDITI/CONSEGNATI","ANNULLATO","ANNULLATI"].includes(e)}function Vr(t){document.querySelectorAll(".fabprod-modal-overlay").forEach(e=>e.remove()),window.cambiaPagina?.("PROGRAMMA PRODUZIONE DEL MESE",null),setTimeout(()=>{["universal-search","mobile-search"].forEach(e=>{let o=document.getElementById(e);o&&(o.value=t,o.dispatchEvent(new Event("input")))}),typeof window.filtraUniversale=="function"&&window.filtraUniversale()},420)}function Jr(t,e){document.getElementById("fabprod-modal-ordine")?.remove();let o=e?` \xB7 ${e}`:"",i=t.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),n=document.createElement("div");n.id="fabprod-modal-ordine",n.className="fabprod-modal-overlay",n.innerHTML=`
        <div class="fabprod-modal-box">
            <div class="fabprod-modal-title"><i class="fas fa-box-open"></i> Vai all'ordine?</div>
            <div class="fabprod-modal-body">ORD. <strong>${t}</strong>${o?`<span class="fabprod-modal-sub">${o}</span>`:""}</div>
            <div class="fabprod-modal-btns">
                <button class="fabprod-btn-cancel" onclick="document.getElementById('fabprod-modal-ordine').remove()">Annulla</button>
                <button class="fabprod-btn-confirm" onclick="_fabprodVaiOrdine('${i}')">Vai <i class='fas fa-arrow-right'></i></button>
            </div>
        </div>`,n.addEventListener("click",a=>{a.target===n&&n.remove()}),document.body.appendChild(n)}function Nn(t){let e=window._fabprodCurrentRows;if(!e||!e[t])return;let o=e[t];document.getElementById("fabprod-modal-articolo")?.remove();let i=o.ordini.map(a=>{let s=a.ordine.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),r=(a.cliente||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'");return`<span class="fabprod-order-pill fabprod-order-pill--click" onclick="document.getElementById('fabprod-modal-articolo').remove();_fabprodApriModalOrdine('${s}','${r}')">ORD. ${a.ordine}${a.cliente?`<span class="fabprod-pill-cliente"> \xB7 ${a.cliente}</span>`:""}</span>`}).join(""),n=document.createElement("div");n.id="fabprod-modal-articolo",n.className="fabprod-modal-overlay",n.innerHTML=`
        <div class="fabprod-modal-box fabprod-modal-box--art">
            <button class="fabprod-modal-close" onclick="document.getElementById('fabprod-modal-articolo').remove()"><i class="fas fa-times"></i></button>
            ${o.codice?`<div class="fabprod-modal-art-code">${o.codice}</div>`:""}
            <div class="fabprod-modal-art-name">${o.prodotto}</div>
            <div class="fabprod-modal-art-qty">${St(o.qty)} pz totali richiesti</div>
            <div class="fabprod-modal-art-orders">${i||'<span style="color:#94a3b8;font-size:0.8rem">Nessun ordine</span>'}</div>
        </div>`,n.addEventListener("click",a=>{a.target===n&&n.remove()}),document.body.appendChild(n)}function Wr(t){window.innerWidth<=768&&Nn(t)}function X(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function qn(){if(Array.isArray(oe))return oe.map(o=>{let i=Number(o.qtyTotale??o.qty??0)||0,n=Array.isArray(o.ordini)?o.ordini:[];return{codice:String(o.codice||"").trim(),prodotto:String(o.prodotto||"").trim(),ordini:n,qtyTotale:i,formulaQty:String(o.formulaQty||St(i))}});let t=new Map;for(let o of Fe||[]){if(!o||!o.ordine||String(o.archiviato||"").toUpperCase()==="TRUE"||Zo(o.stato))continue;let i=String(o.ordine||"").trim();if(!i||!Q.has(i))continue;let n=je(o.qty),a=je(o.qty_evasa),s=Math.max(n-a,0);if(s<=0)continue;let r=String(o.prodotto||"").trim();if(!r)continue;let c=String(o.codice||"").trim(),l=String(o.descrizione||o.dettaglio||o.riferimento||o.rif_articolo||o.note||"").trim(),d=`${c.toUpperCase()}|${r.toUpperCase()}`;t.has(d)||t.set(d,{codice:c,prodotto:r,descrizione:l,qtyTotale:0,ordiniMap:new Map});let u=t.get(d);u.qtyTotale+=s,!u.descrizione&&l&&(u.descrizione=l);let f=String(o.cliente||"").trim();u.ordiniMap.has(i)||u.ordiniMap.set(i,{ordine:i,cliente:f,qty:0}),u.ordiniMap.get(i).qty+=s}let e=[...t.values()].map(o=>{let i=[...o.ordiniMap.values()].sort((s,r)=>s.ordine.localeCompare(r.ordine,"it",{numeric:!0,sensitivity:"base"})),n=i.map(s=>St(s.qty)),a=i.length>1?`${n.join(" + ")} = ${St(o.qtyTotale)}`:St(o.qtyTotale);return{codice:o.codice,prodotto:o.prodotto,ordini:i,qtyTotale:o.qtyTotale,formulaQty:a}});return e.sort((o,i)=>{let n=o.prodotto.localeCompare(i.prodotto,"it",{sensitivity:"base"});return n!==0?n:(o.codice||"").localeCompare(i.codice||"","it",{sensitivity:"base"})}),e}function Ve(){oe=null,te=""}function Zr(t){let e=(t||[]).reduce((o,i)=>o+(Number(i.qtyTotale||0)||0),0);return{titolo:"Fabbisogno Produzione",generatedAt:Date.now(),generatedBy:String(b?.nome||"Sistema"),righe:Array.isArray(t)?t.length:0,totaleQty:e}}function Qr(t){let e=t&&t.distinta;if(!e||!Array.isArray(e.sezioni))return;let o=[];for(let i of e.sezioni)for(let n of i.righe||[]){let a=Number(n.totale||0),s=Number(n.disponibile||0);s<a&&o.push({nome:String(n.nome||"").trim(),delta:Math.max(0,a-s)})}Rn={ts:Date.now(),kitNome:String(t.kitNome||"").trim(),documento:String(t.documento||"").trim(),righe:Number(e.totaleRighe||0),deficits:o},window._kitFabbisognoSummary=Rn,window.paginaAttuale==="STORICO_RICHIESTE"&&Ut()}function Kr(t){let e=new Date,o=[...Q].sort((s,r)=>s.localeCompare(r,"it",{numeric:!0,sensitivity:"base"})),i=o.length<=6?o.join(", "):`${o.slice(0,6).join(", ")} +${o.length-6}`,n=t.reduce((s,r)=>s+(Number(r.qtyTotale)||0),0),a=t.map(s=>`
        <tr>
            <td>${X(s.codice||"-")}</td>
            <td>${X(s.prodotto)}</td>
            <td>${s.ordini.map(r=>`ORD. ${X(r.ordine)}${r.cliente?` \xB7 ${X(r.cliente)}`:""}`).join("<br>")}</td>
            <td class="qty">${X(s.formulaQty)}</td>
        </tr>
    `).join("");return`<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fabbisogno</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Roboto:wght@400;500;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --ink:#0f172a; --muted:#64748b; --line:#cbd5e1; --paper:#fff; --bg:#e5e7eb; }
        * { box-sizing: border-box; }
        html, body { margin:0; padding:0; background:var(--bg); color:var(--ink); font-family:'Roboto','Segoe UI',sans-serif; }
        .toolbar {
            position: sticky; top: 0; z-index: 9;
            display:flex; align-items:center; justify-content:space-between; gap:12px;
            padding:14px 18px; background:rgba(15,23,42,0.96); color:#fff;
        }
        .toolbar-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
        .toolbar-actions { display:flex; gap:8px; }
        .toolbar button {
            border:1px solid rgba(255,255,255,.16); border-radius:999px; padding:10px 16px;
            font-size:12px; font-weight:700; cursor:pointer;
            background:#fff; color:#0f172a;
        }
        .toolbar .ghost { background:transparent; color:#fff; }
        .stage { padding:28px 18px 46px; }
        .page {
            width:210mm; min-height:297mm; margin:0 auto; background:var(--paper);
            box-shadow:0 24px 50px rgba(15,23,42,.14); padding:18mm 16mm 14mm;
        }
        .title { font-family:'Lora', Georgia, serif; font-size:38px; font-weight:700; line-height:1.05; }
        .subtitle { margin-top:4px; color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.06em; }
        .meta { margin-top:14px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
        .meta-card { border:1px solid var(--line); background:#f8fafc; padding:10px 12px; }
        .meta-k { color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:.06em; font-weight:700; }
        .meta-v { color:var(--ink); font-size:13px; margin-top:4px; font-weight:700; }
        .orders { margin-top:12px; padding:10px 12px; border:1px dashed var(--line); color:#334155; font-size:12px; }
        .orders strong { color:#0f172a; }
        table { width:100%; border-collapse:collapse; margin-top:14px; border:1px solid #94a3b8; }
        th, td { border:1px solid var(--line); padding:8px; font-size:12px; vertical-align:top; }
        th { background:#f8fafc; text-align:left; font-size:10px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); }
        td.qty { text-align:right; font-weight:800; }
        .footer { margin-top:12px; color:var(--muted); font-size:11px; }
        @page { size:A4; margin:12mm; }
        @media print {
            html, body { background:#fff; }
            .toolbar { display:none !important; }
            .stage { padding:0; }
            .page { width:auto; min-height:auto; margin:0; box-shadow:none; padding:0; }
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <div class="toolbar-title">Fabbisogno</div>
        <div class="toolbar-actions">
            <button type="button" onclick="salvaFabbisogno()">Salva</button>
            <button type="button" onclick="window.print()">Stampa</button>
            <button type="button" class="ghost" onclick="window.close()">Chiudi</button>
        </div>
    </div>
    <div class="stage">
        <div class="page">
            <div class="title">Fabbisogno</div>
            <div class="subtitle">Documento operativo per produzione e approvvigionamento</div>
            <div class="meta">
                <div class="meta-card"><div class="meta-k">Data emissione</div><div class="meta-v">${X(e.toLocaleString("it-IT"))}</div></div>
                <div class="meta-card"><div class="meta-k">Ordini selezionati</div><div class="meta-v">${X(String(o.length))}</div></div>
                <div class="meta-card"><div class="meta-k">Totale quantit\xE0</div><div class="meta-v">${X(St(n))} pz</div></div>
            </div>
            <div class="orders"><strong>Fabbisogno per ordini:</strong> ${X(i)}</div>
            <table>
                <thead>
                    <tr>
                        <th style="width:14%">Codice</th>
                        <th style="width:30%">Prodotto</th>
                        <th style="width:36%">Ordini di riferimento</th>
                        <th style="width:20%">Quantit\xE0 totale</th>
                    </tr>
                </thead>
                <tbody>${a||'<tr><td colspan="4">Nessuna riga disponibile per la stampa.</td></tr>'}</tbody>
            </table>
            <div class="footer">Generato da PROD - ${X(String(b?.nome||"Sistema"))}</div>
        </div>
    </div>
    <script>
        function _fmt2(n) { return String(n).padStart(2, '0'); }
        function _buildFabbisognoFilename() {
            const d = new Date();
            const stamp = d.getFullYear() + '-' + _fmt2(d.getMonth() + 1) + '-' + _fmt2(d.getDate()) + '_' + _fmt2(d.getHours()) + '-' + _fmt2(d.getMinutes());
            return 'Fabbisogno_' + stamp + '.html';
        }
        function salvaFabbisogno() {
            try {
                const html = '<!DOCTYPE html>
' + document.documentElement.outerHTML;
                const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = _buildFabbisognoFilename();
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            } catch (e) {
                alert('Salvataggio non riuscito.');
            }
        }
    <\/script>
</body>
</html>`}function Yr(){let t=qn();if(!t.length){g("Nessuna riga utile da stampare per il fabbisogno corrente.","warning");return}let e=window.open("","_blank");if(!e){g("Popup bloccato: abilita l'anteprima di stampa.","warning");return}e.document.open(),e.document.write(Kr(t)),e.document.close(),e.focus()}async function Xr(){let t=qn();if(!t.length){g("Nessuna riga utile da salvare nel fabbisogno.","warning");return}let e=[...Q].sort((i,n)=>i.localeCompare(n,"it",{numeric:!0,sensitivity:"base"})),o={id:te||void 0,ordini:e,rows:t,meta:Zr(t)};try{let i=await Et({azione:"saveFabbisogno",payload:o});if(i?.status!=="ok")throw new Error(i?.message||"saveFabbisogno failed");te=String(i.id||te||""),g("Fabbisogno salvato su Sheets.","success")}catch(i){console.error("[richieste] saveFabbisogno error:",i),g("Errore salvataggio fabbisogno.","error")}}function Be(t){return t.length?t.map(function(e){let o=Array.isArray(e.ordini)?e.ordini:[],i=o.length?o.slice(0,4).join(", ")+(o.length>4?" ...":""):"Ordini non specificati",n=e.updatedAt?new Date(e.updatedAt).toLocaleString("it-IT"):"-",a=Number(e.rowsCount||0)||0,r=String(e.status||"ACTIVE").toUpperCase()==="ARCHIVED"?"Archiviato":"Attivo",c=X(e.id||"");return`
            <div class="fabprod-sel-item fabprod-sel-item--checked" style="display:block;cursor:default">
                <div class="fabprod-sel-item-info" style="gap:4px">
                    <span class="fabprod-sel-ord">${c||"SNAP"}</span>
                    <span class="fabprod-sel-cli">Stato: ${X(r)} \xB7 Aggiornato: ${X(n)} \xB7 Righe: ${a}</span>
                    <span class="fabprod-sel-cli">Ordini: ${X(i)}</span>
                    <span class="fabprod-sel-cli">Autore: ${X(e.updatedBy||e.createdBy||"-")}</span>
                </div>
                <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px">
                    <button type="button" class="fabprod-print-btn" onclick="_fabprodApriSnapshotById('${c}')"><i class="fas fa-folder-open"></i> Apri</button>
                    <button type="button" class="fabprod-sel-btn" onclick="_fabprodArchiviaSnapshotById('${c}')"><i class="fas fa-box-archive"></i> Archivia</button>
                </div>
            </div>`}).join(""):'<div class="empty-msg" style="margin:16px 0">Nessun fabbisogno disponibile.</div>'}async function tc(){document.getElementById("fabprod-archivio-modal")?.remove();let t=document.createElement("div");t.id="fabprod-archivio-modal",t.className="fabprod-sel-modal-overlay",t.innerHTML=`
        <div class="fabprod-sel-modal-box">
            <div class="fabprod-sel-modal-header">
                <span><i class="fas fa-database"></i> Fabbisogni salvati</span>
                <button type="button" class="fabprod-sel-modal-close" onclick="_fabprodChiudiArchivioSnapshot()"><i class="fas fa-times"></i></button>
            </div>
            <div class="fabprod-sel-modal-body" id="fabprod-archivio-body">
                <div class="empty-msg" style="margin:16px 0">Caricamento fabbisogni...</div>
            </div>
            <div class="fabprod-sel-footer">
                <button type="button" class="fabprod-sel-btn-cancel" onclick="_fabprodChiudiArchivioSnapshot()">Chiudi</button>
            </div>
        </div>`,t.addEventListener("click",function(o){o.target===t&&Qo()}),document.body.appendChild(t),requestAnimationFrame(function(){t.classList.add("fabprod-sel-modal-overlay--in")});let e=document.getElementById("fabprod-archivio-body");try{let o=await Et({azione:"getFabbisogni",includeArchived:!1}),i=Array.isArray(o?.items)?o.items:[];if(i.length){ee=i,e&&(e.innerHTML=Be(ee));return}let n=await Et({azione:"getFabbisogni",includeArchived:!0}),a=Array.isArray(n?.items)?n.items:[];if(ee=a,!e)return;if(!a.length){e.innerHTML=Be([]);return}e.innerHTML=`
            <div class="empty-msg" style="margin:0 0 12px">Nessun snapshot attivo: mostro anche gli archiviati.</div>
            ${Be(a)}
        `}catch(o){console.error("[richieste] getFabbisogni error:",o),e&&(e.innerHTML='<div class="empty-msg" style="margin:16px 0">Errore caricamento fabbisogni.</div>'),g("Errore caricamento fabbisogni.","error")}}function Qo(){document.getElementById("fabprod-archivio-modal")?.remove()}async function ec(t){let e=String(t||"").trim();if(e)try{let o=await Et({azione:"getFabbisognoById",id:e});if(o?.status!=="ok"||!o?.item)throw new Error(o?.message||"Snapshot non trovato");let i=o.item;te=String(i.id||e),oe=Array.isArray(i.rows)?i.rows.map(function(n){return{codice:String(n?.codice||"").trim(),prodotto:String(n?.prodotto||"").trim(),qty:Number(n?.qtyTotale??n?.qty??0)||0,formulaQty:String(n?.formulaQty||""),ordini:Array.isArray(n?.ordini)?n.ordini:[]}}):[],Q=new Set(Array.isArray(i.ordini)?i.ordini.map(function(n){return String(n||"").trim()}).filter(Boolean):[]),Qo(),Ut(),Yo(),g("Snapshot fabbisogno caricato.","success")}catch(o){console.error("[richieste] getFabbisognoById error:",o),g("Errore apertura snapshot fabbisogno.","error")}}async function oc(t){let e=String(t||"").trim();if(!(!e||!await rt("Archiviare questo fabbisogno condiviso?",{title:"Archivia snapshot",confirmText:"Archivia",cancelText:"Annulla",confirmType:"danger"})))try{let i=await Et({azione:"archiveFabbisogno",id:e});if(i?.status!=="ok")throw new Error(i?.message||"Archiviazione non riuscita");ee=ee.filter(function(a){return String(a.id||"")!==e});let n=document.getElementById("fabprod-archivio-body");n&&(n.innerHTML=Be(ee)),te===e&&Ve(),Ut(),g("Snapshot archiviato.","success")}catch(i){console.error("[richieste] archiveFabbisogno error:",i),g("Errore archiviazione snapshot.","error")}}function Ut(){let t=document.getElementById("fabprod-list"),e=document.getElementById("fabprod-sel-badge"),o=document.getElementById("fabprod-cnt-badge");if(!t)return;let i=Array.isArray(oe)?oe:Bn(Fe.filter(r=>!r||!r.ordine?!1:Q.has(String(r.ordine).trim())));i.length?(window._fabprodCurrentRows=i,t.innerHTML=i.map((r,c)=>{let l=r.ordini.map(u=>{let f=u.ordine.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),p=(u.cliente||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'");return`<span class="fabprod-order-pill fabprod-order-pill--click" onclick="event.stopPropagation();_fabprodApriModalOrdine('${f}','${p}')">ORD. ${u.ordine}${u.cliente?`<span class="fabprod-pill-cliente"> \xB7 ${u.cliente}</span>`:""}</span>`}).join(""),d=r.ordini.length>1?`<div class="fabprod-qty-breakdown">${r.ordini.map(u=>`${St(u.qty)}\xA0(${u.ordine})`).join(" + ")}</div>`:"";return`<div class="fabprod-card" onclick="_fabprodCardClick(${c})">
                <div class="fabprod-top">
                    <div class="fabprod-name">${r.codice?`<span class="fabprod-code">${r.codice}</span>`:""}${r.prodotto}</div>
                    <span class="fabprod-qty">${St(r.qty)} pz</span>
                </div>
                ${d}
                <div class="fabprod-orders">${l}</div>
            </div>`}).join("")):t.innerHTML=Q.size===0?'<div class="fabprod-empty-sel"><i class="fas fa-hand-pointer fabprod-empty-sel-icon"></i><div class="fabprod-empty-sel-text">Seleziona gli ordini per vedere il fabbisogno</div></div>':'<div class="empty-msg" style="margin:16px 0 8px">Nessun articolo attivo per gli ordini selezionati.</div>';let n=Q.size;e&&(e.textContent=n,e.style.display=n>0?"":"none"),o&&(o.textContent=i.length,o.style.display=i.length>0?"":"none");let a=document.getElementById("fabprod-print-btn");a&&(a.disabled=i.length===0);let s=document.getElementById("fabprod-save-btn");s&&(s.disabled=i.length===0)}function ic(){document.getElementById("fabprod-sel-modal")?.remove();let t=n=>{let a=(n||"").trim().toLowerCase(),s=a?Bt.filter(r=>r.ordine.toLowerCase().includes(a)||(r.cliente||"").toLowerCase().includes(a)):Bt;return!s.length&&!Bt.length?'<div class="empty-msg" style="margin:16px 0">Nessun ordine attivo disponibile.</div>':s.length?s.map(r=>{let c=Q.has(r.ordine)?" checked":"",l=r.ordine.replace(/"/g,"&quot;");return`<label class="fabprod-sel-item${c?" fabprod-sel-item--checked":""}">
                <input type="checkbox" class="fabprod-sel-chk" value="${l}"${c}>
                <div class="fabprod-sel-item-info">
                    <span class="fabprod-sel-ord">ORD. ${r.ordine}</span>
                    ${r.cliente?`<span class="fabprod-sel-cli">${r.cliente}</span>`:""}
                </div>
            </label>`}).join(""):'<div class="empty-msg" style="margin:16px 0">Nessun ordine trovato.</div>'},e=document.createElement("div");e.id="fabprod-sel-modal",e.className="fabprod-sel-modal-overlay",e.innerHTML=`
        <div class="fabprod-sel-modal-box">
            <div class="fabprod-sel-modal-header">
                <span><i class="fas fa-sliders"></i> Seleziona ordini</span>
                <button type="button" class="fabprod-sel-modal-close" onclick="_chiudiModalFabbisognoSel()"><i class="fas fa-times"></i></button>
            </div>
            <div class="fabprod-sel-search-wrap">
                <i class="fas fa-search fabprod-sel-search-icon"></i>
                <input type="text" class="fabprod-sel-search" id="fabprod-sel-search"
                    placeholder="Cerca per ordine o cliente..." autocomplete="off">
            </div>
            <div class="fabprod-sel-modal-body" id="fabprod-sel-modal-body">
                ${t("")}
            </div>
            <div class="fabprod-sel-footer">
                <button type="button" class="fabprod-sel-btn-cancel" onclick="_chiudiModalFabbisognoSel()">Annulla</button>
                <button type="button" class="fabprod-sel-btn-apply" id="fabprod-sel-apply" onclick="_applicaSelFabbisogno()">Applica</button>
            </div>
        </div>`,e.addEventListener("change",n=>{if(!n.target.classList.contains("fabprod-sel-chk"))return;n.target.closest(".fabprod-sel-item")?.classList.toggle("fabprod-sel-item--checked",n.target.checked);let a=e.querySelectorAll(".fabprod-sel-chk:checked").length,s=e.querySelector("#fabprod-sel-apply");s&&(s.textContent=a>0?`Applica (${a})`:"Applica")}),e.addEventListener("input",n=>{if(n.target.id!=="fabprod-sel-search")return;e.querySelectorAll(".fabprod-sel-chk").forEach(c=>{c.checked?Q.add(c.value):Q.delete(c.value)});let a=e.querySelector("#fabprod-sel-modal-body");a&&(a.innerHTML=t(n.target.value));let s=Q.size,r=e.querySelector("#fabprod-sel-apply");r&&(r.textContent=s>0?`Applica (${s})`:"Applica")});let o=Q.size,i=e.querySelector("#fabprod-sel-apply");i&&o>0&&(i.textContent=`Applica (${o})`),e.addEventListener("click",n=>{n.target===e&&Ko()}),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("fabprod-sel-modal-overlay--in"),e.querySelector("#fabprod-sel-search")?.focus()})}function nc(){let t=document.getElementById("fabprod-sel-modal");t&&(Q=new Set([...t.querySelectorAll(".fabprod-sel-chk:checked")].map(e=>e.value)),Ve(),Ko(),Ut())}function Ko(){document.getElementById("fabprod-sel-modal")?.remove()}function Yo(){let t=document.getElementById("rg-fabbisogno-produzione");t&&(t.open||(t.open=!0,Mn("fabbisogno_produzione",t)),t.scrollIntoView({behavior:"smooth",block:"start"}))}function Dn(t){let e=[...document.querySelectorAll(".scad-card[data-ordine]")];if(!e.length)return[];let o=new Set((Bt||[]).map(n=>String(n.ordine||"").trim())),i=[];return e.forEach(n=>{let a=n.querySelector(".scad-fab-chk");if(t&&!a?.checked)return;let s=String(n.dataset.ordine||"").trim();!s||!o.has(s)||i.push(s)}),[...new Set(i)].sort((n,a)=>n.localeCompare(a,"it",{numeric:!0,sensitivity:"base"}))}function ac(){let t=Dn(!1);if(!t.length){g("Nessuna scadenza utile trovata per creare il fabbisogno.","warning");return}Q=new Set(t),Ve(),Ut(),Yo(),g(`Fabbisogno impostato su ${t.length} ordini da scadenze.`,"success")}function sc(){let t=Dn(!0);if(!t.length){g("Flagga almeno una scadenza per creare il fabbisogno.","warning");return}Q=new Set(t),Ve(),Ut(),Yo(),g(`Fabbisogno impostato su ${t.length} ordini selezionati.`,"success")}function Bn(t){let e=new Map;return(t||[]).forEach(o=>{if(!o||String(o.archiviato||"").toUpperCase()==="TRUE"||Zo(o.stato))return;let i=String(o.prodotto||"").trim();if(!i)return;let n=je(o.qty),a=je(o.qty_evasa),s=Math.max(n-a,0);if(s<=0)return;let r=i.toLocaleUpperCase("it-IT");e.has(r)||e.set(r,{prodotto:i,codice:String(o.codice||"").trim(),qty:0,ordini:new Map});let c=e.get(r);if(!c.codice&&o.codice&&(c.codice=String(o.codice).trim()),c.qty+=s,o.ordine){let l=String(o.ordine).trim(),d=String(o.cliente||"").trim();c.ordini.has(l)||c.ordini.set(l,{cliente:d,qty:0}),c.ordini.get(l).qty+=s}}),Array.from(e.values()).map(o=>({prodotto:o.prodotto,codice:o.codice,qty:o.qty,ordini:Array.from(o.ordini.entries()).map(([i,{cliente:n,qty:a}])=>({ordine:i,cliente:n,qty:a})).sort((i,n)=>i.ordine.localeCompare(n.ordine,"it"))})).sort((o,i)=>(o.codice||"").localeCompare(i.codice||"","it",{sensitivity:"base"}))}async function rc(){let t=typeof window._getAttiviProd=="function"?window._getAttiviProd():window._attiviProd;if(Array.isArray(t)&&t.length)return t;let e=null;if(A.dashBundle)e=A.dashBundle,A.dashBundle=null,A.dashPromise=null;else if(A.dashPromise)e=await A.dashPromise,A.dashBundle=null,A.dashPromise=null;else{let o=await fetch(x,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!1})});if(!o.ok)throw new Error(`HTTP ${o.status}`);e=await o.json()}return e&&e.produzione||[]}async function Ee(t=null){async function e(){if(A.rqBundle){let s=A.rqBundle;return A.rqBundle=null,A.rqPromise=null,s}if(A.rqPromise){let s=await A.rqPromise;return A.rqBundle=null,A.rqPromise=null,s}let a=await fetch(x,{method:"POST",body:JSON.stringify({azione:"getAllRichieste"}),...t?{signal:t}:{}});if(!a.ok)throw new Error(`HTTP ${a.status}`);return a.json()}let[o,i]=await Promise.all([e(),rc().catch(a=>(console.warn("Fabbisogno Produzione non disponibile:",a),[]))]);if(!o)throw new Error("bundle vuoto");let n=Bn(i);return{attive:o.attive||[],archivio:o.archivio||[],fabbisogno:n,fabbisognoRaw:i}}async function Ct(t=null,e=null){let o=document.getElementById("contenitore-dati");if(!o)return;o.innerHTML="<div class='centered-msg' id='_ric-loader'>Caricamento messaggi in corso...</div>";let i=setTimeout(()=>{let n=document.getElementById("_ric-loader");n&&(n.innerHTML=`\u26A0\uFE0F Connessione lenta o server non raggiungibile.<br>
            <button onclick="cambiaPagina('STORICO_RICHIESTE', null)"
                style="margin-top:12px;padding:8px 20px;background:#242424;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`)},12e3);try{let n=await Ee(e);if(clearTimeout(i),He(n.attive),t!==null&&t!==window._latestNavRequest)return;window.aggiornaBadgeNotifiche?.(n.attive),Je(n)}catch(n){if(clearTimeout(i),n.name==="AbortError")return;console.error("Errore caricamento richieste:",n),o.innerHTML=`<div class='centered-error-bold'>Errore nel caricamento. <button onclick="cambiaPagina('STORICO_RICHIESTE',null)" style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">Riprova</button></div>`,z(o)}}function Je(t){if(window.paginaAttuale!=="STORICO_RICHIESTE")return;let e=document.getElementById("contenitore-dati");if(!e)return;let o=t.attive||[],i=t.archivio||[],n=t.fabbisogno||[];Fe=t.fabbisognoRaw||[],Q=new Set;{let P=new Set;Bt=[];for(let I of Fe){if(!I||!I.ordine||String(I.archiviato||"").toUpperCase()==="TRUE"||Zo(I.stato))continue;let T=String(I.ordine).trim();!T||P.has(T)||(P.add(T),Bt.push({ordine:T,cliente:String(I.cliente||"").trim()}))}Bt.sort((I,T)=>I.ordine.localeCompare(T.ordine,"it"))}let a=(b?.nome||"").toUpperCase().trim(),s=P=>{let I={};return P.forEach(T=>{I[T.ORDINE]||(I[T.ORDINE]=[]),I[T.ORDINE].push(T)}),I},r=s(o),c=s(i),l=(()=>{if(Nr())return()=>!0;let P=yt(b?.nome||"").toUpperCase();return I=>I.some(T=>{if(yt(T.DA||"").toUpperCase()===P)return!0;var B=String(T.A||"");return B.split(",").some(function(Y){return yt(Y.trim()).toUpperCase()===P})})})(),d=P=>{let I={};return Object.keys(P).forEach(T=>{l(P[T])&&(I[T]=P[T])}),I},u=d(r),f=d(c),p={},m={},h={};Object.keys(u).forEach(P=>{let T=u[P].filter(B=>(B.TIPO||"").toUpperCase()!=="SCADENZA");T.length>0&&((T[0].TIPO||"MSG").toUpperCase()==="ASSEGNAZIONE"?p[P]=T:m[P]=T)}),Object.keys(r).forEach(P=>{let I=r[P].filter(T=>(T.TIPO||"").toUpperCase()==="SCADENZA");I.length>0&&(h[P+"_scad"]=I)});let w=localStorage.getItem("_rg_assegnazioni")!=="0",v=localStorage.getItem("_rg_richieste")!=="0",E=localStorage.getItem("_rg_scadenze")!=="0",C=localStorage.getItem("_rg_fabbisogno_produzione")!=="0",_=Object.keys(p).length,$=Object.keys(m).length,k=Object.values(h).reduce((P,I)=>P+I.length,0),R=n.length,O=(P,I)=>{let T="";return Object.keys(P).reverse().forEach(B=>{T+=Go(P[B],I,!1)}),T||'<div class="empty-msg" style="margin:16px 0 8px">Nessun elemento.</div>'},q=()=>{let P=Object.values(h).flat();return P.sort((I,T)=>{let B=Vo(I),Y=Vo(T);return!B&&!Y?0:B?Y?B-Y:-1:1}),P.map(I=>Hn(I,a)).join("")||'<div class="empty-msg" style="margin:16px 0 8px">Nessuna scadenza.</div>'},G=P=>!P||!P.length?Q.size===0?`<div class="fabprod-empty-sel">
                        <i class="fas fa-hand-pointer fabprod-empty-sel-icon"></i>
                        <div class="fabprod-empty-sel-text">Seleziona gli ordini per vedere il fabbisogno</div>
                    </div>`:'<div class="empty-msg" style="margin:16px 0 8px">Nessun articolo attivo per gli ordini selezionati.</div>':(window._fabprodCurrentRows=P,P.map((I,T)=>{let B=I.ordini.map(st=>{let L=st.ordine.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),F=(st.cliente||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'");return`<span class="fabprod-order-pill fabprod-order-pill--click" onclick="event.stopPropagation();_fabprodApriModalOrdine('${L}','${F}')">ORD. ${st.ordine}${st.cliente?`<span class="fabprod-pill-cliente"> \xB7 ${st.cliente}</span>`:""}</span>`}).join(""),Y=I.ordini.length>1?`<div class="fabprod-qty-breakdown">${I.ordini.map(st=>`${St(st.qty)}\xA0(${st.ordine})`).join(" + ")}</div>`:"";return`
                <div class="fabprod-card" onclick="_fabprodCardClick(${T})">
                    <div class="fabprod-top">
                        <div class="fabprod-name">${I.codice?`<span class="fabprod-code">${I.codice}</span>`:""}${I.prodotto}</div>
                        <span class="fabprod-qty">${St(I.qty)} pz</span>
                    </div>
                    ${Y}
                    <div class="fabprod-orders">${B}</div>
                </div>`}).join("")),mt="";Object.keys(f).length===0?mt='<div class="empty-msg" style="margin:20px 0">Nessuna richiesta archiviata.</div>':Object.keys(f).reverse().forEach(P=>{mt+=Go(f[P],a,!0)});let at=`
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="_apriArchivio('archivio-req-details')">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>

            <div class="req-groups">

                <details id="rg-fabbisogno-produzione" class="req-group" ${C?"open":""}
                         ontoggle="_saveReqGroup('fabbisogno_produzione', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-fabbisogno"><i class="fas fa-boxes-stacked"></i></span>
                            <span class="rg-title">FABBISOGNO PRODUZIONE</span>
                            <span class="rg-count rg-count-fabb" id="fabprod-cnt-badge" style="${Q.size>0&&n.length>0?"":"display:none"}">0</span>
                        </span>
                        <span class="fabprod-actions-wrap">
                            <button type="button" class="fabprod-sel-btn" id="fabprod-sel-btn"
                                onclick="event.stopPropagation();_apriModalFabbisognoSel()">
                                <i class="fas fa-sliders"></i>
                                Seleziona ordini
                                <span class="fabprod-sel-badge" id="fabprod-sel-badge" style="display:none">0</span>
                            </button>
                            <button type="button" class="fabprod-sel-btn" id="fabprod-open-btn"
                                onclick="event.stopPropagation();_fabprodApriArchivioSnapshot()">
                                <i class="fas fa-folder-open"></i>
                                Apri
                            </button>
                            <button type="button" class="fabprod-sel-btn" id="fabprod-save-btn"
                                onclick="event.stopPropagation();_fabprodSalvaSnapshotCondiviso()" disabled>
                                <i class="fas fa-cloud-upload-alt"></i>
                                Salva
                            </button>
                            <button type="button" class="fabprod-print-btn" id="fabprod-print-btn"
                                onclick="event.stopPropagation();_fabprodStampaFabbisognoSel()" disabled>
                                <i class="fas fa-print"></i>
                                Stampa
                            </button>
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="fabprod-list" id="fabprod-list">${G([])}</div>
                </details>

                <details id="rg-assegnazioni" class="req-group" ${w?"open":""}
                         ontoggle="_saveReqGroup('assegnazioni', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-assegna"><i class="fas fa-arrow-right"></i></span>
                            <span class="rg-title">ASSEGNAZIONI</span>
                            ${_>0?`<span class="rg-count">${_}</span>`:""}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${O(p,a)}</div>
                </details>

                <details id="rg-richieste" class="req-group" ${v?"open":""}
                         ontoggle="_saveReqGroup('richieste', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-domanda"><i class="fas fa-question"></i></span>
                            <span class="rg-title">RICHIESTE</span>
                            ${$>0?`<span class="rg-count rg-count-dom">${$}</span>`:""}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${O(m,a)}</div>
                </details>

                <details id="rg-scadenze" class="req-group" ${E?"open":""}
                         ontoggle="_saveReqGroup('scadenze', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-scadenza"><i class="fa-solid fa-clock"></i></span>
                            <span class="rg-title">SCADENZE</span>
                            ${k>0?`<span class="rg-count rg-count-scad">${k}</span>`:""}
                        </span>
                        <span class="scad-actions-wrap">
                            <button type="button" class="scad-fab-btn"
                                onclick="event.stopPropagation();_fabprodDaScadenzeTutte()"
                                ${k>0?"":"disabled"}>
                                <i class="fas fa-layer-group"></i> Tutte -> Fabbisogno
                            </button>
                            <button type="button" class="scad-fab-btn"
                                onclick="event.stopPropagation();_fabprodDaScadenzeFlaggate()"
                                ${k>0?"":"disabled"}>
                                <i class="fas fa-check-square"></i> Flaggate -> Fabbisogno
                            </button>
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${q()}</div>
                </details>

            </div>

            <details id="archivio-req-details" class="archivio-details">
                <summary class="separatore-archivio archivio-summary" style="list-style:none">
                    <span>ARCHIVIO</span>
                    <i class="fas fa-chevron-down archivio-chevron"></i>
                </summary>
                <div class="chat-inbox">${mt}</div>
            </details>`;e.innerHTML=at,window.cacheContenuti&&(window.cacheContenuti.STORICO_RICHIESTE=at),window.cacheFetchTime&&(window.cacheFetchTime.STORICO_RICHIESTE=Date.now()),Z("_html_STORICO_RICHIESTE",at),N.set("STORICO_RICHIESTE",t).catch(()=>{}),z(e),window.aggiornaListaFiltrabili?.(),window._osservaArchivio?.("archivio-req-details"),["universal-search","mobile-search"].forEach(P=>{let I=document.getElementById(P);I&&(I.value="")})}function cc(t){b.vistaSimulata=t,t==="MASTER"?b.nome="MASTER":b.nome=t,Ct()}function lc(t){if(!t)return;typeof window._setAssegnaLocalByOrdine=="function"&&window._setAssegnaLocalByOrdine(t,"");let e=document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(t)}"]`);if(e){e.querySelectorAll(".visualizza-operatori").forEach(i=>{i.dataset.assegna="",i.innerHTML='<span class="operatore-libero">Libero</span>'}),e.querySelectorAll(".op-dropdown[data-id-riga]").forEach(i=>{i.dataset.assegna="";let n=i.querySelector(".op-trigger-label");n&&(n.textContent="Libero"),i.querySelectorAll(".op-option").forEach(a=>{a.classList.remove("is-selected"),a.querySelector(".op-check-icon")?.remove()})});let o=e.querySelector(".op-dropdown-ord");if(o){o.dataset.assegnaOrd="";let i=o.querySelector(".op-trigger-label");i&&(i.textContent="Libero"),o.querySelectorAll(".op-option").forEach(n=>{n.classList.remove("is-selected"),n.querySelector(".op-check-icon")?.remove()})}}typeof window._repaintOpColors=="function"&&window._repaintOpColors(),typeof window._refreshOverview=="function"&&window._refreshOverview()}async function dc(t){try{let e=(b?.nome||"").toUpperCase().trim();await fetch(x,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:t,operatori:"",mittente:e})})}catch(e){console.warn("[_sincronizzaCancellaAssegna] Errore:",e)}}async function Un(t,e,o){let i=document.getElementById("contenitore-dati"),n=i?i.innerHTML:"",a=e==="risolto",s=null;if(a){let r=document.querySelector(`.req-card[data-id-riga="${CSS.escape(String(t))}"]`);if(r){let c=r.closest(".req-group");c&&c.id==="rg-assegnazioni"&&(s=r.dataset.ordine||null)}}try{let r={azione:"aggiorna_richiesta_stato",tipo:e,mittente:b?.nome?.toUpperCase().trim()||"SISTEMA"};e==="risolto"&&o&&o.length>1?r.id_righe=o:r.id_riga=t,a&&(M.pauseFor(2e4),Mr(t),kn(),s&&lc(s));let l=await(await fetch(x,{method:"POST",body:JSON.stringify(r)})).json();if(l&&l.status==="auth_error"){window._gestisciAuthError_?.(l.message);return}if(!l||l.status!=="success"&&l.status!=="ok")throw new Error("Aggiornamento non salvato");_e(),a||Ct(),s&&dc(s)}catch{a&&i&&n&&(i.innerHTML=n,kn()),g("Errore aggiornamento.","error")}}function pc(t){rt("Sollecita Richiesta","Inviare un sollecito per questa richiesta?",()=>Fn(t),"Sollecita")}function uc(t,e){rt("Archivia Richiesta","Archiviare definitivamente questa discussione?",()=>Un(t,"risolto",e),"Archivia")}async function Fn(t){try{(await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"aggiorna_richiesta_stato",id_riga:t,tipo:"sollecita"})})).json()).status==="success"&&(_e(),g("Sollecito inviato!"),Ct())}catch{g("Errore durante il sollecito.","error")}}function Ge(t){if(!t)return"N.D.";let e;if(!isNaN(t)&&typeof t!="string")e=new Date(Number(t));else if(e=new Date(t),isNaN(e.getTime())){let r=String(t).match(/(\d{2})[/-](\d{2})[/-](\d{4})/);if(r){let[,c,l,d]=r,u=String(t).match(/(\d{2})[:.](\d{2})/),f=u?u[1]:"00",p=u?u[2]:"00";e=new Date(`${d}-${l}-${c}T${f}:${p}:00`)}}if(!e||isNaN(e.getTime()))return t;let o=String(e.getDate()).padStart(2,"0"),i=String(e.getMonth()+1).padStart(2,"0"),n=e.getFullYear(),a=String(e.getHours()).padStart(2,"0"),s=String(e.getMinutes()).padStart(2,"0");return`${o}/${i}/${n} ${a}:${s}`}function Go(t,e,o){let i=t[t.length-1],n=t[0],a=n.ORDINE||i.ORDINE,s=n.CLIENTE||i.CLIENTE||((Ue||[]).find(h=>h.ordine===a)||{}).cliente||"",r=t.some(h=>String(h.SOLLECITO).toLowerCase()==="true"),c=yt(n.DA)||"\u2013",l=[...new Set(t.flatMap(h=>String(h.A||"").split(",").map(w=>yt(w.trim())).filter(Boolean)))],d=l.length>1?l.map(h=>`<span class="rc-val rc-val-a">${h}</span>`).join('<span style="color:#cbd5e1;margin:0 1px">,</span> '):`<span class="rc-val rc-val-a">${l[0]||"\u2013"}</span>`,u=(n.TIPO||"MSG").toUpperCase(),f=t.map(h=>h.id_riga).join(","),p=u==="ASSEGNAZIONE",m=p?'<span class="rc-tipo rc-tipo-assegna" title="Assegnazione"><i class="fas fa-arrow-right"></i></span>':'<span class="rc-tipo rc-tipo-domanda" title="Richiesta"><i class="fas fa-question"></i></span>';return`
        <div class="req-card${o?" archiviata":""}${r?" sollecitata":""}" data-id-riga="${String(i.id_riga||"")}" data-ordine="${String(a||"")}" data-cliente="${(s||"").toLowerCase().replace(/"/g,"")}" data-riferimento="${(i.RIFERIMENTO||"").toLowerCase().replace(/"/g,"")}">

            <div class="rc-top">
                <div class="rc-ordine-wrap">
                    ${m}
                    <span class="rc-ordine">ORD. ${a}</span>
                </div>
                ${r?'<span class="badge-sollecito badge-sollecito-sm"><i class="fa-solid fa-bullhorn"></i></span>':""}
                ${o?'<span class="rc-arch-badge">\u2713</span>':""}
            </div>

            <div class="rc-cliente">${s||'<span class="rc-no-val">\u2013</span>'}</div>

            <div class="rc-info">
                <div class="rc-info-row">
                    <span class="rc-lbl">Da</span>
                    <span class="rc-val">${c}</span>
                </div>
                <div class="rc-info-row">
                    <span class="rc-lbl">A</span>
                    <div class="rc-vals-wrap">${d}</div>
                </div>
            </div>

            <div class="rc-foot">
                <span class="rc-date">${Ge(i["DATA ORA"])}</span>
                ${p?"":`<span class="rc-msgcount">${t.length} <i class="fa-regular fa-comment"></i></span>`}
            </div>

            ${p?"":`
            <button class="rc-expand-btn" onclick="_toggleRcBody('${i.id_riga}', this)" title="Mostra/nascondi messaggi">
                <i class="fa-solid fa-chevron-down"></i>
                <span>${t.length===1?"1 messaggio":t.length+" messaggi"}</span>
            </button>

            <div id="rc-body-${i.id_riga}" class="rc-body">
                ${t.map(h=>{let w=String(h.DA).toUpperCase().trim()===e,v=String(h.MESSAGGIO||"").includes("|")?h.MESSAGGIO.split("|")[1]:h.MESSAGGIO,E=h["DATA ORA"]?Ge(h["DATA ORA"]):"";return`
                        <div class="chat-bubble-wrapper ${w?"sent":"received"}">
                            <div class="chat-bubble">
                                <div class="chat-bubble-name">${yt(h.DA)}</div>
                                <div class="chat-bubble-text">${v}</div>
                                ${E?`<span class="chat-bubble-time">${E}</span>`:""}
                            </div>
                        </div>`}).join("")}
            </div>`}

            ${o?"":`
                <div id="box-conferma-${i.id_riga}" class="box-conferma box-hidden">
                    <div class="box-message">Archiviare definitivamente questa discussione?</div>
                    <div class="box-actions">
                        <button onclick="toggleBoxArchivia('${i.id_riga}')" class="btn-cancel button-small">Annulla</button>
                        <button onclick="aggiornaRichiesta('${i.id_riga}', 'risolto', [${f}])" class="btn-archive-action button-small">S\xEC, Archivia</button>
                    </div>
                </div>

                <div id="box-risposta-${i.id_riga}" class="box-risposta box-hidden">
                    <div class="reply-wrapper">
                        <textarea id="input-risposta-${i.id_riga}" class="reply-input" placeholder="Scrivi una risposta..."></textarea>
                        <div class="reply-footer">
                            <span class="reply-hint"><i class="fa-regular fa-paper-plane"></i> Risposta a <b>${yt(n.DA).toUpperCase()===e?l.join(", "):yt(n.DA)}</b></span>
                            <button onclick="inviaRisposta('${i.id_riga}', '${a}', '${n.DA.toUpperCase().trim()===e?String(n.A||"").trim():n.DA}', '${s.replace(/'/g,"\\'")}')" class="btn-reply-send">
                                <i class="fa-solid fa-paper-plane"></i> Invia
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rc-actions">
                    <button onclick="_archiviaConferma('${i.id_riga}', ${JSON.stringify(t.map(h=>h.id_riga))})" class="rc-btn rc-btn-arch" title="Archivia"><i class="fa-solid fa-check"></i></button>
                    <button onclick="_sollecitaConferma('${i.id_riga}')" class="rc-btn rc-btn-soll" title="Sollecita"><i class="fa-solid fa-bullhorn"></i></button>
                    <button onclick="toggleAreaRisposta('${i.id_riga}')" class="rc-btn rc-btn-reply" title="Rispondi"><i class="fa-solid fa-reply"></i></button>
                    <button onclick="apriModalSollecito('${i.id_riga}', '${a}', '${s.replace(/'/g,"\\'")}', '${(i.RIFERIMENTO||"").replace(/'/g,"\\'")}');" class="rc-btn rc-btn-scad" title="Aggiungi scadenza"><i class="fa-solid fa-clock"></i></button>
                </div>`}
        </div>`}function mc(t,e){let o=document.getElementById("rc-body-"+t);if(!o)return;let i=o.classList.toggle("open");e&&e.classList.toggle("open",i)}function Vo(t){let e=String(t.MESSAGGIO||"").split("|");if(e.length>=2){let o=e[1]||"";if(o.startsWith("SCAD:")){let i=new Date(o.slice(5));if(!isNaN(i))return i}}return null}function Hn(t,e){let o=String(t.MESSAGGIO||"").split("|"),i=null,n="\u2013";if(o.length>=2){let f=o[1]||"";f.startsWith("SCAD:")&&(i=new Date(f.slice(5)),isNaN(i)&&(i=null)),n=o.slice(2).join("|").trim()||"\u2013"}let a=t.ORDINE||"\u2013",s=t.CLIENTE||"",r=t.PRODOTTO&&t.PRODOTTO!==""?t.PRODOTTO:"",c=yt(t.DA||""),l=t["DATA ORA"]||"",d="scad-ok",u="\u2013";if(i){let f=Math.ceil((i-new Date)/864e5);u=i.toLocaleDateString("it-IT",{day:"2-digit",month:"short",year:"numeric"}),f<0?d="scad-scaduta":f<=3?d="scad-urgente":f<=7?d="scad-vicina":d="scad-ok"}return`
    <div class="scad-card ${d}" data-id-riga="${String(t.id_riga||"")}" data-ordine="${X(a)}" data-cliente="${s.toLowerCase().replace(/"/g,"")}">
        <div class="scad-top">
            <div class="scad-ordine-wrap">
                <span class="rc-tipo rc-tipo-scadenza" title="Scadenza"><i class="fa-solid fa-clock"></i></span>
                <span class="rc-ordine">ORD.&nbsp;${a}</span>
                ${r?`<span class="scad-art">&bull; <b>${r}</b></span>`:'<span class="scad-art scad-int-ord">intero ordine</span>'}
            </div>
            <span class="scad-date-badge ${d}">${u}</span>
        </div>
        ${s?`<div class="rc-cliente">${s}</div>`:""}
        <div class="scad-nota">${n!=="\u2013"?n:'<span class="scad-no-nota">Nessuna nota</span>'}</div>
        <div class="rc-foot">
            <span class="rc-lbl">Da</span>
            <span class="rc-val">${c}</span>
            <span class="rc-date" style="margin-left:auto">${Ge(l)}</span>
        </div>
        <div class="rc-actions">
            <label class="scad-fab-pick" onclick="event.stopPropagation()" title="Seleziona questa scadenza per il fabbisogno">
                <input type="checkbox" class="scad-fab-chk" value="${X(a)}">
                <span>Fabbisogno</span>
            </label>
            <button onclick="aggiornaRichiesta('${t.id_riga}', 'risolto')" class="rc-btn rc-btn-arch" title="Archivia scadenza"><i class="fa-solid fa-check"></i></button>
        </div>
    </div>`}function jn(){window.chiudiModal=Wo,window.confermaInvioSupporto=Hr,window.setTipoAzione=Jo,window.chiudiModalSollecito=Ln,window.confermaInvioSollecito=Dr,window.apriNuovaRichiesta=Pn,window.apriModalAiuto=Br,window.apriModalSollecito=qr,window.toggleAreaRisposta=zn,window.toggleBoxArchivia=jr,window.inviaRisposta=Gr,window._selezionaOrdine=Fr,window.aggiornaBadgeRichieste=He,window.aggiornaBadgeSidebar=He,window.caricaRichieste=Ct,window._fetchDatiRichieste=Ee,window._renderDatiRichieste=Je,window._saveReqGroup=Mn,window._fabprodCardClick=Wr,window._fabprodApriModalOrdine=Jr,window._fabprodApriModalArticolo=Nn,window._fabprodVaiOrdine=Vr,window._aggiornaPannelloFabbisogno=Ut,window._apriModalFabbisognoSel=ic,window._applicaSelFabbisogno=nc,window._chiudiModalFabbisognoSel=Ko,window._fabprodDaScadenzeTutte=ac,window._fabprodDaScadenzeFlaggate=sc,window._fabprodStampaFabbisognoSel=Yr,window._fabprodSalvaSnapshotCondiviso=Xr,window._fabprodApriArchivioSnapshot=tc,window._fabprodChiudiArchivioSnapshot=Qo,window._fabprodApriSnapshotById=ec,window._fabprodArchiviaSnapshotById=oc,window._notificaFabbisognoNuovo=Qr,window.aggiornaRichiesta=Un,window._sollecitaConferma=pc,window._archiviaConferma=uc,window.sollecitaRichiesta=Fn,window.cambiaVistaUtente=cc,window._toggleRcBody=mc,window.formattaData=Ge,window.generaCardRichiesta=Go,window.generaCardScadenza=Hn,window._getScadDate=Vo}function Gn(){let t=document.getElementById("btn-nuova-richiesta");t&&t.addEventListener("click",function(o){o.stopPropagation(),Pn()});let e=document.getElementById("modalAiuto");e&&e.addEventListener("click",function(o){o.target===this&&(Date.now()-(this._openedAt||0)<800||Wo())}),document.addEventListener("click",function(o){o.target.closest(".req-card")||document.querySelectorAll(".box-risposta, .box-conferma").forEach(function(i){i.style.display!=="none"&&i.style.display!==""&&(i.style.opacity="0",i.style.transform="translateY(-10px)",setTimeout(function(){i.style.display="none"},300))})})}var Ue,Q,Fe,Bt,oe,te,ee,Rn,yt,Vn=W(()=>{ft();Pt();vt();be();gt();Qt();Zt();xt();Ue=[],Q=new Set,Fe=[],Bt=[],oe=null,te="",ee=[],Rn=null,yt=t=>window._normNome?window._normNome(t):t&&String(t).trim()});async function Jn(){return ct({azione:"getManuali"},1e4,{retries:2})}async function Wn(t){return ct({azione:"salvaManualeNuovo",...t},18e4,{noDedupe:!0})}async function Zn(t){return ct({azione:"aggiornaManuale",...t},18e4,{noDedupe:!0})}async function Qn(t){return ct({azione:"getStoricoManuale",id:t},1e4,{retries:2})}var Kn=W(()=>{"use strict";be()});function Ye(t){if(!t)return"-";let e=new Date(t);return Number.isNaN(e.getTime())?String(t):e.toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}function tt(t){let e=String(t||"").trim();return e&&(/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(e)||/^https?:\/\/[^\s]+$/i.test(e))?e:""}function Xe(t){return t&&t.sections&&t.sections._v===2?t.sections:null}function Ke(t,e,o){if(t){let i=o?`<button type="button" onclick="${o}" title="Rimuovi foto" style="position:absolute;top:-7px;right:-7px;background:#ef4444;border:none;color:#fff;width:22px;height:22px;border-radius:50%;font-size:1.1rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3)">&times;</button>`:"";return`<div class="foto-wrapper" style="position:relative;display:inline-block;max-width:100%;margin-bottom:6px"><img src="${t}" alt="${e}" style="max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0;display:block">${i}</div>`}return'<div class="text-xs text-slate-400" style="margin-bottom:6px">Nessuna foto</div>'}function xe(t){return`
    <input type="file" class="manuale-file-input" accept="image/*" onchange="${t}">
    <label class="manuale-file-label" onclick="this.previousElementSibling.click()"><i class="fas fa-upload"></i> Carica foto</label>`}function hc(t){let e=Xe(t),o=e?Array.isArray(e.procedimenti)?e.procedimenti.length:0:Array.isArray(t.steps)?t.steps.length:0,i=tt(t.copertina),n=i?`<img src="${i}" alt="copertina" class="w-full h-40 object-cover rounded-t-xl">`:'<div class="w-full h-40 bg-slate-100 rounded-t-xl flex items-center justify-center text-slate-400 text-3xl"><i class="fas fa-book-open"></i></div>';return`
    <article class="manuale-card materiale-card ${window.TW?.card||""} !p-0 overflow-hidden" data-codice="${y((t.titolo||"")+" "+(t.categoria||""))}">
        ${n}
        <div class="p-4">
            <div class="flex items-start justify-between gap-2">
                <div>
                    <h3 class="text-slate-900 font-semibold text-base">${y(t.titolo||"(Senza titolo)")}</h3>
                    <p class="text-xs text-slate-500 mt-1">${y(t.categoria||"Generale")}</p>
                </div>
                <span class="${window.TW?.pill||""}">v${Number(t.version||1)}</span>
            </div>
            <div class="mt-3 text-xs text-slate-600 space-y-1">
                <p><b>Procedimenti:</b> ${o}</p>
                <p><b>Aggiornato:</b> ${y(Ye(t.updatedAt))}</p>
                <p><b>Da:</b> ${y(t.updatedBy||"-")}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
                <button type="button" class="${window.TW?.btnPrimary||""}" onclick="apriManuale('${y(t.id)}')"><i class="fas fa-eye"></i> Apri</button>
                <button type="button" class="${window.TW?.btn||""}" onclick="stampaManuale('${y(t.id)}')"><i class="fas fa-print"></i> Stampa</button>
                <button type="button" class="${window.TW?.btn||""}" onclick="apriFormManuale('${y(t.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                <button type="button" class="${window.TW?.btn||""}" onclick="apriStoricoManuale('${y(t.id)}')"><i class="fas fa-clock-rotate-left"></i> Storico</button>
            </div>
        </div>
    </article>`}function Xn(){let t=document.getElementById("contenitore-dati");if(!t)return;let e=ne.map(hc).join(""),o=b?.nome?.toUpperCase().trim()==="ALESSIO";t.innerHTML=`
    <section class="manuali-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title">Manuali Prodotti</h3>
                <p class="acquisti-subtitle">Procedure operative interne con step fotografici</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                ${o?`<button type="button" onclick="importaPptx()" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;white-space:nowrap;line-height:1.2">
                    <i class="fas fa-file-powerpoint"></i><span class="btn-label-nuovo"> Importa PPTX</span>
                </button>`:""}
                <button type="button" class="btn-nuovo-fisso ${window.TW?.btnPrimaryLg||""}" onclick="apriFormManuale()">
                    <i class="fas fa-plus"></i><span class="btn-label-nuovo"> Nuovo manuale</span>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            ${e||'<div class="empty-msg">Nessun manuale disponibile.</div>'}
        </div>
    </section>

    <div id="manuali-modal-host"></div>
    <div id="manuali-storico-host"></div>`,z(t),window.aggiornaListaFiltrabili?.()}function bc(t,e,o){return`
    <div class="scheda-row" data-row-idx="${o}" data-voce="${y(t)}" style="display:grid;grid-template-columns:1fr 1fr 36px;gap:6px;align-items:center">
        <span style="padding:8px 10px;font-size:.875rem;font-weight:500;color:#334155">${y(t)}</span>
        <input type="text" class="input-field-modern" data-field="valore" placeholder="Valore" value="${y(e||"")}">
        <button type="button" class="${window.TW?.btnDanger||""}" onclick="rimuoviSchedaRow(${o})" title="Rimuovi"><i class="fas fa-trash"></i></button>
    </div>`}function ta(t,e,o){return`
    <div class="scheda-row scheda-row-custom" data-row-idx="${o}" style="display:grid;grid-template-columns:1fr 1fr 36px;gap:6px;align-items:center">
        <input type="text" class="input-field-modern" data-field="voce" placeholder="Caratteristica aggiuntiva" value="${y(t||"")}">
        <input type="text" class="input-field-modern" data-field="valore" placeholder="Valore" value="${y(e||"")}">
        <button type="button" class="${window.TW?.btnDanger||""}" onclick="rimuoviSchedaRow(${o})" title="Rimuovi"><i class="fas fa-trash"></i></button>
    </div>`}function ei(t,e){let o=tt(t&&t.foto||"");return`
    <div class="occorrente-item border border-slate-200 rounded-xl p-3 bg-white" data-item-idx="${e}"${o?` data-foto="${y(o)}"`:""}>
        <div style="display:grid;grid-template-columns:54px 1fr 1fr 36px;gap:6px;align-items:center;margin-bottom:8px">
            <input type="text" class="input-field-modern" data-field="lettera" placeholder="A" value="${y(t&&t.lettera||"")}" style="text-align:center;font-weight:700">
            <input type="text" class="input-field-modern" data-field="nome" placeholder="Nome componente" value="${y(t&&t.nome||"")}">
            <input type="text" class="input-field-modern" data-field="codice" placeholder="Codice (es. LB4PIY062B-1)" value="${y(t&&t.codice||"")}">
            <button type="button" class="${window.TW?.btnDanger||""}" onclick="rimuoviOccorrenteItem(${e})" title="Rimuovi"><i class="fas fa-trash"></i></button>
        </div>
        ${Ke(o,`occ-${e}`,"eliminaFotoOccorrente(this)")}
        ${xe(`cambiaFotoOccorrente(this, ${e})`)}
    </div>`}function oi(t,e){let o=tt(t&&t.foto||""),i=tt(t&&t.foto2||"");return`
    <div class="proc-step border border-slate-200 rounded-xl p-3 bg-white" data-step-idx="${e}">
        <div class="flex items-center justify-between" style="margin-bottom:8px">
            <h4 class="text-sm font-semibold text-slate-800">Step ${e+1}</h4>
            <button type="button" class="${window.TW?.btnDanger||""}" onclick="rimuoviProcStep(${e})"><i class="fas fa-trash"></i></button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px">
            <div class="proc-foto-slot" data-slot="1"${o?` data-foto="${y(o)}"`:""}>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:3px">Foto 1</div>
                ${Ke(o,`proc-${e}-1`,"eliminaFotoProcedimento(this)")}
                ${xe(`cambiaFotoProcedimento(this,${e},1)`)}
            </div>
            <div class="proc-foto-slot" data-slot="2"${i?` data-foto="${y(i)}"`:""}>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:3px">Foto 2 <span style="opacity:.6">(opzionale)</span></div>
                ${Ke(i,`proc-${e}-2`,"eliminaFotoProcedimento(this)")}
                ${xe(`cambiaFotoProcedimento(this,${e},2)`)}
            </div>
        </div>
        <textarea class="input-field-modern" data-field="descrizione" rows="3" placeholder="Descrizione del passaggio...">${y(t&&t.descrizione||"")}</textarea>
    </div>`}function yc(t){let e=tt(t||"");return`
    <div id="manuali-disegno-wrap"${e?` data-foto="${y(e)}"`:""} class="border border-slate-200 rounded-xl p-3 bg-white">
        ${Ke(e,"disegno-tecnico","eliminaFotoDisegno(this)")}
        ${xe("cambiaFotoDisegno(this)")}
    </div>`}function ae(t){return`<button type="button" class="manuali-modal-close" onclick="${t}" aria-label="Chiudi" title="Chiudi"><i class="fas fa-times"></i></button>`}function ii(t,e){let o=document.getElementById("manuali-modal-host");if(!o)return;let i=Xe(e),n=i?i.schedaTecnica||[]:[],a=i?i.occorrente||[]:[],s=i?i.procedimenti||[]:Array.isArray(e?.steps)?e.steps.map(function(v){return{descrizione:v.descrizione||v.titolo||"",foto:v.foto||""}}):[],r=i&&i.disegnoTecnico?.foto||"",c={},l=[];n.forEach(function(v){Yn.includes(v.voce)?c[v.voce]=v.valore:l.push(v)});let d=0,u=Yn.map(function(v){return bc(v,c[v]||"",d++)}).join("")+l.map(function(v){return ta(v.voce,v.valore,d++)}).join(""),f=a.length>0?a.map(function(v,E){return ei(v,E)}).join(""):ei(null,0),p=s.length>0?s.map(function(v,E){return oi(v,E)}).join(""):oi(null,0),m=tt(e?.copertina||""),h=m?`<img id="manuali-copertina-preview" src="${m}" alt="copertina" style="max-width:100%;max-height:200px;border-radius:10px;border:1px solid #e2e8f0;display:block;margin-bottom:6px">`:'<div id="manuali-copertina-preview" class="text-xs text-slate-400" style="margin-bottom:6px">Nessuna copertina</div>',w=(v,E)=>`<h3 style="font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#64748b;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #e2e8f0"><i class="${v}"></i> &nbsp;${E}</h3>`;o.innerHTML=`
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
            <div class="modal-content manuali-modal-box" style="width:90vw;max-width:1280px;max-height:90vh;overflow-y:auto;">
                ${ae("chiudiFormManuale()")}
        <h2 style="margin-bottom:20px">${t==="edit"?"Modifica manuale":"Nuovo manuale"}</h2>

        <!-- \u2460 COPERTINA E INFO -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          ${w("fas fa-image","Copertina e info")}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div>
              <label class="modal-label">Titolo manuale *</label>
              <input id="manuali-titolo" class="input-field-modern" type="text" value="${y(e?.titolo||"")}" placeholder="Es. BONA 7/12">
            </div>
            <div>
              <label class="modal-label">Categoria</label>
              <input id="manuali-categoria" class="input-field-modern" type="text" value="${y(e?.categoria||"")}" placeholder="Es. Lampade a Picchetto">
            </div>
          </div>
          <label class="modal-label">Immagine di copertina</label>
          <div id="manuali-copertina-wrap"${m?` data-copertina="${y(m)}"`:""}>
            ${h}
            ${xe("cambiaCopertina(this)")}
          </div>
        </div>

        <!-- \u2461 SCHEDA TECNICA -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            ${w("fas fa-table","Scheda Tecnica")}
            <button type="button" class="${window.TW?.btn||""}" onclick="aggiungiSchedaRow()" style="margin-bottom:10px"><i class="fas fa-plus"></i> Aggiungi voce</button>
          </div>
          <div id="manuali-scheda-edit" class="grid gap-2">${u}</div>
        </div>

        <!-- \u2462 MATERIALE OCCORRENTE -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            ${w("fas fa-boxes-stacked","Materiale Occorrente")}
            <button type="button" class="${window.TW?.btn||""}" onclick="aggiungiOccorrenteItem()" style="margin-bottom:10px"><i class="fas fa-plus"></i> Aggiungi</button>
          </div>
          <div id="manuali-occorrente-edit" class="grid gap-3">${f}</div>
        </div>

        <!-- \u2463 PROCEDIMENTO -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            ${w("fas fa-list-check","Procedimento")}
            <button type="button" class="${window.TW?.btn||""}" onclick="aggiungiProcStep()" style="margin-bottom:10px"><i class="fas fa-plus"></i> Aggiungi step</button>
          </div>
          <div id="manuali-proc-edit" class="grid gap-3">${p}</div>
        </div>

        <!-- \u2464 DISEGNO TECNICO -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          ${w("fas fa-drafting-compass","Disegno Tecnico")}
          ${yc(r)}
        </div>

        <div class="modal-actions" style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" class="btn-modal-send" onclick="salvaManualeCorrente()"><i class="fas fa-save"></i> Salva manuale</button>
        </div>
      </div>
    </div>`,Qe=t==="edit"&&e?.id||null}function wc(){let t=[];document.querySelectorAll("#manuali-scheda-edit .scheda-row").forEach(function(a){let s=String(a.getAttribute("data-voce")||a.querySelector('[data-field="voce"]')?.value||"").trim(),r=String(a.querySelector('[data-field="valore"]')?.value||"").trim();(s||r)&&t.push({voce:s,valore:r})});let e=[];document.querySelectorAll("#manuali-occorrente-edit .occorrente-item").forEach(function(a){let s=String(a.querySelector('[data-field="lettera"]')?.value||"").trim(),r=String(a.querySelector('[data-field="nome"]')?.value||"").trim(),c=String(a.querySelector('[data-field="codice"]')?.value||"").trim(),l=String(a.getAttribute("data-foto")||"").trim();(s||r||c||l)&&e.push({lettera:s,nome:r,codice:c,foto:l})});let o=[];document.querySelectorAll("#manuali-proc-edit .proc-step").forEach(function(a){let s=String(a.querySelector('[data-field="descrizione"]')?.value||"").trim(),r=a.querySelector('.proc-foto-slot[data-slot="1"]'),c=a.querySelector('.proc-foto-slot[data-slot="2"]'),l=String(r?.getAttribute("data-foto")||a.getAttribute("data-foto")||"").trim(),d=String(c?.getAttribute("data-foto")||"").trim();(s||l||d)&&o.push({descrizione:s,foto:l,foto2:d})});let i=document.getElementById("manuali-disegno-wrap"),n={foto:String(i?.getAttribute("data-foto")||"").trim()};return{_v:2,schedaTecnica:t,occorrente:e,procedimenti:o,disegnoTecnico:n}}async function ea(t){return new Promise(function(e,o){let i=new FileReader;i.onload=function(){e(String(i.result||""))},i.onerror=o,i.readAsDataURL(t)})}async function oa(t,e=1200){return new Promise(function(o){let i=new Image;i.onload=function(){let n=Math.min(e/i.width,e/i.height,1),a=document.createElement("canvas");a.width=Math.max(1,Math.round(i.width*n)),a.height=Math.max(1,Math.round(i.height*n));let s=a.getContext("2d");if(!s)return o(t);s.drawImage(i,0,0,a.width,a.height),o(a.toDataURL("image/jpeg",.8))},i.onerror=function(){o(t)},i.src=t})}async function Sc(t,e=800){return new Promise(function(o){let i=new Image;i.onload=function(){let n=Math.min(i.width,i.height),a=Math.round((i.width-n)/2),s=Math.round((i.height-n)/2),r=Math.min(n,e),c=document.createElement("canvas");c.width=r,c.height=r;let l=c.getContext("2d");if(!l)return o(t);l.drawImage(i,a,s,n,n,0,0,r,r),o(c.toDataURL("image/jpeg",.8))},i.onerror=function(){o(t)},i.src=t})}async function _c(t){try{let e=t?.files&&t.files[0];if(!e)return;let o=await ea(e),i=await oa(o,800);if(!i||i.length>ni){g("Immagine di copertina troppo grande, riduci la risoluzione.","warning");return}let n=document.getElementById("manuali-copertina-wrap");if(!n)return;n.setAttribute("data-copertina",i);let a=n.querySelector("img");if(a)a.src=i;else{let s=n.querySelector("#manuali-copertina-preview");s&&s.remove();let r=document.createElement("img");r.id="manuali-copertina-preview",r.src=i,r.alt="copertina",r.style.cssText="max-width:100%;max-height:200px;border-radius:10px;border:1px solid #e2e8f0;display:block;margin-bottom:6px",n.insertBefore(r,n.firstChild)}}catch{g("Errore nel caricamento immagine di copertina.","error")}}async function ai(t,e){try{let o=await ea(t),i=await oa(o,800);if(!i||i.length>ni){g("Immagine troppo grande, riduci la risoluzione.","warning");return}e(i)}catch{g("Errore nel caricamento immagine.","error")}}function si(t,e,o){t.setAttribute("data-foto",e);let i=t.querySelector(".foto-wrapper");if(i){i.querySelector("img").src=e;return}let n=t.querySelector("img");if(n){n.src=e;return}let a=t.querySelector("div.text-xs");a&&a.remove();let s=document.createElement("div");s.className="foto-wrapper",s.style.cssText="position:relative;display:inline-block;max-width:100%;margin-bottom:6px";let r=document.createElement("img");r.src=e,r.style.cssText="max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0;display:block",s.appendChild(r),o&&s.insertAdjacentHTML("beforeend",`<button type="button" onclick="${o}" title="Rimuovi foto" style="position:absolute;top:-7px;right:-7px;background:#ef4444;border:none;color:#fff;width:22px;height:22px;border-radius:50%;font-size:1.1rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3)">&times;</button>`);let c=t.querySelector(".manuale-file-input")||t.querySelector('input[type="file"]');t.insertBefore(s,c)}function ri(t){t.removeAttribute("data-foto");let e=t.querySelector(".foto-wrapper");if(e){let o=document.createElement("div");o.className="text-xs text-slate-400",o.style.marginBottom="6px",o.textContent="Nessuna foto",e.replaceWith(o)}}async function Ec(t,e){let o=t?.files&&t.files[0];o&&await ai(o,function(i){let n=document.querySelector(`.occorrente-item[data-item-idx="${e}"]`);n&&si(n,i,"eliminaFotoOccorrente(this)")})}async function xc(t,e,o){let i=t?.files&&t.files[0];i&&await ai(i,function(n){let a=document.querySelector(`.proc-step[data-step-idx="${e}"]`);if(!a)return;let s=a.querySelector(`.proc-foto-slot[data-slot="${o||1}"]`)||a;si(s,n,"eliminaFotoProcedimento(this)")})}async function Ic(t){let e=t?.files&&t.files[0];e&&await ai(e,function(o){let i=document.getElementById("manuali-disegno-wrap");i&&si(i,o,"eliminaFotoDisegno(this)")})}function Ac(t){se("Rimuovere la foto da questo elemento?",function(){let e=t.closest(".occorrente-item");e&&ri(e)})}function Cc(t){se("Rimuovere la foto da questo step?",function(){let e=t.closest(".proc-foto-slot")||t.closest(".proc-step");e&&ri(e)})}function Oc(t){se("Rimuovere la foto del disegno tecnico?",function(){let e=document.getElementById("manuali-disegno-wrap");e&&ri(e)})}function $c(t){if(!t){ii("new",null);return}let e=Ht[t];if(!e){g("Manuale non trovato.","warning");return}ii("edit",e)}function ia(){let t=document.getElementById("manuali-modal");t&&t.parentElement&&(t.parentElement.innerHTML=""),Qe=null}function se(t,e){let o=document.getElementById("manuali-confirm-overlay");o&&o.remove();let i=document.createElement("div");i.id="manuali-confirm-overlay",i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:11000;display:flex;align-items:center;justify-content:center",i.innerHTML=`
    <div style="background:#fff;border-radius:16px;padding:28px 32px;max-width:380px;width:90%;box-shadow:0 20px 40px rgba(0,0,0,0.18);text-align:center">
        <div style="font-size:2rem;margin-bottom:12px">\u{1F5D1}\uFE0F</div>
        <p style="font-size:.95rem;font-weight:600;color:#1e293b;margin-bottom:20px">${t}</p>
        <div style="display:flex;gap:10px;justify-content:center">
            <button id="manuali-confirm-no" class="btn-modal-cancel" style="min-width:100px">Annulla</button>
            <button id="manuali-confirm-si" class="btn-modal-send" style="min-width:100px;background:#ef4444">Elimina</button>
        </div>
    </div>`,document.body.appendChild(i),document.getElementById("manuali-confirm-no").onclick=function(){i.remove()},document.getElementById("manuali-confirm-si").onclick=function(){i.remove(),e()},i.addEventListener("click",function(n){n.target===i&&i.remove()})}function na(t,e,o,i,n){let a=document.querySelector(t);a&&a.querySelectorAll(e).forEach(function(s,r){s.setAttribute(o,String(r));let c=s.querySelector("button");if(c&&c.setAttribute("onclick",`${i}(${r})`),n){let l=s.querySelector('input[type="file"]');l&&l.setAttribute("onchange",`${n}(this, ${r})`)}})}function Tc(){let t=document.getElementById("manuali-scheda-edit");if(!t)return;let e=t.querySelectorAll(".scheda-row").length;if(e>=gc){g("Numero massimo voci raggiunto.","warning");return}t.insertAdjacentHTML("beforeend",ta("","",e))}function Rc(t){se("Eliminare questa voce dalla scheda tecnica?",function(){let e=document.querySelector(`.scheda-row[data-row-idx="${t}"]`);e&&e.remove(),na("#manuali-scheda-edit",".scheda-row","data-row-idx","rimuoviSchedaRow",null)})}function kc(){let t=document.getElementById("manuali-occorrente-edit");if(!t)return;let e=t.querySelectorAll(".occorrente-item").length;if(e>=vc){g("Numero massimo elementi raggiunto.","warning");return}t.insertAdjacentHTML("beforeend",ei({lettera:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[e]||"",nome:"",codice:"",foto:""},e))}function Lc(t){se("Eliminare questo elemento dal materiale occorrente?",function(){let e=document.querySelector(`.occorrente-item[data-item-idx="${t}"]`);e&&e.remove(),na("#manuali-occorrente-edit",".occorrente-item","data-item-idx","rimuoviOccorrenteItem","cambiaFotoOccorrente")})}function Pc(){let t=document.getElementById("manuali-proc-edit");if(!t)return;let e=t.querySelectorAll(".proc-step").length;if(e>=fc){g("Numero massimo step raggiunto.","warning");return}t.insertAdjacentHTML("beforeend",oi(null,e))}function zc(t){se("Eliminare questo step del procedimento?",function(){let e=document.querySelector(`.proc-step[data-step-idx="${t}"]`);e&&e.remove();let o=document.getElementById("manuali-proc-edit");o&&o.querySelectorAll(".proc-step").forEach(function(i,n){i.setAttribute("data-step-idx",String(n));let a=i.querySelector("h4");a&&(a.textContent="Step "+(n+1));let s=i.querySelector("button");s&&s.setAttribute("onclick",`rimuoviProcStep(${n})`);let r=i.querySelector('input[type="file"]');r&&r.setAttribute("onchange",`cambiaFotoProcedimento(this, ${n})`)})})}async function Mc(){let t=String(document.getElementById("manuali-titolo")?.value||"").trim(),e=String(document.getElementById("manuali-categoria")?.value||"").trim(),o=String(document.getElementById("manuali-copertina-wrap")?.getAttribute("data-copertina")||"").trim(),i=wc();if(!t){g("Inserisci un titolo manuale.","warning");return}try{g("Salvataggio manuale in corso...","info");let n;if(Qe?n=await Zn({id:Qe,titolo:t,categoria:e,copertina:o,sections:i}):n=await Wn({titolo:t,categoria:e,copertina:o,sections:i}),!n||n.status!=="ok")throw new Error(n&&(n.message||n.msg)||"Errore salvataggio manuale");await N.invalidate(Xo),delete window.cacheContenuti?.MANUALI_PRODOTTI,delete window.cacheFetchTime?.MANUALI_PRODOTTI,ia(),await to(null,null,!1),g("Manuale salvato correttamente.","success")}catch(n){let a=n&&n.name==="TimeoutError"?"Il salvataggio sta impiegando troppo tempo. Riprova con meno immagini.":n&&n.name==="AbortError"?"Richiesta interrotta. Controlla la connessione e riprova.":n&&n.message||"Errore durante il salvataggio.";g(a,"error")}}function Nc(t){let e=Xe(t),o=e?e.schedaTecnica||[]:[],i=e?e.occorrente||[]:[],n=e?e.procedimenti||[]:Array.isArray(t.steps)?t.steps.map(function(a){return{descrizione:String(a.descrizione||a.titolo||"").trim(),foto:String(a.foto||"").trim(),foto2:""}}):[];return{titolo:String(t.titolo||"(Senza titolo)"),categoria:String(t.categoria||"Generale"),versione:Number(t.version||1),aggiornato:Ye(t.updatedAt),copertina:tt(t.copertina),schedaTecnica:Array.isArray(o)?o:[],occorrente:Array.isArray(i)?i:[],procedimenti:Array.isArray(n)?n:[],disegnoTecnico:tt(e?.disegnoTecnico?.foto||"")}}function ie(t){return`<div class="man-print-placeholder">${y(t||"Sezione non disponibile")}</div>`}function qc(t){let e=Nc(t),o=e.copertina?`<img class="man-cover-image" src="${e.copertina}" alt="copertina manuale">`:ie("Copertina non disponibile"),i=e.schedaTecnica.map(function(r){return`<tr>
                <td>${y(r?.voce||"")}</td>
                <td>${y(r?.valore||"")}</td>
            </tr>`}).join(""),n=e.occorrente.map(function(r){let c=tt(r?.foto||""),l=c?`<img src="${c}" alt="${y(r?.nome||"componente")}" class="man-occ-image">`:'<div class="man-occ-image man-occ-image--empty">Immagine non disponibile</div>';return`<article class="man-occ-card">
                <div class="man-occ-head">
                    <span class="man-occ-letter">${y(r?.lettera||"?")}</span>
                    <div>
                        <h4>${y(r?.nome||"Componente")}</h4>
                        <p>${y(r?.codice||"Codice non disponibile")}</p>
                    </div>
                </div>
                ${l}
            </article>`}).join(""),a=e.procedimenti.map(function(r,c){let l=tt(r?.foto||""),d=tt(r?.foto2||""),u=[l,d].filter(Boolean),f=u.length?`<div class="man-proc-photos">${u.map(function(p){return`<img src="${p}" alt="step-${c+1}">`}).join("")}</div>`:ie("Immagini step non disponibili");return`<article class="man-proc-step">
                <div class="man-proc-num">${c+1}</div>
                <div class="man-proc-body">
                    ${f}
                    <p>${y(r?.descrizione||"Descrizione non disponibile")}</p>
                </div>
            </article>`}).join(""),s=e.disegnoTecnico?`<img class="man-dt-image" src="${e.disegnoTecnico}" alt="disegno tecnico">`:ie("Disegno tecnico non disponibile");return`<!doctype html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Libretto Istruzioni - ${y(e.titolo)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --ink: #0f172a;
            --muted: #64748b;
            --line: #cbd5e1;
            --paper: #ffffff;
            --brand: #1e293b;
            --soft: #f8fafc;
        }
        * { box-sizing: border-box; }
        html, body {
            margin: 0;
            padding: 0;
            background: #e2e8f0;
            color: var(--ink);
            font-family: 'Roboto', system-ui, sans-serif;
        }
        .man-print-toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 12px 18px;
            background: rgba(15, 23, 42, 0.96);
            color: #e2e8f0;
        }
        .man-print-toolbar button {
            border: 1px solid rgba(255,255,255,0.18);
            background: #1e293b;
            color: #fff;
            border-radius: 10px;
            padding: 9px 14px;
            font-weight: 700;
            cursor: pointer;
        }
        .man-print-stage {
            padding: 16px;
            display: grid;
            gap: 14px;
        }
        .man-print-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: var(--paper);
            box-shadow: 0 16px 36px rgba(15, 23, 42, 0.15);
            padding: 16mm 14mm 14mm;
        }
        .man-brand {
            font-size: 10px;
            letter-spacing: 0.16em;
            font-weight: 700;
            color: var(--brand);
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .man-title {
            font-family: 'Lora', serif;
            font-size: 34px;
            line-height: 1.2;
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
        }
        .man-sub {
            margin-top: 7px;
            color: var(--muted);
            font-size: 14px;
        }
        .man-cover-block {
            margin-top: 16px;
            border: 1px solid var(--line);
            border-radius: 12px;
            background: var(--soft);
            padding: 10px;
            min-height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .man-cover-image {
            max-width: 100%;
            max-height: 190mm;
            object-fit: contain;
            border-radius: 10px;
        }
        .man-page-title {
            margin: 0 0 10px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--brand);
            border-bottom: 2px solid var(--line);
            padding-bottom: 6px;
        }
        .man-print-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid var(--line);
        }
        .man-print-table th, .man-print-table td {
            border: 1px solid var(--line);
            padding: 8px;
            text-align: left;
            vertical-align: top;
            font-size: 12px;
        }
        .man-print-table th {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            background: var(--soft);
        }
        .man-dt-image {
            width: 100%;
            border: 1px solid var(--line);
            border-radius: 10px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .man-occ-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .man-occ-card {
            border: 1px solid var(--line);
            border-radius: 10px;
            padding: 9px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .man-occ-head {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 7px;
        }
        .man-occ-letter {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: var(--brand);
            color: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 12px;
            flex-shrink: 0;
        }
        .man-occ-head h4 {
            margin: 0;
            font-size: 13px;
        }
        .man-occ-head p {
            margin: 2px 0 0;
            color: var(--muted);
            font-size: 11px;
        }
        .man-occ-image {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            border: 1px solid var(--line);
            border-radius: 8px;
        }
        .man-occ-image--empty {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--muted);
            font-size: 11px;
            background: var(--soft);
        }
        .man-proc-step {
            display: grid;
            grid-template-columns: 52px 1fr;
            gap: 10px;
            border: 1px solid var(--line);
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 10px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .man-proc-num {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: 2px solid var(--brand);
            color: var(--brand);
            font-weight: 700;
            font-size: 17px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 4px;
        }
        .man-proc-photos {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 7px;
            margin-bottom: 7px;
        }
        .man-proc-photos img {
            width: 100%;
            border: 1px solid var(--line);
            border-radius: 8px;
            object-fit: cover;
            min-height: 120px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .man-proc-body p {
            margin: 0;
            white-space: pre-wrap;
            font-size: 12px;
            line-height: 1.45;
        }
        .man-print-placeholder {
            border: 1px dashed var(--line);
            border-radius: 10px;
            background: var(--soft);
            color: var(--muted);
            padding: 12px;
            text-align: center;
            font-size: 12px;
        }
        .man-page-footer {
            margin-top: 10px;
            border-top: 1px solid var(--line);
            padding-top: 6px;
            color: var(--muted);
            font-size: 10px;
        }
        .man-break { page-break-before: always; break-before: page; }
        @page {
            size: A4;
            margin: 12mm;
        }
        @media print {
            html, body { background: #fff; }
            .man-print-toolbar { display: none !important; }
            .man-print-stage { padding: 0; gap: 0; }
            .man-print-page {
                width: auto;
                min-height: auto;
                margin: 0;
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="man-print-toolbar">
        <strong>Libretto istruzioni: ${y(e.titolo)}</strong>
        <div style="display:flex;gap:8px">
            <button type="button" onclick="window.print()">Stampa</button>
            <button type="button" onclick="window.close()">Chiudi</button>
        </div>
    </div>

    <div class="man-print-stage">
        <section class="man-print-page">
            <div class="man-brand">OMBRE1 SRL</div>
            <h1 class="man-title">${y(e.titolo)}</h1>
            <p class="man-sub">${y(e.categoria)} \xB7 Manuale operativo \xB7 Rev. ${e.versione}</p>
            <p class="man-sub">Aggiornamento: ${y(e.aggiornato)}</p>
            <div class="man-cover-block">${o}</div>
            <div class="man-page-footer">Libretto istruzioni produzione - OMBRE1 SRL</div>
        </section>

        <section class="man-print-page man-break">
            <div class="man-brand">OMBRE1 SRL</div>
            <h2 class="man-page-title">Scheda tecnica</h2>
            ${i?`<table class="man-print-table"><thead><tr><th>Caratteristica</th><th>Valore</th></tr></thead><tbody>${i}</tbody></table>`:ie("Scheda tecnica non disponibile")}
            <div class="man-page-footer">Sezione tecnica</div>
        </section>

        <section class="man-print-page man-break">
            <div class="man-brand">OMBRE1 SRL</div>
            <h2 class="man-page-title">Disegno tecnico</h2>
            ${s}
            <div class="man-page-footer">Sezione disegno tecnico</div>
        </section>

        <section class="man-print-page man-break">
            <div class="man-brand">OMBRE1 SRL</div>
            <h2 class="man-page-title">Materiale occorrente</h2>
            ${n?`<div class="man-occ-grid">${n}</div>`:ie("Materiale occorrente non disponibile")}
            <div class="man-page-footer">Sezione materiali</div>
        </section>

        <section class="man-print-page man-break">
            <div class="man-brand">OMBRE1 SRL</div>
            <h2 class="man-page-title">Procedimento</h2>
            ${a||ie("Procedimento non disponibile")}
            <div class="man-page-footer">Sezione step operativi</div>
        </section>
    </div>
</body>
</html>`}function Dc(t){let e=Ht[t];if(!e){g("Manuale non trovato.","error");return}let o=window.open("","_blank");if(!o){g("Popup bloccato dal browser. Consenti le finestre popup per stampare.","warning");return}o.document.open(),o.document.write(qc(e)),o.document.close()}function Bc(t){let e=Ht[t];if(!e)return;let o=document.getElementById("manuali-modal-host");if(!o)return;let i=tt(e.copertina),n=i?`<img src="${i}" alt="copertina" style="max-width:100%;max-height:260px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:16px">`:"",a=(c,l)=>`<h3 style="font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#64748b;margin:18px 0 8px;padding-bottom:6px;border-bottom:2px solid #e2e8f0"><i class="${c}"></i> &nbsp;${l}</h3>`,s=Xe(e),r="";if(s){let c=(s.schedaTecnica||[]).map(function(f){return`<tr>
                <td style="padding:7px 10px;font-weight:500;color:#334155;border-bottom:1px solid #f1f5f9">${y(f.voce||"")}</td>
                <td style="padding:7px 10px;color:#64748b;border-bottom:1px solid #f1f5f9">${y(f.valore||"")}</td>
            </tr>`}).join("");c&&(r+=a("fas fa-table","Scheda Tecnica")+`
            <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
                <thead><tr style="background:#f8fafc">
                    <th style="padding:7px 10px;text-align:left;font-size:.75rem;color:#94a3b8;font-weight:600">Caratteristica</th>
                    <th style="padding:7px 10px;text-align:left;font-size:.75rem;color:#94a3b8;font-weight:600">Valore</th>
                </tr></thead>
                <tbody>${c}</tbody>
            </table>`),Ze=[];let l=(s.occorrente||[]).map(function(f){let p=tt(f.foto||""),m=-1;return p&&(Ze.push({lettera:f.lettera||"",nome:f.nome||"",foto:p}),m=Ze.length-1),`<div ${p?`onclick="_apriLightboxOcc_(${m})"`:""} style="${`padding:10px;border:1px solid #e2e8f0;border-radius:10px;background:#fff${p?";cursor:pointer":""}`}">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:${p?"8px":"0"}">
                    <span style="min-width:28px;height:28px;border-radius:50%;background:#1e293b;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem">${y(f.lettera||"")}</span>
                    <div>
                        <strong class="text-sm">${y(f.nome||"")}</strong>
                        ${f.codice?`<br><span class="text-xs text-slate-400">${y(f.codice)}</span>`:""}
                    </div>
                </div>
                ${p?`<img src="${p}" alt="occ" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;pointer-events:none">`:""}
            </div>`}).join("");l&&(r+=a("fas fa-boxes-stacked","Materiale Occorrente")+`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">${l}</div>`);let d=(s.procedimenti||[]).map(function(f,p){let m=tt(f.foto||""),h=tt(f.foto2||""),w=[m,h].filter(Boolean),v=w.length?`<div style="display:grid;grid-template-columns:repeat(${w.length},1fr);gap:6px;margin-bottom:6px">${w.map(E=>`<img src="${E}" style="width:100%;border-radius:10px;border:1px solid #e2e8f0">`).join("")}</div>`:"";return`<details class="border border-slate-200 rounded-xl p-3 bg-white" ${p===0?"open":""}>
                <summary class="cursor-pointer font-semibold text-slate-800">Step ${p+1}</summary>
                <div class="mt-2 grid gap-2">
                    ${v}
                    <p class="text-sm text-slate-700">${y(f.descrizione||"-")}</p>
                </div>
            </details>`}).join("");d&&(r+=a("fas fa-list-check","Procedimento")+`<div class="grid gap-2">${d}</div>`);let u=tt(s.disegnoTecnico?.foto||"");u&&(r+=a("fas fa-drafting-compass","Disegno Tecnico")+`<img src="${u}" alt="disegno-tecnico" style="max-width:100%;border-radius:10px;border:1px solid #e2e8f0">`)}else r=(e.steps||[]).map(function(c,l){let d=tt(c.foto),u=d?`<img src="${d}" alt="step-${l+1}" style="max-width:100%;border-radius:10px;border:1px solid #e2e8f0">`:'<div class="text-xs text-slate-400">Nessuna immagine</div>';return`
            <details class="border border-slate-200 rounded-xl p-3 bg-white" ${l===0?"open":""}>
                <summary class="cursor-pointer font-semibold text-slate-800">Step ${l+1}${c.titolo?" - "+y(c.titolo):""}</summary>
                <div class="mt-2 grid gap-2">
                    ${u}
                    <p class="text-sm text-slate-700">${y(c.descrizione||"-")}</p>
                </div>
            </details>`}).join("");o.innerHTML=`
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
            <div class="modal-content manuali-modal-box" style="width:90vw;max-width:1200px;max-height:90vh;overflow:auto;">
                ${ae("chiudiFormManuale()")}
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
            <div>
                <h2>${y(e.titolo||"(Senza titolo)")}</h2>
                <p class="text-xs text-slate-500 mb-3">${y(e.categoria||"Generale")} \xB7 v${Number(e.version||1)} \xB7 aggiornato ${y(Ye(e.updatedAt))}</p>
            </div>
            <button type="button" class="${window.TW?.btn||""}" onclick="stampaManuale('${y(e.id)}')"><i class="fas fa-print"></i> Stampa</button>
        </div>
        ${n}
        <div>${r||'<div class="empty-msg">Nessun contenuto disponibile.</div>'}</div>
      </div>
    </div>`}async function Uc(t){let e=document.getElementById("manuali-storico-host");if(e){e.innerHTML=`
    <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
            <div class="modal-content manuali-modal-box" style="max-width:980px;max-height:90vh;overflow:auto;">
                ${ae("chiudiStoricoManuale()")}
        <h2>Storico versioni</h2>
        <div class="centered-msg">Caricamento storico...</div>
      </div>
    </div>`;try{let o=await Qn(t);if(!o||o.status!=="ok")throw new Error("Storico non disponibile");let n=(Array.isArray(o.storico)?o.storico:[]).map(function(a,s){let r=a.snapshot||{},c=Array.isArray(r.steps)?r.steps.length:0;return`
            <details class="border border-slate-200 rounded-xl p-3 bg-white" ${s===0?"open":""}>
                <summary class="cursor-pointer font-semibold text-slate-800">
                    v${Number(a.version||0)} \xB7 ${y(a.changeType||"UPDATE")} \xB7 ${y(Ye(a.changedAt))}
                </summary>
                <div class="mt-2 text-sm text-slate-700 grid gap-1">
                    <p><b>Titolo:</b> ${y(r.titolo||"-")}</p>
                    <p><b>Categoria:</b> ${y(r.categoria||"-")}</p>
                    <p><b>Step:</b> ${c}</p>
                    <p><b>Utente:</b> ${y(a.changedBy||"-")}</p>
                </div>
            </details>`}).join("");e.innerHTML=`
        <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
                    <div class="modal-content manuali-modal-box" style="max-width:980px;max-height:90vh;overflow:auto;">
                        ${ae("chiudiStoricoManuale()")}
            <h2>Storico versioni</h2>
            <div class="grid gap-2">${n||'<div class="empty-msg">Nessuna versione trovata.</div>'}</div>
          </div>
        </div>`}catch{e.innerHTML=`
        <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
                    <div class="modal-content manuali-modal-box" style="max-width:760px;max-height:90vh;overflow:auto;">
                        ${ae("chiudiStoricoManuale()")}
            <h2>Storico versioni</h2>
            <div class="centered-error-bold">Errore nel caricamento storico.</div>
          </div>
        </div>`}}}function Fc(){let t=document.getElementById("manuali-storico-host");t&&(t.innerHTML="")}async function to(t=null,e=null,o=!1){let i=document.getElementById("contenitore-dati");if(i){o||(i.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento manuali...</div>");try{let n=null;if(!o)try{n=await N.get(Xo)}catch{}if(n&&Array.isArray(n.manuali)&&n.manuali.length&&(ne=n.manuali,Ht={},ne.forEach(function(s){Ht[s.id]=s}),Xn(),!o))return;let a=await Jn();if(e?.aborted)return;if(!a||a.status!=="ok")throw new Error(a&&(a.message||a.msg)||"Errore caricamento manuali");ne=Array.isArray(a.manuali)?a.manuali:[],Ht={},ne.forEach(function(s){Ht[s.id]=s}),await N.set(Xo,{manuali:ne}),Xn(),window.cacheContenuti&&(window.cacheContenuti.MANUALI_PRODOTTI=i.innerHTML),window.cacheFetchTime&&(window.cacheFetchTime.MANUALI_PRODOTTI=Date.now())}catch(n){if(console.error("[manuali] Errore caricaManuali:",n&&n.message?n.message:String(n),n),o)return;i.innerHTML="<div class='centered-error-bold'>Errore nel caricamento manuali.<br><small style='font-size:.75rem;color:#666'>"+y(n&&n.message||"sconosciuto")+"</small></div>"}}}function Hc(t){let e=Ze;if(!e.length)return;let o=t;function i(){let u=document.getElementById("_occ_lightbox");u&&u.remove(),document.removeEventListener("keydown",s)}function n(u){o=u;let f=e[u];document.getElementById("_occ_lb_img").src=f.foto,document.getElementById("_occ_lb_badge").textContent=f.lettera,document.getElementById("_occ_lb_nome").textContent=f.nome,document.getElementById("_occ_lb_counter").textContent=e.length>1?`${u+1} / ${e.length}`:""}function a(u){n((o+u+e.length)%e.length)}function s(u){u.key==="ArrowLeft"?a(-1):u.key==="ArrowRight"?a(1):u.key==="Escape"&&i()}document.getElementById("_occ_lightbox")?.remove(),window._occLbKeyHandler&&document.removeEventListener("keydown",window._occLbKeyHandler);let r=e.length>1,c="background:rgba(255,255,255,.15);border:none;color:#fff;width:48px;height:48px;border-radius:50%;font-size:1.8rem;cursor:pointer;flex-shrink:0;line-height:1;display:flex;align-items:center;justify-content:center;",l=document.createElement("div");l.id="_occ_lightbox",l.style.cssText="position:fixed;z-index:99999;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center",l.innerHTML=`
      <button id="_occ_lb_close" style="position:absolute;top:14px;right:18px;background:none;border:none;color:#fff;font-size:2rem;line-height:1;cursor:pointer;opacity:.75;padding:4px 8px">&#10005;</button>
      <div style="display:flex;align-items:center;gap:12px;width:92vw;max-width:880px">
        <button id="_occ_lb_prev" style="${c}${r?"":"visibility:hidden"}">&#8249;</button>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;min-width:0">
          <div style="display:flex;align-items:center;gap:10px">
            <span id="_occ_lb_badge" style="min-width:36px;height:36px;border-radius:50%;background:#fff;color:#1e293b;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem"></span>
            <span id="_occ_lb_nome" style="color:#fff;font-weight:600;font-size:1rem"></span>
          </div>
          <img id="_occ_lb_img" src="" alt="" style="max-width:100%;max-height:72vh;border-radius:12px;object-fit:contain">
          <span id="_occ_lb_counter" style="color:#94a3b8;font-size:.85rem"></span>
        </div>
        <button id="_occ_lb_next" style="${c}${r?"":"visibility:hidden"}">&#8250;</button>
      </div>`,document.body.appendChild(l),document.getElementById("_occ_lb_close").addEventListener("click",i),document.getElementById("_occ_lb_prev").addEventListener("click",function(){a(-1)}),document.getElementById("_occ_lb_next").addEventListener("click",function(){a(1)}),l.addEventListener("click",function(u){u.target===l&&i()});let d=0;l.addEventListener("touchstart",function(u){d=u.changedTouches[0].clientX},{passive:!0}),l.addEventListener("touchend",function(u){let f=u.changedTouches[0].clientX-d;Math.abs(f)>50&&a(f<0?1:-1)},{passive:!0}),document.addEventListener("keydown",s),window._occLbKeyHandler=s,n(t)}function Ft(t,e){return t[e]|t[e+1]<<8}function We(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0}async function jc(t){let e=new DecompressionStream("deflate-raw"),o=e.writable.getWriter(),i=e.readable.getReader();o.write(t),o.close();let n=[],a=0;for(;;){let{done:c,value:l}=await i.read();if(c)break;n.push(l),a+=l.length}let s=new Uint8Array(a),r=0;for(let c of n)s.set(c,r),r+=c.length;return s}async function Gc(t){let e=-1,o=Math.max(0,t.length-65558);for(let c=t.length-22;c>=o;c--)if(t[c]===80&&t[c+1]===75&&t[c+2]===5&&t[c+3]===6){e=c;break}if(e<0)throw new Error("File ZIP non valido (EOCD non trovato)");let i=Ft(t,e+10),n=We(t,e+16),a=Object.create(null),s=new TextDecoder("utf-8",{fatal:!1}),r=n;for(let c=0;c<i&&We(t,r)===33639248;c++){let l=Ft(t,r+10),d=We(t,r+20),u=Ft(t,r+28),f=Ft(t,r+30),p=Ft(t,r+32),m=We(t,r+42),h=s.decode(t.slice(r+46,r+46+u));if(r+=46+u+f+p,h.endsWith("/")||h.endsWith("\\"))continue;let w=Ft(t,m+26),v=Ft(t,m+28),E=m+30+w+v,C=t.slice(E,E+d);l===0?a[h]=C:l===8&&(a[h]=await jc(C))}return a}function Ie(t){let e=new TextDecoder("utf-8",{fatal:!1}).decode(t);return new DOMParser().parseFromString(e,"text/xml")}function li(t){return[...t.getElementsByTagName("Relationship")].map(e=>({id:e.getAttribute("Id")||"",type:e.getAttribute("Type")||"",target:e.getAttribute("Target")||""}))}function Vc(t){let e=t["ppt/presentation.xml"],o=t["ppt/_rels/presentation.xml.rels"];if(!e||!o)return null;let i={};li(Ie(o)).forEach(c=>{i[c.id]=c.target});let n=Ie(e),a=[...n.getElementsByTagNameNS(ci,"sldId")];a.length||(a=[...n.getElementsByTagName("p:sldId")]);let s=[],r=new Set;return a.forEach(c=>{let l=c.getAttributeNS(aa,"id")||c.getAttribute("r:id")||"",d=i[l];if(!d)return;let u="ppt/"+d.replace(/^\.\.\//,"");r.has(u)||(r.add(u),s.push(u))}),s.length?s:null}function Zc(t){if(!t)return{};let e={};return li(Ie(t)).forEach(o=>{o.type.includes("image")&&(e[o.id]=o.target)}),e}function Qc(t,e){let o=t.split("/").pop();if(!Jc.test(o))return null;let i=e["ppt/media/"+o];if(!i)return null;let n=Wc[o.split(".").pop().toLowerCase()];if(!n)return null;let a="";for(let s=0;s<i.length;s+=8192)a+=String.fromCharCode(...i.subarray(s,Math.min(s+8192,i.length)));return`data:${n};base64,${btoa(a)}`}function sa(t){let e=t.getElementsByTagNameNS(jt,"off")[0]||t.getElementsByTagName("a:off")[0];return e?{x:parseInt(e.getAttribute("x")||"0",10),y:parseInt(e.getAttribute("y")||"0",10)}:{x:0,y:0}}function Kc(t,e,o,i){let n=[...t.getElementsByTagNameNS(ci,"pic")];n.length||(n=[...t.getElementsByTagName("p:pic")]);let a=[];for(let s of n){let r=s.getElementsByTagNameNS(jt,"blip")[0]||s.getElementsByTagName("a:blip")[0];if(!r)continue;let c=r.getAttributeNS(aa,"embed")||r.getAttribute("r:embed")||"";if(!c||!e[c])continue;let l=e[c],d=l.split("/").pop();if(i&&i.has(d))continue;let u=Qc(l,o);if(!u)continue;let f=sa(s);a.push({dataUrl:u,x:f.x,y:f.y})}return a.sort((s,r)=>s.y!==r.y?s.y-r.y:s.x-r.x)}function Yc(t){let e=[...t.getElementsByTagNameNS(jt,"tbl")];if(e.length||(e=[...t.getElementsByTagName("a:tbl")]),!e.length)return null;let o=[...e[0].getElementsByTagNameNS(jt,"tr")];o.length||(o=[...e[0].getElementsByTagName("a:tr")]);let i=[];for(let n of o){let a=[...n.getElementsByTagNameNS(jt,"tc")];if(a.length||(a=[...n.getElementsByTagName("a:tc")]),a.length<2)continue;let s=l=>{let d=[...l.getElementsByTagNameNS(jt,"t")];return d.length||(d=[...l.getElementsByTagName("a:t")]),d.map(u=>(u.textContent||"").trim()).filter(Boolean).join(" ")},r=s(a[0]),c=s(a[1]);r&&i.push({voce:r,valore:c||""})}return i.length>=2?i:null}function Xc(t){let e=[...t.getElementsByTagNameNS(ci,"sp")];e.length||(e=[...t.getElementsByTagName("p:sp")]);let o=[];for(let i of e){let n=[...i.getElementsByTagNameNS(jt,"t")];n.length||(n=[...i.getElementsByTagName("a:t")]);let a=n.map(r=>(r.textContent||"").trim()).filter(Boolean).join(" ").trim();if(!a)continue;let s=sa(i);o.push({text:a,x:s.x,y:s.y})}return o.sort((i,n)=>i.y!==n.y?i.y-n.y:i.x-n.x)}function tl(t,e,o,i,n){let a=e.map(l=>l.text).join(" ");if(/disegno\s+tecnico/i.test(a)&&o.length>=1)return"disegno";if(t&&t.length>=2)return"scheda";if(/materiale\s+occorrente/i.test(a))return"occorrente";let s=l=>/^[A-Z]-?\d/.test(l),r=l=>(/^[A-Z][\s\-–\.\:]/.test(l)||/^[A-Z]$/.test(l))&&!s(l),c=e.filter(l=>r(l.text.trim()));return!n&&i<4&&o.length===1&&!t&&a.length<300&&c.length===0?"title":i<3&&o.length===0&&!t&&c.length===0?"intro":c.length>=2||c.length===1&&/^[A-Z]$/.test(c[0].text.trim())&&o.length>=1?"occorrente":"procedimento"}function el(t,e,o){let i=/^([A-Z])[\s\-–\.\:]*(.*)/s,n=t.filter(a=>/^[A-Z][\s\-–\.\:]|^[A-Z]$/.test(a.text.trim()));for(let a of n){let s=a.text.trim().match(i);if(!s)continue;let r=s[1],l=(s[2]||"").trim().split(/\s{2,}|\s+[-–]\s+/),d=(l[0]||"").trim().slice(0,80),u=(l[1]||"").trim().slice(0,40),f=o.find(p=>p.lettera===r);f?(!f.nome&&d&&(f.nome=d),!f.codice&&u&&(f.codice=u)):o.push({lettera:r,nome:d,codice:u,foto:""})}if(e.length)if(e.length===1&&n.length===1){let a=n[0].text.trim()[0],s=o.find(r=>r.lettera===a);s&&!s.foto&&(s.foto=e[0].dataUrl)}else{let a=[...n].sort((s,r)=>s.y!==r.y?s.y-r.y:s.x-r.x);e.forEach((s,r)=>{if(r<a.length){let c=a[r].text.trim()[0],l=o.find(d=>d.lettera===c);l&&!l.foto&&(l.foto=s.dataUrl)}})}}function ol(t,e){let i=[...t.filter(c=>{let l=c.text.trim();return!(/^REVISIONE\s/i.test(l)||/^\d+$/.test(l)||/^[<>]$/.test(l)||l===l.toUpperCase()&&l.length<60&&/^[A-Z\s\d\-:;./]+$/.test(l))}).map(c=>({kind:"text",y:c.y,x:c.x||0,v:c.text})),...e.map(c=>({kind:"img",y:c.y,x:c.x||0,v:c.dataUrl}))].sort((c,l)=>c.y!==l.y?c.y-l.y:c.x-l.x),n=[],a=[],s=[];function r(){let c=a.join(" ").trim(),l=s[0]||null,d=s[1]||null;(c||l)&&n.push({descrizione:c,imageBase64:l,imageBase642:d}),a=[],s=[]}for(let c of i)c.kind==="text"?(s.length>0&&r(),a.push(c.v)):s.push(c.v);if(r(),!n.length){let c=t.map(u=>u.text).join(" ").trim(),l=e.length?e[0].dataUrl:null,d=e.length>1?e[1].dataUrl:null;(c||l)&&n.push({descrizione:c,imageBase64:l,imageBase642:d})}return n}async function il(t){let e=new Uint8Array(t),o=await Gc(e);if(!o["ppt/presentation.xml"])throw new Error("File non valido: manca ppt/presentation.xml");let i=Vc(o);(!i||!i.length)&&(i=Object.keys(o).filter(m=>/^ppt\/slides\/slide\d+\.xml$/.test(m)).sort((m,h)=>{let w=parseInt(m.match(/(\d+)\.xml$/)?.[1]||"0",10),v=parseInt(h.match(/(\d+)\.xml$/)?.[1]||"0",10);return w-v}));let n={};for(let m of i){let h=m.split("/").pop(),w=o[`ppt/slides/_rels/${h}.rels`];if(!w)continue;let v=new Set;for(let E of li(Ie(w))){if(!E.type.includes("image"))continue;let C=E.target.split("/").pop();v.has(C)||(v.add(C),n[C]=(n[C]||0)+1)}}let a=new Set,s=Math.max(2,Math.ceil(i.length*.4));for(let[m,h]of Object.entries(n))h>=s&&a.add(m);let r="",c="",l="",d=[],u=[],f=[],p={foto:""};for(let m=0;m<i.length;m++){let h=o[i[m]];if(!h)continue;let w=Ie(h),v=i[m].split("/").pop(),E=Zc(o[`ppt/slides/_rels/${v}.rels`]),C=Yc(w),_=Xc(w),$=Kc(w,E,o,a),k=tl(C,_,$,m,!!r);if(k!=="intro")if(k==="title"){if(!l&&$.length&&(l=$[0].dataUrl),!r&&_.length){let R=$.length?$[0].y:1/0,O=_.filter(q=>q.y<=R&&q.text.length>3).filter(q=>!/^[A-Z0-9\-]+$/.test(q.text)).filter(q=>!/^REVISIONE\s/i.test(q.text));O.length>=2?(c=O[0].text.slice(0,80).trim(),r=O[O.length-1].text.slice(0,120).trim()):O.length===1?r=O[0].text.slice(0,120).trim():r=_[0].text.slice(0,120).trim()}}else if(k==="scheda")C.forEach(R=>{d.find(O=>O.voce===R.voce)||d.push(R)});else if(k==="occorrente")el(_,$,u);else if(k==="disegno")!p.foto&&$.length&&(p={foto:$[0].dataUrl});else{let R=ol(_,$);for(let O of R)(O.descrizione||O.imageBase64)&&f.push(O)}}return{titolo:r,categoria:c,copertina:l,schedaTecnica:d,occorrente:u,procedimenti:f,disegnoTecnico:p}}function nl(){if(b?.nome?.toUpperCase().trim()!=="ALESSIO")return;let t=document.getElementById("_pptx-file-inp");t||(t=document.createElement("input"),t.type="file",t.id="_pptx-file-inp",t.accept=".pptx",t.style.display="none",t.addEventListener("change",function(){al(t)}),document.body.appendChild(t)),t.value="",t.click()}async function al(t){let e=t?.files?.[0];if(e){g("Analisi PPTX in corso...","info");try{let o=await e.arrayBuffer(),i=await il(o);if(!i.titolo&&!i.procedimenti.length&&!i.schedaTecnica.length&&!i.occorrente.length){g("Nessun contenuto riconosciuto nel file.","warning");return}i.titolo||(i.titolo=e.name.replace(/\.pptx$/i,"").replace(/[-_]/g," ")),ti=i,sl(i)}catch(o){console.error("[PPTX]",o),g("Errore nel parsing PPTX: "+(o?.message||"file non valido"),"error")}}}function sl(t){let e=document.getElementById("manuali-modal-host");if(!e)return;let o=t.copertina?`<img src="${t.copertina}" style="width:80px;height:60px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;flex-shrink:0">`:'<div style="width:80px;height:60px;background:#f1f5f9;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#cbd5e1;font-size:10px;flex-shrink:0">nessuna</div>',i=t.schedaTecnica.length?t.schedaTecnica.slice(0,6).map(c=>`<tr><td style="padding:3px 8px;color:#475569;font-size:11px;border-bottom:1px solid #f1f5f9">${y(c.voce)}</td><td style="padding:3px 8px;font-size:11px;color:#1e293b;border-bottom:1px solid #f1f5f9">${y(c.valore)}</td></tr>`).join("")+(t.schedaTecnica.length>6?`<tr><td colspan="2" style="padding:3px 8px;color:#94a3b8;font-size:10px">+ altre ${t.schedaTecnica.length-6} voci\u2026</td></tr>`:""):'<tr><td colspan="2" style="padding:6px 8px;color:#94a3b8;font-size:11px">Nessuna voce riconosciuta</td></tr>',n=t.occorrente.length?t.occorrente.slice(0,8).map(c=>{let l=c.foto?`<img src="${c.foto}" style="width:36px;height:36px;object-fit:cover;border-radius:5px;border:1px solid #e2e8f0;flex-shrink:0">`:'<div style="width:36px;height:36px;background:#f1f5f9;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#94a3b8;flex-shrink:0">\u2013</div>';return`<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f8fafc">
                <b style="font-size:13px;color:#3b82f6;flex-shrink:0;width:18px">${y(c.lettera)}</b>
                ${l}
                <span style="font-size:11px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${y(c.nome||"\u2014")}</span>
                ${c.codice?`<span style="font-size:10px;color:#94a3b8;flex-shrink:0">${y(c.codice)}</span>`:""}
            </div>`}).join("")+(t.occorrente.length>8?`<div style="font-size:10px;color:#94a3b8;padding:4px 0">+ altri ${t.occorrente.length-8}\u2026</div>`:""):'<div style="font-size:11px;color:#94a3b8;padding:6px 0">Nessun componente riconosciuto</div>',a=t.procedimenti.length?t.procedimenti.slice(0,4).map((c,l)=>{let d=c.imageBase64?`<img src="${c.imageBase64}" style="width:52px;height:40px;object-fit:cover;border-radius:5px;border:1px solid #e2e8f0;flex-shrink:0">`:'<div style="width:52px;height:40px;background:#f1f5f9;border-radius:5px;flex-shrink:0"></div>',u=(c.descrizione||"").slice(0,70)+((c.descrizione||"").length>70?"\u2026":"");return`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f1f5f9">
                <span style="font-size:10px;color:#94a3b8;flex-shrink:0;width:18px">${l+1}.</span>
                ${d}
                <span style="font-size:11px;color:#475569;overflow:hidden;min-width:0">${y(u)||'<em style="color:#cbd5e1">nessun testo</em>'}</span>
            </div>`}).join("")+(t.procedimenti.length>4?`<div style="font-size:10px;color:#94a3b8;padding:4px 0">+ altri ${t.procedimenti.length-4} step\u2026</div>`:""):'<div style="font-size:11px;color:#94a3b8;padding:6px 0">Nessuno step riconosciuto</div>',s=(c,l,d)=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:.72rem;font-weight:700;text-transform:uppercase;color:#64748b;letter-spacing:.04em">
            <i class="${c}"></i> ${l}
            <span style="background:#e2e8f0;border-radius:99px;padding:1px 7px;font-size:10px">${d}</span>
         </div>`,r="margin-bottom:12px;padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0";e.innerHTML=`
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
            <div class="modal-content manuali-modal-box" style="width:92vw;max-width:820px;max-height:90vh;overflow-y:auto">
                ${ae("chiudiFormManuale()")}
        <h2 style="margin-bottom:4px;display:flex;align-items:center;gap:10px">
            <i class="fas fa-file-powerpoint" style="color:#7c3aed"></i> Anteprima PPTX
        </h2>
        <p style="font-size:.83rem;color:#64748b;margin-bottom:16px">Verifica il contenuto riconosciuto. Potrai modificare tutto nell'editor dopo l'importazione.</p>

        <div style="${r};display:flex;gap:14px;align-items:flex-start">
            ${o}
            <div style="flex:1;min-width:0">
                <label class="modal-label">Titolo manuale *</label>
                <input id="pptx-titolo" class="input-field-modern" type="text" value="${y(t.titolo)}" placeholder="Inserisci titolo manuale">
                <label class="modal-label" style="margin-top:6px">Categoria</label>
                <input id="pptx-categoria" class="input-field-modern" type="text" value="${y(t.categoria||"")}" placeholder="Es. Lampade a Picchetto">
            </div>
        </div>

        <div style="${r}">
            ${s("fas fa-table","Scheda Tecnica",t.schedaTecnica.length+" voci")}
            <table style="width:100%;border-collapse:collapse">${i}</table>
        </div>

        <div style="${r}">
            ${s("fas fa-boxes-stacked","Materiale Occorrente",t.occorrente.length)}
            ${n}
        </div>

        <div style="${r}">
            ${s("fas fa-list-ol","Procedimento",t.procedimenti.length+" step")}
            ${a}
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
            <button id="pptx-btn-crea" class="btn-modal-ok" onclick="_confermImportPptx()">
                <i class="fas fa-arrow-right"></i> Apri nell'editor
            </button>
        </div>
      </div>
    </div>`}async function rl(){let t=String(document.getElementById("pptx-titolo")?.value||"").trim();if(!t){g("Inserisci un titolo per il manuale.","warning");return}let e=document.getElementById("pptx-categoria"),o=String(e?.value||"").trim(),i=document.getElementById("pptx-btn-crea");i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Elaborazione immagini\u2026');let n=ti;if(!n||typeof n!="object"||Array.isArray(n)){g("Nessun risultato da importare.","error"),i&&(i.disabled=!1,i.innerHTML=`<i class="fas fa-arrow-right"></i> Apri nell'editor`);return}async function a(d){if(!d)return"";try{let u=await Sc(d,800);return u&&u.length<=ni?u:""}catch{return""}}let s=await a(n.copertina),r=[];for(let d of n.procedimenti||[]){let u=await a(d.imageBase64),f=await a(d.imageBase642);r.push({descrizione:d.descrizione||"",foto:u,foto2:f})}let c=[];for(let d of n.occorrente||[]){let u=await a(d.foto);c.push({lettera:d.lettera,nome:d.nome||"",codice:d.codice||"",foto:u})}let l={titolo:t,categoria:o,copertina:s,sections:{_v:2,schedaTecnica:n.schedaTecnica||[],occorrente:c,procedimenti:r,disegnoTecnico:n.disegnoTecnico||{foto:""}}};ti=[],ii("new",l)}function ra(){window.apriManuale=Bc,window.stampaManuale=Dc,window._apriLightboxOcc_=Hc,window.apriFormManuale=$c,window.chiudiFormManuale=ia,window.aggiungiSchedaRow=Tc,window.rimuoviSchedaRow=Rc,window.aggiungiOccorrenteItem=kc,window.rimuoviOccorrenteItem=Lc,window.eliminaFotoOccorrente=Ac,window.eliminaFotoProcedimento=Cc,window.eliminaFotoDisegno=Oc,window.cambiaFotoOccorrente=Ec,window.aggiungiProcStep=Pc,window.rimuoviProcStep=zc,window.cambiaFotoProcedimento=xc,window.cambiaFotoDisegno=Ic,window.cambiaCopertina=_c,window.salvaManualeCorrente=Mc,window.apriStoricoManuale=Uc,window.chiudiStoricoManuale=Fc,window.importaPptx=nl,window._confermImportPptx=rl}var Xo,fc,gc,vc,ni,Yn,ne,Ht,Qe,Ze,ti,jt,aa,ci,Jc,Wc,ca=W(()=>{"use strict";Pt();gt();Kn();vt();Xo="MANUALI_PRODOTTI",fc=20,gc=30,vc=20,ni=4e6,Yn=["Dimensione della sfera","Finiture","Ottiche","Grado di Protezione IP","Tipologia di installazione","Potenza assorbita","Alimentazione","Dimmerazione","Temperatura colore","Indice di resa cromatica","Tolleranza cromatica","Flusso luminoso","Efficienza luminosa","Mantenimento del flusso luminoso","Temperatura di esercizio"],ne=[],Ht={},Qe=null,Ze=[],ti=[];jt="http://schemas.openxmlformats.org/drawingml/2006/main",aa="http://schemas.openxmlformats.org/officeDocument/2006/relationships",ci="http://schemas.openxmlformats.org/presentationml/2006/main";Jc=/\.(jpe?g|png|gif|webp)$/i,Wc={jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",gif:"image/gif",webp:"image/webp"}});function eo(t,e,o,i={}){let n=t.getBoundingClientRect(),a=t.cloneNode(!0);a.removeAttribute("id");let s=i.opacity??.88,r=i.scale??"1.04",c=i.rotate??"-1deg",l=i.borderRadius??"10px",d=i.shadow??"0 10px 30px rgba(0,0,0,0.35)",u=i.background?`background:${i.background};`:"",f=i.border?`border:${i.border};`:"",p=i.transition?`transition:${i.transition};`:"";return a.style.cssText=cl+`width:${n.width}px;height:${n.height}px;left:${n.left}px;top:${n.top}px;opacity:${s};border-radius:${l};box-shadow:${d};transform:scale(${r}) rotate(${c});`+u+f+p,document.body.appendChild(a),{ghost:a,offX:e-n.left,offY:o-n.top}}function oo(t,e,o,i,n){t.style.left=e-i+"px",t.style.top=o-n+"px"}function io(t){t&&t.remove()}function la(t,e,o,i){t&&(t.style.visibility="hidden");let n=document.elementFromPoint(e,o);return t&&(t.style.visibility=""),n?n.closest(i):null}var cl,no=W(()=>{cl="position:fixed;pointer-events:none;user-select:none;-webkit-user-select:none;z-index:99999;transition:none;"});function da(){try{let t=localStorage.getItem("qrPostazioni");K=t?JSON.parse(t):[...Me]}catch{K=[...Me]}ua()}function pa(){try{localStorage.setItem("qrPostazioni",JSON.stringify(K))}catch{}ua()}function ua(){pi={},K.forEach(t=>{pi[t.codice.toUpperCase()]=t})}function ll(){let t=/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,e=window.navigator.standalone===!0||window.matchMedia("(display-mode: standalone)").matches;return t&&e}async function ma(){if(di)return;di=!0,setTimeout(()=>{di=!1},800);let t=document.getElementById("modal-qr-scanner"),e=document.getElementById("qr-error-msg");if(!t)return;e&&(e.style.display="none");let o=document.getElementById("qr-manual-input");if(o&&(o.value=""),ll()){let i=document.createElement("input");i.type="file",i.accept="image/*",i.capture="environment",i.style.display="none",document.body.appendChild(i),i.onchange=()=>{let n=i.files&&i.files[0];if(document.body.removeChild(i),!n)return;let a=new FileReader;a.onload=s=>{let r=new Image;r.onload=()=>{if(typeof jsQR>"u"){alert("\u26A0\uFE0F Libreria scanner non caricata. Usa il campo manuale.");return}let c=document.createElement("canvas");c.width=r.width,c.height=r.height;let l=c.getContext("2d");l.drawImage(r,0,0);let d=l.getImageData(0,0,r.width,r.height),u=jsQR(d.data,d.width,d.height,{inversionAttempts:"attemptBoth"});if(u&&u.data){try{navigator.vibrate&&navigator.vibrate(80)}catch{}ro(u.data.trim())}else t.style.display="flex",t.offsetHeight,t.classList.add("active"),e&&(e.textContent="\u26A0\uFE0F QR non riconosciuto nell'immagine. Riprova o usa il campo manuale.",e.style.display="block")},r.src=s.target.result},a.readAsDataURL(n)},i.oncancel=()=>document.body.removeChild(i),i.click();return}if(t.style.display="flex",t.offsetHeight,t.classList.add("active"),typeof jsQR>"u"){e&&(e.textContent="\u26A0\uFE0F Libreria scanner non caricata. Usa il campo manuale.",e.style.display="block");return}if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){e&&(e.textContent="\u26A0\uFE0F Fotocamera non supportata da questo browser. Usa il campo manuale.",e.style.display="block");return}try{if(!zt||!zt.active){zt=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});try{localStorage.setItem("qrCameraGranted","1")}catch{}}let i=document.getElementById("qr-video");i.srcObject=zt,await i.play(),dl()}catch(i){let n="\u26A0\uFE0F Impossibile avviare la fotocamera.";i.name==="NotAllowedError"&&(n="\u26A0\uFE0F Permesso fotocamera negato. Abilitalo dalle impostazioni del browser, poi riprova."),i.name==="NotFoundError"&&(n="\u26A0\uFE0F Nessuna fotocamera trovata sul dispositivo."),i.name==="NotReadableError"&&(n="\u26A0\uFE0F Fotocamera occupata da un'altra applicazione."),e&&(e.textContent=n,e.style.display="block")}}function dl(){let t=document.getElementById("qr-video"),e=document.getElementById("qr-canvas");if(!t||!e)return;let o=e.getContext("2d");function i(){if(zt){if(t.readyState===t.HAVE_ENOUGH_DATA){e.width=t.videoWidth,e.height=t.videoHeight,o.drawImage(t,0,0,e.width,e.height);let n=o.getImageData(0,0,e.width,e.height),a=jsQR(n.data,n.width,n.height,{inversionAttempts:"dontInvert"});if(a&&a.data){try{navigator.vibrate&&navigator.vibrate(80)}catch{}so(),ro(a.data.trim());return}}Ae=requestAnimationFrame(i)}}Ae=requestAnimationFrame(i)}function so(){Ae&&(cancelAnimationFrame(Ae),Ae=null),zt&&(zt.getTracks().forEach(o=>o.stop()),zt=null);let t=document.getElementById("qr-video");t&&(t.pause(),t.srcObject=null);let e=document.getElementById("modal-qr-scanner");e&&(e.classList.remove("active"),setTimeout(()=>{e.classList.contains("active")||(e.style.display="none")},300))}function ro(t){if(!t)return;let e=pi[t.toUpperCase()];if(!e){g("\u26A0\uFE0F QR non riconosciuto come postazione: "+t,"error");return}ao={codice:t.toUpperCase(),...e},pl()}function pl(){let t=ao;if(!t)return;Oe=null,ut=null,document.getElementById("qr-badge-nome").textContent=t.icona+"  "+t.nome,document.getElementById("qr-azione-domanda").textContent=t.domanda;let e=document.getElementById("qr-search-input");e&&(e.value="",setTimeout(()=>e.focus(),350));let o=document.getElementById("qr-search-dropdown");o&&(o.style.display="none",o.innerHTML=""),document.getElementById("qr-articoli-wrap").style.display="none",document.getElementById("qr-stato-wrap").style.display="none",document.getElementById("btn-qr-conferma").disabled=!0,(window._ordiniAutocompleteCache||[]).length===0&&window.fetchJson("PROGRAMMA PRODUZIONE DEL MESE").then(a=>{let s=new Set;window._ordiniAutocompleteCache=a.filter(r=>String(r.archiviato||"").toUpperCase()!=="TRUE").map(r=>({ordine:r.ordine||"",cliente:r.cliente||"",riferimento:r.riferimento||""})).filter(r=>!r.ordine||s.has(r.ordine)?!1:(s.add(r.ordine),!0))}).catch(()=>{});let n=document.getElementById("modal-qr-azione");n.style.display="flex",n.offsetHeight,n.classList.add("active")}function ui(){let t=document.getElementById("modal-qr-azione");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300),ao=null,Oe=null,ut=null)}function fa(t){let e=document.getElementById("qr-search-dropdown");if(!e)return;let o=(t||"").trim().toLowerCase();if(document.getElementById("qr-articoli-wrap").style.display="none",document.getElementById("qr-stato-wrap").style.display="none",document.getElementById("btn-qr-conferma").disabled=!0,Oe=null,ut=null,!o){e.style.display="none",e.innerHTML="";return}let n=(window._ordiniAutocompleteCache||[]).filter(a=>a.ordine.toLowerCase().includes(o)||a.cliente.toLowerCase().includes(o)||(a.riferimento||"").toLowerCase().includes(o)).slice(0,8);if(n.length===0){e.style.display="none",e.innerHTML="";return}e.innerHTML=n.map(a=>`
        <div class="autocomplete-item"
             onmousedown="event.preventDefault(); _qrSelezionaOrdine('${a.ordine.replace(/'/g,"\\'")}','${a.cliente.replace(/'/g,"\\'")}')"
             ontouchend="event.preventDefault(); _qrSelezionaOrdine('${a.ordine.replace(/'/g,"\\'")}','${a.cliente.replace(/'/g,"\\'")}')">
            <span class="ac-ordine">ORD. ${y(a.ordine)}</span>
            <span class="ac-cliente">${y(a.cliente)}${a.riferimento?' <em style="color:#94a3b8;font-size:11px">('+y(a.riferimento)+")</em>":""}</span>
        </div>`).join(""),e.style.display="block"}async function ga(t,e){let o=document.getElementById("qr-search-input");o&&(o.value=`ORD. ${t} \u2014 ${e}`);let i=document.getElementById("qr-search-dropdown");i&&(i.style.display="none",i.innerHTML=""),Oe=t;let n=document.getElementById("qr-articoli-wrap"),a=document.getElementById("qr-articoli-list"),s=document.getElementById("qr-ordine-header");s&&(s.innerHTML=`<span class="qr-ord-lbl"><b>ORD. ${y(t)}</b></span><span class="qr-cli-lbl">${y(e)}</span>`),a&&(a.innerHTML='<div class="qr-loading"><i class="fas fa-spinner fa-spin"></i> Caricamento articoli...</div>'),n.style.display="block";let r=[],c=window._attiviProd||[];if(c.length>0&&(r=c.filter(d=>String(d.ordine||"").trim()===String(t).trim()&&String(d.archiviato||"").toUpperCase()!=="TRUE")),r.length===0)try{r=(await window.fetchJson("PROGRAMMA PRODUZIONE DEL MESE")).filter(u=>String(u.ordine||"").trim()===String(t).trim()&&String(u.archiviato||"").toUpperCase()!=="TRUE")}catch{a&&(a.innerHTML='<div class="qr-loading" style="color:#ef4444">Errore caricamento. Riprova.</div>');return}if(r.length===0){a&&(a.innerHTML='<div class="qr-loading">Nessun articolo attivo trovato per questo ordine.</div>');return}let l=window.listaStati||[];a.innerHTML=r.map(d=>{let u=d.codice&&d.codice!=="false"?d.codice:"Senza Codice",f=l.find(p=>p.nome.toUpperCase()===(d.stato||"").toUpperCase())||{colore:"#94a3b8"};return`
        <label class="qr-articolo-row" for="qr-art-${d.id_riga}">
            <input type="checkbox" id="qr-art-${d.id_riga}" class="qr-art-chk" data-id-riga="${d.id_riga}" checked>
            <div class="qr-art-info">
                <span class="qr-art-codice">${u}</span>
                <span class="qr-art-qty">\xD7 ${d.qty}</span>
                <span class="qr-art-stato-badge" style="border-color:${f.colore};color:${f.colore}">${(d.stato||"IN ATTESA").toUpperCase()}</span>
            </div>
        </label>`}).join(""),document.querySelectorAll(".qr-art-chk").forEach(d=>d.addEventListener("change",Ce)),ul(),document.getElementById("qr-stato-wrap").style.display="block",Ce()}function ul(){let t=ao,e=document.getElementById("qr-stato-pills");if(!e)return;let o=t?t.statoDefault.toUpperCase():"",i=window.listaStati||[],n=i.length>0?i:[{nome:"IN ATTESA",colore:"#94a3b8"},{nome:"PREPARARE PER LAVORAZIONE",colore:"#64748b"},{nome:"IN LAVORAZIONE",colore:"#f59e0b"},{nome:"IN PRODUZIONE",colore:"#242424"},{nome:"IMBALLATO",colore:"#22c55e"}];ut=null,e.innerHTML=n.map(a=>{let s=a.nome.toUpperCase()===o;return s&&(ut=a.nome),`<button type="button"
                    class="qr-stato-pill${s?" qr-stato-pill-sel":""}"
                    data-stato="${a.nome}"
                    style="border-color:${a.colore};${s?"background:"+a.colore+";color:#fff":"color:"+a.colore}"
                    onclick="_qrScegliStato(this,'${a.nome.replace(/'/g,"\\'")}')">
                    <span class="qr-pill-dot" style="background:${a.colore}"></span>
                    ${a.nome}
                </button>`}).join("")}function va(t,e){ut=e;let o=window.listaStati||[];document.querySelectorAll(".qr-stato-pill").forEach(a=>{let s=o.find(c=>c.nome===a.dataset.stato),r=s?s.colore:"#94a3b8";a.classList.remove("qr-stato-pill-sel"),a.style.background="",a.style.color=r,a.style.borderColor=r});let i=o.find(a=>a.nome===t.dataset.stato),n=i?i.colore:"#94a3b8";t.classList.add("qr-stato-pill-sel"),t.style.background=n,t.style.color="#fff",t.style.borderColor=n,Ce()}function ha(){document.querySelectorAll(".qr-art-chk").forEach(t=>t.checked=!0),Ce()}function ba(){document.querySelectorAll(".qr-art-chk").forEach(t=>t.checked=!1),Ce()}function Ce(){let t=document.getElementById("btn-qr-conferma");if(!t)return;let e=document.querySelectorAll(".qr-art-chk:checked").length;t.disabled=!(e>0&&ut)}async function ya(){if(!ut||!Oe)return;let t=Array.from(document.querySelectorAll(".qr-art-chk:checked"));if(t.length===0){g("Seleziona almeno un articolo.","error");return}let e=document.getElementById("btn-qr-conferma");e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Salvataggio...');let o=t.map(r=>r.dataset.idRiga),i={},n=window._attiviProd||[];o.forEach(r=>{let c=n.find(l=>String(l.id_riga)===String(r));i[r]=c?c.stato:null}),o.forEach(r=>{let c=n.find(l=>String(l.id_riga)===String(r));c&&(c.stato=ut),window._syncKanbanFromStato&&window._syncKanbanFromStato(r,ut)});let a=0,s=[];for(let r of o)await window.aggiornaDato(null,r,"stato",ut,!0)||(a++,s.push(r));a===0?(g(`\u2705 ${o.length} articolo/i \u2192 ${ut}`),window.cacheContenuti&&delete window.cacheContenuti["PROGRAMMA PRODUZIONE DEL MESE"],U("_html_PROGRAMMA PRODUZIONE DEL MESE"),N.invalidate("PROGRAMMA_PRODUZIONE").catch(()=>{})):(s.forEach(r=>{let c=i[r],l=n.find(d=>String(d.id_riga)===String(r));c&&l&&(l.stato=c),c&&window._syncKanbanFromStato&&window._syncKanbanFromStato(r,c)}),g(`\u26A0\uFE0F ${a} errori su ${o.length} articoli \u2014 riprova`,"error"),console.error("[QR Postazione] Rollback",{falliti:s,statiPrec:i})),ui()}function wa(){_a(null)}function Sa(t){_a(t)}function _a(t){let e=t==null,o=e?{icona:"\u{1F4CD}",nome:"",codice:"",domanda:"",statoDefault:""}:K[t];document.getElementById("qr-edit-titolo").innerHTML=`<i class="fas fa-map-marker-alt" style="margin-right:8px"></i>${e?"Nuova Postazione":"Modifica Postazione"}`,document.getElementById("qr-edit-icona").value=o.icona||"",document.getElementById("qr-edit-nome").value=o.nome||"",document.getElementById("qr-edit-codice").value=o.codice||"",document.getElementById("qr-edit-domanda").value=o.domanda||"",document.getElementById("qr-edit-idx").value=e?"":t;let i=document.getElementById("qr-edit-stato"),n=window.listaStati||[],a=n.length>0?n:Me.map(c=>({nome:c.statoDefault,colore:"#94a3b8"})),s=[...new Map(a.map(c=>[c.nome,c])).values()];i.innerHTML=s.map(c=>`<option value="${c.nome}" ${c.nome===(o.statoDefault||"")?"selected":""}>${c.nome}</option>`).join("");let r=document.getElementById("modal-qr-edit");r.style.display="flex",r.offsetHeight,r.classList.add("active"),requestAnimationFrame(()=>co())}function mi(){let t=document.getElementById("modal-qr-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function fi(){let e="PROD:"+(document.getElementById("qr-edit-nome")?.value||"").trim().toUpperCase().replace(/[ÀÁÂÃÄÅ]/g,"A").replace(/[ÈÉÊË]/g,"E").replace(/[ÌÍÎÏ]/g,"I").replace(/[ÒÓÔÕÖ]/g,"O").replace(/[ÙÚÛÜ]/g,"U").replace(/[^A-Z0-9]/g,""),o=document.getElementById("qr-edit-codice");o&&(o.value=e)}function Ea(){fi(),co()}async function co(){let t=(document.getElementById("qr-edit-codice")?.value||"").trim(),e=(document.getElementById("qr-edit-nome")?.value||"").trim(),o=document.getElementById("qr-preview-canvas"),i=document.getElementById("qr-preview-nome"),n=document.getElementById("qr-preview-codice");if(i&&(i.textContent=e||"\u2014"),n&&(n.textContent=t||"\u2014"),!(!o||!t))try{typeof QRCode<"u"&&typeof QRCode.toDataURL=="function"?o.src=await QRCode.toDataURL(t,{width:160,margin:2,color:{dark:"#111827",light:"#ffffff"}}):o.src=`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(t)}`}catch{o.src=`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(t)}`}}function xa(){let t=(document.getElementById("qr-edit-icona")?.value||"").trim()||"\u{1F4CD}",e=(document.getElementById("qr-edit-nome")?.value||"").trim(),o=(document.getElementById("qr-edit-codice")?.value||"").trim().toUpperCase(),i=(document.getElementById("qr-edit-domanda")?.value||"").trim(),n=document.getElementById("qr-edit-stato")?.value||"",a=document.getElementById("qr-edit-idx")?.value;if(!e){g("Inserisci un nome per la postazione.","error");return}if(!o){g("Il codice QR non pu\xF2 essere vuoto.","error");return}let s={icona:t,nome:e,codice:o,domanda:i,statoDefault:n},r=a!==""&&a!==null&&a!==void 0?parseInt(a):null;r!==null&&!isNaN(r)?K[r]=s:K.push(s),pa(),mi(),g("\u2705 Postazione salvata."),window.caricaInterfacciaImpostazioni(),setTimeout(()=>Aa(),120)}function Ia(t){let e=K[t];e&&rt("Elimina Postazione",`Vuoi eliminare la postazione "${e.nome}"? Il QR code stampato associato non funzioner\xE0 pi\xF9.`,()=>{K.splice(t,1),pa(),g("Postazione eliminata."),window.caricaInterfacciaImpostazioni(),setTimeout(()=>Aa(),120)},"Elimina")}function Aa(){let t=document.getElementById("section-qr-postazioni");if(!t)return;t.style.display="block";let e=t.previousElementSibling;if(e){e.classList.add("settings-row-active");let o=e.querySelector(".settings-row-arrow");o&&(o.style.transform="rotate(180deg)")}}async function gi(){for(let t=0;t<K.length;t++){let e=document.getElementById(`qr-list-canvas-${t}`);if(!e)continue;let o=K[t].codice||"";if(o)try{typeof QRCode<"u"&&typeof QRCode.toDataURL=="function"?e.src=await QRCode.toDataURL(o,{width:56,margin:1,color:{dark:"#0f172a",light:"#f8fafc"}}):e.src=`https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(o)}`}catch{e.src=`https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(o)}`}}}function Ca(){let t=(document.getElementById("qr-edit-codice")?.value||"").trim(),e=(document.getElementById("qr-edit-nome")?.value||"").trim(),o=(document.getElementById("qr-edit-icona")?.value||"").trim()||"\u{1F4CD}",i=(document.getElementById("qr-edit-domanda")?.value||"").trim();if(!t){g("Inserisci nome e codice prima di stampare.","error");return}vi([{codice:t,nome:e,icona:o,domanda:i}])}function Oa(t){let e=K[t];e&&vi([e])}function $a(){if(K.length===0){g("Nessuna postazione da stampare.","error");return}vi(K)}async function vi(t){let o=`<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>QR Code Postazioni \u2014 PROD</title>
<style>
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Segoe UI',sans-serif; background:#fff; padding:20px; }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:24px; }
.card { background:#fff; border:2px solid #e2e8f0; border-radius:14px;
        padding:20px 16px 16px; text-align:center;
        page-break-inside:avoid; break-inside:avoid; display:flex; flex-direction:column; align-items:center; gap:10px; }
.card img { display:block; width:200px; height:200px; }
.nome { font-size:16px; font-weight:800; color:#0f172a; letter-spacing:0.3px; }
button { position:fixed; top:16px; right:16px; background:#111827; color:#fff;
         border:none; border-radius:10px; padding:9px 18px; font-size:13px;
         font-weight:700; cursor:pointer; z-index:999; }
@media print {
  body { padding:6px; }
  button { display:none; }
  .grid { grid-template-columns:repeat(3,1fr); gap:16px; }
  .card { border:1.5px solid #cbd5e1; }
}
</style>
</head>
<body>
<button onclick="window.print()">\u{1F5A8}\uFE0F Stampa</button>
<div class="grid">
${(await Promise.all(t.map(async s=>{let r="";try{typeof QRCode<"u"&&typeof QRCode.toDataURL=="function"&&(r=await QRCode.toDataURL(s.codice,{width:300,margin:2,color:{dark:"#000000",light:"#ffffff"}}))}catch{}return r||(r=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(s.codice)}`),{...s,dataUrl:r}}))).map(s=>`
<div class="card">
  <img src="${s.dataUrl}" alt="QR ${s.nome}">
  <div class="nome">${s.icona||""} ${s.nome}</div>
</div>`).join("")}
</div>
<script>setTimeout(()=>window.print(),800);<\/script>
</body>
</html>`,i=new Blob([o],{type:"text/html; charset=utf-8"}),n=URL.createObjectURL(i);window.open(n,"_blank","width=900,height=700")?setTimeout(()=>URL.revokeObjectURL(n),3e4):(URL.revokeObjectURL(n),g("\u26A0\uFE0F Abilita i popup per la stampa.","error"))}var K,pi,zt,Ae,ao,ut,Oe,di,Ta=W(()=>{ft();Pt();gt();xt();K=[],pi={};zt=null,Ae=null,ao=null,ut=null,Oe=null;di=!1});function Ra(t){return window.hashSHA256(t)}function ka(){return b?.nome?"avatarColorRecenti_"+b.nome.toUpperCase().trim():null}function La(){return b?.nome?"avatarColorHidden_"+b.nome.toUpperCase().trim():null}function Ot(){let t=ka();if(!t)return[];try{return JSON.parse(localStorage.getItem(t)||"[]")}catch{return[]}}function re(t){let e=ka();if(e)try{localStorage.setItem(e,JSON.stringify(t.slice(0,7)))}catch{}}function Pa(){let t=La();if(!t)return[];try{return JSON.parse(localStorage.getItem(t)||"[]")}catch{return[]}}function za(t){let e=La();if(e)try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function hi(){let t=document.getElementById("avatar-predefined-swatches");if(!t)return;let e=Pa();t.innerHTML="",(window._PREDEFINED_AVATAR_COLORS||[]).forEach(o=>{if(e.includes(o))return;let i=document.createElement("button");i.className="avatar-color-swatch",i.style.background=o,i.dataset.color=o,i.title="Clicca per applicare o eliminare",i.onclick=n=>{n.stopPropagation(),gl(o,n)},t.appendChild(i)})}function Gt(){let t=["avatar-custom-swatches","avatar-custom-swatches-mob"],e=Ot();t.forEach(o=>{let i=document.getElementById(o);if(!i)return;let n=o.endsWith("-mob");i.innerHTML="",e.forEach((a,s)=>{let r=document.createElement("button");r.className="avatar-color-swatch avatar-color-custom-swatch",r.style.background=a,r.dataset.color=a,r.title="Clicca per modificare o eliminare",r.onclick=n?c=>{c.stopPropagation(),Sl(s,c)}:c=>{c.stopPropagation(),fl(s,c)},i.appendChild(r)})})}function bi(t,e){let o=document.getElementById("avatar-color-editor"),i=document.getElementById("avatar-color-edit-input"),n=document.getElementById("avatar-editor-delete");!o||!i||(i.value=t||"#ff0000",n&&(n.style.display=e?"":"none"),o.style.display="flex")}function yi(){let t=document.getElementById("avatar-color-editor");t&&(t.style.display="none"),j=null}function ml(t){t&&t.stopPropagation(),j=null,bi("#ff0000",!1)}function fl(t,e){e&&e.stopPropagation();let o=Ot();j={type:"custom",idx:t},bi(o[t]||"#ff0000",!0)}function gl(t,e){e&&e.stopPropagation(),j={type:"predefined",color:t},bi(t,!0)}function vl(t){t&&t.stopPropagation();let e=document.getElementById("avatar-color-edit-input");if(!e)return;let o=e.value;if(j===null){let i=Ot();i.unshift(o),re(i),Gt()}else if(j.type==="custom"){let i=Ot();i[j.idx]=o,re(i),Gt()}yi(),Si(o)}function hl(t){t&&t.stopPropagation(),yi()}function bl(t){if(t&&t.stopPropagation(),!!j){if(j.type==="custom"){let e=Ot();e.splice(j.idx,1),re(e),Gt()}else if(j.type==="predefined"){let e=Pa();e.includes(j.color)||e.push(j.color),za(e),hi()}yi()}}function yl(t){t&&t.stopPropagation(),za([]),hi()}function Ma(t,e){let o=document.getElementById("avatar-color-editor-mob"),i=document.getElementById("avatar-color-edit-input-mob"),n=document.getElementById("avatar-editor-delete-mob");!o||!i||(i.value=t||"#ff0000",n&&(n.style.display=e?"":"none"),o.style.display="flex")}function wi(){let t=document.getElementById("avatar-color-editor-mob");t&&(t.style.display="none"),j=null}function wl(t){t&&t.stopPropagation(),j=null,Ma("#ff0000",!1)}function Sl(t,e){e&&e.stopPropagation();let o=Ot();j={type:"custom",idx:t},Ma(o[t]||"#ff0000",!0)}function _l(t){t&&t.stopPropagation();let e=document.getElementById("avatar-color-edit-input-mob");if(!e)return;let o=e.value;if(j===null){let i=Ot();i.unshift(o),re(i),Gt()}else if(j.type==="custom"){let i=Ot();i[j.idx]=o,re(i),Gt()}wi(),Si(o)}function El(t){t&&t.stopPropagation(),wi()}function xl(t){if(t&&t.stopPropagation(),!!j){if(j.type==="custom"){let e=Ot();e.splice(j.idx,1),re(e),Gt()}wi()}}function Na(t){document.documentElement.style.setProperty("--avatar-user-color",t);let e=document.getElementById("user-avatar-btn"),o=document.getElementById("account-ddrop-avatar"),i=document.getElementById("user-avatar-btn-mobile"),n=document.getElementById("account-ddrop-avatar-mob");e&&(e.style.setProperty("background",t,"important"),e.style.setProperty("box-shadow",`0 2px 8px ${t}66`,"important")),i&&(i.style.setProperty("background",t,"important"),i.style.setProperty("box-shadow",`0 2px 8px ${t}66`,"important")),o&&o.style.setProperty("background",t,"important"),n&&n.style.setProperty("background",t,"important"),document.querySelectorAll(".avatar-color-swatch").forEach(a=>{a.classList.toggle("active",a.dataset.color===t)})}function Si(t){if(!b||!b.nome)return;let e=b.nome.toUpperCase().trim();try{localStorage.setItem("avatarColor_"+e,t)}catch{}window._avatarColorsCache&&(window._avatarColorsCache[e]=t),b.nome&&fetch(x,{method:"POST",body:JSON.stringify({azione:"setAvatarColor",username:b.nome,color:t})}).catch(()=>{}),Na(t)}function Il(t){t&&t.stopPropagation();let e=document.getElementById("account-dropdown");e&&e.classList.toggle("open")}function Al(){let t=document.getElementById("account-dropdown");t&&t.classList.remove("open")}function Cl(){U("_impostazioni_cache"),window.paginaAttuale&&(window.cacheContenuti&&delete window.cacheContenuti[window.paginaAttuale],U("_html_"+window.paginaAttuale)),window.location.reload()}function Ol(t){t&&t.stopPropagation();let e=document.getElementById("account-dropdown-mobile");e&&e.classList.toggle("open")}function $l(){let t=document.getElementById("account-dropdown-mobile");t&&t.classList.remove("open")}async function Tl(){try{let o=(await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"pushInfo"})})).json().catch(()=>({}))).subscriptions||[];if(!o.length){g("Nessun dispositivo registrato in PUSH_SUBSCRIPTIONS","error");return}let i={};o.forEach(s=>{i[s.user]||(i[s.user]=0),i[s.user]++});let n=Object.entries(i).sort((s,r)=>s[0].localeCompare(r[0])).map(([s,r])=>`<tr><td style="padding:6px 10px;font-weight:600">${s}</td><td style="padding:6px 10px;text-align:center">${r} dispositivo${r>1?"i":""}</td></tr>`).join(""),a=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center" onclick="this.remove()">
            <div style="background:#fff;border-radius:16px;padding:24px 28px;max-width:420px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.18)" onclick="event.stopPropagation()">
                <div style="font-size:1.05rem;font-weight:700;margin-bottom:16px">\u{1F50D} Diagnostica Push \u2014 Dispositivi registrati (${o.length})</div>
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
                    <thead><tr style="background:#f1f5f9"><th style="padding:6px 10px;text-align:left">Utente</th><th style="padding:6px 10px">Dispositivi</th></tr></thead>
                    <tbody>${n}</tbody>
                </table>
                <p style="font-size:0.77rem;color:#64748b;margin-top:14px">Tocca fuori per chiudere. Se un utente non compare in questa lista, le sue notifiche NON arriveranno.</p>
            </div>
        </div>`;document.body.insertAdjacentHTML("beforeend",a)}catch(t){g("Errore diagnostica: "+t.message,"error")}}async function Rl(){let t=document.getElementById("btn-force-regpush");t&&(t.disabled=!0,t.textContent="\u23F3 Registrazione...");try{let e=await navigator.serviceWorker.register("sw.js",{scope:"./"});await navigator.serviceWorker.ready;let o=await e.pushManager.getSubscription();if(o&&(await fetch(x,{method:"POST",body:JSON.stringify({azione:"eliminaSottoscrizione",endpoint:o.endpoint})}).catch(()=>{}),await o.unsubscribe()),await Notification.requestPermission()!=="granted"){g("Permesso notifiche negato","error"),t&&(t.disabled=!1,t.textContent="\u{1F504} Ri-registra subscription");return}let n=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Ei(window._VAPID_PUBLIC_KEY)});"caches"in window&&await(await caches.open("prod-auth")).put("username",new Response(b.nome.toUpperCase()));let a=n.toJSON(),s=await window._salvaSubVAPID_({endpoint:a.endpoint,p256dh:a.keys?.p256dh,auth:a.keys?.auth});if(s&&(s.status==="saved"||s.status==="updated")){try{localStorage.setItem("_pushStato","ok")}catch{}g("\u2705 Subscription registrata con successo!")}else if(s&&s.status==="errore-verifica"){try{localStorage.setItem("_pushStato","errore-verifica")}catch{}g("\u26A0\uFE0F Subscription creata ma NON confermata sul server. Riprova pi\xF9 tardi.","error")}else g("\u26A0\uFE0F Subscription creata ma salvataggio GAS incerto: "+JSON.stringify(s),"error");_i()}catch(e){console.warn("[Push] forzaRiregistra:",e),g("Errore ri-registrazione: "+e.message,"error")}finally{t&&(t.disabled=!1,t.textContent="\u{1F504} Ri-registra subscription")}}async function kl(){let t=document.getElementById("btn-test-push");t&&(t.disabled=!0,t.textContent="\u23F3 Invio...");try{let o=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"testPush",username:b.nome.toUpperCase()})})).json().catch(()=>({}));if(o.sent>0){let i=(o.log||[]).map(n=>"HTTP "+n.status+(n.body?" ("+String(n.body).substring(0,80)+")":"")).join(" | ");g("\u{1F4E4} Test inviato ("+o.sent+" disp.) \u2014 "+(i||"\u2014"))}else o.status==="no_devices"?g('\u26A0\uFE0F Nessun dispositivo registrato. Clicca "Ri-registra subscription".',"error"):g("\u26A0\uFE0F Risposta server: "+JSON.stringify(o),"error")}catch(e){g("Errore test push: "+e.message,"error")}finally{t&&(t.disabled=!1,t.textContent="\u{1F528} Invia notifica di test")}}function lo(){try{return JSON.parse(localStorage.getItem("notifPrefs")||'{"richieste":true,"assegnazioni":true,"stato":false}')}catch{return{richieste:!0,assegnazioni:!0,stato:!1}}}function Ll(t){try{localStorage.setItem("notifPrefs",JSON.stringify(t))}catch{}g("Preferenze notifiche salvate \u2714")}function Pl(){let t={richieste:!!document.getElementById("np-richieste")?.checked,assegnazioni:!!document.getElementById("np-assegnazioni")?.checked,stato:!!document.getElementById("np-stato")?.checked};Ll(t)}async function zl(){if(!("serviceWorker"in navigator)||!("PushManager"in window)){g("Questo browser non supporta le notifiche push","error");return}try{let t=await navigator.serviceWorker.register("sw.js",{scope:"./"});await navigator.serviceWorker.ready;let e=await t.pushManager.getSubscription();if(e){let o=e.endpoint;await e.unsubscribe();try{await fetch(x,{method:"POST",body:JSON.stringify({azione:"eliminaSottoscrizione",endpoint:o})})}catch{}try{localStorage.removeItem("_pushStato")}catch{}g("Notifiche push disattivate")}else{if(await Notification.requestPermission()!=="granted"){g("Permesso notifiche negato","error");return}e=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Ei(window._VAPID_PUBLIC_KEY)});let i=e.toJSON(),n=await window._salvaSubVAPID_({endpoint:i.endpoint,p256dh:i.keys?.p256dh,auth:i.keys?.auth});if(n&&(n.status==="saved"||n.status==="updated")){try{localStorage.setItem("_pushStato","ok")}catch{}g("Notifiche push attivate \u2714 (registrate su server)")}else if(n&&n.status==="errore-verifica"){try{localStorage.setItem("_pushStato","errore-verifica")}catch{}g('\u26A0 Push attivate ma NON confermate sul server \u2014 usa "Ri-registra subscription"',"error")}else{try{localStorage.setItem("_pushStato","errore-salvataggio")}catch{}g("\u26A0 Push attivate localmente ma salvataggio server incerto","error")}"caches"in window&&await(await caches.open("prod-auth")).put("username",new Response(b.nome.toUpperCase()))}setTimeout(_i,400)}catch(t){console.warn("[Push] toggle:",t),g("Errore attivazione notifiche push","error")}}async function _i(){let t=document.getElementById("btn-toggle-push"),e=document.getElementById("push-status-dot"),o=document.getElementById("push-status-text");if(!(!t&&!e)){if(!("serviceWorker"in navigator)||!("PushManager"in window)){o&&(o.textContent="Non supportate da questo browser"),t&&(t.disabled=!0);return}try{let a=!!await(await navigator.serviceWorker.ready).pushManager.getSubscription(),s="";try{let r=localStorage.getItem("_pushStato");r==="ok"?s=" \u2714 registrato sul server":r==="errore-verifica"?s=" \u26A0 salvato ma non confermato \u2014 ri-registra":r==="errore-salvataggio"?s=" \u26A0 non salvato sul server":r==="errore-subscribe"?s=" \u26A0 errore subscribe":r&&r.startsWith("errore:")&&(s=" \u26A0 "+r.replace("errore:",""))}catch{}t&&(t.innerHTML=a?'<i class="fas fa-bell-slash"></i> Disattiva notifiche push':'<i class="fas fa-bell"></i> Attiva notifiche push',t.style.background=a?"#14532d":"",t.style.borderColor=a?"#16a34a":"",t.style.color=a?"#86efac":""),e&&(e.style.background=a?"#22c55e":"#6b7280"),o&&(o.textContent=a?"Attive su questo dispositivo"+s:"Non attive su questo dispositivo")}catch{}}}function Ei(t){let e="=".repeat((4-t.length%4)%4),o=(t+e).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(o);return Uint8Array.from([...i].map(n=>n.charCodeAt(0)))}async function Ml(t){let e=t&&t.files&&t.files[0],o=document.getElementById("csv-upload-filename"),i=document.getElementById("csv-upload-result");if(!e)return;o&&(o.textContent=e.name),i&&(i.style.display="none",i.innerHTML="");let n=await new Promise((r,c)=>{let l=new FileReader;l.onload=d=>r(d.target.result),l.onerror=c,l.readAsText(e,"UTF-8")}),a=n.split(`
`)[0]||"",s=a.split(";").length>=a.split(",").length?";":",";i&&(i.style.display="block",i.innerHTML='<div style="display:flex;align-items:center;gap:8px;color:#64748b;font-size:0.88rem"><i class="fas fa-spinner fa-spin"></i> Import CSV in corso\u2026</div>');try{let r=await Nl(n,s,{});if(i)if(r.status==="ok"){let c=`<strong>\u2705 Import completato</strong><br>Nuovi: <strong>${r.nuove||0}</strong> \xB7 Saltati: <strong>${r.saltate||0}</strong>`;r.aggiornate>0&&(c+=` \xB7 Qty aggiornate: <strong>${r.aggiornate}</strong>`),r.reviewCount>0&&(c+=`<br><span style="color:#d97706">\u26A0 <strong>${r.reviewCount}</strong> righe da attenzionare \u2014 vai in Produzione per rivederle.</span>`),i.innerHTML=`<div style="background:#dcfce7;border:1px solid #86efac;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#166534">${c}</div>`,setTimeout(()=>{typeof window.caricaDati=="function"&&window.caricaDati("PROGRAMMA PRODUZIONE DEL MESE",!0)},800)}else i.innerHTML=po(r.msg||r.message||"Errore sconosciuto")}catch(r){i&&(i.innerHTML=po(r.message))}t.value=""}async function Nl(t,e,o){return await(await fetch(x,{method:"POST",body:JSON.stringify(Object.assign({azione:"importaOrdiniCSV",csvText:t,separatore:e},o||{}))})).json().catch(()=>({}))}function po(t){return`<div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#991b1b"><strong>\u274C Errore:</strong> ${t||"Errore sconosciuto"}</div>`}async function ql(t){let e=t&&t.files&&t.files[0],o=document.getElementById("ldc-upload-filename"),i=document.getElementById("ldc-upload-result");if(!e)return;o&&(o.textContent=e.name),i&&(i.style.display="none",i.innerHTML="");let n=await new Promise((r,c)=>{let l=new FileReader;l.onload=d=>r(d.target.result),l.onerror=c,l.readAsText(e,"UTF-8")}),a=n.split(`
`)[0]||"",s=a.split(";").length>=a.split(",").length?";":",";i&&(i.style.display="block",i.innerHTML='<div style="display:flex;align-items:center;gap:8px;color:#64748b;font-size:0.88rem"><i class="fas fa-spinner fa-spin"></i> Import Lista di Carico in corso\u2026</div>');try{let c=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"importaListaDiCarico",csvText:n,separatore:s})})).json().catch(()=>({}));if(i)if(c.status==="ok"){let l=`<strong>\u2705 Import completato</strong><br>Nuovi: <strong>${c.nuove||0}</strong> \xB7 Aggiornati: <strong>${c.aggiornate||0}</strong> \xB7 Invariati: <strong>${c.invariate||0}</strong>`;c.corrette>0&&(l+=`<br><span style="color:#b45309"><i class="fas fa-exclamation-triangle"></i> ${c.corrette} righe corrette automaticamente (campi con separatore nel testo)</span>`),c.missingCount>0&&(l+=`<br><span style="color:#d97706">\u26A0 <strong>${c.missingCount}</strong> ordini non presenti nel CSV \u2014 vai nel tab Fornitori per archiviarli.</span>`),i.innerHTML=`<div style="background:#dcfce7;border:1px solid #86efac;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#166534">${l}</div>`,typeof window.invalidateOFCache=="function"&&window.invalidateOFCache()}else i.innerHTML=po(c.msg||c.message||"Errore sconosciuto")}catch(r){i&&(i.innerHTML=po(r.message))}t.value=""}async function $e(){let t="_impostazioni_cache",e="_impostazioni_stati_forn_cache",i=ht(t,1/0);if(i){try{let n=typeof i=="string"?JSON.parse(i):i;if(n.stati&&n.stati.length){window.listaStati=n.stati,window.listaOperatori=n.operatori||[],window._distintaHeaderAzienda=String(n.distintaHeaderAzienda||""),qa(n.overviewStati);let a=ht(e,1/0);if(a)try{let s=typeof a=="string"?JSON.parse(a):a;Array.isArray(s)&&s.length&&(window.listaStatiFornitori=s)}catch{}ht(t,3e5)||uo().catch(s=>console.warn("[impostazioni] bg refresh:",s));return}}catch(n){console.warn("[impostazioni] cache JSON corrotta, ricarico dal server:",n)}U(t)}await uo()}async function uo(){let t="_impostazioni_cache",e="_impostazioni_stati_forn_cache";try{let i=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"getImpostazioni",noCache:!0})})).json();window.listaStati=i.stati&&i.stati.length?i.stati:window._defaultListaStati_(),window.listaOperatori=i.operatori||[],window._distintaHeaderAzienda=String(i.distintaHeaderAzienda||""),qa(i.overviewStati),Z(t,JSON.stringify({stati:window.listaStati,operatori:window.listaOperatori,overviewStati:i.overviewStati,distintaHeaderAzienda:window._distintaHeaderAzienda}))}catch(o){console.warn("[Boot] _fetchImpostazioniDaServer:",o),g("Impostazioni non aggiornate \u2014 uso dati locali.","warning")}try{let i=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"getStatiFornitoriConfig"})})).json();i.stati&&i.stati.length&&(window.listaStatiFornitori=i.stati,Z(e,JSON.stringify(i.stati)))}catch{}}function qa(t){t&&(Array.isArray(t.art)&&t.art.length&&(window._ovStatiArt=t.art.map(e=>e.toUpperCase().trim())),Array.isArray(t.ord)&&t.ord.length&&(window._ovStatiOrd=t.ord.map(e=>e.toUpperCase().trim())))}function Dl(t,e){let o=document.getElementById(t);if(!o)return;let i=e.querySelector(".settings-row-arrow"),n=o.style.display==="block";o.style.display=n?"none":"block",i&&(i.style.transform=n?"":"rotate(180deg)"),e.classList.toggle("settings-row-active",!n),!n&&(t==="section-utenti"||t==="section-team-utenti")&&Te(),!n&&t==="section-qr-postazioni"&&requestAnimationFrame(()=>gi())}async function Te(){let t=document.getElementById("lista-utenti-config");if(t){t.innerHTML='<div class="centered-msg small">Caricamento...</div>';try{let o=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"getUtenti"})})).json();if(!o.length){t.innerHTML='<p class="centered-msg small">Nessun utente creato. Clicca "+ Aggiungi Utente".</p>';return}t.innerHTML=o.map(i=>{let n=i.id_riga,a=(i.username||"").trim(),s=(i.email||"").trim(),r=(i.ruolo||"OPERATORE").trim().toUpperCase(),c=Number(i.max_utenti)||1;return`
            <div class="config-row-modern utente-row" data-id="${n}">
                <div class="settings-actions-row" style="gap:12px">
                    <div class="settings-options-row" style="gap:10px">
                        <div class="avatar-circle">${(y(a.charAt(0))||"?").toUpperCase()}</div>
                        <input type="text" class="input-flat" id="ut-username-${n}" value="${y(a).replace(/"/g,"&quot;")}" onchange="" placeholder="Username">
                    </div>
                    <div class="settings-options-row" style="gap:8px">
                        <button type="button" class="btn-modal-send" onclick="salvaModificheUtente(${n})" title="Salva modifiche">
                            <i class="fas fa-save"></i>
                        </button>
                        <button type="button" class="btn-trash-modern" onclick="eliminaUtente(${n}, ${JSON.stringify(a)})" title="Elimina utente">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="grid-2col gap-8" style="margin-top:10px">
                    <input type="email" class="input-field-modern" id="ut-email-${n}" placeholder="Email" value="${s.replace(/"/g,"&quot;")}">
                    <select class="input-field-modern" id="ut-ruolo-${n}">
                        <option value="OPERATORE" ${r==="OPERATORE"?"selected":""}>Operatore</option>
                        <option value="COMMERCIALE" ${r==="COMMERCIALE"?"selected":""}>Commerciale</option>
                        <option value="MASTER" ${r==="MASTER"?"selected":""}>Admin</option>
                    </select>
                </div>
                <div class="grid-2col gap-8" style="margin-top:10px">
                    <input type="number" class="input-field-modern" id="ut-max-${n}" min="1" max="10" value="${c}">
                    <input type="password" class="input-field-modern" id="ut-pass-${n}" placeholder="Nuova password (opzionale)">
                </div>
                <div class="utente-max" style="margin-top:8px; opacity:0.85">Lascia la password vuota per non cambiarla.</div>
            </div>`}).join("")}catch{t.innerHTML='<p class="centered-msg small text-danger">Errore nel caricamento utenti.</p>'}}}async function Bl(t){let e=Number(t);if(!e)return;let o=document.getElementById(`ut-email-${e}`),i=document.getElementById(`ut-username-${e}`),n=document.getElementById(`ut-ruolo-${e}`),a=document.getElementById(`ut-max-${e}`),s=document.getElementById(`ut-pass-${e}`),r=(o?.value||"").trim(),c=(i?.value||"").trim(),l=(n?.value||"OPERATORE").trim().toUpperCase(),d=parseInt(a?.value||"1",10),u=(s?.value||"").trim();if(!r||!c){g("Email e username sono obbligatori.","error");return}if(u&&u.length<4){g("La password deve essere di almeno 4 caratteri.","error");return}let f="";u&&(f=await Ra(u));try{let m=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"aggiornaUtente",id_riga:e,email:r,username:c,ruolo:l,max_utenti:d,hash:f})})).json();m.status==="success"?(g("Utente aggiornato."),s&&(s.value=""),Te()):g(m.message||"Errore aggiornamento utente.","error")}catch{g("Errore di connessione.","error")}}function Ul(){let t=document.getElementById("form-nuovo-utente");t&&(t.style.display="block",document.getElementById("nu-email").value="",document.getElementById("nu-username").value="",document.getElementById("nu-password").value="",document.getElementById("nu-ruolo").value="OPERATORE",document.getElementById("nu-max").value="1")}async function Fl(){let t=(document.getElementById("nu-email")?.value||"").trim(),e=(document.getElementById("nu-username")?.value||"").trim(),o=(document.getElementById("nu-password")?.value||"").trim(),i=document.getElementById("nu-ruolo")?.value||"OPERATORE",n=parseInt(document.getElementById("nu-max")?.value||"1");if(!t||!e||!o){g("Compila tutti i campi: email, username, password.","error");return}if(o.length<4){g("La password deve essere di almeno 4 caratteri.","error");return}let a=document.querySelector("#form-nuovo-utente .btn-modal-send");a.disabled=!0,a.innerHTML='<i class="fas fa-spinner fa-spin"></i>';try{let s=await Ra(o),c=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"creaUtente",email:t,username:e,hash:s,ruolo:i,max_utenti:n})})).json();c.status==="success"?(g(`Utente "${e}" creato con successo!`),document.getElementById("form-nuovo-utente").style.display="none",Te()):g(c.message||"Errore nella creazione utente.","error")}catch{g("Errore di connessione.","error")}a.disabled=!1,a.innerHTML="Salva Utente"}function Hl(t,e){rt("Elimina Utente",`Eliminare l'utente "${e}"? Non potr\xE0 pi\xF9 accedere.`,async()=>{try{let i=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"eliminaUtente",id_riga:t})})).json();i.status==="success"?(g(`Utente "${e}" eliminato.`),Te()):g(i.message||"Errore durante eliminazione.","error")}catch{g("Errore di connessione.","error")}},"Elimina")}function jl(t){let e=Number(t||0);if(!e)return"-";try{return new Date(e).toLocaleString("it-IT")}catch{return"-"}}async function xi(){if(!b||b.ruolo!=="MASTER")return;let t=document.getElementById("session-stats-wrap");if(t){t.innerHTML='<div style="font-size:12px;color:#64748b">Caricamento sessioni...</div>';try{let o=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"getSessionStats",username:String(b.nome||"").toUpperCase(),email:String(b.email||"").toLowerCase()})})).json();if(!o||o.status!=="success"){t.innerHTML='<div style="font-size:12px;color:#b91c1c">Impossibile caricare statistiche sessioni.</div>';return}let i=o.totals||{},a=(Array.isArray(o.byUser)?o.byUser:[]).slice(0,8);t.innerHTML=`
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Sessioni attive: <strong>${i.activeSessions||0}</strong></span>
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Utenti attivi: <strong>${i.usersWithSessions||0}</strong></span>
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Righe sessione: <strong>${i.rows||0}</strong></span>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
                <div style="display:grid;grid-template-columns:1.2fr .6fr .8fr;background:#f8fafc;padding:8px 10px;font-size:11px;font-weight:700;color:#475569">
                    <div>Utente</div><div>Sessioni</div><div>Ultimo accesso</div>
                </div>
                ${a.length?a.map(function(s){return`<div style="display:grid;grid-template-columns:1.2fr .6fr .8fr;padding:8px 10px;font-size:12px;border-top:1px solid #f1f5f9">
                        <div>${s.username||"-"}</div>
                        <div>${s.activeSessions||0}</div>
                        <div>${jl(s.latestSeenTs)}</div>
                    </div>`}).join(""):'<div style="padding:10px;font-size:12px;color:#64748b">Nessuna sessione attiva</div>'}
            </div>
        `}catch{t.innerHTML='<div style="font-size:12px;color:#b91c1c">Errore rete durante il caricamento sessioni.</div>'}}}async function Gl(){let t=(document.getElementById("session-username-target")?.value||"").trim().toUpperCase();if(!t){g("Inserisci uno username da revocare.","error");return}if(confirm("Revocare tutte le sessioni per "+t+"?"))try{let o=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"revocaSessioniUtente",usernameTarget:t})})).json();if(o&&o.status==="success"){g("Sessioni revocate: "+(o.removed||0)),xi();return}g(o&&(o.message||o.msg)||"Revoca non riuscita.","error")}catch{g("Errore rete durante revoca sessioni.","error")}}async function Vl(){if(confirm("Revocare TUTTE le sessioni (eccetto quella corrente)?"))try{let e=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"revocaTutteSessioni"})})).json();if(e&&e.status==="success"){g("Sessioni globali revocate: "+(e.removed||0)),xi();return}g(e&&(e.message||e.msg)||"Revoca globale non riuscita.","error")}catch{g("Errore rete durante revoca globale.","error")}}function Vt(){let t=document.getElementById("contenitore-dati");if(!t)return;let e=window.listaStati||[],o=window.TW||{};t.innerHTML=`
        <div class="settings-accordion">

            <!-- ROW: Stati Produzione -->
            <div class="settings-row" onclick="toggleSettingsSection('section-stati', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-tag"></i></div>
                    <div>
                        <div class="settings-row-title">Stati Produzione</div>
                        <div class="settings-row-sub">${e.length} stati configurati</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-stati" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div id="lista-stati-config">
                        ${e.map((i,n)=>`
                            <div class="config-row-modern row" draggable="true" data-idx="${n}">
                                <i class="fas fa-grip-vertical drag-handle"></i>
                                <div class="color-picker-wrapper">
                                    <input type="color" value="${i.colore}" class="color-overlay"
                                           onchange="listaStati[${n}].colore=this.value; segnaModifica(); caricaInterfacciaImpostazioni();">
                                    <div class="status-dot-custom" style="--bg-color:${i.colore};"></div>
                                </div>
                                <input type="text" class="input-flat flex-grow" value="${i.nome||i.stato}" onchange="listaStati[${n}].nome=this.value.toUpperCase(); segnaModifica();">
                                <button type="button" class="btn-trash-modern" onclick="azioneEliminaStato(${n})"><i class="fas fa-trash"></i></button>
                            </div>
                        `).join("")}
                    </div>
                    <button class="btn-add-dashed" onclick="azioneAggiungiStato()">+ Aggiungi Stato</button>
                </div>
            </div>

            <!-- ROW: Stati Ordini Fornitori -->
            ${(()=>{let i=window.listaStatiFornitori||[];return`<div class="settings-row" onclick="toggleSettingsSection('section-stati-fornitori', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-truck"></i></div>
                    <div>
                        <div class="settings-row-title">Stati Ordini Fornitori</div>
                        <div class="settings-row-sub">${i.length} stati configurati</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-stati-fornitori" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div id="lista-stati-fornitori-config">
                        ${i.map((n,a)=>{let s=n.stato||n.nome||"",r=n.colore||"#94a3b8";return`<div class="config-row-modern row" data-idx="${a}">
                                <div class="color-picker-wrapper">
                                    <input type="color" value="${r}" class="color-overlay"
                                           onchange="(window.listaStatiFornitori||[])[${a}].colore=this.value; segnaModifica(); caricaInterfacciaImpostazioni();">
                                    <div class="status-dot-custom" style="--bg-color:${r};"></div>
                                </div>
                                <input type="text" class="input-flat flex-grow" value="${s}" onchange="(window.listaStatiFornitori||[])[${a}].stato=this.value.toUpperCase(); segnaModifica();">
                                <button type="button" class="btn-trash-modern" onclick="azioneEliminaStatoFornitori(${a})"><i class="fas fa-trash"></i></button>
                            </div>`}).join("")}
                    </div>
                    <button class="btn-add-dashed" onclick="azioneAggiungiStatoFornitori()">+ Aggiungi Stato</button>
                </div>
            </div>`})()}

            <div class="settings-row" onclick="toggleSettingsSection('section-distinta-stampa', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-print"></i></div>
                    <div>
                        <div class="settings-row-title">Distinta Base Stampabile</div>
                        <div class="settings-row-sub">Intestazione azienda usata nella preview e nella stampa della distinta</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-distinta-stampa" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <h3 style="margin:0 0 8px 0">Intestazione azienda</h3>
                    <p style="margin:0 0 12px 0;font-size:0.85rem;color:#64748b">Questo testo compare in alto a sinistra nella distinta base. Se lo lasci vuoto, la stampa non mostra nessuna intestazione.</p>
                    <textarea class="input-field-modern" rows="4" placeholder="Ragione sociale, indirizzo, contatti..." style="width:100%;resize:vertical;min-height:110px"
                              oninput="window._distintaHeaderAzienda=this.value; segnaModifica();">${y(String(window._distintaHeaderAzienda||""))}</textarea>
                </div>
            </div>

            <!-- ROW: Team + Utenti (solo MASTER) -->
            ${b.ruolo==="MASTER"?`
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
                                <option value="COMMERCIALE">Commerciale</option>
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

            <div class="settings-row" onclick="toggleSettingsSection('section-sessioni-attive', this); setTimeout(_caricaSessionStats_, 120)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-shield-alt"></i></div>
                    <div>
                        <div class="settings-row-title">Sicurezza Sessioni</div>
                        <div class="settings-row-sub">Monitor sessioni attive e revoca accessi</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-sessioni-attive" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
                        <input id="session-username-target" type="text" class="input-field-modern" placeholder="Username da revocare" style="max-width:220px">
                        <button class="qr-post-btn" style="padding:8px 12px;height:auto" onclick="_revocaSessioniUtenteDaUI()">Revoca utente</button>
                        <button class="qr-post-btn qr-post-btn-danger" style="padding:8px 12px;height:auto" onclick="_revocaTutteSessioniDaUI()">Revoca globale</button>
                        <button class="qr-post-btn" style="padding:8px 12px;height:auto" onclick="_caricaSessionStats_()"><i class="fas fa-sync"></i></button>
                    </div>
                    <div id="session-stats-wrap"></div>
                </div>
            </div>
            `:""}

            <!-- ROW: Importa CSV Ordini (solo MASTER) -->
            ${b.ruolo==="MASTER"?`
            <div class="settings-row" onclick="toggleSettingsSection('section-importa-csv', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-file-csv"></i></div>
                    <div>
                        <div class="settings-row-title">Importa Ordini da CSV</div>
                        <div class="settings-row-sub">Carica il CSV del gestionale direttamente, senza passare da Sheets</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-importa-csv" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <h3 style="margin:0 0 8px 0">Importa Ordini da CSV</h3>
                    <p style="margin:0 0 14px 0;font-size:0.85rem;color:#64748b">Seleziona il file CSV esportato dal gestionale (separatore <strong>;</strong>). I duplicati vengono saltati automaticamente.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                        <label style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:#f1f5f9;border:2px dashed #94a3b8;border-radius:10px;cursor:pointer;font-size:0.88rem;font-weight:600;color:#334155;transition:background 0.15s" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                            <i class="fas fa-folder-open" style="color:#3b82f6"></i>
                            Scegli file CSV
                            <input type="file" id="csv-upload-input" accept=".csv,text/csv" style="display:none" onchange="importaCSVDaFile(this)">
                        </label>
                        <span id="csv-upload-filename" style="font-size:0.82rem;color:#64748b;font-style:italic">Nessun file selezionato</span>
                    </div>
                    <div id="csv-upload-result" style="margin-top:14px;display:none"></div>
                </div>
            </div>
            `:""}

            <!-- ROW: Importa Lista di Carico (solo MASTER) -->
            ${b.ruolo==="MASTER"?`
            <div class="settings-row" onclick="toggleSettingsSection('section-importa-ldc', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-truck-loading"></i></div>
                    <div>
                        <div class="settings-row-title">Importa Lista di Carico</div>
                        <div class="settings-row-sub">Carica il CSV della lista di carico (ordini fornitori)</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-importa-ldc" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <h3 style="margin:0 0 8px 0">Importa Lista di Carico</h3>
                    <p style="margin:0 0 14px 0;font-size:0.85rem;color:#64748b">Seleziona il file CSV "Lista di Carico" esportato dal gestionale (separatore <strong>;</strong>). Le righe esistenti vengono aggiornate automaticamente.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                        <label style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:#f1f5f9;border:2px dashed #94a3b8;border-radius:10px;cursor:pointer;font-size:0.88rem;font-weight:600;color:#334155;transition:background 0.15s" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                            <i class="fas fa-folder-open" style="color:#3b82f6"></i>
                            Scegli file CSV
                            <input type="file" id="ldc-upload-input" accept=".csv,text/csv" style="display:none" onchange="importaListaDiCaricoDaFile(this)">
                        </label>
                        <span id="ldc-upload-filename" style="font-size:0.82rem;color:#64748b;font-style:italic">Nessun file selezionato</span>
                    </div>
                    <div id="ldc-upload-result" style="margin-top:14px;display:none"></div>
                </div>
            </div>
            `:""}

            <!-- ROW: Postazioni QR -->
            <div class="settings-row" onclick="toggleSettingsSection('section-qr-postazioni', this)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-qrcode"></i></div>
                    <div>
                        <div class="settings-row-title">Postazioni QR Code</div>
                        <div class="settings-row-sub">${K.length} postazioni configurate</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-qr-postazioni" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div id="qr-postazioni-lista">
                        ${K.length===0?'<div style="text-align:center;color:#9ca3af;padding:20px;font-size:13px">Nessuna postazione configurata</div>':K.map((i,n)=>`
                            <div class="qr-post-row" data-idx="${n}">
                                <img class="qr-post-canvas" id="qr-list-canvas-${n}" alt="QR" style="width:56px;height:56px;border-radius:6px;background:#f8fafc;flex-shrink:0">
                                <div class="qr-post-info">
                                    <span class="qr-post-nome">${i.icona||"\u{1F4CD}"} ${i.nome}</span>
                                    <span class="qr-post-codice">${i.codice}</span>
                                </div>
                                <div class="qr-post-actions">
                                    <button class="qr-post-btn" onclick="_qrApriModalModifica(${n})" title="Modifica"><i class="fas fa-pen"></i></button>
                                    <button class="qr-post-btn qr-post-btn-print" onclick="_qrStampaSingolaIdx(${n})" title="Stampa QR"><i class="fas fa-print"></i></button>
                                    <button class="qr-post-btn qr-post-btn-danger" onclick="_qrEliminaPostazione(${n})" title="Elimina"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>`).join("")}
                    </div>
                    <div class="qr-post-footer-btns">
                        <button class="qr-post-btn-add" onclick="_qrApriModalNuova()"><i class="fas fa-plus"></i> Aggiungi Postazione</button>
                        <button class="qr-post-btn-print-all" onclick="_qrStampaTutte()"><i class="fas fa-print"></i> Stampa tutte</button>
                    </div>
                </div>
            </div>

            <!-- ROW: Notifiche Push -->
            <div class="settings-row" onclick="toggleSettingsSection('section-notifiche', this); setTimeout(_aggiornaUINotifiche, 200)">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-bell"></i></div>
                    <div>
                        <div class="settings-row-title">Notifiche Push</div>
                        <div class="settings-row-sub">Ricevi avvisi su questo dispositivo</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-notifiche" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                        <span id="push-status-dot" style="width:10px;height:10px;border-radius:50%;background:#6b7280;flex-shrink:0"></span>
                        <span id="push-status-text" style="font-size:0.85rem;color:#9ca3af">Controlla stato...</span>
                    </div>
                    <button id="btn-toggle-push" class="settings-action-btn" onclick="_togglePushPermission()" style="width:100%;padding:14px 18px;font-size:0.97rem;font-weight:700;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.2s">
                        <i class="fas fa-bell"></i> Attiva notifiche push
                    </button>
                    <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
                        <button id="btn-force-regpush" onclick="_forzaRiregistraPush()" style="flex:1;min-width:140px;padding:10px 14px;font-size:0.82rem;font-weight:600;border-radius:10px;border:1px solid #e2e8f0;background:#fff;color:#1e293b;cursor:pointer;transition:background 0.15s">
                            \u{1F504} Ri-registra subscription
                        </button>
                        <button id="btn-test-push" onclick="_testPushNotifica()" style="flex:1;min-width:120px;padding:10px 14px;font-size:0.82rem;font-weight:600;border-radius:10px;border:1px solid #e2e8f0;background:#fff;color:#1e293b;cursor:pointer;transition:background 0.15s">
                            \u{1F528} Invia notifica di test
                        </button>
                        ${b.ruolo==="MASTER"?'<button onclick="_mostraDiagnosticaPush()" style="flex:1;min-width:120px;padding:10px 14px;font-size:0.82rem;font-weight:600;border-radius:10px;border:1px solid #fcd34d;background:#fefce8;color:#92400e;cursor:pointer;transition:background 0.15s">\u{1F50D} Diagnostica Push</button>':""}
                    </div>
                    <div style="margin-top:20px;border-top:1px solid rgba(255,255,255,0.07);padding-top:16px">
                        <div style="font-size:0.78rem;font-weight:600;color:#9ca3af;letter-spacing:.5px;margin-bottom:12px">TIPOLOGIE DI AVVISI</div>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-richieste" onchange="_onNotifPrefChange()"
                                ${lo().richieste?"checked":""}>
                            <span><i class="fas fa-comment-dots" style="color:#242424"></i>&nbsp;Nuove richieste / messaggi</span>
                        </label>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-assegnazioni" onchange="_onNotifPrefChange()"
                                ${lo().assegnazioni?"checked":""}>
                            <span><i class="fas fa-user-check" style="color:#34d399"></i>&nbsp;Assegnazioni ordine</span>
                        </label>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-stato" onchange="_onNotifPrefChange()"
                                ${lo().stato?"checked":""}>
                            <span><i class="fas fa-sync-alt" style="color:#f59e0b"></i>&nbsp;Cambi di stato articoli</span>
                        </label>
                    </div>
                </div>
            </div>

            ${b.ruolo==="MASTER"?`
            <!-- ROW: Diagnostica Sync -->
            <div class="settings-row" onclick="toggleSettingsSection('section-diag-sync', this); if(document.getElementById('section-diag-sync').style.display==='block') _aggiornaDiagnosticaSync()">
                <div class="settings-row-left">
                    <div class="settings-row-icon"><i class="fas fa-stethoscope"></i></div>
                    <div>
                        <div class="settings-row-title">Diagnostica Sync</div>
                        <div class="settings-row-sub">Revisione, polling e cache in tempo reale</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-diag-sync" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div style="display:grid;grid-template-columns:max-content 1fr;gap:6px 12px;font-size:0.86rem;align-items:baseline">
                        <span style="font-weight:600;color:#64748b">Revision attuale:</span>
                        <span id="diag-revision" style="font-family:monospace;color:#1e293b">\u2014</span>
                        <span style="font-weight:600;color:#64748b">Ultimo check:</span>
                        <span id="diag-lastcheck" style="font-family:monospace;color:#1e293b">\u2014</span>
                        <span style="font-weight:600;color:#64748b">Utenti online:</span>
                        <span id="diag-online" style="color:#1e293b">\u2014</span>
                        <span style="font-weight:600;color:#64748b">Cache IndexedDB:</span>
                        <div id="diag-cache" style="color:#1e293b">\u2014</div>
                    </div>
                    <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
                        <button onclick="_aggiornaDiagnosticaSync()" style="padding:8px 14px;font-size:0.83rem;font-weight:600;border-radius:9px;border:1px solid #e2e8f0;background:#fff;color:#1e293b;cursor:pointer">
                            <i class="fas fa-sync-alt"></i> Aggiorna
                        </button>
                        <button onclick="_forceRevisionBump()" style="padding:8px 14px;font-size:0.83rem;font-weight:600;border-radius:9px;border:1px solid #fcd34d;background:#fefce8;color:#92400e;cursor:pointer">
                            <i class="fas fa-broadcast-tower"></i> Forza refresh globale
                        </button>
                        <button onclick="_svuotaCacheLocale()" style="padding:8px 14px;font-size:0.83rem;font-weight:600;border-radius:9px;border:1px solid #fca5a5;background:#fff5f5;color:#b91c1c;cursor:pointer">
                            <i class="fas fa-trash-alt"></i> Svuota cache locale
                        </button>
                    </div>
                </div>
            </div>
            `:""}

        </div>

        <div class="centered-fullwidth my-30">
            <button type="button" class="${o.btnPrimaryLg||"inline-flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] transition shadow-sm"}" onclick="salvaTutteImpostazioni()">
                <i class="fas fa-save"></i> Salva Modifiche
            </button>
        </div>
    `,z(t),requestAnimationFrame(()=>gi()),b&&td("lista-stati-config",i=>{let n=[...i.querySelectorAll("[data-idx]")],a=n.map(s=>(window.listaStati||[])[+s.dataset.idx]);window.listaStati&&(window.listaStati.length=0,a.forEach((s,r)=>{window.listaStati.push(s),n[r].dataset.idx=r})),ce()})}async function Jl(){let t=document.getElementById("diag-revision"),e=document.getElementById("diag-lastcheck"),o=document.getElementById("diag-online"),i=document.getElementById("diag-cache");if(!t)return;if(t.textContent=M.lastRevisionValue!==null?String(M.lastRevisionValue):"\u2014",M.lastCheckTs){let a=new Date(M.lastCheckTs);e.textContent=a.toLocaleTimeString("it-IT")}else e.textContent="\u2014";let n=M.lastOnlineList;n&&n.length>0?o.textContent=n.map(a=>a.nome+(a.pagina?" ("+a.pagina+")":"")).join(", "):o.textContent="Nessuno";try{let a=await N.listEntries();a.length?i.innerHTML=a.map(s=>{let r=Math.round((Date.now()-s.timestamp)/1e3),c=Date.now()-s.timestamp>N.TTL;return`<span style="display:block;font-family:monospace;font-size:0.78rem;color:${c?"#ef4444":"#16a34a"}">${s.chiave} <em style="color:#94a3b8">(${r}s fa${c?" \xB7 stale":""})</em></span>`}).join(""):i.textContent="Vuota"}catch{i.textContent="Errore lettura cache"}}async function Wl(){try{let e=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"forceRevisionBump",sessionToken:window._getSessionToken_()})})).json();e&&e.status==="ok"?g("\u2714 Revision bumped a "+e.nuovaRevision+" \u2014 tutti i client aggiorneranno entro 15s"):e&&e.status==="auth_error"?window._gestisciAuthError_&&window._gestisciAuthError_(e.message):g("\u26A0\uFE0F "+(e&&e.message?e.message:"Errore"),"error")}catch{g("\u26A0\uFE0F Errore di rete","error")}}async function Zl(){if(confirm("Svuota la cache IndexedDB e ricarica la pagina?")){try{await N.clear()}catch{}location.reload()}}function Ql(t){confirm("Sei sicuro di voler eliminare questo stato?")&&((window.listaStati||[]).splice(t,1),ce(),Vt())}function Kl(){(window.listaStati||[]).push({nome:"NUOVO",colore:"#94a3b8"}),ce(),Vt()}function Yl(t){confirm("Sei sicuro di voler eliminare questo stato?")&&((window.listaStatiFornitori||[]).splice(t,1),ce(),Vt())}function Xl(){window.listaStatiFornitori||(window.listaStatiFornitori=[]),window.listaStatiFornitori.push({stato:"NUOVO",colore:"#94a3b8"}),ce(),Vt()}function ce(){window.modifichePendenti=!0;let t=document.getElementById("btn-salva-globale");t&&(t.style.background="#ef4444",t.innerHTML="<i class='fas fa-exclamation-triangle'></i> Salva Modifiche Ora!")}function td(t,e){let o=document.getElementById(t);if(!o)return;let i=null;o.addEventListener("dragstart",function(c){if(!(o.querySelector(".dnd-handle, .drag-handle")&&!c.target.closest(".dnd-handle, .drag-handle"))){if(i=c.target.closest('[draggable="true"]'),!i||!o.contains(i)){i=null;return}i.classList.add("dnd-dragging"),c.dataTransfer.effectAllowed="move",c.dataTransfer.setData("text/plain","")}}),o.addEventListener("dragover",function(c){if(c.preventDefault(),!i)return;let l=c.target.closest('[draggable="true"]');if(!l||l===i||!o.contains(l))return;let d=l.getBoundingClientRect();c.clientY<d.top+d.height/2?o.insertBefore(i,l):o.insertBefore(i,l.nextSibling)}),o.addEventListener("dragend",function(c){i&&(i.classList.remove("dnd-dragging"),e&&e(o)),i=null}),o.addEventListener("drop",function(c){c.preventDefault(),c.stopPropagation()});let n=null,a=null,s=0,r=0;o.addEventListener("touchstart",function(c){let l=!!o.querySelector(".dnd-handle, .drag-handle"),d=c.target.closest('[draggable="true"]');if(!d||!o.contains(d)||l&&!c.target.closest(".dnd-handle, .drag-handle"))return;n=d;let u=c.touches[0],f=eo(d,u.clientX,u.clientY,{opacity:.85,borderRadius:"14px",shadow:"0 10px 30px rgba(0,0,0,0.25)"});a=f.ghost,s=f.offX,r=f.offY,d.style.opacity="0.25",d.style.transform="scale(0.97)"},{passive:!0}),o.addEventListener("touchmove",function(c){if(!n||!a)return;c.preventDefault();let l=c.touches[0];oo(a,l.clientX,l.clientY,s,r);let d=la(a,l.clientX,l.clientY,'[draggable="true"]');if(d&&d!==n&&o.contains(d)){let u=d.getBoundingClientRect();o.insertBefore(n,l.clientY<u.top+u.height/2?d:d.nextSibling)}},{passive:!1}),o.addEventListener("touchend",function(){n&&(n.style.opacity="",n.style.transform="",io(a),a=null,e&&e(o),n=null)})}async function ed(){try{let e=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"salva_impostazioni_globali",sessionToken:window._getSessionToken_(),stati:window.listaStati||[],operatori:[],distintaHeaderAzienda:String(window._distintaHeaderAzienda||"").trim()})})).json().catch(()=>({}));if(e.status==="success"){if(window.listaStatiFornitori&&window.listaStatiFornitori.length)try{await fetch(x,{method:"POST",body:JSON.stringify({azione:"saveStatiFornitoriConfig",stati:window.listaStatiFornitori})})}catch{}g("Impostazioni salvate correttamente!"),window.modifichePendenti=!1;let o=document.getElementById("btn-salva-globale");o&&(o.style.background="",o.innerHTML="<i class='fas fa-save'></i> Salva Impostazioni"),U("_impostazioni_cache"),U("_impostazioni_stati_forn_cache"),window.cacheContenuti&&Object.keys(window.cacheContenuti).forEach(i=>delete window.cacheContenuti[i]),Object.keys(localStorage).filter(i=>i.startsWith("_html_")).forEach(i=>localStorage.removeItem(i)),await uo()}else g("Errore: "+(e.message||"risposta inattesa dal server"),"error")}catch{g("Errore nel salvataggio.","error")}}function Da(){window._avatarStartAdd=ml,window._avatarConfirmEdit=vl,window._avatarCancelEdit=hl,window._avatarDeleteEdit=bl,window._avatarRipristinaPredefiniti=yl,window._renderPredefinedSwatches=hi,window._renderCustomSwatches=Gt,window._applyAvatarColorUI=Na,window._setAvatarColor=Si,window._avatarStartAddMob=wl,window._avatarConfirmEditMob=_l,window._avatarCancelEditMob=El,window._avatarDeleteEditMob=xl,window.toggleAccountMenu=Il,window.chiudiAccountMenu=Al,window._aggiornaPagina=Cl,window.toggleAccountMenuMobile=Ol,window.chiudiAccountMenuMobile=$l,window._vapidB64ToUint8_=Ei,window._mostraDiagnosticaPush=Tl,window._forzaRiregistraPush=Rl,window._testPushNotifica=kl,window._togglePushPermission=zl,window._aggiornaUINotifiche=_i,window._onNotifPrefChange=Pl,window._getNotifPrefs=lo,window.importaCSVDaFile=Ml,window.importaListaDiCaricoDaFile=ql,window.caricaInterfacciaImpostazioni=Vt,window.caricaDatiIniziali=$e,window._fetchImpostazioniDaServer=uo,window.toggleSettingsSection=Dl,window.caricaListaUtenti=Te,window.salvaModificheUtente=Bl,window.apriFormNuovoUtente=Ul,window.salvaUtenteNuovo=Fl,window.eliminaUtente=Hl,window._caricaSessionStats_=xi,window._revocaSessioniUtenteDaUI=Gl,window._revocaTutteSessioniDaUI=Vl,window._aggiornaDiagnosticaSync=Jl,window._forceRevisionBump=Wl,window._svuotaCacheLocale=Zl,window.azioneEliminaStato=Ql,window.azioneAggiungiStato=Kl,window.azioneEliminaStatoFornitori=Yl,window.azioneAggiungiStatoFornitori=Xl,window.segnaModifica=ce,window.salvaTutteImpostazioni=ed,window.apriScannerQR=ma,window._chiudiScannerQR=so,window._processaQR=ro,window._chiudiModaleQRAzione=ui,window._qrFiltroOrdini=fa,window._qrSelezionaOrdine=ga,window._qrScegliStato=va,window._qrSelezionaTutti=ha,window._qrDeselezionaTutti=ba,window._confermaSpostaPostazione=ya,window._qrApriModalNuova=wa,window._qrApriModalModifica=Sa,window._qrChiudiModalEdit=mi,window._qrAggiornaCodice=fi,window._qrRicalcolaCodice=Ea,window._qrSalvaPostazione=xa,window._qrEliminaPostazione=Ia,window._qrStampaSingola=Ca,window._qrStampaSingolaIdx=Oa,window._qrStampaTutte=$a,window._qrAggiornaPrevQR=co}function Ba(){da(),document.addEventListener("click",function(t){let e=document.getElementById("account-dropdown"),o=document.getElementById("user-avatar-btn");e&&e.classList.contains("open")&&!e.contains(t.target)&&t.target!==o&&!o.contains(t.target)&&e.classList.remove("open")}),document.addEventListener("click",function(t){let e=document.getElementById("account-dropdown-mobile"),o=document.getElementById("user-avatar-btn-mobile");!e||!o||e.classList.contains("open")&&!e.contains(t.target)&&t.target!==o&&!o.contains(t.target)&&e.classList.remove("open")}),document.addEventListener("visibilitychange",function(){document.visibilityState==="hidden"&&so()})}var j,Ua=W(()=>{ft();Pt();vt();gt();Qt();xt();no();Ta();j=null});function le(){return[...S.ovStatiArt,...S.ovStatiOrd]}function wt(t){let e=String(t||"").toUpperCase().trim();return e==="IMBALLATO"||e==="SPEDITO/CONSEGNATO"||e==="SPEDITO"||e==="CONSEGNATO"}var S,mo=W(()=>{S={ultimiDatiProduzione:null,pollProdTimer:null,POLL_PROD_MS:1e4,lastKanbanDragTs:0,mutationInFlight:0,mutationLastDone:0,prodCacheInvalidateTimer:null,attiviProd:[],ordiniAutocompleteCache:[],ovStatiArt:["PREPARARE","MANDA IN LAVORAZIONE","IN LAVORAZIONE","TORNATO DALLA LAVORAZIONE"],ovStatiOrd:["IN PRODUZIONE","IMBALLATO"],datiArchLazy:null}});function fo(t){if(!t)return 0;let e=String(t).trim(),o=e.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(o)return new Date(+o[3],+o[2]-1,+o[1]).getTime();let i=e.match(/^(\d{4})-(\d{2})-(\d{2})/);return i?new Date(+i[1],+i[2]-1,+i[3]).getTime():0}function Ii(t){if(!t)return"";let e=new Date(t),o=String(e.getDate()).padStart(2,"0"),i=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getFullYear()).slice(-2);return`${o}/${i}/${n}`}function Fa(t){if(!t)return"";let e=Date.now(),i=(t-e)/864e5;return i<0?"color:#dc2626;font-weight:700":i<=7?"color:#ea580c;font-weight:600":i<=14?"color:#ca8a04;font-weight:600":"color:#64748b"}function Jt(t,e){if(!t||t.length===0)return"";let o=window.TW,i={};t.forEach(s=>{if(!e&&String(s.archiviato).toUpperCase()==="TRUE")return;let r=s.ordine||"N.D.";i[r]||(i[r]=[]),i[r].push(s)});let n="";return Object.keys(i).sort((s,r)=>{let c=i[s].some(m=>{let h=String(m.last_modified_by||"");return h==="CSV_REVIEW_MISSING"||h==="CSV_REVIEW_FINISH"}),l=i[r].some(m=>{let h=String(m.last_modified_by||"");return h==="CSV_REVIEW_MISSING"||h==="CSV_REVIEW_FINISH"});if(c&&!l)return-1;if(!c&&l)return 1;let d=(i[s][0].cliente||"").trim().toUpperCase(),u=!d||d==="DA DEFINIRE"?(i[s][0].riferimento||s).toUpperCase():d,f=(i[r][0].cliente||"").trim().toUpperCase(),p=!f||f==="DA DEFINIRE"?(i[r][0].riferimento||r).toUpperCase():f;return u<p?-1:u>p?1:s<r?-1:s>r?1:0}).forEach(s=>{let r=i[s],c=r[0].cliente,l=r[0].riferimento||"",d=l?`<span class="riferimento-label">(${y(l)})</span>`:"",u=e?"archivio-wrapper":"",p=r.some(L=>{let F=String(L.last_modified_by||"");return F==="CSV_REVIEW_MISSING"||F==="CSV_REVIEW_FINISH"})?" csv-review-order":"",m=e?"archivio-header":"",h=e?"#475569":"inherit",w;if(s.includes("/")){let L=s.indexOf("/"),F=s.substring(0,L),V=s.substring(L+1),et=V.length>3?V.substring(0,3)+".":V;w=`${F}/${et}`}else w=s.length>14?s.substring(0,14)+"\u2026":s;let v="";if(!e)if(window._isUtenteEsente()){let L=[...new Set(r.flatMap(et=>!wt(et.stato)&&et.assegna&&et.assegna!==""&&et.assegna!=="undefined"?et.assegna.split(",").map(nt=>window._normNome(nt.trim())).filter(Boolean):[]))],F=L.length?L.map(window._normNome).join(", "):"Libero",V=window.listaOperatori.map(et=>{let nt=L.some(Ls=>Ls.toUpperCase()===window._normNome(et.nome).toUpperCase()),ze=window._getOpColor(et.nome.trim()),Mo=et.nome.trim().replace(/'/g,"\\'"),ks=s.replace(/'/g,"\\'");return`<button type="button" class="op-option${nt?" is-selected":""}" onclick="selezionaOpAssegnaOrdine(this,'${ks}','${Mo}')"><span class="op-opt-dot" style="background:${ze}"></span><span>${window._normNome(et.nome)}</span>${nt?'<i class="fas fa-check op-check-icon"></i>':""}</button>`}).join("");v=`<div class="op-dropdown op-dropdown-ord" data-nord="${s}" data-assegna-ord="${L.join(",").replace(/"/g,"&quot;")}"><button type="button" class="op-trigger op-trigger-ord" onclick="event.stopPropagation(); toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${F}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${V}</div></div>`}else{let L=(b?.nome||"").toUpperCase().trim();r.some(V=>!wt(V.stato)&&V.assegna&&V.assegna.split(",").some(et=>et.trim().toUpperCase()===L))||(v=`<button class="btn-assegnami btn-assegnami-ord" onclick="event.stopPropagation(); autoAssegnamiOrdine('${s.replace(/'/g,"\\'")}')" title="Assegnami a tutto l'ordine"><i class="fas fa-user-plus"></i></button>`)}let E=s.replace(/'/g,"\\'"),C=(c||"").replace(/'/g,"\\'"),_=r[0].id_riga,$="";if(!e){let L=r.map(nt=>String(nt.stato||"IN ATTESA").toUpperCase().trim()).filter((nt,ze,Mo)=>Mo.indexOf(nt)===ze),F=L.length===1?L[0]:`${L.length} Stati`,V=window.listaStati.find(nt=>nt.nome===L[0])||{colore:"#e2e8f0"},et=window.listaStati.map(nt=>`<button type="button" class="stato-option" onclick="event.stopPropagation(); selezionaStatoOrdine(this,'${s.replace(/'/g,"\\'")}','${nt.nome}','${nt.colore}')"><span class="stato-opt-dot" style="background:${nt.colore}"></span><span>${nt.nome}</span></button>`).join("");$=`<div class="stato-dropdown stato-dropdown-ord" data-nord="${s}"><button type="button" class="stato-trigger" onclick="event.stopPropagation(); toggleStatoDropdown(this)" title="Cambia stato tutte righe"><span class="stato-dot" style="background:${V.colore}"></span><span class="stato-label-txt">${F}</span><i class="fas fa-chevron-down stato-chevron"></i></button><div class="stato-popup">${et}</div></div>`}let k=`apriModalAiuto('${_}', 'INTERO ORDINE', '${E}', '${C}')`,R=`gestisciArchiviazione('${E}')`,O=`apriModalSollecito('','${E}','${C}','Intero Ordine')`,q=`gestisciRipristino('${E}', 'ORDINE')`,G="";e?G=`<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${q}"><i class="fa-solid fa-rotate-left"></i> Ripristina</button>`:(G+=`<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();apriInfoOrdine('${E}')"><i class="fa-solid fa-circle-info"></i> Info ordine</button>`,G+=`<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${k}"><i class="fa-regular fa-envelope"></i> Chiedi</button>`,G+=`<button class="ord-menu-item ord-menu-item--danger" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${R}"><i class="fa-solid fa-box-archive"></i> Archivia</button>`,(window._isCommerciale()||window._isUtenteEsente())&&(G+=`<button class="ord-menu-item ord-menu-item--warn" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${O}"><i class="fa-solid fa-calendar-alt"></i> Scadenza</button>`));let mt=e?"":`${v}${$}`,at=`<div class="ord-azioni-menu" onclick="event.stopPropagation()">
            <button class="ord-azioni-trigger" onclick="toggleMenuAzioni(this)" title="Azioni">
                <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="ord-azioni-popup">${G}</div>
        </div>`,P=mt+at,I=[...new Set(r.map(L=>(L.stato||"IN ATTESA").toUpperCase()))].join(","),T=(()=>{let L=1/0;return r.forEach(F=>{let V=fo(F.data_consegna);V&&V<L&&(L=V)}),L===1/0?"":String(L)})(),B=(()=>{for(let L of r){let F=fo(L.data_ordine);if(F)return String(F)}return""})(),Y=r.some(L=>{let F=parseFloat(L.qty)||0,V=parseFloat(L.qty_evasa)||0;return L.qty_evasa!==""&&L.qty_evasa!==void 0&&F>V})?"1":"0",st=T?(()=>{let L=parseInt(T),F=Fa(L),V=Ii(L);return`<span class="ord-hdr-date" style="${F}"><i class="fas fa-truck" style="font-size:.6rem;margin-right:3px;opacity:.75"></i>${V}</span>`})():"";n+=`
        <div class="ordine-wrapper ${u}${p}" data-ordine="${s}" data-cliente="${(c||"").toLowerCase().replace(/"/g,"")}" data-riferimento="${(l||"").toLowerCase().replace(/"/g,"")}" data-codici="${r.map(L=>L.codice&&L.codice!=="false"?L.codice:"").join("|").toLowerCase()}" data-stati="${I}" data-consegna-min="${T}" data-ordine-ts="${B}" data-ha-rimanente="${Y}">
            <div class="riga-ordine ${m}" onclick="toggleAccordion(this)">
                <div class="flex-grow">
                    <span class="order-title" style="--order-color:${h}" title="${y(c)}">${y(c)} ${d}</span>
                    ${st}
                </div>
                <div class="order-info">
                    <div class="badge-count ${o.pill}" title="ORD.${s}"><span class="badge-ord-num">ORD.${w}</span><span class="badge-sep">\xB7</span>${r.length} ART.</div>
                    ${P}
                </div>
            </div>
            <div class="dettagli-container${e?" hidden":""}">
                ${r.map(L=>e?id(L,s):od(L,s,c)).join("")}
            </div>
        </div>`}),n}function od(t,e,o){let i=window.TW,n=(t.stato||"IN ATTESA").toUpperCase(),a=window.listaStati.find(p=>p.nome===n)||{colore:"#e2e8f0"},s=t.codice&&t.codice!=="false"?t.codice:"Senza Codice",r=String(t.last_modified_by||""),l=r==="CSV_REVIEW_MISSING"||r==="CSV_REVIEW_FINISH"?` csv-review-blink${r==="CSV_REVIEW_MISSING"?" csv-review-missing":" csv-review-finish"}`:"",d="";r==="CSV_REVIEW_MISSING"?d=`<div class="csv-review-banner"><span class="csv-review-badge missing"><i class="fas fa-exclamation-triangle"></i> Assente dal CSV</span><button class="btn-csv-resolve" onclick="event.stopPropagation();csvReviewResolve('${t.id_riga}',this)"><i class="fas fa-check"></i> Risolvi</button></div>`:r==="CSV_REVIEW_FINISH"&&(d=`<div class="csv-review-banner"><span class="csv-review-badge finish"><i class="fas fa-paint-brush"></i> Finitura rilevata</span><button class="btn-csv-resolve" onclick="event.stopPropagation();csvReviewResolve('${t.id_riga}',this)"><i class="fas fa-check"></i> Risolvi</button></div>`);let u=t.assegna&&t.assegna!==""&&t.assegna!=="undefined"?t.assegna.split(",").map(p=>window._normNome(p.trim())).filter(Boolean):[],f;if(window._isUtenteEsente()){let p=u.length?u.map(window._normNome).join(", "):"Libero",m=window.listaOperatori.map(v=>{let E=u.some($=>$.toUpperCase()===window._normNome(v.nome).toUpperCase()),C=window._getOpColor(v.nome.trim()),_=v.nome.trim().replace(/'/g,"\\'");return`<button type="button" class="op-option${E?" is-selected":""}" onclick="selezionaOpAssegna(this,'${t.id_riga}','${e}','${_}')"><span class="op-opt-dot" style="background:${C}"></span><span>${window._normNome(v.nome)}</span>${E?'<i class="fas fa-check op-check-icon"></i>':""}</button>`}).join(""),h=window._normNome(b?.nome||"").toUpperCase().trim(),w=u.some(v=>v.toUpperCase()===h)?"":`<button class="btn-assegnami btn-assegnami-inline" onclick="autoAssegnami('${t.id_riga}','${e}',this)" title="Assegnami"><i class="fas fa-user-plus"></i></button>`;f=`<div class="op-assign-inline"><div class="op-dropdown" data-id-riga="${t.id_riga}" data-assegna="${(t.assegna||"").replace(/"/g,"&quot;")}" data-nord="${e}"><button type="button" class="op-trigger" onclick="toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${p}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${m}</div></div>${w}</div>`}else{let p=window._normNome(b?.nome||"").toUpperCase().trim(),m=u.map(v=>{let E=window._getOpColor(v),C=v.replace(/'/g,"\\'"),_=v.toUpperCase()===p?`<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${t.id_riga}','${e}','${C}')" title="Rimuovi assegnazione">&times;</button>`:"";return`<span class="badge-operatore" data-nome="${v}" style="background:${E};border-color:${E}">${v}${_}</span>`}).join(""),w=u.some(v=>v.toUpperCase()===p)?"":`<button class="btn-assegnami" onclick="autoAssegnami('${t.id_riga}','${e}',this)"><i class="fas fa-user-plus"></i> Assegnami</button>`;f=`<div class="visualizza-operatori" data-id-riga="${t.id_riga}" data-assegna="${(t.assegna||"").replace(/"/g,"&quot;")}" data-nord="${e}">${m||'<span class="operatore-libero">Libero</span>'}${w}</div>`}return`
    <div class="item-card ${i.card}${l}" data-id-riga="${t.id_riga}" data-codice="${s.toLowerCase().replace(/"/g,"")}">
        ${d}
        <div><span class="label-sm ${i.label}">Codice Prodotto</span><b class="${i.value}">${s}</b></div>
        ${(()=>{let p=fo(t.data_ordine),m=fo(t.data_consegna);if(!p&&!m)return"";let h=p?Ii(p):"\u2014",w=m?`<span style="${Fa(m)}">${Ii(m)}</span>`:"\u2014";return`<div class="card-date-row"><span class="label-sm ${i.label}" style="margin-bottom:1px">Date</span><span class="card-date-vals"><span class="card-date-item"><i class="fas fa-file-signature" style="color:#94a3b8;font-size:.7rem;margin-right:3px"></i><span class="card-date-lbl">Ord.</span> ${h}</span><span class="card-date-sep">\xB7</span><span class="card-date-item"><i class="fas fa-truck" style="color:#94a3b8;font-size:.7rem;margin-right:3px"></i><span class="card-date-lbl">Cons.</span> ${w}</span></span></div>`})()}
        <div class="qty-cell">
            <span class="label-sm ${i.label}">Quantit\xE0</span>
            <div class="qty-row">
                <b class="${i.value} qty-totale">${t.qty}</b>
                ${(()=>{let p=parseFloat(t.qty)||0,m=parseFloat(t.qty_evasa);if(!(!isNaN(m)&&String(t.qty_evasa||"").trim()!==""))return"";let w=Math.max(0,p-m),v=w===0?"#22c55e":w<p*.25?"#ea580c":"#475569";return`<span class="qty-rim-inline"><span class="qty-rim-lbl">Evasa</span><b class="qty-rimanente-val" style="color:#64748b">${m}</b><span class="qty-rim-lbl" style="margin-left:5px">Rim.</span><b class="qty-rimanente-val" style="color:${v}">${w}</b></span>`})()}
                <button class="btn-qty-evasa-toggle" title="Imposta quantit\xE0 evasa" onclick="toggleQtyEvasa(this, '${t.id_riga}', ${parseFloat(t.qty)||0})" aria-label="Quantit\xE0 parziale">
                    <i class="fas fa-flag-checkered"></i>
                </button>
                <span class="qty-evasa-block" id="qty-evasa-block-${t.id_riga}" style="display:none">
                    <input type="number" class="qty-evasa-input" id="qty-evasa-input-${t.id_riga}"
                        min="0" max="${parseFloat(t.qty)||9999}" step="1"
                        value="${parseFloat(t.qty_evasa)||""}"
                        placeholder="Evasa"
                        onchange="salvaQtyEvasa('${t.id_riga}', ${parseFloat(t.qty)||0}, this.value)"
                        oninput="aggiornaRimanente('${t.id_riga}', ${parseFloat(t.qty)||0}, this.value)"
                    />
                    <span class="qty-rimanente-wrap">
                        <span class="qty-rim-lbl">Rim.</span>
                        <b class="qty-rimanente" id="qty-rimanente-${t.id_riga}">${parseFloat(t.qty_evasa)>0?Math.max(0,parseFloat(t.qty)-parseFloat(t.qty_evasa)):"\u2014"}</b>
                    </span>
                </span>
            </div>
        </div>
        <div>
            <span class="label-sm ${i.label}">Stato</span>
            <div class="stato-dropdown" data-id-riga="${t.id_riga}">
                <button type="button" class="stato-trigger" onclick="toggleStatoDropdown(this)">
                    <span class="stato-dot" style="background:${a.colore}"></span>
                    <span class="stato-label-txt">${n}</span>
                    <i class="fas fa-chevron-down stato-chevron"></i>
                </button>
                <div class="stato-popup">
                    ${window.listaStati.map(p=>`<button type="button" class="stato-option${p.nome===n?" is-selected":""}" onclick="selezionaStato(this, '${t.id_riga}', '${p.colore}')"><span class="stato-opt-dot" style="background:${p.colore}"></span><span>${p.nome}</span>${p.nome===n?'<i class="fas fa-check stato-check-icon"></i>':""}</button>`).join("")}
                </div>
            </div>
        </div>
        <div>
            <span class="label-sm ${i.label}">Operatore/i Assegnati</span>
            ${f}
        </div>
        <div class="order-info-col">
            <button class="btn-chiedi-assegna ${i.btnPrimary}" onclick="apriModalAiuto('${t.id_riga}', '${s}', '${e}', '${(o||"").replace(/'/g,"\\'")}')">
                <i class="fa-regular fa-envelope"></i> Chiedi
            </button>
            ${window._isCommerciale()||window._isUtenteEsente()?`<button class="btn-sollecita" onclick="apriModalSollecito('${t.id_riga}','${e}','${(o||"").replace(/'/g,"\\'")}','${s.replace(/'/g,"\\'")}')"><i class="fa-solid fa-calendar-alt"></i> Scadenza</button>`:""}
        </div>
    </div>`}function id(t,e){let o=window.TW,i=t.codice&&t.codice!=="false"?t.codice:"Senza Codice",n=(t.stato||"COMPLETATO").toUpperCase(),a=t.assegna;return(!a||a==="false"||a==="")&&(a="Nessuno"),`
    <div class="item-card archivio-layout ${o.card}">
        <div>
            <span class="label-sm ${o.label}">Codice Prodotto</span>
            <b class="archivio-codice ${o.value}">${i}</b>
        </div>

        <div class="archivio-qty">
            <span class="label-sm ${o.label}">Quantit\xE0</span>
            <b class="archivio-qty-val ${o.value}">${t.qty}</b>
        </div>

        <div>
            <span class="label-sm ${o.label}">Ultimo Stato</span>
            <span class="archivio-stato ${o.value}">${n}</span>
        </div>

        <div>
            <span class="label-sm ${o.label}">Operatore</span>
            <span class="archivio-operatore ${o.value}">${y(a)}</span>
        </div>

        <div class="item-actions">
            <button class="btn-archive-action primary ${o.btnPrimary}" title="Reso Cliente" onclick="gestisciRipristino('${t.id_riga}', 'RIGA', 'RESO')">
                <i class="fa-solid fa-box"></i>
            </button>
            <button class="btn-archive-action warning ${o.btnWarning}" title="Errore Archiviazione" onclick="gestisciRipristino('${t.id_riga}', 'RIGA', 'ERRORE')">
                <i class="fa-solid fa-rotate"></i>
            </button>
        </div>
    </div>`}var Ai=W(()=>{mo();gt();vt()});function Mt(){let t=le(),e=(S.attiviProd||[]).filter(n=>t.includes((n.stato||"").toUpperCase().trim())).length,o=document.querySelector("#ov-accordion .ov-summary-meta");o&&(o.textContent=`${e} art. in lavorazione`);let i=document.getElementById("ov-content");if(i){if(i.querySelector(".ov-lazy-placeholder")){let n=document.getElementById("ov-accordion");if(!n||!n.open)return;i.innerHTML=de(S.attiviProd),requestAnimationFrame($t);return}i.innerHTML=de(S.attiviProd),requestAnimationFrame($t)}}function Ha(t){if(!t.parentElement.open){let o=document.getElementById("ov-content");o&&o.querySelector(".ov-lazy-placeholder")&&(o.innerHTML=de(S.attiviProd),requestAnimationFrame($t))}}function ja(t){let e=document.getElementById(t);if(!e)return;let o=e.querySelector(".sezione-archiviata"),i=S.datiArchLazy||S.ultimiDatiProduzione&&S.ultimiDatiProduzione.archivio;if(o&&i&&(S.datiArchLazy||!o.children.length)){let a=Jt(i,!0)||"<div class='empty-msg'>L'archivio \xE8 vuoto.</div>";o.innerHTML=a,window.aggiornaListaFiltrabili?.(),H.ARCHIVIO_ORDINI||(H.ARCHIVIO_ORDINI=a,ot.ARCHIVIO_ORDINI=Date.now(),Z("_html_ARCHIVIO_ORDINI",a)),S.datiArchLazy=null}e.open=!0,requestAnimationFrame(()=>{e.querySelector("summary")?.scrollIntoView({behavior:"smooth",block:"start"})})}function Ci(t){let e=(t||[]).filter(p=>!wt(p.stato)),o=["Riccardo","Fabio T.","Niccol\xF2","Alessio"],i=new Map;o.forEach(p=>i.set(p,[]));let n=new Map;o.forEach(p=>n.set(p,new Set));function a(p){let m=window._normNome(p);return o.find(h=>h===m||h.toUpperCase()===String(p).trim().toUpperCase())}e.forEach(p=>{if(!p.assegna||p.assegna===""||p.assegna==="undefined")return;let m=String(p.ordine||"").trim();m&&p.assegna.split(",").forEach(h=>{let w=h.trim();if(!w)return;let v=a(w);v&&!n.get(v).has(m)&&(n.get(v).add(m),i.get(v).push(p))})});let s={};(window.listaStati||[]).forEach(p=>{s[p.nome.toUpperCase()]=p.colore});function r(p){let m=String(p.cliente||"").trim().toUpperCase();if(!m||m==="DA DEFINIRE"){let w=String(p.riferimento||"").trim();return w||""}let h=p.cliente.trim().split(/\s+/).slice(0,2).join(" ");return h.length>14?h.substring(0,13)+"\u2026":h}let c=o.map(p=>{let m=i.get(p)||[],h=window._getOpColor(p),w=m.length===0?'<div class="ov-op-item ov-op-item-free"><span class="ov-op-item-cod" style="color:#475569">Libero</span></div>':m.map(v=>{let E=(v.stato||"IN ATTESA").toUpperCase().trim(),C=s[E]||"#94a3b8",_=String(v.ordine||"").trim(),$=r(v),k=_.length>10?_.substring(0,9)+"\u2026":_;return`<div class="ov-op-item">
                    <span class="ov-op-item-dot" style="background:${C}"></span>
                    <span class="ov-op-item-cod">${k}${$?' <em style="color:#7c8fa8;font-style:italic">'+$+"</em>":""}</span>
                </div>`}).join("");return`<div class="ov-op-row">
            <div class="ov-op-header">
                <span class="ov-op-badge" style="background:${h}">${p.charAt(0).toUpperCase()}</span>
                <span class="ov-op-nome">${p}</span>
                ${m.length>0?`<span class="ov-op-count" style="background:${h}33;color:${h}">${m.length}</span>`:'<span class="ov-op-free-badge">Libero</span>'}
            </div>
            <div class="ov-op-items">${w}</div>
        </div>`}).join(""),l=Math.max(...o.map(p=>(i.get(p)||[]).length),1),d=o.map(p=>{let m=(i.get(p)||[]).length,h=window._getOpColor(p),w=Math.round(m/l*100),v=m===0;return`<div class="ov-op-summary-row">
            <span class="ov-op-badge" style="background:${v?"#374151":h}">${p.charAt(0).toUpperCase()}</span>
            <div class="ov-op-summary-info">
                <div class="ov-op-summary-top">
                    <span class="ov-op-nome">${p}</span>
                    ${v?'<span class="ov-op-free-badge">Libero</span>':`<span class="ov-op-count" style="background:${h}33;color:${h}">${m} art.</span>`}
                </div>
                ${v?"":`<div class="ov-op-bar-track"><div class="ov-op-bar-fill" style="width:${w}%;background:${h}"></div></div>`}
            </div>
        </div>`}).join(""),u=`<details class="ov-stato-card" open style="grid-column:4;grid-row:1">
        <summary class="ov-stato-header" style="--ov-col:#242424" onclick="if(window.innerWidth>600){event.preventDefault();return false;}">
            <span class="ov-stato-dot" style="background:#242424"></span>
            <span class="ov-stato-nome">Operatori</span>
            <span class="ov-stato-tot" style="background:#24242422;color:#475569">${o.length} op.</span>
            <i class="fas fa-chevron-down ov-sub-chevron"></i>
        </summary>
        <div class="ov-stato-body ov-op-card-body">${c}</div>
    </details>`,f=`<details class="ov-stato-card" open style="grid-column:4;grid-row:2">
        <summary class="ov-stato-header" style="--ov-col:#f59e0b" onclick="if(window.innerWidth>600){event.preventDefault();return false;}">
            <span class="ov-stato-dot" style="background:#f59e0b"></span>
            <span class="ov-stato-nome">Carico operatori</span>
            <span class="ov-stato-tot" style="background:#f59e0b33;color:#f59e0b">${o.length} tot.</span>
            <i class="fas fa-chevron-down ov-sub-chevron"></i>
        </summary>
        <div class="ov-stato-body ov-op-card-body">${d}</div>
    </details>`;return u+f}function de(t){let e={};(window.listaStati||[]).forEach(n=>{e[n.nome.toUpperCase()]=n.colore});let o="#94a3b8";return`<div class="ov-board-wrapper">
        <div class="ov-stati-grid" id="ov-kanban-grid">${le().map(n=>{let a=t.filter(u=>(u.stato||"").toUpperCase().trim()===n.trim()),s=e[n]||o,r=a.length===0,c=S.ovStatiOrd.includes(n),l="",d="";if(c){let u=new Map,f=[];a.forEach(p=>{let m=String(p.ordine||"\u2014").trim();u.has(m)?u.get(m).push(p):(u.set(m,[p]),f.push({ordine:m,rows:u.get(m)}))}),f.sort((p,m)=>{let h=(p.rows[0].cliente||"").trim().toUpperCase(),w=!h||h==="DA DEFINIRE"?(p.rows[0].riferimento||p.ordine).toUpperCase():h,v=(m.rows[0].cliente||"").trim().toUpperCase(),E=!v||v==="DA DEFINIRE"?(m.rows[0].riferimento||m.ordine).toUpperCase():v;return w<E?-1:w>E?1:0}),l=f.map(({ordine:p,rows:m})=>{let h=m.map(R=>String(R.id_riga)).join(","),w=m[0];function v(R){let O=(R||"").trim().split(/\s+/).slice(0,2).join(" ");return O.length>18?O.substring(0,17)+"\u2026":O}let E=String(w.cliente||"").trim().toUpperCase(),C=!E||E==="DA DEFINIRE"?v(w.riferimento||"")||p:v(w.cliente),_=p.length>12?p.substring(0,12)+"\u2026":p,$=m.length,k=m.reduce((R,O)=>R+(parseInt(O.qty)||1),0);return`<div class="ov-stato-row ov-kanban-item"
                    data-id-riga="${w.id_riga}"
                    data-id-righe="${h}"
                    data-count="${$}"
                    data-codice="${p.replace(/"/g,"&quot;")}"
                    data-ordine="${m.map(R=>R.ordine||"").join(",")}"
                    data-stato-corrente="${n}"
                    title="Doppio clic \u2192 vai all'ordine nella lista">
                    <span class="ov-drag-handle"><i class="fas fa-grip-vertical"></i></span>
                    <span class="ov-row-main">
                        <span class="ov-row-label" title="${p}">${_} <em>${C}</em></span>
                        <span class="ov-row-sub">${$} art. \xB7 ${k} pz</span>
                    </span>
                </div>`}).join(""),d=f.length+" ord."}else{let u=new Map,f=[];a.forEach(p=>{let m=String(p.codice&&p.codice!=="false"?p.codice:p.riferimento||"\u2014").trim();u.has(m)?u.get(m).push(p):(u.set(m,[p]),f.push({codice:m,rows:u.get(m)}))}),f.sort((p,m)=>p.codice<m.codice?-1:p.codice>m.codice?1:0),l=f.map(({codice:p,rows:m})=>{let h=p.length>24?p.substring(0,24)+"\u2026":p,w=m.map(O=>String(O.id_riga)).join(",");function v(O){let q=(O||"").trim().split(/\s+/).slice(0,2).join(" ");return q.length>14?q.substring(0,13)+"\u2026":q}function E(O){let q=String(O.cliente||"").trim().toUpperCase();return!q||q==="DA DEFINIRE"?v(O.riferimento||"")||"":v(O.cliente)}let C=new Map,_=[];m.forEach(O=>{let q=E(O);C.has(q)?C.get(q).push(O):(C.set(q,[O]),_.push(q))});let k=_.map(O=>{let G=C.get(O).map(mt=>{let at=String(mt.ordine||"").trim();return at.length>12?at.substring(0,12)+"\u2026":at}).filter(Boolean).join(" / ");return!G&&!O?"":G+(O?" <em>"+O+"</em>":"")}).filter(Boolean).join(" \xB7 "),R=m.length>1?m.map(O=>(O.qty||1)+"pz").join("+"):(m[0].qty||1)+" pz";return`<div class="ov-stato-row ov-kanban-item"
                    data-id-riga="${m[0].id_riga}"
                    data-id-righe="${w}"
                    data-count="${m.length}"
                    data-codice="${p.replace(/"/g,"&quot;")}"
                    data-ordine="${m.map(O=>O.ordine||"").join(",")}"
                    data-stato-corrente="${n}"
                    title="Doppio clic \u2192 vai all'ordine nella lista">
                    <span class="ov-drag-handle"><i class="fas fa-grip-vertical"></i></span>
                    <span class="ov-row-main">
                        <span class="ov-row-label" title="${p}">${h}</span>
                        ${k?`<span class="ov-row-sub">${k}</span>`:""}
                    </span>
                    <span class="ov-badge-qty">${R}</span>
                </div>`}).join(""),d=a.length+" art."}return`<details class="ov-stato-card${r?" ov-stato-card-empty":""}" open>
            <summary class="ov-stato-header" style="--ov-col:${s}" onclick="if(window.innerWidth>600){event.preventDefault();return false;}">
                <span class="ov-stato-dot" style="background:${s}"></span>
                <span class="ov-stato-nome">${n}</span>
                <span class="ov-stato-tot" style="background:${s}22;color:${s}" data-stato-count="${n}">${d}</span>
                <i class="fas fa-chevron-down ov-sub-chevron"></i>
            </summary>
            <div class="ov-stato-body" data-stato-drop="${n}">${r?'<span class="ov-empty-lbl">\u2014 nessun articolo</span>':l}</div>
        </details>`}).join("")}</div>
        <div class="ov-operatori-panel">${Ci(t)}</div>
    </div>`}function Oi(t){if(!t)return;let e=[...document.querySelectorAll(".ordine-wrapper")].find(n=>n.dataset.ordine===t);if(!e)return;let o=e.querySelector(".riga-ordine"),i=e.querySelector(".dettagli-container");o&&!o.classList.contains("open")&&(o.classList.add("open"),i&&(i.style.display="block")),setTimeout(()=>{e.scrollIntoView({behavior:"smooth",block:"center"})},60),e.style.transition="box-shadow 0.2s ease",e.style.boxShadow="0 0 0 3px #f59e0b99, 0 4px 24px #f59e0b33",setTimeout(()=>{e.style.transition="box-shadow 0.7s ease",e.style.boxShadow=""},1800)}function $t(){let t=window.innerWidth<=600,e=document.getElementById("ov-kanban-grid");if(!e||e._dndInit)return;e._dndInit=!0,e.addEventListener("click",_=>{let $=_.target.closest(".ov-stato-header");!t&&$&&_.preventDefault()},!0);let o=null,i=null,n=null,a=null,s=null,r=null,c=380,l=10,d=0,u=0;function f(_,$){i&&(i.style.visibility="hidden");let k=document.elementFromPoint(_,$);if(i&&(i.style.visibility=""),!k)return null;let R=k.closest(".ov-stato-body");if(R)return R;let O=k.closest(".ov-stato-header, .ov-stato-card > summary");if(O){let q=O.closest(".ov-stato-card");if(q)return q.querySelector(".ov-stato-body")}return null}function p(_){_!==a&&(e.querySelectorAll(".ov-stato-body").forEach($=>$.classList.remove("ov-drop-over")),a=_,_&&_.dataset.statoDrop!==n&&_.classList.add("ov-drop-over"))}function m(){if(r&&r.pressTimer&&(clearTimeout(r.pressTimer),r.item&&r.item.classList.remove("ov-touch-hold-pending"),r=null),o&&s!=null)try{o.hasPointerCapture&&o.hasPointerCapture(s)&&o.releasePointerCapture(s)}catch{}i&&(io(i),i=null),o&&(o.classList.remove("ov-drag-active"),o.style.userSelect="",o=null),e.querySelectorAll(".ov-stato-body").forEach(_=>_.classList.remove("ov-drop-over")),n=null,a=null,s=null}let h=0,w=null;function v(_,$,k,R){o=_,n=_.dataset.statoCorrente,s=R;let O=eo(_,$,k,{opacity:.92,scale:"1.05",rotate:"-1.2deg",borderRadius:"8px",shadow:"0 10px 32px rgba(0,0,0,0.55)",background:"#1e2d3d",border:"1.5px solid #475569",transition:"transform 0.1s"});i=O.ghost,d=O.offX,u=O.offY,_.style.userSelect="none",o.classList.add("ov-drag-active");try{o.setPointerCapture?o.setPointerCapture(R):e.setPointerCapture&&e.setPointerCapture(R)}catch{}}e.addEventListener("pointerdown",_=>{if(_.pointerType==="mouse"&&_.button!==0)return;let $=_.target.closest(".ov-kanban-item");if(!$)return;let k=Date.now();if(w===$&&k-h<280){h=0,w=null;let R=($.dataset.ordine||"").split(",")[0].trim();R&&Oi(R);return}if(h=k,w=$,_.pointerType==="touch"){r&&r.pressTimer&&(clearTimeout(r.pressTimer),r.item&&r.item.classList.remove("ov-touch-hold-pending")),$.classList.add("ov-touch-hold-pending"),r={item:$,pointerId:_.pointerId,startX:_.clientX,startY:_.clientY,pressTimer:setTimeout(()=>{!r||r.pointerId!==_.pointerId||o||(r.item.classList.remove("ov-touch-hold-pending"),v($,r.startX,r.startY,_.pointerId),r=null)},c)};return}_.preventDefault(),v($,_.clientX,_.clientY,_.pointerId)});function E(_){if(r&&!o&&_.pointerId===r.pointerId){let $=Math.abs(_.clientX-r.startX),k=Math.abs(_.clientY-r.startY);($>l||k>l)&&(clearTimeout(r.pressTimer),r.item.classList.remove("ov-touch-hold-pending"),r=null)}!o||!i||(oo(i,_.clientX,_.clientY,d,u),p(f(_.clientX,_.clientY)))}e.addEventListener("pointermove",E),window.addEventListener("pointermove",E,{passive:!0});function C(_){if(r&&!o&&_.pointerId===r.pointerId){clearTimeout(r.pressTimer),r.item.classList.remove("ov-touch-hold-pending"),r=null;return}if(!o)return;let $=f(_.clientX,_.clientY),k=$?.dataset?.statoDrop,R=o,O=n;if(m(),!k||k===O||!$)return;let q=R.dataset.idRiga,G=(R.dataset.idRighe||q).split(",").map(I=>I.trim()).filter(Boolean),mt=(window.listaStati.find(I=>I.nome===k)||{}).colore||"#94a3b8";$.querySelectorAll(".ov-empty-lbl").forEach(I=>I.remove()),R.dataset.statoCorrente=k,$.appendChild(R);let at=$.closest(".ov-stato-card");at&&(at.open=!0),go(e),vo(e),R.style.transition="transform 0.18s, opacity 0.18s",R.style.transform="scale(1.04)",R.style.opacity="0.6",requestAnimationFrame(()=>{R.style.transform="",R.style.opacity="",setTimeout(()=>{R.style.transition=""},200)});let P={};G.forEach(I=>{let T=S.attiviProd?S.attiviProd.find(B=>String(B.id_riga)===I):null;P[I]=T?T.stato:O}),G.forEach(I=>{if(S.attiviProd){let T=S.attiviProd.find(B=>String(B.id_riga)===I);T&&(T.stato=k)}}),R.classList.add("optimistic-pending"),R.style.transition="opacity 0.3s",S.lastKanbanDragTs=Date.now(),(async()=>{let I=!1;for(let T of G)await window.aggiornaDato(null,T,"stato",k)||(I=!0);if(R.classList.remove("optimistic-pending"),R.style.opacity="",I){let T=e.querySelector(`.ov-stato-body[data-stato-drop="${O}"]`);T&&(R.dataset.statoCorrente=O,T.querySelectorAll(".ov-empty-lbl").forEach(B=>B.remove()),T.appendChild(R)),G.forEach(B=>{let Y=P[B]||O;if(S.attiviProd){let L=S.attiviProd.find(F=>String(F.id_riga)===B);L&&(L.stato=Y)}let st=(window.listaStati.find(L=>L.nome===Y)||{}).colore||"#94a3b8";pe(B,Y,st)}),go(e),vo(e),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[Kanban DnD] Rollback",{idRighe:G,newStato:k,oldStato:O})}else window._invalidateProduzioneCache()})(),G.forEach(I=>pe(I,k,mt)),g(`\u2714 Stato \u2192 ${k}`)}e.addEventListener("pointerup",C),window.addEventListener("pointerup",C,{passive:!0}),e.addEventListener("pointercancel",m),window.addEventListener("pointercancel",m,{passive:!0}),e.addEventListener("dragstart",_=>_.preventDefault())}function go(t){t.querySelectorAll(".ov-stato-body").forEach(e=>{let o=e.dataset.statoDrop,i=S.ovStatiOrd.includes(o),n=e.querySelectorAll(".ov-kanban-item"),a=0;i?a=n.length:n.forEach(c=>{a+=parseInt(c.dataset.count||"1",10)});let s=t.querySelector(`[data-stato-count="${o}"]`);s&&(s.textContent=a+(i?" ord.":" art."));let r=e.closest(".ov-stato-card");r&&r.classList.toggle("ov-stato-card-empty",a===0)})}function vo(t){t.querySelectorAll(".ov-stato-body").forEach(e=>{if(!(e.querySelectorAll(".ov-kanban-item").length>0)&&!e.querySelector(".ov-empty-lbl")){let i=document.createElement("span");i.className="ov-empty-lbl",i.textContent="\u2014 nessun articolo",e.appendChild(i)}})}function pe(t,e,o){let i=document.querySelector(`.stato-dropdown[data-id-riga="${t}"]`);if(!i)return;let n=i.querySelector(".stato-trigger");if(!n)return;let a=n.querySelector(".stato-dot"),s=n.querySelector(".stato-label-txt");a&&(a.style.background=o),s&&(s.textContent=e),i.querySelectorAll(".stato-option").forEach(r=>{let c=r.querySelector("span:not(.stato-opt-dot)")?.textContent.trim();r.classList.toggle("is-selected",c===e);let l=r.querySelector(".stato-check-icon");if(l&&l.remove(),c===e){let d=document.createElement("i");d.className="fas fa-check stato-check-icon",r.appendChild(d)}})}var Ga=W(()=>{mo();Ai();no();gt();Zt();xt()});function lt({resetFetchTime:t=!0,invalidatePersistent:e=!0}={}){delete H["PROGRAMMA PRODUZIONE DEL MESE"],t&&(ot["PROGRAMMA PRODUZIONE DEL MESE"]=0),U("_html_PROGRAMMA PRODUZIONE DEL MESE"),A.dashBundle=null,A.dashPromise=null,e&&(S.prodCacheInvalidateTimer&&clearTimeout(S.prodCacheInvalidateTimer),S.prodCacheInvalidateTimer=setTimeout(()=>{S.prodCacheInvalidateTimer=null,N.invalidate("PROGRAMMA_PRODUZIONE").catch(()=>{})},1200))}function ue(){let t=document.getElementById("contenitore-dati");t&&(H["PROGRAMMA PRODUZIONE DEL MESE"]=t.innerHTML,ot["PROGRAMMA PRODUZIONE DEL MESE"]=Date.now(),Z("_html_PROGRAMMA PRODUZIONE DEL MESE",t.innerHTML))}function Re(t,e,o){if(!o)return;let i=[S.ultimiDatiProduzione?.produzione,S.attiviProd];for(let n of i)if(n)for(let a of n)(e?String(a.id_riga)===String(e):String(a.ordine||a.nOrd||"").trim()===String(t).trim())&&(a.last_modified=o)}async function yo(t=null){let e=null;if(A.dashBundle)e=A.dashBundle,A.dashBundle=null,A.dashPromise=null;else if(A.dashPromise)e=await A.dashPromise,A.dashBundle=null,A.dashPromise=null;else{let o=await fetch(x,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!1}),...t?{signal:t}:{}});if(!o.ok)throw new Error(`HTTP ${o.status}`);e=await o.json()}if(!e)throw new Error("bundle vuoto");return{produzione:e.produzione||[],archivio:e.archivio||[],avatarColors:e.avatarColors||null,prodTotal:e.prodTotal||0}}function wo(t,e=null){if(window.paginaAttuale!=="PROGRAMMA PRODUZIONE DEL MESE")return;t.avatarColors&&Wa(t.avatarColors),S.ultimiDatiProduzione=t;let o=document.getElementById("contenitore-dati");if(!o)return;let i="PROGRAMMA PRODUZIONE DEL MESE",n=t.produzione||[],a=t.archivio||[],s=e!==null?e:!!o.querySelector(".ordine-wrapper"),r=n.filter(v=>String(v.archiviato||"").toUpperCase()!=="TRUE");S.attiviProd=r;let c=le(),l=r.filter(v=>c.includes((v.stato||"").toUpperCase().trim())).length,d=n.filter(v=>String(v.archiviato||"").toUpperCase()!=="TRUE"),u=Jt(d,!1);S.datiArchLazy=a;let f="",p=window.innerWidth<=600,m=p?'<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>':de(r),h=new Set;s&&o.querySelectorAll(".ordine-wrapper").forEach(v=>{v.querySelector(".riga-ordine.open")&&h.add(v.dataset.ordine)}),o.innerHTML=`
            <details class="ov-accordion" id="ov-accordion"${p?"":" open"}>
                <summary class="ov-accordion-summary" onclick="_ovLoadIfNeeded(this)">
                    <span class="ov-summary-label"><i class="fas fa-layer-group"></i> Stato Avanzamento</span>
                    <span class="ov-summary-meta">${l} art. in lavorazione</span>
                    <i class="fas fa-chevron-down ov-summary-chevron"></i>
                </summary>
                <div class="riepilogo-page" id="ov-content">
                    ${m}
                </div>
            </details>
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="_apriArchivio('archivio-prod-details')">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>
            <div class="sezione-attiva">
                <div id="prod-filter-bar"></div>
                ${u||"<div class='empty-msg'>Nessun ordine in produzione.</div>"}
            </div>

            <details id="archivio-prod-details" class="archivio-details">
                <summary class="separatore-archivio archivio-summary">
                    <span>\u{1F4E6} ARCHIVIO STORICO ORDINI</span>
                    <i class="fas fa-chevron-down archivio-chevron"></i>
                </summary>
                <div class="sezione-archiviata">
                    ${f||"<div class='empty-msg'>L'archivio \xE8 vuoto.</div>"}
                </div>
            </details>
        `,H[i]=o.innerHTML,ot[i]=Date.now(),Z("_html_"+i,o.innerHTML),N.set("PROGRAMMA_PRODUZIONE",t).catch(()=>{}),z(o),s&&h.size&&o.querySelectorAll(".ordine-wrapper").forEach(v=>{if(h.has(v.dataset.ordine)){let E=v.querySelector(".riga-ordine"),C=v.querySelector(".dettagli-container");E&&C&&(E.classList.add("open"),C.style.display="block")}}),window.aggiornaListaFiltrabili(),requestAnimationFrame($t),requestAnimationFrame(()=>{S.attiviProd&&S.attiviProd.forEach(v=>{if(parseFloat(v.qty_evasa)>0){let E=document.getElementById("qty-evasa-block-"+v.id_riga),C=E&&E.closest(".qty-cell")?.querySelector(".btn-qty-evasa-toggle");E&&(E.style.display="inline-flex"),C&&C.classList.add("active")}}),fe(),Mi()&&ge()}),So(),S.ordiniAutocompleteCache=n.filter(v=>String(v.archiviato||"").toUpperCase()!=="TRUE").map(v=>({ordine:v.ordine||"",cliente:v.cliente||"",riferimento:v.riferimento||""}));let w=new Set;S.ordiniAutocompleteCache=S.ordiniAutocompleteCache.filter(v=>w.has(v.ordine)?!1:(w.add(v.ordine),!0)),window._ordiniAutocompleteCache=S.ordiniAutocompleteCache}async function Va(t,e=!1,o=null,i=null){let n=document.getElementById("contenitore-dati");!e&&n&&(n.innerHTML="<div class='inline-msg' id='_prod-loader'>Caricamento Dashboard...</div>",z(n));let a=e?null:setTimeout(()=>{let r=document.getElementById("_prod-loader");r&&(r.innerHTML="<i class='fas fa-spinner fa-spin'></i> Connessione lenta, sto ancora caricando...")},3500),s=e?null:setTimeout(()=>{let r=document.getElementById("_prod-loader");r&&(r.innerHTML=`\u26A0\uFE0F Server occupato o rete instabile.<br>
            <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                style="margin-top:12px;padding:8px 20px;background:#242424;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`)},8e3);try{let r=await yo(i);if(a&&clearTimeout(a),s&&clearTimeout(s),window.paginaAttuale!==t||o!==null&&o!==window._latestNavRequest)return;wo(r,e)}catch(r){if(a&&clearTimeout(a),s&&clearTimeout(s),r.name==="AbortError")return;console.error("Errore Dashboard:",r),e?console.warn("Background refresh fallito, il polling riprover\xE0:",r.message):(n.innerHTML=`<div class='inline-error'>Errore nel caricamento dati.
                <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                    style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                    &#x21bb; Riprova</button></div>`,z(n))}}async function ke(){let t=document.getElementById("contenitore-dati");if(t){t.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento archivio...</div>";try{let e=null;if(A.dashBundle)e=A.dashBundle,A.dashBundle=null,A.dashPromise=null;else if(A.dashPromise)e=await A.dashPromise,A.dashBundle=null,A.dashPromise=null;else{let a=await fetch(x,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!0})});if(!a.ok)throw new Error(`HTTP ${a.status}`);e=await a.json()}if(!e)throw new Error("bundle vuoto");let o=e.archivio||[],n=Jt(o,!0)||"<div class='empty-msg'>L'archivio \xE8 vuoto.</div>";t.innerHTML=n,H.ARCHIVIO_ORDINI=n,ot.ARCHIVIO_ORDINI=Date.now(),Z("_html_ARCHIVIO_ORDINI",n),z(t),window.aggiornaListaFiltrabili()}catch(e){if(e.name==="AbortError")return;t.innerHTML=`<div class='inline-error'>Errore archivio.
            <button onclick="cambiaPagina('ARCHIVIO_ORDINI', null)"
               style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
               &#x21bb; Riprova</button></div>`,z(t)}}}function Ti(t,e){let o=String(t),i=String(e||"");Array.isArray(S.attiviProd)&&S.attiviProd.forEach(n=>{String(n.id_riga)===o&&(n.assegna=i)}),S.ultimiDatiProduzione&&Array.isArray(S.ultimiDatiProduzione.produzione)&&S.ultimiDatiProduzione.produzione.forEach(n=>{String(n.id_riga)===o&&(n.assegna=i)})}function Ri(t,e){let o=String(t||"").trim(),i=String(e||""),n=a=>{Array.isArray(a)&&a.forEach(s=>{String(s.ordine||"").trim()===o&&!wt(s.stato)&&(s.assegna=i)})};n(S.attiviProd),S.ultimiDatiProduzione&&Array.isArray(S.ultimiDatiProduzione.produzione)&&n(S.ultimiDatiProduzione.produzione)}async function nd(t,e,o){let i=document.querySelector(`.visualizza-operatori[data-id-riga="${t}"]`);if(!i)return;let n=window._normNome(o),s=(i.dataset.assegna||"").split(",").map(l=>window._normNome(l.trim())).filter(l=>l&&l.toUpperCase()!==n.toUpperCase()).join(",");if(Ti(t,s),i.dataset.assegna=s,!s)i.innerHTML='<span class="operatore-libero">Libero</span>';else{let l=window._normNome(b?.nome||"").toUpperCase().trim();i.innerHTML=s.split(",").map(d=>{let u=window._normNome(d.trim()),f=window._getOpColor(u),p=u.replace(/'/g,"\\'"),m=u.toUpperCase()===l?`<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${t}','${e}','${p}')" title="Rimuovi assegnazione">&times;</button>`:"";return`<span class="badge-operatore" data-nome="${y(u)}" style="background:${f};border-color:${f}">${y(u)}${m}</span>`}).join("")}let r=b&&b.nome?b.nome.toUpperCase().trim():"",c=`${x}?azione=assegnaOperatori&ordine=${encodeURIComponent(e)}&operatori=${encodeURIComponent(s)}&id_riga=${t}&mittente=${encodeURIComponent(r)}`;fetch(c).then(l=>l.json()).then(l=>{if(!l||l.status!=="ok"&&l.status!=="success")throw new Error("Assegnazione non salvata");Re(e,t,l.last_modified),lt(),_t()}).catch(l=>{console.error("Errore rimozione operatore",l),g("\u26A0\uFE0F Rimozione non salvata \u2013 riprova","error")})}function ad(t){let e=t.closest(".op-dropdown"),o=t.closest(".item-card"),i=t.closest(".riga-ordine"),n=e.classList.contains("open");document.querySelectorAll(".op-dropdown.open").forEach(a=>{a.classList.remove("open");let s=a.closest(".item-card");s&&s.classList.remove("op-aperto");let r=a.closest(".riga-ordine");r&&r.classList.remove("op-aperto-ord")}),n||(e.classList.add("open"),o&&o.classList.add("op-aperto"),i&&i.classList.add("op-aperto-ord"))}function sd(t){let e=t.closest(".stato-dropdown"),o=t.closest(".item-card"),i=t.closest(".riga-ordine"),n=e.classList.contains("open");document.querySelectorAll(".stato-dropdown.open").forEach(a=>{a.classList.remove("open");let s=a.closest(".item-card");s&&s.classList.remove("stato-aperto");let r=a.closest(".riga-ordine");r&&r.classList.remove("stato-aperto-ord")}),n||(e.classList.add("open"),o&&o.classList.add("stato-aperto"),i&&i.classList.add("stato-aperto-ord"))}function ki(){document.querySelectorAll(".ord-azioni-menu.open").forEach(t=>{t.classList.remove("open");let e=t.closest(".riga-ordine");e&&e.classList.remove("azioni-aperto-ord")})}function rd(t){let e=t.closest(".ord-azioni-menu"),o=t.closest(".riga-ordine"),i=e.classList.contains("open");ki(),i||(e.classList.add("open"),o&&o.classList.add("azioni-aperto-ord"))}function cd(t,e,o,i){let n=t.closest(".op-dropdown"),s=(n.dataset.assegna||"").split(",").map(p=>window._normNome(p.trim())).filter(Boolean),r=window._normNome(i),c=s.findIndex(p=>p.toUpperCase()===r.toUpperCase());c>=0?s.splice(c,1):s.push(r);let l=s.join(",");Ti(e,l),n.dataset.assegna=l;let d=s.length?s.map(window._normNome).join(", "):"Libero";n.querySelector(".op-trigger-label").textContent=d,t.classList.toggle("is-selected",c<0);let u=t.querySelector(".op-check-icon");c<0?u||(u=document.createElement("i"),u.className="fas fa-check op-check-icon",t.appendChild(u)):u&&u.remove();let f=(b?.nome||"").toUpperCase().trim();fetch(x,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:o,operatori:l,id_riga:e,mittente:f})}).then(p=>p.json()).then(p=>{if(!p||p.status!=="ok"&&p.status!=="success")throw new Error("Assegnazione non salvata");Re(o,e,p.last_modified),lt(),_t()}).catch(()=>g("\u26A0\uFE0F Assegnazione non salvata \u2013 riprova","error"))}function ld(t,e,o){let i=t.closest(".op-dropdown"),a=(i.dataset.assegnaOrd||"").split(",").map(p=>window._normNome(p.trim())).filter(Boolean),s=window._normNome(o),r=a.findIndex(p=>p.toUpperCase()===s.toUpperCase());r>=0?a.splice(r,1):a.push(s);let c=a.join(",");i.dataset.assegnaOrd=c;let l=a.length?a.map(window._normNome).join(", "):"Libero";i.querySelector(".op-trigger-label").textContent=l,t.classList.toggle("is-selected",r<0);let d=t.querySelector(".op-check-icon");r<0?d||(d=document.createElement("i"),d.className="fas fa-check op-check-icon",t.appendChild(d)):d&&d.remove();let u=i.closest(".ordine-wrapper");u&&(u.querySelectorAll(".op-dropdown[data-id-riga]").forEach(p=>{p.dataset.assegna=c;let m=a.length?a.map(window._normNome).join(", "):"Libero",h=p.querySelector(".op-trigger-label");h&&(h.textContent=m),p.querySelectorAll(".op-option").forEach(w=>{let v=w.querySelector("span:not(.op-opt-dot)")?.textContent.trim()||"",E=a.some(_=>window._normNome(_)===v);w.classList.toggle("is-selected",E);let C=w.querySelector(".op-check-icon");E&&!C?(C=document.createElement("i"),C.className="fas fa-check op-check-icon",w.appendChild(C)):!E&&C&&C.remove()})}),u.querySelectorAll(".visualizza-operatori[data-id-riga]").forEach(p=>{p.dataset.assegna=c})),Ri(e,c),_t();let f=(b?.nome||"").toUpperCase().trim();fetch(x,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:e,operatori:c,mittente:f})}).then(p=>p.json()).then(p=>{if(!p||p.status!=="ok"&&p.status!=="success")throw new Error("Assegnazione non salvata");Re(e,null,p.last_modified),lt(),_t()}).catch(()=>g("\u26A0\uFE0F Assegnazione non salvata \u2013 riprova","error"))}function dd(t,e,o){let i=window._normNome((b?.nome||"").trim());if(!i)return;let n=document.querySelector(`.visualizza-operatori[data-id-riga="${t}"]`);if(!n)return;let a=(n.dataset.assegna||"").split(",").map(l=>window._normNome(l.trim())).filter(Boolean);if(a.some(l=>l.toUpperCase()===i.toUpperCase()))return;a.push(i);let s=a.join(",");Ti(t,s),n.dataset.assegna=s;let r=i.toUpperCase();n.innerHTML=a.map(l=>{let d=window._getOpColor(l),u=l.replace(/'/g,"\\'"),f=l.toUpperCase()===r?`<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${t}','${e}','${u}')" title="Rimuovi assegnazione">&times;</button>`:"";return`<span class="badge-operatore" data-nome="${y(l)}" style="background:${d};border-color:${d}">${y(l)}${f}</span>`}).join(""),o&&o.parentNode&&o.remove();let c=i.toUpperCase().trim();fetch(x,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:e,operatori:s,id_riga:t,mittente:c})}).then(l=>l.json()).then(l=>{if(!l||l.status!=="ok"&&l.status!=="success")throw new Error("Assegnazione non salvata");Re(e,t,l.last_modified),lt(),_t()}).catch(()=>g("\u26A0\uFE0F Assegnazione non salvata \u2013 riprova","error"))}function pd(t){let e=window._normNome((b?.nome||"").trim());if(!e)return;let o=e.toUpperCase().trim(),i=document.querySelector(`.ordine-wrapper[data-ordine="${t}"]`);if(i){i.querySelectorAll(".visualizza-operatori[data-id-riga]").forEach(s=>{let r=[e];s.dataset.assegna=e;let c=e.toUpperCase();s.innerHTML=r.map(l=>{let d=window._getOpColor(l),u=s.dataset.idRiga,f=l.replace(/'/g,"\\'"),p=l.toUpperCase()===c?`<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${u}','${t}','${f}')" title="Rimuovi assegnazione">&times;</button>`:"";return`<span class="badge-operatore" data-nome="${y(l)}" style="background:${d};border-color:${d}">${y(l)}${p}</span>`}).join("")}),i.querySelectorAll(".op-dropdown[data-id-riga]").forEach(s=>{s.dataset.assegna=e;let r=s.querySelector(".op-trigger-label");r&&(r.textContent=e),s.querySelectorAll(".op-option").forEach(c=>{let l=c.querySelector("span:not(.op-opt-dot)")?.textContent.trim()||"",d=window._normNome(l).toUpperCase()===e.toUpperCase();c.classList.toggle("is-selected",d);let u=c.querySelector(".op-check-icon");d&&!u?(u=document.createElement("i"),u.className="fas fa-check op-check-icon",c.appendChild(u)):!d&&u&&u.remove()})});let n=i.querySelector(".op-dropdown-ord");if(n){n.dataset.assegnaOrd=e;let s=n.querySelector(".op-trigger-label");s&&(s.textContent=e)}let a=i.querySelector(".btn-assegnami-ord");a&&a.remove()}Ri(t,e),_t(),fetch(x,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:t,operatori:e,mittente:o})}).then(n=>n.json()).then(n=>{if(!n||n.status!=="ok"&&n.status!=="success")throw new Error("Assegnazione non salvata");Re(t,null,n.last_modified),lt(),_t()}).catch(()=>g("\u26A0\uFE0F Assegnazione non salvata \u2013 riprova","error"))}function ud(t,e,o){let i=t.querySelector("span:not(.stato-opt-dot)").textContent.trim(),n=t.closest(".stato-dropdown"),a=n.querySelector(".stato-trigger"),s=a.querySelector(".stato-label-txt"),r=a.querySelector(".stato-dot"),c={testo:s.textContent,colore:r?r.style.background:"",selectedBtn:n.querySelector(".stato-option.is-selected")},l=S.attiviProd?S.attiviProd.find(p=>String(p.id_riga)===String(e)):null,d=l?l.stato:null;r&&(r.style.background=o||"#94a3b8"),s.textContent=i,n.querySelectorAll(".stato-option").forEach(p=>{p.classList.remove("is-selected");let m=p.querySelector(".stato-check-icon");m&&m.remove()}),t.classList.add("is-selected");let u=document.createElement("i");u.className="fas fa-check stato-check-icon",t.appendChild(u),n.classList.remove("open");let f=n.closest(".item-card");f&&f.classList.remove("stato-aperto"),S.attiviProd&&l&&(l.stato=i),bo(n.closest(".ordine-wrapper")?.dataset.ordine||""),Mt(),ue(),f&&(f.classList.add("optimistic-pending"),f.style.transition="opacity 0.3s"),Li(null,e,"stato",i,!0).then(p=>{if(f&&(f.classList.remove("optimistic-pending"),f.style.opacity=""),p)lt();else{if(r&&(r.style.background=c.colore),s.textContent=c.testo,n.querySelectorAll(".stato-option").forEach(m=>{m.classList.remove("is-selected");let h=m.querySelector(".stato-check-icon");h&&h.remove()}),c.selectedBtn){c.selectedBtn.classList.add("is-selected");let m=document.createElement("i");m.className="fas fa-check stato-check-icon",c.selectedBtn.appendChild(m)}S.attiviProd&&l&&d!==null&&(l.stato=d),bo(n.closest(".ordine-wrapper")?.dataset.ordine||""),Mt(),ue(),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[selezionaStato] Rollback",{idRiga:e,nuovoStato:i,statoPrec:c.testo})}}).catch(p=>{f&&(f.classList.remove("optimistic-pending"),f.style.opacity=""),r&&(r.style.background=c.colore),s.textContent=c.testo,S.attiviProd&&l&&d!==null&&(l.stato=d),bo(n.closest(".ordine-wrapper")?.dataset.ordine||""),Mt(),ue(),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[selezionaStato] Errore + Rollback",p,{idRiga:e,nuovoStato:i})})}function bo(t){if(!t)return;let e=document.querySelector(`.stato-dropdown-ord[data-nord="${CSS.escape(t)}"]`);if(!e)return;let o=(S.attiviProd||[]).filter(c=>(c.ordine||"")===t);if(!o.length)return;let i=[...new Set(o.map(c=>(c.stato||"IN ATTESA").toUpperCase().trim()))],n=i.length===1?i[0]:`${i.length} Stati`,a=i.length===1?((window.listaStati||[]).find(c=>c.nome===i[0])||{colore:"#e2e8f0"}).colore:"#e2e8f0",s=e.querySelector(".stato-label-txt"),r=e.querySelector(".stato-dot");s&&(s.textContent=n),r&&(r.style.background=a)}function md(t,e,o,i){event.stopPropagation();let n=t.closest(".stato-dropdown-ord");if(!n)return;let a=n.querySelector(".stato-trigger"),s=a?a.querySelector(".stato-label-txt"):null,r=a?a.querySelector(".stato-dot"):null,c={testo:s?s.textContent:"",colore:r?r.style.background:""};s&&(s.textContent=o),r&&i&&(r.style.background=i),n.classList.remove("open");let l=n.closest(".riga-ordine");l&&l.classList.remove("stato-aperto-ord");let d=document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(e)}"]`);if(!d)return;let u=Array.from(d.querySelectorAll("[data-id-riga]")).map(p=>p.dataset.idRiga),f={};u.forEach(p=>{let m=S.attiviProd?S.attiviProd.find(h=>String(h.id_riga)===String(p)):null;f[p]=m?m.stato:null}),u.forEach(p=>{if(S.attiviProd){let m=S.attiviProd.find(h=>String(h.id_riga)===String(p));m&&(m.stato=o)}pe(p,o,i)}),Mt(),ue(),d.classList.add("optimistic-pending"),d.style.transition="opacity 0.3s",g(`\u2714 Ordine ${e} \u2192 ${o}`,"success"),gd(u,"stato",o).then(p=>{d.classList.remove("optimistic-pending"),d.style.opacity="",p?lt():(u.forEach(m=>{let h=f[m];if(h){if(S.attiviProd){let v=S.attiviProd.find(E=>String(E.id_riga)===String(m));v&&(v.stato=h)}let w=(window.listaStati.find(v=>v.nome===h)||{}).colore||"#e2e8f0";pe(m,h,w)}}),Mt(),ue(),s&&(s.textContent=c.testo),r&&(r.style.background=c.colore),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[selezionaStatoOrdine] Rollback \u2014 bulk save failed",{nOrdine:e,nuovoStato:o}))}).catch(p=>{d.classList.remove("optimistic-pending"),d.style.opacity="",s&&(s.textContent=c.testo),r&&(r.style.background=c.colore),u.forEach(m=>{let h=f[m];if(h&&S.attiviProd){let w=S.attiviProd.find(v=>String(v.id_riga)===String(m));w&&(w.stato=h)}if(h){let w=(window.listaStati.find(v=>v.nome===h)||{}).colore||"#e2e8f0";pe(m,h,w)}}),Mt(),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[selezionaStatoOrdine] Rollback",p,{nOrdine:e,nuovoStato:o})})}function fd(t){t.classList.toggle("open");let e=t.nextElementSibling;e.style.display=t.classList.contains("open")?"block":"none"}async function Li(t,e,o,i,n=!1){M.pauseFor(15e3),S.mutationInFlight++;let a=null;if(S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let s=S.ultimiDatiProduzione.produzione.find(r=>String(r.id_riga)===String(e));s&&s.last_modified&&(a=s.last_modified)}t&&(t.style.opacity="0.5");try{let s={azione:"aggiorna_produzione",id_riga:e,colonna:o,valore:i,mittente:b&&b.nome?b.nome.toUpperCase():""};a&&(s.clientTimestamp=a);let r=await fetch(x,{method:"POST",body:JSON.stringify(s)});t&&(t.style.opacity="1");let c=await r.json();if(c&&c.status==="auth_error")return window._gestisciAuthError_(c.message),!1;if(c&&c.status==="conflict"){t&&(t.style.opacity="1");let l=c.serverData||{};return Yi({altroUtente:c.lastModifiedBy||l.last_modified_by||"",tuaModifica:i,serverModifica:o==="stato"?l.stato||"":l[o]||"",onSceglioClient:async()=>{M.pauseFor(15e3);let d={azione:"aggiorna_produzione",id_riga:e,colonna:o,valore:i,mittente:b&&b.nome?b.nome.toUpperCase():"",force:"1"};try{let f=await(await fetch(x,{method:"POST",body:JSON.stringify(d)})).json();if(f&&f.status==="auth_error"){window._gestisciAuthError_(f.message);return}if(f&&f.last_modified){if(S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let p=S.ultimiDatiProduzione.produzione.find(m=>String(m.id_riga)===String(e));p&&(p.last_modified=f.last_modified,p[o]=i)}if(S.attiviProd){let p=S.attiviProd.find(m=>String(m.id_riga)===String(e));p&&(p.last_modified=f.last_modified,p[o]=i)}}g("\u2714 Modifica forzata salvata"),lt()}catch{g("\u26A0\uFE0F Errore durante il salvataggio forzato.","error")}},onSceglioServer:()=>{if(t&&(t.value=l[o]||l.stato||"",t.style.opacity="1"),S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let d=S.ultimiDatiProduzione.produzione.find(u=>String(u.id_riga)===String(e));d&&(l.stato&&(d.stato=l.stato),l.last_modified&&(d.last_modified=l.last_modified),l.last_modified_by&&(d.last_modified_by=l.last_modified_by))}if(S.attiviProd){let d=S.attiviProd.find(u=>String(u.id_riga)===String(e));d&&l.stato&&(d.stato=l.stato)}g("\u{1F504} Aggiornato con la versione del server")}}),!1}if(c&&c.status!=="success")return console.warn("Backend response:",c),n||g("\u26A0\uFE0F Cambio non salvato. Riprova.","warning"),!1;if(c.last_modified){if(S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let l=S.ultimiDatiProduzione.produzione.find(d=>String(d.id_riga)===String(e));l&&(l.last_modified=c.last_modified,l[o]=i,o==="stato"&&wt(i)&&(l.assegna=""))}if(ue(),S.attiviProd){let l=S.attiviProd.find(d=>String(d.id_riga)===String(e));l&&(l.last_modified=c.last_modified,l[o]=i,o==="stato"&&wt(i)&&(l.assegna=""))}}return n||g("\u2714 "+(o==="stato"?"Stato":"Modifica")+" salvato","success"),lt(),!0}catch(s){return console.error("aggiornaDato error:",s),t&&(t.style.opacity="1"),n||g("\u2717 Errore: cambio NON salvato. Riprova.","error"),!1}finally{S.mutationInFlight=Math.max(0,S.mutationInFlight-1),S.mutationLastDone=Date.now()}}async function gd(t,e,o){M.pauseFor(15e3),S.mutationInFlight++;try{let i={azione:"aggiorna_produzione",id_righe:t,colonna:e,valore:o,mittente:b&&b.nome?b.nome.toUpperCase():""},a=await(await fetch(x,{method:"POST",body:JSON.stringify(i)})).json();return a&&a.status==="auth_error"?(window._gestisciAuthError_(a.message),!1):a&&a.status!=="success"?(console.warn("[_aggiornaDatoBulk] Backend response:",a),!1):(a.last_modified&&t.forEach(s=>{if(S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let r=S.ultimiDatiProduzione.produzione.find(c=>String(c.id_riga)===String(s));r&&(r.last_modified=a.last_modified,r[e]=o,e==="stato"&&wt(o)&&(r.assegna=""))}if(S.attiviProd){let r=S.attiviProd.find(c=>String(c.id_riga)===String(s));r&&(r.last_modified=a.last_modified,r[e]=o,e==="stato"&&wt(o)&&(r.assegna=""))}}),lt(),!0)}catch(i){return console.error("[_aggiornaDatoBulk] error:",i),!1}finally{S.mutationInFlight=Math.max(0,S.mutationInFlight-1),S.mutationLastDone=Date.now()}}async function vd(t,e){rt("Archivia Ordine",`Vuoi spostare l'ordine ${t} nell'archivio?`,()=>{let o=document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(t)}"]`),i=o?o.outerHTML:null,n=o?o.parentElement:null,a=o?o.nextSibling:null;o&&(o.style.transition="opacity 0.15s, transform 0.15s",o.style.opacity="0",o.style.transform="scale(0.97)",setTimeout(()=>o.remove(),150)),S.attiviProd&&(S.attiviProd=S.attiviProd.filter(c=>String(c.ordine||"").trim()!==String(t).trim()));let s=document.querySelector(`.ov-kanban-item[data-codice="${CSS.escape(t)}"], .ov-kanban-item[data-ordine*="${t}"]`);s&&s.remove();let r=async()=>{let l=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"archiviaOrdine",ordine:t})})).text(),d;try{d=JSON.parse(l)}catch{throw new Error("Risposta non valida dal server.")}return d};(async()=>{try{let c;try{c=await r()}catch{await new Promise(l=>setTimeout(l,2e3)),c=await r()}if(c.status==="success")delete H.ARCHIVIO_ORDINI,U("_html_ARCHIVIO_ORDINI"),lt(),g("\u2714 Ordine "+t+" archiviato","success");else{if(i&&n){n.insertBefore(Object.assign(document.createElement("div"),{outerHTML:i}),a);let d=n.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(t)}"]`);d&&(d.style.opacity="1",d.style.transform="")}let l=(c.message||c.error||"Errore sconosciuto").toString();g("\u2717 "+l+" \u2013 ordine ripristinato","error")}}catch(c){if(i&&n){let l=document.createElement("template");l.innerHTML=i;let d=l.content.firstChild;n.insertBefore(d,a);let u=n.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(t)}"]`);u&&(u.style.opacity="1",u.style.transform="")}g("\u2717 "+(c.message||"Errore di rete")+" \u2013 ordine ripristinato","error")}})()},"Archivia")}function hd(t,e,o){let i=document.getElementById("qty-evasa-block-"+e);if(!i)return;let n=i.style.display!=="none";if(i.style.display=n?"none":"inline-flex",t.classList.toggle("active",!n),!n){let a=document.getElementById("qty-evasa-input-"+e);a&&(a.focus(),a.select())}}function Ja(t,e,o){let i=document.getElementById("qty-rimanente-"+t);if(!i)return;let n=parseFloat(o);!isNaN(n)&&n>=0?(i.textContent=Math.max(0,e-n),i.style.color=e-n<=0?"#22c55e":""):(i.textContent="\u2014",i.style.color="")}async function bd(t,e,o){let i=parseFloat(o);if(!(isNaN(i)||i<0)){if(Ja(t,e,i),S.attiviProd){let n=S.attiviProd.find(a=>String(a.id_riga)===String(t));n&&(n.qty_evasa=String(i))}await Li(null,t,"qty_evasa",i)}}async function yd(t,e){let o=e==="ORDINE"?`Riportare l'intero ordine ${t} in PRODUZIONE?`:"Riportare questo articolo in PRODUZIONE?";rt("Ripristina",o,async()=>{try{let n=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"ripristinaOrdine",ordine:t,tipo:e})})).json();n.status==="success"?(delete H.ARCHIVIO_ORDINI,U("_html_ARCHIVIO_ORDINI"),lt(),Va(window.paginaAttuale)):g("Errore: "+n.message,"error")}catch{g("Errore durante il ripristino.","error")}},"Ripristina")}function So(){me(),S.pollProdTimer=setInterval(Pi,S.POLL_PROD_MS)}function me(){S.pollProdTimer&&(clearInterval(S.pollProdTimer),S.pollProdTimer=null)}async function Pi(){if(window.paginaAttuale!=="PROGRAMMA PRODUZIONE DEL MESE"){me();return}if(document.visibilityState!=="hidden"&&!document.querySelector(".stato-dropdown.open, .op-dropdown.open")&&!(Date.now()-S.lastKanbanDragTs<5e3)&&!(S.mutationInFlight>0)&&!(Date.now()-S.mutationLastDone<12e3)&&!$i){$i=!0;try{let t=await fetch(x,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!1})});if(!t.ok)return;let e=await t.json();if(!e||!e.produzione)return;e.avatarColors&&Wa(e.avatarColors);let o=(e.produzione||[]).filter(i=>String(i.archiviato||"").toUpperCase()!=="TRUE");wd(o,e.produzione,e.archivio||[])}catch{}finally{$i=!1}}}function Wa(t){if(!t||typeof t!="object")return;let e=!1;if(Object.entries(t).forEach(([o,i])=>{if(!i)return;let n=o.toUpperCase().trim();if(window._avatarColorsCache[n]!==i){window._avatarColorsCache[n]=i;try{localStorage.setItem("avatarColor_"+n,i)}catch{}e=!0}}),!!e){if(b?.nome){let o=t[b.nome.toUpperCase().trim()];o&&window._applyAvatarColorUI&&window._applyAvatarColorUI(o)}_t()}}function _t(){let t=document.getElementById("contenitore-dati");if(t){if(t.querySelectorAll(".badge-operatore[data-nome]").forEach(e=>{let o=window._getOpColor(e.dataset.nome);e.style.background=o,e.style.borderColor=o}),S.attiviProd&&S.attiviProd.length){let e=Ci(S.attiviProd),o=t.querySelectorAll(".ov-stato-card"),i=Array.from(o).filter(n=>/grid-column.*4/.test(n.getAttribute("style")||""));if(i.length>=2){let n=document.createElement("div");n.innerHTML=e,n.querySelectorAll(".ov-stato-card").forEach((s,r)=>{i[r]&&i[r].replaceWith(s)})}}t.querySelectorAll(".op-opt-dot").forEach(e=>{let o=e.closest(".op-option");if(!o)return;let i=o.querySelectorAll("span"),n=i[1]?.textContent?.trim()||i[0]?.textContent?.trim();n&&(e.style.background=window._getOpColor(n))})}}function wd(t,e,o){if(!S.attiviProd)return;let i=new Set(S.attiviProd.map(c=>String(c.id_riga))),n=new Set(t.map(c=>String(c.id_riga))),a=i.size!==n.size;if(!a){for(let c of i)if(!n.has(c)){a=!0;break}}if(!a){for(let c of n)if(!i.has(c)){a=!0;break}}if(a){Sd(e,o);return}let s=document.getElementById("contenitore-dati");if(!s)return;let r=!1;t.forEach(c=>{let l=String(c.id_riga),d=S.attiviProd.find(w=>String(w.id_riga)===l);if(!d||s.querySelector(`.item-card.optimistic-pending[data-id-riga="${l}"], .ordine-wrapper.optimistic-pending`))return;let f=(c.stato||"IN ATTESA").toUpperCase().trim(),p=(d.stato||"IN ATTESA").toUpperCase().trim();if(f!==p){r=!0;let w=s.querySelector(`.stato-dropdown[data-id-riga="${l}"]`);if(w){let v=(window.listaStati||[]).find(_=>_.nome===f)||{colore:"#e2e8f0"},E=w.querySelector(".stato-dot"),C=w.querySelector(".stato-label-txt");E&&(E.style.background=v.colore),C&&(C.textContent=f),w.querySelectorAll(".stato-option").forEach(_=>{let k=_.querySelector("span:not(.stato-opt-dot)")?.textContent?.trim()===f;if(_.classList.toggle("is-selected",k),_.querySelector(".stato-check-icon")?.remove(),k){let R=document.createElement("i");R.className="fas fa-check stato-check-icon",_.appendChild(R)}})}d.stato=f,Za(l,f),bo(c.ordine||"")}let m=String(c.assegna||"").trim(),h=String(d.assegna||"").trim();if(m!==h){r=!0,d.assegna=m;let w=s.querySelector(`.visualizza-operatori[data-id-riga="${l}"]`);w&&(w.dataset.assegna=m);let v=s.querySelector(`.op-dropdown[data-id-riga="${l}"]`);if(v){v.dataset.assegna=m;let E=m.split(",").map(_=>window._normNome(_.trim())).filter(Boolean),C=v.querySelector(".op-trigger-label");C&&(C.textContent=E.length?E.join(", "):"Libero")}}}),r&&(S.attiviProd=t,delete H["PROGRAMMA PRODUZIONE DEL MESE"],ot["PROGRAMMA PRODUZIONE DEL MESE"]=Date.now(),_t())}function Sd(t,e){ho&&clearTimeout(ho),ho=setTimeout(()=>{ho=null,_d(t,e)},400)}function _d(t,e){let o=document.getElementById("contenitore-dati");if(!o)return;let i=new Set;o.querySelectorAll(".ordine-wrapper").forEach(d=>{d.querySelector(".riga-ordine.open")&&i.add(d.dataset.ordine)});let n=(t||[]).filter(d=>String(d.archiviato||"").toUpperCase()!=="TRUE");S.attiviProd=n;let a=Jt(t,!1),s=Jt(e,!0),r=window.innerWidth<=600,c=r?'<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>':de(n),l=n.filter(d=>le().includes((d.stato||"").toUpperCase().trim())).length;o.innerHTML=`
        <details class="ov-accordion" id="ov-accordion"${r?"":" open"}>
            <summary class="ov-accordion-summary" onclick="_ovLoadIfNeeded(this)">
                <span class="ov-summary-label"><i class="fas fa-layer-group"></i> Stato Avanzamento</span>
                <span class="ov-summary-meta">${l} art. in lavorazione</span>
                <i class="fas fa-chevron-down ov-summary-chevron"></i>
            </summary>
            <div class="riepilogo-page" id="ov-content">${c}</div>
        </details>
        <div class="scroll-wrapper">
            <button class="scroll-btn" onclick="_apriArchivio('archivio-prod-details')">
                <i class="fa-solid fa-box-archive"></i> Archivio
            </button>
        </div>
        <div class="sezione-attiva">
            ${a||"<div class='empty-msg'>Nessun ordine in produzione.</div>"}
        </div>
        <details id="archivio-prod-details" class="archivio-details">
            <summary class="separatore-archivio archivio-summary">
                <span>\u{1F4E6} ARCHIVIO STORICO ORDINI</span>
                <i class="fas fa-chevron-down archivio-chevron"></i>
            </summary>
            <div class="sezione-archiviata">
                ${s||"<div class='empty-msg'>L'archivio \xE8 vuoto.</div>"}
            </div>
        </details>`,i.size&&o.querySelectorAll(".ordine-wrapper").forEach(d=>{if(i.has(d.dataset.ordine)){let u=d.querySelector(".riga-ordine"),f=d.querySelector(".dettagli-container");u&&f&&(u.classList.add("open"),f.style.display="block")}}),H["PROGRAMMA PRODUZIONE DEL MESE"]=o.innerHTML,ot["PROGRAMMA PRODUZIONE DEL MESE"]=Date.now(),window.aggiornaListaFiltrabili(),requestAnimationFrame($t)}function Za(t,e){let o=document.getElementById("ov-kanban-grid");if(!o)return;let i=(e||"").toUpperCase().trim(),n=o.querySelector(`.ov-kanban-item[data-id-riga="${t}"]`);if(n||o.querySelectorAll(".ov-kanban-item").forEach(r=>{(r.dataset.idRighe||"").split(",").map(c=>c.trim()).includes(String(t))&&(n=r)}),!n||(n.dataset.statoCorrente||"").toUpperCase().trim()===i)return;let a=o.querySelector(`.ov-stato-body[data-stato-drop="${i}"]`);if(!a)return;a.querySelectorAll(".ov-empty-lbl").forEach(r=>r.remove()),n.dataset.statoCorrente=i,n.style.transition="opacity 0.18s, transform 0.18s",n.style.opacity="0",n.style.transform="scale(0.92)",a.appendChild(n);let s=a.closest(".ov-stato-card");s&&(s.open=!0),go(o),vo(o),requestAnimationFrame(()=>{n.style.opacity="1",n.style.transform="",setTimeout(()=>{n.style.transition=""},200)})}function Ed(){window.filtroRicercaArticoli=!window.filtroRicercaArticoli,document.querySelectorAll(".btn-filtro-articoli").forEach(n=>{n.classList.toggle("active",window.filtroRicercaArticoli)});let t=window.filtroRicercaArticoli?"Cerca codice articolo...":"Cerca in tutte le pagine...",e=window.filtroRicercaArticoli?"Cerca articolo":"Cerca",o=document.getElementById("universal-search"),i=document.getElementById("mobile-search");o&&(o.placeholder=t),i&&(i.placeholder=e),document.querySelectorAll(".item-card.hidden-search").forEach(n=>n.classList.remove("hidden-search")),window.filtraUniversale()}function zi(t){let e=t==="PROGRAMMA PRODUZIONE DEL MESE";if(document.querySelectorAll(".btn-filtro-articoli").forEach(o=>{o.style.display=e?"flex":"none"}),!e&&window.filtroRicercaArticoli){window.filtroRicercaArticoli=!1,document.querySelectorAll(".btn-filtro-articoli").forEach(n=>n.classList.remove("active"));let o=document.getElementById("universal-search"),i=document.getElementById("mobile-search");o&&(o.placeholder="Cerca in tutte le pagine..."),i&&(i.placeholder="Cerca"),document.querySelectorAll(".item-card.hidden-search").forEach(n=>n.classList.remove("hidden-search"))}}function _o(){try{localStorage.setItem(Qa,JSON.stringify(D))}catch{}}function Mi(){return D.stati.length>0||D.sortBy!=="default"||D.soloRimanente}function fe(){let t=document.getElementById("prod-filter-bar");if(!t)return;let e=window.listaStati||[],o=Mi(),i=D.stati.length+(D.sortBy!=="default"?1:0)+(D.soloRimanente?1:0),n=[{key:"default",label:"Predefinito"},{key:"cliente_az",label:"Cliente A \u2192 Z"},{key:"consegna_asc",label:"Consegna urgente prima"},{key:"ordine_az",label:"N. Ordine A \u2192 Z"},{key:"ordine_za",label:"N. Ordine Z \u2192 A"},{key:"ordine_ts_asc",label:"Data ordine (pi\xF9 vecchi prima)"}],a=document.getElementById("pf-panel")&&document.getElementById("pf-panel").style.display!=="none";t.innerHTML=`
    <div class="pf-wrap">
      <button type="button" class="pf-trigger-btn${o?" pf-trigger-active":""}" id="pf-trigger-btn" onclick="event.stopPropagation();_pfTogglePanel()">
        <i class="fas fa-sliders-h" style="font-size:.75rem"></i>
        <span>Filtra / Ordina</span>
        ${o?`<span class="pf-active-badge">${i}</span>`:""}
        <i class="fas fa-chevron-down pf-caret" id="pf-caret"></i>
      </button>
      ${o?'<button type="button" class="pf-reset-btn" onclick="event.stopPropagation();_pfReset()" title="Rimuovi tutti i filtri"><i class="fas fa-times"></i></button>':""}
      <div class="pf-panel" id="pf-panel" style="display:${a?"block":"none"}">
        <div class="pf-panel-section">
          <div class="pf-panel-title">Ordina per</div>
          ${n.map(s=>{let r=D.sortBy===s.key;return`<label class="pf-row" onclick="event.stopPropagation();_pfSetSort('${s.key}')">
            <span class="pf-radio${r?" pf-radio-on":""}"></span>
            <span class="pf-row-lbl">${s.label}</span>
          </label>`}).join("")}
        </div>
        <div class="pf-panel-sep"></div>
        <div class="pf-panel-section">
          <div class="pf-panel-title">Filtra per stato</div>
          ${e.map(s=>{let r=D.stati.includes(s.nome);return`<label class="pf-row" onclick="event.stopPropagation();_pfToggleStato('${s.nome.replace(/'/g,"\\'")}')">
            <span class="pf-check${r?" pf-check-on":""}"><i class="fas fa-check" style="font-size:.55rem;color:#fff;opacity:${r?1:0}"></i></span>
            <span class="pf-stato-dot" style="background:${s.colore}"></span>
            <span class="pf-row-lbl">${s.nome}</span>
          </label>`}).join("")}
        </div>
        <div class="pf-panel-sep"></div>
        <div class="pf-panel-section">
          <label class="pf-row" onclick="event.stopPropagation();_pfToggleRimanente()">
            <span class="pf-check${D.soloRimanente?" pf-check-on":""}"><i class="fas fa-check" style="font-size:.55rem;color:#fff;opacity:${D.soloRimanente?1:0}"></i></span>
            <span class="pf-row-lbl">Solo con rimanente &gt; 0</span>
          </label>
        </div>
      </div>
    </div>`}function xd(){let t=document.getElementById("pf-panel"),e=document.getElementById("pf-caret");if(!t)return;let o=t.style.display!=="none";t.style.display=o?"none":"block",e&&(e.style.transform=o?"":"rotate(180deg)")}function ge(){let t=document.querySelector(".sezione-attiva");if(!t)return;let e=[...t.querySelectorAll(".ordine-wrapper")];if(!e.length)return;let o=D.stati,i=D.sortBy,n=D.soloRimanente;if(e.forEach(a=>{let s=!0;if(o.length>0){let r=(a.dataset.stati||"").split(",").map(c=>c.trim().toUpperCase());s=o.some(c=>r.includes(c.toUpperCase()))}s&&n&&(s=a.dataset.haRimanente==="1"),a.style.display=s?"":"none"}),i!=="default"){let a=e.filter(r=>r.style.display!=="none");a.sort((r,c)=>{if(i==="cliente_az"){let l=(r.dataset.cliente||"").toLowerCase(),d=(c.dataset.cliente||"").toLowerCase();return l<d?-1:l>d?1:0}if(i==="consegna_asc"){let l=parseInt(r.dataset.consegnaMin)||0,d=parseInt(c.dataset.consegnaMin)||0;return!l&&!d?0:l?d?l-d:-1:1}if(i==="ordine_az"){let l=(r.dataset.ordine||"").toUpperCase(),d=(c.dataset.ordine||"").toUpperCase();return l<d?-1:l>d?1:0}if(i==="ordine_za"){let l=(r.dataset.ordine||"").toUpperCase(),d=(c.dataset.ordine||"").toUpperCase();return l>d?-1:l<d?1:0}if(i==="ordine_ts_asc"){let l=parseInt(r.dataset.ordineTs)||0,d=parseInt(c.dataset.ordineTs)||0;return!l&&!d?0:l?d?l-d:-1:1}return 0});let s=document.getElementById("prod-filter-bar");a.forEach(r=>t.appendChild(r)),s&&t.insertBefore(s,t.firstChild)}}function Id(t){let e=D.stati.indexOf(t);e>=0?D.stati.splice(e,1):D.stati.push(t),_o(),fe(),ge()}function Ad(t){D.sortBy=D.sortBy===t&&t!=="default"?"default":t,_o(),fe(),ge()}function Cd(){D.soloRimanente=!D.soloRimanente,_o(),fe(),ge()}function Od(){D.stati=[],D.sortBy="default",D.soloRimanente=!1,_o(),fe(),ge()}async function $d(t,e){e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i>');try{let i=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"csvReviewResolve",id_riga:t,mittente:b&&b.nome?b.nome.toUpperCase():""})})).json();if(i&&i.status==="auth_error"){window._gestisciAuthError_(i.message);return}if(i&&i.status==="ok"){let n=e?e.closest(".item-card"):null;if(n){n.classList.remove("csv-review-blink","csv-review-missing","csv-review-finish");let a=n.querySelector(".csv-review-banner");a&&a.remove()}if(S.attiviProd){let a=S.attiviProd.find(s=>String(s.id_riga)===String(t));a&&(a.last_modified_by=b&&b.nome?b.nome.toUpperCase():"")}if(n){let a=n.closest(".ordine-wrapper");a&&!a.querySelector(".csv-review-blink")&&a.classList.remove("csv-review-order")}lt(),g("\u2713 Riga risolta","success")}else g("\u26A0\uFE0F Errore risoluzione \u2014 riprova","error"),e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-check"></i> Risolvi')}catch(o){console.error("[csvReviewResolve]",o),g("\u26A0\uFE0F Errore rete \u2014 riprova","error"),e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-check"></i> Risolvi')}}function Td(t){let e=document.getElementById("_info-ord-panel");if(e&&(e.remove(),e.dataset.nord===t))return;let o=(S.attiviProd||[]).filter(s=>(s.ordine||"")===t);if(!o.length)return;let i=o[0].cliente||"N.D.",n=o.map(s=>{let r=s.codice&&s.codice!=="false"?s.codice:"Senza Codice",c=s.qty||"\u2014",l=s.qty_evasa!==void 0&&s.qty_evasa!==""?s.qty_evasa:"\u2014",d=s.qty_evasa!==void 0&&s.qty_evasa!==""&&s.qty?String(Math.max(0,parseFloat(s.qty||0)-parseFloat(s.qty_evasa||0))):"\u2014",u=s.data_ordine||"\u2014",f=s.data_consegna||"\u2014";return`<tr><td class="iop-td">${r}</td><td class="iop-td iop-num">${c}</td><td class="iop-td iop-num">${l}</td><td class="iop-td iop-num">${d}</td><td class="iop-td">${u}</td><td class="iop-td">${f}</td></tr>`}).join(""),a=document.createElement("div");a.id="_info-ord-panel",a.dataset.nord=t,a.className="iop-overlay",a.innerHTML=`
      <div class="iop-box" onclick="event.stopPropagation()">
        <div class="iop-header">
          <span class="iop-title"><i class="fas fa-circle-info" style="margin-right:6px;color:#6366f1"></i>${y(i)} \u2014 ORD.${t}</span>
          <button class="iop-close" onclick="document.getElementById('_info-ord-panel').remove()"><i class="fas fa-times"></i></button>
        </div>
        <div class="iop-table-wrap">
          <table class="iop-table">
            <thead><tr>
              <th class="iop-th">Codice</th>
              <th class="iop-th iop-num">Qty</th>
              <th class="iop-th iop-num">Evasa</th>
              <th class="iop-th iop-num">Rim.</th>
              <th class="iop-th">Data ordine</th>
              <th class="iop-th">Data consegna</th>
            </tr></thead>
            <tbody>${n}</tbody>
          </table>
        </div>
        <p class="iop-hint">Date e qty evasa vengono aggiornate al caricamento del CSV Yello.</p>
      </div>`,a.addEventListener("click",()=>a.remove()),document.body.appendChild(a)}function Ka(){window.toggleAccordion=fd,window.toggleStatoDropdown=sd,window.selezionaStato=ud,window.selezionaStatoOrdine=md,window.toggleOpDropdown=ad,window.selezionaOpAssegna=cd,window.selezionaOpAssegnaOrdine=ld,window.autoAssegnami=dd,window.autoAssegnamiOrdine=pd,window.rimuoviOperatore=nd,window.gestisciArchiviazione=vd,window.gestisciRipristino=yd,window.toggleQtyEvasa=hd,window.aggiornaRimanente=Ja,window.salvaQtyEvasa=bd,window.chiudiTuttiMenuAzioni=ki,window.toggleMenuAzioni=rd,window.aggiornaDato=Li,window.toggleFiltroArticoli=Ed,window._aggiornaVisibilitaFiltroArticoli=zi,window._renderProdFilterBar=fe,window._applicaFiltriProd=ge,window._pfToggleStato=Id,window._pfSetSort=Ad,window._pfToggleRimanente=Cd,window._pfReset=Od,window._pfTogglePanel=xd,window.apriInfoOrdine=Td,window._pfHasActiveFilters=Mi,window._getAttiviProd=()=>S.attiviProd,window._ovLoadIfNeeded=Ha,window._apriArchivio=ja,window._scrollToOrdineList=Oi,window._initKanbanDnd=$t,window._startPollingProduzione=So,window._stopPollingProduzione=me,window._pollProdStep=Pi,window._repaintOpColors=_t,window.caricaDati=Va,window.caricaArchivio=ke,window._syncKanbanFromStato=Za,window._setAssegnaLocalByOrdine=Ri,window._refreshOverview=Mt,window._invalidateProduzioneCache=lt,window.csvReviewResolve=$d}function Ya(){document.addEventListener("click",function(t){t.target.closest(".ord-azioni-menu")||ki()}),document.addEventListener("click",function(t){t.target.closest(".op-dropdown")||document.querySelectorAll(".op-dropdown.open").forEach(e=>{e.classList.remove("open");let o=e.closest(".item-card");o&&o.classList.remove("op-aperto");let i=e.closest(".riga-ordine");i&&i.classList.remove("op-aperto-ord")})},!0),document.addEventListener("click",function(t){!t.target.closest(".stato-dropdown")&&!t.target.closest(".stato-dropdown-ord")&&document.querySelectorAll(".stato-dropdown.open, .stato-dropdown-ord.open").forEach(e=>{e.classList.remove("open");let o=e.closest(".item-card");o&&o.classList.remove("stato-aperto");let i=e.closest(".riga-ordine");i&&i.classList.remove("stato-aperto-ord")})},!0),document.addEventListener("click",function(t){if(!t.target.closest(".pf-wrap")){let e=document.getElementById("pf-panel"),o=document.getElementById("pf-caret");e&&e.style.display!=="none"&&(e.style.display="none",o&&(o.style.transform=""))}}),document.addEventListener("visibilitychange",function(){document.visibilityState==="visible"&&window.paginaAttuale==="PROGRAMMA PRODUZIONE DEL MESE"&&Pi()})}var $i,ho,Qa,D,Xa=W(()=>{ft();Pt();gt();vt();Qt();xt();Zt();no();mo();Ai();Ga();$i=!1,ho=null;Qa="_prod_filtri_v1",D=(()=>{try{return JSON.parse(localStorage.getItem(Qa))||{}}catch{return{}}})();D.stati||(D.stati=[]);D.sortBy||(D.sortBy="default");D.soloRimanente||(D.soloRimanente=!1)});async function Ni(t){let e=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(e)).map(o=>o.toString(16).padStart(2,"0")).join("")}function ts(){return Date.now()<xo}function Rd(){Eo++,Eo>=5&&(xo=Date.now()+3e4,Eo=0)}function kd(){Eo=0,xo=0}async function es(){let t=document.getElementById("login-error");if(t.innerText="",t.style.color="",document.getElementById("login-view-admin")?.style.display!=="none"){let s=(document.getElementById("login-codice")?.value||"").trim();t.innerText="Usa il pulsante Entra per accedere come admin.";return}if(ts()){let s=Math.ceil((xo-Date.now())/1e3);t.innerText="Troppi tentativi. Riprova tra "+s+" secondi.";return}let o=(document.getElementById("login-email")?.value||"").trim().toLowerCase(),i=(document.getElementById("login-username")?.value||"").trim(),n=document.getElementById("login-password")?.value||"";if(!o||!i||!n){t.innerText="Compila tutti i campi: email, nome utente e password.";return}let a=document.getElementById("btn-login");a.disabled=!0,a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Verifica...';try{let s=await Ni(n),c=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"verificaLogin",email:o,username:i,hash:s})})).json();c.status==="success"?(kd(),kt({nome:c.nome,ruolo:c.ruolo,email:c.email,vistaSimulata:c.nome,sessionToken:c.sessionToken||"",sessionExpiresAt:c.sessionExpiresAt||""}),window.salvaEApriDashboard()):(Rd(),ts()?t.innerText="Troppi tentativi. Riprova tra 30 secondi.":t.innerText=c.message||"Credenziali non valide.")}catch{t.innerText="Errore di connessione. Riprova."}a.disabled=!1,a.innerHTML='Entra nel Sistema <i class="fas fa-arrow-right"></i>'}async function Ld(){let t=document.getElementById("login-error");t&&(t.innerText=""),t&&(t.style.color="");let e=(document.getElementById("login-email")?.value||"").trim().toLowerCase(),o=(document.getElementById("login-username")?.value||"").trim(),i=document.getElementById("login-password")?.value||"";if(!e||!o||!i){t&&(t.innerText="Per creare l'account compila email, nome utente e password.");return}let n=document.getElementById("btn-login"),a=document.getElementById("btn-signup"),s=n?n.innerHTML:"",r=a?a.innerHTML:"";n&&(n.disabled=!0),a&&(a.disabled=!0,a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Creazione...');try{let c=await Ni(i),d=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"creaUtentePubblico",email:e,username:o,hash:c})})).json();d.status==="success"?(t&&(t.style.color="#22c55e"),t&&(t.innerText="Account creato. Accesso in corso..."),await es()):(t&&(t.style.color=""),t&&(t.innerText=d.message||"Impossibile creare l'account."))}catch{t&&(t.style.color=""),t&&(t.innerText="Errore di connessione. Riprova.")}finally{n&&(n.disabled=!1,n.innerHTML=s||'Entra nel Sistema <i class="fas fa-arrow-right"></i>'),a&&(a.disabled=!1,a.innerHTML=r||'<i class="fas fa-user-plus"></i> Nuovo utente? Crea account')}}function os(){window.hashSHA256=Ni,window._verificaAccessoUtente=es,window._creaAccountUtente=Ld}var Eo,xo,is=W(()=>{ft();vt();Eo=0,xo=0});function Di(t){if(!t)return 0;if(t instanceof Date)return t.getTime();let e=String(t).trim();if(!e)return 0;let o=e.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);if(o){let n=parseInt(o[1],10),a=parseInt(o[2],10)-1,s=parseInt(o[3]||String(new Date().getFullYear()),10);s<100&&(s+=2e3);let r=parseInt(o[4],10),c=parseInt(o[5],10),l=parseInt(o[6]||"0",10);return new Date(s,a,n,r,c,l).getTime()}let i=new Date(e);return Number.isFinite(i.getTime())?i.getTime():0}function Bi(t){let e=Date.now();return(t||[]).filter(function(o){let i=Di(o&&o._ts);return i?e-i<=Pd:!0})}function zd(t){t&&(t.stopPropagation(),t.preventDefault());let e=document.getElementById("modal-notifiche");if(e){e.classList.add("is-open"),Ud();try{localStorage.setItem("_notifLastRead",String(Date.now()))}catch{}try{localStorage.setItem("_notifBadgeCount","0")}catch{}Ui(0),b&&b.nome&&fetch(x,{method:"POST",body:JSON.stringify({azione:"segnaLetteNotifiche",username:b.nome.toUpperCase()})}).catch(function(){})}}function as(){let t=document.getElementById("modal-notifiche");t&&t.classList.remove("is-open")}async function Md(t,e,o,i){let n=i?i.closest(".notif-azioni-accesso"):null;n&&(n.querySelectorAll("button").forEach(function(a){a.disabled=!0}),n.innerHTML='<span class="notif-risposta-wait">\u23F3 Invio in corso\u2026</span>');try{let s=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"rispondiAccessoFuoriOrario",id:t,ok:o,json:1})})).json();if(s.status==="ok"){let r=o==="SI"?"\u2705 Accesso consentito":"\u{1F6AB} Accesso negato";Nd(t,r),n&&(n.innerHTML='<span class="notif-risposta-ok">'+Wt(r)+"</span>")}else n&&(n.innerHTML='<span class="notif-risposta-err">\u26A0\uFE0F '+Wt(s.msg||"Errore")+"</span>")}catch{n&&(n.innerHTML='<span class="notif-risposta-err">\u26A0\uFE0F Errore di rete</span>')}}function ss(){try{return JSON.parse(localStorage.getItem("_accRispIdx_")||"{}")}catch{return{}}}function Nd(t,e){try{let o=ss();o[t]=e,localStorage.setItem("_accRispIdx_",JSON.stringify(o))}catch{}}async function qd(t,e,o,i){let n=decodeURIComponent(e||""),a=decodeURIComponent(o||""),s=String(t||"").trim(),r=i?i.closest(".notifica-item"):null;r&&(r.classList.add("notif-removing"),await new Promise(function(l){setTimeout(l,190)})),Dd(s,n,a),r&&r.remove();let c=document.getElementById("notifiche-list");c&&!c.querySelector(".notifica-item")&&(c.innerHTML=qi([]));try{let l=b&&b.nome?b.nome.toUpperCase():"";if(!l)return;let u=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"eliminaNotifica",username:l,rid:s,titolo:n,corpo:a})})).json().catch(()=>({}));u.status!=="ok"&&u.status!=="not_found"&&console.warn("[notifiche] eliminaNotifica non ok:",u)}catch(l){console.warn("[notifiche] eliminaNotifica errore rete:",l)}}function Dd(t,e,o){try{let i=JSON.parse(localStorage.getItem("_notificheArr")||"[]"),n=!1,a=i.filter(function(s){if(n)return!0;let r=t&&String(s.rid||"")===String(t),c=String(s.titolo||"")===String(e||"")&&String(s.corpo||"")===String(o||"");return r||c?(n=!0,!1):!0});localStorage.setItem("_notificheArr",JSON.stringify(a))}catch{}}function Ui(t){let e=document.getElementById("badge-notifiche-desktop"),o=document.getElementById("badge-notifiche-mobile"),i=document.getElementById("badge-notifiche-mobile-menu");e&&(e.textContent=t>0?t:"",e.style.display=t>0?"flex":"none"),o&&(o.textContent=t>0?t:"",o.style.display=t>0?"flex":"none"),i&&(i.textContent=t>0?t:"",i.style.display=t>0?"flex":"none")}function Bd(t){return t?/stato/i.test(t)?"fa-rotate":/richiesta|comunic/i.test(t)?"fa-comment-dots":/assegnaz/i.test(t)?"fa-user-check":"fa-bell":"fa-bell"}function qi(t){return t.length?t.map(function(e,o){let i=Bd(e.titolo||""),n=Wt(e.titolo||"Notifica"),a=Wt(e.rid||""),s=encodeURIComponent(e.titolo||""),r=encodeURIComponent(e.corpo||""),c=Wt(e._ts||""),l=c?`<span class="notifica-ts">${c}</span>`:"",d="";try{let u=JSON.parse(e.corpo||"");if(u&&u.tipo==="accesso_richiesta"){let f=encodeURIComponent(u.id||""),p=encodeURIComponent(u.nome||""),m=ss();m[u.id]?d=`<div class="notifica-corpo"><span class="notif-risposta-ok">${Wt(m[u.id])}</span></div>`:d=`<div class="notifica-corpo">Vuole entrare fuori orario.</div>
                  <div class="notif-azioni-accesso">
                                        <button class="notif-btn-consenti" onclick="event.stopPropagation(); rispondiAccessoApp(decodeURIComponent('${f}'),decodeURIComponent('${p}'),'SI',this)">\u2705 Consenti</button>
                                        <button class="notif-btn-nega"    onclick="event.stopPropagation(); rispondiAccessoApp(decodeURIComponent('${f}'),decodeURIComponent('${p}'),'NO',this)">\u{1F6AB} Nega</button>
                  </div>`}}catch{}return d||(d=`<div class="notifica-corpo">${Wt(e.corpo||"")}</div>`),`<div class="notifica-item" onclick="apriDettaglioNotifica(${o})" role="button" tabindex="0">
                    <button class="notif-del-btn" title="Elimina notifica"
                                                onclick="event.stopPropagation(); eliminaNotificaApp('${a}','${s}','${r}',this)">\xD7</button>
          <div class="notifica-icon-badge"><i class="fas ${i}"></i></div>
          <div class="notifica-body">
            <div class="notifica-titolo">${n}</div>
            ${d}
            ${l}
          </div>
        </div>`}).join(""):'<div class="notif-empty"><i class="far fa-bell-slash"></i><p>Nessuna notifica recente</p></div>'}function Ud(){let t=document.getElementById("notifiche-list");if(!t)return;let e=Bi(JSON.parse(localStorage.getItem("_notificheArr")||"[]"));try{localStorage.setItem("_notificheArr",JSON.stringify(e))}catch{}t.innerHTML=qi(e),b&&b.nome&&fetch(x,{method:"POST",body:JSON.stringify({azione:"getStoricoNotifiche",username:b.nome.toUpperCase(),days:ns})}).then(function(o){return o.json()}).then(function(o){o&&o.status==="ok"&&o.all&&o.all.length&&(Io(o.all),t.innerHTML=qi(JSON.parse(localStorage.getItem("_notificheArr")||"[]")))}).catch(function(o){console.warn("[notifiche] renderNotificheList fetch fallito:",o)})}function Io(t){try{let e=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}),o=t.map(function(l){return Object.assign({},l,{_ts:l._ts||e})}),i=JSON.parse(localStorage.getItem("_notificheArr")||"[]"),n={};o.forEach(function(l){n[l.titolo+"||"+l.corpo]=l}),i.forEach(function(l){let d=l.titolo+"||"+l.corpo;n[d]||(n[d]=l)});let a=Bi(Object.values(n)).slice(0,200);localStorage.setItem("_notificheArr",JSON.stringify(a));let s=parseInt(localStorage.getItem("_notifLastRead")||"0"),c=o.filter(function(l){let d=Di(l._ts);return!d||d>s}).length;try{localStorage.setItem("_notifBadgeCount",String(c))}catch{}Ui(c)}catch{}}function Fd(){if(!b||!b.nome)return!1;let t=String(b.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||b.ruolo==="MASTER"}function Hd(){let t=new Date,e=t.getHours()*60+t.getMinutes();return e>=540&&e<1170}function jd(t){if(!(!t||t<=0)&&!(!b||!b.nome)&&!Fd()&&Hd()){try{let e=new Date().toLocaleDateString("it-IT"),o="_notifMorningToast_"+String(b.nome).toUpperCase().trim()+"_"+e;if(localStorage.getItem(o)==="1")return;localStorage.setItem(o,"1")}catch{}g("\u{1F514} Hai "+t+" notific"+(t===1?"a":"he")+" da leggere")}}function Fi(){try{let t=Bi(JSON.parse(localStorage.getItem("_notificheArr")||"[]")),e=parseInt(localStorage.getItem("_notifLastRead")||"0"),o=t.filter(function(i){let n=Di(i._ts);return!n||n>e});o.length>0&&Ui(o.length)}catch{}!b||!b.nome||fetch(x,{method:"POST",body:JSON.stringify({azione:"getNotifiche",username:b.nome.toUpperCase(),markRead:0})}).then(function(t){return t.json()}).then(function(t){if(t&&t.status==="ok"&&t.all&&t.all.length&&(Io(t.all),jd(t.all.length),t.titolo&&"serviceWorker"in navigator&&navigator.serviceWorker.controller))try{navigator.serviceWorker.controller.postMessage({type:"CACHE_NOTIF",titolo:t.titolo,corpo:t.corpo||""})}catch{}}).catch(function(t){console.warn("[notifiche] _initBadgeNotifiche fetch fallito:",t)})}function Gd(t){var e=String(t&&t.titolo||""),o=String(t&&t.corpo||""),i=(e+" "+o).replace(/\s+/g," ").trim();if(!i)return"";var n=i.match(/\bORD(?:INE)?\.?\s*[:#-]?\s*([A-Z0-9/-]{2,})/i);if(n&&n[1])return String(n[1]).trim();var a=i.match(/\b([A-Z]{2,}[A-Z0-9]*-[A-Z0-9-]{2,})\b/i);return a&&a[1]?String(a[1]).trim():""}async function Vd(t,e){try{var o=String(e||"").trim();if(!o){var i=JSON.parse(localStorage.getItem("_notificheArr")||"[]"),n=i[Number(t)];if(!n)return;o=Gd(n)}if(as(),!o){g("Nessun riferimento ordine/codice trovato in questa notifica");return}typeof window.cambiaPagina=="function"&&await window.cambiaPagina("PROGRAMMA PRODUZIONE DEL MESE",null),setTimeout(function(){["universal-search","mobile-search"].forEach(function(a){var s=document.getElementById(a);s&&(s.value=o,s.dispatchEvent(new Event("input")))}),typeof window.filtraUniversale=="function"&&window.filtraUniversale()},280)}catch(a){console.warn("[notifiche] apriDettaglioNotifica errore:",a)}}function rs(){window.apriPopupNotifiche=zd,window.chiudiPopupNotifiche=as,window.eliminaNotificaApp=qd,window.rispondiAccessoApp=Md,window.apriDettaglioNotifica=Vd}var ns,Pd,Wt,cs=W(()=>{ft();vt();gt();ns=7,Pd=ns*24*60*60*1e3;Wt=y});function Co(){let t=document.getElementById("user-name-display"),e=document.getElementById("user-avatar-icon"),o=document.getElementById("account-ddrop-avatar"),i=document.getElementById("account-ddrop-name"),n=document.getElementById("account-ddrop-role"),a=document.getElementById("user-avatar-icon-mobile"),s=document.getElementById("account-ddrop-avatar-mob"),r=document.getElementById("account-ddrop-name-mob"),c=document.getElementById("account-ddrop-role-mob");if(b&&b.nome){let l=b.nome.charAt(0).toUpperCase(),d=b.nome.toUpperCase();t&&(t.innerText=d),e&&(e.innerText=l),o&&(o.innerText=l),i&&(i.innerText=d),n&&(n.innerText=(b.ruolo||"Utente").toUpperCase()),a&&(a.innerText=l),s&&(s.innerText=l),r&&(r.innerText=d),c&&(c.innerText=(b.ruolo||"Utente").toUpperCase())}Wd()}function ps(t){try{let e=String(t||"").toUpperCase().trim();return Ao[e]?Ao[e]:localStorage.getItem("avatarColor_"+e)||"#374151"}catch{return"#374151"}}function ji(t){if(!t)return t;let e=String(t).trim().toUpperCase();return ls[e]?ls[e]:String(t).trim().toLowerCase().replace(/(?:^|\s|\.)\S/g,o=>o.toUpperCase())}function Wd(){if(!b||!b.nome)return;let t=ps(b.nome);window._renderCustomSwatches&&window._renderCustomSwatches(),window._applyAvatarColorUI&&window._applyAvatarColorUI(t)}async function Gi(){try{let t=await fetch(x,{method:"POST",body:JSON.stringify({azione:"getAvatarColors"})});if(!t.ok)return;let e=await t.json();if(typeof e!="object"||Array.isArray(e))return;if(Object.entries(e).forEach(([o,i])=>{if(!i)return;let n=o.toUpperCase().trim();Ao[n]=i;try{localStorage.setItem("avatarColor_"+n,i)}catch{}}),b?.nome){let o=e[b.nome.toUpperCase().trim()];o&&window._applyAvatarColorUI&&window._applyAvatarColorUI(o)}typeof window._repaintOpColors=="function"&&window._repaintOpColors()}catch(t){console.warn("_caricaColoriAvatarDaServer:",t)}}function us(){return!!(b&&b.nome)}function Zd(){return b?String(b.ruolo||"").toUpperCase()==="COMMERCIALE":!1}function Qd(){let t=new Date,e=t.getHours()*60+t.getMinutes();return e>=510&&e<1170}function Vi(t){return sessionStorage.getItem("_accesso_extra_")==="1"||us()||Qd()?(ds(),!0):(t!==!1&&Oo(),!1)}function Oo(){if(document.getElementById("_lock-screen_"))return;let t=b&&b.nome?b.nome:"",e=document.createElement("div");e.id="_lock-screen_",e.style.cssText=["position:fixed","top:0","left:0","width:100%","height:100%","background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%)","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","gap:16px","color:#e2e8f0","font-family:inherit"].join(";");let o=t?`<div style="margin-top:8px;font-size:0.82rem;color:#64748b">
               Accesso come: <strong style="color:#94a3b8">${ji?ji(t):t}</strong>
           </div>`:`<input id="_lock-nome_" type="text" placeholder="Il tuo nome utente"
               autocomplete="username" spellcheck="false"
               style="margin-top:12px;padding:10px 16px;border-radius:10px;border:1px solid #334155;
                      background:#0f172a;color:#e2e8f0;font-size:0.95rem;text-align:center;
                      width:220px;outline:none;">`;e.innerHTML=`
        <div style="font-size:3rem">\u{1F512}</div>
        <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.02em">App bloccata</div>
        <div style="font-size:0.95rem;color:#94a3b8;text-align:center;max-width:280px;line-height:1.5">
            L'app \xE8 disponibile dalle <strong style="color:#e2e8f0">08:30</strong> alle
            <strong style="color:#e2e8f0">19:30</strong>.<br>
            Si sbloccher\xE0 automaticamente.
        </div>
        ${o}
        <button id="_btn-chiedi-accesso_"
            onclick="_richiestaAccessoFuoriOrario_()"
            style="margin-top:16px;padding:12px 28px;border-radius:12px;border:none;
                   background:#f59e0b;color:#0f172a;font-weight:700;font-size:0.95rem;
                   cursor:pointer;letter-spacing:0.02em;transition:background 0.15s">
            \u{1F513} Chiedi accesso a Alessio
        </button>
        <div id="_lock-stato_" style="font-size:0.82rem;color:#64748b;min-height:1.2em;text-align:center;max-width:260px"></div>`,document.body.appendChild(e)}function ds(){let t=document.getElementById("_lock-screen_");t&&t.remove(),Yd()}function Yd(){Hi&&(clearInterval(Hi),Hi=null),Kd=null}function ms(){window._normNome=ji,window._PREDEFINED_AVATAR_COLORS=Jd,window._avatarColorsCache=Ao,window._getOpColor=ps,window._isUtenteEsente=us,window._isCommerciale=Zd}var Ao,ls,Jd,Kd,Hi,fs=W(()=>{ft();vt();Ao={};ls={ALESSIO:"Alessio",RICCARDO:"Riccardo",FABIO:"Fabio T.","FABIO T":"Fabio T.","FABIO T.":"Fabio T.",NICCOLO:"Niccol\xF2","NICCOLO'":"Niccol\xF2","NICCOL\xD2'":"Niccol\xF2",RAYMOND:"Raymond",SIMONE:"Simone",GIACOMO:"Giacomo"};Jd=["#8fe45e","#6366f1","#f59e0b","#ec4899","#06b6d4","#f87171","#a78bfa","#34d399"];Kd=null,Hi=null;setInterval(function(){b&&b.nome&&Vi(!0)},60*1e3)});var gp=Ps(()=>{ft();Pt();vt();xt();Zt();rn();Qt();gt();_n();Tn();Vn();ca();Ua();Xa();is();cs();fs();try{let t=document.getElementById("critical-init");t&&t.remove()}catch{}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("controllerchange",()=>{window.location.reload()});"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",function(t){if(t.data&&t.data.type==="NUOVE_NOTIFICHE"){Io(t.data.notifiche||[]);var e=t.data.notifiche||[];e.length>0&&e[0].titolo&&"caches"in window&&caches.open("prod-last-notif").then(function(i){i.put("last",new Response(JSON.stringify({titolo:e[0].titolo,corpo:e[0].corpo||""})))}).catch(function(){});return}if(t.data&&t.data.type==="OPEN_CSV_MODAL"){typeof window.cambiaPagina=="function"&&window.cambiaPagina("IMPOSTAZIONI",null).catch(function(){});return}if(t.data&&t.data.type==="OPEN_NOTIFICATION_TARGET")try{var o=String(t.data.target||"").trim();o&&typeof window.apriDettaglioNotifica=="function"&&window.apriDettaglioNotifica(-1,o)}catch{}});var gs=!1,ve=null,he=null,$o=0,Le=0,vs=0,Ji=!1,Xd=0,hs=0;function tp(){let t=b?.sessionExpiresAt;if(!t)return 0;let e=Number(t);if(Number.isFinite(e)&&e>0)return e;let o=new Date(t).getTime();return Number.isFinite(o)?o:0}function bs(){let t=tp();if(!t)return;let e=t-Date.now();if(e<=0||e>1440*60*1e3||Date.now()-hs<180*1e3)return;hs=Date.now();let o=Math.max(1,Math.floor(e/36e5));g("Sessione in scadenza tra circa "+o+" ore. Rientra per rinnovarla.","warning")}function Zi(t){Xd=Number(t)||Date.now()}function Lo(){return tn()}function ep(){en()}function xs(){if(gs||typeof window.fetch!="function")return;let t=window.fetch.bind(window);function e(o){return ep(),o.clone().text().then(function(i){try{let n=JSON.parse(i);n&&n.status==="auth_error"&&As(n.message||n.msg||"Sessione scaduta."),n&&n.status==="fuori_orario"&&typeof Oo=="function"&&Oo()}catch{}}).catch(function(){}),o}window.fetch=function(o,i){try{let n=Lo(),a=typeof o=="string"?o:o&&o.url?o.url:"";if(!a||a.indexOf(x)!==0)return t(o,i);let s=String(i&&i.method||"GET").toUpperCase();if(s==="GET")return t(o,i).then(e);if(s==="POST"&&i&&typeof i.body=="string")try{let r=JSON.parse(i.body||"{}");if(n&&!r.sessionToken){r.sessionToken=n;let c=Object.assign({},i,{body:JSON.stringify(r)});return t(o,c).then(e)}}catch{}return t(o,i).then(e)}catch{}return t(o,i)},gs=!0}xs();async function Po(){let t=Lo();if(!t)return!1;let e=b||null;if(!e)try{let o=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");e=o?JSON.parse(o):null}catch{}try{let i=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"refreshSession",sessionToken:t,username:e&&e.nome?String(e.nome):"",email:e&&e.email?String(e.email):""})})).json();if(i&&i.status==="success"&&i.sessionToken){$o=0,Le=0,b||kt({}),b.sessionToken=i.sessionToken,b.sessionExpiresAt=i.sessionExpiresAt||"",b.expiresAt=Date.now()+2592e6,!b.nome&&i.nome&&(b.nome=i.nome),!b.email&&i.email&&(b.email=i.email),!b.ruolo&&i.ruolo&&(b.ruolo=i.ruolo);try{localStorage.setItem("sessioneUtente",JSON.stringify(b))}catch{}try{sessionStorage.setItem("sessioneUtente",JSON.stringify(b))}catch{}return!0}if(i&&i.status==="auth_error")return $o++,$o>=3&&($o=0,Pe()),!1}catch{}return!1}function Is(){ve&&clearInterval(ve),he&&clearInterval(he),ve=setInterval(Po,300*1e3),he=setInterval(bs,60*1e3),bs()}window.addEventListener("storage",function(t){if(!(t.key!=="sessioneUtente"||!t.newValue))try{let e=JSON.parse(t.newValue);if(!e||!e.sessionToken)return;b||kt({}),b.sessionToken=String(e.sessionToken),e.sessionExpiresAt&&(b.sessionExpiresAt=e.sessionExpiresAt)}catch{}});document.addEventListener("visibilitychange",function(){document.hidden||Po()});var ys=!1;async function As(t){if(ys)return;var e=document.getElementById("login-overlay");if(e&&e.style.display!=="none")return;let o=Date.now();if(o-vs>3e4&&(Le=0),vs=o,Le++,Le===1&&!Ji){Ji=!0;try{if(await Po()){Le=0;return}}finally{Ji=!1}}ys=!0,g(t||"Sessione scaduta. Effettua nuovamente il login.","error"),setTimeout(function(){Pe()},2e3)}try{let t=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");if(t){let e=JSON.parse(t);if(e&&e.sessionToken){let o=document.getElementById("login-overlay");o&&(o.style.display="none"),document.documentElement.classList.add("has-session")}}}catch{}var Qi=null,Ki=!1;window.filtroRicercaArticoli=Ki;var op=[];function ip(){return[{nome:"PREPARARE",colore:"#94a3b8"},{nome:"PREPARARE PER LAVORAZIONE",colore:"#64748b"},{nome:"MANDA IN LAVORAZIONE",colore:"#475569"},{nome:"IN LAVORAZIONE",colore:"#f59e0b"},{nome:"TORNATO DALLA LAVORAZIONE",colore:"#7c3aed"},{nome:"IN PRODUZIONE",colore:"#242424"},{nome:"IMBALLATO",colore:"#22c55e"},{nome:"SPEDITO/CONSEGNATO",colore:"#06b6d4"}]}var np=[],ws=!1,ap=0,Wi=0,To=null,Ss=0,Tt=null,Rt=null,Cs="BAHqp3uv56mQSAeTv_66-f4GYkzaESwuJNOP5DJCVMi197n-EKl9TW9XPrKeIIDpzBz0HTM42AcUCXWmOP5BSYI";async function Os(){if(!(!("serviceWorker"in navigator)||!("PushManager"in window)))try{let t=await navigator.serviceWorker.register("sw.js",{scope:"./"});await navigator.serviceWorker.ready,"caches"in window&&await(await caches.open("prod-auth")).put("username",new Response(b.nome.toUpperCase()));let e=await t.pushManager.getSubscription(),o=Notification.permission;if(!e&&o==="granted")try{e=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:window._vapidB64ToUint8_?window._vapidB64ToUint8_(Cs):null})}catch(a){console.warn("[Push] Auto-subscribe failed:",a);try{localStorage.setItem("_pushStato","errore-subscribe")}catch{}return}if(!e){try{localStorage.setItem("_pushStato","no-permesso")}catch{}return}let i=e.toJSON(),n=await $s({endpoint:i.endpoint,p256dh:i.keys?.p256dh,auth:i.keys?.auth});if(n&&(n.status==="saved"||n.status==="updated"))try{localStorage.setItem("_pushStato","ok")}catch{}else if(n&&n.status==="errore-verifica"){try{localStorage.setItem("_pushStato","errore-verifica")}catch{}g('\xE2\u0161\xA0\xEF\xB8\x8F Subscription creata ma NON confermata sul server. Riprova "Ri-registra subscription".',"error")}else try{localStorage.setItem("_pushStato","errore-salvataggio")}catch{}window._aggiornaUINotifiche&&window._aggiornaUINotifiche()}catch(t){console.warn("[Push] initPush:",t);try{localStorage.setItem("_pushStato","errore:"+t.message)}catch{}}}async function $s(t){try{let o=await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"salvaSottoscrizione",username:b.nome.toUpperCase(),endpoint:t.endpoint,p256dh:t.p256dh||"",auth:t.auth||""})})).json().catch(()=>({}));if(o&&(o.status==="saved"||o.status==="updated"))try{(await(await fetch(x,{method:"POST",body:JSON.stringify({azione:"verificaIscrizione",username:b.nome.toUpperCase(),endpoint:t.endpoint})})).json().catch(()=>({}))).found||(console.warn("[Push] verificaIscrizione: endpoint NON trovato nel foglio dopo il salvataggio!"),o.status="errore-verifica")}catch(i){console.warn("[Push] verificaIscrizione error:",i)}return o}catch(e){console.warn("[Push] _salvaSubVAPID_ error:",e)}}var ko=null,_s=null,sp={card:"bg-white/90 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow",cardGrid:"grid gap-3",label:"text-[10px] uppercase tracking-wide text-slate-500 font-semibold",value:"text-slate-900 font-semibold",btn:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] transition",btnPrimary:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.99] transition",btnSuccess:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.99] transition",btnWarning:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 active:scale-[0.99] transition",btnDanger:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.99] transition",btnPrimaryLg:"inline-flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] transition shadow-sm",pill:"inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600"};function zo(){ko=document.querySelectorAll(".ordine-wrapper, .chat-card, .materiale-card, .manuale-card")}function Ts(){if(typeof x>"u")return;U("_html__acq_ordini"),A.dashPromise=fetch(x,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!1})}).then(function(o){return o.ok?o.json():null}).catch(function(){return null}),A.rqPromise=fetch(x,{method:"POST",body:JSON.stringify({azione:"getAllRichieste"})}).then(function(o){return o.ok?o.json():null}).catch(function(){return null}),A.matPromise=fetch(x,{method:"POST",body:JSON.stringify({pagina:"MATERIALE DA ORDINARE"})}).then(function(o){return o.ok?o.json():null}).catch(function(){return null});let e=b?.nome?.toUpperCase().trim()==="ALESSIO"?"":b?.nome||"";A.ordiniPromise=fetch(x,{method:"POST",body:JSON.stringify({azione:"getOrdiniAcquisti",operatore:e})}).then(function(o){return o.ok?o.json():null}).catch(function(){return null}),A.dashPromise.then(function(o){o&&(A.dashBundle=o)}),A.rqPromise.then(function(o){o&&(A.rqBundle=o)}),A.matPromise.then(function(o){o&&(A.matBundle=o)}),A.ordiniPromise.then(function(o){o&&(A.ordiniBundle=o)})}function rp(){let t=null;try{t=localStorage.getItem("ultimaPaginaProduzione")}catch{}(!t||t==="undefined"||t==="null")&&(t="PROGRAMMA PRODUZIONE DEL MESE"),delete H[t],ot[t]=0,U("_html_"+t)}function Rs(){xs(),Is(),Tt&&Tt.registerGlobals(),Rt&&Rt.registerGlobals(),Gn(),Ba(),Ya(),window.cambiaPagina=Ro,window.aggiornaListaFiltrabili=zo,cn({onRemoteChange:function(i){g("\u{1F504} "+i+" ha aggiornato i dati"),Zi(Date.now()),nn();try{N.clear()}catch{}switch(Object.keys(H).forEach(n=>{delete H[n]}),Object.keys(ot).forEach(n=>{ot[n]=0}),Qi){case"PROGRAMMA PRODUZIONE DEL MESE":Ne("PROGRAMMA_PRODUZIONE",yo,wo,!0).catch(n=>console.warn("[RevisionPoller] refresh failed:",n));break;case"STORICO_RICHIESTE":Ct();break;case"MATERIALE DA ORDINARE":Se(null);break;case"MANUALI_PRODOTTI":to(null,null,!0);break;case"ARCHIVIO_ORDINI":typeof ke=="function"&&ke();break}},onUsersOnline:function(i){pp(i)},getUtenteAttuale:function(){return b},getPaginaCorrente:function(){return Qi}}),M.start(),Zi(Date.now());let e=null;try{e=localStorage.getItem("ultimaPaginaProduzione")}catch{}(!e||e==="undefined"||e==="null")&&(e="PROGRAMMA PRODUZIONE DEL MESE");let o=document.querySelector(`.menu-item[data-page="${e}"]`);Ro(e,o).catch(i=>{i&&i.name!=="AbortError"&&console.warn("[init] cambiaPagina:",i)});try{if(new URLSearchParams(window.location.search).get("action")==="openCsvModal"){let a=window.location.pathname+window.location.hash;window.history.replaceState(null,"",a),setTimeout(function(){Ro("IMPOSTAZIONI",null).then(function(){setTimeout(function(){typeof window._apriCsvPendingModal_=="function"&&window._apriCsvPendingModal_()},300)}).catch(function(){})},400)}}catch{}}window.onload=async function(){if(ws)return;ws=!0;let t=document.getElementById("login-overlay"),e=null;try{e=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente")}catch{}if(e){if(kt(JSON.parse(e)),b.expiresAt&&Date.now()>b.expiresAt){kt(null);try{localStorage.removeItem("sessioneUtente"),sessionStorage.removeItem("sessioneUtente")}catch{}document.documentElement.classList.remove("has-session"),t&&(t.style.display="flex",t.style.opacity="1");let o=document.getElementById("login-error");o&&(o.innerText="Sessione scaduta. Effettua nuovamente il login.",o.style.color="#ef4444");return}if(b.ruolo!=="MASTER"&&!b.sessionToken){kt(null);try{localStorage.removeItem("sessioneUtente"),sessionStorage.removeItem("sessioneUtente")}catch{}document.documentElement.classList.remove("has-session"),t&&(t.style.display="flex",t.style.opacity="1");let o=document.getElementById("login-error");o&&(o.innerText="Sessione non pi\xC3\xB9 valida. Effettua di nuovo il login.",o.style.color="#ef4444");return}Ts(),Co(),Os(),Fi(),(window.requestIdleCallback||function(o){setTimeout(o,3e3)})(function(){Gi()}),t&&(t.style.display="none")}else document.documentElement.classList.remove("has-session"),t&&(t.style.display="flex",t.style.opacity="1");if(e&&typeof $e=="function"&&await $e().catch(o=>console.warn("[Boot] caricaDatiIniziali:",o)),e){if(b.ruolo!=="MASTER"&&!b.nome){document.documentElement.classList.remove("has-session");try{localStorage.removeItem("sessioneUtente"),sessionStorage.removeItem("sessioneUtente")}catch{}t&&(t.style.display="flex",t.style.opacity="1");return}Rs()}};function cp(){let t=document.getElementById("main-sidebar");if(!t)return;let e=t.classList.toggle("collapsed");document.body.classList.toggle("sidebar-collapsed",e);try{localStorage.setItem("sidebarCollapsed",e?"1":"0")}catch{}}function lp(){try{let t=localStorage.getItem("sidebarCollapsed"),e=document.getElementById("main-sidebar");t==="1"&&(e&&e.classList.add("collapsed"),document.body.classList.add("sidebar-collapsed"))}catch{}}document.addEventListener("DOMContentLoaded",lp);async function dp(){if(!Vi(!0))return;b&&(b.expiresAt=Date.now()+2592e6);try{localStorage.setItem("sessioneUtente",JSON.stringify(b))}catch{}try{sessionStorage.setItem("sessioneUtente",JSON.stringify(b))}catch{}Is(),Po();let t=document.getElementById("login-overlay");t.style.transition="opacity 0.4s ease",t.style.opacity="0",Ts(),U("_impostazioni_cache"),await Promise.all([$e().catch(e=>console.warn("caricaDatiIniziali post-login:",e)),new Promise(e=>setTimeout(e,400))]),t.style.display="none",document.documentElement.classList.add("has-session"),typeof Co=="function"&&Co(),Os(),Fi(),(window.requestIdleCallback||function(e){setTimeout(e,3e3)})(function(){Gi()}),rp(),Rs()}function Pe(){if(!Pe._running){Pe._running=!0,M.stop(),me();try{let t=Lo();t&&fetch(x,{method:"POST",body:JSON.stringify({azione:"logout",sessionToken:t})}).catch(function(){}),ve&&(clearInterval(ve),ve=null),he&&(clearInterval(he),he=null);try{N.clear()}catch{}let e={};for(let o=0;o<localStorage.length;o++){let i=localStorage.key(o);i&&(sn.some(n=>i.startsWith(n))||an.includes(i))&&(e[i]=localStorage.getItem(i))}localStorage.clear(),sessionStorage.clear(),Object.entries(e).forEach(([o,i])=>{try{localStorage.setItem(o,i)}catch{}}),window.location.href=window.location.origin+window.location.pathname+"?logout="+Date.now()}catch(t){console.error("Errore durante il logout:",t),window.location.reload()}}}function pp(t){var e=b&&b.nome?b.nome.toUpperCase():"",o=t.filter(function(c){return c.nome.toUpperCase()!==e}),i=document.getElementById("user-avatar-btn"),n=document.getElementById("user-avatar-btn-mobile");if(o.length===0){var a=document.getElementById("online-indicator");a&&a.remove();var s=document.getElementById("online-indicator-mob");s&&s.remove();return}var r="Online ora: "+o.map(function(c){return c.nome+(c.pagina?" ("+c.pagina+")":"")}).join(", ");[{parent:i,id:"online-indicator"},{parent:n,id:"online-indicator-mob"}].forEach(function(c){if(c.parent){var l=document.getElementById(c.id);l||(l=document.createElement("span"),l.id=c.id,c.parent.appendChild(l)),l.title=r}})}document.addEventListener("visibilitychange",function(){M._timer&&(document.hidden?M._schedule(M.INTERVAL_BG_MS):(M._check(),M._schedule(M.INTERVAL_FOCUS_MS)))});window.addEventListener("online",function(){M._timer&&M._check()});async function Ro(t,e){let o=Date.now();if(o-Ss<300)return;if(Ss=o,To)try{To.abort()}catch{}To=new AbortController;let i=To.signal,n=++ap;Wi=n,window._latestNavRequest=n,ko=null,t!=="PROGRAMMA PRODUZIONE DEL MESE"&&me();let a=document.getElementById("universal-search");a&&(a.value="");let s=document.getElementById("desk-search-input");s&&(s.value=""),(!t||t==="undefined"||t==="null")&&(t="PROGRAMMA PRODUZIONE DEL MESE"),localStorage.setItem("ultimaPaginaProduzione",t),Qi=t,window.paginaAttuale=t,zi(t),document.body.classList.toggle("page-pip",t==="PIPISTRELLI"),t!=="PIPISTRELLI"&&Tt&&Tt.resetPipFetch(),t!=="KIT_PRODOTTI"&&Rt&&Rt.resetKitFetch();let r=document.getElementById("acq-tab-bar");r&&(r.style.display=t==="MATERIALE DA ORDINARE"?"flex":"none"),document.querySelectorAll(".menu-item").forEach(m=>m.classList.remove("active")),document.querySelectorAll(".tab-item").forEach(m=>m.classList.remove("active")),e||(e=document.querySelector(`.menu-item[data-page="${t}"]`)),e&&e.classList.add("active");let c=document.querySelector(`.tab-item[data-page="${t}"]`);c&&c.classList.add("active");let l={IMPOSTAZIONI:"Impostazioni Sistema",STORICO_RICHIESTE:"La mia Casella",ARCHIVIO_ORDINI:"Archivio Ordini","MATERIALE DA ORDINARE":"Gestione Acquisti",MANUALI_PRODOTTI:"Manuali Prodotti","PROGRAMMA PRODUZIONE DEL MESE":"Dashboard Produzione",PIPISTRELLI:"\xF0\u0178\xA6\u2021 Pipistrelli",KIT_PRODOTTI:"\xF0\u0178\xA7\xB0 Kit Prodotti"},d=document.getElementById("titolo-pagina");d&&(d.innerText=l[t]||t);let u=document.getElementById("page-title-desktop");u&&(u.innerText=l[t]||t);let f=document.getElementById("floating-cart-btn");if(f){let m=t==="MATERIALE DA ORDINARE";f.style.display=m?"flex":"none",!m&&typeof chiudiModalCarrello=="function"&&chiudiModalCarrello()}let p=document.getElementById("contenitore-dati");if(!H[t]){let m="_html_"+t,h=ht(m,1200*1e3);if(h){H[t]=h;try{let w=localStorage.getItem(m),v=w?JSON.parse(w):null;ot[t]=v&&v.ts?v.ts:Date.now()}catch{ot[t]=Date.now()}}}if(H[t]?p.innerHTML="":p.innerHTML=`<div class="nav-skeleton">
            <div class="nav-skel-bar" style="width:60%"></div>
            <div class="nav-skel-bar" style="width:85%"></div>
            <div class="nav-skel-bar" style="width:45%"></div>
            <div class="nav-skel-bar" style="width:75%"></div>
        </div>`,["modalAiuto","modal-conferma","modal-gestione-articolo","modal-carrello"].forEach(m=>{let h=document.getElementById(m);if(h){if(m==="modal-carrello"){h.classList.remove("cart-open");return}if(m==="modal-gestione-articolo"){h.classList.remove("active"),setTimeout(()=>{h.classList.contains("active")||(h.style.display="none")},300);return}h.classList.remove("active"),setTimeout(()=>{h.classList.contains("active")||(h.style.display="none")},300)}}),t==="STORICO_RICHIESTE"){let m=document.getElementById("badge-richieste-count");m&&(m.style.display="none",m.classList.remove("badge-sollecito-attivo"));let h=document.getElementById("badge-mobile-notif");h&&(h.style.display="none");let w=document.getElementById("badge-bottom-richieste");w&&(w.style.display="none",w.classList.remove("badge-sollecito-attivo"))}if(H[t]){p.innerHTML=H[t],Zi(ot[t]||Date.now()),z(p),zo(),requestAnimationFrame($t),t==="PROGRAMMA PRODUZIONE DEL MESE"&&(So(),requestAnimationFrame(()=>{typeof window._renderProdFilterBar=="function"&&window._renderProdFilterBar(),typeof window._applicaFiltriProd=="function"&&window._pfHasActiveFilters&&window._pfHasActiveFilters()&&window._applicaFiltriProd();let m=window._getAttiviProd?window._getAttiviProd():null;m&&m.forEach(h=>{if(parseFloat(h.qty_evasa)>0){let w=document.getElementById("qty-evasa-block-"+h.id_riga),v=w&&w.closest(".qty-cell")?.querySelector(".btn-qty-evasa-toggle");w&&(w.style.display="inline-flex"),v&&v.classList.add("active")}})}));return}switch(t){case"IMPOSTAZIONI":Vt();break;case"STORICO_RICHIESTE":{let m=document.getElementById("contenitore-dati");m&&(m.innerHTML="<div class='centered-msg' id='_ric-loader'>Caricamento messaggi in corso...</div>"),Ne("STORICO_RICHIESTE",Ee,Je).catch(async h=>{if(h&&h.name==="AbortError")return;let w=null;try{w=await N.get("STORICO_RICHIESTE")}catch{}if(w){let v=new Date(w.timestamp),E=String(v.getHours()).padStart(2,"0"),C=String(v.getMinutes()).padStart(2,"0");g("Connessione assente \xE2\u20AC\u201D mostro dati salvati alle "+E+":"+C,"warning")}else{let v=document.getElementById("contenitore-dati");v&&(v.innerHTML=`<div class='centered-error-bold'>Errore nel caricamento. <button onclick="cambiaPagina('STORICO_RICHIESTE',null)" style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">Riprova</button></div>`,z(v))}});break}case"ARCHIVIO_ORDINI":ke();break;case"MATERIALE DA ORDINARE":Se(e?"catalogo":null,n,i);break;case"MANUALI_PRODOTTI":to(n,i,!1);break;case"ORDINI_ACQUISTI":Se("ordini",n,i);return;case"PIPISTRELLI":try{Tt||(Tt=await import("./chunk-pipistrelli-YHWPXY32.js"),Tt.registerGlobals()),Tt.caricaPipistrelli()}catch(m){if(m&&m.name==="AbortError")return;console.warn("[PIPISTRELLI] Errore caricamento modulo:",m);let h=document.getElementById("contenitore-dati");h&&(h.innerHTML=`<div class='centered-error-bold'>Errore nel caricamento. <button onclick="cambiaPagina('PIPISTRELLI',null)" style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">Riprova</button></div>`,z(h)),Tt=null}break;case"KIT_PRODOTTI":try{if(Rt||(Rt=await import("./chunk-kit-prodotti-NW57ALDA.js"),Rt.registerGlobals()),n!==Wi||window.paginaAttuale!=="KIT_PRODOTTI")return;Rt.caricaKitProdotti()}catch(m){if(m&&m.name==="AbortError"||n!==Wi||window.paginaAttuale!=="KIT_PRODOTTI")return;console.warn("[KIT_PRODOTTI] Errore caricamento modulo:",m);let h=document.getElementById("contenitore-dati");h&&(h.innerHTML=`<div class='centered-error-bold'>Errore nel caricamento. <button onclick="cambiaPagina('KIT_PRODOTTI',null)" style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">Riprova</button></div>`,z(h)),Rt=null}break;default:{let m=document.getElementById("contenitore-dati");m&&(m.innerHTML="<div class='inline-msg' id='_prod-loader'>Caricamento Dashboard...</div>",z(m)),Ne("PROGRAMMA_PRODUZIONE",yo,wo).catch(async h=>{if(h&&h.name==="AbortError")return;let w=null;try{w=await N.get("PROGRAMMA_PRODUZIONE")}catch{}if(w){let v=new Date(w.timestamp),E=String(v.getHours()).padStart(2,"0"),C=String(v.getMinutes()).padStart(2,"0");g("Connessione assente \xE2\u20AC\u201D mostro dati salvati alle "+E+":"+C,"warning")}else{let v=document.getElementById("contenitore-dati");v&&(v.innerHTML=`<div class='inline-error'>Errore nel caricamento dati.
                                <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                                    style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                                    &#x21bb; Riprova</button></div>`,z(v))}})}}}function up(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function mp(t,e){return!e||t.trimStart().startsWith(e)?!0:t.split(/[\s(,;]+/).some(o=>o.toLowerCase().startsWith(e))}function fp(){clearTimeout(_s),_s=setTimeout(function(){let t=document.getElementById("universal-search"),e=document.getElementById("mobile-search"),o=t&&t.value!==""?t.value:e&&e.value!==""?e.value:t?t.value:"",i=String(o||"").trim().toLowerCase();ko||zo(),typeof window.filtroRicercaArticoli<"u"&&(Ki=!!window.filtroRicercaArticoli);let n=!!Ki,a=i?new RegExp(up(i),"i"):null;(ko||[]).forEach(function(r){if(!i){r.classList.remove("hidden-search");return}let c=(r.textContent||"").toLowerCase(),l=(r.getAttribute("data-codice")||"").toLowerCase(),d=!1;if(n)d=l?l.indexOf(i)!==-1:c.indexOf(i)!==-1;else{let u=(r.getAttribute("data-cliente")||"").toLowerCase(),f=(r.getAttribute("data-ordine")||r.getAttribute("data-codice")||"").toLowerCase(),p=(r.getAttribute("data-riferimento")||"").toLowerCase(),m=(r.getAttribute("data-codici")||"").toLowerCase(),h=c+" "+u+" "+f+" "+p+" "+m,w=mp(h,i),v=a?a.test(h):!1;d=w||i.length>=2&&v}r.classList.toggle("hidden-search",!d)});let s=document.getElementById("sezione-archivio");s&&(s.style.display=i===""?"block":"none")},120)}os();rs();ms();Xi();Sn();$n();jn();ra();Da();Ka();window.cambiaPagina=Ro;window.aggiornaListaFiltrabili=zo;window.filtraUniversale=fp;window.toggleSidebar=cp;window.logout=Pe;window.salvaEApriDashboard=dp;window.cacheContenuti=H;window.TW=sp;window.listaStati=np;window.listaOperatori=op;window._VAPID_PUBLIC_KEY=Cs;window._salvaSubVAPID_=$s;window._gestisciAuthError_=As;window._getSessionToken_=Lo;window._defaultListaStati_=ip});export default gp();
//# sourceMappingURL=script.bundle.js.map
