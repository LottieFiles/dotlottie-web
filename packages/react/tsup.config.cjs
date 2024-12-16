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
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
  external: ['react'],
});
