import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

import { pluginInlineWorker } from '../rolldown-plugins/plugin-inline-worker';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The browser suite never runs this plugin (Vite builds the test worker itself).
describe('pluginInlineWorker', () => {
  test('embeds the worker as a parseable, byte-faithful string literal', async () => {
    const plugin = pluginInlineWorker({ name: '@lottiefiles/dotlottie-web', version: '0.0.0-test' });

    const workerPath = path.resolve(__dirname, '../src/worker/dotlottie.worker.ts');
    const resolved = plugin.resolveId?.(`${workerPath}?worker&inline`, undefined);

    expect(resolved).not.toBeNull();
    expect(resolved?.moduleSideEffects).toBe(false);

    const result = await plugin.load?.(resolved?.id as string);

    expect(result).not.toBeNull();
    expect(result?.moduleSideEffects).toBe(false);

    const code = result?.code as string;
    const match = /const workerCode = (".*");/u.exec(code);

    expect(match).not.toBeNull();

    const workerSource = JSON.parse(match?.[1] as string) as string;

    expect(workerSource.length).toBeGreaterThan(10_000);
    expect(workerSource).toContain('postMessage');

    // Blob workers decode as UTF-8; the round trip also rejects lone surrogates.
    const bytes = new TextEncoder().encode(workerSource);

    expect(new TextDecoder().decode(bytes)).toBe(workerSource);

    // Syntax check on our own build output (never executed).
    expect(() => new Function(workerSource)).not.toThrow();
  });
});
