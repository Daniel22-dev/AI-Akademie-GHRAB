# AI Akademie GHRAB 1.4.2

Soukromé prezentační centrum a interaktivní databáze školení projektu AI Studio GHRAB. Akademie je určena především školiteli: slouží k přípravě výkladu, správě scénářů řečníka, spuštění čisté projekce a vytvoření samostatných HTML materiálů pro účastníky.

Akademie **není samoobslužný kurz pro evidenci studijního postupu**. Nezobrazuje procenta absolvování ani neoznačuje dokončené lekce. Místní úložiště používá pouze pro praktické interaktivní prvky, například kvízy, checklisty a poslední otevřenou část.

## Novinky ve verzi 1.4.2

- proběhla hloubková revize obsahu všech **10 prezentací** a všech **68 lekcí**;
- husté slidy byly zkráceny, dlouhé seznamy omezeny a čtyřsloupcové bloky převedeny na čitelnější dvousloupcové rozvržení;
- jazyk byl přepsán do civilnější učitelské češtiny, aby prezentace nepůsobily jako technická dokumentace;
- u části o API klíči, modelech a limitech byly odstraněny zastarávající nebo příliš pevné formulace a nahrazeny bezpečnějším popisem podle aktuální dokumentace;
- tabulky, checklisty a porovnání mají méně řádků a jasnější názvy, aby je šlo přečíst z projektoru;
- barvy a výrazné bloky jsou použité střídměji: upozornění, rizika a praktické kroky jsou odlišené podle významu, ne jako dekorace;
- do projektu byl doplněn soubor `AUDIT-PREZENTACI-v1.4.2.md` s komentářem k provedeným změnám.

Verze 1.4.1 přepsala poznámky řečníka lidským hlasem. Verze 1.4.0 zavedla jasné pořadí poznámek a rychlou oporu školitele. Verze 1.3.2 přinesla závěrečné obrazovky, bezpečný návrat z prezentace a changelog. Verze 1.3.1 upravila rozcestník a verze 1.3.0 projektorový režim, konzoli školitele, tisk a vizuální systém.

## Deset školení

1. **AI v práci učitele** — AI gramotnost, ověřování a odpovědnost.
2. **První bezpečný vstup** — přístup, API klíč a bezpečnost dat.
3. **Diferenciátor: první materiál** — varianty stejného materiálu pro různé potřeby.
4. **GitHub bez strachu** — zveřejnění bezpečného interaktivního HTML.
5. **Generátor interaktivních testů**.
6. **LUDUS: dílna výukových her**.
7. **Korespondenční asistent**.
8. **Hodnotitel maturitních slohů**.
9. **Propojený pracovní postup aplikací**.
10. **Mentor a správce školení**.

## Logika rozcestníku

Společný základ tvoří AI gramotnost a bezpečný vstup. Potom lze podle cíle školení otevřít některou z větví:

- tvorba materiálů: Diferenciátor, Generátor a LUDUS;
- komunikace: Korespondenční asistent;
- hodnocení: Hodnotitel;
- pokročilá práce: propojený pracovní postup;
- samostatná role: správce a lektor.

Označení **základní cesta** a **rozšíření** pomáhá školiteli připravit kratší nebo podrobnější variantu prezentace. Nejde o evidenci absolvování účastníka.

## Bezpečná projekce s poznámkami

1. Ve Windows stiskněte `Win + P` a vyberte **Rozšířit**. Na macOS nastavte rozšířenou plochu v nastavení monitorů.
2. V Akademii otevřete **Konzoli školitele** a ponechte ji na displeji notebooku.
3. Hlavní prezentaci přesuňte na projektor a spusťte prezentační nebo celoobrazovkový režim.
4. Projektor zobrazuje čistý slide. Poznámky a metodika zůstávají v konzoli.
5. Na konci prezentace použijte závěrečný slide. Z režimu lze kdykoliv odejít také tlačítkem vpravo nahoře nebo klávesou `X`.

Při režimu **Duplikovat** nelze před účastníky skrýt obsah notebooku.

## Changelog

Changelog se otevírá:

- tlačítkem **Změny** v horní navigaci;
- tlačítkem **Changelog** v patičce.

Zdroj záznamů je v souboru:

```text
assets/js/changelog.js
```

Novou změnu vložte na začátek pole `CHANGELOG`. Aplikace zobrazuje pouze deset nejnovějších položek pomocí `.slice(0, 10)`, takže jedenáctý záznam automaticky zmizí.

## Samostatné prezentace pro účastníky

Ve složce `exports/` je pro každý kurz jeden samostatný HTML soubor. Obsahuje pouze dané školení a funguje bez připojení k internetu.

Samostatné prezentace:

- neobsahují scénáře ani poznámky školitele;
- ukládají kvízy a checklisty pouze v místním prohlížeči;
- mají mobilní osnovu a dotykové ovládání;
- lze vytisknout nebo uložit celé jako PDF;
- obsahují závěrečnou obrazovku s ukončením celé obrazovky a novým spuštěním.

## Úprava obsahu

Obsah kurzů je ve složce `courses/`. Doplňující prezentační vrstvy jsou oddělené:

- `courses/presentation-enhancements.js` — základní cesty, vizuální bloky a kompozice;
- `courses/speaker-notes.js` — upravitelný scénář všech 68 částí;
- `scripts/build-speaker-notes.mjs` — znovu sestaví ručně kurátorované mluvené opory a podpůrné body;
- `assets/js/changelog.js` — deset nejnovějších změn aplikace.

Trvalé změny mluvených formulací zapisujte do map v `scripts/build-speaker-notes.mjs` a potom spusťte `npm run build:notes`. Tím se změna bezpečně promítne do všech poznámek.

## Sestavení a kontrola

Vyžadován je Node.js 18 nebo novější.

```bash
npm run build:exports
npm test
```

Kontrola ověřuje mimo jiné:

- deset kurzů a 68 částí;
- shodu časů s obsahem a rezervou;
- scénáře ke všem částem;
- platnost kvízů a vizuálních bloků;
- závěrečnou obrazovku hlavní i samostatné prezentace;
- přítomnost changelogu s deseti položkami;
- nepřítomnost osobního postupu účastníka;
- nepřítomnost interních poznámek v exportech;
- bezpečné chování service workeru.

## Klávesové zkratky

V hlavní Akademii:

- `←` / `→`, `Page Up` / `Page Down`, mezerník — předchozí nebo další část;
- `Home` — úvodní obrazovka prezentace;
- `End` — závěrečná obrazovka prezentace;
- `P` — zapnutí nebo ukončení prezentačního režimu;
- `X` nebo `Esc` — okamžité ukončení prezentačního režimu;
- `F` — celá obrazovka;
- `N` — poznámky nebo Konzole školitele.

V samostatném HTML:

- `←` / `→`, `Page Up` / `Page Down` — změna obrazovky;
- `Home` / `End` — úvodní nebo závěrečná obrazovka;
- `F` — celá obrazovka;
- `Esc` — ukončení celé obrazovky.

## Bezpečnost a anonymizace

Do Akademie ani do veřejného repozitáře nevkládejte API klíče, hesla, přístupové soubory ani neanonymizované údaje studentů, rodičů či zaměstnanců. Odstranění jména samo o sobě nemusí znamenat anonymizaci; odstraňte také třídu, diagnózu, kontakt, podpis a jedinečné osobní okolnosti.

## Nasazení

Aplikace je statická a nepotřebuje backend ani GitHub Actions. Postup pro GitHub Pages je v souboru `NAHRANI-NA-GITHUB.md`.

Autor a vývojový garant: **Daniel Baláž**  
Školní projekt Gymnázia, Ostrava-Hrabůvka.
