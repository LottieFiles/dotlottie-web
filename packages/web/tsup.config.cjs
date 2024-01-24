/**
 * Copyright 2022 Design Barn Inc.
 */

const fs = require('fs');
const path = require('path');

const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: true,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  minify: false,
  sourcemap: false,
  entry: ['./src/**/*.ts', './src/**/*.js', './src/**/*.mjs'],
  format: ['esm'],
  platform: 'neutral',
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
  onSuccess: () => {
    fs.copyFileSync(
      path.resolve(__dirname, 'src/wasm/renderer.wasm'),
      path.resolve(__dirname, 'dist/wasm/renderer.wasm'),
    );
    fs.copyFileSync(
      path.resolve(__dirname, 'src/core/dotlottie-player.wasm'),
      path.resolve(__dirname, 'dist/core/dotlottie-player.wasm'),
    );
  },
  noExternal: Object.keys(require('./package.json').dependencies),
});
