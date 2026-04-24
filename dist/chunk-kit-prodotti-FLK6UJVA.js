import{a as xt,c as kt,e as Tt,f as s,g as N,h as X,l as Nt,m as F,q as Bt,r as ot,u as Kt}from"./chunk-chunk-MVGUZ3SY.js";function Yi(){st=!1}function W(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function Lt(t,i){let n="opz"+(i+1),e=W(t?.key,n);return{id:String(t?.id||S()),key:e,nome:String(t?.nome||e).trim()||e}}function Ot(t,i){let n="asse"+(i+1),e=W(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((a,c)=>Lt(a,c)).filter(Boolean):[];return{id:String(t?.id||S()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function Pt(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function Rt(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function Dt(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let a of n)for(let c of e.opzioni)o.push({selections:a.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:c.id,opzioneKey:c.key,opzioneNome:c.nome})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:Pt(e.selections),nome:Rt(e.selections),selections:e.selections}})}function Ht(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||S()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:String(t?.unitaMisura||e).trim()||"pz"}}function jt(t){return{id:String(t?.id||S()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(Ht):[]}}function Vt(t,i){let n=R(i);if(!n.length)return null;let e=null;for(let o of n){let a=H(t,o.key);if(e===null){e=a;continue}if(e!==a)return null}return e}function Ut(t,i,n){let e=R(n),o={},a=Vt(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let c of e){let r=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},c.key)?H(t,c.key):a!==null?a:0;r>0&&(o[c.key]=r)}return{id:S(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:U(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:String(t?.unitaMisura||(K(t)?"flag":"pz")).trim()||"pz"}}function gt(t,i,n){return{id:S(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>Ut(e,i,n)):[]}}function yt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function G(t,i){let n=new Set(R(t).map(a=>a.key)),e=R(i),o=e.filter(a=>n.has(a.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function at(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function Qt(t,i){return{id:String(t?.id||S()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function ht(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(m,v){let b="v"+(v+1),$=W(m?.key,b);return{id:String(m?.id||S()),key:$,nome:String(m?.nome||$).trim()||$}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((m,v)=>Ot(m,v)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(m){return{id:m.id,key:m.key,nome:m.nome}})}]:[],a=Dt(o),c=a.length?a:n,l=new Set(c.map(m=>m.key)),r={};Object.entries(i.qtaDaProdurre||{}).forEach(function(m){l.has(m[0])&&(r[m[0]]=Math.max(0,Number.parseInt(m[1],10)||0))});for(let m of c)r[m.key]===void 0&&(r[m.key]=0);let d=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(m=>Qt(m,c[0]?.key||"")).filter(m=>!m.varianteKey||l.has(m.varianteKey)):[],p={};return Object.entries(i.pronti||{}).forEach(function(m){p[m[0]]=Math.max(0,Number.parseInt(m[1],10)||0)}),{id:String(i.id||S()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:bt,assiConfigurazione:o,varianti:c,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(jt):[],sottoAssembly:d,qtaDaProdurre:r,pronti:p,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function R(t){return Array.isArray(t?.varianti)?t.varianti:[]}function K(t){return!!t&&t.modoComponente==="segnalazione"}function U(t){return!!t&&t.tracciabile!==!1&&!K(t)}function H(t,i){let n=Number.parseInt(t?.qtaPerVariante?.[i],10)||0;return K(t)?n>0?1:0:n}function h(){try{let t=localStorage.getItem(ct);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(ht):[]}}catch{return{kits:[]}}}function q(t){let i=Array.isArray(t)?t.map(ht):[];try{localStorage.setItem(ct,JSON.stringify({kits:i})),localStorage.setItem(tt,Date.now())}catch{}Ft(i)}function Ft(t){clearTimeout(vt),vt=setTimeout(function(){ot({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function Gt(t){fetch(kt,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(tt)||0);if(n>0&&n>e){try{localStorage.setItem(ct,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(tt,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function S(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function et(){if(!F||!F.nome)return!1;let t=String(F.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||F.ruolo==="MASTER"}function rt(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(K(e)){i[e.id]=0;continue}let o=0;for(let[a,c]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(c,10)||0)*H(e,a);i[e.id]=o}return i}function lt(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let a of t.sezioni||[])for(let c of a.componenti||[]){if(K(c))continue;let l=H(c,o);l>0&&(i[c.id]=(i[c.id]||0)+e*l)}}return i}function Jt(t){let i={};for(let n of t.sottoAssembly||[]){let e=n.varianteKey,o=1/0,a=!1,c=lt(t);for(let l of t.sezioni||[])for(let r of l.componenti||[]){if(K(r))continue;let d=H(r,e);if(!d)continue;a=!0;let p=Math.max(0,(Number.parseInt(r.caricato,10)||0)-(c[r.id]||0));o=Math.min(o,Math.floor(p/d))}!a||o===1/0?i[n.id]=0:i[n.id]=o}return i}function dt(t,i){let n=R(t).find(e=>e.key===i);return n?s(n.nome):s(i)}function mt(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function Q(){st||(st=!0,Gt(function(e){e&&Q()}));let{kits:t}=h(),i=document.getElementById("contenitore-dati"),n=t.map(e=>{let a=R(e).length,c=(e.assiConfigurazione||[]).length,l=(e.sezioni||[]).reduce((p,m)=>p+(m.componenti||[]).length,0),r=(e.sottoAssembly||[]).length,d=Object.values(e.pronti||{}).reduce((p,m)=>p+(Number.parseInt(m,10)||0),0);return`
        <div class="kit-card" onclick="_kitOpenView('${s(e.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${s(e.nome)}</span>
                <button class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${s(e.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
            </div>
            <div class="kit-card-meta">
                <span class="kit-meta-pill"><i class="fas fa-sliders"></i> ${c} ass${c===1?"e":"i"}</span>
                <span class="kit-meta-pill"><i class="fas fa-layer-group"></i> ${a} combinaz.${a===1?"ione":"ioni"}</span>
                <span class="kit-meta-pill"><i class="fas fa-list"></i> ${l} comp.</span>
                ${r?`<span class="kit-meta-pill"><i class="fas fa-puzzle-piece"></i> ${r} sub-asm.</span>`:""}
                ${d?`<span class="kit-meta-pill kit-meta-pill--pronti"><i class="fas fa-check"></i> ${d} pronti</span>`:""}
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
    </div>`,X(i)}function Wt(t){B=t,P="bom",D()}function D(){let{kits:t}=h(),i=t.find(k=>k.id===B);if(!i){Q();return}let n=document.getElementById("contenitore-dati"),e=rt(i),o=lt(i),a=Jt(i),c=R(i),l=c.map(k=>`<th class="kit-col-coeff" title="${s(k.nome)}">\xD7 ${s(k.key)}</th>`).join(""),r="";for(let k of i.sezioni||[]){let C=k.componenti||[];if(C.length){r+=`<tr class="kit-bom-sez-row"><td colspan="${6+c.length}" class="kit-bom-sez-cell">${s(k.nome)}</td></tr>`;for(let _ of C){let M=K(_),O=U(_),L=e[_.id]||0,u=O&&Number.parseInt(_.caricato,10)||0,A=o[_.id]||0,T=Math.max(0,u-A),g=Math.max(0,L-u),f="kit-ord-zero";!M&&L>0&&(f=g>0?"kit-ord-manca":"kit-ord-ok");let w=c.map(qt=>{let nt=H(_,qt.key);return M?nt>0?'<td class="kit-coeff kit-coeff-on">flag</td>':'<td class="kit-coeff kit-coeff-off">\u2014</td>':nt>0?`<td class="kit-coeff kit-coeff-on">${nt}</td>`:'<td class="kit-coeff kit-coeff-off">\u2014</td>'}).join(""),x=M?'<span class="kit-meta-pill" style="margin-left:8px">Segnala</span>':O?"":'<span class="kit-meta-pill" style="margin-left:8px">No mag.</span>',E=M?"Segnala":L>0?L:"\u2014",Y=O?`<input class="kit-car-input" type="number" min="0" value="${u}"
                           data-cid="${s(_.id)}" data-sid="${s(k.id)}"
                           oninput="_kitAggiornaCar(this)" onchange="_kitAggiornaCar(this)">
                    <span class="kit-car-liberi" ${A>0?"":'style="display:none"'}>${T} lib.</span>`:'<span class="kit-fab-zero">n/d</span>',Z=M||L===0?"\u2014":g;r+=`<tr data-cid="${s(_.id)}" data-sid="${s(k.id)}">
                <td class="kit-mat">${s(_.nome)}${x}</td>
                ${w}
                <td class="kit-fab${L===0&&!M?" kit-fab-zero":""}">${E}</td>
                <td class="kit-car-cell">${Y}</td>
                <td class="${f}">${Z}</td>
            </tr>`}}}let d=[];for(let k of i.sezioni||[])for(let C of k.componenti||[])U(C)&&d.push(`<option value="${s(C.id)}" data-sid="${s(k.id)}">[${s(k.nome)}] ${s(C.nome)}</option>`);let p=c.map(k=>{let C=Number.parseInt(i.qtaDaProdurre?.[k.key],10)||0;return`<div class="kit-qty-item">
            <label>${s(k.nome)}</label>
            <input class="kit-qty-input" id="kit-qty-${s(k.key)}" type="number" min="0" value="${C}"
                   data-vkey="${s(k.key)}"
                   oninput="_kitAggiornaQty('${s(i.id)}')" onchange="_kitAggiornaQty('${s(i.id)}')">
        </div>`}).join(""),m=Object.values(i.qtaDaProdurre||{}).reduce((k,C)=>k+(Number.parseInt(C,10)||0),0),v=(i.sottoAssembly||[]).map(k=>{let C=Number.parseInt(i.pronti?.[k.id],10)||0,_=a[k.id]||0,M=dt(i,k.varianteKey);return`<div class="kit-sped-sa-row">
            <div class="kit-sped-sa-label"><i class="fas fa-puzzle-piece"></i> ${s(k.nome)} <span class="kit-sped-var-pill">${M}</span></div>
            <div class="kit-sped-sa-stats">
                <span class="kit-sped-pronti-cnt">${C} pronti</span>
                <span class="kit-sped-max ${_>0?"kit-sped-max--ok":"kit-sped-max--zero"}">${_} assemb.</span>
            </div>
            <div class="kit-pronti-ctrl">
                <button class="kit-pronti-btn" onclick="_kitAggiornaPronti('${s(i.id)}','${s(k.id)}',-1)">\u2212</button>
                <input class="kit-pronti-input${C>0?" kit-pronti-val-on":""}" type="number" min="0"
                       value="${C}" data-said="${s(k.id)}"
                       oninput="_kitSetPronti('${s(i.id)}','${s(k.id)}',this.value)"
                       onchange="_kitSetPronti('${s(i.id)}','${s(k.id)}',this.value)">
                <button class="kit-pronti-btn" onclick="_kitAggiornaPronti('${s(i.id)}','${s(k.id)}',1)">+</button>
            </div>
        </div>`}).join(""),b=(i.sottoAssembly||[]).some(k=>(Number.parseInt(i.pronti?.[k.id],10)||0)>0),$=et(),z=zt(i,$);n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${s(i.nome)}</span>
            <button class="kit-gear-btn-inline" onclick="_kitOpenConfig('${s(i.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <!-- Tabs -->
        <div class="kit-tabs">
            <button class="kit-tab ${P==="bom"?"kit-tab--active":""}" onclick="_kitSwitchTab('bom')"><i class="fas fa-list"></i> BOM</button>
            <button class="kit-tab ${P==="qty"?"kit-tab--active":""}" onclick="_kitSwitchTab('qty')"><i class="fas fa-hashtag"></i> Quantit\xE0</button>
            <button class="kit-tab ${P==="sped"?"kit-tab--active":""}" onclick="_kitSwitchTab('sped')">
                <i class="fas fa-truck"></i> Parti pronte
                ${b?'<span class="kit-tab-badge"></span>':""}
            </button>
            <button class="kit-tab ${P==="mov"?"kit-tab--active":""}" onclick="_kitSwitchTab('mov')"><i class="fas fa-boxes-stacked"></i> Mov. materie</button>
        </div>

        <!-- TAB BOM -->
        <div class="kit-tab-panel ${P==="bom"?"kit-tab-panel--active":""}">
            <div class="kit-table-wrap">
                <table class="kit-table">
                    <thead>
                        <tr>
                            <th>MATERIALE</th>
                            ${l}
                            <th>NECESSARIO</th>
                            <th>DISPONIBILE</th>
                            <th>DA REINTEGRARE</th>
                        </tr>
                    </thead>
                    <tbody id="kit-tbody-${s(i.id)}">${r}</tbody>
                </table>
            </div>
            <div class="kit-legend">
                <span class="kit-leg-item kit-ord-manca" style="padding:2px 7px;border-radius:5px">\u25CF mancante</span>
                <span class="kit-leg-item kit-ord-ok" style="padding:2px 7px;border-radius:5px">\u25CF disponibile</span>
                <span class="kit-leg-item" style="color:#475569">flag = requisito solo segnalato</span>
                <span class="kit-leg-item" style="color:#9ca3af">\u2014 = non necessario</span>
            </div>
        </div>

        <!-- TAB QUANTIT\xC0 -->
        <div class="kit-tab-panel ${P==="qty"?"kit-tab-panel--active":""}">
            <div class="kit-qty-card">
                <div class="kit-qty-label">QT\xC0 DA PRODURRE</div>
                <div class="kit-qty-inputs">${p}
                    <div class="kit-qty-total-box">
                        <div class="kit-qty-total-label">TOTALE</div>
                        <div class="kit-qty-total-val" id="kit-tot-${s(i.id)}">${m}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB PRONTI / SPEDIZIONE -->
        <div class="kit-tab-panel ${P==="sped"?"kit-tab-panel--active":""}">
            ${(i.sottoAssembly||[]).length===0?`<div class="kit-empty-state" style="padding:40px 20px">
                    <i class="fas fa-puzzle-piece" style="font-size:2rem;color:#cbd5e1;margin-bottom:12px"></i>
                    <p>Nessun sub-assembly configurato.</p>
                    <button class="kit-btn-secondary" onclick="_kitOpenConfig('${s(i.id)}')">Configura sub-assembly</button>
                   </div>`:`<div class="kit-sped-section">
                    <div class="kit-sped-title"><i class="fas fa-truck"></i> PARTI PRONTE DA CONTARE</div>
                    <div class="kit-sped-sa-list">${v}</div>
                    <div class="kit-sped-footer">
                        <input type="text" id="kit-sped-nota-${s(i.id)}" class="kit-sped-nota-input"
                               placeholder="Note spedizione\u2026" maxlength="80">
                        <button class="kit-spedisci-btn" onclick="_kitApriModalSped('${s(i.id)}')">
                            <i class="fas fa-truck"></i> Registra Spedizione
                        </button>
                    </div>
                   </div>`}
        </div>

        <!-- TAB MOVIMENTI -->
        <div class="kit-tab-panel ${P==="mov"?"kit-tab-panel--active":""}">
            <div class="kit-mov-form">
                <div class="kit-mov-form-field" style="grid-column:1/3">
                    <label class="kit-mov-form-label">Materiale tracciato</label>
                    <select id="kit-mov-mat-${s(i.id)}">${d.join("")}</select>
                </div>
                <div class="kit-mov-form-field">
                    <label class="kit-mov-form-label">Numero pezzi</label>
                    <input type="number" id="kit-mov-qty-${s(i.id)}" min="1" value="1">
                </div>
                <div class="kit-mov-form-field">
                    <label class="kit-mov-form-label">Riferimento / Note</label>
                    <input type="text" id="kit-mov-nota-${s(i.id)}" placeholder="es. DDT 123\u2026" maxlength="60">
                </div>
                <button class="kit-mov-btn-carico" onclick="_kitSalvaMovimento('${s(i.id)}','carico')">
                    <i class="fas fa-arrow-down"></i> Carico
                </button>
                <button class="kit-mov-btn-scarico" onclick="_kitSalvaMovimento('${s(i.id)}','scarico')">
                    <i class="fas fa-arrow-up"></i> Scarico
                </button>
            </div>
            <div id="kit-mov-list-${s(i.id)}" class="kit-mov-list">${z}</div>
        </div>

        <!-- Pulsanti azione globale -->
        <div class="kit-actions-bar">
            <button class="kit-reso-btn" onclick="_kitApriModalReso('${s(i.id)}')">
                <i class="fas fa-rotate-left"></i> Reso
            </button>
            <button class="kit-save-btn" id="kit-save-btn" onclick="_kitSalvaManuale('${s(i.id)}')">
                <i class="fas fa-cloud-arrow-up"></i> <span id="kit-save-label">Salva</span>
            </button>
        </div>
    </div>`,X(n)}function Yt(){B=null,Q()}function Zt(t){P=t,D()}function Xt(t){let{kits:i}=h(),n=i.find(a=>a.id===t);if(!n)return;n.qtaDaProdurre||(n.qtaDaProdurre={});for(let a of R(n)){let c=document.getElementById("kit-qty-"+a.key);c&&(n.qtaDaProdurre[a.key]=Math.max(0,Number.parseInt(c.value,10)||0))}let e=Object.values(n.qtaDaProdurre).reduce((a,c)=>a+c,0),o=document.getElementById("kit-tot-"+t);o&&(o.textContent=e),q(i),ti(n)}function ti(t){let i=rt(t),n=document.getElementById("kit-tbody-"+t.id);if(n)for(let e of n.querySelectorAll("tr[data-cid]")){let o=e.dataset.cid,a=e.dataset.sid,c=(t.sezioni||[]).find(b=>b.id===a),l=c&&(c.componenti||[]).find(b=>b.id===o);if(!l||K(l))continue;let r=i[o]||0,d=Number.parseInt(l.caricato,10)||0,p=Math.max(0,r-d),m=e.querySelector(".kit-fab, .kit-fab-zero");m&&(m.textContent=r>0?r:"\u2014",m.className=r===0?"kit-fab kit-fab-zero":"kit-fab");let v=e.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");v&&(v.textContent=r===0?"\u2014":p,v.className=r===0?"kit-ord-zero":p>0?"kit-ord-manca":"kit-ord-ok")}}function $t(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=h(),a=o.find(k=>k.id===B);if(!a)return;let c=(a.sezioni||[]).find(k=>k.id===n),l=c&&(c.componenti||[]).find(k=>k.id===i);if(!l||!U(l))return;l.caricato=e,q(o);let d=rt(a)[i]||0,p=Math.max(0,d-e),v=lt(a)[i]||0,b=t.closest("tr");if(!b)return;let $=b.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");$&&($.textContent=d===0?"\u2014":p,$.className=d===0?"kit-ord-zero":p>0?"kit-ord-manca":"kit-ord-ok");let z=b.querySelector(".kit-car-liberi");z&&(v>0?(z.textContent=Math.max(0,e-v)+" lib.",z.style.display=""):z.style.display="none")}function ii(t,i,n){let{kits:e}=h(),o=e.find(a=>a.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),q(e),B===t&&D())}function ei(t,i,n){let{kits:e}=h(),o=e.find(c=>c.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),q(e);let a=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);a&&(a.value=o.pronti[i],a.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function zt(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button class="kit-mov-del" onclick="_kitEliminaMovimento('${s(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',a=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button class="kit-mov-edit" onclick="_kitModificaMovimento('${s(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let c=(e.righe||[]).reduce((d,p)=>d+p.qty,0),l=(e.righe||[]).map(d=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${s(d.mat)}</span><span class="kit-mov-qty scarico">\u2212${d.qty}</span></div>`).join(""),r=(e.items||[]).map(d=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${s(d.nome)}</span><span class="kit-mov-qty scarico">\xD7${d.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${c} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${s(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${r}<div class="kit-sped-bom-divider">componenti scaricati</div>${l}</div>
            </details>`}if(e.tipo==="reso"){let c=e.totPz||0,l=(e.items||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${s(p.nome)}</span><span class="kit-mov-qty carico">\xD7${p.qty}</span></div>`).join(""),r=(e.righe||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${s(p.mat)}</span><span class="kit-mov-qty carico">+${p.qty}</span></div>`).join(""),d=(e.scartate||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${s(p.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${p.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\u{1F4E6} Rientro \xD7${c} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${s(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">
                ${l}
                ${r?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${r}`:""}
                ${d?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${d}`:""}
              </div>
            </details>`}return`<div class="kit-mov-item ${s(e.tipo)}">
            <span class="kit-mov-badge ${s(e.tipo)}">${e.tipo==="carico"?"CARICO":"SCARICO"}</span>
            <span class="kit-mov-mat">${s(e.mat)}</span>
            <span class="kit-mov-qty ${s(e.tipo)}">${e.tipo==="carico"?"+":"\u2212"}${e.qty}</span>
            ${e.nota?`<span class="kit-mov-nota">${s(e.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${e.ts}</span>
            ${a}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function ni(t,i){let{kits:n}=h(),e=n.find(z=>z.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),a=document.getElementById("kit-mov-qty-"+t),c=document.getElementById("kit-mov-nota-"+t);if(!o||!a)return;let l=o.value,r=o.options[o.selectedIndex]?.dataset.sid,d=Math.max(1,Number.parseInt(a.value,10)||1),p=(c?.value||"").trim(),m=(e.sezioni||[]).find(z=>z.id===r),v=m&&(m.componenti||[]).find(z=>z.id===l);if(!v||!U(v))return;i==="carico"?v.caricato=(parseInt(v.caricato)||0)+d:v.caricato=Math.max(0,(parseInt(v.caricato)||0)-d),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:l,sid:r,tipo:i,qty:d,nota:p,mat:v.nome,ts:mt()}),q(n),a&&(a.value=1),c&&(c.value="");let b=document.getElementById("kit-mov-list-"+t);b&&(b.innerHTML=zt(e,et()));let $=document.querySelector(`#kit-tbody-${t} input[data-cid="${l}"]`);$&&($.value=v.caricato,$t($))}function oi(t,i){if(!et())return;let{kits:n}=h(),e=n.find(a=>a.id===t);if(!e)return;let o=(e.movimenti||[]).find(a=>a.id===i);o&&si(t,i,o)}function si(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),a;if(n.tipo==="spedizione")a=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((r,d)=>r+d.qty,0)} pz</strong>`;else if(n.tipo==="reso")a=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let l=n.tipo==="carico"?"CARICO":"SCARICO";a=`<span class="kit-mov-badge ${s(n.tipo)}" style="font-size:.75rem">${l}</span> <strong>${s(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=a);let c=document.getElementById("btn-kit-del-ok");c&&(c.onclick=()=>_t(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Ct(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function _t(t,i){Ct();let{kits:n}=h(),e=n.find(a=>a.id===t);if(!e)return;let o=(e.movimenti||[]).find(a=>a.id===i);if(o){if(o.tipo==="spedizione"){let a=(e.sezioni||[]).find(c=>c.id===o.sid);for(let c of o.righe||[])for(let l of e.sezioni||[]){let r=(l.componenti||[]).find(d=>d.id===c.cid||d.nome===c.mat);r&&(r.caricato=(parseInt(r.caricato)||0)+c.qty)}for(let c of o.items||[])c.saId&&e.pronti&&(e.pronti[c.saId]=(parseInt(e.pronti[c.saId])||0)+c.qty)}else if(o.tipo==="reso")for(let a of o.righe||[])for(let c of e.sezioni||[]){let l=(c.componenti||[]).find(r=>r.id===a.cid||r.nome===a.mat);l&&(l.caricato=Math.max(0,(parseInt(l.caricato)||0)-a.qty))}else if(o.tipo==="carico")for(let a of e.sezioni||[]){let c=(a.componenti||[]).find(l=>l.id===o.cid);c&&(c.caricato=Math.max(0,(parseInt(c.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let a of e.sezioni||[]){let c=(a.componenti||[]).find(l=>l.id===o.cid);c&&(c.caricato=(parseInt(c.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(a=>a.id!==i),q(n),B===t&&D(),N("Movimento eliminato \u2713")}}function ai(t,i){if(!et())return;let{kits:n}=h(),e=n.find(d=>d.id===t);if(!e)return;let o=(e.movimenti||[]).find(d=>d.id===i);if(!o)return;let a=document.getElementById("modal-kit-edit-mov");if(!a)return;let c=document.getElementById("kit-edit-mov-mat"),l=document.getElementById("kit-edit-mov-qty"),r=document.getElementById("kit-edit-mov-nota");c&&(c.innerHTML=`<span class="kit-mov-badge ${s(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${s(o.mat)}</strong>`),l&&(l.value=o.qty),r&&(r.value=o.nota||""),a.dataset.kitId=t,a.dataset.movId=i,a.style.display="flex",a.offsetHeight,a.classList.add("active"),setTimeout(()=>r&&r.focus(),80)}function wt(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ci(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);wt();let{kits:e}=h(),o=e.find(d=>d.id===i);if(!o)return;let a=(o.movimenti||[]).findIndex(d=>d.id===n);if(a===-1)return;let c=o.movimenti[a],l=parseInt(document.getElementById("kit-edit-mov-qty")?.value),r=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(l)||l<=0){N("Quantit\xE0 non valida \u26A0\uFE0F");return}if(l!==c.qty){let d=l-c.qty;for(let p of o.sezioni||[]){let m=(p.componenti||[]).find(v=>v.id===c.cid);if(m){c.tipo==="carico"?m.caricato=Math.max(0,(parseInt(m.caricato)||0)+d):m.caricato=Math.max(0,(parseInt(m.caricato)||0)-d);break}}}o.movimenti[a]={...c,qty:l,nota:r},q(e),B===i&&D(),N("Movimento aggiornato \u2713")}function ri(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(r=>(Number.parseInt(n.pronti?.[r.id],10)||0)>0)){N("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let a=document.getElementById("kit-sped-items-list");a&&(a.innerHTML=(n.sottoAssembly||[]).filter(r=>(Number.parseInt(n.pronti?.[r.id],10)||0)>0).map(r=>{let d=Number.parseInt(n.pronti?.[r.id],10)||0,p=dt(n,r.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${s(r.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${s(r.nome)} <span class="kit-sped-var-pill">${p}</span></span>
                        <span class="kit-sped-item-qty">\xD7${d}</span>
                    </span>
                </label>`}).join(""));let c=document.getElementById("kit-sped-nota-"+t),l=document.getElementById("kit-sped-modal-nota");l&&c&&(l.value=c.value||""),l&&!c&&(l.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function It(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function li(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;It();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(d=>d.dataset.said);if(!n.length)return;let{kits:e}=h(),o=e.find(d=>d.id===i);if(!o)return;let a=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),c=[],l=[];for(let d of n){let p=(o.sottoAssembly||[]).find(v=>v.id===d);if(!p)continue;let m=Number.parseInt(o.pronti?.[d],10)||0;if(m){c.push({saId:d,nome:p.nome,qty:m});for(let v of o.sezioni||[])for(let b of v.componenti||[]){if(K(b))continue;let $=H(b,p.varianteKey);if(!$)continue;let z=m*$;b.caricato=Math.max(0,(parseInt(b.caricato)||0)-z);let k=l.find(C=>C.cid===b.id);k?k.qty+=z:l.push({cid:b.id,mat:b.nome,qty:z})}o.pronti||(o.pronti={}),delete o.pronti[d]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:c,righe:l,nota:a,ts:mt()}),q(e);let r=c.reduce((d,p)=>d+p.qty,0);N(`Spedizione registrata: ${r} pz \u2713`),B===i&&D()}function di(t){let{kits:i}=h(),n=i.find(c=>c.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let c=n.sottoAssembly||[];o.innerHTML=c.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':c.map(l=>{let r=dt(n,l.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${s(l.nome)} <span class="kit-sped-var-pill">${r}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${s(l.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${s(l.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${s(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${s(l.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let a=document.getElementById("kit-reso-nota");a&&(a.value=""),ft(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function St(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function mi(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&ft(e.dataset.kitId)}function ft(t){let{kits:i}=h(),n=i.find(c=>c.id===t);if(!n)return;let e={};for(let c of n.sottoAssembly||[]){let l=document.getElementById("kit-reso-qty-"+c.id),r=Number.parseInt(l?.value,10)||0;if(r)for(let d of n.sezioni||[])for(let p of d.componenti||[]){if(K(p))continue;let m=H(p,c.varianteKey);m&&(e[p.id]={mat:p.nome,qty:(e[p.id]?.qty||0)+r*m})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let a=Object.entries(e).filter(([,c])=>c.qty>0);if(!a.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=a.map(([c,{mat:l,qty:r}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${s(c)}" data-qty="${r}" checked>
            <span class="kit-reso-bom-mat">${s(l)}</span>
            <span class="kit-reso-bom-qty">+${r}</span>
        </label>`).join("")}function fi(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=h(),e=n.find(d=>d.id===i);if(!e)return;let o=[];for(let d of e.sottoAssembly||[]){let p=Number.parseInt(document.getElementById("kit-reso-qty-"+d.id)?.value,10)||0;p>0&&o.push({saId:d.id,nome:d.nome,qty:p})}if(!o.length){N("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let a=[],c=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(d=>{let p=d.dataset.cid,m=Number.parseInt(d.dataset.qty,10),v=[...e.sezioni||[]].flatMap(b=>b.componenti||[]).find(b=>b.id===p)?.nome||"?";d.checked?a.push({cid:p,mat:v,qty:m}):c.push({cid:p,mat:v,qty:m})});for(let d of a)for(let p of e.sezioni||[]){let m=(p.componenti||[]).find(v=>v.id===d.cid);if(m){m.caricato=(parseInt(m.caricato)||0)+d.qty;break}}let l=(document.getElementById("kit-reso-nota")?.value||"").trim(),r=o.reduce((d,p)=>d+p.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:a,scartate:c,nota:l,ts:mt(),totPz:r}),q(n),St(),N(`Reso registrato: ${r} pz \u2014 ${a.length} comp. recuperati \u2713`),B===i&&D()}function pi(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=h();ot({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(tt,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function ui(){let{kits:t}=h(),i={id:S(),nome:"Nuovo Kit",schemaVersion:bt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};t.push(i),q(t),At(i.id)}function At(t){pt=t,V="info",J()}function ut(t,i,n=""){let{kits:e}=h(),o=e.find(l=>l.id===t),a=e.find(l=>l.id!==t&&(l.sezioni||[]).length),c=o?.sezioni?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:a?.id||"",sectionId:n||(i==="copy"?c:a?.sezioni?.[0]?.id||""),targetKitIds:[]}}function Et(t){y=ut(t,"import"),j(!0)}function ki(t,i){y=ut(t,"copy",i),j(!0)}function it(){let t=document.getElementById("modal-kit-import");y=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function gi(t){if(!y||t!=="import"&&t!=="copy"||y.mode===t)return;let i=y.currentKitId,n=t==="copy"?y.sectionId:"";y=ut(i,t,n),j()}function vi(t){y&&(y.search=String(t||""),j())}function bi(t){if(!y)return;let{kits:i}=h(),n=i.find(e=>e.id===t);y.sourceKitId=t,y.sectionId=n?.sezioni?.[0]?.id||"",j()}function yi(t){y&&(y.sectionId=t,j())}function hi(t,i){if(!y||y.mode!=="copy")return;let n=new Set(y.targetKitIds||[]);i?n.add(t):n.delete(t),y.targetKitIds=[...n],j()}function $i(){if(!y||y.mode!=="copy")return;let{kits:t}=h(),i=t.filter(e=>e.id!==y.currentKitId&&at(e.nome,y.search)),n=new Set(y.targetKitIds||[]);for(let e of i)n.add(e.id);y.targetKitIds=[...n],j()}function zi(){!y||y.mode!=="copy"||(y.targetKitIds=[],j())}function j(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!y)return;let{kits:n}=h(),e=y,o=n.find(f=>f.id===e.currentKitId);if(!o){it();return}let a=n.filter(f=>f.id!==o.id&&(f.sezioni||[]).length);e.mode==="import"&&!a.some(f=>f.id===e.sourceKitId)&&(e.sourceKitId=a[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(f=>f!==o.id&&n.some(w=>w.id===f)));let c=n.find(f=>f.id===e.sourceKitId)||null,l=c?.sezioni||[];l.some(f=>f.id===e.sectionId)||(e.sectionId=l[0]?.id||"");let r=yt(c,e.sectionId),d=a.filter(f=>at(f.nome,e.search)),p=n.filter(f=>f.id!==o.id&&at(f.nome,e.search)),m=document.getElementById("kit-import-subtitle"),v=document.getElementById("kit-import-search"),b=document.getElementById("kit-import-left-title"),$=document.getElementById("kit-import-right-title"),z=document.getElementById("kit-import-kit-list"),k=document.getElementById("kit-import-section-list"),C=document.getElementById("kit-import-target-wrap"),_=document.getElementById("kit-import-target-list"),M=document.getElementById("kit-import-preview"),O=document.getElementById("kit-import-confirm-btn"),L=document.getElementById("kit-import-mode-import"),u=document.getElementById("kit-import-mode-copy");if(!m||!v||!b||!$||!z||!k||!C||!_||!M||!O||!L||!u)return;L.classList.toggle("kit-import-mode-btn--active",e.mode==="import"),u.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),v.value=e.search,e.mode==="import"?(m.textContent=`Importa una sezione esistente dentro "${o.nome}".`,v.placeholder="Cerca kit sorgente\u2026",b.textContent="Kit sorgente",$.textContent=c?`Sezioni di ${c.nome}`:"Sezione",C.style.display="none",z.innerHTML=d.length?d.map(f=>{let w=f.id===e.sourceKitId;return`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${w?"checked":""}
                           onchange="_kitCfgSelectImportSource('${s(f.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${s(f.nome)}</span>
                        <span class="kit-import-option-meta">${(f.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(m.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,v.placeholder="Cerca kit destinazione\u2026",b.textContent="Kit sorgente",$.textContent="Sezione da copiare",C.style.display="flex",z.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${s(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,_.innerHTML=p.length?p.map(f=>{let w=(e.targetKitIds||[]).includes(f.id),x=r?G(o,f):null,E=`${(f.sezioni||[]).length} sezioni`;return x&&(x.hasTargetVarianti?x.needsReview?E=`${x.exactMatches}/${x.targetCount} combinazioni allineate`:E=`${x.targetCount}/${x.targetCount} combinazioni allineate`:E="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="checkbox" ${w?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${s(f.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${s(f.nome)}</span>
                        <span class="kit-import-option-meta">${s(E)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),k.innerHTML=l.length?l.map(f=>{let w=f.id===e.sectionId;return`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${w?"checked":""}
                       onchange="_kitCfgSelectImportSection('${s(f.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${s(f.nome)}</span>
                    <span class="kit-import-option-meta">${(f.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessuna sezione disponibile.</div>';let A=!1,T="kit-cfg-help kit-import-preview",g="";if(e.mode==="import"){if(!c)g="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!r)g="Seleziona una sezione da importare nel kit corrente.";else{let f=G(c,o);A=!0,g=`La sezione <strong>${s(r.nome)}</strong> verr\xE0 importata in <strong>${s(o.nome)}</strong>. `,f.hasTargetVarianti?f.needsReview?(T="kit-cfg-warn kit-import-preview",g+=`${f.exactMatches} combinazioni su ${f.targetCount} risultano allineate: controlla i coefficienti importati.`):g+=`Tutte le ${f.targetCount} combinazioni del kit destinazione risultano allineate.`:(T="kit-cfg-warn kit-import-preview",g+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}O.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else{let f=n.filter(w=>(e.targetKitIds||[]).includes(w.id));if(!r)g="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!f.length)g="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{A=!0;let w=f.filter(x=>G(o,x).needsReview).length;g=`La sezione <strong>${s(r.nome)}</strong> verr\xE0 copiata in <strong>${f.length}</strong> kit.`,w>0?(T="kit-cfg-warn kit-import-preview",g+=` <strong>${w}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):g+=" Le combinazioni risultano allineate su tutti i kit selezionati."}O.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}M.className=T,M.innerHTML=g,O.disabled=!A,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let f=document.getElementById("kit-import-search");f&&f.focus()},40))}function Ci(){if(!y)return;let{kits:t}=h(),i=y,n=t.find(r=>r.id===i.currentKitId),e=t.find(r=>r.id===i.sourceKitId),o=yt(e,i.sectionId);if(!n||!e||!o){N("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import"){let r=G(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(gt(o,e,n)),q(t),it(),J();let d="";r.hasTargetVarianti?r.needsReview&&(d=" Controlla le quantit\xE0 sulle combinazioni non allineate."):d=" Definisci poi gli assi del kit per rifinire i coefficienti.",N(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${d}`);return}let a=t.filter(r=>(i.targetKitIds||[]).includes(r.id)&&r.id!==n.id);if(!a.length){N("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let c=0;for(let r of a)G(e,r).needsReview&&(c+=1),r.sezioni=r.sezioni||[],r.sezioni.push(gt(o,e,r));q(t),it(),J();let l="";c>0&&(l=` ${c} kit richiedono un controllo delle quantit\xE0.`),N(`Sezione "${o.nome}" copiata in ${a.length} kit \u2713${l}`)}function J(){let{kits:t}=h(),i=t.find(u=>u.id===pt);if(!i){Q();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=R(i);V==="sezioni"&&(V="bom");let a=["info","varianti","bom","sa"],c={info:"Info",varianti:"Assi di configurazione",bom:"Componenti e materiali",sa:"Parti tracciabili"},l=e.length,r=o.length,d=(i.sezioni||[]).reduce((u,A)=>u+(A.componenti||[]).length,0),p=(i.sottoAssembly||[]).length,m=r?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-sliders"></i>
                <div><strong>${l}</strong> ass${l===1?"e":"i"} di configurazione e <strong>${r}</strong> combinazioni attive</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div>
                    ${o.slice(0,8).map(u=>`<span class="kit-cfg-sa-var-badge">${s(u.nome)}</span>`).join(" ")}
                    ${o.length>8?`<span class="kit-cfg-sa-count">+${o.length-8} altre</span>`:""}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${d}</strong> componenti in <strong>${(i.sezioni||[]).length}</strong> sezioni</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-hammer"></i>
                <div><strong>${p}</strong> parti tracciabili per il tab Pronti</div>
            </div>
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Assi di configurazione</strong> per definire le scelte che cambiano il prodotto, ad esempio <strong>LED</strong> e <strong>Lente</strong>.</div>',v=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${s(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${s(i.id)}',this.value)">
        </div>
        ${m}
        <div class="kit-cfg-danger">
            <button class="kit-btn-danger" onclick="_kitElimina('${s(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,b=e.map((u,A)=>{let T=(u.opzioni||[]).map((g,f)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input kit-cfg-input-small" value="${s(g.key)}" maxlength="20" placeholder="codice"
                       onchange="_kitCfgUpdateOpzione('${s(i.id)}','${s(u.id)}','${s(g.id)}','key',this.value)">
                <input class="kit-cfg-input" value="${s(g.nome)}" maxlength="50" placeholder="nome opzione"
                       onchange="_kitCfgUpdateOpzione('${s(i.id)}','${s(u.id)}','${s(g.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${s(i.id)}','${s(u.id)}','${s(g.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${A}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${s(u.nome)}" maxlength="40" placeholder="Nome asse (es. LED)"
                       onchange="_kitCfgUpdateAsse('${s(i.id)}','${s(u.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-small" value="${s(u.key)}" maxlength="20" placeholder="codice"
                       onchange="_kitCfgUpdateAsse('${s(i.id)}','${s(u.id)}','key',this.value)">
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${s(i.id)}','${s(u.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Ogni opzione di questo asse verr\xE0 combinata con le opzioni degli altri assi.</div>
            ${T||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${s(i.id)}','${s(u.id)}')"><i class="fas fa-plus"></i> Aggiungi opzione</button>
        </div>`}).join(""),$=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Combinazioni generate automaticamente</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(u=>`<span class="kit-cfg-sa-var-badge" title="${s(u.key)}">${s(u.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",z=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Gli <strong>assi di configurazione</strong> descrivono le scelte indipendenti del prodotto.<br>
                Per Shinino puoi creare per esempio <strong>LED</strong> e <strong>Lente</strong>: il sistema genera da solo tutte le combinazioni.<br>
                Se hai un solo asse, il comportamento resta identico ai vecchi kit lineari.
            </div>
            ${b||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun asse ancora. Aggiungi il primo asse per iniziare.</div>'}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${s(i.id)}')"><i class="fas fa-plus"></i> Aggiungi asse</button>
            ${$}
        </div>`,k=(i.sezioni||[]).map((u,A)=>{let T=(u.componenti||[]).map(g=>{let f=K(g),w=U(g),x=o.map(E=>{let Y=E.nome.length>18?E.nome.substring(0,16)+"\u2026":E.nome,Z=H(g,E.key);return f?`<label class="kit-meta-pill" title="${s(E.nome)}">
                        <input type="checkbox" ${Z>0?"checked":""}
                               onchange="_kitCfgUpdateComp('${s(i.id)}','${s(u.id)}','${s(g.id)}','flag','${s(E.key)}',this.checked ? 1 : 0)">
                        ${s(Y)}
                    </label>`:`<label class="kit-cfg-var-field" title="${s(E.nome)}">
                    <span class="kit-cfg-label" style="margin:0">${s(Y)}</span>
                    <input class="kit-cfg-coeff" type="number" min="0" value="${Z}"
                           onchange="_kitCfgUpdateComp('${s(i.id)}','${s(u.id)}','${s(g.id)}','coeff','${s(E.key)}',this.value)">
                </label>`}).join("");return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${s(g.nome)}" maxlength="60" placeholder="es. Star led"
                           onchange="_kitCfgUpdateComp('${s(i.id)}','${s(u.id)}','${s(g.id)}','nome','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${s(i.id)}','${s(u.id)}','${s(g.id)}','modo','',this.value)">
                        <option value="quantificato" ${f?"":"selected"}>Quantificato nel BOM</option>
                        <option value="segnalazione" ${f?"selected":""}>Solo segnalazione</option>
                    </select>
                    <label class="kit-meta-pill" title="Movimentabile a magazzino">
                        <input type="checkbox" ${w?"checked":""} ${f?"disabled":""}
                               onchange="_kitCfgToggleCompTracked('${s(i.id)}','${s(u.id)}','${s(g.id)}',this.checked)">
                        Magazzino
                    </label>
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${s(i.id)}','${s(u.id)}','${s(g.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <input class="kit-cfg-input" value="${s(g.noteConfig||"")}" maxlength="100" placeholder="Nota configurazione (es. presente solo se c'\xE8 il driver)"
                       onchange="_kitCfgUpdateComp('${s(i.id)}','${s(u.id)}','${s(g.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${f?"Usa i flag per indicare dove il requisito va mostrato senza entrare nei calcoli di stock o fabbisogno.":"Inserisci la quantit\xE0 per ciascuna combinazione. Usa 0 dove il componente non serve e 1 per gli optional/fissi presenti."}
                </div>
                <div class="kit-cfg-row" style="align-items:flex-start">${x||'<span class="kit-cfg-sa-empty">Configura prima almeno un asse con opzioni.</span>'}</div>
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${A}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${s(u.nome)}" maxlength="40" placeholder="Nome sezione (es. TESTA)"
                       onchange="_kitCfgUpdateSez('${s(i.id)}','${s(u.id)}','nome',this.value)">
                <button class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${s(i.id)}','${s(u.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${s(i.id)}','${s(u.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${T}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${s(i.id)}','${s(u.id)}')"><i class="fas fa-plus"></i> Aggiungi componente</button>
        </div>`}).join(""),C=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci il <strong>BOM reale</strong> del prodotto.<br>
                Usa <strong>Quantificato nel BOM</strong> per i materiali che entrano nei conti di fabbisogno e magazzino.<br>
                Usa <strong>Solo segnalazione</strong> per requisiti come la resina: il sistema li mostra ma non li movimenta.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>'}
            ${k}
            <div class="kit-cfg-row">
                <button class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${s(i.id)}')"><i class="fas fa-plus"></i> Aggiungi sezione</button>
                <button class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${s(i.id)}')"><i class="fas fa-copy"></i> Importa da altro kit</button>
            </div>
        </div>`,_="";o.length?_=o.map(u=>{let A=(i.sottoAssembly||[]).map((g,f)=>({sa:g,i:f})).filter(({sa:g})=>g.varianteKey===u.key),T=A.map(({sa:g,i:f})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${s(g.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${s(i.id)}',${f},'nome',this.value)">
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${s(i.id)}',${f})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${s(u.nome)}</span>
                    <span class="kit-cfg-sa-count">${A.length} part${A.length!==1?"i":"e"}</span>
                </div>
                ${T||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${s(i.id)}','${s(u.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${s(u.nome)}</button>
            </div>`}).join(""):_='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let M=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${_}
        </div>`,O={info:v,varianti:z,bom:C,sa:M},L=a.map(u=>`<button class="kit-tab ${V===u?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${u}')">${c[u]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${s(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${s(i.nome)}</span>
        </div>
        <div class="kit-tabs">${L}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${O[V]}</div>
    </div>`,X(n)}function _i(t){if(t&&B===t){D();return}B=t,D()}function wi(t){V=t,J()}function I(t,i,n=!0){let{kits:e}=h(),o=e.find(a=>a.id===t);o&&(i(o),q(e),n&&J())}function Ii(t,i){I(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Si(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=h();q(i.filter(n=>n.id!==t)),pt=null,B=null,Q()}function Mt(t){I(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:S(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:S(),key:"opz1",nome:"Opzione 1"}]})})}function Ai(t,i,n,e){I(t,function(o){let a=(o.assiConfigurazione||[]).find(c=>c.id===i);a&&(n==="key"?a.key=W(e,a.key||"asse"):a[n]=e.trim())})}function Ei(t,i){I(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function Mi(t,i){I(t,function(n){let e=(n.assiConfigurazione||[]).find(a=>a.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:S(),key:"opz"+o,nome:"Opzione "+o})})}function qi(t,i,n,e,o){I(t,function(a){let c=(a.assiConfigurazione||[]).find(r=>r.id===i),l=c&&(c.opzioni||[]).find(r=>r.id===n);l&&(e==="key"?l.key=W(o,l.key||"opzione"):l[e]=o.trim())})}function xi(t,i,n){I(t,function(e){let o=(e.assiConfigurazione||[]).find(a=>a.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(a=>a.id!==n))})}function Ti(t){Mt(t)}function Ni(t){I(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:S(),nome:"Nuova sezione",componenti:[]})})}function Bi(t){Et(t)}function Ki(t,i,n,e){I(t,function(o){let a=(o.sezioni||[]).find(c=>c.id===i);a&&(a[n]=e.trim())},!1)}function Li(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&I(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function Oi(t,i){I(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:S(),nome:"Nuovo componente",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function Pi(t,i,n,e,o,a){I(t,function(c){let l=(c.sezioni||[]).find(d=>d.id===i),r=l&&(l.componenti||[]).find(d=>d.id===n);if(r){if(e==="coeff"||e==="flag"){r.qtaPerVariante=r.qtaPerVariante||{},r.qtaPerVariante[o]=Math.max(0,Number.parseInt(a,10)||0);return}if(e==="modo"){r.modoComponente=a==="segnalazione"?"segnalazione":"quantificato",r.modoComponente==="segnalazione"?(r.tracciabile=!1,r.unitaMisura="flag"):r.unitaMisura==="flag"&&(r.unitaMisura="pz");return}r[e]=a.trim()}},e!=="nome"&&e!=="noteConfig")}function Ri(t,i,n,e){I(t,function(o){let a=(o.sezioni||[]).find(l=>l.id===i),c=a&&(a.componenti||[]).find(l=>l.id===n);!c||K(c)||(c.tracciabile=!!e)},!1)}function Di(t,i,n){I(t,function(e){let o=(e.sezioni||[]).find(a=>a.id===i);o&&(o.componenti=(o.componenti||[]).filter(a=>a.id!==n))})}function Hi(t){I(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:S(),nome:"",varianteKey:R(i)[0]?.key||""})})}function ji(t,i){I(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:S(),nome:"",varianteKey:i,noteConfig:""})})}function Vi(t,i,n,e){I(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function Ui(t,i){I(t,function(n){n.sottoAssembly.splice(i,1)})}function Zi(){window._kitOpenView=Wt,window._kitOpenConfig=At,window._kitNuovoKit=ui,window._kitBack=Yt,window._kitSwitchTab=Zt,window._kitAggiornaQty=Xt,window._kitAggiornaCar=$t,window._kitAggiornaPronti=ii,window._kitSetPronti=ei,window._kitApriModalSped=ri,window._kitChiudiModalSped=It,window._kitConfermaSpedizione=li,window._kitApriModalReso=di,window._kitChiudiModalReso=St,window._kitResoQtyChange=mi,window._kitResoAggiornaBOM=ft,window._kitConfermaReso=fi,window._kitSalvaMovimento=ni,window._kitEliminaMovimento=oi,window._kitModificaMovimento=ai,window._kitChiudiModalEditMov=wt,window._kitConfermaModificaMov=ci,window._kitChiudiModalDelMov=Ct,window._kitConfermaEliminaMov=_t,window._kitSalvaManuale=pi,window._kitElimina=Si,window._kitCfgBack=_i,window._kitCfgSwitchTab=wi,window._kitCfgSaveNome=Ii,window._kitCfgAddVar=Ti,window._kitCfgOpenImportModal=Et,window._kitCfgOpenCopySezModal=ki,window._kitCfgCloseImportModal=it,window._kitCfgSetImportMode=gi,window._kitCfgSetImportSearch=vi,window._kitCfgSelectImportSource=bi,window._kitCfgSelectImportSection=yi,window._kitCfgToggleImportTarget=hi,window._kitCfgSelectAllImportTargets=$i,window._kitCfgClearImportTargets=zi,window._kitCfgConfirmImport=Ci,window._kitCfgAddAsse=Mt,window._kitCfgUpdateAsse=Ai,window._kitCfgDelAsse=Ei,window._kitCfgAddOpzione=Mi,window._kitCfgUpdateOpzione=qi,window._kitCfgDelOpzione=xi,window._kitCfgAddSez=Ni,window._kitCfgImportSez=Bi,window._kitCfgUpdateSez=Ki,window._kitCfgDelSez=Li,window._kitCfgAddComp=Oi,window._kitCfgUpdateComp=Pi,window._kitCfgToggleCompTracked=Ri,window._kitCfgDelComp=Di,window._kitCfgAddSA=Hi,window._kitCfgAddSAForVariant=ji,window._kitCfgUpdateSA=Vi,window._kitCfgDelSA=Ui}var ct,tt,bt,st,vt,B,P,pt,V,y,Xi,Qi=xt(()=>{Tt();Bt();Kt();Nt();ct="_mlKitData",tt="_mlKitDataTs",bt=2,st=!1;vt=null;B=null,P="bom";pt=null,V="info",y=null;Xi=Q});Qi();export{Q as caricaKitProdotti,Xi as default,Zi as registerGlobals,Yi as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-FLK6UJVA.js.map
