/**
 * Copyright 2022 Design Barn Inc.
 */

const { defineConfig } = require('tsup');

const pkg = require('./package.json');

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
  target: ['es2020', 'chrome58'],
  tsconfig: 'tsconfig.build.json',
  loader: {
    '.svg': 'text',
  },
  // To ensure the ESM bundle is self-contained and usable via CDN
  noExternal: Object.keys(pkg.dependencies),
}));
