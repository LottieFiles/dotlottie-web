import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
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
      include: ['src/**/*.{ts,tsx}'],
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 95,
        branches: 89,
        functions: 95,
        lines: 95,
      },
    },
    testTimeout: 10000,
    cache: false,
    setupFiles: ['./setup-file.ts'],
  },
});
