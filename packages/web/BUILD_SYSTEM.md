# Custom Builds

By default, `@lottiefiles/dotlottie-web` ships with pre-built WASM binaries — no Rust toolchain required. If you need to customize the WASM (e.g. strip unused features to reduce bundle size, or enable experimental ones), you can build it yourself directly from this repository.

### Prerequisites

* [Rust](https://rustup.rs/)
* [wasm-bindgen-cli](https://rustwasm.github.io/wasm-bindgen/) (installed automatically via `make setup`)
* `make` (GNU Make or equivalent). On Windows, you can use environments like WSL, MSYS2, or a similar POSIX-compatible shell that provides `make`.
* A C/LLVM toolchain with `clang`/`clang++` available on your `PATH` (the WASM build uses `clang` as configured in `make/wasm.mk`). On macOS, you can use Xcode command-line tools or install LLVM via Homebrew.

The Rust source is provided via the `deps/dotlottie-rs` git submodule. Make sure submodules are initialized before building:

```sh
git submodule update --init --recursive
```

Run the one-time setup from the repo root:

```sh
make setup
```

This installs the `wasm32-unknown-unknown` Rust target and `wasm-bindgen-cli` (version-matched to the `wasm-bindgen` crate in `Cargo.lock`).

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
WASM_FEATURES_COMMON ?= tvg,tvg-cpu
WASM_FEATURES_SW     ?= $(WASM_FEATURES_COMMON)
WASM_FEATURES_WEBGL  ?= $(WASM_FEATURES_COMMON),tvg-gl,webgl
WASM_FEATURES_WEBGPU ?= $(WASM_FEATURES_COMMON),tvg-wg,webgpu
```

Or override on the command line without editing the file:

```sh
make wasm WASM_FEATURES_SW="tvg,tvg-cpu,dotlottie,wasm-bindgen-api"
```
