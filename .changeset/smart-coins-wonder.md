---
'@lottiefiles/dotlottie-svelte': minor
'@lottiefiles/dotlottie-react': minor
'@lottiefiles/dotlottie-solid': minor
'@lottiefiles/dotlottie-vue': minor
'@lottiefiles/dotlottie-web': minor
'@lottiefiles/dotlottie-wc': minor
---

feat: updated dotLottie-rs wasm bindings to v0.1.33 which includes the new v2 dotLottiespecs and theming support.
feat: Added `setSlots` methods to `DotLottie` class to set lottie slots in runtime.
feat: Added `themeId` prop to the `DotLottie` class config to initially load a .lottie with a specific theme.
feat: Added `resetTheme` method to the `DotLottie` class to reset the theme to the default one.

BREAKING CHANGE:

* DotLottie's `loadTheme` method is no longer supported, use `setTheme` instead.
* DotLottie's `setThemeData` method is no longer supported, use `setThemeData` instead.
