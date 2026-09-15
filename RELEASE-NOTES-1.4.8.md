# AI Akademie GHRAB 1.4.8 — GARP 2.5.1 remediation

Datum: 2026-09-15

## Opravené nálezy druhého auditu

- **AKA2-N1 HIGH:** build provenance je vázána na přesný deterministický `BUILD-INPUT-SOURCE.zip`; GARP verifier nově kontroluje skutečný source-package SHA-256 a `artifactDigest` proti podepsanému release manifestu.
- **AKA2-N2 MEDIUM:** service worker již neprecacheuje ani nevrací interní runtime offline. Same-origin runtime používá `network-only/no-store` a při aktivaci maže staré cache Akademie.
- **AKA2-N3 LOW:** 404 přesměrování bylo přesunuto do externího CSP-kompatibilního modulu a zná školní `/apps/ai-akademie/`, `/ai-akademie/`, GitHub Pages i root subdomény.
- **AKA2-N4 LOW:** konzole školitele nepoužívá session capability v query/hash ani BroadcastChannel; komunikuje pouze s ověřeným same-origin `window.opener`.

Pedagogický obsah kurzů nebyl věcně měněn.
