// scripts/make-flat.mjs – tworzy wersję strony BEZ podfolderów (dist-flat/),
// do wgrania na GitHub przez przeglądarkę, gdy przeciąganie folderów nie działa.
// Wszystkie pliki leżą w jednym folderze, a Render publikuje cały katalog główny.
//   npm run flat
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'dist-flat');

// file in public/  ->  name in the flat folder
const MAP = {
  'index.html': 'index.html',
  'polityka-prywatnosci.html': 'polityka-prywatnosci.html',
  '404.html': '404.html',
  'robots.txt': 'robots.txt',
  'favicon.svg': 'favicon.svg',
  'assets/css/style.css': 'style.css',
  'assets/js/boot.js': 'boot.js',
  'assets/js/config.js': 'config.js',
  'assets/js/validation.js': 'validation.js',
  'assets/js/main.js': 'main.js',
  'demo/salon-data.js': 'salon-data.js',
  'demo/engine.js': 'engine.js',
  'demo/chat.js': 'chat.js',
};

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);

for (const [from, to] of Object.entries(MAP)) {
  let text = fs.readFileSync(path.join(PUB, from), 'utf8');
  if (from.endsWith('.html')) {
    for (const [f, t] of Object.entries(MAP)) text = text.split(`"/${f}"`).join(`"/${t}"`);
  }
  fs.writeFileSync(path.join(OUT, to), text);
}

// Build check for the flat folder (Render runs it as the Build Command).
let check = fs.readFileSync(path.join(ROOT, 'scripts', 'check.mjs'), 'utf8');
check = check
  .replace("path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')", 'path.dirname(fileURLToPath(import.meta.url))')
  .replace("if (!/\\.(html|js|css|txt|json|svg)$/.test(file)) continue;",
    "if (!/\\.(html|js|css|txt|json|svg)$/.test(file) || /check\\.mjs$/.test(file)) continue;");
fs.writeFileSync(path.join(OUT, 'check.mjs'), check);

fs.writeFileSync(path.join(OUT, 'package.json'), JSON.stringify({
  name: 'aivelly-website',
  version: '1.0.0',
  private: true,
  type: 'module',
  scripts: { build: 'node check.mjs' },
  license: 'UNLICENSED',
}, null, 2) + '\n');

const yaml = fs.readFileSync(path.join(ROOT, 'render.yaml'), 'utf8')
  .replace('staticPublishPath: ./public', 'staticPublishPath: ./');
fs.writeFileSync(path.join(OUT, 'render.yaml'), yaml);

console.log(`✓ dist-flat/ gotowe (${fs.readdirSync(OUT).length} plików, bez podfolderów)`);
