import{a as ai,c as ut,e as ri,f as r,g as S,h as et,l as ci,m as J,q as di,r as ft,u as li}from"./chunk-chunk-55SFP7PR.js";function Xe(){kt=!1}function V(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function F(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function Y(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function pt(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function mi(t,i){let n="opz"+(i+1),e=V(t?.key,n);return{id:String(t?.id||$()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function ui(t,i){let n="asse"+(i+1),e=V(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,a)=>mi(s,a)).filter(Boolean):[];return{id:String(t?.id||$()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function Tt(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function fi(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function Kt(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let a of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:a.id,opzioneKey:a.key,opzioneNome:a.nome,opzioneCodice:String(a.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:Tt(e.selections),nome:fi(e.selections),selections:e.selections}})}function gi(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||$()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:pt(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:F(t?.qtaBase)}}function ki(t){return{id:String(t?.id||$()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(gi):[]}}function vi(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function Lt(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:F(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||F(Object.values(t?.qtaPerVariante||{})[0])};let e=x(i);if(!e.length)return n;let o=e.filter(c=>E(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>E(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>E(t,c.key)))};let a=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:a};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let m of c.opzioni||[]){let k=new Set(e.filter(b=>(b.selections||[]).some(f=>f.asseId===c.id&&f.opzioneId===m.id)).map(b=>b.key));if(!k.size)continue;[...k].every(b=>E(t,b)===a)&&l.push(m.id)}if(!l.length)continue;let p=new Set(e.filter(m=>(m.selections||[]).some(k=>k.asseId===c.id&&l.includes(k.opzioneId))).map(m=>m.key));if(vi(p,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:a}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:a}}function zt(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=F(n.qtyBase);if(!o)return e;for(let s of x(i)){let a=n.tipo==="sempre";n.tipo==="gruppo"&&(a=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),a&&(e[s.key]=o)}return e}function bi(t,i){let n=ki(t);return n.componenti=n.componenti.map(function(e){let o=Lt(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:zt(e,i,o)}}),n}function yi(t,i){let n=x(i);if(!n.length)return null;let e=null;for(let o of n){let s=E(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function hi(t,i,n){let e=x(n),o={},s=yi(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let a of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},a.key)?E(t,a.key):s!==null?s:0;c>0&&(o[a.key]=c)}return{id:$(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:wt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:pt(t?.unitaMisura,N(t)?"flag":"pz")}}function vt(t,i,n){return{id:$(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>hi(e,i,n)):[]}}function Rt(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=V(t?.key||String(t?.nome||"asse"),"asse1"),s=o,a=1;for(;e.has(s);)s=o+"_c"+a++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],p="opz"+(c+1),m=V(l?.key,p),k=1;for(;d.some(g=>g.key===m);)m=m+"_c"+k++;d.push({id:$(),key:m,nome:String(l?.nome||"").trim()||m,codice:String(l?.codice||"").trim()})}return{id:$(),key:s,nome:String(t?.nome||"").trim()||s,opzioni:d}}function Pt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function st(t,i){let n=new Set(x(t).map(s=>s.key)),e=x(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function bt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function zi(t,i){return{id:String(t?.id||$()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function Dt(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(m,k){let g="v"+(k+1),b=V(m?.key,g);return{id:String(m?.id||$()),key:b,nome:String(m?.nome||b).trim()||b}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((m,k)=>ui(m,k)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(m){return{id:m.id,key:m.key,nome:m.nome}})}]:[],s=Kt(o),a=s.length?s:n,d=new Set(a.map(m=>m.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(m){d.has(m[0])&&(c[m[0]]=Math.max(0,Number.parseInt(m[1],10)||0))});for(let m of a)c[m.key]===void 0&&(c[m.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(m=>zi(m,a[0]?.key||"")).filter(m=>!m.varianteKey||d.has(m.varianteKey)):[],p={};return Object.entries(i.pronti||{}).forEach(function(m){p[m[0]]=Math.max(0,Number.parseInt(m[1],10)||0)}),{id:String(i.id||$()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:ht,assiConfigurazione:o,varianti:a,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(m=>bi(m,{assiConfigurazione:o,varianti:a})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:p,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function x(t){return Array.isArray(t?.varianti)?t.varianti:[]}function N(t){return!!t&&t.modoComponente==="segnalazione"}function wt(t){return!!t&&t.tracciabile!==!1&&!N(t)}function E(t,i){let n=F(t?.qtaPerVariante?.[i]);return N(t)?n>0?1:0:n}function Ct(t,i){return Lt(t,i)}function Vt(){try{let t=localStorage.getItem(Bt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function wi(t){try{localStorage.setItem(Bt,JSON.stringify(t||{}))}catch{}}function Z(t){return String(t||"").trim().toUpperCase()}function at(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(Z).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function X(t){return at(t?._meta||{})}function $t(t,i){return t._meta=at(i),t._meta}function Q(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function Ht(){let t=1;try{t=(Number.parseInt(localStorage.getItem(qt),10)||0)+1,localStorage.setItem(qt,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function Ci(t){let i=X(t);return i.documento||(i.documento=Ht(),$t(t,i)),i.documento}function Et(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:Z(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function jt(){return j.length?Promise.resolve(j):Array.isArray(window._attiviProd)&&window._attiviProd.length?(j=Et(window._attiviProd),Promise.resolve(j)):nt||(nt=fetch(ut,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(j=Et(t),j)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){nt=null}),nt)}function $i(t){let i=Z(t);return i&&j.find(n=>n.ordine===i)||null}function Ut(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=Z(e);return o?i[o]?String(i[o]||"").trim():String($i(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function dt(t){let i=Vt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of x(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=at(n._meta||{}),e}function P(t,i){let{kits:n}=w(),e=n.find(p=>p.id===t);if(!e)return;let o=Vt(),s=dt(e);i(s,e);let a={},d=!1;for(let p of x(e)){let m=Math.max(0,Number.parseInt(s[p.key],10)||0);a[p.key]=m,m>0&&(d=!0)}let c=at(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(c.documento||(c.documento=Ht()),a._meta=c),d||l?o[t]=a:delete o[t],wi(o),O===t&&K()}function _i(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function _t(t){let i=ot[t.id]&&typeof ot[t.id]=="object"?ot[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return ot[t.id]=n,n}function Ft(t,i){let n=t.assiConfigurazione||[];if(!n.length)return x(t)[0]||null;let e=[];for(let s of n){let a=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===a);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=Tt(e);return x(t).find(s=>s.key===o)||null}function Si(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function Ii(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let a of s.componenti||[])if(!N(a)&&!(E(a,i.key)<=0)&&a.applicazioneTipo==="gruppo"&&String(a.applicazioneAsseId||"")===e&&Array.isArray(a.applicazioneOpzioneIds)&&a.applicazioneOpzioneIds.includes(o))return!0;return!1}function xi(t,i,n){let e=[],o=new Map;for(let s of i){let a=Q(n,s.key);if(a)for(let d of s.selections||[]){if(Ii(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=a;continue}let p={id:"sel-"+c,nome:Si(d),codice:String(d?.opzioneCodice||"").trim(),totale:a,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,p),e.push(p)}}return e}function Qt(t,i){let n=x(t).filter(a=>Q(i,a.key)>0),e=[],o=[],s=xi(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let a of t.sezioni||[]){let d=[];for(let c of a.componenti||[]){let l=0,p=[];for(let k of n){let g=Q(i,k.key),b=E(c,k.key);!g||!b||(N(c)?l+=g:l+=g*b,p.push({nome:k.nome,pezziOrdine:g,coeff:b}))}if(!p.length)continue;let m=p.length===1?p[0].nome:p.length+" configurazioni";if(N(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:m});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:m})}d.length&&e.push({id:a.id,nome:a.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:_i(i),totaleRighe:e.reduce((a,d)=>a+d.righe.length,0)}}function Ai(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function Mi(){return String(window._distintaHeaderAzienda||"").trim()}function Oi(t,i,n){let e=new Date,o=X(n),s=Mi(),a=String(o.documento||"").trim(),d=s?s.split(/\r?\n/).map(g=>`<div>${r(g)}</div>`).join(""):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),p=i.selectedVarianti.length?i.selectedVarianti.map(g=>{let b=Q(n,g.key);return`<tr>
                <td>${r(Y(b))}</td>
                <td>${r(g.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',m=i.sezioni.map(g=>{let b=g.righe.map(f=>{let z=[f.dettaglio,f.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${r(String(f.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${r(f.nome)}</div></td>
                <td class="db-print-cell-unit">${r(f.unita)}</td>
                <td class="db-print-cell-qty">${r(Y(f.totale))}</td>
                <td class="db-print-cell-note">${z?r(z):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${r(g.nome)}</td></tr>${b}`}).join(""),k=i.avvisi.length?i.avvisi.map(g=>`<div class="db-print-alert ${g.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${r(g.nome)}</div>
                <div>${r(g.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${r(Y(g.totaleCoinvolto))} pz \xB7 ${r(g.variantiLabel)}</div>
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
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${r(Ai(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${r(J?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${r(Y(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${r(Y(i.totaleRighe))}</div></div>
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
                <tbody>${m}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${k}</div>
        </div>
    </div>
</body>
</html>`}function qi(t){let{kits:i}=w(),n=i.find(a=>a.id===t);if(!n)return;let e=dt(n),o=Qt(n,e);if(!o.totalePezzi||!o.totaleRighe){S("Componi prima un ordine per generare la distinta stampabile.","warning");return}X(e).documento||(P(t,function(a){Ci(a)}),e=dt(n));let s=window.open("","_blank");if(!s){S("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(Oi(n,o,e)),s.document.close(),s.focus()}function w(){try{let t=localStorage.getItem(yt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(Dt):[]}}catch{return{kits:[]}}}function M(t){let i=Array.isArray(t)?t.map(Dt):[];try{localStorage.setItem(yt,JSON.stringify({kits:i})),localStorage.setItem(ct,Date.now())}catch{}Ei(i)}function Ei(t){clearTimeout(Nt),Nt=setTimeout(function(){ft({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function Ni(t){fetch(ut,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(ct)||0);if(n>0&&n>e){try{localStorage.setItem(yt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(ct,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function $(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function St(){if(!J||!J.nome)return!1;let t=String(J.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||J.ruolo==="MASTER"}function Bi(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(N(e)){i[e.id]=0;continue}let o=0;for(let[s,a]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(a,10)||0)*E(e,s);i[e.id]=o}return i}function Ti(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let a of s.componenti||[]){if(N(a))continue;let d=E(a,o);d>0&&(i[a.id]=(i[a.id]||0)+e*d)}}return i}function Gt(t,i){let n=x(t).find(e=>e.key===i);return n?r(n.nome):r(i)}function It(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function tt(){kt||(kt=!0,Ni(function(e){e&&tt()}));let{kits:t}=w(),i=document.getElementById("contenitore-dati"),n=t.map(e=>{let s=x(e).length,a=(e.assiConfigurazione||[]).length,d=(e.sezioni||[]).reduce((c,l)=>c+(l.componenti||[]).length,0);return`
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
    </div>`;try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else et(i)}catch{et(i)}}function Ki(t){O=t,Jt="ordine",K()}function K(){let{kits:t}=w(),i=t.find(f=>f.id===O);if(!i){tt();return}let n=document.getElementById("contenitore-dati"),e=x(i),o=dt(i),s=X(o),a=Qt(i,o),d=a.selectedVarianti.length?a.selectedVarianti.map(f=>`<span class="kit-meta-pill"><strong>${Q(o,f.key)}</strong> \xD7 ${r(f.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=s.ordiniCliente.length?s.ordiniCliente.map(f=>`<span class="kit-order-ref-chip">${r(f)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(f)})' aria-label="Rimuovi ordine ${r(f)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=_t(i),p=Ft(i,l),m=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(f=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${r(f.nome)}</div>
                <div class="kit-compose-options">${(f.opzioni||[]).map(z=>`
                        <button type="button" class="kit-compose-option ${l[f.id]===z.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${r(i.id)}','${r(f.id)}','${r(z.id)}')">
                        ${r(z.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',k=a.selectedVarianti.length?a.selectedVarianti.map(f=>{let z=Q(o,f.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${r(f.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(f.selections)&&f.selections.length?f.selections.map(B=>r(B.opzioneNome)).join(" \xB7 "):r(f.key)}</div>
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
                        <div class="kit-distinta-row-qty">${Y(z.totale)} ${r(z.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,b=a.avvisi.length?a.avvisi.map(f=>`
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
    </div>`,et(n),jt().catch(()=>{})}function Li(){O=null,tt()}function Ri(t){Jt=t,K()}function Pi(t){P(t,function(i,n){for(let e of x(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function Di(t,i,n){try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function Vi(t,i,n){try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function Hi(t){P(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=at({})})}function ji(t,i){P(t,function(n){n[i]=0})}function lt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${r(e.ordine)}</span>
            <span class="ac-cliente">${r(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function Ui(t,i){let n=String(i||"").trim().toLowerCase();if(!n){lt(t,[]);return}jt().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);lt(t,o)})}function Fi(t){setTimeout(function(){lt(t,[])},140)}function Qi(t,i,n){let e=Z(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}P(t,function(s){let a=X(s);a.ordiniCliente=[...new Set(a.ordiniCliente.concat(e))],a.cliente=Ut(a.ordiniCliente,{[e]:n}),$t(s,a)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),lt(t,[])}function Gi(t,i){let n=Z(i);try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){let o=X(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=Ut(o.ordiniCliente),$t(e,o)})}function Ji(t,i,n){let{kits:e}=w(),o=e.find(a=>a.id===t);if(!o)return;let s=_t(o);if(s[i]=n,ot[t]=s,O===t){try{window._kitSuppressNextFade=!0}catch{}K()}}function Yi(t){let{kits:i}=w(),n=i.find(a=>a.id===t);if(!n)return;let e=Ft(n,_t(n));if(!e){S("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){S("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(gt[t])return;gt[t]=Date.now(),setTimeout(function(){try{delete gt[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}P(t,function(a){a[e.key]=Q(a,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function Yt(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=w(),s=o.find(z=>z.id===O);if(!s)return;let a=(s.sezioni||[]).find(z=>z.id===n),d=a&&(a.componenti||[]).find(z=>z.id===i);if(!d||!wt(d))return;d.caricato=e,M(o);let l=Bi(s)[i]||0,p=Math.max(0,l-e),k=Ti(s)[i]||0,g=t.closest("tr");if(!g)return;let b=g.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");b&&(b.textContent=l===0?"\u2014":p,b.className=l===0?"kit-ord-zero":p>0?"kit-ord-manca":"kit-ord-ok");let f=g.querySelector(".kit-car-liberi");f&&(k>0?(f.textContent=Math.max(0,e-k)+" lib.",f.style.display=""):f.style.display="none")}function Wi(t,i,n){let{kits:e}=w(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),M(e),O===t&&K())}function Zi(t,i,n){let{kits:e}=w(),o=e.find(a=>a.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),M(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function Xi(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${r(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${r(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let a=(e.righe||[]).reduce((l,p)=>l+p.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${r(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${r(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
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
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function te(t,i){let{kits:n}=w(),e=n.find(f=>f.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),a=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),p=(a?.value||"").trim(),m=(e.sezioni||[]).find(f=>f.id===c),k=m&&(m.componenti||[]).find(f=>f.id===d);if(!k||!wt(k))return;i==="carico"?k.caricato=(parseInt(k.caricato)||0)+l:k.caricato=Math.max(0,(parseInt(k.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:p,mat:k.nome,ts:It()}),M(n),s&&(s.value=1),a&&(a.value="");let g=document.getElementById("kit-mov-list-"+t);g&&(g.innerHTML=Xi(e,St()));let b=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);b&&(b.value=k.caricato,Yt(b))}function ie(t,i){if(!St())return;let{kits:n}=w(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&ee(t,i,o)}function ee(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${r(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${r(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let a=document.getElementById("btn-kit-del-ok");a&&(a.onclick=()=>Zt(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function Wt(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Zt(t,i){Wt();let{kits:n}=w(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(a=>a.id===o.sid);for(let a of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===a.cid||l.nome===a.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+a.qty)}for(let a of o.items||[])a.saId&&e.pronti&&(e.pronti[a.saId]=(parseInt(e.pronti[a.saId])||0)+a.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let a of e.sezioni||[]){let d=(a.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(d=>d.id===o.cid);a&&(a.caricato=Math.max(0,(parseInt(a.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(d=>d.id===o.cid);a&&(a.caricato=(parseInt(a.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),M(n),O===t&&K(),S("Movimento eliminato \u2713")}}function ne(t,i){if(!St())return;let{kits:n}=w(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let a=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");a&&(a.innerHTML=`<span class="kit-mov-badge ${r(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${r(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function Xt(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function oe(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);Xt();let{kits:e}=w(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let a=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){S("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==a.qty){let l=d-a.qty;for(let p of o.sezioni||[]){let m=(p.componenti||[]).find(k=>k.id===a.cid);if(m){a.tipo==="carico"?m.caricato=Math.max(0,(parseInt(m.caricato)||0)+l):m.caricato=Math.max(0,(parseInt(m.caricato)||0)-l);break}}}o.movimenti[s]={...a,qty:d,nota:c},M(e),O===i&&K(),S("Movimento aggiornato \u2713")}function se(t){let{kits:i}=w(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){S("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,p=Gt(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${r(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${r(c.nome)} <span class="kit-sped-var-pill">${p}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let a=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&a&&(d.value=a.value||""),d&&!a&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function ti(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ae(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;ti();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=w(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),a=[],d=[];for(let l of n){let p=(o.sottoAssembly||[]).find(k=>k.id===l);if(!p)continue;let m=Number.parseInt(o.pronti?.[l],10)||0;if(m){a.push({saId:l,nome:p.nome,qty:m});for(let k of o.sezioni||[])for(let g of k.componenti||[]){if(N(g))continue;let b=E(g,p.varianteKey);if(!b)continue;let f=m*b;g.caricato=Math.max(0,(parseInt(g.caricato)||0)-f);let z=d.find(B=>B.cid===g.id);z?z.qty+=f:d.push({cid:g.id,mat:g.nome,qty:f})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:a,righe:d,nota:s,ts:It()}),M(e);let c=a.reduce((l,p)=>l+p.qty,0);S(`Spedizione registrata: ${c} pz \u2713`),O===i&&K()}function re(t){let{kits:i}=w(),n=i.find(a=>a.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let a=n.sottoAssembly||[];o.innerHTML=a.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':a.map(d=>{let c=Gt(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${r(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${r(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${r(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),xt(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function ii(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function ce(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&xt(e.dataset.kitId)}function xt(t){let{kits:i}=w(),n=i.find(a=>a.id===t);if(!n)return;let e={};for(let a of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+a.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let p of l.componenti||[]){if(N(p))continue;let m=E(p,a.varianteKey);m&&(e[p.id]={mat:p.nome,qty:(e[p.id]?.qty||0)+c*m})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,a])=>a.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([a,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${r(a)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${r(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function de(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=w(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let p=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;p>0&&o.push({saId:l.id,nome:l.nome,qty:p})}if(!o.length){S("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],a=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let p=l.dataset.cid,m=Number.parseInt(l.dataset.qty,10),k=[...e.sezioni||[]].flatMap(g=>g.componenti||[]).find(g=>g.id===p)?.nome||"?";l.checked?s.push({cid:p,mat:k,qty:m}):a.push({cid:p,mat:k,qty:m})});for(let l of s)for(let p of e.sezioni||[]){let m=(p.componenti||[]).find(k=>k.id===l.cid);if(m){m.caricato=(parseInt(m.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,p)=>l+p.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:a,nota:d,ts:It(),totPz:c}),M(n),ii(),S(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),O===i&&K()}function le(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=w();ft({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(ct,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function pe(){let{kits:t}=w(),i={id:$(),nome:"Nuovo Kit",schemaVersion:ht,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};t.push(i),M(t),Mt(i.id)}function Mt(t){At=t,D="info",U()}function mt(t,i,n=""){let{kits:e}=w(),o=e.find(c=>c.id===t),s=e.find(c=>c.id!==t&&(c.sezioni||[]).length),a=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?a:s?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function ei(t){y=mt(t,"import"),R(!0)}function me(t){y=mt(t,"import-asse"),R(!0)}function ue(t,i){y=mt(t,"copy",i),R(!0)}function W(){let t=document.getElementById("modal-kit-import");y=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function fe(t){if(!y||t!=="import"&&t!=="copy"||y.mode===t)return;let i=y.currentKitId,n=t==="copy"?y.sectionId:"";y=mt(i,t,n),R()}function ge(t){y&&(y.search=String(t||""),R())}function ke(t){if(!y)return;let{kits:i}=w(),n=i.find(e=>e.id===t);y.sourceKitId=t,y.mode==="import-asse"?y.asseId=n?.assiConfigurazione?.[0]?.id||"":y.sectionId=n?.sezioni?.[0]?.id||"",R()}function ve(t){y&&(y.mode==="import-asse"?y.asseId=t:y.sectionId=t,R())}function be(t,i){if(!y||y.mode!=="copy")return;let n=new Set(y.targetKitIds||[]);i?n.add(t):n.delete(t),y.targetKitIds=[...n],R()}function ye(){if(!y||y.mode!=="copy")return;let{kits:t}=w(),i=t.filter(e=>e.id!==y.currentKitId&&bt(e.nome,y.search)),n=new Set(y.targetKitIds||[]);for(let e of i)n.add(e.id);y.targetKitIds=[...n],R()}function he(){!y||y.mode!=="copy"||(y.targetKitIds=[],R())}function R(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!y)return;let{kits:n}=w(),e=y,o=n.find(u=>u.id===e.currentKitId);if(!o){W();return}let s=[];e.mode==="import"?s=n.filter(u=>u.id!==o.id&&(u.sezioni||[]).length):e.mode==="import-asse"?s=n.filter(u=>u.id!==o.id&&(u.assiConfigurazione||[]).length):s=n.filter(u=>u.id!==o.id&&(u.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!s.some(u=>u.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(u=>u!==o.id&&n.some(_=>_.id===u)));let a=n.find(u=>u.id===e.sourceKitId)||null,d=e.mode==="import-asse"?a?.assiConfigurazione||[]:a?.sezioni||[];e.mode==="import-asse"?d.some(u=>u.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(u=>u.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(a?.assiConfigurazione||[]).find(u=>u.id===e.asseId)||null:Pt(a,e.sectionId),l=s.filter(u=>bt(u.nome,e.search)),p=n.filter(u=>u.id!==o.id&&bt(u.nome,e.search)),m=document.getElementById("kit-import-subtitle"),k=document.getElementById("kit-import-search"),g=document.getElementById("kit-import-left-title"),b=document.getElementById("kit-import-right-title"),f=document.getElementById("kit-import-kit-list"),z=document.getElementById("kit-import-section-list"),B=document.getElementById("kit-import-target-wrap"),rt=document.getElementById("kit-import-target-list"),it=document.getElementById("kit-import-preview"),H=document.getElementById("kit-import-confirm-btn"),v=document.getElementById("kit-import-mode-import"),q=document.getElementById("kit-import-mode-copy");if(!m||!k||!g||!b||!f||!z||!B||!rt||!it||!H||!v||!q)return;v.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),q.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),k.value=e.search,e.mode==="import"?(m.textContent=`Importa una sezione esistente dentro "${o.nome}".`,k.placeholder="Cerca kit sorgente\u2026",g.textContent="Kit sorgente",b.textContent=a?`Sezioni di ${a.nome}`:"Sezione",B.style.display="none",f.innerHTML=l.length?l.map(u=>{let _=u.id===e.sourceKitId;return`<label class="kit-import-option ${_?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${_?"checked":""}
                           onchange="_kitCfgSelectImportSource('${r(u.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(u.nome)}</span>
                        <span class="kit-import-option-meta">${(u.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(m.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,k.placeholder="Cerca kit destinazione\u2026",g.textContent="Kit sorgente",b.textContent="Sezione da copiare",B.style.display="flex",f.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${r(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,rt.innerHTML=p.length?p.map(u=>{let _=(e.targetKitIds||[]).includes(u.id),T=c?st(o,u):null,G=`${(u.sezioni||[]).length} sezioni`;return T&&(T.hasTargetVarianti?T.needsReview?G=`${T.exactMatches}/${T.targetCount} combinazioni allineate`:G=`${T.targetCount}/${T.targetCount} combinazioni allineate`:G="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${_?"kit-import-option--active":""}">
                    <input type="checkbox" ${_?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${r(u.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(u.nome)}</span>
                        <span class="kit-import-option-meta">${r(G)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),z.innerHTML=d.length?d.map(u=>{let _=e.mode==="import-asse"?u.id===e.asseId:u.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${_?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${_?"checked":""}
                           onchange="_kitCfgSelectImportSection('${r(u.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(u.nome)}</span>
                        <span class="kit-import-option-meta">${(u.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${_?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${_?"checked":""}
                       onchange="_kitCfgSelectImportSection('${r(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let L=!1,h="kit-cfg-help kit-import-preview",C="";if(e.mode==="import"){if(!a)C="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)C="Seleziona una sezione da importare nel kit corrente.";else{let u=st(a,o);L=!0,C=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 importata in <strong>${r(o.nome)}</strong>. `,u.hasTargetVarianti?u.needsReview?(h="kit-cfg-warn kit-import-preview",C+=`${u.exactMatches} combinazioni su ${u.targetCount} risultano allineate: controlla i coefficienti importati.`):C+=`Tutte le ${u.targetCount} combinazioni del kit destinazione risultano allineate.`:(h="kit-cfg-warn kit-import-preview",C+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}H.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")a?c?(L=!0,C=`L'asse <strong>${r(c.nome)}</strong> verr\xE0 importato in <strong>${r(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):C="Seleziona un asse da importare nel kit corrente.":C="Seleziona un kit sorgente per vedere gli assi disponibili.",H.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let u=n.filter(_=>(e.targetKitIds||[]).includes(_.id));if(!c)C="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!u.length)C="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{L=!0;let _=u.filter(T=>st(o,T).needsReview).length;C=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 copiata in <strong>${u.length}</strong> kit.`,_>0?(h="kit-cfg-warn kit-import-preview",C+=` <strong>${_}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):C+=" Le combinazioni risultano allineate su tutti i kit selezionati."}H.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}it.className=h,it.innerHTML=C,H.disabled=!L,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("kit-import-search");u&&u.focus()},40))}function ze(){if(!y)return;let{kits:t}=w(),i=y,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Pt(e,i.sectionId),s=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!s){S("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(m=>String(m.nome||"").trim().toLowerCase()===String(s.nome||"").trim().toLowerCase()),p=0;if(l){l.opzioni=l.opzioni||[];for(let m of s.opzioni||[]){let k=String(m.codice||"").trim().toLowerCase(),g=!1;if(k&&(g=l.opzioni.some(b=>String(b.codice||"").trim().toLowerCase()===k&&k!=="")),g||(g=l.opzioni.some(b=>String(b.nome||"").trim().toLowerCase()===String(m.nome||"").trim().toLowerCase())),!g){let b=(l.opzioni||[]).length+1;l.opzioni.push({id:$(),key:V(m?.key,"opz"+b),nome:String(m?.nome||"").trim()||"opz"+b,codice:String(m?.codice||"").trim()}),p+=1}}M(t),W(),U(),p?S(`${p} opzione${p>1?"i":""} aggiunta${p>1?"e":""} all'asse "${s.nome}" \u2713`):S(`Nessuna nuova opzione trovata per l'asse "${s.nome}"`);return}n.assiConfigurazione.push(Rt(s,e,n)),M(t),W(),U(),S(`Asse "${s.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=st(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(vt(o,e,n)),M(t),W(),U();let p="";l.hasTargetVarianti?l.needsReview&&(p=" Controlla le quantit\xE0 sulle combinazioni non allineate."):p=" Definisci poi gli assi del kit per rifinire i coefficienti.",S(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${p}`);return}let a=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!a.length){S("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let d=0;for(let l of a)st(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(vt(o,e,l));M(t),W(),U();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xE0.`),S(`Sezione "${o.nome}" copiata in ${a.length} kit \u2713${c}`)}function U(){let{kits:t}=w(),i=t.find(v=>v.id===At);if(!i){tt();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=x(i);D==="sezioni"&&(D="bom"),D==="sa"&&(D="bom");let s=["info","varianti","bom"],a={info:"Prodotto",varianti:"Elettronica selezionabile",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,q)=>v+(q.componenti||[]).length,0),p=c?`
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
        </div>`,k=e.map((v,q)=>{let L=(v.opzioni||[]).map((h,C)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${r(h.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(h.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${r(h.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(h.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${r(i.id)}','${r(v.id)}','${r(h.id)}')"><i class="fas fa-times"></i></button>
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
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportAsseModal('${r(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            ${g}
        </div>`,f=(i.sezioni||[]).map((v,q)=>{let L=(v.componenti||[]).map(h=>{let C=N(h),u=Ct(h,i),_=(e||[]).find(A=>A.id===u.asseId)||null,T=u.tipo==="gruppo"&&_?`<div class="kit-cfg-row">${(_.opzioni||[]).map(A=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${u.opzioneIds.includes(A.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${r(i.id)}','${r(v.id)}','${r(h.id)}','${r(A.id)}',this.checked)">
                        ${r(A.nome)}
                    </label>`).join("")}</div>`:"",G=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(h.id)}','asseId',this.value)">
                        ${e.map(A=>`<option value="${r(A.id)}" ${u.asseId===A.id?"selected":""}>${r(A.nome)}</option>`).join("")}
                   </select>`:"",oi=u.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",Ot=C?"flag":pt(h.unitaMisura,"pz"),si=C?[{value:"flag",label:"Solo avviso"}]:[...new Set([Ot,...pi])].filter(Boolean).map(A=>({value:A,label:A}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${r(h.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(h.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${r(h.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(h.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(h.id)}','modo','',this.value)">
                        <option value="quantificato" ${C?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${C?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${r(i.id)}','${r(v.id)}','${r(h.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${u.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(h.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(h.id)}','unitaMisura','',this.value)"
                            ${C?"disabled":""}>
                        ${si.map(A=>`<option value="${r(A.value)}" ${Ot===A.value?"selected":""}>${r(A.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(h.id)}','tipo',this.value)">
                        <option value="sempre" ${u.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${u.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${u.tipo==="gruppo"?G:""}
                </div>
                ${u.tipo==="gruppo"?T:""}
                <input class="kit-cfg-input" value="${r(h.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(h.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${C?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${oi}
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
            ${f}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${r(i.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${r(i.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`,B="";o.length?B=o.map(v=>{let q=(i.sottoAssembly||[]).map((h,C)=>({sa:h,i:C})).filter(({sa:h})=>h.varianteKey===v.key),L=q.map(({sa:h,i:C})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${r(h.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${r(i.id)}',${C},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${r(i.id)}',${C})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${r(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${q.length} part${q.length!==1?"i":"e"}</span>
                </div>
                ${L||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${r(i.id)}','${r(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${r(v.nome)}</button>
            </div>`}).join(""):B='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let rt=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${B}
        </div>`,it={info:m,varianti:b,bom:z,sa:rt},H=s.map(v=>`<button class="kit-tab ${D===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${a[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${r(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${r(i.nome)}</span>
        </div>
        <div class="kit-tabs">${H}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${it[D]}</div>
    </div>`,et(n)}function we(t){if(t&&O===t){K();return}O=t,K()}function Ce(t){D=t,U()}function I(t,i,n=!0){let{kits:e}=w(),o=e.find(s=>s.id===t);o&&(i(o),M(e),n&&U())}function $e(t,i){I(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function _e(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=w();M(i.filter(n=>n.id!==t)),At=null,O=null,tt()}function Se(t){let{kits:i}=w(),n=i.find(o=>o.id===t);if(!n)return;let e={id:$(),nome:`Copia di ${n.nome}`,schemaVersion:ht,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(Rt(o,n,e));e.varianti=Kt(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(vt(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:$(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),M(i),Mt(e.id),S(`Kit "${n.nome}" duplicato \u2713`)}function ni(t){I(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:$(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:$(),key:"opz1",nome:"Opzione 1"}]})})}function Ie(t,i,n,e){I(t,function(o){let s=(o.assiConfigurazione||[]).find(a=>a.id===i);s&&(n==="key"?s.key=V(e,s.key||"asse"):s[n]=e.trim())})}function xe(t,i){I(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function Ae(t,i){I(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:$(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function Me(t,i,n,e,o){I(t,function(s){let a=(s.assiConfigurazione||[]).find(c=>c.id===i),d=a&&(a.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=V(o,d.key||"opzione"):d[e]=o.trim())})}function Oe(t,i,n){I(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function qe(t){ni(t)}function Ee(t){I(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:$(),nome:"Nuova sezione",componenti:[]})})}function Ne(t){ei(t)}function Be(t,i,n,e){I(t,function(o){let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s[n]=e.trim())},!1)}function Te(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&I(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function Ke(t,i){I(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:$(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function Le(t,i,n,e,o,s){I(t,function(a){let d=(a.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=F(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":pt(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function Re(t,i,n,e,o){I(t,function(s){let a=(s.sezioni||[]).find(l=>l.id===i),d=a&&(a.componenti||[]).find(l=>l.id===n);if(!d)return;let c=Ct(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(p=>p.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=F(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(p=>p.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=zt(d,s,c)})}function Pe(t,i,n,e,o){I(t,function(s){let a=(s.sezioni||[]).find(p=>p.id===i),d=a&&(a.componenti||[]).find(p=>p.id===n);if(!d)return;let c=Ct(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=zt(d,s,c)})}function De(t,i,n,e){I(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),a=s&&(s.componenti||[]).find(d=>d.id===n);!a||N(a)||(a.tracciabile=!!e)},!1)}function Ve(t,i,n){I(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function He(t){I(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:$(),nome:"",varianteKey:x(i)[0]?.key||""})})}function je(t,i){I(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:$(),nome:"",varianteKey:i,noteConfig:""})})}function Ue(t,i,n,e){I(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function Fe(t,i){I(t,function(n){n.sottoAssembly.splice(i,1)})}function tn(){window._kitOpenView=Ki,window._kitOpenConfig=Mt,window._kitNuovoKit=pe,window._kitBack=Li,window._kitOpenPrintPreview=qi,window._kitSwitchTab=Ri,window._kitAggiornaQty=Pi,window._kitOrdineSet=Di,window._kitOrdineDelta=Vi,window._kitOrdineReset=Hi,window._kitOrdineResetVoce=ji,window._kitOrderSearch=Ui,window._kitOrderHideSearch=Fi,window._kitOrderPick=Qi,window._kitOrderRemoveRef=Gi,window._kitComposeSelect=Ji,window._kitComposeAdd=Yi,window._kitAggiornaCar=Yt,window._kitAggiornaPronti=Wi,window._kitSetPronti=Zi,window._kitApriModalSped=se,window._kitChiudiModalSped=ti,window._kitConfermaSpedizione=ae,window._kitApriModalReso=re,window._kitChiudiModalReso=ii,window._kitResoQtyChange=ce,window._kitResoAggiornaBOM=xt,window._kitConfermaReso=de,window._kitSalvaMovimento=te,window._kitEliminaMovimento=ie,window._kitModificaMovimento=ne,window._kitChiudiModalEditMov=Xt,window._kitConfermaModificaMov=oe,window._kitChiudiModalDelMov=Wt,window._kitConfermaEliminaMov=Zt,window._kitSalvaManuale=le,window._kitElimina=_e,window._kitDuplicaKit=Se,window._kitCfgBack=we,window._kitCfgSwitchTab=Ce,window._kitCfgSaveNome=$e,window._kitCfgAddVar=qe,window._kitCfgOpenImportModal=ei,window._kitCfgOpenImportAsseModal=me,window._kitCfgOpenCopySezModal=ue,window._kitCfgCloseImportModal=W,window._kitCfgSetImportMode=fe,window._kitCfgSetImportSearch=ge,window._kitCfgSelectImportSource=ke,window._kitCfgSelectImportSection=ve,window._kitCfgToggleImportTarget=be,window._kitCfgSelectAllImportTargets=ye,window._kitCfgClearImportTargets=he,window._kitCfgConfirmImport=ze,window._kitCfgAddAsse=ni,window._kitCfgUpdateAsse=Ie,window._kitCfgDelAsse=xe,window._kitCfgAddOpzione=Ae,window._kitCfgUpdateOpzione=Me,window._kitCfgDelOpzione=Oe,window._kitCfgAddSez=Ee,window._kitCfgImportSez=Ne,window._kitCfgUpdateSez=Be,window._kitCfgDelSez=Te,window._kitCfgAddComp=Ke,window._kitCfgUpdateComp=Le,window._kitCfgUpdateCompRule=Re,window._kitCfgToggleCompOption=Pe,window._kitCfgToggleCompTracked=De,window._kitCfgDelComp=Ve,window._kitCfgAddSA=He,window._kitCfgAddSAForVariant=je,window._kitCfgUpdateSA=Ue,window._kitCfgDelSA=Fe}var yt,ct,Bt,qt,ht,pi,kt,j,nt,gt,ot,Nt,O,Jt,At,D,y,en,Qe=ai(()=>{ri();di();li();ci();yt="_mlKitData",ct="_mlKitDataTs",Bt="_mlKitOrderDrafts",qt="_mlKitOrderDraftSeq",ht=2,pi=["pz","mt","cm","mm","kg","g","lt","ml"],kt=!1,j=[],nt=null,gt={};ot={};Nt=null;O=null,Jt="ordine";At=null,D="info",y=null;en=tt});Qe();export{tt as caricaKitProdotti,en as default,tn as registerGlobals,Xe as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-K2PPAUYS.js.map
