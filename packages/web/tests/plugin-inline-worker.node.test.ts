import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

import { pluginInlineWorker } from '../rolldown-plugins/plugin-inline-worker';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function emitWorkerModule(): Promise<{ code: string; workerSource: string }> {
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

  return { code, workerSource: JSON.parse(match?.[1] as string) as string };
}

// The browser suite never runs this plugin (Vite builds the test worker itself).
describe('pluginInlineWorker', () => {
  test('embeds the worker as a parseable, byte-faithful string literal', async () => {
    const { workerSource } = await emitWorkerModule();

    expect(workerSource.length).toBeGreaterThan(10_000);
    expect(workerSource).toContain('postMessage');

    // Blob workers decode as UTF-8; the round trip also rejects lone surrogates.
    const bytes = new TextEncoder().encode(workerSource);

    expect(new TextDecoder().decode(bytes)).toBe(workerSource);

    // Syntax check on our own build output.
    expect(() => new Function(workerSource)).not.toThrow();
  });

  test('emitted worker source boots and answers an RPC round-trip', async () => {
    const { workerSource } = await emitWorkerModule();

    const replies: Array<{ error?: string; id: string; method: string }> = [];
    const workerScope: {
      onmessage: ((event: { data: unknown }) => Promise<void>) | null;
      postMessage: (message: never) => void;
    } = {
      onmessage: null,
      postMessage: (message) => replies.push(message),
    };

    const globalWithSelf = globalThis as { self?: unknown };
    const originalSelf = globalWithSelf.self;

    globalWithSelf.self = workerScope;

    try {
      // The worker bundle is an iife; evaluating it registers the RPC dispatcher.
      new Function(workerSource)();

      expect(workerScope.onmessage).toBeTypeOf('function');

      await workerScope.onmessage?.({ data: { id: 'smoke', method: '__smoke__', params: {} } });

      expect(replies).toEqual([
        { id: 'smoke', method: '__smoke__', error: expect.stringContaining('not implemented') as string },
      ]);
    } finally {
      globalWithSelf.self = originalSelf;
    }
  });
});
