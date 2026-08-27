---
'@lottiefiles/dotlottie-web': patch
---

fix: `setWasmUrl()` disables the jsdelivr/unpkg fallback instead of still reaching unpkg when the configured URL fails; `DotLottieWorker.setWasmUrl()` resolves relative URLs against the page (the blob worker can't) and reaches workers that exist but haven't started loading
