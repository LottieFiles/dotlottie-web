import fs from 'node:fs';
import path from 'node:path';

import { beforeAll, expect, test, vi } from 'vitest';

import { DotLottie } from '../src';

beforeAll(() => {
  const wasmBase64 = fs.readFileSync(path.resolve(__dirname, '../src/core/dotlottie-player.wasm')).toString('base64');
  const wasmDataUri = `data:application/wasm;base64,${wasmBase64}`;

  DotLottie.setWasmUrl(wasmDataUri);
});

test('should render correctly in node', async () => {
  const lottieData = fs.readFileSync(path.resolve(__dirname, '../../../fixtures/test.json')).toString();
  const onReady = vi.fn();
  const onLoad = vi.fn();
  const onFrame = vi.fn();
  const onRender = vi.fn();

  const dotLottie = new DotLottie({
    canvas: {
      width: 48,
      height: 48,
    },
    useFrameInterpolation: false,
    data: lottieData,
  });

  expect(dotLottie.buffer).toBeNull();

  dotLottie.addEventListener('ready', onReady);
  dotLottie.addEventListener('load', onLoad);
  dotLottie.addEventListener('frame', onFrame);
  dotLottie.addEventListener('render', onRender);

  await vi.waitFor(() => {
    expect(onReady).toHaveBeenCalledOnce();
    expect(onLoad).toHaveBeenCalledOnce();
  });

  expect(dotLottie.buffer).toBeInstanceOf(Uint8Array);
  expect(dotLottie.canvas).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(dotLottie.buffer).toHaveLength(dotLottie.canvas!.width * dotLottie.canvas!.height * 4);

  const frameCount = dotLottie.totalFrames;

  // Frame 0 is already rendered during load — verify its buffer snapshot
  await expect(dotLottie.buffer?.toString()).toMatchFileSnapshot(`./__snapshots__/frame-buffer-0.txt`, `frame 0`);

  // Allow load-phase setTimeout dispatches (frame/render for frame 0) to fire
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Clear mocks to discard load-phase frame/render events for frame 0
  onFrame.mockClear();
  onRender.mockClear();

  // Start from frame 1: setFrame(0) is a no-op after load since ThorVG
  // already rendered frame 0 during the load pipeline.
  for (let i = 1; i < frameCount; i += 1) {
    dotLottie.setFrame(i);
    await expect(dotLottie.buffer?.toString()).toMatchFileSnapshot(
      `./__snapshots__/frame-buffer-${i}.txt`,
      `frame ${i}`,
    );
    await vi.waitFor(() => {
      expect(onFrame).toHaveBeenNthCalledWith(i, {
        type: 'frame',
        currentFrame: i,
      });
    });
    await vi.waitFor(() => {
      expect(onRender).toHaveBeenNthCalledWith(i, {
        type: 'render',
        currentFrame: i,
      });
    });
  }

  dotLottie.destroy();
});
