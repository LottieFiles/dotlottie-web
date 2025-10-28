# @lottiefiles/dotlottie-web

![npm](https://img.shields.io/npm/v/@lottiefiles/dotlottie-web)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@lottiefiles/dotlottie-web)
![npm](https://img.shields.io/npm/dw/@lottiefiles/dotlottie-web)
![jsDelivr hits (npm scoped)](https://img.shields.io/jsdelivr/npm/hw/%40lottiefiles/dotlottie-web)
![NPM](https://img.shields.io/npm/l/@lottiefiles/dotlottie-web)

<p align="center">
  <img src="https://user-images.githubusercontent.com/23125742/201124166-c2a0bc2a-018b-463b-b291-944fb767b5c2.png" alt="dotLottie Logo" />
</p>

## Table of Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Documentation](#documentation)
* [Supported Platforms](#supported-platforms)
  * [Browser Requirements](#browser-requirements)
* [Using DotLottieWorker](#using-dotlottieworker)
  * [Basic Usage](#basic-usage)
  * [Serving the Worker File](#serving-the-worker-file)
  * [Content Security Policy](#content-security-policy)
* [Live Examples](#live-examples)
* [Contributing](#contributing)
* [Issues](#issues)

## Introduction

`@lottiefiles/dotlottie-web` is a JavaScript library for rendering [Lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://dotlottie.io) animations in Node.js and web environments. It provides a simple and intuitive API for loading, playing, and controlling animations, as well as advanced features like interactivity and theming.

### What is dotLottie?

dotLottie is an open-source file format that bundles one or more Lottie animations along with their assets into a single, compressed .lottie file. It uses ZIP compression for efficient storage and distribution. The format also supports advanced features like interactivity and theming, making it a powerful tool for creating dynamic and interactive animations.

[Learn more about dotLottie](https://dotlottie.io/).

## Documentation

To get started with `@lottiefiles/dotlottie-web`, follow the [documentation here](https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/).

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

## Using DotLottieWorker

For performance-intensive applications, `DotLottieWorker` offloads animation rendering to a Web Worker thread. As of the latest version, you must provide the path to the worker file via the `workerUrl` parameter for CSP compliance.

### Basic Usage

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

const canvas = document.querySelector('canvas');

const dotLottie = new DotLottieWorker({
  canvas,
  workerUrl: '/workers/dotlottie-worker.js', // Required: Path to worker file
  src: 'https://lottie.host/path/to/animation.lottie',
  autoplay: true,
  loop: true,
});
```

### Serving the Worker File

You must serve the worker file from your application. Choose one of the following approaches:

#### Option 1: Copy to Public Directory

Copy the worker file to your public/static directory during your build process:

```bash
# Manual copy
cp node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-worker.js public/workers/

# Or add to your build script in package.json
{
  "scripts": {
    "postinstall": "mkdir -p public/workers && cp node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-worker.js public/workers/"
  }
}
```

Then reference it with a static path:

```typescript
const dotLottie = new DotLottieWorker({
  canvas,
  workerUrl: '/workers/dotlottie-worker.js',
  src: 'animation.lottie',
});
```

#### Option 2: Import with Bundler

Modern bundlers like Vite can handle the worker import automatically:

```typescript
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

const dotLottie = new DotLottieWorker({
  canvas,
  workerUrl,
  src: 'animation.lottie',
});
```

For webpack 5, use asset modules:

```typescript
import workerUrl from '@lottiefiles/dotlottie-web/worker';

const dotLottie = new DotLottieWorker({
  canvas,
  workerUrl,
  src: 'animation.lottie',
});
```

### Content Security Policy

This approach allows you to use strict CSP policies without allowing blob workers:

```
Content-Security-Policy: worker-src 'self';
```

If hosting the worker on a CDN:

```
Content-Security-Policy: worker-src 'self' https://cdn.example.com;
```

Note: The old blob-based worker instantiation is no longer supported. The `workerUrl` parameter is required for all `DotLottieWorker` instances.

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
