# AI Akademie — CURRENT RELEASE STATUS

**Version:** 1.4.15  
**Date:** 2026-09-27  
**Candidate status:** LOCAL/CI FOUNDATION candidate — verification required on exact Git commit  
**Public LIVE claim for 1.4.15:** NOT MADE  
**School-server LIVE:** NOT_TESTED / DEFERRED_BY_OWNER_DECISION

Tento soubor popisuje zdrojový kandidát 1.4.15. Historické GREEN reporty starších verzí jsou audit trail; nejsou automaticky důkazem pro 1.4.15.

## Změna 1.4.15

Výkonová a úklidová PATCH verze bez změny chování: bezeztrátová komprese PNG (pixelově shodné) a čitelná šablona exportu (`scripts/export-template/`). Service worker, storage model, egress, capability inventory ani trust-critical control-plane soubory nebyly změněny.

## Security architecture

- Aktivní kontrakt je GARP 2.7 **consolidation r2 / G-02 fix**.
- GARP 2.5.1/N5/Safe Promotion zůstává funkční regresní a release baseline.
- r2 reference snapshot je připnut na SHA-256 dodaného master ZIPu a zahrnuje core contract, trusted app inventory, policy template a referenční validátory.
- Policy admission nově kontroluje kanonický `appId`, SemVer, zakázané placeholdery a sémantický obsah všech deseti povinných policy sekcí.
- Kanonický r2 inventory appId je `ai-academy`; historický release/GARP 2.5 identifikátor `ai-akademie` zůstává zachován pro kompatibilitu starší release vrstvy.
- Nevzniká druhý runtime security engine.
- AI Akademie nemá vlastní AI/API runtime, backend ani upload souborů.
- School-server implementace, serverové identity/revokace, runtime monitoring a recovery nejsou součástí tohoto kola.

## Required release chain

`candidate -> P5/GARP2.5/N5 -> build+artifact checks -> GARP2.7 r2 FOUNDATION/architecture -> PR -> trusted admission from protected main -> protected main -> main P5 -> verified Pages deploy -> live version verification`

## Current local evidence contract

Po sestavení musí projít:
- `npm test`
- `npm run qa:garp25:tooling`
- `npm run qa:garp25:pinned`
- `npm run qa:secrets`
- `npm run qa:safe-promotion`
- `npm run build:pages`
- `npm run qa:garp25:deployment`
- `npm run qa:garp25:sw-pages`
- `npm run qa:garp25:vendored`
- `npm run qa:garp25:sbom`
- `npm run qa:current-evidence`
- `npm run qa:garp27:ci`

## GARP 2.7 truth boundary

Lokální/CI adapter může odvodit `FOUNDATION_PASS_LIVE_NOT_TESTED`, pokud projdou lokální kontroly a evidence. G27-AR04 ale vyžaduje nezávislou repo-side autoritu, kterou kandidát nesmí změkčit ve stejné změně. Přechod r1 -> r2 mění trust-critical reference/policy baseline, proto musí být na GitHubu proveden jako řízený bootstrap/policy update z protected main. Dokud není tato verze bootstrapnuta a context `garp27-trusted-admission` ověřen jako required check, stav zůstává `PARTIAL_LOCAL_ENFORCEMENT` / governance gap.

Žádný lokální selftest, validní JSON ani mutation pack není důkazem školního LIVE provozu.
