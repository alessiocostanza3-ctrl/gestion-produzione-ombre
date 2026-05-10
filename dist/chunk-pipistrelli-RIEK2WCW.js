import{c as ft}from"./chunk-chunk-ZSRTXJ56.js";import{a as mt,c as tt,e as dt,f as B,g as I,h as it,l as ut,m as C,q as vt,r as P,u as yt}from"./chunk-chunk-IFEY26QL.js";function Gt(){D=!1}function x(){try{return JSON.parse(localStorage.getItem(G))||{p:0,m:0,g:0}}catch{return{p:0,m:0,g:0}}}function v(){try{return JSON.parse(localStorage.getItem(k))||{}}catch{return{}}}function h(){try{return JSON.parse(localStorage.getItem(F))||{}}catch{return{}}}function ot(t){try{localStorage.setItem(G,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}R()}function _(t){try{localStorage.setItem(k,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}R()}function q(t){try{localStorage.setItem(F,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}R()}function g(){try{return JSON.parse(localStorage.getItem(J))||[]}catch{return[]}}function $(t){try{localStorage.setItem(J,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}R()}function R(){clearTimeout(et),et=setTimeout(function(){P({azione:"setPipData",qty:x(),caricato:v(),pronti:h(),movimenti:g()}).catch(function(t){console.warn("[pipistrelli] salvataggio remoto fallito:",t)})},1500)}function gt(t){fetch(tt,{method:"POST",body:JSON.stringify({azione:"getPipData"})}).then(function(s){return s.json()}).then(function(s){var o=parseInt(s.ts||0),i=parseInt(localStorage.getItem("pip_local_ts")||0);if(o>0&&o>i){if(s.qty)try{localStorage.setItem(G,JSON.stringify(s.qty))}catch{}if(s.caricato)try{localStorage.setItem(k,JSON.stringify(s.caricato))}catch{}if(s.pronti)try{localStorage.setItem(F,JSON.stringify(s.pronti))}catch{}if(s.movimenti&&Array.isArray(s.movimenti)&&s.movimenti.length>0)try{localStorage.setItem(J,JSON.stringify(s.movimenti))}catch{}try{localStorage.setItem("pip_local_ts",o)}catch{}t&&t(!0)}else t&&t(!1)}).catch(function(){t&&t(!1)})}function bt(){let t=g();if(!t.length)return null;let s={};return[...t].reverse().forEach(o=>{if(o.tipo==="carico"){let i=parseInt(o.idx);isNaN(i)||(s[i]=Number(s[i]||0)+(o.qty||0))}else if(o.tipo==="scarico"){let i=parseInt(o.idx);isNaN(i)||(s[i]=Math.max(0,Number(s[i]||0)-(o.qty||0)))}else(o.tipo==="spedizione"||o.tipo==="assemb")&&(o.righe||[]).forEach(i=>{let e=parseInt(i.idx);isNaN(e)||(s[e]=Math.max(0,Number(s[e]||0)-(i.qty||0)))})}),s}function L(){let t=h(),s={};[["TESTA","p","t_p"],["TESTA","m","t_m"],["TESTA","g","t_g"],["CORDONE","p","c_p"],["CORDONE","m","c_m"],["CORDONE","g","c_g"]].forEach(([i,e,a])=>{let c=t[a]||0;c&&(T[i]?.[e]||[]).forEach(([r,p])=>{s[r]=(s[r]||0)+c*p})});let o=t.a||0;return o&&(s[21]=(s[21]||0)+o),s}function ht(){let t=v(),s=L();function o(n){return Math.max(0,Number(t[n]||0)-(s[n]||0))}function i(n){if(!n||!n.length)return 0;let l=1/0;for(let[m,d]of n){let u=Math.floor(o(m)/d);u<l&&(l=u)}return l===1/0?0:l}let e=o(21),a=["p","m","g"].map(n=>{let l=i(T.TESTA[n]),m=i(T.CORDONE[n]),d=Math.min(l,m);return{fmt:n,maxTesta:l,maxCordone:m,max:d}}),c=a.reduce((n,l)=>n+l.max,0),r=e>=c,p=Math.min(c,e);return{formati:a,alimLib:e,totSenzaAlim:c,alimSufficienti:r,totConAlim:p}}function V(){let t=document.getElementById("pip-sped-calc-inner");if(!t)return;let{formati:s,alimLib:o,totSenzaAlim:i,alimSufficienti:e,totConAlim:a}=ht(),c={p:"500mA",m:"600mA",g:"700mA"},r={p:{label:"Piccolo",emoji:"\u{1F535}"},m:{label:"Medio",emoji:"\u{1F7E3}"},g:{label:"Grande",emoji:"\u{1F534}"}},p=s.map(({fmt:u,maxTesta:f,maxCordone:A,max:y})=>{let{label:M,emoji:w}=r[u],z=f<A&&f<1/0?"pip-sped-comp--bottleneck":"",O=A<f&&A<1/0?"pip-sped-comp--bottleneck":"",j=y>0?"pip-sped-result--ok":"pip-sped-result--zero";return`<div class="pip-sped-item">
      <div class="pip-sped-item-label">${w} ${M} <span class="pip-pronti-ma">${c[u]}</span></div>
      <div class="pip-sped-comp ${z}"><span>\u{1F529} Teste</span><span class="pip-sped-comp-num">${f}</span></div>
      <div class="pip-sped-comp ${O}"><span>\u{1F50C} Cordoni</span><span class="pip-sped-comp-num">${A}</span></div>
      <div class="pip-sped-result ${j}">
        <span class="pip-sped-result-num">${y}</span>
        <span class="pip-sped-result-lbl">complet${y===1?"o":"i"}</span>
      </div>
    </div>`}).join(""),n=e?"pip-sped-alim--ok":"pip-sped-alim--warn",l=e?'<i class="fas fa-check-circle" style="color:#16a34a"></i>':'<i class="fas fa-exclamation-triangle" style="color:#d97706"></i>',m=e?"Sufficienti per tutti i formati":`Ne servirebbero <strong>${i}</strong> per spedire tutti`,d=a>0?`<div class="pip-sped-total">Totale spedizionabili: <strong class="pip-sped-total-num">${a}</strong> pipistrelli${e?"":' <span class="pip-sped-total-sub">(limitato dagli alimentatori)</span>'}</div>`:'<div class="pip-sped-empty"><i class="fas fa-box-open"></i> Componenti insufficienti per completare un pipistrello</div>';t.innerHTML=`
    <div class="pip-sped-grid">${p}</div>
    <div class="pip-sped-alim ${n}">
      <span class="pip-sped-alim-ico">\u{1F50B}</span>
      <span class="pip-sped-alim-label">Alimentatori disponibili: <strong>${o}</strong></span>
      <span class="pip-sped-alim-status">${l} ${m}</span>
    </div>
    ${d}`}function N(){let t=L(),s=v();document.querySelectorAll("#pip-tbody tr").forEach(o=>{let i=parseInt(o.dataset.idx),e=Number(s[i]||0),a=t[i]||0,c=o.querySelector(".pip-car-liberi");c&&(a>0?(c.textContent=Math.max(0,e-a)+" lib.",c.style.display=""):c.style.display="none")}),V()}function At(t,s){let o=h();o[t]=Math.max(0,(o[t]||0)+s),q(o),N(),U()}function _t(t,s){let o=h();o[t]=Math.max(0,parseInt(s)||0),q(o),N();let i=document.querySelector(`.pip-pronti-input[data-key="${t}"]`);i&&(i.value=o[t],i.classList.toggle("pip-pronti-val-on",o[t]>0))}function U(){let t=h(),s=[{titolo:"\u{1F529} Teste",items:[{key:"t_p",label:"Testa",mA:"500mA",emoji:"\u{1F529}"},{key:"t_m",label:"Testa",mA:"600mA",emoji:"\u{1F529}"},{key:"t_g",label:"Testa",mA:"700mA",emoji:"\u{1F529}"}]},{titolo:"\u{1F50C} Cordoni",items:[{key:"c_p",label:"Cordone",mA:"500mA",emoji:"\u{1F50C}"},{key:"c_m",label:"Cordone",mA:"600mA",emoji:"\u{1F50C}"},{key:"c_g",label:"Cordone",mA:"700mA",emoji:"\u{1F50C}"}]},{titolo:"\u{1F50B} Alimentatori",items:[{key:"a",label:"Alimentatore",mA:"",emoji:"\u{1F50B}"}]}],o=document.getElementById("pip-pronti-grid");o&&(o.innerHTML=s.map(i=>{let e=i.items.map(a=>{let c=t[a.key]||0;return`<div class="pip-pronti-row">
        <span class="pip-pronti-lbl">${a.emoji} ${a.label}${a.mA?` <span class="pip-pronti-ma">${a.mA}</span>`:""}</span>
        <div class="pip-pronti-ctrl">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${a.key}',-1)">\u2212</button>
          <input class="pip-pronti-input${c>0?" pip-pronti-val-on":""}" type="number" min="0"
                 data-key="${a.key}" value="${c}"
                 oninput="_pipSetPronti('${a.key}', this.value)"
                 onchange="_pipSetPronti('${a.key}', this.value)">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${a.key}',1)">+</button>
        </div>
      </div>`}).join("");return`<div class="pip-pronti-sezione"><div class="pip-pronti-sezione-titolo">${i.titolo}</div>${e}</div>`}).join(""))}function It(t){let s=1;for(let o=t+1;o<b.length&&b[o][0]==="";o++)s++;return s}function Et(){let t=Math.max(0,parseInt(document.getElementById("pip-qty-p")?.value)||0),s=Math.max(0,parseInt(document.getElementById("pip-qty-m")?.value)||0),o=Math.max(0,parseInt(document.getElementById("pip-qty-g")?.value)||0);ot({p:t,m:s,g:o});let i=document.getElementById("pip-tot");i&&(i.textContent=t+s+o);let e=v();document.querySelectorAll("#pip-tbody tr").forEach(a=>{let c=parseInt(a.dataset.idx),r=b[c],p=t*r[2]+s*r[3]+o*r[4],n=Number(e[c]||0),l=Math.max(0,p-n),m=a.querySelector(".pip-fab, .pip-fab-zero"),d=a.querySelector('[class^="pip-ord"]');m&&(m.textContent=p>0?p:"\u2014",m.className=p===0?"pip-fab pip-fab-zero":"pip-fab"),d&&(d.textContent=p===0?"\u2014":l,d.className=p===0?"pip-ord-zero":l>0?"pip-ord-manca":"pip-ord-ok")})}function E(t){let s=parseInt(t.dataset.idx),o=Math.max(0,parseInt(t.value)||0),i=v();i[s]=o,_(i);let e=x(),a=b[s],c=e.p*a[2]+e.m*a[3]+e.g*a[4],r=Math.max(0,c-o),p=t.closest("tr"),n=p?.querySelector('[class^="pip-ord"]');n&&(n.textContent=c===0?"\u2014":r,n.className=c===0?"pip-ord-zero":r>0?"pip-ord-manca":"pip-ord-ok");let m=L()[s]||0,d=p?.querySelector(".pip-car-liberi");d&&(m>0?(d.textContent=Math.max(0,o-m)+" lib.",d.style.display=""):d.style.display="none"),V()}function $t(){let t=document.getElementById("pip-save-btn"),s=document.getElementById("pip-save-label");!t||!s||(t.disabled=!0,t.classList.remove("pip-save-ok","pip-save-err"),t.classList.add("pip-save-loading"),s.textContent="Salvataggio\u2026",P({azione:"setPipData",qty:x(),caricato:v(),pronti:h(),movimenti:g()}).then(function(){try{localStorage.setItem("pip_local_ts",Date.now())}catch{}t.classList.remove("pip-save-loading"),t.classList.add("pip-save-ok"),s.textContent="Salvato \u2713",setTimeout(function(){t.classList.remove("pip-save-ok"),s.textContent="Salva",t.disabled=!1},2500)}).catch(function(){t.classList.remove("pip-save-loading"),t.classList.add("pip-save-err"),s.textContent="Errore \u2717",setTimeout(function(){t.classList.remove("pip-save-err"),s.textContent="Salva",t.disabled=!1},3e3)}))}function St(t){let s=document.getElementById("pip-mov-mat"),o=document.getElementById("pip-mov-qty"),i=document.getElementById("pip-mov-nota");if(!s||!o)return;let e=parseInt(s.value),a=Math.max(1,parseInt(o.value)||1),c=(i?.value||"").trim(),r=b[e]?.[1]||"?",p=v();t==="carico"?p[e]=Number(p[e]||0)+a:p[e]=Math.max(0,Number(p[e]||0)-a),_(p);let n=document.querySelector(`#pip-tbody input[data-idx="${e}"]`);n&&(n.value=p[e],E(n));let l=g();l.unshift({id:Date.now(),idx:e,tipo:t,qty:a,nota:c,mat:r,ts:new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}),$(l),o.value=1,i&&(i.value=""),S()}function Mt(t){if(!W())return;let o=g().find(i=>i.id===t);o&&Ct(t,o)}function Ct(t,s){let o=document.getElementById("modal-pip-del-mov");if(!o)return;let i=document.getElementById("pip-del-mov-desc"),e;if(s.tipo==="reso"){let c=s.totPz||0,r=(s.righe||[]).length,p=(s.scartate||[]).length;e=`<span class="pip-mov-badge reso" style="font-size:0.75rem">RESO</span>
     <strong>Rientro \xD7${c} pz</strong>
     <br><span style="color:#64748b;font-size:0.82rem">${r} comp. recuperati \xB7 ${p} comp. scartati</span>
     ${s.nota?`<br><span style="color:#64748b;font-size:0.82rem">${s.nota}</span>`:""}`}else{let c=s.tipo==="carico"?"CARICO":"SCARICO";e=`<span class="pip-mov-badge ${s.tipo}" style="font-size:0.75rem">${c}</span>
     <strong>${s.mat}</strong> &nbsp;${s.tipo==="carico"?"+":"\u2212"}${s.qty} pz
     ${s.nota?`<br><span style="color:#64748b;font-size:0.82rem">${s.nota}</span>`:""}`}i&&(i.innerHTML=e);let a=document.getElementById("btn-pip-del-ok");a&&(a.onclick=()=>at(t)),o.style.display="flex",o.offsetHeight,o.classList.add("active")}function st(){let t=document.getElementById("modal-pip-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function at(t){st();let s=g(),o=s.find(e=>e.id===t);if(!o)return;let i=v();if(o.tipo==="assemb"||o.tipo==="spedizione")(o.righe||[]).forEach(e=>{i[e.idx]=Number(i[e.idx]||0)+e.qty}),_(i),(o.righe||[]).forEach(e=>{let a=document.querySelector(`#pip-tbody input[data-idx="${e.idx}"]`);a&&(a.value=i[e.idx],E(a))});else if(o.tipo==="reso")(o.righe||[]).forEach(e=>{i[e.idx]=Math.max(0,Number(i[e.idx]||0)-e.qty)}),_(i),(o.righe||[]).forEach(e=>{let a=document.querySelector(`#pip-tbody input[data-idx="${e.idx}"]`);a&&(a.value=i[e.idx],E(a))});else{o.tipo==="carico"?i[o.idx]=Math.max(0,Number(i[o.idx]||0)-o.qty):i[o.idx]=Number(i[o.idx]||0)+o.qty,_(i);let e=document.querySelector(`#pip-tbody input[data-idx="${o.idx}"]`);e&&(e.value=i[o.idx],E(e))}$(s.filter(e=>e.id!==t)),S(),I("Movimento eliminato \u2713")}function S(){let t=document.getElementById("pip-mov-list");if(!t)return;let s=g(),o=W();if(s.length===0){t.innerHTML='<div class="pip-mov-empty">Nessun movimento registrato</div>';return}t.innerHTML=s.map(i=>{let e=o?`<button class="pip-mov-del" onclick="_pipEliminaMovimento(${i.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',a=o&&(i.tipo==="carico"||i.tipo==="scarico")?`<button class="pip-mov-edit" onclick="_pipModificaMovimento(${i.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(i.tipo==="spedizione"){let c=(i.items||[]).reduce((m,d)=>m+d.qty,0),r={};(i.items||[]).forEach(m=>{r[m.mA]=(r[m.mA]||0)+m.qty});let p=Object.entries(r).map(([m,d])=>`<span class="pip-sped-ma-pill">${m} \xD7${d}</span>`).join(""),n=(i.items||[]).map(m=>`<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${m.emoji} ${m.tipoLabel} ${m.fmtLabel} <span class="pip-pronti-ma">${m.mA}</span></span>
          <span class="pip-mov-qty scarico">\xD7${m.qty}</span>
        </div>`).join(""),l=(i.righe||[]).map(m=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8">${m.mat}</span>
          <span class="pip-mov-qty scarico">\u2212${m.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge spedizione">SPED.</span>
            <span class="pip-mov-assemb-label">\u{1F69A} Spediz. \xD7${c} pz ${p}</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${e}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${n}</div>
            <div class="pip-sped-bom-divider">componenti scaricati</div>
            ${l}
          </div>
        </details>`}if(i.tipo==="assemb"){let c=i.assembTipo==="Testa"?"\u{1F529}":"\u{1F50C}",r=i.assembFmt==="Piccolo"?"500mA":i.assembFmt==="Medio"?"600mA":"700mA",p=(i.righe||[]).map(n=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat">${n.mat}</span>
          <span class="pip-mov-qty scarico">\u2212${n.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge assemb">${r}</span>
            <span class="pip-mov-assemb-label">${c} ${i.assembTipo} ${i.assembFmt} \xD7${i.assembQty}</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${e}
          </summary>
          <div class="pip-assemb-sub-list">${p}</div>
        </details>`}if(i.tipo==="reso"){let c=i.totPz||0,r=(i.items||[]).map(l=>`<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${l.emoji} ${l.label}${l.mA?` <span class="pip-pronti-ma">${l.mA}</span>`:""}</span>
          <span class="pip-mov-qty carico">\xD7${l.qty}</span>
        </div>`).join(""),p=(i.righe||[]).map(l=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#15803d">\u2713 ${l.mat}</span>
          <span class="pip-mov-qty carico">+${l.qty}</span>
        </div>`).join(""),n=(i.scartate||[]).map(l=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${l.mat}</span>
          <span class="pip-mov-qty" style="color:#94a3b8">\u2715 ${l.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group pip-mov-reso-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge reso">RESO</span>
            <span class="pip-mov-assemb-label">\u{1F4E6} Rientro \xD7${c} pz</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${e}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${r}</div>
            ${p?`<div class="pip-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${p}`:""}
            ${n?`<div class="pip-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${n}`:""}
          </div>
        </details>`}return`
      <div class="pip-mov-item ${i.tipo}">
        <span class="pip-mov-badge ${i.tipo}">${i.tipo==="carico"?"CARICO":"SCARICO"}</span>
        <span class="pip-mov-mat">${i.mat}</span>
        <span class="pip-mov-qty ${i.tipo}">${i.tipo==="carico"?"+":"\u2212"}${i.qty}</span>
        ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:'<span class="pip-mov-nota"></span>'}
        <span class="pip-mov-ts">${i.ts}</span>
        ${a}${e}
      </div>`}).join("")}function W(){if(!C||!C.nome)return!1;let t=String(C.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||C.ruolo==="MASTER"}function Tt(t){if(!W())return;let o=g().find(r=>r.id===t);if(!o)return;let i=document.getElementById("modal-pip-edit-mov");if(!i)return;let e=document.getElementById("pip-edit-mov-mat"),a=document.getElementById("pip-edit-mov-qty"),c=document.getElementById("pip-edit-mov-nota");e&&(e.innerHTML=`<span class="pip-mov-badge ${B(o.tipo)}" style="font-size:0.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${B(o.mat)}</strong>`),a&&(a.value=o.qty),c&&(c.value=o.nota||""),i.dataset.movId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function nt(){let t=document.getElementById("modal-pip-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function xt(){let t=document.getElementById("modal-pip-edit-mov");if(!t)return;let s=Number(t.dataset.movId);nt();let o=g(),i=o.findIndex(n=>n.id===s);if(i===-1)return;let e=o[i],a=parseInt(document.getElementById("pip-edit-mov-qty")?.value),c=(document.getElementById("pip-edit-mov-nota")?.value||"").trim();if(isNaN(a)||a<=0){I("Quantit\xE0 non valida \u26A0\uFE0F");return}let r=a!==e.qty,p=c!==(e.nota||"").trim();if(!(!r&&!p)){if(r){let n=a-e.qty,l=v();e.tipo==="carico"?l[e.idx]=Math.max(0,Number(l[e.idx]||0)+n):l[e.idx]=Math.max(0,Number(l[e.idx]||0)-n),_(l);let m=document.querySelector(`#pip-tbody input[data-idx="${e.idx}"]`);m&&(m.value=l[e.idx],E(m))}o[i]={...e,qty:a,nota:c},$(o),S(),I("Movimento aggiornato \u2713")}}function qt(){let t=h(),s=H.filter(e=>(t[e.key]||0)>0).map(e=>({...e,qty:t[e.key]}));if(!s.length){I("Nessun articolo da spedire \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("pip-sped-items");o&&(o.innerHTML=s.map(e=>`
      <label class="pip-sped-item-row">
        <input type="checkbox" class="pip-sped-chk" data-key="${e.key}" checked>
        <span class="pip-sped-item-info">
          <span class="pip-sped-item-emoji">${e.emoji}</span>
          <span class="pip-sped-item-label">${e.tipoLabel}${e.mA?` <span class="pip-pronti-ma">${e.mA}</span>`:""}</span>
          <span class="pip-sped-item-qty">\xD7${e.qty}</span>
        </span>
      </label>`).join(""),o.querySelectorAll(".pip-sped-chk").forEach(e=>e.addEventListener("change",Q))),Q();let i=document.getElementById("modal-pip-spedizione");i&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function Q(){let t=[...document.querySelectorAll(".pip-sped-chk:checked")].map(p=>p.dataset.key),s=t.some(p=>p.startsWith("t_")),o=t.some(p=>p.startsWith("c_")),i=t.includes("a"),e=document.getElementById("pip-sped-warning"),a=document.getElementById("pip-sped-warning-msg"),c=document.getElementById("btn-pip-sped-ok");if(!t.length){e&&(e.style.display="flex"),a&&(a.textContent="Nessun articolo selezionato."),c&&(c.disabled=!0);return}c&&(c.disabled=!1);let r=[];s||r.push("Teste"),o||r.push("Cordoni"),i||r.push("Alimentatori"),r.length>0&&r.length<3?(e&&(e.style.display="flex"),a&&(a.textContent=`Attenzione: stai spedendo senza ${r.join(" e ")} \u2014 normalmente Testa, Cordone e Alimentatore vanno spediti insieme. Confermi comunque?`)):e&&(e.style.display="none")}function wt(){let t=[...document.querySelectorAll(".pip-sped-chk:checked")].map(d=>d.dataset.key);if(!t.length)return;let s=h(),o=H.filter(d=>t.includes(d.key)&&(s[d.key]||0)>0).map(d=>({...d,qty:s[d.key]}));if(!o.length)return;let i=(document.getElementById("pip-spedizione-nota")?.value||"").trim(),e=v(),a={};o.forEach(d=>{let u=T[d.tipo]?.[d.fmt];u&&u.forEach(([f,A])=>{let y=d.qty*A;e[f]=Math.max(0,Number(e[f]||0)-y),a[f]?a[f].qty+=y:a[f]={idx:f,mat:b[f]?.[1]||"?",qty:y}})});let c=Object.values(a);_(e);let r=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}),p=g();p.unshift({id:Date.now(),tipo:"spedizione",items:o,righe:c,nota:i,ts:r}),$(p);let n={...h()};if(t.forEach(d=>{delete n[d]}),q(n),!H.filter(d=>(n[d.key]||0)>0).length){let d=document.getElementById("pip-spedizione-nota");d&&(d.value="")}c.forEach(d=>{let u=document.querySelector(`#pip-tbody input[data-idx="${d.idx}"]`);u&&(u.value=e[d.idx],E(u))}),pt(),U(),N(),S();let m=o.reduce((d,u)=>d+u.qty,0);I(`Spedizione registrata: ${m} pz scaricati \u2713`)}function pt(){let t=document.getElementById("modal-pip-spedizione");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Ot(){let t=document.getElementById("modal-pip-reso");if(!t)return;Z.forEach(o=>{let i=document.getElementById("pip-reso-qty-"+o.key);i&&(i.value=0)});let s=document.getElementById("pip-reso-nota");s&&(s.value=""),X(),t.style.display="flex",t.offsetHeight,t.classList.add("active")}function ct(){let t=document.getElementById("modal-pip-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Pt(t,s){let o=document.getElementById("pip-reso-qty-"+t);o&&(o.value=Math.max(0,(parseInt(o.value)||0)+s),X())}function X(){let t={};Z.forEach(i=>{let e=parseInt(document.getElementById("pip-reso-qty-"+i.key)?.value)||0;if(!e)return;(T[i.tipo]?.[i.fmt]||[]).forEach(([c,r])=>{t[c]=(t[c]||0)+e*r}),i.key==="a"&&(t[21]=(t[21]||0)+e)});let s=document.getElementById("pip-reso-bom-list");if(!s)return;let o=Object.entries(t).filter(([,i])=>i>0);if(!o.length){s.innerHTML='<div class="pip-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}s.innerHTML=o.map(([i,e])=>{let a=b[parseInt(i)]?.[1]||"?";return`<label class="pip-reso-bom-row">
      <input type="checkbox" class="pip-reso-bom-chk" data-idx="${i}" data-qty="${e}" checked>
      <span class="pip-reso-bom-mat">${a}</span>
      <span class="pip-reso-bom-qty">+${e}</span>
    </label>`}).join("")}function kt(){let t=[];if(Z.forEach(p=>{let n=parseInt(document.getElementById("pip-reso-qty-"+p.key)?.value)||0;n>0&&t.push({...p,qty:n})}),!t.length){I("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let s=[],o=[];document.querySelectorAll(".pip-reso-bom-chk").forEach(p=>{let n=parseInt(p.dataset.idx),l=parseInt(p.dataset.qty),m=b[n]?.[1]||"?";p.checked?s.push({idx:n,mat:m,qty:l}):o.push({idx:n,mat:m,qty:l})});let i=(document.getElementById("pip-reso-nota")?.value||"").trim(),e=v();s.forEach(p=>{e[p.idx]=Number(e[p.idx]||0)+p.qty}),_(e),s.forEach(p=>{let n=document.querySelector(`#pip-tbody input[data-idx="${p.idx}"]`);n&&(n.value=e[p.idx],E(n))});let a=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}),c=g(),r=t.reduce((p,n)=>p+n.qty,0);c.unshift({id:Date.now(),tipo:"reso",items:t,righe:s,scartate:o,nota:i,ts:a,totPz:r}),$(c),ct(),S(),N(),I(`Reso registrato: ${r} pz \u2014 ${s.length} componenti recuperati \u2713`)}function Rt(t){let s=document.getElementById("pip-mov-body");if(!s)return;let o=s.style.display==="none";s.style.display=o?"":"none";let i=t.querySelector("i");i&&(i.className=o?"fas fa-chevron-down":"fas fa-chevron-up")}function Lt(){confirm("Vuoi azzerare tutto (quantit\xE0, magazzino e movimenti)?")&&(ot({p:0,m:0,g:0}),_({}),$([]),q({}),Y())}function Y(){D||(D=!0,gt(function(n){n&&Y()}));let t=v(),s=g();if((Object.keys(t).length===0||Object.values(t).every(n=>Number(n)===0))&&s.some(n=>n.tipo==="carico"||n.tipo==="scarico")){let n=bt();if(n&&Object.values(n).some(l=>l>0))try{localStorage.setItem(k,JSON.stringify(n))}catch{}}let i=document.getElementById("contenitore-dati"),e=x(),a=v(),c=L(),r=b.map((n,l)=>{let[m,d,u,f,A]=n,y=e.p*u+e.m*f+e.g*A,M=Number(a[l]||0),w=c[l]||0,z=Math.max(0,M-w),O=Math.max(0,y-M),j=y===0?"pip-ord-zero":O>0?"pip-ord-manca":"pip-ord-ok",lt=m?`<td class="pip-sez-cell" rowspan="${It(l)}">${m}</td>`:"",rt=[u,f,A].map(K=>K>0?`<td class="pip-coeff pip-coeff-on">${K}</td>`:'<td class="pip-coeff pip-coeff-off">\u2014</td>').join("");return`<tr data-idx="${l}" class="${m?"pip-row-sez-start":""}">
      ${lt}
      <td class="pip-mat">${d}</td>
      ${rt}
      <td class="pip-fab${y===0?" pip-fab-zero":""}">${y>0?y:"\u2014"}</td>
      <td class="pip-car-cell">
        <input class="pip-car-input" type="number" min="0" value="${M}"
               data-idx="${l}" oninput="_pipAggiornaCar(this)" onchange="_pipAggiornaCar(this)">
        <span class="pip-car-liberi"${w>0?"":' style="display:none"'}>${z} lib.</span>
      </td>
      <td class="${j}">${y===0?"\u2014":O}</td>
    </tr>`}).join(""),p=b.map((n,l)=>`<option value="${l}">[${n[0]||b.slice(0,l).reverse().find(m=>m[0])?.[0]||"?"}] ${n[1]}</option>`).join("");i.innerHTML=`
    <div class="pip-page">
      <!-- TITOLO -->
      <div class="pip-header">
        <div class="pip-header-title">
          <span class="pip-header-icon">\u{1F987}</span>
          <div>
            <div class="pip-header-brand">MARTINELLI LUCE</div>
            <div class="pip-header-product">Pipistrello \u2014 Pianificazione Mensile</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
          <button class="pip-reset-btn" onclick="_pipReset()" title="Reset tutto">
            <i class="fas fa-rotate-left"></i> Reset
          </button>
          <button class="pip-save-btn" id="pip-save-btn" onclick="_pipSalvaManuale()" title="Salva dati sul server">
            <i class="fas fa-cloud-arrow-up"></i> <span id="pip-save-label">Salva</span>
          </button>
        </div>
      </div>

      <!-- CARD QT\xC0 -->
      <div class="pip-qty-card">
        <div class="pip-qty-label">QT\xC0 DA PRODURRE QUESTO MESE</div>
        <div class="pip-qty-inputs">
          <div class="pip-qty-item">
            <label>\u{1F535} Piccolo<br><small>500mA</small></label>
            <input class="pip-qty-input" id="pip-qty-p" type="number" min="0" value="${e.p}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>\u{1F7E3} Medio<br><small>600mA</small></label>
            <input class="pip-qty-input" id="pip-qty-m" type="number" min="0" value="${e.m}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>\u{1F534} Grande<br><small>700mA</small></label>
            <input class="pip-qty-input" id="pip-qty-g" type="number" min="0" value="${e.g}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-total-box">
            <div class="pip-qty-total-label">TOTALE</div>
            <div class="pip-qty-total-val" id="pip-tot">${e.p+e.m+e.g}</div>
          </div>
        </div>
      </div>

      <!-- TABELLA BOM -->
      <div class="pip-table-wrap">
        <table class="pip-table">
          <thead>
            <tr>
              <th>SEZIONE</th>
              <th>MATERIALE</th>
              <th class="pip-col-coeff" title="Piccolo 500mA">\xD7 P</th>
              <th class="pip-col-coeff" title="Medio 600mA">\xD7 M</th>
              <th class="pip-col-coeff" title="Grande 700mA">\xD7 G</th>
              <th>FABBISOGNO</th>
              <th>CARICATO</th>
              <th>DA ORDINARE</th>
            </tr>
          </thead>
          <tbody id="pip-tbody">
            ${r}
          </tbody>
        </table>
      </div>

      <!-- LEGENDA -->
      <div class="pip-legend">
        <span class="pip-leg-item pip-ord-manca" style="padding:2px 7px;border-radius:5px;">\u25CF mancante</span>
        <span class="pip-leg-item pip-ord-ok" style="padding:2px 7px;border-radius:5px;">\u25CF disponibile</span>
        <span class="pip-leg-item" style="color:#9ca3af">\u2014 = non necessario</span>
      </div>

      <!-- CAPACIT\xC0 DI SPEDIZIONE -->
      <div class="pip-assemb-card pip-sped-calc-card">
        <div class="pip-assemb-title"><i class="fas fa-truck-fast"></i> CAPACIT\xC0 DI SPEDIZIONE <span class="pip-pronti-hint">\u2014 aggiornato in tempo reale dalle giacenze</span></div>
        <div id="pip-sped-calc-inner"></div>
      </div>

      <!-- PRONTI DA SPEDIRE + SCARICO -->
      <div class="pip-assemb-card pip-pronti-card-wrap">
        <div class="pip-assemb-title"><i class="fas fa-truck"></i> PRONTI DA SPEDIRE <span class="pip-pronti-hint">\u2014 imposta le quantit\xE0 e premi Registra Spedizione per scaricare i componenti</span></div>
        <div class="pip-pronti-grid" id="pip-pronti-grid"></div>
        <div class="pip-pronti-footer">
          <input type="text" id="pip-spedizione-nota" class="pip-pronti-nota-input" placeholder="Note spedizione (es. Ordine 1234, Cliente Rossi\u2026)" maxlength="80">
          <button class="pip-assemb-btn pip-spedisci-btn" onclick="_pipScaricoTuttiPronti()">
            <i class="fas fa-truck"></i> Registra Spedizione
          </button>
        </div>
      </div>

      <!-- MOVIMENTI MAGAZZINO -->
      <div class="pip-mov-section">
        <div class="pip-mov-header">
          <div class="pip-mov-header-title">
            <i class="fas fa-boxes-stacked"></i> MOVIMENTI MAGAZZINO
          </div>
          <div class="pip-mov-header-actions">
            <button class="pip-reso-open-btn" onclick="_pipApriModalReso()">
              <i class="fas fa-rotate-left"></i> Reso
            </button>
            <button class="pip-mov-toggle-btn" onclick="_pipToggleMov(this)">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
        <div class="pip-mov-body" id="pip-mov-body">
          <!-- FORM -->
          <div class="pip-mov-form">
            <div class="pip-mov-form-field" style="grid-column:1/3">
              <label class="pip-mov-form-label">Materiale</label>
              <select id="pip-mov-mat">${p}</select>
            </div>
            <div class="pip-mov-form-field">
              <label class="pip-mov-form-label">Quantit\xE0</label>
              <input type="number" id="pip-mov-qty" min="1" value="1" placeholder="0">
            </div>
            <div class="pip-mov-form-field">
              <label class="pip-mov-form-label">Note (opz.)</label>
              <input type="text" id="pip-mov-nota" placeholder="es. DDT 123\u2026" maxlength="60">
            </div>
            <button class="pip-mov-btn-carico" onclick="_pipSalvaMovimento('carico')">
              <i class="fas fa-arrow-down"></i> Carico
            </button>
            <button class="pip-mov-btn-scarico" onclick="_pipSalvaMovimento('scarico')">
              <i class="fas fa-arrow-up"></i> Scarico
            </button>
          </div>
          <!-- LISTA -->
          <div id="pip-mov-list"></div>
        </div>
      </div>
    </div>`,S(),U(),V(),it(i)}function Jt(){window._pipAggiornaPronti=At,window._pipSetPronti=_t,window._pipAggiornaQty=Et,window._pipAggiornaCar=E,window._pipScaricoTuttiPronti=qt,window._pipAggiornaSpeWarning=Q,window._pipChiudiModalSped=pt,window._pipConfermaSpedizione=wt,window._pipSalvaMovimento=St,window._pipEliminaMovimento=Mt,window._pipModificaMovimento=Tt,window._pipChiudiModalEdit=nt,window._pipConfermaModificaMov=xt,window._pipChiudiModalDel=st,window._pipConfermaEliminaMov=at,window._pipApriModalReso=Ot,window._pipChiudiModalReso=ct,window._pipResoQtyChange=Pt,window._pipResoAggiornaBOM=X,window._pipConfermaReso=kt,window._pipToggleMov=Rt,window._pipSalvaManuale=$t,window._pipReset=Lt}var D,G,k,J,F,b,T,H,Z,et,Ft,Nt=mt(()=>{dt();vt();yt();ft();ut();D=!1;G="mlPipQty",k="mlPipCaricato",J="mlPipMovimenti",F="mlPipPronti",b=[["TESTA","Testa piccola",1,0,0],["","Testa media",0,1,0],["","Testa grande",0,0,1],["","Catenaria piccola",1,0,0],["","Catenaria media",0,1,0],["","Catenaria grande",0,0,1],["","Tappino nero",2,2,2],["","Wago",0,2,2],["","Viti 2x6",8,0,0],["","Viti 2,5x6",0,8,4],["CORDONE","Case superiore",1,1,1],["","Case inf. 500mA",1,0,0],["","Case inf. 600mA",0,1,0],["","Case inf. 700mA",0,0,1],["","Pulsante",1,1,1],["","Viti nere",2,2,2],["","Plug 1,5m",1,0,0],["","Plug 2m",0,1,1],["","Cavo out 500mA",1,0,0],["","Cavo out 600mA",0,1,0],["","Cavo out 700mA",0,0,1],["","Alimentatore",1,1,1],["","Interruttore 500mA",1,0,0],["","Interruttore 600mA",0,1,0],["","Interruttore 700mA",0,0,1]],T={TESTA:{p:[[0,1],[3,1],[6,2],[8,8]],m:[[1,1],[4,1],[6,2],[7,2],[9,8]],g:[[2,1],[5,1],[6,2],[7,2],[9,4]]},CORDONE:{p:[[10,1],[11,1],[14,1],[15,2],[16,1],[18,1],[22,1]],m:[[10,1],[12,1],[14,1],[15,2],[17,1],[19,1],[23,1]],g:[[10,1],[13,1],[14,1],[15,2],[17,1],[20,1],[24,1]]},ALIMENTATORE:{_:[[21,1]]}},H=[{key:"t_p",tipo:"TESTA",fmt:"p",tipoLabel:"Testa",fmtLabel:"Piccolo",emoji:"\u{1F529}",mA:"500mA"},{key:"t_m",tipo:"TESTA",fmt:"m",tipoLabel:"Testa",fmtLabel:"Medio",emoji:"\u{1F529}",mA:"600mA"},{key:"t_g",tipo:"TESTA",fmt:"g",tipoLabel:"Testa",fmtLabel:"Grande",emoji:"\u{1F529}",mA:"700mA"},{key:"c_p",tipo:"CORDONE",fmt:"p",tipoLabel:"Cordone",fmtLabel:"Piccolo",emoji:"\u{1F50C}",mA:"500mA"},{key:"c_m",tipo:"CORDONE",fmt:"m",tipoLabel:"Cordone",fmtLabel:"Medio",emoji:"\u{1F50C}",mA:"600mA"},{key:"c_g",tipo:"CORDONE",fmt:"g",tipoLabel:"Cordone",fmtLabel:"Grande",emoji:"\u{1F50C}",mA:"700mA"},{key:"a",tipo:"ALIMENTATORE",fmt:"_",tipoLabel:"Alimentatore",fmtLabel:"",emoji:"\u{1F50B}",mA:""}],Z=[{key:"t_p",tipo:"TESTA",fmt:"p",label:"Testa Piccola",emoji:"\u{1F529}",mA:"500mA"},{key:"t_m",tipo:"TESTA",fmt:"m",label:"Testa Media",emoji:"\u{1F529}",mA:"600mA"},{key:"t_g",tipo:"TESTA",fmt:"g",label:"Testa Grande",emoji:"\u{1F529}",mA:"700mA"},{key:"c_p",tipo:"CORDONE",fmt:"p",label:"Cordone Piccolo",emoji:"\u{1F50C}",mA:"500mA"},{key:"c_m",tipo:"CORDONE",fmt:"m",label:"Cordone Medio",emoji:"\u{1F50C}",mA:"600mA"},{key:"c_g",tipo:"CORDONE",fmt:"g",label:"Cordone Grande",emoji:"\u{1F50C}",mA:"700mA"},{key:"a",tipo:"ALIMENTATORE",fmt:"_",label:"Alimentatore",emoji:"\u{1F50B}",mA:""}];et=null;window.pipRecovery={stato:function(){let t=h(),s=v(),o=localStorage.getItem("pip_local_ts");console.group("%c[pipRecovery] Stato localStorage pipistrelli","color:#1a237e;font-weight:bold"),console.log("\u{1F4C5} pip_local_ts:",o,o?"("+new Date(parseInt(o)).toLocaleString("it-IT")+")":"(mai salvato)"),console.log("\u{1F504} PRONTI:",JSON.stringify(t)),console.log("   \u2014 TESTA  P/M/G:",t.t_p||0,t.t_m||0,t.t_g||0),console.log("   \u2014 CORDONE P/M/G:",t.c_p||0,t.c_m||0,t.c_g||0);let i=Object.values(t).some(e=>e>0);return console.log(i?"\u2705 Pronti presenti \u2192 puoi usare pipRecovery.forzaRipristino()":"\u26A0\uFE0F Pronti tutti 0 \u2192 usa pipRecovery.reimpostaPronti({t_p:X,t_m:X,...})"),console.log("\u{1F4E6} CARICATO keys:",Object.keys(s).length,"\u2014 valori:",JSON.stringify(s)),console.groupEnd(),{pronti:t,caricato:s}},forzaRipristino:function(){let t={azione:"setPipData",qty:x(),caricato:v(),pronti:h(),movimenti:g()};localStorage.setItem("pip_local_ts",Date.now()),P(t).then(s=>console.log("%c[pipRecovery] \u2705 Ripristino inviato al server:","color:green",s)).catch(s=>console.error("[pipRecovery] \u274C Errore:",s)),console.log("[pipRecovery] Invio in corso...")},reimpostaPronti:function(t){let s=["t_p","t_m","t_g","c_p","c_m","c_g"],o={};s.forEach(i=>{o[i]=parseInt(t[i])||0}),console.log("[pipRecovery] Imposto pronti:",JSON.stringify(o)),q(o),console.log("%c[pipRecovery] \u2705 Pronti impostati e push al server avviato","color:green")}};Ft=Y});Nt();export{Y as caricaPipistrelli,Ft as default,Jt as registerGlobals,Gt as resetPipFetch};
//# sourceMappingURL=chunk-pipistrelli-RIEK2WCW.js.map
