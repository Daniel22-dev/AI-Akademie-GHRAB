/* Etapa C · tři krátké školící prezentace; bez dat žáků a bez privilegovaných poznámek v handoutech. */
export const quickstartCourses = [
  {
    "id": "quick-studio",
    "order": 1,
    "code": "START-C1",
    "title": "První kroky v AI Studiu",
    "shortTitle": "Studio poprvé",
    "subtitle": "Přístup, orientace, Manuály a první bezpečný krok",
    "category": "Startovní průvodci",
    "audience": "Začínající kolegové všech předmětů",
    "level": "Start",
    "required": false,
    "prerequisites": [],
    "accent": "#8dcaff",
    "icon": "./assets/course-icons/ai-literacy.png",
    "reserve": 2,
    "outcomes": [
      "Najdete svůj přístup a víte, koho kontaktovat při zamčené aplikaci.",
      "Otevřete konkrétní manuál, aniž byste museli znovu absolvovat školení.",
      "Vytvoříte a ověříte první drobný výstup."
    ],
    "lessons": [
      {
        "id": "first-access",
        "title": "První vstup a oprávnění",
        "duration": 5,
        "kicker": "PŘÍSTUP · 5 MIN",
        "summary": "Otevřete oficiální školní AI Studio, ověřte Můj přístup a zjistěte, které aplikace jsou dostupné.",
        "trainerNote": "Použij bezpečný demonstrační účet. Neslibuj automatický přístup po pouhé účasti na školení.",
        "speakerNotes": {
          "say": [
            "Nejprve otevřu školní Studio jako obyčejný učitel, ne jako správce."
          ],
          "explain": [
            "Přístupové oprávnění není API klíč. Zamčenou aplikaci zpřístupňuje pověřený správce."
          ],
          "ask": [
            "Kde poznáš, jestli je GIT skutečně přístupný?"
          ],
          "expected": [
            "Kolega ukáže vlastní kartu a stav oprávnění, nikoli přímou URL."
          ],
          "demo": [
            "Promítni hlavní rozcestník a kartu Můj přístup bez skutečných cizích identit."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Nepředváděj obcházení přístupu ani cizí účet."
          ],
          "transition": [
            "Nyní oddělíme rychlou nápovědu od školicí prezentace."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "5 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "steps",
            "items": [
              {
                "title": "Otevři oficiální AI Studio",
                "text": "Použij školou potvrzený odkaz, ne kopii či náhodné sdílené HTML."
              },
              {
                "title": "Přejdi do Můj přístup",
                "text": "Zkontroluj aktuálně povolené aplikace a platnost oprávnění."
              },
              {
                "title": "Vyber jen dostupnou aplikaci",
                "text": "Pokud je uzamčená, kontaktuj správce po požadovaném školení."
              }
            ]
          },
          {
            "type": "comparison",
            "left": {
              "title": "Oprávnění Studia",
              "items": [
                "Povoluje konkrétní aplikace.",
                "Přiděluje jej správce.",
                "Není to účet poskytovatele AI."
              ]
            },
            "right": {
              "title": "AI připojení",
              "items": [
                "Umožňuje generování v aplikaci.",
                "Může být centrální nebo přes API klíč.",
                "Řeší se až po povolení aplikace."
              ]
            }
          },
          {
            "type": "callout",
            "tone": "warning",
            "title": "Nerovná se automatické zpřístupnění",
            "text": "Absolvování školení samo o sobě nezaručuje přidělení oprávnění. Řiďte se postupem školy."
          }
        ]
      },
      {
        "id": "manuals",
        "title": "Manuály zůstávají kdykoliv po ruce",
        "duration": 5,
        "kicker": "SAMOSTATNÁ POMOC · 5 MIN",
        "summary": "Manuály patří do AI Studia. AI Akademie slouží pouze pro vedená školení a předání stručného handoutu.",
        "trainerNote": "Nech každého kolegu skutečně otevřít manuál vlastní aplikace.",
        "speakerNotes": {
          "say": [
            "Až za týden zapomenu postup, nebudu znovu hledat video ze školení."
          ],
          "explain": [
            "Manuál je živá nápověda ve Studiu; prezentace patří školiteli. Rozdíly jsou záměrné."
          ],
          "ask": [
            "Kam klikneš, když si chceš za měsíc připomenout Apps Script?"
          ],
          "expected": [
            "Do sekce Manuály konkrétní aplikace GIT, nikoli do přednášky Akademie."
          ],
          "demo": [
            "Otevři ve Studiu Manuály, vyhledej GIT a ukaž cestu k prvnímu nastavení."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Nedávej interní poznámky školitele do účastnického PDF."
          ],
          "transition": [
            "Teď si všichni vytvoří první malý bezpečný výstup."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "5 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "cards",
            "columns": 2,
            "items": [
              {
                "icon": "📖",
                "title": "AI Studio → Manuály",
                "text": "Podrobný postup kdykoliv, včetně nastavení GIT a následné kontroly."
              },
              {
                "icon": "🎓",
                "title": "AI Akademie",
                "text": "Projektor, živá ukázka a soukromé poznámky školitele. Po školení stručný handout."
              }
            ]
          },
          {
            "type": "activity",
            "title": "Najdi správný manuál",
            "brief": "V sekci Manuály najdi nástroj, který budeš používat první.",
            "steps": [
              "Otevři Manuály v AI Studiu.",
              "Vyber konkrétní aplikaci.",
              "Najdi část První nastavení nebo Co chci udělat.",
              "Ověř, zda je dostupné PDF a pro kterou aplikaci platí."
            ],
            "output": "Kolega ví, kde později najde konkrétní postup."
          }
        ]
      },
      {
        "id": "first-output",
        "title": "První výstup s vlastní kontrolou",
        "duration": 6,
        "kicker": "MINIDÍLNA · 6 MIN",
        "summary": "Z jednoduchého modelového zadání vytvořte výstup, ověřte ho a bezpečně uzavřete práci.",
        "trainerNote": "Ukázkový podklad musí být syntetický, krátký a snadno pedagogicky posouditelný.",
        "speakerNotes": {
          "say": [
            "První výstup nemusí být dokonalý. Musí být bezpečný a použitelný."
          ],
          "explain": [
            "Zvol jeden úkol, ověř výsledek, oprav chybu, nepředávej finální rozhodnutí AI."
          ],
          "ask": [
            "Co přesně musíš před použitím ve své třídě zkontrolovat?"
          ],
          "expected": [
            "Obsah, správnost, přiměřenost a nepřítomnost citlivých údajů."
          ],
          "demo": [
            "Ukaž fiktivní zadání na pět kontrolních otázek a vyznač jednu možnou chybu."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Neslibuj, že Studio opraví nebo rozpozná každou chybu."
          ],
          "transition": [
            "Zbytek detailů si může kolega bezpečně dohledat v Manuálech."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "6 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "mission",
            "label": "HOTOVÝ PRVNÍ KROK",
            "title": "Vytvoř a ověř jednu krátkou aktivitu",
            "brief": "Na syntetickém podkladu připrav pět otázek pro konkrétní ročník. Než aktivitu použiješ, projdi odpovědi a vhodnost obtížnosti.",
            "time": "5 MIN",
            "output": "Jeden malý zkontrolovaný materiál, ne jen rozpracované zadání."
          },
          {
            "type": "callout",
            "tone": "success",
            "title": "Co si odnést",
            "text": "Přístup → aplikace → bezpečný vstup → vlastní kontrola → Manuály pro další samostatnou práci."
          }
        ]
      }
    ],
    "handout": {
      "title": "První kroky v AI Studiu",
      "purpose": "První samostatné otevření Studia a orientace bez technického zahlcení.",
      "workflow": [
        "Otevři oficiální školní Studio.",
        "V Můj přístup zkontroluj povolené aplikace.",
        "Pro konkrétní postup otevři Manuály.",
        "Na modelových datech vyzkoušej první malý výstup.",
        "Kontroluj správnost a bezpečnost, na sdíleném zařízení ukonči práci."
      ],
      "checks": [
        "Vím, kde se řeší chybějící oprávnění?",
        "Umím znovu otevřít manuál dané aplikace?",
        "Ověřil jsem první výstup vlastní kontrolou?"
      ],
      "safety": [
        "Nepoužívej cizí oprávnění ani skutečné údaje žáků v modelové ukázce.",
        "Školicí materiály nenahrazují aktuální manuály."
      ],
      "teacherDecision": [
        "AI může vytvořit návrh; učitel kontroluje jeho správnost a bezpečnost.",
        "Učitel rozhoduje o použití výstupu v konkrétní třídě."
      ],
      "footer": "AI pomáhá. Učitel kontroluje. Učitel rozhoduje."
    },
    "duration": 18
  },
  {
    "id": "quick-api",
    "order": 2,
    "code": "START-C2",
    "title": "Jak bezpečně připojit AI",
    "shortTitle": "AI a API klíč",
    "subtitle": "Oprávnění, AI klíč, kontrola připojení a diagnostika",
    "category": "Startovní průvodci",
    "audience": "Učitelé, kteří poprvé připojují generativní AI",
    "level": "Start",
    "required": false,
    "prerequisites": [
      "ai-literacy"
    ],
    "accent": "#73e8ce",
    "icon": "./assets/course-icons/ai-literacy.png",
    "reserve": 1,
    "outcomes": [
      "Rozlišíte oprávnění Studia od API klíče.",
      "Bezpečně připojíte schválenou AI podle aktuálního nastavení aplikace.",
      "Zvládnete první kontrolu chyb připojení bez vyzrazení tajemství."
    ],
    "lessons": [
      {
        "id": "two-keys",
        "title": "Přístup do aplikace není API klíč",
        "duration": 5,
        "kicker": "ROZLIŠENÍ · 5 MIN",
        "summary": "Dvě nezávislé podmínky: právo spustit aplikaci a možnost volat AI službu.",
        "trainerNote": "Záměrně nevysvětluj fakturaci a architekturu serveru; kolega potřebuje základní rozhodnutí.",
        "speakerNotes": {
          "say": [
            "V tuto chvíli potřebujeme rozlišit dvě věci, které vypadají podobně, ale fungují úplně jinak."
          ],
          "explain": [
            "Oprávnění otevírá konkrétní aplikaci, AI připojení jí zpřístupňuje model."
          ],
          "ask": [
            "Komu zavoláš, když se GIT vůbec neotevře?"
          ],
          "expected": [
            "Správci oprávnění; měnit API klíč při zamčené aplikaci nepomůže."
          ],
          "demo": [
            "Nakresli dvě brány: Studio → přístup; aplikace → AI konektor."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Nikdo nemá posílat tajný klíč do společného chatu nebo na projektor."
          ],
          "transition": [
            "Předvedeme bezpečný postup připojení bez zveřejnění tajných hodnot."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "5 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "comparison",
            "left": {
              "title": "Přístup Studia",
              "items": [
                "Vydává škola podle rolí.",
                "Umožňuje otevřít konkrétní aplikaci.",
                "Neurčuje, zda je zaplacená AI služba."
              ]
            },
            "right": {
              "title": "API klíč / školní AI",
              "items": [
                "Autorizuje požadavky AI poskytovateli.",
                "U některých nástrojů se používá jen v relaci.",
                "Při centrálním připojení není osobní klíč vždy nutný."
              ]
            }
          },
          {
            "type": "quiz",
            "question": "Oprávnění ke GIT je aktivní, ale AI generování hlásí chybu. Co má smysl zkontrolovat?",
            "options": [
              "Vypnout školní ochranu Studia.",
              "Stav AI připojení v aplikaci.",
              "Zveřejnit svůj API klíč v tabulce Sheets."
            ],
            "answer": 1,
            "explanation": "Oprávnění a AI připojení jsou oddělené. Tajné klíče nikomu nezveřejňujeme."
          }
        ]
      },
      {
        "id": "connect",
        "title": "Připoj AI bezpečně",
        "duration": 6,
        "kicker": "ŽIVÁ UKÁZKA · 6 MIN",
        "summary": "V GIT ověřte sekci AI připojení; klíč vkládejte pouze do schváleného pole a jen pokud není dostupné centrální školní připojení.",
        "trainerNote": "Skutečnou hodnotu klíče nikdy nepromítej; ukázku proveď s maskovaným polem nebo syntetickou hodnotou a potvrď jen stav.",
        "speakerNotes": {
          "say": [
            "Tady ukážu, kam klíč patří. Jeho skutečnou hodnotu ale na projekci nikdo neuvidí."
          ],
          "explain": [
            "V GIT najdi 🔑 AI připojení. Připojit pro tuto relaci je jednorázová práce; centrální školní připojení může později postup změnit."
          ],
          "ask": [
            "Ve kterém okamžiku bys zastavil a požádal o pomoc správce?"
          ],
          "expected": [
            "Když není povolená aplikace, klíč není schválený nebo spojení nefunguje ani po kontrole stavu."
          ],
          "demo": [
            "Promítni pouze rozhraní a maskované vstupní pole; potvrzující indikaci předveď bez odhalení tajemství."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Nekopíruj osobní token do sdílené prezentace, Formuláře ani e-mailu."
          ],
          "transition": [
            "Otestujeme, jak poznat správné připojení."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "6 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "steps",
            "items": [
              {
                "title": "Otevři přístupnou aplikaci",
                "text": "V GIT hledej 🔑 AI připojení na úvodní stránce."
              },
              {
                "title": "Zkontroluj školní postup",
                "text": "Pokud je k dispozici centrální připojení, nenastavuj zbytečně vlastní klíč."
              },
              {
                "title": "Vlož pouze schválený klíč",
                "text": "Výhradně do určeného maskovaného pole aplikace, nikdy do zadání nebo veřejného HTML."
              },
              {
                "title": "Použij Připojit pro tuto relaci",
                "text": "Ověř skutečnou indikaci dostupnosti, nikoli jen kliknutí na tlačítko."
              }
            ]
          },
          {
            "type": "callout",
            "tone": "danger",
            "title": "Klíč je tajemství",
            "text": "Nikdy jej nepouštěj na projektor, do účastnického handoutu, snímku obrazovky, e-mailu, Sheets ani veřejného repozitáře."
          }
        ]
      },
      {
        "id": "diagnostics",
        "title": "Když generování nefunguje",
        "duration": 5,
        "kicker": "DIAGNOSTIKA · 5 MIN",
        "summary": "Postupně ověřte přístup, stav AI, správný účet, případný limit a zprávu o chybě.",
        "trainerNote": "Nech účastníky vysvětlit pořadí kroků, teprve potom nabídni konkrétní podporu.",
        "speakerNotes": {
          "say": [
            "Když vidím chybovou hlášku, nezačnu náhodně vypínat bezpečnostní omezení."
          ],
          "explain": [
            "Ověřím dostupnost aplikace, připojení, případné limity a až potom předám popis chyby bez citlivých hodnot."
          ],
          "ask": [
            "Jaký bezpečný důkaz chyby můžeš poslat správci?"
          ],
          "expected": [
            "Text hlášky, čas a název aplikace bez API klíče či osobních údajů."
          ],
          "demo": [
            "Ukaž dvě syntetické chyby: zamčenou aplikaci a odpojený model."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Nikdy neloguj ani neposílej syrový autentizační klíč."
          ],
          "transition": [
            "Další krok je konkrétní pracovní úkol v aplikaci, nikoli další technická přednáška."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "5 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "flow",
            "items": [
              {
                "number": "01",
                "title": "Oprávnění",
                "text": "Je aplikace skutečně dostupná?"
              },
              {
                "number": "02",
                "title": "AI připojení",
                "text": "Ukazuje rozhraní aktivní model?"
              },
              {
                "number": "03",
                "title": "Bezpečná diagnostika",
                "text": "Ulož jen text chyby a čas bez tajných hodnot."
              },
              {
                "number": "04",
                "title": "Manuály / správce",
                "text": "Použij aktuální postup, případně se obrať na pověřenou osobu."
              }
            ]
          },
          {
            "type": "mission",
            "label": "OVĚŘENÍ POROZUMĚNÍ",
            "title": "Vysvětli dvě rozdílné chyby",
            "brief": "Popiš, proč zamčená aplikace a neplatný API klíč nejsou tentýž problém. Ukaž bezpečnou cestu k řešení.",
            "time": "3 MIN",
            "output": "Dvě jasná rozhodnutí bez zveřejnění tajemství."
          }
        ]
      }
    ],
    "handout": {
      "title": "Připojení AI a API klíč",
      "purpose": "Bezpečně připojit AI a zvládnout první diagnostiku.",
      "workflow": [
        "Ověř oprávnění ke konkrétní aplikaci.",
        "Zkontroluj, zda škola nepoužívá centrální AI.",
        "V aplikaci otevři schválené nastavení AI.",
        "Pokud je potřeba vlastní klíč, vlož jej výhradně do určeného pole.",
        "Ověř stav připojení a proveď malý test."
      ],
      "checks": [
        "Je aplikace povolená?",
        "Nemám klíč na screenshotu nebo projektoru?",
        "Připojení skutečně funguje?"
      ],
      "safety": [
        "Nikdy neposílej API klíč, autorizační token ani citlivé údaje žáků.",
        "Při problému sdílej pouze bezpečný popis chyby."
      ],
      "teacherDecision": [
        "AI může vytvořit návrh; učitel kontroluje jeho správnost a bezpečnost.",
        "Učitel rozhoduje o použití výstupu v konkrétní třídě."
      ],
      "footer": "AI pomáhá. Učitel kontroluje. Učitel rozhoduje."
    },
    "duration": 17
  },
  {
    "id": "quick-git",
    "order": 3,
    "code": "START-C3",
    "title": "První test v GIT",
    "shortTitle": "GIT první test",
    "subtitle": "Od procvičování po bezpečný sběr výsledků ve školní hodině",
    "category": "Startovní průvodci",
    "audience": "Učitelé připravující svůj první test",
    "level": "Praktický start",
    "required": false,
    "prerequisites": [
      "ai-literacy"
    ],
    "accent": "#50e8ff",
    "icon": "./assets/course-icons/generator.png",
    "reserve": 2,
    "outcomes": [
      "Zvolíte režim a zkontrolujete odpovědní klíč.",
      "Rozešlete kódy jen přítomným a správně zaznamenáte START a END.",
      "Načtete původní CSV do Verifieru a pedagogicky prověříte výsledky."
    ],
    "lessons": [
      {
        "id": "choose",
        "title": "Nejdřív krátké procvičování",
        "duration": 6,
        "kicker": "NEJLEHČÍ CESTA · 6 MIN",
        "summary": "Jasný cíl, 5–8 otázek a okamžitá kontrola. Bez Google Forms, Apps Scriptu a Teacher Verifieru.",
        "trainerNote": "Nenech kolegy hned konfigurovat bezpečný test. Nejprve funkční krátké procvičování.",
        "speakerNotes": {
          "say": [
            "Než přejdeme k ostrému testování, vytvoříme maličkost, kterou lze zkontrolovat během dvou minut."
          ],
          "explain": [
            "Procvičování nepotřebuje celý řetězec Google Forms ani Verifier. Nejprve ověř obsah, potom techniku."
          ],
          "ask": [
            "Co z tohoto postupu je nezbytné i u ostrého testu?"
          ],
          "expected": [
            "Kontrola zadání, klíče a průchodu na cílovém zařízení."
          ],
          "demo": [
            "Zvol jednoduché zadání v GIT, vygeneruj otázky a ukaž chybnou či správnou odpověď."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Nespouštěj klasifikovaný test jen proto, že HTML procvičování fungovalo."
          ],
          "transition": [
            "Teď vysvětlíme, co přibývá u bezpečného testu."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "6 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "steps",
            "items": [
              {
                "title": "Vyber Procvičování",
                "text": "V Jednoduchém nastavení zvol krátkou látku, ročník, úroveň a cíl."
              },
              {
                "title": "Vytvoř jen několik úloh",
                "text": "Ověř správné i uznatelné varianty odpovědí."
              },
              {
                "title": "Vyzkoušej výsledek jako student",
                "text": "Na notebooku i mobilu ověř přechod úloh a zpětnou vazbu."
              }
            ]
          },
          {
            "type": "quiz",
            "question": "Co z následujícího potřebuješ pro obyčejné procvičování s okamžitým výsledkem?",
            "options": [
              "Povinně Apps Script a START značky.",
              "Správný výukový obsah a funkční studentský HTML.",
              "Učitelův soukromý Verifier na veřejném odkazu."
            ],
            "answer": 1,
            "explanation": "Procvičování je kratší cesta. Forms/Verifier se používají pro příslušný režim sběru klasifikovaných výsledků."
          }
        ]
      },
      {
        "id": "setup",
        "title": "Připrav bezpečný test a osobní kódy",
        "duration": 8,
        "kicker": "PŘÍPRAVA · 8 MIN",
        "summary": "Před klasifikací jednorázově nastav Forms a Sheets; v GIT připrav celou skupinu, vygeneruj test a poté stáhni správné CSV.",
        "trainerNote": "Tuto část promítej bez skutečných studentů. Zvlášť zdůrazni pořadí vzniku CSV po vytvoření testu.",
        "speakerNotes": {
          "say": [
            "U známkování je důležitá každá vazba, proto si nejdřív ukážeme celou mapu procesu."
          ],
          "explain": [
            "Google Forms jsou sběrná schránka, Sheets rozesílač osobních kódů, Teacher Verifier provádí kontrolu."
          ],
          "ask": [
            "Kdy smí kolega stáhnout finální CSV s Test ID?"
          ],
          "expected": [
            "Až po vytvoření testu, aby CSV patřilo správnému Test ID."
          ],
          "demo": [
            "Předveď syntetický roster, vygenerování testu a až potom stažení CSV pro Sheets."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Žádné studenty ani soukromý Verifier nevystavuj veřejně."
          ],
          "transition": [
            "V další části spustíme a uzavřeme testovací hodinu."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "8 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "flow",
            "items": [
              {
                "number": "01",
                "title": "Nastav jednou",
                "text": "Školní Google Forms, předvyplněná metadata a Apps Script pro Sheets."
              },
              {
                "number": "02",
                "title": "Vygeneruj test",
                "text": "Připrav osobní kódy celé skupiny, zkontroluj otázky a klíč."
              },
              {
                "number": "03",
                "title": "Ulož soubory",
                "text": "Studentský HTML na HTTPS; soukromý teacher_verifier.html zůstává učiteli."
              },
              {
                "number": "04",
                "title": "Až potom CSV",
                "text": "Stáhni CSV se správným Test ID, importuj jej do nového listu Sheets."
              }
            ]
          },
          {
            "type": "callout",
            "tone": "warning",
            "title": "Kódy nerozesílat před kontrolou",
            "text": "V hodině zaškrtni jen přítomné a použij GIT – kódy → 2. Náhled a odeslat ZAŠKRTNUTÝM. Nejprve zkontroluj adresu studentského testu."
          }
        ]
      },
      {
        "id": "start-end",
        "title": "START, skutečné odevzdání a END",
        "duration": 8,
        "kicker": "PRŮBĚH HODINY · 8 MIN",
        "summary": "Značky START a END musejí být opravdu odeslané do Forms; mezi nimi student odevzdá kompletní šifrovaný blok.",
        "trainerNote": "Toto je nejcitlivější moment. Vždy ukaž skutečné odeslání START a END, ne jen otevřený formulář.",
        "speakerNotes": {
          "say": [
            "Na tomto místě nestačí kliknout na START. Potřebuji skutečný záznam v Google Forms."
          ],
          "explain": [
            "Před startem studentů: Verifier → Zahájit příjem → školní Forms → Odeslat. Potom startovací kód. Po posledním legitimním odevzdání obdobně END."
          ],
          "ask": [
            "Co se stane, když otevřeš předvyplněný Forms, ale nestiskneš Odeslat?"
          ],
          "expected": [
            "Časová značka nevznikla, což může ovlivnit bezpečné vyhodnocení."
          ],
          "demo": [
            "V modelové hodině odešli START, odevzdej celý SECURE-ANSWERS-V1 a odešli END."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Zapomenutý START nesmí být podvržen falešným zpětným časem; použij jen transparentní korekci ve Verifieru."
          ],
          "transition": [
            "Nyní zkontrolujeme výsledek z původního CSV."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "8 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "steps",
            "items": [
              {
                "title": "Ve Verifieru ▶ Zahájit příjem",
                "text": "Ve školních Forms musíš skutečně stisknout Odeslat. Teprve pak sděl startovací kód."
              },
              {
                "title": "Student opravdu odevzdá",
                "text": "Do povinného odstavce Forms patří celý blok SECURE-ANSWERS-V1 a potvrzené Odeslat."
              },
              {
                "title": "Ve Verifieru ■ Ukončit příjem",
                "text": "Po posledním legitimním výsledku opět skutečně odešli END do Forms."
              }
            ]
          },
          {
            "type": "decision",
            "label": "PŘED TŘÍDOU",
            "question": "Značku START mám otevřenou, ale ještě neodeslanou. Můžu pustit studenty?",
            "options": [
              {
                "title": "Ne. Nejprve dokončím odeslání.",
                "text": "Potvrď START ve Forms pod školním učitelským účtem."
              },
              {
                "title": "Přeskočit a opravit později.",
                "text": "To není správný běžný postup. Dodatečná úprava musí být přiznaná a zdokumentovaná."
              }
            ]
          }
        ]
      },
      {
        "id": "results",
        "title": "CSV, Verifier a pedagogická kontrola",
        "duration": 6,
        "kicker": "PO HODINĚ · 6 MIN",
        "summary": "Stáhni původní Forms CSV, ve Verifieru ověř čas, identitu, bodování a případné chyby automatického uznání odpovědí.",
        "trainerNote": "Ukaž správně uznanou odpověď i přijatelnou formulaci, kterou je třeba ručně přezkoumat.",
        "speakerNotes": {
          "say": [
            "Formulář výsledky pouze sbírá. Rozhodující kontrola nás čeká ve Verifieru."
          ],
          "explain": [
            "Importuji originální CSV, přezkoumám identitu, časové značky, duplicity, body a přijatelné odpovědi."
          ],
          "ask": [
            "Může samotné upozornění Verifieru znamenat automaticky podvádění?"
          ],
          "expected": [
            "Ne. Jde o signál k prověření, nikoliv důkaz; učitel posoudí kontext."
          ],
          "demo": [
            "Na fiktivním CSV ukaž příklad problematického textového vyhodnocení a dokumentovanou opravu."
          ],
          "facilitation": [
            "Dej účastníkům prostor zkusit krok vlastní rukou a požádej o potvrzení konkrétního výsledku."
          ],
          "caution": [
            "Neukazuj skutečné studentské výsledky ani jejich osobní identifikátory."
          ],
          "transition": [
            "Na závěr přesměruj kolegy na aktuální manuál GIT, ne na interní prezentérské poznámky."
          ],
          "fallback": [
            "Pokud nefunguje připojení, použij připravený modelový příklad. Nic nepředstírej jako dokončenou živou akci."
          ],
          "shortcut": [
            "Zaměř se na rozhodovací bod a ověření výsledku. Detailní klikání si nech do individuální podpory."
          ],
          "timing": "6 min: krátké vysvětlení → názorná ukázka → samostatná zkouška"
        },
        "blocks": [
          {
            "type": "checklist",
            "title": "Kontrola výsledků před klasifikací",
            "items": [
              "Původní CSV z Forms je nezměněné a z odpovídajícího testu.",
              "START i END byly zaznamenané a časové okno souhlasí.",
              "Identity a případné duplicity jsou přezkoumané.",
              "Správnost a uznatelné varianty odpovědí kontroluje učitel.",
              "Výsledky ukládám bezpečně, neveřejné údaje nesdílím."
            ]
          },
          {
            "type": "mission",
            "label": "ZÁVĚREČNÁ KONTROLA",
            "title": "Zvládni jeden zkušební průchod bez žákovských dat",
            "brief": "Vytvoř test pro sebe, pošli si kód, odešli START, odpovědi a END, načti CSV a zkontroluj vyhodnocení.",
            "time": "5 MIN",
            "output": "Ověřený syntetický průchod a místo, kde je aktuální manuál GIT."
          }
        ]
      }
    ],
    "handout": {
      "title": "První test v GIT",
      "purpose": "Bezpečně připravit a vyhodnotit první školní test.",
      "workflow": [
        "Nejprve vyzkoušej krátké procvičování.",
        "Pro secure režim připrav Google Forms a Sheets jednou.",
        "Vytvoř test, zkontroluj otázky, připrav celou skupinu a po generování stáhni CSV.",
        "V Sheets zaškrtni přítomné, ověř odkaz a odešli osobní kódy.",
        "Ve Verifieru spouštěj START a skutečně odešli značku do Forms.",
        "Student odešle celý SECURE-ANSWERS-V1 do Forms.",
        "Po posledním odevzdání pošli END.",
        "Importuj originální CSV do Verifieru a ověř body i identity."
      ],
      "checks": [
        "Studentský HTML je na HTTPS, učitelský Verifier neveřejný?",
        "Je START opravdu odeslaný před pokusy?",
        "Je END opravdu odeslaný po pokusech?",
        "Proběhla pedagogická kontrola výsledků?"
      ],
      "safety": [
        "Nikdy nesděluj privilegovaný Teacher/Admin kód studentům; zamčení používá Recovery kód daného testu.",
        "Používej syntetická školící data. Pro konkrétní krok vždy otevři aktuální manuál GIT ve Studiu."
      ],
      "teacherDecision": [
        "AI může vytvořit návrh; učitel kontroluje jeho správnost a bezpečnost.",
        "Učitel rozhoduje o použití výstupu v konkrétní třídě."
      ],
      "footer": "AI pomáhá. Učitel kontroluje. Učitel rozhoduje."
    },
    "duration": 30
  }
];
