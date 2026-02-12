import { defineConfig, type UserConfig } from 'tsdown';

import pkg from './package.json';

const config: UserConfig = {
  entry: ['./src/index.ts'],
  format: ['esm'],
  dts: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
  external: ['react'],
};

export default defineConfig([
  config,
  // CDN build: Self-contained
  {
    ...config,
    dts: false,
    noExternal: Object.keys(pkg.dependencies),
    outDir: 'dist/browser',
  },
]);
