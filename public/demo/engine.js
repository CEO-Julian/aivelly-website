// AUTO-COPIED from beauty-ai-assistant/lib/engine.js (demo engine only). Regenerate with: npm run sync-demo
(function (root) {
  'use strict';
  var module = { exports: {} };
  // lib/engine.js
  // -----------------------------------------------------------------------------
  // The "brain" of the demo. It answers visitor questions using ONLY the data in
  // data/salon.json. It never makes up prices, free appointment slots or medical
  // advice. If it does not know something, it tells the visitor to contact the
  // salon.
  //
  // Everything here is plain JavaScript with no external libraries, so it runs
  // the same on any computer with Node.js installed.
  // -----------------------------------------------------------------------------

  const TIME_ZONE = 'Europe/Warsaw';

  // ---------------------------------------------------------------------------
  // Text helpers
  // ---------------------------------------------------------------------------

  // Lowercase, remove Polish diacritics and punctuation, so "Ile kosztuje Hennę?"
  // and "ile kosztuje henne" are treated the same.
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/ł/g, 'l')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Does a keyword appear at the START of a word in the text?
  // (so "pach" matches "pachy" but not "zapach").
  function hasWordStart(normText, keyword) {
    return (' ' + normText).includes(' ' + keyword);
  }

  function anyKeyword(normText, keywords) {
    return keywords.some((k) => hasWordStart(normText, k));
  }

  // Length of the longest keyword that matches (0 = no match). Longer, more
  // specific keywords win over short, generic ones.
  function bestKeywordScore(normText, keywords) {
    let best = 0;
    for (const k of keywords) {
      if (hasWordStart(normText, k) && k.length > best) best = k.length;
    }
    return best;
  }

  // ---------------------------------------------------------------------------
  // Keyword lists (already normalized: no Polish letters, lowercase)
  // ---------------------------------------------------------------------------

  const MEDICAL = [
    'ciaz', 'w ciazy', 'karmie piersia', 'karmienie', 'alergi', 'uczul', 'chorob', 'choruj',
    'leki', 'lekow', 'lekami', 'lekarstw', 'antybiotyk', 'retinoid', 'izotretynoin', 'cukrzyc',
    'luszczyc', 'egzem', 'atopow', 'tradzik', 'rozacea', 'tradzik rozowat', 'opryszcz',
    'zapaleni', 'infekcj', 'grzybic', 'rana', 'rany', 'nowotw', 'chemioterap', 'rozrusznik',
    'padaczk', 'epilepsj', 'zakrzep', 'zylak', 'przeciwwskaz', 'bezpieczn', 'szkodliw',
    'wysypk', 'podrazni', 'swedz', 'piecze', 'boli', 'bol', 'zaczerwien', 'opuchl', 'obrzek',
    'botoks', 'botox', 'kwas hialuron', 'wypelniacz', 'mezoterap', 'zastrzyk', 'iniekcj',
    'diagnoz', 'lekarz', 'dermatolog', 'blizn', 'znamie', 'pieprzyk', 'brodawk', 'kurzajk',
  ];

  const AVAILABILITY = [
    'woln', 'termin', 'dostepn', 'zarezerw', 'rezerw', 'umow', 'zapis', 'grafik',
    'kalendarz', 'na kiedy',
  ];

  // Narrower list used in AI mode: questions that are really about FREE SLOTS.
  // ("Chcę się umówić na hennę" is booking intent, not a slot question.)
  const SLOTS = [
    'woln', 'grafik', 'kalendarz', 'na kiedy', 'najblizsz', 'termin', 'dostepne termin',
    'dostepny termin', 'dostepnosc',
  ];

  const COMPARE = [
    'roznic', 'rozni', 'porown', 'co lepsze', 'lepsz', 'versus', 'vs', 'czy raczej', 'co wybrac',
    'ktory wybrac', 'ktora wybrac', 'co polecasz', 'co polecacie',
  ];

  const HOURS = [
    'godzin', 'otwar', 'czynn', 'zamkn', 'kiedy pracuj', 'do ktorej', 'od ktorej',
    'poniedzialek', 'poniedzialk', 'wtorek', 'wtork', 'sroda', 'srode', 'srod', 'czwartek',
    'czwartk', 'piatek', 'piatk', 'sobot', 'niedziel', 'weekend', 'swiet', 'dzis', 'dzisiaj',
    'jutro',
  ];

  const CONTACT = [
    'adres', 'gdzie', 'dojazd', 'dojecha', 'dojsc', 'lokaliz', 'telefon', 'numer', 'zadzwon',
    'kontakt', 'mail', 'email', 'e mail', 'parking', 'zaparkow', 'parkow',
  ];

  const PRICE = ['ile kosztuj', 'ile kosztowa', 'ile placi', 'ile zaplac', 'ile to', 'cen', 'koszt', 'drogo', 'tanio', 'zlot', 'pln'];

  const PRICE_LIST = ['cennik', 'ceny', 'cen uslug', 'oferta', 'oferte', 'oferty', 'uslug', 'zabiegi', 'zabiegow', 'co robicie', 'co oferujecie', 'w czym', 'jakie zabiegi', 'jakie uslugi'];

  const GREETING = ['czesc', 'dzien dobry', 'dobry wieczor', 'hej', 'witam', 'witaj', 'siema', 'hello'];

  const THANKS = ['dzieki', 'dziekuje', 'dziekuj', 'super dzieki', 'thx', 'thanks'];

  const DAY_ALIASES = {
    poniedzialek: ['poniedzialek', 'poniedzialk'],
    wtorek: ['wtorek', 'wtork'],
    sroda: ['sroda', 'srode', 'srod'],
    czwartek: ['czwartek', 'czwartk'],
    piatek: ['piatek', 'piatk'],
    sobota: ['sobot'],
    niedziela: ['niedziel'],
  };

  // "w sobotę", "we wtorek" – correct Polish grammar for "on <day>".
  const DAY_LOCATIVE = {
    poniedzialek: 'w poniedziałek', wtorek: 'we wtorek', sroda: 'w środę', czwartek: 'w czwartek',
    piatek: 'w piątek', sobota: 'w sobotę', niedziela: 'w niedzielę',
  };

  function capitalize(t) {
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  const EN_TO_PL_DAY = {
    Monday: 'poniedzialek', Tuesday: 'wtorek', Wednesday: 'sroda', Thursday: 'czwartek',
    Friday: 'piatek', Saturday: 'sobota', Sunday: 'niedziela',
  };

  // ---------------------------------------------------------------------------
  // Reusable message fragments
  // ---------------------------------------------------------------------------

  function contactLine(salon) {
    return `📞 ${salon.salon.phone}\n✉️ ${salon.salon.email}`;
  }

  function missingInfo(salon, what) {
    const subject = what || 'tej informacji';
    return (
      `Niestety nie mam ${subject} w danych salonu, więc nie chcę zgadywać. ` +
      `Najlepiej skontaktuj się bezpośrednio z salonem:\n${contactLine(salon)}`
    );
  }

  function formatService(s) {
    return `• ${s.name} – ${s.price} (ok. ${s.duration})`;
  }

  function todayKey(now) {
    const en = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: TIME_ZONE }).format(now);
    return EN_TO_PL_DAY[en];
  }

  function tomorrowKey(now) {
    return todayKey(new Date(now.getTime() + 24 * 60 * 60 * 1000));
  }

  // ---------------------------------------------------------------------------
  // Individual answers
  // ---------------------------------------------------------------------------

  function medicalAnswer(salon) {
    const consult = salon.services.find((s) => s.id === 'konsultacja');
    let text =
      'Nie mogę udzielać porad medycznych ani oceniać, czy dany zabieg jest dla Ciebie bezpieczny. ' +
      'Jeśli masz chorobę skóry, alergię, przyjmujesz leki, jesteś w ciąży lub karmisz piersią – ' +
      'przed zabiegiem skonsultuj się z lekarzem.';
    if (consult) {
      text += `\n\nW salonie możesz też umówić ${consult.name.toLowerCase()} (${consult.price}).`;
    }
    text += `\n\nW razie pytań skontaktuj się z salonem:\n${contactLine(salon)}`;
    return text;
  }

  function availabilityAnswer(salon) {
    return (
      'Nie mam dostępu do kalendarza salonu, więc nie podam wolnych terminów. ' +
      'Aktualne terminy sprawdzisz i zarezerwujesz przyciskiem „Umów wizytę” ' +
      `albo telefonicznie: ${salon.salon.phone}.`
    );
  }

  function hoursAnswer(salon, norm, now) {
    const hours = salon.openingHours;

    if (anyKeyword(norm, ['swiet', 'wigili', 'sylwest', 'nowy rok', 'wielkanoc'])) {
      return missingInfo(salon, 'informacji o godzinach otwarcia w święta');
    }

    let dayKey = null;
    let label = null;
    if (anyKeyword(norm, ['jutro'])) {
      dayKey = tomorrowKey(now);
      label = 'Jutro';
    } else if (anyKeyword(norm, ['dzis', 'dzisiaj'])) {
      dayKey = todayKey(now);
      label = 'Dziś';
    } else {
      for (const [key, aliases] of Object.entries(DAY_ALIASES)) {
        if (anyKeyword(norm, aliases)) {
          dayKey = key;
          break;
        }
      }
    }

    if (dayKey) {
      const d = hours.find((h) => h.key === dayKey);
      const prefix = label ? `${label} (${d.day.toLowerCase()})` : capitalize(DAY_LOCATIVE[dayKey]);
      return d.hours === 'nieczynne'
        ? `${prefix} salon jest nieczynny.`
        : `${prefix} salon jest otwarty w godzinach ${d.hours}.`;
    }

    return 'Godziny otwarcia:\n' + hours.map((h) => `• ${h.day}: ${h.hours}`).join('\n');
  }

  function contactAnswer(salon, norm) {
    const s = salon.salon;
    if (anyKeyword(norm, ['parking', 'zaparkow', 'parkow'])) {
      return `${s.parking}\n\nAdres: ${s.address}`;
    }
    return `${s.name}\n📍 ${s.address}\n${contactLine(salon)}`;
  }

  function priceListAnswer(salon) {
    const byCategory = {};
    for (const s of salon.services) {
      (byCategory[s.category] = byCategory[s.category] || []).push(s);
    }
    const blocks = Object.entries(byCategory).map(
      ([cat, list]) => `${cat}:\n${list.map(formatService).join('\n')}`
    );
    return 'Oto nasz cennik:\n\n' + blocks.join('\n\n');
  }

  function findServices(salon, norm) {
    let top = 0;
    let matches = [];
    for (const s of salon.services) {
      const score = bestKeywordScore(norm, s.keywords);
      if (score === 0) continue;
      if (score > top) {
        top = score;
        matches = [s];
      } else if (score === top) {
        matches.push(s);
      }
    }
    return matches;
  }

  // All matching services, best match first (used for comparisons).
  function rankServicesScored(salon, norm) {
    return salon.services
      .map((s, i) => ({ s, i, score: bestKeywordScore(norm, s.keywords) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.i - b.i);
  }

  function rankServices(salon, norm) {
    return rankServicesScored(salon, norm).map((x) => x.s);
  }

  // The two services a comparison question is about, or null.
  // Explicit words ("różnica", "porównaj") need 2 matches; "X czy Y" also needs
  // the top two matches to be clearly ahead of the rest (to avoid guessing).
  function servicesToCompare(salon, norm) {
    const ranked = rankServicesScored(salon, norm);
    if (ranked.length < 2) return null;
    const explicit = anyKeyword(norm, COMPARE);
    // "henna czy laminacja?" – but not a question that merely starts with "czy".
    const implicit = / (czy|lub|albo) /.test(' ' + norm.replace(/^czy /, '') + ' ');
    const separated = !ranked[2] || ranked[1].score > ranked[2].score;
    if (explicit || (implicit && separated)) return [ranked[0].s, ranked[1].s];
    return null;
  }

  function formatServiceWithDescription(s) {
    return `${formatService(s)}\n  ${s.description}`;
  }

  function isSlotQuestion(message) {
    return anyKeyword(normalize(message), SLOTS);
  }

  function findFaq(salon, norm) {
    let best = null;
    let top = 0;
    for (const f of salon.faqs) {
      const score = bestKeywordScore(norm, f.keywords);
      if (score > top) {
        top = score;
        best = f;
      }
    }
    return best;
  }

  // ---------------------------------------------------------------------------
  // Main function: question in -> answer out
  // ---------------------------------------------------------------------------

  /**
   * @param {string} message  The visitor's question.
   * @param {object} salon    Parsed data/salon.json.
   * @param {Date}   [now]    Current time (injectable for tests).
   * @returns {{reply: string, intent: string, showBooking: boolean}}
   */
  function answerQuestion(message, salon, now = new Date()) {
    const norm = normalize(message);
    const r = (intent, reply, showBooking = false) => ({ intent, reply, showBooking });

    if (!norm) {
      return r('empty', 'Napisz proszę pytanie – np. o cennik, godziny otwarcia lub dojazd.');
    }

    // 1. Health / medical topics – never give advice, always redirect.
    if (anyKeyword(norm, MEDICAL)) {
      return r('medical', medicalAnswer(salon));
    }

    // 2. Cancelling / moving a visit is a policy question (FAQ), check before "termin".
    const faq = findFaq(salon, norm);
    if (faq && faq.id === 'odwolanie') {
      return r('faq', faq.answer + `\n\nKontakt: ${salon.salon.phone}`, true);
    }

    // 3. Free slots / booking – we never invent available times.
    if (anyKeyword(norm, AVAILABILITY)) {
      return r('availability', availabilityAnswer(salon), true);
    }

    // 3b. "Czym się różni X od Y?" – compare two services using salon data only.
    {
      const ranked = servicesToCompare(salon, norm);
      if (ranked) {
        return r(
          'compare',
          'Porównanie na podstawie naszego cennika:\n' +
            ranked.map(formatServiceWithDescription).join('\n') +
            `\n\nW razie wątpliwości, co wybrać, zapytaj w salonie: ${salon.salon.phone}.`,
          true
        );
      }
    }

    // 4. Other FAQs (payments, vouchers, being late...).
    if (faq) {
      return r('faq', faq.answer);
    }

    // 5. Opening hours.
    if (anyKeyword(norm, HOURS)) {
      return r('hours', hoursAnswer(salon, norm, now));
    }

    // 6. Address, phone, e-mail, parking.
    if (anyKeyword(norm, CONTACT)) {
      return r('contact', contactAnswer(salon, norm));
    }

    // 7. Specific services / prices from the price list.
    const services = findServices(salon, norm);
    if (services.length) {
      const intro = services.length === 1 ? 'Z naszego cennika:' : 'Pasujące usługi z naszego cennika:';
      const lines = services.length === 1 ? formatServiceWithDescription(services[0]) : services.map(formatService).join('\n');
      return r(
        'services',
        `${intro}\n${lines}\n\n` +
          `Nie widzisz usługi, o którą pytasz? Zapytaj w salonie: ${salon.salon.phone}.`,
        true
      );
    }

    // 8. Whole price list / offer.
    if (anyKeyword(norm, PRICE_LIST)) {
      return r('pricelist', priceListAnswer(salon), true);
    }

    // 9. Asked about a price we do not have -> do NOT guess.
    if (anyKeyword(norm, PRICE)) {
      return r('unknown-price', missingInfo(salon, 'ceny tej usługi'));
    }

    // 10. Small talk.
    if (anyKeyword(norm, GREETING)) {
      return r(
        'greeting',
        `Dzień dobry! Jestem wirtualną asystentką salonu ${salon.salon.name}. ` +
          'Mogę pomóc z cennikiem, godzinami otwarcia, dojazdem i najczęstszymi pytaniami.'
      );
    }
    if (anyKeyword(norm, THANKS)) {
      return r('thanks', 'Bardzo proszę! Gdyby coś jeszcze było niejasne – pytaj śmiało.');
    }

    // 11. Anything else -> honest "I don't know".
    return r('unknown', missingInfo(salon));
  }

  // Turn salon.json into readable text for the AI model's instructions.
  function buildKnowledgeText(salon) {
    const s = salon.salon;
    const lines = [
      `Nazwa: ${s.name}`,
      `Opis: ${s.description}`,
      `Adres: ${s.address}`,
      `Telefon: ${s.phone}`,
      `E-mail: ${s.email}`,
      `Płatności: ${s.payment}`,
      `Parking: ${s.parking}`,
      '',
      'GODZINY OTWARCIA:',
      ...salon.openingHours.map((h) => `- ${h.day}: ${h.hours}`),
      '',
      'CENNIK (jedyne obowiązujące ceny):',
      ...salon.services.map(
        (x) => `- id="${x.id}" [${x.category}] ${x.name}: ${x.price}, czas ok. ${x.duration}. Opis: ${x.description}`
      ),
      '',
      'FAQ:',
      ...salon.faqs.map((f) => `- id="${f.id}" P: ${f.question}\n  O: ${f.answer}`),
    ];
    return lines.join('\n');
  }

  module.exports = {
    normalize,
    hasWordStart,
    answerQuestion,
    isSlotQuestion,
    rankServices,
    buildKnowledgeText,
    contactLine,
    medicalAnswer,
    availabilityAnswer,
    DAY_ALIASES,
  };
  root.DemoEngine = module.exports;
})(typeof window !== 'undefined' ? window : globalThis);
