# @lottiefiles/dotlottie-react

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-react)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40lottiefiles%2Fdotlottie-react)
![npm](https://img.shields.io/npm/dt/%40lottiefiles/dotlottie-react)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-react)

<p align="center">
  <img src="https://user-images.githubusercontent.com/23125742/201124166-c2a0bc2a-018b-463b-b291-944fb767b5c2.png" />
</p>

> 🚧 **Beta Alert:** We're still refining! The APIs in this package may undergo changes.

## Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Installation](#installation)
* [Usage](#usage)
* [Live Examples](#live-examples)
* [APIs](#apis)
  * [DotLottieReactProps](#dotlottiereactprops)
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

* <a href="https://codesandbox.io/p/sandbox/dotlottie-react-basic-example-66cwfq?autoresize=1&file=%2Fsrc%2FApp.tsx&fontsize=14&hidenavigation=1&theme=dark" target="_blank">Basic Example</a>

## APIs

### DotLottieReactProps

| Property name     | Type                  | Required | Default               | Description                                                                                                                            |
| ----------------- | --------------------- | :------: | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `autoplay`        | boolean               |          | false                 | Auto-starts the animation on load.                                                                                                     |
| `loop`            | boolean               |          | false                 | Determines if the animation should loop.                                                                                               |
| `src`             | string                |          | undefined             | URL to the animation data (`.json` or `.lottie`).                                                                                      |
| `speed`           | number                |          | 1                     | Animation playback speed. 1 is regular speed.                                                                                          |
| `data`            | string \| ArrayBuffer |          | undefined             | Animation data provided either as a Lottie JSON string or as an ArrayBuffer for .lottie animations.                                    |
| `mode`            | string                |          | "forward"             | Animation play mode. Accepts "forward", "reverse", "bounce", "bounce-reverse".                                                         |
| `backgroundColor` | string                |          | undefined             | Background color of the canvas. Accepts 6-digit or 8-digit hex color string (e.g., "#000000", "#000000FF"),                            |
| `segments`        | \[number, number]     |          | \[0, totalFrames - 1] | Animation segments. Accepts an array of two numbers, where the first number is the start frame and the second number is the end frame. |
| `renderConfig`    | RenderConfig          |          | `{}`                  | Configuration for rendering the animation.                                                                                             |
| `playOnHover`     | boolean               |          | false                 | Determines if the animation should play on mouse hover and pause on mouse out.                                                         |

#### RenderConfig

The `renderConfig` object accepts the following properties:

| Property name      | Type   | Required | Default                       | Description             |
| ------------------ | ------ | :------: | ----------------------------- | ----------------------- |
| `devicePixelRatio` | number |          | window\.devicePixelRatio \| 1 | The device pixel ratio. |

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
