import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      screenshotFailures: false,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 98,
        branches: 94,
        functions: 100,
        lines: 98,
      },
    },
    testTimeout: 10000,
    cache: false,
  },
});
