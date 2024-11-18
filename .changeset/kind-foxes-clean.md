---
'@lottiefiles/dotlottie-web': minor
---

feat: update dotLottie config to accept initial themeId to load

Breaking change:

* The `DotLottie` constructor now accepts an initial `themeId`
* The `loadTheme` method has been renamed to `setTheme`
* `resetTheme` method has been added to reset the theme to the default one
