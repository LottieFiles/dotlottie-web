import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
const config = defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'development' ? '/' : '/dotlottie-web/',
}));

export default config;
