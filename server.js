const http = require('http');
const fs   = require('fs');
const path = require('path');
const ROOT = __dirname;
const mime = {
  html: 'text/html', css: 'text/css',
  js: 'application/javascript', png: 'image/png',
  json: 'application/json', ico: 'image/x-icon'
};
http.createServer((req, res) => {
  let u = req.url.split('?')[0];
  let f = path.join(ROOT, u === '/' ? 'index.html' : u.slice(1));
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    let ext = path.extname(f).slice(1);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(5500, '127.0.0.1', () => console.log('SERVER OK http://localhost:5500'));
