# ============================================================================
# WASM Build System — wasm32-unknown-unknown + wasm-pack
# ============================================================================
# Prerequisites:
#   rustup target add wasm32-unknown-unknown
#   cargo install wasm-pack  (or: make setup)
#
# Usage:
#   make setup       — install Rust target + wasm-pack
#   make build       — run pnpm build
#   make wasm        — software-renderer build  → src/core/
#   make wasm-webgl  — WebGL2 build             → src/webgl/
#   make wasm-webgpu — WebGPU build             → src/webgpu/
#   make wasm-all    — all three variants
#   make clean       — remove build artefacts
#
# Feature flag overrides (pass on command line or edit defaults below):
#   make wasm WASM_FEATURES_SW="tvg,tvg-sw,dotlottie,wasm,wasm-bindgen-api"
# ============================================================================

DOTLOTTIE_RS_DIR  ?= dotlottie-rs
DOTLOTTIE_RS_CRATE := $(DOTLOTTIE_RS_DIR)/dotlottie-rs
WASM_OUT_BASE     := $(DOTLOTTIE_RS_DIR)/release

WEB_SRC_CORE   := src/core
WEB_SRC_WEBGL  := src/webgl
WEB_SRC_WEBGPU := src/webgpu

WASM_BINDGEN_TARGET := wasm32-unknown-unknown

WASM_FEATURES_COMMON ?= tvg,tvg-sw,tvg-ttf,wasm,wasm-bindgen-api
WASM_FEATURES_SW     ?= $(WASM_FEATURES_COMMON)
WASM_FEATURES_WEBGL  ?= $(WASM_FEATURES_COMMON),tvg-gl,webgl
WASM_FEATURES_WEBGPU ?= $(WASM_FEATURES_COMMON),tvg-wg,webgpu

# sed -i behaves differently on macOS (BSD) vs Linux (GNU)
ifeq ($(shell uname),Darwin)
  SED_I := sed -i ''
else
  SED_I := sed -i
endif

# Apple's system clang lacks the WebAssembly backend.  Use Homebrew LLVM if
# present, otherwise fall back to whatever clang/clang++ is on PATH.
LLVM_PREFIX := $(shell brew --prefix llvm 2>/dev/null)
ifneq ($(LLVM_PREFIX),)
  WASM_CC  := $(LLVM_PREFIX)/bin/clang
  WASM_CXX := $(LLVM_PREFIX)/bin/clang++
else
  WASM_CC  := clang
  WASM_CXX := clang++
endif

BOLD   := \033[1m
CYAN   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RESET  := \033[0m

.PHONY: help setup wasm wasm-webgl wasm-webgpu wasm-all build clean

help:
	@printf "$(BOLD)$(CYAN)dotlottie-web Custom Build System$(RESET)\n"
	@printf "$(CYAN)══════════════════════════════════$(RESET)\n\n"
	@printf "$(BOLD)WASM Targets$(RESET)\n"
	@printf "  make wasm          — software-renderer build\n"
	@printf "  make wasm-webgl    — WebGL2 build\n"
	@printf "  make wasm-webgpu   — WebGPU build\n"
	@printf "  make wasm-all      — all three variants\n\n"
	@printf "$(BOLD)Build$(RESET)\n"
	@printf "  make build         — run pnpm build\n\n"
	@printf "$(BOLD)Setup$(RESET)\n"
	@printf "  make setup         — install Rust target + wasm-pack\n\n"
	@printf "$(BOLD)Clean$(RESET)\n"
	@printf "  make clean         — remove build artefacts\n\n"

# Print build header showing variant, features, and destination
define print_build_info
	@printf "$(BOLD)$(CYAN)┌─────────────────────────────────────────┐$(RESET)\n"
	@printf "$(BOLD)$(CYAN)│  dotlottie-web · WASM Custom Build      │$(RESET)\n"
	@printf "$(BOLD)$(CYAN)└─────────────────────────────────────────┘$(RESET)\n"
	@printf "  $(BOLD)Variant :$(RESET) $(YELLOW)$(1)$(RESET)\n"
	@printf "  $(BOLD)Features:$(RESET) $(GREEN)$(2)$(RESET)\n"
	@printf "  $(BOLD)Output  :$(RESET) $(3)\n\n"
endef

# Install the wasm32-unknown-unknown Rust target and wasm-pack
setup:
	@rustup target add $(WASM_BINDGEN_TARGET)
	@command -v wasm-pack >/dev/null 2>&1 || curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Post-process wasm-bindgen output to fix two issues:
# 1. wasm-bindgen >=0.2 generates `import * as __wbg_star0 from 'env'` unconditionally
#    even when the wasm binary has no env imports.  Browsers reject the bare 'env'
#    specifier, so strip the two dead lines.
# 2. The default module path fallback `new URL('...wasm', import.meta.url)` causes
#    Webpack/Next.js to try resolving the .wasm file at build time, breaking bundled
#    consumers. Replace with a throw since DotLottieWasmLoader always provides a URL.
define strip_env_import
	$(SED_I) \
		-e '/^import \* as __wbg_star0 from .env.;/d' \
		-e '/imports\[.env.\] = __wbg_star0;/d' \
		-e "s|module_or_path = new URL('dotlottie_rs_bg.wasm', import.meta.url);|throw new Error('WASM module URL must be provided via DotLottieWasmLoader or setWasmUrl().');|" \
		$(1)/dotlottie_rs.js
endef

# Copy wasm-pack output artifacts into a web src directory, renaming to dotlottie-player.*
define copy_variant
	mkdir -p $(2)
	cp $(1)/dotlottie_rs_bg.wasm      $(2)/dotlottie-player.wasm
	cp $(1)/dotlottie_rs.js           $(2)/dotlottie-player.js
	cp $(1)/dotlottie_rs.d.ts         $(2)/dotlottie-player.d.ts
	cp $(1)/dotlottie_rs_bg.wasm.d.ts $(2)/dotlottie-player.wasm.d.ts
endef

# Software-renderer build — no graphics API required
wasm:
	$(call print_build_info,Software (core),$(WASM_FEATURES_SW),$(WEB_SRC_CORE))
	CC=$(WASM_CC) CXX=$(WASM_CXX) \
		wasm-pack build $(DOTLOTTIE_RS_CRATE) --target web \
		--out-dir ../release/wasm \
		--no-default-features --features $(WASM_FEATURES_SW)
	$(call strip_env_import,$(WASM_OUT_BASE)/wasm)
	$(call copy_variant,$(WASM_OUT_BASE)/wasm,$(WEB_SRC_CORE))
	@printf "$(BOLD)$(GREEN)✓ Done$(RESET) → $(WEB_SRC_CORE)\n\n"

# WebGL2 build
wasm-webgl:
	$(call print_build_info,WebGL2,$(WASM_FEATURES_WEBGL),$(WEB_SRC_WEBGL))
	CC=$(WASM_CC) CXX=$(WASM_CXX) \
		wasm-pack build $(DOTLOTTIE_RS_CRATE) --target web \
		--out-dir ../release/wasm-webgl \
		--no-default-features --features $(WASM_FEATURES_WEBGL)
	$(call strip_env_import,$(WASM_OUT_BASE)/wasm-webgl)
	$(call copy_variant,$(WASM_OUT_BASE)/wasm-webgl,$(WEB_SRC_WEBGL))
	@printf "$(BOLD)$(GREEN)✓ Done$(RESET) → $(WEB_SRC_WEBGL)\n\n"

# WebGPU build — requires web_sys_unstable_apis cfg for all Gpu* web-sys types
wasm-webgpu:
	$(call print_build_info,WebGPU,$(WASM_FEATURES_WEBGPU),$(WEB_SRC_WEBGPU))
	CC=$(WASM_CC) CXX=$(WASM_CXX) \
		RUSTFLAGS="--cfg=web_sys_unstable_apis" \
		wasm-pack build $(DOTLOTTIE_RS_CRATE) --target web \
		--out-dir ../release/wasm-webgpu \
		--no-default-features --features $(WASM_FEATURES_WEBGPU)
	$(call strip_env_import,$(WASM_OUT_BASE)/wasm-webgpu)
	$(call copy_variant,$(WASM_OUT_BASE)/wasm-webgpu,$(WEB_SRC_WEBGPU))
	@printf "$(BOLD)$(GREEN)✓ Done$(RESET) → $(WEB_SRC_WEBGPU)\n\n"

# Build all three variants
wasm-all: wasm wasm-webgl wasm-webgpu

build:
	pnpm build

# Remove wasm artefacts
clean:
	@cargo clean --manifest-path $(DOTLOTTIE_RS_CRATE)/Cargo.toml --target $(WASM_BINDGEN_TARGET)
	@rm -rf $(WASM_OUT_BASE)/wasm $(WASM_OUT_BASE)/wasm-webgl $(WASM_OUT_BASE)/wasm-webgpu
