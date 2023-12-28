/**
 * Copyright 2022 Design Barn Inc.
 */

const fs = require('fs');
const path = require('path');

const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: false,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  minify: false,
  sourcemap: false,
  entry: ['./src/**/*.ts', './src/**/*.js'],
  format: ['esm'],
  platform: 'neutral',
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
  onSuccess: () => {
    fs.copyFileSync(
      path.resolve(__dirname, 'src/wasm/renderer.wasm'),
      path.resolve(__dirname, 'dist/wasm/renderer.wasm'),
    );
  },
});
