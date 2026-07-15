---
'@lottiefiles/dotlottie-wc': patch
---

each CDN bundle is now self-contained: `dotlottie-wc.js` no longer downloads the worker code (one ~19 KB gzip file instead of ~36 KB across three)
