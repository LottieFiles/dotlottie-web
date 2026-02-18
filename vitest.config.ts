import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@lottiefiles/dotlottie-web': path.resolve(__dirname, 'packages/web/src/index.ts'),
    },
  },
  test: {
    projects: [
      'packages/web/vitest.config.ts',
      'packages/web/vitest.config.node.ts',
      'packages/react/vitest.config.ts',
      'packages/wc/vitest.config.ts',
    ],
  },
});
