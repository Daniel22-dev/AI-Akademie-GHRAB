export default {
  "id": "ai-literacy",
  "order": 0,
  "code": "OSVĚTA-01",
  "title": "AI v práci učitele",
  "shortTitle": "AI gramotnost",
  "subtitle": "Příležitosti, limity, kritické myšlení a odpovědné zpracování materiálů",
  "category": "AI gramotnost",
  "audience": "Všichni učitelé bez ohledu na předmět",
  "duration": 75,
  "reserve": 0,
  "level": "Úvodní až mírně pokročilý",
  "required": true,
  "status": "Připraveno",
  "accent": "#a877ff",
  "icon": "./assets/course-icons/ai-literacy.png",
  "prerequisites": [],
  "outcomes": [
    "Vysvětlíte, co generativní AI umí a kde jsou její zásadní limity.",
    "Použijete jednoduchý postup pro kvalitní zadání a tvorbu materiálu.",
    "Ověříte fakta, zdroje, přiměřenost a didaktickou kvalitu výstupu.",
    "Rozlišíte rozumnou pomoc AI od nebezpečného přenechání úsudku stroji.",
    "Promyslíte, jak AI mění úkoly, hodnocení a kritické myšlení žáků."
  ],
  "lessons": [
    {
      "id": "why-now",
      "title": "Proč se o AI bavit teď",
      "kicker": "KONTEXT · 8 MIN",
      "duration": 8,
      "summary": "AI už je běžný pracovní nástroj. Ve škole potřebujeme vědět, kdy pomáhá, kdy škodí a kdo nese odpovědnost.",
      "trainerNote": "Začněte krátkou anketou: Kdo AI používá alespoň jednou týdně? K čemu? Nehodnoťte odpovědi. Cílem je ukázat šíři zkušeností ve sboru.",
      "blocks": [
        {
          "type": "statement",
          "label": "HLAVNÍ MYŠLENKA",
          "text": "AI nenahrazuje učitele. Urychluje návrhy, třídění a úpravy — rozhodnutí zůstává na člověku.",
          "detail": "Hodnotu má až jasný cíl, dobrý podklad, kontrola a učitelský úsudek."
        },
        {
          "type": "lead",
          "text": "Neřešíme, jestli AI do školy patří. Řešíme, jak ji používat bezpečně, účelně a bez slepé důvěry."
        },
        {
          "type": "cards",
          "columns": 2,
          "items": [
            {
              "icon": "1",
              "title": "Příprava",
              "text": "Návrhy aktivit, pracovní listy, otázky a varianty hodin."
            },
            {
              "icon": "2",
              "title": "Komunikace",
              "text": "E-maily, shrnutí, úprava tónu a zpřehlednění textu."
            },
            {
              "icon": "3",
              "title": "Analýza",
              "text": "Hledání slabých míst, porovnání verzí a třídění podkladů."
            },
            {
              "icon": "4",
              "title": "Učení",
              "text": "Více cest k jednomu cíli, zpětná vazba a individualizace."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Dvě stejně nebezpečné krajnosti",
          "text": "„AI všechno vyřeší“ i „AI do školy nepatří“ obcházejí skutečný úkol: naučit se technologii používat účelně, bezpečně a kriticky."
        }
      ]
    },
    {
      "id": "what-it-is",
      "title": "Co generativní AI je — a co není",
      "kicker": "MENTÁLNÍ MODEL · 9 MIN",
      "duration": 9,
      "summary": "Model vytváří pravděpodobnou odpověď. Neznamená to, že rozumí situaci, zná pravdu nebo automaticky cituje správné zdroje.",
      "trainerNote": "Použijte jednoduchý kontrast: velmi přesvědčivý jazyk není důkaz správnosti. Nezabíhejte do technických detailů neuronových sítí.",
      "blocks": [
        {
          "type": "comparison",
          "left": {
            "title": "Co AI umí dobře",
            "items": [
              "navrhne více variant",
              "zlepší strukturu a styl",
              "shrne nebo přeformuluje text",
              "pracuje s dodaným kontextem"
            ]
          },
          "right": {
            "title": "Co z odpovědi neplyne",
            "items": [
              "že fakta sedí",
              "že zdroj opravdu existuje",
              "že výstup splní váš záměr",
              "že ho lze použít bez kontroly"
            ]
          }
        },
        {
          "type": "quote",
          "text": "Plynulost není totéž co pravdivost. Sebejistý tón není totéž co důkaz."
        },
        {
          "type": "quiz",
          "question": "Které tvrzení vystihuje nejbezpečnější přístup?",
          "options": [
            "Když odpověď zní odborně, lze jí věřit.",
            "AI je vhodná hlavně pro fakta, protože se nemýlí.",
            "AI navrhuje výstup; člověk ověřuje a rozhoduje.",
            "AI je jen vyhledávač s hezčím rozhraním."
          ],
          "answer": 2,
          "explanation": "Generativní model je nástroj pro návrh a zpracování, nikoli automatická autorita."
        }
      ]
    },
    {
      "id": "good-task",
      "title": "Jak zadávat práci, aby výstup dával smysl",
      "kicker": "PRAKTICKÝ RÁMEC · 10 MIN",
      "duration": 10,
      "summary": "Kvalitní výsledek nevzniká kouzelnou formulí. Vzniká z jasného cíle, dostatečného kontextu, požadovaného formátu a kritérií kontroly.",
      "trainerNote": "Nechte kolegy přepracovat vágní zadání „udělej pracovní list“. Poté společně porovnejte, co přineslo doplnění cíle a omezení.",
      "blocks": [
        {
          "type": "flow",
          "items": [
            {
              "number": "CÍL",
              "title": "Co potřebuji",
              "text": "Jedna jasná věta: co má výstup umožnit učiteli nebo žákovi."
            },
            {
              "number": "KONTEXT",
              "title": "Pro koho a z čeho",
              "text": "Předmět, ročník, úroveň, čas, zdrojový materiál a situace."
            },
            {
              "number": "VÝSTUP",
              "title": "Jak má vypadat",
              "text": "Struktura, rozsah, jazyk, počet variant nebo konkrétní formát."
            },
            {
              "number": "KRITÉRIA",
              "title": "Co musí splnit",
              "text": "Správnost, věková přiměřenost, návaznost na cíl, co se nesmí změnit."
            }
          ]
        },
        {
          "type": "code",
          "label": "Použitelná šablona zadání",
          "code": "Cíl: ...\nKontext: předmět, ročník, úroveň, délka hodiny...\nPodklad: ...\nVytvoř: ...\nZachovej: ...\nVyvaruj se: ...\nNa konci proveď kontrolu podle těchto kritérií: ..."
        },
        {
          "type": "activity",
          "title": "Z vágního zadání na profesionální",
          "brief": "Přepracujte zadání „Vytvoř mi aktivitu o klimatu“ tak, aby kolega podle výsledku mohl skutečně učit.",
          "steps": [
            "Určete jeden konkrétní výukový cíl.",
            "Doplňte věkovou skupinu a předmět.",
            "Stanovte čas a podobu výstupu.",
            "Napište dvě věci, které se nesmí stát.",
            "Přidejte způsob ověření výsledku."
          ],
          "output": "Jedno zadání, které lze rovnou vložit do AI nástroje."
        }
      ]
    },
    {
      "id": "material-workflow",
      "title": "Bezpečný postup práce s materiálem",
      "kicker": "WORKFLOW UČITELE · 12 MIN",
      "duration": 12,
      "summary": "Kvalita obvykle nevznikne jedním kliknutím. Vzniká z podkladu, jasného cíle a několika krátkých kontrol.",
      "trainerNote": "Ukažte jeden reálný anonymizovaný materiál a projděte pracovní postup živě. Zdůrazněte, že jeden dlouhý prompt není vždy lepší než postupná práce.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Vezmu důvěryhodný podklad",
              "text": "Vlastní text, učebnici, rubriku nebo ověřený zdroj."
            },
            {
              "title": "Odstraním citlivé údaje",
              "text": "Jména, kontakty a jedinečné osobní detaily do nástroje nepatří."
            },
            {
              "title": "Upřesním cíl a formát",
              "text": "Pro koho výstup je, co má vzniknout a co se nesmí změnit."
            },
            {
              "title": "Nechám vytvořit návrh",
              "text": "AI připraví první verzi, ne finální materiál."
            },
            {
              "title": "Zkontroluji a opravím konkrétní slabiny",
              "text": "Fakta, obtížnost, instrukce, řešení a vazbu na cíl ověřuje učitel."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "success",
          "title": "AI je nejsilnější v iteraci",
          "text": "Dobrá práce s AI má rytmus: návrh → kontrola → cílená oprava → poslední ověření."
        },
        {
          "type": "comparison",
          "left": {
            "title": "Slabý postup",
            "items": [
              "generovat bez podkladu",
              "přijmout první výsledek",
              "upravit jen vzhled",
              "ověřit až ve třídě"
            ]
          },
          "right": {
            "title": "Profesionální postup",
            "items": [
              "pracovat s důvěryhodným zdrojem",
              "stanovit neměnná kritéria",
              "ověřit obsah i didaktiku",
              "udělat malý test před použitím"
            ]
          }
        }
      ]
    },
    {
      "id": "verification",
      "title": "Co musím ověřit před použitím",
      "kicker": "KONTROLA KVALITY · 10 MIN",
      "duration": 10,
      "summary": "Sebejistý tón není důkaz. Před použitím ve výuce kontrolujeme fakta, zdroje, logiku, jazyk i didaktický smysl.",
      "trainerNote": "Přineste dvě krátké odpovědi: jednu správnou a jednu s nenápadnou smyšlenou citací. Nechte kolegy hledat signály, ne hádat podle stylu.",
      "blocks": [
        {
          "type": "cards",
          "columns": 2,
          "items": [
            {
              "icon": "F",
              "title": "Fakta",
              "text": "Sedí klíčová tvrzení i řešení?"
            },
            {
              "icon": "Z",
              "title": "Zdroje",
              "text": "Existují citace, autoři a odkazy?"
            },
            {
              "icon": "L",
              "title": "Logika",
              "text": "Navazuje závěr na důkazy?"
            },
            {
              "icon": "D",
              "title": "Didaktika",
              "text": "Pomůže úkol skutečnému cíli výuky?"
            }
          ]
        },
        {
          "type": "checklist",
          "title": "Před použitím materiálu zkontroluji",
          "items": [
            "Ověřil jsem klíčová fakta mimo odpověď AI.",
            "Zkontroloval jsem zadání, řešení a bodování.",
            "Obtížnost odpovídá cílové skupině.",
            "Instrukce jsou jednoznačné.",
            "Materiál neobsahuje citlivá data ani nevhodné generalizace."
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Požádat AI o kontrolu nestačí",
          "text": "Model může zopakovat vlastní chybu nebo vytvořit přesvědčivé vysvětlení nesprávného tvrzení. Nezávislý zdroj a odborný úsudek nelze obejít."
        }
      ]
    },
    {
      "id": "students",
      "title": "AI a zadávání úkolů žákům",
      "kicker": "VÝUKA A HODNOCENÍ · 10 MIN",
      "duration": 10,
      "summary": "Smyslem není hon na AI texty. Smyslem je navrhovat úkoly, ve kterých je vidět proces, zdroje a vlastní rozhodnutí žáka.",
      "trainerNote": "Zeptejte se: Který běžný domácí úkol dnes AI zvládne bez učení? Poté společně úkol přepracujte.",
      "blocks": [
        {
          "type": "comparison",
          "left": {
            "title": "Úkol snadno nahraditelný AI",
            "items": [
              "obecný referát bez práce se zdroji",
              "shrnutí známého tématu",
              "stejný esejový úkol pro všechny",
              "výsledek bez zachycení procesu"
            ]
          },
          "right": {
            "title": "Úkol podporující skutečné učení",
            "items": [
              "práce s konkrétním podkladem",
              "obhajoba voleb a změn",
              "srovnání zdrojů",
              "průběžné verze a reflexe",
              "ústní navázání nebo aplikace"
            ]
          }
        },
        {
          "type": "steps",
          "items": [
            {
              "title": "Stanovte pravidla použití",
              "text": "Co je dovoleno, co se má přiznat a co už je nahrazení vlastní práce."
            },
            {
              "title": "Hodnoťte proces",
              "text": "Návrh, zdroje, revize, rozhodnutí a reflexe jsou často cennější než hladký finální text."
            },
            {
              "title": "Vyžadujte dohledatelnost",
              "text": "Žák vysvětlí, jak AI použil, co odmítl, co ověřil a co upravil."
            },
            {
              "title": "Učte práci s chybou",
              "text": "AI výstup může být předmětem kritiky, opravování a argumentace."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "danger",
          "title": "Detektor AI není důkaz",
          "text": "Detektory AI mohou chybovat. Samy o sobě nejsou spravedlivým důkazem podvodu."
        }
      ]
    },
    {
      "id": "responsibility",
      "title": "Data, autorství a transparentnost",
      "kicker": "PRAVIDLA PRAXE · 8 MIN",
      "duration": 8,
      "summary": "Učitel musí vědět, co do nástroje vložil, co převzal, co ověřil a kdy je fér použití AI přiznat.",
      "trainerNote": "Nevytvářejte právní přednášku. Držte se praktických rozhodnutí: data, zdroje, kontrola, transparentnost a odpovědnost.",
      "blocks": [
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "D",
              "title": "Data",
              "text": "Používám jen nezbytné a anonymizované vstupy."
            },
            {
              "icon": "A",
              "title": "Autorství",
              "text": "Výběr, úpravy i odpovědnost nesu já."
            },
            {
              "icon": "T",
              "title": "Transparentnost",
              "text": "Umím popsat, jakou roli AI hrála."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Situace",
            "Rozumný postup"
          ],
          "rows": [
            [
              "Příprava běžného pracovního listu",
              "AI lze použít jako pomocníka; učitel ověří obsah, řešení a přiměřenost."
            ],
            [
              "Hodnocení konkrétního žáka",
              "Anonymizovat, držet se rubriky, výsledek přezkoumat a rozhodnutí nepřenést na AI."
            ],
            [
              "Citace nebo odborné tvrzení",
              "Dohledat primární či důvěryhodný zdroj a ověřit přesné znění."
            ],
            [
              "Materiál převzatý z publikace",
              "Respektovat licenci a autorská práva; AI není způsob, jak je obejít."
            ],
            [
              "AI výstup sdílený s kolegy",
              "Popsat účel, míru kontroly a případná omezení materiálu."
            ]
          ]
        },
        {
          "type": "quote",
          "text": "Odpovědné používání AI není jen otázka nástroje. Je to otázka profesního úsudku."
        }
      ]
    },
    {
      "id": "takeaway",
      "title": "Pět návyků pro běžnou práci",
      "kicker": "ZÁVĚR · 8 MIN",
      "duration": 8,
      "summary": "Na konci stačí jednoduchý rámec: cíl, bezpečný vstup, konkrétní zadání, kontrola a vlastní odpovědnost.",
      "trainerNote": "Závěr nechte praktický. Každý účastník si vybere jeden reálný úkol, na kterém v příštím týdnu bezpečný postup vyzkouší.",
      "blocks": [
        {
          "type": "flow",
          "items": [
            {
              "number": "1",
              "title": "Mám cíl",
              "text": "Vím, proč AI používám a co má výsledkem vzniknout."
            },
            {
              "number": "2",
              "title": "Dávám kontext",
              "text": "Dodám kvalitní podklad, publikum, omezení a kritéria."
            },
            {
              "number": "3",
              "title": "Chráním data",
              "text": "Nevkládám zbytečné osobní ani citlivé údaje."
            },
            {
              "number": "4",
              "title": "Ověřuji",
              "text": "Kontroluji fakta, zdroje, logiku, didaktiku i spravedlnost."
            },
            {
              "number": "5",
              "title": "Rozhoduji já",
              "text": "Konečný výstup je moje profesní odpovědnost."
            }
          ]
        },
        {
          "type": "activity",
          "title": "Osobní mini-plán",
          "brief": "Vyberte jednu opakující se činnost, u které může AI ušetřit čas, aniž by převzala vaše rozhodování.",
          "steps": [
            "Pojmenujte konkrétní úkol.",
            "Určete, kterou část může dělat AI.",
            "Určete, co musí zůstat na člověku.",
            "Napište způsob kontroly výsledku.",
            "Stanovte, jak ochráníte data."
          ],
          "output": "Jedna bezpečná a realistická situace k vyzkoušení během příštího týdne."
        },
        {
          "type": "callout",
          "tone": "success",
          "title": "Varianty podle zkušenosti skupiny",
          "text": "Pro méně zkušené: více živých ukázek a jeden společný úkol. Pro pokročilé: srovnání modelů, práce s delším podkladem, redesign hodnocení a společná tvorba pravidel předmětové komise."
        }
      ]
    }
  ]
};
