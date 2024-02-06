# @lottiefiles/dotlottie-web

## 0.12.4

### Patch Changes

- 09116cb: fix: 🐛 load animation url with response content-type of text/plain

## 0.13.0-beta.0

### Minor Changes

- 4810361: refactor: 💡 dotlottie-rs wasm bindings integration
- 4810361: feat: 🎸 emit `render` event when a new frame is rendered

## 0.12.3

### Patch Changes

- cd3292e: chore: 🤖 upgrade thorvg\@v0.12.4

## 0.12.2

### Patch Changes

- 7b2b596: fix: 🐛 animation loop not starting in remix apps

## 0.12.1

### Patch Changes

- 1ed6c7c: chore: 🤖 upgrade thorvg to v0.12.2
- b0ca50e: chore: 🤖 disable thorvg threads feature

## 0.12.0

### Minor Changes

- 121474d: feat: expose `setRenderConfig` method & `renderConfig` property

### Patch Changes

- 121474d: fix: nodejs env check
- 121474d: chore: bundle the esm build artifacts to work with webpack
- 121474d: fix: skip rendering when canvas width or height is less than or equal zero

## 0.11.1

### Patch Changes

- 63333c5: fix: 🐛 infer the initial direction before loading from the config mode
- c135278: perf: ⚡️ skip re-allocating new ImageData & Uint8ClampedArray for each frame
- 11c7ae5: fix: 🐛 update background color
- fb3eeeb: fix: 🐛 IS_NODE -> cannot read properties of undefined

## 0.11.0

### Minor Changes

- 495a3d5: refactor: utilize jsDelivr CDN as the primary source for loading the renderer.wasm, with unpkg serving as the
  fallback CDN
- 13a5217: feat: 🎸 useFrameInterpolation
- 495a3d5: fix: 🐛 ability to run DotLottie in web workers

### Patch Changes

- 495a3d5: chore: avoid bundling for the ESM build target

## 0.10.0

### Minor Changes

- 8732113: feat: 🎸 add isLoaded property

### Patch Changes

- e57fbac: chore: 🤖 upgrade thorvg\@0.11.6

## 0.9.2

### Patch Changes

- 5d4cf24: fix: 🐛 correct regression in animation play check before frame request

## 0.9.1

### Patch Changes

- b6eb1f2: fix: 🐛 unfreeze on play

## 0.9.0

### Minor Changes

- 6bc0f68: feat: 🎸 add `freeze` & `unfreeze` events & `isFrozen` property
- 7bad1ec: feat(node-support): 🎸 Enable playing dotLottie animations in non-browser environments
- c9ba3a7: feat: 🎸 make background color independent of platform

## 0.8.1

### Patch Changes

- aaa851f: fix: 🐛 render and dispatch `frame` event for first frame when autoplay is false
- aaa851f: fix: 🐛 ensure animation loop restarts on play after stop

## 0.8.0

### Minor Changes

- 9cbed11: feat: 🎸 add resize method and renderConfig
- 4fd194a: feat: 🎸 add setBackgroundColor method & backgroundColor property
- a3a4cb3: feat: 🎸 add `freeze` & `unfreeze` methods
- e23f84a: feat: 🎸 add destroy event
- 0508345: feat: 🎸 add autoplay getter
- 82c01b6: refactor: rename default mode to `forward`
- 82c01b6: feat: 🎸 `isPlaying`, `isPaused`, `isStopped` properties
- 76838e9: feat: 🎸 add setMode method
- 82c01b6: feat: 🎸 add `setSegments` method & `segments` config.

### Patch Changes

- 635d9c9: fix: 🐛 ensure the canvas is cleared before loading a new animation
- 82c01b6: fix: 🐛 prevent `stop` event from triggering if playback is already stopped.

## 0.7.0

### Minor Changes

- 8e8bd1b: feat: 🎸 backgroundColor

### Patch Changes

- 75d0aa6: fix: 🐛 ensure smooth frame transition in setFrame for reverse and bounce modes
- ee65f5b: chore: 🤖 upgrade thorvg to v0.11.5
- 75d0aa6: fix: 🐛 Reset elapsedTime for loop/bounce continuity
- 75d0aa6: fix: 🐛 Resume from correct progress on play
- 75d0aa6: fix: 🐛 Smooth frame transition on speed change

## 0.6.0

### Minor Changes

- 82830d2: feat: 🎸 add load method
- 600aed1: feat: 🎸 add play mode

### Patch Changes

- 5e4bd8c: fix: 🐛 quality loss when resize canvas
- bff25d3: chore: 🤖 refine loaders in meson build for ThorVG

## 0.5.0

### Minor Changes

- 126a410: feat: 🎸 add destroy method

## 0.4.1

### Patch Changes

- 44d7357: fix: 🐛 load .wasm binary only once

## 0.4.0

### Minor Changes

- 83f1b6b: chore: 🤖 upgrade thorvg to v0.11.4

## 0.3.1

### Patch Changes

- 17810da: fix: 🐛 same renderer instance used for new DotLottie instances

## 0.3.0

### Minor Changes

- 3388c48: fix: 🐛 loading wasm binaries, feat:🎸 add setWasmUrl static method

## 0.2.0

### Minor Changes

- b1664ad: feat: 🎸 load JSON string or ArrayBuffer animation data

## 0.1.0

### Minor Changes

- bcee6e9: feat: 🎸 events
- bcee6e9: feat: 🎸 .lottie support
