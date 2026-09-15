AI AKADEMIE 1.4.9 - RELEASE INTEGRITY PREP
Canonical tooling: GARP 2.5.1 A11/R12.

PREP uses local-untrusted-builder explicitly and is not production approval.
R12 bindings:
- actual BUILD-INPUT-SOURCE SHA-256 must equal provenance sourcePackageSha256 and signed release manifest sourcePackageSha256;
- provenance artifactDigest must equal signed release manifest artifactDigest;
- actual provenance, security-evidence-manifest and SBOM bytes must match buildProvenanceSha256, evidenceManifestSha256 and sbomSha256 inside the signed release-integrity.json;
- SCHOOL profile requires project-root and SBOM and uses canonical deny-unless-listed school-builder-policy.json;
- the shipped SCHOOL builder allowlist is intentionally empty until school IT pins the real trusted builder/workflow.

PREP GREEN does not mean RI-LIVE/SHIELD-LIVE or production approval.
