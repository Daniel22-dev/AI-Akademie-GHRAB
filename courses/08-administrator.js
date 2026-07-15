export default {
  id: 'administrator',
  order: 9,
  code: 'ADM-01',
  title: 'Mentor a správce školení',
  shortTitle: 'Správa',
  subtitle: 'Vydávání přístupů, evidence, podpora kolegů a bezpečný provoz',
  category: 'Správa projektu',
  audience: 'Správce AI Studia a školitelé',
  duration: 100,
  reserve: 0,
  level: 'Administrátorské',
  required: false,
  accent: '#ff8f9a',
  icon: './assets/course-icons/administrator.png',
  prerequisites: ['start'],
  outcomes: [
    'Naplánujete logickou vzdělávací cestu pro různé skupiny učitelů.',
    'Vydáte podepsané oprávnění pouze pro absolvované aplikace.',
    'Vedete místní evidenci a umíte přístup zneplatnit.',
    'Nastavíte podporu, zpětnou vazbu a provozní rytmus projektu.'
  ],
  lessons: [
    {
      id: 'role',
      title: 'Role školitele a správce',
      kicker: 'ODPOVĚDNOST · 10 MIN',
      duration: 10,
      summary: 'Školitel vysvětluje pedagogické použití a ověřuje základní kompetenci. Správce vydává oprávnění, vede evidenci a řeší provozní stav.',
      trainerNote: 'V malé pilotní fázi může obě role zastávat jedna osoba. Procesy je přesto vhodné pojmenovat odděleně.',
      blocks: [
        { type: 'showcase', label: 'ROLE SPRÁVCE', title: 'Správce neovládá kolegy — vytváří předvídatelný a bezpečný provoz', text: 'Tato cesta je samostatná a není povinným pokračováním běžného učitelského školení.', before: { label: 'CHAOTICKÝ PROVOZ', title: 'Přístupy a podpora bez evidence', items: ['není jasné, kdo má jaké oprávnění', 'chyby se řeší nahodile', 'aktualizace se předávají ústně'] }, after: { label: 'ŘÍZENÝ PROVOZ', title: 'Evidence, školení, podpora a audit', items: ['dohledatelné vydání přístupů', 'jasná cesta řešení problému', 'kontrolované nasazování verzí'] }, caption: 'Cílem je jednoduchost pro učitele a dostatek informací pro správce.' },
        { type: 'comparison', left: { title: 'Školitel', items: ['vede praktické školení', 'ověří zvládnutí bezpečnostních zásad', 'doporučí další vzdělávací větev', 'sbírá pedagogickou zpětnou vazbu'] }, right: { title: 'Správce', items: ['vydává a eviduje oprávnění', 'udržuje politiku přístupů', 'řeší revokace a technické chyby', 'koordinuje verze a nasazení'] } },
        { type: 'callout', tone: 'info', title: 'Přístup není odměna za účast', text: 'Oprávnění potvrzuje, že uživatel zná základní pracovní a bezpečnostní postup konkrétní aplikace.' }
      ]
    },
    {
      id: 'learning-path',
      title: 'Plán vzdělávací cesty',
      kicker: 'MODULÁRNÍ SYSTÉM · 12 MIN',
      duration: 12,
      summary: 'Všichni absolvují společný základ. Další moduly se vybírají podle skutečné potřeby a předmětu.',
      trainerNote: 'Nevytvářejte povinný maraton všech aplikací. Krátká relevantní školení mají vyšší šanci na skutečné používání.',
      blocks: [
        { type: 'flow', items: [
          { number: 'A', title: 'Společný základ', text: 'Přístup, API klíč, bezpečnost a řešení problémů.' },
          { number: 'B', title: 'Univerzální praxe', text: 'Diferenciátor jako první hmatatelný výsledek.' },
          { number: 'C', title: 'Volitelné větve', text: 'Interaktivní materiály, komunikace nebo hodnocení.' },
          { number: 'D', title: 'Pokročilé propojení', text: 'Workflow a mentorské kompetence.' }
        ]},
        { type: 'table', headers: ['Profil kolegy', 'Doporučená cesta'], rows: [
          ['Chce jen bezpečně začít', 'Start → Diferenciátor'],
          ['Chce tvořit interaktivní testy', 'Start → GitHub → Generátor'],
          ['Chce hry do výuky', 'Start → GitHub → LUDUS'],
          ['Řeší školní komunikaci', 'Start → Korespondenční asistent'],
          ['Hodnotí maturitní slohy AJ', 'Start → Hodnotitel'],
          ['Bude školit ostatní', 'Relevantní aplikace → Workflow → Mentor a správce']
        ]}
      ]
    },
    {
      id: 'issue-access',
      title: 'Vydání podepsaného přístupu',
      kicker: 'ADMINISTRÁTORSKÝ NÁSTROJ · 18 MIN',
      duration: 18,
      summary: 'Správce načte soukromý podpisový klíč pouze na důvěryhodném zařízení, vybere uživatele, aplikace a dobu platnosti a vytvoří podepsaný soubor nebo kód.',
      trainerNote: 'Tento postup provádějte bez sdílení obrazovky v části, kde je viditelný soukromý klíč. Používejte pouze vlastní důvěryhodné zařízení.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Otevřete administrátorský nástroj Vydání přístupu', text: 'Nástroj pracuje lokálně v prohlížeči.' },
          { title: 'Načtěte soukromý podpisový klíč', text: 'Klíč nesmí být uložen v repozitáři, e-mailu ani sdíleném disku.' },
          { title: 'Vyplňte konkrétního uživatele', text: 'Použijte jednoznačné jméno pro místní evidenci.' },
          { title: 'Vyberte pouze absolvované aplikace', text: 'Například po DIF-01 pouze Diferenciátor, nikoli automaticky celý ekosystém.' },
          { title: 'Nastavte přiměřenou platnost', text: 'Dodržte maximální dobu povolenou politikou Studia.' },
          { title: 'Vygenerujte soubor nebo kód', text: 'Současně se uloží záznam do místní Evidence přístupů.' },
          { title: 'Předejte oprávnění konkrétnímu kolegovi', text: 'Použijte bezpečný a dohodnutý kanál.' }
        ]},
        { type: 'callout', tone: 'danger', title: 'Soukromý klíč je nejcitlivější soubor systému', text: 'Nikdy jej neposílejte, nevkládejte do cloudu bez odpovídající ochrany a nepoužívejte na nedůvěryhodném zařízení.' }
      ]
    },
    {
      id: 'registry',
      title: 'Evidence a revokace',
      kicker: 'ŽIVOTNÍ CYKLUS PŘÍSTUPU · 15 MIN',
      duration: 15,
      summary: 'Evidence uchovává jméno, oprávnění, platnost a identifikátor přístupu. Neuchovává soukromý klíč ani dlouhý přístupový kód.',
      trainerNote: 'Předveďte revokaci na testovacím oprávnění. Uživatel musí pochopit, že revokovaný přístup může být zneplatněn centrálním seznamem.',
      blocks: [
        { type: 'cards', columns: 4, items: [
          { icon: 'ID', title: 'Uživatel', text: 'Komu bylo oprávnění vydáno.' },
          { icon: 'APP', title: 'Rozsah', text: 'Které aplikace a role obsahuje.' },
          { icon: 'CAL', title: 'Platnost', text: 'Od kdy do kdy je oprávnění použitelné.' },
          { icon: 'JTI', title: 'Identifikátor', text: 'Jedinečný údaj pro evidenci a zneplatnění.' }
        ]},
        { type: 'steps', items: [
          { title: 'Označte ztracený nebo zneužitý přístup', text: 'V evidenci vyhledejte správný záznam.' },
          { title: 'Přidejte jej do revokačního seznamu', text: 'Uveďte důvod a datum podle provozního postupu.' },
          { title: 'Exportujte aktualizovaný revoked-access.json', text: 'Soubor nahraďte v konfiguraci AI Studia.' },
          { title: 'Nasaďte změnu a ověřte stav', text: 'Po aktualizaci se revokovaný přístup nesmí ověřit jako platný.' }
        ]},
        { type: 'callout', tone: 'warning', title: 'Evidence není centrální databáze', text: 'V serverless fázi je evidence místní. Je potřeba mít bezpečný provozní postup pro zálohu a práci na určeném zařízení.' }
      ]
    },
    {
      id: 'delivery',
      title: 'Jak vést kvalitní školení',
      kicker: 'METODIKA ŠKOLITELE · 15 MIN',
      duration: 15,
      summary: 'Úspěšné školení je praktická dílna s jedním dokončeným výstupem. Technické minimum se vysvětluje v okamžiku, kdy je potřeba.',
      trainerNote: 'Tato část je určena budoucím mentorům. U základního školitele ji lze využít jako interní checklist.',
      blocks: [
        { type: 'flow', items: [
          { number: '1', title: 'Ukázka výsledku', text: 'Nejdříve ukažte, co si účastník odnese.' },
          { number: '2', title: 'Krátké vysvětlení', text: 'Pouze nezbytný princip a bezpečnostní pravidlo.' },
          { number: '3', title: 'Společný postup', text: 'Jedna ukázka krok za krokem.' },
          { number: '4', title: 'Vlastní tvorba', text: 'Účastník pracuje se svým reálným podkladem.' },
          { number: '5', title: 'Kontrola a výstup', text: 'Každý odchází s hotovým výsledkem a dalším krokem.' }
        ]},
        { type: 'checklist', title: 'Příprava školitele', items: ['Testovací účty a oprávnění jsou připravené.', 'Máte záložní fiktivní materiál.', 'Odkazy a aplikace jsou ověřené na školní síti.', 'Je jasné, co účastníci potřebují přinést.', 'Máte postup pro časté chyby.', 'Školení má čas na samostatnou práci.', 'Na konci se sbírá konkrétní zpětná vazba.'] }
      ]
    },
    {
      id: 'support',
      title: 'Podpora po školení',
      kicker: 'UDRŽITELNÝ PROVOZ · 15 MIN',
      duration: 15,
      summary: 'Jednorázové školení nestačí. Projekt potřebuje jednoduchý kanál podpory, pravidelnou zpětnou vazbu a jasné rozlišení pedagogické a technické chyby.',
      trainerNote: 'Neslibujte nepřetržitou individuální podporu. Nastavte konkrétní okno, formulář nebo společné konzultační termíny.',
      blocks: [
        { type: 'comparison', left: { title: 'Pedagogický dotaz', items: ['Jaký režim zvolit?', 'Je výstup přiměřený?', 'Jak diferencovat bez snížení cíle?', 'Jak aktivitu zařadit do hodiny?'] }, right: { title: 'Technický problém', items: ['Aplikace je zamčená', 'API klíč je odmítnut', 'GitHub Pages se nenasadil', 'Export se neotevře nebo nefunguje'] } },
        { type: 'cards', columns: 3, items: [
          { icon: '1', title: 'Jedno místo', text: 'Odkaz na Akademii, návody, změny a kontaktní postup.' },
          { icon: '2', title: 'Strukturované hlášení', text: 'Aplikace, krok, chybová zpráva, zařízení a případně diagnostický report.' },
          { icon: '3', title: 'Pravidelný rytmus', text: 'Krátké konzultace, ukázky dobré praxe a cílená navazující školení.' }
        ]},
        { type: 'callout', tone: 'success', title: 'Cíl správy', text: 'Kolegové mají jasnou cestu od prvního školení k samostatnému používání a správce má přehled o oprávněních, chybách a skutečných potřebách.' }
      ]
    },
    {
      id: 'audit',
      title: 'Provozní kontrola projektu',
      kicker: 'PRAVIDELNÝ AUDIT · 15 MIN',
      duration: 15,
      summary: 'Správce pravidelně kontroluje dostupnost aplikací, verze, školení, přístupy, bezpečnostní pravidla a zpětnou vazbu uživatelů.',
      trainerNote: 'Nastavte jednoduchý měsíční nebo čtvrtletní checklist. Audit nemá být byrokracie, ale prevence ztráty kontroly.',
      blocks: [
        { type: 'checklist', title: 'Pravidelná kontrola', items: ['Všechny veřejné odkazy fungují.', 'AI Studio načítá aktuální verze aplikací.', 'Školicí obsah odpovídá aktuálním rozhraním.', 'Revokační seznam je aktuální.', 'Soukromé klíče nejsou ve veřejných úložištích.', 'Chybová hlášení jsou vyřešena nebo evidována.', 'Je jasné, které aplikace jsou v pilotu a které v ostrém provozu.', 'Změny jsou komunikovány uživatelům.'] },
        { type: 'activity', title: 'Nastavte první pilotní cyklus', brief: 'Naplánujte prvních šest až osm týdnů projektu.', steps: ['Vyberte první skupinu kolegů.', 'Naplánujte Start a Diferenciátor.', 'Připravte vydání oprávnění.', 'Zvolte jeden kanál podpory.', 'Určete, jak budete sbírat zpětnou vazbu.', 'Naplánujte první provozní kontrolu.'], output: 'Realistický pilotní plán s jasnými rolemi a kontrolními body.' }
      ]
    }
  ]
};
