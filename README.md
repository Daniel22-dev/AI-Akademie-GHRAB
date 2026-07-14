# AI Akademie GHRAB

Soukromý modulární rozcestník interaktivních prezentací pro školitele projektu AI Studio GHRAB.

Akademie **není určena jako společný samostudijní portál pro celý sbor**. Slouží Danielovi jako jedno místo, ze kterého:

- připraví a spustí konkrétní školení;
- zobrazí si poznámky řečníka;
- přejde do prezentačního nebo celoobrazovkového režimu;
- stáhne samostatné interaktivní HTML konkrétní prezentace;
- odešle účastníkům pouze daný HTML soubor, nikoli celý rozcestník.

## Co obsahuje verze 1.1.0

1. **AI v práci učitele** — osvěta, kritické myšlení, ověřování a práce s materiály.
2. **První bezpečný vstup** — oprávnění, API klíč a bezpečnost.
3. **Diferenciátor: první materiál** — univerzální první aplikace napříč předměty.
4. **GitHub bez strachu** — zveřejňování interaktivních HTML materiálů.
5. **Generátor interaktivních testů**.
6. **LUDUS**.
7. **Korespondenční asistent**.
8. **Hodnotitel maturitních slohů**.
9. **Propojený workflow aplikací**.
10. **Mentor a správce školení**.

## Samostatné prezentace pro účastníky

Ve složce `exports/` je pro každé školení jeden samostatný HTML soubor:

```text
exports/
├── ai-literacy.html
├── start.html
├── differentiator.html
├── github.html
├── generator.html
├── ludus.html
├── correspondence.html
├── evaluator.html
├── workflow.html
└── administrator.html
```

Tyto soubory:

- fungují samostatně a offline;
- obsahují navigaci, kvízy, checklisty a celoobrazovkový režim;
- neobsahují ostatní prezentace;
- neobsahují interní poznámky řečníka;
- lze přímo stáhnout z karty nebo z otevřené prezentace.

## Modularizace

Zdrojový obsah jednotlivých školení je ve složce `courses/`. Jádro aplikace v `assets/js/app.js` z něj automaticky vytváří rozcestník i interní prezentační zobrazení.

Po změně obsahu je potřeba znovu vytvořit samostatné exporty:

```bash
npm run build:exports
```

Poté spusťte kontrolu:

```bash
npm test
```

## Klávesové zkratky

V rozcestníku:

- `←` / `→` — předchozí / další část;
- `F` — celá obrazovka;
- `P` — prezentační režim;
- `N` — poznámky řečníka.

V samostatném HTML pro účastníky:

- `←` / `→` nebo `Page Up` / `Page Down` — změna části;
- `Home` / `End` — první / poslední obrazovka;
- `F` — celá obrazovka.

## Nasazení na GitHub Pages

Aplikace je čistě statická. Nepotřebuje složku `.github` ani GitHub Actions.

1. Nahrajte obsah projektu do větve `main`.
2. Otevřete **Settings → Pages**.
3. Nastavte **Deploy from a branch → main → / (root)**.

Podrobný postup je v `NAHRANI-NA-GITHUB.md`.

## Bezpečnost

Do repozitáře nikdy nevkládejte:

- Gemini API klíče;
- soukromý podpisový klíč AI Studia;
- osobní přístupové soubory;
- neanonymizované studentské práce, e-maily, seznamy nebo výsledky;
- jakékoli heslo či jiný citlivý údaj.

## Autorství

Autor a vývojový garant: **Daniel Baláž**  
Školní projekt Gymnázia, Ostrava-Hrabůvka.
