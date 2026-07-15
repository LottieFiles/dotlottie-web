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

// set-wasm-url is not an entry: a self-contained copy would configure its own module
// state, not the player bundles'. index.ts inlines it.
const ENTRIES = ['base-dotlottie-wc', 'dotlottie-wc', 'dotlottie-worker-wc', 'index'];

export default defineConfig([
  // One self-contained bundle per entry: a combined build hoists shared code into one
  // chunk, putting worker code in the DotLottie-only bundle.
  ...ENTRIES.map((entry) => ({
    ...config,
    entry: [`./src/${entry}.ts`],
    dts: false,
    // Regex (not bare names) so sub-path exports like lit/decorators.js are bundled too.
    deps: {
      alwaysBundle: Object.keys(pkg.dependencies).map(
        (dep) => new RegExp(`^${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|/)`),
      ),
    },
  })),
  // Declarations only, deps kept external so the .d.ts references '@lottiefiles/dotlottie-web'
  // instead of inlining its type-only `Config` export (rolldown-plugin-dts rejects as MISSING_EXPORT).
  {
    ...config,
    dts: { emitDtsOnly: true },
  },
]);
