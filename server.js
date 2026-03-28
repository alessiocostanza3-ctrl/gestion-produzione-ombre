'use strict';

const http = require('node:http');
const fs   = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = __dirname;

// Tipi MIME completi (aggiunto svg, webp, woff2, woff, ttf, map, jpg)
const MIME = {
  html:  'text/html; charset=utf-8',
  css:   'text/css; charset=utf-8',
  js:    'application/javascript; charset=utf-8',
  mjs:   'application/javascript; charset=utf-8',
  png:   'image/png',
  jpg:   'image/jpeg',
  jpeg:  'image/jpeg',
  webp:  'image/webp',
  svg:   'image/svg+xml',
  json:  'application/json; charset=utf-8',
  ico:   'image/x-icon',
  woff:  'font/woff',
  woff2: 'font/woff2',
  ttf:   'font/ttf',
  map:   'application/json',
};

// Header di sicurezza aggiunti a ogni risposta
const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options':        'SAMEORIGIN',
};

// Cache-Control differenziato per tipo di risorsa
function cacheHeader(ext, hasVersion) {
  if (ext === 'html') return 'no-cache, no-store, must-revalidate';
  if ((ext === 'css' || ext === 'js') && hasVersion) return 'public, max-age=31536000, immutable';
  if (['woff','woff2','ttf','png','jpg','jpeg','webp','ico'].includes(ext)) return 'public, max-age=86400';
  return 'no-cache';
}

const server = http.createServer((req, res) => {
  const urlPath    = req.url.split('?')[0];
  const hasVersion = /[?&]v=/.test(req.url);
  const filePath   = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath.slice(1));

  // Protezione path traversal: blocca qualsiasi richiesta fuori dalla ROOT
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    res.writeHead(403, SEC_HEADERS);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, SEC_HEADERS);
      return res.end('Not found');
    }

    const ext         = path.extname(filePath).slice(1).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    const cache       = cacheHeader(ext, hasVersion);
    const acceptEnc   = req.headers['accept-encoding'] || '';
    const compressExt = ['html','css','js','json','svg'];
    const canBrotli   = /br/.test(acceptEnc) && compressExt.includes(ext);
    const canGzip     = !canBrotli && /gzip/.test(acceptEnc) && compressExt.includes(ext);

    const headers = {
      ...SEC_HEADERS,
      'Content-Type':  contentType,
      'Cache-Control': cache,
    };

    function sendRaw() {
      headers['Content-Length'] = data.length;
      res.writeHead(200, headers);
      res.end(data);
    }

    if (canBrotli) {
      zlib.brotliCompress(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } }, (brErr, compressed) => {
        if (brErr) { console.warn('[server] brotli fallito:', brErr.message); return sendRaw(); }
        headers['Content-Encoding'] = 'br';
        headers['Vary']             = 'Accept-Encoding';
        headers['Content-Length']   = compressed.length;
        res.writeHead(200, headers);
        res.end(compressed);
      });
    } else if (canGzip) {
      zlib.gzip(data, (gzErr, compressed) => {
        if (gzErr) { console.warn('[server] gzip fallito:', gzErr.message); return sendRaw(); }
        headers['Content-Encoding'] = 'gzip';
        headers['Vary']             = 'Accept-Encoding';
        headers['Content-Length']   = compressed.length;
        res.writeHead(200, headers);
        res.end(compressed);
      });
    } else {
      sendRaw();
    }
  });
});

server.listen(5500, '0.0.0.0', () => {
  const os   = require('node:os');
  const nets = os.networkInterfaces();
  let localIp = 'localhost';
  for (const n of Object.values(nets)) {
    for (const net of n) {
      if (net.family === 'IPv4' && !net.internal) { localIp = net.address; break; }
    }
    if (localIp !== 'localhost') break;
  }
  console.log('SERVER OK  →  http://localhost:5500');
  console.log('>>> IPHONE →  http://' + localIp + ':5500');
});

// Graceful shutdown: chiude le connessioni attive prima di uscire
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT',  () => server.close(() => process.exit(0)));
