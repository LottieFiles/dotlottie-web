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
  deps: { neverBundle: ['react'] },
};

const cdnDeps = { neverBundle: ['react'], alwaysBundle: Object.keys(pkg.dependencies) };

export default defineConfig([
  config,
  // CDN build: Self-contained
  {
    ...config,
    dts: false,
    deps: cdnDeps,
    outDir: 'dist/browser',
  },
  // WebGL
  {
    ...config,
    entry: { 'webgl/index': './src/webgl/index.tsx' },
  },
  // WebGL CDN build
  {
    ...config,
    entry: { 'webgl/index': './src/webgl/index.tsx' },
    dts: false,
    deps: cdnDeps,
    outDir: 'dist/browser',
  },
  // WebGPU
  {
    ...config,
    entry: { 'webgpu/index': './src/webgpu/index.tsx' },
  },
  // WebGPU CDN build
  {
    ...config,
    entry: { 'webgpu/index': './src/webgpu/index.tsx' },
    dts: false,
    deps: cdnDeps,
    outDir: 'dist/browser',
  },
]);
