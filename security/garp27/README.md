# AI Akademie — GARP 2.7 adapter

Tato složka je aplikační adaptér a verifikační vrstva pro **GARP 2.7 consolidation r2 (2026-09-23-r2 / G-02 fix)**. Nenahrazuje historický `security/garp25`; GARP 2.5.1/N5/Safe Promotion zůstává regresní a release baseline.

`reference/` je byte-for-byte připnutý snapshot referenčního kontraktu, validátorů, policy šablony a důvěryhodného ekosystémového inventáře z dodaného r2 master balíku. Jeho bajty jsou svázány s `UPSTREAM-PIN.json`. Produkční build `dist-pages/` tuto složku neobsahuje.

## Identita

- kanonický GARP 2.7 r2 inventory appId: `ai-academy`;
- historický release/GARP 2.5 appId a názvy artefaktů: `ai-akademie`;
- tento rozdíl je explicitní kompatibilitní mapování, nikoli druhá aplikace.

## Aktivní lokální/CI kontroly

- integrita připnutého r2 reference snapshotu;
- r2 contract selftest včetně negativních G-02 případů;
- fail-closed validace aplikační policy proti trusted inventory a sémantickému kontraktu;
- architecture-integrity gate nad skutečným zdrojovým grafem a `dist-pages`;
- mutation suite pro G27-AR01 až G27-AR05 v disposable kopiích;
- trusted P5-bundle binding na source SHA, runtime digest, file-count, SBOM digest a PASS evidence;
- ochrana před self-approval změnou trust-critical GARP 2.7/2.5 control-plane, release workflow nebo dependency graphu;
- odvozený assurance stav bez falešného LIVE PASS.

## Neuzavřené hranice

- školní server a LIVE jsou odloženy rozhodnutím vlastníka;
- G27-AR04 zůstává lokálně `PARTIAL_LOCAL_ENFORCEMENT`, dokud není nový r2 trust baseline bootstrapnut z protected main a `garp27-trusted-admission` není ověřen jako required GitHub check;
- tato aktualizace reference/policy je záměrně trust-critical změna a nemá se sama schválit běžným aplikačním PR.
