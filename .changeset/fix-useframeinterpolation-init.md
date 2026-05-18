---
"@lottiefiles/dotlottie-wc": patch
---

Fix `useframeinterpolation="false"` attribute being ignored on initial render. Lit's default `Boolean` converter treats any attribute presence as `true`, so the value `"false"` was coerced to `true` during construction; the runtime change path already parsed `"false"` correctly via `JSON.parse`. Both paths are now consistent.
