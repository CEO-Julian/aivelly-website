// scripts/check.mjs – sprawdza stronę przed publikacją.
// Render uruchamia ten skrypt jako "Build Command". Jeśli znajdzie błąd,
// publikacja zostaje zatrzymana i stara wersja strony działa dalej.
//
// Sprawdza:
//  - czy każdy lokalny link/plik (href, src) w plikach HTML istnieje,
//  - czy każdy link do sekcji (#kontakt itd.) prowadzi do istniejącego id,
//  - czy w plikach strony nie ma kluczy API ani sekretów.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );
}

export function checkSite(root = ROOT) {
  const problems = [];
  const files = listFiles(root);
  const htmlFiles = files.filter((f) => f.endsWith('.html'));

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const url = m[1];
      if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
      if (url.startsWith('#')) {
        if (url !== '#' && !ids.has(url.slice(1))) problems.push(`${rel}: link ${url} – brak elementu o tym id`);
        continue;
      }
      const [p, hash] = url.split('#');
      const target = path.join(root, p.startsWith('/') ? p.slice(1) : path.join(path.dirname(rel), p));
      const resolved = fs.existsSync(target) && fs.statSync(target).isDirectory() ? path.join(target, 'index.html') : target;
      if (!fs.existsSync(resolved)) {
        problems.push(`${rel}: ${url} – plik nie istnieje`);
      } else if (hash && resolved.endsWith('.html')) {
        const other = fs.readFileSync(resolved, 'utf8');
        if (!other.includes(`id="${hash}"`)) problems.push(`${rel}: ${url} – brak #${hash} w pliku docelowym`);
      }
    }
    if (!/<title>[^<]{5,}<\/title>/.test(html)) problems.push(`${rel}: brak tytułu strony`);
    if (!/<html lang="pl">/.test(html)) problems.push(`${rel}: brak lang="pl"`);
  }

  for (const file of files) {
    if (!/\.(html|js|css|txt|json|svg)$/.test(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (/sk-ant-|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api\.anthropic\.com|-----BEGIN [A-Z ]*PRIVATE KEY/.test(text)) {
      problems.push(`${path.relative(root, file)}: wygląda na klucz API lub sekret – usuń go z plików strony`);
    }
  }

  return { problems, htmlCount: htmlFiles.length, fileCount: files.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { problems, htmlCount, fileCount } = checkSite();
  if (problems.length) {
    console.error('✗ Znaleziono problemy:\n' + problems.map((p) => '  - ' + p).join('\n'));
    process.exit(1);
  }
  console.log(`✓ Strona gotowa do publikacji (${htmlCount} stron HTML, ${fileCount} plików, wszystkie linki działają).`);
}
