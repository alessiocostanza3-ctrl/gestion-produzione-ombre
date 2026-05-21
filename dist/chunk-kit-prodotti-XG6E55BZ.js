import{a as ee,c as Rt,e as ne,f as r,g as y,h as zt,l as oe,m as Q,q as ae,t as pt,w as se}from"./chunk-chunk-4BXF2AT3.js";function $t(t){let i=Array.isArray(t)?{kits:t}:t&&typeof t=="object"?t:{},n=i.orderDrafts,e=n&&typeof n=="object"&&!Array.isArray(n)?n:{};return{kits:Array.isArray(i.kits)?i.kits.map(Wt):[],anagrafiche:Array.isArray(i.anagrafiche)?i.anagrafiche:[],distinte:Array.isArray(i.distinte)?i.distinte:[],presets:Array.isArray(i.presets)?i.presets:[],orderDrafts:e,draftDocSeq:Math.max(0,Number.parseInt(i.draftDocSeq,10)||0),ts:Number(i.ts||0)||0}}function Et(){return{kits:x.kits,anagrafiche:x.anagrafiche,distinte:x.distinte,presets:x.presets,orderDrafts:x.orderDrafts,draftDocSeq:x.draftDocSeq}}function pi(t){let i=$t(t||{});return!!(i.kits&&i.kits.length||i.anagrafiche&&i.anagrafiche.length||i.distinte&&i.distinte.length||i.presets&&i.presets.length||i.orderDrafts&&Object.keys(i.orderDrafts).length||i.draftDocSeq>0)}function ce(){try{let t=localStorage.getItem("_mlKitData"),i=t?JSON.parse(t):{},n=Array.isArray(i)?i:Array.isArray(i?.kits)?i.kits:[],e=JSON.parse(localStorage.getItem("_mlKitAnagrafiche")||"[]"),o=JSON.parse(localStorage.getItem("_mlKitDistinte")||"[]"),a=JSON.parse(localStorage.getItem("_mlKitPresetSections")||"[]"),s=JSON.parse(localStorage.getItem("_mlKitOrderDrafts")||"{}"),d=Number.parseInt(localStorage.getItem("_mlKitOrderDraftSeq")||"0",10)||0;return{kits:Array.isArray(n)?n:[],anagrafiche:Array.isArray(e)?e:[],distinte:Array.isArray(o)?o:[],presets:Array.isArray(a)?a:[],orderDrafts:s&&typeof s=="object"&&!Array.isArray(s)?s:{},draftDocSeq:d}}catch{return $t({})}}function de(){["_mlKitData","_mlKitDataTs","_mlKitOrderDrafts","_mlKitOrderDraftSeq","_mlKitPresetSections","_mlKitDistinte","_mlKitDistinteTs","_mlKitAnagrafiche","_mlKitAnagraficheTs"].forEach(function(i){try{localStorage.removeItem(i)}catch{}})}function ea(){jt=!1}function X(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function it(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function V(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function xt(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function le(t,i){let n="opz"+(i+1),e=X(t?.key,n);return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function pe(t,i){let n="asse"+(i+1),e=X(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((a,s)=>le(a,s)).filter(Boolean):[];return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function ui(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function me(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function fi(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let a of n)for(let s of e.opzioni)o.push({selections:a.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:s.id,opzioneKey:s.key,opzioneNome:s.nome,opzioneCodice:String(s.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:ui(e.selections),nome:me(e.selections),selections:e.selections}})}function ue(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||_()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:xt(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:it(t?.qtaBase)}}function gi(t){return[...Array.isArray(t)?t:[]].sort((n,e)=>{let o=String(n?.nome||"").trim(),a=String(e?.nome||"").trim();return o.localeCompare(a,"it",{sensitivity:"base",numeric:!0})})}function fe(t){return{id:String(t?.id||_()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:gi(Array.isArray(t?.componenti)?t.componenti.map(ue):[])}}function ge(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function ki(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:it(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||it(Object.values(t?.qtaPerVariante||{})[0])};let e=E(i);if(!e.length)return n;let o=e.filter(c=>R(t,c.key)>0);if(!o.length)return n;let a=new Set(o.map(c=>R(t,c.key)));if(a.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>R(t,c.key)))};let s=[...a][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:s};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let u of c.opzioni||[]){let p=new Set(e.filter(w=>(w.selections||[]).some(g=>g.asseId===c.id&&g.opzioneId===u.id)).map(w=>w.key));if(!p.size)continue;[...p].every(w=>R(t,w)===s)&&l.push(u.id)}if(!l.length)continue;let m=new Set(e.filter(u=>(u.selections||[]).some(p=>p.asseId===c.id&&l.includes(p.opzioneId))).map(u=>u.key));if(ge(m,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:s}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:s}}function Jt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=it(n.qtyBase);if(!o)return e;for(let a of E(i)){let s=n.tipo==="sempre";n.tipo==="gruppo"&&(s=(a.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),s&&(e[a.key]=o)}return e}function ke(t,i){let n=fe(t);return n.componenti=n.componenti.map(function(e){let o=ki(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:Jt(e,i,o)}}),n}function ve(t,i){let n=E(i);if(!n.length)return null;let e=null;for(let o of n){let a=R(t,o.key);if(e===null){e=a;continue}if(e!==a)return null}return e}function ye(t,i,n){let e=E(n),o={},a=ve(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let s of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},s.key)?R(t,s.key):a!==null?a:0;c>0&&(o[s.key]=c)}return{id:_(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:Yt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:xt(t?.unitaMisura,H(t)?"flag":"pz")}}function Mt(t,i,n){return{id:_(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>ye(e,i,n)):[]}}function vi(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=X(t?.key||String(t?.nome||"asse"),"asse1"),a=o,s=1;for(;e.has(a);)a=o+"_c"+s++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],m="opz"+(c+1),u=X(l?.key,m),p=1;for(;d.some(f=>f.key===u);)u=u+"_c"+p++;d.push({id:_(),key:u,nome:String(l?.nome||"").trim()||u,codice:String(l?.codice||"").trim()})}return{id:_(),key:a,nome:String(t?.nome||"").trim()||a,opzioni:d}}function Gt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function St(t,i){let n=new Set(E(t).map(a=>a.key)),e=E(i),o=e.filter(a=>n.has(a.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function Nt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function be(t,i){return{id:String(t?.id||_()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function Wt(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(p,f){let w="v"+(f+1),g=X(p?.key,w);return{id:String(p?.id||_()),key:g,nome:String(p?.nome||g).trim()||g}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((p,f)=>pe(p,f)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(p){return{id:p.id,key:p.key,nome:p.nome}})}]:[],a=fi(o),s=a.length?a:n,d=new Set(s.map(p=>p.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(p){d.has(p[0])&&(c[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0))});for(let p of s)c[p.key]===void 0&&(c[p.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(p=>be(p,s[0]?.key||"")).filter(p=>!p.varianteKey||d.has(p.varianteKey)):[],m={};Object.entries(i.pronti||{}).forEach(function(p){m[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0)});let u=Array.isArray(i.sezioni)?i.sezioni.map(p=>ke(p,{assiConfigurazione:o,varianti:s})):[];return{id:String(i.id||_()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Ft,assiConfigurazione:o,varianti:s,sezioni:gi(u),sottoAssembly:l,qtaDaProdurre:c,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function E(t){return Array.isArray(t?.varianti)?t.varianti:[]}function H(t){return!!t&&t.modoComponente==="segnalazione"}function Yt(t){return!!t&&t.tracciabile!==!1&&!H(t)}function R(t,i){let n=it(t?.qtaPerVariante?.[i]);return H(t)?n>0?1:0:n}function Zt(t,i){return ki(t,i)}function kt(){let t=x.orderDrafts;return t&&typeof t=="object"?JSON.parse(JSON.stringify(t)):{}}function qt(t){let i=t&&typeof t=="object"?t:{};x.orderDrafts=i,yt()}function vt(){return Array.isArray(x.presets)?JSON.parse(JSON.stringify(x.presets)):[]}function Xt(t){x.presets=Array.isArray(t)?t:[],yt()}function at(){return Array.isArray(x.distinte)?JSON.parse(JSON.stringify(x.distinte)):[]}function It(t){x.distinte=Array.isArray(t)?t:[],yt()}function st(t){return String(t||"").trim().toUpperCase()}function nt(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(st).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function J(t){return nt(t?._meta||{})}function At(t,i){return t._meta=nt(i),t._meta}function ct(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}async function Bt(){try{let n=await pt({azione:"reserveKitDraftSeq"}),e=Math.max(0,Number.parseInt(n?.draftDocSeq,10)||0);if(e>0&&(x.draftDocSeq=e),x.ts=Number(n?.ts||x.ts||Date.now())||Date.now(),n?.documento)return String(n.documento)}catch(n){console.warn("[kit-prodotti] reserveKitDraftSeq fallita, fallback locale:",n)}let i=Math.max(0,Number.parseInt(x.draftDocSeq,10)||0)+1;return x.draftDocSeq=i,yt(),`Distinta Base-${String(i).padStart(4,"0")}`}function mi(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:st(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function ti(){return et.length?Promise.resolve(et):Array.isArray(window._attiviProd)&&window._attiviProd.length?(et=mi(window._attiviProd),Promise.resolve(et)):_t||(Qt=!0,_t=(function(){let t=new AbortController,i=setTimeout(function(){t.abort()},5e3);return fetch(Rt,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"}),signal:t.signal}).then(n=>n.json()).then(n=>(et=mi(n),et)).catch(function(n){return n&&n.name==="AbortError"?y("Ricerca ordini lenta: riprova tra poco.","warning"):console.warn("[kit-prodotti] autocomplete ordini non disponibile:",n),[]}).finally(function(){clearTimeout(i),Qt=!1,_t=null})})(),_t)}function he(t){let i=st(t);return i&&et.find(n=>n.ordine===i)||null}function Dt(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=st(e);return o?i[o]?String(i[o]||"").trim():String(he(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function ot(t){let i=kt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of E(t)){let a=n[o.key];e[o.key]=Math.max(0,Number.parseInt(a,10)||0)}return e._meta=nt(n._meta||{}),e}function G(t,i){let{kits:n}=h(),e=n.find(m=>m.id===t);if(!e)return;let o=kt(),a=ot(e);i(a,e);let s={},d=!1;for(let m of E(e)){let u=Math.max(0,Number.parseInt(a[m.key],10)||0);s[m.key]=u,u>0&&(d=!0)}let c=nt(a._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(s._meta=c),d||l?o[t]=s:delete o[t],qt(o),D===t&&P()}function we(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function yi(t){return!(t.assiConfigurazione&&t.assiConfigurazione.length)}function ft(t){let i=kt(),n=i?.[t]&&typeof i[t]=="object"?i[t]:{};return{_meta:nt(n._meta||{}),_units:Math.max(1,Number.parseInt(n._units,10)||1),_sel:n._sel&&typeof n._sel=="object"?{...n._sel}:{}}}function dt(t,i,n){let e=kt(),o=e?.[t]&&typeof e[t]=="object"?e[t]:{},a={_meta:nt(o._meta||{}),_units:Math.max(1,Number.parseInt(o._units,10)||1),_sel:o._sel&&typeof o._sel=="object"?{...o._sel}:{}};i(a);let s=Object.keys(a._sel).length>0,d=a._units>1,c=nt(a._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);s||d||l?e[t]={_meta:c,_units:a._units,_sel:a._sel}:delete e[t],qt(e),n!==!1&&D===t&&P()}function ze(t,i){let n=Math.max(1,Number.parseInt(i,10)||1);try{window._kitSuppressNextFade=!0}catch{}dt(t,function(e){e._units=n})}function _e(t,i,n){try{window._kitSuppressNextFade=!0}catch{}dt(t,function(e){n?e._sel[i]=!0:delete e._sel[i]})}function Ce(t,i){let n=String(i||"").trim().toLowerCase(),e=document.getElementById("kit-ns-autocomplete-"+t);if(e){if(!n){e.style.display="none",e.innerHTML="";return}Qt&&!et.length&&(e.innerHTML='<div class="autocomplete-item autocomplete-item--muted">Caricamento ordini in corso...</div>',e.style.display="block"),ti().then(function(o){let a=o.filter(function(s){return s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)}).slice(0,8);if(!a.length){e.style.display="none",e.innerHTML="";return}e.innerHTML=a.map(function(s){return`<div class="autocomplete-item" onmousedown='_kitNSOrderPick(${JSON.stringify(t)},${JSON.stringify(s.ordine)},${JSON.stringify(s.cliente)})'>
                <span class="ac-ordine">ORD. ${r(s.ordine)}</span>
                <span class="ac-cliente">${r(s.cliente)}</span>
            </div>`}).join(""),e.style.display="block"})}}function Se(t){setTimeout(function(){let i=document.getElementById("kit-ns-autocomplete-"+t);i&&(i.style.display="none",i.innerHTML="")},140)}function $e(t,i,n){let e=st(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}dt(t,function(s){s._meta.ordiniCliente.includes(e)||s._meta.ordiniCliente.push(e),s._meta.cliente=Dt(s._meta.ordiniCliente,{[e]:n})});let o=document.getElementById("kit-ns-ref-input-"+t);o&&(o.value="");let a=document.getElementById("kit-ns-autocomplete-"+t);a&&(a.style.display="none",a.innerHTML="")}function xe(t,i){let n=st(i);try{window._kitSuppressNextFade=!0}catch{}dt(t,function(e){e._meta.ordiniCliente=e._meta.ordiniCliente.filter(function(o){return o!==n}),e._meta.cliente=Dt(e._meta.ordiniCliente)})}function bi(t,i,n){try{window._kitSuppressNextFade=!0}catch{}dt(t,function(e){i.forEach(function(o){n?e._sel[o]=!0:delete e._sel[o]})})}function Ie(t){try{let i=t.dataset.kitid,n=JSON.parse(t.dataset.compids);bi(i,n,t.checked)}catch(i){console.error("[kit] _kitNSToggleSectionChk error",i)}}function Ae(t){if(!confirm("Azzerare la selezione corrente?"))return;let i=kt();delete i[t],qt(i),P()}function Tt(t,i){let n=Math.max(1,Number.parseInt(i._units,10)||1),e=i._sel&&typeof i._sel=="object"?i._sel:{},o=[],a=[];for(let s of t.sezioni||[]){let d=[];for(let c of s.componenti||[]){if(!e[c.id])continue;let l=it(c.qtaBase!=null?c.qtaBase:1)*n;d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,disponibile:Number(c.caricato||0),unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&a.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:""})}d.length&&o.push({id:s.id,nome:s.nome,righe:d})}return{selectedVarianti:[],sezioni:o,avvisi:a,totalePezzi:n,totaleRighe:o.reduce(function(s,d){return s+d.righe.length},0),_isNewStyle:!0}}async function Me(t){let{kits:i}=h(),n=i.find(function(l){return l.id===t});if(!n)return;let e=ft(t),o=Tt(n,e);if(!o.totaleRighe){y("Seleziona almeno un componente per generare la distinta.","warning");return}let a=[],s=new Map;if((n.sezioni||[]).forEach(function(l){(l.componenti||[]).forEach(function(m){s.set(m.id,m)})}),(o.sezioni||[]).forEach(function(l){(l.righe||[]).forEach(function(m){let u=s.get(m.id),p=Number(u&&u.caricato||0),f=Number(m.totale||0);p<f&&a.push({nome:m.nome,disponibile:p,fabbisogno:f,delta:f-p})})}),a.length){let l=a.slice(0,3).map(function(u){return u.nome+" (-"+V(u.delta)+")"}).join(", "),m=a.length>3?" +"+(a.length-3)+" altri":"";y("Attenzione stock insufficiente: "+l+m,"warning")}if(!e._meta.documento){let l=await Bt();dt(t,function(m){m._meta.documento=l},!1),e=ft(t)}let d={_meta:e._meta},c=at();c.unshift({id:_(),kitId:n.id,kitNome:n.nome,nome:e._meta.documento||"Distinta-"+Date.now(),documento:e._meta.documento||"",createdAt:Date.now(),createdBy:Q?.nome||"Sistema",orderDraftSnapshot:d,distintaSnapshot:o}),It(c);try{typeof window._notificaFabbisognoNuovo=="function"&&window._notificaFabbisognoNuovo({kitId:n.id,kitNome:n.nome,documento:e._meta.documento||"",distinta:o})}catch{}y("Distinta salvata \u2713"),T==="distinte"&&q("distinte")}async function Ne(t){let{kits:i}=h(),n=i.find(function(d){return d.id===t});if(!n)return;let e=ft(t),o=Tt(n,e);if(!o.totaleRighe){y("Seleziona almeno un componente per generare l'anteprima.","warning");return}if(!e._meta.documento){let d=await Bt();dt(t,function(c){c._meta.documento=d},!1),e=ft(t)}let a={_meta:e._meta},s=window.open("","_blank");if(!s){y("Popup bloccato: abilita l'anteprima di stampa.","warning");return}s.document.open(),s.document.write(ei(n,o,a)),s.document.close(),s.focus()}function Oe(t,i){let n=ft(t.id),e=n._units,o=n._sel,a=Tt(t,n),s=n._meta,d=t.sezioni||[],c=d.map(function(u){let p=u.componenti||[];if(!p.length)return"";let f=p.map(function(C){let K=!!o[C.id],j=K?it(C.qtaBase!=null?C.qtaBase:1)*e:0;return`<label class="kit-ns-comp-row${K?" kit-ns-comp-row--checked":""}">
                <input type="checkbox" class="kit-ns-check"${K?" checked":""}
                    onchange="_kitNSToggleComp('${r(t.id)}','${r(C.id)}',this.checked)">
                <div class="kit-ns-comp-info">
                    <span class="kit-ns-comp-name">${r(C.nome)}</span>
                    ${C.codice?`<span class="kit-ns-comp-code">\xB7 ${r(C.codice)}</span>`:""}
                    <span class="kit-ns-comp-qty-base">${V(C.qtaBase!=null?C.qtaBase:1)} ${C.unitaMisura||"pz"}/unit\xE0</span>
                </div>
                ${K?`<div class="kit-ns-comp-total">${V(j)} ${C.unitaMisura||"pz"}</div>`:""}
            </label>`}).join(""),w=p.every(function(C){return!!o[C.id]}),g=p.some(function(C){return!!o[C.id]}),v=r(JSON.stringify(p.map(function(C){return C.id})));return`<div class="kit-ns-section">
            <div class="kit-ns-section-header">
                <span class="kit-ns-section-title">${r(u.nome)}</span>
                <label class="kit-ns-sel-all" title="${w?"Deseleziona tutto":"Seleziona tutto"}">
                    <input type="checkbox" class="kit-ns-check kit-ns-sel-all-chk"
                        data-kitid="${r(t.id)}" data-compids="${v}"
                        ${w?" checked":g?' data-indeterminate="true"':""}
                        onchange="_kitNSToggleSectionChk(this)">
                    <span>${w?"Deseleziona tutto":"Seleziona tutto"}</span>
                </label>
            </div>
            <div class="kit-ns-comps">${f}</div>
        </div>`}).join(""),l=s.ordiniCliente.length?s.ordiniCliente.map(function(u){return`<span class="kit-order-ref-chip">${r(u)}
                <button type="button" class="kit-order-ref-chip-remove"
                    onclick='_kitNSOrderRemoveRef(${JSON.stringify(t.id)},${JSON.stringify(u)})' aria-label="Rimuovi ordine">
                    <i class="fas fa-times"></i>
                </button>
            </span>`}).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',m=a.totaleRighe?a.sezioni.map(function(u){return`<div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${r(u.nome)}</div>
                ${u.righe.map(function(p){return`<div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${r(p.nome)}</div>
                            ${p.codice?`<div class="kit-distinta-row-meta">${r(p.codice)}</div>`:""}
                            ${p.noteConfig?`<div class="kit-distinta-row-note">${r(p.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${V(p.totale)} ${r(p.unita)}</div>
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
                    <div class="kit-order-summary-total">${e} unit\xE0 \xB7 ${a.totaleRighe} materiali</div>
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
        ${a.totaleRighe?`
        <div class="kit-ns-distinta-preview">
            <div class="kit-ns-panel-title" style="margin-bottom:8px">Riepilogo distinta (${a.totaleRighe} materiali \xB7 ${V(e)} unit\xE0)</div>
            ${m}
        </div>`:""}
    </div>`,i.querySelectorAll('[data-indeterminate="true"]').forEach(function(u){u.indeterminate=!0})}function ii(t){let i=Ct[t.id]&&typeof Ct[t.id]=="object"?Ct[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(a=>a.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return Ct[t.id]=n,n}function hi(t,i){let n=t.assiConfigurazione||[];if(!n.length)return E(t)[0]||null;let e=[];for(let a of n){let s=i?.[a.id],d=(a.opzioni||[]).find(c=>c.id===s);if(!d)return null;e.push({asseId:a.id,asseKey:a.key,asseNome:a.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=ui(e);return E(t).find(a=>a.key===o)||null}function Ee(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function qe(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let a of t.sezioni||[])for(let s of a.componenti||[])if(!H(s)&&!(R(s,i.key)<=0)&&s.applicazioneTipo==="gruppo"&&String(s.applicazioneAsseId||"")===e&&Array.isArray(s.applicazioneOpzioneIds)&&s.applicazioneOpzioneIds.includes(o))return!0;return!1}function Be(t,i,n){let e=[],o=new Map;for(let a of i){let s=ct(n,a.key);if(s)for(let d of a.selections||[]){if(qe(t,a,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=s;continue}let m={id:"sel-"+c,nome:Ee(d),codice:String(d?.opzioneCodice||"").trim(),totale:s,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,m),e.push(m)}}return e}function Pt(t,i){if(yi(t))return Tt(t,ft(t.id));let n=E(t).filter(s=>ct(i,s.key)>0),e=[],o=[],a=Be(t,n,i);a.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:a});for(let s of t.sezioni||[]){let d=[];for(let c of s.componenti||[]){let l=0,m=[];for(let p of n){let f=ct(i,p.key),w=R(c,p.key);!f||!w||(H(c)?l+=f:l+=f*w,m.push({nome:p.nome,pezziOrdine:f,coeff:w}))}if(!m.length)continue;let u=m.length===1?m[0].nome:m.length+" configurazioni";if(H(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:u});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:u})}d.length&&e.push({id:s.id,nome:s.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:we(i),totaleRighe:e.reduce((s,d)=>s+d.righe.length,0)}}function De(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function Te(){return String(window._distintaHeaderAzienda||"").trim()}function ei(t,i,n){let e=new Date,o=J(n),a=Te(),s=String(o.documento||"").trim(),d=a?a.split(/\r?\n/).map(f=>String(f||"").trim()).filter(Boolean).join(" - "):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),m=i.selectedVarianti.length?i.selectedVarianti.map(f=>{let w=ct(n,f.key);return`<tr>
                <td>${r(V(w))}</td>
                <td>${r(f.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',u=i.sezioni.map(f=>{let w=f.righe.map(g=>{let v=[g.dettaglio,g.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${r(String(g.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${r(g.nome)}</div></td>
                <td class="db-print-cell-unit">${r(g.unita)}</td>
                <td class="db-print-cell-qty">${r(V(g.totale))}</td>
                <td class="db-print-cell-note">${v?r(v):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${r(f.nome)}</td></tr>${w}`}).join(""),p=i.avvisi.length?i.avvisi.map(f=>`<div class="db-print-alert ${f.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${r(f.nome)}</div>
                <div>${r(f.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${r(V(f.totaleCoinvolto))} pz \xB7 ${r(f.variantiLabel)}</div>
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
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${r(De(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${r(Q?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${r(V(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${r(V(i.totaleRighe))}</div></div>
                </div>
            </div>

            <div class="db-print-strip">
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Documento</div>
                    <div class="db-print-strip-value">${r(s)}</div>
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
</html>`}async function Pe(t){let{kits:i}=h(),n=i.find(s=>s.id===t);if(!n)return;let e=ot(n),o=Pt(n,e);if(!o.totalePezzi||!o.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}if(!J(e).documento){let s=await Bt();G(t,function(d){let c=J(d);c.documento=s,At(d,c)}),e=ot(n)}let a=window.open("","_blank");if(!a){y("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}a.document.open(),a.document.write(ei(n,o,e)),a.document.close(),a.focus()}function wi(t){return[...Array.isArray(t)?t:[]].sort((n,e)=>{let o=String(n?.nome||"").trim(),a=String(e?.nome||"").trim();return o.localeCompare(a,"it",{sensitivity:"base",numeric:!0})})}function h(){let t=Array.isArray(x.kits)?x.kits.map(Wt):[];return{kits:wi(t)}}function A(t){let i=wi(Array.isArray(t)?t.map(Wt):[]);x.kits=i,yt()}function Le(){if(!ut)return;clearTimeout(ut),ut=null;let t=Et();pt({azione:"setKitData",payload:t}).then(function(i){x.ts=Number(i?.ts||Date.now())||Date.now()}).catch(function(i){console.warn("[kit-prodotti] flush remoto fallito:",i)})}function yt(){clearTimeout(ut),ut=setTimeout(function(){ut=null;let t=Et();pt({azione:"setKitData",payload:t}).then(function(i){x.ts=Number(i?.ts||Date.now())||Date.now()}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function Ke(t){fetch(Rt,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&i.integrityOk===!1){console.error("[kit-prodotti] payload kit non leggibile lato server:",i.parseError||"parse error"),y("Errore lettura dati Kit dal server. Contatta subito supporto: nessun salvataggio automatico verr\xE0 forzato.","error"),t&&t(!1);return}let n=$t(i);if(pi(n)){x=n,t&&t(!0);return}let e=ce();if(pi(e)){x=$t(e),pt({azione:"setKitData",payload:Et()}).then(function(o){x.ts=Number(o?.ts||Date.now())||Date.now(),de(),y("Migrazione Kit completata: dati spostati su Sheets.","success"),t&&t(!0)}).catch(function(){t&&t(!1)});return}x=n,t&&t(!0)}).catch(()=>{t&&t(!1)})}function _(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function ni(){if(!Q||!Q.nome)return!1;let t=String(Q.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||Q.ruolo==="MASTER"}function Re(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(H(e)){i[e.id]=0;continue}let o=0;for(let[a,s]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(s,10)||0)*R(e,a);i[e.id]=o}return i}function He(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let a of t.sezioni||[])for(let s of a.componenti||[]){if(H(s))continue;let d=R(s,o);d>0&&(i[s.id]=(i[s.id]||0)+e*d)}}return i}function zi(t,i){let n=E(t).find(e=>e.key===i);return n?r(n.nome):r(i)}function oi(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function _i(){try{let t=document.getElementById("contenitore-dati");if(!t)return;window.cacheContenuti&&(window.cacheContenuti.KIT_PRODOTTI=t.innerHTML),window.cacheFetchTime&&(window.cacheFetchTime.KIT_PRODOTTI=Date.now())}catch{}}function bt(){if(window.paginaAttuale!=="KIT_PRODOTTI")return;if(!jt){jt=!0;let n=document.getElementById("contenitore-dati");n&&(n.innerHTML="<div class='centered-msg'><i class='fas fa-spinner fa-spin'></i> Caricamento kit dal database...</div>"),Ke(function(){bt()});return}let{kits:t}=h(),i=document.getElementById("contenitore-dati");if(i){i.innerHTML=`
    <div class="kit-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title"><i class="fas fa-toolbox" style="color:#6366f1;margin-right:6px;font-size:1.1rem"></i>Kit Prodotti</h3>
                <p class="acquisti-subtitle">Gestisci kit, componenti e distinte.</p>
            </div>
            <div id="kit-page-actions" class="acquisti-actions-wrapper"></div>
        </div>
        <div id="kit-tab-bar" style="display:flex;gap:4px;padding:8px 0 0">
            <button class="acq-tab ${T==="kits"?"active":""}" data-tab="kits" onclick="_kitSwitchMainTab('kits')"><i class="fas fa-boxes-stacked"></i> Kits</button>
            <button class="acq-tab ${T==="anagrafiche"?"active":""}" data-tab="anagrafiche" onclick="_kitSwitchMainTab('anagrafiche')"><i class="fas fa-list"></i> Anagrafiche</button>
            <button class="acq-tab ${T==="distinte"?"active":""}" data-tab="distinte" onclick="_kitSwitchMainTab('distinte')"><i class="fas fa-file-alt"></i> Distinte</button>
        </div>
        <div id="kit-main-content" class="kit-main-content" style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:0"></div>
    </div>`,q(T),ai(),_i();try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else zt(i)}catch{zt(i)}}}function Ci(t,i){if(!i)return;if(!t.length){i.innerHTML=`
        <div style="padding:40px 0;text-align:center">
            <i class="fas fa-box-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:16px;display:block"></i>
            <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun kit configurato.</p>
            <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
        </div>`;return}let n=["pz","mt","cm","mm","kg","g","lt","ml"],e=t.map(o=>{let a=o.sezioni||[],s=a.reduce((l,m)=>l+(m.componenti||[]).length,0),d=a.length,c=a.map(l=>{let m=l.componenti||[],u=m.map(p=>`
            <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #f8fafc">
                <span style="font-size:.84rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r(p.nome)}">${r(p.nome)}${p.codice?` <span style="color:#94a3b8;font-size:.76rem">\xB7 ${r(p.codice)}</span>`:""}</span>
                <input type="number" min="0" step="any" value="${p.qtaBase!=null?p.qtaBase:1}"
                    class="input-field-modern" style="padding:4px 8px;font-size:.82rem;text-align:right"
                    onchange="_kitQUpdateComp('${r(o.id)}','${r(l.id)}','${r(p.id)}','qtaBase',this.value)"
                    title="Quantit\xE0">
                <select class="input-field-modern" style="padding:4px 6px;font-size:.82rem"
                    onchange="_kitQUpdateComp('${r(o.id)}','${r(l.id)}','${r(p.id)}','unitaMisura',this.value)">
                    ${n.map(f=>`<option value="${f}"${(p.unitaMisura||"pz")===f?" selected":""}>${f}</option>`).join("")}
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
                    <span style="color:#94a3b8;font-size:.78rem;font-weight:500;margin-left:8px">${d} sez. \xB7 ${s} comp.</span>
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
                ${a.length?c:'<p class="acquisti-subtitle" style="padding:12px 16px;margin:0">Nessuna sezione. Aggiungi una sezione per iniziare.</p>'}
                <div style="padding:8px 12px;border-top:1px solid #f1f5f9">
                    <button type="button" class="btn-archive-action" style="font-size:.8rem"
                        onclick="_kitQAddSezOpen('${r(o.id)}')">
                        <i class="fas fa-folder-plus"></i> Aggiungi sezione
                    </button>
                </div>
            </div>
        </details>`}).join("");i.innerHTML=e}function ai(){let t=document.getElementById("kit-page-actions");t&&(T==="kits"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>':T==="anagrafiche"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>':t.innerHTML="")}function q(t){T=t,document.querySelectorAll("#kit-tab-bar .acq-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)});let{kits:i}=h(),n=document.getElementById("kit-main-content");n&&(t==="kits"?Ci(i,n):t==="anagrafiche"?Si(i,n):t==="distinte"&&$i(i,n),ai(),_i())}function Si(t,i){if(!i)return;let n=W();if(!n.length){i.innerHTML=`
            <div style="padding:24px 0;text-align:center">
                <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun componente salvato. Aggiungi il primo componente riutilizzabile.</p>
                <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi componente</button>
            </div>`;return}let e=n.reduce((s,d)=>{let c=d.categoria||"Senza categoria";return s[c]=s[c]||[],s[c].push(d),s},{}),o=Object.keys(e).sort((s,d)=>s.localeCompare(d,"it",{sensitivity:"base",numeric:!0})),a="";for(let s of o){let d=si(e[s]||[]);a+=`<details class="ordine-group" open>
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${r(s)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${d.length} componente${d.length!==1?"i":""}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">`,a+=d.map(c=>`
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        <div style="font-weight:600;color:#1e293b">${r(c.nome)}${c.codice?` <span style="color:#94a3b8;font-size:.85rem;font-weight:400">\xB7 ${r(c.codice)}</span>`:""}</div>
                        ${c.descrizione?`<div style="color:#94a3b8;font-size:.82rem;margin-top:2px">${r(c.descrizione)}</div>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitOpenAnagraficaModal('${r(c.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questo componente?')) _kitDeleteAnagrafica('${r(c.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`).join(""),a+="</div></details>"}i.innerHTML=a}function $i(t,i){if(!i)return;let n=at();if(!n.length){i.innerHTML='<div style="padding:24px 0;text-align:center"><p class="acquisti-subtitle">Nessuna distinta salvata.</p></div>';return}let e=n.map(o=>`
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
        </details>`).join("");i.innerHTML=e}async function xi(t){let{kits:i}=h(),n=i.find(c=>c.id===t);if(!n){y("Kit non trovato \u26A0\uFE0F");return}let e=ot(n);if(!J(e).documento){let c=await Bt();G(t,function(l){let m=J(l);m.documento=c,At(l,m)}),e=ot(n)}let o=Pt(n,e);if(!o.totalePezzi||!o.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}let a=at(),s=J(e),d={id:_(),kitId:n.id,kitNome:n.nome,nome:s.documento||`Distinta-${Date.now()}`,documento:s.documento||"",createdAt:Date.now(),createdBy:Q?.nome||"Sistema",orderDraftSnapshot:e,distintaSnapshot:o};a.unshift(d),It(a),y("Distinta salvata \u2713"),T==="distinte"&&q("distinte")}function si(t){return[...Array.isArray(t)?t:[]].sort((n,e)=>{let o=String(n?.categoria||"Senza categoria").trim()||"Senza categoria",a=String(e?.categoria||"Senza categoria").trim()||"Senza categoria",s=o.localeCompare(a,"it",{sensitivity:"base",numeric:!0});if(s!==0)return s;let d=String(n?.nome||"").trim(),c=String(e?.nome||"").trim(),l=d.localeCompare(c,"it",{sensitivity:"base",numeric:!0});if(l!==0)return l;let m=String(n?.codice||"").trim(),u=String(e?.codice||"").trim();return m.localeCompare(u,"it",{sensitivity:"base",numeric:!0})})}function W(){let t=Array.isArray(x.anagrafiche)?JSON.parse(JSON.stringify(x.anagrafiche)):[];return si(t)}function ri(t){x.anagrafiche=si(Array.isArray(t)?t:[]),yt()}function je(){if(document.getElementById("modal-kit-anagrafica-edit"))return;let t=document.createElement("div");t.innerHTML=`
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
    </div>`,document.body.appendChild(t.firstElementChild)}function Qe(t){je();let i=document.getElementById("modal-kit-anagrafica-edit");if(!i)return;let n=document.getElementById("anag-componente"),e=document.getElementById("anag-codice"),o=document.getElementById("anag-categoria"),a=document.getElementById("anag-descrizione");if(t){let s=W().find(d=>d.id===t);s&&(n&&(n.value=s.nome||""),e&&(e.value=s.codice||""),o&&(o.value=s.categoria||""),a&&(a.value=s.descrizione||""),i.dataset.editId=t)}else n&&(n.value=""),e&&(e.value=""),o&&(o.value=""),a&&(a.value=""),delete i.dataset.editId;i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function Ii(){let t=document.getElementById("modal-kit-anagrafica-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ve(){let t=document.getElementById("modal-kit-anagrafica-edit");if(!t)return;let i=t.dataset.editId,n=(document.getElementById("anag-componente")?.value||"").trim();if(!n){y("Inserisci il nome del componente","warning");return}let e=(document.getElementById("anag-codice")?.value||"").trim(),o=(document.getElementById("anag-categoria")?.value||"").trim(),a=(document.getElementById("anag-descrizione")?.value||"").trim(),s=W();if(i){let d=s.findIndex(c=>c.id===i);d!==-1?s[d]={...s[d],nome:n,codice:e,categoria:o,descrizione:a,updatedAt:Date.now()}:s.unshift({id:_(),nome:n,codice:e,categoria:o,descrizione:a,createdAt:Date.now(),createdBy:Q?.nome||"Sistema"})}else s.unshift({id:_(),nome:n,codice:e,categoria:o,descrizione:a,createdAt:Date.now(),createdBy:Q?.nome||"Sistema"});ri(s),Ii(),y("Componente salvato \u2713"),T==="anagrafiche"&&q("anagrafiche")}function Ue(t){let i=W().filter(n=>n.id!==t);ri(i),T==="anagrafiche"&&q("anagrafiche"),y("Componente eliminato \u2713")}function Fe(t){let i=at().find(o=>o.id===t);if(!i)return;let{kits:n}=h(),e=n.find(o=>o.id===i.kitId)||null;if(e){let o=window.open("","_blank");if(!o){y("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}o.document.open();try{o.document.write(ei(e,i.distintaSnapshot,i.orderDraftSnapshot))}catch{o.document.write("<pre>"+r(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>")}o.document.close(),o.focus()}else{let o=window.open("","_blank");if(!o){y("Popup bloccato","warning");return}o.document.open(),o.document.write("<pre>"+r(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>"),o.document.close(),o.focus()}}function Je(t){let i=at().find(e=>e.id===t);if(!i)return;let n=kt();n[i.kitId]=i.orderDraftSnapshot||{},qt(n),y("Bozza ordine ripristinata per il kit selezionato \u2713")}function Ge(t){let i=at().filter(n=>n.id!==t);It(i),T==="distinte"&&q("distinte"),y("Distinta eliminata \u2713")}function We(t){D=t,Ai="ordine",P()}function P(){let{kits:t}=h(),i=t.find(g=>g.id===D);if(!i){bt();return}let n=document.getElementById("contenitore-dati");if(yi(i)){Oe(i,n);return}let e=E(i),o=ot(i),a=J(o),s=Pt(i,o),d=s.selectedVarianti.length?s.selectedVarianti.map(g=>`<span class="kit-meta-pill"><strong>${ct(o,g.key)}</strong> \xD7 ${r(g.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=a.ordiniCliente.length?a.ordiniCliente.map(g=>`<span class="kit-order-ref-chip">${r(g)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(g)})' aria-label="Rimuovi ordine ${r(g)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=ii(i),m=hi(i,l),u=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(g=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${r(g.nome)}</div>
                <div class="kit-compose-options">${(g.opzioni||[]).map(v=>`
                        <button type="button" class="kit-compose-option ${l[g.id]===v.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${r(i.id)}','${r(g.id)}','${r(v.id)}')">
                        ${r(v.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',p=s.selectedVarianti.length?s.selectedVarianti.map(g=>{let v=ct(o,g.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${r(g.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(g.selections)&&g.selections.length?g.selections.map(C=>r(C.opzioneNome)).join(" \xB7 "):r(g.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${r(i.id)}','${r(g.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${v}"
                           onchange="_kitOrdineSet('${r(i.id)}','${r(g.key)}',this.value)"
                           oninput="_kitOrdineSet('${r(i.id)}','${r(g.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${r(i.id)}','${r(g.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${r(i.id)}','${r(g.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,f=s.totalePezzi?s.sezioni.map(g=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${r(g.nome)}</div>
                ${g.righe.map(v=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${r(v.nome)}</div>
                            ${v.dettaglio?`<div class="kit-distinta-row-meta">${r(v.dettaglio)}</div>`:""}
                            ${v.noteConfig?`<div class="kit-distinta-row-note">${r(v.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${V(v.totale)} ${r(v.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,w=s.avvisi.length?s.avvisi.map(g=>`
            <div class="kit-distinta-alert ${g.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${r(g.nome)}</div>
                <div class="kit-distinta-alert-body">${r(g.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${g.totaleCoinvolto} pz \xB7 ${r(g.variantiLabel)}</div>
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
                    <div class="kit-order-summary-total">${s.totalePezzi} pezzi</div>
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
                    <div class="kit-order-meta-row"><span>Cliente</span><strong>${r(a.cliente||"")}</strong></div>
                    <div class="kit-order-meta-row"><span>Documento</span><strong>${r(a.documento||"")}</strong></div>
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
                <div class="kit-order-distinta-meta">${s.totaleRighe} righe materiali \xB7 ${s.avvisi.length} avvisi</div>
                ${f}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${w}
            </section>
        </div>
    </div>`,zt(n),ti().catch(()=>{})}function Ye(){D=null,bt()}function Ze(t){Ai=t,P()}function Xe(t){G(t,function(i,n){for(let e of E(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function tn(t,i,n){try{window._kitSuppressNextFade=!0}catch{}G(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function en(t,i,n){try{window._kitSuppressNextFade=!0}catch{}G(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function nn(t){G(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=nt({})})}function on(t,i){G(t,function(n){n[i]=0})}function Ot(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${r(e.ordine)}</span>
            <span class="ac-cliente">${r(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function an(t,i){let n=String(i||"").trim().toLowerCase();if(!n){Ot(t,[]);return}ti().then(function(e){let o=e.filter(a=>a.ordine.toLowerCase().includes(n)||a.cliente.toLowerCase().includes(n)).slice(0,8);Ot(t,o)})}function sn(t){setTimeout(function(){Ot(t,[])},140)}function rn(t,i,n){let e=st(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}G(t,function(a){let s=J(a);s.ordiniCliente=[...new Set(s.ordiniCliente.concat(e))],s.cliente=Dt(s.ordiniCliente,{[e]:n}),At(a,s)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),Ot(t,[])}function cn(t,i){let n=st(i);try{window._kitSuppressNextFade=!0}catch{}G(t,function(e){let o=J(e);o.ordiniCliente=o.ordiniCliente.filter(a=>a!==n),o.cliente=Dt(o.ordiniCliente),At(e,o)})}function dn(t,i,n){let{kits:e}=h(),o=e.find(s=>s.id===t);if(!o)return;let a=ii(o);if(a[i]=n,Ct[t]=a,D===t){try{window._kitSuppressNextFade=!0}catch{}P()}}function ln(t){let{kits:i}=h(),n=i.find(s=>s.id===t);if(!n)return;let e=hi(n,ii(n));if(!e){y("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){y("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(Ht[t])return;Ht[t]=Date.now(),setTimeout(function(){try{delete Ht[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}G(t,function(s){s[e.key]=ct(s,e.key)+o});let a=document.getElementById("kit-compose-qty-"+t);a&&(a.value=1)}function Mi(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=h(),a=o.find(v=>v.id===D);if(!a)return;let s=(a.sezioni||[]).find(v=>v.id===n),d=s&&(s.componenti||[]).find(v=>v.id===i);if(!d||!Yt(d))return;d.caricato=e,A(o);let l=Re(a)[i]||0,m=Math.max(0,l-e),p=He(a)[i]||0,f=t.closest("tr");if(!f)return;let w=f.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");w&&(w.textContent=l===0?"\u2014":m,w.className=l===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let g=f.querySelector(".kit-car-liberi");g&&(p>0?(g.textContent=Math.max(0,e-p)+" lib.",g.style.display=""):g.style.display="none")}function pn(t,i,n){let{kits:e}=h(),o=e.find(a=>a.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),A(e),D===t&&P())}function mn(t,i,n){let{kits:e}=h(),o=e.find(s=>s.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),A(e);let a=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);a&&(a.value=o.pronti[i],a.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function un(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${r(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',a=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${r(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let s=(e.righe||[]).reduce((l,m)=>l+m.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${r(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${r(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${s} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${r(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${c}<div class="kit-sped-bom-divider">componenti scaricati</div>${d}</div>
            </details>`}if(e.tipo==="reso"){let s=e.totPz||0,d=(e.items||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${r(m.nome)}</span><span class="kit-mov-qty carico">\xD7${m.qty}</span></div>`).join(""),c=(e.righe||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${r(m.mat)}</span><span class="kit-mov-qty carico">+${m.qty}</span></div>`).join(""),l=(e.scartate||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${r(m.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${m.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\u{1F4E6} Rientro \xD7${s} pz</span>
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
            ${a}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function fn(t,i){let{kits:n}=h(),e=n.find(g=>g.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),a=document.getElementById("kit-mov-qty-"+t),s=document.getElementById("kit-mov-nota-"+t);if(!o||!a)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(a.value,10)||1),m=(s?.value||"").trim(),u=(e.sezioni||[]).find(g=>g.id===c),p=u&&(u.componenti||[]).find(g=>g.id===d);if(!p||!Yt(p))return;i==="carico"?p.caricato=(parseInt(p.caricato)||0)+l:p.caricato=Math.max(0,(parseInt(p.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:m,mat:p.nome,ts:oi()}),A(n),a&&(a.value=1),s&&(s.value="");let f=document.getElementById("kit-mov-list-"+t);f&&(f.innerHTML=un(e,ni()));let w=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);w&&(w.value=p.caricato,Mi(w))}function gn(t,i){if(!ni())return;let{kits:n}=h(),e=n.find(a=>a.id===t);if(!e)return;let o=(e.movimenti||[]).find(a=>a.id===i);o&&kn(t,i,o)}function kn(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),a;if(n.tipo==="spedizione")a=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")a=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";a=`<span class="kit-mov-badge ${r(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${r(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=a);let s=document.getElementById("btn-kit-del-ok");s&&(s.onclick=()=>Oi(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Ni(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Oi(t,i){Ni();let{kits:n}=h(),e=n.find(a=>a.id===t);if(!e)return;let o=(e.movimenti||[]).find(a=>a.id===i);if(o){if(o.tipo==="spedizione"){let a=(e.sezioni||[]).find(s=>s.id===o.sid);for(let s of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===s.cid||l.nome===s.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+s.qty)}for(let s of o.items||[])s.saId&&e.pronti&&(e.pronti[s.saId]=(parseInt(e.pronti[s.saId])||0)+s.qty)}else if(o.tipo==="reso")for(let a of o.righe||[])for(let s of e.sezioni||[]){let d=(s.componenti||[]).find(c=>c.id===a.cid||c.nome===a.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-a.qty))}else if(o.tipo==="carico")for(let a of e.sezioni||[]){let s=(a.componenti||[]).find(d=>d.id===o.cid);s&&(s.caricato=Math.max(0,(parseInt(s.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let a of e.sezioni||[]){let s=(a.componenti||[]).find(d=>d.id===o.cid);s&&(s.caricato=(parseInt(s.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(a=>a.id!==i),A(n),D===t&&P(),y("Movimento eliminato \u2713")}}function vn(t,i){if(!ni())return;let{kits:n}=h(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let a=document.getElementById("modal-kit-edit-mov");if(!a)return;let s=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");s&&(s.innerHTML=`<span class="kit-mov-badge ${r(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${r(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),a.dataset.kitId=t,a.dataset.movId=i,a.style.display="flex",a.offsetHeight,a.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function Ei(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function yn(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);Ei();let{kits:e}=h(),o=e.find(l=>l.id===i);if(!o)return;let a=(o.movimenti||[]).findIndex(l=>l.id===n);if(a===-1)return;let s=o.movimenti[a],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){y("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==s.qty){let l=d-s.qty;for(let m of o.sezioni||[]){let u=(m.componenti||[]).find(p=>p.id===s.cid);if(u){s.tipo==="carico"?u.caricato=Math.max(0,(parseInt(u.caricato)||0)+l):u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l);break}}}o.movimenti[a]={...s,qty:d,nota:c},A(e),D===i&&P(),y("Movimento aggiornato \u2713")}function bn(t){let{kits:i}=h(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){y("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let a=document.getElementById("kit-sped-items-list");a&&(a.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,m=zi(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${r(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${r(c.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let s=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&s&&(d.value=s.value||""),d&&!s&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function qi(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function hn(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;qi();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=h(),o=e.find(l=>l.id===i);if(!o)return;let a=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),s=[],d=[];for(let l of n){let m=(o.sottoAssembly||[]).find(p=>p.id===l);if(!m)continue;let u=Number.parseInt(o.pronti?.[l],10)||0;if(u){s.push({saId:l,nome:m.nome,qty:u});for(let p of o.sezioni||[])for(let f of p.componenti||[]){if(H(f))continue;let w=R(f,m.varianteKey);if(!w)continue;let g=u*w;f.caricato=Math.max(0,(parseInt(f.caricato)||0)-g);let v=d.find(C=>C.cid===f.id);v?v.qty+=g:d.push({cid:f.id,mat:f.nome,qty:g})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:s,righe:d,nota:a,ts:oi()}),A(e);let c=s.reduce((l,m)=>l+m.qty,0);y(`Spedizione registrata: ${c} pz \u2713`),D===i&&P()}function wn(t){let{kits:i}=h(),n=i.find(s=>s.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let s=n.sottoAssembly||[];o.innerHTML=s.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':s.map(d=>{let c=zi(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${r(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${r(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${r(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let a=document.getElementById("kit-reso-nota");a&&(a.value=""),ci(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Bi(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function zn(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&ci(e.dataset.kitId)}function ci(t){let{kits:i}=h(),n=i.find(s=>s.id===t);if(!n)return;let e={};for(let s of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+s.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let m of l.componenti||[]){if(H(m))continue;let u=R(m,s.varianteKey);u&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+c*u})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let a=Object.entries(e).filter(([,s])=>s.qty>0);if(!a.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=a.map(([s,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${r(s)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${r(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function _n(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=h(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;m>0&&o.push({saId:l.id,nome:l.nome,qty:m})}if(!o.length){y("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let a=[],s=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let m=l.dataset.cid,u=Number.parseInt(l.dataset.qty,10),p=[...e.sezioni||[]].flatMap(f=>f.componenti||[]).find(f=>f.id===m)?.nome||"?";l.checked?a.push({cid:m,mat:p,qty:u}):s.push({cid:m,mat:p,qty:u})});for(let l of a)for(let m of e.sezioni||[]){let u=(m.componenti||[]).find(p=>p.id===l.cid);if(u){u.caricato=(parseInt(u.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,m)=>l+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:a,scartate:s,nota:d,ts:oi(),totPz:c}),A(n),Bi(),y(`Reso registrato: ${c} pz \u2014 ${a.length} comp. recuperati \u2713`),D===i&&P()}function Cn(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");!i||!n||(i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026",pt({azione:"setKitData",payload:Et()}).then(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)}))}function Pi(t){L=t;let i=document.getElementById("modal-kit-config");i&&(F(),i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function Sn(){let t=document.getElementById("modal-kit-config");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300),Li(),L=null)}function $n(t){if(!L)return;let i=(t?.value||"").trim();i&&($(L,n=>{n.nome=i},!1),q("kits"))}function F(){if(!L)return;let{kits:t}=h(),i=t.find(v=>v.id===L);if(!i)return;let n=W(),e=["pz","mt","cm","mm","kg","g","lt","ml"],o=document.getElementById("kit-cfg-modal-nome");o&&(o.value=i.nome||"");let a=[...new Set(n.map(v=>(v.categoria||"").trim()).filter(Boolean))].sort(),s=["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ef4444","#14b8a6","#f97316","#84cc16"],d=v=>s[a.indexOf(v)%s.length]||"#94a3b8",l=(i.sezioni||[]).flatMap(v=>(v.componenti||[]).map(C=>({comp:C,sez:v})));function m(v){return n.find(C=>C.nome===v.nome&&(!v.codice||!C.codice||C.codice===v.codice))||n.find(C=>C.nome===v.nome)}let u;l.length===0?u=`<div class="kcfg-empty">
            <i class="fas fa-inbox" style="font-size:1.3rem;display:block;margin-bottom:6px;opacity:.35"></i>
            Nessun componente ancora. Aggiungili dal catalogo qui sotto.
        </div>`:u='<div class="kcfg-list">'+l.map(({comp:v,sez:C})=>{let K=m(v),j=K?(K.categoria||"").trim():"",Y=j?d(j):"#e2e8f0",wt=xt(v.unitaMisura,"pz"),lt=e.map(Z=>`<option value="${Z}"${wt===Z?" selected":""}>${Z}</option>`).join("");return`<div class="kcfg-comp-row">
                    <span class="kcfg-dot" style="background:${Y}"></span>
                    <span class="kcfg-name">${r(v.nome)}${v.codice?`<span class="kcfg-code">&middot;&thinsp;${r(v.codice)}</span>`:""}</span>
                    <input type="number" min="0" step="any" class="input-field-modern kcfg-qty"
                        value="${v.qtaBase??1}" title="Quantit&#224;"
                        onchange="_kitCfgModalUpdateComp('${r(i.id)}','${r(C.id)}','${r(v.id)}','qtaBase',this.value)">
                    <select class="input-field-modern kcfg-unit"
                        onchange="_kitCfgModalUpdateComp('${r(i.id)}','${r(C.id)}','${r(v.id)}','unitaMisura',this.value)">
                        ${lt}
                    </select>
                    <button type="button" class="btn-trash-modern" style="width:28px;height:28px;flex-shrink:0"
                        onclick="_kitCfgModalDelComp('${r(i.id)}','${r(C.id)}','${r(v.id)}')">
                        <i class="fas fa-times" style="font-size:.75rem"></i>
                    </button>
                </div>`}).join("")+"</div>";let p=new Set(l.map(({comp:v})=>v.nome)),f=n.filter(v=>!p.has(v.nome)),w=[...new Set(f.map(v=>(v.categoria||"Senza categoria").trim()||"Senza categoria"))],g=document.getElementById("kit-cfg-modal-bom-panel");g&&(g.innerHTML=`
        <div class="kcfg-section-lbl">Nel kit (${l.length})</div>
        ${u}
        <div class="kcfg-section-lbl" style="margin-top:18px">Aggiungi dal catalogo</div>
        ${n.length>0?`<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc">
                    <div style="font-size:.82rem;color:#64748b">
                        ${f.length?`${f.length} componenti disponibili in ${w.length} categorie`:"Tutti i componenti del catalogo sono gi\xE0 nel kit"}
                    </div>
                    <button type="button" class="btn-archive-action primary" style="white-space:nowrap;width:auto;flex-shrink:0" onclick="_kitCfgOpenCatalogPicker()">
                        <i class="fas fa-magnifying-glass"></i> Apri catalogo
                    </button>
               </div>`:`<div class="kcfg-empty" style="background:#fef3c7;border-color:#fde68a;color:#92400e;text-align:left">
                    <i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>
                    Catalogo vuoto. Vai nella tab <strong>Anagrafiche</strong> per aggiungere componenti.
               </div>`}
        <div style="margin-top:14px;padding-top:10px;border-top:1px solid #f1f5f9">
            <button type="button" class="btn-add-dashed" style="font-size:.79rem;padding:8px 14px;border-radius:10px"
                onclick="_kitCfgModalAddCompFree()">
                <i class="fas fa-pen" style="margin-right:6px;opacity:.55"></i>Aggiungi componente manuale
            </button>
        </div>`)}function xn(){if(document.getElementById("modal-kit-cfg-catalog-picker"))return;let t=document.createElement("div");t.innerHTML=`
    <div id="modal-kit-cfg-catalog-picker" class="modal-overlay" style="display:none" onclick="if(event.target===this)_kitCfgCloseCatalogPicker()">
      <div class="modal-content" style="max-width:760px;width:min(760px,92vw)">
        <h2 style="margin:0 0 6px;font-size:1.03rem;font-weight:700;color:#1e293b"><i class="fas fa-layer-group" style="color:#6366f1;margin-right:6px"></i>Catalogo Componenti</h2>
        <p style="margin:0 0 12px;color:#94a3b8;font-size:.82rem">Cerca e aggiungi i componenti senza riempire la configurazione principale.</p>
        <input id="kit-cfg-picker-search" class="input-field-modern" placeholder="Cerca per nome, codice, categoria" oninput="_kitCfgSetCatalogPickerQuery(this.value)">
        <div id="kit-cfg-picker-cats" style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 8px"></div>
        <div id="kit-cfg-picker-list" style="max-height:48vh;overflow:auto;border:1px solid #e2e8f0;border-radius:12px;padding:6px;background:#fff"></div>
        <div class="modal-footer" style="margin-top:12px">
          <button type="button" class="btn-modal-cancel" onclick="_kitCfgCloseCatalogPicker()">Chiudi</button>
        </div>
      </div>
    </div>`,document.body.appendChild(t.firstElementChild)}function In(){if(!L)return;xn(),U.kitId=L,U.query="",U.categoria="";let t=document.getElementById("modal-kit-cfg-catalog-picker");if(!t)return;Lt(),t.style.display="flex",t.offsetHeight,t.classList.add("active");let i=document.getElementById("kit-cfg-picker-search");i&&(i.value=U.query||"",setTimeout(()=>i.focus(),50))}function Li(){let t=document.getElementById("modal-kit-cfg-catalog-picker");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},200))}function An(t){U.query=String(t||"").trim(),Lt()}function Mn(t){U.categoria=t||"",Lt()}function Nn(t){U.kitId&&(Ki(U.kitId,t),Lt())}function Lt(){let t=U.kitId;if(!t)return;let{kits:i}=h(),n=i.find(u=>u.id===t);if(!n)return;let e=W(),o=new Set((n.sezioni||[]).flatMap(u=>(u.componenti||[]).map(p=>p.nome))),a=[...new Set(e.map(u=>(u.categoria||"Senza categoria").trim()||"Senza categoria"))].sort((u,p)=>u.localeCompare(p,"it",{sensitivity:"base",numeric:!0})),s=String(U.query||"").toLowerCase(),d=U.categoria||"",c=e.filter(u=>{let p=(u.categoria||"Senza categoria").trim()||"Senza categoria";return d&&p!==d?!1:s?`${u.nome||""} ${u.codice||""} ${u.categoria||""} ${u.descrizione||""}`.toLowerCase().includes(s):!0}),l=document.getElementById("kit-cfg-picker-cats");if(l){let u="background:#6366f1;color:#fff;border-color:#6366f1";l.innerHTML=`
            <button type="button" class="kcfg-pill" style="${d?"":u}" onclick="_kitCfgSetCatalogPickerCategory('')">Tutte</button>
            ${a.map(p=>`<button type="button" class="kcfg-pill" style="${d===p?u:""}" onclick='_kitCfgSetCatalogPickerCategory(${JSON.stringify(p)})'>${r(p)}</button>`).join("")}`}let m=document.getElementById("kit-cfg-picker-list");if(m){if(!c.length){m.innerHTML='<div class="kcfg-empty" style="margin:2px">Nessun componente trovato con i filtri correnti.</div>';return}m.innerHTML=c.map(u=>{let p=(u.categoria||"Senza categoria").trim()||"Senza categoria",f=o.has(u.nome);return`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border-bottom:1px solid #f1f5f9">
            <div style="min-width:0;flex:1">
                <div style="font-size:.86rem;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r(u.nome)}${u.codice?` <span style="color:#94a3b8;font-weight:400;font-size:.78rem">\xB7 ${r(u.codice)}</span>`:""}</div>
                <div style="font-size:.74rem;color:#94a3b8;margin-top:1px">${r(p)}</div>
            </div>
            ${f?'<span class="kcfg-pill" style="cursor:default;opacity:.7;flex-shrink:0"><i class="fas fa-check" style="margin-right:4px;color:#22c55e"></i>Nel kit</span>':`<button type="button" onclick='_kitCfgAddAnagFromPicker(${JSON.stringify(u.id)})' style="flex-shrink:0;display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:20px;border:1.5px solid #6366f1;background:#eef2ff;color:#4f46e5;font-size:.75rem;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s,color .15s" onmouseover="this.style.background='#6366f1';this.style.color='#fff'" onmouseout="this.style.background='#eef2ff';this.style.color='#4f46e5'"><i class="fas fa-plus"></i> Aggiungi</button>`}
        </div>`}).join("")}}function On(t,i,n,e){$(t,o=>{let a=(o.sezioni||[]).find(s=>s.id===i);a&&(a[n]=e.trim()||a[n])},!0)}function En(t,i){confirm("Eliminare questa sezione e tutti i componenti?")&&$(t,n=>{n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)},!0)}function Ki(t,i){let e=W().find(a=>a.id===i);if(!e)return;let o=(e.categoria||"").trim()||"Generali";$(t,a=>{let s=(a.sezioni||[]).find(d=>d.nome.trim()===o);s||(s={id:_(),nome:o,componenti:[]},a.sezioni=a.sezioni||[],a.sezioni.push(s)),s.componenti=s.componenti||[],s.componenti.push({id:_(),nome:e.nome,codice:e.codice||"",qtaBase:1,unitaMisura:e.unitaMisura||"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function qn(){L&&$(L,t=>{let i=(t.sezioni||[]).find(n=>n.nome==="Liberi");i||(i={id:_(),nome:"Liberi",componenti:[]},t.sezioni=t.sezioni||[],t.sezioni.push(i)),i.componenti=i.componenti||[],i.componenti.push({id:_(),nome:"Nuovo componente",codice:"",qtaBase:1,unitaMisura:"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function Bn(t,i,n,e,o){$(t,a=>{let s=(a.sezioni||[]).find(c=>c.id===i),d=s&&(s.componenti||[]).find(c=>c.id===n);d&&(e==="qtaBase"?(d.qtaBase=parseFloat(o)||1,d.regola&&(d.regola.qtyBase=d.qtaBase)):d[e]=o)},!0)}function Dn(t,i,n,e,o){$(t,a=>{let s=(a.sezioni||[]).find(c=>c.id===i),d=s&&(s.componenti||[]).find(c=>c.id===n);d&&(d.regola=d.regola||{},e==="tipo"?(d.regola.tipo=o,o==="gruppo"&&!d.regola.asseId&&a.assiConfigurazione?.length&&(d.regola.asseId=a.assiConfigurazione[0].id),o==="gruppo"&&(d.regola.opzioneIds=d.regola.opzioneIds||[])):e==="asseId"?(d.regola.asseId=o,d.regola.opzioneIds=[]):d.regola[e]=o)},!0)}function Tn(t,i,n){$(t,e=>{let o=(e.sezioni||[]).find(a=>a.id===i);o&&(o.componenti=(o.componenti||[]).filter(a=>a.id!==n))},!0)}function Pn(t){$(t,i=>{i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:_(),nome:"Nuovo gruppo",key:X("","ax"+i.assiConfigurazione.length),opzioni:[]})},!0)}function Ln(t,i){confirm("Eliminare questo gruppo elettronico?")&&$(t,n=>{n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)},!0)}function Kn(t,i,n,e){$(t,o=>{let a=(o.assiConfigurazione||[]).find(s=>s.id===i);a&&(a[n]=e)},!1)}function Rn(t,i){$(t,n=>{let e=(n.assiConfigurazione||[]).find(a=>a.id===i);if(!e)return;e.opzioni=e.opzioni||[];let o=e.opzioni.length+1;e.opzioni.push({id:_(),key:X("","opz"+o),nome:"Nuova opzione",codice:""})},!0)}function Hn(t,i,n){$(t,e=>{let o=(e.assiConfigurazione||[]).find(a=>a.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(a=>a.id!==n))},!0)}function jn(t,i,n,e,o){$(t,a=>{let s=(a.assiConfigurazione||[]).find(c=>c.id===i),d=s&&(s.opzioni||[]).find(c=>c.id===n);d&&(d[e]=o)},!1)}function Ri(){let t=document.getElementById("modal-kit-crea");if(!t)return;let i=document.getElementById("kit-crea-nome");i&&(i.value=""),t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>i&&i.focus(),80)}function Hi(){let t=document.getElementById("modal-kit-crea");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Qn(){let t=(document.getElementById("kit-crea-nome")?.value||"").trim();if(!t){y("Inserisci un nome per il kit","warning");return}let{kits:i}=h(),n={id:_(),nome:t,schemaVersion:Ft,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};i.push(n),A(i),Hi(),setTimeout(()=>q("kits"),320)}function Vn(t){gt.kitId=t;let i=document.getElementById("modal-kit-qadd-sez");if(!i)return;let n=document.getElementById("kit-qadd-sez-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function ji(){let t=document.getElementById("modal-kit-qadd-sez");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Un(){let t=(document.getElementById("kit-qadd-sez-nome")?.value||"").trim()||"Nuova sezione",{kits:i}=h(),n=i.find(e=>e.id===gt.kitId);n&&(n.sezioni=n.sezioni||[],n.sezioni.push({id:_(),nome:t,componenti:[]}),A(i),ji(),setTimeout(L?()=>F():()=>q("kits"),320))}function Fn(t,i){gt.kitId=t,gt.sezId=i;let n=document.getElementById("modal-kit-qadd-comp");if(!n)return;let e=W(),o=document.getElementById("kit-qadd-comp-source-cat"),a=document.getElementById("kit-qadd-comp-source-free");e.length?(o&&(o.checked=!0),Vt("cat")):(a&&(a.checked=!0),Vt("free"));let s=[...new Set(e.map(p=>p.categoria||"Senza categoria"))].sort(),d=document.getElementById("kit-qadd-comp-cat");d&&(d.innerHTML=s.map(p=>`<option value="${r(p)}">${r(p)}</option>`).join(""),Qi());let c=document.getElementById("kit-qadd-comp-qty");c&&(c.value="1");let l=document.getElementById("kit-qadd-comp-unit");l&&(l.value="pz");let m=document.getElementById("kit-qadd-comp-nome");m&&(m.value="");let u=document.getElementById("kit-qadd-comp-codice");u&&(u.value=""),n.style.display="flex",n.offsetHeight,n.classList.add("active")}function Vt(t){let i=document.getElementById("kit-qadd-comp-cat-section"),n=document.getElementById("kit-qadd-comp-free-section");i&&(i.style.display=t==="cat"?"":"none"),n&&(n.style.display=t==="free"?"":"none")}function Qi(){let t=document.getElementById("kit-qadd-comp-cat"),i=document.getElementById("kit-qadd-comp-comp");if(!t||!i)return;let n=t.value,o=W().filter(a=>(a.categoria||"Senza categoria")===n);i.innerHTML=o.length?o.map(a=>`<option value="${r(a.id)}">${r(a.nome)}${a.codice?" \xB7 "+r(a.codice):""}</option>`).join(""):'<option value="">Nessun componente in questa categoria</option>'}function Vi(){let t=document.getElementById("modal-kit-qadd-comp");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Jn(){let t=document.getElementById("kit-qadd-comp-source-cat")?.checked,i="",n="";if(t){let l=document.getElementById("kit-qadd-comp-comp")?.value;if(!l){y("Seleziona un componente dal catalogo","warning");return}let m=W().find(u=>u.id===l);if(!m){y("Componente non trovato nel catalogo","warning");return}i=m.nome,n=m.codice||""}else{if(i=(document.getElementById("kit-qadd-comp-nome")?.value||"").trim(),!i){y("Inserisci il nome del componente","warning");return}n=(document.getElementById("kit-qadd-comp-codice")?.value||"").trim()}let e=parseFloat(document.getElementById("kit-qadd-comp-qty")?.value)||1,o=document.getElementById("kit-qadd-comp-unit")?.value||"pz",{kits:a}=h(),s=a.find(c=>c.id===gt.kitId);if(!s)return;let d=(s.sezioni||[]).find(c=>c.id===gt.sezId);d&&(d.componenti=d.componenti||[],d.componenti.push({id:_(),nome:i,codice:n,qtaBase:e,qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:o,applicazioneTipo:"sempre"}),A(a),Vi(),setTimeout(L?()=>F():()=>q("kits"),320))}function Gn(t,i,n,e,o){let{kits:a}=h(),s=a.find(l=>l.id===t);if(!s)return;let d=(s.sezioni||[]).find(l=>l.id===i);if(!d)return;let c=(d.componenti||[]).find(l=>l.id===n);c&&(e==="qtaBase"?c.qtaBase=parseFloat(o)||0:c[e]=o,A(a))}function Wn(t,i,n){if(!n.trim())return;let{kits:e}=h(),o=e.find(s=>s.id===t);if(!o)return;let a=(o.sezioni||[]).find(s=>s.id===i);a&&(a.nome=n.trim(),A(e))}function Yn(t,i,n){let{kits:e}=h(),o=e.find(s=>s.id===t);if(!o)return;let a=(o.sezioni||[]).find(s=>s.id===i);a&&(a.componenti=(a.componenti||[]).filter(s=>s.id!==n),A(e),q("kits"))}function Zn(t,i){if(!confirm("Rimuovere questa sezione e tutti i suoi componenti?"))return;let{kits:n}=h(),e=n.find(o=>o.id===t);e&&(e.sezioni=(e.sezioni||[]).filter(o=>o.id!==i),A(n),q("kits"))}function Xn(t){if(!confirm("Eliminare questo kit? L'operazione non \xE8 reversibile."))return;let{kits:i}=h(),n=i.filter(e=>e.id!==t);A(n),q("kits")}function to(t){Ti={sourceKitId:t};let i=document.getElementById("modal-kit-duplicate");if(!i)return;let n=document.getElementById("kit-duplicate-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function Ui(){let t=document.getElementById("modal-kit-duplicate");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function io(){let{sourceKitId:t}=Ti||{};if(!t){y("Errore: kit sorgente non trovato","error");return}let{kits:i}=h(),n=i.find(a=>a.id===t);if(!n){y("Kit sorgente non trovato","warning");return}let e=(document.getElementById("kit-duplicate-nome")?.value||"").trim();if(!e){y("Inserisci un nome per il kit duplicato","warning");return}let o=eo(n);o.nome=e,i.push(o),A(i),Ui(),y(`Kit "${e}" creato da duplicazione \u2713`),setTimeout(()=>q("kits"),320)}function eo(t){let i={},n=o=>(i[o]||(i[o]=_()),i[o]),e=JSON.parse(JSON.stringify(t));return e.id=_(),Array.isArray(e.sezioni)&&(e.sezioni=e.sezioni.map(o=>{let a=JSON.parse(JSON.stringify(o));return a.id=_(),Array.isArray(a.componenti)&&(a.componenti=a.componenti.map(s=>{let d=JSON.parse(JSON.stringify(s));return d.id=_(),d})),a})),Array.isArray(e.assiConfigurazione)&&(e.assiConfigurazione=e.assiConfigurazione.map(o=>{let a=JSON.parse(JSON.stringify(o));return a.id=_(),Array.isArray(a.opzioni)&&(a.opzioni=a.opzioni.map(s=>{let d=JSON.parse(JSON.stringify(s));return d.id=_(),d})),a})),Array.isArray(e.varianti)&&(e.varianti=e.varianti.map(o=>{let a=JSON.parse(JSON.stringify(o));return a.id=_(),a})),Array.isArray(e.sottoAssembly)&&(e.sottoAssembly=e.sottoAssembly.map(o=>{let a=JSON.parse(JSON.stringify(o));return a.id=_(),a})),e.qtaDaProdurre={},e.pronti={},e.movimenti=[],e}function no(){Ri()}function Fi(t){L=t,Pi(t)}function Kt(t,i,n=""){let{kits:e}=h(),o=e.find(c=>c.id===t),a=e.find(c=>c.id!==t&&(c.sezioni||[]).length),s=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:a?.id||"",sectionId:n||(i==="copy"?s:a?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function Ji(t){S=Kt(t,"import"),tt(!0)}function oo(t){S=Kt(t,"import-asse"),tt(!0)}function ao(t,i){S=Kt(t,"copy",i),tt(!0)}function mt(){let t=document.getElementById("modal-kit-import");S=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function so(t){if(!S||t!=="import"&&t!=="copy"||S.mode===t)return;let i=S.currentKitId,n=t==="copy"?S.sectionId:"";S=Kt(i,t,n),tt()}function ro(t){S&&(S.search=String(t||""),tt())}function co(t){if(!S)return;let{kits:i}=h(),n=i.find(e=>e.id===t);S.sourceKitId=t,S.mode==="import-asse"?S.asseId=n?.assiConfigurazione?.[0]?.id||"":S.sectionId=n?.sezioni?.[0]?.id||"",tt()}function lo(t){S&&(S.mode==="import-asse"?S.asseId=t:S.sectionId=t,tt())}function po(t,i){if(!S||S.mode!=="copy")return;let n=new Set(S.targetKitIds||[]);i?n.add(t):n.delete(t),S.targetKitIds=[...n],tt()}function mo(){if(!S||S.mode!=="copy")return;let{kits:t}=h(),i=t.filter(e=>e.id!==S.currentKitId&&Nt(e.nome,S.search)),n=new Set(S.targetKitIds||[]);for(let e of i)n.add(e.id);S.targetKitIds=[...n],tt()}function uo(){!S||S.mode!=="copy"||(S.targetKitIds=[],tt())}function tt(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!S)return;let{kits:n}=h(),e=S,o=n.find(k=>k.id===e.currentKitId);if(!o){mt();return}let a=[];e.mode==="import"?a=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length):e.mode==="import-asse"?a=n.filter(k=>k.id!==o.id&&(k.assiConfigurazione||[]).length):a=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!a.some(k=>k.id===e.sourceKitId)&&(e.sourceKitId=a[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(k=>k!==o.id&&n.some(z=>z.id===k)));let s=n.find(k=>k.id===e.sourceKitId)||null,d=e.mode==="import-asse"?s?.assiConfigurazione||[]:s?.sezioni||[];e.mode==="import-asse"?d.some(k=>k.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(k=>k.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(s?.assiConfigurazione||[]).find(k=>k.id===e.asseId)||null:Gt(s,e.sectionId),l=a.filter(k=>Nt(k.nome,e.search)),m=n.filter(k=>k.id!==o.id&&Nt(k.nome,e.search)),u=document.getElementById("kit-import-subtitle"),p=document.getElementById("kit-import-search"),f=document.getElementById("kit-import-left-title"),w=document.getElementById("kit-import-right-title"),g=document.getElementById("kit-import-kit-list"),v=document.getElementById("kit-import-section-list"),C=document.getElementById("kit-import-target-wrap"),K=document.getElementById("kit-import-target-list"),j=document.getElementById("kit-import-preview"),Y=document.getElementById("kit-import-confirm-btn"),wt=document.getElementById("kit-import-mode-import"),lt=document.getElementById("kit-import-mode-copy");if(!u||!p||!f||!w||!g||!v||!C||!K||!j||!Y||!wt||!lt)return;wt.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),lt.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),p.value=e.search,e.mode==="import"?(u.textContent=`Importa una sezione esistente dentro "${o.nome}".`,p.placeholder="Cerca kit sorgente\u2026",f.textContent="Kit sorgente",w.textContent=s?`Sezioni di ${s.nome}`:"Sezione",C.style.display="none",g.innerHTML=l.length?l.map(k=>{let z=k.id===e.sourceKitId;return`<label class="kit-import-option ${z?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${z?"checked":""}
                           onchange="_kitCfgSelectImportSource('${r(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(u.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,p.placeholder="Cerca kit destinazione\u2026",f.textContent="Kit sorgente",w.textContent="Sezione da copiare",C.style.display="flex",g.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${r(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,K.innerHTML=m.length?m.map(k=>{let z=(e.targetKitIds||[]).includes(k.id),M=c?St(o,k):null,B=`${(k.sezioni||[]).length} sezioni`;return M&&(M.hasTargetVarianti?M.needsReview?B=`${M.exactMatches}/${M.targetCount} combinazioni allineate`:B=`${M.targetCount}/${M.targetCount} combinazioni allineate`:B="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${z?"kit-import-option--active":""}">
                    <input type="checkbox" ${z?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${r(k.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(k.nome)}</span>
                        <span class="kit-import-option-meta">${r(B)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),v.innerHTML=d.length?d.map(k=>{let z=e.mode==="import-asse"?k.id===e.asseId:k.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${z?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${z?"checked":""}
                           onchange="_kitCfgSelectImportSection('${r(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${z?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${z?"checked":""}
                       onchange="_kitCfgSelectImportSection('${r(k.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(k.nome)}</span>
                    <span class="kit-import-option-meta">${(k.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let Z=!1,b="kit-cfg-help kit-import-preview",I="";if(e.mode==="import"){if(!s)I="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)I="Seleziona una sezione da importare nel kit corrente.";else{let k=St(s,o);Z=!0,I=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 importata in <strong>${r(o.nome)}</strong>. `,k.hasTargetVarianti?k.needsReview?(b="kit-cfg-warn kit-import-preview",I+=`${k.exactMatches} combinazioni su ${k.targetCount} risultano allineate: controlla i coefficienti importati.`):I+=`Tutte le ${k.targetCount} combinazioni del kit destinazione risultano allineate.`:(b="kit-cfg-warn kit-import-preview",I+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}Y.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")s?c?(Z=!0,I=`L'asse <strong>${r(c.nome)}</strong> verr\xE0 importato in <strong>${r(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):I="Seleziona un asse da importare nel kit corrente.":I="Seleziona un kit sorgente per vedere gli assi disponibili.",Y.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let k=n.filter(z=>(e.targetKitIds||[]).includes(z.id));if(!c)I="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!k.length)I="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{Z=!0;let z=k.filter(M=>St(o,M).needsReview).length;I=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 copiata in <strong>${k.length}</strong> kit.`,z>0?(b="kit-cfg-warn kit-import-preview",I+=` <strong>${z}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):I+=" Le combinazioni risultano allineate su tutti i kit selezionati."}Y.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}j.className=b,j.innerHTML=I,Y.disabled=!Z,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let k=document.getElementById("kit-import-search");k&&k.focus()},40))}function fo(){if(!S)return;let{kits:t}=h(),i=S,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Gt(e,i.sectionId),a=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!a){y("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(u=>String(u.nome||"").trim().toLowerCase()===String(a.nome||"").trim().toLowerCase()),m=0;if(l){l.opzioni=l.opzioni||[];for(let u of a.opzioni||[]){let p=String(u.codice||"").trim().toLowerCase(),f=!1;if(p&&(f=l.opzioni.some(w=>String(w.codice||"").trim().toLowerCase()===p&&p!=="")),f||(f=l.opzioni.some(w=>String(w.nome||"").trim().toLowerCase()===String(u.nome||"").trim().toLowerCase())),!f){let w=(l.opzioni||[]).length+1;l.opzioni.push({id:_(),key:X(u?.key,"opz"+w),nome:String(u?.nome||"").trim()||"opz"+w,codice:String(u?.codice||"").trim()}),m+=1}}A(t),mt(),F(),m?y(`${m} opzione${m>1?"i":""} aggiunta${m>1?"e":""} all'asse "${a.nome}" \u2713`):y(`Nessuna nuova opzione trovata per l'asse "${a.nome}"`);return}n.assiConfigurazione.push(vi(a,e,n)),A(t),mt(),F(),y(`Asse "${a.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=St(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(Mt(o,e,n)),A(t),mt(),F();let m="";l.hasTargetVarianti?l.needsReview&&(m=" Controlla le quantit\xE0 sulle combinazioni non allineate."):m=" Definisci poi gli assi del kit per rifinire i coefficienti.",y(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${m}`);return}let s=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!s.length){y("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let d=0;for(let l of s)St(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(Mt(o,e,l));A(t),mt(),F();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xE0.`),y(`Sezione "${o.nome}" copiata in ${s.length} kit \u2713${c}`)}function go(t){let{kits:i}=h(),n=i.find(e=>e.id===t)||null;N={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},ht(!0)}function Gi(){let t=document.getElementById("modal-kit-presets");N=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ko(t){N&&(N.search=String(t||""),ht())}function vo(t){N&&(N.selectedPresetId=t,ht())}function yo(){if(!N)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){y("Inserisci il nome del preset \u26A0\uFE0F");return}let e=i?.value||"";Wi(N.currentKitId,e,n)}function Wi(t,i,n){let{kits:e}=h(),o=e.find(d=>d.id===t);if(!o){y("Kit non trovato \u26A0\uFE0F");return}let a=Gt(o,i);if(!a){y("Seleziona una sezione valida \u26A0\uFE0F");return}let s=vt();s.push({id:_(),nome:String(n||"").trim(),sourceKitId:o.id,sezione:JSON.parse(JSON.stringify(a))}),Xt(s),y("Preset salvato \u2713"),N&&N.currentKitId===t&&ht(),F()}function bo(t){if(!N)return;let i=vt(),n=t||N.selectedPresetId,e=i.find(d=>d.id===n);if(!e){y("Seleziona un preset \u26A0\uFE0F");return}let{kits:o}=h(),a=o.find(d=>d.id===N.currentKitId),s=o.find(d=>d.id===e.sourceKitId)||null;if(!a){y("Kit non trovato \u26A0\uFE0F");return}a.sezioni=a.sezioni||[],a.sezioni.push(Mt(e.sezione,s,a)),A(o),Gi(),F(),y(`Preset "${e.nome}" applicato \u2713`)}function ho(t,i){let n=vt(),e=n.find(o=>o.id===t);if(!e){y("Preset non trovato \u26A0\uFE0F");return}e.nome=String(i||"").trim()||e.nome,Xt(n),y("Nome aggiornato \u2713"),ht()}function wo(t){let i=vt().filter(n=>n.id!==t);Xt(i),N&&(N.selectedPresetId=""),ht(),y("Preset eliminato \u2713")}function ht(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!N)return;let n=vt(),e=N,o=h().kits.find(p=>p.id===e.currentKitId),a=n.filter(p=>Nt(p.nome,e.search)),s=document.getElementById("preset-list"),d=document.getElementById("preset-preview"),c=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),m=document.getElementById("preset-apply-btn");if(!s||!d||!c||!l||!m)return;s.innerHTML=a.length?a.map(p=>{let f=p.id===e.selectedPresetId;return`<label class="kit-import-option ${f?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${f?"checked":""} onchange="_kitSelectPreset('${r(p.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(p.nome)}</span>
                    <span class="kit-import-option-meta">${(p.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let u=n.find(p=>p.id===e.selectedPresetId)||null;if(u){let p=u.sourceKitId&&h().kits.find(f=>f.id===u.sourceKitId)?.nome||"";d.innerHTML=`<div style="padding:6px"><strong>${r(u.nome)}</strong><div style="color:#94a3b8">${r(p)}</div></div>`+(u.sezione?.componenti?.length?`<div>${u.sezione.componenti.map(f=>`<div class="kit-meta-pill">${r(f.nome)}${f.codice?" \xB7 "+r(f.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else d.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;m.disabled=!u,c.value="",l.innerHTML=(o?.sezioni||[]).map(p=>`<option value="${r(p.id)}">${r(p.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let p=document.getElementById("preset-search");p&&p.focus()},40))}function zo(){let{kits:t}=h(),i=t.find(b=>b.id===Di);if(!i){bt();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=E(i);rt==="sezioni"&&(rt="bom"),rt==="sa"&&(rt="bom");let a=["info","varianti","anagrafiche","bom"],s={info:"Prodotto",varianti:"Elettronica selezionabile",anagrafiche:"Anagrafiche",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((b,I)=>b+(I.componenti||[]).length,0),m=c?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-bolt"></i>
                <div><strong>${d}</strong> grupp${d===1?"o":"i"} elettronici e <strong>${c}</strong> configurazioni pronte da usare</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div>
                    ${o.slice(0,8).map(b=>`<span class="kit-cfg-sa-var-badge">${r(b.nome)}</span>`).join(" ")}
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
        </div>`,p=e.map((b,I)=>{let k=(b.opzioni||[]).map((z,M)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${r(z.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(b.id)}','${r(z.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${r(z.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(b.id)}','${r(z.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${r(i.id)}','${r(b.id)}','${r(z.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${I}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${r(b.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${r(i.id)}','${r(b.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${r(i.id)}','${r(b.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${k||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${r(i.id)}','${r(b.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),f=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xE0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(b=>`<span class="kit-cfg-sa-var-badge" title="${r(b.key)}">${r(b.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",w=`
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
            ${f}
        </div>`,g=(i.sezioni||[]).map((b,I)=>{let k=(b.componenti||[]).map(z=>{let M=H(z),B=Zt(z,i),di=(e||[]).find(O=>O.id===B.asseId)||null,Zi=B.tipo==="gruppo"&&di?`<div class="kit-cfg-row">${(di.opzioni||[]).map(O=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${B.opzioneIds.includes(O.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${r(i.id)}','${r(b.id)}','${r(z.id)}','${r(O.id)}',this.checked)">
                        ${r(O.nome)}
                    </label>`).join("")}</div>`:"",Xi=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(b.id)}','${r(z.id)}','asseId',this.value)">
                        ${e.map(O=>`<option value="${r(O.id)}" ${B.asseId===O.id?"selected":""}>${r(O.nome)}</option>`).join("")}
                   </select>`:"",te=B.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",li=M?"flag":xt(z.unitaMisura,"pz"),ie=M?[{value:"flag",label:"Solo avviso"}]:[...new Set([li,...re])].filter(Boolean).map(O=>({value:O,label:O}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${r(z.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(b.id)}','${r(z.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${r(z.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(b.id)}','${r(z.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(b.id)}','${r(z.id)}','modo','',this.value)">
                        <option value="quantificato" ${M?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${M?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${r(i.id)}','${r(b.id)}','${r(z.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${B.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(b.id)}','${r(z.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(b.id)}','${r(z.id)}','unitaMisura','',this.value)"
                            ${M?"disabled":""}>
                        ${ie.map(O=>`<option value="${r(O.value)}" ${li===O.value?"selected":""}>${r(O.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(b.id)}','${r(z.id)}','tipo',this.value)">
                        <option value="sempre" ${B.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${B.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${B.tipo==="gruppo"?Xi:""}
                </div>
                ${B.tipo==="gruppo"?Zi:""}
                <input class="kit-cfg-input" value="${r(z.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${r(i.id)}','${r(b.id)}','${r(z.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${M?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${te}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${I}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${r(b.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${r(i.id)}','${r(b.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${r(i.id)}','${r(b.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${r(i.id)}','${r(b.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${k}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${r(i.id)}','${r(b.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),v=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unit\xE0 corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${g}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${r(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,C="";o.length?C=o.map(b=>{let I=(i.sottoAssembly||[]).map((z,M)=>({sa:z,i:M})).filter(({sa:z})=>z.varianteKey===b.key),k=I.map(({sa:z,i:M})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${r(z.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${r(i.id)}',${M},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${r(i.id)}',${M})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${r(b.nome)}</span>
                    <span class="kit-cfg-sa-count">${I.length} part${I.length!==1?"i":"e"}</span>
                </div>
                ${k||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${r(i.id)}','${r(b.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${r(b.nome)}</button>
            </div>`}).join(""):C='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let K=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${C}
        </div>`,j={info:u,varianti:w,bom:v,sa:K},Y=vt(),lt=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${Y.length?Y.map(b=>`<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${r(b.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${r(b.sourceKitId&&h().kits.find(I=>I.id===b.sourceKitId)?.nome||"")}</div>
                </div>
                <div style="display:flex;gap:8px">
                    <button class="kit-cfg-add-btn" onclick="_kitApplyPreset('${r(b.id)}')">Applica</button>
                    <button class="kit-cfg-add-btn" onclick="(function(){const n=prompt('Nuovo nome preset', '${r(b.nome)}'); if(n) _kitRenamePreset('${r(b.id)}', n);})()">Rinomina</button>
                    <button class="kit-btn-danger" onclick="(function(){ if(confirm('Eliminare questo preset?')) _kitDeletePreset('${r(b.id)}') })()">Elimina</button>
                </div>
            </div>`).join(""):'<div class="kit-import-empty">Nessun preset salvato.</div>'}</div>
            <hr style="margin:12px 0">
            <div style="display:flex;gap:8px;align-items:center">
                <select id="preset-new-section-tab" class="kit-cfg-select" style="min-width:220px">
                    ${(i.sezioni||[]).map(b=>`<option value="${r(b.id)}">${r(b.nome)}</option>`).join("")}
                </select>
                <input id="preset-new-name-tab" class="kit-cfg-input" placeholder="Nome nuovo preset" style="flex:1">
                <button class="kit-cfg-add-btn" onclick="(function(){ const sec = document.getElementById('preset-new-section-tab')?.value || ''; const name = document.getElementById('preset-new-name-tab')?.value || ''; if(!name) { alert('Inserisci un nome'); return; } _kitCreatePreset('${r(i.id)}', sec, name); })()"><i class="fas fa-save"></i> Crea preset</button>
            </div>
        </div>`;j.anagrafiche=lt;let Z=a.map(b=>`<button class="kit-tab ${rt===b?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${b}')">${s[b]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${r(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${r(i.nome)}</span>
        </div>
        <div class="kit-tabs">${Z}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${j[rt]}</div>
    </div>`,zt(n)}function _o(t){if(t&&D===t){P();return}D=t,P()}function Co(t){rt=t,zo()}function $(t,i,n=!0){let{kits:e}=h(),o=e.find(a=>a.id===t);o&&(i(o),A(e),n&&F())}function So(t,i){$(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function $o(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=h();A(i.filter(n=>n.id!==t)),Di=null,D=null,bt()}function xo(t){let{kits:i}=h(),n=i.find(o=>o.id===t);if(!n)return;let e={id:_(),nome:`Copia di ${n.nome}`,schemaVersion:Ft,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(vi(o,n,e));e.varianti=fi(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(Mt(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:_(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),A(i),Fi(e.id),y(`Kit "${n.nome}" duplicato \u2713`)}function Yi(t){$(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:_(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:_(),key:"opz1",nome:"Opzione 1"}]})})}function Io(t,i,n,e){$(t,function(o){let a=(o.assiConfigurazione||[]).find(s=>s.id===i);a&&(n==="key"?a.key=X(e,a.key||"asse"):a[n]=e.trim())})}function Ao(t,i){$(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function Mo(t,i){$(t,function(n){let e=(n.assiConfigurazione||[]).find(a=>a.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:_(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function No(t,i,n,e,o){$(t,function(a){let s=(a.assiConfigurazione||[]).find(c=>c.id===i),d=s&&(s.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=X(o,d.key||"opzione"):d[e]=o.trim())})}function Oo(t,i,n){$(t,function(e){let o=(e.assiConfigurazione||[]).find(a=>a.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(a=>a.id!==n))})}function Eo(t){Yi(t)}function qo(t){$(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:_(),nome:"Nuova sezione",componenti:[]})})}function Bo(t){Ji(t)}function Do(t,i,n,e){$(t,function(o){let a=(o.sezioni||[]).find(s=>s.id===i);a&&(a[n]=e.trim())},!1)}function To(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&$(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function Po(t,i){$(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:_(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function Lo(t,i,n,e,o,a){$(t,function(s){let d=(s.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=it(a);return}if(e==="modo"){c.modoComponente=a==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":xt(a,"pz");return}c[e]=a.trim()}},e!=="nome"&&e!=="noteConfig")}function Ko(t,i,n,e,o){$(t,function(a){let s=(a.sezioni||[]).find(l=>l.id===i),d=s&&(s.componenti||[]).find(l=>l.id===n);if(!d)return;let c=Zt(d,a);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=a.assiConfigurazione?.[0]?.id||"";let l=(a.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=it(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(a.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Jt(d,a,c)})}function Ro(t,i,n,e,o){$(t,function(a){let s=(a.sezioni||[]).find(m=>m.id===i),d=s&&(s.componenti||[]).find(m=>m.id===n);if(!d)return;let c=Zt(d,a),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Jt(d,a,c)})}function Ho(t,i,n,e){$(t,function(o){let a=(o.sezioni||[]).find(d=>d.id===i),s=a&&(a.componenti||[]).find(d=>d.id===n);!s||H(s)||(s.tracciabile=!!e)},!1)}function jo(t,i,n){$(t,function(e){let o=(e.sezioni||[]).find(a=>a.id===i);o&&(o.componenti=(o.componenti||[]).filter(a=>a.id!==n))})}function Qo(t){$(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:_(),nome:"",varianteKey:E(i)[0]?.key||""})})}function Vo(t,i){$(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:_(),nome:"",varianteKey:i,noteConfig:""})})}function Uo(t,i,n,e){$(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function Fo(t,i){$(t,function(n){n.sottoAssembly.splice(i,1)})}function Jo(t){let i=document.getElementById("modal-kit-distinta-edit");if(!i){xi(t);return}let{kits:n}=h(),e=n.find(c=>c.id===t);if(!e)return;let o=ot(e),a=J(o),s=document.getElementById("distinta-edit-nome"),d=document.getElementById("distinta-edit-documento");s&&(s.value=a.documento||""),d&&(d.value=a.documento||""),i.dataset.kitId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>s&&s.focus(),80)}function Ut(){let t=document.getElementById("modal-kit-distinta-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Go(){let t=document.getElementById("modal-kit-distinta-edit");if(!t)return;let i=t.dataset.kitId,n=(document.getElementById("distinta-edit-nome")?.value||"").trim(),e=(document.getElementById("distinta-edit-documento")?.value||"").trim();if(!n){y("Inserisci un nome per la distinta.","warning");return}G(i,function(m){let u=J(m);e?u.documento=e:u.documento||(u.documento=n),At(m,u)});let{kits:o}=h(),a=o.find(m=>m.id===i);if(!a){Ut(),y("Kit non trovato \u26A0\uFE0F");return}let s=ot(a),d=Pt(a,s);if(!d.totalePezzi||!d.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}let c=at(),l={id:_(),kitId:a.id,kitNome:a.nome,nome:n||s._meta?.documento||`Distinta-${Date.now()}`,documento:e||s._meta?.documento||"",createdAt:Date.now(),createdBy:Q?.nome||"Sistema",orderDraftSnapshot:s,distintaSnapshot:d};c.unshift(l),It(c),Ut(),y("Distinta salvata \u2713"),T==="distinte"&&q("distinte")}function na(){window._kitOpenView=We,window._kitOpenConfig=Fi,window._kitNuovoKit=no,window._kitBack=Ye,window._kitOpenPrintPreview=Pe,window._kitSwitchTab=Ze,window._kitAggiornaQty=Xe,window._kitOrdineSet=tn,window._kitOrdineDelta=en,window._kitOrdineReset=nn,window._kitOrdineResetVoce=on,window._kitOrderSearch=an,window._kitOrderHideSearch=sn,window._kitOrderPick=rn,window._kitOrderRemoveRef=cn,window._kitComposeSelect=dn,window._kitComposeAdd=ln,window._kitAggiornaCar=Mi,window._kitAggiornaPronti=pn,window._kitSetPronti=mn,window._kitApriModalSped=bn,window._kitChiudiModalSped=qi,window._kitConfermaSpedizione=hn,window._kitApriModalReso=wn,window._kitChiudiModalReso=Bi,window._kitResoQtyChange=zn,window._kitResoAggiornaBOM=ci,window._kitConfermaReso=_n,window._kitSalvaMovimento=fn,window._kitEliminaMovimento=gn,window._kitModificaMovimento=vn,window._kitChiudiModalEditMov=Ei,window._kitConfermaModificaMov=yn,window._kitChiudiModalDelMov=Ni,window._kitConfermaEliminaMov=Oi,window._kitSalvaManuale=Cn,window._kitElimina=$o,window._kitDuplicaKit=xo,window._kitCfgBack=_o,window._kitCfgSwitchTab=Co,window._kitCfgSaveNome=So,window._kitCfgAddVar=Eo,window._kitCfgOpenImportModal=Ji,window._kitCfgOpenImportAsseModal=oo,window._kitCfgOpenCopySezModal=ao,window._kitCfgCloseImportModal=mt,window._kitCfgSetImportMode=so,window._kitCfgSetImportSearch=ro,window._kitCfgSelectImportSource=co,window._kitCfgSelectImportSection=lo,window._kitCfgToggleImportTarget=po,window._kitCfgSelectAllImportTargets=mo,window._kitCfgClearImportTargets=uo,window._kitCfgConfirmImport=fo,window._kitOpenPresetsModal=go,window._kitClosePresetsModal=Gi,window._kitSetPresetsSearch=ko,window._kitSelectPreset=vo,window._kitCreatePresetFromSection=yo,window._kitCreatePreset=Wi,window._kitApplyPreset=bo,window._kitRenamePreset=ho,window._kitDeletePreset=wo,window._kitCfgAddAsse=Yi,window._kitCfgUpdateAsse=Io,window._kitCfgDelAsse=Ao,window._kitCfgAddOpzione=Mo,window._kitCfgUpdateOpzione=No,window._kitCfgDelOpzione=Oo,window._kitCfgAddSez=qo,window._kitCfgImportSez=Bo,window._kitCfgUpdateSez=Do,window._kitCfgDelSez=To,window._kitCfgAddComp=Po,window._kitCfgUpdateComp=Lo,window._kitCfgUpdateCompRule=Ko,window._kitCfgToggleCompOption=Ro,window._kitCfgToggleCompTracked=Ho,window._kitCfgDelComp=jo,window._kitCfgAddSA=Qo,window._kitCfgAddSAForVariant=Vo,window._kitCfgUpdateSA=Uo,window._kitCfgDelSA=Fo,window._kitSwitchMainTab=q,window._kitRenderKitsGrid=Ci,window._kitRenderAnagrafichePage=Si,window._kitRenderDistintePage=$i,window._kitLoadDistinte=at,window._kitSaveDistinte=It,window._kitCreateDistintaFromDraft=xi,window._kitLoadAnagrafiche=W,window._kitSaveAnagrafiche=ri,window._kitOpenAnagraficaModal=Qe,window._kitCloseAnagraficaModal=Ii,window._kitConfirmSaveAnagrafica=Ve,window._kitDeleteAnagrafica=Ue,window._kitOpenCreaKit=Ri,window._kitCloseCreaKit=Hi,window._kitConfirmCreaKit=Qn,window._kitOpenConfigModal=Pi,window._kitCloseConfigModal=Sn,window._kitRenderConfigModal=F,window._kitCfgModalSaveNome=$n,window._kitCfgOpenCatalogPicker=In,window._kitCfgCloseCatalogPicker=Li,window._kitCfgSetCatalogPickerQuery=An,window._kitCfgSetCatalogPickerCategory=Mn,window._kitCfgAddAnagFromPicker=Nn,window._kitCfgModalAddAnag=Ki,window._kitCfgModalAddCompFree=qn,window._kitCfgModalUpdateSez=On,window._kitCfgModalDelSez=En,window._kitCfgModalUpdateComp=Bn,window._kitCfgModalUpdateCompRule=Dn,window._kitCfgModalDelComp=Tn,window._kitCfgModalAddAsse=Pn,window._kitCfgModalDelAsse=Ln,window._kitCfgModalUpdateAsse=Kn,window._kitCfgModalAddOpz=Rn,window._kitCfgModalDelOpz=Hn,window._kitCfgModalUpdateOpz=jn,window._kitQAddSezOpen=Vn,window._kitQAddSezClose=ji,window._kitQAddSezConfirm=Un,window._kitQAddCompOpen=Fn,window._kitQAddCompToggleSource=Vt,window._kitQAddCompChangeCategoria=Qi,window._kitQAddCompClose=Vi,window._kitQAddCompConfirm=Jn,window._kitQUpdateComp=Gn,window._kitQRenomeSez=Wn,window._kitQDelComp=Yn,window._kitQDelSez=Zn,window._kitQDelKit=Xn,window._kitOpenDuplicateModal=to,window._kitCloseDuplicateModal=Ui,window._kitConfirmDuplicate=io,window._kitRenderHeaderActions=ai,window._kitOpenSaveDistintaModal=Jo,window._kitCloseSaveDistintaModal=Ut,window._kitConfirmSaveDistinta=Go,window._kitDistintaOpenPrint=Fe,window._kitDistintaApplyToDraft=Je,window._kitDistintaDelete=Ge,window._kitNSToggleComp=_e,window._kitNSSetUnits=ze,window._kitNSOrderSearch=Ce,window._kitNSOrderHideSearch=Se,window._kitNSOrderPick=$e,window._kitNSOrderRemoveRef=xe,window._kitNSReset=Ae,window._kitNSToggleSection=bi,window._kitNSToggleSectionChk=Ie,window._kitNSCreateDistinta=Me,window._kitNSOpenPrintPreview=Ne}var Ft,re,x,jt,et,_t,Qt,Ht,T,Ct,ut,D,Ai,Di,rt,S,N,gt,L,U,Ti,oa,Wo=ee(()=>{ne();ae();se();oe();Ft=2,re=["pz","mt","cm","mm","kg","g","lt","ml"];x=$t({});jt=!1,et=[],_t=null,Qt=!1,Ht={},T="kits";Ct={};ut=null;typeof window<"u"&&window.addEventListener("beforeunload",function(){Le()});D=null,Ai="ordine";Di=null,rt="info",S=null,N=null,gt={kitId:null,sezId:null},L=null,U={kitId:null,query:"",categoria:""},Ti={sourceKitId:null};oa=bt});Wo();export{bt as caricaKitProdotti,oa as default,na as registerGlobals,ea as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-XG6E55BZ.js.map
