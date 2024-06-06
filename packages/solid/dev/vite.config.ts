import { defineConfig } from 'vite';
import path from 'node:path';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	resolve: {
		alias: {
			src: path.resolve(__dirname, '../src'),
		},
	},
	plugins: [
		solidPlugin(),
	],
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
});
