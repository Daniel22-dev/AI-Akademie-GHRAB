# AI Akademie — CURRENT RELEASE STATUS

**Version:** 1.4.10  
**Date:** 2026-09-21  
**Status:** PREP / governance pending empirical GitHub E2E

This file supersedes historical GREEN/PREP reports as the human-readable pointer to the current release state. Historical evidence remains audit trail only.

## Architecture decision
AI Akademie is not present in the current AI Studio `release-wave.json` or `release-promotion-policy.json`. Therefore the removed historical central auto-patch workflow is not restored. The local historical `auto-patch-prep` GARP profile remains an internal tooling concept and must not be presented as central Studio auto-patch enrollment.

## Current target chain
`candidate → P5/GARP/N5/build → PR → protected main → main P5 → verified GitHub Pages deploy`

## Current assurance
- GARP/N5: must be GREEN in the current commit/run.
- Release evidence: `TRANSITIONAL` CI evidence bound to source SHA + exact `dist-pages` digest + SBOM.
- Production cryptographic signing: not claimed.
- School-server LIVE controls: not claimed; still a separate future phase.

## Remaining external governance before DONE
- `main` Ruleset active with pull request required.
- Required checks: `candidate-to-main`, `p5-release-gate`.
- No bypass actors; deletion and non-fast-forward blocked.
- `SAFE_PROMOTION_TOKEN` secret present.
- GitHub Pages source set to **GitHub Actions**.
- Positive and negative Safe Promotion scenarios empirically observed on GitHub.
