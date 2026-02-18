import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig({
  define: {
    __PACKAGE_NAME__: JSON.stringify(pkg.name),
    __PACKAGE_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    name: 'web',
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['tests/**/*.node.{test,spec}.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      screenshotFailures: false,
    },
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.worker.ts'],
      reporter: ['json', 'json-summary', 'text-summary', 'lcov'],
      thresholds: {
        statements: 55,
        branches: 53,
        functions: 59,
        lines: 59,
      },
    },
    testTimeout: 10000,
    setupFiles: ['./tests/setup.ts'],
  },
});
