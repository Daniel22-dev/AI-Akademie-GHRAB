const note=(say,ask,demo,caution,transition)=>({
  say:[say],explain:[say],ask:[ask],expected:['Vrať odpovědi k praktickému rozhodnutí učitele a nepřidávej technické detaily, které skupina nepotřebuje.'],
  demo:[demo],facilitation:['Nech kolegy krátce reagovat a vždy převáděj princip do konkrétní školní situace.'],
  caution:[caution],transition:[transition],fallback:['Když nefunguje živá ukázka, použij modelovou situaci přímo na slidu.'],
  shortcut:['Ponech hlavní myšlenku, jednu otázku a jeden praktický příklad.'],timing:'Krátký výklad → otázka → praktická ukázka → přechod.'
});
export default {
  id:'ai-literacy',order:0,code:'START-00',
  title:'Vstupní školení: AI, bezpečnost a AI Studio',
  shortTitle:'Povinný vstup',
  subtitle:'Jak používat AI smysluplně, bezpečně a s učitelem jako konečným rozhodovacím článkem',
  category:'Povinný základ',audience:'Všichni kolegové před prvním zpřístupněním aplikace AI Studia',
  duration:70,reserve:5,level:'Vstupní',required:true,status:'Povinné vstupní školení',
  accent:'#a877ff',icon:'./assets/course-icons/ai-literacy.png',prerequisites:[],
  trainingMeta:{kind:'foundation',verifiedAgainst:'AI Studio 0.21.133',verifiedAt:'30. 9. 2026',teacherDecision:true,
    teacherChecks:['Je výstup věcně správný?','Odpovídá konkrétní třídě a cíli?','Neobsahuje nevhodná nebo citlivá data?','Podepsal(a) bych se pod finální výsledek?']},
  outcomes:[
    'Rozlišíte slabý a kvalitní prompt a dokážete zadání zpřesnit.',
    'Poznáte situace, kdy je nutné data anonymizovat nebo AI vůbec nepoužít.',
    'Vysvětlíte, proč AI výstup není automaticky hotové pedagogické rozhodnutí.',
    'Zorientujete se v AI Studiu a pochopíte smysl jeho vlastních aplikací.',
    'Budete používat jednoduchý postup: AI navrhne → učitel posoudí → učitel upraví → učitel rozhodne.'
  ],
  handout:{
    title:'AI, bezpečnost a AI Studio — rychlá opora po školení',
    intro:'AI je pracovní nástroj. Může výrazně urychlit přípravu, formulaci a analýzu, ale konečné pedagogické rozhodnutí zůstává na učiteli.',
    keyPoints:[
      'Dobrý prompt obsahuje kontext, cíl, cílovou skupinu, omezení a požadovaný výstup.',
      'Přesvědčivě napsaná odpověď není důkaz správnosti.',
      'Citlivé nebo identifikující údaje nevkládáme bez jasného právního a provozního důvodu; v běžné práci je anonymizujeme.',
      'AI Studio nabízí připravené pracovní postupy pro konkrétní školní úkoly, ale nenahrazuje učitelský úsudek.',
      'Před použitím výstupu ve výuce nebo komunikaci vždy proběhne lidská kontrola.'
    ],
    workflow:['Ujasni si cíl.','Odstraň zbytečná osobní data.','Zadej kontext a požadovaný výstup.','Zkontroluj fakta a pedagogickou vhodnost.','Uprav.','Teprve potom použij.'],
    warnings:['Nevkládej hesla, API klíče ani přístupové údaje.','U citlivých situací, hodnocení a komunikace nikdy nepřebírej výstup bez kontroly.'],
    quickReference:'AI pomáhá. Učitel kontroluje. Učitel rozhoduje.'
  },
  lessons:[
    {id:'teacher-role',title:'AI nepřebírá roli učitele',kicker:'HLAVNÍ PRINCIP',duration:7,
      summary:'AI může připravit návrh, ale odpovědnost za pedagogické rozhodnutí zůstává na člověku.',
      trainerNote:'Začni touto myšlenkou dřív než funkcemi nástrojů.',
      speakerNotes:note('Nejdůležitější věta dneška je jednoduchá: AI není náhradní učitel. Je to velmi rychlý pomocník, kterému ale chybí znalost naší konkrétní třídy.','Co víte o své třídě, co žádný obecný model vědět nemůže?','Ukaž řetězec AI navrhne → učitel posoudí → učitel upraví → učitel rozhodne.','Nevytvářej dojem, že AI přenáší odpovědnost za hodnocení nebo výuku.','Teď si ukážeme, jak tomu pomůže kvalitní zadání.'),
      blocks:[
        {type:'statement',label:'ZÁKLAD AKADEMIE',text:'AI pomáhá. Učitel kontroluje. Učitel rozhoduje.',detail:'AI může urychlit návrh a analýzu. Konečné pedagogické rozhodnutí, odpovědnost a znalost třídy zůstávají na učiteli.'},
        {type:'flow',items:[
          {number:'01',title:'AI navrhne',text:'Připraví variantu, otázky, strukturu nebo analýzu.'},
          {number:'02',title:'Učitel posoudí',text:'Zkontroluje správnost, cíl, úroveň a kontext třídy.'},
          {number:'03',title:'Učitel upraví',text:'Opraví chyby a přizpůsobí výstup reálné situaci.'},
          {number:'04',title:'Učitel rozhodne',text:'Teprve člověk určí, zda a jak se výstup použije.'}
        ]},
        {type:'callout',tone:'success',title:'Co AI skutečně šetří',text:'Rutinu a čas na první návrh — ne profesionální úsudek učitele.'}
      ]},
    {id:'prompting',title:'Špatný prompt vs. dobrý prompt',kicker:'PROMPTOVÁNÍ',duration:10,
      summary:'Kvalita výstupu výrazně roste, když AI dostane jasný cíl, kontext, omezení a požadovaný formát.',
      trainerNote:'Použij jeden reálný učitelský příklad a prompt postupně vylepšuj.',
      speakerNotes:note('Když zadám jen „udělej mi test“, dostanu obecný test. AI nemůže uhodnout ročník, cíl ani to, co už jsme probrali.','Co byste doplnili do promptu, aby byl použitelný pro vaši konkrétní hodinu?','Porovnej „Udělej test“ s promptem, který obsahuje předmět, ročník, cíl, rozsah a formát.','Nedělej z promptování soutěž o nejdelší prompt. Důležitá je přesnost.','Kvalitní zadání ale stále neznamená automaticky správný výsledek.'),
      blocks:[
        {type:'showcase',label:'PŘED A PO',title:'Stejný požadavek, jiná kvalita zadání',before:{label:'SLABÉ',title:'„Udělej mi test.“',items:['bez ročníku','bez cíle','bez rozsahu','bez formátu']},after:{label:'LEPŠÍ',title:'Kontext + cíl + omezení + formát',items:['pro koho','co ověřit','co nepoužívat','jak má výstup vypadat']},caption:'Prompt není kouzelná formule. Je to přesné pracovní zadání.'},
        {type:'cards',columns:4,items:[
          {icon:'1',title:'Kontext',text:'Kdo, kde a k čemu výstup použije.'},
          {icon:'2',title:'Cíl',text:'Co má výstup nebo žák skutečně zvládnout.'},
          {icon:'3',title:'Omezení',text:'Rozsah, zdroje, úroveň, zakázané prvky.'},
          {icon:'4',title:'Formát',text:'Test, tabulka, body, e-mail, pracovní list…'}
        ]}
      ]},
    {id:'verification',title:'AI může znít jistě a přitom se mýlit',kicker:'KRITICKÁ KONTROLA',duration:8,
      summary:'Plynulý text není záruka pravdy, správného řešení ani vhodnosti pro konkrétní třídu.',
      trainerNote:'Nech kolegy pojmenovat, co by kontrolovali u materiálu ve svém předmětu.',
      speakerNotes:note('Nejzrádnější není AI, která napíše očividný nesmysl. Nejzrádnější je chyba napsaná velmi přesvědčivě.','Co je u vašich materiálů nejrizikovější převzít bez kontroly?','Ukaž krátký příklad, kde je formulace pěkná, ale jedna skutečnost nebo klíč odpovědi je špatně.','Kontrola stejnou AI není nezávislé ověření.','Vedle správnosti musíme řešit ještě bezpečnost dat.'),
      blocks:[
        {type:'comparison',left:{title:'AI umí',items:['rychle navrhovat','přeformulovat','třídit a strukturovat','nabídnout více variant']},right:{title:'Učitel musí',items:['ověřit fakta','zkontrolovat řešení','posoudit úroveň','rozhodnout o použití']}},
        {type:'callout',tone:'warning',title:'Kontrolní otázka',text:'Podepsal(a) bych se pod tento výstup před žáky, rodiči nebo kolegy?'}
      ]},
    {id:'safety',title:'Bezpečnost: co do AI neposílat',kicker:'DATA A SOUKROMÍ',duration:10,
      summary:'Do běžného AI workflow patří jen data, která skutečně potřebujeme a která smíme zpracovat.',
      trainerNote:'Pracuj s modelovými situacemi ANO / NE / ZÁLEŽÍ.',
      speakerNotes:note('Bezpečnost není technická disciplína pro správce. Je to návyk každého z nás při práci s textem a soubory.','Které údaje byste z modelového e-mailu odstranili před použitím AI?','Nech skupinu rozhodovat ANO / NE / ZÁLEŽÍ u jména žáka, diagnózy, anonymního pracovního listu a veřejného textu.','Neříkej, že AI Studio dělá jakákoli data automaticky bezpečná.','Právě tady dává smysl vysvětlit, proč máme vlastní aplikace.'),
      blocks:[
        {type:'decision',label:'RYCHLÉ ROZHODNUTÍ',question:'Potřebuji pro tento úkol skutečně identitu konkrétního člověka?',options:[
          {title:'Ne',text:'Odstraň jméno, kontakt, třídu a jedinečné okolnosti. Pracuj s anonymním obsahem.'},
          {title:'Ano / nejsem si jistý',text:'Neodesílej data automaticky. Nejprve ověř, zda je takové zpracování vůbec vhodné a povolené.'}
        ]},
        {type:'callout',tone:'danger',title:'Nikdy',text:'Hesla, API klíče, přístupové tokeny a jiné autentizační údaje do promptu nepatří.'}
      ]},
    {id:'studio-why',title:'Proč máme AI Studio a vlastní aplikace',kicker:'SMYSL SYSTÉMU',duration:8,
      summary:'Místo prázdného chatbotu dostává učitel připravený pracovní postup pro konkrétní školní úkol.',
      trainerNote:'Vysvětluj přínos, ne architekturu. Žádné API, GARP ani interní názvy.',
      speakerNotes:note('Smyslem Studia není přidat další ikonky. Smyslem je zkrátit cestu od potřeby učitele k použitelnému výsledku a přitom držet jasný pracovní postup.','Kdy vás u běžného chatbotu nejvíc zdržuje vysvětlování toho, co vlastně chcete?','Porovnej prázdné chatovací okno s aplikací, která už zná účel a vede uživatele krok za krokem.','Vlastní aplikace nejsou důvod přestat kontrolovat výstupy nebo pravidla práce s daty.','Teď si ukážeme samotné Studio jako rozcestník.'),
      blocks:[
        {type:'showcase',label:'DVA ZPŮSOBY PRÁCE',title:'Od prázdného okna k připravenému workflow',before:{label:'OBECNÝ CHATBOT',title:'Začínám pokaždé od nuly',items:['musím vysvětlit úkol','musím hlídat strukturu','výstup může být pokaždé jiný']},after:{label:'AI STUDIO',title:'Aplikace zná pracovní postup',items:['vede vstup krok za krokem','má připravená pravidla konkrétní úlohy','výsledek je strukturovanější']},caption:'Aplikace usnadňuje postup. Odbornou odpovědnost nepřebírá.'}
      ]},
    {id:'studio-tour',title:'AI Studio: základní orientace',kicker:'PRAKTICKÁ UKÁZKA',duration:8,
      summary:'Studio je vstupní rozcestník. Jednotlivé aplikace mají rozdílný účel a přístup se váže na absolvované školení.',
      trainerNote:'Ukaž reálný portál a jen několik hlavních karet. Neprocházej každé tlačítko.',
      speakerNotes:note('Studio berte jako vstupní halu. Odtud se dostanete k nástrojům podle toho, co právě potřebujete dělat.','Která z dostupných aplikací by vám dnes ušetřila nejvíc rutinní práce?','Na reálném Studiu ukaž domovskou obrazovku, kartu aplikace, otevření aplikace a návrat zpět.','Nezabíhej do administrace a verzí. Vstupní školení má dát jistotu v orientaci.','Jednu věc si ale musíme zopakovat před koncem.'),
      blocks:[
        {type:'flow',items:[
          {number:'01',title:'Otevřu Studio',text:'Jeden vstupní bod pro školní nástroje.'},
          {number:'02',title:'Vyberu účel',text:'Test, diferenciace, komunikace, organizace třídy…'},
          {number:'03',title:'Pracuji v aplikaci',text:'Aplikace mě vede konkrétním workflow.'},
          {number:'04',title:'Zkontroluji výsledek',text:'Před použitím vždy proběhne lidská revize.'}
        ]}
      ]},
    {id:'final-check',title:'Před použitím: čtyři otázky učitele',kicker:'KONEČNÉ ROZHODNUTÍ',duration:6,
      summary:'Žádný výstup AI Studia se nepoužívá jen proto, že jej vytvořila aplikace.',
      trainerNote:'Nech každého vybrat kontrolu, kterou potřebuje ve své práci hlídat nejvíc.',
      speakerNotes:note('Když si z dneška odnesete jen jeden návyk, ať je to tato krátká kontrola před použitím.','Která z těchto čtyř otázek je pro vaši práci nejdůležitější?','Projeď čtyři otázky na modelovém pracovním listu nebo e-mailu.','Neuzavírej školení tvrzením, že technologie je bezpečná sama od sebe. Bezpečný je až celý způsob práce.','Po tomto vstupu už dává smysl školit konkrétní aplikaci.'),
      blocks:[
        {type:'checklist',title:'Před finálním použitím',items:[
          'Je výstup věcně správný?',
          'Odpovídá cíli, třídě a situaci?',
          'Jsou data a způsob použití bezpečné?',
          'Jsem ochoten/ochotna za toto finální rozhodnutí převzít odpovědnost?'
        ]},
        {type:'statement',label:'ZAPAMATUJ SI',text:'AI navrhne. Učitel posoudí. Učitel upraví. Učitel rozhodne.'}
      ]},
    {id:'next-step',title:'Co následuje po vstupním školení',kicker:'DALŠÍ CESTA',duration:8,
      summary:'Po společném základu následuje praktické školení konkrétní aplikace podle potřeby učitele.',
      trainerNote:'Ukaž katalog Akademie a nech kolegy zvolit aplikaci podle jejich práce.',
      speakerNotes:note('Teď už máme společný základ. Další školení už nebude obecně o AI, ale vždy o jednom konkrétním pracovním nástroji.','Který konkrétní pracovní úkol byste chtěli zrychlit jako první?','Ukaž katalog jednotlivých aplikací v AI Akademii.','Neslibuj, že každý potřebuje všechny aplikace. Smyslem je školit jen to, co kolega využije.','Ukonči vstup a pokračuj samostatným školením zvolené aplikace.'),
      blocks:[
        {type:'cards',columns:3,items:[
          {icon:'A',title:'Vyberu problém',text:'Co konkrétně potřebuji ve své práci dělat lépe nebo rychleji.'},
          {icon:'B',title:'Absolvuji aplikaci',text:'Krátké praktické školení konkrétního nástroje.'},
          {icon:'C',title:'Použiji s kontrolou',text:'Aplikace pomáhá, konečný výsledek schvaluje učitel.'}
        ]},
        {type:'mission',label:'ZÁVĚREČNÝ KROK',title:'Vyberte první konkrétní aplikaci',brief:'Pojmenujte jednu činnost, kterou chcete pomocí AI Studia zjednodušit.',time:'2 MIN',output:'Jedna konkrétní potřeba a jedna navazující aplikace.'}
      ]}
  ]
};