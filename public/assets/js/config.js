// AIVELLY – ustawienia strony (to NIE jest miejsce na sekrety ani klucze API).
//
// Formularz kontaktowy NIE wysyła wiadomości, dopóki nie uzupełnisz jednej z opcji:
//
//  formEndpoint – publiczny adres usługi formularzy, np. Formspree:
//                 'https://formspree.io/f/abcdwxyz'  (adres jest jawny – to nie jest sekret)
//  contactEmail – Twój adres e-mail; po wypełnieniu formularza odwiedzający
//                 zobaczy przycisk otwierający jego program pocztowy z gotową wiadomością.
//
// Jeśli oba pola są puste, formularz sprawdza dane, ale uczciwie informuje,
// że wiadomość nie została wysłana.
window.AIVELLY_CONFIG = {
  formEndpoint: '',
  contactEmail: '',
};
