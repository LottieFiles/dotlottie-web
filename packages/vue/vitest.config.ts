import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const webPkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../web/package.json'), 'utf-8'));

export default defineConfig({
  define: {
    __PACKAGE_NAME__: JSON.stringify(webPkg.name),
    __PACKAGE_VERSION__: JSON.stringify(webPkg.version),
  },
  resolve: {
    alias: {
      '@lottiefiles/dotlottie-web': path.resolve(__dirname, '../web/src/index.ts'),
    },
  },
  test: {
    name: 'vue',
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      screenshotFailures: false,
    },
    testTimeout: 10000,
    setupFiles: ['./setup-file.ts'],
  },
});
