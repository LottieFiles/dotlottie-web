# @lottiefiles/dotlottie-svelte

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-svelte)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40lottiefiles%2Fdotlottie-svelte)
![npm](https://img.shields.io/npm/dt/%40lottiefiles/dotlottie-svelte)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-svelte)

<p align="center">
  <img src="https://user-images.githubusercontent.com/23125742/201124166-c2a0bc2a-018b-463b-b291-944fb767b5c2.png" />
</p>

## Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Installation](#installation)
* [Usage](#usage)
* [Live Examples](#live-examples)
* [APIs](#apis)
  * [Props](#props)
* [Custom Playback Controls](#custom-playback-controls)
* [Listening to Events](#listening-to-events)
* [Development](#development)
  * [Setup](#setup)
  * [Dev](#dev)
  * [Build](#build)

## Introduction

A Svelte component for rendering [Lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://dotlottie.io) animations. It acts as a wrapper around the [`dotLottie`](../web/README.md) web player.

### What is dotLottie?

dotLottie is an open-source file format that aggregates one or more Lottie files and their associated resources into a single file. They are ZIP archives compressed with the Deflate compression method and carry the file extension of ".lottie".

[Learn more about dotLottie](https://dotlottie.io/).

## Installation

```bash
npm install @lottiefiles/dotlottie-svelte
```

## Usage

```svelte
<script lang="ts">
import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
</script>

<DotLottieSvelte
  src="path/to/animation.lottie"
  loop
  autoplay
/>
```

## Live Examples

## APIs

### Props

| Property name           | Type                                                    | Required | Default   | Description                                                                                                                                                                                                                                        |   |
| ----------------------- | ------------------------------------------------------- | :------: | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | - |
| `autoplay`              | boolean                                                 |          | false     | Auto-starts the animation on load.                                                                                                                                                                                                                 |   |
| `loop`                  | boolean                                                 |          | false     | Determines if the animation should loop.                                                                                                                                                                                                           |   |
| `src`                   | string                                                  |          | undefined | URL to the animation data (`.json` or `.lottie`).                                                                                                                                                                                                  |   |
| `speed`                 | number                                                  |          | 1         | Animation playback speed. 1 is regular speed.                                                                                                                                                                                                      |   |
| `data`                  | string \| ArrayBuffer                                   |          | undefined | Animation data provided either as a Lottie JSON string or as an ArrayBuffer for .lottie animations.                                                                                                                                                |   |
| `mode`                  | string                                                  |          | "forward" | Animation play mode. Accepts "forward", "reverse", "bounce", "reverse-bounce".                                                                                                                                                                     |   |
| `backgroundColor`       | string                                                  |          | undefined | Background color of the canvas. Accepts 6-digit or 8-digit hex color string (e.g., "#000000", "#000000FF"),                                                                                                                                        |   |
| `segment`               | \[number, number]                                       |          | undefined | Animation segment. Accepts an array of two numbers, where the first number is the start frame and the second number is the end frame.                                                                                                              |   |
| `renderConfig`          | RenderConfig                                            |          | undefined | Configuration for rendering the animation.                                                                                                                                                                                                         |   |
| `dotLottieRefCallback`  | (dotLottie: [DotLottie](../web/README.md#apis)) => void |          | undefined | Callback function that receives a reference to the [`dotLottie`](../web/README.md) web player instance once instantiated.                                                                                                                          |   |
| `useFrameInterpolation` | boolean                                                 |          | true      | Determines if the animation should update on subframes. If set to false, the original AE frame rate will be maintained. If set to true, it will refresh at each requestAnimationFrame, including intermediate values. The default setting is true. |   |
| `autoResizeCanvas`      | boolean                                                 |          | true      | Determines if the canvas should resize automatically to its container                                                                                                                                                                              |   |

#### RenderConfig

The `renderConfig` object accepts the following properties:

| Property name      | Type   | Required | Default                       | Description             |
| ------------------ | ------ | :------: | ----------------------------- | ----------------------- |
| `devicePixelRatio` | number |          | window\.devicePixelRatio \| 1 | The device pixel ratio. |

## Custom Playback Controls

`DotLottieSvelte` component makes it easy to build custom playback controls for the animation. It exposes a `dotLottieRefCallback` prop that can be used to get a reference to the [`dotLottie`](../web/README.md#apis) web player instance. This instance can be used to control the playback of the animation using the methods exposed by the [`dotLottie`](../web/README.md#methods) web player instance.

Here is an example:

```svelte
<script lang="ts">
  import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
  import type { DotLottie } from '@lottiefiles/dotlottie-svelte';
  
  let dotLottie: DotLottie | null = null;

  function play() {
    dotLottie?.play();
  }

  function pause() {
    dotLottie?.pause();
  }

  function stop() {
    dotLottie?.stop();
  }
</script>

<DotLottieSvelte
  src="path/to/your/animation.lottie"
  loop={true}
  autoplay={true}
  dotLottieRefCallback={(ref) => dotLottie = ref}
/>

<button on:click={play}>Play</button>
<button on:click={pause}>Pause</button>
<button on:click={stop}>Stop</button>
```

You can find the list of methods that can be used to control the playback of the animation [here](../web/README.md#methods).

## Listening to Events

`DotLottieSvelte` component can receive a `dotLottieRefCallback` prop that can be used to get a reference to the [`dotLottie`](../web/README.md#apis) web player instance. This reference can be used to listen to player events emitted by the [`dotLottie`](../web/README.md#events) web instance.

Here is an example:

```svelte
<script lang="ts">
    import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
    import type { DotLottie } from '@lottiefiles/dotlottie-svelte';

    let dotLottie: DotLottie | null = null;

    function onLoaded() {
        console.log("Animation loaded");
    }

    function onPlay() {
        console.log("Animation started");
    }

    function onPause() {
        console.log("Animation paused");
    }

    function onComplete() {
        console.log("Animation completed");
    }
    
    function setupListeners(dotLottieInstance) {
        dotLottieInstance.addEventListener('load', onLoaded);
        dotLottieInstance.addEventListener('play', onPlay);
        dotLottieInstance.addEventListener('pause', onPause);
        dotLottieInstance.addEventListener('complete', onComplete);
    }

    function removeListeners(dotLottieInstance) {
        dotLottieInstance.removeEventListener('load', onLoaded);
        dotLottieInstance.removeEventListener('play', onPlay);
        dotLottieInstance.removeEventListener('pause', onPause);
        dotLottieInstance.removeEventListener('complete', onComplete);
    }

     onDestroy(() => {
        if (dotLottie) {
            removeListeners(dotLottie);
        }
    });
</script>

<DotLottieSvelte
    src="path/to/your/animation.lottie"
    loop={true}
    autoplay={true}
    dotLottieRefCallback={(ref) => {
        dotLottie = ref;
        setupListeners(dotLottie);
    }}
/>
```

[dotLottie](../web/README.md#apis) instance exposes multiple events that can be listened to. You can find the list of events [here](../web/README.md#events).

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
