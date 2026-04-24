import{a as Lt,c as ut,e as Rt,f as c,g as S,h as X,l as Vt,m as Q,q as Pt,r as it,u as Dt}from"./chunk-chunk-MVGUZ3SY.js";function ve(){et=!1}function W(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function jt(t,i){let n="opz"+(i+1),e=W(t?.key,n);return{id:String(t?.id||w()),key:e,nome:String(t?.nome||e).trim()||e}}function Ht(t,i){let n="asse"+(i+1),e=W(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,a)=>jt(s,a)).filter(Boolean):[];return{id:String(t?.id||w()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function bt(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function Ut(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function Qt(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let a of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:a.id,opzioneKey:a.key,opzioneNome:a.nome})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:bt(e.selections),nome:Ut(e.selections),selections:e.selections}})}function Ft(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||w()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:String(t?.unitaMisura||e).trim()||"pz",applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:Math.max(0,Number.parseInt(t?.qtaBase,10)||0)}}function Gt(t){return{id:String(t?.id||w()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(Ft):[]}}function Jt(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function zt(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:Math.max(0,Number.parseInt(t?.qtaBase,10)||0)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||Math.max(0,Number.parseInt(Object.values(t?.qtaPerVariante||{})[0],10)||0)};let e=_(i);if(!e.length)return n;let o=e.filter(r=>N(t,r.key)>0);if(!o.length)return n;let s=new Set(o.map(r=>N(t,r.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(r=>N(t,r.key)))};let a=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:a};let l=new Set(o.map(r=>r.key));for(let r of i.assiConfigurazione||[]){let d=[];for(let p of r.opzioni||[]){let g=new Set(e.filter(v=>(v.selections||[]).some(h=>h.asseId===r.id&&h.opzioneId===p.id)).map(v=>v.key));if(!g.size)continue;[...g].every(v=>N(t,v)===a)&&d.push(p.id)}if(!d.length)continue;let f=new Set(e.filter(p=>(p.selections||[]).some(g=>g.asseId===r.id&&d.includes(g.opzioneId))).map(p=>p.key));if(Jt(f,l))return{tipo:"gruppo",asseId:r.id,opzioneIds:d,qtyBase:a}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:a}}function st(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=Math.max(0,Number.parseInt(n.qtyBase,10)||0);if(!o)return e;for(let s of _(i)){let a=n.tipo==="sempre";n.tipo==="gruppo"&&(a=(s.selections||[]).some(l=>l.asseId===n.asseId&&n.opzioneIds.includes(l.opzioneId))),a&&(e[s.key]=o)}return e}function Wt(t,i){let n=Gt(t);return n.componenti=n.componenti.map(function(e){let o=zt(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:st(e,i,o)}}),n}function Yt(t,i){let n=_(i);if(!n.length)return null;let e=null;for(let o of n){let s=N(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function Xt(t,i,n){let e=_(n),o={},s=Yt(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let a of e){let r=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},a.key)?N(t,a.key):s!==null?s:0;r>0&&(o[a.key]=r)}return{id:w(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:at(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:String(t?.unitaMisura||(B(t)?"flag":"pz")).trim()||"pz"}}function gt(t,i,n){return{id:w(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>Xt(e,i,n)):[]}}function ht(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function G(t,i){let n=new Set(_(t).map(s=>s.key)),e=_(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function nt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function Zt(t,i){return{id:String(t?.id||w()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function Ct(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(p,g){let m="v"+(g+1),v=W(p?.key,m);return{id:String(p?.id||w()),key:v,nome:String(p?.nome||v).trim()||v}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((p,g)=>Ht(p,g)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(p){return{id:p.id,key:p.key,nome:p.nome}})}]:[],s=Qt(o),a=s.length?s:n,l=new Set(a.map(p=>p.key)),r={};Object.entries(i.qtaDaProdurre||{}).forEach(function(p){l.has(p[0])&&(r[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0))});for(let p of a)r[p.key]===void 0&&(r[p.key]=0);let d=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(p=>Zt(p,a[0]?.key||"")).filter(p=>!p.varianteKey||l.has(p.varianteKey)):[],f={};return Object.entries(i.pronti||{}).forEach(function(p){f[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0)}),{id:String(i.id||w()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:yt,assiConfigurazione:o,varianti:a,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(p=>Wt(p,{assiConfigurazione:o,varianti:a})):[],sottoAssembly:d,qtaDaProdurre:r,pronti:f,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function _(t){return Array.isArray(t?.varianti)?t.varianti:[]}function B(t){return!!t&&t.modoComponente==="segnalazione"}function at(t){return!!t&&t.tracciabile!==!1&&!B(t)}function N(t,i){let n=Number.parseInt(t?.qtaPerVariante?.[i],10)||0;return B(t)?n>0?1:0:n}function rt(t,i){return zt(t,i)}function $t(){try{let t=localStorage.getItem(vt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function ti(t){try{localStorage.setItem(vt,JSON.stringify(t||{}))}catch{}}function It(t){let i=$t(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of _(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e}function j(t,i){let{kits:n}=b(),e=n.find(r=>r.id===t);if(!e)return;let o=$t(),s=It(e);i(s,e);let a={},l=!1;for(let r of _(e)){let d=Math.max(0,Number.parseInt(s[r.key],10)||0);a[r.key]=d,d>0&&(l=!0)}l?o[t]=a:delete o[t],ti(o),A===t&&K()}function ii(t){return Object.values(t||{}).reduce((i,n)=>i+(Number.parseInt(n,10)||0),0)}function ct(t){let i=F[t.id]&&typeof F[t.id]=="object"?F[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return F[t.id]=n,n}function _t(t,i){let n=t.assiConfigurazione||[];if(!n.length)return _(t)[0]||null;let e=[];for(let s of n){let a=i?.[s.id],l=(s.opzioni||[]).find(r=>r.id===a);if(!l)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:l.id,opzioneKey:l.key,opzioneNome:l.nome})}let o=bt(e);return _(t).find(s=>s.key===o)||null}function ei(t,i){let n=_(t).filter(s=>(Number.parseInt(i?.[s.key],10)||0)>0),e=[],o=[];for(let s of t.sezioni||[]){let a=[];for(let l of s.componenti||[]){let r=0,d=[];for(let p of n){let g=Number.parseInt(i?.[p.key],10)||0,m=N(l,p.key);!g||!m||(B(l)?r+=g:r+=g*m,d.push({nome:p.nome,pezziOrdine:g,coeff:m}))}if(!d.length)continue;let f=d.length===1?d[0].nome:d.length+" configurazioni";if(B(l)){o.push({id:"alert-"+l.id,tipo:"alert",nome:l.nome,dettaglio:l.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:r,variantiLabel:f});continue}a.push({id:l.id,nome:l.nome,totale:r,unita:l.unitaMisura||"pz",dettaglio:f,noteConfig:l.noteConfig||""}),l.noteConfig&&o.push({id:"note-"+l.id,tipo:"nota",nome:l.nome,dettaglio:l.noteConfig,totaleCoinvolto:r,variantiLabel:f})}a.length&&e.push({id:s.id,nome:s.nome,righe:a})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:ii(i),totaleRighe:e.reduce((s,a)=>s+a.righe.length,0)}}function b(){try{let t=localStorage.getItem(ot);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(Ct):[]}}catch{return{kits:[]}}}function M(t){let i=Array.isArray(t)?t.map(Ct):[];try{localStorage.setItem(ot,JSON.stringify({kits:i})),localStorage.setItem(Z,Date.now())}catch{}ni(i)}function ni(t){clearTimeout(kt),kt=setTimeout(function(){it({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function oi(t){fetch(ut,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(Z)||0);if(n>0&&n>e){try{localStorage.setItem(ot,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(Z,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function w(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function lt(){if(!Q||!Q.nome)return!1;let t=String(Q.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||Q.ruolo==="MASTER"}function si(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(B(e)){i[e.id]=0;continue}let o=0;for(let[s,a]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(a,10)||0)*N(e,s);i[e.id]=o}return i}function ai(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let a of s.componenti||[]){if(B(a))continue;let l=N(a,o);l>0&&(i[a.id]=(i[a.id]||0)+e*l)}}return i}function wt(t,i){let n=_(t).find(e=>e.key===i);return n?c(n.nome):c(i)}function dt(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function H(){et||(et=!0,oi(function(e){e&&H()}));let{kits:t}=b(),i=document.getElementById("contenitore-dati"),n=t.map(e=>{let s=_(e).length,a=(e.assiConfigurazione||[]).length,l=(e.sezioni||[]).reduce((r,d)=>r+(d.componenti||[]).length,0);return`
        <div class="kit-card" onclick="_kitOpenView('${c(e.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${c(e.nome)}</span>
                <button class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${c(e.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
            </div>
            <div class="kit-card-meta">
                <span class="kit-meta-pill"><i class="fas fa-sliders"></i> ${a} ass${a===1?"e":"i"}</span>
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
    </div>`,X(i)}function ri(t){A=t,St="ordine",K()}function K(){let{kits:t}=b(),i=t.find(m=>m.id===A);if(!i){H();return}let n=document.getElementById("contenitore-dati"),e=_(i),o=It(i),s=ei(i,o),a=s.selectedVarianti.length?s.selectedVarianti.map(m=>`<span class="kit-meta-pill"><strong>${o[m.key]||0}</strong> \xD7 ${c(m.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',l=ct(i),r=_t(i,l),d=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(m=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${c(m.nome)}</div>
                <div class="kit-compose-options">${(m.opzioni||[]).map(v=>`
                    <button class="kit-compose-option ${l[m.id]===v.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${c(i.id)}','${c(m.id)}','${c(v.id)}')">
                        ${c(v.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',f=s.selectedVarianti.length?s.selectedVarianti.map(m=>{let v=Number.parseInt(o[m.key],10)||0;return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${c(m.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(m.selections)&&m.selections.length?m.selections.map(h=>c(h.opzioneNome)).join(" \xB7 "):c(m.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${c(i.id)}','${c(m.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${v}"
                           onchange="_kitOrdineSet('${c(i.id)}','${c(m.key)}',this.value)"
                           oninput="_kitOrdineSet('${c(i.id)}','${c(m.key)}',this.value)">
                    <button class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${c(i.id)}','${c(m.key)}',1)">+</button>
                    <button class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${c(i.id)}','${c(m.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,p=s.totalePezzi?s.sezioni.map(m=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${c(m.nome)}</div>
                ${m.righe.map(v=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${c(v.nome)}</div>
                            <div class="kit-distinta-row-meta">${c(v.dettaglio)}</div>
                            ${v.noteConfig?`<div class="kit-distinta-row-note">${c(v.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${v.totale} ${c(v.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,g=s.avvisi.length?s.avvisi.map(m=>`
            <div class="kit-distinta-alert ${m.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${c(m.nome)}</div>
                <div class="kit-distinta-alert-body">${c(m.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${m.totaleCoinvolto} pz \xB7 ${c(m.variantiLabel)}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Nessun avviso particolare per l\u2019ordine attuale.</div>';n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${c(i.nome)}</span>
            <button class="kit-gear-btn-inline" onclick="_kitOpenConfig('${c(i.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Ordine in composizione</div>
                    <div class="kit-order-summary-total">${s.totalePezzi} pezzi</div>
                </div>
                <button class="kit-btn-secondary" onclick="_kitOrdineReset('${c(i.id)}')"><i class="fas fa-rotate-left"></i> Azzera ordine</button>
            </div>
            <div class="kit-order-summary-note">Questa bozza ordine resta locale sul dispositivo e serve solo per generare la distinta base di approvvigionamento.</div>
            <div class="kit-order-summary-badges">${a}</div>
        </div>

        <div class="kit-order-layout">
            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-hand-pointer"></i> Componi ordine</div>
                <div class="kit-cfg-help">Scegli i pulsanti dell'elettronica, inserisci la quantit\xE0 e aggiungi quella configurazione all'ordine.</div>
                <div class="kit-compose-builder">
                    ${d}
                    <div class="kit-compose-footer">
                        <div class="kit-compose-selected">
                            <div class="kit-compose-selected-label">Configurazione pronta</div>
                            <div class="kit-compose-selected-name">${r?c(r.nome):"Completa prima tutte le scelte"}</div>
                        </div>
                        <div class="kit-order-stepper">
                            <input class="kit-order-stepper-input" id="kit-compose-qty-${c(i.id)}" type="number" min="1" value="1">
                            <button class="kit-spedisci-btn" onclick="_kitComposeAdd('${c(i.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
                        </div>
                    </div>
                </div>
                <div class="kit-order-lines">${f}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${s.totaleRighe} righe materiali \xB7 ${s.avvisi.length} avvisi</div>
                ${p}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${g}
            </section>
        </div>
    </div>`,X(n)}function ci(){A=null,H()}function li(t){St=t,K()}function di(t){j(t,function(i,n){for(let e of _(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function pi(t,i,n){j(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function fi(t,i,n){j(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function mi(t){j(t,function(i){for(let n of Object.keys(i))i[n]=0})}function ui(t,i){j(t,function(n){n[i]=0})}function gi(t,i,n){let{kits:e}=b(),o=e.find(a=>a.id===t);if(!o)return;let s=ct(o);s[i]=n,F[t]=s,A===t&&K()}function ki(t){let{kits:i}=b(),n=i.find(a=>a.id===t);if(!n)return;let e=_t(n,ct(n));if(!e){S("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){S("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}j(t,function(a){a[e.key]=(Number.parseInt(a[e.key],10)||0)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function At(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=b(),s=o.find(q=>q.id===A);if(!s)return;let a=(s.sezioni||[]).find(q=>q.id===n),l=a&&(a.componenti||[]).find(q=>q.id===i);if(!l||!at(l))return;l.caricato=e,M(o);let d=si(s)[i]||0,f=Math.max(0,d-e),g=ai(s)[i]||0,m=t.closest("tr");if(!m)return;let v=m.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");v&&(v.textContent=d===0?"\u2014":f,v.className=d===0?"kit-ord-zero":f>0?"kit-ord-manca":"kit-ord-ok");let h=m.querySelector(".kit-car-liberi");h&&(g>0?(h.textContent=Math.max(0,e-g)+" lib.",h.style.display=""):h.style.display="none")}function vi(t,i,n){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),M(e),A===t&&K())}function yi(t,i,n){let{kits:e}=b(),o=e.find(a=>a.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),M(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function bi(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button class="kit-mov-del" onclick="_kitEliminaMovimento('${c(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button class="kit-mov-edit" onclick="_kitModificaMovimento('${c(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let a=(e.righe||[]).reduce((d,f)=>d+f.qty,0),l=(e.righe||[]).map(d=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${c(d.mat)}</span><span class="kit-mov-qty scarico">\u2212${d.qty}</span></div>`).join(""),r=(e.items||[]).map(d=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${c(d.nome)}</span><span class="kit-mov-qty scarico">\xD7${d.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${a} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${c(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${r}<div class="kit-sped-bom-divider">componenti scaricati</div>${l}</div>
            </details>`}if(e.tipo==="reso"){let a=e.totPz||0,l=(e.items||[]).map(f=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${c(f.nome)}</span><span class="kit-mov-qty carico">\xD7${f.qty}</span></div>`).join(""),r=(e.righe||[]).map(f=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${c(f.mat)}</span><span class="kit-mov-qty carico">+${f.qty}</span></div>`).join(""),d=(e.scartate||[]).map(f=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${c(f.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${f.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\u{1F4E6} Rientro \xD7${a} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${c(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">
                ${l}
                ${r?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${r}`:""}
                ${d?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${d}`:""}
              </div>
            </details>`}return`<div class="kit-mov-item ${c(e.tipo)}">
            <span class="kit-mov-badge ${c(e.tipo)}">${e.tipo==="carico"?"CARICO":"SCARICO"}</span>
            <span class="kit-mov-mat">${c(e.mat)}</span>
            <span class="kit-mov-qty ${c(e.tipo)}">${e.tipo==="carico"?"+":"\u2212"}${e.qty}</span>
            ${e.nota?`<span class="kit-mov-nota">${c(e.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${e.ts}</span>
            ${s}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function zi(t,i){let{kits:n}=b(),e=n.find(h=>h.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),a=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let l=o.value,r=o.options[o.selectedIndex]?.dataset.sid,d=Math.max(1,Number.parseInt(s.value,10)||1),f=(a?.value||"").trim(),p=(e.sezioni||[]).find(h=>h.id===r),g=p&&(p.componenti||[]).find(h=>h.id===l);if(!g||!at(g))return;i==="carico"?g.caricato=(parseInt(g.caricato)||0)+d:g.caricato=Math.max(0,(parseInt(g.caricato)||0)-d),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:l,sid:r,tipo:i,qty:d,nota:f,mat:g.nome,ts:dt()}),M(n),s&&(s.value=1),a&&(a.value="");let m=document.getElementById("kit-mov-list-"+t);m&&(m.innerHTML=bi(e,lt()));let v=document.querySelector(`#kit-tbody-${t} input[data-cid="${l}"]`);v&&(v.value=g.caricato,At(v))}function hi(t,i){if(!lt())return;let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&Ci(t,i,o)}function Ci(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((r,d)=>r+d.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let l=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${c(n.tipo)}" style="font-size:.75rem">${l}</span> <strong>${c(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let a=document.getElementById("btn-kit-del-ok");a&&(a.onclick=()=>Mt(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function qt(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Mt(t,i){qt();let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(a=>a.id===o.sid);for(let a of o.righe||[])for(let l of e.sezioni||[]){let r=(l.componenti||[]).find(d=>d.id===a.cid||d.nome===a.mat);r&&(r.caricato=(parseInt(r.caricato)||0)+a.qty)}for(let a of o.items||[])a.saId&&e.pronti&&(e.pronti[a.saId]=(parseInt(e.pronti[a.saId])||0)+a.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let a of e.sezioni||[]){let l=(a.componenti||[]).find(r=>r.id===s.cid||r.nome===s.mat);l&&(l.caricato=Math.max(0,(parseInt(l.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(l=>l.id===o.cid);a&&(a.caricato=Math.max(0,(parseInt(a.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(l=>l.id===o.cid);a&&(a.caricato=(parseInt(a.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),M(n),A===t&&K(),S("Movimento eliminato \u2713")}}function $i(t,i){if(!lt())return;let{kits:n}=b(),e=n.find(d=>d.id===t);if(!e)return;let o=(e.movimenti||[]).find(d=>d.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let a=document.getElementById("kit-edit-mov-mat"),l=document.getElementById("kit-edit-mov-qty"),r=document.getElementById("kit-edit-mov-nota");a&&(a.innerHTML=`<span class="kit-mov-badge ${c(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${c(o.mat)}</strong>`),l&&(l.value=o.qty),r&&(r.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>r&&r.focus(),80)}function Et(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ii(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);Et();let{kits:e}=b(),o=e.find(d=>d.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(d=>d.id===n);if(s===-1)return;let a=o.movimenti[s],l=parseInt(document.getElementById("kit-edit-mov-qty")?.value),r=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(l)||l<=0){S("Quantit\xE0 non valida \u26A0\uFE0F");return}if(l!==a.qty){let d=l-a.qty;for(let f of o.sezioni||[]){let p=(f.componenti||[]).find(g=>g.id===a.cid);if(p){a.tipo==="carico"?p.caricato=Math.max(0,(parseInt(p.caricato)||0)+d):p.caricato=Math.max(0,(parseInt(p.caricato)||0)-d);break}}}o.movimenti[s]={...a,qty:l,nota:r},M(e),A===i&&K(),S("Movimento aggiornato \u2713")}function _i(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(r=>(Number.parseInt(n.pronti?.[r.id],10)||0)>0)){S("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(r=>(Number.parseInt(n.pronti?.[r.id],10)||0)>0).map(r=>{let d=Number.parseInt(n.pronti?.[r.id],10)||0,f=wt(n,r.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${c(r.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${c(r.nome)} <span class="kit-sped-var-pill">${f}</span></span>
                        <span class="kit-sped-item-qty">\xD7${d}</span>
                    </span>
                </label>`}).join(""));let a=document.getElementById("kit-sped-nota-"+t),l=document.getElementById("kit-sped-modal-nota");l&&a&&(l.value=a.value||""),l&&!a&&(l.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function xt(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function wi(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;xt();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(d=>d.dataset.said);if(!n.length)return;let{kits:e}=b(),o=e.find(d=>d.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),a=[],l=[];for(let d of n){let f=(o.sottoAssembly||[]).find(g=>g.id===d);if(!f)continue;let p=Number.parseInt(o.pronti?.[d],10)||0;if(p){a.push({saId:d,nome:f.nome,qty:p});for(let g of o.sezioni||[])for(let m of g.componenti||[]){if(B(m))continue;let v=N(m,f.varianteKey);if(!v)continue;let h=p*v;m.caricato=Math.max(0,(parseInt(m.caricato)||0)-h);let q=l.find(O=>O.cid===m.id);q?q.qty+=h:l.push({cid:m.id,mat:m.nome,qty:h})}o.pronti||(o.pronti={}),delete o.pronti[d]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:a,righe:l,nota:s,ts:dt()}),M(e);let r=a.reduce((d,f)=>d+f.qty,0);S(`Spedizione registrata: ${r} pz \u2713`),A===i&&K()}function Si(t){let{kits:i}=b(),n=i.find(a=>a.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let a=n.sottoAssembly||[];o.innerHTML=a.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':a.map(l=>{let r=wt(n,l.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${c(l.nome)} <span class="kit-sped-var-pill">${r}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${c(l.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${c(l.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${c(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${c(l.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),pt(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Nt(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ai(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&pt(e.dataset.kitId)}function pt(t){let{kits:i}=b(),n=i.find(a=>a.id===t);if(!n)return;let e={};for(let a of n.sottoAssembly||[]){let l=document.getElementById("kit-reso-qty-"+a.id),r=Number.parseInt(l?.value,10)||0;if(r)for(let d of n.sezioni||[])for(let f of d.componenti||[]){if(B(f))continue;let p=N(f,a.varianteKey);p&&(e[f.id]={mat:f.nome,qty:(e[f.id]?.qty||0)+r*p})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,a])=>a.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([a,{mat:l,qty:r}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${c(a)}" data-qty="${r}" checked>
            <span class="kit-reso-bom-mat">${c(l)}</span>
            <span class="kit-reso-bom-qty">+${r}</span>
        </label>`).join("")}function qi(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=b(),e=n.find(d=>d.id===i);if(!e)return;let o=[];for(let d of e.sottoAssembly||[]){let f=Number.parseInt(document.getElementById("kit-reso-qty-"+d.id)?.value,10)||0;f>0&&o.push({saId:d.id,nome:d.nome,qty:f})}if(!o.length){S("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],a=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(d=>{let f=d.dataset.cid,p=Number.parseInt(d.dataset.qty,10),g=[...e.sezioni||[]].flatMap(m=>m.componenti||[]).find(m=>m.id===f)?.nome||"?";d.checked?s.push({cid:f,mat:g,qty:p}):a.push({cid:f,mat:g,qty:p})});for(let d of s)for(let f of e.sezioni||[]){let p=(f.componenti||[]).find(g=>g.id===d.cid);if(p){p.caricato=(parseInt(p.caricato)||0)+d.qty;break}}let l=(document.getElementById("kit-reso-nota")?.value||"").trim(),r=o.reduce((d,f)=>d+f.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:a,nota:l,ts:dt(),totPz:r}),M(n),Nt(),S(`Reso registrato: ${r} pz \u2014 ${s.length} comp. recuperati \u2713`),A===i&&K()}function Mi(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=b();it({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(Z,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function Ei(){let{kits:t}=b(),i={id:w(),nome:"Nuovo Kit",schemaVersion:yt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};t.push(i),M(t),Bt(i.id)}function Bt(t){ft=t,V="info",J()}function mt(t,i,n=""){let{kits:e}=b(),o=e.find(l=>l.id===t),s=e.find(l=>l.id!==t&&(l.sezioni||[]).length),a=o?.sezioni?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?a:s?.sezioni?.[0]?.id||""),targetKitIds:[]}}function Kt(t){y=mt(t,"import"),R(!0)}function xi(t,i){y=mt(t,"copy",i),R(!0)}function tt(){let t=document.getElementById("modal-kit-import");y=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ni(t){if(!y||t!=="import"&&t!=="copy"||y.mode===t)return;let i=y.currentKitId,n=t==="copy"?y.sectionId:"";y=mt(i,t,n),R()}function Bi(t){y&&(y.search=String(t||""),R())}function Ki(t){if(!y)return;let{kits:i}=b(),n=i.find(e=>e.id===t);y.sourceKitId=t,y.sectionId=n?.sezioni?.[0]?.id||"",R()}function Oi(t){y&&(y.sectionId=t,R())}function Ti(t,i){if(!y||y.mode!=="copy")return;let n=new Set(y.targetKitIds||[]);i?n.add(t):n.delete(t),y.targetKitIds=[...n],R()}function Li(){if(!y||y.mode!=="copy")return;let{kits:t}=b(),i=t.filter(e=>e.id!==y.currentKitId&&nt(e.nome,y.search)),n=new Set(y.targetKitIds||[]);for(let e of i)n.add(e.id);y.targetKitIds=[...n],R()}function Ri(){!y||y.mode!=="copy"||(y.targetKitIds=[],R())}function R(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!y)return;let{kits:n}=b(),e=y,o=n.find(u=>u.id===e.currentKitId);if(!o){tt();return}let s=n.filter(u=>u.id!==o.id&&(u.sezioni||[]).length);e.mode==="import"&&!s.some(u=>u.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(u=>u!==o.id&&n.some(I=>I.id===u)));let a=n.find(u=>u.id===e.sourceKitId)||null,l=a?.sezioni||[];l.some(u=>u.id===e.sectionId)||(e.sectionId=l[0]?.id||"");let r=ht(a,e.sectionId),d=s.filter(u=>nt(u.nome,e.search)),f=n.filter(u=>u.id!==o.id&&nt(u.nome,e.search)),p=document.getElementById("kit-import-subtitle"),g=document.getElementById("kit-import-search"),m=document.getElementById("kit-import-left-title"),v=document.getElementById("kit-import-right-title"),h=document.getElementById("kit-import-kit-list"),q=document.getElementById("kit-import-section-list"),O=document.getElementById("kit-import-target-wrap"),Y=document.getElementById("kit-import-target-list"),U=document.getElementById("kit-import-preview"),P=document.getElementById("kit-import-confirm-btn"),k=document.getElementById("kit-import-mode-import"),E=document.getElementById("kit-import-mode-copy");if(!p||!g||!m||!v||!h||!q||!O||!Y||!U||!P||!k||!E)return;k.classList.toggle("kit-import-mode-btn--active",e.mode==="import"),E.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),g.value=e.search,e.mode==="import"?(p.textContent=`Importa una sezione esistente dentro "${o.nome}".`,g.placeholder="Cerca kit sorgente\u2026",m.textContent="Kit sorgente",v.textContent=a?`Sezioni di ${a.nome}`:"Sezione",O.style.display="none",h.innerHTML=d.length?d.map(u=>{let I=u.id===e.sourceKitId;return`<label class="kit-import-option ${I?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${I?"checked":""}
                           onchange="_kitCfgSelectImportSource('${c(u.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${c(u.nome)}</span>
                        <span class="kit-import-option-meta">${(u.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(p.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,g.placeholder="Cerca kit destinazione\u2026",m.textContent="Kit sorgente",v.textContent="Sezione da copiare",O.style.display="flex",h.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${c(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,Y.innerHTML=f.length?f.map(u=>{let I=(e.targetKitIds||[]).includes(u.id),x=r?G(o,u):null,D=`${(u.sezioni||[]).length} sezioni`;return x&&(x.hasTargetVarianti?x.needsReview?D=`${x.exactMatches}/${x.targetCount} combinazioni allineate`:D=`${x.targetCount}/${x.targetCount} combinazioni allineate`:D="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${I?"kit-import-option--active":""}">
                    <input type="checkbox" ${I?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${c(u.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${c(u.nome)}</span>
                        <span class="kit-import-option-meta">${c(D)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),q.innerHTML=l.length?l.map(u=>{let I=u.id===e.sectionId;return`<label class="kit-import-option ${I?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${I?"checked":""}
                       onchange="_kitCfgSelectImportSection('${c(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${c(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessuna sezione disponibile.</div>';let T=!1,z="kit-cfg-help kit-import-preview",C="";if(e.mode==="import"){if(!a)C="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!r)C="Seleziona una sezione da importare nel kit corrente.";else{let u=G(a,o);T=!0,C=`La sezione <strong>${c(r.nome)}</strong> verr\xE0 importata in <strong>${c(o.nome)}</strong>. `,u.hasTargetVarianti?u.needsReview?(z="kit-cfg-warn kit-import-preview",C+=`${u.exactMatches} combinazioni su ${u.targetCount} risultano allineate: controlla i coefficienti importati.`):C+=`Tutte le ${u.targetCount} combinazioni del kit destinazione risultano allineate.`:(z="kit-cfg-warn kit-import-preview",C+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}P.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else{let u=n.filter(I=>(e.targetKitIds||[]).includes(I.id));if(!r)C="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!u.length)C="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{T=!0;let I=u.filter(x=>G(o,x).needsReview).length;C=`La sezione <strong>${c(r.nome)}</strong> verr\xE0 copiata in <strong>${u.length}</strong> kit.`,I>0?(z="kit-cfg-warn kit-import-preview",C+=` <strong>${I}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):C+=" Le combinazioni risultano allineate su tutti i kit selezionati."}P.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}U.className=z,U.innerHTML=C,P.disabled=!T,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("kit-import-search");u&&u.focus()},40))}function Vi(){if(!y)return;let{kits:t}=b(),i=y,n=t.find(r=>r.id===i.currentKitId),e=t.find(r=>r.id===i.sourceKitId),o=ht(e,i.sectionId);if(!n||!e||!o){S("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import"){let r=G(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(gt(o,e,n)),M(t),tt(),J();let d="";r.hasTargetVarianti?r.needsReview&&(d=" Controlla le quantit\xE0 sulle combinazioni non allineate."):d=" Definisci poi gli assi del kit per rifinire i coefficienti.",S(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${d}`);return}let s=t.filter(r=>(i.targetKitIds||[]).includes(r.id)&&r.id!==n.id);if(!s.length){S("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let a=0;for(let r of s)G(e,r).needsReview&&(a+=1),r.sezioni=r.sezioni||[],r.sezioni.push(gt(o,e,r));M(t),tt(),J();let l="";a>0&&(l=` ${a} kit richiedono un controllo delle quantit\xE0.`),S(`Sezione "${o.nome}" copiata in ${s.length} kit \u2713${l}`)}function J(){let{kits:t}=b(),i=t.find(k=>k.id===ft);if(!i){H();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=_(i);V==="sezioni"&&(V="bom"),V==="sa"&&(V="bom");let s=["info","varianti","bom"],a={info:"Prodotto",varianti:"Elettronica selezionabile",bom:"Parti del prodotto"},l=e.length,r=o.length,d=(i.sezioni||[]).reduce((k,E)=>k+(E.componenti||[]).length,0),f=r?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-bolt"></i>
                <div><strong>${l}</strong> grupp${l===1?"o":"i"} elettronici e <strong>${r}</strong> configurazioni pronte da usare</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div>
                    ${o.slice(0,8).map(k=>`<span class="kit-cfg-sa-var-badge">${c(k.nome)}</span>`).join(" ")}
                    ${o.length>8?`<span class="kit-cfg-sa-count">+${o.length-8} altre</span>`:""}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${d}</strong> parti prodotto da usare nella distinta base</div>
            </div>
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>',p=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${c(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${c(i.id)}',this.value)">
        </div>
        ${f}
        <div class="kit-cfg-danger">
            <button class="kit-btn-danger" onclick="_kitElimina('${c(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,g=e.map((k,E)=>{let T=(k.opzioni||[]).map((z,C)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${c(z.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${c(i.id)}','${c(k.id)}','${c(z.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${c(i.id)}','${c(k.id)}','${c(z.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${E}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${c(k.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${c(i.id)}','${c(k.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${c(i.id)}','${c(k.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${T||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${c(i.id)}','${c(k.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),m=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xE0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(k=>`<span class="kit-cfg-sa-var-badge" title="${c(k.key)}">${c(k.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",v=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci solo l'<strong>elettronica selezionabile</strong> del prodotto.<br>
                Esempio: un gruppo <strong>LED</strong>, uno <strong>Lente</strong>, uno <strong>Alimentazione</strong>.<br>
                Tu inserisci i nomi, il sistema user\xE0 queste scelte per costruire l'ordine e la distinta base.
            </div>
            ${g||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${c(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            ${m}
        </div>`,h=(i.sezioni||[]).map((k,E)=>{let T=(k.componenti||[]).map(z=>{let C=B(z),u=rt(z,i),I=(e||[]).find(L=>L.id===u.asseId)||null,x=u.tipo==="gruppo"&&I?`<div class="kit-cfg-row">${(I.opzioni||[]).map(L=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${u.opzioneIds.includes(L.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${c(i.id)}','${c(k.id)}','${c(z.id)}','${c(L.id)}',this.checked)">
                        ${c(L.nome)}
                    </label>`).join("")}</div>`:"",D=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${c(i.id)}','${c(k.id)}','${c(z.id)}','asseId',this.value)">
                        ${e.map(L=>`<option value="${c(L.id)}" ${u.asseId===L.id?"selected":""}>${c(L.nome)}</option>`).join("")}
                   </select>`:"",Tt=u.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"";return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${c(z.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${c(i.id)}','${c(k.id)}','${c(z.id)}','nome','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${c(i.id)}','${c(k.id)}','${c(z.id)}','modo','',this.value)">
                        <option value="quantificato" ${C?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${C?"selected":""}>Solo avviso</option>
                    </select>
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${c(i.id)}','${c(k.id)}','${c(z.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" value="${u.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${c(i.id)}','${c(k.id)}','${c(z.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${c(i.id)}','${c(k.id)}','${c(z.id)}','tipo',this.value)">
                        <option value="sempre" ${u.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${u.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${u.tipo==="gruppo"?D:""}
                </div>
                ${u.tipo==="gruppo"?x:""}
                <input class="kit-cfg-input" value="${c(z.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${c(i.id)}','${c(k.id)}','${c(z.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${C?"Usa questo tipo per promemoria come resina, cavo neoprene o stampa 3D: verr\xE0 mostrato come avviso nella distinta.":"Qui dici solo quanta parte serve per singolo faretto e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Tt}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${E}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${c(k.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${c(i.id)}','${c(k.id)}','nome',this.value)">
                <button class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${c(i.id)}','${c(k.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${c(i.id)}','${c(k.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${T}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${c(i.id)}','${c(k.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),q=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce non \xE8 da contare ma solo da ricordare, impostala come <strong>Solo avviso</strong>.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${h}
            <div class="kit-cfg-row">
                <button class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${c(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${c(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,O="";o.length?O=o.map(k=>{let E=(i.sottoAssembly||[]).map((z,C)=>({sa:z,i:C})).filter(({sa:z})=>z.varianteKey===k.key),T=E.map(({sa:z,i:C})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${c(z.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${c(i.id)}',${C},'nome',this.value)">
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${c(i.id)}',${C})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${c(k.nome)}</span>
                    <span class="kit-cfg-sa-count">${E.length} part${E.length!==1?"i":"e"}</span>
                </div>
                ${T||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${c(i.id)}','${c(k.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${c(k.nome)}</button>
            </div>`}).join(""):O='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let Y=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${O}
        </div>`,U={info:p,varianti:v,bom:q,sa:Y},P=s.map(k=>`<button class="kit-tab ${V===k?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${k}')">${a[k]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${c(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${c(i.nome)}</span>
        </div>
        <div class="kit-tabs">${P}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${U[V]}</div>
    </div>`,X(n)}function Pi(t){if(t&&A===t){K();return}A=t,K()}function Di(t){V=t,J()}function $(t,i,n=!0){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(i(o),M(e),n&&J())}function ji(t,i){$(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Hi(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=b();M(i.filter(n=>n.id!==t)),ft=null,A=null,H()}function Ot(t){$(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:w(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:w(),key:"opz1",nome:"Opzione 1"}]})})}function Ui(t,i,n,e){$(t,function(o){let s=(o.assiConfigurazione||[]).find(a=>a.id===i);s&&(n==="key"?s.key=W(e,s.key||"asse"):s[n]=e.trim())})}function Qi(t,i){$(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function Fi(t,i){$(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:w(),key:"opz"+o,nome:"Opzione "+o})})}function Gi(t,i,n,e,o){$(t,function(s){let a=(s.assiConfigurazione||[]).find(r=>r.id===i),l=a&&(a.opzioni||[]).find(r=>r.id===n);l&&(e==="key"?l.key=W(o,l.key||"opzione"):l[e]=o.trim())})}function Ji(t,i,n){$(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function Wi(t){Ot(t)}function Yi(t){$(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:w(),nome:"Nuova sezione",componenti:[]})})}function Xi(t){Kt(t)}function Zi(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s[n]=e.trim())},!1)}function te(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&$(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function ie(t,i){$(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:w(),nome:"Nuovo componente",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function ee(t,i,n,e,o,s){$(t,function(a){let l=(a.sezioni||[]).find(d=>d.id===i),r=l&&(l.componenti||[]).find(d=>d.id===n);if(r){if(e==="coeff"||e==="flag"){r.qtaPerVariante=r.qtaPerVariante||{},r.qtaPerVariante[o]=Math.max(0,Number.parseInt(s,10)||0);return}if(e==="modo"){r.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",r.modoComponente==="segnalazione"?(r.tracciabile=!1,r.unitaMisura="flag"):r.unitaMisura==="flag"&&(r.unitaMisura="pz");return}r[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function ne(t,i,n,e,o){$(t,function(s){let a=(s.sezioni||[]).find(d=>d.id===i),l=a&&(a.componenti||[]).find(d=>d.id===n);if(!l)return;let r=rt(l,s);if(e==="tipo"){if(r.tipo=o==="gruppo"?"gruppo":"sempre",r.tipo==="gruppo"&&!r.asseId){r.asseId=s.assiConfigurazione?.[0]?.id||"";let d=(s.assiConfigurazione||[]).find(f=>f.id===r.asseId);r.opzioneIds=d?.opzioni?.length?[d.opzioni[0].id]:[]}}else if(e==="qtyBase")r.qtyBase=Math.max(0,Number.parseInt(o,10)||0);else if(e==="asseId"){r.asseId=String(o||"");let d=(s.assiConfigurazione||[]).find(f=>f.id===r.asseId);r.opzioneIds=d?.opzioni?.length?[d.opzioni[0].id]:[],r.tipo="gruppo"}l.applicazioneTipo=r.tipo,l.applicazioneAsseId=r.asseId,l.applicazioneOpzioneIds=r.opzioneIds,l.qtaBase=r.qtyBase,l.qtaPerVariante=st(l,s,r)})}function oe(t,i,n,e,o){$(t,function(s){let a=(s.sezioni||[]).find(f=>f.id===i),l=a&&(a.componenti||[]).find(f=>f.id===n);if(!l)return;let r=rt(l,s),d=new Set(r.opzioneIds||[]);o?d.add(e):d.delete(e),r.tipo="gruppo",r.opzioneIds=[...d],l.applicazioneTipo=r.tipo,l.applicazioneAsseId=r.asseId,l.applicazioneOpzioneIds=r.opzioneIds,l.qtaBase=r.qtyBase,l.qtaPerVariante=st(l,s,r)})}function se(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(l=>l.id===i),a=s&&(s.componenti||[]).find(l=>l.id===n);!a||B(a)||(a.tracciabile=!!e)},!1)}function ae(t,i,n){$(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function re(t){$(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:w(),nome:"",varianteKey:_(i)[0]?.key||""})})}function ce(t,i){$(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:w(),nome:"",varianteKey:i,noteConfig:""})})}function le(t,i,n,e){$(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function de(t,i){$(t,function(n){n.sottoAssembly.splice(i,1)})}function ye(){window._kitOpenView=ri,window._kitOpenConfig=Bt,window._kitNuovoKit=Ei,window._kitBack=ci,window._kitSwitchTab=li,window._kitAggiornaQty=di,window._kitOrdineSet=pi,window._kitOrdineDelta=fi,window._kitOrdineReset=mi,window._kitOrdineResetVoce=ui,window._kitComposeSelect=gi,window._kitComposeAdd=ki,window._kitAggiornaCar=At,window._kitAggiornaPronti=vi,window._kitSetPronti=yi,window._kitApriModalSped=_i,window._kitChiudiModalSped=xt,window._kitConfermaSpedizione=wi,window._kitApriModalReso=Si,window._kitChiudiModalReso=Nt,window._kitResoQtyChange=Ai,window._kitResoAggiornaBOM=pt,window._kitConfermaReso=qi,window._kitSalvaMovimento=zi,window._kitEliminaMovimento=hi,window._kitModificaMovimento=$i,window._kitChiudiModalEditMov=Et,window._kitConfermaModificaMov=Ii,window._kitChiudiModalDelMov=qt,window._kitConfermaEliminaMov=Mt,window._kitSalvaManuale=Mi,window._kitElimina=Hi,window._kitCfgBack=Pi,window._kitCfgSwitchTab=Di,window._kitCfgSaveNome=ji,window._kitCfgAddVar=Wi,window._kitCfgOpenImportModal=Kt,window._kitCfgOpenCopySezModal=xi,window._kitCfgCloseImportModal=tt,window._kitCfgSetImportMode=Ni,window._kitCfgSetImportSearch=Bi,window._kitCfgSelectImportSource=Ki,window._kitCfgSelectImportSection=Oi,window._kitCfgToggleImportTarget=Ti,window._kitCfgSelectAllImportTargets=Li,window._kitCfgClearImportTargets=Ri,window._kitCfgConfirmImport=Vi,window._kitCfgAddAsse=Ot,window._kitCfgUpdateAsse=Ui,window._kitCfgDelAsse=Qi,window._kitCfgAddOpzione=Fi,window._kitCfgUpdateOpzione=Gi,window._kitCfgDelOpzione=Ji,window._kitCfgAddSez=Yi,window._kitCfgImportSez=Xi,window._kitCfgUpdateSez=Zi,window._kitCfgDelSez=te,window._kitCfgAddComp=ie,window._kitCfgUpdateComp=ee,window._kitCfgUpdateCompRule=ne,window._kitCfgToggleCompOption=oe,window._kitCfgToggleCompTracked=se,window._kitCfgDelComp=ae,window._kitCfgAddSA=re,window._kitCfgAddSAForVariant=ce,window._kitCfgUpdateSA=le,window._kitCfgDelSA=de}var ot,Z,vt,yt,et,F,kt,A,St,ft,V,y,be,pe=Lt(()=>{Rt();Pt();Dt();Vt();ot="_mlKitData",Z="_mlKitDataTs",vt="_mlKitOrderDrafts",yt=2,et=!1;F={};kt=null;A=null,St="ordine";ft=null,V="info",y=null;be=H});pe();export{H as caricaKitProdotti,be as default,ye as registerGlobals,ve as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-CYPBBBEZ.js.map
