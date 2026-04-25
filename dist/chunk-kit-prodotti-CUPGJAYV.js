import{a as Ht,c as yt,e as Ut,f as a,g as x,h as tt,l as Qt,m as H,q as Ft,r as ot,u as Gt}from"./chunk-chunk-MVGUZ3SY.js";function qe(){st=!1}function X(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function D(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function U(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function nt(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function Wt(t,i){let n="opz"+(i+1),e=X(t?.key,n);return{id:String(t?.id||I()),key:e,nome:String(t?.nome||e).trim()||e}}function Yt(t,i){let n="asse"+(i+1),e=X(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,r)=>Wt(s,r)).filter(Boolean):[];return{id:String(t?.id||I()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function Ct(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function Xt(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function Zt(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let r of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:r.id,opzioneKey:r.key,opzioneNome:r.nome})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:Ct(e.selections),nome:Xt(e.selections),selections:e.selections}})}function ti(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||I()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:nt(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:D(t?.qtaBase)}}function ii(t){return{id:String(t?.id||I()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(ti):[]}}function ei(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function _t(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:D(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||D(Object.values(t?.qtaPerVariante||{})[0])};let e=_(i);if(!e.length)return n;let o=e.filter(c=>N(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>N(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>N(t,c.key)))};let r=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:r};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let p of c.opzioni||[]){let g=new Set(e.filter(k=>(k.selections||[]).some(z=>z.asseId===c.id&&z.opzioneId===p.id)).map(k=>k.key));if(!g.size)continue;[...g].every(k=>N(t,k)===r)&&l.push(p.id)}if(!l.length)continue;let m=new Set(e.filter(p=>(p.selections||[]).some(g=>g.asseId===c.id&&l.includes(g.opzioneId))).map(p=>p.key));if(ei(m,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:r}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:r}}function ct(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=D(n.qtyBase);if(!o)return e;for(let s of _(i)){let r=n.tipo==="sempre";n.tipo==="gruppo"&&(r=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),r&&(e[s.key]=o)}return e}function ni(t,i){let n=ii(t);return n.componenti=n.componenti.map(function(e){let o=_t(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:ct(e,i,o)}}),n}function oi(t,i){let n=_(i);if(!n.length)return null;let e=null;for(let o of n){let s=N(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function si(t,i,n){let e=_(n),o={},s=oi(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let r of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},r.key)?N(t,r.key):s!==null?s:0;c>0&&(o[r.key]=c)}return{id:I(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:dt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:nt(t?.unitaMisura,B(t)?"flag":"pz")}}function ht(t,i,n){return{id:I(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>si(e,i,n)):[]}}function It(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function W(t,i){let n=new Set(_(t).map(s=>s.key)),e=_(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function at(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function ai(t,i){return{id:String(t?.id||I()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function St(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(p,g){let f="v"+(g+1),k=X(p?.key,f);return{id:String(p?.id||I()),key:k,nome:String(p?.nome||k).trim()||k}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((p,g)=>Yt(p,g)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(p){return{id:p.id,key:p.key,nome:p.nome}})}]:[],s=Zt(o),r=s.length?s:n,d=new Set(r.map(p=>p.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(p){d.has(p[0])&&(c[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0))});for(let p of r)c[p.key]===void 0&&(c[p.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(p=>ai(p,r[0]?.key||"")).filter(p=>!p.varianteKey||d.has(p.varianteKey)):[],m={};return Object.entries(i.pronti||{}).forEach(function(p){m[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0)}),{id:String(i.id||I()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:$t,assiConfigurazione:o,varianti:r,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(p=>ni(p,{assiConfigurazione:o,varianti:r})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function _(t){return Array.isArray(t?.varianti)?t.varianti:[]}function B(t){return!!t&&t.modoComponente==="segnalazione"}function dt(t){return!!t&&t.tracciabile!==!1&&!B(t)}function N(t,i){let n=D(t?.qtaPerVariante?.[i]);return B(t)?n>0?1:0:n}function lt(t,i){return _t(t,i)}function xt(){try{let t=localStorage.getItem(wt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function ri(t){try{localStorage.setItem(wt,JSON.stringify(t||{}))}catch{}}function pt(t){let i=xt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of _(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e}function Q(t,i){let{kits:n}=h(),e=n.find(c=>c.id===t);if(!e)return;let o=xt(),s=pt(e);i(s,e);let r={},d=!1;for(let c of _(e)){let l=Math.max(0,Number.parseInt(s[c.key],10)||0);r[c.key]=l,l>0&&(d=!0)}d?o[t]=r:delete o[t],ri(o),A===t&&T()}function ci(t){return Object.values(t||{}).reduce((i,n)=>i+(Number.parseInt(n,10)||0),0)}function mt(t){let i=J[t.id]&&typeof J[t.id]=="object"?J[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return J[t.id]=n,n}function At(t,i){let n=t.assiConfigurazione||[];if(!n.length)return _(t)[0]||null;let e=[];for(let s of n){let r=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===r);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=Ct(e);return _(t).find(s=>s.key===o)||null}function di(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function li(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let r of s.componenti||[])if(!B(r)&&!(N(r,i.key)<=0)&&r.applicazioneTipo==="gruppo"&&String(r.applicazioneAsseId||"")===e&&Array.isArray(r.applicazioneOpzioneIds)&&r.applicazioneOpzioneIds.includes(o))return!0;return!1}function pi(t,i,n){let e=[],o=new Map;for(let s of i){let r=Number.parseInt(n?.[s.key],10)||0;if(r)for(let d of s.selections||[]){if(li(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=r;continue}let m={id:"sel-"+c,nome:di(d),totale:r,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,m),e.push(m)}}return e}function qt(t,i){let n=_(t).filter(r=>(Number.parseInt(i?.[r.key],10)||0)>0),e=[],o=[],s=pi(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let r of t.sezioni||[]){let d=[];for(let c of r.componenti||[]){let l=0,m=[];for(let g of n){let f=Number.parseInt(i?.[g.key],10)||0,k=N(c,g.key);!f||!k||(B(c)?l+=f:l+=f*k,m.push({nome:g.nome,pezziOrdine:f,coeff:k}))}if(!m.length)continue;let p=m.length===1?m[0].nome:m.length+" configurazioni";if(B(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:p});continue}d.push({id:c.id,nome:c.nome,totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:p})}d.length&&e.push({id:r.id,nome:r.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:ci(i),totaleRighe:e.reduce((r,d)=>r+d.righe.length,0)}}function mi(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function fi(t,i){let n=String(t||"").toUpperCase().replace(/[^A-Z0-9\s]/g," ").trim(),e=n.split(/\s+/).filter(Boolean),o="";return e.length>1?o=e.slice(0,3).map(s=>s[0]).join(""):o=n.replace(/\s+/g,"").slice(0,3),o=(o||"MAT").padEnd(3,"X").slice(0,3),`${o}-${String(i+1).padStart(2,"0")}`}function ui(t,i,n){let e=new Date,o=`DB-${e.toISOString().slice(0,10).replace(/-/g,"")}-${String(t.id||"KIT").slice(-4).toUpperCase()}`,s=new URL("logo.png",window.location.href).href,r=i.selectedVarianti.length?i.selectedVarianti.map(l=>{let m=Number.parseInt(n?.[l.key],10)||0;return`<tr>
                <td>${a(U(m))}</td>
                <td>${a(l.nome)}</td>
                <td>${a(Array.isArray(l.selections)&&l.selections.length?l.selections.map(p=>p.opzioneNome).join(" \xB7 "):l.key)}</td>
            </tr>`}).join(""):'<tr><td colspan="3">Nessuna configurazione selezionata.</td></tr>',d=i.sezioni.map(l=>{let m=l.righe.map((p,g)=>{let f=[p.dettaglio,p.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${a(fi(l.nome,g))}</td>
                <td>
                    <div class="db-print-row-name">${a(p.nome)}</div>
                    <div class="db-print-row-sub">${a(l.nome)}</div>
                </td>
                <td class="db-print-cell-unit">${a(p.unita)}</td>
                <td class="db-print-cell-qty">${a(U(p.totale))}</td>
                <td class="db-print-cell-note">${f?a(f):"\u2014"}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${a(l.nome)}</td></tr>${m}`}).join(""),c=i.avvisi.length?i.avvisi.map(l=>`<div class="db-print-alert ${l.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${a(l.nome)}</div>
                <div>${a(l.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${a(U(l.totaleCoinvolto))} pz \xB7 ${a(l.variantiLabel)}</div>
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
        .db-print-brand {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
        }
        .db-print-logo {
            width: 52px;
            height: 52px;
            object-fit: contain;
            border-radius: 14px;
            border: 1px solid var(--line);
            padding: 6px;
            background: #fff;
        }
        .db-print-brand-name {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: var(--brand);
        }
        .db-print-brand-sub {
            font-size: 11px;
            color: var(--muted);
            margin-top: 4px;
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
        .db-print-row-sub { margin-top: 3px; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
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
        .db-print-footer {
            margin-top: 18px;
            border-top: 1px solid var(--line);
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            font-size: 10px;
            color: var(--muted);
        }
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
                <div class="db-print-brand">
                    <img class="db-print-logo" src="${a(s)}" alt="Logo PROD">
                    <div>
                        <div class="db-print-brand-name">PROD</div>
                        <div class="db-print-brand-sub">Dashboard Produzione \xB7 Distinta base approvvigionamento</div>
                    </div>
                </div>
                <div class="db-print-title-block">
                    <div class="db-print-title">Distinta Base</div>
                    <div class="db-print-subtitle">Documento interno di produzione e approvvigionamento</div>
                </div>
            </div>

            <div class="db-print-meta-grid">
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Prodotto</div><div class="db-print-meta-value">${a(t.nome)}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Riferimento</div><div class="db-print-meta-value">${a(o)}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${a(mi(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${a(H?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${a(U(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${a(U(i.totaleRighe))}</div></div>
                </div>
            </div>

            <div class="db-print-strip">
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Documento</div>
                    <div class="db-print-strip-value">${a(o)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Prodotto</div>
                    <div class="db-print-strip-value">${a(t.nome)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Um ordine</div>
                    <div class="db-print-strip-value">N.</div>
                </div>
            </div>

            <div class="db-print-config-title">Configurazioni incluse nell'ordine</div>
            <table class="db-print-config-table">
                <thead>
                    <tr>
                        <th style="width:72px">Q.t\xE0</th>
                        <th>Configurazione</th>
                        <th>Riferimenti elettronici</th>
                    </tr>
                </thead>
                <tbody>${r}</tbody>
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
                <tbody>${d}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${c}</div>

            <div class="db-print-footer">
                <div>Documento generato da PROD - Dashboard Produzione</div>
                <div>Verifica quantit\xE0 e avvisi prima della stampa definitiva</div>
            </div>
        </div>
    </div>
</body>
</html>`}function gi(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=pt(n),o=qt(n,e);if(!o.totalePezzi||!o.totaleRighe){x("Componi prima un ordine per generare la distinta stampabile.","warning");return}let s=window.open("","_blank");if(!s){x("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(ui(n,o,e)),s.document.close(),s.focus()}function h(){try{let t=localStorage.getItem(rt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(St):[]}}catch{return{kits:[]}}}function M(t){let i=Array.isArray(t)?t.map(St):[];try{localStorage.setItem(rt,JSON.stringify({kits:i})),localStorage.setItem(it,Date.now())}catch{}ki(i)}function ki(t){clearTimeout(zt),zt=setTimeout(function(){ot({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function vi(t){fetch(yt,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(it)||0);if(n>0&&n>e){try{localStorage.setItem(rt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(it,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function I(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function ft(){if(!H||!H.nome)return!1;let t=String(H.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||H.ruolo==="MASTER"}function bi(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(B(e)){i[e.id]=0;continue}let o=0;for(let[s,r]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(r,10)||0)*N(e,s);i[e.id]=o}return i}function yi(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let r of s.componenti||[]){if(B(r))continue;let d=N(r,o);d>0&&(i[r.id]=(i[r.id]||0)+e*d)}}return i}function Mt(t,i){let n=_(t).find(e=>e.key===i);return n?a(n.nome):a(i)}function ut(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function F(){st||(st=!0,vi(function(e){e&&F()}));let{kits:t}=h(),i=document.getElementById("contenitore-dati"),n=t.map(e=>{let s=_(e).length,r=(e.assiConfigurazione||[]).length,d=(e.sezioni||[]).reduce((c,l)=>c+(l.componenti||[]).length,0);return`
        <div class="kit-card" onclick="_kitOpenView('${a(e.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${a(e.nome)}</span>
                <button class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${a(e.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
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
            <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>
        </div>
        ${t.length===0?`<div class="kit-empty-state">
                <i class="fas fa-box-open kit-empty-icon"></i>
                <p>Nessun kit configurato.</p>
                <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
               </div>`:`<div class="kit-grid">${n}</div>`}
    </div>`,tt(i)}function hi(t){A=t,Et="ordine",T()}function T(){let{kits:t}=h(),i=t.find(f=>f.id===A);if(!i){F();return}let n=document.getElementById("contenitore-dati"),e=_(i),o=pt(i),s=qt(i,o),r=s.selectedVarianti.length?s.selectedVarianti.map(f=>`<span class="kit-meta-pill"><strong>${o[f.key]||0}</strong> \xD7 ${a(f.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',d=mt(i),c=At(i,d),l=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(f=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${a(f.nome)}</div>
                <div class="kit-compose-options">${(f.opzioni||[]).map(k=>`
                    <button class="kit-compose-option ${d[f.id]===k.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${a(i.id)}','${a(f.id)}','${a(k.id)}')">
                        ${a(k.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',m=s.selectedVarianti.length?s.selectedVarianti.map(f=>{let k=Number.parseInt(o[f.key],10)||0;return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${a(f.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(f.selections)&&f.selections.length?f.selections.map(z=>a(z.opzioneNome)).join(" \xB7 "):a(f.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(f.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${k}"
                           onchange="_kitOrdineSet('${a(i.id)}','${a(f.key)}',this.value)"
                           oninput="_kitOrdineSet('${a(i.id)}','${a(f.key)}',this.value)">
                    <button class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(f.key)}',1)">+</button>
                    <button class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${a(i.id)}','${a(f.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,p=s.totalePezzi?s.sezioni.map(f=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${a(f.nome)}</div>
                ${f.righe.map(k=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${a(k.nome)}</div>
                            ${k.dettaglio?`<div class="kit-distinta-row-meta">${a(k.dettaglio)}</div>`:""}
                            ${k.noteConfig?`<div class="kit-distinta-row-note">${a(k.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${U(k.totale)} ${a(k.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,g=s.avvisi.length?s.avvisi.map(f=>`
            <div class="kit-distinta-alert ${f.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${a(f.nome)}</div>
                <div class="kit-distinta-alert-body">${a(f.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${f.totaleCoinvolto} pz \xB7 ${a(f.variantiLabel)}</div>
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
                <div class="kit-order-summary-actions">
                    <button class="kit-btn-secondary" onclick="_kitOpenPrintPreview('${a(i.id)}')"><i class="fas fa-print"></i> Anteprima stampa</button>
                    <button class="kit-btn-secondary" onclick="_kitOrdineReset('${a(i.id)}')"><i class="fas fa-rotate-left"></i> Azzera ordine</button>
                </div>
            </div>
            <div class="kit-order-summary-note">Questa bozza ordine resta locale sul dispositivo e serve solo per generare la distinta base di approvvigionamento.</div>
            <div class="kit-order-summary-badges">${r}</div>
        </div>

        <div class="kit-order-layout">
            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-hand-pointer"></i> Componi ordine</div>
                <div class="kit-cfg-help">Scegli i pulsanti dell'elettronica, inserisci la quantit\xE0 e aggiungi quella configurazione all'ordine.</div>
                <div class="kit-compose-builder">
                    ${l}
                    <div class="kit-compose-footer">
                        <div class="kit-compose-selected">
                            <div class="kit-compose-selected-label">Configurazione pronta</div>
                            <div class="kit-compose-selected-name">${c?a(c.nome):"Completa prima tutte le scelte"}</div>
                        </div>
                        <div class="kit-order-stepper">
                            <input class="kit-order-stepper-input" id="kit-compose-qty-${a(i.id)}" type="number" min="1" value="1">
                            <button class="kit-spedisci-btn" onclick="_kitComposeAdd('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
                        </div>
                    </div>
                </div>
                <div class="kit-order-lines">${m}</div>
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
    </div>`,tt(n)}function zi(){A=null,F()}function wi(t){Et=t,T()}function $i(t){Q(t,function(i,n){for(let e of _(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Ci(t,i,n){Q(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function _i(t,i,n){Q(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function Ii(t){Q(t,function(i){for(let n of Object.keys(i))i[n]=0})}function Si(t,i){Q(t,function(n){n[i]=0})}function xi(t,i,n){let{kits:e}=h(),o=e.find(r=>r.id===t);if(!o)return;let s=mt(o);s[i]=n,J[t]=s,A===t&&T()}function Ai(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=At(n,mt(n));if(!e){x("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){x("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}Q(t,function(r){r[e.key]=(Number.parseInt(r[e.key],10)||0)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function Nt(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=h(),s=o.find(q=>q.id===A);if(!s)return;let r=(s.sezioni||[]).find(q=>q.id===n),d=r&&(r.componenti||[]).find(q=>q.id===i);if(!d||!dt(d))return;d.caricato=e,M(o);let l=bi(s)[i]||0,m=Math.max(0,l-e),g=yi(s)[i]||0,f=t.closest("tr");if(!f)return;let k=f.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");k&&(k.textContent=l===0?"\u2014":m,k.className=l===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let z=f.querySelector(".kit-car-liberi");z&&(g>0?(z.textContent=Math.max(0,e-g)+" lib.",z.style.display=""):z.style.display="none")}function qi(t,i,n){let{kits:e}=h(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),M(e),A===t&&T())}function Mi(t,i,n){let{kits:e}=h(),o=e.find(r=>r.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),M(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function Ei(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button class="kit-mov-del" onclick="_kitEliminaMovimento('${a(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button class="kit-mov-edit" onclick="_kitModificaMovimento('${a(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let r=(e.righe||[]).reduce((l,m)=>l+m.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${a(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${a(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
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
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function Ni(t,i){let{kits:n}=h(),e=n.find(z=>z.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),r=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),m=(r?.value||"").trim(),p=(e.sezioni||[]).find(z=>z.id===c),g=p&&(p.componenti||[]).find(z=>z.id===d);if(!g||!dt(g))return;i==="carico"?g.caricato=(parseInt(g.caricato)||0)+l:g.caricato=Math.max(0,(parseInt(g.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:m,mat:g.nome,ts:ut()}),M(n),s&&(s.value=1),r&&(r.value="");let f=document.getElementById("kit-mov-list-"+t);f&&(f.innerHTML=Ei(e,ft()));let k=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);k&&(k.value=g.caricato,Nt(k))}function Bi(t,i){if(!ft())return;let{kits:n}=h(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&Oi(t,i,o)}function Oi(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${a(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${a(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let r=document.getElementById("btn-kit-del-ok");r&&(r.onclick=()=>Ot(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Bt(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ot(t,i){Bt();let{kits:n}=h(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(r=>r.id===o.sid);for(let r of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===r.cid||l.nome===r.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+r.qty)}for(let r of o.items||[])r.saId&&e.pronti&&(e.pronti[r.saId]=(parseInt(e.pronti[r.saId])||0)+r.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let r of e.sezioni||[]){let d=(r.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=Math.max(0,(parseInt(r.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=(parseInt(r.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),M(n),A===t&&T(),x("Movimento eliminato \u2713")}}function Ti(t,i){if(!ft())return;let{kits:n}=h(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let r=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");r&&(r.innerHTML=`<span class="kit-mov-badge ${a(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${a(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function Tt(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ki(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);Tt();let{kits:e}=h(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let r=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){x("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==r.qty){let l=d-r.qty;for(let m of o.sezioni||[]){let p=(m.componenti||[]).find(g=>g.id===r.cid);if(p){r.tipo==="carico"?p.caricato=Math.max(0,(parseInt(p.caricato)||0)+l):p.caricato=Math.max(0,(parseInt(p.caricato)||0)-l);break}}}o.movimenti[s]={...r,qty:d,nota:c},M(e),A===i&&T(),x("Movimento aggiornato \u2713")}function Li(t){let{kits:i}=h(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){x("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,m=Mt(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${a(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${a(c.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let r=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&r&&(d.value=r.value||""),d&&!r&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function Kt(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ri(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;Kt();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=h(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),r=[],d=[];for(let l of n){let m=(o.sottoAssembly||[]).find(g=>g.id===l);if(!m)continue;let p=Number.parseInt(o.pronti?.[l],10)||0;if(p){r.push({saId:l,nome:m.nome,qty:p});for(let g of o.sezioni||[])for(let f of g.componenti||[]){if(B(f))continue;let k=N(f,m.varianteKey);if(!k)continue;let z=p*k;f.caricato=Math.max(0,(parseInt(f.caricato)||0)-z);let q=d.find(K=>K.cid===f.id);q?q.qty+=z:d.push({cid:f.id,mat:f.nome,qty:z})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:r,righe:d,nota:s,ts:ut()}),M(e);let c=r.reduce((l,m)=>l+m.qty,0);x(`Spedizione registrata: ${c} pz \u2713`),A===i&&T()}function Pi(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let r=n.sottoAssembly||[];o.innerHTML=r.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':r.map(d=>{let c=Mt(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${a(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${a(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${a(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),gt(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Lt(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Di(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&gt(e.dataset.kitId)}function gt(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e={};for(let r of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+r.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let m of l.componenti||[]){if(B(m))continue;let p=N(m,r.varianteKey);p&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+c*p})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,r])=>r.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([r,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${a(r)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${a(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function Vi(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=h(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;m>0&&o.push({saId:l.id,nome:l.nome,qty:m})}if(!o.length){x("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],r=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let m=l.dataset.cid,p=Number.parseInt(l.dataset.qty,10),g=[...e.sezioni||[]].flatMap(f=>f.componenti||[]).find(f=>f.id===m)?.nome||"?";l.checked?s.push({cid:m,mat:g,qty:p}):r.push({cid:m,mat:g,qty:p})});for(let l of s)for(let m of e.sezioni||[]){let p=(m.componenti||[]).find(g=>g.id===l.cid);if(p){p.caricato=(parseInt(p.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,m)=>l+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:r,nota:d,ts:ut(),totPz:c}),M(n),Lt(),x(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),A===i&&T()}function ji(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=h();ot({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(it,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function Hi(){let{kits:t}=h(),i={id:I(),nome:"Nuovo Kit",schemaVersion:$t,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};t.push(i),M(t),Rt(i.id)}function Rt(t){kt=t,P="info",Y()}function vt(t,i,n=""){let{kits:e}=h(),o=e.find(d=>d.id===t),s=e.find(d=>d.id!==t&&(d.sezioni||[]).length),r=o?.sezioni?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?r:s?.sezioni?.[0]?.id||""),targetKitIds:[]}}function Pt(t){b=vt(t,"import"),R(!0)}function Ui(t,i){b=vt(t,"copy",i),R(!0)}function et(){let t=document.getElementById("modal-kit-import");b=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Qi(t){if(!b||t!=="import"&&t!=="copy"||b.mode===t)return;let i=b.currentKitId,n=t==="copy"?b.sectionId:"";b=vt(i,t,n),R()}function Fi(t){b&&(b.search=String(t||""),R())}function Gi(t){if(!b)return;let{kits:i}=h(),n=i.find(e=>e.id===t);b.sourceKitId=t,b.sectionId=n?.sezioni?.[0]?.id||"",R()}function Ji(t){b&&(b.sectionId=t,R())}function Wi(t,i){if(!b||b.mode!=="copy")return;let n=new Set(b.targetKitIds||[]);i?n.add(t):n.delete(t),b.targetKitIds=[...n],R()}function Yi(){if(!b||b.mode!=="copy")return;let{kits:t}=h(),i=t.filter(e=>e.id!==b.currentKitId&&at(e.nome,b.search)),n=new Set(b.targetKitIds||[]);for(let e of i)n.add(e.id);b.targetKitIds=[...n],R()}function Xi(){!b||b.mode!=="copy"||(b.targetKitIds=[],R())}function R(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!b)return;let{kits:n}=h(),e=b,o=n.find(u=>u.id===e.currentKitId);if(!o){et();return}let s=n.filter(u=>u.id!==o.id&&(u.sezioni||[]).length);e.mode==="import"&&!s.some(u=>u.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(u=>u!==o.id&&n.some(C=>C.id===u)));let r=n.find(u=>u.id===e.sourceKitId)||null,d=r?.sezioni||[];d.some(u=>u.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=It(r,e.sectionId),l=s.filter(u=>at(u.nome,e.search)),m=n.filter(u=>u.id!==o.id&&at(u.nome,e.search)),p=document.getElementById("kit-import-subtitle"),g=document.getElementById("kit-import-search"),f=document.getElementById("kit-import-left-title"),k=document.getElementById("kit-import-right-title"),z=document.getElementById("kit-import-kit-list"),q=document.getElementById("kit-import-section-list"),K=document.getElementById("kit-import-target-wrap"),Z=document.getElementById("kit-import-target-list"),G=document.getElementById("kit-import-preview"),V=document.getElementById("kit-import-confirm-btn"),v=document.getElementById("kit-import-mode-import"),E=document.getElementById("kit-import-mode-copy");if(!p||!g||!f||!k||!z||!q||!K||!Z||!G||!V||!v||!E)return;v.classList.toggle("kit-import-mode-btn--active",e.mode==="import"),E.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),g.value=e.search,e.mode==="import"?(p.textContent=`Importa una sezione esistente dentro "${o.nome}".`,g.placeholder="Cerca kit sorgente\u2026",f.textContent="Kit sorgente",k.textContent=r?`Sezioni di ${r.nome}`:"Sezione",K.style.display="none",z.innerHTML=l.length?l.map(u=>{let C=u.id===e.sourceKitId;return`<label class="kit-import-option ${C?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${C?"checked":""}
                           onchange="_kitCfgSelectImportSource('${a(u.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(u.nome)}</span>
                        <span class="kit-import-option-meta">${(u.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(p.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,g.placeholder="Cerca kit destinazione\u2026",f.textContent="Kit sorgente",k.textContent="Sezione da copiare",K.style.display="flex",z.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${a(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,Z.innerHTML=m.length?m.map(u=>{let C=(e.targetKitIds||[]).includes(u.id),O=c?W(o,u):null,j=`${(u.sezioni||[]).length} sezioni`;return O&&(O.hasTargetVarianti?O.needsReview?j=`${O.exactMatches}/${O.targetCount} combinazioni allineate`:j=`${O.targetCount}/${O.targetCount} combinazioni allineate`:j="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${C?"kit-import-option--active":""}">
                    <input type="checkbox" ${C?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${a(u.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(u.nome)}</span>
                        <span class="kit-import-option-meta">${a(j)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),q.innerHTML=d.length?d.map(u=>{let C=u.id===e.sectionId;return`<label class="kit-import-option ${C?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${C?"checked":""}
                       onchange="_kitCfgSelectImportSection('${a(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessuna sezione disponibile.</div>';let L=!1,y="kit-cfg-help kit-import-preview",w="";if(e.mode==="import"){if(!r)w="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)w="Seleziona una sezione da importare nel kit corrente.";else{let u=W(r,o);L=!0,w=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 importata in <strong>${a(o.nome)}</strong>. `,u.hasTargetVarianti?u.needsReview?(y="kit-cfg-warn kit-import-preview",w+=`${u.exactMatches} combinazioni su ${u.targetCount} risultano allineate: controlla i coefficienti importati.`):w+=`Tutte le ${u.targetCount} combinazioni del kit destinazione risultano allineate.`:(y="kit-cfg-warn kit-import-preview",w+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}V.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else{let u=n.filter(C=>(e.targetKitIds||[]).includes(C.id));if(!c)w="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!u.length)w="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{L=!0;let C=u.filter(O=>W(o,O).needsReview).length;w=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 copiata in <strong>${u.length}</strong> kit.`,C>0?(y="kit-cfg-warn kit-import-preview",w+=` <strong>${C}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):w+=" Le combinazioni risultano allineate su tutti i kit selezionati."}V.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}G.className=y,G.innerHTML=w,V.disabled=!L,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("kit-import-search");u&&u.focus()},40))}function Zi(){if(!b)return;let{kits:t}=h(),i=b,n=t.find(c=>c.id===i.currentKitId),e=t.find(c=>c.id===i.sourceKitId),o=It(e,i.sectionId);if(!n||!e||!o){x("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import"){let c=W(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(ht(o,e,n)),M(t),et(),Y();let l="";c.hasTargetVarianti?c.needsReview&&(l=" Controlla le quantit\xE0 sulle combinazioni non allineate."):l=" Definisci poi gli assi del kit per rifinire i coefficienti.",x(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${l}`);return}let s=t.filter(c=>(i.targetKitIds||[]).includes(c.id)&&c.id!==n.id);if(!s.length){x("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let r=0;for(let c of s)W(e,c).needsReview&&(r+=1),c.sezioni=c.sezioni||[],c.sezioni.push(ht(o,e,c));M(t),et(),Y();let d="";r>0&&(d=` ${r} kit richiedono un controllo delle quantit\xE0.`),x(`Sezione "${o.nome}" copiata in ${s.length} kit \u2713${d}`)}function Y(){let{kits:t}=h(),i=t.find(v=>v.id===kt);if(!i){F();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=_(i);P==="sezioni"&&(P="bom"),P==="sa"&&(P="bom");let s=["info","varianti","bom"],r={info:"Prodotto",varianti:"Elettronica selezionabile",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,E)=>v+(E.componenti||[]).length,0),m=c?`
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
            <button class="kit-btn-danger" onclick="_kitElimina('${a(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,g=e.map((v,E)=>{let L=(v.opzioni||[]).map((y,w)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${a(y.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(y.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${a(i.id)}','${a(v.id)}','${a(y.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${E}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${L||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),f=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xE0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(v=>`<span class="kit-cfg-sa-var-badge" title="${a(v.key)}">${a(v.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",k=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci solo l'<strong>elettronica selezionabile</strong> del prodotto.<br>
                Esempio: un gruppo <strong>LED</strong>, uno <strong>Lente</strong>, uno <strong>Alimentazione</strong>.<br>
                Tu inserisci i nomi, il sistema user\xE0 queste scelte per costruire l'ordine e la distinta base.
            </div>
            ${g||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            ${f}
        </div>`,z=(i.sezioni||[]).map((v,E)=>{let L=(v.componenti||[]).map(y=>{let w=B(y),u=lt(y,i),C=(e||[]).find(S=>S.id===u.asseId)||null,O=u.tipo==="gruppo"&&C?`<div class="kit-cfg-row">${(C.opzioni||[]).map(S=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${u.opzioneIds.includes(S.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${a(i.id)}','${a(v.id)}','${a(y.id)}','${a(S.id)}',this.checked)">
                        ${a(S.nome)}
                    </label>`).join("")}</div>`:"",j=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(y.id)}','asseId',this.value)">
                        ${e.map(S=>`<option value="${a(S.id)}" ${u.asseId===S.id?"selected":""}>${a(S.nome)}</option>`).join("")}
                   </select>`:"",Vt=u.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",bt=w?"flag":nt(y.unitaMisura,"pz"),jt=w?[{value:"flag",label:"Solo avviso"}]:[...new Set([bt,...Jt])].filter(Boolean).map(S=>({value:S,label:S}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${a(y.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(y.id)}','nome','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(y.id)}','modo','',this.value)">
                        <option value="quantificato" ${w?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${w?"selected":""}>Solo avviso</option>
                    </select>
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${a(i.id)}','${a(v.id)}','${a(y.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${u.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(y.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(y.id)}','unitaMisura','',this.value)"
                            ${w?"disabled":""}>
                        ${jt.map(S=>`<option value="${a(S.value)}" ${bt===S.value?"selected":""}>${a(S.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(y.id)}','tipo',this.value)">
                        <option value="sempre" ${u.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${u.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${u.tipo==="gruppo"?j:""}
                </div>
                ${u.tipo==="gruppo"?O:""}
                <input class="kit-cfg-input" value="${a(y.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(y.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${w?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Vt}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${E}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${a(i.id)}','${a(v.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${L}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),q=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unit\xE0 corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${z}
            <div class="kit-cfg-row">
                <button class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${a(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,K="";o.length?K=o.map(v=>{let E=(i.sottoAssembly||[]).map((y,w)=>({sa:y,i:w})).filter(({sa:y})=>y.varianteKey===v.key),L=E.map(({sa:y,i:w})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${a(y.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${a(i.id)}',${w},'nome',this.value)">
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${a(i.id)}',${w})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${a(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${E.length} part${E.length!==1?"i":"e"}</span>
                </div>
                ${L||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${a(i.id)}','${a(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${a(v.nome)}</button>
            </div>`}).join(""):K='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let Z=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${K}
        </div>`,G={info:p,varianti:k,bom:q,sa:Z},V=s.map(v=>`<button class="kit-tab ${P===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${r[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${a(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${a(i.nome)}</span>
        </div>
        <div class="kit-tabs">${V}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${G[P]}</div>
    </div>`,tt(n)}function te(t){if(t&&A===t){T();return}A=t,T()}function ie(t){P=t,Y()}function $(t,i,n=!0){let{kits:e}=h(),o=e.find(s=>s.id===t);o&&(i(o),M(e),n&&Y())}function ee(t,i){$(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function ne(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=h();M(i.filter(n=>n.id!==t)),kt=null,A=null,F()}function Dt(t){$(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:I(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:I(),key:"opz1",nome:"Opzione 1"}]})})}function oe(t,i,n,e){$(t,function(o){let s=(o.assiConfigurazione||[]).find(r=>r.id===i);s&&(n==="key"?s.key=X(e,s.key||"asse"):s[n]=e.trim())})}function se(t,i){$(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function ae(t,i){$(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:I(),key:"opz"+o,nome:"Opzione "+o})})}function re(t,i,n,e,o){$(t,function(s){let r=(s.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=X(o,d.key||"opzione"):d[e]=o.trim())})}function ce(t,i,n){$(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function de(t){Dt(t)}function le(t){$(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:I(),nome:"Nuova sezione",componenti:[]})})}function pe(t){Pt(t)}function me(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s[n]=e.trim())},!1)}function fe(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&$(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function ue(t,i){$(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:I(),nome:"Nuovo componente",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function ge(t,i,n,e,o,s){$(t,function(r){let d=(r.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=D(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":nt(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function ke(t,i,n,e,o){$(t,function(s){let r=(s.sezioni||[]).find(l=>l.id===i),d=r&&(r.componenti||[]).find(l=>l.id===n);if(!d)return;let c=lt(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=D(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=ct(d,s,c)})}function ve(t,i,n,e,o){$(t,function(s){let r=(s.sezioni||[]).find(m=>m.id===i),d=r&&(r.componenti||[]).find(m=>m.id===n);if(!d)return;let c=lt(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=ct(d,s,c)})}function be(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),r=s&&(s.componenti||[]).find(d=>d.id===n);!r||B(r)||(r.tracciabile=!!e)},!1)}function ye(t,i,n){$(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function he(t){$(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:I(),nome:"",varianteKey:_(i)[0]?.key||""})})}function ze(t,i){$(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:I(),nome:"",varianteKey:i,noteConfig:""})})}function we(t,i,n,e){$(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function $e(t,i){$(t,function(n){n.sottoAssembly.splice(i,1)})}function Me(){window._kitOpenView=hi,window._kitOpenConfig=Rt,window._kitNuovoKit=Hi,window._kitBack=zi,window._kitOpenPrintPreview=gi,window._kitSwitchTab=wi,window._kitAggiornaQty=$i,window._kitOrdineSet=Ci,window._kitOrdineDelta=_i,window._kitOrdineReset=Ii,window._kitOrdineResetVoce=Si,window._kitComposeSelect=xi,window._kitComposeAdd=Ai,window._kitAggiornaCar=Nt,window._kitAggiornaPronti=qi,window._kitSetPronti=Mi,window._kitApriModalSped=Li,window._kitChiudiModalSped=Kt,window._kitConfermaSpedizione=Ri,window._kitApriModalReso=Pi,window._kitChiudiModalReso=Lt,window._kitResoQtyChange=Di,window._kitResoAggiornaBOM=gt,window._kitConfermaReso=Vi,window._kitSalvaMovimento=Ni,window._kitEliminaMovimento=Bi,window._kitModificaMovimento=Ti,window._kitChiudiModalEditMov=Tt,window._kitConfermaModificaMov=Ki,window._kitChiudiModalDelMov=Bt,window._kitConfermaEliminaMov=Ot,window._kitSalvaManuale=ji,window._kitElimina=ne,window._kitCfgBack=te,window._kitCfgSwitchTab=ie,window._kitCfgSaveNome=ee,window._kitCfgAddVar=de,window._kitCfgOpenImportModal=Pt,window._kitCfgOpenCopySezModal=Ui,window._kitCfgCloseImportModal=et,window._kitCfgSetImportMode=Qi,window._kitCfgSetImportSearch=Fi,window._kitCfgSelectImportSource=Gi,window._kitCfgSelectImportSection=Ji,window._kitCfgToggleImportTarget=Wi,window._kitCfgSelectAllImportTargets=Yi,window._kitCfgClearImportTargets=Xi,window._kitCfgConfirmImport=Zi,window._kitCfgAddAsse=Dt,window._kitCfgUpdateAsse=oe,window._kitCfgDelAsse=se,window._kitCfgAddOpzione=ae,window._kitCfgUpdateOpzione=re,window._kitCfgDelOpzione=ce,window._kitCfgAddSez=le,window._kitCfgImportSez=pe,window._kitCfgUpdateSez=me,window._kitCfgDelSez=fe,window._kitCfgAddComp=ue,window._kitCfgUpdateComp=ge,window._kitCfgUpdateCompRule=ke,window._kitCfgToggleCompOption=ve,window._kitCfgToggleCompTracked=be,window._kitCfgDelComp=ye,window._kitCfgAddSA=he,window._kitCfgAddSAForVariant=ze,window._kitCfgUpdateSA=we,window._kitCfgDelSA=$e}var rt,it,wt,$t,Jt,st,J,zt,A,Et,kt,P,b,Ee,Ce=Ht(()=>{Ut();Ft();Gt();Qt();rt="_mlKitData",it="_mlKitDataTs",wt="_mlKitOrderDrafts",$t=2,Jt=["pz","mt","cm","mm","kg","g","lt","ml"],st=!1;J={};zt=null;A=null,Et="ordine";kt=null,P="info",b=null;Ee=F});Ce();export{F as caricaKitProdotti,Ee as default,Me as registerGlobals,qe as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-CUPGJAYV.js.map
