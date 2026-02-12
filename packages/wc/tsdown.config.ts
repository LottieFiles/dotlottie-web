import { defineConfig } from 'tsdown';

import pkg from './package.json';

export default defineConfig({
  entry: ['./src/*.ts'],
  format: ['esm'],
  dts: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
  // To ensure the ESM bundle is self-contained and usable via CDN
  noExternal: Object.keys(pkg.dependencies),
});
