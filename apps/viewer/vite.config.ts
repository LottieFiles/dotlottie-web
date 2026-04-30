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
}));

export default config;
