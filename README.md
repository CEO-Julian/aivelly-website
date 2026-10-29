# AIVELLY – strona internetowa

Statyczna, responsywna strona marki AIVELLY z interaktywnym demo chatbota. Przygotowana do darmowej publikacji na Render.

## Co jest w środku

```
aivelly-website/
├── public/                      ← TO jest publikowana strona
│   ├── index.html               ← strona główna (wszystkie sekcje)
│   ├── polityka-prywatnosci.html← szkic polityki prywatności
│   ├── 404.html                 ← strona „nie znaleziono”
│   ├── robots.txt, favicon.svg
│   ├── assets/css/style.css     ← wygląd (kolory marki na górze pliku)
│   ├── assets/js/config.js      ← ustawienia formularza (bez sekretów)
│   ├── assets/js/validation.js  ← walidacja formularza
│   ├── assets/js/main.js        ← menu, animacja, formularz
│   └── demo/                    ← demo chatbota (działa w przeglądarce)
├── scripts/check.mjs            ← sprawdzenie strony (Render uruchamia je przy publikacji)
├── scripts/serve.mjs            ← podgląd lokalny
├── scripts/sync-demo.mjs        ← odświeżenie demo z projektu beauty-ai-assistant
├── test/site.test.js            ← testy automatyczne
├── render.yaml                  ← konfiguracja Render (opcjonalna – patrz niżej)
└── package.json
```

Projekt nie ma żadnych zależności do instalowania (`npm install` nie jest potrzebne).

## Co działa, a co jest demonstracją

| Element | Stan |
|---|---|
| Wszystkie sekcje, nawigacja, przyciski i linki | ✅ działa |
| Wygląd na telefonie, tablecie i komputerze | ✅ sprawdzone |
| Demo chatbota | 🟡 **demonstracja** – fikcyjny salon, reguły w przeglądarce, bez AI i bez serwera |
| Formularz kontaktowy – walidacja | ✅ działa |
| Formularz kontaktowy – wysyłka | ⚠️ **niepodłączona** – formularz uczciwie informuje, że wiadomość nie została wysłana (patrz „Podłączenie formularza”) |
| Polityka prywatności | ⚠️ szkic – uzupełnij przed podłączeniem formularza |
| Dane rejestrowe firmy w stopce | ⚠️ do uzupełnienia |
| Własna domena | ⚠️ opcjonalnie później |

---

## Podgląd na Twoim komputerze (opcjonalnie)

Wymaga Node.js (wersja LTS z <https://nodejs.org>).

```
cd aivelly-website
npm start        # podgląd: http://localhost:8080
npm run build    # sprawdzenie linków i sekretów (to samo robi Render)
npm test         # testy automatyczne
```

---

## Publikacja – krok po kroku (bez terminala i bez Gita)

### Krok 1. Konto GitHub i repozytorium
1. Wejdź na <https://github.com> → **Sign up** (jeśli nie masz konta). Darmowe konto wystarczy.
2. Po zalogowaniu kliknij **+** w prawym górnym rogu → **New repository**.
3. *Repository name*: `aivelly-website`. Widoczność: **Public** albo **Private** (obie działają z Render).
4. Nie zaznaczaj żadnych opcji dodatkowych. Kliknij **Create repository**.
5. Na nowej stronie kliknij link **uploading an existing file**.
6. Rozpakuj `aivelly-website.zip` na komputerze. Otwórz folder `aivelly-website` i **zaznacz całą jego zawartość** (folder `public`, `scripts`, `test` oraz pliki `package.json`, `render.yaml`, `README.md`) – przeciągnij ją do okna przeglądarki.
   - Ważne: `package.json` i folder `public` muszą być na *najwyższym poziomie* repozytorium, a nie w podfolderze.
7. Na dole kliknij **Commit changes**.

### Krok 2. Konto Render i strona statyczna
1. Wejdź na <https://render.com> → **Get Started** → zaloguj się przez **GitHub**. Strona statyczna jest darmowa – jeśli Render poprosi o kartę płatniczą lub wybór płatnego planu, zatrzymaj się (nie jest potrzebny).
2. W panelu kliknij **New** → **Static Site**.
3. Połącz konto GitHub, jeśli Render o to poprosi, i wybierz repozytorium `aivelly-website`.
4. Uzupełnij:
   - **Name:** `aivelly` (od tego zależy adres – jeśli jest zajęty, Render doda dopisek)
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `public`
5. Kliknij **Create Static Site** (lub **Deploy Static Site**).
6. Poczekaj, aż status zmieni się na **Live**. W logach zobaczysz: `✓ Strona gotowa do publikacji`.
7. Adres strony (np. `https://aivelly.onrender.com`) jest u góry panelu.

**Nagłówki bezpieczeństwa (zalecane):** po utworzeniu strony wejdź w **Settings → Headers** i dodaj dla ścieżki `/*` wartości z pliku `render.yaml` (X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, Content-Security-Policy). Alternatywnie zamiast kroku 2 możesz użyć **New → Blueprint**, który odczyta `render.yaml` automatycznie.

### Krok 3. Sprawdzenie publicznego adresu
Otwórz adres na komputerze i na telefonie (najlepiej przez sieć komórkową, nie Wi‑Fi) i sprawdź:
- [ ] strona się otwiera, na pasku adresu jest kłódka (HTTPS),
- [ ] wszystkie pozycje menu przewijają do właściwych sekcji, menu na telefonie się otwiera i zamyka,
- [ ] demo czatu odpowiada (np. „Ile kosztuje manicure hybrydowy?”),
- [ ] formularz pokazuje błędy przy pustych polach, a po poprawnym wypełnieniu – komunikat, że wiadomość nie została wysłana,
- [ ] link „Polityka prywatności” działa.

### Aktualizacje strony
Każda zmiana plików w repozytorium GitHub (np. przez **Add file → Upload files**) automatycznie publikuje nową wersję. Jeśli sprawdzenie (`npm run build`) wykryje błąd, Render nie podmieni działającej wersji.

---

## Koszty i ograniczenia (stan wg dokumentacji Render, październik 2026)

- **Strona statyczna: 0 zł.** Jest serwowana z CDN i – w odróżnieniu od darmowych *Web Service* – nie „zasypia”. To najprostszy sposób na działanie 24/7 bez opłat.
- **Limit transferu:** konto Hobby ma 5 GB transferu miesięcznie wliczone; powyżej $0.15 za GB. Dla strony wizytówki to zwykle wystarcza z dużym zapasem. Bez karty w koncie przekroczenie limitu może skutkować wstrzymaniem strony – zużycie widać w panelu Render.
- **Darmowy Web Service (gdyby kiedyś był potrzebny backend):** usypia się po 15 minutach bez ruchu, wybudzenie trwa ok. minuty. Bez usypiania – najtańszy płatny wariant ok. **$7/mies.** Teraz **nie jest potrzebny**.
- **HTTPS:** za darmo, automatycznie.

## Własna domena (później)
1. Kup domenę u dowolnego rejestratora (to jedyny wydatek).
2. W Render: **Settings → Custom Domains → Add**, wpisz domenę.
3. U rejestratora ustaw rekordy DNS, które pokaże Render. Certyfikat HTTPS Render wystawi sam.

## Podłączenie formularza (później)
Formularz nic nie wysyła, dopóki nie uzupełnisz `public/assets/js/config.js`:
- **Formspree** (darmowy plan na start): załóż formularz na <https://formspree.io>, skopiuj jego adres i wpisz go w `formEndpoint`, np. `'https://formspree.io/f/abcdwxyz'`. Ten adres jest publiczny – to nie jest sekret.
- albo tylko **`contactEmail`** – wtedy odwiedzający dostanie przycisk otwierający jego program pocztowy z gotową wiadomością.

Przed uruchomieniem wysyłki uzupełnij politykę prywatności (administrator danych, cel, czas przechowywania, prawa osób – RODO).

**Nigdy nie wpisuj kluczy API ani haseł do plików w `public/`** – wszystko w tym folderze jest publicznie widoczne. Sprawdzenie `npm run build` zatrzyma publikację, jeśli wykryje coś, co wygląda na klucz.
