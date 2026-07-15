# AI Akademie GHRAB 1.3.1

Soukromý prezentační a školicí rozcestník projektu AI Studio GHRAB. Akademie je určena především školiteli: připraví výklad, zobrazí scénář řečníka, spustí čistou projekci a vytvoří samostatný interaktivní HTML materiál pro účastníky.

## Co přináší verze 1.3.1

### Oprava 1.3.1 — přehlednější vzdělávací mapa

- větev tvorby materiálů už není namačkaná do jedné řady,
- Diferenciátor je jasně označen jako výchozí krok,
- Generátor testů a LUDUS jsou přehledně zobrazeny jako dvě alternativy,
- komunikace a hodnocení mají vyvážené samostatné karty,
- pokročilý workflow a role správce jsou oddělené navazující možnosti,
- rozložení se přizpůsobuje notebooku, tabletu i mobilu.


- čistý projektorový režim s vlastní úvodní obrazovkou každého kurzu;
- automatické přizpůsobení všech slidů dostupné výšce bez rolování;
- oddělená Konzole školitele pro druhý monitor;
- 68 samostatných scénářů řečníka s přímou řečí, otázkou, očekávanou odpovědí, demonstrací, upozorněním, přechodem, záložní variantou a časováním;
- přesné rozlišení výukového času a rezervy na diskusi;
- skutečný místní postup kurzem, kvízy a checklisty;
- základní a rozšiřující cesta v každém školení;
- větvená vzdělávací mapa podle potřeb učitele;
- jednotná sada deseti ikon kurzů;
- nové vizuální formáty: hlavní myšlenka, modelová ukázka před/po, rozhodovací blok a praktická mise;
- plnohodnotný tisk nebo uložení celé samostatné prezentace do PDF;
- mobilní obsah, dotykové ovládání a trvalé uložení aktivit;
- rozšířené automatické kontroly obsahu, časů, exportů a soukromí poznámek.

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

## Doporučená vzdělávací cesta

Společný základ tvoří AI gramotnost a bezpečný vstup. Potom si účastník vybírá větev:

- tvorba materiálů: Diferenciátor, Generátor a LUDUS;
- komunikace: Korespondenční asistent;
- hodnocení: Hodnotitel;
- pokročilá práce: propojený pracovní postup po zvládnutí alespoň dvou aplikací;
- samostatná role: správce a lektor.

Každý kurz uvádí **základní cestu** a **rozšíření**. Není nutné absolvovat všechny kurzy ani všechny rozšiřující části.

## Bezpečná projekce s poznámkami

1. Ve Windows stiskněte `Win + P` a vyberte **Rozšířit**. Na macOS nastavte rozšířenou plochu v nastavení monitorů.
2. V Akademii otevřete **Konzoli školitele** a ponechte ji na displeji notebooku.
3. Hlavní prezentaci přesuňte na projektor a spusťte prezentační nebo celoobrazovkový režim.
4. Projektor zobrazuje pouze čistý slide. Poznámky, metodika a ovládání zůstávají v konzoli.

Při režimu **Duplikovat** nelze před účastníky skrýt obsah notebooku.

## Samostatné prezentace pro účastníky

Ve složce `exports/` je pro každý kurz jeden samostatný HTML soubor. Obsahuje pouze dané školení a funguje bez připojení k internetu.

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

Samostatné prezentace:

- neobsahují scénáře ani poznámky školitele;
- ukládají kvízy a checklisty pouze v místním prohlížeči;
- mají mobilní osnovu a ovládání o minimální dotykové výšce 44 px;
- lze vytisknout nebo uložit celé jako PDF;
- používají stejnou základní a rozšiřující cestu jako hlavní Akademie.

## Úprava obsahu

Obsah kurzů je ve složce `courses/`. Doplňující prezentační vrstvy jsou oddělené:

- `courses/presentation-enhancements.js` — základní cesty, rozhodovací bloky, kompozice a závěrečné mise;
- `courses/speaker-notes.js` — upravitelný scénář všech 68 částí;
- `scripts/build-speaker-notes.mjs` — volitelně znovu připraví výchozí scénáře z obsahu kurzů.

Po ruční úpravě `speaker-notes.js` nespouštějte `npm run build:notes`, pokud nechcete scénáře znovu vygenerovat.

## Sestavení a kontrola

Vyžadován je Node.js 18 nebo novější.

```bash
npm run build:exports
npm test
```

Volitelné příkazy:

```bash
npm run build:notes   # znovu vytvoří výchozí scénáře řečníka
npm run check         # kontrola bez nového sestavení exportů
```

Kontrola ověřuje mimo jiné:

- deset kurzů a jejich jedinečné identifikátory;
- shodu celkového času se součtem částí a rezervy;
- platnost kvízů a vizuálních bloků;
- existenci scénáře ke každé části;
- základní a rozšiřující cestu;
- závěrečný přenos do praxe;
- kompletní tiskový režim exportů;
- nepřítomnost interních poznámek v souborech pro účastníky;
- oddělené relace Konzole školitele;
- bezpečný fallback service workeru pouze pro navigaci.

## Klávesové zkratky

V hlavní Akademii:

- `←` / `→`, `Page Up` / `Page Down` — předchozí nebo další část;
- `Home` / `End` — úvodní nebo poslední obrazovka v prezentačním režimu;
- `P` — prezentační režim;
- `F` — celá obrazovka;
- `N` — poznámky nebo Konzole školitele.

V samostatném HTML:

- `←` / `→`, `Page Up` / `Page Down` — změna obrazovky;
- `Home` / `End` — první nebo poslední obrazovka;
- `F` — celá obrazovka.

## Bezpečnost a anonymizace

Do Akademie ani do veřejného repozitáře nevkládejte:

- API klíče, podpisové klíče, hesla nebo přístupové soubory;
- neanonymizované studentské práce, e-maily, seznamy či výsledky;
- kombinace údajů, podle nichž lze konkrétního člověka nepřímo poznat;
- interní dokumenty školy bez odpovídajícího oprávnění.

Odstranění jména nemusí být anonymizace. Před použitím odstraňte také třídu, diagnózu, kontakt, podpis a jedinečné osobní okolnosti. Konečnou odpovědnost za materiál, komunikaci nebo hodnocení má vždy učitel.

## Poznámka k modelovým ukázkám

Vizuální bloky označené **Modelová ukázka** nebo **Ukázka výsledku** nejsou vydávány za screenshot skutečné aplikace. Zobrazují bezpečně a srozumitelně princip „před a po“. Reálné screenshoty lze později doplnit, až budou k dispozici aktuální obrazovky jednotlivých aplikací bez osobních údajů a tajných klíčů.

## Nasazení

Aplikace je statická a nepotřebuje backend ani GitHub Actions. Postup pro GitHub Pages je v souboru `NAHRANI-NA-GITHUB.md`.

Autor a vývojový garant: **Daniel Baláž**  
Školní projekt Gymnázia, Ostrava-Hrabůvka.
