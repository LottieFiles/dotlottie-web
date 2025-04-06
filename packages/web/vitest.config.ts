import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
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
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 70,
        branches: 66,
        functions: 70,
        lines: 74,
      },
      // Exclude worker script from code coverage as it runs in a separate context
      // and cannot be properly instrumented by the coverage provider
      // See: https://github.com/vitest-dev/vitest/issues/4899
      exclude: ['src/worker/dotlottie.worker.ts'],
    },
    testTimeout: 10000,
    cache: false,
    setupFiles: ['./tests/setup.ts'],
  },
});
