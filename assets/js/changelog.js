export const APP_VERSION = '1.5.4';

// Zobrazuje se pouze deset nejnovějších položek. Novou změnu vložte nahoru;
// jedenáctá položka se automaticky přestane zobrazovat.
export const CHANGELOG = [
  {
    version: '1.5.4',
    date: '30. 9. 2026',
    title: 'Živý náhled slidu v konzoli školitele',
    changes: [
      'Konzole školitele nyní obsahuje skutečný náhled právě promítaného slidu vedle poznámek.',
      'Náhled vzniká ze stejného DOMu lesson-stage jako projekce a synchronizuje se při změně obsahu nebo rozměru.',
      'Konzole se otevírá v širším dvousloupcovém režimu a na menší obrazovce se náhled přesune nad poznámky.',
      'QA nově hlídá, že živý projekční náhled z Presenter enginu nezmizí.'
    ]
  },
  {
    version: '1.5.3',
    date: '30. 9. 2026',
    title: 'Logo školy bez vizuální transformace',
    changes: [
      'Zápatí zobrazuje dodané školní logo 1:1 bez invertování barev.',
      'Odstraněn režim mix-blend-mode: screen, který měnil vzhled znaku.',
      'PDF handouty zůstávají beze změny a používají stejný zdrojový obrázek.'
    ]
  },
  {
    version: '1.5.2',
    date: '30. 9. 2026',
    title: 'Správné logo školy',
    changes: [
      'Zápatí používá logo školy dodané vlastníkem projektu.',
      'Stejné logo se používá také ve všech generovaných PDF handoutech.',
      'Odstraněna předchozí záměna s jiným interním GHRAB symbolem.'
    ]
  },
  {
    version: '1.5.1',
    date: '30. 9. 2026',
    title: 'Přímé PDF handouty a sjednocené školní logo',
    changes: [
      'Handout se po kliknutí stáhne přímo jako hotové PDF bez tiskového dialogu.',
      'PDF handout obsahuje školní logo a Akademie používá stejný školní logo asset jako AI Studio.',
      'P5 artifact bundle nově zahrnuje také .nojekyll, takže trusted admission porovnává shodný runtime digest a počet souborů.',
      'Safe Promotion stále vyžaduje GREEN trusted admission před merge; chybějící required-check v Rulesetu je dočasně warning, nikoli samostatný FAIL.'
    ]
  },
  {
    version: '1.5.0',
    date: '30. 9. 2026',
    title: 'AI Akademie jako jednotné školicí centrum',
    changes: [
      'Původní dvojice vstupních kurzů byla sjednocena do jednoho povinného školení AI + AI Studio: promptování, bezpečnost, práce s daty, význam vlastních aplikací a orientace ve Studiu.',
      'Napříč Akademií je explicitní princip „AI pomáhá. Učitel kontroluje. Učitel rozhoduje.“; konečné pedagogické rozhodnutí se nepřenáší na AI.',
      'Katalog nyní pokrývá všech devět aktuálních aplikací AI Studia, nově včetně ACTIVA, SORTIO, Lesson Hubu a Maturita Desk.',
      'Každé školení má oddělená data pro handout. Tisk generuje čisté A4 PDF shrnutí bez interních poznámek školitele.',
      'Aplikační školení zobrazují verzi, pro kterou byl obsah ověřen, datum kontroly a verzi samotného školení.'
    ]
  },
  {
    version: '1.4.15',
    date: '27. 9. 2026',
    title: 'Rychlejší načítání a přehlednější šablona exportu',
    changes: [
      'Ikony kurzů a aplikace byly bezeztrátově překomprimovány. Obraz zůstává pixelově shodný, rozcestník při každém otevření stahuje o 173 kB (14,5 %) méně a samostatné HTML prezentace jsou o 17 % menší.',
      'Šablona samostatných prezentací je rozdělena do čitelných souborů ve složce scripts/export-template/. Před kompresí obrázků byly vygenerované exporty bajtově shodné s předchozí verzí.',
      'Sestavení exportů nově hlídá bezpečné zalomení řádků šablony a syntaxi běhového skriptu.'
    ]
  },
  {
    version: '1.4.14',
    date: '27. 9. 2026',
    title: 'GARP 2.7 r2 / G-02 hardening',
    changes: [
      'Referenční GARP 2.7 kontrakt byl aktualizován na consolidation r2 s opravou G-02 a připnutým ekosystémovým inventářem.',
      'Policy admission nyní fail-closed ověřuje kanonický appId, sémantický obsah všech deseti povinných sekcí, SemVer a zástupné hodnoty.',
      'GARP 2.5.1/N5/Safe Promotion zůstává regresní baseline; školní server a LIVE jsou nadále NOT_TESTED.'
    ]
  },
  {
    version: '1.4.13',
    date: '26. 9. 2026',
    title: 'Nová záložka O aplikaci',
    changes: [
      'Přidána samostatná karta O aplikaci podle stejného vzoru jako v AI Studiu: identita, autor a vývojový garant, školní projekt, určení, technický stav a provozní zásady.',
      'Samostatné tlačítko Změny a changelogový modal byly odstraněny; katalog změn je nyní sbalený přímo uvnitř karty O aplikaci.',
      'Zobrazení changelogu správně podporuje jak stručné záznamy, tak vícepoložkové změny.'
    ]
  },
  {
    version: '1.4.12',
    date: '23. 9. 2026',
    title: 'GARP 2.7 FOUNDATION a architecture integrity',
    changes: [
      'GARP 2.5.1/N5/Safe Promotion zůstává zachován a GARP 2.7 přidává samostatnou FOUNDATION/admission vrstvu bez falešného LIVE PASS.',
      'Nová architecture-integrity brána kontroluje importní graf, dynamický import do Studia, capability drift, obsah skutečného dist-pages artefaktu a zapojení CI.',
      'Mutation testy G27-AR01 až AR05 ověřují blokaci cyklu, testovacího bypassu v artefaktu, nového egressu, vynechání gate a konkurenčního legacy enginu.'
    ]
  },
  {
    version: '1.4.11',
    date: '22. 9. 2026',
    title: 'Návrat do AI Studia bez nové karty',
    detail: 'AI Akademie otevřená ze Studia nyní zůstává ve stejném kontextu prohlížeče. Tlačítko AI Studio se vrací přímo do Studia bez zavírání okna a bez otevírání nové karty; ověření plného správce a zákaz přenosu permitu zůstávají zachované.'
  },
  {
    version: '1.4.10',
    date: '21. 9. 2026',
    title: 'Safe Promotion a N5 release hardening',
    changes: [
      'Release cesta je připravena na candidate → povinné P5/GARP kontroly → PR → chráněný main → ověřený Pages deploy.',
      'N5 regresní sada nově explicitně odmítá privátní JWK, encrypted private PEM a private PGP block.',
      'Aktuální release evidence se váže na konkrétní commit, hash nasazovaného artefaktu a SBOM; centrální AI Studio auto-patch se pro Akademii nezapíná.'
    ]
  },
  {
    version: '1.4.9',
    date: '15. 9. 2026',
    title: 'GARP R12 assurance chain hardening',
    changes: [
      'Podepsany release manifest nyni povinne kryptograficky vaze provenance, evidence manifest a SBOM na skutecne predlozene soubory.',
      'School builder je fail-closed a musi odpovidat kanonickemu allowlistu vcetne workflow/entrypointu, pokud jsou pripnute.',
      'Evidence je znovu zmrazena az po finalizaci vsech externich souboru, aby nevznikal stale evidence manifest.'
    ]
  },
  {
    version: '1.4.8',
    date: '15. 9. 2026',
    title: 'GARP provenance a fail-closed PWA hardening',
    changes: [
      'Přesná build provenance je nově vázána na konkrétní BUILD-INPUT-SOURCE snapshot a podepsaný artifactDigest.',
      'Service worker už neuchovává interní obsah Akademie offline; při nedostupném serveru selže uzavřeně.',
      'Konzole školitele nepřenáší identifikátor relace v URL a 404 přesměrování je kompatibilní se školní cestou.'
    ]
  },
  {
    version: '1.4.7',
    date: '15. 9. 2026',
    title: 'GARP 2.5.1 SHIELD-PREP a oddělený deployment',
    detail: 'Doplněna release-integrity vrstva, oddělený school-server build, GARP security tooling, SBOM/provenance/evidence a fail-closed Service Worker výjimka pro integritní artefakty. Funkční obsah školení zůstává beze změny.'
  },
  {
    version: '1.4.6',
    date: '14. 9. 2026',
    title: 'Jednotný návrat do Studia vlevo nahoře',
    detail: 'Tlačítko AI Studio je po ověření full-admin oprávnění umístěno vlevo nahoře před značkou Akademie, stejně jako návratová tlačítka ostatních aplikací. PWA-safe návrat, zákaz přenosu permitu a skrytí při prezentaci zůstávají zachované.'
  },
  {
    version: '1.4.5',
    date: '11. 9. 2026',
    title: 'Čistý přechod mezi Studiem a Akademií',
    detail: 'Studio otevírá Akademii mimo svůj PWA scope. Pokud byla Akademie otevřena ze Studia, tlačítko AI Studio zavře tuto pomocnou kartu a vrátí uživatele k původnímu Studiu; při samostatném otevření se Studio otevře v novém bezpečném kontextu.'
  },
  {
    version: '1.4.4',
    date: '11. 9. 2026',
    title: 'Bezpečný návrat do AI Studia',
    detail: 'Akademie po načtení ověří stávající správcovské oprávnění přes access runtime AI Studia. Pouze plnému správci zobrazí v horní navigaci tlačítko AI Studio; učitel ani zástupce správce jej neuvidí a mezi aplikacemi se nepřenáší žádný přístupový token.'
  },
  {
    version: '1.4.3',
    date: '17. 7. 2026',
    title: 'Opravená konzole, aktualizace a prezentační režim',
    detail: 'Konzole školitele nyní běží v samostatném bezpečném souboru, poznámky se kontrolují proti zdrojům, aktualizace se načte jen po potvrzení a nikdy sama nepřeruší probíhající prezentaci. Zároveň byla opravena navigace, PWA cache, klávesnice a přístupnost.'
  },
  {
    version: '1.4.2',
    date: '15. 7. 2026',
    title: 'Hloubková revize prezentací',
    detail: 'Jádro všech deseti prezentací bylo zpřehledněno: kratší slidy, méně položek na obrazovce, civilnější jazyk, jasnější tabulky a kontroly věcné přesnosti u částí o API klíči, limitech a modelech.'
  },
  {
    version: '1.4.1',
    date: '15. 7. 2026',
    title: 'Poznámky přepsané skutečně lidským hlasem',
    detail: 'Mluvená opora všech 68 částí byla ručně přepracována. Zmizely univerzální věty, povinné shrnování každého slidu i šablonové přechody; každá lekce má vlastní civilní formulace a konkrétní otázku do praxe.'
  },
  {
    version: '1.4.0',
    date: '15. 7. 2026',
    title: 'Poznámky řečníka mají jasné pořadí',
    detail: 'Hlavní scénář je nově vedený v pěti očíslovaných krocích shora dolů: otevření, hlavní pointa, ukázka, zapojení skupiny a přechod. Metodické rady jsou oddělené jako nepovinná rychlá opora.'
  },
  {
    version: '1.4.0',
    date: '15. 7. 2026',
    title: 'Přirozenější formulace a plán při časové tísni',
    detail: 'Opakující se strojové věty byly nahrazeny pestřejšími formulacemi podle typu slidu. Každá část navíc obsahuje stručnou radu, co zachovat, když školitel nestíhá.'
  },
  {
    version: '1.3.2',
    date: '15. 7. 2026',
    title: 'Jasný konec a bezpečný návrat z prezentace',
    detail: 'Každé školení má závěrečnou obrazovku s tlačítky pro ukončení prezentace, návrat na rozcestník a nové spuštění od úvodu. V prezentačním režimu je navíc trvale dostupné tlačítko pro okamžité ukončení.'
  },
  {
    version: '1.3.2',
    date: '15. 7. 2026',
    title: 'Odstraněn osobní postup účastníka',
    detail: 'Akademie je znovu jednoznačně vedena jako databáze a prezentační centrum školitele. Zmizely procenta, označování dokončených částí i hodnocení návaznosti podle místního postupu.'
  },
  {
    version: '1.3.2',
    date: '15. 7. 2026',
    title: 'Changelog posledních deseti změn',
    detail: 'Historie změn je dostupná z horní navigace i z patičky. Seznam je omezen na deset nejnovějších položek; nové záznamy automaticky vytlačují nejstarší.'
  },
  {
    version: '1.3.1',
    date: '15. 7. 2026',
    title: 'Přepracovaný rozcestník vzdělávacích směrů',
    detail: 'Tvorba materiálů, komunikace, hodnocení, pokročilá práce a správa jsou nově rozloženy do vyvážených a srozumitelných bloků.'
  },
  {
    version: '1.3.0',
    date: '15. 7. 2026',
    title: 'Opravený projektorový režim',
    detail: 'Prezentace se přizpůsobují dostupné výšce, navigace zůstává viditelná a lektorské ovládání se při projekci skrývá.'
  },
  {
    version: '1.3.0',
    date: '15. 7. 2026',
    title: 'Samostatná konzole školitele',
    detail: 'Poznámky, časování, další část a ovládání prezentace lze ponechat na displeji notebooku při projekci na druhou obrazovku.'
  },
  {
    version: '1.3.0',
    date: '15. 7. 2026',
    title: 'Podrobné scénáře všech 68 částí',
    detail: 'Každá část má připravenou přímou řeč, otázku, očekávanou odpověď, demonstraci, riziko, přechod a záložní variantu.'
  },
  {
    version: '1.3.0',
    date: '15. 7. 2026',
    title: 'Samostatné HTML prezentace a úplný tisk do PDF',
    detail: 'Každé školení lze stáhnout jako jediný offline HTML soubor a vytisknout nebo uložit jako kompletní PDF materiál.'
  },
  {
    version: '1.3.0',
    date: '15. 7. 2026',
    title: 'Mobilní osnova a pohodlnější ovládání',
    detail: 'Samostatné prezentace dostaly mobilní obsah, větší dotykové prvky a ukládání stavu kvízů a checklistů.'
  },
  {
    version: '1.3.0',
    date: '15. 7. 2026',
    title: 'Jednotná vizuální sada kurzů',
    detail: 'Všech deset školení používá sjednocené ikony, nové typy obsahových bloků a konzistentnější prezentační kompozice.'
  }
].slice(0, 10);
