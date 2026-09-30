const speaker = (say, ask, caution, transition) => ({
  say: Array.isArray(say) ? say : [say],
  explain: ['Vysvětli hlavní myšlenku slidu na konkrétním školním příkladu a drž se praktického dopadu pro učitele.'],
  ask: [ask],
  expected: ['Nech zaznít dvě až tři odpovědi a vrať diskusi k hlavnímu principu slidu.'],
  demo: ['Použij konkrétní příklad přímo ze slidu; technické detaily nech stranou, pokud se na ně nikdo nezeptá.'],
  facilitation: ['Mluv civilně a prakticky. Cílem není kolegy ohromit technologií, ale dát jim bezpečný a použitelný pracovní model.'],
  caution: [caution],
  transition: [transition],
  fallback: ['Když selže živá ukázka, pokračuj s připraveným příkladem na slidu. Smysl části musí být pochopitelný i bez internetu.'],
  shortcut: ['Řekni hlavní větu, polož jednu otázku a pokračuj dál.'],
  timing: 'Krátký výklad → otázka skupině → konkrétní příklad → přechod.'
});

export default {
  id: 'ai-literacy',
  order: 0,
  code: 'START-00',
  title: 'Vstupní školení: AI + AI Studio',
  shortTitle: 'Povinný základ',
  subtitle: 'Promptování, bezpečnost, učitelský úsudek a orientace v AI Studiu',
  category: 'Povinný základ',
  audience: 'Všichni kolegové před prvním používáním aplikací AI Studia',
  duration: 80,
  reserve: 5,
  level: 'Vstupní',
  required: true,
  status: 'Povinné před školením aplikací',
  accent: '#a877ff',
  icon: './assets/course-icons/ai-literacy.png',
  prerequisites: [],
  outcomes: [
    'Rozlišíte slabé a kvalitní zadání pro AI a umíte je prakticky zlepšit.',
    'Poznáte, která data do AI nástrojů neposílat a kdy je nutná anonymizace.',
    'Budete AI chápat jako pomocníka; konečné pedagogické rozhodnutí zůstává na učiteli.',
    'Vysvětlíte, proč mají vlastní aplikace AI Studia smysl a jak s nimi bezpečně pracovat.',
    'Zorientujete se v AI Studiu a víte, kam pokračovat po vstupním školení.'
  ],
  lessons: [
    {
      id: 'why-now',
      title: 'AI pomáhá. Učitel rozhoduje.',
      kicker: 'HLAVNÍ PRINCIP · 8 MIN',
      duration: 8,
      summary: 'AI může práci výrazně urychlit, ale nenese pedagogickou odpovědnost a nezná konkrétní třídu tak jako učitel.',
      trainerNote: 'Začni otázkou, co už kolegové AI svěřují. Pak ukaž hranici mezi návrhem a rozhodnutím.',
      speakerNotes: speaker(
        ['Začnu jednou větou, ke které se budeme vracet celé školení: AI pomáhá, učitel kontroluje a učitel rozhoduje.', 'Nechci, aby AI dělala práci za nás. Chci, aby nám ubrala rutinu a nechala více času na rozhodování, kde je lidská zkušenost nenahraditelná.'],
        'Které rozhodnutí ve své výuce byste AI bez vlastní kontroly nikdy nepřenechali?',
        'Nevytvářej dojem, že použití AI automaticky znamená kvalitnější výuku.',
        'Teď si ukážeme, proč může AI znít přesvědčivě i ve chvíli, kdy se mýlí.'
      ),
      blocks: [
        { type: 'statement', label: 'PRINCIP AI AKADEMIE', text: 'AI navrhne → učitel posoudí → učitel upraví → učitel rozhodne.', detail: 'Poslední slovo má vždy učitel.' },
        { type: 'comparison', left: { title: 'AI může', items: ['navrhnout aktivitu nebo test', 'přeformulovat text', 'nabídnout varianty', 'najít možné slabiny'] }, right: { title: 'Učitel musí', items: ['znát cíl hodiny', 'posoudit přiměřenost', 'ověřit správnost', 'rozhodnout o použití'] } },
        { type: 'callout', tone: 'success', title: 'Co má technologie odstranit', text: 'Rutinu a opakované mechanické kroky — ne učitelský úsudek, vztah se třídou a odpovědnost.' }
      ]
    },
    {
      id: 'what-it-is',
      title: 'Proč AI někdy přesvědčivě chybuje',
      kicker: 'MENTÁLNÍ MODEL · 8 MIN',
      duration: 8,
      summary: 'Plynulý jazyk není důkaz správnosti. AI výstup je návrh, který může obsahovat faktickou, metodickou i situační chybu.',
      trainerNote: 'Nevysvětluj neuronové sítě. Stačí praktický důsledek: jistý tón není záruka pravdy.',
      speakerNotes: speaker(
        ['AI umí napsat velmi jistou odpověď i ve chvíli, kdy si něco domyslela. Proto ji nebereme jako autoritu.', 'U faktů, řešení úloh nebo hodnocení potřebuji vlastní odbornou kontrolu nebo nezávislý zdroj.'],
        'Který typ chyby by byl ve vašem předmětu nejhorší: faktická, metodická, nebo špatně zvolená obtížnost?',
        'Neříkej, že AI vždy halucinuje; vysvětli, že chyba je možné a prakticky významné riziko.',
        'Kvalita výstupu ale nezačíná až kontrolou — začíná už dobrým zadáním.'
      ),
      blocks: [
        { type: 'cards', columns: 3, items: [
          { icon: '1', title: 'Faktická chyba', text: 'Vymyšlený údaj, zdroj nebo nepřesná odpověď.' },
          { icon: '2', title: 'Pedagogická chyba', text: 'Materiál je správný, ale nevhodný pro tuto skupinu nebo cíl.' },
          { icon: '3', title: 'Kontextová chyba', text: 'AI neví, co jste skutečně probrali a co vaše třída zvládne.' }
        ]},
        { type: 'quote', text: 'Přesvědčivě napsané neznamená správné.' },
        { type: 'callout', tone: 'warning', title: 'Kontrola stejnou AI není nezávislá kontrola', text: 'Když je správnost důležitá, ověřte ji vlastní odborností, pravidlem, rubrikou nebo kvalitním zdrojem.' }
      ]
    },
    {
      id: 'good-task',
      title: 'Od špatného promptu k použitelnému zadání',
      kicker: 'PROMPTOVÁNÍ · 12 MIN',
      duration: 12,
      summary: 'Dobrý prompt dává AI cíl, kontext, cílovou skupinu, omezení a podobu výsledku. První odpověď není povinně konečná.',
      trainerNote: 'Ukaž kontrast dvou promptů a nech kolegy sami pojmenovat, co v lepší verzi přibylo.',
      speakerNotes: speaker(
        ['Když napíšu jen „udělej mi test“, dostanu obecný test. AI nemůže vědět, pro koho, z čeho a proč ho potřebuji.', 'Dobrý prompt nemusí být román. Potřebuje ale jasný cíl, kontext, omezení a očekávaný výstup.'],
        'Co byste doplnili k promptu „Udělej mi pracovní list“, aby byl výsledek použitelný ve vaší třídě?',
        'Nevytvářej dojem, že existuje jeden magický univerzální prompt.',
        'Stejně důležité jako zadání je umět výstup dál řídit a opravovat.'
      ),
      blocks: [
        { type: 'showcase', label: 'ŠPATNÝ → LEPŠÍ PROMPT', title: 'Konkrétnost šetří následné opravy', text: 'Stejný nástroj, jiná kvalita vstupu.', before: { label: 'SLABÉ', title: '„Udělej mi test z angličtiny.“', items: ['bez ročníku', 'bez cíle', 'bez rozsahu'] }, after: { label: 'POUŽITELNÉ', title: '„Vytvoř 10min test pro 1. ročník…“', items: ['téma a úroveň', 'co bylo probráno', 'typy úloh a výstup'] }, caption: 'Nejde o délku promptu, ale o užitečný kontext.' },
        { type: 'flow', items: [
          { number: '01', title: 'Cíl', text: 'Co má vzniknout a proč?' },
          { number: '02', title: 'Kontext', text: 'Pro koho, z čeho a v jaké situaci?' },
          { number: '03', title: 'Omezení', text: 'Co zachovat, vynechat nebo nepřekročit?' },
          { number: '04', title: 'Výstup', text: 'Jak má výsledek vypadat?' }
        ]},
        { type: 'activity', title: 'Vylepšete jeden vlastní prompt', text: 'Ve dvojici vezměte běžné zadání a doplňte mu cíl, kontext, omezení a požadovaný výstup.', steps: ['Napište původní krátký prompt.', 'Doplňte čtyři chybějící vrstvy.', 'Porovnejte, co by se díky tomu změnilo.'], footer: 'Cíl: použitelný prompt, ne „dokonalá formule“. ' }
      ]
    },
    {
      id: 'material-workflow',
      title: 'Bezpečný pracovní postup s AI',
      kicker: 'WORKFLOW · 10 MIN',
      duration: 10,
      summary: 'Nejbezpečnější rutina je: připravit podklad, odstranit citlivá data, zadat úkol, zkontrolovat výsledek a teprve potom jej použít.',
      trainerNote: 'Propoj promptování s bezpečností. Ukaž, že anonymizace má proběhnout ještě před odesláním vstupu.',
      speakerNotes: speaker(
        ['Největší bezpečnostní chyba vzniká často dřív, než AI vůbec odpoví — už tím, co do ní pošleme.', 'Proto používám jednoduchý postup: nejdřív očistit vstup, potom generovat a nakonec výsledek kontrolovat.'],
        'Ve kterém kroku tohoto postupu podle vás nejčastěji spěcháme?',
        'Anonymizace není jen odstranění jména; kombinace detailů může člověka stále identifikovat.',
        'Teď oddělíme běžná data od informací, které do AI nástroje posílat nemáme.'
      ),
      blocks: [
        { type: 'flow', items: [
          { number: '01', title: 'Připrav', text: 'Vyber jen podklady potřebné pro úkol.' },
          { number: '02', title: 'Očisti', text: 'Odstraň osobní, citlivé a zbytečné identifikátory.' },
          { number: '03', title: 'Zadej', text: 'Popiš cíl, kontext a očekávaný výstup.' },
          { number: '04', title: 'Zkontroluj', text: 'Ověř fakta, přiměřenost a úplnost.' },
          { number: '05', title: 'Rozhodni', text: 'Teprve učitel rozhodne, zda výstup použije.' }
        ]},
        { type: 'callout', tone: 'danger', title: 'Do ukázek nepoužívejme skutečné citlivé případy', text: 'Pro školení a experimentování používejte modelové, fiktivní nebo důsledně anonymizované podklady.' }
      ]
    },
    {
      id: 'verification',
      title: 'Konečné pedagogické rozhodnutí je na učiteli',
      kicker: 'LIDSKÁ KONTROLA · 10 MIN',
      duration: 10,
      summary: 'AI neumí převzít znalost konkrétní třídy, odpovědnost za hodnocení ani úsudek, zda je výstup vhodný právě teď.',
      trainerNote: 'Tahle část je klíčová. Nech kolegy rozhodovat nad dvěma modelovými výstupy, ne pouze poslouchat.',
      speakerNotes: speaker(
        ['Tady se dostáváme k nejdůležitější roli učitele. AI může připravit návrh, ale neví, co konkrétní třída právě potřebuje.', 'Já musím rozhodnout, zda materiál odpovídá cíli, jestli je férový a zda za něj chci nést odpovědnost.'],
        'Použili byste výstup AI ve své třídě beze změny? Co byste předem zkontrolovali?',
        'Nesnižuj lidskou kontrolu na pravopis. Jde o správnost, didaktiku, férovost, bezpečnost i kontext.',
        'Tento princip je zabudovaný i do vlastních aplikací AI Studia.'
      ),
      blocks: [
        { type: 'decision', label: 'ROZHODNUTÍ UČITELE', question: 'Co musí být pravda, než AI výstup použiji ve výuce?', options: [
          { title: 'Je správný', text: 'Fakta, řešení, klíč a zadání dávají smysl.' },
          { title: 'Je vhodný', text: 'Odpovídá cíli, skupině, času a tomu, co bylo skutečně probráno.' },
          { title: 'Je bezpečný', text: 'Neobsahuje citlivá data ani nevhodné instrukce.' },
          { title: 'Jsem ochoten se pod něj podepsat', text: 'Konečné použití je moje profesní rozhodnutí.' }
        ]},
        { type: 'statement', label: 'TŘI KROKY', text: 'AI pomáhá → učitel kontroluje → učitel rozhoduje.', detail: 'Tento princip platí v každé aplikaci Akademie.' }
      ]
    },
    {
      id: 'students',
      title: 'Bezpečnost dat v praxi',
      kicker: 'BEZPEČNOST · 10 MIN',
      duration: 10,
      summary: 'Před odesláním vstupu se ptejte, zda lze z údajů poznat konkrétního žáka, rodiče nebo kolegu a zda jsou tyto údaje vůbec nutné.',
      trainerNote: 'Použij rychlé ANO / NE / ZÁLEŽÍ scénáře. Cílem je návyk, ne právní přednáška.',
      speakerNotes: speaker(
        ['Bezpečnost si nemusíme pamatovat jako sto paragrafů. Pomůže jedna otázka: potřebuje AI opravdu vědět, o koho jde?', 'Pokud konkrétní identita není pro úkol nutná, do vstupu ji neposílám.'],
        'Můžu do AI vložit e-mail rodiče se jménem žáka, třídou a zdravotní informací?',
        'Neformuluj AI Studio jako prostředí, kam lze bez omezení posílat citlivá data.',
        'Právě tady dává smysl vysvětlit, proč máme vlastní specializované aplikace.'
      ),
      blocks: [
        { type: 'quiz', question: 'Co je bezpečnější výchozí postup?', options: ['Vložit celý dokument a potom citlivá místa smazat z odpovědi.', 'Před odesláním odstranit zbytečné identifikátory a použít jen nezbytný obsah.', 'Citlivé údaje nevadí, když jde o školní účel.'], correct: 1, feedback: 'Citlivé a identifikující údaje odstraňujeme ještě před odesláním vstupu.' },
        { type: 'cards', columns: 2, items: [
          { icon: '✓', title: 'Modelový příklad', text: 'Fiktivní jména, obecná situace, žádné jedinečné okolnosti.' },
          { icon: '!', title: 'Rizikový vstup', text: 'Jméno + třída + diagnóza + konkrétní rodinná nebo kázeňská situace.' }
        ]},
        { type: 'callout', tone: 'warning', title: 'AI Studio je kontrolovanější prostředí, ne výjimka z pravidel', text: 'Vlastní aplikace mohou omezit některá rizika a vést uživatele bezpečnějším workflow. Pravidla pro osobní a citlivé údaje tím ale nezanikají.' }
      ]
    },
    {
      id: 'responsibility',
      title: 'Proč vlastní aplikace AI Studia',
      kicker: 'AI STUDIO · 9 MIN',
      duration: 9,
      summary: 'AI Studio převádí opakované školní úkoly do připravených pracovních postupů. Uživatel nemusí pokaždé začínat v prázdném chatbotu.',
      trainerNote: 'Ukazuj přínos z pohledu kolegy: méně nastavování, jasnější kroky, kontroly a vhodný výstup.',
      speakerNotes: speaker(
        ['AI Studio není jeden chatbot. Je to rozcestník specializovaných nástrojů pro konkrétní školní situace.', 'Smyslem je, že aplikace už zná pracovní postup a připomíná kontroly, které bych jinak musel pokaždé formulovat v promptu.'],
        'Kdy byste raději použili specializovanou aplikaci než prázdné okno obecného chatbota?',
        'Nevydávej aplikace za absolutně bezpečné nebo bezchybné; pořád vyžadují lidskou kontrolu.',
        'Nakonec se podíváme, jak se ve Studiu zorientovat a kam pokračovat.'
      ),
      blocks: [
        { type: 'comparison', left: { title: 'Obecný chatbot', items: ['začínám prázdným promptem', 'sám hlídám celý postup', 'výstup může mít různou strukturu', 'kontroly si musím vyžádat'] }, right: { title: 'Aplikace AI Studia', items: ['připravený pracovní postup', 'jasně vymezený účel', 'kontrolované vstupy a výstupy', 'upozornění na riziková místa'] } },
        { type: 'flow', items: [
          { number: '01', title: 'Studio', text: 'Jeden vstup do školního ekosystému.' },
          { number: '02', title: 'Aplikace', text: 'Vyberu nástroj podle konkrétní práce.' },
          { number: '03', title: 'Workflow', text: 'Aplikace mě provede potřebnými kroky.' },
          { number: '04', title: 'Učitel', text: 'Výsledek zkontroluje a rozhodne o použití.' }
        ]}
      ]
    },
    {
      id: 'takeaway',
      title: 'Jak se v AI Studiu orientovat',
      kicker: 'PRAKTICKÝ START · 8 MIN',
      duration: 8,
      summary: 'Po vstupním školení kolega zná společná pravidla. Další školení už jsou zaměřena na konkrétní aplikace a jejich praktické workflow.',
      trainerNote: 'Ukaž hlavní rozcestník Studia, karty aplikací a logiku dalšího školení. Nepředváděj teď detailně každou aplikaci.',
      speakerNotes: speaker(
        ['Od této chvíle už nemusíme znovu vysvětlovat základní bezpečnost a práci s AI u každé aplikace od nuly.', 'Každé další školení bude praktické: co nástroj řeší, jak vypadá workflow, co musí učitel zkontrolovat a co si účastník odnese v handoutu.'],
        'Kterou konkrétní aplikaci byste chtěli po vstupním školení využít jako první?',
        'Neslibuj automatické zpřístupnění konkrétní aplikace, pokud ještě není nastaven finální serverový model evidence školení.',
        'Uzavři školení třemi větami: AI pomáhá. Učitel kontroluje. Učitel rozhoduje.'
      ),
      blocks: [
        { type: 'cards', columns: 3, items: [
          { icon: '1', title: 'Otevřu Studio', text: 'Vidím dostupné aplikace a jejich stručný účel.' },
          { icon: '2', title: 'Absolvuji školení aplikace', text: 'Naučím se konkrétní workflow na reálném příkladu.' },
          { icon: '3', title: 'Odnesu si handout', text: 'Po školení mám stručný návod bez interních poznámek lektora.' }
        ]},
        { type: 'statement', label: 'ZAPAMATUJTE SI', text: 'AI pomáhá. Učitel kontroluje. Učitel rozhoduje.', detail: 'Aplikace šetří rutinu — profesní úsudek zůstává člověku.' },
        { type: 'mission', label: 'ZÁVĚREČNÁ MISE', title: 'Vyberte první bezpečný úkol', brief: 'Pojmenujte jednu konkrétní činnost, kde chcete AI nebo některou aplikaci Studia vyzkoušet, a jeden kontrolní krok, který před použitím provedete.', time: '3 MIN', output: 'Konkrétní úkol + konkrétní kontrola.' }
      ]
    }
  ]
};
