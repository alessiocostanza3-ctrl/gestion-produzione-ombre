import { build } from 'esbuild';
import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

// Pulisci la cartella dist prima del build
try {
  for (const f of readdirSync('dist')) {
    unlinkSync(join('dist', f));
  }
} catch(e) {}

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
