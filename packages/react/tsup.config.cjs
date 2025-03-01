const { defineConfig } = require('tsup');

const config = {
  bundle: true,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
  entry: ['./src/index.ts', './src/webgl/index.ts', './src/webgpu/index.ts'],
  format: ['esm'],
  platform: 'browser',
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
  external: ['react'],
};

module.exports = defineConfig([
  config,
  // CDN build: Self-contained
  {
    ...config,
    dts: false,
    format: ['esm'],
    noExternal: Object.keys(require('./package.json').dependencies),
    outDir: 'dist/browser',
  },
]);
