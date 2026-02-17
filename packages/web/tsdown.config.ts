import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'tsdown';

import { pluginInlineWorker } from './rolldown-plugins/plugin-inline-worker.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig({
  entry: ['./src/index.ts'],
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
    const src = path.resolve(__dirname, 'src/core/dotlottie-player.wasm');
    const dest = path.resolve(__dirname, 'dist/dotlottie-player.wasm');

    await fs.promises.copyFile(src, dest);
  },
});
