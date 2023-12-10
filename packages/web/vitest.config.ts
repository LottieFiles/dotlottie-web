/**
 * Copyright 2023 Design Barn Inc.
 */

import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
    },
    coverage: {
      provider: 'istanbul',
      reportsDirectory: '.nyc_output',
    },
    testTimeout: 10000,
    cache: false,
    setupFiles: [path.resolve(__dirname, 'setup-files.ts')],
  },
});
