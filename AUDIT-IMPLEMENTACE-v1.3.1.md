# Implementace prvního důkladného auditu — verze 1.3.1

Tento dokument shrnuje úpravy provedené po auditu AI Akademie GHRAB 1.2.1.

## Oprava rozcestníku ve verzi 1.3.1

- vzdělávací mapa byla znovu rozvržena podle reálné šířky notebooku,
- větev tvorby materiálů má jasný sled Diferenciátor → Generátor testů nebo LUDUS,
- komunikace a hodnocení jsou dvě vyvážené samostatné cesty,
- pokročilý workflow a správce jsou oddělené navazující možnosti,
- odstraněno lámání názvů, namačkané spojky a nevyužité prázdné plochy.

## 1. Projekce a ovládání

- Projektorová plocha byla přestavěna na čtyři stabilní oblasti: průběh, hlavičku, obsah a navigaci.
- Navigace zůstává vždy uvnitř obrazovky.
- Obsah se automaticky přizpůsobuje dostupné výšce bez rolování.
- Každý kurz má čistou úvodní obrazovku s časem, cíli a ikonou.
- Lektorské nástroje jsou při projekci skryté.
- Konzole školitele používá samostatný identifikátor relace, takže se různé otevřené akademie vzájemně neovládají.
- Přibyly klávesy Home, End, Page Up, Page Down a mezerník.

## 2. Časy a vzdělávací logika

- Čas každého kurzu se skládá z výukového obsahu a výslovně uvedené rezervy.
- Všech deset součtů odpovídá jednotlivým částem.
- Celkový čas Akademie se zobrazuje přesně, nikoli zaokrouhleně.
- Vzdělávací mapa byla změněna na společný základ a tři učitelské větve.
- Správce je samostatná role, nikoli povinný konec běžné učitelské cesty.
- Každý kurz rozlišuje základní minimum a rozšiřující části.

## 3. Scénáře školitele

- Všech 68 částí má vlastní upravitelný scénář.
- Scénář obsahuje přímou formulaci, vysvětlení, otázku, očekávaný směr odpovědi, demonstraci, metodický tip, riziko, přechod, offline variantu a časování.
- Automatické duplicity mezi metodickou poznámkou a demonstrací byly odstraněny.
- Konzole ukazuje scénář barevně rozdělený a synchronizovaný s projekcí.

## 4. Obsah a wow efekt

- Vznikly nové typy bloků: úderná hlavní myšlenka, modelová ukázka před/po, rozhodovací blok a živá mise.
- Každý kurz začíná názorným výsledkem nebo silnou myšlenkou.
- Každý kurz končí konkrétním přenosem do praxe.
- Hutné části dostaly speciální dvousloupcové kompozice místo dalšího zmenšování textu.
- Technické pojmy byly tam, kde to šlo, nahrazeny nebo vysvětleny česky.
- Bezpečnostní příklady už nepoužívají třídu ani diagnózu jako zdánlivě anonymní údaj.

## 5. Vizuální systém

- Všech deset kurzů používá novou jednotnou sadu ikon.
- Ikony mají společný rám, světlo, měřítko a odlišný symbol.
- Logo školy v patičce se na tmavém pozadí zobrazuje bez rušivého bílého čtverce.
- Karty kurzů ukazují místní postup a stav doporučené návaznosti.
- Přibyly nové vizuální kompozice pro obsahově náročné slidy.

## 6. Postup, mobil a přístupnost

- Rozpracovaná evidence dokončení byla dokončena a zpřístupněna v rozhraní.
- Postup je vidět v hlavičce, na rozcestníku, v kartách, v kurzu i osnově.
- Data se ukládají pouze lokálně; při blokovaném úložišti Akademie nespadne.
- Mobilní verze má vlastní tlačítko Obsah a zavření osnovy.
- Aktivní část používá `aria-current`.
- Důležité dotykové prvky mají minimálně 44 px.
- Kvízy lze opakovat a spolu s checklisty si pamatují stav.

## 7. Export, tisk a PDF

- Samostatné HTML soubory neobsahují interní scénáře.
- Tisk/PDF nyní připraví úvod a všechny části prezentace.
- Tiskový režim používá světlé pozadí, skryje navigaci a zalamuje jednotlivé slidy.
- Exporty rozlišují základní cestu a rozšíření.
- Mobilní export má vlastní osnovu a trvalý stav aktivit.

## 8. Technická odolnost

- Service worker vrací hlavní stránku pouze při selhání navigace, nikoli místo chybějícího obrázku nebo skriptu.
- Cache má verzi 1.3.1.
- Kontrolní skript ověřuje časy, kvízy, scénáře, vizuální bloky, návaznosti, ikony, exporty, tisk, dotykové prvky a únik interních poznámek.
- Chybové stavy místního úložiště jsou ošetřené.

## 9. Provedené ověření

- sestavení deseti exportů;
- statická kontrola deseti kurzů a 68 částí;
- vizuální průchod 78 obrazovek exportů na 1366 × 768;
- mobilní průchod 78 obrazovek na 390 × 844;
- vizuální průchod všech 68 lektorských slidů v projektorovém režimu 1366 × 768;
- kontrola vodorovného přetékání, viditelnosti navigace, chyb JavaScriptu a minimálního měřítka obsahu;
- kontrola titulní stránky, kurzu, titulního projektorového slidu a mobilní verze.

Výsledek vizuální kontroly: žádný testovaný slide nevyžaduje v projektorovém režimu rolování, navigace zůstává uvnitř obrazovky a žádný samostatný export nepřetéká vodorovně.

## 10. Záměrně nevložené neověřené screenshoty

Součástí balíku nebyly aktuální zdrojové verze všech školních aplikací. Proto nebyly do Akademie vloženy staré, oříznuté nebo smyšlené screenshoty. Místo nich jsou použity jasně označené modelové ukázky. Reálné obrazovky lze doplnit až z aktuálních sestavení a po kontrole, že neobsahují osobní údaje ani tajné klíče.
