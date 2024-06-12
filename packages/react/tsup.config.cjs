const { defineConfig } = require('tsup');

module.exports = defineConfig({
  bundle: true,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  minify: false,
  sourcemap: false,
  entry: ['./src/index.ts'],
  format: ['esm'],
  platform: 'browser',
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
  // To provide an esm build without any external dependencies
  noExternal: Object.keys(require('./package.json').dependencies),
  external: ['react'],
});
