# @lottiefiles/dotlottie-vue

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-vue)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40lottiefiles%2Fdotlottie-vue)
![npm](https://img.shields.io/npm/dw/%40lottiefiles/dotlottie-vue)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-vue)

<p align="center">
  <img src="https://user-images.githubusercontent.com/23125742/201124166-c2a0bc2a-018b-463b-b291-944fb767b5c2.png" alt="dotLottie Logo" />
</p>

## Table of Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Installation](#installation)
* [Usage](#usage)
* [Live Examples](#live-examples)
* [APIs](#apis)
  * [Props](#props)
  * [Methods](#methods)
  * [Listening to Events](#listening-to-events)
* [Development](#development)
  * [Setup](#setup)
  * [Dev](#dev)
  * [Build](#build)

## Introduction

A Vue library for rendering [Lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://dotlottie.io) animations in the browser.

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
  <DotLottieVue 
    style="height: 500px; width: 500px" 
    autoplay 
    loop 
    src="https://path-to-lottie.lottie" 
  />
</template>
```

## Live Examples

* [Basic Example](https://codepen.io/lottiefiles/pen/yLwgeoJ)

## APIs

### Props

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
| `useFrameInterpolation` | boolean               |          | true                  | Determines if the animation should update on subframes. If set to false, the original AE frame rate will be maintained. If set to true, it will refresh at each requestAnimationFrame, including intermediate values. The default setting is true. |
| `marker`                | string                |          | undefined             | Sets a specific marker to be played                                                                                                                                                                                                                |
| `playOnHover`           | boolean               |          | false                 | When enabled it plays animation only on hover                                                                                                                                                                                                      |
| `animationId`           | string                |          | undefined             | Plays specific animation within .lottie                                                                                                                                                                                                            |
| `themeId`               | string                |          | undefined             | Loads a specific theme within .lottie                                                                                                                                                                                                              |
| `themeData`             | string                |          | undefined             | Sets theme data for the animation                                                                                                                                                                                                                  |

#### RenderConfig

The `renderConfig` object accepts the following properties:

| Property name       | Type    | Required | Default                       | Description                                            |
| ------------------- | ------- | :------: | ----------------------------- | ------------------------------------------------------ |
| `devicePixelRatio`  | number  |          | window\.devicePixelRatio \| 1 | The device pixel ratio.                                |
| `autoResize`        | boolean |          | false                         | Automatically resize the canvas to the parent element. |
| `freezeOnOffscreen` | boolean |          | true                          | Freeze the animation when it's offscreen.              |

### Methods

The Vue component provides a way to access the underlying [dotLottie](../web/README.md) instance using the `getDotLottieInstance()` method on the component reference:

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const playerRef = ref(null);

onMounted(() => {
  if (playerRef.value) {
    const dotLottie = playerRef.value.getDotLottieInstance();
    
    // Now you can call methods on the dotLottie instance
    dotLottie.play();
    dotLottie.setSpeed(2);
    dotLottie.setLoop(true);
    // etc.
  }
});
</script>

<template>
  <DotLottieVue ref="playerRef" src="path-to-lottie.lottie" />
</template>
```

For a complete list of available methods, refer to the [dotlottie-web](../web/README.md#methods) documentation.

### Listening to Events

You can listen to events emitted by the player by accessing the dotLottie instance and adding event listeners:

```vue
<script setup>
import { onMounted, ref } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const playerRef = ref(null);

onMounted(() => {
  if (playerRef.value) {
    const dotLottie = playerRef.value.getDotLottieInstance();
    
    dotLottie.addEventListener('pause', () => {
      console.log('Animation paused');
    });
    
    dotLottie.addEventListener('play', () => {
      console.log('Animation started playing');
    });
    
    dotLottie.addEventListener('frame', ({ currentFrame }) => {
      console.log('Current frame:', currentFrame);
    });
    
    dotLottie.addEventListener('complete', () => {
      console.log('Animation completed');
    });
  }
});
</script>

<template>
  <DotLottieVue autoplay loop ref="playerRef" src="path-to-lottie.lottie" />
</template>
```

For a complete list of available events, refer to the [dotlottie-web](../web/README.md#events) documentation.

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
