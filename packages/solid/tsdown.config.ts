import { defineConfig } from 'tsdown';
import solid from 'unplugin-solid/rolldown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  tsconfig: 'tsconfig.build.json',
  external: ['solid-js'],
  fixedExtension: false,
  plugins: [solid()],
});
