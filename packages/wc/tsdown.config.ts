import fs from 'node:fs';

import { defineConfig, type UserConfig } from 'tsdown';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

const config: UserConfig = {
  entry: ['./src/*.ts'],
  format: ['esm'],
  minify: true,
  sourcemap: true,
  platform: 'browser',
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
};

export default defineConfig([
  // Self-contained JS bundle (usable via CDN); .d.ts is emitted by the config below.
  {
    ...config,
    dts: false,
    // Regex (not bare names) so sub-path exports like lit/decorators.js are bundled too.
    deps: {
      alwaysBundle: Object.keys(pkg.dependencies).map(
        (dep) => new RegExp(`^${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|/)`),
      ),
    },
  },
  // Declarations only, deps kept external so the .d.ts references '@lottiefiles/dotlottie-web'
  // instead of inlining its type-only `Config` export (rolldown-plugin-dts rejects as MISSING_EXPORT).
  {
    ...config,
    dts: { emitDtsOnly: true },
  },
]);
