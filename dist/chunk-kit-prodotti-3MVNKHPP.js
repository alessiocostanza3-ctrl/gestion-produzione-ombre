import{a as Ui,c as xt,e as Fi,f as a,g as z,h as ft,l as Gi,m as V,q as Ji,r as At,u as Wi}from"./chunk-chunk-55SFP7PR.js";function Ao(){Et=!1}function F(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function Z(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function U(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function yt(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function te(t,i){let n="opz"+(i+1),e=F(t?.key,n);return{id:String(t?.id||C()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function ie(t,i){let n="asse"+(i+1),e=F(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,r)=>te(s,r)).filter(Boolean):[];return{id:String(t?.id||C()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function ei(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function ee(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function ni(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let r of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:r.id,opzioneKey:r.key,opzioneNome:r.nome,opzioneCodice:String(r.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:ei(e.selections),nome:ee(e.selections),selections:e.selections}})}function ne(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||C()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:yt(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:Z(t?.qtaBase)}}function oe(t){return{id:String(t?.id||C()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(ne):[]}}function se(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function oi(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:Z(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||Z(Object.values(t?.qtaPerVariante||{})[0])};let e=O(i);if(!e.length)return n;let o=e.filter(c=>L(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>L(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>L(t,c.key)))};let r=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:r};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let p of c.opzioni||[]){let u=new Set(e.filter(y=>(y.selections||[]).some(f=>f.asseId===c.id&&f.opzioneId===p.id)).map(y=>y.key));if(!u.size)continue;[...u].every(y=>L(t,y)===r)&&l.push(p.id)}if(!l.length)continue;let m=new Set(e.filter(p=>(p.selections||[]).some(u=>u.asseId===c.id&&l.includes(u.opzioneId))).map(p=>p.key));if(se(m,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:r}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:r}}function Tt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=Z(n.qtyBase);if(!o)return e;for(let s of O(i)){let r=n.tipo==="sempre";n.tipo==="gruppo"&&(r=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),r&&(e[s.key]=o)}return e}function ae(t,i){let n=oe(t);return n.componenti=n.componenti.map(function(e){let o=oi(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:Tt(e,i,o)}}),n}function re(t,i){let n=O(i);if(!n.length)return null;let e=null;for(let o of n){let s=L(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function ce(t,i,n){let e=O(n),o={},s=re(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let r of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},r.key)?L(t,r.key):s!==null?s:0;c>0&&(o[r.key]=c)}return{id:C(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:Lt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:yt(t?.unitaMisura,K(t)?"flag":"pz")}}function ht(t,i,n){return{id:C(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>ce(e,i,n)):[]}}function si(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=F(t?.key||String(t?.nome||"asse"),"asse1"),s=o,r=1;for(;e.has(s);)s=o+"_c"+r++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],m="opz"+(c+1),p=F(l?.key,m),u=1;for(;d.some(g=>g.key===p);)p=p+"_c"+u++;d.push({id:C(),key:p,nome:String(l?.nome||"").trim()||p,codice:String(l?.codice||"").trim()})}return{id:C(),key:s,nome:String(t?.nome||"").trim()||s,opzioni:d}}function Dt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function vt(t,i){let n=new Set(O(t).map(s=>s.key)),e=O(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function zt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function de(t,i){return{id:String(t?.id||C()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function ai(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(p,u){let g="v"+(u+1),y=F(p?.key,g);return{id:String(p?.id||C()),key:y,nome:String(p?.nome||y).trim()||y}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((p,u)=>ie(p,u)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(p){return{id:p.id,key:p.key,nome:p.nome}})}]:[],s=ni(o),r=s.length?s:n,d=new Set(r.map(p=>p.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(p){d.has(p[0])&&(c[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0))});for(let p of r)c[p.key]===void 0&&(c[p.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(p=>de(p,r[0]?.key||"")).filter(p=>!p.varianteKey||d.has(p.varianteKey)):[],m={};return Object.entries(i.pronti||{}).forEach(function(p){m[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0)}),{id:String(i.id||C()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Bt,assiConfigurazione:o,varianti:r,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(p=>ae(p,{assiConfigurazione:o,varianti:r})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function O(t){return Array.isArray(t?.varianti)?t.varianti:[]}function K(t){return!!t&&t.modoComponente==="segnalazione"}function Lt(t){return!!t&&t.tracciabile!==!1&&!K(t)}function L(t,i){let n=Z(t?.qtaPerVariante?.[i]);return K(t)?n>0?1:0:n}function Kt(t,i){return oi(t,i)}function _t(){try{let t=localStorage.getItem(Zt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function ri(t){try{localStorage.setItem(Zt,JSON.stringify(t||{}))}catch{}}function ct(){try{let t=localStorage.getItem(Xt),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Pt(t){try{localStorage.setItem(Xt,JSON.stringify(t||[]))}catch{}}function ot(){try{let t=localStorage.getItem(ti),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Ct(t){try{localStorage.setItem(ti,JSON.stringify(t||[]));try{localStorage.setItem(Zi,Date.now())}catch{}}catch{}}function dt(t){return String(t||"").trim().toUpperCase()}function lt(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(dt).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function G(t){return lt(t?._meta||{})}function $t(t,i){return t._meta=lt(i),t._meta}function nt(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function ci(){let t=1;try{t=(Number.parseInt(localStorage.getItem(Jt),10)||0)+1,localStorage.setItem(Jt,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function di(t){let i=G(t);return i.documento||(i.documento=ci(),$t(t,i)),i.documento}function Wt(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:dt(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function li(){return it.length?Promise.resolve(it):Array.isArray(window._attiviProd)&&window._attiviProd.length?(it=Wt(window._attiviProd),Promise.resolve(it)):gt||(gt=fetch(xt,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(it=Wt(t),it)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){gt=null}),gt)}function le(t){let i=dt(t);return i&&it.find(n=>n.ordine===i)||null}function pi(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=dt(e);return o?i[o]?String(i[o]||"").trim():String(le(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function tt(t){let i=_t(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of O(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=lt(n._meta||{}),e}function j(t,i){let{kits:n}=b(),e=n.find(m=>m.id===t);if(!e)return;let o=_t(),s=tt(e);i(s,e);let r={},d=!1;for(let m of O(e)){let p=Math.max(0,Number.parseInt(s[m.key],10)||0);r[m.key]=p,p>0&&(d=!0)}let c=lt(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(c.documento||(c.documento=ci()),r._meta=c),d||l?o[t]=r:delete o[t],ri(o),B===t&&R()}function pe(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function mi(t){return!(t.assiConfigurazione&&t.assiConfigurazione.length)}function ui(t){let i=_t(),n=i?.[t]&&typeof i[t]=="object"?i[t]:{};return{_meta:lt(n._meta||{}),_units:Math.max(1,Number.parseInt(n._units,10)||1),_sel:n._sel&&typeof n._sel=="object"?{...n._sel}:{}}}function fi(t,i){let n=Math.max(1,Number.parseInt(i._units,10)||1),e=i._sel&&typeof i._sel=="object"?i._sel:{},o=[],s=[];for(let r of t.sezioni||[]){let d=[];for(let c of r.componenti||[]){if(!e[c.id])continue;let l=Z(c.qtaBase!=null?c.qtaBase:1)*n;d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&s.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:""})}d.length&&o.push({id:r.id,nome:r.nome,righe:d})}return{selectedVarianti:[],sezioni:o,avvisi:s,totalePezzi:n,totaleRighe:o.reduce(function(r,d){return r+d.righe.length},0),_isNewStyle:!0}}function me(t,i){let n=ui(t.id),e=n._units,o=n._sel,s=fi(t,n),r=n._meta,d=t.sezioni||[],c=d.map(function(p){let u=p.componenti||[];if(!u.length)return"";let g=u.map(function(y){let f=!!o[y.id],h=f?Z(y.qtaBase!=null?y.qtaBase:1)*e:0;return`<label class="kit-ns-comp-row${f?" kit-ns-comp-row--checked":""}">
                <input type="checkbox" class="kit-ns-check"${f?" checked":""}
                    onchange="_kitNSToggleComp('${a(t.id)}','${a(y.id)}',this.checked)">
                <div class="kit-ns-comp-info">
                    <span class="kit-ns-comp-name">${a(y.nome)}</span>
                    ${y.codice?`<span class="kit-ns-comp-code">\xB7 ${a(y.codice)}</span>`:""}
                    <span class="kit-ns-comp-qty-base">${U(y.qtaBase!=null?y.qtaBase:1)} ${y.unitaMisura||"pz"}/unit\xE0</span>
                </div>
                ${f?`<div class="kit-ns-comp-total">${U(h)} ${y.unitaMisura||"pz"}</div>`:""}
            </label>`}).join("");return`<div class="kit-ns-section">
            <div class="kit-ns-section-title">${a(p.nome)}</div>
            <div class="kit-ns-comps">${g}</div>
        </div>`}).join(""),l=r.ordiniCliente.length?r.ordiniCliente.map(function(p){return`<span class="kit-order-ref-chip">${a(p)}
                <button type="button" class="kit-order-ref-chip-remove"
                    onclick='_kitNSOrderRemoveRef(${JSON.stringify(t.id)},${JSON.stringify(p)})' aria-label="Rimuovi ordine">
                    <i class="fas fa-times"></i>
                </button>
            </span>`}).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',m=s.totaleRighe?s.sezioni.map(function(p){return`<div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${a(p.nome)}</div>
                ${p.righe.map(function(u){return`<div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${a(u.nome)}</div>
                            ${u.codice?`<div class="kit-distinta-row-meta">${a(u.codice)}</div>`:""}
                            ${u.noteConfig?`<div class="kit-distinta-row-note">${a(u.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${U(u.totale)} ${a(u.unita)}</div>
                    </div>`}).join("")}
            </div>`}).join(""):"";i.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button type="button" class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${a(t.nome)}</span>
            <button type="button" class="kit-gear-btn-inline" onclick="_kitOpenConfig('${a(t.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <!-- Sommario + azioni -->
        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Distinta in composizione</div>
                    <div class="kit-order-summary-total">${e} unit\xE0 \xB7 ${s.totaleRighe} materiali</div>
                </div>
                <div class="kit-order-summary-actions">
                    <button type="button" class="kit-btn-secondary" onclick="_kitNSOpenPrintPreview('${a(t.id)}')"><i class="fas fa-print"></i> Anteprima stampa</button>
                    <button type="button" class="kit-cfg-add-btn" onclick="_kitNSCreateDistinta('${a(t.id)}')"><i class="fas fa-save"></i> Salva distinta</button>
                    <button type="button" class="kit-btn-secondary" onclick="_kitNSReset('${a(t.id)}')"><i class="fas fa-rotate-left"></i> Azzera</button>
                </div>
            </div>
            <div class="kit-order-summary-note">La selezione rimane locale sul dispositivo finch\xE9 non salvi una distinta.</div>
        </div>

        <!-- Quante unit\xE0 -->
        <div class="kit-ns-units-card">
            <div class="kit-ns-units-label">Quante unit\xE0 vuoi produrre?</div>
            <div class="kit-order-stepper">
                <button type="button" class="kit-order-stepper-btn" onclick="_kitNSSetUnits('${a(t.id)}',${e-1})">\u2212</button>
                <input class="kit-order-stepper-input" type="number" min="1" value="${e}"
                    onchange="_kitNSSetUnits('${a(t.id)}',this.value)"
                    oninput="_kitNSSetUnits('${a(t.id)}',this.value)">
                <button type="button" class="kit-order-stepper-btn" onclick="_kitNSSetUnits('${a(t.id)}',${e+1})">+</button>
            </div>
        </div>

        <!-- Ordini cliente -->
        <div class="kit-order-meta-grid">
            <div class="kit-order-meta-card">
                <div class="kit-order-meta-title">Ordini cliente</div>
                <div class="ordine-autocomplete-wrapper kit-order-autocomplete-wrapper">
                    <input class="kit-order-meta-input" id="kit-ns-ref-input-${a(t.id)}" type="text" placeholder="Cerca e collega un ordine cliente"
                        oninput="_kitNSOrderSearch('${a(t.id)}',this.value)"
                        onfocus="_kitNSOrderSearch('${a(t.id)}',this.value)"
                        onblur="_kitNSOrderHideSearch('${a(t.id)}')">
                    <div id="kit-ns-autocomplete-${a(t.id)}" class="ordine-autocomplete-list"></div>
                </div>
                <div class="kit-order-ref-list">${l}</div>
            </div>
        </div>

        <!-- Selezione componenti -->
        <div class="kit-ns-comps-panel">
            ${d.length?`<div class="kit-ns-panel-title">Seleziona i componenti per questo ordine</div>${c}`:`<div class="kit-cfg-help">Questo kit non ha ancora componenti. <button type="button" class="btn-link-inline" onclick="_kitOpenConfig('${a(t.id)}')">Apri configurazione</button></div>`}
        </div>

        <!-- Distinta anteprima -->
        ${s.totaleRighe?`
        <div class="kit-ns-distinta-preview">
            <div class="kit-ns-panel-title" style="margin-bottom:8px">Riepilogo distinta (${s.totaleRighe} materiali \xB7 ${U(e)} unit\xE0)</div>
            ${m}
        </div>`:""}
    </div>`}function Rt(t){let i=kt[t.id]&&typeof kt[t.id]=="object"?kt[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return kt[t.id]=n,n}function gi(t,i){let n=t.assiConfigurazione||[];if(!n.length)return O(t)[0]||null;let e=[];for(let s of n){let r=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===r);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=ei(e);return O(t).find(s=>s.key===o)||null}function ue(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function fe(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let r of s.componenti||[])if(!K(r)&&!(L(r,i.key)<=0)&&r.applicazioneTipo==="gruppo"&&String(r.applicazioneAsseId||"")===e&&Array.isArray(r.applicazioneOpzioneIds)&&r.applicazioneOpzioneIds.includes(o))return!0;return!1}function ge(t,i,n){let e=[],o=new Map;for(let s of i){let r=nt(n,s.key);if(r)for(let d of s.selections||[]){if(fe(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=r;continue}let m={id:"sel-"+c,nome:ue(d),codice:String(d?.opzioneCodice||"").trim(),totale:r,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,m),e.push(m)}}return e}function St(t,i){if(mi(t))return fi(t,ui(t.id));let n=O(t).filter(r=>nt(i,r.key)>0),e=[],o=[],s=ge(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let r of t.sezioni||[]){let d=[];for(let c of r.componenti||[]){let l=0,m=[];for(let u of n){let g=nt(i,u.key),y=L(c,u.key);!g||!y||(K(c)?l+=g:l+=g*y,m.push({nome:u.nome,pezziOrdine:g,coeff:y}))}if(!m.length)continue;let p=m.length===1?m[0].nome:m.length+" configurazioni";if(K(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:p});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:p})}d.length&&e.push({id:r.id,nome:r.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:pe(i),totaleRighe:e.reduce((r,d)=>r+d.righe.length,0)}}function ke(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function ve(){return String(window._distintaHeaderAzienda||"").trim()}function ki(t,i,n){let e=new Date,o=G(n),s=ve(),r=String(o.documento||"").trim(),d=s?s.split(/\r?\n/).map(g=>`<div>${a(g)}</div>`).join(""):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),m=i.selectedVarianti.length?i.selectedVarianti.map(g=>{let y=nt(n,g.key);return`<tr>
                <td>${a(U(y))}</td>
                <td>${a(g.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',p=i.sezioni.map(g=>{let y=g.righe.map(f=>{let h=[f.dettaglio,f.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${a(String(f.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${a(f.nome)}</div></td>
                <td class="db-print-cell-unit">${a(f.unita)}</td>
                <td class="db-print-cell-qty">${a(U(f.totale))}</td>
                <td class="db-print-cell-note">${h?a(h):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${a(g.nome)}</td></tr>${y}`}).join(""),u=i.avvisi.length?i.avvisi.map(g=>`<div class="db-print-alert ${g.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${a(g.nome)}</div>
                <div>${a(g.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${a(U(g.totaleCoinvolto))} pz \xB7 ${a(g.variantiLabel)}</div>
            </div>`).join(""):'<div class="db-print-empty">Nessun avviso operativo collegato a questa distinta.</div>';return`<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distinta base - ${a(t.nome)}</title>
    <style>
        :root {
            color-scheme: light;
            --ink: #111827;
            --muted: #6b7280;
            --line: #cbd5e1;
            --paper: #ffffff;
            --bg: #e5e7eb;
            --accent: #0f172a;
            --soft: #f8fafc;
            --brand: #1e293b;
            --warning-bg: #fffbeb;
            --warning-line: #fcd34d;
        }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: var(--bg); font-family: Arial, Helvetica, sans-serif; color: var(--ink); }
        body { min-height: 100vh; }
        .db-print-toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 18px;
            background: rgba(15, 23, 42, 0.94);
            color: #fff;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.22);
        }
        .db-print-toolbar-title { font-size: 13px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
        .db-print-toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .db-print-toolbar button {
            border: 1px solid rgba(255,255,255,0.16);
            background: #fff;
            color: #0f172a;
            border-radius: 999px;
            padding: 10px 16px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }
        .db-print-toolbar button.db-print-btn-secondary {
            background: transparent;
            color: #fff;
        }
        .db-print-stage { padding: 28px 18px 46px; }
        .db-print-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: var(--paper);
            box-shadow: 0 24px 50px rgba(15, 23, 42, 0.14);
            padding: 18mm 16mm 14mm;
        }
        .db-print-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 14px;
        }
        .db-print-company {
            max-width: 52%;
            min-width: 0;
            font-size: 11px;
            line-height: 1.55;
            color: var(--brand);
            white-space: pre-line;
        }
        .db-print-title-block {
            text-align: right;
            min-width: 240px;
        }
        .db-print-title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--accent);
        }
        .db-print-subtitle {
            margin-top: 4px;
            font-size: 11px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        .db-print-meta-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 14px;
        }
        .db-print-meta-card {
            border: 1px solid var(--line);
            padding: 12px 14px;
            background: var(--soft);
        }
        .db-print-meta-row {
            display: grid;
            grid-template-columns: 108px 1fr;
            gap: 8px;
            font-size: 12px;
            padding: 3px 0;
        }
        .db-print-meta-label {
            color: var(--muted);
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.04em;
        }
        .db-print-meta-value {
            color: var(--ink);
            font-weight: 700;
        }
        .db-print-strip {
            display: grid;
            grid-template-columns: 1.05fr 1.8fr .75fr;
            border: 1.5px solid #94a3b8;
            margin-bottom: 14px;
        }
        .db-print-strip-cell {
            padding: 10px 12px;
            border-right: 1px solid #94a3b8;
            min-height: 58px;
        }
        .db-print-strip-cell:last-child { border-right: none; }
        .db-print-strip-label {
            font-size: 10px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 6px;
        }
        .db-print-strip-value {
            font-size: 15px;
            font-weight: 800;
            color: var(--accent);
        }
        .db-print-config-title,
        .db-print-materials-title,
        .db-print-alerts-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--brand);
            margin: 16px 0 8px;
        }
        .db-print-config-table,
        .db-print-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #94a3b8;
        }
        .db-print-config-table th,
        .db-print-config-table td,
        .db-print-table th,
        .db-print-table td {
            border: 1px solid #cbd5e1;
            padding: 7px 8px;
            font-size: 11px;
            vertical-align: top;
        }
        .db-print-config-table th,
        .db-print-table th {
            background: #f8fafc;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--muted);
        }
        .db-print-section-row td {
            background: #eef2f7;
            color: var(--brand);
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding-top: 9px;
            padding-bottom: 9px;
        }
        .db-print-row-name { font-size: 12px; font-weight: 700; color: var(--ink); }
        .db-print-cell-ref { width: 70px; font-weight: 700; color: var(--brand); white-space: nowrap; }
        .db-print-cell-unit { width: 58px; text-align: center; font-weight: 700; }
        .db-print-cell-qty { width: 90px; text-align: right; font-weight: 800; }
        .db-print-cell-note { width: 28%; color: #475569; }
        .db-print-alerts { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .db-print-alert {
            border: 1px solid #cbd5e1;
            background: var(--soft);
            padding: 10px 12px;
        }
        .db-print-alert--warning {
            border-color: var(--warning-line);
            background: var(--warning-bg);
        }
        .db-print-alert-title { font-size: 12px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
        .db-print-alert-meta { margin-top: 5px; font-size: 10px; color: var(--muted); }
        .db-print-empty { color: var(--muted); font-size: 11px; padding: 12px; border: 1px dashed var(--line); }
        @page {
            size: A4;
            margin: 12mm;
        }
        @media print {
            html, body { background: #fff; }
            .db-print-toolbar { display: none !important; }
            .db-print-stage { padding: 0; }
            .db-print-page {
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
    <div class="db-print-toolbar">
        <div class="db-print-toolbar-title">Anteprima distinta base stampabile</div>
        <div class="db-print-toolbar-actions">
            <button type="button" onclick="window.print()">Stampa</button>
            <button type="button" class="db-print-btn-secondary" onclick="window.close()">Chiudi</button>
        </div>
    </div>

    <div class="db-print-stage">
        <div class="db-print-page">
            <div class="db-print-header">
                ${d?`<div class="db-print-company">${d}</div>`:"<div></div>"}
                <div class="db-print-title-block">
                    <div class="db-print-title">Distinta Base</div>
                    <div class="db-print-subtitle">Documento interno di produzione e approvvigionamento</div>
                </div>
            </div>

            <div class="db-print-meta-grid">
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Prodotto</div><div class="db-print-meta-value">${a(t.nome)}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Riferimento</div><div class="db-print-meta-value">${a(o.cliente||"")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${a(ke(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${a(V?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${a(U(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${a(U(i.totaleRighe))}</div></div>
                </div>
            </div>

            <div class="db-print-strip">
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Documento</div>
                    <div class="db-print-strip-value">${a(r)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Prodotto</div>
                    <div class="db-print-strip-value">${a(t.nome)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">${a(c)}</div>
                    <div class="db-print-strip-value">${a(l)}</div>
                </div>
            </div>

            <div class="db-print-config-title">Configurazioni incluse nell'ordine</div>
            <table class="db-print-config-table">
                <thead>
                    <tr>
                        <th style="width:72px">Q.t\xE0</th>
                        <th>Configurazione</th>
                    </tr>
                </thead>
                <tbody>${m}</tbody>
            </table>

            <div class="db-print-materials-title">Materiali della distinta</div>
            <table class="db-print-table">
                <thead>
                    <tr>
                        <th style="width:72px">Rif.</th>
                        <th>Descrizione</th>
                        <th style="width:58px">Um</th>
                        <th style="width:90px">Quantit\xE0</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>${p}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${u}</div>
        </div>
    </div>
</body>
</html>`}function ye(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;let e=tt(n),o=St(n,e);if(!o.totalePezzi||!o.totaleRighe){z("Componi prima un ordine per generare la distinta stampabile.","warning");return}G(e).documento||(j(t,function(r){di(r)}),e=tt(n));let s=window.open("","_blank");if(!s){z("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(ki(n,o,e)),s.document.close(),s.focus()}function b(){try{let t=localStorage.getItem(Nt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(ai):[]}}catch{return{kits:[]}}}function I(t){let i=Array.isArray(t)?t.map(ai):[];try{localStorage.setItem(Nt,JSON.stringify({kits:i})),localStorage.setItem(bt,Date.now())}catch{}be(i)}function be(t){clearTimeout(Yt),Yt=setTimeout(function(){At({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function he(t){fetch(xt,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(bt)||0);if(n>0&&n>e){try{localStorage.setItem(Nt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(bt,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function C(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function Ht(){if(!V||!V.nome)return!1;let t=String(V.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||V.ruolo==="MASTER"}function ze(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(K(e)){i[e.id]=0;continue}let o=0;for(let[s,r]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(r,10)||0)*L(e,s);i[e.id]=o}return i}function we(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let r of s.componenti||[]){if(K(r))continue;let d=L(r,o);d>0&&(i[r.id]=(i[r.id]||0)+e*d)}}return i}function vi(t,i){let n=O(t).find(e=>e.key===i);return n?a(n.nome):a(i)}function jt(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function pt(){Et||(Et=!0,he(function(n){n&&pt()}));let{kits:t}=b(),i=document.getElementById("contenitore-dati");if(i){i.innerHTML=`
    <div class="kit-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title"><i class="fas fa-toolbox" style="color:#6366f1;margin-right:6px;font-size:1.1rem"></i>Kit Prodotti</h3>
                <p class="acquisti-subtitle">Gestisci kit, componenti e distinte.</p>
            </div>
            <div id="kit-page-actions" class="acquisti-actions-wrapper"></div>
        </div>
        <div id="kit-tab-bar" style="display:flex;gap:4px;padding:8px 0 0">
            <button class="acq-tab ${D==="kits"?"active":""}" data-tab="kits" onclick="_kitSwitchMainTab('kits')"><i class="fas fa-boxes-stacked"></i> Kits</button>
            <button class="acq-tab ${D==="anagrafiche"?"active":""}" data-tab="anagrafiche" onclick="_kitSwitchMainTab('anagrafiche')"><i class="fas fa-list"></i> Anagrafiche</button>
            <button class="acq-tab ${D==="distinte"?"active":""}" data-tab="distinte" onclick="_kitSwitchMainTab('distinte')"><i class="fas fa-file-alt"></i> Distinte</button>
        </div>
        <div id="kit-main-content" class="kit-main-content" style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:0"></div>
    </div>`,T(D),Qt();try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else ft(i)}catch{ft(i)}}}function yi(t,i){if(!i)return;if(!t.length){i.innerHTML=`
        <div style="padding:40px 0;text-align:center">
            <i class="fas fa-box-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:16px;display:block"></i>
            <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun kit configurato.</p>
            <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
        </div>`;return}let n=["pz","mt","cm","mm","kg","g","lt","ml"],e=t.map(o=>{let s=o.sezioni||[],r=s.reduce((l,m)=>l+(m.componenti||[]).length,0),d=s.length,c=s.map(l=>{let m=l.componenti||[],p=m.map(u=>`
            <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #f8fafc">
                <span style="font-size:.84rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${a(u.nome)}">${a(u.nome)}${u.codice?` <span style="color:#94a3b8;font-size:.76rem">\xB7 ${a(u.codice)}</span>`:""}</span>
                <input type="number" min="0" step="any" value="${u.qtaBase!=null?u.qtaBase:1}"
                    class="input-field-modern" style="padding:4px 8px;font-size:.82rem;text-align:right"
                    onchange="_kitQUpdateComp('${a(o.id)}','${a(l.id)}','${a(u.id)}','qtaBase',this.value)"
                    title="Quantit\xE0">
                <select class="input-field-modern" style="padding:4px 6px;font-size:.82rem"
                    onchange="_kitQUpdateComp('${a(o.id)}','${a(l.id)}','${a(u.id)}','unitaMisura',this.value)">
                    ${n.map(g=>`<option value="${g}"${(u.unitaMisura||"pz")===g?" selected":""}>${g}</option>`).join("")}
                </select>
                <button type="button" class="btn-trash-modern" style="padding:4px 7px"
                    onclick="_kitQDelComp('${a(o.id)}','${a(l.id)}','${a(u.id)}')" title="Rimuovi componente"><i class="fas fa-trash"></i></button>
            </div>`).join("");return`
            <details style="border-top:1px solid #f1f5f9" open>
                <summary style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;cursor:pointer;list-style:none;user-select:none;background:#fafafa;border-radius:0">
                    <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                        <input type="text" value="${a(l.nome)}"
                            class="input-field-modern" style="padding:3px 8px;font-size:.84rem;font-weight:600;max-width:200px;background:transparent;border:1px solid transparent"
                            onclick="event.preventDefault();event.stopPropagation()"
                            onfocus="this.style.background='#fff';this.style.border='1px solid #e2e8f0'"
                            onblur="this.style.background='transparent';this.style.border='1px solid transparent';_kitQRenomeSez('${a(o.id)}','${a(l.id)}',this.value)">
                        <span style="color:#94a3b8;font-size:.76rem;white-space:nowrap">${m.length} comp.</span>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;flex-shrink:0">
                        <button type="button" class="btn-trash-modern" style="padding:3px 7px;font-size:.75rem"
                            onclick="event.preventDefault();event.stopPropagation();_kitQDelSez('${a(o.id)}','${a(l.id)}')" title="Rimuovi sezione"><i class="fas fa-trash"></i></button>
                        <i class="fas fa-chevron-down" style="color:#94a3b8;font-size:.75rem;transition:transform .2s"></i>
                    </div>
                </summary>
                <div style="padding:4px 12px 8px">
                    ${m.length?`
                    <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;padding:4px 0 2px;border-bottom:2px solid #e2e8f0;margin-bottom:2px">
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em">Componente</span>
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;text-align:right">Qty</span>
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase">Unit\xE0</span>
                        <span></span>
                    </div>
                    ${p}`:'<p style="color:#94a3b8;font-size:.82rem;padding:6px 0">Nessun componente.</p>'}
                    <button type="button" class="btn-archive-action" style="margin-top:8px;font-size:.8rem"
                        onclick="_kitQAddCompOpen('${a(o.id)}','${a(l.id)}')">
                        <i class="fas fa-plus"></i> Aggiungi componente
                    </button>
                </div>
            </details>`}).join("");return`
        <details class="ordine-group" style="margin-bottom:8px">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore" style="font-size:1rem">${a(o.nome)}</span>
                    <span style="color:#94a3b8;font-size:.78rem;font-weight:500;margin-left:8px">${d} sez. \xB7 ${r} comp.</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center">
                    <button type="button" class="btn-archive-action primary" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenView('${a(o.id)}')" title="Usa kit / crea ordine">
                        <i class="fas fa-play"></i> Usa
                    </button>
                    <button type="button" class="btn-archive-action" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenConfig('${a(o.id)}')" title="Configurazione avanzata">
                        <i class="fas fa-gear"></i> Config
                    </button>
                    <button type="button" class="btn-trash-modern"
                        onclick="event.preventDefault();event.stopPropagation();_kitQDelKit('${a(o.id)}')" title="Elimina kit">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </div>
            </summary>
            <div class="ordine-items" style="padding:0">
                ${s.length?c:'<p class="acquisti-subtitle" style="padding:12px 16px;margin:0">Nessuna sezione. Aggiungi una sezione per iniziare.</p>'}
                <div style="padding:8px 12px;border-top:1px solid #f1f5f9">
                    <button type="button" class="btn-archive-action" style="font-size:.8rem"
                        onclick="_kitQAddSezOpen('${a(o.id)}')">
                        <i class="fas fa-folder-plus"></i> Aggiungi sezione
                    </button>
                </div>
            </div>
        </details>`}).join("");i.innerHTML=e}function Qt(){let t=document.getElementById("kit-page-actions");t&&(D==="kits"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>':D==="anagrafiche"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>':t.innerHTML="")}function T(t){D=t,document.querySelectorAll("#kit-tab-bar .acq-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)});let{kits:i}=b(),n=document.getElementById("kit-main-content");n&&(t==="kits"?yi(i,n):t==="anagrafiche"?bi(i,n):t==="distinte"&&hi(i,n),Qt())}function bi(t,i){if(!i)return;let n=J();if(!n.length){i.innerHTML=`
            <div style="padding:24px 0;text-align:center">
                <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun componente salvato. Aggiungi il primo componente riutilizzabile.</p>
                <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi componente</button>
            </div>`;return}let e=n.reduce((s,r)=>{let d=r.categoria||"Senza categoria";return s[d]=s[d]||[],s[d].push(r),s},{}),o="";for(let[s,r]of Object.entries(e))o+=`<details class="ordine-group" open>
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${a(s)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${r.length} componente${r.length!==1?"i":""}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">`,o+=r.map(d=>`
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        <div style="font-weight:600;color:#1e293b">${a(d.nome)}${d.codice?` <span style="color:#94a3b8;font-size:.85rem;font-weight:400">\xB7 ${a(d.codice)}</span>`:""}</div>
                        ${d.descrizione?`<div style="color:#94a3b8;font-size:.82rem;margin-top:2px">${a(d.descrizione)}</div>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitOpenAnagraficaModal('${a(d.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questo componente?')) _kitDeleteAnagrafica('${a(d.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`).join(""),o+="</div></details>";i.innerHTML=o}function hi(t,i){if(!i)return;let n=ot();if(!n.length){i.innerHTML='<div style="padding:24px 0;text-align:center"><p class="acquisti-subtitle">Nessuna distinta salvata.</p></div>';return}let e=n.map(o=>`
        <details class="ordine-group">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${a(o.nome)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${a(o.kitNome||"")}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        ${o.documento?`<div style="font-size:.85rem;color:#64748b">${a(o.documento)}</div>`:""}
                        <div style="color:#94a3b8;font-size:0.8rem;margin-top:2px">${a(new Date(o.createdAt).toLocaleString())} \xB7 ${a(o.createdBy)}</div>
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitDistintaOpenPrint('${a(o.id)}')"><i class="fas fa-print"></i> Stampa</button>
                        <button type="button" class="btn-archive-action" onclick="_kitDistintaApplyToDraft('${a(o.id)}')"><i class="fas fa-file-import"></i> Applica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questa distinta?')) _kitDistintaDelete('${a(o.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </details>`).join("");i.innerHTML=e}function zi(t){let{kits:i}=b(),n=i.find(c=>c.id===t);if(!n){z("Kit non trovato \u26A0\uFE0F");return}let e=tt(n);G(e).documento||(j(t,function(c){di(c)}),e=tt(n));let o=St(n,e);if(!o.totalePezzi||!o.totaleRighe){z("Componi prima un ordine per generare la distinta stampabile.","warning");return}let s=ot(),r=G(e),d={id:C(),kitId:n.id,kitNome:n.nome,nome:r.documento||`Distinta-${Date.now()}`,documento:r.documento||"",createdAt:Date.now(),createdBy:V?.nome||"Sistema",orderDraftSnapshot:e,distintaSnapshot:o};s.unshift(d),Ct(s),z("Distinta salvata \u2713"),D==="distinte"&&T("distinte")}function J(){try{let t=localStorage.getItem(ii),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Vt(t){try{localStorage.setItem(ii,JSON.stringify(t||[]));try{localStorage.setItem(Xi,Date.now())}catch{}}catch{}}function _e(){if(document.getElementById("modal-kit-anagrafica-edit"))return;let t=document.createElement("div");t.innerHTML=`
    <div id="modal-kit-anagrafica-edit" class="modal-overlay" style="display:none" onclick="if(event.target===this)_kitCloseAnagraficaModal()">
      <div class="modal-content">
        <h2 style="margin:0 0 4px;font-size:1.05rem;font-weight:700;color:#1e293b"><i class="fas fa-plus" style="color:#6366f1;margin-right:6px"></i>Aggiungi componente</h2>
        <p style="color:#94a3b8;font-size:0.82rem;margin:0 0 16px">Crea un componente riutilizzabile per i kit.</p>
        <label class="modal-label">Componente *</label>
        <input id="anag-componente" class="input-field-modern" placeholder="Nome componente" maxlength="120" style="margin-bottom:12px">
        <label class="modal-label">Codice</label>
        <input id="anag-codice" class="input-field-modern" placeholder="Codice (opzionale)" maxlength="60" style="margin-bottom:12px">
        <label class="modal-label">Categoria</label>
        <input id="anag-categoria" class="input-field-modern" placeholder="Categoria (es. Elettronica, Meccanica)" maxlength="80" style="margin-bottom:12px">
        <label class="modal-label">Descrizione</label>
        <textarea id="anag-descrizione" class="input-field-modern" placeholder="Descrizione (opzionale)" rows="3" style="resize:vertical"></textarea>
        <div class="modal-footer">
          <button type="button" onclick="_kitCloseAnagraficaModal()" class="btn-modal-cancel">Annulla</button>
          <button type="button" class="btn-modal-send" onclick="_kitConfirmSaveAnagrafica()"><i class="fas fa-save"></i> Salva</button>
        </div>
      </div>
    </div>`,document.body.appendChild(t.firstElementChild)}function Ce(t){_e();let i=document.getElementById("modal-kit-anagrafica-edit");if(!i)return;let n=document.getElementById("anag-componente"),e=document.getElementById("anag-codice"),o=document.getElementById("anag-categoria"),s=document.getElementById("anag-descrizione");if(t){let r=J().find(d=>d.id===t);r&&(n&&(n.value=r.nome||""),e&&(e.value=r.codice||""),o&&(o.value=r.categoria||""),s&&(s.value=r.descrizione||""),i.dataset.editId=t)}else n&&(n.value=""),e&&(e.value=""),o&&(o.value=""),s&&(s.value=""),delete i.dataset.editId;i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function wi(){let t=document.getElementById("modal-kit-anagrafica-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function $e(){let t=document.getElementById("modal-kit-anagrafica-edit");if(!t)return;let i=t.dataset.editId,n=(document.getElementById("anag-componente")?.value||"").trim();if(!n){z("Inserisci il nome del componente","warning");return}let e=(document.getElementById("anag-codice")?.value||"").trim(),o=(document.getElementById("anag-categoria")?.value||"").trim(),s=(document.getElementById("anag-descrizione")?.value||"").trim(),r=J();if(i){let d=r.findIndex(c=>c.id===i);d!==-1?r[d]={...r[d],nome:n,codice:e,categoria:o,descrizione:s,updatedAt:Date.now()}:r.unshift({id:C(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:V?.nome||"Sistema"})}else r.unshift({id:C(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:V?.nome||"Sistema"});Vt(r),wi(),z("Componente salvato \u2713"),D==="anagrafiche"&&T("anagrafiche")}function Se(t){let i=J().filter(n=>n.id!==t);Vt(i),D==="anagrafiche"&&T("anagrafiche"),z("Componente eliminato \u2713")}function Ie(t){let i=ot().find(o=>o.id===t);if(!i)return;let{kits:n}=b(),e=n.find(o=>o.id===i.kitId)||null;if(e){let o=window.open("","_blank");if(!o){z("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}o.document.open();try{o.document.write(ki(e,i.distintaSnapshot,i.orderDraftSnapshot))}catch{o.document.write("<pre>"+a(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>")}o.document.close(),o.focus()}else{let o=window.open("","_blank");if(!o){z("Popup bloccato","warning");return}o.document.open(),o.document.write("<pre>"+a(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>"),o.document.close(),o.focus()}}function xe(t){let i=ot().find(e=>e.id===t);if(!i)return;let n=_t();n[i.kitId]=i.orderDraftSnapshot||{},ri(n),z("Bozza ordine ripristinata per il kit selezionato \u2713")}function Ae(t){let i=ot().filter(n=>n.id!==t);Ct(i),D==="distinte"&&T("distinte"),z("Distinta eliminata \u2713")}function Me(t){B=t,_i="ordine",R()}function R(){let{kits:t}=b(),i=t.find(f=>f.id===B);if(!i){pt();return}let n=document.getElementById("contenitore-dati");if(mi(i)){me(i,n);return}let e=O(i),o=tt(i),s=G(o),r=St(i,o),d=r.selectedVarianti.length?r.selectedVarianti.map(f=>`<span class="kit-meta-pill"><strong>${nt(o,f.key)}</strong> \xD7 ${a(f.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=s.ordiniCliente.length?s.ordiniCliente.map(f=>`<span class="kit-order-ref-chip">${a(f)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(f)})' aria-label="Rimuovi ordine ${a(f)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=Rt(i),m=gi(i,l),p=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(f=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${a(f.nome)}</div>
                <div class="kit-compose-options">${(f.opzioni||[]).map(h=>`
                        <button type="button" class="kit-compose-option ${l[f.id]===h.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${a(i.id)}','${a(f.id)}','${a(h.id)}')">
                        ${a(h.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',u=r.selectedVarianti.length?r.selectedVarianti.map(f=>{let h=nt(o,f.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${a(f.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(f.selections)&&f.selections.length?f.selections.map(M=>a(M.opzioneNome)).join(" \xB7 "):a(f.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(f.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${h}"
                           onchange="_kitOrdineSet('${a(i.id)}','${a(f.key)}',this.value)"
                           oninput="_kitOrdineSet('${a(i.id)}','${a(f.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(f.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${a(i.id)}','${a(f.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,g=r.totalePezzi?r.sezioni.map(f=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${a(f.nome)}</div>
                ${f.righe.map(h=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${a(h.nome)}</div>
                            ${h.dettaglio?`<div class="kit-distinta-row-meta">${a(h.dettaglio)}</div>`:""}
                            ${h.noteConfig?`<div class="kit-distinta-row-note">${a(h.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${U(h.totale)} ${a(h.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,y=r.avvisi.length?r.avvisi.map(f=>`
            <div class="kit-distinta-alert ${f.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${a(f.nome)}</div>
                <div class="kit-distinta-alert-body">${a(f.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${f.totaleCoinvolto} pz \xB7 ${a(f.variantiLabel)}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Nessun avviso particolare per l\u2019ordine attuale.</div>';n.innerHTML=`
    <div class="kit-page">
            <div class="kit-view-header">
            <button type="button" class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${a(i.nome)}</span>
            <button type="button" class="kit-gear-btn-inline" onclick="_kitOpenConfig('${a(i.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Ordine in composizione</div>
                    <div class="kit-order-summary-total">${r.totalePezzi} pezzi</div>
                </div>
                <div class="kit-order-summary-actions">
                        <button type="button" class="kit-btn-secondary" onclick="_kitOpenPrintPreview('${a(i.id)}')"><i class="fas fa-print"></i> Anteprima stampa</button>
                        <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenSaveDistintaModal('${a(i.id)}')"><i class="fas fa-save"></i> Salva distinta</button>
                        <button type="button" class="kit-btn-secondary" onclick="_kitOrdineReset('${a(i.id)}')"><i class="fas fa-rotate-left"></i> Azzera ordine</button>
                </div>
            </div>
            <div class="kit-order-summary-note">Questa bozza ordine resta locale sul dispositivo e serve solo per generare la distinta base di approvvigionamento.</div>
            <div class="kit-order-meta-grid">
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Ordini cliente</div>
                    <div class="ordine-autocomplete-wrapper kit-order-autocomplete-wrapper">
                        <input class="kit-order-meta-input" id="kit-order-ref-input-${a(i.id)}" type="text" placeholder="Cerca e collega un ordine cliente"
                               oninput="_kitOrderSearch('${a(i.id)}', this.value)"
                               onfocus="_kitOrderSearch('${a(i.id)}', this.value)"
                               onblur="_kitOrderHideSearch('${a(i.id)}')">
                        <div id="kit-order-autocomplete-${a(i.id)}" class="ordine-autocomplete-list"></div>
                    </div>
                    <div class="kit-order-ref-list">${c}</div>
                    <div class="kit-order-meta-help">Il cliente viene derivato dagli ordini selezionati. Se gli ordini appartengono a clienti diversi, in stampa il riferimento resta vuoto.</div>
                </div>
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Dati stampa</div>
                    <div class="kit-order-meta-row"><span>Cliente</span><strong>${a(s.cliente||"")}</strong></div>
                    <div class="kit-order-meta-row"><span>Documento</span><strong>${a(s.documento||"")}</strong></div>
                </div>
            </div>
            <div class="kit-order-summary-badges">${d}</div>
        </div>

        <div class="kit-order-layout">
            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-hand-pointer"></i> Componi ordine</div>
                <div class="kit-cfg-help">Scegli i pulsanti dell'elettronica, inserisci la quantit\xE0 e aggiungi quella configurazione all'ordine.</div>
                <div class="kit-compose-builder">
                    ${p}
                    <div class="kit-compose-footer">
                        <div class="kit-compose-selected">
                            <div class="kit-compose-selected-label">Configurazione pronta</div>
                            <div class="kit-compose-selected-name">${m?a(m.nome):"Completa prima tutte le scelte"}</div>
                        </div>
                        <div class="kit-order-stepper">
                            <input class="kit-order-stepper-input" id="kit-compose-qty-${a(i.id)}" type="number" min="1" value="1">
                            <button type="button" class="kit-spedisci-btn" onclick="_kitComposeAdd('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
                        </div>
                    </div>
                </div>
                <div class="kit-order-lines">${u}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${r.totaleRighe} righe materiali \xB7 ${r.avvisi.length} avvisi</div>
                ${g}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${y}
            </section>
        </div>
    </div>`,ft(n),li().catch(()=>{})}function Ee(){B=null,pt()}function qe(t){_i=t,R()}function Oe(t){j(t,function(i,n){for(let e of O(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Ne(t,i,n){try{window._kitSuppressNextFade=!0}catch{}j(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function Be(t,i,n){try{window._kitSuppressNextFade=!0}catch{}j(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function Te(t){j(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=lt({})})}function De(t,i){j(t,function(n){n[i]=0})}function wt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${a(e.ordine)}</span>
            <span class="ac-cliente">${a(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function Le(t,i){let n=String(i||"").trim().toLowerCase();if(!n){wt(t,[]);return}li().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);wt(t,o)})}function Ke(t){setTimeout(function(){wt(t,[])},140)}function Pe(t,i,n){let e=dt(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}j(t,function(s){let r=G(s);r.ordiniCliente=[...new Set(r.ordiniCliente.concat(e))],r.cliente=pi(r.ordiniCliente,{[e]:n}),$t(s,r)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),wt(t,[])}function Re(t,i){let n=dt(i);try{window._kitSuppressNextFade=!0}catch{}j(t,function(e){let o=G(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=pi(o.ordiniCliente),$t(e,o)})}function He(t,i,n){let{kits:e}=b(),o=e.find(r=>r.id===t);if(!o)return;let s=Rt(o);if(s[i]=n,kt[t]=s,B===t){try{window._kitSuppressNextFade=!0}catch{}R()}}function je(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;let e=gi(n,Rt(n));if(!e){z("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){z("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(Mt[t])return;Mt[t]=Date.now(),setTimeout(function(){try{delete Mt[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}j(t,function(r){r[e.key]=nt(r,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function Ci(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=b(),s=o.find(h=>h.id===B);if(!s)return;let r=(s.sezioni||[]).find(h=>h.id===n),d=r&&(r.componenti||[]).find(h=>h.id===i);if(!d||!Lt(d))return;d.caricato=e,I(o);let l=ze(s)[i]||0,m=Math.max(0,l-e),u=we(s)[i]||0,g=t.closest("tr");if(!g)return;let y=g.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");y&&(y.textContent=l===0?"\u2014":m,y.className=l===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let f=g.querySelector(".kit-car-liberi");f&&(u>0?(f.textContent=Math.max(0,e-u)+" lib.",f.style.display=""):f.style.display="none")}function Qe(t,i,n){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),I(e),B===t&&R())}function Ve(t,i,n){let{kits:e}=b(),o=e.find(r=>r.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),I(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function Ue(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${a(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${a(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let r=(e.righe||[]).reduce((l,m)=>l+m.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${a(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${a(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${r} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${a(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${c}<div class="kit-sped-bom-divider">componenti scaricati</div>${d}</div>
            </details>`}if(e.tipo==="reso"){let r=e.totPz||0,d=(e.items||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${a(m.nome)}</span><span class="kit-mov-qty carico">\xD7${m.qty}</span></div>`).join(""),c=(e.righe||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${a(m.mat)}</span><span class="kit-mov-qty carico">+${m.qty}</span></div>`).join(""),l=(e.scartate||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${a(m.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${m.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\u{1F4E6} Rientro \xD7${r} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${a(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">
                ${d}
                ${c?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${c}`:""}
                ${l?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${l}`:""}
              </div>
            </details>`}return`<div class="kit-mov-item ${a(e.tipo)}">
            <span class="kit-mov-badge ${a(e.tipo)}">${e.tipo==="carico"?"CARICO":"SCARICO"}</span>
            <span class="kit-mov-mat">${a(e.mat)}</span>
            <span class="kit-mov-qty ${a(e.tipo)}">${e.tipo==="carico"?"+":"\u2212"}${e.qty}</span>
            ${e.nota?`<span class="kit-mov-nota">${a(e.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${e.ts}</span>
            ${s}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function Fe(t,i){let{kits:n}=b(),e=n.find(f=>f.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),r=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),m=(r?.value||"").trim(),p=(e.sezioni||[]).find(f=>f.id===c),u=p&&(p.componenti||[]).find(f=>f.id===d);if(!u||!Lt(u))return;i==="carico"?u.caricato=(parseInt(u.caricato)||0)+l:u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:m,mat:u.nome,ts:jt()}),I(n),s&&(s.value=1),r&&(r.value="");let g=document.getElementById("kit-mov-list-"+t);g&&(g.innerHTML=Ue(e,Ht()));let y=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);y&&(y.value=u.caricato,Ci(y))}function Ge(t,i){if(!Ht())return;let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&Je(t,i,o)}function Je(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${a(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${a(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let r=document.getElementById("btn-kit-del-ok");r&&(r.onclick=()=>Si(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function $i(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Si(t,i){$i();let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(r=>r.id===o.sid);for(let r of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===r.cid||l.nome===r.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+r.qty)}for(let r of o.items||[])r.saId&&e.pronti&&(e.pronti[r.saId]=(parseInt(e.pronti[r.saId])||0)+r.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let r of e.sezioni||[]){let d=(r.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=Math.max(0,(parseInt(r.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=(parseInt(r.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),I(n),B===t&&R(),z("Movimento eliminato \u2713")}}function We(t,i){if(!Ht())return;let{kits:n}=b(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let r=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");r&&(r.innerHTML=`<span class="kit-mov-badge ${a(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${a(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function Ii(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ye(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);Ii();let{kits:e}=b(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let r=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){z("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==r.qty){let l=d-r.qty;for(let m of o.sezioni||[]){let p=(m.componenti||[]).find(u=>u.id===r.cid);if(p){r.tipo==="carico"?p.caricato=Math.max(0,(parseInt(p.caricato)||0)+l):p.caricato=Math.max(0,(parseInt(p.caricato)||0)-l);break}}}o.movimenti[s]={...r,qty:d,nota:c},I(e),B===i&&R(),z("Movimento aggiornato \u2713")}function Ze(t){let{kits:i}=b(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){z("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,m=vi(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${a(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${a(c.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let r=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&r&&(d.value=r.value||""),d&&!r&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function xi(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Xe(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;xi();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=b(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),r=[],d=[];for(let l of n){let m=(o.sottoAssembly||[]).find(u=>u.id===l);if(!m)continue;let p=Number.parseInt(o.pronti?.[l],10)||0;if(p){r.push({saId:l,nome:m.nome,qty:p});for(let u of o.sezioni||[])for(let g of u.componenti||[]){if(K(g))continue;let y=L(g,m.varianteKey);if(!y)continue;let f=p*y;g.caricato=Math.max(0,(parseInt(g.caricato)||0)-f);let h=d.find(M=>M.cid===g.id);h?h.qty+=f:d.push({cid:g.id,mat:g.nome,qty:f})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:r,righe:d,nota:s,ts:jt()}),I(e);let c=r.reduce((l,m)=>l+m.qty,0);z(`Spedizione registrata: ${c} pz \u2713`),B===i&&R()}function tn(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let r=n.sottoAssembly||[];o.innerHTML=r.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':r.map(d=>{let c=vi(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${a(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${a(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${a(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),Ut(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Ai(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function en(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&Ut(e.dataset.kitId)}function Ut(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;let e={};for(let r of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+r.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let m of l.componenti||[]){if(K(m))continue;let p=L(m,r.varianteKey);p&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+c*p})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,r])=>r.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([r,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${a(r)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${a(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function nn(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=b(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;m>0&&o.push({saId:l.id,nome:l.nome,qty:m})}if(!o.length){z("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],r=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let m=l.dataset.cid,p=Number.parseInt(l.dataset.qty,10),u=[...e.sezioni||[]].flatMap(g=>g.componenti||[]).find(g=>g.id===m)?.nome||"?";l.checked?s.push({cid:m,mat:u,qty:p}):r.push({cid:m,mat:u,qty:p})});for(let l of s)for(let m of e.sezioni||[]){let p=(m.componenti||[]).find(u=>u.id===l.cid);if(p){p.caricato=(parseInt(p.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,m)=>l+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:r,nota:d,ts:jt(),totPz:c}),I(n),Ai(),z(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),B===i&&R()}function on(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=b();At({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(bt,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function Ei(t){H=t;let i=document.getElementById("modal-kit-config");i&&(P(),i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function sn(){let t=document.getElementById("modal-kit-config");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300),H=null)}function an(t){if(!H)return;let i=(t?.value||"").trim();i&&($(H,n=>{n.nome=i},!1),T("kits"))}function P(){if(!H)return;let{kits:t}=b(),i=t.find(f=>f.id===H);if(!i)return;let n=J(),e=["pz","mt","cm","mm","kg","g","lt","ml"],o=document.getElementById("kit-cfg-modal-nome");o&&(o.value=i.nome||"");let s=[...new Set(n.map(f=>(f.categoria||"").trim()).filter(Boolean))].sort(),r=["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ef4444","#14b8a6","#f97316","#84cc16"],d=f=>r[s.indexOf(f)%r.length]||"#94a3b8",l=(i.sezioni||[]).flatMap(f=>(f.componenti||[]).map(h=>({comp:h,sez:f})));function m(f){return n.find(h=>h.nome===f.nome&&(!f.codice||!h.codice||h.codice===f.codice))||n.find(h=>h.nome===f.nome)}let p;l.length===0?p=`<div class="kcfg-empty">
            <i class="fas fa-inbox" style="font-size:1.3rem;display:block;margin-bottom:6px;opacity:.35"></i>
            Nessun componente ancora. Aggiungili dal catalogo qui sotto.
        </div>`:p='<div class="kcfg-list">'+l.map(({comp:f,sez:h})=>{let M=m(f),Y=M?(M.categoria||"").trim():"",Q=Y?d(Y):"#e2e8f0",A=yt(f.unitaMisura,"pz"),ut=e.map(X=>`<option value="${X}"${A===X?" selected":""}>${X}</option>`).join("");return`<div class="kcfg-comp-row">
                    <span class="kcfg-dot" style="background:${Q}"></span>
                    <span class="kcfg-name">${a(f.nome)}${f.codice?`<span class="kcfg-code">&middot;&thinsp;${a(f.codice)}</span>`:""}</span>
                    <input type="number" min="0" step="any" class="input-field-modern kcfg-qty"
                        value="${f.qtaBase??1}" title="Quantit&#224;"
                        onchange="_kitCfgModalUpdateComp('${a(i.id)}','${a(h.id)}','${a(f.id)}','qtaBase',this.value)">
                    <select class="input-field-modern kcfg-unit"
                        onchange="_kitCfgModalUpdateComp('${a(i.id)}','${a(h.id)}','${a(f.id)}','unitaMisura',this.value)">
                        ${ut}
                    </select>
                    <button type="button" class="btn-trash-modern" style="width:28px;height:28px;flex-shrink:0"
                        onclick="_kitCfgModalDelComp('${a(i.id)}','${a(h.id)}','${a(f.id)}')">
                        <i class="fas fa-times" style="font-size:.75rem"></i>
                    </button>
                </div>`}).join("")+"</div>";let u=new Set(l.map(({comp:f})=>f.nome)),g="";n.length===0?g=`<div class="kcfg-empty" style="background:#fef3c7;border-color:#fde68a;color:#92400e;text-align:left">
            <i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>
            Catalogo vuoto. Vai nella tab <strong>Anagrafiche</strong> per aggiungere componenti.
        </div>`:g=s.map(h=>{let M=n.filter(A=>(A.categoria||"").trim()===h&&!u.has(A.nome));if(M.length===0)return"";let Y=d(h),Q=M.map(A=>`<button type="button" class="kcfg-pill"
                    onclick="_kitCfgModalAddAnag('${a(i.id)}','${a(A.id)}')"
                    title="Aggiungi ${a(A.nome)}">
                    <i class="fas fa-plus" style="font-size:.58rem;opacity:.6;margin-right:3px"></i>${a(A.nome)}${A.codice?`<span class="kcfg-pill-code">${a(A.codice)}</span>`:""}
                </button>`).join("");return`<div class="kcfg-cat-strip">
                <span class="kcfg-cat-badge" style="--kcfg-dot:${Y}">${a(h)}</span>
                <div class="kcfg-pills">${Q}</div>
            </div>`}).filter(Boolean).join("")||`<p style="color:#94a3b8;font-size:.82rem;margin:4px 0;padding:6px 2px">
                   <i class="fas fa-check-circle" style="color:#10b981;margin-right:5px"></i>
                   Tutti i componenti del catalogo sono gi&#224; nel kit.
               </p>`;let y=document.getElementById("kit-cfg-modal-bom-panel");y&&(y.innerHTML=`
        <div class="kcfg-section-lbl">Nel kit (${l.length})</div>
        ${p}
        ${n.length>0?`
        <div class="kcfg-section-lbl" style="margin-top:18px">Aggiungi dal catalogo</div>
        <div style="padding:2px 0">${g}</div>`:g}
        <div style="margin-top:14px;padding-top:10px;border-top:1px solid #f1f5f9">
            <button type="button" class="btn-add-dashed" style="font-size:.79rem;padding:8px 14px;border-radius:10px"
                onclick="_kitCfgModalAddCompFree()">
                <i class="fas fa-pen" style="margin-right:6px;opacity:.55"></i>Aggiungi componente manuale
            </button>
        </div>`)}function rn(t,i,n,e){$(t,o=>{let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s[n]=e.trim()||s[n])},!0)}function cn(t,i){confirm("Eliminare questa sezione e tutti i componenti?")&&$(t,n=>{n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)},!0)}function dn(t,i){let e=J().find(s=>s.id===i);if(!e)return;let o=(e.categoria||"").trim()||"Generali";$(t,s=>{let r=(s.sezioni||[]).find(d=>d.nome.trim()===o);r||(r={id:C(),nome:o,componenti:[]},s.sezioni=s.sezioni||[],s.sezioni.push(r)),r.componenti=r.componenti||[],r.componenti.push({id:C(),nome:e.nome,codice:e.codice||"",qtaBase:1,unitaMisura:e.unitaMisura||"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function ln(){H&&$(H,t=>{let i=(t.sezioni||[]).find(n=>n.nome==="Liberi");i||(i={id:C(),nome:"Liberi",componenti:[]},t.sezioni=t.sezioni||[],t.sezioni.push(i)),i.componenti=i.componenti||[],i.componenti.push({id:C(),nome:"Nuovo componente",codice:"",qtaBase:1,unitaMisura:"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function pn(t,i,n,e,o){$(t,s=>{let r=(s.sezioni||[]).find(c=>c.id===i),d=r&&(r.componenti||[]).find(c=>c.id===n);d&&(e==="qtaBase"?(d.qtaBase=parseFloat(o)||1,d.regola&&(d.regola.qtyBase=d.qtaBase)):d[e]=o)},!0)}function mn(t,i,n,e,o){$(t,s=>{let r=(s.sezioni||[]).find(c=>c.id===i),d=r&&(r.componenti||[]).find(c=>c.id===n);d&&(d.regola=d.regola||{},e==="tipo"?(d.regola.tipo=o,o==="gruppo"&&!d.regola.asseId&&s.assiConfigurazione?.length&&(d.regola.asseId=s.assiConfigurazione[0].id),o==="gruppo"&&(d.regola.opzioneIds=d.regola.opzioneIds||[])):e==="asseId"?(d.regola.asseId=o,d.regola.opzioneIds=[]):d.regola[e]=o)},!0)}function un(t,i,n){$(t,e=>{let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))},!0)}function fn(t){$(t,i=>{i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:C(),nome:"Nuovo gruppo",key:F("","ax"+i.assiConfigurazione.length),opzioni:[]})},!0)}function gn(t,i){confirm("Eliminare questo gruppo elettronico?")&&$(t,n=>{n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)},!0)}function kn(t,i,n,e){$(t,o=>{let s=(o.assiConfigurazione||[]).find(r=>r.id===i);s&&(s[n]=e)},!1)}function vn(t,i){$(t,n=>{let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;e.opzioni=e.opzioni||[];let o=e.opzioni.length+1;e.opzioni.push({id:C(),key:F("","opz"+o),nome:"Nuova opzione",codice:""})},!0)}function yn(t,i,n){$(t,e=>{let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))},!0)}function bn(t,i,n,e,o){$(t,s=>{let r=(s.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(d[e]=o)},!1)}function qi(){let t=document.getElementById("modal-kit-crea");if(!t)return;let i=document.getElementById("kit-crea-nome");i&&(i.value=""),t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>i&&i.focus(),80)}function Oi(){let t=document.getElementById("modal-kit-crea");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function hn(){let t=(document.getElementById("kit-crea-nome")?.value||"").trim();if(!t){z("Inserisci un nome per il kit","warning");return}let{kits:i}=b(),n={id:C(),nome:t,schemaVersion:Bt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};i.push(n),I(i),Oi(),setTimeout(()=>T("kits"),320)}function zn(t){rt.kitId=t;let i=document.getElementById("modal-kit-qadd-sez");if(!i)return;let n=document.getElementById("kit-qadd-sez-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function Ni(){let t=document.getElementById("modal-kit-qadd-sez");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function wn(){let t=(document.getElementById("kit-qadd-sez-nome")?.value||"").trim()||"Nuova sezione",{kits:i}=b(),n=i.find(e=>e.id===rt.kitId);n&&(n.sezioni=n.sezioni||[],n.sezioni.push({id:C(),nome:t,componenti:[]}),I(i),Ni(),setTimeout(H?()=>P():()=>T("kits"),320))}function _n(t,i){rt.kitId=t,rt.sezId=i;let n=document.getElementById("modal-kit-qadd-comp");if(!n)return;let e=J(),o=document.getElementById("kit-qadd-comp-source-cat"),s=document.getElementById("kit-qadd-comp-source-free");e.length?(o&&(o.checked=!0),qt("cat")):(s&&(s.checked=!0),qt("free"));let r=[...new Set(e.map(u=>u.categoria||"Senza categoria"))].sort(),d=document.getElementById("kit-qadd-comp-cat");d&&(d.innerHTML=r.map(u=>`<option value="${a(u)}">${a(u)}</option>`).join(""),Bi());let c=document.getElementById("kit-qadd-comp-qty");c&&(c.value="1");let l=document.getElementById("kit-qadd-comp-unit");l&&(l.value="pz");let m=document.getElementById("kit-qadd-comp-nome");m&&(m.value="");let p=document.getElementById("kit-qadd-comp-codice");p&&(p.value=""),n.style.display="flex",n.offsetHeight,n.classList.add("active")}function qt(t){let i=document.getElementById("kit-qadd-comp-cat-section"),n=document.getElementById("kit-qadd-comp-free-section");i&&(i.style.display=t==="cat"?"":"none"),n&&(n.style.display=t==="free"?"":"none")}function Bi(){let t=document.getElementById("kit-qadd-comp-cat"),i=document.getElementById("kit-qadd-comp-comp");if(!t||!i)return;let n=t.value,o=J().filter(s=>(s.categoria||"Senza categoria")===n);i.innerHTML=o.length?o.map(s=>`<option value="${a(s.id)}">${a(s.nome)}${s.codice?" \xB7 "+a(s.codice):""}</option>`).join(""):'<option value="">Nessun componente in questa categoria</option>'}function Ti(){let t=document.getElementById("modal-kit-qadd-comp");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Cn(){let t=document.getElementById("kit-qadd-comp-source-cat")?.checked,i="",n="";if(t){let l=document.getElementById("kit-qadd-comp-comp")?.value;if(!l){z("Seleziona un componente dal catalogo","warning");return}let m=J().find(p=>p.id===l);if(!m){z("Componente non trovato nel catalogo","warning");return}i=m.nome,n=m.codice||""}else{if(i=(document.getElementById("kit-qadd-comp-nome")?.value||"").trim(),!i){z("Inserisci il nome del componente","warning");return}n=(document.getElementById("kit-qadd-comp-codice")?.value||"").trim()}let e=parseFloat(document.getElementById("kit-qadd-comp-qty")?.value)||1,o=document.getElementById("kit-qadd-comp-unit")?.value||"pz",{kits:s}=b(),r=s.find(c=>c.id===rt.kitId);if(!r)return;let d=(r.sezioni||[]).find(c=>c.id===rt.sezId);d&&(d.componenti=d.componenti||[],d.componenti.push({id:C(),nome:i,codice:n,qtaBase:e,qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:o,applicazioneTipo:"sempre"}),I(s),Ti(),setTimeout(H?()=>P():()=>T("kits"),320))}function $n(t,i,n,e,o){let{kits:s}=b(),r=s.find(l=>l.id===t);if(!r)return;let d=(r.sezioni||[]).find(l=>l.id===i);if(!d)return;let c=(d.componenti||[]).find(l=>l.id===n);c&&(e==="qtaBase"?c.qtaBase=parseFloat(o)||0:c[e]=o,I(s))}function Sn(t,i,n){if(!n.trim())return;let{kits:e}=b(),o=e.find(r=>r.id===t);if(!o)return;let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s.nome=n.trim(),I(e))}function In(t,i,n){let{kits:e}=b(),o=e.find(r=>r.id===t);if(!o)return;let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s.componenti=(s.componenti||[]).filter(r=>r.id!==n),I(e),T("kits"))}function xn(t,i){if(!confirm("Rimuovere questa sezione e tutti i suoi componenti?"))return;let{kits:n}=b(),e=n.find(o=>o.id===t);e&&(e.sezioni=(e.sezioni||[]).filter(o=>o.id!==i),I(n),T("kits"))}function An(t){if(!confirm("Eliminare questo kit? L'operazione non \xE8 reversibile."))return;let{kits:i}=b(),n=i.filter(e=>e.id!==t);I(n),T("kits")}function Mn(){qi()}function Di(t){H=t,Ei(t)}function It(t,i,n=""){let{kits:e}=b(),o=e.find(c=>c.id===t),s=e.find(c=>c.id!==t&&(c.sezioni||[]).length),r=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?r:s?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function Li(t){_=It(t,"import"),W(!0)}function En(t){_=It(t,"import-asse"),W(!0)}function qn(t,i){_=It(t,"copy",i),W(!0)}function at(){let t=document.getElementById("modal-kit-import");_=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function On(t){if(!_||t!=="import"&&t!=="copy"||_.mode===t)return;let i=_.currentKitId,n=t==="copy"?_.sectionId:"";_=It(i,t,n),W()}function Nn(t){_&&(_.search=String(t||""),W())}function Bn(t){if(!_)return;let{kits:i}=b(),n=i.find(e=>e.id===t);_.sourceKitId=t,_.mode==="import-asse"?_.asseId=n?.assiConfigurazione?.[0]?.id||"":_.sectionId=n?.sezioni?.[0]?.id||"",W()}function Tn(t){_&&(_.mode==="import-asse"?_.asseId=t:_.sectionId=t,W())}function Dn(t,i){if(!_||_.mode!=="copy")return;let n=new Set(_.targetKitIds||[]);i?n.add(t):n.delete(t),_.targetKitIds=[...n],W()}function Ln(){if(!_||_.mode!=="copy")return;let{kits:t}=b(),i=t.filter(e=>e.id!==_.currentKitId&&zt(e.nome,_.search)),n=new Set(_.targetKitIds||[]);for(let e of i)n.add(e.id);_.targetKitIds=[...n],W()}function Kn(){!_||_.mode!=="copy"||(_.targetKitIds=[],W())}function W(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!_)return;let{kits:n}=b(),e=_,o=n.find(k=>k.id===e.currentKitId);if(!o){at();return}let s=[];e.mode==="import"?s=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length):e.mode==="import-asse"?s=n.filter(k=>k.id!==o.id&&(k.assiConfigurazione||[]).length):s=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!s.some(k=>k.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(k=>k!==o.id&&n.some(w=>w.id===k)));let r=n.find(k=>k.id===e.sourceKitId)||null,d=e.mode==="import-asse"?r?.assiConfigurazione||[]:r?.sezioni||[];e.mode==="import-asse"?d.some(k=>k.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(k=>k.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(r?.assiConfigurazione||[]).find(k=>k.id===e.asseId)||null:Dt(r,e.sectionId),l=s.filter(k=>zt(k.nome,e.search)),m=n.filter(k=>k.id!==o.id&&zt(k.nome,e.search)),p=document.getElementById("kit-import-subtitle"),u=document.getElementById("kit-import-search"),g=document.getElementById("kit-import-left-title"),y=document.getElementById("kit-import-right-title"),f=document.getElementById("kit-import-kit-list"),h=document.getElementById("kit-import-section-list"),M=document.getElementById("kit-import-target-wrap"),Y=document.getElementById("kit-import-target-list"),Q=document.getElementById("kit-import-preview"),A=document.getElementById("kit-import-confirm-btn"),ut=document.getElementById("kit-import-mode-import"),X=document.getElementById("kit-import-mode-copy");if(!p||!u||!g||!y||!f||!h||!M||!Y||!Q||!A||!ut||!X)return;ut.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),X.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),u.value=e.search,e.mode==="import"?(p.textContent=`Importa una sezione esistente dentro "${o.nome}".`,u.placeholder="Cerca kit sorgente\u2026",g.textContent="Kit sorgente",y.textContent=r?`Sezioni di ${r.nome}`:"Sezione",M.style.display="none",f.innerHTML=l.length?l.map(k=>{let w=k.id===e.sourceKitId;return`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${w?"checked":""}
                           onchange="_kitCfgSelectImportSource('${a(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(p.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,u.placeholder="Cerca kit destinazione\u2026",g.textContent="Kit sorgente",y.textContent="Sezione da copiare",M.style.display="flex",f.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${a(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,Y.innerHTML=m.length?m.map(k=>{let w=(e.targetKitIds||[]).includes(k.id),x=c?vt(o,k):null,N=`${(k.sezioni||[]).length} sezioni`;return x&&(x.hasTargetVarianti?x.needsReview?N=`${x.exactMatches}/${x.targetCount} combinazioni allineate`:N=`${x.targetCount}/${x.targetCount} combinazioni allineate`:N="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="checkbox" ${w?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${a(k.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(k.nome)}</span>
                        <span class="kit-import-option-meta">${a(N)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),h.innerHTML=d.length?d.map(k=>{let w=e.mode==="import-asse"?k.id===e.asseId:k.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${w?"checked":""}
                           onchange="_kitCfgSelectImportSection('${a(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${w?"checked":""}
                       onchange="_kitCfgSelectImportSection('${a(k.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(k.nome)}</span>
                    <span class="kit-import-option-meta">${(k.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let st=!1,v="kit-cfg-help kit-import-preview",S="";if(e.mode==="import"){if(!r)S="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)S="Seleziona una sezione da importare nel kit corrente.";else{let k=vt(r,o);st=!0,S=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 importata in <strong>${a(o.nome)}</strong>. `,k.hasTargetVarianti?k.needsReview?(v="kit-cfg-warn kit-import-preview",S+=`${k.exactMatches} combinazioni su ${k.targetCount} risultano allineate: controlla i coefficienti importati.`):S+=`Tutte le ${k.targetCount} combinazioni del kit destinazione risultano allineate.`:(v="kit-cfg-warn kit-import-preview",S+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}A.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")r?c?(st=!0,S=`L'asse <strong>${a(c.nome)}</strong> verr\xE0 importato in <strong>${a(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):S="Seleziona un asse da importare nel kit corrente.":S="Seleziona un kit sorgente per vedere gli assi disponibili.",A.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let k=n.filter(w=>(e.targetKitIds||[]).includes(w.id));if(!c)S="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!k.length)S="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{st=!0;let w=k.filter(x=>vt(o,x).needsReview).length;S=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 copiata in <strong>${k.length}</strong> kit.`,w>0?(v="kit-cfg-warn kit-import-preview",S+=` <strong>${w}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):S+=" Le combinazioni risultano allineate su tutti i kit selezionati."}A.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}Q.className=v,Q.innerHTML=S,A.disabled=!st,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let k=document.getElementById("kit-import-search");k&&k.focus()},40))}function Pn(){if(!_)return;let{kits:t}=b(),i=_,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Dt(e,i.sectionId),s=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!s){z("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(p=>String(p.nome||"").trim().toLowerCase()===String(s.nome||"").trim().toLowerCase()),m=0;if(l){l.opzioni=l.opzioni||[];for(let p of s.opzioni||[]){let u=String(p.codice||"").trim().toLowerCase(),g=!1;if(u&&(g=l.opzioni.some(y=>String(y.codice||"").trim().toLowerCase()===u&&u!=="")),g||(g=l.opzioni.some(y=>String(y.nome||"").trim().toLowerCase()===String(p.nome||"").trim().toLowerCase())),!g){let y=(l.opzioni||[]).length+1;l.opzioni.push({id:C(),key:F(p?.key,"opz"+y),nome:String(p?.nome||"").trim()||"opz"+y,codice:String(p?.codice||"").trim()}),m+=1}}I(t),at(),P(),m?z(`${m} opzione${m>1?"i":""} aggiunta${m>1?"e":""} all'asse "${s.nome}" \u2713`):z(`Nessuna nuova opzione trovata per l'asse "${s.nome}"`);return}n.assiConfigurazione.push(si(s,e,n)),I(t),at(),P(),z(`Asse "${s.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=vt(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(ht(o,e,n)),I(t),at(),P();let m="";l.hasTargetVarianti?l.needsReview&&(m=" Controlla le quantit\xE0 sulle combinazioni non allineate."):m=" Definisci poi gli assi del kit per rifinire i coefficienti.",z(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${m}`);return}let r=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!r.length){z("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let d=0;for(let l of r)vt(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(ht(o,e,l));I(t),at(),P();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xE0.`),z(`Sezione "${o.nome}" copiata in ${r.length} kit \u2713${c}`)}function Rn(t){let{kits:i}=b(),n=i.find(e=>e.id===t)||null;E={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},mt(!0)}function Ki(){let t=document.getElementById("modal-kit-presets");E=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Hn(t){E&&(E.search=String(t||""),mt())}function jn(t){E&&(E.selectedPresetId=t,mt())}function Qn(){if(!E)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){z("Inserisci il nome del preset \u26A0\uFE0F");return}let e=i?.value||"";Pi(E.currentKitId,e,n)}function Pi(t,i,n){let{kits:e}=b(),o=e.find(d=>d.id===t);if(!o){z("Kit non trovato \u26A0\uFE0F");return}let s=Dt(o,i);if(!s){z("Seleziona una sezione valida \u26A0\uFE0F");return}let r=ct();r.push({id:C(),nome:String(n||"").trim(),sourceKitId:o.id,sezione:JSON.parse(JSON.stringify(s))}),Pt(r),z("Preset salvato \u2713"),E&&E.currentKitId===t&&mt(),P()}function Vn(t){if(!E)return;let i=ct(),n=t||E.selectedPresetId,e=i.find(d=>d.id===n);if(!e){z("Seleziona un preset \u26A0\uFE0F");return}let{kits:o}=b(),s=o.find(d=>d.id===E.currentKitId),r=o.find(d=>d.id===e.sourceKitId)||null;if(!s){z("Kit non trovato \u26A0\uFE0F");return}s.sezioni=s.sezioni||[],s.sezioni.push(ht(e.sezione,r,s)),I(o),Ki(),P(),z(`Preset "${e.nome}" applicato \u2713`)}function Un(t,i){let n=ct(),e=n.find(o=>o.id===t);if(!e){z("Preset non trovato \u26A0\uFE0F");return}e.nome=String(i||"").trim()||e.nome,Pt(n),z("Nome aggiornato \u2713"),mt()}function Fn(t){let i=ct().filter(n=>n.id!==t);Pt(i),E&&(E.selectedPresetId=""),mt(),z("Preset eliminato \u2713")}function mt(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!E)return;let n=ct(),e=E,o=b().kits.find(u=>u.id===e.currentKitId),s=n.filter(u=>zt(u.nome,e.search)),r=document.getElementById("preset-list"),d=document.getElementById("preset-preview"),c=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),m=document.getElementById("preset-apply-btn");if(!r||!d||!c||!l||!m)return;r.innerHTML=s.length?s.map(u=>{let g=u.id===e.selectedPresetId;return`<label class="kit-import-option ${g?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${g?"checked":""} onchange="_kitSelectPreset('${a(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let p=n.find(u=>u.id===e.selectedPresetId)||null;if(p){let u=p.sourceKitId&&b().kits.find(g=>g.id===p.sourceKitId)?.nome||"";d.innerHTML=`<div style="padding:6px"><strong>${a(p.nome)}</strong><div style="color:#94a3b8">${a(u)}</div></div>`+(p.sezione?.componenti?.length?`<div>${p.sezione.componenti.map(g=>`<div class="kit-meta-pill">${a(g.nome)}${g.codice?" \xB7 "+a(g.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else d.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;m.disabled=!p,c.value="",l.innerHTML=(o?.sezioni||[]).map(u=>`<option value="${a(u.id)}">${a(u.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("preset-search");u&&u.focus()},40))}function Gn(){let{kits:t}=b(),i=t.find(v=>v.id===Mi);if(!i){pt();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=O(i);et==="sezioni"&&(et="bom"),et==="sa"&&(et="bom");let s=["info","varianti","anagrafiche","bom"],r={info:"Prodotto",varianti:"Elettronica selezionabile",anagrafiche:"Anagrafiche",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,S)=>v+(S.componenti||[]).length,0),m=c?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-bolt"></i>
                <div><strong>${d}</strong> grupp${d===1?"o":"i"} elettronici e <strong>${c}</strong> configurazioni pronte da usare</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div>
                    ${o.slice(0,8).map(v=>`<span class="kit-cfg-sa-var-badge">${a(v.nome)}</span>`).join(" ")}
                    ${o.length>8?`<span class="kit-cfg-sa-count">+${o.length-8} altre</span>`:""}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${l}</strong> parti prodotto da usare nella distinta base</div>
            </div>
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>',p=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${a(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${a(i.id)}',this.value)">
        </div>
        ${m}
        <div class="kit-cfg-danger">
            <button type="button" class="kit-cfg-add-btn" onclick="_kitDuplicaKit('${a(i.id)}')"><i class="fas fa-clone"></i> Duplica kit</button>
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${a(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,u=e.map((v,S)=>{let k=(v.opzioni||[]).map((w,x)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${a(w.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(w.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${a(w.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(w.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${a(i.id)}','${a(v.id)}','${a(w.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${S}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${k||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),g=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xE0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(v=>`<span class="kit-cfg-sa-var-badge" title="${a(v.key)}">${a(v.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",y=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci solo l'<strong>elettronica selezionabile</strong> del prodotto.<br>
                Esempio: un gruppo <strong>LED</strong>, uno <strong>Lente</strong>, uno <strong>Alimentazione</strong>.<br>
                Tu inserisci i nomi, il sistema user\xE0 queste scelte per costruire l'ordine e la distinta base.
            </div>
            ${u||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportAsseModal('${a(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenPresetsModal('${a(i.id)}')"><i class="fas fa-bookmark"></i> Sezioni fisse</button>
            ${g}
        </div>`,f=(i.sezioni||[]).map((v,S)=>{let k=(v.componenti||[]).map(w=>{let x=K(w),N=Kt(w,i),Ft=(e||[]).find(q=>q.id===N.asseId)||null,Hi=N.tipo==="gruppo"&&Ft?`<div class="kit-cfg-row">${(Ft.opzioni||[]).map(q=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${N.opzioneIds.includes(q.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${a(i.id)}','${a(v.id)}','${a(w.id)}','${a(q.id)}',this.checked)">
                        ${a(q.nome)}
                    </label>`).join("")}</div>`:"",ji=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(w.id)}','asseId',this.value)">
                        ${e.map(q=>`<option value="${a(q.id)}" ${N.asseId===q.id?"selected":""}>${a(q.nome)}</option>`).join("")}
                   </select>`:"",Qi=N.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",Gt=x?"flag":yt(w.unitaMisura,"pz"),Vi=x?[{value:"flag",label:"Solo avviso"}]:[...new Set([Gt,...Yi])].filter(Boolean).map(q=>({value:q,label:q}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${a(w.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(w.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${a(w.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(w.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(w.id)}','modo','',this.value)">
                        <option value="quantificato" ${x?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${x?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${a(i.id)}','${a(v.id)}','${a(w.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${N.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(w.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(w.id)}','unitaMisura','',this.value)"
                            ${x?"disabled":""}>
                        ${Vi.map(q=>`<option value="${a(q.value)}" ${Gt===q.value?"selected":""}>${a(q.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(w.id)}','tipo',this.value)">
                        <option value="sempre" ${N.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${N.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${N.tipo==="gruppo"?ji:""}
                </div>
                ${N.tipo==="gruppo"?Hi:""}
                <input class="kit-cfg-input" value="${a(w.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(w.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${x?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Qi}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${S}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${a(i.id)}','${a(v.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${k}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),h=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unit\xE0 corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${f}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${a(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,M="";o.length?M=o.map(v=>{let S=(i.sottoAssembly||[]).map((w,x)=>({sa:w,i:x})).filter(({sa:w})=>w.varianteKey===v.key),k=S.map(({sa:w,i:x})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${a(w.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${a(i.id)}',${x},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${a(i.id)}',${x})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${a(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${S.length} part${S.length!==1?"i":"e"}</span>
                </div>
                ${k||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${a(i.id)}','${a(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${a(v.nome)}</button>
            </div>`}).join(""):M='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let Y=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${M}
        </div>`,Q={info:p,varianti:y,bom:h,sa:Y},A=ct(),X=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${A.length?A.map(v=>`<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${a(v.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${a(v.sourceKitId&&b().kits.find(S=>S.id===v.sourceKitId)?.nome||"")}</div>
                </div>
                <div style="display:flex;gap:8px">
                    <button class="kit-cfg-add-btn" onclick="_kitApplyPreset('${a(v.id)}')">Applica</button>
                    <button class="kit-cfg-add-btn" onclick="(function(){const n=prompt('Nuovo nome preset', '${a(v.nome)}'); if(n) _kitRenamePreset('${a(v.id)}', n);})()">Rinomina</button>
                    <button class="kit-btn-danger" onclick="(function(){ if(confirm('Eliminare questo preset?')) _kitDeletePreset('${a(v.id)}') })()">Elimina</button>
                </div>
            </div>`).join(""):'<div class="kit-import-empty">Nessun preset salvato.</div>'}</div>
            <hr style="margin:12px 0">
            <div style="display:flex;gap:8px;align-items:center">
                <select id="preset-new-section-tab" class="kit-cfg-select" style="min-width:220px">
                    ${(i.sezioni||[]).map(v=>`<option value="${a(v.id)}">${a(v.nome)}</option>`).join("")}
                </select>
                <input id="preset-new-name-tab" class="kit-cfg-input" placeholder="Nome nuovo preset" style="flex:1">
                <button class="kit-cfg-add-btn" onclick="(function(){ const sec = document.getElementById('preset-new-section-tab')?.value || ''; const name = document.getElementById('preset-new-name-tab')?.value || ''; if(!name) { alert('Inserisci un nome'); return; } _kitCreatePreset('${a(i.id)}', sec, name); })()"><i class="fas fa-save"></i> Crea preset</button>
            </div>
        </div>`;Q.anagrafiche=X;let st=s.map(v=>`<button class="kit-tab ${et===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${r[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${a(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${a(i.nome)}</span>
        </div>
        <div class="kit-tabs">${st}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${Q[et]}</div>
    </div>`,ft(n)}function Jn(t){if(t&&B===t){R();return}B=t,R()}function Wn(t){et=t,Gn()}function $(t,i,n=!0){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(i(o),I(e),n&&P())}function Yn(t,i){$(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Zn(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=b();I(i.filter(n=>n.id!==t)),Mi=null,B=null,pt()}function Xn(t){let{kits:i}=b(),n=i.find(o=>o.id===t);if(!n)return;let e={id:C(),nome:`Copia di ${n.nome}`,schemaVersion:Bt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(si(o,n,e));e.varianti=ni(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(ht(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:C(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),I(i),Di(e.id),z(`Kit "${n.nome}" duplicato \u2713`)}function Ri(t){$(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:C(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:C(),key:"opz1",nome:"Opzione 1"}]})})}function to(t,i,n,e){$(t,function(o){let s=(o.assiConfigurazione||[]).find(r=>r.id===i);s&&(n==="key"?s.key=F(e,s.key||"asse"):s[n]=e.trim())})}function io(t,i){$(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function eo(t,i){$(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:C(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function no(t,i,n,e,o){$(t,function(s){let r=(s.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=F(o,d.key||"opzione"):d[e]=o.trim())})}function oo(t,i,n){$(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function so(t){Ri(t)}function ao(t){$(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:C(),nome:"Nuova sezione",componenti:[]})})}function ro(t){Li(t)}function co(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s[n]=e.trim())},!1)}function lo(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&$(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function po(t,i){$(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:C(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function mo(t,i,n,e,o,s){$(t,function(r){let d=(r.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=Z(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":yt(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function uo(t,i,n,e,o){$(t,function(s){let r=(s.sezioni||[]).find(l=>l.id===i),d=r&&(r.componenti||[]).find(l=>l.id===n);if(!d)return;let c=Kt(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=Z(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Tt(d,s,c)})}function fo(t,i,n,e,o){$(t,function(s){let r=(s.sezioni||[]).find(m=>m.id===i),d=r&&(r.componenti||[]).find(m=>m.id===n);if(!d)return;let c=Kt(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Tt(d,s,c)})}function go(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),r=s&&(s.componenti||[]).find(d=>d.id===n);!r||K(r)||(r.tracciabile=!!e)},!1)}function ko(t,i,n){$(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function vo(t){$(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:C(),nome:"",varianteKey:O(i)[0]?.key||""})})}function yo(t,i){$(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:C(),nome:"",varianteKey:i,noteConfig:""})})}function bo(t,i,n,e){$(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function ho(t,i){$(t,function(n){n.sottoAssembly.splice(i,1)})}function zo(t){let i=document.getElementById("modal-kit-distinta-edit");if(!i){zi(t);return}let{kits:n}=b(),e=n.find(c=>c.id===t);if(!e)return;let o=tt(e),s=G(o),r=document.getElementById("distinta-edit-nome"),d=document.getElementById("distinta-edit-documento");r&&(r.value=s.documento||""),d&&(d.value=s.documento||""),i.dataset.kitId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>r&&r.focus(),80)}function Ot(){let t=document.getElementById("modal-kit-distinta-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function wo(){let t=document.getElementById("modal-kit-distinta-edit");if(!t)return;let i=t.dataset.kitId,n=(document.getElementById("distinta-edit-nome")?.value||"").trim(),e=(document.getElementById("distinta-edit-documento")?.value||"").trim();if(!n){z("Inserisci un nome per la distinta.","warning");return}j(i,function(m){let p=G(m);e?p.documento=e:p.documento||(p.documento=n),$t(m,p)});let{kits:o}=b(),s=o.find(m=>m.id===i);if(!s){Ot(),z("Kit non trovato \u26A0\uFE0F");return}let r=tt(s),d=St(s,r);if(!d.totalePezzi||!d.totaleRighe){z("Componi prima un ordine per generare la distinta stampabile.","warning");return}let c=ot(),l={id:C(),kitId:s.id,kitNome:s.nome,nome:n||r._meta?.documento||`Distinta-${Date.now()}`,documento:e||r._meta?.documento||"",createdAt:Date.now(),createdBy:V?.nome||"Sistema",orderDraftSnapshot:r,distintaSnapshot:d};c.unshift(l),Ct(c),Ot(),z("Distinta salvata \u2713"),D==="distinte"&&T("distinte")}function Mo(){window._kitOpenView=Me,window._kitOpenConfig=Di,window._kitNuovoKit=Mn,window._kitBack=Ee,window._kitOpenPrintPreview=ye,window._kitSwitchTab=qe,window._kitAggiornaQty=Oe,window._kitOrdineSet=Ne,window._kitOrdineDelta=Be,window._kitOrdineReset=Te,window._kitOrdineResetVoce=De,window._kitOrderSearch=Le,window._kitOrderHideSearch=Ke,window._kitOrderPick=Pe,window._kitOrderRemoveRef=Re,window._kitComposeSelect=He,window._kitComposeAdd=je,window._kitAggiornaCar=Ci,window._kitAggiornaPronti=Qe,window._kitSetPronti=Ve,window._kitApriModalSped=Ze,window._kitChiudiModalSped=xi,window._kitConfermaSpedizione=Xe,window._kitApriModalReso=tn,window._kitChiudiModalReso=Ai,window._kitResoQtyChange=en,window._kitResoAggiornaBOM=Ut,window._kitConfermaReso=nn,window._kitSalvaMovimento=Fe,window._kitEliminaMovimento=Ge,window._kitModificaMovimento=We,window._kitChiudiModalEditMov=Ii,window._kitConfermaModificaMov=Ye,window._kitChiudiModalDelMov=$i,window._kitConfermaEliminaMov=Si,window._kitSalvaManuale=on,window._kitElimina=Zn,window._kitDuplicaKit=Xn,window._kitCfgBack=Jn,window._kitCfgSwitchTab=Wn,window._kitCfgSaveNome=Yn,window._kitCfgAddVar=so,window._kitCfgOpenImportModal=Li,window._kitCfgOpenImportAsseModal=En,window._kitCfgOpenCopySezModal=qn,window._kitCfgCloseImportModal=at,window._kitCfgSetImportMode=On,window._kitCfgSetImportSearch=Nn,window._kitCfgSelectImportSource=Bn,window._kitCfgSelectImportSection=Tn,window._kitCfgToggleImportTarget=Dn,window._kitCfgSelectAllImportTargets=Ln,window._kitCfgClearImportTargets=Kn,window._kitCfgConfirmImport=Pn,window._kitOpenPresetsModal=Rn,window._kitClosePresetsModal=Ki,window._kitSetPresetsSearch=Hn,window._kitSelectPreset=jn,window._kitCreatePresetFromSection=Qn,window._kitCreatePreset=Pi,window._kitApplyPreset=Vn,window._kitRenamePreset=Un,window._kitDeletePreset=Fn,window._kitCfgAddAsse=Ri,window._kitCfgUpdateAsse=to,window._kitCfgDelAsse=io,window._kitCfgAddOpzione=eo,window._kitCfgUpdateOpzione=no,window._kitCfgDelOpzione=oo,window._kitCfgAddSez=ao,window._kitCfgImportSez=ro,window._kitCfgUpdateSez=co,window._kitCfgDelSez=lo,window._kitCfgAddComp=po,window._kitCfgUpdateComp=mo,window._kitCfgUpdateCompRule=uo,window._kitCfgToggleCompOption=fo,window._kitCfgToggleCompTracked=go,window._kitCfgDelComp=ko,window._kitCfgAddSA=vo,window._kitCfgAddSAForVariant=yo,window._kitCfgUpdateSA=bo,window._kitCfgDelSA=ho,window._kitSwitchMainTab=T,window._kitRenderKitsGrid=yi,window._kitRenderAnagrafichePage=bi,window._kitRenderDistintePage=hi,window._kitLoadDistinte=ot,window._kitSaveDistinte=Ct,window._kitCreateDistintaFromDraft=zi,window._kitLoadAnagrafiche=J,window._kitSaveAnagrafiche=Vt,window._kitOpenAnagraficaModal=Ce,window._kitCloseAnagraficaModal=wi,window._kitConfirmSaveAnagrafica=$e,window._kitDeleteAnagrafica=Se,window._kitOpenCreaKit=qi,window._kitCloseCreaKit=Oi,window._kitConfirmCreaKit=hn,window._kitOpenConfigModal=Ei,window._kitCloseConfigModal=sn,window._kitRenderConfigModal=P,window._kitCfgModalSaveNome=an,window._kitCfgModalAddAnag=dn,window._kitCfgModalAddCompFree=ln,window._kitCfgModalUpdateSez=rn,window._kitCfgModalDelSez=cn,window._kitCfgModalUpdateComp=pn,window._kitCfgModalUpdateCompRule=mn,window._kitCfgModalDelComp=un,window._kitCfgModalAddAsse=fn,window._kitCfgModalDelAsse=gn,window._kitCfgModalUpdateAsse=kn,window._kitCfgModalAddOpz=vn,window._kitCfgModalDelOpz=yn,window._kitCfgModalUpdateOpz=bn,window._kitQAddSezOpen=zn,window._kitQAddSezClose=Ni,window._kitQAddSezConfirm=wn,window._kitQAddCompOpen=_n,window._kitQAddCompToggleSource=qt,window._kitQAddCompChangeCategoria=Bi,window._kitQAddCompClose=Ti,window._kitQAddCompConfirm=Cn,window._kitQUpdateComp=$n,window._kitQRenomeSez=Sn,window._kitQDelComp=In,window._kitQDelSez=xn,window._kitQDelKit=An,window._kitRenderHeaderActions=Qt,window._kitOpenSaveDistintaModal=zo,window._kitCloseSaveDistintaModal=Ot,window._kitConfirmSaveDistinta=wo,window._kitDistintaOpenPrint=Ie,window._kitDistintaApplyToDraft=xe,window._kitDistintaDelete=Ae}var Nt,bt,Zt,Jt,Xt,Bt,Yi,ti,Zi,ii,Xi,Et,it,gt,Mt,D,kt,Yt,B,_i,Mi,et,_,E,rt,H,Eo,_o=Ui(()=>{Fi();Ji();Wi();Gi();Nt="_mlKitData",bt="_mlKitDataTs",Zt="_mlKitOrderDrafts",Jt="_mlKitOrderDraftSeq",Xt="_mlKitPresetSections",Bt=2,Yi=["pz","mt","cm","mm","kg","g","lt","ml"],ti="_mlKitDistinte",Zi="_mlKitDistinteTs",ii="_mlKitAnagrafiche",Xi="_mlKitAnagraficheTs",Et=!1,it=[],gt=null,Mt={},D="kits";kt={};Yt=null;B=null,_i="ordine";Mi=null,et="info",_=null,E=null,rt={kitId:null,sezId:null},H=null;Eo=pt});_o();export{pt as caricaKitProdotti,Eo as default,Mo as registerGlobals,Ao as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-3MVNKHPP.js.map
