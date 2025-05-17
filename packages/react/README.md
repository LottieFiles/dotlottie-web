# @lottiefiles/dotlottie-react

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-react)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40lottiefiles%2Fdotlottie-react)
![npm](https://img.shields.io/npm/dt/%40lottiefiles/dotlottie-react)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-react)

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
  * [DotLottieReactProps](#dotlottiereactprops)
* [Custom Playback Controls](#custom-playback-controls)
* [Listening to Events](#listening-to-events)
* [Development](#development)
  * [Setup](#setup)
  * [Dev](#dev)
  * [Build](#build)

## Introduction

A React library for rendering [lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://dotlottie.io) animations in the browser.

### What is dotLottie?

dotLottie is an open-source file format that aggregates one or more Lottie files and their associated resources into a single file. They are ZIP archives compressed with the Deflate compression method and carry the file extension of ".lottie".

[Learn more about dotLottie](https://dotlottie.io/).

## Installation

```bash
npm install @lottiefiles/dotlottie-react
```

## Usage

```jsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const App = () => {
  return (
    <DotLottieReact
      src="path/to/animation.lottie"
      loop
      autoplay
    />
  );
};
```

## Live Examples

* <a href="https://codepen.io/lottiefiles/pen/vYPJpBN" target="_blank">Getting Started</a>
* <a href="https://codepen.io/lottiefiles/pen/WNmEdxd" target="_blank">Custom Playback Controls</a>

## APIs

### DotLottieReactProps

The `DotLottieReactProps` extends the `HTMLCanvasElement` Props and accepts all the props that the `HTMLCanvasElement` accepts. In addition to that, it also accepts the following props:

| Property name           | Type                                   | Required | Default               | Description                                                                                                                                                                                                                                        |   |
| ----------------------- | -------------------------------------- | :------: | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | - |
| `autoplay`              | boolean                                |          | false                 | Auto-starts the animation on load.                                                                                                                                                                                                                 |   |
| `loop`                  | boolean                                |          | false                 | Determines if the animation should loop.                                                                                                                                                                                                           |   |
| `src`                   | string                                 |          | undefined             | URL to the animation data (`.json` or `.lottie`).                                                                                                                                                                                                  |   |
| `speed`                 | number                                 |          | 1                     | Animation playback speed. 1 is regular speed.                                                                                                                                                                                                      |   |
| `data`                  | string \| ArrayBuffer                  |          | undefined             | Animation data provided either as a Lottie JSON string or as an ArrayBuffer for .lottie animations.                                                                                                                                                |   |
| `mode`                  | string                                 |          | "forward"             | Animation play mode. Accepts "forward", "reverse", "bounce", "reverse-bounce".                                                                                                                                                                     |   |
| `backgroundColor`       | string                                 |          | undefined             | Background color of the canvas. Accepts 6-digit or 8-digit hex color string (e.g., "#000000", "#000000FF"),                                                                                                                                        |   |
| `segment`               | \[number, number]                      |          | \[0, totalFrames - 1] | Animation segment. Accepts an array of two numbers, where the first number is the start frame and the second number is the end frame.                                                                                                              |   |
| `renderConfig`          | RenderConfig                           |          | `{}`                  | Configuration for rendering the animation.                                                                                                                                                                                                         |   |
| `playOnHover`           | boolean                                |          | false                 | Determines if the animation should play on mouse hover and pause on mouse out.                                                                                                                                                                     |   |
| `dotLottieRefCallback`  | React.RefCallback\<DotLottie \|  null> |          | undefined             | Callback function that receives a reference to the [`dotLottie`](../web/README.md) web player instance.                                                                                                                                            |   |
| `useFrameInterpolation` | boolean                                |          | true                  | Determines if the animation should update on subframes. If set to false, the original AE frame rate will be maintained. If set to true, it will refresh at each requestAnimationFrame, including intermediate values. The default setting is true. |   |
| `marker`                | string                                 |          | undefined             | The Lottie named marker to play.                                                                                                                                                                                                                   |   |
| `animationId`           | string                                 |          | undefined             | The ID of the animation to play.                                                                                                                                                                                                                   |   |

#### RenderConfig

The `renderConfig` object accepts the following properties:

| Property name             | Type    | Required | Default                       | Description                                                           |
| ------------------------- | ------- | :------: | ----------------------------- | --------------------------------------------------------------------- |
| `devicePixelRatio`        | number  |          | window\.devicePixelRatio \| 1 | The device pixel ratio.                                               |
| `renderConfig.autoResize` | boolean |          | true                          | Determines if the canvas should resize automatically to its container |

## Custom Playback Controls

`DotLottieReact` component makes it easy to build custom playback controls for the animation. It exposes a `dotLottieRefCallback` prop that can be used to get a reference to the [`dotLottie`](../web/README.md#apis) web player instance. This instance can be used to control the playback of the animation using the methods exposed by the [`dotLottie`](../web/README.md#methods) web player instance.

Here is an example:

```jsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const App = () => {
  const dotLottieRef = React.useRef(null);

  return (
    <div>
      <DotLottieReact
        src="path/to/animation.lottie"
        loop
        autoplay
        dotLottieRefCallback={(dotLottie) => {
          dotLottieRef.current = dotLottie;
        }}
      />
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button onClick={() => dotLottieRef.current?.play()}>Play</button>
        <button onClick={() => dotLottieRef.current?.pause()}>Pause</button>
        <button onClick={() => dotLottieRef.current?.stop()}>Stop</button>
        <button onClick={() => dotLottieRef.current?.setFrame(30)}>Seek to frame 30</button>
      </div>
    </div>
  );
};
```

You can find the list of methods that can be used to control the playback of the animation [here](../web/README.md#methods).

## Listening to Events

`DotLottieReact` component can receive a `dotLottieRefCallback` prop that can be used to get a reference to the [`dotLottie`](../web/README.md#apis) web player instance. This reference can be used to listen to player events emitted by the [`dotLottie`](../web/README.md#events) web instance.

Here is an example:

```js
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const App = () => {

  const onPlay = () => {
    console.log('Animation start playing');
  }

  const onPause = () => {
    console.log('Animation paused');
  }

  const onComplete = () => {
    console.log('Animation completed');
  }

  const onFrameChange = ({currentFrame}) => {
    console.log('Current frame: ', currentFrame);
  }

  return (
    <DotLottieReact
      src="path/to/animation.lottie"
      loop
      autoplay
      dotLottieRefCallback={(dotLottie) => {
        dotLottie.addEventListener('play', onPlay);
        dotLottie.addEventListener('pause', onPause);
        dotLottie.addEventListener('complete', onComplete);
        dotLottie.addEventListener('frame', onFrameChange);
      }}
    />
  );
};
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
