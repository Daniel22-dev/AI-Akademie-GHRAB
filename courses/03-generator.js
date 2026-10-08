export default {
  "id": "generator",
  "order": 4,
  "code": "GEN-01",
  "title": "Generátor interaktivních testů",
  "shortTitle": "Generátor",
  "subtitle": "GIT 7.1.99: od procvičování po START/END, odevzdání do Forms a pedagogicky ověřené výsledky",
  "category": "Aplikace",
  "audience": "AJ, ŠJ, NJ a ČJ",
  "duration": 136,
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
    "Vyexportujete, ověříte a bezpečně zveřejníte HTML.",
    "Nastavíte bezpečný sběr do školních Forms, osobní kódy a START/END.",
    "Načtete výsledky do soukromého Verifieru a zdokumentujete případné opravy."
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
      "id": "forms-and-roster",
      "title": "Před prvním známkovaným testem: Forms, Sheets a osobní kódy",
      "kicker": "JEDNORÁZOVÉ NASTAVENÍ · 12 MIN",
      "duration": 12,
      "summary": "Google Forms a předvyplněná metadata připravíte jednou; pro každý test z GIT vytvoříte nový roster a CSV se správným Test ID.",
      "trainerNote": "Pracuj s vlastní testovací adresou, ne se skutečnými studentskými e-maily. Zkontroluj rozdíl mezi jednorázovou konfigurací a činnostmi při každém testu.",
      "speakerNotes": {
        "say": [
          "Nechci po učitelích, aby před každou hodinou všechno nastavovali znovu."
        ],
        "explain": [
          "Forms je sběrné místo, Apps Script rozesílá kódy, Verifier je soukromý. Každý má přesný účel."
        ],
        "demo": [
          "Na syntetické třídě předveď vytvoření testu, stažení CSV až po generování a import do nového listu Sheets."
        ],
        "ask": [
          "Kdy smím stáhnout finální CSV kódů?"
        ],
        "expected": [
          "Až po vytvoření testu; musíme mít správné Test ID."
        ],
        "facilitation": [
          "Účastník musí provést konkrétní krok sám a ukázat jeho výsledek; kód ani studentské údaje nepromítat."
        ],
        "caution": [
          "Neukazuj osobní API klíč, soukromý roster ani teacher_verifier.html na veřejném odkazu."
        ],
        "transition": [
          "Nyní už můžeme ve třídě spustit kontrolovaný sběr odpovědí."
        ],
        "fallback": [
          "Není-li dostupné živé připojení, použij syntetický příklad a jasně označ neprovedené kroky."
        ],
        "shortcut": [
          "V časové tísni zachovej hlavně kritický krok a jeho bezpečnostní kontrolu."
        ],
        "timing": "12 minut: názorná ukázka, účastník opakuje, krátká kontrolní otázka"
      },
      "blocks": [
        {
          "type": "flow",
          "items": [
            {
              "number": "1",
              "title": "Jednou: Forms",
              "text": "Školní e-mail, povinný odstavec pro celý SECURE-ANSWERS-V1, předvyplněná metadata TESTID, NAZEV, TRIDA, KOD; vypnout limit jedné odpovědi."
            },
            {
              "number": "2",
              "title": "Jednou: Apps Script",
              "text": "Školní Sheets s aktuálním menu GIT – kódy; ověřené oprávnění a testovací odeslání sobě."
            },
            {
              "number": "3",
              "title": "Na každý nový test: roster",
              "text": "Připrav individuální kódy celé skupiny, nech vygenerovat test a zkontroluj otázky i bodování."
            },
            {
              "number": "4",
              "title": "Teprve po generování: CSV",
              "text": "Stáhni CSV s novým Test ID, importuj jej jako nový list, nastav studentský HTTPS odkaz."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Nezaměňuj testy",
          "text": "Příjemce kódů určíš až v hodině zaškrtávátkem v Sheets. Starý list nesmí být přepsán a učitelský Verifier nikdy nesmí na veřejný odkaz."
        },
        {
          "type": "activity",
          "title": "Vyzkoušej nastavení bez žáků",
          "brief": "Na vlastním testovacím školním e-mailu zkontroluj Forms, menu GIT – kódy a správné Test ID.",
          "steps": [
            "Vytvoř krátký syntetický test.",
            "Stáhni studentský HTML, soukromý Verifier a CSV až po generování.",
            "CSV vlož jako nový list, zkontroluj Test ID i HTTPS odkaz.",
            "Připrav náhled e-mailu jen pro sebe."
          ],
          "output": "Připravený nový test bez vystavení soukromých údajů."
        }
      ]
    },
    {
      "id": "start-end",
      "title": "Průběh hodiny: START → studenti → END",
      "kicker": "KRITICKÁ ČASOVÁ OKNA · 12 MIN",
      "duration": 12,
      "summary": "Značky START/END opravdu odešlete do školních Forms. Student odevzdá celý blok šifrovaných odpovědí; pouhé kliknutí na odkaz nestačí.",
      "trainerNote": "V živé ukázce zdůrazni reálné odeslání START/END a nebezpečí zpětného předstírání času. Neposílej přístupové údaje studentů.",
      "speakerNotes": {
        "say": [
          "Zde je nejdůležitější chyba, kterou musíme ve školení předcházet: otevření Forms není odeslání značky."
        ],
        "explain": [
          "START musí být odeslaný před spuštěním studentských pokusů; END až po posledním legitimním odevzdání."
        ],
        "demo": [
          "Na vlastním syntetickém testu proveď ▶ Zahájit příjem → Odeslat v Forms → zkušební student → ■ Ukončit příjem → Odeslat."
        ],
        "ask": [
          "Má učitel START, když formulář pouze otevřel?"
        ],
        "expected": [
          "Ne. Musí jej přes školní Forms opravdu odeslat."
        ],
        "facilitation": [
          "Účastník musí provést konkrétní krok sám a ukázat jeho výsledek; kód ani studentské údaje nepromítat."
        ],
        "caution": [
          "Pokud byl START zapomenut, nevyrobíme falešnou zpětnou značku; ve Verifieru použijeme transparentní korekci skutečného času."
        ],
        "transition": [
          "Záznamy se potom importují do soukromého Verifieru."
        ],
        "fallback": [
          "Není-li dostupné živé připojení, použij syntetický příklad a jasně označ neprovedené kroky."
        ],
        "shortcut": [
          "V časové tísni zachovej hlavně kritický krok a jeho bezpečnostní kontrolu."
        ],
        "timing": "12 minut: názorná ukázka, účastník opakuje, krátká kontrolní otázka"
      },
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Jen přítomní dostanou kód",
              "text": "V Sheets zaškrtni přítomné → GIT – kódy → 2. Náhled a odeslat ZAŠKRTNUTÝM. Ověř odkaz i příjemce."
            },
            {
              "title": "START skutečně odešli",
              "text": "Ve Verifieru ▶ Zahájit příjem a v otevřeném školním Forms stiskni Odeslat. Teprve potom ukaž studentům startovací kód."
            },
            {
              "title": "Odevzdání studenta",
              "text": "Student dokončí skutečné otázky a odešle kompletní blok SECURE-ANSWERS-V1 přes povinné pole Forms."
            },
            {
              "title": "END skutečně odešli",
              "text": "Až po posledním legitimním výsledku odešli ve Forms také značku END z Verifieru."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Značka START se ve Forms otevřela s předvyplněnými poli, ale učitel nestiskl Odeslat. Co se zaznamenalo?",
          "options": [
            "START je uložen automaticky.",
            "Zatím nic; musí skutečně odeslat Forms.",
            "Stačí studentům sdělit osobní kód."
          ],
          "answer": 1,
          "explanation": "Předvyplnění Forms není odeslání. Bez START mohou výsledky narazit na kontrolu časového okna."
        },
        {
          "type": "callout",
          "tone": "danger",
          "title": "Důležitá výjimka GIT 7.1.99",
          "text": "Když prohlížeč zablokuje novou kartu Forms, může se otevřít v původní kartě testu. Před přechodem vždy bezpečně zkopíruj celý SECURE-ANSWERS-V1 a měj nouzový způsob odevzdání."
        }
      ]
    },
    {
      "id": "import-review",
      "title": "Po hodině: originální CSV, Verifier a pedagogická revize",
      "kicker": "KONTROLA VÝSLEDKŮ · 12 MIN",
      "duration": 12,
      "summary": "Záznamy START/END a výsledky se importují z neupraveného CSV z Forms do soukromého Verifieru, kde je nutná pedagogická kontrola bodování.",
      "trainerNote": "Ukaž syntetickou správnou alternativní formulaci, kterou automatické hodnocení původně neuznalo. Ukázku jasně označ jako modelovou.",
      "speakerNotes": {
        "say": [
          "Poslední rozhodnutí o bodech dělá učitel, ne automatické upozornění."
        ],
        "explain": [
          "Forms výsledky pouze sbírá. Verifier zkontroluje identitu, časové okno a body; textové odpovědi i podezřelé signály potřebují kontext."
        ],
        "demo": [
          "Na umělém CSV předveď import, kontroly, jeden sporný automatický výsledek a zdokumentovanou opravu."
        ],
        "ask": [
          "Znamená upozornění o časové neshodě automaticky podvádění?"
        ],
        "expected": [
          "Ne. Je to signál k ručnímu přezkumu."
        ],
        "facilitation": [
          "Účastník musí provést konkrétní krok sám a ukázat jeho výsledek; kód ani studentské údaje nepromítat."
        ],
        "caution": [
          "Zobrazené identifikátory musí být syntetické; nepublikuj studentům originální CSV ani tajemství Verifieru."
        ],
        "transition": [
          "Po školení najdou učitelé detailní návod v Manuálech AI Studia."
        ],
        "fallback": [
          "Není-li dostupné živé připojení, použij syntetický příklad a jasně označ neprovedené kroky."
        ],
        "shortcut": [
          "V časové tísni zachovej hlavně kritický krok a jeho bezpečnostní kontrolu."
        ],
        "timing": "12 minut: názorná ukázka, účastník opakuje, krátká kontrolní otázka"
      },
      "blocks": [
        {
          "type": "checklist",
          "title": "Před klasifikací ověřím",
          "items": [
            "Stáhl jsem původní, nezměněný CSV export stejného Google Formuláře.",
            "Ve Verifieru mám zaznamenané START/END a správné Test ID.",
            "Přiřazení identity, duplicity a případná časová upozornění jsem přezkoumal.",
            "Odpovědní klíč, přijatelné textové varianty a body jsem zkontroloval.",
            "Ruční pedagogické zásahy jsou transparentně zdokumentované."
          ]
        },
        {
          "type": "comparison",
          "left": {
            "title": "Co ověřuje Verifier",
            "items": [
              "Původ a struktura odpovědí.",
              "Časové a identitní kontroly.",
              "Předběžné bodování."
            ]
          },
          "right": {
            "title": "Za co odpovídá učitel",
            "items": [
              "Správnost klíče.",
              "Uznání smysluplných variant.",
              "Konečný výsledek a řešení námitek."
            ]
          }
        },
        {
          "type": "activity",
          "title": "Dokonči modelový průchod",
          "brief": "Na vlastních syntetických datech stáhni CSV z Forms a importuj jej do Verifieru.",
          "steps": [
            "Importuj původní CSV.",
            "Zkontroluj přítomnost START a END.",
            "Prohlédni každou odpověď a bodové rozhodnutí.",
            "Zdokumentuj případnou opravu.",
            "Ulož výsledky na neveřejném místě."
          ],
          "output": "Prokazatelně zkontrolovaný modelový test."
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
