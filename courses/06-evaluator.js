export default {
  "id": "evaluator",
  "order": 7,
  "code": "HOD-01",
  "title": "Hodnotitel maturitních slohů",
  "shortTitle": "Hodnotitel",
  "subtitle": "Důkazní hodnocení podle pevné rubriky s učitelským schválením",
  "category": "Specializovaná aplikace",
  "audience": "Vyučující anglického jazyka",
  "duration": 100,
  "reserve": 5,
  "level": "Pokročilé",
  "required": false,
  "accent": "#d7a04b",
  "icon": "./assets/course-icons/evaluator.png",
  "prerequisites": [
    "start"
  ],
  "outcomes": [
    "Připravíte anonymizovaný jednotlivý nebo dávkový vstup.",
    "Rozlišíte AI jazykovou analýzu a deterministický výpočet bodů.",
    "Zkontrolujete důkazy, podmínky automatického neúspěchu (FAIL) a konečnou známku.",
    "Schválíte a bezpečně vyexportujete zpětnou vazbu."
  ],
  "lessons": [
    {
      "id": "principle",
      "title": "AI jako druhý pár očí, ne verdikt",
      "kicker": "ARCHITEKTURA DŮVĚRY · 10 MIN",
      "duration": 10,
      "summary": "Aplikace pomáhá najít důkazy v textu a navrhnout zpětnou vazbu. Konečné hodnocení zůstává na učiteli a rubrice.",
      "trainerNote": "Tento rozdíl je klíčový. Neříkejte „AI dává známku“; přesněji: AI připravuje jazykovou analýzu a aplikace podle pravidel počítá výsledek.",
      "blocks": [
        {
          "type": "showcase",
          "label": "DŮKAZ MÍSTO DOJMU",
          "title": "Hodnocení musí být dohledatelné až ke konkrétním místům v textu",
          "text": "AI navrhuje. Učitel rozhoduje podle rubriky.",
          "before": {
            "label": "RIZIKOVÝ PŘÍSTUP",
            "title": "„Text působí asi na dvojku.“",
            "items": [
              "nejasná vazba na kritéria",
              "obtížná obhajoba výsledku",
              "riziko přehlédnutí fail podmínky"
            ]
          },
          "after": {
            "label": "KONTROLOVANÝ PŘÍSTUP",
            "title": "Kritérium → důkaz → body → schválení",
            "items": [
              "každý závěr má oporu v textu",
              "výpočet odpovídá rubrice",
              "učitel může každé zjištění upravit"
            ]
          },
          "caption": "Citlivé práce před vložením anonymizujte; jména studentů ani identifikující detaily do nástroje nepatří.",
          "detail": "Bez textového důkazu a kontroly učitele se hodnocení nepřebírá."
        },
        {
          "type": "flow",
          "items": [
            {
              "number": "01",
              "title": "Vstup",
              "text": "Text práce, zadání, parametry a pseudonymní identifikátor."
            },
            {
              "number": "02",
              "title": "AI analýza",
              "text": "Nalezení důkazů, chyb, splnění zadání a úrovně výkonu."
            },
            {
              "number": "03",
              "title": "Validace",
              "text": "Kontrola úplnosti, důkazů a případný jeden opravný pokus."
            },
            {
              "number": "04",
              "title": "Výpočet",
              "text": "Body, podmínky automatického neúspěchu (FAIL) a známka podle pevné rubriky."
            },
            {
              "number": "05",
              "title": "Učitel",
              "text": "Kontrola, případná úprava a výslovné schválení."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "AI výstup není konečné hodnocení",
          "text": "Žádná zpětná vazba se nemá distribuovat bez učitelské kontroly a schválení."
        }
      ]
    },
    {
      "id": "input",
      "title": "Jedna práce nebo dávka",
      "kicker": "VOLBA WORKFLOW · 12 MIN",
      "duration": 12,
      "summary": "Aplikace podporuje jednu vloženou práci, skupinu v ZIPu, fotografie nebo PDF a import studentů z informačního systému.",
      "trainerNote": "Pro první školení začněte jedním čistým textem. Dávkový pracovní postup ukažte až po zvládnutí individuálního hodnocení.",
      "blocks": [
        {
          "type": "cards",
          "columns": 2,
          "items": [
            {
              "icon": "1",
              "title": "Vložený text",
              "text": "Nejrychlejší cesta pro jednu práci."
            },
            {
              "icon": "ZIP",
              "title": "Celá skupina",
              "text": "Až dvacet prací, seskupování a řízená fronta."
            },
            {
              "icon": "PDF",
              "title": "Sken nebo fotografie",
              "text": "Nejprve přepis a potvrzení učitelem."
            },
            {
              "icon": "IS",
              "title": "Import seznamu",
              "text": "Lokální párování pro distribuci; do AI odchází pseudonym."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "info",
          "title": "Začněte malým případem",
          "text": "Individuální pracovní postup umožní pochopit rubriku, důkazní kontrolu i schválení bez složitosti dávky."
        }
      ]
    },
    {
      "id": "privacy",
      "title": "Anonymizace není jen smazané jméno",
      "kicker": "OCHRANA STUDENTŮ · 15 MIN",
      "duration": 15,
      "summary": "Text musí být zbaven údajů, podle kterých lze autora poznat. Pseudonym nebo třída často nestačí.",
      "trainerNote": "Vysvětlete rozdíl: anonymizace odstraňuje identitu; pseudonymizace ji nahrazuje kódem, který lze lokálně spárovat.",
      "blocks": [
        {
          "type": "comparison",
          "left": {
            "title": "Lokálně v aplikaci",
            "items": [
              "jméno pro párování",
              "e-mail pro schválenou distribuci",
              "pseudonymní historie po opt-in",
              "učitelské poznámky podle nastavení"
            ]
          },
          "right": {
            "title": "Do AI požadavku",
            "items": [
              "pseudonymní kód",
              "zkontrolovaný text práce",
              "zadání a rubrika",
              "bez jména a e-mailu"
            ]
          }
        },
        {
          "type": "checklist",
          "title": "Před analýzou",
          "items": [
            "Zmizelo jméno a podpis.",
            "Zmizela třída, e-mail a kontakty.",
            "Zmizely jedinečné osobní okolnosti.",
            "V textu nezůstala identita v názvu souboru.",
            "Rubrika je přiložená nebo jasně zvolená."
          ]
        },
        {
          "type": "callout",
          "tone": "danger",
          "title": "Citlivé ukládání je výchozí vypnuté",
          "text": "Bez vědomého zapnutí se nemá uchovávat studentský text, výsledek, seznam, podpis ani vlastní komentářová banka."
        }
      ]
    },
    {
      "id": "rubric",
      "title": "Rubrika je hranice hodnocení",
      "kicker": "ODBORNÁ KONTROLA · 18 MIN",
      "duration": 18,
      "summary": "AI nesmí vymýšlet nová kritéria. Hodnocení musí vycházet z rubriky a z důkazů v práci.",
      "trainerNote": "Použijte anonymní ukázku a nechte kolegy dohledat důkaz pro jeden bod. Tím zabráníte slepému přijímání čísel.",
      "blocks": [
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "8",
              "title": "Pevná kritéria",
              "text": "Aplikace nevymýšlí nové hodnoticí oblasti mimo zadanou rubriku."
            },
            {
              "icon": "“”",
              "title": "Důkazy v textu",
              "text": "Každé zásadní hodnocení má být doložitelné konkrétní částí práce."
            },
            {
              "icon": "!",
              "title": "Podmínky neúspěchu (FAIL)",
              "text": "Rozsah, téma, formát a další pevné podmínky se kontrolují odděleně."
            }
          ]
        },
        {
          "type": "steps",
          "items": [
            {
              "title": "Ověřte základní podmínky",
              "text": "Téma, útvar, délku, počet částí a další pevná pravidla."
            },
            {
              "title": "Projděte jednotlivá kritéria",
              "text": "U každého zkontrolujte bodové zdůvodnění."
            },
            {
              "title": "Najděte důkaz v práci",
              "text": "Důkaz musí odpovídat tvrzení a nesmí být vytržený z kontextu."
            },
            {
              "title": "Zkontrolujte návaznost bodů a známky",
              "text": "Výpočet musí odpovídat rubrice a případným podmínkám automatického neúspěchu."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Co je nejlepší reakce, když je bodové hodnocení rozumné, ale uvedený důkaz v textu neodpovídá?",
          "options": [
            "Hodnocení automaticky schválit.",
            "Důkaz ignorovat, protože body vypadají správně.",
            "Vrátit výstup k opravě nebo ho ručně upravit před schválením.",
            "Zvýšit známku o jeden stupeň."
          ],
          "answer": 2,
          "explanation": "Důkazní stopa je součástí spolehlivosti hodnocení a musí odpovídat textu."
        }
      ]
    },
    {
      "id": "teacher-review",
      "title": "Učitelská revize před převzetím",
      "kicker": "SCHVÁLENÍ · 15 MIN",
      "duration": 15,
      "summary": "Návrh hodnocení čtěte proti textu žáka a proti rubrice. Ne proti tomu, jak přesvědčivě AI píše.",
      "trainerNote": "Nechte účastníky najít alespoň jednu větu, kterou by z pedagogických důvodů přeformulovali.",
      "blocks": [
        {
          "type": "checklist",
          "title": "Před schválením",
          "items": [
            "Každý zásadní závěr má oporu v textu.",
            "Kritéria odpovídají rubrice.",
            "Zpětná vazba je konkrétní a použitelná.",
            "Tón je přiměřený.",
            "Výsledek bych dokázal obhájit před žákem."
          ]
        },
        {
          "type": "comparison",
          "left": {
            "title": "Nevhodná zpětná vazba",
            "items": [
              "obecné pochvaly bez důkazu",
              "tvrdé soudy o schopnostech",
              "dlouhý seznam bez priorit",
              "jazyk, kterému student nerozumí"
            ]
          },
          "right": {
            "title": "Užitečná zpětná vazba",
            "items": [
              "konkrétní silná stránka",
              "jedna až tři priority",
              "příklad opravy",
              "jasný další krok"
            ]
          }
        }
      ]
    },
    {
      "id": "batch",
      "title": "Dávka šetří čas, ne kontrolu",
      "kicker": "CELÁ SKUPINA · 12 MIN",
      "duration": 12,
      "summary": "Dávkové hodnocení pomůže s organizací více prací. Každý výstup ale stále vyžaduje učitelskou kontrolu.",
      "trainerNote": "Ukažte, jak aplikace řeší přerušenou dávku a proč se nemá spoléhat na neomezené automatické zpracování bez dohledu.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Zkontrolujte roster a soubory",
              "text": "Každá práce musí patřit správnému pseudonymu."
            },
            {
              "title": "Potvrďte přepisy obrazových prací",
              "text": "Nesprávný přepis vede k nesprávnému hodnocení."
            },
            {
              "title": "Spusťte řízenou frontu nebo podporovaný dávkový režim",
              "text": "Sledujte stav, chyby a orientační využití."
            },
            {
              "title": "Řešte validační chyby jednotlivě",
              "text": "Neztrácejte přehled o konkrétní práci."
            },
            {
              "title": "Schvalujte až po kontrole",
              "text": "Dávka nezrušila odpovědnost učitele."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Obnova dávky má omezení",
          "text": "Obnovení nemusí uchovávat původní binární přílohy. Při návratu je potřeba ověřit, které podklady jsou stále dostupné."
        }
      ]
    },
    {
      "id": "export",
      "title": "Report posílat až po kontrole",
      "kicker": "VÝSTUP · 13 MIN",
      "duration": 13,
      "summary": "Před sdílením ověřte anonymizaci, správnost hodnocení, tón zpětné vazby a to, komu report opravdu patří.",
      "trainerNote": "Pro první použití doporučte koncepty místo automatického odeslání. Uživatel tak ještě jednou zkontroluje adresáta i přílohu.",
      "blocks": [
        {
          "type": "cards",
          "columns": 2,
          "items": [
            {
              "icon": "DOCX",
              "title": "Individuální report",
              "text": "Profesionální zpětná vazba pro studenta."
            },
            {
              "icon": "XLSX",
              "title": "Třídní přehled",
              "text": "Body, známky a anonymní analytika."
            },
            {
              "icon": "ZIP",
              "title": "Dávkový export",
              "text": "Oddělené soubory po schválení."
            },
            {
              "icon": "✉",
              "title": "Gmail koncepty",
              "text": "Kontrolovatelná distribuce přes přiloženou integraci."
            }
          ]
        },
        {
          "type": "checklist",
          "title": "Před distribucí",
          "items": [
            "Report neobsahuje cizí osobní údaje.",
            "Hodnocení sedí s rubrikou.",
            "Zpětná vazba je srozumitelná.",
            "Soubor má bezpečný název.",
            "Vím, komu a jak jej předám."
          ]
        },
        {
          "type": "activity",
          "title": "Individuální hodnocení nanečisto",
          "brief": "Zpracujte jednu anonymní modelovou práci.",
          "steps": [
            "Vložte zadání a text.",
            "Spusťte analýzu.",
            "Ověřte důkazy a body.",
            "Upravte zpětnou vazbu.",
            "Schvalte výsledek.",
            "Vytvořte náhled DOCX nebo PDF reportu."
          ],
          "output": "Zkontrolovaný schválený report bez distribuce reálnému studentovi."
        }
      ]
    }
  ]
};
