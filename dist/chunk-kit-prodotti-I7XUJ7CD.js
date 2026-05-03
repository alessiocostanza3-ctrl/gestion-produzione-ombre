import{a as Ui,c as It,e as Qi,f as s,g as h,h as ft,l as Vi,m as J,q as Fi,r as At,u as Gi}from"./chunk-chunk-55SFP7PR.js";function Ao(){Et=!1}function W(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function nt(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function at(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function ct(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function Zi(t,i){let n="opz"+(i+1),e=W(t?.key,n);return{id:String(t?.id||S()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function Xi(t,i){let n="asse"+(i+1),e=W(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((a,r)=>Zi(a,r)).filter(Boolean):[];return{id:String(t?.id||S()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function ei(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function te(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xC2\xB7 ")}function ni(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let a of n)for(let r of e.opzioni)o.push({selections:a.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:r.id,opzioneKey:r.key,opzioneNome:r.nome,opzioneCodice:String(r.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:ei(e.selections),nome:te(e.selections),selections:e.selections}})}function ie(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||S()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:ct(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:nt(t?.qtaBase)}}function ee(t){return{id:String(t?.id||S()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(ie):[]}}function ne(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function oi(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:nt(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||nt(Object.values(t?.qtaPerVariante||{})[0])};let e=T(i);if(!e.length)return n;let o=e.filter(c=>j(t,c.key)>0);if(!o.length)return n;let a=new Set(o.map(c=>j(t,c.key)));if(a.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>j(t,c.key)))};let r=[...a][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:r};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let p of c.opzioni||[]){let u=new Set(e.filter(w=>(w.selections||[]).some(v=>v.asseId===c.id&&v.opzioneId===p.id)).map(w=>w.key));if(!u.size)continue;[...u].every(w=>j(t,w)===r)&&l.push(p.id)}if(!l.length)continue;let m=new Set(e.filter(p=>(p.selections||[]).some(u=>u.asseId===c.id&&l.includes(u.opzioneId))).map(p=>p.key));if(ne(m,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:r}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:r}}function Nt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=nt(n.qtyBase);if(!o)return e;for(let a of T(i)){let r=n.tipo==="sempre";n.tipo==="gruppo"&&(r=(a.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),r&&(e[a.key]=o)}return e}function oe(t,i){let n=ee(t);return n.componenti=n.componenti.map(function(e){let o=oi(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:Nt(e,i,o)}}),n}function se(t,i){let n=T(i);if(!n.length)return null;let e=null;for(let o of n){let a=j(t,o.key);if(e===null){e=a;continue}if(e!==a)return null}return e}function ae(t,i,n){let e=T(n),o={},a=se(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let r of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},r.key)?j(t,r.key):a!==null?a:0;c>0&&(o[r.key]=c)}return{id:S(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:Lt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:ct(t?.unitaMisura,D(t)?"flag":"pz")}}function zt(t,i,n){return{id:S(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>ae(e,i,n)):[]}}function si(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=W(t?.key||String(t?.nome||"asse"),"asse1"),a=o,r=1;for(;e.has(a);)a=o+"_c"+r++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],m="opz"+(c+1),p=W(l?.key,m),u=1;for(;d.some(k=>k.key===p);)p=p+"_c"+u++;d.push({id:S(),key:p,nome:String(l?.nome||"").trim()||p,codice:String(l?.codice||"").trim()})}return{id:S(),key:a,nome:String(t?.nome||"").trim()||a,opzioni:d}}function Dt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function vt(t,i){let n=new Set(T(t).map(a=>a.key)),e=T(i),o=e.filter(a=>n.has(a.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function wt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function re(t,i){return{id:String(t?.id||S()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function ai(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(p,u){let k="v"+(u+1),w=W(p?.key,k);return{id:String(p?.id||S()),key:w,nome:String(p?.nome||w).trim()||w}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((p,u)=>Xi(p,u)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(p){return{id:p.id,key:p.key,nome:p.nome}})}]:[],a=ni(o),r=a.length?a:n,d=new Set(r.map(p=>p.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(p){d.has(p[0])&&(c[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0))});for(let p of r)c[p.key]===void 0&&(c[p.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(p=>re(p,r[0]?.key||"")).filter(p=>!p.varianteKey||d.has(p.varianteKey)):[],m={};return Object.entries(i.pronti||{}).forEach(function(p){m[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0)}),{id:String(i.id||S()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Tt,assiConfigurazione:o,varianti:r,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(p=>oe(p,{assiConfigurazione:o,varianti:r})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function T(t){return Array.isArray(t?.varianti)?t.varianti:[]}function D(t){return!!t&&t.modoComponente==="segnalazione"}function Lt(t){return!!t&&t.tracciabile!==!1&&!D(t)}function j(t,i){let n=nt(t?.qtaPerVariante?.[i]);return D(t)?n>0?1:0:n}function yt(t,i){return oi(t,i)}function Kt(){try{let t=localStorage.getItem(Zt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function ri(t){try{localStorage.setItem(Zt,JSON.stringify(t||{}))}catch{}}function lt(){try{let t=localStorage.getItem(Xt),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Pt(t){try{localStorage.setItem(Xt,JSON.stringify(t||[]))}catch{}}function st(){try{let t=localStorage.getItem(ti),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function $t(t){try{localStorage.setItem(ti,JSON.stringify(t||[]));try{localStorage.setItem(Wi,Date.now())}catch{}}catch{}}function pt(t){return String(t||"").trim().toUpperCase()}function bt(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(pt).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function Y(t){return bt(t?._meta||{})}function _t(t,i){return t._meta=bt(i),t._meta}function ot(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function ci(){let t=1;try{t=(Number.parseInt(localStorage.getItem(Jt),10)||0)+1,localStorage.setItem(Jt,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function di(t){let i=Y(t);return i.documento||(i.documento=ci(),_t(t,i)),i.documento}function Wt(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:pt(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function li(){return it.length?Promise.resolve(it):Array.isArray(window._attiviProd)&&window._attiviProd.length?(it=Wt(window._attiviProd),Promise.resolve(it)):gt||(gt=fetch(It,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(it=Wt(t),it)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){gt=null}),gt)}function ce(t){let i=pt(t);return i&&it.find(n=>n.ordine===i)||null}function pi(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=pt(e);return o?i[o]?String(i[o]||"").trim():String(ce(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function X(t){let i=Kt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of T(t)){let a=n[o.key];e[o.key]=Math.max(0,Number.parseInt(a,10)||0)}return e._meta=bt(n._meta||{}),e}function F(t,i){let{kits:n}=z(),e=n.find(m=>m.id===t);if(!e)return;let o=Kt(),a=X(e);i(a,e);let r={},d=!1;for(let m of T(e)){let p=Math.max(0,Number.parseInt(a[m.key],10)||0);r[m.key]=p,p>0&&(d=!0)}let c=bt(a._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(c.documento||(c.documento=ci()),r._meta=c),d||l?o[t]=r:delete o[t],ri(o),L===t&&Q()}function de(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function Rt(t){let i=kt[t.id]&&typeof kt[t.id]=="object"?kt[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(a=>a.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return kt[t.id]=n,n}function mi(t,i){let n=t.assiConfigurazione||[];if(!n.length)return T(t)[0]||null;let e=[];for(let a of n){let r=i?.[a.id],d=(a.opzioni||[]).find(c=>c.id===r);if(!d)return null;e.push({asseId:a.id,asseKey:a.key,asseNome:a.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=ei(e);return T(t).find(a=>a.key===o)||null}function le(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function pe(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let a of t.sezioni||[])for(let r of a.componenti||[])if(!D(r)&&!(j(r,i.key)<=0)&&r.applicazioneTipo==="gruppo"&&String(r.applicazioneAsseId||"")===e&&Array.isArray(r.applicazioneOpzioneIds)&&r.applicazioneOpzioneIds.includes(o))return!0;return!1}function me(t,i,n){let e=[],o=new Map;for(let a of i){let r=ot(n,a.key);if(r)for(let d of a.selections||[]){if(pe(t,a,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=r;continue}let m={id:"sel-"+c,nome:le(d),codice:String(d?.opzioneCodice||"").trim(),totale:r,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,m),e.push(m)}}return e}function xt(t,i){let n=T(t).filter(r=>ot(i,r.key)>0),e=[],o=[],a=me(t,n,i);a.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:a});for(let r of t.sezioni||[]){let d=[];for(let c of r.componenti||[]){let l=0,m=[];for(let u of n){let k=ot(i,u.key),w=j(c,u.key);!k||!w||(D(c)?l+=k:l+=k*w,m.push({nome:u.nome,pezziOrdine:k,coeff:w}))}if(!m.length)continue;let p=m.length===1?m[0].nome:m.length+" configurazioni";if(D(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:p});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:p})}d.length&&e.push({id:r.id,nome:r.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:de(i),totaleRighe:e.reduce((r,d)=>r+d.righe.length,0)}}function ue(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\xE2\u20AC\u201D":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function fe(){return String(window._distintaHeaderAzienda||"").trim()}function ui(t,i,n){let e=new Date,o=Y(n),a=fe(),r=String(o.documento||"").trim(),d=a?a.split(/\r?\n/).map(k=>`<div>${s(k)}</div>`).join(""):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xC2\xB7 "),m=i.selectedVarianti.length?i.selectedVarianti.map(k=>{let w=ot(n,k.key);return`<tr>
                <td>${s(at(w))}</td>
                <td>${s(k.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',p=i.sezioni.map(k=>{let w=k.righe.map(v=>{let A=[v.dettaglio,v.noteConfig].filter(Boolean).join(" \xC2\xB7 ");return`<tr>
                <td class="db-print-cell-ref">${s(String(v.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${s(v.nome)}</div></td>
                <td class="db-print-cell-unit">${s(v.unita)}</td>
                <td class="db-print-cell-qty">${s(at(v.totale))}</td>
                <td class="db-print-cell-note">${A?s(A):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${s(k.nome)}</td></tr>${w}`}).join(""),u=i.avvisi.length?i.avvisi.map(k=>`<div class="db-print-alert ${k.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${s(k.nome)}</div>
                <div>${s(k.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${s(at(k.totaleCoinvolto))} pz \xC2\xB7 ${s(k.variantiLabel)}</div>
            </div>`).join(""):'<div class="db-print-empty">Nessun avviso operativo collegato a questa distinta.</div>';return`<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distinta base - ${s(t.nome)}</title>
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
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Prodotto</div><div class="db-print-meta-value">${s(t.nome)}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Riferimento</div><div class="db-print-meta-value">${s(o.cliente||"")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${s(ue(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${s(J?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${s(at(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${s(at(i.totaleRighe))}</div></div>
                </div>
            </div>

            <div class="db-print-strip">
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Documento</div>
                    <div class="db-print-strip-value">${s(r)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Prodotto</div>
                    <div class="db-print-strip-value">${s(t.nome)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">${s(c)}</div>
                    <div class="db-print-strip-value">${s(l)}</div>
                </div>
            </div>

            <div class="db-print-config-title">Configurazioni incluse nell'ordine</div>
            <table class="db-print-config-table">
                <thead>
                    <tr>
                        <th style="width:72px">Q.t\xC3\xA0</th>
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
                        <th style="width:90px">Quantit\xC3\xA0</th>
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
</html>`}function ge(t){let{kits:i}=z(),n=i.find(r=>r.id===t);if(!n)return;let e=X(n),o=xt(n,e);if(!o.totalePezzi||!o.totaleRighe){h("Componi prima un ordine per generare la distinta stampabile.","warning");return}Y(e).documento||(F(t,function(r){di(r)}),e=X(n));let a=window.open("","_blank");if(!a){h("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}a.document.open(),a.document.write(ui(n,o,e)),a.document.close(),a.focus()}function z(){try{let t=localStorage.getItem(Ot);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(ai):[]}}catch{return{kits:[]}}}function M(t){let i=Array.isArray(t)?t.map(ai):[];try{localStorage.setItem(Ot,JSON.stringify({kits:i})),localStorage.setItem(ht,Date.now())}catch{}ke(i)}function ke(t){clearTimeout(Yt),Yt=setTimeout(function(){At({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function ve(t){fetch(It,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(ht)||0);if(n>0&&n>e){try{localStorage.setItem(Ot,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(ht,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function S(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function Ht(){if(!J||!J.nome)return!1;let t=String(J.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||J.ruolo==="MASTER"}function ye(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(D(e)){i[e.id]=0;continue}let o=0;for(let[a,r]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(r,10)||0)*j(e,a);i[e.id]=o}return i}function be(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let a of t.sezioni||[])for(let r of a.componenti||[]){if(D(r))continue;let d=j(r,o);d>0&&(i[r.id]=(i[r.id]||0)+e*d)}}return i}function fi(t,i){let n=T(t).find(e=>e.key===i);return n?s(n.nome):s(i)}function jt(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function mt(){Et||(Et=!0,ve(function(n){n&&mt()}));let{kits:t}=z(),i=document.getElementById("contenitore-dati");if(i){i.innerHTML=`
    <div class="kit-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title"><i class="fas fa-toolbox" style="color:#6366f1;margin-right:6px;font-size:1.1rem"></i>Kit Prodotti</h3>
                <p class="acquisti-subtitle">Gestisci kit, componenti e distinte.</p>
            </div>
            <div id="kit-page-actions" class="acquisti-actions-wrapper"></div>
        </div>
        <div id="kit-tab-bar" style="display:flex;gap:4px;padding:8px 0 0">
            <button class="acq-tab ${H==="kits"?"active":""}" data-tab="kits" onclick="_kitSwitchMainTab('kits')"><i class="fas fa-boxes-stacked"></i> Kits</button>
            <button class="acq-tab ${H==="anagrafiche"?"active":""}" data-tab="anagrafiche" onclick="_kitSwitchMainTab('anagrafiche')"><i class="fas fa-list"></i> Anagrafiche</button>
            <button class="acq-tab ${H==="distinte"?"active":""}" data-tab="distinte" onclick="_kitSwitchMainTab('distinte')"><i class="fas fa-file-alt"></i> Distinte</button>
        </div>
        <div id="kit-main-content" class="kit-main-content" style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:0"></div>
    </div>`,K(H),Ut();try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else ft(i)}catch{ft(i)}}}function gi(t,i){if(!i)return;if(!t.length){i.innerHTML=`
        <div style="padding:40px 0;text-align:center">
            <i class="fas fa-box-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:16px;display:block"></i>
            <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun kit configurato.</p>
            <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
        </div>`;return}let n=["pz","mt","cm","mm","kg","g","lt","ml"],e=t.map(o=>{let a=o.sezioni||[],r=a.reduce((l,m)=>l+(m.componenti||[]).length,0),d=a.length,c=a.map(l=>{let m=l.componenti||[],p=m.map(u=>`
            <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #f8fafc">
                <span style="font-size:.84rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${s(u.nome)}">${s(u.nome)}${u.codice?` <span style="color:#94a3b8;font-size:.76rem">\xC2\xB7 ${s(u.codice)}</span>`:""}</span>
                <input type="number" min="0" step="any" value="${u.qtaBase!=null?u.qtaBase:1}"
                    class="input-field-modern" style="padding:4px 8px;font-size:.82rem;text-align:right"
                    onchange="_kitQUpdateComp('${s(o.id)}','${s(l.id)}','${s(u.id)}','qtaBase',this.value)"
                    title="Quantit\xC3\xA0">
                <select class="input-field-modern" style="padding:4px 6px;font-size:.82rem"
                    onchange="_kitQUpdateComp('${s(o.id)}','${s(l.id)}','${s(u.id)}','unitaMisura',this.value)">
                    ${n.map(k=>`<option value="${k}"${(u.unitaMisura||"pz")===k?" selected":""}>${k}</option>`).join("")}
                </select>
                <button type="button" class="btn-trash-modern" style="padding:4px 7px"
                    onclick="_kitQDelComp('${s(o.id)}','${s(l.id)}','${s(u.id)}')" title="Rimuovi componente"><i class="fas fa-trash"></i></button>
            </div>`).join("");return`
            <details style="border-top:1px solid #f1f5f9" open>
                <summary style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;cursor:pointer;list-style:none;user-select:none;background:#fafafa;border-radius:0">
                    <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                        <input type="text" value="${s(l.nome)}"
                            class="input-field-modern" style="padding:3px 8px;font-size:.84rem;font-weight:600;max-width:200px;background:transparent;border:1px solid transparent"
                            onclick="event.preventDefault();event.stopPropagation()"
                            onfocus="this.style.background='#fff';this.style.border='1px solid #e2e8f0'"
                            onblur="this.style.background='transparent';this.style.border='1px solid transparent';_kitQRenomeSez('${s(o.id)}','${s(l.id)}',this.value)">
                        <span style="color:#94a3b8;font-size:.76rem;white-space:nowrap">${m.length} comp.</span>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;flex-shrink:0">
                        <button type="button" class="btn-trash-modern" style="padding:3px 7px;font-size:.75rem"
                            onclick="event.preventDefault();event.stopPropagation();_kitQDelSez('${s(o.id)}','${s(l.id)}')" title="Rimuovi sezione"><i class="fas fa-trash"></i></button>
                        <i class="fas fa-chevron-down" style="color:#94a3b8;font-size:.75rem;transition:transform .2s"></i>
                    </div>
                </summary>
                <div style="padding:4px 12px 8px">
                    ${m.length?`
                    <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;padding:4px 0 2px;border-bottom:2px solid #e2e8f0;margin-bottom:2px">
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em">Componente</span>
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;text-align:right">Qty</span>
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase">Unit\xC3\xA0</span>
                        <span></span>
                    </div>
                    ${p}`:'<p style="color:#94a3b8;font-size:.82rem;padding:6px 0">Nessun componente.</p>'}
                    <button type="button" class="btn-archive-action" style="margin-top:8px;font-size:.8rem"
                        onclick="_kitQAddCompOpen('${s(o.id)}','${s(l.id)}')">
                        <i class="fas fa-plus"></i> Aggiungi componente
                    </button>
                </div>
            </details>`}).join("");return`
        <details class="ordine-group" style="margin-bottom:8px">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore" style="font-size:1rem">${s(o.nome)}</span>
                    <span style="color:#94a3b8;font-size:.78rem;font-weight:500;margin-left:8px">${d} sez. \xC2\xB7 ${r} comp.</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center">
                    <button type="button" class="btn-archive-action primary" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenView('${s(o.id)}')" title="Usa kit / crea ordine">
                        <i class="fas fa-play"></i> Usa
                    </button>
                    <button type="button" class="btn-archive-action" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenConfig('${s(o.id)}')" title="Configurazione avanzata">
                        <i class="fas fa-gear"></i> Config
                    </button>
                    <button type="button" class="btn-trash-modern"
                        onclick="event.preventDefault();event.stopPropagation();_kitQDelKit('${s(o.id)}')" title="Elimina kit">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </div>
            </summary>
            <div class="ordine-items" style="padding:0">
                ${a.length?c:'<p class="acquisti-subtitle" style="padding:12px 16px;margin:0">Nessuna sezione. Aggiungi una sezione per iniziare.</p>'}
                <div style="padding:8px 12px;border-top:1px solid #f1f5f9">
                    <button type="button" class="btn-archive-action" style="font-size:.8rem"
                        onclick="_kitQAddSezOpen('${s(o.id)}')">
                        <i class="fas fa-folder-plus"></i> Aggiungi sezione
                    </button>
                </div>
            </div>
        </details>`}).join("");i.innerHTML=e}function Ut(){let t=document.getElementById("kit-page-actions");t&&(H==="kits"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>':H==="anagrafiche"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>':t.innerHTML="")}function K(t){H=t,document.querySelectorAll("#kit-tab-bar .acq-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)});let{kits:i}=z(),n=document.getElementById("kit-main-content");n&&(t==="kits"?gi(i,n):t==="anagrafiche"?ki(i,n):t==="distinte"&&vi(i,n),Ut())}function ki(t,i){if(!i)return;let n=G();if(!n.length){i.innerHTML=`
            <div style="padding:24px 0;text-align:center">
                <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun componente salvato. Aggiungi il primo componente riutilizzabile.</p>
                <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi componente</button>
            </div>`;return}let e=n.reduce((a,r)=>{let d=r.categoria||"Senza categoria";return a[d]=a[d]||[],a[d].push(r),a},{}),o="";for(let[a,r]of Object.entries(e))o+=`<details class="ordine-group" open>
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${s(a)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${r.length} componente${r.length!==1?"i":""}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">`,o+=r.map(d=>`
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        <div style="font-weight:600;color:#1e293b">${s(d.nome)}${d.codice?` <span style="color:#94a3b8;font-size:.85rem;font-weight:400">\xC2\xB7 ${s(d.codice)}</span>`:""}</div>
                        ${d.descrizione?`<div style="color:#94a3b8;font-size:.82rem;margin-top:2px">${s(d.descrizione)}</div>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitOpenAnagraficaModal('${s(d.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questo componente?')) _kitDeleteAnagrafica('${s(d.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`).join(""),o+="</div></details>";i.innerHTML=o}function vi(t,i){if(!i)return;let n=st();if(!n.length){i.innerHTML='<div style="padding:24px 0;text-align:center"><p class="acquisti-subtitle">Nessuna distinta salvata.</p></div>';return}let e=n.map(o=>`
        <details class="ordine-group">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${s(o.nome)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${s(o.kitNome||"")}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        ${o.documento?`<div style="font-size:.85rem;color:#64748b">${s(o.documento)}</div>`:""}
                        <div style="color:#94a3b8;font-size:0.8rem;margin-top:2px">${s(new Date(o.createdAt).toLocaleString())} \xC2\xB7 ${s(o.createdBy)}</div>
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitDistintaOpenPrint('${s(o.id)}')"><i class="fas fa-print"></i> Stampa</button>
                        <button type="button" class="btn-archive-action" onclick="_kitDistintaApplyToDraft('${s(o.id)}')"><i class="fas fa-file-import"></i> Applica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questa distinta?')) _kitDistintaDelete('${s(o.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </details>`).join("");i.innerHTML=e}function yi(t){let{kits:i}=z(),n=i.find(c=>c.id===t);if(!n){h("Kit non trovato \xE2\u0161\xA0\xEF\xB8\x8F");return}let e=X(n);Y(e).documento||(F(t,function(c){di(c)}),e=X(n));let o=xt(n,e);if(!o.totalePezzi||!o.totaleRighe){h("Componi prima un ordine per generare la distinta stampabile.","warning");return}let a=st(),r=Y(e),d={id:S(),kitId:n.id,kitNome:n.nome,nome:r.documento||`Distinta-${Date.now()}`,documento:r.documento||"",createdAt:Date.now(),createdBy:J?.nome||"Sistema",orderDraftSnapshot:e,distintaSnapshot:o};a.unshift(d),$t(a),h("Distinta salvata \xE2\u0153\u201C"),H==="distinte"&&K("distinte")}function G(){try{let t=localStorage.getItem(ii),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Qt(t){try{localStorage.setItem(ii,JSON.stringify(t||[]));try{localStorage.setItem(Yi,Date.now())}catch{}}catch{}}function he(){if(document.getElementById("modal-kit-anagrafica-edit"))return;let t=document.createElement("div");t.innerHTML=`
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
    </div>`,document.body.appendChild(t.firstElementChild)}function ze(t){he();let i=document.getElementById("modal-kit-anagrafica-edit");if(!i)return;let n=document.getElementById("anag-componente"),e=document.getElementById("anag-codice"),o=document.getElementById("anag-categoria"),a=document.getElementById("anag-descrizione");if(t){let r=G().find(d=>d.id===t);r&&(n&&(n.value=r.nome||""),e&&(e.value=r.codice||""),o&&(o.value=r.categoria||""),a&&(a.value=r.descrizione||""),i.dataset.editId=t)}else n&&(n.value=""),e&&(e.value=""),o&&(o.value=""),a&&(a.value=""),delete i.dataset.editId;i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function bi(){let t=document.getElementById("modal-kit-anagrafica-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function we(){let t=document.getElementById("modal-kit-anagrafica-edit");if(!t)return;let i=t.dataset.editId,n=(document.getElementById("anag-componente")?.value||"").trim();if(!n){h("Inserisci il nome del componente","warning");return}let e=(document.getElementById("anag-codice")?.value||"").trim(),o=(document.getElementById("anag-categoria")?.value||"").trim(),a=(document.getElementById("anag-descrizione")?.value||"").trim(),r=G();if(i){let d=r.findIndex(c=>c.id===i);d!==-1?r[d]={...r[d],nome:n,codice:e,categoria:o,descrizione:a,updatedAt:Date.now()}:r.unshift({id:S(),nome:n,codice:e,categoria:o,descrizione:a,createdAt:Date.now(),createdBy:J?.nome||"Sistema"})}else r.unshift({id:S(),nome:n,codice:e,categoria:o,descrizione:a,createdAt:Date.now(),createdBy:J?.nome||"Sistema"});Qt(r),bi(),h("Componente salvato \xE2\u0153\u201C"),H==="anagrafiche"&&K("anagrafiche")}function Ce(t){let i=G().filter(n=>n.id!==t);Qt(i),H==="anagrafiche"&&K("anagrafiche"),h("Componente eliminato \xE2\u0153\u201C")}function $e(t){let i=st().find(o=>o.id===t);if(!i)return;let{kits:n}=z(),e=n.find(o=>o.id===i.kitId)||null;if(e){let o=window.open("","_blank");if(!o){h("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}o.document.open();try{o.document.write(ui(e,i.distintaSnapshot,i.orderDraftSnapshot))}catch{o.document.write("<pre>"+s(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>")}o.document.close(),o.focus()}else{let o=window.open("","_blank");if(!o){h("Popup bloccato","warning");return}o.document.open(),o.document.write("<pre>"+s(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>"),o.document.close(),o.focus()}}function _e(t){let i=st().find(e=>e.id===t);if(!i)return;let n=Kt();n[i.kitId]=i.orderDraftSnapshot||{},ri(n),h("Bozza ordine ripristinata per il kit selezionato \xE2\u0153\u201C")}function xe(t){let i=st().filter(n=>n.id!==t);$t(i),H==="distinte"&&K("distinte"),h("Distinta eliminata \xE2\u0153\u201C")}function Se(t){L=t,hi="ordine",Q()}function Q(){let{kits:t}=z(),i=t.find(v=>v.id===L);if(!i){mt();return}let n=document.getElementById("contenitore-dati"),e=T(i),o=X(i),a=Y(o),r=xt(i,o),d=r.selectedVarianti.length?r.selectedVarianti.map(v=>`<span class="kit-meta-pill"><strong>${ot(o,v.key)}</strong> \xC3\u2014 ${s(v.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=a.ordiniCliente.length?a.ordiniCliente.map(v=>`<span class="kit-order-ref-chip">${s(v)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(v)})' aria-label="Rimuovi ordine ${s(v)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=Rt(i),m=mi(i,l),p=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(v=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${s(v.nome)}</div>
                <div class="kit-compose-options">${(v.opzioni||[]).map(A=>`
                        <button type="button" class="kit-compose-option ${l[v.id]===A.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${s(i.id)}','${s(v.id)}','${s(A.id)}')">
                        ${s(A.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',u=r.selectedVarianti.length?r.selectedVarianti.map(v=>{let A=ot(o,v.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${s(v.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(v.selections)&&v.selections.length?v.selections.map(P=>s(P.opzioneNome)).join(" \xC2\xB7 "):s(v.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${s(i.id)}','${s(v.key)}',-1)">\xE2\u02C6\u2019</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${A}"
                           onchange="_kitOrdineSet('${s(i.id)}','${s(v.key)}',this.value)"
                           oninput="_kitOrdineSet('${s(i.id)}','${s(v.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${s(i.id)}','${s(v.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${s(i.id)}','${s(v.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,k=r.totalePezzi?r.sezioni.map(v=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${s(v.nome)}</div>
                ${v.righe.map(A=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${s(A.nome)}</div>
                            ${A.dettaglio?`<div class="kit-distinta-row-meta">${s(A.dettaglio)}</div>`:""}
                            ${A.noteConfig?`<div class="kit-distinta-row-note">${s(A.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${at(A.totale)} ${s(A.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,w=r.avvisi.length?r.avvisi.map(v=>`
            <div class="kit-distinta-alert ${v.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${s(v.nome)}</div>
                <div class="kit-distinta-alert-body">${s(v.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${v.totaleCoinvolto} pz \xC2\xB7 ${s(v.variantiLabel)}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Nessun avviso particolare per l\xE2\u20AC\u2122ordine attuale.</div>';n.innerHTML=`
    <div class="kit-page">
            <div class="kit-view-header">
            <button type="button" class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${s(i.nome)}</span>
            <button type="button" class="kit-gear-btn-inline" onclick="_kitOpenConfig('${s(i.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Ordine in composizione</div>
                    <div class="kit-order-summary-total">${r.totalePezzi} pezzi</div>
                </div>
                <div class="kit-order-summary-actions">
                        <button type="button" class="kit-btn-secondary" onclick="_kitOpenPrintPreview('${s(i.id)}')"><i class="fas fa-print"></i> Anteprima stampa</button>
                        <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenSaveDistintaModal('${s(i.id)}')"><i class="fas fa-save"></i> Salva distinta</button>
                        <button type="button" class="kit-btn-secondary" onclick="_kitOrdineReset('${s(i.id)}')"><i class="fas fa-rotate-left"></i> Azzera ordine</button>
                </div>
            </div>
            <div class="kit-order-summary-note">Questa bozza ordine resta locale sul dispositivo e serve solo per generare la distinta base di approvvigionamento.</div>
            <div class="kit-order-meta-grid">
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Ordini cliente</div>
                    <div class="ordine-autocomplete-wrapper kit-order-autocomplete-wrapper">
                        <input class="kit-order-meta-input" id="kit-order-ref-input-${s(i.id)}" type="text" placeholder="Cerca e collega un ordine cliente"
                               oninput="_kitOrderSearch('${s(i.id)}', this.value)"
                               onfocus="_kitOrderSearch('${s(i.id)}', this.value)"
                               onblur="_kitOrderHideSearch('${s(i.id)}')">
                        <div id="kit-order-autocomplete-${s(i.id)}" class="ordine-autocomplete-list"></div>
                    </div>
                    <div class="kit-order-ref-list">${c}</div>
                    <div class="kit-order-meta-help">Il cliente viene derivato dagli ordini selezionati. Se gli ordini appartengono a clienti diversi, in stampa il riferimento resta vuoto.</div>
                </div>
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Dati stampa</div>
                    <div class="kit-order-meta-row"><span>Cliente</span><strong>${s(a.cliente||"")}</strong></div>
                    <div class="kit-order-meta-row"><span>Documento</span><strong>${s(a.documento||"")}</strong></div>
                </div>
            </div>
            <div class="kit-order-summary-badges">${d}</div>
        </div>

        <div class="kit-order-layout">
            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-hand-pointer"></i> Componi ordine</div>
                <div class="kit-cfg-help">Scegli i pulsanti dell'elettronica, inserisci la quantit\xC3\xA0 e aggiungi quella configurazione all'ordine.</div>
                <div class="kit-compose-builder">
                    ${p}
                    <div class="kit-compose-footer">
                        <div class="kit-compose-selected">
                            <div class="kit-compose-selected-label">Configurazione pronta</div>
                            <div class="kit-compose-selected-name">${m?s(m.nome):"Completa prima tutte le scelte"}</div>
                        </div>
                        <div class="kit-order-stepper">
                            <input class="kit-order-stepper-input" id="kit-compose-qty-${s(i.id)}" type="number" min="1" value="1">
                            <button type="button" class="kit-spedisci-btn" onclick="_kitComposeAdd('${s(i.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
                        </div>
                    </div>
                </div>
                <div class="kit-order-lines">${u}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${r.totaleRighe} righe materiali \xC2\xB7 ${r.avvisi.length} avvisi</div>
                ${k}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${w}
            </section>
        </div>
    </div>`,ft(n),li().catch(()=>{})}function Ie(){L=null,mt()}function Ae(t){hi=t,Q()}function Me(t){F(t,function(i,n){for(let e of T(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Ee(t,i,n){try{window._kitSuppressNextFade=!0}catch{}F(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function qe(t,i,n){try{window._kitSuppressNextFade=!0}catch{}F(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function Be(t){F(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=bt({})})}function Oe(t,i){F(t,function(n){n[i]=0})}function Ct(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${s(e.ordine)}</span>
            <span class="ac-cliente">${s(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function Te(t,i){let n=String(i||"").trim().toLowerCase();if(!n){Ct(t,[]);return}li().then(function(e){let o=e.filter(a=>a.ordine.toLowerCase().includes(n)||a.cliente.toLowerCase().includes(n)).slice(0,8);Ct(t,o)})}function Ne(t){setTimeout(function(){Ct(t,[])},140)}function De(t,i,n){let e=pt(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}F(t,function(a){let r=Y(a);r.ordiniCliente=[...new Set(r.ordiniCliente.concat(e))],r.cliente=pi(r.ordiniCliente,{[e]:n}),_t(a,r)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),Ct(t,[])}function Le(t,i){let n=pt(i);try{window._kitSuppressNextFade=!0}catch{}F(t,function(e){let o=Y(e);o.ordiniCliente=o.ordiniCliente.filter(a=>a!==n),o.cliente=pi(o.ordiniCliente),_t(e,o)})}function Ke(t,i,n){let{kits:e}=z(),o=e.find(r=>r.id===t);if(!o)return;let a=Rt(o);if(a[i]=n,kt[t]=a,L===t){try{window._kitSuppressNextFade=!0}catch{}Q()}}function Pe(t){let{kits:i}=z(),n=i.find(r=>r.id===t);if(!n)return;let e=mi(n,Rt(n));if(!e){h("Completa prima le scelte elettroniche \xE2\u0161\xA0\xEF\xB8\x8F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){h("Inserisci una quantit\xC3\xA0 valida \xE2\u0161\xA0\xEF\xB8\x8F");return}if(Mt[t])return;Mt[t]=Date.now(),setTimeout(function(){try{delete Mt[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}F(t,function(r){r[e.key]=ot(r,e.key)+o});let a=document.getElementById("kit-compose-qty-"+t);a&&(a.value=1)}function zi(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=z(),a=o.find(A=>A.id===L);if(!a)return;let r=(a.sezioni||[]).find(A=>A.id===n),d=r&&(r.componenti||[]).find(A=>A.id===i);if(!d||!Lt(d))return;d.caricato=e,M(o);let l=ye(a)[i]||0,m=Math.max(0,l-e),u=be(a)[i]||0,k=t.closest("tr");if(!k)return;let w=k.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");w&&(w.textContent=l===0?"\xE2\u20AC\u201D":m,w.className=l===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let v=k.querySelector(".kit-car-liberi");v&&(u>0?(v.textContent=Math.max(0,e-u)+" lib.",v.style.display=""):v.style.display="none")}function Re(t,i,n){let{kits:e}=z(),o=e.find(a=>a.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),M(e),L===t&&Q())}function He(t,i,n){let{kits:e}=z(),o=e.find(r=>r.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),M(e);let a=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);a&&(a.value=o.pronti[i],a.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function je(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${s(t.id)}',${e.id})" title="Elimina">\xE2\u0153\u2022</button>`:'<span style="width:22px;flex-shrink:0"></span>',a=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${s(t.id)}',${e.id})" title="Modifica">\xE2\u0153\u017D</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let r=(e.righe||[]).reduce((l,m)=>l+m.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${s(l.mat)}</span><span class="kit-mov-qty scarico">\xE2\u02C6\u2019${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${s(l.nome)}</span><span class="kit-mov-qty scarico">\xC3\u2014${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\xF0\u0178\u0161\u0161 Spediz. \xC3\u2014${r} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${s(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${c}<div class="kit-sped-bom-divider">componenti scaricati</div>${d}</div>
            </details>`}if(e.tipo==="reso"){let r=e.totPz||0,d=(e.items||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${s(m.nome)}</span><span class="kit-mov-qty carico">\xC3\u2014${m.qty}</span></div>`).join(""),c=(e.righe||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\xE2\u0153\u201C ${s(m.mat)}</span><span class="kit-mov-qty carico">+${m.qty}</span></div>`).join(""),l=(e.scartate||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${s(m.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\xE2\u0153\u2022 ${m.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\xF0\u0178\u201C\xA6 Rientro \xC3\u2014${r} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${s(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">
                ${d}
                ${c?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${c}`:""}
                ${l?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${l}`:""}
              </div>
            </details>`}return`<div class="kit-mov-item ${s(e.tipo)}">
            <span class="kit-mov-badge ${s(e.tipo)}">${e.tipo==="carico"?"CARICO":"SCARICO"}</span>
            <span class="kit-mov-mat">${s(e.mat)}</span>
            <span class="kit-mov-qty ${s(e.tipo)}">${e.tipo==="carico"?"+":"\xE2\u02C6\u2019"}${e.qty}</span>
            ${e.nota?`<span class="kit-mov-nota">${s(e.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${e.ts}</span>
            ${a}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function Ue(t,i){let{kits:n}=z(),e=n.find(v=>v.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),a=document.getElementById("kit-mov-qty-"+t),r=document.getElementById("kit-mov-nota-"+t);if(!o||!a)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(a.value,10)||1),m=(r?.value||"").trim(),p=(e.sezioni||[]).find(v=>v.id===c),u=p&&(p.componenti||[]).find(v=>v.id===d);if(!u||!Lt(u))return;i==="carico"?u.caricato=(parseInt(u.caricato)||0)+l:u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:m,mat:u.nome,ts:jt()}),M(n),a&&(a.value=1),r&&(r.value="");let k=document.getElementById("kit-mov-list-"+t);k&&(k.innerHTML=je(e,Ht()));let w=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);w&&(w.value=u.caricato,zi(w))}function Qe(t,i){if(!Ht())return;let{kits:n}=z(),e=n.find(a=>a.id===t);if(!e)return;let o=(e.movimenti||[]).find(a=>a.id===i);o&&Ve(t,i,o)}function Ve(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),a;if(n.tipo==="spedizione")a=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xC3\u2014${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")a=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xC3\u2014${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";a=`<span class="kit-mov-badge ${s(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${s(n.mat)}</strong> ${n.tipo==="carico"?"+":"\xE2\u02C6\u2019"}${n.qty} pz`}o&&(o.innerHTML=a);let r=document.getElementById("btn-kit-del-ok");r&&(r.onclick=()=>Ci(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function wi(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ci(t,i){wi();let{kits:n}=z(),e=n.find(a=>a.id===t);if(!e)return;let o=(e.movimenti||[]).find(a=>a.id===i);if(o){if(o.tipo==="spedizione"){let a=(e.sezioni||[]).find(r=>r.id===o.sid);for(let r of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===r.cid||l.nome===r.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+r.qty)}for(let r of o.items||[])r.saId&&e.pronti&&(e.pronti[r.saId]=(parseInt(e.pronti[r.saId])||0)+r.qty)}else if(o.tipo==="reso")for(let a of o.righe||[])for(let r of e.sezioni||[]){let d=(r.componenti||[]).find(c=>c.id===a.cid||c.nome===a.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-a.qty))}else if(o.tipo==="carico")for(let a of e.sezioni||[]){let r=(a.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=Math.max(0,(parseInt(r.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let a of e.sezioni||[]){let r=(a.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=(parseInt(r.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(a=>a.id!==i),M(n),L===t&&Q(),h("Movimento eliminato \xE2\u0153\u201C")}}function Fe(t,i){if(!Ht())return;let{kits:n}=z(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let a=document.getElementById("modal-kit-edit-mov");if(!a)return;let r=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");r&&(r.innerHTML=`<span class="kit-mov-badge ${s(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${s(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),a.dataset.kitId=t,a.dataset.movId=i,a.style.display="flex",a.offsetHeight,a.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function $i(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ge(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);$i();let{kits:e}=z(),o=e.find(l=>l.id===i);if(!o)return;let a=(o.movimenti||[]).findIndex(l=>l.id===n);if(a===-1)return;let r=o.movimenti[a],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){h("Quantit\xC3\xA0 non valida \xE2\u0161\xA0\xEF\xB8\x8F");return}if(d!==r.qty){let l=d-r.qty;for(let m of o.sezioni||[]){let p=(m.componenti||[]).find(u=>u.id===r.cid);if(p){r.tipo==="carico"?p.caricato=Math.max(0,(parseInt(p.caricato)||0)+l):p.caricato=Math.max(0,(parseInt(p.caricato)||0)-l);break}}}o.movimenti[a]={...r,qty:d,nota:c},M(e),L===i&&Q(),h("Movimento aggiornato \xE2\u0153\u201C")}function Je(t){let{kits:i}=z(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){h("Nessuna parte tracciabile pronta \xE2\u20AC\u201D imposta le quantit\xC3\xA0 prima \xE2\u0161\xA0\xEF\xB8\x8F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let a=document.getElementById("kit-sped-items-list");a&&(a.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,m=fi(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${s(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${s(c.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xC3\u2014${l}</span>
                    </span>
                </label>`}).join(""));let r=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&r&&(d.value=r.value||""),d&&!r&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function _i(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function We(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;_i();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=z(),o=e.find(l=>l.id===i);if(!o)return;let a=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),r=[],d=[];for(let l of n){let m=(o.sottoAssembly||[]).find(u=>u.id===l);if(!m)continue;let p=Number.parseInt(o.pronti?.[l],10)||0;if(p){r.push({saId:l,nome:m.nome,qty:p});for(let u of o.sezioni||[])for(let k of u.componenti||[]){if(D(k))continue;let w=j(k,m.varianteKey);if(!w)continue;let v=p*w;k.caricato=Math.max(0,(parseInt(k.caricato)||0)-v);let A=d.find(P=>P.cid===k.id);A?A.qty+=v:d.push({cid:k.id,mat:k.nome,qty:v})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:r,righe:d,nota:a,ts:jt()}),M(e);let c=r.reduce((l,m)=>l+m.qty,0);h(`Spedizione registrata: ${c} pz \xE2\u0153\u201C`),L===i&&Q()}function Ye(t){let{kits:i}=z(),n=i.find(r=>r.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let r=n.sottoAssembly||[];o.innerHTML=r.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':r.map(d=>{let c=fi(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${s(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${s(d.id)}',-1)">\xE2\u02C6\u2019</button>
                        <input type="number" id="kit-reso-qty-${s(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${s(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${s(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let a=document.getElementById("kit-reso-nota");a&&(a.value=""),Vt(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function xi(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ze(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&Vt(e.dataset.kitId)}function Vt(t){let{kits:i}=z(),n=i.find(r=>r.id===t);if(!n)return;let e={};for(let r of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+r.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let m of l.componenti||[]){if(D(m))continue;let p=j(m,r.varianteKey);p&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+c*p})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let a=Object.entries(e).filter(([,r])=>r.qty>0);if(!a.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xC3\xA0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=a.map(([r,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${s(r)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${s(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function Xe(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=z(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;m>0&&o.push({saId:l.id,nome:l.nome,qty:m})}if(!o.length){h("Inserisci almeno un articolo rientrato \xE2\u0161\xA0\xEF\xB8\x8F");return}let a=[],r=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let m=l.dataset.cid,p=Number.parseInt(l.dataset.qty,10),u=[...e.sezioni||[]].flatMap(k=>k.componenti||[]).find(k=>k.id===m)?.nome||"?";l.checked?a.push({cid:m,mat:u,qty:p}):r.push({cid:m,mat:u,qty:p})});for(let l of a)for(let m of e.sezioni||[]){let p=(m.componenti||[]).find(u=>u.id===l.cid);if(p){p.caricato=(parseInt(p.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,m)=>l+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:a,scartate:r,nota:d,ts:jt(),totPz:c}),M(n),xi(),h(`Reso registrato: ${c} pz \xE2\u20AC\u201D ${a.length} comp. recuperati \xE2\u0153\u201C`),L===i&&Q()}function tn(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\xE2\u20AC\xA6";let{kits:e}=z();At({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(ht,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \xE2\u0153\u201C",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \xE2\u0153\u2014",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function Ai(t){V=t,Ii="bom";let i=document.getElementById("modal-kit-config");i&&(U(),i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function en(){let t=document.getElementById("modal-kit-config");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300),V=null)}function nn(t){if(!V)return;let i=(t?.value||"").trim();i&&(I(V,n=>{n.nome=i},!1),K("kits"))}function on(t){Ii=t,document.querySelectorAll("#kit-cfg-modal-tabs .acq-tab").forEach(e=>e.classList.toggle("active",e.dataset.tab===t));let i=document.getElementById("kit-cfg-modal-bom-panel"),n=document.getElementById("kit-cfg-modal-el-panel");i&&(i.style.display=t==="bom"?"block":"none"),n&&(n.style.display=t==="elettronica"?"block":"none")}function U(){if(!V)return;let{kits:t}=z(),i=t.find(y=>y.id===V);if(!i)return;let n=G(),e=["pz","mt","cm","mm","kg","g","lt","ml"],o=i.assiConfigurazione||[],a=document.getElementById("kit-cfg-modal-nome");a&&(a.value=i.nome||"");let r=[...new Set(n.map(y=>(y.categoria||"").trim()).filter(Boolean))].sort(),c=(i.sezioni||[]).flatMap(y=>(y.componenti||[]).map(C=>({comp:C,sez:y})));function l(y){let C=n.find(_=>_.nome===y.nome&&(!y.codice||!_.codice||_.codice===y.codice))||n.find(_=>_.nome===y.nome);return C?(C.categoria||"").trim():""}function m(y,C){let _=yt(y,i),q=D(y),R=q?"flag":ct(y.unitaMisura,"pz"),b=_.tipo==="gruppo"&&o.length?`<select class="input-field-modern" style="font-size:.8rem;padding:3px 7px;max-width:160px"
                   onchange="_kitCfgModalUpdateCompRule('${s(i.id)}','${s(C.id)}','${s(y.id)}','asseId',this.value)">
                  ${o.map(g=>`<option value="${s(g.id)}"${_.asseId===g.id?" selected":""}>${s(g.nome)}</option>`).join("")}
               </select>`:"",x=_.tipo==="gruppo"?(o.find(g=>g.id===_.asseId)||o[0])?.opzioni||[]:[],f=_.tipo==="gruppo"&&x.length?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
                ${x.map(g=>`<label style="display:flex;align-items:center;gap:3px;font-size:.8rem;cursor:pointer">
                    <input type="checkbox"${_.opzioneIds.includes(g.id)?" checked":""}
                        onchange="_kitCfgToggleCompOption('${s(i.id)}','${s(C.id)}','${s(y.id)}','${s(g.id)}',this.checked)">
                    ${s(g.nome)}</label>`).join("")}</div>`:"";return`<div style="display:grid;grid-template-columns:1fr 28px;gap:6px;padding:7px 0;border-bottom:1px solid #f1f5f9;align-items:start">
            <div>
                <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">
                    <span style="font-size:.85rem;font-weight:600;color:#1e293b">${s(y.nome)}</span>
                    ${y.codice?`<span style="font-size:.75rem;color:#94a3b8">\xC2\xB7 ${s(y.codice)}</span>`:""}
                    <input type="number" min="0" step="any" class="input-field-modern"
                        style="font-size:.8rem;padding:3px 7px;max-width:75px;text-align:right" value="${y.qtaBase??1}"
                        title="Quantit\xC3\xA0"
                        onchange="_kitCfgModalUpdateComp('${s(i.id)}','${s(C.id)}','${s(y.id)}','qtaBase',this.value)">
                    <select class="input-field-modern" style="font-size:.8rem;padding:3px 7px;max-width:70px"
                        onchange="_kitCfgModalUpdateComp('${s(i.id)}','${s(C.id)}','${s(y.id)}','unitaMisura',this.value)"${q?" disabled":""}>
                        ${e.map(g=>`<option value="${g}"${R===g?" selected":""}>${g}</option>`).join("")}
                    </select>
                    <select class="input-field-modern" style="font-size:.8rem;padding:3px 7px;max-width:190px"
                        onchange="_kitCfgModalUpdateCompRule('${s(i.id)}','${s(C.id)}','${s(y.id)}','tipo',this.value)">
                        <option value="sempre"${_.tipo==="sempre"?" selected":""}>Sempre presente</option>
                        <option value="gruppo"${_.tipo==="gruppo"?" selected":""}>Solo per elettronica</option>
                    </select>
                    ${b}
                </div>
                ${f}
                <input class="input-field-modern" style="font-size:.78rem;padding:3px 7px;margin-top:4px;width:100%;box-sizing:border-box"
                    placeholder="Nota approvvigionamento" value="${s(y.noteConfig||"")}"
                    onchange="_kitCfgModalUpdateComp('${s(i.id)}','${s(C.id)}','${s(y.id)}','noteConfig',this.value)">
            </div>
            <button type="button" class="btn-trash-modern" style="padding:4px 7px"
                onclick="_kitCfgModalDelComp('${s(i.id)}','${s(C.id)}','${s(y.id)}')">
                <i class="fas fa-trash"></i></button>
        </div>`}let p=new Set,u=r.map((y,C)=>{let _=n.filter(f=>(f.categoria||"").trim()===y),q=c.filter(({comp:f})=>l(f)===y);q.forEach(({comp:f})=>p.add(f.id));let R=q.map(({comp:f,sez:g})=>m(f,g)).join(""),b=_.map(f=>`<option value="${s(f.id)}">${s(f.nome)}${f.codice?" \xC2\xB7 "+s(f.codice):""}</option>`).join(""),x=q.length>0?`<span style="font-size:.72rem;font-weight:700;color:#6366f1;background:#eef2ff;padding:2px 8px;border-radius:10px">${q.length} nel kit</span>`:'<span style="font-size:.72rem;color:#94a3b8">nessuno nel kit</span>';return`<details class="ordine-group" style="margin-bottom:6px"${q.length?" open":""}>
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <i class="fas fa-tag" style="color:#6366f1;font-size:.8rem;margin-right:6px"></i>
                    <span class="og-operatore" style="font-size:.9rem">${s(y)}</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                    ${x}
                    <i class="fas fa-chevron-down og-chevron"></i>
                </div>
            </summary>
            <div class="ordine-items" style="padding:6px 14px 10px">
                ${q.length?R:'<p style="color:#94a3b8;font-size:.82rem;margin:4px 0 8px">Nessun componente di questa categoria nel kit.</p>'}
                <!-- form aggiungi -->
                <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;padding-top:8px;border-top:1px dashed #e2e8f0;margin-top:${q.length?"4px":"0"}">
                    <select data-cfg-add-sel="${C}" class="input-field-modern" style="flex:1;min-width:150px;font-size:.82rem;padding:5px 8px">
                        <option value="">\xE2\u20AC\u201D Seleziona componente \xE2\u20AC\u201D</option>
                        ${b}
                    </select>
                    <input type="number" data-cfg-add-qty="${C}" class="input-field-modern" value="1" min="0" step="any" style="max-width:65px;font-size:.82rem;padding:5px 7px" placeholder="Qty">
                    <select data-cfg-add-unit="${C}" class="input-field-modern" style="max-width:65px;font-size:.82rem;padding:5px 7px">
                        ${e.map(f=>`<option value="${f}">${f}</option>`).join("")}
                    </select>
                    <button type="button" class="btn-modal-send" style="font-size:.78rem;padding:5px 11px;white-space:nowrap" onclick="_kitCfgModalAddFromCat(${C})">
                        <i class="fas fa-plus"></i> Aggiungi
                    </button>
                </div>
            </div>
        </details>`}),k=c.filter(({comp:y})=>!p.has(y.id)),w=k.length>0?`
        <details class="ordine-group" style="margin-bottom:6px" open>
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <i class="fas fa-pen" style="color:#94a3b8;font-size:.8rem;margin-right:6px"></i>
                    <span class="og-operatore" style="font-size:.9rem;color:#64748b">Componenti liberi</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:.72rem;font-weight:700;color:#f59e0b;background:#fef3c7;padding:2px 8px;border-radius:10px">${k.length} nel kit</span>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </div>
            </summary>
            <div class="ordine-items" style="padding:6px 14px 10px">
                ${k.map(({comp:y,sez:C})=>{let _=yt(y,i),q=D(y),R=q?"flag":ct(y.unitaMisura,"pz"),b=_.tipo==="gruppo"&&o.length?`<select class="input-field-modern" style="font-size:.8rem;padding:3px 7px;max-width:160px" onchange="_kitCfgModalUpdateCompRule('${s(i.id)}','${s(C.id)}','${s(y.id)}','asseId',this.value)">${o.map(g=>`<option value="${s(g.id)}"${_.asseId===g.id?" selected":""}>${s(g.nome)}</option>`).join("")}</select>`:"",x=_.tipo==="gruppo"?(o.find(g=>g.id===_.asseId)||o[0])?.opzioni||[]:[],f=_.tipo==="gruppo"&&x.length?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">${x.map(g=>`<label style="display:flex;align-items:center;gap:3px;font-size:.8rem;cursor:pointer"><input type="checkbox"${_.opzioneIds.includes(g.id)?" checked":""} onchange="_kitCfgToggleCompOption('${s(i.id)}','${s(C.id)}','${s(y.id)}','${s(g.id)}',this.checked)"> ${s(g.nome)}</label>`).join("")}</div>`:"";return`<div style="display:grid;grid-template-columns:1fr 28px;gap:6px;padding:7px 0;border-bottom:1px solid #f1f5f9;align-items:start">
                        <div>
                            <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">
                                <input class="input-field-modern" style="font-size:.85rem;padding:3px 8px;max-width:190px" value="${s(y.nome)}"
                                    onchange="_kitCfgModalUpdateComp('${s(i.id)}','${s(C.id)}','${s(y.id)}','nome',this.value)">
                                <input class="input-field-modern" style="font-size:.8rem;padding:3px 7px;max-width:95px" placeholder="Codice" value="${s(y.codice||"")}"
                                    onchange="_kitCfgModalUpdateComp('${s(i.id)}','${s(C.id)}','${s(y.id)}','codice',this.value)">
                                <input type="number" min="0" step="any" class="input-field-modern" style="font-size:.8rem;padding:3px 7px;max-width:70px;text-align:right" value="${y.qtaBase??1}"
                                    onchange="_kitCfgModalUpdateComp('${s(i.id)}','${s(C.id)}','${s(y.id)}','qtaBase',this.value)">
                                <select class="input-field-modern" style="font-size:.8rem;padding:3px 7px;max-width:68px"
                                    onchange="_kitCfgModalUpdateComp('${s(i.id)}','${s(C.id)}','${s(y.id)}','unitaMisura',this.value)"${q?" disabled":""}>
                                    ${e.map(g=>`<option value="${g}"${R===g?" selected":""}>${g}</option>`).join("")}
                                </select>
                                <select class="input-field-modern" style="font-size:.8rem;padding:3px 7px;max-width:190px"
                                    onchange="_kitCfgModalUpdateCompRule('${s(i.id)}','${s(C.id)}','${s(y.id)}','tipo',this.value)">
                                    <option value="sempre"${_.tipo==="sempre"?" selected":""}>Sempre presente</option>
                                    <option value="gruppo"${_.tipo==="gruppo"?" selected":""}>Solo per elettronica</option>
                                </select>
                                ${b}
                            </div>
                            ${f}
                            <input class="input-field-modern" style="font-size:.78rem;padding:3px 7px;margin-top:4px;width:100%;box-sizing:border-box"
                                placeholder="Nota approvvigionamento" value="${s(y.noteConfig||"")}"
                                onchange="_kitCfgModalUpdateComp('${s(i.id)}','${s(C.id)}','${s(y.id)}','noteConfig',this.value)">
                        </div>
                        <button type="button" class="btn-trash-modern" style="padding:4px 7px"
                            onclick="_kitCfgModalDelComp('${s(i.id)}','${s(C.id)}','${s(y.id)}')"><i class="fas fa-trash"></i></button>
                    </div>`}).join("")}
            </div>
        </details>`:"",v=n.length===0?`<div style="background:#fef3c7;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:10px 14px;margin-bottom:12px;font-size:.85rem;color:#92400e">
            <i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>
            Il catalogo componenti \xC3\xA8 vuoto. Vai nella tab <strong>Anagrafiche</strong> per aggiungere componenti prima di configurare il kit.
           </div>`:"",A=document.getElementById("kit-cfg-modal-bom-panel");A&&(A.innerHTML=v+u.join("")+w+`<div style="padding-top:10px;border-top:1px solid #f1f5f9;margin-top:6px">
               <button type="button" class="btn-archive-action" style="font-size:.8rem" onclick="_kitCfgModalAddCompFree()">
                 <i class="fas fa-pen"></i> Aggiungi componente libero (non in catalogo)
               </button>
             </div>`);let P=o.length===0?'<p style="color:#94a3b8;font-size:.85rem;padding:16px 0">Nessun gruppo elettronico. Aggiungine uno per definire le varianti selezionabili.</p>':o.map(y=>{let C=(y.opzioni||[]).map(_=>`
                <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">
                    <input class="input-field-modern" style="font-size:.82rem;padding:3px 8px;flex:1" placeholder="Nome opzione" value="${s(_.nome)}"
                        onchange="_kitCfgModalUpdateOpz('${s(i.id)}','${s(y.id)}','${s(_.id)}','nome',this.value)">
                    <input class="input-field-modern" style="font-size:.82rem;padding:3px 8px;max-width:110px" placeholder="Codice" value="${s(_.codice||"")}"
                        onchange="_kitCfgModalUpdateOpz('${s(i.id)}','${s(y.id)}','${s(_.id)}','codice',this.value)">
                    <button type="button" class="btn-trash-modern" style="padding:3px 7px;font-size:.75rem" onclick="_kitCfgModalDelOpz('${s(i.id)}','${s(y.id)}','${s(_.id)}')"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;margin-bottom:12px">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                    <input class="input-field-modern" style="font-size:.9rem;font-weight:700;padding:5px 10px;flex:1" placeholder="Nome gruppo es. LED, Lente\xE2\u20AC\xA6" value="${s(y.nome)}"
                        onchange="_kitCfgModalUpdateAsse('${s(i.id)}','${s(y.id)}','nome',this.value)">
                    <button type="button" class="btn-trash-modern" style="padding:4px 8px" onclick="_kitCfgModalDelAsse('${s(i.id)}','${s(y.id)}')"><i class="fas fa-trash"></i></button>
                </div>
                <div style="margin-bottom:6px">${C||'<p style="color:#94a3b8;font-size:.82rem;margin:0 0 4px">Nessuna opzione.</p>'}</div>
                <button type="button" class="btn-archive-action" style="font-size:.78rem" onclick="_kitCfgModalAddOpz('${s(i.id)}','${s(y.id)}')"><i class="fas fa-plus"></i> Aggiungi opzione</button>
            </div>`}).join(""),tt=document.getElementById("kit-cfg-modal-el-panel");tt&&(tt.innerHTML=`
          ${P}
          <button type="button" class="btn-archive-action" style="font-size:.8rem" onclick="_kitCfgModalAddAsse('${s(i.id)}')">
            <i class="fas fa-plus"></i> Aggiungi gruppo elettronico
          </button>`)}function sn(t){let i=G(),e=[...new Set(i.map(p=>(p.categoria||"").trim()).filter(Boolean))].sort()[t];if(e==null)return;let o=document.querySelector(`[data-cfg-add-sel="${t}"]`),a=document.querySelector(`[data-cfg-add-qty="${t}"]`),r=document.querySelector(`[data-cfg-add-unit="${t}"]`),d=o?.value;if(!d){h("Seleziona un componente dal catalogo","warning");return}let c=i.find(p=>p.id===d);if(!c)return;let l=parseFloat(a?.value)||1,m=r?.value||"pz";I(V,p=>{let u=(p.sezioni||[]).find(k=>k.nome.trim()===e.trim());u||(u={id:S(),nome:e,componenti:[]},p.sezioni=p.sezioni||[],p.sezioni.push(u)),u.componenti=u.componenti||[],u.componenti.push({id:S(),nome:c.nome,codice:c.codice||"",qtaBase:l,unitaMisura:m,regola:{tipo:"sempre",qtyBase:l}})},!0)}function an(t,i,n,e){I(t,o=>{let a=(o.sezioni||[]).find(r=>r.id===i);a&&(a[n]=e.trim()||a[n])},!0)}function rn(t,i){confirm("Eliminare questa sezione e tutti i componenti?")&&I(t,n=>{n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)},!0)}function cn(t,i){let n=document.getElementById(`cfg-cat-${t}-${i}`),e=document.getElementById(`cfg-comp-${t}-${i}`);if(!n||!e)return;let o=n.value,a=G(),r=o&&o!=="__free__"?a.filter(c=>(c.categoria||"").trim()===o):[];if(!r.length||o==="__free__"){let c=document.createElement("input");c.id=`cfg-comp-${t}-${i}`,c.className=e.className,c.style.cssText=e.style.cssText,c.placeholder="Nome componente",e.replaceWith(c);return}let d=document.createElement("select");d.id=`cfg-comp-${t}-${i}`,d.className=e.className,d.style.cssText=e.style.cssText,d.innerHTML='<option value="">\xE2\u20AC\u201D Componente \xE2\u20AC\u201D</option>'+r.map(c=>`<option value="${s(c.nome)}|${s(c.codice||"")}">${s(c.nome)}${c.codice?" \xC2\xB7 "+s(c.codice):""}</option>`).join(""),e.replaceWith(d)}function dn(t,i,n,e){if(!e)return;let[o,a]=e.split("|");I(t,r=>{let d=(r.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);c&&(c.nome=o||c.nome,c.codice=a||"")},!0)}function ln(t){let i=t||V;i&&I(i,n=>{n.sezioni=n.sezioni||[];let e=n.sezioni.find(o=>o.nome==="Liberi");e||(e={id:S(),nome:"Liberi",componenti:[]},n.sezioni.push(e)),e.componenti=e.componenti||[],e.componenti.push({id:S(),nome:"Nuovo componente",codice:"",qtaBase:1,unitaMisura:"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function pn(t,i,n,e,o){I(t,a=>{let r=(a.sezioni||[]).find(c=>c.id===i),d=r&&(r.componenti||[]).find(c=>c.id===n);d&&(e==="qtaBase"?(d.qtaBase=parseFloat(o)||1,d.regola&&(d.regola.qtyBase=d.qtaBase)):d[e]=o)},!0)}function mn(t,i,n,e,o){I(t,a=>{let r=(a.sezioni||[]).find(c=>c.id===i),d=r&&(r.componenti||[]).find(c=>c.id===n);d&&(d.regola=d.regola||{},e==="tipo"?(d.regola.tipo=o,o==="gruppo"&&!d.regola.asseId&&a.assiConfigurazione?.length&&(d.regola.asseId=a.assiConfigurazione[0].id),o==="gruppo"&&(d.regola.opzioneIds=d.regola.opzioneIds||[])):e==="asseId"?(d.regola.asseId=o,d.regola.opzioneIds=[]):d.regola[e]=o)},!0)}function un(t,i,n){I(t,e=>{let o=(e.sezioni||[]).find(a=>a.id===i);o&&(o.componenti=(o.componenti||[]).filter(a=>a.id!==n))},!0)}function fn(t){I(t,i=>{i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:S(),nome:"Nuovo gruppo",key:W("","ax"+i.assiConfigurazione.length),opzioni:[]})},!0)}function gn(t,i){confirm("Eliminare questo gruppo elettronico?")&&I(t,n=>{n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)},!0)}function kn(t,i,n,e){I(t,o=>{let a=(o.assiConfigurazione||[]).find(r=>r.id===i);a&&(a[n]=e)},!1)}function vn(t,i){I(t,n=>{let e=(n.assiConfigurazione||[]).find(a=>a.id===i);if(!e)return;e.opzioni=e.opzioni||[];let o=e.opzioni.length+1;e.opzioni.push({id:S(),key:W("","opz"+o),nome:"Nuova opzione",codice:""})},!0)}function yn(t,i,n){I(t,e=>{let o=(e.assiConfigurazione||[]).find(a=>a.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(a=>a.id!==n))},!0)}function bn(t,i,n,e,o){I(t,a=>{let r=(a.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(d[e]=o)},!1)}function Mi(){let t=document.getElementById("modal-kit-crea");if(!t)return;let i=document.getElementById("kit-crea-nome");i&&(i.value=""),t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>i&&i.focus(),80)}function Ei(){let t=document.getElementById("modal-kit-crea");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function hn(){let t=(document.getElementById("kit-crea-nome")?.value||"").trim();if(!t){h("Inserisci un nome per il kit","warning");return}let{kits:i}=z(),n={id:S(),nome:t,schemaVersion:Tt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};i.push(n),M(i),Ei(),setTimeout(()=>K("kits"),320)}function zn(t){dt.kitId=t;let i=document.getElementById("modal-kit-qadd-sez");if(!i)return;let n=document.getElementById("kit-qadd-sez-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function qi(){let t=document.getElementById("modal-kit-qadd-sez");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function wn(){let t=(document.getElementById("kit-qadd-sez-nome")?.value||"").trim()||"Nuova sezione",{kits:i}=z(),n=i.find(e=>e.id===dt.kitId);n&&(n.sezioni=n.sezioni||[],n.sezioni.push({id:S(),nome:t,componenti:[]}),M(i),qi(),setTimeout(V?()=>U():()=>K("kits"),320))}function Cn(t,i){dt.kitId=t,dt.sezId=i;let n=document.getElementById("modal-kit-qadd-comp");if(!n)return;let e=G(),o=document.getElementById("kit-qadd-comp-source-cat"),a=document.getElementById("kit-qadd-comp-source-free");e.length?(o&&(o.checked=!0),qt("cat")):(a&&(a.checked=!0),qt("free"));let r=[...new Set(e.map(u=>u.categoria||"Senza categoria"))].sort(),d=document.getElementById("kit-qadd-comp-cat");d&&(d.innerHTML=r.map(u=>`<option value="${s(u)}">${s(u)}</option>`).join(""),Bi());let c=document.getElementById("kit-qadd-comp-qty");c&&(c.value="1");let l=document.getElementById("kit-qadd-comp-unit");l&&(l.value="pz");let m=document.getElementById("kit-qadd-comp-nome");m&&(m.value="");let p=document.getElementById("kit-qadd-comp-codice");p&&(p.value=""),n.style.display="flex",n.offsetHeight,n.classList.add("active")}function qt(t){let i=document.getElementById("kit-qadd-comp-cat-section"),n=document.getElementById("kit-qadd-comp-free-section");i&&(i.style.display=t==="cat"?"":"none"),n&&(n.style.display=t==="free"?"":"none")}function Bi(){let t=document.getElementById("kit-qadd-comp-cat"),i=document.getElementById("kit-qadd-comp-comp");if(!t||!i)return;let n=t.value,o=G().filter(a=>(a.categoria||"Senza categoria")===n);i.innerHTML=o.length?o.map(a=>`<option value="${s(a.id)}">${s(a.nome)}${a.codice?" \xC2\xB7 "+s(a.codice):""}</option>`).join(""):'<option value="">Nessun componente in questa categoria</option>'}function Oi(){let t=document.getElementById("modal-kit-qadd-comp");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function $n(){let t=document.getElementById("kit-qadd-comp-source-cat")?.checked,i="",n="";if(t){let l=document.getElementById("kit-qadd-comp-comp")?.value;if(!l){h("Seleziona un componente dal catalogo","warning");return}let m=G().find(p=>p.id===l);if(!m){h("Componente non trovato nel catalogo","warning");return}i=m.nome,n=m.codice||""}else{if(i=(document.getElementById("kit-qadd-comp-nome")?.value||"").trim(),!i){h("Inserisci il nome del componente","warning");return}n=(document.getElementById("kit-qadd-comp-codice")?.value||"").trim()}let e=parseFloat(document.getElementById("kit-qadd-comp-qty")?.value)||1,o=document.getElementById("kit-qadd-comp-unit")?.value||"pz",{kits:a}=z(),r=a.find(c=>c.id===dt.kitId);if(!r)return;let d=(r.sezioni||[]).find(c=>c.id===dt.sezId);d&&(d.componenti=d.componenti||[],d.componenti.push({id:S(),nome:i,codice:n,qtaBase:e,qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:o,applicazioneTipo:"sempre"}),M(a),Oi(),setTimeout(V?()=>U():()=>K("kits"),320))}function _n(t,i,n,e,o){let{kits:a}=z(),r=a.find(l=>l.id===t);if(!r)return;let d=(r.sezioni||[]).find(l=>l.id===i);if(!d)return;let c=(d.componenti||[]).find(l=>l.id===n);c&&(e==="qtaBase"?c.qtaBase=parseFloat(o)||0:c[e]=o,M(a))}function xn(t,i,n){if(!n.trim())return;let{kits:e}=z(),o=e.find(r=>r.id===t);if(!o)return;let a=(o.sezioni||[]).find(r=>r.id===i);a&&(a.nome=n.trim(),M(e))}function Sn(t,i,n){let{kits:e}=z(),o=e.find(r=>r.id===t);if(!o)return;let a=(o.sezioni||[]).find(r=>r.id===i);a&&(a.componenti=(a.componenti||[]).filter(r=>r.id!==n),M(e),K("kits"))}function In(t,i){if(!confirm("Rimuovere questa sezione e tutti i suoi componenti?"))return;let{kits:n}=z(),e=n.find(o=>o.id===t);e&&(e.sezioni=(e.sezioni||[]).filter(o=>o.id!==i),M(n),K("kits"))}function An(t){if(!confirm("Eliminare questo kit? L'operazione non \xC3\xA8 reversibile."))return;let{kits:i}=z(),n=i.filter(e=>e.id!==t);M(n),K("kits")}function Mn(){Mi()}function Ti(t){V=t,Ai(t)}function St(t,i,n=""){let{kits:e}=z(),o=e.find(c=>c.id===t),a=e.find(c=>c.id!==t&&(c.sezioni||[]).length),r=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:a?.id||"",sectionId:n||(i==="copy"?r:a?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function Ni(t){$=St(t,"import"),Z(!0)}function En(t){$=St(t,"import-asse"),Z(!0)}function qn(t,i){$=St(t,"copy",i),Z(!0)}function rt(){let t=document.getElementById("modal-kit-import");$=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Bn(t){if(!$||t!=="import"&&t!=="copy"||$.mode===t)return;let i=$.currentKitId,n=t==="copy"?$.sectionId:"";$=St(i,t,n),Z()}function On(t){$&&($.search=String(t||""),Z())}function Tn(t){if(!$)return;let{kits:i}=z(),n=i.find(e=>e.id===t);$.sourceKitId=t,$.mode==="import-asse"?$.asseId=n?.assiConfigurazione?.[0]?.id||"":$.sectionId=n?.sezioni?.[0]?.id||"",Z()}function Nn(t){$&&($.mode==="import-asse"?$.asseId=t:$.sectionId=t,Z())}function Dn(t,i){if(!$||$.mode!=="copy")return;let n=new Set($.targetKitIds||[]);i?n.add(t):n.delete(t),$.targetKitIds=[...n],Z()}function Ln(){if(!$||$.mode!=="copy")return;let{kits:t}=z(),i=t.filter(e=>e.id!==$.currentKitId&&wt(e.nome,$.search)),n=new Set($.targetKitIds||[]);for(let e of i)n.add(e.id);$.targetKitIds=[...n],Z()}function Kn(){!$||$.mode!=="copy"||($.targetKitIds=[],Z())}function Z(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!$)return;let{kits:n}=z(),e=$,o=n.find(f=>f.id===e.currentKitId);if(!o){rt();return}let a=[];e.mode==="import"?a=n.filter(f=>f.id!==o.id&&(f.sezioni||[]).length):e.mode==="import-asse"?a=n.filter(f=>f.id!==o.id&&(f.assiConfigurazione||[]).length):a=n.filter(f=>f.id!==o.id&&(f.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!a.some(f=>f.id===e.sourceKitId)&&(e.sourceKitId=a[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(f=>f!==o.id&&n.some(g=>g.id===f)));let r=n.find(f=>f.id===e.sourceKitId)||null,d=e.mode==="import-asse"?r?.assiConfigurazione||[]:r?.sezioni||[];e.mode==="import-asse"?d.some(f=>f.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(f=>f.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(r?.assiConfigurazione||[]).find(f=>f.id===e.asseId)||null:Dt(r,e.sectionId),l=a.filter(f=>wt(f.nome,e.search)),m=n.filter(f=>f.id!==o.id&&wt(f.nome,e.search)),p=document.getElementById("kit-import-subtitle"),u=document.getElementById("kit-import-search"),k=document.getElementById("kit-import-left-title"),w=document.getElementById("kit-import-right-title"),v=document.getElementById("kit-import-kit-list"),A=document.getElementById("kit-import-section-list"),P=document.getElementById("kit-import-target-wrap"),tt=document.getElementById("kit-import-target-list"),y=document.getElementById("kit-import-preview"),C=document.getElementById("kit-import-confirm-btn"),_=document.getElementById("kit-import-mode-import"),q=document.getElementById("kit-import-mode-copy");if(!p||!u||!k||!w||!v||!A||!P||!tt||!y||!C||!_||!q)return;_.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),q.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),u.value=e.search,e.mode==="import"?(p.textContent=`Importa una sezione esistente dentro "${o.nome}".`,u.placeholder="Cerca kit sorgente\xE2\u20AC\xA6",k.textContent="Kit sorgente",w.textContent=r?`Sezioni di ${r.nome}`:"Sezione",P.style.display="none",v.innerHTML=l.length?l.map(f=>{let g=f.id===e.sourceKitId;return`<label class="kit-import-option ${g?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${g?"checked":""}
                           onchange="_kitCfgSelectImportSource('${s(f.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${s(f.nome)}</span>
                        <span class="kit-import-option-meta">${(f.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(p.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xC3\xB9 kit.`,u.placeholder="Cerca kit destinazione\xE2\u20AC\xA6",k.textContent="Kit sorgente",w.textContent="Sezione da copiare",P.style.display="flex",v.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${s(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,tt.innerHTML=m.length?m.map(f=>{let g=(e.targetKitIds||[]).includes(f.id),E=c?vt(o,f):null,N=`${(f.sezioni||[]).length} sezioni`;return E&&(E.hasTargetVarianti?E.needsReview?N=`${E.exactMatches}/${E.targetCount} combinazioni allineate`:N=`${E.targetCount}/${E.targetCount} combinazioni allineate`:N="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${g?"kit-import-option--active":""}">
                    <input type="checkbox" ${g?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${s(f.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${s(f.nome)}</span>
                        <span class="kit-import-option-meta">${s(N)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),A.innerHTML=d.length?d.map(f=>{let g=e.mode==="import-asse"?f.id===e.asseId:f.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${g?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${g?"checked":""}
                           onchange="_kitCfgSelectImportSection('${s(f.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${s(f.nome)}</span>
                        <span class="kit-import-option-meta">${(f.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${g?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${g?"checked":""}
                       onchange="_kitCfgSelectImportSection('${s(f.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${s(f.nome)}</span>
                    <span class="kit-import-option-meta">${(f.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let R=!1,b="kit-cfg-help kit-import-preview",x="";if(e.mode==="import"){if(!r)x="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)x="Seleziona una sezione da importare nel kit corrente.";else{let f=vt(r,o);R=!0,x=`La sezione <strong>${s(c.nome)}</strong> verr\xC3\xA0 importata in <strong>${s(o.nome)}</strong>. `,f.hasTargetVarianti?f.needsReview?(b="kit-cfg-warn kit-import-preview",x+=`${f.exactMatches} combinazioni su ${f.targetCount} risultano allineate: controlla i coefficienti importati.`):x+=`Tutte le ${f.targetCount} combinazioni del kit destinazione risultano allineate.`:(b="kit-cfg-warn kit-import-preview",x+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}C.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")r?c?(R=!0,x=`L'asse <strong>${s(c.nome)}</strong> verr\xC3\xA0 importato in <strong>${s(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):x="Seleziona un asse da importare nel kit corrente.":x="Seleziona un kit sorgente per vedere gli assi disponibili.",C.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let f=n.filter(g=>(e.targetKitIds||[]).includes(g.id));if(!c)x="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!f.length)x="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{R=!0;let g=f.filter(E=>vt(o,E).needsReview).length;x=`La sezione <strong>${s(c.nome)}</strong> verr\xC3\xA0 copiata in <strong>${f.length}</strong> kit.`,g>0?(b="kit-cfg-warn kit-import-preview",x+=` <strong>${g}</strong> kit richiederanno un controllo manuale delle quantit\xC3\xA0 o delle combinazioni.`):x+=" Le combinazioni risultano allineate su tutti i kit selezionati."}C.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}y.className=b,y.innerHTML=x,C.disabled=!R,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let f=document.getElementById("kit-import-search");f&&f.focus()},40))}function Pn(){if(!$)return;let{kits:t}=z(),i=$,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Dt(e,i.sectionId),a=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!a){h("Configurazione import non valida \xE2\u0161\xA0\xEF\xB8\x8F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(p=>String(p.nome||"").trim().toLowerCase()===String(a.nome||"").trim().toLowerCase()),m=0;if(l){l.opzioni=l.opzioni||[];for(let p of a.opzioni||[]){let u=String(p.codice||"").trim().toLowerCase(),k=!1;if(u&&(k=l.opzioni.some(w=>String(w.codice||"").trim().toLowerCase()===u&&u!=="")),k||(k=l.opzioni.some(w=>String(w.nome||"").trim().toLowerCase()===String(p.nome||"").trim().toLowerCase())),!k){let w=(l.opzioni||[]).length+1;l.opzioni.push({id:S(),key:W(p?.key,"opz"+w),nome:String(p?.nome||"").trim()||"opz"+w,codice:String(p?.codice||"").trim()}),m+=1}}M(t),rt(),U(),m?h(`${m} opzione${m>1?"i":""} aggiunta${m>1?"e":""} all'asse "${a.nome}" \xE2\u0153\u201C`):h(`Nessuna nuova opzione trovata per l'asse "${a.nome}"`);return}n.assiConfigurazione.push(si(a,e,n)),M(t),rt(),U(),h(`Asse "${a.nome}" importato da "${e.nome}" \xE2\u0153\u201C`);return}if(i.mode==="import"){let l=vt(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(zt(o,e,n)),M(t),rt(),U();let m="";l.hasTargetVarianti?l.needsReview&&(m=" Controlla le quantit\xC3\xA0 sulle combinazioni non allineate."):m=" Definisci poi gli assi del kit per rifinire i coefficienti.",h(`Sezione "${o.nome}" importata da "${e.nome}" \xE2\u0153\u201C${m}`);return}let r=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!r.length){h("Seleziona almeno un kit destinazione \xE2\u0161\xA0\xEF\xB8\x8F");return}let d=0;for(let l of r)vt(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(zt(o,e,l));M(t),rt(),U();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xC3\xA0.`),h(`Sezione "${o.nome}" copiata in ${r.length} kit \xE2\u0153\u201C${c}`)}function Rn(t){let{kits:i}=z(),n=i.find(e=>e.id===t)||null;B={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},ut(!0)}function Di(){let t=document.getElementById("modal-kit-presets");B=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Hn(t){B&&(B.search=String(t||""),ut())}function jn(t){B&&(B.selectedPresetId=t,ut())}function Un(){if(!B)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){h("Inserisci il nome del preset \xE2\u0161\xA0\xEF\xB8\x8F");return}let e=i?.value||"";Li(B.currentKitId,e,n)}function Li(t,i,n){let{kits:e}=z(),o=e.find(d=>d.id===t);if(!o){h("Kit non trovato \xE2\u0161\xA0\xEF\xB8\x8F");return}let a=Dt(o,i);if(!a){h("Seleziona una sezione valida \xE2\u0161\xA0\xEF\xB8\x8F");return}let r=lt();r.push({id:S(),nome:String(n||"").trim(),sourceKitId:o.id,sezione:JSON.parse(JSON.stringify(a))}),Pt(r),h("Preset salvato \xE2\u0153\u201C"),B&&B.currentKitId===t&&ut(),U()}function Qn(t){if(!B)return;let i=lt(),n=t||B.selectedPresetId,e=i.find(d=>d.id===n);if(!e){h("Seleziona un preset \xE2\u0161\xA0\xEF\xB8\x8F");return}let{kits:o}=z(),a=o.find(d=>d.id===B.currentKitId),r=o.find(d=>d.id===e.sourceKitId)||null;if(!a){h("Kit non trovato \xE2\u0161\xA0\xEF\xB8\x8F");return}a.sezioni=a.sezioni||[],a.sezioni.push(zt(e.sezione,r,a)),M(o),Di(),U(),h(`Preset "${e.nome}" applicato \xE2\u0153\u201C`)}function Vn(t,i){let n=lt(),e=n.find(o=>o.id===t);if(!e){h("Preset non trovato \xE2\u0161\xA0\xEF\xB8\x8F");return}e.nome=String(i||"").trim()||e.nome,Pt(n),h("Nome aggiornato \xE2\u0153\u201C"),ut()}function Fn(t){let i=lt().filter(n=>n.id!==t);Pt(i),B&&(B.selectedPresetId=""),ut(),h("Preset eliminato \xE2\u0153\u201C")}function ut(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!B)return;let n=lt(),e=B,o=z().kits.find(u=>u.id===e.currentKitId),a=n.filter(u=>wt(u.nome,e.search)),r=document.getElementById("preset-list"),d=document.getElementById("preset-preview"),c=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),m=document.getElementById("preset-apply-btn");if(!r||!d||!c||!l||!m)return;r.innerHTML=a.length?a.map(u=>{let k=u.id===e.selectedPresetId;return`<label class="kit-import-option ${k?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${k?"checked":""} onchange="_kitSelectPreset('${s(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${s(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let p=n.find(u=>u.id===e.selectedPresetId)||null;if(p){let u=p.sourceKitId&&z().kits.find(k=>k.id===p.sourceKitId)?.nome||"";d.innerHTML=`<div style="padding:6px"><strong>${s(p.nome)}</strong><div style="color:#94a3b8">${s(u)}</div></div>`+(p.sezione?.componenti?.length?`<div>${p.sezione.componenti.map(k=>`<div class="kit-meta-pill">${s(k.nome)}${k.codice?" \xC2\xB7 "+s(k.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else d.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;m.disabled=!p,c.value="",l.innerHTML=(o?.sezioni||[]).map(u=>`<option value="${s(u.id)}">${s(u.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("preset-search");u&&u.focus()},40))}function Gn(){let{kits:t}=z(),i=t.find(b=>b.id===Si);if(!i){mt();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=T(i);et==="sezioni"&&(et="bom"),et==="sa"&&(et="bom");let a=["info","varianti","anagrafiche","bom"],r={info:"Prodotto",varianti:"Elettronica selezionabile",anagrafiche:"Anagrafiche",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((b,x)=>b+(x.componenti||[]).length,0),m=c?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-bolt"></i>
                <div><strong>${d}</strong> grupp${d===1?"o":"i"} elettronici e <strong>${c}</strong> configurazioni pronte da usare</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div>
                    ${o.slice(0,8).map(b=>`<span class="kit-cfg-sa-var-badge">${s(b.nome)}</span>`).join(" ")}
                    ${o.length>8?`<span class="kit-cfg-sa-count">+${o.length-8} altre</span>`:""}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${l}</strong> parti prodotto da usare nella distinta base</div>
            </div>
        </div>`:'<div class="kit-cfg-help">\xF0\u0178\u2019\xA1 Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>',p=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${s(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${s(i.id)}',this.value)">
        </div>
        ${m}
        <div class="kit-cfg-danger">
            <button type="button" class="kit-cfg-add-btn" onclick="_kitDuplicaKit('${s(i.id)}')"><i class="fas fa-clone"></i> Duplica kit</button>
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${s(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,u=e.map((b,x)=>{let f=(b.opzioni||[]).map((g,E)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${s(g.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${s(i.id)}','${s(b.id)}','${s(g.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${s(g.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${s(i.id)}','${s(b.id)}','${s(g.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${s(i.id)}','${s(b.id)}','${s(g.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${x}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${s(b.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${s(i.id)}','${s(b.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${s(i.id)}','${s(b.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xC3\xB2 richiedere per questo gruppo.</div>
            ${f||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${s(i.id)}','${s(b.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),k=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xC3\xA0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(b=>`<span class="kit-cfg-sa-var-badge" title="${s(b.key)}">${s(b.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",w=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci solo l'<strong>elettronica selezionabile</strong> del prodotto.<br>
                Esempio: un gruppo <strong>LED</strong>, uno <strong>Lente</strong>, uno <strong>Alimentazione</strong>.<br>
                Tu inserisci i nomi, il sistema user\xC3\xA0 queste scelte per costruire l'ordine e la distinta base.
            </div>
            ${u||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${s(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportAsseModal('${s(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenPresetsModal('${s(i.id)}')"><i class="fas fa-bookmark"></i> Sezioni fisse</button>
            ${k}
        </div>`,v=(i.sezioni||[]).map((b,x)=>{let f=(b.componenti||[]).map(g=>{let E=D(g),N=yt(g,i),Ft=(e||[]).find(O=>O.id===N.asseId)||null,Pi=N.tipo==="gruppo"&&Ft?`<div class="kit-cfg-row">${(Ft.opzioni||[]).map(O=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${N.opzioneIds.includes(O.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${s(i.id)}','${s(b.id)}','${s(g.id)}','${s(O.id)}',this.checked)">
                        ${s(O.nome)}
                    </label>`).join("")}</div>`:"",Ri=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${s(i.id)}','${s(b.id)}','${s(g.id)}','asseId',this.value)">
                        ${e.map(O=>`<option value="${s(O.id)}" ${N.asseId===O.id?"selected":""}>${s(O.nome)}</option>`).join("")}
                   </select>`:"",Hi=N.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xC3\xA0 convertita nel nuovo schema semplice.</div>':"",Gt=E?"flag":ct(g.unitaMisura,"pz"),ji=E?[{value:"flag",label:"Solo avviso"}]:[...new Set([Gt,...Ji])].filter(Boolean).map(O=>({value:O,label:O}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${s(g.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${s(i.id)}','${s(b.id)}','${s(g.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${s(g.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${s(i.id)}','${s(b.id)}','${s(g.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${s(i.id)}','${s(b.id)}','${s(g.id)}','modo','',this.value)">
                        <option value="quantificato" ${E?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${E?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${s(i.id)}','${s(b.id)}','${s(g.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xC3\xA0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${N.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${s(i.id)}','${s(b.id)}','${s(g.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${s(i.id)}','${s(b.id)}','${s(g.id)}','unitaMisura','',this.value)"
                            ${E?"disabled":""}>
                        ${ji.map(O=>`<option value="${s(O.value)}" ${Gt===O.value?"selected":""}>${s(O.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${s(i.id)}','${s(b.id)}','${s(g.id)}','tipo',this.value)">
                        <option value="sempre" ${N.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${N.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${N.tipo==="gruppo"?Ri:""}
                </div>
                ${N.tipo==="gruppo"?Pi:""}
                <input class="kit-cfg-input" value="${s(g.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${s(i.id)}','${s(b.id)}','${s(g.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${E?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xC3\xA0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Hi}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${x}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${s(b.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${s(i.id)}','${s(b.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${s(i.id)}','${s(b.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${s(i.id)}','${s(b.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${f}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${s(i.id)}','${s(b.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),A=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unit\xC3\xA0 corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\xE2\u0161\xA0\xEF\xB8\x8F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${v}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${s(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${s(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,P="";o.length?P=o.map(b=>{let x=(i.sottoAssembly||[]).map((g,E)=>({sa:g,i:E})).filter(({sa:g})=>g.varianteKey===b.key),f=x.map(({sa:g,i:E})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${s(g.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${s(i.id)}',${E},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${s(i.id)}',${E})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${s(b.nome)}</span>
                    <span class="kit-cfg-sa-count">${x.length} part${x.length!==1?"i":"e"}</span>
                </div>
                ${f||'<div class="kit-cfg-sa-empty">Nessuna parte \xE2\u20AC\u201D aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${s(i.id)}','${s(b.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${s(b.nome)}</button>
            </div>`}).join(""):P='<div class="kit-cfg-warn">\xE2\u0161\xA0\xEF\xB8\x8F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let tt=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xC3\xA0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${P}
        </div>`,y={info:p,varianti:w,bom:A,sa:tt},C=lt(),q=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${C.length?C.map(b=>`<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${s(b.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${s(b.sourceKitId&&z().kits.find(x=>x.id===b.sourceKitId)?.nome||"")}</div>
                </div>
                <div style="display:flex;gap:8px">
                    <button class="kit-cfg-add-btn" onclick="_kitApplyPreset('${s(b.id)}')">Applica</button>
                    <button class="kit-cfg-add-btn" onclick="(function(){const n=prompt('Nuovo nome preset', '${s(b.nome)}'); if(n) _kitRenamePreset('${s(b.id)}', n);})()">Rinomina</button>
                    <button class="kit-btn-danger" onclick="(function(){ if(confirm('Eliminare questo preset?')) _kitDeletePreset('${s(b.id)}') })()">Elimina</button>
                </div>
            </div>`).join(""):'<div class="kit-import-empty">Nessun preset salvato.</div>'}</div>
            <hr style="margin:12px 0">
            <div style="display:flex;gap:8px;align-items:center">
                <select id="preset-new-section-tab" class="kit-cfg-select" style="min-width:220px">
                    ${(i.sezioni||[]).map(b=>`<option value="${s(b.id)}">${s(b.nome)}</option>`).join("")}
                </select>
                <input id="preset-new-name-tab" class="kit-cfg-input" placeholder="Nome nuovo preset" style="flex:1">
                <button class="kit-cfg-add-btn" onclick="(function(){ const sec = document.getElementById('preset-new-section-tab')?.value || ''; const name = document.getElementById('preset-new-name-tab')?.value || ''; if(!name) { alert('Inserisci un nome'); return; } _kitCreatePreset('${s(i.id)}', sec, name); })()"><i class="fas fa-save"></i> Crea preset</button>
            </div>
        </div>`;y.anagrafiche=q;let R=a.map(b=>`<button class="kit-tab ${et===b?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${b}')">${r[b]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${s(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${s(i.nome)}</span>
        </div>
        <div class="kit-tabs">${R}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${y[et]}</div>
    </div>`,ft(n)}function Jn(t){if(t&&L===t){Q();return}L=t,Q()}function Wn(t){et=t,Gn()}function I(t,i,n=!0){let{kits:e}=z(),o=e.find(a=>a.id===t);o&&(i(o),M(e),n&&U())}function Yn(t,i){I(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Zn(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=z();M(i.filter(n=>n.id!==t)),Si=null,L=null,mt()}function Xn(t){let{kits:i}=z(),n=i.find(o=>o.id===t);if(!n)return;let e={id:S(),nome:`Copia di ${n.nome}`,schemaVersion:Tt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(si(o,n,e));e.varianti=ni(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(zt(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:S(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),M(i),Ti(e.id),h(`Kit "${n.nome}" duplicato \xE2\u0153\u201C`)}function Ki(t){I(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:S(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:S(),key:"opz1",nome:"Opzione 1"}]})})}function to(t,i,n,e){I(t,function(o){let a=(o.assiConfigurazione||[]).find(r=>r.id===i);a&&(n==="key"?a.key=W(e,a.key||"asse"):a[n]=e.trim())})}function io(t,i){I(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function eo(t,i){I(t,function(n){let e=(n.assiConfigurazione||[]).find(a=>a.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:S(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function no(t,i,n,e,o){I(t,function(a){let r=(a.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=W(o,d.key||"opzione"):d[e]=o.trim())})}function oo(t,i,n){I(t,function(e){let o=(e.assiConfigurazione||[]).find(a=>a.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(a=>a.id!==n))})}function so(t){Ki(t)}function ao(t){I(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:S(),nome:"Nuova sezione",componenti:[]})})}function ro(t){Ni(t)}function co(t,i,n,e){I(t,function(o){let a=(o.sezioni||[]).find(r=>r.id===i);a&&(a[n]=e.trim())},!1)}function lo(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&I(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function po(t,i){I(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:S(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function mo(t,i,n,e,o,a){I(t,function(r){let d=(r.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=nt(a);return}if(e==="modo"){c.modoComponente=a==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":ct(a,"pz");return}c[e]=a.trim()}},e!=="nome"&&e!=="noteConfig")}function uo(t,i,n,e,o){I(t,function(a){let r=(a.sezioni||[]).find(l=>l.id===i),d=r&&(r.componenti||[]).find(l=>l.id===n);if(!d)return;let c=yt(d,a);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=a.assiConfigurazione?.[0]?.id||"";let l=(a.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=nt(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(a.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Nt(d,a,c)})}function fo(t,i,n,e,o){I(t,function(a){let r=(a.sezioni||[]).find(m=>m.id===i),d=r&&(r.componenti||[]).find(m=>m.id===n);if(!d)return;let c=yt(d,a),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Nt(d,a,c)})}function go(t,i,n,e){I(t,function(o){let a=(o.sezioni||[]).find(d=>d.id===i),r=a&&(a.componenti||[]).find(d=>d.id===n);!r||D(r)||(r.tracciabile=!!e)},!1)}function ko(t,i,n){I(t,function(e){let o=(e.sezioni||[]).find(a=>a.id===i);o&&(o.componenti=(o.componenti||[]).filter(a=>a.id!==n))})}function vo(t){I(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:S(),nome:"",varianteKey:T(i)[0]?.key||""})})}function yo(t,i){I(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:S(),nome:"",varianteKey:i,noteConfig:""})})}function bo(t,i,n,e){I(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function ho(t,i){I(t,function(n){n.sottoAssembly.splice(i,1)})}function zo(t){let i=document.getElementById("modal-kit-distinta-edit");if(!i){yi(t);return}let{kits:n}=z(),e=n.find(c=>c.id===t);if(!e)return;let o=X(e),a=Y(o),r=document.getElementById("distinta-edit-nome"),d=document.getElementById("distinta-edit-documento");r&&(r.value=a.documento||""),d&&(d.value=a.documento||""),i.dataset.kitId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>r&&r.focus(),80)}function Bt(){let t=document.getElementById("modal-kit-distinta-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function wo(){let t=document.getElementById("modal-kit-distinta-edit");if(!t)return;let i=t.dataset.kitId,n=(document.getElementById("distinta-edit-nome")?.value||"").trim(),e=(document.getElementById("distinta-edit-documento")?.value||"").trim();if(!n){h("Inserisci un nome per la distinta.","warning");return}F(i,function(m){let p=Y(m);e?p.documento=e:p.documento||(p.documento=n),_t(m,p)});let{kits:o}=z(),a=o.find(m=>m.id===i);if(!a){Bt(),h("Kit non trovato \xE2\u0161\xA0\xEF\xB8\x8F");return}let r=X(a),d=xt(a,r);if(!d.totalePezzi||!d.totaleRighe){h("Componi prima un ordine per generare la distinta stampabile.","warning");return}let c=st(),l={id:S(),kitId:a.id,kitNome:a.nome,nome:n||r._meta?.documento||`Distinta-${Date.now()}`,documento:e||r._meta?.documento||"",createdAt:Date.now(),createdBy:J?.nome||"Sistema",orderDraftSnapshot:r,distintaSnapshot:d};c.unshift(l),$t(c),Bt(),h("Distinta salvata \xE2\u0153\u201C"),H==="distinte"&&K("distinte")}function Mo(){window._kitOpenView=Se,window._kitOpenConfig=Ti,window._kitNuovoKit=Mn,window._kitBack=Ie,window._kitOpenPrintPreview=ge,window._kitSwitchTab=Ae,window._kitAggiornaQty=Me,window._kitOrdineSet=Ee,window._kitOrdineDelta=qe,window._kitOrdineReset=Be,window._kitOrdineResetVoce=Oe,window._kitOrderSearch=Te,window._kitOrderHideSearch=Ne,window._kitOrderPick=De,window._kitOrderRemoveRef=Le,window._kitComposeSelect=Ke,window._kitComposeAdd=Pe,window._kitAggiornaCar=zi,window._kitAggiornaPronti=Re,window._kitSetPronti=He,window._kitApriModalSped=Je,window._kitChiudiModalSped=_i,window._kitConfermaSpedizione=We,window._kitApriModalReso=Ye,window._kitChiudiModalReso=xi,window._kitResoQtyChange=Ze,window._kitResoAggiornaBOM=Vt,window._kitConfermaReso=Xe,window._kitSalvaMovimento=Ue,window._kitEliminaMovimento=Qe,window._kitModificaMovimento=Fe,window._kitChiudiModalEditMov=$i,window._kitConfermaModificaMov=Ge,window._kitChiudiModalDelMov=wi,window._kitConfermaEliminaMov=Ci,window._kitSalvaManuale=tn,window._kitElimina=Zn,window._kitDuplicaKit=Xn,window._kitCfgBack=Jn,window._kitCfgSwitchTab=Wn,window._kitCfgSaveNome=Yn,window._kitCfgAddVar=so,window._kitCfgOpenImportModal=Ni,window._kitCfgOpenImportAsseModal=En,window._kitCfgOpenCopySezModal=qn,window._kitCfgCloseImportModal=rt,window._kitCfgSetImportMode=Bn,window._kitCfgSetImportSearch=On,window._kitCfgSelectImportSource=Tn,window._kitCfgSelectImportSection=Nn,window._kitCfgToggleImportTarget=Dn,window._kitCfgSelectAllImportTargets=Ln,window._kitCfgClearImportTargets=Kn,window._kitCfgConfirmImport=Pn,window._kitOpenPresetsModal=Rn,window._kitClosePresetsModal=Di,window._kitSetPresetsSearch=Hn,window._kitSelectPreset=jn,window._kitCreatePresetFromSection=Un,window._kitCreatePreset=Li,window._kitApplyPreset=Qn,window._kitRenamePreset=Vn,window._kitDeletePreset=Fn,window._kitCfgAddAsse=Ki,window._kitCfgUpdateAsse=to,window._kitCfgDelAsse=io,window._kitCfgAddOpzione=eo,window._kitCfgUpdateOpzione=no,window._kitCfgDelOpzione=oo,window._kitCfgAddSez=ao,window._kitCfgImportSez=ro,window._kitCfgUpdateSez=co,window._kitCfgDelSez=lo,window._kitCfgAddComp=po,window._kitCfgUpdateComp=mo,window._kitCfgUpdateCompRule=uo,window._kitCfgToggleCompOption=fo,window._kitCfgToggleCompTracked=go,window._kitCfgDelComp=ko,window._kitCfgAddSA=vo,window._kitCfgAddSAForVariant=yo,window._kitCfgUpdateSA=bo,window._kitCfgDelSA=ho,window._kitSwitchMainTab=K,window._kitRenderKitsGrid=gi,window._kitRenderAnagrafichePage=ki,window._kitRenderDistintePage=vi,window._kitLoadDistinte=st,window._kitSaveDistinte=$t,window._kitCreateDistintaFromDraft=yi,window._kitLoadAnagrafiche=G,window._kitSaveAnagrafiche=Qt,window._kitOpenAnagraficaModal=ze,window._kitCloseAnagraficaModal=bi,window._kitConfirmSaveAnagrafica=we,window._kitDeleteAnagrafica=Ce,window._kitOpenCreaKit=Mi,window._kitCloseCreaKit=Ei,window._kitConfirmCreaKit=hn,window._kitOpenConfigModal=Ai,window._kitCloseConfigModal=en,window._kitRenderConfigModal=U,window._kitCfgModalSwitchTab=on,window._kitCfgModalSaveNome=nn,window._kitCfgModalUpdateSez=an,window._kitCfgModalDelSez=rn,window._kitCfgModalChangeCat=cn,window._kitCfgModalSelectAnag=dn,window._kitCfgModalAddFromCat=sn,window._kitCfgModalAddCompFree=ln,window._kitCfgModalUpdateComp=pn,window._kitCfgModalUpdateCompRule=mn,window._kitCfgModalDelComp=un,window._kitCfgModalAddAsse=fn,window._kitCfgModalDelAsse=gn,window._kitCfgModalUpdateAsse=kn,window._kitCfgModalAddOpz=vn,window._kitCfgModalDelOpz=yn,window._kitCfgModalUpdateOpz=bn,window._kitQAddSezOpen=zn,window._kitQAddSezClose=qi,window._kitQAddSezConfirm=wn,window._kitQAddCompOpen=Cn,window._kitQAddCompToggleSource=qt,window._kitQAddCompChangeCategoria=Bi,window._kitQAddCompClose=Oi,window._kitQAddCompConfirm=$n,window._kitQUpdateComp=_n,window._kitQRenomeSez=xn,window._kitQDelComp=Sn,window._kitQDelSez=In,window._kitQDelKit=An,window._kitRenderHeaderActions=Ut,window._kitOpenSaveDistintaModal=zo,window._kitCloseSaveDistintaModal=Bt,window._kitConfirmSaveDistinta=wo,window._kitDistintaOpenPrint=$e,window._kitDistintaApplyToDraft=_e,window._kitDistintaDelete=xe}var Ot,ht,Zt,Jt,Xt,Tt,Ji,ti,Wi,ii,Yi,Et,it,gt,Mt,H,kt,Yt,L,hi,Si,et,$,B,dt,V,Ii,Eo,Co=Ui(()=>{Qi();Fi();Gi();Vi();Ot="_mlKitData",ht="_mlKitDataTs",Zt="_mlKitOrderDrafts",Jt="_mlKitOrderDraftSeq",Xt="_mlKitPresetSections",Tt=2,Ji=["pz","mt","cm","mm","kg","g","lt","ml"],ti="_mlKitDistinte",Wi="_mlKitDistinteTs",ii="_mlKitAnagrafiche",Yi="_mlKitAnagraficheTs",Et=!1,it=[],gt=null,Mt={},H="kits";kt={};Yt=null;L=null,hi="ordine";Si=null,et="info",$=null,B=null,dt={kitId:null,sezId:null},V=null,Ii="bom";Eo=mt});Co();export{mt as caricaKitProdotti,Eo as default,Mo as registerGlobals,Ao as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-I7XUJ7CD.js.map
