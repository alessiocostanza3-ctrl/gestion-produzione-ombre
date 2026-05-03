import{a as Ri,c as St,e as Hi,f as a,g as y,h as dt,l as ji,m as R,q as Qi,r as It,u as Vi}from"./chunk-chunk-55SFP7PR.js";function ao(){At=!1}function F(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function W(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function et(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function ht(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function Ji(t,i){let n="opz"+(i+1),e=F(t?.key,n);return{id:String(t?.id||C()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function Yi(t,i){let n="asse"+(i+1),e=F(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,r)=>Ji(s,r)).filter(Boolean):[];return{id:String(t?.id||C()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function ei(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function Wi(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function ni(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let r of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:r.id,opzioneKey:r.key,opzioneNome:r.nome,opzioneCodice:String(r.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:ei(e.selections),nome:Wi(e.selections),selections:e.selections}})}function Zi(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||C()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:ht(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:W(t?.qtaBase)}}function Xi(t){return{id:String(t?.id||C()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(Zi):[]}}function te(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function oi(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:W(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||W(Object.values(t?.qtaPerVariante||{})[0])};let e=q(i);if(!e.length)return n;let o=e.filter(c=>N(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>N(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>N(t,c.key)))};let r=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:r};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let m of c.opzioni||[]){let u=new Set(e.filter(z=>(z.selections||[]).some(k=>k.asseId===c.id&&k.opzioneId===m.id)).map(z=>z.key));if(!u.size)continue;[...u].every(z=>N(t,z)===r)&&l.push(m.id)}if(!l.length)continue;let p=new Set(e.filter(m=>(m.selections||[]).some(u=>u.asseId===c.id&&l.includes(u.opzioneId))).map(m=>m.key));if(te(p,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:r}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:r}}function Bt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=W(n.qtyBase);if(!o)return e;for(let s of q(i)){let r=n.tipo==="sempre";n.tipo==="gruppo"&&(r=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),r&&(e[s.key]=o)}return e}function ie(t,i){let n=Xi(t);return n.componenti=n.componenti.map(function(e){let o=oi(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:Bt(e,i,o)}}),n}function ee(t,i){let n=q(i);if(!n.length)return null;let e=null;for(let o of n){let s=N(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function ne(t,i,n){let e=q(n),o={},s=ee(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let r of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},r.key)?N(t,r.key):s!==null?s:0;c>0&&(o[r.key]=c)}return{id:C(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:Nt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:ht(t?.unitaMisura,D(t)?"flag":"pz")}}function vt(t,i,n){return{id:C(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>ne(e,i,n)):[]}}function si(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=F(t?.key||String(t?.nome||"asse"),"asse1"),s=o,r=1;for(;e.has(s);)s=o+"_c"+r++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],p="opz"+(c+1),m=F(l?.key,p),u=1;for(;d.some(f=>f.key===m);)m=m+"_c"+u++;d.push({id:C(),key:m,nome:String(l?.nome||"").trim()||m,codice:String(l?.codice||"").trim()})}return{id:C(),key:s,nome:String(t?.nome||"").trim()||s,opzioni:d}}function Tt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function mt(t,i){let n=new Set(q(t).map(s=>s.key)),e=q(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function yt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function oe(t,i){return{id:String(t?.id||C()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function ai(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(m,u){let f="v"+(u+1),z=F(m?.key,f);return{id:String(m?.id||C()),key:z,nome:String(m?.nome||z).trim()||z}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((m,u)=>Yi(m,u)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(m){return{id:m.id,key:m.key,nome:m.nome}})}]:[],s=ni(o),r=s.length?s:n,d=new Set(r.map(m=>m.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(m){d.has(m[0])&&(c[m[0]]=Math.max(0,Number.parseInt(m[1],10)||0))});for(let m of r)c[m.key]===void 0&&(c[m.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(m=>oe(m,r[0]?.key||"")).filter(m=>!m.varianteKey||d.has(m.varianteKey)):[],p={};return Object.entries(i.pronti||{}).forEach(function(m){p[m[0]]=Math.max(0,Number.parseInt(m[1],10)||0)}),{id:String(i.id||C()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Ot,assiConfigurazione:o,varianti:r,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(m=>ie(m,{assiConfigurazione:o,varianti:r})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:p,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function q(t){return Array.isArray(t?.varianti)?t.varianti:[]}function D(t){return!!t&&t.modoComponente==="segnalazione"}function Nt(t){return!!t&&t.tracciabile!==!1&&!D(t)}function N(t,i){let n=W(t?.qtaPerVariante?.[i]);return D(t)?n>0?1:0:n}function Dt(t,i){return oi(t,i)}function Kt(){try{let t=localStorage.getItem(Zt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function ri(t){try{localStorage.setItem(Zt,JSON.stringify(t||{}))}catch{}}function st(){try{let t=localStorage.getItem(Xt),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Lt(t){try{localStorage.setItem(Xt,JSON.stringify(t||[]))}catch{}}function X(){try{let t=localStorage.getItem(ti),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function zt(t){try{localStorage.setItem(ti,JSON.stringify(t||[]));try{localStorage.setItem(Fi,Date.now())}catch{}}catch{}}function at(t){return String(t||"").trim().toUpperCase()}function ut(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(at).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function H(t){return ut(t?._meta||{})}function wt(t,i){return t._meta=ut(i),t._meta}function Z(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function ci(){let t=1;try{t=(Number.parseInt(localStorage.getItem(Jt),10)||0)+1,localStorage.setItem(Jt,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function di(t){let i=H(t);return i.documento||(i.documento=ci(),wt(t,i)),i.documento}function Yt(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:at(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function li(){return Y.length?Promise.resolve(Y):Array.isArray(window._attiviProd)&&window._attiviProd.length?(Y=Yt(window._attiviProd),Promise.resolve(Y)):lt||(lt=fetch(St,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(Y=Yt(t),Y)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){lt=null}),lt)}function se(t){let i=at(t);return i&&Y.find(n=>n.ordine===i)||null}function pi(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=at(e);return o?i[o]?String(i[o]||"").trim():String(se(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function G(t){let i=Kt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of q(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=ut(n._meta||{}),e}function P(t,i){let{kits:n}=b(),e=n.find(p=>p.id===t);if(!e)return;let o=Kt(),s=G(e);i(s,e);let r={},d=!1;for(let p of q(e)){let m=Math.max(0,Number.parseInt(s[p.key],10)||0);r[p.key]=m,m>0&&(d=!0)}let c=ut(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(c.documento||(c.documento=ci()),r._meta=c),d||l?o[t]=r:delete o[t],ri(o),O===t&&L()}function ae(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function Pt(t){let i=pt[t.id]&&typeof pt[t.id]=="object"?pt[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return pt[t.id]=n,n}function mi(t,i){let n=t.assiConfigurazione||[];if(!n.length)return q(t)[0]||null;let e=[];for(let s of n){let r=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===r);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=ei(e);return q(t).find(s=>s.key===o)||null}function re(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function ce(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let r of s.componenti||[])if(!D(r)&&!(N(r,i.key)<=0)&&r.applicazioneTipo==="gruppo"&&String(r.applicazioneAsseId||"")===e&&Array.isArray(r.applicazioneOpzioneIds)&&r.applicazioneOpzioneIds.includes(o))return!0;return!1}function de(t,i,n){let e=[],o=new Map;for(let s of i){let r=Z(n,s.key);if(r)for(let d of s.selections||[]){if(ce(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=r;continue}let p={id:"sel-"+c,nome:re(d),codice:String(d?.opzioneCodice||"").trim(),totale:r,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,p),e.push(p)}}return e}function _t(t,i){let n=q(t).filter(r=>Z(i,r.key)>0),e=[],o=[],s=de(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let r of t.sezioni||[]){let d=[];for(let c of r.componenti||[]){let l=0,p=[];for(let u of n){let f=Z(i,u.key),z=N(c,u.key);!f||!z||(D(c)?l+=f:l+=f*z,p.push({nome:u.nome,pezziOrdine:f,coeff:z}))}if(!p.length)continue;let m=p.length===1?p[0].nome:p.length+" configurazioni";if(D(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:m});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:m})}d.length&&e.push({id:r.id,nome:r.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:ae(i),totaleRighe:e.reduce((r,d)=>r+d.righe.length,0)}}function le(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function pe(){return String(window._distintaHeaderAzienda||"").trim()}function ui(t,i,n){let e=new Date,o=H(n),s=pe(),r=String(o.documento||"").trim(),d=s?s.split(/\r?\n/).map(f=>`<div>${a(f)}</div>`).join(""):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),p=i.selectedVarianti.length?i.selectedVarianti.map(f=>{let z=Z(n,f.key);return`<tr>
                <td>${a(et(z))}</td>
                <td>${a(f.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',m=i.sezioni.map(f=>{let z=f.righe.map(k=>{let _=[k.dettaglio,k.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${a(String(k.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${a(k.nome)}</div></td>
                <td class="db-print-cell-unit">${a(k.unita)}</td>
                <td class="db-print-cell-qty">${a(et(k.totale))}</td>
                <td class="db-print-cell-note">${_?a(_):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${a(f.nome)}</td></tr>${z}`}).join(""),u=i.avvisi.length?i.avvisi.map(f=>`<div class="db-print-alert ${f.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${a(f.nome)}</div>
                <div>${a(f.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${a(et(f.totaleCoinvolto))} pz \xB7 ${a(f.variantiLabel)}</div>
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
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${a(le(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${a(R?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${a(et(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${a(et(i.totaleRighe))}</div></div>
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
                <tbody>${m}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${u}</div>
        </div>
    </div>
</body>
</html>`}function me(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;let e=G(n),o=_t(n,e);if(!o.totalePezzi||!o.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}H(e).documento||(P(t,function(r){di(r)}),e=G(n));let s=window.open("","_blank");if(!s){y("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(ui(n,o,e)),s.document.close(),s.focus()}function b(){try{let t=localStorage.getItem(Mt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(ai):[]}}catch{return{kits:[]}}}function S(t){let i=Array.isArray(t)?t.map(ai):[];try{localStorage.setItem(Mt,JSON.stringify({kits:i})),localStorage.setItem(kt,Date.now())}catch{}ue(i)}function ue(t){clearTimeout(Wt),Wt=setTimeout(function(){It({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function fe(t){fetch(St,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(kt)||0);if(n>0&&n>e){try{localStorage.setItem(Mt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(kt,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function C(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function Rt(){if(!R||!R.nome)return!1;let t=String(R.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||R.ruolo==="MASTER"}function ge(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(D(e)){i[e.id]=0;continue}let o=0;for(let[s,r]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(r,10)||0)*N(e,s);i[e.id]=o}return i}function ke(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let r of s.componenti||[]){if(D(r))continue;let d=N(r,o);d>0&&(i[r.id]=(i[r.id]||0)+e*d)}}return i}function fi(t,i){let n=q(t).find(e=>e.key===i);return n?a(n.nome):a(i)}function Ht(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function rt(){At||(At=!0,fe(function(n){n&&rt()}));let{kits:t}=b(),i=document.getElementById("contenitore-dati");if(i){i.innerHTML=`
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
    </div>`,B(T),jt();try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else dt(i)}catch{dt(i)}}}function gi(t,i){if(!i)return;if(!t.length){i.innerHTML=`
        <div style="padding:40px 0;text-align:center">
            <i class="fas fa-box-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:16px;display:block"></i>
            <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun kit configurato.</p>
            <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
        </div>`;return}let n=["pz","mt","cm","mm","kg","g","lt","ml"],e=t.map(o=>{let s=o.sezioni||[],r=s.reduce((l,p)=>l+(p.componenti||[]).length,0),d=s.length,c=s.map(l=>{let p=l.componenti||[],m=p.map(u=>`
            <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #f8fafc">
                <span style="font-size:.84rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${a(u.nome)}">${a(u.nome)}${u.codice?` <span style="color:#94a3b8;font-size:.76rem">\xB7 ${a(u.codice)}</span>`:""}</span>
                <input type="number" min="0" step="any" value="${u.qtaBase!=null?u.qtaBase:1}"
                    class="input-field-modern" style="padding:4px 8px;font-size:.82rem;text-align:right"
                    onchange="_kitQUpdateComp('${a(o.id)}','${a(l.id)}','${a(u.id)}','qtaBase',this.value)"
                    title="Quantit\xE0">
                <select class="input-field-modern" style="padding:4px 6px;font-size:.82rem"
                    onchange="_kitQUpdateComp('${a(o.id)}','${a(l.id)}','${a(u.id)}','unitaMisura',this.value)">
                    ${n.map(f=>`<option value="${f}"${(u.unitaMisura||"pz")===f?" selected":""}>${f}</option>`).join("")}
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
                        <span style="color:#94a3b8;font-size:.76rem;white-space:nowrap">${p.length} comp.</span>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;flex-shrink:0">
                        <button type="button" class="btn-trash-modern" style="padding:3px 7px;font-size:.75rem"
                            onclick="event.preventDefault();event.stopPropagation();_kitQDelSez('${a(o.id)}','${a(l.id)}')" title="Rimuovi sezione"><i class="fas fa-trash"></i></button>
                        <i class="fas fa-chevron-down" style="color:#94a3b8;font-size:.75rem;transition:transform .2s"></i>
                    </div>
                </summary>
                <div style="padding:4px 12px 8px">
                    ${p.length?`
                    <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;padding:4px 0 2px;border-bottom:2px solid #e2e8f0;margin-bottom:2px">
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em">Componente</span>
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;text-align:right">Qty</span>
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase">Unit\xE0</span>
                        <span></span>
                    </div>
                    ${m}`:'<p style="color:#94a3b8;font-size:.82rem;padding:6px 0">Nessun componente.</p>'}
                    <button type="button" class="btn-archive-action" style="margin-top:8px;font-size:.8rem"
                        onclick="_kitQAddCompOpen('${a(o.id)}','${a(l.id)}')">
                        <i class="fas fa-plus"></i> Aggiungi componente
                    </button>
                </div>
            </details>`}).join("");return`
        <details class="ordine-group" open style="margin-bottom:8px">
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
        </details>`}).join("");i.innerHTML=e}function jt(){let t=document.getElementById("kit-page-actions");t&&(T==="kits"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>':T==="anagrafiche"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>':t.innerHTML="")}function B(t){T=t,document.querySelectorAll("#kit-tab-bar .acq-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)});let{kits:i}=b(),n=document.getElementById("kit-main-content");n&&(t==="kits"?gi(i,n):t==="anagrafiche"?ki(i,n):t==="distinte"&&vi(i,n),jt())}function ki(t,i){if(!i)return;let n=J();if(!n.length){i.innerHTML=`
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
                </div>`).join(""),o+="</div></details>";i.innerHTML=o}function vi(t,i){if(!i)return;let n=X();if(!n.length){i.innerHTML='<div style="padding:24px 0;text-align:center"><p class="acquisti-subtitle">Nessuna distinta salvata.</p></div>';return}let e=n.map(o=>`
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
        </details>`).join("");i.innerHTML=e}function yi(t){let{kits:i}=b(),n=i.find(c=>c.id===t);if(!n){y("Kit non trovato \u26A0\uFE0F");return}let e=G(n);H(e).documento||(P(t,function(c){di(c)}),e=G(n));let o=_t(n,e);if(!o.totalePezzi||!o.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}let s=X(),r=H(e),d={id:C(),kitId:n.id,kitNome:n.nome,nome:r.documento||`Distinta-${Date.now()}`,documento:r.documento||"",createdAt:Date.now(),createdBy:R?.nome||"Sistema",orderDraftSnapshot:e,distintaSnapshot:o};s.unshift(d),zt(s),y("Distinta salvata \u2713"),T==="distinte"&&B("distinte")}function J(){try{let t=localStorage.getItem(ii),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Qt(t){try{localStorage.setItem(ii,JSON.stringify(t||[]));try{localStorage.setItem(Gi,Date.now())}catch{}}catch{}}function ve(){if(document.getElementById("modal-kit-anagrafica-edit"))return;let t=document.createElement("div");t.innerHTML=`
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
    </div>`,document.body.appendChild(t.firstElementChild)}function ye(t){ve();let i=document.getElementById("modal-kit-anagrafica-edit");if(!i)return;let n=document.getElementById("anag-componente"),e=document.getElementById("anag-codice"),o=document.getElementById("anag-categoria"),s=document.getElementById("anag-descrizione");if(t){let r=J().find(d=>d.id===t);r&&(n&&(n.value=r.nome||""),e&&(e.value=r.codice||""),o&&(o.value=r.categoria||""),s&&(s.value=r.descrizione||""),i.dataset.editId=t)}else n&&(n.value=""),e&&(e.value=""),o&&(o.value=""),s&&(s.value=""),delete i.dataset.editId;i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function bi(){let t=document.getElementById("modal-kit-anagrafica-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function be(){let t=document.getElementById("modal-kit-anagrafica-edit");if(!t)return;let i=t.dataset.editId,n=(document.getElementById("anag-componente")?.value||"").trim();if(!n){y("Inserisci il nome del componente","warning");return}let e=(document.getElementById("anag-codice")?.value||"").trim(),o=(document.getElementById("anag-categoria")?.value||"").trim(),s=(document.getElementById("anag-descrizione")?.value||"").trim(),r=J();if(i){let d=r.findIndex(c=>c.id===i);d!==-1?r[d]={...r[d],nome:n,codice:e,categoria:o,descrizione:s,updatedAt:Date.now()}:r.unshift({id:C(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:R?.nome||"Sistema"})}else r.unshift({id:C(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:R?.nome||"Sistema"});Qt(r),bi(),y("Componente salvato \u2713"),T==="anagrafiche"&&B("anagrafiche")}function he(t){let i=J().filter(n=>n.id!==t);Qt(i),T==="anagrafiche"&&B("anagrafiche"),y("Componente eliminato \u2713")}function ze(t){let i=X().find(o=>o.id===t);if(!i)return;let{kits:n}=b(),e=n.find(o=>o.id===i.kitId)||null;if(e){let o=window.open("","_blank");if(!o){y("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}o.document.open();try{o.document.write(ui(e,i.distintaSnapshot,i.orderDraftSnapshot))}catch{o.document.write("<pre>"+a(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>")}o.document.close(),o.focus()}else{let o=window.open("","_blank");if(!o){y("Popup bloccato","warning");return}o.document.open(),o.document.write("<pre>"+a(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>"),o.document.close(),o.focus()}}function we(t){let i=X().find(e=>e.id===t);if(!i)return;let n=Kt();n[i.kitId]=i.orderDraftSnapshot||{},ri(n),y("Bozza ordine ripristinata per il kit selezionato \u2713")}function _e(t){let i=X().filter(n=>n.id!==t);zt(i),T==="distinte"&&B("distinte"),y("Distinta eliminata \u2713")}function Ce(t){O=t,hi="ordine",L()}function L(){let{kits:t}=b(),i=t.find(k=>k.id===O);if(!i){rt();return}let n=document.getElementById("contenitore-dati"),e=q(i),o=G(i),s=H(o),r=_t(i,o),d=r.selectedVarianti.length?r.selectedVarianti.map(k=>`<span class="kit-meta-pill"><strong>${Z(o,k.key)}</strong> \xD7 ${a(k.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=s.ordiniCliente.length?s.ordiniCliente.map(k=>`<span class="kit-order-ref-chip">${a(k)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(k)})' aria-label="Rimuovi ordine ${a(k)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=Pt(i),p=mi(i,l),m=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(k=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${a(k.nome)}</div>
                <div class="kit-compose-options">${(k.opzioni||[]).map(_=>`
                        <button type="button" class="kit-compose-option ${l[k.id]===_.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${a(i.id)}','${a(k.id)}','${a(_.id)}')">
                        ${a(_.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',u=r.selectedVarianti.length?r.selectedVarianti.map(k=>{let _=Z(o,k.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${a(k.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(k.selections)&&k.selections.length?k.selections.map(K=>a(K.opzioneNome)).join(" \xB7 "):a(k.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(k.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${_}"
                           onchange="_kitOrdineSet('${a(i.id)}','${a(k.key)}',this.value)"
                           oninput="_kitOrdineSet('${a(i.id)}','${a(k.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(k.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${a(i.id)}','${a(k.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,f=r.totalePezzi?r.sezioni.map(k=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${a(k.nome)}</div>
                ${k.righe.map(_=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${a(_.nome)}</div>
                            ${_.dettaglio?`<div class="kit-distinta-row-meta">${a(_.dettaglio)}</div>`:""}
                            ${_.noteConfig?`<div class="kit-distinta-row-note">${a(_.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${et(_.totale)} ${a(_.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,z=r.avvisi.length?r.avvisi.map(k=>`
            <div class="kit-distinta-alert ${k.tipo==="alert"?"kit-distinta-alert--warning":""}">
                <div class="kit-distinta-alert-title">${a(k.nome)}</div>
                <div class="kit-distinta-alert-body">${a(k.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${k.totaleCoinvolto} pz \xB7 ${a(k.variantiLabel)}</div>
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
                    ${m}
                    <div class="kit-compose-footer">
                        <div class="kit-compose-selected">
                            <div class="kit-compose-selected-label">Configurazione pronta</div>
                            <div class="kit-compose-selected-name">${p?a(p.nome):"Completa prima tutte le scelte"}</div>
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
                ${f}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${z}
            </section>
        </div>
    </div>`,dt(n),li().catch(()=>{})}function $e(){O=null,rt()}function Se(t){hi=t,L()}function Ie(t){P(t,function(i,n){for(let e of q(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function xe(t,i,n){try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function Ae(t,i,n){try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function Ee(t){P(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=ut({})})}function qe(t,i){P(t,function(n){n[i]=0})}function bt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${a(e.ordine)}</span>
            <span class="ac-cliente">${a(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function Me(t,i){let n=String(i||"").trim().toLowerCase();if(!n){bt(t,[]);return}li().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);bt(t,o)})}function Oe(t){setTimeout(function(){bt(t,[])},140)}function Be(t,i,n){let e=at(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}P(t,function(s){let r=H(s);r.ordiniCliente=[...new Set(r.ordiniCliente.concat(e))],r.cliente=pi(r.ordiniCliente,{[e]:n}),wt(s,r)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),bt(t,[])}function Te(t,i){let n=at(i);try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){let o=H(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=pi(o.ordiniCliente),wt(e,o)})}function Ne(t,i,n){let{kits:e}=b(),o=e.find(r=>r.id===t);if(!o)return;let s=Pt(o);if(s[i]=n,pt[t]=s,O===t){try{window._kitSuppressNextFade=!0}catch{}L()}}function De(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;let e=mi(n,Pt(n));if(!e){y("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){y("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(xt[t])return;xt[t]=Date.now(),setTimeout(function(){try{delete xt[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}P(t,function(r){r[e.key]=Z(r,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function zi(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=b(),s=o.find(_=>_.id===O);if(!s)return;let r=(s.sezioni||[]).find(_=>_.id===n),d=r&&(r.componenti||[]).find(_=>_.id===i);if(!d||!Nt(d))return;d.caricato=e,S(o);let l=ge(s)[i]||0,p=Math.max(0,l-e),u=ke(s)[i]||0,f=t.closest("tr");if(!f)return;let z=f.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");z&&(z.textContent=l===0?"\u2014":p,z.className=l===0?"kit-ord-zero":p>0?"kit-ord-manca":"kit-ord-ok");let k=f.querySelector(".kit-car-liberi");k&&(u>0?(k.textContent=Math.max(0,e-u)+" lib.",k.style.display=""):k.style.display="none")}function Ke(t,i,n){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),S(e),O===t&&L())}function Le(t,i,n){let{kits:e}=b(),o=e.find(r=>r.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),S(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function Pe(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${a(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${a(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let r=(e.righe||[]).reduce((l,p)=>l+p.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${a(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${a(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${r} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${a(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${c}<div class="kit-sped-bom-divider">componenti scaricati</div>${d}</div>
            </details>`}if(e.tipo==="reso"){let r=e.totPz||0,d=(e.items||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${a(p.nome)}</span><span class="kit-mov-qty carico">\xD7${p.qty}</span></div>`).join(""),c=(e.righe||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${a(p.mat)}</span><span class="kit-mov-qty carico">+${p.qty}</span></div>`).join(""),l=(e.scartate||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${a(p.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${p.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
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
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function Re(t,i){let{kits:n}=b(),e=n.find(k=>k.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),r=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),p=(r?.value||"").trim(),m=(e.sezioni||[]).find(k=>k.id===c),u=m&&(m.componenti||[]).find(k=>k.id===d);if(!u||!Nt(u))return;i==="carico"?u.caricato=(parseInt(u.caricato)||0)+l:u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:p,mat:u.nome,ts:Ht()}),S(n),s&&(s.value=1),r&&(r.value="");let f=document.getElementById("kit-mov-list-"+t);f&&(f.innerHTML=Pe(e,Rt()));let z=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);z&&(z.value=u.caricato,zi(z))}function He(t,i){if(!Rt())return;let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&je(t,i,o)}function je(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${a(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${a(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let r=document.getElementById("btn-kit-del-ok");r&&(r.onclick=()=>_i(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function wi(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function _i(t,i){wi();let{kits:n}=b(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(r=>r.id===o.sid);for(let r of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===r.cid||l.nome===r.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+r.qty)}for(let r of o.items||[])r.saId&&e.pronti&&(e.pronti[r.saId]=(parseInt(e.pronti[r.saId])||0)+r.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let r of e.sezioni||[]){let d=(r.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=Math.max(0,(parseInt(r.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=(parseInt(r.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),S(n),O===t&&L(),y("Movimento eliminato \u2713")}}function Qe(t,i){if(!Rt())return;let{kits:n}=b(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let r=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");r&&(r.innerHTML=`<span class="kit-mov-badge ${a(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${a(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function Ci(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ve(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);Ci();let{kits:e}=b(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let r=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){y("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==r.qty){let l=d-r.qty;for(let p of o.sezioni||[]){let m=(p.componenti||[]).find(u=>u.id===r.cid);if(m){r.tipo==="carico"?m.caricato=Math.max(0,(parseInt(m.caricato)||0)+l):m.caricato=Math.max(0,(parseInt(m.caricato)||0)-l);break}}}o.movimenti[s]={...r,qty:d,nota:c},S(e),O===i&&L(),y("Movimento aggiornato \u2713")}function Ue(t){let{kits:i}=b(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){y("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,p=fi(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${a(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${a(c.nome)} <span class="kit-sped-var-pill">${p}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let r=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&r&&(d.value=r.value||""),d&&!r&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function $i(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Fe(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;$i();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=b(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),r=[],d=[];for(let l of n){let p=(o.sottoAssembly||[]).find(u=>u.id===l);if(!p)continue;let m=Number.parseInt(o.pronti?.[l],10)||0;if(m){r.push({saId:l,nome:p.nome,qty:m});for(let u of o.sezioni||[])for(let f of u.componenti||[]){if(D(f))continue;let z=N(f,p.varianteKey);if(!z)continue;let k=m*z;f.caricato=Math.max(0,(parseInt(f.caricato)||0)-k);let _=d.find(K=>K.cid===f.id);_?_.qty+=k:d.push({cid:f.id,mat:f.nome,qty:k})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:r,righe:d,nota:s,ts:Ht()}),S(e);let c=r.reduce((l,p)=>l+p.qty,0);y(`Spedizione registrata: ${c} pz \u2713`),O===i&&L()}function Ge(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let r=n.sottoAssembly||[];o.innerHTML=r.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':r.map(d=>{let c=fi(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${a(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${a(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${a(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),Vt(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Si(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Je(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&Vt(e.dataset.kitId)}function Vt(t){let{kits:i}=b(),n=i.find(r=>r.id===t);if(!n)return;let e={};for(let r of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+r.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let p of l.componenti||[]){if(D(p))continue;let m=N(p,r.varianteKey);m&&(e[p.id]={mat:p.nome,qty:(e[p.id]?.qty||0)+c*m})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,r])=>r.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([r,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${a(r)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${a(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function Ye(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=b(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let p=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;p>0&&o.push({saId:l.id,nome:l.nome,qty:p})}if(!o.length){y("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],r=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let p=l.dataset.cid,m=Number.parseInt(l.dataset.qty,10),u=[...e.sezioni||[]].flatMap(f=>f.componenti||[]).find(f=>f.id===p)?.nome||"?";l.checked?s.push({cid:p,mat:u,qty:m}):r.push({cid:p,mat:u,qty:m})});for(let l of s)for(let p of e.sezioni||[]){let m=(p.componenti||[]).find(u=>u.id===l.cid);if(m){m.caricato=(parseInt(m.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,p)=>l+p.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:r,nota:d,ts:Ht(),totPz:c}),S(n),Si(),y(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),O===i&&L()}function We(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=b();It({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(kt,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function Ii(){let t=document.getElementById("modal-kit-crea");if(!t)return;let i=document.getElementById("kit-crea-nome");i&&(i.value=""),t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>i&&i.focus(),80)}function xi(){let t=document.getElementById("modal-kit-crea");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ze(){let t=(document.getElementById("kit-crea-nome")?.value||"").trim();if(!t){y("Inserisci un nome per il kit","warning");return}let{kits:i}=b(),n={id:C(),nome:t,schemaVersion:Ot,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};i.push(n),S(i),xi(),setTimeout(()=>B("kits"),320)}function Xe(t){ot.kitId=t;let i=document.getElementById("modal-kit-qadd-sez");if(!i)return;let n=document.getElementById("kit-qadd-sez-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function Ai(){let t=document.getElementById("modal-kit-qadd-sez");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function tn(){let t=(document.getElementById("kit-qadd-sez-nome")?.value||"").trim()||"Nuova sezione",{kits:i}=b(),n=i.find(e=>e.id===ot.kitId);n&&(n.sezioni=n.sezioni||[],n.sezioni.push({id:C(),nome:t,componenti:[]}),S(i),Ai(),setTimeout(()=>B("kits"),320))}function en(t,i){ot.kitId=t,ot.sezId=i;let n=document.getElementById("modal-kit-qadd-comp");if(!n)return;let e=J(),o=document.getElementById("kit-qadd-comp-source-cat"),s=document.getElementById("kit-qadd-comp-source-free");e.length?(o&&(o.checked=!0),Et("cat")):(s&&(s.checked=!0),Et("free"));let r=[...new Set(e.map(u=>u.categoria||"Senza categoria"))].sort(),d=document.getElementById("kit-qadd-comp-cat");d&&(d.innerHTML=r.map(u=>`<option value="${a(u)}">${a(u)}</option>`).join(""),Ei());let c=document.getElementById("kit-qadd-comp-qty");c&&(c.value="1");let l=document.getElementById("kit-qadd-comp-unit");l&&(l.value="pz");let p=document.getElementById("kit-qadd-comp-nome");p&&(p.value="");let m=document.getElementById("kit-qadd-comp-codice");m&&(m.value=""),n.style.display="flex",n.offsetHeight,n.classList.add("active")}function Et(t){let i=document.getElementById("kit-qadd-comp-cat-section"),n=document.getElementById("kit-qadd-comp-free-section");i&&(i.style.display=t==="cat"?"":"none"),n&&(n.style.display=t==="free"?"":"none")}function Ei(){let t=document.getElementById("kit-qadd-comp-cat"),i=document.getElementById("kit-qadd-comp-comp");if(!t||!i)return;let n=t.value,o=J().filter(s=>(s.categoria||"Senza categoria")===n);i.innerHTML=o.length?o.map(s=>`<option value="${a(s.id)}">${a(s.nome)}${s.codice?" \xB7 "+a(s.codice):""}</option>`).join(""):'<option value="">Nessun componente in questa categoria</option>'}function qi(){let t=document.getElementById("modal-kit-qadd-comp");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function nn(){let t=document.getElementById("kit-qadd-comp-source-cat")?.checked,i="",n="";if(t){let l=document.getElementById("kit-qadd-comp-comp")?.value;if(!l){y("Seleziona un componente dal catalogo","warning");return}let p=J().find(m=>m.id===l);if(!p){y("Componente non trovato nel catalogo","warning");return}i=p.nome,n=p.codice||""}else{if(i=(document.getElementById("kit-qadd-comp-nome")?.value||"").trim(),!i){y("Inserisci il nome del componente","warning");return}n=(document.getElementById("kit-qadd-comp-codice")?.value||"").trim()}let e=parseFloat(document.getElementById("kit-qadd-comp-qty")?.value)||1,o=document.getElementById("kit-qadd-comp-unit")?.value||"pz",{kits:s}=b(),r=s.find(c=>c.id===ot.kitId);if(!r)return;let d=(r.sezioni||[]).find(c=>c.id===ot.sezId);d&&(d.componenti=d.componenti||[],d.componenti.push({id:C(),nome:i,codice:n,qtaBase:e,qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:o,applicazioneTipo:"sempre"}),S(s),qi(),setTimeout(()=>B("kits"),320))}function on(t,i,n,e,o){let{kits:s}=b(),r=s.find(l=>l.id===t);if(!r)return;let d=(r.sezioni||[]).find(l=>l.id===i);if(!d)return;let c=(d.componenti||[]).find(l=>l.id===n);c&&(e==="qtaBase"?c.qtaBase=parseFloat(o)||0:c[e]=o,S(s))}function sn(t,i,n){if(!n.trim())return;let{kits:e}=b(),o=e.find(r=>r.id===t);if(!o)return;let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s.nome=n.trim(),S(e))}function an(t,i,n){let{kits:e}=b(),o=e.find(r=>r.id===t);if(!o)return;let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s.componenti=(s.componenti||[]).filter(r=>r.id!==n),S(e),B("kits"))}function rn(t,i){if(!confirm("Rimuovere questa sezione e tutti i suoi componenti?"))return;let{kits:n}=b(),e=n.find(o=>o.id===t);e&&(e.sezioni=(e.sezioni||[]).filter(o=>o.id!==i),S(n),B("kits"))}function cn(t){if(!confirm("Eliminare questo kit? L'operazione non \xE8 reversibile."))return;let{kits:i}=b(),n=i.filter(e=>e.id!==t);S(n),B("kits")}function dn(){Ii()}function Mi(t){Ut=t,U="info",Q()}function Ct(t,i,n=""){let{kits:e}=b(),o=e.find(c=>c.id===t),s=e.find(c=>c.id!==t&&(c.sezioni||[]).length),r=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?r:s?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function Oi(t){w=Ct(t,"import"),j(!0)}function ln(t){w=Ct(t,"import-asse"),j(!0)}function pn(t,i){w=Ct(t,"copy",i),j(!0)}function nt(){let t=document.getElementById("modal-kit-import");w=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function mn(t){if(!w||t!=="import"&&t!=="copy"||w.mode===t)return;let i=w.currentKitId,n=t==="copy"?w.sectionId:"";w=Ct(i,t,n),j()}function un(t){w&&(w.search=String(t||""),j())}function fn(t){if(!w)return;let{kits:i}=b(),n=i.find(e=>e.id===t);w.sourceKitId=t,w.mode==="import-asse"?w.asseId=n?.assiConfigurazione?.[0]?.id||"":w.sectionId=n?.sezioni?.[0]?.id||"",j()}function gn(t){w&&(w.mode==="import-asse"?w.asseId=t:w.sectionId=t,j())}function kn(t,i){if(!w||w.mode!=="copy")return;let n=new Set(w.targetKitIds||[]);i?n.add(t):n.delete(t),w.targetKitIds=[...n],j()}function vn(){if(!w||w.mode!=="copy")return;let{kits:t}=b(),i=t.filter(e=>e.id!==w.currentKitId&&yt(e.nome,w.search)),n=new Set(w.targetKitIds||[]);for(let e of i)n.add(e.id);w.targetKitIds=[...n],j()}function yn(){!w||w.mode!=="copy"||(w.targetKitIds=[],j())}function j(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!w)return;let{kits:n}=b(),e=w,o=n.find(g=>g.id===e.currentKitId);if(!o){nt();return}let s=[];e.mode==="import"?s=n.filter(g=>g.id!==o.id&&(g.sezioni||[]).length):e.mode==="import-asse"?s=n.filter(g=>g.id!==o.id&&(g.assiConfigurazione||[]).length):s=n.filter(g=>g.id!==o.id&&(g.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!s.some(g=>g.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(g=>g!==o.id&&n.some(h=>h.id===g)));let r=n.find(g=>g.id===e.sourceKitId)||null,d=e.mode==="import-asse"?r?.assiConfigurazione||[]:r?.sezioni||[];e.mode==="import-asse"?d.some(g=>g.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(g=>g.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(r?.assiConfigurazione||[]).find(g=>g.id===e.asseId)||null:Tt(r,e.sectionId),l=s.filter(g=>yt(g.nome,e.search)),p=n.filter(g=>g.id!==o.id&&yt(g.nome,e.search)),m=document.getElementById("kit-import-subtitle"),u=document.getElementById("kit-import-search"),f=document.getElementById("kit-import-left-title"),z=document.getElementById("kit-import-right-title"),k=document.getElementById("kit-import-kit-list"),_=document.getElementById("kit-import-section-list"),K=document.getElementById("kit-import-target-wrap"),ft=document.getElementById("kit-import-target-list"),tt=document.getElementById("kit-import-preview"),V=document.getElementById("kit-import-confirm-btn"),$t=document.getElementById("kit-import-mode-import"),gt=document.getElementById("kit-import-mode-copy");if(!m||!u||!f||!z||!k||!_||!K||!ft||!tt||!V||!$t||!gt)return;$t.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),gt.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),u.value=e.search,e.mode==="import"?(m.textContent=`Importa una sezione esistente dentro "${o.nome}".`,u.placeholder="Cerca kit sorgente\u2026",f.textContent="Kit sorgente",z.textContent=r?`Sezioni di ${r.nome}`:"Sezione",K.style.display="none",k.innerHTML=l.length?l.map(g=>{let h=g.id===e.sourceKitId;return`<label class="kit-import-option ${h?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${h?"checked":""}
                           onchange="_kitCfgSelectImportSource('${a(g.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(g.nome)}</span>
                        <span class="kit-import-option-meta">${(g.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(m.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,u.placeholder="Cerca kit destinazione\u2026",f.textContent="Kit sorgente",z.textContent="Sezione da copiare",K.style.display="flex",k.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${a(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,ft.innerHTML=p.length?p.map(g=>{let h=(e.targetKitIds||[]).includes(g.id),I=c?mt(o,g):null,M=`${(g.sezioni||[]).length} sezioni`;return I&&(I.hasTargetVarianti?I.needsReview?M=`${I.exactMatches}/${I.targetCount} combinazioni allineate`:M=`${I.targetCount}/${I.targetCount} combinazioni allineate`:M="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${h?"kit-import-option--active":""}">
                    <input type="checkbox" ${h?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${a(g.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(g.nome)}</span>
                        <span class="kit-import-option-meta">${a(M)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),_.innerHTML=d.length?d.map(g=>{let h=e.mode==="import-asse"?g.id===e.asseId:g.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${h?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${h?"checked":""}
                           onchange="_kitCfgSelectImportSection('${a(g.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(g.nome)}</span>
                        <span class="kit-import-option-meta">${(g.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${h?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${h?"checked":""}
                       onchange="_kitCfgSelectImportSection('${a(g.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(g.nome)}</span>
                    <span class="kit-import-option-meta">${(g.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let it=!1,v="kit-cfg-help kit-import-preview",$="";if(e.mode==="import"){if(!r)$="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)$="Seleziona una sezione da importare nel kit corrente.";else{let g=mt(r,o);it=!0,$=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 importata in <strong>${a(o.nome)}</strong>. `,g.hasTargetVarianti?g.needsReview?(v="kit-cfg-warn kit-import-preview",$+=`${g.exactMatches} combinazioni su ${g.targetCount} risultano allineate: controlla i coefficienti importati.`):$+=`Tutte le ${g.targetCount} combinazioni del kit destinazione risultano allineate.`:(v="kit-cfg-warn kit-import-preview",$+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}V.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")r?c?(it=!0,$=`L'asse <strong>${a(c.nome)}</strong> verr\xE0 importato in <strong>${a(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):$="Seleziona un asse da importare nel kit corrente.":$="Seleziona un kit sorgente per vedere gli assi disponibili.",V.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let g=n.filter(h=>(e.targetKitIds||[]).includes(h.id));if(!c)$="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!g.length)$="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{it=!0;let h=g.filter(I=>mt(o,I).needsReview).length;$=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 copiata in <strong>${g.length}</strong> kit.`,h>0?(v="kit-cfg-warn kit-import-preview",$+=` <strong>${h}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):$+=" Le combinazioni risultano allineate su tutti i kit selezionati."}V.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}tt.className=v,tt.innerHTML=$,V.disabled=!it,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let g=document.getElementById("kit-import-search");g&&g.focus()},40))}function bn(){if(!w)return;let{kits:t}=b(),i=w,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Tt(e,i.sectionId),s=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!s){y("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(m=>String(m.nome||"").trim().toLowerCase()===String(s.nome||"").trim().toLowerCase()),p=0;if(l){l.opzioni=l.opzioni||[];for(let m of s.opzioni||[]){let u=String(m.codice||"").trim().toLowerCase(),f=!1;if(u&&(f=l.opzioni.some(z=>String(z.codice||"").trim().toLowerCase()===u&&u!=="")),f||(f=l.opzioni.some(z=>String(z.nome||"").trim().toLowerCase()===String(m.nome||"").trim().toLowerCase())),!f){let z=(l.opzioni||[]).length+1;l.opzioni.push({id:C(),key:F(m?.key,"opz"+z),nome:String(m?.nome||"").trim()||"opz"+z,codice:String(m?.codice||"").trim()}),p+=1}}S(t),nt(),Q(),p?y(`${p} opzione${p>1?"i":""} aggiunta${p>1?"e":""} all'asse "${s.nome}" \u2713`):y(`Nessuna nuova opzione trovata per l'asse "${s.nome}"`);return}n.assiConfigurazione.push(si(s,e,n)),S(t),nt(),Q(),y(`Asse "${s.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=mt(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(vt(o,e,n)),S(t),nt(),Q();let p="";l.hasTargetVarianti?l.needsReview&&(p=" Controlla le quantit\xE0 sulle combinazioni non allineate."):p=" Definisci poi gli assi del kit per rifinire i coefficienti.",y(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${p}`);return}let r=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!r.length){y("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let d=0;for(let l of r)mt(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(vt(o,e,l));S(t),nt(),Q();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xE0.`),y(`Sezione "${o.nome}" copiata in ${r.length} kit \u2713${c}`)}function hn(t){let{kits:i}=b(),n=i.find(e=>e.id===t)||null;A={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},ct(!0)}function Bi(){let t=document.getElementById("modal-kit-presets");A=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function zn(t){A&&(A.search=String(t||""),ct())}function wn(t){A&&(A.selectedPresetId=t,ct())}function _n(){if(!A)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){y("Inserisci il nome del preset \u26A0\uFE0F");return}let e=i?.value||"";Ti(A.currentKitId,e,n)}function Ti(t,i,n){let{kits:e}=b(),o=e.find(d=>d.id===t);if(!o){y("Kit non trovato \u26A0\uFE0F");return}let s=Tt(o,i);if(!s){y("Seleziona una sezione valida \u26A0\uFE0F");return}let r=st();r.push({id:C(),nome:String(n||"").trim(),sourceKitId:o.id,sezione:JSON.parse(JSON.stringify(s))}),Lt(r),y("Preset salvato \u2713"),A&&A.currentKitId===t&&ct(),Q()}function Cn(t){if(!A)return;let i=st(),n=t||A.selectedPresetId,e=i.find(d=>d.id===n);if(!e){y("Seleziona un preset \u26A0\uFE0F");return}let{kits:o}=b(),s=o.find(d=>d.id===A.currentKitId),r=o.find(d=>d.id===e.sourceKitId)||null;if(!s){y("Kit non trovato \u26A0\uFE0F");return}s.sezioni=s.sezioni||[],s.sezioni.push(vt(e.sezione,r,s)),S(o),Bi(),Q(),y(`Preset "${e.nome}" applicato \u2713`)}function $n(t,i){let n=st(),e=n.find(o=>o.id===t);if(!e){y("Preset non trovato \u26A0\uFE0F");return}e.nome=String(i||"").trim()||e.nome,Lt(n),y("Nome aggiornato \u2713"),ct()}function Sn(t){let i=st().filter(n=>n.id!==t);Lt(i),A&&(A.selectedPresetId=""),ct(),y("Preset eliminato \u2713")}function ct(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!A)return;let n=st(),e=A,o=b().kits.find(u=>u.id===e.currentKitId),s=n.filter(u=>yt(u.nome,e.search)),r=document.getElementById("preset-list"),d=document.getElementById("preset-preview"),c=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),p=document.getElementById("preset-apply-btn");if(!r||!d||!c||!l||!p)return;r.innerHTML=s.length?s.map(u=>{let f=u.id===e.selectedPresetId;return`<label class="kit-import-option ${f?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${f?"checked":""} onchange="_kitSelectPreset('${a(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let m=n.find(u=>u.id===e.selectedPresetId)||null;if(m){let u=m.sourceKitId&&b().kits.find(f=>f.id===m.sourceKitId)?.nome||"";d.innerHTML=`<div style="padding:6px"><strong>${a(m.nome)}</strong><div style="color:#94a3b8">${a(u)}</div></div>`+(m.sezione?.componenti?.length?`<div>${m.sezione.componenti.map(f=>`<div class="kit-meta-pill">${a(f.nome)}${f.codice?" \xB7 "+a(f.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else d.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;p.disabled=!m,c.value="",l.innerHTML=(o?.sezioni||[]).map(u=>`<option value="${a(u.id)}">${a(u.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("preset-search");u&&u.focus()},40))}function Q(){let{kits:t}=b(),i=t.find(v=>v.id===Ut);if(!i){rt();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=q(i);U==="sezioni"&&(U="bom"),U==="sa"&&(U="bom");let s=["info","varianti","anagrafiche","bom"],r={info:"Prodotto",varianti:"Elettronica selezionabile",anagrafiche:"Anagrafiche",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,$)=>v+($.componenti||[]).length,0),p=c?`
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
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>',m=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${a(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${a(i.id)}',this.value)">
        </div>
        ${p}
        <div class="kit-cfg-danger">
            <button type="button" class="kit-cfg-add-btn" onclick="_kitDuplicaKit('${a(i.id)}')"><i class="fas fa-clone"></i> Duplica kit</button>
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${a(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,u=e.map((v,$)=>{let g=(v.opzioni||[]).map((h,I)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${a(h.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(h.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${a(h.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(h.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${a(i.id)}','${a(v.id)}','${a(h.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${$}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${g||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),f=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potr\xE0 comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${o.slice(0,12).map(v=>`<span class="kit-cfg-sa-var-badge" title="${a(v.key)}">${a(v.nome)}</span>`).join(" ")}${o.length>12?`<span class="kit-cfg-sa-count">+${o.length-12} altre</span>`:""}</div>
        </div>`:"",z=`
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
            ${f}
        </div>`,k=(i.sezioni||[]).map((v,$)=>{let g=(v.componenti||[]).map(h=>{let I=D(h),M=Dt(h,i),Ft=(e||[]).find(E=>E.id===M.asseId)||null,Di=M.tipo==="gruppo"&&Ft?`<div class="kit-cfg-row">${(Ft.opzioni||[]).map(E=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${M.opzioneIds.includes(E.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${a(i.id)}','${a(v.id)}','${a(h.id)}','${a(E.id)}',this.checked)">
                        ${a(E.nome)}
                    </label>`).join("")}</div>`:"",Ki=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(h.id)}','asseId',this.value)">
                        ${e.map(E=>`<option value="${a(E.id)}" ${M.asseId===E.id?"selected":""}>${a(E.nome)}</option>`).join("")}
                   </select>`:"",Li=M.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",Gt=I?"flag":ht(h.unitaMisura,"pz"),Pi=I?[{value:"flag",label:"Solo avviso"}]:[...new Set([Gt,...Ui])].filter(Boolean).map(E=>({value:E,label:E}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${a(h.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(h.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${a(h.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(h.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(h.id)}','modo','',this.value)">
                        <option value="quantificato" ${I?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${I?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${a(i.id)}','${a(v.id)}','${a(h.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${M.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(h.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(h.id)}','unitaMisura','',this.value)"
                            ${I?"disabled":""}>
                        ${Pi.map(E=>`<option value="${a(E.value)}" ${Gt===E.value?"selected":""}>${a(E.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(h.id)}','tipo',this.value)">
                        <option value="sempre" ${M.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${M.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${M.tipo==="gruppo"?Ki:""}
                </div>
                ${M.tipo==="gruppo"?Di:""}
                <input class="kit-cfg-input" value="${a(h.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(h.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${I?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Li}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${$}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${a(i.id)}','${a(v.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${g}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),_=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unit\xE0 corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${o.length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>'}
            ${k}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${a(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,K="";o.length?K=o.map(v=>{let $=(i.sottoAssembly||[]).map((h,I)=>({sa:h,i:I})).filter(({sa:h})=>h.varianteKey===v.key),g=$.map(({sa:h,i:I})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${a(h.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${a(i.id)}',${I},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${a(i.id)}',${I})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${a(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${$.length} part${$.length!==1?"i":"e"}</span>
                </div>
                ${g||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${a(i.id)}','${a(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${a(v.nome)}</button>
            </div>`}).join(""):K='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let ft=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${K}
        </div>`,tt={info:m,varianti:z,bom:_,sa:ft},V=st(),gt=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${V.length?V.map(v=>`<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${a(v.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${a(v.sourceKitId&&b().kits.find($=>$.id===v.sourceKitId)?.nome||"")}</div>
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
        </div>`;tt.anagrafiche=gt;let it=s.map(v=>`<button class="kit-tab ${U===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${r[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${a(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${a(i.nome)}</span>
        </div>
        <div class="kit-tabs">${it}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${tt[U]}</div>
    </div>`,dt(n)}function In(t){if(t&&O===t){L();return}O=t,L()}function xn(t){U=t,Q()}function x(t,i,n=!0){let{kits:e}=b(),o=e.find(s=>s.id===t);o&&(i(o),S(e),n&&Q())}function An(t,i){x(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function En(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=b();S(i.filter(n=>n.id!==t)),Ut=null,O=null,rt()}function qn(t){let{kits:i}=b(),n=i.find(o=>o.id===t);if(!n)return;let e={id:C(),nome:`Copia di ${n.nome}`,schemaVersion:Ot,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(si(o,n,e));e.varianti=ni(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(vt(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:C(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),S(i),Mi(e.id),y(`Kit "${n.nome}" duplicato \u2713`)}function Ni(t){x(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:C(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:C(),key:"opz1",nome:"Opzione 1"}]})})}function Mn(t,i,n,e){x(t,function(o){let s=(o.assiConfigurazione||[]).find(r=>r.id===i);s&&(n==="key"?s.key=F(e,s.key||"asse"):s[n]=e.trim())})}function On(t,i){x(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function Bn(t,i){x(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:C(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function Tn(t,i,n,e,o){x(t,function(s){let r=(s.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=F(o,d.key||"opzione"):d[e]=o.trim())})}function Nn(t,i,n){x(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function Dn(t){Ni(t)}function Kn(t){x(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:C(),nome:"Nuova sezione",componenti:[]})})}function Ln(t){Oi(t)}function Pn(t,i,n,e){x(t,function(o){let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s[n]=e.trim())},!1)}function Rn(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&x(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function Hn(t,i){x(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:C(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function jn(t,i,n,e,o,s){x(t,function(r){let d=(r.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=W(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":ht(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function Qn(t,i,n,e,o){x(t,function(s){let r=(s.sezioni||[]).find(l=>l.id===i),d=r&&(r.componenti||[]).find(l=>l.id===n);if(!d)return;let c=Dt(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(p=>p.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=W(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(p=>p.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Bt(d,s,c)})}function Vn(t,i,n,e,o){x(t,function(s){let r=(s.sezioni||[]).find(p=>p.id===i),d=r&&(r.componenti||[]).find(p=>p.id===n);if(!d)return;let c=Dt(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Bt(d,s,c)})}function Un(t,i,n,e){x(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),r=s&&(s.componenti||[]).find(d=>d.id===n);!r||D(r)||(r.tracciabile=!!e)},!1)}function Fn(t,i,n){x(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function Gn(t){x(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:C(),nome:"",varianteKey:q(i)[0]?.key||""})})}function Jn(t,i){x(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:C(),nome:"",varianteKey:i,noteConfig:""})})}function Yn(t,i,n,e){x(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function Wn(t,i){x(t,function(n){n.sottoAssembly.splice(i,1)})}function Zn(t){let i=document.getElementById("modal-kit-distinta-edit");if(!i){yi(t);return}let{kits:n}=b(),e=n.find(c=>c.id===t);if(!e)return;let o=G(e),s=H(o),r=document.getElementById("distinta-edit-nome"),d=document.getElementById("distinta-edit-documento");r&&(r.value=s.documento||""),d&&(d.value=s.documento||""),i.dataset.kitId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>r&&r.focus(),80)}function qt(){let t=document.getElementById("modal-kit-distinta-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Xn(){let t=document.getElementById("modal-kit-distinta-edit");if(!t)return;let i=t.dataset.kitId,n=(document.getElementById("distinta-edit-nome")?.value||"").trim(),e=(document.getElementById("distinta-edit-documento")?.value||"").trim();if(!n){y("Inserisci un nome per la distinta.","warning");return}P(i,function(p){let m=H(p);e?m.documento=e:m.documento||(m.documento=n),wt(p,m)});let{kits:o}=b(),s=o.find(p=>p.id===i);if(!s){qt(),y("Kit non trovato \u26A0\uFE0F");return}let r=G(s),d=_t(s,r);if(!d.totalePezzi||!d.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}let c=X(),l={id:C(),kitId:s.id,kitNome:s.nome,nome:n||r._meta?.documento||`Distinta-${Date.now()}`,documento:e||r._meta?.documento||"",createdAt:Date.now(),createdBy:R?.nome||"Sistema",orderDraftSnapshot:r,distintaSnapshot:d};c.unshift(l),zt(c),qt(),y("Distinta salvata \u2713"),T==="distinte"&&B("distinte")}function ro(){window._kitOpenView=Ce,window._kitOpenConfig=Mi,window._kitNuovoKit=dn,window._kitBack=$e,window._kitOpenPrintPreview=me,window._kitSwitchTab=Se,window._kitAggiornaQty=Ie,window._kitOrdineSet=xe,window._kitOrdineDelta=Ae,window._kitOrdineReset=Ee,window._kitOrdineResetVoce=qe,window._kitOrderSearch=Me,window._kitOrderHideSearch=Oe,window._kitOrderPick=Be,window._kitOrderRemoveRef=Te,window._kitComposeSelect=Ne,window._kitComposeAdd=De,window._kitAggiornaCar=zi,window._kitAggiornaPronti=Ke,window._kitSetPronti=Le,window._kitApriModalSped=Ue,window._kitChiudiModalSped=$i,window._kitConfermaSpedizione=Fe,window._kitApriModalReso=Ge,window._kitChiudiModalReso=Si,window._kitResoQtyChange=Je,window._kitResoAggiornaBOM=Vt,window._kitConfermaReso=Ye,window._kitSalvaMovimento=Re,window._kitEliminaMovimento=He,window._kitModificaMovimento=Qe,window._kitChiudiModalEditMov=Ci,window._kitConfermaModificaMov=Ve,window._kitChiudiModalDelMov=wi,window._kitConfermaEliminaMov=_i,window._kitSalvaManuale=We,window._kitElimina=En,window._kitDuplicaKit=qn,window._kitCfgBack=In,window._kitCfgSwitchTab=xn,window._kitCfgSaveNome=An,window._kitCfgAddVar=Dn,window._kitCfgOpenImportModal=Oi,window._kitCfgOpenImportAsseModal=ln,window._kitCfgOpenCopySezModal=pn,window._kitCfgCloseImportModal=nt,window._kitCfgSetImportMode=mn,window._kitCfgSetImportSearch=un,window._kitCfgSelectImportSource=fn,window._kitCfgSelectImportSection=gn,window._kitCfgToggleImportTarget=kn,window._kitCfgSelectAllImportTargets=vn,window._kitCfgClearImportTargets=yn,window._kitCfgConfirmImport=bn,window._kitOpenPresetsModal=hn,window._kitClosePresetsModal=Bi,window._kitSetPresetsSearch=zn,window._kitSelectPreset=wn,window._kitCreatePresetFromSection=_n,window._kitCreatePreset=Ti,window._kitApplyPreset=Cn,window._kitRenamePreset=$n,window._kitDeletePreset=Sn,window._kitCfgAddAsse=Ni,window._kitCfgUpdateAsse=Mn,window._kitCfgDelAsse=On,window._kitCfgAddOpzione=Bn,window._kitCfgUpdateOpzione=Tn,window._kitCfgDelOpzione=Nn,window._kitCfgAddSez=Kn,window._kitCfgImportSez=Ln,window._kitCfgUpdateSez=Pn,window._kitCfgDelSez=Rn,window._kitCfgAddComp=Hn,window._kitCfgUpdateComp=jn,window._kitCfgUpdateCompRule=Qn,window._kitCfgToggleCompOption=Vn,window._kitCfgToggleCompTracked=Un,window._kitCfgDelComp=Fn,window._kitCfgAddSA=Gn,window._kitCfgAddSAForVariant=Jn,window._kitCfgUpdateSA=Yn,window._kitCfgDelSA=Wn,window._kitSwitchMainTab=B,window._kitRenderKitsGrid=gi,window._kitRenderAnagrafichePage=ki,window._kitRenderDistintePage=vi,window._kitLoadDistinte=X,window._kitSaveDistinte=zt,window._kitCreateDistintaFromDraft=yi,window._kitLoadAnagrafiche=J,window._kitSaveAnagrafiche=Qt,window._kitOpenAnagraficaModal=ye,window._kitCloseAnagraficaModal=bi,window._kitConfirmSaveAnagrafica=be,window._kitDeleteAnagrafica=he,window._kitOpenCreaKit=Ii,window._kitCloseCreaKit=xi,window._kitConfirmCreaKit=Ze,window._kitQAddSezOpen=Xe,window._kitQAddSezClose=Ai,window._kitQAddSezConfirm=tn,window._kitQAddCompOpen=en,window._kitQAddCompToggleSource=Et,window._kitQAddCompChangeCategoria=Ei,window._kitQAddCompClose=qi,window._kitQAddCompConfirm=nn,window._kitQUpdateComp=on,window._kitQRenomeSez=sn,window._kitQDelComp=an,window._kitQDelSez=rn,window._kitQDelKit=cn,window._kitRenderHeaderActions=jt,window._kitOpenSaveDistintaModal=Zn,window._kitCloseSaveDistintaModal=qt,window._kitConfirmSaveDistinta=Xn,window._kitDistintaOpenPrint=ze,window._kitDistintaApplyToDraft=we,window._kitDistintaDelete=_e}var Mt,kt,Zt,Jt,Xt,Ot,Ui,ti,Fi,ii,Gi,At,Y,lt,xt,T,pt,Wt,O,hi,Ut,U,w,A,ot,co,to=Ri(()=>{Hi();Qi();Vi();ji();Mt="_mlKitData",kt="_mlKitDataTs",Zt="_mlKitOrderDrafts",Jt="_mlKitOrderDraftSeq",Xt="_mlKitPresetSections",Ot=2,Ui=["pz","mt","cm","mm","kg","g","lt","ml"],ti="_mlKitDistinte",Fi="_mlKitDistinteTs",ii="_mlKitAnagrafiche",Gi="_mlKitAnagraficheTs",At=!1,Y=[],lt=null,xt={},T="kits";pt={};Wt=null;O=null,hi="ordine";Ut=null,U="info",w=null,A=null,ot={kitId:null,sezId:null};co=rt});to();export{rt as caricaKitProdotti,co as default,ro as registerGlobals,ao as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-EZ7363OR.js.map
