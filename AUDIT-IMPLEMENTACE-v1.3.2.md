# Doplňující opravy AI Akademie GHRAB — verze 1.3.2

Tato verze reaguje na praktické používání Akademie školitelem.

## 1. Návrat ke správnému účelu Akademie

Akademie je interaktivní databáze připravených školení a prezentační nástroj školitele. Není určena k evidenci individuálního studijního postupu účastníka.

Proto byly odstraněny:

- blok „Můj postup v tomto prohlížeči“;
- procenta absolvování;
- označování dokončených lekcí;
- místní evidence dokončených částí;
- podmíněné vyhodnocování návaznosti podle osobního postupu.

Zůstalo pouze ukládání praktických stavů kvízů, checklistů, režimu poznámek a poslední otevřené části.

## 2. Changelog posledních deseti změn

Changelog je umístěn na dvou přirozených místech:

- v horní navigaci jako tlačítko **Změny**;
- v patičce jako tlačítko **Changelog**.

Otevírá se v samostatném modálním okně, takže nezabírá prostor rozcestníku ani katalogu školení. Zdroj je v `assets/js/changelog.js`. Nové položky se vkládají nahoru a `.slice(0, 10)` automaticky zachová pouze deset nejnovějších.

## 3. Bezpečný konec prezentace

Každé školení nyní obsahuje samostatnou závěrečnou obrazovku:

- jasné sdělení „Děkuji za pozornost“;
- tlačítko **Ukončit prezentaci**;
- tlačítko **Spustit znovu od úvodu**;
- tlačítko **Zpět na rozcestník**;
- možnost návratu na poslední obsahový slide.

V prezentačním režimu je navíc trvale dostupné tlačítko **Ukončit prezentaci** vpravo nahoře. Režim lze okamžitě ukončit také klávesou `X` nebo `Esc`. Při ukončení se zároveň korektně opustí celá obrazovka.

## 4. Samostatné HTML prezentace

Všech deset souborů ve složce `exports/` dostalo:

- závěrečný slide;
- položku „Konec prezentace“ v osnově;
- tlačítko pro nové spuštění;
- tlačítko pro ukončení celé obrazovky;
- podporu klávesy `End` pro přechod na závěr.

Závěrečná obrazovka je zahrnuta také do úplného tiskového/PDF režimu.

## 5. Technické změny

- verze projektu a offline cache zvýšena na 1.3.2;
- `assets/js/changelog.js` přidán do offline cache;
- testy nově ověřují přesně deset položek changelogu;
- testy odmítnou návrat osobního postupu do aplikace nebo úložiště;
- testy ověřují závěrečnou obrazovku v hlavní aplikaci i exportech;
- dokumentace byla přepsána podle skutečné role školitele.
