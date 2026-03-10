---
"@lottiefiles/dotlottie-web": minor
---

Add WebGL and WebGPU rendering backends

* Add `DotLottieWebGL` class for hardware-accelerated rendering via WebGL 2 (importable from `@lottiefiles/dotlottie-web/webgl`)
* Add `DotLottieWebGPU` class for hardware-accelerated rendering via WebGPU (importable from `@lottiefiles/dotlottie-web/webgpu`)
* Export WASM files as package subpaths (`./dotlottie-player.wasm`, `./webgl/dotlottie-player.wasm`, `./webgpu/dotlottie-player.wasm`) enabling `?url` imports in bundlers like Vite
* Refactor WASM loader into a shared `createWasmLoader` factory, eliminating duplicated fallback logic across renderers
  