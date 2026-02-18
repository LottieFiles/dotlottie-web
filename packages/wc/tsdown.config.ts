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
  // Use regex patterns to also match sub-path exports (e.g. lit/decorators.js)
  noExternal: Object.keys(pkg.dependencies).map(
    (dep) => new RegExp(`^${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|/)`),
  ),
  // rolldown-plugin-dts emits false MISSING_EXPORT warnings for type-only imports (e.g. Config interface).
  // tsdown defaults failOnWarn to true in CI, which would fail the build on these false positives.
  failOnWarn: false,
});
