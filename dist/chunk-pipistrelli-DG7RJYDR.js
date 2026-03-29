import{a as X,c as mt,f as ut,g as $,k as ft,l as T,n as vt}from"./chunk-chunk-PATLO5W5.js";import{a as rt,c as P,d as A,e as Y,i as dt}from"./chunk-chunk-LUOL5Q4K.js";function Ht(){k=!1}function x(){try{return JSON.parse(localStorage.getItem(z))||{p:0,m:0,g:0}}catch{return{p:0,m:0,g:0}}}function u(){try{return JSON.parse(localStorage.getItem(q))||{}}catch{return{}}}function g(){try{return JSON.parse(localStorage.getItem(j))||{}}catch{return{}}}function tt(t){try{localStorage.setItem(z,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}w()}function _(t){try{localStorage.setItem(q,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}w()}function M(t){try{localStorage.setItem(j,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}w()}function f(){try{return JSON.parse(localStorage.getItem(B))||[]}catch{return[]}}function I(t){try{localStorage.setItem(B,JSON.stringify(t)),localStorage.setItem("pip_local_ts",Date.now())}catch{}w()}function w(){clearTimeout(K),K=setTimeout(function(){T({azione:"setPipData",qty:x(),caricato:u(),pronti:g(),movimenti:f()}).catch(function(t){console.warn("[pipistrelli] salvataggio remoto fallito:",t)})},1500)}function yt(t){fetch(X+"?azione=getPipData").then(function(a){return a.json()}).then(function(a){var e=parseInt(a.ts||0),i=parseInt(localStorage.getItem("pip_local_ts")||0);if(e>0&&e>i){if(a.qty)try{localStorage.setItem(z,JSON.stringify(a.qty))}catch{}if(a.caricato)try{localStorage.setItem(q,JSON.stringify(a.caricato))}catch{}if(a.pronti)try{localStorage.setItem(j,JSON.stringify(a.pronti))}catch{}if(a.movimenti&&Array.isArray(a.movimenti)&&a.movimenti.length>0)try{localStorage.setItem(B,JSON.stringify(a.movimenti))}catch{}try{localStorage.setItem("pip_local_ts",e)}catch{}t&&t(!0)}else t&&t(!1)}).catch(function(){t&&t(!1)})}function gt(){let t=f();if(!t.length)return null;let a={};return[...t].reverse().forEach(e=>{if(e.tipo==="carico"){let i=parseInt(e.idx);isNaN(i)||(a[i]=Number(a[i]||0)+(e.qty||0))}else if(e.tipo==="scarico"){let i=parseInt(e.idx);isNaN(i)||(a[i]=Math.max(0,Number(a[i]||0)-(e.qty||0)))}else(e.tipo==="spedizione"||e.tipo==="assemb")&&(e.righe||[]).forEach(i=>{let o=parseInt(i.idx);isNaN(o)||(a[o]=Math.max(0,Number(a[o]||0)-(i.qty||0)))})}),a}function Q(){let t=g(),a={};[["TESTA","p","t_p"],["TESTA","m","t_m"],["TESTA","g","t_g"],["CORDONE","p","c_p"],["CORDONE","m","c_m"],["CORDONE","g","c_g"]].forEach(([i,o,s])=>{let c=t[s]||0;c&&(D[i]?.[o]||[]).forEach(([l,n])=>{a[l]=(a[l]||0)+c*n})});let e=t.a||0;return e&&(a[21]=(a[21]||0)+e),a}function O(){let t=Q(),a=u();document.querySelectorAll("#pip-tbody tr").forEach(e=>{let i=parseInt(e.dataset.idx),o=Number(a[i]||0),s=t[i]||0,c=e.querySelector(".pip-car-liberi");c&&(s>0?(c.textContent=Math.max(0,o-s)+" lib.",c.style.display=""):c.style.display="none")})}function bt(t,a){let e=g();e[t]=Math.max(0,(e[t]||0)+a),M(e),O(),G()}function ht(t,a){let e=g();e[t]=Math.max(0,parseInt(a)||0),M(e),O();let i=document.querySelector(`.pip-pronti-input[data-key="${t}"]`);i&&(i.value=e[t],i.classList.toggle("pip-pronti-val-on",e[t]>0))}function G(){let t=g(),a=[{titolo:"\u{1F529} Teste",items:[{key:"t_p",label:"Testa",mA:"500mA",emoji:"\u{1F529}"},{key:"t_m",label:"Testa",mA:"600mA",emoji:"\u{1F529}"},{key:"t_g",label:"Testa",mA:"700mA",emoji:"\u{1F529}"}]},{titolo:"\u{1F50C} Cordoni",items:[{key:"c_p",label:"Cordone",mA:"500mA",emoji:"\u{1F50C}"},{key:"c_m",label:"Cordone",mA:"600mA",emoji:"\u{1F50C}"},{key:"c_g",label:"Cordone",mA:"700mA",emoji:"\u{1F50C}"}]},{titolo:"\u{1F50B} Alimentatori",items:[{key:"a",label:"Alimentatore",mA:"",emoji:"\u{1F50B}"}]}],e=document.getElementById("pip-pronti-grid");e&&(e.innerHTML=a.map(i=>{let o=i.items.map(s=>{let c=t[s.key]||0;return`<div class="pip-pronti-row">
        <span class="pip-pronti-lbl">${s.emoji} ${s.label}${s.mA?` <span class="pip-pronti-ma">${s.mA}</span>`:""}</span>
        <div class="pip-pronti-ctrl">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${s.key}',-1)">\u2212</button>
          <input class="pip-pronti-input${c>0?" pip-pronti-val-on":""}" type="number" min="0"
                 data-key="${s.key}" value="${c}"
                 oninput="_pipSetPronti('${s.key}', this.value)"
                 onchange="_pipSetPronti('${s.key}', this.value)">
          <button class="pip-pronti-btn" onclick="_pipAggiornaPronti('${s.key}',1)">+</button>
        </div>
      </div>`}).join("");return`<div class="pip-pronti-sezione"><div class="pip-pronti-sezione-titolo">${i.titolo}</div>${o}</div>`}).join(""))}function _t(t){let a=1;for(let e=t+1;e<y.length&&y[e][0]==="";e++)a++;return a}function At(){let t=Math.max(0,parseInt(document.getElementById("pip-qty-p")?.value)||0),a=Math.max(0,parseInt(document.getElementById("pip-qty-m")?.value)||0),e=Math.max(0,parseInt(document.getElementById("pip-qty-g")?.value)||0);tt({p:t,m:a,g:e});let i=document.getElementById("pip-tot");i&&(i.textContent=t+a+e);let o=u();document.querySelectorAll("#pip-tbody tr").forEach(s=>{let c=parseInt(s.dataset.idx),l=y[c],n=t*l[2]+a*l[3]+e*l[4],p=Number(o[c]||0),r=Math.max(0,n-p),m=s.querySelector(".pip-fab, .pip-fab-zero"),d=s.querySelector('[class^="pip-ord"]');m&&(m.textContent=n>0?n:"\u2014",m.className=n===0?"pip-fab pip-fab-zero":"pip-fab"),d&&(d.textContent=n===0?"\u2014":r,d.className=n===0?"pip-ord-zero":r>0?"pip-ord-manca":"pip-ord-ok")})}function E(t){let a=parseInt(t.dataset.idx),e=Math.max(0,parseInt(t.value)||0),i=u();i[a]=e,_(i);let o=x(),s=y[a],c=o.p*s[2]+o.m*s[3]+o.g*s[4],l=Math.max(0,c-e),n=t.closest("tr"),p=n?.querySelector('[class^="pip-ord"]');p&&(p.textContent=c===0?"\u2014":l,p.className=c===0?"pip-ord-zero":l>0?"pip-ord-manca":"pip-ord-ok");let m=Q()[a]||0,d=n?.querySelector(".pip-car-liberi");d&&(m>0?(d.textContent=Math.max(0,e-m)+" lib.",d.style.display=""):d.style.display="none")}function Et(){let t=document.getElementById("pip-save-btn"),a=document.getElementById("pip-save-label");!t||!a||(t.disabled=!0,t.classList.remove("pip-save-ok","pip-save-err"),t.classList.add("pip-save-loading"),a.textContent="Salvataggio\u2026",T({azione:"setPipData",qty:x(),caricato:u(),pronti:g(),movimenti:f()}).then(function(){try{localStorage.setItem("pip_local_ts",Date.now())}catch{}t.classList.remove("pip-save-loading"),t.classList.add("pip-save-ok"),a.textContent="Salvato \u2713",setTimeout(function(){t.classList.remove("pip-save-ok"),a.textContent="Salva",t.disabled=!1},2500)}).catch(function(){t.classList.remove("pip-save-loading"),t.classList.add("pip-save-err"),a.textContent="Errore \u2717",setTimeout(function(){t.classList.remove("pip-save-err"),a.textContent="Salva",t.disabled=!1},3e3)}))}function It(t){let a=document.getElementById("pip-mov-mat"),e=document.getElementById("pip-mov-qty"),i=document.getElementById("pip-mov-nota");if(!a||!e)return;let o=parseInt(a.value),s=Math.max(1,parseInt(e.value)||1),c=(i?.value||"").trim(),l=y[o]?.[1]||"?",n=u();t==="carico"?n[o]=Number(n[o]||0)+s:n[o]=Math.max(0,Number(n[o]||0)-s),_(n);let p=document.querySelector(`#pip-tbody input[data-idx="${o}"]`);p&&(p.value=n[o],E(p));let r=f();r.unshift({id:Date.now(),idx:o,tipo:t,qty:s,nota:c,mat:l,ts:new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}),I(r),e.value=1,i&&(i.value=""),S()}function St(t){if(!J())return;let e=f().find(i=>i.id===t);e&&$t(t,e)}function $t(t,a){let e=document.getElementById("modal-pip-del-mov");if(!e)return;let i=document.getElementById("pip-del-mov-desc"),o;if(a.tipo==="reso"){let c=a.totPz||0,l=(a.righe||[]).length,n=(a.scartate||[]).length;o=`<span class="pip-mov-badge reso" style="font-size:0.75rem">RESO</span>
     <strong>Rientro \xD7${c} pz</strong>
     <br><span style="color:#64748b;font-size:0.82rem">${l} comp. recuperati \xB7 ${n} comp. scartati</span>
     ${a.nota?`<br><span style="color:#64748b;font-size:0.82rem">${a.nota}</span>`:""}`}else{let c=a.tipo==="carico"?"CARICO":"SCARICO";o=`<span class="pip-mov-badge ${a.tipo}" style="font-size:0.75rem">${c}</span>
     <strong>${a.mat}</strong> &nbsp;${a.tipo==="carico"?"+":"\u2212"}${a.qty} pz
     ${a.nota?`<br><span style="color:#64748b;font-size:0.82rem">${a.nota}</span>`:""}`}i&&(i.innerHTML=o);let s=document.getElementById("btn-pip-del-ok");s&&(s.onclick=()=>et(t)),e.style.display="flex",e.offsetHeight,e.classList.add("active")}function it(){let t=document.getElementById("modal-pip-del-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function et(t){it();let a=f(),e=a.find(o=>o.id===t);if(!e)return;let i=u();if(e.tipo==="assemb"||e.tipo==="spedizione")(e.righe||[]).forEach(o=>{i[o.idx]=Number(i[o.idx]||0)+o.qty}),_(i),(e.righe||[]).forEach(o=>{let s=document.querySelector(`#pip-tbody input[data-idx="${o.idx}"]`);s&&(s.value=i[o.idx],E(s))});else if(e.tipo==="reso")(e.righe||[]).forEach(o=>{i[o.idx]=Math.max(0,Number(i[o.idx]||0)-o.qty)}),_(i),(e.righe||[]).forEach(o=>{let s=document.querySelector(`#pip-tbody input[data-idx="${o.idx}"]`);s&&(s.value=i[o.idx],E(s))});else{e.tipo==="carico"?i[e.idx]=Math.max(0,Number(i[e.idx]||0)-e.qty):i[e.idx]=Number(i[e.idx]||0)+e.qty,_(i);let o=document.querySelector(`#pip-tbody input[data-idx="${e.idx}"]`);o&&(o.value=i[e.idx],E(o))}I(a.filter(o=>o.id!==t)),S(),A("Movimento eliminato \u2713")}function S(){let t=document.getElementById("pip-mov-list");if(!t)return;let a=f(),e=J();if(a.length===0){t.innerHTML='<div class="pip-mov-empty">Nessun movimento registrato</div>';return}t.innerHTML=a.map(i=>{let o=e?`<button class="pip-mov-del" onclick="_pipEliminaMovimento(${i.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',s=e&&(i.tipo==="carico"||i.tipo==="scarico")?`<button class="pip-mov-edit" onclick="_pipModificaMovimento(${i.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(i.tipo==="spedizione"){let c=(i.items||[]).reduce((m,d)=>m+d.qty,0),l={};(i.items||[]).forEach(m=>{l[m.mA]=(l[m.mA]||0)+m.qty});let n=Object.entries(l).map(([m,d])=>`<span class="pip-sped-ma-pill">${m} \xD7${d}</span>`).join(""),p=(i.items||[]).map(m=>`<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${m.emoji} ${m.tipoLabel} ${m.fmtLabel} <span class="pip-pronti-ma">${m.mA}</span></span>
          <span class="pip-mov-qty scarico">\xD7${m.qty}</span>
        </div>`).join(""),r=(i.righe||[]).map(m=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8">${m.mat}</span>
          <span class="pip-mov-qty scarico">\u2212${m.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge spedizione">SPED.</span>
            <span class="pip-mov-assemb-label">\u{1F69A} Spediz. \xD7${c} pz ${n}</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${o}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${p}</div>
            <div class="pip-sped-bom-divider">componenti scaricati</div>
            ${r}
          </div>
        </details>`}if(i.tipo==="assemb"){let c=i.assembTipo==="Testa"?"\u{1F529}":"\u{1F50C}",l=i.assembFmt==="Piccolo"?"500mA":i.assembFmt==="Medio"?"600mA":"700mA",n=(i.righe||[]).map(p=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat">${p.mat}</span>
          <span class="pip-mov-qty scarico">\u2212${p.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge assemb">${l}</span>
            <span class="pip-mov-assemb-label">${c} ${i.assembTipo} ${i.assembFmt} \xD7${i.assembQty}</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${o}
          </summary>
          <div class="pip-assemb-sub-list">${n}</div>
        </details>`}if(i.tipo==="reso"){let c=i.totPz||0,l=(i.items||[]).map(r=>`<div class="pip-assemb-sub-row pip-sped-item-row">
          <span class="pip-assemb-sub-mat">${r.emoji} ${r.label}${r.mA?` <span class="pip-pronti-ma">${r.mA}</span>`:""}</span>
          <span class="pip-mov-qty carico">\xD7${r.qty}</span>
        </div>`).join(""),n=(i.righe||[]).map(r=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#15803d">\u2713 ${r.mat}</span>
          <span class="pip-mov-qty carico">+${r.qty}</span>
        </div>`).join(""),p=(i.scartate||[]).map(r=>`<div class="pip-assemb-sub-row">
          <span class="pip-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${r.mat}</span>
          <span class="pip-mov-qty" style="color:#94a3b8">\u2715 ${r.qty}</span>
        </div>`).join("");return`
        <details class="pip-mov-assemb-group pip-mov-reso-group">
          <summary class="pip-mov-assemb-summary">
            <span class="pip-mov-badge reso">RESO</span>
            <span class="pip-mov-assemb-label">\u{1F4E6} Rientro \xD7${c} pz</span>
            ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:""}
            <span class="pip-mov-ts">${i.ts}</span>
            <i class="fas fa-chevron-down pip-assemb-chev"></i>
            ${o}
          </summary>
          <div class="pip-assemb-sub-list">
            <div class="pip-sped-items-section">${l}</div>
            ${n?`<div class="pip-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${n}`:""}
            ${p?`<div class="pip-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${p}`:""}
          </div>
        </details>`}return`
      <div class="pip-mov-item ${i.tipo}">
        <span class="pip-mov-badge ${i.tipo}">${i.tipo==="carico"?"CARICO":"SCARICO"}</span>
        <span class="pip-mov-mat">${i.mat}</span>
        <span class="pip-mov-qty ${i.tipo}">${i.tipo==="carico"?"+":"\u2212"}${i.qty}</span>
        ${i.nota?`<span class="pip-mov-nota">${i.nota}</span>`:'<span class="pip-mov-nota"></span>'}
        <span class="pip-mov-ts">${i.ts}</span>
        ${s}${o}
      </div>`}).join("")}function J(){if(!$||!$.nome)return!1;let t=String($.nome).toUpperCase().trim();return t==="ALESSIO"||t==="0000"||$.ruolo==="MASTER"}function xt(t){if(!J())return;let e=f().find(l=>l.id===t);if(!e)return;let i=document.getElementById("modal-pip-edit-mov");if(!i)return;let o=document.getElementById("pip-edit-mov-mat"),s=document.getElementById("pip-edit-mov-qty"),c=document.getElementById("pip-edit-mov-nota");o&&(o.innerHTML=`<span class="pip-mov-badge ${P(e.tipo)}" style="font-size:0.75rem">${e.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${P(e.mat)}</strong>`),s&&(s.value=e.qty),c&&(c.value=e.nota||""),i.dataset.movId=t,i.style.display="flex",i.offsetHeight,i.classList.add("active"),setTimeout(()=>c&&c.focus(),80)}function ot(){let t=document.getElementById("modal-pip-edit-mov");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function Mt(){let t=document.getElementById("modal-pip-edit-mov");if(!t)return;let a=Number(t.dataset.movId);ot();let e=f(),i=e.findIndex(p=>p.id===a);if(i===-1)return;let o=e[i],s=parseInt(document.getElementById("pip-edit-mov-qty")?.value),c=(document.getElementById("pip-edit-mov-nota")?.value||"").trim();if(isNaN(s)||s<=0){A("Quantit\xE0 non valida \u26A0\uFE0F");return}let l=s!==o.qty,n=c!==(o.nota||"").trim();if(!(!l&&!n)){if(l){let p=s-o.qty,r=u();o.tipo==="carico"?r[o.idx]=Math.max(0,Number(r[o.idx]||0)+p):r[o.idx]=Math.max(0,Number(r[o.idx]||0)-p),_(r);let m=document.querySelector(`#pip-tbody input[data-idx="${o.idx}"]`);m&&(m.value=r[o.idx],E(m))}e[i]={...o,qty:s,nota:c},I(e),S(),A("Movimento aggiornato \u2713")}}function Ct(){let t=g(),a=N.filter(o=>(t[o.key]||0)>0).map(o=>({...o,qty:t[o.key]}));if(!a.length){A("Nessun articolo da spedire \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let e=document.getElementById("pip-sped-items");e&&(e.innerHTML=a.map(o=>`
      <label class="pip-sped-item-row">
        <input type="checkbox" class="pip-sped-chk" data-key="${o.key}" checked>
        <span class="pip-sped-item-info">
          <span class="pip-sped-item-emoji">${o.emoji}</span>
          <span class="pip-sped-item-label">${o.tipoLabel}${o.mA?` <span class="pip-pronti-ma">${o.mA}</span>`:""}</span>
          <span class="pip-sped-item-qty">\xD7${o.qty}</span>
        </span>
      </label>`).join(""),e.querySelectorAll(".pip-sped-chk").forEach(o=>o.addEventListener("change",L))),L();let i=document.getElementById("modal-pip-spedizione");i&&(i.style.display="flex",i.offsetHeight,i.classList.add("active"))}function L(){let t=[...document.querySelectorAll(".pip-sped-chk:checked")].map(n=>n.dataset.key),a=t.some(n=>n.startsWith("t_")),e=t.some(n=>n.startsWith("c_")),i=t.includes("a"),o=document.getElementById("pip-sped-warning"),s=document.getElementById("pip-sped-warning-msg"),c=document.getElementById("btn-pip-sped-ok");if(!t.length){o&&(o.style.display="flex"),s&&(s.textContent="Nessun articolo selezionato."),c&&(c.disabled=!0);return}c&&(c.disabled=!1);let l=[];a||l.push("Teste"),e||l.push("Cordoni"),i||l.push("Alimentatori"),l.length>0&&l.length<3?(o&&(o.style.display="flex"),s&&(s.textContent=`Attenzione: stai spedendo senza ${l.join(" e ")} \u2014 normalmente Testa, Cordone e Alimentatore vanno spediti insieme. Confermi comunque?`)):o&&(o.style.display="none")}function Tt(){let t=[...document.querySelectorAll(".pip-sped-chk:checked")].map(d=>d.dataset.key);if(!t.length)return;let a=g(),e=N.filter(d=>t.includes(d.key)&&(a[d.key]||0)>0).map(d=>({...d,qty:a[d.key]}));if(!e.length)return;let i=(document.getElementById("pip-spedizione-nota")?.value||"").trim(),o=u(),s={};e.forEach(d=>{let v=D[d.tipo]?.[d.fmt];v&&v.forEach(([b,C])=>{let h=d.qty*C;o[b]=Math.max(0,Number(o[b]||0)-h),s[b]?s[b].qty+=h:s[b]={idx:b,mat:y[b]?.[1]||"?",qty:h}})});let c=Object.values(s);_(o);let l=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}),n=f();n.unshift({id:Date.now(),tipo:"spedizione",items:e,righe:c,nota:i,ts:l}),I(n);let p={...g()};if(t.forEach(d=>{delete p[d]}),M(p),!N.filter(d=>(p[d.key]||0)>0).length){let d=document.getElementById("pip-spedizione-nota");d&&(d.value="")}c.forEach(d=>{let v=document.querySelector(`#pip-tbody input[data-idx="${d.idx}"]`);v&&(v.value=o[d.idx],E(v))}),at(),G(),O(),S();let m=e.reduce((d,v)=>d+v.qty,0);A(`Spedizione registrata: ${m} pz scaricati \u2713`)}function at(){let t=document.getElementById("modal-pip-spedizione");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function qt(){let t=document.getElementById("modal-pip-reso");if(!t)return;H.forEach(e=>{let i=document.getElementById("pip-reso-qty-"+e.key);i&&(i.value=0)});let a=document.getElementById("pip-reso-nota");a&&(a.value=""),F(),t.style.display="flex",t.offsetHeight,t.classList.add("active")}function st(){let t=document.getElementById("modal-pip-reso");t&&(t.classList.remove("active"),setTimeout(()=>{t.classList.contains("active")||(t.style.display="none")},300))}function wt(t,a){let e=document.getElementById("pip-reso-qty-"+t);e&&(e.value=Math.max(0,(parseInt(e.value)||0)+a),F())}function F(){let t={};H.forEach(i=>{let o=parseInt(document.getElementById("pip-reso-qty-"+i.key)?.value)||0;if(!o)return;(D[i.tipo]?.[i.fmt]||[]).forEach(([c,l])=>{t[c]=(t[c]||0)+o*l}),i.key==="a"&&(t[21]=(t[21]||0)+o)});let a=document.getElementById("pip-reso-bom-list");if(!a)return;let e=Object.entries(t).filter(([,i])=>i>0);if(!e.length){a.innerHTML='<div class="pip-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}a.innerHTML=e.map(([i,o])=>{let s=y[parseInt(i)]?.[1]||"?";return`<label class="pip-reso-bom-row">
      <input type="checkbox" class="pip-reso-bom-chk" data-idx="${i}" data-qty="${o}" checked>
      <span class="pip-reso-bom-mat">${s}</span>
      <span class="pip-reso-bom-qty">+${o}</span>
    </label>`}).join("")}function Ot(){let t=[];if(H.forEach(n=>{let p=parseInt(document.getElementById("pip-reso-qty-"+n.key)?.value)||0;p>0&&t.push({...n,qty:p})}),!t.length){A("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let a=[],e=[];document.querySelectorAll(".pip-reso-bom-chk").forEach(n=>{let p=parseInt(n.dataset.idx),r=parseInt(n.dataset.qty),m=y[p]?.[1]||"?";n.checked?a.push({idx:p,mat:m,qty:r}):e.push({idx:p,mat:m,qty:r})});let i=(document.getElementById("pip-reso-nota")?.value||"").trim(),o=u();a.forEach(n=>{o[n.idx]=Number(o[n.idx]||0)+n.qty}),_(o),a.forEach(n=>{let p=document.querySelector(`#pip-tbody input[data-idx="${n.idx}"]`);p&&(p.value=o[n.idx],E(p))});let s=new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}),c=f(),l=t.reduce((n,p)=>n+p.qty,0);c.unshift({id:Date.now(),tipo:"reso",items:t,righe:a,scartate:e,nota:i,ts:s,totPz:l}),I(c),st(),S(),O(),A(`Reso registrato: ${l} pz \u2014 ${a.length} componenti recuperati \u2713`)}function Rt(t){let a=document.getElementById("pip-mov-body");if(!a)return;let e=a.style.display==="none";a.style.display=e?"":"none";let i=t.querySelector("i");i&&(i.className=e?"fas fa-chevron-down":"fas fa-chevron-up")}function Pt(){confirm("Vuoi azzerare tutto (quantit\xE0, magazzino e movimenti)?")&&(tt({p:0,m:0,g:0}),_({}),I([]),M({}),V())}function V(){k||(k=!0,yt(function(p){p&&V()}));let t=u(),a=f();if((Object.keys(t).length===0||Object.values(t).every(p=>Number(p)===0))&&a.some(p=>p.tipo==="carico"||p.tipo==="scarico")){let p=gt();if(p&&Object.values(p).some(r=>r>0))try{localStorage.setItem(q,JSON.stringify(p))}catch{}}let i=document.getElementById("contenitore-dati"),o=x(),s=u(),c=Q(),l=y.map((p,r)=>{let[m,d,v,b,C]=p,h=o.p*v+o.m*b+o.g*C,R=Number(s[r]||0),Z=c[r]||0,nt=Math.max(0,R-Z),U=Math.max(0,h-R),pt=h===0?"pip-ord-zero":U>0?"pip-ord-manca":"pip-ord-ok",ct=m?`<td class="pip-sez-cell" rowspan="${_t(r)}">${m}</td>`:"",lt=[v,b,C].map(W=>W>0?`<td class="pip-coeff pip-coeff-on">${W}</td>`:'<td class="pip-coeff pip-coeff-off">\u2014</td>').join("");return`<tr data-idx="${r}" class="${m?"pip-row-sez-start":""}">
      ${ct}
      <td class="pip-mat">${d}</td>
      ${lt}
      <td class="pip-fab${h===0?" pip-fab-zero":""}">${h>0?h:"\u2014"}</td>
      <td class="pip-car-cell">
        <input class="pip-car-input" type="number" min="0" value="${R}"
               data-idx="${r}" oninput="_pipAggiornaCar(this)" onchange="_pipAggiornaCar(this)">
        <span class="pip-car-liberi"${Z>0?"":' style="display:none"'}>${nt} lib.</span>
      </td>
      <td class="${pt}">${h===0?"\u2014":U}</td>
    </tr>`}).join(""),n=y.map((p,r)=>`<option value="${r}">[${p[0]||y.slice(0,r).reverse().find(m=>m[0])?.[0]||"?"}] ${p[1]}</option>`).join("");i.innerHTML=`
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
            <input class="pip-qty-input" id="pip-qty-p" type="number" min="0" value="${o.p}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>\u{1F7E3} Medio<br><small>600mA</small></label>
            <input class="pip-qty-input" id="pip-qty-m" type="number" min="0" value="${o.m}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-item">
            <label>\u{1F534} Grande<br><small>700mA</small></label>
            <input class="pip-qty-input" id="pip-qty-g" type="number" min="0" value="${o.g}"
                   oninput="_pipAggiornaQty()" onchange="_pipAggiornaQty()">
          </div>
          <div class="pip-qty-total-box">
            <div class="pip-qty-total-label">TOTALE</div>
            <div class="pip-qty-total-val" id="pip-tot">${o.p+o.m+o.g}</div>
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
            ${l}
          </tbody>
        </table>
      </div>

      <!-- LEGENDA -->
      <div class="pip-legend">
        <span class="pip-leg-item pip-ord-manca" style="padding:2px 7px;border-radius:5px;">\u25CF mancante</span>
        <span class="pip-leg-item pip-ord-ok" style="padding:2px 7px;border-radius:5px;">\u25CF disponibile</span>
        <span class="pip-leg-item" style="color:#9ca3af">\u2014 = non necessario</span>
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
              <select id="pip-mov-mat">${n}</select>
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
    </div>`,S(),G(),Y(i)}function Qt(){window._pipAggiornaPronti=bt,window._pipSetPronti=ht,window._pipAggiornaQty=At,window._pipAggiornaCar=E,window._pipScaricoTuttiPronti=Ct,window._pipAggiornaSpeWarning=L,window._pipChiudiModalSped=at,window._pipConfermaSpedizione=Tt,window._pipSalvaMovimento=It,window._pipEliminaMovimento=St,window._pipModificaMovimento=xt,window._pipChiudiModalEdit=ot,window._pipConfermaModificaMov=Mt,window._pipChiudiModalDel=it,window._pipConfermaEliminaMov=et,window._pipApriModalReso=qt,window._pipChiudiModalReso=st,window._pipResoQtyChange=wt,window._pipResoAggiornaBOM=F,window._pipConfermaReso=Ot,window._pipToggleMov=Rt,window._pipSalvaManuale=Et,window._pipReset=Pt}var k,z,q,B,j,y,D,N,H,K,Gt,kt=rt(()=>{mt();ft();vt();ut();dt();k=!1;z="mlPipQty",q="mlPipCaricato",B="mlPipMovimenti",j="mlPipPronti",y=[["TESTA","Testa piccola",1,0,0],["","Testa media",0,1,0],["","Testa grande",0,0,1],["","Catenaria piccola",1,0,0],["","Catenaria media",0,1,0],["","Catenaria grande",0,0,1],["","Tappino nero",2,2,2],["","Wago",0,2,2],["","Viti 2x6",8,0,0],["","Viti 2,5x6",0,8,4],["CORDONE","Case superiore",1,1,1],["","Case inf. 500mA",1,0,0],["","Case inf. 600mA",0,1,0],["","Case inf. 700mA",0,0,1],["","Pulsante",1,1,1],["","Viti nere",2,2,2],["","Plug 1,5m",1,0,0],["","Plug 2m",0,1,1],["","Cavo out 500mA",1,0,0],["","Cavo out 600mA",0,1,0],["","Cavo out 700mA",0,0,1],["","Alimentatore",1,1,1],["","Interruttore 500mA",1,0,0],["","Interruttore 600mA",0,1,0],["","Interruttore 700mA",0,0,1]],D={TESTA:{p:[[0,1],[3,1],[6,2],[8,8]],m:[[1,1],[4,1],[6,2],[7,2],[9,8]],g:[[2,1],[5,1],[6,2],[7,2],[9,4]]},CORDONE:{p:[[10,1],[11,1],[14,1],[15,2],[16,1],[18,1],[22,1]],m:[[10,1],[12,1],[14,1],[15,2],[17,1],[19,1],[23,1]],g:[[10,1],[13,1],[14,1],[15,2],[17,1],[20,1],[24,1]]},ALIMENTATORE:{_:[[21,1]]}},N=[{key:"t_p",tipo:"TESTA",fmt:"p",tipoLabel:"Testa",fmtLabel:"Piccolo",emoji:"\u{1F529}",mA:"500mA"},{key:"t_m",tipo:"TESTA",fmt:"m",tipoLabel:"Testa",fmtLabel:"Medio",emoji:"\u{1F529}",mA:"600mA"},{key:"t_g",tipo:"TESTA",fmt:"g",tipoLabel:"Testa",fmtLabel:"Grande",emoji:"\u{1F529}",mA:"700mA"},{key:"c_p",tipo:"CORDONE",fmt:"p",tipoLabel:"Cordone",fmtLabel:"Piccolo",emoji:"\u{1F50C}",mA:"500mA"},{key:"c_m",tipo:"CORDONE",fmt:"m",tipoLabel:"Cordone",fmtLabel:"Medio",emoji:"\u{1F50C}",mA:"600mA"},{key:"c_g",tipo:"CORDONE",fmt:"g",tipoLabel:"Cordone",fmtLabel:"Grande",emoji:"\u{1F50C}",mA:"700mA"},{key:"a",tipo:"ALIMENTATORE",fmt:"_",tipoLabel:"Alimentatore",fmtLabel:"",emoji:"\u{1F50B}",mA:""}],H=[{key:"t_p",tipo:"TESTA",fmt:"p",label:"Testa Piccola",emoji:"\u{1F529}",mA:"500mA"},{key:"t_m",tipo:"TESTA",fmt:"m",label:"Testa Media",emoji:"\u{1F529}",mA:"600mA"},{key:"t_g",tipo:"TESTA",fmt:"g",label:"Testa Grande",emoji:"\u{1F529}",mA:"700mA"},{key:"c_p",tipo:"CORDONE",fmt:"p",label:"Cordone Piccolo",emoji:"\u{1F50C}",mA:"500mA"},{key:"c_m",tipo:"CORDONE",fmt:"m",label:"Cordone Medio",emoji:"\u{1F50C}",mA:"600mA"},{key:"c_g",tipo:"CORDONE",fmt:"g",label:"Cordone Grande",emoji:"\u{1F50C}",mA:"700mA"},{key:"a",tipo:"ALIMENTATORE",fmt:"_",label:"Alimentatore",emoji:"\u{1F50B}",mA:""}];K=null;window.pipRecovery={stato:function(){let t=g(),a=u(),e=localStorage.getItem("pip_local_ts");console.group("%c[pipRecovery] Stato localStorage pipistrelli","color:#1a237e;font-weight:bold"),console.log("\u{1F4C5} pip_local_ts:",e,e?"("+new Date(parseInt(e)).toLocaleString("it-IT")+")":"(mai salvato)"),console.log("\u{1F504} PRONTI:",JSON.stringify(t)),console.log("   \u2014 TESTA  P/M/G:",t.t_p||0,t.t_m||0,t.t_g||0),console.log("   \u2014 CORDONE P/M/G:",t.c_p||0,t.c_m||0,t.c_g||0);let i=Object.values(t).some(o=>o>0);return console.log(i?"\u2705 Pronti presenti \u2192 puoi usare pipRecovery.forzaRipristino()":"\u26A0\uFE0F Pronti tutti 0 \u2192 usa pipRecovery.reimpostaPronti({t_p:X,t_m:X,...})"),console.log("\u{1F4E6} CARICATO keys:",Object.keys(a).length,"\u2014 valori:",JSON.stringify(a)),console.groupEnd(),{pronti:t,caricato:a}},forzaRipristino:function(){let t={azione:"setPipData",qty:x(),caricato:u(),pronti:g(),movimenti:f()};localStorage.setItem("pip_local_ts",Date.now()),T(t).then(a=>console.log("%c[pipRecovery] \u2705 Ripristino inviato al server:","color:green",a)).catch(a=>console.error("[pipRecovery] \u274C Errore:",a)),console.log("[pipRecovery] Invio in corso...")},reimpostaPronti:function(t){let a=["t_p","t_m","t_g","c_p","c_m","c_g"],e={};a.forEach(i=>{e[i]=parseInt(t[i])||0}),console.log("[pipRecovery] Imposto pronti:",JSON.stringify(e)),M(e),console.log("%c[pipRecovery] \u2705 Pronti impostati e push al server avviato","color:green")}};Gt=V});kt();export{V as caricaPipistrelli,Gt as default,Qt as registerGlobals,Ht as resetPipFetch};
//# sourceMappingURL=chunk-pipistrelli-DG7RJYDR.js.map
