import{a as Qi,c as It,e as Ui,f as a,g as w,h as ut,l as Vi,m as j,q as Fi,r as At,u as Gi}from"./chunk-chunk-55SFP7PR.js";function Io(){Et=!1}function Q(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function it(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function at(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function vt(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function Zi(t,i){let n="opz"+(i+1),e=Q(t?.key,n);return{id:String(t?.id||$()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function Xi(t,i){let n="asse"+(i+1),e=Q(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,r)=>Zi(s,r)).filter(Boolean):[];return{id:String(t?.id||$()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function ei(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function te(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function ni(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let r of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:r.id,opzioneKey:r.key,opzioneNome:r.nome,opzioneCodice:String(r.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:ei(e.selections),nome:te(e.selections),selections:e.selections}})}function ie(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||$()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:vt(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:it(t?.qtaBase)}}function ee(t){return{id:String(t?.id||$()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(ie):[]}}function ne(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function oi(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:it(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||it(Object.values(t?.qtaPerVariante||{})[0])};let e=q(i);if(!e.length)return n;let o=e.filter(c=>K(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>K(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>K(t,c.key)))};let r=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:r};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let u of c.opzioni||[]){let p=new Set(e.filter(b=>(b.selections||[]).some(f=>f.asseId===c.id&&f.opzioneId===u.id)).map(b=>b.key));if(!p.size)continue;[...p].every(b=>K(t,b)===r)&&l.push(u.id)}if(!l.length)continue;let m=new Set(e.filter(u=>(u.selections||[]).some(p=>p.asseId===c.id&&l.includes(p.opzioneId))).map(u=>u.key));if(ne(m,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:r}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:r}}function Nt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=it(n.qtyBase);if(!o)return e;for(let s of q(i)){let r=n.tipo==="sempre";n.tipo==="gruppo"&&(r=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),r&&(e[s.key]=o)}return e}function oe(t,i){let n=ee(t);return n.componenti=n.componenti.map(function(e){let o=oi(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:Nt(e,i,o)}}),n}function ae(t,i){let n=q(i);if(!n.length)return null;let e=null;for(let o of n){let s=K(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function se(t,i,n){let e=q(n),o={},s=ae(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let r of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},r.key)?K(t,r.key):s!==null?s:0;c>0&&(o[r.key]=c)}return{id:$(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:Lt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:vt(t?.unitaMisura,D(t)?"flag":"pz")}}function ht(t,i,n){return{id:$(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>se(e,i,n)):[]}}function ai(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=Q(t?.key||String(t?.nome||"asse"),"asse1"),s=o,r=1;for(;e.has(s);)s=o+"_c"+r++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],m="opz"+(c+1),u=Q(l?.key,m),p=1;for(;d.some(g=>g.key===u);)u=u+"_c"+p++;d.push({id:$(),key:u,nome:String(l?.nome||"").trim()||u,codice:String(l?.codice||"").trim()})}return{id:$(),key:s,nome:String(t?.nome||"").trim()||s,opzioni:d}}function Dt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function kt(t,i){let n=new Set(q(t).map(s=>s.key)),e=q(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function zt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function re(t,i){return{id:String(t?.id||$()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function si(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(u,p){let g="v"+(p+1),b=Q(u?.key,g);return{id:String(u?.id||$()),key:b,nome:String(u?.nome||b).trim()||b}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((u,p)=>Xi(u,p)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(u){return{id:u.id,key:u.key,nome:u.nome}})}]:[],s=ni(o),r=s.length?s:n,d=new Set(r.map(u=>u.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(u){d.has(u[0])&&(c[u[0]]=Math.max(0,Number.parseInt(u[1],10)||0))});for(let u of r)c[u.key]===void 0&&(c[u.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(u=>re(u,r[0]?.key||"")).filter(u=>!u.varianteKey||d.has(u.varianteKey)):[],m={};return Object.entries(i.pronti||{}).forEach(function(u){m[u[0]]=Math.max(0,Number.parseInt(u[1],10)||0)}),{id:String(i.id||$()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Tt,assiConfigurazione:o,varianti:r,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(u=>oe(u,{assiConfigurazione:o,varianti:r})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function q(t){return Array.isArray(t?.varianti)?t.varianti:[]}function D(t){return!!t&&t.modoComponente==="segnalazione"}function Lt(t){return!!t&&t.tracciabile!==!1&&!D(t)}function K(t,i){let n=it(t?.qtaPerVariante?.[i]);return D(t)?n>0?1:0:n}function Ct(t,i){return oi(t,i)}function Kt(){try{let t=localStorage.getItem(Zt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function ri(t){try{localStorage.setItem(Zt,JSON.stringify(t||{}))}catch{}}function ct(){try{let t=localStorage.getItem(Xt),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Pt(t){try{localStorage.setItem(Xt,JSON.stringify(t||[]))}catch{}}function nt(){try{let t=localStorage.getItem(ti),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function _t(t){try{localStorage.setItem(ti,JSON.stringify(t||[]));try{localStorage.setItem(Wi,Date.now())}catch{}}catch{}}function dt(t){return String(t||"").trim().toUpperCase()}function yt(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(dt).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function U(t){return yt(t?._meta||{})}function $t(t,i){return t._meta=yt(i),t._meta}function et(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function ci(){let t=1;try{t=(Number.parseInt(localStorage.getItem(Jt),10)||0)+1,localStorage.setItem(Jt,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function di(t){let i=U(t);return i.documento||(i.documento=ci(),$t(t,i)),i.documento}function Wt(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:dt(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function li(){return X.length?Promise.resolve(X):Array.isArray(window._attiviProd)&&window._attiviProd.length?(X=Wt(window._attiviProd),Promise.resolve(X)):ft||(ft=fetch(It,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(X=Wt(t),X)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){ft=null}),ft)}function ce(t){let i=dt(t);return i&&X.find(n=>n.ordine===i)||null}function pi(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=dt(e);return o?i[o]?String(i[o]||"").trim():String(ce(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function Z(t){let i=Kt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of q(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=yt(n._meta||{}),e}function H(t,i){let{kits:n}=h(),e=n.find(m=>m.id===t);if(!e)return;let o=Kt(),s=Z(e);i(s,e);let r={},d=!1;for(let m of q(e)){let u=Math.max(0,Number.parseInt(s[m.key],10)||0);r[m.key]=u,u>0&&(d=!0)}let c=yt(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(c.documento||(c.documento=ci()),r._meta=c),d||l?o[t]=r:delete o[t],ri(o),B===t&&R()}function de(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function Rt(t){let i=gt[t.id]&&typeof gt[t.id]=="object"?gt[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return gt[t.id]=n,n}function mi(t,i){let n=t.assiConfigurazione||[];if(!n.length)return q(t)[0]||null;let e=[];for(let s of n){let r=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===r);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=ei(e);return q(t).find(s=>s.key===o)||null}function le(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function pe(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let r of s.componenti||[])if(!D(r)&&!(K(r,i.key)<=0)&&r.applicazioneTipo==="gruppo"&&String(r.applicazioneAsseId||"")===e&&Array.isArray(r.applicazioneOpzioneIds)&&r.applicazioneOpzioneIds.includes(o))return!0;return!1}function me(t,i,n){let e=[],o=new Map;for(let s of i){let r=et(n,s.key);if(r)for(let d of s.selections||[]){if(pe(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=r;continue}let m={id:"sel-"+c,nome:le(d),codice:String(d?.opzioneCodice||"").trim(),totale:r,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,m),e.push(m)}}return e}function xt(t,i){let n=q(t).filter(r=>et(i,r.key)>0),e=[],o=[],s=me(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let r of t.sezioni||[]){let d=[];for(let c of r.componenti||[]){let l=0,m=[];for(let p of n){let g=et(i,p.key),b=K(c,p.key);!g||!b||(D(c)?l+=g:l+=g*b,m.push({nome:p.nome,pezziOrdine:g,coeff:b}))}if(!m.length)continue;let u=m.length===1?m[0].nome:m.length+" configurazioni";if(D(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:u});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:u})}d.length&&e.push({id:r.id,nome:r.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:de(i),totaleRighe:e.reduce((r,d)=>r+d.righe.length,0)}}function ue(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function fe(){return String(window._distintaHeaderAzienda||"").trim()}function ui(t,i,n){let e=new Date,o=U(n),s=fe(),r=String(o.documento||"").trim(),d=s?s.split(/\r?\n/).map(g=>`<div>${a(g)}</div>`).join(""):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),m=i.selectedVarianti.length?i.selectedVarianti.map(g=>{let b=et(n,g.key);return`<tr>
                <td>${a(at(b))}</td>
                <td>${a(g.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',u=i.sezioni.map(g=>{let b=g.righe.map(f=>{let x=[f.dettaglio,f.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${a(String(f.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${a(f.nome)}</div></td>
                <td class="db-print-cell-unit">${a(f.unita)}</td>
                <td class="db-print-cell-qty">${a(at(f.totale))}</td>
                <td class="db-print-cell-note">${x?a(x):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${a(g.nome)}</td></tr>${b}`}).join(""),p=i.avvisi.length?i.avvisi.map(g=>`<div class="db-print-alert ${g.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${a(g.nome)}</div>
                <div>${a(g.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${a(at(g.totaleCoinvolto))} pz \xB7 ${a(g.variantiLabel)}</div>
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
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${a(ue(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${a(j?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${a(at(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${a(at(i.totaleRighe))}</div></div>
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
                <tbody>${u}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${p}</div>
        </div>
    </div>
</body>
</html>`}function ge(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=Z(n),o=xt(n,e);if(!o.totalePezzi||!o.totaleRighe){w("Componi prima un ordine per generare la distinta stampabile.","warning");return}U(e).documento||(H(t,function(r){di(r)}),e=Z(n));let s=window.open("","_blank");if(!s){w("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(ui(n,o,e)),s.document.close(),s.focus()}function h(){try{let t=localStorage.getItem(Bt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(si):[]}}catch{return{kits:[]}}}function I(t){let i=Array.isArray(t)?t.map(si):[];try{localStorage.setItem(Bt,JSON.stringify({kits:i})),localStorage.setItem(bt,Date.now())}catch{}ke(i)}function ke(t){clearTimeout(Yt),Yt=setTimeout(function(){At({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function ve(t){fetch(It,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(bt)||0);if(n>0&&n>e){try{localStorage.setItem(Bt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(bt,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function $(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function Ht(){if(!j||!j.nome)return!1;let t=String(j.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||j.ruolo==="MASTER"}function ye(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(D(e)){i[e.id]=0;continue}let o=0;for(let[s,r]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(r,10)||0)*K(e,s);i[e.id]=o}return i}function be(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let r of s.componenti||[]){if(D(r))continue;let d=K(r,o);d>0&&(i[r.id]=(i[r.id]||0)+e*d)}}return i}function fi(t,i){let n=q(t).find(e=>e.key===i);return n?a(n.nome):a(i)}function jt(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function lt(){Et||(Et=!0,ve(function(n){n&&lt()}));let{kits:t}=h(),i=document.getElementById("contenitore-dati");if(i){i.innerHTML=`
    <div class="kit-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title"><i class="fas fa-toolbox" style="color:#6366f1;margin-right:6px;font-size:1.1rem"></i>Kit Prodotti</h3>
                <p class="acquisti-subtitle">Gestisci kit, componenti e distinte.</p>
            </div>
            <div id="kit-page-actions" class="acquisti-actions-wrapper"></div>
        </div>
        <div id="kit-tab-bar" style="display:flex;gap:4px;padding:8px 0 0">
            <button class="acq-tab ${L==="kits"?"active":""}" data-tab="kits" onclick="_kitSwitchMainTab('kits')"><i class="fas fa-boxes-stacked"></i> Kits</button>
            <button class="acq-tab ${L==="anagrafiche"?"active":""}" data-tab="anagrafiche" onclick="_kitSwitchMainTab('anagrafiche')"><i class="fas fa-list"></i> Anagrafiche</button>
            <button class="acq-tab ${L==="distinte"?"active":""}" data-tab="distinte" onclick="_kitSwitchMainTab('distinte')"><i class="fas fa-file-alt"></i> Distinte</button>
        </div>
        <div id="kit-main-content" class="kit-main-content" style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:0"></div>
    </div>`,T(L),Qt();try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else ut(i)}catch{ut(i)}}}function gi(t,i){if(!i)return;if(!t.length){i.innerHTML=`
        <div style="padding:40px 0;text-align:center">
            <i class="fas fa-box-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:16px;display:block"></i>
            <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun kit configurato.</p>
            <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
        </div>`;return}let n=["pz","mt","cm","mm","kg","g","lt","ml"],e=t.map(o=>{let s=o.sezioni||[],r=s.reduce((l,m)=>l+(m.componenti||[]).length,0),d=s.length,c=s.map(l=>{let m=l.componenti||[],u=m.map(p=>`
            <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #f8fafc">
                <span style="font-size:.84rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${a(p.nome)}">${a(p.nome)}${p.codice?` <span style="color:#94a3b8;font-size:.76rem">\xB7 ${a(p.codice)}</span>`:""}</span>
                <input type="number" min="0" step="any" value="${p.qtaBase!=null?p.qtaBase:1}"
                    class="input-field-modern" style="padding:4px 8px;font-size:.82rem;text-align:right"
                    onchange="_kitQUpdateComp('${a(o.id)}','${a(l.id)}','${a(p.id)}','qtaBase',this.value)"
                    title="Quantit\xE0">
                <select class="input-field-modern" style="padding:4px 6px;font-size:.82rem"
                    onchange="_kitQUpdateComp('${a(o.id)}','${a(l.id)}','${a(p.id)}','unitaMisura',this.value)">
                    ${n.map(g=>`<option value="${g}"${(p.unitaMisura||"pz")===g?" selected":""}>${g}</option>`).join("")}
                </select>
                <button type="button" class="btn-trash-modern" style="padding:4px 7px"
                    onclick="_kitQDelComp('${a(o.id)}','${a(l.id)}','${a(p.id)}')" title="Rimuovi componente"><i class="fas fa-trash"></i></button>
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
                    ${u}`:'<p style="color:#94a3b8;font-size:.82rem;padding:6px 0">Nessun componente.</p>'}
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
        </details>`}).join("");i.innerHTML=e}function Qt(){let t=document.getElementById("kit-page-actions");t&&(L==="kits"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>':L==="anagrafiche"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>':t.innerHTML="")}function T(t){L=t,document.querySelectorAll("#kit-tab-bar .acq-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)});let{kits:i}=h(),n=document.getElementById("kit-main-content");n&&(t==="kits"?gi(i,n):t==="anagrafiche"?ki(i,n):t==="distinte"&&vi(i,n),Qt())}function ki(t,i){if(!i)return;let n=V();if(!n.length){i.innerHTML=`
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
                </div>`).join(""),o+="</div></details>";i.innerHTML=o}function vi(t,i){if(!i)return;let n=nt();if(!n.length){i.innerHTML='<div style="padding:24px 0;text-align:center"><p class="acquisti-subtitle">Nessuna distinta salvata.</p></div>';return}let e=n.map(o=>`
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
        </details>`).join("");i.innerHTML=e}function yi(t){let{kits:i}=h(),n=i.find(c=>c.id===t);if(!n){w("Kit non trovato \u26A0\uFE0F");return}let e=Z(n);U(e).documento||(H(t,function(c){di(c)}),e=Z(n));let o=xt(n,e);if(!o.totalePezzi||!o.totaleRighe){w("Componi prima un ordine per generare la distinta stampabile.","warning");return}let s=nt(),r=U(e),d={id:$(),kitId:n.id,kitNome:n.nome,nome:r.documento||`Distinta-${Date.now()}`,documento:r.documento||"",createdAt:Date.now(),createdBy:j?.nome||"Sistema",orderDraftSnapshot:e,distintaSnapshot:o};s.unshift(d),_t(s),w("Distinta salvata \u2713"),L==="distinte"&&T("distinte")}function V(){try{let t=localStorage.getItem(ii),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Ut(t){try{localStorage.setItem(ii,JSON.stringify(t||[]));try{localStorage.setItem(Yi,Date.now())}catch{}}catch{}}function he(){if(document.getElementById("modal-kit-anagrafica-edit"))return;let t=document.createElement("div");t.innerHTML=`
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
    </div>`,document.body.appendChild(t.firstElementChild)}function ze(t){he();let i=document.getElementById("modal-kit-anagrafica-edit");if(!i)return;let n=document.getElementById("anag-componente"),e=document.getElementById("anag-codice"),o=document.getElementById("anag-categoria"),s=document.getElementById("anag-descrizione");if(t){let r=V().find(d=>d.id===t);r&&(n&&(n.value=r.nome||""),e&&(e.value=r.codice||""),o&&(o.value=r.categoria||""),s&&(s.value=r.descrizione||""),i.dataset.editId=t)}else n&&(n.value=""),e&&(e.value=""),o&&(o.value=""),s&&(s.value=""),delete i.dataset.editId;i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function bi(){let t=document.getElementById("modal-kit-anagrafica-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function we(){let t=document.getElementById("modal-kit-anagrafica-edit");if(!t)return;let i=t.dataset.editId,n=(document.getElementById("anag-componente")?.value||"").trim();if(!n){w("Inserisci il nome del componente","warning");return}let e=(document.getElementById("anag-codice")?.value||"").trim(),o=(document.getElementById("anag-categoria")?.value||"").trim(),s=(document.getElementById("anag-descrizione")?.value||"").trim(),r=V();if(i){let d=r.findIndex(c=>c.id===i);d!==-1?r[d]={...r[d],nome:n,codice:e,categoria:o,descrizione:s,updatedAt:Date.now()}:r.unshift({id:$(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:j?.nome||"Sistema"})}else r.unshift({id:$(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:j?.nome||"Sistema"});Ut(r),bi(),w("Componente salvato \u2713"),L==="anagrafiche"&&T("anagrafiche")}function Ce(t){let i=V().filter(n=>n.id!==t);Ut(i),L==="anagrafiche"&&T("anagrafiche"),w("Componente eliminato \u2713")}function _e(t){let i=nt().find(o=>o.id===t);if(!i)return;let{kits:n}=h(),e=n.find(o=>o.id===i.kitId)||null;if(e){let o=window.open("","_blank");if(!o){w("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}o.document.open();try{o.document.write(ui(e,i.distintaSnapshot,i.orderDraftSnapshot))}catch{o.document.write("<pre>"+a(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>")}o.document.close(),o.focus()}else{let o=window.open("","_blank");if(!o){w("Popup bloccato","warning");return}o.document.open(),o.document.write("<pre>"+a(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>"),o.document.close(),o.focus()}}function $e(t){let i=nt().find(e=>e.id===t);if(!i)return;let n=Kt();n[i.kitId]=i.orderDraftSnapshot||{},ri(n),w("Bozza ordine ripristinata per il kit selezionato \u2713")}function xe(t){let i=nt().filter(n=>n.id!==t);_t(i),L==="distinte"&&T("distinte"),w("Distinta eliminata \u2713")}function Se(t){B=t,hi="ordine",R()}function R(){let{kits:t}=h(),i=t.find(f=>f.id===B);if(!i){lt();return}let n=document.getElementById("contenitore-dati"),e=q(i),o=Z(i),s=U(o),r=xt(i,o),d=r.selectedVarianti.length?r.selectedVarianti.map(f=>`<span class="kit-meta-pill"><strong>${et(o,f.key)}</strong> \xD7 ${a(f.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=s.ordiniCliente.length?s.ordiniCliente.map(f=>`<span class="kit-order-ref-chip">${a(f)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(f)})' aria-label="Rimuovi ordine ${a(f)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=Rt(i),m=mi(i,l),u=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(f=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${a(f.nome)}</div>
                <div class="kit-compose-options">${(f.opzioni||[]).map(x=>`
                        <button type="button" class="kit-compose-option ${l[f.id]===x.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${a(i.id)}','${a(f.id)}','${a(x.id)}')">
                        ${a(x.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',p=r.selectedVarianti.length?r.selectedVarianti.map(f=>{let x=et(o,f.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${a(f.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(f.selections)&&f.selections.length?f.selections.map(M=>a(M.opzioneNome)).join(" \xB7 "):a(f.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(f.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${x}"
                           onchange="_kitOrdineSet('${a(i.id)}','${a(f.key)}',this.value)"
                           oninput="_kitOrdineSet('${a(i.id)}','${a(f.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${a(i.id)}','${a(f.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${a(i.id)}','${a(f.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,g=r.totalePezzi?r.sezioni.map(f=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${a(f.nome)}</div>
                ${f.righe.map(x=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${a(x.nome)}</div>
                            ${x.dettaglio?`<div class="kit-distinta-row-meta">${a(x.dettaglio)}</div>`:""}
                            ${x.noteConfig?`<div class="kit-distinta-row-note">${a(x.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${at(x.totale)} ${a(x.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,b=r.avvisi.length?r.avvisi.map(f=>`
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
                    ${u}
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
                <div class="kit-order-lines">${p}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${r.totaleRighe} righe materiali \xB7 ${r.avvisi.length} avvisi</div>
                ${g}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${b}
            </section>
        </div>
    </div>`,ut(n),li().catch(()=>{})}function Ie(){B=null,lt()}function Ae(t){hi=t,R()}function Me(t){H(t,function(i,n){for(let e of q(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Ee(t,i,n){try{window._kitSuppressNextFade=!0}catch{}H(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function qe(t,i,n){try{window._kitSuppressNextFade=!0}catch{}H(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function Oe(t){H(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=yt({})})}function Be(t,i){H(t,function(n){n[i]=0})}function wt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${a(e.ordine)}</span>
            <span class="ac-cliente">${a(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function Te(t,i){let n=String(i||"").trim().toLowerCase();if(!n){wt(t,[]);return}li().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);wt(t,o)})}function Ne(t){setTimeout(function(){wt(t,[])},140)}function De(t,i,n){let e=dt(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}H(t,function(s){let r=U(s);r.ordiniCliente=[...new Set(r.ordiniCliente.concat(e))],r.cliente=pi(r.ordiniCliente,{[e]:n}),$t(s,r)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),wt(t,[])}function Le(t,i){let n=dt(i);try{window._kitSuppressNextFade=!0}catch{}H(t,function(e){let o=U(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=pi(o.ordiniCliente),$t(e,o)})}function Ke(t,i,n){let{kits:e}=h(),o=e.find(r=>r.id===t);if(!o)return;let s=Rt(o);if(s[i]=n,gt[t]=s,B===t){try{window._kitSuppressNextFade=!0}catch{}R()}}function Pe(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=mi(n,Rt(n));if(!e){w("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){w("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(Mt[t])return;Mt[t]=Date.now(),setTimeout(function(){try{delete Mt[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}H(t,function(r){r[e.key]=et(r,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function zi(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=h(),s=o.find(x=>x.id===B);if(!s)return;let r=(s.sezioni||[]).find(x=>x.id===n),d=r&&(r.componenti||[]).find(x=>x.id===i);if(!d||!Lt(d))return;d.caricato=e,I(o);let l=ye(s)[i]||0,m=Math.max(0,l-e),p=be(s)[i]||0,g=t.closest("tr");if(!g)return;let b=g.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");b&&(b.textContent=l===0?"\u2014":m,b.className=l===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let f=g.querySelector(".kit-car-liberi");f&&(p>0?(f.textContent=Math.max(0,e-p)+" lib.",f.style.display=""):f.style.display="none")}function Re(t,i,n){let{kits:e}=h(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),I(e),B===t&&R())}function He(t,i,n){let{kits:e}=h(),o=e.find(r=>r.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),I(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function je(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${a(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${a(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let r=(e.righe||[]).reduce((l,m)=>l+m.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${a(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${a(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
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
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function Qe(t,i){let{kits:n}=h(),e=n.find(f=>f.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),r=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),m=(r?.value||"").trim(),u=(e.sezioni||[]).find(f=>f.id===c),p=u&&(u.componenti||[]).find(f=>f.id===d);if(!p||!Lt(p))return;i==="carico"?p.caricato=(parseInt(p.caricato)||0)+l:p.caricato=Math.max(0,(parseInt(p.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:m,mat:p.nome,ts:jt()}),I(n),s&&(s.value=1),r&&(r.value="");let g=document.getElementById("kit-mov-list-"+t);g&&(g.innerHTML=je(e,Ht()));let b=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);b&&(b.value=p.caricato,zi(b))}function Ue(t,i){if(!Ht())return;let{kits:n}=h(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&Ve(t,i,o)}function Ve(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${a(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${a(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let r=document.getElementById("btn-kit-del-ok");r&&(r.onclick=()=>Ci(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function wi(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ci(t,i){wi();let{kits:n}=h(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(r=>r.id===o.sid);for(let r of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===r.cid||l.nome===r.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+r.qty)}for(let r of o.items||[])r.saId&&e.pronti&&(e.pronti[r.saId]=(parseInt(e.pronti[r.saId])||0)+r.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let r of e.sezioni||[]){let d=(r.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=Math.max(0,(parseInt(r.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let r=(s.componenti||[]).find(d=>d.id===o.cid);r&&(r.caricato=(parseInt(r.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),I(n),B===t&&R(),w("Movimento eliminato \u2713")}}function Fe(t,i){if(!Ht())return;let{kits:n}=h(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let r=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");r&&(r.innerHTML=`<span class="kit-mov-badge ${a(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${a(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function _i(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ge(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);_i();let{kits:e}=h(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let r=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){w("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==r.qty){let l=d-r.qty;for(let m of o.sezioni||[]){let u=(m.componenti||[]).find(p=>p.id===r.cid);if(u){r.tipo==="carico"?u.caricato=Math.max(0,(parseInt(u.caricato)||0)+l):u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l);break}}}o.movimenti[s]={...r,qty:d,nota:c},I(e),B===i&&R(),w("Movimento aggiornato \u2713")}function Je(t){let{kits:i}=h(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){w("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,m=fi(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${a(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${a(c.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let r=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&r&&(d.value=r.value||""),d&&!r&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function $i(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function We(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;$i();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=h(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),r=[],d=[];for(let l of n){let m=(o.sottoAssembly||[]).find(p=>p.id===l);if(!m)continue;let u=Number.parseInt(o.pronti?.[l],10)||0;if(u){r.push({saId:l,nome:m.nome,qty:u});for(let p of o.sezioni||[])for(let g of p.componenti||[]){if(D(g))continue;let b=K(g,m.varianteKey);if(!b)continue;let f=u*b;g.caricato=Math.max(0,(parseInt(g.caricato)||0)-f);let x=d.find(M=>M.cid===g.id);x?x.qty+=f:d.push({cid:g.id,mat:g.nome,qty:f})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:r,righe:d,nota:s,ts:jt()}),I(e);let c=r.reduce((l,m)=>l+m.qty,0);w(`Spedizione registrata: ${c} pz \u2713`),B===i&&R()}function Ye(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let r=n.sottoAssembly||[];o.innerHTML=r.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':r.map(d=>{let c=fi(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${a(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${a(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${a(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${a(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),Vt(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function xi(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ze(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&Vt(e.dataset.kitId)}function Vt(t){let{kits:i}=h(),n=i.find(r=>r.id===t);if(!n)return;let e={};for(let r of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+r.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let m of l.componenti||[]){if(D(m))continue;let u=K(m,r.varianteKey);u&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+c*u})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,r])=>r.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([r,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${a(r)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${a(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function Xe(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=h(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;m>0&&o.push({saId:l.id,nome:l.nome,qty:m})}if(!o.length){w("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],r=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let m=l.dataset.cid,u=Number.parseInt(l.dataset.qty,10),p=[...e.sezioni||[]].flatMap(g=>g.componenti||[]).find(g=>g.id===m)?.nome||"?";l.checked?s.push({cid:m,mat:p,qty:u}):r.push({cid:m,mat:p,qty:u})});for(let l of s)for(let m of e.sezioni||[]){let u=(m.componenti||[]).find(p=>p.id===l.cid);if(u){u.caricato=(parseInt(u.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,m)=>l+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:r,nota:d,ts:jt(),totPz:c}),I(n),xi(),w(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),B===i&&R()}function tn(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=h();At({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(bt,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function Ai(t){W=t,Ii="bom";let i=document.getElementById("modal-kit-config");i&&(P(),i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function en(){let t=document.getElementById("modal-kit-config");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300),W=null)}function nn(t){if(!W)return;let i=(t?.value||"").trim();i&&(_(W,n=>{n.nome=i},!1),T("kits"))}function on(t){Ii=t,document.querySelectorAll("#kit-cfg-modal-tabs .acq-tab").forEach(e=>e.classList.toggle("active",e.dataset.tab===t));let i=document.getElementById("kit-cfg-modal-bom-panel"),n=document.getElementById("kit-cfg-modal-el-panel");i&&(i.style.display=t==="bom"?"block":"none"),n&&(n.style.display=t==="elettronica"?"block":"none")}function P(){if(!W)return;let{kits:t}=h(),i=t.find(p=>p.id===W);if(!i)return;let n=V(),e=["pz","mt","cm","mm","kg","g","lt","ml"],o=i.assiConfigurazione||[],s=document.getElementById("kit-cfg-modal-nome");s&&(s.value=i.nome||"");let r=i.sezioni||[],d=[...new Set(n.map(p=>(p.categoria||"").trim()).filter(Boolean))].sort(),c=r.length===0?'<p style="color:#94a3b8;font-size:.85rem;padding:16px 0">Nessuna sezione. Aggiungi una sezione per iniziare.</p>':r.map(p=>{let b=(p.componenti||[]).map(f=>{let M=(n.find(y=>y.nome===f.nome&&(!f.codice||y.codice===f.codice))||n.find(y=>y.nome===f.nome))?.categoria?.trim()||"",ot=n.filter(y=>(y.categoria||"").trim()===M),Y=`<select id="cfg-cat-${a(p.id)}-${a(f.id)}" class="input-field-modern" style="font-size:.82rem;padding:4px 8px;max-width:160px" onchange="_kitCfgModalChangeCat('${a(p.id)}','${a(f.id)}')">
                    <option value="">\u2014 Categoria \u2014</option>
                    ${d.map(y=>`<option value="${a(y)}"${y===M?" selected":""}>${a(y)}</option>`).join("")}
                    <option value="__free__"${M?"":" selected"}>Libero</option>
                </select>`,mt=!M?`<input id="cfg-comp-${a(p.id)}-${a(f.id)}" class="input-field-modern" style="font-size:.82rem;padding:4px 8px;flex:1" placeholder="Nome componente" value="${a(f.nome)}"
                        onchange="_kitCfgModalUpdateComp('${a(i.id)}','${a(p.id)}','${a(f.id)}','nome',this.value)">`:`<select id="cfg-comp-${a(p.id)}-${a(f.id)}" class="input-field-modern" style="font-size:.82rem;padding:4px 8px;flex:1" onchange="_kitCfgModalSelectAnag('${a(i.id)}','${a(p.id)}','${a(f.id)}',this.value)">
                        <option value="">\u2014 Componente \u2014</option>
                        ${ot.map(y=>`<option value="${a(y.nome)}|${a(y.codice||"")}"${y.nome===f.nome?" selected":""}>${a(y.nome)}${y.codice?" \xB7 "+a(y.codice):""}</option>`).join("")}
                      </select>`,N=Ct(f,i),J=D(f),v=J?"flag":vt(f.unitaMisura,"pz"),S=N.tipo==="gruppo"&&o.length?`<select class="input-field-modern" style="font-size:.82rem;padding:4px 8px;margin-top:4px;max-width:200px"
                           onchange="_kitCfgModalUpdateCompRule('${a(i.id)}','${a(p.id)}','${a(f.id)}','asseId',this.value)">
                          ${o.map(y=>`<option value="${a(y.id)}"${N.asseId===y.id?" selected":""}>${a(y.nome)}</option>`).join("")}
                       </select>`:"",k=N.tipo==="gruppo"?(o.find(y=>y.id===N.asseId)||o[0])?.opzioni||[]:[],z=N.tipo==="gruppo"&&k.length?`<div style="display:flex;gap:8px;flex-wrap:wrap;padding:4px 0 2px">${k.map(y=>`<label style="display:flex;align-items:center;gap:4px;font-size:.82rem;cursor:pointer"><input type="checkbox"${N.opzioneIds.includes(y.id)?" checked":""} onchange="_kitCfgToggleCompOption('${a(i.id)}','${a(p.id)}','${a(f.id)}','${a(y.id)}',this.checked)"> ${a(y.nome)}</label>`).join("")}</div>`:"";return`<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;margin-bottom:8px">
                    <!-- Riga 1: categoria + comp + codice + trash -->
                    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                        ${Y}
                        ${mt}
                        <input class="input-field-modern" style="font-size:.82rem;padding:4px 8px;max-width:120px" placeholder="Codice" value="${a(f.codice||"")}"
                            onchange="_kitCfgModalUpdateComp('${a(i.id)}','${a(p.id)}','${a(f.id)}','codice',this.value)">
                        <button type="button" class="btn-trash-modern" style="padding:4px 8px;flex-shrink:0" onclick="_kitCfgModalDelComp('${a(i.id)}','${a(p.id)}','${a(f.id)}')"><i class="fas fa-trash"></i></button>
                    </div>
                    <!-- Riga 2: qty + unit\xE0 + modo -->
                    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                        <input type="number" min="0" step="any" class="input-field-modern" style="font-size:.82rem;padding:4px 8px;max-width:90px;text-align:right"
                            value="${f.qtaBase!=null?f.qtaBase:1}" placeholder="Qty"
                            onchange="_kitCfgModalUpdateComp('${a(i.id)}','${a(p.id)}','${a(f.id)}','qtaBase',this.value)">
                        <select class="input-field-modern" style="font-size:.82rem;padding:4px 8px;max-width:90px"
                            onchange="_kitCfgModalUpdateComp('${a(i.id)}','${a(p.id)}','${a(f.id)}','unitaMisura',this.value)"${J?" disabled":""}>
                            ${e.map(y=>`<option value="${y}"${v===y?" selected":""}>${y}</option>`).join("")}
                        </select>
                        <select class="input-field-modern" style="font-size:.82rem;padding:4px 8px;max-width:220px"
                            onchange="_kitCfgModalUpdateCompRule('${a(i.id)}','${a(p.id)}','${a(f.id)}','tipo',this.value)">
                            <option value="sempre"${N.tipo==="sempre"?" selected":""}>Sempre presente</option>
                            <option value="gruppo"${N.tipo==="gruppo"?" selected":""}>Solo per elettronica</option>
                        </select>
                        ${S}
                    </div>
                    ${z}
                    <input class="input-field-modern" style="font-size:.82rem;padding:4px 8px;margin-top:6px;width:100%;box-sizing:border-box" placeholder="Nota approvvigionamento (opzionale)"
                        value="${a(f.noteConfig||"")}"
                        onchange="_kitCfgModalUpdateComp('${a(i.id)}','${a(p.id)}','${a(f.id)}','noteConfig',this.value)">
                </div>`}).join("");return`<div style="margin-bottom:16px">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                    <input class="input-field-modern" style="font-size:.9rem;font-weight:700;padding:5px 10px;flex:1" value="${a(p.nome)}"
                        onchange="_kitCfgModalUpdateSez('${a(i.id)}','${a(p.id)}','nome',this.value)">
                    <button type="button" class="btn-trash-modern" style="padding:4px 8px" onclick="_kitCfgModalDelSez('${a(i.id)}','${a(p.id)}')"><i class="fas fa-trash"></i></button>
                </div>
                ${b}
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <button type="button" class="btn-archive-action" style="font-size:.8rem" onclick="_kitQAddCompOpen('${a(i.id)}','${a(p.id)}')"><i class="fas fa-plus"></i> Da catalogo</button>
                    <button type="button" class="btn-archive-action" style="font-size:.8rem" onclick="_kitCfgModalAddCompFree('${a(i.id)}','${a(p.id)}')"><i class="fas fa-pen"></i> Manuale</button>
                </div>
            </div>`}).join(""),l=document.getElementById("kit-cfg-modal-bom-panel");l&&(l.innerHTML=`
          ${c}
          <div style="padding-top:8px;border-top:1px solid #f1f5f9">
            <button type="button" class="btn-archive-action" style="font-size:.8rem" onclick="_kitQAddSezOpen('${a(i.id)}')">
              <i class="fas fa-folder-plus"></i> Aggiungi sezione
            </button>
          </div>`);let m=o.length===0?'<p style="color:#94a3b8;font-size:.85rem;padding:16px 0">Nessun gruppo elettronico. Aggiungine uno per definire le varianti selezionabili.</p>':o.map(p=>{let g=(p.opzioni||[]).map(b=>`
                <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">
                    <input class="input-field-modern" style="font-size:.82rem;padding:3px 8px;flex:1" placeholder="Nome opzione" value="${a(b.nome)}"
                        onchange="_kitCfgModalUpdateOpz('${a(i.id)}','${a(p.id)}','${a(b.id)}','nome',this.value)">
                    <input class="input-field-modern" style="font-size:.82rem;padding:3px 8px;max-width:110px" placeholder="Codice" value="${a(b.codice||"")}"
                        onchange="_kitCfgModalUpdateOpz('${a(i.id)}','${a(p.id)}','${a(b.id)}','codice',this.value)">
                    <button type="button" class="btn-trash-modern" style="padding:3px 7px;font-size:.75rem" onclick="_kitCfgModalDelOpz('${a(i.id)}','${a(p.id)}','${a(b.id)}')"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;margin-bottom:12px">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                    <input class="input-field-modern" style="font-size:.9rem;font-weight:700;padding:5px 10px;flex:1" placeholder="Nome gruppo es. LED, Lente\u2026" value="${a(p.nome)}"
                        onchange="_kitCfgModalUpdateAsse('${a(i.id)}','${a(p.id)}','nome',this.value)">
                    <button type="button" class="btn-trash-modern" style="padding:4px 8px" onclick="_kitCfgModalDelAsse('${a(i.id)}','${a(p.id)}')"><i class="fas fa-trash"></i></button>
                </div>
                <div style="margin-bottom:6px">${g||'<p style="color:#94a3b8;font-size:.82rem;margin:0 0 4px">Nessuna opzione.</p>'}</div>
                <button type="button" class="btn-archive-action" style="font-size:.78rem" onclick="_kitCfgModalAddOpz('${a(i.id)}','${a(p.id)}')"><i class="fas fa-plus"></i> Aggiungi opzione</button>
            </div>`}).join(""),u=document.getElementById("kit-cfg-modal-el-panel");u&&(u.innerHTML=`
          ${m}
          <button type="button" class="btn-archive-action" style="font-size:.8rem" onclick="_kitCfgModalAddAsse('${a(i.id)}')">
            <i class="fas fa-plus"></i> Aggiungi gruppo elettronico
          </button>`)}function an(t,i,n,e){_(t,o=>{let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s[n]=e.trim()||s[n])},!0)}function sn(t,i){confirm("Eliminare questa sezione e tutti i componenti?")&&_(t,n=>{n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)},!0)}function rn(t,i){let n=document.getElementById(`cfg-cat-${t}-${i}`),e=document.getElementById(`cfg-comp-${t}-${i}`);if(!n||!e)return;let o=n.value,s=V(),r=o&&o!=="__free__"?s.filter(c=>(c.categoria||"").trim()===o):[];if(!r.length||o==="__free__"){let c=document.createElement("input");c.id=`cfg-comp-${t}-${i}`,c.className=e.className,c.style.cssText=e.style.cssText,c.placeholder="Nome componente",e.replaceWith(c);return}let d=document.createElement("select");d.id=`cfg-comp-${t}-${i}`,d.className=e.className,d.style.cssText=e.style.cssText,d.innerHTML='<option value="">\u2014 Componente \u2014</option>'+r.map(c=>`<option value="${a(c.nome)}|${a(c.codice||"")}">${a(c.nome)}${c.codice?" \xB7 "+a(c.codice):""}</option>`).join(""),e.replaceWith(d)}function cn(t,i,n,e){if(!e)return;let[o,s]=e.split("|");_(t,r=>{let d=(r.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);c&&(c.nome=o||c.nome,c.codice=s||"")},!0)}function dn(t,i){_(t,n=>{let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:$(),nome:"Nuovo componente",codice:"",qtaBase:1,unitaMisura:"pz",regola:{tipo:"sempre",qtyBase:1}}))},!0)}function ln(t,i,n,e,o){_(t,s=>{let r=(s.sezioni||[]).find(c=>c.id===i),d=r&&(r.componenti||[]).find(c=>c.id===n);d&&(e==="qtaBase"?(d.qtaBase=parseFloat(o)||1,d.regola&&(d.regola.qtyBase=d.qtaBase)):d[e]=o)},!0)}function pn(t,i,n,e,o){_(t,s=>{let r=(s.sezioni||[]).find(c=>c.id===i),d=r&&(r.componenti||[]).find(c=>c.id===n);d&&(d.regola=d.regola||{},e==="tipo"?(d.regola.tipo=o,o==="gruppo"&&!d.regola.asseId&&s.assiConfigurazione?.length&&(d.regola.asseId=s.assiConfigurazione[0].id),o==="gruppo"&&(d.regola.opzioneIds=d.regola.opzioneIds||[])):e==="asseId"?(d.regola.asseId=o,d.regola.opzioneIds=[]):d.regola[e]=o)},!0)}function mn(t,i,n){_(t,e=>{let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))},!0)}function un(t){_(t,i=>{i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:$(),nome:"Nuovo gruppo",key:Q("","ax"+i.assiConfigurazione.length),opzioni:[]})},!0)}function fn(t,i){confirm("Eliminare questo gruppo elettronico?")&&_(t,n=>{n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)},!0)}function gn(t,i,n,e){_(t,o=>{let s=(o.assiConfigurazione||[]).find(r=>r.id===i);s&&(s[n]=e)},!1)}function kn(t,i){_(t,n=>{let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;e.opzioni=e.opzioni||[];let o=e.opzioni.length+1;e.opzioni.push({id:$(),key:Q("","opz"+o),nome:"Nuova opzione",codice:""})},!0)}function vn(t,i,n){_(t,e=>{let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))},!0)}function yn(t,i,n,e,o){_(t,s=>{let r=(s.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(d[e]=o)},!1)}function Mi(){let t=document.getElementById("modal-kit-crea");if(!t)return;let i=document.getElementById("kit-crea-nome");i&&(i.value=""),t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>i&&i.focus(),80)}function Ei(){let t=document.getElementById("modal-kit-crea");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function bn(){let t=(document.getElementById("kit-crea-nome")?.value||"").trim();if(!t){w("Inserisci un nome per il kit","warning");return}let{kits:i}=h(),n={id:$(),nome:t,schemaVersion:Tt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};i.push(n),I(i),Ei(),setTimeout(()=>T("kits"),320)}function hn(t){rt.kitId=t;let i=document.getElementById("modal-kit-qadd-sez");if(!i)return;let n=document.getElementById("kit-qadd-sez-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function qi(){let t=document.getElementById("modal-kit-qadd-sez");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function zn(){let t=(document.getElementById("kit-qadd-sez-nome")?.value||"").trim()||"Nuova sezione",{kits:i}=h(),n=i.find(e=>e.id===rt.kitId);n&&(n.sezioni=n.sezioni||[],n.sezioni.push({id:$(),nome:t,componenti:[]}),I(i),qi(),setTimeout(W?()=>P():()=>T("kits"),320))}function wn(t,i){rt.kitId=t,rt.sezId=i;let n=document.getElementById("modal-kit-qadd-comp");if(!n)return;let e=V(),o=document.getElementById("kit-qadd-comp-source-cat"),s=document.getElementById("kit-qadd-comp-source-free");e.length?(o&&(o.checked=!0),qt("cat")):(s&&(s.checked=!0),qt("free"));let r=[...new Set(e.map(p=>p.categoria||"Senza categoria"))].sort(),d=document.getElementById("kit-qadd-comp-cat");d&&(d.innerHTML=r.map(p=>`<option value="${a(p)}">${a(p)}</option>`).join(""),Oi());let c=document.getElementById("kit-qadd-comp-qty");c&&(c.value="1");let l=document.getElementById("kit-qadd-comp-unit");l&&(l.value="pz");let m=document.getElementById("kit-qadd-comp-nome");m&&(m.value="");let u=document.getElementById("kit-qadd-comp-codice");u&&(u.value=""),n.style.display="flex",n.offsetHeight,n.classList.add("active")}function qt(t){let i=document.getElementById("kit-qadd-comp-cat-section"),n=document.getElementById("kit-qadd-comp-free-section");i&&(i.style.display=t==="cat"?"":"none"),n&&(n.style.display=t==="free"?"":"none")}function Oi(){let t=document.getElementById("kit-qadd-comp-cat"),i=document.getElementById("kit-qadd-comp-comp");if(!t||!i)return;let n=t.value,o=V().filter(s=>(s.categoria||"Senza categoria")===n);i.innerHTML=o.length?o.map(s=>`<option value="${a(s.id)}">${a(s.nome)}${s.codice?" \xB7 "+a(s.codice):""}</option>`).join(""):'<option value="">Nessun componente in questa categoria</option>'}function Bi(){let t=document.getElementById("modal-kit-qadd-comp");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Cn(){let t=document.getElementById("kit-qadd-comp-source-cat")?.checked,i="",n="";if(t){let l=document.getElementById("kit-qadd-comp-comp")?.value;if(!l){w("Seleziona un componente dal catalogo","warning");return}let m=V().find(u=>u.id===l);if(!m){w("Componente non trovato nel catalogo","warning");return}i=m.nome,n=m.codice||""}else{if(i=(document.getElementById("kit-qadd-comp-nome")?.value||"").trim(),!i){w("Inserisci il nome del componente","warning");return}n=(document.getElementById("kit-qadd-comp-codice")?.value||"").trim()}let e=parseFloat(document.getElementById("kit-qadd-comp-qty")?.value)||1,o=document.getElementById("kit-qadd-comp-unit")?.value||"pz",{kits:s}=h(),r=s.find(c=>c.id===rt.kitId);if(!r)return;let d=(r.sezioni||[]).find(c=>c.id===rt.sezId);d&&(d.componenti=d.componenti||[],d.componenti.push({id:$(),nome:i,codice:n,qtaBase:e,qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:o,applicazioneTipo:"sempre"}),I(s),Bi(),setTimeout(W?()=>P():()=>T("kits"),320))}function _n(t,i,n,e,o){let{kits:s}=h(),r=s.find(l=>l.id===t);if(!r)return;let d=(r.sezioni||[]).find(l=>l.id===i);if(!d)return;let c=(d.componenti||[]).find(l=>l.id===n);c&&(e==="qtaBase"?c.qtaBase=parseFloat(o)||0:c[e]=o,I(s))}function $n(t,i,n){if(!n.trim())return;let{kits:e}=h(),o=e.find(r=>r.id===t);if(!o)return;let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s.nome=n.trim(),I(e))}function xn(t,i,n){let{kits:e}=h(),o=e.find(r=>r.id===t);if(!o)return;let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s.componenti=(s.componenti||[]).filter(r=>r.id!==n),I(e),T("kits"))}function Sn(t,i){if(!confirm("Rimuovere questa sezione e tutti i suoi componenti?"))return;let{kits:n}=h(),e=n.find(o=>o.id===t);e&&(e.sezioni=(e.sezioni||[]).filter(o=>o.id!==i),I(n),T("kits"))}function In(t){if(!confirm("Eliminare questo kit? L'operazione non \xE8 reversibile."))return;let{kits:i}=h(),n=i.filter(e=>e.id!==t);I(n),T("kits")}function An(){Mi()}function Ti(t){W=t,Ai(t)}function St(t,i,n=""){let{kits:e}=h(),o=e.find(c=>c.id===t),s=e.find(c=>c.id!==t&&(c.sezioni||[]).length),r=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?r:s?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function Ni(t){C=St(t,"import"),F(!0)}function Mn(t){C=St(t,"import-asse"),F(!0)}function En(t,i){C=St(t,"copy",i),F(!0)}function st(){let t=document.getElementById("modal-kit-import");C=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function qn(t){if(!C||t!=="import"&&t!=="copy"||C.mode===t)return;let i=C.currentKitId,n=t==="copy"?C.sectionId:"";C=St(i,t,n),F()}function On(t){C&&(C.search=String(t||""),F())}function Bn(t){if(!C)return;let{kits:i}=h(),n=i.find(e=>e.id===t);C.sourceKitId=t,C.mode==="import-asse"?C.asseId=n?.assiConfigurazione?.[0]?.id||"":C.sectionId=n?.sezioni?.[0]?.id||"",F()}function Tn(t){C&&(C.mode==="import-asse"?C.asseId=t:C.sectionId=t,F())}function Nn(t,i){if(!C||C.mode!=="copy")return;let n=new Set(C.targetKitIds||[]);i?n.add(t):n.delete(t),C.targetKitIds=[...n],F()}function Dn(){if(!C||C.mode!=="copy")return;let{kits:t}=h(),i=t.filter(e=>e.id!==C.currentKitId&&zt(e.nome,C.search)),n=new Set(C.targetKitIds||[]);for(let e of i)n.add(e.id);C.targetKitIds=[...n],F()}function Ln(){!C||C.mode!=="copy"||(C.targetKitIds=[],F())}function F(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!C)return;let{kits:n}=h(),e=C,o=n.find(k=>k.id===e.currentKitId);if(!o){st();return}let s=[];e.mode==="import"?s=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length):e.mode==="import-asse"?s=n.filter(k=>k.id!==o.id&&(k.assiConfigurazione||[]).length):s=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!s.some(k=>k.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(k=>k!==o.id&&n.some(z=>z.id===k)));let r=n.find(k=>k.id===e.sourceKitId)||null,d=e.mode==="import-asse"?r?.assiConfigurazione||[]:r?.sezioni||[];e.mode==="import-asse"?d.some(k=>k.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(k=>k.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(r?.assiConfigurazione||[]).find(k=>k.id===e.asseId)||null:Dt(r,e.sectionId),l=s.filter(k=>zt(k.nome,e.search)),m=n.filter(k=>k.id!==o.id&&zt(k.nome,e.search)),u=document.getElementById("kit-import-subtitle"),p=document.getElementById("kit-import-search"),g=document.getElementById("kit-import-left-title"),b=document.getElementById("kit-import-right-title"),f=document.getElementById("kit-import-kit-list"),x=document.getElementById("kit-import-section-list"),M=document.getElementById("kit-import-target-wrap"),ot=document.getElementById("kit-import-target-list"),Y=document.getElementById("kit-import-preview"),G=document.getElementById("kit-import-confirm-btn"),mt=document.getElementById("kit-import-mode-import"),N=document.getElementById("kit-import-mode-copy");if(!u||!p||!g||!b||!f||!x||!M||!ot||!Y||!G||!mt||!N)return;mt.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),N.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),p.value=e.search,e.mode==="import"?(u.textContent=`Importa una sezione esistente dentro "${o.nome}".`,p.placeholder="Cerca kit sorgente\u2026",g.textContent="Kit sorgente",b.textContent=r?`Sezioni di ${r.nome}`:"Sezione",M.style.display="none",f.innerHTML=l.length?l.map(k=>{let z=k.id===e.sourceKitId;return`<label class="kit-import-option ${z?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${z?"checked":""}
                           onchange="_kitCfgSelectImportSource('${a(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(u.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,p.placeholder="Cerca kit destinazione\u2026",g.textContent="Kit sorgente",b.textContent="Sezione da copiare",M.style.display="flex",f.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${a(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,ot.innerHTML=m.length?m.map(k=>{let z=(e.targetKitIds||[]).includes(k.id),y=c?kt(o,k):null,O=`${(k.sezioni||[]).length} sezioni`;return y&&(y.hasTargetVarianti?y.needsReview?O=`${y.exactMatches}/${y.targetCount} combinazioni allineate`:O=`${y.targetCount}/${y.targetCount} combinazioni allineate`:O="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${z?"kit-import-option--active":""}">
                    <input type="checkbox" ${z?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${a(k.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(k.nome)}</span>
                        <span class="kit-import-option-meta">${a(O)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),x.innerHTML=d.length?d.map(k=>{let z=e.mode==="import-asse"?k.id===e.asseId:k.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${z?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${z?"checked":""}
                           onchange="_kitCfgSelectImportSection('${a(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${a(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${z?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${z?"checked":""}
                       onchange="_kitCfgSelectImportSection('${a(k.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(k.nome)}</span>
                    <span class="kit-import-option-meta">${(k.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let J=!1,v="kit-cfg-help kit-import-preview",S="";if(e.mode==="import"){if(!r)S="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)S="Seleziona una sezione da importare nel kit corrente.";else{let k=kt(r,o);J=!0,S=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 importata in <strong>${a(o.nome)}</strong>. `,k.hasTargetVarianti?k.needsReview?(v="kit-cfg-warn kit-import-preview",S+=`${k.exactMatches} combinazioni su ${k.targetCount} risultano allineate: controlla i coefficienti importati.`):S+=`Tutte le ${k.targetCount} combinazioni del kit destinazione risultano allineate.`:(v="kit-cfg-warn kit-import-preview",S+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}G.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")r?c?(J=!0,S=`L'asse <strong>${a(c.nome)}</strong> verr\xE0 importato in <strong>${a(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):S="Seleziona un asse da importare nel kit corrente.":S="Seleziona un kit sorgente per vedere gli assi disponibili.",G.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let k=n.filter(z=>(e.targetKitIds||[]).includes(z.id));if(!c)S="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!k.length)S="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{J=!0;let z=k.filter(y=>kt(o,y).needsReview).length;S=`La sezione <strong>${a(c.nome)}</strong> verr\xE0 copiata in <strong>${k.length}</strong> kit.`,z>0?(v="kit-cfg-warn kit-import-preview",S+=` <strong>${z}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):S+=" Le combinazioni risultano allineate su tutti i kit selezionati."}G.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}Y.className=v,Y.innerHTML=S,G.disabled=!J,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let k=document.getElementById("kit-import-search");k&&k.focus()},40))}function Kn(){if(!C)return;let{kits:t}=h(),i=C,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Dt(e,i.sectionId),s=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!s){w("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(u=>String(u.nome||"").trim().toLowerCase()===String(s.nome||"").trim().toLowerCase()),m=0;if(l){l.opzioni=l.opzioni||[];for(let u of s.opzioni||[]){let p=String(u.codice||"").trim().toLowerCase(),g=!1;if(p&&(g=l.opzioni.some(b=>String(b.codice||"").trim().toLowerCase()===p&&p!=="")),g||(g=l.opzioni.some(b=>String(b.nome||"").trim().toLowerCase()===String(u.nome||"").trim().toLowerCase())),!g){let b=(l.opzioni||[]).length+1;l.opzioni.push({id:$(),key:Q(u?.key,"opz"+b),nome:String(u?.nome||"").trim()||"opz"+b,codice:String(u?.codice||"").trim()}),m+=1}}I(t),st(),P(),m?w(`${m} opzione${m>1?"i":""} aggiunta${m>1?"e":""} all'asse "${s.nome}" \u2713`):w(`Nessuna nuova opzione trovata per l'asse "${s.nome}"`);return}n.assiConfigurazione.push(ai(s,e,n)),I(t),st(),P(),w(`Asse "${s.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=kt(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(ht(o,e,n)),I(t),st(),P();let m="";l.hasTargetVarianti?l.needsReview&&(m=" Controlla le quantit\xE0 sulle combinazioni non allineate."):m=" Definisci poi gli assi del kit per rifinire i coefficienti.",w(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${m}`);return}let r=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!r.length){w("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let d=0;for(let l of r)kt(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(ht(o,e,l));I(t),st(),P();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xE0.`),w(`Sezione "${o.nome}" copiata in ${r.length} kit \u2713${c}`)}function Pn(t){let{kits:i}=h(),n=i.find(e=>e.id===t)||null;A={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},pt(!0)}function Di(){let t=document.getElementById("modal-kit-presets");A=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Rn(t){A&&(A.search=String(t||""),pt())}function Hn(t){A&&(A.selectedPresetId=t,pt())}function jn(){if(!A)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){w("Inserisci il nome del preset \u26A0\uFE0F");return}let e=i?.value||"";Li(A.currentKitId,e,n)}function Li(t,i,n){let{kits:e}=h(),o=e.find(d=>d.id===t);if(!o){w("Kit non trovato \u26A0\uFE0F");return}let s=Dt(o,i);if(!s){w("Seleziona una sezione valida \u26A0\uFE0F");return}let r=ct();r.push({id:$(),nome:String(n||"").trim(),sourceKitId:o.id,sezione:JSON.parse(JSON.stringify(s))}),Pt(r),w("Preset salvato \u2713"),A&&A.currentKitId===t&&pt(),P()}function Qn(t){if(!A)return;let i=ct(),n=t||A.selectedPresetId,e=i.find(d=>d.id===n);if(!e){w("Seleziona un preset \u26A0\uFE0F");return}let{kits:o}=h(),s=o.find(d=>d.id===A.currentKitId),r=o.find(d=>d.id===e.sourceKitId)||null;if(!s){w("Kit non trovato \u26A0\uFE0F");return}s.sezioni=s.sezioni||[],s.sezioni.push(ht(e.sezione,r,s)),I(o),Di(),P(),w(`Preset "${e.nome}" applicato \u2713`)}function Un(t,i){let n=ct(),e=n.find(o=>o.id===t);if(!e){w("Preset non trovato \u26A0\uFE0F");return}e.nome=String(i||"").trim()||e.nome,Pt(n),w("Nome aggiornato \u2713"),pt()}function Vn(t){let i=ct().filter(n=>n.id!==t);Pt(i),A&&(A.selectedPresetId=""),pt(),w("Preset eliminato \u2713")}function pt(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!A)return;let n=ct(),e=A,o=h().kits.find(p=>p.id===e.currentKitId),s=n.filter(p=>zt(p.nome,e.search)),r=document.getElementById("preset-list"),d=document.getElementById("preset-preview"),c=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),m=document.getElementById("preset-apply-btn");if(!r||!d||!c||!l||!m)return;r.innerHTML=s.length?s.map(p=>{let g=p.id===e.selectedPresetId;return`<label class="kit-import-option ${g?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${g?"checked":""} onchange="_kitSelectPreset('${a(p.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${a(p.nome)}</span>
                    <span class="kit-import-option-meta">${(p.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let u=n.find(p=>p.id===e.selectedPresetId)||null;if(u){let p=u.sourceKitId&&h().kits.find(g=>g.id===u.sourceKitId)?.nome||"";d.innerHTML=`<div style="padding:6px"><strong>${a(u.nome)}</strong><div style="color:#94a3b8">${a(p)}</div></div>`+(u.sezione?.componenti?.length?`<div>${u.sezione.componenti.map(g=>`<div class="kit-meta-pill">${a(g.nome)}${g.codice?" \xB7 "+a(g.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else d.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;m.disabled=!u,c.value="",l.innerHTML=(o?.sezioni||[]).map(p=>`<option value="${a(p.id)}">${a(p.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let p=document.getElementById("preset-search");p&&p.focus()},40))}function Fn(){let{kits:t}=h(),i=t.find(v=>v.id===Si);if(!i){lt();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=q(i);tt==="sezioni"&&(tt="bom"),tt==="sa"&&(tt="bom");let s=["info","varianti","anagrafiche","bom"],r={info:"Prodotto",varianti:"Elettronica selezionabile",anagrafiche:"Anagrafiche",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,S)=>v+(S.componenti||[]).length,0),m=c?`
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
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>',u=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${a(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${a(i.id)}',this.value)">
        </div>
        ${m}
        <div class="kit-cfg-danger">
            <button type="button" class="kit-cfg-add-btn" onclick="_kitDuplicaKit('${a(i.id)}')"><i class="fas fa-clone"></i> Duplica kit</button>
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${a(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,p=e.map((v,S)=>{let k=(v.opzioni||[]).map((z,y)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${a(z.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(z.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${a(z.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${a(i.id)}','${a(v.id)}','${a(z.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${a(i.id)}','${a(v.id)}','${a(z.id)}')"><i class="fas fa-times"></i></button>
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
        </div>`:"",b=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci solo l'<strong>elettronica selezionabile</strong> del prodotto.<br>
                Esempio: un gruppo <strong>LED</strong>, uno <strong>Lente</strong>, uno <strong>Alimentazione</strong>.<br>
                Tu inserisci i nomi, il sistema user\xE0 queste scelte per costruire l'ordine e la distinta base.
            </div>
            ${p||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${a(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportAsseModal('${a(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenPresetsModal('${a(i.id)}')"><i class="fas fa-bookmark"></i> Sezioni fisse</button>
            ${g}
        </div>`,f=(i.sezioni||[]).map((v,S)=>{let k=(v.componenti||[]).map(z=>{let y=D(z),O=Ct(z,i),Ft=(e||[]).find(E=>E.id===O.asseId)||null,Pi=O.tipo==="gruppo"&&Ft?`<div class="kit-cfg-row">${(Ft.opzioni||[]).map(E=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${O.opzioneIds.includes(E.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${a(i.id)}','${a(v.id)}','${a(z.id)}','${a(E.id)}',this.checked)">
                        ${a(E.nome)}
                    </label>`).join("")}</div>`:"",Ri=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(z.id)}','asseId',this.value)">
                        ${e.map(E=>`<option value="${a(E.id)}" ${O.asseId===E.id?"selected":""}>${a(E.nome)}</option>`).join("")}
                   </select>`:"",Hi=O.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",Gt=y?"flag":vt(z.unitaMisura,"pz"),ji=y?[{value:"flag",label:"Solo avviso"}]:[...new Set([Gt,...Ji])].filter(Boolean).map(E=>({value:E,label:E}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${a(z.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${a(z.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','modo','',this.value)">
                        <option value="quantificato" ${y?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${y?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${a(i.id)}','${a(v.id)}','${a(z.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${O.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(z.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','unitaMisura','',this.value)"
                            ${y?"disabled":""}>
                        ${ji.map(E=>`<option value="${a(E.value)}" ${Gt===E.value?"selected":""}>${a(E.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${a(i.id)}','${a(v.id)}','${a(z.id)}','tipo',this.value)">
                        <option value="sempre" ${O.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${O.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${O.tipo==="gruppo"?Ri:""}
                </div>
                ${O.tipo==="gruppo"?Pi:""}
                <input class="kit-cfg-input" value="${a(z.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${a(i.id)}','${a(v.id)}','${a(z.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${y?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Hi}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${S}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${a(v.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${a(i.id)}','${a(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${a(i.id)}','${a(v.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${a(i.id)}','${a(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${k}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${a(i.id)}','${a(v.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),x=`
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
        </div>`,M="";o.length?M=o.map(v=>{let S=(i.sottoAssembly||[]).map((z,y)=>({sa:z,i:y})).filter(({sa:z})=>z.varianteKey===v.key),k=S.map(({sa:z,i:y})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${a(z.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${a(i.id)}',${y},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${a(i.id)}',${y})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${a(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${S.length} part${S.length!==1?"i":"e"}</span>
                </div>
                ${k||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${a(i.id)}','${a(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${a(v.nome)}</button>
            </div>`}).join(""):M='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let ot=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${M}
        </div>`,Y={info:u,varianti:b,bom:x,sa:ot},G=ct(),N=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${G.length?G.map(v=>`<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${a(v.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${a(v.sourceKitId&&h().kits.find(S=>S.id===v.sourceKitId)?.nome||"")}</div>
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
        </div>`;Y.anagrafiche=N;let J=s.map(v=>`<button class="kit-tab ${tt===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${r[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${a(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${a(i.nome)}</span>
        </div>
        <div class="kit-tabs">${J}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${Y[tt]}</div>
    </div>`,ut(n)}function Gn(t){if(t&&B===t){R();return}B=t,R()}function Jn(t){tt=t,Fn()}function _(t,i,n=!0){let{kits:e}=h(),o=e.find(s=>s.id===t);o&&(i(o),I(e),n&&P())}function Wn(t,i){_(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Yn(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=h();I(i.filter(n=>n.id!==t)),Si=null,B=null,lt()}function Zn(t){let{kits:i}=h(),n=i.find(o=>o.id===t);if(!n)return;let e={id:$(),nome:`Copia di ${n.nome}`,schemaVersion:Tt,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(ai(o,n,e));e.varianti=ni(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(ht(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:$(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),I(i),Ti(e.id),w(`Kit "${n.nome}" duplicato \u2713`)}function Ki(t){_(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:$(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:$(),key:"opz1",nome:"Opzione 1"}]})})}function Xn(t,i,n,e){_(t,function(o){let s=(o.assiConfigurazione||[]).find(r=>r.id===i);s&&(n==="key"?s.key=Q(e,s.key||"asse"):s[n]=e.trim())})}function to(t,i){_(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function io(t,i){_(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:$(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function eo(t,i,n,e,o){_(t,function(s){let r=(s.assiConfigurazione||[]).find(c=>c.id===i),d=r&&(r.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=Q(o,d.key||"opzione"):d[e]=o.trim())})}function no(t,i,n){_(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function oo(t){Ki(t)}function ao(t){_(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:$(),nome:"Nuova sezione",componenti:[]})})}function so(t){Ni(t)}function ro(t,i,n,e){_(t,function(o){let s=(o.sezioni||[]).find(r=>r.id===i);s&&(s[n]=e.trim())},!1)}function co(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&_(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function lo(t,i){_(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:$(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function po(t,i,n,e,o,s){_(t,function(r){let d=(r.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=it(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":vt(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function mo(t,i,n,e,o){_(t,function(s){let r=(s.sezioni||[]).find(l=>l.id===i),d=r&&(r.componenti||[]).find(l=>l.id===n);if(!d)return;let c=Ct(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=it(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Nt(d,s,c)})}function uo(t,i,n,e,o){_(t,function(s){let r=(s.sezioni||[]).find(m=>m.id===i),d=r&&(r.componenti||[]).find(m=>m.id===n);if(!d)return;let c=Ct(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Nt(d,s,c)})}function fo(t,i,n,e){_(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),r=s&&(s.componenti||[]).find(d=>d.id===n);!r||D(r)||(r.tracciabile=!!e)},!1)}function go(t,i,n){_(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function ko(t){_(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:$(),nome:"",varianteKey:q(i)[0]?.key||""})})}function vo(t,i){_(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:$(),nome:"",varianteKey:i,noteConfig:""})})}function yo(t,i,n,e){_(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function bo(t,i){_(t,function(n){n.sottoAssembly.splice(i,1)})}function ho(t){let i=document.getElementById("modal-kit-distinta-edit");if(!i){yi(t);return}let{kits:n}=h(),e=n.find(c=>c.id===t);if(!e)return;let o=Z(e),s=U(o),r=document.getElementById("distinta-edit-nome"),d=document.getElementById("distinta-edit-documento");r&&(r.value=s.documento||""),d&&(d.value=s.documento||""),i.dataset.kitId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>r&&r.focus(),80)}function Ot(){let t=document.getElementById("modal-kit-distinta-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function zo(){let t=document.getElementById("modal-kit-distinta-edit");if(!t)return;let i=t.dataset.kitId,n=(document.getElementById("distinta-edit-nome")?.value||"").trim(),e=(document.getElementById("distinta-edit-documento")?.value||"").trim();if(!n){w("Inserisci un nome per la distinta.","warning");return}H(i,function(m){let u=U(m);e?u.documento=e:u.documento||(u.documento=n),$t(m,u)});let{kits:o}=h(),s=o.find(m=>m.id===i);if(!s){Ot(),w("Kit non trovato \u26A0\uFE0F");return}let r=Z(s),d=xt(s,r);if(!d.totalePezzi||!d.totaleRighe){w("Componi prima un ordine per generare la distinta stampabile.","warning");return}let c=nt(),l={id:$(),kitId:s.id,kitNome:s.nome,nome:n||r._meta?.documento||`Distinta-${Date.now()}`,documento:e||r._meta?.documento||"",createdAt:Date.now(),createdBy:j?.nome||"Sistema",orderDraftSnapshot:r,distintaSnapshot:d};c.unshift(l),_t(c),Ot(),w("Distinta salvata \u2713"),L==="distinte"&&T("distinte")}function Ao(){window._kitOpenView=Se,window._kitOpenConfig=Ti,window._kitNuovoKit=An,window._kitBack=Ie,window._kitOpenPrintPreview=ge,window._kitSwitchTab=Ae,window._kitAggiornaQty=Me,window._kitOrdineSet=Ee,window._kitOrdineDelta=qe,window._kitOrdineReset=Oe,window._kitOrdineResetVoce=Be,window._kitOrderSearch=Te,window._kitOrderHideSearch=Ne,window._kitOrderPick=De,window._kitOrderRemoveRef=Le,window._kitComposeSelect=Ke,window._kitComposeAdd=Pe,window._kitAggiornaCar=zi,window._kitAggiornaPronti=Re,window._kitSetPronti=He,window._kitApriModalSped=Je,window._kitChiudiModalSped=$i,window._kitConfermaSpedizione=We,window._kitApriModalReso=Ye,window._kitChiudiModalReso=xi,window._kitResoQtyChange=Ze,window._kitResoAggiornaBOM=Vt,window._kitConfermaReso=Xe,window._kitSalvaMovimento=Qe,window._kitEliminaMovimento=Ue,window._kitModificaMovimento=Fe,window._kitChiudiModalEditMov=_i,window._kitConfermaModificaMov=Ge,window._kitChiudiModalDelMov=wi,window._kitConfermaEliminaMov=Ci,window._kitSalvaManuale=tn,window._kitElimina=Yn,window._kitDuplicaKit=Zn,window._kitCfgBack=Gn,window._kitCfgSwitchTab=Jn,window._kitCfgSaveNome=Wn,window._kitCfgAddVar=oo,window._kitCfgOpenImportModal=Ni,window._kitCfgOpenImportAsseModal=Mn,window._kitCfgOpenCopySezModal=En,window._kitCfgCloseImportModal=st,window._kitCfgSetImportMode=qn,window._kitCfgSetImportSearch=On,window._kitCfgSelectImportSource=Bn,window._kitCfgSelectImportSection=Tn,window._kitCfgToggleImportTarget=Nn,window._kitCfgSelectAllImportTargets=Dn,window._kitCfgClearImportTargets=Ln,window._kitCfgConfirmImport=Kn,window._kitOpenPresetsModal=Pn,window._kitClosePresetsModal=Di,window._kitSetPresetsSearch=Rn,window._kitSelectPreset=Hn,window._kitCreatePresetFromSection=jn,window._kitCreatePreset=Li,window._kitApplyPreset=Qn,window._kitRenamePreset=Un,window._kitDeletePreset=Vn,window._kitCfgAddAsse=Ki,window._kitCfgUpdateAsse=Xn,window._kitCfgDelAsse=to,window._kitCfgAddOpzione=io,window._kitCfgUpdateOpzione=eo,window._kitCfgDelOpzione=no,window._kitCfgAddSez=ao,window._kitCfgImportSez=so,window._kitCfgUpdateSez=ro,window._kitCfgDelSez=co,window._kitCfgAddComp=lo,window._kitCfgUpdateComp=po,window._kitCfgUpdateCompRule=mo,window._kitCfgToggleCompOption=uo,window._kitCfgToggleCompTracked=fo,window._kitCfgDelComp=go,window._kitCfgAddSA=ko,window._kitCfgAddSAForVariant=vo,window._kitCfgUpdateSA=yo,window._kitCfgDelSA=bo,window._kitSwitchMainTab=T,window._kitRenderKitsGrid=gi,window._kitRenderAnagrafichePage=ki,window._kitRenderDistintePage=vi,window._kitLoadDistinte=nt,window._kitSaveDistinte=_t,window._kitCreateDistintaFromDraft=yi,window._kitLoadAnagrafiche=V,window._kitSaveAnagrafiche=Ut,window._kitOpenAnagraficaModal=ze,window._kitCloseAnagraficaModal=bi,window._kitConfirmSaveAnagrafica=we,window._kitDeleteAnagrafica=Ce,window._kitOpenCreaKit=Mi,window._kitCloseCreaKit=Ei,window._kitConfirmCreaKit=bn,window._kitOpenConfigModal=Ai,window._kitCloseConfigModal=en,window._kitRenderConfigModal=P,window._kitCfgModalSwitchTab=on,window._kitCfgModalSaveNome=nn,window._kitCfgModalUpdateSez=an,window._kitCfgModalDelSez=sn,window._kitCfgModalChangeCat=rn,window._kitCfgModalSelectAnag=cn,window._kitCfgModalAddCompFree=dn,window._kitCfgModalUpdateComp=ln,window._kitCfgModalUpdateCompRule=pn,window._kitCfgModalDelComp=mn,window._kitCfgModalAddAsse=un,window._kitCfgModalDelAsse=fn,window._kitCfgModalUpdateAsse=gn,window._kitCfgModalAddOpz=kn,window._kitCfgModalDelOpz=vn,window._kitCfgModalUpdateOpz=yn,window._kitQAddSezOpen=hn,window._kitQAddSezClose=qi,window._kitQAddSezConfirm=zn,window._kitQAddCompOpen=wn,window._kitQAddCompToggleSource=qt,window._kitQAddCompChangeCategoria=Oi,window._kitQAddCompClose=Bi,window._kitQAddCompConfirm=Cn,window._kitQUpdateComp=_n,window._kitQRenomeSez=$n,window._kitQDelComp=xn,window._kitQDelSez=Sn,window._kitQDelKit=In,window._kitRenderHeaderActions=Qt,window._kitOpenSaveDistintaModal=ho,window._kitCloseSaveDistintaModal=Ot,window._kitConfirmSaveDistinta=zo,window._kitDistintaOpenPrint=_e,window._kitDistintaApplyToDraft=$e,window._kitDistintaDelete=xe}var Bt,bt,Zt,Jt,Xt,Tt,Ji,ti,Wi,ii,Yi,Et,X,ft,Mt,L,gt,Yt,B,hi,Si,tt,C,A,rt,W,Ii,Mo,wo=Qi(()=>{Ui();Fi();Gi();Vi();Bt="_mlKitData",bt="_mlKitDataTs",Zt="_mlKitOrderDrafts",Jt="_mlKitOrderDraftSeq",Xt="_mlKitPresetSections",Tt=2,Ji=["pz","mt","cm","mm","kg","g","lt","ml"],ti="_mlKitDistinte",Wi="_mlKitDistinteTs",ii="_mlKitAnagrafiche",Yi="_mlKitAnagraficheTs",Et=!1,X=[],ft=null,Mt={},L="kits";gt={};Yt=null;B=null,hi="ordine";Si=null,tt="info",C=null,A=null,rt={kitId:null,sezId:null},W=null,Ii="bom";Mo=lt});wo();export{lt as caricaKitProdotti,Mo as default,Ao as registerGlobals,Io as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-EOQ74QAA.js.map
