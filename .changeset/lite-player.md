---
'@lottiefiles/dotlottie-web': minor
---

Add experimental `/lite` subpath export: a pure-TypeScript, Canvas2D-only player with the same public API as the core player — no WASM download, no runtime network fetches, \~32 KB gzipped. Features outside the lite scope (state machines, theming, slots) degrade gracefully.
