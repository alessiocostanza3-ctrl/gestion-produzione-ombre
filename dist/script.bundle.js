import{a as ge,b as q,c as Tt}from"./chunk-chunk-4ORYLJQG.js";import{a as V,b as ys,c as I,d as ke,e as lt,f as y,g,h as z,i as Ui,j as et,k as Fi,l as dt,m as h,n as Ct,o as Hi,p as ji,q as ut,r as $t,s as ws,t as yt,u as ot,v as Gi,w as ve}from"./chunk-chunk-DJXY4J52.js";function pt(t,e){try{let o=localStorage.getItem(t);if(!o)return null;let i=JSON.parse(o);return Date.now()-i.ts<e?i.data:null}catch{return null}}function J(t,e){try{let o=typeof e=="string"?e:JSON.stringify(e);if(o.length>25e5)return;localStorage.setItem(t,JSON.stringify({ts:Date.now(),data:o}))}catch{}}function U(t){try{localStorage.removeItem(t)}catch{}}var wt=V(()=>{});var H,X,A,Vt=V(()=>{"use strict";H={},X={},A={dashBundle:null,dashPromise:null,rqBundle:null,rqPromise:null,matBundle:null,matPromise:null,ordiniBundle:null,ordiniPromise:null}});var Ss,_s,Es,xs,Is,As,Os,Cs,$s,Vi,Ji,Wi=V(()=>{"use strict";Ss="_pushStato",_s="notifPrefs",Es="mlPipQty",xs="mlPipCaricato",Is="mlPipPronti",As="mlPipMovimenti",Os="avatarColor_",Cs="avatarColorRecenti_",$s="avatarColorHidden_",Vi=[_s,Ss,Es,xs,As,Is],Ji=[Os,Cs,$s]});function Zi(t){Co=t.onRemoteChange,$o=t.onUsersOnline,he=t.getUtenteAttuale,Pt=t.getPaginaCorrente}var Co,$o,he,Pt,Qi,N,Jt=V(()=>{ve();lt();ws();Co=null,$o=null,he=null,Pt=null;Qi={INTERVAL_MS:2e4,INTERVAL_FOCUS_MS:3e4,INTERVAL_BG_MS:3e4,PING_INTERVAL_MS:6e4,MAX_BACKOFF_MS:6e4,_timer:null,_pingTimer:null,_lastRevision:null,_lastCheck:0,_paused:!1,_errorStreak:0,_offPageTick:0,lastRevisionValue:null,lastOnlineList:[],lastCheckTs:0,start:function(){this.stop(),this._lastRevision=null,this._paused=!1,this._errorStreak=0,this._offPageTick=0,this._schedule(document.hidden?this.INTERVAL_BG_MS:this.INTERVAL_FOCUS_MS),this._schedulePing(5e3)},stop:function(){this._timer&&(clearTimeout(this._timer),this._timer=null),this._pingTimer&&(clearTimeout(this._pingTimer),this._pingTimer=null),this._lastRevision=null,this._paused=!1;var t=document.getElementById("online-indicator");t&&t.remove();var e=document.getElementById("online-indicator-mob");e&&e.remove()},pauseFor:function(t){t||(t=5e3),this._paused=!0;var e=this;setTimeout(function(){e._paused=!1},t)},_schedule:function(t){this._timer&&clearTimeout(this._timer);var e=this;this._timer=setTimeout(function(){e._tick()},t)},_tick:function(){var t=this;this._check().finally(function(){var e=Pt?String(Pt()||"").toUpperCase().trim():"",o=e==="PROGRAMMA PRODUZIONE DEL MESE",i=document.hidden?t.INTERVAL_BG_MS:document.hasFocus&&document.hasFocus()?t.INTERVAL_FOCUS_MS:t.INTERVAL_MS;o||(i=Math.max(i,t.INTERVAL_BG_MS));var n=i;if(t._errorStreak>0){var a=Math.min(4,1+t._errorStreak*.5);n=Math.min(t.MAX_BACKOFF_MS,Math.round(i*a))}t._schedule(n)})},_check:async function(){if(!this._paused){var t=Date.now(),e=Pt?String(Pt()||"").toUpperCase().trim():"",o=e==="PROGRAMMA PRODUZIONE DEL MESE";if(!(!o&&(this._offPageTick=(this._offPageTick+1)%3,this._offPageTick!==0)))try{var i=await Gi();if(!i||i.status!=="ok"){this._errorStreak=Math.min(this._errorStreak+1,10),$t("poller_check",{action:e||"UNKNOWN_PAGE",status:"invalid_payload",durationMs:Date.now()-t},{sampleRate:.5});return}var n=Number(i.revision);if(this._errorStreak=0,this._lastCheck=Date.now(),this.lastRevisionValue=n,this.lastCheckTs=Date.now(),this._lastRevision===null){this._lastRevision=n,$t("poller_check",{action:e||"UNKNOWN_PAGE",status:"baseline",durationMs:Date.now()-t},{sampleRate:.3});return}if(n===this._lastRevision){$t("poller_check",{action:e||"UNKNOWN_PAGE",status:"unchanged",durationMs:Date.now()-t},{sampleRate:.2});return}var a=he?he():null,r=a&&a.nome?a.nome.toUpperCase():"",s=i.utente?String(i.utente).toUpperCase():"";if(this._lastRevision=n,s===r)return;var c=i.utente||"Qualcuno";$t("poller_check",{action:e||"UNKNOWN_PAGE",status:"remote_change",durationMs:Date.now()-t,detail:String(c||"")},{sampleRate:1}),Co&&Co(c)}catch(l){this._errorStreak=Math.min(this._errorStreak+1,10),$t("poller_check",{action:e||"UNKNOWN_PAGE",status:"error",durationMs:Date.now()-t,error:l&&l.message?l.message:String(l||"")},{sampleRate:.7}),l&&l.name!=="AbortError"&&console.warn("[RevisionPoller]",l)}}},_schedulePing:function(t){this._pingTimer&&clearTimeout(this._pingTimer);var e=this;this._pingTimer=setTimeout(function(){e._pingServer().finally(function(){e._schedulePing(e.PING_INTERVAL_MS)})},t)},_pingServer:async function(){var t=he?he():null;if(!(!t||!t.nome))try{var e=await yt({azione:"ping",pagina:(Pt?Pt():"")||""});e&&e.status==="ok"&&Array.isArray(e.online)&&($o&&$o(e.online),Qi.lastOnlineList=e.online,$t("poller_ping",{action:"ping",status:"ok",detail:String(e.online.length)},{sampleRate:.3}))}catch(o){$t("poller_ping",{action:"ping",status:"error",error:o&&o.message?o.message:String(o||"")},{sampleRate:.7})}}},N=Qi});function Yi(){return"ORDINI_ACQUISTI_"+(h?.nome?.toUpperCase()||"_")}function Ro(){let t=document.getElementById("contenitore-dati");t&&(st._acq_ordini=t.innerHTML,_t._acq_ordini=Date.now(),q.set(Yi(),t.innerHTML).catch(()=>{}))}function Ps(){A.ordiniBundle=null,A.ordiniPromise=null}function Ki(t,e,o){t.classList.toggle("is-ordinato",o),e.classList.toggle("checked",o),e.title=o?"Segna In Attesa":"Segna Ordinato";let i=e.querySelector("i");i&&(i.className="fas "+(o?"fa-check-circle":"fa-circle"));let n=t.querySelector(".oi-stato-badge");n&&(n.className="oi-stato-badge "+(o?"badge-ordinato-sm":"badge-attesa-sm"),n.innerHTML=o?'<i class="fas fa-circle-check"></i> ORDINATO':"IN ATTESA");let a=t.querySelector(".oi-stato-dot");a&&(a.className="oi-stato-dot "+(o?"dot-ordinato":"dot-attesa"));let r=t.closest(".ordine-group");if(r){let l=r.querySelectorAll(".ordine-item").length,d=r.querySelectorAll(".ordine-item.is-ordinato").length,p=r.querySelector(".og-progress");if(p&&(p.textContent=d+"/"+l),d===l){r.classList.add("all-done");let f=r.querySelector(".og-left");f&&!f.querySelector(".og-done-badge")&&f.insertAdjacentHTML("beforeend",'<span class="og-done-badge"><i class="fas fa-check-circle"></i> Completato</span>')}else{r.classList.remove("all-done");let f=r.querySelector(".og-done-badge");f&&f.remove()}}let s=document.querySelector(".acquisti-subtitle");if(s){let c=document.querySelectorAll(".ordine-item:not(.is-ordinato)").length;s.textContent=c>0?`${c} articoli in attesa`:"Tutto ordinato \u2705"}}function Xi(t,e){return fetch(I,{method:"POST",body:JSON.stringify({pagina:t}),...e?{signal:e}:{}}).then(o=>{if(!o.ok)throw new Error(`HTTP ${o.status}`);return o.json()})}function Lo(){let t=document.getElementById("acq-tab-catalogo"),e=document.getElementById("acq-tab-ordini"),o=document.getElementById("acq-tab-fornitori");t&&t.classList.toggle("active",at==="catalogo"),e&&e.classList.toggle("active",at==="ordini"),o&&o.classList.toggle("active",at==="fornitori")}function zs(t){if(t===at)return;at=t,window._acquistTabAttivo=t,Lo();let e=document.getElementById("contenitore-dati");if(e){if(t==="fornitori"){typeof window.caricaOrdiniFornitori=="function"&&window.caricaOrdiniFornitori(null,null,!1);return}if(t==="ordini"){let o=st._acq_ordini,i=_t._acq_ordini||0;if(o&&Date.now()-i<3e5){e.innerHTML=o,z(e),window.aggiornaListaFiltrabili?.();return}tn(null,null)}else{let o=st["MATERIALE DA ORDINARE"],i=_t["MATERIALE DA ORDINARE"]||0;if(o&&Date.now()-i<3e5){e.innerHTML=o,z(e),window.aggiornaListaFiltrabili?.();return}let n=pt("_html_MATERIALE DA ORDINARE",3e5);if(n){st["MATERIALE DA ORDINARE"]=n,_t["MATERIALE DA ORDINARE"]=Date.now(),e.innerHTML=n,z(e),window.aggiornaListaFiltrabili?.();return}mt(!1,null,null)}}}async function tn(t=null,e=null){if(be)return;be=!0;let o=document.getElementById("contenitore-dati");if(!o){be=!1;return}let i=h?.nome?.toUpperCase().trim()==="ALESSIO",n=i?"":h?.nome||"",a=Yi(),r=!1;try{let s=await q.get(a);if(at!=="ordini"){be=!1;return}s&&s.dati&&(o.innerHTML=s.dati,st._acq_ordini=s.dati,_t._acq_ordini=Date.now(),z(o),window.aggiornaListaFiltrabili?.(),r=!0)}catch{}if(r||(o.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento ordini...</div>"),!(r&&t!==null))try{let s;if(A.ordiniBundle?(s=A.ordiniBundle,A.ordiniBundle=null,A.ordiniPromise=null):A.ordiniPromise?(s=await A.ordiniPromise,A.ordiniBundle=null,A.ordiniPromise=null):s=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"getOrdiniAcquisti",operatore:n}),...e?{signal:e}:{}})).json(),e?.aborted)return;if(!Array.isArray(s)||s.length===0){o.innerHTML=`<div class='empty-msg'>${i?"Nessun ordine ricevuto.":"Non hai ancora inviato ordini."}</div>`,z(o);return}let c={};s.forEach(f=>{let u=f.id_gruppo||f.data+"_"+f.operatore;c[u]||(c[u]={data:f.data,operatore:f.operatore,items:[]}),c[u].items.push(f)});let l=Object.keys(c).reverse(),d=s.filter(f=>f.stato!=="ORDINATO").length,p=`<div class="ordini-acq-page">
            <div class="acquisti-header header-flex">
                <div>
                    <h3 class="acquisti-title">${i?"Ordini Ricevuti":"I Miei Ordini"}</h3>
                    <p class="acquisti-subtitle">${i?d>0?`${d} articoli in attesa`:"Tutto ordinato \u2705":"Storico ordini inviati"}</p>
                </div>
                ${i?"":`<button class="btn-nuovo-fisso ${zt.btnSuccess}" onclick="_switchAcquistiTab('catalogo')">
                    <i class="fas fa-cart-plus"></i><span class="btn-label-nuovo"> Nuovo ordine</span>
                </button>`}
            </div>
            <div class="ordini-groups">`;if(l.forEach(f=>{let u=c[f],m=u.items.length,b=u.items.filter(v=>v.stato==="ORDINATO").length,w=b===m;p+=`
            <details class="ordine-group ${w?"all-done":""}" ${w?"":"open"}>
                <summary class="ordine-group-summary">
                    <span class="og-left">
                        ${i?`<span class="og-operatore">${y(u.operatore)}</span>`:""}
                        <span class="og-data">${Ns(u.data)}</span>
                        <span class="og-progress">${b}/${m}</span>
                        ${w?'<span class="og-done-badge"><i class="fas fa-check-circle"></i> Completato</span>':""}
                    </span>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </summary>
                <div class="ordine-items">
                    ${u.items.map(v=>Ds(v,i)).join("")}
                </div>
            </details>`}),p+="</div></div>",t!==null&&t!==window._latestNavRequest||at!=="ordini")return;q.set(a,p).catch(()=>{}),st._acq_ordini=p,_t._acq_ordini=Date.now(),o.innerHTML=p,z(o),window.aggiornaListaFiltrabili?.()}catch(s){if(s.name==="AbortError")return;o.innerHTML="<div class='centered-error-bold'>Errore nel caricamento ordini.</div>"}finally{be=!1}}function Ms(t,e){return t?new Promise(o=>{let i=new Image;i.onload=()=>{let n=Math.min(e/i.width,e/i.height,1),a=Math.round(i.width*n),r=Math.round(i.height*n),s=document.createElement("canvas");s.width=a,s.height=r,s.getContext("2d").drawImage(i,0,0,a,r),o(s.toDataURL("image/jpeg",.72))},i.onerror=()=>o(null),i.src=t}):Promise.resolve(null)}function Ns(t){try{let e=new Date(t);if(isNaN(e))return t;let o=i=>String(i).padStart(2,"0");return`${o(e.getDate())}/${o(e.getMonth()+1)}/${e.getFullYear()} ${o(e.getHours())}:${o(e.getMinutes())}`}catch{return t}}function Ds(t,e){let o=t.stato==="ORDINATO";return`
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
    </div>`}async function qs(t,e){let o=document.getElementById("oi-"+t);if(!o||o.dataset.fetching==="1")return;let i=o.classList.contains("is-ordinato"),n=i?"IN ATTESA":"ORDINATO";o.dataset.fetching="1",N.pauseFor(6e3),Ki(o,e,!i),Ps(),Ro();try{if((await fetch(I,{method:"POST",body:JSON.stringify({azione:"setArticoloOrdinato",id_riga:t,stato:n})}).then(r=>r.json())).status!=="ok")throw new Error("err");Ro()}catch{Ki(o,e,i),Ro(),g("Errore aggiornamento","error")}delete o.dataset.fetching}async function Bs(){let t=pt("_sezioniMateriali_cache",6e5);if(t)try{let e=typeof t=="string"?JSON.parse(t):t;if(Array.isArray(e)&&e.length>0){j=e;return}}catch{}try{let o=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"getSezioni"})})).json();Array.isArray(o)&&o.length>0&&(j=o,localStorage.setItem("sezioniMateriali",JSON.stringify(j)),J("_sezioniMateriali_cache",JSON.stringify(j)))}catch(e){console.warn("Sezioni: fallback a localStorage",e)}}async function Us(){U("_sezioniMateriali_cache");try{await fetch(I,{method:"POST",body:JSON.stringify({azione:"salvaSezioni",sezioni:j})})}catch(t){console.warn("Impossibile salvare sezioni sul backend",t)}}async function mt(t=!1,e=null,o=null){if(!To){To=!0;try{let i=document.getElementById("btn-delete-selected")?.classList.contains("visible");if(t&&i)return;let n=document.getElementById("modal-gestione-articolo");n&&(n.style.display="none"),document.body.style.overflow="auto";let a=document.getElementById("contenitore-dati");if(!a)return;if(!t)try{let r=await q.get("MATERIALE_DA_ORDINARE");if(at!=="catalogo")return;r&&r.dati&&(a.innerHTML=r.dati,st["MATERIALE DA ORDINARE"]=r.dati,_t["MATERIALE DA ORDINARE"]=Date.now(),z(a),window.aggiornaListaFiltrabili?.(),t=!0)}catch{}if(t&&e!==null)return;t||(a.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento catalogo materiali...</div>",z(a));try{let s=function(p){let f=p.toLowerCase();return/strument|utensil|attrez|chiave|cacciavit|trapan|pinze|martell/.test(f)?"fa-screwdriver-wrench":/bombole|spray|aerosol|vernic|smalto|lacca/.test(f)?"fa-spray-can":/rifiut|spazzatur|scarto|smalt/.test(f)?"fa-trash-can":/pulizia|detersi|detergent|solvente|diluente|sgras/.test(f)?"fa-broom":/nastro|carta|fogli|sacch|busta|plastica/.test(f)?"fa-tape":/scatol|imball|cartone|pacch|box/.test(f)?"fa-box-open":/vite|bullone|dado|chiod|rivett|raccord/.test(f)?"fa-gear":/elettr|cavo|filo|led|presa|batteria/.test(f)?"fa-bolt":/sicurezz|protezione|guant|occhial|mascherina|elmett/.test(f)?"fa-shield-halved":/colori|pigment|tint|inchiostro|pennello/.test(f)?"fa-palette":/tessuto|stoffa|panno|tela|gomma|schiuma/.test(f)?"fa-layer-group":/cibo|aliment|acqua|bevand|coff/.test(f)?"fa-utensils":/ufficio|penna|matita|block|quadern/.test(f)?"fa-pen":/misura|metro|calibro|riga|squadra/.test(f)?"fa-ruler":/prodotto|articol|merce|stock|magazzin/.test(f)?"fa-boxes-stacked":"fa-folder"},r=null;if(A.matBundle?(r=A.matBundle,A.matBundle=null,A.matPromise=null):A.matPromise?(r=await A.matPromise,A.matBundle=null,A.matPromise=null):r=await Xi("MATERIALE DA ORDINARE",o),r||(r=[]),o?.aborted||(await Bs(),r.forEach(p=>{let f=(p.SEZIONE||"").trim();f&&!j.includes(f)&&j.push(f)}),o?.aborted))return;if(!r||r.length===0){a.innerHTML="<div class='empty-msg'>Nessun materiale trovato nel catalogo.</div>",z(a);return}let c={};j.forEach(p=>{c[p]=[]}),r.forEach((p,f)=>{let u=(p.SEZIONE||"").trim(),m=j.includes(u)?u:j[0];c[m].push({item:p,gi:f})});let l=`
            <div class="acquisti-header header-flex">
                <div>
                    <h3 class="acquisti-title">Catalogo Materiali</h3>
                    <p class="acquisti-subtitle">Gestisci o ordina i materiali.</p>
                </div>
                <div class="acquisti-actions-wrapper">
                    <button id="btn-delete-selected" type="button" onclick="eliminaSelezionati()" class="${zt.btnDanger} btn-fade-action">
                        <i class="fas fa-trash"></i><span class="btn-elimina-label"> Elimina (<span id="count-selected">0</span>)</span>
                    </button>
                    <button id="btn-mode-select" type="button" onclick="toggleSelezioneMultipla()" class="${zt.btn}">
                        <i class="fas fa-tasks"></i><span class="btn-sel-txt"> Seleziona</span>
                    </button>
                    <button type="button" class="btn-nuovo-fisso btn-sezione-new ${zt.btn}" onclick="apriModalNuovaSezione()" title="Nuova sezione">
                        <i class="fas fa-folder-plus"></i>
                    </button>
                    <button type="button" class="btn-nuovo-fisso ${zt.btnSuccess}" onclick="apriModalNuovo()">
                        <i class="fas fa-plus"></i><span class="btn-label-nuovo"> Nuovo</span>
                    </button>
                </div>
            </div>
            <div id="lista-materiali-grid">`,d=window.innerWidth<=768;if(j.forEach((p,f)=>{let u=c[p]||[],m=s(p);l+=`
                <div class="sezione-materiali-wrapper">
                    <div class="sezione-header" onclick="toggleSezione('sezione-grid-${f}')">
                        <div class="sezione-header-left">
                            <i class="fas ${m} sezione-icon"></i>
                            <span class="sezione-nome">${p}</span>
                            <span class="sezione-count">${u.length}</span>
                        </div>
                        <div class="sezione-header-right">
                            <button type="button" class="btn-sezione-edit" title="Rinomina sezione" onclick="event.stopPropagation(); apriModalRinominaSezione('${p}')"><i class="fas fa-pen"></i></button>
                            <i class="fas fa-chevron-down sezione-arrow"${d?' style="transform:rotate(-90deg)"':""}></i>
                        </div>
                    </div>
                    <div class="sezione-grid materiali-grid" id="sezione-grid-${f}" data-sezione="${p}"${d?' style="display:none"':""}>`,u.length===0&&(l+='<p class="sezione-empty">Nessun articolo. Usa <b>Sezione</b> dal menu \u22EE per spostare qui un articolo.</p>'),u.forEach(({item:b,gi:w})=>{let v=y(b.OGGETTO||"Senza nome"),x=y(b.FORNITORE||"Generico"),O=y(b.CODICE||""),E=`qty-item-${w}`,$=b.id_riga,k=v.replace(/'/g,"\\'").replace(/"/g,"&quot;");l+=`
                <div class="materiale-card ${zt.card}" data-idx="${w}" data-search="${(v+" "+x+" "+O).toLowerCase().replace(/"/g,"")}">
                    <div class="mat-card-img img-preview-container"
                         data-prod="${v}"
                         data-fornitore="${x}"
                         onclick="scattaFoto('${k}')">
                        <i class="fas fa-camera mat-img-icon"></i>
                        <span class="mat-img-hint">Scatta foto</span>
                        <span class="mat-badge-fornitore">${x}</span>
                    </div>
                    <div class="materiale-info">
                        <div class="materiale-nome">${v}</div>
                        ${O?`<div class="materiale-codice">${O}</div>`:""}
                        <div class="materiale-fornitore mat-fornitore-mobile">${x}</div>
                    </div>
                    <div class="materiale-actions">
                        <div class="qty-order-container">
                            <button type="button" class="btn-qty-step" onclick="cambiaQty('${E}', -1)"><i class="fas fa-minus"></i></button>
                            <input type="number" value="1" min="1" id="${E}">
                            <button type="button" class="btn-qty-step" onclick="cambiaQty('${E}', 1)"><i class="fas fa-plus"></i></button>
                        </div>
                        <button type="button" class="btn-add-cart" onclick="aggiungiAlCarrello(\`${v}\`, \`${x}\`, '${E}')" title="Aggiungi al carrello">
                            <i class="fas fa-cart-plus"></i><span class="btn-cart-txt"> Aggiungi</span>
                        </button>
                    </div>
                    <div class="mat-card-opts">
                        <input type="checkbox" class="select-materiale mat-sel-chk" data-id="${$}" onclick="aggiornaConteggioSelezionati()">
                        <button type="button" onclick="toggleMenuOpzioni(event, ${w})" class="btn-opt-trigger">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div id="menu-opzioni-${w}" class="menu-popup-opzioni">
                            <button type="button" class="menu-item-opt" onclick="apriModalModifica('${$}', \`${v}\`, \`${x}\`, \`${O}\`)"><i class="fas fa-edit"></i> Modifica</button>
                            <button type="button" class="menu-item-opt" onclick="duplicaArticolo('${$}', \`${v}\`, \`${x}\`, \`${O}\`)"><i class="fas fa-copy"></i> Duplica</button>
                            <button type="button" class="menu-item-opt" onclick="apriModalSpostaSezione('${$}')"><i class="fas fa-folder-open"></i> Sezione</button>
                            <button type="button" class="menu-item-opt btn-menu-elimina-foto" style="display:none" onclick="resetFoto('${k}')"><i class="fas fa-image"></i> Elimina foto</button>
                            <button type="button" class="menu-item-opt text-danger" onclick="eliminaArticolo('${$}')"><i class="fas fa-trash"></i> Elimina</button>
                        </div>
                    </div>
                </div>`}),l+=`
                    </div>
                </div>`}),l+="</div>",e!==null&&e!==window._latestNavRequest||at!=="catalogo")return;q.set("MATERIALE_DA_ORDINARE",l).catch(()=>{}),st["MATERIALE DA ORDINARE"]=l,_t["MATERIALE DA ORDINARE"]=Date.now(),J("_html_MATERIALE DA ORDINARE",l),a.innerHTML=l,z(a),window.aggiornaListaFiltrabili?.()}catch(r){if(r.name==="AbortError")return;console.error("Errore caricamento materiali:",r),a&&(a.innerHTML="<div class='centered-error-bold'>Errore nel caricamento del catalogo.</div>",z(a))}}finally{To=!1}}}function Fs(t,e){let o=document.getElementById(t);o&&(o.value=Math.max(1,(parseInt(o.value)||1)+e))}function Hs(t,e,o){let i=document.getElementById(o),n=parseInt(i.value)||1,a=document.querySelector(`[data-prod="${t}"]`),r=a?a.querySelector("img"):null,s=r?r.src:null;St.push({prodotto:t,quantita:n,fornitore:e,foto:s}),Le();let c=event.target.closest("button"),l=c.innerHTML;c.innerHTML='<i class="fas fa-check"></i>',c.style.background="linear-gradient(135deg,#059669,#10b981)",c.style.boxShadow="0 2px 8px rgba(16,185,129,0.45)",setTimeout(()=>{c.innerHTML=l,c.style.background="",c.style.boxShadow="",i.value=1},1400)}function Po(){let t=document.getElementById("modal-carrello"),e=document.getElementById("lista-articoli-carrello"),o=document.getElementById("btn-invia-alessio");St.length===0?(e.innerHTML="<p class='empty-cart-msg'>Il tuo carrello \xE8 vuoto.</p>",o&&(o.style.display="none")):(e.innerHTML=St.map((i,n)=>`
            <div class="cart-item-row">
                ${i.foto?`<img src="${y(i.foto)}" class="cart-item-photo">`:'<div class="cart-item-placeholder"><i class="fas fa-shopping-basket cart-item-icon"></i></div>'}
                <div class="flex-grow">
                    <div class="cart-item-name">${y(i.prodotto)}</div>
                    <div class="cart-item-details">Qt: ${y(String(i.quantita))} - ${y(i.fornitore)}</div>
                </div>
                <button onclick="rimuoviDalCarrello(${n})" class="btn-inline-trash"><i class="fas fa-trash"></i></button>
            </div>`).join(""),o&&(o.style.display="block")),t.style.display="flex",requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add("cart-open")))}function js(t){St.splice(t,1),Le(),Po()}function en(){let t=document.getElementById("modal-carrello");t.classList.remove("cart-open"),setTimeout(()=>{t.style.display="none"},300)}function Gs(){Po()}function Le(){let t=St.length,e=document.getElementById("badge-carrello-count"),o=document.getElementById("cart-qty-val");e&&(e.innerText=t,e.style.display=t>0?"flex":"none"),o&&(o.innerText=t)}async function Vs(){if(St.length===0){alert("Il carrello \xE8 vuoto!");return}if(!confirm(`Vuoi inviare la lista di ${St.length} articoli all'ufficio acquisti?`))return;N.pauseFor(6e3);let e=document.getElementById("btn-invia-alessio");e&&(e.disabled=!0,e.innerText="Invio in corso...");let o=String(Date.now());try{let i=await Promise.all(St.map(async s=>({...s,foto:await Ms(s.foto,80)}))),n={azione:"inviaOrdineAcquisti",operatore:h?.nome||"Utente",id_gruppo:o,articoli:i},r=await(await fetch(I,{method:"POST",body:JSON.stringify(n)})).json();if(r.status==="success")St=[],Le(),en(),g("\u2705 Ordine inviato ad Alessio!"),delete st._acq_ordini,delete _t._acq_ordini,U("_html__acq_ordini"),at="ordini",window._acquistTabAttivo="ordini",setTimeout(()=>window.cambiaPagina?.("MATERIALE DA ORDINARE",null),800);else throw new Error(r.message)}catch(i){g("Errore invio ordine: "+i.message,"error")}finally{e&&(e.disabled=!1,e.innerText="Invia ad Alessio")}}function Js(t){let e=`[data-prod="${t.replace(/"/g,'\\"')}"]`,o=document.querySelector(e);if(!o)return;if(o.querySelector("img")){on(o.querySelector("img").src);return}let i=document.createElement("input");i.type="file",i.accept="image/*",i.onchange=n=>{let a=n.target.files[0];if(!a)return;let r=new FileReader;r.onload=s=>{let c=s.target.result,l=o.getAttribute("data-fornitore")||"";o.innerHTML=`
                <img src="${y(c)}"
                     class="modal-img"
                     onclick="event.stopPropagation(); apriImmagineIntera(this.src)">
                ${l?`<span class="mat-badge-fornitore">${y(l)}</span>`:""}`,o.style.border="";let d=o.closest(".materiale-card");if(d){let p=d.querySelector(".btn-menu-elimina-foto");p&&(p.style.display="")}},r.readAsDataURL(a)},i.click()}function Ws(t){if(confirm("Vuoi rimuovere l'immagine da questo prodotto?")){let e=document.querySelector(`[data-prod="${t}"]`);if(!e)return;let o=e.getAttribute("data-fornitore")||"";e.innerHTML=`
            <i class="fas fa-camera mat-img-icon"></i>
            <span class="mat-img-hint">Scatta foto</span>
            ${o?`<span class="mat-badge-fornitore">${y(o)}</span>`:""}`,e.style.border="";let i=e.closest(".materiale-card");if(i){let n=i.querySelector(".btn-menu-elimina-foto");n&&(n.style.display="none")}}}function on(t){let e=document.createElement("div");e.style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:200000;display:flex;justify-content:center;align-items:center;cursor:zoom-out;";let o=document.createElement("img");o.src=t,o.className="overlay-img",e.appendChild(o),e.onclick=()=>document.body.removeChild(e),document.body.appendChild(e)}function Zs(t,e){t.preventDefault(),t.stopPropagation(),document.querySelectorAll(".menu-popup-opzioni").forEach(i=>{i.id!==`menu-opzioni-${e}`&&i.classList.remove("open")});let o=document.getElementById(`menu-opzioni-${e}`);o&&o.classList.toggle("open")}function Qs(){document.getElementById("titolo-modal-articolo").innerText="Nuovo Articolo",document.getElementById("edit-id-riga").value="",document.getElementById("edit-nome").value="",document.getElementById("edit-codice").value="",document.getElementById("edit-fornitore").value="";let t=document.getElementById("modal-gestione-articolo");t.style.display="flex",t.offsetHeight,t.classList.add("active"),an(),setTimeout(()=>{document.getElementById("edit-nome")?.focus()},180)}function Ks(t,e,o,i){let n=document.getElementById("modal-gestione-articolo");document.getElementById("titolo-modal-articolo").innerText=t?"Modifica Articolo":"Nuovo Articolo",document.getElementById("edit-id-riga").value=t||"",document.getElementById("edit-nome").value=e||"",document.getElementById("edit-codice").value=i&&i!=="undefined"?i:"",document.getElementById("edit-fornitore").value=o||"",n.style.display="flex",n.offsetHeight,n.classList.add("active"),an()}function nn(){let t=document.getElementById("modal-gestione-articolo");t.classList.remove("active"),sn(),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300)}function an(){window.visualViewport&&(sn(),Mt=function(){let t=document.getElementById("modal-gestione-articolo");if(!t||t.style.display==="none")return;let e=window.visualViewport,o=Math.max(0,window.innerHeight-e.offsetTop-e.height),i=t.querySelector(".modal-articoli-box");i&&(i.style.marginBottom=o>0?o+"px":""),t.style.top=e.offsetTop+"px",t.style.height=e.height+"px"},window.visualViewport.addEventListener("resize",Mt),window.visualViewport.addEventListener("scroll",Mt))}function sn(){if(!window.visualViewport||!Mt)return;window.visualViewport.removeEventListener("resize",Mt),window.visualViewport.removeEventListener("scroll",Mt),Mt=null;let t=document.getElementById("modal-gestione-articolo");if(!t)return;t.style.top="",t.style.height="";let e=t.querySelector(".modal-articoli-box");e&&(e.style.marginBottom="")}async function Ys(){let t=document.getElementById("btn-salva-articolo"),e=document.getElementById("edit-nome").value.trim();if(!e){g("Inserisci il nome del prodotto!","warning");return}t.textContent="Salvataggio...",t.disabled=!0,N.pauseFor(8e3);try{let o=await ot({azione:"gestisciMateriale",id_riga:document.getElementById("edit-id-riga").value,nome:e,codice:document.getElementById("edit-codice").value,fornitore:document.getElementById("edit-fornitore").value},1e4,{noDedupe:!0});if(o&&o.status==="auth_error"){window._gestisciAuthError_?.(o.message);return}if(o&&o.status==="forbidden"){g(o.message||"Non hai i permessi per questa operazione.","error");return}o&&o.status==="success"?(nn(),mt(!0)):g("Errore durante il salvataggio.","error")}catch(o){g(o?.name==="TimeoutError"?"Timeout: il server non risponde. Riprova.":"Errore di rete. Riprova.","error")}finally{t.textContent="Salva",t.disabled=!1}}async function Xs(t,e,o,i){et("Duplica Articolo",`Duplicare l'articolo: "${e}"?`,async()=>{N.pauseFor(6e3);let n=document.querySelector(`[data-id="${t}"]`).closest(".materiale-card"),a=Date.now(),r=`qty-item-temp-${a}`,s=document.createElement("div");s.innerHTML=`
            <div class="materiale-card ${zt.card}">
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
                        <button type="button" class="btn-qty-step" onclick="cambiaQty('${r}', -1)"><i class="fas fa-minus"></i></button>
                        <input type="number" value="1" min="1" id="${r}">
                        <button type="button" class="btn-qty-step" onclick="cambiaQty('${r}', 1)"><i class="fas fa-plus"></i></button>
                    </div>
                    <button type="button" class="btn-add-cart" onclick="aggiungiAlCarrello(\`${e}\`, \`${o}\`, '${r}')" title="Aggiungi al carrello">
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
            </div>`;let c=s.firstElementChild;c.style.opacity="0",c.style.transform="translateY(-10px)",n.after(c),requestAnimationFrame(()=>{c.style.transition="opacity 0.3s, transform 0.3s",c.style.opacity="1",c.style.transform="translateY(0)"});try{let l=await ot({azione:"duplicaMateriale",id_riga:t,nome:e,codice:i,fornitore:o},1e4,{noDedupe:!0});if(l&&l.status==="auth_error"){window._gestisciAuthError_?.(l.message);return}if(l&&l.status==="forbidden"){c.remove(),g(l.message||"Non hai i permessi.","error");return}l&&l.status==="success"?mt(!0):(c.style.border="1px solid red",g("Errore di sincronizzazione.","error"))}catch(l){c.style.border="1px solid red",g(l?.name==="TimeoutError"?"Timeout: il server non risponde.":"Errore di rete.","error")}},"Duplica")}function tr(t){let e=document.getElementById(t);if(!e)return;let o=e.style.display!=="none";e.style.display=o?"none":"";let n=e.closest(".sezione-materiali-wrapper")?.querySelector(".sezione-arrow");n&&(n.style.transform=o?"rotate(-90deg)":"")}function er(t){document.querySelectorAll(".menu-popup-opzioni.open").forEach(i=>i.classList.remove("open"));let e=document.getElementById("sposta-sezione-select");e.innerHTML=j.map(i=>`<option value="${y(i)}">${y(i)}</option>`).join(""),document.getElementById("sposta-id-riga").value=t;let o=document.getElementById("modal-sposta-sezione");o.style.display="flex",o.offsetHeight,o.classList.add("active")}function rn(){let t=document.getElementById("modal-sposta-sezione");t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300)}async function or(){let t=document.getElementById("sposta-id-riga").value,e=document.getElementById("sposta-sezione-select").value;rn(),N.pauseFor(6e3);try{await fetch(I,{method:"POST",body:JSON.stringify({azione:"spostaSezione",id_riga:t,sezione:e})}),delete st["MATERIALE DA ORDINARE"],U("_html_MATERIALE DA ORDINARE"),mt(!1)}catch{g("Errore durante lo spostamento.","error")}}function ir(t){document.getElementById("rinomina-sezione-nome").value=t,document.getElementById("rinomina-sezione-vecchio").value=t;let e=document.getElementById("modal-rinomina-sezione");e.style.display="flex",e.offsetHeight,e.classList.add("active"),setTimeout(()=>{let o=document.getElementById("rinomina-sezione-nome");o&&(o.focus(),o.select())},100)}function ko(){let t=document.getElementById("modal-rinomina-sezione");t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300)}async function nr(){let t=document.getElementById("rinomina-sezione-nome").value.trim(),e=document.getElementById("rinomina-sezione-vecchio").value;if(!t||t===e){ko();return}if(j.includes(t)){g("Esiste gi\xE0 una sezione con questo nome.","error");return}ko(),N.pauseFor(6e3),j=j.map(o=>o===e?t:o),localStorage.setItem("sezioniMateriali",JSON.stringify(j));try{await fetch(I,{method:"POST",body:JSON.stringify({azione:"rinominaSezione",vecchioNome:e,nuovoNome:t})}),delete st["MATERIALE DA ORDINARE"],U("_html_MATERIALE DA ORDINARE"),mt(!1),g(`Sezione rinominata in "${t}"`,"success")}catch{g("Errore durante il salvataggio.","error")}}function ar(){document.getElementById("nuova-sezione-nome").value="";let t=document.getElementById("modal-nuova-sezione");t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>document.getElementById("nuova-sezione-nome")?.focus(),100)}function cn(){let t=document.getElementById("modal-nuova-sezione");t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300)}function sr(){let t=document.getElementById("nuova-sezione-nome").value.trim();t&&(j.includes(t)||(j=[...j,t],localStorage.setItem("sezioniMateriali",JSON.stringify(j)),Us()),cn(),delete st["MATERIALE DA ORDINARE"],U("_html_MATERIALE DA ORDINARE"),mt(!1))}function rr(){let t=document.getElementById("lista-materiali-grid"),e=document.getElementById("btn-delete-selected"),o=document.getElementById("btn-mode-select");if(!t)return;let i=t.classList.toggle("grid-sel-mode");t.querySelectorAll(".mat-sel-chk").forEach(a=>{a.checked=!1}),e&&e.classList.remove("visible"),o&&(o.innerHTML=i?'<i class="fas fa-times"></i> <span class="btn-txt">Annulla</span>':'<i class="fas fa-tasks"></i> <span class="btn-txt">Seleziona</span>');let n=document.getElementById("count-selected");n&&(n.innerText="0")}function cr(){let t=document.querySelectorAll(".mat-sel-chk:checked").length,e=document.getElementById("btn-delete-selected");document.getElementById("count-selected").innerText=t,t>0?e.classList.add("visible"):e.classList.remove("visible")}async function lr(t){et("Elimina Articolo","Eliminare definitivamente questo articolo dal catalogo?",async()=>{N.pauseFor(6e3);let e=document.querySelector(`[data-id="${t}"]`).closest(".materiale-card");e.style.transition="all 0.3s ease",e.style.transform="scale(0.8)",e.style.opacity="0",setTimeout(()=>e.style.display="none",300);try{let o=await ot({azione:"eliminaMateriale",id_riga:t},1e4,{noDedupe:!0});if(o&&o.status==="auth_error"){window._gestisciAuthError_?.(o.message);return}if(o&&o.status==="forbidden"){e.style.display="flex",e.style.opacity="1",e.style.transform="",g(o.message||"Non hai i permessi.","error");return}if(o&&o.status!=="success")throw new Error;mt(!0)}catch(o){e.style.display="flex",e.style.opacity="1",e.style.transform="",g(o?.name==="TimeoutError"?"Timeout: il server non risponde.":"Errore durante l'eliminazione.","error")}},"Elimina")}async function dr(){let t=document.querySelectorAll(".mat-sel-chk:checked"),e=Array.from(t).map(o=>o.getAttribute("data-id")).filter(o=>o&&o!=="temp"&&o!=="null");if(e.length===0){alert("Nessun articolo valido selezionato. Attendi il salvataggio dei nuovi duplicati prima di eliminarli.");return}if(confirm(`Sei sicuro di voler eliminare ${e.length} articoli?`))try{t.forEach(i=>{let n=i.closest(".materiale-card");n&&(n.style.opacity="0.3",n.style.pointerEvents="none")});let o=await ot({azione:"eliminaMateriale",id_riga:e},1e4,{noDedupe:!0});if(o&&o.status==="auth_error"){window._gestisciAuthError_?.(o.message);return}if(o&&o.status==="forbidden"){g(o.message||"Non hai i permessi.","error"),mt(!0);return}if(o&&o.status==="success"){g("Articoli eliminati con successo");let i=document.getElementById("btn-delete-selected");i&&i.classList.remove("visible"),mt(!1)}else throw new Error(o&&o.message)}catch(o){alert("Errore durante l'eliminazione multipla: "+o.message),mt(!0)}}async function Wt(t=null,e=null,o=null,i=!1){if(t!==null&&(at=t,window._acquistTabAttivo=t),Lo(),at==="fornitori"){await window.caricaOrdiniFornitori?.(e,o,i);return}at==="ordini"?await tn(e,o):await mt(i,e,o)}function ln(){window.caricaAcquisti=Wt,window._switchAcquistiTab=zs,window._aggiornaTabAcquisti=Lo,window._toggleOrdinato=qs,window.aggiornaBadgeCarrello=Le,window.apriModalCarrello=Gs,window.chiudiModalCarrello=en,window.rimuoviDalCarrello=js,window.toggleMostraCarrello=Po,window.inviaOrdineAcquisti=Vs,window.cambiaQty=Fs,window.aggiungiAlCarrello=Hs,window.scattaFoto=Js,window.resetFoto=Ws,window.apriImmagineIntera=on,window.toggleMenuOpzioni=Zs,window.apriModalNuovo=Qs,window.apriModalModifica=Ks,window.chiudiModalArticolo=nn,window.salvaArticolo=Ys,window.duplicaArticolo=Xs,window.toggleSezione=tr,window.apriModalSpostaSezione=er,window.chiudiModalSpostaSezione=rn,window.confermaSpostaSezione=or,window.apriModalRinominaSezione=ir,window.chiudiModalRinominaSezione=ko,window.confermaRinominaSezione=nr,window.apriModalNuovaSezione=ar,window.chiudiModalNuovaSezione=cn,window.confermaNuovaSezione=sr,window.toggleSelezioneMultipla=rr,window.aggiornaConteggioSelezionati=cr,window.eliminaArticolo=lr,window.eliminaSelezionati=dr,window.fetchJson=Xi}var St,at,j,Mt,st,_t,be,To,zt,dn=V(()=>{lt();ut();dt();Jt();ve();wt();Vt();Tt();St=[],at="catalogo";window._acquistTabAttivo="catalogo";j=JSON.parse(localStorage.getItem("sezioniMateriali")||'["Strumenti","Bombolette","Rifiuti"]'),Mt=null,st={},_t={},be=!1,To=!1;zt={card:"bg-white/90 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow",cardGrid:"grid gap-3",label:"text-[10px] uppercase tracking-wide text-slate-500 font-semibold",value:"text-slate-900 font-semibold",btn:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] transition",btnPrimary:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.99] transition",btnSuccess:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.99] transition",btnWarning:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 active:scale-[0.99] transition",btnDanger:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.99] transition",btnPrimaryLg:"inline-flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] transition shadow-sm",pill:"inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600"};document.addEventListener("click",()=>{document.querySelectorAll(".menu-popup-opzioni.open").forEach(t=>t.classList.remove("open"))})});function pn(){return window.listaStatiFornitori&&window.listaStatiFornitori.length?window.listaStatiFornitori:un}function ur(t){let o=pn().find(i=>(i.stato||i.nome||"").toUpperCase()===(t||"").toUpperCase());return o&&o.colore||"#94a3b8"}async function mn(t){let e=await ot({azione:"getListaDiCarico"},1e4,{signal:t,retries:1});if(!e||e.status!=="ok")throw new Error(e?.msg||"Errore caricamento");return e.righe||[]}function fn(t){if(!t||t.length===0)return`<div class="centered-msg" style="padding:40px 20px;text-align:center;color:#64748b">
            <i class="fas fa-truck" style="font-size:2rem;margin-bottom:12px;display:block;opacity:.4"></i>
            Nessun ordine fornitore caricato.<br>
            <span style="font-size:.85rem">Carica un CSV "Lista di Carico" dalle Impostazioni.</span>
        </div>`;let e={};t.forEach(u=>{let m=u.n_ordine||"N.D.";e[m]||(e[m]=[]),e[m].push(u)});let o=[],i=[];Object.keys(e).forEach(u=>{e[u].some(b=>b.review_missing)?o.push(u):i.push(u)});let n=u=>u.sort((m,b)=>{let w=(e[m][0].fornitore||"").toUpperCase(),v=(e[b][0].fornitore||"").toUpperCase();return w<v?-1:w>v?1:m<b?-1:m>b?1:0});n(o),n(i);let a=[...o,...i],r=t.length,s=a.length,c=t.reduce((u,m)=>u+m.qta_evasa,0),l=t.reduce((u,m)=>u+m.quantita,0),d=l>0?Math.round(c/l*100):0,p=o.length,f=`<div class="acquisti-header header-flex">
        <div>
            <h3 class="acquisti-title">Ordini Fornitori</h3>
            <p class="acquisti-subtitle">${s} ordini \xB7 ${r} articoli \xB7 ${d}% evaso${p>0?` \xB7 <span style="color:#d97706;font-weight:600">\u26A0 ${p} da revisionare</span>`:""}</p>
        </div>
    </div>`;return o.length>0&&(f+=`<div class="of-review-banner">
            <i class="fas fa-exclamation-triangle"></i>
            <span><strong>${o.length} ordini</strong> non presenti nell'ultimo CSV caricato \u2014 verificali e archiviali se non pi\xF9 necessari.</span>
        </div>`),a.forEach(u=>{let m=e[u],b=m[0].fornitore||"-",w=m[0].data_consegna||"-",v=m.reduce((_,T)=>_+T.quantita,0),x=m.reduce((_,T)=>_+T.qta_evasa,0),O=v>0?Math.round(x/v*100):0,E=O===100?"#22c55e":O>0?"#f59e0b":"#e2e8f0",$=u.length>14?u.substring(0,14)+"\u2026":u,k=m.some(_=>_.review_missing),R=y(u),C=m[0].stato||un[0].stato,D=ur(C),G=pn().map(_=>{let T=_.stato||_.nome||"",L=_.colore||"#94a3b8",M=T.toUpperCase()===C.toUpperCase(),B=M?" is-selected":"",nt=M?'<i class="fas fa-check stato-check-icon"></i>':"";return`<button type="button" class="stato-option${B}" onclick="event.stopPropagation(); _selezionaStatoOF(this,'${R}','${y(T)}','${L}')"><span class="stato-opt-dot" style="background:${L}"></span><span>${y(T)}</span>${nt}</button>`}).join(""),ct=k?" of-ordine-missing":"",tt=k?'<span class="of-badge-missing"><i class="fas fa-exclamation-triangle"></i> Da revisionare</span>':"",P=`<button class="of-btn-archivia${k?"":" of-btn-archivia-quieta"}" onclick="event.stopPropagation(); _archiviaOrdineOF('${y(u)}')" title="Archivia ordine"><i class="fas fa-archive"></i>${k?" Archivia":""}</button>`;f+=`<div class="ordine-wrapper of-ordine-wrapper${ct}" data-nordine="${R}">
            <div class="riga-ordine of-riga-ordine" onclick="toggleAccordion(this)">
                <div class="flex-grow of-header-left">
                    <span class="order-title"><i class="fas fa-truck" style="font-size:.75rem;opacity:.5;margin-right:6px"></i>${y(b)}</span>
                    ${tt}
                </div>
                <div class="order-info">
                    <div class="badge-count"><span class="badge-ord-num">${y($)}</span><span class="badge-sep">\xB7</span>${m.length} ART.</div>
                    <span class="of-data-badge" title="Data consegna"><i class="far fa-calendar-alt"></i> ${y(w)}</span>
                    <div class="of-progress-mini" title="${O}% evaso">
                        <div class="of-progress-bar" style="width:${O}%;background:${E}"></div>
                    </div>
                    <div class="stato-dropdown stato-dropdown-ord" data-nordine="${R}">
                        <button type="button" class="stato-trigger" onclick="event.stopPropagation(); _toggleStatoDropdownOF(this)" title="Cambia stato">
                            <span class="stato-dot" style="background:${D}"></span>
                            <span class="stato-label-txt">${y(C)}</span>
                            <i class="fas fa-chevron-down stato-chevron"></i>
                        </button>
                        <div class="stato-popup">${G}</div>
                    </div>
                    ${P}
                    <i class="fas fa-chevron-down dettagli-chevron"></i>
                </div>
            </div>
            <div class="dettagli-container" style="display:none">
                ${m.map(_=>pr(_)).join("")}
            </div>
        </div>`}),f}function pr(t){let e=y(t.codice||"-"),o=y(hr(t.prodotto,60)),i=y(t.prodotto||"-"),n=y(t.fornitore||"-"),a=y(t.n_ordine||"-"),r=y(t.data_consegna||"-"),s=t.quantita||0,c=t.qta_evasa||0,l=t.qta_da_consegnare||0,d=br(t.importo),p=h?.nome?.toUpperCase().trim()==="ALESSIO",f=s>0?Math.round(c/s*100):0,u=f===100?"#22c55e":f>0?"#f59e0b":"#94a3b8",m=`data-codice="${e}" data-prodotto="${i}" data-fornitore="${n}" data-ordine="${a}" data-data="${r}" data-qty="${s}" data-evasa="${c}" data-daconsegnare="${l}"${p?` data-importo="${d}"`:""}`;return`<div class="item-card of-item-card${p?"":" of-item-card-no-importo"}" onclick="_apriDettaglioOF(this)" ${m}>
        <div><span class="label-sm">Codice</span><b>${e}</b></div>
        <div class="of-cell-prodotto"><span class="label-sm">Prodotto</span><span class="of-prodotto-text">${o}</span></div>
        <div><span class="label-sm">Ordinata</span><b>${s}</b></div>
        <div><span class="label-sm">Evasa</span><b style="color:${u}">${c}</b></div>
        <div><span class="label-sm">Da consegnare</span><b>${l}</b></div>
        ${p?`<div class="of-cell-importo"><span class="label-sm">Importo</span><b style="color:#3b82f6">${d}</b></div>`:""}
    </div>`}function mr(t){let e=document.getElementById("modal-of-dettaglio");e&&e.remove();let o=t.dataset,i=document.createElement("div");i.id="modal-of-dettaglio",i.className="modal-overlay active",i.onclick=n=>{n.target===i&&gn()},i.innerHTML=`<div class="modal-content of-modal-content">
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
            ${h?.nome?.toUpperCase().trim()==="ALESSIO"?`
            <div class="of-modal-field of-modal-qty">
                <span class="of-modal-label">Importo</span>
                <span class="of-modal-value of-modal-big">${o.importo}</span>
            </div>`:""}
        </div>
        <div style="text-align:right;margin-top:18px">
            <button class="btn-modal-cancel" onclick="_chiudiDettaglioOF()">Chiudi</button>
        </div>
    </div>`,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("active"))}function gn(){let t=document.getElementById("modal-of-dettaglio");t&&(t.classList.remove("active"),setTimeout(()=>t.remove(),200))}function fr(t){let e=t.closest(".stato-dropdown"),o=e.classList.contains("open");if(document.querySelectorAll(".of-ordine-wrapper .stato-dropdown.open").forEach(i=>{i.classList.remove("open");let n=i.closest(".riga-ordine");n&&n.classList.remove("stato-aperto-ord")}),!o){e.classList.add("open");let i=e.closest(".riga-ordine");i&&i.classList.add("stato-aperto-ord")}}function gr(t,e,o,i){let n=t.closest(".stato-dropdown"),a=n.querySelector(".stato-dot"),r=n.querySelector(".stato-label-txt");a&&(a.style.background=i),r&&(r.textContent=o),n.querySelectorAll(".stato-option").forEach(l=>{l.classList.remove("is-selected");let d=l.querySelector(".stato-check-icon");d&&d.remove()}),t.classList.add("is-selected");let s=document.createElement("i");s.className="fas fa-check stato-check-icon",t.appendChild(s),n.classList.remove("open");let c=n.closest(".riga-ordine");c&&c.classList.remove("stato-aperto-ord"),vn(e,o)}async function vn(t,e){try{let o=await ot({azione:"setStatoOrdineFornitori",n_ordine:t,stato:e},8e3,{retries:1});if(!o||o.status!=="ok"){g("Errore salvataggio stato","error");return}zo()}catch{g("Errore connessione","error")}}async function vr(t){if(!confirm(`Archiviare l'ordine ${t}?
Non comparir\xE0 pi\xF9 nella lista principale.`))return;let e=document.querySelector(`.of-ordine-wrapper[data-nordine="${t}"]`);e&&(e.style.opacity="0.4",e.style.pointerEvents="none");try{let o=await ot({azione:"archiviaOrdineFornitori",n_ordine:t},8e3,{retries:1});if(!o||o.status!=="ok"){g("Errore archiviazione","error"),e&&(e.style.opacity="",e.style.pointerEvents="");return}e&&e.remove();let i=document.querySelector(".acquisti-subtitle");if(i){let n=document.querySelectorAll(".of-ordine-wrapper"),a=document.querySelectorAll(".of-ordine-missing").length,r=a>0?` \xB7 <span style="color:#d97706;font-weight:600">\u26A0 ${a} da revisionare</span>`:"";i.innerHTML=`${n.length} ordini${r}`}if(!document.querySelector(".of-ordine-missing")){let n=document.querySelector(".of-review-banner");n&&n.remove()}zo()}catch{g("Errore connessione","error"),e&&(e.style.opacity="",e.style.pointerEvents="")}}function hr(t,e){return t?t.length>e?t.substring(0,e)+"\u2026":t:"-"}function br(t){return!t&&t!==0?"-":Number(t).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2})+" \u20AC"}async function yr(t,e,o=!1){let i=document.getElementById("contenitore-dati");if(i){if(!o){let n=Zt[Y],a=Qt[Y]||0;if(n&&Date.now()-a<3e5){i.innerHTML=n,z(i),window.aggiornaListaFiltrabili?.();return}try{let s=await q.get(Y);if(s&&s.dati){i.innerHTML=s.dati,Zt[Y]=s.dati,Qt[Y]=s.timestamp,z(i),window.aggiornaListaFiltrabili?.(),s.isStale&&wr(e);return}}catch{}let r=pt(Pe,3e5);if(r){i.innerHTML=r,Zt[Y]=r,Qt[Y]=Date.now(),z(i),window.aggiornaListaFiltrabili?.();return}i.innerHTML=`<div class="centered-msg" id="_of-loader">
            <i class="fas fa-spinner fa-spin"></i> Caricamento ordini fornitori\u2026
        </div>`}try{let n=await mn(e);if(window._acquistTabAttivo!=="fornitori")return;let a=fn(n);i.innerHTML=a,z(i),window.aggiornaListaFiltrabili?.(),Zt[Y]=a,Qt[Y]=Date.now(),J(Pe,a),q.set(Y,a).catch(()=>{})}catch(n){if(n&&n.name==="AbortError")return;if(!o){let a=document.getElementById("contenitore-dati");a&&a.querySelector("#_of-loader")&&(a.innerHTML=`<div class="centered-error-bold">Errore nel caricamento.
                    <button onclick="_switchAcquistiTab('fornitori')"
                        style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                        Riprova</button></div>`,z(a))}}}}async function wr(t){try{let e=await mn(t);if(window._acquistTabAttivo!=="fornitori")return;let o=fn(e),i=document.getElementById("contenitore-dati");i&&(i.innerHTML=o,window.aggiornaListaFiltrabili?.()),Zt[Y]=o,Qt[Y]=Date.now(),J(Pe,o),q.set(Y,o).catch(()=>{})}catch{}}function zo(){delete Zt[Y],delete Qt[Y],q.invalidate(Y).catch(()=>{});try{localStorage.removeItem(Pe)}catch{}}function hn(){window._apriDettaglioOF=mr,window._chiudiDettaglioOF=gn,window._setStatoOF=vn,window._selezionaStatoOF=gr,window._toggleStatoDropdownOF=fr,window._archiviaOrdineOF=vr,window.caricaOrdiniFornitori=yr,window.invalidateOFCache=zo,window._ofDropdownListenerAdded||(document.addEventListener("click",function(t){t.target.closest(".of-ordine-wrapper .stato-dropdown")||document.querySelectorAll(".of-ordine-wrapper .stato-dropdown.open").forEach(e=>{e.classList.remove("open");let o=e.closest(".riga-ordine");o&&o.classList.remove("stato-aperto-ord")})},!0),window._ofDropdownListenerAdded=!0)}var Zt,Qt,Y,Pe,un,bn=V(()=>{lt();ve();dt();wt();Tt();ut();Zt={},Qt={},Y="ORDINI_FORNITORI",Pe="_html_ORDINI_FORNITORI",un=[{stato:"IN ATTESA",colore:"#94a3b8"},{stato:"ORDINATO",colore:"#fbbf24"},{stato:"PARZ. EVASO",colore:"#f97316"},{stato:"EVASO",colore:"#22c55e"},{stato:"ANNULLATO",colore:"#ef4444"}]});function ye(){window.cacheContenuti&&delete window.cacheContenuti.STORICO_RICHIESTE,window.cacheFetchTime&&delete window.cacheFetchTime.STORICO_RICHIESTE,U("_html_STORICO_RICHIESTE"),A.rqBundle=null,A.rqPromise=null,q.invalidate("STORICO_RICHIESTE").catch(()=>{})}function wn(){let t=document.getElementById("contenitore-dati");t&&(window.cacheContenuti&&(window.cacheContenuti.STORICO_RICHIESTE=t.innerHTML),window.cacheFetchTime&&(window.cacheFetchTime.STORICO_RICHIESTE=Date.now()),J("_html_STORICO_RICHIESTE",t.innerHTML))}function Sr(t){let e=[`.req-card[data-id-riga="${CSS.escape(String(t))}"]`,`.scad-card[data-id-riga="${CSS.escape(String(t))}"]`,`#box-conferma-${CSS.escape(String(t))}`,`#box-risposta-${CSS.escape(String(t))}`,`#rc-body-${CSS.escape(String(t))}`];for(let o of e){let i=document.querySelector(o),n=i?.classList?.contains("req-card")||i?.classList?.contains("scad-card")?i:i?.closest(".req-card, .scad-card");if(n){let a=n.closest(".req-group");if(a){let r=a.querySelector(".rg-count");if(r){let s=parseInt(r.textContent,10)||0;s<=1?r.remove():r.textContent=s-1}}return n.remove(),!0}}return!1}function _r(){if(!h||!h.nome)return!1;let t=h.nome.toUpperCase();return t==="ALESSIO"||t==="0000"||h.ruolo==="MASTER"}function De(t){let e=document.getElementById("badge-richieste-count"),o=document.getElementById("nome-utente-sidebar"),i=document.getElementById("img-avatar-sidebar");if(!e)return;let n=(h.vistaSimulata||"MASTER").toUpperCase().trim();if(o&&(o.innerText=n),i&&(i.src=`https://ui-avatars.com/api/?name=${n}&background=2563eb&color=fff`),window.paginaAttuale==="STORICO_RICHIESTE"){e.style.display="none",e.classList.remove("badge-sollecito-attivo");return}let a=t.filter(d=>{let p=String(d.RISOLTO).toLowerCase()!=="true";if(n==="MASTER")return p;var f=String(d.A||"").split(",").some(function(u){return u.trim().toUpperCase()===n});return f&&p}),r=a.length,s=a.filter(d=>String(d.SOLLECITO).toLowerCase()==="true").length;r>0?(e.innerText=r,e.style.display="inline-block",s>0?e.classList.add("badge-sollecito-attivo"):e.classList.remove("badge-sollecito-attivo")):(e.style.display="none",e.classList.remove("badge-sollecito-attivo"));let c=document.getElementById("badge-mobile-notif");c&&(r>0&&window.paginaAttuale!=="STORICO_RICHIESTE"?(c.innerText=r,c.style.display="inline-block",c.style.background=s>0?"#f97316":"#ef4444"):c.style.display="none");let l=document.getElementById("badge-bottom-richieste");l&&(r>0&&window.paginaAttuale!=="STORICO_RICHIESTE"?(l.innerText=r,l.style.display="inline-block",s>0?l.classList.add("badge-sollecito-attivo"):l.classList.remove("badge-sollecito-attivo")):(l.style.display="none",l.classList.remove("badge-sollecito-attivo")))}function Er(t,e,o,i){let n=document.getElementById("modalSollecito");n.style.display="flex",n.offsetHeight,n.classList.add("active"),document.getElementById("sollecito-titolo").textContent=i&&i!=="Intero Ordine"?`Sollecita \u2013 ${i}`:`Sollecita \u2013 Ord. ${e}`,document.getElementById("sollecito-id-riga").value=t||"",document.getElementById("sollecito-nord").value=e,document.getElementById("sollecito-cliente").value=o||"",document.getElementById("sollecito-rif").value=i||"",document.getElementById("sollecito-data").value="",document.getElementById("sollecito-note").value=""}function Sn(){let t=document.getElementById("modalSollecito");t.style.display="",t.classList.remove("active")}async function xr(){let t=document.getElementById("sollecito-nord").value,e=document.getElementById("sollecito-id-riga").value,o=document.getElementById("sollecito-cliente").value,i=document.getElementById("sollecito-rif").value,n=document.getElementById("sollecito-data").value,a=document.getElementById("sollecito-note").value.trim();if(!n){g("Seleziona una data di scadenza.","error");return}Sn(),N.pauseFor(6e3),ye();let r={azione:"supporto_multiplo",n_ordine:t,cliente:o,prodotto:i&&i!=="Intero Ordine"?i:"",tipo:"SCADENZA",messaggio:`SCAD:${n}|${a||"\u2013"}`,mittente:h.nome.toUpperCase().trim(),destinatari:["ALESSIO"]};try{await fetch(I,{method:"POST",body:JSON.stringify(r)}),g("\u2705 Scadenza aggiunta"),window.paginaAttuale==="STORICO_RICHIESTE"&&Et()}catch{g("\u2705 Scadenza aggiunta")}}function Ir(t,e,o,i){let n=document.getElementById("modalAiuto");if(n.style.display==="flex")return;n._openedAt=Date.now(),n.style.display="flex",n.offsetHeight,n.classList.add("active"),document.getElementById("modal-titolo").innerText=t?`Messaggio Art. ${e}`:`Messaggio Ordine ${o}`;let a=window.listaOperatori||[];document.getElementById("wrapper-operatori").innerHTML=a.map(s=>`
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${s.email}" data-nome="${ft(s.nome)}">
            <span><b>${ft(s.nome)}</b> <small class="text-muted">(${s.reparto||"Team"})</small></span>
        </label>
    `).join(""),n.dataset.idRiga=t||"",n.dataset.nOrdine=o,n.dataset.cliente=i||"";let r=document.getElementById("modal-ordine-row");r&&(r.style.display="none"),document.getElementById("messaggio-aiuto").value="",Do("DOMANDA")}function _n(t={}){let e=document.getElementById("modalAiuto");if(e.style.display==="flex")return;e._openedAt=Date.now(),e.style.display="flex",e.offsetHeight,e.classList.add("active"),document.getElementById("modal-titolo").innerText="Nuova Richiesta";let o=window.listaOperatori||[];document.getElementById("wrapper-operatori").innerHTML=o.map(n=>`
        <label class="op-label">
            <input type="checkbox" name="destinatario" value="${n.email}" data-nome="${n.nome}">
            <span><b>${n.nome}</b> <small class="text-muted">(${n.reparto||"Team"})</small></span>
        </label>
    `).join(""),e.dataset.idRiga="",e.dataset.nOrdine=t.ordine||"",e.dataset.cliente=t.cliente||"",document.getElementById("messaggio-aiuto").value="",Do("DOMANDA");let i=document.getElementById("modal-ordine-row");if(i){i.style.display="block";let n=document.getElementById("modal-ordine-input");n&&(n.value=t.ordine||"",t.ordine&&(e.dataset.nOrdine=t.ordine,e.dataset.cliente=t.cliente||""),Ar(n))}Me.length===0&&fetch(I,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(n=>n.json()).then(n=>{let a=new Set;Me=n.filter(r=>String(r.archiviato||"").toUpperCase()!=="TRUE").map(r=>({ordine:r.ordine||"",cliente:r.cliente||"",riferimento:r.riferimento||""})).filter(r=>!r.ordine||a.has(r.ordine)?!1:(a.add(r.ordine),!0))}).catch(()=>{})}function Ar(t){t.oninput=function(){let e=this.value.trim().toLowerCase(),o=document.getElementById("ordine-autocomplete");if(!o)return;if(!e){o.style.display="none",o.innerHTML="";return}let i=Me.filter(n=>n.ordine.toLowerCase().includes(e)||n.cliente.toLowerCase().includes(e)).slice(0,8);if(i.length===0){o.style.display="none",o.innerHTML="";return}o.innerHTML=i.map(n=>`
            <div class="autocomplete-item" onmousedown="_selezionaOrdine('${n.ordine.replace(/'/g,"\\'")}','${n.cliente.replace(/'/g,"\\'")}')">  
                <span class="ac-ordine">ORD. ${n.ordine}</span>
                <span class="ac-cliente">${n.cliente}</span>
            </div>
        `).join(""),o.style.display="block"},t.onblur=function(){setTimeout(()=>{let e=document.getElementById("ordine-autocomplete");e&&(e.style.display="none")},200)}}function Or(t,e){let o=document.getElementById("modal-ordine-input");o&&(o.value=t);let i=document.getElementById("ordine-autocomplete");i&&(i.style.display="none",i.innerHTML="");let n=document.getElementById("modalAiuto");n&&(n.dataset.nOrdine=t,n.dataset.cliente=e||"")}function Do(t){let e=t.toUpperCase();document.getElementById("modalAiuto").dataset.tipoAzione=e,document.getElementById("btn-tipo-assegna").classList.toggle("active",e==="ASSEGNAZIONE"),document.getElementById("btn-tipo-domanda").classList.toggle("active",e==="DOMANDA")}function qo(){let t=document.getElementById("modalAiuto");t.style.display="",t.classList.remove("active")}async function Cr(){let t=document.getElementById("modalAiuto");if(t){N.pauseFor(6e3);try{let e=t.dataset.idRiga,o=document.getElementById("modal-ordine-row"),i=document.getElementById("modal-ordine-input"),n=o&&o.style.display!=="none"&&i&&i.value.trim()?i.value.trim():t.dataset.nOrdine,a=document.getElementById("messaggio-aiuto").value,r=t.dataset.tipoAzione,s=document.querySelectorAll('input[name="destinatario"]:checked');if(s.length===0){alert("Per favore, seleziona almeno un operatore.");return}let c=Array.from(s).map(u=>u.getAttribute("data-nome")).join(", "),l=Array.from(s).map(u=>u.getAttribute("data-nome"));document.getElementById("messaggio-aiuto").value="",qo(),g(r==="ASSEGNAZIONE"?"\u2705 Assegnazione inviata":"\u2705 Richiesta inviata"),ye();let d=`${I}?azione=assegnaOperatori&ordine=${encodeURIComponent(n)}&operatori=${encodeURIComponent(c)}&id_riga=${e}&mittente=${encodeURIComponent(h.nome.toUpperCase().trim())}&registra=0`,p=(t.dataset.cliente||"").trim(),f={azione:"supporto_multiplo",n_ordine:n,cliente:p,tipo:r,messaggio:a||(r==="ASSEGNAZIONE"?"Nuova assegnazione":"Nuova domanda"),mittente:h.nome.toUpperCase().trim(),destinatari:l};Promise.all([r==="ASSEGNAZIONE"?fetch(d).catch(()=>g("Errore assegnazione operatore.","error")):Promise.resolve(),fetch(I,{method:"POST",body:JSON.stringify(f)}).catch(()=>g("Errore invio richiesta.","error"))]).then(()=>{window.paginaAttuale==="STORICO_RICHIESTE"?Et().catch(()=>{}):(te().then(u=>De(u.attive)).catch(()=>{}),window.caricaDati?.(window.paginaAttuale).catch(()=>{}))})}catch{g("Errore invio richiesta.","error")}}}function En(t){let e=document.getElementById("box-risposta-"+t),o=document.getElementById("box-conferma-"+t);if(e)if(o&&(o.style.display="none",o.style.opacity="0"),e.style.display==="none"||e.style.display===""){e.style.display="block",setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},10);let i=document.getElementById("input-risposta-"+t);i&&(i.focus(),setTimeout(()=>{e.scrollIntoView({behavior:"smooth",block:"center"})},400))}else e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>{e.style.display="none"},300)}function $r(t){let e=document.getElementById("box-conferma-"+t),o=document.getElementById("box-risposta-"+t);e&&(o&&(o.style.display="none",o.style.opacity="0"),e.style.display==="none"||e.style.display===""?(e.style.display="block",setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},10)):(e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>{e.style.display="none"},300)))}async function Tr(t,e,o,i){try{let n=document.getElementById("input-risposta-"+t),a=n.value.trim();if(!a)return;N.pauseFor(6e3),n.value="",En(t),g("\u2705 Risposta inviata"),ye();let r={azione:"supporto_multiplo",n_ordine:e,cliente:(i||"").trim(),tipo:"RISPOSTA",messaggio:a,mittente:h.nome.toUpperCase().trim(),destinatari:String(o).split(",").map(s=>s.trim().toUpperCase()).filter(Boolean)};fetch(I,{method:"POST",body:JSON.stringify(r)}).then(()=>{window.paginaAttuale==="STORICO_RICHIESTE"&&Et().catch(()=>{})}).catch(()=>g("Errore invio risposta.","error"))}catch{g("Errore invio risposta.","error")}}function xn(t,e){try{localStorage.setItem("_rg_"+t,e.open?"1":"0")}catch{}}function qe(t){let e=String(t??"").trim();if(!e)return 0;let o=e.replace(/\./g,"").replace(",","."),i=Number(o);return Number.isFinite(i)?i:0}function ht(t){return Number.isFinite(t)?Math.abs(t-Math.round(t))<1e-4?String(Math.round(t)):t.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:2}):"0"}function Bo(t){let e=String(t||"").trim().toUpperCase();return["IMBALLATO","SPEDITO","CONSEGNATO","SPEDITO/CONSEGNATO","SPEDITI/CONSEGNATI","ANNULLATO","ANNULLATI"].includes(e)}function Rr(t){document.querySelectorAll(".fabprod-modal-overlay").forEach(e=>e.remove()),window.cambiaPagina?.("PROGRAMMA PRODUZIONE DEL MESE",null),setTimeout(()=>{["universal-search","mobile-search"].forEach(e=>{let o=document.getElementById(e);o&&(o.value=t,o.dispatchEvent(new Event("input")))}),typeof window.filtraUniversale=="function"&&window.filtraUniversale()},420)}function kr(t,e){document.getElementById("fabprod-modal-ordine")?.remove();let o=e?` \xB7 ${e}`:"",i=t.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),n=document.createElement("div");n.id="fabprod-modal-ordine",n.className="fabprod-modal-overlay",n.innerHTML=`
        <div class="fabprod-modal-box">
            <div class="fabprod-modal-title"><i class="fas fa-box-open"></i> Vai all'ordine?</div>
            <div class="fabprod-modal-body">ORD. <strong>${t}</strong>${o?`<span class="fabprod-modal-sub">${o}</span>`:""}</div>
            <div class="fabprod-modal-btns">
                <button class="fabprod-btn-cancel" onclick="document.getElementById('fabprod-modal-ordine').remove()">Annulla</button>
                <button class="fabprod-btn-confirm" onclick="_fabprodVaiOrdine('${i}')">Vai <i class='fas fa-arrow-right'></i></button>
            </div>
        </div>`,n.addEventListener("click",a=>{a.target===n&&n.remove()}),document.body.appendChild(n)}function In(t){let e=window._fabprodCurrentRows;if(!e||!e[t])return;let o=e[t];document.getElementById("fabprod-modal-articolo")?.remove();let i=o.ordini.map(a=>{let r=a.ordine.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),s=(a.cliente||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'");return`<span class="fabprod-order-pill fabprod-order-pill--click" onclick="document.getElementById('fabprod-modal-articolo').remove();_fabprodApriModalOrdine('${r}','${s}')">ORD. ${a.ordine}${a.cliente?`<span class="fabprod-pill-cliente"> \xB7 ${a.cliente}</span>`:""}</span>`}).join(""),n=document.createElement("div");n.id="fabprod-modal-articolo",n.className="fabprod-modal-overlay",n.innerHTML=`
        <div class="fabprod-modal-box fabprod-modal-box--art">
            <button class="fabprod-modal-close" onclick="document.getElementById('fabprod-modal-articolo').remove()"><i class="fas fa-times"></i></button>
            ${o.codice?`<div class="fabprod-modal-art-code">${o.codice}</div>`:""}
            <div class="fabprod-modal-art-name">${o.prodotto}</div>
            <div class="fabprod-modal-art-qty">${ht(o.qty)} pz totali richiesti</div>
            <div class="fabprod-modal-art-orders">${i||'<span style="color:#94a3b8;font-size:0.8rem">Nessun ordine</span>'}</div>
        </div>`,n.addEventListener("click",a=>{a.target===n&&n.remove()}),document.body.appendChild(n)}function Lr(t){window.innerWidth<=768&&In(t)}function Q(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function An(){if(Array.isArray(Xt))return Xt.map(o=>{let i=Number(o.qtyTotale??o.qty??0)||0,n=Array.isArray(o.ordini)?o.ordini:[];return{codice:String(o.codice||"").trim(),prodotto:String(o.prodotto||"").trim(),ordini:n,qtyTotale:i,formulaQty:String(o.formulaQty||ht(i))}});let t=new Map;for(let o of Ne||[]){if(!o||!o.ordine||String(o.archiviato||"").toUpperCase()==="TRUE"||Bo(o.stato))continue;let i=String(o.ordine||"").trim();if(!i||!W.has(i))continue;let n=qe(o.qty),a=qe(o.qty_evasa),r=Math.max(n-a,0);if(r<=0)continue;let s=String(o.prodotto||"").trim();if(!s)continue;let c=String(o.codice||"").trim(),l=String(o.descrizione||o.dettaglio||o.riferimento||o.rif_articolo||o.note||"").trim(),d=`${c.toUpperCase()}|${s.toUpperCase()}`;t.has(d)||t.set(d,{codice:c,prodotto:s,descrizione:l,qtyTotale:0,ordiniMap:new Map});let p=t.get(d);p.qtyTotale+=r,!p.descrizione&&l&&(p.descrizione=l);let f=String(o.cliente||"").trim();p.ordiniMap.has(i)||p.ordiniMap.set(i,{ordine:i,cliente:f,qty:0}),p.ordiniMap.get(i).qty+=r}let e=[...t.values()].map(o=>{let i=[...o.ordiniMap.values()].sort((r,s)=>r.ordine.localeCompare(s.ordine,"it",{numeric:!0,sensitivity:"base"})),n=i.map(r=>ht(r.qty)),a=i.length>1?`${n.join(" + ")} = ${ht(o.qtyTotale)}`:ht(o.qtyTotale);return{codice:o.codice,prodotto:o.prodotto,ordini:i,qtyTotale:o.qtyTotale,formulaQty:a}});return e.sort((o,i)=>{let n=o.prodotto.localeCompare(i.prodotto,"it",{sensitivity:"base"});return n!==0?n:(o.codice||"").localeCompare(i.codice||"","it",{sensitivity:"base"})}),e}function Ue(){Xt=null,Kt=""}function Pr(t){let e=(t||[]).reduce((o,i)=>o+(Number(i.qtyTotale||0)||0),0);return{titolo:"Fabbisogno Produzione",generatedAt:Date.now(),generatedBy:String(h?.nome||"Sistema"),righe:Array.isArray(t)?t.length:0,totaleQty:e}}function zr(t){let e=t&&t.distinta;if(!e||!Array.isArray(e.sezioni))return;let o=[];for(let i of e.sezioni)for(let n of i.righe||[]){let a=Number(n.totale||0),r=Number(n.disponibile||0);r<a&&o.push({nome:String(n.nome||"").trim(),delta:Math.max(0,a-r)})}yn={ts:Date.now(),kitNome:String(t.kitNome||"").trim(),documento:String(t.documento||"").trim(),righe:Number(e.totaleRighe||0),deficits:o},window._kitFabbisognoSummary=yn,window.paginaAttuale==="STORICO_RICHIESTE"&&Dt()}function Mr(t){let e=new Date,o=[...W].sort((r,s)=>r.localeCompare(s,"it",{numeric:!0,sensitivity:"base"})),i=o.length<=6?o.join(", "):`${o.slice(0,6).join(", ")} +${o.length-6}`,n=t.reduce((r,s)=>r+(Number(s.qtyTotale)||0),0),a=t.map(r=>`
        <tr>
            <td>${Q(r.codice||"-")}</td>
            <td>${Q(r.prodotto)}</td>
            <td>${r.ordini.map(s=>`ORD. ${Q(s.ordine)}${s.cliente?` \xB7 ${Q(s.cliente)}`:""}`).join("<br>")}</td>
            <td class="qty">${Q(r.formulaQty)}</td>
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
                <div class="meta-card"><div class="meta-k">Data emissione</div><div class="meta-v">${Q(e.toLocaleString("it-IT"))}</div></div>
                <div class="meta-card"><div class="meta-k">Ordini selezionati</div><div class="meta-v">${Q(String(o.length))}</div></div>
                <div class="meta-card"><div class="meta-k">Totale quantit\xE0</div><div class="meta-v">${Q(ht(n))} pz</div></div>
            </div>
            <div class="orders"><strong>Fabbisogno per ordini:</strong> ${Q(i)}</div>
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
            <div class="footer">Generato da PROD - ${Q(String(h?.nome||"Sistema"))}</div>
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
</html>`}function Nr(){let t=An();if(!t.length){g("Nessuna riga utile da stampare per il fabbisogno corrente.","warning");return}let e=window.open("","_blank");if(!e){g("Popup bloccato: abilita l'anteprima di stampa.","warning");return}e.document.open(),e.document.write(Mr(t)),e.document.close(),e.focus()}async function Dr(){let t=An();if(!t.length){g("Nessuna riga utile da salvare nel fabbisogno.","warning");return}let e=[...W].sort((i,n)=>i.localeCompare(n,"it",{numeric:!0,sensitivity:"base"})),o={id:Kt||void 0,ordini:e,rows:t,meta:Pr(t)};try{let i=await yt({azione:"saveFabbisogno",payload:o});if(i?.status!=="ok")throw new Error(i?.message||"saveFabbisogno failed");Kt=String(i.id||Kt||""),g("Fabbisogno salvato su Sheets.","success")}catch(i){console.error("[richieste] saveFabbisogno error:",i),g("Errore salvataggio fabbisogno.","error")}}function ze(t){return t.length?t.map(function(e){let o=Array.isArray(e.ordini)?e.ordini:[],i=o.length?o.slice(0,4).join(", ")+(o.length>4?" ...":""):"Ordini non specificati",n=e.updatedAt?new Date(e.updatedAt).toLocaleString("it-IT"):"-",a=Number(e.rowsCount||0)||0,s=String(e.status||"ACTIVE").toUpperCase()==="ARCHIVED"?"Archiviato":"Attivo",c=Q(e.id||"");return`
            <div class="fabprod-sel-item fabprod-sel-item--checked" style="display:block;cursor:default">
                <div class="fabprod-sel-item-info" style="gap:4px">
                    <span class="fabprod-sel-ord">${c||"SNAP"}</span>
                    <span class="fabprod-sel-cli">Stato: ${Q(s)} \xB7 Aggiornato: ${Q(n)} \xB7 Righe: ${a}</span>
                    <span class="fabprod-sel-cli">Ordini: ${Q(i)}</span>
                    <span class="fabprod-sel-cli">Autore: ${Q(e.updatedBy||e.createdBy||"-")}</span>
                </div>
                <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px">
                    <button type="button" class="fabprod-print-btn" onclick="_fabprodApriSnapshotById('${c}')"><i class="fas fa-folder-open"></i> Apri</button>
                    <button type="button" class="fabprod-sel-btn" onclick="_fabprodArchiviaSnapshotById('${c}')"><i class="fas fa-box-archive"></i> Archivia</button>
                </div>
            </div>`}).join(""):'<div class="empty-msg" style="margin:16px 0">Nessun fabbisogno disponibile.</div>'}async function qr(){document.getElementById("fabprod-archivio-modal")?.remove();let t=document.createElement("div");t.id="fabprod-archivio-modal",t.className="fabprod-sel-modal-overlay",t.innerHTML=`
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
        </div>`,t.addEventListener("click",function(o){o.target===t&&Uo()}),document.body.appendChild(t),requestAnimationFrame(function(){t.classList.add("fabprod-sel-modal-overlay--in")});let e=document.getElementById("fabprod-archivio-body");try{let o=await yt({azione:"getFabbisogni",includeArchived:!1}),i=Array.isArray(o?.items)?o.items:[];if(i.length){Yt=i,e&&(e.innerHTML=ze(Yt));return}let n=await yt({azione:"getFabbisogni",includeArchived:!0}),a=Array.isArray(n?.items)?n.items:[];if(Yt=a,!e)return;if(!a.length){e.innerHTML=ze([]);return}e.innerHTML=`
            <div class="empty-msg" style="margin:0 0 12px">Nessun snapshot attivo: mostro anche gli archiviati.</div>
            ${ze(a)}
        `}catch(o){console.error("[richieste] getFabbisogni error:",o),e&&(e.innerHTML='<div class="empty-msg" style="margin:16px 0">Errore caricamento fabbisogni.</div>'),g("Errore caricamento fabbisogni.","error")}}function Uo(){document.getElementById("fabprod-archivio-modal")?.remove()}async function Br(t){let e=String(t||"").trim();if(e)try{let o=await yt({azione:"getFabbisognoById",id:e});if(o?.status!=="ok"||!o?.item)throw new Error(o?.message||"Snapshot non trovato");let i=o.item;Kt=String(i.id||e),Xt=Array.isArray(i.rows)?i.rows.map(function(n){return{codice:String(n?.codice||"").trim(),prodotto:String(n?.prodotto||"").trim(),qty:Number(n?.qtyTotale??n?.qty??0)||0,formulaQty:String(n?.formulaQty||""),ordini:Array.isArray(n?.ordini)?n.ordini:[]}}):[],W=new Set(Array.isArray(i.ordini)?i.ordini.map(function(n){return String(n||"").trim()}).filter(Boolean):[]),Uo(),Dt(),Ho(),g("Snapshot fabbisogno caricato.","success")}catch(o){console.error("[richieste] getFabbisognoById error:",o),g("Errore apertura snapshot fabbisogno.","error")}}async function Ur(t){let e=String(t||"").trim();if(!(!e||!await et("Archiviare questo fabbisogno condiviso?",{title:"Archivia snapshot",confirmText:"Archivia",cancelText:"Annulla",confirmType:"danger"})))try{let i=await yt({azione:"archiveFabbisogno",id:e});if(i?.status!=="ok")throw new Error(i?.message||"Archiviazione non riuscita");Yt=Yt.filter(function(a){return String(a.id||"")!==e});let n=document.getElementById("fabprod-archivio-body");n&&(n.innerHTML=ze(Yt)),Kt===e&&Ue(),Dt(),g("Snapshot archiviato.","success")}catch(i){console.error("[richieste] archiveFabbisogno error:",i),g("Errore archiviazione snapshot.","error")}}function Dt(){let t=document.getElementById("fabprod-list"),e=document.getElementById("fabprod-sel-badge"),o=document.getElementById("fabprod-cnt-badge");if(!t)return;let i=Array.isArray(Xt)?Xt:Cn(Ne.filter(s=>!s||!s.ordine?!1:W.has(String(s.ordine).trim())));i.length?(window._fabprodCurrentRows=i,t.innerHTML=i.map((s,c)=>{let l=s.ordini.map(p=>{let f=p.ordine.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),u=(p.cliente||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'");return`<span class="fabprod-order-pill fabprod-order-pill--click" onclick="event.stopPropagation();_fabprodApriModalOrdine('${f}','${u}')">ORD. ${p.ordine}${p.cliente?`<span class="fabprod-pill-cliente"> \xB7 ${p.cliente}</span>`:""}</span>`}).join(""),d=s.ordini.length>1?`<div class="fabprod-qty-breakdown">${s.ordini.map(p=>`${ht(p.qty)}\xA0(${p.ordine})`).join(" + ")}</div>`:"";return`<div class="fabprod-card" onclick="_fabprodCardClick(${c})">
                <div class="fabprod-top">
                    <div class="fabprod-name">${s.codice?`<span class="fabprod-code">${s.codice}</span>`:""}${s.prodotto}</div>
                    <span class="fabprod-qty">${ht(s.qty)} pz</span>
                </div>
                ${d}
                <div class="fabprod-orders">${l}</div>
            </div>`}).join("")):t.innerHTML=W.size===0?'<div class="fabprod-empty-sel"><i class="fas fa-hand-pointer fabprod-empty-sel-icon"></i><div class="fabprod-empty-sel-text">Seleziona gli ordini per vedere il fabbisogno</div></div>':'<div class="empty-msg" style="margin:16px 0 8px">Nessun articolo attivo per gli ordini selezionati.</div>';let n=W.size;e&&(e.textContent=n,e.style.display=n>0?"":"none"),o&&(o.textContent=i.length,o.style.display=i.length>0?"":"none");let a=document.getElementById("fabprod-print-btn");a&&(a.disabled=i.length===0);let r=document.getElementById("fabprod-save-btn");r&&(r.disabled=i.length===0)}function Fr(){document.getElementById("fabprod-sel-modal")?.remove();let t=n=>{let a=(n||"").trim().toLowerCase(),r=a?Nt.filter(s=>s.ordine.toLowerCase().includes(a)||(s.cliente||"").toLowerCase().includes(a)):Nt;return!r.length&&!Nt.length?'<div class="empty-msg" style="margin:16px 0">Nessun ordine attivo disponibile.</div>':r.length?r.map(s=>{let c=W.has(s.ordine)?" checked":"",l=s.ordine.replace(/"/g,"&quot;");return`<label class="fabprod-sel-item${c?" fabprod-sel-item--checked":""}">
                <input type="checkbox" class="fabprod-sel-chk" value="${l}"${c}>
                <div class="fabprod-sel-item-info">
                    <span class="fabprod-sel-ord">ORD. ${s.ordine}</span>
                    ${s.cliente?`<span class="fabprod-sel-cli">${s.cliente}</span>`:""}
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
        </div>`,e.addEventListener("change",n=>{if(!n.target.classList.contains("fabprod-sel-chk"))return;n.target.closest(".fabprod-sel-item")?.classList.toggle("fabprod-sel-item--checked",n.target.checked);let a=e.querySelectorAll(".fabprod-sel-chk:checked").length,r=e.querySelector("#fabprod-sel-apply");r&&(r.textContent=a>0?`Applica (${a})`:"Applica")}),e.addEventListener("input",n=>{if(n.target.id!=="fabprod-sel-search")return;e.querySelectorAll(".fabprod-sel-chk").forEach(c=>{c.checked?W.add(c.value):W.delete(c.value)});let a=e.querySelector("#fabprod-sel-modal-body");a&&(a.innerHTML=t(n.target.value));let r=W.size,s=e.querySelector("#fabprod-sel-apply");s&&(s.textContent=r>0?`Applica (${r})`:"Applica")});let o=W.size,i=e.querySelector("#fabprod-sel-apply");i&&o>0&&(i.textContent=`Applica (${o})`),e.addEventListener("click",n=>{n.target===e&&Fo()}),document.body.appendChild(e),requestAnimationFrame(()=>{e.classList.add("fabprod-sel-modal-overlay--in"),e.querySelector("#fabprod-sel-search")?.focus()})}function Hr(){let t=document.getElementById("fabprod-sel-modal");t&&(W=new Set([...t.querySelectorAll(".fabprod-sel-chk:checked")].map(e=>e.value)),Ue(),Fo(),Dt())}function Fo(){document.getElementById("fabprod-sel-modal")?.remove()}function Ho(){let t=document.getElementById("rg-fabbisogno-produzione");t&&(t.open||(t.open=!0,xn("fabbisogno_produzione",t)),t.scrollIntoView({behavior:"smooth",block:"start"}))}function On(t){let e=[...document.querySelectorAll(".scad-card[data-ordine]")];if(!e.length)return[];let o=new Set((Nt||[]).map(n=>String(n.ordine||"").trim())),i=[];return e.forEach(n=>{let a=n.querySelector(".scad-fab-chk");if(t&&!a?.checked)return;let r=String(n.dataset.ordine||"").trim();!r||!o.has(r)||i.push(r)}),[...new Set(i)].sort((n,a)=>n.localeCompare(a,"it",{numeric:!0,sensitivity:"base"}))}function jr(){let t=On(!1);if(!t.length){g("Nessuna scadenza utile trovata per creare il fabbisogno.","warning");return}W=new Set(t),Ue(),Dt(),Ho(),g(`Fabbisogno impostato su ${t.length} ordini da scadenze.`,"success")}function Gr(){let t=On(!0);if(!t.length){g("Flagga almeno una scadenza per creare il fabbisogno.","warning");return}W=new Set(t),Ue(),Dt(),Ho(),g(`Fabbisogno impostato su ${t.length} ordini selezionati.`,"success")}function Cn(t){let e=new Map;return(t||[]).forEach(o=>{if(!o||String(o.archiviato||"").toUpperCase()==="TRUE"||Bo(o.stato))return;let i=String(o.prodotto||"").trim();if(!i)return;let n=qe(o.qty),a=qe(o.qty_evasa),r=Math.max(n-a,0);if(r<=0)return;let s=i.toLocaleUpperCase("it-IT");e.has(s)||e.set(s,{prodotto:i,codice:String(o.codice||"").trim(),qty:0,ordini:new Map});let c=e.get(s);if(!c.codice&&o.codice&&(c.codice=String(o.codice).trim()),c.qty+=r,o.ordine){let l=String(o.ordine).trim(),d=String(o.cliente||"").trim();c.ordini.has(l)||c.ordini.set(l,{cliente:d,qty:0}),c.ordini.get(l).qty+=r}}),Array.from(e.values()).map(o=>({prodotto:o.prodotto,codice:o.codice,qty:o.qty,ordini:Array.from(o.ordini.entries()).map(([i,{cliente:n,qty:a}])=>({ordine:i,cliente:n,qty:a})).sort((i,n)=>i.ordine.localeCompare(n.ordine,"it"))})).sort((o,i)=>(o.codice||"").localeCompare(i.codice||"","it",{sensitivity:"base"}))}async function Vr(){let t=window._attiviProd;if(Array.isArray(t)&&t.length)return t;let e=null;if(A.dashBundle)e=A.dashBundle,A.dashBundle=null,A.dashPromise=null;else if(A.dashPromise)e=await A.dashPromise,A.dashBundle=null,A.dashPromise=null;else{let o=await fetch(I,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!1})});if(!o.ok)throw new Error(`HTTP ${o.status}`);e=await o.json()}return e&&e.produzione||[]}async function te(t=null){async function e(){if(A.rqBundle){let r=A.rqBundle;return A.rqBundle=null,A.rqPromise=null,r}if(A.rqPromise){let r=await A.rqPromise;return A.rqBundle=null,A.rqPromise=null,r}let a=await fetch(I,{method:"POST",body:JSON.stringify({azione:"getAllRichieste"}),...t?{signal:t}:{}});if(!a.ok)throw new Error(`HTTP ${a.status}`);return a.json()}let[o,i]=await Promise.all([e(),Vr().catch(a=>(console.warn("Fabbisogno Produzione non disponibile:",a),[]))]);if(!o)throw new Error("bundle vuoto");let n=Cn(i);return{attive:o.attive||[],archivio:o.archivio||[],fabbisogno:n,fabbisognoRaw:i}}async function Et(t=null,e=null){let o=document.getElementById("contenitore-dati");if(!o)return;o.innerHTML="<div class='centered-msg' id='_ric-loader'>Caricamento messaggi in corso...</div>";let i=setTimeout(()=>{let n=document.getElementById("_ric-loader");n&&(n.innerHTML=`\u26A0\uFE0F Connessione lenta o server non raggiungibile.<br>
            <button onclick="cambiaPagina('STORICO_RICHIESTE', null)"
                style="margin-top:12px;padding:8px 20px;background:#242424;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`)},12e3);try{let n=await te(e);if(clearTimeout(i),De(n.attive),t!==null&&t!==window._latestNavRequest)return;window.aggiornaBadgeNotifiche?.(n.attive),we(n)}catch(n){if(clearTimeout(i),n.name==="AbortError")return;console.error("Errore caricamento richieste:",n),o.innerHTML=`<div class='centered-error-bold'>Errore nel caricamento. <button onclick="cambiaPagina('STORICO_RICHIESTE',null)" style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">Riprova</button></div>`,z(o)}}function we(t){if(window.paginaAttuale!=="STORICO_RICHIESTE")return;let e=document.getElementById("contenitore-dati");if(!e)return;let o=t.attive||[],i=t.archivio||[],n=t.fabbisogno||[];Ne=t.fabbisognoRaw||[],W=new Set;{let P=new Set;Nt=[];for(let _ of Ne){if(!_||!_.ordine||String(_.archiviato||"").toUpperCase()==="TRUE"||Bo(_.stato))continue;let T=String(_.ordine).trim();!T||P.has(T)||(P.add(T),Nt.push({ordine:T,cliente:String(_.cliente||"").trim()}))}Nt.sort((_,T)=>_.ordine.localeCompare(T.ordine,"it"))}let a=(h?.nome||"").toUpperCase().trim(),r=P=>{let _={};return P.forEach(T=>{_[T.ORDINE]||(_[T.ORDINE]=[]),_[T.ORDINE].push(T)}),_},s=r(o),c=r(i),l=(()=>{if(_r())return()=>!0;let P=ft(h?.nome||"").toUpperCase();return _=>_.some(T=>{if(ft(T.DA||"").toUpperCase()===P)return!0;var L=String(T.A||"");return L.split(",").some(function(M){return ft(M.trim()).toUpperCase()===P})})})(),d=P=>{let _={};return Object.keys(P).forEach(T=>{l(P[T])&&(_[T]=P[T])}),_},p=d(s),f=d(c),u={},m={},b={};Object.keys(p).forEach(P=>{let _=p[P],T=_.filter(M=>(M.TIPO||"").toUpperCase()==="SCADENZA"),L=_.filter(M=>(M.TIPO||"").toUpperCase()!=="SCADENZA");L.length>0&&((L[0].TIPO||"MSG").toUpperCase()==="ASSEGNAZIONE"?u[P]=L:m[P]=L),T.length>0&&(b[P+"_scad"]=T)});let w=localStorage.getItem("_rg_assegnazioni")!=="0",v=localStorage.getItem("_rg_richieste")!=="0",x=localStorage.getItem("_rg_scadenze")!=="0",O=localStorage.getItem("_rg_fabbisogno_produzione")!=="0",E=Object.keys(u).length,$=Object.keys(m).length,k=Object.values(b).reduce((P,_)=>P+_.length,0),R=n.length,C=(P,_)=>{let T="";return Object.keys(P).reverse().forEach(L=>{T+=Mo(P[L],_,!1)}),T||'<div class="empty-msg" style="margin:16px 0 8px">Nessun elemento.</div>'},D=()=>{let P=Object.values(b).flat();return P.sort((_,T)=>{let L=No(_),M=No(T);return!L&&!M?0:L?M?L-M:-1:1}),P.map(_=>Rn(_,a)).join("")||'<div class="empty-msg" style="margin:16px 0 8px">Nessuna scadenza.</div>'},G=P=>!P||!P.length?W.size===0?`<div class="fabprod-empty-sel">
                        <i class="fas fa-hand-pointer fabprod-empty-sel-icon"></i>
                        <div class="fabprod-empty-sel-text">Seleziona gli ordini per vedere il fabbisogno</div>
                    </div>`:'<div class="empty-msg" style="margin:16px 0 8px">Nessun articolo attivo per gli ordini selezionati.</div>':(window._fabprodCurrentRows=P,P.map((_,T)=>{let L=_.ordini.map(B=>{let nt=B.ordine.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),Lt=(B.cliente||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'");return`<span class="fabprod-order-pill fabprod-order-pill--click" onclick="event.stopPropagation();_fabprodApriModalOrdine('${nt}','${Lt}')">ORD. ${B.ordine}${B.cliente?`<span class="fabprod-pill-cliente"> \xB7 ${B.cliente}</span>`:""}</span>`}).join(""),M=_.ordini.length>1?`<div class="fabprod-qty-breakdown">${_.ordini.map(B=>`${ht(B.qty)}\xA0(${B.ordine})`).join(" + ")}</div>`:"";return`
                <div class="fabprod-card" onclick="_fabprodCardClick(${T})">
                    <div class="fabprod-top">
                        <div class="fabprod-name">${_.codice?`<span class="fabprod-code">${_.codice}</span>`:""}${_.prodotto}</div>
                        <span class="fabprod-qty">${ht(_.qty)} pz</span>
                    </div>
                    ${M}
                    <div class="fabprod-orders">${L}</div>
                </div>`}).join("")),ct="";Object.keys(f).length===0?ct='<div class="empty-msg" style="margin:20px 0">Nessuna richiesta archiviata.</div>':Object.keys(f).reverse().forEach(P=>{ct+=Mo(f[P],a,!0)});let tt=`
            <div class="scroll-wrapper">
                <button class="scroll-btn" onclick="_apriArchivio('archivio-req-details')">
                    <i class="fa-solid fa-box-archive"></i> Archivio
                </button>
            </div>

            <div class="req-groups">

                <details id="rg-fabbisogno-produzione" class="req-group" ${O?"open":""}
                         ontoggle="_saveReqGroup('fabbisogno_produzione', this)">
                    <summary class="req-group-summary">
                        <span class="rg-left">
                            <span class="rg-icon rg-icon-fabbisogno"><i class="fas fa-boxes-stacked"></i></span>
                            <span class="rg-title">FABBISOGNO PRODUZIONE</span>
                            <span class="rg-count rg-count-fabb" id="fabprod-cnt-badge" style="${W.size>0&&n.length>0?"":"display:none"}">0</span>
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
                            ${E>0?`<span class="rg-count">${E}</span>`:""}
                        </span>
                        <i class="fas fa-chevron-down rg-chevron"></i>
                    </summary>
                    <div class="chat-inbox">${C(u,a)}</div>
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
                    <div class="chat-inbox">${C(m,a)}</div>
                </details>

                <details id="rg-scadenze" class="req-group" ${x?"open":""}
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
                    <div class="chat-inbox">${D()}</div>
                </details>

            </div>

            <details id="archivio-req-details" class="archivio-details">
                <summary class="separatore-archivio archivio-summary" style="list-style:none">
                    <span>ARCHIVIO</span>
                    <i class="fas fa-chevron-down archivio-chevron"></i>
                </summary>
                <div class="chat-inbox">${ct}</div>
            </details>`;e.innerHTML=tt,window.cacheContenuti&&(window.cacheContenuti.STORICO_RICHIESTE=tt),window.cacheFetchTime&&(window.cacheFetchTime.STORICO_RICHIESTE=Date.now()),J("_html_STORICO_RICHIESTE",tt),q.set("STORICO_RICHIESTE",t).catch(()=>{}),z(e),window.aggiornaListaFiltrabili?.(),window._osservaArchivio?.("archivio-req-details"),["universal-search","mobile-search"].forEach(P=>{let _=document.getElementById(P);_&&(_.value="")})}function Jr(t){h.vistaSimulata=t,t==="MASTER"?h.nome="MASTER":h.nome=t,Et()}function Wr(t){if(!t)return;typeof window._setAssegnaLocalByOrdine=="function"&&window._setAssegnaLocalByOrdine(t,"");let e=document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(t)}"]`);if(e){e.querySelectorAll(".visualizza-operatori").forEach(i=>{i.dataset.assegna="",i.innerHTML='<span class="operatore-libero">Libero</span>'}),e.querySelectorAll(".op-dropdown[data-id-riga]").forEach(i=>{i.dataset.assegna="";let n=i.querySelector(".op-trigger-label");n&&(n.textContent="Libero"),i.querySelectorAll(".op-option").forEach(a=>{a.classList.remove("is-selected"),a.querySelector(".op-check-icon")?.remove()})});let o=e.querySelector(".op-dropdown-ord");if(o){o.dataset.assegnaOrd="";let i=o.querySelector(".op-trigger-label");i&&(i.textContent="Libero"),o.querySelectorAll(".op-option").forEach(n=>{n.classList.remove("is-selected"),n.querySelector(".op-check-icon")?.remove()})}}typeof window._repaintOpColors=="function"&&window._repaintOpColors(),typeof window._refreshOverview=="function"&&window._refreshOverview()}async function Zr(t){try{let e=(h?.nome||"").toUpperCase().trim();await fetch(I,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:t,operatori:"",mittente:e})})}catch(e){console.warn("[_sincronizzaCancellaAssegna] Errore:",e)}}async function $n(t,e,o){let i=document.getElementById("contenitore-dati"),n=i?i.innerHTML:"",a=e==="risolto",r=null;if(a){let s=document.querySelector(`.req-card[data-id-riga="${CSS.escape(String(t))}"]`);if(s){let c=s.closest(".req-group");c&&c.id==="rg-assegnazioni"&&(r=s.dataset.ordine||null)}}try{let s={azione:"aggiorna_richiesta_stato",tipo:e,mittente:h?.nome?.toUpperCase().trim()||"SISTEMA"};e==="risolto"&&o&&o.length>1?s.id_righe=o:s.id_riga=t,a&&(N.pauseFor(2e4),Sr(t),wn(),r&&Wr(r));let l=await(await fetch(I,{method:"POST",body:JSON.stringify(s)})).json();if(l&&l.status==="auth_error"){window._gestisciAuthError_?.(l.message);return}if(!l||l.status!=="success"&&l.status!=="ok")throw new Error("Aggiornamento non salvato");ye(),a||Et(),r&&Zr(r)}catch{a&&i&&n&&(i.innerHTML=n,wn()),g("Errore aggiornamento.","error")}}function Qr(t){et("Sollecita Richiesta","Inviare un sollecito per questa richiesta?",()=>Tn(t),"Sollecita")}function Kr(t,e){et("Archivia Richiesta","Archiviare definitivamente questa discussione?",()=>$n(t,"risolto",e),"Archivia")}async function Tn(t){try{(await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"aggiorna_richiesta_stato",id_riga:t,tipo:"sollecita"})})).json()).status==="success"&&(ye(),g("Sollecito inviato!"),Et())}catch{g("Errore durante il sollecito.","error")}}function Be(t){if(!t)return"N.D.";let e;if(!isNaN(t)&&typeof t!="string")e=new Date(Number(t));else if(e=new Date(t),isNaN(e.getTime())){let s=String(t).match(/(\d{2})[/-](\d{2})[/-](\d{4})/);if(s){let[,c,l,d]=s,p=String(t).match(/(\d{2})[:.](\d{2})/),f=p?p[1]:"00",u=p?p[2]:"00";e=new Date(`${d}-${l}-${c}T${f}:${u}:00`)}}if(!e||isNaN(e.getTime()))return t;let o=String(e.getDate()).padStart(2,"0"),i=String(e.getMonth()+1).padStart(2,"0"),n=e.getFullYear(),a=String(e.getHours()).padStart(2,"0"),r=String(e.getMinutes()).padStart(2,"0");return`${o}/${i}/${n} ${a}:${r}`}function Mo(t,e,o){let i=t[t.length-1],n=t[0],a=n.ORDINE||i.ORDINE,r=n.CLIENTE||i.CLIENTE||((Me||[]).find(b=>b.ordine===a)||{}).cliente||"",s=t.some(b=>String(b.SOLLECITO).toLowerCase()==="true"),c=ft(n.DA)||"\u2013",l=[...new Set(t.flatMap(b=>String(b.A||"").split(",").map(w=>ft(w.trim())).filter(Boolean)))],d=l.length>1?l.map(b=>`<span class="rc-val rc-val-a">${b}</span>`).join('<span style="color:#cbd5e1;margin:0 1px">,</span> '):`<span class="rc-val rc-val-a">${l[0]||"\u2013"}</span>`,p=(n.TIPO||"MSG").toUpperCase(),f=t.map(b=>b.id_riga).join(","),u=p==="ASSEGNAZIONE",m=u?'<span class="rc-tipo rc-tipo-assegna" title="Assegnazione"><i class="fas fa-arrow-right"></i></span>':'<span class="rc-tipo rc-tipo-domanda" title="Richiesta"><i class="fas fa-question"></i></span>';return`
        <div class="req-card${o?" archiviata":""}${s?" sollecitata":""}" data-id-riga="${String(i.id_riga||"")}" data-ordine="${String(a||"")}" data-cliente="${(r||"").toLowerCase().replace(/"/g,"")}" data-riferimento="${(i.RIFERIMENTO||"").toLowerCase().replace(/"/g,"")}">

            <div class="rc-top">
                <div class="rc-ordine-wrap">
                    ${m}
                    <span class="rc-ordine">ORD. ${a}</span>
                </div>
                ${s?'<span class="badge-sollecito badge-sollecito-sm"><i class="fa-solid fa-bullhorn"></i></span>':""}
                ${o?'<span class="rc-arch-badge">\u2713</span>':""}
            </div>

            <div class="rc-cliente">${r||'<span class="rc-no-val">\u2013</span>'}</div>

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
                <span class="rc-date">${Be(i["DATA ORA"])}</span>
                ${u?"":`<span class="rc-msgcount">${t.length} <i class="fa-regular fa-comment"></i></span>`}
            </div>

            ${u?"":`
            <button class="rc-expand-btn" onclick="_toggleRcBody('${i.id_riga}', this)" title="Mostra/nascondi messaggi">
                <i class="fa-solid fa-chevron-down"></i>
                <span>${t.length===1?"1 messaggio":t.length+" messaggi"}</span>
            </button>

            <div id="rc-body-${i.id_riga}" class="rc-body">
                ${t.map(b=>{let w=String(b.DA).toUpperCase().trim()===e,v=String(b.MESSAGGIO||"").includes("|")?b.MESSAGGIO.split("|")[1]:b.MESSAGGIO,x=b["DATA ORA"]?Be(b["DATA ORA"]):"";return`
                        <div class="chat-bubble-wrapper ${w?"sent":"received"}">
                            <div class="chat-bubble">
                                <div class="chat-bubble-name">${ft(b.DA)}</div>
                                <div class="chat-bubble-text">${v}</div>
                                ${x?`<span class="chat-bubble-time">${x}</span>`:""}
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
                            <span class="reply-hint"><i class="fa-regular fa-paper-plane"></i> Risposta a <b>${ft(n.DA).toUpperCase()===e?l.join(", "):ft(n.DA)}</b></span>
                            <button onclick="inviaRisposta('${i.id_riga}', '${a}', '${n.DA.toUpperCase().trim()===e?String(n.A||"").trim():n.DA}', '${r.replace(/'/g,"\\'")}')" class="btn-reply-send">
                                <i class="fa-solid fa-paper-plane"></i> Invia
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rc-actions">
                    <button onclick="_archiviaConferma('${i.id_riga}', ${JSON.stringify(t.map(b=>b.id_riga))})" class="rc-btn rc-btn-arch" title="Archivia"><i class="fa-solid fa-check"></i></button>
                    <button onclick="_sollecitaConferma('${i.id_riga}')" class="rc-btn rc-btn-soll" title="Sollecita"><i class="fa-solid fa-bullhorn"></i></button>
                    <button onclick="toggleAreaRisposta('${i.id_riga}')" class="rc-btn rc-btn-reply" title="Rispondi"><i class="fa-solid fa-reply"></i></button>
                    <button onclick="apriModalSollecito('${i.id_riga}', '${a}', '${r.replace(/'/g,"\\'")}', '${(i.RIFERIMENTO||"").replace(/'/g,"\\'")}');" class="rc-btn rc-btn-scad" title="Aggiungi scadenza"><i class="fa-solid fa-clock"></i></button>
                </div>`}
        </div>`}function Yr(t,e){let o=document.getElementById("rc-body-"+t);if(!o)return;let i=o.classList.toggle("open");e&&e.classList.toggle("open",i)}function No(t){let e=String(t.MESSAGGIO||"").split("|");if(e.length>=2){let o=e[1]||"";if(o.startsWith("SCAD:")){let i=new Date(o.slice(5));if(!isNaN(i))return i}}return null}function Rn(t,e){let o=String(t.MESSAGGIO||"").split("|"),i=null,n="\u2013";if(o.length>=2){let f=o[1]||"";f.startsWith("SCAD:")&&(i=new Date(f.slice(5)),isNaN(i)&&(i=null)),n=o.slice(2).join("|").trim()||"\u2013"}let a=t.ORDINE||"\u2013",r=t.CLIENTE||"",s=t.PRODOTTO&&t.PRODOTTO!==""?t.PRODOTTO:"",c=ft(t.DA||""),l=t["DATA ORA"]||"",d="scad-ok",p="\u2013";if(i){let f=Math.ceil((i-new Date)/864e5);p=i.toLocaleDateString("it-IT",{day:"2-digit",month:"short",year:"numeric"}),f<0?d="scad-scaduta":f<=3?d="scad-urgente":f<=7?d="scad-vicina":d="scad-ok"}return`
    <div class="scad-card ${d}" data-id-riga="${String(t.id_riga||"")}" data-ordine="${Q(a)}" data-cliente="${r.toLowerCase().replace(/"/g,"")}">
        <div class="scad-top">
            <div class="scad-ordine-wrap">
                <span class="rc-tipo rc-tipo-scadenza" title="Scadenza"><i class="fa-solid fa-clock"></i></span>
                <span class="rc-ordine">ORD.&nbsp;${a}</span>
                ${s?`<span class="scad-art">&bull; <b>${s}</b></span>`:'<span class="scad-art scad-int-ord">intero ordine</span>'}
            </div>
            <span class="scad-date-badge ${d}">${p}</span>
        </div>
        ${r?`<div class="rc-cliente">${r}</div>`:""}
        <div class="scad-nota">${n!=="\u2013"?n:'<span class="scad-no-nota">Nessuna nota</span>'}</div>
        <div class="rc-foot">
            <span class="rc-lbl">Da</span>
            <span class="rc-val">${c}</span>
            <span class="rc-date" style="margin-left:auto">${Be(l)}</span>
        </div>
        <div class="rc-actions">
            <label class="scad-fab-pick" onclick="event.stopPropagation()" title="Seleziona questa scadenza per il fabbisogno">
                <input type="checkbox" class="scad-fab-chk" value="${Q(a)}">
                <span>Fabbisogno</span>
            </label>
            <button onclick="aggiornaRichiesta('${t.id_riga}', 'risolto')" class="rc-btn rc-btn-arch" title="Archivia scadenza"><i class="fa-solid fa-check"></i></button>
        </div>
    </div>`}function kn(){window.chiudiModal=qo,window.confermaInvioSupporto=Cr,window.setTipoAzione=Do,window.chiudiModalSollecito=Sn,window.confermaInvioSollecito=xr,window.apriNuovaRichiesta=_n,window.apriModalAiuto=Ir,window.apriModalSollecito=Er,window.toggleAreaRisposta=En,window.toggleBoxArchivia=$r,window.inviaRisposta=Tr,window._selezionaOrdine=Or,window.aggiornaBadgeRichieste=De,window.aggiornaBadgeSidebar=De,window.caricaRichieste=Et,window._fetchDatiRichieste=te,window._renderDatiRichieste=we,window._saveReqGroup=xn,window._fabprodCardClick=Lr,window._fabprodApriModalOrdine=kr,window._fabprodApriModalArticolo=In,window._fabprodVaiOrdine=Rr,window._aggiornaPannelloFabbisogno=Dt,window._apriModalFabbisognoSel=Fr,window._applicaSelFabbisogno=Hr,window._chiudiModalFabbisognoSel=Fo,window._fabprodDaScadenzeTutte=jr,window._fabprodDaScadenzeFlaggate=Gr,window._fabprodStampaFabbisognoSel=Nr,window._fabprodSalvaSnapshotCondiviso=Dr,window._fabprodApriArchivioSnapshot=qr,window._fabprodChiudiArchivioSnapshot=Uo,window._fabprodApriSnapshotById=Br,window._fabprodArchiviaSnapshotById=Ur,window._notificaFabbisognoNuovo=zr,window.aggiornaRichiesta=$n,window._sollecitaConferma=Qr,window._archiviaConferma=Kr,window.sollecitaRichiesta=Tn,window.cambiaVistaUtente=Jr,window._toggleRcBody=Yr,window.formattaData=Be,window.generaCardRichiesta=Mo,window.generaCardScadenza=Rn,window._getScadDate=No}function Ln(){let t=document.getElementById("btn-nuova-richiesta");t&&t.addEventListener("click",function(o){o.stopPropagation(),_n()});let e=document.getElementById("modalAiuto");e&&e.addEventListener("click",function(o){o.target===this&&(Date.now()-(this._openedAt||0)<800||qo())}),document.addEventListener("click",function(o){o.target.closest(".req-card")||document.querySelectorAll(".box-risposta, .box-conferma").forEach(function(i){i.style.display!=="none"&&i.style.display!==""&&(i.style.opacity="0",i.style.transform="translateY(-10px)",setTimeout(function(){i.style.display="none"},300))})})}var Me,W,Ne,Nt,Xt,Kt,Yt,yn,ft,Pn=V(()=>{lt();Tt();ut();ve();dt();Jt();Vt();wt();Me=[],W=new Set,Ne=[],Nt=[],Xt=null,Kt="",Yt=[],yn=null,ft=t=>window._normNome?window._normNome(t):t&&String(t).trim()});async function zn(){return ot({azione:"getManuali"},1e4,{retries:2})}async function Mn(t){return ot({azione:"salvaManualeNuovo",...t},18e4,{noDedupe:!0})}async function Nn(t){return ot({azione:"aggiornaManuale",...t},18e4,{noDedupe:!0})}async function Dn(t){return ot({azione:"getStoricoManuale",id:t},1e4,{retries:2})}var qn=V(()=>{"use strict";ve()});function Ve(t){if(!t)return"-";let e=new Date(t);return Number.isNaN(e.getTime())?String(t):e.toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}function K(t){let e=String(t||"").trim();return e&&(/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(e)||/^https?:\/\/[^\s]+$/i.test(e))?e:""}function Je(t){return t&&t.sections&&t.sections._v===2?t.sections:null}function Ge(t,e,o){if(t){let i=o?`<button type="button" onclick="${o}" title="Rimuovi foto" style="position:absolute;top:-7px;right:-7px;background:#ef4444;border:none;color:#fff;width:22px;height:22px;border-radius:50%;font-size:1.1rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3)">&times;</button>`:"";return`<div class="foto-wrapper" style="position:relative;display:inline-block;max-width:100%;margin-bottom:6px"><img src="${t}" alt="${e}" style="max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0;display:block">${i}</div>`}return'<div class="text-xs text-slate-400" style="margin-bottom:6px">Nessuna foto</div>'}function Se(t){return`
    <input type="file" class="manuale-file-input" accept="image/*" onchange="${t}">
    <label class="manuale-file-label" onclick="this.previousElementSibling.click()"><i class="fas fa-upload"></i> Carica foto</label>`}function oc(t){let e=Je(t),o=e?Array.isArray(e.procedimenti)?e.procedimenti.length:0:Array.isArray(t.steps)?t.steps.length:0,i=K(t.copertina),n=i?`<img src="${i}" alt="copertina" class="w-full h-40 object-cover rounded-t-xl">`:'<div class="w-full h-40 bg-slate-100 rounded-t-xl flex items-center justify-center text-slate-400 text-3xl"><i class="fas fa-book-open"></i></div>';return`
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
                <p><b>Aggiornato:</b> ${y(Ve(t.updatedAt))}</p>
                <p><b>Da:</b> ${y(t.updatedBy||"-")}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
                <button type="button" class="${window.TW?.btnPrimary||""}" onclick="apriManuale('${y(t.id)}')"><i class="fas fa-eye"></i> Apri</button>
                <button type="button" class="${window.TW?.btn||""}" onclick="stampaManuale('${y(t.id)}')"><i class="fas fa-print"></i> Stampa</button>
                <button type="button" class="${window.TW?.btn||""}" onclick="apriFormManuale('${y(t.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                <button type="button" class="${window.TW?.btn||""}" onclick="apriStoricoManuale('${y(t.id)}')"><i class="fas fa-clock-rotate-left"></i> Storico</button>
            </div>
        </div>
    </article>`}function Un(){let t=document.getElementById("contenitore-dati");if(!t)return;let e=oe.map(oc).join(""),o=h?.nome?.toUpperCase().trim()==="ALESSIO";t.innerHTML=`
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
    <div id="manuali-storico-host"></div>`,z(t),window.aggiornaListaFiltrabili?.()}function ic(t,e,o){return`
    <div class="scheda-row" data-row-idx="${o}" data-voce="${y(t)}" style="display:grid;grid-template-columns:1fr 1fr 36px;gap:6px;align-items:center">
        <span style="padding:8px 10px;font-size:.875rem;font-weight:500;color:#334155">${y(t)}</span>
        <input type="text" class="input-field-modern" data-field="valore" placeholder="Valore" value="${y(e||"")}">
        <button type="button" class="${window.TW?.btnDanger||""}" onclick="rimuoviSchedaRow(${o})" title="Rimuovi"><i class="fas fa-trash"></i></button>
    </div>`}function Fn(t,e,o){return`
    <div class="scheda-row scheda-row-custom" data-row-idx="${o}" style="display:grid;grid-template-columns:1fr 1fr 36px;gap:6px;align-items:center">
        <input type="text" class="input-field-modern" data-field="voce" placeholder="Caratteristica aggiuntiva" value="${y(t||"")}">
        <input type="text" class="input-field-modern" data-field="valore" placeholder="Valore" value="${y(e||"")}">
        <button type="button" class="${window.TW?.btnDanger||""}" onclick="rimuoviSchedaRow(${o})" title="Rimuovi"><i class="fas fa-trash"></i></button>
    </div>`}function Vo(t,e){let o=K(t&&t.foto||"");return`
    <div class="occorrente-item border border-slate-200 rounded-xl p-3 bg-white" data-item-idx="${e}"${o?` data-foto="${y(o)}"`:""}>
        <div style="display:grid;grid-template-columns:54px 1fr 1fr 36px;gap:6px;align-items:center;margin-bottom:8px">
            <input type="text" class="input-field-modern" data-field="lettera" placeholder="A" value="${y(t&&t.lettera||"")}" style="text-align:center;font-weight:700">
            <input type="text" class="input-field-modern" data-field="nome" placeholder="Nome componente" value="${y(t&&t.nome||"")}">
            <input type="text" class="input-field-modern" data-field="codice" placeholder="Codice (es. LB4PIY062B-1)" value="${y(t&&t.codice||"")}">
            <button type="button" class="${window.TW?.btnDanger||""}" onclick="rimuoviOccorrenteItem(${e})" title="Rimuovi"><i class="fas fa-trash"></i></button>
        </div>
        ${Ge(o,`occ-${e}`,"eliminaFotoOccorrente(this)")}
        ${Se(`cambiaFotoOccorrente(this, ${e})`)}
    </div>`}function Jo(t,e){let o=K(t&&t.foto||""),i=K(t&&t.foto2||"");return`
    <div class="proc-step border border-slate-200 rounded-xl p-3 bg-white" data-step-idx="${e}">
        <div class="flex items-center justify-between" style="margin-bottom:8px">
            <h4 class="text-sm font-semibold text-slate-800">Step ${e+1}</h4>
            <button type="button" class="${window.TW?.btnDanger||""}" onclick="rimuoviProcStep(${e})"><i class="fas fa-trash"></i></button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px">
            <div class="proc-foto-slot" data-slot="1"${o?` data-foto="${y(o)}"`:""}>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:3px">Foto 1</div>
                ${Ge(o,`proc-${e}-1`,"eliminaFotoProcedimento(this)")}
                ${Se(`cambiaFotoProcedimento(this,${e},1)`)}
            </div>
            <div class="proc-foto-slot" data-slot="2"${i?` data-foto="${y(i)}"`:""}>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:3px">Foto 2 <span style="opacity:.6">(opzionale)</span></div>
                ${Ge(i,`proc-${e}-2`,"eliminaFotoProcedimento(this)")}
                ${Se(`cambiaFotoProcedimento(this,${e},2)`)}
            </div>
        </div>
        <textarea class="input-field-modern" data-field="descrizione" rows="3" placeholder="Descrizione del passaggio...">${y(t&&t.descrizione||"")}</textarea>
    </div>`}function nc(t){let e=K(t||"");return`
    <div id="manuali-disegno-wrap"${e?` data-foto="${y(e)}"`:""} class="border border-slate-200 rounded-xl p-3 bg-white">
        ${Ge(e,"disegno-tecnico","eliminaFotoDisegno(this)")}
        ${Se("cambiaFotoDisegno(this)")}
    </div>`}function ie(t){return`<button type="button" class="manuali-modal-close" onclick="${t}" aria-label="Chiudi" title="Chiudi"><i class="fas fa-times"></i></button>`}function Wo(t,e){let o=document.getElementById("manuali-modal-host");if(!o)return;let i=Je(e),n=i?i.schedaTecnica||[]:[],a=i?i.occorrente||[]:[],r=i?i.procedimenti||[]:Array.isArray(e?.steps)?e.steps.map(function(v){return{descrizione:v.descrizione||v.titolo||"",foto:v.foto||""}}):[],s=i&&i.disegnoTecnico?.foto||"",c={},l=[];n.forEach(function(v){Bn.includes(v.voce)?c[v.voce]=v.valore:l.push(v)});let d=0,p=Bn.map(function(v){return ic(v,c[v]||"",d++)}).join("")+l.map(function(v){return Fn(v.voce,v.valore,d++)}).join(""),f=a.length>0?a.map(function(v,x){return Vo(v,x)}).join(""):Vo(null,0),u=r.length>0?r.map(function(v,x){return Jo(v,x)}).join(""):Jo(null,0),m=K(e?.copertina||""),b=m?`<img id="manuali-copertina-preview" src="${m}" alt="copertina" style="max-width:100%;max-height:200px;border-radius:10px;border:1px solid #e2e8f0;display:block;margin-bottom:6px">`:'<div id="manuali-copertina-preview" class="text-xs text-slate-400" style="margin-bottom:6px">Nessuna copertina</div>',w=(v,x)=>`<h3 style="font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#64748b;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #e2e8f0"><i class="${v}"></i> &nbsp;${x}</h3>`;o.innerHTML=`
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
            <div class="modal-content manuali-modal-box" style="width:90vw;max-width:1280px;max-height:90vh;overflow-y:auto;">
                ${ie("chiudiFormManuale()")}
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
            ${b}
            ${Se("cambiaCopertina(this)")}
          </div>
        </div>

        <!-- \u2461 SCHEDA TECNICA -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            ${w("fas fa-table","Scheda Tecnica")}
            <button type="button" class="${window.TW?.btn||""}" onclick="aggiungiSchedaRow()" style="margin-bottom:10px"><i class="fas fa-plus"></i> Aggiungi voce</button>
          </div>
          <div id="manuali-scheda-edit" class="grid gap-2">${p}</div>
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
          <div id="manuali-proc-edit" class="grid gap-3">${u}</div>
        </div>

        <!-- \u2464 DISEGNO TECNICO -->
        <div class="manuale-form-section" style="margin-bottom:22px">
          ${w("fas fa-drafting-compass","Disegno Tecnico")}
          ${nc(s)}
        </div>

        <div class="modal-actions" style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" class="btn-modal-send" onclick="salvaManualeCorrente()"><i class="fas fa-save"></i> Salva manuale</button>
        </div>
      </div>
    </div>`,je=t==="edit"&&e?.id||null}function ac(){let t=[];document.querySelectorAll("#manuali-scheda-edit .scheda-row").forEach(function(a){let r=String(a.getAttribute("data-voce")||a.querySelector('[data-field="voce"]')?.value||"").trim(),s=String(a.querySelector('[data-field="valore"]')?.value||"").trim();(r||s)&&t.push({voce:r,valore:s})});let e=[];document.querySelectorAll("#manuali-occorrente-edit .occorrente-item").forEach(function(a){let r=String(a.querySelector('[data-field="lettera"]')?.value||"").trim(),s=String(a.querySelector('[data-field="nome"]')?.value||"").trim(),c=String(a.querySelector('[data-field="codice"]')?.value||"").trim(),l=String(a.getAttribute("data-foto")||"").trim();(r||s||c||l)&&e.push({lettera:r,nome:s,codice:c,foto:l})});let o=[];document.querySelectorAll("#manuali-proc-edit .proc-step").forEach(function(a){let r=String(a.querySelector('[data-field="descrizione"]')?.value||"").trim(),s=a.querySelector('.proc-foto-slot[data-slot="1"]'),c=a.querySelector('.proc-foto-slot[data-slot="2"]'),l=String(s?.getAttribute("data-foto")||a.getAttribute("data-foto")||"").trim(),d=String(c?.getAttribute("data-foto")||"").trim();(r||l||d)&&o.push({descrizione:r,foto:l,foto2:d})});let i=document.getElementById("manuali-disegno-wrap"),n={foto:String(i?.getAttribute("data-foto")||"").trim()};return{_v:2,schedaTecnica:t,occorrente:e,procedimenti:o,disegnoTecnico:n}}async function Hn(t){return new Promise(function(e,o){let i=new FileReader;i.onload=function(){e(String(i.result||""))},i.onerror=o,i.readAsDataURL(t)})}async function jn(t,e=1200){return new Promise(function(o){let i=new Image;i.onload=function(){let n=Math.min(e/i.width,e/i.height,1),a=document.createElement("canvas");a.width=Math.max(1,Math.round(i.width*n)),a.height=Math.max(1,Math.round(i.height*n));let r=a.getContext("2d");if(!r)return o(t);r.drawImage(i,0,0,a.width,a.height),o(a.toDataURL("image/jpeg",.8))},i.onerror=function(){o(t)},i.src=t})}async function sc(t,e=800){return new Promise(function(o){let i=new Image;i.onload=function(){let n=Math.min(i.width,i.height),a=Math.round((i.width-n)/2),r=Math.round((i.height-n)/2),s=Math.min(n,e),c=document.createElement("canvas");c.width=s,c.height=s;let l=c.getContext("2d");if(!l)return o(t);l.drawImage(i,a,r,n,n,0,0,s,s),o(c.toDataURL("image/jpeg",.8))},i.onerror=function(){o(t)},i.src=t})}async function rc(t){try{let e=t?.files&&t.files[0];if(!e)return;let o=await Hn(e),i=await jn(o,800);if(!i||i.length>Zo){g("Immagine di copertina troppo grande, riduci la risoluzione.","warning");return}let n=document.getElementById("manuali-copertina-wrap");if(!n)return;n.setAttribute("data-copertina",i);let a=n.querySelector("img");if(a)a.src=i;else{let r=n.querySelector("#manuali-copertina-preview");r&&r.remove();let s=document.createElement("img");s.id="manuali-copertina-preview",s.src=i,s.alt="copertina",s.style.cssText="max-width:100%;max-height:200px;border-radius:10px;border:1px solid #e2e8f0;display:block;margin-bottom:6px",n.insertBefore(s,n.firstChild)}}catch{g("Errore nel caricamento immagine di copertina.","error")}}async function Qo(t,e){try{let o=await Hn(t),i=await jn(o,800);if(!i||i.length>Zo){g("Immagine troppo grande, riduci la risoluzione.","warning");return}e(i)}catch{g("Errore nel caricamento immagine.","error")}}function Ko(t,e,o){t.setAttribute("data-foto",e);let i=t.querySelector(".foto-wrapper");if(i){i.querySelector("img").src=e;return}let n=t.querySelector("img");if(n){n.src=e;return}let a=t.querySelector("div.text-xs");a&&a.remove();let r=document.createElement("div");r.className="foto-wrapper",r.style.cssText="position:relative;display:inline-block;max-width:100%;margin-bottom:6px";let s=document.createElement("img");s.src=e,s.style.cssText="max-width:100%;max-height:180px;border-radius:10px;border:1px solid #e2e8f0;display:block",r.appendChild(s),o&&r.insertAdjacentHTML("beforeend",`<button type="button" onclick="${o}" title="Rimuovi foto" style="position:absolute;top:-7px;right:-7px;background:#ef4444;border:none;color:#fff;width:22px;height:22px;border-radius:50%;font-size:1.1rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3)">&times;</button>`);let c=t.querySelector(".manuale-file-input")||t.querySelector('input[type="file"]');t.insertBefore(r,c)}function Yo(t){t.removeAttribute("data-foto");let e=t.querySelector(".foto-wrapper");if(e){let o=document.createElement("div");o.className="text-xs text-slate-400",o.style.marginBottom="6px",o.textContent="Nessuna foto",e.replaceWith(o)}}async function cc(t,e){let o=t?.files&&t.files[0];o&&await Qo(o,function(i){let n=document.querySelector(`.occorrente-item[data-item-idx="${e}"]`);n&&Ko(n,i,"eliminaFotoOccorrente(this)")})}async function lc(t,e,o){let i=t?.files&&t.files[0];i&&await Qo(i,function(n){let a=document.querySelector(`.proc-step[data-step-idx="${e}"]`);if(!a)return;let r=a.querySelector(`.proc-foto-slot[data-slot="${o||1}"]`)||a;Ko(r,n,"eliminaFotoProcedimento(this)")})}async function dc(t){let e=t?.files&&t.files[0];e&&await Qo(e,function(o){let i=document.getElementById("manuali-disegno-wrap");i&&Ko(i,o,"eliminaFotoDisegno(this)")})}function uc(t){ne("Rimuovere la foto da questo elemento?",function(){let e=t.closest(".occorrente-item");e&&Yo(e)})}function pc(t){ne("Rimuovere la foto da questo step?",function(){let e=t.closest(".proc-foto-slot")||t.closest(".proc-step");e&&Yo(e)})}function mc(t){ne("Rimuovere la foto del disegno tecnico?",function(){let e=document.getElementById("manuali-disegno-wrap");e&&Yo(e)})}function fc(t){if(!t){Wo("new",null);return}let e=Bt[t];if(!e){g("Manuale non trovato.","warning");return}Wo("edit",e)}function Gn(){let t=document.getElementById("manuali-modal");t&&t.parentElement&&(t.parentElement.innerHTML=""),je=null}function ne(t,e){let o=document.getElementById("manuali-confirm-overlay");o&&o.remove();let i=document.createElement("div");i.id="manuali-confirm-overlay",i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:11000;display:flex;align-items:center;justify-content:center",i.innerHTML=`
    <div style="background:#fff;border-radius:16px;padding:28px 32px;max-width:380px;width:90%;box-shadow:0 20px 40px rgba(0,0,0,0.18);text-align:center">
        <div style="font-size:2rem;margin-bottom:12px">\u{1F5D1}\uFE0F</div>
        <p style="font-size:.95rem;font-weight:600;color:#1e293b;margin-bottom:20px">${t}</p>
        <div style="display:flex;gap:10px;justify-content:center">
            <button id="manuali-confirm-no" class="btn-modal-cancel" style="min-width:100px">Annulla</button>
            <button id="manuali-confirm-si" class="btn-modal-send" style="min-width:100px;background:#ef4444">Elimina</button>
        </div>
    </div>`,document.body.appendChild(i),document.getElementById("manuali-confirm-no").onclick=function(){i.remove()},document.getElementById("manuali-confirm-si").onclick=function(){i.remove(),e()},i.addEventListener("click",function(n){n.target===i&&i.remove()})}function Vn(t,e,o,i,n){let a=document.querySelector(t);a&&a.querySelectorAll(e).forEach(function(r,s){r.setAttribute(o,String(s));let c=r.querySelector("button");if(c&&c.setAttribute("onclick",`${i}(${s})`),n){let l=r.querySelector('input[type="file"]');l&&l.setAttribute("onchange",`${n}(this, ${s})`)}})}function gc(){let t=document.getElementById("manuali-scheda-edit");if(!t)return;let e=t.querySelectorAll(".scheda-row").length;if(e>=tc){g("Numero massimo voci raggiunto.","warning");return}t.insertAdjacentHTML("beforeend",Fn("","",e))}function vc(t){ne("Eliminare questa voce dalla scheda tecnica?",function(){let e=document.querySelector(`.scheda-row[data-row-idx="${t}"]`);e&&e.remove(),Vn("#manuali-scheda-edit",".scheda-row","data-row-idx","rimuoviSchedaRow",null)})}function hc(){let t=document.getElementById("manuali-occorrente-edit");if(!t)return;let e=t.querySelectorAll(".occorrente-item").length;if(e>=ec){g("Numero massimo elementi raggiunto.","warning");return}t.insertAdjacentHTML("beforeend",Vo({lettera:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[e]||"",nome:"",codice:"",foto:""},e))}function bc(t){ne("Eliminare questo elemento dal materiale occorrente?",function(){let e=document.querySelector(`.occorrente-item[data-item-idx="${t}"]`);e&&e.remove(),Vn("#manuali-occorrente-edit",".occorrente-item","data-item-idx","rimuoviOccorrenteItem","cambiaFotoOccorrente")})}function yc(){let t=document.getElementById("manuali-proc-edit");if(!t)return;let e=t.querySelectorAll(".proc-step").length;if(e>=Xr){g("Numero massimo step raggiunto.","warning");return}t.insertAdjacentHTML("beforeend",Jo(null,e))}function wc(t){ne("Eliminare questo step del procedimento?",function(){let e=document.querySelector(`.proc-step[data-step-idx="${t}"]`);e&&e.remove();let o=document.getElementById("manuali-proc-edit");o&&o.querySelectorAll(".proc-step").forEach(function(i,n){i.setAttribute("data-step-idx",String(n));let a=i.querySelector("h4");a&&(a.textContent="Step "+(n+1));let r=i.querySelector("button");r&&r.setAttribute("onclick",`rimuoviProcStep(${n})`);let s=i.querySelector('input[type="file"]');s&&s.setAttribute("onchange",`cambiaFotoProcedimento(this, ${n})`)})})}async function Sc(){let t=String(document.getElementById("manuali-titolo")?.value||"").trim(),e=String(document.getElementById("manuali-categoria")?.value||"").trim(),o=String(document.getElementById("manuali-copertina-wrap")?.getAttribute("data-copertina")||"").trim(),i=ac();if(!t){g("Inserisci un titolo manuale.","warning");return}try{g("Salvataggio manuale in corso...","info");let n;if(je?n=await Nn({id:je,titolo:t,categoria:e,copertina:o,sections:i}):n=await Mn({titolo:t,categoria:e,copertina:o,sections:i}),!n||n.status!=="ok")throw new Error(n&&(n.message||n.msg)||"Errore salvataggio manuale");await q.invalidate(jo),delete window.cacheContenuti?.MANUALI_PRODOTTI,delete window.cacheFetchTime?.MANUALI_PRODOTTI,Gn(),await Ee(null,null,!1),g("Manuale salvato correttamente.","success")}catch(n){let a=n&&n.name==="TimeoutError"?"Il salvataggio sta impiegando troppo tempo. Riprova con meno immagini.":n&&n.name==="AbortError"?"Richiesta interrotta. Controlla la connessione e riprova.":n&&n.message||"Errore durante il salvataggio.";g(a,"error")}}function _c(t){let e=Je(t),o=e?e.schedaTecnica||[]:[],i=e?e.occorrente||[]:[],n=e?e.procedimenti||[]:Array.isArray(t.steps)?t.steps.map(function(a){return{descrizione:String(a.descrizione||a.titolo||"").trim(),foto:String(a.foto||"").trim(),foto2:""}}):[];return{titolo:String(t.titolo||"(Senza titolo)"),categoria:String(t.categoria||"Generale"),versione:Number(t.version||1),aggiornato:Ve(t.updatedAt),copertina:K(t.copertina),schedaTecnica:Array.isArray(o)?o:[],occorrente:Array.isArray(i)?i:[],procedimenti:Array.isArray(n)?n:[],disegnoTecnico:K(e?.disegnoTecnico?.foto||"")}}function ee(t){return`<div class="man-print-placeholder">${y(t||"Sezione non disponibile")}</div>`}function Ec(t){let e=_c(t),o=e.copertina?`<img class="man-cover-image" src="${e.copertina}" alt="copertina manuale">`:ee("Copertina non disponibile"),i=e.schedaTecnica.map(function(s){return`<tr>
                <td>${y(s?.voce||"")}</td>
                <td>${y(s?.valore||"")}</td>
            </tr>`}).join(""),n=e.occorrente.map(function(s){let c=K(s?.foto||""),l=c?`<img src="${c}" alt="${y(s?.nome||"componente")}" class="man-occ-image">`:'<div class="man-occ-image man-occ-image--empty">Immagine non disponibile</div>';return`<article class="man-occ-card">
                <div class="man-occ-head">
                    <span class="man-occ-letter">${y(s?.lettera||"?")}</span>
                    <div>
                        <h4>${y(s?.nome||"Componente")}</h4>
                        <p>${y(s?.codice||"Codice non disponibile")}</p>
                    </div>
                </div>
                ${l}
            </article>`}).join(""),a=e.procedimenti.map(function(s,c){let l=K(s?.foto||""),d=K(s?.foto2||""),p=[l,d].filter(Boolean),f=p.length?`<div class="man-proc-photos">${p.map(function(u){return`<img src="${u}" alt="step-${c+1}">`}).join("")}</div>`:ee("Immagini step non disponibili");return`<article class="man-proc-step">
                <div class="man-proc-num">${c+1}</div>
                <div class="man-proc-body">
                    ${f}
                    <p>${y(s?.descrizione||"Descrizione non disponibile")}</p>
                </div>
            </article>`}).join(""),r=e.disegnoTecnico?`<img class="man-dt-image" src="${e.disegnoTecnico}" alt="disegno tecnico">`:ee("Disegno tecnico non disponibile");return`<!doctype html>
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
            ${i?`<table class="man-print-table"><thead><tr><th>Caratteristica</th><th>Valore</th></tr></thead><tbody>${i}</tbody></table>`:ee("Scheda tecnica non disponibile")}
            <div class="man-page-footer">Sezione tecnica</div>
        </section>

        <section class="man-print-page man-break">
            <div class="man-brand">OMBRE1 SRL</div>
            <h2 class="man-page-title">Disegno tecnico</h2>
            ${r}
            <div class="man-page-footer">Sezione disegno tecnico</div>
        </section>

        <section class="man-print-page man-break">
            <div class="man-brand">OMBRE1 SRL</div>
            <h2 class="man-page-title">Materiale occorrente</h2>
            ${n?`<div class="man-occ-grid">${n}</div>`:ee("Materiale occorrente non disponibile")}
            <div class="man-page-footer">Sezione materiali</div>
        </section>

        <section class="man-print-page man-break">
            <div class="man-brand">OMBRE1 SRL</div>
            <h2 class="man-page-title">Procedimento</h2>
            ${a||ee("Procedimento non disponibile")}
            <div class="man-page-footer">Sezione step operativi</div>
        </section>
    </div>
</body>
</html>`}function xc(t){let e=Bt[t];if(!e){g("Manuale non trovato.","error");return}let o=window.open("","_blank");if(!o){g("Popup bloccato dal browser. Consenti le finestre popup per stampare.","warning");return}o.document.open(),o.document.write(Ec(e)),o.document.close()}function Ic(t){let e=Bt[t];if(!e)return;let o=document.getElementById("manuali-modal-host");if(!o)return;let i=K(e.copertina),n=i?`<img src="${i}" alt="copertina" style="max-width:100%;max-height:260px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:16px">`:"",a=(c,l)=>`<h3 style="font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#64748b;margin:18px 0 8px;padding-bottom:6px;border-bottom:2px solid #e2e8f0"><i class="${c}"></i> &nbsp;${l}</h3>`,r=Je(e),s="";if(r){let c=(r.schedaTecnica||[]).map(function(f){return`<tr>
                <td style="padding:7px 10px;font-weight:500;color:#334155;border-bottom:1px solid #f1f5f9">${y(f.voce||"")}</td>
                <td style="padding:7px 10px;color:#64748b;border-bottom:1px solid #f1f5f9">${y(f.valore||"")}</td>
            </tr>`}).join("");c&&(s+=a("fas fa-table","Scheda Tecnica")+`
            <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
                <thead><tr style="background:#f8fafc">
                    <th style="padding:7px 10px;text-align:left;font-size:.75rem;color:#94a3b8;font-weight:600">Caratteristica</th>
                    <th style="padding:7px 10px;text-align:left;font-size:.75rem;color:#94a3b8;font-weight:600">Valore</th>
                </tr></thead>
                <tbody>${c}</tbody>
            </table>`),He=[];let l=(r.occorrente||[]).map(function(f){let u=K(f.foto||""),m=-1;return u&&(He.push({lettera:f.lettera||"",nome:f.nome||"",foto:u}),m=He.length-1),`<div ${u?`onclick="_apriLightboxOcc_(${m})"`:""} style="${`padding:10px;border:1px solid #e2e8f0;border-radius:10px;background:#fff${u?";cursor:pointer":""}`}">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:${u?"8px":"0"}">
                    <span style="min-width:28px;height:28px;border-radius:50%;background:#1e293b;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem">${y(f.lettera||"")}</span>
                    <div>
                        <strong class="text-sm">${y(f.nome||"")}</strong>
                        ${f.codice?`<br><span class="text-xs text-slate-400">${y(f.codice)}</span>`:""}
                    </div>
                </div>
                ${u?`<img src="${u}" alt="occ" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;pointer-events:none">`:""}
            </div>`}).join("");l&&(s+=a("fas fa-boxes-stacked","Materiale Occorrente")+`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">${l}</div>`);let d=(r.procedimenti||[]).map(function(f,u){let m=K(f.foto||""),b=K(f.foto2||""),w=[m,b].filter(Boolean),v=w.length?`<div style="display:grid;grid-template-columns:repeat(${w.length},1fr);gap:6px;margin-bottom:6px">${w.map(x=>`<img src="${x}" style="width:100%;border-radius:10px;border:1px solid #e2e8f0">`).join("")}</div>`:"";return`<details class="border border-slate-200 rounded-xl p-3 bg-white" ${u===0?"open":""}>
                <summary class="cursor-pointer font-semibold text-slate-800">Step ${u+1}</summary>
                <div class="mt-2 grid gap-2">
                    ${v}
                    <p class="text-sm text-slate-700">${y(f.descrizione||"-")}</p>
                </div>
            </details>`}).join("");d&&(s+=a("fas fa-list-check","Procedimento")+`<div class="grid gap-2">${d}</div>`);let p=K(r.disegnoTecnico?.foto||"");p&&(s+=a("fas fa-drafting-compass","Disegno Tecnico")+`<img src="${p}" alt="disegno-tecnico" style="max-width:100%;border-radius:10px;border:1px solid #e2e8f0">`)}else s=(e.steps||[]).map(function(c,l){let d=K(c.foto),p=d?`<img src="${d}" alt="step-${l+1}" style="max-width:100%;border-radius:10px;border:1px solid #e2e8f0">`:'<div class="text-xs text-slate-400">Nessuna immagine</div>';return`
            <details class="border border-slate-200 rounded-xl p-3 bg-white" ${l===0?"open":""}>
                <summary class="cursor-pointer font-semibold text-slate-800">Step ${l+1}${c.titolo?" - "+y(c.titolo):""}</summary>
                <div class="mt-2 grid gap-2">
                    ${p}
                    <p class="text-sm text-slate-700">${y(c.descrizione||"-")}</p>
                </div>
            </details>`}).join("");o.innerHTML=`
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
            <div class="modal-content manuali-modal-box" style="width:90vw;max-width:1200px;max-height:90vh;overflow:auto;">
                ${ie("chiudiFormManuale()")}
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
            <div>
                <h2>${y(e.titolo||"(Senza titolo)")}</h2>
                <p class="text-xs text-slate-500 mb-3">${y(e.categoria||"Generale")} \xB7 v${Number(e.version||1)} \xB7 aggiornato ${y(Ve(e.updatedAt))}</p>
            </div>
            <button type="button" class="${window.TW?.btn||""}" onclick="stampaManuale('${y(e.id)}')"><i class="fas fa-print"></i> Stampa</button>
        </div>
        ${n}
        <div>${s||'<div class="empty-msg">Nessun contenuto disponibile.</div>'}</div>
      </div>
    </div>`}async function Ac(t){let e=document.getElementById("manuali-storico-host");if(e){e.innerHTML=`
    <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
            <div class="modal-content manuali-modal-box" style="max-width:980px;max-height:90vh;overflow:auto;">
                ${ie("chiudiStoricoManuale()")}
        <h2>Storico versioni</h2>
        <div class="centered-msg">Caricamento storico...</div>
      </div>
    </div>`;try{let o=await Dn(t);if(!o||o.status!=="ok")throw new Error("Storico non disponibile");let n=(Array.isArray(o.storico)?o.storico:[]).map(function(a,r){let s=a.snapshot||{},c=Array.isArray(s.steps)?s.steps.length:0;return`
            <details class="border border-slate-200 rounded-xl p-3 bg-white" ${r===0?"open":""}>
                <summary class="cursor-pointer font-semibold text-slate-800">
                    v${Number(a.version||0)} \xB7 ${y(a.changeType||"UPDATE")} \xB7 ${y(Ve(a.changedAt))}
                </summary>
                <div class="mt-2 text-sm text-slate-700 grid gap-1">
                    <p><b>Titolo:</b> ${y(s.titolo||"-")}</p>
                    <p><b>Categoria:</b> ${y(s.categoria||"-")}</p>
                    <p><b>Step:</b> ${c}</p>
                    <p><b>Utente:</b> ${y(a.changedBy||"-")}</p>
                </div>
            </details>`}).join("");e.innerHTML=`
        <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
                    <div class="modal-content manuali-modal-box" style="max-width:980px;max-height:90vh;overflow:auto;">
                        ${ie("chiudiStoricoManuale()")}
            <h2>Storico versioni</h2>
            <div class="grid gap-2">${n||'<div class="empty-msg">Nessuna versione trovata.</div>'}</div>
          </div>
        </div>`}catch{e.innerHTML=`
        <div id="manuali-storico-modal" class="modal-overlay active" style="display:flex;z-index:4501">
                    <div class="modal-content manuali-modal-box" style="max-width:760px;max-height:90vh;overflow:auto;">
                        ${ie("chiudiStoricoManuale()")}
            <h2>Storico versioni</h2>
            <div class="centered-error-bold">Errore nel caricamento storico.</div>
          </div>
        </div>`}}}function Oc(){let t=document.getElementById("manuali-storico-host");t&&(t.innerHTML="")}async function Ee(t=null,e=null,o=!1){let i=document.getElementById("contenitore-dati");if(i){o||(i.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento manuali...</div>");try{let n=null;if(!o)try{n=await q.get(jo)}catch{}if(n&&Array.isArray(n.manuali)&&n.manuali.length&&(oe=n.manuali,Bt={},oe.forEach(function(r){Bt[r.id]=r}),Un(),!o))return;let a=await zn();if(e?.aborted)return;if(!a||a.status!=="ok")throw new Error(a&&(a.message||a.msg)||"Errore caricamento manuali");oe=Array.isArray(a.manuali)?a.manuali:[],Bt={},oe.forEach(function(r){Bt[r.id]=r}),await q.set(jo,{manuali:oe}),Un(),window.cacheContenuti&&(window.cacheContenuti.MANUALI_PRODOTTI=i.innerHTML),window.cacheFetchTime&&(window.cacheFetchTime.MANUALI_PRODOTTI=Date.now())}catch(n){if(console.error("[manuali] Errore caricaManuali:",n&&n.message?n.message:String(n),n),o)return;i.innerHTML="<div class='centered-error-bold'>Errore nel caricamento manuali.<br><small style='font-size:.75rem;color:#666'>"+y(n&&n.message||"sconosciuto")+"</small></div>"}}}function Cc(t){let e=He;if(!e.length)return;let o=t;function i(){let p=document.getElementById("_occ_lightbox");p&&p.remove(),document.removeEventListener("keydown",r)}function n(p){o=p;let f=e[p];document.getElementById("_occ_lb_img").src=f.foto,document.getElementById("_occ_lb_badge").textContent=f.lettera,document.getElementById("_occ_lb_nome").textContent=f.nome,document.getElementById("_occ_lb_counter").textContent=e.length>1?`${p+1} / ${e.length}`:""}function a(p){n((o+p+e.length)%e.length)}function r(p){p.key==="ArrowLeft"?a(-1):p.key==="ArrowRight"?a(1):p.key==="Escape"&&i()}document.getElementById("_occ_lightbox")?.remove(),window._occLbKeyHandler&&document.removeEventListener("keydown",window._occLbKeyHandler);let s=e.length>1,c="background:rgba(255,255,255,.15);border:none;color:#fff;width:48px;height:48px;border-radius:50%;font-size:1.8rem;cursor:pointer;flex-shrink:0;line-height:1;display:flex;align-items:center;justify-content:center;",l=document.createElement("div");l.id="_occ_lightbox",l.style.cssText="position:fixed;z-index:99999;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center",l.innerHTML=`
      <button id="_occ_lb_close" style="position:absolute;top:14px;right:18px;background:none;border:none;color:#fff;font-size:2rem;line-height:1;cursor:pointer;opacity:.75;padding:4px 8px">&#10005;</button>
      <div style="display:flex;align-items:center;gap:12px;width:92vw;max-width:880px">
        <button id="_occ_lb_prev" style="${c}${s?"":"visibility:hidden"}">&#8249;</button>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;min-width:0">
          <div style="display:flex;align-items:center;gap:10px">
            <span id="_occ_lb_badge" style="min-width:36px;height:36px;border-radius:50%;background:#fff;color:#1e293b;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem"></span>
            <span id="_occ_lb_nome" style="color:#fff;font-weight:600;font-size:1rem"></span>
          </div>
          <img id="_occ_lb_img" src="" alt="" style="max-width:100%;max-height:72vh;border-radius:12px;object-fit:contain">
          <span id="_occ_lb_counter" style="color:#94a3b8;font-size:.85rem"></span>
        </div>
        <button id="_occ_lb_next" style="${c}${s?"":"visibility:hidden"}">&#8250;</button>
      </div>`,document.body.appendChild(l),document.getElementById("_occ_lb_close").addEventListener("click",i),document.getElementById("_occ_lb_prev").addEventListener("click",function(){a(-1)}),document.getElementById("_occ_lb_next").addEventListener("click",function(){a(1)}),l.addEventListener("click",function(p){p.target===l&&i()});let d=0;l.addEventListener("touchstart",function(p){d=p.changedTouches[0].clientX},{passive:!0}),l.addEventListener("touchend",function(p){let f=p.changedTouches[0].clientX-d;Math.abs(f)>50&&a(f<0?1:-1)},{passive:!0}),document.addEventListener("keydown",r),window._occLbKeyHandler=r,n(t)}function qt(t,e){return t[e]|t[e+1]<<8}function Fe(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0}async function $c(t){let e=new DecompressionStream("deflate-raw"),o=e.writable.getWriter(),i=e.readable.getReader();o.write(t),o.close();let n=[],a=0;for(;;){let{done:c,value:l}=await i.read();if(c)break;n.push(l),a+=l.length}let r=new Uint8Array(a),s=0;for(let c of n)r.set(c,s),s+=c.length;return r}async function Tc(t){let e=-1,o=Math.max(0,t.length-65558);for(let c=t.length-22;c>=o;c--)if(t[c]===80&&t[c+1]===75&&t[c+2]===5&&t[c+3]===6){e=c;break}if(e<0)throw new Error("File ZIP non valido (EOCD non trovato)");let i=qt(t,e+10),n=Fe(t,e+16),a=Object.create(null),r=new TextDecoder("utf-8",{fatal:!1}),s=n;for(let c=0;c<i&&Fe(t,s)===33639248;c++){let l=qt(t,s+10),d=Fe(t,s+20),p=qt(t,s+28),f=qt(t,s+30),u=qt(t,s+32),m=Fe(t,s+42),b=r.decode(t.slice(s+46,s+46+p));if(s+=46+p+f+u,b.endsWith("/")||b.endsWith("\\"))continue;let w=qt(t,m+26),v=qt(t,m+28),x=m+30+w+v,O=t.slice(x,x+d);l===0?a[b]=O:l===8&&(a[b]=await $c(O))}return a}function _e(t){let e=new TextDecoder("utf-8",{fatal:!1}).decode(t);return new DOMParser().parseFromString(e,"text/xml")}function ti(t){return[...t.getElementsByTagName("Relationship")].map(e=>({id:e.getAttribute("Id")||"",type:e.getAttribute("Type")||"",target:e.getAttribute("Target")||""}))}function Rc(t){let e=t["ppt/presentation.xml"],o=t["ppt/_rels/presentation.xml.rels"];if(!e||!o)return null;let i={};ti(_e(o)).forEach(c=>{i[c.id]=c.target});let n=_e(e),a=[...n.getElementsByTagNameNS(Xo,"sldId")];a.length||(a=[...n.getElementsByTagName("p:sldId")]);let r=[],s=new Set;return a.forEach(c=>{let l=c.getAttributeNS(Jn,"id")||c.getAttribute("r:id")||"",d=i[l];if(!d)return;let p="ppt/"+d.replace(/^\.\.\//,"");s.has(p)||(s.add(p),r.push(p))}),r.length?r:null}function Pc(t){if(!t)return{};let e={};return ti(_e(t)).forEach(o=>{o.type.includes("image")&&(e[o.id]=o.target)}),e}function zc(t,e){let o=t.split("/").pop();if(!kc.test(o))return null;let i=e["ppt/media/"+o];if(!i)return null;let n=Lc[o.split(".").pop().toLowerCase()];if(!n)return null;let a="";for(let r=0;r<i.length;r+=8192)a+=String.fromCharCode(...i.subarray(r,Math.min(r+8192,i.length)));return`data:${n};base64,${btoa(a)}`}function Wn(t){let e=t.getElementsByTagNameNS(Ut,"off")[0]||t.getElementsByTagName("a:off")[0];return e?{x:parseInt(e.getAttribute("x")||"0",10),y:parseInt(e.getAttribute("y")||"0",10)}:{x:0,y:0}}function Mc(t,e,o,i){let n=[...t.getElementsByTagNameNS(Xo,"pic")];n.length||(n=[...t.getElementsByTagName("p:pic")]);let a=[];for(let r of n){let s=r.getElementsByTagNameNS(Ut,"blip")[0]||r.getElementsByTagName("a:blip")[0];if(!s)continue;let c=s.getAttributeNS(Jn,"embed")||s.getAttribute("r:embed")||"";if(!c||!e[c])continue;let l=e[c],d=l.split("/").pop();if(i&&i.has(d))continue;let p=zc(l,o);if(!p)continue;let f=Wn(r);a.push({dataUrl:p,x:f.x,y:f.y})}return a.sort((r,s)=>r.y!==s.y?r.y-s.y:r.x-s.x)}function Nc(t){let e=[...t.getElementsByTagNameNS(Ut,"tbl")];if(e.length||(e=[...t.getElementsByTagName("a:tbl")]),!e.length)return null;let o=[...e[0].getElementsByTagNameNS(Ut,"tr")];o.length||(o=[...e[0].getElementsByTagName("a:tr")]);let i=[];for(let n of o){let a=[...n.getElementsByTagNameNS(Ut,"tc")];if(a.length||(a=[...n.getElementsByTagName("a:tc")]),a.length<2)continue;let r=l=>{let d=[...l.getElementsByTagNameNS(Ut,"t")];return d.length||(d=[...l.getElementsByTagName("a:t")]),d.map(p=>(p.textContent||"").trim()).filter(Boolean).join(" ")},s=r(a[0]),c=r(a[1]);s&&i.push({voce:s,valore:c||""})}return i.length>=2?i:null}function Dc(t){let e=[...t.getElementsByTagNameNS(Xo,"sp")];e.length||(e=[...t.getElementsByTagName("p:sp")]);let o=[];for(let i of e){let n=[...i.getElementsByTagNameNS(Ut,"t")];n.length||(n=[...i.getElementsByTagName("a:t")]);let a=n.map(s=>(s.textContent||"").trim()).filter(Boolean).join(" ").trim();if(!a)continue;let r=Wn(i);o.push({text:a,x:r.x,y:r.y})}return o.sort((i,n)=>i.y!==n.y?i.y-n.y:i.x-n.x)}function qc(t,e,o,i,n){let a=e.map(l=>l.text).join(" ");if(/disegno\s+tecnico/i.test(a)&&o.length>=1)return"disegno";if(t&&t.length>=2)return"scheda";if(/materiale\s+occorrente/i.test(a))return"occorrente";let r=l=>/^[A-Z]-?\d/.test(l),s=l=>(/^[A-Z][\s\-–\.\:]/.test(l)||/^[A-Z]$/.test(l))&&!r(l),c=e.filter(l=>s(l.text.trim()));return!n&&i<4&&o.length===1&&!t&&a.length<300&&c.length===0?"title":i<3&&o.length===0&&!t&&c.length===0?"intro":c.length>=2||c.length===1&&/^[A-Z]$/.test(c[0].text.trim())&&o.length>=1?"occorrente":"procedimento"}function Bc(t,e,o){let i=/^([A-Z])[\s\-–\.\:]*(.*)/s,n=t.filter(a=>/^[A-Z][\s\-–\.\:]|^[A-Z]$/.test(a.text.trim()));for(let a of n){let r=a.text.trim().match(i);if(!r)continue;let s=r[1],l=(r[2]||"").trim().split(/\s{2,}|\s+[-–]\s+/),d=(l[0]||"").trim().slice(0,80),p=(l[1]||"").trim().slice(0,40),f=o.find(u=>u.lettera===s);f?(!f.nome&&d&&(f.nome=d),!f.codice&&p&&(f.codice=p)):o.push({lettera:s,nome:d,codice:p,foto:""})}if(e.length)if(e.length===1&&n.length===1){let a=n[0].text.trim()[0],r=o.find(s=>s.lettera===a);r&&!r.foto&&(r.foto=e[0].dataUrl)}else{let a=[...n].sort((r,s)=>r.y!==s.y?r.y-s.y:r.x-s.x);e.forEach((r,s)=>{if(s<a.length){let c=a[s].text.trim()[0],l=o.find(d=>d.lettera===c);l&&!l.foto&&(l.foto=r.dataUrl)}})}}function Uc(t,e){let i=[...t.filter(c=>{let l=c.text.trim();return!(/^REVISIONE\s/i.test(l)||/^\d+$/.test(l)||/^[<>]$/.test(l)||l===l.toUpperCase()&&l.length<60&&/^[A-Z\s\d\-:;./]+$/.test(l))}).map(c=>({kind:"text",y:c.y,x:c.x||0,v:c.text})),...e.map(c=>({kind:"img",y:c.y,x:c.x||0,v:c.dataUrl}))].sort((c,l)=>c.y!==l.y?c.y-l.y:c.x-l.x),n=[],a=[],r=[];function s(){let c=a.join(" ").trim(),l=r[0]||null,d=r[1]||null;(c||l)&&n.push({descrizione:c,imageBase64:l,imageBase642:d}),a=[],r=[]}for(let c of i)c.kind==="text"?(r.length>0&&s(),a.push(c.v)):r.push(c.v);if(s(),!n.length){let c=t.map(p=>p.text).join(" ").trim(),l=e.length?e[0].dataUrl:null,d=e.length>1?e[1].dataUrl:null;(c||l)&&n.push({descrizione:c,imageBase64:l,imageBase642:d})}return n}async function Fc(t){let e=new Uint8Array(t),o=await Tc(e);if(!o["ppt/presentation.xml"])throw new Error("File non valido: manca ppt/presentation.xml");let i=Rc(o);(!i||!i.length)&&(i=Object.keys(o).filter(m=>/^ppt\/slides\/slide\d+\.xml$/.test(m)).sort((m,b)=>{let w=parseInt(m.match(/(\d+)\.xml$/)?.[1]||"0",10),v=parseInt(b.match(/(\d+)\.xml$/)?.[1]||"0",10);return w-v}));let n={};for(let m of i){let b=m.split("/").pop(),w=o[`ppt/slides/_rels/${b}.rels`];if(!w)continue;let v=new Set;for(let x of ti(_e(w))){if(!x.type.includes("image"))continue;let O=x.target.split("/").pop();v.has(O)||(v.add(O),n[O]=(n[O]||0)+1)}}let a=new Set,r=Math.max(2,Math.ceil(i.length*.4));for(let[m,b]of Object.entries(n))b>=r&&a.add(m);let s="",c="",l="",d=[],p=[],f=[],u={foto:""};for(let m=0;m<i.length;m++){let b=o[i[m]];if(!b)continue;let w=_e(b),v=i[m].split("/").pop(),x=Pc(o[`ppt/slides/_rels/${v}.rels`]),O=Nc(w),E=Dc(w),$=Mc(w,x,o,a),k=qc(O,E,$,m,!!s);if(k!=="intro")if(k==="title"){if(!l&&$.length&&(l=$[0].dataUrl),!s&&E.length){let R=$.length?$[0].y:1/0,C=E.filter(D=>D.y<=R&&D.text.length>3).filter(D=>!/^[A-Z0-9\-]+$/.test(D.text)).filter(D=>!/^REVISIONE\s/i.test(D.text));C.length>=2?(c=C[0].text.slice(0,80).trim(),s=C[C.length-1].text.slice(0,120).trim()):C.length===1?s=C[0].text.slice(0,120).trim():s=E[0].text.slice(0,120).trim()}}else if(k==="scheda")O.forEach(R=>{d.find(C=>C.voce===R.voce)||d.push(R)});else if(k==="occorrente")Bc(E,$,p);else if(k==="disegno")!u.foto&&$.length&&(u={foto:$[0].dataUrl});else{let R=Uc(E,$);for(let C of R)(C.descrizione||C.imageBase64)&&f.push(C)}}return{titolo:s,categoria:c,copertina:l,schedaTecnica:d,occorrente:p,procedimenti:f,disegnoTecnico:u}}function Hc(){if(h?.nome?.toUpperCase().trim()!=="ALESSIO")return;let t=document.getElementById("_pptx-file-inp");t||(t=document.createElement("input"),t.type="file",t.id="_pptx-file-inp",t.accept=".pptx",t.style.display="none",t.addEventListener("change",function(){jc(t)}),document.body.appendChild(t)),t.value="",t.click()}async function jc(t){let e=t?.files?.[0];if(e){g("Analisi PPTX in corso...","info");try{let o=await e.arrayBuffer(),i=await Fc(o);if(!i.titolo&&!i.procedimenti.length&&!i.schedaTecnica.length&&!i.occorrente.length){g("Nessun contenuto riconosciuto nel file.","warning");return}i.titolo||(i.titolo=e.name.replace(/\.pptx$/i,"").replace(/[-_]/g," ")),Go=i,Gc(i)}catch(o){console.error("[PPTX]",o),g("Errore nel parsing PPTX: "+(o?.message||"file non valido"),"error")}}}function Gc(t){let e=document.getElementById("manuali-modal-host");if(!e)return;let o=t.copertina?`<img src="${t.copertina}" style="width:80px;height:60px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;flex-shrink:0">`:'<div style="width:80px;height:60px;background:#f1f5f9;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#cbd5e1;font-size:10px;flex-shrink:0">nessuna</div>',i=t.schedaTecnica.length?t.schedaTecnica.slice(0,6).map(c=>`<tr><td style="padding:3px 8px;color:#475569;font-size:11px;border-bottom:1px solid #f1f5f9">${y(c.voce)}</td><td style="padding:3px 8px;font-size:11px;color:#1e293b;border-bottom:1px solid #f1f5f9">${y(c.valore)}</td></tr>`).join("")+(t.schedaTecnica.length>6?`<tr><td colspan="2" style="padding:3px 8px;color:#94a3b8;font-size:10px">+ altre ${t.schedaTecnica.length-6} voci\u2026</td></tr>`:""):'<tr><td colspan="2" style="padding:6px 8px;color:#94a3b8;font-size:11px">Nessuna voce riconosciuta</td></tr>',n=t.occorrente.length?t.occorrente.slice(0,8).map(c=>{let l=c.foto?`<img src="${c.foto}" style="width:36px;height:36px;object-fit:cover;border-radius:5px;border:1px solid #e2e8f0;flex-shrink:0">`:'<div style="width:36px;height:36px;background:#f1f5f9;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#94a3b8;flex-shrink:0">\u2013</div>';return`<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f8fafc">
                <b style="font-size:13px;color:#3b82f6;flex-shrink:0;width:18px">${y(c.lettera)}</b>
                ${l}
                <span style="font-size:11px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${y(c.nome||"\u2014")}</span>
                ${c.codice?`<span style="font-size:10px;color:#94a3b8;flex-shrink:0">${y(c.codice)}</span>`:""}
            </div>`}).join("")+(t.occorrente.length>8?`<div style="font-size:10px;color:#94a3b8;padding:4px 0">+ altri ${t.occorrente.length-8}\u2026</div>`:""):'<div style="font-size:11px;color:#94a3b8;padding:6px 0">Nessun componente riconosciuto</div>',a=t.procedimenti.length?t.procedimenti.slice(0,4).map((c,l)=>{let d=c.imageBase64?`<img src="${c.imageBase64}" style="width:52px;height:40px;object-fit:cover;border-radius:5px;border:1px solid #e2e8f0;flex-shrink:0">`:'<div style="width:52px;height:40px;background:#f1f5f9;border-radius:5px;flex-shrink:0"></div>',p=(c.descrizione||"").slice(0,70)+((c.descrizione||"").length>70?"\u2026":"");return`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f1f5f9">
                <span style="font-size:10px;color:#94a3b8;flex-shrink:0;width:18px">${l+1}.</span>
                ${d}
                <span style="font-size:11px;color:#475569;overflow:hidden;min-width:0">${y(p)||'<em style="color:#cbd5e1">nessun testo</em>'}</span>
            </div>`}).join("")+(t.procedimenti.length>4?`<div style="font-size:10px;color:#94a3b8;padding:4px 0">+ altri ${t.procedimenti.length-4} step\u2026</div>`:""):'<div style="font-size:11px;color:#94a3b8;padding:6px 0">Nessuno step riconosciuto</div>',r=(c,l,d)=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:.72rem;font-weight:700;text-transform:uppercase;color:#64748b;letter-spacing:.04em">
            <i class="${c}"></i> ${l}
            <span style="background:#e2e8f0;border-radius:99px;padding:1px 7px;font-size:10px">${d}</span>
         </div>`,s="margin-bottom:12px;padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0";e.innerHTML=`
    <div id="manuali-modal" class="modal-overlay active" style="display:flex;z-index:4500">
            <div class="modal-content manuali-modal-box" style="width:92vw;max-width:820px;max-height:90vh;overflow-y:auto">
                ${ie("chiudiFormManuale()")}
        <h2 style="margin-bottom:4px;display:flex;align-items:center;gap:10px">
            <i class="fas fa-file-powerpoint" style="color:#7c3aed"></i> Anteprima PPTX
        </h2>
        <p style="font-size:.83rem;color:#64748b;margin-bottom:16px">Verifica il contenuto riconosciuto. Potrai modificare tutto nell'editor dopo l'importazione.</p>

        <div style="${s};display:flex;gap:14px;align-items:flex-start">
            ${o}
            <div style="flex:1;min-width:0">
                <label class="modal-label">Titolo manuale *</label>
                <input id="pptx-titolo" class="input-field-modern" type="text" value="${y(t.titolo)}" placeholder="Inserisci titolo manuale">
                <label class="modal-label" style="margin-top:6px">Categoria</label>
                <input id="pptx-categoria" class="input-field-modern" type="text" value="${y(t.categoria||"")}" placeholder="Es. Lampade a Picchetto">
            </div>
        </div>

        <div style="${s}">
            ${r("fas fa-table","Scheda Tecnica",t.schedaTecnica.length+" voci")}
            <table style="width:100%;border-collapse:collapse">${i}</table>
        </div>

        <div style="${s}">
            ${r("fas fa-boxes-stacked","Materiale Occorrente",t.occorrente.length)}
            ${n}
        </div>

        <div style="${s}">
            ${r("fas fa-list-ol","Procedimento",t.procedimenti.length+" step")}
            ${a}
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
            <button id="pptx-btn-crea" class="btn-modal-ok" onclick="_confermImportPptx()">
                <i class="fas fa-arrow-right"></i> Apri nell'editor
            </button>
        </div>
      </div>
    </div>`}async function Vc(){let t=String(document.getElementById("pptx-titolo")?.value||"").trim();if(!t){g("Inserisci un titolo per il manuale.","warning");return}let e=document.getElementById("pptx-categoria"),o=String(e?.value||"").trim(),i=document.getElementById("pptx-btn-crea");i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Elaborazione immagini\u2026');let n=Go;if(!n||typeof n!="object"||Array.isArray(n)){g("Nessun risultato da importare.","error"),i&&(i.disabled=!1,i.innerHTML=`<i class="fas fa-arrow-right"></i> Apri nell'editor`);return}async function a(d){if(!d)return"";try{let p=await sc(d,800);return p&&p.length<=Zo?p:""}catch{return""}}let r=await a(n.copertina),s=[];for(let d of n.procedimenti||[]){let p=await a(d.imageBase64),f=await a(d.imageBase642);s.push({descrizione:d.descrizione||"",foto:p,foto2:f})}let c=[];for(let d of n.occorrente||[]){let p=await a(d.foto);c.push({lettera:d.lettera,nome:d.nome||"",codice:d.codice||"",foto:p})}let l={titolo:t,categoria:o,copertina:r,sections:{_v:2,schedaTecnica:n.schedaTecnica||[],occorrente:c,procedimenti:s,disegnoTecnico:n.disegnoTecnico||{foto:""}}};Go=[],Wo("new",l)}function Zn(){window.apriManuale=Ic,window.stampaManuale=xc,window._apriLightboxOcc_=Cc,window.apriFormManuale=fc,window.chiudiFormManuale=Gn,window.aggiungiSchedaRow=gc,window.rimuoviSchedaRow=vc,window.aggiungiOccorrenteItem=hc,window.rimuoviOccorrenteItem=bc,window.eliminaFotoOccorrente=uc,window.eliminaFotoProcedimento=pc,window.eliminaFotoDisegno=mc,window.cambiaFotoOccorrente=cc,window.aggiungiProcStep=yc,window.rimuoviProcStep=wc,window.cambiaFotoProcedimento=lc,window.cambiaFotoDisegno=dc,window.cambiaCopertina=rc,window.salvaManualeCorrente=Sc,window.apriStoricoManuale=Ac,window.chiudiStoricoManuale=Oc,window.importaPptx=Hc,window._confermImportPptx=Vc}var jo,Xr,tc,ec,Zo,Bn,oe,Bt,je,He,Go,Ut,Jn,Xo,kc,Lc,Qn=V(()=>{"use strict";Tt();dt();qn();ut();jo="MANUALI_PRODOTTI",Xr=20,tc=30,ec=20,Zo=4e6,Bn=["Dimensione della sfera","Finiture","Ottiche","Grado di Protezione IP","Tipologia di installazione","Potenza assorbita","Alimentazione","Dimmerazione","Temperatura colore","Indice di resa cromatica","Tolleranza cromatica","Flusso luminoso","Efficienza luminosa","Mantenimento del flusso luminoso","Temperatura di esercizio"],oe=[],Bt={},je=null,He=[],Go=[];Ut="http://schemas.openxmlformats.org/drawingml/2006/main",Jn="http://schemas.openxmlformats.org/officeDocument/2006/relationships",Xo="http://schemas.openxmlformats.org/presentationml/2006/main";kc=/\.(jpe?g|png|gif|webp)$/i,Lc={jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",gif:"image/gif",webp:"image/webp"}});function We(t,e,o,i={}){let n=t.getBoundingClientRect(),a=t.cloneNode(!0);a.removeAttribute("id");let r=i.opacity??.88,s=i.scale??"1.04",c=i.rotate??"-1deg",l=i.borderRadius??"10px",d=i.shadow??"0 10px 30px rgba(0,0,0,0.35)",p=i.background?`background:${i.background};`:"",f=i.border?`border:${i.border};`:"",u=i.transition?`transition:${i.transition};`:"";return a.style.cssText=Jc+`width:${n.width}px;height:${n.height}px;left:${n.left}px;top:${n.top}px;opacity:${r};border-radius:${l};box-shadow:${d};transform:scale(${s}) rotate(${c});`+p+f+u,document.body.appendChild(a),{ghost:a,offX:e-n.left,offY:o-n.top}}function Ze(t,e,o,i,n){t.style.left=e-i+"px",t.style.top=o-n+"px"}function Qe(t){t&&t.remove()}function Kn(t,e,o,i){t&&(t.style.visibility="hidden");let n=document.elementFromPoint(e,o);return t&&(t.style.visibility=""),n?n.closest(i):null}var Jc,Ke=V(()=>{Jc="position:fixed;pointer-events:none;user-select:none;-webkit-user-select:none;z-index:99999;transition:none;"});function Yn(){try{let t=localStorage.getItem("qrPostazioni");Z=t?JSON.parse(t):[...ke]}catch{Z=[...ke]}ta()}function Xn(){try{localStorage.setItem("qrPostazioni",JSON.stringify(Z))}catch{}ta()}function ta(){oi={},Z.forEach(t=>{oi[t.codice.toUpperCase()]=t})}function Wc(){let t=/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,e=window.navigator.standalone===!0||window.matchMedia("(display-mode: standalone)").matches;return t&&e}async function ea(){if(ei)return;ei=!0,setTimeout(()=>{ei=!1},800);let t=document.getElementById("modal-qr-scanner"),e=document.getElementById("qr-error-msg");if(!t)return;e&&(e.style.display="none");let o=document.getElementById("qr-manual-input");if(o&&(o.value=""),Wc()){let i=document.createElement("input");i.type="file",i.accept="image/*",i.capture="environment",i.style.display="none",document.body.appendChild(i),i.onchange=()=>{let n=i.files&&i.files[0];if(document.body.removeChild(i),!n)return;let a=new FileReader;a.onload=r=>{let s=new Image;s.onload=()=>{if(typeof jsQR>"u"){alert("\u26A0\uFE0F Libreria scanner non caricata. Usa il campo manuale.");return}let c=document.createElement("canvas");c.width=s.width,c.height=s.height;let l=c.getContext("2d");l.drawImage(s,0,0);let d=l.getImageData(0,0,s.width,s.height),p=jsQR(d.data,d.width,d.height,{inversionAttempts:"attemptBoth"});if(p&&p.data){try{navigator.vibrate&&navigator.vibrate(80)}catch{}to(p.data.trim())}else t.style.display="flex",t.offsetHeight,t.classList.add("active"),e&&(e.textContent="\u26A0\uFE0F QR non riconosciuto nell'immagine. Riprova o usa il campo manuale.",e.style.display="block")},s.src=r.target.result},a.readAsDataURL(n)},i.oncancel=()=>document.body.removeChild(i),i.click();return}if(t.style.display="flex",t.offsetHeight,t.classList.add("active"),typeof jsQR>"u"){e&&(e.textContent="\u26A0\uFE0F Libreria scanner non caricata. Usa il campo manuale.",e.style.display="block");return}if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){e&&(e.textContent="\u26A0\uFE0F Fotocamera non supportata da questo browser. Usa il campo manuale.",e.style.display="block");return}try{if(!Rt||!Rt.active){Rt=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});try{localStorage.setItem("qrCameraGranted","1")}catch{}}let i=document.getElementById("qr-video");i.srcObject=Rt,await i.play(),Zc()}catch(i){let n="\u26A0\uFE0F Impossibile avviare la fotocamera.";i.name==="NotAllowedError"&&(n="\u26A0\uFE0F Permesso fotocamera negato. Abilitalo dalle impostazioni del browser, poi riprova."),i.name==="NotFoundError"&&(n="\u26A0\uFE0F Nessuna fotocamera trovata sul dispositivo."),i.name==="NotReadableError"&&(n="\u26A0\uFE0F Fotocamera occupata da un'altra applicazione."),e&&(e.textContent=n,e.style.display="block")}}function Zc(){let t=document.getElementById("qr-video"),e=document.getElementById("qr-canvas");if(!t||!e)return;let o=e.getContext("2d");function i(){if(Rt){if(t.readyState===t.HAVE_ENOUGH_DATA){e.width=t.videoWidth,e.height=t.videoHeight,o.drawImage(t,0,0,e.width,e.height);let n=o.getImageData(0,0,e.width,e.height),a=jsQR(n.data,n.width,n.height,{inversionAttempts:"dontInvert"});if(a&&a.data){try{navigator.vibrate&&navigator.vibrate(80)}catch{}Xe(),to(a.data.trim());return}}xe=requestAnimationFrame(i)}}xe=requestAnimationFrame(i)}function Xe(){xe&&(cancelAnimationFrame(xe),xe=null),Rt&&(Rt.getTracks().forEach(o=>o.stop()),Rt=null);let t=document.getElementById("qr-video");t&&(t.pause(),t.srcObject=null);let e=document.getElementById("modal-qr-scanner");e&&(e.classList.remove("active"),setTimeout(()=>{e.classList.contains("active")||(e.style.display="none")},300))}function to(t){if(!t)return;let e=oi[t.toUpperCase()];if(!e){g("\u26A0\uFE0F QR non riconosciuto come postazione: "+t,"error");return}Ye={codice:t.toUpperCase(),...e},Qc()}function Qc(){let t=Ye;if(!t)return;Ae=null,rt=null,document.getElementById("qr-badge-nome").textContent=t.icona+"  "+t.nome,document.getElementById("qr-azione-domanda").textContent=t.domanda;let e=document.getElementById("qr-search-input");e&&(e.value="",setTimeout(()=>e.focus(),350));let o=document.getElementById("qr-search-dropdown");o&&(o.style.display="none",o.innerHTML=""),document.getElementById("qr-articoli-wrap").style.display="none",document.getElementById("qr-stato-wrap").style.display="none",document.getElementById("btn-qr-conferma").disabled=!0,(window._ordiniAutocompleteCache||[]).length===0&&window.fetchJson("PROGRAMMA PRODUZIONE DEL MESE").then(a=>{let r=new Set;window._ordiniAutocompleteCache=a.filter(s=>String(s.archiviato||"").toUpperCase()!=="TRUE").map(s=>({ordine:s.ordine||"",cliente:s.cliente||"",riferimento:s.riferimento||""})).filter(s=>!s.ordine||r.has(s.ordine)?!1:(r.add(s.ordine),!0))}).catch(()=>{});let n=document.getElementById("modal-qr-azione");n.style.display="flex",n.offsetHeight,n.classList.add("active")}function ii(){let t=document.getElementById("modal-qr-azione");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300),Ye=null,Ae=null,rt=null)}function oa(t){let e=document.getElementById("qr-search-dropdown");if(!e)return;let o=(t||"").trim().toLowerCase();if(document.getElementById("qr-articoli-wrap").style.display="none",document.getElementById("qr-stato-wrap").style.display="none",document.getElementById("btn-qr-conferma").disabled=!0,Ae=null,rt=null,!o){e.style.display="none",e.innerHTML="";return}let n=(window._ordiniAutocompleteCache||[]).filter(a=>a.ordine.toLowerCase().includes(o)||a.cliente.toLowerCase().includes(o)||(a.riferimento||"").toLowerCase().includes(o)).slice(0,8);if(n.length===0){e.style.display="none",e.innerHTML="";return}e.innerHTML=n.map(a=>`
        <div class="autocomplete-item"
             onmousedown="event.preventDefault(); _qrSelezionaOrdine('${a.ordine.replace(/'/g,"\\'")}','${a.cliente.replace(/'/g,"\\'")}')"
             ontouchend="event.preventDefault(); _qrSelezionaOrdine('${a.ordine.replace(/'/g,"\\'")}','${a.cliente.replace(/'/g,"\\'")}')">
            <span class="ac-ordine">ORD. ${y(a.ordine)}</span>
            <span class="ac-cliente">${y(a.cliente)}${a.riferimento?' <em style="color:#94a3b8;font-size:11px">('+y(a.riferimento)+")</em>":""}</span>
        </div>`).join(""),e.style.display="block"}async function ia(t,e){let o=document.getElementById("qr-search-input");o&&(o.value=`ORD. ${t} \u2014 ${e}`);let i=document.getElementById("qr-search-dropdown");i&&(i.style.display="none",i.innerHTML=""),Ae=t;let n=document.getElementById("qr-articoli-wrap"),a=document.getElementById("qr-articoli-list"),r=document.getElementById("qr-ordine-header");r&&(r.innerHTML=`<span class="qr-ord-lbl"><b>ORD. ${y(t)}</b></span><span class="qr-cli-lbl">${y(e)}</span>`),a&&(a.innerHTML='<div class="qr-loading"><i class="fas fa-spinner fa-spin"></i> Caricamento articoli...</div>'),n.style.display="block";let s=[],c=window._attiviProd||[];if(c.length>0&&(s=c.filter(d=>String(d.ordine||"").trim()===String(t).trim()&&String(d.archiviato||"").toUpperCase()!=="TRUE")),s.length===0)try{s=(await window.fetchJson("PROGRAMMA PRODUZIONE DEL MESE")).filter(p=>String(p.ordine||"").trim()===String(t).trim()&&String(p.archiviato||"").toUpperCase()!=="TRUE")}catch{a&&(a.innerHTML='<div class="qr-loading" style="color:#ef4444">Errore caricamento. Riprova.</div>');return}if(s.length===0){a&&(a.innerHTML='<div class="qr-loading">Nessun articolo attivo trovato per questo ordine.</div>');return}let l=window.listaStati||[];a.innerHTML=s.map(d=>{let p=d.codice&&d.codice!=="false"?d.codice:"Senza Codice",f=l.find(u=>u.nome.toUpperCase()===(d.stato||"").toUpperCase())||{colore:"#94a3b8"};return`
        <label class="qr-articolo-row" for="qr-art-${d.id_riga}">
            <input type="checkbox" id="qr-art-${d.id_riga}" class="qr-art-chk" data-id-riga="${d.id_riga}" checked>
            <div class="qr-art-info">
                <span class="qr-art-codice">${p}</span>
                <span class="qr-art-qty">\xD7 ${d.qty}</span>
                <span class="qr-art-stato-badge" style="border-color:${f.colore};color:${f.colore}">${(d.stato||"IN ATTESA").toUpperCase()}</span>
            </div>
        </label>`}).join(""),document.querySelectorAll(".qr-art-chk").forEach(d=>d.addEventListener("change",Ie)),Kc(),document.getElementById("qr-stato-wrap").style.display="block",Ie()}function Kc(){let t=Ye,e=document.getElementById("qr-stato-pills");if(!e)return;let o=t?t.statoDefault.toUpperCase():"",i=window.listaStati||[],n=i.length>0?i:[{nome:"IN ATTESA",colore:"#94a3b8"},{nome:"PREPARARE PER LAVORAZIONE",colore:"#64748b"},{nome:"IN LAVORAZIONE",colore:"#f59e0b"},{nome:"IN PRODUZIONE",colore:"#242424"},{nome:"IMBALLATO",colore:"#22c55e"}];rt=null,e.innerHTML=n.map(a=>{let r=a.nome.toUpperCase()===o;return r&&(rt=a.nome),`<button type="button"
                    class="qr-stato-pill${r?" qr-stato-pill-sel":""}"
                    data-stato="${a.nome}"
                    style="border-color:${a.colore};${r?"background:"+a.colore+";color:#fff":"color:"+a.colore}"
                    onclick="_qrScegliStato(this,'${a.nome.replace(/'/g,"\\'")}')">
                    <span class="qr-pill-dot" style="background:${a.colore}"></span>
                    ${a.nome}
                </button>`}).join("")}function na(t,e){rt=e;let o=window.listaStati||[];document.querySelectorAll(".qr-stato-pill").forEach(a=>{let r=o.find(c=>c.nome===a.dataset.stato),s=r?r.colore:"#94a3b8";a.classList.remove("qr-stato-pill-sel"),a.style.background="",a.style.color=s,a.style.borderColor=s});let i=o.find(a=>a.nome===t.dataset.stato),n=i?i.colore:"#94a3b8";t.classList.add("qr-stato-pill-sel"),t.style.background=n,t.style.color="#fff",t.style.borderColor=n,Ie()}function aa(){document.querySelectorAll(".qr-art-chk").forEach(t=>t.checked=!0),Ie()}function sa(){document.querySelectorAll(".qr-art-chk").forEach(t=>t.checked=!1),Ie()}function Ie(){let t=document.getElementById("btn-qr-conferma");if(!t)return;let e=document.querySelectorAll(".qr-art-chk:checked").length;t.disabled=!(e>0&&rt)}async function ra(){if(!rt||!Ae)return;let t=Array.from(document.querySelectorAll(".qr-art-chk:checked"));if(t.length===0){g("Seleziona almeno un articolo.","error");return}let e=document.getElementById("btn-qr-conferma");e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Salvataggio...');let o=t.map(s=>s.dataset.idRiga),i={},n=window._attiviProd||[];o.forEach(s=>{let c=n.find(l=>String(l.id_riga)===String(s));i[s]=c?c.stato:null}),o.forEach(s=>{let c=n.find(l=>String(l.id_riga)===String(s));c&&(c.stato=rt),window._syncKanbanFromStato&&window._syncKanbanFromStato(s,rt)});let a=0,r=[];for(let s of o)await window.aggiornaDato(null,s,"stato",rt,!0)||(a++,r.push(s));a===0?(g(`\u2705 ${o.length} articolo/i \u2192 ${rt}`),window.cacheContenuti&&delete window.cacheContenuti["PROGRAMMA PRODUZIONE DEL MESE"],U("_html_PROGRAMMA PRODUZIONE DEL MESE"),q.invalidate("PROGRAMMA_PRODUZIONE").catch(()=>{})):(r.forEach(s=>{let c=i[s],l=n.find(d=>String(d.id_riga)===String(s));c&&l&&(l.stato=c),c&&window._syncKanbanFromStato&&window._syncKanbanFromStato(s,c)}),g(`\u26A0\uFE0F ${a} errori su ${o.length} articoli \u2014 riprova`,"error"),console.error("[QR Postazione] Rollback",{falliti:r,statiPrec:i})),ii()}function ca(){da(null)}function la(t){da(t)}function da(t){let e=t==null,o=e?{icona:"\u{1F4CD}",nome:"",codice:"",domanda:"",statoDefault:""}:Z[t];document.getElementById("qr-edit-titolo").innerHTML=`<i class="fas fa-map-marker-alt" style="margin-right:8px"></i>${e?"Nuova Postazione":"Modifica Postazione"}`,document.getElementById("qr-edit-icona").value=o.icona||"",document.getElementById("qr-edit-nome").value=o.nome||"",document.getElementById("qr-edit-codice").value=o.codice||"",document.getElementById("qr-edit-domanda").value=o.domanda||"",document.getElementById("qr-edit-idx").value=e?"":t;let i=document.getElementById("qr-edit-stato"),n=window.listaStati||[],a=n.length>0?n:ke.map(c=>({nome:c.statoDefault,colore:"#94a3b8"})),r=[...new Map(a.map(c=>[c.nome,c])).values()];i.innerHTML=r.map(c=>`<option value="${c.nome}" ${c.nome===(o.statoDefault||"")?"selected":""}>${c.nome}</option>`).join("");let s=document.getElementById("modal-qr-edit");s.style.display="flex",s.offsetHeight,s.classList.add("active"),requestAnimationFrame(()=>eo())}function ni(){let t=document.getElementById("modal-qr-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ai(){let e="PROD:"+(document.getElementById("qr-edit-nome")?.value||"").trim().toUpperCase().replace(/[ÀÁÂÃÄÅ]/g,"A").replace(/[ÈÉÊË]/g,"E").replace(/[ÌÍÎÏ]/g,"I").replace(/[ÒÓÔÕÖ]/g,"O").replace(/[ÙÚÛÜ]/g,"U").replace(/[^A-Z0-9]/g,""),o=document.getElementById("qr-edit-codice");o&&(o.value=e)}function ua(){ai(),eo()}async function eo(){let t=(document.getElementById("qr-edit-codice")?.value||"").trim(),e=(document.getElementById("qr-edit-nome")?.value||"").trim(),o=document.getElementById("qr-preview-canvas"),i=document.getElementById("qr-preview-nome"),n=document.getElementById("qr-preview-codice");if(i&&(i.textContent=e||"\u2014"),n&&(n.textContent=t||"\u2014"),!(!o||!t))try{typeof QRCode<"u"&&typeof QRCode.toDataURL=="function"?o.src=await QRCode.toDataURL(t,{width:160,margin:2,color:{dark:"#111827",light:"#ffffff"}}):o.src=`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(t)}`}catch{o.src=`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(t)}`}}function pa(){let t=(document.getElementById("qr-edit-icona")?.value||"").trim()||"\u{1F4CD}",e=(document.getElementById("qr-edit-nome")?.value||"").trim(),o=(document.getElementById("qr-edit-codice")?.value||"").trim().toUpperCase(),i=(document.getElementById("qr-edit-domanda")?.value||"").trim(),n=document.getElementById("qr-edit-stato")?.value||"",a=document.getElementById("qr-edit-idx")?.value;if(!e){g("Inserisci un nome per la postazione.","error");return}if(!o){g("Il codice QR non pu\xF2 essere vuoto.","error");return}let r={icona:t,nome:e,codice:o,domanda:i,statoDefault:n},s=a!==""&&a!==null&&a!==void 0?parseInt(a):null;s!==null&&!isNaN(s)?Z[s]=r:Z.push(r),Xn(),ni(),g("\u2705 Postazione salvata."),window.caricaInterfacciaImpostazioni(),setTimeout(()=>fa(),120)}function ma(t){let e=Z[t];e&&et("Elimina Postazione",`Vuoi eliminare la postazione "${e.nome}"? Il QR code stampato associato non funzioner\xE0 pi\xF9.`,()=>{Z.splice(t,1),Xn(),g("Postazione eliminata."),window.caricaInterfacciaImpostazioni(),setTimeout(()=>fa(),120)},"Elimina")}function fa(){let t=document.getElementById("section-qr-postazioni");if(!t)return;t.style.display="block";let e=t.previousElementSibling;if(e){e.classList.add("settings-row-active");let o=e.querySelector(".settings-row-arrow");o&&(o.style.transform="rotate(180deg)")}}async function si(){for(let t=0;t<Z.length;t++){let e=document.getElementById(`qr-list-canvas-${t}`);if(!e)continue;let o=Z[t].codice||"";if(o)try{typeof QRCode<"u"&&typeof QRCode.toDataURL=="function"?e.src=await QRCode.toDataURL(o,{width:56,margin:1,color:{dark:"#0f172a",light:"#f8fafc"}}):e.src=`https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(o)}`}catch{e.src=`https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(o)}`}}}function ga(){let t=(document.getElementById("qr-edit-codice")?.value||"").trim(),e=(document.getElementById("qr-edit-nome")?.value||"").trim(),o=(document.getElementById("qr-edit-icona")?.value||"").trim()||"\u{1F4CD}",i=(document.getElementById("qr-edit-domanda")?.value||"").trim();if(!t){g("Inserisci nome e codice prima di stampare.","error");return}ri([{codice:t,nome:e,icona:o,domanda:i}])}function va(t){let e=Z[t];e&&ri([e])}function ha(){if(Z.length===0){g("Nessuna postazione da stampare.","error");return}ri(Z)}async function ri(t){let o=`<!DOCTYPE html>
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
${(await Promise.all(t.map(async r=>{let s="";try{typeof QRCode<"u"&&typeof QRCode.toDataURL=="function"&&(s=await QRCode.toDataURL(r.codice,{width:300,margin:2,color:{dark:"#000000",light:"#ffffff"}}))}catch{}return s||(s=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(r.codice)}`),{...r,dataUrl:s}}))).map(r=>`
<div class="card">
  <img src="${r.dataUrl}" alt="QR ${r.nome}">
  <div class="nome">${r.icona||""} ${r.nome}</div>
</div>`).join("")}
</div>
<script>setTimeout(()=>window.print(),800);<\/script>
</body>
</html>`,i=new Blob([o],{type:"text/html; charset=utf-8"}),n=URL.createObjectURL(i);window.open(n,"_blank","width=900,height=700")?setTimeout(()=>URL.revokeObjectURL(n),3e4):(URL.revokeObjectURL(n),g("\u26A0\uFE0F Abilita i popup per la stampa.","error"))}var Z,oi,Rt,xe,Ye,rt,Ae,ei,ba=V(()=>{lt();Tt();dt();wt();Z=[],oi={};Rt=null,xe=null,Ye=null,rt=null,Ae=null;ei=!1});function ya(t){return window.hashSHA256(t)}function wa(){return h?.nome?"avatarColorRecenti_"+h.nome.toUpperCase().trim():null}function Sa(){return h?.nome?"avatarColorHidden_"+h.nome.toUpperCase().trim():null}function xt(){let t=wa();if(!t)return[];try{return JSON.parse(localStorage.getItem(t)||"[]")}catch{return[]}}function ae(t){let e=wa();if(e)try{localStorage.setItem(e,JSON.stringify(t.slice(0,7)))}catch{}}function _a(){let t=Sa();if(!t)return[];try{return JSON.parse(localStorage.getItem(t)||"[]")}catch{return[]}}function Ea(t){let e=Sa();if(e)try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function ci(){let t=document.getElementById("avatar-predefined-swatches");if(!t)return;let e=_a();t.innerHTML="",(window._PREDEFINED_AVATAR_COLORS||[]).forEach(o=>{if(e.includes(o))return;let i=document.createElement("button");i.className="avatar-color-swatch",i.style.background=o,i.dataset.color=o,i.title="Clicca per applicare o eliminare",i.onclick=n=>{n.stopPropagation(),tl(o,n)},t.appendChild(i)})}function Ft(){let t=["avatar-custom-swatches","avatar-custom-swatches-mob"],e=xt();t.forEach(o=>{let i=document.getElementById(o);if(!i)return;let n=o.endsWith("-mob");i.innerHTML="",e.forEach((a,r)=>{let s=document.createElement("button");s.className="avatar-color-swatch avatar-color-custom-swatch",s.style.background=a,s.dataset.color=a,s.title="Clicca per modificare o eliminare",s.onclick=n?c=>{c.stopPropagation(),sl(r,c)}:c=>{c.stopPropagation(),Xc(r,c)},i.appendChild(s)})})}function li(t,e){let o=document.getElementById("avatar-color-editor"),i=document.getElementById("avatar-color-edit-input"),n=document.getElementById("avatar-editor-delete");!o||!i||(i.value=t||"#ff0000",n&&(n.style.display=e?"":"none"),o.style.display="flex")}function di(){let t=document.getElementById("avatar-color-editor");t&&(t.style.display="none"),F=null}function Yc(t){t&&t.stopPropagation(),F=null,li("#ff0000",!1)}function Xc(t,e){e&&e.stopPropagation();let o=xt();F={type:"custom",idx:t},li(o[t]||"#ff0000",!0)}function tl(t,e){e&&e.stopPropagation(),F={type:"predefined",color:t},li(t,!0)}function el(t){t&&t.stopPropagation();let e=document.getElementById("avatar-color-edit-input");if(!e)return;let o=e.value;if(F===null){let i=xt();i.unshift(o),ae(i),Ft()}else if(F.type==="custom"){let i=xt();i[F.idx]=o,ae(i),Ft()}di(),pi(o)}function ol(t){t&&t.stopPropagation(),di()}function il(t){if(t&&t.stopPropagation(),!!F){if(F.type==="custom"){let e=xt();e.splice(F.idx,1),ae(e),Ft()}else if(F.type==="predefined"){let e=_a();e.includes(F.color)||e.push(F.color),Ea(e),ci()}di()}}function nl(t){t&&t.stopPropagation(),Ea([]),ci()}function xa(t,e){let o=document.getElementById("avatar-color-editor-mob"),i=document.getElementById("avatar-color-edit-input-mob"),n=document.getElementById("avatar-editor-delete-mob");!o||!i||(i.value=t||"#ff0000",n&&(n.style.display=e?"":"none"),o.style.display="flex")}function ui(){let t=document.getElementById("avatar-color-editor-mob");t&&(t.style.display="none"),F=null}function al(t){t&&t.stopPropagation(),F=null,xa("#ff0000",!1)}function sl(t,e){e&&e.stopPropagation();let o=xt();F={type:"custom",idx:t},xa(o[t]||"#ff0000",!0)}function rl(t){t&&t.stopPropagation();let e=document.getElementById("avatar-color-edit-input-mob");if(!e)return;let o=e.value;if(F===null){let i=xt();i.unshift(o),ae(i),Ft()}else if(F.type==="custom"){let i=xt();i[F.idx]=o,ae(i),Ft()}ui(),pi(o)}function cl(t){t&&t.stopPropagation(),ui()}function ll(t){if(t&&t.stopPropagation(),!!F){if(F.type==="custom"){let e=xt();e.splice(F.idx,1),ae(e),Ft()}ui()}}function Ia(t){document.documentElement.style.setProperty("--avatar-user-color",t);let e=document.getElementById("user-avatar-btn"),o=document.getElementById("account-ddrop-avatar"),i=document.getElementById("user-avatar-btn-mobile"),n=document.getElementById("account-ddrop-avatar-mob");e&&(e.style.setProperty("background",t,"important"),e.style.setProperty("box-shadow",`0 2px 8px ${t}66`,"important")),i&&(i.style.setProperty("background",t,"important"),i.style.setProperty("box-shadow",`0 2px 8px ${t}66`,"important")),o&&o.style.setProperty("background",t,"important"),n&&n.style.setProperty("background",t,"important"),document.querySelectorAll(".avatar-color-swatch").forEach(a=>{a.classList.toggle("active",a.dataset.color===t)})}function pi(t){if(!h||!h.nome)return;let e=h.nome.toUpperCase().trim();try{localStorage.setItem("avatarColor_"+e,t)}catch{}window._avatarColorsCache&&(window._avatarColorsCache[e]=t),h.nome&&fetch(I,{method:"POST",body:JSON.stringify({azione:"setAvatarColor",username:h.nome,color:t})}).catch(()=>{}),Ia(t)}function dl(t){t&&t.stopPropagation();let e=document.getElementById("account-dropdown");e&&e.classList.toggle("open")}function ul(){let t=document.getElementById("account-dropdown");t&&t.classList.remove("open")}function pl(){U("_impostazioni_cache"),window.paginaAttuale&&(window.cacheContenuti&&delete window.cacheContenuti[window.paginaAttuale],U("_html_"+window.paginaAttuale)),window.location.reload()}function ml(t){t&&t.stopPropagation();let e=document.getElementById("account-dropdown-mobile");e&&e.classList.toggle("open")}function fl(){let t=document.getElementById("account-dropdown-mobile");t&&t.classList.remove("open")}async function gl(){try{let o=(await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"pushInfo"})})).json().catch(()=>({}))).subscriptions||[];if(!o.length){g("Nessun dispositivo registrato in PUSH_SUBSCRIPTIONS","error");return}let i={};o.forEach(r=>{i[r.user]||(i[r.user]=0),i[r.user]++});let n=Object.entries(i).sort((r,s)=>r[0].localeCompare(s[0])).map(([r,s])=>`<tr><td style="padding:6px 10px;font-weight:600">${r}</td><td style="padding:6px 10px;text-align:center">${s} dispositivo${s>1?"i":""}</td></tr>`).join(""),a=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center" onclick="this.remove()">
            <div style="background:#fff;border-radius:16px;padding:24px 28px;max-width:420px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.18)" onclick="event.stopPropagation()">
                <div style="font-size:1.05rem;font-weight:700;margin-bottom:16px">\u{1F50D} Diagnostica Push \u2014 Dispositivi registrati (${o.length})</div>
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
                    <thead><tr style="background:#f1f5f9"><th style="padding:6px 10px;text-align:left">Utente</th><th style="padding:6px 10px">Dispositivi</th></tr></thead>
                    <tbody>${n}</tbody>
                </table>
                <p style="font-size:0.77rem;color:#64748b;margin-top:14px">Tocca fuori per chiudere. Se un utente non compare in questa lista, le sue notifiche NON arriveranno.</p>
            </div>
        </div>`;document.body.insertAdjacentHTML("beforeend",a)}catch(t){g("Errore diagnostica: "+t.message,"error")}}async function vl(){let t=document.getElementById("btn-force-regpush");t&&(t.disabled=!0,t.textContent="\u23F3 Registrazione...");try{let e=await navigator.serviceWorker.register("sw.js",{scope:"./"});await navigator.serviceWorker.ready;let o=await e.pushManager.getSubscription();if(o&&(await fetch(I,{method:"POST",body:JSON.stringify({azione:"eliminaSottoscrizione",endpoint:o.endpoint})}).catch(()=>{}),await o.unsubscribe()),await Notification.requestPermission()!=="granted"){g("Permesso notifiche negato","error"),t&&(t.disabled=!1,t.textContent="\u{1F504} Ri-registra subscription");return}let n=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:fi(window._VAPID_PUBLIC_KEY)});"caches"in window&&await(await caches.open("prod-auth")).put("username",new Response(h.nome.toUpperCase()));let a=n.toJSON(),r=await window._salvaSubVAPID_({endpoint:a.endpoint,p256dh:a.keys?.p256dh,auth:a.keys?.auth});if(r&&(r.status==="saved"||r.status==="updated")){try{localStorage.setItem("_pushStato","ok")}catch{}g("\u2705 Subscription registrata con successo!")}else if(r&&r.status==="errore-verifica"){try{localStorage.setItem("_pushStato","errore-verifica")}catch{}g("\u26A0\uFE0F Subscription creata ma NON confermata sul server. Riprova pi\xF9 tardi.","error")}else g("\u26A0\uFE0F Subscription creata ma salvataggio GAS incerto: "+JSON.stringify(r),"error");mi()}catch(e){console.warn("[Push] forzaRiregistra:",e),g("Errore ri-registrazione: "+e.message,"error")}finally{t&&(t.disabled=!1,t.textContent="\u{1F504} Ri-registra subscription")}}async function hl(){let t=document.getElementById("btn-test-push");t&&(t.disabled=!0,t.textContent="\u23F3 Invio...");try{let o=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"testPush",username:h.nome.toUpperCase()})})).json().catch(()=>({}));if(o.sent>0){let i=(o.log||[]).map(n=>"HTTP "+n.status+(n.body?" ("+String(n.body).substring(0,80)+")":"")).join(" | ");g("\u{1F4E4} Test inviato ("+o.sent+" disp.) \u2014 "+(i||"\u2014"))}else o.status==="no_devices"?g('\u26A0\uFE0F Nessun dispositivo registrato. Clicca "Ri-registra subscription".',"error"):g("\u26A0\uFE0F Risposta server: "+JSON.stringify(o),"error")}catch(e){g("Errore test push: "+e.message,"error")}finally{t&&(t.disabled=!1,t.textContent="\u{1F528} Invia notifica di test")}}function oo(){try{return JSON.parse(localStorage.getItem("notifPrefs")||'{"richieste":true,"assegnazioni":true,"stato":false}')}catch{return{richieste:!0,assegnazioni:!0,stato:!1}}}function bl(t){try{localStorage.setItem("notifPrefs",JSON.stringify(t))}catch{}g("Preferenze notifiche salvate \u2714")}function yl(){let t={richieste:!!document.getElementById("np-richieste")?.checked,assegnazioni:!!document.getElementById("np-assegnazioni")?.checked,stato:!!document.getElementById("np-stato")?.checked};bl(t)}async function wl(){if(!("serviceWorker"in navigator)||!("PushManager"in window)){g("Questo browser non supporta le notifiche push","error");return}try{let t=await navigator.serviceWorker.register("sw.js",{scope:"./"});await navigator.serviceWorker.ready;let e=await t.pushManager.getSubscription();if(e){let o=e.endpoint;await e.unsubscribe();try{await fetch(I,{method:"POST",body:JSON.stringify({azione:"eliminaSottoscrizione",endpoint:o})})}catch{}try{localStorage.removeItem("_pushStato")}catch{}g("Notifiche push disattivate")}else{if(await Notification.requestPermission()!=="granted"){g("Permesso notifiche negato","error");return}e=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:fi(window._VAPID_PUBLIC_KEY)});let i=e.toJSON(),n=await window._salvaSubVAPID_({endpoint:i.endpoint,p256dh:i.keys?.p256dh,auth:i.keys?.auth});if(n&&(n.status==="saved"||n.status==="updated")){try{localStorage.setItem("_pushStato","ok")}catch{}g("Notifiche push attivate \u2714 (registrate su server)")}else if(n&&n.status==="errore-verifica"){try{localStorage.setItem("_pushStato","errore-verifica")}catch{}g('\u26A0 Push attivate ma NON confermate sul server \u2014 usa "Ri-registra subscription"',"error")}else{try{localStorage.setItem("_pushStato","errore-salvataggio")}catch{}g("\u26A0 Push attivate localmente ma salvataggio server incerto","error")}"caches"in window&&await(await caches.open("prod-auth")).put("username",new Response(h.nome.toUpperCase()))}setTimeout(mi,400)}catch(t){console.warn("[Push] toggle:",t),g("Errore attivazione notifiche push","error")}}async function mi(){let t=document.getElementById("btn-toggle-push"),e=document.getElementById("push-status-dot"),o=document.getElementById("push-status-text");if(!(!t&&!e)){if(!("serviceWorker"in navigator)||!("PushManager"in window)){o&&(o.textContent="Non supportate da questo browser"),t&&(t.disabled=!0);return}try{let a=!!await(await navigator.serviceWorker.ready).pushManager.getSubscription(),r="";try{let s=localStorage.getItem("_pushStato");s==="ok"?r=" \u2714 registrato sul server":s==="errore-verifica"?r=" \u26A0 salvato ma non confermato \u2014 ri-registra":s==="errore-salvataggio"?r=" \u26A0 non salvato sul server":s==="errore-subscribe"?r=" \u26A0 errore subscribe":s&&s.startsWith("errore:")&&(r=" \u26A0 "+s.replace("errore:",""))}catch{}t&&(t.innerHTML=a?'<i class="fas fa-bell-slash"></i> Disattiva notifiche push':'<i class="fas fa-bell"></i> Attiva notifiche push',t.style.background=a?"#14532d":"",t.style.borderColor=a?"#16a34a":"",t.style.color=a?"#86efac":""),e&&(e.style.background=a?"#22c55e":"#6b7280"),o&&(o.textContent=a?"Attive su questo dispositivo"+r:"Non attive su questo dispositivo")}catch{}}}function fi(t){let e="=".repeat((4-t.length%4)%4),o=(t+e).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(o);return Uint8Array.from([...i].map(n=>n.charCodeAt(0)))}async function Sl(t){let e=t&&t.files&&t.files[0],o=document.getElementById("csv-upload-filename"),i=document.getElementById("csv-upload-result");if(!e)return;o&&(o.textContent=e.name),i&&(i.style.display="none",i.innerHTML="");let n=await new Promise((s,c)=>{let l=new FileReader;l.onload=d=>s(d.target.result),l.onerror=c,l.readAsText(e,"UTF-8")}),a=n.split(`
`)[0]||"",r=a.split(";").length>=a.split(",").length?";":",";i&&(i.style.display="block",i.innerHTML='<div style="display:flex;align-items:center;gap:8px;color:#64748b;font-size:0.88rem"><i class="fas fa-spinner fa-spin"></i> Import CSV in corso\u2026</div>');try{let s=await _l(n,r,{});if(i)if(s.status==="ok"){let c=`<strong>\u2705 Import completato</strong><br>Nuovi: <strong>${s.nuove||0}</strong> \xB7 Saltati: <strong>${s.saltate||0}</strong>`;s.aggiornate>0&&(c+=` \xB7 Qty aggiornate: <strong>${s.aggiornate}</strong>`),s.reviewCount>0&&(c+=`<br><span style="color:#d97706">\u26A0 <strong>${s.reviewCount}</strong> righe da attenzionare \u2014 vai in Produzione per rivederle.</span>`),i.innerHTML=`<div style="background:#dcfce7;border:1px solid #86efac;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#166534">${c}</div>`,setTimeout(()=>{typeof window.caricaDati=="function"&&window.caricaDati("PROGRAMMA PRODUZIONE DEL MESE",!0)},800)}else i.innerHTML=io(s.msg||s.message||"Errore sconosciuto")}catch(s){i&&(i.innerHTML=io(s.message))}t.value=""}async function _l(t,e,o){return await(await fetch(I,{method:"POST",body:JSON.stringify(Object.assign({azione:"importaOrdiniCSV",csvText:t,separatore:e},o||{}))})).json().catch(()=>({}))}function io(t){return`<div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#991b1b"><strong>\u274C Errore:</strong> ${t||"Errore sconosciuto"}</div>`}async function El(t){let e=t&&t.files&&t.files[0],o=document.getElementById("ldc-upload-filename"),i=document.getElementById("ldc-upload-result");if(!e)return;o&&(o.textContent=e.name),i&&(i.style.display="none",i.innerHTML="");let n=await new Promise((s,c)=>{let l=new FileReader;l.onload=d=>s(d.target.result),l.onerror=c,l.readAsText(e,"UTF-8")}),a=n.split(`
`)[0]||"",r=a.split(";").length>=a.split(",").length?";":",";i&&(i.style.display="block",i.innerHTML='<div style="display:flex;align-items:center;gap:8px;color:#64748b;font-size:0.88rem"><i class="fas fa-spinner fa-spin"></i> Import Lista di Carico in corso\u2026</div>');try{let c=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"importaListaDiCarico",csvText:n,separatore:r})})).json().catch(()=>({}));if(i)if(c.status==="ok"){let l=`<strong>\u2705 Import completato</strong><br>Nuovi: <strong>${c.nuove||0}</strong> \xB7 Aggiornati: <strong>${c.aggiornate||0}</strong> \xB7 Invariati: <strong>${c.invariate||0}</strong>`;c.corrette>0&&(l+=`<br><span style="color:#b45309"><i class="fas fa-exclamation-triangle"></i> ${c.corrette} righe corrette automaticamente (campi con separatore nel testo)</span>`),c.missingCount>0&&(l+=`<br><span style="color:#d97706">\u26A0 <strong>${c.missingCount}</strong> ordini non presenti nel CSV \u2014 vai nel tab Fornitori per archiviarli.</span>`),i.innerHTML=`<div style="background:#dcfce7;border:1px solid #86efac;border-radius:10px;padding:12px 16px;font-size:0.88rem;color:#166534">${l}</div>`,typeof window.invalidateOFCache=="function"&&window.invalidateOFCache()}else i.innerHTML=io(c.msg||c.message||"Errore sconosciuto")}catch(s){i&&(i.innerHTML=io(s.message))}t.value=""}async function Oe(){let t="_impostazioni_cache",e="_impostazioni_stati_forn_cache",i=pt(t,1/0);if(i){try{let n=typeof i=="string"?JSON.parse(i):i;if(n.stati&&n.stati.length){window.listaStati=n.stati,window.listaOperatori=n.operatori||[],window._distintaHeaderAzienda=String(n.distintaHeaderAzienda||""),Aa(n.overviewStati);let a=pt(e,1/0);if(a)try{let r=typeof a=="string"?JSON.parse(a):a;Array.isArray(r)&&r.length&&(window.listaStatiFornitori=r)}catch{}pt(t,3e5)||no().catch(r=>console.warn("[impostazioni] bg refresh:",r));return}}catch(n){console.warn("[impostazioni] cache JSON corrotta, ricarico dal server:",n)}U(t)}await no()}async function no(){let t="_impostazioni_cache",e="_impostazioni_stati_forn_cache";try{let i=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"getImpostazioni",noCache:!0})})).json();window.listaStati=i.stati&&i.stati.length?i.stati:window._defaultListaStati_(),window.listaOperatori=i.operatori||[],window._distintaHeaderAzienda=String(i.distintaHeaderAzienda||""),Aa(i.overviewStati),J(t,JSON.stringify({stati:window.listaStati,operatori:window.listaOperatori,overviewStati:i.overviewStati,distintaHeaderAzienda:window._distintaHeaderAzienda}))}catch(o){console.warn("[Boot] _fetchImpostazioniDaServer:",o),g("Impostazioni non aggiornate \u2014 uso dati locali.","warning")}try{let i=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"getStatiFornitoriConfig"})})).json();i.stati&&i.stati.length&&(window.listaStatiFornitori=i.stati,J(e,JSON.stringify(i.stati)))}catch{}}function Aa(t){t&&(Array.isArray(t.art)&&t.art.length&&(window._ovStatiArt=t.art.map(e=>e.toUpperCase().trim())),Array.isArray(t.ord)&&t.ord.length&&(window._ovStatiOrd=t.ord.map(e=>e.toUpperCase().trim())))}function xl(t,e){let o=document.getElementById(t);if(!o)return;let i=e.querySelector(".settings-row-arrow"),n=o.style.display==="block";o.style.display=n?"none":"block",i&&(i.style.transform=n?"":"rotate(180deg)"),e.classList.toggle("settings-row-active",!n),!n&&(t==="section-utenti"||t==="section-team-utenti")&&Ce(),!n&&t==="section-qr-postazioni"&&requestAnimationFrame(()=>si())}async function Ce(){let t=document.getElementById("lista-utenti-config");if(t){t.innerHTML='<div class="centered-msg small">Caricamento...</div>';try{let o=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"getUtenti"})})).json();if(!o.length){t.innerHTML='<p class="centered-msg small">Nessun utente creato. Clicca "+ Aggiungi Utente".</p>';return}t.innerHTML=o.map(i=>{let n=i.id_riga,a=(i.username||"").trim(),r=(i.email||"").trim(),s=(i.ruolo||"OPERATORE").trim().toUpperCase(),c=Number(i.max_utenti)||1;return`
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
                    <input type="email" class="input-field-modern" id="ut-email-${n}" placeholder="Email" value="${r.replace(/"/g,"&quot;")}">
                    <select class="input-field-modern" id="ut-ruolo-${n}">
                        <option value="OPERATORE" ${s==="OPERATORE"?"selected":""}>Operatore</option>
                        <option value="COMMERCIALE" ${s==="COMMERCIALE"?"selected":""}>Commerciale</option>
                        <option value="MASTER" ${s==="MASTER"?"selected":""}>Admin</option>
                    </select>
                </div>
                <div class="grid-2col gap-8" style="margin-top:10px">
                    <input type="number" class="input-field-modern" id="ut-max-${n}" min="1" max="10" value="${c}">
                    <input type="password" class="input-field-modern" id="ut-pass-${n}" placeholder="Nuova password (opzionale)">
                </div>
                <div class="utente-max" style="margin-top:8px; opacity:0.85">Lascia la password vuota per non cambiarla.</div>
            </div>`}).join("")}catch{t.innerHTML='<p class="centered-msg small text-danger">Errore nel caricamento utenti.</p>'}}}async function Il(t){let e=Number(t);if(!e)return;let o=document.getElementById(`ut-email-${e}`),i=document.getElementById(`ut-username-${e}`),n=document.getElementById(`ut-ruolo-${e}`),a=document.getElementById(`ut-max-${e}`),r=document.getElementById(`ut-pass-${e}`),s=(o?.value||"").trim(),c=(i?.value||"").trim(),l=(n?.value||"OPERATORE").trim().toUpperCase(),d=parseInt(a?.value||"1",10),p=(r?.value||"").trim();if(!s||!c){g("Email e username sono obbligatori.","error");return}if(p&&p.length<4){g("La password deve essere di almeno 4 caratteri.","error");return}let f="";p&&(f=await ya(p));try{let m=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"aggiornaUtente",id_riga:e,email:s,username:c,ruolo:l,max_utenti:d,hash:f})})).json();m.status==="success"?(g("Utente aggiornato."),r&&(r.value=""),Ce()):g(m.message||"Errore aggiornamento utente.","error")}catch{g("Errore di connessione.","error")}}function Al(){let t=document.getElementById("form-nuovo-utente");t&&(t.style.display="block",document.getElementById("nu-email").value="",document.getElementById("nu-username").value="",document.getElementById("nu-password").value="",document.getElementById("nu-ruolo").value="OPERATORE",document.getElementById("nu-max").value="1")}async function Ol(){let t=(document.getElementById("nu-email")?.value||"").trim(),e=(document.getElementById("nu-username")?.value||"").trim(),o=(document.getElementById("nu-password")?.value||"").trim(),i=document.getElementById("nu-ruolo")?.value||"OPERATORE",n=parseInt(document.getElementById("nu-max")?.value||"1");if(!t||!e||!o){g("Compila tutti i campi: email, username, password.","error");return}if(o.length<4){g("La password deve essere di almeno 4 caratteri.","error");return}let a=document.querySelector("#form-nuovo-utente .btn-modal-send");a.disabled=!0,a.innerHTML='<i class="fas fa-spinner fa-spin"></i>';try{let r=await ya(o),c=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"creaUtente",email:t,username:e,hash:r,ruolo:i,max_utenti:n})})).json();c.status==="success"?(g(`Utente "${e}" creato con successo!`),document.getElementById("form-nuovo-utente").style.display="none",Ce()):g(c.message||"Errore nella creazione utente.","error")}catch{g("Errore di connessione.","error")}a.disabled=!1,a.innerHTML="Salva Utente"}function Cl(t,e){et("Elimina Utente",`Eliminare l'utente "${e}"? Non potr\xE0 pi\xF9 accedere.`,async()=>{try{let i=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"eliminaUtente",id_riga:t})})).json();i.status==="success"?(g(`Utente "${e}" eliminato.`),Ce()):g(i.message||"Errore durante eliminazione.","error")}catch{g("Errore di connessione.","error")}},"Elimina")}function $l(t){let e=Number(t||0);if(!e)return"-";try{return new Date(e).toLocaleString("it-IT")}catch{return"-"}}async function gi(){if(!h||h.ruolo!=="MASTER")return;let t=document.getElementById("session-stats-wrap");if(t){t.innerHTML='<div style="font-size:12px;color:#64748b">Caricamento sessioni...</div>';try{let o=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"getSessionStats",username:String(h.nome||"").toUpperCase(),email:String(h.email||"").toLowerCase()})})).json();if(!o||o.status!=="success"){t.innerHTML='<div style="font-size:12px;color:#b91c1c">Impossibile caricare statistiche sessioni.</div>';return}let i=o.totals||{},a=(Array.isArray(o.byUser)?o.byUser:[]).slice(0,8);t.innerHTML=`
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Sessioni attive: <strong>${i.activeSessions||0}</strong></span>
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Utenti attivi: <strong>${i.usersWithSessions||0}</strong></span>
                <span style="padding:4px 8px;border-radius:999px;background:#f1f5f9;font-size:11px;color:#334155">Righe sessione: <strong>${i.rows||0}</strong></span>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
                <div style="display:grid;grid-template-columns:1.2fr .6fr .8fr;background:#f8fafc;padding:8px 10px;font-size:11px;font-weight:700;color:#475569">
                    <div>Utente</div><div>Sessioni</div><div>Ultimo accesso</div>
                </div>
                ${a.length?a.map(function(r){return`<div style="display:grid;grid-template-columns:1.2fr .6fr .8fr;padding:8px 10px;font-size:12px;border-top:1px solid #f1f5f9">
                        <div>${r.username||"-"}</div>
                        <div>${r.activeSessions||0}</div>
                        <div>${$l(r.latestSeenTs)}</div>
                    </div>`}).join(""):'<div style="padding:10px;font-size:12px;color:#64748b">Nessuna sessione attiva</div>'}
            </div>
        `}catch{t.innerHTML='<div style="font-size:12px;color:#b91c1c">Errore rete durante il caricamento sessioni.</div>'}}}async function Tl(){let t=(document.getElementById("session-username-target")?.value||"").trim().toUpperCase();if(!t){g("Inserisci uno username da revocare.","error");return}if(confirm("Revocare tutte le sessioni per "+t+"?"))try{let o=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"revocaSessioniUtente",usernameTarget:t})})).json();if(o&&o.status==="success"){g("Sessioni revocate: "+(o.removed||0)),gi();return}g(o&&(o.message||o.msg)||"Revoca non riuscita.","error")}catch{g("Errore rete durante revoca sessioni.","error")}}async function Rl(){if(confirm("Revocare TUTTE le sessioni (eccetto quella corrente)?"))try{let e=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"revocaTutteSessioni"})})).json();if(e&&e.status==="success"){g("Sessioni globali revocate: "+(e.removed||0)),gi();return}g(e&&(e.message||e.msg)||"Revoca globale non riuscita.","error")}catch{g("Errore rete durante revoca globale.","error")}}function Ht(){let t=document.getElementById("contenitore-dati");if(!t)return;let e=window.listaStati||[],o=window.TW||{};t.innerHTML=`
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
                        ${i.map((n,a)=>{let r=n.stato||n.nome||"",s=n.colore||"#94a3b8";return`<div class="config-row-modern row" data-idx="${a}">
                                <div class="color-picker-wrapper">
                                    <input type="color" value="${s}" class="color-overlay"
                                           onchange="(window.listaStatiFornitori||[])[${a}].colore=this.value; segnaModifica(); caricaInterfacciaImpostazioni();">
                                    <div class="status-dot-custom" style="--bg-color:${s};"></div>
                                </div>
                                <input type="text" class="input-flat flex-grow" value="${r}" onchange="(window.listaStatiFornitori||[])[${a}].stato=this.value.toUpperCase(); segnaModifica();">
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
            ${h.ruolo==="MASTER"?`
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
            ${h.ruolo==="MASTER"?`
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
            ${h.ruolo==="MASTER"?`
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
                        <div class="settings-row-sub">${Z.length} postazioni configurate</div>
                    </div>
                </div>
                <i class="fas fa-chevron-down settings-row-arrow"></i>
            </div>
            <div id="section-qr-postazioni" class="settings-section-body" style="display:none">
                <div class="card-settings">
                    <div id="qr-postazioni-lista">
                        ${Z.length===0?'<div style="text-align:center;color:#9ca3af;padding:20px;font-size:13px">Nessuna postazione configurata</div>':Z.map((i,n)=>`
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
                        ${h.ruolo==="MASTER"?'<button onclick="_mostraDiagnosticaPush()" style="flex:1;min-width:120px;padding:10px 14px;font-size:0.82rem;font-weight:600;border-radius:10px;border:1px solid #fcd34d;background:#fefce8;color:#92400e;cursor:pointer;transition:background 0.15s">\u{1F50D} Diagnostica Push</button>':""}
                    </div>
                    <div style="margin-top:20px;border-top:1px solid rgba(255,255,255,0.07);padding-top:16px">
                        <div style="font-size:0.78rem;font-weight:600;color:#9ca3af;letter-spacing:.5px;margin-bottom:12px">TIPOLOGIE DI AVVISI</div>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-richieste" onchange="_onNotifPrefChange()"
                                ${oo().richieste?"checked":""}>
                            <span><i class="fas fa-comment-dots" style="color:#242424"></i>&nbsp;Nuove richieste / messaggi</span>
                        </label>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-assegnazioni" onchange="_onNotifPrefChange()"
                                ${oo().assegnazioni?"checked":""}>
                            <span><i class="fas fa-user-check" style="color:#34d399"></i>&nbsp;Assegnazioni ordine</span>
                        </label>
                        <label class="notif-pref-row">
                            <input type="checkbox" id="np-stato" onchange="_onNotifPrefChange()"
                                ${oo().stato?"checked":""}>
                            <span><i class="fas fa-sync-alt" style="color:#f59e0b"></i>&nbsp;Cambi di stato articoli</span>
                        </label>
                    </div>
                </div>
            </div>

            ${h.ruolo==="MASTER"?`
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
    `,z(t),requestAnimationFrame(()=>si()),h&&ql("lista-stati-config",i=>{let n=[...i.querySelectorAll("[data-idx]")],a=n.map(r=>(window.listaStati||[])[+r.dataset.idx]);window.listaStati&&(window.listaStati.length=0,a.forEach((r,s)=>{window.listaStati.push(r),n[s].dataset.idx=s})),se()})}async function kl(){let t=document.getElementById("diag-revision"),e=document.getElementById("diag-lastcheck"),o=document.getElementById("diag-online"),i=document.getElementById("diag-cache");if(!t)return;if(t.textContent=N.lastRevisionValue!==null?String(N.lastRevisionValue):"\u2014",N.lastCheckTs){let a=new Date(N.lastCheckTs);e.textContent=a.toLocaleTimeString("it-IT")}else e.textContent="\u2014";let n=N.lastOnlineList;n&&n.length>0?o.textContent=n.map(a=>a.nome+(a.pagina?" ("+a.pagina+")":"")).join(", "):o.textContent="Nessuno";try{let a=await q.listEntries();a.length?i.innerHTML=a.map(r=>{let s=Math.round((Date.now()-r.timestamp)/1e3),c=Date.now()-r.timestamp>q.TTL;return`<span style="display:block;font-family:monospace;font-size:0.78rem;color:${c?"#ef4444":"#16a34a"}">${r.chiave} <em style="color:#94a3b8">(${s}s fa${c?" \xB7 stale":""})</em></span>`}).join(""):i.textContent="Vuota"}catch{i.textContent="Errore lettura cache"}}async function Ll(){try{let e=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"forceRevisionBump",sessionToken:window._getSessionToken_()})})).json();e&&e.status==="ok"?g("\u2714 Revision bumped a "+e.nuovaRevision+" \u2014 tutti i client aggiorneranno entro 15s"):e&&e.status==="auth_error"?window._gestisciAuthError_&&window._gestisciAuthError_(e.message):g("\u26A0\uFE0F "+(e&&e.message?e.message:"Errore"),"error")}catch{g("\u26A0\uFE0F Errore di rete","error")}}async function Pl(){if(confirm("Svuota la cache IndexedDB e ricarica la pagina?")){try{await q.clear()}catch{}location.reload()}}function zl(t){confirm("Sei sicuro di voler eliminare questo stato?")&&((window.listaStati||[]).splice(t,1),se(),Ht())}function Ml(){(window.listaStati||[]).push({nome:"NUOVO",colore:"#94a3b8"}),se(),Ht()}function Nl(t){confirm("Sei sicuro di voler eliminare questo stato?")&&((window.listaStatiFornitori||[]).splice(t,1),se(),Ht())}function Dl(){window.listaStatiFornitori||(window.listaStatiFornitori=[]),window.listaStatiFornitori.push({stato:"NUOVO",colore:"#94a3b8"}),se(),Ht()}function se(){window.modifichePendenti=!0;let t=document.getElementById("btn-salva-globale");t&&(t.style.background="#ef4444",t.innerHTML="<i class='fas fa-exclamation-triangle'></i> Salva Modifiche Ora!")}function ql(t,e){let o=document.getElementById(t);if(!o)return;let i=null;o.addEventListener("dragstart",function(c){if(!(o.querySelector(".dnd-handle, .drag-handle")&&!c.target.closest(".dnd-handle, .drag-handle"))){if(i=c.target.closest('[draggable="true"]'),!i||!o.contains(i)){i=null;return}i.classList.add("dnd-dragging"),c.dataTransfer.effectAllowed="move",c.dataTransfer.setData("text/plain","")}}),o.addEventListener("dragover",function(c){if(c.preventDefault(),!i)return;let l=c.target.closest('[draggable="true"]');if(!l||l===i||!o.contains(l))return;let d=l.getBoundingClientRect();c.clientY<d.top+d.height/2?o.insertBefore(i,l):o.insertBefore(i,l.nextSibling)}),o.addEventListener("dragend",function(c){i&&(i.classList.remove("dnd-dragging"),e&&e(o)),i=null}),o.addEventListener("drop",function(c){c.preventDefault(),c.stopPropagation()});let n=null,a=null,r=0,s=0;o.addEventListener("touchstart",function(c){let l=!!o.querySelector(".dnd-handle, .drag-handle"),d=c.target.closest('[draggable="true"]');if(!d||!o.contains(d)||l&&!c.target.closest(".dnd-handle, .drag-handle"))return;n=d;let p=c.touches[0],f=We(d,p.clientX,p.clientY,{opacity:.85,borderRadius:"14px",shadow:"0 10px 30px rgba(0,0,0,0.25)"});a=f.ghost,r=f.offX,s=f.offY,d.style.opacity="0.25",d.style.transform="scale(0.97)"},{passive:!0}),o.addEventListener("touchmove",function(c){if(!n||!a)return;c.preventDefault();let l=c.touches[0];Ze(a,l.clientX,l.clientY,r,s);let d=Kn(a,l.clientX,l.clientY,'[draggable="true"]');if(d&&d!==n&&o.contains(d)){let p=d.getBoundingClientRect();o.insertBefore(n,l.clientY<p.top+p.height/2?d:d.nextSibling)}},{passive:!1}),o.addEventListener("touchend",function(){n&&(n.style.opacity="",n.style.transform="",Qe(a),a=null,e&&e(o),n=null)})}async function Bl(){try{let e=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"salva_impostazioni_globali",sessionToken:window._getSessionToken_(),stati:window.listaStati||[],operatori:[],distintaHeaderAzienda:String(window._distintaHeaderAzienda||"").trim()})})).json().catch(()=>({}));if(e.status==="success"){if(window.listaStatiFornitori&&window.listaStatiFornitori.length)try{await fetch(I,{method:"POST",body:JSON.stringify({azione:"saveStatiFornitoriConfig",stati:window.listaStatiFornitori})})}catch{}g("Impostazioni salvate correttamente!"),window.modifichePendenti=!1;let o=document.getElementById("btn-salva-globale");o&&(o.style.background="",o.innerHTML="<i class='fas fa-save'></i> Salva Impostazioni"),U("_impostazioni_cache"),U("_impostazioni_stati_forn_cache"),window.cacheContenuti&&Object.keys(window.cacheContenuti).forEach(i=>delete window.cacheContenuti[i]),Object.keys(localStorage).filter(i=>i.startsWith("_html_")).forEach(i=>localStorage.removeItem(i)),await no()}else g("Errore: "+(e.message||"risposta inattesa dal server"),"error")}catch{g("Errore nel salvataggio.","error")}}function Oa(){window._avatarStartAdd=Yc,window._avatarConfirmEdit=el,window._avatarCancelEdit=ol,window._avatarDeleteEdit=il,window._avatarRipristinaPredefiniti=nl,window._renderPredefinedSwatches=ci,window._renderCustomSwatches=Ft,window._applyAvatarColorUI=Ia,window._setAvatarColor=pi,window._avatarStartAddMob=al,window._avatarConfirmEditMob=rl,window._avatarCancelEditMob=cl,window._avatarDeleteEditMob=ll,window.toggleAccountMenu=dl,window.chiudiAccountMenu=ul,window._aggiornaPagina=pl,window.toggleAccountMenuMobile=ml,window.chiudiAccountMenuMobile=fl,window._vapidB64ToUint8_=fi,window._mostraDiagnosticaPush=gl,window._forzaRiregistraPush=vl,window._testPushNotifica=hl,window._togglePushPermission=wl,window._aggiornaUINotifiche=mi,window._onNotifPrefChange=yl,window._getNotifPrefs=oo,window.importaCSVDaFile=Sl,window.importaListaDiCaricoDaFile=El,window.caricaInterfacciaImpostazioni=Ht,window.caricaDatiIniziali=Oe,window._fetchImpostazioniDaServer=no,window.toggleSettingsSection=xl,window.caricaListaUtenti=Ce,window.salvaModificheUtente=Il,window.apriFormNuovoUtente=Al,window.salvaUtenteNuovo=Ol,window.eliminaUtente=Cl,window._caricaSessionStats_=gi,window._revocaSessioniUtenteDaUI=Tl,window._revocaTutteSessioniDaUI=Rl,window._aggiornaDiagnosticaSync=kl,window._forceRevisionBump=Ll,window._svuotaCacheLocale=Pl,window.azioneEliminaStato=zl,window.azioneAggiungiStato=Ml,window.azioneEliminaStatoFornitori=Nl,window.azioneAggiungiStatoFornitori=Dl,window.segnaModifica=se,window.salvaTutteImpostazioni=Bl,window.apriScannerQR=ea,window._chiudiScannerQR=Xe,window._processaQR=to,window._chiudiModaleQRAzione=ii,window._qrFiltroOrdini=oa,window._qrSelezionaOrdine=ia,window._qrScegliStato=na,window._qrSelezionaTutti=aa,window._qrDeselezionaTutti=sa,window._confermaSpostaPostazione=ra,window._qrApriModalNuova=ca,window._qrApriModalModifica=la,window._qrChiudiModalEdit=ni,window._qrAggiornaCodice=ai,window._qrRicalcolaCodice=ua,window._qrSalvaPostazione=pa,window._qrEliminaPostazione=ma,window._qrStampaSingola=ga,window._qrStampaSingolaIdx=va,window._qrStampaTutte=ha,window._qrAggiornaPrevQR=eo}function Ca(){Yn(),document.addEventListener("click",function(t){let e=document.getElementById("account-dropdown"),o=document.getElementById("user-avatar-btn");e&&e.classList.contains("open")&&!e.contains(t.target)&&t.target!==o&&!o.contains(t.target)&&e.classList.remove("open")}),document.addEventListener("click",function(t){let e=document.getElementById("account-dropdown-mobile"),o=document.getElementById("user-avatar-btn-mobile");!e||!o||e.classList.contains("open")&&!e.contains(t.target)&&t.target!==o&&!o.contains(t.target)&&e.classList.remove("open")}),document.addEventListener("visibilitychange",function(){document.visibilityState==="hidden"&&Xe()})}var F,$a=V(()=>{lt();Tt();ut();dt();Jt();wt();Ke();ba();F=null});function re(){return[...S.ovStatiArt,...S.ovStatiOrd]}function gt(t){let e=String(t||"").toUpperCase().trim();return e==="IMBALLATO"||e==="SPEDITO/CONSEGNATO"||e==="SPEDITO"||e==="CONSEGNATO"}var S,ao=V(()=>{S={ultimiDatiProduzione:null,pollProdTimer:null,POLL_PROD_MS:1e4,lastKanbanDragTs:0,mutationInFlight:0,mutationLastDone:0,prodCacheInvalidateTimer:null,attiviProd:[],ordiniAutocompleteCache:[],ovStatiArt:["PREPARARE","MANDA IN LAVORAZIONE","IN LAVORAZIONE","TORNATO DALLA LAVORAZIONE"],ovStatiOrd:["IN PRODUZIONE","IMBALLATO"],datiArchLazy:null}});function jt(t,e){if(!t||t.length===0)return"";let o=window.TW,i={};t.forEach(r=>{if(!e&&String(r.archiviato).toUpperCase()==="TRUE")return;let s=r.ordine||"N.D.";i[s]||(i[s]=[]),i[s].push(r)});let n="";return Object.keys(i).sort((r,s)=>{let c=i[r].some(m=>String(m.last_modified_by||"").startsWith("CSV_REVIEW")),l=i[s].some(m=>String(m.last_modified_by||"").startsWith("CSV_REVIEW"));if(c&&!l)return-1;if(!c&&l)return 1;let d=(i[r][0].cliente||"").trim().toUpperCase(),p=!d||d==="DA DEFINIRE"?(i[r][0].riferimento||r).toUpperCase():d,f=(i[s][0].cliente||"").trim().toUpperCase(),u=!f||f==="DA DEFINIRE"?(i[s][0].riferimento||s).toUpperCase():f;return p<u?-1:p>u?1:r<s?-1:r>s?1:0}).forEach(r=>{let s=i[r],c=s[0].cliente,l=s[0].riferimento||"",d=l?`<span class="riferimento-label">(${y(l)})</span>`:"",p=e?"archivio-wrapper":"",u=s.some(_=>String(_.last_modified_by||"").startsWith("CSV_REVIEW"))?" csv-review-order":"",m=e?"archivio-header":"",b=e?"#475569":"inherit",w;if(r.includes("/")){let _=r.indexOf("/"),T=r.substring(0,_),L=r.substring(_+1),M=L.length>3?L.substring(0,3)+".":L;w=`${T}/${M}`}else w=r.length>14?r.substring(0,14)+"\u2026":r;let v="";if(!e)if(window._isUtenteEsente()){let _=[...new Set(s.flatMap(M=>!gt(M.stato)&&M.assegna&&M.assegna!==""&&M.assegna!=="undefined"?M.assegna.split(",").map(B=>window._normNome(B.trim())).filter(Boolean):[]))],T=_.length?_.map(window._normNome).join(", "):"Libero",L=window.listaOperatori.map(M=>{let B=_.some(bs=>bs.toUpperCase()===window._normNome(M.nome).toUpperCase()),nt=window._getOpColor(M.nome.trim()),Lt=M.nome.trim().replace(/'/g,"\\'"),hs=r.replace(/'/g,"\\'");return`<button type="button" class="op-option${B?" is-selected":""}" onclick="selezionaOpAssegnaOrdine(this,'${hs}','${Lt}')"><span class="op-opt-dot" style="background:${nt}"></span><span>${window._normNome(M.nome)}</span>${B?'<i class="fas fa-check op-check-icon"></i>':""}</button>`}).join("");v=`<div class="op-dropdown op-dropdown-ord" data-nord="${r}" data-assegna-ord="${_.join(",").replace(/"/g,"&quot;")}"><button type="button" class="op-trigger op-trigger-ord" onclick="event.stopPropagation(); toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${T}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${L}</div></div>`}else{let _=(h?.nome||"").toUpperCase().trim();s.some(L=>!gt(L.stato)&&L.assegna&&L.assegna.split(",").some(M=>M.trim().toUpperCase()===_))||(v=`<button class="btn-assegnami btn-assegnami-ord" onclick="event.stopPropagation(); autoAssegnamiOrdine('${r.replace(/'/g,"\\'")}')" title="Assegnami a tutto l'ordine"><i class="fas fa-user-plus"></i></button>`)}let x=r.replace(/'/g,"\\'"),O=(c||"").replace(/'/g,"\\'"),E=s[0].id_riga,$="";if(!e){let _=s.map(B=>String(B.stato||"IN ATTESA").toUpperCase().trim()).filter((B,nt,Lt)=>Lt.indexOf(B)===nt),T=_.length===1?_[0]:`${_.length} Stati`,L=window.listaStati.find(B=>B.nome===_[0])||{colore:"#e2e8f0"},M=window.listaStati.map(B=>`<button type="button" class="stato-option" onclick="event.stopPropagation(); selezionaStatoOrdine(this,'${r.replace(/'/g,"\\'")}','${B.nome}','${B.colore}')"><span class="stato-opt-dot" style="background:${B.colore}"></span><span>${B.nome}</span></button>`).join("");$=`<div class="stato-dropdown stato-dropdown-ord" data-nord="${r}"><button type="button" class="stato-trigger" onclick="event.stopPropagation(); toggleStatoDropdown(this)" title="Cambia stato tutte righe"><span class="stato-dot" style="background:${L.colore}"></span><span class="stato-label-txt">${T}</span><i class="fas fa-chevron-down stato-chevron"></i></button><div class="stato-popup">${M}</div></div>`}let k=`apriModalAiuto('${E}', 'INTERO ORDINE', '${x}', '${O}')`,R=`gestisciArchiviazione('${x}')`,C=`apriModalSollecito('','${x}','${O}','Intero Ordine')`,D=`gestisciRipristino('${x}', 'ORDINE')`,G="";e?G=`<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${D}"><i class="fa-solid fa-rotate-left"></i> Ripristina</button>`:(G+=`<button class="ord-menu-item" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${k}"><i class="fa-regular fa-envelope"></i> Chiedi</button>`,G+=`<button class="ord-menu-item ord-menu-item--danger" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${R}"><i class="fa-solid fa-box-archive"></i> Archivia</button>`,(window._isCommerciale()||window._isUtenteEsente())&&(G+=`<button class="ord-menu-item ord-menu-item--warn" onclick="event.stopPropagation();chiudiTuttiMenuAzioni();${C}"><i class="fa-solid fa-calendar-alt"></i> Scadenza</button>`));let ct=e?"":`${v}${$}`,tt=`<div class="ord-azioni-menu" onclick="event.stopPropagation()">
            <button class="ord-azioni-trigger" onclick="toggleMenuAzioni(this)" title="Azioni">
                <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="ord-azioni-popup">${G}</div>
        </div>`,P=ct+tt;n+=`
        <div class="ordine-wrapper ${p}${u}" data-ordine="${r}" data-cliente="${(c||"").toLowerCase().replace(/"/g,"")}" data-riferimento="${(l||"").toLowerCase().replace(/"/g,"")}" data-codici="${s.map(_=>_.codice&&_.codice!=="false"?_.codice:"").join("|").toLowerCase()}">
            <div class="riga-ordine ${m}" onclick="toggleAccordion(this)">
                <div class="flex-grow">
                    <span class="order-title" style="--order-color:${b}" title="${y(c)}">${y(c)} ${d}</span>
                </div>
                <div class="order-info">
                    <div class="badge-count ${o.pill}" title="ORD.${r}"><span class="badge-ord-num">ORD.${w}</span><span class="badge-sep">\xB7</span>${s.length} ART.</div>
                    ${P}
                </div>
            </div>
            <div class="dettagli-container${e?" hidden":""}">
                ${s.map(_=>e?Fl(_,r):Ul(_,r,c)).join("")}
            </div>
        </div>`}),n}function Ul(t,e,o){let i=window.TW,n=(t.stato||"IN ATTESA").toUpperCase(),a=window.listaStati.find(u=>u.nome===n)||{colore:"#e2e8f0"},r=t.codice&&t.codice!=="false"?t.codice:"Senza Codice",s=String(t.last_modified_by||""),l=s.startsWith("CSV_REVIEW")?` csv-review-blink${s==="CSV_REVIEW_MISSING"?" csv-review-missing":" csv-review-finish"}`:"",d="";s==="CSV_REVIEW_MISSING"?d=`<div class="csv-review-banner"><span class="csv-review-badge missing"><i class="fas fa-exclamation-triangle"></i> Assente dal CSV</span><button class="btn-csv-resolve" onclick="event.stopPropagation();csvReviewResolve('${t.id_riga}',this)"><i class="fas fa-check"></i> Risolvi</button></div>`:s==="CSV_REVIEW_FINISH"&&(d=`<div class="csv-review-banner"><span class="csv-review-badge finish"><i class="fas fa-paint-brush"></i> Finitura rilevata</span><button class="btn-csv-resolve" onclick="event.stopPropagation();csvReviewResolve('${t.id_riga}',this)"><i class="fas fa-check"></i> Risolvi</button></div>`);let p=t.assegna&&t.assegna!==""&&t.assegna!=="undefined"?t.assegna.split(",").map(u=>window._normNome(u.trim())).filter(Boolean):[],f;if(window._isUtenteEsente()){let u=p.length?p.map(window._normNome).join(", "):"Libero",m=window.listaOperatori.map(v=>{let x=p.some($=>$.toUpperCase()===window._normNome(v.nome).toUpperCase()),O=window._getOpColor(v.nome.trim()),E=v.nome.trim().replace(/'/g,"\\'");return`<button type="button" class="op-option${x?" is-selected":""}" onclick="selezionaOpAssegna(this,'${t.id_riga}','${e}','${E}')"><span class="op-opt-dot" style="background:${O}"></span><span>${window._normNome(v.nome)}</span>${x?'<i class="fas fa-check op-check-icon"></i>':""}</button>`}).join(""),b=window._normNome(h?.nome||"").toUpperCase().trim(),w=p.some(v=>v.toUpperCase()===b)?"":`<button class="btn-assegnami btn-assegnami-inline" onclick="autoAssegnami('${t.id_riga}','${e}',this)" title="Assegnami"><i class="fas fa-user-plus"></i></button>`;f=`<div class="op-assign-inline"><div class="op-dropdown" data-id-riga="${t.id_riga}" data-assegna="${(t.assegna||"").replace(/"/g,"&quot;")}" data-nord="${e}"><button type="button" class="op-trigger" onclick="toggleOpDropdown(this)"><i class="fas fa-user-tag op-icon"></i><span class="op-trigger-label">${u}</span><i class="fas fa-chevron-down op-chevron"></i></button><div class="op-popup">${m}</div></div>${w}</div>`}else{let u=window._normNome(h?.nome||"").toUpperCase().trim(),m=p.map(v=>{let x=window._getOpColor(v),O=v.replace(/'/g,"\\'"),E=v.toUpperCase()===u?`<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${t.id_riga}','${e}','${O}')" title="Rimuovi assegnazione">&times;</button>`:"";return`<span class="badge-operatore" data-nome="${v}" style="background:${x};border-color:${x}">${v}${E}</span>`}).join(""),w=p.some(v=>v.toUpperCase()===u)?"":`<button class="btn-assegnami" onclick="autoAssegnami('${t.id_riga}','${e}',this)"><i class="fas fa-user-plus"></i> Assegnami</button>`;f=`<div class="visualizza-operatori" data-id-riga="${t.id_riga}" data-assegna="${(t.assegna||"").replace(/"/g,"&quot;")}" data-nord="${e}">${m||'<span class="operatore-libero">Libero</span>'}${w}</div>`}return`
    <div class="item-card ${i.card}${l}" data-id-riga="${t.id_riga}" data-codice="${r.toLowerCase().replace(/"/g,"")}">
        ${d}
        <div><span class="label-sm ${i.label}">Codice Prodotto</span><b class="${i.value}">${r}</b></div>
        <div class="qty-cell">
            <span class="label-sm ${i.label}">Quantit\xE0</span>
            <div class="qty-row">
                <b class="${i.value} qty-totale">${t.qty}</b>
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
                    ${window.listaStati.map(u=>`<button type="button" class="stato-option${u.nome===n?" is-selected":""}" onclick="selezionaStato(this, '${t.id_riga}', '${u.colore}')"><span class="stato-opt-dot" style="background:${u.colore}"></span><span>${u.nome}</span>${u.nome===n?'<i class="fas fa-check stato-check-icon"></i>':""}</button>`).join("")}
                </div>
            </div>
        </div>
        <div>
            <span class="label-sm ${i.label}">Operatore/i Assegnati</span>
            ${f}
        </div>
        <div class="order-info-col">
            <button class="btn-chiedi-assegna ${i.btnPrimary}" onclick="apriModalAiuto('${t.id_riga}', '${r}', '${e}', '${(o||"").replace(/'/g,"\\'")}')">
                <i class="fa-regular fa-envelope"></i> Chiedi
            </button>
            ${window._isCommerciale()||window._isUtenteEsente()?`<button class="btn-sollecita" onclick="apriModalSollecito('${t.id_riga}','${e}','${(o||"").replace(/'/g,"\\'")}','${r.replace(/'/g,"\\'")}')"><i class="fa-solid fa-calendar-alt"></i> Scadenza</button>`:""}
        </div>
    </div>`}function Fl(t,e){let o=window.TW,i=t.codice&&t.codice!=="false"?t.codice:"Senza Codice",n=(t.stato||"COMPLETATO").toUpperCase(),a=t.assegna;return(!a||a==="false"||a==="")&&(a="Nessuno"),`
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
    </div>`}var vi=V(()=>{ao();dt();ut()});function kt(){let t=re(),e=(S.attiviProd||[]).filter(n=>t.includes((n.stato||"").toUpperCase().trim())).length,o=document.querySelector("#ov-accordion .ov-summary-meta");o&&(o.textContent=`${e} art. in lavorazione`);let i=document.getElementById("ov-content");if(i){if(i.querySelector(".ov-lazy-placeholder")){let n=document.getElementById("ov-accordion");if(!n||!n.open)return;i.innerHTML=ce(S.attiviProd),requestAnimationFrame(It);return}i.innerHTML=ce(S.attiviProd),requestAnimationFrame(It)}}function Ta(t){if(!t.parentElement.open){let o=document.getElementById("ov-content");o&&o.querySelector(".ov-lazy-placeholder")&&(o.innerHTML=ce(S.attiviProd),requestAnimationFrame(It))}}function Ra(t){let e=document.getElementById(t);if(!e)return;let o=e.querySelector(".sezione-archiviata"),i=S.datiArchLazy||S.ultimiDatiProduzione&&S.ultimiDatiProduzione.archivio;if(o&&i&&(S.datiArchLazy||!o.children.length)){let a=jt(i,!0)||"<div class='empty-msg'>L'archivio \xE8 vuoto.</div>";o.innerHTML=a,window.aggiornaListaFiltrabili?.(),H.ARCHIVIO_ORDINI||(H.ARCHIVIO_ORDINI=a,X.ARCHIVIO_ORDINI=Date.now(),J("_html_ARCHIVIO_ORDINI",a)),S.datiArchLazy=null}e.open=!0,requestAnimationFrame(()=>{e.querySelector("summary")?.scrollIntoView({behavior:"smooth",block:"start"})})}function hi(t){let e=(t||[]).filter(u=>!gt(u.stato)),o=["Riccardo","Fabio T.","Niccol\xF2","Alessio"],i=new Map;o.forEach(u=>i.set(u,[]));let n=new Map;o.forEach(u=>n.set(u,new Set));function a(u){let m=window._normNome(u);return o.find(b=>b===m||b.toUpperCase()===String(u).trim().toUpperCase())}e.forEach(u=>{if(!u.assegna||u.assegna===""||u.assegna==="undefined")return;let m=String(u.ordine||"").trim();m&&u.assegna.split(",").forEach(b=>{let w=b.trim();if(!w)return;let v=a(w);v&&!n.get(v).has(m)&&(n.get(v).add(m),i.get(v).push(u))})});let r={};(window.listaStati||[]).forEach(u=>{r[u.nome.toUpperCase()]=u.colore});function s(u){let m=String(u.cliente||"").trim().toUpperCase();if(!m||m==="DA DEFINIRE"){let w=String(u.riferimento||"").trim();return w||""}let b=u.cliente.trim().split(/\s+/).slice(0,2).join(" ");return b.length>14?b.substring(0,13)+"\u2026":b}let c=o.map(u=>{let m=i.get(u)||[],b=window._getOpColor(u),w=m.length===0?'<div class="ov-op-item ov-op-item-free"><span class="ov-op-item-cod" style="color:#475569">Libero</span></div>':m.map(v=>{let x=(v.stato||"IN ATTESA").toUpperCase().trim(),O=r[x]||"#94a3b8",E=String(v.ordine||"").trim(),$=s(v),k=E.length>10?E.substring(0,9)+"\u2026":E;return`<div class="ov-op-item">
                    <span class="ov-op-item-dot" style="background:${O}"></span>
                    <span class="ov-op-item-cod">${k}${$?' <em style="color:#7c8fa8;font-style:italic">'+$+"</em>":""}</span>
                </div>`}).join("");return`<div class="ov-op-row">
            <div class="ov-op-header">
                <span class="ov-op-badge" style="background:${b}">${u.charAt(0).toUpperCase()}</span>
                <span class="ov-op-nome">${u}</span>
                ${m.length>0?`<span class="ov-op-count" style="background:${b}33;color:${b}">${m.length}</span>`:'<span class="ov-op-free-badge">Libero</span>'}
            </div>
            <div class="ov-op-items">${w}</div>
        </div>`}).join(""),l=Math.max(...o.map(u=>(i.get(u)||[]).length),1),d=o.map(u=>{let m=(i.get(u)||[]).length,b=window._getOpColor(u),w=Math.round(m/l*100),v=m===0;return`<div class="ov-op-summary-row">
            <span class="ov-op-badge" style="background:${v?"#374151":b}">${u.charAt(0).toUpperCase()}</span>
            <div class="ov-op-summary-info">
                <div class="ov-op-summary-top">
                    <span class="ov-op-nome">${u}</span>
                    ${v?'<span class="ov-op-free-badge">Libero</span>':`<span class="ov-op-count" style="background:${b}33;color:${b}">${m} art.</span>`}
                </div>
                ${v?"":`<div class="ov-op-bar-track"><div class="ov-op-bar-fill" style="width:${w}%;background:${b}"></div></div>`}
            </div>
        </div>`}).join(""),p=`<details class="ov-stato-card" open style="grid-column:4;grid-row:1">
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
    </details>`;return p+f}function ce(t){let e={};(window.listaStati||[]).forEach(n=>{e[n.nome.toUpperCase()]=n.colore});let o="#94a3b8";return`<div class="ov-board-wrapper">
        <div class="ov-stati-grid" id="ov-kanban-grid">${re().map(n=>{let a=t.filter(p=>(p.stato||"").toUpperCase().trim()===n.trim()),r=e[n]||o,s=a.length===0,c=S.ovStatiOrd.includes(n),l="",d="";if(c){let p=new Map,f=[];a.forEach(u=>{let m=String(u.ordine||"\u2014").trim();p.has(m)?p.get(m).push(u):(p.set(m,[u]),f.push({ordine:m,rows:p.get(m)}))}),f.sort((u,m)=>{let b=(u.rows[0].cliente||"").trim().toUpperCase(),w=!b||b==="DA DEFINIRE"?(u.rows[0].riferimento||u.ordine).toUpperCase():b,v=(m.rows[0].cliente||"").trim().toUpperCase(),x=!v||v==="DA DEFINIRE"?(m.rows[0].riferimento||m.ordine).toUpperCase():v;return w<x?-1:w>x?1:0}),l=f.map(({ordine:u,rows:m})=>{let b=m.map(R=>String(R.id_riga)).join(","),w=m[0];function v(R){let C=(R||"").trim().split(/\s+/).slice(0,2).join(" ");return C.length>18?C.substring(0,17)+"\u2026":C}let x=String(w.cliente||"").trim().toUpperCase(),O=!x||x==="DA DEFINIRE"?v(w.riferimento||"")||u:v(w.cliente),E=u.length>12?u.substring(0,12)+"\u2026":u,$=m.length,k=m.reduce((R,C)=>R+(parseInt(C.qty)||1),0);return`<div class="ov-stato-row ov-kanban-item"
                    data-id-riga="${w.id_riga}"
                    data-id-righe="${b}"
                    data-count="${$}"
                    data-codice="${u.replace(/"/g,"&quot;")}"
                    data-ordine="${m.map(R=>R.ordine||"").join(",")}"
                    data-stato-corrente="${n}"
                    title="Doppio clic \u2192 vai all'ordine nella lista">
                    <span class="ov-drag-handle"><i class="fas fa-grip-vertical"></i></span>
                    <span class="ov-row-main">
                        <span class="ov-row-label" title="${u}">${E} <em>${O}</em></span>
                        <span class="ov-row-sub">${$} art. \xB7 ${k} pz</span>
                    </span>
                </div>`}).join(""),d=f.length+" ord."}else{let p=new Map,f=[];a.forEach(u=>{let m=String(u.codice&&u.codice!=="false"?u.codice:u.riferimento||"\u2014").trim();p.has(m)?p.get(m).push(u):(p.set(m,[u]),f.push({codice:m,rows:p.get(m)}))}),f.sort((u,m)=>u.codice<m.codice?-1:u.codice>m.codice?1:0),l=f.map(({codice:u,rows:m})=>{let b=u.length>24?u.substring(0,24)+"\u2026":u,w=m.map(C=>String(C.id_riga)).join(",");function v(C){let D=(C||"").trim().split(/\s+/).slice(0,2).join(" ");return D.length>14?D.substring(0,13)+"\u2026":D}function x(C){let D=String(C.cliente||"").trim().toUpperCase();return!D||D==="DA DEFINIRE"?v(C.riferimento||"")||"":v(C.cliente)}let O=new Map,E=[];m.forEach(C=>{let D=x(C);O.has(D)?O.get(D).push(C):(O.set(D,[C]),E.push(D))});let k=E.map(C=>{let G=O.get(C).map(ct=>{let tt=String(ct.ordine||"").trim();return tt.length>12?tt.substring(0,12)+"\u2026":tt}).filter(Boolean).join(" / ");return!G&&!C?"":G+(C?" <em>"+C+"</em>":"")}).filter(Boolean).join(" \xB7 "),R=m.length>1?m.map(C=>(C.qty||1)+"pz").join("+"):(m[0].qty||1)+" pz";return`<div class="ov-stato-row ov-kanban-item"
                    data-id-riga="${m[0].id_riga}"
                    data-id-righe="${w}"
                    data-count="${m.length}"
                    data-codice="${u.replace(/"/g,"&quot;")}"
                    data-ordine="${m.map(C=>C.ordine||"").join(",")}"
                    data-stato-corrente="${n}"
                    title="Doppio clic \u2192 vai all'ordine nella lista">
                    <span class="ov-drag-handle"><i class="fas fa-grip-vertical"></i></span>
                    <span class="ov-row-main">
                        <span class="ov-row-label" title="${u}">${b}</span>
                        ${k?`<span class="ov-row-sub">${k}</span>`:""}
                    </span>
                    <span class="ov-badge-qty">${R}</span>
                </div>`}).join(""),d=a.length+" art."}return`<details class="ov-stato-card${s?" ov-stato-card-empty":""}" open>
            <summary class="ov-stato-header" style="--ov-col:${r}" onclick="if(window.innerWidth>600){event.preventDefault();return false;}">
                <span class="ov-stato-dot" style="background:${r}"></span>
                <span class="ov-stato-nome">${n}</span>
                <span class="ov-stato-tot" style="background:${r}22;color:${r}" data-stato-count="${n}">${d}</span>
                <i class="fas fa-chevron-down ov-sub-chevron"></i>
            </summary>
            <div class="ov-stato-body" data-stato-drop="${n}">${s?'<span class="ov-empty-lbl">\u2014 nessun articolo</span>':l}</div>
        </details>`}).join("")}</div>
        <div class="ov-operatori-panel">${hi(t)}</div>
    </div>`}function bi(t){if(!t)return;let e=[...document.querySelectorAll(".ordine-wrapper")].find(n=>n.dataset.ordine===t);if(!e)return;let o=e.querySelector(".riga-ordine"),i=e.querySelector(".dettagli-container");o&&!o.classList.contains("open")&&(o.classList.add("open"),i&&(i.style.display="block")),setTimeout(()=>{e.scrollIntoView({behavior:"smooth",block:"center"})},60),e.style.transition="box-shadow 0.2s ease",e.style.boxShadow="0 0 0 3px #f59e0b99, 0 4px 24px #f59e0b33",setTimeout(()=>{e.style.transition="box-shadow 0.7s ease",e.style.boxShadow=""},1800)}function It(){let t=window.innerWidth<=600,e=document.getElementById("ov-kanban-grid");if(!e||e._dndInit)return;e._dndInit=!0,e.addEventListener("click",E=>{let $=E.target.closest(".ov-stato-header");!t&&$&&E.preventDefault()},!0);let o=null,i=null,n=null,a=null,r=null,s=null,c=380,l=10,d=0,p=0;function f(E,$){i&&(i.style.visibility="hidden");let k=document.elementFromPoint(E,$);if(i&&(i.style.visibility=""),!k)return null;let R=k.closest(".ov-stato-body");if(R)return R;let C=k.closest(".ov-stato-header, .ov-stato-card > summary");if(C){let D=C.closest(".ov-stato-card");if(D)return D.querySelector(".ov-stato-body")}return null}function u(E){E!==a&&(e.querySelectorAll(".ov-stato-body").forEach($=>$.classList.remove("ov-drop-over")),a=E,E&&E.dataset.statoDrop!==n&&E.classList.add("ov-drop-over"))}function m(){if(s&&s.pressTimer&&(clearTimeout(s.pressTimer),s.item&&s.item.classList.remove("ov-touch-hold-pending"),s=null),o&&r!=null)try{o.hasPointerCapture&&o.hasPointerCapture(r)&&o.releasePointerCapture(r)}catch{}i&&(Qe(i),i=null),o&&(o.classList.remove("ov-drag-active"),o.style.userSelect="",o=null),e.querySelectorAll(".ov-stato-body").forEach(E=>E.classList.remove("ov-drop-over")),n=null,a=null,r=null}let b=0,w=null;function v(E,$,k,R){o=E,n=E.dataset.statoCorrente,r=R;let C=We(E,$,k,{opacity:.92,scale:"1.05",rotate:"-1.2deg",borderRadius:"8px",shadow:"0 10px 32px rgba(0,0,0,0.55)",background:"#1e2d3d",border:"1.5px solid #475569",transition:"transform 0.1s"});i=C.ghost,d=C.offX,p=C.offY,E.style.userSelect="none",o.classList.add("ov-drag-active");try{o.setPointerCapture?o.setPointerCapture(R):e.setPointerCapture&&e.setPointerCapture(R)}catch{}}e.addEventListener("pointerdown",E=>{if(E.pointerType==="mouse"&&E.button!==0)return;let $=E.target.closest(".ov-kanban-item");if(!$)return;let k=Date.now();if(w===$&&k-b<280){b=0,w=null;let R=($.dataset.ordine||"").split(",")[0].trim();R&&bi(R);return}if(b=k,w=$,E.pointerType==="touch"){s&&s.pressTimer&&(clearTimeout(s.pressTimer),s.item&&s.item.classList.remove("ov-touch-hold-pending")),$.classList.add("ov-touch-hold-pending"),s={item:$,pointerId:E.pointerId,startX:E.clientX,startY:E.clientY,pressTimer:setTimeout(()=>{!s||s.pointerId!==E.pointerId||o||(s.item.classList.remove("ov-touch-hold-pending"),v($,s.startX,s.startY,E.pointerId),s=null)},c)};return}E.preventDefault(),v($,E.clientX,E.clientY,E.pointerId)});function x(E){if(s&&!o&&E.pointerId===s.pointerId){let $=Math.abs(E.clientX-s.startX),k=Math.abs(E.clientY-s.startY);($>l||k>l)&&(clearTimeout(s.pressTimer),s.item.classList.remove("ov-touch-hold-pending"),s=null)}!o||!i||(Ze(i,E.clientX,E.clientY,d,p),u(f(E.clientX,E.clientY)))}e.addEventListener("pointermove",x),window.addEventListener("pointermove",x,{passive:!0});function O(E){if(s&&!o&&E.pointerId===s.pointerId){clearTimeout(s.pressTimer),s.item.classList.remove("ov-touch-hold-pending"),s=null;return}if(!o)return;let $=f(E.clientX,E.clientY),k=$?.dataset?.statoDrop,R=o,C=n;if(m(),!k||k===C||!$)return;let D=R.dataset.idRiga,G=(R.dataset.idRighe||D).split(",").map(_=>_.trim()).filter(Boolean),ct=(window.listaStati.find(_=>_.nome===k)||{}).colore||"#94a3b8";$.querySelectorAll(".ov-empty-lbl").forEach(_=>_.remove()),R.dataset.statoCorrente=k,$.appendChild(R);let tt=$.closest(".ov-stato-card");tt&&(tt.open=!0),so(e),ro(e),R.style.transition="transform 0.18s, opacity 0.18s",R.style.transform="scale(1.04)",R.style.opacity="0.6",requestAnimationFrame(()=>{R.style.transform="",R.style.opacity="",setTimeout(()=>{R.style.transition=""},200)});let P={};G.forEach(_=>{let T=S.attiviProd?S.attiviProd.find(L=>String(L.id_riga)===_):null;P[_]=T?T.stato:C}),G.forEach(_=>{if(S.attiviProd){let T=S.attiviProd.find(L=>String(L.id_riga)===_);T&&(T.stato=k)}}),R.classList.add("optimistic-pending"),R.style.transition="opacity 0.3s",S.lastKanbanDragTs=Date.now(),(async()=>{let _=!1;for(let T of G)await window.aggiornaDato(null,T,"stato",k)||(_=!0);if(R.classList.remove("optimistic-pending"),R.style.opacity="",_){let T=e.querySelector(`.ov-stato-body[data-stato-drop="${C}"]`);T&&(R.dataset.statoCorrente=C,T.querySelectorAll(".ov-empty-lbl").forEach(L=>L.remove()),T.appendChild(R)),G.forEach(L=>{let M=P[L]||C;if(S.attiviProd){let nt=S.attiviProd.find(Lt=>String(Lt.id_riga)===L);nt&&(nt.stato=M)}let B=(window.listaStati.find(nt=>nt.nome===M)||{}).colore||"#94a3b8";le(L,M,B)}),so(e),ro(e),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[Kanban DnD] Rollback",{idRighe:G,newStato:k,oldStato:C})}else window._invalidateProduzioneCache()})(),G.forEach(_=>le(_,k,ct)),g(`\u2714 Stato \u2192 ${k}`)}e.addEventListener("pointerup",O),window.addEventListener("pointerup",O,{passive:!0}),e.addEventListener("pointercancel",m),window.addEventListener("pointercancel",m,{passive:!0}),e.addEventListener("dragstart",E=>E.preventDefault())}function so(t){t.querySelectorAll(".ov-stato-body").forEach(e=>{let o=e.dataset.statoDrop,i=S.ovStatiOrd.includes(o),n=e.querySelectorAll(".ov-kanban-item"),a=0;i?a=n.length:n.forEach(c=>{a+=parseInt(c.dataset.count||"1",10)});let r=t.querySelector(`[data-stato-count="${o}"]`);r&&(r.textContent=a+(i?" ord.":" art."));let s=e.closest(".ov-stato-card");s&&s.classList.toggle("ov-stato-card-empty",a===0)})}function ro(t){t.querySelectorAll(".ov-stato-body").forEach(e=>{if(!(e.querySelectorAll(".ov-kanban-item").length>0)&&!e.querySelector(".ov-empty-lbl")){let i=document.createElement("span");i.className="ov-empty-lbl",i.textContent="\u2014 nessun articolo",e.appendChild(i)}})}function le(t,e,o){let i=document.querySelector(`.stato-dropdown[data-id-riga="${t}"]`);if(!i)return;let n=i.querySelector(".stato-trigger");if(!n)return;let a=n.querySelector(".stato-dot"),r=n.querySelector(".stato-label-txt");a&&(a.style.background=o),r&&(r.textContent=e),i.querySelectorAll(".stato-option").forEach(s=>{let c=s.querySelector("span:not(.stato-opt-dot)")?.textContent.trim();s.classList.toggle("is-selected",c===e);let l=s.querySelector(".stato-check-icon");if(l&&l.remove(),c===e){let d=document.createElement("i");d.className="fas fa-check stato-check-icon",s.appendChild(d)}})}var ka=V(()=>{ao();vi();Ke();dt();Vt();wt()});function it({resetFetchTime:t=!0,invalidatePersistent:e=!0}={}){delete H["PROGRAMMA PRODUZIONE DEL MESE"],t&&(X["PROGRAMMA PRODUZIONE DEL MESE"]=0),U("_html_PROGRAMMA PRODUZIONE DEL MESE"),A.dashBundle=null,A.dashPromise=null,e&&(S.prodCacheInvalidateTimer&&clearTimeout(S.prodCacheInvalidateTimer),S.prodCacheInvalidateTimer=setTimeout(()=>{S.prodCacheInvalidateTimer=null,q.invalidate("PROGRAMMA_PRODUZIONE").catch(()=>{})},1200))}function de(){let t=document.getElementById("contenitore-dati");t&&(H["PROGRAMMA PRODUZIONE DEL MESE"]=t.innerHTML,X["PROGRAMMA PRODUZIONE DEL MESE"]=Date.now(),J("_html_PROGRAMMA PRODUZIONE DEL MESE",t.innerHTML))}function $e(t,e,o){if(!o)return;let i=[S.ultimiDatiProduzione?.produzione,S.attiviProd];for(let n of i)if(n)for(let a of n)(e?String(a.id_riga)===String(e):String(a.ordine||a.nOrd||"").trim()===String(t).trim())&&(a.last_modified=o)}async function uo(t=null){let e=null;if(A.dashBundle)e=A.dashBundle,A.dashBundle=null,A.dashPromise=null;else if(A.dashPromise)e=await A.dashPromise,A.dashBundle=null,A.dashPromise=null;else{let o=await fetch(I,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!1}),...t?{signal:t}:{}});if(!o.ok)throw new Error(`HTTP ${o.status}`);e=await o.json()}if(!e)throw new Error("bundle vuoto");return{produzione:e.produzione||[],archivio:e.archivio||[],avatarColors:e.avatarColors||null,prodTotal:e.prodTotal||0}}function po(t,e=null){if(window.paginaAttuale!=="PROGRAMMA PRODUZIONE DEL MESE")return;t.avatarColors&&Pa(t.avatarColors),S.ultimiDatiProduzione=t;let o=document.getElementById("contenitore-dati");if(!o)return;let i="PROGRAMMA PRODUZIONE DEL MESE",n=t.produzione||[],a=t.archivio||[],r=e!==null?e:!!o.querySelector(".ordine-wrapper"),s=n.filter(v=>String(v.archiviato||"").toUpperCase()!=="TRUE");S.attiviProd=s;let c=re(),l=s.filter(v=>c.includes((v.stato||"").toUpperCase().trim())).length,d=n.filter(v=>String(v.archiviato||"").toUpperCase()!=="TRUE"),p=jt(d,!1);S.datiArchLazy=a;let f="",u=window.innerWidth<=600,m=u?'<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>':ce(s),b=new Set;r&&o.querySelectorAll(".ordine-wrapper").forEach(v=>{v.querySelector(".riga-ordine.open")&&b.add(v.dataset.ordine)}),o.innerHTML=`
            <details class="ov-accordion" id="ov-accordion"${u?"":" open"}>
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
                ${p||"<div class='empty-msg'>Nessun ordine in produzione.</div>"}
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
        `,H[i]=o.innerHTML,X[i]=Date.now(),J("_html_"+i,o.innerHTML),q.set("PROGRAMMA_PRODUZIONE",t).catch(()=>{}),z(o),r&&b.size&&o.querySelectorAll(".ordine-wrapper").forEach(v=>{if(b.has(v.dataset.ordine)){let x=v.querySelector(".riga-ordine"),O=v.querySelector(".dettagli-container");x&&O&&(x.classList.add("open"),O.style.display="block")}}),window.aggiornaListaFiltrabili(),requestAnimationFrame(It),requestAnimationFrame(()=>{S.attiviProd&&S.attiviProd.forEach(v=>{if(parseFloat(v.qty_evasa)>0){let x=document.getElementById("qty-evasa-block-"+v.id_riga),O=x&&x.closest(".qty-cell")?.querySelector(".btn-qty-evasa-toggle");x&&(x.style.display="inline-flex"),O&&O.classList.add("active")}})}),fo(),S.ordiniAutocompleteCache=n.filter(v=>String(v.archiviato||"").toUpperCase()!=="TRUE").map(v=>({ordine:v.ordine||"",cliente:v.cliente||"",riferimento:v.riferimento||""}));let w=new Set;S.ordiniAutocompleteCache=S.ordiniAutocompleteCache.filter(v=>w.has(v.ordine)?!1:(w.add(v.ordine),!0)),window._ordiniAutocompleteCache=S.ordiniAutocompleteCache}async function mo(t,e=!1,o=null,i=null){let n=document.getElementById("contenitore-dati");!e&&n&&(n.innerHTML="<div class='inline-msg' id='_prod-loader'>Caricamento Dashboard...</div>",z(n));let a=e?null:setTimeout(()=>{let s=document.getElementById("_prod-loader");s&&(s.innerHTML="<i class='fas fa-spinner fa-spin'></i> Connessione lenta, sto ancora caricando...")},3500),r=e?null:setTimeout(()=>{let s=document.getElementById("_prod-loader");s&&(s.innerHTML=`\u26A0\uFE0F Server occupato o rete instabile.<br>
            <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                style="margin-top:12px;padding:8px 20px;background:#242424;color:#fff;
                       border:none;border-radius:8px;cursor:pointer;font-size:0.9rem">
                &#x21bb; Riprova
            </button>`)},8e3);try{let s=await uo(i);if(a&&clearTimeout(a),r&&clearTimeout(r),window.paginaAttuale!==t||o!==null&&o!==window._latestNavRequest)return;po(s,e)}catch(s){if(a&&clearTimeout(a),r&&clearTimeout(r),s.name==="AbortError")return;console.error("Errore Dashboard:",s),e?console.warn("Background refresh fallito, il polling riprover\xE0:",s.message):(n.innerHTML=`<div class='inline-error'>Errore nel caricamento dati.
                <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                    style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                    &#x21bb; Riprova</button></div>`,z(n))}}async function ue(){let t=document.getElementById("contenitore-dati");if(t){t.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento archivio...</div>";try{let e=null;if(A.dashBundle)e=A.dashBundle,A.dashBundle=null,A.dashPromise=null;else if(A.dashPromise)e=await A.dashPromise,A.dashBundle=null,A.dashPromise=null;else{let a=await fetch(I,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!0})});if(!a.ok)throw new Error(`HTTP ${a.status}`);e=await a.json()}if(!e)throw new Error("bundle vuoto");let o=e.archivio||[],n=jt(o,!0)||"<div class='empty-msg'>L'archivio \xE8 vuoto.</div>";t.innerHTML=n,H.ARCHIVIO_ORDINI=n,X.ARCHIVIO_ORDINI=Date.now(),J("_html_ARCHIVIO_ORDINI",n),z(t),window.aggiornaListaFiltrabili()}catch(e){if(e.name==="AbortError")return;t.innerHTML=`<div class='inline-error'>Errore archivio.
            <button onclick="cambiaPagina('ARCHIVIO_ORDINI', null)"
               style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
               &#x21bb; Riprova</button></div>`,z(t)}}}function wi(t,e){let o=String(t),i=String(e||"");Array.isArray(S.attiviProd)&&S.attiviProd.forEach(n=>{String(n.id_riga)===o&&(n.assegna=i)}),S.ultimiDatiProduzione&&Array.isArray(S.ultimiDatiProduzione.produzione)&&S.ultimiDatiProduzione.produzione.forEach(n=>{String(n.id_riga)===o&&(n.assegna=i)})}function Si(t,e){let o=String(t||"").trim(),i=String(e||""),n=a=>{Array.isArray(a)&&a.forEach(r=>{String(r.ordine||"").trim()===o&&!gt(r.stato)&&(r.assegna=i)})};n(S.attiviProd),S.ultimiDatiProduzione&&Array.isArray(S.ultimiDatiProduzione.produzione)&&n(S.ultimiDatiProduzione.produzione)}async function Hl(t,e,o){let i=document.querySelector(`.visualizza-operatori[data-id-riga="${t}"]`);if(!i)return;let n=window._normNome(o),r=(i.dataset.assegna||"").split(",").map(l=>window._normNome(l.trim())).filter(l=>l&&l.toUpperCase()!==n.toUpperCase()).join(",");if(wi(t,r),i.dataset.assegna=r,!r)i.innerHTML='<span class="operatore-libero">Libero</span>';else{let l=window._normNome(h?.nome||"").toUpperCase().trim();i.innerHTML=r.split(",").map(d=>{let p=window._normNome(d.trim()),f=window._getOpColor(p),u=p.replace(/'/g,"\\'"),m=p.toUpperCase()===l?`<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${t}','${e}','${u}')" title="Rimuovi assegnazione">&times;</button>`:"";return`<span class="badge-operatore" data-nome="${y(p)}" style="background:${f};border-color:${f}">${y(p)}${m}</span>`}).join("")}let s=h&&h.nome?h.nome.toUpperCase().trim():"",c=`${I}?azione=assegnaOperatori&ordine=${encodeURIComponent(e)}&operatori=${encodeURIComponent(r)}&id_riga=${t}&mittente=${encodeURIComponent(s)}`;fetch(c).then(l=>l.json()).then(l=>{if(!l||l.status!=="ok"&&l.status!=="success")throw new Error("Assegnazione non salvata");$e(e,t,l.last_modified),it(),bt()}).catch(l=>{console.error("Errore rimozione operatore",l),g("\u26A0\uFE0F Rimozione non salvata \u2013 riprova","error")})}function jl(t){let e=t.closest(".op-dropdown"),o=t.closest(".item-card"),i=t.closest(".riga-ordine"),n=e.classList.contains("open");document.querySelectorAll(".op-dropdown.open").forEach(a=>{a.classList.remove("open");let r=a.closest(".item-card");r&&r.classList.remove("op-aperto");let s=a.closest(".riga-ordine");s&&s.classList.remove("op-aperto-ord")}),n||(e.classList.add("open"),o&&o.classList.add("op-aperto"),i&&i.classList.add("op-aperto-ord"))}function Gl(t){let e=t.closest(".stato-dropdown"),o=t.closest(".item-card"),i=t.closest(".riga-ordine"),n=e.classList.contains("open");document.querySelectorAll(".stato-dropdown.open").forEach(a=>{a.classList.remove("open");let r=a.closest(".item-card");r&&r.classList.remove("stato-aperto");let s=a.closest(".riga-ordine");s&&s.classList.remove("stato-aperto-ord")}),n||(e.classList.add("open"),o&&o.classList.add("stato-aperto"),i&&i.classList.add("stato-aperto-ord"))}function _i(){document.querySelectorAll(".ord-azioni-menu.open").forEach(t=>{t.classList.remove("open");let e=t.closest(".riga-ordine");e&&e.classList.remove("azioni-aperto-ord")})}function Vl(t){let e=t.closest(".ord-azioni-menu"),o=t.closest(".riga-ordine"),i=e.classList.contains("open");_i(),i||(e.classList.add("open"),o&&o.classList.add("azioni-aperto-ord"))}function Jl(t,e,o,i){let n=t.closest(".op-dropdown"),r=(n.dataset.assegna||"").split(",").map(u=>window._normNome(u.trim())).filter(Boolean),s=window._normNome(i),c=r.findIndex(u=>u.toUpperCase()===s.toUpperCase());c>=0?r.splice(c,1):r.push(s);let l=r.join(",");wi(e,l),n.dataset.assegna=l;let d=r.length?r.map(window._normNome).join(", "):"Libero";n.querySelector(".op-trigger-label").textContent=d,t.classList.toggle("is-selected",c<0);let p=t.querySelector(".op-check-icon");c<0?p||(p=document.createElement("i"),p.className="fas fa-check op-check-icon",t.appendChild(p)):p&&p.remove();let f=(h?.nome||"").toUpperCase().trim();fetch(I,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:o,operatori:l,id_riga:e,mittente:f})}).then(u=>u.json()).then(u=>{if(!u||u.status!=="ok"&&u.status!=="success")throw new Error("Assegnazione non salvata");$e(o,e,u.last_modified),it(),bt()}).catch(()=>g("\u26A0\uFE0F Assegnazione non salvata \u2013 riprova","error"))}function Wl(t,e,o){let i=t.closest(".op-dropdown"),a=(i.dataset.assegnaOrd||"").split(",").map(u=>window._normNome(u.trim())).filter(Boolean),r=window._normNome(o),s=a.findIndex(u=>u.toUpperCase()===r.toUpperCase());s>=0?a.splice(s,1):a.push(r);let c=a.join(",");i.dataset.assegnaOrd=c;let l=a.length?a.map(window._normNome).join(", "):"Libero";i.querySelector(".op-trigger-label").textContent=l,t.classList.toggle("is-selected",s<0);let d=t.querySelector(".op-check-icon");s<0?d||(d=document.createElement("i"),d.className="fas fa-check op-check-icon",t.appendChild(d)):d&&d.remove();let p=i.closest(".ordine-wrapper");p&&(p.querySelectorAll(".op-dropdown[data-id-riga]").forEach(u=>{u.dataset.assegna=c;let m=a.length?a.map(window._normNome).join(", "):"Libero",b=u.querySelector(".op-trigger-label");b&&(b.textContent=m),u.querySelectorAll(".op-option").forEach(w=>{let v=w.querySelector("span:not(.op-opt-dot)")?.textContent.trim()||"",x=a.some(E=>window._normNome(E)===v);w.classList.toggle("is-selected",x);let O=w.querySelector(".op-check-icon");x&&!O?(O=document.createElement("i"),O.className="fas fa-check op-check-icon",w.appendChild(O)):!x&&O&&O.remove()})}),p.querySelectorAll(".visualizza-operatori[data-id-riga]").forEach(u=>{u.dataset.assegna=c})),Si(e,c),bt();let f=(h?.nome||"").toUpperCase().trim();fetch(I,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:e,operatori:c,mittente:f})}).then(u=>u.json()).then(u=>{if(!u||u.status!=="ok"&&u.status!=="success")throw new Error("Assegnazione non salvata");$e(e,null,u.last_modified),it(),bt()}).catch(()=>g("\u26A0\uFE0F Assegnazione non salvata \u2013 riprova","error"))}function Zl(t,e,o){let i=window._normNome((h?.nome||"").trim());if(!i)return;let n=document.querySelector(`.visualizza-operatori[data-id-riga="${t}"]`);if(!n)return;let a=(n.dataset.assegna||"").split(",").map(l=>window._normNome(l.trim())).filter(Boolean);if(a.some(l=>l.toUpperCase()===i.toUpperCase()))return;a.push(i);let r=a.join(",");wi(t,r),n.dataset.assegna=r;let s=i.toUpperCase();n.innerHTML=a.map(l=>{let d=window._getOpColor(l),p=l.replace(/'/g,"\\'"),f=l.toUpperCase()===s?`<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${t}','${e}','${p}')" title="Rimuovi assegnazione">&times;</button>`:"";return`<span class="badge-operatore" data-nome="${y(l)}" style="background:${d};border-color:${d}">${y(l)}${f}</span>`}).join(""),o&&o.parentNode&&o.remove();let c=i.toUpperCase().trim();fetch(I,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:e,operatori:r,id_riga:t,mittente:c})}).then(l=>l.json()).then(l=>{if(!l||l.status!=="ok"&&l.status!=="success")throw new Error("Assegnazione non salvata");$e(e,t,l.last_modified),it(),bt()}).catch(()=>g("\u26A0\uFE0F Assegnazione non salvata \u2013 riprova","error"))}function Ql(t){let e=window._normNome((h?.nome||"").trim());if(!e)return;let o=e.toUpperCase().trim(),i=document.querySelector(`.ordine-wrapper[data-ordine="${t}"]`);if(i){i.querySelectorAll(".visualizza-operatori[data-id-riga]").forEach(r=>{let s=[e];r.dataset.assegna=e;let c=e.toUpperCase();r.innerHTML=s.map(l=>{let d=window._getOpColor(l),p=r.dataset.idRiga,f=l.replace(/'/g,"\\'"),u=l.toUpperCase()===c?`<button class="btn-rimuovi-op" onclick="rimuoviOperatore('${p}','${t}','${f}')" title="Rimuovi assegnazione">&times;</button>`:"";return`<span class="badge-operatore" data-nome="${y(l)}" style="background:${d};border-color:${d}">${y(l)}${u}</span>`}).join("")}),i.querySelectorAll(".op-dropdown[data-id-riga]").forEach(r=>{r.dataset.assegna=e;let s=r.querySelector(".op-trigger-label");s&&(s.textContent=e),r.querySelectorAll(".op-option").forEach(c=>{let l=c.querySelector("span:not(.op-opt-dot)")?.textContent.trim()||"",d=window._normNome(l).toUpperCase()===e.toUpperCase();c.classList.toggle("is-selected",d);let p=c.querySelector(".op-check-icon");d&&!p?(p=document.createElement("i"),p.className="fas fa-check op-check-icon",c.appendChild(p)):!d&&p&&p.remove()})});let n=i.querySelector(".op-dropdown-ord");if(n){n.dataset.assegnaOrd=e;let r=n.querySelector(".op-trigger-label");r&&(r.textContent=e)}let a=i.querySelector(".btn-assegnami-ord");a&&a.remove()}Si(t,e),bt(),fetch(I,{method:"POST",body:JSON.stringify({azione:"assegnaOperatori",ordine:t,operatori:e,mittente:o})}).then(n=>n.json()).then(n=>{if(!n||n.status!=="ok"&&n.status!=="success")throw new Error("Assegnazione non salvata");$e(t,null,n.last_modified),it(),bt()}).catch(()=>g("\u26A0\uFE0F Assegnazione non salvata \u2013 riprova","error"))}function Kl(t,e,o){let i=t.querySelector("span:not(.stato-opt-dot)").textContent.trim(),n=t.closest(".stato-dropdown"),a=n.querySelector(".stato-trigger"),r=a.querySelector(".stato-label-txt"),s=a.querySelector(".stato-dot"),c={testo:r.textContent,colore:s?s.style.background:"",selectedBtn:n.querySelector(".stato-option.is-selected")},l=S.attiviProd?S.attiviProd.find(u=>String(u.id_riga)===String(e)):null,d=l?l.stato:null;s&&(s.style.background=o||"#94a3b8"),r.textContent=i,n.querySelectorAll(".stato-option").forEach(u=>{u.classList.remove("is-selected");let m=u.querySelector(".stato-check-icon");m&&m.remove()}),t.classList.add("is-selected");let p=document.createElement("i");p.className="fas fa-check stato-check-icon",t.appendChild(p),n.classList.remove("open");let f=n.closest(".item-card");f&&f.classList.remove("stato-aperto"),S.attiviProd&&l&&(l.stato=i),lo(n.closest(".ordine-wrapper")?.dataset.ordine||""),kt(),de(),f&&(f.classList.add("optimistic-pending"),f.style.transition="opacity 0.3s"),Ei(null,e,"stato",i,!0).then(u=>{if(f&&(f.classList.remove("optimistic-pending"),f.style.opacity=""),u)it();else{if(s&&(s.style.background=c.colore),r.textContent=c.testo,n.querySelectorAll(".stato-option").forEach(m=>{m.classList.remove("is-selected");let b=m.querySelector(".stato-check-icon");b&&b.remove()}),c.selectedBtn){c.selectedBtn.classList.add("is-selected");let m=document.createElement("i");m.className="fas fa-check stato-check-icon",c.selectedBtn.appendChild(m)}S.attiviProd&&l&&d!==null&&(l.stato=d),lo(n.closest(".ordine-wrapper")?.dataset.ordine||""),kt(),de(),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[selezionaStato] Rollback",{idRiga:e,nuovoStato:i,statoPrec:c.testo})}}).catch(u=>{f&&(f.classList.remove("optimistic-pending"),f.style.opacity=""),s&&(s.style.background=c.colore),r.textContent=c.testo,S.attiviProd&&l&&d!==null&&(l.stato=d),lo(n.closest(".ordine-wrapper")?.dataset.ordine||""),kt(),de(),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[selezionaStato] Errore + Rollback",u,{idRiga:e,nuovoStato:i})})}function lo(t){if(!t)return;let e=document.querySelector(`.stato-dropdown-ord[data-nord="${CSS.escape(t)}"]`);if(!e)return;let o=(S.attiviProd||[]).filter(c=>(c.ordine||"")===t);if(!o.length)return;let i=[...new Set(o.map(c=>(c.stato||"IN ATTESA").toUpperCase().trim()))],n=i.length===1?i[0]:`${i.length} Stati`,a=i.length===1?((window.listaStati||[]).find(c=>c.nome===i[0])||{colore:"#e2e8f0"}).colore:"#e2e8f0",r=e.querySelector(".stato-label-txt"),s=e.querySelector(".stato-dot");r&&(r.textContent=n),s&&(s.style.background=a)}function Yl(t,e,o,i){event.stopPropagation();let n=t.closest(".stato-dropdown-ord");if(!n)return;let a=n.querySelector(".stato-trigger"),r=a?a.querySelector(".stato-label-txt"):null,s=a?a.querySelector(".stato-dot"):null,c={testo:r?r.textContent:"",colore:s?s.style.background:""};r&&(r.textContent=o),s&&i&&(s.style.background=i),n.classList.remove("open");let l=n.closest(".riga-ordine");l&&l.classList.remove("stato-aperto-ord");let d=document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(e)}"]`);if(!d)return;let p=Array.from(d.querySelectorAll("[data-id-riga]")).map(u=>u.dataset.idRiga),f={};p.forEach(u=>{let m=S.attiviProd?S.attiviProd.find(b=>String(b.id_riga)===String(u)):null;f[u]=m?m.stato:null}),p.forEach(u=>{if(S.attiviProd){let m=S.attiviProd.find(b=>String(b.id_riga)===String(u));m&&(m.stato=o)}le(u,o,i)}),kt(),de(),d.classList.add("optimistic-pending"),d.style.transition="opacity 0.3s",g(`\u2714 Ordine ${e} \u2192 ${o}`,"success"),td(p,"stato",o).then(u=>{d.classList.remove("optimistic-pending"),d.style.opacity="",u?it():(p.forEach(m=>{let b=f[m];if(b){if(S.attiviProd){let v=S.attiviProd.find(x=>String(x.id_riga)===String(m));v&&(v.stato=b)}let w=(window.listaStati.find(v=>v.nome===b)||{}).colore||"#e2e8f0";le(m,b,w)}}),kt(),de(),r&&(r.textContent=c.testo),s&&(s.style.background=c.colore),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[selezionaStatoOrdine] Rollback \u2014 bulk save failed",{nOrdine:e,nuovoStato:o}))}).catch(u=>{d.classList.remove("optimistic-pending"),d.style.opacity="",r&&(r.textContent=c.testo),s&&(s.style.background=c.colore),p.forEach(m=>{let b=f[m];if(b&&S.attiviProd){let w=S.attiviProd.find(v=>String(v.id_riga)===String(m));w&&(w.stato=b)}if(b){let w=(window.listaStati.find(v=>v.nome===b)||{}).colore||"#e2e8f0";le(m,b,w)}}),kt(),g("\u26A0\uFE0F Modifica non salvata \u2013 riprova","error"),console.error("[selezionaStatoOrdine] Rollback",u,{nOrdine:e,nuovoStato:o})})}function Xl(t){t.classList.toggle("open");let e=t.nextElementSibling;e.style.display=t.classList.contains("open")?"block":"none"}async function Ei(t,e,o,i,n=!1){N.pauseFor(15e3),S.mutationInFlight++;let a=null;if(S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let r=S.ultimiDatiProduzione.produzione.find(s=>String(s.id_riga)===String(e));r&&r.last_modified&&(a=r.last_modified)}t&&(t.style.opacity="0.5");try{let r={azione:"aggiorna_produzione",id_riga:e,colonna:o,valore:i,mittente:h&&h.nome?h.nome.toUpperCase():""};a&&(r.clientTimestamp=a);let s=await fetch(I,{method:"POST",body:JSON.stringify(r)});t&&(t.style.opacity="1");let c=await s.json();if(c&&c.status==="auth_error")return window._gestisciAuthError_(c.message),!1;if(c&&c.status==="conflict"){t&&(t.style.opacity="1");let l=c.serverData||{};return Ui({altroUtente:c.lastModifiedBy||l.last_modified_by||"",tuaModifica:i,serverModifica:o==="stato"?l.stato||"":l[o]||"",onSceglioClient:async()=>{N.pauseFor(15e3);let d={azione:"aggiorna_produzione",id_riga:e,colonna:o,valore:i,mittente:h&&h.nome?h.nome.toUpperCase():"",force:"1"};try{let f=await(await fetch(I,{method:"POST",body:JSON.stringify(d)})).json();if(f&&f.status==="auth_error"){window._gestisciAuthError_(f.message);return}if(f&&f.last_modified){if(S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let u=S.ultimiDatiProduzione.produzione.find(m=>String(m.id_riga)===String(e));u&&(u.last_modified=f.last_modified,u[o]=i)}if(S.attiviProd){let u=S.attiviProd.find(m=>String(m.id_riga)===String(e));u&&(u.last_modified=f.last_modified,u[o]=i)}}g("\u2714 Modifica forzata salvata"),it()}catch{g("\u26A0\uFE0F Errore durante il salvataggio forzato.","error")}},onSceglioServer:()=>{if(t&&(t.value=l[o]||l.stato||"",t.style.opacity="1"),S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let d=S.ultimiDatiProduzione.produzione.find(p=>String(p.id_riga)===String(e));d&&(l.stato&&(d.stato=l.stato),l.last_modified&&(d.last_modified=l.last_modified),l.last_modified_by&&(d.last_modified_by=l.last_modified_by))}if(S.attiviProd){let d=S.attiviProd.find(p=>String(p.id_riga)===String(e));d&&l.stato&&(d.stato=l.stato)}g("\u{1F504} Aggiornato con la versione del server")}}),!1}if(c&&c.status!=="success")return console.warn("Backend response:",c),n||g("\u26A0\uFE0F Cambio non salvato. Riprova.","warning"),!1;if(c.last_modified){if(S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let l=S.ultimiDatiProduzione.produzione.find(d=>String(d.id_riga)===String(e));l&&(l.last_modified=c.last_modified,l[o]=i,o==="stato"&&gt(i)&&(l.assegna=""))}if(de(),S.attiviProd){let l=S.attiviProd.find(d=>String(d.id_riga)===String(e));l&&(l.last_modified=c.last_modified,l[o]=i,o==="stato"&&gt(i)&&(l.assegna=""))}}return n||g("\u2714 "+(o==="stato"?"Stato":"Modifica")+" salvato","success"),it(),!0}catch(r){return console.error("aggiornaDato error:",r),t&&(t.style.opacity="1"),n||g("\u2717 Errore: cambio NON salvato. Riprova.","error"),!1}finally{S.mutationInFlight=Math.max(0,S.mutationInFlight-1),S.mutationLastDone=Date.now()}}async function td(t,e,o){N.pauseFor(15e3),S.mutationInFlight++;try{let i={azione:"aggiorna_produzione",id_righe:t,colonna:e,valore:o,mittente:h&&h.nome?h.nome.toUpperCase():""},a=await(await fetch(I,{method:"POST",body:JSON.stringify(i)})).json();return a&&a.status==="auth_error"?(window._gestisciAuthError_(a.message),!1):a&&a.status!=="success"?(console.warn("[_aggiornaDatoBulk] Backend response:",a),!1):(a.last_modified&&t.forEach(r=>{if(S.ultimiDatiProduzione&&S.ultimiDatiProduzione.produzione){let s=S.ultimiDatiProduzione.produzione.find(c=>String(c.id_riga)===String(r));s&&(s.last_modified=a.last_modified,s[e]=o,e==="stato"&&gt(o)&&(s.assegna=""))}if(S.attiviProd){let s=S.attiviProd.find(c=>String(c.id_riga)===String(r));s&&(s.last_modified=a.last_modified,s[e]=o,e==="stato"&&gt(o)&&(s.assegna=""))}}),it(),!0)}catch(i){return console.error("[_aggiornaDatoBulk] error:",i),!1}finally{S.mutationInFlight=Math.max(0,S.mutationInFlight-1),S.mutationLastDone=Date.now()}}async function ed(t,e){et("Archivia Ordine",`Vuoi spostare l'ordine ${t} nell'archivio?`,()=>{let o=document.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(t)}"]`),i=o?o.outerHTML:null,n=o?o.parentElement:null,a=o?o.nextSibling:null;o&&(o.style.transition="opacity 0.15s, transform 0.15s",o.style.opacity="0",o.style.transform="scale(0.97)",setTimeout(()=>o.remove(),150)),S.attiviProd&&(S.attiviProd=S.attiviProd.filter(c=>String(c.ordine||"").trim()!==String(t).trim()));let r=document.querySelector(`.ov-kanban-item[data-codice="${CSS.escape(t)}"], .ov-kanban-item[data-ordine*="${t}"]`);r&&r.remove();let s=async()=>{let l=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"archiviaOrdine",ordine:t})})).text(),d;try{d=JSON.parse(l)}catch{throw new Error("Risposta non valida dal server.")}return d};(async()=>{try{let c;try{c=await s()}catch{await new Promise(l=>setTimeout(l,2e3)),c=await s()}if(c.status==="success")delete H.ARCHIVIO_ORDINI,U("_html_ARCHIVIO_ORDINI"),it(),g("\u2714 Ordine "+t+" archiviato","success");else{if(i&&n){n.insertBefore(Object.assign(document.createElement("div"),{outerHTML:i}),a);let d=n.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(t)}"]`);d&&(d.style.opacity="1",d.style.transform="")}let l=(c.message||c.error||"Errore sconosciuto").toString();g("\u2717 "+l+" \u2013 ordine ripristinato","error")}}catch(c){if(i&&n){let l=document.createElement("template");l.innerHTML=i;let d=l.content.firstChild;n.insertBefore(d,a);let p=n.querySelector(`.ordine-wrapper[data-ordine="${CSS.escape(t)}"]`);p&&(p.style.opacity="1",p.style.transform="")}g("\u2717 "+(c.message||"Errore di rete")+" \u2013 ordine ripristinato","error")}})()},"Archivia")}function od(t,e,o){let i=document.getElementById("qty-evasa-block-"+e);if(!i)return;let n=i.style.display!=="none";if(i.style.display=n?"none":"inline-flex",t.classList.toggle("active",!n),!n){let a=document.getElementById("qty-evasa-input-"+e);a&&(a.focus(),a.select())}}function La(t,e,o){let i=document.getElementById("qty-rimanente-"+t);if(!i)return;let n=parseFloat(o);!isNaN(n)&&n>=0?(i.textContent=Math.max(0,e-n),i.style.color=e-n<=0?"#22c55e":""):(i.textContent="\u2014",i.style.color="")}async function id(t,e,o){let i=parseFloat(o);if(!(isNaN(i)||i<0)){if(La(t,e,i),S.attiviProd){let n=S.attiviProd.find(a=>String(a.id_riga)===String(t));n&&(n.qty_evasa=String(i))}await Ei(null,t,"qty_evasa",i)}}async function nd(t,e){let o=e==="ORDINE"?`Riportare l'intero ordine ${t} in PRODUZIONE?`:"Riportare questo articolo in PRODUZIONE?";et("Ripristina",o,async()=>{try{let n=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"ripristinaOrdine",ordine:t,tipo:e})})).json();n.status==="success"?(delete H.ARCHIVIO_ORDINI,U("_html_ARCHIVIO_ORDINI"),it(),mo(window.paginaAttuale)):g("Errore: "+n.message,"error")}catch{g("Errore durante il ripristino.","error")}},"Ripristina")}function fo(){pe(),S.pollProdTimer=setInterval(xi,S.POLL_PROD_MS)}function pe(){S.pollProdTimer&&(clearInterval(S.pollProdTimer),S.pollProdTimer=null)}async function xi(){if(window.paginaAttuale!=="PROGRAMMA PRODUZIONE DEL MESE"){pe();return}if(document.visibilityState!=="hidden"&&!document.querySelector(".stato-dropdown.open, .op-dropdown.open")&&!(Date.now()-S.lastKanbanDragTs<5e3)&&!(S.mutationInFlight>0)&&!(Date.now()-S.mutationLastDone<12e3)&&!yi){yi=!0;try{let t=await fetch(I,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!1})});if(!t.ok)return;let e=await t.json();if(!e||!e.produzione)return;e.avatarColors&&Pa(e.avatarColors);let o=(e.produzione||[]).filter(i=>String(i.archiviato||"").toUpperCase()!=="TRUE");ad(o,e.produzione,e.archivio||[])}catch{}finally{yi=!1}}}function Pa(t){if(!t||typeof t!="object")return;let e=!1;if(Object.entries(t).forEach(([o,i])=>{if(!i)return;let n=o.toUpperCase().trim();if(window._avatarColorsCache[n]!==i){window._avatarColorsCache[n]=i;try{localStorage.setItem("avatarColor_"+n,i)}catch{}e=!0}}),!!e){if(h?.nome){let o=t[h.nome.toUpperCase().trim()];o&&window._applyAvatarColorUI&&window._applyAvatarColorUI(o)}bt()}}function bt(){let t=document.getElementById("contenitore-dati");if(t){if(t.querySelectorAll(".badge-operatore[data-nome]").forEach(e=>{let o=window._getOpColor(e.dataset.nome);e.style.background=o,e.style.borderColor=o}),S.attiviProd&&S.attiviProd.length){let e=hi(S.attiviProd),o=t.querySelectorAll(".ov-stato-card"),i=Array.from(o).filter(n=>/grid-column.*4/.test(n.getAttribute("style")||""));if(i.length>=2){let n=document.createElement("div");n.innerHTML=e,n.querySelectorAll(".ov-stato-card").forEach((r,s)=>{i[s]&&i[s].replaceWith(r)})}}t.querySelectorAll(".op-opt-dot").forEach(e=>{let o=e.closest(".op-option");if(!o)return;let i=o.querySelectorAll("span"),n=i[1]?.textContent?.trim()||i[0]?.textContent?.trim();n&&(e.style.background=window._getOpColor(n))})}}function ad(t,e,o){if(!S.attiviProd)return;let i=new Set(S.attiviProd.map(c=>String(c.id_riga))),n=new Set(t.map(c=>String(c.id_riga))),a=i.size!==n.size;if(!a){for(let c of i)if(!n.has(c)){a=!0;break}}if(!a){for(let c of n)if(!i.has(c)){a=!0;break}}if(a){sd(e,o);return}let r=document.getElementById("contenitore-dati");if(!r)return;let s=!1;t.forEach(c=>{let l=String(c.id_riga),d=S.attiviProd.find(w=>String(w.id_riga)===l);if(!d||r.querySelector(`.item-card.optimistic-pending[data-id-riga="${l}"], .ordine-wrapper.optimistic-pending`))return;let f=(c.stato||"IN ATTESA").toUpperCase().trim(),u=(d.stato||"IN ATTESA").toUpperCase().trim();if(f!==u){s=!0;let w=r.querySelector(`.stato-dropdown[data-id-riga="${l}"]`);if(w){let v=(window.listaStati||[]).find(E=>E.nome===f)||{colore:"#e2e8f0"},x=w.querySelector(".stato-dot"),O=w.querySelector(".stato-label-txt");x&&(x.style.background=v.colore),O&&(O.textContent=f),w.querySelectorAll(".stato-option").forEach(E=>{let k=E.querySelector("span:not(.stato-opt-dot)")?.textContent?.trim()===f;if(E.classList.toggle("is-selected",k),E.querySelector(".stato-check-icon")?.remove(),k){let R=document.createElement("i");R.className="fas fa-check stato-check-icon",E.appendChild(R)}})}d.stato=f,za(l,f),lo(c.ordine||"")}let m=String(c.assegna||"").trim(),b=String(d.assegna||"").trim();if(m!==b){s=!0,d.assegna=m;let w=r.querySelector(`.visualizza-operatori[data-id-riga="${l}"]`);w&&(w.dataset.assegna=m);let v=r.querySelector(`.op-dropdown[data-id-riga="${l}"]`);if(v){v.dataset.assegna=m;let x=m.split(",").map(E=>window._normNome(E.trim())).filter(Boolean),O=v.querySelector(".op-trigger-label");O&&(O.textContent=x.length?x.join(", "):"Libero")}}}),s&&(S.attiviProd=t,delete H["PROGRAMMA PRODUZIONE DEL MESE"],X["PROGRAMMA PRODUZIONE DEL MESE"]=Date.now(),bt())}function sd(t,e){co&&clearTimeout(co),co=setTimeout(()=>{co=null,rd(t,e)},400)}function rd(t,e){let o=document.getElementById("contenitore-dati");if(!o)return;let i=new Set;o.querySelectorAll(".ordine-wrapper").forEach(d=>{d.querySelector(".riga-ordine.open")&&i.add(d.dataset.ordine)});let n=(t||[]).filter(d=>String(d.archiviato||"").toUpperCase()!=="TRUE");S.attiviProd=n;let a=jt(t,!1),r=jt(e,!0),s=window.innerWidth<=600,c=s?'<div class="ov-lazy-placeholder"><i class="fas fa-spinner fa-spin"></i></div>':ce(n),l=n.filter(d=>re().includes((d.stato||"").toUpperCase().trim())).length;o.innerHTML=`
        <details class="ov-accordion" id="ov-accordion"${s?"":" open"}>
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
                ${r||"<div class='empty-msg'>L'archivio \xE8 vuoto.</div>"}
            </div>
        </details>`,i.size&&o.querySelectorAll(".ordine-wrapper").forEach(d=>{if(i.has(d.dataset.ordine)){let p=d.querySelector(".riga-ordine"),f=d.querySelector(".dettagli-container");p&&f&&(p.classList.add("open"),f.style.display="block")}}),H["PROGRAMMA PRODUZIONE DEL MESE"]=o.innerHTML,X["PROGRAMMA PRODUZIONE DEL MESE"]=Date.now(),window.aggiornaListaFiltrabili(),requestAnimationFrame(It)}function za(t,e){let o=document.getElementById("ov-kanban-grid");if(!o)return;let i=(e||"").toUpperCase().trim(),n=o.querySelector(`.ov-kanban-item[data-id-riga="${t}"]`);if(n||o.querySelectorAll(".ov-kanban-item").forEach(s=>{(s.dataset.idRighe||"").split(",").map(c=>c.trim()).includes(String(t))&&(n=s)}),!n||(n.dataset.statoCorrente||"").toUpperCase().trim()===i)return;let a=o.querySelector(`.ov-stato-body[data-stato-drop="${i}"]`);if(!a)return;a.querySelectorAll(".ov-empty-lbl").forEach(s=>s.remove()),n.dataset.statoCorrente=i,n.style.transition="opacity 0.18s, transform 0.18s",n.style.opacity="0",n.style.transform="scale(0.92)",a.appendChild(n);let r=a.closest(".ov-stato-card");r&&(r.open=!0),so(o),ro(o),requestAnimationFrame(()=>{n.style.opacity="1",n.style.transform="",setTimeout(()=>{n.style.transition=""},200)})}function cd(){window.filtroRicercaArticoli=!window.filtroRicercaArticoli,document.querySelectorAll(".btn-filtro-articoli").forEach(n=>{n.classList.toggle("active",window.filtroRicercaArticoli)});let t=window.filtroRicercaArticoli?"Cerca codice articolo...":"Cerca in tutte le pagine...",e=window.filtroRicercaArticoli?"Cerca articolo":"Cerca",o=document.getElementById("universal-search"),i=document.getElementById("mobile-search");o&&(o.placeholder=t),i&&(i.placeholder=e),document.querySelectorAll(".item-card.hidden-search").forEach(n=>n.classList.remove("hidden-search")),window.filtraUniversale()}function Ii(t){let e=t==="PROGRAMMA PRODUZIONE DEL MESE";if(document.querySelectorAll(".btn-filtro-articoli").forEach(o=>{o.style.display=e?"flex":"none"}),!e&&window.filtroRicercaArticoli){window.filtroRicercaArticoli=!1,document.querySelectorAll(".btn-filtro-articoli").forEach(n=>n.classList.remove("active"));let o=document.getElementById("universal-search"),i=document.getElementById("mobile-search");o&&(o.placeholder="Cerca in tutte le pagine..."),i&&(i.placeholder="Cerca"),document.querySelectorAll(".item-card.hidden-search").forEach(n=>n.classList.remove("hidden-search"))}}async function ld(t,e){e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i>');try{let i=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"csvReviewResolve",id_riga:t,mittente:h&&h.nome?h.nome.toUpperCase():""})})).json();if(i&&i.status==="auth_error"){window._gestisciAuthError_(i.message);return}if(i&&i.status==="ok"){let n=e?e.closest(".item-card"):null;if(n){n.classList.remove("csv-review-blink","csv-review-missing","csv-review-finish");let a=n.querySelector(".csv-review-banner");a&&a.remove()}if(S.attiviProd){let a=S.attiviProd.find(r=>String(r.id_riga)===String(t));a&&(a.last_modified_by=h&&h.nome?h.nome.toUpperCase():"")}if(n){let a=n.closest(".ordine-wrapper");a&&!a.querySelector(".csv-review-blink")&&a.classList.remove("csv-review-order")}it(),g("\u2713 Riga risolta","success")}else g("\u26A0\uFE0F Errore risoluzione \u2014 riprova","error"),e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-check"></i> Risolvi')}catch(o){console.error("[csvReviewResolve]",o),g("\u26A0\uFE0F Errore rete \u2014 riprova","error"),e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-check"></i> Risolvi')}}function Ma(){window.toggleAccordion=Xl,window.toggleStatoDropdown=Gl,window.selezionaStato=Kl,window.selezionaStatoOrdine=Yl,window.toggleOpDropdown=jl,window.selezionaOpAssegna=Jl,window.selezionaOpAssegnaOrdine=Wl,window.autoAssegnami=Zl,window.autoAssegnamiOrdine=Ql,window.rimuoviOperatore=Hl,window.gestisciArchiviazione=ed,window.gestisciRipristino=nd,window.toggleQtyEvasa=od,window.aggiornaRimanente=La,window.salvaQtyEvasa=id,window.chiudiTuttiMenuAzioni=_i,window.toggleMenuAzioni=Vl,window.aggiornaDato=Ei,window.toggleFiltroArticoli=cd,window._aggiornaVisibilitaFiltroArticoli=Ii,window._ovLoadIfNeeded=Ta,window._apriArchivio=Ra,window._scrollToOrdineList=bi,window._initKanbanDnd=It,window._startPollingProduzione=fo,window._stopPollingProduzione=pe,window._pollProdStep=xi,window._repaintOpColors=bt,window.caricaDati=mo,window.caricaArchivio=ue,window._syncKanbanFromStato=za,window._setAssegnaLocalByOrdine=Si,window._refreshOverview=kt,window._invalidateProduzioneCache=it,window.csvReviewResolve=ld}function Na(){document.addEventListener("click",function(t){t.target.closest(".ord-azioni-menu")||_i()}),document.addEventListener("click",function(t){t.target.closest(".op-dropdown")||document.querySelectorAll(".op-dropdown.open").forEach(e=>{e.classList.remove("open");let o=e.closest(".item-card");o&&o.classList.remove("op-aperto");let i=e.closest(".riga-ordine");i&&i.classList.remove("op-aperto-ord")})},!0),document.addEventListener("click",function(t){!t.target.closest(".stato-dropdown")&&!t.target.closest(".stato-dropdown-ord")&&document.querySelectorAll(".stato-dropdown.open, .stato-dropdown-ord.open").forEach(e=>{e.classList.remove("open");let o=e.closest(".item-card");o&&o.classList.remove("stato-aperto");let i=e.closest(".riga-ordine");i&&i.classList.remove("stato-aperto-ord")})},!0),document.addEventListener("visibilitychange",function(){document.visibilityState==="visible"&&window.paginaAttuale==="PROGRAMMA PRODUZIONE DEL MESE"&&xi()})}var yi,co,Da=V(()=>{lt();Tt();dt();ut();Jt();wt();Vt();Ke();ao();vi();ka();yi=!1,co=null});async function Ai(t){let e=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(e)).map(o=>o.toString(16).padStart(2,"0")).join("")}function qa(){return Date.now()<vo}function dd(){go++,go>=5&&(vo=Date.now()+3e4,go=0)}function ud(){go=0,vo=0}async function Ba(){let t=document.getElementById("login-error");if(t.innerText="",t.style.color="",document.getElementById("login-view-admin")?.style.display!=="none"){let r=(document.getElementById("login-codice")?.value||"").trim();t.innerText="Usa il pulsante Entra per accedere come admin.";return}if(qa()){let r=Math.ceil((vo-Date.now())/1e3);t.innerText="Troppi tentativi. Riprova tra "+r+" secondi.";return}let o=(document.getElementById("login-email")?.value||"").trim().toLowerCase(),i=(document.getElementById("login-username")?.value||"").trim(),n=document.getElementById("login-password")?.value||"";if(!o||!i||!n){t.innerText="Compila tutti i campi: email, nome utente e password.";return}let a=document.getElementById("btn-login");a.disabled=!0,a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Verifica...';try{let r=await Ai(n),c=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"verificaLogin",email:o,username:i,hash:r})})).json();c.status==="success"?(ud(),Ct({nome:c.nome,ruolo:c.ruolo,email:c.email,vistaSimulata:c.nome,sessionToken:c.sessionToken||"",sessionExpiresAt:c.sessionExpiresAt||""}),window.salvaEApriDashboard()):(dd(),qa()?t.innerText="Troppi tentativi. Riprova tra 30 secondi.":t.innerText=c.message||"Credenziali non valide.")}catch{t.innerText="Errore di connessione. Riprova."}a.disabled=!1,a.innerHTML='Entra nel Sistema <i class="fas fa-arrow-right"></i>'}async function pd(){let t=document.getElementById("login-error");t&&(t.innerText=""),t&&(t.style.color="");let e=(document.getElementById("login-email")?.value||"").trim().toLowerCase(),o=(document.getElementById("login-username")?.value||"").trim(),i=document.getElementById("login-password")?.value||"";if(!e||!o||!i){t&&(t.innerText="Per creare l'account compila email, nome utente e password.");return}let n=document.getElementById("btn-login"),a=document.getElementById("btn-signup"),r=n?n.innerHTML:"",s=a?a.innerHTML:"";n&&(n.disabled=!0),a&&(a.disabled=!0,a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Creazione...');try{let c=await Ai(i),d=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"creaUtentePubblico",email:e,username:o,hash:c})})).json();d.status==="success"?(t&&(t.style.color="#22c55e"),t&&(t.innerText="Account creato. Accesso in corso..."),await Ba()):(t&&(t.style.color=""),t&&(t.innerText=d.message||"Impossibile creare l'account."))}catch{t&&(t.style.color=""),t&&(t.innerText="Errore di connessione. Riprova.")}finally{n&&(n.disabled=!1,n.innerHTML=r||'Entra nel Sistema <i class="fas fa-arrow-right"></i>'),a&&(a.disabled=!1,a.innerHTML=s||'<i class="fas fa-user-plus"></i> Nuovo utente? Crea account')}}function Ua(){window.hashSHA256=Ai,window._verificaAccessoUtente=Ba,window._creaAccountUtente=pd}var go,vo,Fa=V(()=>{lt();ut();go=0,vo=0});function Ci(t){if(!t)return 0;if(t instanceof Date)return t.getTime();let e=String(t).trim();if(!e)return 0;let o=e.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);if(o){let n=parseInt(o[1],10),a=parseInt(o[2],10)-1,r=parseInt(o[3]||String(new Date().getFullYear()),10);r<100&&(r+=2e3);let s=parseInt(o[4],10),c=parseInt(o[5],10),l=parseInt(o[6]||"0",10);return new Date(r,a,n,s,c,l).getTime()}let i=new Date(e);return Number.isFinite(i.getTime())?i.getTime():0}function $i(t){let e=Date.now();return(t||[]).filter(function(o){let i=Ci(o&&o._ts);return i?e-i<=md:!0})}function fd(t){t&&(t.stopPropagation(),t.preventDefault());let e=document.getElementById("modal-notifiche");if(e){e.classList.add("is-open"),wd();try{localStorage.setItem("_notifLastRead",String(Date.now()))}catch{}try{localStorage.setItem("_notifBadgeCount","0")}catch{}Ti(0),h&&h.nome&&fetch(I,{method:"POST",body:JSON.stringify({azione:"segnaLetteNotifiche",username:h.nome.toUpperCase()})}).catch(function(){})}}function ja(){let t=document.getElementById("modal-notifiche");t&&t.classList.remove("is-open")}async function gd(t,e,o,i){let n=i?i.closest(".notif-azioni-accesso"):null;n&&(n.querySelectorAll("button").forEach(function(a){a.disabled=!0}),n.innerHTML='<span class="notif-risposta-wait">\u23F3 Invio in corso\u2026</span>');try{let r=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"rispondiAccessoFuoriOrario",id:t,ok:o,json:1})})).json();if(r.status==="ok"){let s=o==="SI"?"\u2705 Accesso consentito":"\u{1F6AB} Accesso negato";vd(t,s),n&&(n.innerHTML='<span class="notif-risposta-ok">'+Gt(s)+"</span>")}else n&&(n.innerHTML='<span class="notif-risposta-err">\u26A0\uFE0F '+Gt(r.msg||"Errore")+"</span>")}catch{n&&(n.innerHTML='<span class="notif-risposta-err">\u26A0\uFE0F Errore di rete</span>')}}function Ga(){try{return JSON.parse(localStorage.getItem("_accRispIdx_")||"{}")}catch{return{}}}function vd(t,e){try{let o=Ga();o[t]=e,localStorage.setItem("_accRispIdx_",JSON.stringify(o))}catch{}}async function hd(t,e,o,i){let n=decodeURIComponent(e||""),a=decodeURIComponent(o||""),r=String(t||"").trim(),s=i?i.closest(".notifica-item"):null;s&&(s.classList.add("notif-removing"),await new Promise(function(l){setTimeout(l,190)})),bd(r,n,a),s&&s.remove();let c=document.getElementById("notifiche-list");c&&!c.querySelector(".notifica-item")&&(c.innerHTML=Oi([]));try{let l=h&&h.nome?h.nome.toUpperCase():"";if(!l)return;let p=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"eliminaNotifica",username:l,rid:r,titolo:n,corpo:a})})).json().catch(()=>({}));p.status!=="ok"&&p.status!=="not_found"&&console.warn("[notifiche] eliminaNotifica non ok:",p)}catch(l){console.warn("[notifiche] eliminaNotifica errore rete:",l)}}function bd(t,e,o){try{let i=JSON.parse(localStorage.getItem("_notificheArr")||"[]"),n=!1,a=i.filter(function(r){if(n)return!0;let s=t&&String(r.rid||"")===String(t),c=String(r.titolo||"")===String(e||"")&&String(r.corpo||"")===String(o||"");return s||c?(n=!0,!1):!0});localStorage.setItem("_notificheArr",JSON.stringify(a))}catch{}}function Ti(t){let e=document.getElementById("badge-notifiche-desktop"),o=document.getElementById("badge-notifiche-mobile"),i=document.getElementById("badge-notifiche-mobile-menu");e&&(e.textContent=t>0?t:"",e.style.display=t>0?"flex":"none"),o&&(o.textContent=t>0?t:"",o.style.display=t>0?"flex":"none"),i&&(i.textContent=t>0?t:"",i.style.display=t>0?"flex":"none")}function yd(t){return t?/stato/i.test(t)?"fa-rotate":/richiesta|comunic/i.test(t)?"fa-comment-dots":/assegnaz/i.test(t)?"fa-user-check":"fa-bell":"fa-bell"}function Oi(t){return t.length?t.map(function(e,o){let i=yd(e.titolo||""),n=Gt(e.titolo||"Notifica"),a=Gt(e.rid||""),r=encodeURIComponent(e.titolo||""),s=encodeURIComponent(e.corpo||""),c=Gt(e._ts||""),l=c?`<span class="notifica-ts">${c}</span>`:"",d="";try{let p=JSON.parse(e.corpo||"");if(p&&p.tipo==="accesso_richiesta"){let f=encodeURIComponent(p.id||""),u=encodeURIComponent(p.nome||""),m=Ga();m[p.id]?d=`<div class="notifica-corpo"><span class="notif-risposta-ok">${Gt(m[p.id])}</span></div>`:d=`<div class="notifica-corpo">Vuole entrare fuori orario.</div>
                  <div class="notif-azioni-accesso">
                                        <button class="notif-btn-consenti" onclick="event.stopPropagation(); rispondiAccessoApp(decodeURIComponent('${f}'),decodeURIComponent('${u}'),'SI',this)">\u2705 Consenti</button>
                                        <button class="notif-btn-nega"    onclick="event.stopPropagation(); rispondiAccessoApp(decodeURIComponent('${f}'),decodeURIComponent('${u}'),'NO',this)">\u{1F6AB} Nega</button>
                  </div>`}}catch{}return d||(d=`<div class="notifica-corpo">${Gt(e.corpo||"")}</div>`),`<div class="notifica-item" onclick="apriDettaglioNotifica(${o})" role="button" tabindex="0">
                    <button class="notif-del-btn" title="Elimina notifica"
                                                onclick="event.stopPropagation(); eliminaNotificaApp('${a}','${r}','${s}',this)">\xD7</button>
          <div class="notifica-icon-badge"><i class="fas ${i}"></i></div>
          <div class="notifica-body">
            <div class="notifica-titolo">${n}</div>
            ${d}
            ${l}
          </div>
        </div>`}).join(""):'<div class="notif-empty"><i class="far fa-bell-slash"></i><p>Nessuna notifica recente</p></div>'}function wd(){let t=document.getElementById("notifiche-list");if(!t)return;let e=$i(JSON.parse(localStorage.getItem("_notificheArr")||"[]"));try{localStorage.setItem("_notificheArr",JSON.stringify(e))}catch{}t.innerHTML=Oi(e),h&&h.nome&&fetch(I,{method:"POST",body:JSON.stringify({azione:"getStoricoNotifiche",username:h.nome.toUpperCase(),days:Ha})}).then(function(o){return o.json()}).then(function(o){o&&o.status==="ok"&&o.all&&o.all.length&&(ho(o.all),t.innerHTML=Oi(JSON.parse(localStorage.getItem("_notificheArr")||"[]")))}).catch(function(o){console.warn("[notifiche] renderNotificheList fetch fallito:",o)})}function ho(t){try{let e=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}),o=t.map(function(l){return Object.assign({},l,{_ts:l._ts||e})}),i=JSON.parse(localStorage.getItem("_notificheArr")||"[]"),n={};o.forEach(function(l){n[l.titolo+"||"+l.corpo]=l}),i.forEach(function(l){let d=l.titolo+"||"+l.corpo;n[d]||(n[d]=l)});let a=$i(Object.values(n)).slice(0,200);localStorage.setItem("_notificheArr",JSON.stringify(a));let r=parseInt(localStorage.getItem("_notifLastRead")||"0"),c=o.filter(function(l){let d=Ci(l._ts);return!d||d>r}).length;try{localStorage.setItem("_notifBadgeCount",String(c))}catch{}Ti(c)}catch{}}function Sd(){if(!h||!h.nome)return!1;let t=String(h.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||h.ruolo==="MASTER"}function _d(){let t=new Date,e=t.getHours()*60+t.getMinutes();return e>=540&&e<1170}function Ed(t){if(!(!t||t<=0)&&!(!h||!h.nome)&&!Sd()&&_d()){try{let e=new Date().toLocaleDateString("it-IT"),o="_notifMorningToast_"+String(h.nome).toUpperCase().trim()+"_"+e;if(localStorage.getItem(o)==="1")return;localStorage.setItem(o,"1")}catch{}g("\u{1F514} Hai "+t+" notific"+(t===1?"a":"he")+" da leggere")}}function Ri(){try{let t=$i(JSON.parse(localStorage.getItem("_notificheArr")||"[]")),e=parseInt(localStorage.getItem("_notifLastRead")||"0"),o=t.filter(function(i){let n=Ci(i._ts);return!n||n>e});o.length>0&&Ti(o.length)}catch{}!h||!h.nome||fetch(I,{method:"POST",body:JSON.stringify({azione:"getNotifiche",username:h.nome.toUpperCase(),markRead:0})}).then(function(t){return t.json()}).then(function(t){if(t&&t.status==="ok"&&t.all&&t.all.length&&(ho(t.all),Ed(t.all.length),t.titolo&&"serviceWorker"in navigator&&navigator.serviceWorker.controller))try{navigator.serviceWorker.controller.postMessage({type:"CACHE_NOTIF",titolo:t.titolo,corpo:t.corpo||""})}catch{}}).catch(function(t){console.warn("[notifiche] _initBadgeNotifiche fetch fallito:",t)})}function xd(t){var e=String(t&&t.titolo||""),o=String(t&&t.corpo||""),i=(e+" "+o).replace(/\s+/g," ").trim();if(!i)return"";var n=i.match(/\bORD(?:INE)?\.?\s*[:#-]?\s*([A-Z0-9/-]{2,})/i);if(n&&n[1])return String(n[1]).trim();var a=i.match(/\b([A-Z]{2,}[A-Z0-9]*-[A-Z0-9-]{2,})\b/i);return a&&a[1]?String(a[1]).trim():""}async function Id(t,e){try{var o=String(e||"").trim();if(!o){var i=JSON.parse(localStorage.getItem("_notificheArr")||"[]"),n=i[Number(t)];if(!n)return;o=xd(n)}if(ja(),!o){g("Nessun riferimento ordine/codice trovato in questa notifica");return}typeof window.cambiaPagina=="function"&&await window.cambiaPagina("PROGRAMMA PRODUZIONE DEL MESE",null),setTimeout(function(){["universal-search","mobile-search"].forEach(function(a){var r=document.getElementById(a);r&&(r.value=o,r.dispatchEvent(new Event("input")))}),typeof window.filtraUniversale=="function"&&window.filtraUniversale()},280)}catch(a){console.warn("[notifiche] apriDettaglioNotifica errore:",a)}}function Va(){window.apriPopupNotifiche=fd,window.chiudiPopupNotifiche=ja,window.eliminaNotificaApp=hd,window.rispondiAccessoApp=gd,window.apriDettaglioNotifica=Id}var Ha,md,Gt,Ja=V(()=>{lt();ut();dt();Ha=7,md=Ha*24*60*60*1e3;Gt=y});function yo(){let t=document.getElementById("user-name-display"),e=document.getElementById("user-avatar-icon"),o=document.getElementById("account-ddrop-avatar"),i=document.getElementById("account-ddrop-name"),n=document.getElementById("account-ddrop-role"),a=document.getElementById("user-avatar-icon-mobile"),r=document.getElementById("account-ddrop-avatar-mob"),s=document.getElementById("account-ddrop-name-mob"),c=document.getElementById("account-ddrop-role-mob");if(h&&h.nome){let l=h.nome.charAt(0).toUpperCase(),d=h.nome.toUpperCase();t&&(t.innerText=d),e&&(e.innerText=l),o&&(o.innerText=l),i&&(i.innerText=d),n&&(n.innerText=(h.ruolo||"Utente").toUpperCase()),a&&(a.innerText=l),r&&(r.innerText=l),s&&(s.innerText=d),c&&(c.innerText=(h.ruolo||"Utente").toUpperCase())}Od()}function Qa(t){try{let e=String(t||"").toUpperCase().trim();return bo[e]?bo[e]:localStorage.getItem("avatarColor_"+e)||"#374151"}catch{return"#374151"}}function Li(t){if(!t)return t;let e=String(t).trim().toUpperCase();return Wa[e]?Wa[e]:String(t).trim().toLowerCase().replace(/(?:^|\s|\.)\S/g,o=>o.toUpperCase())}function Od(){if(!h||!h.nome)return;let t=Qa(h.nome);window._renderCustomSwatches&&window._renderCustomSwatches(),window._applyAvatarColorUI&&window._applyAvatarColorUI(t)}async function Pi(){try{let t=await fetch(I,{method:"POST",body:JSON.stringify({azione:"getAvatarColors"})});if(!t.ok)return;let e=await t.json();if(typeof e!="object"||Array.isArray(e))return;if(Object.entries(e).forEach(([o,i])=>{if(!i)return;let n=o.toUpperCase().trim();bo[n]=i;try{localStorage.setItem("avatarColor_"+n,i)}catch{}}),h?.nome){let o=e[h.nome.toUpperCase().trim()];o&&window._applyAvatarColorUI&&window._applyAvatarColorUI(o)}typeof window._repaintOpColors=="function"&&window._repaintOpColors()}catch(t){console.warn("_caricaColoriAvatarDaServer:",t)}}function Ka(){return!!(h&&h.nome)}function Cd(){return h?String(h.ruolo||"").toUpperCase()==="COMMERCIALE":!1}function $d(){let t=new Date,e=t.getHours()*60+t.getMinutes();return e>=510&&e<1170}function zi(t){return sessionStorage.getItem("_accesso_extra_")==="1"||Ka()||$d()?(Za(),!0):(t!==!1&&wo(),!1)}function wo(){if(document.getElementById("_lock-screen_"))return;let t=h&&h.nome?h.nome:"",e=document.createElement("div");e.id="_lock-screen_",e.style.cssText=["position:fixed","top:0","left:0","width:100%","height:100%","background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%)","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","gap:16px","color:#e2e8f0","font-family:inherit"].join(";");let o=t?`<div style="margin-top:8px;font-size:0.82rem;color:#64748b">
               Accesso come: <strong style="color:#94a3b8">${Li?Li(t):t}</strong>
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
        <div id="_lock-stato_" style="font-size:0.82rem;color:#64748b;min-height:1.2em;text-align:center;max-width:260px"></div>`,document.body.appendChild(e)}function Za(){let t=document.getElementById("_lock-screen_");t&&t.remove(),Rd()}function Rd(){ki&&(clearInterval(ki),ki=null),Td=null}function Ya(){window._normNome=Li,window._PREDEFINED_AVATAR_COLORS=Ad,window._avatarColorsCache=bo,window._getOpColor=Qa,window._isUtenteEsente=Ka,window._isCommerciale=Cd}var bo,Wa,Ad,Td,ki,Xa=V(()=>{lt();ut();bo={};Wa={ALESSIO:"Alessio",RICCARDO:"Riccardo",FABIO:"Fabio T.","FABIO T":"Fabio T.","FABIO T.":"Fabio T.",NICCOLO:"Niccol\xF2","NICCOLO'":"Niccol\xF2","NICCOL\xD2'":"Niccol\xF2",RAYMOND:"Raymond",SIMONE:"Simone",GIACOMO:"Giacomo"};Ad=["#8fe45e","#6366f1","#f59e0b","#ec4899","#06b6d4","#f87171","#a78bfa","#34d399"];Td=null,ki=null;setInterval(function(){h&&h.nome&&zi(!0)},60*1e3)});var Wd=ys(()=>{lt();Tt();ut();wt();Vt();Wi();Jt();dt();dn();bn();Pn();Qn();$a();Da();Fa();Ja();Xa();try{let t=document.getElementById("critical-init");t&&t.remove()}catch{}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("controllerchange",()=>{window.location.reload()});"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",function(t){if(t.data&&t.data.type==="NUOVE_NOTIFICHE"){ho(t.data.notifiche||[]);var e=t.data.notifiche||[];e.length>0&&e[0].titolo&&"caches"in window&&caches.open("prod-last-notif").then(function(i){i.put("last",new Response(JSON.stringify({titolo:e[0].titolo,corpo:e[0].corpo||""})))}).catch(function(){});return}if(t.data&&t.data.type==="OPEN_CSV_MODAL"){typeof window.cambiaPagina=="function"&&window.cambiaPagina("IMPOSTAZIONI",null).catch(function(){});return}if(t.data&&t.data.type==="OPEN_NOTIFICATION_TARGET")try{var o=String(t.data.target||"").trim();o&&typeof window.apriDettaglioNotifica=="function"&&window.apriDettaglioNotifica(-1,o)}catch{}});var ts=!1,me=null,fe=null,So=0,Te=0,es=0,Mi=!1,kd=0,os=0;function Ld(){let t=h?.sessionExpiresAt;if(!t)return 0;let e=Number(t);if(Number.isFinite(e)&&e>0)return e;let o=new Date(t).getTime();return Number.isFinite(o)?o:0}function is(){let t=Ld();if(!t)return;let e=t-Date.now();if(e<=0||e>1440*60*1e3||Date.now()-os<180*1e3)return;os=Date.now();let o=Math.max(1,Math.floor(e/36e5));g("Sessione in scadenza tra circa "+o+" ore. Rientra per rinnovarla.","warning")}function Di(t){kd=Number(t)||Date.now()}function Io(){return Hi()}function Pd(){ji()}function ls(){if(ts||typeof window.fetch!="function")return;let t=window.fetch.bind(window);function e(o){return Pd(),o.clone().text().then(function(i){try{let n=JSON.parse(i);n&&n.status==="auth_error"&&us(n.message||n.msg||"Sessione scaduta."),n&&n.status==="fuori_orario"&&typeof wo=="function"&&wo()}catch{}}).catch(function(){}),o}window.fetch=function(o,i){try{let n=Io(),a=typeof o=="string"?o:o&&o.url?o.url:"";if(!a||a.indexOf(I)!==0)return t(o,i);let r=String(i&&i.method||"GET").toUpperCase();if(r==="GET")return t(o,i).then(e);if(r==="POST"&&i&&typeof i.body=="string")try{let s=JSON.parse(i.body||"{}");if(n&&!s.sessionToken){s.sessionToken=n;let c=Object.assign({},i,{body:JSON.stringify(s)});return t(o,c).then(e)}}catch{}return t(o,i).then(e)}catch{}return t(o,i)},ts=!0}ls();async function Ao(){let t=Io();if(!t)return!1;let e=h||null;if(!e)try{let o=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");e=o?JSON.parse(o):null}catch{}try{let i=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"refreshSession",sessionToken:t,username:e&&e.nome?String(e.nome):"",email:e&&e.email?String(e.email):""})})).json();if(i&&i.status==="success"&&i.sessionToken){So=0,Te=0,h||Ct({}),h.sessionToken=i.sessionToken,h.sessionExpiresAt=i.sessionExpiresAt||"",h.expiresAt=Date.now()+2592e6,!h.nome&&i.nome&&(h.nome=i.nome),!h.email&&i.email&&(h.email=i.email),!h.ruolo&&i.ruolo&&(h.ruolo=i.ruolo);try{localStorage.setItem("sessioneUtente",JSON.stringify(h))}catch{}try{sessionStorage.setItem("sessioneUtente",JSON.stringify(h))}catch{}return!0}if(i&&i.status==="auth_error")return So++,So>=3&&(So=0,Re()),!1}catch{}return!1}function ds(){me&&clearInterval(me),fe&&clearInterval(fe),me=setInterval(Ao,300*1e3),fe=setInterval(is,60*1e3),is()}window.addEventListener("storage",function(t){if(!(t.key!=="sessioneUtente"||!t.newValue))try{let e=JSON.parse(t.newValue);if(!e||!e.sessionToken)return;h||Ct({}),h.sessionToken=String(e.sessionToken),e.sessionExpiresAt&&(h.sessionExpiresAt=e.sessionExpiresAt)}catch{}});document.addEventListener("visibilitychange",function(){document.hidden||Ao()});var ns=!1;async function us(t){if(ns)return;var e=document.getElementById("login-overlay");if(e&&e.style.display!=="none")return;let o=Date.now();if(o-es>3e4&&(Te=0),es=o,Te++,Te===1&&!Mi){Mi=!0;try{if(await Ao()){Te=0;return}}finally{Mi=!1}}ns=!0,g(t||"Sessione scaduta. Effettua nuovamente il login.","error"),setTimeout(function(){Re()},2e3)}try{let t=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");if(t){let e=JSON.parse(t);if(e&&e.sessionToken){let o=document.getElementById("login-overlay");o&&(o.style.display="none"),document.documentElement.classList.add("has-session")}}}catch{}var qi=null,Bi=!1;window.filtroRicercaArticoli=Bi;var zd=[];function Md(){return[{nome:"PREPARARE",colore:"#94a3b8"},{nome:"PREPARARE PER LAVORAZIONE",colore:"#64748b"},{nome:"MANDA IN LAVORAZIONE",colore:"#475569"},{nome:"IN LAVORAZIONE",colore:"#f59e0b"},{nome:"TORNATO DALLA LAVORAZIONE",colore:"#7c3aed"},{nome:"IN PRODUZIONE",colore:"#242424"},{nome:"IMBALLATO",colore:"#22c55e"},{nome:"SPEDITO/CONSEGNATO",colore:"#06b6d4"}]}var Nd=[],as=!1,Dd=0,Ni=0,_o=null,ss=0,At=null,Ot=null,ps="BAHqp3uv56mQSAeTv_66-f4GYkzaESwuJNOP5DJCVMi197n-EKl9TW9XPrKeIIDpzBz0HTM42AcUCXWmOP5BSYI";async function ms(){if(!(!("serviceWorker"in navigator)||!("PushManager"in window)))try{let t=await navigator.serviceWorker.register("sw.js",{scope:"./"});await navigator.serviceWorker.ready,"caches"in window&&await(await caches.open("prod-auth")).put("username",new Response(h.nome.toUpperCase()));let e=await t.pushManager.getSubscription(),o=Notification.permission;if(!e&&o==="granted")try{e=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:window._vapidB64ToUint8_?window._vapidB64ToUint8_(ps):null})}catch(a){console.warn("[Push] Auto-subscribe failed:",a);try{localStorage.setItem("_pushStato","errore-subscribe")}catch{}return}if(!e){try{localStorage.setItem("_pushStato","no-permesso")}catch{}return}let i=e.toJSON(),n=await fs({endpoint:i.endpoint,p256dh:i.keys?.p256dh,auth:i.keys?.auth});if(n&&(n.status==="saved"||n.status==="updated"))try{localStorage.setItem("_pushStato","ok")}catch{}else if(n&&n.status==="errore-verifica"){try{localStorage.setItem("_pushStato","errore-verifica")}catch{}g('\xE2\u0161\xA0\xEF\xB8\x8F Subscription creata ma NON confermata sul server. Riprova "Ri-registra subscription".',"error")}else try{localStorage.setItem("_pushStato","errore-salvataggio")}catch{}window._aggiornaUINotifiche&&window._aggiornaUINotifiche()}catch(t){console.warn("[Push] initPush:",t);try{localStorage.setItem("_pushStato","errore:"+t.message)}catch{}}}async function fs(t){try{let o=await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"salvaSottoscrizione",username:h.nome.toUpperCase(),endpoint:t.endpoint,p256dh:t.p256dh||"",auth:t.auth||""})})).json().catch(()=>({}));if(o&&(o.status==="saved"||o.status==="updated"))try{(await(await fetch(I,{method:"POST",body:JSON.stringify({azione:"verificaIscrizione",username:h.nome.toUpperCase(),endpoint:t.endpoint})})).json().catch(()=>({}))).found||(console.warn("[Push] verificaIscrizione: endpoint NON trovato nel foglio dopo il salvataggio!"),o.status="errore-verifica")}catch(i){console.warn("[Push] verificaIscrizione error:",i)}return o}catch(e){console.warn("[Push] _salvaSubVAPID_ error:",e)}}var xo=null,rs=null,qd={card:"bg-white/90 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow",cardGrid:"grid gap-3",label:"text-[10px] uppercase tracking-wide text-slate-500 font-semibold",value:"text-slate-900 font-semibold",btn:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] transition",btnPrimary:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.99] transition",btnSuccess:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.99] transition",btnWarning:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 active:scale-[0.99] transition",btnDanger:"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.99] transition",btnPrimaryLg:"inline-flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 active:scale-[0.98] transition shadow-sm",pill:"inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600"};function Oo(){xo=document.querySelectorAll(".ordine-wrapper, .chat-card, .materiale-card, .manuale-card")}function gs(){if(typeof I>"u")return;U("_html__acq_ordini"),A.dashPromise=fetch(I,{method:"POST",body:JSON.stringify({azione:"getAllDashboard",includeArchivio:!1})}).then(function(o){return o.ok?o.json():null}).catch(function(){return null}),A.rqPromise=fetch(I,{method:"POST",body:JSON.stringify({azione:"getAllRichieste"})}).then(function(o){return o.ok?o.json():null}).catch(function(){return null}),A.matPromise=fetch(I,{method:"POST",body:JSON.stringify({pagina:"MATERIALE DA ORDINARE"})}).then(function(o){return o.ok?o.json():null}).catch(function(){return null});let e=h?.nome?.toUpperCase().trim()==="ALESSIO"?"":h?.nome||"";A.ordiniPromise=fetch(I,{method:"POST",body:JSON.stringify({azione:"getOrdiniAcquisti",operatore:e})}).then(function(o){return o.ok?o.json():null}).catch(function(){return null}),A.dashPromise.then(function(o){o&&(A.dashBundle=o)}),A.rqPromise.then(function(o){o&&(A.rqBundle=o)}),A.matPromise.then(function(o){o&&(A.matBundle=o)}),A.ordiniPromise.then(function(o){o&&(A.ordiniBundle=o)})}function Bd(){let t=null;try{t=localStorage.getItem("ultimaPaginaProduzione")}catch{}(!t||t==="undefined"||t==="null")&&(t="PROGRAMMA PRODUZIONE DEL MESE"),delete H[t],X[t]=0,U("_html_"+t)}function vs(){ls(),ds(),At&&At.registerGlobals(),Ot&&Ot.registerGlobals(),Ln(),Ca(),Na(),window.cambiaPagina=Eo,window.aggiornaListaFiltrabili=Oo,Zi({onRemoteChange:function(i){switch(g("\u{1F504} "+i+" ha aggiornato i dati"),Di(Date.now()),qi){case"PROGRAMMA PRODUZIONE DEL MESE":ge("PROGRAMMA_PRODUZIONE",uo,po,!0).catch(n=>console.warn("[RevisionPoller] refresh failed:",n));break;case"STORICO_RICHIESTE":Et();break;case"MATERIALE DA ORDINARE":Wt(null);break;case"MANUALI_PRODOTTI":Ee(null,null,!0);break;case"ARCHIVIO_ORDINI":typeof ue=="function"&&ue();break}},onUsersOnline:function(i){jd(i)},getUtenteAttuale:function(){return h},getPaginaCorrente:function(){return qi}}),N.start(),Di(Date.now());let e=null;try{e=localStorage.getItem("ultimaPaginaProduzione")}catch{}(!e||e==="undefined"||e==="null")&&(e="PROGRAMMA PRODUZIONE DEL MESE");let o=document.querySelector(`.menu-item[data-page="${e}"]`);Eo(e,o).catch(i=>{i&&i.name!=="AbortError"&&console.warn("[init] cambiaPagina:",i)});try{if(new URLSearchParams(window.location.search).get("action")==="openCsvModal"){let a=window.location.pathname+window.location.hash;window.history.replaceState(null,"",a),setTimeout(function(){Eo("IMPOSTAZIONI",null).then(function(){setTimeout(function(){typeof window._apriCsvPendingModal_=="function"&&window._apriCsvPendingModal_()},300)}).catch(function(){})},400)}}catch{}}window.onload=async function(){if(as)return;as=!0;let t=document.getElementById("login-overlay"),e=null;try{e=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente")}catch{}if(e){if(Ct(JSON.parse(e)),h.expiresAt&&Date.now()>h.expiresAt){Ct(null);try{localStorage.removeItem("sessioneUtente"),sessionStorage.removeItem("sessioneUtente")}catch{}document.documentElement.classList.remove("has-session"),t&&(t.style.display="flex",t.style.opacity="1");let o=document.getElementById("login-error");o&&(o.innerText="Sessione scaduta. Effettua nuovamente il login.",o.style.color="#ef4444");return}if(h.ruolo!=="MASTER"&&!h.sessionToken){Ct(null);try{localStorage.removeItem("sessioneUtente"),sessionStorage.removeItem("sessioneUtente")}catch{}document.documentElement.classList.remove("has-session"),t&&(t.style.display="flex",t.style.opacity="1");let o=document.getElementById("login-error");o&&(o.innerText="Sessione non pi\xC3\xB9 valida. Effettua di nuovo il login.",o.style.color="#ef4444");return}gs(),yo(),ms(),Ri(),(window.requestIdleCallback||function(o){setTimeout(o,3e3)})(function(){Pi()}),t&&(t.style.display="none")}else document.documentElement.classList.remove("has-session"),t&&(t.style.display="flex",t.style.opacity="1");if(e&&typeof Oe=="function"&&await Oe().catch(o=>console.warn("[Boot] caricaDatiIniziali:",o)),e){if(h.ruolo!=="MASTER"&&!h.nome){document.documentElement.classList.remove("has-session");try{localStorage.removeItem("sessioneUtente"),sessionStorage.removeItem("sessioneUtente")}catch{}t&&(t.style.display="flex",t.style.opacity="1");return}vs()}};function Ud(){let t=document.getElementById("main-sidebar");if(!t)return;let e=t.classList.toggle("collapsed");document.body.classList.toggle("sidebar-collapsed",e);try{localStorage.setItem("sidebarCollapsed",e?"1":"0")}catch{}}function Fd(){try{let t=localStorage.getItem("sidebarCollapsed"),e=document.getElementById("main-sidebar");t==="1"&&(e&&e.classList.add("collapsed"),document.body.classList.add("sidebar-collapsed"))}catch{}}document.addEventListener("DOMContentLoaded",Fd);async function Hd(){if(!zi(!0))return;h&&(h.expiresAt=Date.now()+2592e6);try{localStorage.setItem("sessioneUtente",JSON.stringify(h))}catch{}try{sessionStorage.setItem("sessioneUtente",JSON.stringify(h))}catch{}ds(),Ao();let t=document.getElementById("login-overlay");t.style.transition="opacity 0.4s ease",t.style.opacity="0",gs(),U("_impostazioni_cache"),await Promise.all([Oe().catch(e=>console.warn("caricaDatiIniziali post-login:",e)),new Promise(e=>setTimeout(e,400))]),t.style.display="none",document.documentElement.classList.add("has-session"),typeof yo=="function"&&yo(),ms(),Ri(),(window.requestIdleCallback||function(e){setTimeout(e,3e3)})(function(){Pi()}),Bd(),vs()}function Re(){if(!Re._running){Re._running=!0,N.stop(),pe();try{let t=Io();t&&fetch(I,{method:"POST",body:JSON.stringify({azione:"logout",sessionToken:t})}).catch(function(){}),me&&(clearInterval(me),me=null),fe&&(clearInterval(fe),fe=null);try{q.clear()}catch{}let e={};for(let o=0;o<localStorage.length;o++){let i=localStorage.key(o);i&&(Ji.some(n=>i.startsWith(n))||Vi.includes(i))&&(e[i]=localStorage.getItem(i))}localStorage.clear(),sessionStorage.clear(),Object.entries(e).forEach(([o,i])=>{try{localStorage.setItem(o,i)}catch{}}),window.location.href=window.location.origin+window.location.pathname+"?logout="+Date.now()}catch(t){console.error("Errore durante il logout:",t),window.location.reload()}}}function jd(t){var e=h&&h.nome?h.nome.toUpperCase():"",o=t.filter(function(c){return c.nome.toUpperCase()!==e}),i=document.getElementById("user-avatar-btn"),n=document.getElementById("user-avatar-btn-mobile");if(o.length===0){var a=document.getElementById("online-indicator");a&&a.remove();var r=document.getElementById("online-indicator-mob");r&&r.remove();return}var s="Online ora: "+o.map(function(c){return c.nome+(c.pagina?" ("+c.pagina+")":"")}).join(", ");[{parent:i,id:"online-indicator"},{parent:n,id:"online-indicator-mob"}].forEach(function(c){if(c.parent){var l=document.getElementById(c.id);l||(l=document.createElement("span"),l.id=c.id,c.parent.appendChild(l)),l.title=s}})}document.addEventListener("visibilitychange",function(){N._timer&&(document.hidden?N._schedule(N.INTERVAL_BG_MS):(N._check(),N._schedule(N.INTERVAL_FOCUS_MS)))});window.addEventListener("online",function(){N._timer&&N._check()});async function Eo(t,e){let o=Date.now();if(o-ss<300)return;if(ss=o,_o)try{_o.abort()}catch{}_o=new AbortController;let i=_o.signal,n=++Dd;Ni=n,window._latestNavRequest=n,xo=null,t!=="PROGRAMMA PRODUZIONE DEL MESE"&&pe();let a=document.getElementById("universal-search");a&&(a.value="");let r=document.getElementById("desk-search-input");r&&(r.value=""),(!t||t==="undefined"||t==="null")&&(t="PROGRAMMA PRODUZIONE DEL MESE"),localStorage.setItem("ultimaPaginaProduzione",t),qi=t,window.paginaAttuale=t,Ii(t),document.body.classList.toggle("page-pip",t==="PIPISTRELLI"),t!=="PIPISTRELLI"&&At&&At.resetPipFetch(),t!=="KIT_PRODOTTI"&&Ot&&Ot.resetKitFetch();let s=document.getElementById("acq-tab-bar");s&&(s.style.display=t==="MATERIALE DA ORDINARE"?"flex":"none"),document.querySelectorAll(".menu-item").forEach(m=>m.classList.remove("active")),document.querySelectorAll(".tab-item").forEach(m=>m.classList.remove("active")),e||(e=document.querySelector(`.menu-item[data-page="${t}"]`)),e&&e.classList.add("active");let c=document.querySelector(`.tab-item[data-page="${t}"]`);c&&c.classList.add("active");let l={IMPOSTAZIONI:"Impostazioni Sistema",STORICO_RICHIESTE:"La mia Casella",ARCHIVIO_ORDINI:"Archivio Ordini","MATERIALE DA ORDINARE":"Gestione Acquisti",MANUALI_PRODOTTI:"Manuali Prodotti","PROGRAMMA PRODUZIONE DEL MESE":"Dashboard Produzione",PIPISTRELLI:"\xF0\u0178\xA6\u2021 Pipistrelli",KIT_PRODOTTI:"\xF0\u0178\xA7\xB0 Kit Prodotti"},d=document.getElementById("titolo-pagina");d&&(d.innerText=l[t]||t);let p=document.getElementById("page-title-desktop");p&&(p.innerText=l[t]||t);let f=document.getElementById("floating-cart-btn");if(f){let m=t==="MATERIALE DA ORDINARE";f.style.display=m?"flex":"none",!m&&typeof chiudiModalCarrello=="function"&&chiudiModalCarrello()}let u=document.getElementById("contenitore-dati");if(!H[t]){let m="_html_"+t,b=pt(m,3e5);if(b){H[t]=b;try{let w=localStorage.getItem(m),v=w?JSON.parse(w):null;X[t]=v&&v.ts?v.ts:Date.now()-3e5-1e3}catch{X[t]=Date.now()-3e5-1e3}}}if(H[t]?u.innerHTML="":u.innerHTML=`<div class="nav-skeleton">
            <div class="nav-skel-bar" style="width:60%"></div>
            <div class="nav-skel-bar" style="width:85%"></div>
            <div class="nav-skel-bar" style="width:45%"></div>
            <div class="nav-skel-bar" style="width:75%"></div>
        </div>`,["modalAiuto","modal-conferma","modal-gestione-articolo","modal-carrello"].forEach(m=>{let b=document.getElementById(m);if(b){if(m==="modal-carrello"){b.classList.remove("cart-open");return}if(m==="modal-gestione-articolo"){b.classList.remove("active"),setTimeout(()=>{b.classList.contains("active")||(b.style.display="none")},300);return}b.classList.remove("active"),setTimeout(()=>{b.classList.contains("active")||(b.style.display="none")},300)}}),t==="STORICO_RICHIESTE"){let m=document.getElementById("badge-richieste-count");m&&(m.style.display="none",m.classList.remove("badge-sollecito-attivo"));let b=document.getElementById("badge-mobile-notif");b&&(b.style.display="none");let w=document.getElementById("badge-bottom-richieste");w&&(w.style.display="none",w.classList.remove("badge-sollecito-attivo"))}if(H[t]){u.innerHTML=H[t],Di(X[t]||Date.now()),z(u),Oo(),requestAnimationFrame(It),t==="PROGRAMMA PRODUZIONE DEL MESE"&&fo();let m=Date.now(),b=X[t]||0;m-b>3e5&&(t==="PROGRAMMA PRODUZIONE DEL MESE"?mo(t,!0,n,i):t==="MATERIALE DA ORDINARE"?Wt(null,n,i,!0):t==="STORICO_RICHIESTE"?ge("STORICO_RICHIESTE",()=>te(i),we,!0).catch(()=>{}):t==="MANUALI_PRODOTTI"?Ee(n,i,!0).catch(()=>{}):t==="ARCHIVIO_ORDINI"&&ue());return}switch(t){case"IMPOSTAZIONI":Ht();break;case"STORICO_RICHIESTE":{let m=document.getElementById("contenitore-dati");m&&(m.innerHTML="<div class='centered-msg' id='_ric-loader'>Caricamento messaggi in corso...</div>"),ge("STORICO_RICHIESTE",te,we).catch(async b=>{if(b&&b.name==="AbortError")return;let w=null;try{w=await q.get("STORICO_RICHIESTE")}catch{}if(w){let v=new Date(w.timestamp),x=String(v.getHours()).padStart(2,"0"),O=String(v.getMinutes()).padStart(2,"0");g("Connessione assente \xE2\u20AC\u201D mostro dati salvati alle "+x+":"+O,"warning")}else{let v=document.getElementById("contenitore-dati");v&&(v.innerHTML=`<div class='centered-error-bold'>Errore nel caricamento. <button onclick="cambiaPagina('STORICO_RICHIESTE',null)" style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">Riprova</button></div>`,z(v))}});break}case"ARCHIVIO_ORDINI":ue();break;case"MATERIALE DA ORDINARE":Wt(e?"catalogo":null,n,i);break;case"MANUALI_PRODOTTI":Ee(n,i,!1);break;case"ORDINI_ACQUISTI":Wt("ordini",n,i);return;case"PIPISTRELLI":try{At||(At=await import("./chunk-pipistrelli-JJFXIZV6.js"),At.registerGlobals()),At.caricaPipistrelli()}catch(m){if(m&&m.name==="AbortError")return;console.warn("[PIPISTRELLI] Errore caricamento modulo:",m);let b=document.getElementById("contenitore-dati");b&&(b.innerHTML=`<div class='centered-error-bold'>Errore nel caricamento. <button onclick="cambiaPagina('PIPISTRELLI',null)" style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">Riprova</button></div>`,z(b)),At=null}break;case"KIT_PRODOTTI":try{if(Ot||(Ot=await import("./chunk-kit-prodotti-L5AAJ2JC.js"),Ot.registerGlobals()),n!==Ni||window.paginaAttuale!=="KIT_PRODOTTI")return;Ot.caricaKitProdotti()}catch(m){if(m&&m.name==="AbortError"||n!==Ni||window.paginaAttuale!=="KIT_PRODOTTI")return;console.warn("[KIT_PRODOTTI] Errore caricamento modulo:",m);let b=document.getElementById("contenitore-dati");b&&(b.innerHTML=`<div class='centered-error-bold'>Errore nel caricamento. <button onclick="cambiaPagina('KIT_PRODOTTI',null)" style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">Riprova</button></div>`,z(b)),Ot=null}break;default:{let m=document.getElementById("contenitore-dati");m&&(m.innerHTML="<div class='inline-msg' id='_prod-loader'>Caricamento Dashboard...</div>",z(m)),ge("PROGRAMMA_PRODUZIONE",uo,po).catch(async b=>{if(b&&b.name==="AbortError")return;let w=null;try{w=await q.get("PROGRAMMA_PRODUZIONE")}catch{}if(w){let v=new Date(w.timestamp),x=String(v.getHours()).padStart(2,"0"),O=String(v.getMinutes()).padStart(2,"0");g("Connessione assente \xE2\u20AC\u201D mostro dati salvati alle "+x+":"+O,"warning")}else{let v=document.getElementById("contenitore-dati");v&&(v.innerHTML=`<div class='inline-error'>Errore nel caricamento dati.
                                <button onclick="cambiaPagina('PROGRAMMA PRODUZIONE DEL MESE', null)"
                                    style="margin-left:8px;padding:4px 12px;background:#242424;color:#fff;border:none;border-radius:6px;cursor:pointer">
                                    &#x21bb; Riprova</button></div>`,z(v))}})}}}function Gd(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Vd(t,e){return!e||t.trimStart().startsWith(e)?!0:t.split(/[\s(,;]+/).some(o=>o.toLowerCase().startsWith(e))}function Jd(){clearTimeout(rs),rs=setTimeout(function(){let t=document.getElementById("universal-search"),e=document.getElementById("mobile-search"),o=t&&t.value!==""?t.value:e&&e.value!==""?e.value:t?t.value:"",i=String(o||"").trim().toLowerCase();xo||Oo(),typeof window.filtroRicercaArticoli<"u"&&(Bi=!!window.filtroRicercaArticoli);let n=!!Bi,a=i?new RegExp(Gd(i),"i"):null;(xo||[]).forEach(function(s){if(!i){s.classList.remove("hidden-search");return}let c=(s.textContent||"").toLowerCase(),l=(s.getAttribute("data-codice")||"").toLowerCase(),d=!1;if(n)d=l?l.indexOf(i)!==-1:c.indexOf(i)!==-1;else{let p=(s.getAttribute("data-cliente")||"").toLowerCase(),f=(s.getAttribute("data-ordine")||s.getAttribute("data-codice")||"").toLowerCase(),u=(s.getAttribute("data-riferimento")||"").toLowerCase(),m=(s.getAttribute("data-codici")||"").toLowerCase(),b=c+" "+p+" "+f+" "+u+" "+m,w=Vd(b,i),v=a?a.test(b):!1;d=w||i.length>=2&&v}s.classList.toggle("hidden-search",!d)});let r=document.getElementById("sezione-archivio");r&&(r.style.display=i===""?"block":"none")},120)}Ua();Va();Ya();Fi();ln();hn();kn();Zn();Oa();Ma();window.cambiaPagina=Eo;window.aggiornaListaFiltrabili=Oo;window.filtraUniversale=Jd;window.toggleSidebar=Ud;window.logout=Re;window.salvaEApriDashboard=Hd;window.cacheContenuti=H;window.TW=qd;window.listaStati=Nd;window.listaOperatori=zd;window._VAPID_PUBLIC_KEY=ps;window._salvaSubVAPID_=fs;window._gestisciAuthError_=us;window._getSessionToken_=Io;window._defaultListaStati_=Md});export default Wd();
//# sourceMappingURL=script.bundle.js.map
