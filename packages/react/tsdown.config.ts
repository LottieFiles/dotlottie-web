import fs from 'node:fs';

import { defineConfig, type UserConfig } from 'tsdown';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

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
