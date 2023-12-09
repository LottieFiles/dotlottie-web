/**
 * Copyright 2023 Design Barn Inc.
 */

import path from 'node:path';

import { defineConfig } from 'vitest/config';

console.log(path.resolve(__dirname, 'setup-files.ts'));

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
    },
    coverage: {
      provider: 'istanbul',
    },
    testTimeout: 10000,
    cache: false,
    setupFiles: [path.resolve(__dirname, 'setup-files.ts')],
  },
});
