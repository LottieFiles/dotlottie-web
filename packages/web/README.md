# @lottiefiles/dotlottie-web

A JavaScript library for rendering [lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://dotlottie.io) animations in the browser.

> 🚧 **Beta Alert:** We're still refining! The APIs in this package may undergo changes.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Properties](#properties)
- [Methods](#methods)
- [Events](#events)
- [Development](#development)

## Installation

```bash
npm install @lottiefiles/dotlottie-web
```

## Usage

```html
<!-- HTML -->
<canvas id="my-canvas"></canvas>
```

```javascript
// JavaScript
import { DotLottie } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottie({
    autoplay: true,
    loop: true,
    canvas: document.getElementById('my-canvas'),
    src: "https://example.com/path/to/animation.lottie", // or "https://example.com/path/to/animation.json"
});
```

## Options

| Option      | Type               | Required | Default | Description                                                                                        |
|-------------|--------------------|:--------:|---------|----------------------------------------------------------------------------------------------------|
| `autoplay`  | boolean            |          | false   | Auto-starts the animation on load.                                                                  |
| `loop`      | boolean            |          | false   | Determines if the animation should loop.                                                            |
| `canvas`    | HTMLCanvasElement  | ✔️       | null    | Canvas element for animation rendering.                                                             |
| `src`       | string             |          | null    | URL to the animation data (`.json` or `.lottie`).                                                   |
| `speed`     | number             |          | 1       | Animation playback speed. 1 is regular speed.                                                       |

## Properties

| Property      | Type    | Description                                                       |
|---------------|---------|-------------------------------------------------------------------|
| `currentFrame`| number  | Represents the animation's currently displayed frame number.      |
| `duration`    | number  | Specifies the animation's total playback time in milliseconds.    |
| `totalFrames` | number  | Denotes the total count of individual frames within the animation.|
| `loop`        | boolean | Indicates if the animation is set to play in a continuous loop.   |
| `speed`       | number  | Represents the playback speed factor; e.g., 2 would mean double speed.|
| `loopCount`   | number  | Tracks how many times the animation has completed its loop.       |
| `playing`     | boolean | Reflects whether the animation is in active playback or not       |

## Methods

| Method                                                     | Description                                                                           |
|------------------------------------------------------------|---------------------------------------------------------------------------------------|
| `play()`                                                   | Begins playback from the current animation position.                                  |
| `pause()`                                                  | Pauses the animation without resetting its position.                                  |
| `stop()`                                                   | Halts playback and returns the animation to its initial frame.                        |
| `setSpeed(speed: number)`                                  | Sets the playback speed with the given multiplier.                                    |
| `setLoop(loop: boolean)`                                   | Configures whether the animation should loop continuously.                             |
| `setFrame(frame: number)`                                  | Directly navigates the animation to a specified frame.                                |
| `addEventListener(event: string, listener: Function)`      | Registers a function to respond to a specific animation event.                        |
| `removeEventListener(event: string, listener?: Function)`  | Removes a previously registered function from responding to a specific animation event.|

## Events

| Event | Description |
| --- | --- |
| `load` | Emitted when the animation is loaded. |
| `loadError` | Emitted when there's an error loading the animation. |
| `play` | Emitted when the animation starts playing. |
| `pause` | Emitted when the animation is paused. |
| `stop` | Emitted when the animation is stopped. |
| `loop` | Emitted when the animation completes a loop. |
| `complete` | Emitted when the animation completes. |
| `frame` | Emitted when the animation reaches a new frame. |

## Development

### Setup

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Build WASM (Optional)

> **Note:** This step is necessary only if you wish to update the src/renderer.cpp file or the thorvg version being used. If not, you can skip this step.

**Using Docker (Recommended):**

```bash
pnpm build:wasm:docker
```

**Using Emscripten SDK:**

Ensure [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) is installed.

```bash
pnpm build:wasm /path/to/emsdk/
```
