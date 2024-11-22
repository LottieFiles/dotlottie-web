const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: false,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  sourcemap: false,
  entry: ['./src/**/*.ts', './src/**/*.tsx'],
  format: ['esm'],
  platform: 'browser',
  target: ['esnext'],
  tsconfig: 'tsconfig.build.json',
  external: ['react'],
});
