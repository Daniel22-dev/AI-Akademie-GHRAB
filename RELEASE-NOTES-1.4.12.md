# AI Akademie GHRAB 1.4.12 — GARP 2.7 FOUNDATION / architecture-integrity

Datum: 2026-09-23

Bezpečnostní PATCH release. Výukový obsah a běžné UX se nemění.

## Co se mění
- GARP 2.5.1 + N5 + Safe Promotion zůstává zachován jako funkční baseline.
- Přidán aplikační adaptér pro konsolidovaný **GARP 2.7 r1** bez vytváření paralelního runtime security enginu.
- Referenční GARP 2.7 validátory jsou připnuty přes SHA-256 k dodanému konsolidačnímu balíku.
- Přidána architecture-integrity brána nad skutečným runtime importním grafem, `dist-pages`, capability inventářem a CI workflow.
- Přidány disposable mutation testy G27-AR01 až G27-AR05.
- P5 na PR nově checkoutuje přesný head SHA kandidáta a do evidence balíku ukládá i skutečný `dist-pages`; trusted admission ověřuje vazbu source SHA → P5 evidence → runtime digest před nezávislou architektonickou kontrolou.
- Trust-critical release control-plane (GARP 2.7 tooling/policy, GARP 2.5 baseline, P5/Safe Promotion/deploy workflow a dependency graph) se v běžném aplikačním PR nesmí změnit a sám schválit.
- Assurance stav se odvozuje z aktuálních důkazů; server-dependent AG-10 až AG-12 zůstávají `NOT_TESTED`.
- Opravena stale P5 SBOM cesta, která byla natvrdo připnutá na verzi 1.4.10.
- Sjednocena verze aplikace a bezpečnostních dokumentů na 1.4.12.

## Bezpečnostní hranice
Tento release **neprohlašuje SCHOOL/LIVE PASS**. Aktivní příprava školního serveru je podle GARP 2.7 `DEFERRED_BY_OWNER_DECISION`.

G27-AR04 má lokální detekci, mutation test a trusted-admission návrh přes `workflow_run` z chráněného `main`. Úplná nezávislost ale vznikne až po bootstrapu 1.4.12 a nastavení contextu `garp27-trusted-admission` jako required checku v GitHub rulesetu. Do té doby je stav v assurance reportu výslovně označen jako governance gap a nesmí být prezentován jako plně uzavřený LIVE/admission trust boundary.
