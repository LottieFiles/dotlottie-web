import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.ts', '!tests/**/*.node.{test,spec}.ts'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      screenshotFailures: false,
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
