---
'@lottiefiles/dotlottie-web': minor
---

Migrate WASM bindings from Emscripten/embind to wasm-bindgen

* Replace Emscripten module factory with wasm-bindgen `init()` based loading
* Switch from observer callback pattern to poll-based event draining (`poll_event`, `sm_poll_event`)
* Remove Emscripten-specific abstractions (VectorChar, VectorFloat, MainModule)
* Use native `Uint8Array` for binary data instead of byte-by-byte VectorChar copying
* Update all WASM method calls from camelCase to snake\_case API surface
* Fix `loopCount` getter to return running loop count via `current_loop_count()`
* Fix `loadAnimation()` to drain events and dispatch errors correctly
* Fix marker timing: store intended marker and re-apply after animation data loads
* Fix `new URL()` fallback in wasm-bindgen output to prevent Webpack/Next.js build failures
* WASM binary reduced \~38% (2.1MB → 1.3MB)
