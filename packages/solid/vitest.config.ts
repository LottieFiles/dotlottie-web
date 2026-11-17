import path from 'node:path';
import { fileURLToPath } from 'node:url';
import solid from 'unplugin-solid/vite';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@lottiefiles/dotlottie-web': path.resolve(__dirname, '../web/src/index.ts'),
    },
  },
  test: {
    name: 'solid',
    environment: 'node',
  },
});
