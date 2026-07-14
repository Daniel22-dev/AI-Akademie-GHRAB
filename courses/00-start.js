export default {
  id: 'start',
  order: 1,
  code: 'START-01',
  title: 'První bezpečný vstup',
  shortTitle: 'Start',
  subtitle: 'Přístup, API klíč a bezpečnost bez technického chaosu',
  category: 'Společný základ',
  audience: 'Všichni učitelé',
  duration: 55,
  level: 'Začátečník',
  required: true,
  accent: '#50e8ff',
  icon: './assets/brand/brand-mark.svg',
  prerequisites: [],
  outcomes: [
    'Rozlišíte odkaz na Studio, školní oprávnění a API klíč.',
    'Aktivujete osobní přístup vydaný správcem.',
    'Bezpečně vytvoříte nebo zobrazíte vlastní Gemini API klíč.',
    'Poznáte, která data do AI nástrojů nepatří.'
  ],
  lessons: [
    {
      id: 'orientation',
      title: 'Co je AI Studio GHRAB',
      kicker: 'ÚVOD · 5 MIN',
      duration: 5,
      summary: 'Studio je řízený rozcestník samostatných školních aplikací. Odkaz do Studia sám o sobě žádnou aplikaci neodemkne.',
      trainerNote: 'Začněte praktickým příkladem: ukažte kolegům kartu zamčené aplikace. Tím hned odstraníte očekávání, že samotný odkaz znamená přístup ke všemu.',
      blocks: [
        { type: 'lead', text: 'AI Studio GHRAB není jedna univerzální aplikace. Je to bezpečný vstupní portál, který propojuje samostatné nástroje a kontroluje, ke kterým z nich má konkrétní učitel oprávnění.' },
        { type: 'cards', columns: 3, items: [
          { icon: '⌁', title: 'Jeden vstup', text: 'Kolega si uloží jediný odkaz na AI Studio a odtud otevírá dostupné aplikace.' },
          { icon: '◇', title: 'Řízený přístup', text: 'Každá aplikace se odemkne až po absolvování příslušného školení a vydání oprávnění.' },
          { icon: '⬡', title: 'Samostatné nástroje', text: 'Diferenciátor, Generátor, LUDUS i další aplikace mají vlastní účel a pracovní postup.' }
        ]},
        { type: 'callout', tone: 'warning', title: 'Nejdůležitější věta prvního školení', text: 'Odkaz na AI Studio otevře portál. Aplikaci ale zpřístupní až platné osobní oprávnění vydané správcem.' }
      ]
    },
    {
      id: 'three-keys',
      title: 'Tři podmínky spuštění',
      kicker: 'LOGIKA SYSTÉMU · 7 MIN',
      duration: 7,
      summary: 'Pro spuštění aplikace musí být splněny tři oddělené podmínky. Když jedna chybí, systém nefunguje správně.',
      trainerNote: 'Použijte přirovnání k budově: adresa školy, vstupní karta a energie pro konkrétní zařízení.',
      blocks: [
        { type: 'flow', items: [
          { number: '01', title: 'Odkaz na Studio', text: 'Řekne prohlížeči, kam má jít. Je stejný pro všechny.' },
          { number: '02', title: 'Školní oprávnění', text: 'Určí, které aplikace smí konkrétní kolega otevřít.' },
          { number: '03', title: 'API klíč', text: 'Umožní konkrétní aplikaci využít model Gemini pro generování.' }
        ]},
        { type: 'comparison', left: { title: 'Školní oprávnění', items: ['Vydává správce AI Studia', 'Odemkne konkrétní aplikace', 'Je digitálně podepsané', 'Zůstává v daném prohlížeči'] }, right: { title: 'API klíč', items: ['Vytváří si každý uživatel u Googlu', 'Autorizuje požadavky na Gemini API', 'Je osobní a tajný', 'Nesmí být sdílen ani uložen na GitHub'] } },
        { type: 'quiz', question: 'Kolega otevře AI Studio, ale Diferenciátor je zamčený. Co je nejpravděpodobnější příčina?', options: ['Nemá založený GitHub účet.', 'Nemá aktivované oprávnění pro Diferenciátor.', 'Nemá v počítači nainstalovaný program Gemini.', 'Používá příliš nový prohlížeč.'], answer: 1, explanation: 'Přístup do portálu a oprávnění ke konkrétní aplikaci jsou dvě různé věci.' }
      ]
    },
    {
      id: 'access',
      title: 'Aktivace osobního přístupu',
      kicker: 'PRAKTICKÝ POSTUP · 10 MIN',
      duration: 10,
      summary: 'Po školení obdrží kolega podepsaný soubor nebo textový kód. Studio jej ověří přímo v prohlížeči.',
      trainerNote: 'Přístupové soubory rozdejte až ve chvíli, kdy mají všichni otevřenou stránku Můj přístup. Nevysvětlujte kryptografii do hloubky; stačí princip ověření podpisu.',
      blocks: [
        { type: 'steps', items: [
          { title: 'Otevřete AI Studio GHRAB', text: 'V horní navigaci zvolte Můj přístup.' },
          { title: 'Vyberte způsob aktivace', text: 'Nejjednodušší je načíst soubor s příponou .ghrab-access.json. Záložní možností je vložit textový kód začínající ghrab1…' },
          { title: 'Klikněte na Ověřit a aktivovat', text: 'Studio ověří digitální podpis, dobu platnosti a seznam povolených aplikací.' },
          { title: 'Zkontrolujte přehled oprávnění', text: 'U každé aplikace musí být jasně uvedeno, zda je odemčená nebo vyžaduje další školení.' },
          { title: 'Vraťte se na hlavní stránku', text: 'Karta povolené aplikace už nebude zamčená.' }
        ]},
        { type: 'callout', tone: 'success', title: 'Soukromí přístupového souboru', text: 'Ověření probíhá lokálně v prohlížeči. Soubor ani jeho obsah se při aktivaci neposílají na server.' },
        { type: 'callout', tone: 'info', title: 'Přístup je uložen v konkrétním prohlížeči', text: 'Na jiném počítači, v jiném profilu nebo po smazání dat prohlížeče může být nutná nová aktivace stejného oprávnění.' }
      ]
    },
    {
      id: 'api-key',
      title: 'Gemini API klíč krok za krokem',
      kicker: 'GOOGLE AI STUDIO · 13 MIN',
      duration: 13,
      summary: 'API klíč je osobní přístupový údaj pro Gemini API. Novému uživateli může Google AI Studio po přijetí podmínek vytvořit výchozí projekt a klíč automaticky.',
      trainerNote: 'Rozhraní Google AI Studio se může měnit. Vždy zdůrazněte cíl postupu: Dashboard → API Keys. Pevná čísla limitů neuvádějte; mění se podle modelu a účtu.',
      blocks: [
        { type: 'lead', text: 'Aplikace AI Studia GHRAB používají modely Gemini. Aby Google věděl, ke kterému účtu se požadavky vztahují, každý učitel používá svůj vlastní API klíč.' },
        { type: 'steps', items: [
          { title: 'Přihlaste se na aistudio.google.com', text: 'Použijte Google účet, který smíte pro tento účel využívat. U školního účtu může správce organizace některé funkce omezit.' },
          { title: 'Otevřete Dashboard a API Keys', text: 'Novému uživateli může být výchozí projekt a klíč vytvořen automaticky. V takovém případě stačí existující klíč zkopírovat.' },
          { title: 'Když klíč nevidíte, vytvořte jej', text: 'Zvolte Create API key. U existujícího Google Cloud účtu může být nejprve potřeba importovat projekt nebo vytvořit nový projekt.' },
          { title: 'Zkopírujte celý klíč', text: 'Nevynechejte žádný znak a nepřidávejte mezery.' },
          { title: 'Vložte klíč pouze do aplikace', text: 'Aplikace jej uloží lokálně do vašeho prohlížeče. Klíč nevkládejte do e-mailu, Teams, sdíleného dokumentu ani repozitáře.' }
        ]},
        { type: 'callout', tone: 'warning', title: 'Bezplatná úroveň není univerzální slib', text: 'Google nabízí bezplatnou úroveň pro vybrané modely, ale dostupnost modelů a limity se mohou měnit. Aktuální limity je potřeba kontrolovat přímo v AI Studiu.' },
        { type: 'callout', tone: 'info', title: 'Používejte aktuální klíč vytvořený v AI Studiu', text: 'Google v roce 2026 přechází na bezpečnější autorizační klíče. Nové klíče se v AI Studiu vytvářejí v aktuálním formátu; u staršího klíče postupujte podle případné výzvy k migraci.' },
        { type: 'callout', tone: 'danger', title: 'Klíč chraňte jako heslo', text: 'Při podezření na únik klíč deaktivujte nebo smažte a vytvořte nový. Nikdy jej neukládejte do veřejného GitHub repozitáře.' }
      ]
    },
    {
      id: 'safety',
      title: 'Bezpečnostní minimum',
      kicker: 'DATA A ODPOVĚDNOST · 8 MIN',
      duration: 8,
      summary: 'AI pomáhá učiteli, ale nenahrazuje jeho odborný úsudek. Osobní údaje žáků je potřeba před použitím odstranit.',
      trainerNote: 'U citlivých příkladů pracujte výhradně s fiktivními daty. Nechte kolegy sami pojmenovat rizikové údaje.',
      blocks: [
        { type: 'comparison', left: { title: 'Do aplikace lze běžně vložit', items: ['anonymizovaný učební text', 'obecné zadání aktivity', 'ročník, úroveň a cíl hodiny', 'fiktivní modelovou situaci'] }, right: { title: 'Do aplikace nevkládejte', items: ['jméno a příjmení žáka', 'rodné číslo, adresu nebo kontakt', 'zdravotní či rodinné informace', 'neanonymizovanou kázeňskou nebo osobní komunikaci'] } },
        { type: 'cards', columns: 3, items: [
          { icon: '1', title: 'Anonymizovat', text: 'Odstranit identifikátory a detaily, podle nichž by šlo člověka poznat.' },
          { icon: '2', title: 'Zkontrolovat', text: 'Ověřit správnost, přiměřenost, jazyk i splnění zadání.' },
          { icon: '3', title: 'Rozhodnout', text: 'Za konečný materiál, hodnocení nebo odpověď odpovídá učitel.' }
        ]},
        { type: 'quiz', question: 'Který vstup je pro běžnou práci nejbezpečnější?', options: ['„Petr Novák z 2.B má dyslexii a potřebuje jednodušší text.“', '„Žák 2.B se specifickou poruchou učení potřebuje přehlednější verzi textu.“', 'Fotografie Bakalářů se seznamem třídy.', 'Přeposlaný e-mail rodiče včetně podpisu a telefonu.'], answer: 1, explanation: 'Pedagogický kontext zůstává zachován, ale identita konkrétního žáka není uvedena.' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'První kontrola a řešení problémů',
      kicker: 'DIAGNOSTIKA · 7 MIN',
      duration: 7,
      summary: 'Většinu potíží lze při prvním spuštění zařadit do jedné ze tří oblastí: přístup, API klíč nebo prohlížeč.',
      trainerNote: 'Tuto část nevynechávejte. Kolegům dává pocit, že případná chyba není selhání uživatele a že existuje jasný postup.',
      blocks: [
        { type: 'table', headers: ['Co vidím', 'Pravděpodobná příčina', 'Co udělám'], rows: [
          ['Aplikace je zamčená', 'Chybí nebo neobsahuje oprávnění', 'Otevřu Můj přístup a zkontroluji povolené aplikace.'],
          ['API key not valid', 'Neúplný, chybný nebo zrušený klíč', 'Zkopíruji celý klíč znovu nebo vytvořím nový.'],
          ['Quota / rate limit', 'Vyčerpaný nebo dočasně omezený limit', 'Zkontroluji aktuální limity v AI Studiu a zkusím požadavek později.'],
          ['Nic se neuloží', 'Soukromé okno nebo blokované úložiště', 'Použiji běžné okno a povolím lokální úložiště webu.'],
          ['Jiný počítač je znovu zamčený', 'Přístup se ukládá lokálně', 'Načtu přístupový soubor také v daném prohlížeči.']
        ]},
        { type: 'checklist', title: 'Před odchodem ze školení ověřte', items: ['Vidím v AI Studiu svůj aktivní přístup.', 'Mám odemčenou aplikaci určenou pro dnešní školení.', 'Mám vložený a ověřený API klíč.', 'Vím, kam hlásit technický problém.', 'Vím, která data nesmím do aplikací vkládat.'] },
        { type: 'callout', tone: 'success', title: 'Další krok', text: 'Po zvládnutí společného základu pokračujte školením Diferenciátor: první materiál. Je použitelné napříč předměty a přináší rychlý praktický výsledek.' }
      ]
    }
  ]
};
