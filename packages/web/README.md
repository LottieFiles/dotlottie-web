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
* [Live Examples](#live-examples)
* [Custom Builds](#custom-builds)
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

## Custom Builds

By default, `@lottiefiles/dotlottie-web` ships with pre-built WASM binaries — no Rust toolchain required. If you need to customize the WASM (e.g. strip unused features to reduce bundle size, or enable experimental ones), you can build it yourself directly from this repository.

### Prerequisites

- [Rust](https://rustup.rs/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/)
- `make` (GNU Make or equivalent). On Windows, you can use environments like WSL, MSYS2, or a similar POSIX-compatible shell that provides `make`.
- A C/LLVM toolchain with `clang`/`clang++` available on your `PATH` (the WASM build uses `clang` as configured in `make/wasm.mk`). On macOS, you can use Xcode command-line tools or install LLVM via Homebrew.


The Rust source is provided via the `deps/dotlottie-rs` git submodule. Make sure submodules are initialized before building:

```sh
git submodule update --init --recursive
```

Run the one-time setup from the repo root:

```sh
make setup
```

This installs the `wasm32-unknown-unknown` Rust target and `wasm-pack`.

### Building

From the repo root:

```sh
# Software renderer only (default)
make wasm

# WebGL2 renderer
make wasm-webgl

# WebGPU renderer
make wasm-webgpu

# All three variants
make wasm-all

# Runs pnpm build - Builds all packages and examples
make build
```

Artifacts are built and copied directly into `packages/web/src/{core,webgl,webgpu}/`, replacing the defaults. After building, run `pnpm build` as normal.

You can also use the npm scripts from within packages/web:

```sh
pnpm wasm:build
pnpm wasm:build-webgl
pnpm wasm:build-webgpu
pnpm wasm:build-all
```

### Customizing Feature Flags

Feature flags are defined as variables in `make/wasm.mk` at the repo root. Edit them to add or remove features:

```makefile
# make/wasm.mk
WASM_FEATURES_COMMON ?= tvg,tvg-sw
WASM_FEATURES_SW     ?= $(WASM_FEATURES_COMMON)
WASM_FEATURES_WEBGL  ?= $(WASM_FEATURES_COMMON),tvg-gl,webgl
WASM_FEATURES_WEBGPU ?= $(WASM_FEATURES_COMMON),tvg-wg,webgpu
```

Or override on the command line without editing the file:

```sh
make wasm WASM_FEATURES_SW="tvg,tvg-sw,dotlottie,wasm,wasm-bindgen-api"
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](../../CONTRIBUTING.md) for more details on how to get started with the project locally.

## Issues

Encountered a problem or have a feature request? Log an issue in our [issues](https://github.com/LottieFiles/dotlottie-web/issues) tab. You can also browse through older issues and discussions to find solutions to common problems.
