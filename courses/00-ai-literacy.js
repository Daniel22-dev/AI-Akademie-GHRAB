export default {
  id: 'ai-literacy',
  order: 0,
  code: 'OSVĚTA-01',
  title: 'AI v práci učitele',
  shortTitle: 'AI gramotnost',
  subtitle: 'Příležitosti, limity, kritické myšlení a odpovědné zpracování materiálů',
  category: 'AI gramotnost',
  audience: 'Všichni učitelé bez ohledu na předmět',
  duration: 75,
  level: 'Úvodní až mírně pokročilý',
  required: true,
  status: 'Připraveno',
  accent: '#a877ff',
  icon: './assets/apps/ai-literacy.png',
  prerequisites: [],
  outcomes: [
    'Vysvětlíte, co generativní AI umí a kde jsou její zásadní limity.',
    'Použijete jednoduchý postup pro kvalitní zadání a tvorbu materiálu.',
    'Ověříte fakta, zdroje, přiměřenost a didaktickou kvalitu výstupu.',
    'Rozlišíte rozumnou pomoc AI od nebezpečného přenechání úsudku stroji.',
    'Promyslíte, jak AI mění úkoly, hodnocení a kritické myšlení žáků.'
  ],
  lessons: [
    {
      id: 'why-now',
      title: 'Proč se o AI bavit právě teď',
      kicker: 'KONTEXT · 8 MIN',
      duration: 8,
      summary: 'Generativní AI už není okrajová technologie. Stává se běžnou součástí práce, vyhledávání, komunikace i učení — a škola musí reagovat vědomě, ne zákazem ani nekritickým nadšením.',
      trainerNote: 'Začněte krátkou anketou: Kdo AI používá alespoň jednou týdně? K čemu? Nehodnoťte odpovědi. Cílem je ukázat šíři zkušeností ve sboru.',
      blocks: [
        { type: 'lead', text: 'Nejdůležitější otázka už nezní „zda AI používat“, ale „kdy, proč, s jakými daty a jak ověřit výsledek“. Učitel zůstává autorem rozhodnutí, AI může být spolupracovníkem.' },
        { type: 'cards', columns: 4, items: [
          { icon: '1', title: 'Příprava', text: 'Nápady, struktury hodin, varianty aktivit, pracovní listy a otázky.' },
          { icon: '2', title: 'Komunikace', text: 'Návrhy e-mailů, shrnutí, úprava tónu a převod složitého textu do srozumitelné podoby.' },
          { icon: '3', title: 'Analýza', text: 'Porovnání verzí, hledání slabých míst, třídění podkladů a návrhy zlepšení.' },
          { icon: '4', title: 'Učení', text: 'Individualizace, zpětná vazba, trénink vysvětlování a tvorba různých cest k cíli.' }
        ]},
        { type: 'callout', tone: 'warning', title: 'Dvě stejně nebezpečné krajnosti', text: '„AI všechno vyřeší“ i „AI do školy nepatří“ obcházejí skutečný úkol: naučit se technologii používat účelně, bezpečně a kriticky.' }
      ]
    },
    {
      id: 'what-it-is',
      title: 'Co generativní AI je — a co není',
      kicker: 'MENTÁLNÍ MODEL · 9 MIN',
      duration: 9,
      summary: 'Model nevlastní pravdu ani lidské porozumění. Vytváří pravděpodobnou odpověď podle zadání, kontextu a naučených vzorců.',
      trainerNote: 'Použijte jednoduchý kontrast: velmi přesvědčivý jazyk není důkaz správnosti. Nezabíhejte do technických detailů neuronových sítí.',
      blocks: [
        { type: 'comparison', left: { title: 'Co AI umí dobře', items: ['rychle navrhnout více variant', 'pracovat se strukturou a stylem', 'přeformulovat, shrnout a kategorizovat', 'kombinovat informace z dodaného kontextu', 'pomáhat při hledání možností'] }, right: { title: 'Co z odpovědi neplyne', items: ['že jsou fakta správná', 'že citovaný zdroj skutečně existuje', 'že výstup odpovídá vašemu záměru', 'že je materiál didakticky vhodný', 'že lze výsledek použít bez kontroly'] } },
        { type: 'quote', text: 'Plynulost není totéž co pravdivost. Sebejistý tón není totéž co důkaz.' },
        { type: 'quiz', question: 'Které tvrzení vystihuje nejbezpečnější přístup?', options: ['Když odpověď zní odborně, lze jí věřit.', 'AI je vhodná hlavně pro fakta, protože se nemýlí.', 'AI navrhuje výstup; člověk ověřuje a rozhoduje.', 'AI je jen vyhledávač s hezčím rozhraním.'], answer: 2, explanation: 'Generativní model je nástroj pro návrh a zpracování, nikoli automatická autorita.' }
      ]
    },
    {
      id: 'good-task',
      title: 'Jak zadávat práci, aby výstup dával smysl',
      kicker: 'PRAKTICKÝ RÁMEC · 10 MIN',
      duration: 10,
      summary: 'Kvalitní výsledek nevzniká kouzelnou formulí. Vzniká z jasného cíle, dostatečného kontextu, požadovaného formátu a kritérií kontroly.',
      trainerNote: 'Nechte kolegy přepracovat vágní zadání „udělej pracovní list“. Poté společně porovnejte, co přineslo doplnění cíle a omezení.',
      blocks: [
        { type: 'flow', items: [
          { number: 'CÍL', title: 'Co potřebuji', text: 'Jedna jasná věta: co má výstup umožnit učiteli nebo žákovi.' },
          { number: 'KONTEXT', title: 'Pro koho a z čeho', text: 'Předmět, ročník, úroveň, čas, zdrojový materiál a situace.' },
          { number: 'VÝSTUP', title: 'Jak má vypadat', text: 'Struktura, rozsah, jazyk, počet variant nebo konkrétní formát.' },
          { number: 'KRITÉRIA', title: 'Co musí splnit', text: 'Správnost, věková přiměřenost, návaznost na cíl, co se nesmí změnit.' }
        ]},
        { type: 'code', label: 'Použitelná šablona zadání', code: 'Cíl: ...\nKontext: předmět, ročník, úroveň, délka hodiny...\nPodklad: ...\nVytvoř: ...\nZachovej: ...\nVyvaruj se: ...\nNa konci proveď kontrolu podle těchto kritérií: ...' },
        { type: 'activity', title: 'Z vágního zadání na profesionální', brief: 'Přepracujte zadání „Vytvoř mi aktivitu o klimatu“ tak, aby kolega podle výsledku mohl skutečně učit.', steps: ['Určete jeden konkrétní výukový cíl.', 'Doplňte věkovou skupinu a předmět.', 'Stanovte čas a podobu výstupu.', 'Napište dvě věci, které se nesmí stát.', 'Přidejte způsob ověření výsledku.'], output: 'Jedno zadání, které lze rovnou vložit do AI nástroje.' }
      ]
    },
    {
      id: 'material-workflow',
      title: 'Jak zpracovávat materiály s AI',
      kicker: 'WORKFLOW UČITELE · 12 MIN',
      duration: 12,
      summary: 'Nejbezpečnější postup nezačíná generováním od nuly. Začíná kvalitním podkladem, jasným cílem a několika kontrolními průchody.',
      trainerNote: 'Ukažte jeden reálný anonymizovaný materiál a projděte workflow živě. Zdůrazněte, že jeden dlouhý prompt není vždy lepší než postupná práce.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Vyberte důvěryhodný podklad', text: 'Vlastní text, učebnici, oficiální zdroj, rubriku nebo ověřená data. AI nemusí informace domýšlet.' },
          { title: 'Očistěte data', text: 'Odstraňte jména, kontakty, citlivé údaje a vše, co není pro úkol nezbytné.' },
          { title: 'Nechte AI nejprve porozumět zadání', text: 'Požádejte o stručné shrnutí cíle, omezení a možných rizik. Opravte nedorozumění dřív, než vznikne celý materiál.' },
          { title: 'Vytvořte první návrh', text: 'Požadujte konkrétní formát a přiměřený rozsah. Nenechávejte model rozhodovat o všem.' },
          { title: 'Proveďte odbornou a didaktickou kontrolu', text: 'Fakta, jazyk, obtížnost, instrukce, řešení, spravedlnost a vazba na cíl.' },
          { title: 'Nechte upravit jen konkrétní slabiny', text: 'Místo „udělej to lépe“ pojmenujte přesně, co je špatně a co má zůstat.' },
          { title: 'Uložte finální verzi jako vlastní práci', text: 'Odstraňte balast, sjednoťte styl a ověřte použitelnost v reálné hodině.' }
        ]},
        { type: 'callout', tone: 'success', title: 'AI je nejsilnější v iteraci', text: 'Kvalita obvykle vzniká v cyklu: návrh → kontrola → cílená oprava → závěrečné ověření. Ne v jednom kliknutí.' },
        { type: 'comparison', left: { title: 'Slabý postup', items: ['generovat bez podkladu', 'přijmout první výsledek', 'upravit jen vzhled', 'ověřit až ve třídě'] }, right: { title: 'Profesionální postup', items: ['pracovat s důvěryhodným zdrojem', 'stanovit neměnná kritéria', 'ověřit obsah i didaktiku', 'udělat malý test před použitím'] } }
      ]
    },
    {
      id: 'verification',
      title: 'Kritické myšlení a ověřování výstupů',
      kicker: 'KONTROLA KVALITY · 10 MIN',
      duration: 10,
      summary: 'Ověřování není závěrečná formalita. Je to nedílná součást práce s AI a zároveň model toho, co potřebujeme učit žáky.',
      trainerNote: 'Přineste dvě krátké odpovědi: jednu správnou a jednu s nenápadnou smyšlenou citací. Nechte kolegy hledat signály, ne hádat podle stylu.',
      blocks: [
        { type: 'cards', columns: 4, items: [
          { icon: 'F', title: 'Fakta', text: 'Lze tvrzení potvrdit v nezávislém důvěryhodném zdroji?' },
          { icon: 'Z', title: 'Zdroje', text: 'Existují citace, autoři, dokumenty a odkazy skutečně?' },
          { icon: 'L', title: 'Logika', text: 'Navazuje závěr na důkazy, nebo pouze zní přesvědčivě?' },
          { icon: 'D', title: 'Didaktika', text: 'Pomůže úkol cíli výuky, nebo jen vypadá atraktivně?' }
        ]},
        { type: 'checklist', title: 'Před použitím materiálu zkontroluji', items: ['Ověřil jsem klíčová fakta mimo AI odpověď.', 'Zkontroloval jsem každou citaci a odkaz.', 'Prošel jsem zadání i řešení otázku po otázce.', 'Obtížnost odpovídá cílové skupině.', 'Instrukce jsou jednoznačné a nevedou ke sporu.', 'Materiál neobsahuje stereotypy, nevhodné generalizace ani citlivá data.', 'Vím, co udělám, když žák najde chybu.'] },
        { type: 'callout', tone: 'warning', title: 'Požádat AI o kontrolu nestačí', text: 'Model může zopakovat vlastní chybu nebo vytvořit přesvědčivé vysvětlení nesprávného tvrzení. Nezávislý zdroj a odborný úsudek nelze obejít.' }
      ]
    },
    {
      id: 'students',
      title: 'AI, žáci a proměna zadávání úkolů',
      kicker: 'VÝUKA A HODNOCENÍ · 10 MIN',
      duration: 10,
      summary: 'Smyslem není soutěžit s žáky v odhalování AI. Potřebujeme navrhovat úkoly, ve kterých je vidět proces, porozumění, rozhodování a osobní odpovědnost.',
      trainerNote: 'Zeptejte se: Který běžný domácí úkol dnes AI zvládne bez učení? Poté společně úkol přepracujte.',
      blocks: [
        { type: 'comparison', left: { title: 'Úkol snadno nahraditelný AI', items: ['obecný referát bez práce se zdroji', 'shrnutí známého tématu', 'stejný esejový úkol pro všechny', 'výsledek bez zachycení procesu'] }, right: { title: 'Úkol podporující skutečné učení', items: ['práce s konkrétním školním podkladem', 'obhajoba voleb a změn', 'srovnání zdrojů a ověřování', 'průběžné verze a reflexe postupu', 'ústní navázání nebo praktická aplikace'] } },
        { type: 'steps', items: [
          { title: 'Stanovte pravidla použití', text: 'Co je dovoleno, co se má přiznat a co už je nahrazení vlastní práce.' },
          { title: 'Hodnoťte proces', text: 'Návrh, zdroje, revize, rozhodnutí a reflexe jsou často cennější než hladký finální text.' },
          { title: 'Vyžadujte dohledatelnost', text: 'Žák vysvětlí, jak AI použil, co odmítl, co ověřil a co upravil.' },
          { title: 'Učte práci s chybou', text: 'AI výstup může být předmětem kritiky, opravování a argumentace.' }
        ]},
        { type: 'callout', tone: 'danger', title: 'Detektor AI není důkaz', text: 'Automatické detektory mohou chybovat a nesmí být jediným podkladem pro obvinění žáka. Důležitější je dobře navržený proces práce a ověřitelné podklady.' }
      ]
    },
    {
      id: 'responsibility',
      title: 'Bezpečnost, autorská odpovědnost a transparentnost',
      kicker: 'PRAVIDLA PRAXE · 8 MIN',
      duration: 8,
      summary: 'Učitel musí vědět, jaká data používá, odkud pochází podklad, kdo odpovídá za finální výstup a kdy je vhodné použití AI přiznat.',
      trainerNote: 'Nevytvářejte právní přednášku. Držte se praktických rozhodnutí: data, zdroje, kontrola, transparentnost a odpovědnost.',
      blocks: [
        { type: 'cards', columns: 3, items: [
          { icon: 'D', title: 'Data', text: 'Používám jen nezbytná a anonymizovaná data. Citlivé údaje do nástroje nevkládám.' },
          { icon: 'A', title: 'Autorství', text: 'AI může pomoci, ale výběr, úpravy a odpovědnost za materiál nesu já.' },
          { icon: 'T', title: 'Transparentnost', text: 'Tam, kde je to významné, dokážu popsat, jakou roli AI v přípravě nebo úkolu hrála.' }
        ]},
        { type: 'table', headers: ['Situace', 'Rozumný postup'], rows: [
          ['Příprava běžného pracovního listu', 'AI lze použít jako pomocníka; učitel ověří obsah, řešení a přiměřenost.'],
          ['Hodnocení konkrétního žáka', 'Anonymizovat, držet se rubriky, výsledek přezkoumat a rozhodnutí nepřenést na AI.'],
          ['Citace nebo odborné tvrzení', 'Dohledat primární či důvěryhodný zdroj a ověřit přesné znění.'],
          ['Materiál převzatý z publikace', 'Respektovat licenci a autorská práva; AI není způsob, jak je obejít.'],
          ['AI výstup sdílený s kolegy', 'Popsat účel, míru kontroly a případná omezení materiálu.']
        ]},
        { type: 'quote', text: 'Odpovědné používání AI není jen otázka nástroje. Je to otázka profesního úsudku.' }
      ]
    },
    {
      id: 'takeaway',
      title: 'Pět pravidel pro každodenní práci',
      kicker: 'ZÁVĚR · 8 MIN',
      duration: 8,
      summary: 'Kolegové odcházejí s jednoduchým pracovním rámcem, který lze použít u libovolného AI nástroje nebo školní aplikace.',
      trainerNote: 'Závěr nechte praktický. Každý účastník si vybere jeden reálný úkol, na kterém v příštím týdnu bezpečný postup vyzkouší.',
      blocks: [
        { type: 'flow', items: [
          { number: '1', title: 'Mám cíl', text: 'Vím, proč AI používám a co má výsledkem vzniknout.' },
          { number: '2', title: 'Dávám kontext', text: 'Dodám kvalitní podklad, publikum, omezení a kritéria.' },
          { number: '3', title: 'Chráním data', text: 'Nevkládám zbytečné osobní ani citlivé údaje.' },
          { number: '4', title: 'Ověřuji', text: 'Kontroluji fakta, zdroje, logiku, didaktiku i spravedlnost.' },
          { number: '5', title: 'Rozhoduji já', text: 'Konečný výstup je moje profesní odpovědnost.' }
        ]},
        { type: 'activity', title: 'Osobní mini-plán', brief: 'Vyberte jednu opakující se činnost, u které může AI ušetřit čas, aniž by převzala vaše rozhodování.', steps: ['Pojmenujte konkrétní úkol.', 'Určete, kterou část může dělat AI.', 'Určete, co musí zůstat na člověku.', 'Napište způsob kontroly výsledku.', 'Stanovte, jak ochráníte data.'], output: 'Jedna bezpečná a realistická situace k vyzkoušení během příštího týdne.' },
        { type: 'callout', tone: 'success', title: 'Varianty podle zkušenosti skupiny', text: 'Pro méně zkušené: více živých ukázek a jeden společný úkol. Pro pokročilé: srovnání modelů, práce s delším podkladem, redesign hodnocení a společná tvorba pravidel předmětové komise.' }
      ]
    }
  ]
};
