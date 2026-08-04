import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
const config = defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'development' ? '/' : '/dotlottie-web/',
  publicDir: '../../fixtures',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        // Playground runtime: the workspace dotlottie-web build the preview
        // iframe's import map resolves to. Needs a stable, un-hashed name so
        // the iframe can reference it by URL.
        'playground-local-dotlottie': resolve(__dirname, 'src/playground/local-dotlottie.ts'),
      },
      output: {
        entryFileNames: (chunk: { name: string }): string =>
          chunk.name === 'playground-local-dotlottie' ? '[name].js' : 'assets/[name]-[hash].js',
      },
    },
  },
}));

export default config;
