---
'@lottiefiles/dotlottie-react': patch
'@lottiefiles/dotlottie-web': patch
---

fix: support React StrictMode — the React wrapper now reuses its instance across StrictMode's simulated remount, and `DotLottieWorker` adopts the existing worker instance instead of throwing on an already-transferred canvas (#439, #893, #326)
