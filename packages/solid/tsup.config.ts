import { solidPlugin } from 'esbuild-plugin-solid';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  sourcemap: true,
  format: ['esm'],
  tsconfig: 'tsconfig.build.json',
  external: ['solid-js'],
  esbuildPlugins: [solidPlugin() as any],
});
