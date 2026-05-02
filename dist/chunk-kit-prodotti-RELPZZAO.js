import{a as qi,c as $t,e as Ti,f as r,g as y,h as rt,l as Bi,m as L,q as Ki,r as St,u as Di}from"./chunk-chunk-55SFP7PR.js";function jn(){xt=!1}function U(t,i){return String(t||"").trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"")||i}function J(t){let i=String(t??"").trim().replace(",","."),n=Number.parseFloat(i);return Number.isFinite(n)?Math.max(0,n):0}function it(t){let i=Number(t);if(!Number.isFinite(i))return"0";let n=Math.round(i*1e3)/1e3;return Math.abs(n-Math.round(n))<1e-9?String(Math.round(n)):n.toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:3})}function yt(t,i="pz"){return String(t||i).trim().toLowerCase()||i}function Hi(t,i){let n="opz"+(i+1),e=U(t?.key,n);return{id:String(t?.id||$()),key:e,nome:String(t?.nome||e).trim()||e,codice:String(t?.codice||"").trim()}}function ji(t,i){let n="asse"+(i+1),e=U(t?.key,n),o=Array.isArray(t?.opzioni)?t.opzioni.map((s,a)=>Hi(s,a)).filter(Boolean):[];return{id:String(t?.id||$()),key:e,nome:String(t?.nome||e).trim()||e,opzioni:o}}function ii(t){return t.length===1?t[0].opzioneKey:t.map(function(i){return i.asseKey+"="+i.opzioneKey}).join("|")}function Vi(t){return t.length===1?t[0].opzioneNome:t.map(function(i){return i.asseNome+": "+i.opzioneNome}).join(" \xB7 ")}function ei(t){if(!Array.isArray(t)||!t.length)return[];let i=t.filter(e=>Array.isArray(e.opzioni)&&e.opzioni.length);if(!i.length)return[];let n=[{selections:[]}];for(let e of i){let o=[];for(let s of n)for(let a of e.opzioni)o.push({selections:s.selections.concat({asseId:e.id,asseKey:e.key,asseNome:e.nome,opzioneId:a.id,opzioneKey:a.key,opzioneNome:a.nome,opzioneCodice:String(a.codice||"").trim()})});n=o}return n.map(function(e,o){return{id:"combo-"+(o+1),key:ii(e.selections),nome:Vi(e.selections),selections:e.selections}})}function Fi(t){let i=String(t?.modoComponente||"quantificato").trim()||"quantificato",n=i==="segnalazione"?!1:t?.tracciabile!==void 0?!!t.tracciabile:!0,e=i==="segnalazione"?"flag":"pz";return{id:String(t?.id||$()),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",codice:String(t?.codice||"").trim(),qtaPerVariante:{...t?.qtaPerVariante||{}},caricato:Number(t?.caricato||0),modoComponente:i,tracciabile:n,noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:yt(t?.unitaMisura,e),applicazioneTipo:String(t?.applicazioneTipo||"").trim(),applicazioneAsseId:String(t?.applicazioneAsseId||"").trim(),applicazioneOpzioneIds:Array.isArray(t?.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtaBase:J(t?.qtaBase)}}function Ui(t){return{id:String(t?.id||$()),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(Fi):[]}}function Qi(t,i){if(t.size!==i.size)return!1;for(let n of t)if(!i.has(n))return!1;return!0}function ni(t,i){let n={tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:J(t?.qtaBase)};if(t?.applicazioneTipo==="sempre"||t?.applicazioneTipo==="gruppo")return{tipo:t.applicazioneTipo,asseId:String(t.applicazioneAsseId||""),opzioneIds:Array.isArray(t.applicazioneOpzioneIds)?t.applicazioneOpzioneIds.map(String):[],qtyBase:n.qtyBase||J(Object.values(t?.qtaPerVariante||{})[0])};let e=M(i);if(!e.length)return n;let o=e.filter(c=>T(t,c.key)>0);if(!o.length)return n;let s=new Set(o.map(c=>T(t,c.key)));if(s.size!==1)return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:Math.max(...o.map(c=>T(t,c.key)))};let a=[...s][0];if(o.length===e.length)return{tipo:"sempre",asseId:"",opzioneIds:[],qtyBase:a};let d=new Set(o.map(c=>c.key));for(let c of i.assiConfigurazione||[]){let l=[];for(let p of c.opzioni||[]){let u=new Set(e.filter(h=>(h.selections||[]).some(g=>g.asseId===c.id&&g.opzioneId===p.id)).map(h=>h.key));if(!u.size)continue;[...u].every(h=>T(t,h)===a)&&l.push(p.id)}if(!l.length)continue;let m=new Set(e.filter(p=>(p.selections||[]).some(u=>u.asseId===c.id&&l.includes(u.opzioneId))).map(p=>p.key));if(Qi(m,d))return{tipo:"gruppo",asseId:c.id,opzioneIds:l,qtyBase:a}}return{tipo:"manuale",asseId:"",opzioneIds:[],qtyBase:a}}function Ot(t,i,n){if(!n||n.tipo==="manuale")return{...t?.qtaPerVariante||{}};let e={},o=J(n.qtyBase);if(!o)return e;for(let s of M(i)){let a=n.tipo==="sempre";n.tipo==="gruppo"&&(a=(s.selections||[]).some(d=>d.asseId===n.asseId&&n.opzioneIds.includes(d.opzioneId))),a&&(e[s.key]=o)}return e}function Gi(t,i){let n=Ui(t);return n.componenti=n.componenti.map(function(e){let o=ni(e,i);return{...e,applicazioneTipo:o.tipo,applicazioneAsseId:o.asseId,applicazioneOpzioneIds:o.opzioneIds,qtaBase:o.qtyBase,qtaPerVariante:Ot(e,i,o)}}),n}function Ji(t,i){let n=M(i);if(!n.length)return null;let e=null;for(let o of n){let s=T(t,o.key);if(e===null){e=s;continue}if(e!==s)return null}return e}function Yi(t,i,n){let e=M(n),o={},s=Ji(t,i);if(!e.length)Object.assign(o,t?.qtaPerVariante||{});else for(let a of e){let c=Object.prototype.hasOwnProperty.call(t?.qtaPerVariante||{},a.key)?T(t,a.key):s!==null?s:0;c>0&&(o[a.key]=c)}return{id:$(),nome:String(t?.nome||"Nuovo componente").trim()||"Nuovo componente",qtaPerVariante:o,caricato:0,modoComponente:t?.modoComponente==="segnalazione"?"segnalazione":"quantificato",tracciabile:qt(t),noteConfig:String(t?.noteConfig||"").trim(),unitaMisura:yt(t?.unitaMisura,B(t)?"flag":"pz")}}function kt(t,i,n){return{id:$(),nome:String(t?.nome||"Nuova sezione").trim()||"Nuova sezione",componenti:Array.isArray(t?.componenti)?t.componenti.map(e=>Yi(e,i,n)):[]}}function oi(t,i,n){let e=new Set((n.assiConfigurazione||[]).map(c=>c.key)),o=U(t?.key||String(t?.nome||"asse"),"asse1"),s=o,a=1;for(;e.has(s);)s=o+"_c"+a++;let d=[];for(let c=0;c<(t.opzioni||[]).length;c++){let l=t.opzioni[c],m="opz"+(c+1),p=U(l?.key,m),u=1;for(;d.some(k=>k.key===p);)p=p+"_c"+u++;d.push({id:$(),key:p,nome:String(l?.nome||"").trim()||p,codice:String(l?.codice||"").trim()})}return{id:$(),key:s,nome:String(t?.nome||"").trim()||s,opzioni:d}}function Nt(t,i){return(t?.sezioni||[]).find(n=>n.id===i)||null}function lt(t,i){let n=new Set(M(t).map(s=>s.key)),e=M(i),o=e.filter(s=>n.has(s.key)).length;return{targetCount:e.length,exactMatches:o,hasTargetVarianti:e.length>0,needsReview:e.length===0||o<e.length}}function vt(t,i){let n=String(i||"").trim().toLowerCase();return n?String(t||"").toLowerCase().includes(n):!0}function Wi(t,i){return{id:String(t?.id||$()),nome:String(t?.nome||"").trim(),varianteKey:String(t?.varianteKey||i||"").trim(),noteConfig:String(t?.noteConfig||"").trim()}}function si(t){let i=t&&typeof t=="object"?t:{},n=Array.isArray(i.varianti)?i.varianti.map(function(p,u){let k="v"+(u+1),h=U(p?.key,k);return{id:String(p?.id||$()),key:h,nome:String(p?.nome||h).trim()||h}}):[],e=Array.isArray(i.assiConfigurazione)?i.assiConfigurazione.map((p,u)=>ji(p,u)):[],o=e.length?e:n.length?[{id:"asse-legacy-"+String(i.id||"kit"),key:"configurazione",nome:"Configurazione",opzioni:n.map(function(p){return{id:p.id,key:p.key,nome:p.nome}})}]:[],s=ei(o),a=s.length?s:n,d=new Set(a.map(p=>p.key)),c={};Object.entries(i.qtaDaProdurre||{}).forEach(function(p){d.has(p[0])&&(c[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0))});for(let p of a)c[p.key]===void 0&&(c[p.key]=0);let l=Array.isArray(i.sottoAssembly)?i.sottoAssembly.map(p=>Wi(p,a[0]?.key||"")).filter(p=>!p.varianteKey||d.has(p.varianteKey)):[],m={};return Object.entries(i.pronti||{}).forEach(function(p){m[p[0]]=Math.max(0,Number.parseInt(p[1],10)||0)}),{id:String(i.id||$()),nome:String(i.nome||"Nuovo Kit").trim()||"Nuovo Kit",schemaVersion:Et,assiConfigurazione:o,varianti:a,sezioni:Array.isArray(i.sezioni)?i.sezioni.map(p=>Gi(p,{assiConfigurazione:o,varianti:a})):[],sottoAssembly:l,qtaDaProdurre:c,pronti:m,movimenti:Array.isArray(i.movimenti)?i.movimenti.slice():[]}}function M(t){return Array.isArray(t?.varianti)?t.varianti:[]}function B(t){return!!t&&t.modoComponente==="segnalazione"}function qt(t){return!!t&&t.tracciabile!==!1&&!B(t)}function T(t,i){let n=J(t?.qtaPerVariante?.[i]);return B(t)?n>0?1:0:n}function Tt(t,i){return ni(t,i)}function Bt(){try{let t=localStorage.getItem(Wt),i=t?JSON.parse(t):{};return i&&typeof i=="object"?i:{}}catch{return{}}}function ai(t){try{localStorage.setItem(Wt,JSON.stringify(t||{}))}catch{}}function nt(){try{let t=localStorage.getItem(Zt),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Kt(t){try{localStorage.setItem(Zt,JSON.stringify(t||[]))}catch{}}function W(){try{let t=localStorage.getItem(Xt),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function ht(t){try{localStorage.setItem(Xt,JSON.stringify(t||[]));try{localStorage.setItem(Li,Date.now())}catch{}}catch{}}function ot(t){return String(t||"").trim().toUpperCase()}function pt(t){let i=Array.isArray(t?.ordiniCliente)?[...new Set(t.ordiniCliente.map(ot).filter(Boolean))]:[];return{cliente:String(t?.cliente||"").trim(),ordiniCliente:i,documento:String(t?.documento||"").trim()}}function R(t){return pt(t?._meta||{})}function zt(t,i){return t._meta=pt(i),t._meta}function Y(t,i){return Math.max(0,Number.parseInt(t?.[i],10)||0)}function ri(){let t=1;try{t=(Number.parseInt(localStorage.getItem(Gt),10)||0)+1,localStorage.setItem(Gt,String(t))}catch{}return`Distinta Base-${String(t).padStart(4,"0")}`}function ci(t){let i=R(t);return i.documento||(i.documento=ri(),zt(t,i)),i.documento}function Jt(t){let i=new Set;return(Array.isArray(t)?t:[]).filter(n=>String(n?.archiviato||"").toUpperCase()!=="TRUE").map(n=>({ordine:ot(n?.ordine||""),cliente:String(n?.cliente||"").trim()})).filter(n=>!n.ordine||i.has(n.ordine)?!1:(i.add(n.ordine),!0))}function di(){return G.length?Promise.resolve(G):Array.isArray(window._attiviProd)&&window._attiviProd.length?(G=Jt(window._attiviProd),Promise.resolve(G)):ct||(ct=fetch($t,{method:"POST",body:JSON.stringify({pagina:"PROGRAMMA PRODUZIONE DEL MESE"})}).then(t=>t.json()).then(t=>(G=Jt(t),G)).catch(function(t){return console.warn("[kit-prodotti] autocomplete ordini non disponibile:",t),[]}).finally(function(){ct=null}),ct)}function Zi(t){let i=ot(t);return i&&G.find(n=>n.ordine===i)||null}function li(t,i={}){let n=[...new Set((Array.isArray(t)?t:[]).map(function(e){let o=ot(e);return o?i[o]?String(i[o]||"").trim():String(Zi(o)?.cliente||"").trim():""}).filter(Boolean))];return n.length===1?n[0]:""}function Q(t){let i=Bt(),n=i?.[t?.id]&&typeof i[t.id]=="object"?i[t.id]:{},e={};for(let o of M(t)){let s=n[o.key];e[o.key]=Math.max(0,Number.parseInt(s,10)||0)}return e._meta=pt(n._meta||{}),e}function P(t,i){let{kits:n}=z(),e=n.find(m=>m.id===t);if(!e)return;let o=Bt(),s=Q(e);i(s,e);let a={},d=!1;for(let m of M(e)){let p=Math.max(0,Number.parseInt(s[m.key],10)||0);a[m.key]=p,p>0&&(d=!0)}let c=pt(s._meta||{}),l=!!(c.cliente||c.ordiniCliente.length||c.documento);(d||l)&&(c.documento||(c.documento=ri()),a._meta=c),d||l?o[t]=a:delete o[t],ai(o),N===t&&D()}function Xi(t){return Object.entries(t||{}).reduce(function(i,n){return n[0]==="_meta"?i:i+(Number.parseInt(n[1],10)||0)},0)}function Dt(t){let i=dt[t.id]&&typeof dt[t.id]=="object"?dt[t.id]:{},n={};for(let e of t.assiConfigurazione||[]){let o=new Set((e.opzioni||[]).map(s=>s.id));n[e.id]=o.has(i[e.id])?i[e.id]:e.opzioni?.[0]?.id||""}return dt[t.id]=n,n}function pi(t,i){let n=t.assiConfigurazione||[];if(!n.length)return M(t)[0]||null;let e=[];for(let s of n){let a=i?.[s.id],d=(s.opzioni||[]).find(c=>c.id===a);if(!d)return null;e.push({asseId:s.id,asseKey:s.key,asseNome:s.nome,opzioneId:d.id,opzioneKey:d.key,opzioneNome:d.nome})}let o=ii(e);return M(t).find(s=>s.key===o)||null}function te(t){let i=String(t?.asseNome||"").trim(),n=String(t?.opzioneNome||"").trim();return i?n?n.toLowerCase().includes(i.toLowerCase())||/\s/.test(n)?n:`${i} ${n}`.trim():i:n}function ie(t,i,n){let e=String(n?.asseId||""),o=String(n?.opzioneId||"");if(!e||!o)return!1;for(let s of t.sezioni||[])for(let a of s.componenti||[])if(!B(a)&&!(T(a,i.key)<=0)&&a.applicazioneTipo==="gruppo"&&String(a.applicazioneAsseId||"")===e&&Array.isArray(a.applicazioneOpzioneIds)&&a.applicazioneOpzioneIds.includes(o))return!0;return!1}function ee(t,i,n){let e=[],o=new Map;for(let s of i){let a=Y(n,s.key);if(a)for(let d of s.selections||[]){if(ie(t,s,d))continue;let c=`${d.asseId||""}::${d.opzioneId||""}`,l=o.get(c);if(l){l.totale+=a;continue}let m={id:"sel-"+c,nome:te(d),codice:String(d?.opzioneCodice||"").trim(),totale:a,unita:"pz",dettaglio:"",noteConfig:""};o.set(c,m),e.push(m)}}return e}function wt(t,i){let n=M(t).filter(a=>Y(i,a.key)>0),e=[],o=[],s=ee(t,n,i);s.length&&e.push({id:"kit-distinta-elettronica",nome:"ELETTRONICA",righe:s});for(let a of t.sezioni||[]){let d=[];for(let c of a.componenti||[]){let l=0,m=[];for(let u of n){let k=Y(i,u.key),h=T(c,u.key);!k||!h||(B(c)?l+=k:l+=k*h,m.push({nome:u.nome,pezziOrdine:k,coeff:h}))}if(!m.length)continue;let p=m.length===1?m[0].nome:m.length+" configurazioni";if(B(c)){o.push({id:"alert-"+c.id,tipo:"alert",nome:c.nome,dettaglio:c.noteConfig||"Requisito da verificare in fase di approvvigionamento.",totaleCoinvolto:l,variantiLabel:p});continue}d.push({id:c.id,nome:c.nome,codice:String(c.codice||"").trim(),totale:l,unita:c.unitaMisura||"pz",dettaglio:"",noteConfig:c.noteConfig||""}),c.noteConfig&&o.push({id:"note-"+c.id,tipo:"nota",nome:c.nome,dettaglio:c.noteConfig,totaleCoinvolto:l,variantiLabel:p})}d.length&&e.push({id:a.id,nome:a.nome,righe:d})}return{selectedVarianti:n,sezioni:e,avvisi:o,totalePezzi:Xi(i),totaleRighe:e.reduce((a,d)=>a+d.righe.length,0)}}function ne(t,i=!0){let n=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())?"\u2014":n.toLocaleString("it-IT",i?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{day:"2-digit",month:"2-digit",year:"numeric"})}function oe(){return String(window._distintaHeaderAzienda||"").trim()}function mi(t,i,n){let e=new Date,o=R(n),s=oe(),a=String(o.documento||"").trim(),d=s?s.split(/\r?\n/).map(k=>`<div>${r(k)}</div>`).join(""):"",c=o.ordiniCliente.length>1?"Ordini cliente":"Ordine cliente",l=o.ordiniCliente.join(" \xB7 "),m=i.selectedVarianti.length?i.selectedVarianti.map(k=>{let h=Y(n,k.key);return`<tr>
                <td>${r(it(h))}</td>
                <td>${r(k.nome)}</td>
            </tr>`}).join(""):'<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>',p=i.sezioni.map(k=>{let h=k.righe.map(g=>{let _=[g.dettaglio,g.noteConfig].filter(Boolean).join(" \xB7 ");return`<tr>
                <td class="db-print-cell-ref">${r(String(g.codice||"").trim())}</td>
                <td><div class="db-print-row-name">${r(g.nome)}</div></td>
                <td class="db-print-cell-unit">${r(g.unita)}</td>
                <td class="db-print-cell-qty">${r(it(g.totale))}</td>
                <td class="db-print-cell-note">${_?r(_):""}</td>
            </tr>`}).join("");return`<tr class="db-print-section-row"><td colspan="5">${r(k.nome)}</td></tr>${h}`}).join(""),u=i.avvisi.length?i.avvisi.map(k=>`<div class="db-print-alert ${k.tipo==="alert"?"db-print-alert--warning":""}">
                <div class="db-print-alert-title">${r(k.nome)}</div>
                <div>${r(k.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${r(it(k.totaleCoinvolto))} pz \xB7 ${r(k.variantiLabel)}</div>
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
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${r(ne(e))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${r(L?.nome||"Sistema")}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${r(it(i.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${r(it(i.totaleRighe))}</div></div>
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
</html>`}function se(t){let{kits:i}=z(),n=i.find(a=>a.id===t);if(!n)return;let e=Q(n),o=wt(n,e);if(!o.totalePezzi||!o.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}R(e).documento||(P(t,function(a){ci(a)}),e=Q(n));let s=window.open("","_blank");if(!s){y("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}s.document.open(),s.document.write(mi(n,o,e)),s.document.close(),s.focus()}function z(){try{let t=localStorage.getItem(Mt);if(!t)return{kits:[]};let i=JSON.parse(t);return{kits:Array.isArray(i?.kits)?i.kits.map(si):[]}}catch{return{kits:[]}}}function x(t){let i=Array.isArray(t)?t.map(si):[];try{localStorage.setItem(Mt,JSON.stringify({kits:i})),localStorage.setItem(gt,Date.now())}catch{}ae(i)}function ae(t){clearTimeout(Yt),Yt=setTimeout(function(){St({azione:"setKitData",kits:t}).catch(function(i){console.warn("[kit-prodotti] salvataggio remoto fallito:",i)})},1500)}function re(t){fetch($t,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(i=>i.json()).then(i=>{if(i&&Array.isArray(i.kits)){let n=parseInt(i.ts||0),e=parseInt(localStorage.getItem(gt)||0);if(n>0&&n>e){try{localStorage.setItem(Mt,JSON.stringify({kits:i.kits}))}catch{}try{localStorage.setItem(gt,n)}catch{}t&&t(!0);return}}t&&t(!1)}).catch(()=>{t&&t(!1)})}function $(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function Pt(){if(!L||!L.nome)return!1;let t=String(L.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||L.ruolo==="MASTER"}function ce(t){let i={};for(let n of t.sezioni||[])for(let e of n.componenti||[]){if(B(e)){i[e.id]=0;continue}let o=0;for(let[s,a]of Object.entries(t.qtaDaProdurre||{}))o+=(Number.parseInt(a,10)||0)*T(e,s);i[e.id]=o}return i}function de(t){let i={};for(let n of t.sottoAssembly||[]){let e=Number.parseInt(t.pronti?.[n.id],10)||0;if(!e)continue;let o=n.varianteKey;for(let s of t.sezioni||[])for(let a of s.componenti||[]){if(B(a))continue;let d=T(a,o);d>0&&(i[a.id]=(i[a.id]||0)+e*d)}}return i}function ui(t,i){let n=M(t).find(e=>e.key===i);return n?r(n.nome):r(i)}function Lt(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function st(){xt||(xt=!0,re(function(n){n&&st()}));let{kits:t}=z(),i=document.getElementById("contenitore-dati");if(i){i.innerHTML=`
    <div class="kit-page">
        <div class="kit-page-header">
            <div class="kit-page-title"><i class="fas fa-boxes-stacked"></i> Kit Prodotti</div>
            <div id="kit-page-actions" style="display:flex;gap:8px;align-items:center"></div>
        </div>
        <div class="kit-page-tabs" style="margin-top:12px;display:flex;gap:8px">
            <button class="kit-tab ${q==="kits"?"kit-tab--active":""}" onclick="_kitSwitchMainTab('kits')">Kits</button>
            <button class="kit-tab ${q==="anagrafiche"?"kit-tab--active":""}" onclick="_kitSwitchMainTab('anagrafiche')">Anagrafiche</button>
            <button class="kit-tab ${q==="distinte"?"kit-tab--active":""}" onclick="_kitSwitchMainTab('distinte')">Distinte</button>
        </div>
        <div id="kit-main-content" class="kit-main-content" style="margin-top:14px"></div>
    </div>`,Z(q),Rt();try{if(window&&window._kitSuppressNextFade)try{delete window._kitSuppressNextFade}catch{}else rt(i)}catch{rt(i)}}}function fi(t,i){if(!i)return;let n=(Array.isArray(t)?t:[]).map(e=>{let s=M(e).length,a=(e.assiConfigurazione||[]).length,d=(e.sezioni||[]).reduce((c,l)=>c+(l.componenti||[]).length,0);return`
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
        ${t.length===0?`<div class="kit-empty-state">
                <i class="fas fa-box-open kit-empty-icon"></i>
                <p>Nessun kit configurato.</p>
                <button type="button" class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
               </div>`:`<div class="kit-grid">${n}</div>`}`}function Rt(){let t=document.getElementById("kit-page-actions");t&&(q==="kits"?t.innerHTML='<button type="button" class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>':q==="anagrafiche"?t.innerHTML='<button type="button" class="kit-cfg-add-btn" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>':t.innerHTML="")}function Z(t){q=t;let{kits:i}=z(),n=document.getElementById("kit-main-content");n&&(t==="kits"?fi(i,n):t==="anagrafiche"?gi(i,n):t==="distinte"&&ki(i,n),Rt())}function gi(t,i){if(!i)return;let n=mt();if(!n.length){i.innerHTML=`
            <div class="kit-cfg-section">
                <div class="kit-cfg-help">Gestisci i componenti riutilizzabili tra kit.</div>
                <div style="margin-top:12px" class="kit-import-empty">Nessun componente salvato.</div>
            </div>`;return}let e=n.reduce((s,a)=>{let d=a.categoria||"Senza categoria";return s[d]=s[d]||[],s[d].push(a),s},{}),o='<div class="kit-cfg-section"><div class="kit-cfg-help">Gestisci i componenti riutilizzabili tra kit.</div>';for(let[s,a]of Object.entries(e))o+=`<div style="margin-top:12px"><div style="font-weight:700;margin-bottom:6px">${r(s)}</div>`,o+=a.map(d=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #eee">
                <div style="flex:1">
                    <div style="font-weight:600">${r(d.nome)} ${d.codice?`<span style="color:#94a3b8;font-size:.9rem">\xB7 ${r(d.codice)}</span>`:""}</div>
                    ${d.descrizione?`<div style="color:#94a3b8;font-size:.85rem">${r(d.descrizione)}</div>`:""}
                </div>
                <div style="display:flex;gap:8px">
                    <button class="kit-cfg-add-btn" onclick="_kitOpenAnagraficaModal('${r(d.id)}')">Modifica</button>
                    <button class="kit-btn-danger" onclick="(function(){ if(confirm('Eliminare questo componente?')) _kitDeleteAnagrafica('${r(d.id)}') })()">Elimina</button>
                </div>
            </div>`).join(""),o+="</div>";o+="</div>",i.innerHTML=o}function ki(t,i){if(!i)return;let n=W(),e=n.length?n.map(o=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee">
                <div style="flex:1">
                    <div style="font-weight:700">${r(o.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.9rem">${r(o.documento||"")} \xB7 ${r(o.kitNome||"")}</div>
                    <div style="color:#94a3b8;font-size:0.8rem">${r(new Date(o.createdAt).toLocaleString())} \xB7 ${r(o.createdBy)}</div>
                </div>
                <div style="display:flex;gap:8px">
                    <button class="kit-cfg-add-btn" onclick="_kitDistintaOpenPrint('${r(o.id)}')">Stampa</button>
                    <button class="kit-cfg-add-btn" onclick="_kitDistintaApplyToDraft('${r(o.id)}')">Applica</button>
                    <button class="kit-btn-danger" onclick="(function(){ if(confirm('Eliminare questa distinta?')) _kitDistintaDelete('${r(o.id)}')})()">Elimina</button>
                </div>
            </div>`).join(""):'<div class="kit-import-empty">Nessuna distinta salvata.</div>';i.innerHTML=`<div class="kit-cfg-section">${e}</div>`}function vi(t){let{kits:i}=z(),n=i.find(c=>c.id===t);if(!n){y("Kit non trovato \u26A0\uFE0F");return}let e=Q(n);R(e).documento||(P(t,function(c){ci(c)}),e=Q(n));let o=wt(n,e);if(!o.totalePezzi||!o.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}let s=W(),a=R(e),d={id:$(),kitId:n.id,kitNome:n.nome,nome:a.documento||`Distinta-${Date.now()}`,documento:a.documento||"",createdAt:Date.now(),createdBy:L?.nome||"Sistema",orderDraftSnapshot:e,distintaSnapshot:o};s.unshift(d),ht(s),y("Distinta salvata \u2713"),q==="distinte"&&Z("distinte")}function mt(){try{let t=localStorage.getItem(ti),i=t?JSON.parse(t):[];return Array.isArray(i)?i:[]}catch{return[]}}function Ht(t){try{localStorage.setItem(ti,JSON.stringify(t||[]));try{localStorage.setItem(Ri,Date.now())}catch{}}catch{}}function le(){if(document.getElementById("modal-kit-anagrafica-edit"))return;let t=document.createElement("div");t.innerHTML=`
    <div id="modal-kit-anagrafica-edit" class="modal-overlay" style="display:none" onclick="if(event.target===this)_kitCloseAnagraficaModal()">
      <div class="modal-content">
        <h2 class="pip-sped-modal-title"><i class="fas fa-plus"></i> Aggiungi componente</h2>
        <p class="pip-sped-modal-sub">Crea un componente riutilizzabile per i kit.</p>
        <div style="padding:8px 18px">
          <label class="kit-cfg-label">Componente</label>
          <input id="anag-componente" class="pip-edit-mov-input" placeholder="Nome componente" maxlength="120">
        </div>
        <div style="padding:8px 18px">
          <label class="kit-cfg-label">Codice</label>
          <input id="anag-codice" class="pip-edit-mov-input" placeholder="Codice (opzionale)" maxlength="60">
        </div>
        <div style="padding:8px 18px">
          <label class="kit-cfg-label">Categoria</label>
          <input id="anag-categoria" class="pip-edit-mov-input" placeholder="Categoria (es. Elettronica, Meccanica)" maxlength="80">
        </div>
        <div style="padding:8px 18px">
          <label class="kit-cfg-label">Descrizione</label>
          <textarea id="anag-descrizione" class="pip-edit-mov-input" placeholder="Descrizione (opzionale)" rows="3"></textarea>
        </div>
        <div class="modal-footer" style="margin-top:12px">
          <button type="button" onclick="_kitCloseAnagraficaModal()" class="btn-modal-cancel">Annulla</button>
          <button type="button" class="btn-modal-send" onclick="_kitConfirmSaveAnagrafica()"><i class="fas fa-save"></i> Salva</button>
        </div>
      </div>
    </div>`,document.body.appendChild(t.firstElementChild)}function pe(t){le();let i=document.getElementById("modal-kit-anagrafica-edit");if(!i)return;let n=document.getElementById("anag-componente"),e=document.getElementById("anag-codice"),o=document.getElementById("anag-categoria"),s=document.getElementById("anag-descrizione");if(t){let a=mt().find(d=>d.id===t);a&&(n&&(n.value=a.nome||""),e&&(e.value=a.codice||""),o&&(o.value=a.categoria||""),s&&(s.value=a.descrizione||""),i.dataset.editId=t)}else n&&(n.value=""),e&&(e.value=""),o&&(o.value=""),s&&(s.value=""),delete i.dataset.editId;i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>n&&n.focus(),80)}function bi(){let t=document.getElementById("modal-kit-anagrafica-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function me(){let t=document.getElementById("modal-kit-anagrafica-edit");if(!t)return;let i=t.dataset.editId,n=(document.getElementById("anag-componente")?.value||"").trim();if(!n){y("Inserisci il nome del componente","warning");return}let e=(document.getElementById("anag-codice")?.value||"").trim(),o=(document.getElementById("anag-categoria")?.value||"").trim(),s=(document.getElementById("anag-descrizione")?.value||"").trim(),a=mt();if(i){let d=a.findIndex(c=>c.id===i);d!==-1?a[d]={...a[d],nome:n,codice:e,categoria:o,descrizione:s,updatedAt:Date.now()}:a.unshift({id:$(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:L?.nome||"Sistema"})}else a.unshift({id:$(),nome:n,codice:e,categoria:o,descrizione:s,createdAt:Date.now(),createdBy:L?.nome||"Sistema"});Ht(a),bi(),y("Componente salvato \u2713"),q==="anagrafiche"&&Z("anagrafiche")}function ue(t){let i=mt().filter(n=>n.id!==t);Ht(i),q==="anagrafiche"&&Z("anagrafiche"),y("Componente eliminato \u2713")}function fe(t){let i=W().find(o=>o.id===t);if(!i)return;let{kits:n}=z(),e=n.find(o=>o.id===i.kitId)||null;if(e){let o=window.open("","_blank");if(!o){y("Popup bloccato: abilita l'anteprima di stampa per aprire il modello completo.","warning");return}o.document.open();try{o.document.write(mi(e,i.distintaSnapshot,i.orderDraftSnapshot))}catch{o.document.write("<pre>"+r(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>")}o.document.close(),o.focus()}else{let o=window.open("","_blank");if(!o){y("Popup bloccato","warning");return}o.document.open(),o.document.write("<pre>"+r(JSON.stringify(i.distintaSnapshot,null,2))+"</pre>"),o.document.close(),o.focus()}}function ge(t){let i=W().find(e=>e.id===t);if(!i)return;let n=Bt();n[i.kitId]=i.orderDraftSnapshot||{},ai(n),y("Bozza ordine ripristinata per il kit selezionato \u2713")}function ke(t){let i=W().filter(n=>n.id!==t);ht(i),q==="distinte"&&Z("distinte"),y("Distinta eliminata \u2713")}function ve(t){N=t,yi="ordine",D()}function D(){let{kits:t}=z(),i=t.find(g=>g.id===N);if(!i){st();return}let n=document.getElementById("contenitore-dati"),e=M(i),o=Q(i),s=R(o),a=wt(i,o),d=a.selectedVarianti.length?a.selectedVarianti.map(g=>`<span class="kit-meta-pill"><strong>${Y(o,g.key)}</strong> \xD7 ${r(g.nome)}</span>`).join(""):'<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>',c=s.ordiniCliente.length?s.ordiniCliente.map(g=>`<span class="kit-order-ref-chip">${r(g)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(i.id)}, ${JSON.stringify(g)})' aria-label="Rimuovi ordine ${r(g)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join(""):'<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>',l=Dt(i),m=pi(i,l),p=(i.assiConfigurazione||[]).length?(i.assiConfigurazione||[]).map(g=>`
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${r(g.nome)}</div>
                <div class="kit-compose-options">${(g.opzioni||[]).map(_=>`
                        <button type="button" class="kit-compose-option ${l[g.id]===_.id?"kit-compose-option--active":""}"
                            onclick="_kitComposeSelect('${r(i.id)}','${r(g.id)}','${r(_.id)}')">
                        ${r(_.nome)}
                    </button>`).join("")}</div>
            </div>`).join(""):'<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>',u=a.selectedVarianti.length?a.selectedVarianti.map(g=>{let _=Y(o,g.key);return`<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${r(g.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(g.selections)&&g.selections.length?g.selections.map(K=>r(K.opzioneNome)).join(" \xB7 "):r(g.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${r(i.id)}','${r(g.key)}',-1)">\u2212</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${_}"
                           onchange="_kitOrdineSet('${r(i.id)}','${r(g.key)}',this.value)"
                           oninput="_kitOrdineSet('${r(i.id)}','${r(g.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${r(i.id)}','${r(g.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${r(i.id)}','${r(g.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`}).join(""):`<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`,k=a.totalePezzi?a.sezioni.map(g=>`
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${r(g.nome)}</div>
                ${g.righe.map(_=>`
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${r(_.nome)}</div>
                            ${_.dettaglio?`<div class="kit-distinta-row-meta">${r(_.dettaglio)}</div>`:""}
                            ${_.noteConfig?`<div class="kit-distinta-row-note">${r(_.noteConfig)}</div>`:""}
                        </div>
                        <div class="kit-distinta-row-qty">${it(_.totale)} ${r(_.unita)}</div>
                    </div>`).join("")}
            </div>`).join(""):`<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`,h=a.avvisi.length?a.avvisi.map(g=>`
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
                    ${p}
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
                <div class="kit-order-lines">${u}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${a.totaleRighe} righe materiali \xB7 ${a.avvisi.length} avvisi</div>
                ${k}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${h}
            </section>
        </div>
    </div>`,rt(n),di().catch(()=>{})}function be(){N=null,st()}function ye(t){yi=t,D()}function he(t){P(t,function(i,n){for(let e of M(n)){let o=document.getElementById("kit-qty-"+e.key);o&&(i[e.key]=Math.max(0,Number.parseInt(o.value,10)||0))}})}function ze(t,i,n){try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){e[i]=Math.max(0,Number.parseInt(n,10)||0)})}function we(t,i,n){try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){let o=Math.max(0,Number.parseInt(e[i],10)||0);e[i]=Math.max(0,o+n)})}function _e(t){P(t,function(i){for(let n of Object.keys(i))n!=="_meta"&&(i[n]=0);i._meta=pt({})})}function Ce(t,i){P(t,function(n){n[i]=0})}function bt(t,i){let n=document.getElementById("kit-order-autocomplete-"+t);if(n){if(!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(e=>`
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(t)}, ${JSON.stringify(e.ordine)}, ${JSON.stringify(e.cliente)})'>
            <span class="ac-ordine">ORD. ${r(e.ordine)}</span>
            <span class="ac-cliente">${r(e.cliente)}</span>
        </div>
    `).join(""),n.style.display="block"}}function $e(t,i){let n=String(i||"").trim().toLowerCase();if(!n){bt(t,[]);return}di().then(function(e){let o=e.filter(s=>s.ordine.toLowerCase().includes(n)||s.cliente.toLowerCase().includes(n)).slice(0,8);bt(t,o)})}function Se(t){setTimeout(function(){bt(t,[])},140)}function Ie(t,i,n){let e=ot(i);if(!e)return;try{window._kitSuppressNextFade=!0}catch{}P(t,function(s){let a=R(s);a.ordiniCliente=[...new Set(a.ordiniCliente.concat(e))],a.cliente=li(a.ordiniCliente,{[e]:n}),zt(s,a)});let o=document.getElementById("kit-order-ref-input-"+t);o&&(o.value=""),bt(t,[])}function xe(t,i){let n=ot(i);try{window._kitSuppressNextFade=!0}catch{}P(t,function(e){let o=R(e);o.ordiniCliente=o.ordiniCliente.filter(s=>s!==n),o.cliente=li(o.ordiniCliente),zt(e,o)})}function Ae(t,i,n){let{kits:e}=z(),o=e.find(a=>a.id===t);if(!o)return;let s=Dt(o);if(s[i]=n,dt[t]=s,N===t){try{window._kitSuppressNextFade=!0}catch{}D()}}function Me(t){let{kits:i}=z(),n=i.find(a=>a.id===t);if(!n)return;let e=pi(n,Dt(n));if(!e){y("Completa prima le scelte elettroniche \u26A0\uFE0F");return}let o=Math.max(0,Number.parseInt(document.getElementById("kit-compose-qty-"+t)?.value,10)||0);if(!o){y("Inserisci una quantit\xE0 valida \u26A0\uFE0F");return}if(It[t])return;It[t]=Date.now(),setTimeout(function(){try{delete It[t]}catch{}},600);try{window._kitSuppressNextFade=!0}catch{}P(t,function(a){a[e.key]=Y(a,e.key)+o});let s=document.getElementById("kit-compose-qty-"+t);s&&(s.value=1)}function hi(t){let i=t.dataset.cid,n=t.dataset.sid,e=Math.max(0,Number.parseInt(t.value,10)||0),{kits:o}=z(),s=o.find(_=>_.id===N);if(!s)return;let a=(s.sezioni||[]).find(_=>_.id===n),d=a&&(a.componenti||[]).find(_=>_.id===i);if(!d||!qt(d))return;d.caricato=e,x(o);let l=ce(s)[i]||0,m=Math.max(0,l-e),u=de(s)[i]||0,k=t.closest("tr");if(!k)return;let h=k.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");h&&(h.textContent=l===0?"\u2014":m,h.className=l===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let g=k.querySelector(".kit-car-liberi");g&&(u>0?(g.textContent=Math.max(0,e-u)+" lib.",g.style.display=""):g.style.display="none")}function Ee(t,i,n){let{kits:e}=z(),o=e.find(s=>s.id===t);o&&(o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,(Number.parseInt(o.pronti[i],10)||0)+n),x(e),N===t&&D())}function Oe(t,i,n){let{kits:e}=z(),o=e.find(a=>a.id===t);if(!o)return;o.pronti||(o.pronti={}),o.pronti[i]=Math.max(0,Number.parseInt(n,10)||0),x(e);let s=document.querySelector(`.kit-pronti-input[data-said="${i}"]`);s&&(s.value=o.pronti[i],s.classList.toggle("kit-pronti-val-on",o.pronti[i]>0))}function Ne(t,i){let n=t.movimenti||[];return n.length?n.map(e=>{let o=i?`<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${r(t.id)}',${e.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=i&&(e.tipo==="carico"||e.tipo==="scarico")?`<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${r(t.id)}',${e.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(e.tipo==="spedizione"){let a=(e.righe||[]).reduce((l,m)=>l+m.qty,0),d=(e.righe||[]).map(l=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${r(l.mat)}</span><span class="kit-mov-qty scarico">\u2212${l.qty}</span></div>`).join(""),c=(e.items||[]).map(l=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${r(l.nome)}</span><span class="kit-mov-qty scarico">\xD7${l.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
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
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function qe(t,i){let{kits:n}=z(),e=n.find(g=>g.id===t);if(!e)return;let o=document.getElementById("kit-mov-mat-"+t),s=document.getElementById("kit-mov-qty-"+t),a=document.getElementById("kit-mov-nota-"+t);if(!o||!s)return;let d=o.value,c=o.options[o.selectedIndex]?.dataset.sid,l=Math.max(1,Number.parseInt(s.value,10)||1),m=(a?.value||"").trim(),p=(e.sezioni||[]).find(g=>g.id===c),u=p&&(p.componenti||[]).find(g=>g.id===d);if(!u||!qt(u))return;i==="carico"?u.caricato=(parseInt(u.caricato)||0)+l:u.caricato=Math.max(0,(parseInt(u.caricato)||0)-l),e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),cid:d,sid:c,tipo:i,qty:l,nota:m,mat:u.nome,ts:Lt()}),x(n),s&&(s.value=1),a&&(a.value="");let k=document.getElementById("kit-mov-list-"+t);k&&(k.innerHTML=Ne(e,Pt()));let h=document.querySelector(`#kit-tbody-${t} input[data-cid="${d}"]`);h&&(h.value=u.caricato,hi(h))}function Te(t,i){if(!Pt())return;let{kits:n}=z(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);o&&Be(t,i,o)}function Be(t,i,n){let e=document.getElementById("modal-kit-del-mov");if(!e)return;let o=document.getElementById("kit-del-mov-desc"),s;if(n.tipo==="spedizione")s=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(n.righe||[]).reduce((c,l)=>c+l.qty,0)} pz</strong>`;else if(n.tipo==="reso")s=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${n.totPz||0} pz</strong>`;else{let d=n.tipo==="carico"?"CARICO":"SCARICO";s=`<span class="kit-mov-badge ${r(n.tipo)}" style="font-size:.75rem">${d}</span> <strong>${r(n.mat)}</strong> ${n.tipo==="carico"?"+":"\u2212"}${n.qty} pz`}o&&(o.innerHTML=s);let a=document.getElementById("btn-kit-del-ok");a&&(a.onclick=()=>wi(t,i)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function zi(){let t=document.getElementById("modal-kit-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function wi(t,i){zi();let{kits:n}=z(),e=n.find(s=>s.id===t);if(!e)return;let o=(e.movimenti||[]).find(s=>s.id===i);if(o){if(o.tipo==="spedizione"){let s=(e.sezioni||[]).find(a=>a.id===o.sid);for(let a of o.righe||[])for(let d of e.sezioni||[]){let c=(d.componenti||[]).find(l=>l.id===a.cid||l.nome===a.mat);c&&(c.caricato=(parseInt(c.caricato)||0)+a.qty)}for(let a of o.items||[])a.saId&&e.pronti&&(e.pronti[a.saId]=(parseInt(e.pronti[a.saId])||0)+a.qty)}else if(o.tipo==="reso")for(let s of o.righe||[])for(let a of e.sezioni||[]){let d=(a.componenti||[]).find(c=>c.id===s.cid||c.nome===s.mat);d&&(d.caricato=Math.max(0,(parseInt(d.caricato)||0)-s.qty))}else if(o.tipo==="carico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(d=>d.id===o.cid);a&&(a.caricato=Math.max(0,(parseInt(a.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let s of e.sezioni||[]){let a=(s.componenti||[]).find(d=>d.id===o.cid);a&&(a.caricato=(parseInt(a.caricato)||0)+o.qty)}e.movimenti=(e.movimenti||[]).filter(s=>s.id!==i),x(n),N===t&&D(),y("Movimento eliminato \u2713")}}function Ke(t,i){if(!Pt())return;let{kits:n}=z(),e=n.find(l=>l.id===t);if(!e)return;let o=(e.movimenti||[]).find(l=>l.id===i);if(!o)return;let s=document.getElementById("modal-kit-edit-mov");if(!s)return;let a=document.getElementById("kit-edit-mov-mat"),d=document.getElementById("kit-edit-mov-qty"),c=document.getElementById("kit-edit-mov-nota");a&&(a.innerHTML=`<span class="kit-mov-badge ${r(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${r(o.mat)}</strong>`),d&&(d.value=o.qty),c&&(c.value=o.nota||""),s.dataset.kitId=t,s.dataset.movId=i,s.style.display="flex",s.offsetHeight,s.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function _i(){let t=document.getElementById("modal-kit-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function De(){let t=document.getElementById("modal-kit-edit-mov");if(!t)return;let i=t.dataset.kitId,n=Number(t.dataset.movId);_i();let{kits:e}=z(),o=e.find(l=>l.id===i);if(!o)return;let s=(o.movimenti||[]).findIndex(l=>l.id===n);if(s===-1)return;let a=o.movimenti[s],d=parseInt(document.getElementById("kit-edit-mov-qty")?.value),c=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(d)||d<=0){y("Quantit\xE0 non valida \u26A0\uFE0F");return}if(d!==a.qty){let l=d-a.qty;for(let m of o.sezioni||[]){let p=(m.componenti||[]).find(u=>u.id===a.cid);if(p){a.tipo==="carico"?p.caricato=Math.max(0,(parseInt(p.caricato)||0)+l):p.caricato=Math.max(0,(parseInt(p.caricato)||0)-l);break}}}o.movimenti[s]={...a,qty:d,nota:c},x(e),N===i&&D(),y("Movimento aggiornato \u2713")}function Pe(t){let{kits:i}=z(),n=i.find(c=>c.id===t);if(!n)return;if(!(n.sottoAssembly||[]).some(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0)){y("Nessuna parte tracciabile pronta \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let s=document.getElementById("kit-sped-items-list");s&&(s.innerHTML=(n.sottoAssembly||[]).filter(c=>(Number.parseInt(n.pronti?.[c.id],10)||0)>0).map(c=>{let l=Number.parseInt(n.pronti?.[c.id],10)||0,m=ui(n,c.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${r(c.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${r(c.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${l}</span>
                    </span>
                </label>`}).join(""));let a=document.getElementById("kit-sped-nota-"+t),d=document.getElementById("kit-sped-modal-nota");d&&a&&(d.value=a.value||""),d&&!a&&(d.value=""),o.dataset.kitId=t,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function Ci(){let t=document.getElementById("modal-kit-sped");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Le(){let t=document.getElementById("modal-kit-sped");if(!t)return;let i=t.dataset.kitId;Ci();let n=[...document.querySelectorAll(".kit-sped-chk:checked")].map(l=>l.dataset.said);if(!n.length)return;let{kits:e}=z(),o=e.find(l=>l.id===i);if(!o)return;let s=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),a=[],d=[];for(let l of n){let m=(o.sottoAssembly||[]).find(u=>u.id===l);if(!m)continue;let p=Number.parseInt(o.pronti?.[l],10)||0;if(p){a.push({saId:l,nome:m.nome,qty:p});for(let u of o.sezioni||[])for(let k of u.componenti||[]){if(B(k))continue;let h=T(k,m.varianteKey);if(!h)continue;let g=p*h;k.caricato=Math.max(0,(parseInt(k.caricato)||0)-g);let _=d.find(K=>K.cid===k.id);_?_.qty+=g:d.push({cid:k.id,mat:k.nome,qty:g})}o.pronti||(o.pronti={}),delete o.pronti[l]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:a,righe:d,nota:s,ts:Lt()}),x(e);let c=a.reduce((l,m)=>l+m.qty,0);y(`Spedizione registrata: ${c} pz \u2713`),N===i&&D()}function Re(t){let{kits:i}=z(),n=i.find(a=>a.id===t);if(!n)return;let e=document.getElementById("modal-kit-reso");if(!e)return;let o=document.getElementById("kit-reso-items-list");if(o){let a=n.sottoAssembly||[];o.innerHTML=a.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':a.map(d=>{let c=ui(n,d.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${r(d.nome)} <span class="kit-sped-var-pill">${c}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${r(d.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${r(t)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${r(d.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let s=document.getElementById("kit-reso-nota");s&&(s.value=""),jt(t),e.dataset.kitId=t,e.style.display="flex",e.offsetHeight,e.classList.add("active")}function $i(){let t=document.getElementById("modal-kit-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function He(t,i){let n=document.getElementById("kit-reso-qty-"+t);if(!n)return;n.value=Math.max(0,(parseInt(n.value)||0)+i);let e=document.getElementById("modal-kit-reso");e?.dataset.kitId&&jt(e.dataset.kitId)}function jt(t){let{kits:i}=z(),n=i.find(a=>a.id===t);if(!n)return;let e={};for(let a of n.sottoAssembly||[]){let d=document.getElementById("kit-reso-qty-"+a.id),c=Number.parseInt(d?.value,10)||0;if(c)for(let l of n.sezioni||[])for(let m of l.componenti||[]){if(B(m))continue;let p=T(m,a.varianteKey);p&&(e[m.id]={mat:m.nome,qty:(e[m.id]?.qty||0)+c*p})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let s=Object.entries(e).filter(([,a])=>a.qty>0);if(!s.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=s.map(([a,{mat:d,qty:c}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${r(a)}" data-qty="${c}" checked>
            <span class="kit-reso-bom-mat">${r(d)}</span>
            <span class="kit-reso-bom-qty">+${c}</span>
        </label>`).join("")}function je(){let t=document.getElementById("modal-kit-reso");if(!t)return;let i=t.dataset.kitId,{kits:n}=z(),e=n.find(l=>l.id===i);if(!e)return;let o=[];for(let l of e.sottoAssembly||[]){let m=Number.parseInt(document.getElementById("kit-reso-qty-"+l.id)?.value,10)||0;m>0&&o.push({saId:l.id,nome:l.nome,qty:m})}if(!o.length){y("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],a=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(l=>{let m=l.dataset.cid,p=Number.parseInt(l.dataset.qty,10),u=[...e.sezioni||[]].flatMap(k=>k.componenti||[]).find(k=>k.id===m)?.nome||"?";l.checked?s.push({cid:m,mat:u,qty:p}):a.push({cid:m,mat:u,qty:p})});for(let l of s)for(let m of e.sezioni||[]){let p=(m.componenti||[]).find(u=>u.id===l.cid);if(p){p.caricato=(parseInt(p.caricato)||0)+l.qty;break}}let d=(document.getElementById("kit-reso-nota")?.value||"").trim(),c=o.reduce((l,m)=>l+m.qty,0);e.movimenti||(e.movimenti=[]),e.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:s,scartate:a,nota:d,ts:Lt(),totPz:c}),x(n),$i(),y(`Reso registrato: ${c} pz \u2014 ${s.length} comp. recuperati \u2713`),N===i&&D()}function Ve(t){let i=document.getElementById("kit-save-btn"),n=document.getElementById("kit-save-label");if(!i||!n)return;i.disabled=!0,i.classList.add("kit-save-loading"),n.textContent="Salvataggio\u2026";let{kits:e}=z();St({azione:"setKitData",kits:e}).then(()=>{try{localStorage.setItem(gt,Date.now())}catch{}i.classList.remove("kit-save-loading"),i.classList.add("kit-save-ok"),n.textContent="Salvato \u2713",setTimeout(()=>{i.classList.remove("kit-save-ok"),n.textContent="Salva",i.disabled=!1},2500)}).catch(()=>{i.classList.remove("kit-save-loading"),i.classList.add("kit-save-err"),n.textContent="Errore \u2717",setTimeout(()=>{i.classList.remove("kit-save-err"),n.textContent="Salva",i.disabled=!1},3e3)})}function Fe(){let{kits:t}=z(),i={id:$(),nome:"Nuovo Kit",schemaVersion:Et,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};t.push(i),x(t),Ft(i.id)}function Ft(t){Vt=t,F="info",j()}function _t(t,i,n=""){let{kits:e}=z(),o=e.find(c=>c.id===t),s=e.find(c=>c.id!==t&&(c.sezioni||[]).length),a=o?.sezioni?.[0]?.id||"",d=e.find(c=>c.id!==t&&(c.assiConfigurazione||[]).length)?.assiConfigurazione?.[0]?.id||"";return{currentKitId:t,mode:i,search:"",sourceKitId:i==="copy"?t:s?.id||"",sectionId:n||(i==="copy"?a:s?.sezioni?.[0]?.id||""),asseId:n||(i==="import-asse"?d:""),targetKitIds:[]}}function Si(t){w=_t(t,"import"),H(!0)}function Ue(t){w=_t(t,"import-asse"),H(!0)}function Qe(t,i){w=_t(t,"copy",i),H(!0)}function et(){let t=document.getElementById("modal-kit-import");w=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ge(t){if(!w||t!=="import"&&t!=="copy"||w.mode===t)return;let i=w.currentKitId,n=t==="copy"?w.sectionId:"";w=_t(i,t,n),H()}function Je(t){w&&(w.search=String(t||""),H())}function Ye(t){if(!w)return;let{kits:i}=z(),n=i.find(e=>e.id===t);w.sourceKitId=t,w.mode==="import-asse"?w.asseId=n?.assiConfigurazione?.[0]?.id||"":w.sectionId=n?.sezioni?.[0]?.id||"",H()}function We(t){w&&(w.mode==="import-asse"?w.asseId=t:w.sectionId=t,H())}function Ze(t,i){if(!w||w.mode!=="copy")return;let n=new Set(w.targetKitIds||[]);i?n.add(t):n.delete(t),w.targetKitIds=[...n],H()}function Xe(){if(!w||w.mode!=="copy")return;let{kits:t}=z(),i=t.filter(e=>e.id!==w.currentKitId&&vt(e.nome,w.search)),n=new Set(w.targetKitIds||[]);for(let e of i)n.add(e.id);w.targetKitIds=[...n],H()}function tn(){!w||w.mode!=="copy"||(w.targetKitIds=[],H())}function H(t=!1){let i=document.getElementById("modal-kit-import");if(!i||!w)return;let{kits:n}=z(),e=w,o=n.find(f=>f.id===e.currentKitId);if(!o){et();return}let s=[];e.mode==="import"?s=n.filter(f=>f.id!==o.id&&(f.sezioni||[]).length):e.mode==="import-asse"?s=n.filter(f=>f.id!==o.id&&(f.assiConfigurazione||[]).length):s=n.filter(f=>f.id!==o.id&&(f.sezioni||[]).length),(e.mode==="import"||e.mode==="import-asse")&&!s.some(f=>f.id===e.sourceKitId)&&(e.sourceKitId=s[0]?.id||""),e.mode==="copy"&&(e.sourceKitId=o.id,e.targetKitIds=(e.targetKitIds||[]).filter(f=>f!==o.id&&n.some(b=>b.id===f)));let a=n.find(f=>f.id===e.sourceKitId)||null,d=e.mode==="import-asse"?a?.assiConfigurazione||[]:a?.sezioni||[];e.mode==="import-asse"?d.some(f=>f.id===e.asseId)||(e.asseId=d[0]?.id||""):d.some(f=>f.id===e.sectionId)||(e.sectionId=d[0]?.id||"");let c=e.mode==="import-asse"?(a?.assiConfigurazione||[]).find(f=>f.id===e.asseId)||null:Nt(a,e.sectionId),l=s.filter(f=>vt(f.nome,e.search)),m=n.filter(f=>f.id!==o.id&&vt(f.nome,e.search)),p=document.getElementById("kit-import-subtitle"),u=document.getElementById("kit-import-search"),k=document.getElementById("kit-import-left-title"),h=document.getElementById("kit-import-right-title"),g=document.getElementById("kit-import-kit-list"),_=document.getElementById("kit-import-section-list"),K=document.getElementById("kit-import-target-wrap"),ut=document.getElementById("kit-import-target-list"),X=document.getElementById("kit-import-preview"),V=document.getElementById("kit-import-confirm-btn"),Ct=document.getElementById("kit-import-mode-import"),ft=document.getElementById("kit-import-mode-copy");if(!p||!u||!k||!h||!g||!_||!K||!ut||!X||!V||!Ct||!ft)return;Ct.classList.toggle("kit-import-mode-btn--active",e.mode==="import"||e.mode==="import-asse"),ft.classList.toggle("kit-import-mode-btn--active",e.mode==="copy"),u.value=e.search,e.mode==="import"?(p.textContent=`Importa una sezione esistente dentro "${o.nome}".`,u.placeholder="Cerca kit sorgente\u2026",k.textContent="Kit sorgente",h.textContent=a?`Sezioni di ${a.nome}`:"Sezione",K.style.display="none",g.innerHTML=l.length?l.map(f=>{let b=f.id===e.sourceKitId;return`<label class="kit-import-option ${b?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-source" ${b?"checked":""}
                           onchange="_kitCfgSelectImportSource('${r(f.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(f.nome)}</span>
                        <span class="kit-import-option-meta">${(f.sezioni||[]).length} sezioni disponibili</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit sorgente trovato.</div>'):(p.textContent=`Seleziona una sezione di "${o.nome}" e copiala in pi\xF9 kit.`,u.placeholder="Cerca kit destinazione\u2026",k.textContent="Kit sorgente",h.textContent="Sezione da copiare",K.style.display="flex",g.innerHTML=`<div class="kit-import-source-card">
            <div class="kit-import-option-title">${r(o.nome)}</div>
            <div class="kit-import-option-meta">${(o.sezioni||[]).length} sezioni configurate</div>
        </div>`,ut.innerHTML=m.length?m.map(f=>{let b=(e.targetKitIds||[]).includes(f.id),S=c?lt(o,f):null,O=`${(f.sezioni||[]).length} sezioni`;return S&&(S.hasTargetVarianti?S.needsReview?O=`${S.exactMatches}/${S.targetCount} combinazioni allineate`:O=`${S.targetCount}/${S.targetCount} combinazioni allineate`:O="nessuna combinazione: rifinisci dopo"),`<label class="kit-import-option ${b?"kit-import-option--active":""}">
                    <input type="checkbox" ${b?"checked":""}
                           onchange="_kitCfgToggleImportTarget('${r(f.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(f.nome)}</span>
                        <span class="kit-import-option-meta">${r(O)}</span>
                    </span>
                </label>`}).join(""):'<div class="kit-import-empty">Nessun kit destinazione trovato.</div>'),_.innerHTML=d.length?d.map(f=>{let b=e.mode==="import-asse"?f.id===e.asseId:f.id===e.sectionId;return e.mode==="import-asse"?`<label class="kit-import-option ${b?"kit-import-option--active":""}">
                    <input type="radio" name="kit-import-section" ${b?"checked":""}
                           onchange="_kitCfgSelectImportSection('${r(f.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${r(f.nome)}</span>
                        <span class="kit-import-option-meta">${(f.opzioni||[]).length} opzioni</span>
                    </span>
                </label>`:`<label class="kit-import-option ${b?"kit-import-option--active":""}">
                <input type="radio" name="kit-import-section" ${b?"checked":""}
                       onchange="_kitCfgSelectImportSection('${r(f.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(f.nome)}</span>
                    <span class="kit-import-option-meta">${(f.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):`<div class="kit-import-empty">Nessun ${e.mode==="import-asse"?"gruppo elettronico":"sezione"} disponibile.</div>`;let tt=!1,v="kit-cfg-help kit-import-preview",C="";if(e.mode==="import"){if(!a)C="Seleziona un kit sorgente per vedere le sezioni disponibili.";else if(!c)C="Seleziona una sezione da importare nel kit corrente.";else{let f=lt(a,o);tt=!0,C=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 importata in <strong>${r(o.nome)}</strong>. `,f.hasTargetVarianti?f.needsReview?(v="kit-cfg-warn kit-import-preview",C+=`${f.exactMatches} combinazioni su ${f.targetCount} risultano allineate: controlla i coefficienti importati.`):C+=`Tutte le ${f.targetCount} combinazioni del kit destinazione risultano allineate.`:(v="kit-cfg-warn kit-import-preview",C+="Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.")}V.innerHTML='<i class="fas fa-copy"></i> Importa sezione'}else if(e.mode==="import-asse")a?c?(tt=!0,C=`L'asse <strong>${r(c.nome)}</strong> verr\xE0 importato in <strong>${r(o.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`):C="Seleziona un asse da importare nel kit corrente.":C="Seleziona un kit sorgente per vedere gli assi disponibili.",V.innerHTML='<i class="fas fa-copy"></i> Importa asse';else{let f=n.filter(b=>(e.targetKitIds||[]).includes(b.id));if(!c)C="Seleziona la sezione del kit corrente che vuoi copiare.";else if(!f.length)C="Seleziona almeno un kit destinazione per eseguire la copia massiva.";else{tt=!0;let b=f.filter(S=>lt(o,S).needsReview).length;C=`La sezione <strong>${r(c.nome)}</strong> verr\xE0 copiata in <strong>${f.length}</strong> kit.`,b>0?(v="kit-cfg-warn kit-import-preview",C+=` <strong>${b}</strong> kit richiederanno un controllo manuale delle quantit\xE0 o delle combinazioni.`):C+=" Le combinazioni risultano allineate su tutti i kit selezionati."}V.innerHTML=`<i class="fas fa-copy"></i> Copia in ${(e.targetKitIds||[]).length||0} kit`}X.className=v,X.innerHTML=C,V.disabled=!tt,t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let f=document.getElementById("kit-import-search");f&&f.focus()},40))}function en(){if(!w)return;let{kits:t}=z(),i=w,n=t.find(l=>l.id===i.currentKitId),e=t.find(l=>l.id===i.sourceKitId),o=Nt(e,i.sectionId),s=e?.assiConfigurazione?.find(l=>l.id===i.asseId)||null;if(!n||!e||i.mode==="import"&&!o||i.mode==="import-asse"&&!s){y("Configurazione import non valida \u26A0\uFE0F");return}if(i.mode==="import-asse"){n.assiConfigurazione=n.assiConfigurazione||[];let l=n.assiConfigurazione.find(p=>String(p.nome||"").trim().toLowerCase()===String(s.nome||"").trim().toLowerCase()),m=0;if(l){l.opzioni=l.opzioni||[];for(let p of s.opzioni||[]){let u=String(p.codice||"").trim().toLowerCase(),k=!1;if(u&&(k=l.opzioni.some(h=>String(h.codice||"").trim().toLowerCase()===u&&u!=="")),k||(k=l.opzioni.some(h=>String(h.nome||"").trim().toLowerCase()===String(p.nome||"").trim().toLowerCase())),!k){let h=(l.opzioni||[]).length+1;l.opzioni.push({id:$(),key:U(p?.key,"opz"+h),nome:String(p?.nome||"").trim()||"opz"+h,codice:String(p?.codice||"").trim()}),m+=1}}x(t),et(),j(),m?y(`${m} opzione${m>1?"i":""} aggiunta${m>1?"e":""} all'asse "${s.nome}" \u2713`):y(`Nessuna nuova opzione trovata per l'asse "${s.nome}"`);return}n.assiConfigurazione.push(oi(s,e,n)),x(t),et(),j(),y(`Asse "${s.nome}" importato da "${e.nome}" \u2713`);return}if(i.mode==="import"){let l=lt(e,n);n.sezioni=n.sezioni||[],n.sezioni.push(kt(o,e,n)),x(t),et(),j();let m="";l.hasTargetVarianti?l.needsReview&&(m=" Controlla le quantit\xE0 sulle combinazioni non allineate."):m=" Definisci poi gli assi del kit per rifinire i coefficienti.",y(`Sezione "${o.nome}" importata da "${e.nome}" \u2713${m}`);return}let a=t.filter(l=>(i.targetKitIds||[]).includes(l.id)&&l.id!==n.id);if(!a.length){y("Seleziona almeno un kit destinazione \u26A0\uFE0F");return}let d=0;for(let l of a)lt(e,l).needsReview&&(d+=1),l.sezioni=l.sezioni||[],l.sezioni.push(kt(o,e,l));x(t),et(),j();let c="";d>0&&(c=` ${d} kit richiedono un controllo delle quantit\xE0.`),y(`Sezione "${o.nome}" copiata in ${a.length} kit \u2713${c}`)}function nn(t){let{kits:i}=z(),n=i.find(e=>e.id===t)||null;A={currentKitId:t,search:"",selectedPresetId:"",newPresetName:"",newPresetSectionId:n?.sezioni?.[0]?.id||""},at(!0)}function Ii(){let t=document.getElementById("modal-kit-presets");A=null,t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function on(t){A&&(A.search=String(t||""),at())}function sn(t){A&&(A.selectedPresetId=t,at())}function an(){if(!A)return;let t=document.getElementById("preset-new-name"),i=document.getElementById("preset-new-section"),n=String(t?.value||"").trim();if(!n){y("Inserisci il nome del preset \u26A0\uFE0F");return}let e=i?.value||"";xi(A.currentKitId,e,n)}function xi(t,i,n){let{kits:e}=z(),o=e.find(d=>d.id===t);if(!o){y("Kit non trovato \u26A0\uFE0F");return}let s=Nt(o,i);if(!s){y("Seleziona una sezione valida \u26A0\uFE0F");return}let a=nt();a.push({id:$(),nome:String(n||"").trim(),sourceKitId:o.id,sezione:JSON.parse(JSON.stringify(s))}),Kt(a),y("Preset salvato \u2713"),A&&A.currentKitId===t&&at(),j()}function rn(t){if(!A)return;let i=nt(),n=t||A.selectedPresetId,e=i.find(d=>d.id===n);if(!e){y("Seleziona un preset \u26A0\uFE0F");return}let{kits:o}=z(),s=o.find(d=>d.id===A.currentKitId),a=o.find(d=>d.id===e.sourceKitId)||null;if(!s){y("Kit non trovato \u26A0\uFE0F");return}s.sezioni=s.sezioni||[],s.sezioni.push(kt(e.sezione,a,s)),x(o),Ii(),j(),y(`Preset "${e.nome}" applicato \u2713`)}function cn(t,i){let n=nt(),e=n.find(o=>o.id===t);if(!e){y("Preset non trovato \u26A0\uFE0F");return}e.nome=String(i||"").trim()||e.nome,Kt(n),y("Nome aggiornato \u2713"),at()}function dn(t){let i=nt().filter(n=>n.id!==t);Kt(i),A&&(A.selectedPresetId=""),at(),y("Preset eliminato \u2713")}function at(t=!1){let i=document.getElementById("modal-kit-presets");if(!i||!A)return;let n=nt(),e=A,o=z().kits.find(u=>u.id===e.currentKitId),s=n.filter(u=>vt(u.nome,e.search)),a=document.getElementById("preset-list"),d=document.getElementById("preset-preview"),c=document.getElementById("preset-new-name"),l=document.getElementById("preset-new-section"),m=document.getElementById("preset-apply-btn");if(!a||!d||!c||!l||!m)return;a.innerHTML=s.length?s.map(u=>{let k=u.id===e.selectedPresetId;return`<label class="kit-import-option ${k?"kit-import-option--active":""}">
                <input type="radio" name="preset-select" ${k?"checked":""} onchange="_kitSelectPreset('${r(u.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${r(u.nome)}</span>
                    <span class="kit-import-option-meta">${(u.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`}).join(""):'<div class="kit-import-empty">Nessun preset presente.</div>';let p=n.find(u=>u.id===e.selectedPresetId)||null;if(p){let u=p.sourceKitId&&z().kits.find(k=>k.id===p.sourceKitId)?.nome||"";d.innerHTML=`<div style="padding:6px"><strong>${r(p.nome)}</strong><div style="color:#94a3b8">${r(u)}</div></div>`+(p.sezione?.componenti?.length?`<div>${p.sezione.componenti.map(k=>`<div class="kit-meta-pill">${r(k.nome)}${k.codice?" \xB7 "+r(k.codice):""}</div>`).join("")}</div>`:'<div class="kit-import-empty">Sezione vuota</div>')}else d.innerHTML=`<div class="kit-import-empty">Seleziona un preset per vedere l'anteprima.</div>`;m.disabled=!p,c.value="",l.innerHTML=(o?.sezioni||[]).map(u=>`<option value="${r(u.id)}">${r(u.nome)}</option>`).join(""),t&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>{let u=document.getElementById("preset-search");u&&u.focus()},40))}function j(){let{kits:t}=z(),i=t.find(v=>v.id===Vt);if(!i){st();return}let n=document.getElementById("contenitore-dati"),e=i.assiConfigurazione||[],o=M(i);F==="sezioni"&&(F="bom"),F==="sa"&&(F="bom");let s=["info","varianti","anagrafiche","bom"],a={info:"Prodotto",varianti:"Elettronica selezionabile",anagrafiche:"Anagrafiche",bom:"Parti del prodotto"},d=e.length,c=o.length,l=(i.sezioni||[]).reduce((v,C)=>v+(C.componenti||[]).length,0),m=c?`
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
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>',p=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${r(i.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${r(i.id)}',this.value)">
        </div>
        ${m}
        <div class="kit-cfg-danger">
            <button type="button" class="kit-cfg-add-btn" onclick="_kitDuplicaKit('${r(i.id)}')"><i class="fas fa-clone"></i> Duplica kit</button>
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${r(i.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,u=e.map((v,C)=>{let f=(v.opzioni||[]).map((b,S)=>`
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${r(b.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(b.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${r(b.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${r(i.id)}','${r(v.id)}','${r(b.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${r(i.id)}','${r(v.id)}','${r(b.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join("");return`<div class="kit-cfg-sez-block" data-ai="${C}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${r(v.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${r(i.id)}','${r(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${r(i.id)}','${r(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente pu\xF2 richiedere per questo gruppo.</div>
            ${f||'<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${r(i.id)}','${r(v.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`}).join(""),k=o.length?`<div class="kit-cfg-recap" style="margin-top:12px">
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
            ${k}
        </div>`,g=(i.sezioni||[]).map((v,C)=>{let f=(v.componenti||[]).map(b=>{let S=B(b),O=Tt(b,i),Ut=(e||[]).find(E=>E.id===O.asseId)||null,Mi=O.tipo==="gruppo"&&Ut?`<div class="kit-cfg-row">${(Ut.opzioni||[]).map(E=>`<label class="kit-meta-pill">
                        <input type="checkbox" ${O.opzioneIds.includes(E.id)?"checked":""}
                               onchange="_kitCfgToggleCompOption('${r(i.id)}','${r(v.id)}','${r(b.id)}','${r(E.id)}',this.checked)">
                        ${r(E.nome)}
                    </label>`).join("")}</div>`:"",Ei=e.length?`<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(b.id)}','asseId',this.value)">
                        ${e.map(E=>`<option value="${r(E.id)}" ${O.asseId===E.id?"selected":""}>${r(E.nome)}</option>`).join("")}
                   </select>`:"",Oi=O.tipo==="manuale"?'<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verr\xE0 convertita nel nuovo schema semplice.</div>':"",Qt=S?"flag":yt(b.unitaMisura,"pz"),Ni=S?[{value:"flag",label:"Solo avviso"}]:[...new Set([Qt,...Pi])].filter(Boolean).map(E=>({value:E,label:E}));return`<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${r(b.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(b.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${r(b.codice||"")}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(b.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(b.id)}','modo','',this.value)">
                        <option value="quantificato" ${S?"":"selected"}>Materiale da contare</option>
                        <option value="segnalazione" ${S?"selected":""}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${r(i.id)}','${r(v.id)}','${r(b.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantit\xE0 per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${O.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(b.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(b.id)}','unitaMisura','',this.value)"
                            ${S?"disabled":""}>
                        ${Ni.map(E=>`<option value="${r(E.value)}" ${Qt===E.value?"selected":""}>${r(E.label)}</option>`).join("")}
                    </select>
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${r(i.id)}','${r(v.id)}','${r(b.id)}','tipo',this.value)">
                        <option value="sempre" ${O.tipo==="sempre"?"selected":""}>Sempre presente</option>
                        <option value="gruppo" ${O.tipo==="gruppo"?"selected":""}>Solo per scelte elettroniche</option>
                    </select>
                    ${O.tipo==="gruppo"?Ei:""}
                </div>
                ${O.tipo==="gruppo"?Mi:""}
                <input class="kit-cfg-input" value="${r(b.noteConfig||"")}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${r(i.id)}','${r(v.id)}','${r(b.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${S?"Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.":"Qui dici quanta parte serve per singolo faretto, scegli l'unit\xE0 e se vale sempre o solo per certe scelte elettroniche."}
                </div>
                ${Oi}
            </div>`}).join("");return`<div class="kit-cfg-sez-block" data-si="${C}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${r(v.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${r(i.id)}','${r(v.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${r(i.id)}','${r(v.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${r(i.id)}','${r(v.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${f}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${r(i.id)}','${r(v.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`}).join(""),_=`
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
        </div>`,K="";o.length?K=o.map(v=>{let C=(i.sottoAssembly||[]).map((b,S)=>({sa:b,i:S})).filter(({sa:b})=>b.varianteKey===v.key),f=C.map(({sa:b,i:S})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${r(b.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${r(i.id)}',${S},'nome',this.value)">
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${r(i.id)}',${S})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${r(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${C.length} part${C.length!==1?"i":"e"}</span>
                </div>
                ${f||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${r(i.id)}','${r(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${r(v.nome)}</button>
            </div>`}).join(""):K='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>';let ut=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantit\xE0 consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${K}
        </div>`,X={info:p,varianti:h,bom:_,sa:ut},V=nt(),ft=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${V.length?V.map(v=>`<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${r(v.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${r(v.sourceKitId&&z().kits.find(C=>C.id===v.sourceKitId)?.nome||"")}</div>
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
        </div>`;X.anagrafiche=ft;let tt=s.map(v=>`<button class="kit-tab ${F===v?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${v}')">${a[v]}</button>`).join("");n.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${r(i.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${r(i.nome)}</span>
        </div>
        <div class="kit-tabs">${tt}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${X[F]}</div>
    </div>`,rt(n)}function ln(t){if(t&&N===t){D();return}N=t,D()}function pn(t){F=t,j()}function I(t,i,n=!0){let{kits:e}=z(),o=e.find(s=>s.id===t);o&&(i(o),x(e),n&&j())}function mn(t,i){I(t,function(n){n.nome=i.trim()||"Kit senza nome"},!1)}function un(t){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:i}=z();x(i.filter(n=>n.id!==t)),Vt=null,N=null,st()}function fn(t){let{kits:i}=z(),n=i.find(o=>o.id===t);if(!n)return;let e={id:$(),nome:`Copia di ${n.nome}`,schemaVersion:Et,assiConfigurazione:[],varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};for(let o of n.assiConfigurazione||[])e.assiConfigurazione.push(oi(o,n,e));e.varianti=ei(e.assiConfigurazione);for(let o of n.sezioni||[])e.sezioni.push(kt(o,n,e));e.sottoAssembly=(n.sottoAssembly||[]).map(o=>({id:$(),nome:o.nome||"",varianteKey:o.varianteKey||"",noteConfig:o.noteConfig||""})),i.push(e),x(i),Ft(e.id),y(`Kit "${n.nome}" duplicato \u2713`)}function Ai(t){I(t,function(i){let n=(i.assiConfigurazione||[]).length+1;i.assiConfigurazione=i.assiConfigurazione||[],i.assiConfigurazione.push({id:$(),key:"asse"+n,nome:"Asse "+n,opzioni:[{id:$(),key:"opz1",nome:"Opzione 1"}]})})}function gn(t,i,n,e){I(t,function(o){let s=(o.assiConfigurazione||[]).find(a=>a.id===i);s&&(n==="key"?s.key=U(e,s.key||"asse"):s[n]=e.trim())})}function kn(t,i){I(t,function(n){n.assiConfigurazione=(n.assiConfigurazione||[]).filter(e=>e.id!==i)})}function vn(t,i){I(t,function(n){let e=(n.assiConfigurazione||[]).find(s=>s.id===i);if(!e)return;let o=(e.opzioni||[]).length+1;e.opzioni=e.opzioni||[],e.opzioni.push({id:$(),key:"opz"+o,nome:"Opzione "+o,codice:""})})}function bn(t,i,n,e,o){I(t,function(s){let a=(s.assiConfigurazione||[]).find(c=>c.id===i),d=a&&(a.opzioni||[]).find(c=>c.id===n);d&&(e==="key"?d.key=U(o,d.key||"opzione"):d[e]=o.trim())})}function yn(t,i,n){I(t,function(e){let o=(e.assiConfigurazione||[]).find(s=>s.id===i);o&&(o.opzioni=(o.opzioni||[]).filter(s=>s.id!==n))})}function hn(t){Ai(t)}function zn(t){I(t,function(i){i.sezioni=i.sezioni||[],i.sezioni.push({id:$(),nome:"Nuova sezione",componenti:[]})})}function wn(t){Si(t)}function _n(t,i,n,e){I(t,function(o){let s=(o.sezioni||[]).find(a=>a.id===i);s&&(s[n]=e.trim())},!1)}function Cn(t,i){confirm("Eliminare questa sezione e tutti i suoi componenti?")&&I(t,function(n){n.sezioni=(n.sezioni||[]).filter(e=>e.id!==i)})}function $n(t,i){I(t,function(n){let e=(n.sezioni||[]).find(o=>o.id===i);e&&(e.componenti=e.componenti||[],e.componenti.push({id:$(),nome:"Nuovo componente",codice:"",qtaPerVariante:{},caricato:0,modoComponente:"quantificato",tracciabile:!0,noteConfig:"",unitaMisura:"pz"}))})}function Sn(t,i,n,e,o,s){I(t,function(a){let d=(a.sezioni||[]).find(l=>l.id===i),c=d&&(d.componenti||[]).find(l=>l.id===n);if(c){if(e==="coeff"||e==="flag"){c.qtaPerVariante=c.qtaPerVariante||{},c.qtaPerVariante[o]=J(s);return}if(e==="modo"){c.modoComponente=s==="segnalazione"?"segnalazione":"quantificato",c.modoComponente==="segnalazione"?(c.tracciabile=!1,c.unitaMisura="flag"):c.unitaMisura==="flag"&&(c.unitaMisura="pz");return}if(e==="unitaMisura"){c.unitaMisura=c.modoComponente==="segnalazione"?"flag":yt(s,"pz");return}c[e]=s.trim()}},e!=="nome"&&e!=="noteConfig")}function In(t,i,n,e,o){I(t,function(s){let a=(s.sezioni||[]).find(l=>l.id===i),d=a&&(a.componenti||[]).find(l=>l.id===n);if(!d)return;let c=Tt(d,s);if(e==="tipo"){if(c.tipo=o==="gruppo"?"gruppo":"sempre",c.tipo==="gruppo"&&!c.asseId){c.asseId=s.assiConfigurazione?.[0]?.id||"";let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[]}}else if(e==="qtyBase")c.qtyBase=J(o);else if(e==="asseId"){c.asseId=String(o||"");let l=(s.assiConfigurazione||[]).find(m=>m.id===c.asseId);c.opzioneIds=l?.opzioni?.length?[l.opzioni[0].id]:[],c.tipo="gruppo"}d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Ot(d,s,c)})}function xn(t,i,n,e,o){I(t,function(s){let a=(s.sezioni||[]).find(m=>m.id===i),d=a&&(a.componenti||[]).find(m=>m.id===n);if(!d)return;let c=Tt(d,s),l=new Set(c.opzioneIds||[]);o?l.add(e):l.delete(e),c.tipo="gruppo",c.opzioneIds=[...l],d.applicazioneTipo=c.tipo,d.applicazioneAsseId=c.asseId,d.applicazioneOpzioneIds=c.opzioneIds,d.qtaBase=c.qtyBase,d.qtaPerVariante=Ot(d,s,c)})}function An(t,i,n,e){I(t,function(o){let s=(o.sezioni||[]).find(d=>d.id===i),a=s&&(s.componenti||[]).find(d=>d.id===n);!a||B(a)||(a.tracciabile=!!e)},!1)}function Mn(t,i,n){I(t,function(e){let o=(e.sezioni||[]).find(s=>s.id===i);o&&(o.componenti=(o.componenti||[]).filter(s=>s.id!==n))})}function En(t){I(t,function(i){i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:$(),nome:"",varianteKey:M(i)[0]?.key||""})})}function On(t,i){I(t,function(n){n.sottoAssembly=n.sottoAssembly||[],n.sottoAssembly.push({id:$(),nome:"",varianteKey:i,noteConfig:""})})}function Nn(t,i,n,e){I(t,function(o){o.sottoAssembly[i]&&(o.sottoAssembly[i][n]=e.trim())},!1)}function qn(t,i){I(t,function(n){n.sottoAssembly.splice(i,1)})}function Tn(t){let i=document.getElementById("modal-kit-distinta-edit");if(!i){vi(t);return}let{kits:n}=z(),e=n.find(c=>c.id===t);if(!e)return;let o=Q(e),s=R(o),a=document.getElementById("distinta-edit-nome"),d=document.getElementById("distinta-edit-documento");a&&(a.value=s.documento||""),d&&(d.value=s.documento||""),i.dataset.kitId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>a&&a.focus(),80)}function At(){let t=document.getElementById("modal-kit-distinta-edit");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Bn(){let t=document.getElementById("modal-kit-distinta-edit");if(!t)return;let i=t.dataset.kitId,n=(document.getElementById("distinta-edit-nome")?.value||"").trim(),e=(document.getElementById("distinta-edit-documento")?.value||"").trim();if(!n){y("Inserisci un nome per la distinta.","warning");return}P(i,function(m){let p=R(m);e?p.documento=e:p.documento||(p.documento=n),zt(m,p)});let{kits:o}=z(),s=o.find(m=>m.id===i);if(!s){At(),y("Kit non trovato \u26A0\uFE0F");return}let a=Q(s),d=wt(s,a);if(!d.totalePezzi||!d.totaleRighe){y("Componi prima un ordine per generare la distinta stampabile.","warning");return}let c=W(),l={id:$(),kitId:s.id,kitNome:s.nome,nome:n||a._meta?.documento||`Distinta-${Date.now()}`,documento:e||a._meta?.documento||"",createdAt:Date.now(),createdBy:L?.nome||"Sistema",orderDraftSnapshot:a,distintaSnapshot:d};c.unshift(l),ht(c),At(),y("Distinta salvata \u2713"),q==="distinte"&&Z("distinte")}function Vn(){window._kitOpenView=ve,window._kitOpenConfig=Ft,window._kitNuovoKit=Fe,window._kitBack=be,window._kitOpenPrintPreview=se,window._kitSwitchTab=ye,window._kitAggiornaQty=he,window._kitOrdineSet=ze,window._kitOrdineDelta=we,window._kitOrdineReset=_e,window._kitOrdineResetVoce=Ce,window._kitOrderSearch=$e,window._kitOrderHideSearch=Se,window._kitOrderPick=Ie,window._kitOrderRemoveRef=xe,window._kitComposeSelect=Ae,window._kitComposeAdd=Me,window._kitAggiornaCar=hi,window._kitAggiornaPronti=Ee,window._kitSetPronti=Oe,window._kitApriModalSped=Pe,window._kitChiudiModalSped=Ci,window._kitConfermaSpedizione=Le,window._kitApriModalReso=Re,window._kitChiudiModalReso=$i,window._kitResoQtyChange=He,window._kitResoAggiornaBOM=jt,window._kitConfermaReso=je,window._kitSalvaMovimento=qe,window._kitEliminaMovimento=Te,window._kitModificaMovimento=Ke,window._kitChiudiModalEditMov=_i,window._kitConfermaModificaMov=De,window._kitChiudiModalDelMov=zi,window._kitConfermaEliminaMov=wi,window._kitSalvaManuale=Ve,window._kitElimina=un,window._kitDuplicaKit=fn,window._kitCfgBack=ln,window._kitCfgSwitchTab=pn,window._kitCfgSaveNome=mn,window._kitCfgAddVar=hn,window._kitCfgOpenImportModal=Si,window._kitCfgOpenImportAsseModal=Ue,window._kitCfgOpenCopySezModal=Qe,window._kitCfgCloseImportModal=et,window._kitCfgSetImportMode=Ge,window._kitCfgSetImportSearch=Je,window._kitCfgSelectImportSource=Ye,window._kitCfgSelectImportSection=We,window._kitCfgToggleImportTarget=Ze,window._kitCfgSelectAllImportTargets=Xe,window._kitCfgClearImportTargets=tn,window._kitCfgConfirmImport=en,window._kitOpenPresetsModal=nn,window._kitClosePresetsModal=Ii,window._kitSetPresetsSearch=on,window._kitSelectPreset=sn,window._kitCreatePresetFromSection=an,window._kitCreatePreset=xi,window._kitApplyPreset=rn,window._kitRenamePreset=cn,window._kitDeletePreset=dn,window._kitCfgAddAsse=Ai,window._kitCfgUpdateAsse=gn,window._kitCfgDelAsse=kn,window._kitCfgAddOpzione=vn,window._kitCfgUpdateOpzione=bn,window._kitCfgDelOpzione=yn,window._kitCfgAddSez=zn,window._kitCfgImportSez=wn,window._kitCfgUpdateSez=_n,window._kitCfgDelSez=Cn,window._kitCfgAddComp=$n,window._kitCfgUpdateComp=Sn,window._kitCfgUpdateCompRule=In,window._kitCfgToggleCompOption=xn,window._kitCfgToggleCompTracked=An,window._kitCfgDelComp=Mn,window._kitCfgAddSA=En,window._kitCfgAddSAForVariant=On,window._kitCfgUpdateSA=Nn,window._kitCfgDelSA=qn,window._kitSwitchMainTab=Z,window._kitRenderKitsGrid=fi,window._kitRenderAnagrafichePage=gi,window._kitRenderDistintePage=ki,window._kitLoadDistinte=W,window._kitSaveDistinte=ht,window._kitCreateDistintaFromDraft=vi,window._kitLoadAnagrafiche=mt,window._kitSaveAnagrafiche=Ht,window._kitOpenAnagraficaModal=pe,window._kitCloseAnagraficaModal=bi,window._kitConfirmSaveAnagrafica=me,window._kitDeleteAnagrafica=ue,window._kitRenderHeaderActions=Rt,window._kitOpenSaveDistintaModal=Tn,window._kitCloseSaveDistintaModal=At,window._kitConfirmSaveDistinta=Bn,window._kitDistintaOpenPrint=fe,window._kitDistintaApplyToDraft=ge,window._kitDistintaDelete=ke}var Mt,gt,Wt,Gt,Zt,Et,Pi,Xt,Li,ti,Ri,xt,G,ct,It,q,dt,Yt,N,yi,Vt,F,w,A,Fn,Kn=qi(()=>{Ti();Ki();Di();Bi();Mt="_mlKitData",gt="_mlKitDataTs",Wt="_mlKitOrderDrafts",Gt="_mlKitOrderDraftSeq",Zt="_mlKitPresetSections",Et=2,Pi=["pz","mt","cm","mm","kg","g","lt","ml"],Xt="_mlKitDistinte",Li="_mlKitDistinteTs",ti="_mlKitAnagrafiche",Ri="_mlKitAnagraficheTs",xt=!1,G=[],ct=null,It={},q="kits";dt={};Yt=null;N=null,yi="ordine";Vt=null,F="info",w=null,A=null;Fn=st});Kn();export{st as caricaKitProdotti,Fn as default,Vn as registerGlobals,jn as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-RELPZZAO.js.map
