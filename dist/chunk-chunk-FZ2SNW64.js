import{a as O,d as _,e as ot,i as it}from"./chunk-chunk-LUOL5Q4K.js";var x,jt,w=O(()=>{x="https://script.google.com/macros/s/AKfycbyVMV9MkGiqphN0AKXJdHXF0Arp1vxTYrCYi1SGv_4MKLRJkx--5HoGq7mmQX-p0ZTZ/exec",jt=[{codice:"PROD:IMBALLAGGI",icona:"\u{1F4E6}",nome:"Tavolo Imballaggi",domanda:"Cosa stai imballando?",statoDefault:"IMBALLATO"},{codice:"PROD:LAVORAZIONE",icona:"\u{1F527}",nome:"Postazione Lavorazione",domanda:"Cosa stai lavorando?",statoDefault:"IN LAVORAZIONE"},{codice:"PROD:ASSEMBLAGGIO",icona:"\u{1F6E0}\uFE0F",nome:"Postazione Assemblaggio",domanda:"Cosa stai assemblando?",statoDefault:"IN LAVORAZIONE"},{codice:"PROD:CONTROLLO",icona:"\u{1F50D}",nome:"Controllo Qualit\xE0",domanda:"Cosa stai controllando?",statoDefault:"IN PRODUZIONE"},{codice:"PROD:MAGAZZINO",icona:"\u{1F3ED}",nome:"Magazzino / Preparazione",domanda:"Cosa stai preparando?",statoDefault:"PREPARARE PER LAVORAZIONE"},{codice:"PROD:SPEDIZIONI",icona:"\u{1F69A}",nome:"Spedizioni",domanda:"Cosa stai spedendo?",statoDefault:"IMBALLATO"}]});function Jt(t){u=t}function st(){try{let t=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");if(t){let e=JSON.parse(t);if(e&&e.expiresAt&&Date.now()>e.expiresAt){D(),u=null;let i=document.getElementById("login-overlay");return i&&(i.style.display="flex",i.style.opacity="1"),""}if(e&&e.sessionToken){let i=String(e.sessionToken);return u&&u.sessionToken!==i&&(u.sessionToken=i),i}}}catch{}try{if(u&&u.sessionToken)return String(u.sessionToken)}catch{}try{let t=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");if(!t)return"";let e=JSON.parse(t);return e&&e.sessionToken?String(e.sessionToken):""}catch{return""}}function D(){try{localStorage.removeItem("sessioneUtente")}catch{}try{sessionStorage.removeItem("sessioneUtente")}catch{}}function Ht(){try{let t=localStorage.getItem("sessioneUtente")||sessionStorage.getItem("sessioneUtente");if(!t)return;let e=JSON.parse(t);if(!e||!e.sessionToken)return;e.expiresAt=Date.now()+288e5,u&&(u.expiresAt=e.expiresAt);try{localStorage.setItem("sessioneUtente",JSON.stringify(e))}catch{}try{sessionStorage.setItem("sessioneUtente",JSON.stringify(e))}catch{}}catch{}}var u,z=O(()=>{w();u=null});async function P(t){let e=st(),i=e?{...t,_token:e}:{...t},o=await fetch(x,{method:"POST",body:JSON.stringify(i)});if(!o.ok)throw new Error(`HTTP ${o.status}`);let s=await o.json();if(s&&s.status==="auth_error"){D();let n=new Error("auth_error");throw n.authError=!0,n}return s}async function Zt(){let t=new AbortController,e=setTimeout(()=>t.abort(),5e3);try{let i=await fetch(x+"?azione=getRevision",{signal:t.signal});return clearTimeout(e),await i.json()}catch(i){throw clearTimeout(e),i}}var nt=O(()=>{w();z()});async function Xt(t,e,i,o){function s(r){if(!r)return"";let a=new Date(r);return a.getHours().toString().padStart(2,"0")+":"+a.getMinutes().toString().padStart(2,"0")}let n=null,p=null;if(o)try{n=await $.get(t)}catch{}else{try{n=await $.get(t)}catch{}if(n){p=n.dati;try{i(n.dati)}catch(r){console.warn("[ProdCache] renderFn (cache):",r)}}}try{let r=await e();try{await $.set(t,r)}catch{}let a=JSON.stringify(r),c=JSON.stringify(p);if(a!==c)try{i(r)}catch(l){console.warn("[ProdCache] renderFn (fetch):",l)}}catch(r){if(r&&r.name==="AbortError")return;if(n){let a=s(n.timestamp);try{_("Dati offline \u2014 ultimo aggiornamento "+a,"warning")}catch{}}else throw r}}var $,Yt,at=O(()=>{w();it();$={DB_NAME:"prod-cache",DB_VERSION:1,STORE:"pagine",TTL:3e5,_db:null,open(){return this._db?Promise.resolve(this._db):new Promise((t,e)=>{let i=indexedDB.open(this.DB_NAME,this.DB_VERSION);i.onupgradeneeded=o=>{let s=o.target.result;s.objectStoreNames.contains(this.STORE)||s.createObjectStore(this.STORE,{keyPath:"chiave"})},i.onsuccess=o=>{this._db=o.target.result,t(this._db)},i.onerror=o=>e(o.target.error)})},async set(t,e){try{let i=await this.open();return new Promise((o,s)=>{let r=i.transaction(this.STORE,"readwrite").objectStore(this.STORE).put({chiave:t,dati:e,timestamp:Date.now()});r.onsuccess=()=>o(),r.onerror=a=>s(a.target.error)})}catch(i){console.warn("[ProdCache] set error:",i)}},async get(t){try{let e=await this.open();return new Promise((i,o)=>{let p=e.transaction(this.STORE,"readonly").objectStore(this.STORE).get(t);p.onsuccess=r=>{let a=r.target.result;if(!a){i(null);return}i({dati:a.dati,timestamp:a.timestamp,isStale:Date.now()-a.timestamp>$.TTL})},p.onerror=r=>o(r.target.error)})}catch(e){return console.warn("[ProdCache] get error:",e),null}},async invalidate(t){try{let e=await this.open();return new Promise((i,o)=>{let p=e.transaction(this.STORE,"readwrite").objectStore(this.STORE).delete(t);p.onsuccess=()=>i(),p.onerror=r=>o(r.target.error)})}catch(e){console.warn("[ProdCache] invalidate error:",e)}},async clear(){try{let t=await this.open();return new Promise((e,i)=>{let n=t.transaction(this.STORE,"readwrite").objectStore(this.STORE).clear();n.onsuccess=()=>e(),n.onerror=p=>i(p.target.error)})}catch(t){console.warn("[ProdCache] clear error:",t)}},async listEntries(){try{let t=await this.open();return new Promise((e,i)=>{let n=t.transaction(this.STORE,"readonly").objectStore(this.STORE).getAll();n.onsuccess=p=>e(p.target.result||[]),n.onerror=p=>i(p.target.error)})}catch(t){return console.warn("[ProdCache] listEntries error:",t),[]}}};Yt=$});function pe(){j=!1}function C(){try{return JSON.parse(localStorage.getItem(J))||{p:0,m:0,g:0}}catch{return{p:0,m:0,g:0}}}function f(){try{return JSON.parse(localStorage.getItem(N))||{}}catch{return{}}}function h(){try{return JSON.parse(localStorage.getItem(U))||{}}catch{return{}}}function rt(t){try{localStorage.setItem(J,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}q()}function A(t){try{localStorage.setItem(N,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}q()}function R(t){try{localStorage.setItem(U,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}q()}function y(){try{return JSON.parse(localStorage.getItem(H))||[]}catch{return[]}}function I(t){try{localStorage.setItem(H,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}q()}function q(){clearTimeout(pt),pt=setTimeout(function(){P({azione:"setPipData",qty:C(),caricato:f(),pronti:h(),movimenti:y()}).catch(function(t){console.warn("[pipistrelli] salvataggio remoto fallito:",t)})},1500)}function St(t){fetch(x+"?azione=getPipData").then(function(e){return e.json()}).then(function(e){var i=parseInt(e.ts||0),o=parseInt(localStorage.getItem("pip_local_ts")||0);if(i>0&&i>o){if(e.qty)try{localStorage.setItem(J,JSON.stringify(e.qty))}catch{}if(e.caricato)try{localStorage.setItem(N,JSON.stringify(e.caricato))}catch{}if(e.pronti)try{localStorage.setItem(U,JSON.stringify(e.pronti))}catch{}if(e.movimenti&&Array.isArray(e.movimenti)&&e.movimenti.length>0)try{localStorage.setItem(H,JSON.stringify(e.movimenti))}catch{}try{localStorage.setItem("pip_local_ts",i)}catch{}t&&t(!0)}else t&&t(!1)}).catch(function(){t&&t(!1)})}function _t(){let t=y();if(!t.length)return null;let e={};return[...t].reverse().forEach(i=>{if(i.tipo==="carico"){let o=parseInt(i.idx);isNaN(o)||(e[o]=Number(e[o]||0)+(i.qty||0))}else if(i.tipo==="scarico"){let o=parseInt(i.idx);isNaN(o)||(e[o]=Math.max(0,Number(e[o]||0)-(i.qty||0)))}else(i.tipo==="spedizione"||i.tipo==="assemb")&&(i.righe||[]).forEach(o=>{let s=parseInt(o.idx);isNaN(s)||(e[s]=Math.max(0,Number(e[s]||0)-(o.qty||0)))})}),e}function Z(){let t=h(),e={};[["TESTA","p","t_p"],["TESTA","m","t_m"],["TESTA","g","t_g"],["CORDONE","p","c_p"],["CORDONE","m","c_m"],["CORDONE","g","c_g"]].forEach(([o,s,n])=>{let p=t[n]||0;p&&(Q[o]?.[s]||[]).forEach(([r,a])=>{e[r]=(e[r]||0)+p*a})});let i=t.a||0;return i&&(e[21]=(e[21]||0)+i),e}function L(){let t=Z(),e=f();document.querySelectorAll("#pip-tbody tr").forEach(i=>{let o=parseInt(i.dataset.idx),s=Number(e[o]||0),n=t[o]||0,p=i.querySelector(".pip-car-liberi");p&&(n>0?(p.textContent=Math.max(0,s-n)+" lib.",p.style.display=""):p.style.display="none")})}function At(t,e){let i=h();i[t]=Math.max(0,(i[t]||0)+e),R(i),L(),F()}function Et(t,e){let i=h();i[t]=Math.max(0,parseInt(e)||0),R(i),L();let o=document.querySelector(`.pip-pronti-input[data-key="${t}"]`);o&&(o.value=i[t],o.classList.toggle("pip-pronti-val-on",i[t]>0))}function F(){let t=h(),e=[{titolo:"\u{1F529} Teste",items:[{key:"t_p",label:"Testa",mA:"500mA",emoji:"\u{1F529}"},{key:"t_m",label:"Testa",mA:"600mA",emoji:"\u{1F529}"},{key:"t_g",label:"Testa",mA:"700mA",emoji:"\u{1F529}"}]},{titolo:"\u{1F50C} Cordoni",items:[{key:"c_p",label:"Cordone",mA:"500mA",emoji:"\u{1F50C}"},{key:"c_m",label:"Cordone",mA:"600mA",emoji:"\u{1F50C}"},{key:"c_g",label:"Cordone",mA:"700mA",emoji:"\u{1F50C}"}]},{titolo:"\u{1F50B} Alimentatori",items:[{key:"a",label:"Alimentatore",mA:"",emoji:"\u{1F50B}"}]}],i=document.getElementById("pip-pronti-grid");i&&(i.innerHTML=e.map(o=>{let s=o.items.map(n=>{let p=t[n.key]||0;return`<div class="pip-pronti-row">
        <span class="pip-pronti-lbl">${n.emoji} ${n.label}${n.mA?` <span class="pip-pronti-ma">${n.mA}</span>`:""}</span>
        <div class="pip-pronti-ctrl">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${n.key}',-1)">\u2212</button>
          <input class="pip-pronti-input${p>0?" pip-pronti-val-on":""}" type="number" min="0"
                 data-key="${n.key}" value="${p}"
                 oninput="_pipSetPronti('${n.key}', this.value)"
                 onchange="_pipSetPronti('${n.key}', this.value)">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${n.key}',1)">+</button>
        </div>
      </div>`}).join("");return`<div class="pip-pronti-sezione"><div class="pip-pronti-sezione-titolo">${o.titolo}</div>${s}</div>`}).join(""))}function It(t){let e=1;for(let i=t+1;i<v.length&&v[i][0]==="";i++)e++;return e}function Tt(){let t=Math.max(0,parseInt(document.getElementById("pip-qty-p")?.value)||0),e=Math.max(0,parseInt(document.getElementById("pip-qty-m")?.value)||0),i=Math.max(0,parseInt(document.getElementById("pip-qty-g")?.value)||0);rt({p:t,m:e,g:i});let o=document.getElementById("pip-tot");o&&(o.textContent=t+e+i);let s=f();document.querySelectorAll("#pip-tbody tr").forEach(n=>{let p=parseInt(n.dataset.idx),r=v[p],a=t*r[2]+e*r[3]+i*r[4],c=Number(s[p]||0),l=Math.max(0,a-c),m=n.querySelector(".pip-fab, .pip-fab-zero"),d=n.querySelector('[class^="pip-ord"]');m&&(m.textContent=a>0?a:"\u2014",m.className=a===0?"pip-fab pip-fab-zero":"pip-fab"),d&&(d.textContent=a===0?"\u2014":l,d.className=a===0?"pip-ord-zero":l>0?"pip-ord-manca":"pip-ord-ok")})}function E(t){let e=parseInt(t.dataset.idx),i=Math.max(0,parseInt(t.value)||0),o=f();o[e]=i,A(o);let s=C(),n=v[e],p=s.p*n[2]+s.m*n[3]+s.g*n[4],r=Math.max(0,p-i),a=t.closest("tr"),c=a?.querySelector('[class^="pip-ord"]');c&&(c.textContent=p===0?"\u2014":r,c.className=p===0?"pip-ord-zero":r>0?"pip-ord-manca":"pip-ord-ok");let m=Z()[e]||0,d=a?.querySelector(".pip-car-liberi");d&&(m>0?(d.textContent=Math.max(0,i-m)+" lib.",d.style.display=""):d.style.display="none")}function Ot(){let t=document.getElementById("pip-save-btn"),e=document.getElementById("pip-save-label");!t||!e||(t.disabled=!0,t.classList.remove("pip-save-ok","pip-save-err"),t.classList.add("pip-save-loading"),e.textContent="Salvataggio\u2026",P({azione:"setPipData",qty:C(),caricato:f(),pronti:h(),movimenti:y()}).then(function(){try{localStorage.setItem("pip_local_ts",Date.now())}catch{}t.classList.remove("pip-save-loading"),t.classList.add("pip-save-ok"),e.textContent="Salvato \u2713",setTimeout(function(){t.classList.remove("pip-save-ok"),e.textContent="Salva",t.disabled=!1},2500)}).catch(function(){t.classList.remove("pip-save-loading"),t.classList.add("pip-save-err"),e.textContent="Errore \u2717",setTimeout(function(){t.classList.remove("pip-save-err"),e.textContent="Salva",t.disabled=!1},3e3)}))}function xt(t){let e=document.getElementById("pip-mov-mat"),i=document.getElementById("pip-mov-qty"),o=document.getElementById("pip-mov-nota");if(!e||!i)return;let s=parseInt(e.value),n=Math.max(1,parseInt(i.value)||1),p=(o?.value||"").trim(),r=v[s]?.[1]||"?",a=f();t==="carico"?a[s]=Number(a[s]||0)+n:a[s]=Math.max(0,Number(a[s]||0)-n),A(a);let c=document.querySelector(`#pip-tbody input[data-idx="${s}"]`);c&&(c.value=a[s],E(c));let l=y();l.unshift({id:Date.now(),idx:s,tipo:t,qty:n,nota:p,mat:r,ts:new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}),I(l),i.value=1,o&&(o.value=""),T()}function wt(t){if(!W())return;let i=y().find(o=>o.id===t);i&&$t(t,i)}function $t(t,e){let i=document.getElementById("modal-pip-del-mov");if(!i)return;let o=document.getElementById("pip-del-mov-desc"),s;if(e.tipo==="reso"){let p=e.totPz||0,r=(e.righe||[]).length,a=(e.scartate||[]).length;s=`<span class="pip-mov-badge reso" style="font-size:0.75rem">RESO</span>
     <strong>Rientro \xD7${p} pz</strong>
     <br><span style="color:#64748b;font-size:0.82rem">${r} comp. recuperati \xB7 ${a} comp. scartati</span>
     ${e.nota?`<br><span style="color:#64748b;font-size:0.82rem">${e.nota}</span>`:""}`}else{let p=e.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="pip-mov-badge ${e.tipo}" style="font-size:0.75rem">${p}</span>
     <strong>${e.mat}</strong> &nbsp;${e.tipo==="carico"?"+":"\u2212"}${e.qty} pz
     ${e.nota?`<br><span style="color:#64748b;font-size:0.82rem">${e.nota}</span>`:""}`}o&&(o.innerHTML=s);let n=document.getElementById("btn-pip-del-ok");n&&(n.onclick=()=>lt(t)),i.style.display="flex",i.offsetHeight,i.classList.add("active")}function ct(){let t=document.getElementById("modal-pip-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function lt(t){ct();let e=y(),i=e.find(s=>s.id===t);if(!i)return;let o=f();if(i.tipo==="assemb"||i.tipo==="spedizione")(i.righe||[]).forEach(s=>{o[s.idx]=Number(o[s.idx]||0)+s.qty}),A(o),(i.righe||[]).forEach(s=>{let n=document.querySelector(`#pip-tbody input[data-idx="${s.idx}"]`);n&&(n.value=o[s.idx],E(n))});else if(i.tipo==="reso")(i.righe||[]).forEach(s=>{o[s.idx]=Math.max(0,Number(o[s.idx]||0)-s.qty)}),A(o),(i.righe||[]).forEach(s=>{let n=document.querySelector(`#pip-tbody input[data-idx="${s.idx}"]`);n&&(n.value=o[s.idx],E(n))});else{i.tipo==="carico"?o[i.idx]=Math.max(0,Number(o[i.idx]||0)-i.qty):o[i.idx]=Number(o[i.idx]||0)+i.qty,A(o);let s=document.querySelector(`#pip-tbody input[data-idx="${i.idx}"]`);s&&(s.value=o[i.idx],E(s))}I(e.filter(s=>s.id!==t)),T(),_("Movimento eliminato \u2713")}function T(){let t=document.getElementById("pip-mov-list");if(!t)return;let e=y(),i=W();if(e.length===0){t.innerHTML='<div class="pip-mov-empty">Nessun movimento registrato</div>';return}t.innerHTML=e.map(o=>{let s=i?`<button class="pip-mov-del" onclick="_pipEliminaMovimento(${o.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',n=i&&(o.tipo==="carico"||o.tipo==="scarico")?`<button class="pip-mov-edit" onclick="_pipModificaMovimento(${o.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(o.tipo==="spedizione"){let p=(o.items||[]).reduce((m,d)=>m+d.qty,0),r={};(o.items||[]).forEach(m=>{r[m.mA]=(r[m.mA]||0)+m.qty});let a=Object.entries(r).map(([m,d])=>`<span class="pip-sped-ma-pill">${m} \xD7${d}</span>`).join(""),c=(o.items||[]).map(m=>`<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${m.emoji} ${m.tipoLabel} ${m.fmtLabel} <span class="pip-pronti-ma">${m.mA}</span></span>
          <span class="pip-mov-qty scarico">\xD7${m.qty}</span>
        </div>`).join(""),l=(o.righe||[]).map(m=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8">${m.mat}</span>
          <span class="pip-mov-qty scarico">\u2212${m.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge spedizione">SPED.</span>
            <span class="pip-mov-assemb-label">\u{1F69A} Spediz. \xD7${p} pz ${a}</span>
            ${o.nota?`<span class="pip-mov-nota">${o.nota}</span>`:""}
            <span class="pip-mov-ts">${o.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${s}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${c}</div>
            <div class="pip-sped-bom-divider">componenti scaricati</div>
            ${l}
          </div>
        </details>`}if(o.tipo==="assemb"){let p=o.assembTipo==="Testa"?"\u{1F529}":"\u{1F50C}",r=o.assembFmt==="Piccolo"?"500mA":o.assembFmt==="Medio"?"600mA":"700mA",a=(o.righe||[]).map(c=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat">${c.mat}</span>
          <span class="pip-mov-qty scarico">\u2212${c.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge assemb">${r}</span>
            <span class="pip-mov-assemb-label">${p} ${o.assembTipo} ${o.assembFmt} \xD7${o.assembQty}</span>
            ${o.nota?`<span class="pip-mov-nota">${o.nota}</span>`:""}
            <span class="pip-mov-ts">${o.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${s}
          </summary>
          <div class="pip-assemb-sub-list">${a}</div>
        </details>`}if(o.tipo==="reso"){let p=o.totPz||0,r=(o.items||[]).map(l=>`<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${l.emoji} ${l.label}${l.mA?` <span class="pip-pronti-ma">${l.mA}</span>`:""}</span>
          <span class="pip-mov-qty carico">\xD7${l.qty}</span>
        </div>`).join(""),a=(o.righe||[]).map(l=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#15803d">\u2713 ${l.mat}</span>
          <span class="pip-mov-qty carico">+${l.qty}</span>
        </div>`).join(""),c=(o.scartate||[]).map(l=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${l.mat}</span>
          <span class="pip-mov-qty" style="color:#94a3b8">\u2715 ${l.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group pip-mov-reso-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge reso">RESO</span>
            <span class="pip-mov-assemb-label">\u{1F4E6} Rientro \xD7${p} pz</span>
            ${o.nota?`<span class="pip-mov-nota">${o.nota}</span>`:""}
            <span class="pip-mov-ts">${o.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${s}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${r}</div>
            ${a?`<div class="pip-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${a}`:""}
            ${c?`<div class="pip-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${c}`:""}
          </div>
        </details>`}return`
      <div class="pip-mov-item ${o.tipo}">
        <span class="pip-mov-badge ${o.tipo}">${o.tipo==="carico"?"CARICO":"SCARICO"}</span>
        <span class="pip-mov-mat">${o.mat}</span>
        <span class="pip-mov-qty ${o.tipo}">${o.tipo==="carico"?"+":"\u2212"}${o.qty}</span>
        ${o.nota?`<span class="pip-mov-nota">${o.nota}</span>`:'<span class="pip-mov-nota"></span>'}
        <span class="pip-mov-ts">${o.ts}</span>
        ${n}${s}
      </div>`}).join("")}function W(){if(!u||!u.nome)return!1;let t=String(u.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||u.ruolo==="MASTER"}function Ct(t){if(!W())return;let i=y().find(r=>r.id===t);if(!i)return;let o=document.getElementById("modal-pip-edit-mov");if(!o)return;let s=document.getElementById("pip-edit-mov-mat"),n=document.getElementById("pip-edit-mov-qty"),p=document.getElementById("pip-edit-mov-nota");s&&(s.innerHTML=`<span class="pip-mov-badge ${i.tipo}" style="font-size:0.75rem">${i.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${i.mat}</strong>`),n&&(n.value=i.qty),p&&(p.value=i.nota||""),o.dataset.movId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active"),setTimeout(()=>p&&p.focus(),80)}function mt(){let t=document.getElementById("modal-pip-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Rt(){let t=document.getElementById("modal-pip-edit-mov");if(!t)return;let e=Number(t.dataset.movId);mt();let i=y(),o=i.findIndex(c=>c.id===e);if(o===-1)return;let s=i[o],n=parseInt(document.getElementById("pip-edit-mov-qty")?.value),p=(document.getElementById("pip-edit-mov-nota")?.value||"").trim();if(isNaN(n)||n<=0){_("Quantit\xE0 non valida \u26A0\uFE0F");return}let r=n!==s.qty,a=p!==(s.nota||"").trim();if(!(!r&&!a)){if(r){let c=n-s.qty,l=f();s.tipo==="carico"?l[s.idx]=Math.max(0,Number(l[s.idx]||0)+c):l[s.idx]=Math.max(0,Number(l[s.idx]||0)-c),A(l);let m=document.querySelector(`#pip-tbody input[data-idx="${s.idx}"]`);m&&(m.value=l[s.idx],E(m))}i[o]={...s,qty:n,nota:p},I(i),T(),_("Movimento aggiornato \u2713")}}function Mt(){let t=h(),e=B.filter(s=>(t[s.key]||0)>0).map(s=>({...s,qty:t[s.key]}));if(!e.length){_("Nessun articolo da spedire \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let i=document.getElementById("pip-sped-items");i&&(i.innerHTML=e.map(s=>`
      <label class="pip-sped-item-row">
        <input type="checkbox" class="pip-sped-chk" data-key="${s.key}" checked>
        <span class="pip-sped-item-info">
          <span class="pip-sped-item-emoji">${s.emoji}</span>
          <span class="pip-sped-item-label">${s.tipoLabel}${s.mA?` <span class="pip-pronti-ma">${s.mA}</span>`:""}</span>
          <span class="pip-sped-item-qty">\xD7${s.qty}</span>
        </span>
      </label>`).join(""),i.querySelectorAll(".pip-sped-chk").forEach(s=>s.addEventListener("change",G))),G();let o=document.getElementById("modal-pip-spedizione");o&&(o.style.display="flex",o.offsetHeight,o.classList.add("active"))}function G(){let t=[...document.querySelectorAll(".pip-sped-chk:checked")].map(a=>a.dataset.key),e=t.some(a=>a.startsWith("t_")),i=t.some(a=>a.startsWith("c_")),o=t.includes("a"),s=document.getElementById("pip-sped-warning"),n=document.getElementById("pip-sped-warning-msg"),p=document.getElementById("btn-pip-sped-ok");if(!t.length){s&&(s.style.display="flex"),n&&(n.textContent="Nessun articolo selezionato."),p&&(p.disabled=!0);return}p&&(p.disabled=!1);let r=[];e||r.push("Teste"),i||r.push("Cordoni"),o||r.push("Alimentatori"),r.length>0&&r.length<3?(s&&(s.style.display="flex"),n&&(n.textContent=`Attenzione: stai spedendo senza ${r.join(" e ")} \u2014 normalmente Testa, Cordone e Alimentatore vanno spediti insieme. Confermi comunque?`)):s&&(s.style.display="none")}function Pt(){let t=[...document.querySelectorAll(".pip-sped-chk:checked")].map(d=>d.dataset.key);if(!t.length)return;let e=h(),i=B.filter(d=>t.includes(d.key)&&(e[d.key]||0)>0).map(d=>({...d,qty:e[d.key]}));if(!i.length)return;let o=(document.getElementById("pip-spedizione-nota")?.value||"").trim(),s=f(),n={};i.forEach(d=>{let g=Q[d.tipo]?.[d.fmt];g&&g.forEach(([b,M])=>{let S=d.qty*M;s[b]=Math.max(0,Number(s[b]||0)-S),n[b]?n[b].qty+=S:n[b]={idx:b,mat:v[b]?.[1]||"?",qty:S}})});let p=Object.values(n);A(s);let r=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}),a=y();a.unshift({id:Date.now(),tipo:"spedizione",items:i,righe:p,nota:o,ts:r}),I(a);let c={...h()};if(t.forEach(d=>{delete c[d]}),R(c),!B.filter(d=>(c[d.key]||0)>0).length){let d=document.getElementById("pip-spedizione-nota");d&&(d.value="")}p.forEach(d=>{let g=document.querySelector(`#pip-tbody input[data-idx="${d.idx}"]`);g&&(g.value=s[d.idx],E(g))}),dt(),F(),L(),T();let m=i.reduce((d,g)=>d+g.qty,0);_(`Spedizione registrata: ${m} pz scaricati \u2713`)}function dt(){let t=document.getElementById("modal-pip-spedizione");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Nt(){let t=document.getElementById("modal-pip-reso");if(!t)return;V.forEach(i=>{let o=document.getElementById("pip-reso-qty-"+i.key);o&&(o.value=0)});let e=document.getElementById("pip-reso-nota");e&&(e.value=""),K(),t.style.display="flex",t.offsetHeight,t.classList.add("active")}function ut(){let t=document.getElementById("modal-pip-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function qt(t,e){let i=document.getElementById("pip-reso-qty-"+t);i&&(i.value=Math.max(0,(parseInt(i.value)||0)+e),K())}function K(){let t={};V.forEach(o=>{let s=parseInt(document.getElementById("pip-reso-qty-"+o.key)?.value)||0;if(!s)return;(Q[o.tipo]?.[o.fmt]||[]).forEach(([p,r])=>{t[p]=(t[p]||0)+s*r}),o.key==="a"&&(t[21]=(t[21]||0)+s)});let e=document.getElementById("pip-reso-bom-list");if(!e)return;let i=Object.entries(t).filter(([,o])=>o>0);if(!i.length){e.innerHTML='<div class="pip-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}e.innerHTML=i.map(([o,s])=>{let n=v[parseInt(o)]?.[1]||"?";return`<label class="pip-reso-bom-row">
      <input type="checkbox" class="pip-reso-bom-chk" data-idx="${o}" data-qty="${s}" checked>
      <span class="pip-reso-bom-mat">${n}</span>
      <span class="pip-reso-bom-qty">+${s}</span>
    </label>`}).join("")}function Lt(){let t=[];if(V.forEach(a=>{let c=parseInt(document.getElementById("pip-reso-qty-"+a.key)?.value)||0;c>0&&t.push({...a,qty:c})}),!t.length){_("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let e=[],i=[];document.querySelectorAll(".pip-reso-bom-chk").forEach(a=>{let c=parseInt(a.dataset.idx),l=parseInt(a.dataset.qty),m=v[c]?.[1]||"?";a.checked?e.push({idx:c,mat:m,qty:l}):i.push({idx:c,mat:m,qty:l})});let o=(document.getElementById("pip-reso-nota")?.value||"").trim(),s=f();e.forEach(a=>{s[a.idx]=Number(s[a.idx]||0)+a.qty}),A(s),e.forEach(a=>{let c=document.querySelector(`#pip-tbody input[data-idx="${a.idx}"]`);c&&(c.value=s[a.idx],E(c))});let n=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}),p=y(),r=t.reduce((a,c)=>a+c.qty,0);p.unshift({id:Date.now(),tipo:"reso",items:t,righe:e,scartate:i,nota:o,ts:n,totPz:r}),I(p),ut(),T(),L(),_(`Reso registrato: ${r} pz \u2014 ${e.length} componenti recuperati \u2713`)}function kt(t){let e=document.getElementById("pip-mov-body");if(!e)return;let i=e.style.display==="none";e.style.display=i?"":"none";let o=t.querySelector("i");o&&(o.className=i?"fas fa-chevron-down":"fas fa-chevron-up")}function Dt(){confirm("Vuoi azzerare tutto (quantit\xE0, magazzino e movimenti)?")&&(rt({p:0,m:0,g:0}),A({}),I([]),R({}),X())}function X(){j||(j=!0,St(function(c){c&&X()}));let t=f(),e=y();if((Object.keys(t).length===0||Object.values(t).every(c=>Number(c)===0))&&e.some(c=>c.tipo==="carico"||c.tipo==="scarico")){let c=_t();if(c&&Object.values(c).some(l=>l>0))try{localStorage.setItem(N,JSON.stringify(c))}catch{}}let o=document.getElementById("contenitore-dati"),s=C(),n=f(),p=Z(),r=v.map((c,l)=>{let[m,d,g,b,M]=c,S=s.p*g+s.m*b+s.g*M,k=Number(n[l]||0),Y=p[l]||0,ft=Math.max(0,k-Y),tt=Math.max(0,S-k),yt=S===0?"pip-ord-zero":tt>0?"pip-ord-manca":"pip-ord-ok",gt=m?`<td class="pip-sez-cell" rowspan="${It(l)}">${m}</td>`:"",vt=[g,b,M].map(et=>et>0?`<td class="pip-coeff pip-coeff-on">${et}</td>`:'<td class="pip-coeff pip-coeff-off">\u2014</td>').join("");return`<tr data-idx="${l}" class="${m?"pip-row-sez-start":""}">
      ${gt}
      <td class="pip-mat">${d}</td>
      ${vt}
      <td class="pip-fab${S===0?" pip-fab-zero":""}">${S>0?S:"\u2014"}</td>
      <td class="pip-car-cell">
        <input class="pip-car-input" type="number" min="0" value="${k}"
               data-idx="${l}" oninput="_pipAggiornaCar(this)" onchange="_pipAggiornaCar(this)">
        <span class="pip-car-liberi"${Y>0?"":' style="display:none"'}>${ft} lib.</span>
      </td>
      <td class="${yt}">${S===0?"\u2014":tt}</td>
    </tr>`}).join(""),a=v.map((c,l)=>`<option value="${l}">[${c[0]||v.slice(0,l).reverse().find(m=>m[0])?.[0]||"?"}] ${c[1]}</option>`).join("");o.innerHTML=`
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
            <input class="pip-qty-input" id="pip-qty-p" type="number" min="0" value="${s.p}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>\u{1F7E3} Medio<br><small>600mA</small></label>
            <input class="pip-qty-input" id="pip-qty-m" type="number" min="0" value="${s.m}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>\u{1F534} Grande<br><small>700mA</small></label>
            <input class="pip-qty-input" id="pip-qty-g" type="number" min="0" value="${s.g}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-total-box">
            <div class="pip-qty-total-label">TOTALE</div>
            <div class="pip-qty-total-val" id="pip-tot">${s.p+s.m+s.g}</div>
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
            ${r}
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
              <select id="pip-mov-mat">${a}</select>
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
    </div>`,T(),F(),ot(o)}function re(){window._pipAggiornaPronti=At,window._pipSetPronti=Et,window._pipAggiornaQty=Tt,window._pipAggiornaCar=E,window._pipScaricoTuttiPronti=Mt,window._pipAggiornaSpeWarning=G,window._pipChiudiModalSped=dt,window._pipConfermaSpedizione=Pt,window._pipSalvaMovimento=xt,window._pipEliminaMovimento=wt,window._pipModificaMovimento=Ct,window._pipChiudiModalEdit=mt,window._pipConfermaModificaMov=Rt,window._pipChiudiModalDel=ct,window._pipConfermaEliminaMov=lt,window._pipApriModalReso=Nt,window._pipChiudiModalReso=ut,window._pipResoQtyChange=qt,window._pipResoAggiornaBOM=K,window._pipConfermaReso=Lt,window._pipToggleMov=kt,window._pipSalvaManuale=Ot,window._pipReset=Dt}var j,J,N,H,U,v,Q,B,V,pt,ce,zt=O(()=>{w();z();nt();at();it();j=!1;J="mlPipQty",N="mlPipCaricato",H="mlPipMovimenti",U="mlPipPronti",v=[["TESTA","Testa piccola",1,0,0],["","Testa media",0,1,0],["","Testa grande",0,0,1],["","Catenaria piccola",1,0,0],["","Catenaria media",0,1,0],["","Catenaria grande",0,0,1],["","Tappino nero",2,2,2],["","Wago",0,2,2],["","Viti 2x6",8,0,0],["","Viti 2,5x6",0,8,4],["CORDONE","Case superiore",1,1,1],["","Case inf. 500mA",1,0,0],["","Case inf. 600mA",0,1,0],["","Case inf. 700mA",0,0,1],["","Pulsante",1,1,1],["","Viti nere",2,2,2],["","Plug 1,5m",1,0,0],["","Plug 2m",0,1,1],["","Cavo out 500mA",1,0,0],["","Cavo out 600mA",0,1,0],["","Cavo out 700mA",0,0,1],["","Alimentatore",1,1,1],["","Interruttore 500mA",1,0,0],["","Interruttore 600mA",0,1,0],["","Interruttore 700mA",0,0,1]],Q={TESTA:{p:[[0,1],[3,1],[6,2],[8,8]],m:[[1,1],[4,1],[6,2],[7,2],[9,8]],g:[[2,1],[5,1],[6,2],[7,2],[9,4]]},CORDONE:{p:[[10,1],[11,1],[14,1],[15,2],[16,1],[18,1],[22,1]],m:[[10,1],[12,1],[14,1],[15,2],[17,1],[19,1],[23,1]],g:[[10,1],[13,1],[14,1],[15,2],[17,1],[20,1],[24,1]]},ALIMENTATORE:{_:[[21,1]]}},B=[{key:"t_p",tipo:"TESTA",fmt:"p",tipoLabel:"Testa",fmtLabel:"Piccolo",emoji:"\u{1F529}",mA:"500mA"},{key:"t_m",tipo:"TESTA",fmt:"m",tipoLabel:"Testa",fmtLabel:"Medio",emoji:"\u{1F529}",mA:"600mA"},{key:"t_g",tipo:"TESTA",fmt:"g",tipoLabel:"Testa",fmtLabel:"Grande",emoji:"\u{1F529}",mA:"700mA"},{key:"c_p",tipo:"CORDONE",fmt:"p",tipoLabel:"Cordone",fmtLabel:"Piccolo",emoji:"\u{1F50C}",mA:"500mA"},{key:"c_m",tipo:"CORDONE",fmt:"m",tipoLabel:"Cordone",fmtLabel:"Medio",emoji:"\u{1F50C}",mA:"600mA"},{key:"c_g",tipo:"CORDONE",fmt:"g",tipoLabel:"Cordone",fmtLabel:"Grande",emoji:"\u{1F50C}",mA:"700mA"},{key:"a",tipo:"ALIMENTATORE",fmt:"_",tipoLabel:"Alimentatore",fmtLabel:"",emoji:"\u{1F50B}",mA:""}],V=[{key:"t_p",tipo:"TESTA",fmt:"p",label:"Testa Piccola",emoji:"\u{1F529}",mA:"500mA"},{key:"t_m",tipo:"TESTA",fmt:"m",label:"Testa Media",emoji:"\u{1F529}",mA:"600mA"},{key:"t_g",tipo:"TESTA",fmt:"g",label:"Testa Grande",emoji:"\u{1F529}",mA:"700mA"},{key:"c_p",tipo:"CORDONE",fmt:"p",label:"Cordone Piccolo",emoji:"\u{1F50C}",mA:"500mA"},{key:"c_m",tipo:"CORDONE",fmt:"m",label:"Cordone Medio",emoji:"\u{1F50C}",mA:"600mA"},{key:"c_g",tipo:"CORDONE",fmt:"g",label:"Cordone Grande",emoji:"\u{1F50C}",mA:"700mA"},{key:"a",tipo:"ALIMENTATORE",fmt:"_",label:"Alimentatore",emoji:"\u{1F50B}",mA:""}];pt=null;window.pipRecovery={stato:function(){let t=h(),e=f(),i=localStorage.getItem("pip_local_ts");console.group("%c[pipRecovery] Stato localStorage pipistrelli","color:#1a237e;font-weight:bold"),console.log("\u{1F4C5} pip_local_ts:",i,i?"("+new Date(parseInt(i)).toLocaleString("it-IT")+")":"(mai salvato)"),console.log("\u{1F504} PRONTI:",JSON.stringify(t)),console.log("   \u2014 TESTA  P/M/G:",t.t_p||0,t.t_m||0,t.t_g||0),console.log("   \u2014 CORDONE P/M/G:",t.c_p||0,t.c_m||0,t.c_g||0);let o=Object.values(t).some(s=>s>0);return console.log(o?"\u2705 Pronti presenti \u2192 puoi usare pipRecovery.forzaRipristino()":"\u26A0\uFE0F Pronti tutti 0 \u2192 usa pipRecovery.reimpostaPronti({t_p:X,t_m:X,...})"),console.log("\u{1F4E6} CARICATO keys:",Object.keys(e).length,"\u2014 valori:",JSON.stringify(e)),console.groupEnd(),{pronti:t,caricato:e}},forzaRipristino:function(){let t={azione:"setPipData",qty:C(),caricato:f(),pronti:h(),movimenti:y()};localStorage.setItem("pip_local_ts",Date.now()),P(t).then(e=>console.log("%c[pipRecovery] \u2705 Ripristino inviato al server:","color:green",e)).catch(e=>console.error("[pipRecovery] \u274C Errore:",e)),console.log("[pipRecovery] Invio in corso...")},reimpostaPronti:function(t){let e=["t_p","t_m","t_g","c_p","c_m","c_g"],i={};e.forEach(o=>{i[o]=parseInt(t[o])||0}),console.log("[pipRecovery] Imposto pronti:",JSON.stringify(i)),R(i),console.log("%c[pipRecovery] \u2705 Pronti impostati e push al server avviato","color:green")}};ce=X});export{x as a,jt as b,w as c,Xt as d,Yt as e,at as f,u as g,Jt as h,st as i,Ht as j,z as k,Zt as l,nt as m,pe as n,X as o,re as p,ce as q,zt as r};
//# sourceMappingURL=chunk-chunk-FZ2SNW64.js.map
