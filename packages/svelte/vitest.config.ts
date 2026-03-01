import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['browser'],
  },
  test: {
    name: 'svelte',
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      screenshotFailures: false,
    },
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'istanbul',
      include: ['src/lib/**/*.{ts,svelte}'],
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
