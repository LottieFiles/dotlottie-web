# @lottiefiles/dotlottie-web

A javascript library for rendering lottie and [dotLottie](https://dotlottie.io) animations in the browser.

> **Note:** This package is currently in beta and the apis are subject to change.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Methods](#methods)
- [Development](#development)

## Installation

```bash
npm install @lottiefiles/dotlottie-web
```

## Usage

```html
<canvas id="my-canvas"></canvas>
```

```js
import { DotLottie } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottie({
    autoplay: true,
    loop: true,
    canvas: document.getElementById('my-canvas'),
    src: "path/to/animation.json",
});
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| autoplay | boolean | false | Whether to start playing the animation immediately |
| loop | boolean | false | Whether to loop the animation |
| canvas | HTMLCanvasElement | null | The canvas element to render the animation to |
| src | string | null | The path to the animation file |

## Methods

| Method | Description |
| --- | --- |
| play() | Play the animation |
| pause() | Pause the animation |
| stop() | Stop the animation |

## Development

### Setup

```bash
pnpm install
```

### Run Dev Server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Build WASM (optional)

> **Note:** This step is necessary only if you wish to update the src/renderer.cpp file or the thorvg version being used. If not, you can skip this step.

Using Docker (Recommended):

```bash
pnpm build:wasm:docker
```

Using Emscripten SDK:

Make sure you have the [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) installed.

```bash
pnpm build:wasm /path/to/emsdk/
```
