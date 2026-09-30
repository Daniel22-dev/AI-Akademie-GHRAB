const notes = (title, ask, warning, transition) => ({
  say: [
    `Tuhle část berte prakticky: ${title}`,
    'Nejde o prohlídku všech tlačítek. Potřebujeme pochopit, kdy nástroj použít, jak vypadá pracovní postup a co musí na konci zkontrolovat učitel.'
  ],
  explain: ['Drž se hlavní myšlenky slidu a ukaž konkrétní školní použití.'],
  ask: [ask],
  expected: ['Nech zaznít krátké příklady z různých předmětů a vrať diskusi k cíli aplikace.'],
  demo: ['Pokud je aplikace dostupná, ukaž jeden skutečný průchod. Když ne, použij připravený modelový příklad na slidu.'],
  facilitation: ['Po ukázce dej účastníkům krátký prostor převést postup na vlastní výuku.'],
  caution: [warning],
  transition: [transition],
  fallback: ['Bez aplikace pokračuj se slidem a popiš očekávaný vstup, rozhodovací bod a výstup.'],
  shortcut: ['Ukaž jeden vstup, jeden klíčový krok a jednu učitelskou kontrolu.'],
  timing: 'Krátké vysvětlení → ukázka → vlastní rozhodnutí účastníků → shrnutí.'
});

export const activa = {
  id: 'activa', order: 9, code: 'ACT-01', title: 'ACTIVA', shortTitle: 'ACTIVA',
  subtitle: 'Pracovní listy, výukové aktivity a projekční režim bez zbytečného skládání od nuly',
  category: 'Aplikace', audience: 'Učitelé všech předmětů', duration: 60, reserve: 5, level: 'Základní',
  required: false, status: 'Připraveno', accent: '#3157FF', icon: './assets/course-icons/activa.svg', prerequisites: ['ai-literacy'],
  outcomes: ['Vyberete vhodný typ aktivity podle cíle hodiny.', 'Vytvoříte pracovní list nebo interaktivní aktivitu včetně variant a řešení.', 'Použijete projekční režim nebo export do PDF/HTML.', 'Před použitím zkontrolujete obsah, obtížnost a organizační proveditelnost.'],
  lessons: [
    { id:'purpose', title:'Nejdřív cíl, potom typ aktivity', kicker:'ROZHODNUTÍ · 8 MIN', duration:8, summary:'ACTIVA nabízí desítky typů aktivit, ale výběr začíná výukovým cílem, ne efektností formátu.', trainerNote:'Ukaž tři rozdílné cíle a nech účastníky vybrat vhodný typ aktivity.', speakerNotes:notes('Nejdřív cíl, potom typ aktivity.','Který typ aktivity používáte často a co u něj chcete žáky skutečně naučit?','Neslibuj, že každý typ aktivity je vhodný pro každý cíl.','Teď projdeme jednoduchý pracovní postup od zadání k výsledku.'), blocks:[
      {type:'showcase',label:'OD CÍLE K FORMĚ',title:'Stejný obsah může mít různé podoby',text:'Formu vybíráme podle toho, co má žák dělat.',before:{label:'SLABÝ POSTUP',title:'„Chci něco zajímavého.“',items:['formát před cílem','riziko samoúčelnosti','obtížná kontrola výsledku']},after:{label:'LEPŠÍ POSTUP',title:'Cíl → aktivita → kontrola',items:['jasná dovednost','vhodný typ práce','ověřitelný výstup']},caption:'ACTIVA je nástroj pro tvorbu, ne náhrada didaktického rozhodnutí.'},
      {type:'cards',columns:3,items:[{icon:'P',title:'Pracovní list',text:'Tisknutelná aktivita s řešením a variantami.'},{icon:'T',title:'Týmová práce',text:'Stanoviště, role, debata, případová studie nebo hra.'},{icon:'↗',title:'Projekce',text:'Aktivity vedené učitelem přímo na plátně.'}]}
    ]},
    { id:'workflow', title:'Od zadání k hotové aktivitě', kicker:'WORKFLOW · 12 MIN', duration:12, summary:'Základní postup je vybrat aktivitu, doplnit obsah a parametry, vygenerovat návrh a potom jej upravit.', trainerNote:'Předveď jeden běžný typ aktivity od prázdného zadání po náhled.', speakerNotes:notes('Zadání musí být dost konkrétní, aby aktivita seděla na hodinu.','Co byste do zadání doplnili, aby vznikl materiál použitelný bez dalších velkých oprav?','Nepoužívej skutečné citlivé údaje žáků v demonstračním vstupu.','Po vygenerování přichází nejdůležitější krok: učitelská kontrola.'), blocks:[
      {type:'flow',items:[{number:'01',title:'Vyber formu',text:'Pracovní list, skupinová aktivita, hra nebo projekce.'},{number:'02',title:'Dodej kontext',text:'Předmět, skupina, cíl, čas a obsah.'},{number:'03',title:'Vygeneruj',text:'Nech aplikaci připravit první návrh.'},{number:'04',title:'Uprav',text:'Přizpůsob instrukce, rozsah a obtížnost.'},{number:'05',title:'Ověř',text:'Zkontroluj řešení, tisk a průběh ve třídě.'}]},
      {type:'callout',tone:'success',title:'Silná stránka ACTIVA',text:'Jeden nástroj pokrývá pracovní listy, týmové aktivity, varianty i projekční použití.'}
    ]},
    { id:'outputs', title:'PDF, interaktivní HTML a projekce', kicker:'VÝSTUP · 10 MIN', duration:10, summary:'Výstup se volí podle reálné situace: tisk, samostatný interaktivní soubor nebo učitelem řízená projekce.', trainerNote:'Ukaž rozdíl mezi exportem k tisku a projekčním použitím.', speakerNotes:notes('Výstup má odpovídat tomu, jak bude aktivita ve třídě skutečně probíhat.','Kdy byste zvolili papír a kdy projekci nebo samostatné HTML?','Před sdílením HTML vždy zkontroluj, co soubor skutečně obsahuje.','Poslední část bude o kontrole kvality před hodinou.'), blocks:[
      {type:'comparison',left:{title:'Tisk / PDF',items:['pracovní listy','řešení pro učitele','varianty A/B/C','offline použití']},right:{title:'Projekce / HTML',items:['učitelem vedená interakce','časovač a týmové prvky','aktivita bez telefonů','sdílení samostatného souboru']}},
      {type:'callout',tone:'warning',title:'Výstup není hotový jen proto, že se otevře',text:'Před hodinou zkontrolujte čitelnost, instrukce, správnost řešení a časovou náročnost.'}
    ]},
    { id:'review', title:'Učitel drží kvalitu pod kontrolou', kicker:'KONTROLA · 12 MIN', duration:12, summary:'ACTIVA urychluje tvorbu, ale učitel rozhoduje o cíli, obtížnosti, správnosti a tom, zda je aktivita pro konkrétní třídu vhodná.', trainerNote:'Nech účastníky projít krátký checklist před použitím.', speakerNotes:notes('Hotový materiál je návrh k převzetí, ne automatická garance kvality.','Které tři věci byste před hodinou zkontrolovali vždy?','Neomezuj kontrolu jen na pravopis; zahrň cíl, řešení, bezpečnost a organizaci.','Uzavřeme školení konkrétním plánem prvního použití.'), blocks:[
      {type:'checklist',title:'Před použitím',items:['Cíl aktivity je jasný a odpovídá hodině.','Instrukce jsou srozumitelné bez dalšího vysvětlování.','Řešení a fakta jsou správně.','Rozsah se vejde do času.','Výstup neobsahuje citlivé nebo zbytečně identifikující údaje.']},
      {type:'statement',label:'PRINCIP',text:'ACTIVA připraví možnosti. Učitel vybírá, upravuje a rozhoduje.',detail:'Stejný princip platí v celé AI Akademii.'}
    ]},
    { id:'practice', title:'První vlastní aktivita', kicker:'PŘENOS DO PRAXE · 13 MIN', duration:13, summary:'Účastník si vybere konkrétní hodinu a naplánuje jeden použitelný výstup.', trainerNote:'Nech každého určit skutečnou skupinu, čas a způsob použití.', speakerNotes:notes('Na konci nechci obecný nápad. Chci konkrétní aktivitu pro konkrétní hodinu.','Co přesně vytvoříte a jak poznáte, že výsledek můžete použít?','Nevytvářej tlak na okamžité nasazení bez kontroly.','Po školení si účastník odnese handout s tímto workflow.'), blocks:[
      {type:'mission',label:'PRVNÍ NASAZENÍ',title:'Naplánujte jednu aktivitu do skutečné hodiny',brief:'Zvolte třídu, cíl, typ aktivity, výstup a kontrolu před použitím.',time:'8 MIN',output:'Konkrétní plán prvního použití ACTIVA.'}
    ]}
  ]
};

export const sortio = {
  id:'sortio', order:10, code:'SOR-01', title:'SORTIO – Výukový panel', shortTitle:'SORTIO',
  subtitle:'Skupiny, role, zasedací pořádek, časovače a nástroje pro živou organizaci hodiny',
  category:'Aplikace', audience:'Učitelé všech předmětů', duration:55, reserve:5, level:'Základní', required:false, status:'Připraveno',
  accent:'#5EE7FF', icon:'./assets/course-icons/sortio.svg', prerequisites:['ai-literacy'],
  outcomes:['Vytvoříte a znovu použijete vlastní skupinu žáků bez ukládání e-mailových adres.', 'Losujete a tvoříte skupiny s pravidly, historií a rolemi.', 'Použijete zasedací pořádek, časovač, tabuli a skóre v bezpečném projekčním režimu.', 'Rozlišíte, která data zůstávají lokálně a co se případně načítá externě.'],
  lessons:[
    {id:'roster',title:'Jedna skupina, mnoho nástrojů',kicker:'ZÁKLAD · 9 MIN',duration:9,summary:'SORTIO staví živou organizaci hodiny nad místním seznamem skupiny a neukládá e-mailové adresy studentů.',trainerNote:'Ukaž import jmen a následné použití stejné skupiny v losování i skupinách.',speakerNotes:notes('Začneme skupinou, protože z ní potom čerpají ostatní nástroje.','Které informace o žácích skutečně potřebujete pro losování a tvorbu skupin?','Nevkládej do ukázky zbytečné osobní údaje; SORTIO nepotřebuje e-mailové adresy pro běžné použití.','Teď stejnou skupinu použijeme pro férové losování a tvorbu týmů.'),blocks:[
      {type:'flow',items:[{number:'01',title:'Skupina',text:'Jména žáků a volitelné organizační údaje.'},{number:'02',title:'Docházka',text:'Pro dnešní hodinu vyřadím nepřítomné.'},{number:'03',title:'Nástroj',text:'Losování, skupiny, role, sezení nebo panel.'},{number:'04',title:'Výsledek',text:'Použiji ho přímo v živé hodině.'}]},
      {type:'callout',tone:'success',title:'Local-first',text:'Běžná data skupiny zůstávají v prohlížeči zařízení; aplikace je navržena pro práci bez odesílání studentských e-mailů.'}
    ]},
    {id:'groups',title:'Losování a skupiny s pravidly',kicker:'ORGANIZACE · 12 MIN',duration:12,summary:'SORTIO umí opakovaně losovat, tvořit vyvážené nebo homogenní skupiny, respektovat pravidla spolu/odděleně a držet vybrané skupiny.',trainerNote:'Předveď jednoduché losování a potom jeden smysluplný constraint.',speakerNotes:notes('Náhodnost sama o sobě není vždy spravedlnost. SORTIO umí zapojit historii a pravidla.','Kdy je pro vás lepší čistý los a kdy vyvážené skupiny?','Pravidla pro úroveň nebo spolupráci používej jako pedagogický nástroj, ne jako nálepku žáků.','Ze skupin přejdeme k rolím, sezení a živému panelu.'),blocks:[
      {type:'cards',columns:3,items:[{icon:'↻',title:'Férové losování',text:'Historie omezuje opakované vybírání stejných lidí.'},{icon:'≋',title:'Skupiny',text:'Vyvážené, homogenní nebo náhodné varianty.'},{icon:'⌁',title:'Pravidla',text:'Spolu, odděleně, připnutí skupiny nebo role.'}]},
      {type:'callout',tone:'warning',title:'Učitel zná vztahy ve třídě',text:'Algoritmus může respektovat zadaná pravidla, ale nezná sociální kontext tak jako učitel. Finální sestavu vždy posoudí člověk.'}
    ]},
    {id:'board',title:'Výukový panel na plátně',kicker:'PROJEKCE · 10 MIN',duration:10,summary:'Časovač, hodiny, semafor, tabule, kostky, skóre, agenda a další widgety lze použít v bezpečném projekčním režimu.',trainerNote:'Otevři jen dva nebo tři widgety; cílem není katalog všech funkcí.',speakerNotes:notes('Panel má během hodiny zmizet do pozadí a šetřit přepínání mezi nástroji.','Které dva widgety by vám během běžné hodiny nahradily samostatnou aplikaci nebo web?','Při projekci hlídej, aby se na plátně neobjevily informace, které žáci vidět nemají.','Před závěrem se podíváme na data a bezpečnost.'),blocks:[
      {type:'cards',columns:3,items:[{icon:'T',title:'Čas',text:'Vizuální časovač, stopky a hodiny.'},{icon:'▣',title:'Třída',text:'Semafor, agenda, režim práce a skóre.'},{icon:'✎',title:'Interakce',text:'Tabule, kostky, rozhodovací nástroje a obrázky.'}]},
      {type:'callout',tone:'success',title:'Safe projection mode',text:'Pro projekci používejte režim určený pro plátno, aby se neukazovaly interní ovládací a osobní údaje.'}
    ]},
    {id:'privacy',title:'Co zůstává lokálně a co jde ven',kicker:'SOUKROMÍ · 9 MIN',duration:9,summary:'Běžná práce se skupinami je lokální. Externí požadavek vzniká například při hledání veřejných obrázků na Wikimedia Commons; budoucí živé ankety mají být anonymní a krátkodobé.',trainerNote:'Vysvětli hranici lokálního uložení a externích zdrojů bez technických detailů.',speakerNotes:notes('U SORTIO je dobré vědět, co zůstává v zařízení a kdy se naopak kontaktuje veřejný zdroj.','Které informace byste vůbec nepotřebovali ukládat, i kdyby to aplikace technicky umožňovala?','Nezaměň local-first za automatickou anonymitu; jména studentů jsou pořád osobní údaj na konkrétním zařízení.','Uzavřeme tím, co před živou hodinou ověřit.'),blocks:[
      {type:'comparison',left:{title:'Lokálně',items:['seznamy skupin','historie losování','pravidla skupin','zasedací pořádek']},right:{title:'Externě jen podle funkce',items:['hledání veřejných obrázků','případná budoucí anonymní živá anketa','žádný běžný přenos studentských e-mailů']}},
      {type:'callout',tone:'warning',title:'Lokální data jsou stále data',text:'Na sdíleném zařízení po práci používejte připravené ukončení relace / mazání podle provozních pravidel Studia.'}
    ]},
    {id:'practice',title:'Nastavte si panel pro jednu hodinu',kicker:'PŘENOS · 10 MIN',duration:10,summary:'Účastník sestaví konkrétní kombinaci skupiny a dvou nástrojů pro reálnou vyučovací hodinu.',trainerNote:'Nenech plán sklouznout ke katalogu funkcí; stačí jedna reálná situace.',speakerNotes:notes('Na závěr stačí jednoduchý plán pro jednu skutečnou hodinu.','Jakou skupinu otevřete a které dva nástroje použijete jako první?','Nepřidávej nástroje bez jasného přínosu pro organizaci hodiny.','Po školení bude workflow shrnuto v handoutu.'),blocks:[
      {type:'mission',label:'PRVNÍ HODINA',title:'Vyberte skupinu a dva nástroje',brief:'Naplánujte konkrétní hodinu, kde SORTIO nahradí dva organizační kroky, které dnes děláte ručně.',time:'6 MIN',output:'Skupina + dva nástroje + pravidlo bezpečné projekce.'}
    ]}
  ]
};

export const lessonHub = {
  id:'lesson-hub', order:11, code:'LH-01', title:'Lesson Hub', shortTitle:'Lesson Hub',
  subtitle:'Osobní pracovní prostor učitele pro kontinuitu výuky, přípravy, záznamy a zastupování',
  category:'Aplikace', audience:'Učitelé všech předmětů', duration:60, reserve:5, level:'Základní', required:false, status:'Připraveno',
  accent:'#167F79', icon:'./assets/course-icons/lesson-hub.svg', prerequisites:['ai-literacy'],
  outcomes:['Založíte školní rok, předměty a skupiny tak, aby se dala dlouhodobě sledovat kontinuita výuky.', 'Naplánujete hodinu, po výuce doplníte stručný záznam a úkoly.', 'Použijete materiály, šablony, cykly a globální vyhledávání.', 'Připravíte podklady pro zastupování a rozlišíte lokální a budoucí serverové workflow.'],
  lessons:[
    {id:'continuity',title:'Lesson Hub jako učitelská paměť',kicker:'SMYSL · 9 MIN',duration:9,summary:'Aplikace propojuje plánování, skutečný průběh hodiny, úkoly, materiály a další kroky tak, aby se neztrácela kontinuita mezi hodinami.',trainerNote:'Začni konkrétním problémem: „Co jsme přesně dělali s 2.A minulou středu?“',speakerNotes:notes('Lesson Hub není další kalendář. Je to místo, kde se potkává plán, skutečnost a další krok.','Co dnes používáte, když si potřebujete rychle připomenout, kde jste se skupinou skončili?','Neslibuj automatickou školní synchronizaci před reálným připojením serveru.','Teď si projdeme základní cyklus jedné hodiny.'),blocks:[
      {type:'showcase',label:'KONTINUITA',title:'Před hodinou → během týdne → další hodina',text:'Jedno místo místo roztroušených poznámek.',before:{label:'ROZTŘÍŠTĚNĚ',title:'Kalendář + papír + soubory + hlava',items:['plán na jednom místě','záznam jinde','úkol se snadno ztratí']},after:{label:'LESSON HUB',title:'Skupina drží celý kontext',items:['příprava hodiny','záznam a reflexe','materiály a další krok']},caption:'Cílem je kontinuita, ne administrativní evidence pro vedení.'},
      {type:'callout',tone:'success',title:'Osobní pracovní prostor',text:'Lesson Hub je primárně nástroj učitele pro vlastní práci a kontinuitu výuky.'}
    ]},
    {id:'cycle',title:'Cyklus jedné vyučovací hodiny',kicker:'WORKFLOW · 12 MIN',duration:12,summary:'Před hodinou vznikne plán, po hodině krátký záznam skutečnosti, reflexe a případný další úkol.',trainerNote:'Ukaž jeden předmět a jednu skupinu; neprocházej nastavení celé aplikace.',speakerNotes:notes('Největší hodnotu má jednoduchý návyk po hodině: dvě věty o tom, co se skutečně stalo.','Co je nejmenší záznam, který by vám příští týden opravdu pomohl?','Nedělej z Lesson Hubu povinnou administrativu; záznam má být krátký a užitečný učiteli.','Pak uvidíme, jak se opakovaná práce zrychlí pomocí šablon a materiálů.'),blocks:[
      {type:'flow',items:[{number:'01',title:'Naplánuj',text:'Cíl, obsah, materiál a poznámka k hodině.'},{number:'02',title:'Oduč',text:'Během hodiny nemusíš aplikaci obsluhovat.'},{number:'03',title:'Zapiš',text:'Co proběhlo, kam jste se dostali a co změnit.'},{number:'04',title:'Navazuj',text:'Další příprava vychází z reálného stavu skupiny.'}]},
      {type:'callout',tone:'info',title:'Krátce je lépe než dokonale',text:'Záznam má pomoci budoucímu já. Nemusí být protokol.'}
    ]},
    {id:'materials',title:'Materiály, šablony a výukové cykly',kicker:'ZRYCHLENÍ · 10 MIN',duration:10,summary:'Opakované typy hodin, materiály a výukové cykly lze znovu používat místo kopírování z minulých příprav.',trainerNote:'Ukaž jeden znovupoužitelný materiál a jednu šablonu.',speakerNotes:notes('Tady aplikace začne vracet čas: věci, které se opakují, nemusím znovu skládat.','Který typ hodiny nebo materiálu u vás vzniká znovu a znovu?','Při opakovaném použití vždy ověř, že starý materiál stále odpovídá aktuální skupině.','Teď se podíváme na zastupování a praktickou kontinuitu při absenci.'),blocks:[
      {type:'cards',columns:3,items:[{icon:'M',title:'Materiály',text:'Uložené podklady navázané na výuku.'},{icon:'Š',title:'Šablony',text:'Opakovatelná struktura hodiny.'},{icon:'C',title:'Cykly',text:'Více hodin spojených do delšího postupu.'}]},
      {type:'callout',tone:'warning',title:'Znovupoužití není automatické převzetí',text:'Starý materiál vždy zkontrolujte proti aktuálnímu cíli, skupině a časovým podmínkám.'}
    ]},
    {id:'substitution',title:'Zastupování bez lovení informací',kicker:'KONTINUITA · 10 MIN',duration:10,summary:'Připravený záznam skupiny může pomoci vytvořit stručné a použitelné podklady pro kolegu, který hodinu zastupuje.',trainerNote:'Použij modelový případ absence; ne skutečné citlivé informace o studentech.',speakerNotes:notes('Když výuka stojí na informacích jen v hlavě jednoho člověka, zastupování je zbytečně těžké.','Co by kolega potřeboval vědět, aby vaši hodinu dokázal smysluplně zastoupit?','Do podkladů pro zastupování nedávej zbytečné osobní poznámky o studentech.','Poslední část bude o hranici lokálního provozu a budoucího serveru.'),blocks:[
      {type:'comparison',left:{title:'Bez kontinuity',items:['hledání poslední přípravy','nejasné, kde skupina skončila','materiály roztroušené']},right:{title:'S Lesson Hubem',items:['poslední záznam skupiny','připravený plán / materiál','jasný další krok']}},
      {type:'callout',tone:'warning',title:'Sdílej jen to, co kolega opravdu potřebuje',text:'Soukromé učitelské poznámky a zbytečné osobní údaje nepatří do podkladů pro zastupování.'}
    ]},
    {id:'practice',title:'Nastavte jeden reálný pracovní cyklus',kicker:'PŘENOS · 14 MIN',duration:14,summary:'Účastník si vybere jednu vlastní skupinu a stanoví minimální návyk pro plánování a zápis po hodině.',trainerNote:'Cílem je jednoduchý návyk, ne kompletní migrace všech předmětů během školení.',speakerNotes:notes('Na závěr si nastavíme co nejmenší workflow, které opravdu vydržíte používat.','Jaká jedna skupina je nejlepší pro první týden testování?','Nevytvářej tlak na import celé historie nebo všech skupin najednou.','Handout připomene minimální cyklus i bezpečnostní hranice.'),blocks:[
      {type:'mission',label:'PRVNÍ TÝDEN',title:'Vyberte jednu skupinu a jednoduchý návyk',brief:'Určete, co zapíšete před hodinou, co po hodině a který materiál chcete mít po ruce.',time:'8 MIN',output:'Jedna skupina + minimální workflow na příští týden.'}
    ]}
  ]
};

export const maturitaDesk = {
  id:'maturita-desk', order:12, code:'MAT-01', title:'Maturita Desk', shortTitle:'Maturita Desk',
  subtitle:'Příprava a vedení ústní maturitní zkoušky z angličtiny — v současnosti pouze demo se syntetickými daty',
  category:'Specializovaná aplikace', audience:'Vyučující anglického jazyka a maturitní komise', duration:50, reserve:5, level:'Základní', required:false, status:'Demo / řízený pilot',
  accent:'#4b263d', icon:'./assets/course-icons/maturita-desk.svg', prerequisites:['ai-literacy'],
  outcomes:['Rozlišíte, co současné demo Maturita Desk umí a co do něj zatím nepatří.', 'Projete modelový průběh přípravy a vedení ústní zkoušky.', 'Budete respektovat hranici syntetických demo dat a důvěrných zkušebních materiálů.', 'Před ostrým použitím ověříte aktuální provozní režim aplikace.'],
  lessons:[
    {id:'scope',title:'Co dnes Maturita Desk je — a není',kicker:'ROZSAH · 8 MIN',duration:8,summary:'Studio aktuálně zpřístupňuje pouze řízené demo se syntetickými ukázkovými daty; důvěrné skutečné zkušební materiály do veřejného demo režimu nepatří.',trainerNote:'Řekni tuto hranici hned na začátku a ukaž ji také vizuálně.',speakerNotes:notes('U této aplikace je nejdůležitější nejdřív přesně říct, v jakém režimu jsme.','Co byste považovali za důvěrný zkušební obsah, který do veřejného dema nesmí přijít?','Nedemonstruj aplikaci na skutečných neveřejných maturitních materiálech.','Potom můžeme bezpečně projít modelový workflow.'),blocks:[
      {type:'statement',label:'AKTUÁLNÍ REŽIM',text:'Řízený pilot · pouze syntetická demo data.',detail:'Confidential exam content: NE.'},
      {type:'comparison',left:{title:'V demu ano',items:['syntetické otázky','modelový průběh','ovládání a navigace','ověření workflow']},right:{title:'V demu ne',items:['skutečné neveřejné otázky','důvěrné přílohy','osobní údaje kandidátů','ostrý provoz komise']}}
    ]},
    {id:'workflow',title:'Modelový průběh ústní zkoušky',kicker:'WORKFLOW · 12 MIN',duration:12,summary:'Aplikace pomáhá držet strukturu zkoušky a pracovat s připraveným obsahem, ale nenahrazuje pravidla maturitní zkoušky ani rozhodování zkoušejících.',trainerNote:'Předveď průchod pouze na syntetických datech.',speakerNotes:notes('Workflow má snížit organizační zátěž, ne měnit pravidla zkoušky.','Který krok ústní zkoušky je dnes organizačně nejcitlivější?','Nevydávej demo workflow za schválený ostrý provoz, dokud není produkční režim formálně připraven.','Teď se zaměříme na bezpečnostní hranici obsahu.'),blocks:[
      {type:'flow',items:[{number:'01',title:'Připravený obsah',text:'V demu pouze syntetická sada.'},{number:'02',title:'Průběh',text:'Strukturované vedení jednotlivých částí.'},{number:'03',title:'Komise',text:'Člověk rozhoduje podle platných pravidel a skutečného výkonu.'},{number:'04',title:'Ukončení',text:'Bezpečné uzavření relace a práce s daty podle provozního režimu.'}]},
      {type:'callout',tone:'warning',title:'Aplikace není hodnotitel sama o sobě',text:'Pravidla zkoušky, odborný úsudek a konečné hodnocení zůstávají na lidech.'}
    ]},
    {id:'security',title:'Důvěrnost zkušebních materiálů',kicker:'BEZPEČNOST · 10 MIN',duration:10,summary:'Současný veřejný demo profil je záměrně omezen. Důvěrný obsah je povolen až v budoucím schváleném režimu s odpovídající ochranou.',trainerNote:'Vysvětli rozdíl mezi demo obsahem a budoucím produkčním profilem.',speakerNotes:notes('U maturitních materiálů nestačí obecná opatrnost. Potřebujeme jasně vědět, zda prostředí důvěrný obsah vůbec dovoluje.','Jak ověříte před použitím, že pracujete ve správném provozním režimu?','Neříkej, že budoucí bezpečný režim už existuje, pokud nebyl skutečně nasazen a ověřen.','Nakonec si ukážeme, co je bezpečné dělat už teď.'),blocks:[
      {type:'decision',label:'PŘED VLOŽENÍM OBSAHU',question:'Je aplikace v režimu, který výslovně dovoluje tento typ zkušebního obsahu?',options:[{title:'Ne / nevím',text:'Obsah nevkládám a používám pouze syntetická data.'},{title:'Ano, ověřeno',text:'Postupuji podle aktuálních školních pravidel a oprávnění.'}]},
      {type:'callout',tone:'danger',title:'Výchozí pravidlo současného dema',text:'Skutečný důvěrný obsah nevkládat.'}
    ]},
    {id:'teacher-role',title:'Technika podporuje komisi, nerozhoduje za ni',kicker:'LIDSKÁ ROLE · 8 MIN',duration:8,summary:'Aplikace může držet pořadí a podklady, ale odborný úsudek, komunikaci s kandidátem a hodnocení nemůže převzít.',trainerNote:'Propoj to s hlavním principem vstupního školení.',speakerNotes:notes('Stejně jako jinde: nástroj může připravit strukturu, ale rozhodnutí zůstává na člověku.','Kterou část maturitní zkoušky byste nikdy nechtěli automatizovat?','Nespekuluj o budoucích funkcích, které nejsou v aktuálním demu.','Uzavřeme tím, co lze bezpečně otestovat už dnes.'),blocks:[
      {type:'statement',label:'PRINCIP',text:'Nástroj organizuje. Komise posuzuje a rozhoduje.',detail:'Technologie nesmí zastřít odpovědnost zkoušejících.'}
    ]},
    {id:'practice',title:'Bezpečná demo zkouška',kicker:'PŘENOS · 7 MIN',duration:7,summary:'Účastník si projde jeden modelový scénář pouze se syntetickými daty a pojmenuje podmínky pro případné budoucí ostré použití.',trainerNote:'Zakonči explicitním zopakováním aktuální hranice dema.',speakerNotes:notes('První praktický krok je jednoduchý: projít demo, ne do něj stěhovat ostrá data.','Jaké tři podmínky by musely být splněny, než byste uvažovali o reálném použití?','Nenech závěr vyznít jako souhlas s ostrým provozem.','Handout bude obsahovat aktuální režim a bezpečnostní kontrolu.'),blocks:[
      {type:'mission',label:'DEMO',title:'Projít modelový scénář bez reálných dat',brief:'Vyzkoušejte syntetickou zkoušku a napište tři podmínky, které byste před ostrým použitím chtěli mít ověřené.',time:'5 MIN',output:'Ověřené demo + seznam provozních podmínek.'}
    ]}
  ]
};
