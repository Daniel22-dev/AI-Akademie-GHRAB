# AI Akademie — CURRENT RELEASE STATUS

**Version:** 1.4.12  
**Date:** 2026-09-23  
**Candidate status:** LOCAL/CI FOUNDATION candidate — verification required on exact Git commit  
**Public LIVE claim for 1.4.12:** NOT MADE  
**School-server LIVE:** NOT_TESTED / DEFERRED_BY_OWNER_DECISION

Tento soubor popisuje zdrojový kandidát 1.4.12. Historické GREEN reporty starších verzí zůstávají audit trail; nejsou automaticky důkazem pro 1.4.12.

## Security architecture
- GARP 2.5.1/N5/Safe Promotion zůstává funkční baseline.
- GARP 2.7 consolidation r1 je aktivní jako FOUNDATION/admission kontrakt a architecture-integrity vrstva.
- P5 evidence je navržena jako vazba na přesný candidate head SHA a zahrnuje skutečný runtime `dist-pages`; trusted admission jej znovu ověřuje kontrolním kódem z chráněného `main`.
- Nevzniká druhý runtime security engine.
- AI Akademie nemá vlastní AI/API runtime, backend ani upload souborů.
- School-server implementace, Fortinet integrace, serverové identity/revokace, runtime monitoring a recovery nejsou součástí tohoto kola.

## Required release chain
`candidate -> P5/GARP2.5/N5 -> build+artifact checks -> GARP2.7 FOUNDATION/architecture -> PR -> trusted admission from protected main -> protected main -> main P5 -> verified Pages deploy -> live version verification`

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
Lokální/CI adapter může odvodit `FOUNDATION_PASS_LIVE_NOT_TESTED`, pokud projdou všechny lokální kontroly a evidence. G27-AR04 však vyžaduje nezávislou repo-side autoritu, kterou kandidát nemůže změkčit ve stejné změně. Pro 1.4.12 je připraven trusted-admission přes `workflow_run` z chráněného `main`; dokud ale není tato verze bootstrapnuta a context `garp27-trusted-admission` skutečně nastaven jako required check v GitHub rulesetu, report ji označuje jako `PARTIAL_LOCAL_ENFORCEMENT` / governance gap.

Žádný lokální selftest, validní JSON ani úspěšný mutation pack není sám o sobě důkazem školního LIVE provozu.
