/**
 * Copyright 2023 Design Barn Inc.
 */

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
      exclude: ['src/renderer-wasm/bin/renderer.js'],
    },
    testTimeout: 10000,
    cache: false,
  },
});
