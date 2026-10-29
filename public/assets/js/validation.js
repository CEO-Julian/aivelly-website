// Walidacja formularza kontaktowego. Czysta funkcja – działa w przeglądarce
// i w testach (Node.js).
(function (root) {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /**
   * @param {{name?:string,email?:string,company?:string,industry?:string,message?:string,consent?:boolean,website?:string}} data
   * @returns {{valid: boolean, errors: Object<string,string>, spam: boolean}}
   */
  function validateContact(data) {
    var d = data || {};
    var errors = {};
    var name = String(d.name || '').trim();
    var email = String(d.email || '').trim();
    var company = String(d.company || '').trim();
    var industry = String(d.industry || '').trim();
    var message = String(d.message || '').trim();

    if (!name) errors.name = 'Podaj imię i nazwisko.';
    else if (name.length < 2) errors.name = 'Imię i nazwisko jest za krótkie.';
    else if (name.length > 100) errors.name = 'Maksymalnie 100 znaków.';

    if (!email) errors.email = 'Podaj adres e-mail.';
    else if (!EMAIL_RE.test(email) || email.length > 150) errors.email = 'Sprawdź adres e-mail – np. jan@firma.pl.';

    if (company.length > 120) errors.company = 'Maksymalnie 120 znaków.';

    if (!industry) errors.industry = 'Wybierz branżę.';

    if (!message) errors.message = 'Napisz, w czym możemy pomóc.';
    else if (message.length < 10) errors.message = 'Napisz proszę trochę więcej (min. 10 znaków).';
    else if (message.length > 2000) errors.message = 'Maksymalnie 2000 znaków.';

    if (!d.consent) errors.consent = 'Zaznacz zgodę, abyśmy mogli odpowiedzieć.';

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
      // Honeypot: real people don't see this field; bots often fill it in.
      spam: String(d.website || '').trim() !== '',
    };
  }

  root.AivellyValidation = { validateContact: validateContact };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.AivellyValidation;
})(typeof window !== 'undefined' ? window : globalThis);
