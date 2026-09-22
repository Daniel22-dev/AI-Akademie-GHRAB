# AI Akademie GHRAB 1.4.10 — Safe Promotion + N5

Datum: 2026-09-22

Infrastructure-only PATCH release. Aplikační obsah a UX nejsou měněny.

## Změny
- Opraven plný GARP 2.5.1 selftest: negativní test neautorizovaného `appId` nyní předává i povinný `--sbom` vstup a testuje skutečný zamýšlený fail-closed důvod.
- N5 deployment scanner a permanentní regrese explicitně blokují privátní JWK (`d`), encrypted private PEM a private PGP block.
- Zaveden `candidate`/P5/PR Safe Promotion řetězec a chráněný `main` s required checks.
- Produkční GitHub Pages workflow je navázán pouze na GREEN P5 běh z `main`; `candidate` se nikdy nenasazuje.
- Release evidence je v CI vázána na konkrétní source commit, digest přesného `dist-pages` artefaktu a SBOM. Assurance je označena `TRANSITIONAL`, protože není produkčně kryptograficky podepsaná.
- AI Akademie není v aktuálním AI Studio `release-wave` / `release-promotion-policy`, proto se neobnovuje historický centrální auto-patch dispatch.
- Odstraněn dočasný `selftest-debug.mjs`.

## Empiricky ověřený GitHub E2E stav
Commit `2eade9a189b59257a5099dac8f45a5439cf04f07`:
- main P5 `35700115299` — GREEN
- verified Pages deploy `35700235351` — GREEN
- live version verification — GREEN
- `main` ruleset `Protect main - Safe Promotion` — Active
- required checks `candidate-to-main` + `p5-release-gate`
- bypass actors — none
- deletion + non-fast-forward — blocked

## GH-12 media rights closure
Dne 2026-09-22 byl uzavřen `security/BINARY-RIGHTS-INVENTORY.txt`:
- aplikační a projektové ikony: `OWN WORK / AI-GENERATED FOR THIS PROJECT`
- oficiální školní logo: `SCHOOL-OWNED-AUTHORIZED`

GH-12 je pro aktuální nasazený media inventory CLOSED. Při přidání nového image/SVG/media assetu se musí znovu otevřít.
