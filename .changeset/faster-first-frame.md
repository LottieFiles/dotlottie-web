---
'@lottiefiles/dotlottie-web': patch
---

faster first frame: the animation now downloads in parallel with the WASM module instead of after it, the load path renders once instead of twice, and animation JSON is no longer parsed twice
