// scripts/sync-demo.mjs – kopiuje silnik demo i fikcyjne dane salonu z projektu
// ../beauty-ai-assistant do public/demo/, w wersji działającej w przeglądarce.
// Uruchamiaj tylko lokalnie, gdy zmienisz chatbota: npm run sync-demo
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..', '..', 'beauty-ai-assistant');
const OUT = path.join(HERE, '..', 'public', 'demo');

if (!fs.existsSync(path.join(SRC, 'lib', 'engine.js'))) {
  console.error('Nie znaleziono projektu ../beauty-ai-assistant – pomijam synchronizację.');
  process.exit(1);
}

const engine = fs.readFileSync(path.join(SRC, 'lib', 'engine.js'), 'utf8');
if (/require\(/.test(engine)) {
  console.error('engine.js używa require() – nie da się go uruchomić w przeglądarce bez zmian.');
  process.exit(1);
}
const indent = (t) => t.replace(/^(?=.)/gm, '  ');
fs.writeFileSync(
  path.join(OUT, 'engine.js'),
  '// AUTO-COPIED from beauty-ai-assistant/lib/engine.js (demo engine only). Regenerate with: npm run sync-demo\n' +
    "(function (root) {\n  'use strict';\n  var module = { exports: {} };\n" +
    indent(engine) +
    "  root.DemoEngine = module.exports;\n})(typeof window !== 'undefined' ? window : globalThis);\n"
);

const salon = JSON.parse(fs.readFileSync(path.join(SRC, 'data', 'salon.json'), 'utf8'));
fs.writeFileSync(
  path.join(OUT, 'salon-data.js'),
  '// Fikcyjne dane salonu do demonstracji (kopia beauty-ai-assistant/data/salon.json).\n' +
    '(function (root) {\n  root.DEMO_SALON = ' + JSON.stringify(salon, null, 2).replace(/\n/g, '\n  ') +
    ";\n})(typeof window !== 'undefined' ? window : globalThis);\n"
);
console.log('✓ Zaktualizowano public/demo/engine.js i public/demo/salon-data.js');
