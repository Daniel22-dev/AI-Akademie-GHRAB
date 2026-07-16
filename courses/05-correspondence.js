export default {
  "id": "correspondence",
  "order": 6,
  "code": "KOR-01",
  "title": "Korespondenční asistent",
  "shortTitle": "Korespondence",
  "subtitle": "Profesionální školní komunikace s povinnou anonymizací",
  "category": "Aplikace",
  "audience": "Všichni zaměstnanci školy",
  "duration": 80,
  "reserve": 5,
  "level": "Základní",
  "required": false,
  "accent": "#f0aa4b",
  "icon": "./assets/course-icons/correspondence.png",
  "prerequisites": [
    "start"
  ],
  "outcomes": [
    "Bezpečně anonymizujete příchozí školní zprávu.",
    "Rozlišíte rozbor, odpověď, vlastní e-mail a citlivou situaci.",
    "Vytvoříte stručnou, standardní a diplomatickou variantu.",
    "Před odesláním provedete věcnou a vztahovou kontrolu."
  ],
  "lessons": [
    {
      "id": "scope",
      "title": "Kdy má asistent smysl",
      "kicker": "ROZCESTNÍK · 8 MIN",
      "duration": 8,
      "summary": "Asistent pomáhá s tónem, strukturou a formulací. Nerozhoduje za učitele a neřeší citlivou situaci bez kontroly.",
      "trainerNote": "Zdůrazněte, že aplikace není automatický odesílač a nerozhoduje za učitele.",
      "blocks": [
        {
          "type": "showcase",
          "label": "PŘED A PO",
          "title": "Od dlouhého konceptu k odpovědi, která je stručná, přesná a citlivá",
          "text": "Asistent nemá rozhodnout za učitele. Má navrhnout varianty tónu a pomoci zkontrolovat, zda nic důležitého nechybí.",
          "before": {
            "label": "PŮVODNÍ KONCEPT",
            "title": "Emotivní nebo příliš dlouhá odpověď",
            "items": [
              "směšuje fakta a hodnocení",
              "obsahuje zbytečné osobní údaje",
              "není jasné, co má příjemce udělat"
            ]
          },
          "after": {
            "label": "FINÁLNÍ VERZE",
            "title": "Tři kontrolované varianty tónu",
            "items": [
              "stručná, standardní a diplomatická",
              "jasná fakta a další krok",
              "odeslání až po kontrole učitelem"
            ]
          },
          "caption": "Na živé ukázce vždy používejte fiktivní nebo důsledně anonymizovaný e-mail."
        },
        {
          "type": "cards",
          "columns": 2,
          "items": [
            {
              "icon": "↙",
              "title": "Příchozí zpráva",
              "text": "Rozbor faktů, požadavku a dalšího kroku."
            },
            {
              "icon": "✎",
              "title": "Vlastní e-mail",
              "text": "Koncept z bodů, cíle a požadovaného tónu."
            },
            {
              "icon": "⚡",
              "title": "Rychlá situace",
              "text": "Omluva, potvrzení, připomenutí nebo organizační sdělení."
            },
            {
              "icon": "!",
              "title": "Raději bez AI",
              "text": "Právní, kázeňské nebo velmi citlivé věci řeší člověk."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "danger",
          "title": "Kdy raději bez AI",
          "text": "Bezprostřední ohrožení, závažná právní nebo kázeňská věc, velmi citlivé zdravotní údaje či situace vyžadující osobní kontakt se neřeší pouhým generováním e-mailu."
        }
      ]
    },
    {
      "id": "anonymisation",
      "title": "Nejdřív anonymizace",
      "kicker": "PŘED ODESLÁNÍM MODELU · 15 MIN",
      "duration": 15,
      "summary": "Před vložením zprávy odstraňte jména, kontakty, třídu a jedinečné detaily. Nestačí jen vymazat příjmení.",
      "trainerNote": "Použijte fiktivní e-mail a ukažte ruční označení jmen, tříd, telefonů a dalších identifikátorů.",
      "blocks": [
        {
          "type": "comparison",
          "left": {
            "title": "Původní text",
            "items": [
              "Jana Nováková z 1.A",
              "telefon 777 123 456",
              "konkrétní zdravotní diagnóza",
              "podpis a e-mail rodiče"
            ]
          },
          "right": {
            "title": "Anonymizovaná verze",
            "items": [
              "[ŽÁKYNĚ] z [TŘÍDA]",
              "[TELEFON]",
              "[CITLIVÝ ÚDAJ] nebo vynechání",
              "[ZÁKONNÝ ZÁSTUPCE]"
            ]
          }
        },
        {
          "type": "steps",
          "items": [
            {
              "title": "Vložte příchozí text",
              "text": "Zpráva zůstává v pracovním prostoru aplikace."
            },
            {
              "title": "Spusťte anonymizační kontrolu",
              "text": "Označte nebo potvrďte nalezené identifikátory."
            },
            {
              "title": "Přečtěte anonymizovaný text celý",
              "text": "Automatická detekce nemusí najít každý kontextový údaj."
            },
            {
              "title": "Potvrďte bezpečný vstup",
              "text": "Teprve potom lze odeslat požadavek modelu."
            },
            {
              "title": "Po změně textu anonymizujte znovu",
              "text": "Stará kontrola už neplatí."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Co se má stát po úpravě původního e-mailu?",
          "options": [
            "Použije se stará anonymizace.",
            "Text se odešle bez kontroly.",
            "Anonymizace a kontrola se provedou znovu.",
            "Stačí přepnout barevné téma."
          ],
          "answer": 2,
          "explanation": "Nový obsah může obsahovat nové identifikátory, proto stará kontrola nesmí zůstat platná."
        }
      ]
    },
    {
      "id": "analysis",
      "title": "Rozbor příchozí zprávy",
      "kicker": "CO JE POTŘEBA VYŘÍDIT · 10 MIN",
      "duration": 10,
      "summary": "Než vznikne odpověď, aplikace pomůže oddělit fakta, požadavky, vztahovou rovinu a případná rizika.",
      "trainerNote": "Vysvětlete, že kvalitní odpověď nezačíná stylem, ale správným pochopením situace.",
      "blocks": [
        {
          "type": "cards",
          "columns": 2,
          "items": [
            {
              "icon": "F",
              "title": "Fakta",
              "text": "Co se stalo a co je doložitelné."
            },
            {
              "icon": "?",
              "title": "Požadavek",
              "text": "Co odesílatel explicitně nebo nepřímo očekává."
            },
            {
              "icon": "!",
              "title": "Riziko",
              "text": "Co může být sporné, citlivé nebo nejasné."
            },
            {
              "icon": "↗",
              "title": "Další krok",
              "text": "Co má příjemce udělat, zjistit nebo předat dál."
            }
          ]
        },
        {
          "type": "activity",
          "title": "Rozbor bez odpovědi",
          "brief": "Použijte fiktivní stížnost nebo organizační dotaz.",
          "steps": [
            "Anonymizujte text.",
            "Nechte aplikaci shrnout situaci.",
            "Označte, které závěry jsou fakta a které pouze interpretace.",
            "Doplňte chybějící otázky."
          ],
          "output": "Krátký věcný rozbor, na jehož základě lze bezpečně formulovat odpověď."
        }
      ]
    },
    {
      "id": "variants",
      "title": "Tři verze nejsou tři stupně slušnosti",
      "kicker": "VOLBA TÓNU · 15 MIN",
      "duration": 15,
      "summary": "Stručná, standardní a diplomatická verze mají jiný účel. Finální odpověď vždy upravuje učitel.",
      "trainerNote": "Neříkejte, že diplomatická verze je vždy nejlepší. Někdy je vhodnější jasná a krátká odpověď.",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Varianta",
            "Kdy ji volit",
            "Na co dát pozor"
          ],
          "rows": [
            [
              "Stručná",
              "potvrzení, jednoduchá informace, rychlá reakce",
              "aby nepůsobila chladně nebo odmítavě"
            ],
            [
              "Standardní",
              "většina běžné školní komunikace",
              "jasná struktura a úplnost"
            ],
            [
              "Diplomatická",
              "napětí, stížnost, nesouhlas, citlivý vztah",
              "aby nezamlžovala podstatnou informaci"
            ]
          ]
        },
        {
          "type": "checklist",
          "title": "Dobrá odpověď",
          "items": [
            "Je odpověď věcně správná?",
            "Neobsahuje něco, co nechci slíbit?",
            "Tón odpovídá vztahu k adresátovi?",
            "Nejsou v textu citlivé údaje navíc?",
            "Je jasné, co má adresát udělat?"
          ]
        }
      ]
    },
    {
      "id": "own-email",
      "title": "E-mail z vlastních bodů",
      "kicker": "TVORBA KONCEPTU · 10 MIN",
      "duration": 10,
      "summary": "Místo kopírování celé historie lze zadat několik bodů, příjemce, cíl a požadovaný tón.",
      "trainerNote": "Ukažte, že strukturované body jsou často bezpečnější než vložení kompletního řetězce e-mailů.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Určete adresáta a svou roli",
              "text": "Jiný tón má učitel vůči rodiči, kolegovi nebo externí instituci."
            },
            {
              "title": "Napište cíl zprávy",
              "text": "Například potvrdit, požádat, vysvětlit, odmítnout nebo navrhnout řešení."
            },
            {
              "title": "Přidejte jen nezbytná fakta",
              "text": "Ideálně v odrážkách a bez osobních údajů."
            },
            {
              "title": "Zvolte tón a délku",
              "text": "Stručný, standardní nebo diplomatický koncept."
            },
            {
              "title": "Doplňte vlastní hlas",
              "text": "Výsledek upravte tak, aby odpovídal vašemu stylu a skutečné situaci."
            }
          ]
        },
        {
          "type": "activity",
          "title": "Koncept z pěti bodů",
          "brief": "Připravte e-mail, který potřebujete během pracovního týdne.",
          "steps": [
            "Adresát a vztah.",
            "Účel.",
            "Tři nutná fakta.",
            "Požadovaný další krok.",
            "Termín nebo uzavření."
          ],
          "output": "Vlastní kontrolovaný e-mail ve zvoleném tónu."
        }
      ]
    },
    {
      "id": "final-check",
      "title": "Před odesláním čtu jako adresát",
      "kicker": "ODPOVĚDNOST UŽIVATELE · 12 MIN",
      "duration": 12,
      "summary": "Zkontrolujte věcnou správnost, tón, závazky, citlivé údaje a poslední větu. Až potom e-mail odešlete.",
      "trainerNote": "Dejte účastníkům jednoduchou pomůcku: FAKTA – TÓN – KROK – DATA – ADRESÁTI.",
      "blocks": [
        {
          "type": "flow",
          "items": [
            {
              "number": "F",
              "title": "Fakta",
              "text": "Je každé tvrzení pravdivé a ověřené?"
            },
            {
              "number": "T",
              "title": "Tón",
              "text": "Odpovídá vztahu a závažnosti situace?"
            },
            {
              "number": "K",
              "title": "Krok",
              "text": "Je jasné, co se bude dít dál?"
            },
            {
              "number": "D",
              "title": "Data",
              "text": "Nezůstaly v textu zbytečné osobní údaje?"
            },
            {
              "number": "A",
              "title": "Adresáti",
              "text": "Posílám zprávu správným lidem a správným kanálem?"
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Historie je volitelná",
          "text": "Korespondenční asistent má historii ve výchozím stavu vypnutou. Při vědomém zapnutí má uchovávat pouze omezené anonymizované výstupy lokálně v prohlížeči."
        },
        {
          "type": "quiz",
          "question": "Kdo odpovídá za konečný obsah odeslaného e-mailu?",
          "options": [
            "Model Gemini",
            "Korespondenční asistent",
            "GitHub Pages",
            "Člověk, který zprávu zkontroluje a odešle"
          ],
          "answer": 3,
          "explanation": "AI nástroj vytváří návrh; odpovědnost za fakta, tón a odeslání zůstává člověku."
        }
      ]
    },
    {
      "id": "practice",
      "title": "Výstup ze školení",
      "kicker": "SAMOSTATNÁ DÍLNA · 5 MIN",
      "duration": 5,
      "summary": "Účastník zpracuje jednu fiktivní nebo bezpečně anonymizovanou situaci a provede kompletní kontrolu.",
      "trainerNote": "Na prvním školení nepoužívejte skutečně konfliktní osobní komunikaci. Stačí modelová situace.",
      "blocks": [
        {
          "type": "activity",
          "title": "Jedna situace, tři varianty",
          "brief": "Zpracujte fiktivní školní dotaz nebo stížnost.",
          "steps": [
            "Anonymizujte vstup.",
            "Proveďte rozbor.",
            "Vytvořte tři varianty odpovědi.",
            "Vyberte nejvhodnější.",
            "Projděte kontrolu FAKTA – TÓN – KROK – DATA – ADRESÁTI."
          ],
          "output": "Hotový koncept, který lze po věcné kontrole použít."
        }
      ]
    }
  ]
};
