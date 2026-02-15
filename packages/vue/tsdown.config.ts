import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/**/*.ts'],
  format: ['esm'],
  dts: true,
  platform: 'browser',
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
});
