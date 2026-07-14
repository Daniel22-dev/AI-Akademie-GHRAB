# Nahrání AI Akademie GHRAB na GitHub

## 1. Nahrajte aktualizované soubory

Do kořene repozitáře `AI-Akademie-GHRAB` nahrajte **obsah rozbalené složky**, ne nadřazenou složku.

V kořeni mají být přímo vidět:

```text
assets/
courses/
exports/
scripts/
index.html
manifest.webmanifest
package.json
README.md
sw.js
```

Složka `.github` není potřeba.

## 2. Nastavte GitHub Pages

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

Potvrďte tlačítkem **Save**. Výsledný odkaz bude přibližně:

```text
https://daniel22-dev.github.io/AI-Akademie-GHRAB/
```

## 3. Co po aktualizaci ověřit

- zobrazí se nová ikona AI Akademie;
- nadpis na úvodní stránce má dostatečný odstup od horního modrého štítku;
- rozcestník se označuje jako pracovní prostor školitele, nikoli samostudium kolegů;
- lze otevřít všech deset prezentací;
- tlačítko **Poznámky řečníka** zobrazí interní metodické poznámky;
- tlačítko **Stáhnout HTML** stáhne pouze konkrétní prezentaci;
- stažený HTML soubor funguje po otevření bez internetu;
- export neobsahuje poznámky řečníka ani celý katalog Akademie.

## 4. Při změně obsahu prezentace

Po úpravě souboru v `courses/` spusťte lokálně:

```bash
npm run build:exports
npm test
```

Tím se znovu vytvoří soubory ve složce `exports/`. Na GitHub pak nahrajte upravený modul i odpovídající export.

## 5. Obnovení nainstalované PWA

Po nahrání nové verze může prohlížeč krátce používat starou cache. Obvykle stačí:

1. stránku zavřít;
2. znovu ji otevřít;
3. případně provést tvrdé obnovení `Ctrl + F5`.

Pokud byla Akademie nainstalována jako aplikace a stále ukazuje starou ikonu, odinstalujte starou PWA a nainstalujte ji znovu.
