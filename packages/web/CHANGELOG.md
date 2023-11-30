# @lottiefiles/dotlottie-web

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
