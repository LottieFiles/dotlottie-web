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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  esbuildPlugins: [solidPlugin() as any],
});
