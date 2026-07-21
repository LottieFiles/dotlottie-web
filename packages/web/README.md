# @lottiefiles/dotlottie-web

> [!TIP]
> Looking for animations to use with this player? Browse **[100,000+ free Lottie animations](https://lottiefiles.com/free-animations?utm_source=npm&utm_medium=readme)** and grab any of them as `.lottie` or `.json`, or create your own with [Lottie Creator](https://lottiefiles.com/lottie-creator?utm_source=npm&utm_medium=readme).


![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-web)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@lottiefiles/dotlottie-web)
![npm](https://img.shields.io/npm/dw/@lottiefiles/dotlottie-web)
![jsDelivr hits (npm scoped)](https://img.shields.io/jsdelivr/npm/hw/%40lottiefiles/dotlottie-web)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-web)

<p align="center">
  <img src="https://lottie.host/43f43646-b018-4d72-a96b-02a929cd9727/gARxdIetbE.svg" alt="dotLottie Web" width="550" />
</p>

## Table of Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Documentation](#documentation)
* [Faster First Frame](#faster-first-frame)
* [Supported Platforms](#supported-platforms)
  * [Browser Requirements](#browser-requirements)
* [Live Examples](#live-examples)
* [Contributing](#contributing)
* [Issues](#issues)

## Introduction

`@lottiefiles/dotlottie-web` is a JavaScript library for rendering [Lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://lottiefiles.com/dotlottie) animations in Node.js and web environments. It provides a simple and intuitive API for loading, playing, and controlling animations, as well as advanced features like interactivity and theming.

### What is dotLottie?

dotLottie is an open-source file format that bundles one or more Lottie animations along with their assets into a single, compressed .lottie file. It uses ZIP compression for efficient storage and distribution. The format also supports advanced features like interactivity and theming, making it a powerful tool for creating dynamic and interactive animations.

[Learn more about dotLottie](https://lottiefiles.com/dotlottie).

## Documentation

To get started with `@lottiefiles/dotlottie-web`, follow the [documentation here](https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/).

## Faster First Frame

The player's WASM engine (\~500 KB compressed) is fetched from a CDN when the first player is constructed. To take that download off your first animation's critical path:

```js
import { DotLottie } from '@lottiefiles/dotlottie-web';

// At app or route load, before any player is constructed:
DotLottie.preload();
```

Or let the browser start the download even earlier (`crossorigin` is required — without it the preloaded response can't be reused and the file downloads twice):

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" />
<link
  rel="preload"
  as="fetch"
  crossorigin
  href="https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.77.1/dist/dotlottie-player.wasm"
/>
```

The version in the URL must match your installed package version — the player fetches a version-pinned URL, and a mismatch means the preload can't be reused. If you use `setWasmUrl()`, call it before `preload()` and point the preload tag at the same URL.

## Supported Platforms

`@lottiefiles/dotlottie-web` is an isomorphic library designed to work in both browser and Node.js environments. It supports Node.js version 18 and higher, as well as all major web browsers.

### Browser Requirements

The library requires modern browser features for optimal performance. The following browser APIs are essential:

| Feature             | Required   | Can I Use                                                      |
| ------------------- | ---------- | -------------------------------------------------------------- |
| **WebAssembly**     | ✅ Yes      | [WebAssembly support](https://caniuse.com/wasm)                |
| **Canvas 2D API**   | ✅ Yes      | [Canvas 2D support](https://caniuse.com/canvas)                |
| **Fetch API**       | ✅ Yes      | [Fetch API support](https://caniuse.com/fetch)                 |
| **Web Workers**     | Optional\* | [Web Workers support](https://caniuse.com/webworkers)          |
| **OffscreenCanvas** | Optional\* | [OffscreenCanvas support](https://caniuse.com/offscreencanvas) |

\*Optional features enhance performance but aren't required for basic functionality.

#### Minimum Browser Versions

Based on WebAssembly support requirements:

* **Chrome**: 57+ (March 2017)
* **Firefox**: 52+ (March 2017)
* **Safari**: 11+ (September 2017)
* **Edge**: 16+ (October 2017)
* **Opera**: 44+ (March 2017)
* **iOS Safari**: 11+ (September 2017)
* **Android Browser**: 81+ (February 2020)

#### Enhanced Features

* **Web Workers**: Enable background processing for better performance
* **OffscreenCanvas**: Allow rendering on worker threads for improved responsiveness

For legacy browser support, consider using WebAssembly polyfills, though performance may be significantly reduced.

## Live Examples

Explore these CodePen examples to see `@lottiefiles/dotlottie-web` in action:

* [Getting Started](https://codepen.io/lottiefiles/pen/JjzJZmL)
* [Controlling Animation Playback](https://codepen.io/lottiefiles/pen/dyrRKwg)
* [Dynamic Animation Loading](https://codepen.io/lottiefiles/pen/JjzJZgB)
* [dotLottie Worker](https://codepen.io/lottiefiles/pen/VwJZPrQ)
* [Multi Animations .lottie file](https://codepen.io/lottiefiles/pen/wvOxdRa)
* [Advanced Animation Layout](https://codepen.io/lottiefiles/pen/LYvZveR)
* [Named Markers](https://codepen.io/lottiefiles/pen/RwOROKp)
* [dotLottie Theming](https://codepen.io/lottiefiles/pen/BaEzEeq)
* [dotLottie Interactivity](https://codepen.io/lottiefiles/pen/VwJvdRN)

## Contributing

We welcome contributions! Please see our [contributing guidelines](../../CONTRIBUTING.md) for more details on how to get started with the project locally.

## Issues

Encountered a problem or have a feature request? Log an issue in our [issues](https://github.com/LottieFiles/dotlottie-web/issues) tab. You can also browse through older issues and discussions to find solutions to common problems.
