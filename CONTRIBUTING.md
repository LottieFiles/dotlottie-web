# Contributing

Thank you for your interest in contributing to the dotlottie-web monorepo! This guide will help you get set up and contribute effectively.

## Prerequisites

* [Node.js](https://nodejs.org/) (v22+)
* [pnpm](https://pnpm.io/) (v10+)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/LottieFiles/dotlottie-web.git
cd dotlottie-web

# Install dependencies
pnpm install

# Build all packages
pnpm run build
```

## Project Structure

This is a monorepo with the following packages:

| Package                         | Path               | Description                         |
| ------------------------------- | ------------------ | ----------------------------------- |
| `@lottiefiles/dotlottie-web`    | `packages/web/`    | Core player library (canvas + WASM) |
| `@lottiefiles/dotlottie-react`  | `packages/react/`  | React wrapper                       |
| `@lottiefiles/dotlottie-vue`    | `packages/vue/`    | Vue wrapper                         |
| `@lottiefiles/dotlottie-svelte` | `packages/svelte/` | Svelte wrapper                      |
| `@lottiefiles/dotlottie-solid`  | `packages/solid/`  | Solid wrapper                       |
| `@lottiefiles/dotlottie-wc`     | `packages/wc/`     | Web Component wrapper               |

## Development Workflow

```bash
# Start dev mode (all packages)
pnpm run dev

# Run tests
pnpm run test

# Lint
pnpm run lint

# Format
pnpm run format

# Type-check
pnpm run type-check
```

To work on a specific package, run commands from within its directory:

```bash
cd packages/web
pnpm run build
pnpm run test
```

## Making Changes

1. Create a branch from `main`.
2. Make your changes.
3. Ensure linting and tests pass: `pnpm run lint && pnpm run test`.
4. Add a changeset (see below).
5. Open a pull request against `main`.

## Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. Every user-facing change needs a changeset.

```bash
# Add a changeset
pnpm changelog

# Follow the prompts to:
# 1. Select the affected package(s)
# 2. Choose a version bump (patch / minor / major)
# 3. Write a short summary of the change
```

The generated `.md` file in `.changeset/` should be committed with your PR.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

* **Patch** — backward-compatible bug fixes
* **Minor** — new functionality, backward-compatible
* **Major** — breaking API changes

## Pull Requests

Your PR should:

* Clearly describe the changes and motivation.
* Link to related issues (use `Fixes #123`).
* Include tests for new or changed functionality.
* Include a changeset if the change is user-facing.
* Pass all CI checks.
