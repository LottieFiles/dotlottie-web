/**
 * Copyright 2022 Design Barn Inc.
 */

const fs = require('fs');
const path = require('path');

const { defineConfig } = require('tsup');

module.exports = defineConfig((options) => ({
  bundle: true,
  metafile: false,
  splitting: true,
  treeshake: true,
  clean: true,
  dts: true,
  minify: !options.watch,
  sourcemap: true,
  entry: ['./src/*.ts'],
  format: ['esm'],
  platform: 'browser',
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
  onSuccess: () => {
    fs.copyFileSync(
      path.resolve(__dirname, './src/renderer-wasm/bin/renderer.wasm'),
      path.resolve(__dirname, './dist/renderer.wasm'),
    );
  },
  noExternal: ['@dotlottie/dotlottie-js'],
}));
