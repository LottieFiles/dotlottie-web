# @lottiefiles/dotlottie-web

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-web)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@lottiefiles/dotlottie-web)
![npm](https://img.shields.io/npm/dm/@lottiefiles/dotlottie-web)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-web)
[![](https://data.jsdelivr.com/v1/package/npm/@lottiefiles/dotlottie-web/badge)](https://www.jsdelivr.com/package/npm/@lottiefiles/dotlottie-web)

<p align="center">
  <img src="https://user-images.githubusercontent.com/23125742/201124166-c2a0bc2a-018b-463b-b291-944fb767b5c2.png" />
</p>

## Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
  * [Via npm](#via-npm)
  * [Via CDN](#via-cdn)
* [Live Examples](#live-examples)
* [APIs](#apis)
  * [Config](#config)
  * [Properties](#properties)
  * [Methods](#methods)
  * [Static Methods](#static-methods)
  * [Events](#events)
* [Development](#development)
  * [Setup](#setup)
  * [Dev](#dev)
  * [Build](#build)
  * [Test](#test)

## Introduction

A JavaScript library for rendering [lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://dotlottie.io) animations in the browser.

### What is dotLottie?

dotLottie is an open-source file format that aggregates one or more Lottie files and their associated resources into a single file. They are ZIP archives compressed with the Deflate compression method and carry the file extension of ".lottie".

[Learn more about dotLottie](https://dotlottie.io/).

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) (v18 or higher)

## Installation

```bash
npm install @lottiefiles/dotlottie-web
```

## Usage

### Via npm

After installation, you can import `DotLottie` in your JavaScript or TypeScript module:

```html
<!-- Canvas element where the animation will be rendered -->
<canvas id="dotlottie-canvas" style="width: 300px; height:300px;"></canvas>
```

```js
import { DotLottie } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottie({
    autoplay: true,
    loop: true,
    canvas: document.querySelector('#dotlottie-canvas'),
    src: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie", // or .json file
});
```

### Via CDN

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>@lottiefiles/dotlottie-web | basic example</title>
  </head>
  <body>
    <!-- Canvas element where the Lottie animation will be rendered -->
    <canvas id="canvas" width="300" height="300"></canvas>
    <script type="module">
      import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";

      new DotLottie({
        autoplay: true,
        loop: true,
        canvas: document.getElementById("canvas"),
        src: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie", // or .json file
      });
    </script>
  </body>
</html>
```

## Live Examples

* <a href="https://codepen.io/lottiefiles/pen/JjzJZmL" target="_blank">Getting Started</a>
* <a href="https://codepen.io/lottiefiles/pen/dyrRKwg" target="_blank">Controlling Animation Playback</a>
* <a href="https://codepen.io/lottiefiles/pen/JjzJZgB" target="_blank">Dynamic Animation Loading</a>
* <a href="https://codepen.io/lottiefiles/pen/wvOxdRa" target="_blank">Multi Animations .lottie file</a>
* <a href="https://codepen.io/lottiefiles/pen/LYvZveR" target="_blank">Advanced Animation Layout</a>
* <a href="https://codepen.io/lottiefiles/pen/RwOROKp" target="_blank">Named Markers</a>
* <a href="https://codepen.io/lottiefiles/pen/BaEzEeq" target="_blank">dotLottie theming</a>

## APIs

### Config

The `DotLottie` constructor accepts a config object with the following properties:

| Property name           | Type                                     | Required | Default               | Description                                                                                                                                                                                                                                        |
| ----------------------- | ---------------------------------------- | :------: | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoplay`              | boolean                                  |          | false                 | Auto-starts the animation on load.                                                                                                                                                                                                                 |
| `loop`                  | boolean                                  |          | false                 | Determines if the animation should loop.                                                                                                                                                                                                           |
| `canvas`                | `HTMLCanvasElement` \| `OffscreenCanvas` |    ✔️    | undefined             | Canvas element for animation rendering.                                                                                                                                                                                                            |
| `src`                   | string                                   |          | undefined             | URL to the animation data (`.json` or `.lottie`).                                                                                                                                                                                                  |
| `speed`                 | number                                   |          | 1                     | Animation playback speed. 1 is regular speed.                                                                                                                                                                                                      |
| `data`                  | string \| ArrayBuffer                    |          | undefined             | Animation data provided either as a Lottie JSON string or as an ArrayBuffer for .lottie animations.                                                                                                                                                |
| `mode`                  | string                                   |          | "forward"             | Animation play mode. Accepts "forward", "reverse", "bounce", "reverse-bounce".                                                                                                                                                                     |
| `backgroundColor`       | string                                   |          | undefined             | Background color of the canvas. Accepts 6-digit or 8-digit hex color string (e.g., "#000000", "#000000FF"),                                                                                                                                        |
| `segment`               | \[number, number]                        |          | \[0, totalFrames - 1] | Animation segment. Accepts an array of two numbers, where the first number is the start frame and the second number is the end frame.                                                                                                              |
| `renderConfig`          | [RenderConfig](#renderconfig)            |          | `{}`                  | Configuration for rendering the animation.                                                                                                                                                                                                         |
| `useFrameInterpolation` | boolean                                  |          | true                  | Determines if the animation should update on subframes. If set to false, the original AE frame rate will be maintained. If set to true, it will refresh at each requestAnimationFrame, including intermediate values. The default setting is true. |
| `marker`                | string                                   |          | undefined             | The lottie named marker to play.                                                                                                                                                                                                                   |
| `layout`                | [Layout](#layout)                        |          | undefined             | The animation layout configuration.                                                                                                                                                                                                                |

#### Layout

The `layout` object accepts the following properties:

| Property name | Type              | Required | Default     | Description                                                                                                                                                 |
| ------------- | ----------------- | :------: | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fit`         | string            |          | "contain"   | The fit mode of the animation. Accepts "contain", "cover", "fill", "fit-width", "fit-height" and "none".                                                    |
| `align`       | \[number, number] |          | \[0.5, 0.5] | The alignment of the animation in the canvas. Origin is at the top-left corner where \[0, 0] is the top-left corner and \[1, 1] is the bottom-right corner. |

#### RenderConfig

The `renderConfig` object accepts the following properties:

| Property name      | Type   | Required | Default                       | Description             |
| ------------------ | ------ | :------: | ----------------------------- | ----------------------- |
| `devicePixelRatio` | number |          | window\.devicePixelRatio \| 1 | The device pixel ratio. |

### Properties

`DotLottie` instances expose the following properties:

| Property                | Type                                     | Description                                                                                                         |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `currentFrame`          | number                                   | Represents the animation's currently displayed frame number.                                                        |
| `duration`              | number                                   | Specifies the animation's total playback time in milliseconds.                                                      |
| `totalFrames`           | number                                   | Denotes the total count of individual frames within the animation.                                                  |
| `loop`                  | boolean                                  | Indicates if the animation is set to play in a continuous loop.                                                     |
| `speed`                 | number                                   | Represents the playback speed factor; e.g., 2 would mean double speed.                                              |
| `loopCount`             | number                                   | Tracks how many times the animation has completed its loop.                                                         |
| `direction`             | string                                   | Reflects the current playback direction; e.g., 1 would mean forward, -1 would mean reverse.                         |
| `mode`                  | string                                   | Reflects the current playback mode.                                                                                 |
| `isPaused`              | boolean                                  | Reflects whether the animation is paused or not.                                                                    |
| `isStopped`             | boolean                                  | Reflects whether the animation is stopped or not.                                                                   |
| `isPlaying`             | boolean                                  | Reflects whether the animation is playing or not.                                                                   |
| `segment`               | \[number, number]                        | Reflects the frames range of the animations. where segment\[0] is the start frame and segment\[1] is the end frame. |
| `backgroundColor`       | string                                   | Gets the background color of the canvas.                                                                            |
| `autoplay`              | boolean                                  | Indicates if the animation is set to auto-play.                                                                     |
| `isFrozen`              | boolean                                  | Reflects whether the animation loop is stopped or not.                                                              |
| `isLoaded`              | boolean                                  | Reflects whether the animation is loaded or not.                                                                    |
| `useFrameInterpolation` | boolean                                  | Reflects whether the animation should update on subframes.                                                          |
| `renderConfig`          | [RenderConfig](#renderconfig)            | Configuration for rendering the animation.                                                                          |
| `manifest`              | [Manifest](#manifest) \| null            | The manifest of the loaded dotLottie file.                                                                          |
| `marker`                | string                                   | The lottie named marker to play.                                                                                    |
| `layout`                | [Layout](#layout)                        | The animation layout configuration.                                                                                 |
| `activeThemeId`         | string                                   | The loaded theme id from the .lottie file.                                                                          |
| `activeAnimationId`     | string                                   | The loaded animation id from the .lottie file.                                                                      |
| `segmentDuration`       | number                                   | The duration of the current segment, if no segment is set, it will return the duration of the whole animation.      |
| `canvas`                | `HTMLCanvasElement` \| `OffscreenCanvas` | The canvas element for animation rendering.                                                                         |

#### Manifest

This object contains the manifest of the loaded dotLottie file. as described in the [dotLottie structure](https://dotlottie.io/structure/#manifest-json).

### Methods

`DotLottie` instances expose the following methods that can be used to control the animation:

| Method                                                             | Description                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `play()`                                                           | Begins playback from the current animation position.                                                                                                                                                                                                          |
| `pause()`                                                          | Pauses the animation without resetting its position.                                                                                                                                                                                                          |
| `stop()`                                                           | Halts playback and returns the animation to its initial frame.                                                                                                                                                                                                |
| `setSpeed(speed: number)`                                          | Sets the playback speed with the given multiplier.                                                                                                                                                                                                            |
| `setLoop(loop: boolean)`                                           | Configures whether the animation should loop continuously.                                                                                                                                                                                                    |
| `setFrame(frame: number)`                                          | Directly navigates the animation to a specified frame.                                                                                                                                                                                                        |
| `addEventListener(event: string, listener: Function)`              | Registers a function to respond to a specific animation event.                                                                                                                                                                                                |
| `removeEventListener(event: string, listener?: Function)`          | Removes a previously registered function from responding to a specific animation event.                                                                                                                                                                       |
| `destroy()`                                                        | Destroys the renderer instance and unregisters all event listeners. This method should be called when the canvas is removed from the DOM to prevent memory leaks.                                                                                             |
| `load(config: Config)`                                             | Loads a new configuration or a new animation.                                                                                                                                                                                                                 |
| `setMode(mode: string)`                                            | Sets the animation play mode.                                                                                                                                                                                                                                 |
| `setSegment(startFrame: number, endFrame: number)`                 | Sets the start and end frame of the animation.                                                                                                                                                                                                                |
| `freeze()`                                                         | Freezes the animation by stopping the animation loop.                                                                                                                                                                                                         |
| `unfreeze()`                                                       | Unfreezes the animation by resuming the animation loop.                                                                                                                                                                                                       |
| `setBackgroundColor(color: string)`                                | Sets the background color of the canvas.                                                                                                                                                                                                                      |
| `resize()`                                                         | This method adjusts the canvas size to match its bounding box dimensions, considering the device's pixel ratio. This prevents the canvas from appearing blurry on high-resolution screens. Call this method when the window or the canvas element is resized. |
| `setUseFrameInterpolation(useFrameInterpolation: boolean)`         | Sets whether the animation should update on subframes.                                                                                                                                                                                                        |
| `setRenderConfig(renderConfig: RenderConfig)`                      | Sets the render configuration. check [RenderConfig](#renderconfig) for more details.                                                                                                                                                                          |
| `loadAnimation(animationId: string)`                               | Loads a new animation from the .lottie file, using its ID as specified in the `manifest.json` file of the .lottie file.                                                                                                                                       |
| `setMarker(marker: string)`                                        | Sets the lottie named marker to play.                                                                                                                                                                                                                         |
| `setLayout(layout: Layout)`                                        | Sets the animation layout configuration.                                                                                                                                                                                                                      |
| `loadTheme(themeId: string)`                                       | Loads a new theme from the .lottie file, using its ID as specified in the `manifest.json` file of the .lottie file.                                                                                                                                           |
| `loadThemeData(themeData: string)`                                 | Loads a new theme from the provided theme data.                                                                                                                                                                                                               |
| `setViewport(x: number, y: number, width: number, height: number)` | Sets the viewport of the animation, where x and y are the top-left corner of the viewport, and width and height are the dimensions of the viewport, this will crop the animation to the specified viewport.                                                   |

### Static Methods

The `DotLottie` class exposes the following static methods:

| Method                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `setWasmUrl(url: string)` | Sets the URL to the renderer.wasm binary. |

### Events

The `DotLottie` instance emits the following events that can be listened to via the `addEventListener` method:

| Event       | Description                                                             | Event Parameter (Type and Fields)                      |
| ----------- | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| `load`      | Emitted when the animation is loaded.                                   | `LoadEvent { type: 'load' }`                           |
| `loadError` | Emitted when there's an error loading the animation.                    | `LoadErrorEvent { type: 'loadError', error: Error }`   |
| `play`      | Emitted when the animation starts playing.                              | `PlayEvent { type: 'play' }`                           |
| `pause`     | Emitted when the animation is paused.                                   | `PauseEvent { type: 'pause' }`                         |
| `stop`      | Emitted when the animation is stopped.                                  | `StopEvent { type: 'stop' }`                           |
| `loop`      | Emitted when the animation completes a loop.                            | `LoopEvent { type: 'loop', loopCount: number }`        |
| `complete`  | Emitted when the animation completes.                                   | `CompleteEvent { type: 'complete' }`                   |
| `frame`     | Emitted when the animation reaches a new frame.                         | `FrameEvent { type: 'frame', currentFrame: number }`   |
| `destroy`   | Emitted when the animation is destroyed.                                | `DestroyEvent { type: 'destroy' }`                     |
| `freeze`    | Emitted when the animation is freezed and the animation loop stops.     | `FreezeEvent { type: 'freeze' }`                       |
| `unfreeze`  | Emitted when the animation is unfreezed and the animation loop resumes. | `UnfreezeEvent { type: 'unfreeze' }`                   |
| `render`    | Emitted when a new frame is rendered to the canvas.                     | `RenderEvent { type: 'render', currentFrame: number }` |

## Development

### Setup

```bash
pnpm install
```

### Dev

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Test

```bash
  pnpm test
```
