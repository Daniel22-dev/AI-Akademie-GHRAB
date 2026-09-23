# AI Akademie — GARP 2.7 adapter

Tato složka je aplikační adaptér a verifikační vrstva pro **GARP 2.7 consolidation r1 (2026-09-23)**. Nenahrazuje historický `security/garp25`; zachovává GARP 2.5.1/N5/Safe Promotion jako funkční baseline.

`reference/` je připnutý snapshot referenčních **kontraktových validátorů**, nikoli runtime security engine. Jeho bajty jsou svázány s `UPSTREAM-PIN.json`. Produkční build `dist-pages/` tuto složku neobsahuje.

Aktivní lokální/CI kontroly:
- upstream/reference contract integrity a 20/20 contract selftestů;
- validace app policy GARP 2.7;
- architecture-integrity gate nad skutečným zdrojovým grafem a `dist-pages`;
- mutation suite pro G27-AR01 až G27-AR05 v disposable kopiích;
- trusted P5-bundle binding: přesný source SHA, runtime digest, file-count, SBOM digest a PASS evidence jsou znovu ověřeny před admission;
- běžný aplikační PR nemůže současně změnit trust-critical GARP 2.7/2.5 control-plane, release workflow nebo dependency graph a sám tuto změnu schválit;
- odvozený assurance stav s explicitním `FOUNDATION_PASS_LIVE_NOT_TESTED`.

Neuzavřené hranice:
- školní server a LIVE jsou odloženy rozhodnutím vlastníka;
- trusted-admission workflow je navržen přes `workflow_run` tak, aby kontrolní kód a trust policy pocházely z chráněného `main` a kandidát se četl pouze jako data. Úplný G27-AR04 PASS však vznikne až po reálném bootstrapu této verze a po nastavení `garp27-trusted-admission` jako povinného GitHub checku; zdrojový balík sám tento stav GitHub rulesetu nemůže dokázat.
