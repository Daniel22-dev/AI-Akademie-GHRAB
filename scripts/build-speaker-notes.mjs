import fs from 'node:fs/promises';
import path from 'node:path';
import aiLiteracy from '../courses/00-ai-literacy.js';
import start from '../courses/00-start.js';
import differentiator from '../courses/01-differentiator.js';
import github from '../courses/02-github.js';
import generator from '../courses/03-generator.js';
import ludus from '../courses/04-ludus.js';
import correspondence from '../courses/05-correspondence.js';
import evaluator from '../courses/06-evaluator.js';
import workflow from '../courses/07-workflow.js';
import administrator from '../courses/08-administrator.js';

const courses = [aiLiteracy, start, differentiator, github, generator, ludus, correspondence, evaluator, workflow, administrator];
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const sentence = value => {
  const text = clean(value);
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
};

// Tyto formulace jsou psané jako skutečná mluvená opora, ne jako automaticky
// poskládaná parafráze názvu a shrnutí slidu. Záměrně se liší délkou i rytmem.
const spokenOverrides = {
  'ai-literacy/why-now': [
    'Začal bych úplně obyčejně: kdo z vás už během týdne AI aspoň jednou otevře? A k čemu?',
    'Nechci z toho dělat ani zázrak, ani strašáka. Je to nástroj, který už ve škole máme kolem sebe, a potřebujeme se naučit poznat, kdy nám pomáhá a kdy už rozhodnutí musí zůstat na nás.'
  ],
  'ai-literacy/what-it-is': [
    'Jedna věc je na AI zrádná: dokáže znít velmi jistě, i když si právě něco vymýšlí.',
    'Proto ji beru jako rychlého spolupracovníka na návrhy a zpracování textu, ne jako někoho, kdo má automaticky pravdu.'
  ],
  'ai-literacy/good-task': [
    'Když AI zadám jen „udělej mi pracovní list“, nemůžu se potom divit, že dostanu něco obecného.',
    'Čím lépe řeknu, pro koho materiál je, co má žák zvládnout a jak má výsledek vypadat, tím méně času potom strávím opravováním.'
  ],
  'ai-literacy/material-workflow': [
    'Já osobně se snažím nezačínat prázdným oknem. Vezmu vlastní podklad, očistím ho a teprve potom nechám AI pracovat.',
    'Nejlepší výsledky mi stejně nevznikají na první pokus. Vzniknou až ve chvíli, kdy modelu přesně řeknu, co je špatně a co naopak nesmí změnit.'
  ],
  'ai-literacy/verification': [
    'Tady je dobré si přiznat jednu nepříjemnou věc: hezky napsaná odpověď se kontroluje hůř, protože jí člověk snáz uvěří.',
    'U faktů, citací, řešení úloh a hodnocení proto potřebuji druhý zdroj nebo vlastní odbornou kontrolu. Kontrola stejnou AI není nezávislá kontrola.'
  ],
  'ai-literacy/students': [
    'Nemyslím si, že vyhrajeme závod v tom, kdo lépe pozná text z AI. To je slepá ulička.',
    'Mnohem větší smysl má změnit úkol tak, aby žák musel ukázat postup, zdroje, vlastní rozhodnutí a schopnost výsledek obhájit.'
  ],
  'ai-literacy/responsibility': [
    'Tuhle část nechci měnit v právnickou přednášku. Stačí si hlídat několik praktických věcí.',
    'Co do nástroje posílám, odkud mám podklady, co jsem ověřil a jestli bych se pod finální výstup bez obav podepsal.'
  ],
  'ai-literacy/takeaway': [
    'Na závěr bych z toho nedělal dalších dvacet pravidel. Bohatě stačí pět návyků, které se dají použít u jakéhokoli nástroje.',
    'Když mám jasný cíl, bezpečný podklad, konkrétní zadání, kontrolu a vlastní odpovědnost, jsem na dobré cestě.'
  ],

  'start/orientation': [
    'Studio není jedna obří aplikace. Je to spíš vstupní hala, ze které se dostáváme do jednotlivých nástrojů.',
    'A důležitý detail: samotný odkaz nikoho nikam nepustí. Přístup se ověřuje zvlášť.'
  ],
  'start/three-keys': [
    'Když se něco nespustí, většinou není potřeba panikařit. Hledáme problém ve třech věcech: přístup, klíč a prohlížeč.',
    'Stačí postupovat po jedné. Když začneme měnit všechno najednou, jen si ztížíme hledání chyby.'
  ],
  'start/access': [
    'Osobní přístup funguje podobně jako vstupenka. Dostanete soubor nebo kód a Studio si ověří, pro koho a pro které aplikace platí.',
    'Není potřeba nic instalovat na server ani posílat heslo někomu dalšímu.'
  ],
  'start/api-key': [
    'API klíč zní technicky, ale prakticky je to jen osobní klíč, kterým aplikace otevře přístup ke Gemini.',
    'Ukážu celý postup pomalu. Hlavně si pohlídáme, kam se klíč vkládá a kam se naopak nikdy kopírovat nemá.'
  ],
  'start/safety': [
    'Nejdůležitější bezpečnostní pravidlo je vlastně docela prosté: neposílat do AI něco, co tam vůbec být nemusí.',
    'Jména, e-maily a další údaje žáků předem odstraním. A výsledek pořád kontroluji jako učitel, ne jako divák.'
  ],
  'start/troubleshooting': [
    'Teď si ukážeme jednoduchou diagnostiku. Ne náhodné klikání, ale krátký postup, který opravdu šetří čas.',
    'Nejprve zjistím, jestli Studio vidí přístup, potom klíč a nakonec prohlížeč. Ve většině případů tím problém najdeme.'
  ],

  'differentiator/purpose': [
    'Diferenciace není to, že slabším žákům smažu polovinu textu a silnějším přidám dvě otázky navíc.',
    'Cíl může zůstat stejný. Mění se množství opory, cesta k výsledku nebo náročnost přemýšlení.'
  ],
  'differentiator/source': [
    'Než něco vygenerujeme, potřebujeme si ujasnit vstup. Aplikace nepozná sama, co je v materiálu nedotknutelné a co může upravit.',
    'Proto jí řeknu, pro koho materiál je, co má zůstat stejné a kde přesně chci rozdíly.'
  ],
  'differentiator/settings': [
    'Tři varianty neznamenají tři úplně jiné pracovní listy. Pořád držíme společný cíl a stejné jádro učiva.',
    'Podpůrná verze přidává oporu, standardní drží běžný nárok a rozšiřující jde víc do hloubky — ne jen do většího množství práce.'
  ],
  'differentiator/generation': [
    'Po kliknutí na generování práce nekončí. V tu chvíli teprve začíná učitelská kontrola.',
    'Já se nejdřív dívám na cíl a instrukce. Až potom řeším vzhled. Krásný pracovní list s chybným zadáním je pořád špatný pracovní list.'
  ],
  'differentiator/export': [
    'Výstup musí být použitelný i ve chvíli, kdy u něj nejsem a nic nevysvětluji.',
    'Proto kontroluji názvy variant, rozložení, tisk a hlavně to, jestli žák hned pozná, co má dělat.'
  ],
  'differentiator/next': [
    'Tady už každý nemusí pokračovat stejným směrem. Někdo bude chtít testy, jiný hry a někdo jen kvalitnější pracovní materiály.',
    'Důležité je vybrat další aplikaci podle vlastní potřeby, ne podle toho, která vypadá nejefektněji.'
  ],

  'github/why': [
    'GitHub může na první pohled působit jako něco pro programátory. My z něj ale potřebujeme jen velmi malou a praktickou část.',
    'Nahrajeme hotový HTML soubor a GitHub Pages z něj udělá odkaz, který otevřou žáci v prohlížeči.'
  ],
  'github/account': [
    'Účet a repozitář zakládáme jednou. Pak už jen přidáváme nebo měníme jednotlivé soubory.',
    'Vyplatí se zvolit normální profesionální název, protože se objeví i v odkazu, který budeme posílat dál.'
  ],
  'github/pages': [
    'Tady jsou v podstatě dvě důležité volby: větev main a kořen repozitáře.',
    'Jakmile je uložíme, GitHub začne vytvářet web. První spuštění může chvíli trvat, takže mu dáme čas a nebudeme nastavení hned překopávat.'
  ],
  'github/upload': [
    'Samotné nahrání souboru je podobné jako přiložení přílohy do e-mailu.',
    'Rozdíl je v tom, že změnu ještě pojmenujeme a potvrdíme. Ten krátký popis se později hodí, když hledáme, co jsme vlastně opravovali.'
  ],
  'github/link': [
    'Odkaz má pořád stejnou logiku: účet, repozitář a název souboru.',
    'Nejlepší kontrola je otevřít ho v anonymním okně. Tím hned poznám, jestli funguje i člověku, který není přihlášený do mého účtu.'
  ],
  'github/update': [
    'Tady je příjemná věc: když opravím soubor pod stejným názvem, nemusím žákům posílat nový odkaz.',
    'Jen počítám s tím, že nasazení a cache mohou mít krátké zpoždění. Proto výsledek vždy otevřu znovu a ověřím.'
  ],

  'generator/modes': [
    'Než začneme něco nastavovat, potřebujeme vědět, k čemu test slouží. Procvičování a klasifikovaný test nejsou totéž.',
    'Když zvolím špatný režim, můžu mít technicky hezký výstup, který ale neodpovídá situaci ve třídě.'
  ],
  'generator/input': [
    'U prvního testu bych byl schválně střídmý: krátký zdroj, jeden cíl a rozumný počet úloh.',
    'Čím větší balík zadám, tím víc času potom potřebuji na kontrolu a tím snáz přehlédnu chybu.'
  ],
  'generator/tasks': [
    'Generátor nabízí hodně typů úloh, ale není potřeba je nacpat do jednoho testu všechny.',
    'Typ úlohy vybírám podle toho, co chci ověřit. Jinak se test snadno změní v přehlídku efektů bez jasného didaktického smyslu.'
  ],
  'generator/differentiation': [
    'Varianty mají smysl tehdy, když jsou srovnatelné a pořád ověřují stejný cíl.',
    'Jednorázové kódy jsou praktické právě proto, že nemusíme do systému vkládat jména žáků a přitom dokážeme rozdělit různé verze.'
  ],
  'generator/review': [
    'Před exportem si test opravdu projdu jako žák. Nestačí se podívat, že otázky na obrazovce vypadají hezky.',
    'Kliknu každou cestu, zkontroluji klíč, body, zpětnou vazbu a zkusím i telefon. Test Lab je přesně na tohle.'
  ],
  'generator/export': [
    'Export není jen poslední tlačítko. Způsob distribuce musí odpovídat tomu, jestli jde o procvičování, běžný test nebo bezpečný offline režim.',
    'Ať zvolím cokoli, finální soubor ještě jednou otevřu mimo editor a ověřím, že skutečně funguje.'
  ],
  'generator/practice': [
    'Na konci nechci, aby každý odcházel jen s pocitem, že aplikaci viděl.',
    'Cílem je jeden krátký a použitelný test pro vlastní předmět. Nemusí být velký; musí být zkontrolovaný a reálně použitelný.'
  ],

  'ludus/purpose': [
    'U LUDUSu je snadné nechat se unést grafikou a příběhem. Já bych ale vždycky začal otázkou: co se mají žáci během hry naučit nebo procvičit?',
    'Herní svět je obal. Vzdělávací cíl, obsah a zpětná vazba jsou pořád to hlavní.'
  ],
  'ludus/route': [
    'LUDUS nabízí několik cest a není potřeba znát všechny najednou.',
    'Vybereme tu, která odpovídá konkrétní hodině: samostatná hra, třídní soutěž, import hotových úloh nebo celý lesson pack.'
  ],
  'ludus/mechanics': [
    'Tady je důležité rozlišit, co už je skutečně připravené k exportu a co je zatím jen náhled nebo koncept.',
    'Raději použiji jednodušší ověřený engine než působivou mechaniku, která se uprostřed hodiny rozsype.'
  ],
  'ludus/content': [
    'Hra sama špatnou otázku nezachrání. Každá stanice nebo úkol potřebuje jasné zadání, správnou odpověď a smysluplnou reakci na chybu.',
    'Nejdřív tedy kontroluji obsah. Teprve potom řeším tempo, body a herní atmosféru.'
  ],
  'ludus/teacher-mode': [
    'Učitel musí mít nad hrou pořád kontrolu. Potřebuji vědět, jak ji pozastavit, uložit stav nebo pomoci skupině, která se zasekla.',
    'Učitelský režim není doplněk navíc. Je to pojistka, že hra zůstane součástí hodiny a nepřevezme hodinu za mě.'
  ],
  'ludus/test-export': [
    'Hru testuji dvakrát: jednou očima žáka a podruhé očima učitele.',
    'Zajímá mě obsah, ovládání, ukládání i telefon. Co funguje na mém notebooku, nemusí automaticky fungovat celé třídě.'
  ],
  'ludus/lesson': [
    'Na závěr stačí malý kus hodiny. Nemusíme stavět hodinové dobrodružství.',
    'Připravíme krátkou hru nebo soutěž s jedním cílem a jasným místem v hodině — třeba pětiminutové opakování nebo závěrečnou kontrolu.'
  ],

  'correspondence/scope': [
    'Asistent je výborný na formulaci a srovnání myšlenek. Není ale náhradou osobního rozhovoru ani rozhodnutí vedení školy.',
    'U citlivé situace si nejdřív položím otázku, jestli vůbec patří do e-mailu. Někdy je nejlepší odpovědí domluvená schůzka.'
  ],
  'correspondence/anonymisation': [
    'Anonymizace není jednorázové odkliknutí. Jakmile text upravím nebo do něj něco doplním, musím ho zkontrolovat znovu.',
    'Jméno je jen nejviditelnější údaj. Člověka může prozradit i třída, konkrétní událost, datum nebo kombinace několika detailů.'
  ],
  'correspondence/analysis': [
    'Než nechám AI psát odpověď, potřebuji si ujasnit, co vlastně druhá strana chce.',
    'Oddělím fakta, požadavek, emoce a případné riziko. Tím se vyhnu tomu, že odpovím hezky, ale na něco úplně jiného.'
  ],
  'correspondence/variants': [
    'Tři verze nejsou tři stupně slušnosti. Každá má jiný účel.',
    'Stručná se hodí, když je věc jednoduchá. Standardní pokryje běžnou komunikaci. Diplomatická pomůže tam, kde záleží na vztahu a formulaci každé věty.'
  ],
  'correspondence/own-email': [
    'Často není potřeba kopírovat do aplikace celou historii. Bohatě stačí několik bodů: komu píšu, co potřebuji a jaký tón chci držet.',
    'Výsledek bývá čistší a zároveň do nástroje neposílám zbytečné údaje.'
  ],
  'correspondence/final-check': [
    'Koncept může znít perfektně a přesto obsahovat špatné datum, příliš tvrdou větu nebo slib, který jsem dát nechtěl.',
    'Před odesláním proto kontroluji fakta, adresáty, termíny a hlavně to, jak zpráva může působit na druhou stranu.'
  ],
  'correspondence/practice': [
    'Tady si projdeme celý postup na bezpečné modelové situaci.',
    'Nejde jen o to vytvořit pěkný e-mail. Důležité je správně anonymizovat vstup, vybrat vhodnou variantu a udělat závěrečnou lidskou kontrolu.'
  ],

  'evaluator/principle': [
    'U Hodnotitele je důležité oddělit dvě věci. AI hledá důkazy a připravuje rozbor, ale body a známku nemá volně vymýšlet.',
    'Výsledek počítá pevná logika podle rubriky. Tím se držíme stejných kritérií u každé práce.'
  ],
  'evaluator/input': [
    'Můžu vložit jednu práci nebo celou dávku, ale princip kontroly se nemění.',
    'U fotografií a PDF si navíc hlídám, jestli byl text správně přečten. Chyba na vstupu se jinak promítne do celého hodnocení.'
  ],
  'evaluator/privacy': [
    'Jméno studenta potřebuji lokálně kvůli párování a případnému odeslání. AI ho ale k hodnocení nepotřebuje.',
    'Do požadavku proto posílám pseudonymní kód, text práce, zadání a rubriku — ne jméno ani e-mail.'
  ],
  'evaluator/rubric': [
    'Tady se nesmí improvizovat. Každý bod musí vycházet z konkrétního kritéria a konkrétního místa v práci.',
    'Stejně tak podmínky FAIL nejsou pocitové. Buď jsou splněné podle rubriky, nebo nejsou.'
  ],
  'evaluator/teacher-review': [
    'Ani dobře nastavená aplikace nepřebírá odpovědnost za konečný verdikt.',
    'Procházím důkazy, tón zpětné vazby, doporučení i výsledné body. Teprve potom práci schválím.'
  ],
  'evaluator/batch': [
    'Dávka šetří klikání, ne odbornou kontrolu.',
    'Každá práce musí být správně přiřazená, čitelná a nakonec schválená učitelem. U většího množství je o to důležitější pořádek ve frontě.'
  ],
  'evaluator/export': [
    'Export volím podle toho, co budu s výsledkem dělat: něco pro studenta, něco pro vlastní evidenci a něco pro další zpracování.',
    'U e-mailu chci nejdřív koncept. Automatické odeslání bez poslední kontroly by u hodnocení bylo zbytečné riziko.'
  ],

  'workflow/one-source': [
    'Největší úspora nevznikne tím, že třikrát zadám stejné téma do tří aplikací.',
    'Vznikne tím, že si připravím jeden kvalitní zdroj a z něj potom udělám varianty, test i hru.'
  ],
  'workflow/source-model': [
    'Aby šel zdroj znovu použít, musí být srozumitelný nejen mně, ale i dalším aplikacím nebo kolegovi.',
    'Potřebuji v něm kontext, cíl, ověřený obsah, úlohy a jasné omezení. Ne jen hromadu textu.'
  ],
  'workflow/handoff': [
    'Předání mezi aplikacemi má dvě cesty. Rychlou lokální a klasický soubor, který můžu uložit nebo poslat dál.',
    'V obou případech platí totéž: předávám jen to, co opravdu potřebuji, a po importu zkontroluji, jestli se nic neztratilo.'
  ],
  'workflow/decision': [
    'Nástroj vybírám podle výsledku, který právě potřebuji. Ne podle toho, která aplikace má největší wow efekt.',
    'Když potřebuji oporu pro různé žáky, začnu Diferenciátorem. Když ověření, Generátorem. Když aktivizaci, LUDUSem.'
  ],
  'workflow/versions': [
    'Jakmile mám více výstupů, názvy typu final, final2 a opravdu-final přestávají fungovat.',
    'Jednoduchý systém názvů a verzí mi později řekne, z čeho materiál vznikl a která varianta je skutečně aktuální.'
  ],
  'workflow/quality-gate': [
    'Ať výstup vznikl v kterékoli aplikaci, na konci si pokládám stejných pět otázek.',
    'Plní cíl? Je správný? Je bezpečný? Funguje v praxi? A je jasné, kdo ho zkontroloval a schválil?'
  ],
  'workflow/team': [
    'Když kolegovi pošlu jen hotový odkaz, ušetřím mu trochu času. Když přidám zdroj, cíl a zkušenost z hodiny, dávám mu něco mnohem cennějšího.',
    'Právě tak může předmětová komise stavět společnou knihovnu, ne jen hromadu izolovaných souborů.'
  ],

  'administrator/role': [
    'Školitel a správce nemusí být vždy dvě různé osoby, ale jsou to dvě různé role.',
    'Jedna pomáhá kolegům aplikaci smysluplně používat. Druhá hlídá přístupy, evidenci a provoz.'
  ],
  'administrator/learning-path': [
    'Nemá smysl chtít po všech kolezích, aby prošli úplně všechno.',
    'Společný základ potřebujeme všichni. Další moduly už vybíráme podle předmětu, práce a reálné potřeby.'
  ],
  'administrator/issue-access': [
    'Vydání přístupu je citlivá operace hlavně kvůli soukromému podpisovému klíči.',
    'Ten načítám jen na důvěryhodném zařízení, vytvořím oprávnění a potom ho z prostředí zase odstraním. Samotnému kolegovi předávám jen podepsaný výsledek.'
  ],
  'administrator/registry': [
    'Evidence má být užitečná, ale nemá se z ní stát druhý trezor plný citlivých údajů.',
    'Stačí vědět, komu přístup patří, co dovoluje, dokdy platí a jak ho případně zneplatnit. Soukromý klíč ani celý dlouhý kód sem nepatří.'
  ],
  'administrator/delivery': [
    'Dobré školení není prohlídka všech tlačítek. Kolega si má něco skutečně vyzkoušet a odnést hotový výstup.',
    'Technické věci vysvětluji až ve chvíli, kdy jsou potřeba. Jinak zbytečně zahltím i lidi, kteří by aplikaci zvládli bez problémů.'
  ],
  'administrator/support': [
    'Po jednom školení se vždycky objeví otázky, které při ukázce nikoho nenapadly.',
    'Proto potřebujeme jednoduchý kanál podpory a hlavně rozlišit, jestli řešíme technickou chybu, nejasný postup nebo pedagogický problém.'
  ],
  'administrator/audit': [
    'Provozní kontrola nemusí být žádná obří inspekce. Jde o pravidelnou krátkou údržbu.',
    'Ověřím dostupnost aplikací, verze, platnost přístupů, bezpečnostní pravidla a zpětnou vazbu. Díky tomu se malé problémy nehromadí.'
  ]
};

const questionOverrides = {
  'ai-literacy/why-now': 'Kde vám už dnes AI reálně šetří čas — a kde jí naopak zatím nevěříte?',
  'ai-literacy/what-it-is': 'Která vlastnost AI podle vás nejčastěji mate začínající uživatele?',
  'ai-literacy/good-task': 'Co byste museli doplnit do věty „udělej mi pracovní list“, aby byl výsledek použitelný právě pro vaši třídu?',
  'ai-literacy/material-workflow': 'Ve kterém kroku nejčastěji podle vás vznikne chyba: podklad, zadání, nebo kontrola?',
  'ai-literacy/verification': 'Co z výstupu byste nikdy nepřevzali bez ověření v jiném zdroji?',
  'ai-literacy/students': 'Který běžný domácí úkol dnes AI zvládne, aniž by se žák cokoli naučil?',
  'ai-literacy/responsibility': 'U kterého typu práce byste považovali za fér otevřeně říct, že pomáhala AI?',
  'ai-literacy/takeaway': 'Které z pěti pravidel potřebujete ve své práci hlídat nejvíc?',

  'start/orientation': 'Co byste čekali od Studia: jednu aplikaci, nebo rozcestník více nástrojů?',
  'start/three-keys': 'Když se aplikace nespustí, kterou z těch tří oblastí byste kontrolovali jako první?',
  'start/access': 'Co je na osobním přístupu praktičtější než společné heslo pro celý sbor?',
  'start/api-key': 'Které místo v práci s API klíčem vám připadá nejrizikovější?',
  'start/safety': 'Jaký údaj se dá přehlédnout i po odstranění jména žáka?',
  'start/troubleshooting': 'Podle čeho poznáte, že problém není v přístupu, ale v API klíči?',

  'differentiator/purpose': 'Jak by se mohla lišit cesta dvou žáků ke stejnému cíli?',
  'differentiator/source': 'Co musí aplikace vědět o vaší skupině, aby nevytvořila jen obecný materiál?',
  'differentiator/settings': 'Jaký je podle vás rozdíl mezi rozšiřující variantou a pouhým přidáním další práce?',
  'differentiator/generation': 'Co kontrolujete jako první, když vám AI vytvoří pracovní list?',
  'differentiator/export': 'Co by měl žák pochopit během prvních deseti sekund po otevření materiálu?',
  'differentiator/next': 'Který další typ výstupu by se vám po diferenciaci hodil nejvíc?',

  'github/why': 'Kde dnes ukládáte interaktivní materiály, které chcete poslat žákům?',
  'github/account': 'Jaký název účtu nebo repozitáře by působil profesionálně i za dva roky?',
  'github/pages': 'Které dvě volby musíme nastavit, aby se z repozitáře stal web?',
  'github/upload': 'Proč se vyplatí každou uloženou změnu krátce pojmenovat?',
  'github/link': 'Jak byste ověřili, že odkaz funguje i žákovi bez vašeho přihlášení?',
  'github/update': 'Co musíme zachovat, aby po opravě zůstal stejný odkaz?',

  'generator/modes': 'Kdy byste zvolili procvičování a kdy už klasifikovaný test?',
  'generator/input': 'Jak malý může být první test, aby měl pořád smysl?',
  'generator/tasks': 'Který typ úlohy nejlépe odpovídá tomu, co ve svém předmětu skutečně chcete ověřit?',
  'generator/differentiation': 'Jak zajistit, aby dvě varianty byly rozdílné, ale pořád spravedlivě srovnatelné?',
  'generator/review': 'Kterou chybu byste při pouhém pohledu na náhled nemuseli vůbec odhalit?',
  'generator/export': 'Jaký způsob distribuce byste zvolili pro domácí procvičování a jaký pro známkovaný test?',
  'generator/practice': 'Jaký krátký test byste mohli opravdu použít v některé z příštích hodin?',

  'ludus/purpose': 'Kde ve vaší hodině by hra měla skutečný didaktický smysl a nebyla jen odměnou navíc?',
  'ludus/route': 'Která pracovní cesta nejlépe odpovídá aktivitě, kterou máte právě v hlavě?',
  'ludus/mechanics': 'Dali byste přednost efektnějšímu náhledu, nebo jednoduššímu ověřenému enginu? Proč?',
  'ludus/content': 'Co musí mít každá herní stanice, aby nebyla jen klikací překážkou?',
  'ludus/teacher-mode': 'Kterou možnost řízení hry byste jako učitel potřebovali nejčastěji?',
  'ludus/test-export': 'Co byste při testování hry kontrolovali jinak jako žák a jinak jako učitel?',
  'ludus/lesson': 'Kterou pětiminutovou část své hodiny byste dokázali převést do hry?',

  'correspondence/scope': 'Kterou situaci byste raději řešili osobně než pomocí e-mailu?',
  'correspondence/anonymisation': 'Co může člověka prozradit, i když z textu odstraníme jeho jméno?',
  'correspondence/analysis': 'Co bývá v náročném e-mailu těžší rozlišit: fakta, požadavek, nebo emoce?',
  'correspondence/variants': 'Kdy by vám stručná odpověď pomohla a kdy by naopak mohla působit necitlivě?',
  'correspondence/own-email': 'Jaké čtyři informace stačí zadat, abyste nemuseli kopírovat celou historii komunikace?',
  'correspondence/final-check': 'Která chyba v e-mailu může mít největší vztahový dopad, i když jsou fakta správně?',
  'correspondence/practice': 'Podle čeho poznáte, že je koncept připravený k odeslání a není to jen hezky napsaný návrh?',

  'evaluator/principle': 'Proč je bezpečnější, když AI připraví důkazy, ale body počítá pevná logika?',
  'evaluator/input': 'Co je potřeba navíc zkontrolovat u fotografie nebo naskenovaného PDF?',
  'evaluator/privacy': 'Které údaje potřebujeme lokálně, ale model je k samotnému hodnocení vůbec nepotřebuje?',
  'evaluator/rubric': 'Jak by měl vypadat důkaz, který opravdu opravňuje přidělit nebo odebrat bod?',
  'evaluator/teacher-review': 'Kterou část výsledku byste chtěli před schválením vidět vždy jako první?',
  'evaluator/batch': 'Kde se při dávkovém zpracování nejčastěji může stát chyba v přiřazení?',
  'evaluator/export': 'Který formát potřebujete pro studenta a který pro vlastní evidenci?',

  'workflow/one-source': 'Který svůj materiál byste dokázali využít zároveň pro diferenciaci, test i hru?',
  'workflow/source-model': 'Co musí zdroj obsahovat, aby ho bez vysvětlování pochopil i kolega?',
  'workflow/handoff': 'Kdy je praktičtější rychlé předání v prohlížeči a kdy raději uložený soubor?',
  'workflow/decision': 'Jaký výsledek právě potřebujete: podporu, ověření, nebo aktivizaci?',
  'workflow/versions': 'Jak dnes poznáte, který z několika podobných souborů je opravdu poslední verze?',
  'workflow/quality-gate': 'Která z pěti kontrolních otázek vám v praxi nejčastěji uteče?',
  'workflow/team': 'Co byste potřebovali dostat spolu s hotovým materiálem, abyste ho mohli bezpečně převzít?',

  'administrator/role': 'Které činnosti patří školiteli a které už správci provozu?',
  'administrator/learning-path': 'Které moduly by podle vás měli absolvovat všichni a které jen vybrané skupiny?',
  'administrator/issue-access': 'Který krok při vydání přístupu je nejcitlivější a proč?',
  'administrator/registry': 'Jaké minimum potřebujete evidovat, abyste dokázali přístup později najít a zneplatnit?',
  'administrator/delivery': 'Co si musí kolega ze školení skutečně odnést, aby mělo smysl?',
  'administrator/support': 'Jak nejrychleji rozlišíte technickou chybu od problému v zadání nebo metodice?',
  'administrator/audit': 'Které tři věci by měly být součástí pravidelné provozní kontroly?'
};

function mainPoints(lesson) {
  const points = [];
  for (const block of lesson.blocks || []) {
    if (block.type === 'statement') points.push(block.text);
    if (block.type === 'lead') points.push(block.text);
    if (['cards', 'flow', 'steps'].includes(block.type)) {
      for (const item of block.items || []) points.push(`${item.title}: ${item.text}`);
    }
    if (block.type === 'comparison') {
      points.push(`${block.left?.title}: ${(block.left?.items || []).slice(0, 2).join(', ')}`);
      points.push(`${block.right?.title}: ${(block.right?.items || []).slice(0, 2).join(', ')}`);
    }
    if (block.type === 'showcase') points.push(`${block.before?.title} → ${block.after?.title}`);
    if (block.type === 'decision') points.push(block.question);
    if (block.type === 'callout') points.push(`${block.title}: ${block.text}`);
    if (points.filter(Boolean).length >= 4) break;
  }
  return [...new Set(points.map(clean).filter(Boolean))].slice(0, 3);
}

function dominantBlock(lesson) {
  const priority = ['activity', 'mission', 'quiz', 'decision', 'comparison', 'showcase', 'steps', 'flow', 'table', 'code', 'checklist', 'cards', 'statement', 'lead'];
  return priority.find(type => lesson.blocks.some(block => block.type === type)) || 'default';
}

function toInternalVoice(value) {
  let text = clean(value);
  const replacements = [
    [/\bZačněte\b/g, 'Začni'], [/\bzačněte\b/g, 'začni'], [/\bPoužijte\b/g, 'Použij'], [/\bpoužijte\b/g, 'použij'],
    [/\bNechte\b/g, 'Nech'], [/\bnechte\b/g, 'nech'], [/\bUkažte\b/g, 'Ukaž'], [/\bukažte\b/g, 'ukaž'],
    [/\bZdůrazněte\b/g, 'Zdůrazni'], [/\bzdůrazněte\b/g, 'zdůrazni'], [/\bZeptejte se\b/g, 'Zeptej se'], [/\bzeptejte se\b/g, 'zeptej se'],
    [/\bPřipravte\b/g, 'Připrav'], [/\bpřipravte\b/g, 'připrav'], [/\bPřineste\b/g, 'Přines'], [/\bpřineste\b/g, 'přines'],
    [/\bDoporučte\b/g, 'Doporuč'], [/\bdoporučte\b/g, 'doporuč'], [/\bProjděte\b/g, 'Projdi'], [/\bprojděte\b/g, 'projdi'],
    [/\bOvěřte\b/g, 'Ověř'], [/\bověřte\b/g, 'ověř'], [/\bPřipomeňte\b/g, 'Připomeň'], [/\bpřipomeňte\b/g, 'připomeň'],
    [/\bVysvětlete\b/g, 'Vysvětli'], [/\bvysvětlete\b/g, 'vysvětli'], [/\bRozdělte\b/g, 'Rozděl'], [/\brozdělte\b/g, 'rozděl'],
    [/\bVyberte\b/g, 'Vyber'], [/\bvyberte\b/g, 'vyber'], [/\bZvolte\b/g, 'Zvol'], [/\bzvolte\b/g, 'zvol'],
    [/\bNastavte\b/g, 'Nastav'], [/\bnastavte\b/g, 'nastav'], [/\bPožádejte\b/g, 'Požádej'], [/\bpožádejte\b/g, 'požádej'],
    [/\bPřepracujte\b/g, 'Přepracuj'], [/\bpřepracujte\b/g, 'přepracuj'], [/\bZobrazte\b/g, 'Zobraz'], [/\bzobrazte\b/g, 'zobraz'],
    [/\bDejte\b/g, 'Dej'], [/\bdejte\b/g, 'dej'], [/\bNedělejte\b/g, 'Nedělej'], [/\bnedělejte\b/g, 'nedělej'],
    [/\bNevytvářejte\b/g, 'Nedělej'], [/\bnevytvářejte\b/g, 'nedělej'], [/\bNečtěte\b/g, 'Nečti'], [/\bnečtěte\b/g, 'nečti'],
    [/\bPracujte\b/g, 'Pracuj'], [/\bpracujte\b/g, 'pracuj'], [/\bDržte\b/g, 'Drž'], [/\bdržte\b/g, 'drž'],
    [/\bPočítejte\b/g, 'Počítej'], [/\bpočítejte\b/g, 'počítej'], [/\bSledujte\b/g, 'Sleduj'], [/\bsledujte\b/g, 'sleduj'],
    [/\bNehodnoťte\b/g, 'Nehodnoť'], [/\bnehodnoťte\b/g, 'nehodnoť'], [/\bPorovnejte\b/g, 'Porovnej'], [/\bporovnejte\b/g, 'porovnej'],
    [/\bDomluvte\b/g, 'Domluv'], [/\bdomluvte\b/g, 'domluv'], [/\bPodporujte\b/g, 'Podporuj'], [/\bpodporujte\b/g, 'podporuj']
  ];
  for (const [pattern, replacement] of replacements) text = text.replace(pattern, replacement);
  return sentence(text.replace(/\búčastníky\b/g, 'kolegy').replace(/\búčastníků\b/g, 'kolegů'));
}

function toInternalFragment(value) {
  return toInternalVoice(value).replace(/[.!?]+$/, '');
}

function expectedFor(lesson) {
  const quiz = lesson.blocks.find(block => block.type === 'quiz');
  if (quiz) return `Po hlasování stručně vysvětli logiku správné volby: ${sentence(quiz.explanation)}`;
  const decision = lesson.blocks.find(block => block.type === 'decision');
  if (decision) return 'Nehledej jednu univerzální odpověď. Vrať diskusi k cíli, situaci a důsledkům zvolené varianty.';
  const activity = lesson.blocks.find(block => block.type === 'activity');
  if (activity) {
    const output = clean(activity.output).replace(/[.!?]+$/, '');
    return `Vezmi dvě konkrétní odpovědi. U každé krátce pojmenuj, co je použitelné a co ještě chybí k výsledku „${output}“.`;
  }
  const warning = lesson.blocks.find(block => block.type === 'callout' && ['warning', 'danger', 'success'].includes(block.tone));
  if (warning) {
    const endings = [
      `Ať z odpovědí nakonec vyplyne toto: ${sentence(warning.text)}`,
      `Po dvou reakcích vrať diskusi k tomuto bodu: ${sentence(warning.text)}`,
      `Nenech debatu rozběhnout do šířky; uzavři ji tímto: ${sentence(warning.text)}`,
      `Tohle je místo, kam je potřeba odpovědi dovést: ${sentence(warning.text)}`
    ];
    return endings[lesson.title.length % endings.length];
  }
  return `Stačí jedna nebo dvě konkrétní zkušenosti. Potom je propoj s tématem slidu: ${sentence(lesson.summary)}`;
}

function demoFor(lesson) {
  const showcase = lesson.blocks.find(block => block.type === 'showcase');
  if (showcase) return `Nech nejdřív vyniknout rozdíl „${showcase.before.title}“ → „${showcase.after.title}“. Až potom pojmenuj, co změnu způsobilo.`;
  const activity = lesson.blocks.find(block => block.type === 'activity');
  if (activity) return `${toInternalVoice(activity.brief)} Na konci ukaž konkrétní výstup: ${sentence(activity.output)}`;
  const steps = lesson.blocks.find(block => block.type === 'steps');
  if (steps) return `Na obrazovce projdi jen první dva kroky: ${steps.items.slice(0, 2).map(item => toInternalFragment(item.title)).join(' → ')}. U každého ukaž, co po něm zůstane hotové.`;
  const flow = lesson.blocks.find(block => block.type === 'flow');
  if (flow) return 'Projeď tok zleva doprava na jednom konkrétním příkladu. U každého kroku řekni, co se pokazí, když ho přeskočíme.';
  const code = lesson.blocks.find(block => block.type === 'code');
  if (code) return `Zobraz blok „${code.label}“ a zvýrazni jen místa, která má učitel skutečně upravovat.`;
  const table = lesson.blocks.find(block => block.type === 'table');
  if (table) return `Vyber jeden běžný řádek a projdi ho zleva doprava: ${table.headers.join(' → ')}. Zbytek nech jako přehled.`;
  const comparison = lesson.blocks.find(block => block.type === 'comparison');
  if (comparison) return 'Dej kolegům deset vteřin na tiché porovnání. Potom ukaž jeden rozdíl, který má v praxi největší dopad.';
  const quiz = lesson.blocks.find(block => block.type === 'quiz');
  if (quiz) return 'Nech hlasovat zvednutím ruky nebo kliknutím. Vysvětlení drž krátké a zaměřené na důvod, ne jen na správné písmeno.';
  return 'Použij jeden krátký modelový příklad bez osobních údajů. Ukaž na něm konkrétní dopad, ne celou aplikaci.';
}

function cautionFor(lesson) {
  const warning = lesson.blocks.find(block => block.type === 'callout' && ['warning', 'danger'].includes(block.tone));
  if (warning) return `${warning.title}: ${warning.text}`;
  if (/hodnot|rubrik/i.test(`${lesson.title} ${lesson.summary}`)) return 'Nenech návrh AI zaměnit za konečné odborné rozhodnutí učitele. Drž se přesně zadané rubriky.';
  if (/žák|student|e-mail|sloh|osobn|anonym/i.test(`${lesson.title} ${lesson.summary}`)) return 'Pracuj jen s fiktivními nebo skutečně anonymizovanými údaji. Samotné odstranění jména nemusí stačit.';
  const type = dominantBlock(lesson);
  if (type === 'steps' || type === 'flow') return 'Nečti všechny kroky ze slidu. U každého stačí říct, proč tam je a co po něm zůstane hotové.';
  if (type === 'cards') return 'Neprocházej všechny karty stejně podrobně. Vyber dvě, které mají pro tuto skupinu největší význam.';
  if (type === 'comparison' || type === 'showcase') return 'Nedělej z porovnání černobílý soud. Pojmenuj podmínky, za kterých je postup vhodný nebo rizikový.';
  if (type === 'table') return 'Nečti tabulku po řádcích. Jeden dobře vysvětlený případ je užitečnější než rychlé projetí všeho.';
  if (type === 'activity' || type === 'mission') return 'Nedělej úkol za kolegy. Dej jim chvíli ticha a nápovědu nabídni až potom.';
  return 'Drž se jedné myšlenky a jednoho příkladu. Další detaily nech na dotazy.';
}

function shortcutFor(lesson) {
  const type = dominantBlock(lesson);
  if (type === 'activity' || type === 'mission') return 'Zkrať samostatnou práci na jednu minutu, vezmi dvě odpovědi a zbytek nech jako navazující úkol.';
  if (type === 'quiz' || type === 'decision') return 'Nech rychle hlasovat a vysvětli jen rozhodující důvod.';
  if (type === 'steps' || type === 'flow') return 'Projdi první krok, hlavní kontrolní bod a výsledek. Zbytek nech viditelný na slidu.';
  if (type === 'cards' || type === 'comparison' || type === 'showcase') return 'Vyber dva nejdůležitější body a spoj je jedním konkrétním příkladem.';
  if (type === 'table') return 'Projdi jediný nejběžnější řádek a ostatní označ jako přehled pro pozdější použití.';
  return 'Řekni jednu myšlenku, ukaž jeden příklad a polož jednu otázku.';
}

function fallbackFor(lesson) {
  const names = { showcase: 'ukázku před a po', comparison: 'porovnání', table: 'tabulku', flow: 'schéma postupu', steps: 'seznam kroků' };
  const visual = lesson.blocks.find(block => Object.hasOwn(names, block.type));
  if (visual) return `Když nefunguje internet nebo aplikace, pracuj přímo s blokem „${names[visual.type]}“ na slidu. Nech kolegy popsat správný postup vlastními slovy.`;
  return 'Když nefunguje internet nebo aplikace, pokračuj s příkladem na slidu. Cíl části se dá splnit i bez živé ukázky.';
}

function transitionFor(course, index) {
  const next = course.lessons[index + 1];
  if (!next) return 'Na závěr nech každého vybrat jeden konkrétní krok, který opravdu použije. Pak školení ukonči bez dalšího dlouhého shrnutí.';
  const variants = [
    `Tady už nic dalšího nepřidávej. Přepni rovnou na „${next.title}“; obsah na sebe přirozeně navazuje.`,
    `Uzavři poslední myšlenku a pokračuj rovnou částí „${next.title}“. Není potřeba vyrábět zvláštní spojovací větu.`,
    `Nech poslední bod chvíli doznít a otevři „${next.title}“. Další slide sám vysvětlí, proč pokračujeme právě tam.`,
    `Přejdi bez shrnování celé části na „${next.title}“. Stačí krátké: „A právě na to navazuje další krok.“`
  ];
  return variants[(course.order + index) % variants.length];
}

function timingFor(lesson) {
  const total = Math.max(3, Number(lesson.duration) || 5);
  const interaction = lesson.blocks.some(block => ['activity', 'quiz', 'checklist', 'mission', 'decision'].includes(block.type));
  const intro = Math.max(1, Math.round(total * .16));
  const practice = Math.max(1, Math.round(total * (interaction ? .38 : .24)));
  const explain = Math.max(1, total - intro - practice);
  return `${intro} min rozjezd · ${explain} min vysvětlení nebo ukázka · ${practice} min zapojení a uzavření`;
}

const entries = {};
for (const course of courses) {
  course.lessons.forEach((lesson, index) => {
    const key = `${course.id}/${lesson.id}`;
    const points = mainPoints(lesson);
    const say = spokenOverrides[key];
    if (!say) throw new Error(`Chybí ručně napsaná mluvená opora pro ${key}`);
    const ask = questionOverrides[key];
    if (!ask) throw new Error(`Chybí ručně napsaná otázka pro ${key}`);
    entries[key] = {
      say,
      explain: points.length ? points.map(sentence) : [sentence(lesson.summary)],
      ask: [ask],
      expected: [expectedFor(lesson)],
      demo: [demoFor(lesson)],
      facilitation: [toInternalVoice(lesson.trainerNote || 'Po hlavním bodu si ověř, že skupina dokáže postup převést do vlastní praxe.')],
      caution: [sentence(cautionFor(lesson))],
      transition: [transitionFor(course, index)],
      fallback: [fallbackFor(lesson)],
      shortcut: [shortcutFor(lesson)],
      timing: timingFor(lesson)
    };
  });
}

const output = `// Ručně psaná mluvená opora pro všech 68 částí.\n// Není určená k doslovnému čtení. Znovu vytvořit: npm run build:notes\nexport default ${JSON.stringify(entries, null, 2)};\n`;
await fs.writeFile(path.resolve('courses/speaker-notes.js'), output, 'utf8');
console.log(`Vytvořeno ${Object.keys(entries).length} sad přirozených poznámek.`);
