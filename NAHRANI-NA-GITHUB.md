# AI Akademie GHRAB — aktuální release postup od 1.4.10

## Zásadní pravidlo
Novou verzi **nikdy nenahrávej přímo do `main`**. Trvalá vstupní větev je `candidate`.

Aktuální cesta je:

`candidate → P5/GARP/N5 → PR → protected main → main P5 → verified GitHub Pages deploy → live verification`

## 1. Kam nahrávat změny
Změny patří do větve:

`candidate`

Po pushi musí doběhnout workflow **AI Akademie P5 release gate**.

## 2. Co musí být GREEN
Před merge do `main` musí být GREEN:
- `p5-release-gate`
- `candidate-to-main`

`main` je chráněn rulesetem **Protect main - Safe Promotion**. Přímý push, smazání a non-fast-forward změny jsou blokované.

## 3. GitHub Pages
V `Settings → Pages → Build and deployment` musí být:

`Source: GitHub Actions`

Nepoužívej staré nastavení **Deploy from a branch**.

Produkční workflow je **AI Akademie verified Pages deploy** a smí nasadit pouze ověřený `main`.

## 4. Po nasazení
Za hotový release považuj až stav, kdy:
- main P5 je GREEN,
- verified Pages deploy je GREEN,
- job `verify-live` je GREEN,
- live aplikace hlásí očekávanou verzi.

## 5. Lokální kontrola před push
V kořeni projektu můžeš spustit:

```bash
npm ci
npm test
npm run qa:garp25:static
```

## 6. Obsahové změny kurzů
Po změně souboru v `courses/` spusť vždy:

```bash
npm run build:notes
npm run build:exports
npm test
```

Mluvené formulace se trvale upravují v `scripts/build-speaker-notes.mjs`; výsledný soubor `courses/speaker-notes.js` je generovaný artefakt a musí zůstat synchronní se zdroji.

## 7. PWA aktualizace
Nová verze se nenačítá násilným obnovením otevřených prezentačních oken. Aplikace připraví aktualizaci na pozadí a nabídne tlačítko **Načíst aktualizaci**. Během prezentačního režimu se nabídka nezobrazuje.

Při přetrvávající staré verzi zavři všechny karty Akademie a znovu ji otevři; případně použij `Ctrl + F5`.

## 8. Bezpečnost a release limity
- Do repozitáře nepatří API klíče, hesla, tokeny ani neanonymizované osobní údaje.
- `SAFE_PROMOTION_TOKEN` patří pouze do GitHub Actions secrets.
- Historické auditní soubory nemaž; tvoří audit trail.
- AI Akademie není enrolled do současného centrálního AI Studio auto-patche.
- Před bezpodmínečným PUBLIC/SCHOOL uzavřením musí být doložen GH-12 původ/licence všech položek v `security/BINARY-RIGHTS-INVENTORY.txt`.
