export const verification = {
  'quick-studio': { trainingVersion: '1.0-pilot', reviewStatus: 'pilot', target: 'AI Studio – první přístup', appVersion: '0.21.196', verifiedAt: '8. 10. 2026', sourceRepo: 'Daniel22-dev/AI-Studio-GHRAB' },
  'quick-api': { trainingVersion: '1.0-pilot', reviewStatus: 'pilot', target: 'AI Studio – AI připojení', appVersion: '0.21.196', verifiedAt: '8. 10. 2026', sourceRepo: 'Daniel22-dev/AI-Studio-GHRAB' },
  'quick-git': { trainingVersion: '1.0-pilot', reviewStatus: 'pilot', target: 'GIT – první test', appVersion: '7.1.99', verifiedAt: '8. 10. 2026', sourceRepo: 'Daniel22-dev/generator-testu' },
  'ai-literacy': { trainingVersion: '2.0', target: 'AI Studio', appVersion: '0.21.133', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/AI-Studio-GHRAB' },
  differentiator: { trainingVersion: '2.0', target: 'Diferenciátor', appVersion: '1.3.50', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/diferenciator' },
  generator: { trainingVersion: '2.0', target: 'Generátor interaktivních testů', appVersion: '7.1.59', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/generator-testu' },
  ludus: { trainingVersion: '2.0', target: 'LUDUS', appVersion: '1.16.30', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/Ludus' },
  correspondence: { trainingVersion: '2.0', target: 'Korespondenční asistent', appVersion: '5.10.32', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/korespondencni-asistent' },
  evaluator: { trainingVersion: '2.0', target: 'Hodnotitel maturitních slohů', appVersion: '1.5.30', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/Hodnotitel-maturitnich-slohu' },
  activa: { trainingVersion: '1.0', target: 'ACTIVA', appVersion: '0.5.30', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/ACTIVA' },
  sortio: { trainingVersion: '1.0', target: 'SORTIO', appVersion: '1.1.22', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/SORTIO' },
  'lesson-hub': { trainingVersion: '1.0', target: 'Lesson Hub', appVersion: '1.2.26', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/lesson-hub' },
  'maturita-desk': { trainingVersion: '1.0', target: 'Maturita Desk', appVersion: '1.0.6', verifiedAt: '30. 9. 2026', sourceRepo: 'Daniel22-dev/maturita-desk' },
  github: { trainingVersion: '2.0', target: 'GitHub Pages', appVersion: null, verifiedAt: '30. 9. 2026', sourceRepo: null },
  workflow: { trainingVersion: '2.0', target: 'Propojený workflow', appVersion: null, verifiedAt: '30. 9. 2026', sourceRepo: null },
  administrator: { trainingVersion: '2.0', target: 'Správa školení', appVersion: null, verifiedAt: '30. 9. 2026', sourceRepo: null }
};

const commonTeacherDecision = [
  'AI nebo aplikace připraví návrh; učitel zkontroluje správnost a vhodnost.',
  'Učitel zná konkrétní třídu, cíl a kontext lépe než nástroj.',
  'Výstup se použije až ve chvíli, kdy je učitel ochoten za něj profesně převzít odpovědnost.'
];

const handout = (title, purpose, workflow, checks, safety = []) => ({
  title,
  purpose,
  workflow,
  checks,
  safety,
  teacherDecision: commonTeacherDecision,
  footer: 'AI pomáhá. Učitel kontroluje. Učitel rozhoduje.'
});

export const handouts = {
  'ai-literacy': handout(
    'Vstupní školení: AI + AI Studio',
    'Bezpečný a praktický základ pro práci s generativní AI a aplikacemi AI Studia.',
    ['Prompt: cíl → kontext → omezení → požadovaný výstup.', 'Před odesláním vstup očisti od zbytečných identifikátorů.', 'AI výstup ověř a uprav.', 'V AI Studiu vyber specializovanou aplikaci podle konkrétního úkolu.'],
    ['Je výstup fakticky správný?', 'Odpovídá tomu, co bylo skutečně probráno?', 'Je přiměřený konkrétní skupině?', 'Jsem ochoten se pod výstup podepsat?'],
    ['Do ukázek používej fiktivní nebo anonymizované podklady.', 'AI Studio je kontrolovanější prostředí, nikoli výjimka z pravidel pro osobní a citlivé údaje.']
  ),
  differentiator: handout('Diferenciátor','Z jednoho výchozího materiálu připravit různé cesty ke stejnému výukovému cíli.',['Připrav ověřený podklad a společný cíl.','Zvol míru podpory / samostatnosti / rozšíření.','Vygeneruj varianty.','Porovnej jejich ekvivalenci a uprav.','Exportuj až po kontrole.'],['Zůstal zachován společný cíl?','Není podpůrná varianta jen mechanicky zkrácená?','Je rozšiřující varianta náročnější myšlením, ne jen objemem?']),
  generator: handout('Generátor interaktivních testů','Vytvořit procvičování nebo test z jasně vymezeného obsahu a bezpečně jej nasadit.',['Zvol účel a režim.','Dodej zdroj, úroveň a cíl.','Vyber typy úloh, varianty a bodování.','Projdi výstup v Test Labu jako žák.','Exportuj až po kontrole klíče a technického průchodu.'],['Sedí všechny správné odpovědi?','Odpovídá test probrané látce?','Je čas a obtížnost realistická?','Funguje export na cílovém zařízení?']),
  ludus: handout('LUDUS','Převést učivo do herní aktivity bez ztráty vzdělávacího cíle.',['Urči výukový cíl.','Vyber mechaniku, která cíli pomáhá.','Doplň ověřený obsah.','Otestuj hru v učitelském režimu.','Teprve potom ji nasaď ve třídě.'],['Je hra prostředek, ne cíl?','Jsou otázky a zpětná vazba správné?','Je průběh organizovatelný v reálné hodině?']),
  correspondence: handout('Korespondenční asistent','Připravit profesionální školní komunikaci s kontrolou tónu, faktů a soukromí.',['Nejdřív anonymizuj vstup.','Rozliš rozbor, odpověď nebo nový e-mail.','Nech si navrhnout vhodné varianty.','Zkontroluj fakta, tón a další krok.','Odešli až po vlastním přečtení.'],['Jsou fakta přesná?','Je tón přiměřený vztahu a situaci?','Nezůstaly v textu citlivé údaje?','Je jasné, co má příjemce udělat?'],['Velmi citlivé, právní, zdravotní nebo akutní situace neřeš pouhým generováním e-mailu.']),
  evaluator: handout('Hodnotitel maturitních slohů','Podpořit systematické hodnocení podle pevné rubriky; AI je druhý pár očí, ne konečný verdikt.',['Připrav anonymizovaný text a správné zadání.','Spusť analýzu podle rubriky.','Zkontroluj důkazy a případné FAIL podmínky.','Proveď učitelskou revizi.','Schval a exportuj až po kontrole.'],['Je každý závěr opřen o text?','Odpovídají body přesně rubrice?','Byly zohledněny všechny podmínky neúspěchu?','Je výsledná zpětná vazba férová a obhajitelná?'],['Studentské práce a identifikující údaje anonymizuj podle aktuálních školních pravidel.']),
  activa: handout('ACTIVA','Rychle vytvářet pracovní listy, týmové aktivity a projekční úlohy podle konkrétního cíle.',['Cíl → typ aktivity.','Doplň předmět, skupinu, čas a obsah.','Vygeneruj a uprav návrh.','Zvol PDF, interaktivní HTML nebo projekci.','Ověř řešení, instrukce a reálnou proveditelnost.'],['Je aktivita skutečně navázaná na cíl?','Jsou řešení správná?','Vejde se do času?','Je výstup čitelný a bezpečný pro sdílení?']),
  sortio: handout('SORTIO – Výukový panel','Organizovat živou výuku pomocí skupin, losování, rolí, sezení a projekčních nástrojů.',['Založ nebo importuj skupinu.','Pro dnešní hodinu uprav docházku.','Vyber losování, skupiny, role nebo zasedací pořádek.','Použij bezpečný projekční režim a potřebné widgety.','Po práci na sdíleném zařízení ukonči relaci podle provozních pravidel.'],['Dává sestava skupin pedagogický a sociální smysl?','Nezobrazuje projekce interní údaje?','Ukládám jen informace, které skutečně potřebuji?'],['Local-first neznamená, že jména studentů přestávají být osobním údajem.']),
  'lesson-hub': handout('Lesson Hub','Udržet kontinuitu výuky mezi přípravou, skutečným průběhem hodiny a dalším krokem.',['Vyber školní rok, předmět a skupinu.','Před hodinou připrav krátký plán.','Po hodině zapiš skutečný průběh a další krok.','Znovu používej materiály, šablony a cykly.','Pro zastupování sdílej jen nutné informace.'],['Pomůže záznam budoucímu já?','Není zbytečně dlouhý?','Odpovídá starší materiál dnešní skupině?','Neobsahují podklady pro zastupování soukromé poznámky?']),
  'maturita-desk': handout('Maturita Desk','Bezpečně se seznámit s pracovním postupem ústní maturitní zkoušky v aktuálním syntetickém demo režimu.',['Ověř aktuální provozní režim aplikace.','V demu používej pouze syntetická data.','Projdi modelový průběh zkoušky.','Komise rozhoduje podle platných pravidel a skutečného výkonu.','Před jakýmkoli ostrým použitím znovu ověř schválený režim.'],['Je prostředí výslovně schválené pro typ dat, která chci použít?','Neobsahuje vstup skutečný důvěrný zkušební materiál?','Je jasné, že konečné hodnocení provádí komise?'],['Současné demo není určeno pro skutečný důvěrný maturitní obsah.']),
  github: handout('GitHub Pages pro školní HTML','Bezpečně zveřejnit hotový interaktivní HTML materiál jako stálý odkaz.',['Založ repozitář.','Nahraj pouze soubory určené ke zveřejnění.','Zapni GitHub Pages.','Ověř výsledný odkaz v anonymním okně.','Při aktualizaci zachovej stejnou cestu souboru.'],['Neobsahuje repozitář klíče, hesla nebo osobní údaje?','Funguje stránka bez přihlášení?','Je zveřejnění opravdu vhodné pro tento materiál?']),
  workflow: handout('Propojený pracovní postup aplikací','Použít jeden ověřený zdroj pro více výstupů bez opakovaného přepisování a nekonzistence.',['Udržuj jeden ověřený zdroj.','Diferenciuj jen tam, kde je to potřeba.','Pro ověření použij Generátor.','Pro aktivizaci použij LUDUS / ACTIVA.','Při předávání mezi nástroji znovu zkontroluj cíl a verzi obsahu.'],['Zůstal společný cíl stejný?','Nerozchází se různé verze obsahu?','Je každý výstup vhodný pro svůj účel?']),
  administrator: handout('Mentor a správce školení','Udržet školení, přístupy, podporu a verze aplikací předvídatelné a bezpečné.',['Nejdřív společný povinný základ.','Potom školení konkrétní aplikace.','Přístup vydávej podle aktuálního provozního modelu.','Sleduj verzi aplikace a stav školení.','Při změně aplikace označ školení k revizi.'],['Odpovídá školení aktuální verzi aplikace?','Je jasné, kdo má jakou roli?','Lze přístup zneplatnit a dohledat provozní rozhodnutí?'])
};

export function attachTrainingData(course) {
  const meta = verification[course.id] || { trainingVersion: '1.0', appVersion: null, verifiedAt: null, sourceRepo: null };
  return {
    ...course,
    required: course.id === 'ai-literacy',
    prerequisites: (course.prerequisites || []).map(id => id === 'start' ? 'ai-literacy' : id),
    training: meta,
    handout: course.handout || handouts[course.id] || handout(course.title, course.subtitle, course.lessons.map(item => item.summary), course.outcomes)
  };
}
