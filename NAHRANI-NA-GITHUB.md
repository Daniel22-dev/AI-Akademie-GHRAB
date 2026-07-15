# Nahrání AI Akademie GHRAB 1.3.1 na GitHub Pages

## 1. Před nahráním

V kořeni projektu spusťte:

```bash
npm test
```

Správný výsledek potvrzuje deset školení, 68 částí, vytvoření deseti exportů a verzi 1.3.1.

## 2. Nahrajte obsah rozbalené složky

Do kořene repozitáře nahrajte přímo tyto položky, nikoli nadřazenou složku:

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
AUDIT-IMPLEMENTACE-v1.3.1.md
sw.js
```

Složka `.github` ani GitHub Actions nejsou pro toto statické nasazení potřeba.

## 3. Nastavte GitHub Pages

V repozitáři otevřete:

```text
Settings → Pages
```

Nastavte:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

Potvrďte **Save**.

## 4. Kontrola po nasazení

Ověřte alespoň toto:

- zobrazí se rozcestník a všech deset jednotných ikon;
- mapa správně odděluje společný základ, tři učitelské větve a správce;
- u každého kurzu je vidět celkový čas, základní cesta a rozšíření;
- tlačítko **Spustit od úvodu** otevře čistou titulní obrazovku;
- projektorový režim na 1366 × 768 nevyžaduje rolování a navigace zůstává viditelná;
- Konzole školitele se synchronizuje pouze s právě otevřenou relací;
- postup, kvízy a checklisty se po obnovení stránky zachovají;
- každý soubor ve složce `exports/` funguje samostatně a offline;
- příkaz Tisk/PDF v exportu připraví všechny obrazovky, ne pouze aktuální;
- export neobsahuje poznámky řečníka ani celý katalog Akademie.

## 5. Při změně kurzu

Po úpravě souboru v `courses/` spusťte:

```bash
npm run build:exports
npm test
```

Potom nahrajte upravený zdrojový modul i nově vytvořený soubor v `exports/`.

Scénáře řečníka jsou v `courses/speaker-notes.js`. Příkaz `npm run build:notes` je znovu vygeneruje a může přepsat ruční úpravy.

## 6. Obnovení nainstalované PWA

Service worker používá cache verze 1.3.1. Po nasazení obvykle stačí aplikaci zavřít a znovu otevřít. Při přetrvávající staré verzi:

1. proveďte tvrdé obnovení `Ctrl + F5`;
2. zavřete všechny karty Akademie;
3. případně odinstalujte starou PWA a nainstalujte ji znovu.

## 7. Bezpečnost před zveřejněním

Před každým nahráním zkontrolujte, že repozitář neobsahuje API klíče, podpisové klíče, hesla, přístupové soubory ani neanonymizované údaje studentů, rodičů či zaměstnanců.
