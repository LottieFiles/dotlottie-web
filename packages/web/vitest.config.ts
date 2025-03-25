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
    retry: 1,
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.worker.ts'],
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 51,
        branches: 58,
        functions: 52,
        lines: 52,
      },
    },
    testTimeout: 10000,
    cache: false,
    setupFiles: ['./tests/setup.ts'],
  },
});
