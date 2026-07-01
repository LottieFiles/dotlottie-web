---
"@lottiefiles/dotlottie-react": patch
"@lottiefiles/dotlottie-vue": patch
"@lottiefiles/dotlottie-svelte": patch
"@lottiefiles/dotlottie-solid": patch
"@lottiefiles/dotlottie-wc": patch
---

Forward the `loopCount` option through the framework wrappers. Previously the React, Vue, Svelte, Solid, and Web Component wrappers never passed `loopCount` to the underlying `DotLottie` instance, so the core fell back to its default of `0` (infinite) and the animation always looped forever regardless of the configured value. The wrappers now forward `loopCount` on init, on `load()` when `src`/`data` change, and reactively when the prop changes.
