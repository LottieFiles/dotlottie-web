# dotlottie-web monorepo

![CI](https://github.com/LottieFiles/dotlottie-web/workflows/main/badge.svg)
![GitHub contributors](https://img.shields.io/github/contributors/LottieFiles/dotlottie-web)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)
![GitHub](https://img.shields.io/github/license/LottieFiles/dotlottie-web)

<p align="center">
  <img src="https://user-images.githubusercontent.com/23125742/201124166-c2a0bc2a-018b-463b-b291-944fb767b5c2.png" />
</p>

## Table of Contents

1. [Introduction](#dotlottie-web-monorepo)
2. [What is dotLottie?](#what-is-dotlottie)
3. [Packages](#packages)
4. [Coming Soon Packages](#coming-soon-packages)
5. [Getting Started](#getting-started)
   * [Prerequisites](#prerequisites)
   * [Setup](#setup)
6. [Development](#development)
   * [Building Packages](#building-packages)
   * [Running Locally](#running-locally)
7. [Contributing](#contributing)
8. [Scripts](#scripts)
9. [License](#license)

### Introduction

This is the official repository for LottieFiles' web renderers for Lottie and dotLottie animations. It contains a set of packages that support developers in integrating and managing animations within web applications.

### What is dotLottie?

dotLottie is an open-source file format that aggregates one or more Lottie files and their associated resources into a single file. They are ZIP archives compressed with the Deflate compression method and carry the file extension of ".lottie".

[Learn more about dotLottie](https://dotlottie.io/).

### Packages

The monorepo contains the following package:

* **[@lottiefiles/dotlottie-web](./packages/web/README.md)**: A JavaScript library for rendering Lottie and dotLottie animations in the browser.

Each package has its own README.md with detailed documentation on usage and development.

### Coming Soon Packages

We are actively working on expanding our suite of packages. Here's what's coming soon:

* **@lottiefiles/dotlottie-react**: A React component wrapper for `@lottiefiles/dotlottie-web` that provides a declarative API for rendering Lottie and dotLottie animations and UI controls for interacting with them.

* **@lottiefiles/dotlottie-wc**: A Web Component wrapper for `@lottiefiles/dotlottie-web` that provides a declarative API for rendering Lottie and dotLottie animations and UI controls for interacting with them.

Stay tuned for updates and releases of these new packages!

### Getting Started

To contribute to this monorepo or use its packages in your project, follow these setup steps:

#### Prerequisites

Ensure you have the following installed:

* Node.js version 18 or greater
* `pnpm` version 8

#### Setup

Clone the monorepo:

```bash
git clone https://github.com/LottieFiles/dotlottie-web.git
cd dotlottie-web
```

Install dependencies:

```bash
pnpm install
```

### Development

#### Building Packages

To build all packages within the monorepo:

```bash
pnpm run build
```

#### Running Locally

To start a local development environment for all packages:

```bash
pnpm run dev
```

### Contributing

We welcome contributions to any of the packages in this monorepo. Please read our [Contributing Guidelines](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to the project.

### Scripts

Here's a brief explanation of the scripts available in the root package.json:

* `build`: Builds all packages using turbo.
* `changelog`: Adds a changeset to generate changelog and version updates.
* `clean`: Cleans up the repository by removing development artifacts.
* `dev`: Runs all packages in development/watch mode.
* `format`: Formats the codebase using Prettier and Remark.
* `lint`: Lints the codebase using ESLint.
* `test`: Runs tests across all packages.
* `type-check`: Checks for TypeScript type errors.

For a full list of available scripts, see the `scripts` section in `package.json`.

### License

[MIT](LICENSE) © [LottieFiles](https://www.lottiefiles.com)
