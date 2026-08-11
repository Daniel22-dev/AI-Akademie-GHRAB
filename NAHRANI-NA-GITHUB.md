# Nahrání AI Akademie GHRAB 1.4.3 na GitHub Pages

## 1. Před nahráním

V kořeni projektu spusťte:

```bash
npm run build:notes
npm run build:exports
npm test
```

Správný výsledek potvrdí 10 školení, 68 částí, 10 samostatných exportů a verzi 1.4.3. Kontrola navíc ověřuje, že poznámky školitele odpovídají generátoru, odkazy mezi lekcemi jsou platné a PWA cache nepřekračuje stanovený limit.

## 2. Nahrajte obsah rozbalené složky

Do kořene stejného repozitáře nahrajte přímo:

```text
assets/
courses/
exports/
scripts/
404.html
console.html
index.html
manifest.webmanifest
package.json
README.md
NAHRANI-NA-GITHUB.md
sw.js
```

Původní soubory přepište. Nenahrávejte nadřazenou složku jako další úroveň repozitáře.

## 3. Nastavení GitHub Pages

V repozitáři otevřete `Settings → Pages` a nastavte:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

Potvrďte **Save**.

## 4. Kontrola po nasazení

Ověřte zejména:

- rozcestník zobrazuje všech 10 školení;
- tlačítko **Konzole školitele** otevře samostatné okno a do několika sekund zobrazí poznámky;
- tlačítka Předchozí/Další v konzoli ovládají hlavní prezentaci;
- spuštění prezentace z libovolné lekce zobrazí úvodní obrazovku a potom přejde na první lekci;
- šipky fungují i poté, co jste myší klikli na navigační tlačítko;
- aktualizace aplikace sama neobnoví otevřenou prezentaci; mimo prezentaci se zobrazí nabídka **Načíst aktualizaci**;
- poslední obsahová část pokračuje na závěrečnou obrazovku;
- každý soubor v `exports/` funguje samostatně, obsahuje úplný tisk/PDF a neobsahuje poznámky školitele;
- v konzoli prohlížeče nejsou CSP chyby ani syntaktické chyby.

## 5. Změna obsahu kurzů

Po změně souboru v `courses/` spusťte vždy:

```bash
npm run build:notes
npm run build:exports
npm test
```

Mluvené formulace se trvale upravují v `scripts/build-speaker-notes.mjs`; výsledný soubor `courses/speaker-notes.js` je generovaný artefakt a musí být nahrán spolu se zdroji.

## 6. Aktualizace nainstalované PWA

Nová verze se již nenačítá násilným obnovením otevřených oken. Aplikace připraví aktualizaci na pozadí a nabídne tlačítko **Načíst aktualizaci**. Během prezentačního režimu se nabídka nezobrazuje, aby školení nebylo přerušeno.

Při přetrvávající staré verzi zavřete všechny karty Akademie a znovu ji otevřete; teprve poté případně použijte `Ctrl + F5`.

## 7. Bezpečnost

Před nahráním zkontrolujte, že repozitář neobsahuje API klíče, hesla, přístupové soubory ani neanonymizované údaje studentů, rodičů či zaměstnanců.
