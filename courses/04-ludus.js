export default {
  id: 'ludus',
  order: 5,
  code: 'LUD-01',
  title: 'LUDUS: dílna výukových her',
  shortTitle: 'LUDUS',
  subtitle: 'Proměňte učivo v hratelnou aktivitu bez ztráty vzdělávacího cíle',
  category: 'Aplikace',
  audience: 'Učitelé všech předmětů',
  duration: 90,
  level: 'Základní',
  required: false,
  accent: '#a877ff',
  icon: './assets/apps/ludus.png',
  prerequisites: ['start', 'github'],
  outcomes: [
    'Zvolíte vhodnou herní mechaniku podle cíle hodiny.',
    'Připravíte nebo importujete strukturovaný obsah.',
    'Vytvoříte hratelný export, třídní soutěž nebo lesson pack.',
    'Použijete učitelský režim a zkontrolujete průběh hry.'
  ],
  lessons: [
    {
      id: 'purpose',
      title: 'Hra není cíl sama o sobě',
      kicker: 'PEDAGOGICKÝ ZÁKLAD · 10 MIN',
      duration: 10,
      summary: 'LUDUS používá herní světy a mechaniky jako prostředek k procvičení učiva. Nejdříve se volí vzdělávací cíl, až potom estetika hry.',
      trainerNote: 'Položte otázku: Co má žák po skončení umět lépe? Pokud odpověď zní jen „bavit se“, je potřeba cíl zpřesnit.',
      blocks: [
        { type: 'flow', items: [
          { number: '01', title: 'Cíl', text: 'Dovednost nebo znalost, kterou má aktivita rozvíjet.' },
          { number: '02', title: 'Mechanika', text: 'Způsob rozhodování, spolupráce, soutěže nebo postupu.' },
          { number: '03', title: 'Svět', text: 'Vizuální a příběhový rámec, který podporuje motivaci.' },
          { number: '04', title: 'Obsah', text: 'Otázky, úkoly a zpětná vazba odpovídající cíli.' }
        ]},
        { type: 'comparison', left: { title: 'Efektní, ale slabé', items: ['příběh nesouvisí s úlohami', 'náhoda převažuje nad učením', 'žáci čekají bez aktivity', 'body odměňují rychlost místo kvality'] }, right: { title: 'Pedagogicky funkční', items: ['mechanika vyžaduje práci s učivem', 'každý žák má roli', 'zpětná vazba podporuje učení', 'výsledek lze reflektovat'] } }
      ]
    },
    {
      id: 'route',
      title: 'Vyberte pracovní cestu',
      kicker: 'ROZCESTNÍK · 10 MIN',
      duration: 10,
      summary: 'LUDUS nabízí několik cest: hra z vlastního učiva, import z AI Studia, třídní soutěž a lesson pack.',
      trainerNote: 'Pro první školení použijte jednu cestu. Doporučená je hra z vlastního krátkého učiva nebo import již připraveného materiálu.',
      blocks: [
        { type: 'cards', columns: 4, items: [
          { icon: '✦', title: 'Vlastní učivo', text: 'Vložíte otázky a úkoly přímo v dílně.' },
          { icon: '↔', title: 'Import ze Studia', text: 'Převezmete krátkodobý anonymní handoff nebo soubor ghrab-material.' },
          { icon: '⚑', title: 'Třídní soutěž', text: 'Připravíte společnou aktivitu na projektor.' },
          { icon: '▤', title: 'Lesson pack', text: 'Spojíte hru s plánem hodiny a doprovodnými materiály.' }
        ]},
        { type: 'callout', tone: 'info', title: 'Import šetří další AI volání', text: 'Podporované strukturované úlohy lze převést do herních stanic bez opakovaného generování obsahu.' }
      ]
    },
    {
      id: 'mechanics',
      title: 'Mechanika a herní svět',
      kicker: 'VOLBA KONCEPTU · 15 MIN',
      duration: 15,
      summary: 'Ne každý herní svět je připraven k exportu. LUDUS pravdivě rozlišuje produkčně ověřené enginy, náhledy a plánované koncepty.',
      trainerNote: 'Ukažte štítky stavu a vysvětlete pole builderCompatible lidsky: „Tento svět umí vytvořit skutečně hratelný export.“',
      blocks: [
        { type: 'table', headers: ['Stav', 'Co znamená', 'Co smím udělat'], rows: [
          ['Ready / připraveno', 'Engine je ověřený a exportovatelný', 'Vytvořit a použít hru po vlastní kontrole'],
          ['Draft / rozpracováno', 'Koncept nebo engine se testuje', 'Prohlédnout, případně testovat podle označení'],
          ['Planned / plánováno', 'Zatím není hotový engine', 'Pouze inspirace; nevytvářet ostrou hodinu']
        ]},
        { type: 'checklist', title: 'Při volbě mechaniky zvažte', items: ['Kolik žáků bude aktivních současně.', 'Zda cílem je procvičení, spolupráce, rozhodování nebo opakování.', 'Kolik času zabere vysvětlení pravidel.', 'Jak bude učitel řešit chybu nebo přerušení.', 'Zda je engine označen jako exportovatelný.'] },
        { type: 'callout', tone: 'warning', title: 'Vizuální svět není zárukou funkčního exportu', text: 'Používejte pouze enginy, u kterých LUDUS výslovně uvádí, že jsou kompatibilní s dílnou a připravené k exportu.' }
      ]
    },
    {
      id: 'content',
      title: 'Obsah hry',
      kicker: 'ÚLOHY A STANICE · 15 MIN',
      duration: 15,
      summary: 'Obsah se převádí do strukturovaných úloh nebo stanic. Každá musí mít jasné zadání, správnou odpověď a vhodnou zpětnou vazbu.',
      trainerNote: 'Doporučte 8–12 kvalitních úloh. První hra nemá být rozsáhlá kampaň.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Vložte nebo importujte obsah', text: 'Použijte anonymizovaný podklad a ověřené otázky.' },
          { title: 'Rozdělte učivo do stanic', text: 'Každá stanice má jeden srozumitelný úkol.' },
          { title: 'Zkontrolujte typy odpovědí', text: 'Engine musí daný typ úlohy skutečně podporovat.' },
          { title: 'Přidejte smysluplnou zpětnou vazbu', text: 'Chyba má žáka posunout, ne pouze zastavit.' },
          { title: 'Ověřte pořadí a obtížnost', text: 'Hra má gradovat a přitom zůstat dokončitelná.' }
        ]},
        { type: 'activity', title: 'Navrhněte osm herních stanic', brief: 'Použijte jeden krátký tematický celek.', steps: ['Napište společný cíl.', 'Připravte šest základních a dvě rozšiřující stanice.', 'Ke každé určete správnou odpověď.', 'Doplňte krátkou zpětnou vazbu.'], output: 'Strukturovaný obsah připravený pro zvolený engine.' }
      ]
    },
    {
      id: 'teacher-mode',
      title: 'Učitelský režim a řízení hodiny',
      kicker: 'OVLÁDÁNÍ · 12 MIN',
      duration: 12,
      summary: 'Hotové enginy mají sjednocený učitelský vstup a záchranný dock. Učitel má mít možnost hru řídit, uložit stav nebo získat report.',
      trainerNote: 'Prakticky ukažte vstup do učitelského režimu. Tři rychlá ťuknutí do loga jsou užitečná hlavně na dotykovém zařízení.',
      blocks: [
        { type: 'cards', columns: 3, items: [
          { icon: '3×', title: 'Vstup učitele', text: 'Tři ťuknutí do loga během krátké doby nebo parametr ?teacher=1.' },
          { icon: '⏸', title: 'Záchranné ovládání', text: 'Pozastavení, návrat, reset nebo řešení nestandardní situace.' },
          { icon: '▤', title: 'Report', text: 'Základní přehled průběhu lze kopírovat nebo exportovat.' }
        ]},
        { type: 'checklist', title: 'Před hodinou si připravte', items: ['Ověřený vstup do učitelského režimu.', 'Záložní postup při výpadku projektoru nebo internetu.', 'Jasné rozdělení týmů a rolí.', 'Časový limit a okamžik ukončení.', 'Krátkou závěrečnou reflexi učiva.'] }
      ]
    },
    {
      id: 'test-export',
      title: 'Testování a export',
      kicker: 'PŘED NASAZENÍM · 15 MIN',
      duration: 15,
      summary: 'Hru je potřeba vyzkoušet jako žák i učitel. Ověřte kompatibilitu enginu, obsah, ukládání postupu a mobilní zobrazení.',
      trainerNote: 'Nechte účastníky hru skutečně rozehrát. Pouhé otevření úvodní obrazovky není test.',
      blocks: [
        { type: 'checklist', title: 'Funkční kontrola', items: ['Engine je označen jako exportovatelný.', 'Hra používá vložený obsah, ne demonstrační data.', 'Všechny stanice lze dokončit.', 'Funguje učitelský režim.', 'U podporovaného enginu funguje uložení a obnovení postupu.', 'Hra se správně zobrazuje na cílovém zařízení.'] },
        { type: 'steps', items: [
          { title: 'Vytvořte hratelný export', text: 'Použijte pouze podporovaný engine.' },
          { title: 'Otevřete HTML mimo LUDUS', text: 'Vyzkoušejte start, průběh a ukončení.' },
          { title: 'Nahrajte soubor na GitHub Pages', text: 'Použijte bezpečný název bez diakritiky.' },
          { title: 'Otestujte veřejný odkaz', text: 'Otevřete jej na druhém zařízení nebo v anonymním okně.' }
        ]},
        { type: 'quiz', question: 'Co uděláte, když je svět označen jako „pouze náhled“?', options: ['Použiji ho pro klasifikovanou aktivitu.', 'Vynutím export změnou názvu souboru.', 'Prohlédnu si jej, ale pro ostrou výuku zvolím exportovatelný engine.', 'Nahraji do něj API klíč.'], answer: 2, explanation: 'Stav a exportní způsobilost je potřeba respektovat; náhled nemusí vytvořit funkční hru.' }
      ]
    },
    {
      id: 'lesson',
      title: 'Výstup ze školení',
      kicker: 'SAMOSTATNÁ DÍLNA · 13 MIN',
      duration: 13,
      summary: 'Účastník připraví krátkou hru nebo třídní soutěž pro jednu konkrétní část hodiny.',
      trainerNote: 'Cílem je 10–15 minut hratelné výuky, nikoli celá vyučovací hodina založená jen na hře.',
      blocks: [
        { type: 'activity', title: 'Vytvořte mini-hru', brief: 'Připravte hratelnou aktivitu na 10–15 minut.', steps: ['Zapište vzdělávací cíl.', 'Vyberte mechaniku a ověřený engine.', 'Vložte 8–12 úloh.', 'Vyzkoušejte učitelský režim.', 'Odehrajte alespoň tři stanice.', 'Exportujte a otestujte veřejný odkaz.'], output: 'Krátká, funkční a pedagogicky zdůvodněná výuková hra.' }
      ]
    }
  ]
};
