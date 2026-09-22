# AI Akademie — CURRENT RELEASE STATUS

**Version:** 1.4.10  
**Date:** 2026-09-22  
**Technical release status:** GREEN — GitHub E2E verified  
**Overall public release status:** GREEN — GH-12 media rights provenance CLOSED

This file supersedes historical GREEN/PREP reports as the human-readable pointer to the current release state. Historical evidence remains audit trail only.

## Architecture decision
AI Akademie is not present in the current AI Studio `release-wave.json` or `release-promotion-policy.json`. Therefore the removed historical central auto-patch workflow is not restored. The local historical `auto-patch-prep` GARP profile remains an internal tooling concept and must not be presented as central Studio auto-patch enrollment.

## Verified release chain
`candidate → P5/GARP/N5/build → PR → protected main → main P5 → verified GitHub Pages deploy → live version verification`

Verified on 2026-09-22 for commit:
`2eade9a189b59257a5099dac8f45a5439cf04f07`

Relevant successful runs:
- main P5: `35700115299`
- verified Pages deploy + live verification: `35700235351`
- candidate PR P5: `35625575613`
- candidate-to-main Safe Promotion: `35625575764`

## Current assurance
- GARP/N5: GREEN on current release commit/run.
- Safe Promotion: GREEN with active `main` ruleset, required PR, required checks, no bypass actors, deletion blocked and non-fast-forward blocked.
- GitHub Pages: Source = GitHub Actions; verified deployment and live version check GREEN.
- Release evidence: `TRANSITIONAL` CI evidence bound to source SHA + exact `dist-pages` digest + SBOM.
- Production cryptographic signing: not claimed.
- School-server LIVE controls: not claimed; separate future phase.
- GH-12 binary/media rights: CLOSED; see `security/BINARY-RIGHTS-INVENTORY.txt`.

## Remaining process note
GH-12 is CLOSED for the current deployed media inventory. Re-open it if a new image/SVG/media asset is added.

The separate GH-10 independence note remains a process/audit-independence item because implementation and this audit were performed by the same ChatGPT system; it is not a technical defect in the deployed application.
