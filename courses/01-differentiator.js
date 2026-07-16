export default {
  "id": "differentiator",
  "order": 2,
  "code": "DIF-01",
  "title": "Diferenciátor: první materiál",
  "shortTitle": "Diferenciátor",
  "subtitle": "Jeden kvalitní podklad, několik pedagogicky smysluplných variant",
  "category": "Společná aplikace",
  "audience": "Učitelé všech předmětů",
  "duration": 70,
  "reserve": 7,
  "level": "Základní",
  "required": true,
  "accent": "#59e0a5",
  "icon": "./assets/course-icons/differentiator.png",
  "prerequisites": [
    "start"
  ],
  "outcomes": [
    "Připravíte kvalitní vstupní podklad a pedagogický kontext.",
    "Vytvoříte podpůrnou, standardní a rozšiřující variantu.",
    "Zkontrolujete ekvivalenci cílů a obtížnosti.",
    "Exportujete materiál do použitelného PDF."
  ],
  "lessons": [
    {
      "id": "purpose",
      "title": "Co diferenciace je a není",
      "kicker": "PEDAGOGICKÝ ZÁKLAD · 8 MIN",
      "duration": 8,
      "summary": "Diferenciace nemá snižovat cíl. Upravuje míru opory, rozsah kroku nebo hloubku přemýšlení.",
      "trainerNote": "Ukažte dvě krátké verze téhož úkolu: jednu pouze zkrácenou a druhou skutečně podpořenou. Nechte kolegy popsat rozdíl.",
      "blocks": [
        {
          "type": "showcase",
          "label": "WOW UKÁZKA",
          "title": "Jeden zdrojový materiál, tři použitelné cesty k témuž cíli",
          "text": "Stejný cíl, různá cesta.",
          "before": {
            "label": "PŮVODNÍ STAV",
            "title": "Jeden pracovní list pro celou třídu",
            "items": [
              "část žáků nestíhá instrukce",
              "část úkol dokončí příliš rychle",
              "učitel improvizuje až během hodiny"
            ]
          },
          "after": {
            "label": "VÝSLEDEK",
            "title": "Tři úrovně se stejným výukovým cílem",
            "items": [
              "větší opora pro slabší žáky",
              "standardní varianta pro většinu",
              "rozšiřující výzva pro silnější"
            ]
          },
          "caption": "Na školení ukažte nejprve výsledek a teprve potom nastavení aplikace.",
          "detail": "Slabší žák dostane více opory. Silnější žák dostane náročnější práci s myšlenkou, ne jen více úkolů."
        },
        {
          "type": "lead",
          "text": "Diferenciátor pomáhá učiteli proměnit jeden výchozí materiál do několika variant, které respektují různé potřeby žáků, ale stále míří ke společnému cíli."
        },
        {
          "type": "comparison",
          "left": {
            "title": "Pouhá úleva",
            "items": [
              "méně úloh bez rozmyslu",
              "nižší očekávání",
              "vynechání podstatné dovednosti",
              "jiný cíl bez zdůvodnění"
            ]
          },
          "right": {
            "title": "Smysluplná diferenciace",
            "items": [
              "jasnější instrukce",
              "opora, příklad nebo slovníček",
              "jiná míra samostatnosti",
              "rozšíření pro rychlejší žáky"
            ]
          }
        },
        {
          "type": "quote",
          "text": "Nejdříve určím, co musí zvládnout všichni. Teprve potom měním míru podpory, rozsah nebo náročnost zpracování."
        }
      ]
    },
    {
      "id": "source",
      "title": "Nejdřív připravím vstup",
      "kicker": "KVALITA VSTUPU · 10 MIN",
      "duration": 10,
      "summary": "Aplikace potřebuje vědět, co je cíl, co se nesmí změnit a kde má vytvořit rozdíly.",
      "trainerNote": "Nechte účastníky pracovat s vlastním krátkým materiálem. Doporučte rozsah, který lze během školení rychle zkontrolovat.",
      "blocks": [
        {
          "type": "cards",
          "columns": 2,
          "items": [
            {
              "icon": "A",
              "title": "Podklad",
              "text": "Text, pracovní list, zadání nebo sada úloh."
            },
            {
              "icon": "B",
              "title": "Skupina",
              "text": "Ročník, věk, úroveň a důležitý kontext."
            },
            {
              "icon": "C",
              "title": "Cíl",
              "text": "Co má žák na konci prokázat nebo vytvořit."
            },
            {
              "icon": "D",
              "title": "Omezení",
              "text": "Co se nesmí změnit, vynechat nebo zjednodušit."
            }
          ]
        },
        {
          "type": "checklist",
          "title": "Kvalitní vstup obsahuje",
          "items": [
            "Cíl aktivity je napsaný jednou větou.",
            "Text neobsahuje osobní údaje.",
            "Je jasné, co musí zůstat stejné.",
            "Vím, kde má být opora navíc.",
            "Vím, kde má být větší výzva."
          ]
        },
        {
          "type": "activity",
          "title": "Připravte vlastní vstup",
          "brief": "Vyberte materiál, který reálně použijete během nejbližších dvou týdnů.",
          "steps": [
            "Odstraňte jména a další osobní údaje.",
            "Napište jednou větou hlavní cíl.",
            "Určete, co se nesmí změnit.",
            "Popište tři skupiny žáků bez nálepkování konkrétních osob."
          ],
          "output": "Hotový vstup, který lze vložit do Diferenciátoru."
        }
      ]
    },
    {
      "id": "settings",
      "title": "Tři varianty bez tří různých cílů",
      "kicker": "PRÁCE V APLIKACI · 15 MIN",
      "duration": 15,
      "summary": "Základní, standardní a rozšiřující verze mají držet stejné jádro. Liší se oporou, tempem a hloubkou.",
      "trainerNote": "Při ukázce nepřeskakujte pole s pedagogickým kontextem. Právě jeho kvalita odlišuje odborný výstup od generického zjednodušení.",
      "blocks": [
        {
          "type": "flow",
          "items": [
            {
              "number": "A",
              "title": "Podpůrná varianta",
              "text": "Stejný cíl, více opory, kratší kroky, přehlednější instrukce a případně vzor."
            },
            {
              "number": "B",
              "title": "Standardní varianta",
              "text": "Referenční úroveň odpovídající běžnému očekávání pro danou skupinu."
            },
            {
              "number": "C",
              "title": "Rozšiřující varianta",
              "text": "Vyšší míra samostatnosti, přenos, argumentace, tvorba nebo hlubší propojení."
            }
          ]
        },
        {
          "type": "table",
          "headers": [
            "Prvek",
            "Podpůrná",
            "Standardní",
            "Rozšiřující"
          ],
          "rows": [
            [
              "Základní",
              "více opory",
              "kratší kroky, slovníček, příklady"
            ],
            [
              "Standardní",
              "běžný výkon",
              "plné zadání bez nadbytečné nápovědy"
            ],
            [
              "Rozšiřující",
              "hlubší práce",
              "argumentace, porovnání, samostatnější výstup"
            ]
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Pozor na skryté snížení cíle",
          "text": "Podpůrná varianta nesmí automaticky znamenat, že žák procvičuje jinou a méně důležitou dovednost."
        }
      ]
    },
    {
      "id": "generation",
      "title": "Vygenerovat nestačí",
      "kicker": "PRAKTICKÁ DÍLNA · 15 MIN",
      "duration": 15,
      "summary": "První výstup je návrh. Učitel kontroluje cíl, zadání, správnost a použitelnost ve třídě.",
      "trainerNote": "Po vygenerování dejte dvě minuty ticha na individuální kontrolu. Teprve potom sbírejte společné připomínky.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Přečtěte všechny tři varianty",
              "text": "Nekontrolujte pouze podpůrnou verzi. Chyba může být i ve standardní nebo rozšiřující variantě."
            },
            {
              "title": "Porovnejte vzdělávací cíl",
              "text": "Všechny varianty musí směřovat k tomu, co jste zadali jako společný výsledek."
            },
            {
              "title": "Ověřte odbornou správnost",
              "text": "Zkontrolujte fakta, terminologii, řešení a případné odpovědi."
            },
            {
              "title": "Zkontrolujte instrukce očima žáka",
              "text": "Žák musí vědět, co má dělat, v jakém rozsahu a jak bude výsledek vypadat."
            },
            {
              "title": "Upravte problematická místa",
              "text": "Regenerujte jen potřebnou část nebo proveďte ruční opravu."
            }
          ]
        },
        {
          "type": "checklist",
          "title": "Kontrola ekvivalence",
          "items": [
            "Všechny varianty míří ke stejnému cíli.",
            "Pokyny jsou jasné i bez ústního vysvětlení.",
            "Základní verze není jen zkrácená.",
            "Rozšiřující verze není jen delší.",
            "Řešení a očekávání sedí."
          ]
        }
      ]
    },
    {
      "id": "export",
      "title": "Export a použití ve výuce",
      "kicker": "DOKONČENÍ · 10 MIN",
      "duration": 10,
      "summary": "Před tiskem nebo sdílením zkontrolujte názvy variant, rozložení, instrukce a to, jestli materiál funguje bez dovysvětlení.",
      "trainerNote": "Ukažte, jak varianty označit neutrálně. Nedoporučujte názvy typu slabší, normální a chytří.",
      "blocks": [
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "01",
              "title": "Neutrální označení",
              "text": "Varianta A, B, C nebo barvy bez hodnotícího významu."
            },
            {
              "icon": "02",
              "title": "Jasné zadání",
              "text": "Každá verze má všechny potřebné instrukce a prostor pro práci."
            },
            {
              "icon": "03",
              "title": "Učitelský klíč",
              "text": "Řešení uchovávejte odděleně od žákovské verze."
            }
          ]
        },
        {
          "type": "activity",
          "title": "Výstup ze školení",
          "brief": "Dokončete jeden materiál, který lze skutečně použít.",
          "steps": [
            "Proveďte poslední odbornou kontrolu.",
            "Zvolte neutrální názvy variant.",
            "Exportujte PDF.",
            "Otevřete exportovaný soubor a zkontrolujte rozložení.",
            "Uložte si původní zdroj pro další práci."
          ],
          "output": "Tři kontrolované varianty materiálu a učitelský klíč."
        },
        {
          "type": "quiz",
          "question": "Který popis rozšiřující varianty je pedagogicky nejvhodnější?",
          "options": [
            "Stejné úlohy dvakrát.",
            "Více stran textu bez změny úkolu.",
            "Přenos dovednosti do nové situace a zdůvodnění postupu.",
            "Méně času na stejný úkol."
          ],
          "answer": 2,
          "explanation": "Rozšíření má přidat hloubku, samostatnost nebo přenos, nikoli jen mechanické množství."
        }
      ]
    },
    {
      "id": "next",
      "title": "Kam pokračovat",
      "kicker": "ROZCESTÍ · 5 MIN",
      "duration": 5,
      "summary": "Po Diferenciátoru se vzdělávací cesta větví podle toho, jaké nástroje chce učitel využívat.",
      "trainerNote": "Nechte účastníky zvolit si další větev. Není nutné, aby všichni absolvovali všechna školení.",
      "blocks": [
        {
          "type": "mission",
          "label": "DO PŘÍŠTÍHO TÝDNE",
          "title": "Připravte jednu skutečnou diferenciovanou sadu",
          "brief": "Vyberte materiál, který budete opravdu používat, vytvořte dvě až tři varianty a před hodinou je projděte podle kontrolního seznamu.",
          "time": "15 MIN",
          "output": "Jedna ověřená sada připravená pro konkrétní třídu."
        },
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "▤",
              "title": "Interaktivní materiály",
              "text": "GitHub → Generátor testů nebo LUDUS."
            },
            {
              "icon": "✉",
              "title": "Komunikace",
              "text": "Korespondenční asistent bez nutnosti GitHubu."
            },
            {
              "icon": "✓",
              "title": "Hodnocení",
              "text": "Hodnotitel maturitních slohů pro vyučující angličtiny."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "info",
          "title": "GitHub není povinný pro všechny",
          "text": "GitHub absolvují především učitelé, kteří chtějí zveřejňovat interaktivní HTML testy a hry. Pro Diferenciátor, Korespondenčního asistenta ani Hodnotitele není samostatný GitHub účet základní podmínkou běžné práce."
        }
      ]
    }
  ]
};
