const fs = require('fs');
let _okCount = 0, _koCount = 0;
const ok = (label, v) => { console.log((v ? '[OK]' : '[KO]'), label); v ? _okCount++ : _koCount++; };
const idx  = fs.readFileSync('index.html', 'utf8');
const sw   = fs.readFileSync('sw.js', 'utf8');
const scr  = fs.readFileSync('script.js', 'utf8');
const cfg  = fs.readFileSync('modules/core/config.js', 'utf8');
const aq   = fs.readFileSync('modules/features/acquisti.js', 'utf8');
const hi   = fs.readFileSync('head-init.js', 'utf8');
const gas  = fs.readFileSync('../gas-backend/Codice.js', 'utf8');
const prod = fs.readFileSync('modules/features/produzione.js', 'utf8');
const api  = fs.readFileSync('modules/core/api.js', 'utf8');
const repo = fs.readFileSync('modules/core/repository.js', 'utf8');
const bun  = fs.readFileSync('dist/script.bundle.js', 'utf8');
const man  = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

ok('F5.1 head-init.js esiste',                    fs.existsSync('head-init.js'));
ok('F5.1 login fn NON inline in index',           !idx.includes('function verificaAccesso'));
ok('F5.1 head-init.js caricato in index',          idx.includes('head-init.js'));
ok('F5.1 CSP base-uri self',                       idx.includes("base-uri 'self'"));
ok('F5.1 CSP form-action self',                    idx.includes("form-action 'self'"));
ok('F5.2 PIN via POST in head-init',               hi.includes("method: 'POST'"));
ok('F5.2 PIN NON in querystring head-init',       !hi.includes('?azione=verificaPinAdmin'));
ok('F5.2 GAS doPost gestisce verificaPinAdmin',    gas.includes("azione === 'verificaPinAdmin'"));
ok('F5.3 _esc() sulle options in acquisti',        aq.includes('_esc(s)'));
ok('F6.1 Font Awesome preload non-blocking',       idx.includes('data-fa-nonblock'));
ok('F6.2 avatar requestIdleCallback',              scr.includes('requestIdleCallback'));
ok('F6.3 SHELL_CACHE_KEY rimosso da config',      !cfg.includes('SHELL_CACHE_KEY'));
ok('F7.2 manifest 4 icone (any+maskable x2)',      man.icons.length === 4);
ok('F7.2 manifest theme_color chiaro',             man.theme_color === '#f8fafc');
ok('F7.3 offline.html esiste',                     fs.existsSync('offline.html'));
ok('F7.3 offline.html in SHELL_ASSETS',            sw.includes('offline.html'));
ok('F7.3 fallback navigazione offline in SW',      sw.includes('isNavigate'));
ok('F7.3 SW SHELL_CACHE coerente',                 /prod-shell-v\d+/.test(sw) && sw.includes("SHELL_CACHE = 'prod-shell-v"));
ok('F8.1 modules/core/state.js esiste',            fs.existsSync('modules/core/state.js'));
ok('F8.2 modules/core/repository.js esiste',       fs.existsSync('modules/core/repository.js'));
ok('F8.3 _initModuliENaviga_ estratta in script',  scr.includes('_initModuliENaviga_'));
ok('F8.3 registerUIGlobals no doppie chiamate',   (scr.match(/registerUIGlobals\(\)/g) || []).length === 1);
ok('F8.3 RevisionPoller.start 1 sola occorrenza', (scr.match(/RevisionPoller\.start/g) || []).length === 1);
ok('F8.2 produzione.js importa da state.js',       prod.includes("from '../core/state.js'"));

// ═══════════════════════════════════════════════════════════════════════
//  FASE 1-5 — Check migliorie architetturali
// ═══════════════════════════════════════════════════════════════════════

// FASE 1: Timeout & Rate Limiting
ok('F1.1 api.js timeout AbortController',          api.includes('AbortController'));
ok('F1.2 api.js request dedup _inflight',           api.includes('_inflight'));
ok('F1.3 GAS rate limiting _checkRateLimit_',       gas.includes('_checkRateLimit_'));

// FASE 2: Dedup & LS Keys
ok('F2.1 ls-keys.js esiste',                       fs.existsSync('modules/core/ls-keys.js'));
ok('F2.2 ls-cache.js esiste',                      fs.existsSync('modules/core/ls-cache.js'));

// FASE 3: DnD unificato
ok('F3.1 dnd.js esiste',                           fs.existsSync('modules/core/dnd.js'));
ok('F3.2 produzione.js importa dnd helpers',        prod.includes("from '../core/dnd.js'"));

// FASE 4: Split file monolitici
ok('F4.1 impostazioni-qr.js estratto',             fs.existsSync('modules/features/impostazioni-qr.js'));

// FASE 5: Sicurezza — POST migration & token rotation
ok('F5.4 token NON in GET (fetch interceptor)',    !bun.includes("sessionToken=' + ") && !bun.includes('sessionToken=\' +'));
ok('F5.5 GAS token rotation implementata',          gas.includes('TOKEN_ROTATION_MS'));
ok('F5.6 GAS POST assegnaOperatori',               gas.includes("azione === 'assegnaOperatori'") && gas.includes("_azionePostRichiedeSessione_"));
ok('F5.7 prefetch matPromise usa POST',            !scr.includes("?pagina=MATERIALE"));
ok('F5.8 repository fetchMateriale POST',           repo.includes('gasRequestWithTimeout'));

// Struttura bundle
ok('F6.4 bundle dist/ esiste',                     fs.existsSync('dist/script.bundle.js'));
ok('F6.5 bundle code-split chunks',                fs.readdirSync('dist').filter(f => f.startsWith('chunk-')).length >= 2);

const ver = (idx.match(/\?v=(\d{8}[a-z])/) || [])[1];
const swv = (sw.match(/prod-shell-(v\d+)/) || [])[1];
const gasVer = (gas.match(/@(\d+)/) || [])[1] || '?';
console.log(`\nAPP: ${ver} / SW: ${swv} / GAS: latest`);
console.log(`CHECK: ${_okCount} OK, ${_koCount} KO — ${_koCount === 0 ? 'ALL PASS ✔' : _koCount + ' FAILED ✘'}`);
