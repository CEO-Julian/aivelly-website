// Fikcyjne dane salonu do demonstracji (kopia beauty-ai-assistant/data/salon.json).
(function (root) {
  root.DEMO_SALON = {
    "_note": "DANE FIKCYJNE - wyłącznie do celów demonstracyjnych. Fictional demo data.",
    "salon": {
      "name": "Studio Urody Malwa",
      "tagline": "Naturalne piękno, spokojna atmosfera",
      "description": "Kameralne studio kosmetyczne specjalizujące się w pielęgnacji twarzy, stylizacji brwi i rzęs oraz manicure i pedicure.",
      "address": "ul. Przykładowa 12, 50-001 Wrocław (adres fikcyjny)",
      "phone": "+48 71 000 00 00",
      "email": "kontakt@malwa-demo.example",
      "bookingUrl": "/rezerwacja.html",
      "payment": "Gotówka, karta płatnicza, BLIK",
      "parking": "Płatna strefa parkowania przy ulicy; najbliższy parking podziemny ok. 200 m od salonu."
    },
    "openingHours": [
      {
        "day": "Poniedziałek",
        "key": "poniedzialek",
        "hours": "10:00–19:00"
      },
      {
        "day": "Wtorek",
        "key": "wtorek",
        "hours": "10:00–19:00"
      },
      {
        "day": "Środa",
        "key": "sroda",
        "hours": "10:00–19:00"
      },
      {
        "day": "Czwartek",
        "key": "czwartek",
        "hours": "10:00–20:00"
      },
      {
        "day": "Piątek",
        "key": "piatek",
        "hours": "10:00–20:00"
      },
      {
        "day": "Sobota",
        "key": "sobota",
        "hours": "9:00–15:00"
      },
      {
        "day": "Niedziela",
        "key": "niedziela",
        "hours": "nieczynne"
      }
    ],
    "services": [
      {
        "id": "manicure-klasyczny",
        "category": "Dłonie i stopy",
        "name": "Manicure klasyczny",
        "description": "Opracowanie skórek, nadanie kształtu paznokciom i malowanie zwykłym lakierem. Lakier schnie na powietrzu i utrzymuje się krócej niż hybryda.",
        "price": "80 zł",
        "duration": "45 min",
        "keywords": [
          "manicure klasyczn",
          "manicur klasyczn",
          "manicur",
          "paznok",
          "dlon"
        ]
      },
      {
        "id": "manicure-hybrydowy",
        "category": "Dłonie i stopy",
        "name": "Manicure hybrydowy",
        "description": "Opracowanie skórek i kształtu paznokci oraz malowanie lakierem hybrydowym utwardzanym w lampie UV/LED. Lakier jest suchy od razu po zabiegu. Usunięcie poprzedniej hybrydy nie jest wliczone w cenę.",
        "price": "130 zł",
        "duration": "75 min",
        "keywords": [
          "hybryd",
          "manicure hybryd",
          "manicur hybryd",
          "manicur",
          "paznok",
          "dlon"
        ]
      },
      {
        "id": "usuniecie-hybrydy",
        "category": "Dłonie i stopy",
        "name": "Usunięcie hybrydy",
        "description": "Bezpieczne zdjęcie lakieru hybrydowego bez nakładania nowego koloru.",
        "price": "40 zł",
        "duration": "20 min",
        "keywords": [
          "usuniecie hybryd",
          "zdjecie hybryd",
          "sciagniecie hybryd",
          "zdjac hybryd",
          "usunac hybryd"
        ]
      },
      {
        "id": "pedicure-klasyczny",
        "category": "Dłonie i stopy",
        "name": "Pedicure klasyczny",
        "description": "Pielęgnacja stóp: moczenie, opracowanie skórek i zrogowaceń, nadanie kształtu paznokciom i malowanie zwykłym lakierem.",
        "price": "120 zł",
        "duration": "60 min",
        "keywords": [
          "pedicure klasyczn",
          "pedicur klasyczn",
          "pedicur",
          "stop"
        ]
      },
      {
        "id": "pedicure-hybrydowy",
        "category": "Dłonie i stopy",
        "name": "Pedicure hybrydowy",
        "description": "Pielęgnacja stóp jak w pedicure klasycznym, zakończona malowaniem lakierem hybrydowym utwardzanym w lampie UV/LED.",
        "price": "160 zł",
        "duration": "90 min",
        "keywords": [
          "pedicure hybryd",
          "pedicur hybryd",
          "pedicur",
          "hybryd",
          "stop"
        ]
      },
      {
        "id": "henna-brwi",
        "category": "Brwi i rzęsy",
        "name": "Henna brwi z regulacją",
        "description": "Koloryzacja brwi henną oraz regulacja ich kształtu (wosk lub pęseta).",
        "price": "60 zł",
        "duration": "30 min",
        "keywords": [
          "henn",
          "regulacja brwi",
          "regulacj",
          "brwi"
        ]
      },
      {
        "id": "laminacja-brwi",
        "category": "Brwi i rzęsy",
        "name": "Laminacja brwi",
        "description": "Zabieg układający włoski brwi w wybranym kierunku, dzięki czemu brwi wyglądają na gęstsze i są uporządkowane. Zawiera koloryzację henną i regulację.",
        "price": "150 zł",
        "duration": "60 min",
        "keywords": [
          "laminacj",
          "brwi"
        ]
      },
      {
        "id": "lifting-rzes",
        "category": "Brwi i rzęsy",
        "name": "Lifting i laminacja rzęs",
        "description": "Podkręcenie i odżywienie naturalnych rzęs wraz z ich koloryzacją. Nie jest to przedłużanie rzęs – salon nie ma przedłużania rzęs w cenniku.",
        "price": "170 zł",
        "duration": "60 min",
        "keywords": [
          "lifting rzes",
          "laminacja rzes",
          "lifting",
          "rzes"
        ]
      },
      {
        "id": "oczyszczanie-twarzy",
        "category": "Pielęgnacja twarzy",
        "name": "Oczyszczanie wodorowe twarzy",
        "description": "Oczyszczanie skóry twarzy urządzeniem wodorowym połączone z delikatnym złuszczaniem i nawilżeniem.",
        "price": "220 zł",
        "duration": "60 min",
        "keywords": [
          "oczyszcz",
          "wodorow",
          "twarz"
        ]
      },
      {
        "id": "peeling-kawitacyjny",
        "category": "Pielęgnacja twarzy",
        "name": "Peeling kawitacyjny",
        "description": "Złuszczanie i oczyszczanie skóry twarzy z użyciem fal ultradźwiękowych. Krótszy i tańszy niż oczyszczanie wodorowe.",
        "price": "150 zł",
        "duration": "45 min",
        "keywords": [
          "kawitacyj",
          "peeling",
          "twarz"
        ]
      },
      {
        "id": "zabieg-nawilzajacy",
        "category": "Pielęgnacja twarzy",
        "name": "Zabieg nawilżający z maską algową",
        "description": "Zabieg pielęgnacyjny z serum nawilżającym i maską algową na zakończenie.",
        "price": "190 zł",
        "duration": "60 min",
        "keywords": [
          "nawilz",
          "algow",
          "maska",
          "mask",
          "twarz"
        ]
      },
      {
        "id": "konsultacja",
        "category": "Pielęgnacja twarzy",
        "name": "Konsultacja kosmetologiczna",
        "description": "Rozmowa z kosmetologiem i dobór zabiegów do potrzeb skóry. To konsultacja kosmetyczna, a nie porada lekarska.",
        "price": "50 zł (odliczane od ceny zabiegu wykonanego w ciągu 30 dni)",
        "duration": "30 min",
        "keywords": [
          "konsultacj"
        ]
      },
      {
        "id": "masaz-relaksacyjny",
        "category": "Relaks",
        "name": "Masaż relaksacyjny pleców",
        "description": "Relaksacyjny masaż pleców z użyciem olejku.",
        "price": "140 zł",
        "duration": "45 min",
        "keywords": [
          "masaz plec",
          "masaz relaks",
          "masaz"
        ]
      },
      {
        "id": "masaz-twarzy",
        "category": "Relaks",
        "name": "Masaż twarzy Kobido",
        "description": "Japoński masaż twarzy Kobido wykonywany dłońmi, bez użycia urządzeń.",
        "price": "200 zł",
        "duration": "60 min",
        "keywords": [
          "kobido",
          "masaz twarzy",
          "masaz",
          "twarz"
        ]
      },
      {
        "id": "depilacja-nogi",
        "category": "Depilacja woskiem",
        "name": "Depilacja woskiem – całe nogi",
        "description": "Depilacja woskiem całych nóg.",
        "price": "150 zł",
        "duration": "45 min",
        "keywords": [
          "depilacja calych nog",
          "depilacja nog",
          "wosk nog",
          "nogi",
          "nog",
          "depil",
          "wosk"
        ]
      },
      {
        "id": "depilacja-pachy",
        "category": "Depilacja woskiem",
        "name": "Depilacja woskiem – pachy",
        "description": "Depilacja woskiem okolic pach.",
        "price": "50 zł",
        "duration": "15 min",
        "keywords": [
          "depilacja pach",
          "pach",
          "depil",
          "wosk"
        ]
      }
    ],
    "faqs": [
      {
        "id": "odwolanie",
        "question": "Jak odwołać lub przełożyć wizytę?",
        "answer": "Wizytę można odwołać lub przełożyć bezpłatnie najpóźniej 24 godziny przed terminem – telefonicznie lub przez system rezerwacji.",
        "keywords": [
          "odwol",
          "przeloz",
          "przesun",
          "anulow",
          "zmienic termin",
          "zmiana terminu",
          "rezygn"
        ]
      },
      {
        "id": "spoznienie",
        "question": "Co jeśli się spóźnię?",
        "answer": "Przy spóźnieniu powyżej 15 minut zabieg może zostać skrócony lub przełożony, aby nie opóźniać kolejnych klientek i klientów.",
        "keywords": [
          "spoznie",
          "spoznic",
          "spozni"
        ]
      },
      {
        "id": "platnosc",
        "question": "Jakie formy płatności akceptujecie?",
        "answer": "Akceptujemy gotówkę, karty płatnicze i BLIK.",
        "keywords": [
          "platn",
          "zaplac",
          "karta",
          "karte",
          "blik",
          "gotowk"
        ]
      },
      {
        "id": "voucher",
        "question": "Czy można kupić voucher podarunkowy?",
        "answer": "Tak, vouchery podarunkowe są dostępne na dowolną kwotę lub konkretny zabieg. Ważne są 6 miesięcy od daty zakupu. Voucher kupisz na miejscu w salonie.",
        "keywords": [
          "voucher",
          "bon",
          "prezent",
          "podarun",
          "upomin"
        ]
      },
      {
        "id": "przygotowanie",
        "question": "Jak przygotować się do zabiegu na twarz?",
        "answer": "Najlepiej przyjść bez makijażu. Jeśli jesteś w trakcie leczenia dermatologicznego lub masz wątpliwości zdrowotne, przed wizytą skonsultuj się z lekarzem.",
        "keywords": [
          "przygotow",
          "przed zabiegiem",
          "przed wizyta",
          "bez makijaz"
        ]
      },
      {
        "id": "trwalosc-hybrydy",
        "question": "Jak długo utrzymuje się manicure hybrydowy?",
        "answer": "Zwykle 2–3 tygodnie, w zależności od tempa wzrostu paznokci i codziennych aktywności.",
        "keywords": [
          "jak dlugo utrzym",
          "trwalosc",
          "ile wytrzym",
          "ile sie utrzym",
          "trzyma"
        ]
      },
      {
        "id": "dzieci",
        "question": "Czy można przyjść z dzieckiem?",
        "answer": "Ze względu na kameralny charakter salonu i bezpieczeństwo prosimy, aby w miarę możliwości przychodzić bez dzieci.",
        "keywords": [
          "dziec",
          "dzieck"
        ]
      },
      {
        "id": "zwierzeta",
        "question": "Czy można przyjść z psem?",
        "answer": "Niestety nie – ze względów higienicznych w salonie nie mogą przebywać zwierzęta.",
        "keywords": [
          "pies",
          "psem",
          "zwierz",
          "kot"
        ]
      },
      {
        "id": "kosmetyki",
        "question": "Na jakich kosmetykach pracujecie?",
        "answer": "Pracujemy na profesjonalnych, wegańskich kosmetykach do pielęgnacji twarzy. O szczegóły konkretnych produktów najlepiej zapytać podczas wizyty.",
        "keywords": [
          "kosmetyk",
          "produkt",
          "wegan",
          "marka",
          "marki"
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
