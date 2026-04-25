import{a as oi,c as mt,e as si,f as r,g as A,h as X,l as ai,m as Q,q as ri,r as ft,u as ci}from"./chunk-chunk-MVGUZ3SY.js";function Ye(){gt=!1}function ot(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function H(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function G(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function ut(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function li(t,i){let n="opz"+(i+1),e=ot(t?.key,n);return{id:String(t?.id||I()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function pi(t,i){let n="asse"+(i+1),e=ot(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,a)=>li(s,a)).filter(Boolean):[];return{id:String(t?.id||I()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function Tt(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function ui(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function mi(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let a of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:a.id,opzioneKey:a.key,opzioneNome:a.nome,opzioneCodice:String(a.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:Tt(e.selections),nome:ui(e.selections),selections:e.selections}})}function fi(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||I()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:ut(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:H(t?.qtaBase)}}function gi(t){return{id:String(t?.id||I()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(fi):[]}}function ki(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function Bt(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:H(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||H(Object.values(t?.qtaPerVariante||{})[0])};let e=S(i);if(!e.length)return n;let o=e.filter(c=>E(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>E(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>E(t,c.key)))};let a=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:a};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let u of c.opzioni||[]){let k=new Set(e.filter(b=>(b.selections||[]).some(m=>m.asseId===c.id&&m.opzioneId===u.id)).map(b=>b.key));if(!k.size)continue;[...k].every(b=>E(t,b)===a)&&l.push(u.id)}if(!l.length)continue;let p=new Set(e.filter(u=>(u.selections||[]).some(k=>k.asseId===c.id&&l.includes(k.opzioneId))).map(u=>u.key));if(ki(p,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:a}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:a}}function bt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=H(n.qtyBase);if(!o)return e;for(let s of S(i)){let a=n.tipo==="sempre";n.tipo==="gruppo"&&(a=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),a&&(e[s.key]=o)}return e}function vi(t,i){let n=gi(t);return n.componenti=n.componenti.map(function(e){let o=Bt(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:bt(e,i,o)}}),n}function bi(t,i){let n=S(i);if(!n.length)return null;let e=null;for(let o of n){let s=E(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function yi(t,i,n){let e=S(n),o={},s=bi(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let a of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},a.key)?E(t,a.key):s!==null?s:0;c>0&&(o[a.key]=c)}return{id:I(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:yt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:ut(t?.unitaMisura,N(t)?"flag":"pz")}}function Mt(t,i,n){return{id:I(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>yi(e,i,n)):[]}}function Kt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function et(t,i){let n=new Set(S(t).map(s=>s.key)),e=S(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function kt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function hi(t,i){return{id:String(t?.id||I()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function Lt(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(u,k){let g="v"+(k+1),b=ot(u?.key,g);return{id:String(u?.id||I()),key:b,nome:String(u?.nome||b).trim()||b}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((u,k)=>pi(u,k)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(u){return{id:u.id,key:u.key,nome:u.nome}})}]:[],s=mi(o),a=s.length?s:n,d=new Set(a.map(u=>u.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(u){d.has(u[0])&&(c[u[0]]=Math.max(0,Number.parseInt(u[1],10)||0))});for(let u of a)c[u.key]===void 0&&(c[u.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(u=>hi(u,a[0]?.key||"")).filter(u=>!u.varianteKey||d.has(u.varianteKey)):[],p={};return Object.entries(i.pronti||{}).forEach(function(u){p[u[0]]=Math.max(0,Number.parseInt(u[1],10)||0)}),{id:String(i.id||I()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Nt,assiConfigurazione:o,varianti:a,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(u=>vi(u,{assiConfigurazione:o,varianti:a})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:p,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function S(t){return Array.isArray(t?.varianti)?t.varianti:[]}function N(t){return!!t&&t.modoComponente==="segnalazione"}function yt(t){return!!t&&t.tracciabile!==!1&&!N(t)}function E(t,i){let n=H(t?.qtaPerVariante?.[i]);return N(t)?n>0?1:0:n}function ht(t,i){return Bt(t,i)}function Rt(){try{let t=localStorage.getItem(Et),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function zi(t){try{localStorage.setItem(Et,JSON.stringify(t||{}))}catch{}}function J(t){return String(t||"").trim().toUpperCase()}function st(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(J).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function Y(t){return st(t?._meta||{})}function zt(t,i){return t._meta=st(i),t._meta}function j(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function Pt(){let t=1;try{t=(Number.parseInt(localStorage.getItem(At),10)||0)+1,localStorage.setItem(At,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function wi(t){let i=Y(t);return i.documento||(i.documento=Pt(),zt(t,i)),i.documento}function Ot(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:J(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function Dt(){return V.length?Promise.resolve(V):Array.isArray(window._attiviProd)&&window._attiviProd.length?(V=Ot(window._attiviProd),Promise.resolve(V)):tt||(tt=fetch(mt,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(V=Ot(t),V)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){tt=null}),tt)}function Ci(t){let i=J(t);return i&&V.find(n=>n.ordine===i)||null}function Vt(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=J(e);return o?i[o]?String(i[o]||"").trim():String(Ci(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function dt(t){let i=Rt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of S(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=st(n._meta||{}),e}function R(t,i){let{kits:n}=w(),e=n.find(p=>p.id===t);if(!e)return;let o=Rt(),s=dt(e);try{console.debug("[kit-prodotti] _kitMutateOrderDraft START",{kitId:t,currentDraft:JSON.parse(JSON.stringify(s||{}))})}catch{}i(s,e);let a={},d=!1;for(let p of S(e)){let u=Math.max(0,Number.parseInt(s[p.key],10)||0);a[p.key]=u,u>0&&(d=!0)}let c=st(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(c.documento||(c.documento=Pt()),a._meta=c);try{console.debug("[kit-prodotti] _kitMutateOrderDraft END",{kitId:t,cleanedDraft:a})}catch{}d||l?o[t]=a:delete o[t],zi(o),M===t&&K()}function $i(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function wt(t){let i=it[t.id]&&typeof it[t.id]=="object"?it[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return it[t.id]=n,n}function Ht(t,i){let n=t.assiConfigurazione||[];if(!n.length)return S(t)[0]||null;let e=[];for(let s of n){let a=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===a);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=Tt(e);return S(t).find(s=>s.key===o)||null}function _i(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function Si(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let a of s.componenti||[])if(!N(a)&&!(E(a,i.key)<=0)&&a.applicazioneTipo==="gruppo"&&String(a.applicazioneAsseId||"")===e&&Array.isArray(a.applicazioneOpzioneIds)&&a.applicazioneOpzioneIds.includes(o))return!0;return!1}function Ii(t,i,n){let e=[],o=new Map;for(let s of i){let a=j(n,s.key);if(a)for(let d of s.selections||[]){if(Si(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=a;continue}let p={id:"sel-"+c,nome:_i(d),codice:String(d?.opzioneCodice||"").trim(),totale:a,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,p),e.push(p)}}return e}function jt(t,i){let n=S(t).filter(a=>j(i,a.key)>0),e=[],o=[],s=Ii(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let a of t.sezioni||[]){let d=[];for(let c of a.componenti||[]){let l=0,p=[];for(let k of n){let g=j(i,k.key),b=E(c,k.key);!g||!b||(N(c)?l+=g:l+=g*b,p.push({nome:k.nome,pezziOrdine:g,coeff:b}))}if(!p.length)continue;let u=p.length===1?p[0].nome:p.length+" configurazioni";if(N(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:u});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:u})}d.length&&e.push({id:a.id,nome:a.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:$i(i),totaleRighe:e.reduce((a,d)=>a+d.righe.length,0)}}function xi(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function Ai(){return String(window._distintaHeaderAzienda||"").trim()}function Mi(t,i,n){let e=new Date,o=Y(n),s=Ai(),a=String(o.documento||"").trim(),d=s?s.split(/\r?\n/).map(g=>`<div>${r(g)}</div>`).join(""):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),p=i.selectedVarianti.length?i.selectedVarianti.map(g=>{let b=j(n,g.key);return`<tr>
                <td>${r(G(b))}</td>
                <td>${r(g.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',u=i.sezioni.map(g=>{let b=g.righe.map(m=>{let z=[m.dettaglio,m.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${r(String(m.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${r(m.nome)}</div></td>
                <td class="db-print-cell-unit">${r(m.unita)}</td>
                <td class="db-print-cell-qty">${r(G(m.totale))}</td>
                <td class="db-print-cell-note">${z?r(z):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${r(g.nome)}</td></tr>${b}`}).join(""),k=i.avvisi.length?i.avvisi.map(g=>`<div class="db-print-alert ${g.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${r(g.nome)}</div>
                <div>${r(g.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${r(G(g.totaleCoinvolto))} pz \xB7 ${r(g.variantiLabel)}</div>
            </div>`).join(""):'<div class="db-print-empty">Nessun avviso operativo collegato a questa distinta.</div>';return`<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distinta base - ${r(t.nome)}</title>
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
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Prodotto</div><div class="db-print-meta-value">${r(t.nome)}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Riferimento</div><div class="db-print-meta-value">${r(o.cliente||"")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${r(xi(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${r(Q?.nome||"Sistema")}</div></div>
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

            <div class="db-print-config-title">Configurazioni incluse nell'ordine</div>
            <table class="db-print-config-table">
                <thead>
                    <tr>
                        <th style="width:72px">Q.t\xE0</th>
                        <th>Configurazione</th>
                    </tr>
                </thead>
                <tbody>${p}</tbody>
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
                <tbody>${u}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${k}</div>
        </div>
    </div>
</body>
</html>`}function Oi(t){let{kits:i}=w(),n=i.find(a=>a.id===t);if(!n)return;let e=dt(n),o=jt(n,e);if(!o.totalePezzi||!o.totaleRighe){A("Componi prima un ordine per generare la distinta stampabile.","warning");return}Y(e).documento||(R(t,function(a){wi(a)}),e=dt(n));let s=window.open("","_blank");if(!s){A("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(Mi(n,o,e)),s.document.close(),s.focus()}function w(){try{let t=localStorage.getItem(vt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(Lt):[]}}catch{return{kits:[]}}}function O(t){let i=Array.isArray(t)?t.map(Lt):[];try{localStorage.setItem(vt,JSON.stringify({kits:i})),localStorage.setItem(ct,Date.now())}catch{}qi(i)}function qi(t){clearTimeout(qt),qt=setTimeout(function(){ft({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function Ei(t){fetch(mt,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(ct)||0);if(n>0&&n>e){try{localStorage.setItem(vt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(ct,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function I(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function Ct(){if(!Q||!Q.nome)return!1;let t=String(Q.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||Q.ruolo==="MASTER"}function Ni(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(N(e)){i[e.id]=0;continue}let o=0;for(let[s,a]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(a,10)||0)*E(e,s);i[e.id]=o}return i}function Ti(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let a of s.componenti||[]){if(N(a))continue;let d=E(a,o);d>0&&(i[a.id]=(i[a.id]||0)+e*d)}}return i}function Ut(t,i){let n=S(t).find(e=>e.key===i);return n?r(n.nome):r(i)}function $t(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function W(){gt||(gt=!0,Ei(function(e){e&&W()}));let{kits:t}=w(),i=document.getElementById("contenitore-dati"),n=t.map(e=>{let s=S(e).length,a=(e.assiConfigurazione||[]).length,d=(e.sezioni||[]).reduce((c,l)=>c+(l.componenti||[]).length,0);return`
        <div class="kit-card" onclick="_kitOpenView('${r(e.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${r(e.nome)}</span>
                <button type="button" class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${r(e.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
            </div>
            <div class="kit-card-meta">
                <span class="kit-meta-pill"><i class="fas fa-sliders"></i> ${a} ass${a===1?"e":"i"}</span>
                <span class="kit-meta-pill"><i class="fas fa-layer-group"></i> ${s} configuraz.${s===1?"ione":"ioni"}</span>
                <span class="kit-meta-pill"><i class="fas fa-list"></i> ${d} voci BOM</span>
            </div>
        </div>`}).join("");i.innerHTML=`
    <div class="kit-page">
        <div class="kit-page-header">
            <div class="kit-page-title"><i class="fas fa-boxes-stacked"></i> Kit Prodotti</div>
            <button type="button" class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>
        </div>
        ${t.length===0?`<div class="kit-empty-state">
                <i class="fas fa-box-open kit-empty-icon"></i>
                <p>Nessun kit configurato.</p>
                <button type="button" class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
               </div>`:`<div class="kit-grid">${n}</div>`}
    </div>`;try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else X(i)}catch{X(i)}}function Bi(t){M=t,Ft="ordine",K()}function K(){let{kits:t}=w(),i=t.find(m=>m.id===M);if(!i){W();return}let n=document.getElementById("contenitore-dati"),e=S(i),o=dt(i),s=Y(o),a=jt(i,o),d=a.selectedVarianti.length?a.selectedVarianti.map(m=>`<span class="kit-meta-pill"><strong>${j(o,m.key)}</strong> \xD7 ${r(m.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=s.ordiniCliente.length?s.ordiniCliente.map(m=>`<span class="kit-order-ref-chip">${r(m)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(m)})' aria-label="Rimuovi ordine ${r(m)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=wt(i),p=Ht(i,l),u=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(m=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${r(m.nome)}</div>
                <div class="kit-compose-options">${(m.opzioni||[]).map(z=>`
                        <button type="button" class="kit-compose-option ${l[m.id]===z.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${r(i.id)}','${r(m.id)}','${r(z.id)}')">
                        ${r(z.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',k=a.selectedVarianti.length?a.selectedVarianti.map(m=>{let z=j(o,m.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${r(m.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(m.selections)&&m.selections.length?m.selections.map(T=>r(T.opzioneNome)).join(" \xB7 "):r(m.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${r(i.id)}','${r(m.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${z}"
                           onchange="_kitOrdineSet('${r(i.id)}','${r(m.key)}',this.value)"
                           oninput="_kitOrdineSet('${r(i.id)}','${r(m.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${r(i.id)}','${r(m.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${r(i.id)}','${r(m.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,g=a.totalePezzi?a.sezioni.map(m=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${r(m.nome)}</div>
                ${m.righe.map(z=>`
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
        </div>`,b=a.avvisi.length?a.avvisi.map(m=>`
            <div class="kit-distinta-alert ${m.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${r(m.nome)}</div>
                <div class="kit-distinta-alert-body">${r(m.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${m.totaleCoinvolto} pz \xB7 ${r(m.variantiLabel)}</div>
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
                            <div class="kit-compose-selected-name">${p?r(p.nome):"Completa prima tutte le scelte"}</div>
                        </div>
                        <div class="kit-order-stepper">
                            <input class="kit-order-stepper-input" id="kit-compose-qty-${r(i.id)}" type="number" min="1" value="1">
                            <button type="button" class="kit-spedisci-btn" onclick="_kitComposeAdd('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
                        </div>
                    </div>
                </div>
                <div class="kit-order-lines">${k}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${a.totaleRighe} righe materiali \xB7 ${a.avvisi.length} avvisi</div>
                ${g}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${b}
            </section>
        </div>
    </div>`,X(n),Dt().catch(()=>{})}function Ki(){M=null,W()}function Li(t){Ft=t,K()}function Ri(t){R(t,function(i,n){for(let e of S(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Pi(t,i,n){try{window._kitSuppressNextFade=!0}catch{}R(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function Di(t,i,n){try{window._kitSuppressNextFade=!0}catch{}R(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function Vi(t){R(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=st({})})}function Hi(t,i){R(t,function(n){n[i]=0})}function lt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${r(e.ordine)}</span>
            <span class="ac-cliente">${r(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function ji(t,i){let n=String(i||"").trim().toLowerCase();if(!n){lt(t,[]);return}Dt().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);lt(t,o)})}function Ui(t){setTimeout(function(){lt(t,[])},140)}function Fi(t,i,n){let e=J(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}R(t,function(s){let a=Y(s);a.ordiniCliente=[...new Set(a.ordiniCliente.concat(e))],a.cliente=Vt(a.ordiniCliente,{[e]:n}),zt(s,a)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),lt(t,[])}function Qi(t,i){let n=J(i);try{window._kitSuppressNextFade=!0}catch{}R(t,function(e){let o=Y(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=Vt(o.ordiniCliente),zt(e,o)})}function Gi(t,i,n){let{kits:e}=w(),o=e.find(a=>a.id===t);if(!o)return;let s=wt(o);if(s[i]=n,it[t]=s,M===t){try{window._kitSuppressNextFade=!0}catch{}K()}}function Ji(t){let{kits:i}=w(),n=i.find(a=>a.id===t);if(!n)return;try{console.debug("[kit-prodotti] _kitComposeAdd CLICK",{kitId:t,time:new Date().toISOString()})}catch{}let e=Ht(n,wt(n));if(!e){A("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);try{console.debug("[kit-prodotti] _kitComposeAdd variant/qty",{kitId:t,variantKey:e?.key||null,qty:o})}catch{}if(!o){A("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(rt[t]){try{console.debug("[kit-prodotti] _kitComposeAdd SKIPPED duplicate",{kitId:t,variantKey:e?.key||null,qty:o,since:Date.now()-rt[t]})}catch{}return}rt[t]=Date.now(),setTimeout(function(){try{delete rt[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}R(t,function(a){a[e.key]=j(a,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function Qt(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=w(),s=o.find(z=>z.id===M);if(!s)return;let a=(s.sezioni||[]).find(z=>z.id===n),d=a&&(a.componenti||[]).find(z=>z.id===i);if(!d||!yt(d))return;d.caricato=e,O(o);let l=Ni(s)[i]||0,p=Math.max(0,l-e),k=Ti(s)[i]||0,g=t.closest("tr");if(!g)return;let b=g.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");b&&(b.textContent=l===0?"\u2014":p,b.className=l===0?"kit-ord-zero":p>0?"kit-ord-manca":"kit-ord-ok");let m=g.querySelector(".kit-car-liberi");m&&(k>0?(m.textContent=Math.max(0,e-k)+" lib.",m.style.display=""):m.style.display="none")}function Yi(t,i,n){let{kits:e}=w(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),O(e),M===t&&K())}function Wi(t,i,n){let{kits:e}=w(),o=e.find(a=>a.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),O(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function Zi(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${r(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${r(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let a=(e.righe||[]).reduce((l,p)=>l+p.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${r(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${r(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${a} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${r(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${c}<div class="kit-sped-bom-divider">componenti scaricati</div>${d}</div>
            </details>`}if(e.tipo==="reso"){let a=e.totPz||0,d=(e.items||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${r(p.nome)}</span><span class="kit-mov-qty carico">\xD7${p.qty}</span></div>`).join(""),c=(e.righe||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${r(p.mat)}</span><span class="kit-mov-qty carico">+${p.qty}</span></div>`).join(""),l=(e.scartate||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${r(p.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${p.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
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
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function Xi(t,i){let{kits:n}=w(),e=n.find(m=>m.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),a=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),p=(a?.value||"").trim(),u=(e.sezioni||[]).find(m=>m.id===c),k=u&&(u.componenti||[]).find(m=>m.id===d);if(!k||!yt(k))return;i==="carico"?k.caricato=(parseInt(k.caricato)||0)+l:k.caricato=Math.max(0,(parseInt(k.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:p,mat:k.nome,ts:$t()}),O(n),s&&(s.value=1),a&&(a.value="");let g=document.getElementById("kit-mov-list-"+t);g&&(g.innerHTML=Zi(e,Ct()));let b=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);b&&(b.value=k.caricato,Qt(b))}function te(t,i){if(!Ct())return;let{kits:n}=w(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&ie(t,i,o)}function ie(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${r(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${r(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let a=document.getElementById("btn-kit-del-ok");a&&(a.onclick=()=>Jt(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Gt(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Jt(t,i){Gt();let{kits:n}=w(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(a=>a.id===o.sid);for(let a of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===a.cid||l.nome===a.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+a.qty)}for(let a of o.items||[])a.saId&&e.pronti&&(e.pronti[a.saId]=(parseInt(e.pronti[a.saId])||0)+a.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let a of e.sezioni||[]){let d=(a.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(d=>d.id===o.cid);a&&(a.caricato=Math.max(0,(parseInt(a.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(d=>d.id===o.cid);a&&(a.caricato=(parseInt(a.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),O(n),M===t&&K(),A("Movimento eliminato \u2713")}}function ee(t,i){if(!Ct())return;let{kits:n}=w(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let a=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");a&&(a.innerHTML=`<span class="kit-mov-badge ${r(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${r(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function Yt(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ne(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);Yt();let{kits:e}=w(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let a=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){A("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==a.qty){let l=d-a.qty;for(let p of o.sezioni||[]){let u=(p.componenti||[]).find(k=>k.id===a.cid);if(u){a.tipo==="carico"?u.caricato=Math.max(0,(parseInt(u.caricato)||0)+l):u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l);break}}}o.movimenti[s]={...a,qty:d,nota:c},O(e),M===i&&K(),A("Movimento aggiornato \u2713")}function oe(t){let{kits:i}=w(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){A("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,p=Ut(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${r(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${r(c.nome)} <span class="kit-sped-var-pill">${p}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let a=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&a&&(d.value=a.value||""),d&&!a&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function Wt(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function se(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;Wt();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=w(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),a=[],d=[];for(let l of n){let p=(o.sottoAssembly||[]).find(k=>k.id===l);if(!p)continue;let u=Number.parseInt(o.pronti?.[l],10)||0;if(u){a.push({saId:l,nome:p.nome,qty:u});for(let k of o.sezioni||[])for(let g of k.componenti||[]){if(N(g))continue;let b=E(g,p.varianteKey);if(!b)continue;let m=u*b;g.caricato=Math.max(0,(parseInt(g.caricato)||0)-m);let z=d.find(T=>T.cid===g.id);z?z.qty+=m:d.push({cid:g.id,mat:g.nome,qty:m})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:a,righe:d,nota:s,ts:$t()}),O(e);let c=a.reduce((l,p)=>l+p.qty,0);A(`Spedizione registrata: ${c} pz \u2713`),M===i&&K()}function ae(t){let{kits:i}=w(),n=i.find(a=>a.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let a=n.sottoAssembly||[];o.innerHTML=a.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':a.map(d=>{let c=Ut(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${r(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${r(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${r(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),_t(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Zt(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function re(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&_t(e.dataset.kitId)}function _t(t){let{kits:i}=w(),n=i.find(a=>a.id===t);if(!n)return;let e={};for(let a of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+a.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let p of l.componenti||[]){if(N(p))continue;let u=E(p,a.varianteKey);u&&(e[p.id]={mat:p.nome,qty:(e[p.id]?.qty||0)+c*u})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,a])=>a.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([a,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${r(a)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${r(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function ce(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=w(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let p=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;p>0&&o.push({saId:l.id,nome:l.nome,qty:p})}if(!o.length){A("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],a=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let p=l.dataset.cid,u=Number.parseInt(l.dataset.qty,10),k=[...e.sezioni||[]].flatMap(g=>g.componenti||[]).find(g=>g.id===p)?.nome||"?";l.checked?s.push({cid:p,mat:k,qty:u}):a.push({cid:p,mat:k,qty:u})});for(let l of s)for(let p of e.sezioni||[]){let u=(p.componenti||[]).find(k=>k.id===l.cid);if(u){u.caricato=(parseInt(u.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,p)=>l+p.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:a,nota:d,ts:$t(),totPz:c}),O(n),Zt(),A(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),M===i&&K()}function de(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=w();ft({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(ct,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function le(){let{kits:t}=w(),i={id:I(),nome:"Nuovo Kit",schemaVersion:Nt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};t.push(i),O(t),Xt(i.id)}function Xt(t){St=t,D="info",nt()}function It(t,i,n=""){let{kits:e}=w(),o=e.find(d=>d.id===t),s=e.find(d=>d.id!==t&&(d.sezioni||[]).length),a=o?.sezioni?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?a:s?.sezioni?.[0]?.id||""),targetKitIds:[]}}function ti(t){h=It(t,"import"),P(!0)}function pe(t,i){h=It(t,"copy",i),P(!0)}function pt(){let t=document.getElementById("modal-kit-import");h=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ue(t){if(!h||t!=="import"&&t!=="copy"||h.mode===t)return;let i=h.currentKitId,n=t==="copy"?h.sectionId:"";h=It(i,t,n),P()}function me(t){h&&(h.search=String(t||""),P())}function fe(t){if(!h)return;let{kits:i}=w(),n=i.find(e=>e.id===t);h.sourceKitId=t,h.sectionId=n?.sezioni?.[0]?.id||"",P()}function ge(t){h&&(h.sectionId=t,P())}function ke(t,i){if(!h||h.mode!=="copy")return;let n=new Set(h.targetKitIds||[]);i?n.add(t):n.delete(t),h.targetKitIds=[...n],P()}function ve(){if(!h||h.mode!=="copy")return;let{kits:t}=w(),i=t.filter(e=>e.id!==h.currentKitId&&kt(e.nome,h.search)),n=new Set(h.targetKitIds||[]);for(let e of i)n.add(e.id);h.targetKitIds=[...n],P()}function be(){!h||h.mode!=="copy"||(h.targetKitIds=[],P())}function P(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!h)return;let{kits:n}=w(),e=h,o=n.find(f=>f.id===e.currentKitId);if(!o){pt();return}let s=n.filter(f=>f.id!==o.id&&(f.sezioni||[]).length);e.mode==="import"&&!s.some(f=>f.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(f=>f!==o.id&&n.some(_=>_.id===f)));let a=n.find(f=>f.id===e.sourceKitId)||null,d=a?.sezioni||[];d.some(f=>f.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=Kt(a,e.sectionId),l=s.filter(f=>kt(f.nome,e.search)),p=n.filter(f=>f.id!==o.id&&kt(f.nome,e.search)),u=document.getElementById("kit-import-subtitle"),k=document.getElementById("kit-import-search"),g=document.getElementById("kit-import-left-title"),b=document.getElementById("kit-import-right-title"),m=document.getElementById("kit-import-kit-list"),z=document.getElementById("kit-import-section-list"),T=document.getElementById("kit-import-target-wrap"),at=document.getElementById("kit-import-target-list"),Z=document.getElementById("kit-import-preview"),U=document.getElementById("kit-import-confirm-btn"),v=document.getElementById("kit-import-mode-import"),q=document.getElementById("kit-import-mode-copy");if(!u||!k||!g||!b||!m||!z||!T||!at||!Z||!U||!v||!q)return;v.classList.toggle("kit-import-mode-btn--active",e.mode==="import"),q.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),k.value=e.search,e.mode==="import"?(u.textContent=`Importa una sezione esistente dentro "${o.nome}".`,k.placeholder="Cerca kit sorgente\u2026",g.textContent="Kit sorgente",b.textContent=a?`Sezioni di ${a.nome}`:"Sezione",T.style.display="none",m.innerHTML=l.length?l.map(f=>{let _=f.id===e.sourceKitId;return`<label class="kit-import-option ${_?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${_?"checked":""}
                           onchange="_kitCfgSelectImportSource('${r(f.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(f.nome)}</span>
                        <span class="kit-import-option-meta">${(f.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(u.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,k.placeholder="Cerca kit destinazione\u2026",g.textContent="Kit sorgente",b.textContent="Sezione da copiare",T.style.display="flex",m.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${r(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,at.innerHTML=p.length?p.map(f=>{let _=(e.targetKitIds||[]).includes(f.id),B=c?et(o,f):null,F=`${(f.sezioni||[]).length} sezioni`;return B&&(B.hasTargetVarianti?B.needsReview?F=`${B.exactMatches}/${B.targetCount} combinazioni allineate`:F=`${B.targetCount}/${B.targetCount} combinazioni allineate`:F="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${_?"kit-import-option--active":""}">
                    <input type="checkbox" ${_?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${r(f.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(f.nome)}</span>
                        <span class="kit-import-option-meta">${r(F)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),z.innerHTML=d.length?d.map(f=>{let _=f.id===e.sectionId;return`<label class="kit-import-option ${_?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${_?"checked":""}
                       onchange="_kitCfgSelectImportSection('${r(f.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(f.nome)}</span>
                    <span class="kit-import-option-meta">${(f.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessuna sezione disponibile.</div>';let L=!1,y="kit-cfg-help kit-import-preview",C="";if(e.mode==="import"){if(!a)C="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)C="Seleziona una sezione da importare nel kit corrente.";else{let f=et(a,o);L=!0,C=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 importata in <strong>${r(o.nome)}</strong>. `,f.hasTargetVarianti?f.needsReview?(y="kit-cfg-warn kit-import-preview",C+=`${f.exactMatches} combinazioni su ${f.targetCount} risultano allineate: controlla i coefficienti importati.`):C+=`Tutte le ${f.targetCount} combinazioni del kit destinazione risultano allineate.`:(y="kit-cfg-warn kit-import-preview",C+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}U.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else{let f=n.filter(_=>(e.targetKitIds||[]).includes(_.id));if(!c)C="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!f.length)C="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{L=!0;let _=f.filter(B=>et(o,B).needsReview).length;C=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 copiata in <strong>${f.length}</strong> kit.`,_>0?(y="kit-cfg-warn kit-import-preview",C+=` <strong>${_}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):C+=" Le combinazioni risultano allineate su tutti i kit selezionati."}U.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}Z.className=y,Z.innerHTML=C,U.disabled=!L,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let f=document.getElementById("kit-import-search");f&&f.focus()},40))}function ye(){if(!h)return;let{kits:t}=w(),i=h,n=t.find(c=>c.id===i.currentKitId),e=t.find(c=>c.id===i.sourceKitId),o=Kt(e,i.sectionId);if(!n||!e||!o){A("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import"){let c=et(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(Mt(o,e,n)),O(t),pt(),nt();let l="";c.hasTargetVarianti?c.needsReview&&(l=" Controlla le quantit\xE0 sulle combinazioni non allineate."):l=" Definisci poi gli assi del kit per rifinire i coefficienti.",A(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${l}`);return}let s=t.filter(c=>(i.targetKitIds||[]).includes(c.id)&&c.id!==n.id);if(!s.length){A("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let a=0;for(let c of s)et(e,c).needsReview&&(a+=1),c.sezioni=c.sezioni||[],c.sezioni.push(Mt(o,e,c));O(t),pt(),nt();let d="";a>0&&(d=` ${a} kit richiedono un controllo delle quantit\xE0.`),A(`Sezione "${o.nome}" copiata in ${s.length} kit \u2713${d}`)}function nt(){let{kits:t}=w(),i=t.find(v=>v.id===St);if(!i){W();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=S(i);D==="sezioni"&&(D="bom"),D==="sa"&&(D="bom");let s=["info","varianti","bom"],a={info:"Prodotto",varianti:"Elettronica selezionabile",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,q)=>v+(q.componenti||[]).length,0),p=c?`
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
        ${p}
        <div class="kit-cfg-danger">
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${r(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,k=e.map((v,q)=>{let L=(v.opzioni||[]).map((y,C)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${r(y.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(y.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${r(y.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(y.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${r(i.id)}','${r(v.id)}','${r(y.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${q}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${r(v.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${r(i.id)}','${r(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${r(i.id)}','${r(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${L||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${r(i.id)}','${r(v.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),g=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xE0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(v=>`<span class="kit-cfg-sa-var-badge" title="${r(v.key)}">${r(v.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",b=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci solo l'<strong>elettronica selezionabile</strong> del prodotto.<br>
                Esempio: un gruppo <strong>LED</strong>, uno <strong>Lente</strong>, uno <strong>Alimentazione</strong>.<br>
                Tu inserisci i nomi, il sistema user\xE0 queste scelte per costruire l'ordine e la distinta base.
            </div>
            ${k||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            ${g}
        </div>`,m=(i.sezioni||[]).map((v,q)=>{let L=(v.componenti||[]).map(y=>{let C=N(y),f=ht(y,i),_=(e||[]).find(x=>x.id===f.asseId)||null,B=f.tipo==="gruppo"&&_?`<div class="kit-cfg-row">${(_.opzioni||[]).map(x=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${f.opzioneIds.includes(x.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${r(i.id)}','${r(v.id)}','${r(y.id)}','${r(x.id)}',this.checked)">
                        ${r(x.nome)}
                    </label>`).join("")}</div>`:"",F=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(y.id)}','asseId',this.value)">
                        ${e.map(x=>`<option value="${r(x.id)}" ${f.asseId===x.id?"selected":""}>${r(x.nome)}</option>`).join("")}
                   </select>`:"",ei=f.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",xt=C?"flag":ut(y.unitaMisura,"pz"),ni=C?[{value:"flag",label:"Solo avviso"}]:[...new Set([xt,...di])].filter(Boolean).map(x=>({value:x,label:x}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${r(y.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(y.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${r(y.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(y.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(y.id)}','modo','',this.value)">
                        <option value="quantificato" ${C?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${C?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${r(i.id)}','${r(v.id)}','${r(y.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${f.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(y.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(y.id)}','unitaMisura','',this.value)"
                            ${C?"disabled":""}>
                        ${ni.map(x=>`<option value="${r(x.value)}" ${xt===x.value?"selected":""}>${r(x.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(y.id)}','tipo',this.value)">
                        <option value="sempre" ${f.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${f.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${f.tipo==="gruppo"?F:""}
                </div>
                ${f.tipo==="gruppo"?B:""}
                <input class="kit-cfg-input" value="${r(y.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(y.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${C?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${ei}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${q}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${r(v.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${r(i.id)}','${r(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${r(i.id)}','${r(v.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${r(i.id)}','${r(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${L}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${r(i.id)}','${r(v.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),z=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unit\xE0 corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${m}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${r(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,T="";o.length?T=o.map(v=>{let q=(i.sottoAssembly||[]).map((y,C)=>({sa:y,i:C})).filter(({sa:y})=>y.varianteKey===v.key),L=q.map(({sa:y,i:C})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${r(y.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${r(i.id)}',${C},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${r(i.id)}',${C})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${r(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${q.length} part${q.length!==1?"i":"e"}</span>
                </div>
                ${L||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${r(i.id)}','${r(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${r(v.nome)}</button>
            </div>`}).join(""):T='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let at=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${T}
        </div>`,Z={info:u,varianti:b,bom:z,sa:at},U=s.map(v=>`<button class="kit-tab ${D===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${a[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${r(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${r(i.nome)}</span>
        </div>
        <div class="kit-tabs">${U}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${Z[D]}</div>
    </div>`,X(n)}function he(t){if(t&&M===t){K();return}M=t,K()}function ze(t){D=t,nt()}function $(t,i,n=!0){let{kits:e}=w(),o=e.find(s=>s.id===t);o&&(i(o),O(e),n&&nt())}function we(t,i){$(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Ce(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=w();O(i.filter(n=>n.id!==t)),St=null,M=null,W()}function ii(t){$(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:I(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:I(),key:"opz1",nome:"Opzione 1"}]})})}function $e(t,i,n,e){$(t,function(o){let s=(o.assiConfigurazione||[]).find(a=>a.id===i);s&&(n==="key"?s.key=ot(e,s.key||"asse"):s[n]=e.trim())})}function _e(t,i){$(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function Se(t,i){$(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:I(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function Ie(t,i,n,e,o){$(t,function(s){let a=(s.assiConfigurazione||[]).find(c=>c.id===i),d=a&&(a.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=ot(o,d.key||"opzione"):d[e]=o.trim())})}function xe(t,i,n){$(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function Ae(t){ii(t)}function Me(t){$(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:I(),nome:"Nuova sezione",componenti:[]})})}function Oe(t){ti(t)}function qe(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s[n]=e.trim())},!1)}function Ee(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&$(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function Ne(t,i){$(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:I(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function Te(t,i,n,e,o,s){$(t,function(a){let d=(a.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=H(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":ut(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function Be(t,i,n,e,o){$(t,function(s){let a=(s.sezioni||[]).find(l=>l.id===i),d=a&&(a.componenti||[]).find(l=>l.id===n);if(!d)return;let c=ht(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(p=>p.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=H(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(p=>p.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=bt(d,s,c)})}function Ke(t,i,n,e,o){$(t,function(s){let a=(s.sezioni||[]).find(p=>p.id===i),d=a&&(a.componenti||[]).find(p=>p.id===n);if(!d)return;let c=ht(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=bt(d,s,c)})}function Le(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),a=s&&(s.componenti||[]).find(d=>d.id===n);!a||N(a)||(a.tracciabile=!!e)},!1)}function Re(t,i,n){$(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function Pe(t){$(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:I(),nome:"",varianteKey:S(i)[0]?.key||""})})}function De(t,i){$(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:I(),nome:"",varianteKey:i,noteConfig:""})})}function Ve(t,i,n,e){$(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function He(t,i){$(t,function(n){n.sottoAssembly.splice(i,1)})}function We(){window._kitOpenView=Bi,window._kitOpenConfig=Xt,window._kitNuovoKit=le,window._kitBack=Ki,window._kitOpenPrintPreview=Oi,window._kitSwitchTab=Li,window._kitAggiornaQty=Ri,window._kitOrdineSet=Pi,window._kitOrdineDelta=Di,window._kitOrdineReset=Vi,window._kitOrdineResetVoce=Hi,window._kitOrderSearch=ji,window._kitOrderHideSearch=Ui,window._kitOrderPick=Fi,window._kitOrderRemoveRef=Qi,window._kitComposeSelect=Gi,window._kitComposeAdd=Ji,window._kitAggiornaCar=Qt,window._kitAggiornaPronti=Yi,window._kitSetPronti=Wi,window._kitApriModalSped=oe,window._kitChiudiModalSped=Wt,window._kitConfermaSpedizione=se,window._kitApriModalReso=ae,window._kitChiudiModalReso=Zt,window._kitResoQtyChange=re,window._kitResoAggiornaBOM=_t,window._kitConfermaReso=ce,window._kitSalvaMovimento=Xi,window._kitEliminaMovimento=te,window._kitModificaMovimento=ee,window._kitChiudiModalEditMov=Yt,window._kitConfermaModificaMov=ne,window._kitChiudiModalDelMov=Gt,window._kitConfermaEliminaMov=Jt,window._kitSalvaManuale=de,window._kitElimina=Ce,window._kitCfgBack=he,window._kitCfgSwitchTab=ze,window._kitCfgSaveNome=we,window._kitCfgAddVar=Ae,window._kitCfgOpenImportModal=ti,window._kitCfgOpenCopySezModal=pe,window._kitCfgCloseImportModal=pt,window._kitCfgSetImportMode=ue,window._kitCfgSetImportSearch=me,window._kitCfgSelectImportSource=fe,window._kitCfgSelectImportSection=ge,window._kitCfgToggleImportTarget=ke,window._kitCfgSelectAllImportTargets=ve,window._kitCfgClearImportTargets=be,window._kitCfgConfirmImport=ye,window._kitCfgAddAsse=ii,window._kitCfgUpdateAsse=$e,window._kitCfgDelAsse=_e,window._kitCfgAddOpzione=Se,window._kitCfgUpdateOpzione=Ie,window._kitCfgDelOpzione=xe,window._kitCfgAddSez=Me,window._kitCfgImportSez=Oe,window._kitCfgUpdateSez=qe,window._kitCfgDelSez=Ee,window._kitCfgAddComp=Ne,window._kitCfgUpdateComp=Te,window._kitCfgUpdateCompRule=Be,window._kitCfgToggleCompOption=Ke,window._kitCfgToggleCompTracked=Le,window._kitCfgDelComp=Re,window._kitCfgAddSA=Pe,window._kitCfgAddSAForVariant=De,window._kitCfgUpdateSA=Ve,window._kitCfgDelSA=He}var vt,ct,Et,At,Nt,di,gt,V,tt,rt,it,qt,M,Ft,St,D,h,Ze,je=oi(()=>{si();ri();ci();ai();vt="_mlKitData",ct="_mlKitDataTs",Et="_mlKitOrderDrafts",At="_mlKitOrderDraftSeq",Nt=2,di=["pz","mt","cm","mm","kg","g","lt","ml"],gt=!1,V=[],tt=null,rt={};it={};qt=null;M=null,Ft="ordine";St=null,D="info",h=null;Ze=W});je();export{W as caricaKitProdotti,Ze as default,We as registerGlobals,Ye as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-KSL4XNTH.js.map
