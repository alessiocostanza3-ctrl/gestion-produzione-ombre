import{a as ji,c as It,e as Qi,f as r,g as b,h as ft,l as Vi,m as V,q as Ui,r as xt,u as Fi}from"./chunk-chunk-55SFP7PR.js";function $o(){Mt=!1}function U(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function it(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function st(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function vt(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function Yi(t,i){let n="opz"+(i+1),e=U(t?.key,n);return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function Zi(t,i){let n="asse"+(i+1),e=U(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,a)=>Yi(s,a)).filter(Boolean):[];return{id:String(t?.id||_()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function ei(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function Xi(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function ni(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let a of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:a.id,opzioneKey:a.key,opzioneNome:a.nome,opzioneCodice:String(a.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:ei(e.selections),nome:Xi(e.selections),selections:e.selections}})}function te(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||_()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:vt(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:it(t?.qtaBase)}}function ie(t){return{id:String(t?.id||_()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(te):[]}}function ee(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function oi(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:it(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||it(Object.values(t?.qtaPerVariante||{})[0])};let e=B(i);if(!e.length)return n;let o=e.filter(d=>L(t,d.key)>0);if(!o.length)return n;let s=new Set(o.map(d=>L(t,d.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(d=>L(t,d.key)))};let a=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:a};let c=new Set(o.map(d=>d.key));for(let d of i.assiConfigurazione||[]){let l=[];for(let m of d.opzioni||[]){let u=new Set(e.filter(h=>(h.selections||[]).some(f=>f.asseId===d.id&&f.opzioneId===m.id)).map(h=>h.key));if(!u.size)continue;[...u].every(h=>L(t,h)===a)&&l.push(m.id)}if(!l.length)continue;let p=new Set(e.filter(m=>(m.selections||[]).some(u=>u.asseId===d.id&&l.includes(u.opzioneId))).map(m=>m.key));if(ee(p,c))return{tipo:"gruppo",asseId:d.id,opzioneIds:l,qtyBase:a}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:a}}function Tt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=it(n.qtyBase);if(!o)return e;for(let s of B(i)){let a=n.tipo==="sempre";n.tipo==="gruppo"&&(a=(s.selections||[]).some(c=>c.asseId===n.asseId&&n.opzioneIds.includes(c.opzioneId))),a&&(e[s.key]=o)}return e}function ne(t,i){let n=ie(t);return n.componenti=n.componenti.map(function(e){let o=oi(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:Tt(e,i,o)}}),n}function oe(t,i){let n=B(i);if(!n.length)return null;let e=null;for(let o of n){let s=L(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function se(t,i,n){let e=B(n),o={},s=oe(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let a of e){let d=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},a.key)?L(t,a.key):s!==null?s:0;d>0&&(o[a.key]=d)}return{id:_(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:Dt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:vt(t?.unitaMisura,K(t)?"flag":"pz")}}function ht(t,i,n){return{id:_(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>se(e,i,n)):[]}}function si(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(d=>d.key)),o=U(t?.key||String(t?.nome||"asse"),"asse1"),s=o,a=1;for(;e.has(s);)s=o+"_c"+a++;let c=[];for(let d=0;d<(t.opzioni||[]).length;d++){let l=t.opzioni[d],p="opz"+(d+1),m=U(l?.key,p),u=1;for(;c.some(g=>g.key===m);)m=m+"_c"+u++;c.push({id:_(),key:m,nome:String(l?.nome||"").trim()||m,codice:String(l?.codice||"").trim()})}return{id:_(),key:s,nome:String(t?.nome||"").trim()||s,opzioni:c}}function Nt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function kt(t,i){let n=new Set(B(t).map(s=>s.key)),e=B(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function zt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function ae(t,i){return{id:String(t?.id||_()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function ai(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(m,u){let g="v"+(u+1),h=U(m?.key,g);return{id:String(m?.id||_()),key:h,nome:String(m?.nome||h).trim()||h}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((m,u)=>Zi(m,u)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(m){return{id:m.id,key:m.key,nome:m.nome}})}]:[],s=ni(o),a=s.length?s:n,c=new Set(a.map(m=>m.key)),d={};Object.entries(i.qtaDaProdurre||{}).forEach(function(m){c.has(m[0])&&(d[m[0]]=Math.max(0,Number.parseInt(m[1],10)||0))});for(let m of a)d[m.key]===void 0&&(d[m.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(m=>ae(m,a[0]?.key||"")).filter(m=>!m.varianteKey||c.has(m.varianteKey)):[],p={};return Object.entries(i.pronti||{}).forEach(function(m){p[m[0]]=Math.max(0,Number.parseInt(m[1],10)||0)}),{id:String(i.id||_()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Ot,assiConfigurazione:o,varianti:a,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(m=>ne(m,{assiConfigurazione:o,varianti:a})):[],sottoAssembly:l,qtaDaProdurre:d,pronti:p,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function B(t){return Array.isArray(t?.varianti)?t.varianti:[]}function K(t){return!!t&&t.modoComponente==="segnalazione"}function Dt(t){return!!t&&t.tracciabile!==!1&&!K(t)}function L(t,i){let n=it(t?.qtaPerVariante?.[i]);return K(t)?n>0?1:0:n}function Lt(t,i){return oi(t,i)}function Kt(){try{let t=localStorage.getItem(Zt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function ri(t){try{localStorage.setItem(Zt,JSON.stringify(t||{}))}catch{}}function ct(){try{let t=localStorage.getItem(Xt),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Pt(t){try{localStorage.setItem(Xt,JSON.stringify(t||[]))}catch{}}function nt(){try{let t=localStorage.getItem(ti),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Ct(t){try{localStorage.setItem(ti,JSON.stringify(t||[]));try{localStorage.setItem(Ji,Date.now())}catch{}}catch{}}function dt(t){return String(t||"").trim().toUpperCase()}function yt(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(dt).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function F(t){return yt(t?._meta||{})}function _t(t,i){return t._meta=yt(i),t._meta}function et(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function ci(){let t=1;try{t=(Number.parseInt(localStorage.getItem(Jt),10)||0)+1,localStorage.setItem(Jt,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function di(t){let i=F(t);return i.documento||(i.documento=ci(),_t(t,i)),i.documento}function Wt(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:dt(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function li(){return X.length?Promise.resolve(X):Array.isArray(window._attiviProd)&&window._attiviProd.length?(X=Wt(window._attiviProd),Promise.resolve(X)):ut||(ut=fetch(It,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(X=Wt(t),X)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){ut=null}),ut)}function re(t){let i=dt(t);return i&&X.find(n=>n.ordine===i)||null}function pi(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=dt(e);return o?i[o]?String(i[o]||"").trim():String(re(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function Z(t){let i=Kt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of B(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=yt(n._meta||{}),e}function j(t,i){let{kits:n}=y(),e=n.find(p=>p.id===t);if(!e)return;let o=Kt(),s=Z(e);i(s,e);let a={},c=!1;for(let p of B(e)){let m=Math.max(0,Number.parseInt(s[p.key],10)||0);a[p.key]=m,m>0&&(c=!0)}let d=yt(s._meta||{}),l=!!(d.cliente||d.ordiniCliente.length||d.documento);(c||l)&&(d.documento||(d.documento=ci()),a._meta=d),c||l?o[t]=a:delete o[t],ri(o),T===t&&R()}function ce(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function Rt(t){let i=gt[t.id]&&typeof gt[t.id]=="object"?gt[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return gt[t.id]=n,n}function mi(t,i){let n=t.assiConfigurazione||[];if(!n.length)return B(t)[0]||null;let e=[];for(let s of n){let a=i?.[s.id],c=(s.opzioni||[]).find(d=>d.id===a);if(!c)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:c.id,opzioneKey:c.key,opzioneNome:c.nome})}let o=ei(e);return B(t).find(s=>s.key===o)||null}function de(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function le(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let a of s.componenti||[])if(!K(a)&&!(L(a,i.key)<=0)&&a.applicazioneTipo==="gruppo"&&String(a.applicazioneAsseId||"")===e&&Array.isArray(a.applicazioneOpzioneIds)&&a.applicazioneOpzioneIds.includes(o))return!0;return!1}function pe(t,i,n){let e=[],o=new Map;for(let s of i){let a=et(n,s.key);if(a)for(let c of s.selections||[]){if(le(t,s,c))continue;let d=`${c.asseId||""}::${c.opzioneId||""}`,l=o.get(d);if(l){l.totale+=a;continue}let p={id:"sel-"+d,nome:de(c),codice:String(c?.opzioneCodice||"").trim(),totale:a,unita:"pz",dettaglio:"",noteConfig:""};o.set(d,p),e.push(p)}}return e}function $t(t,i){let n=B(t).filter(a=>et(i,a.key)>0),e=[],o=[],s=pe(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let a of t.sezioni||[]){let c=[];for(let d of a.componenti||[]){let l=0,p=[];for(let u of n){let g=et(i,u.key),h=L(d,u.key);!g||!h||(K(d)?l+=g:l+=g*h,p.push({nome:u.nome,pezziOrdine:g,coeff:h}))}if(!p.length)continue;let m=p.length===1?p[0].nome:p.length+" configurazioni";if(K(d)){o.push({id:"alert-"+d.id,tipo:"alert",nome:d.nome,dettaglio:d.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:m});continue}c.push({id:d.id,nome:d.nome,codice:String(d.codice||"").trim(),totale:l,unita:d.unitaMisura||"pz",dettaglio:"",noteConfig:d.noteConfig||""}),d.noteConfig&&o.push({id:"note-"+d.id,tipo:"nota",nome:d.nome,dettaglio:d.noteConfig,totaleCoinvolto:l,variantiLabel:m})}c.length&&e.push({id:a.id,nome:a.nome,righe:c})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:ce(i),totaleRighe:e.reduce((a,c)=>a+c.righe.length,0)}}function me(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function fe(){return String(window._distintaHeaderAzienda||"").trim()}function fi(t,i,n){let e=new Date,o=F(n),s=fe(),a=String(o.documento||"").trim(),c=s?s.split(/\r?\n/).map(g=>`<div>${r(g)}</div>`).join(""):"",d=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),p=i.selectedVarianti.length?i.selectedVarianti.map(g=>{let h=et(n,g.key);return`<tr>
                <td>${r(st(h))}</td>
                <td>${r(g.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',m=i.sezioni.map(g=>{let h=g.righe.map(f=>{let z=[f.dettaglio,f.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${r(String(f.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${r(f.nome)}</div></td>
                <td class="db-print-cell-unit">${r(f.unita)}</td>
                <td class="db-print-cell-qty">${r(st(f.totale))}</td>
                <td class="db-print-cell-note">${z?r(z):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${r(g.nome)}</td></tr>${h}`}).join(""),u=i.avvisi.length?i.avvisi.map(g=>`<div class="db-print-alert ${g.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${r(g.nome)}</div>
                <div>${r(g.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${r(st(g.totaleCoinvolto))} pz \xB7 ${r(g.variantiLabel)}</div>
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
                ${c?`<div class="db-print-company">${c}</div>`:"<div></div>"}
                <div class="db-print-title-block">
                    <div class="db-print-title">Distinta Base</div>
                    <div class="db-print-subtitle">Documento interno di produzione e approvvigionamento</div>
                </div>
            </div>

            <div class="db-print-meta-grid">
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Prodotto</div><div class="db-print-meta-value">${r(t.nome)}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Riferimento</div><div class="db-print-meta-value">${r(o.cliente||"")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${r(me(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${r(V?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${r(st(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${r(st(i.totaleRighe))}</div></div>
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
                    <div class="db-print-strip-label">${r(d)}</div>
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
                <tbody>${m}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${u}</div>
        </div>
    </div>
</body>
</html>`}function ue(t){let{kits:i}=y(),n=i.find(a=>a.id===t);if(!n)return;let e=Z(n),o=$t(n,e);if(!o.totalePezzi||!o.totaleRighe){b("Componi prima un ordine per generare la distinta stampabile.","warning");return}F(e).documento||(j(t,function(a){di(a)}),e=Z(n));let s=window.open("","_blank");if(!s){b("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(fi(n,o,e)),s.document.close(),s.focus()}function y(){try{let t=localStorage.getItem(Bt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(ai):[]}}catch{return{kits:[]}}}function I(t){let i=Array.isArray(t)?t.map(ai):[];try{localStorage.setItem(Bt,JSON.stringify({kits:i})),localStorage.setItem(bt,Date.now())}catch{}ge(i)}function ge(t){clearTimeout(Yt),Yt=setTimeout(function(){xt({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function ke(t){fetch(It,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(bt)||0);if(n>0&&n>e){try{localStorage.setItem(Bt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(bt,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function _(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function Ht(){if(!V||!V.nome)return!1;let t=String(V.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||V.ruolo==="MASTER"}function ve(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(K(e)){i[e.id]=0;continue}let o=0;for(let[s,a]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(a,10)||0)*L(e,s);i[e.id]=o}return i}function ye(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let a of s.componenti||[]){if(K(a))continue;let c=L(a,o);c>0&&(i[a.id]=(i[a.id]||0)+e*c)}}return i}function ui(t,i){let n=B(t).find(e=>e.key===i);return n?r(n.nome):r(i)}function jt(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function lt(){Mt||(Mt=!0,ke(function(n){n&&lt()}));let{kits:t}=y(),i=document.getElementById("contenitore-dati");if(i){i.innerHTML=`
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
    </div>`,N(D),Qt();try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else ft(i)}catch{ft(i)}}}function gi(t,i){if(!i)return;if(!t.length){i.innerHTML=`
        <div style="padding:40px 0;text-align:center">
            <i class="fas fa-box-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:16px;display:block"></i>
            <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun kit configurato.</p>
            <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
        </div>`;return}let n=["pz","mt","cm","mm","kg","g","lt","ml"],e=t.map(o=>{let s=o.sezioni||[],a=s.reduce((l,p)=>l+(p.componenti||[]).length,0),c=s.length,d=s.map(l=>{let p=l.componenti||[],m=p.map(u=>`
            <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #f8fafc">
                <span style="font-size:.84rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r(u.nome)}">${r(u.nome)}${u.codice?` <span style="color:#94a3b8;font-size:.76rem">\xB7 ${r(u.codice)}</span>`:""}</span>
                <input type="number" min="0" step="any" value="${u.qtaBase!=null?u.qtaBase:1}"
                    class="input-field-modern" style="padding:4px 8px;font-size:.82rem;text-align:right"
                    onchange="_kitQUpdateComp('${r(o.id)}','${r(l.id)}','${r(u.id)}','qtaBase',this.value)"
                    title="Quantit\xE0">
                <select class="input-field-modern" style="padding:4px 6px;font-size:.82rem"
                    onchange="_kitQUpdateComp('${r(o.id)}','${r(l.id)}','${r(u.id)}','unitaMisura',this.value)">
                    ${n.map(g=>`<option value="${g}"${(u.unitaMisura||"pz")===g?" selected":""}>${g}</option>`).join("")}
                </select>
                <button type="button" class="btn-trash-modern" style="padding:4px 7px"
                    onclick="_kitQDelComp('${r(o.id)}','${r(l.id)}','${r(u.id)}')" title="Rimuovi componente"><i class="fas fa-trash"></i></button>
            </div>`).join("");return`
            <details style="border-top:1px solid #f1f5f9" open>
                <summary style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;cursor:pointer;list-style:none;user-select:none;background:#fafafa;border-radius:0">
                    <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                        <input type="text" value="${r(l.nome)}"
                            class="input-field-modern" style="padding:3px 8px;font-size:.84rem;font-weight:600;max-width:200px;background:transparent;border:1px solid transparent"
                            onclick="event.preventDefault();event.stopPropagation()"
                            onfocus="this.style.background='#fff';this.style.border='1px solid #e2e8f0'"
                            onblur="this.style.background='transparent';this.style.border='1px solid transparent';_kitQRenomeSez('${r(o.id)}','${r(l.id)}',this.value)">
                        <span style="color:#94a3b8;font-size:.76rem;white-space:nowrap">${p.length} comp.</span>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;flex-shrink:0">
                        <button type="button" class="btn-trash-modern" style="padding:3px 7px;font-size:.75rem"
                            onclick="event.preventDefault();event.stopPropagation();_kitQDelSez('${r(o.id)}','${r(l.id)}')" title="Rimuovi sezione"><i class="fas fa-trash"></i></button>
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
                        onclick="_kitQAddCompOpen('${r(o.id)}','${r(l.id)}')">
                        <i class="fas fa-plus"></i> Aggiungi componente
                    </button>
                </div>
            </details>`}).join("");return`
        <details class="ordine-group" style="margin-bottom:8px">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore" style="font-size:1rem">${r(o.nome)}</span>
                    <span style="color:#94a3b8;font-size:.78rem;font-weight:500;margin-left:8px">${c} sez. \xB7 ${a} comp.</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center">
                    <button type="button" class="btn-archive-action primary" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenView('${r(o.id)}')" title="Usa kit / crea ordine">
                        <i class="fas fa-play"></i> Usa
                    </button>
                    <button type="button" class="btn-archive-action" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenConfig('${r(o.id)}')" title="Configurazione avanzata">
                        <i class="fas fa-gear"></i> Config
                    </button>
                    <button type="button" class="btn-trash-modern"
                        onclick="event.preventDefault();event.stopPropagation();_kitQDelKit('${r(o.id)}')" title="Elimina kit">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </div>
            </summary>
            <div class="ordine-items" style="padding:0">
                ${s.length?d:'<p class="acquisti-subtitle" style="padding:12px 16px;margin:0">Nessuna sezione. Aggiungi una sezione per iniziare.</p>'}
                <div style="padding:8px 12px;border-top:1px solid #f1f5f9">
                    <button type="button" class="btn-archive-action" style="font-size:.8rem"
                        onclick="_kitQAddSezOpen('${r(o.id)}')">
                        <i class="fas fa-folder-plus"></i> Aggiungi sezione
                    </button>
                </div>
            </div>
        </details>`}).join("");i.innerHTML=e}function Qt(){let t=document.getElementById("kit-page-actions");t&&(D==="kits"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>':D==="anagrafiche"?t.innerHTML='<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>':t.innerHTML="")}function N(t){D=t,document.querySelectorAll("#kit-tab-bar .acq-tab").forEach(e=>{e.classList.toggle("active",e.dataset.tab===t)});let{kits:i}=y(),n=document.getElementById("kit-main-content");n&&(t==="kits"?gi(i,n):t==="anagrafiche"?ki(i,n):t==="distinte"&&vi(i,n),Qt())}function ki(t,i){if(!i)return;let n=G();if(!n.length){i.innerHTML=`
            <div style="padding:24px 0;text-align:center">
                <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun componente salvato. Aggiungi il primo componente riutilizzabile.</p>
                <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi componente</button>
            </div>`;return}let e=n.reduce((s,a)=>{let c=a.categoria||"Senza categoria";return s[c]=s[c]||[],s[c].push(a),s},{}),o="";for(let[s,a]of Object.entries(e))o+=`<details class="ordine-group" open>
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${r(s)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${a.length} componente${a.length!==1?"i":""}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">`,o+=a.map(c=>`
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        <div style="font-weight:600;color:#1e293b">${r(c.nome)}${c.codice?` <span style="color:#94a3b8;font-size:.85rem;font-weight:400">\xB7 ${r(c.codice)}</span>`:""}</div>
                        ${c.descrizione?`<div style="color:#94a3b8;font-size:.82rem;margin-top:2px">${r(c.descrizione)}</div>`:""}
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitOpenAnagraficaModal('${r(c.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questo componente?')) _kitDeleteAnagrafica('${r(c.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`).join(""),o+="</div></details>";i.innerHTML=o}function vi(t,i){if(!i)return;let n=nt();if(!n.length){i.innerHTML='<div style="padding:24px 0;text-align:center"><p class="acquisti-subtitle">Nessuna distinta salvata.</p></div>';return}let e=n.map(o=>`
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
        </details>`).join("");i.innerHTML=e}function yi(t){let{kits:i}=y(),n=i.find(d=>d.id===t);if(!n){b("Kit non trovato \u26A0\uFE0F");return}let e=Z(n);F(e).documento||(j(t,function(d){di(d)}),e=Z(n));let o=$t(n,e);if(!o.totalePezzi||!o.totaleRighe){b("Componi prima un ordine per generare la distinta stampabile.","warning");return}let s=nt(),a=F(e),c={id:_(),kitId:n.id,kitNome:n.nome,nome:a.documento||`Distinta-${Date.now()}`,documento:a.documento||"",createdAt:Date.now(),createdBy:V?.nome||"Sistema",orderDraftSnapshot:e,distintaSnapshot:o};s.unshift(c),Ct(s),b("Distinta salvata \u2713"),D==="distinte"&&N("distinte")}function G(){try{let t=localStorage.getItem(ii),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Vt(t){try{localStorage.setItem(ii,JSON.stringify(t||[]));try{localStorage.setItem(Wi,Date.now())}catch{}}catch{}}function be(){if(document.getElementById("modal-kit-anagrafica-edit"))return;let t=document.createElement("div");t.innerHTML=`
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
    </div>`,document.body.appendChild(t.firstElementChild)}function he(t){be();let i=document.getElementById("modal-kit-anagrafica-edit");if(!i)return;let n=document.getElementById("anag-componente"),e=document.getElementById("anag-codice"),o=document.getElementById("anag-categoria"),s=document.getElementById("anag-descrizione");if(t){let a=G().find(c=>c.id===t);a&&(n&&(n.value=a.nome||""),e&&(e.value=a.codice||""),o&&(o.value=a.categoria||""),s&&(s.value=a.descrizione||""),i.dataset.editId=t)}else n&&(n.value=""),e&&(e.value=""),o&&(o.value=""),s&&(s.value=""),delete i.dataset.editId;i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function bi(){let t=document.getElementById("modal-kit-anagrafica-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ze(){let t=document.getElementById("modal-kit-anagrafica-edit");if(!t)return;let i=t.dataset.editId,n=(document.getElementById("anag-componente")?.value||"").trim();if(!n){b("Inserisci il nome del componente","warning");return}let e=(document.getElementById("anag-codice")?.value||"").trim(),o=(document.getElementById("anag-categoria")?.value||"").trim(),s=(document.getElementById("anag-descrizione")?.value||"").trim(),a=G();if(i){let c=a.findIndex(d=>d.id===i);c!==-1?a[c]={...a[c],nome:n,codice:e,categoria:o,descrizione:s,updatedAt:Date.now()}:a.unshift({id:_(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:V?.nome||"Sistema"})}else a.unshift({id:_(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:V?.nome||"Sistema"});Vt(a),bi(),b("Componente salvato \u2713"),D==="anagrafiche"&&N("anagrafiche")}function we(t){let i=G().filter(n=>n.id!==t);Vt(i),D==="anagrafiche"&&N("anagrafiche"),b("Componente eliminato \u2713")}function Ce(t){let i=nt().find(o=>o.id===t);if(!i)return;let{kits:n}=y(),e=n.find(o=>o.id===i.kitId)||null;if(e){let o=window.open("","_blank");if(!o){b("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}o.document.open();try{o.document.write(fi(e,i.distintaSnapshot,i.orderDraftSnapshot))}catch{o.document.write("<pre>"+r(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>")}o.document.close(),o.focus()}else{let o=window.open("","_blank");if(!o){b("Popup bloccato","warning");return}o.document.open(),o.document.write("<pre>"+r(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>"),o.document.close(),o.focus()}}function _e(t){let i=nt().find(e=>e.id===t);if(!i)return;let n=Kt();n[i.kitId]=i.orderDraftSnapshot||{},ri(n),b("Bozza ordine ripristinata per il kit selezionato \u2713")}function $e(t){let i=nt().filter(n=>n.id!==t);Ct(i),D==="distinte"&&N("distinte"),b("Distinta eliminata \u2713")}function Se(t){T=t,hi="ordine",R()}function R(){let{kits:t}=y(),i=t.find(f=>f.id===T);if(!i){lt();return}let n=document.getElementById("contenitore-dati"),e=B(i),o=Z(i),s=F(o),a=$t(i,o),c=a.selectedVarianti.length?a.selectedVarianti.map(f=>`<span class="kit-meta-pill"><strong>${et(o,f.key)}</strong> \xD7 ${r(f.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',d=s.ordiniCliente.length?s.ordiniCliente.map(f=>`<span class="kit-order-ref-chip">${r(f)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(f)})' aria-label="Rimuovi ordine ${r(f)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=Rt(i),p=mi(i,l),m=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(f=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${r(f.nome)}</div>
                <div class="kit-compose-options">${(f.opzioni||[]).map(z=>`
                        <button type="button" class="kit-compose-option ${l[f.id]===z.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${r(i.id)}','${r(f.id)}','${r(z.id)}')">
                        ${r(z.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',u=a.selectedVarianti.length?a.selectedVarianti.map(f=>{let z=et(o,f.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${r(f.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(f.selections)&&f.selections.length?f.selections.map(M=>r(M.opzioneNome)).join(" \xB7 "):r(f.key)}</div>
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
                        <div class="kit-distinta-row-qty">${st(z.totale)} ${r(z.unita)}</div>
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
                    <div class="kit-order-ref-list">${d}</div>
                    <div class="kit-order-meta-help">Il cliente viene derivato dagli ordini selezionati. Se gli ordini appartengono a clienti diversi, in stampa il riferimento resta vuoto.</div>
                </div>
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Dati stampa</div>
                    <div class="kit-order-meta-row"><span>Cliente</span><strong>${r(s.cliente||"")}</strong></div>
                    <div class="kit-order-meta-row"><span>Documento</span><strong>${r(s.documento||"")}</strong></div>
                </div>
            </div>
            <div class="kit-order-summary-badges">${c}</div>
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
                            <div class="kit-compose-selected-name">${p?r(p.nome):"Completa prima tutte le scelte"}</div>
                        </div>
                        <div class="kit-order-stepper">
                            <input class="kit-order-stepper-input" id="kit-compose-qty-${r(i.id)}" type="number" min="1" value="1">
                            <button type="button" class="kit-spedisci-btn" onclick="_kitComposeAdd('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
                        </div>
                    </div>
                </div>
                <div class="kit-order-lines">${u}</div>
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
    </div>`,ft(n),li().catch(()=>{})}function Ie(){T=null,lt()}function xe(t){hi=t,R()}function Ae(t){j(t,function(i,n){for(let e of B(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Me(t,i,n){try{window._kitSuppressNextFade=!0}catch{}j(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function Ee(t,i,n){try{window._kitSuppressNextFade=!0}catch{}j(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function qe(t){j(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=yt({})})}function Be(t,i){j(t,function(n){n[i]=0})}function wt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${r(e.ordine)}</span>
            <span class="ac-cliente">${r(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function Oe(t,i){let n=String(i||"").trim().toLowerCase();if(!n){wt(t,[]);return}li().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);wt(t,o)})}function Te(t){setTimeout(function(){wt(t,[])},140)}function Ne(t,i,n){let e=dt(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}j(t,function(s){let a=F(s);a.ordiniCliente=[...new Set(a.ordiniCliente.concat(e))],a.cliente=pi(a.ordiniCliente,{[e]:n}),_t(s,a)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),wt(t,[])}function De(t,i){let n=dt(i);try{window._kitSuppressNextFade=!0}catch{}j(t,function(e){let o=F(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=pi(o.ordiniCliente),_t(e,o)})}function Le(t,i,n){let{kits:e}=y(),o=e.find(a=>a.id===t);if(!o)return;let s=Rt(o);if(s[i]=n,gt[t]=s,T===t){try{window._kitSuppressNextFade=!0}catch{}R()}}function Ke(t){let{kits:i}=y(),n=i.find(a=>a.id===t);if(!n)return;let e=mi(n,Rt(n));if(!e){b("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){b("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(At[t])return;At[t]=Date.now(),setTimeout(function(){try{delete At[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}j(t,function(a){a[e.key]=et(a,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function zi(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=y(),s=o.find(z=>z.id===T);if(!s)return;let a=(s.sezioni||[]).find(z=>z.id===n),c=a&&(a.componenti||[]).find(z=>z.id===i);if(!c||!Dt(c))return;c.caricato=e,I(o);let l=ve(s)[i]||0,p=Math.max(0,l-e),u=ye(s)[i]||0,g=t.closest("tr");if(!g)return;let h=g.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");h&&(h.textContent=l===0?"\u2014":p,h.className=l===0?"kit-ord-zero":p>0?"kit-ord-manca":"kit-ord-ok");let f=g.querySelector(".kit-car-liberi");f&&(u>0?(f.textContent=Math.max(0,e-u)+" lib.",f.style.display=""):f.style.display="none")}function Pe(t,i,n){let{kits:e}=y(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),I(e),T===t&&R())}function Re(t,i,n){let{kits:e}=y(),o=e.find(a=>a.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),I(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function He(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${r(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${r(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let a=(e.righe||[]).reduce((l,p)=>l+p.qty,0),c=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${r(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),d=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${r(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${a} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${r(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${d}<div class="kit-sped-bom-divider">componenti scaricati</div>${c}</div>
            </details>`}if(e.tipo==="reso"){let a=e.totPz||0,c=(e.items||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${r(p.nome)}</span><span class="kit-mov-qty carico">\xD7${p.qty}</span></div>`).join(""),d=(e.righe||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${r(p.mat)}</span><span class="kit-mov-qty carico">+${p.qty}</span></div>`).join(""),l=(e.scartate||[]).map(p=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${r(p.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${p.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\u{1F4E6} Rientro \xD7${a} pz</span>
                ${e.nota?`<span class="kit-mov-nota">${r(e.nota)}</span>`:""}
                <span class="kit-mov-ts">${e.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">
                ${c}
                ${d?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${d}`:""}
                ${l?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${l}`:""}
              </div>
            </details>`}return`<div class="kit-mov-item ${r(e.tipo)}">
            <span class="kit-mov-badge ${r(e.tipo)}">${e.tipo==="carico"?"CARICO":"SCARICO"}</span>
            <span class="kit-mov-mat">${r(e.mat)}</span>
            <span class="kit-mov-qty ${r(e.tipo)}">${e.tipo==="carico"?"+":"\u2212"}${e.qty}</span>
            ${e.nota?`<span class="kit-mov-nota">${r(e.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${e.ts}</span>
            ${s}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function je(t,i){let{kits:n}=y(),e=n.find(f=>f.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),a=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let c=o.value,d=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),p=(a?.value||"").trim(),m=(e.sezioni||[]).find(f=>f.id===d),u=m&&(m.componenti||[]).find(f=>f.id===c);if(!u||!Dt(u))return;i==="carico"?u.caricato=(parseInt(u.caricato)||0)+l:u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:c,sid:d,tipo:i,qty:l,nota:p,mat:u.nome,ts:jt()}),I(n),s&&(s.value=1),a&&(a.value="");let g=document.getElementById("kit-mov-list-"+t);g&&(g.innerHTML=He(e,Ht()));let h=document.querySelector(`#kit-tbody-${t} input[data-cid="${c}"]`);h&&(h.value=u.caricato,zi(h))}function Qe(t,i){if(!Ht())return;let{kits:n}=y(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&Ve(t,i,o)}function Ve(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((d,l)=>d+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let c=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${r(n.tipo)}" style="font-size:.75rem">${c}</span> <strong>${r(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let a=document.getElementById("btn-kit-del-ok");a&&(a.onclick=()=>Ci(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function wi(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ci(t,i){wi();let{kits:n}=y(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(a=>a.id===o.sid);for(let a of o.righe||[])for(let c of e.sezioni||[]){let d=(c.componenti||[]).find(l=>l.id===a.cid||l.nome===a.mat);d&&(d.caricato=(parseInt(d.caricato)||0)+a.qty)}for(let a of o.items||[])a.saId&&e.pronti&&(e.pronti[a.saId]=(parseInt(e.pronti[a.saId])||0)+a.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let a of e.sezioni||[]){let c=(a.componenti||[]).find(d=>d.id===s.cid||d.nome===s.mat);c&&(c.caricato=Math.max(0,(parseInt(c.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(c=>c.id===o.cid);a&&(a.caricato=Math.max(0,(parseInt(a.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(c=>c.id===o.cid);a&&(a.caricato=(parseInt(a.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),I(n),T===t&&R(),b("Movimento eliminato \u2713")}}function Ue(t,i){if(!Ht())return;let{kits:n}=y(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let a=document.getElementById("kit-edit-mov-mat"),c=document.getElementById("kit-edit-mov-qty"),d=document.getElementById("kit-edit-mov-nota");a&&(a.innerHTML=`<span class="kit-mov-badge ${r(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${r(o.mat)}</strong>`),c&&(c.value=o.qty),d&&(d.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>d&&d.focus(),80)}function _i(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Fe(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);_i();let{kits:e}=y(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let a=o.movimenti[s],c=parseInt(document.getElementById("kit-edit-mov-qty")?.value),d=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(c)||c<=0){b("Quantit\xE0 non valida \u26A0\uFE0F");return}if(c!==a.qty){let l=c-a.qty;for(let p of o.sezioni||[]){let m=(p.componenti||[]).find(u=>u.id===a.cid);if(m){a.tipo==="carico"?m.caricato=Math.max(0,(parseInt(m.caricato)||0)+l):m.caricato=Math.max(0,(parseInt(m.caricato)||0)-l);break}}}o.movimenti[s]={...a,qty:c,nota:d},I(e),T===i&&R(),b("Movimento aggiornato \u2713")}function Ge(t){let{kits:i}=y(),n=i.find(d=>d.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(d=>(Number.parseInt(n.pronti?.[d.id],10)||0)>0)){b("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(d=>(Number.parseInt(n.pronti?.[d.id],10)||0)>0).map(d=>{let l=Number.parseInt(n.pronti?.[d.id],10)||0,p=ui(n,d.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${r(d.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${r(d.nome)} <span class="kit-sped-var-pill">${p}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let a=document.getElementById("kit-sped-nota-"+t),c=document.getElementById("kit-sped-modal-nota");c&&a&&(c.value=a.value||""),c&&!a&&(c.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function $i(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Je(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;$i();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=y(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),a=[],c=[];for(let l of n){let p=(o.sottoAssembly||[]).find(u=>u.id===l);if(!p)continue;let m=Number.parseInt(o.pronti?.[l],10)||0;if(m){a.push({saId:l,nome:p.nome,qty:m});for(let u of o.sezioni||[])for(let g of u.componenti||[]){if(K(g))continue;let h=L(g,p.varianteKey);if(!h)continue;let f=m*h;g.caricato=Math.max(0,(parseInt(g.caricato)||0)-f);let z=c.find(M=>M.cid===g.id);z?z.qty+=f:c.push({cid:g.id,mat:g.nome,qty:f})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:a,righe:c,nota:s,ts:jt()}),I(e);let d=a.reduce((l,p)=>l+p.qty,0);b(`Spedizione registrata: ${d} pz \u2713`),T===i&&R()}function We(t){let{kits:i}=y(),n=i.find(a=>a.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let a=n.sottoAssembly||[];o.innerHTML=a.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':a.map(c=>{let d=ui(n,c.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${r(c.nome)} <span class="kit-sped-var-pill">${d}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(c.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${r(c.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${r(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(c.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),Ut(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Si(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ye(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&Ut(e.dataset.kitId)}function Ut(t){let{kits:i}=y(),n=i.find(a=>a.id===t);if(!n)return;let e={};for(let a of n.sottoAssembly||[]){let c=document.getElementById("kit-reso-qty-"+a.id),d=Number.parseInt(c?.value,10)||0;if(d)for(let l of n.sezioni||[])for(let p of l.componenti||[]){if(K(p))continue;let m=L(p,a.varianteKey);m&&(e[p.id]={mat:p.nome,qty:(e[p.id]?.qty||0)+d*m})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,a])=>a.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([a,{mat:c,qty:d}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${r(a)}" data-qty="${d}" checked>
            <span class="kit-reso-bom-mat">${r(c)}</span>
            <span class="kit-reso-bom-qty">+${d}</span>
        </label>`).join("")}function Ze(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=y(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let p=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;p>0&&o.push({saId:l.id,nome:l.nome,qty:p})}if(!o.length){b("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],a=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let p=l.dataset.cid,m=Number.parseInt(l.dataset.qty,10),u=[...e.sezioni||[]].flatMap(g=>g.componenti||[]).find(g=>g.id===p)?.nome||"?";l.checked?s.push({cid:p,mat:u,qty:m}):a.push({cid:p,mat:u,qty:m})});for(let l of s)for(let p of e.sezioni||[]){let m=(p.componenti||[]).find(u=>u.id===l.cid);if(m){m.caricato=(parseInt(m.caricato)||0)+l.qty;break}}let c=(document.getElementById("kit-reso-nota")?.value||"").trim(),d=o.reduce((l,p)=>l+p.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:a,nota:c,ts:jt(),totPz:d}),I(n),Si(),b(`Reso registrato: ${d} pz \u2014 ${s.length} comp. recuperati \u2713`),T===i&&R()}function Xe(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=y();xt({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(bt,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function xi(t){H=t;let i=document.getElementById("modal-kit-config");i&&(P(),i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function tn(){let t=document.getElementById("modal-kit-config");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300),H=null)}function en(t){if(!H)return;let i=(t?.value||"").trim();i&&($(H,n=>{n.nome=i},!1),N("kits"))}function P(){if(!H)return;let{kits:t}=y(),i=t.find(f=>f.id===H);if(!i)return;let n=G(),e=["pz","mt","cm","mm","kg","g","lt","ml"],o=document.getElementById("kit-cfg-modal-nome");o&&(o.value=i.nome||"");let s=[...new Set(n.map(f=>(f.categoria||"").trim()).filter(Boolean))].sort(),a=["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ef4444","#14b8a6","#f97316","#84cc16"],c=f=>a[s.indexOf(f)%a.length]||"#94a3b8",l=(i.sezioni||[]).flatMap(f=>(f.componenti||[]).map(z=>({comp:z,sez:f})));function p(f){return n.find(z=>z.nome===f.nome&&(!f.codice||!z.codice||z.codice===f.codice))||n.find(z=>z.nome===f.nome)}let m;l.length===0?m=`<div class="kcfg-empty">
            <i class="fas fa-inbox" style="font-size:1.3rem;display:block;margin-bottom:6px;opacity:.35"></i>
            Nessun componente ancora. Aggiungili dal catalogo qui sotto.
        </div>`:m='<div class="kcfg-list">'+l.map(({comp:f,sez:z})=>{let M=p(f),W=M?(M.categoria||"").trim():"",Q=W?c(W):"#e2e8f0",A=vt(f.unitaMisura,"pz"),mt=e.map(Y=>`<option value="${Y}"${A===Y?" selected":""}>${Y}</option>`).join("");return`<div class="kcfg-comp-row">
                    <span class="kcfg-dot" style="background:${Q}"></span>
                    <span class="kcfg-name">${r(f.nome)}${f.codice?`<span class="kcfg-code">&middot;&thinsp;${r(f.codice)}</span>`:""}</span>
                    <input type="number" min="0" step="any" class="input-field-modern kcfg-qty"
                        value="${f.qtaBase??1}" title="Quantit&#224;"
                        onchange="_kitCfgModalUpdateComp('${r(i.id)}','${r(z.id)}','${r(f.id)}','qtaBase',this.value)">
                    <select class="input-field-modern kcfg-unit"
                        onchange="_kitCfgModalUpdateComp('${r(i.id)}','${r(z.id)}','${r(f.id)}','unitaMisura',this.value)">
                        ${mt}
                    </select>
                    <button type="button" class="btn-trash-modern" style="width:28px;height:28px;flex-shrink:0"
                        onclick="_kitCfgModalDelComp('${r(i.id)}','${r(z.id)}','${r(f.id)}')">
                        <i class="fas fa-times" style="font-size:.75rem"></i>
                    </button>
                </div>`}).join("")+"</div>";let u=new Set(l.map(({comp:f})=>f.nome)),g="";n.length===0?g=`<div class="kcfg-empty" style="background:#fef3c7;border-color:#fde68a;color:#92400e;text-align:left">
            <i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>
            Catalogo vuoto. Vai nella tab <strong>Anagrafiche</strong> per aggiungere componenti.
        </div>`:g=s.map(z=>{let M=n.filter(A=>(A.categoria||"").trim()===z&&!u.has(A.nome));if(M.length===0)return"";let W=c(z),Q=M.map(A=>`<button type="button" class="kcfg-pill"
                    onclick="_kitCfgModalAddAnag('${r(i.id)}','${r(A.id)}')"
                    title="Aggiungi ${r(A.nome)}">
                    <i class="fas fa-plus" style="font-size:.58rem;opacity:.6;margin-right:3px"></i>${r(A.nome)}${A.codice?`<span class="kcfg-pill-code">${r(A.codice)}</span>`:""}
                </button>`).join("");return`<div class="kcfg-cat-strip">
                <span class="kcfg-cat-badge" style="--kcfg-dot:${W}">${r(z)}</span>
                <div class="kcfg-pills">${Q}</div>
            </div>`}).filter(Boolean).join("")||`<p style="color:#94a3b8;font-size:.82rem;margin:4px 0;padding:6px 2px">
                   <i class="fas fa-check-circle" style="color:#10b981;margin-right:5px"></i>
                   Tutti i componenti del catalogo sono gi&#224; nel kit.
               </p>`;let h=document.getElementById("kit-cfg-modal-bom-panel");h&&(h.innerHTML=`
        <div class="kcfg-section-lbl">Nel kit (${l.length})</div>
        ${m}
        ${n.length>0?`
        <div class="kcfg-section-lbl" style="margin-top:18px">Aggiungi dal catalogo</div>
        <div style="padding:2px 0">${g}</div>`:g}
        <div style="margin-top:14px;padding-top:10px;border-top:1px solid #f1f5f9">
            <button type="button" class="btn-add-dashed" style="font-size:.79rem;padding:8px 14px;border-radius:10px"
                onclick="_kitCfgModalAddCompFree()">
                <i class="fas fa-pen" style="margin-right:6px;opacity:.55"></i>Aggiungi componente manuale
            </button>
        </div>`)}function nn(t,i,n,e){$(t,o=>{let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s[n]=e.trim()||s[n])},!0)}function on(t,i){confirm("Eliminare questa sezione e tutti i componenti?")&&$(t,n=>{n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)},!0)}function sn(t,i){let e=G().find(s=>s.id===i);if(!e)return;let o=(e.categoria||"").trim()||"Generali";$(t,s=>{let a=(s.sezioni||[]).find(c=>c.nome.trim()===o);a||(a={id:_(),nome:o,componenti:[]},s.sezioni=s.sezioni||[],s.sezioni.push(a)),a.componenti=a.componenti||[],a.componenti.push({id:_(),nome:e.nome,codice:e.codice||"",qtaBase:1,unitaMisura:e.unitaMisura||"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function an(){H&&$(H,t=>{let i=(t.sezioni||[]).find(n=>n.nome==="Liberi");i||(i={id:_(),nome:"Liberi",componenti:[]},t.sezioni=t.sezioni||[],t.sezioni.push(i)),i.componenti=i.componenti||[],i.componenti.push({id:_(),nome:"Nuovo componente",codice:"",qtaBase:1,unitaMisura:"pz",regola:{tipo:"sempre",qtyBase:1}})},!0)}function rn(t,i,n,e,o){$(t,s=>{let a=(s.sezioni||[]).find(d=>d.id===i),c=a&&(a.componenti||[]).find(d=>d.id===n);c&&(e==="qtaBase"?(c.qtaBase=parseFloat(o)||1,c.regola&&(c.regola.qtyBase=c.qtaBase)):c[e]=o)},!0)}function cn(t,i,n,e,o){$(t,s=>{let a=(s.sezioni||[]).find(d=>d.id===i),c=a&&(a.componenti||[]).find(d=>d.id===n);c&&(c.regola=c.regola||{},e==="tipo"?(c.regola.tipo=o,o==="gruppo"&&!c.regola.asseId&&s.assiConfigurazione?.length&&(c.regola.asseId=s.assiConfigurazione[0].id),o==="gruppo"&&(c.regola.opzioneIds=c.regola.opzioneIds||[])):e==="asseId"?(c.regola.asseId=o,c.regola.opzioneIds=[]):c.regola[e]=o)},!0)}function dn(t,i,n){$(t,e=>{let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))},!0)}function ln(t){$(t,i=>{i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:_(),nome:"Nuovo gruppo",key:U("","ax"+i.assiConfigurazione.length),opzioni:[]})},!0)}function pn(t,i){confirm("Eliminare questo gruppo elettronico?")&&$(t,n=>{n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)},!0)}function mn(t,i,n,e){$(t,o=>{let s=(o.assiConfigurazione||[]).find(a=>a.id===i);s&&(s[n]=e)},!1)}function fn(t,i){$(t,n=>{let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;e.opzioni=e.opzioni||[];let o=e.opzioni.length+1;e.opzioni.push({id:_(),key:U("","opz"+o),nome:"Nuova opzione",codice:""})},!0)}function un(t,i,n){$(t,e=>{let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))},!0)}function gn(t,i,n,e,o){$(t,s=>{let a=(s.assiConfigurazione||[]).find(d=>d.id===i),c=a&&(a.opzioni||[]).find(d=>d.id===n);c&&(c[e]=o)},!1)}function Ai(){let t=document.getElementById("modal-kit-crea");if(!t)return;let i=document.getElementById("kit-crea-nome");i&&(i.value=""),t.style.display="flex",t.offsetHeight,t.classList.add("active"),setTimeout(()=>i&&i.focus(),80)}function Mi(){let t=document.getElementById("modal-kit-crea");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function kn(){let t=(document.getElementById("kit-crea-nome")?.value||"").trim();if(!t){b("Inserisci un nome per il kit","warning");return}let{kits:i}=y(),n={id:_(),nome:t,schemaVersion:Ot,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};i.push(n),I(i),Mi(),setTimeout(()=>N("kits"),320)}function vn(t){rt.kitId=t;let i=document.getElementById("modal-kit-qadd-sez");if(!i)return;let n=document.getElementById("kit-qadd-sez-nome");n&&(n.value=""),i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function Ei(){let t=document.getElementById("modal-kit-qadd-sez");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function yn(){let t=(document.getElementById("kit-qadd-sez-nome")?.value||"").trim()||"Nuova sezione",{kits:i}=y(),n=i.find(e=>e.id===rt.kitId);n&&(n.sezioni=n.sezioni||[],n.sezioni.push({id:_(),nome:t,componenti:[]}),I(i),Ei(),setTimeout(H?()=>P():()=>N("kits"),320))}function bn(t,i){rt.kitId=t,rt.sezId=i;let n=document.getElementById("modal-kit-qadd-comp");if(!n)return;let e=G(),o=document.getElementById("kit-qadd-comp-source-cat"),s=document.getElementById("kit-qadd-comp-source-free");e.length?(o&&(o.checked=!0),Et("cat")):(s&&(s.checked=!0),Et("free"));let a=[...new Set(e.map(u=>u.categoria||"Senza categoria"))].sort(),c=document.getElementById("kit-qadd-comp-cat");c&&(c.innerHTML=a.map(u=>`<option value="${r(u)}">${r(u)}</option>`).join(""),qi());let d=document.getElementById("kit-qadd-comp-qty");d&&(d.value="1");let l=document.getElementById("kit-qadd-comp-unit");l&&(l.value="pz");let p=document.getElementById("kit-qadd-comp-nome");p&&(p.value="");let m=document.getElementById("kit-qadd-comp-codice");m&&(m.value=""),n.style.display="flex",n.offsetHeight,n.classList.add("active")}function Et(t){let i=document.getElementById("kit-qadd-comp-cat-section"),n=document.getElementById("kit-qadd-comp-free-section");i&&(i.style.display=t==="cat"?"":"none"),n&&(n.style.display=t==="free"?"":"none")}function qi(){let t=document.getElementById("kit-qadd-comp-cat"),i=document.getElementById("kit-qadd-comp-comp");if(!t||!i)return;let n=t.value,o=G().filter(s=>(s.categoria||"Senza categoria")===n);i.innerHTML=o.length?o.map(s=>`<option value="${r(s.id)}">${r(s.nome)}${s.codice?" \xB7 "+r(s.codice):""}</option>`).join(""):'<option value="">Nessun componente in questa categoria</option>'}function Bi(){let t=document.getElementById("modal-kit-qadd-comp");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function hn(){let t=document.getElementById("kit-qadd-comp-source-cat")?.checked,i="",n="";if(t){let l=document.getElementById("kit-qadd-comp-comp")?.value;if(!l){b("Seleziona un componente dal catalogo","warning");return}let p=G().find(m=>m.id===l);if(!p){b("Componente non trovato nel catalogo","warning");return}i=p.nome,n=p.codice||""}else{if(i=(document.getElementById("kit-qadd-comp-nome")?.value||"").trim(),!i){b("Inserisci il nome del componente","warning");return}n=(document.getElementById("kit-qadd-comp-codice")?.value||"").trim()}let e=parseFloat(document.getElementById("kit-qadd-comp-qty")?.value)||1,o=document.getElementById("kit-qadd-comp-unit")?.value||"pz",{kits:s}=y(),a=s.find(d=>d.id===rt.kitId);if(!a)return;let c=(a.sezioni||[]).find(d=>d.id===rt.sezId);c&&(c.componenti=c.componenti||[],c.componenti.push({id:_(),nome:i,codice:n,qtaBase:e,qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:o,applicazioneTipo:"sempre"}),I(s),Bi(),setTimeout(H?()=>P():()=>N("kits"),320))}function zn(t,i,n,e,o){let{kits:s}=y(),a=s.find(l=>l.id===t);if(!a)return;let c=(a.sezioni||[]).find(l=>l.id===i);if(!c)return;let d=(c.componenti||[]).find(l=>l.id===n);d&&(e==="qtaBase"?d.qtaBase=parseFloat(o)||0:d[e]=o,I(s))}function wn(t,i,n){if(!n.trim())return;let{kits:e}=y(),o=e.find(a=>a.id===t);if(!o)return;let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s.nome=n.trim(),I(e))}function Cn(t,i,n){let{kits:e}=y(),o=e.find(a=>a.id===t);if(!o)return;let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s.componenti=(s.componenti||[]).filter(a=>a.id!==n),I(e),N("kits"))}function _n(t,i){if(!confirm("Rimuovere questa sezione e tutti i suoi componenti?"))return;let{kits:n}=y(),e=n.find(o=>o.id===t);e&&(e.sezioni=(e.sezioni||[]).filter(o=>o.id!==i),I(n),N("kits"))}function $n(t){if(!confirm("Eliminare questo kit? L'operazione non \xE8 reversibile."))return;let{kits:i}=y(),n=i.filter(e=>e.id!==t);I(n),N("kits")}function Sn(){Ai()}function Oi(t){H=t,xi(t)}function St(t,i,n=""){let{kits:e}=y(),o=e.find(d=>d.id===t),s=e.find(d=>d.id!==t&&(d.sezioni||[]).length),a=o?.sezioni?.[0]?.id||"",c=e.find(d=>d.id!==t&&(d.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?a:s?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?c:""),targetKitIds:[]}}function Ti(t){C=St(t,"import"),J(!0)}function In(t){C=St(t,"import-asse"),J(!0)}function xn(t,i){C=St(t,"copy",i),J(!0)}function at(){let t=document.getElementById("modal-kit-import");C=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function An(t){if(!C||t!=="import"&&t!=="copy"||C.mode===t)return;let i=C.currentKitId,n=t==="copy"?C.sectionId:"";C=St(i,t,n),J()}function Mn(t){C&&(C.search=String(t||""),J())}function En(t){if(!C)return;let{kits:i}=y(),n=i.find(e=>e.id===t);C.sourceKitId=t,C.mode==="import-asse"?C.asseId=n?.assiConfigurazione?.[0]?.id||"":C.sectionId=n?.sezioni?.[0]?.id||"",J()}function qn(t){C&&(C.mode==="import-asse"?C.asseId=t:C.sectionId=t,J())}function Bn(t,i){if(!C||C.mode!=="copy")return;let n=new Set(C.targetKitIds||[]);i?n.add(t):n.delete(t),C.targetKitIds=[...n],J()}function On(){if(!C||C.mode!=="copy")return;let{kits:t}=y(),i=t.filter(e=>e.id!==C.currentKitId&&zt(e.nome,C.search)),n=new Set(C.targetKitIds||[]);for(let e of i)n.add(e.id);C.targetKitIds=[...n],J()}function Tn(){!C||C.mode!=="copy"||(C.targetKitIds=[],J())}function J(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!C)return;let{kits:n}=y(),e=C,o=n.find(k=>k.id===e.currentKitId);if(!o){at();return}let s=[];e.mode==="import"?s=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length):e.mode==="import-asse"?s=n.filter(k=>k.id!==o.id&&(k.assiConfigurazione||[]).length):s=n.filter(k=>k.id!==o.id&&(k.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!s.some(k=>k.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(k=>k!==o.id&&n.some(w=>w.id===k)));let a=n.find(k=>k.id===e.sourceKitId)||null,c=e.mode==="import-asse"?a?.assiConfigurazione||[]:a?.sezioni||[];e.mode==="import-asse"?c.some(k=>k.id===e.asseId)||(e.asseId=c[0]?.id||""):c.some(k=>k.id===e.sectionId)||(e.sectionId=c[0]?.id||"");let d=e.mode==="import-asse"?(a?.assiConfigurazione||[]).find(k=>k.id===e.asseId)||null:Nt(a,e.sectionId),l=s.filter(k=>zt(k.nome,e.search)),p=n.filter(k=>k.id!==o.id&&zt(k.nome,e.search)),m=document.getElementById("kit-import-subtitle"),u=document.getElementById("kit-import-search"),g=document.getElementById("kit-import-left-title"),h=document.getElementById("kit-import-right-title"),f=document.getElementById("kit-import-kit-list"),z=document.getElementById("kit-import-section-list"),M=document.getElementById("kit-import-target-wrap"),W=document.getElementById("kit-import-target-list"),Q=document.getElementById("kit-import-preview"),A=document.getElementById("kit-import-confirm-btn"),mt=document.getElementById("kit-import-mode-import"),Y=document.getElementById("kit-import-mode-copy");if(!m||!u||!g||!h||!f||!z||!M||!W||!Q||!A||!mt||!Y)return;mt.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),Y.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),u.value=e.search,e.mode==="import"?(m.textContent=`Importa una sezione esistente dentro "${o.nome}".`,u.placeholder="Cerca kit sorgente\u2026",g.textContent="Kit sorgente",h.textContent=a?`Sezioni di ${a.nome}`:"Sezione",M.style.display="none",f.innerHTML=l.length?l.map(k=>{let w=k.id===e.sourceKitId;return`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${w?"checked":""}
                           onchange="_kitCfgSelectImportSource('${r(k.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(k.nome)}</span>
                        <span class="kit-import-option-meta">${(k.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(m.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,u.placeholder="Cerca kit destinazione\u2026",g.textContent="Kit sorgente",h.textContent="Sezione da copiare",M.style.display="flex",f.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${r(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,W.innerHTML=p.length?p.map(k=>{let w=(e.targetKitIds||[]).includes(k.id),x=d?kt(o,k):null,O=`${(k.sezioni||[]).length} sezioni`;return x&&(x.hasTargetVarianti?x.needsReview?O=`${x.exactMatches}/${x.targetCount} combinazioni allineate`:O=`${x.targetCount}/${x.targetCount} combinazioni allineate`:O="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${w?"kit-import-option--active":""}">
                    <input type="checkbox" ${w?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${r(k.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(k.nome)}</span>
                        <span class="kit-import-option-meta">${r(O)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),z.innerHTML=c.length?c.map(k=>{let w=e.mode==="import-asse"?k.id===e.asseId:k.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${w?"kit-import-option--active":""}">
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
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let ot=!1,v="kit-cfg-help kit-import-preview",S="";if(e.mode==="import"){if(!a)S="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!d)S="Seleziona una sezione da importare nel kit corrente.";else{let k=kt(a,o);ot=!0,S=`La sezione <strong>${r(d.nome)}</strong> verr\xE0 importata in <strong>${r(o.nome)}</strong>. `,k.hasTargetVarianti?k.needsReview?(v="kit-cfg-warn kit-import-preview",S+=`${k.exactMatches} combinazioni su ${k.targetCount} risultano allineate: controlla i coefficienti importati.`):S+=`Tutte le ${k.targetCount} combinazioni del kit destinazione risultano allineate.`:(v="kit-cfg-warn kit-import-preview",S+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}A.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")a?d?(ot=!0,S=`L'asse <strong>${r(d.nome)}</strong> verr\xE0 importato in <strong>${r(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):S="Seleziona un asse da importare nel kit corrente.":S="Seleziona un kit sorgente per vedere gli assi disponibili.",A.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let k=n.filter(w=>(e.targetKitIds||[]).includes(w.id));if(!d)S="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!k.length)S="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{ot=!0;let w=k.filter(x=>kt(o,x).needsReview).length;S=`La sezione <strong>${r(d.nome)}</strong> verr\xE0 copiata in <strong>${k.length}</strong> kit.`,w>0?(v="kit-cfg-warn kit-import-preview",S+=` <strong>${w}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):S+=" Le combinazioni risultano allineate su tutti i kit selezionati."}A.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}Q.className=v,Q.innerHTML=S,A.disabled=!ot,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let k=document.getElementById("kit-import-search");k&&k.focus()},40))}function Nn(){if(!C)return;let{kits:t}=y(),i=C,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Nt(e,i.sectionId),s=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!s){b("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(m=>String(m.nome||"").trim().toLowerCase()===String(s.nome||"").trim().toLowerCase()),p=0;if(l){l.opzioni=l.opzioni||[];for(let m of s.opzioni||[]){let u=String(m.codice||"").trim().toLowerCase(),g=!1;if(u&&(g=l.opzioni.some(h=>String(h.codice||"").trim().toLowerCase()===u&&u!=="")),g||(g=l.opzioni.some(h=>String(h.nome||"").trim().toLowerCase()===String(m.nome||"").trim().toLowerCase())),!g){let h=(l.opzioni||[]).length+1;l.opzioni.push({id:_(),key:U(m?.key,"opz"+h),nome:String(m?.nome||"").trim()||"opz"+h,codice:String(m?.codice||"").trim()}),p+=1}}I(t),at(),P(),p?b(`${p} opzione${p>1?"i":""} aggiunta${p>1?"e":""} all'asse "${s.nome}" \u2713`):b(`Nessuna nuova opzione trovata per l'asse "${s.nome}"`);return}n.assiConfigurazione.push(si(s,e,n)),I(t),at(),P(),b(`Asse "${s.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=kt(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(ht(o,e,n)),I(t),at(),P();let p="";l.hasTargetVarianti?l.needsReview&&(p=" Controlla le quantit\xE0 sulle combinazioni non allineate."):p=" Definisci poi gli assi del kit per rifinire i coefficienti.",b(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${p}`);return}let a=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!a.length){b("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let c=0;for(let l of a)kt(e,l).needsReview&&(c+=1),l.sezioni=l.sezioni||[],l.sezioni.push(ht(o,e,l));I(t),at(),P();let d="";c>0&&(d=` ${c} kit richiedono un controllo delle quantit\xE0.`),b(`Sezione "${o.nome}" copiata in ${a.length} kit \u2713${d}`)}function Dn(t){let{kits:i}=y(),n=i.find(e=>e.id===t)||null;E={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},pt(!0)}function Ni(){let t=document.getElementById("modal-kit-presets");E=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ln(t){E&&(E.search=String(t||""),pt())}function Kn(t){E&&(E.selectedPresetId=t,pt())}function Pn(){if(!E)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){b("Inserisci il nome del preset \u26A0\uFE0F");return}let e=i?.value||"";Di(E.currentKitId,e,n)}function Di(t,i,n){let{kits:e}=y(),o=e.find(c=>c.id===t);if(!o){b("Kit non trovato \u26A0\uFE0F");return}let s=Nt(o,i);if(!s){b("Seleziona una sezione valida \u26A0\uFE0F");return}let a=ct();a.push({id:_(),nome:String(n||"").trim(),sourceKitId:o.id,sezione:JSON.parse(JSON.stringify(s))}),Pt(a),b("Preset salvato \u2713"),E&&E.currentKitId===t&&pt(),P()}function Rn(t){if(!E)return;let i=ct(),n=t||E.selectedPresetId,e=i.find(c=>c.id===n);if(!e){b("Seleziona un preset \u26A0\uFE0F");return}let{kits:o}=y(),s=o.find(c=>c.id===E.currentKitId),a=o.find(c=>c.id===e.sourceKitId)||null;if(!s){b("Kit non trovato \u26A0\uFE0F");return}s.sezioni=s.sezioni||[],s.sezioni.push(ht(e.sezione,a,s)),I(o),Ni(),P(),b(`Preset "${e.nome}" applicato \u2713`)}function Hn(t,i){let n=ct(),e=n.find(o=>o.id===t);if(!e){b("Preset non trovato \u26A0\uFE0F");return}e.nome=String(i||"").trim()||e.nome,Pt(n),b("Nome aggiornato \u2713"),pt()}function jn(t){let i=ct().filter(n=>n.id!==t);Pt(i),E&&(E.selectedPresetId=""),pt(),b("Preset eliminato \u2713")}function pt(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!E)return;let n=ct(),e=E,o=y().kits.find(u=>u.id===e.currentKitId),s=n.filter(u=>zt(u.nome,e.search)),a=document.getElementById("preset-list"),c=document.getElementById("preset-preview"),d=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),p=document.getElementById("preset-apply-btn");if(!a||!c||!d||!l||!p)return;a.innerHTML=s.length?s.map(u=>{let g=u.id===e.selectedPresetId;return`<label class="kit-import-option ${g?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${g?"checked":""} onchange="_kitSelectPreset('${r(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let m=n.find(u=>u.id===e.selectedPresetId)||null;if(m){let u=m.sourceKitId&&y().kits.find(g=>g.id===m.sourceKitId)?.nome||"";c.innerHTML=`<div style="padding:6px"><strong>${r(m.nome)}</strong><div style="color:#94a3b8">${r(u)}</div></div>`+(m.sezione?.componenti?.length?`<div>${m.sezione.componenti.map(g=>`<div class="kit-meta-pill">${r(g.nome)}${g.codice?" \xB7 "+r(g.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else c.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;p.disabled=!m,d.value="",l.innerHTML=(o?.sezioni||[]).map(u=>`<option value="${r(u.id)}">${r(u.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("preset-search");u&&u.focus()},40))}function Qn(){let{kits:t}=y(),i=t.find(v=>v.id===Ii);if(!i){lt();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=B(i);tt==="sezioni"&&(tt="bom"),tt==="sa"&&(tt="bom");let s=["info","varianti","anagrafiche","bom"],a={info:"Prodotto",varianti:"Elettronica selezionabile",anagrafiche:"Anagrafiche",bom:"Parti del prodotto"},c=e.length,d=o.length,l=(i.sezioni||[]).reduce((v,S)=>v+(S.componenti||[]).length,0),p=d?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-bolt"></i>
                <div><strong>${c}</strong> grupp${c===1?"o":"i"} elettronici e <strong>${d}</strong> configurazioni pronte da usare</div>
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
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>',m=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${r(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${r(i.id)}',this.value)">
        </div>
        ${p}
        <div class="kit-cfg-danger">
            <button type="button" class="kit-cfg-add-btn" onclick="_kitDuplicaKit('${r(i.id)}')"><i class="fas fa-clone"></i> Duplica kit</button>
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${r(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,u=e.map((v,S)=>{let k=(v.opzioni||[]).map((w,x)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${r(w.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(w.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${r(w.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(w.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${r(i.id)}','${r(v.id)}','${r(w.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${S}">
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
            ${u||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportAsseModal('${r(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenPresetsModal('${r(i.id)}')"><i class="fas fa-bookmark"></i> Sezioni fisse</button>
            ${g}
        </div>`,f=(i.sezioni||[]).map((v,S)=>{let k=(v.componenti||[]).map(w=>{let x=K(w),O=Lt(w,i),Ft=(e||[]).find(q=>q.id===O.asseId)||null,Ki=O.tipo==="gruppo"&&Ft?`<div class="kit-cfg-row">${(Ft.opzioni||[]).map(q=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${O.opzioneIds.includes(q.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${r(i.id)}','${r(v.id)}','${r(w.id)}','${r(q.id)}',this.checked)">
                        ${r(q.nome)}
                    </label>`).join("")}</div>`:"",Pi=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(w.id)}','asseId',this.value)">
                        ${e.map(q=>`<option value="${r(q.id)}" ${O.asseId===q.id?"selected":""}>${r(q.nome)}</option>`).join("")}
                   </select>`:"",Ri=O.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",Gt=x?"flag":vt(w.unitaMisura,"pz"),Hi=x?[{value:"flag",label:"Solo avviso"}]:[...new Set([Gt,...Gi])].filter(Boolean).map(q=>({value:q,label:q}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${r(w.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${r(w.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','modo','',this.value)">
                        <option value="quantificato" ${x?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${x?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${r(i.id)}','${r(v.id)}','${r(w.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${O.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(w.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','unitaMisura','',this.value)"
                            ${x?"disabled":""}>
                        ${Hi.map(q=>`<option value="${r(q.value)}" ${Gt===q.value?"selected":""}>${r(q.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(w.id)}','tipo',this.value)">
                        <option value="sempre" ${O.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${O.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${O.tipo==="gruppo"?Pi:""}
                </div>
                ${O.tipo==="gruppo"?Ki:""}
                <input class="kit-cfg-input" value="${r(w.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(w.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${x?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Ri}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${S}">
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
        </div>`,M="";o.length?M=o.map(v=>{let S=(i.sottoAssembly||[]).map((w,x)=>({sa:w,i:x})).filter(({sa:w})=>w.varianteKey===v.key),k=S.map(({sa:w,i:x})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${r(w.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${r(i.id)}',${x},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${r(i.id)}',${x})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${r(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${S.length} part${S.length!==1?"i":"e"}</span>
                </div>
                ${k||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${r(i.id)}','${r(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${r(v.nome)}</button>
            </div>`}).join(""):M='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let W=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${M}
        </div>`,Q={info:m,varianti:h,bom:z,sa:W},A=ct(),Y=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${A.length?A.map(v=>`<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${r(v.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${r(v.sourceKitId&&y().kits.find(S=>S.id===v.sourceKitId)?.nome||"")}</div>
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
        </div>`;Q.anagrafiche=Y;let ot=s.map(v=>`<button class="kit-tab ${tt===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${a[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${r(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${r(i.nome)}</span>
        </div>
        <div class="kit-tabs">${ot}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${Q[tt]}</div>
    </div>`,ft(n)}function Vn(t){if(t&&T===t){R();return}T=t,R()}function Un(t){tt=t,Qn()}function $(t,i,n=!0){let{kits:e}=y(),o=e.find(s=>s.id===t);o&&(i(o),I(e),n&&P())}function Fn(t,i){$(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function Gn(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=y();I(i.filter(n=>n.id!==t)),Ii=null,T=null,lt()}function Jn(t){let{kits:i}=y(),n=i.find(o=>o.id===t);if(!n)return;let e={id:_(),nome:`Copia di ${n.nome}`,schemaVersion:Ot,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(si(o,n,e));e.varianti=ni(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(ht(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:_(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),I(i),Oi(e.id),b(`Kit "${n.nome}" duplicato \u2713`)}function Li(t){$(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:_(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:_(),key:"opz1",nome:"Opzione 1"}]})})}function Wn(t,i,n,e){$(t,function(o){let s=(o.assiConfigurazione||[]).find(a=>a.id===i);s&&(n==="key"?s.key=U(e,s.key||"asse"):s[n]=e.trim())})}function Yn(t,i){$(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function Zn(t,i){$(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:_(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function Xn(t,i,n,e,o){$(t,function(s){let a=(s.assiConfigurazione||[]).find(d=>d.id===i),c=a&&(a.opzioni||[]).find(d=>d.id===n);c&&(e==="key"?c.key=U(o,c.key||"opzione"):c[e]=o.trim())})}function to(t,i,n){$(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function io(t){Li(t)}function eo(t){$(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:_(),nome:"Nuova sezione",componenti:[]})})}function no(t){Ti(t)}function oo(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s[n]=e.trim())},!1)}function so(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&$(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function ao(t,i){$(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:_(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function ro(t,i,n,e,o,s){$(t,function(a){let c=(a.sezioni||[]).find(l=>l.id===i),d=c&&(c.componenti||[]).find(l=>l.id===n);if(d){if(e==="coeff"||e==="flag"){d.qtaPerVariante=d.qtaPerVariante||{},d.qtaPerVariante[o]=it(s);return}if(e==="modo"){d.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",d.modoComponente==="segnalazione"?(d.tracciabile=!1,d.unitaMisura="flag"):d.unitaMisura==="flag"&&(d.unitaMisura="pz");return}if(e==="unitaMisura"){d.unitaMisura=d.modoComponente==="segnalazione"?"flag":vt(s,"pz");return}d[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function co(t,i,n,e,o){$(t,function(s){let a=(s.sezioni||[]).find(l=>l.id===i),c=a&&(a.componenti||[]).find(l=>l.id===n);if(!c)return;let d=Lt(c,s);if(e==="tipo"){if(d.tipo=o==="gruppo"?"gruppo":"sempre",d.tipo==="gruppo"&&!d.asseId){d.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(p=>p.id===d.asseId);d.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")d.qtyBase=it(o);else if(e==="asseId"){d.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(p=>p.id===d.asseId);d.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],d.tipo="gruppo"}c.applicazioneTipo=d.tipo,c.applicazioneAsseId=d.asseId,c.applicazioneOpzioneIds=d.opzioneIds,c.qtaBase=d.qtyBase,c.qtaPerVariante=Tt(c,s,d)})}function lo(t,i,n,e,o){$(t,function(s){let a=(s.sezioni||[]).find(p=>p.id===i),c=a&&(a.componenti||[]).find(p=>p.id===n);if(!c)return;let d=Lt(c,s),l=new Set(d.opzioneIds||[]);o?l.add(e):l.delete(e),d.tipo="gruppo",d.opzioneIds=[...l],c.applicazioneTipo=d.tipo,c.applicazioneAsseId=d.asseId,c.applicazioneOpzioneIds=d.opzioneIds,c.qtaBase=d.qtyBase,c.qtaPerVariante=Tt(c,s,d)})}function po(t,i,n,e){$(t,function(o){let s=(o.sezioni||[]).find(c=>c.id===i),a=s&&(s.componenti||[]).find(c=>c.id===n);!a||K(a)||(a.tracciabile=!!e)},!1)}function mo(t,i,n){$(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function fo(t){$(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:_(),nome:"",varianteKey:B(i)[0]?.key||""})})}function uo(t,i){$(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:_(),nome:"",varianteKey:i,noteConfig:""})})}function go(t,i,n,e){$(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function ko(t,i){$(t,function(n){n.sottoAssembly.splice(i,1)})}function vo(t){let i=document.getElementById("modal-kit-distinta-edit");if(!i){yi(t);return}let{kits:n}=y(),e=n.find(d=>d.id===t);if(!e)return;let o=Z(e),s=F(o),a=document.getElementById("distinta-edit-nome"),c=document.getElementById("distinta-edit-documento");a&&(a.value=s.documento||""),c&&(c.value=s.documento||""),i.dataset.kitId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>a&&a.focus(),80)}function qt(){let t=document.getElementById("modal-kit-distinta-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function yo(){let t=document.getElementById("modal-kit-distinta-edit");if(!t)return;let i=t.dataset.kitId,n=(document.getElementById("distinta-edit-nome")?.value||"").trim(),e=(document.getElementById("distinta-edit-documento")?.value||"").trim();if(!n){b("Inserisci un nome per la distinta.","warning");return}j(i,function(p){let m=F(p);e?m.documento=e:m.documento||(m.documento=n),_t(p,m)});let{kits:o}=y(),s=o.find(p=>p.id===i);if(!s){qt(),b("Kit non trovato \u26A0\uFE0F");return}let a=Z(s),c=$t(s,a);if(!c.totalePezzi||!c.totaleRighe){b("Componi prima un ordine per generare la distinta stampabile.","warning");return}let d=nt(),l={id:_(),kitId:s.id,kitNome:s.nome,nome:n||a._meta?.documento||`Distinta-${Date.now()}`,documento:e||a._meta?.documento||"",createdAt:Date.now(),createdBy:V?.nome||"Sistema",orderDraftSnapshot:a,distintaSnapshot:c};d.unshift(l),Ct(d),qt(),b("Distinta salvata \u2713"),D==="distinte"&&N("distinte")}function So(){window._kitOpenView=Se,window._kitOpenConfig=Oi,window._kitNuovoKit=Sn,window._kitBack=Ie,window._kitOpenPrintPreview=ue,window._kitSwitchTab=xe,window._kitAggiornaQty=Ae,window._kitOrdineSet=Me,window._kitOrdineDelta=Ee,window._kitOrdineReset=qe,window._kitOrdineResetVoce=Be,window._kitOrderSearch=Oe,window._kitOrderHideSearch=Te,window._kitOrderPick=Ne,window._kitOrderRemoveRef=De,window._kitComposeSelect=Le,window._kitComposeAdd=Ke,window._kitAggiornaCar=zi,window._kitAggiornaPronti=Pe,window._kitSetPronti=Re,window._kitApriModalSped=Ge,window._kitChiudiModalSped=$i,window._kitConfermaSpedizione=Je,window._kitApriModalReso=We,window._kitChiudiModalReso=Si,window._kitResoQtyChange=Ye,window._kitResoAggiornaBOM=Ut,window._kitConfermaReso=Ze,window._kitSalvaMovimento=je,window._kitEliminaMovimento=Qe,window._kitModificaMovimento=Ue,window._kitChiudiModalEditMov=_i,window._kitConfermaModificaMov=Fe,window._kitChiudiModalDelMov=wi,window._kitConfermaEliminaMov=Ci,window._kitSalvaManuale=Xe,window._kitElimina=Gn,window._kitDuplicaKit=Jn,window._kitCfgBack=Vn,window._kitCfgSwitchTab=Un,window._kitCfgSaveNome=Fn,window._kitCfgAddVar=io,window._kitCfgOpenImportModal=Ti,window._kitCfgOpenImportAsseModal=In,window._kitCfgOpenCopySezModal=xn,window._kitCfgCloseImportModal=at,window._kitCfgSetImportMode=An,window._kitCfgSetImportSearch=Mn,window._kitCfgSelectImportSource=En,window._kitCfgSelectImportSection=qn,window._kitCfgToggleImportTarget=Bn,window._kitCfgSelectAllImportTargets=On,window._kitCfgClearImportTargets=Tn,window._kitCfgConfirmImport=Nn,window._kitOpenPresetsModal=Dn,window._kitClosePresetsModal=Ni,window._kitSetPresetsSearch=Ln,window._kitSelectPreset=Kn,window._kitCreatePresetFromSection=Pn,window._kitCreatePreset=Di,window._kitApplyPreset=Rn,window._kitRenamePreset=Hn,window._kitDeletePreset=jn,window._kitCfgAddAsse=Li,window._kitCfgUpdateAsse=Wn,window._kitCfgDelAsse=Yn,window._kitCfgAddOpzione=Zn,window._kitCfgUpdateOpzione=Xn,window._kitCfgDelOpzione=to,window._kitCfgAddSez=eo,window._kitCfgImportSez=no,window._kitCfgUpdateSez=oo,window._kitCfgDelSez=so,window._kitCfgAddComp=ao,window._kitCfgUpdateComp=ro,window._kitCfgUpdateCompRule=co,window._kitCfgToggleCompOption=lo,window._kitCfgToggleCompTracked=po,window._kitCfgDelComp=mo,window._kitCfgAddSA=fo,window._kitCfgAddSAForVariant=uo,window._kitCfgUpdateSA=go,window._kitCfgDelSA=ko,window._kitSwitchMainTab=N,window._kitRenderKitsGrid=gi,window._kitRenderAnagrafichePage=ki,window._kitRenderDistintePage=vi,window._kitLoadDistinte=nt,window._kitSaveDistinte=Ct,window._kitCreateDistintaFromDraft=yi,window._kitLoadAnagrafiche=G,window._kitSaveAnagrafiche=Vt,window._kitOpenAnagraficaModal=he,window._kitCloseAnagraficaModal=bi,window._kitConfirmSaveAnagrafica=ze,window._kitDeleteAnagrafica=we,window._kitOpenCreaKit=Ai,window._kitCloseCreaKit=Mi,window._kitConfirmCreaKit=kn,window._kitOpenConfigModal=xi,window._kitCloseConfigModal=tn,window._kitRenderConfigModal=P,window._kitCfgModalSaveNome=en,window._kitCfgModalAddAnag=sn,window._kitCfgModalAddCompFree=an,window._kitCfgModalUpdateSez=nn,window._kitCfgModalDelSez=on,window._kitCfgModalUpdateComp=rn,window._kitCfgModalUpdateCompRule=cn,window._kitCfgModalDelComp=dn,window._kitCfgModalAddAsse=ln,window._kitCfgModalDelAsse=pn,window._kitCfgModalUpdateAsse=mn,window._kitCfgModalAddOpz=fn,window._kitCfgModalDelOpz=un,window._kitCfgModalUpdateOpz=gn,window._kitQAddSezOpen=vn,window._kitQAddSezClose=Ei,window._kitQAddSezConfirm=yn,window._kitQAddCompOpen=bn,window._kitQAddCompToggleSource=Et,window._kitQAddCompChangeCategoria=qi,window._kitQAddCompClose=Bi,window._kitQAddCompConfirm=hn,window._kitQUpdateComp=zn,window._kitQRenomeSez=wn,window._kitQDelComp=Cn,window._kitQDelSez=_n,window._kitQDelKit=$n,window._kitRenderHeaderActions=Qt,window._kitOpenSaveDistintaModal=vo,window._kitCloseSaveDistintaModal=qt,window._kitConfirmSaveDistinta=yo,window._kitDistintaOpenPrint=Ce,window._kitDistintaApplyToDraft=_e,window._kitDistintaDelete=$e}var Bt,bt,Zt,Jt,Xt,Ot,Gi,ti,Ji,ii,Wi,Mt,X,ut,At,D,gt,Yt,T,hi,Ii,tt,C,E,rt,H,Io,bo=ji(()=>{Qi();Ui();Fi();Vi();Bt="_mlKitData",bt="_mlKitDataTs",Zt="_mlKitOrderDrafts",Jt="_mlKitOrderDraftSeq",Xt="_mlKitPresetSections",Ot=2,Gi=["pz","mt","cm","mm","kg","g","lt","ml"],ti="_mlKitDistinte",Ji="_mlKitDistinteTs",ii="_mlKitAnagrafiche",Wi="_mlKitAnagraficheTs",Mt=!1,X=[],ut=null,At={},D="kits";gt={};Yt=null;T=null,hi="ordine";Ii=null,tt="info",C=null,E=null,rt={kitId:null,sezId:null},H=null;Io=lt});bo();export{lt as caricaKitProdotti,Io as default,So as registerGlobals,$o as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-7VJWHS2X.js.map
