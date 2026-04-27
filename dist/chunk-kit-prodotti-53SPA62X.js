import{a as mi,c as bt,e as ui,f as a,g as C,h as ot,l as fi,m as Y,q as gi,r as yt,u as ki}from"./chunk-chunk-55SFP7PR.js";function un(){zt=!1}function j(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function Q(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function W(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function kt(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function bi(t,i){let n="opz"+(i+1),e=j(t?.key,n);return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function yi(t,i){let n="asse"+(i+1),e=j(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,r)=>bi(s,r)).filter(Boolean):[];return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function Ht(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function hi(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function Vt(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let r of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:r.id,opzioneKey:r.key,opzioneNome:r.nome,opzioneCodice:String(r.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:Ht(e.selections),nome:hi(e.selections),selections:e.selections}})}function zi(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||_()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:kt(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:Q(t?.qtaBase)}}function wi(t){return{id:String(t?.id||_()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(zi):[]}}function Ci(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function jt(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:Q(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||Q(Object.values(t?.qtaPerVariante||{})[0])};let e=A(i);if(!e.length)return n;let o=e.filter(c=>N(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>N(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>N(t,c.key)))};let r=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:r};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let p of c.opzioni||[]){let u=new Set(e.filter(b=>(b.selections||[]).some(g=>g.asseId===c.id&&g.opzioneId===p.id)).map(b=>b.key));if(!u.size)continue;[...u].every(b=>N(t,b)===r)&&l.push(p.id)}if(!l.length)continue;let m=new Set(e.filter(p=>(p.selections||[]).some(u=>u.asseId===c.id&&l.includes(u.opzioneId))).map(p=>p.key));if(Ci(m,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:r}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:r}}function $t(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=Q(n.qtyBase);if(!o)return e;for(let s of A(i)){let r=n.tipo==="sempre";n.tipo==="gruppo"&&(r=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),r&&(e[s.key]=o)}return e}function $i(t,i){let n=wi(t);return n.componenti=n.componenti.map(function(e){let o=jt(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:$t(e,i,o)}}),n}function _i(t,i){let n=A(i);if(!n.length)return null;let e=null;for(let o of n){let s=N(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function Si(t,i,n){let e=A(n),o={},s=_i(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let r of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},r.key)?N(t,r.key):s!==null?s:0;c>0&&(o[r.key]=c)}return{id:_(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:St(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:kt(t?.unitaMisura,K(t)?"flag":"pz")}}function mt(t,i,n){return{id:_(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>Si(e,i,n)):[]}}function Ut(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=j(t?.key||String(t?.nome||"asse"),"asse1"),s=o,r=1;for(;e.has(s);)s=o+"_c"+r++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],m="opz"+(c+1),p=j(l?.key,m),u=1;for(;d.some(k=>k.key===p);)p=p+"_c"+u++;d.push({id:_(),key:p,nome:String(l?.nome||"").trim()||p,codice:String(l?.codice||"").trim()})}return{id:_(),key:s,nome:String(t?.nome||"").trim()||s,opzioni:d}}function _t(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function rt(t,i){let n=new Set(A(t).map(s=>s.key)),e=A(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function ut(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function Ii(t,i){return{id:String(t?.id||_()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function Ft(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(p,u){let k="v"+(u+1),b=j(p?.key,k);return{id:String(p?.id||_()),key:b,nome:String(p?.nome||b).trim()||b}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((p,u)=>yi(p,u)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(p){return{id:p.id,key:p.key,nome:p.nome}})}]:[],s=Vt(o),r=s.length?s:n,d=new Set(r.map(p=>p.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(p){d.has(p[0])&&(c[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0))});for(let p of r)c[p.key]===void 0&&(c[p.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(p=>Ii(p,r[0]?.key||"")).filter(p=>!p.varianteKey||d.has(p.varianteKey)):[],m={};return Object.entries(i.pronti||{}).forEach(function(p){m[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0)}),{id:String(i.id||_()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Ct,assiConfigurazione:o,varianti:r,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(p=>$i(p,{assiConfigurazione:o,varianti:r})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function A(t){return Array.isArray(t?.varianti)?t.varianti:[]}function K(t){return!!t&&t.modoComponente==="segnalazione"}function St(t){return!!t&&t.tracciabile!==!1&&!K(t)}function N(t,i){let n=Q(t?.qtaPerVariante?.[i]);return K(t)?n>0?1:0:n}function It(t,i){return jt(t,i)}function Qt(){try{let t=localStorage.getItem(Rt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function xi(t){try{localStorage.setItem(Rt,JSON.stringify(t||{}))}catch{}}function ct(){try{let t=localStorage.getItem(Dt),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function xt(t){try{localStorage.setItem(Dt,JSON.stringify(t||[]))}catch{}}function X(t){return String(t||"").trim().toUpperCase()}function dt(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(X).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function tt(t){return dt(t?._meta||{})}function At(t,i){return t._meta=dt(i),t._meta}function G(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function Gt(){let t=1;try{t=(Number.parseInt(localStorage.getItem(Pt),10)||0)+1,localStorage.setItem(Pt,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function Ai(t){let i=tt(t);return i.documento||(i.documento=Gt(),At(t,i)),i.documento}function Tt(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:X(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function Jt(){return F.length?Promise.resolve(F):Array.isArray(window._attiviProd)&&window._attiviProd.length?(F=Tt(window._attiviProd),Promise.resolve(F)):st||(st=fetch(bt,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(F=Tt(t),F)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){st=null}),st)}function Mi(t){let i=X(t);return i&&F.find(n=>n.ordine===i)||null}function Yt(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=X(e);return o?i[o]?String(i[o]||"").trim():String(Mi(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function ft(t){let i=Qt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of A(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=dt(n._meta||{}),e}function D(t,i){let{kits:n}=h(),e=n.find(m=>m.id===t);if(!e)return;let o=Qt(),s=ft(e);i(s,e);let r={},d=!1;for(let m of A(e)){let p=Math.max(0,Number.parseInt(s[m.key],10)||0);r[m.key]=p,p>0&&(d=!0)}let c=dt(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(c.documento||(c.documento=Gt()),r._meta=c),d||l?o[t]=r:delete o[t],xi(o),E===t&&T()}function Oi(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function Mt(t){let i=at[t.id]&&typeof at[t.id]=="object"?at[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return at[t.id]=n,n}function Wt(t,i){let n=t.assiConfigurazione||[];if(!n.length)return A(t)[0]||null;let e=[];for(let s of n){let r=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===r);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=Ht(e);return A(t).find(s=>s.key===o)||null}function Ei(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function qi(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let r of s.componenti||[])if(!K(r)&&!(N(r,i.key)<=0)&&r.applicazioneTipo==="gruppo"&&String(r.applicazioneAsseId||"")===e&&Array.isArray(r.applicazioneOpzioneIds)&&r.applicazioneOpzioneIds.includes(o))return!0;return!1}function Ni(t,i,n){let e=[],o=new Map;for(let s of i){let r=G(n,s.key);if(r)for(let d of s.selections||[]){if(qi(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=r;continue}let m={id:"sel-"+c,nome:Ei(d),codice:String(d?.opzioneCodice||"").trim(),totale:r,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,m),e.push(m)}}return e}function Zt(t,i){let n=A(t).filter(r=>G(i,r.key)>0),e=[],o=[],s=Ni(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let r of t.sezioni||[]){let d=[];for(let c of r.componenti||[]){let l=0,m=[];for(let u of n){let k=G(i,u.key),b=N(c,u.key);!k||!b||(K(c)?l+=k:l+=k*b,m.push({nome:u.nome,pezziOrdine:k,coeff:b}))}if(!m.length)continue;let p=m.length===1?m[0].nome:m.length+" configurazioni";if(K(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:p});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:p})}d.length&&e.push({id:r.id,nome:r.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:Oi(i),totaleRighe:e.reduce((r,d)=>r+d.righe.length,0)}}function Ki(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function Bi(){return String(window._distintaHeaderAzienda||"").trim()}function Pi(t,i,n){let e=new Date,o=tt(n),s=Bi(),r=String(o.documento||"").trim(),d=s?s.split(/\r?\n/).map(k=>`<div>${a(k)}</div>`).join(""):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),m=i.selectedVarianti.length?i.selectedVarianti.map(k=>{let b=G(n,k.key);return`<tr>
                <td>${a(W(b))}</td>
                <td>${a(k.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',p=i.sezioni.map(k=>{let b=k.righe.map(g=>{let w=[g.dettaglio,g.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${a(String(g.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${a(g.nome)}</div></td>
                <td class="db-print-cell-unit">${a(g.unita)}</td>
                <td class="db-print-cell-qty">${a(W(g.totale))}</td>
                <td class="db-print-cell-note">${w?a(w):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${a(k.nome)}</td></tr>${b}`}).join(""),u=i.avvisi.length?i.avvisi.map(k=>`<div class="db-print-alert ${k.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${a(k.nome)}</div>
                <div>${a(k.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${a(W(k.totaleCoinvolto))} pz \xB7 ${a(k.variantiLabel)}</div>
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
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${a(Ki(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${a(Y?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${a(W(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${a(W(i.totaleRighe))}</div></div>
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
</html>`}function Ti(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=ft(n),o=Zt(n,e);if(!o.totalePezzi||!o.totaleRighe){C("Componi prima un ordine per generare la distinta stampabile.","warning");return}tt(e).documento||(D(t,function(r){Ai(r)}),e=ft(n));let s=window.open("","_blank");if(!s){C("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(Pi(n,o,e)),s.document.close(),s.focus()}function h(){try{let t=localStorage.getItem(wt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(Ft):[]}}catch{return{kits:[]}}}function x(t){let i=Array.isArray(t)?t.map(Ft):[];try{localStorage.setItem(wt,JSON.stringify({kits:i})),localStorage.setItem(pt,Date.now())}catch{}Li(i)}function Li(t){clearTimeout(Lt),Lt=setTimeout(function(){yt({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function Ri(t){fetch(bt,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(pt)||0);if(n>0&&n>e){try{localStorage.setItem(wt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(pt,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function _(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function Ot(){if(!Y||!Y.nome)return!1;let t=String(Y.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||Y.ruolo==="MASTER"}function Di(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(K(e)){i[e.id]=0;continue}let o=0;for(let[s,r]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(r,10)||0)*N(e,s);i[e.id]=o}return i}function Hi(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let r of s.componenti||[]){if(K(r))continue;let d=N(r,o);d>0&&(i[r.id]=(i[r.id]||0)+e*d)}}return i}function Xt(t,i){let n=A(t).find(e=>e.key===i);return n?a(n.nome):a(i)}function Et(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function it(){zt||(zt=!0,Ri(function(e){e&&it()}));let{kits:t}=h(),i=document.getElementById("contenitore-dati"),n=t.map(e=>{let s=A(e).length,r=(e.assiConfigurazione||[]).length,d=(e.sezioni||[]).reduce((c,l)=>c+(l.componenti||[]).length,0);return`
        <div class="kit-card" onclick="_kitOpenView('${a(e.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${a(e.nome)}</span>
                <button type="button" class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${a(e.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
            </div>
            <div class="kit-card-meta">
                <span class="kit-meta-pill"><i class="fas fa-sliders"></i> ${r} ass${r===1?"e":"i"}</span>
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
    </div>`;try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else ot(i)}catch{ot(i)}}function Vi(t){E=t,ti="ordine",T()}function T(){let{kits:t}=h(),i=t.find(g=>g.id===E);if(!i){it();return}let n=document.getElementById("contenitore-dati"),e=A(i),o=ft(i),s=tt(o),r=Zt(i,o),d=r.selectedVarianti.length?r.selectedVarianti.map(g=>`<span class="kit-meta-pill"><strong>${G(o,g.key)}</strong> \xD7 ${a(g.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=s.ordiniCliente.length?s.ordiniCliente.map(g=>`<span class="kit-order-ref-chip">${a(g)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(g)})' aria-label="Rimuovi ordine ${a(g)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=Mt(i),m=Wt(i,l),p=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(g=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${a(g.nome)}</div>
                <div class="kit-compose-options">${(g.opzioni||[]).map(w=>`
                        <button type="button" class="kit-compose-option ${l[g.id]===w.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${a(i.id)}','${a(g.id)}','${a(w.id)}')">
                        ${a(w.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',u=r.selectedVarianti.length?r.selectedVarianti.map(g=>{let w=G(o,g.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${a(g.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(g.selections)&&g.selections.length?g.selections.map(B=>a(B.opzioneNome)).join(" \xB7 "):a(g.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(g.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${w}"
                           onchange="_kitOrdineSet('${a(i.id)}','${a(g.key)}',this.value)"
                           oninput="_kitOrdineSet('${a(i.id)}','${a(g.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(g.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${a(i.id)}','${a(g.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,k=r.totalePezzi?r.sezioni.map(g=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${a(g.nome)}</div>
                ${g.righe.map(w=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${a(w.nome)}</div>
                            ${w.dettaglio?`<div class="kit-distinta-row-meta">${a(w.dettaglio)}</div>`:""}
                            ${w.noteConfig?`<div class="kit-distinta-row-note">${a(w.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${W(w.totale)} ${a(w.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,b=r.avvisi.length?r.avvisi.map(g=>`
            <div class="kit-distinta-alert ${g.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${a(g.nome)}</div>
                <div class="kit-distinta-alert-body">${a(g.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${g.totaleCoinvolto} pz \xB7 ${a(g.variantiLabel)}</div>
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
                ${k}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${b}
            </section>
        </div>
    </div>`,ot(n),Jt().catch(()=>{})}function ji(){E=null,it()}function Ui(t){ti=t,T()}function Fi(t){D(t,function(i,n){for(let e of A(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Qi(t,i,n){try{window._kitSuppressNextFade=!0}catch{}D(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function Gi(t,i,n){try{window._kitSuppressNextFade=!0}catch{}D(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function Ji(t){D(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=dt({})})}function Yi(t,i){D(t,function(n){n[i]=0})}function gt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${a(e.ordine)}</span>
            <span class="ac-cliente">${a(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function Wi(t,i){let n=String(i||"").trim().toLowerCase();if(!n){gt(t,[]);return}Jt().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);gt(t,o)})}function Zi(t){setTimeout(function(){gt(t,[])},140)}function Xi(t,i,n){let e=X(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}D(t,function(s){let r=tt(s);r.ordiniCliente=[...new Set(r.ordiniCliente.concat(e))],r.cliente=Yt(r.ordiniCliente,{[e]:n}),At(s,r)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),gt(t,[])}function te(t,i){let n=X(i);try{window._kitSuppressNextFade=!0}catch{}D(t,function(e){let o=tt(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=Yt(o.ordiniCliente),At(e,o)})}function ie(t,i,n){let{kits:e}=h(),o=e.find(r=>r.id===t);if(!o)return;let s=Mt(o);if(s[i]=n,at[t]=s,E===t){try{window._kitSuppressNextFade=!0}catch{}T()}}function ee(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=Wt(n,Mt(n));if(!e){C("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){C("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(ht[t])return;ht[t]=Date.now(),setTimeout(function(){try{delete ht[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}D(t,function(r){r[e.key]=G(r,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function ii(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=h(),s=o.find(w=>w.id===E);if(!s)return;let r=(s.sezioni||[]).find(w=>w.id===n),d=r&&(r.componenti||[]).find(w=>w.id===i);if(!d||!St(d))return;d.caricato=e,x(o);let l=Di(s)[i]||0,m=Math.max(0,l-e),u=Hi(s)[i]||0,k=t.closest("tr");if(!k)return;let b=k.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");b&&(b.textContent=l===0?"\u2014":m,b.className=l===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let g=k.querySelector(".kit-car-liberi");g&&(u>0?(g.textContent=Math.max(0,e-u)+" lib.",g.style.display=""):g.style.display="none")}function ne(t,i,n){let{kits:e}=h(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),x(e),E===t&&T())}function oe(t,i,n){let{kits:e}=h(),o=e.find(r=>r.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),x(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function se(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${a(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${a(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let r=(e.righe||[]).reduce((l,m)=>l+m.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${a(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${a(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
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
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function ae(t,i){let{kits:n}=h(),e=n.find(g=>g.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),r=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),m=(r?.value||"").trim(),p=(e.sezioni||[]).find(g=>g.id===c),u=p&&(p.componenti||[]).find(g=>g.id===d);if(!u||!St(u))return;i==="carico"?u.caricato=(parseInt(u.caricato)||0)+l:u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:m,mat:u.nome,ts:Et()}),x(n),s&&(s.value=1),r&&(r.value="");let k=document.getElementById("kit-mov-list-"+t);k&&(k.innerHTML=se(e,Ot()));let b=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);b&&(b.value=u.caricato,ii(b))}function re(t,i){if(!Ot())return;let{kits:n}=h(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&ce(t,i,o)}function ce(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${a(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${a(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let r=document.getElementById("btn-kit-del-ok");r&&(r.onclick=()=>ni(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function ei(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ni(t,i){ei();let{kits:n}=h(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(r=>r.id===o.sid);for(let r of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===r.cid||l.nome===r.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+r.qty)}for(let r of o.items||[])r.saId&&e.pronti&&(e.pronti[r.saId]=(parseInt(e.pronti[r.saId])||0)+r.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let r of e.sezioni||[]){let d=(r.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=Math.max(0,(parseInt(r.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=(parseInt(r.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),x(n),E===t&&T(),C("Movimento eliminato \u2713")}}function de(t,i){if(!Ot())return;let{kits:n}=h(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let r=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");r&&(r.innerHTML=`<span class="kit-mov-badge ${a(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${a(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function oi(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function le(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);oi();let{kits:e}=h(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let r=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){C("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==r.qty){let l=d-r.qty;for(let m of o.sezioni||[]){let p=(m.componenti||[]).find(u=>u.id===r.cid);if(p){r.tipo==="carico"?p.caricato=Math.max(0,(parseInt(p.caricato)||0)+l):p.caricato=Math.max(0,(parseInt(p.caricato)||0)-l);break}}}o.movimenti[s]={...r,qty:d,nota:c},x(e),E===i&&T(),C("Movimento aggiornato \u2713")}function pe(t){let{kits:i}=h(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){C("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,m=Xt(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${a(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${a(c.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let r=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&r&&(d.value=r.value||""),d&&!r&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function si(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function me(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;si();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=h(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),r=[],d=[];for(let l of n){let m=(o.sottoAssembly||[]).find(u=>u.id===l);if(!m)continue;let p=Number.parseInt(o.pronti?.[l],10)||0;if(p){r.push({saId:l,nome:m.nome,qty:p});for(let u of o.sezioni||[])for(let k of u.componenti||[]){if(K(k))continue;let b=N(k,m.varianteKey);if(!b)continue;let g=p*b;k.caricato=Math.max(0,(parseInt(k.caricato)||0)-g);let w=d.find(B=>B.cid===k.id);w?w.qty+=g:d.push({cid:k.id,mat:k.nome,qty:g})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:r,righe:d,nota:s,ts:Et()}),x(e);let c=r.reduce((l,m)=>l+m.qty,0);C(`Spedizione registrata: ${c} pz \u2713`),E===i&&T()}function ue(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let r=n.sottoAssembly||[];o.innerHTML=r.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':r.map(d=>{let c=Xt(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${a(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${a(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${a(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),qt(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function ai(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function fe(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&qt(e.dataset.kitId)}function qt(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e={};for(let r of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+r.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let m of l.componenti||[]){if(K(m))continue;let p=N(m,r.varianteKey);p&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+c*p})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,r])=>r.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([r,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${a(r)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${a(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function ge(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=h(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;m>0&&o.push({saId:l.id,nome:l.nome,qty:m})}if(!o.length){C("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],r=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let m=l.dataset.cid,p=Number.parseInt(l.dataset.qty,10),u=[...e.sezioni||[]].flatMap(k=>k.componenti||[]).find(k=>k.id===m)?.nome||"?";l.checked?s.push({cid:m,mat:u,qty:p}):r.push({cid:m,mat:u,qty:p})});for(let l of s)for(let m of e.sezioni||[]){let p=(m.componenti||[]).find(u=>u.id===l.cid);if(p){p.caricato=(parseInt(p.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,m)=>l+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:r,nota:d,ts:Et(),totPz:c}),x(n),ai(),C(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),E===i&&T()}function ke(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=h();yt({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(pt,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function ve(){let{kits:t}=h(),i={id:_(),nome:"Nuovo Kit",schemaVersion:Ct,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};t.push(i),x(t),Kt(i.id)}function Kt(t){Nt=t,H="info",V()}function vt(t,i,n=""){let{kits:e}=h(),o=e.find(c=>c.id===t),s=e.find(c=>c.id!==t&&(c.sezioni||[]).length),r=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?r:s?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function ri(t){y=vt(t,"import"),R(!0)}function be(t){y=vt(t,"import-asse"),R(!0)}function ye(t,i){y=vt(t,"copy",i),R(!0)}function Z(){let t=document.getElementById("modal-kit-import");y=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function he(t){if(!y||t!=="import"&&t!=="copy"||y.mode===t)return;let i=y.currentKitId,n=t==="copy"?y.sectionId:"";y=vt(i,t,n),R()}function ze(t){y&&(y.search=String(t||""),R())}function we(t){if(!y)return;let{kits:i}=h(),n=i.find(e=>e.id===t);y.sourceKitId=t,y.mode==="import-asse"?y.asseId=n?.assiConfigurazione?.[0]?.id||"":y.sectionId=n?.sezioni?.[0]?.id||"",R()}function Ce(t){y&&(y.mode==="import-asse"?y.asseId=t:y.sectionId=t,R())}function $e(t,i){if(!y||y.mode!=="copy")return;let n=new Set(y.targetKitIds||[]);i?n.add(t):n.delete(t),y.targetKitIds=[...n],R()}function _e(){if(!y||y.mode!=="copy")return;let{kits:t}=h(),i=t.filter(e=>e.id!==y.currentKitId&&ut(e.nome,y.search)),n=new Set(y.targetKitIds||[]);for(let e of i)n.add(e.id);y.targetKitIds=[...n],R()}function Se(){!y||y.mode!=="copy"||(y.targetKitIds=[],R())}function R(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!y)return;let{kits:n}=h(),e=y,o=n.find(f=>f.id===e.currentKitId);if(!o){Z();return}let s=[];e.mode==="import"?s=n.filter(f=>f.id!==o.id&&(f.sezioni||[]).length):e.mode==="import-asse"?s=n.filter(f=>f.id!==o.id&&(f.assiConfigurazione||[]).length):s=n.filter(f=>f.id!==o.id&&(f.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!s.some(f=>f.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(f=>f!==o.id&&n.some(S=>S.id===f)));let r=n.find(f=>f.id===e.sourceKitId)||null,d=e.mode==="import-asse"?r?.assiConfigurazione||[]:r?.sezioni||[];e.mode==="import-asse"?d.some(f=>f.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(f=>f.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(r?.assiConfigurazione||[]).find(f=>f.id===e.asseId)||null:_t(r,e.sectionId),l=s.filter(f=>ut(f.nome,e.search)),m=n.filter(f=>f.id!==o.id&&ut(f.nome,e.search)),p=document.getElementById("kit-import-subtitle"),u=document.getElementById("kit-import-search"),k=document.getElementById("kit-import-left-title"),b=document.getElementById("kit-import-right-title"),g=document.getElementById("kit-import-kit-list"),w=document.getElementById("kit-import-section-list"),B=document.getElementById("kit-import-target-wrap"),lt=document.getElementById("kit-import-target-list"),nt=document.getElementById("kit-import-preview"),U=document.getElementById("kit-import-confirm-btn"),v=document.getElementById("kit-import-mode-import"),q=document.getElementById("kit-import-mode-copy");if(!p||!u||!k||!b||!g||!w||!B||!lt||!nt||!U||!v||!q)return;v.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),q.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),u.value=e.search,e.mode==="import"?(p.textContent=`Importa una sezione esistente dentro "${o.nome}".`,u.placeholder="Cerca kit sorgente\u2026",k.textContent="Kit sorgente",b.textContent=r?`Sezioni di ${r.nome}`:"Sezione",B.style.display="none",g.innerHTML=l.length?l.map(f=>{let S=f.id===e.sourceKitId;return`<label class="kit-import-option ${S?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${S?"checked":""}
                           onchange="_kitCfgSelectImportSource('${a(f.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(f.nome)}</span>
                        <span class="kit-import-option-meta">${(f.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(p.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,u.placeholder="Cerca kit destinazione\u2026",k.textContent="Kit sorgente",b.textContent="Sezione da copiare",B.style.display="flex",g.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${a(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,lt.innerHTML=m.length?m.map(f=>{let S=(e.targetKitIds||[]).includes(f.id),P=c?rt(o,f):null,J=`${(f.sezioni||[]).length} sezioni`;return P&&(P.hasTargetVarianti?P.needsReview?J=`${P.exactMatches}/${P.targetCount} combinazioni allineate`:J=`${P.targetCount}/${P.targetCount} combinazioni allineate`:J="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${S?"kit-import-option--active":""}">
                    <input type="checkbox" ${S?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${a(f.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(f.nome)}</span>
                        <span class="kit-import-option-meta">${a(J)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),w.innerHTML=d.length?d.map(f=>{let S=e.mode==="import-asse"?f.id===e.asseId:f.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${S?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${S?"checked":""}
                           onchange="_kitCfgSelectImportSection('${a(f.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(f.nome)}</span>
                        <span class="kit-import-option-meta">${(f.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${S?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${S?"checked":""}
                       onchange="_kitCfgSelectImportSection('${a(f.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(f.nome)}</span>
                    <span class="kit-import-option-meta">${(f.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let L=!1,z="kit-cfg-help kit-import-preview",$="";if(e.mode==="import"){if(!r)$="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)$="Seleziona una sezione da importare nel kit corrente.";else{let f=rt(r,o);L=!0,$=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 importata in <strong>${a(o.nome)}</strong>. `,f.hasTargetVarianti?f.needsReview?(z="kit-cfg-warn kit-import-preview",$+=`${f.exactMatches} combinazioni su ${f.targetCount} risultano allineate: controlla i coefficienti importati.`):$+=`Tutte le ${f.targetCount} combinazioni del kit destinazione risultano allineate.`:(z="kit-cfg-warn kit-import-preview",$+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}U.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")r?c?(L=!0,$=`L'asse <strong>${a(c.nome)}</strong> verr\xE0 importato in <strong>${a(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):$="Seleziona un asse da importare nel kit corrente.":$="Seleziona un kit sorgente per vedere gli assi disponibili.",U.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let f=n.filter(S=>(e.targetKitIds||[]).includes(S.id));if(!c)$="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!f.length)$="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{L=!0;let S=f.filter(P=>rt(o,P).needsReview).length;$=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 copiata in <strong>${f.length}</strong> kit.`,S>0?(z="kit-cfg-warn kit-import-preview",$+=` <strong>${S}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):$+=" Le combinazioni risultano allineate su tutti i kit selezionati."}U.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}nt.className=z,nt.innerHTML=$,U.disabled=!L,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let f=document.getElementById("kit-import-search");f&&f.focus()},40))}function Ie(){if(!y)return;let{kits:t}=h(),i=y,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=_t(e,i.sectionId),s=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!s){C("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(p=>String(p.nome||"").trim().toLowerCase()===String(s.nome||"").trim().toLowerCase()),m=0;if(l){l.opzioni=l.opzioni||[];for(let p of s.opzioni||[]){let u=String(p.codice||"").trim().toLowerCase(),k=!1;if(u&&(k=l.opzioni.some(b=>String(b.codice||"").trim().toLowerCase()===u&&u!=="")),k||(k=l.opzioni.some(b=>String(b.nome||"").trim().toLowerCase()===String(p.nome||"").trim().toLowerCase())),!k){let b=(l.opzioni||[]).length+1;l.opzioni.push({id:_(),key:j(p?.key,"opz"+b),nome:String(p?.nome||"").trim()||"opz"+b,codice:String(p?.codice||"").trim()}),m+=1}}x(t),Z(),V(),m?C(`${m} opzione${m>1?"i":""} aggiunta${m>1?"e":""} all'asse "${s.nome}" \u2713`):C(`Nessuna nuova opzione trovata per l'asse "${s.nome}"`);return}n.assiConfigurazione.push(Ut(s,e,n)),x(t),Z(),V(),C(`Asse "${s.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=rt(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(mt(o,e,n)),x(t),Z(),V();let m="";l.hasTargetVarianti?l.needsReview&&(m=" Controlla le quantit\xE0 sulle combinazioni non allineate."):m=" Definisci poi gli assi del kit per rifinire i coefficienti.",C(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${m}`);return}let r=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!r.length){C("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let d=0;for(let l of r)rt(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(mt(o,e,l));x(t),Z(),V();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xE0.`),C(`Sezione "${o.nome}" copiata in ${r.length} kit \u2713${c}`)}function xe(t){let{kits:i}=h(),n=i.find(e=>e.id===t)||null;O={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},et(!0)}function ci(){let t=document.getElementById("modal-kit-presets");O=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ae(t){O&&(O.search=String(t||""),et())}function Me(t){O&&(O.selectedPresetId=t,et())}function Oe(){if(!O)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){C("Inserisci il nome del preset \u26A0\uFE0F");return}let e=i?.value||"",{kits:o}=h(),s=o.find(c=>c.id===O.currentKitId);if(!s){C("Kit non trovato \u26A0\uFE0F");return}let r=_t(s,e);if(!r){C("Seleziona una sezione valida \u26A0\uFE0F");return}let d=ct();d.push({id:_(),nome:n,sourceKitId:s.id,sezione:JSON.parse(JSON.stringify(r))}),xt(d),C("Preset salvato \u2713"),et()}function Ee(t){if(!O)return;let i=ct(),n=t||O.selectedPresetId,e=i.find(d=>d.id===n);if(!e){C("Seleziona un preset \u26A0\uFE0F");return}let{kits:o}=h(),s=o.find(d=>d.id===O.currentKitId),r=o.find(d=>d.id===e.sourceKitId)||null;if(!s){C("Kit non trovato \u26A0\uFE0F");return}s.sezioni=s.sezioni||[],s.sezioni.push(mt(e.sezione,r,s)),x(o),ci(),V(),C(`Preset "${e.nome}" applicato \u2713`)}function qe(t,i){let n=ct(),e=n.find(o=>o.id===t);if(!e){C("Preset non trovato \u26A0\uFE0F");return}e.nome=String(i||"").trim()||e.nome,xt(n),C("Nome aggiornato \u2713"),et()}function Ne(t){let i=ct().filter(n=>n.id!==t);xt(i),O&&(O.selectedPresetId=""),et(),C("Preset eliminato \u2713")}function et(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!O)return;let n=ct(),e=O,o=h().kits.find(u=>u.id===e.currentKitId),s=n.filter(u=>ut(u.nome,e.search)),r=document.getElementById("preset-list"),d=document.getElementById("preset-preview"),c=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),m=document.getElementById("preset-apply-btn");if(!r||!d||!c||!l||!m)return;r.innerHTML=s.length?s.map(u=>{let k=u.id===e.selectedPresetId;return`<label class="kit-import-option ${k?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${k?"checked":""} onchange="_kitSelectPreset('${a(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let p=n.find(u=>u.id===e.selectedPresetId)||null;if(p){let u=p.sourceKitId&&h().kits.find(k=>k.id===p.sourceKitId)?.nome||"";d.innerHTML=`<div style="padding:6px"><strong>${a(p.nome)}</strong><div style="color:#94a3b8">${a(u)}</div></div>`+(p.sezione?.componenti?.length?`<div>${p.sezione.componenti.map(k=>`<div class="kit-meta-pill">${a(k.nome)}${k.codice?" \xB7 "+a(k.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else d.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;m.disabled=!p,c.value="",l.innerHTML=(o?.sezioni||[]).map(u=>`<option value="${a(u.id)}">${a(u.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("preset-search");u&&u.focus()},40))}function V(){let{kits:t}=h(),i=t.find(v=>v.id===Nt);if(!i){it();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=A(i);H==="sezioni"&&(H="bom"),H==="sa"&&(H="bom");let s=["info","varianti","bom"],r={info:"Prodotto",varianti:"Elettronica selezionabile",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,q)=>v+(q.componenti||[]).length,0),m=c?`
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
        </div>`,u=e.map((v,q)=>{let L=(v.opzioni||[]).map((z,$)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${a(z.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(z.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${a(z.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(z.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${a(i.id)}','${a(v.id)}','${a(z.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${q}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${L||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),k=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xE0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(v=>`<span class="kit-cfg-sa-var-badge" title="${a(v.key)}">${a(v.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",b=`
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
            ${k}
        </div>`,g=(i.sezioni||[]).map((v,q)=>{let L=(v.componenti||[]).map(z=>{let $=K(z),f=It(z,i),S=(e||[]).find(M=>M.id===f.asseId)||null,P=f.tipo==="gruppo"&&S?`<div class="kit-cfg-row">${(S.opzioni||[]).map(M=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${f.opzioneIds.includes(M.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${a(i.id)}','${a(v.id)}','${a(z.id)}','${a(M.id)}',this.checked)">
                        ${a(M.nome)}
                    </label>`).join("")}</div>`:"",J=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(z.id)}','asseId',this.value)">
                        ${e.map(M=>`<option value="${a(M.id)}" ${f.asseId===M.id?"selected":""}>${a(M.nome)}</option>`).join("")}
                   </select>`:"",li=f.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",Bt=$?"flag":kt(z.unitaMisura,"pz"),pi=$?[{value:"flag",label:"Solo avviso"}]:[...new Set([Bt,...vi])].filter(Boolean).map(M=>({value:M,label:M}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${a(z.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${a(z.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','modo','',this.value)">
                        <option value="quantificato" ${$?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${$?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${a(i.id)}','${a(v.id)}','${a(z.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${f.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(z.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','unitaMisura','',this.value)"
                            ${$?"disabled":""}>
                        ${pi.map(M=>`<option value="${a(M.value)}" ${Bt===M.value?"selected":""}>${a(M.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(z.id)}','tipo',this.value)">
                        <option value="sempre" ${f.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${f.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${f.tipo==="gruppo"?J:""}
                </div>
                ${f.tipo==="gruppo"?P:""}
                <input class="kit-cfg-input" value="${a(z.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${$?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${li}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${q}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${a(i.id)}','${a(v.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${L}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),w=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unit\xE0 corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${g}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${a(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,B="";o.length?B=o.map(v=>{let q=(i.sottoAssembly||[]).map((z,$)=>({sa:z,i:$})).filter(({sa:z})=>z.varianteKey===v.key),L=q.map(({sa:z,i:$})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${a(z.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${a(i.id)}',${$},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${a(i.id)}',${$})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${a(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${q.length} part${q.length!==1?"i":"e"}</span>
                </div>
                ${L||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${a(i.id)}','${a(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${a(v.nome)}</button>
            </div>`}).join(""):B='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let lt=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${B}
        </div>`,nt={info:p,varianti:b,bom:w,sa:lt},U=s.map(v=>`<button class="kit-tab ${H===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${r[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${a(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${a(i.nome)}</span>
        </div>
        <div class="kit-tabs">${U}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${nt[H]}</div>
    </div>`,ot(n)}function Ke(t){if(t&&E===t){T();return}E=t,T()}function Be(t){H=t,V()}function I(t,i,n=!0){let{kits:e}=h(),o=e.find(s=>s.id===t);o&&(i(o),x(e),n&&V())}function Pe(t,i){I(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Te(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=h();x(i.filter(n=>n.id!==t)),Nt=null,E=null,it()}function Le(t){let{kits:i}=h(),n=i.find(o=>o.id===t);if(!n)return;let e={id:_(),nome:`Copia di ${n.nome}`,schemaVersion:Ct,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(Ut(o,n,e));e.varianti=Vt(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(mt(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:_(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),x(i),Kt(e.id),C(`Kit "${n.nome}" duplicato \u2713`)}function di(t){I(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:_(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:_(),key:"opz1",nome:"Opzione 1"}]})})}function Re(t,i,n,e){I(t,function(o){let s=(o.assiConfigurazione||[]).find(r=>r.id===i);s&&(n==="key"?s.key=j(e,s.key||"asse"):s[n]=e.trim())})}function De(t,i){I(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function He(t,i){I(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:_(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function Ve(t,i,n,e,o){I(t,function(s){let r=(s.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=j(o,d.key||"opzione"):d[e]=o.trim())})}function je(t,i,n){I(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function Ue(t){di(t)}function Fe(t){I(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:_(),nome:"Nuova sezione",componenti:[]})})}function Qe(t){ri(t)}function Ge(t,i,n,e){I(t,function(o){let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s[n]=e.trim())},!1)}function Je(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&I(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function Ye(t,i){I(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:_(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function We(t,i,n,e,o,s){I(t,function(r){let d=(r.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=Q(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":kt(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function Ze(t,i,n,e,o){I(t,function(s){let r=(s.sezioni||[]).find(l=>l.id===i),d=r&&(r.componenti||[]).find(l=>l.id===n);if(!d)return;let c=It(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=Q(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=$t(d,s,c)})}function Xe(t,i,n,e,o){I(t,function(s){let r=(s.sezioni||[]).find(m=>m.id===i),d=r&&(r.componenti||[]).find(m=>m.id===n);if(!d)return;let c=It(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=$t(d,s,c)})}function tn(t,i,n,e){I(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),r=s&&(s.componenti||[]).find(d=>d.id===n);!r||K(r)||(r.tracciabile=!!e)},!1)}function en(t,i,n){I(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function nn(t){I(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:_(),nome:"",varianteKey:A(i)[0]?.key||""})})}function on(t,i){I(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:_(),nome:"",varianteKey:i,noteConfig:""})})}function sn(t,i,n,e){I(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function an(t,i){I(t,function(n){n.sottoAssembly.splice(i,1)})}function fn(){window._kitOpenView=Vi,window._kitOpenConfig=Kt,window._kitNuovoKit=ve,window._kitBack=ji,window._kitOpenPrintPreview=Ti,window._kitSwitchTab=Ui,window._kitAggiornaQty=Fi,window._kitOrdineSet=Qi,window._kitOrdineDelta=Gi,window._kitOrdineReset=Ji,window._kitOrdineResetVoce=Yi,window._kitOrderSearch=Wi,window._kitOrderHideSearch=Zi,window._kitOrderPick=Xi,window._kitOrderRemoveRef=te,window._kitComposeSelect=ie,window._kitComposeAdd=ee,window._kitAggiornaCar=ii,window._kitAggiornaPronti=ne,window._kitSetPronti=oe,window._kitApriModalSped=pe,window._kitChiudiModalSped=si,window._kitConfermaSpedizione=me,window._kitApriModalReso=ue,window._kitChiudiModalReso=ai,window._kitResoQtyChange=fe,window._kitResoAggiornaBOM=qt,window._kitConfermaReso=ge,window._kitSalvaMovimento=ae,window._kitEliminaMovimento=re,window._kitModificaMovimento=de,window._kitChiudiModalEditMov=oi,window._kitConfermaModificaMov=le,window._kitChiudiModalDelMov=ei,window._kitConfermaEliminaMov=ni,window._kitSalvaManuale=ke,window._kitElimina=Te,window._kitDuplicaKit=Le,window._kitCfgBack=Ke,window._kitCfgSwitchTab=Be,window._kitCfgSaveNome=Pe,window._kitCfgAddVar=Ue,window._kitCfgOpenImportModal=ri,window._kitCfgOpenImportAsseModal=be,window._kitCfgOpenCopySezModal=ye,window._kitCfgCloseImportModal=Z,window._kitCfgSetImportMode=he,window._kitCfgSetImportSearch=ze,window._kitCfgSelectImportSource=we,window._kitCfgSelectImportSection=Ce,window._kitCfgToggleImportTarget=$e,window._kitCfgSelectAllImportTargets=_e,window._kitCfgClearImportTargets=Se,window._kitCfgConfirmImport=Ie,window._kitOpenPresetsModal=xe,window._kitClosePresetsModal=ci,window._kitSetPresetsSearch=Ae,window._kitSelectPreset=Me,window._kitCreatePresetFromSection=Oe,window._kitApplyPreset=Ee,window._kitRenamePreset=qe,window._kitDeletePreset=Ne,window._kitCfgAddAsse=di,window._kitCfgUpdateAsse=Re,window._kitCfgDelAsse=De,window._kitCfgAddOpzione=He,window._kitCfgUpdateOpzione=Ve,window._kitCfgDelOpzione=je,window._kitCfgAddSez=Fe,window._kitCfgImportSez=Qe,window._kitCfgUpdateSez=Ge,window._kitCfgDelSez=Je,window._kitCfgAddComp=Ye,window._kitCfgUpdateComp=We,window._kitCfgUpdateCompRule=Ze,window._kitCfgToggleCompOption=Xe,window._kitCfgToggleCompTracked=tn,window._kitCfgDelComp=en,window._kitCfgAddSA=nn,window._kitCfgAddSAForVariant=on,window._kitCfgUpdateSA=sn,window._kitCfgDelSA=an}var wt,pt,Rt,Pt,Dt,Ct,vi,zt,F,st,ht,at,Lt,E,ti,Nt,H,y,O,gn,rn=mi(()=>{ui();gi();ki();fi();wt="_mlKitData",pt="_mlKitDataTs",Rt="_mlKitOrderDrafts",Pt="_mlKitOrderDraftSeq",Dt="_mlKitPresetSections",Ct=2,vi=["pz","mt","cm","mm","kg","g","lt","ml"],zt=!1,F=[],st=null,ht={};at={};Lt=null;E=null,ti="ordine";Nt=null,H="info",y=null,O=null;gn=it});rn();export{it as caricaKitProdotti,gn as default,fn as registerGlobals,un as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-53SPA62X.js.map
