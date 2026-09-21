# AI Akademie GHRAB 1.4.10 — Safe Promotion + N5

Datum: 2026-09-21

Infrastructure-only PATCH release. Aplikační obsah a UX nejsou měněny.

## Změny
- Opraven plný GARP 2.5.1 selftest: negativní test neautorizovaného `appId` nyní předává i povinný `--sbom` vstup a testuje skutečný zamýšlený fail-closed důvod.
- N5 deployment scanner a permanentní regrese explicitně blokují privátní JWK (`d`), encrypted private PEM a private PGP block.
- Přidán `candidate`/P5/PR Safe Promotion řetězec a připraven chráněný `main` s required checks.
- Produkční GitHub Pages workflow je navázán pouze na GREEN P5 běh z `main`; `candidate` se nikdy nenasazuje.
- Release evidence je v CI vázána na konkrétní source commit, digest přesného `dist-pages` artefaktu a SBOM. Assurance je označena `TRANSITIONAL`, protože není produkčně kryptograficky podepsaná.
- AI Akademie není v aktuálním AI Studio `release-wave` / `release-promotion-policy`, proto se neobnovuje historický centrální auto-patch dispatch.
- Odstraněn dočasný `selftest-debug.mjs`.

## Nutná GitHub governance před LIVE GREEN
1. vytvořit dlouhodobou větev `candidate`,
2. vytvořit secret `SAFE_PROMOTION_TOKEN`,
3. aktivovat ruleset pro `main` s PR a required checks `candidate-to-main` + `p5-release-gate`, bez bypass actorů,
4. přepnout GitHub Pages Source na **GitHub Actions**.
