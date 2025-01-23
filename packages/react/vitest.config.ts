import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
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
      include: ['src/**/*.{ts,tsx}'],
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 45,
        branches: 45,
        functions: 45,
        lines: 45,
      },
    },
    testTimeout: 10000,
    cache: false,
    setupFiles: ['./setup-file.ts'],
  },
});
