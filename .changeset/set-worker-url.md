---
'@lottiefiles/dotlottie-web': minor
'@lottiefiles/dotlottie-react': minor
'@lottiefiles/dotlottie-wc': minor
---

feat: add `DotLottieWorker.setWorkerUrl()` for CSP-compatible worker loading

Ship `dist/dotlottie.worker.js` as a standalone file and add `setWorkerUrl(url)` so consumers can self-host the worker script, avoiding `worker-src: blob:` in Content-Security-Policy.
