# Nahrání AI Akademie GHRAB 1.3.2 na GitHub Pages

## 1. Před nahráním

V kořeni projektu spusťte:

```bash
npm test
```

Správný výsledek potvrdí deset školení, 68 částí, deset samostatných exportů a verzi 1.3.2.

## 2. Nahrajte obsah rozbalené složky

Do kořene repozitáře nahrajte přímo:

```text
assets/
courses/
exports/
scripts/
404.html
index.html
manifest.webmanifest
package.json
README.md
NAHRANI-NA-GITHUB.md
AUDIT-IMPLEMENTACE-v1.3.2.md
sw.js
```

Nenahrávejte nadřazenou složku jako další úroveň repozitáře.

## 3. Nastavte GitHub Pages

V repozitáři otevřete `Settings → Pages` a nastavte:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

Potvrďte **Save**.

## 4. Kontrola po nasazení

Ověřte:

- rozcestník zobrazuje všech deset školení;
- nikde se nezobrazuje osobní postup ani procento absolvování;
- tlačítko **Změny** otevře changelog s deseti položkami;
- v každém kurzu lze spustit prezentaci od úvodní obrazovky;
- v prezentačním režimu je vpravo nahoře tlačítko **Ukončit prezentaci**;
- poslední obsahová část pokračuje na závěrečný slide **Děkuji za pozornost**;
- ze závěrečného slidu funguje ukončení, nové spuštění i návrat na rozcestník;
- každý soubor v `exports/` má vlastní závěrečnou obrazovku;
- Tisk/PDF připraví celou prezentaci;
- exporty neobsahují poznámky školitele.

## 5. Při změně kurzu

Po úpravě souboru v `courses/` spusťte:

```bash
npm run build:exports
npm test
```

Potom nahrajte upravený zdrojový modul i nově vytvořený soubor v `exports/`.

Scénáře řečníka jsou v `courses/speaker-notes.js`. Příkaz `npm run build:notes` je znovu vygeneruje a může přepsat ruční úpravy.

## 6. Při přidání změny do changelogu

Otevřete:

```text
assets/js/changelog.js
```

Novou položku vložte nahoru. V aplikaci se vždy ukazuje pouze deset nejnovějších změn. Po úpravě spusťte `npm test`.

## 7. Obnovení nainstalované PWA

Service worker používá cache verze 1.3.2. Po nasazení aplikaci zavřete a znovu otevřete. Při přetrvávající staré verzi:

1. proveďte tvrdé obnovení `Ctrl + F5`;
2. zavřete všechny karty Akademie;
3. případně odinstalujte starou PWA a nainstalujte ji znovu.

## 8. Bezpečnost před zveřejněním

Před každým nahráním zkontrolujte, že repozitář neobsahuje API klíče, podpisové klíče, hesla, přístupové soubory ani neanonymizované údaje studentů, rodičů či zaměstnanců.
