/**
 * Copyright 2022 Design Barn Inc.
 */

const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: true,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
  entry: ['./src/index.ts'],
  format: ['esm'],
  platform: 'browser',
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
  // This is required for usage in framer
  noExternal: Object.keys(require('./package.json').dependencies),
  external: ['react'],
});
