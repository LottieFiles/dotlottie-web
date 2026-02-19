import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'wc',
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      screenshotFailures: false,
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 98,
        branches: 91,
        functions: 100,
        lines: 98,
      },
    },
    testTimeout: 10000,
  },
});
