import { build } from 'esbuild';
import { readdirSync, unlinkSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Bump versione Service Worker — garantisce che ogni deploy invalidi la shell cache
try {
  const swPath = 'sw.js';
  const swContent = readFileSync(swPath, 'utf8');
  const updated = swContent.replace(/(prod-shell-v)(\d+)/g, (_, prefix, num) => prefix + (parseInt(num, 10) + 1));
  if (updated !== swContent) {
    writeFileSync(swPath, updated, 'utf8');
    const newVer = (updated.match(/(prod-shell-v)(\d+)/) || [])[2] || '?';
    console.log('  SW cache bumped → prod-shell-v' + newVer);
  }
} catch (err) {
  console.warn('  SW bump skipped:', err.message);
}

// Pulisci la cartella dist prima del build
try {
  for (const f of readdirSync('dist')) {
    unlinkSync(join('dist', f));
  }
} catch { /* dist may not exist */ }

await build({
  entryPoints: ['script.js'],
  bundle: true,
  outdir: 'dist',
  entryNames: 'script.bundle',
  chunkNames: 'chunk-[name]-[hash]',
  splitting: true,
  format: 'esm',
  minify: true,
  sourcemap: true,
  target: ['es2020'],
});

// Elenca i file generati
for (const f of readdirSync('dist').filter(f => !f.endsWith('.map'))) {
  console.log('  ' + f);
}
console.log('Build completato.');
