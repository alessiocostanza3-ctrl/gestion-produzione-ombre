var I=(t,e)=>()=>(t&&(e=t(t=0)),e);var Jt=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var O,Qt,C=I(()=>{O="https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec",Qt=[{codice:"PROD:IMBALLAGGI",icona:"\u{1F4E6}",nome:"Tavolo Imballaggi",domanda:"Cosa stai imballando?",statoDefault:"IMBALLATO"},{codice:"PROD:LAVORAZIONE",icona:"\u{1F527}",nome:"Postazione Lavorazione",domanda:"Cosa stai lavorando?",statoDefault:"IN LAVORAZIONE"},{codice:"PROD:ASSEMBLAGGIO",icona:"\u{1F6E0}\uFE0F",nome:"Postazione Assemblaggio",domanda:"Cosa stai assemblando?",statoDefault:"IN LAVORAZIONE"},{codice:"PROD:CONTROLLO",icona:"\u{1F50D}",nome:"Controllo Qualit\xE0",domanda:"Cosa stai controllando?",statoDefault:"IN PRODUZIONE"},{codice:"PROD:MAGAZZINO",icona:"\u{1F3ED}",nome:"Magazzino / Preparazione",domanda:"Cosa stai preparando?",statoDefault:"PREPARARE PER LAVORAZIONE"},{codice:"PROD:SPEDIZIONI",icona:"\u{1F69A}",nome:"Spedizioni",domanda:"Cosa stai spedendo?",statoDefault:"IMBALLATO"}]});function Zt(t){u=t}function st(){try{let t=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");if(t){let e=JSON.parse(t);if(e&&e.expiresAt&&Date.now()>e.expiresAt){z(),u=null;let o=document.getElementById("login-overlay");return o&&(o.style.display="flex",o.style.opacity="1"),""}if(e&&e.sessionToken){let o=String(e.sessionToken);return u&&u.sessionToken!==o&&(u.sessionToken=o),o}}}catch{}try{if(u&&u.sessionToken)return String(u.sessionToken)}catch{}try{let t=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");if(!t)return"";let e=JSON.parse(t);return e&&e.sessionToken?String(e.sessionToken):""}catch{return""}}function z(){try{localStorage.removeItem("sessioneUtente")}catch{}try{sessionStorage.removeItem("sessioneUtente")}catch{}}function Wt(){try{let t=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");if(!t)return;let e=JSON.parse(t);if(!e||!e.sessionToken)return;e.expiresAt=Date.now()+288e5,u&&(u.expiresAt=e.expiresAt);try{localStorage.setItem("sessioneUtente",JSON.stringify(e))}catch{}try{sessionStorage.setItem("sessioneUtente",JSON.stringify(e))}catch{}}catch{}}var u,j=I(()=>{C();u=null});async function R(t){let e=st(),o=e?{...t,_token:e}:{...t},i=await fetch(O,{method:"POST",body:JSON.stringify(o)});if(!i.ok)throw new Error(`HTTP ${i.status}`);let n=await i.json();if(n&&n.status==="auth_error"){z();let s=new Error("auth_error");throw s.authError=!0,s}return n}async function te(){let t=new AbortController,e=setTimeout(()=>t.abort(),5e3);try{let o=await fetch(O+"?azione=getRevision",{signal:t.signal});return clearTimeout(e),await o.json()}catch(o){throw clearTimeout(e),o}}var at=I(()=>{C();j()});function _(t,e){let o=document.getElementById("toast-notifica");o||(o=document.createElement("div"),o.id="toast-notifica",document.body.appendChild(o)),o.className="toast-notifica"+(e==="error"?" toast-error":""),o.innerText=t,o.offsetWidth,o.classList.add("visible"),clearTimeout(o._hideTimer),o._hideTimer=setTimeout(()=>{o.classList.remove("visible")},3e3)}function rt(t){t&&(t.classList.add("fade-in"),setTimeout(()=>t.classList.remove("fade-in"),300))}function oe(t){L=t.onSceglioClient||null,P=t.onSceglioServer||null;let e=t.altroUtente?String(t.altroUtente).charAt(0).toUpperCase()+String(t.altroUtente).slice(1).toLowerCase():"un altro utente";document.getElementById("conflitto-desc").textContent=e+" ha salvato questa riga mentre stavi modificando. Cosa vuoi fare?",document.getElementById("conflitto-tua").textContent=t.tuaModifica||"\u2014",document.getElementById("conflitto-server").textContent=t.serverModifica||"\u2014",document.getElementById("conflitto-altroUtente").textContent=e.toUpperCase(),document.getElementById("conflitto-btn-altro").textContent=e;let o=document.getElementById("modal-conflitto");o.style.display="flex",requestAnimationFrame(()=>o.classList.add("active"))}function Et(t){let e=document.getElementById("modal-conflitto");e.classList.remove("active"),setTimeout(()=>{e.style.display="none"},300),t==="client"&&typeof L=="function"?L():t==="server"&&typeof P=="function"&&P(),L=null,P=null}function ie(t,e,o,i){let n=document.getElementById("modal-conferma"),s=document.getElementById("modal-conferma-titolo"),a=document.getElementById("modal-conferma-msg"),c=document.getElementById("modal-conferma-ok");n&&(s&&(s.textContent=t||""),a&&(a.textContent=e||""),c&&(c.textContent=i||"Conferma",c.onclick=()=>{pt(),typeof o=="function"&&o()}),n.style.display="flex",requestAnimationFrame(()=>n.classList.add("active")))}function pt(){let t=document.getElementById("modal-conferma");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ne(){window._conflittoScegli=Et,window._chiudiConferma=pt}var L,P,U=I(()=>{L=null,P=null});async function pe(t,e,o,i){let n=document.getElementById("ptr-indicator");function s(){n&&(n.textContent="Aggiornamento...",n.style.display="block")}function a(){n&&(n.style.display="none",n.textContent="")}function c(l){if(!l)return"";let m=new Date(l);return m.getHours().toString().padStart(2,"0")+":"+m.getMinutes().toString().padStart(2,"0")}let r=null,p=null;if(i)s();else{try{r=await N.get(t)}catch{}if(r){p=r.dati;try{o(r.dati)}catch(l){console.warn("[ProdCache] renderFn (cache):",l)}r.isStale&&s()}else s()}try{let l=await e();try{await N.set(t,l)}catch{}let m=JSON.stringify(l),d=JSON.stringify(p);if(m!==d)try{o(l)}catch(f){console.warn("[ProdCache] renderFn (fetch):",f)}a()}catch(l){if(a(),r){let m=c(r.timestamp);try{_("Dati offline \u2014 ultimo aggiornamento "+m,"warning")}catch{}}else throw l}}var N,ce,ct=I(()=>{C();U();N={DB_NAME:"prod-cache",DB_VERSION:1,STORE:"pagine",TTL:3e5,_db:null,open(){return this._db?Promise.resolve(this._db):new Promise((t,e)=>{let o=indexedDB.open(this.DB_NAME,this.DB_VERSION);o.onupgradeneeded=i=>{let n=i.target.result;n.objectStoreNames.contains(this.STORE)||n.createObjectStore(this.STORE,{keyPath:"chiave"})},o.onsuccess=i=>{this._db=i.target.result,t(this._db)},o.onerror=i=>e(i.target.error)})},async set(t,e){try{let o=await this.open();return new Promise((i,n)=>{let c=o.transaction(this.STORE,"readwrite").objectStore(this.STORE).put({chiave:t,dati:e,timestamp:Date.now()});c.onsuccess=()=>i(),c.onerror=r=>n(r.target.error)})}catch(o){console.warn("[ProdCache] set error:",o)}},async get(t){try{let e=await this.open();return new Promise((o,i)=>{let a=e.transaction(this.STORE,"readonly").objectStore(this.STORE).get(t);a.onsuccess=c=>{let r=c.target.result;if(!r){o(null);return}o({dati:r.dati,timestamp:r.timestamp,isStale:Date.now()-r.timestamp>N.TTL})},a.onerror=c=>i(c.target.error)})}catch(e){return console.warn("[ProdCache] get error:",e),null}},async invalidate(t){try{let e=await this.open();return new Promise((o,i)=>{let a=e.transaction(this.STORE,"readwrite").objectStore(this.STORE).delete(t);a.onsuccess=()=>o(),a.onerror=c=>i(c.target.error)})}catch(e){console.warn("[ProdCache] invalidate error:",e)}},async clear(){try{let t=await this.open();return new Promise((e,o)=>{let s=t.transaction(this.STORE,"readwrite").objectStore(this.STORE).clear();s.onsuccess=()=>e(),s.onerror=a=>o(a.target.error)})}catch(t){console.warn("[ProdCache] clear error:",t)}},async listEntries(){try{let t=await this.open();return new Promise((e,o)=>{let s=t.transaction(this.STORE,"readonly").objectStore(this.STORE).getAll();s.onsuccess=a=>e(a.target.result||[]),s.onerror=a=>o(a.target.error)})}catch(t){return console.warn("[ProdCache] listEntries error:",t),[]}}};ce=N});function ve(){G=!1}function w(){try{return JSON.parse(localStorage.getItem(Q))||{p:0,m:0,g:0}}catch{return{p:0,m:0,g:0}}}function y(){try{return JSON.parse(localStorage.getItem(q))||{}}catch{return{}}}function h(){try{return JSON.parse(localStorage.getItem(F))||{}}catch{return{}}}function mt(t){try{localStorage.setItem(Q,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}k()}function E(t){try{localStorage.setItem(q,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}k()}function $(t){try{localStorage.setItem(F,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}k()}function g(){try{return JSON.parse(localStorage.getItem(V))||[]}catch{return[]}}function x(t){try{localStorage.setItem(V,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}k()}function k(){clearTimeout(lt),lt=setTimeout(function(){R({azione:"setPipData",qty:w(),caricato:y(),pronti:h(),movimenti:g()}).catch(function(t){console.warn("[pipistrelli] salvataggio remoto fallito:",t)})},1500)}function It(t){fetch(O+"?azione=getPipData").then(function(e){return e.json()}).then(function(e){var o=parseInt(e.ts||0),i=parseInt(localStorage.getItem("pip_local_ts")||0);if(o>0&&o>i){if(e.qty)try{localStorage.setItem(Q,JSON.stringify(e.qty))}catch{}if(e.caricato)try{localStorage.setItem(q,JSON.stringify(e.caricato))}catch{}if(e.pronti)try{localStorage.setItem(F,JSON.stringify(e.pronti))}catch{}if(e.movimenti&&Array.isArray(e.movimenti)&&e.movimenti.length>0)try{localStorage.setItem(V,JSON.stringify(e.movimenti))}catch{}try{localStorage.setItem("pip_local_ts",o)}catch{}t&&t(!0)}else t&&t(!1)}).catch(function(){t&&t(!1)})}function xt(){let t=g();if(!t.length)return null;let e={};return[...t].reverse().forEach(o=>{if(o.tipo==="carico"){let i=parseInt(o.idx);isNaN(i)||(e[i]=Number(e[i]||0)+(o.qty||0))}else if(o.tipo==="scarico"){let i=parseInt(o.idx);isNaN(i)||(e[i]=Math.max(0,Number(e[i]||0)-(o.qty||0)))}else(o.tipo==="spedizione"||o.tipo==="assemb")&&(o.righe||[]).forEach(i=>{let n=parseInt(i.idx);isNaN(n)||(e[n]=Math.max(0,Number(e[n]||0)-(i.qty||0)))})}),e}function K(){let t=h(),e={};[["TESTA","p","t_p"],["TESTA","m","t_m"],["TESTA","g","t_g"],["CORDONE","p","c_p"],["CORDONE","m","c_m"],["CORDONE","g","c_g"]].forEach(([i,n,s])=>{let a=t[s]||0;a&&(Z[i]?.[n]||[]).forEach(([c,r])=>{e[c]=(e[c]||0)+a*r})});let o=t.a||0;return o&&(e[21]=(e[21]||0)+o),e}function B(){let t=K(),e=y();document.querySelectorAll("#pip-tbody tr").forEach(o=>{let i=parseInt(o.dataset.idx),n=Number(e[i]||0),s=t[i]||0,a=o.querySelector(".pip-car-liberi");a&&(s>0?(a.textContent=Math.max(0,n-s)+" lib.",a.style.display=""):a.style.display="none")})}function Tt(t,e){let o=h();o[t]=Math.max(0,(o[t]||0)+e),$(o),B(),X()}function Ot(t,e){let o=h();o[t]=Math.max(0,parseInt(e)||0),$(o),B();let i=document.querySelector(`.pip-pronti-input[data-key="${t}"]`);i&&(i.value=o[t],i.classList.toggle("pip-pronti-val-on",o[t]>0))}function X(){let t=h(),e=[{titolo:"\u{1F529} Teste",items:[{key:"t_p",label:"Testa",mA:"500mA",emoji:"\u{1F529}"},{key:"t_m",label:"Testa",mA:"600mA",emoji:"\u{1F529}"},{key:"t_g",label:"Testa",mA:"700mA",emoji:"\u{1F529}"}]},{titolo:"\u{1F50C} Cordoni",items:[{key:"c_p",label:"Cordone",mA:"500mA",emoji:"\u{1F50C}"},{key:"c_m",label:"Cordone",mA:"600mA",emoji:"\u{1F50C}"},{key:"c_g",label:"Cordone",mA:"700mA",emoji:"\u{1F50C}"}]},{titolo:"\u{1F50B} Alimentatori",items:[{key:"a",label:"Alimentatore",mA:"",emoji:"\u{1F50B}"}]}],o=document.getElementById("pip-pronti-grid");o&&(o.innerHTML=e.map(i=>{let n=i.items.map(s=>{let a=t[s.key]||0;return`<div class="pip-pronti-row">
        <span class="pip-pronti-lbl">${s.emoji} ${s.label}${s.mA?` <span class="pip-pronti-ma">${s.mA}</span>`:""}</span>
        <div class="pip-pronti-ctrl">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${s.key}',-1)">\u2212</button>
          <input class="pip-pronti-input${a>0?" pip-pronti-val-on":""}" type="number" min="0"
                 data-key="${s.key}" value="${a}"
                 oninput="_pipSetPronti('${s.key}', this.value)"
                 onchange="_pipSetPronti('${s.key}', this.value)">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${s.key}',1)">+</button>
        </div>
      </div>`}).join("");return`<div class="pip-pronti-sezione"><div class="pip-pronti-sezione-titolo">${i.titolo}</div>${n}</div>`}).join(""))}function Ct(t){let e=1;for(let o=t+1;o<v.length&&v[o][0]==="";o++)e++;return e}function wt(){let t=Math.max(0,parseInt(document.getElementById("pip-qty-p")?.value)||0),e=Math.max(0,parseInt(document.getElementById("pip-qty-m")?.value)||0),o=Math.max(0,parseInt(document.getElementById("pip-qty-g")?.value)||0);mt({p:t,m:e,g:o});let i=document.getElementById("pip-tot");i&&(i.textContent=t+e+o);let n=y();document.querySelectorAll("#pip-tbody tr").forEach(s=>{let a=parseInt(s.dataset.idx),c=v[a],r=t*c[2]+e*c[3]+o*c[4],p=Number(n[a]||0),l=Math.max(0,r-p),m=s.querySelector(".pip-fab, .pip-fab-zero"),d=s.querySelector('[class^="pip-ord"]');m&&(m.textContent=r>0?r:"\u2014",m.className=r===0?"pip-fab pip-fab-zero":"pip-fab"),d&&(d.textContent=r===0?"\u2014":l,d.className=r===0?"pip-ord-zero":l>0?"pip-ord-manca":"pip-ord-ok")})}function A(t){let e=parseInt(t.dataset.idx),o=Math.max(0,parseInt(t.value)||0),i=y();i[e]=o,E(i);let n=w(),s=v[e],a=n.p*s[2]+n.m*s[3]+n.g*s[4],c=Math.max(0,a-o),r=t.closest("tr"),p=r?.querySelector('[class^="pip-ord"]');p&&(p.textContent=a===0?"\u2014":c,p.className=a===0?"pip-ord-zero":c>0?"pip-ord-manca":"pip-ord-ok");let m=K()[e]||0,d=r?.querySelector(".pip-car-liberi");d&&(m>0?(d.textContent=Math.max(0,o-m)+" lib.",d.style.display=""):d.style.display="none")}function $t(){let t=document.getElementById("pip-save-btn"),e=document.getElementById("pip-save-label");!t||!e||(t.disabled=!0,t.classList.remove("pip-save-ok","pip-save-err"),t.classList.add("pip-save-loading"),e.textContent="Salvataggio\u2026",R({azione:"setPipData",qty:w(),caricato:y(),pronti:h(),movimenti:g()}).then(function(){try{localStorage.setItem("pip_local_ts",Date.now())}catch{}t.classList.remove("pip-save-loading"),t.classList.add("pip-save-ok"),e.textContent="Salvato \u2713",setTimeout(function(){t.classList.remove("pip-save-ok"),e.textContent="Salva",t.disabled=!1},2500)}).catch(function(){t.classList.remove("pip-save-loading"),t.classList.add("pip-save-err"),e.textContent="Errore \u2717",setTimeout(function(){t.classList.remove("pip-save-err"),e.textContent="Salva",t.disabled=!1},3e3)}))}function Mt(t){let e=document.getElementById("pip-mov-mat"),o=document.getElementById("pip-mov-qty"),i=document.getElementById("pip-mov-nota");if(!e||!o)return;let n=parseInt(e.value),s=Math.max(1,parseInt(o.value)||1),a=(i?.value||"").trim(),c=v[n]?.[1]||"?",r=y();t==="carico"?r[n]=Number(r[n]||0)+s:r[n]=Math.max(0,Number(r[n]||0)-s),E(r);let p=document.querySelector(`#pip-tbody input[data-idx="${n}"]`);p&&(p.value=r[n],A(p));let l=g();l.unshift({id:Date.now(),idx:n,tipo:t,qty:s,nota:a,mat:c,ts:new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}),x(l),o.value=1,i&&(i.value=""),T()}function Rt(t){if(!Y())return;let o=g().find(i=>i.id===t);o&&Lt(t,o)}function Lt(t,e){let o=document.getElementById("modal-pip-del-mov");if(!o)return;let i=document.getElementById("pip-del-mov-desc"),n;if(e.tipo==="reso"){let a=e.totPz||0,c=(e.righe||[]).length,r=(e.scartate||[]).length;n=`<span class="pip-mov-badge reso" style="font-size:0.75rem">RESO</span>
     <strong>Rientro \xD7${a} pz</strong>
     <br><span style="color:#64748b;font-size:0.82rem">${c} comp. recuperati \xB7 ${r} comp. scartati</span>
     ${e.nota?`<br><span style="color:#64748b;font-size:0.82rem">${e.nota}</span>`:""}`}else{let a=e.tipo==="carico"?"CARICO":"SCARICO";n=`<span class="pip-mov-badge ${e.tipo}" style="font-size:0.75rem">${a}</span>
     <strong>${e.mat}</strong> &nbsp;${e.tipo==="carico"?"+":"\u2212"}${e.qty} pz
     ${e.nota?`<br><span style="color:#64748b;font-size:0.82rem">${e.nota}</span>`:""}`}i&&(i.innerHTML=n);let s=document.getElementById("btn-pip-del-ok");s&&(s.onclick=()=>ut(t)),o.style.display="flex",o.offsetHeight,o.classList.add("active")}function dt(){let t=document.getElementById("modal-pip-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ut(t){dt();let e=g(),o=e.find(n=>n.id===t);if(!o)return;let i=y();if(o.tipo==="assemb"||o.tipo==="spedizione")(o.righe||[]).forEach(n=>{i[n.idx]=Number(i[n.idx]||0)+n.qty}),E(i),(o.righe||[]).forEach(n=>{let s=document.querySelector(`#pip-tbody input[data-idx="${n.idx}"]`);s&&(s.value=i[n.idx],A(s))});else if(o.tipo==="reso")(o.righe||[]).forEach(n=>{i[n.idx]=Math.max(0,Number(i[n.idx]||0)-n.qty)}),E(i),(o.righe||[]).forEach(n=>{let s=document.querySelector(`#pip-tbody input[data-idx="${n.idx}"]`);s&&(s.value=i[n.idx],A(s))});else{o.tipo==="carico"?i[o.idx]=Math.max(0,Number(i[o.idx]||0)-o.qty):i[o.idx]=Number(i[o.idx]||0)+o.qty,E(i);let n=document.querySelector(`#pip-tbody input[data-idx="${o.idx}"]`);n&&(n.value=i[o.idx],A(n))}x(e.filter(n=>n.id!==t)),T(),_("Movimento eliminato \u2713")}function T(){let t=document.getElementById("pip-mov-list");if(!t)return;let e=g(),o=Y();if(e.length===0){t.innerHTML='<div class="pip-mov-empty">Nessun movimento registrato</div>';return}t.innerHTML=e.map(i=>{let n=o?`<button class="pip-mov-del" onclick="_pipEliminaMovimento(${i.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=o&&(i.tipo==="carico"||i.tipo==="scarico")?`<button class="pip-mov-edit" onclick="_pipModificaMovimento(${i.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(i.tipo==="spedizione"){let a=(i.items||[]).reduce((m,d)=>m+d.qty,0),c={};(i.items||[]).forEach(m=>{c[m.mA]=(c[m.mA]||0)+m.qty});let r=Object.entries(c).map(([m,d])=>`<span class="pip-sped-ma-pill">${m} \xD7${d}</span>`).join(""),p=(i.items||[]).map(m=>`<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${m.emoji} ${m.tipoLabel} ${m.fmtLabel} <span class="pip-pronti-ma">${m.mA}</span></span>
          <span class="pip-mov-qty scarico">\xD7${m.qty}</span>
        </div>`).join(""),l=(i.righe||[]).map(m=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8">${m.mat}</span>
          <span class="pip-mov-qty scarico">\u2212${m.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge spedizione">SPED.</span>
            <span class="pip-mov-assemb-label">\u{1F69A} Spediz. \xD7${a} pz ${r}</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${n}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${p}</div>
            <div class="pip-sped-bom-divider">componenti scaricati</div>
            ${l}
          </div>
        </details>`}if(i.tipo==="assemb"){let a=i.assembTipo==="Testa"?"\u{1F529}":"\u{1F50C}",c=i.assembFmt==="Piccolo"?"500mA":i.assembFmt==="Medio"?"600mA":"700mA",r=(i.righe||[]).map(p=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat">${p.mat}</span>
          <span class="pip-mov-qty scarico">\u2212${p.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge assemb">${c}</span>
            <span class="pip-mov-assemb-label">${a} ${i.assembTipo} ${i.assembFmt} \xD7${i.assembQty}</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${n}
          </summary>
          <div class="pip-assemb-sub-list">${r}</div>
        </details>`}if(i.tipo==="reso"){let a=i.totPz||0,c=(i.items||[]).map(l=>`<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${l.emoji} ${l.label}${l.mA?` <span class="pip-pronti-ma">${l.mA}</span>`:""}</span>
          <span class="pip-mov-qty carico">\xD7${l.qty}</span>
        </div>`).join(""),r=(i.righe||[]).map(l=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#15803d">\u2713 ${l.mat}</span>
          <span class="pip-mov-qty carico">+${l.qty}</span>
        </div>`).join(""),p=(i.scartate||[]).map(l=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${l.mat}</span>
          <span class="pip-mov-qty" style="color:#94a3b8">\u2715 ${l.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group pip-mov-reso-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge reso">RESO</span>
            <span class="pip-mov-assemb-label">\u{1F4E6} Rientro \xD7${a} pz</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${n}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${c}</div>
            ${r?`<div class="pip-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${r}`:""}
            ${p?`<div class="pip-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${p}`:""}
          </div>
        </details>`}return`
      <div class="pip-mov-item ${i.tipo}">
        <span class="pip-mov-badge ${i.tipo}">${i.tipo==="carico"?"CARICO":"SCARICO"}</span>
        <span class="pip-mov-mat">${i.mat}</span>
        <span class="pip-mov-qty ${i.tipo}">${i.tipo==="carico"?"+":"\u2212"}${i.qty}</span>
        ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:'<span class="pip-mov-nota"></span>'}
        <span class="pip-mov-ts">${i.ts}</span>
        ${s}${n}
      </div>`}).join("")}function Y(){if(!u||!u.nome)return!1;let t=String(u.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||u.ruolo==="MASTER"}function Pt(t){if(!Y())return;let o=g().find(c=>c.id===t);if(!o)return;let i=document.getElementById("modal-pip-edit-mov");if(!i)return;let n=document.getElementById("pip-edit-mov-mat"),s=document.getElementById("pip-edit-mov-qty"),a=document.getElementById("pip-edit-mov-nota");n&&(n.innerHTML=`<span class="pip-mov-badge ${o.tipo}" style="font-size:0.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${o.mat}</strong>`),s&&(s.value=o.qty),a&&(a.value=o.nota||""),i.dataset.movId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>a&&a.focus(),80)}function ft(){let t=document.getElementById("modal-pip-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Nt(){let t=document.getElementById("modal-pip-edit-mov");if(!t)return;let e=Number(t.dataset.movId);ft();let o=g(),i=o.findIndex(p=>p.id===e);if(i===-1)return;let n=o[i],s=parseInt(document.getElementById("pip-edit-mov-qty")?.value),a=(document.getElementById("pip-edit-mov-nota")?.value||"").trim();if(isNaN(s)||s<=0){_("Quantit\xE0 non valida \u26A0\uFE0F");return}let c=s!==n.qty,r=a!==(n.nota||"").trim();if(!(!c&&!r)){if(c){let p=s-n.qty,l=y();n.tipo==="carico"?l[n.idx]=Math.max(0,Number(l[n.idx]||0)+p):l[n.idx]=Math.max(0,Number(l[n.idx]||0)-p),E(l);let m=document.querySelector(`#pip-tbody input[data-idx="${n.idx}"]`);m&&(m.value=l[n.idx],A(m))}o[i]={...n,qty:s,nota:a},x(o),T(),_("Movimento aggiornato \u2713")}}function qt(){let t=h(),e=J.filter(n=>(t[n.key]||0)>0).map(n=>({...n,qty:t[n.key]}));if(!e.length){_("Nessun articolo da spedire \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("pip-sped-items");o&&(o.innerHTML=e.map(n=>`
      <label class="pip-sped-item-row">
        <input type="checkbox" class="pip-sped-chk" data-key="${n.key}" checked>
        <span class="pip-sped-item-info">
          <span class="pip-sped-item-emoji">${n.emoji}</span>
          <span class="pip-sped-item-label">${n.tipoLabel}${n.mA?` <span class="pip-pronti-ma">${n.mA}</span>`:""}</span>
          <span class="pip-sped-item-qty">\xD7${n.qty}</span>
        </span>
      </label>`).join(""),o.querySelectorAll(".pip-sped-chk").forEach(n=>n.addEventListener("change",H))),H();let i=document.getElementById("modal-pip-spedizione");i&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function H(){let t=[...document.querySelectorAll(".pip-sped-chk:checked")].map(r=>r.dataset.key),e=t.some(r=>r.startsWith("t_")),o=t.some(r=>r.startsWith("c_")),i=t.includes("a"),n=document.getElementById("pip-sped-warning"),s=document.getElementById("pip-sped-warning-msg"),a=document.getElementById("btn-pip-sped-ok");if(!t.length){n&&(n.style.display="flex"),s&&(s.textContent="Nessun articolo selezionato."),a&&(a.disabled=!0);return}a&&(a.disabled=!1);let c=[];e||c.push("Teste"),o||c.push("Cordoni"),i||c.push("Alimentatori"),c.length>0&&c.length<3?(n&&(n.style.display="flex"),s&&(s.textContent=`Attenzione: stai spedendo senza ${c.join(" e ")} \u2014 normalmente Testa, Cordone e Alimentatore vanno spediti insieme. Confermi comunque?`)):n&&(n.style.display="none")}function kt(){let t=[...document.querySelectorAll(".pip-sped-chk:checked")].map(d=>d.dataset.key);if(!t.length)return;let e=h(),o=J.filter(d=>t.includes(d.key)&&(e[d.key]||0)>0).map(d=>({...d,qty:e[d.key]}));if(!o.length)return;let i=(document.getElementById("pip-spedizione-nota")?.value||"").trim(),n=y(),s={};o.forEach(d=>{let f=Z[d.tipo]?.[d.fmt];f&&f.forEach(([b,M])=>{let S=d.qty*M;n[b]=Math.max(0,Number(n[b]||0)-S),s[b]?s[b].qty+=S:s[b]={idx:b,mat:v[b]?.[1]||"?",qty:S}})});let a=Object.values(s);E(n);let c=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}),r=g();r.unshift({id:Date.now(),tipo:"spedizione",items:o,righe:a,nota:i,ts:c}),x(r);let p={...h()};if(t.forEach(d=>{delete p[d]}),$(p),!J.filter(d=>(p[d.key]||0)>0).length){let d=document.getElementById("pip-spedizione-nota");d&&(d.value="")}a.forEach(d=>{let f=document.querySelector(`#pip-tbody input[data-idx="${d.idx}"]`);f&&(f.value=n[d.idx],A(f))}),yt(),X(),B(),T();let m=o.reduce((d,f)=>d+f.qty,0);_(`Spedizione registrata: ${m} pz scaricati \u2713`)}function yt(){let t=document.getElementById("modal-pip-spedizione");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Bt(){let t=document.getElementById("modal-pip-reso");if(!t)return;W.forEach(o=>{let i=document.getElementById("pip-reso-qty-"+o.key);i&&(i.value=0)});let e=document.getElementById("pip-reso-nota");e&&(e.value=""),tt(),t.style.display="flex",t.offsetHeight,t.classList.add("active")}function gt(){let t=document.getElementById("modal-pip-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Dt(t,e){let o=document.getElementById("pip-reso-qty-"+t);o&&(o.value=Math.max(0,(parseInt(o.value)||0)+e),tt())}function tt(){let t={};W.forEach(i=>{let n=parseInt(document.getElementById("pip-reso-qty-"+i.key)?.value)||0;if(!n)return;(Z[i.tipo]?.[i.fmt]||[]).forEach(([a,c])=>{t[a]=(t[a]||0)+n*c}),i.key==="a"&&(t[21]=(t[21]||0)+n)});let e=document.getElementById("pip-reso-bom-list");if(!e)return;let o=Object.entries(t).filter(([,i])=>i>0);if(!o.length){e.innerHTML='<div class="pip-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}e.innerHTML=o.map(([i,n])=>{let s=v[parseInt(i)]?.[1]||"?";return`<label class="pip-reso-bom-row">
      <input type="checkbox" class="pip-reso-bom-chk" data-idx="${i}" data-qty="${n}" checked>
      <span class="pip-reso-bom-mat">${s}</span>
      <span class="pip-reso-bom-qty">+${n}</span>
    </label>`}).join("")}function zt(){let t=[];if(W.forEach(r=>{let p=parseInt(document.getElementById("pip-reso-qty-"+r.key)?.value)||0;p>0&&t.push({...r,qty:p})}),!t.length){_("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let e=[],o=[];document.querySelectorAll(".pip-reso-bom-chk").forEach(r=>{let p=parseInt(r.dataset.idx),l=parseInt(r.dataset.qty),m=v[p]?.[1]||"?";r.checked?e.push({idx:p,mat:m,qty:l}):o.push({idx:p,mat:m,qty:l})});let i=(document.getElementById("pip-reso-nota")?.value||"").trim(),n=y();e.forEach(r=>{n[r.idx]=Number(n[r.idx]||0)+r.qty}),E(n),e.forEach(r=>{let p=document.querySelector(`#pip-tbody input[data-idx="${r.idx}"]`);p&&(p.value=n[r.idx],A(p))});let s=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}),a=g(),c=t.reduce((r,p)=>r+p.qty,0);a.unshift({id:Date.now(),tipo:"reso",items:t,righe:e,scartate:o,nota:i,ts:s,totPz:c}),x(a),gt(),T(),B(),_(`Reso registrato: ${c} pz \u2014 ${e.length} componenti recuperati \u2713`)}function jt(t){let e=document.getElementById("pip-mov-body");if(!e)return;let o=e.style.display==="none";e.style.display=o?"":"none";let i=t.querySelector("i");i&&(i.className=o?"fas fa-chevron-down":"fas fa-chevron-up")}function Ut(){confirm("Vuoi azzerare tutto (quantit\xE0, magazzino e movimenti)?")&&(mt({p:0,m:0,g:0}),E({}),x([]),$({}),et())}function et(){G||(G=!0,It(function(p){p&&et()}));let t=y(),e=g();if((Object.keys(t).length===0||Object.values(t).every(p=>Number(p)===0))&&e.some(p=>p.tipo==="carico"||p.tipo==="scarico")){let p=xt();if(p&&Object.values(p).some(l=>l>0))try{localStorage.setItem(q,JSON.stringify(p))}catch{}}let i=document.getElementById("contenitore-dati"),n=w(),s=y(),a=K(),c=v.map((p,l)=>{let[m,d,f,b,M]=p,S=n.p*f+n.m*b+n.g*M,D=Number(s[l]||0),ot=a[l]||0,vt=Math.max(0,D-ot),it=Math.max(0,S-D),ht=S===0?"pip-ord-zero":it>0?"pip-ord-manca":"pip-ord-ok",bt=m?`<td class="pip-sez-cell" rowspan="${Ct(l)}">${m}</td>`:"",St=[f,b,M].map(nt=>nt>0?`<td class="pip-coeff pip-coeff-on">${nt}</td>`:'<td class="pip-coeff pip-coeff-off">\u2014</td>').join("");return`<tr data-idx="${l}" class="${m?"pip-row-sez-start":""}">
      ${bt}
      <td class="pip-mat">${d}</td>
      ${St}
      <td class="pip-fab${S===0?" pip-fab-zero":""}">${S>0?S:"\u2014"}</td>
      <td class="pip-car-cell">
        <input class="pip-car-input" type="number" min="0" value="${D}"
               data-idx="${l}" oninput="_pipAggiornaCar(this)" onchange="_pipAggiornaCar(this)">
        <span class="pip-car-liberi"${ot>0?"":' style="display:none"'}>${vt} lib.</span>
      </td>
      <td class="${ht}">${S===0?"\u2014":it}</td>
    </tr>`}).join(""),r=v.map((p,l)=>`<option value="${l}">[${p[0]||v.slice(0,l).reverse().find(m=>m[0])?.[0]||"?"}] ${p[1]}</option>`).join("");i.innerHTML=`
    <div class="pip-page">
      <!-- TITOLO -->
      <div class="pip-header">
        <div class="pip-header-title">
          <span class="pip-header-icon">\u{1F987}</span>
          <div>
            <div class="pip-header-brand">MARTINELLI LUCE</div>
            <div class="pip-header-product">Pipistrello \u2014 Pianificazione Mensile</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
          <button class="pip-reset-btn" onclick="_pipReset()" title="Reset tutto">
            <i class="fas fa-rotate-left"></i> Reset
          </button>
          <button class="pip-save-btn" id="pip-save-btn" onclick="_pipSalvaManuale()" title="Salva dati sul server">
            <i class="fas fa-cloud-arrow-up"></i> <span id="pip-save-label">Salva</span>
          </button>
        </div>
      </div>

      <!-- CARD QT\xC0 -->
      <div class="pip-qty-card">
        <div class="pip-qty-label">QT\xC0 DA PRODURRE QUESTO MESE</div>
        <div class="pip-qty-inputs">
          <div class="pip-qty-item">
            <label>\u{1F535} Piccolo<br><small>500mA</small></label>
            <input class="pip-qty-input" id="pip-qty-p" type="number" min="0" value="${n.p}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>\u{1F7E3} Medio<br><small>600mA</small></label>
            <input class="pip-qty-input" id="pip-qty-m" type="number" min="0" value="${n.m}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>\u{1F534} Grande<br><small>700mA</small></label>
            <input class="pip-qty-input" id="pip-qty-g" type="number" min="0" value="${n.g}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-total-box">
            <div class="pip-qty-total-label">TOTALE</div>
            <div class="pip-qty-total-val" id="pip-tot">${n.p+n.m+n.g}</div>
          </div>
        </div>
      </div>

      <!-- TABELLA BOM -->
      <div class="pip-table-wrap">
        <table class="pip-table">
          <thead>
            <tr>
              <th>SEZIONE</th>
              <th>MATERIALE</th>
              <th class="pip-col-coeff" title="Piccolo 500mA">\xD7 P</th>
              <th class="pip-col-coeff" title="Medio 600mA">\xD7 M</th>
              <th class="pip-col-coeff" title="Grande 700mA">\xD7 G</th>
              <th>FABBISOGNO</th>
              <th>CARICATO</th>
              <th>DA ORDINARE</th>
            </tr>
          </thead>
          <tbody id="pip-tbody">
            ${c}
          </tbody>
        </table>
      </div>

      <!-- LEGENDA -->
      <div class="pip-legend">
        <span class="pip-leg-item pip-ord-manca" style="padding:2px 7px;border-radius:5px;">\u25CF mancante</span>
        <span class="pip-leg-item pip-ord-ok" style="padding:2px 7px;border-radius:5px;">\u25CF disponibile</span>
        <span class="pip-leg-item" style="color:#9ca3af">\u2014 = non necessario</span>
      </div>

      <!-- PRONTI DA SPEDIRE + SCARICO -->
      <div class="pip-assemb-card pip-pronti-card-wrap">
        <div class="pip-assemb-title"><i class="fas fa-truck"></i> PRONTI DA SPEDIRE <span class="pip-pronti-hint">\u2014 imposta le quantit\xE0 e premi Registra Spedizione per scaricare i componenti</span></div>
        <div class="pip-pronti-grid" id="pip-pronti-grid"></div>
        <div class="pip-pronti-footer">
          <input type="text" id="pip-spedizione-nota" class="pip-pronti-nota-input" placeholder="Note spedizione (es. Ordine 1234, Cliente Rossi\u2026)" maxlength="80">
          <button class="pip-assemb-btn pip-spedisci-btn" onclick="_pipScaricoTuttiPronti()">
            <i class="fas fa-truck"></i> Registra Spedizione
          </button>
        </div>
      </div>

      <!-- MOVIMENTI MAGAZZINO -->
      <div class="pip-mov-section">
        <div class="pip-mov-header">
          <div class="pip-mov-header-title">
            <i class="fas fa-boxes-stacked"></i> MOVIMENTI MAGAZZINO
          </div>
          <div class="pip-mov-header-actions">
            <button class="pip-reso-open-btn" onclick="_pipApriModalReso()">
              <i class="fas fa-rotate-left"></i> Reso
            </button>
            <button class="pip-mov-toggle-btn" onclick="_pipToggleMov(this)">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
        <div class="pip-mov-body" id="pip-mov-body">
          <!-- FORM -->
          <div class="pip-mov-form">
            <div class="pip-mov-form-field" style="grid-column:1/3">
              <label class="pip-mov-form-label">Materiale</label>
              <select id="pip-mov-mat">${r}</select>
            </div>
            <div class="pip-mov-form-field">
              <label class="pip-mov-form-label">Quantit\xE0</label>
              <input type="number" id="pip-mov-qty" min="1" value="1" placeholder="0">
            </div>
            <div class="pip-mov-form-field">
              <label class="pip-mov-form-label">Note (opz.)</label>
              <input type="text" id="pip-mov-nota" placeholder="es. DDT 123\u2026" maxlength="60">
            </div>
            <button class="pip-mov-btn-carico" onclick="_pipSalvaMovimento('carico')">
              <i class="fas fa-arrow-down"></i> Carico
            </button>
            <button class="pip-mov-btn-scarico" onclick="_pipSalvaMovimento('scarico')">
              <i class="fas fa-arrow-up"></i> Scarico
            </button>
          </div>
          <!-- LISTA -->
          <div id="pip-mov-list"></div>
        </div>
      </div>
    </div>`,T(),X(),rt(i)}function he(){window._pipAggiornaPronti=Tt,window._pipSetPronti=Ot,window._pipAggiornaQty=wt,window._pipAggiornaCar=A,window._pipScaricoTuttiPronti=qt,window._pipAggiornaSpeWarning=H,window._pipChiudiModalSped=yt,window._pipConfermaSpedizione=kt,window._pipSalvaMovimento=Mt,window._pipEliminaMovimento=Rt,window._pipModificaMovimento=Pt,window._pipChiudiModalEdit=ft,window._pipConfermaModificaMov=Nt,window._pipChiudiModalDel=dt,window._pipConfermaEliminaMov=ut,window._pipApriModalReso=Bt,window._pipChiudiModalReso=gt,window._pipResoQtyChange=Dt,window._pipResoAggiornaBOM=tt,window._pipConfermaReso=zt,window._pipToggleMov=jt,window._pipSalvaManuale=$t,window._pipReset=Ut}var G,Q,q,V,F,v,Z,J,W,lt,be,Gt=I(()=>{C();j();at();ct();U();G=!1;Q="mlPipQty",q="mlPipCaricato",V="mlPipMovimenti",F="mlPipPronti",v=[["TESTA","Testa piccola",1,0,0],["","Testa media",0,1,0],["","Testa grande",0,0,1],["","Catenaria piccola",1,0,0],["","Catenaria media",0,1,0],["","Catenaria grande",0,0,1],["","Tappino nero",2,2,2],["","Wago",0,2,2],["","Viti 2x6",8,0,0],["","Viti 2,5x6",0,8,4],["CORDONE","Case superiore",1,1,1],["","Case inf. 500mA",1,0,0],["","Case inf. 600mA",0,1,0],["","Case inf. 700mA",0,0,1],["","Pulsante",1,1,1],["","Viti nere",2,2,2],["","Plug 1,5m",1,0,0],["","Plug 2m",0,1,1],["","Cavo out 500mA",1,0,0],["","Cavo out 600mA",0,1,0],["","Cavo out 700mA",0,0,1],["","Alimentatore",1,1,1],["","Interruttore 500mA",1,0,0],["","Interruttore 600mA",0,1,0],["","Interruttore 700mA",0,0,1]],Z={TESTA:{p:[[0,1],[3,1],[6,2],[8,8]],m:[[1,1],[4,1],[6,2],[7,2],[9,8]],g:[[2,1],[5,1],[6,2],[7,2],[9,4]]},CORDONE:{p:[[10,1],[11,1],[14,1],[15,2],[16,1],[18,1],[22,1]],m:[[10,1],[12,1],[14,1],[15,2],[17,1],[19,1],[23,1]],g:[[10,1],[13,1],[14,1],[15,2],[17,1],[20,1],[24,1]]},ALIMENTATORE:{_:[[21,1]]}},J=[{key:"t_p",tipo:"TESTA",fmt:"p",tipoLabel:"Testa",fmtLabel:"Piccolo",emoji:"\u{1F529}",mA:"500mA"},{key:"t_m",tipo:"TESTA",fmt:"m",tipoLabel:"Testa",fmtLabel:"Medio",emoji:"\u{1F529}",mA:"600mA"},{key:"t_g",tipo:"TESTA",fmt:"g",tipoLabel:"Testa",fmtLabel:"Grande",emoji:"\u{1F529}",mA:"700mA"},{key:"c_p",tipo:"CORDONE",fmt:"p",tipoLabel:"Cordone",fmtLabel:"Piccolo",emoji:"\u{1F50C}",mA:"500mA"},{key:"c_m",tipo:"CORDONE",fmt:"m",tipoLabel:"Cordone",fmtLabel:"Medio",emoji:"\u{1F50C}",mA:"600mA"},{key:"c_g",tipo:"CORDONE",fmt:"g",tipoLabel:"Cordone",fmtLabel:"Grande",emoji:"\u{1F50C}",mA:"700mA"},{key:"a",tipo:"ALIMENTATORE",fmt:"_",tipoLabel:"Alimentatore",fmtLabel:"",emoji:"\u{1F50B}",mA:""}],W=[{key:"t_p",tipo:"TESTA",fmt:"p",label:"Testa Piccola",emoji:"\u{1F529}",mA:"500mA"},{key:"t_m",tipo:"TESTA",fmt:"m",label:"Testa Media",emoji:"\u{1F529}",mA:"600mA"},{key:"t_g",tipo:"TESTA",fmt:"g",label:"Testa Grande",emoji:"\u{1F529}",mA:"700mA"},{key:"c_p",tipo:"CORDONE",fmt:"p",label:"Cordone Piccolo",emoji:"\u{1F50C}",mA:"500mA"},{key:"c_m",tipo:"CORDONE",fmt:"m",label:"Cordone Medio",emoji:"\u{1F50C}",mA:"600mA"},{key:"c_g",tipo:"CORDONE",fmt:"g",label:"Cordone Grande",emoji:"\u{1F50C}",mA:"700mA"},{key:"a",tipo:"ALIMENTATORE",fmt:"_",label:"Alimentatore",emoji:"\u{1F50B}",mA:""}];lt=null;window.pipRecovery={stato:function(){let t=h(),e=y(),o=localStorage.getItem("pip_local_ts");console.group("%c[pipRecovery] Stato localStorage pipistrelli","color:#1a237e;font-weight:bold"),console.log("\u{1F4C5} pip_local_ts:",o,o?"("+new Date(parseInt(o)).toLocaleString("it-IT")+")":"(mai salvato)"),console.log("\u{1F504} PRONTI:",JSON.stringify(t)),console.log("   \u2014 TESTA  P/M/G:",t.t_p||0,t.t_m||0,t.t_g||0),console.log("   \u2014 CORDONE P/M/G:",t.c_p||0,t.c_m||0,t.c_g||0);let i=Object.values(t).some(n=>n>0);return console.log(i?"\u2705 Pronti presenti \u2192 puoi usare pipRecovery.forzaRipristino()":"\u26A0\uFE0F Pronti tutti 0 \u2192 usa pipRecovery.reimpostaPronti({t_p:X,t_m:X,...})"),console.log("\u{1F4E6} CARICATO keys:",Object.keys(e).length,"\u2014 valori:",JSON.stringify(e)),console.groupEnd(),{pronti:t,caricato:e}},forzaRipristino:function(){let t={azione:"setPipData",qty:w(),caricato:y(),pronti:h(),movimenti:g()};localStorage.setItem("pip_local_ts",Date.now()),R(t).then(e=>console.log("%c[pipRecovery] \u2705 Ripristino inviato al server:","color:green",e)).catch(e=>console.error("[pipRecovery] \u274C Errore:",e)),console.log("[pipRecovery] Invio in corso...")},reimpostaPronti:function(t){let e=["t_p","t_m","t_g","c_p","c_m","c_g"],o={};e.forEach(i=>{o[i]=parseInt(t[i])||0}),console.log("[pipRecovery] Imposto pronti:",JSON.stringify(o)),$(o),console.log("%c[pipRecovery] \u2705 Pronti impostati e push al server avviato","color:green")}};be=et});export{I as a,Jt as b,O as c,Qt as d,C as e,_ as f,rt as g,oe as h,ie as i,ne as j,U as k,pe as l,ce as m,ct as n,u as o,Zt as p,st as q,Wt as r,j as s,te as t,at as u,ve as v,et as w,he as x,be as y,Gt as z};
//# sourceMappingURL=chunk-chunk-Q5SMQK7H.js.map
