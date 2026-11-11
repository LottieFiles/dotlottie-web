---
"@lottiefiles/dotlottie-react": minor
"@lottiefiles/dotlottie-vue": minor
"@lottiefiles/dotlottie-svelte": minor
"@lottiefiles/dotlottie-solid": minor
"@lottiefiles/dotlottie-wc": minor
---

Pass `assetResolver` through to the player. The React, Vue, Svelte and Solid components take it as a prop, and the web component as a property. Before, it was dropped, so external assets could only be resolved with `DotLottie` directly. The worker players still ignore it.
