import fs from 'node:fs';
import { afterEach, beforeAll, expect, test, vi } from 'vitest';

import { DotLottie } from '../src/dotlottie';

const fixture = JSON.parse(fs.readFileSync(new URL('../../../fixtures/woman.json', import.meta.url), 'utf-8'));
const olderAnimation = JSON.stringify({ ...fixture, op: 37 });
const newerAnimation = JSON.stringify({ ...fixture, op: 73 });
const canvas = { width: 48, height: 48 };

beforeAll(async () => {
  const wasm = fs.readFileSync(new URL('../src/core/dotlottie-player.wasm', import.meta.url));

  DotLottie.setWasmUrl(`data:application/wasm;base64,${wasm.toString('base64')}`);
  (await createPlayer()).destroy();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function deferredResponse(): {
  promise: Promise<Response>;
  reject: (error: Error) => void;
  resolve: (response: Response) => void;
} {
  return Promise.withResolvers<Response>();
}

async function createPlayer(): Promise<DotLottie> {
  const player = new DotLottie({ canvas });

  await new Promise<void>((resolve) => {
    player.addEventListener('ready', () => resolve());
  });

  return player;
}

async function settleFetch(): Promise<void> {
  // Flush the mocked fetch, body-reading and deferred load event tasks.
  await new Promise<void>((resolve) => setTimeout(resolve, 10));
}

test.each(['src', 'data'])('a slower src cannot replace a newer %s', async (nextSource) => {
  const older = deferredResponse();
  const fetchMock = vi.fn<typeof fetch>((src) =>
    src === '/older.json' ? older.promise : Promise.resolve(new Response(newerAnimation)),
  );

  vi.stubGlobal('fetch', fetchMock);

  const player = await createPlayer();
  const onLoad = vi.fn();

  player.addEventListener('load', onLoad);

  try {
    player.load({ src: '/older.json' });
    player.load(nextSource === 'src' ? { src: '/newer.json' } : { data: newerAnimation });
    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
      expect(player.totalFrames).toBe(73);
    });

    // Deliberately ignore abort in the mock to exercise an already-completing request.
    older.resolve(new Response(olderAnimation));
    await settleFetch();

    expect(player.totalFrames).toBe(73);
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls.find(([src]) => src === '/older.json')?.[1]?.signal?.aborted).toBe(true);
  } finally {
    player.destroy();
  }
});

test.each(['replacement', 'destroy'])('ignores a late failure after %s', async (supersede) => {
  const older = deferredResponse();
  const player = await createPlayer();
  const onLoadError = vi.fn();

  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>(() => older.promise),
  );

  try {
    player.load({ src: '/older.json' });

    if (supersede === 'destroy') {
      player.destroy();
    } else {
      player.load({ data: newerAnimation });
    }

    // Observe only subsequent emissions, even after destruction clears old listeners.
    player.addEventListener('loadError', onLoadError);
    older.reject(new Error('late failure'));
    await settleFetch();

    expect(onLoadError).not.toHaveBeenCalled();
  } finally {
    if (supersede !== 'destroy') player.destroy();
  }
});

test('still reports errors from the current source', async () => {
  const player = await createPlayer();
  const onLoadError = vi.fn();

  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>(() => Promise.reject(new Error('current failure'))),
  );
  player.addEventListener('loadError', onLoadError);

  try {
    player.load({ src: '/current.json' });
    await vi.waitFor(() => expect(onLoadError).toHaveBeenCalledTimes(1));
    expect(onLoadError.mock.calls[0]?.[0]?.error.message).toContain('current failure');
  } finally {
    player.destroy();
  }
});

test('a ready handler can replace the initial source without a late overwrite', async () => {
  const older = deferredResponse();
  const fetchMock = vi.fn<typeof fetch>(() => older.promise);

  vi.stubGlobal('fetch', fetchMock);

  const player = new DotLottie({ canvas, src: '/older.json' });
  const onLoad = vi.fn();

  player.addEventListener('ready', () => player.load({ data: newerAnimation }));
  player.addEventListener('load', onLoad);

  try {
    await vi.waitFor(() => {
      expect(player.totalFrames).toBe(73);
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
    older.resolve(new Response(olderAnimation));
    await settleFetch();

    expect(player.totalFrames).toBe(73);
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls.find(([src]) => src === '/older.json')?.[1]?.signal?.aborted).toBe(true);
  } finally {
    player.destroy();
  }
});
