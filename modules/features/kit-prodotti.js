// PROD — Features / Kit Prodotti
// Modulo configurabile multi-kit (sostituto di pipistrelli.js)
// Dipendenze: ../core/config.js, ../core/session.js, ../core/api.js, ../core/ui.js

import { URL_GOOGLE } from '../core/config.js';
import { utenteAttuale } from '../core/session.js';
import { gasRequest } from '../core/api.js';
import { notificaElegante, applicaFade, _esc } from '../core/ui.js';

// ─── LS keys ──────────────────────────────────────────────────────────────────
const _KIT_LS_KEY  = '_mlKitData';        // { kits: [...], ts: number }
const _KIT_LS_TS   = '_mlKitDataTs';      // timestamp locale
const _KIT_DRAFT_LS_KEY = '_mlKitOrderDrafts'; // bozze ordine locali, non sincronizzate
const _KIT_SCHEMA_VERSION = 2;

// ─── fetch flag ───────────────────────────────────────────────────────────────
let _fetched = false;

export function resetKitFetch() { _fetched = false; }

function _kitSanitizeKey(value, fallback) {
    const cleaned = String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_-]/g, '');
    return cleaned || fallback;
}

function _kitNormalizeOption(opt, fallbackIndex) {
    const fallbackKey = 'opz' + (fallbackIndex + 1);
    const key = _kitSanitizeKey(opt?.key, fallbackKey);
    return {
        id: String(opt?.id || _uid()),
        key,
        nome: String(opt?.nome || key).trim() || key
    };
}

function _kitNormalizeAsse(asse, fallbackIndex) {
    const fallbackKey = 'asse' + (fallbackIndex + 1);
    const key = _kitSanitizeKey(asse?.key, fallbackKey);
    const opzioni = Array.isArray(asse?.opzioni)
        ? asse.opzioni.map((opt, idx) => _kitNormalizeOption(opt, idx)).filter(Boolean)
        : [];
    return {
        id: String(asse?.id || _uid()),
        key,
        nome: String(asse?.nome || key).trim() || key,
        opzioni
    };
}

function _kitVariantKeyFromSelections(selezioni) {
    if (selezioni.length === 1) return selezioni[0].opzioneKey;
    return selezioni.map(function(sel) {
        return sel.asseKey + '=' + sel.opzioneKey;
    }).join('|');
}

function _kitVariantNameFromSelections(selezioni) {
    if (selezioni.length === 1) return selezioni[0].opzioneNome;
    return selezioni.map(function(sel) {
        return sel.asseNome + ': ' + sel.opzioneNome;
    }).join(' · ');
}

function _kitBuildVariantiFromAssi(assi) {
    if (!Array.isArray(assi) || !assi.length) return [];
    const assiValidi = assi.filter(asse => Array.isArray(asse.opzioni) && asse.opzioni.length);
    if (!assiValidi.length) return [];

    let combinazioni = [{ selections: [] }];
    for (const asse of assiValidi) {
        const next = [];
        for (const combo of combinazioni) {
            for (const opzione of asse.opzioni) {
                next.push({
                    selections: combo.selections.concat({
                        asseId: asse.id,
                        asseKey: asse.key,
                        asseNome: asse.nome,
                        opzioneId: opzione.id,
                        opzioneKey: opzione.key,
                        opzioneNome: opzione.nome
                    })
                });
            }
        }
        combinazioni = next;
    }

    return combinazioni.map(function(combo, index) {
        return {
            id: 'combo-' + (index + 1),
            key: _kitVariantKeyFromSelections(combo.selections),
            nome: _kitVariantNameFromSelections(combo.selections),
            selections: combo.selections
        };
    });
}

function _kitNormalizeComp(comp) {
    const modo = String(comp?.modoComponente || 'quantificato').trim() || 'quantificato';
    const tracciabile = modo === 'segnalazione' ? false : (comp?.tracciabile !== undefined ? !!comp.tracciabile : true);
    const defaultUnita = modo === 'segnalazione' ? 'flag' : 'pz';
    return {
        id: String(comp?.id || _uid()),
        nome: String(comp?.nome || 'Nuovo componente').trim() || 'Nuovo componente',
        qtaPerVariante: { ...(comp?.qtaPerVariante || {}) },
        caricato: Number(comp?.caricato || 0),
        modoComponente: modo,
        tracciabile,
        noteConfig: String(comp?.noteConfig || '').trim(),
        unitaMisura: String(comp?.unitaMisura || defaultUnita).trim() || 'pz',
        applicazioneTipo: String(comp?.applicazioneTipo || '').trim(),
        applicazioneAsseId: String(comp?.applicazioneAsseId || '').trim(),
        applicazioneOpzioneIds: Array.isArray(comp?.applicazioneOpzioneIds) ? comp.applicazioneOpzioneIds.map(String) : [],
        qtaBase: Math.max(0, Number.parseInt(comp?.qtaBase, 10) || 0)
    };
}

function _kitNormalizeSezione(sez) {
    return {
        id: String(sez?.id || _uid()),
        nome: String(sez?.nome || 'Nuova sezione').trim() || 'Nuova sezione',
        componenti: Array.isArray(sez?.componenti) ? sez.componenti.map(_kitNormalizeComp) : []
    };
}

function _kitSetEquals(left, right) {
    if (left.size !== right.size) return false;
    for (const item of left) if (!right.has(item)) return false;
    return true;
}

function _kitInferCompRule(comp, kit) {
    const baseRule = {
        tipo: 'sempre',
        asseId: '',
        opzioneIds: [],
        qtyBase: Math.max(0, Number.parseInt(comp?.qtaBase, 10) || 0)
    };

    if (comp?.applicazioneTipo === 'sempre' || comp?.applicazioneTipo === 'gruppo') {
        return {
            tipo: comp.applicazioneTipo,
            asseId: String(comp.applicazioneAsseId || ''),
            opzioneIds: Array.isArray(comp.applicazioneOpzioneIds) ? comp.applicazioneOpzioneIds.map(String) : [],
            qtyBase: baseRule.qtyBase || Math.max(0, Number.parseInt(Object.values(comp?.qtaPerVariante || {})[0], 10) || 0)
        };
    }

    const varianti = _kitGetVariantiEffettive(kit);
    if (!varianti.length) return baseRule;

    const positiveVarianti = varianti.filter(variante => _kitGetComponentQty(comp, variante.key) > 0);
    if (!positiveVarianti.length) return baseRule;

    const qtySet = new Set(positiveVarianti.map(variante => _kitGetComponentQty(comp, variante.key)));
    if (qtySet.size !== 1) {
        return {
            tipo: 'manuale',
            asseId: '',
            opzioneIds: [],
            qtyBase: Math.max(...positiveVarianti.map(variante => _kitGetComponentQty(comp, variante.key)))
        };
    }

    const qtyBase = [...qtySet][0];
    if (positiveVarianti.length === varianti.length) {
        return { tipo: 'sempre', asseId: '', opzioneIds: [], qtyBase };
    }

    const positiveKeys = new Set(positiveVarianti.map(variante => variante.key));
    for (const asse of (kit.assiConfigurazione || [])) {
        const selectedOptionIds = [];
        for (const opzione of (asse.opzioni || [])) {
            const optionKeys = new Set(varianti
                .filter(variante => (variante.selections || []).some(selection => selection.asseId === asse.id && selection.opzioneId === opzione.id))
                .map(variante => variante.key));
            if (!optionKeys.size) continue;
            const allPositive = [...optionKeys].every(key => _kitGetComponentQty(comp, key) === qtyBase);
            if (allPositive) selectedOptionIds.push(opzione.id);
        }

        if (!selectedOptionIds.length) continue;

        const coveredKeys = new Set(varianti
            .filter(variante => (variante.selections || []).some(selection => selection.asseId === asse.id && selectedOptionIds.includes(selection.opzioneId)))
            .map(variante => variante.key));

        if (_kitSetEquals(coveredKeys, positiveKeys)) {
            return { tipo: 'gruppo', asseId: asse.id, opzioneIds: selectedOptionIds, qtyBase };
        }
    }

    return { tipo: 'manuale', asseId: '', opzioneIds: [], qtyBase };
}

function _kitCompileCompQtyMap(comp, kit, rule) {
    if (!rule || rule.tipo === 'manuale') return { ...(comp?.qtaPerVariante || {}) };
    const qtyMap = {};
    const qtyBase = Math.max(0, Number.parseInt(rule.qtyBase, 10) || 0);
    if (!qtyBase) return qtyMap;

    for (const variante of _kitGetVariantiEffettive(kit)) {
        let include = rule.tipo === 'sempre';
        if (rule.tipo === 'gruppo') {
            include = (variante.selections || []).some(selection => selection.asseId === rule.asseId && rule.opzioneIds.includes(selection.opzioneId));
        }
        if (include) qtyMap[variante.key] = qtyBase;
    }
    return qtyMap;
}

function _kitNormalizeSezioneForKit(sez, kit) {
    const normalizedSezione = _kitNormalizeSezione(sez);
    normalizedSezione.componenti = normalizedSezione.componenti.map(function(comp) {
        const rule = _kitInferCompRule(comp, kit);
        return {
            ...comp,
            applicazioneTipo: rule.tipo,
            applicazioneAsseId: rule.asseId,
            applicazioneOpzioneIds: rule.opzioneIds,
            qtaBase: rule.qtyBase,
            qtaPerVariante: _kitCompileCompQtyMap(comp, kit, rule)
        };
    });
    return normalizedSezione;
}

function _kitGetUniformComponentQty(comp, kit) {
    const varianti = _kitGetVariantiEffettive(kit);
    if (!varianti.length) return null;
    let uniformQty = null;
    for (const variante of varianti) {
        const qty = _kitGetComponentQty(comp, variante.key);
        if (uniformQty === null) {
            uniformQty = qty;
            continue;
        }
        if (uniformQty !== qty) return null;
    }
    return uniformQty;
}

function _kitCloneComponentForKit(comp, sourceKit, targetKit) {
    const targetVarianti = _kitGetVariantiEffettive(targetKit);
    const qtaPerVariante = {};
    const uniformQty = _kitGetUniformComponentQty(comp, sourceKit);
    if (!targetVarianti.length) {
        Object.assign(qtaPerVariante, comp?.qtaPerVariante || {});
    } else {
        for (const variante of targetVarianti) {
            const hasExactQty = Object.prototype.hasOwnProperty.call(comp?.qtaPerVariante || {}, variante.key);
            const qty = hasExactQty
                ? _kitGetComponentQty(comp, variante.key)
                : (uniformQty !== null ? uniformQty : 0);
            if (qty > 0) qtaPerVariante[variante.key] = qty;
        }
    }
    return {
        id: _uid(),
        nome: String(comp?.nome || 'Nuovo componente').trim() || 'Nuovo componente',
        qtaPerVariante,
        caricato: 0,
        modoComponente: comp?.modoComponente === 'segnalazione' ? 'segnalazione' : 'quantificato',
        tracciabile: _kitIsTracciabile(comp),
        noteConfig: String(comp?.noteConfig || '').trim(),
        unitaMisura: String(comp?.unitaMisura || (_kitIsSegnalazione(comp) ? 'flag' : 'pz')).trim() || 'pz'
    };
}

function _kitCloneSezioneForKit(sezione, sourceKit, targetKit) {
    return {
        id: _uid(),
        nome: String(sezione?.nome || 'Nuova sezione').trim() || 'Nuova sezione',
        componenti: Array.isArray(sezione?.componenti)
            ? sezione.componenti.map(comp => _kitCloneComponentForKit(comp, sourceKit, targetKit))
            : []
    };
}

function _kitGetSectionById(kit, sectionId) {
    return (kit?.sezioni || []).find(sezione => sezione.id === sectionId) || null;
}

function _kitGetVariantAlignmentInfo(sourceKit, targetKit) {
    const sourceVariantKeys = new Set(_kitGetVariantiEffettive(sourceKit).map(v => v.key));
    const targetVarianti = _kitGetVariantiEffettive(targetKit);
    const exactMatches = targetVarianti.filter(v => sourceVariantKeys.has(v.key)).length;
    return {
        targetCount: targetVarianti.length,
        exactMatches,
        hasTargetVarianti: targetVarianti.length > 0,
        needsReview: targetVarianti.length === 0 || exactMatches < targetVarianti.length
    };
}

function _kitMatchesSearch(value, search) {
    const query = String(search || '').trim().toLowerCase();
    if (!query) return true;
    return String(value || '').toLowerCase().includes(query);
}

function _kitNormalizeSA(sa, fallbackKey) {
    return {
        id: String(sa?.id || _uid()),
        nome: String(sa?.nome || '').trim(),
        varianteKey: String(sa?.varianteKey || fallbackKey || '').trim(),
        noteConfig: String(sa?.noteConfig || '').trim()
    };
}

function _kitNormalizeKit(rawKit) {
    const kit = rawKit && typeof rawKit === 'object' ? rawKit : {};
    const legacyVarianti = Array.isArray(kit.varianti) ? kit.varianti.map(function(v, idx) {
        const fallbackKey = 'v' + (idx + 1);
        const key = _kitSanitizeKey(v?.key, fallbackKey);
        return {
            id: String(v?.id || _uid()),
            key,
            nome: String(v?.nome || key).trim() || key
        };
    }) : [];
    const assiConfigurazioneRaw = Array.isArray(kit.assiConfigurazione)
        ? kit.assiConfigurazione.map((asse, idx) => _kitNormalizeAsse(asse, idx))
        : [];
    const assiConfigurazione = assiConfigurazioneRaw.length
        ? assiConfigurazioneRaw
        : (legacyVarianti.length
            ? [{
                id: 'asse-legacy-' + String(kit.id || 'kit'),
                key: 'configurazione',
                nome: 'Configurazione',
                opzioni: legacyVarianti.map(function(v) {
                    return { id: v.id, key: v.key, nome: v.nome };
                })
            }]
            : []);
    const variantiGenerate = _kitBuildVariantiFromAssi(assiConfigurazione);
    const varianti = variantiGenerate.length ? variantiGenerate : legacyVarianti;
    const variantiKeys = new Set(varianti.map(v => v.key));
    const qtaDaProdurre = {};
    Object.entries(kit.qtaDaProdurre || {}).forEach(function(entry) {
        if (variantiKeys.has(entry[0])) qtaDaProdurre[entry[0]] = Math.max(0, Number.parseInt(entry[1], 10) || 0);
    });
    for (const v of varianti) {
        if (qtaDaProdurre[v.key] === undefined) qtaDaProdurre[v.key] = 0;
    }

    const sottoAssembly = Array.isArray(kit.sottoAssembly)
        ? kit.sottoAssembly
            .map(sa => _kitNormalizeSA(sa, varianti[0]?.key || ''))
            .filter(sa => !sa.varianteKey || variantiKeys.has(sa.varianteKey))
        : [];

    const pronti = {};
    Object.entries(kit.pronti || {}).forEach(function(entry) {
        pronti[entry[0]] = Math.max(0, Number.parseInt(entry[1], 10) || 0);
    });

    return {
        id: String(kit.id || _uid()),
        nome: String(kit.nome || 'Nuovo Kit').trim() || 'Nuovo Kit',
        schemaVersion: _KIT_SCHEMA_VERSION,
        assiConfigurazione,
        varianti,
        sezioni: Array.isArray(kit.sezioni) ? kit.sezioni.map(sezione => _kitNormalizeSezioneForKit(sezione, { assiConfigurazione, varianti })) : [],
        sottoAssembly,
        qtaDaProdurre,
        pronti,
        movimenti: Array.isArray(kit.movimenti) ? kit.movimenti.slice() : []
    };
}

function _kitGetVariantiEffettive(kit) {
    return Array.isArray(kit?.varianti) ? kit.varianti : [];
}

function _kitIsSegnalazione(comp) {
    return !!comp && comp.modoComponente === 'segnalazione';
}

function _kitIsTracciabile(comp) {
    return !!comp && comp.tracciabile !== false && !_kitIsSegnalazione(comp);
}

function _kitGetComponentQty(comp, vKey) {
    const rawQty = Number.parseInt(comp?.qtaPerVariante?.[vKey], 10) || 0;
    return _kitIsSegnalazione(comp) ? (rawQty > 0 ? 1 : 0) : rawQty;
}

function _kitGetCompRuleUi(comp, kit) {
    return _kitInferCompRule(comp, kit);
}

function _kitLoadOrderDrafts() {
    try {
        const raw = localStorage.getItem(_KIT_DRAFT_LS_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function _kitSaveOrderDrafts(drafts) {
    try {
        localStorage.setItem(_KIT_DRAFT_LS_KEY, JSON.stringify(drafts || {}));
    } catch {}
}

function _kitGetOrderDraft(kit) {
    const drafts = _kitLoadOrderDrafts();
    const rawDraft = drafts?.[kit?.id] && typeof drafts[kit.id] === 'object' ? drafts[kit.id] : {};
    const normalized = {};
    for (const variante of _kitGetVariantiEffettive(kit)) {
        const fallbackQty = rawDraft[variante.key];
        normalized[variante.key] = Math.max(0, Number.parseInt(fallbackQty, 10) || 0);
    }
    return normalized;
}

function _kitMutateOrderDraft(kitId, mutator) {
    const { kits } = _kitLoad();
    const kit = kits.find(entry => entry.id === kitId);
    if (!kit) return;
    const drafts = _kitLoadOrderDrafts();
    const currentDraft = _kitGetOrderDraft(kit);
    mutator(currentDraft, kit);

    const cleanedDraft = {};
    let hasValues = false;
    for (const variante of _kitGetVariantiEffettive(kit)) {
        const qty = Math.max(0, Number.parseInt(currentDraft[variante.key], 10) || 0);
        cleanedDraft[variante.key] = qty;
        if (qty > 0) hasValues = true;
    }

    if (hasValues) drafts[kitId] = cleanedDraft;
    else delete drafts[kitId];
    _kitSaveOrderDrafts(drafts);

    if (_kitViewId === kitId) _kitRenderView();
}

function _kitCountOrderPieces(orderDraft) {
    return Object.values(orderDraft || {}).reduce((sum, qty) => sum + (Number.parseInt(qty, 10) || 0), 0);
}

const _kitComposeState = {};

function _kitGetComposeState(kit) {
    const current = _kitComposeState[kit.id] && typeof _kitComposeState[kit.id] === 'object' ? _kitComposeState[kit.id] : {};
    const next = {};
    for (const asse of (kit.assiConfigurazione || [])) {
        const validOptionIds = new Set((asse.opzioni || []).map(opzione => opzione.id));
        next[asse.id] = validOptionIds.has(current[asse.id]) ? current[asse.id] : (asse.opzioni?.[0]?.id || '');
    }
    _kitComposeState[kit.id] = next;
    return next;
}

function _kitFindVariantFromComposeState(kit, composeState) {
    const assi = kit.assiConfigurazione || [];
    if (!assi.length) return _kitGetVariantiEffettive(kit)[0] || null;

    const selections = [];
    for (const asse of assi) {
        const optionId = composeState?.[asse.id];
        const opzione = (asse.opzioni || []).find(item => item.id === optionId);
        if (!opzione) return null;
        selections.push({
            asseId: asse.id,
            asseKey: asse.key,
            asseNome: asse.nome,
            opzioneId: opzione.id,
            opzioneKey: opzione.key,
            opzioneNome: opzione.nome
        });
    }

    const variantKey = _kitVariantKeyFromSelections(selections);
    return _kitGetVariantiEffettive(kit).find(variante => variante.key === variantKey) || null;
}

function _kitGetSelectionDistintaName(selection) {
    const asseNome = String(selection?.asseNome || '').trim();
    const opzioneNome = String(selection?.opzioneNome || '').trim();
    if (!asseNome) return opzioneNome;
    if (!opzioneNome) return asseNome;
    if (opzioneNome.toLowerCase().includes(asseNome.toLowerCase()) || /\s/.test(opzioneNome)) return opzioneNome;
    return `${asseNome} ${opzioneNome}`.trim();
}

function _kitSelectionCoveredByMaterial(kit, variante, selection) {
    const asseId = String(selection?.asseId || '');
    const opzioneId = String(selection?.opzioneId || '');
    if (!asseId || !opzioneId) return false;

    for (const sezione of (kit.sezioni || [])) {
        for (const comp of (sezione.componenti || [])) {
            if (_kitIsSegnalazione(comp)) continue;
            if (_kitGetComponentQty(comp, variante.key) <= 0) continue;
            if (comp.applicazioneTipo !== 'gruppo') continue;
            if (String(comp.applicazioneAsseId || '') !== asseId) continue;
            if (!(Array.isArray(comp.applicazioneOpzioneIds) && comp.applicazioneOpzioneIds.includes(opzioneId))) continue;
            return true;
        }
    }

    return false;
}

function _kitBuildSelectedOptionsRows(kit, selectedVarianti, orderDraft) {
    const rows = [];
    const rowsByKey = new Map();

    for (const variante of selectedVarianti) {
        const pezziOrdine = Number.parseInt(orderDraft?.[variante.key], 10) || 0;
        if (!pezziOrdine) continue;

        for (const selection of (variante.selections || [])) {
            if (_kitSelectionCoveredByMaterial(kit, variante, selection)) continue;

            const rowKey = `${selection.asseId || ''}::${selection.opzioneId || ''}`;
            const existingRow = rowsByKey.get(rowKey);
            if (existingRow) {
                existingRow.totale += pezziOrdine;
                continue;
            }

            const nextRow = {
                id: 'sel-' + rowKey,
                nome: _kitGetSelectionDistintaName(selection),
                totale: pezziOrdine,
                unita: 'pz',
                dettaglio: '',
                noteConfig: ''
            };
            rowsByKey.set(rowKey, nextRow);
            rows.push(nextRow);
        }
    }

    return rows;
}

function _kitBuildDistintaBase(kit, orderDraft) {
    const selectedVarianti = _kitGetVariantiEffettive(kit).filter(variante => (Number.parseInt(orderDraft?.[variante.key], 10) || 0) > 0);
    const sezioni = [];
    const avvisi = [];

    const selectedOptionsRows = _kitBuildSelectedOptionsRows(kit, selectedVarianti, orderDraft);
    if (selectedOptionsRows.length) {
        sezioni.push({ id: 'kit-distinta-elettronica', nome: 'ELETTRONICA', righe: selectedOptionsRows });
    }

    for (const sezione of (kit.sezioni || [])) {
        const righe = [];
        for (const comp of (sezione.componenti || [])) {
            let totalQty = 0;
            const activeVariants = [];

            for (const variante of selectedVarianti) {
                const pezziOrdine = Number.parseInt(orderDraft?.[variante.key], 10) || 0;
                const coeff = _kitGetComponentQty(comp, variante.key);
                if (!pezziOrdine || !coeff) continue;

                if (_kitIsSegnalazione(comp)) totalQty += pezziOrdine;
                else totalQty += pezziOrdine * coeff;

                activeVariants.push({
                    nome: variante.nome,
                    pezziOrdine,
                    coeff
                });
            }

            if (!activeVariants.length) continue;

            const variantiLabel = activeVariants.length === 1
                ? activeVariants[0].nome
                : activeVariants.length + ' configurazioni';

            if (_kitIsSegnalazione(comp)) {
                avvisi.push({
                    id: 'alert-' + comp.id,
                    tipo: 'alert',
                    nome: comp.nome,
                    dettaglio: comp.noteConfig || 'Requisito da verificare in fase di approvvigionamento.',
                    totaleCoinvolto: totalQty,
                    variantiLabel
                });
                continue;
            }

            righe.push({
                id: comp.id,
                nome: comp.nome,
                totale: totalQty,
                unita: comp.unitaMisura || 'pz',
                dettaglio: '',
                noteConfig: comp.noteConfig || ''
            });

            if (comp.noteConfig) {
                avvisi.push({
                    id: 'note-' + comp.id,
                    tipo: 'nota',
                    nome: comp.nome,
                    dettaglio: comp.noteConfig,
                    totaleCoinvolto: totalQty,
                    variantiLabel
                });
            }
        }

        if (righe.length) sezioni.push({ id: sezione.id, nome: sezione.nome, righe });
    }

    return {
        selectedVarianti,
        sezioni,
        avvisi,
        totalePezzi: _kitCountOrderPieces(orderDraft),
        totaleRighe: sezioni.reduce((sum, sezione) => sum + sezione.righe.length, 0)
    };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
function _kitLoad() {
    try {
        const raw = localStorage.getItem(_KIT_LS_KEY);
        if (!raw) return { kits: [] };
        const parsed = JSON.parse(raw);
        return {
            kits: Array.isArray(parsed?.kits) ? parsed.kits.map(_kitNormalizeKit) : []
        };
    } catch { return { kits: [] }; }
}

function _kitSave(kits) {
    const safeKits = Array.isArray(kits) ? kits.map(_kitNormalizeKit) : [];
    try {
        localStorage.setItem(_KIT_LS_KEY, JSON.stringify({ kits: safeKits }));
        localStorage.setItem(_KIT_LS_TS, Date.now());
    } catch {}
    _kitPushToServer(safeKits);
}

// ─── Sync server ──────────────────────────────────────────────────────────────
let _kitPushTimer = null;

function _kitPushToServer(kits) {
    clearTimeout(_kitPushTimer);
    _kitPushTimer = setTimeout(function () {
        gasRequest({ azione: 'setKitData', kits })
            .catch(function (e) { console.warn('[kit-prodotti] salvataggio remoto fallito:', e); });
    }, 1500);
}

function _kitFetchFromServer(cb) {
    fetch(URL_GOOGLE, { method: 'POST', body: JSON.stringify({ azione: 'getKitData' }) })
        .then(r => r.json())
        .then(d => {
            if (d && Array.isArray(d.kits)) {
                const serverTs = parseInt(d.ts || 0);
                const localTs  = parseInt(localStorage.getItem(_KIT_LS_TS) || 0);
                if (serverTs > 0 && serverTs > localTs) {
                    try { localStorage.setItem(_KIT_LS_KEY, JSON.stringify({ kits: d.kits })); } catch {}
                    try { localStorage.setItem(_KIT_LS_TS, serverTs); } catch {}
                    if (cb) cb(true);
                    return;
                }
            }
            if (cb) cb(false);
        })
        .catch(() => { if (cb) cb(false); });
}

// ─── UUID helper ──────────────────────────────────────────────────────────────
function _uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Permessi ─────────────────────────────────────────────────────────────────
function _kitCanEdit() {
    if (!utenteAttuale || !utenteAttuale.nome) return false;
    const n = String(utenteAttuale.nome).toUpperCase().trim();
    return n === 'ALESSIO' || n === '0000' || utenteAttuale.ruolo === 'MASTER';
}

// ═════════════════════════════════════════════════════════════════════════════
// CALCOLI
// ═════════════════════════════════════════════════════════════════════════════

/** Calcola il fabbisogno totale per componente, sommando qty*coeff di ogni variante */
function _kitCalcFabbisogno(kit) {
    const fab = {};
    for (const sez of (kit.sezioni || [])) {
        for (const comp of (sez.componenti || [])) {
            if (_kitIsSegnalazione(comp)) {
                fab[comp.id] = 0;
                continue;
            }
            let tot = 0;
            for (const [vKey, qty] of Object.entries(kit.qtaDaProdurre || {})) {
                tot += (Number.parseInt(qty, 10) || 0) * _kitGetComponentQty(comp, vKey);
            }
            fab[comp.id] = tot;
        }
    }
    return fab;
}

/** Calcola i componenti impegnati dai sub-assembly pronti */
function _kitCalcImpegnati(kit) {
    const imp = {};
    for (const sa of (kit.sottoAssembly || [])) {
        const pronti = Number.parseInt(kit.pronti?.[sa.id], 10) || 0;
        if (!pronti) continue;
        const vKey = sa.varianteKey;
        for (const sez of (kit.sezioni || [])) {
            for (const comp of (sez.componenti || [])) {
                if (_kitIsSegnalazione(comp)) continue;
                const coeff = _kitGetComponentQty(comp, vKey);
                if (coeff > 0) imp[comp.id] = (imp[comp.id] || 0) + pronti * coeff;
            }
        }
    }
    return imp;
}

/** Calcola quanti sub-assembly completabili per variante */
function _kitCalcSpedizionabili(kit) {
    const result = {};
    for (const sa of (kit.sottoAssembly || [])) {
        const vKey = sa.varianteKey;
        let minU = Infinity;
        let hasComp = false;
        const imp = _kitCalcImpegnati(kit);
        for (const sez of (kit.sezioni || [])) {
            for (const comp of (sez.componenti || [])) {
                if (_kitIsSegnalazione(comp)) continue;
                const coeff = _kitGetComponentQty(comp, vKey);
                if (!coeff) continue;
                hasComp = true;
                const libero = Math.max(0, (Number.parseInt(comp.caricato, 10) || 0) - (imp[comp.id] || 0));
                minU = Math.min(minU, Math.floor(libero / coeff));
            }
        }
        if (!hasComp || minU === Infinity) result[sa.id] = 0;
        else result[sa.id] = minU;
    }
    return result;
}

// ═════════════════════════════════════════════════════════════════════════════
// RENDER HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function _kitVarianteLabel(kit, vKey) {
    const v = _kitGetVariantiEffettive(kit).find(x => x.key === vKey);
    return v ? _esc(v.nome) : _esc(vKey);
}

function _ts() {
    return new Date().toLocaleString('it-IT', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGINA PRINCIPALE: griglia kit
// ═════════════════════════════════════════════════════════════════════════════

export function caricaKitProdotti() {
    if (!_fetched) {
        _fetched = true;
        _kitFetchFromServer(function (hasDati) {
            if (hasDati) caricaKitProdotti();
        });
    }

    const { kits } = _kitLoad();
    const contenitore = document.getElementById('contenitore-dati');

    const cardsHtml = kits.map(kit => {
        const variantiEffettive = _kitGetVariantiEffettive(kit);
        const nVarianti = variantiEffettive.length;
        const nAssi     = (kit.assiConfigurazione || []).length;
        const nComp    = (kit.sezioni || []).reduce((s, z) => s + (z.componenti || []).length, 0);
        return `
        <div class="kit-card" onclick="_kitOpenView('${_esc(kit.id)}')">
            <div class="kit-card-header">
                <span class="kit-card-nome">${_esc(kit.nome)}</span>
                <button class="kit-card-gear" onclick="event.stopPropagation();_kitOpenConfig('${_esc(kit.id)}')" title="Configura kit"><i class="fas fa-gear"></i></button>
            </div>
            <div class="kit-card-meta">
                <span class="kit-meta-pill"><i class="fas fa-sliders"></i> ${nAssi} ass${nAssi===1?'e':'i'}</span>
                <span class="kit-meta-pill"><i class="fas fa-layer-group"></i> ${nVarianti} configuraz.${nVarianti===1?'ione':'ioni'}</span>
                <span class="kit-meta-pill"><i class="fas fa-list"></i> ${nComp} voci BOM</span>
            </div>
        </div>`;
    }).join('');

    contenitore.innerHTML = `
    <div class="kit-page">
        <div class="kit-page-header">
            <div class="kit-page-title"><i class="fas fa-boxes-stacked"></i> Kit Prodotti</div>
            <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>
        </div>
        ${kits.length === 0
            ? `<div class="kit-empty-state">
                <i class="fas fa-box-open kit-empty-icon"></i>
                <p>Nessun kit configurato.</p>
                <button class="kit-nuovo-btn" onclick="_kitNuovoKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
               </div>`
            : `<div class="kit-grid">${cardsHtml}</div>`
        }
    </div>`;

    applicaFade(contenitore);
}

// ═════════════════════════════════════════════════════════════════════════════
// VISTA OPERATIVA DI UN KIT (4 tab: BOM / Pronti / Movimenti / Spedizione)
// ═════════════════════════════════════════════════════════════════════════════

let _kitViewId   = null;
let _kitViewTab  = 'ordine';

function _kitOpenView(id) {
    _kitViewId  = id;
    _kitViewTab = 'ordine';
    _kitRenderView();
}

function _kitRenderView() {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitViewId);
    if (!kit) { caricaKitProdotti(); return; }

    const contenitore = document.getElementById('contenitore-dati');
    const varsList = _kitGetVariantiEffettive(kit);
    const orderDraft = _kitGetOrderDraft(kit);
    const distinta = _kitBuildDistintaBase(kit, orderDraft);

    const ordineBadgesHtml = distinta.selectedVarianti.length
        ? distinta.selectedVarianti.map(variante => `<span class="kit-meta-pill"><strong>${orderDraft[variante.key] || 0}</strong> × ${_esc(variante.nome)}</span>`).join('')
        : '<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>';

    const composeState = _kitGetComposeState(kit);
    const composedVariant = _kitFindVariantFromComposeState(kit, composeState);
    const composeGroupsHtml = (kit.assiConfigurazione || []).length
        ? (kit.assiConfigurazione || []).map(asse => `
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${_esc(asse.nome)}</div>
                <div class="kit-compose-options">${(asse.opzioni || []).map(opzione => `
                    <button class="kit-compose-option ${composeState[asse.id] === opzione.id ? 'kit-compose-option--active' : ''}"
                            onclick="_kitComposeSelect('${_esc(kit.id)}','${_esc(asse.id)}','${_esc(opzione.id)}')">
                        ${_esc(opzione.nome)}
                    </button>`).join('')}</div>
            </div>`).join('')
        : `<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>`;

    const orderLinesHtml = distinta.selectedVarianti.length
        ? distinta.selectedVarianti.map(variante => {
            const qty = Number.parseInt(orderDraft[variante.key], 10) || 0;
            return `<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${_esc(variante.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(variante.selections) && variante.selections.length ? variante.selections.map(selection => _esc(selection.opzioneNome)).join(' · ') : _esc(variante.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${_esc(kit.id)}','${_esc(variante.key)}',-1)">−</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${qty}"
                           onchange="_kitOrdineSet('${_esc(kit.id)}','${_esc(variante.key)}',this.value)"
                           oninput="_kitOrdineSet('${_esc(kit.id)}','${_esc(variante.key)}',this.value)">
                    <button class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${_esc(kit.id)}','${_esc(variante.key)}',1)">+</button>
                    <button class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${_esc(kit.id)}','${_esc(variante.key)}')"><i class="fas fa-times"></i></button>
                </div>
            </div>`;
        }).join('')
        : `<div class="kit-empty-state" style="padding:26px 20px"><p>Nessuna configurazione aggiunta all'ordine.</p></div>`;

    const distintaHtml = distinta.totalePezzi
        ? distinta.sezioni.map(sezione => `
            <div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${_esc(sezione.nome)}</div>
                ${sezione.righe.map(riga => `
                    <div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${_esc(riga.nome)}</div>
                            ${riga.dettaglio ? `<div class="kit-distinta-row-meta">${_esc(riga.dettaglio)}</div>` : ''}
                            ${riga.noteConfig ? `<div class="kit-distinta-row-note">${_esc(riga.noteConfig)}</div>` : ''}
                        </div>
                        <div class="kit-distinta-row-qty">${riga.totale} ${_esc(riga.unita)}</div>
                    </div>`).join('')}
            </div>`).join('')
        : `<div class="kit-empty-state" style="padding:34px 20px">
            <i class="fas fa-file-circle-plus" style="font-size:1.8rem;color:#cbd5e1;margin-bottom:10px"></i>
            <p>Seleziona le configurazioni ordinate per generare la distinta base.</p>
        </div>`;

    const avvisiHtml = distinta.avvisi.length
        ? distinta.avvisi.map(avviso => `
            <div class="kit-distinta-alert ${avviso.tipo === 'alert' ? 'kit-distinta-alert--warning' : ''}">
                <div class="kit-distinta-alert-title">${_esc(avviso.nome)}</div>
                <div class="kit-distinta-alert-body">${_esc(avviso.dettaglio)}</div>
                <div class="kit-distinta-alert-meta">Coinvolto su ${avviso.totaleCoinvolto} pz · ${_esc(avviso.variantiLabel)}</div>
            </div>`).join('')
        : '<div class="kit-cfg-help">Nessun avviso particolare per l’ordine attuale.</div>';

    contenitore.innerHTML = `
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${_esc(kit.nome)}</span>
            <button class="kit-gear-btn-inline" onclick="_kitOpenConfig('${_esc(kit.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Ordine in composizione</div>
                    <div class="kit-order-summary-total">${distinta.totalePezzi} pezzi</div>
                </div>
                <button class="kit-btn-secondary" onclick="_kitOrdineReset('${_esc(kit.id)}')"><i class="fas fa-rotate-left"></i> Azzera ordine</button>
            </div>
            <div class="kit-order-summary-note">Questa bozza ordine resta locale sul dispositivo e serve solo per generare la distinta base di approvvigionamento.</div>
            <div class="kit-order-summary-badges">${ordineBadgesHtml}</div>
        </div>

        <div class="kit-order-layout">
            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-hand-pointer"></i> Componi ordine</div>
                <div class="kit-cfg-help">Scegli i pulsanti dell'elettronica, inserisci la quantità e aggiungi quella configurazione all'ordine.</div>
                <div class="kit-compose-builder">
                    ${composeGroupsHtml}
                    <div class="kit-compose-footer">
                        <div class="kit-compose-selected">
                            <div class="kit-compose-selected-label">Configurazione pronta</div>
                            <div class="kit-compose-selected-name">${composedVariant ? _esc(composedVariant.nome) : 'Completa prima tutte le scelte'}</div>
                        </div>
                        <div class="kit-order-stepper">
                            <input class="kit-order-stepper-input" id="kit-compose-qty-${_esc(kit.id)}" type="number" min="1" value="1">
                            <button class="kit-spedisci-btn" onclick="_kitComposeAdd('${_esc(kit.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
                        </div>
                    </div>
                </div>
                <div class="kit-order-lines">${orderLinesHtml}</div>
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-list-check"></i> Distinta base generata</div>
                <div class="kit-order-distinta-meta">${distinta.totaleRighe} righe materiali · ${distinta.avvisi.length} avvisi</div>
                ${distintaHtml}
            </section>

            <section class="kit-order-section">
                <div class="kit-order-section-title"><i class="fas fa-triangle-exclamation"></i> Attenzioni operative</div>
                ${avvisiHtml}
            </section>
        </div>
    </div>`;

    applicaFade(contenitore);
}

function _kitBack() {
    _kitViewId  = null;
    caricaKitProdotti();
}

function _kitSwitchTab(tab) {
    _kitViewTab = tab;
    _kitRenderView();
}

// ─── Aggiorna quantità da produrre ───────────────────────────────────────────
function _kitAggiornaQty(kitId) {
    _kitMutateOrderDraft(kitId, function(orderDraft, kit) {
        for (const variante of _kitGetVariantiEffettive(kit)) {
            const inp = document.getElementById('kit-qty-' + variante.key);
            if (inp) orderDraft[variante.key] = Math.max(0, Number.parseInt(inp.value, 10) || 0);
        }
    });
}

function _kitOrdineSet(kitId, vKey, value) {
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        orderDraft[vKey] = Math.max(0, Number.parseInt(value, 10) || 0);
    });
}

function _kitOrdineDelta(kitId, vKey, delta) {
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        const currentQty = Math.max(0, Number.parseInt(orderDraft[vKey], 10) || 0);
        orderDraft[vKey] = Math.max(0, currentQty + delta);
    });
}

function _kitOrdineReset(kitId) {
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        for (const key of Object.keys(orderDraft)) orderDraft[key] = 0;
    });
}

function _kitOrdineResetVoce(kitId, vKey) {
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        orderDraft[vKey] = 0;
    });
}

function _kitComposeSelect(kitId, asseId, opzioneId) {
    const { kits } = _kitLoad();
    const kit = kits.find(entry => entry.id === kitId);
    if (!kit) return;
    const nextState = _kitGetComposeState(kit);
    nextState[asseId] = opzioneId;
    _kitComposeState[kitId] = nextState;
    if (_kitViewId === kitId) _kitRenderView();
}

function _kitComposeAdd(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(entry => entry.id === kitId);
    if (!kit) return;

    const variant = _kitFindVariantFromComposeState(kit, _kitGetComposeState(kit));
    if (!variant) {
        notificaElegante('Completa prima le scelte elettroniche ⚠️');
        return;
    }

    const qty = Math.max(0, Number.parseInt(document.getElementById('kit-compose-qty-' + kitId)?.value, 10) || 0);
    if (!qty) {
        notificaElegante('Inserisci una quantità valida ⚠️');
        return;
    }

    _kitMutateOrderDraft(kitId, function(orderDraft) {
        orderDraft[variant.key] = (Number.parseInt(orderDraft[variant.key], 10) || 0) + qty;
    });

    const qtyInput = document.getElementById('kit-compose-qty-' + kitId);
    if (qtyInput) qtyInput.value = 1;
}

function _kitRefreshBomTotals(kit) {
    const fab = _kitCalcFabbisogno(kit);
    const tbody = document.getElementById('kit-tbody-' + kit.id);
    if (!tbody) return;
    for (const tr of tbody.querySelectorAll('tr[data-cid]')) {
        const cid  = tr.dataset.cid;
        const sid  = tr.dataset.sid;
        const sez  = (kit.sezioni||[]).find(s => s.id === sid);
        const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
        if (!comp) continue;
        if (_kitIsSegnalazione(comp)) continue;
        const fabI = fab[cid] || 0;
        const car  = Number.parseInt(comp.caricato, 10) || 0;
        const ord  = Math.max(0, fabI - car);

        const fabTd = tr.querySelector('.kit-fab, .kit-fab-zero');
        if (fabTd) { fabTd.textContent = fabI > 0 ? fabI : '—'; fabTd.className = fabI===0?'kit-fab kit-fab-zero':'kit-fab'; }
        const ordTd = tr.querySelector('.kit-ord-zero,.kit-ord-manca,.kit-ord-ok');
        if (ordTd) { ordTd.textContent = fabI===0?'—':ord; ordTd.className = fabI===0?'kit-ord-zero':(ord>0?'kit-ord-manca':'kit-ord-ok'); }
    }
}

// ─── Aggiorna caricato ────────────────────────────────────────────────────────
function _kitAggiornaCar(input) {
    const cid = input.dataset.cid;
    const sid = input.dataset.sid;
    const car = Math.max(0, Number.parseInt(input.value, 10) || 0);
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitViewId);
    if (!kit) return;
    const sez  = (kit.sezioni||[]).find(s => s.id === sid);
    const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
    if (!comp || !_kitIsTracciabile(comp)) return;
    comp.caricato = car;
    _kitSave(kits);

    const fab = _kitCalcFabbisogno(kit);
    const fabI = fab[cid] || 0;
    const ord  = Math.max(0, fabI - car);
    const imp  = _kitCalcImpegnati(kit);
    const impI = imp[cid] || 0;

    const tr   = input.closest('tr');
    if (!tr) return;
    const ordTd = tr.querySelector('.kit-ord-zero,.kit-ord-manca,.kit-ord-ok');
    if (ordTd) { ordTd.textContent = fabI===0?'—':ord; ordTd.className = fabI===0?'kit-ord-zero':(ord>0?'kit-ord-manca':'kit-ord-ok'); }
    const span = tr.querySelector('.kit-car-liberi');
    if (span) {
        if (impI>0) { span.textContent = Math.max(0,car-impI)+' lib.'; span.style.display=''; }
        else span.style.display='none';
    }
}

// ─── Pronti ───────────────────────────────────────────────────────────────────
function _kitAggiornaPronti(kitId, saId, delta) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    if (!kit.pronti) kit.pronti = {};
    kit.pronti[saId] = Math.max(0, (Number.parseInt(kit.pronti[saId], 10) || 0) + delta);
    _kitSave(kits);
    if (_kitViewId === kitId) _kitRenderView();
}

function _kitSetPronti(kitId, saId, val) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    if (!kit.pronti) kit.pronti = {};
    kit.pronti[saId] = Math.max(0, Number.parseInt(val, 10) || 0);
    _kitSave(kits);
    const inp = document.querySelector(`.kit-pronti-input[data-said="${saId}"]`);
    if (inp) { inp.value = kit.pronti[saId]; inp.classList.toggle('kit-pronti-val-on', kit.pronti[saId] > 0); }
}

// ─── Movimenti ────────────────────────────────────────────────────────────────
function _kitRenderMovimentiHtml(kit, canEdit) {
    const movimenti = kit.movimenti || [];
    if (!movimenti.length) return '<div class="kit-mov-empty">Nessun movimento registrato.</div>';
    return movimenti.map(m => {
        const delBtn = canEdit
            ? `<button class="kit-mov-del" onclick="_kitEliminaMovimento('${_esc(kit.id)}',${m.id})" title="Elimina">✕</button>`
            : '<span style="width:22px;flex-shrink:0"></span>';
        const editBtn = (canEdit && (m.tipo==='carico'||m.tipo==='scarico'))
            ? `<button class="kit-mov-edit" onclick="_kitModificaMovimento('${_esc(kit.id)}',${m.id})" title="Modifica">✎</button>`
            : '<span style="width:22px;flex-shrink:0"></span>';

        if (m.tipo === 'spedizione') {
            const totPz = (m.righe||[]).reduce((s,r)=>s+r.qty,0);
            const righeHtml = (m.righe||[]).map(r=>
                `<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8">${_esc(r.mat)}</span><span class="kit-mov-qty scarico">−${r.qty}</span></div>`
            ).join('');
            const itemsHtml = (m.items||[]).map(it=>
                `<div class="kit-assemb-sub-row kit-sped-item-row"><span class="kit-assemb-sub-mat">${_esc(it.nome)}</span><span class="kit-mov-qty scarico">×${it.qty}</span></div>`
            ).join('');
            return `<details class="kit-mov-assemb-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge spedizione">SPED.</span>
                <span class="kit-mov-assemb-label">🚚 Spediz. ×${totPz} pz</span>
                ${m.nota?`<span class="kit-mov-nota">${_esc(m.nota)}</span>`:''}
                <span class="kit-mov-ts">${m.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${delBtn}
              </summary>
              <div class="kit-assemb-sub-list">${itemsHtml}<div class="kit-sped-bom-divider">componenti scaricati</div>${righeHtml}</div>
            </details>`;
        }

        if (m.tipo === 'reso') {
            const totPz = m.totPz || 0;
            const itemsHtml = (m.items||[]).map(it=>
                `<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat">${_esc(it.nome)}</span><span class="kit-mov-qty carico">×${it.qty}</span></div>`
            ).join('');
            const recHtml = (m.righe||[]).map(r=>
                `<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#15803d">✓ ${_esc(r.mat)}</span><span class="kit-mov-qty carico">+${r.qty}</span></div>`
            ).join('');
            const scartHtml = (m.scartate||[]).map(r=>
                `<div class="kit-assemb-sub-row"><span class="kit-assemb-sub-mat" style="color:#94a3b8;text-decoration:line-through">${_esc(r.mat)}</span><span class="kit-mov-qty" style="color:#94a3b8">✕ ${r.qty}</span></div>`
            ).join('');
            return `<details class="kit-mov-assemb-group kit-mov-reso-group">
              <summary class="kit-mov-assemb-summary">
                <span class="kit-mov-badge reso">RESO</span>
                <span class="kit-mov-assemb-label">📦 Rientro ×${totPz} pz</span>
                ${m.nota?`<span class="kit-mov-nota">${_esc(m.nota)}</span>`:''}
                <span class="kit-mov-ts">${m.ts}</span>
                <i class="fas fa-chevron-down kit-assemb-chev"></i>
                ${delBtn}
              </summary>
              <div class="kit-assemb-sub-list">
                ${itemsHtml}
                ${recHtml?`<div class="kit-sped-bom-divider" style="color:#15803d">componenti recuperati</div>${recHtml}`:''}
                ${scartHtml?`<div class="kit-sped-bom-divider" style="color:#ef4444">componenti scartati</div>${scartHtml}`:''}
              </div>
            </details>`;
        }

        return `<div class="kit-mov-item ${_esc(m.tipo)}">
            <span class="kit-mov-badge ${_esc(m.tipo)}">${m.tipo==='carico'?'CARICO':'SCARICO'}</span>
            <span class="kit-mov-mat">${_esc(m.mat)}</span>
            <span class="kit-mov-qty ${_esc(m.tipo)}">${m.tipo==='carico'?'+':'−'}${m.qty}</span>
            ${m.nota?`<span class="kit-mov-nota">${_esc(m.nota)}</span>`:'<span class="kit-mov-nota"></span>'}
            <span class="kit-mov-ts">${m.ts}</span>
            ${editBtn}${delBtn}
        </div>`;
    }).join('');
}

function _kitSalvaMovimento(kitId, tipo) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const matSel  = document.getElementById('kit-mov-mat-' + kitId);
    const qtyEl   = document.getElementById('kit-mov-qty-' + kitId);
    const notaEl  = document.getElementById('kit-mov-nota-' + kitId);
    if (!matSel || !qtyEl) return;

    const cid  = matSel.value;
    const sid  = matSel.options[matSel.selectedIndex]?.dataset.sid;
    const qty  = Math.max(1, Number.parseInt(qtyEl.value, 10) || 1);
    const nota = (notaEl?.value || '').trim();

    const sez  = (kit.sezioni||[]).find(s => s.id === sid);
    const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
    if (!comp || !_kitIsTracciabile(comp)) return;

    if (tipo === 'carico') comp.caricato = (parseInt(comp.caricato)||0) + qty;
    else comp.caricato = Math.max(0, (parseInt(comp.caricato)||0) - qty);

    if (!kit.movimenti) kit.movimenti = [];
    kit.movimenti.unshift({
        id: Date.now(), cid, sid, tipo, qty, nota,
        mat: comp.nome,
        ts: _ts()
    });

    _kitSave(kits);
    if (qtyEl) qtyEl.value = 1;
    if (notaEl) notaEl.value = '';

    const listEl = document.getElementById('kit-mov-list-' + kitId);
    if (listEl) listEl.innerHTML = _kitRenderMovimentiHtml(kit, _kitCanEdit());

    // aggiorna riga BOM se visibile
    const inp = document.querySelector(`#kit-tbody-${kitId} input[data-cid="${cid}"]`);
    if (inp) { inp.value = comp.caricato; _kitAggiornaCar(inp); }
}

function _kitEliminaMovimento(kitId, id) {
    if (!_kitCanEdit()) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const mov = (kit.movimenti||[]).find(m => m.id === id);
    if (!mov) return;
    _kitApriModalDelMov(kitId, id, mov);
}

function _kitApriModalDelMov(kitId, id, mov) {
    const modal = document.getElementById('modal-kit-del-mov');
    if (!modal) return;
    const descEl = document.getElementById('kit-del-mov-desc');
    let descHtml;
    if (mov.tipo === 'spedizione') {
        const totPz = (mov.righe||[]).reduce((s,r)=>s+r.qty,0);
        descHtml = `<span class="kit-mov-badge spedizione" style="font-size:.75rem">SPED.</span> <strong>Spedizione ×${totPz} pz</strong>`;
    } else if (mov.tipo === 'reso') {
        descHtml = `<span class="kit-mov-badge reso" style="font-size:.75rem">RESO</span> <strong>Rientro ×${mov.totPz||0} pz</strong>`;
    } else {
        const tipo = mov.tipo==='carico'?'CARICO':'SCARICO';
        descHtml = `<span class="kit-mov-badge ${_esc(mov.tipo)}" style="font-size:.75rem">${tipo}</span> <strong>${_esc(mov.mat)}</strong> ${mov.tipo==='carico'?'+':'−'}${mov.qty} pz`;
    }
    if (descEl) descEl.innerHTML = descHtml;
    const btn = document.getElementById('btn-kit-del-ok');
    if (btn) btn.onclick = () => _kitConfermaEliminaMov(kitId, id);
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _kitChiudiModalDelMov() {
    const modal = document.getElementById('modal-kit-del-mov');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display='none'; }, 300);
}

function _kitConfermaEliminaMov(kitId, id) {
    _kitChiudiModalDelMov();
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const mov = (kit.movimenti||[]).find(m => m.id === id);
    if (!mov) return;

    if (mov.tipo === 'spedizione') {
        // ripristina caricato e pronti
        const sez  = (kit.sezioni||[]).find(s => s.id === mov.sid);
        for (const r of (mov.righe||[])) {
            for (const sz of (kit.sezioni||[])) {
                const c = (sz.componenti||[]).find(x=>x.id===r.cid||x.nome===r.mat);
                if (c) c.caricato = (parseInt(c.caricato)||0) + r.qty;
            }
        }
        // ripristina pronti sa
        for (const it of (mov.items||[])) {
            if (it.saId && kit.pronti) kit.pronti[it.saId] = (parseInt(kit.pronti[it.saId])||0) + it.qty;
        }
    } else if (mov.tipo === 'reso') {
        for (const r of (mov.righe||[])) {
            for (const sz of (kit.sezioni||[])) {
                const c = (sz.componenti||[]).find(x=>x.id===r.cid||x.nome===r.mat);
                if (c) c.caricato = Math.max(0,(parseInt(c.caricato)||0) - r.qty);
            }
        }
    } else if (mov.tipo === 'carico') {
        for (const sz of (kit.sezioni||[])) {
            const c = (sz.componenti||[]).find(x=>x.id===mov.cid);
            if (c) c.caricato = Math.max(0,(parseInt(c.caricato)||0) - mov.qty);
        }
    } else if (mov.tipo === 'scarico') {
        for (const sz of (kit.sezioni||[])) {
            const c = (sz.componenti||[]).find(x=>x.id===mov.cid);
            if (c) c.caricato = (parseInt(c.caricato)||0) + mov.qty;
        }
    }

    kit.movimenti = (kit.movimenti||[]).filter(m => m.id !== id);
    _kitSave(kits);
    if (_kitViewId === kitId) _kitRenderView();
    notificaElegante('Movimento eliminato ✓');
}

function _kitModificaMovimento(kitId, id) {
    if (!_kitCanEdit()) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const mov = (kit.movimenti||[]).find(m => m.id === id);
    if (!mov) return;
    const modal  = document.getElementById('modal-kit-edit-mov');
    if (!modal) return;
    const matEl  = document.getElementById('kit-edit-mov-mat');
    const qtyEl  = document.getElementById('kit-edit-mov-qty');
    const notaEl = document.getElementById('kit-edit-mov-nota');
    if (matEl)  matEl.innerHTML  = `<span class="kit-mov-badge ${_esc(mov.tipo)}" style="font-size:.75rem">${mov.tipo==='carico'?'CARICO':'SCARICO'}</span> <strong>${_esc(mov.mat)}</strong>`;
    if (qtyEl)  qtyEl.value  = mov.qty;
    if (notaEl) notaEl.value = mov.nota||'';
    modal.dataset.kitId = kitId;
    modal.dataset.movId = id;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    setTimeout(() => notaEl && notaEl.focus(), 80);
}

function _kitChiudiModalEditMov() {
    const modal = document.getElementById('modal-kit-edit-mov');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display='none'; }, 300);
}

function _kitConfermaModificaMov() {
    const modal = document.getElementById('modal-kit-edit-mov');
    if (!modal) return;
    const kitId = modal.dataset.kitId;
    const id    = Number(modal.dataset.movId);
    _kitChiudiModalEditMov();

    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const idx = (kit.movimenti||[]).findIndex(m => m.id === id);
    if (idx === -1) return;
    const mov = kit.movimenti[idx];

    const newQty  = parseInt(document.getElementById('kit-edit-mov-qty')?.value);
    const newNota = (document.getElementById('kit-edit-mov-nota')?.value||'').trim();
    if (isNaN(newQty)||newQty<=0) { notificaElegante('Quantità non valida ⚠️'); return; }

    if (newQty !== mov.qty) {
        const diff = newQty - mov.qty;
        for (const sz of (kit.sezioni||[])) {
            const c = (sz.componenti||[]).find(x=>x.id===mov.cid);
            if (c) {
                if (mov.tipo==='carico')  c.caricato = Math.max(0,(parseInt(c.caricato)||0)+diff);
                else                      c.caricato = Math.max(0,(parseInt(c.caricato)||0)-diff);
                break;
            }
        }
    }
    kit.movimenti[idx] = { ...mov, qty: newQty, nota: newNota };
    _kitSave(kits);
    if (_kitViewId === kitId) _kitRenderView();
    notificaElegante('Movimento aggiornato ✓');
}

// ─── Modal spedizione ─────────────────────────────────────────────────────────
function _kitApriModalSped(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const hasPronti = (kit.sottoAssembly||[]).some(sa => (Number.parseInt(kit.pronti?.[sa.id], 10)||0) > 0);
    if (!hasPronti) { notificaElegante('Nessuna parte tracciabile pronta — imposta le quantità prima ⚠️'); return; }

    const modal = document.getElementById('modal-kit-sped');
    if (!modal) return;

    const listEl = document.getElementById('kit-sped-items-list');
    if (listEl) {
        listEl.innerHTML = (kit.sottoAssembly||[])
            .filter(sa => (Number.parseInt(kit.pronti?.[sa.id], 10) || 0) > 0)
            .map(sa => {
                const qty = Number.parseInt(kit.pronti?.[sa.id], 10)||0;
                const vLabel = _kitVarianteLabel(kit, sa.varianteKey);
                return `<label class="kit-sped-item-row">
                    <input type="checkbox" class="kit-sped-chk" data-said="${_esc(sa.id)}" checked>
                    <span class="kit-sped-item-info">
                        <span class="kit-sped-item-label">${_esc(sa.nome)} <span class="kit-sped-var-pill">${vLabel}</span></span>
                        <span class="kit-sped-item-qty">×${qty}</span>
                    </span>
                </label>`;
            }).join('');
    }

    const notaEl = document.getElementById('kit-sped-nota-' + kitId);
    const notaModalEl = document.getElementById('kit-sped-modal-nota');
    if (notaModalEl && notaEl) notaModalEl.value = notaEl.value || '';
    if (notaModalEl && !notaEl) notaModalEl.value = '';

    modal.dataset.kitId = kitId;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _kitChiudiModalSped() {
    const modal = document.getElementById('modal-kit-sped');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display='none'; }, 300);
}

function _kitConfermaSpedizione() {
    const modal = document.getElementById('modal-kit-sped');
    if (!modal) return;
    const kitId = modal.dataset.kitId;
    _kitChiudiModalSped();

    const checked = [...document.querySelectorAll('.kit-sped-chk:checked')].map(c => c.dataset.said);
    if (!checked.length) return;

    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const nota = (document.getElementById('kit-sped-modal-nota')?.value||'').trim();
    const items = [];
    const righe = [];

    for (const saId of checked) {
        const sa  = (kit.sottoAssembly||[]).find(s => s.id === saId);
        if (!sa) continue;
        const qty = Number.parseInt(kit.pronti?.[saId], 10)||0;
        if (!qty) continue;
        items.push({ saId, nome: sa.nome, qty });

        for (const sez of (kit.sezioni||[])) {
            for (const comp of (sez.componenti||[])) {
                if (_kitIsSegnalazione(comp)) continue;
                const coeff = _kitGetComponentQty(comp, sa.varianteKey);
                if (!coeff) continue;
                const qtyTot = qty * coeff;
                comp.caricato = Math.max(0,(parseInt(comp.caricato)||0)-qtyTot);
                const ex = righe.find(r=>r.cid===comp.id);
                if (ex) ex.qty += qtyTot;
                else righe.push({ cid: comp.id, mat: comp.nome, qty: qtyTot });
            }
        }
        if (!kit.pronti) kit.pronti = {};
        delete kit.pronti[saId];
    }

    if (!kit.movimenti) kit.movimenti = [];
    kit.movimenti.unshift({ id: Date.now(), tipo: 'spedizione', items, righe, nota, ts: _ts() });
    _kitSave(kits);

    const totPz = items.reduce((s,i)=>s+i.qty,0);
    notificaElegante(`Spedizione registrata: ${totPz} pz ✓`);
    if (_kitViewId === kitId) _kitRenderView();
}

// ─── Modal reso ───────────────────────────────────────────────────────────────
function _kitApriModalReso(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const modal = document.getElementById('modal-kit-reso');
    if (!modal) return;

    const listEl = document.getElementById('kit-reso-items-list');
    if (listEl) {
        const saList = kit.sottoAssembly || [];
        listEl.innerHTML = saList.length === 0
            ? '<p style="color:#94a3b8;text-align:center">Configura prima i sub-assembly per registrare un reso.</p>'
            : saList.map(sa => {
                const vLabel = _kitVarianteLabel(kit, sa.varianteKey);
                return `<div class="kit-reso-item-row">
                    <span class="kit-reso-item-label">${_esc(sa.nome)} <span class="kit-sped-var-pill">${vLabel}</span></span>
                    <div class="kit-reso-qty-ctrl">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${_esc(sa.id)}',-1)">−</button>
                        <input type="number" id="kit-reso-qty-${_esc(sa.id)}" class="kit-reso-qty-inp" value="0" min="0" oninput="_kitResoAggiornaBOM('${_esc(kitId)}')">
                        <button type="button" class="kit-reso-qty-btn" onclick="_kitResoQtyChange('${_esc(sa.id)}',1)">+</button>
                    </div>
                </div>`;
            }).join('');
    }

    const notaEl = document.getElementById('kit-reso-nota');
    if (notaEl) notaEl.value = '';

    _kitResoAggiornaBOM(kitId);
    modal.dataset.kitId = kitId;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _kitChiudiModalReso() {
    const modal = document.getElementById('modal-kit-reso');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display='none'; }, 300);
}

function _kitResoQtyChange(saId, delta) {
    const inp = document.getElementById('kit-reso-qty-' + saId);
    if (!inp) return;
    inp.value = Math.max(0, (parseInt(inp.value)||0) + delta);
    const modal = document.getElementById('modal-kit-reso');
    if (modal?.dataset.kitId) _kitResoAggiornaBOM(modal.dataset.kitId);
}

function _kitResoAggiornaBOM(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const totComp = {};
    for (const sa of (kit.sottoAssembly||[])) {
        const inp = document.getElementById('kit-reso-qty-' + sa.id);
        const n = Number.parseInt(inp?.value, 10)||0;
        if (!n) continue;
        for (const sez of (kit.sezioni||[])) {
            for (const comp of (sez.componenti||[])) {
                if (_kitIsSegnalazione(comp)) continue;
                const coeff = _kitGetComponentQty(comp, sa.varianteKey);
                if (!coeff) continue;
                totComp[comp.id] = { mat: comp.nome, qty: (totComp[comp.id]?.qty||0) + n*coeff };
            }
        }
    }
    const listEl = document.getElementById('kit-reso-bom-list');
    if (!listEl) return;
    const entries = Object.entries(totComp).filter(([,v])=>v.qty>0);
    if (!entries.length) {
        listEl.innerHTML = '<div class="kit-reso-bom-empty">Inserisci le quantità sopra per vedere i componenti da recuperare.</div>';
        return;
    }
    listEl.innerHTML = entries.map(([cid,{mat,qty}])=>
        `<label class="kit-reso-bom-row">
            <input type="checkbox" class="kit-reso-bom-chk" data-cid="${_esc(cid)}" data-qty="${qty}" checked>
            <span class="kit-reso-bom-mat">${_esc(mat)}</span>
            <span class="kit-reso-bom-qty">+${qty}</span>
        </label>`
    ).join('');
}

function _kitConfermaReso() {
    const modal = document.getElementById('modal-kit-reso');
    if (!modal) return;
    const kitId = modal.dataset.kitId;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;

    const items = [];
    for (const sa of (kit.sottoAssembly||[])) {
        const n = Number.parseInt(document.getElementById('kit-reso-qty-' + sa.id)?.value, 10)||0;
        if (n > 0) items.push({ saId: sa.id, nome: sa.nome, qty: n });
    }
    if (!items.length) { notificaElegante('Inserisci almeno un articolo rientrato ⚠️'); return; }

    const righe    = [];
    const scartate = [];
    document.querySelectorAll('.kit-reso-bom-chk').forEach(chk => {
        const cid = chk.dataset.cid;
        const qty = Number.parseInt(chk.dataset.qty, 10);
        const mat = [...(kit.sezioni||[])].flatMap(s=>s.componenti||[]).find(c=>c.id===cid)?.nome || '?';
        if (chk.checked) righe.push({ cid, mat, qty });
        else scartate.push({ cid, mat, qty });
    });

    for (const r of righe) {
        for (const sez of (kit.sezioni||[])) {
            const c = (sez.componenti||[]).find(x=>x.id===r.cid);
            if (c) { c.caricato = (parseInt(c.caricato)||0)+r.qty; break; }
        }
    }

    const nota   = (document.getElementById('kit-reso-nota')?.value||'').trim();
    const totPz  = items.reduce((s,i)=>s+i.qty,0);
    if (!kit.movimenti) kit.movimenti = [];
    kit.movimenti.unshift({ id: Date.now(), tipo: 'reso', items, righe, scartate, nota, ts: _ts(), totPz });
    _kitSave(kits);

    _kitChiudiModalReso();
    notificaElegante(`Reso registrato: ${totPz} pz — ${righe.length} comp. recuperati ✓`);
    if (_kitViewId === kitId) _kitRenderView();
}

// ─── Salva manuale ────────────────────────────────────────────────────────────
function _kitSalvaManuale(kitId) {
    const btn   = document.getElementById('kit-save-btn');
    const label = document.getElementById('kit-save-label');
    if (!btn || !label) return;
    btn.disabled = true;
    btn.classList.add('kit-save-loading');
    label.textContent = 'Salvataggio…';
    const { kits } = _kitLoad();
    gasRequest({ azione: 'setKitData', kits })
        .then(() => {
            try { localStorage.setItem(_KIT_LS_TS, Date.now()); } catch {}
            btn.classList.remove('kit-save-loading');
            btn.classList.add('kit-save-ok');
            label.textContent = 'Salvato ✓';
            setTimeout(() => { btn.classList.remove('kit-save-ok'); label.textContent='Salva'; btn.disabled=false; }, 2500);
        })
        .catch(() => {
            btn.classList.remove('kit-save-loading');
            btn.classList.add('kit-save-err');
            label.textContent = 'Errore ✗';
            setTimeout(() => { btn.classList.remove('kit-save-err'); label.textContent='Salva'; btn.disabled=false; }, 3000);
        });
}

// ═════════════════════════════════════════════════════════════════════════════
// CONFIGURATORE
// ═════════════════════════════════════════════════════════════════════════════

let _kitConfigId  = null;
let _kitConfigTab = 'info';
let _kitImportState = null;

function _kitNuovoKit() {
    const { kits } = _kitLoad();
    const kit = {
        id: _uid(),
        nome: 'Nuovo Kit',
        schemaVersion: _KIT_SCHEMA_VERSION,
        assiConfigurazione: [],
        varianti: [],
        sezioni: [],
        sottoAssembly: [],
        qtaDaProdurre: {},
        pronti: {},
        movimenti: []
    };
    kits.push(kit);
    _kitSave(kits);
    _kitOpenConfig(kit.id);
}

function _kitOpenConfig(id) {
    _kitConfigId  = id;
    _kitConfigTab = 'info';
    _kitRenderConfig();
}

function _kitCreateImportState(currentKitId, mode, preselectedSectionId = '') {
    const { kits } = _kitLoad();
    const currentKit = kits.find(kit => kit.id === currentKitId);
    const firstSourceKit = kits.find(kit => kit.id !== currentKitId && (kit.sezioni || []).length);
    const firstCurrentSection = currentKit?.sezioni?.[0]?.id || '';
    return {
        currentKitId,
        mode,
        search: '',
        sourceKitId: mode === 'copy' ? currentKitId : (firstSourceKit?.id || ''),
        sectionId: preselectedSectionId || (mode === 'copy' ? firstCurrentSection : (firstSourceKit?.sezioni?.[0]?.id || '')),
        targetKitIds: []
    };
}

function _kitCfgOpenImportModal(kitId) {
    _kitImportState = _kitCreateImportState(kitId, 'import');
    _kitRenderImportModal(true);
}

function _kitCfgOpenCopySezModal(kitId, sectionId) {
    _kitImportState = _kitCreateImportState(kitId, 'copy', sectionId);
    _kitRenderImportModal(true);
}

function _kitCfgCloseImportModal() {
    const modal = document.getElementById('modal-kit-import');
    _kitImportState = null;
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        if (!modal.classList.contains('active')) modal.style.display = 'none';
    }, 300);
}

function _kitCfgSetImportMode(mode) {
    if (!_kitImportState || (mode !== 'import' && mode !== 'copy')) return;
    if (_kitImportState.mode === mode) return;
    const currentKitId = _kitImportState.currentKitId;
    const sectionId = mode === 'copy' ? _kitImportState.sectionId : '';
    _kitImportState = _kitCreateImportState(currentKitId, mode, sectionId);
    _kitRenderImportModal();
}

function _kitCfgSetImportSearch(value) {
    if (!_kitImportState) return;
    _kitImportState.search = String(value || '');
    _kitRenderImportModal();
}

function _kitCfgSelectImportSource(kitId) {
    if (!_kitImportState) return;
    const { kits } = _kitLoad();
    const sourceKit = kits.find(kit => kit.id === kitId);
    _kitImportState.sourceKitId = kitId;
    _kitImportState.sectionId = sourceKit?.sezioni?.[0]?.id || '';
    _kitRenderImportModal();
}

function _kitCfgSelectImportSection(sectionId) {
    if (!_kitImportState) return;
    _kitImportState.sectionId = sectionId;
    _kitRenderImportModal();
}

function _kitCfgToggleImportTarget(kitId, checked) {
    if (!_kitImportState || _kitImportState.mode !== 'copy') return;
    const selected = new Set(_kitImportState.targetKitIds || []);
    if (checked) selected.add(kitId);
    else selected.delete(kitId);
    _kitImportState.targetKitIds = [...selected];
    _kitRenderImportModal();
}

function _kitCfgSelectAllImportTargets() {
    if (!_kitImportState || _kitImportState.mode !== 'copy') return;
    const { kits } = _kitLoad();
    const filteredTargets = kits.filter(kit => kit.id !== _kitImportState.currentKitId && _kitMatchesSearch(kit.nome, _kitImportState.search));
    const selected = new Set(_kitImportState.targetKitIds || []);
    for (const kit of filteredTargets) selected.add(kit.id);
    _kitImportState.targetKitIds = [...selected];
    _kitRenderImportModal();
}

function _kitCfgClearImportTargets() {
    if (!_kitImportState || _kitImportState.mode !== 'copy') return;
    _kitImportState.targetKitIds = [];
    _kitRenderImportModal();
}

function _kitRenderImportModal(openModal = false) {
    const modal = document.getElementById('modal-kit-import');
    if (!modal || !_kitImportState) return;

    const { kits } = _kitLoad();
    const state = _kitImportState;
    const currentKit = kits.find(kit => kit.id === state.currentKitId);
    if (!currentKit) {
        _kitCfgCloseImportModal();
        return;
    }

    const sourceCandidates = kits.filter(kit => kit.id !== currentKit.id && (kit.sezioni || []).length);
    if (state.mode === 'import' && !sourceCandidates.some(kit => kit.id === state.sourceKitId)) {
        state.sourceKitId = sourceCandidates[0]?.id || '';
    }
    if (state.mode === 'copy') {
        state.sourceKitId = currentKit.id;
        state.targetKitIds = (state.targetKitIds || []).filter(kitId => kitId !== currentKit.id && kits.some(kit => kit.id === kitId));
    }

    const sourceKit = kits.find(kit => kit.id === state.sourceKitId) || null;
    const sourceSections = sourceKit?.sezioni || [];
    if (!sourceSections.some(sezione => sezione.id === state.sectionId)) {
        state.sectionId = sourceSections[0]?.id || '';
    }
    const selectedSection = _kitGetSectionById(sourceKit, state.sectionId);
    const filteredSourceKits = sourceCandidates.filter(kit => _kitMatchesSearch(kit.nome, state.search));
    const filteredTargetKits = kits.filter(kit => kit.id !== currentKit.id && _kitMatchesSearch(kit.nome, state.search));

    const subtitleEl = document.getElementById('kit-import-subtitle');
    const searchEl = document.getElementById('kit-import-search');
    const leftTitleEl = document.getElementById('kit-import-left-title');
    const rightTitleEl = document.getElementById('kit-import-right-title');
    const kitListEl = document.getElementById('kit-import-kit-list');
    const sectionListEl = document.getElementById('kit-import-section-list');
    const targetWrapEl = document.getElementById('kit-import-target-wrap');
    const targetListEl = document.getElementById('kit-import-target-list');
    const previewEl = document.getElementById('kit-import-preview');
    const confirmBtn = document.getElementById('kit-import-confirm-btn');
    const importModeBtn = document.getElementById('kit-import-mode-import');
    const copyModeBtn = document.getElementById('kit-import-mode-copy');
    if (!subtitleEl || !searchEl || !leftTitleEl || !rightTitleEl || !kitListEl || !sectionListEl || !targetWrapEl || !targetListEl || !previewEl || !confirmBtn || !importModeBtn || !copyModeBtn) return;

    importModeBtn.classList.toggle('kit-import-mode-btn--active', state.mode === 'import');
    copyModeBtn.classList.toggle('kit-import-mode-btn--active', state.mode === 'copy');
    searchEl.value = state.search;

    if (state.mode === 'import') {
        subtitleEl.textContent = `Importa una sezione esistente dentro "${currentKit.nome}".`;
        searchEl.placeholder = 'Cerca kit sorgente…';
        leftTitleEl.textContent = 'Kit sorgente';
        rightTitleEl.textContent = sourceKit ? `Sezioni di ${sourceKit.nome}` : 'Sezione';
        targetWrapEl.style.display = 'none';

        kitListEl.innerHTML = filteredSourceKits.length
            ? filteredSourceKits.map(kit => {
                const checked = kit.id === state.sourceKitId;
                return `<label class="kit-import-option ${checked ? 'kit-import-option--active' : ''}">
                    <input type="radio" name="kit-import-source" ${checked ? 'checked' : ''}
                           onchange="_kitCfgSelectImportSource('${_esc(kit.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${_esc(kit.nome)}</span>
                        <span class="kit-import-option-meta">${(kit.sezioni || []).length} sezioni disponibili</span>
                    </span>
                </label>`;
            }).join('')
            : '<div class="kit-import-empty">Nessun kit sorgente trovato.</div>';
    } else {
        subtitleEl.textContent = `Seleziona una sezione di "${currentKit.nome}" e copiala in più kit.`;
        searchEl.placeholder = 'Cerca kit destinazione…';
        leftTitleEl.textContent = 'Kit sorgente';
        rightTitleEl.textContent = 'Sezione da copiare';
        targetWrapEl.style.display = 'flex';

        kitListEl.innerHTML = `<div class="kit-import-source-card">
            <div class="kit-import-option-title">${_esc(currentKit.nome)}</div>
            <div class="kit-import-option-meta">${(currentKit.sezioni || []).length} sezioni configurate</div>
        </div>`;

        targetListEl.innerHTML = filteredTargetKits.length
            ? filteredTargetKits.map(kit => {
                const checked = (state.targetKitIds || []).includes(kit.id);
                const align = selectedSection ? _kitGetVariantAlignmentInfo(currentKit, kit) : null;
                let meta = `${(kit.sezioni || []).length} sezioni`; 
                if (align) {
                    if (!align.hasTargetVarianti) meta = 'nessuna combinazione: rifinisci dopo';
                    else if (align.needsReview) meta = `${align.exactMatches}/${align.targetCount} combinazioni allineate`;
                    else meta = `${align.targetCount}/${align.targetCount} combinazioni allineate`;
                }
                return `<label class="kit-import-option ${checked ? 'kit-import-option--active' : ''}">
                    <input type="checkbox" ${checked ? 'checked' : ''}
                           onchange="_kitCfgToggleImportTarget('${_esc(kit.id)}',this.checked)">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${_esc(kit.nome)}</span>
                        <span class="kit-import-option-meta">${_esc(meta)}</span>
                    </span>
                </label>`;
            }).join('')
            : '<div class="kit-import-empty">Nessun kit destinazione trovato.</div>';
    }

    sectionListEl.innerHTML = sourceSections.length
        ? sourceSections.map(sezione => {
            const checked = sezione.id === state.sectionId;
            return `<label class="kit-import-option ${checked ? 'kit-import-option--active' : ''}">
                <input type="radio" name="kit-import-section" ${checked ? 'checked' : ''}
                       onchange="_kitCfgSelectImportSection('${_esc(sezione.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${_esc(sezione.nome)}</span>
                    <span class="kit-import-option-meta">${(sezione.componenti || []).length} componenti</span>
                </span>
            </label>`;
        }).join('')
        : '<div class="kit-import-empty">Nessuna sezione disponibile.</div>';

    let canConfirm = false;
    let previewClass = 'kit-cfg-help kit-import-preview';
    let previewHtml = '';
    if (state.mode === 'import') {
        if (!sourceKit) {
            previewHtml = 'Seleziona un kit sorgente per vedere le sezioni disponibili.';
        } else if (!selectedSection) {
            previewHtml = 'Seleziona una sezione da importare nel kit corrente.';
        } else {
            const align = _kitGetVariantAlignmentInfo(sourceKit, currentKit);
            canConfirm = true;
            previewHtml = `La sezione <strong>${_esc(selectedSection.nome)}</strong> verrà importata in <strong>${_esc(currentKit.nome)}</strong>. `;
            if (!align.hasTargetVarianti) {
                previewClass = 'kit-cfg-warn kit-import-preview';
                previewHtml += 'Il kit destinazione non ha ancora combinazioni: importa pure la struttura e rifinisci i coefficienti dopo aver definito gli assi.';
            } else if (align.needsReview) {
                previewClass = 'kit-cfg-warn kit-import-preview';
                previewHtml += `${align.exactMatches} combinazioni su ${align.targetCount} risultano allineate: controlla i coefficienti importati.`;
            } else {
                previewHtml += `Tutte le ${align.targetCount} combinazioni del kit destinazione risultano allineate.`;
            }
        }
        confirmBtn.innerHTML = '<i class="fas fa-copy"></i> Importa sezione';
    } else {
        const selectedTargets = kits.filter(kit => (state.targetKitIds || []).includes(kit.id));
        if (!selectedSection) {
            previewHtml = 'Seleziona la sezione del kit corrente che vuoi copiare.';
        } else if (!selectedTargets.length) {
            previewHtml = 'Seleziona almeno un kit destinazione per eseguire la copia massiva.';
        } else {
            canConfirm = true;
            const reviewCount = selectedTargets.filter(kit => _kitGetVariantAlignmentInfo(currentKit, kit).needsReview).length;
            previewHtml = `La sezione <strong>${_esc(selectedSection.nome)}</strong> verrà copiata in <strong>${selectedTargets.length}</strong> kit.`;
            if (reviewCount > 0) {
                previewClass = 'kit-cfg-warn kit-import-preview';
                previewHtml += ` <strong>${reviewCount}</strong> kit richiederanno un controllo manuale delle quantità o delle combinazioni.`;
            } else {
                previewHtml += ' Le combinazioni risultano allineate su tutti i kit selezionati.';
            }
        }
        confirmBtn.innerHTML = `<i class="fas fa-copy"></i> Copia in ${(state.targetKitIds || []).length || 0} kit`;
    }

    previewEl.className = previewClass;
    previewEl.innerHTML = previewHtml;
    confirmBtn.disabled = !canConfirm;

    if (openModal) {
        modal.style.display = 'flex';
        modal.offsetHeight;
        modal.classList.add('active');
        setTimeout(() => {
            const input = document.getElementById('kit-import-search');
            if (input) input.focus();
        }, 40);
    }
}

function _kitCfgConfirmImport() {
    if (!_kitImportState) return;

    const { kits } = _kitLoad();
    const state = _kitImportState;
    const currentKit = kits.find(kit => kit.id === state.currentKitId);
    const sourceKit = kits.find(kit => kit.id === state.sourceKitId);
    const sourceSezione = _kitGetSectionById(sourceKit, state.sectionId);
    if (!currentKit || !sourceKit || !sourceSezione) {
        notificaElegante('Configurazione import non valida ⚠️');
        return;
    }

    if (state.mode === 'import') {
        const align = _kitGetVariantAlignmentInfo(sourceKit, currentKit);
        currentKit.sezioni = currentKit.sezioni || [];
        currentKit.sezioni.push(_kitCloneSezioneForKit(sourceSezione, sourceKit, currentKit));
        _kitSave(kits);
        _kitCfgCloseImportModal();
        _kitRenderConfig();

        let suffix = '';
        if (!align.hasTargetVarianti) suffix = ' Definisci poi gli assi del kit per rifinire i coefficienti.';
        else if (align.needsReview) suffix = ' Controlla le quantità sulle combinazioni non allineate.';
        notificaElegante(`Sezione "${sourceSezione.nome}" importata da "${sourceKit.nome}" ✓${suffix}`);
        return;
    }

    const targetKits = kits.filter(kit => (state.targetKitIds || []).includes(kit.id) && kit.id !== currentKit.id);
    if (!targetKits.length) {
        notificaElegante('Seleziona almeno un kit destinazione ⚠️');
        return;
    }

    let reviewCount = 0;
    for (const targetKit of targetKits) {
        const align = _kitGetVariantAlignmentInfo(sourceKit, targetKit);
        if (align.needsReview) reviewCount += 1;
        targetKit.sezioni = targetKit.sezioni || [];
        targetKit.sezioni.push(_kitCloneSezioneForKit(sourceSezione, sourceKit, targetKit));
    }
    _kitSave(kits);
    _kitCfgCloseImportModal();
    _kitRenderConfig();

    let suffix = '';
    if (reviewCount > 0) suffix = ` ${reviewCount} kit richiedono un controllo delle quantità.`;
    notificaElegante(`Sezione "${sourceSezione.nome}" copiata in ${targetKits.length} kit ✓${suffix}`);
}

function _kitRenderConfig() {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitConfigId);
    if (!kit) { caricaKitProdotti(); return; }

    const contenitore = document.getElementById('contenitore-dati');
    const assi = kit.assiConfigurazione || [];
    const variantiEffettive = _kitGetVariantiEffettive(kit);

    // migra eventuale vecchia chiave tab
    if (_kitConfigTab === 'sezioni') _kitConfigTab = 'bom';

    if (_kitConfigTab === 'sa') _kitConfigTab = 'bom';
    const tabs = ['info', 'varianti', 'bom'];
    const tabLabels = { info: 'Prodotto', varianti: 'Elettronica selezionabile', bom: 'Parti del prodotto' };

    // ─── Tab Info ───
    const nA  = assi.length;
    const nV  = variantiEffettive.length;
    const nC  = (kit.sezioni||[]).reduce((a,s) => a + (s.componenti||[]).length, 0);
    const recapHtml = nV ? `
        <div class="kit-cfg-recap">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-bolt"></i>
                <div><strong>${nA}</strong> grupp${nA===1?'o':'i'} elettronici e <strong>${nV}</strong> configurazioni pronte da usare</div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-layer-group"></i>
                <div>
                    ${variantiEffettive.slice(0, 8).map(v => `<span class="kit-cfg-sa-var-badge">${_esc(v.nome)}</span>`).join(' ')}
                    ${variantiEffettive.length > 8 ? `<span class="kit-cfg-sa-count">+${variantiEffettive.length - 8} altre</span>` : ''}
                </div>
            </div>
            <div class="kit-cfg-recap-row">
                <i class="fas fa-cubes"></i>
                <div><strong>${nC}</strong> parti prodotto da usare nella distinta base</div>
            </div>
        </div>` : `<div class="kit-cfg-help">💡 Inizia dalla tab <strong>Elettronica selezionabile</strong> per definire le scelte del faretto, per esempio <strong>LED</strong>, <strong>Lente</strong> o <strong>Alimentazione</strong>.</div>`;

    const infoHtml = `
        <div class="kit-cfg-section">
            <label class="kit-cfg-label">Nome kit</label>
            <input class="kit-cfg-input" id="kit-cfg-nome" type="text" value="${_esc(kit.nome)}" maxlength="60"
                   oninput="_kitCfgSaveNome('${_esc(kit.id)}',this.value)">
        </div>
        ${recapHtml}
        <div class="kit-cfg-danger">
            <button class="kit-btn-danger" onclick="_kitElimina('${_esc(kit.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`;

    // ─── Tab Elettronica selezionabile ───
    const assiHtml = assi.map((asse, axisIndex) => {
        const opzioniHtml = (asse.opzioni || []).map((opt, optIndex) => `
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${_esc(opt.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${_esc(kit.id)}','${_esc(asse.id)}','${_esc(opt.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${_esc(kit.id)}','${_esc(asse.id)}','${_esc(opt.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join('');

        return `<div class="kit-cfg-sez-block" data-ai="${axisIndex}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${_esc(asse.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${_esc(kit.id)}','${_esc(asse.id)}','nome',this.value)">
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${_esc(kit.id)}','${_esc(asse.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente può richiedere per questo gruppo.</div>
            ${opzioniHtml || '<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${_esc(kit.id)}','${_esc(asse.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
        </div>`;
    }).join('');

    const comboPreview = variantiEffettive.length
        ? `<div class="kit-cfg-recap" style="margin-top:12px">
            <div class="kit-cfg-recap-row">
                <i class="fas fa-diagram-project"></i>
                <div><strong>Configurazioni che il prodotto potrà comporre</strong></div>
            </div>
            <div class="kit-cfg-row">${variantiEffettive.slice(0, 12).map(v => `<span class="kit-cfg-sa-var-badge" title="${_esc(v.key)}">${_esc(v.nome)}</span>`).join(' ')}${variantiEffettive.length > 12 ? `<span class="kit-cfg-sa-count">+${variantiEffettive.length - 12} altre</span>` : ''}</div>
        </div>`
        : '';

    const variantiHtml = `
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci solo l'<strong>elettronica selezionabile</strong> del prodotto.<br>
                Esempio: un gruppo <strong>LED</strong>, uno <strong>Lente</strong>, uno <strong>Alimentazione</strong>.<br>
                Tu inserisci i nomi, il sistema userà queste scelte per costruire l'ordine e la distinta base.
            </div>
            ${assiHtml || '<div style="color:#94a3b8;padding:6px 0;font-size:0.82rem">Nessun gruppo elettronico ancora. Aggiungi il primo per iniziare.</div>'}
            <button class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${_esc(kit.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            ${comboPreview}
        </div>`;

    // ─── Tab Parti del prodotto ───
    const sezioniHtml = (kit.sezioni||[]).map((sez,si) => {
        const compRows = (sez.componenti||[]).map((comp) => {
            const isSegnalazione = _kitIsSegnalazione(comp);
            const rule = _kitGetCompRuleUi(comp, kit);
            const selectedAsse = (assi || []).find(item => item.id === rule.asseId) || null;
            const optionsHtml = rule.tipo === 'gruppo' && selectedAsse
                ? `<div class="kit-cfg-row">${(selectedAsse.opzioni || []).map(option => {
                    const checked = rule.opzioneIds.includes(option.id);
                    return `<label class="kit-meta-pill">
                        <input type="checkbox" ${checked ? 'checked' : ''}
                               onchange="_kitCfgToggleCompOption('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','${_esc(option.id)}',this.checked)">
                        ${_esc(option.nome)}
                    </label>`;
                }).join('')}</div>`
                : '';
            const asseSelectHtml = assi.length
                ? `<select class="kit-cfg-select" style="max-width:240px"
                           onchange="_kitCfgUpdateCompRule('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','asseId',this.value)">
                        ${assi.map(asseItem => `<option value="${_esc(asseItem.id)}" ${rule.asseId === asseItem.id ? 'selected' : ''}>${_esc(asseItem.nome)}</option>`).join('')}
                   </select>`
                : '';
            const advancedWarning = rule.tipo === 'manuale'
                ? `<div class="kit-cfg-warn">Questa parte usa ancora una configurazione avanzata precedente. Appena la modifichi verrà convertita nel nuovo schema semplice.</div>`
                : '';

            return `<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${_esc(comp.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','nome','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','modo','',this.value)">
                        <option value="quantificato" ${!isSegnalazione ? 'selected' : ''}>Materiale da contare</option>
                        <option value="segnalazione" ${isSegnalazione ? 'selected' : ''}>Solo avviso</option>
                    </select>
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantità per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" value="${rule.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:260px"
                            onchange="_kitCfgUpdateCompRule('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','tipo',this.value)">
                        <option value="sempre" ${rule.tipo === 'sempre' ? 'selected' : ''}>Sempre presente</option>
                        <option value="gruppo" ${rule.tipo === 'gruppo' ? 'selected' : ''}>Solo per scelte elettroniche</option>
                    </select>
                    ${rule.tipo === 'gruppo' ? asseSelectHtml : ''}
                </div>
                ${rule.tipo === 'gruppo' ? optionsHtml : ''}
                <input class="kit-cfg-input" value="${_esc(comp.noteConfig || '')}" maxlength="100" placeholder="Nota o avviso approvvigionamento"
                       onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','noteConfig','',this.value)">
                <div class="kit-cfg-help" style="margin:0">
                    ${isSegnalazione
                        ? 'Usa questo tipo per promemoria come resina, cavo neoprene o stampa 3D: verrà mostrato come avviso nella distinta.'
                        : 'Qui dici solo quanta parte serve per singolo faretto e se vale sempre o solo per certe scelte elettroniche.'}
                </div>
                ${advancedWarning}
            </div>`;
        }).join('');

        return `<div class="kit-cfg-sez-block" data-si="${si}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${_esc(sez.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${_esc(kit.id)}','${_esc(sez.id)}','nome',this.value)">
                <button class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${_esc(kit.id)}','${_esc(sez.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${_esc(kit.id)}','${_esc(sez.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${compRows}
            <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${_esc(kit.id)}','${_esc(sez.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`;
    }).join('');

    const sezioniPanelHtml = `
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce non è da contare ma solo da ricordare, impostala come <strong>Solo avviso</strong>.
            </div>
            ${!variantiEffettive.length ? `<div class="kit-cfg-warn">⚠️ Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>` : ''}
            ${sezioniHtml}
            <div class="kit-cfg-row">
                <button class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${_esc(kit.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${_esc(kit.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            </div>
        </div>`;

    // ─── Tab Parti tracciabili — raggruppate per combinazione ───
    let saGroupedHtml = '';
    if (!variantiEffettive.length) {
        saGroupedHtml = `<div class="kit-cfg-warn">⚠️ Aggiungi prima almeno un asse con opzioni nella tab <strong>Assi di configurazione</strong>.</div>`;
    } else {
        saGroupedHtml = variantiEffettive.map(v => {
            const items = (kit.sottoAssembly||[])
                .map((sa, i) => ({ sa, i }))
                .filter(({ sa }) => sa.varianteKey === v.key);

            const rows = items.map(({ sa, i }) => `
                <div class="kit-cfg-row kit-cfg-sarow">
                    <input class="kit-cfg-input" value="${_esc(sa.nome)}" maxlength="60" placeholder="es. Testa"
                           onchange="_kitCfgUpdateSA('${_esc(kit.id)}',${i},'nome',this.value)">
                    <button class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${_esc(kit.id)}',${i})"><i class="fas fa-times"></i></button>
                </div>`).join('');

            return `<div class="kit-cfg-sa-group">
                <div class="kit-cfg-sa-group-header">
                    <span class="kit-cfg-sa-var-badge">${_esc(v.nome)}</span>
                    <span class="kit-cfg-sa-count">${items.length} part${items.length!==1?'i':'e'}</span>
                </div>
                ${rows || '<div class="kit-cfg-sa-empty">Nessuna parte — aggiungi sotto</div>'}
                <button class="kit-cfg-add-comp-btn" onclick="_kitCfgAddSAForVariant('${_esc(kit.id)}','${_esc(v.key)}')"><i class="fas fa-plus"></i> Aggiungi parte per ${_esc(v.nome)}</button>
            </div>`;
        }).join('');
    }

    const saPanelHtml = `
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Le <strong>parti tracciabili</strong> sono i semi-lavorati che vuoi contare nel tab <strong>Parti pronte</strong>.<br>
                Per Shinino puoi usare per esempio <em>Corpo assemblato</em> o <em>Modulo driver</em> per una combinazione specifica.<br>
                Queste quantità consumano i materiali del BOM della combinazione a cui sono collegate.
            </div>
            ${saGroupedHtml}
        </div>`;

    const panels = { info: infoHtml, varianti: variantiHtml, bom: sezioniPanelHtml, sa: saPanelHtml };
    const tabNav = tabs.map(t => `<button class="kit-tab ${_kitConfigTab===t?'kit-tab--active':''}" onclick="_kitCfgSwitchTab('${t}')">${tabLabels[t]}</button>`).join('');

    contenitore.innerHTML = `
    <div class="kit-page">
        <div class="kit-view-header">
            <button class="kit-back-btn" onclick="_kitCfgBack('${_esc(kit.id)}')"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome"><i class="fas fa-gear"></i> Configura: ${_esc(kit.nome)}</span>
        </div>
        <div class="kit-tabs">${tabNav}</div>
        <div class="kit-tab-panel kit-tab-panel--active kit-cfg-panel">${panels[_kitConfigTab]}</div>
    </div>`;

    applicaFade(contenitore);
}

function _kitCfgBack(kitId) {
    // se stavamo configurando, torna alla vista (se esiste) o alla griglia
    if (kitId && _kitViewId === kitId) { _kitRenderView(); return; }
    _kitViewId = kitId;
    _kitRenderView();
}

function _kitCfgSwitchTab(tab) { _kitConfigTab = tab; _kitRenderConfig(); }

function _kitCfgMutate(kitId, mutator, rerender = true) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    mutator(kit);
    _kitSave(kits);
    if (rerender) _kitRenderConfig();
}

function _kitCfgSaveNome(kitId, val) {
    _kitCfgMutate(kitId, function(kit) {
        kit.nome = val.trim() || 'Kit senza nome';
    }, false);
}

function _kitElimina(kitId) {
    if (!confirm('Eliminare questo kit e tutti i suoi dati?')) return;
    const { kits } = _kitLoad();
    _kitSave(kits.filter(k => k.id !== kitId));
    _kitConfigId = null;
    _kitViewId   = null;
    caricaKitProdotti();
}

// ─── Assi di configurazione ───────────────────────────────────────────────────
function _kitCfgAddAsse(kitId) {
    _kitCfgMutate(kitId, function(kit) {
        const idx = (kit.assiConfigurazione || []).length + 1;
        kit.assiConfigurazione = kit.assiConfigurazione || [];
        kit.assiConfigurazione.push({
            id: _uid(),
            key: 'asse' + idx,
            nome: 'Asse ' + idx,
            opzioni: [{ id: _uid(), key: 'opz1', nome: 'Opzione 1' }]
        });
    });
}

function _kitCfgUpdateAsse(kitId, asseId, field, val) {
    _kitCfgMutate(kitId, function(kit) {
        const asse = (kit.assiConfigurazione || []).find(item => item.id === asseId);
        if (!asse) return;
        if (field === 'key') asse.key = _kitSanitizeKey(val, asse.key || 'asse');
        else asse[field] = val.trim();
    });
}

function _kitCfgDelAsse(kitId, asseId) {
    _kitCfgMutate(kitId, function(kit) {
        kit.assiConfigurazione = (kit.assiConfigurazione || []).filter(item => item.id !== asseId);
    });
}

function _kitCfgAddOpzione(kitId, asseId) {
    _kitCfgMutate(kitId, function(kit) {
        const asse = (kit.assiConfigurazione || []).find(item => item.id === asseId);
        if (!asse) return;
        const idx = (asse.opzioni || []).length + 1;
        asse.opzioni = asse.opzioni || [];
        asse.opzioni.push({ id: _uid(), key: 'opz' + idx, nome: 'Opzione ' + idx });
    });
}

function _kitCfgUpdateOpzione(kitId, asseId, opzioneId, field, val) {
    _kitCfgMutate(kitId, function(kit) {
        const asse = (kit.assiConfigurazione || []).find(item => item.id === asseId);
        const opzione = asse && (asse.opzioni || []).find(item => item.id === opzioneId);
        if (!opzione) return;
        if (field === 'key') opzione.key = _kitSanitizeKey(val, opzione.key || 'opzione');
        else opzione[field] = val.trim();
    });
}

function _kitCfgDelOpzione(kitId, asseId, opzioneId) {
    _kitCfgMutate(kitId, function(kit) {
        const asse = (kit.assiConfigurazione || []).find(item => item.id === asseId);
        if (!asse) return;
        asse.opzioni = (asse.opzioni || []).filter(item => item.id !== opzioneId);
    });
}

function _kitCfgAddVar(kitId) {
    _kitCfgAddAsse(kitId);
}

// ─── Sezioni / Componenti ─────────────────────────────────────────────────────
function _kitCfgAddSez(kitId) {
    _kitCfgMutate(kitId, function(kit) {
        kit.sezioni = kit.sezioni || [];
        kit.sezioni.push({ id: _uid(), nome: 'Nuova sezione', componenti: [] });
    });
}

function _kitCfgImportSez(kitId) {
    _kitCfgOpenImportModal(kitId);
}

function _kitCfgUpdateSez(kitId, sid, field, val) {
    _kitCfgMutate(kitId, function(kit) {
        const sez  = (kit.sezioni||[]).find(s => s.id === sid);
        if (!sez) return;
        sez[field] = val.trim();
    }, false);
}

function _kitCfgDelSez(kitId, sid) {
    if (!confirm('Eliminare questa sezione e tutti i suoi componenti?')) return;
    _kitCfgMutate(kitId, function(kit) {
        kit.sezioni = (kit.sezioni||[]).filter(s => s.id !== sid);
    });
}

function _kitCfgAddComp(kitId, sid) {
    _kitCfgMutate(kitId, function(kit) {
        const sez = (kit.sezioni||[]).find(s => s.id === sid);
        if (!sez) return;
        sez.componenti = sez.componenti || [];
        sez.componenti.push({
            id: _uid(),
            nome: 'Nuovo componente',
            qtaPerVariante: {},
            caricato: 0,
            modoComponente: 'quantificato',
            tracciabile: true,
            noteConfig: '',
            unitaMisura: 'pz'
        });
    });
}

function _kitCfgUpdateComp(kitId, sid, cid, field, vKey, val) {
    _kitCfgMutate(kitId, function(kit) {
        const sez  = (kit.sezioni||[]).find(s => s.id === sid);
        const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
        if (!comp) return;
        if (field === 'coeff' || field === 'flag') {
            comp.qtaPerVariante = comp.qtaPerVariante || {};
            comp.qtaPerVariante[vKey] = Math.max(0, Number.parseInt(val, 10)||0);
            return;
        }
        if (field === 'modo') {
            comp.modoComponente = val === 'segnalazione' ? 'segnalazione' : 'quantificato';
            if (comp.modoComponente === 'segnalazione') {
                comp.tracciabile = false;
                comp.unitaMisura = 'flag';
            } else if (comp.unitaMisura === 'flag') {
                comp.unitaMisura = 'pz';
            }
            return;
        }
        comp[field] = val.trim();
    }, field !== 'nome' && field !== 'noteConfig');
}

function _kitCfgUpdateCompRule(kitId, sid, cid, field, value) {
    _kitCfgMutate(kitId, function(kit) {
        const sez  = (kit.sezioni||[]).find(s => s.id === sid);
        const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
        if (!comp) return;

        const rule = _kitGetCompRuleUi(comp, kit);
        if (field === 'tipo') {
            rule.tipo = value === 'gruppo' ? 'gruppo' : 'sempre';
            if (rule.tipo === 'gruppo' && !rule.asseId) {
                rule.asseId = kit.assiConfigurazione?.[0]?.id || '';
                const asse = (kit.assiConfigurazione || []).find(item => item.id === rule.asseId);
                rule.opzioneIds = asse?.opzioni?.length ? [asse.opzioni[0].id] : [];
            }
        } else if (field === 'qtyBase') {
            rule.qtyBase = Math.max(0, Number.parseInt(value, 10) || 0);
        } else if (field === 'asseId') {
            rule.asseId = String(value || '');
            const asse = (kit.assiConfigurazione || []).find(item => item.id === rule.asseId);
            rule.opzioneIds = asse?.opzioni?.length ? [asse.opzioni[0].id] : [];
            rule.tipo = 'gruppo';
        }

        comp.applicazioneTipo = rule.tipo;
        comp.applicazioneAsseId = rule.asseId;
        comp.applicazioneOpzioneIds = rule.opzioneIds;
        comp.qtaBase = rule.qtyBase;
        comp.qtaPerVariante = _kitCompileCompQtyMap(comp, kit, rule);
    });
}

function _kitCfgToggleCompOption(kitId, sid, cid, optionId, checked) {
    _kitCfgMutate(kitId, function(kit) {
        const sez  = (kit.sezioni||[]).find(s => s.id === sid);
        const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
        if (!comp) return;

        const rule = _kitGetCompRuleUi(comp, kit);
        const optionIds = new Set(rule.opzioneIds || []);
        if (checked) optionIds.add(optionId);
        else optionIds.delete(optionId);
        rule.tipo = 'gruppo';
        rule.opzioneIds = [...optionIds];

        comp.applicazioneTipo = rule.tipo;
        comp.applicazioneAsseId = rule.asseId;
        comp.applicazioneOpzioneIds = rule.opzioneIds;
        comp.qtaBase = rule.qtyBase;
        comp.qtaPerVariante = _kitCompileCompQtyMap(comp, kit, rule);
    });
}

function _kitCfgToggleCompTracked(kitId, sid, cid, checked) {
    _kitCfgMutate(kitId, function(kit) {
        const sez  = (kit.sezioni||[]).find(s => s.id === sid);
        const comp = sez && (sez.componenti||[]).find(c => c.id === cid);
        if (!comp || _kitIsSegnalazione(comp)) return;
        comp.tracciabile = !!checked;
    }, false);
}

function _kitCfgDelComp(kitId, sid, cid) {
    _kitCfgMutate(kitId, function(kit) {
        const sez  = (kit.sezioni||[]).find(s => s.id === sid);
        if (!sez) return;
        sez.componenti = (sez.componenti||[]).filter(c => c.id !== cid);
    });
}

// ─── Parti tracciabili ────────────────────────────────────────────────────────
function _kitCfgAddSA(kitId) {
    _kitCfgMutate(kitId, function(kit) {
        kit.sottoAssembly = kit.sottoAssembly || [];
        kit.sottoAssembly.push({ id: _uid(), nome: '', varianteKey: _kitGetVariantiEffettive(kit)[0]?.key || '' });
    });
}

function _kitCfgAddSAForVariant(kitId, varKey) {
    _kitCfgMutate(kitId, function(kit) {
        kit.sottoAssembly = kit.sottoAssembly || [];
        kit.sottoAssembly.push({ id: _uid(), nome: '', varianteKey: varKey, noteConfig: '' });
    });
}

function _kitCfgUpdateSA(kitId, i, field, val) {
    _kitCfgMutate(kitId, function(kit) {
        if (!kit.sottoAssembly[i]) return;
        kit.sottoAssembly[i][field] = val.trim();
    }, false);
}

function _kitCfgDelSA(kitId, i) {
    _kitCfgMutate(kitId, function(kit) {
        kit.sottoAssembly.splice(i, 1);
    });
}

// ═════════════════════════════════════════════════════════════════════════════
// GLOBALS
// ═════════════════════════════════════════════════════════════════════════════

export function registerGlobals() {
    window._kitOpenView              = _kitOpenView;
    window._kitOpenConfig            = _kitOpenConfig;
    window._kitNuovoKit              = _kitNuovoKit;
    window._kitBack                  = _kitBack;
    window._kitSwitchTab             = _kitSwitchTab;
    window._kitAggiornaQty           = _kitAggiornaQty;
    window._kitOrdineSet             = _kitOrdineSet;
    window._kitOrdineDelta           = _kitOrdineDelta;
    window._kitOrdineReset           = _kitOrdineReset;
    window._kitOrdineResetVoce       = _kitOrdineResetVoce;
    window._kitComposeSelect         = _kitComposeSelect;
    window._kitComposeAdd            = _kitComposeAdd;
    window._kitAggiornaCar           = _kitAggiornaCar;
    window._kitAggiornaPronti        = _kitAggiornaPronti;
    window._kitSetPronti             = _kitSetPronti;
    window._kitApriModalSped         = _kitApriModalSped;
    window._kitChiudiModalSped       = _kitChiudiModalSped;
    window._kitConfermaSpedizione    = _kitConfermaSpedizione;
    window._kitApriModalReso         = _kitApriModalReso;
    window._kitChiudiModalReso       = _kitChiudiModalReso;
    window._kitResoQtyChange         = _kitResoQtyChange;
    window._kitResoAggiornaBOM       = _kitResoAggiornaBOM;
    window._kitConfermaReso          = _kitConfermaReso;
    window._kitSalvaMovimento        = _kitSalvaMovimento;
    window._kitEliminaMovimento      = _kitEliminaMovimento;
    window._kitModificaMovimento     = _kitModificaMovimento;
    window._kitChiudiModalEditMov    = _kitChiudiModalEditMov;
    window._kitConfermaModificaMov   = _kitConfermaModificaMov;
    window._kitChiudiModalDelMov     = _kitChiudiModalDelMov;
    window._kitConfermaEliminaMov    = _kitConfermaEliminaMov;
    window._kitSalvaManuale          = _kitSalvaManuale;
    window._kitElimina               = _kitElimina;
    window._kitCfgBack               = _kitCfgBack;
    window._kitCfgSwitchTab          = _kitCfgSwitchTab;
    window._kitCfgSaveNome           = _kitCfgSaveNome;
    window._kitCfgAddVar             = _kitCfgAddVar;
    window._kitCfgOpenImportModal    = _kitCfgOpenImportModal;
    window._kitCfgOpenCopySezModal   = _kitCfgOpenCopySezModal;
    window._kitCfgCloseImportModal   = _kitCfgCloseImportModal;
    window._kitCfgSetImportMode      = _kitCfgSetImportMode;
    window._kitCfgSetImportSearch    = _kitCfgSetImportSearch;
    window._kitCfgSelectImportSource = _kitCfgSelectImportSource;
    window._kitCfgSelectImportSection = _kitCfgSelectImportSection;
    window._kitCfgToggleImportTarget = _kitCfgToggleImportTarget;
    window._kitCfgSelectAllImportTargets = _kitCfgSelectAllImportTargets;
    window._kitCfgClearImportTargets = _kitCfgClearImportTargets;
    window._kitCfgConfirmImport      = _kitCfgConfirmImport;
    window._kitCfgAddAsse            = _kitCfgAddAsse;
    window._kitCfgUpdateAsse         = _kitCfgUpdateAsse;
    window._kitCfgDelAsse            = _kitCfgDelAsse;
    window._kitCfgAddOpzione         = _kitCfgAddOpzione;
    window._kitCfgUpdateOpzione      = _kitCfgUpdateOpzione;
    window._kitCfgDelOpzione         = _kitCfgDelOpzione;
    window._kitCfgAddSez             = _kitCfgAddSez;
    window._kitCfgImportSez          = _kitCfgImportSez;
    window._kitCfgUpdateSez          = _kitCfgUpdateSez;
    window._kitCfgDelSez             = _kitCfgDelSez;
    window._kitCfgAddComp            = _kitCfgAddComp;
    window._kitCfgUpdateComp         = _kitCfgUpdateComp;
    window._kitCfgUpdateCompRule     = _kitCfgUpdateCompRule;
    window._kitCfgToggleCompOption   = _kitCfgToggleCompOption;
    window._kitCfgToggleCompTracked  = _kitCfgToggleCompTracked;
    window._kitCfgDelComp            = _kitCfgDelComp;
    window._kitCfgAddSA              = _kitCfgAddSA;
    window._kitCfgAddSAForVariant    = _kitCfgAddSAForVariant;
    window._kitCfgUpdateSA           = _kitCfgUpdateSA;
    window._kitCfgDelSA              = _kitCfgDelSA;
}

export default caricaKitProdotti;
