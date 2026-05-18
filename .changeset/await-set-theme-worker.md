---
"@lottiefiles/dotlottie-web": patch
---

Fix `DotLottieWorker.setTheme` to `await` the worker message before refreshing state.
