# @lottiefiles/dotlottie-wc

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-wc)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40lottiefiles%2Fdotlottie-wc)
![npm](https://img.shields.io/npm/dt/%40lottiefiles%2Fdotlottie-wc)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-wc)

<p align="center">
  <img src="https://user-images.githubusercontent.com/23125742/201124166-c2a0bc2a-018b-463b-b291-944fb767b5c2.png" />
</p>

## Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Installation](#installation)
* [Usage](#usage)
  * [Via npm](#via-npm)
  * [Via CDN](#via-cdn)
* [APIs](#apis)
  * [Attributes](#attributes)
* [RenderConfig](#renderconfig)
  * [Properties](#properties)
* [Development](#development)
  * [Setup](#setup)
  * [Dev](#dev)
  * [Build](#build)

## Introduction

A web component for rendering and playing [Lottie](https://lottiefiles.github.io/lottie-docs/) and [DotLottie](https://dotlottie.io) animations in web applications.

### What is dotLottie?

dotLottie is an open-source file format that aggregates one or more Lottie files and their associated resources into a single file. They are ZIP archives compressed with the Deflate compression method and carry the file extension of ".lottie".

[Learn more about dotLottie](https://dotlottie.io/).

## Installation

```bash
npm install @lottiefiles/dotlottie-wc
```

## Usage

### Via npm

After installation, you can use `dotlottie-wc` in your HTML file:

```html
<dotlottie-wc src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie" autoplay="true" loop="true"></dotlottie-wc>
```

And import it in your JavaScript or TypeScript module:

```js
import '@lottiefiles/dotlottie-wc';
```

### Via CDN

You can also use the component directly via a npm CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>@lottiefiles/dotlottie-wc | Basic Example</title>
</head>
<body>
    <dotlottie-wc src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie" autoplay loop></dotlottie-wc>
    <script type="module" src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js"></script>
</body>
</html>
```

## APIs

### Attributes

The `dotlottie-wc` component accepts all configuration attributes of [`DotLottie`](../web/README.md#apis) from `@lottiefiles/dotlottie-web`, allowing you to customize your animation as required.

| Attribute         | Type                  | Description                                                                                      |
| ----------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `src`             | string                | URL of the Lottie or DotLottie animation.                                                        |
| `autoplay`        | boolean               | Automatically start the animation.                                                               |
| `loop`            | boolean               | Loop the animation.                                                                              |
| `speed`           | number                | Playback speed.                                                                                  |
| `data`            | string                | Animation data as a string or ArrayBuffer for .lottie animations.                                |
| `segment`         | Array                 | Animation segment as an array of two numbers (start frame and end frame).                        |
| `mode`            | string                | Animation play mode (e.g., "forward", "bounce").                                                 |
| `backgroundColor` | string                | Background color of the canvas. Accepts 6-digit or 8-digit hex color string (e.g., "#000000FF"). |
| `renderConfig`    | Object (RenderConfig) | Configuration for rendering the animation.                                                       |

## RenderConfig

The `renderConfig` object accepts the following properties:

| Property name      | Type   | Required | Default                       | Description             |
| ------------------ | ------ | :------: | ----------------------------- | ----------------------- |
| `devicePixelRatio` | number |          | window\.devicePixelRatio \| 1 | The device pixel ratio. |

### Properties

The `dotlottie-wc` exposes the following properties:

| Property name | Type        | Description                                                                                                                                                |
| ------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dotLottie`   | `DotLottie` | The dotLottie instance from [`DotLottie`](../web/README.md#apis)  , allowing you to call methods and listen to events for more control over the animation. |

## Development

### Setup

```bash
npm install
```

### Dev

```bash
npm run dev
```

### Build

```bash
npm run build
```
