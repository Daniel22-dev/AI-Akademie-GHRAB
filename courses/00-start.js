export default {
  "id": "start",
  "order": 1,
  "code": "START-01",
  "title": "První bezpečný vstup",
  "shortTitle": "Start",
  "subtitle": "Přístup, API klíč a bezpečnost bez technického chaosu",
  "category": "Společný základ",
  "audience": "Všichni učitelé",
  "duration": 55,
  "reserve": 5,
  "level": "Začátečník",
  "required": true,
  "accent": "#50e8ff",
  "icon": "./assets/course-icons/start.png",
  "prerequisites": [
    "ai-literacy"
  ],
  "outcomes": [
    "Rozlišíte odkaz na Studio, školní oprávnění a API klíč.",
    "Aktivujete osobní přístup vydaný správcem.",
    "Bezpečně vytvoříte nebo zobrazíte vlastní Gemini API klíč.",
    "Poznáte, která data do AI nástrojů nepatří."
  ],
  "lessons": [
    {
      "id": "orientation",
      "title": "Co AI Studio opravdu je",
      "kicker": "ÚVOD · 5 MIN",
      "duration": 5,
      "summary": "Studio je vstupní portál. Samotný odkaz otevře rozcestník, ale konkrétní aplikaci zpřístupní až osobní oprávnění.",
      "trainerNote": "Začněte praktickým příkladem: ukažte kolegům kartu zamčené aplikace. Tím hned odstraníte očekávání, že samotný odkaz znamená přístup ke všemu.",
      "blocks": [
        {
          "type": "showcase",
          "label": "MODEL SYSTÉMU",
          "title": "Jeden odkaz nestačí — fungují tři oddělené vrstvy",
          "text": "Kolega musí rozlišit vstup do portálu, oprávnění ke konkrétní aplikaci a osobní API klíč.",
          "before": {
            "label": "NEJČASTĚJŠÍ OMYL",
            "title": "„Mám odkaz, takže mám přístup ke všemu.“",
            "items": [
              "portál se otevře",
              "aplikace zůstane zamčená",
              "uživatel neví, co chybí"
            ]
          },
          "after": {
            "label": "SPRÁVNÝ MODEL",
            "title": "Odkaz + oprávnění + API klíč",
            "items": [
              "jasný vstup do Studia",
              "odemčené jen proškolené aplikace",
              "osobní klíč pro generování"
            ]
          },
          "caption": "Tento model používejte při každé diagnostice problému."
        },
        {
          "type": "lead",
          "text": "AI Studio GHRAB propojuje samostatné školní nástroje. Každý učitel vidí jen aplikace, ke kterým má aktivovaný přístup."
        },
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "⌁",
              "title": "Jeden vstup",
              "text": "Kolega si uloží jediný odkaz na AI Studio a odtud otevírá dostupné aplikace."
            },
            {
              "icon": "◇",
              "title": "Řízený přístup",
              "text": "Každá aplikace se odemkne až po absolvování příslušného školení a vydání oprávnění."
            },
            {
              "icon": "⬡",
              "title": "Samostatné nástroje",
              "text": "Diferenciátor, Generátor, LUDUS i další aplikace mají vlastní účel a pracovní postup."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Nejdůležitější věta prvního školení",
          "text": "Odkaz na AI Studio otevře portál. Aplikaci ale zpřístupní až platné osobní oprávnění vydané správcem."
        }
      ]
    },
    {
      "id": "three-keys",
      "title": "Tři věci, které musí sedět",
      "kicker": "LOGIKA SYSTÉMU · 7 MIN",
      "duration": 7,
      "summary": "Když se aplikace nespustí, nehádejte. Zkontrolujte postupně odkaz na Studio, oprávnění a osobní API klíč.",
      "trainerNote": "Použijte přirovnání k budově: adresa školy, vstupní karta a energie pro konkrétní zařízení.",
      "blocks": [
        {
          "type": "flow",
          "items": [
            {
              "number": "01",
              "title": "Odkaz na Studio",
              "text": "Vede do portálu. Je stejný pro všechny."
            },
            {
              "number": "02",
              "title": "Oprávnění",
              "text": "Říká, které aplikace smí kolega otevřít."
            },
            {
              "number": "03",
              "title": "API klíč",
              "text": "Umožní aplikaci volat Gemini API."
            }
          ]
        },
        {
          "type": "comparison",
          "left": {
            "title": "Školní oprávnění",
            "items": [
              "Vydává správce AI Studia",
              "Odemkne konkrétní aplikace",
              "Je digitálně podepsané",
              "Zůstává v daném prohlížeči"
            ]
          },
          "right": {
            "title": "API klíč",
            "items": [
              "Vytváří si každý uživatel u Googlu",
              "Autorizuje požadavky na Gemini API",
              "Je osobní a tajný",
              "Nesmí být sdílen ani uložen na GitHub"
            ]
          }
        },
        {
          "type": "quiz",
          "question": "Kolega otevře AI Studio, ale Diferenciátor je zamčený. Co je nejpravděpodobnější příčina?",
          "options": [
            "Nemá založený GitHub účet.",
            "Nemá aktivované oprávnění pro Diferenciátor.",
            "Nemá v počítači nainstalovaný program Gemini.",
            "Používá příliš nový prohlížeč."
          ],
          "answer": 1,
          "explanation": "Přístup do portálu a oprávnění ke konkrétní aplikaci jsou dvě různé věci."
        }
      ]
    },
    {
      "id": "access",
      "title": "Aktivace osobního přístupu",
      "kicker": "PRAKTICKÝ POSTUP · 10 MIN",
      "duration": 10,
      "summary": "Po školení obdrží kolega podepsaný soubor nebo textový kód. Studio jej ověří přímo v prohlížeči.",
      "trainerNote": "Přístupové soubory rozdejte až ve chvíli, kdy mají všichni otevřenou stránku Můj přístup. Nevysvětlujte kryptografii do hloubky; stačí princip ověření podpisu.",
      "blocks": [
        {
          "type": "steps",
          "items": [
            {
              "title": "Otevřete AI Studio GHRAB",
              "text": "V horní navigaci zvolte Můj přístup."
            },
            {
              "title": "Vyberte způsob aktivace",
              "text": "Nejjednodušší je načíst soubor s příponou .ghrab-access.json. Záložní možností je vložit textový kód začínající ghrab1…"
            },
            {
              "title": "Klikněte na Ověřit a aktivovat",
              "text": "Studio ověří digitální podpis, dobu platnosti a seznam povolených aplikací."
            },
            {
              "title": "Zkontrolujte přehled oprávnění",
              "text": "U každé aplikace musí být jasně uvedeno, zda je odemčená nebo vyžaduje další školení."
            },
            {
              "title": "Vraťte se na hlavní stránku",
              "text": "Karta povolené aplikace už nebude zamčená."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "success",
          "title": "Soukromí přístupového souboru",
          "text": "Ověření probíhá lokálně v prohlížeči. Soubor ani jeho obsah se při aktivaci neposílají na server."
        },
        {
          "type": "callout",
          "tone": "info",
          "title": "Přístup je uložen v konkrétním prohlížeči",
          "text": "Na jiném počítači, v jiném profilu nebo po smazání dat prohlížeče může být nutná nová aktivace stejného oprávnění."
        }
      ]
    },
    {
      "id": "api-key",
      "title": "Gemini API klíč bez zbytečné techniky",
      "kicker": "GOOGLE AI STUDIO · 13 MIN",
      "duration": 13,
      "summary": "API klíč je osobní přístupový údaj pro Gemini API. Vytváří se a spravuje v Google AI Studiu.",
      "trainerNote": "Rozhraní Google AI Studio se může měnit. Vždy zdůrazněte cíl postupu: Dashboard → API Keys. Pevná čísla limitů neuvádějte; mění se podle modelu a účtu.",
      "blocks": [
        {
          "type": "lead",
          "text": "Aplikace používají modely Gemini přes API. Klíč pouze propojí požadavky s konkrétním Google účtem a projektem."
        },
        {
          "type": "steps",
          "items": [
            {
              "title": "Přihlaste se do Google AI Studia",
              "text": "Použijte účet, který pro tento účel smíte využívat."
            },
            {
              "title": "Otevřete Dashboard → API keys",
              "text": "Novému uživateli může AI Studio po přijetí podmínek vytvořit výchozí projekt a klíč."
            },
            {
              "title": "Vytvořte nebo zkopírujte klíč",
              "text": "Když klíč nevidíte, zvolte vytvoření nového klíče podle aktuální nabídky AI Studia."
            },
            {
              "title": "Vložte klíč jen do aplikace",
              "text": "Klíč nepatří do e-mailu, chatu, sdíleného dokumentu ani veřejného repozitáře."
            }
          ]
        },
        {
          "type": "callout",
          "tone": "warning",
          "title": "Bezplatná úroveň není univerzální slib",
          "text": "Dostupnost modelů a limity se mohou měnit podle účtu, projektu a zvoleného modelu. Aktuální stav vždy ověřujte v AI Studiu."
        },
        {
          "type": "callout",
          "tone": "info",
          "title": "Držte se aktuální nabídky AI Studia",
          "text": "Google může v rozhraní nabízet různé typy klíčů a postupy správy. Pro školení nepoužívejte staré screenshoty jako jediný zdroj pravdy."
        },
        {
          "type": "callout",
          "tone": "danger",
          "title": "Klíč chraňte jako heslo",
          "text": "Při podezření na únik klíč smažte nebo zneplatněte a vytvořte nový. Berte jej podobně vážně jako heslo."
        }
      ]
    },
    {
      "id": "safety",
      "title": "Bezpečnostní minimum pro učitele",
      "kicker": "DATA A ODPOVĚDNOST · 8 MIN",
      "duration": 8,
      "summary": "Do AI nástroje vkládáme jen to, co je pro úkol nezbytné. Osobní a citlivé údaje předem odstraníme.",
      "trainerNote": "U citlivých příkladů pracujte výhradně s fiktivními daty. Nechte kolegy sami pojmenovat rizikové údaje.",
      "blocks": [
        {
          "type": "comparison",
          "left": {
            "title": "Do aplikace lze běžně vložit",
            "items": [
              "anonymizovaný učební text",
              "obecné zadání aktivity",
              "ročník, úroveň a cíl",
              "fiktivní modelová situace"
            ]
          },
          "right": {
            "title": "Do aplikace nevkládejte",
            "items": [
              "jméno a příjmení žáka",
              "kontakt, adresa nebo rodné číslo",
              "zdravotní či rodinné informace",
              "neanonymizovaná komunikace"
            ]
          }
        },
        {
          "type": "cards",
          "columns": 3,
          "items": [
            {
              "icon": "1",
              "title": "Anonymizovat",
              "text": "Odstranit identifikátory a detaily, podle nichž by šlo člověka poznat."
            },
            {
              "icon": "2",
              "title": "Zkontrolovat",
              "text": "Ověřit správnost, přiměřenost, jazyk i splnění zadání."
            },
            {
              "icon": "3",
              "title": "Rozhodnout",
              "text": "Za konečný materiál, hodnocení nebo odpověď odpovídá učitel."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Který vstup je pro běžnou práci nejbezpečnější?",
          "options": [
            "„Petr Novák z 2.B má dyslexii a potřebuje jednodušší text.“",
            "„Připrav přehlednější variantu textu pro žáka, který potřebuje kratší věty, více členění a zvýraznění klíčových informací.“",
            "Fotografie Bakalářů se seznamem třídy.",
            "Přeposlaný e-mail rodiče včetně podpisu a telefonu."
          ],
          "answer": 1,
          "explanation": "Zadání popisuje potřebnou úpravu bez jména, třídy, diagnózy nebo jiné kombinace údajů, podle níž by šlo žáka poznat."
        }
      ]
    },
    {
      "id": "troubleshooting",
      "title": "Když něco nejde spustit",
      "kicker": "DIAGNOSTIKA · 7 MIN",
      "duration": 7,
      "summary": "Většina potíží spadá do tří oblastí: oprávnění, API klíč nebo prohlížeč. Postupujte po jedné.",
      "trainerNote": "Tuto část nevynechávejte. Kolegům dává pocit, že případná chyba není selhání uživatele a že existuje jasný postup.",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "Co vidím",
            "Pravděpodobná příčina",
            "Co udělám"
          ],
          "rows": [
            [
              "Aplikace je zamčená",
              "Chybí oprávnění",
              "Otevřu Můj přístup a zkontroluji povolené aplikace."
            ],
            [
              "API key not valid",
              "Chybný nebo zrušený klíč",
              "Zkopíruji celý klíč znovu nebo vytvořím nový."
            ],
            [
              "Quota / rate limit",
              "Dočasný nebo vyčerpaný limit",
              "Ověřím limity v AI Studiu a zkusím požadavek později."
            ],
            [
              "Nic se neuloží",
              "Soukromé okno nebo blokované úložiště",
              "Použiji běžné okno a povolím ukládání webu."
            ]
          ]
        },
        {
          "type": "checklist",
          "title": "Před odchodem ze školení ověřte",
          "items": [
            "Vidím aktivní přístup.",
            "Mám odemčenou dnešní aplikaci.",
            "Mám vložený a ověřený API klíč.",
            "Vím, kam hlásit technický problém.",
            "Vím, která data do aplikací nepatří."
          ]
        },
        {
          "type": "callout",
          "tone": "success",
          "title": "Další krok",
          "text": "Po zvládnutí společného základu pokračujte školením Diferenciátor: první materiál. Je použitelné napříč předměty a přináší rychlý praktický výsledek."
        }
      ]
    }
  ]
};
