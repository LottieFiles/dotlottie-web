# ============================================================================
# WASM Build System — wasm32-unknown-unknown + wasm-bindgen
# ============================================================================
# Prerequisites:
#   rustup target add wasm32-unknown-unknown
#   cargo install wasm-bindgen-cli  (or: make setup)
#
# Usage:
#   make setup       — install Rust target + wasm-bindgen-cli
#   make build       — run pnpm build
#   make wasm        — software-renderer build  → src/core/
#   make wasm-webgl  — WebGL2 build             → src/webgl/
#   make wasm-webgpu — WebGPU build             → src/webgpu/
#   make wasm-all    — all three variants
#   make clean       — remove build artefacts
#
# Feature flag overrides (pass on command line or edit defaults below):
#   make wasm WASM_FEATURES_SW="tvg,tvg-cpu,dotlottie,wasm-bindgen-api"
# ============================================================================

DOTLOTTIE_RS_DIR  ?= dotlottie-rs
DOTLOTTIE_RS_CRATE := $(DOTLOTTIE_RS_DIR)/dotlottie-rs
WASM_OUT_BASE     := $(DOTLOTTIE_RS_DIR)/release

WEB_SRC_CORE   := src/core
WEB_SRC_WEBGL  := src/webgl
WEB_SRC_WEBGPU := src/webgpu

WASM_TARGET := wasm32-unknown-unknown
WASM_MANIFEST := $(DOTLOTTIE_RS_CRATE)/Cargo.toml
WASM_ARTIFACT := $(DOTLOTTIE_RS_CRATE)/target/$(WASM_TARGET)/release/dotlottie_rs.wasm
WASM_LOCKFILE := $(DOTLOTTIE_RS_CRATE)/Cargo.lock

WASM_FEATURES_COMMON ?= tvg,tvg-cpu,tvg-png,tvg-jpg,tvg-webp,tvg-ttf,tvg-lottie-expressions,dotlottie,theming,state-machines,wasm-bindgen-api
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

comma := ,

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
	@printf "  make setup         — install Rust target + wasm-bindgen-cli\n\n"
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

# Install the wasm32-unknown-unknown Rust target and wasm-bindgen-cli (version-matched)
setup:
	@rustup target add $(WASM_TARGET)
	@if [ ! -f $(WASM_LOCKFILE) ]; then cargo generate-lockfile --manifest-path $(WASM_MANIFEST); fi
	@cargo install wasm-bindgen-cli \
		--version "$$(grep -A1 'name = "wasm-bindgen"' $(WASM_LOCKFILE) | grep version | head -1 | sed 's/.*"\(.*\)"/\1/')" \
		--locked

# Build a WASM variant using cargo rustc + wasm-bindgen + wasm-opt
# $(1) = extra features (e.g. tvg-gl,webgl)
# $(2) = extra RUSTFLAGS (e.g. --cfg=web_sys_unstable_apis)
# $(3) = output directory (e.g. $(WASM_OUT_BASE)/wasm)
# $(4) = web src directory (e.g. $(WEB_SRC_CORE))
define wasm_build
	@mkdir -p $(3)
	CC=$(WASM_CC) CXX=$(WASM_CXX) RUSTFLAGS="$(2)" \
		cargo rustc \
			--manifest-path $(WASM_MANIFEST) \
			--crate-type cdylib \
			--target $(WASM_TARGET) \
			--release \
			--no-default-features \
			--features $(WASM_FEATURES_COMMON)$(if $(1),$(comma)$(1))
	wasm-bindgen $(WASM_ARTIFACT) \
		--out-dir $(3) \
		--target web \
		--typescript
	@if command -v wasm-opt >/dev/null 2>&1; then \
		wasm-opt $(3)/dotlottie_rs_bg.wasm -o $(3)/dotlottie_rs_bg.wasm -O3; \
	fi
	@# Replace import.meta.url fallback — bundlers (webpack/Next.js) try to resolve
	@# the .wasm path at build time.  DotLottieWasmLoader always provides a URL.
	$(SED_I) \
		"s|module_or_path = new URL('dotlottie_rs_bg.wasm', import.meta.url);|throw new Error('WASM module URL must be provided via DotLottieWasmLoader or setWasmUrl().');|" \
		$(3)/dotlottie_rs.js
	mkdir -p $(4)
	cp $(3)/dotlottie_rs_bg.wasm      $(4)/dotlottie-player.wasm
	cp $(3)/dotlottie_rs.js           $(4)/dotlottie-player.js
	cp $(3)/dotlottie_rs.d.ts         $(4)/dotlottie-player.d.ts
	cp $(3)/dotlottie_rs_bg.wasm.d.ts $(4)/dotlottie-player.wasm.d.ts
endef

# Software-renderer build — no graphics API required
wasm:
	$(call print_build_info,Software (core),$(WASM_FEATURES_SW),$(WEB_SRC_CORE))
	$(call wasm_build,,,$(WASM_OUT_BASE)/wasm,$(WEB_SRC_CORE))
	@printf "$(BOLD)$(GREEN)✓ Done$(RESET) → $(WEB_SRC_CORE)\n\n"

# WebGL2 build
wasm-webgl:
	$(call print_build_info,WebGL2,$(WASM_FEATURES_WEBGL),$(WEB_SRC_WEBGL))
	$(call wasm_build,tvg-gl$(comma)webgl,,$(WASM_OUT_BASE)/wasm-webgl,$(WEB_SRC_WEBGL))
	@printf "$(BOLD)$(GREEN)✓ Done$(RESET) → $(WEB_SRC_WEBGL)\n\n"

# WebGPU build — requires web_sys_unstable_apis cfg for all Gpu* web-sys types
wasm-webgpu:
	$(call print_build_info,WebGPU,$(WASM_FEATURES_WEBGPU),$(WEB_SRC_WEBGPU))
	$(call wasm_build,tvg-wg$(comma)webgpu,--cfg=web_sys_unstable_apis,$(WASM_OUT_BASE)/wasm-webgpu,$(WEB_SRC_WEBGPU))
	@printf "$(BOLD)$(GREEN)✓ Done$(RESET) → $(WEB_SRC_WEBGPU)\n\n"

# Build all three variants
wasm-all: wasm wasm-webgl wasm-webgpu

build:
	pnpm build

# Remove wasm artefacts
clean:
	@cargo clean --manifest-path $(WASM_MANIFEST) --target $(WASM_TARGET)
	@rm -rf $(WASM_OUT_BASE)/wasm $(WASM_OUT_BASE)/wasm-webgl $(WASM_OUT_BASE)/wasm-webgpu
