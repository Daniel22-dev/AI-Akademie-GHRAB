export const APP_VERSION = '1.4.10';

// Zobrazuje se pouze deset nejnovějších položek. Novou změnu vložte nahoru;
// jedenáctá položka se automaticky přestane zobrazovat.
export const CHANGELOG = [
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
