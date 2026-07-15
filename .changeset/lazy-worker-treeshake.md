---
'@lottiefiles/dotlottie-web': patch
---

fix: make DotLottieWorker tree-shakable and shrink the inlined worker encoding

Static field initializers and module-scope wasm loader calls were emitted as top-level side effects, forcing every consumer to bundle the inlined worker (341 KB raw / 37.6 KB gzip) even when only `DotLottie` was imported. They are now lazy, and the worker is embedded as a string literal instead of a decimal byte array. Importing only `DotLottie` now bundles \~55 KB raw / 11.9 KB gzip.
