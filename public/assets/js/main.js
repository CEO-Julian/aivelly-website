// AIVELLY – nawigacja, drobne animacje i formularz kontaktowy.
(function () {
  'use strict';

  var config = window.AIVELLY_CONFIG || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Header & mobile menu ----------
  var header = document.querySelector('[data-header]');
  var nav = document.querySelector('[data-nav]');
  var toggle = document.querySelector('[data-nav-toggle]');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  // ---------- One quiet reveal for section headings ----------
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section-head, .about h2, .demo-copy h2, .contact-copy h2');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach(function (t) {
      t.classList.add('reveal');
      io.observe(t);
    });
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  // ---------- Contact form ----------
  var form = document.querySelector('[data-contact-form]');
  if (!form || !window.AivellyValidation) return;

  var statusEl = form.querySelector('[data-form-status]');
  var submitBtn = form.querySelector('[data-submit]');
  var FIELDS = ['name', 'email', 'company', 'industry', 'message', 'consent'];

  function readForm() {
    return {
      name: form.elements.name.value,
      email: form.elements.email.value,
      company: form.elements.company.value,
      industry: form.elements.industry.value,
      message: form.elements.message.value,
      consent: form.elements.consent.checked,
      website: form.elements.website.value,
    };
  }

  function showErrors(errors) {
    FIELDS.forEach(function (name) {
      var input = form.elements[name];
      var errEl = form.querySelector('[data-error-for="' + name + '"]');
      var msg = errors[name] || '';
      if (errEl) errEl.textContent = msg;
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', name + '-error');
      } else {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      }
    });
  }

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  // Re-check a field as soon as the visitor fixes it.
  form.addEventListener('input', function (e) {
    var name = e.target.name;
    if (!name || !e.target.hasAttribute('aria-invalid')) return;
    var errors = window.AivellyValidation.validateContact(readForm()).errors;
    var only = {};
    FIELDS.forEach(function (f) {
      if (f !== name && form.elements[f].hasAttribute('aria-invalid')) only[f] = errors[f];
    });
    only[name] = errors[name];
    showErrors(only);
  });

  function mailtoLink(data) {
    var subject = 'Zapytanie ze strony AIVELLY – ' + data.industry;
    var body =
      'Imię i nazwisko: ' + data.name + '\n' +
      'E-mail: ' + data.email + '\n' +
      (data.company ? 'Firma: ' + data.company + '\n' : '') +
      'Branża: ' + data.industry + '\n\n' +
      data.message;
    return 'mailto:' + encodeURIComponent(config.contactEmail) +
      '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = readForm();
    var result = window.AivellyValidation.validateContact(data);
    showErrors(result.errors);

    if (!result.valid) {
      setStatus('Popraw zaznaczone pola.', 'error');
      var first = FIELDS.filter(function (f) { return result.errors[f]; })[0];
      if (first) form.elements[first].focus();
      return;
    }
    if (result.spam) return;

    // Option 1: a real form endpoint is configured (e.g. Formspree).
    if (config.formEndpoint) {
      submitBtn.disabled = true;
      setStatus('Wysyłanie…');
      fetch(config.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name, email: data.email, company: data.company,
          industry: data.industry, message: data.message,
        }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          setStatus('Dziękujemy – wiadomość została wysłana. Odpowiemy możliwie szybko.', 'ok');
        })
        .catch(function () {
          setStatus('Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.', 'error');
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
      return;
    }

    // Option 2: only an e-mail address is configured – open the visitor's e-mail app.
    if (config.contactEmail) {
      statusEl.className = 'form-status';
      statusEl.textContent = 'Formularz nie wysyła jeszcze wiadomości automatycznie. ';
      var link = document.createElement('a');
      link.href = mailtoLink(data);
      link.textContent = 'Otwórz program pocztowy z gotową wiadomością';
      statusEl.appendChild(link);
      return;
    }

    // Option 3: nothing configured – be honest, nothing was sent.
    setStatus(
      'Formularz jest jeszcze konfigurowany – ta wiadomość nie została wysłana. Spróbuj ponownie wkrótce.',
      'error'
    );
  });
})();
