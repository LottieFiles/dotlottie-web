---
'@lottiefiles/dotlottie-web': patch
---

fixed bundlers not being able to tree-shake `DotLottieWorker`: apps that only use `DotLottie` no longer ship the inlined worker code (\~37.6 KB → \~11.9 KB gzip)
