export default {
  id: 'workflow',
  order: 8,
  code: 'FLOW-01',
  title: 'Propojený workflow aplikací',
  shortTitle: 'Workflow',
  subtitle: 'Jeden kvalitní zdroj, několik výukových výstupů bez opakovaného přepisování',
  category: 'Pokročilá praxe',
  audience: 'Pravidelní uživatelé více aplikací',
  duration: 80,
  level: 'Pokročilé',
  required: false,
  accent: '#7ee7ff',
  icon: './assets/brand/portal-gateway.png',
  prerequisites: ['differentiator', 'generator', 'ludus'],
  outcomes: [
    'Připravíte znovupoužitelný anonymní zdrojový materiál.',
    'Předáte obsah mezi aplikacemi pomocí Studio Bridge nebo souboru.',
    'Rozhodnete, kdy diferencovat, testovat nebo gamifikovat.',
    'Udržíte konzistenci cíle, obsahu a verzí napříč výstupy.'
  ],
  lessons: [
    {
      id: 'one-source',
      title: 'Jeden zdroj, více účelů',
      kicker: 'STRATEGIE · 10 MIN',
      duration: 10,
      summary: 'Základním aktivem není hotový test ani hra, ale kvalitně připravený zdroj s cílem, obsahem a strukturovanými úlohami.',
      trainerNote: 'Použijte jeden krátký tematický celek a během školení z něj vytvořte tři různé podoby. Nezačínejte třemi nesouvisejícími materiály.',
      blocks: [
        { type: 'flow', items: [
          { number: '01', title: 'Zdroj', text: 'Text, cíle, kontext a ověřené úlohy.' },
          { number: '02', title: 'Diferenciace', text: 'Podpůrná, standardní a rozšiřující cesta.' },
          { number: '03', title: 'Ověření', text: 'Procvičování nebo test v Generátoru.' },
          { number: '04', title: 'Aktivizace', text: 'Herní mechanika nebo soutěž v LUDUSu.' }
        ]},
        { type: 'callout', tone: 'success', title: 'Hlavní přínos', text: 'Učitel nevytváří každou podobu od nuly. Zachovává společný cíl a pracuje s ověřeným obsahem.' }
      ]
    },
    {
      id: 'source-model',
      title: 'Znovupoužitelný zdrojový materiál',
      kicker: 'DATOVÁ KVALITA · 12 MIN',
      duration: 12,
      summary: 'Zdroj musí být srozumitelný člověku i aplikacím. Obsahuje pedagogický kontext, cíle, úlohy a omezení.',
      trainerNote: 'Vysvětlete, že „strukturovaný“ neznamená technický. Jde o jasně označené části a konzistentní názvy.',
      blocks: [
        { type: 'cards', columns: 4, items: [
          { icon: 'C', title: 'Kontext', text: 'Předmět, ročník, úroveň, čas a skupina.' },
          { icon: 'G', title: 'Cíl', text: 'Pozorovatelný výsledek práce žáka.' },
          { icon: 'S', title: 'Zdroj', text: 'Anonymizovaný text, fakta nebo obsah.' },
          { icon: 'T', title: 'Úlohy', text: 'Otázky s typem, řešením a případně zpětnou vazbou.' }
        ]},
        { type: 'checklist', title: 'Zdroj připravený k předání', items: ['Neobsahuje osobní údaje.', 'Používá jednotné názvy a terminologii.', 'Má ověřené správné odpovědi.', 'Odděluje obsah od instrukcí pro konkrétní aplikaci.', 'Má jasnou verzi nebo datum.'] }
      ]
    },
    {
      id: 'handoff',
      title: 'Studio Bridge a souborová předávka',
      kicker: 'PŘENOS MEZI APLIKACEMI · 15 MIN',
      duration: 15,
      summary: 'Aplikace mohou ve stejném prohlížeči převzít krátkodobý anonymní handoff. Záložní cestou je export a import strukturovaného souboru.',
      trainerNote: 'Ukažte obě cesty. Přímý handoff je pohodlnější, soubor je průhlednější a vhodný pro archivaci či předání kolegovi.',
      blocks: [
        { type: 'comparison', left: { title: 'Přímý Studio Bridge', items: ['stejný prohlížeč', 'krátkodobá lokální předávka', 'po převzetí se smaže', 'rychlý přechod mezi aplikacemi'] }, right: { title: 'Souborový export', items: ['vědomě uložený soubor', 'lze archivovat a sdílet', 'vyžaduje správnou verzi formátu', 'před importem lze obsah zkontrolovat'] } },
        { type: 'steps', items: [
          { title: 'Dokončete a zkontrolujte zdroj', text: 'Předávka nesmí být způsob, jak obejít kontrolu.' },
          { title: 'Zvolte cílovou aplikaci', text: 'Generátor pro ověření, LUDUS pro hru, Diferenciátor pro varianty.' },
          { title: 'Přeneste pouze potřebná data', text: 'Minimalizujte rozsah a zachovejte anonymizaci.' },
          { title: 'Po importu zkontrolujte mapování', text: 'Ověřte cíle, úlohy, odpovědi a případné ztracené informace.' }
        ]}
      ]
    },
    {
      id: 'decision',
      title: 'Kterou aplikaci použít',
      kicker: 'PEDAGOGICKÉ ROZHODOVÁNÍ · 12 MIN',
      duration: 12,
      summary: 'Nástroj se volí podle cíle konkrétní části výuky, ne podle toho, která aplikace působí nejefektněji.',
      trainerNote: 'Nechte účastníky řešit scénáře. Jedna hodina může využít více aplikací, ale ne nutně všechny.',
      blocks: [
        { type: 'table', headers: ['Potřeba', 'Primární nástroj', 'Možná návaznost'], rows: [
          ['Různá míra podpory', 'Diferenciátor', 'Generátor pro ekvivalentní varianty ověření'],
          ['Samostatné procvičování', 'Generátor', 'GitHub Pages pro sdílení'],
          ['Týmová aktivizace', 'LUDUS', 'Import ověřených úloh ze zdroje'],
          ['Profesionální e-mail', 'Korespondenční asistent', 'Bez návaznosti na výukový řetězec'],
          ['Maturitní sloh', 'Hodnotitel', 'Samostatný specializovaný workflow']
        ]},
        { type: 'quiz', question: 'Žáci mají stejný cíl, ale část skupiny potřebuje vodítka a část rozšíření. Který nástroj je nejlogičtější první krok?', options: ['LUDUS', 'Korespondenční asistent', 'Diferenciátor', 'GitHub'], answer: 2, explanation: 'Nejdříve se řeší pedagogicky smysluplné varianty; teprve poté lze zvolit formu ověření nebo hry.' }
      ]
    },
    {
      id: 'versions',
      title: 'Verze, názvy a archivace',
      kicker: 'PROVOZNÍ POŘÁDEK · 12 MIN',
      duration: 12,
      summary: 'Při více výstupech je nutné vědět, ze kterého zdroje vznikly, co se změnilo a která verze je aktuální.',
      trainerNote: 'Nabídněte jednoduché pojmenování, nikoli komplikovaný dokumentační systém.',
      blocks: [
        { type: 'code', label: 'Doporučený název zdroje', code: '2026-09-aj-b1-environment-source-v1.ghrab.json' },
        { type: 'code', label: 'Odvozené výstupy', code: '2026-09-aj-b1-environment-diff-v1.pdf\n2026-09-aj-b1-environment-practice-v2.html\n2026-09-aj-b1-environment-ludus-v1.html' },
        { type: 'checklist', title: 'Minimální evidence', items: ['Datum nebo období.', 'Předmět a cílová skupina.', 'Krátké téma.', 'Typ výstupu.', 'Číslo verze.', 'Poznámka o zásadní změně.'] },
        { type: 'callout', tone: 'warning', title: 'Aktuální odkaz musí ukazovat na aktuální obsah', text: 'Při opravě veřejného HTML zachovejte stejný název, pokud chcete zachovat odkaz, a po nasazení vždy ověřte skutečnou Pages URL.' }
      ]
    },
    {
      id: 'quality-gate',
      title: 'Společná kontrolní brána',
      kicker: 'KVALITA NAPŘÍČ APLIKACEMI · 12 MIN',
      duration: 12,
      summary: 'Každý výstup prochází stejnými pěti otázkami: cíl, správnost, bezpečnost, použitelnost a odpovědnost.',
      trainerNote: 'Tuto bránu lze vytisknout nebo používat jako závěrečný rituál každého školení.',
      blocks: [
        { type: 'flow', items: [
          { number: 'C', title: 'Cíl', text: 'Podporuje výstup skutečně zamýšlené učení?' },
          { number: 'S', title: 'Správnost', text: 'Jsou fakta, řešení a výpočty ověřené?' },
          { number: 'B', title: 'Bezpečnost', text: 'Neobsahuje výstup osobní údaje, klíče nebo citlivé informace?' },
          { number: 'P', title: 'Použitelnost', text: 'Rozumí uživatel instrukcím a funguje výstup na cílovém zařízení?' },
          { number: 'O', title: 'Odpovědnost', text: 'Je jasné, kdo výstup zkontroloval a schválil?' }
        ]},
        { type: 'activity', title: 'Jeden zdroj, tři výstupy', brief: 'Zvolte existující anonymní materiál.', steps: ['Vytvořte tři varianty v Diferenciátoru.', 'Převeďte část do krátkého procvičování.', 'Použijte stejný obsah v mini-hře.', 'U všech výstupů proveďte společnou kontrolní bránu.', 'Zapište názvy a verze.'], output: 'Propojená sada materiálů se společným cílem a dohledatelným zdrojem.' }
      ]
    },
    {
      id: 'team',
      title: 'Sdílení v předmětové komisi',
      kicker: 'TÝMOVÁ PRÁCE · 7 MIN',
      duration: 7,
      summary: 'Největší úspora vzniká, když se nesdílí pouze hotový odkaz, ale také kvalitní zdroj, cíl a poznámky k použití.',
      trainerNote: 'Navrhněte pilotní sdílenou sadu pro jednu komisi, ne centrální knihovnu všeho hned od začátku.',
      blocks: [
        { type: 'cards', columns: 3, items: [
          { icon: '1', title: 'Zdroj', text: 'Anonymní, upravitelný a verzovaný podklad.' },
          { icon: '2', title: 'Výstupy', text: 'PDF, HTML, hra nebo test s jasným účelem.' },
          { icon: '3', title: 'Metodická poznámka', text: 'Pro koho, jak dlouho, co fungovalo a na co si dát pozor.' }
        ]},
        { type: 'callout', tone: 'success', title: 'Výsledek pokročilého školení', text: 'Účastník umí používat ekosystém jako propojený pracovní postup, nikoli jako sbírku izolovaných aplikací.' }
      ]
    }
  ]
};
