import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
const config = defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'development' ? '/' : '/dotlottie-web/',
  publicDir: '../../fixtures',
}));

export default config;
