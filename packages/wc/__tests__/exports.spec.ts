import { describe, expect, test } from 'vitest';

describe('entry module exports', () => {
  test('index exports setWasmUrl', async () => {
    const mod: Record<string, unknown> = await import('../src');

    expect(typeof mod['setWasmUrl']).toBe('function');
  });

  test('dotlottie-wc entry exports setWasmUrl', async () => {
    const mod: Record<string, unknown> = await import('../src/dotlottie-wc');

    expect(typeof mod['setWasmUrl']).toBe('function');
  });

  test('dotlottie-worker-wc entry exports setWasmUrl', async () => {
    const mod: Record<string, unknown> = await import('../src/dotlottie-worker-wc');

    expect(typeof mod['setWasmUrl']).toBe('function');
  });
});
