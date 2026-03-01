---
"@lottiefiles/dotlottie-svelte": major
---

Migrate to Svelte 5 runes API and drop Svelte 4 support. The component now uses `$props()`, `$effect()`, and `$state` instead of `export let`, `$:`, and `on:event`. The `svelte` peer dependency is narrowed from `^4.0.0 || ^5.0.0` to `^5.0.0`.
