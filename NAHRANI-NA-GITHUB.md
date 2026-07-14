# Nahrání AI Studio GHRAB · Akademie na GitHub

## 1. Založte nový repozitář

1. Přihlaste se na GitHub.
2. Klikněte na **New repository**.
3. Název: `AI-Akademie-GHRAB`.
4. Viditelnost: **Public**.
5. README na GitHubu nepřidávejte — je už součástí balíku.
6. Klikněte na **Create repository**.

## 2. Nahrajte obsah balíku

Do kořene repozitáře nahrajte **obsah složky**, nikoli nadřazenou složku jako jednu položku.

V kořeni GitHub repozitáře musí být přímo vidět například:

```text
.github/
assets/
courses/
scripts/
index.html
manifest.webmanifest
package.json
README.md
sw.js
```

Důležité: nevynechejte skrytou složku `.github`, která obsahuje automatické nasazení.

## 3. Aktivujte GitHub Pages

1. Otevřete **Settings** repozitáře.
2. V levém menu zvolte **Pages**.
3. V části **Build and deployment** nastavte **Source: GitHub Actions**.
4. Nastavení se uloží automaticky.

## 4. Zkontrolujte automatické nasazení

1. Otevřete záložku **Actions**.
2. Vyberte běh **Kontrola a nasazení Akademie**.
3. Nejprve musí zeleně projít kontrola obsahu.
4. Potom musí zeleně projít deployment.

Výsledná adresa bude pravděpodobně:

```text
https://daniel22-dev.github.io/AI-Akademie-GHRAB/
```

## 5. První kontrola po nasazení

- otevřete hlavní rozcestník;
- otevřete alespoň tři různé kurzy;
- vyzkoušejte přechod mezi lekcemi;
- označte jednu lekci jako dokončenou a obnovte stránku;
- spusťte prezentační režim a celou obrazovku;
- vyzkoušejte kvíz a checklist;
- na telefonu ověřte menu a kartu kurzu;
- nainstalujte PWA pouze po ověření aktuální verze.

## 6. Jak se přidává nové školení

1. Zkopírujte nejbližší obsahový soubor ve složce `courses/`.
2. Změňte `id`, `code`, název, metadata a lekce.
3. Přidejte import a položku do `courses/index.js`.
4. Zvedněte verzi v `package.json` a řetězec cache v `sw.js`.
5. Přidejte nový soubor do seznamu `FILES` v `sw.js`.
6. Nahrajte změny na GitHub.
7. Zkontrolujte zelené Actions a živý web.

## 7. Co nikdy nenahrávat

- API klíče;
- soukromý podpisový klíč;
- osobní přístupové soubory;
- reálné studentské texty, e-maily nebo seznamy;
- jakékoli jiné heslo či citlivý údaj.
