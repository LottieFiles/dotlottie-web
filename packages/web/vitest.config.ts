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
      include: ['src/**/*.ts'],
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 84,
        branches: 76,
        functions: 86,
        lines: 85,
      },
    },
    testTimeout: 10000,
    cache: false,
    setupFiles: ['./tests/setup.ts'],
  },
});
