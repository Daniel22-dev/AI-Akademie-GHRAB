export default {
  "id": "generator",
  "order": 4,
  "code": "GEN-01",
  "title": "Generátor interaktivních testů",
  "shortTitle": "Generátor",
  "subtitle": "Od vlastního podkladu k procvičování nebo bezpečnému testu",
  "category": "Aplikace",
  "audience": "AJ, ŠJ, NJ a ČJ",
  "duration": 100,
  "reserve": 5,
  "level": "Základní",
  "required": false,
  "accent": "#50e8ff",
  "icon": "./assets/course-icons/generator.png",
  "prerequisites": [
    "start"
  ],
  "outcomes": [
    "Rozlišíte procvičování, běžný test a bezpečný offline test.",
    "Vytvoříte test z vlastního textu nebo tématu.",
    "Nastavíte varianty, pořadí, bodování a zpětnou vazbu.",
    "Vyexportujete, ověříte a bezpečně zveřejníte HTML."
  ],
  "lessons": [
    {
      "id": "modes",
      "title": "Nejdřív účel, potom režim",
      "kicker": "ROZHODNUTÍ PŘED TVORBOU · 10 MIN",
      "duration": 10,
      "summary": "Procvičování, ověřování a test nejsou totéž. Režim vybírejte podle situace ve třídě, ne podle efektu.",
      "trainerNote": "Nezačínejte ukázkou všech možností. Nejprve nechte účastníky rozhodnout, který režim odpovídá jejich konkrétní hodině.",
      "blocks": [
        {
          "type": "showcase",
          "label": "UKÁZKA VÝSLEDKU",
          "title": "Z tématu k hotovému interaktivnímu testu",
          "text": "Nejdříve ukažte hotový test na mobilu, okamžitou kontrolu odpovědí a export. Tvorbu vysvětlujte až potom.",
          "before": {
            "label": "VSTUP",
            "title": "Téma, úroveň a výukový cíl",
            "items": [
              "např. minulý čas v angličtině",
              "2. ročník, úroveň B1",
              "10 minut procvičování"
            ]
          },
          "after": {
            "label": "VÝSTUP",
            "title": "Ověřený interaktivní test",
            "items": [
              "různé typy úloh",
              "správný klíč a zpětná vazba",
              "HTML připravené pro žáky"
            ]
          },
          "caption": "Wow efekt vzniká při okamžitém přechodu od zadání k fungujícímu výsledku."
        },
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "P",
              "title": "Procvičování",
              "text": "Nízký stres, rychlá zpětná vazba, prostor pro chybu."
            },
            {
              "icon": "O",
              "title": "Ověření",
              "text": "Krátká kontrola, co žáci zvládli po výkladu nebo domácí přípravě."
            },
            {
              "icon": "T",
              "title": "Test",
              "text": "Vyžaduje důkladnější kontrolu správných odpovědí a podmínek."
            }
          ]
        },
        {
          "type": "comparison",
          "left": {
            "title": "Procvičování",
            "items": [
              "žák vidí zpětnou vazbu",
              "lze opakovat",
              "vhodné pro učení",
              "nižší nároky na zabezpečení"
            ]
          },
          "right": {
            "title": "Klasifikovaný test",
            "items": [
              "jasná pravidla a čas",
              "kontrolované bodování",
              "předem ověřený klíč",
              "odpovídající způsob odevzdání"
            ]
          }
        },
        {
          "type": "quiz",
          "question": "Který režim je nejvhodnější pro domácí opakování slovní zásoby?",
          "options": [
            "Rychlé procvičování",
            "Bezpečný offline test",
            "Učitelský ověřovač",
            "Dávkové hodnocení"
          ],
          "answer": 0,
          "explanation": "Pro učení je vhodná okamžitá zpětná vazba a možnost opakování."
        }
      ]
    },
    {
      "id": "input",
      "title": "Malý zdroj, jasný cíl",
      "kicker": "KVALITNÍ ZADÁNÍ · 15 MIN",
      "duration": 15,
      "summary": "U prvního testu je lepší kratší podklad a méně úloh. Snáz odhalíte chyby a doladíte zadání.",
      "trainerNote": "Pro první školení doporučte krátký text nebo jedno gramatické téma. Velký rozsah zvyšuje čas kontroly a počet možných chyb.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Zvolte jazykový modul",
              "text": "Vyberte cizí jazyk nebo český jazyk podle účelu materiálu."
            },
            {
              "title": "Určete režim a úroveň",
              "text": "Zadejte ročník, očekávanou úroveň a zda jde o procvičování nebo test."
            },
            {
              "title": "Vložte vlastní zdroj",
              "text": "Text, slovní zásobu, jev nebo jiné učivo předem anonymizujte."
            },
            {
              "title": "Definujte cíl",
              "text": "Uveďte, co mají otázky skutečně ověřovat. Neomezujte se na obecné „udělej test“."
            },
            {
              "title": "Nastavte rozsah",
              "text": "Počet úloh, čas, bodování a požadované typy úloh přizpůsobte reálné hodině."
            }
          ]
        },
        {
          "type": "checklist",
          "title": "Před generováním",
          "items": [
            "Cíl testu je jasný.",
            "Zdroj neobsahuje citlivé údaje.",
            "Počet úloh odpovídá času.",
            "Vím, které odpovědi jsou správné.",
            "Vím, jak výsledek zkontroluji."
          ]
        }
      ]
    },
    {
      "id": "tasks",
      "title": "Typ úlohy podle cíle",
      "kicker": "DIDAKTIKA · 15 MIN",
      "duration": 15,
      "summary": "Do jednoho testu nepatří všechny typy úloh. Každý typ má ověřovat konkrétní dovednost.",
      "trainerNote": "Vyberte maximálně čtyři typy úloh pro první ukázku. Příliš mnoho mechanik odvádí pozornost od kvality obsahu.",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Cíl",
            "Vhodné typy úloh",
            "Riziko"
          ],
          "rows": [
            [
              "Výběr odpovědi",
              "rychlé ověření porozumění",
              "pozor na příliš snadné nápovědy"
            ],
            [
              "Doplňování",
              "slovní zásoba nebo gramatika",
              "musí být jasná správná odpověď"
            ],
            [
              "Párování",
              "pojmy, definice, dvojice",
              "nepřehnat počet položek"
            ],
            [
              "Otevřená odpověď",
              "vysvětlení a argumentace",
              "nutná ruční kontrola"
            ]
          ]
        },
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "1",
              "title": "Začněte jistotou",
              "text": "První úloha má ověřit orientaci a snížit zbytečný stres."
            },
            {
              "icon": "2",
              "title": "Střídejte nároky",
              "text": "Kombinujte rozpoznání, aplikaci a produkci podle cíle."
            },
            {
              "icon": "3",
              "title": "Končete smysluplně",
              "text": "Poslední část má přinést důkaz zvládnutí, ne pouze únavu."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Automatické bodování má hranice",
          "text": "U otevřených odpovědí může být potřeba přijmout více správných variant nebo provést učitelskou kontrolu."
        }
      ]
    },
    {
      "id": "differentiation",
      "title": "Varianty a diferenciace",
      "kicker": "SKUPINY · 15 MIN",
      "duration": 15,
      "summary": "Generátor umí rozdělit test do variant a přiřazovat je pomocí jednorázových kódů. Kódy jsou bezpečnější než běžná jména.",
      "trainerNote": "Pracujte s fiktivními kódy. Vysvětlete, že skutečná jména se nemají objevovat v promptu ani veřejném HTML.",
      "blocks": [
        {
          "type": "comparison",
          "left": {
            "title": "Doporučeno",
            "items": [
              "náhodné jednorázové kódy",
              "skupiny A/B/C bez jmen",
              "jasně popsané pedagogické podmínky",
              "kontrola ekvivalence variant"
            ]
          },
          "right": {
            "title": "Nedoporučeno",
            "items": [
              "seznam skutečných jmen",
              "diagnózy ve volném textu",
              "různá bodová náročnost bez úpravy",
              "předvídatelné osobní kódy"
            ]
          }
        },
        {
          "type": "steps",
          "items": [
            {
              "title": "Určete, co má zůstat stejné",
              "text": "Cíl, celkové body a klíčové dovednosti."
            },
            {
              "title": "Zvolte, co se může lišit",
              "text": "Míra opory, pořadí, kontext nebo konkrétní položky."
            },
            {
              "title": "Použijte jednorázové kódy",
              "text": "Kód přiřadí variantu bez zveřejnění jména."
            },
            {
              "title": "Porovnejte obtížnost",
              "text": "Varianty nemají být totožné, ale musí být férově srovnatelné."
            }
          ]
        }
      ]
    },
    {
      "id": "review",
      "title": "Test Lab: projít test jako žák",
      "kicker": "KONTROLA · 15 MIN",
      "duration": 15,
      "summary": "Před exportem klikněte celou žákovskou cestu. Zkontrolujte otázky, klíč, body, zpětnou vazbu i zobrazení na telefonu.",
      "trainerNote": "Nechte každého vyměnit test s kolegou. Autor často nevidí nejasnosti, které jsou pro druhého uživatele okamžitě zřejmé.",
      "blocks": [
        {
          "type": "checklist",
          "title": "Didaktická kontrola",
          "items": [
            "Každá otázka má jasné zadání.",
            "Správná odpověď je opravdu správná.",
            "Zpětná vazba neprozrazuje další úlohy.",
            "Bodování odpovídá náročnosti.",
            "Test jde dokončit bez technické chyby."
          ]
        },
        {
          "type": "checklist",
          "title": "Technická kontrola",
          "items": [
            "Test jsem otevřel mimo editor.",
            "Vyzkoušel jsem špatnou i správnou odpověď.",
            "Zkontroloval jsem telefon nebo menší obrazovku.",
            "Ověřil jsem exportovaný soubor.",
            "Mám plán, co dělat při technickém problému."
          ]
        },
        {
          "type": "activity",
          "title": "Kolegiální kontrola",
          "brief": "Otevřete si navzájem náhled testu.",
          "steps": [
            "Vyřešte alespoň tři různé typy úloh.",
            "Najděte jednu didaktickou a jednu technickou připomínku.",
            "Autor provede opravu.",
            "Zopakujte kontrolu klíče a bodování."
          ],
          "output": "Ověřený test připravený k exportu."
        }
      ]
    },
    {
      "id": "export",
      "title": "Export a zveřejnění",
      "kicker": "DISTRIBUCE · 12 MIN",
      "duration": 12,
      "summary": "Výstupem je samostatný HTML soubor nebo bezpečný offline balík. Způsob distribuce musí odpovídat zvolenému režimu.",
      "trainerNote": "U bezpečného offline režimu důsledně rozlišujte studentský soubor a teacher_verifier.html. Nezveřejňujte učitelský ověřovač společně se studentským testem.",
      "blocks": [
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "↗",
              "title": "Procvičování",
              "text": "HTML lze zveřejnit přes GitHub Pages a sdílet odkaz."
            },
            {
              "icon": "▣",
              "title": "Běžný test",
              "text": "Zvolte kontrolovaný způsob spuštění a ověřte, co žák uvidí po odevzdání."
            },
            {
              "icon": "🔐",
              "title": "Bezpečný offline balík",
              "text": "Student_test.html jde žákům; teacher_verifier.html zůstává pouze učiteli."
            }
          ]
        },
        {
          "type": "steps",
          "items": [
            {
              "title": "Exportujte správný režim",
              "text": "Zkontrolujte název souboru a cílovou skupinu."
            },
            {
              "title": "Otevřete export mimo generátor",
              "text": "Simulujte reálné použití."
            },
            {
              "title": "U procvičování nahrajte HTML na GitHub Pages",
              "text": "Použijte postup z modulu GitHub bez strachu."
            },
            {
              "title": "U klasifikace nastavte pravidla",
              "text": "Čas, dostupné pomůcky, způsob odevzdání a řešení technické chyby."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Který soubor bezpečného offline balíku má zůstat pouze učiteli?",
          "options": [
            "student_test.html",
            "teacher_verifier.html",
            "answers.txt vytvořený žákem",
            "veřejný odkaz na procvičování"
          ],
          "answer": 1,
          "explanation": "Učitelský ověřovač slouží ke kontrole odevzdaných odpovědí a nemá být distribuován žákům."
        }
      ]
    },
    {
      "id": "practice",
      "title": "Výstup ze školení",
      "kicker": "SAMOSTATNÁ DÍLNA · 13 MIN",
      "duration": 13,
      "summary": "Účastník dokončí jeden krátký materiál, který odpovídá jeho předmětu a reálné výuce.",
      "trainerNote": "Trvejte na krátkém dokončeném výsledku místo rozsáhlého rozpracovaného testu.",
      "blocks": [
        {
          "type": "mission",
          "label": "ŽIVÁ MISE",
          "title": "Vytvořte test, který lze ještě dnes poslat žákům",
          "brief": "Pracujte s vlastním tématem. Než exportujete, zkontrolujte každou úlohu, řešení a zpětnou vazbu.",
          "time": "13 MIN",
          "output": "Funkční HTML test po vlastní kontrole."
        },
        {
          "type": "activity",
          "title": "Vytvořte svůj první test",
          "brief": "Připravte 8–12 úloh pro jednu konkrétní výukovou situaci.",
          "steps": [
            "Zvolte režim a cíl.",
            "Vložte anonymizovaný zdroj.",
            "Použijte nejvýše čtyři typy úloh.",
            "Zkontrolujte klíč a bodování.",
            "Otestujte výstup jako žák.",
            "Exportujte a podle potřeby zveřejněte."
          ],
          "output": "Funkční a ověřený interaktivní test nebo procvičování."
        }
      ]
    }
  ]
};
