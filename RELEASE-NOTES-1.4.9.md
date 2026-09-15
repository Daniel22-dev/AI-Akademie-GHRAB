# AI Akademie GHRAB 1.4.9 - GARP R12 remediation

Security/release-only update. Training content is unchanged.

- closes A3-N1: actual provenance, evidence manifest and SBOM bytes are bound to signed release-integrity anchors;
- closes A3-N2: SCHOOL builder trust is deny-unless-listed with exact canonical builder/workflow policy matching;
- closes A3-N3: SCHOOL requires project-root and evidence is regenerated after final external files;
- adopts A12/R12 policy-only AUTO-PATCH binding for ai-akademie;
- PREP may use local-untrusted-builder; SCHOOL must stay RED until school IT pins the real trusted builder/workflow and LIVE controls are validated.

- AUTO-PATCH-PREP is explicitly bound in the signed release manifest and canonical control-plane policy.
