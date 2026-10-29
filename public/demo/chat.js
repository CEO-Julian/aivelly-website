// Demo czatu w sekcji "Demo". Działa w całości w przeglądarce, na fikcyjnych
// danych salonu (salon-data.js) i silniku reguł (engine.js). Nic nie jest
// wysyłane na serwer.
(function () {
  'use strict';

  var root = document.querySelector('[data-chat]');
  if (!root || !window.DemoEngine || !window.DEMO_SALON) return;

  var log = root.querySelector('[data-chat-log]');
  var chips = root.querySelector('[data-chat-chips]');
  var form = root.querySelector('[data-chat-form]');
  var input = root.querySelector('[data-chat-input]');
  var salon = window.DEMO_SALON;

  var SUGGESTIONS = [
    'Ile kosztuje manicure hybrydowy?',
    'Czym się różni henna od laminacji brwi?',
    'Do której jesteście otwarci w sobotę?',
    'Czy macie wolny termin jutro?',
    'Czy mogę zrobić peeling w ciąży?',
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text; // safe: never innerHTML with user text
    return n;
  }

  function scrollDown() {
    log.scrollTop = log.scrollHeight;
  }

  function add(text, who, showBooking) {
    var m = el('div', 'msg msg-' + who, text);
    if (showBooking) {
      m.appendChild(document.createElement('br'));
      var btn = el('button', 'btn btn-gold btn-sm', 'Umów wizytę');
      btn.type = 'button';
      btn.addEventListener('click', function () {
        if (m.querySelector('.msg-booking-note')) return;
        m.appendChild(el('span', 'msg-booking-note',
          'To demo – w prawdziwym wdrożeniu przycisk otwiera system rezerwacji salonu (np. Booksy).'));
        scrollDown();
      });
      m.appendChild(btn);
    }
    log.appendChild(m);
    scrollDown();
  }

  function ask(text) {
    var q = String(text || '').trim();
    if (!q) return;
    chips.textContent = '';
    add(q, 'user');
    input.value = '';
    var a = window.DemoEngine.answerQuestion(q, salon);
    // A short pause so the reply doesn't appear before the question registers.
    setTimeout(function () { add(a.reply, 'bot', a.showBooking); }, 350);
  }

  SUGGESTIONS.forEach(function (s) {
    var c = el('button', 'chip', s);
    c.type = 'button';
    c.addEventListener('click', function () { ask(s); });
    chips.appendChild(c);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ask(input.value);
  });

  add('Dzień dobry! Jestem asystentką fikcyjnego salonu ' + salon.salon.name +
    '. Zapytaj o cennik, godziny otwarcia albo różnice między zabiegami.', 'bot');
})();
