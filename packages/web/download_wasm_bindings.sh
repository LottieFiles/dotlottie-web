#!/bin/bash

# Define version and other variables
VERSION="0.1.46"
URL="https://github.com/LottieFiles/dotlottie-rs/releases/download/v${VERSION}/dotlottie-player.wasm.tar.gz"
TARGET_DIR="./src/core"
TEMP_DIR="./.tmp/wasm"

# Function to check command success
check_success() {
  if [ $? -ne 0 ]; then
    echo "$1 failed. Exiting."
    exit 1
  fi
}

# Create a temporary directory for extraction
mkdir -p "$TEMP_DIR" && cd "$TEMP_DIR"
check_success "Directory setup"

# Download the file
echo "Downloading dotlottie-player.wasm.tar.gz..."
curl -L "$URL" -o dotlottie-player.wasm.tar.gz
check_success "Download"

# Extract the downloaded file
echo "Extracting files..."
tar -xzf dotlottie-player.wasm.tar.gz
check_success "Extraction"

# Copy the necessary files to the target directory
echo "Copying DotLottiePlayer.mjs and DotLottiePlayer.wasm to $TARGET_DIR"
cp DotLottiePlayer.wasm "../../${TARGET_DIR}/dotlottie-player.wasm"
cp DotLottiePlayer.mjs "../../${TARGET_DIR}/dotlottie-player.js"
cp DotLottiePlayer.d.ts "../../${TARGET_DIR}/dotlottie-player.types.ts"
check_success "Copy"

echo "Operation completed successfully."
