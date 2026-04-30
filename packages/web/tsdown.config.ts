import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, type UserConfig } from 'tsdown';

import { pluginInlineWorker } from './rolldown-plugins/plugin-inline-worker.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

const sharedConfig: UserConfig = {
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  sourcemap: true,
  platform: 'neutral',
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
  define: {
    __PACKAGE_VERSION__: JSON.stringify(pkg.version),
    __PACKAGE_NAME__: JSON.stringify(pkg.name),
  },
  plugins: [pluginInlineWorker(pkg)],
};

export default [
  defineConfig({
    ...sharedConfig,
    entry: { index: './src/index.ts' },
    onSuccess: async () => {
      const dir = path.resolve(__dirname, 'dist');

      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.copyFile(
        path.resolve(__dirname, 'src/core/dotlottie-player.wasm'),
        path.resolve(dir, 'dotlottie-player.wasm'),
      );
    },
  }),
  defineConfig({
    ...sharedConfig,
    entry: { 'webgl/index': './src/webgl/index.ts' },
    onSuccess: async () => {
      const dir = path.resolve(__dirname, 'dist/webgl');

      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.copyFile(
        path.resolve(__dirname, 'src/webgl/dotlottie-player.wasm'),
        path.resolve(dir, 'dotlottie-player.wasm'),
      );
    },
  }),
  defineConfig({
    ...sharedConfig,
    entry: { 'webgpu/index': './src/webgpu/index.ts' },
    onSuccess: async () => {
      const dir = path.resolve(__dirname, 'dist/webgpu');

      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.copyFile(
        path.resolve(__dirname, 'src/webgpu/dotlottie-player.wasm'),
        path.resolve(dir, 'dotlottie-player.wasm'),
      );
    },
  }),
];
