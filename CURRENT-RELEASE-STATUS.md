# AI Akademie — CURRENT RELEASE STATUS

**Version:** 1.5.6  
**Date:** 2026-10-08  
**Candidate status:** SOURCE PREPARED — exact-SHA P5 / GARP 2.7 verification required before protected promotion  
**Public LIVE claim for 1.5.6:** NOT MADE  
**School-server LIVE:** NOT_TESTED / DEFERRED_BY_OWNER_DECISION

Tento soubor popisuje zdrojový kandidát 1.5.6. Historické GREEN reporty starších verzí jsou audit trail; nejsou automaticky důkazem pro 1.5.6.

## Změna 1.5.6

Etapa C: tři volitelné krátké startovní prezentace školitele (první kroky v AI Studiu, bezpečné připojení AI, první test v GIT 7.1.99). Obsahují soukromé poznámky prezentujícího a účastnické handouty. Změna je pilotní; není prokázán LIVE školní provoz ani fyzické ověření rozšířené obrazovky. Oprava verzové koherence GARP 2.7 a dokumentační stopy před P5 gate je součástí tohoto kandidáta.

## Změna 1.5.5

Oprava vyhledávání v katalogu: handler nyní cíleně aktualizuje `#courses .course-grid`, nikoli první obecnou `.course-grid` na stránce. Release gate současně získává Chromium browser smoke test s desktop/mobile kontrolou, průchodem všech kurzů a částí, interakcemi kvízu/checklistu a ověřením Presenter konzole včetně screenshot evidence.

## Změna 1.5.4

Presenter konzole znovu odpovídá master standardu: vedle poznámek zobrazuje živý náhled stejného `.lesson-stage`, který běží na projektoru. Synchronizace zůstává same-origin přes opener vazbu bez BroadcastChannelu nebo capability v URL.

## Změna 1.5.3

Oprava vykreslení loga v zápatí: odstraněn CSS filtr `invert(1)` a `mix-blend-mode: screen`. Dodaný školní znak se nyní vykresluje bez barevné nebo kompoziční transformace.

## Změna 1.5.2

Oprava brand assetu: zápatí i PDF handouty používají logo školy dodané vlastníkem projektu. Předchozí interní GHRAB symbol byl odstraněn z této role.

## Změna 1.5.1

Přímé PDF handouty s oficiálním školním logem, oprava P5 artifact bundle pro `.nojekyll` a přesnější Safe Promotion chování při dosud nenastaveném `garp27-trusted-admission` required checku.

## Změna 1.5.0

Funkční MINOR verze Akademie: jedno povinné vstupní školení AI + AI Studio, kompletní katalog devíti aktuálních aplikací, samostatná handout data/PDF a metadata aktuálnosti školení. Prezentační, GARP 2.7 a legacy GARP 2.5.1/N5 hranice zůstávají zachovány. SCHOOL/LIVE se tímto zdrojovým releasem neprohlašuje.

Součástí následné údržby stejné řady byla také bezeztrátová komprese PNG a čitelná šablona exportu (`scripts/export-template/`) bez změny runtime chování.

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
- `npm run qa:browser`
- `npm run qa:garp25:deployment`
- `npm run qa:garp25:sw-pages`
- `npm run qa:garp25:vendored`
- `npm run qa:garp25:sbom`
- `npm run qa:current-evidence`
- `npm run qa:garp27:ci`

## GARP 2.7 truth boundary

Lokální/CI adapter může odvodit `FOUNDATION_PASS_LIVE_NOT_TESTED`, pokud projdou lokální kontroly a evidence. G27-AR04 ale vyžaduje nezávislou repo-side autoritu, kterou kandidát nesmí změkčit ve stejné změně. Přechod r1 -> r2 mění trust-critical reference/policy baseline, proto musí být na GitHubu proveden jako řízený bootstrap/policy update z protected main. Dokud není tato verze bootstrapnuta a context `garp27-trusted-admission` ověřen jako required check, stav zůstává `PARTIAL_LOCAL_ENFORCEMENT` / governance gap.

Žádný lokální selftest, validní JSON ani mutation pack není důkazem školního LIVE provozu.
