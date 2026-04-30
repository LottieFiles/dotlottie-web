---
"@lottiefiles/dotlottie-svelte": minor
---

Migrate to Svelte 5 runes API. The component is rewritten to use `$props()`, `$effect()`, and `$state` instead of `export let`, `$:`, and `on:event`.

**Heads up — peer dependency narrowed.** The `svelte` peer dependency moves from `^4.0.0 || ^5.0.0` to `^5.0.0`. If you are still on Svelte 4, stay on the previous version of `@lottiefiles/dotlottie-svelte` until you upgrade to Svelte 5.
