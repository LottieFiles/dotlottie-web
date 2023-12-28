/**
 * Copyright 2023 Design Barn Inc.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'firefox',
    },
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
      reporter: ['json-summary', 'text-summary', 'lcov'],
    },
    testTimeout: 10000,
    cache: false,
  },
});
