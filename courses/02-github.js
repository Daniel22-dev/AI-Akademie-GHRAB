export default {
  "id": "github",
  "order": 3,
  "code": "GIT-01",
  "title": "GitHub bez strachu",
  "shortTitle": "GitHub",
  "subtitle": "Zveřejnění interaktivního HTML materiálu krok za krokem",
  "category": "Technický most",
  "audience": "Uživatelé Generátoru a LUDUS",
  "duration": 65,
  "reserve": 5,
  "level": "Základní",
  "required": false,
  "accent": "#8db7ff",
  "icon": "./assets/course-icons/github.png",
  "prerequisites": [
    "start"
  ],
  "outcomes": [
    "Založíte přehledný repozitář pro výukové materiály.",
    "Aktivujete GitHub Pages z větve main.",
    "Nahrajete HTML soubor a získáte odkaz pro žáky.",
    "Aktualizujete materiál bez změny odkazu."
  ],
  "lessons": [
    {
      "id": "why",
      "title": "Proč používáme GitHub Pages",
      "kicker": "SMYSL · 6 MIN",
      "duration": 6,
      "summary": "GitHub tady není kurz programování. Používáme jen jednoduché zveřejnění HTML souboru jako odkazu pro žáky.",
      "trainerNote": "Nevysvětlujte Git ani práci v příkazové řádce. Pro základní školení je cílem pouze bezpečně zveřejnit hotový HTML soubor.",
      "blocks": [
        {
          "type": "showcase",
          "label": "OD SOUBORU K ODKAZU",
          "title": "Publikování není programování",
          "text": "Hotový HTML soubor se změní na odkaz.",
          "before": {
            "label": "NA POČÍTAČI",
            "title": "Samostatný HTML soubor",
            "items": [
              "funguje lokálně",
              "žák jej nemá kde otevřít",
              "novou verzi je obtížné rozesílat"
            ]
          },
          "after": {
            "label": "NA WEBU",
            "title": "Stálý odkaz přes GitHub Pages",
            "items": [
              "otevře se v prohlížeči",
              "stejná adresa po aktualizaci",
              "snadné sdílení v LMS nebo QR kódem"
            ]
          },
          "caption": "GitHub je volitelná publikační cesta; dlouhodobý školní provoz patří na spravované řešení.",
          "detail": "Cíl je praktický: žák otevře materiál v prohlížeči bez instalace a bez přihlašování."
        },
        {
          "type": "lead",
          "text": "Generátor testů a LUDUS mohou vytvořit samostatný interaktivní HTML soubor. GitHub Pages jej umí publikovat tak, aby žák otevřel odkaz přímo v prohlížeči bez instalace."
        },
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "▣",
              "title": "Repozitář",
              "text": "Online složka se soubory a historií změn."
            },
            {
              "icon": "↻",
              "title": "Commit",
              "text": "Uložená změna s krátkým popisem."
            },
            {
              "icon": "↗",
              "title": "GitHub Pages",
              "text": "Veřejná adresa, na které se HTML spustí jako web."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "danger",
          "title": "Nikdy na GitHub nedávejte tajné údaje",
          "text": "Do veřejného ani soukromého repozitáře nevkládejte API klíče, hesla, osobní údaje žáků ani přístupové soubory AI Studia."
        }
      ]
    },
    {
      "id": "account",
      "title": "Účet a repozitář bez zmatku",
      "kicker": "JEDNORÁZOVÉ NASTAVENÍ · 12 MIN",
      "duration": 12,
      "summary": "Repozitář je složka projektu na GitHubu. Název volte jednoduše, protože se promítne i do adresy.",
      "trainerNote": "Doporučte profesionální uživatelské jméno bez diakritiky. Upozorněte, že materiály na GitHub Pages jsou veřejně dostupné.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Založte nebo otevřete účet na github.com",
              "text": "Použijte profesionální uživatelské jméno bez diakritiky. Dokončete ověření e-mailu."
            },
            {
              "title": "Zvolte New repository",
              "text": "Repozitář pojmenujte například interaktivni-materialy nebo vyukove-hry."
            },
            {
              "title": "Použijte název bez diakritiky a mezer",
              "text": "Pro oddělení slov používejte pomlčky."
            },
            {
              "title": "Nastavte Public",
              "text": "U běžného bezplatného použití musí být zdroj pro veřejné GitHub Pages veřejný. Citlivý obsah do něj proto nepatří."
            },
            {
              "title": "Přidejte README a vytvořte repozitář",
              "text": "README stručně vysvětluje účel repozitáře."
            }
          ]
        },
        {
          "type": "checklist",
          "title": "Dobré názvy",
          "items": [
            "Jsem přihlášený ke správnému účtu.",
            "Název repozitáře je krátký a bez citlivých údajů.",
            "Repozitář je veřejný, pokud má fungovat přes GitHub Pages.",
            "Soubor neobsahuje API klíče ani osobní data."
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Veřejné neznamená doporučené ke sdílení všeho",
          "text": "GitHub Pages je vhodný pro hotové anonymní výukové materiály. Není vhodný pro seznamy žáků, výsledky testů ani interní dokumenty."
        }
      ]
    },
    {
      "id": "pages",
      "title": "GitHub Pages: main a root",
      "kicker": "PUBLIKOVÁNÍ · 10 MIN",
      "duration": 10,
      "summary": "Pro běžné školní HTML stačí nastavit větev main a složku root. GitHub z nich vytvoří veřejný web.",
      "trainerNote": "Rozhraní může skrýt Settings do rozbalovací nabídky na menší obrazovce. Ukažte i tuto variantu.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Otevřete Settings → Pages",
              "text": "Nastavení je uvnitř konkrétního repozitáře."
            },
            {
              "title": "Zvolte větev main",
              "text": "To je hlavní větev, do které nahráváte soubory."
            },
            {
              "title": "Zvolte /root",
              "text": "Root znamená kořen repozitáře: soubory leží přímo v hlavní složce, ne uvnitř další podsložky."
            },
            {
              "title": "Uložte a počkejte na zelený stav",
              "text": "První zveřejnění může chvíli trvat. Nastavení hned nepřeklikávejte."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "info",
          "title": "Technická poznámka",
          "text": "Tento školící portál i exportované materiály jsou statické HTML, CSS a JavaScript soubory. GitHub Pages je pro tento typ obsahu přímo určen."
        }
      ]
    },
    {
      "id": "upload",
      "title": "Nahrání prvního HTML souboru",
      "kicker": "PRAKTICKÝ POSTUP · 12 MIN",
      "duration": 12,
      "summary": "Nahrání souboru funguje podobně jako příloha. Rozdíl je v tom, že změnu krátce pojmenujete a potvrdíte.",
      "trainerNote": "Připravte každému účastníkovi malý testovací HTML soubor, aby školení nezáviselo na předchozí práci v aplikaci.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Otevřete správný repozitář",
              "text": "Před nahráním zkontrolujte název a vlastníka."
            },
            {
              "title": "Zvolte Add file → Upload files",
              "text": "Soubor lze přetáhnout do označené oblasti nebo vybrat z disku."
            },
            {
              "title": "Použijte bezpečný název souboru",
              "text": "Například fractions-practice-1.html. Vyhněte se diakritice a mezerám."
            },
            {
              "title": "Pojmenujte uloženou změnu (commit)",
              "text": "Například Přidán test zlomky – základní verze."
            },
            {
              "title": "Potvrďte Commit changes",
              "text": "Po uložení vyčkejte na nové nasazení GitHub Pages."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Limity webového nahrávání",
          "text": "GitHub omezuje velikost jednotlivých souborů a počet souborů nahrávaných najednou. Běžný samostatný HTML materiál je však zpravidla výrazně menší."
        }
      ]
    },
    {
      "id": "link",
      "title": "Odkaz zkontroluji jako žák",
      "kicker": "SDÍLENÍ · 10 MIN",
      "duration": 10,
      "summary": "Odkaz pošlete až po kontrole v anonymním okně. Tím ověříte, že funguje i bez přihlášení do vašeho účtu.",
      "trainerNote": "Nechte kolegy adresu sami sestavit a otevřít v anonymním okně. Tím ověří, že není závislá na jejich přihlášení.",
      "blocks": [
        {
          "type": "code",
          "label": "Vzorec projektového odkazu",
          "code": "https://uzivatelske-jmeno.github.io/nazev-repozitare/nazev-souboru.html"
        },
        {
          "type": "code",
          "label": "Příklad",
          "code": "https://novakova-aj.github.io/interaktivni-testy/unit-4-food.html"
        },
        {
          "type": "checklist",
          "title": "Před odesláním odkazu",
          "items": [
            "Otevřu odkaz v novém nebo anonymním okně.",
            "Zkontroluji obsah a správnou verzi.",
            "Ověřím, že soubor neobsahuje osobní údaje ani API klíč.",
            "Vyzkouším materiál alespoň na počítači a telefonu."
          ]
        },
        {
          "type": "quiz",
          "question": "Který odkaz typicky spustí stránku přes GitHub Pages?",
          "options": [
            "https://github.com/uzivatel/repozitar/soubor.html",
            "https://uzivatel.github.io/repozitar/soubor.html",
            "file:///C:/Downloads/soubor.html",
            "https://api.github.com/soubor.html"
          ],
          "answer": 1,
          "explanation": "Adresa GitHub Pages používá doménu uzivatel.github.io."
        }
      ]
    },
    {
      "id": "update",
      "title": "Aktualizace bez změny odkazu",
      "kicker": "BĚŽNÁ ÚDRŽBA · 10 MIN",
      "duration": 10,
      "summary": "Když nový soubor nahrajete pod stejným názvem, odkaz zůstane stejný. Po aktualizaci ale vždy ověřte výsledek.",
      "trainerNote": "Zdůrazněte, že po nasazení může prohlížeč krátce zobrazovat starší verzi. Pomůže tvrdé obnovení nebo otevření v anonymním okně.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Exportujte opravenou verzi se stejným názvem",
              "text": "Název musí přesně odpovídat původnímu souboru."
            },
            {
              "title": "Nahrajte ji do stejného místa repozitáře",
              "text": "GitHub změnu rozpozná jako aktualizaci existujícího souboru."
            },
            {
              "title": "Popište opravu v názvu uložené změny",
              "text": "Například Opraven klíč u otázky 6."
            },
            {
              "title": "Počkejte na dokončení nasazení",
              "text": "Odkaz se nemění. Po nasazení zkontrolujte novou verzi."
            }
          ]
        },
        {
          "type": "activity",
          "title": "Zkušební aktualizace",
          "brief": "Proveďte drobnou změnu v testovacím souboru a publikujte ji pod stejným názvem.",
          "steps": [
            "Upravte nadpis nebo jednu větu.",
            "Nahrajte soubor znovu.",
            "Sledujte stav nasazení.",
            "Otevřete původní odkaz a ověřte změnu."
          ],
          "output": "Aktualizovaný materiál dostupný na stejném odkazu."
        },
        {
          "type": "callout",
          "tone": "success",
          "title": "Připraveno pro aplikace",
          "text": "Po zvládnutí tohoto modulu můžete pokračovat Generátorem interaktivních testů nebo LUDUSem."
        }
      ]
    }
  ]
};
