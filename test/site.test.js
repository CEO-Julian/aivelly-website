// Testy strony AIVELLY. Uruchom: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSite } from '../scripts/check.mjs';
import { createServer } from '../scripts/serve.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const html = read('public/index.html');

// Browser scripts register themselves on globalThis.
await import('../public/assets/js/validation.js');
await import('../public/demo/salon-data.js');
await import('../public/demo/engine.js');
const { validateContact } = globalThis.AivellyValidation;
const { answerQuestion } = globalThis.DemoEngine;
const salon = globalThis.DEMO_SALON;

// ---------------- Build check (same as Render "Build Command") ----------------
test('build check passes: all links and files exist, no secrets', () => {
  const { problems } = checkSite();
  assert.deepEqual(problems, []);
});

test('build check catches broken links and secrets', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aivelly-'));
  fs.writeFileSync(path.join(dir, 'index.html'),
    '<html lang="pl"><title>Test strony</title><a href="#brak">x</a><img src="/nie-ma.png"><script>const k="sk-ant-abc"</script></html>');
  const { problems } = checkSite(dir);
  assert.equal(problems.length, 3, problems.join('\n'));
});

// ---------------- Content & structure ----------------
test('all required sections, texts and navigation are present', () => {
  for (const id of ['rozwiazania', 'branze', 'demo', 'o-nas', 'kontakt']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, />AIVELLY</);
  assert.match(html, /INTELLIGENCE, REFINED\./);
  assert.match(html, /Inteligentne rozwiązania dla nowoczesnych firm\./);
  assert.match(html, /Automatyzujemy obsługę klientów i pomagamy Twojemu biznesowi rosnąć dzięki sztucznej inteligencji\./);
  for (const label of ['Rozwiązania', 'Branże', 'O nas', 'Kontakt', 'Umów rozmowę', 'Poznaj Aivelly', 'Zobacz demo']) {
    assert.ok(html.includes(label), label);
  }
  for (const b of ['Beauty', 'Hotele', 'Gastronomia', 'Kliniki', 'E-commerce', 'Usługi profesjonalne']) {
    assert.ok(html.includes(`<dt>${b}</dt>`), b);
  }
  assert.match(html, /href="#kontakt"[^>]*>Umów rozmowę/);
  assert.match(html, /href="#rozwiazania">Poznaj Aivelly/);
  assert.match(html, /href="#demo">Zobacz demo/);
});

test('brand colours are used exactly', () => {
  const css = read('public/assets/css/style.css');
  for (const c of ['#0B0B0C', '#1A1A1D', '#D7C5A1', '#F5F1E9', '#8B8B8F']) assert.ok(css.includes(c), c);
});

test('basic SEO and accessibility', () => {
  assert.match(html, /<html lang="pl">/);
  assert.match(html, /<title>[^<]+AIVELLY|AIVELLY[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{50,160}">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /application\/ld\+json/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'exactly one h1');
  // every <button> declares its type; every form control has a label
  for (const m of html.matchAll(/<button\b[^>]*>/g)) assert.match(m[0], /type="(button|submit)"/, m[0]);
  for (const m of html.matchAll(/<(input|select|textarea)\b[^>]*\sid="([^"]+)"/g)) {
    assert.ok(html.includes(`for="${m[2]}"`), `label for #${m[2]}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, 'public/robots.txt')));
});

test('demo is clearly labelled and the site invents no clients or achievements', () => {
  assert.match(html, /<strong>Demonstracja\.<\/strong>/);
  assert.match(html, /fikcyjn/);
  assert.match(html, /chat-badge">DEMO</);
  assert.doesNotMatch(html, /zaufali nam|nasi klienci|klientów zaufało|referencj|\d+\+?\s*(wdrożeń|klientów|projektów)|nagrod/i);
});

// ---------------- Contact form validation ----------------
const valid = {
  name: 'Anna Kowalska', email: 'anna@firma.pl', company: '', industry: 'Beauty',
  message: 'Chcę wdrożyć chatbota w salonie.', consent: true, website: '',
};

test('contact form: valid data passes', () => {
  const r = validateContact(valid);
  assert.equal(r.valid, true);
  assert.equal(r.spam, false);
});

test('contact form: each required field is validated', () => {
  const cases = {
    name: { name: '' }, email: { email: 'anna@' }, industry: { industry: '' },
    message: { message: 'hej' }, consent: { consent: false },
  };
  for (const [field, change] of Object.entries(cases)) {
    const r = validateContact({ ...valid, ...change });
    assert.equal(r.valid, false, field);
    assert.ok(r.errors[field], field);
  }
  assert.ok(validateContact({ ...valid, message: 'x'.repeat(2001) }).errors.message);
  assert.ok(validateContact({}).errors.email);
});

test('contact form: honeypot flags bots', () => {
  assert.equal(validateContact({ ...valid, website: 'http://spam' }).spam, true);
});

test('contact form never claims success without a configured endpoint', () => {
  const config = read('public/assets/js/config.js');
  assert.match(config, /formEndpoint: ''/);
  const main = read('public/assets/js/main.js');
  // the success message only exists inside the formEndpoint branch
  const successIdx = main.indexOf('wiadomość została wysłana');
  const endpointIdx = main.indexOf('if (config.formEndpoint)');
  const emailIdx = main.indexOf('if (config.contactEmail)');
  assert.ok(endpointIdx > 0 && successIdx > endpointIdx && successIdx < emailIdx);
  assert.match(main, /nie została wysłana/);
});

// ---------------- Chatbot demo ----------------
test('chatbot demo answers from fictional salon data and keeps its safety rules', () => {
  assert.match(answerQuestion('Ile kosztuje manicure hybrydowy?', salon).reply, /130 zł/);
  assert.match(answerQuestion('Czym się różni henna od laminacji brwi?', salon).reply, /Laminacja brwi – 150 zł/);
  assert.match(answerQuestion('Czy macie wolny termin jutro?', salon).reply, /nie podam wolnych terminów/);
  assert.match(answerQuestion('Czy mogę zrobić peeling w ciąży?', salon).reply, /Nie mogę udzielać porad medycznych/);
  assert.match(answerQuestion('Ile kosztuje mikrodermabrazja?', salon).reply, /skontaktuj się/i);
});

// ---------------- Local preview server & Render config ----------------
test('local preview server serves pages, 404 and blocks path tricks', async (t) => {
  const server = createServer();
  await new Promise((r) => server.listen(0, r));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(base + '/')).status, 200);
  assert.equal((await fetch(base + '/polityka-prywatnosci.html')).status, 200);
  assert.equal((await fetch(base + '/demo/engine.js')).status, 200);
  const missing = await fetch(base + '/nie-istnieje');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Nie znaleziono/);
  assert.equal((await fetch(base + '/..%2fpackage.json')).status, 403);
});

test('render.yaml describes a free static site publishing ./public', () => {
  const y = read('render.yaml');
  assert.match(y, /runtime: static/);
  assert.match(y, /staticPublishPath: \.\/public/);
  assert.match(y, /buildCommand: npm run build/);
  assert.doesNotMatch(y, /plan:/);
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts.build, 'node scripts/check.mjs');
  assert.equal(Object.keys(pkg.dependencies || {}).length, 0, 'no dependencies to install');
});
