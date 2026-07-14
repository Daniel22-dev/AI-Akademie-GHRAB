export default {
  id: 'evaluator',
  order: 7,
  code: 'HOD-01',
  title: 'Hodnotitel maturitních slohů',
  shortTitle: 'Hodnotitel',
  subtitle: 'Důkazní hodnocení podle pevné rubriky s učitelským schválením',
  category: 'Specializovaná aplikace',
  audience: 'Vyučující anglického jazyka',
  duration: 100,
  level: 'Pokročilé',
  required: false,
  accent: '#d7a04b',
  icon: './assets/apps/essay-evaluator-v2.png',
  prerequisites: ['start'],
  outcomes: [
    'Připravíte anonymizovaný jednotlivý nebo dávkový vstup.',
    'Rozlišíte AI jazykovou analýzu a deterministický výpočet bodů.',
    'Zkontrolujete důkazy, FAIL podmínky a konečnou známku.',
    'Schválíte a bezpečně vyexportujete zpětnou vazbu.'
  ],
  lessons: [
    {
      id: 'principle',
      title: 'Jak aplikace hodnotí',
      kicker: 'ARCHITEKTURA DŮVĚRY · 10 MIN',
      duration: 10,
      summary: 'AI analyzuje text a dokládá zjištění. Body, FAIL pravidla a známku počítá deterministická logika podle verzované rubriky.',
      trainerNote: 'Tento rozdíl je klíčový. Neříkejte „AI dává známku“; přesněji: AI připravuje jazykovou analýzu a aplikace podle pravidel počítá výsledek.',
      blocks: [
        { type: 'flow', items: [
          { number: '01', title: 'Vstup', text: 'Text práce, zadání, parametry a pseudonymní identifikátor.' },
          { number: '02', title: 'AI analýza', text: 'Nalezení důkazů, chyb, splnění zadání a úrovně výkonu.' },
          { number: '03', title: 'Validace', text: 'Kontrola úplnosti, důkazů a případný jeden opravný pokus.' },
          { number: '04', title: 'Výpočet', text: 'Body, FAIL podmínky a známka podle pevné rubriky.' },
          { number: '05', title: 'Učitel', text: 'Kontrola, případná úprava a výslovné schválení.' }
        ]},
        { type: 'callout', tone: 'warning', title: 'AI výstup není konečné hodnocení', text: 'Žádná zpětná vazba se nemá distribuovat bez učitelské kontroly a schválení.' }
      ]
    },
    {
      id: 'input',
      title: 'Jedna práce nebo dávka',
      kicker: 'VOLBA WORKFLOW · 12 MIN',
      duration: 12,
      summary: 'Aplikace podporuje jednu vloženou práci, skupinu v ZIPu, fotografie nebo PDF a import studentů z informačního systému.',
      trainerNote: 'Pro první školení začněte jedním čistým textem. Dávkové workflow ukažte až po zvládnutí individuálního hodnocení.',
      blocks: [
        { type: 'cards', columns: 4, items: [
          { icon: '1', title: 'Vložený text', text: 'Nejrychlejší cesta pro jednu práci.' },
          { icon: 'ZIP', title: 'Celá skupina', text: 'Až dvacet prací, seskupování a řízená fronta.' },
          { icon: 'PDF', title: 'Sken nebo fotografie', text: 'Nejprve přepis a potvrzení učitelem.' },
          { icon: 'IS', title: 'Import seznamu', text: 'Lokální párování pro distribuci; do AI odchází pseudonym.' }
        ]},
        { type: 'callout', tone: 'info', title: 'Začněte malým případem', text: 'Individuální workflow umožní pochopit rubriku, důkazní kontrolu i schválení bez složitosti dávky.' }
      ]
    },
    {
      id: 'privacy',
      title: 'Anonymizace a pseudonymizace',
      kicker: 'OCHRANA STUDENTŮ · 15 MIN',
      duration: 15,
      summary: 'Skutečná jména a e-maily slouží pouze k lokálnímu párování a distribuci. Do AI požadavku má odcházet pseudonymní kód a zkontrolovaný text.',
      trainerNote: 'Vysvětlete rozdíl: anonymizace odstraňuje identitu; pseudonymizace ji nahrazuje kódem, který lze lokálně spárovat.',
      blocks: [
        { type: 'comparison', left: { title: 'Lokálně v aplikaci', items: ['jméno pro párování', 'e-mail pro schválenou distribuci', 'pseudonymní historie po opt-in', 'učitelské poznámky podle nastavení'] }, right: { title: 'Do AI požadavku', items: ['pseudonymní kód', 'zkontrolovaný text práce', 'zadání a rubrika', 'bez jména a e-mailu'] } },
        { type: 'checklist', title: 'Před analýzou', items: ['Zkontroluji, že práce není zaměněná.', 'Odstraním jméno z textu nebo hlavičky.', 'U skenu potvrdím správnost přepisu.', 'Ověřím zadání a limit slov.', 'Použiji pouze schválenou verzi rubriky.'] },
        { type: 'callout', tone: 'danger', title: 'Citlivé ukládání je výchozí vypnuté', text: 'Bez vědomého zapnutí se nemá uchovávat studentský text, výsledek, seznam, podpis ani vlastní komentářová banka.' }
      ]
    },
    {
      id: 'rubric',
      title: 'Rubrika, důkazy a FAIL pravidla',
      kicker: 'ODBORNÁ KONTROLA · 18 MIN',
      duration: 18,
      summary: 'Každé kritérium se hodnotí podle pevné rubriky. Závěr musí být opřen o konkrétní důkazy z práce a respektovat podmínky neúspěchu.',
      trainerNote: 'Použijte anonymní ukázku a nechte kolegy dohledat důkaz pro jeden bod. Tím zabráníte slepému přijímání čísel.',
      blocks: [
        { type: 'cards', columns: 3, items: [
          { icon: '8', title: 'Pevná kritéria', text: 'Aplikace nevymýšlí nové hodnoticí oblasti mimo zadanou rubriku.' },
          { icon: '“”', title: 'Důkazy v textu', text: 'Každé zásadní hodnocení má být doložitelné konkrétní částí práce.' },
          { icon: '!', title: 'FAIL podmínky', text: 'Rozsah, téma, formát a další pevné podmínky se kontrolují odděleně.' }
        ]},
        { type: 'steps', items: [
          { title: 'Ověřte základní podmínky', text: 'Téma, útvar, délku, počet částí a další pevná pravidla.' },
          { title: 'Projděte jednotlivá kritéria', text: 'U každého zkontrolujte bodové zdůvodnění.' },
          { title: 'Najděte důkaz v práci', text: 'Důkaz musí odpovídat tvrzení a nesmí být vytržený z kontextu.' },
          { title: 'Zkontrolujte návaznost bodů a známky', text: 'Výpočet musí odpovídat rubrice a případným FAIL podmínkám.' }
        ]},
        { type: 'quiz', question: 'Co je nejlepší reakce, když je bodové hodnocení rozumné, ale uvedený důkaz v textu neodpovídá?', options: ['Hodnocení automaticky schválit.', 'Důkaz ignorovat, protože body vypadají správně.', 'Vrátit výstup k opravě nebo ho ručně upravit před schválením.', 'Zvýšit známku o jeden stupeň.'], answer: 2, explanation: 'Důkazní stopa je součástí spolehlivosti hodnocení a musí odpovídat textu.' }
      ]
    },
    {
      id: 'teacher-review',
      title: 'Učitelská revize',
      kicker: 'SCHVÁLENÍ · 15 MIN',
      duration: 15,
      summary: 'Učitel kontroluje slovní hodnocení, chyby, doporučení, tón i konečný výsledek. Teprve potom označí práci jako schválenou.',
      trainerNote: 'Nechte účastníky najít alespoň jednu větu, kterou by z pedagogických důvodů přeformulovali.',
      blocks: [
        { type: 'checklist', title: 'Před schválením', items: ['Výsledek odpovídá konkrétní práci.', 'Všechny zásadní závěry mají důkaz.', 'Počet slov je správný.', 'FAIL podmínky jsou správně vyhodnocené.', 'Zpětná vazba je věcná a srozumitelná.', 'Doporučení je konkrétní a proveditelné.', 'V reportu nejsou cizí nebo smyšlené informace.'] },
        { type: 'comparison', left: { title: 'Nevhodná zpětná vazba', items: ['obecné pochvaly bez důkazu', 'tvrdé soudy o schopnostech', 'dlouhý seznam bez priorit', 'jazyk, kterému student nerozumí'] }, right: { title: 'Užitečná zpětná vazba', items: ['konkrétní silná stránka', 'jedna až tři priority', 'příklad opravy', 'jasný další krok'] } }
      ]
    },
    {
      id: 'batch',
      title: 'Dávkové hodnocení a fronta',
      kicker: 'CELÁ SKUPINA · 12 MIN',
      duration: 12,
      summary: 'Dávka umožňuje zpracovat více prací, ale každá stále vyžaduje správné přiřazení, kontrolu vstupu a učitelské schválení.',
      trainerNote: 'Ukažte, jak aplikace řeší přerušenou dávku a proč se nemá spoléhat na neomezené automatické zpracování bez dohledu.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Zkontrolujte roster a soubory', text: 'Každá práce musí patřit správnému pseudonymu.' },
          { title: 'Potvrďte přepisy obrazových prací', text: 'Nesprávný přepis vede k nesprávnému hodnocení.' },
          { title: 'Spusťte řízenou frontu nebo podporovaný batch režim', text: 'Sledujte stav, chyby a orientační využití.' },
          { title: 'Řešte validační chyby jednotlivě', text: 'Neztrácejte přehled o konkrétní práci.' },
          { title: 'Schvalujte až po kontrole', text: 'Dávka nezrušila odpovědnost učitele.' }
        ]},
        { type: 'callout', tone: 'warning', title: 'Obnova dávky má omezení', text: 'Obnovení nemusí uchovávat původní binární přílohy. Při návratu je potřeba ověřit, které podklady jsou stále dostupné.' }
      ]
    },
    {
      id: 'export',
      title: 'Reporty a bezpečná distribuce',
      kicker: 'VÝSTUP · 13 MIN',
      duration: 13,
      summary: 'Schválené hodnocení lze exportovat jako TXT, DOCX, CSV, XLSX, tisk/PDF nebo dávkový ZIP. Gmail integrace má vytvářet koncepty nebo odesílat až po výslovném pokynu.',
      trainerNote: 'Pro první použití doporučte koncepty místo automatického odeslání. Uživatel tak ještě jednou zkontroluje adresáta i přílohu.',
      blocks: [
        { type: 'cards', columns: 4, items: [
          { icon: 'DOCX', title: 'Individuální report', text: 'Profesionální zpětná vazba pro studenta.' },
          { icon: 'XLSX', title: 'Třídní přehled', text: 'Body, známky a anonymní analytika.' },
          { icon: 'ZIP', title: 'Dávkový export', text: 'Oddělené soubory po schválení.' },
          { icon: '✉', title: 'Gmail koncepty', text: 'Kontrolovatelná distribuce přes přiloženou integraci.' }
        ]},
        { type: 'checklist', title: 'Před distribucí', items: ['Každá práce je schválená.', 'Jméno a e-mail jsou správně spárované lokálně.', 'Příloha patří správnému studentovi.', 'Text e-mailu neobsahuje cizí údaje.', 'Zvolený kanál odpovídá pravidlům školy.'] },
        { type: 'activity', title: 'Individuální hodnocení nanečisto', brief: 'Zpracujte jednu anonymní modelovou práci.', steps: ['Vložte zadání a text.', 'Spusťte analýzu.', 'Ověřte důkazy a body.', 'Upravte zpětnou vazbu.', 'Schvalte výsledek.', 'Vytvořte náhled DOCX nebo PDF reportu.'], output: 'Zkontrolovaný schválený report bez distribuce reálnému studentovi.' }
      ]
    }
  ]
};
