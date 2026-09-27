# AI Akademie GHRAB 1.4.14 — GARP 2.7 r2 / G-02 fix

Datum: 2026-09-27

## Bezpečnostní změny

- Aktualizován připnutý GARP 2.7 reference snapshot z consolidation r1 na `2026-09-23-r2`.
- Přidán trusted `MASTER/INVENTORY/ecosystem-apps.json` a policy template potřebné pro r2 contract selftest a G-02 admission.
- Aplikační GARP 2.7 policy byla převedena na kanonický inventory appId `ai-academy` a doplněna o sémantické enforcement údaje ve všech deseti povinných sekcích.
- Policy validator nyní odmítá neznámý appId, verzi `0.0.0`, placeholderové hodnoty a sekce bez uznávaného sémantického obsahu.
- Architecture/assurance vrstva používá kanonickou r2 identitu; historický release/GARP 2.5 appId `ai-akademie`, URL cesty, SBOM názvy a starší evidence nejsou přepisovány.
- GARP 2.5.1/N5/Safe Promotion zůstává zachován; nový runtime security engine nevzniká.
- School-server a LIVE zůstávají `NOT_TESTED` / `DEFERRED_BY_OWNER_DECISION`.

## Provozní dopad

Pedagogický obsah, prezentace, UI workflow, storage model a síťové schopnosti aplikace nebyly touto migrací rozšiřovány. Přechod r1 -> r2 je trust-critical změna reference/policy baseline a na GitHubu vyžaduje řízený bootstrap z protected main; běžný kandidát ji nemá sám schválit.
