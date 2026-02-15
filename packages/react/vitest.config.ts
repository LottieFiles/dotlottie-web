import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      screenshotFailures: false,
    },
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
    setupFiles: ['./setup-file.ts'],
  },
});
