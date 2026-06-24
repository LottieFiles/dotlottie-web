---
"@lottiefiles/dotlottie-web": minor
---

**Breaking:** drop the CommonJS build. `@lottiefiles/dotlottie-web` and its `/webgl` and `/webgpu` subpaths now ship as ESM only. The `dist/*.cjs` and `dist/*.d.cts` artifacts are no longer published, and the `"require"` branches have been removed from `exports`. Consumers using `require('@lottiefiles/dotlottie-web')` should migrate to `import` (or use Node 22.12+ which supports `require()` of ESM).
