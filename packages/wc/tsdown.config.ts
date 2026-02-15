import fs from 'node:fs';

import { defineConfig } from 'tsdown';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

export default defineConfig({
  entry: ['./src/*.ts'],
  format: ['esm'],
  dts: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
  // To ensure the ESM bundle is self-contained and usable via CDN
  noExternal: Object.keys(pkg.dependencies),
  // rolldown-plugin-dts strips the `type` modifier from `import type { Config }`,
  // causing rolldown to warn that Config is not a value export. It's a false positive.
  checks: { importIsUndefined: false },
});
