# Zapracování auditu AI Akademie GHRAB — verze 1.4.3

**Datum:** 17. 7. 2026  
**Vstup:** AI Akademie GHRAB v1.4.2 + zpráva `ZPRAVA-AUDIT-AI-AKADEMIE-v1.4.2.md`  
**Výsledek:** opravená a otestovaná verze 1.4.3

## 1. Byly tyto opravy už dříve provedené?

Ne. Přiložený repozitář byl skutečně původní stav v1.4.2. Přímo v kódu zůstávaly závady popsané auditem:

- konzole školitele vznikala přes `document.write` a inline JavaScript;
- `courses/speaker-notes.js` neodpovídal vlastnímu generátoru;
- service worker automaticky aktivoval novou verzi a obnovoval otevřená okna;
- aplikace při `controllerchange` volala další automatický reload;
- `storage.js` stále obsahoval mrtvou verzi `1.4.1`;
- prezentační CSS obsahovalo duplicitní pravidla a `will-change`;
- PWA precache obsahoval nepoužívané obrázky a měl téměř 5 MB;
- manifest neměl stabilní `id` a kombinoval `any maskable` v jedné ikoně.

V dostupném předchozím kontextu nebyla dohledána tato konkrétní opravná dávka pro repozitář v1.4.2. Nešlo tedy o již hotové změny, ale o nový audit a novou implementaci.

## 2. Posouzení kvality auditu

Audit je technicky silný, konkrétní a převážně přesný. Kritické body K1, K2 a K4 byly potvrzeny přímo ze zdrojového kódu. U K3 audit správně přiznává omezení headless prostředí a netvrdí bez důkazu, že stejný freeze musí nastat na každém běžném počítači.

Dvě drobná upřesnění:

1. Přesnou jedinou příčinu původního zamrzání nelze ze statické analýzy dokázat. Proto byly odstraněny všechny rozumně identifikované zesilovače a výsledek byl znovu empiricky otestován.
2. Jedna poznámka v S10 mluví o „vyhledávání v changelogu“, ale aplikace ve skutečnosti vyhledává v katalogu prezentací. Optimalizace byla proto provedena právě tam.

Audit nebyl přijat slepě. Každý podstatný nález byl porovnán se skutečným kódem a změny byly následně ověřeny kontrolními a prohlížečovými testy.

## 3. Zapracované opravy

### Kritické nálezy

- **K1 — Konzole školitele:** vytvořeny `console.html` a `assets/js/console.js`. Konzole používá externí modul, `addEventListener`, samostatné ID relace, `BroadcastChannel` a fallback přes `window.opener`. `document.write` byl odstraněn.
- **K2 — Poznámky školitele:** poznámky byly přegenerovány pro všech 68 lekcí. `check.mjs` nyní porovnává commitnutý artefakt s generátorem a kontroluje, že přechody odkazují na existující názvy lekcí. Opraven byl i generátor, který po poctivé regeneraci odhalil vlastní zakázanou formální formulaci.
- **K3 — Riziko zamrznutí:** odstraněny duplicitní prezentační bloky, `will-change`, mrtvé CSS a mechanismus `scale + width nad 100 %`. Přizpůsobení používá `zoom`, případně jednoduchý transform fallback. Precache byl výrazně zmenšen.
- **K4 — Aktualizace PWA:** odstraněn automatický reload otevřených oken. Nový worker čeká, aplikace nabídne tlačítko **Načíst aktualizaci** a během prezentačního režimu výzvu odloží. Po potvrzení proběhne jediný řízený reload.

### Vysoké a střední nálezy

- Úvodní obrazovka nyní skutečně pokračuje první lekcí.
- Cover a závěrečná obrazovka se bezpečně synchronizují s hash routingem a historií prohlížeče.
- Klávesa `End` korektně otevře závěrečnou obrazovku i z jiné lekce.
- `404.html` odvozuje kořen projektu na GitHub Pages a zakazuje indexování.
- Odstraněn mrtvý `installedVersion`; po migraci se maže legacy klíč.
- Smazána složka `assets/apps/` a nepoužívaný `portal-gateway.png`.
- Vytvořeny nové komprimované PWA ikony včetně samostatné maskovatelné varianty.
- Manifest dostal stabilní `id` a oddělené účely ikon.
- Klávesové šipky fungují i po kliknutí na navigační tlačítko, v hlavní aplikaci i exportech.
- Odstraněno globální `aria-live` z kořene aplikace.
- `document.title` se mění podle aktuální lekce.
- Zpřesněn `escapeScript` generátoru exportů a exporty byly znovu sestaveny.
- Přístup k `sessionStorage` má bezpečný fallback.
- Modal changelogu má focus trap a obnovu původního fokusu.
- Vyhledávání v katalogu už nepřekresluje celý shell na každý znak, pouze výslednou mřížku.
- Aktivní dokumentace byla aktualizována na v1.4.3.

### Záměrně ponechané

CSP stále dovoluje `style-src 'unsafe-inline'`, protože aplikace a statická konzole používají inline styly a dynamické stylové hodnoty. Audit sám tuto změnu označuje jako následné zpřísnění mimo hlavní opravnou dávku. `script-src` zůstává bezpečně bez `unsafe-inline`.

## 4. Výsledky testů

### Automatická kontrola projektu

```text
npm test
OK: 10 školení, 68 lekcí, 26 výrazných vizuálních bloků, verze 1.4.3.
```

Sync-guard byl ověřen i negativním testem: po záměrném přidání odchylky do `courses/speaker-notes.js` kontrola správně skončila chybou a vyžádala `npm run build:notes`.

### Determinismus

- dva po sobě jdoucí buildy poznámek: shodný SHA-256;
- dva po sobě jdoucí buildy všech 10 exportů: shodný souhrnný SHA-256.

### PWA cache

- **40 položek**;
- **1 240 096 B**, tedy přibližně **1,183 MB**;
- cíl auditu pod 2 MB splněn;
- konzole školitele i její JavaScript jsou dostupné v offline cache.

### Funkční test v Chromiu

Ověřeno automatizovaně:

- konzole se naplní poznámkami aktuální lekce;
- žádná CSP chyba ani SyntaxError v hlavním nebo pomocném okně;
- konzole ovládá hlavní prezentaci a změny se synchronizují zpět;
- cover pokračuje první lekcí;
- šipka funguje po kliknutí na tlačítko;
- historie prohlížeče odstraní překrytí závěrečné obrazovky;
- titul dokumentu odpovídá aktuální lekci;
- problematický vstup do prezentační lekce: **5/5 pokusů OK**, bez zamrznutí.

### Simulace nasazení nové PWA během školení

- před aktualizací: 1 načtení stránky;
- nový worker přešel do stavu `waiting`;
- během prezentace: stále 1 načtení, žádný toast a žádný reload;
- po ukončení prezentace: zobrazena nabídka **Načíst aktualizaci**;
- po kliknutí: právě jedno další načtení;
- žádné chyby konzole.

## 5. Co je ještě nutné ověřit ručně

Na reálném školním počítači s běžným Chrome nebo Edge zopakovat pětkrát:

1. otevřít libovolnou lekci;
2. stisknout `P`;
3. stisknout `ArrowRight`;
4. ověřit, že prezentace zůstává plynulá a reaguje.

Headless test dopadl 5/5, ale poctivě nelze nahrazovat ověření konkrétního školního hardwaru, grafického ovladače a projektoru.

## 6. Výsledný stav

Projekt byl povýšen na **AI Akademie GHRAB v1.4.3**. Obsah lekcí nebyl věcně přepisován; změny se týkají funkčnosti, bezpečnosti, synchronizace buildů, PWA provozu, prezentačního režimu, přístupnosti a dokumentace.
