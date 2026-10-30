---
"@lottiefiles/dotlottie-web": minor
"@lottiefiles/dotlottie-react": minor
"@lottiefiles/dotlottie-vue": minor
"@lottiefiles/dotlottie-svelte": minor
"@lottiefiles/dotlottie-solid": minor
"@lottiefiles/dotlottie-wc": minor
---

Add audio volume control: a `volume` config option, `setVolume()` and a `volume` getter on `DotLottie` and `DotLottieWorker`, and a `volume` prop on the React, Vue, Svelte, Solid and web component players. It goes from 0 (muted) to 1 (full), defaults to 1, and is kept across loads.
