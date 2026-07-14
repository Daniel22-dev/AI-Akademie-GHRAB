# Nahrání AI Studio GHRAB · Akademie na GitHub

Tato verze používá nejjednodušší způsob publikování: **GitHub Pages přímo z větve `main`**. Není potřeba skrytá složka `.github`, GitHub Actions ani příkazová řádka.

## 1. Založte nový repozitář

1. Přihlaste se na GitHub.
2. Klikněte na **New repository**.
3. Název: `AI-Akademie-GHRAB`.
4. Viditelnost: **Public**.
5. README na GitHubu nepřidávejte — je už součástí balíku.
6. Klikněte na **Create repository**.

## 2. Nahrajte obsah balíku

Rozbalte ZIP v počítači. Do nového repozitáře přetáhněte **obsah rozbalené složky**, nikoli samotný ZIP a nikoli nadřazenou složku.

V kořeni repozitáře musí být přímo vidět například:

```text
assets/
courses/
scripts/
index.html
manifest.webmanifest
package.json
README.md
sw.js
```

Potom dole klikněte na **Commit changes**.

## 3. Aktivujte GitHub Pages

1. Otevřete **Settings** repozitáře.
2. V levém menu zvolte **Pages**.
3. V části **Build and deployment** nastavte:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Klikněte na **Save**.

GitHub začne web publikovat. První nasazení může několik minut trvat.

Výsledná adresa bude pravděpodobně:

```text
https://daniel22-dev.github.io/AI-Akademie-GHRAB/
```

## 4. Jak poznat, že je nasazení hotové

1. Vraťte se do **Settings → Pages**.
2. Nahoře se zobrazí adresa zveřejněného webu.
3. Otevřete ji v nové kartě.
4. Pokud stránka ještě není dostupná, chvíli počkejte a obnovte ji pomocí `Ctrl + F5`.

## 5. První kontrola po nasazení

- otevřete hlavní rozcestník;
- otevřete alespoň tři různé kurzy;
- vyzkoušejte přechod mezi lekcemi;
- označte jednu lekci jako dokončenou a obnovte stránku;
- spusťte prezentační režim a celou obrazovku;
- vyzkoušejte kvíz a checklist;
- na telefonu ověřte menu a kartu kurzu;
- PWA instalujte až po ověření aktuální verze.

## 6. Jak se přidává nové školení

1. Zkopírujte nejbližší obsahový soubor ve složce `courses/`.
2. Změňte `id`, `code`, název, metadata a lekce.
3. Přidejte import a položku do `courses/index.js`.
4. Zvedněte verzi v `package.json` a řetězec cache v `sw.js`.
5. Přidejte nový soubor do seznamu `FILES` v `sw.js`.
6. Nahrajte změny na GitHub.
7. GitHub Pages změnu automaticky znovu publikuje.

## 7. Co nikdy nenahrávat

- API klíče;
- soukromý podpisový klíč;
- osobní přístupové soubory;
- reálné studentské texty, e-maily nebo seznamy;
- jakékoli jiné heslo či citlivý údaj.
