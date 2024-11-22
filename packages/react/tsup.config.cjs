const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: true,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  minify: false,
  sourcemap: true,
  entry: ['./src/index.ts'],
  format: ['esm'],
  platform: 'browser',
  target: ['esnext'],
  tsconfig: 'tsconfig.build.json',
  external: ['react', 'react-dom'],
});
