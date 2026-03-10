import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'tsdown';

import { pluginInlineWorker } from './rolldown-plugins/plugin-inline-worker.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig({
  entry: ['./src/index.ts', './src/webgl/index.ts', './src/webgpu/index.ts'],
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
  onSuccess: async () => {
    // Copy software WASM
    await fs.promises.copyFile(
      path.resolve(__dirname, 'src/core/dotlottie-player.wasm'),
      path.resolve(__dirname, 'dist/dotlottie-player.wasm'),
    );

    // Copy WebGL WASM
    const webglDir = path.resolve(__dirname, 'dist/webgl');

    await fs.promises.mkdir(webglDir, { recursive: true });
    await fs.promises.copyFile(
      path.resolve(__dirname, 'src/webgl/dotlottie-player.wasm'),
      path.resolve(webglDir, 'dotlottie-player.wasm'),
    );

    // Copy WebGPU WASM
    const webgpuDir = path.resolve(__dirname, 'dist/webgpu');

    await fs.promises.mkdir(webgpuDir, { recursive: true });
    await fs.promises.copyFile(
      path.resolve(__dirname, 'src/webgpu/dotlottie-player.wasm'),
      path.resolve(webgpuDir, 'dotlottie-player.wasm'),
    );
  },
});
