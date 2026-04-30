#!/usr/bin/env bash
#
# Copy wasm-bindgen release artifacts from dotlottie-rs into packages/web/src.
#
# Usage:
#   ./scripts/copy-wasm-artifacts.sh [DOTLOTTIE_RS_DIR]
#
# DOTLOTTIE_RS_DIR defaults to the sibling dotlottie-rs repo.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_SRC="$SCRIPT_DIR/../src"
RS_DIR="${1:-$(cd "$SCRIPT_DIR/../../../../dotlottie-rs" 2>/dev/null && pwd || echo "")}"

if [[ -z "$RS_DIR" || ! -d "$RS_DIR/release" ]]; then
  echo "Error: dotlottie-rs release dir not found."
  echo "Usage: $0 [path/to/dotlottie-rs]"
  exit 1
fi

RELEASE="$RS_DIR/release"

copy_variant() {
  local src_dir="$1"
  local dst_dir="$2"
  local label="$3"

  if [[ ! -d "$src_dir" ]]; then
    echo "  SKIP $label (not found: $src_dir)"
    return
  fi

  mkdir -p "$dst_dir"

  cp "$src_dir/dotlottie_rs_bg.wasm"      "$dst_dir/dotlottie-player.wasm"
  cp "$src_dir/dotlottie_rs.js"            "$dst_dir/dotlottie-player.js"
  cp "$src_dir/dotlottie_rs.d.ts"          "$dst_dir/dotlottie-player.d.ts"
  cp "$src_dir/dotlottie_rs_bg.wasm.d.ts"  "$dst_dir/dotlottie-player.wasm.d.ts"

  echo "  OK   $label -> $(basename "$dst_dir")/"
}

echo "Copying WASM artifacts from: $RELEASE"
echo "Destination:                 $WEB_SRC"
echo ""

copy_variant "$RELEASE/wasm"    "$WEB_SRC/core"   "software"
copy_variant "$RELEASE/wasm-webgl" "$WEB_SRC/webgl"  "webgl"
copy_variant "$RELEASE/wasm-webgpu" "$WEB_SRC/webgpu" "webgpu"

echo ""
echo "Done. Rebuild with: pnpm run build"
