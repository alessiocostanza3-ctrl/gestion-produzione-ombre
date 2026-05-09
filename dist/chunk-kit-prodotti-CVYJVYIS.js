import{a as Wi,c as Pt,e as Yi,f as r,g as y,h as zt,l as Zi,m as V,q as Xi,r as lt,u as te}from"./chunk-chunk-55SFP7PR.js";function $t(t){let i=Array.isArray(t)?{kits:t}:t&&typeof t=="object"?t:{},n=i.orderDrafts,e=n&&typeof n=="object"&&!Array.isArray(n)?n:{};return{kits:Array.isArray(i.kits)?i.kits.map(Ft):[],anagrafiche:Array.isArray(i.anagrafiche)?i.anagrafiche:[],distinte:Array.isArray(i.distinte)?i.distinte:[],presets:Array.isArray(i.presets)?i.presets:[],orderDrafts:e,draftDocSeq:Math.max(0,Number.parseInt(i.draftDocSeq,10)||0),ts:Number(i.ts||0)||0}}function Ot(){return{kits:x.kits,anagrafiche:x.anagrafiche,distinte:x.distinte,presets:x.presets,orderDrafts:x.orderDrafts,draftDocSeq:x.draftDocSeq}}function ci(t){let i=$t(t||{});return!!(i.kits&&i.kits.length||i.anagrafiche&&i.anagrafiche.length||i.distinte&&i.distinte.length||i.presets&&i.presets.length||i.orderDrafts&&Object.keys(i.orderDrafts).length||i.draftDocSeq>0)}function ee(){try{let t=localStorage.getItem("_mlKitData"),i=t?JSON.parse(t):{},n=Array.isArray(i)?i:Array.isArray(i?.kits)?i.kits:[],e=JSON.parse(localStorage.getItem("_mlKitAnagrafiche")||"[]"),o=JSON.parse(localStorage.getItem("_mlKitDistinte")||"[]"),s=JSON.parse(localStorage.getItem("_mlKitPresetSections")||"[]"),a=JSON.parse(localStorage.getItem("_mlKitOrderDrafts")||"{}"),d=Number.parseInt(localStorage.getItem("_mlKitOrderDraftSeq")||"0",10)||0;return{kits:Array.isArray(n)?n:[],anagrafiche:Array.isArray(e)?e:[],distinte:Array.isArray(o)?o:[],presets:Array.isArray(s)?s:[],orderDrafts:a&&typeof a=="object"&&!Array.isArray(a)?a:{},draftDocSeq:d}}catch{return $t({})}}function ne(){["_mlKitData","_mlKitDataTs","_mlKitOrderDrafts","_mlKitOrderDraftSeq","_mlKitPresetSections","_mlKitDistinte","_mlKitDistinteTs","_mlKitAnagrafiche","_mlKitAnagraficheTs"].forEach(function(i){try{localStorage.removeItem(i)}catch{}})}function Uo(){Rt=!1}function W(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function X(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function G(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function St(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function oe(t,i){let n="opz"+(i+1),e=W(t?.key,n);return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function se(t,i){let n="asse"+(i+1),e=W(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,a)=>oe(s,a)).filter(Boolean):[];return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function li(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function ae(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function pi(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let a of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:a.id,opzioneKey:a.key,opzioneNome:a.nome,opzioneCodice:String(a.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:li(e.selections),nome:ae(e.selections),selections:e.selections}})}function re(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||_()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:St(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:X(t?.qtaBase)}}function mi(t){return[...Array.isArray(t)?t:[]].sort((n,e)=>{let o=String(n?.nome||"").trim(),s=String(e?.nome||"").trim();return o.localeCompare(s,"it",{sensitivity:"base",numeric:!0})})}function ce(t){return{id:String(t?.id||_()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:mi(Array.isArray(t?.componenti)?t.componenti.map(re):[])}}function de(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function ui(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:X(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||X(Object.values(t?.qtaPerVariante||{})[0])};let e=E(i);if(!e.length)return n;let o=e.filter(c=>H(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>H(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>H(t,c.key)))};let a=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:a};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let u of c.opzioni||[]){let p=new Set(e.filter(h=>(h.selections||[]).some(f=>f.asseId===c.id&&f.opzioneId===u.id)).map(h=>h.key));if(!p.size)continue;[...p].every(h=>H(t,h)===a)&&l.push(u.id)}if(!l.length)continue;let m=new Set(e.filter(u=>(u.selections||[]).some(p=>p.asseId===c.id&&l.includes(p.opzioneId))).map(u=>u.key));if(de(m,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:a}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:a}}function Qt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=X(n.qtyBase);if(!o)return e;for(let s of E(i)){let a=n.tipo==="sempre";n.tipo==="gruppo"&&(a=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),a&&(e[s.key]=o)}return e}function le(t,i){let n=ce(t);return n.componenti=n.componenti.map(function(e){let o=ui(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:Qt(e,i,o)}}),n}function pe(t,i){let n=E(i);if(!n.length)return null;let e=null;for(let o of n){let s=H(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function me(t,i,n){let e=E(n),o={},s=pe(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let a of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},a.key)?H(t,a.key):s!==null?s:0;c>0&&(o[a.key]=c)}return{id:_(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:Jt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:St(t?.unitaMisura,j(t)?"flag":"pz")}}function At(t,i,n){return{id:_(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>me(e,i,n)):[]}}function fi(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=W(t?.key||String(t?.nome||"asse"),"asse1"),s=o,a=1;for(;e.has(s);)s=o+"_c"+a++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],m="opz"+(c+1),u=W(l?.key,m),p=1;for(;d.some(g=>g.key===u);)u=u+"_c"+p++;d.push({id:_(),key:u,nome:String(l?.nome||"").trim()||u,codice:String(l?.codice||"").trim()})}return{id:_(),key:s,nome:String(t?.nome||"").trim()||s,opzioni:d}}function Ut(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function Ct(t,i){let n=new Set(E(t).map(s=>s.key)),e=E(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function Mt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function ue(t,i){return{id:String(t?.id||_()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function Ft(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(p,g){let h="v"+(g+1),f=W(p?.key,h);return{id:String(p?.id||_()),key:f,nome:String(p?.nome||f).trim()||f}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((p,g)=>se(p,g)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(p){return{id:p.id,key:p.key,nome:p.nome}})}]:[],s=pi(o),a=s.length?s:n,d=new Set(a.map(p=>p.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(p){d.has(p[0])&&(c[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0))});for(let p of a)c[p.key]===void 0&&(c[p.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(p=>ue(p,a[0]?.key||"")).filter(p=>!p.varianteKey||d.has(p.varianteKey)):[],m={};Object.entries(i.pronti||{}).forEach(function(p){m[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0)});let u=Array.isArray(i.sezioni)?i.sezioni.map(p=>le(p,{assiConfigurazione:o,varianti:a})):[];return{id:String(i.id||_()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Vt,assiConfigurazione:o,varianti:a,sezioni:mi(u),sottoAssembly:l,qtaDaProdurre:c,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function E(t){return Array.isArray(t?.varianti)?t.varianti:[]}function j(t){return!!t&&t.modoComponente==="segnalazione"}function Jt(t){return!!t&&t.tracciabile!==!1&&!j(t)}function H(t,i){let n=X(t?.qtaPerVariante?.[i]);return j(t)?n>0?1:0:n}function Gt(t,i){return ui(t,i)}function gt(){let t=x.orderDrafts;return t&&typeof t=="object"?JSON.parse(JSON.stringify(t)):{}}function qt(t){let i=t&&typeof t=="object"?t:{};x.orderDrafts=i,vt()}function kt(){return Array.isArray(x.presets)?JSON.parse(JSON.stringify(x.presets)):[]}function Wt(t){x.presets=Array.isArray(t)?t:[],vt()}function nt(){return Array.isArray(x.distinte)?JSON.parse(JSON.stringify(x.distinte)):[]}function xt(t){x.distinte=Array.isArray(t)?t:[],vt()}function ot(t){return String(t||"").trim().toUpperCase()}function it(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(ot).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function U(t){return it(t?._meta||{})}function It(t,i){return t._meta=it(i),t._meta}function rt(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}async function Et(){try{let n=await lt({azione:"reserveKitDraftSeq"}),e=Math.max(0,Number.parseInt(n?.draftDocSeq,10)||0);if(e>0&&(x.draftDocSeq=e),x.ts=Number(n?.ts||x.ts||Date.now())||Date.now(),n?.documento)return String(n.documento)}catch(n){console.warn("[kit-prodotti] reserveKitDraftSeq fallita, fallback locale:",n)}let i=Math.max(0,Number.parseInt(x.draftDocSeq,10)||0)+1;return x.draftDocSeq=i,vt(),`Distinta Base-${String(i).padStart(4,"0")}`}function di(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:ot(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function Yt(){return st.length?Promise.resolve(st):Array.isArray(window._attiviProd)&&window._attiviProd.length?(st=di(window._attiviProd),Promise.resolve(st)):wt||(wt=fetch(Pt,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(st=di(t),st)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){wt=null}),wt)}function fe(t){let i=ot(t);return i&&st.find(n=>n.ordine===i)||null}function Bt(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=ot(e);return o?i[o]?String(i[o]||"").trim():String(fe(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function et(t){let i=gt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of E(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=it(n._meta||{}),e}function J(t,i){let{kits:n}=b(),e=n.find(m=>m.id===t);if(!e)return;let o=gt(),s=et(e);i(s,e);let a={},d=!1;for(let m of E(e)){let u=Math.max(0,Number.parseInt(s[m.key],10)||0);a[m.key]=u,u>0&&(d=!0)}let c=it(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(a._meta=c),d||l?o[t]=a:delete o[t],qt(o),T===t&&K()}function ge(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function gi(t){return!(t.assiConfigurazione&&t.assiConfigurazione.length)}function ut(t){let i=gt(),n=i?.[t]&&typeof i[t]=="object"?i[t]:{};return{_meta:it(n._meta||{}),_units:Math.max(1,Number.parseInt(n._units,10)||1),_sel:n._sel&&typeof n._sel=="object"?{...n._sel}:{}}}function ct(t,i,n){let e=gt(),o=e?.[t]&&typeof e[t]=="object"?e[t]:{},s={_meta:it(o._meta||{}),_units:Math.max(1,Number.parseInt(o._units,10)||1),_sel:o._sel&&typeof o._sel=="object"?{...o._sel}:{}};i(s);let a=Object.keys(s._sel).length>0,d=s._units>1,c=it(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);a||d||l?e[t]={_meta:c,_units:s._units,_sel:s._sel}:delete e[t],qt(e),n!==!1&&T===t&&K()}function ke(t,i){let n=Math.max(1,Number.parseInt(i,10)||1);try{window._kitSuppressNextFade=!0}catch{}ct(t,function(e){e._units=n})}function ve(t,i,n){try{window._kitSuppressNextFade=!0}catch{}ct(t,function(e){n?e._sel[i]=!0:delete e._sel[i]})}function ye(t,i){let n=String(i||"").trim().toLowerCase(),e=document.getElementById("kit-ns-autocomplete-"+t);if(e){if(!n){e.style.display="none",e.innerHTML="";return}Yt().then(function(o){let s=o.filter(function(a){return a.ordine.toLowerCase().includes(n)||a.cliente.toLowerCase().includes(n)}).slice(0,8);if(!s.length){e.style.display="none",e.innerHTML="";return}e.innerHTML=s.map(function(a){return`<div class="autocomplete-item" onmousedown='_kitNSOrderPick(${JSON.stringify(t)},${JSON.stringify(a.ordine)},${JSON.stringify(a.cliente)})'>
                <span class="ac-ordine">ORD. ${r(a.ordine)}</span>
                <span class="ac-cliente">${r(a.cliente)}</span>
            </div>`}).join(""),e.style.display="block"})}}function be(t){setTimeout(function(){let i=document.getElementById("kit-ns-autocomplete-"+t);i&&(i.style.display="none",i.innerHTML="")},140)}function he(t,i,n){let e=ot(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}ct(t,function(a){a._meta.ordiniCliente.includes(e)||a._meta.ordiniCliente.push(e),a._meta.cliente=Bt(a._meta.ordiniCliente,{[e]:n})});let o=document.getElementById("kit-ns-ref-input-"+t);o&&(o.value="");let s=document.getElementById("kit-ns-autocomplete-"+t);s&&(s.style.display="none",s.innerHTML="")}function ze(t,i){let n=ot(i);try{window._kitSuppressNextFade=!0}catch{}ct(t,function(e){e._meta.ordiniCliente=e._meta.ordiniCliente.filter(function(o){return o!==n}),e._meta.cliente=Bt(e._meta.ordiniCliente)})}function ki(t,i,n){try{window._kitSuppressNextFade=!0}catch{}ct(t,function(e){i.forEach(function(o){n?e._sel[o]=!0:delete e._sel[o]})})}function we(t){try{let i=t.dataset.kitid,n=JSON.parse(t.dataset.compids);ki(i,n,t.checked)}catch(i){console.error("[kit] _kitNSToggleSectionChk error",i)}}function _e(t){if(!confirm("Azzerare la selezione corrente?"))return;let i=gt();delete i[t],qt(i),K()}function Dt(t,i){let n=Math.max(1,Number.parseInt(i._units,10)||1),e=i._sel&&typeof i._sel=="object"?i._sel:{},o=[],s=[];for(let a of t.sezioni||[]){let d=[];for(let c of a.componenti||[]){if(!e[c.id])continue;let l=X(c.qtaBase!=null?c.qtaBase:1)*n;d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&s.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:""})}d.length&&o.push({id:a.id,nome:a.nome,righe:d})}return{selectedVarianti:[],sezioni:o,avvisi:s,totalePezzi:n,totaleRighe:o.reduce(function(a,d){return a+d.righe.length},0),_isNewStyle:!0}}async function Ce(t){let{kits:i}=b(),n=i.find(function(d){return d.id===t});if(!n)return;let e=ut(t),o=Dt(n,e);if(!o.totaleRighe){y("Seleziona almeno un componente per generare la distinta.","warning");return}if(!e._meta.documento){let d=await Et();ct(t,function(c){c._meta.documento=d},!1),e=ut(t)}let s={_meta:e._meta},a=nt();a.unshift({id:_(),kitId:n.id,kitNome:n.nome,nome:e._meta.documento||"Distinta-"+Date.now(),documento:e._meta.documento||"",createdAt:Date.now(),createdBy:V?.nome||"Sistema",orderDraftSnapshot:s,distintaSnapshot:o}),xt(a),y("Distinta salvata \u2713"),P==="distinte"&&B("distinte")}async function $e(t){let{kits:i}=b(),n=i.find(function(d){return d.id===t});if(!n)return;let e=ut(t),o=Dt(n,e);if(!o.totaleRighe){y("Seleziona almeno un componente per generare l'anteprima.","warning");return}if(!e._meta.documento){let d=await Et();ct(t,function(c){c._meta.documento=d},!1),e=ut(t)}let s={_meta:e._meta},a=window.open("","_blank");if(!a){y("Popup bloccato: abilita l'anteprima di stampa.","warning");return}a.document.open(),a.document.write(Xt(n,o,s)),a.document.close(),a.focus()}function Se(t,i){let n=ut(t.id),e=n._units,o=n._sel,s=Dt(t,n),a=n._meta,d=t.sezioni||[],c=d.map(function(u){let p=u.componenti||[];if(!p.length)return"";let g=p.map(function($){let L=!!o[$.id],R=L?X($.qtaBase!=null?$.qtaBase:1)*e:0;return`<label class="kit-ns-comp-row${L?" kit-ns-comp-row--checked":""}">
                <input type="checkbox" class="kit-ns-check"${L?" checked":""}
                    onchange="_kitNSToggleComp('${r(t.id)}','${r($.id)}',this.checked)">
                <div class="kit-ns-comp-info">
                    <span class="kit-ns-comp-name">${r($.nome)}</span>
                    ${$.codice?`<span class="kit-ns-comp-code">\xB7 ${r($.codice)}</span>`:""}
                    <span class="kit-ns-comp-qty-base">${G($.qtaBase!=null?$.qtaBase:1)} ${$.unitaMisura||"pz"}/unit\xE0</span>
                </div>
                ${L?`<div class="kit-ns-comp-total">${G(R)} ${$.unitaMisura||"pz"}</div>`:""}
            </label>`}).join(""),h=p.every(function($){return!!o[$.id]}),f=p.some(function($){return!!o[$.id]}),z=r(JSON.stringify(p.map(function($){return $.id})));return`<div class="kit-ns-section">
            <div class="kit-ns-section-header">
                <span class="kit-ns-section-title">${r(u.nome)}</span>
                <label class="kit-ns-sel-all" title="${h?"Deseleziona tutto":"Seleziona tutto"}">
                    <input type="checkbox" class="kit-ns-check kit-ns-sel-all-chk"
                        data-kitid="${r(t.id)}" data-compids="${z}"
                        ${h?" checked":f?' data-indeterminate="true"':""}
                        onchange="_kitNSToggleSectionChk(this)">
                    <span>${h?"Deseleziona tutto":"Seleziona tutto"}</span>
                </label>
            </div>
            <div class="kit-ns-comps">${g}</div>
        </div>`}).join(""),l=a.ordiniCliente.length?a.ordiniCliente.map(function(u){return`<span class="kit-order-ref-chip">${r(u)}
                <button type="button" class="kit-order-ref-chip-remove"
                    onclick='_kitNSOrderRemoveRef(${JSON.stringify(t.id)},${JSON.stringify(u)})' aria-label="Rimuovi ordine">
                    <i class="fas fa-times"></i>
                </button>
            </span>`}).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',m=s.totaleRighe?s.sezioni.map(function(u){return`<div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${r(u.nome)}</div>
                ${u.righe.map(function(p){return`<div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${r(p.nome)}</div>
                            ${p.codice?`<div class="kit-distinta-row-meta">${r(p.codice)}</div>`:""}
                            ${p.noteConfig?`<div class="kit-distinta-row-note">${r(p.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${G(p.totale)} ${r(p.unita)}</div>
                    </div>`}).join("")}
            </div>`}).join(""):"";i.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button type="button" class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${r(t.nome)}</span>
            <button type="button" class="kit-gear-btn-inline" onclick="_kitOpenConfig('${r(t.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <!-- Sommario + azioni -->
        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Distinta in composizione</div>
                    <div class="kit-order-summary-total">${e} unit\xE0 \xB7 ${s.totaleRighe} materiali</div>
                </div>
                <div class="kit-order-summary-actions">
                    <button type="button" class="kit-btn-secondary" onclick="_kitNSOpenPrintPreview('${r(t.id)}')"><i class="fas fa-print"></i> Anteprima stampa</button>
                    <button type="button" class="kit-cfg-add-btn" onclick="_kitNSCreateDistinta('${r(t.id)}')"><i class="fas fa-save"></i> Salva distinta</button>
                    <button type="button" class="kit-btn-secondary" onclick="_kitNSReset('${r(t.id)}')"><i class="fas fa-rotate-left"></i> Azzera</button>
                </div>
            </div>
            <div class="kit-order-summary-note">La selezione rimane locale sul dispositivo finch\xE9 non salvi una distinta.</div>
        </div>

        <!-- Quante unit\xE0 -->
        <div class="kit-ns-units-card">
            <div class="kit-ns-units-label">Quante unit\xE0 vuoi produrre?</div>
            <div class="kit-order-stepper">
                <button type="button" class="kit-order-stepper-btn" onclick="_kitNSSetUnits('${r(t.id)}',${e-1})">\u2212</button>
                <input class="kit-order-stepper-input" type="number" min="1" value="${e}"
                    onchange="_kitNSSetUnits('${r(t.id)}',this.value)">
                <button type="button" class="kit-order-stepper-btn" onclick="_kitNSSetUnits('${r(t.id)}',${e+1})">+</button>
            </div>
        </div>

        <!-- Ordini cliente -->
        <div class="kit-order-meta-grid">
            <div class="kit-order-meta-card">
                <div class="kit-order-meta-title">Ordini cliente</div>
                <div class="ordine-autocomplete-wrapper kit-order-autocomplete-wrapper">
                    <input class="kit-order-meta-input" id="kit-ns-ref-input-${r(t.id)}" type="text" placeholder="Cerca e collega un ordine cliente"
                        oninput="_kitNSOrderSearch('${r(t.id)}',this.value)"
                        onfocus="_kitNSOrderSearch('${r(t.id)}',this.value)"
                        onblur="_kitNSOrderHideSearch('${r(t.id)}')">
                    <div id="kit-ns-autocomplete-${r(t.id)}" class="ordine-autocomplete-list"></div>
                </div>
                <div class="kit-order-ref-list">${l}</div>
            </div>
        </div>

        <!-- Selezione componenti -->
        <div class="kit-ns-comps-panel">
            ${d.length?`<div class="kit-ns-panel-title">Seleziona i componenti per questo ordine</div>${c}`:`<div class="kit-cfg-help">Questo kit non ha ancora componenti. <button type="button" class="btn-link-inline" onclick="_kitOpenConfig('${r(t.id)}')">Apri configurazione</button></div>`}
        </div>

        <!-- Distinta anteprima -->
        ${s.totaleRighe?`
        <div class="kit-ns-distinta-preview">
            <div class="kit-ns-panel-title" style="margin-bottom:8px">Riepilogo distinta (${s.totaleRighe} materiali \xB7 ${G(e)} unit\xE0)</div>
            ${m}
        </div>`:""}
    </div>`,i.querySelectorAll('[data-indeterminate="true"]').forEach(function(u){u.indeterminate=!0})}function Zt(t){let i=_t[t.id]&&typeof _t[t.id]=="object"?_t[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return _t[t.id]=n,n}function vi(t,i){let n=t.assiConfigurazione||[];if(!n.length)return E(t)[0]||null;let e=[];for(let s of n){let a=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===a);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=li(e);return E(t).find(s=>s.key===o)||null}function xe(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function Ie(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let a of s.componenti||[])if(!j(a)&&!(H(a,i.key)<=0)&&a.applicazioneTipo==="gruppo"&&String(a.applicazioneAsseId||"")===e&&Array.isArray(a.applicazioneOpzioneIds)&&a.applicazioneOpzioneIds.includes(o))return!0;return!1}function Ae(t,i,n){let e=[],o=new Map;for(let s of i){let a=rt(n,s.key);if(a)for(let d of s.selections||[]){if(Ie(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=a;continue}let m={id:"sel-"+c,nome:xe(d),codice:String(d?.opzioneCodice||"").trim(),totale:a,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,m),e.push(m)}}return e}function Tt(t,i){if(gi(t))return Dt(t,ut(t.id));let n=E(t).filter(a=>rt(i,a.key)>0),e=[],o=[],s=Ae(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let a of t.sezioni||[]){let d=[];for(let c of a.componenti||[]){let l=0,m=[];for(let p of n){let g=rt(i,p.key),h=H(c,p.key);!g||!h||(j(c)?l+=g:l+=g*h,m.push({nome:p.nome,pezziOrdine:g,coeff:h}))}if(!m.length)continue;let u=m.length===1?m[0].nome:m.length+" configurazioni";if(j(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:u});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:u})}d.length&&e.push({id:a.id,nome:a.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:ge(i),totaleRighe:e.reduce((a,d)=>a+d.righe.length,0)}}function Me(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function Ne(){return String(window._distintaHeaderAzienda||"").trim()}function Xt(t,i,n){let e=new Date,o=U(n),s=Ne(),a=String(o.documento||"").trim(),d=s?s.split(/\r?\n/).map(g=>String(g||"").trim()).filter(Boolean).join(" - "):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),m=i.selectedVarianti.length?i.selectedVarianti.map(g=>{let h=rt(n,g.key);return`<tr>
                <td>${r(G(h))}</td>
                <td>${r(g.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',u=i.sezioni.map(g=>{let h=g.righe.map(f=>{let z=[f.dettaglio,f.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${r(String(f.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${r(f.nome)}</div></td>
                <td class="db-print-cell-unit">${r(f.unita)}</td>
                <td class="db-print-cell-qty">${r(G(f.totale))}</td>
                <td class="db-print-cell-note">${z?r(z):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${r(g.nome)}</td></tr>${h}`}).join(""),p=i.avvisi.length?i.avvisi.map(g=>`<div class="db-print-alert ${g.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${r(g.nome)}</div>
                <div>${r(g.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${r(G(g.totaleCoinvolto))} pz \xB7 ${r(g.variantiLabel)}</div>
            </div>`).join(""):'<div class="db-print-empty">Nessun avviso operativo collegato a questa distinta.</div>';return`<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distinta base - ${r(t.nome)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Roboto:wght@400;500;700;800&display=swap" rel="stylesheet">
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
        html, body { margin: 0; padding: 0; background: var(--bg); font-family: 'Roboto', 'Segoe UI', sans-serif; color: var(--ink); }
        body { min-height: 100vh; font-size: 14px; }
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
        .db-print-toolbar-title { font-size: 14px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
        .db-print-toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .db-print-toolbar button {
            border: 1px solid rgba(255,255,255,0.16);
            background: #fff;
            color: #0f172a;
            border-radius: 999px;
            padding: 10px 16px;
            font-size: 13px;
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
        .db-print-company-footer {
            margin-top: 14px;
            padding-top: 10px;
            border-top: 1px solid var(--line);
            text-align: center;
            font-size: 12px;
            line-height: 1.45;
            color: var(--brand);
            font-weight: 500;
            letter-spacing: 0.01em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .db-print-title-block {
            text-align: left;
            min-width: 240px;
        }
        .db-print-title {
            font-family: 'Lora', Georgia, serif;
            font-size: 46px;
            font-weight: 800;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            color: var(--accent);
            line-height: 1.05;
        }
        .db-print-subtitle {
            margin-top: 4px;
            font-size: 12px;
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
            font-size: 13px;
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
            font-size: 11px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 6px;
        }
        .db-print-strip-value {
            font-size: 19px;
            font-weight: 800;
            color: var(--accent);
        }
        .db-print-config-title,
        .db-print-materials-title,
        .db-print-alerts-title {
            font-size: 14px;
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
            font-size: 12px;
            vertical-align: top;
        }
        .db-print-config-table th,
        .db-print-table th {
            background: #f8fafc;
            text-align: left;
            font-size: 11px;
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
        .db-print-row-name { font-size: 13px; font-weight: 700; color: var(--ink); }
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
        .db-print-alert-title { font-size: 13px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
        .db-print-alert-meta { margin-top: 5px; font-size: 11px; color: var(--muted); }
        .db-print-empty { color: var(--muted); font-size: 12px; padding: 12px; border: 1px dashed var(--line); }
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
                <div class="db-print-title-block">
                    <div class="db-print-title">Distinta Base</div>
                    <div class="db-print-subtitle">Documento interno di produzione e approvvigionamento</div>
                </div>
            </div>

            <div class="db-print-meta-grid">
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Prodotto</div><div class="db-print-meta-value">${r(t.nome)}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Riferimento</div><div class="db-print-meta-value">${r(o.cliente||"")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${r(Me(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${r(V?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${r(G(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${r(G(i.totaleRighe))}</div></div>
                </div>
            </div>

            <div class="db-print-strip">
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Documento</div>
                    <div class="db-print-strip-value">${r(a)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Prodotto</div>
                    <div class="db-print-strip-value">${r(t.nome)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">${r(c)}</div>
                    <div class="db-print-strip-value">${r(l)}</div>
                </div>
            </div>

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
                <tbody>${u}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${p}</div>

            ${d?`<div class="db-print-company-footer">${r(d)}</div>`:""}
        </div>
    </div>
</body>
</html>`}async function Oe(t){let{kits:i}=b(),n=i.find(a=>a.id===t);if(!n)return;let e=et(n),o=Tt(n,e);if(!o.totalePezzi||!o.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}if(!U(e).documento){let a=await Et();J(t,function(d){let c=U(d);c.documento=a,It(d,c)}),e=et(n)}let s=window.open("","_blank");if(!s){y("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(Xt(n,o,e)),s.document.close(),s.focus()}function yi(t){return[...Array.isArray(t)?t:[]].sort((n,e)=>{let o=String(n?.nome||"").trim(),s=String(e?.nome||"").trim();return o.localeCompare(s,"it",{sensitivity:"base",numeric:!0})})}function b(){let t=Array.isArray(x.kits)?x.kits.map(Ft):[];return{kits:yi(t)}}function A(t){let i=yi(Array.isArray(t)?t.map(Ft):[]);x.kits=i,vt()}function qe(){if(!mt)return;clearTimeout(mt),mt=null;let t=Ot();lt({azione:"setKitData",payload:t}).then(function(i){x.ts=Number(i?.ts||Date.now())||Date.now()}).catch(function(i){console.warn("[kit-prodotti] flush remoto fallito:",i)})}function vt(){clearTimeout(mt),mt=setTimeout(function(){mt=null;let t=Ot();lt({azione:"setKitData",payload:t}).then(function(i){x.ts=Number(i?.ts||Date.now())||Date.now()}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function Ee(t){fetch(Pt,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&i.integrityOk===!1){console.error("[kit-prodotti] payload kit non leggibile lato server:",i.parseError||"parse error"),y("Errore lettura dati Kit dal server. Contatta subito supporto: nessun salvataggio automatico verr\xE0 forzato.","error"),t&&t(!1);return}let n=$t(i);if(ci(n)){x=n,t&&t(!0);return}let e=ee();if(ci(e)){x=$t(e),lt({azione:"setKitData",payload:Ot()}).then(function(o){x.ts=Number(o?.ts||Date.now())||Date.now(),ne(),y("Migrazione Kit completata: dati spostati su Sheets.","success"),t&&t(!0)}).catch(function(){t&&t(!1)});return}x=n,t&&t(!0)}).catch(()=>{t&&t(!1)})}function _(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function ti(){if(!V||!V.nome)return!1;let t=String(V.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||V.ruolo==="MASTER"}function Be(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(j(e)){i[e.id]=0;continue}let o=0;for(let[s,a]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(a,10)||0)*H(e,s);i[e.id]=o}return i}function De(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let a of s.componenti||[]){if(j(a))continue;let d=H(a,o);d>0&&(i[a.id]=(i[a.id]||0)+e*d)}}return i}function bi(t,i){let n=E(t).find(e=>e.key===i);return n?r(n.nome):r(i)}function ii(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function yt(){if(window.paginaAttuale!=="KIT_PRODOTTI")return;if(!Rt){Rt=!0;let n=document.getElementById("contenitore-dati");n&&(n.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento kit dal database...</div>"),Ee(function(){yt()});return}let{kits:t}=b(),i=document.getElementById("contenitore-dati");if(i){i.innerHTML=`
    <div class="kit-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title"><i class="fas fa-toolbox" style="color:#6366f1;margin-right:6px;font-size:1.1rem"></i>Kit Prodotti</h3>
                <p class="acquisti-subtitle">Gestisci kit, componenti e distinte.</p>
            </div>
            <div id="kit-page-actions" class="acquisti-actions-wrapper"></div>
        </div>
        <div id="kit-tab-bar" style="display:flex;gap:4px;padding:8px 0 0">
            <button class="acq-tab ${P==="kits"?"active":""}" data-tab="kits" onclick="_kitSwitchMainTab('kits')"><i class="fas fa-boxes-stacked"></i> Kits</button>
            <button class="acq-tab ${P==="anagrafiche"?"active":""}" data-tab="anagrafiche" onclick="_kitSwitchMainTab('anagrafiche')"><i class="fas fa-list"></i> Anagrafiche</button>
            <button class="acq-tab ${P==="distinte"?"active":""}" data-tab="distinte" onclick="_kitSwitchMainTab('distinte')"><i class="fas fa-file-alt"></i> Distinte</button>
        </div>
        <div id="kit-main-content" class="kit-main-content" style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:0"></div>
    </div>`,B(P),ei();try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else zt(i)}catch{zt(i)}}}function hi(t,i){if(!i)return;if(!t.length){i.innerHTML=`
        <div style="padding:40px 0;text-align:center">
            <i class="fas fa-box-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:16px;display:block"></i>
            <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun kit configurato.</p>
            <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
        </div>`;return}let n=["pz","mt","cm","mm","kg","g","lt","ml"],e=t.map(o=>{let s=o.sezioni||[],a=s.reduce((l,m)=>l+(m.componenti||[]).length,0),d=s.length,c=s.map(l=>{let m=l.componenti||[],u=m.map(p=>`
            <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #f8fafc">
                <span style="font-size:.84rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r(p.nome)}">${r(p.nome)}${p.codice?` <span style="color:#94a3b8;font-size:.76rem">\xB7 ${r(p.codice)}</span>`:""}</span>
                <input type="number" min="0" step="any" value="${p.qtaBase!=null?p.qtaBase:1}"
                    class="input-field-modern" style="padding:4px 8px;font-size:.82rem;text-align:right"
                    onchange="_kitQUpdateComp('${r(o.id)}','${r(l.id)}','${r(p.id)}','qtaBase',this.value)"
                    title="Quantit\xE0">
                <select class="input-field-modern" style="padding:4px 6px;font-size:.82rem"
                    onchange="_kitQUpdateComp('${r(o.id)}','${r(l.id)}','${r(p.id)}','unitaMisura',this.value)">
                    ${n.map(g=>`<option value="${g}"${(p.unitaMisura||"pz")===g?" selected":""}>${g}</option>`).join("")}
                </select>
                <button type="button" class="btn-trash-modern" style="padding:4px 7px"
                    onclick="_kitQDelComp('${r(o.id)}','${r(l.id)}','${r(p.id)}')" title="Rimuovi componente"><i class="fas fa-trash"></i></button>
            </div>`).join("");return`
            <details style="border-top:1px solid #f1f5f9">
                <summary style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;cursor:pointer;list-style:none;user-select:none;background:#fafafa;border-radius:0">
                    <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                        <input type="text" value="${r(l.nome)}"
                            class="input-field-modern" style="padding:3px 8px;font-size:.84rem;font-weight:600;max-width:200px;background:transparent;border:1px solid transparent"
                            onclick="event.preventDefault();event.stopPropagation()"
                            onfocus="this.style.background='#fff';this.style.border='1px solid #e2e8f0'"
                            onblur="this.style.background='transparent';this.style.border='1px solid transparent';_kitQRenomeSez('${r(o.id)}','${r(l.id)}',this.value)">
                        <span style="color:#94a3b8;font-size:.76rem;white-space:nowrap">${m.length} comp.</span>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;flex-shrink:0">
                        <button type="button" class="btn-trash-modern" style="padding:3px 7px;font-size:.75rem"
                            onclick="event.preventDefault();event.stopPropagation();_kitQDelSez('${r(o.id)}','${r(l.id)}')" title="Rimuovi sezione"><i class="fas fa-trash"></i></button>
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
                    ${u}`:'<p style="color:#94a3b8;font-size:.82rem;padding:6px 0">Nessun componente.</p>'}
                    <button type="button" class="btn-archive-action" style="margin-top:8px;font-size:.8rem"
                        onclick="_kitQAddCompOpen('${r(o.id)}','${r(l.id)}')">
                        <i class="fas fa-plus"></i> Aggiungi componente
                    </button>
                </div>
            </details>`}).join("");return`
        <details class="ordine-group" style="margin-bottom:8px">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore" style="font-size:1rem">${r(o.nome)}</span>
                    <span style="color:#94a3b8;font-size:.78rem;font-weight:500;margin-left:8px">${d} sez. \xB7 ${a} comp.</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center">
                    <button type="button" class="btn-archive-action primary" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenView('${r(o.id)}')" title="Usa kit / crea ordine">
                        Usa
                    </button>
                    <button type="button" class="btn-archive-action" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenConfig('${r(o.id)}')" title="Configurazione avanzata">
                        Config
                    </button>
                    <button type="button" class="btn-archive-action" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenDuplicateModal('${r(o.id)}')" title="Duplica kit">
                        Duplica
                    </button>
                    <button type="button" class="btn-trash-modern"
                        onclick="event.preventDefault();event.stopPropagation();_kitQDelKit('${r(o.id)}')" title="Elimina kit">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </div>
            </summary>
            <div class="ordine-items" style="padding:0">
                ${s.length?c:'<p class="acquisti-subtitle" style="padding:12px 16px;margin:0">Nessuna sezione. Aggiungi una sezione per iniziare.</p>'}
                <div style="padding:8px 12px;border-top:1px solid #f1f5f9">
                    <button type="button" class="btn-archive-action" style="font-size:.8rem"
                        onclick="_kitQAddSezOpen('${r(o.id)}')">
                        <i class="fas fa-folder-plus"></i> Aggiungi sezione
                    </button>
                </div>
            </div>
        </details>`}).join("");i.innerHTML=e}function ei(){let t=document.getElementById("kit-page-actions");t&&(P==="kits"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>':P==="anagrafiche"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>':t.innerHTML="")}function B(t){P=t,document.querySelectorAll("#kit-tab-bar .acq-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)});let{kits:i}=b(),n=document.getElementById("kit-main-content");n&&(t==="kits"?hi(i,n):t==="anagrafiche"?zi(i,n):t==="distinte"&&wi(i,n),ei())}function zi(t,i){if(!i)return;let n=Y();if(!n.length){i.innerHTML=`
            <div style="padding:24px 0;text-align:center">
                <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun componente salvato. Aggiungi il primo componente riutilizzabile.</p>
                <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi componente</button>
            </div>`;return}let e=n.reduce((a,d)=>{let c=d.categoria||"Senza categoria";return a[c]=a[c]||[],a[c].push(d),a},{}),o=Object.keys(e).sort((a,d)=>a.localeCompare(d,"it",{sensitivity:"base",numeric:!0})),s="";for(let a of o){let d=ni(e[a]||[]);s+=`<details class="ordine-group" open>
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${r(a)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${d.length} componente${d.length!==1?"i":""}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">`,s+=d.map(c=>`
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        <div style="font-weight:600;color:#1e293b">${r(c.nome)}${c.codice?` <span style="color:#94a3b8;font-size:.85rem;font-weight:400">\xB7 ${r(c.codice)}</span>`:""}</div>
                        ${c.descrizione?`<div style="color:#94a3b8;font-size:.82rem;margin-top:2px">${r(c.descrizione)}</div>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitOpenAnagraficaModal('${r(c.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questo componente?')) _kitDeleteAnagrafica('${r(c.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`).join(""),s+="</div></details>"}i.innerHTML=s}function wi(t,i){if(!i)return;let n=nt();if(!n.length){i.innerHTML='<div style="padding:24px 0;text-align:center"><p class="acquisti-subtitle">Nessuna distinta salvata.</p></div>';return}let e=n.map(o=>`
        <details class="ordine-group">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${r(o.nome)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${r(o.kitNome||"")}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        ${o.documento?`<div style="font-size:.85rem;color:#64748b">${r(o.documento)}</div>`:""}
                        <div style="color:#94a3b8;font-size:0.8rem;margin-top:2px">${r(new Date(o.createdAt).toLocaleString())} \xB7 ${r(o.createdBy)}</div>
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitDistintaOpenPrint('${r(o.id)}')"><i class="fas fa-print"></i> Stampa</button>
                        <button type="button" class="btn-archive-action" onclick="_kitDistintaApplyToDraft('${r(o.id)}')"><i class="fas fa-file-import"></i> Applica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questa distinta?')) _kitDistintaDelete('${r(o.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </details>`).join("");i.innerHTML=e}async function _i(t){let{kits:i}=b(),n=i.find(c=>c.id===t);if(!n){y("Kit non trovato \u26A0\uFE0F");return}let e=et(n);if(!U(e).documento){let c=await Et();J(t,function(l){let m=U(l);m.documento=c,It(l,m)}),e=et(n)}let o=Tt(n,e);if(!o.totalePezzi||!o.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}let s=nt(),a=U(e),d={id:_(),kitId:n.id,kitNome:n.nome,nome:a.documento||`Distinta-${Date.now()}`,documento:a.documento||"",createdAt:Date.now(),createdBy:V?.nome||"Sistema",orderDraftSnapshot:e,distintaSnapshot:o};s.unshift(d),xt(s),y("Distinta salvata \u2713"),P==="distinte"&&B("distinte")}function ni(t){return[...Array.isArray(t)?t:[]].sort((n,e)=>{let o=String(n?.categoria||"Senza categoria").trim()||"Senza categoria",s=String(e?.categoria||"Senza categoria").trim()||"Senza categoria",a=o.localeCompare(s,"it",{sensitivity:"base",numeric:!0});if(a!==0)return a;let d=String(n?.nome||"").trim(),c=String(e?.nome||"").trim(),l=d.localeCompare(c,"it",{sensitivity:"base",numeric:!0});if(l!==0)return l;let m=String(n?.codice||"").trim(),u=String(e?.codice||"").trim();return m.localeCompare(u,"it",{sensitivity:"base",numeric:!0})})}function Y(){let t=Array.isArray(x.anagrafiche)?JSON.parse(JSON.stringify(x.anagrafiche)):[];return ni(t)}function oi(t){x.anagrafiche=ni(Array.isArray(t)?t:[]),vt()}function Te(){if(document.getElementById("modal-kit-anagrafica-edit"))return;let t=document.createElement("div");t.innerHTML=`
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
    </div>`,document.body.appendChild(t.firstElementChild)}function Le(t){Te();let i=document.getElementById("modal-kit-anagrafica-edit");if(!i)return;let n=document.getElementById("anag-componente"),e=document.getElementById("anag-codice"),o=document.getElementById("anag-categoria"),s=document.getElementById("anag-descrizione");if(t){let a=Y().find(d=>d.id===t);a&&(n&&(n.value=a.nome||""),e&&(e.value=a.codice||""),o&&(o.value=a.categoria||""),s&&(s.value=a.descrizione||""),i.dataset.editId=t)}else n&&(n.value=""),e&&(e.value=""),o&&(o.value=""),s&&(s.value=""),delete i.dataset.editId;i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function Ci(){let t=document.getElementById("modal-kit-anagrafica-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Pe(){let t=document.getElementById("modal-kit-anagrafica-edit");if(!t)return;let i=t.dataset.editId,n=(document.getElementById("anag-componente")?.value||"").trim();if(!n){y("Inserisci il nome del componente","warning");return}let e=(document.getElementById("anag-codice")?.value||"").trim(),o=(document.getElementById("anag-categoria")?.value||"").trim(),s=(document.getElementById("anag-descrizione")?.value||"").trim(),a=Y();if(i){let d=a.findIndex(c=>c.id===i);d!==-1?a[d]={...a[d],nome:n,codice:e,categoria:o,descrizione:s,updatedAt:Date.now()}:a.unshift({id:_(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:V?.nome||"Sistema"})}else a.unshift({id:_(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:V?.nome||"Sistema"});oi(a),Ci(),y("Componente salvato \u2713"),P==="anagrafiche"&&B("anagrafiche")}function Ke(t){let i=Y().filter(n=>n.id!==t);oi(i),P==="anagrafiche"&&B("anagrafiche"),y("Componente eliminato \u2713")}function Re(t){let i=nt().find(o=>o.id===t);if(!i)return;let{kits:n}=b(),e=n.find(o=>o.id===i.kitId)||null;if(e){let o=window.open("","_blank");if(!o){y("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}o.document.open();try{o.document.write(Xt(e,i.distintaSnapshot,i.orderDraftSnapshot))}catch{o.document.write("<pre>"+r(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>")}o.document.close(),o.focus()}else{let o=window.open("","_blank");if(!o){y("Popup bloccato","warning");return}o.document.open(),o.document.write("<pre>"+r(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>"),o.document.close(),o.focus()}}function He(t){let i=nt().find(e=>e.id===t);if(!i)return;let n=gt();n[i.kitId]=i.orderDraftSnapshot||{},qt(n),y("Bozza ordine ripristinata per il kit selezionato \u2713")}function je(t){let i=nt().filter(n=>n.id!==t);xt(i),P==="distinte"&&B("distinte"),y("Distinta eliminata \u2713")}function Ve(t){T=t,$i="ordine",K()}function K(){let{kits:t}=b(),i=t.find(f=>f.id===T);if(!i){yt();return}let n=document.getElementById("contenitore-dati");if(gi(i)){Se(i,n);return}let e=E(i),o=et(i),s=U(o),a=Tt(i,o),d=a.selectedVarianti.length?a.selectedVarianti.map(f=>`<span class="kit-meta-pill"><strong>${rt(o,f.key)}</strong> \xD7 ${r(f.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=s.ordiniCliente.length?s.ordiniCliente.map(f=>`<span class="kit-order-ref-chip">${r(f)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(f)})' aria-label="Rimuovi ordine ${r(f)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=Zt(i),m=vi(i,l),u=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(f=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${r(f.nome)}</div>
                <div class="kit-compose-options">${(f.opzioni||[]).map(z=>`
                        <button type="button" class="kit-compose-option ${l[f.id]===z.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${r(i.id)}','${r(f.id)}','${r(z.id)}')">
                        ${r(z.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',p=a.selectedVarianti.length?a.selectedVarianti.map(f=>{let z=rt(o,f.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${r(f.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(f.selections)&&f.selections.length?f.selections.map($=>r($.opzioneNome)).join(" \xB7 "):r(f.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${r(i.id)}','${r(f.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${z}"
                           onchange="_kitOrdineSet('${r(i.id)}','${r(f.key)}',this.value)"
                           oninput="_kitOrdineSet('${r(i.id)}','${r(f.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${r(i.id)}','${r(f.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${r(i.id)}','${r(f.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,g=a.totalePezzi?a.sezioni.map(f=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${r(f.nome)}</div>
                ${f.righe.map(z=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${r(z.nome)}</div>
                            ${z.dettaglio?`<div class="kit-distinta-row-meta">${r(z.dettaglio)}</div>`:""}
                            ${z.noteConfig?`<div class="kit-distinta-row-note">${r(z.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${G(z.totale)} ${r(z.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,h=a.avvisi.length?a.avvisi.map(f=>`
            <div class="kit-distinta-alert ${f.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${r(f.nome)}</div>
                <div class="kit-distinta-alert-body">${r(f.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${f.totaleCoinvolto} pz \xB7 ${r(f.variantiLabel)}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Nessun avviso particolare per l\u2019ordine attuale.</div>';n.innerHTML=`
    <div class="kit-page">
            <div class="kit-view-header">
            <button type="button" class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${r(i.nome)}</span>
            <button type="button" class="kit-gear-btn-inline" onclick="_kitOpenConfig('${r(i.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Ordine in composizione</div>
                    <div class="kit-order-summary-total">${a.totalePezzi} pezzi</div>
                </div>
                <div class="kit-order-summary-actions">
                        <button type="button" class="kit-btn-secondary" onclick="_kitOpenPrintPreview('${r(i.id)}')"><i class="fas fa-print"></i> Anteprima stampa</button>
                        <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenSaveDistintaModal('${r(i.id)}')"><i class="fas fa-save"></i> Salva distinta</button>
                        <button type="button" class="kit-btn-secondary" onclick="_kitOrdineReset('${r(i.id)}')"><i class="fas fa-rotate-left"></i> Azzera ordine</button>
                </div>
            </div>
            <div class="kit-order-summary-note">Questa bozza ordine resta locale sul dispositivo e serve solo per generare la distinta base di approvvigionamento.</div>
            <div class="kit-order-meta-grid">
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Ordini cliente</div>
                    <div class="ordine-autocomplete-wrapper kit-order-autocomplete-wrapper">
                        <input class="kit-order-meta-input" id="kit-order-ref-input-${r(i.id)}" type="text" placeholder="Cerca e collega un ordine cliente"
                               oninput="_kitOrderSearch('${r(i.id)}', this.value)"
                               onfocus="_kitOrderSearch('${r(i.id)}', this.value)"
                               onblur="_kitOrderHideSearch('${r(i.id)}')">
                        <div id="kit-order-autocomplete-${r(i.id)}" class="ordine-autocomplete-list"></div>
                    </div>
                    <div class="kit-order-ref-list">${c}</div>
                    <div class="kit-order-meta-help">Il cliente viene derivato dagli ordini selezionati. Se gli ordini appartengono a clienti diversi, in stampa il riferimento resta vuoto.</div>
                </div>
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Dati stampa</div>
                    <div class="kit-order-meta-row"><span>Cliente</span><strong>${r(s.cliente||"")}</strong></div>
                    <div class="kit-order-meta-row"><span>Documento</span><strong>${r(s.documento||"")}</strong></div>
                </div>
            </div>
            <div class="kit-order-summary-badges">${d}</div>
        </div>

        <div class="kit-order-layout">
            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-hand-pointer"></i> Componi ordine</div>
                <div class="kit-cfg-help">Scegli i pulsanti dell'elettronica, inserisci la quantit\xE0 e aggiungi quella configurazione all'ordine.</div>
                <div class="kit-compose-builder">
                    ${u}
                    <div class="kit-compose-footer">
                        <div class="kit-compose-selected">
                            <div class="kit-compose-selected-label">Configurazione pronta</div>
                            <div class="kit-compose-selected-name">${m?r(m.nome):"Completa prima tutte le scelte"}</div>
                        </div>
                        <div class="kit-order-stepper">
                            <input class="kit-order-stepper-input" id="kit-compose-qty-${r(i.id)}" type="number" min="1" value="1">
                            <button type="button" class="kit-spedisci-btn" onclick="_kitComposeAdd('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
                        </div>
                    </div>
                </div>
                <div class="kit-order-lines">${p}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${a.totaleRighe} righe materiali \xB7 ${a.avvisi.length} avvisi</div>
                ${g}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${h}
            </section>
        </div>
    </div>`,zt(n),Yt().catch(()=>{})}function Qe(){T=null,yt()}function Ue(t){$i=t,K()}function Fe(t){J(t,function(i,n){for(let e of E(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Je(t,i,n){try{window._kitSuppressNextFade=!0}catch{}J(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function Ge(t,i,n){try{window._kitSuppressNextFade=!0}catch{}J(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function We(t){J(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=it({})})}function Ye(t,i){J(t,function(n){n[i]=0})}function Nt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${r(e.ordine)}</span>
            <span class="ac-cliente">${r(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function Ze(t,i){let n=String(i||"").trim().toLowerCase();if(!n){Nt(t,[]);return}Yt().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);Nt(t,o)})}function Xe(t){setTimeout(function(){Nt(t,[])},140)}function tn(t,i,n){let e=ot(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}J(t,function(s){let a=U(s);a.ordiniCliente=[...new Set(a.ordiniCliente.concat(e))],a.cliente=Bt(a.ordiniCliente,{[e]:n}),It(s,a)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),Nt(t,[])}function en(t,i){let n=ot(i);try{window._kitSuppressNextFade=!0}catch{}J(t,function(e){let o=U(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=Bt(o.ordiniCliente),It(e,o)})}function nn(t,i,n){let{kits:e}=b(),o=e.find(a=>a.id===t);if(!o)return;let s=Zt(o);if(s[i]=n,_t[t]=s,T===t){try{window._kitSuppressNextFade=!0}catch{}K()}}function on(t){let{kits:i}=b(),n=i.find(a=>a.id===t);if(!n)return;let e=vi(n,Zt(n));if(!e){y("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){y("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(Kt[t])return;Kt[t]=Date.now(),setTimeout(function(){try{delete Kt[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}J(t,function(a){a[e.key]=rt(a,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function Si(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=b(),s=o.find(z=>z.id===T);if(!s)return;let a=(s.sezioni||[]).find(z=>z.id===n),d=a&&(a.componenti||[]).find(z=>z.id===i);if(!d||!Jt(d))return;d.caricato=e,A(o);let l=Be(s)[i]||0,m=Math.max(0,l-e),p=De(s)[i]||0,g=t.closest("tr");if(!g)return;let h=g.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");h&&(h.textContent=l===0?"\u2014":m,h.className=l===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let f=g.querySelector(".kit-car-liberi");f&&(p>0?(f.textContent=Math.max(0,e-p)+" lib.",f.style.display=""):f.style.display="none")}function sn(t,i,n){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),A(e),T===t&&K())}function an(t,i,n){let{kits:e}=b(),o=e.find(a=>a.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),A(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function rn(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${r(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${r(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let a=(e.righe||[]).reduce((l,m)=>l+m.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${r(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${r(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${a} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${r(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${c}<div class="kit-sped-bom-divider">componenti scaricati</div>${d}</div>
            </details>`}if(e.tipo==="reso"){let a=e.totPz||0,d=(e.items||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${r(m.nome)}</span><span class="kit-mov-qty carico">\xD7${m.qty}</span></div>`).join(""),c=(e.righe||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${r(m.mat)}</span><span class="kit-mov-qty carico">+${m.qty}</span></div>`).join(""),l=(e.scartate||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${r(m.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${m.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\u{1F4E6} Rientro \xD7${a} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${r(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">
                ${d}
                ${c?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${c}`:""}
                ${l?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${l}`:""}
              </div>
            </details>`}return`<div class="kit-mov-item ${r(e.tipo)}">
            <span class="kit-mov-badge ${r(e.tipo)}">${e.tipo==="carico"?"CARICO":"SCARICO"}</span>
            <span class="kit-mov-mat">${r(e.mat)}</span>
            <span class="kit-mov-qty ${r(e.tipo)}">${e.tipo==="carico"?"+":"\u2212"}${e.qty}</span>
            ${e.nota?`<span class="kit-mov-nota">${r(e.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${e.ts}</span>
            ${s}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function cn(t,i){let{kits:n}=b(),e=n.find(f=>f.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),a=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),m=(a?.value||"").trim(),u=(e.sezioni||[]).find(f=>f.id===c),p=u&&(u.componenti||[]).find(f=>f.id===d);if(!p||!Jt(p))return;i==="carico"?p.caricato=(parseInt(p.caricato)||0)+l:p.caricato=Math.max(0,(parseInt(p.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:m,mat:p.nome,ts:ii()}),A(n),s&&(s.value=1),a&&(a.value="");let g=document.getElementById("kit-mov-list-"+t);g&&(g.innerHTML=rn(e,ti()));let h=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);h&&(h.value=p.caricato,Si(h))}function dn(t,i){if(!ti())return;let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&ln(t,i,o)}function ln(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${r(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${r(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let a=document.getElementById("btn-kit-del-ok");a&&(a.onclick=()=>Ii(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function xi(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ii(t,i){xi();let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(a=>a.id===o.sid);for(let a of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===a.cid||l.nome===a.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+a.qty)}for(let a of o.items||[])a.saId&&e.pronti&&(e.pronti[a.saId]=(parseInt(e.pronti[a.saId])||0)+a.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let a of e.sezioni||[]){let d=(a.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(d=>d.id===o.cid);a&&(a.caricato=Math.max(0,(parseInt(a.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(d=>d.id===o.cid);a&&(a.caricato=(parseInt(a.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),A(n),T===t&&K(),y("Movimento eliminato \u2713")}}function pn(t,i){if(!ti())return;let{kits:n}=b(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let a=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");a&&(a.innerHTML=`<span class="kit-mov-badge ${r(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${r(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function Ai(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function mn(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);Ai();let{kits:e}=b(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let a=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){y("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==a.qty){let l=d-a.qty;for(let m of o.sezioni||[]){let u=(m.componenti||[]).find(p=>p.id===a.cid);if(u){a.tipo==="carico"?u.caricato=Math.max(0,(parseInt(u.caricato)||0)+l):u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l);break}}}o.movimenti[s]={...a,qty:d,nota:c},A(e),T===i&&K(),y("Movimento aggiornato \u2713")}function un(t){let{kits:i}=b(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){y("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,m=bi(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${r(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${r(c.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let a=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&a&&(d.value=a.value||""),d&&!a&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function Mi(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function fn(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;Mi();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=b(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),a=[],d=[];for(let l of n){let m=(o.sottoAssembly||[]).find(p=>p.id===l);if(!m)continue;let u=Number.parseInt(o.pronti?.[l],10)||0;if(u){a.push({saId:l,nome:m.nome,qty:u});for(let p of o.sezioni||[])for(let g of p.componenti||[]){if(j(g))continue;let h=H(g,m.varianteKey);if(!h)continue;let f=u*h;g.caricato=Math.max(0,(parseInt(g.caricato)||0)-f);let z=d.find($=>$.cid===g.id);z?z.qty+=f:d.push({cid:g.id,mat:g.nome,qty:f})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:a,righe:d,nota:s,ts:ii()}),A(e);let c=a.reduce((l,m)=>l+m.qty,0);y(`Spedizione registrata: ${c} pz \u2713`),T===i&&K()}function gn(t){let{kits:i}=b(),n=i.find(a=>a.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let a=n.sottoAssembly||[];o.innerHTML=a.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':a.map(d=>{let c=bi(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${r(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${r(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${r(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),si(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Ni(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function kn(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&si(e.dataset.kitId)}function si(t){let{kits:i}=b(),n=i.find(a=>a.id===t);if(!n)return;let e={};for(let a of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+a.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let m of l.componenti||[]){if(j(m))continue;let u=H(m,a.varianteKey);u&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+c*u})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,a])=>a.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([a,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${r(a)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${r(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function vn(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=b(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;m>0&&o.push({saId:l.id,nome:l.nome,qty:m})}if(!o.length){y("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],a=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let m=l.dataset.cid,u=Number.parseInt(l.dataset.qty,10),p=[...e.sezioni||[]].flatMap(g=>g.componenti||[]).find(g=>g.id===m)?.nome||"?";l.checked?s.push({cid:m,mat:p,qty:u}):a.push({cid:m,mat:p,qty:u})});for(let l of s)for(let m of e.sezioni||[]){let u=(m.componenti||[]).find(p=>p.id===l.cid);if(u){u.caricato=(parseInt(u.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,m)=>l+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:a,nota:d,ts:ii(),totPz:c}),A(n),Ni(),y(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),T===i&&K()}function yn(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");!i||!n||(i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026",lt({azione:"setKitData",payload:Ot()}).then(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)}))}function Ei(t){F=t;let i=document.getElementById("modal-kit-config");i&&(Q(),i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function bn(){let t=document.getElementById("modal-kit-config");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300),F=null)}function hn(t){if(!F)return;let i=(t?.value||"").trim();i&&(S(F,n=>{n.nome=i},!1),B("kits"))}function Q(){if(!F)return;let{kits:t}=b(),i=t.find(f=>f.id===F);if(!i)return;let n=Y(),e=["pz","mt","cm","mm","kg","g","lt","ml"],o=document.getElementById("kit-cfg-modal-nome");o&&(o.value=i.nome||"");let s=[...new Set(n.map(f=>(f.categoria||"").trim()).filter(Boolean))].sort(),a=["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ef4444","#14b8a6","#f97316","#84cc16"],d=f=>a[s.indexOf(f)%a.length]||"#94a3b8",l=(i.sezioni||[]).flatMap(f=>(f.componenti||[]).map(z=>({comp:z,sez:f})));function m(f){return n.find(z=>z.nome===f.nome&&(!f.codice||!z.codice||z.codice===f.codice))||n.find(z=>z.nome===f.nome)}let u;l.length===0?u=`<div class="kcfg-empty">
            <i class="fas fa-inbox" style="font-size:1.3rem;display:block;margin-bottom:6px;opacity:.35"></i>
            Nessun componente ancora. Aggiungili dal catalogo qui sotto.
        </div>`:u='<div class="kcfg-list">'+l.map(({comp:f,sez:z})=>{let $=m(f),L=$?($.categoria||"").trim():"",R=L?d(L):"#e2e8f0",N=St(f.unitaMisura,"pz"),ht=e.map(tt=>`<option value="${tt}"${N===tt?" selected":""}>${tt}</option>`).join("");return`<div class="kcfg-comp-row">
                    <span class="kcfg-dot" style="background:${R}"></span>
                    <span class="kcfg-name">${r(f.nome)}${f.codice?`<span class="kcfg-code">&middot;&thinsp;${r(f.codice)}</span>`:""}</span>
                    <input type="number" min="0" step="any" class="input-field-modern kcfg-qty"
                        value="${f.qtaBase??1}" title="Quantit&#224;"
                        onchange="_kitCfgModalUpdateComp('${r(i.id)}','${r(z.id)}','${r(f.id)}','qtaBase',this.value)">
                    <select class="input-field-modern kcfg-unit"
                        onchange="_kitCfgModalUpdateComp('${r(i.id)}','${r(z.id)}','${r(f.id)}','unitaMisura',this.value)">
                        ${ht}
                    </select>
                    <button type="button" class="btn-trash-modern" style="width:28px;height:28px;flex-shrink:0"
                        onclick="_kitCfgModalDelComp('${r(i.id)}','${r(z.id)}','${r(f.id)}')">
                        <i class="fas fa-times" style="font-size:.75rem"></i>
                    </button>
                </div>`}).join("")+"</div>";let p=new Set(l.map(({comp:f})=>f.nome)),g="";n.length===0?g=`<div class="kcfg-empty" style="background:#fef3c7;border-color:#fde68a;color:#92400e;text-align:left">
            <i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>
            Catalogo vuoto. Vai nella tab <strong>Anagrafiche</strong> per aggiungere componenti.
        </div>`:g=s.map(z=>{let $=n.filter(N=>(N.categoria||"").trim()===z&&!p.has(N.nome));if($.length===0)return"";let L=d(z),R=$.map(N=>`<button type="button" class="kcfg-pill"
                    onclick="_kitCfgModalAddAnag('${r(i.id)}','${r(N.id)}')"
                    title="Aggiungi ${r(N.nome)}">
                    <i class="fas fa-plus" style="font-size:.58rem;opacity:.6;margin-right:3px"></i>${r(N.nome)}${N.codice?`<span class="kcfg-pill-code">${r(N.codice)}</span>`:""}
                </button>`).join("");return`<div class="kcfg-cat-strip">
                <span class="kcfg-cat-badge" style="--kcfg-dot:${L}">${r(z)}</span>
                <div class="kcfg-pills">${R}</div>
            </div>`}).filter(Boolean).join("")||`<p style="color:#94a3b8;font-size:.82rem;margin:4px 0;padding:6px 2px">
                   <i class="fas fa-check-circle" style="color:#10b981;margin-right:5px"></i>
                   Tutti i componenti del catalogo sono gi&#224; nel kit.
               </p>`;let h=document.getElementById("kit-cfg-modal-bom-panel");h&&(h.innerHTML=`
        <div class="kcfg-section-lbl">Nel kit (${l.length})</div>
        ${u}
        ${n.length>0?`
        <div class="kcfg-section-lbl" style="margin-top:18px">Aggiungi dal catalogo</div>
        <div style="padding:2px 0">${g}</div>`:g}
        <div style="margin-top:14px;padding-top:10px;border-top:1px solid #f1f5f9">
            <button type="button" class="btn-add-dashed" style="font-size:.79rem;padding:8px 14px;border-radius:10px"
                onclick="_kitCfgModalAddCompFree()">
                <i class="fas fa-pen" style="margin-right:6px;opacity:.55"></i>Aggiungi componente manuale
            </button>
        </div>`)}function zn(t,i,n,e){S(t,o=>{let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s[n]=e.trim()||s[n])},!0)}function wn(t,i){confirm("Eliminare questa sezione e tutti i componenti?")&&S(t,n=>{n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)},!0)}function _n(t,i){let e=Y().find(s=>s.id===i);if(!e)return;let o=(e.categoria||"").trim()||"Generali";S(t,s=>{let a=(s.sezioni||[]).find(d=>d.nome.trim()===o);a||(a={id:_(),nome:o,componenti:[]},s.sezioni=s.sezioni||[],s.sezioni.push(a)),a.componenti=a.componenti||[],a.componenti.push({id:_(),nome:e.nome,codice:e.codice||"",qtaBase:1,unitaMisura:e.unitaMisura||"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function Cn(){F&&S(F,t=>{let i=(t.sezioni||[]).find(n=>n.nome==="Liberi");i||(i={id:_(),nome:"Liberi",componenti:[]},t.sezioni=t.sezioni||[],t.sezioni.push(i)),i.componenti=i.componenti||[],i.componenti.push({id:_(),nome:"Nuovo componente",codice:"",qtaBase:1,unitaMisura:"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function $n(t,i,n,e,o){S(t,s=>{let a=(s.sezioni||[]).find(c=>c.id===i),d=a&&(a.componenti||[]).find(c=>c.id===n);d&&(e==="qtaBase"?(d.qtaBase=parseFloat(o)||1,d.regola&&(d.regola.qtyBase=d.qtaBase)):d[e]=o)},!0)}function Sn(t,i,n,e,o){S(t,s=>{let a=(s.sezioni||[]).find(c=>c.id===i),d=a&&(a.componenti||[]).find(c=>c.id===n);d&&(d.regola=d.regola||{},e==="tipo"?(d.regola.tipo=o,o==="gruppo"&&!d.regola.asseId&&s.assiConfigurazione?.length&&(d.regola.asseId=s.assiConfigurazione[0].id),o==="gruppo"&&(d.regola.opzioneIds=d.regola.opzioneIds||[])):e==="asseId"?(d.regola.asseId=o,d.regola.opzioneIds=[]):d.regola[e]=o)},!0)}function xn(t,i,n){S(t,e=>{let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))},!0)}function In(t){S(t,i=>{i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:_(),nome:"Nuovo gruppo",key:W("","ax"+i.assiConfigurazione.length),opzioni:[]})},!0)}function An(t,i){confirm("Eliminare questo gruppo elettronico?")&&S(t,n=>{n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)},!0)}function Mn(t,i,n,e){S(t,o=>{let s=(o.assiConfigurazione||[]).find(a=>a.id===i);s&&(s[n]=e)},!1)}function Nn(t,i){S(t,n=>{let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;e.opzioni=e.opzioni||[];let o=e.opzioni.length+1;e.opzioni.push({id:_(),key:W("","opz"+o),nome:"Nuova opzione",codice:""})},!0)}function On(t,i,n){S(t,e=>{let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))},!0)}function qn(t,i,n,e,o){S(t,s=>{let a=(s.assiConfigurazione||[]).find(c=>c.id===i),d=a&&(a.opzioni||[]).find(c=>c.id===n);d&&(d[e]=o)},!1)}function Bi(){let t=document.getElementById("modal-kit-crea");if(!t)return;let i=document.getElementById("kit-crea-nome");i&&(i.value=""),t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>i&&i.focus(),80)}function Di(){let t=document.getElementById("modal-kit-crea");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function En(){let t=(document.getElementById("kit-crea-nome")?.value||"").trim();if(!t){y("Inserisci un nome per il kit","warning");return}let{kits:i}=b(),n={id:_(),nome:t,schemaVersion:Vt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};i.push(n),A(i),Di(),setTimeout(()=>B("kits"),320)}function Bn(t){ft.kitId=t;let i=document.getElementById("modal-kit-qadd-sez");if(!i)return;let n=document.getElementById("kit-qadd-sez-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function Ti(){let t=document.getElementById("modal-kit-qadd-sez");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Dn(){let t=(document.getElementById("kit-qadd-sez-nome")?.value||"").trim()||"Nuova sezione",{kits:i}=b(),n=i.find(e=>e.id===ft.kitId);n&&(n.sezioni=n.sezioni||[],n.sezioni.push({id:_(),nome:t,componenti:[]}),A(i),Ti(),setTimeout(F?()=>Q():()=>B("kits"),320))}function Tn(t,i){ft.kitId=t,ft.sezId=i;let n=document.getElementById("modal-kit-qadd-comp");if(!n)return;let e=Y(),o=document.getElementById("kit-qadd-comp-source-cat"),s=document.getElementById("kit-qadd-comp-source-free");e.length?(o&&(o.checked=!0),Ht("cat")):(s&&(s.checked=!0),Ht("free"));let a=[...new Set(e.map(p=>p.categoria||"Senza categoria"))].sort(),d=document.getElementById("kit-qadd-comp-cat");d&&(d.innerHTML=a.map(p=>`<option value="${r(p)}">${r(p)}</option>`).join(""),Li());let c=document.getElementById("kit-qadd-comp-qty");c&&(c.value="1");let l=document.getElementById("kit-qadd-comp-unit");l&&(l.value="pz");let m=document.getElementById("kit-qadd-comp-nome");m&&(m.value="");let u=document.getElementById("kit-qadd-comp-codice");u&&(u.value=""),n.style.display="flex",n.offsetHeight,n.classList.add("active")}function Ht(t){let i=document.getElementById("kit-qadd-comp-cat-section"),n=document.getElementById("kit-qadd-comp-free-section");i&&(i.style.display=t==="cat"?"":"none"),n&&(n.style.display=t==="free"?"":"none")}function Li(){let t=document.getElementById("kit-qadd-comp-cat"),i=document.getElementById("kit-qadd-comp-comp");if(!t||!i)return;let n=t.value,o=Y().filter(s=>(s.categoria||"Senza categoria")===n);i.innerHTML=o.length?o.map(s=>`<option value="${r(s.id)}">${r(s.nome)}${s.codice?" \xB7 "+r(s.codice):""}</option>`).join(""):'<option value="">Nessun componente in questa categoria</option>'}function Pi(){let t=document.getElementById("modal-kit-qadd-comp");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ln(){let t=document.getElementById("kit-qadd-comp-source-cat")?.checked,i="",n="";if(t){let l=document.getElementById("kit-qadd-comp-comp")?.value;if(!l){y("Seleziona un componente dal catalogo","warning");return}let m=Y().find(u=>u.id===l);if(!m){y("Componente non trovato nel catalogo","warning");return}i=m.nome,n=m.codice||""}else{if(i=(document.getElementById("kit-qadd-comp-nome")?.value||"").trim(),!i){y("Inserisci il nome del componente","warning");return}n=(document.getElementById("kit-qadd-comp-codice")?.value||"").trim()}let e=parseFloat(document.getElementById("kit-qadd-comp-qty")?.value)||1,o=document.getElementById("kit-qadd-comp-unit")?.value||"pz",{kits:s}=b(),a=s.find(c=>c.id===ft.kitId);if(!a)return;let d=(a.sezioni||[]).find(c=>c.id===ft.sezId);d&&(d.componenti=d.componenti||[],d.componenti.push({id:_(),nome:i,codice:n,qtaBase:e,qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:o,applicazioneTipo:"sempre"}),A(s),Pi(),setTimeout(F?()=>Q():()=>B("kits"),320))}function Pn(t,i,n,e,o){let{kits:s}=b(),a=s.find(l=>l.id===t);if(!a)return;let d=(a.sezioni||[]).find(l=>l.id===i);if(!d)return;let c=(d.componenti||[]).find(l=>l.id===n);c&&(e==="qtaBase"?c.qtaBase=parseFloat(o)||0:c[e]=o,A(s))}function Kn(t,i,n){if(!n.trim())return;let{kits:e}=b(),o=e.find(a=>a.id===t);if(!o)return;let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s.nome=n.trim(),A(e))}function Rn(t,i,n){let{kits:e}=b(),o=e.find(a=>a.id===t);if(!o)return;let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s.componenti=(s.componenti||[]).filter(a=>a.id!==n),A(e),B("kits"))}function Hn(t,i){if(!confirm("Rimuovere questa sezione e tutti i suoi componenti?"))return;let{kits:n}=b(),e=n.find(o=>o.id===t);e&&(e.sezioni=(e.sezioni||[]).filter(o=>o.id!==i),A(n),B("kits"))}function jn(t){if(!confirm("Eliminare questo kit? L'operazione non \xE8 reversibile."))return;let{kits:i}=b(),n=i.filter(e=>e.id!==t);A(n),B("kits")}function Vn(t){qi={sourceKitId:t};let i=document.getElementById("modal-kit-duplicate");if(!i)return;let n=document.getElementById("kit-duplicate-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function Ki(){let t=document.getElementById("modal-kit-duplicate");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Qn(){let{sourceKitId:t}=qi||{};if(!t){y("Errore: kit sorgente non trovato","error");return}let{kits:i}=b(),n=i.find(s=>s.id===t);if(!n){y("Kit sorgente non trovato","warning");return}let e=(document.getElementById("kit-duplicate-nome")?.value||"").trim();if(!e){y("Inserisci un nome per il kit duplicato","warning");return}let o=Un(n);o.nome=e,i.push(o),A(i),Ki(),y(`Kit "${e}" creato da duplicazione \u2713`),setTimeout(()=>B("kits"),320)}function Un(t){let i={},n=o=>(i[o]||(i[o]=_()),i[o]),e=JSON.parse(JSON.stringify(t));return e.id=_(),Array.isArray(e.sezioni)&&(e.sezioni=e.sezioni.map(o=>{let s=JSON.parse(JSON.stringify(o));return s.id=_(),Array.isArray(s.componenti)&&(s.componenti=s.componenti.map(a=>{let d=JSON.parse(JSON.stringify(a));return d.id=_(),d})),s})),Array.isArray(e.assiConfigurazione)&&(e.assiConfigurazione=e.assiConfigurazione.map(o=>{let s=JSON.parse(JSON.stringify(o));return s.id=_(),Array.isArray(s.opzioni)&&(s.opzioni=s.opzioni.map(a=>{let d=JSON.parse(JSON.stringify(a));return d.id=_(),d})),s})),Array.isArray(e.varianti)&&(e.varianti=e.varianti.map(o=>{let s=JSON.parse(JSON.stringify(o));return s.id=_(),s})),Array.isArray(e.sottoAssembly)&&(e.sottoAssembly=e.sottoAssembly.map(o=>{let s=JSON.parse(JSON.stringify(o));return s.id=_(),s})),e.qtaDaProdurre={},e.pronti={},e.movimenti=[],e}function Fn(){Bi()}function Ri(t){F=t,Ei(t)}function Lt(t,i,n=""){let{kits:e}=b(),o=e.find(c=>c.id===t),s=e.find(c=>c.id!==t&&(c.sezioni||[]).length),a=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?a:s?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function Hi(t){C=Lt(t,"import"),Z(!0)}function Jn(t){C=Lt(t,"import-asse"),Z(!0)}function Gn(t,i){C=Lt(t,"copy",i),Z(!0)}function pt(){let t=document.getElementById("modal-kit-import");C=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Wn(t){if(!C||t!=="import"&&t!=="copy"||C.mode===t)return;let i=C.currentKitId,n=t==="copy"?C.sectionId:"";C=Lt(i,t,n),Z()}function Yn(t){C&&(C.search=String(t||""),Z())}function Zn(t){if(!C)return;let{kits:i}=b(),n=i.find(e=>e.id===t);C.sourceKitId=t,C.mode==="import-asse"?C.asseId=n?.assiConfigurazione?.[0]?.id||"":C.sectionId=n?.sezioni?.[0]?.id||"",Z()}function Xn(t){C&&(C.mode==="import-asse"?C.asseId=t:C.sectionId=t,Z())}function to(t,i){if(!C||C.mode!=="copy")return;let n=new Set(C.targetKitIds||[]);i?n.add(t):n.delete(t),C.targetKitIds=[...n],Z()}function io(){if(!C||C.mode!=="copy")return;let{kits:t}=b(),i=t.filter(e=>e.id!==C.currentKitId&&Mt(e.nome,C.search)),n=new Set(C.targetKitIds||[]);for(let e of i)n.add(e.id);C.targetKitIds=[...n],Z()}function eo(){!C||C.mode!=="copy"||(C.targetKitIds=[],Z())}function Z(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!C)return;let{kits:n}=b(),e=C,o=n.find(k=>k.id===e.currentKitId);if(!o){pt();return}let s=[];e.mode==="import"?s=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length):e.mode==="import-asse"?s=n.filter(k=>k.id!==o.id&&(k.assiConfigurazione||[]).length):s=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!s.some(k=>k.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(k=>k!==o.id&&n.some(w=>w.id===k)));let a=n.find(k=>k.id===e.sourceKitId)||null,d=e.mode==="import-asse"?a?.assiConfigurazione||[]:a?.sezioni||[];e.mode==="import-asse"?d.some(k=>k.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(k=>k.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(a?.assiConfigurazione||[]).find(k=>k.id===e.asseId)||null:Ut(a,e.sectionId),l=s.filter(k=>Mt(k.nome,e.search)),m=n.filter(k=>k.id!==o.id&&Mt(k.nome,e.search)),u=document.getElementById("kit-import-subtitle"),p=document.getElementById("kit-import-search"),g=document.getElementById("kit-import-left-title"),h=document.getElementById("kit-import-right-title"),f=document.getElementById("kit-import-kit-list"),z=document.getElementById("kit-import-section-list"),$=document.getElementById("kit-import-target-wrap"),L=document.getElementById("kit-import-target-list"),R=document.getElementById("kit-import-preview"),N=document.getElementById("kit-import-confirm-btn"),ht=document.getElementById("kit-import-mode-import"),tt=document.getElementById("kit-import-mode-copy");if(!u||!p||!g||!h||!f||!z||!$||!L||!R||!N||!ht||!tt)return;ht.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),tt.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),p.value=e.search,e.mode==="import"?(u.textContent=`Importa una sezione esistente dentro "${o.nome}".`,p.placeholder="Cerca kit sorgente\u2026",g.textContent="Kit sorgente",h.textContent=a?`Sezioni di ${a.nome}`:"Sezione",$.style.display="none",f.innerHTML=l.length?l.map(k=>{let w=k.id===e.sourceKitId;return`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${w?"checked":""}
                           onchange="_kitCfgSelectImportSource('${r(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(u.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,p.placeholder="Cerca kit destinazione\u2026",g.textContent="Kit sorgente",h.textContent="Sezione da copiare",$.style.display="flex",f.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${r(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,L.innerHTML=m.length?m.map(k=>{let w=(e.targetKitIds||[]).includes(k.id),M=c?Ct(o,k):null,D=`${(k.sezioni||[]).length} sezioni`;return M&&(M.hasTargetVarianti?M.needsReview?D=`${M.exactMatches}/${M.targetCount} combinazioni allineate`:D=`${M.targetCount}/${M.targetCount} combinazioni allineate`:D="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="checkbox" ${w?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${r(k.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(k.nome)}</span>
                        <span class="kit-import-option-meta">${r(D)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),z.innerHTML=d.length?d.map(k=>{let w=e.mode==="import-asse"?k.id===e.asseId:k.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${w?"checked":""}
                           onchange="_kitCfgSelectImportSection('${r(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${w?"checked":""}
                       onchange="_kitCfgSelectImportSection('${r(k.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(k.nome)}</span>
                    <span class="kit-import-option-meta">${(k.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let dt=!1,v="kit-cfg-help kit-import-preview",I="";if(e.mode==="import"){if(!a)I="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)I="Seleziona una sezione da importare nel kit corrente.";else{let k=Ct(a,o);dt=!0,I=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 importata in <strong>${r(o.nome)}</strong>. `,k.hasTargetVarianti?k.needsReview?(v="kit-cfg-warn kit-import-preview",I+=`${k.exactMatches} combinazioni su ${k.targetCount} risultano allineate: controlla i coefficienti importati.`):I+=`Tutte le ${k.targetCount} combinazioni del kit destinazione risultano allineate.`:(v="kit-cfg-warn kit-import-preview",I+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}N.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")a?c?(dt=!0,I=`L'asse <strong>${r(c.nome)}</strong> verr\xE0 importato in <strong>${r(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):I="Seleziona un asse da importare nel kit corrente.":I="Seleziona un kit sorgente per vedere gli assi disponibili.",N.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let k=n.filter(w=>(e.targetKitIds||[]).includes(w.id));if(!c)I="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!k.length)I="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{dt=!0;let w=k.filter(M=>Ct(o,M).needsReview).length;I=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 copiata in <strong>${k.length}</strong> kit.`,w>0?(v="kit-cfg-warn kit-import-preview",I+=` <strong>${w}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):I+=" Le combinazioni risultano allineate su tutti i kit selezionati."}N.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}R.className=v,R.innerHTML=I,N.disabled=!dt,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let k=document.getElementById("kit-import-search");k&&k.focus()},40))}function no(){if(!C)return;let{kits:t}=b(),i=C,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Ut(e,i.sectionId),s=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!s){y("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(u=>String(u.nome||"").trim().toLowerCase()===String(s.nome||"").trim().toLowerCase()),m=0;if(l){l.opzioni=l.opzioni||[];for(let u of s.opzioni||[]){let p=String(u.codice||"").trim().toLowerCase(),g=!1;if(p&&(g=l.opzioni.some(h=>String(h.codice||"").trim().toLowerCase()===p&&p!=="")),g||(g=l.opzioni.some(h=>String(h.nome||"").trim().toLowerCase()===String(u.nome||"").trim().toLowerCase())),!g){let h=(l.opzioni||[]).length+1;l.opzioni.push({id:_(),key:W(u?.key,"opz"+h),nome:String(u?.nome||"").trim()||"opz"+h,codice:String(u?.codice||"").trim()}),m+=1}}A(t),pt(),Q(),m?y(`${m} opzione${m>1?"i":""} aggiunta${m>1?"e":""} all'asse "${s.nome}" \u2713`):y(`Nessuna nuova opzione trovata per l'asse "${s.nome}"`);return}n.assiConfigurazione.push(fi(s,e,n)),A(t),pt(),Q(),y(`Asse "${s.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=Ct(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(At(o,e,n)),A(t),pt(),Q();let m="";l.hasTargetVarianti?l.needsReview&&(m=" Controlla le quantit\xE0 sulle combinazioni non allineate."):m=" Definisci poi gli assi del kit per rifinire i coefficienti.",y(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${m}`);return}let a=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!a.length){y("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let d=0;for(let l of a)Ct(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(At(o,e,l));A(t),pt(),Q();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xE0.`),y(`Sezione "${o.nome}" copiata in ${a.length} kit \u2713${c}`)}function oo(t){let{kits:i}=b(),n=i.find(e=>e.id===t)||null;O={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},bt(!0)}function ji(){let t=document.getElementById("modal-kit-presets");O=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function so(t){O&&(O.search=String(t||""),bt())}function ao(t){O&&(O.selectedPresetId=t,bt())}function ro(){if(!O)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){y("Inserisci il nome del preset \u26A0\uFE0F");return}let e=i?.value||"";Vi(O.currentKitId,e,n)}function Vi(t,i,n){let{kits:e}=b(),o=e.find(d=>d.id===t);if(!o){y("Kit non trovato \u26A0\uFE0F");return}let s=Ut(o,i);if(!s){y("Seleziona una sezione valida \u26A0\uFE0F");return}let a=kt();a.push({id:_(),nome:String(n||"").trim(),sourceKitId:o.id,sezione:JSON.parse(JSON.stringify(s))}),Wt(a),y("Preset salvato \u2713"),O&&O.currentKitId===t&&bt(),Q()}function co(t){if(!O)return;let i=kt(),n=t||O.selectedPresetId,e=i.find(d=>d.id===n);if(!e){y("Seleziona un preset \u26A0\uFE0F");return}let{kits:o}=b(),s=o.find(d=>d.id===O.currentKitId),a=o.find(d=>d.id===e.sourceKitId)||null;if(!s){y("Kit non trovato \u26A0\uFE0F");return}s.sezioni=s.sezioni||[],s.sezioni.push(At(e.sezione,a,s)),A(o),ji(),Q(),y(`Preset "${e.nome}" applicato \u2713`)}function lo(t,i){let n=kt(),e=n.find(o=>o.id===t);if(!e){y("Preset non trovato \u26A0\uFE0F");return}e.nome=String(i||"").trim()||e.nome,Wt(n),y("Nome aggiornato \u2713"),bt()}function po(t){let i=kt().filter(n=>n.id!==t);Wt(i),O&&(O.selectedPresetId=""),bt(),y("Preset eliminato \u2713")}function bt(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!O)return;let n=kt(),e=O,o=b().kits.find(p=>p.id===e.currentKitId),s=n.filter(p=>Mt(p.nome,e.search)),a=document.getElementById("preset-list"),d=document.getElementById("preset-preview"),c=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),m=document.getElementById("preset-apply-btn");if(!a||!d||!c||!l||!m)return;a.innerHTML=s.length?s.map(p=>{let g=p.id===e.selectedPresetId;return`<label class="kit-import-option ${g?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${g?"checked":""} onchange="_kitSelectPreset('${r(p.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(p.nome)}</span>
                    <span class="kit-import-option-meta">${(p.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let u=n.find(p=>p.id===e.selectedPresetId)||null;if(u){let p=u.sourceKitId&&b().kits.find(g=>g.id===u.sourceKitId)?.nome||"";d.innerHTML=`<div style="padding:6px"><strong>${r(u.nome)}</strong><div style="color:#94a3b8">${r(p)}</div></div>`+(u.sezione?.componenti?.length?`<div>${u.sezione.componenti.map(g=>`<div class="kit-meta-pill">${r(g.nome)}${g.codice?" \xB7 "+r(g.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else d.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;m.disabled=!u,c.value="",l.innerHTML=(o?.sezioni||[]).map(p=>`<option value="${r(p.id)}">${r(p.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let p=document.getElementById("preset-search");p&&p.focus()},40))}function mo(){let{kits:t}=b(),i=t.find(v=>v.id===Oi);if(!i){yt();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=E(i);at==="sezioni"&&(at="bom"),at==="sa"&&(at="bom");let s=["info","varianti","anagrafiche","bom"],a={info:"Prodotto",varianti:"Elettronica selezionabile",anagrafiche:"Anagrafiche",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,I)=>v+(I.componenti||[]).length,0),m=c?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-bolt"></i>
                <div><strong>${d}</strong> grupp${d===1?"o":"i"} elettronici e <strong>${c}</strong> configurazioni pronte da usare</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div>
                    ${o.slice(0,8).map(v=>`<span class="kit-cfg-sa-var-badge">${r(v.nome)}</span>`).join(" ")}
                    ${o.length>8?`<span class="kit-cfg-sa-count">+${o.length-8} altre</span>`:""}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${l}</strong> parti prodotto da usare nella distinta base</div>
            </div>
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>',u=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${r(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${r(i.id)}',this.value)">
        </div>
        ${m}
        <div class="kit-cfg-danger">
            <button type="button" class="kit-cfg-add-btn" onclick="_kitDuplicaKit('${r(i.id)}')"><i class="fas fa-clone"></i> Duplica kit</button>
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${r(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,p=e.map((v,I)=>{let k=(v.opzioni||[]).map((w,M)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${r(w.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(w.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${r(w.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(w.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${r(i.id)}','${r(v.id)}','${r(w.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${I}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${r(v.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${r(i.id)}','${r(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${r(i.id)}','${r(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${k||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${r(i.id)}','${r(v.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),g=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xE0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(v=>`<span class="kit-cfg-sa-var-badge" title="${r(v.key)}">${r(v.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",h=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci solo l'<strong>elettronica selezionabile</strong> del prodotto.<br>
                Esempio: un gruppo <strong>LED</strong>, uno <strong>Lente</strong>, uno <strong>Alimentazione</strong>.<br>
                Tu inserisci i nomi, il sistema user\xE0 queste scelte per costruire l'ordine e la distinta base.
            </div>
            ${p||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportAsseModal('${r(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenPresetsModal('${r(i.id)}')"><i class="fas fa-bookmark"></i> Sezioni fisse</button>
            ${g}
        </div>`,f=(i.sezioni||[]).map((v,I)=>{let k=(v.componenti||[]).map(w=>{let M=j(w),D=Gt(w,i),ai=(e||[]).find(q=>q.id===D.asseId)||null,Ui=D.tipo==="gruppo"&&ai?`<div class="kit-cfg-row">${(ai.opzioni||[]).map(q=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${D.opzioneIds.includes(q.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${r(i.id)}','${r(v.id)}','${r(w.id)}','${r(q.id)}',this.checked)">
                        ${r(q.nome)}
                    </label>`).join("")}</div>`:"",Fi=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(w.id)}','asseId',this.value)">
                        ${e.map(q=>`<option value="${r(q.id)}" ${D.asseId===q.id?"selected":""}>${r(q.nome)}</option>`).join("")}
                   </select>`:"",Ji=D.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",ri=M?"flag":St(w.unitaMisura,"pz"),Gi=M?[{value:"flag",label:"Solo avviso"}]:[...new Set([ri,...ie])].filter(Boolean).map(q=>({value:q,label:q}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${r(w.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${r(w.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','modo','',this.value)">
                        <option value="quantificato" ${M?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${M?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${r(i.id)}','${r(v.id)}','${r(w.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${D.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(w.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','unitaMisura','',this.value)"
                            ${M?"disabled":""}>
                        ${Gi.map(q=>`<option value="${r(q.value)}" ${ri===q.value?"selected":""}>${r(q.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(w.id)}','tipo',this.value)">
                        <option value="sempre" ${D.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${D.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${D.tipo==="gruppo"?Fi:""}
                </div>
                ${D.tipo==="gruppo"?Ui:""}
                <input class="kit-cfg-input" value="${r(w.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${M?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Ji}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${I}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${r(v.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${r(i.id)}','${r(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${r(i.id)}','${r(v.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${r(i.id)}','${r(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${k}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${r(i.id)}','${r(v.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),z=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unit\xE0 corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${f}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${r(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,$="";o.length?$=o.map(v=>{let I=(i.sottoAssembly||[]).map((w,M)=>({sa:w,i:M})).filter(({sa:w})=>w.varianteKey===v.key),k=I.map(({sa:w,i:M})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${r(w.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${r(i.id)}',${M},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${r(i.id)}',${M})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${r(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${I.length} part${I.length!==1?"i":"e"}</span>
                </div>
                ${k||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${r(i.id)}','${r(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${r(v.nome)}</button>
            </div>`}).join(""):$='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let L=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${$}
        </div>`,R={info:u,varianti:h,bom:z,sa:L},N=kt(),tt=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${N.length?N.map(v=>`<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${r(v.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${r(v.sourceKitId&&b().kits.find(I=>I.id===v.sourceKitId)?.nome||"")}</div>
                </div>
                <div style="display:flex;gap:8px">
                    <button class="kit-cfg-add-btn" onclick="_kitApplyPreset('${r(v.id)}')">Applica</button>
                    <button class="kit-cfg-add-btn" onclick="(function(){const n=prompt('Nuovo nome preset', '${r(v.nome)}'); if(n) _kitRenamePreset('${r(v.id)}', n);})()">Rinomina</button>
                    <button class="kit-btn-danger" onclick="(function(){ if(confirm('Eliminare questo preset?')) _kitDeletePreset('${r(v.id)}') })()">Elimina</button>
                </div>
            </div>`).join(""):'<div class="kit-import-empty">Nessun preset salvato.</div>'}</div>
            <hr style="margin:12px 0">
            <div style="display:flex;gap:8px;align-items:center">
                <select id="preset-new-section-tab" class="kit-cfg-select" style="min-width:220px">
                    ${(i.sezioni||[]).map(v=>`<option value="${r(v.id)}">${r(v.nome)}</option>`).join("")}
                </select>
                <input id="preset-new-name-tab" class="kit-cfg-input" placeholder="Nome nuovo preset" style="flex:1">
                <button class="kit-cfg-add-btn" onclick="(function(){ const sec = document.getElementById('preset-new-section-tab')?.value || ''; const name = document.getElementById('preset-new-name-tab')?.value || ''; if(!name) { alert('Inserisci un nome'); return; } _kitCreatePreset('${r(i.id)}', sec, name); })()"><i class="fas fa-save"></i> Crea preset</button>
            </div>
        </div>`;R.anagrafiche=tt;let dt=s.map(v=>`<button class="kit-tab ${at===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${a[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${r(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${r(i.nome)}</span>
        </div>
        <div class="kit-tabs">${dt}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${R[at]}</div>
    </div>`,zt(n)}function uo(t){if(t&&T===t){K();return}T=t,K()}function fo(t){at=t,mo()}function S(t,i,n=!0){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(i(o),A(e),n&&Q())}function go(t,i){S(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function ko(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=b();A(i.filter(n=>n.id!==t)),Oi=null,T=null,yt()}function vo(t){let{kits:i}=b(),n=i.find(o=>o.id===t);if(!n)return;let e={id:_(),nome:`Copia di ${n.nome}`,schemaVersion:Vt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(fi(o,n,e));e.varianti=pi(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(At(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:_(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),A(i),Ri(e.id),y(`Kit "${n.nome}" duplicato \u2713`)}function Qi(t){S(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:_(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:_(),key:"opz1",nome:"Opzione 1"}]})})}function yo(t,i,n,e){S(t,function(o){let s=(o.assiConfigurazione||[]).find(a=>a.id===i);s&&(n==="key"?s.key=W(e,s.key||"asse"):s[n]=e.trim())})}function bo(t,i){S(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function ho(t,i){S(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:_(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function zo(t,i,n,e,o){S(t,function(s){let a=(s.assiConfigurazione||[]).find(c=>c.id===i),d=a&&(a.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=W(o,d.key||"opzione"):d[e]=o.trim())})}function wo(t,i,n){S(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function _o(t){Qi(t)}function Co(t){S(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:_(),nome:"Nuova sezione",componenti:[]})})}function $o(t){Hi(t)}function So(t,i,n,e){S(t,function(o){let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s[n]=e.trim())},!1)}function xo(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&S(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function Io(t,i){S(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:_(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function Ao(t,i,n,e,o,s){S(t,function(a){let d=(a.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=X(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":St(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function Mo(t,i,n,e,o){S(t,function(s){let a=(s.sezioni||[]).find(l=>l.id===i),d=a&&(a.componenti||[]).find(l=>l.id===n);if(!d)return;let c=Gt(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=X(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Qt(d,s,c)})}function No(t,i,n,e,o){S(t,function(s){let a=(s.sezioni||[]).find(m=>m.id===i),d=a&&(a.componenti||[]).find(m=>m.id===n);if(!d)return;let c=Gt(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Qt(d,s,c)})}function Oo(t,i,n,e){S(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),a=s&&(s.componenti||[]).find(d=>d.id===n);!a||j(a)||(a.tracciabile=!!e)},!1)}function qo(t,i,n){S(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function Eo(t){S(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:_(),nome:"",varianteKey:E(i)[0]?.key||""})})}function Bo(t,i){S(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:_(),nome:"",varianteKey:i,noteConfig:""})})}function Do(t,i,n,e){S(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function To(t,i){S(t,function(n){n.sottoAssembly.splice(i,1)})}function Lo(t){let i=document.getElementById("modal-kit-distinta-edit");if(!i){_i(t);return}let{kits:n}=b(),e=n.find(c=>c.id===t);if(!e)return;let o=et(e),s=U(o),a=document.getElementById("distinta-edit-nome"),d=document.getElementById("distinta-edit-documento");a&&(a.value=s.documento||""),d&&(d.value=s.documento||""),i.dataset.kitId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>a&&a.focus(),80)}function jt(){let t=document.getElementById("modal-kit-distinta-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Po(){let t=document.getElementById("modal-kit-distinta-edit");if(!t)return;let i=t.dataset.kitId,n=(document.getElementById("distinta-edit-nome")?.value||"").trim(),e=(document.getElementById("distinta-edit-documento")?.value||"").trim();if(!n){y("Inserisci un nome per la distinta.","warning");return}J(i,function(m){let u=U(m);e?u.documento=e:u.documento||(u.documento=n),It(m,u)});let{kits:o}=b(),s=o.find(m=>m.id===i);if(!s){jt(),y("Kit non trovato \u26A0\uFE0F");return}let a=et(s),d=Tt(s,a);if(!d.totalePezzi||!d.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}let c=nt(),l={id:_(),kitId:s.id,kitNome:s.nome,nome:n||a._meta?.documento||`Distinta-${Date.now()}`,documento:e||a._meta?.documento||"",createdAt:Date.now(),createdBy:V?.nome||"Sistema",orderDraftSnapshot:a,distintaSnapshot:d};c.unshift(l),xt(c),jt(),y("Distinta salvata \u2713"),P==="distinte"&&B("distinte")}function Fo(){window._kitOpenView=Ve,window._kitOpenConfig=Ri,window._kitNuovoKit=Fn,window._kitBack=Qe,window._kitOpenPrintPreview=Oe,window._kitSwitchTab=Ue,window._kitAggiornaQty=Fe,window._kitOrdineSet=Je,window._kitOrdineDelta=Ge,window._kitOrdineReset=We,window._kitOrdineResetVoce=Ye,window._kitOrderSearch=Ze,window._kitOrderHideSearch=Xe,window._kitOrderPick=tn,window._kitOrderRemoveRef=en,window._kitComposeSelect=nn,window._kitComposeAdd=on,window._kitAggiornaCar=Si,window._kitAggiornaPronti=sn,window._kitSetPronti=an,window._kitApriModalSped=un,window._kitChiudiModalSped=Mi,window._kitConfermaSpedizione=fn,window._kitApriModalReso=gn,window._kitChiudiModalReso=Ni,window._kitResoQtyChange=kn,window._kitResoAggiornaBOM=si,window._kitConfermaReso=vn,window._kitSalvaMovimento=cn,window._kitEliminaMovimento=dn,window._kitModificaMovimento=pn,window._kitChiudiModalEditMov=Ai,window._kitConfermaModificaMov=mn,window._kitChiudiModalDelMov=xi,window._kitConfermaEliminaMov=Ii,window._kitSalvaManuale=yn,window._kitElimina=ko,window._kitDuplicaKit=vo,window._kitCfgBack=uo,window._kitCfgSwitchTab=fo,window._kitCfgSaveNome=go,window._kitCfgAddVar=_o,window._kitCfgOpenImportModal=Hi,window._kitCfgOpenImportAsseModal=Jn,window._kitCfgOpenCopySezModal=Gn,window._kitCfgCloseImportModal=pt,window._kitCfgSetImportMode=Wn,window._kitCfgSetImportSearch=Yn,window._kitCfgSelectImportSource=Zn,window._kitCfgSelectImportSection=Xn,window._kitCfgToggleImportTarget=to,window._kitCfgSelectAllImportTargets=io,window._kitCfgClearImportTargets=eo,window._kitCfgConfirmImport=no,window._kitOpenPresetsModal=oo,window._kitClosePresetsModal=ji,window._kitSetPresetsSearch=so,window._kitSelectPreset=ao,window._kitCreatePresetFromSection=ro,window._kitCreatePreset=Vi,window._kitApplyPreset=co,window._kitRenamePreset=lo,window._kitDeletePreset=po,window._kitCfgAddAsse=Qi,window._kitCfgUpdateAsse=yo,window._kitCfgDelAsse=bo,window._kitCfgAddOpzione=ho,window._kitCfgUpdateOpzione=zo,window._kitCfgDelOpzione=wo,window._kitCfgAddSez=Co,window._kitCfgImportSez=$o,window._kitCfgUpdateSez=So,window._kitCfgDelSez=xo,window._kitCfgAddComp=Io,window._kitCfgUpdateComp=Ao,window._kitCfgUpdateCompRule=Mo,window._kitCfgToggleCompOption=No,window._kitCfgToggleCompTracked=Oo,window._kitCfgDelComp=qo,window._kitCfgAddSA=Eo,window._kitCfgAddSAForVariant=Bo,window._kitCfgUpdateSA=Do,window._kitCfgDelSA=To,window._kitSwitchMainTab=B,window._kitRenderKitsGrid=hi,window._kitRenderAnagrafichePage=zi,window._kitRenderDistintePage=wi,window._kitLoadDistinte=nt,window._kitSaveDistinte=xt,window._kitCreateDistintaFromDraft=_i,window._kitLoadAnagrafiche=Y,window._kitSaveAnagrafiche=oi,window._kitOpenAnagraficaModal=Le,window._kitCloseAnagraficaModal=Ci,window._kitConfirmSaveAnagrafica=Pe,window._kitDeleteAnagrafica=Ke,window._kitOpenCreaKit=Bi,window._kitCloseCreaKit=Di,window._kitConfirmCreaKit=En,window._kitOpenConfigModal=Ei,window._kitCloseConfigModal=bn,window._kitRenderConfigModal=Q,window._kitCfgModalSaveNome=hn,window._kitCfgModalAddAnag=_n,window._kitCfgModalAddCompFree=Cn,window._kitCfgModalUpdateSez=zn,window._kitCfgModalDelSez=wn,window._kitCfgModalUpdateComp=$n,window._kitCfgModalUpdateCompRule=Sn,window._kitCfgModalDelComp=xn,window._kitCfgModalAddAsse=In,window._kitCfgModalDelAsse=An,window._kitCfgModalUpdateAsse=Mn,window._kitCfgModalAddOpz=Nn,window._kitCfgModalDelOpz=On,window._kitCfgModalUpdateOpz=qn,window._kitQAddSezOpen=Bn,window._kitQAddSezClose=Ti,window._kitQAddSezConfirm=Dn,window._kitQAddCompOpen=Tn,window._kitQAddCompToggleSource=Ht,window._kitQAddCompChangeCategoria=Li,window._kitQAddCompClose=Pi,window._kitQAddCompConfirm=Ln,window._kitQUpdateComp=Pn,window._kitQRenomeSez=Kn,window._kitQDelComp=Rn,window._kitQDelSez=Hn,window._kitQDelKit=jn,window._kitOpenDuplicateModal=Vn,window._kitCloseDuplicateModal=Ki,window._kitConfirmDuplicate=Qn,window._kitRenderHeaderActions=ei,window._kitOpenSaveDistintaModal=Lo,window._kitCloseSaveDistintaModal=jt,window._kitConfirmSaveDistinta=Po,window._kitDistintaOpenPrint=Re,window._kitDistintaApplyToDraft=He,window._kitDistintaDelete=je,window._kitNSToggleComp=ve,window._kitNSSetUnits=ke,window._kitNSOrderSearch=ye,window._kitNSOrderHideSearch=be,window._kitNSOrderPick=he,window._kitNSOrderRemoveRef=ze,window._kitNSReset=_e,window._kitNSToggleSection=ki,window._kitNSToggleSectionChk=we,window._kitNSCreateDistinta=Ce,window._kitNSOpenPrintPreview=$e}var Vt,ie,x,Rt,st,wt,Kt,P,_t,mt,T,$i,Oi,at,C,O,ft,F,qi,Jo,Ko=Wi(()=>{Yi();Xi();te();Zi();Vt=2,ie=["pz","mt","cm","mm","kg","g","lt","ml"];x=$t({});Rt=!1,st=[],wt=null,Kt={},P="kits";_t={};mt=null;typeof window<"u"&&window.addEventListener("beforeunload",function(){qe()});T=null,$i="ordine";Oi=null,at="info",C=null,O=null,ft={kitId:null,sezId:null},F=null,qi={sourceKitId:null};Jo=yt});Ko();export{yt as caricaKitProdotti,Jo as default,Fo as registerGlobals,Uo as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-CVYJVYIS.js.map
