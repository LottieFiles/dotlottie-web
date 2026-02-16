# @lottiefiles/dotlottie-web

## 0.64.0
### Minor Changes

- 786ac3f: chore: migrate tooling to Biome, update Node/pnpm versions, and cleanup fixtures
- fe95559: chore: update wasm bindings of dotLottie-rs@v0.1.54-5b9fefe

## 0.63.0

### Minor Changes

- 60640e1: chore: bump dotlottie-rs wasm bindings version to 0.1.54-e1cda0c

## 0.62.0

### Minor Changes

- de6f1e2: fix: text slot overriding
- 7ab00db: feat(types): Add structured Theme type for setThemeData

  - Added comprehensive TypeScript type definitions for dotLottie v2.0 Theme specification
  - Updated `setThemeData` to accept either a `Theme` object or JSON string
  - Theme types include: `ThemeColorRule`, `ThemeScalarRule`, `ThemePositionRule`, `ThemeVectorRule`,
    `ThemeGradientRule`, `ThemeImageRule`, `ThemeTextRule`
  - Updated `BezierHandle` to accept `number | number[]` to match Lottie spec

## 0.61.0

### Minor Changes

- 8fc283f: feat: slots api

## 0.60.0

### Minor Changes

- 7ad6b24: feat: add setCanvas api

## 0.59.0

### Minor Changes

- 57d4cd8: chore: bump dotlottie-rs WASM bindings to 0.1.54

## 0.58.1

### Patch Changes

- d0ecda1: fix: buffer size mismatch warnings

## 0.58.0

### Minor Changes

- 6091731: chore: bump dotlottie-rs v0.1.53 WASM

## 0.57.0

### Minor Changes

- 4bf1e54: chore: update dotlottie-rs v0.1.52 wasm bindings

## 0.56.0

### Minor Changes

- 3d2eed2: feat: add `registerFont` static method in `DotLottie` and `DotLottieWorker` for custom font registration.

  ```js
  const fontRegistered = await DotLottie.registerFont('CustomFont', 'path/to/font.ttf');
  ```

## 0.55.0

### Minor Changes

- 34b3f1a: chore: update dotlottie-rs v0.1.50 wasm bindings

## 0.54.1

### Patch Changes

- 7fc33a7: fix: 🐛 re-render after applying a theme/slots

## 0.54.0

### Minor Changes

- 4f7f8c1: chore: bump dotLottie-rs WASM bindings to v0.1.49

## 0.53.1

### Patch Changes

- b4d63f3: fix: preserve animation layout when starting state machine

## 0.53.0

### Minor Changes

- 7f87fe1: feat: upgrade dotlottie-rs v0.1.48 wasm bindings
- 7f87fe1: feat: added a new `quality` property (0-100) to `renderConfig` that allows balancing the quality and
  performance of layer effects

### Patch Changes

- 7d8b5aa: fixed open url config creation before starting state machine

## 0.52.2

### Patch Changes

- 9ffec52: fixes the state machines internal state whilst tweening

## 0.52.1

### Patch Changes

- 11b1fc1: fix: rerender after animation transform

## 0.52.0

### Minor Changes

- 0a5dd40: feat: add animation getTransform and setTransform methods

## 0.51.2

### Patch Changes

- 30c6770: fixed on_complete firing

## 0.51.1

### Patch Changes

- f353c46: fix: resetting the loops count after play

## 0.51.0

### Minor Changes

- bfac3c6: feat: added loopCount to DotLottie's config to control the number of playback loops

### Patch Changes

- e72e6e8: fix: rerender on canvas resize

## 0.50.2

### Patch Changes

- 7090211: fix: reset playback config when state machine is stopped

## 0.50.1

### Patch Changes

- 43ebcec: fix: newValue and oldValue parameters in state machine input callbacks

## 0.50.0

### Minor Changes

- a01796d: refactor: Replace manual event dispatching with WASM CallbackObserver integration
- 41dff2e: chore: upgrade dotLottie-rs WASM bindings to v0.1.47
- 5bd67a5: refactor: update state machine related APIs
- a01796d: chore: upgrade dotlottie-rs WASM bindings to v0.1.46
- a01796d: fix: Canvas off-screen optimization condition in `isElementInViewport`

### Patch Changes

- 1744a2c: chore: add `sideEffects: false` flag to `package.json` to allow tree shaking

## 0.49.0

### Minor Changes

- e3c09bb: chore: upgrade dotLottie-rs v0.1.45 WASM bindings

## 0.48.0

### Minor Changes

- 950ad52: feat: add experimental `tween` and `tweenToMarker` methods

## 0.48.0-pre.0

### Minor Changes

- f40ebdc: feat: add experimental `tween` and `tweenToMarker` methods

## 0.47.0

### Minor Changes

- ff1cb3a: chore: update dotLottie-rs WASM bindings to v0.1.44

### Patch Changes

- 93bae08: fix: validate exact buffer size equality in canvas rendering

## 0.46.0

### Minor Changes

- b78ac03: chore: update dotLottie-rs WASM bindings to v0.1.43

## 0.45.0

### Minor Changes

- 8e8ed12: feat: added animationSize method to DotLottieWorker
- 6c07dae: chore: update dotlottie-rs WASM bindings to v0.1.42
- 6c07dae: fix: dotLottie.totalframes return correct Lottie total frames count
- 6c07dae: feat: add `animationId` to `Config` for initial loading of a specific animation

## 0.44.0

### Minor Changes

- 57d4e8a: feat: add `buffer` getter on `DotLottie` instance
- 3320fe2: added a renderError event fire when a render error occurs.

### Patch Changes

- 57d4e8a: refactor: delay canvas context acquisition until render time instead of during initialization to optimize
  resource usage

## 0.43.0

### Minor Changes

- 59f4ce4: chore: update [dotLottie-rs v0.1.40](https://github.com/LottieFiles/dotlottie-rs/releases/tag/v0.1.40) WASM
  bindings

### Patch Changes

- ce0d9a2: fix: clear timeouts in CanvasResizeObserver when unobserving to prevent memory leaks

## 0.42.0

### Minor Changes

- faaf25e: feat: upgrade dotlottie-rs v0.1.39 WASM bindings
- faaf25e: refactor: update the getLayerBoundingBox method to return OBB points

### Patch Changes

- 4ffcae2: fix: ensure proper cancellation of animation frames in \_draw method

## 0.41.0

### Minor Changes

- 956eedb: feat: make `Layout` properties optional with default values. `align` defaults to `[0.5, 0.5]` and `fit`
  defaults to `contain`

## 0.40.2

### Patch Changes

- 7e6b460: fix: 🐛 on loop event regression on `DotLottie`
- 7e6b460: fix: 🐛 ensure loop event is triggered on DotLottieWorker

## 0.40.1

### Patch Changes

- 5b6ec2f: fix(web): 🐛 fail to resize when canvas element is hidden

## 0.40.0

### Minor Changes

- a68c984: chore: 🤖 update dotLottie-rs v0.1.38 wasm bindings
- 9d67d22: chore: update dotlottie-rs\@v0.1.37 wasm bindings

## 0.39.0

### Minor Changes

- 8ef9888: perf(web): update currentFrame precision for perf
- 1ee4ce9: chore: update dotlottie-rs v0.1.36 wasm bindings

## 0.38.2

### Patch Changes

- fa72f98: updates the dotLottie-rs v0.1.34 WASM bindings, which include a fix for the “Memory Access Out of Bounds”
  issue #376

## 0.38.1

### Patch Changes

- 898084e: fix: animation with PNG sequence
- de079cc: fix: runtime error when loading external image asset
- 30ff412: fix: cancel animation frame before loading a new animation

## 0.38.0

### Minor Changes

- 4be7253: chore: update dotlottie-rs WASM bindings to use ThorVG v0.15.5 and fix minor memory leaks.

### Patch Changes

- 4be7253: fix: incorrect default device pixel ratio for `DotLottieWorker`
- 4be7253: fix: prevent unnecessary multiple WASM module fetches in `DotLottieWorker`

## 0.37.0

### Minor Changes

- 0d65643: feat: updated dotLottie-rs wasm bindings to v0.1.33 which includes the new v2 dotLottiespecs and theming
  support. feat: Added `setSlots` methods to `DotLottie` class to set lottie slots in runtime. feat: Added `themeId`
  prop to the `DotLottie` class config to initially load a .lottie with a specific theme. feat: Added `resetTheme`
  method to the `DotLottie` class to reset the theme to the default one.

  BREAKING CHANGE:

  - DotLottie's `loadTheme` method is no longer supported, use `setTheme` instead.
  - DotLottie's `setThemeData` method is no longer supported, use `setThemeData` instead.

## 0.37.0-beta.9

### Patch Changes

- 9ed1a99: fix: lottie default slots are not applied

## 0.37.0-beta.8

### Minor Changes

- c0927ea: feat: add themeId to the DotLottie config

## 0.37.0-beta.7

### Minor Changes

- 989a447: feat: update dotLottie config to accept initial themeId to load

  Breaking change:

  - The `DotLottie` constructor now accepts an initial `themeId`
  - The `loadTheme` method has been renamed to `setTheme`
  - `resetTheme` method has been added to reset the theme to the default one

## 0.37.0-beta.6

### Minor Changes

- 6a6db41: fix(theming): gradient & expression

## 0.37.0-beta.5

### Patch Changes

- 5192b23: fix: apply default slots in loaded lottie json/.lottie

## 0.37.0-beta.4

### Minor Changes

- 7ef3025: feat: add name property to animations/themes/state machines assets in the manifest

## 0.37.0-beta.3

### Patch Changes

- 0dcc26c: fix: setSlot with animated color property

## 0.36.1

### Patch Changes

- 10670ee: added provenance to all packages

## 0.36.0

### Minor Changes

- 26f4be4: feat(web): 🎸 added `getLayerBoundingBox` method

  Basic usage:

  ```typescript
  const canvas = document.getElementById('dotLottie-canvas');

  const dotLottie = new DotLottie({
    canvas,
    ...
  });

  // Draw a rectangle around the layer 'Layer 1' after a frame is renderered
  dotLottie.addEventListener('render', () => {
    const boundingBox = dotLottie.getLayerBoundingBox('Layer 1');
    const context = canvas.getContext('2d');

    if (boundingBox && context) {
      const { x, y, width, height } = boundingBox;
      context.strokeRect(x, y, width, height);
    }
  });
  ```

## 0.35.0

### Minor Changes

- f0e751d: chore: update dotlottie-rs wasm bindings to version 0.1.32

## 0.34.0

### Minor Changes

- 40b19ef: chore: update build target from ES2020 to ES2015

## 0.33.0

### Minor Changes

- 8540831: chore(web): 🤖 upgrade dotlottie-rs v0.1.31 wasm bindings

## 0.32.0

### Minor Changes

- 1900885: feat(web): 🎸 add autoResize to render config
- b7148b9: feat: 🎸 added freezeOnOffscreen option to renderConfig

## 0.31.1

### Patch Changes

- dd70edf: fix(web): 🐛 incorrect default dpr

## 0.31.0

### Minor Changes

- 03311db: feat(web): 🎸 adjust default dpr to 75% of the machine dpr if greater than 1

### Patch Changes

- e34ac54: fix(web): 🐛 Resolved Parcel build failure by creating Worker using a Blob instead of a string literal.
- 8e6f572: fix(web): address canvas resizing issue in DotLottieWorker after transferControlToOffscreen()

## 0.30.3

### Patch Changes

- 04fc781: fix(web): 🐛 Prevent Worker instantiation during SSR in Next.js environment

## 0.30.2

### Patch Changes

- 8419a48: updated runtime to remove internal logs

## 0.30.1

### Patch Changes

- 78bb656: Fixed adding / removing state machine specific event listeners getting duplicated on startStateMachine.

## 0.30.0

### Minor Changes

- 77a56bc: Implemented postEvent return codes so that the state machine can control player playback.

## 0.29.2

### Patch Changes

- d942dd2: fix(web): animation file type detection and improved error handling for dotLottie and Lottie JSON files.

## 0.29.1

### Patch Changes

- dc66e8e: Revert "chore(web): 🤖 upgrade dotlottie-rs\@v0.1.25 wasm bindings (#284)"

## 0.29.0

### Minor Changes

- 400c333: adds loadStateMachineData to web worker.

### Patch Changes

- ca7bb5a: chore(web): 🤖 upgrade dotlottie-rs\@v0.1.25 wasm bindings

## 0.28.0

### Minor Changes

- 1d26a93: feat(web): 🎸 DotLottieWorker

  Introducing `DotLottieWorker`, a new class for offloading animation rendering to a Web Worker, enhancing application
  performance by freeing the main thread from expensive animations rendering. The API remains similar to `DotLottie`,
  with most methods being asynchronous.

  # Basic Usage

  ```js
  import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

  new DotLottieWorker({
    canvas: document.getElementById('canvas'),
    src: 'url/to/animation.json',
    autoplay: true,
    loop: true,
  });
  ```

  #### Worker Grouping

  By default, all animations using `DotLottieWorker` are rendered in the same worker. To group animations into different
  workers, use the `workerId` property in the configuration object, as shown below:

  ```js
  new DotLottieWorker({
    canvas: document.getElementById('canvas'),
    src: 'url/to/animation.json',
    autoplay: true,
    loop: true,
    workerId: 'worker-1',
  });

  new DotLottieWorker({
    canvas: document.getElementById('canvas-2'),
    src: 'url/to/animation2.json',
    autoplay: true,
    loop: true,
    workerId: 'worker-2',
  });
  ```

  This feature is particularly useful when rendering a large number of animations simultaneously, as it allows you to
  distribute the rendering animations workload across multiple workers, improving performance.

## 0.27.0

### Minor Changes

- 6e15246: \* feat(web):🎸 added `ready` event to inform users when the WASM runtime is fully initialized.

  - feat(web):🎸 added `isReady` property to `DotLottie` class to check if the WASM runtime is fully initialized.

  Usage:

  ```js
  const dotLottie = new DotLottie(...);

  if (dotLottie.isReady) {
    // Safe to interact with the player
  } else {
    dotLottie.addEventListener('ready', () => {
      // Safe to interact with the player
    });
  }
  ```

## 0.26.0

### Minor Changes

- ba46fd1: feat(web): 🎸 added `loadStateMachineData` & `animationSize` & state machine context related methods

  - Integrated [dotlottie-rs v0.1.24](https://github.com/LottieFiles/dotlottie-rs/releases/tag/v0.1.24) WASM bindings.
  - New methods added to `DotLottie`:
    - `loadStateMachineData(stateMachineData: string): boolean`: Loads the state machine data as a json string.
    - `animationSize(): {width: number, height: number}`: Retrieves the original lottie animation size.
    - `setStateMachineBooleanContext(name: string, value: boolean): boolean`: Sets the state machine context with a
      boolean value.
    - `setStateMachineStringContext(name: string, value: string): boolean`: Sets the state machine context with a string
      value.
    - `setStateMachineNumericContext(name: string, value: number): boolean`: Sets the state machine context with a
      numeric value.

### Patch Changes

- d7c2c20: fix(web): 🐛 skip triggering LoadEvent for already loaded animations

## 0.25.0

### Minor Changes

- 5b942aa: # feat(web): 🎸 dotLottie State Machines Integration #254

  We are excited to introduce the dotLottie state machine support in dotlottie-web, bringing a new level of
  interactivity and control to your animations!

  #### What's New

  - **Upgraded `dotlottie-rs` to v0.1.23**: WASM bindings.

  #### New Features

  1. **State Machine Integration**🎸
     - DotLottie **`loadStateMachine` Method**: Load a state machine directly from a .lottie file.
     - DotLottie **`startStateMachine` Method**: Start the loaded state machine.
     - DotLottie **`stopStateMachine`. Method**: Cleanly end the started state machine.
     - DotLottie **`postStateMachineEvent` Method**: Send events to the state machine to drive animation behavior.

  ##### Available Events

  ```js
  const dotLottie = new DotLottie(...);

  const smLoaded = dotLottie.loadStateMachine("some_state_machine_id"); // Load a state machine from the .lottie file
  const smStarted = dotLottie.startStateMachine();                // Start the loaded state machine

  dotLottie.postStateMachineEvent("Bool: true");         // Post a boolean event
  dotLottie.postStateMachineEvent("Bool: false");        // Post a boolean event
  dotLottie.postStateMachineEvent("String: ...");        // Post a string event
  dotLottie.postStateMachineEvent("Numeric: 0.0");       // Post a numeric event
  dotLottie.postStateMachineEvent("OnPointerDown: 0.0 0.0"); // Post a pointer down event
  dotLottie.postStateMachineEvent("OnPointerUp: 0.0 0.0");   // Post a pointer up event
  dotLottie.postStateMachineEvent("OnPointerMove: 0.0 0.0"); // Post a pointer move event
  dotLottie.postStateMachineEvent("OnPointerEnter: 0.0 0.0"); // Post a pointer enter event
  dotLottie.postStateMachineEvent("OnPointerExit: 0.0 0.0");  // Post a pointer exit event
  dotLottie.postStateMachineEvent("OnComplete");             // Post a complete event

   const smStopped = dotLottie.stopStateMachine(); // End the started state machine
  ```

  > `DotLottie` will automatically set up and clean up the pointer events on the provided canvas and other animation
  > playback events for you when you call `startStateMachine` and `stopStateMachine`.

  More details can be found in the
  [LottieFiles developers postal](https://developers.lottiefiles.com/docs/dotlottie-player/)

## 0.24.0

### Minor Changes

- b72a4d7: chore: 🤖 upgrade dotlottie-rs v0.1.21 wasm bindings

### Patch Changes

- 663fab2: chore(web): 🤖 log error of loading the initial WASM URL

## 0.23.2

### Patch Changes

- 6bb8561: fix(web): 🐛 ability to resize in non-browser environment

## 0.23.1

### Patch Changes

- 91be7a1: fix(web): 🐛 theme updates not triggered for paused/stopped animation (#227)

## 0.23.0

### Minor Changes

- 6d7673a: chore(web): 🤖 upgrade dotlottie-rs v0.1.20 wasm bindings (#224)
- 274868e: feat: 🎸 added `segmentDuration` getter #225
- 64214f7: perf: optimization tweak in the Uint8ClampedArray usage
- 274868e: feat: 🎸 added `setViewport` method #225

## 0.22.0

### Minor Changes

- 80fe2f1: chore (web): 🤖 Update dotlottie-rs to version 0.1.19

  Release details: [dotlottie-rs@0.1.19](https://github.com/LottieFiles/dotlottie-rs/releases/tag/v0.1.19)

## 0.21.1

### Patch Changes

- 6b394ca: fix:🐛 update dotlottie-rs v0.1.18 WASM bindings

## 0.21.0

### Minor Changes

- fe68ad3: chore: 🤖 update dotlottie-rs v0.1.18 WASM bindings

## 0.20.2

### Patch Changes

- 9e7a046: fix: 🐛 improve content-type parsing when loading from a url

## 0.20.1

### Patch Changes

- f91a4d6: chore: 🤖 remove node version check from package.json

## 0.20.0

### Minor Changes

- aa102b0: feat(web): 🎸 add activeThemeId property

### Patch Changes

- aa102b0: fix(web): Resolve out-of-bounds table index error caused by invalid image asset embedding in WASM module

  Resolves: [#170](https://github.com/LottieFiles/dotlottie-web/issues/170)

## 0.19.0

### Minor Changes

- 0672481: feat: 🎸 integrate dotlottie-rs activeAnimationId getter

## 0.18.1

### Patch Changes

- bcd014b: fix: 🐛 different rendering result compared to lottie-web

## 0.18.0

### Minor Changes

- 65c0b29: feat: 🎸 update dotlottie-rs wasm with reset theme feature

## 0.17.0

### Minor Changes

- 51ff0e9: refactor: 💡 update color space to `ABGR8888S`
- 51ff0e9: refactor: 💡 rename `segments` to `segment`

## 0.16.0

### Minor Changes

- 0e521aa: feat:🎸 layout config
- 0e521aa: feat:🎸 markers
- 0e521aa: feat:🎸 theming

## 0.15.0

### Minor Changes

- 7f659f7: feat: 🎸 webp support

## 0.14.1

### Patch Changes

- b5463d5: chore: 🤖 apply size-optimized dotlottie-rs wasm bindings

## 0.14.0

### Minor Changes

- 7e0890a: feat: 🎸 dotLottie multi-animations support
- 7e0890a: feat: 🎸 accept data as a JSON object

## 0.13.0

### Minor Changes

- e2da7cf: refactor: 💡 dotlottie-rs wasm bindings integration
- e2da7cf: feat: 🎸 emit `render` event when a new frame is rendered

### Patch Changes

- e2da7cf: chore: apply resize and load_animation_data fixes from dotlottie-rs wasm bindings

## 0.13.0-beta.1

### Patch Changes

- e9fdc3a: chore: apply resize and load_animation_data fixes from dotlottie-rs wasm bindings

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
