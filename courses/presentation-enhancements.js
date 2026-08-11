export const courseEnhancements = {
  'ai-literacy': {
    minimumLessons: 5,
    finalMission: {
      type: 'mission',
      label: 'ZÁVĚREČNÝ ZÁVAZEK',
      title: 'Vyberte jeden bezpečný úkol pro příštích sedm dnů',
      brief: 'Napište si jednu konkrétní činnost, při níž AI otestujete jako pomocníka — a zároveň určete, jak výsledek ověříte.',
      time: '3 MIN',
      output: 'Jedna proveditelná situace z vlastní výuky a jeden kontrolní krok.'
    }
  },
  start: {
    minimumLessons: 5,
    layouts: { safety: 'safety-grid' },
    decisions: {
      safety: {
        type: 'decision',
        label: 'RYCHLÉ BEZPEČNOSTNÍ ROZHODNUTÍ',
        question: 'Obsahuje vstup údaj, podle něhož by šlo poznat konkrétního žáka, rodiče nebo kolegu?',
        options: [
          { title: 'Ano nebo si nejsem jistý', text: 'Vstup nevkládám. Nejprve odstraním jméno, třídu, diagnózu, kontakt i jedinečnou kombinaci okolností.' },
          { title: 'Ne', text: 'Pokračuji, ale po vygenerování stále kontroluji správnost, přiměřenost a splnění zadání.' }
        ]
      }
    },
    finalMission: {
      type: 'mission',
      label: 'KONTROLA PŘIPRAVENOSTI',
      title: 'Proveďte bezpečný start bez pomoci lektora',
      brief: 'Ověřte přístup, otevřete určenou aplikaci a vlastními slovy vysvětlete rozdíl mezi školním oprávněním a API klíčem.',
      time: '5 MIN',
      output: 'Funkční přístup a správně popsané bezpečnostní minimum.'
    }
  },
  differentiator: {
    minimumLessons: 4,
    finalMission: {
      type: 'mission',
      label: 'PŘENOS DO PRAXE',
      title: 'Naplánujte první skutečné použití',
      brief: 'Vyberte konkrétní materiál, třídu a rozdíl mezi základní a rozšiřující variantou. Nepopisujte obecný záměr — stanovte hotový výstup.',
      time: '4 MIN',
      output: 'Název materiálu, cílová skupina a dvě ověřitelné úpravy.'
    }
  },
  github: {
    minimumLessons: 5,
    finalMission: {
      type: 'mission',
      label: 'PUBLIKAČNÍ MISE',
      title: 'Ověřte celý řetězec od souboru k odkazu',
      brief: 'Nahrajte modelový HTML soubor, otevřete výsledný odkaz v anonymním okně a zkontrolujte, že neobsahuje citlivé údaje ani tajné klíče.',
      time: '7 MIN',
      output: 'Ověřený veřejný odkaz a pojmenovaná kontrola před sdílením.'
    }
  },
  generator: {
    minimumLessons: 5,
    layouts: { modes: 'showcase-grid', review: 'paired' },
    finalMission: {
      type: 'mission',
      label: 'PŘENOS DO VÝUKY',
      title: 'Určete, kdy test opravdu použijete',
      brief: 'Doplňte konkrétní třídu, termín, délku aktivity a způsob, jak předem ověříte odpovědi i technické fungování.',
      time: '4 MIN',
      output: 'Krátký plán nasazení hotového testu.'
    }
  },
  ludus: {
    minimumLessons: 5,
    layouts: { 'test-export': 'paired' },
    finalMission: {
      type: 'mission',
      label: 'PŘENOS DO VÝUKY',
      title: 'Naplánujte jednu herní misi bez samoúčelnosti',
      brief: 'Pojmenujte výukový cíl, okamžik v hodině a důkaz, podle něhož poznáte, že hra pomohla učení.',
      time: '4 MIN',
      output: 'Cíl, herní situace a jednoduchý způsob ověření přínosu.'
    }
  },
  correspondence: {
    minimumLessons: 5,
    layouts: { anonymisation: 'paired' },
    finalMission: {
      type: 'mission',
      label: 'KOMUNIKAČNÍ ZÁVAZEK',
      title: 'Připravte si vlastní bezpečný vzor',
      brief: 'Zvolte jednu opakující se školní situaci, odstraňte osobní údaje a připravte zadání, které vyžaduje věcnou, stručnou a diplomatickou variantu.',
      time: '5 MIN',
      output: 'Anonymizované zadání a jasná kritéria finální kontroly.'
    }
  },
  evaluator: {
    minimumLessons: 5,
    layouts: { export: 'export-review' },
    decisions: {
      privacy: {
        type: 'decision',
        label: 'PŘED NAHRÁNÍM PRÁCE',
        question: 'Je text skutečně anonymizovaný, nebo pouze zbavený jména?',
        options: [
          { title: 'Zůstávají identifikující detaily', text: 'Text ještě nevkládám. Odstraním třídu, podpis, kontakty i jedinečné osobní okolnosti.' },
          { title: 'Text je anonymní a mám rubriku', text: 'Mohu pokračovat. Výstup AI ale používám jen jako podklad a konečné hodnocení provádím podle zadané rubriky.' }
        ]
      }
    },
    finalMission: {
      type: 'mission',
      label: 'HODNOTICÍ ZÁVAZEK',
      title: 'Sepište vlastní kontrolní trojici',
      brief: 'Určete tři věci, které vždy ověříte před převzetím návrhu hodnocení: důkaz v textu, soulad s rubrikou a přiměřenost zpětné vazby.',
      time: '4 MIN',
      output: 'Tři osobní kontrolní otázky pro každé hodnocení.'
    }
  },
  workflow: {
    minimumLessons: 5,
    decisions: {
      decision: {
        type: 'decision',
        label: 'VOLBA DALŠÍHO NÁSTROJE',
        question: 'Co má být výsledkem dalšího kroku?',
        options: [
          { title: 'Více úrovní stejného materiálu', text: 'Pokračujte do Diferenciátoru a zachovejte společný zdroj i výukový cíl.' },
          { title: 'Samostatné procvičení nebo ověření', text: 'Použijte Generátor testů a nejprve určete typ úlohy a správné odpovědi.' },
          { title: 'Motivační herní aktivita', text: 'Použijte LUDUS až po vyjasnění cíle, obsahu a způsobu kontroly.' }
        ]
      }
    },
    finalMission: {
      type: 'mission',
      label: 'NÁVRH VLASTNÍHO ŘETĚZCE',
      title: 'Propojte dvě aplikace jedním společným zdrojem',
      brief: 'Nakreslete jednoduchý tok: vstupní materiál → první aplikace → kontrolní bod → druhá aplikace → finální výstup.',
      time: '6 MIN',
      output: 'Pětikrokový pracovní postup včetně místa, kde výsledek kontroluje člověk.'
    }
  },
  administrator: {
    minimumLessons: 5,
    layouts: { audit: 'paired' },
    finalMission: {
      type: 'mission',
      label: 'SPRÁVCOVSKÝ ZÁVAZEK',
      title: 'Určete jeden standard, který zavedete jako první',
      brief: 'Vyberte jedinou konkrétní oblast — přístupy, evidenci verzí, podporu nebo školení — a stanovte vlastníka, termín a důkaz splnění.',
      time: '5 MIN',
      output: 'Jedna odpovědnost, jedno datum a jeden kontrolovatelný výsledek.'
    }
  }
};
