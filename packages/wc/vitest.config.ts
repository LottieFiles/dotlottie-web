import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      screenshotFailures: false,
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 97,
        branches: 90,
        functions: 100,
        lines: 97,
      },
    },
    testTimeout: 10000,
    cache: false,
  },
});
