import{a as rt,c as W,e as lt,f as s,g as E,h as L,l as dt,m as O,q as mt,r as V,u as ft}from"./chunk-chunk-MVGUZ3SY.js";function oi(){H=!1}function k(){try{let n=localStorage.getItem(j);return n?JSON.parse(n):{kits:[]}}catch{return{kits:[]}}}function b(n){try{localStorage.setItem(j,JSON.stringify({kits:n})),localStorage.setItem(N,Date.now())}catch{}pt(n)}function pt(n){clearTimeout(X),X=setTimeout(function(){V({azione:"setKitData",kits:n}).catch(function(t){console.warn("[kit-prodotti] salvataggio remoto fallito:",t)})},1500)}function kt(n){fetch(W,{method:"POST",body:JSON.stringify({azione:"getKitData"})}).then(t=>t.json()).then(t=>{if(t&&Array.isArray(t.kits)){let e=parseInt(t.ts||0),i=parseInt(localStorage.getItem(N)||0);if(e>0&&e>i){try{localStorage.setItem(j,JSON.stringify({kits:t.kits}))}catch{}try{localStorage.setItem(N,e)}catch{}n&&n(!0);return}}n&&n(!1)}).catch(()=>{n&&n(!1)})}function T(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function D(){if(!O||!O.nome)return!1;let n=String(O.nome).toUpperCase().trim();return n==="ALESSIO"||n==="0000"||O.ruolo==="MASTER"}function K(n){let t={};for(let e of n.sezioni||[])for(let i of e.componenti||[]){let o=0;for(let[a,c]of Object.entries(n.qtaDaProdurre||{}))o+=(parseInt(c)||0)*(parseInt(i.qtaPerVariante?.[a])||0);t[i.id]=o}return t}function U(n){let t={};for(let e of n.sottoAssembly||[]){let i=parseInt(n.pronti?.[e.id])||0;if(!i)continue;let o=e.varianteKey;for(let a of n.sezioni||[])for(let c of a.componenti||[]){let l=parseInt(c.qtaPerVariante?.[o])||0;l>0&&(t[c.id]=(t[c.id]||0)+i*l)}}return t}function ut(n){let t={};for(let e of n.sottoAssembly||[]){let i=e.varianteKey,o=1/0,a=!1,c=U(n);for(let l of n.sezioni||[])for(let d of l.componenti||[]){let r=parseInt(d.qtaPerVariante?.[i])||0;if(!r)continue;a=!0;let m=Math.max(0,(parseInt(d.caricato)||0)-(c[d.id]||0));o=Math.min(o,Math.floor(m/r))}t[e.id]=a?o===1/0?0:o:0}return t}function Q(n,t){let e=(n.varianti||[]).find(i=>i.key===t);return e?s(e.nome):s(t)}function F(){return new Date().toLocaleString("it-IT",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}function B(){H||(H=!0,kt(function(i){i&&B()}));let{kits:n}=k(),t=document.getElementById("contenitore-dati"),e=n.map(i=>{let o=(i.varianti||[]).length,a=(i.sezioni||[]).reduce((d,r)=>d+(r.componenti||[]).length,0),c=(i.sottoAssembly||[]).length,l=Object.values(i.pronti||{}).reduce((d,r)=>d+(parseInt(r)||0),0);return`
        <div class="kit-card" onclick="_kitOpenView('${s(i.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${s(i.nome)}</span>
                <button class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${s(i.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
            </div>
            <div class="kit-card-meta">
                <span class="kit-meta-pill"><i class="fas fa-layer-group"></i> ${o} variant${o===1?"e":"i"}</span>
                <span class="kit-meta-pill"><i class="fas fa-list"></i> ${a} comp.</span>
                ${c?`<span class="kit-meta-pill"><i class="fas fa-puzzle-piece"></i> ${c} sub-asm.</span>`:""}
                ${l?`<span class="kit-meta-pill kit-meta-pill--pronti"><i class="fas fa-check"></i> ${l} pronti</span>`:""}
            </div>
        </div>`}).join("");t.innerHTML=`
    <div class="kit-page">
        <div class="kit-page-header">
            <div class="kit-page-title"><i class="fas fa-boxes-stacked"></i> Kit Prodotti</div>
            <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>
        </div>
        ${n.length===0?`<div class="kit-empty-state">
                <i class="fas fa-box-open kit-empty-icon"></i>
                <p>Nessun kit configurato.</p>
                <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
               </div>`:`<div class="kit-grid">${e}</div>`}
    </div>`,L(t)}function vt(n){z=n,A="bom",q()}function q(){let{kits:n}=k(),t=n.find(f=>f.id===z);if(!t){B();return}let e=document.getElementById("contenitore-dati"),i=K(t),o=U(t),a=ut(t),c=t.varianti||[],l=c.map(f=>`<th class="kit-col-coeff" title="${s(f.nome)}">\xD7 ${s(f.key)}</th>`).join(""),d="";for(let f of t.sezioni||[]){let _=f.componenti||[];if(_.length){d+=`<tr class="kit-bom-sez-row"><td colspan="${6+c.length}" class="kit-bom-sez-cell">${s(f.nome)}</td></tr>`;for(let C of _){let p=i[C.id]||0,h=parseInt(C.caricato)||0,M=o[C.id]||0,S=Math.max(0,h-M),w=Math.max(0,p-h),Y=p===0?"kit-ord-zero":w>0?"kit-ord-manca":"kit-ord-ok",R=c.map(P=>{let Z=parseInt(C.qtaPerVariante?.[P.key])||0;return Z>0?`<td class="kit-coeff kit-coeff-on">${Z}</td>`:'<td class="kit-coeff kit-coeff-off">\u2014</td>'}).join("");d+=`<tr data-cid="${s(C.id)}" data-sid="${s(f.id)}">
                <td class="kit-mat">${s(C.nome)}</td>
                ${R}
                <td class="kit-fab${p===0?" kit-fab-zero":""}">${p>0?p:"\u2014"}</td>
                <td class="kit-car-cell">
                    <input class="kit-car-input" type="number" min="0" value="${h}"
                           data-cid="${s(C.id)}" data-sid="${s(f.id)}"
                           oninput="_kitAggiornaCar(this)" onchange="_kitAggiornaCar(this)">
                    <span class="kit-car-liberi" ${M>0?"":'style="display:none"'}>${S} lib.</span>
                </td>
                <td class="${Y}">${p===0?"\u2014":w}</td>
            </tr>`}}}let r=[];for(let f of t.sezioni||[])for(let _ of f.componenti||[])r.push(`<option value="${s(_.id)}" data-sid="${s(f.id)}">[${s(f.nome)}] ${s(_.nome)}</option>`);let m=c.map(f=>{let _=parseInt(t.qtaDaProdurre?.[f.key])||0;return`<div class="kit-qty-item">
            <label>${s(f.nome)}</label>
            <input class="kit-qty-input" id="kit-qty-${s(f.key)}" type="number" min="0" value="${_}"
                   data-vkey="${s(f.key)}"
                   oninput="_kitAggiornaQty('${s(t.id)}')" onchange="_kitAggiornaQty('${s(t.id)}')">
        </div>`}).join(""),u=Object.values(t.qtaDaProdurre||{}).reduce((f,_)=>f+(parseInt(_)||0),0),v=(t.sottoAssembly||[]).map(f=>{let _=parseInt(t.pronti?.[f.id])||0,C=a[f.id]||0,p=Q(t,f.varianteKey);return`<div class="kit-sped-sa-row">
            <div class="kit-sped-sa-label"><i class="fas fa-puzzle-piece"></i> ${s(f.nome)} <span class="kit-sped-var-pill">${p}</span></div>
            <div class="kit-sped-sa-stats">
                <span class="kit-sped-pronti-cnt">${_} pronti</span>
                <span class="kit-sped-max ${C>0?"kit-sped-max--ok":"kit-sped-max--zero"}">${C} assemb.</span>
            </div>
            <div class="kit-pronti-ctrl">
                <button class="kit-pronti-btn" onclick="_kitAggiornaPronti('${s(t.id)}','${s(f.id)}',-1)">\u2212</button>
                <input class="kit-pronti-input${_>0?" kit-pronti-val-on":""}" type="number" min="0"
                       value="${_}" data-said="${s(f.id)}"
                       oninput="_kitSetPronti('${s(t.id)}','${s(f.id)}',this.value)"
                       onchange="_kitSetPronti('${s(t.id)}','${s(f.id)}',this.value)">
                <button class="kit-pronti-btn" onclick="_kitAggiornaPronti('${s(t.id)}','${s(f.id)}',1)">+</button>
            </div>
        </div>`}).join(""),g=(t.sottoAssembly||[]).some(f=>(parseInt(t.pronti?.[f.id])||0)>0),$=D(),y=it(t,$);e.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${s(t.nome)}</span>
            <button class="kit-gear-btn-inline" onclick="_kitOpenConfig('${s(t.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <!-- Tabs -->
        <div class="kit-tabs">
            <button class="kit-tab ${A==="bom"?"kit-tab--active":""}" onclick="_kitSwitchTab('bom')"><i class="fas fa-list"></i> BOM</button>
            <button class="kit-tab ${A==="qty"?"kit-tab--active":""}" onclick="_kitSwitchTab('qty')"><i class="fas fa-hashtag"></i> Quantit\xE0</button>
            <button class="kit-tab ${A==="sped"?"kit-tab--active":""}" onclick="_kitSwitchTab('sped')">
                <i class="fas fa-truck"></i> Pronti
                ${g?'<span class="kit-tab-badge"></span>':""}
            </button>
            <button class="kit-tab ${A==="mov"?"kit-tab--active":""}" onclick="_kitSwitchTab('mov')"><i class="fas fa-boxes-stacked"></i> Mag.</button>
        </div>

        <!-- TAB BOM -->
        <div class="kit-tab-panel ${A==="bom"?"kit-tab-panel--active":""}">
            <div class="kit-table-wrap">
                <table class="kit-table">
                    <thead>
                        <tr>
                            <th>COMPONENTE</th>
                            ${l}
                            <th>FABBISOGNO</th>
                            <th>CARICATO</th>
                            <th>DA ORDINARE</th>
                        </tr>
                    </thead>
                    <tbody id="kit-tbody-${s(t.id)}">${d}</tbody>
                </table>
            </div>
            <div class="kit-legend">
                <span class="kit-leg-item kit-ord-manca" style="padding:2px 7px;border-radius:5px">\u25CF mancante</span>
                <span class="kit-leg-item kit-ord-ok" style="padding:2px 7px;border-radius:5px">\u25CF disponibile</span>
                <span class="kit-leg-item" style="color:#9ca3af">\u2014 = non necessario</span>
            </div>
        </div>

        <!-- TAB QUANTIT\xC0 -->
        <div class="kit-tab-panel ${A==="qty"?"kit-tab-panel--active":""}">
            <div class="kit-qty-card">
                <div class="kit-qty-label">QT\xC0 DA PRODURRE</div>
                <div class="kit-qty-inputs">${m}
                    <div class="kit-qty-total-box">
                        <div class="kit-qty-total-label">TOTALE</div>
                        <div class="kit-qty-total-val" id="kit-tot-${s(t.id)}">${u}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB PRONTI / SPEDIZIONE -->
        <div class="kit-tab-panel ${A==="sped"?"kit-tab-panel--active":""}">
            ${(t.sottoAssembly||[]).length===0?`<div class="kit-empty-state" style="padding:40px 20px">
                    <i class="fas fa-puzzle-piece" style="font-size:2rem;color:#cbd5e1;margin-bottom:12px"></i>
                    <p>Nessun sub-assembly configurato.</p>
                    <button class="kit-btn-secondary" onclick="_kitOpenConfig('${s(t.id)}')">Configura sub-assembly</button>
                   </div>`:`<div class="kit-sped-section">
                    <div class="kit-sped-title"><i class="fas fa-truck"></i> PRONTI DA SPEDIRE</div>
                    <div class="kit-sped-sa-list">${v}</div>
                    <div class="kit-sped-footer">
                        <input type="text" id="kit-sped-nota-${s(t.id)}" class="kit-sped-nota-input"
                               placeholder="Note spedizione\u2026" maxlength="80">
                        <button class="kit-spedisci-btn" onclick="_kitApriModalSped('${s(t.id)}')">
                            <i class="fas fa-truck"></i> Registra Spedizione
                        </button>
                    </div>
                   </div>`}
        </div>

        <!-- TAB MOVIMENTI -->
        <div class="kit-tab-panel ${A==="mov"?"kit-tab-panel--active":""}">
            <div class="kit-mov-form">
                <div class="kit-mov-form-field" style="grid-column:1/3">
                    <label class="kit-mov-form-label">Componente</label>
                    <select id="kit-mov-mat-${s(t.id)}">${r.join("")}</select>
                </div>
                <div class="kit-mov-form-field">
                    <label class="kit-mov-form-label">Quantit\xE0</label>
                    <input type="number" id="kit-mov-qty-${s(t.id)}" min="1" value="1">
                </div>
                <div class="kit-mov-form-field">
                    <label class="kit-mov-form-label">Note (opz.)</label>
                    <input type="text" id="kit-mov-nota-${s(t.id)}" placeholder="es. DDT 123\u2026" maxlength="60">
                </div>
                <button class="kit-mov-btn-carico" onclick="_kitSalvaMovimento('${s(t.id)}','carico')">
                    <i class="fas fa-arrow-down"></i> Carico
                </button>
                <button class="kit-mov-btn-scarico" onclick="_kitSalvaMovimento('${s(t.id)}','scarico')">
                    <i class="fas fa-arrow-up"></i> Scarico
                </button>
            </div>
            <div id="kit-mov-list-${s(t.id)}" class="kit-mov-list">${y}</div>
        </div>

        <!-- Pulsanti azione globale -->
        <div class="kit-actions-bar">
            <button class="kit-reso-btn" onclick="_kitApriModalReso('${s(t.id)}')">
                <i class="fas fa-rotate-left"></i> Reso
            </button>
            <button class="kit-save-btn" id="kit-save-btn" onclick="_kitSalvaManuale('${s(t.id)}')">
                <i class="fas fa-cloud-arrow-up"></i> <span id="kit-save-label">Salva</span>
            </button>
        </div>
    </div>`,L(e)}function gt(){z=null,B()}function bt(n){A=n,q()}function yt(n){let{kits:t}=k(),e=t.find(a=>a.id===n);if(!e)return;e.qtaDaProdurre||(e.qtaDaProdurre={});for(let a of e.varianti||[]){let c=document.getElementById("kit-qty-"+a.key);c&&(e.qtaDaProdurre[a.key]=Math.max(0,parseInt(c.value)||0))}let i=Object.values(e.qtaDaProdurre).reduce((a,c)=>a+c,0),o=document.getElementById("kit-tot-"+n);o&&(o.textContent=i),b(t),$t(e)}function $t(n){let t=K(n),e=n.varianti||[],i=document.getElementById("kit-tbody-"+n.id);if(i)for(let o of i.querySelectorAll("tr[data-cid]")){let a=o.dataset.cid,c=o.dataset.sid,l=(n.sezioni||[]).find($=>$.id===c),d=l&&(l.componenti||[]).find($=>$.id===a);if(!d)continue;let r=t[a]||0,m=parseInt(d.caricato)||0,u=Math.max(0,r-m),v=o.querySelector(".kit-fab, .kit-fab-zero");v&&(v.textContent=r>0?r:"\u2014",v.className=r===0?"kit-fab kit-fab-zero":"kit-fab");let g=o.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");g&&(g.textContent=r===0?"\u2014":u,g.className=r===0?"kit-ord-zero":u>0?"kit-ord-manca":"kit-ord-ok")}}function tt(n){let t=n.dataset.cid,e=n.dataset.sid,i=Math.max(0,parseInt(n.value)||0),{kits:o}=k(),a=o.find(f=>f.id===z);if(!a)return;let c=(a.sezioni||[]).find(f=>f.id===e),l=c&&(c.componenti||[]).find(f=>f.id===t);if(!l)return;l.caricato=i,b(o);let r=K(a)[t]||0,m=Math.max(0,r-i),v=U(a)[t]||0,g=n.closest("tr");if(!g)return;let $=g.querySelector(".kit-ord-zero,.kit-ord-manca,.kit-ord-ok");$&&($.textContent=r===0?"\u2014":m,$.className=r===0?"kit-ord-zero":m>0?"kit-ord-manca":"kit-ord-ok");let y=g.querySelector(".kit-car-liberi");y&&(v>0?(y.textContent=Math.max(0,i-v)+" lib.",y.style.display=""):y.style.display="none")}function ht(n,t,e){let{kits:i}=k(),o=i.find(a=>a.id===n);o&&(o.pronti||(o.pronti={}),o.pronti[t]=Math.max(0,(parseInt(o.pronti[t])||0)+e),b(i),z===n&&q())}function _t(n,t,e){let{kits:i}=k(),o=i.find(c=>c.id===n);if(!o)return;o.pronti||(o.pronti={}),o.pronti[t]=Math.max(0,parseInt(e)||0),b(i);let a=document.querySelector(`.kit-pronti-input[data-said="${t}"]`);a&&(a.value=o.pronti[t],a.classList.toggle("kit-pronti-val-on",o.pronti[t]>0))}function it(n,t){let e=n.movimenti||[];return e.length?e.map(i=>{let o=t?`<button class="kit-mov-del" onclick="_kitEliminaMovimento('${s(n.id)}',${i.id})" title="Elimina">\u2715</button>`:'<span style="width:22px;flex-shrink:0"></span>',a=t&&(i.tipo==="carico"||i.tipo==="scarico")?`<button class="kit-mov-edit" onclick="_kitModificaMovimento('${s(n.id)}',${i.id})" title="Modifica">\u270E</button>`:'<span style="width:22px;flex-shrink:0"></span>';if(i.tipo==="spedizione"){let c=(i.righe||[]).reduce((r,m)=>r+m.qty,0),l=(i.righe||[]).map(r=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${s(r.mat)}</span><span class="kit-mov-qty scarico">\u2212${r.qty}</span></div>`).join(""),d=(i.items||[]).map(r=>`<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${s(r.nome)}</span><span class="kit-mov-qty scarico">\xD7${r.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">\u{1F69A} Spediz. \xD7${c} pz</span>
                ${i.nota?`<span class="kit-mov-nota">${s(i.nota)}</span>`:""}
                <span class="kit-mov-ts">${i.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">${d}<div class="kit-sped-bom-divider">componenti scaricati</div>${l}</div>
            </details>`}if(i.tipo==="reso"){let c=i.totPz||0,l=(i.items||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${s(m.nome)}</span><span class="kit-mov-qty carico">\xD7${m.qty}</span></div>`).join(""),d=(i.righe||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">\u2713 ${s(m.mat)}</span><span class="kit-mov-qty carico">+${m.qty}</span></div>`).join(""),r=(i.scartate||[]).map(m=>`<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${s(m.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">\u2715 ${m.qty}</span></div>`).join("");return`<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">\u{1F4E6} Rientro \xD7${c} pz</span>
                ${i.nota?`<span class="kit-mov-nota">${s(i.nota)}</span>`:""}
                <span class="kit-mov-ts">${i.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${o}
              </summary>
              <div class="kit-assemb-sub-list">
                ${l}
                ${d?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${d}`:""}
                ${r?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${r}`:""}
              </div>
            </details>`}return`<div class="kit-mov-item ${s(i.tipo)}">
            <span class="kit-mov-badge ${s(i.tipo)}">${i.tipo==="carico"?"CARICO":"SCARICO"}</span>
            <span class="kit-mov-mat">${s(i.mat)}</span>
            <span class="kit-mov-qty ${s(i.tipo)}">${i.tipo==="carico"?"+":"\u2212"}${i.qty}</span>
            ${i.nota?`<span class="kit-mov-nota">${s(i.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${i.ts}</span>
            ${a}${o}
        </div>`}).join(""):'<div class="kit-mov-empty">Nessun movimento registrato.</div>'}function wt(n,t){let{kits:e}=k(),i=e.find(y=>y.id===n);if(!i)return;let o=document.getElementById("kit-mov-mat-"+n),a=document.getElementById("kit-mov-qty-"+n),c=document.getElementById("kit-mov-nota-"+n);if(!o||!a)return;let l=o.value,d=o.options[o.selectedIndex]?.dataset.sid,r=Math.max(1,parseInt(a.value)||1),m=(c?.value||"").trim(),u=(i.sezioni||[]).find(y=>y.id===d),v=u&&(u.componenti||[]).find(y=>y.id===l);if(!v)return;t==="carico"?v.caricato=(parseInt(v.caricato)||0)+r:v.caricato=Math.max(0,(parseInt(v.caricato)||0)-r),i.movimenti||(i.movimenti=[]),i.movimenti.unshift({id:Date.now(),cid:l,sid:d,tipo:t,qty:r,nota:m,mat:v.nome,ts:F()}),b(e),a&&(a.value=1),c&&(c.value="");let g=document.getElementById("kit-mov-list-"+n);g&&(g.innerHTML=it(i,D()));let $=document.querySelector(`#kit-tbody-${n} input[data-cid="${l}"]`);$&&($.value=v.caricato,tt($))}function Ct(n,t){if(!D())return;let{kits:e}=k(),i=e.find(a=>a.id===n);if(!i)return;let o=(i.movimenti||[]).find(a=>a.id===t);o&&zt(n,t,o)}function zt(n,t,e){let i=document.getElementById("modal-kit-del-mov");if(!i)return;let o=document.getElementById("kit-del-mov-desc"),a;if(e.tipo==="spedizione")a=`<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione \xD7${(e.righe||[]).reduce((d,r)=>d+r.qty,0)} pz</strong>`;else if(e.tipo==="reso")a=`<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro \xD7${e.totPz||0} pz</strong>`;else{let l=e.tipo==="carico"?"CARICO":"SCARICO";a=`<span class="kit-mov-badge ${s(e.tipo)}" style="font-size:.75rem">${l}</span> <strong>${s(e.mat)}</strong> ${e.tipo==="carico"?"+":"\u2212"}${e.qty} pz`}o&&(o.innerHTML=a);let c=document.getElementById("btn-kit-del-ok");c&&(c.onclick=()=>ot(n,t)),i.style.display="flex",i.offsetHeight,i.classList.add("active")}function nt(){let n=document.getElementById("modal-kit-del-mov");n&&(n.classList.remove("active"),setTimeout(()=>{n.classList.contains("active")||(n.style.display="none")},300))}function ot(n,t){nt();let{kits:e}=k(),i=e.find(a=>a.id===n);if(!i)return;let o=(i.movimenti||[]).find(a=>a.id===t);if(o){if(o.tipo==="spedizione"){let a=(i.sezioni||[]).find(c=>c.id===o.sid);for(let c of o.righe||[])for(let l of i.sezioni||[]){let d=(l.componenti||[]).find(r=>r.id===c.cid||r.nome===c.mat);d&&(d.caricato=(parseInt(d.caricato)||0)+c.qty)}for(let c of o.items||[])c.saId&&i.pronti&&(i.pronti[c.saId]=(parseInt(i.pronti[c.saId])||0)+c.qty)}else if(o.tipo==="reso")for(let a of o.righe||[])for(let c of i.sezioni||[]){let l=(c.componenti||[]).find(d=>d.id===a.cid||d.nome===a.mat);l&&(l.caricato=Math.max(0,(parseInt(l.caricato)||0)-a.qty))}else if(o.tipo==="carico")for(let a of i.sezioni||[]){let c=(a.componenti||[]).find(l=>l.id===o.cid);c&&(c.caricato=Math.max(0,(parseInt(c.caricato)||0)-o.qty))}else if(o.tipo==="scarico")for(let a of i.sezioni||[]){let c=(a.componenti||[]).find(l=>l.id===o.cid);c&&(c.caricato=(parseInt(c.caricato)||0)+o.qty)}i.movimenti=(i.movimenti||[]).filter(a=>a.id!==t),b(e),z===n&&q(),E("Movimento eliminato \u2713")}}function It(n,t){if(!D())return;let{kits:e}=k(),i=e.find(r=>r.id===n);if(!i)return;let o=(i.movimenti||[]).find(r=>r.id===t);if(!o)return;let a=document.getElementById("modal-kit-edit-mov");if(!a)return;let c=document.getElementById("kit-edit-mov-mat"),l=document.getElementById("kit-edit-mov-qty"),d=document.getElementById("kit-edit-mov-nota");c&&(c.innerHTML=`<span class="kit-mov-badge ${s(o.tipo)}" style="font-size:.75rem">${o.tipo==="carico"?"CARICO":"SCARICO"}</span> <strong>${s(o.mat)}</strong>`),l&&(l.value=o.qty),d&&(d.value=o.nota||""),a.dataset.kitId=n,a.dataset.movId=t,a.style.display="flex",a.offsetHeight,a.classList.add("active"),setTimeout(()=>d&&d.focus(),80)}function et(){let n=document.getElementById("modal-kit-edit-mov");n&&(n.classList.remove("active"),setTimeout(()=>{n.classList.contains("active")||(n.style.display="none")},300))}function At(){let n=document.getElementById("modal-kit-edit-mov");if(!n)return;let t=n.dataset.kitId,e=Number(n.dataset.movId);et();let{kits:i}=k(),o=i.find(r=>r.id===t);if(!o)return;let a=(o.movimenti||[]).findIndex(r=>r.id===e);if(a===-1)return;let c=o.movimenti[a],l=parseInt(document.getElementById("kit-edit-mov-qty")?.value),d=(document.getElementById("kit-edit-mov-nota")?.value||"").trim();if(isNaN(l)||l<=0){E("Quantit\xE0 non valida \u26A0\uFE0F");return}if(l!==c.qty){let r=l-c.qty;for(let m of o.sezioni||[]){let u=(m.componenti||[]).find(v=>v.id===c.cid);if(u){c.tipo==="carico"?u.caricato=Math.max(0,(parseInt(u.caricato)||0)+r):u.caricato=Math.max(0,(parseInt(u.caricato)||0)-r);break}}}o.movimenti[a]={...c,qty:l,nota:d},b(i),z===t&&q(),E("Movimento aggiornato \u2713")}function St(n){let{kits:t}=k(),e=t.find(d=>d.id===n);if(!e)return;if(!(e.sottoAssembly||[]).some(d=>(parseInt(e.pronti?.[d.id])||0)>0)){E("Nessun sub-assembly pronto \u2014 imposta le quantit\xE0 prima \u26A0\uFE0F");return}let o=document.getElementById("modal-kit-sped");if(!o)return;let a=document.getElementById("kit-sped-items-list");a&&(a.innerHTML=(e.sottoAssembly||[]).filter(d=>(parseInt(e.pronti?.[d.id])||0)>0).map(d=>{let r=parseInt(e.pronti?.[d.id])||0,m=Q(e,d.varianteKey);return`<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${s(d.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${s(d.nome)} <span class="kit-sped-var-pill">${m}</span></span>
                        <span class="kit-sped-item-qty">\xD7${r}</span>
                    </span>
                </label>`}).join(""));let c=document.getElementById("kit-sped-nota-"+n),l=document.getElementById("kit-sped-modal-nota");l&&c&&(l.value=c.value||""),l&&!c&&(l.value=""),o.dataset.kitId=n,o.style.display="flex",o.offsetHeight,o.classList.add("active")}function st(){let n=document.getElementById("modal-kit-sped");n&&(n.classList.remove("active"),setTimeout(()=>{n.classList.contains("active")||(n.style.display="none")},300))}function qt(){let n=document.getElementById("modal-kit-sped");if(!n)return;let t=n.dataset.kitId;st();let e=[...document.querySelectorAll(".kit-sped-chk:checked")].map(r=>r.dataset.said);if(!e.length)return;let{kits:i}=k(),o=i.find(r=>r.id===t);if(!o)return;let a=(document.getElementById("kit-sped-modal-nota")?.value||"").trim(),c=[],l=[];for(let r of e){let m=(o.sottoAssembly||[]).find(v=>v.id===r);if(!m)continue;let u=parseInt(o.pronti?.[r])||0;if(u){c.push({saId:r,nome:m.nome,qty:u});for(let v of o.sezioni||[])for(let g of v.componenti||[]){let $=parseInt(g.qtaPerVariante?.[m.varianteKey])||0;if(!$)continue;let y=u*$;g.caricato=Math.max(0,(parseInt(g.caricato)||0)-y);let f=l.find(_=>_.cid===g.id);f?f.qty+=y:l.push({cid:g.id,mat:g.nome,qty:y})}o.pronti||(o.pronti={}),delete o.pronti[r]}}o.movimenti||(o.movimenti=[]),o.movimenti.unshift({id:Date.now(),tipo:"spedizione",items:c,righe:l,nota:a,ts:F()}),b(i);let d=c.reduce((r,m)=>r+m.qty,0);E(`Spedizione registrata: ${d} pz \u2713`),z===t&&q()}function Et(n){let{kits:t}=k(),e=t.find(c=>c.id===n);if(!e)return;let i=document.getElementById("modal-kit-reso");if(!i)return;let o=document.getElementById("kit-reso-items-list");if(o){let c=e.sottoAssembly||[];o.innerHTML=c.length===0?'<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>':c.map(l=>{let d=Q(e,l.varianteKey);return`<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${s(l.nome)} <span class="kit-sped-var-pill">${d}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${s(l.id)}',-1)">\u2212</button>
                        <input type="number" id="kit-reso-qty-${s(l.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${s(n)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${s(l.id)}',1)">+</button>
                    </div>
                </div>`}).join("")}let a=document.getElementById("kit-reso-nota");a&&(a.value=""),G(n),i.dataset.kitId=n,i.style.display="flex",i.offsetHeight,i.classList.add("active")}function at(){let n=document.getElementById("modal-kit-reso");n&&(n.classList.remove("active"),setTimeout(()=>{n.classList.contains("active")||(n.style.display="none")},300))}function Mt(n,t){let e=document.getElementById("kit-reso-qty-"+n);if(!e)return;e.value=Math.max(0,(parseInt(e.value)||0)+t);let i=document.getElementById("modal-kit-reso");i?.dataset.kitId&&G(i.dataset.kitId)}function G(n){let{kits:t}=k(),e=t.find(c=>c.id===n);if(!e)return;let i={};for(let c of e.sottoAssembly||[]){let l=document.getElementById("kit-reso-qty-"+c.id),d=parseInt(l?.value)||0;if(d)for(let r of e.sezioni||[])for(let m of r.componenti||[]){let u=parseInt(m.qtaPerVariante?.[c.varianteKey])||0;u&&(i[m.id]={mat:m.nome,qty:(i[m.id]?.qty||0)+d*u})}}let o=document.getElementById("kit-reso-bom-list");if(!o)return;let a=Object.entries(i).filter(([,c])=>c.qty>0);if(!a.length){o.innerHTML='<div class="kit-reso-bom-empty">Inserisci le quantit\xE0 sopra per vedere i componenti da recuperare.</div>';return}o.innerHTML=a.map(([c,{mat:l,qty:d}])=>`<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${s(c)}" data-qty="${d}" checked>
            <span class="kit-reso-bom-mat">${s(l)}</span>
            <span class="kit-reso-bom-qty">+${d}</span>
        </label>`).join("")}function xt(){let n=document.getElementById("modal-kit-reso");if(!n)return;let t=n.dataset.kitId,{kits:e}=k(),i=e.find(r=>r.id===t);if(!i)return;let o=[];for(let r of i.sottoAssembly||[]){let m=parseInt(document.getElementById("kit-reso-qty-"+r.id)?.value)||0;m>0&&o.push({saId:r.id,nome:r.nome,qty:m})}if(!o.length){E("Inserisci almeno un articolo rientrato \u26A0\uFE0F");return}let a=[],c=[];document.querySelectorAll(".kit-reso-bom-chk").forEach(r=>{let m=r.dataset.cid,u=parseInt(r.dataset.qty),v=[...i.sezioni||[]].flatMap(g=>g.componenti||[]).find(g=>g.id===m)?.nome||"?";r.checked?a.push({cid:m,mat:v,qty:u}):c.push({cid:m,mat:v,qty:u})});for(let r of a)for(let m of i.sezioni||[]){let u=(m.componenti||[]).find(v=>v.id===r.cid);if(u){u.caricato=(parseInt(u.caricato)||0)+r.qty;break}}let l=(document.getElementById("kit-reso-nota")?.value||"").trim(),d=o.reduce((r,m)=>r+m.qty,0);i.movimenti||(i.movimenti=[]),i.movimenti.unshift({id:Date.now(),tipo:"reso",items:o,righe:a,scartate:c,nota:l,ts:F(),totPz:d}),b(e),at(),E(`Reso registrato: ${d} pz \u2014 ${a.length} comp. recuperati \u2713`),z===t&&q()}function Tt(n){let t=document.getElementById("kit-save-btn"),e=document.getElementById("kit-save-label");if(!t||!e)return;t.disabled=!0,t.classList.add("kit-save-loading"),e.textContent="Salvataggio\u2026";let{kits:i}=k();V({azione:"setKitData",kits:i}).then(()=>{try{localStorage.setItem(N,Date.now())}catch{}t.classList.remove("kit-save-loading"),t.classList.add("kit-save-ok"),e.textContent="Salvato \u2713",setTimeout(()=>{t.classList.remove("kit-save-ok"),e.textContent="Salva",t.disabled=!1},2500)}).catch(()=>{t.classList.remove("kit-save-loading"),t.classList.add("kit-save-err"),e.textContent="Errore \u2717",setTimeout(()=>{t.classList.remove("kit-save-err"),e.textContent="Salva",t.disabled=!1},3e3)})}function Bt(){let{kits:n}=k(),t={id:T(),nome:"Nuovo Kit",varianti:[],sezioni:[],sottoAssembly:[],qtaDaProdurre:{},pronti:{},movimenti:[]};n.push(t),b(n),ct(t.id)}function ct(n){J=n,x="info",I()}function I(){let{kits:n}=k(),t=n.find(p=>p.id===J);if(!t){B();return}let e=document.getElementById("contenitore-dati");x==="sezioni"&&(x="bom");let i=["info","varianti","bom","sa"],o={info:"Info",varianti:"Varianti",bom:"Materiali BOM",sa:"Sub-Assembly"},a=(t.varianti||[]).length,c=(t.sezioni||[]).reduce((p,h)=>p+(h.componenti||[]).length,0),l=(t.sottoAssembly||[]).length,d=a?`
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div><strong>${a}</strong> variante/i:
                    ${(t.varianti||[]).map(p=>`<span class="kit-cfg-sa-var-badge">${s(p.nome)}</span>`).join(" ")}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${c}</strong> componenti BOM in <strong>${(t.sezioni||[]).length}</strong> sezioni</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-hammer"></i>
                <div><strong>${l}</strong> sub-assembly (parti da tracciare come pronti)</div>
            </div>
        </div>`:'<div class="kit-cfg-help">\u{1F4A1} Inizia dalla tab <strong>Varianti</strong> per definire le versioni del prodotto (es. 500mA, 600mA, 700mA).</div>',r=`
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${s(t.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${s(t.id)}',this.value)">
        </div>
        ${d}
        <div class="kit-cfg-danger">
            <button class="kit-btn-danger" onclick="_kitElimina('${s(t.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`,u=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>varianti</strong> sono le versioni del prodotto (es. 500mA, 600mA, 700mA).<br>
                La <strong>chiave breve</strong> \xE8 un'abbreviazione interna (es. <code>500</code>) che appare come intestazione colonna nel BOM.
            </div>
            ${(t.varianti||[]).map((p,h)=>`
        <div class="kit-cfg-row" data-vi="${h}">
            <div class="kit-cfg-var-field">
                <label class="kit-cfg-label" style="margin:0">Chiave breve</label>
                <input class="kit-cfg-input kit-cfg-input-small" value="${s(p.key)}" maxlength="8" placeholder="es. 500"
                       onchange="_kitCfgUpdateVar('${s(t.id)}',${h},'key',this.value)">
            </div>
            <div class="kit-cfg-var-field" style="flex:1">
                <label class="kit-cfg-label" style="margin:0">Nome variante</label>
                <input class="kit-cfg-input" value="${s(p.nome)}" maxlength="40" placeholder="es. 500mA"
                       onchange="_kitCfgUpdateVar('${s(t.id)}',${h},'nome',this.value)">
            </div>
            <button class="kit-cfg-del-btn" style="align-self:flex-end;margin-bottom:1px" onclick="_kitCfgDelVar('${s(t.id)}',${h})"><i class="fas fa-times"></i></button>
        </div>`).join("")||'<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessuna variante ancora.</div>'}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddVar('${s(t.id)}')"><i class="fas fa-plus"></i> Aggiungi variante</button>
        </div>`,v=(t.varianti||[]).map(p=>{let h=p.nome.length>9?p.nome.substring(0,8)+"\u2026":p.nome;return`<span class="kit-cfg-coeff-lbl" title="${s(p.nome)}">${s(h)}</span>`}).join(""),g=(t.sezioni||[]).map((p,h)=>{let M=(p.componenti||[]).map((w,Y)=>{let R=(t.varianti||[]).map(P=>`<input class="kit-cfg-coeff" type="number" min="0" value="${parseInt(w.qtaPerVariante?.[P.key])||0}"
                        title="${s(P.nome)}: pezzi di '${s(w.nome)}' per UNA unit\xE0"
                        onchange="_kitCfgUpdateComp('${s(t.id)}','${s(p.id)}','${s(w.id)}','coeff','${s(P.key)}',this.value)">`).join("");return`<div class="kit-cfg-comp-row">
                <input class="kit-cfg-input kit-cfg-input-comp" value="${s(w.nome)}" maxlength="60" placeholder="es. Profilo alluminio"
                       onchange="_kitCfgUpdateComp('${s(t.id)}','${s(p.id)}','${s(w.id)}','nome','',this.value)">
                <div class="kit-cfg-coeffs">${R}</div>
                <button class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${s(t.id)}','${s(p.id)}','${s(w.id)}')"><i class="fas fa-times"></i></button>
            </div>`}).join(""),S=(t.varianti||[]).length?`
            <div class="kit-cfg-comp-header">
                <span style="flex:1;font-size:0.67rem;color:#94a3b8">Componente</span>
                ${v}
                <span style="width:28px"></span>
            </div>`:"";return`<div class="kit-cfg-sez-block" data-si="${h}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${s(p.nome)}" maxlength="40" placeholder="Nome sezione (es. TESTA)"
                       onchange="_kitCfgUpdateSez('${s(t.id)}','${s(p.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${s(t.id)}','${s(p.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${S}
            ${M}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${s(t.id)}','${s(p.id)}')"><i class="fas fa-plus"></i> Aggiungi componente</button>
        </div>`}).join(""),$=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                I <strong>componenti</strong> sono le materie prime. Per ogni riga, inserisci quanti pezzi
                servono per produrre <strong>UNA</strong> unit\xE0 di ciascuna variante (coefficiente).<br>
                Usa le <strong>sezioni</strong> per raggruppare (es. una sezione <em>TESTA</em>, una <em>CORDONE</em>).
            </div>
            ${(t.varianti||[]).length?"":'<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima le varianti nella tab <strong>Varianti</strong>.</div>'}
            ${g}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${s(t.id)}')"><i class="fas fa-plus"></i> Aggiungi sezione</button>
        </div>`,y="";(t.varianti||[]).length?y=(t.varianti||[]).map(p=>{let h=(t.sottoAssembly||[]).map((S,w)=>({sa:S,i:w})).filter(({sa:S})=>S.varianteKey===p.key),M=h.map(({sa:S,i:w})=>`
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${s(S.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${s(t.id)}',${w},'nome',this.value)">
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${s(t.id)}',${w})"><i class="fas fa-times"></i></button>
                </div>`).join("");return`<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${s(p.nome)}</span>
                    <span class="kit-cfg-sa-count">${h.length} part${h.length!==1?"i":"e"}</span>
                </div>
                ${M||'<div class="kit-cfg-sa-empty">Nessuna parte \u2014 aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${s(t.id)}','${s(p.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${s(p.nome)}</button>
            </div>`}).join(""):y='<div class="kit-cfg-warn">\u26A0\uFE0F Aggiungi prima le varianti nella tab <strong>Varianti</strong>.</div>';let f=`
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                I <strong>sub-assembly</strong> sono le parti da costruire, tracciate separatamente per variante.<br>
                Es.: per il pipistrello crei <em>Testa</em> e <em>Cordone</em> per ogni variante (500mA, 600mA, 700mA).<br>
                Nel tab <strong>Pronti</strong> segni quante ne hai assemblate. Nel tab <strong>BOM</strong> nomina le sezioni uguale (es. <em>TESTA</em>) per coerenza.
            </div>
            ${y}
        </div>`,_={info:r,varianti:u,bom:$,sa:f},C=i.map(p=>`<button class="kit-tab ${x===p?"kit-tab--active":""}" onclick="_kitCfgSwitchTab('${p}')">${o[p]}</button>`).join("");e.innerHTML=`
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${s(t.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${s(t.nome)}</span>
        </div>
        <div class="kit-tabs">${C}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${_[x]}</div>
    </div>`,L(e)}function Pt(n){if(n&&z===n){q();return}z=n,q()}function Ot(n){x=n,I()}function Lt(n,t){let{kits:e}=k(),i=e.find(o=>o.id===n);i&&(i.nome=t.trim()||"Kit senza nome",b(e))}function Nt(n){if(!confirm("Eliminare questo kit e tutti i suoi dati?"))return;let{kits:t}=k();b(t.filter(e=>e.id!==n)),J=null,z=null,B()}function Dt(n){let{kits:t}=k(),e=t.find(o=>o.id===n);if(!e)return;let i=(e.varianti||[]).length+1;e.varianti=e.varianti||[],e.varianti.push({id:T(),key:"v"+i,nome:"Variante "+i}),b(t),I()}function Rt(n,t,e,i){let{kits:o}=k(),a=o.find(c=>c.id===n);!a||!a.varianti[t]||(a.varianti[t][e]=i.trim(),b(o))}function Vt(n,t){let{kits:e}=k(),i=e.find(o=>o.id===n);i&&(i.varianti.splice(t,1),b(e),I())}function Ht(n){let{kits:t}=k(),e=t.find(i=>i.id===n);e&&(e.sezioni=e.sezioni||[],e.sezioni.push({id:T(),nome:"Nuova sezione",componenti:[]}),b(t),I())}function jt(n,t,e,i){let{kits:o}=k(),a=o.find(l=>l.id===n),c=a&&(a.sezioni||[]).find(l=>l.id===t);c&&(c[e]=i.trim(),b(o))}function Kt(n,t){if(!confirm("Eliminare questa sezione e tutti i suoi componenti?"))return;let{kits:e}=k(),i=e.find(o=>o.id===n);i&&(i.sezioni=(i.sezioni||[]).filter(o=>o.id!==t),b(e),I())}function Ut(n,t){let{kits:e}=k(),i=e.find(a=>a.id===n),o=i&&(i.sezioni||[]).find(a=>a.id===t);o&&(o.componenti=o.componenti||[],o.componenti.push({id:T(),nome:"Nuovo componente",qtaPerVariante:{},caricato:0}),b(e),I())}function Qt(n,t,e,i,o,a){let{kits:c}=k(),l=c.find(m=>m.id===n),d=l&&(l.sezioni||[]).find(m=>m.id===t),r=d&&(d.componenti||[]).find(m=>m.id===e);r&&(i==="coeff"?(r.qtaPerVariante=r.qtaPerVariante||{},r.qtaPerVariante[o]=Math.max(0,parseInt(a)||0)):r[i]=a.trim(),b(c))}function Ft(n,t,e){let{kits:i}=k(),o=i.find(c=>c.id===n),a=o&&(o.sezioni||[]).find(c=>c.id===t);a&&(a.componenti=(a.componenti||[]).filter(c=>c.id!==e),b(i),I())}function Gt(n){let{kits:t}=k(),e=t.find(i=>i.id===n);e&&(e.sottoAssembly=e.sottoAssembly||[],e.sottoAssembly.push({id:T(),nome:"",varianteKey:(e.varianti||[])[0]?.key||""}),b(t),I())}function Jt(n,t){let{kits:e}=k(),i=e.find(o=>o.id===n);i&&(i.sottoAssembly=i.sottoAssembly||[],i.sottoAssembly.push({id:T(),nome:"",varianteKey:t}),b(e),I())}function Yt(n,t,e,i){let{kits:o}=k(),a=o.find(c=>c.id===n);!a||!a.sottoAssembly[t]||(a.sottoAssembly[t][e]=i.trim(),b(o))}function Zt(n,t){let{kits:e}=k(),i=e.find(o=>o.id===n);i&&(i.sottoAssembly.splice(t,1),b(e),I())}function ei(){window._kitOpenView=vt,window._kitOpenConfig=ct,window._kitNuovoKit=Bt,window._kitBack=gt,window._kitSwitchTab=bt,window._kitAggiornaQty=yt,window._kitAggiornaCar=tt,window._kitAggiornaPronti=ht,window._kitSetPronti=_t,window._kitApriModalSped=St,window._kitChiudiModalSped=st,window._kitConfermaSpedizione=qt,window._kitApriModalReso=Et,window._kitChiudiModalReso=at,window._kitResoQtyChange=Mt,window._kitResoAggiornaBOM=G,window._kitConfermaReso=xt,window._kitSalvaMovimento=wt,window._kitEliminaMovimento=Ct,window._kitModificaMovimento=It,window._kitChiudiModalEditMov=et,window._kitConfermaModificaMov=At,window._kitChiudiModalDelMov=nt,window._kitConfermaEliminaMov=ot,window._kitSalvaManuale=Tt,window._kitElimina=Nt,window._kitCfgBack=Pt,window._kitCfgSwitchTab=Ot,window._kitCfgSaveNome=Lt,window._kitCfgAddVar=Dt,window._kitCfgUpdateVar=Rt,window._kitCfgDelVar=Vt,window._kitCfgAddSez=Ht,window._kitCfgUpdateSez=jt,window._kitCfgDelSez=Kt,window._kitCfgAddComp=Ut,window._kitCfgUpdateComp=Qt,window._kitCfgDelComp=Ft,window._kitCfgAddSA=Gt,window._kitCfgAddSAForVariant=Jt,window._kitCfgUpdateSA=Yt,window._kitCfgDelSA=Zt}var j,N,H,X,z,A,J,x,si,Wt=rt(()=>{lt();mt();ft();dt();j="_mlKitData",N="_mlKitDataTs",H=!1;X=null;z=null,A="bom";J=null,x="info";si=B});Wt();export{B as caricaKitProdotti,si as default,ei as registerGlobals,oi as resetKitFetch};
//# sourceMappingURL=chunk-kit-prodotti-ISI2Z47P.js.map
