export default {
  id: 'github',
  order: 3,
  code: 'GIT-01',
  title: 'GitHub bez strachu',
  shortTitle: 'GitHub',
  subtitle: 'Zveřejnění interaktivního HTML materiálu krok za krokem',
  category: 'Technický most',
  audience: 'Uživatelé Generátoru a LUDUS',
  duration: 65,
  level: 'Základní',
  required: false,
  accent: '#8db7ff',
  icon: './assets/brand/icon-192.png',
  prerequisites: ['start'],
  outcomes: [
    'Založíte přehledný repozitář pro výukové materiály.',
    'Aktivujete GitHub Pages z větve main.',
    'Nahrajete HTML soubor a získáte odkaz pro žáky.',
    'Aktualizujete materiál bez změny odkazu.'
  ],
  lessons: [
    {
      id: 'why',
      title: 'Proč GitHub používáme',
      kicker: 'SMYSL · 6 MIN',
      duration: 6,
      summary: 'GitHub uchovává soubory a GitHub Pages z nich vytvoří veřejně dostupnou statickou webovou stránku.',
      trainerNote: 'Nevysvětlujte Git ani práci v příkazové řádce. Pro základní školení je cílem pouze bezpečně zveřejnit hotový HTML soubor.',
      blocks: [
        { type: 'lead', text: 'Generátor testů a LUDUS mohou vytvořit samostatný interaktivní HTML soubor. GitHub Pages jej umí publikovat tak, aby žák otevřel odkaz přímo v prohlížeči bez instalace.' },
        { type: 'cards', columns: 3, items: [
          { icon: '▣', title: 'Repozitář', text: 'Online složka se soubory a historií změn.' },
          { icon: '↻', title: 'Commit', text: 'Uložená změna s krátkým popisem.' },
          { icon: '↗', title: 'GitHub Pages', text: 'Veřejná adresa, na které se HTML spustí jako web.' }
        ]},
        { type: 'callout', tone: 'danger', title: 'Nikdy na GitHub nedávejte tajné údaje', text: 'Do veřejného ani soukromého repozitáře nevkládejte API klíče, hesla, osobní údaje žáků ani přístupové soubory AI Studia.' }
      ]
    },
    {
      id: 'account',
      title: 'Účet a nový repozitář',
      kicker: 'JEDNORÁZOVÉ NASTAVENÍ · 12 MIN',
      duration: 12,
      summary: 'Účet a repozitář se zakládají jednou. Název účtu i repozitáře se stanou součástí budoucích odkazů.',
      trainerNote: 'Doporučte profesionální uživatelské jméno bez diakritiky. Upozorněte, že materiály na GitHub Pages jsou veřejně dostupné.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Založte nebo otevřete účet na github.com', text: 'Použijte profesionální uživatelské jméno bez diakritiky. Dokončete ověření e-mailu.' },
          { title: 'Zvolte New repository', text: 'Repozitář pojmenujte například interaktivni-materialy nebo vyukove-hry.' },
          { title: 'Použijte název bez diakritiky a mezer', text: 'Pro oddělení slov používejte pomlčky.' },
          { title: 'Nastavte Public', text: 'U běžného bezplatného použití musí být zdroj pro veřejné GitHub Pages veřejný. Citlivý obsah do něj proto nepatří.' },
          { title: 'Přidejte README a vytvořte repozitář', text: 'README stručně vysvětluje účel repozitáře.' }
        ]},
        { type: 'checklist', title: 'Dobré názvy', items: ['interaktivni-testy', 'vyukove-hry', 'materialy-anglictina', 'materialy-dejepis'] },
        { type: 'callout', tone: 'warning', title: 'Veřejné neznamená doporučené ke sdílení všeho', text: 'GitHub Pages je vhodný pro hotové anonymní výukové materiály. Není vhodný pro seznamy žáků, výsledky testů ani interní dokumenty.' }
      ]
    },
    {
      id: 'pages',
      title: 'Aktivace GitHub Pages',
      kicker: 'PUBLIKOVÁNÍ · 10 MIN',
      duration: 10,
      summary: 'GitHub Pages lze publikovat z vybrané větve a složky. Pro tento projekt používáme větev main a kořen repozitáře.',
      trainerNote: 'Rozhraní může skrýt Settings do rozbalovací nabídky na menší obrazovce. Ukažte i tuto variantu.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Otevřete Settings repozitáře', text: 'Pokud záložku nevidíte, může být v rozbalovací nabídce.' },
          { title: 'V levém menu zvolte Pages', text: 'Sekce je obvykle pod Code and automation.' },
          { title: 'Nastavte Source: Deploy from a branch', text: 'Pro jednoduchý statický web není potřeba vlastní build.' },
          { title: 'Vyberte branch main a folder /(root)', text: 'Potvrďte tlačítkem Save.' },
          { title: 'Vyčkejte na první nasazení', text: 'Stav lze zkontrolovat na stránce Pages nebo v záložce Actions.' }
        ]},
        { type: 'callout', tone: 'info', title: 'Technická poznámka', text: 'Tento školící portál i exportované materiály jsou statické HTML, CSS a JavaScript soubory. GitHub Pages je pro tento typ obsahu přímo určen.' }
      ]
    },
    {
      id: 'upload',
      title: 'Nahrání prvního HTML souboru',
      kicker: 'PRAKTICKÝ POSTUP · 12 MIN',
      duration: 12,
      summary: 'Hotový export nahrajete přes webové rozhraní a změnu uložíte jako commit.',
      trainerNote: 'Připravte každému účastníkovi malý testovací HTML soubor, aby školení nezáviselo na předchozí práci v aplikaci.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Otevřete správný repozitář', text: 'Před nahráním zkontrolujte název a vlastníka.' },
          { title: 'Zvolte Add file → Upload files', text: 'Soubor lze přetáhnout do označené oblasti nebo vybrat z disku.' },
          { title: 'Použijte bezpečný název souboru', text: 'Například fractions-practice-1.html. Vyhněte se diakritice a mezerám.' },
          { title: 'Napište srozumitelný commit message', text: 'Například Přidán test zlomky – základní verze.' },
          { title: 'Potvrďte Commit changes', text: 'Po uložení vyčkejte na nové nasazení GitHub Pages.' }
        ]},
        { type: 'callout', tone: 'warning', title: 'Limity webového nahrávání', text: 'GitHub omezuje velikost jednotlivých souborů a počet souborů nahrávaných najednou. Běžný samostatný HTML materiál je však zpravidla výrazně menší.' }
      ]
    },
    {
      id: 'link',
      title: 'Odkaz pro žáky',
      kicker: 'SDÍLENÍ · 10 MIN',
      duration: 10,
      summary: 'Projektový odkaz má stálou strukturu. Pro každý materiál se mění pouze název souboru.',
      trainerNote: 'Nechte kolegy adresu sami sestavit a otevřít v anonymním okně. Tím ověří, že není závislá na jejich přihlášení.',
      blocks: [
        { type: 'code', label: 'Vzorec projektového odkazu', code: 'https://uzivatelske-jmeno.github.io/nazev-repozitare/nazev-souboru.html' },
        { type: 'code', label: 'Příklad', code: 'https://novakova-aj.github.io/interaktivni-testy/unit-4-food.html' },
        { type: 'checklist', title: 'Před odesláním odkazu', items: ['Otevřu odkaz v novém nebo anonymním okně.', 'Zkontroluji obsah a správnou verzi.', 'Ověřím, že soubor neobsahuje osobní údaje ani API klíč.', 'Vyzkouším materiál alespoň na počítači a telefonu.'] },
        { type: 'quiz', question: 'Který odkaz typicky spustí stránku přes GitHub Pages?', options: ['https://github.com/uzivatel/repozitar/soubor.html', 'https://uzivatel.github.io/repozitar/soubor.html', 'file:///C:/Downloads/soubor.html', 'https://api.github.com/soubor.html'], answer: 1, explanation: 'Adresa GitHub Pages používá doménu uzivatel.github.io.' }
      ]
    },
    {
      id: 'update',
      title: 'Aktualizace bez změny odkazu',
      kicker: 'BĚŽNÁ ÚDRŽBA · 10 MIN',
      duration: 10,
      summary: 'Když nová verze zachová stejný název a umístění souboru, odkaz pro žáky zůstane stejný.',
      trainerNote: 'Zdůrazněte, že po nasazení může prohlížeč krátce zobrazovat starší verzi. Pomůže tvrdé obnovení nebo otevření v anonymním okně.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Exportujte opravenou verzi se stejným názvem', text: 'Název musí přesně odpovídat původnímu souboru.' },
          { title: 'Nahrajte ji do stejného místa repozitáře', text: 'GitHub změnu rozpozná jako aktualizaci existujícího souboru.' },
          { title: 'Popište opravu v commit message', text: 'Například Opraven klíč u otázky 6.' },
          { title: 'Počkejte na dokončení nasazení', text: 'Odkaz se nemění. Po nasazení zkontrolujte novou verzi.' }
        ]},
        { type: 'activity', title: 'Zkušební aktualizace', brief: 'Proveďte drobnou změnu v testovacím souboru a publikujte ji pod stejným názvem.', steps: ['Upravte nadpis nebo jednu větu.', 'Nahrajte soubor znovu.', 'Sledujte stav nasazení.', 'Otevřete původní odkaz a ověřte změnu.'], output: 'Aktualizovaný materiál dostupný na stejném odkazu.' },
        { type: 'callout', tone: 'success', title: 'Připraveno pro aplikace', text: 'Po zvládnutí tohoto modulu můžete pokračovat Generátorem interaktivních testů nebo LUDUSem.' }
      ]
    }
  ]
};
