/**
 * Copyright 2022 Design Barn Inc.
 */

const { defineConfig } = require('tsup');

const pkg = require('./package.json');

module.exports = defineConfig({
  bundle: true,
  metafile: false,
  splitting: true,
  treeshake: true,
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
  entry: ['./src/*.ts'],
  format: ['esm'],
  platform: 'browser',
  target: ['es2020', 'chrome58', 'firefox57', 'safari11'],
  tsconfig: 'tsconfig.build.json',
  // To ensure the ESM bundle is self-contained and usable via CDN
  noExternal: Object.keys(pkg.dependencies),
});
