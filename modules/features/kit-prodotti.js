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
const _KIT_DRAFT_DOC_SEQ_KEY = '_mlKitOrderDraftSeq';
const _KIT_PRESET_SECS_LS_KEY = '_mlKitPresetSections'; // anagrafiche/sezioni riutilizzabili
const _KIT_SCHEMA_VERSION = 2;
const _KIT_UNITA_MISURA_OPTIONS = ['pz', 'mt', 'cm', 'mm', 'kg', 'g', 'lt', 'ml'];
const _KIT_DISTINTE_LS_KEY = '_mlKitDistinte';
const _KIT_DISTINTE_LS_TS  = '_mlKitDistinteTs';
const _KIT_ANAGRAFICHE_LS_KEY = '_mlKitAnagrafiche';
const _KIT_ANAGRAFICHE_LS_TS  = '_mlKitAnagraficheTs';

// ─── fetch flag ───────────────────────────────────────────────────────────────
let _fetched = false;
let _kitOrderAutocompleteCache = [];
let _kitOrderAutocompletePromise = null;
// Lock per evitare chiamate duplicate rapide a _kitComposeAdd
const _kitComposeAddLock = {};
let _kitMainTab = 'kits';

export function resetKitFetch() { _fetched = false; }

function _kitSanitizeKey(value, fallback) {
    const cleaned = String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_-]/g, '');
    return cleaned || fallback;
}

function _kitParseQty(value) {
    const normalized = String(value ?? '')
        .trim()
        .replace(',', '.');
    const qty = Number.parseFloat(normalized);
    return Number.isFinite(qty) ? Math.max(0, qty) : 0;
}

function _kitFormatQty(value) {
    const qty = Number(value);
    if (!Number.isFinite(qty)) return '0';
    const rounded = Math.round(qty * 1000) / 1000;
    if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
    return rounded.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 3 });
}

function _kitNormalizeUnit(value, fallback = 'pz') {
    const unit = String(value || fallback).trim().toLowerCase();
    return unit || fallback;
}

function _kitNormalizeOption(opt, fallbackIndex) {
    const fallbackKey = 'opz' + (fallbackIndex + 1);
    const key = _kitSanitizeKey(opt?.key, fallbackKey);
    return {
        id: String(opt?.id || _uid()),
        key,
        nome: String(opt?.nome || key).trim() || key,
        codice: String(opt?.codice || '').trim()
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
                        opzioneNome: opzione.nome,
                        opzioneCodice: String(opzione.codice || '').trim()
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
        codice: String(comp?.codice || '').trim(),
        qtaPerVariante: { ...(comp?.qtaPerVariante || {}) },
        caricato: Number(comp?.caricato || 0),
        modoComponente: modo,
        tracciabile,
        noteConfig: String(comp?.noteConfig || '').trim(),
        unitaMisura: _kitNormalizeUnit(comp?.unitaMisura, defaultUnita),
        applicazioneTipo: String(comp?.applicazioneTipo || '').trim(),
        applicazioneAsseId: String(comp?.applicazioneAsseId || '').trim(),
        applicazioneOpzioneIds: Array.isArray(comp?.applicazioneOpzioneIds) ? comp.applicazioneOpzioneIds.map(String) : [],
        qtaBase: _kitParseQty(comp?.qtaBase)
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
        qtyBase: _kitParseQty(comp?.qtaBase)
    };

    if (comp?.applicazioneTipo === 'sempre' || comp?.applicazioneTipo === 'gruppo') {
        return {
            tipo: comp.applicazioneTipo,
            asseId: String(comp.applicazioneAsseId || ''),
            opzioneIds: Array.isArray(comp.applicazioneOpzioneIds) ? comp.applicazioneOpzioneIds.map(String) : [],
            qtyBase: baseRule.qtyBase || _kitParseQty(Object.values(comp?.qtaPerVariante || {})[0])
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
    const qtyBase = _kitParseQty(rule.qtyBase);
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
        unitaMisura: _kitNormalizeUnit(comp?.unitaMisura, _kitIsSegnalazione(comp) ? 'flag' : 'pz')
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

function _kitCloneAsseForKit(asse, sourceKit, targetKit) {
    const existingKeys = new Set((targetKit.assiConfigurazione || []).map(a => a.key));
    const baseKey = _kitSanitizeKey(asse?.key || String(asse?.nome || 'asse'), 'asse1');
    let key = baseKey;
    let i = 1;
    while (existingKeys.has(key)) { key = baseKey + '_c' + (i++); }

    const opzioni = [];
    for (let idx = 0; idx < (asse.opzioni || []).length; idx++) {
        const opt = asse.opzioni[idx];
        const fallback = 'opz' + (idx + 1);
        let optKey = _kitSanitizeKey(opt?.key, fallback);
        let j = 1;
        while (opzioni.some(o => o.key === optKey)) { optKey = optKey + '_c' + (j++); }
        opzioni.push({ id: _uid(), key: optKey, nome: String(opt?.nome || '').trim() || optKey, codice: String(opt?.codice || '').trim() });
    }

    return {
        id: _uid(),
        key,
        nome: String(asse?.nome || '').trim() || key,
        opzioni
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
    const rawQty = _kitParseQty(comp?.qtaPerVariante?.[vKey]);
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

function _kitLoadPresets() {
    try {
        const raw = localStorage.getItem(_KIT_PRESET_SECS_LS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function _kitSavePresets(presets) {
    try {
        localStorage.setItem(_KIT_PRESET_SECS_LS_KEY, JSON.stringify(presets || []));
    } catch {}
}

// ─── Distinte (localStorage) ─────────────────────────────────────────────────
function _kitLoadDistinte() {
    try {
        const raw = localStorage.getItem(_KIT_DISTINTE_LS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function _kitSaveDistinte(distinte) {
    try {
        localStorage.setItem(_KIT_DISTINTE_LS_KEY, JSON.stringify(distinte || []));
        try { localStorage.setItem(_KIT_DISTINTE_LS_TS, Date.now()); } catch {}
    } catch {}
}

function _kitNormalizeOrderNumber(value) {
    return String(value || '').trim().toUpperCase();
}

function _kitNormalizeOrderMeta(meta) {
    const ordiniCliente = Array.isArray(meta?.ordiniCliente)
        ? [...new Set(meta.ordiniCliente.map(_kitNormalizeOrderNumber).filter(Boolean))]
        : [];
    return {
        cliente: String(meta?.cliente || '').trim(),
        ordiniCliente,
        documento: String(meta?.documento || '').trim()
    };
}

function _kitGetOrderMeta(orderDraft) {
    return _kitNormalizeOrderMeta(orderDraft?._meta || {});
}

function _kitSetOrderMeta(orderDraft, meta) {
    orderDraft._meta = _kitNormalizeOrderMeta(meta);
    return orderDraft._meta;
}

function _kitGetOrderQty(orderDraft, varianteKey) {
    return Math.max(0, Number.parseInt(orderDraft?.[varianteKey], 10) || 0);
}

function _kitGetNextDocumentNumber() {
    let nextValue = 1;
    try {
        const currentValue = Number.parseInt(localStorage.getItem(_KIT_DRAFT_DOC_SEQ_KEY), 10) || 0;
        nextValue = currentValue + 1;
        localStorage.setItem(_KIT_DRAFT_DOC_SEQ_KEY, String(nextValue));
    } catch {}
    return `Distinta Base-${String(nextValue).padStart(4, '0')}`;
}

function _kitEnsureOrderDraftDocument(orderDraft) {
    const meta = _kitGetOrderMeta(orderDraft);
    if (!meta.documento) {
        meta.documento = _kitGetNextDocumentNumber();
        _kitSetOrderMeta(orderDraft, meta);
    }
    return meta.documento;
}

function _kitBuildOrderLookup(rows) {
    const seen = new Set();
    return (Array.isArray(rows) ? rows : [])
        .filter(row => String(row?.archiviato || '').toUpperCase() !== 'TRUE')
        .map(row => ({
            ordine: _kitNormalizeOrderNumber(row?.ordine || ''),
            cliente: String(row?.cliente || '').trim()
        }))
        .filter(item => {
            if (!item.ordine || seen.has(item.ordine)) return false;
            seen.add(item.ordine);
            return true;
        });
}

function _kitEnsureOrderLookupCache() {
    if (_kitOrderAutocompleteCache.length) return Promise.resolve(_kitOrderAutocompleteCache);
    if (Array.isArray(window._attiviProd) && window._attiviProd.length) {
        _kitOrderAutocompleteCache = _kitBuildOrderLookup(window._attiviProd);
        return Promise.resolve(_kitOrderAutocompleteCache);
    }
    if (_kitOrderAutocompletePromise) return _kitOrderAutocompletePromise;

    _kitOrderAutocompletePromise = fetch(URL_GOOGLE, {
        method: 'POST',
        body: JSON.stringify({ pagina: 'PROGRAMMA PRODUZIONE DEL MESE' })
    })
        .then(response => response.json())
        .then(rows => {
            _kitOrderAutocompleteCache = _kitBuildOrderLookup(rows);
            return _kitOrderAutocompleteCache;
        })
        .catch(function(error) {
            console.warn('[kit-prodotti] autocomplete ordini non disponibile:', error);
            return [];
        })
        .finally(function() {
            _kitOrderAutocompletePromise = null;
        });

    return _kitOrderAutocompletePromise;
}

function _kitFindOrderLookup(orderNumber) {
    const normalized = _kitNormalizeOrderNumber(orderNumber);
    if (!normalized) return null;
    return _kitOrderAutocompleteCache.find(item => item.ordine === normalized) || null;
}

function _kitResolveCustomerFromOrderRefs(orderNumbers, overrides = {}) {
    const clienti = [...new Set((Array.isArray(orderNumbers) ? orderNumbers : []).map(function(orderNumber) {
        const normalized = _kitNormalizeOrderNumber(orderNumber);
        if (!normalized) return '';
        if (overrides[normalized]) return String(overrides[normalized] || '').trim();
        return String(_kitFindOrderLookup(normalized)?.cliente || '').trim();
    }).filter(Boolean))];
    return clienti.length === 1 ? clienti[0] : '';
}

function _kitGetOrderDraft(kit) {
    const drafts = _kitLoadOrderDrafts();
    const rawDraft = drafts?.[kit?.id] && typeof drafts[kit.id] === 'object' ? drafts[kit.id] : {};
    const normalized = {};
    for (const variante of _kitGetVariantiEffettive(kit)) {
        const fallbackQty = rawDraft[variante.key];
        normalized[variante.key] = Math.max(0, Number.parseInt(fallbackQty, 10) || 0);
    }
    normalized._meta = _kitNormalizeOrderMeta(rawDraft._meta || {});
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

    const normalizedMeta = _kitNormalizeOrderMeta(currentDraft._meta || {});
    const hasMetaValues = !!(normalizedMeta.cliente || normalizedMeta.ordiniCliente.length || normalizedMeta.documento);
    if (hasValues || hasMetaValues) {
        if (!normalizedMeta.documento) normalizedMeta.documento = _kitGetNextDocumentNumber();
        cleanedDraft._meta = normalizedMeta;
    }


    if (hasValues || hasMetaValues) drafts[kitId] = cleanedDraft;
    else delete drafts[kitId];
    _kitSaveOrderDrafts(drafts);

    if (_kitViewId === kitId) _kitRenderView();
}

function _kitCountOrderPieces(orderDraft) {
    return Object.entries(orderDraft || {}).reduce(function(sum, entry) {
        if (entry[0] === '_meta') return sum;
        return sum + (Number.parseInt(entry[1], 10) || 0);
    }, 0);
}

// ═════════════════════════════════════════════════════════════════════════════
// NEW-STYLE KIT: nessun assiConfigurazione — selezione diretta per componente
// ═════════════════════════════════════════════════════════════════════════════

/** Ritorna true se il kit non ha assi (stile nuovo: selezione componenti libera) */
function _kitIsNewStyleKit(kit) {
    return !(kit.assiConfigurazione && kit.assiConfigurazione.length);
}

/** Carica il draft new-style da localStorage */
function _kitGetNewStyleDraft(kitId) {
    const drafts = _kitLoadOrderDrafts();
    const raw = (drafts?.[kitId] && typeof drafts[kitId] === 'object') ? drafts[kitId] : {};
    return {
        _meta: _kitNormalizeOrderMeta(raw._meta || {}),
        _units: Math.max(1, Number.parseInt(raw._units, 10) || 1),
        _sel: (raw._sel && typeof raw._sel === 'object') ? { ...raw._sel } : {}
    };
}

/** Modifica il draft new-style e salva; re-renderizza la view se attiva */
function _kitMutateNewStyleDraft(kitId, mutator, rerender) {
    const drafts = _kitLoadOrderDrafts();
    const raw = (drafts?.[kitId] && typeof drafts[kitId] === 'object') ? drafts[kitId] : {};
    const draft = {
        _meta: _kitNormalizeOrderMeta(raw._meta || {}),
        _units: Math.max(1, Number.parseInt(raw._units, 10) || 1),
        _sel: (raw._sel && typeof raw._sel === 'object') ? { ...raw._sel } : {}
    };
    mutator(draft);
    const hasSel = Object.keys(draft._sel).length > 0;
    const hasUnits = draft._units > 1;
    const normalizedMeta = _kitNormalizeOrderMeta(draft._meta || {});
    const hasMetaValues = !!(normalizedMeta.cliente || normalizedMeta.ordiniCliente.length || normalizedMeta.documento);
    if (hasSel || hasUnits || hasMetaValues) {
        if (!normalizedMeta.documento) normalizedMeta.documento = _kitGetNextDocumentNumber();
        drafts[kitId] = { _meta: normalizedMeta, _units: draft._units, _sel: draft._sel };
    } else {
        delete drafts[kitId];
    }
    _kitSaveOrderDrafts(drafts);
    if (rerender !== false && _kitViewId === kitId) _kitRenderView();
}

function _kitNSSetUnits(kitId, val) {
    const u = Math.max(1, Number.parseInt(val, 10) || 1);
    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateNewStyleDraft(kitId, function(d) { d._units = u; });
}

function _kitNSToggleComp(kitId, compId, checked) {
    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateNewStyleDraft(kitId, function(d) {
        if (checked) d._sel[compId] = true;
        else delete d._sel[compId];
    });
}

function _kitNSOrderSearch(kitId, rawQuery) {
    const query = String(rawQuery || '').trim().toLowerCase();
    const list = document.getElementById('kit-ns-autocomplete-' + kitId);
    if (!list) return;
    if (!query) { list.style.display = 'none'; list.innerHTML = ''; return; }
    _kitEnsureOrderLookupCache().then(function(cache) {
        const matches = cache
            .filter(function(item) { return item.ordine.toLowerCase().includes(query) || item.cliente.toLowerCase().includes(query); })
            .slice(0, 8);
        if (!matches.length) { list.style.display = 'none'; list.innerHTML = ''; return; }
        list.innerHTML = matches.map(function(item) {
            return `<div class="autocomplete-item" onmousedown='_kitNSOrderPick(${JSON.stringify(kitId)},${JSON.stringify(item.ordine)},${JSON.stringify(item.cliente)})'>
                <span class="ac-ordine">ORD. ${_esc(item.ordine)}</span>
                <span class="ac-cliente">${_esc(item.cliente)}</span>
            </div>`;
        }).join('');
        list.style.display = 'block';
    });
}

function _kitNSOrderHideSearch(kitId) {
    setTimeout(function() {
        const list = document.getElementById('kit-ns-autocomplete-' + kitId);
        if (list) { list.style.display = 'none'; list.innerHTML = ''; }
    }, 140);
}

function _kitNSOrderPick(kitId, orderNumber, customerName) {
    const normalized = _kitNormalizeOrderNumber(orderNumber);
    if (!normalized) return;
    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateNewStyleDraft(kitId, function(d) {
        if (!d._meta.ordiniCliente.includes(normalized)) d._meta.ordiniCliente.push(normalized);
        d._meta.cliente = _kitResolveCustomerFromOrderRefs(d._meta.ordiniCliente, { [normalized]: customerName });
    });
    const inp = document.getElementById('kit-ns-ref-input-' + kitId);
    if (inp) inp.value = '';
    const list = document.getElementById('kit-ns-autocomplete-' + kitId);
    if (list) { list.style.display = 'none'; list.innerHTML = ''; }
}

function _kitNSOrderRemoveRef(kitId, orderNumber) {
    const normalized = _kitNormalizeOrderNumber(orderNumber);
    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateNewStyleDraft(kitId, function(d) {
        d._meta.ordiniCliente = d._meta.ordiniCliente.filter(function(r) { return r !== normalized; });
        d._meta.cliente = _kitResolveCustomerFromOrderRefs(d._meta.ordiniCliente);
    });
}

function _kitNSToggleSection(kitId, compIds, checked) {
    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateNewStyleDraft(kitId, function(d) {
        compIds.forEach(function(id) {
            if (checked) d._sel[id] = true;
            else delete d._sel[id];
        });
    });
}

function _kitNSToggleSectionChk(el) {
    try {
        const kitId = el.dataset.kitid;
        const compIds = JSON.parse(el.dataset.compids);
        _kitNSToggleSection(kitId, compIds, el.checked);
    } catch(e) {
        console.error('[kit] _kitNSToggleSectionChk error', e);
    }
}

function _kitNSReset(kitId) {
    if (!confirm('Azzerare la selezione corrente?')) return;
    const drafts = _kitLoadOrderDrafts();
    delete drafts[kitId];
    _kitSaveOrderDrafts(drafts);
    _kitRenderView();
}

/** Cosstruisce la distinta base per kit new-style */
function _kitBuildDistintaNew(kit, draft) {
    const units = Math.max(1, Number.parseInt(draft._units, 10) || 1);
    const sel = (draft._sel && typeof draft._sel === 'object') ? draft._sel : {};
    const sezioni = [];
    const avvisi = [];
    for (const sez of (kit.sezioni || [])) {
        const righe = [];
        for (const comp of (sez.componenti || [])) {
            if (!sel[comp.id]) continue;
            const qty = _kitParseQty(comp.qtaBase != null ? comp.qtaBase : 1) * units;
            righe.push({
                id: comp.id,
                nome: comp.nome,
                codice: String(comp.codice || '').trim(),
                totale: qty,
                unita: comp.unitaMisura || 'pz',
                dettaglio: '',
                noteConfig: comp.noteConfig || ''
            });
            if (comp.noteConfig) {
                avvisi.push({ id: 'note-' + comp.id, tipo: 'nota', nome: comp.nome, dettaglio: comp.noteConfig, totaleCoinvolto: qty, variantiLabel: '' });
            }
        }
        if (righe.length) sezioni.push({ id: sez.id, nome: sez.nome, righe });
    }
    return {
        selectedVarianti: [],
        sezioni,
        avvisi,
        totalePezzi: units,
        totaleRighe: sezioni.reduce(function(s, sez) { return s + sez.righe.length; }, 0),
        _isNewStyle: true
    };
}

/** Salva distinta per kit new-style */
function _kitNSCreateDistinta(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(function(k) { return k.id === kitId; });
    if (!kit) return;
    let nsDraft = _kitGetNewStyleDraft(kitId);
    const distinta = _kitBuildDistintaNew(kit, nsDraft);
    if (!distinta.totaleRighe) {
        notificaElegante('Seleziona almeno un componente per generare la distinta.', 'warning');
        return;
    }
    if (!nsDraft._meta.documento) {
        _kitMutateNewStyleDraft(kitId, function(d) { d._meta.documento = _kitGetNextDocumentNumber(); }, false);
        nsDraft = _kitGetNewStyleDraft(kitId);
    }
    const orderDraft = { _meta: nsDraft._meta };
    const distList = _kitLoadDistinte();
    distList.unshift({
        id: _uid(),
        kitId: kit.id,
        kitNome: kit.nome,
        nome: nsDraft._meta.documento || ('Distinta-' + Date.now()),
        documento: nsDraft._meta.documento || '',
        createdAt: Date.now(),
        createdBy: utenteAttuale?.nome || 'Sistema',
        orderDraftSnapshot: orderDraft,
        distintaSnapshot: distinta
    });
    _kitSaveDistinte(distList);
    notificaElegante('Distinta salvata ✓');
    if (_kitMainTab === 'distinte') _kitSwitchMainTab('distinte');
}

/** Anteprima stampa per kit new-style */
function _kitNSOpenPrintPreview(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(function(k) { return k.id === kitId; });
    if (!kit) return;
    let nsDraft = _kitGetNewStyleDraft(kitId);
    const distinta = _kitBuildDistintaNew(kit, nsDraft);
    if (!distinta.totaleRighe) {
        notificaElegante('Seleziona almeno un componente per generare l\'anteprima.', 'warning');
        return;
    }
    if (!nsDraft._meta.documento) {
        _kitMutateNewStyleDraft(kitId, function(d) { d._meta.documento = _kitGetNextDocumentNumber(); }, false);
        nsDraft = _kitGetNewStyleDraft(kitId);
    }
    const orderDraft = { _meta: nsDraft._meta };
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) { notificaElegante('Popup bloccato: abilita l\'anteprima di stampa.', 'warning'); return; }
    previewWindow.document.open();
    previewWindow.document.write(_kitBuildPrintPreviewHtml(kit, distinta, orderDraft));
    previewWindow.document.close();
    previewWindow.focus();
}

/** Vista operativa new-style: selezione componenti per categoria */
function _kitRenderViewNew(kit, contenitore) {
    const draft = _kitGetNewStyleDraft(kit.id);
    const units = draft._units;
    const sel = draft._sel;
    const distinta = _kitBuildDistintaNew(kit, draft);
    const meta = draft._meta;

    // Component selection per sezione
    const sezioni = kit.sezioni || [];
    const sezioniHtml = sezioni.map(function(sez) {
        const comps = sez.componenti || [];
        if (!comps.length) return '';
        const compsHtml = comps.map(function(comp) {
            const isChecked = !!sel[comp.id];
            const total = isChecked ? _kitParseQty(comp.qtaBase != null ? comp.qtaBase : 1) * units : 0;
            return `<label class="kit-ns-comp-row${isChecked ? ' kit-ns-comp-row--checked' : ''}">
                <input type="checkbox" class="kit-ns-check"${isChecked ? ' checked' : ''}
                    onchange="_kitNSToggleComp('${_esc(kit.id)}','${_esc(comp.id)}',this.checked)">
                <div class="kit-ns-comp-info">
                    <span class="kit-ns-comp-name">${_esc(comp.nome)}</span>
                    ${comp.codice ? `<span class="kit-ns-comp-code">· ${_esc(comp.codice)}</span>` : ''}
                    <span class="kit-ns-comp-qty-base">${_kitFormatQty(comp.qtaBase != null ? comp.qtaBase : 1)} ${comp.unitaMisura || 'pz'}/unità</span>
                </div>
                ${isChecked ? `<div class="kit-ns-comp-total">${_kitFormatQty(total)} ${comp.unitaMisura || 'pz'}</div>` : ''}
            </label>`;
        }).join('');
        const allChecked = comps.every(function(c) { return !!sel[c.id]; });
        const someChecked = comps.some(function(c) { return !!sel[c.id]; });
        const sezCompIdsAttr = _esc(JSON.stringify(comps.map(function(c){ return c.id; })));
        return `<div class="kit-ns-section">
            <div class="kit-ns-section-header">
                <span class="kit-ns-section-title">${_esc(sez.nome)}</span>
                <label class="kit-ns-sel-all" title="${allChecked ? 'Deseleziona tutto' : 'Seleziona tutto'}">
                    <input type="checkbox" class="kit-ns-check kit-ns-sel-all-chk"
                        data-kitid="${_esc(kit.id)}" data-compids="${sezCompIdsAttr}"
                        ${allChecked ? ' checked' : (someChecked ? ' data-indeterminate="true"' : '')}
                        onchange="_kitNSToggleSectionChk(this)">
                    <span>${allChecked ? 'Deseleziona tutto' : 'Seleziona tutto'}</span>
                </label>
            </div>
            <div class="kit-ns-comps">${compsHtml}</div>
        </div>`;
    }).join('');

    // Ordini cliente chips
    const ordiniClienteHtml = meta.ordiniCliente.length
        ? meta.ordiniCliente.map(function(orderNumber) {
            return `<span class="kit-order-ref-chip">${_esc(orderNumber)}
                <button type="button" class="kit-order-ref-chip-remove"
                    onclick='_kitNSOrderRemoveRef(${JSON.stringify(kit.id)},${JSON.stringify(orderNumber)})' aria-label="Rimuovi ordine">
                    <i class="fas fa-times"></i>
                </button>
            </span>`;
        }).join('')
        : '<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>';

    // Distinta preview
    const distintaHtml = distinta.totaleRighe
        ? distinta.sezioni.map(function(sezione) {
            return `<div class="kit-distinta-section">
                <div class="kit-distinta-section-title">${_esc(sezione.nome)}</div>
                ${sezione.righe.map(function(riga) {
                    return `<div class="kit-distinta-row">
                        <div class="kit-distinta-row-main">
                            <div class="kit-distinta-row-name">${_esc(riga.nome)}</div>
                            ${riga.codice ? `<div class="kit-distinta-row-meta">${_esc(riga.codice)}</div>` : ''}
                            ${riga.noteConfig ? `<div class="kit-distinta-row-note">${_esc(riga.noteConfig)}</div>` : ''}
                        </div>
                        <div class="kit-distinta-row-qty">${_kitFormatQty(riga.totale)} ${_esc(riga.unita)}</div>
                    </div>`;
                }).join('')}
            </div>`;
        }).join('')
        : '';

    contenitore.innerHTML = `
    <div class="kit-page">
        <div class="kit-view-header">
            <button type="button" class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${_esc(kit.nome)}</span>
            <button type="button" class="kit-gear-btn-inline" onclick="_kitOpenConfig('${_esc(kit.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <!-- Sommario + azioni -->
        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Distinta in composizione</div>
                    <div class="kit-order-summary-total">${units} unità · ${distinta.totaleRighe} materiali</div>
                </div>
                <div class="kit-order-summary-actions">
                    <button type="button" class="kit-btn-secondary" onclick="_kitNSOpenPrintPreview('${_esc(kit.id)}')"><i class="fas fa-print"></i> Anteprima stampa</button>
                    <button type="button" class="kit-cfg-add-btn" onclick="_kitNSCreateDistinta('${_esc(kit.id)}')"><i class="fas fa-save"></i> Salva distinta</button>
                    <button type="button" class="kit-btn-secondary" onclick="_kitNSReset('${_esc(kit.id)}')"><i class="fas fa-rotate-left"></i> Azzera</button>
                </div>
            </div>
            <div class="kit-order-summary-note">La selezione rimane locale sul dispositivo finché non salvi una distinta.</div>
        </div>

        <!-- Quante unità -->
        <div class="kit-ns-units-card">
            <div class="kit-ns-units-label">Quante unità vuoi produrre?</div>
            <div class="kit-order-stepper">
                <button type="button" class="kit-order-stepper-btn" onclick="_kitNSSetUnits('${_esc(kit.id)}',${units - 1})">−</button>
                <input class="kit-order-stepper-input" type="number" min="1" value="${units}"
                    onchange="_kitNSSetUnits('${_esc(kit.id)}',this.value)">
                <button type="button" class="kit-order-stepper-btn" onclick="_kitNSSetUnits('${_esc(kit.id)}',${units + 1})">+</button>
            </div>
        </div>

        <!-- Ordini cliente -->
        <div class="kit-order-meta-grid">
            <div class="kit-order-meta-card">
                <div class="kit-order-meta-title">Ordini cliente</div>
                <div class="ordine-autocomplete-wrapper kit-order-autocomplete-wrapper">
                    <input class="kit-order-meta-input" id="kit-ns-ref-input-${_esc(kit.id)}" type="text" placeholder="Cerca e collega un ordine cliente"
                        oninput="_kitNSOrderSearch('${_esc(kit.id)}',this.value)"
                        onfocus="_kitNSOrderSearch('${_esc(kit.id)}',this.value)"
                        onblur="_kitNSOrderHideSearch('${_esc(kit.id)}')">
                    <div id="kit-ns-autocomplete-${_esc(kit.id)}" class="ordine-autocomplete-list"></div>
                </div>
                <div class="kit-order-ref-list">${ordiniClienteHtml}</div>
            </div>
        </div>

        <!-- Selezione componenti -->
        <div class="kit-ns-comps-panel">
            ${sezioni.length
                ? `<div class="kit-ns-panel-title">Seleziona i componenti per questo ordine</div>${sezioniHtml}`
                : `<div class="kit-cfg-help">Questo kit non ha ancora componenti. <button type="button" class="btn-link-inline" onclick="_kitOpenConfig('${_esc(kit.id)}')">Apri configurazione</button></div>`
            }
        </div>

        <!-- Distinta anteprima -->
        ${distinta.totaleRighe ? `
        <div class="kit-ns-distinta-preview">
            <div class="kit-ns-panel-title" style="margin-bottom:8px">Riepilogo distinta (${distinta.totaleRighe} materiali · ${_kitFormatQty(units)} unità)</div>
            ${distintaHtml}
        </div>` : ''}
    </div>`;

    // Imposta indeterminate sulle checkbox di sezione parzialmente selezionate
    contenitore.querySelectorAll('[data-indeterminate="true"]').forEach(function(el) {
        el.indeterminate = true;
    });
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
        const pezziOrdine = _kitGetOrderQty(orderDraft, variante.key);
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
                codice: String(selection?.opzioneCodice || '').trim(),
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
    // Dispatch al builder new-style per kits senza assi configurazione
    if (_kitIsNewStyleKit(kit)) {
        return _kitBuildDistintaNew(kit, _kitGetNewStyleDraft(kit.id));
    }

    const selectedVarianti = _kitGetVariantiEffettive(kit).filter(variante => _kitGetOrderQty(orderDraft, variante.key) > 0);
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
                const pezziOrdine = _kitGetOrderQty(orderDraft, variante.key);
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
                codice: String(comp.codice || '').trim(),
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

function _kitFormatDateTime(value, withTime = true) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('it-IT', withTime
        ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function _kitGetPrintCompanyHeader() {
    return String(window._distintaHeaderAzienda || '').trim();
}

function _kitBuildPrintPreviewHtml(kit, distinta, orderDraft) {
    const generatedAt = new Date();
    const meta = _kitGetOrderMeta(orderDraft);
    const companyHeader = _kitGetPrintCompanyHeader();
    const docRef = String(meta.documento || '').trim();
    const companyHeaderHtml = companyHeader
        ? companyHeader.split(/\r?\n/).map(line => `<div>${_esc(line)}</div>`).join('')
        : '';
    const ordiniClienteLabel = meta.ordiniCliente.length > 1 ? 'Ordini cliente' : 'Ordine cliente';
    const ordiniClienteValue = meta.ordiniCliente.join(' · ');
    const selectedLinesHtml = distinta.selectedVarianti.length
        ? distinta.selectedVarianti.map(variante => {
            const qty = _kitGetOrderQty(orderDraft, variante.key);
            return `<tr>
                <td>${_esc(_kitFormatQty(qty))}</td>
                <td>${_esc(variante.nome)}</td>
            </tr>`;
        }).join('')
        : `<tr><td colspan="2">Nessuna configurazione selezionata.</td></tr>`;

    const rowsHtml = distinta.sezioni.map(sezione => {
        const sectionRows = sezione.righe.map(riga => {
            const note = [riga.dettaglio, riga.noteConfig].filter(Boolean).join(' · ');
            return `<tr>
                <td class="db-print-cell-ref">${_esc(String(riga.codice || '').trim())}</td>
                <td><div class="db-print-row-name">${_esc(riga.nome)}</div></td>
                <td class="db-print-cell-unit">${_esc(riga.unita)}</td>
                <td class="db-print-cell-qty">${_esc(_kitFormatQty(riga.totale))}</td>
                <td class="db-print-cell-note">${note ? _esc(note) : ''}</td>
            </tr>`;
        }).join('');

        return `<tr class="db-print-section-row"><td colspan="5">${_esc(sezione.nome)}</td></tr>${sectionRows}`;
    }).join('');

    const avvisiHtml = distinta.avvisi.length
        ? distinta.avvisi.map(avviso => `<div class="db-print-alert ${avviso.tipo === 'alert' ? 'db-print-alert--warning' : ''}">
                <div class="db-print-alert-title">${_esc(avviso.nome)}</div>
                <div>${_esc(avviso.dettaglio)}</div>
                <div class="db-print-alert-meta">Coinvolto su ${_esc(_kitFormatQty(avviso.totaleCoinvolto))} pz · ${_esc(avviso.variantiLabel)}</div>
            </div>`).join('')
        : '<div class="db-print-empty">Nessun avviso operativo collegato a questa distinta.</div>';

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distinta base - ${_esc(kit.nome)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Roboto:wght@400;500;700;800&display=swap" rel="stylesheet">
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
        html, body { margin: 0; padding: 0; background: var(--bg); font-family: 'Roboto', 'Segoe UI', sans-serif; color: var(--ink); }
        body { min-height: 100vh; font-size: 14px; }
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
        .db-print-toolbar-title { font-size: 14px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
        .db-print-toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .db-print-toolbar button {
            border: 1px solid rgba(255,255,255,0.16);
            background: #fff;
            color: #0f172a;
            border-radius: 999px;
            padding: 10px 16px;
            font-size: 13px;
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
            font-size: 13px;
            line-height: 1.55;
            color: var(--brand);
            white-space: pre-line;
        }
        .db-print-title-block {
            text-align: left;
            min-width: 240px;
        }
        .db-print-title {
            font-family: 'Lora', Georgia, serif;
            font-size: 46px;
            font-weight: 800;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            color: var(--accent);
            line-height: 1.05;
        }
        .db-print-subtitle {
            margin-top: 4px;
            font-size: 12px;
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
            font-size: 13px;
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
            font-size: 11px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 6px;
        }
        .db-print-strip-value {
            font-size: 19px;
            font-weight: 800;
            color: var(--accent);
        }
        .db-print-config-title,
        .db-print-materials-title,
        .db-print-alerts-title {
            font-size: 14px;
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
            font-size: 12px;
            vertical-align: top;
        }
        .db-print-config-table th,
        .db-print-table th {
            background: #f8fafc;
            text-align: left;
            font-size: 11px;
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
        .db-print-row-name { font-size: 13px; font-weight: 700; color: var(--ink); }
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
        .db-print-alert-title { font-size: 13px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
        .db-print-alert-meta { margin-top: 5px; font-size: 11px; color: var(--muted); }
        .db-print-empty { color: var(--muted); font-size: 12px; padding: 12px; border: 1px dashed var(--line); }
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
                <div class="db-print-title-block">
                    <div class="db-print-title">Distinta Base</div>
                    <div class="db-print-subtitle">Documento interno di produzione e approvvigionamento</div>
                </div>
                ${companyHeaderHtml ? `<div class="db-print-company" style="text-align:right">${companyHeaderHtml}</div>` : ''}
            </div>

            <div class="db-print-meta-grid">
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Prodotto</div><div class="db-print-meta-value">${_esc(kit.nome)}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Riferimento</div><div class="db-print-meta-value">${_esc(meta.cliente || '')}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Data emissione</div><div class="db-print-meta-value">${_esc(_kitFormatDateTime(generatedAt))}</div></div>
                </div>
                <div class="db-print-meta-card">
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Generato da</div><div class="db-print-meta-value">${_esc(utenteAttuale?.nome || 'Sistema')}</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Totale ordine</div><div class="db-print-meta-value">${_esc(_kitFormatQty(distinta.totalePezzi))} pz</div></div>
                    <div class="db-print-meta-row"><div class="db-print-meta-label">Righe materiali</div><div class="db-print-meta-value">${_esc(_kitFormatQty(distinta.totaleRighe))}</div></div>
                </div>
            </div>

            <div class="db-print-strip">
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Documento</div>
                    <div class="db-print-strip-value">${_esc(docRef)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">Prodotto</div>
                    <div class="db-print-strip-value">${_esc(kit.nome)}</div>
                </div>
                <div class="db-print-strip-cell">
                    <div class="db-print-strip-label">${_esc(ordiniClienteLabel)}</div>
                    <div class="db-print-strip-value">${_esc(ordiniClienteValue)}</div>
                </div>
            </div>

            <div class="db-print-materials-title">Materiali della distinta</div>
            <table class="db-print-table">
                <thead>
                    <tr>
                        <th style="width:72px">Rif.</th>
                        <th>Descrizione</th>
                        <th style="width:58px">Um</th>
                        <th style="width:90px">Quantità</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>

            <div class="db-print-alerts-title">Attenzioni operative</div>
            <div class="db-print-alerts">${avvisiHtml}</div>
        </div>
    </div>
</body>
</html>`;
}

function _kitOpenPrintPreview(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(entry => entry.id === kitId);
    if (!kit) return;

    let orderDraft = _kitGetOrderDraft(kit);
    const distinta = _kitBuildDistintaBase(kit, orderDraft);
    if (!distinta.totalePezzi || !distinta.totaleRighe) {
        notificaElegante('Componi prima un ordine per generare la distinta stampabile.', 'warning');
        return;
    }

    if (!_kitGetOrderMeta(orderDraft).documento) {
        _kitMutateOrderDraft(kitId, function(currentDraft) {
            _kitEnsureOrderDraftDocument(currentDraft);
        });
        orderDraft = _kitGetOrderDraft(kit);
    }

    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
        notificaElegante('Popup bloccato: abilita l\'anteprima di stampa per aprire il modello completo.', 'warning');
        return;
    }

    previewWindow.document.open();
    previewWindow.document.write(_kitBuildPrintPreviewHtml(kit, distinta, orderDraft));
    previewWindow.document.close();
    previewWindow.focus();
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
    if (!contenitore) return;

    // Top-level page with three main tabs: Kits / Anagrafiche / Distinte
    contenitore.innerHTML = `
    <div class="kit-page">
        <div class="acquisti-header header-flex">
            <div>
                <h3 class="acquisti-title"><i class="fas fa-toolbox" style="color:#6366f1;margin-right:6px;font-size:1.1rem"></i>Kit Prodotti</h3>
                <p class="acquisti-subtitle">Gestisci kit, componenti e distinte.</p>
            </div>
            <div id="kit-page-actions" class="acquisti-actions-wrapper"></div>
        </div>
        <div id="kit-tab-bar" style="display:flex;gap:4px;padding:8px 0 0">
            <button class="acq-tab ${_kitMainTab==='kits'?'active':''}" data-tab="kits" onclick="_kitSwitchMainTab('kits')"><i class="fas fa-boxes-stacked"></i> Kits</button>
            <button class="acq-tab ${_kitMainTab==='anagrafiche'?'active':''}" data-tab="anagrafiche" onclick="_kitSwitchMainTab('anagrafiche')"><i class="fas fa-list"></i> Anagrafiche</button>
            <button class="acq-tab ${_kitMainTab==='distinte'?'active':''}" data-tab="distinte" onclick="_kitSwitchMainTab('distinte')"><i class="fas fa-file-alt"></i> Distinte</button>
        </div>
        <div id="kit-main-content" class="kit-main-content" style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:0"></div>
    </div>`;

    // render selected sub-page
    _kitSwitchMainTab(_kitMainTab);
    _kitRenderHeaderActions();

    try {
        if (window && window._kitSuppressNextFade) {
            try { delete window._kitSuppressNextFade; } catch(e) {}
        } else {
            applicaFade(contenitore);
        }
    } catch(e) {
        applicaFade(contenitore);
    }
}

// helper di rendering per le tre pagine principali
function _kitRenderKitsGrid(kits, container) {
    if (!container) return;

    if (!kits.length) {
        container.innerHTML = `
        <div style="padding:40px 0;text-align:center">
            <i class="fas fa-box-open" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:16px;display:block"></i>
            <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun kit configurato.</p>
            <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Crea il primo kit</button>
        </div>`;
        return;
    }

    const UNITA = ['pz','mt','cm','mm','kg','g','lt','ml'];

    const kitsHtml = kits.map(kit => {
        const sezioni = kit.sezioni || [];
        const nComp = sezioni.reduce((s, z) => s + (z.componenti || []).length, 0);
        const nSez = sezioni.length;

        const sezioniHtml = sezioni.map(sez => {
            const comps = sez.componenti || [];
            const compHtml = comps.map(c => `
            <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #f8fafc">
                <span style="font-size:.84rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${_esc(c.nome)}">${_esc(c.nome)}${c.codice ? ` <span style="color:#94a3b8;font-size:.76rem">· ${_esc(c.codice)}</span>` : ''}</span>
                <input type="number" min="0" step="any" value="${c.qtaBase != null ? c.qtaBase : 1}"
                    class="input-field-modern" style="padding:4px 8px;font-size:.82rem;text-align:right"
                    onchange="_kitQUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(c.id)}','qtaBase',this.value)"
                    title="Quantità">
                <select class="input-field-modern" style="padding:4px 6px;font-size:.82rem"
                    onchange="_kitQUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(c.id)}','unitaMisura',this.value)">
                    ${UNITA.map(u => `<option value="${u}"${(c.unitaMisura||'pz')===u?' selected':''}>${u}</option>`).join('')}
                </select>
                <button type="button" class="btn-trash-modern" style="padding:4px 7px"
                    onclick="_kitQDelComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(c.id)}')" title="Rimuovi componente"><i class="fas fa-trash"></i></button>
            </div>`).join('');

            return `
            <details style="border-top:1px solid #f1f5f9" open>
                <summary style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;cursor:pointer;list-style:none;user-select:none;background:#fafafa;border-radius:0">
                    <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
                        <input type="text" value="${_esc(sez.nome)}"
                            class="input-field-modern" style="padding:3px 8px;font-size:.84rem;font-weight:600;max-width:200px;background:transparent;border:1px solid transparent"
                            onclick="event.preventDefault();event.stopPropagation()"
                            onfocus="this.style.background='#fff';this.style.border='1px solid #e2e8f0'"
                            onblur="this.style.background='transparent';this.style.border='1px solid transparent';_kitQRenomeSez('${_esc(kit.id)}','${_esc(sez.id)}',this.value)">
                        <span style="color:#94a3b8;font-size:.76rem;white-space:nowrap">${comps.length} comp.</span>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;flex-shrink:0">
                        <button type="button" class="btn-trash-modern" style="padding:3px 7px;font-size:.75rem"
                            onclick="event.preventDefault();event.stopPropagation();_kitQDelSez('${_esc(kit.id)}','${_esc(sez.id)}')" title="Rimuovi sezione"><i class="fas fa-trash"></i></button>
                        <i class="fas fa-chevron-down" style="color:#94a3b8;font-size:.75rem;transition:transform .2s"></i>
                    </div>
                </summary>
                <div style="padding:4px 12px 8px">
                    ${comps.length ? `
                    <div style="display:grid;grid-template-columns:1fr 90px 80px 32px;gap:6px;padding:4px 0 2px;border-bottom:2px solid #e2e8f0;margin-bottom:2px">
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em">Componente</span>
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;text-align:right">Qty</span>
                        <span style="font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase">Unità</span>
                        <span></span>
                    </div>
                    ${compHtml}` : `<p style="color:#94a3b8;font-size:.82rem;padding:6px 0">Nessun componente.</p>`}
                    <button type="button" class="btn-archive-action" style="margin-top:8px;font-size:.8rem"
                        onclick="_kitQAddCompOpen('${_esc(kit.id)}','${_esc(sez.id)}')">
                        <i class="fas fa-plus"></i> Aggiungi componente
                    </button>
                </div>
            </details>`;
        }).join('');

        return `
        <details class="ordine-group" style="margin-bottom:8px">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore" style="font-size:1rem">${_esc(kit.nome)}</span>
                    <span style="color:#94a3b8;font-size:.78rem;font-weight:500;margin-left:8px">${nSez} sez. · ${nComp} comp.</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center">
                    <button type="button" class="btn-archive-action primary" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenView('${_esc(kit.id)}')" title="Usa kit / crea ordine">
                        <i class="fas fa-play"></i> Usa
                    </button>
                    <button type="button" class="btn-archive-action" style="font-size:.78rem;padding:4px 10px"
                        onclick="event.preventDefault();event.stopPropagation();_kitOpenConfig('${_esc(kit.id)}')" title="Configurazione avanzata">
                        <i class="fas fa-gear"></i> Config
                    </button>
                    <button type="button" class="btn-trash-modern"
                        onclick="event.preventDefault();event.stopPropagation();_kitQDelKit('${_esc(kit.id)}')" title="Elimina kit">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-down og-chevron"></i>
                </div>
            </summary>
            <div class="ordine-items" style="padding:0">
                ${sezioni.length
                    ? sezioniHtml
                    : `<p class="acquisti-subtitle" style="padding:12px 16px;margin:0">Nessuna sezione. Aggiungi una sezione per iniziare.</p>`}
                <div style="padding:8px 12px;border-top:1px solid #f1f5f9">
                    <button type="button" class="btn-archive-action" style="font-size:.8rem"
                        onclick="_kitQAddSezOpen('${_esc(kit.id)}')">
                        <i class="fas fa-folder-plus"></i> Aggiungi sezione
                    </button>
                </div>
            </div>
        </details>`;
    }).join('');

    container.innerHTML = kitsHtml;
}

    function _kitRenderHeaderActions() {
        const actions = document.getElementById('kit-page-actions');
        if (!actions) return;
        if (_kitMainTab === 'kits') {
            actions.innerHTML = `<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenCreaKit()"><i class="fas fa-plus"></i> Nuovo Kit</button>`;
        } else if (_kitMainTab === 'anagrafiche') {
            actions.innerHTML = `<button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi</button>`;
        } else {
            actions.innerHTML = '';
        }
    }

function _kitSwitchMainTab(tab) {
    _kitMainTab = tab;
    document.querySelectorAll('#kit-tab-bar .acq-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    const { kits } = _kitLoad();
    const content = document.getElementById('kit-main-content');
    if (!content) return;
    if (tab === 'kits') _kitRenderKitsGrid(kits, content);
    else if (tab === 'anagrafiche') _kitRenderAnagrafichePage(kits, content);
    else if (tab === 'distinte') _kitRenderDistintePage(kits, content);
    _kitRenderHeaderActions();
}

function _kitRenderAnagrafichePage(kits, container) {
    if (!container) return;
    const anag = _kitLoadAnagrafiche();
    if (!anag.length) {
        container.innerHTML = `
            <div style="padding:24px 0;text-align:center">
                <p class="acquisti-subtitle" style="margin-bottom:16px">Nessun componente salvato. Aggiungi il primo componente riutilizzabile.</p>
                <button type="button" class="btn-modal-send" style="font-size:0.8rem;padding:8px 14px" onclick="_kitOpenAnagraficaModal()"><i class="fas fa-plus"></i> Aggiungi componente</button>
            </div>`;
        return;
    }

    // group by category
    const groups = anag.reduce((acc, item) => { const cat = item.categoria || 'Senza categoria'; acc[cat] = acc[cat] || []; acc[cat].push(item); return acc; }, {});
    let html = '';
    for (const [cat, items] of Object.entries(groups)) {
        html += `<details class="ordine-group" open>
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${_esc(cat)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${items.length} componente${items.length !== 1 ? 'i' : ''}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">`;
        html += items.map(item => `
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        <div style="font-weight:600;color:#1e293b">${_esc(item.nome)}${item.codice ? ` <span style="color:#94a3b8;font-size:.85rem;font-weight:400">· ${_esc(item.codice)}</span>` : ''}</div>
                        ${item.descrizione ? `<div style="color:#94a3b8;font-size:.82rem;margin-top:2px">${_esc(item.descrizione)}</div>` : ''}
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitOpenAnagraficaModal('${_esc(item.id)}')"><i class="fas fa-pen"></i> Modifica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questo componente?')) _kitDeleteAnagrafica('${_esc(item.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`).join('');
        html += `</div></details>`;
    }
    container.innerHTML = html;
}

function _kitRenderDistintePage(kits, container) {
    if (!container) return;
    const distinte = _kitLoadDistinte();
    if (!distinte.length) {
        container.innerHTML = `<div style="padding:24px 0;text-align:center"><p class="acquisti-subtitle">Nessuna distinta salvata.</p></div>`;
        return;
    }
    const rowsHtml = distinte.map(d => `
        <details class="ordine-group">
            <summary class="ordine-group-summary">
                <div class="og-left">
                    <span class="og-operatore">${_esc(d.nome)}</span>
                    <span style="color:#94a3b8;font-size:0.8rem;font-weight:500;margin-left:8px">${_esc(d.kitNome || '')}</span>
                </div>
                <i class="fas fa-chevron-down og-chevron"></i>
            </summary>
            <div class="ordine-items">
                <div class="ordine-item" style="display:flex;justify-content:space-between;align-items:center">
                    <div style="flex:1;min-width:0">
                        ${d.documento ? `<div style="font-size:.85rem;color:#64748b">${_esc(d.documento)}</div>` : ''}
                        <div style="color:#94a3b8;font-size:0.8rem;margin-top:2px">${_esc(new Date(d.createdAt).toLocaleString())} · ${_esc(d.createdBy)}</div>
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:12px">
                        <button type="button" class="btn-archive-action primary" onclick="_kitDistintaOpenPrint('${_esc(d.id)}')"><i class="fas fa-print"></i> Stampa</button>
                        <button type="button" class="btn-archive-action" onclick="_kitDistintaApplyToDraft('${_esc(d.id)}')"><i class="fas fa-file-import"></i> Applica</button>
                        <button type="button" class="btn-trash-modern" onclick="(function(){ if(confirm('Eliminare questa distinta?')) _kitDistintaDelete('${_esc(d.id)}') })()" title="Elimina"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </details>`).join('');
    container.innerHTML = rowsHtml;
}

function _kitCreateDistintaFromDraft(kitId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) { notificaElegante('Kit non trovato ⚠️'); return; }
    let orderDraft = _kitGetOrderDraft(kit);
    if (!_kitGetOrderMeta(orderDraft).documento) {
        _kitMutateOrderDraft(kitId, function(currentDraft) { _kitEnsureOrderDraftDocument(currentDraft); });
        orderDraft = _kitGetOrderDraft(kit);
    }
    const distinta = _kitBuildDistintaBase(kit, orderDraft);
    if (!distinta.totalePezzi || !distinta.totaleRighe) {
        notificaElegante('Componi prima un ordine per generare la distinta stampabile.', 'warning'); return;
    }
    const distList = _kitLoadDistinte();
    const meta = _kitGetOrderMeta(orderDraft);
    const saved = {
        id: _uid(),
        kitId: kit.id,
        kitNome: kit.nome,
        nome: meta.documento || `Distinta-${Date.now()}`,
        documento: meta.documento || '',
        createdAt: Date.now(),
        createdBy: utenteAttuale?.nome || 'Sistema',
        orderDraftSnapshot: orderDraft,
        distintaSnapshot: distinta
    };
    distList.unshift(saved);
    _kitSaveDistinte(distList);
    notificaElegante('Distinta salvata ✓');
    if (_kitMainTab === 'distinte') _kitSwitchMainTab('distinte');
}

// ─── Anagrafiche (componenti) ───────────────────────────────────────────────
function _kitLoadAnagrafiche() {
    try {
        const raw = localStorage.getItem(_KIT_ANAGRAFICHE_LS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
}

function _kitSaveAnagrafiche(items) {
    try {
        localStorage.setItem(_KIT_ANAGRAFICHE_LS_KEY, JSON.stringify(items || []));
        try { localStorage.setItem(_KIT_ANAGRAFICHE_LS_TS, Date.now()); } catch {}
    } catch {}
}

function _kitEnsureAnagraficaModal() {
    if (document.getElementById('modal-kit-anagrafica-edit')) return;
    const div = document.createElement('div');
    div.innerHTML = `
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
    </div>`;
    document.body.appendChild(div.firstElementChild);
}

function _kitOpenAnagraficaModal(editId) {
    _kitEnsureAnagraficaModal();
    const modal = document.getElementById('modal-kit-anagrafica-edit');
    if (!modal) return;
    const nome = document.getElementById('anag-componente');
    const codice = document.getElementById('anag-codice');
    const categoria = document.getElementById('anag-categoria');
    const descrizione = document.getElementById('anag-descrizione');
    if (editId) {
        const item = _kitLoadAnagrafiche().find(a => a.id === editId);
        if (item) {
            if (nome) nome.value = item.nome || '';
            if (codice) codice.value = item.codice || '';
            if (categoria) categoria.value = item.categoria || '';
            if (descrizione) descrizione.value = item.descrizione || '';
            modal.dataset.editId = editId;
        }
    } else {
        if (nome) nome.value = '';
        if (codice) codice.value = '';
        if (categoria) categoria.value = '';
        if (descrizione) descrizione.value = '';
        delete modal.dataset.editId;
    }
    modal.style.display = 'flex';
    modal.offsetHeight; // forza reflow per attivare la transizione CSS
    modal.classList.add('active');
    setTimeout(() => nome && nome.focus(), 80);
}

function _kitCloseAnagraficaModal() {
    const modal = document.getElementById('modal-kit-anagrafica-edit');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

function _kitConfirmSaveAnagrafica() {
    const modal = document.getElementById('modal-kit-anagrafica-edit');
    if (!modal) return;
    const editId = modal.dataset.editId;
    const nome = (document.getElementById('anag-componente')?.value || '').trim();
    if (!nome) { notificaElegante('Inserisci il nome del componente', 'warning'); return; }
    const codice = (document.getElementById('anag-codice')?.value || '').trim();
    const categoria = (document.getElementById('anag-categoria')?.value || '').trim();
    const descrizione = (document.getElementById('anag-descrizione')?.value || '').trim();
    const items = _kitLoadAnagrafiche();
    if (editId) {
        const idx = items.findIndex(i => i.id === editId);
        if (idx !== -1) {
            items[idx] = { ...items[idx], nome, codice, categoria, descrizione, updatedAt: Date.now() };
        } else {
            items.unshift({ id: _uid(), nome, codice, categoria, descrizione, createdAt: Date.now(), createdBy: utenteAttuale?.nome || 'Sistema' });
        }
    } else {
        items.unshift({ id: _uid(), nome, codice, categoria, descrizione, createdAt: Date.now(), createdBy: utenteAttuale?.nome || 'Sistema' });
    }
    _kitSaveAnagrafiche(items);
    _kitCloseAnagraficaModal();
    notificaElegante('Componente salvato ✓');
    if (_kitMainTab === 'anagrafiche') _kitSwitchMainTab('anagrafiche');
}

function _kitDeleteAnagrafica(id) {
    const next = _kitLoadAnagrafiche().filter(a => a.id !== id);
    _kitSaveAnagrafiche(next);
    if (_kitMainTab === 'anagrafiche') _kitSwitchMainTab('anagrafiche');
    notificaElegante('Componente eliminato ✓');
}

function _kitDistintaOpenPrint(distId) {
    const dist = _kitLoadDistinte().find(d => d.id === distId);
    if (!dist) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === dist.kitId) || null;
    if (kit) {
        const previewWindow = window.open('', '_blank');
        if (!previewWindow) { notificaElegante('Popup bloccato: abilita l\'anteprima di stampa per aprire il modello completo.', 'warning'); return; }
        previewWindow.document.open();
        try {
            previewWindow.document.write(_kitBuildPrintPreviewHtml(kit, dist.distintaSnapshot, dist.orderDraftSnapshot));
        } catch(e) {
            previewWindow.document.write('<pre>' + _esc(JSON.stringify(dist.distintaSnapshot, null, 2)) + '</pre>');
        }
        previewWindow.document.close();
        previewWindow.focus();
    } else {
        const previewWindow = window.open('', '_blank');
        if (!previewWindow) { notificaElegante('Popup bloccato', 'warning'); return; }
        previewWindow.document.open();
        previewWindow.document.write('<pre>' + _esc(JSON.stringify(dist.distintaSnapshot, null, 2)) + '</pre>');
        previewWindow.document.close();
        previewWindow.focus();
    }
}

function _kitDistintaApplyToDraft(distId) {
    const dist = _kitLoadDistinte().find(d => d.id === distId);
    if (!dist) return;
    const drafts = _kitLoadOrderDrafts();
    drafts[dist.kitId] = dist.orderDraftSnapshot || {};
    _kitSaveOrderDrafts(drafts);
    notificaElegante('Bozza ordine ripristinata per il kit selezionato ✓');
}

function _kitDistintaDelete(distId) {
    const next = _kitLoadDistinte().filter(d => d.id !== distId);
    _kitSaveDistinte(next);
    if (_kitMainTab === 'distinte') _kitSwitchMainTab('distinte');
    notificaElegante('Distinta eliminata ✓');
}

// ═════════════════════════════════════════════════════════════════════════====
// VISTA OPERATIVA DI UN KIT (4 tab: BOM / Pronti / Movimenti / Spedizione)
// ═════════════════════════════════════════════════════════════════════════====

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

    // Kits senza assi configurazione usano il flusso new-style
    if (_kitIsNewStyleKit(kit)) {
        _kitRenderViewNew(kit, contenitore);
        return;
    }
    const varsList = _kitGetVariantiEffettive(kit);
    const orderDraft = _kitGetOrderDraft(kit);
    const draftMeta = _kitGetOrderMeta(orderDraft);
    const distinta = _kitBuildDistintaBase(kit, orderDraft);

    const ordineBadgesHtml = distinta.selectedVarianti.length
        ? distinta.selectedVarianti.map(variante => `<span class="kit-meta-pill"><strong>${_kitGetOrderQty(orderDraft, variante.key)}</strong> × ${_esc(variante.nome)}</span>`).join('')
        : '<span class="kit-leg-item" style="color:#94a3b8">Nessuna configurazione selezionata.</span>';

    const ordiniClienteHtml = draftMeta.ordiniCliente.length
        ? draftMeta.ordiniCliente.map(orderNumber => `<span class="kit-order-ref-chip">${_esc(orderNumber)}
                <button type="button" class="kit-order-ref-chip-remove" onclick='_kitOrderRemoveRef(${JSON.stringify(kit.id)}, ${JSON.stringify(orderNumber)})' aria-label="Rimuovi ordine ${_esc(orderNumber)}">
                    <i class="fas fa-times"></i>
                </button>
            </span>`).join('')
        : '<div class="kit-order-meta-empty">Nessun ordine cliente collegato.</div>';

    const composeState = _kitGetComposeState(kit);
    const composedVariant = _kitFindVariantFromComposeState(kit, composeState);
    const composeGroupsHtml = (kit.assiConfigurazione || []).length
        ? (kit.assiConfigurazione || []).map(asse => `
            <div class="kit-compose-group">
                <div class="kit-compose-group-title">${_esc(asse.nome)}</div>
                <div class="kit-compose-options">${(asse.opzioni || []).map(opzione => `
                        <button type="button" class="kit-compose-option ${composeState[asse.id] === opzione.id ? 'kit-compose-option--active' : ''}"
                            onclick="_kitComposeSelect('${_esc(kit.id)}','${_esc(asse.id)}','${_esc(opzione.id)}')">
                        ${_esc(opzione.nome)}
                    </button>`).join('')}</div>
            </div>`).join('')
        : `<div class="kit-cfg-help">Questo prodotto non ha elettronica selezionabile: puoi usarlo come prodotto fisso.</div>`;

    const orderLinesHtml = distinta.selectedVarianti.length
        ? distinta.selectedVarianti.map(variante => {
            const qty = _kitGetOrderQty(orderDraft, variante.key);
            return `<div class="kit-order-line">
                <div class="kit-order-line-main">
                    <div class="kit-order-line-name">${_esc(variante.nome)}</div>
                    <div class="kit-order-line-meta">${Array.isArray(variante.selections) && variante.selections.length ? variante.selections.map(selection => _esc(selection.opzioneNome)).join(' · ') : _esc(variante.key)}</div>
                </div>
                <div class="kit-order-stepper">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${_esc(kit.id)}','${_esc(variante.key)}',-1)">−</button>
                    <input class="kit-order-stepper-input" type="number" min="0" value="${qty}"
                           onchange="_kitOrdineSet('${_esc(kit.id)}','${_esc(variante.key)}',this.value)"
                           oninput="_kitOrdineSet('${_esc(kit.id)}','${_esc(variante.key)}',this.value)">
                    <button type="button" class="kit-order-stepper-btn" onclick="_kitOrdineDelta('${_esc(kit.id)}','${_esc(variante.key)}',1)">+</button>
                    <button type="button" class="kit-cfg-del-btn" style="font-size:1rem" onclick="_kitOrdineResetVoce('${_esc(kit.id)}','${_esc(variante.key)}')"><i class="fas fa-times"></i></button>
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
                        <div class="kit-distinta-row-qty">${_kitFormatQty(riga.totale)} ${_esc(riga.unita)}</div>
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
            <button type="button" class="kit-back-btn" onclick="_kitBack()"><i class="fas fa-arrow-left"></i></button>
            <span class="kit-view-nome">${_esc(kit.nome)}</span>
            <button type="button" class="kit-gear-btn-inline" onclick="_kitOpenConfig('${_esc(kit.id)}')" title="Configura"><i class="fas fa-gear"></i></button>
        </div>

        <div class="kit-order-summary">
            <div class="kit-order-summary-top">
                <div>
                    <div class="kit-order-summary-label">Ordine in composizione</div>
                    <div class="kit-order-summary-total">${distinta.totalePezzi} pezzi</div>
                </div>
                <div class="kit-order-summary-actions">
                        <button type="button" class="kit-btn-secondary" onclick="_kitOpenPrintPreview('${_esc(kit.id)}')"><i class="fas fa-print"></i> Anteprima stampa</button>
                        <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenSaveDistintaModal('${_esc(kit.id)}')"><i class="fas fa-save"></i> Salva distinta</button>
                        <button type="button" class="kit-btn-secondary" onclick="_kitOrdineReset('${_esc(kit.id)}')"><i class="fas fa-rotate-left"></i> Azzera ordine</button>
                </div>
            </div>
            <div class="kit-order-summary-note">Questa bozza ordine resta locale sul dispositivo e serve solo per generare la distinta base di approvvigionamento.</div>
            <div class="kit-order-meta-grid">
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Ordini cliente</div>
                    <div class="ordine-autocomplete-wrapper kit-order-autocomplete-wrapper">
                        <input class="kit-order-meta-input" id="kit-order-ref-input-${_esc(kit.id)}" type="text" placeholder="Cerca e collega un ordine cliente"
                               oninput="_kitOrderSearch('${_esc(kit.id)}', this.value)"
                               onfocus="_kitOrderSearch('${_esc(kit.id)}', this.value)"
                               onblur="_kitOrderHideSearch('${_esc(kit.id)}')">
                        <div id="kit-order-autocomplete-${_esc(kit.id)}" class="ordine-autocomplete-list"></div>
                    </div>
                    <div class="kit-order-ref-list">${ordiniClienteHtml}</div>
                    <div class="kit-order-meta-help">Il cliente viene derivato dagli ordini selezionati. Se gli ordini appartengono a clienti diversi, in stampa il riferimento resta vuoto.</div>
                </div>
                <div class="kit-order-meta-card">
                    <div class="kit-order-meta-title">Dati stampa</div>
                    <div class="kit-order-meta-row"><span>Cliente</span><strong>${_esc(draftMeta.cliente || '')}</strong></div>
                    <div class="kit-order-meta-row"><span>Documento</span><strong>${_esc(draftMeta.documento || '')}</strong></div>
                </div>
            </div>
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
                            <button type="button" class="kit-spedisci-btn" onclick="_kitComposeAdd('${_esc(kit.id)}')"><i class="fas fa-plus"></i> Aggiungi all'ordine</button>
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
    _kitEnsureOrderLookupCache().catch(() => {});
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
    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        orderDraft[vKey] = Math.max(0, Number.parseInt(value, 10) || 0);
    });
}

function _kitOrdineDelta(kitId, vKey, delta) {
    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        const currentQty = Math.max(0, Number.parseInt(orderDraft[vKey], 10) || 0);
        orderDraft[vKey] = Math.max(0, currentQty + delta);
    });
}

function _kitOrdineReset(kitId) {
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        for (const key of Object.keys(orderDraft)) {
            if (key === '_meta') continue;
            orderDraft[key] = 0;
        }
        orderDraft._meta = _kitNormalizeOrderMeta({});
    });
}

function _kitOrdineResetVoce(kitId, vKey) {
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        orderDraft[vKey] = 0;
    });
}

function _kitRenderOrderAutocompleteList(kitId, matches) {
    const list = document.getElementById('kit-order-autocomplete-' + kitId);
    if (!list) return;
    if (!matches.length) {
        list.style.display = 'none';
        list.innerHTML = '';
        return;
    }

    list.innerHTML = matches.map(item => `
        <div class="autocomplete-item" onmousedown='_kitOrderPick(${JSON.stringify(kitId)}, ${JSON.stringify(item.ordine)}, ${JSON.stringify(item.cliente)})'>
            <span class="ac-ordine">ORD. ${_esc(item.ordine)}</span>
            <span class="ac-cliente">${_esc(item.cliente)}</span>
        </div>
    `).join('');
    list.style.display = 'block';
}

function _kitOrderSearch(kitId, rawQuery) {
    const query = String(rawQuery || '').trim().toLowerCase();
    if (!query) {
        _kitRenderOrderAutocompleteList(kitId, []);
        return;
    }

    _kitEnsureOrderLookupCache().then(function(cache) {
        const matches = cache
            .filter(item => item.ordine.toLowerCase().includes(query) || item.cliente.toLowerCase().includes(query))
            .slice(0, 8);
        _kitRenderOrderAutocompleteList(kitId, matches);
    });
}

function _kitOrderHideSearch(kitId) {
    setTimeout(function() {
        _kitRenderOrderAutocompleteList(kitId, []);
    }, 140);
}

function _kitOrderPick(kitId, orderNumber, customerName) {
    const normalizedOrder = _kitNormalizeOrderNumber(orderNumber);
    if (!normalizedOrder) return;

    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        const meta = _kitGetOrderMeta(orderDraft);
        meta.ordiniCliente = [...new Set(meta.ordiniCliente.concat(normalizedOrder))];
        meta.cliente = _kitResolveCustomerFromOrderRefs(meta.ordiniCliente, { [normalizedOrder]: customerName });
        _kitSetOrderMeta(orderDraft, meta);
    });

    const input = document.getElementById('kit-order-ref-input-' + kitId);
    if (input) input.value = '';
    _kitRenderOrderAutocompleteList(kitId, []);
}

function _kitOrderRemoveRef(kitId, orderNumber) {
    const normalizedOrder = _kitNormalizeOrderNumber(orderNumber);
    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        const meta = _kitGetOrderMeta(orderDraft);
        meta.ordiniCliente = meta.ordiniCliente.filter(item => item !== normalizedOrder);
        meta.cliente = _kitResolveCustomerFromOrderRefs(meta.ordiniCliente);
        _kitSetOrderMeta(orderDraft, meta);
    });
}

function _kitComposeSelect(kitId, asseId, opzioneId) {
    const { kits } = _kitLoad();
    const kit = kits.find(entry => entry.id === kitId);
    if (!kit) return;
    const nextState = _kitGetComposeState(kit);
    nextState[asseId] = opzioneId;
    _kitComposeState[kitId] = nextState;
    // evitare la breve animazione/fade quando la selezione è un'interazione locale
    if (_kitViewId === kitId) {
        try { window._kitSuppressNextFade = true; } catch(e) {}
        _kitRenderView();
    }
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

    // Protezione anti-duplica: ignora chiamate ripetute ravvicinate
    if (_kitComposeAddLock[kitId]) {
        return;
    }
    _kitComposeAddLock[kitId] = Date.now();
    setTimeout(function() { try { delete _kitComposeAddLock[kitId]; } catch(e) {} }, 600);

    try { window._kitSuppressNextFade = true; } catch(e) {}
    _kitMutateOrderDraft(kitId, function(orderDraft) {
        orderDraft[variant.key] = _kitGetOrderQty(orderDraft, variant.key) + qty;
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
                ? `<button type="button" class="kit-mov-del" onclick="_kitEliminaMovimento('${_esc(kit.id)}',${m.id})" title="Elimina">✕</button>`
            : '<span style="width:22px;flex-shrink:0"></span>';
            const editBtn = (canEdit && (m.tipo==='carico'||m.tipo==='scarico'))
                ? `<button type="button" class="kit-mov-edit" onclick="_kitModificaMovimento('${_esc(kit.id)}',${m.id})" title="Modifica">✎</button>`
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
let _kitPresetState = null;

// ─── Quick-compose state ─────────────────────────────────────────────────────
let _kitQAddState = { kitId: null, sezId: null };

// ─── Config Modal state ───────────────────────────────────────────────────────
let _kitConfigModalId  = null;

// ─── Config Modal — apri / chiudi ─────────────────────────────────────────────
function _kitOpenConfigModal(kitId) {
    _kitConfigModalId  = kitId;
    const modal = document.getElementById('modal-kit-config');
    if (!modal) return;
    _kitRenderConfigModal();
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}

function _kitCloseConfigModal() {
    const modal = document.getElementById('modal-kit-config');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
    _kitConfigModalId = null;
}

function _kitCfgModalSaveNome(el) {
    if (!_kitConfigModalId) return;
    const val = (el?.value || '').trim();
    if (!val) return;
    _kitCfgMutate(_kitConfigModalId, kit => { kit.nome = val; }, false);
    // aggiorna anche la card nella griglia se visibile
    _kitSwitchMainTab('kits');
}

// ─── Config Modal — renderer principale ──────────────────────────────────────
function _kitRenderConfigModal() {
    if (!_kitConfigModalId) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitConfigModalId);
    if (!kit) return;
    const anag  = _kitLoadAnagrafiche();
    const UNITA = ['pz','mt','cm','mm','kg','g','lt','ml'];

    // ── nome kit ──
    const nomeEl = document.getElementById('kit-cfg-modal-nome');
    if (nomeEl) nomeEl.value = kit.nome || '';

    // ── dati base ──
    const cats = [...new Set(anag.map(a => (a.categoria || '').trim()).filter(Boolean))].sort();
    const CAT_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#14b8a6','#f97316','#84cc16'];
    const catColor   = cat => CAT_COLORS[cats.indexOf(cat) % CAT_COLORS.length] || '#94a3b8';

    const sezioni     = kit.sezioni || [];
    const allKitComps = sezioni.flatMap(sez => (sez.componenti || []).map(comp => ({ comp, sez })));

    function getCompAnag(comp) {
        return anag.find(a => a.nome === comp.nome && (!comp.codice || !a.codice || a.codice === comp.codice))
            || anag.find(a => a.nome === comp.nome);
    }

    // ── sezione 1: lista tabulare componenti nel kit ──
    let listHtml;
    if (allKitComps.length === 0) {
        listHtml = `<div class="kcfg-empty">
            <i class="fas fa-inbox" style="font-size:1.3rem;display:block;margin-bottom:6px;opacity:.35"></i>
            Nessun componente ancora. Aggiungili dal catalogo qui sotto.
        </div>`;
    } else {
        listHtml = `<div class="kcfg-list">` +
            allKitComps.map(({ comp, sez }) => {
                const a        = getCompAnag(comp);
                const cat      = a ? (a.categoria || '').trim() : '';
                const dot      = cat ? catColor(cat) : '#e2e8f0';
                const unitVal  = _kitNormalizeUnit(comp.unitaMisura, 'pz');
                const unitsHtml = UNITA.map(u => `<option value="${u}"${unitVal===u?' selected':''}>${u}</option>`).join('');
                return `<div class="kcfg-comp-row">
                    <span class="kcfg-dot" style="background:${dot}"></span>
                    <span class="kcfg-name">${_esc(comp.nome)}${comp.codice ? `<span class="kcfg-code">&middot;&thinsp;${_esc(comp.codice)}</span>` : ''}</span>
                    <input type="number" min="0" step="any" class="input-field-modern kcfg-qty"
                        value="${comp.qtaBase ?? 1}" title="Quantit&#224;"
                        onchange="_kitCfgModalUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','qtaBase',this.value)">
                    <select class="input-field-modern kcfg-unit"
                        onchange="_kitCfgModalUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','unitaMisura',this.value)">
                        ${unitsHtml}
                    </select>
                    <button type="button" class="btn-trash-modern" style="width:28px;height:28px;flex-shrink:0"
                        onclick="_kitCfgModalDelComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}')">
                        <i class="fas fa-times" style="font-size:.75rem"></i>
                    </button>
                </div>`;
            }).join('') + `</div>`;
    }

    // ── sezione 2: pill per aggiungere dal catalogo ──
    const inKitNames = new Set(allKitComps.map(({ comp }) => comp.nome));
    let catalogHtml  = '';

    if (anag.length === 0) {
        catalogHtml = `<div class="kcfg-empty" style="background:#fef3c7;border-color:#fde68a;color:#92400e;text-align:left">
            <i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>
            Catalogo vuoto. Vai nella tab <strong>Anagrafiche</strong> per aggiungere componenti.
        </div>`;
    } else {
        const strips = cats.map(cat => {
            const avail = anag.filter(a => (a.categoria || '').trim() === cat && !inKitNames.has(a.nome));
            if (avail.length === 0) return '';
            const color = catColor(cat);
            const pills = avail.map(a =>
                `<button type="button" class="kcfg-pill"
                    onclick="_kitCfgModalAddAnag('${_esc(kit.id)}','${_esc(a.id)}')"
                    title="Aggiungi ${_esc(a.nome)}">
                    <i class="fas fa-plus" style="font-size:.58rem;opacity:.6;margin-right:3px"></i>${_esc(a.nome)}${a.codice ? `<span class="kcfg-pill-code">${_esc(a.codice)}</span>` : ''}
                </button>`
            ).join('');
            return `<div class="kcfg-cat-strip">
                <span class="kcfg-cat-badge" style="--kcfg-dot:${color}">${_esc(cat)}</span>
                <div class="kcfg-pills">${pills}</div>
            </div>`;
        }).filter(Boolean).join('');

        catalogHtml = strips
            || `<p style="color:#94a3b8;font-size:.82rem;margin:4px 0;padding:6px 2px">
                   <i class="fas fa-check-circle" style="color:#10b981;margin-right:5px"></i>
                   Tutti i componenti del catalogo sono gi&#224; nel kit.
               </p>`;
    }

    const panel = document.getElementById('kit-cfg-modal-bom-panel');
    if (!panel) return;

    panel.innerHTML = `
        <div class="kcfg-section-lbl">Nel kit (${allKitComps.length})</div>
        ${listHtml}
        ${anag.length > 0 ? `
        <div class="kcfg-section-lbl" style="margin-top:18px">Aggiungi dal catalogo</div>
        <div style="padding:2px 0">${catalogHtml}</div>` : catalogHtml}
        <div style="margin-top:14px;padding-top:10px;border-top:1px solid #f1f5f9">
            <button type="button" class="btn-add-dashed" style="font-size:.79rem;padding:8px 14px;border-radius:10px"
                onclick="_kitCfgModalAddCompFree()">
                <i class="fas fa-pen" style="margin-right:6px;opacity:.55"></i>Aggiungi componente manuale
            </button>
        </div>`;
}


// ─── Config Modal — helpers sezione, componente, asse ────────────────────────
function _kitCfgModalUpdateSez(kitId, sezId, field, val) {
    _kitCfgMutate(kitId, kit => {
        const sez = (kit.sezioni || []).find(s => s.id === sezId);
        if (sez) sez[field] = val.trim() || sez[field];
    }, true);
}

function _kitCfgModalDelSez(kitId, sezId) {
    if (!confirm('Eliminare questa sezione e tutti i componenti?')) return;
    _kitCfgMutate(kitId, kit => {
        kit.sezioni = (kit.sezioni || []).filter(s => s.id !== sezId);
    }, true);
}

function _kitCfgModalChangeCat(sezId, compId) {
    const catEl  = document.getElementById(`cfg-cat-${sezId}-${compId}`);
    const compEl = document.getElementById(`cfg-comp-${sezId}-${compId}`);
    if (!catEl || !compEl) return;
    const cat = catEl.value;
    const anag = _kitLoadAnagrafiche();
    const list = cat && cat !== '__free__' ? anag.filter(a => (a.categoria || '').trim() === cat) : [];
    if (!list.length || cat === '__free__') {
        // rimpiazza con input libero
        const input = document.createElement('input');
        input.id = `cfg-comp-${sezId}-${compId}`;
        input.className = compEl.className;
        input.style.cssText = compEl.style.cssText;
        input.placeholder = 'Nome componente';
        compEl.replaceWith(input);
        return;
    }
    // rimpiazza con select
    const sel = document.createElement('select');
    sel.id = `cfg-comp-${sezId}-${compId}`;
    sel.className = compEl.className;
    sel.style.cssText = compEl.style.cssText;
    sel.innerHTML = `<option value="">— Componente —</option>` +
        list.map(a => `<option value="${_esc(a.nome)}|${_esc(a.codice||'')}">${_esc(a.nome)}${a.codice? ' · '+_esc(a.codice):''}</option>`).join('');
    compEl.replaceWith(sel);
}

function _kitCfgModalSelectAnag(kitId, sezId, compId, val) {
    if (!val) return;
    const [nome, codice] = val.split('|');
    _kitCfgMutate(kitId, kit => {
        const sez  = (kit.sezioni || []).find(s => s.id === sezId);
        const comp = sez && (sez.componenti || []).find(c => c.id === compId);
        if (!comp) return;
        comp.nome   = nome || comp.nome;
        comp.codice = codice || '';
    }, true);
}

// ── Aggiungi da catalogo (clic su bottone categoria) ────────────────────────
function _kitCfgModalAddAnag(kitId, anagId) {
    const anag = _kitLoadAnagrafiche();
    const a = anag.find(x => x.id === anagId);
    if (!a) return;
    const cat = (a.categoria || '').trim() || 'Generali';
    _kitCfgMutate(kitId, kit => {
        let sez = (kit.sezioni || []).find(s => s.nome.trim() === cat);
        if (!sez) {
            sez = { id: _uid(), nome: cat, componenti: [] };
            kit.sezioni = kit.sezioni || [];
            kit.sezioni.push(sez);
        }
        sez.componenti = sez.componenti || [];
        sez.componenti.push({
            id: _uid(), nome: a.nome, codice: a.codice || '',
            qtaBase: 1, unitaMisura: a.unitaMisura || 'pz',
            regola: { tipo: 'sempre', qtyBase: 1 }
        });
    }, true);
}

function _kitCfgModalAddCompFree() {
    if (!_kitConfigModalId) return;
    _kitCfgMutate(_kitConfigModalId, kit => {
        let sez = (kit.sezioni || []).find(s => s.nome === 'Liberi');
        if (!sez) {
            sez = { id: _uid(), nome: 'Liberi', componenti: [] };
            kit.sezioni = kit.sezioni || [];
            kit.sezioni.push(sez);
        }
        sez.componenti = sez.componenti || [];
        sez.componenti.push({ id: _uid(), nome: 'Nuovo componente', codice: '', qtaBase: 1, unitaMisura: 'pz', regola: { tipo: 'sempre', qtyBase: 1 } });
    }, true);
}

function _kitCfgModalUpdateComp(kitId, sezId, compId, field, val) {
    _kitCfgMutate(kitId, kit => {
        const sez  = (kit.sezioni || []).find(s => s.id === sezId);
        const comp = sez && (sez.componenti || []).find(c => c.id === compId);
        if (!comp) return;
        if (field === 'qtaBase') { comp.qtaBase = parseFloat(val) || 1; if (comp.regola) comp.regola.qtyBase = comp.qtaBase; }
        else comp[field] = val;
    }, true);
}

function _kitCfgModalUpdateCompRule(kitId, sezId, compId, field, val) {
    _kitCfgMutate(kitId, kit => {
        const sez  = (kit.sezioni || []).find(s => s.id === sezId);
        const comp = sez && (sez.componenti || []).find(c => c.id === compId);
        if (!comp) return;
        comp.regola = comp.regola || {};
        if (field === 'tipo') {
            comp.regola.tipo = val;
            if (val === 'gruppo' && !comp.regola.asseId && kit.assiConfigurazione?.length) comp.regola.asseId = kit.assiConfigurazione[0].id;
            if (val === 'gruppo') comp.regola.opzioneIds = comp.regola.opzioneIds || [];
        } else if (field === 'asseId') {
            comp.regola.asseId = val;
            comp.regola.opzioneIds = [];
        } else {
            comp.regola[field] = val;
        }
    }, true);
}

function _kitCfgModalDelComp(kitId, sezId, compId) {
    _kitCfgMutate(kitId, kit => {
        const sez = (kit.sezioni || []).find(s => s.id === sezId);
        if (sez) sez.componenti = (sez.componenti || []).filter(c => c.id !== compId);
    }, true);
}

function _kitCfgModalAddAsse(kitId) {
    _kitCfgMutate(kitId, kit => {
        kit.assiConfigurazione = kit.assiConfigurazione || [];
        kit.assiConfigurazione.push({ id: _uid(), nome: 'Nuovo gruppo', key: _kitSanitizeKey('', 'ax'+kit.assiConfigurazione.length), opzioni: [] });
    }, true);
}

function _kitCfgModalDelAsse(kitId, asseId) {
    if (!confirm('Eliminare questo gruppo elettronico?')) return;
    _kitCfgMutate(kitId, kit => {
        kit.assiConfigurazione = (kit.assiConfigurazione || []).filter(a => a.id !== asseId);
    }, true);
}

function _kitCfgModalUpdateAsse(kitId, asseId, field, val) {
    _kitCfgMutate(kitId, kit => {
        const asse = (kit.assiConfigurazione || []).find(a => a.id === asseId);
        if (asse) asse[field] = val;
    }, false);
}

function _kitCfgModalAddOpz(kitId, asseId) {
    _kitCfgMutate(kitId, kit => {
        const asse = (kit.assiConfigurazione || []).find(a => a.id === asseId);
        if (!asse) return;
        asse.opzioni = asse.opzioni || [];
        const idx = asse.opzioni.length + 1;
        asse.opzioni.push({ id: _uid(), key: _kitSanitizeKey('', 'opz'+idx), nome: 'Nuova opzione', codice: '' });
    }, true);
}

function _kitCfgModalDelOpz(kitId, asseId, opzId) {
    _kitCfgMutate(kitId, kit => {
        const asse = (kit.assiConfigurazione || []).find(a => a.id === asseId);
        if (asse) asse.opzioni = (asse.opzioni || []).filter(o => o.id !== opzId);
    }, true);
}

function _kitCfgModalUpdateOpz(kitId, asseId, opzId, field, val) {
    _kitCfgMutate(kitId, kit => {
        const asse = (kit.assiConfigurazione || []).find(a => a.id === asseId);
        const opz  = asse && (asse.opzioni || []).find(o => o.id === opzId);
        if (!opz) return;
        opz[field] = val;
    }, false);
}

// ── Crea Kit (modal nome-first) ───────────────────────────────────────────────
function _kitOpenCreaKit() {
    const modal = document.getElementById('modal-kit-crea');
    if (!modal) return;
    const inp = document.getElementById('kit-crea-nome');
    if (inp) inp.value = '';
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    setTimeout(() => inp && inp.focus(), 80);
}
function _kitCloseCreaKit() {
    const modal = document.getElementById('modal-kit-crea');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}
function _kitConfirmCreaKit() {
    const nome = (document.getElementById('kit-crea-nome')?.value || '').trim();
    if (!nome) { notificaElegante('Inserisci un nome per il kit', 'warning'); return; }
    const { kits } = _kitLoad();
    const kit = {
        id: _uid(), nome,
        schemaVersion: _KIT_SCHEMA_VERSION,
        assiConfigurazione: [], varianti: [],
        sezioni: [], sottoAssembly: [],
        qtaDaProdurre: {}, pronti: {}, movimenti: []
    };
    kits.push(kit);
    _kitSave(kits);
    _kitCloseCreaKit();
    setTimeout(() => _kitSwitchMainTab('kits'), 320);
}

// ── Quick add sezione ─────────────────────────────────────────────────────────
function _kitQAddSezOpen(kitId) {
    _kitQAddState.kitId = kitId;
    const modal = document.getElementById('modal-kit-qadd-sez');
    if (!modal) return;
    const inp = document.getElementById('kit-qadd-sez-nome');
    if (inp) inp.value = '';
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    setTimeout(() => inp && inp.focus(), 80);
}
function _kitQAddSezClose() {
    const modal = document.getElementById('modal-kit-qadd-sez');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}
function _kitQAddSezConfirm() {
    const nome = (document.getElementById('kit-qadd-sez-nome')?.value || '').trim() || 'Nuova sezione';
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitQAddState.kitId);
    if (!kit) return;
    kit.sezioni = kit.sezioni || [];
    kit.sezioni.push({ id: _uid(), nome, componenti: [] });
    _kitSave(kits);
    _kitQAddSezClose();
    if (_kitConfigModalId) { setTimeout(() => _kitRenderConfigModal(), 320); }
    else { setTimeout(() => _kitSwitchMainTab('kits'), 320); }
}

// ── Quick add componente ──────────────────────────────────────────────────────
function _kitQAddCompOpen(kitId, sezId) {
    _kitQAddState.kitId = kitId;
    _kitQAddState.sezId = sezId;
    const modal = document.getElementById('modal-kit-qadd-comp');
    if (!modal) return;
    // Default: da catalogo se ci sono anagrafiche, altrimenti libero
    const anag = _kitLoadAnagrafiche();
    const srcCat = document.getElementById('kit-qadd-comp-source-cat');
    const srcFree = document.getElementById('kit-qadd-comp-source-free');
    if (anag.length) {
        if (srcCat) srcCat.checked = true;
        _kitQAddCompToggleSource('cat');
    } else {
        if (srcFree) srcFree.checked = true;
        _kitQAddCompToggleSource('free');
    }
    // Popola categorie
    const cats = [...new Set(anag.map(a => a.categoria || 'Senza categoria'))].sort();
    const selCat = document.getElementById('kit-qadd-comp-cat');
    if (selCat) {
        selCat.innerHTML = cats.map(c => `<option value="${_esc(c)}">${_esc(c)}</option>`).join('');
        _kitQAddCompChangeCategoria();
    }
    const qtyInp = document.getElementById('kit-qadd-comp-qty');
    if (qtyInp) qtyInp.value = '1';
    const unitSel = document.getElementById('kit-qadd-comp-unit');
    if (unitSel) unitSel.value = 'pz';
    const nomeInp = document.getElementById('kit-qadd-comp-nome');
    if (nomeInp) nomeInp.value = '';
    const codiceInp = document.getElementById('kit-qadd-comp-codice');
    if (codiceInp) codiceInp.value = '';
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
}
function _kitQAddCompToggleSource(src) {
    const catSection = document.getElementById('kit-qadd-comp-cat-section');
    const freeSection = document.getElementById('kit-qadd-comp-free-section');
    if (catSection) catSection.style.display = src === 'cat' ? '' : 'none';
    if (freeSection) freeSection.style.display = src === 'free' ? '' : 'none';
}
function _kitQAddCompChangeCategoria() {
    const selCat = document.getElementById('kit-qadd-comp-cat');
    const selComp = document.getElementById('kit-qadd-comp-comp');
    if (!selCat || !selComp) return;
    const cat = selCat.value;
    const anag = _kitLoadAnagrafiche();
    const filtered = anag.filter(a => (a.categoria || 'Senza categoria') === cat);
    selComp.innerHTML = filtered.length
        ? filtered.map(a => `<option value="${_esc(a.id)}">${_esc(a.nome)}${a.codice ? ' · ' + _esc(a.codice) : ''}</option>`).join('')
        : '<option value="">Nessun componente in questa categoria</option>';
}
function _kitQAddCompClose() {
    const modal = document.getElementById('modal-kit-qadd-comp');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}
function _kitQAddCompConfirm() {
    const isCat = document.getElementById('kit-qadd-comp-source-cat')?.checked;
    let nome = '', codice = '';
    if (isCat) {
        const selComp = document.getElementById('kit-qadd-comp-comp');
        const anagId = selComp?.value;
        if (!anagId) { notificaElegante('Seleziona un componente dal catalogo', 'warning'); return; }
        const anag = _kitLoadAnagrafiche().find(a => a.id === anagId);
        if (!anag) { notificaElegante('Componente non trovato nel catalogo', 'warning'); return; }
        nome = anag.nome;
        codice = anag.codice || '';
    } else {
        nome = (document.getElementById('kit-qadd-comp-nome')?.value || '').trim();
        if (!nome) { notificaElegante('Inserisci il nome del componente', 'warning'); return; }
        codice = (document.getElementById('kit-qadd-comp-codice')?.value || '').trim();
    }
    const qty = parseFloat(document.getElementById('kit-qadd-comp-qty')?.value) || 1;
    const unit = document.getElementById('kit-qadd-comp-unit')?.value || 'pz';
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === _kitQAddState.kitId);
    if (!kit) return;
    const sez = (kit.sezioni || []).find(s => s.id === _kitQAddState.sezId);
    if (!sez) return;
    sez.componenti = sez.componenti || [];
    sez.componenti.push({
        id: _uid(), nome, codice,
        qtaBase: qty,
        qtaPerVariante: {},
        caricato: 0,
        modoComponente: 'quantificato',
        tracciabile: true,
        noteConfig: '',
        unitaMisura: unit,
        applicazioneTipo: 'sempre'
    });
    _kitSave(kits);
    _kitQAddCompClose();
    if (_kitConfigModalId) { setTimeout(() => _kitRenderConfigModal(), 320); }
    else { setTimeout(() => _kitSwitchMainTab('kits'), 320); }
}

// ── Inline edit / delete ──────────────────────────────────────────────────────
function _kitQUpdateComp(kitId, sezId, compId, field, value) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const sez = (kit.sezioni || []).find(s => s.id === sezId);
    if (!sez) return;
    const comp = (sez.componenti || []).find(c => c.id === compId);
    if (!comp) return;
    if (field === 'qtaBase') comp.qtaBase = parseFloat(value) || 0;
    else comp[field] = value;
    _kitSave(kits);
}
function _kitQRenomeSez(kitId, sezId, nome) {
    if (!nome.trim()) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const sez = (kit.sezioni || []).find(s => s.id === sezId);
    if (!sez) return;
    sez.nome = nome.trim();
    _kitSave(kits);
}
function _kitQDelComp(kitId, sezId, compId) {
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const sez = (kit.sezioni || []).find(s => s.id === sezId);
    if (!sez) return;
    sez.componenti = (sez.componenti || []).filter(c => c.id !== compId);
    _kitSave(kits);
    _kitSwitchMainTab('kits');
}
function _kitQDelSez(kitId, sezId) {
    if (!confirm('Rimuovere questa sezione e tutti i suoi componenti?')) return;
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    kit.sezioni = (kit.sezioni || []).filter(s => s.id !== sezId);
    _kitSave(kits);
    _kitSwitchMainTab('kits');
}
function _kitQDelKit(kitId) {
    if (!confirm('Eliminare questo kit? L\'operazione non è reversibile.')) return;
    const { kits } = _kitLoad();
    const newKits = kits.filter(k => k.id !== kitId);
    _kitSave(newKits);
    _kitSwitchMainTab('kits');
}

function _kitNuovoKit() {
    _kitOpenCreaKit();
}

function _kitOpenConfig(id) {
    _kitConfigModalId = id;
    _kitOpenConfigModal(id);
}

function _kitCreateImportState(currentKitId, mode, preselectedSectionId = '') {
    const { kits } = _kitLoad();
    const currentKit = kits.find(kit => kit.id === currentKitId);
    const firstSourceKit = kits.find(kit => kit.id !== currentKitId && (kit.sezioni || []).length);
    const firstCurrentSection = currentKit?.sezioni?.[0]?.id || '';
    const firstSourceAsse = kits.find(kit => kit.id !== currentKitId && (kit.assiConfigurazione || []).length)?.assiConfigurazione?.[0]?.id || '';
    return {
        currentKitId,
        mode,
        search: '',
        sourceKitId: mode === 'copy' ? currentKitId : (firstSourceKit?.id || ''),
        sectionId: preselectedSectionId || (mode === 'copy' ? firstCurrentSection : (firstSourceKit?.sezioni?.[0]?.id || '')),
        asseId: preselectedSectionId || (mode === 'import-asse' ? firstSourceAsse : ''),
        targetKitIds: []
    };
}

function _kitCfgOpenImportModal(kitId) {
    _kitImportState = _kitCreateImportState(kitId, 'import');
    _kitRenderImportModal(true);
}

function _kitCfgOpenImportAsseModal(kitId) {
    _kitImportState = _kitCreateImportState(kitId, 'import-asse');
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
    if (_kitImportState.mode === 'import-asse') _kitImportState.asseId = sourceKit?.assiConfigurazione?.[0]?.id || '';
    else _kitImportState.sectionId = sourceKit?.sezioni?.[0]?.id || '';
    _kitRenderImportModal();
}

function _kitCfgSelectImportSection(sectionId) {
    if (!_kitImportState) return;
    if (_kitImportState.mode === 'import-asse') _kitImportState.asseId = sectionId;
    else _kitImportState.sectionId = sectionId;
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

    // source candidates depend on mode: sections import vs assi import
    let sourceCandidates = [];
    if (state.mode === 'import') sourceCandidates = kits.filter(kit => kit.id !== currentKit.id && (kit.sezioni || []).length);
    else if (state.mode === 'import-asse') sourceCandidates = kits.filter(kit => kit.id !== currentKit.id && (kit.assiConfigurazione || []).length);
    else sourceCandidates = kits.filter(kit => kit.id !== currentKit.id && (kit.sezioni || []).length);

    if ((state.mode === 'import' || state.mode === 'import-asse') && !sourceCandidates.some(kit => kit.id === state.sourceKitId)) {
        state.sourceKitId = sourceCandidates[0]?.id || '';
    }
    if (state.mode === 'copy') {
        state.sourceKitId = currentKit.id;
        state.targetKitIds = (state.targetKitIds || []).filter(kitId => kitId !== currentKit.id && kits.some(kit => kit.id === kitId));
    }

    const sourceKit = kits.find(kit => kit.id === state.sourceKitId) || null;
    const sourceSections = state.mode === 'import-asse' ? (sourceKit?.assiConfigurazione || []) : (sourceKit?.sezioni || []);
    if (state.mode === 'import-asse') {
        if (!sourceSections.some(item => item.id === state.asseId)) state.asseId = sourceSections[0]?.id || '';
    } else {
        if (!sourceSections.some(item => item.id === state.sectionId)) state.sectionId = sourceSections[0]?.id || '';
    }
    const selectedSection = state.mode === 'import-asse'
        ? (sourceKit?.assiConfigurazione || []).find(a => a.id === state.asseId) || null
        : _kitGetSectionById(sourceKit, state.sectionId);
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

    importModeBtn.classList.toggle('kit-import-mode-btn--active', state.mode === 'import' || state.mode === 'import-asse');
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
        ? sourceSections.map(item => {
            const checked = state.mode === 'import-asse' ? (item.id === state.asseId) : (item.id === state.sectionId);
            if (state.mode === 'import-asse') {
                return `<label class="kit-import-option ${checked ? 'kit-import-option--active' : ''}">
                    <input type="radio" name="kit-import-section" ${checked ? 'checked' : ''}
                           onchange="_kitCfgSelectImportSection('${_esc(item.id)}')">
                    <span class="kit-import-option-body">
                        <span class="kit-import-option-title">${_esc(item.nome)}</span>
                        <span class="kit-import-option-meta">${(item.opzioni || []).length} opzioni</span>
                    </span>
                </label>`;
            }
            return `<label class="kit-import-option ${checked ? 'kit-import-option--active' : ''}">
                <input type="radio" name="kit-import-section" ${checked ? 'checked' : ''}
                       onchange="_kitCfgSelectImportSection('${_esc(item.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${_esc(item.nome)}</span>
                    <span class="kit-import-option-meta">${(item.componenti || []).length} componenti</span>
                </span>
            </label>`;
        }).join('')
        : `<div class="kit-import-empty">Nessun ${state.mode === 'import-asse' ? 'gruppo elettronico' : 'sezione'} disponibile.</div>`;

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
    } else if (state.mode === 'import-asse') {
        if (!sourceKit) {
            previewHtml = 'Seleziona un kit sorgente per vedere gli assi disponibili.';
        } else if (!selectedSection) {
            previewHtml = 'Seleziona un asse da importare nel kit corrente.';
        } else {
            canConfirm = true;
            previewHtml = `L'asse <strong>${_esc(selectedSection.nome)}</strong> verrà importato in <strong>${_esc(currentKit.nome)}</strong>. Opzioni duplicate verranno ignorate (merge per codice).`;
        }
        confirmBtn.innerHTML = '<i class="fas fa-copy"></i> Importa asse';
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
    const sourceAsse = sourceKit?.assiConfigurazione?.find(a => a.id === state.asseId) || null;
    if (!currentKit || !sourceKit || (state.mode === 'import' && !sourceSezione) || (state.mode === 'import-asse' && !sourceAsse)) {
        notificaElegante('Configurazione import non valida ⚠️');
        return;
    }

    if (state.mode === 'import-asse') {
        // import single asse (assi + opzioni). Merge options by codice when axis with same name exists.
        currentKit.assiConfigurazione = currentKit.assiConfigurazione || [];
        const existing = currentKit.assiConfigurazione.find(a => String(a.nome || '').trim().toLowerCase() === String(sourceAsse.nome || '').trim().toLowerCase());
        let added = 0;
        if (existing) {
            existing.opzioni = existing.opzioni || [];
            for (const opt of (sourceAsse.opzioni || [])) {
                const optCodice = String(opt.codice || '').trim().toLowerCase();
                let dup = false;
                if (optCodice) dup = existing.opzioni.some(o => String(o.codice || '').trim().toLowerCase() === optCodice && optCodice !== '');
                if (!dup) dup = existing.opzioni.some(o => String(o.nome || '').trim().toLowerCase() === String(opt.nome || '').trim().toLowerCase());
                if (!dup) {
                    const idx = (existing.opzioni || []).length + 1;
                    existing.opzioni.push({ id: _uid(), key: _kitSanitizeKey(opt?.key, 'opz' + idx), nome: String(opt?.nome || '').trim() || ('opz' + idx), codice: String(opt?.codice || '').trim() });
                    added += 1;
                }
            }
            _kitSave(kits);
            _kitCfgCloseImportModal();
            _kitRenderConfigModal();
            if (added) notificaElegante(`${added} opzione${added>1?'i':''} aggiunta${added>1?'e':''} all'asse "${sourceAsse.nome}" ✓`);
            else notificaElegante(`Nessuna nuova opzione trovata per l'asse "${sourceAsse.nome}"`);
            return;
        }

        // no existing axis -> clone whole asse
        currentKit.assiConfigurazione.push(_kitCloneAsseForKit(sourceAsse, sourceKit, currentKit));
        _kitSave(kits);
        _kitCfgCloseImportModal();
        _kitRenderConfigModal();
        notificaElegante(`Asse "${sourceAsse.nome}" importato da "${sourceKit.nome}" ✓`);
        return;
    }

    if (state.mode === 'import') {
        const align = _kitGetVariantAlignmentInfo(sourceKit, currentKit);
        currentKit.sezioni = currentKit.sezioni || [];
        currentKit.sezioni.push(_kitCloneSezioneForKit(sourceSezione, sourceKit, currentKit));
        _kitSave(kits);
        _kitCfgCloseImportModal();
        _kitRenderConfigModal();

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
    _kitRenderConfigModal();

    let suffix = '';
    if (reviewCount > 0) suffix = ` ${reviewCount} kit richiedono un controllo delle quantità.`;
    notificaElegante(`Sezione "${sourceSezione.nome}" copiata in ${targetKits.length} kit ✓${suffix}`);
}

// ─── Preset: sezioni fisse (CRUD + applica) ─────────────────────────────────
function _kitOpenPresetsModal(kitId) {
    const { kits } = _kitLoad();
    const currentKit = kits.find(k => k.id === kitId) || null;
    _kitPresetState = {
        currentKitId: kitId,
        search: '',
        selectedPresetId: '',
        newPresetName: '',
        newPresetSectionId: currentKit?.sezioni?.[0]?.id || ''
    };
    _kitRenderPresetsModal(true);
}

function _kitClosePresetsModal() {
    const modal = document.getElementById('modal-kit-presets');
    _kitPresetState = null;
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        if (!modal.classList.contains('active')) modal.style.display = 'none';
    }, 300);
}

function _kitSetPresetsSearch(value) {
    if (!_kitPresetState) return;
    _kitPresetState.search = String(value || '');
    _kitRenderPresetsModal();
}

function _kitSelectPreset(presetId) {
    if (!_kitPresetState) return;
    _kitPresetState.selectedPresetId = presetId;
    _kitRenderPresetsModal();
}

function _kitCreatePresetFromSection() {
    if (!_kitPresetState) return;
    const nameEl = document.getElementById('preset-new-name');
    const selEl = document.getElementById('preset-new-section');
    const name = String(nameEl?.value || '').trim();
    if (!name) { notificaElegante('Inserisci il nome del preset ⚠️'); return; }
    const sectionId = selEl?.value || '';
    _kitCreatePreset(_kitPresetState.currentKitId, sectionId, name);
}

function _kitCreatePreset(kitId, sectionId, name) {
    const { kits } = _kitLoad();
    const currentKit = kits.find(k => k.id === kitId);
    if (!currentKit) { notificaElegante('Kit non trovato ⚠️'); return; }
    const section = _kitGetSectionById(currentKit, sectionId);
    if (!section) { notificaElegante('Seleziona una sezione valida ⚠️'); return; }
    const presets = _kitLoadPresets();
    presets.push({ id: _uid(), nome: String(name || '').trim(), sourceKitId: currentKit.id, sezione: JSON.parse(JSON.stringify(section)) });
    _kitSavePresets(presets);
    notificaElegante('Preset salvato ✓');
    // if modal open, re-render it
    if (_kitPresetState && _kitPresetState.currentKitId === kitId) _kitRenderPresetsModal();
    // re-render config so tab list updates
    _kitRenderConfigModal();
}

function _kitApplyPreset(presetId) {
    if (!_kitPresetState) return;
    const presets = _kitLoadPresets();
    const id = presetId || _kitPresetState.selectedPresetId;
    const preset = presets.find(p => p.id === id);
    if (!preset) { notificaElegante('Seleziona un preset ⚠️'); return; }
    const { kits } = _kitLoad();
    const targetKit = kits.find(k => k.id === _kitPresetState.currentKitId);
    const sourceKit = kits.find(k => k.id === preset.sourceKitId) || null;
    if (!targetKit) { notificaElegante('Kit non trovato ⚠️'); return; }
    targetKit.sezioni = targetKit.sezioni || [];
    targetKit.sezioni.push(_kitCloneSezioneForKit(preset.sezione, sourceKit, targetKit));
    _kitSave(kits);
    _kitClosePresetsModal();
    _kitRenderConfigModal();
    notificaElegante(`Preset "${preset.nome}" applicato ✓`);
}

function _kitRenamePreset(presetId, newName) {
    const presets = _kitLoadPresets();
    const p = presets.find(x => x.id === presetId);
    if (!p) { notificaElegante('Preset non trovato ⚠️'); return; }
    p.nome = String(newName || '').trim() || p.nome;
    _kitSavePresets(presets);
    notificaElegante('Nome aggiornato ✓');
    _kitRenderPresetsModal();
}

function _kitDeletePreset(presetId) {
    const presets = _kitLoadPresets().filter(p => p.id !== presetId);
    _kitSavePresets(presets);
    if (_kitPresetState) _kitPresetState.selectedPresetId = '';
    _kitRenderPresetsModal();
    notificaElegante('Preset eliminato ✓');
}

function _kitRenderPresetsModal(openModal = false) {
    const modal = document.getElementById('modal-kit-presets');
    if (!modal || !_kitPresetState) return;
    const presets = _kitLoadPresets();
    const state = _kitPresetState;
    const currentKit = _kitLoad().kits.find(k => k.id === state.currentKitId);
    const filtered = presets.filter(p => _kitMatchesSearch(p.nome, state.search));
    const listEl = document.getElementById('preset-list');
    const previewEl = document.getElementById('preset-preview');
    const newNameInput = document.getElementById('preset-new-name');
    const newSectionSelect = document.getElementById('preset-new-section');
    const applyBtn = document.getElementById('preset-apply-btn');
    if (!listEl || !previewEl || !newNameInput || !newSectionSelect || !applyBtn) return;

    listEl.innerHTML = filtered.length
        ? filtered.map(p => {
            const active = p.id === state.selectedPresetId;
            return `<label class="kit-import-option ${active ? 'kit-import-option--active' : ''}">
                <input type="radio" name="preset-select" ${active ? 'checked' : ''} onchange="_kitSelectPreset('${_esc(p.id)}')">
                <span class="kit-import-option-body">
                    <span class="kit-import-option-title">${_esc(p.nome)}</span>
                    <span class="kit-import-option-meta">${(p.sezione?.componenti||[]).length} componenti</span>
                </span>
            </label>`;
        }).join('')
        : '<div class="kit-import-empty">Nessun preset presente.</div>';

    const selectedPreset = presets.find(p => p.id === state.selectedPresetId) || null;
    if (selectedPreset) {
        const sourceName = selectedPreset.sourceKitId && _kitLoad().kits.find(k => k.id === selectedPreset.sourceKitId)?.nome || '';
        previewEl.innerHTML = `<div style="padding:6px"><strong>${_esc(selectedPreset.nome)}</strong><div style="color:#94a3b8">${_esc(sourceName)}</div></div>` +
            ((selectedPreset.sezione?.componenti?.length)
                ? `<div>${selectedPreset.sezione.componenti.map(c => `<div class="kit-meta-pill">${_esc(c.nome)}${c.codice ? ' · ' + _esc(c.codice) : ''}</div>`).join('')}</div>`
                : '<div class="kit-import-empty">Sezione vuota</div>');
    } else {
        previewEl.innerHTML = '<div class="kit-import-empty">Seleziona un preset per vedere l\'anteprima.</div>';
    }

    applyBtn.disabled = !selectedPreset;
    newNameInput.value = '';
    newSectionSelect.innerHTML = (currentKit?.sezioni||[]).map(s => `<option value="${_esc(s.id)}">${_esc(s.nome)}</option>`).join('');

    if (openModal) {
        modal.style.display = 'flex';
        modal.offsetHeight;
        modal.classList.add('active');
        setTimeout(() => {
            const input = document.getElementById('preset-search');
            if (input) input.focus();
        }, 40);
    }
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
    const tabs = ['info', 'varianti', 'anagrafiche', 'bom'];
    const tabLabels = { info: 'Prodotto', varianti: 'Elettronica selezionabile', anagrafiche: 'Anagrafiche', bom: 'Parti del prodotto' };

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
            <button type="button" class="kit-cfg-add-btn" onclick="_kitDuplicaKit('${_esc(kit.id)}')"><i class="fas fa-clone"></i> Duplica kit</button>
            <button type="button" class="kit-btn-danger" onclick="_kitElimina('${_esc(kit.id)}')"><i class="fas fa-trash"></i> Elimina kit</button>
        </div>`;

    // ─── Tab Elettronica selezionabile ───
    const assiHtml = assi.map((asse, axisIndex) => {
        const opzioniHtml = (asse.opzioni || []).map((opt, optIndex) => `
            <div class="kit-cfg-row kit-cfg-sarow">
                <input class="kit-cfg-input" value="${_esc(opt.nome)}" maxlength="50" placeholder="Nome scelta elettronica"
                       onchange="_kitCfgUpdateOpzione('${_esc(kit.id)}','${_esc(asse.id)}','${_esc(opt.id)}','nome',this.value)">
                <input class="kit-cfg-input kit-cfg-input-code" value="${_esc(opt.codice || '')}" maxlength="40" placeholder="Codice stampa opzionale"
                       onchange="_kitCfgUpdateOpzione('${_esc(kit.id)}','${_esc(asse.id)}','${_esc(opt.id)}','codice',this.value)">
                <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelOpzione('${_esc(kit.id)}','${_esc(asse.id)}','${_esc(opt.id)}')"><i class="fas fa-times"></i></button>
            </div>`).join('');

        return `<div class="kit-cfg-sez-block" data-ai="${axisIndex}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${_esc(asse.nome)}" maxlength="40" placeholder="Gruppo elettronico (es. LED)"
                       onchange="_kitCfgUpdateAsse('${_esc(kit.id)}','${_esc(asse.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelAsse('${_esc(kit.id)}','${_esc(asse.id)}')"><i class="fas fa-times"></i></button>
            </div>
            <div class="kit-cfg-help">Qui metti solo i nomi delle scelte che il cliente può richiedere per questo gruppo.</div>
            ${opzioniHtml || '<div class="kit-cfg-sa-empty">Nessuna opzione ancora.</div>'}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddOpzione('${_esc(kit.id)}','${_esc(asse.id)}')"><i class="fas fa-plus"></i> Aggiungi scelta</button>
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
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddAsse('${_esc(kit.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo elettronico</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportAsseModal('${_esc(kit.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
            <button type="button" class="kit-cfg-add-btn" onclick="_kitOpenPresetsModal('${_esc(kit.id)}')"><i class="fas fa-bookmark"></i> Sezioni fisse</button>
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
            const unitValue = isSegnalazione ? 'flag' : _kitNormalizeUnit(comp.unitaMisura, 'pz');
            const unitOptions = isSegnalazione
                ? [{ value: 'flag', label: 'Solo avviso' }]
                : [...new Set([unitValue, ..._KIT_UNITA_MISURA_OPTIONS])]
                    .filter(Boolean)
                    .map(unit => ({ value: unit, label: unit }));

            return `<div class="kit-cfg-sa-group" style="padding:12px 14px">
                <div class="kit-cfg-row">
                    <input class="kit-cfg-input kit-cfg-input-comp" value="${_esc(comp.nome)}" maxlength="60" placeholder="Nome parte"
                           onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','nome','',this.value)">
                    <input class="kit-cfg-input kit-cfg-input-code" value="${_esc(comp.codice || '')}" maxlength="40" placeholder="Codice stampa opzionale"
                           onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','codice','',this.value)">
                    <select class="kit-cfg-select" style="max-width:210px"
                            onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','modo','',this.value)">
                        <option value="quantificato" ${!isSegnalazione ? 'selected' : ''}>Materiale da contare</option>
                        <option value="segnalazione" ${isSegnalazione ? 'selected' : ''}>Solo avviso</option>
                    </select>
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="kit-cfg-row">
                    <label class="kit-cfg-label" style="margin:0">Quantità per faretto</label>
                    <input class="kit-cfg-coeff" type="number" min="0" step="0.001" value="${rule.qtyBase}"
                           onchange="_kitCfgUpdateCompRule('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','qtyBase',this.value)">
                    <select class="kit-cfg-select" style="max-width:120px"
                            onchange="_kitCfgUpdateComp('${_esc(kit.id)}','${_esc(sez.id)}','${_esc(comp.id)}','unitaMisura','',this.value)"
                            ${isSegnalazione ? 'disabled' : ''}>
                        ${unitOptions.map(unit => `<option value="${_esc(unit.value)}" ${unitValue === unit.value ? 'selected' : ''}>${_esc(unit.label)}</option>`).join('')}
                    </select>
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
                        ? 'Usa questo tipo solo per cose da ricordare ma non da contare. Se vuoi vedere metri o pezzi in distinta, come cavo neoprene o scatolina 3D, lascia Materiale da contare.'
                        : 'Qui dici quanta parte serve per singolo faretto, scegli l\'unità e se vale sempre o solo per certe scelte elettroniche.'}
                </div>
                ${advancedWarning}
            </div>`;
        }).join('');

        return `<div class="kit-cfg-sez-block" data-si="${si}">
            <div class="kit-cfg-sez-header">
                <input class="kit-cfg-input kit-cfg-input-sez" value="${_esc(sez.nome)}" maxlength="40" placeholder="Gruppo di parti (es. Meccanica)"
                       onchange="_kitCfgUpdateSez('${_esc(kit.id)}','${_esc(sez.id)}','nome',this.value)">
                <button type="button" class="kit-cfg-copy-btn" onclick="_kitCfgOpenCopySezModal('${_esc(kit.id)}','${_esc(sez.id)}')" title="Copia questa sezione in altri kit"><i class="fas fa-copy"></i></button>
                <button type="button" class="kit-cfg-del-btn kit-cfg-del-sez" onclick="_kitCfgDelSez('${_esc(kit.id)}','${_esc(sez.id)}')"><i class="fas fa-times"></i></button>
            </div>
            ${compRows}
            <button type="button" class="kit-cfg-add-comp-btn" onclick="_kitCfgAddComp('${_esc(kit.id)}','${_esc(sez.id)}')"><i class="fas fa-plus"></i> Aggiungi parte</button>
        </div>`;
    }).join('');

    const sezioniPanelHtml = `
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">
                Qui definisci le <strong>parti del prodotto</strong> che finiranno nella distinta base.<br>
                Puoi usare un gruppo come <strong>Meccanica</strong> per le parti sempre presenti e altri gruppi se ti aiutano a organizzarti.<br>
                Se una voce va conteggiata scegli anche l'unità corretta, per esempio <strong>pz</strong> o <strong>mt</strong>. Usa <strong>Solo avviso</strong> solo per promemoria non quantificati.
            </div>
            ${!variantiEffettive.length ? `<div class="kit-cfg-warn">⚠️ Aggiungi prima almeno un gruppo nella tab <strong>Elettronica selezionabile</strong>.</div>` : ''}
            ${sezioniHtml}
            <div class="kit-cfg-row">
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgAddSez('${_esc(kit.id)}')"><i class="fas fa-plus"></i> Aggiungi gruppo parti</button>
                <button type="button" class="kit-cfg-add-btn" onclick="_kitCfgOpenImportModal('${_esc(kit.id)}')"><i class="fas fa-copy"></i> Importa gruppo da altro kit</button>
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
                    <button type="button" class="kit-cfg-del-btn" onclick="_kitCfgDelSA('${_esc(kit.id)}',${i})"><i class="fas fa-times"></i></button>
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
    // ─── Tab Anagrafiche / Sezioni fisse ─────────────────────────────────────
    const presets = _kitLoadPresets();
    const presetListHtml = presets.length
        ? presets.map(p => `<div class="kit-preset-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
                <div style="flex:1">
                    <div style="font-weight:600">${_esc(p.nome)}</div>
                    <div style="color:#94a3b8;font-size:0.85rem">${_esc(p.sourceKitId && _kitLoad().kits.find(k=>k.id===p.sourceKitId)?.nome || '')}</div>
                </div>
                <div style="display:flex;gap:8px">
                    <button class="kit-cfg-add-btn" onclick="_kitApplyPreset('${_esc(p.id)}')">Applica</button>
                    <button class="kit-cfg-add-btn" onclick="(function(){const n=prompt('Nuovo nome preset', '${_esc(p.nome)}'); if(n) _kitRenamePreset('${_esc(p.id)}', n);})()">Rinomina</button>
                    <button class="kit-btn-danger" onclick="(function(){ if(confirm('Eliminare questo preset?')) _kitDeletePreset('${_esc(p.id)}') })()">Elimina</button>
                </div>
            </div>`).join('')
        : '<div class="kit-import-empty">Nessun preset salvato.</div>';

    const anagrafichePanelHtml = `
        <div class="kit-cfg-section">
            <div class="kit-cfg-help">Gestisci le <strong>sezioni fisse</strong> riutilizzabili tra kit. Puoi creare un preset a partire da una sezione del kit corrente e applicarlo qui.</div>
            <div style="margin-top:8px">${presetListHtml}</div>
            <hr style="margin:12px 0">
            <div style="display:flex;gap:8px;align-items:center">
                <select id="preset-new-section-tab" class="kit-cfg-select" style="min-width:220px">
                    ${(kit.sezioni||[]).map(s=>`<option value="${_esc(s.id)}">${_esc(s.nome)}</option>`).join('')}
                </select>
                <input id="preset-new-name-tab" class="kit-cfg-input" placeholder="Nome nuovo preset" style="flex:1">
                <button class="kit-cfg-add-btn" onclick="(function(){ const sec = document.getElementById('preset-new-section-tab')?.value || ''; const name = document.getElementById('preset-new-name-tab')?.value || ''; if(!name) { alert('Inserisci un nome'); return; } _kitCreatePreset('${_esc(kit.id)}', sec, name); })()"><i class="fas fa-save"></i> Crea preset</button>
            </div>
        </div>`;

    panels.anagrafiche = anagrafichePanelHtml;
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
    if (rerender) _kitRenderConfigModal();
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

function _kitDuplicaKit(kitId) {
    const { kits } = _kitLoad();
    const src = kits.find(k => k.id === kitId);
    if (!src) return;

    const newKit = {
        id: _uid(),
        nome: `Copia di ${src.nome}`,
        schemaVersion: _KIT_SCHEMA_VERSION,
        assiConfigurazione: [],
        varianti: [],
        sezioni: [],
        sottoAssembly: [],
        qtaDaProdurre: {},
        pronti: {},
        movimenti: []
    };

    // clone assi (ensures new ids/keys unique within new kit)
    for (const asse of (src.assiConfigurazione || [])) {
        newKit.assiConfigurazione.push(_kitCloneAsseForKit(asse, src, newKit));
    }
    newKit.varianti = _kitBuildVariantiFromAssi(newKit.assiConfigurazione);

    // clone sezioni/components with qta mapped to new kit variants
    for (const sez of (src.sezioni || [])) {
        newKit.sezioni.push(_kitCloneSezioneForKit(sez, src, newKit));
    }

    // clone sottoAssembly shallowly with new ids
    newKit.sottoAssembly = (src.sottoAssembly || []).map(sa => ({ id: _uid(), nome: sa.nome || '', varianteKey: sa.varianteKey || '', noteConfig: sa.noteConfig || '' }));

    kits.push(newKit);
    _kitSave(kits);
    _kitOpenConfig(newKit.id);
    notificaElegante(`Kit "${src.nome}" duplicato ✓`);
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
        asse.opzioni.push({ id: _uid(), key: 'opz' + idx, nome: 'Opzione ' + idx, codice: '' });
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
            codice: '',
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
            comp.qtaPerVariante[vKey] = _kitParseQty(val);
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
        if (field === 'unitaMisura') {
            comp.unitaMisura = comp.modoComponente === 'segnalazione'
                ? 'flag'
                : _kitNormalizeUnit(val, 'pz');
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
            rule.qtyBase = _kitParseQty(value);
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

// ─── Modal salva distinta (modifica metadati prima di salvare)
function _kitOpenSaveDistintaModal(kitId) {
    const modal = document.getElementById('modal-kit-distinta-edit');
    if (!modal) {
        _kitCreateDistintaFromDraft(kitId);
        return;
    }
    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) return;
    const orderDraft = _kitGetOrderDraft(kit);
    const meta = _kitGetOrderMeta(orderDraft);
    const nomeInput = document.getElementById('distinta-edit-nome');
    const docInput = document.getElementById('distinta-edit-documento');
    if (nomeInput) nomeInput.value = meta.documento || '';
    if (docInput) docInput.value = meta.documento || '';
    modal.dataset.kitId = kitId;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    setTimeout(() => nomeInput && nomeInput.focus(), 80);
}

function _kitCloseSaveDistintaModal() {
    const modal = document.getElementById('modal-kit-distinta-edit');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { if (!modal.classList.contains('active')) modal.style.display = 'none'; }, 300);
}

function _kitConfirmSaveDistinta() {
    const modal = document.getElementById('modal-kit-distinta-edit');
    if (!modal) return;
    const kitId = modal.dataset.kitId;
    const nome = (document.getElementById('distinta-edit-nome')?.value || '').trim();
    const documento = (document.getElementById('distinta-edit-documento')?.value || '').trim();
    if (!nome) { notificaElegante('Inserisci un nome per la distinta.', 'warning'); return; }

    _kitMutateOrderDraft(kitId, function(orderDraft) {
        const meta = _kitGetOrderMeta(orderDraft);
        if (documento) meta.documento = documento;
        else if (!meta.documento) meta.documento = nome;
        _kitSetOrderMeta(orderDraft, meta);
    });

    const { kits } = _kitLoad();
    const kit = kits.find(k => k.id === kitId);
    if (!kit) { _kitCloseSaveDistintaModal(); notificaElegante('Kit non trovato ⚠️'); return; }
    const orderDraft = _kitGetOrderDraft(kit);
    const distinta = _kitBuildDistintaBase(kit, orderDraft);
    if (!distinta.totalePezzi || !distinta.totaleRighe) { notificaElegante('Componi prima un ordine per generare la distinta stampabile.', 'warning'); return; }

    const distList = _kitLoadDistinte();
    const saved = {
        id: _uid(),
        kitId: kit.id,
        kitNome: kit.nome,
        nome: nome || (orderDraft._meta?.documento || `Distinta-${Date.now()}`),
        documento: documento || orderDraft._meta?.documento || '',
        createdAt: Date.now(),
        createdBy: utenteAttuale?.nome || 'Sistema',
        orderDraftSnapshot: orderDraft,
        distintaSnapshot: distinta
    };
    distList.unshift(saved);
    _kitSaveDistinte(distList);
    _kitCloseSaveDistintaModal();
    notificaElegante('Distinta salvata ✓');
    if (_kitMainTab === 'distinte') _kitSwitchMainTab('distinte');
}

// ═════════════════════════════════════════════════════════════════════════════
// GLOBALS
// ═════════════════════════════════════════════════════════════════════════════

export function registerGlobals() {
    window._kitOpenView              = _kitOpenView;
    window._kitOpenConfig            = _kitOpenConfig;
    window._kitNuovoKit              = _kitNuovoKit;
    window._kitBack                  = _kitBack;
    window._kitOpenPrintPreview      = _kitOpenPrintPreview;
    window._kitSwitchTab             = _kitSwitchTab;
    window._kitAggiornaQty           = _kitAggiornaQty;
    window._kitOrdineSet             = _kitOrdineSet;
    window._kitOrdineDelta           = _kitOrdineDelta;
    window._kitOrdineReset           = _kitOrdineReset;
    window._kitOrdineResetVoce       = _kitOrdineResetVoce;
    window._kitOrderSearch           = _kitOrderSearch;
    window._kitOrderHideSearch       = _kitOrderHideSearch;
    window._kitOrderPick             = _kitOrderPick;
    window._kitOrderRemoveRef        = _kitOrderRemoveRef;
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
    window._kitDuplicaKit            = _kitDuplicaKit;
    window._kitCfgBack               = _kitCfgBack;
    window._kitCfgSwitchTab          = _kitCfgSwitchTab;
    window._kitCfgSaveNome           = _kitCfgSaveNome;
    window._kitCfgAddVar             = _kitCfgAddVar;
    window._kitCfgOpenImportModal    = _kitCfgOpenImportModal;
    window._kitCfgOpenImportAsseModal = _kitCfgOpenImportAsseModal;
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
    window._kitOpenPresetsModal      = _kitOpenPresetsModal;
    window._kitClosePresetsModal     = _kitClosePresetsModal;
    window._kitSetPresetsSearch      = _kitSetPresetsSearch;
    window._kitSelectPreset          = _kitSelectPreset;
    window._kitCreatePresetFromSection = _kitCreatePresetFromSection;
    window._kitCreatePreset           = _kitCreatePreset;
    window._kitApplyPreset           = _kitApplyPreset;
    window._kitRenamePreset          = _kitRenamePreset;
    window._kitDeletePreset          = _kitDeletePreset;
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
    window._kitSwitchMainTab          = _kitSwitchMainTab;
    window._kitRenderKitsGrid         = _kitRenderKitsGrid;
    window._kitRenderAnagrafichePage  = _kitRenderAnagrafichePage;
    window._kitRenderDistintePage     = _kitRenderDistintePage;
    window._kitLoadDistinte           = _kitLoadDistinte;
    window._kitSaveDistinte           = _kitSaveDistinte;
    window._kitCreateDistintaFromDraft = _kitCreateDistintaFromDraft;
    window._kitLoadAnagrafiche          = _kitLoadAnagrafiche;
    window._kitSaveAnagrafiche          = _kitSaveAnagrafiche;
    window._kitOpenAnagraficaModal      = _kitOpenAnagraficaModal;
    window._kitCloseAnagraficaModal     = _kitCloseAnagraficaModal;
    window._kitConfirmSaveAnagrafica    = _kitConfirmSaveAnagrafica;
    window._kitDeleteAnagrafica         = _kitDeleteAnagrafica;
    window._kitOpenCreaKit              = _kitOpenCreaKit;
    window._kitCloseCreaKit             = _kitCloseCreaKit;
    window._kitConfirmCreaKit           = _kitConfirmCreaKit;
    window._kitOpenConfigModal          = _kitOpenConfigModal;
    window._kitCloseConfigModal         = _kitCloseConfigModal;
    window._kitRenderConfigModal        = _kitRenderConfigModal;
    window._kitCfgModalSaveNome         = _kitCfgModalSaveNome;
    window._kitCfgModalAddAnag          = _kitCfgModalAddAnag;
    window._kitCfgModalAddCompFree      = _kitCfgModalAddCompFree;
    window._kitCfgModalUpdateSez        = _kitCfgModalUpdateSez;
    window._kitCfgModalDelSez           = _kitCfgModalDelSez;
    window._kitCfgModalUpdateComp       = _kitCfgModalUpdateComp;
    window._kitCfgModalUpdateCompRule   = _kitCfgModalUpdateCompRule;
    window._kitCfgModalDelComp          = _kitCfgModalDelComp;
    window._kitCfgModalAddAsse          = _kitCfgModalAddAsse;
    window._kitCfgModalDelAsse          = _kitCfgModalDelAsse;
    window._kitCfgModalUpdateAsse       = _kitCfgModalUpdateAsse;
    window._kitCfgModalAddOpz           = _kitCfgModalAddOpz;
    window._kitCfgModalDelOpz           = _kitCfgModalDelOpz;
    window._kitCfgModalUpdateOpz        = _kitCfgModalUpdateOpz;
    window._kitQAddSezOpen              = _kitQAddSezOpen;
    window._kitQAddSezClose             = _kitQAddSezClose;
    window._kitQAddSezConfirm           = _kitQAddSezConfirm;
    window._kitQAddCompOpen             = _kitQAddCompOpen;
    window._kitQAddCompToggleSource     = _kitQAddCompToggleSource;
    window._kitQAddCompChangeCategoria  = _kitQAddCompChangeCategoria;
    window._kitQAddCompClose            = _kitQAddCompClose;
    window._kitQAddCompConfirm          = _kitQAddCompConfirm;
    window._kitQUpdateComp              = _kitQUpdateComp;
    window._kitQRenomeSez               = _kitQRenomeSez;
    window._kitQDelComp                 = _kitQDelComp;
    window._kitQDelSez                  = _kitQDelSez;
    window._kitQDelKit                  = _kitQDelKit;
    window._kitRenderHeaderActions      = _kitRenderHeaderActions;
    window._kitOpenSaveDistintaModal   = _kitOpenSaveDistintaModal;
    window._kitCloseSaveDistintaModal  = _kitCloseSaveDistintaModal;
    window._kitConfirmSaveDistinta     = _kitConfirmSaveDistinta;
    window._kitDistintaOpenPrint      = _kitDistintaOpenPrint;
    window._kitDistintaApplyToDraft   = _kitDistintaApplyToDraft;
    window._kitDistintaDelete         = _kitDistintaDelete;
    // New-style kit globals
    window._kitNSToggleComp           = _kitNSToggleComp;
    window._kitNSSetUnits             = _kitNSSetUnits;
    window._kitNSOrderSearch          = _kitNSOrderSearch;
    window._kitNSOrderHideSearch      = _kitNSOrderHideSearch;
    window._kitNSOrderPick            = _kitNSOrderPick;
    window._kitNSOrderRemoveRef       = _kitNSOrderRemoveRef;
    window._kitNSReset                = _kitNSReset;
    window._kitNSToggleSection        = _kitNSToggleSection;
    window._kitNSToggleSectionChk     = _kitNSToggleSectionChk;
    window._kitNSCreateDistinta       = _kitNSCreateDistinta;
    window._kitNSOpenPrintPreview     = _kitNSOpenPrintPreview;
}

export default caricaKitProdotti;
