import { solidPlugin } from 'esbuild-plugin-solid';
import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['./src/index.ts'],
  clean: true,
  dts: true,
  format: ['esm'],
  tsconfig: './tsconfig.build.json',
  external: ['solid-js'],
  esbuildPlugins: [solidPlugin()],
  ...options,
}));
