# @lottiefiles/dotlottie-wc

A web component wrapper for rendering [Lottie](https://lottiefiles.github.io/lottie-docs/) and [DotLottie](https://dotlottie.io) animations in web applications.

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-wc)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40lottiefiles%2Fdotlottie-wc)
![npm](https://img.shields.io/npm/dt/%40lottiefiles%2Fdotlottie-wc)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-wc)

<p align="center">
  <img src="https://user-images.githubusercontent.com/23125742/201124166-c2a0bc2a-018b-463b-b291-944fb767b5c2.png" />
</p>

> 🚧 **Beta Alert:** We're still refining! The APIs in this package may undergo changes.

## Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Installation](#installation)
* [Usage](#usage)
  * [Via npm](#via-npm)
  * [Via CDN](#via-cdn)
* [Live Example](#live-example)
* [APIs](#apis)
  * [Attributes](#attributes)
  * [Methods](#methods)
  * [Events](#events)
* [Development](#development)
  * [Setup](#setup)
  * [Dev](#dev)
  * [Build](#build)

## Introduction

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
<dotlottie-wc src="path/to/animation.lottie" autoplay="true" loop="true"></dotlottie-wc>
```

And import it in your JavaScript or TypeScript module:

```js
import '@lottiefiles/dotlottie-wc';
```

### Via CDN

You can also use the component directly via a CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>@lottiefiles/dotlottie-wc | Basic Example</title>
</head>
<body>
    <dotlottie-wc src="path/to/animation.lottie" autoplay loop></dotlottie-wc>
    <script type="module" src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/index.js"></script>
</body>
</html>
```

## Live Example

[![Edit @lottiefiles/dotlottie-wc basic example](https://codesandbox.io/static/img/play-codesandbox.svg)](LINK_TO_CODESANDBOX_EXAMPLE)

## APIs

### Attributes

| Attribute  | Type    | Description                               |
| ---------- | ------- | ----------------------------------------- |
| `src`      | string  | URL of the Lottie or DotLottie animation. |
| `autoplay` | boolean | Automatically start the animation.        |
| `loop`     | boolean | Loop the animation.                       |
| `speed`    | number  | Playback speed.                           |
| `width`    | string  | Width of the canvas element.              |
| `height`   | string  | Height of the canvas element.             |

### Methods

| Method    | Description                    |
| --------- | ------------------------------ |
| `play()`  | Start or resume the animation. |
| `pause()` | Pause the animation.           |
| `stop()`  | Stop the animation.            |

### Events

| Event   | Description                                       |
| ------- | ------------------------------------------------- |
| `load`  | Fired when the animation is loaded.               |
| `error` | Fired if there is an error loading the animation. |

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
