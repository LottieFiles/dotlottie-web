# @lottiefiles/dotlottie-vue

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-vue)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40lottiefiles%2Fdotlottie-vue)
![npm](https://img.shields.io/npm/dt/%40lottiefiles/dotlottie-vue)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-vue)

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
  * [DotLottieVue Props](#dotlottievue-props)
  * [Listening to Events](#listening-to-events)
* [Development](#development)
  * [Setup](#setup)
  * [Dev](#dev)
  * [Build](#build)

## Introduction

A Vue library for rendering [lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://dotlottie.io) animations in the browser.

### What is dotLottie?

dotLottie is an open-source file format that aggregates one or more Lottie files and their associated resources into a single file. They are ZIP archives compressed with the Deflate compression method and carry the file extension of ".lottie".

[Learn more about dotLottie](https://dotlottie.io/).

## Installation

```bash
npm install @lottiefiles/dotlottie-vue
```

## Usage

```vue
<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
</script>

<template>
  <DotLottieVue style="height: 500px; width: 500px" autoplay loop src="https://path-to-lottie.lottie" />
</template>
```

## Live Examples

* <a href="https://codepen.io/lottiefiles/pen/yLwgeoJ" target="_blank">Basic Example</a>

## APIs

### DotLottieVue Props

| Property name           | Type                  | Required | Default               | Description                                                                                                                                                                                                                                        |
| ----------------------- | --------------------- | :------: | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoplay`              | boolean               |          | false                 | Auto-starts the animation on load.                                                                                                                                                                                                                 |
| `loop`                  | boolean               |          | false                 | Determines if the animation should loop.                                                                                                                                                                                                           |
| `src`                   | string                |          | undefined             | URL to the animation data (`.json` or `.lottie`).                                                                                                                                                                                                  |
| `speed`                 | number                |          | 1                     | Animation playback speed. 1 is regular speed.                                                                                                                                                                                                      |
| `data`                  | string \| ArrayBuffer |          | undefined             | Animation data provided either as a Lottie JSON string or as an ArrayBuffer for .lottie animations.                                                                                                                                                |
| `mode`                  | string                |          | "forward"             | Animation play mode. Accepts "forward", "reverse", "bounce", "reverse-bounce".                                                                                                                                                                     |
| `backgroundColor`       | string                |          | undefined             | Background color of the canvas. Accepts 6-digit or 8-digit hex color string (e.g., "#000000", "#000000FF"),                                                                                                                                        |
| `segment`               | \[number, number]     |          | \[0, totalFrames - 1] | Animation segment. Accepts an array of two numbers, where the first number is the start frame and the second number is the end frame.                                                                                                              |
| `renderConfig`          | RenderConfig          |          | `{}`                  | Configuration for rendering the animation.                                                                                                                                                                                                         |
| `useFrameInterpolation` | boolean               |          | false                 | Determines if the animation should update on subframes. If set to false, the original AE frame rate will be maintained. If set to true, it will refresh at each requestAnimationFrame, including intermediate values. The default setting is true. |
| `marker`                | string                |          | undefined             | Sets a specific marker to be played                                                                                                                                                                                                                |
| `autoResizeCanvas`      | boolean               |          | true                  | Enable or disable auto resize of canvas                                                                                                                                                                                                            |
| `playOnHover`           | boolean               |          | false                 | When enabled it plays animation only on hover                                                                                                                                                                                                      |
| `animationId`           | string                |          | undefined             | Plays specific animation within .lottie                                                                                                                                                                                                            |
| `themeId`               | string                |          | undefined             | Loads a specific theme within .lottie                                                                                                                                                                                                              |
| `themeData`             | string                |          | undefined             | Load theme data.                                                                                                                                                                                                                                   |

#### RenderConfig

The `renderConfig` object accepts the following properties:

| Property name      | Type   | Required | Default                       | Description             |
| ------------------ | ------ | :------: | ----------------------------- | ----------------------- |
| `devicePixelRatio` | number |          | window\.devicePixelRatio \| 1 | The device pixel ratio. |

### Listening to Events

```javascript
<script setup>
import { onMounted, ref, watch } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const playerRef = ref(null);

onMounted(() => {
  if (playerRef.value) {
    const dotLottie = playerRef.value.getDotLottieInstance();
    dotLottie.addEventListener('pause', () => {
      console.log('paused')
    });
    dotLottie.addEventListener('frame', ({ currentFrame }) => {
      console.log('Frame:', currentFrame)
    });
  }
})
</script>

<template>
  <DotLottieVue autoplay loop ref="playerRef" src="path-to-lottie.lottie" />
</template>
```

> Refer to [dotlottie-web](../web/README.md) Events sections to know more about all available events.

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
