---
"@lottiefiles/dotlottie-web": minor
---

Drop the CommonJS build — the package and its `/webgl` and `/webgpu` subpaths are now ESM only. If you `require('@lottiefiles/dotlottie-web')`, switch to `import`, or use Node 20.19+ / 22.12+ which can `require()` ESM.
