export default {
  "id": "workflow",
  "order": 8,
  "code": "FLOW-01",
  "title": "Propojený pracovní postup aplikací",
  "shortTitle": "Pracovní postup",
  "subtitle": "Jeden kvalitní zdroj, několik výukových výstupů bez opakovaného přepisování",
  "category": "Pokročilá praxe",
  "audience": "Pravidelní uživatelé více aplikací",
  "duration": 80,
  "reserve": 0,
  "level": "Pokročilé",
  "required": false,
  "accent": "#7ee7ff",
  "icon": "./assets/course-icons/workflow.png",
  "prerequisites": [
    "start"
  ],
  "outcomes": [
    "Připravíte znovupoužitelný anonymní zdrojový materiál.",
    "Předáte obsah mezi aplikacemi pomocí lokálního propojení Studio Bridge nebo souboru.",
    "Rozhodnete, kdy diferencovat, testovat nebo gamifikovat.",
    "Udržíte konzistenci cíle, obsahu a verzí napříč výstupy."
  ],
  "lessons": [
    {
      "id": "one-source",
      "title": "Jeden zdroj, několik výstupů",
      "kicker": "STRATEGIE · 10 MIN",
      "duration": 10,
      "summary": "Stejný ověřený materiál může posloužit pro pracovní list, test i hru. Cíl každého výstupu ale musí být jasný.",
      "trainerNote": "Použijte jeden krátký tematický celek a během školení z něj vytvořte tři různé podoby. Nezačínejte třemi nesouvisejícími materiály.",
      "blocks": [
        {
          "type": "showcase",
          "label": "JEDEN ZDROJ, VÍCE VÝSTUPŮ",
          "title": "Obsah se nemá znovu přepisovat v každé aplikaci",
          "text": "Kvalitní zdroj je společný základ.",
          "before": {
            "label": "ROZTŘÍŠTĚNÁ PRÁCE",
            "title": "Každá aplikace začíná od nuly",
            "items": [
              "opakované kopírování zadání",
              "rozdílné verze stejného obsahu",
              "vyšší riziko nekonzistence"
            ]
          },
          "after": {
            "label": "PROPOJENÝ POSTUP",
            "title": "Jeden ověřený zdrojový balíček",
            "items": [
              "Diferenciátor upraví obtížnost",
              "Generátor vytvoří kontrolu",
              "LUDUS použije stejný obsah ve hře"
            ]
          },
          "caption": "Pro pokročilou práci stačí zvládnout alespoň dvě aplikace; není nutné absolvovat všechny větve.",
          "detail": "Aplikace mění podobu práce, ne pravdivost a didaktický smysl podkladu."
        },
        {
          "type": "flow",
          "items": [
            {
              "number": "01",
              "title": "Zdroj",
              "text": "Text, cíle, kontext a ověřené úlohy."
            },
            {
              "number": "02",
              "title": "Diferenciace",
              "text": "Podpůrná, standardní a rozšiřující cesta."
            },
            {
              "number": "03",
              "title": "Ověření",
              "text": "Procvičování nebo test v Generátoru."
            },
            {
              "number": "04",
              "title": "Aktivizace",
              "text": "Herní mechanika nebo soutěž v LUDUSu."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "success",
          "title": "Hlavní přínos",
          "text": "Učitel nevytváří každou podobu od nuly. Zachovává společný cíl a pracuje s ověřeným obsahem."
        }
      ]
    },
    {
      "id": "source-model",
      "title": "Zdrojový materiál pro opakované použití",
      "kicker": "DATOVÁ KVALITA · 12 MIN",
      "duration": 12,
      "summary": "Uložte si čistý zdroj, cíl, úroveň a omezení. Příště nezačínáte od nuly.",
      "trainerNote": "Vysvětlete, že „strukturovaný“ neznamená technický. Jde o jasně označené části a konzistentní názvy.",
      "blocks": [
        {
          "type": "cards",
          "columns": 2,
          "items": [
            {
              "icon": "C",
              "title": "Kontext",
              "text": "Předmět, ročník, úroveň, čas a skupina."
            },
            {
              "icon": "G",
              "title": "Cíl",
              "text": "Pozorovatelný výsledek práce žáka."
            },
            {
              "icon": "S",
              "title": "Zdroj",
              "text": "Anonymizovaný text, fakta nebo obsah."
            },
            {
              "icon": "T",
              "title": "Úlohy",
              "text": "Otázky s typem, řešením a případně zpětnou vazbou."
            }
          ]
        },
        {
          "type": "checklist",
          "title": "Zdroj připravený k předání",
          "items": [
            "Zdroj je ověřený.",
            "Neobsahuje citlivé údaje.",
            "Má jasný výukový cíl.",
            "Je uvedena cílová skupina.",
            "Jsou popsána omezení a neměnné části."
          ]
        }
      ]
    },
    {
      "id": "handoff",
      "title": "Předání mezi aplikacemi",
      "kicker": "PŘENOS MEZI APLIKACEMI · 15 MIN",
      "duration": 15,
      "summary": "Studio Bridge nebo exportní soubor přenáší výsledek do další aplikace. Před předáním vždy zkontrolujte obsah.",
      "trainerNote": "Ukažte obě cesty. Přímé předání je pohodlnější, soubor je průhlednější a vhodný pro archivaci či předání kolegovi.",
      "blocks": [
        {
          "type": "comparison",
          "left": {
            "title": "Přímý Studio Bridge",
            "items": [
              "stejný prohlížeč",
              "rychlé lokální předání",
              "po převzetí se smaže",
              "vhodné pro okamžitou návaznost"
            ]
          },
          "right": {
            "title": "Souborový export",
            "items": [
              "vědomě uložený soubor",
              "jde archivovat nebo předat kolegovi",
              "před importem lze obsah přečíst",
              "nutná správná verze formátu"
            ]
          }
        },
        {
          "type": "steps",
          "items": [
            {
              "title": "Dokončete a zkontrolujte zdroj",
              "text": "Předávka nesmí být způsob, jak obejít kontrolu."
            },
            {
              "title": "Zvolte cílovou aplikaci",
              "text": "Generátor pro ověření, LUDUS pro hru, Diferenciátor pro varianty."
            },
            {
              "title": "Přeneste pouze potřebná data",
              "text": "Minimalizujte rozsah a zachovejte anonymizaci."
            },
            {
              "title": "Po importu zkontrolujte mapování",
              "text": "Ověřte cíle, úlohy, odpovědi a případné ztracené informace."
            }
          ]
        }
      ]
    },
    {
      "id": "decision",
      "title": "Jak vybrat další aplikaci",
      "kicker": "PEDAGOGICKÉ ROZHODOVÁNÍ · 12 MIN",
      "duration": 12,
      "summary": "Nechte se vést cílem. Potřebujete více úrovní, ověření, hru, komunikaci nebo hodnocení?",
      "trainerNote": "Nechte účastníky řešit scénáře. Jedna hodina může využít více aplikací, ale ne nutně všechny.",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Potřeba",
            "Primární nástroj",
            "Možná návaznost"
          ],
          "rows": [
            [
              "Více úrovní stejného materiálu",
              "Diferenciátor",
              "když chcete oporu a výzvu kolem stejného cíle"
            ],
            [
              "Procvičení nebo test",
              "Generátor",
              "když potřebujete interaktivní úlohy a kontrolu odpovědí"
            ],
            [
              "Motivační aktivita",
              "LUDUS",
              "když hra pomáhá konkrétnímu učivu"
            ],
            [
              "E-mail nebo zpráva",
              "Korespondenční asistent",
              "když řešíte tón, strukturu a stručnost"
            ]
          ]
        },
        {
          "type": "quiz",
          "question": "Žáci mají stejný cíl, ale část skupiny potřebuje vodítka a část rozšíření. Který nástroj je nejlogičtější první krok?",
          "options": [
            "LUDUS",
            "Korespondenční asistent",
            "Diferenciátor",
            "GitHub"
          ],
          "answer": 2,
          "explanation": "Nejdříve se řeší pedagogicky smysluplné varianty; teprve poté lze zvolit formu ověření nebo hry."
        }
      ]
    },
    {
      "id": "versions",
      "title": "Verze a názvy bez chaosu",
      "kicker": "PROVOZNÍ POŘÁDEK · 12 MIN",
      "duration": 12,
      "summary": "Materiály pojmenovávejte tak, aby bylo jasné téma, třída, datum a verze. Jinak se dobrý výstup rychle ztratí.",
      "trainerNote": "Nabídněte jednoduché pojmenování, nikoli komplikovaný dokumentační systém.",
      "blocks": [
        {
          "type": "code",
          "label": "Doporučený název zdroje",
          "code": "2026-09-aj-b1-environment-source-v1.ghrab.json"
        },
        {
          "type": "code",
          "label": "Odvozené výstupy",
          "code": "2026-09-aj-b1-environment-diff-v1.pdf\n2026-09-aj-b1-environment-practice-v2.html\n2026-09-aj-b1-environment-ludus-v1.html"
        },
        {
          "type": "checklist",
          "title": "Minimální evidence",
          "items": [
            "Název obsahuje téma a třídu.",
            "Je jasné datum nebo verze.",
            "Soubor neobsahuje osobní údaje.",
            "Finální verze je oddělená od pracovních návrhů.",
            "Staré verze nejsou omylem sdílené žákům."
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Aktuální odkaz musí ukazovat na aktuální obsah",
          "text": "Při opravě veřejného HTML zachovejte stejný název, pokud chcete zachovat odkaz, a po nasazení vždy ověřte skutečnou Pages URL."
        }
      ]
    },
    {
      "id": "quality-gate",
      "title": "Kontrolní brána před použitím",
      "kicker": "KVALITA NAPŘÍČ APLIKACEMI · 12 MIN",
      "duration": 12,
      "summary": "Před výukou projděte jeden krátký kontrolní bod: obsah, bezpečnost, technické fungování a návaznost na cíl.",
      "trainerNote": "Tuto bránu lze vytisknout nebo používat jako závěrečný rituál každého školení.",
      "blocks": [
        {
          "type": "flow",
          "items": [
            {
              "number": "C",
              "title": "Cíl",
              "text": "Podporuje výstup skutečně zamýšlené učení?"
            },
            {
              "number": "S",
              "title": "Správnost",
              "text": "Jsou fakta, řešení a výpočty ověřené?"
            },
            {
              "number": "B",
              "title": "Bezpečnost",
              "text": "Neobsahuje výstup osobní údaje, klíče nebo citlivé informace?"
            },
            {
              "number": "P",
              "title": "Použitelnost",
              "text": "Rozumí uživatel instrukcím a funguje výstup na cílovém zařízení?"
            },
            {
              "number": "O",
              "title": "Odpovědnost",
              "text": "Je jasné, kdo výstup zkontroloval a schválil?"
            }
          ]
        },
        {
          "type": "activity",
          "title": "Jeden zdroj, tři výstupy",
          "brief": "Zvolte existující anonymní materiál.",
          "steps": [
            "Vytvořte tři varianty v Diferenciátoru.",
            "Převeďte část do krátkého procvičování.",
            "Použijte stejný obsah v mini-hře.",
            "U všech výstupů proveďte společnou kontrolní bránu.",
            "Zapište názvy a verze."
          ],
          "output": "Propojená sada materiálů se společným cílem a dohledatelným zdrojem."
        }
      ]
    },
    {
      "id": "team",
      "title": "Sdílení v předmětové komisi",
      "kicker": "TÝMOVÁ PRÁCE · 7 MIN",
      "duration": 7,
      "summary": "Největší úspora vzniká, když se nesdílí pouze hotový odkaz, ale také kvalitní zdroj, cíl a poznámky k použití.",
      "trainerNote": "Navrhněte pilotní sdílenou sadu pro jednu komisi, ne centrální knihovnu všeho hned od začátku.",
      "blocks": [
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "1",
              "title": "Zdroj",
              "text": "Anonymní, upravitelný a verzovaný podklad."
            },
            {
              "icon": "2",
              "title": "Výstupy",
              "text": "PDF, HTML, hra nebo test s jasným účelem."
            },
            {
              "icon": "3",
              "title": "Metodická poznámka",
              "text": "Pro koho, jak dlouho, co fungovalo a na co si dát pozor."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "success",
          "title": "Výsledek pokročilého školení",
          "text": "Účastník umí používat ekosystém jako propojený pracovní postup, nikoli jako sbírku izolovaných aplikací."
        }
      ]
    }
  ]
};
