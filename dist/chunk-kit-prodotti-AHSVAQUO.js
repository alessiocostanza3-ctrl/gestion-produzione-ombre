import{a as qt,c as mt,e as xt,f as a,g as q,h as J,l as Nt,m as j,q as Kt,r as tt,u as Tt}from"./chunk-chunk-MVGUZ3SY.js";function ne(){it=!1}function F(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function Ot(t,i){let n="opz"+(i+1),e=F(t?.key,n);return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e}}function Bt(t,i){let n="asse"+(i+1),e=F(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,c)=>Ot(s,c)).filter(Boolean):[];return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function Lt(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function Dt(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function Pt(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let c of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:c.id,opzioneKey:c.key,opzioneNome:c.nome})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:Lt(e.selections),nome:Dt(e.selections),selections:e.selections}})}function Rt(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||_()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:String(t?.unitaMisura||e).trim()||"pz"}}function Vt(t){return{id:String(t?.id||_()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(Rt):[]}}function Ht(t,i){let n=A(i);if(!n.length)return null;let e=null;for(let o of n){let s=B(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function jt(t,i,n){let e=A(n),o={},s=Ht(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let c of e){let r=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},c.key)?B(t,c.key):s!==null?s:0;r>0&&(o[c.key]=r)}return{id:_(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:X(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:String(t?.unitaMisura||(N(t)?"flag":"pz")).trim()||"pz"}}function ft(t,i,n){return{id:_(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>jt(e,i,n)):[]}}function kt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function U(t,i){let n=new Set(A(t).map(s=>s.key)),e=A(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function et(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function Ut(t,i){return{id:String(t?.id||_()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function vt(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(f,g){let v="v"+(g+1),h=F(f?.key,v);return{id:String(f?.id||_()),key:h,nome:String(f?.nome||h).trim()||h}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((f,g)=>Bt(f,g)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(f){return{id:f.id,key:f.key,nome:f.nome}})}]:[],s=Pt(o),c=s.length?s:n,l=new Set(c.map(f=>f.key)),r={};Object.entries(i.qtaDaProdurre||{}).forEach(function(f){l.has(f[0])&&(r[f[0]]=Math.max(0,Number.parseInt(f[1],10)||0))});for(let f of c)r[f.key]===void 0&&(r[f.key]=0);let d=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(f=>Ut(f,c[0]?.key||"")).filter(f=>!f.varianteKey||l.has(f.varianteKey)):[],m={};return Object.entries(i.pronti||{}).forEach(function(f){m[f[0]]=Math.max(0,Number.parseInt(f[1],10)||0)}),{id:String(i.id||_()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:gt,assiConfigurazione:o,varianti:c,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(Vt):[],sottoAssembly:d,qtaDaProdurre:r,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function A(t){return Array.isArray(t?.varianti)?t.varianti:[]}function N(t){return!!t&&t.modoComponente==="segnalazione"}function X(t){return!!t&&t.tracciabile!==!1&&!N(t)}function B(t,i){let n=Number.parseInt(t?.qtaPerVariante?.[i],10)||0;return N(t)?n>0?1:0:n}function yt(){try{let t=localStorage.getItem(ut),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function Qt(t){try{localStorage.setItem(ut,JSON.stringify(t||{}))}catch{}}function bt(t){let i=yt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of A(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e}function Z(t,i){let{kits:n}=b(),e=n.find(r=>r.id===t);if(!e)return;let o=yt(),s=bt(e);i(s,e);let c={},l=!1;for(let r of A(e)){let d=Math.max(0,Number.parseInt(s[r.key],10)||0);c[r.key]=d,d>0&&(l=!0)}l?o[t]=c:delete o[t],Qt(o),E===t&&T()}function Ft(t){return Object.values(t||{}).reduce((i,n)=>i+(Number.parseInt(n,10)||0),0)}function Gt(t,i){let n=A(t).filter(s=>(Number.parseInt(i?.[s.key],10)||0)>0),e=[],o=[];for(let s of t.sezioni||[]){let c=[];for(let l of s.componenti||[]){let r=0,d=[];for(let f of n){let g=Number.parseInt(i?.[f.key],10)||0,v=B(l,f.key);!g||!v||(N(l)?r+=g:r+=g*v,d.push({nome:f.nome,pezziOrdine:g,coeff:v}))}if(!d.length)continue;let m=d.length===1?d[0].nome:d.length+" configurazioni";if(N(l)){o.push({id:"alert-"+l.id,tipo:"alert",nome:l.nome,dettaglio:l.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:r,variantiLabel:m});continue}c.push({id:l.id,nome:l.nome,totale:r,unita:l.unitaMisura||"pz",dettaglio:m,noteConfig:l.noteConfig||""}),l.noteConfig&&o.push({id:"note-"+l.id,tipo:"nota",nome:l.nome,dettaglio:l.noteConfig,totaleCoinvolto:r,variantiLabel:m})}c.length&&e.push({id:s.id,nome:s.nome,righe:c})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:Ft(i),totaleRighe:e.reduce((s,c)=>s+c.righe.length,0)}}function b(){try{let t=localStorage.getItem(nt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(vt):[]}}catch{return{kits:[]}}}function M(t){let i=Array.isArray(t)?t.map(vt):[];try{localStorage.setItem(nt,JSON.stringify({kits:i})),localStorage.setItem(Y,Date.now())}catch{}Jt(i)}function Jt(t){clearTimeout(pt),pt=setTimeout(function(){tt({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function Yt(t){fetch(mt,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(Y)||0);if(n>0&&n>e){try{localStorage.setItem(nt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(Y,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function _(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function ot(){if(!j||!j.nome)return!1;let t=String(j.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||j.ruolo==="MASTER"}function Wt(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(N(e)){i[e.id]=0;continue}let o=0;for(let[s,c]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(c,10)||0)*B(e,s);i[e.id]=o}return i}function Xt(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let c of s.componenti||[]){if(N(c))continue;let l=B(c,o);l>0&&(i[c.id]=(i[c.id]||0)+e*l)}}return i}function ht(t,i){let n=A(t).find(e=>e.key===i);return n?a(n.nome):a(i)}function st(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function V(){it||(it=!0,Yt(function(e){e&&V()}));let{kits:t}=b(),i=document.getElementById("contenitore-dati"),n=t.map(e=>{let s=A(e).length,c=(e.assiConfigurazione||[]).length,l=(e.sezioni||[]).reduce((r,d)=>r+(d.componenti||[]).length,0);return`
        <div class="kit-card" onclick="_kitOpenView('${a(e.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${a(e.nome)}</span>
                <button class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${a(e.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
            </div>
            <div class="kit-card-meta">
                <span class="kit-meta-pill"><i class="fas fa-sliders"></i> ${c} ass${c===1?"e":"i"}</span>
                <span class="kit-meta-pill"><i class="fas fa-layer-group"></i> ${s} configuraz.${s===1?"ione":"ioni"}</span>
                <span class="kit-meta-pill"><i class="fas fa-list"></i> ${l} voci BOM</span>
            </div>
        </div>`}).join("");i.innerHTML=`
    <div class="kit-page">
        <div class="kit-page-header">
            <div class="kit-page-title"><i class="fas fa-boxes-stacked"></i> Kit Prodotti</div>
            <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>
        </div>
        ${t.length===0?`<div class="kit-empty-state">
                <i class="fas fa-box-open kit-empty-icon"></i>
                <p>Nessun kit configurato.</p>
                <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
               </div>`:`<div class="kit-grid">${n}</div>`}
    </div>`,J(i)}function Zt(t){E=t,zt="ordine",T()}function T(){let{kits:t}=b(),i=t.find(m=>m.id===E);if(!i){V();return}let n=document.getElementById("contenitore-dati"),e=A(i),o=bt(i),s=Gt(i,o),c=s.selectedVarianti.length?s.selectedVarianti.map(m=>`<span class="kit-meta-pill"><strong>${o[m.key]||0}</strong> \xD7 ${a(m.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',l=e.length?e.map(m=>{let f=Number.parseInt(o[m.key],10)||0,g=Array.isArray(m.selections)&&m.selections.length?m.selections.map(v=>`<span class="kit-order-pill">${a(v.opzioneNome)}</span>`).join(""):`<span class="kit-order-pill">${a(m.key)}</span>`;return`<div class="kit-order-card ${f>0?"kit-order-card--active":""}">
                <div class="kit-order-card-head">
                    <div>
                        <div class="kit-order-card-title">${a(m.nome)}</div>
                        <div class="kit-order-card-sub">${g}</div>
                    </div>
                    <span class="kit-order-card-key">${a(m.key)}</span>
                </div>
                <div class="kit-order-stepper">
                    <button class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(m.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${f}"
                           onchange="_kitOrdineSet('${a(i.id)}','${a(m.key)}',this.value)"
                           oninput="_kitOrdineSet('${a(i.id)}','${a(m.key)}',this.value)">
                    <button class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(m.key)}',1)">+</button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:30px 20px">
            <i class="fas fa-sliders" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Configura prima gli assi del prodotto per comporre un ordine.</p>
            <button class="kit-btn-secondary" onclick="_kitOpenConfig('${a(i.id)}')">Configura prodotto</button>
        </div>`,r=s.totalePezzi?s.sezioni.map(m=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${a(m.nome)}</div>
                ${m.righe.map(f=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${a(f.nome)}</div>
                            <div class="kit-distinta-row-meta">${a(f.dettaglio)}</div>
                            ${f.noteConfig?`<div class="kit-distinta-row-note">${a(f.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${f.totale} ${a(f.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,d=s.avvisi.length?s.avvisi.map(m=>`
            <div class="kit-distinta-alert ${m.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${a(m.nome)}</div>
                <div class="kit-distinta-alert-body">${a(m.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${m.totaleCoinvolto} pz \xB7 ${a(m.variantiLabel)}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Nessun avviso particolare per l\u2019ordine attuale.</div>';n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${a(i.nome)}</span>
            <button class="kit-gear-btn-inline" onclick="_kitOpenConfig('${a(i.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Ordine in composizione</div>
                    <div class="kit-order-summary-total">${s.totalePezzi} pezzi</div>
                </div>
                <button class="kit-btn-secondary" onclick="_kitOrdineReset('${a(i.id)}')"><i class="fas fa-rotate-left"></i> Azzera ordine</button>
            </div>
            <div class="kit-order-summary-note">Questa bozza ordine resta locale sul dispositivo e serve solo per generare la distinta base di approvvigionamento.</div>
            <div class="kit-order-summary-badges">${c}</div>
        </div>

        <div class="kit-order-layout">
            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-hand-pointer"></i> Componi ordine</div>
                <div class="kit-cfg-help">Seleziona le configurazioni richieste dal cliente. Appena cambi quantit\xE0, la distinta base qui sotto si aggiorna subito con componenti e avvisi.</div>
                <div class="kit-order-grid">${l}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${s.totaleRighe} righe materiali \xB7 ${s.avvisi.length} avvisi</div>
                ${r}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${d}
            </section>
        </div>
    </div>`,J(n)}function ti(){E=null,V()}function ii(t){zt=t,T()}function ei(t){Z(t,function(i,n){for(let e of A(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function ni(t,i,n){Z(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function oi(t,i,n){Z(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function si(t){Z(t,function(i){for(let n of Object.keys(i))i[n]=0})}function $t(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=b(),s=o.find(w=>w.id===E);if(!s)return;let c=(s.sezioni||[]).find(w=>w.id===n),l=c&&(c.componenti||[]).find(w=>w.id===i);if(!l||!X(l))return;l.caricato=e,M(o);let d=Wt(s)[i]||0,m=Math.max(0,d-e),g=Xt(s)[i]||0,v=t.closest("tr");if(!v)return;let h=v.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");h&&(h.textContent=d===0?"\u2014":m,h.className=d===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let z=v.querySelector(".kit-car-liberi");z&&(g>0?(z.textContent=Math.max(0,e-g)+" lib.",z.style.display=""):z.style.display="none")}function ai(t,i,n){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),M(e),E===t&&T())}function ci(t,i,n){let{kits:e}=b(),o=e.find(c=>c.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),M(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function ri(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button class="kit-mov-del" onclick="_kitEliminaMovimento('${a(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button class="kit-mov-edit" onclick="_kitModificaMovimento('${a(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let c=(e.righe||[]).reduce((d,m)=>d+m.qty,0),l=(e.righe||[]).map(d=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${a(d.mat)}</span><span class="kit-mov-qty scarico">\u2212${d.qty}</span></div>`).join(""),r=(e.items||[]).map(d=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${a(d.nome)}</span><span class="kit-mov-qty scarico">\xD7${d.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${c} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${a(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${r}<div class="kit-sped-bom-divider">componenti scaricati</div>${l}</div>
            </details>`}if(e.tipo==="reso"){let c=e.totPz||0,l=(e.items||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${a(m.nome)}</span><span class="kit-mov-qty carico">\xD7${m.qty}</span></div>`).join(""),r=(e.righe||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${a(m.mat)}</span><span class="kit-mov-qty carico">+${m.qty}</span></div>`).join(""),d=(e.scartate||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${a(m.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${m.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\u{1F4E6} Rientro \xD7${c} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${a(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">
                ${l}
                ${r?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${r}`:""}
                ${d?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${d}`:""}
              </div>
            </details>`}return`<div class="kit-mov-item ${a(e.tipo)}">
            <span class="kit-mov-badge ${a(e.tipo)}">${e.tipo==="carico"?"CARICO":"SCARICO"}</span>
            <span class="kit-mov-mat">${a(e.mat)}</span>
            <span class="kit-mov-qty ${a(e.tipo)}">${e.tipo==="carico"?"+":"\u2212"}${e.qty}</span>
            ${e.nota?`<span class="kit-mov-nota">${a(e.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${e.ts}</span>
            ${s}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function li(t,i){let{kits:n}=b(),e=n.find(z=>z.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),c=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let l=o.value,r=o.options[o.selectedIndex]?.dataset.sid,d=Math.max(1,Number.parseInt(s.value,10)||1),m=(c?.value||"").trim(),f=(e.sezioni||[]).find(z=>z.id===r),g=f&&(f.componenti||[]).find(z=>z.id===l);if(!g||!X(g))return;i==="carico"?g.caricato=(parseInt(g.caricato)||0)+d:g.caricato=Math.max(0,(parseInt(g.caricato)||0)-d),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:l,sid:r,tipo:i,qty:d,nota:m,mat:g.nome,ts:st()}),M(n),s&&(s.value=1),c&&(c.value="");let v=document.getElementById("kit-mov-list-"+t);v&&(v.innerHTML=ri(e,ot()));let h=document.querySelector(`#kit-tbody-${t} input[data-cid="${l}"]`);h&&(h.value=g.caricato,$t(h))}function di(t,i){if(!ot())return;let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&mi(t,i,o)}function mi(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((r,d)=>r+d.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let l=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${a(n.tipo)}" style="font-size:.75rem">${l}</span> <strong>${a(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let c=document.getElementById("btn-kit-del-ok");c&&(c.onclick=()=>_t(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Ct(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function _t(t,i){Ct();let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(c=>c.id===o.sid);for(let c of o.righe||[])for(let l of e.sezioni||[]){let r=(l.componenti||[]).find(d=>d.id===c.cid||d.nome===c.mat);r&&(r.caricato=(parseInt(r.caricato)||0)+c.qty)}for(let c of o.items||[])c.saId&&e.pronti&&(e.pronti[c.saId]=(parseInt(e.pronti[c.saId])||0)+c.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let c of e.sezioni||[]){let l=(c.componenti||[]).find(r=>r.id===s.cid||r.nome===s.mat);l&&(l.caricato=Math.max(0,(parseInt(l.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let c=(s.componenti||[]).find(l=>l.id===o.cid);c&&(c.caricato=Math.max(0,(parseInt(c.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let c=(s.componenti||[]).find(l=>l.id===o.cid);c&&(c.caricato=(parseInt(c.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),M(n),E===t&&T(),q("Movimento eliminato \u2713")}}function fi(t,i){if(!ot())return;let{kits:n}=b(),e=n.find(d=>d.id===t);if(!e)return;let o=(e.movimenti||[]).find(d=>d.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let c=document.getElementById("kit-edit-mov-mat"),l=document.getElementById("kit-edit-mov-qty"),r=document.getElementById("kit-edit-mov-nota");c&&(c.innerHTML=`<span class="kit-mov-badge ${a(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${a(o.mat)}</strong>`),l&&(l.value=o.qty),r&&(r.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>r&&r.focus(),80)}function wt(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function pi(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);wt();let{kits:e}=b(),o=e.find(d=>d.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(d=>d.id===n);if(s===-1)return;let c=o.movimenti[s],l=parseInt(document.getElementById("kit-edit-mov-qty")?.value),r=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(l)||l<=0){q("Quantit\xE0 non valida \u26A0\uFE0F");return}if(l!==c.qty){let d=l-c.qty;for(let m of o.sezioni||[]){let f=(m.componenti||[]).find(g=>g.id===c.cid);if(f){c.tipo==="carico"?f.caricato=Math.max(0,(parseInt(f.caricato)||0)+d):f.caricato=Math.max(0,(parseInt(f.caricato)||0)-d);break}}}o.movimenti[s]={...c,qty:l,nota:r},M(e),E===i&&T(),q("Movimento aggiornato \u2713")}function ui(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(r=>(Number.parseInt(n.pronti?.[r.id],10)||0)>0)){q("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(r=>(Number.parseInt(n.pronti?.[r.id],10)||0)>0).map(r=>{let d=Number.parseInt(n.pronti?.[r.id],10)||0,m=ht(n,r.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${a(r.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${a(r.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${d}</span>
                    </span>
                </label>`}).join(""));let c=document.getElementById("kit-sped-nota-"+t),l=document.getElementById("kit-sped-modal-nota");l&&c&&(l.value=c.value||""),l&&!c&&(l.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function It(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function gi(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;It();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(d=>d.dataset.said);if(!n.length)return;let{kits:e}=b(),o=e.find(d=>d.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),c=[],l=[];for(let d of n){let m=(o.sottoAssembly||[]).find(g=>g.id===d);if(!m)continue;let f=Number.parseInt(o.pronti?.[d],10)||0;if(f){c.push({saId:d,nome:m.nome,qty:f});for(let g of o.sezioni||[])for(let v of g.componenti||[]){if(N(v))continue;let h=B(v,m.varianteKey);if(!h)continue;let z=f*h;v.caricato=Math.max(0,(parseInt(v.caricato)||0)-z);let w=l.find(L=>L.cid===v.id);w?w.qty+=z:l.push({cid:v.id,mat:v.nome,qty:z})}o.pronti||(o.pronti={}),delete o.pronti[d]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:c,righe:l,nota:s,ts:st()}),M(e);let r=c.reduce((d,m)=>d+m.qty,0);q(`Spedizione registrata: ${r} pz \u2713`),E===i&&T()}function ki(t){let{kits:i}=b(),n=i.find(c=>c.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let c=n.sottoAssembly||[];o.innerHTML=c.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':c.map(l=>{let r=ht(n,l.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${a(l.nome)} <span class="kit-sped-var-pill">${r}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(l.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${a(l.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${a(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(l.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),at(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function St(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function vi(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&at(e.dataset.kitId)}function at(t){let{kits:i}=b(),n=i.find(c=>c.id===t);if(!n)return;let e={};for(let c of n.sottoAssembly||[]){let l=document.getElementById("kit-reso-qty-"+c.id),r=Number.parseInt(l?.value,10)||0;if(r)for(let d of n.sezioni||[])for(let m of d.componenti||[]){if(N(m))continue;let f=B(m,c.varianteKey);f&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+r*f})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,c])=>c.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([c,{mat:l,qty:r}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${a(c)}" data-qty="${r}" checked>
            <span class="kit-reso-bom-mat">${a(l)}</span>
            <span class="kit-reso-bom-qty">+${r}</span>
        </label>`).join("")}function yi(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=b(),e=n.find(d=>d.id===i);if(!e)return;let o=[];for(let d of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+d.id)?.value,10)||0;m>0&&o.push({saId:d.id,nome:d.nome,qty:m})}if(!o.length){q("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],c=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(d=>{let m=d.dataset.cid,f=Number.parseInt(d.dataset.qty,10),g=[...e.sezioni||[]].flatMap(v=>v.componenti||[]).find(v=>v.id===m)?.nome||"?";d.checked?s.push({cid:m,mat:g,qty:f}):c.push({cid:m,mat:g,qty:f})});for(let d of s)for(let m of e.sezioni||[]){let f=(m.componenti||[]).find(g=>g.id===d.cid);if(f){f.caricato=(parseInt(f.caricato)||0)+d.qty;break}}let l=(document.getElementById("kit-reso-nota")?.value||"").trim(),r=o.reduce((d,m)=>d+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:c,nota:l,ts:st(),totPz:r}),M(n),St(),q(`Reso registrato: ${r} pz \u2014 ${s.length} comp. recuperati \u2713`),E===i&&T()}function bi(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=b();tt({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(Y,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function hi(){let{kits:t}=b(),i={id:_(),nome:"Nuovo Kit",schemaVersion:gt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};t.push(i),M(t),At(i.id)}function At(t){ct=t,R="info",Q()}function rt(t,i,n=""){let{kits:e}=b(),o=e.find(l=>l.id===t),s=e.find(l=>l.id!==t&&(l.sezioni||[]).length),c=o?.sezioni?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?c:s?.sezioni?.[0]?.id||""),targetKitIds:[]}}function Mt(t){y=rt(t,"import"),O(!0)}function zi(t,i){y=rt(t,"copy",i),O(!0)}function W(){let t=document.getElementById("modal-kit-import");y=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function $i(t){if(!y||t!=="import"&&t!=="copy"||y.mode===t)return;let i=y.currentKitId,n=t==="copy"?y.sectionId:"";y=rt(i,t,n),O()}function Ci(t){y&&(y.search=String(t||""),O())}function _i(t){if(!y)return;let{kits:i}=b(),n=i.find(e=>e.id===t);y.sourceKitId=t,y.sectionId=n?.sezioni?.[0]?.id||"",O()}function wi(t){y&&(y.sectionId=t,O())}function Ii(t,i){if(!y||y.mode!=="copy")return;let n=new Set(y.targetKitIds||[]);i?n.add(t):n.delete(t),y.targetKitIds=[...n],O()}function Si(){if(!y||y.mode!=="copy")return;let{kits:t}=b(),i=t.filter(e=>e.id!==y.currentKitId&&et(e.nome,y.search)),n=new Set(y.targetKitIds||[]);for(let e of i)n.add(e.id);y.targetKitIds=[...n],O()}function Ai(){!y||y.mode!=="copy"||(y.targetKitIds=[],O())}function O(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!y)return;let{kits:n}=b(),e=y,o=n.find(p=>p.id===e.currentKitId);if(!o){W();return}let s=n.filter(p=>p.id!==o.id&&(p.sezioni||[]).length);e.mode==="import"&&!s.some(p=>p.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(p=>p!==o.id&&n.some(C=>C.id===p)));let c=n.find(p=>p.id===e.sourceKitId)||null,l=c?.sezioni||[];l.some(p=>p.id===e.sectionId)||(e.sectionId=l[0]?.id||"");let r=kt(c,e.sectionId),d=s.filter(p=>et(p.nome,e.search)),m=n.filter(p=>p.id!==o.id&&et(p.nome,e.search)),f=document.getElementById("kit-import-subtitle"),g=document.getElementById("kit-import-search"),v=document.getElementById("kit-import-left-title"),h=document.getElementById("kit-import-right-title"),z=document.getElementById("kit-import-kit-list"),w=document.getElementById("kit-import-section-list"),L=document.getElementById("kit-import-target-wrap"),D=document.getElementById("kit-import-target-list"),H=document.getElementById("kit-import-preview"),P=document.getElementById("kit-import-confirm-btn"),G=document.getElementById("kit-import-mode-import"),u=document.getElementById("kit-import-mode-copy");if(!f||!g||!v||!h||!z||!w||!L||!D||!H||!P||!G||!u)return;G.classList.toggle("kit-import-mode-btn--active",e.mode==="import"),u.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),g.value=e.search,e.mode==="import"?(f.textContent=`Importa una sezione esistente dentro "${o.nome}".`,g.placeholder="Cerca kit sorgente\u2026",v.textContent="Kit sorgente",h.textContent=c?`Sezioni di ${c.nome}`:"Sezione",L.style.display="none",z.innerHTML=d.length?d.map(p=>{let C=p.id===e.sourceKitId;return`<label class="kit-import-option ${C?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${C?"checked":""}
                           onchange="_kitCfgSelectImportSource('${a(p.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(p.nome)}</span>
                        <span class="kit-import-option-meta">${(p.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(f.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,g.placeholder="Cerca kit destinazione\u2026",v.textContent="Kit sorgente",h.textContent="Sezione da copiare",L.style.display="flex",z.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${a(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,D.innerHTML=m.length?m.map(p=>{let C=(e.targetKitIds||[]).includes(p.id),x=r?U(o,p):null,S=`${(p.sezioni||[]).length} sezioni`;return x&&(x.hasTargetVarianti?x.needsReview?S=`${x.exactMatches}/${x.targetCount} combinazioni allineate`:S=`${x.targetCount}/${x.targetCount} combinazioni allineate`:S="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${C?"kit-import-option--active":""}">
                    <input type="checkbox" ${C?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${a(p.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(p.nome)}</span>
                        <span class="kit-import-option-meta">${a(S)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),w.innerHTML=l.length?l.map(p=>{let C=p.id===e.sectionId;return`<label class="kit-import-option ${C?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${C?"checked":""}
                       onchange="_kitCfgSelectImportSection('${a(p.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(p.nome)}</span>
                    <span class="kit-import-option-meta">${(p.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessuna sezione disponibile.</div>';let I=!1,K="kit-cfg-help kit-import-preview",k="";if(e.mode==="import"){if(!c)k="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!r)k="Seleziona una sezione da importare nel kit corrente.";else{let p=U(c,o);I=!0,k=`La sezione <strong>${a(r.nome)}</strong> verr\xE0 importata in <strong>${a(o.nome)}</strong>. `,p.hasTargetVarianti?p.needsReview?(K="kit-cfg-warn kit-import-preview",k+=`${p.exactMatches} combinazioni su ${p.targetCount} risultano allineate: controlla i coefficienti importati.`):k+=`Tutte le ${p.targetCount} combinazioni del kit destinazione risultano allineate.`:(K="kit-cfg-warn kit-import-preview",k+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}P.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else{let p=n.filter(C=>(e.targetKitIds||[]).includes(C.id));if(!r)k="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!p.length)k="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{I=!0;let C=p.filter(x=>U(o,x).needsReview).length;k=`La sezione <strong>${a(r.nome)}</strong> verr\xE0 copiata in <strong>${p.length}</strong> kit.`,C>0?(K="kit-cfg-warn kit-import-preview",k+=` <strong>${C}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):k+=" Le combinazioni risultano allineate su tutti i kit selezionati."}P.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}H.className=K,H.innerHTML=k,P.disabled=!I,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let p=document.getElementById("kit-import-search");p&&p.focus()},40))}function Mi(){if(!y)return;let{kits:t}=b(),i=y,n=t.find(r=>r.id===i.currentKitId),e=t.find(r=>r.id===i.sourceKitId),o=kt(e,i.sectionId);if(!n||!e||!o){q("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import"){let r=U(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(ft(o,e,n)),M(t),W(),Q();let d="";r.hasTargetVarianti?r.needsReview&&(d=" Controlla le quantit\xE0 sulle combinazioni non allineate."):d=" Definisci poi gli assi del kit per rifinire i coefficienti.",q(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${d}`);return}let s=t.filter(r=>(i.targetKitIds||[]).includes(r.id)&&r.id!==n.id);if(!s.length){q("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let c=0;for(let r of s)U(e,r).needsReview&&(c+=1),r.sezioni=r.sezioni||[],r.sezioni.push(ft(o,e,r));M(t),W(),Q();let l="";c>0&&(l=` ${c} kit richiedono un controllo delle quantit\xE0.`),q(`Sezione "${o.nome}" copiata in ${s.length} kit \u2713${l}`)}function Q(){let{kits:t}=b(),i=t.find(u=>u.id===ct);if(!i){V();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=A(i);R==="sezioni"&&(R="bom");let s=["info","varianti","bom","sa"],c={info:"Info",varianti:"Assi di configurazione",bom:"Componenti e materiali",sa:"Parti tracciabili"},l=e.length,r=o.length,d=(i.sezioni||[]).reduce((u,I)=>u+(I.componenti||[]).length,0),m=(i.sottoAssembly||[]).length,f=r?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-sliders"></i>
                <div><strong>${l}</strong> ass${l===1?"e":"i"} di configurazione e <strong>${r}</strong> combinazioni attive</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div>
                    ${o.slice(0,8).map(u=>`<span class="kit-cfg-sa-var-badge">${a(u.nome)}</span>`).join(" ")}
                    ${o.length>8?`<span class="kit-cfg-sa-count">+${o.length-8} altre</span>`:""}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${d}</strong> componenti in <strong>${(i.sezioni||[]).length}</strong> sezioni</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-hammer"></i>
                <div><strong>${m}</strong> parti tracciabili per il tab Pronti</div>
            </div>
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Assi di configurazione</strong> per definire le scelte che cambiano il prodotto, ad esempio <strong>LED</strong> e <strong>Lente</strong>.</div>',g=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${a(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${a(i.id)}',this.value)">
        </div>
        ${f}
        <div class="kit-cfg-danger">
            <button class="kit-btn-danger" onclick="_kitElimina('${a(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,v=e.map((u,I)=>{let K=(u.opzioni||[]).map((k,p)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input kit-cfg-input-small" value="${a(k.key)}" maxlength="20" placeholder="codice"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(u.id)}','${a(k.id)}','key',this.value)">
                <input class="kit-cfg-input" value="${a(k.nome)}" maxlength="50" placeholder="nome opzione"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(u.id)}','${a(k.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${a(i.id)}','${a(u.id)}','${a(k.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${I}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(u.nome)}" maxlength="40" placeholder="Nome asse (es. LED)"
                       onchange="_kitCfgUpdateAsse('${a(i.id)}','${a(u.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-small" value="${a(u.key)}" maxlength="20" placeholder="codice"
                       onchange="_kitCfgUpdateAsse('${a(i.id)}','${a(u.id)}','key',this.value)">
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${a(i.id)}','${a(u.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Ogni opzione di questo asse verr\xE0 combinata con le opzioni degli altri assi.</div>
            ${K||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${a(i.id)}','${a(u.id)}')"><i class="fas fa-plus"></i> Aggiungi opzione</button>
        </div>`}).join(""),h=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Combinazioni generate automaticamente</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(u=>`<span class="kit-cfg-sa-var-badge" title="${a(u.key)}">${a(u.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",z=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Gli <strong>assi di configurazione</strong> descrivono le scelte indipendenti del prodotto.<br>
                Per Shinino puoi creare per esempio <strong>LED</strong> e <strong>Lente</strong>: il sistema genera da solo tutte le combinazioni.<br>
                Se hai un solo asse, il comportamento resta identico ai vecchi kit lineari.
            </div>
            ${v||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun asse ancora. Aggiungi il primo asse per iniziare.</div>'}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi asse</button>
            ${h}
        </div>`,w=(i.sezioni||[]).map((u,I)=>{let K=(u.componenti||[]).map(k=>{let p=N(k),C=X(k),x=o.map(S=>{let lt=S.nome.length>18?S.nome.substring(0,16)+"\u2026":S.nome,dt=B(k,S.key);return p?`<label class="kit-meta-pill" title="${a(S.nome)}">
                        <input type="checkbox" ${dt>0?"checked":""}
                               onchange="_kitCfgUpdateComp('${a(i.id)}','${a(u.id)}','${a(k.id)}','flag','${a(S.key)}',this.checked ? 1 : 0)">
                        ${a(lt)}
                    </label>`:`<label class="kit-cfg-var-field" title="${a(S.nome)}">
                    <span class="kit-cfg-label" style="margin:0">${a(lt)}</span>
                    <input class="kit-cfg-coeff" type="number" min="0" value="${dt}"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(u.id)}','${a(k.id)}','coeff','${a(S.key)}',this.value)">
                </label>`}).join("");return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${a(k.nome)}" maxlength="60" placeholder="es. Star led"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(u.id)}','${a(k.id)}','nome','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(u.id)}','${a(k.id)}','modo','',this.value)">
                        <option value="quantificato" ${p?"":"selected"}>Quantificato nel BOM</option>
                        <option value="segnalazione" ${p?"selected":""}>Solo segnalazione</option>
                    </select>
                    <label class="kit-meta-pill" title="Movimentabile a magazzino">
                        <input type="checkbox" ${C?"checked":""} ${p?"disabled":""}
                               onchange="_kitCfgToggleCompTracked('${a(i.id)}','${a(u.id)}','${a(k.id)}',this.checked)">
                        Magazzino
                    </label>
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${a(i.id)}','${a(u.id)}','${a(k.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <input class="kit-cfg-input" value="${a(k.noteConfig||"")}" maxlength="100" placeholder="Nota configurazione (es. presente solo se c'\xE8 il driver)"
                       onchange="_kitCfgUpdateComp('${a(i.id)}','${a(u.id)}','${a(k.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${p?"Usa i flag per indicare dove il requisito va mostrato senza entrare nei calcoli di stock o fabbisogno.":"Inserisci la quantit\xE0 per ciascuna combinazione. Usa 0 dove il componente non serve e 1 per gli optional/fissi presenti."}
                </div>
                <div class="kit-cfg-row" style="align-items:flex-start">${x||'<span class="kit-cfg-sa-empty">Configura prima almeno un asse con opzioni.</span>'}</div>
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${I}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(u.nome)}" maxlength="40" placeholder="Nome sezione (es. TESTA)"
                       onchange="_kitCfgUpdateSez('${a(i.id)}','${a(u.id)}','nome',this.value)">
                <button class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${a(i.id)}','${a(u.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${a(i.id)}','${a(u.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${K}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${a(i.id)}','${a(u.id)}')"><i class="fas fa-plus"></i> Aggiungi componente</button>
        </div>`}).join(""),L=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci il <strong>BOM reale</strong> del prodotto.<br>
                Usa <strong>Quantificato nel BOM</strong> per i materiali che entrano nei conti di fabbisogno e magazzino.<br>
                Usa <strong>Solo segnalazione</strong> per requisiti come la resina: il sistema li mostra ma non li movimenta.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>'}
            ${w}
            <div class="kit-cfg-row">
                <button class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi sezione</button>
                <button class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${a(i.id)}')"><i class="fas fa-copy"></i> Importa da altro kit</button>
            </div>
        </div>`,D="";o.length?D=o.map(u=>{let I=(i.sottoAssembly||[]).map((k,p)=>({sa:k,i:p})).filter(({sa:k})=>k.varianteKey===u.key),K=I.map(({sa:k,i:p})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${a(k.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${a(i.id)}',${p},'nome',this.value)">
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${a(i.id)}',${p})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${a(u.nome)}</span>
                    <span class="kit-cfg-sa-count">${I.length} part${I.length!==1?"i":"e"}</span>
                </div>
                ${K||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${a(i.id)}','${a(u.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${a(u.nome)}</button>
            </div>`}).join(""):D='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let H=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${D}
        </div>`,P={info:g,varianti:z,bom:L,sa:H},G=s.map(u=>`<button class="kit-tab ${R===u?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${u}')">${c[u]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${a(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${a(i.nome)}</span>
        </div>
        <div class="kit-tabs">${G}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${P[R]}</div>
    </div>`,J(n)}function Ei(t){if(t&&E===t){T();return}E=t,T()}function qi(t){R=t,Q()}function $(t,i,n=!0){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(i(o),M(e),n&&Q())}function xi(t,i){$(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Ni(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=b();M(i.filter(n=>n.id!==t)),ct=null,E=null,V()}function Et(t){$(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:_(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:_(),key:"opz1",nome:"Opzione 1"}]})})}function Ki(t,i,n,e){$(t,function(o){let s=(o.assiConfigurazione||[]).find(c=>c.id===i);s&&(n==="key"?s.key=F(e,s.key||"asse"):s[n]=e.trim())})}function Ti(t,i){$(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function Oi(t,i){$(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:_(),key:"opz"+o,nome:"Opzione "+o})})}function Bi(t,i,n,e,o){$(t,function(s){let c=(s.assiConfigurazione||[]).find(r=>r.id===i),l=c&&(c.opzioni||[]).find(r=>r.id===n);l&&(e==="key"?l.key=F(o,l.key||"opzione"):l[e]=o.trim())})}function Li(t,i,n){$(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function Di(t){Et(t)}function Pi(t){$(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:_(),nome:"Nuova sezione",componenti:[]})})}function Ri(t){Mt(t)}function Vi(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(c=>c.id===i);s&&(s[n]=e.trim())},!1)}function Hi(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&$(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function ji(t,i){$(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:_(),nome:"Nuovo componente",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function Ui(t,i,n,e,o,s){$(t,function(c){let l=(c.sezioni||[]).find(d=>d.id===i),r=l&&(l.componenti||[]).find(d=>d.id===n);if(r){if(e==="coeff"||e==="flag"){r.qtaPerVariante=r.qtaPerVariante||{},r.qtaPerVariante[o]=Math.max(0,Number.parseInt(s,10)||0);return}if(e==="modo"){r.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",r.modoComponente==="segnalazione"?(r.tracciabile=!1,r.unitaMisura="flag"):r.unitaMisura==="flag"&&(r.unitaMisura="pz");return}r[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function Qi(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(l=>l.id===i),c=s&&(s.componenti||[]).find(l=>l.id===n);!c||N(c)||(c.tracciabile=!!e)},!1)}function Fi(t,i,n){$(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function Gi(t){$(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:_(),nome:"",varianteKey:A(i)[0]?.key||""})})}function Ji(t,i){$(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:_(),nome:"",varianteKey:i,noteConfig:""})})}function Yi(t,i,n,e){$(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function Wi(t,i){$(t,function(n){n.sottoAssembly.splice(i,1)})}function oe(){window._kitOpenView=Zt,window._kitOpenConfig=At,window._kitNuovoKit=hi,window._kitBack=ti,window._kitSwitchTab=ii,window._kitAggiornaQty=ei,window._kitOrdineSet=ni,window._kitOrdineDelta=oi,window._kitOrdineReset=si,window._kitAggiornaCar=$t,window._kitAggiornaPronti=ai,window._kitSetPronti=ci,window._kitApriModalSped=ui,window._kitChiudiModalSped=It,window._kitConfermaSpedizione=gi,window._kitApriModalReso=ki,window._kitChiudiModalReso=St,window._kitResoQtyChange=vi,window._kitResoAggiornaBOM=at,window._kitConfermaReso=yi,window._kitSalvaMovimento=li,window._kitEliminaMovimento=di,window._kitModificaMovimento=fi,window._kitChiudiModalEditMov=wt,window._kitConfermaModificaMov=pi,window._kitChiudiModalDelMov=Ct,window._kitConfermaEliminaMov=_t,window._kitSalvaManuale=bi,window._kitElimina=Ni,window._kitCfgBack=Ei,window._kitCfgSwitchTab=qi,window._kitCfgSaveNome=xi,window._kitCfgAddVar=Di,window._kitCfgOpenImportModal=Mt,window._kitCfgOpenCopySezModal=zi,window._kitCfgCloseImportModal=W,window._kitCfgSetImportMode=$i,window._kitCfgSetImportSearch=Ci,window._kitCfgSelectImportSource=_i,window._kitCfgSelectImportSection=wi,window._kitCfgToggleImportTarget=Ii,window._kitCfgSelectAllImportTargets=Si,window._kitCfgClearImportTargets=Ai,window._kitCfgConfirmImport=Mi,window._kitCfgAddAsse=Et,window._kitCfgUpdateAsse=Ki,window._kitCfgDelAsse=Ti,window._kitCfgAddOpzione=Oi,window._kitCfgUpdateOpzione=Bi,window._kitCfgDelOpzione=Li,window._kitCfgAddSez=Pi,window._kitCfgImportSez=Ri,window._kitCfgUpdateSez=Vi,window._kitCfgDelSez=Hi,window._kitCfgAddComp=ji,window._kitCfgUpdateComp=Ui,window._kitCfgToggleCompTracked=Qi,window._kitCfgDelComp=Fi,window._kitCfgAddSA=Gi,window._kitCfgAddSAForVariant=Ji,window._kitCfgUpdateSA=Yi,window._kitCfgDelSA=Wi}var nt,Y,ut,gt,it,pt,E,zt,ct,R,y,se,Xi=qt(()=>{xt();Kt();Tt();Nt();nt="_mlKitData",Y="_mlKitDataTs",ut="_mlKitOrderDrafts",gt=2,it=!1;pt=null;E=null,zt="ordine";ct=null,R="info",y=null;se=V});Xi();export{V as caricaKitProdotti,se as default,oe as registerGlobals,ne as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-AHSVAQUO.js.map
