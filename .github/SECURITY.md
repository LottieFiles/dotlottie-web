# Security Policy

## Supported versions

Security fixes land on the latest published release of each package in this repo:

- `@lottiefiles/dotlottie-web`
- `@lottiefiles/dotlottie-react`
- `@lottiefiles/dotlottie-solid`
- `@lottiefiles/dotlottie-svelte`
- `@lottiefiles/dotlottie-vue`
- `@lottiefiles/dotlottie-wc`

All packages are currently pre-1.0 — older minors are not backported. Please upgrade to the latest version to receive fixes.

## Reporting a vulnerability

**Do not open a public issue for security reports.** Public disclosure before a fix is released puts every consumer at risk.

Use GitHub's Private Vulnerability Reporting:

1. Go to the repo's [Security tab](https://github.com/LottieFiles/dotlottie-web/security/advisories/new).
2. Click **Report a vulnerability**.
3. Fill in the form with reproduction steps, affected package(s), and the version range you've tested.

Reports are visible only to repo maintainers.

## What to expect

- **Acknowledgement** — within 5 business days.
- **Assessment + remediation plan** — within 30 days of acknowledgement.
- **Coordinated disclosure** — a GitHub Security Advisory is published alongside or shortly after the patched release. Reporters are credited unless they request otherwise.

## Scope

**In scope:**

- Any package published from this repository under `@lottiefiles/dotlottie-*`.
- The build, release, and CI configuration in this repository that could compromise a published artifact.

**Out of scope:**

- Vulnerabilities in third-party dependencies — please report those to the upstream project first; we track them via Dependabot.
- Bugs without a security impact — file a regular issue.
- Findings from automated scanners without a working proof of concept.
