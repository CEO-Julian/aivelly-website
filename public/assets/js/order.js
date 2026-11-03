// Formularz „Zamów wdrożenie” (zamow.html). Wysyła przez Formspree,
// a gdy go brak – otwiera program pocztowy z gotową wiadomością.
(function () {
  'use strict';

  var form = document.querySelector('[data-order-form]');
  if (!form || !window.AivellyValidation) return;

  var config = window.AIVELLY_CONFIG || {};
  var statusEl = form.querySelector('[data-form-status]');
  var submitBtn = form.querySelector('[data-submit]');
  var FIELDS = ['plan', 'name', 'email', 'company', 'site', 'services', 'hours', 'faq', 'booking', 'notes', 'consent'];
  var loadedAt = Date.now();

  // Pre-select the plan chosen in the price list (?pakiet=Pro).
  var chosen = new URLSearchParams(location.search).get('pakiet');
  if (chosen && ['Start', 'Pro', 'Indywidualny'].indexOf(chosen) !== -1) form.elements.plan.value = chosen;

  function readForm() {
    var d = { consent: form.elements.consent.checked, website: form.elements.website.value, elapsedMs: Date.now() - loadedAt };
    FIELDS.forEach(function (f) { if (f !== 'consent') d[f] = form.elements[f].value; });
    return d;
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

  function summary(d) {
    return [
      'Pakiet: ' + d.plan,
      'Imię i nazwisko: ' + d.name,
      'E-mail: ' + d.email,
      'Firma: ' + d.company,
      'Strona: ' + (d.site || '—'),
      '',
      'USŁUGI I CENY:', d.services,
      '', 'GODZINY I ADRES:', d.hours || '—',
      '', 'NAJCZĘSTSZE PYTANIA:', d.faq || '—',
      '', 'REZERWACJE / ZAKUPY:', d.booking || '—',
      '', 'UWAGI:', d.notes || '—',
    ].join('\n');
  }

  form.addEventListener('input', function (e) {
    if (!e.target.name || !e.target.hasAttribute('aria-invalid')) return;
    var errors = window.AivellyValidation.validateOrder(readForm()).errors;
    var only = {};
    FIELDS.forEach(function (f) {
      if (form.elements[f].hasAttribute('aria-invalid')) only[f] = errors[f];
    });
    showErrors(only);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = readForm();
    var result = window.AivellyValidation.validateOrder(d);
    showErrors(result.errors);
    if (!result.valid) {
      setStatus('Popraw zaznaczone pola.', 'error');
      var first = FIELDS.filter(function (f) { return result.errors[f]; })[0];
      if (first) form.elements[first].focus();
      return;
    }
    if (result.spam) return;

    var subject = 'Zamówienie wdrożenia – ' + d.plan + ' – ' + d.company;

    if (config.formEndpoint) {
      submitBtn.disabled = true;
      setStatus('Wysyłanie…');
      fetch(config.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: d.name,
          email: d.email,
          company: d.company,
          message: summary(d),
          _subject: subject,
          _gotcha: d.website,
        }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          setStatus('Dziękujemy – zamówienie zostało wysłane. Odezwiemy się mailowo z demo i umową do akceptacji.', 'ok');
        })
        .catch(function () {
          setStatus('Nie udało się wysłać formularza. Spróbuj ponownie za chwilę' +
            (config.contactEmail ? ' albo napisz na ' + config.contactEmail + '.' : '.'), 'error');
        })
        .finally(function () { submitBtn.disabled = false; });
      return;
    }

    if (config.contactEmail) {
      setStatus('Otwieramy Twój program pocztowy z gotową wiadomością – kliknij w nim „Wyślij”.');
      window.location.href = 'mailto:' + encodeURIComponent(config.contactEmail) +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(summary(d));
      return;
    }

    setStatus('Formularz jest jeszcze konfigurowany – zamówienie nie zostało wysłane.', 'error');
  });
})();
