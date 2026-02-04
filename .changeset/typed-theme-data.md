---
"@lottiefiles/dotlottie-web": minor
---

feat(types): Add structured Theme type for setThemeData

- Added comprehensive TypeScript type definitions for dotLottie v2.0 Theme specification
- Updated `setThemeData` to accept either a `Theme` object or JSON string
- Theme types include: `ThemeColorRule`, `ThemeScalarRule`, `ThemePositionRule`, `ThemeVectorRule`, `ThemeGradientRule`, `ThemeImageRule`, `ThemeTextRule`
- Updated `BezierHandle` to accept `number | number[]` to match Lottie spec
