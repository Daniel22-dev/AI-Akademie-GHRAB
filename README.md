# AI Studio GHRAB · Akademie

Prémiový modulární vzdělávací portál pro školení učitelů k ekosystému AI Studio GHRAB.

## Co aplikace umí

- hlavní rozcestník všech základních a navazujících školení;
- logickou mapu společného základu a volitelných větví;
- samostatné obsahové moduly pro každé školení;
- režim běžného studia i režim prezentace na projektoru;
- poznámky školitele, které lze globálně zobrazit nebo skrýt;
- interaktivní checklisty a kontrolní otázky;
- místní ukládání postupu bez serveru a bez účtu;
- vyhledávání a filtrování školení;
- přímé odkazy na konkrétní lekce;
- full-screen režim a ovládání klávesnicí;
- instalaci jako PWA a offline použití po prvním načtení;
- automatickou kontrolu struktury a nasazení na GitHub Pages.

## Aktuální vzdělávací mapa

1. **První bezpečný vstup** — společný základ: oprávnění, API klíč, bezpečnost.
2. **Diferenciátor: první materiál** — společná praktická aplikace napříč předměty.
3. **GitHub bez strachu** — technický most pro interaktivní HTML materiály.
4. **Generátor interaktivních testů** — AJ, ŠJ, NJ a ČJ.
5. **LUDUS** — výukové hry, soutěže a lesson packy.
6. **Korespondenční asistent** — anonymizovaná školní komunikace.
7. **Hodnotitel maturitních slohů** — specializovaný workflow AJ.
8. **Propojený workflow aplikací** — jeden zdroj, více výstupů.
9. **Mentor a správce školení** — přístupy, evidence a provoz projektu.

## Doporučený repozitář

`AI-Akademie-GHRAB`

Výsledná adresa bude ve tvaru:

`https://daniel22-dev.github.io/AI-Akademie-GHRAB/`

## Nasazení

Repozitář obsahuje vlastní GitHub Actions workflow. Po nahrání souborů:

1. otevřete **Settings → Pages**;
2. v části **Build and deployment** zvolte **Source: GitHub Actions**;
3. otevřete záložku **Actions** a vyčkejte na zelené dokončení workflow;
4. odkaz se zobrazí v Settings → Pages i v dokončeném deploymentu.

Podrobný postup je v souboru `NAHRANI-NA-GITHUB.md`.

## Modularizace obsahu

Každé školení je samostatný soubor ve složce `courses/`:

```text
courses/
├── index.js
├── 00-start.js
├── 01-differentiator.js
├── 02-github.js
├── 03-generator.js
├── 04-ludus.js
├── 05-correspondence.js
├── 06-evaluator.js
├── 07-workflow.js
└── 08-administrator.js
```

Jádro aplikace samo vykresluje:

- karty a mapu kurzů;
- obsah lekcí;
- postupy, srovnání, tabulky a upozornění;
- checklisty, aktivity a kvízy;
- navigaci, progres a prezentační režim.

Při přidání nového školení se obvykle vytvoří pouze nový soubor v `courses/` a přidá se jeden import do `courses/index.js`. Není nutné kopírovat celou prezentaci nebo vytvářet nový navigační systém.

## Klávesové zkratky v otevřeném školení

- `←` / `→` — předchozí / další lekce;
- `F` — celá obrazovka;
- `P` — prezentační režim;
- `N` — poznámky školitele.

## Lokální kontrola

Vyžaduje Node.js 18 nebo novější.

```bash
npm test
```

Kontrola ověří povinné soubory, jedinečnost kurzů a lekcí, návaznosti, ikony, verzi PWA cache a základní bezpečnostní prvky stránky.

Pro lokální zobrazení je potřeba jednoduchý HTTP server, například:

```bash
python -m http.server 8080
```

Potom otevřete `http://localhost:8080`.

## Bezpečnostní hranice

Akademie je statická vzdělávací aplikace. Neuchovává centrální účty, studentská data ani API klíče. Místní postup, odpovědi a checklisty zůstávají v `localStorage` konkrétního prohlížeče.

Do repozitáře nikdy nevkládejte:

- Gemini API klíče;
- soukromý podpisový klíč AI Studia;
- přístupové soubory konkrétních uživatelů;
- seznamy studentů, výsledky nebo jiné osobní údaje.

## Autorství

Autor a vývojový garant: **Daniel Baláž**  
Školní projekt Gymnázia, Ostrava-Hrabůvka.
