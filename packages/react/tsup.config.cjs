const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: false,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  sourcemap: true,
  entry: ['./src/**/*.{ts,tsx}'],
  format: ['esm'],
  platform: 'browser',
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
  external: ['react'],
});
