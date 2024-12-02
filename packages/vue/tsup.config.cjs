const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: false,
  metafile: false,
  treeshake: true,
  clean: true,
  dts: true,
  minify: false,
  sourcemap: true,
  entry: ['./src/**/*.ts'],
  format: ['esm'],
  platform: 'browser',
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
});
