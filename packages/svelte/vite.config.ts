import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type UserConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()] as UserConfig['plugins'],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
