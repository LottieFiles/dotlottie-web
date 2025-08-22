import fs from 'node:fs';
import path from 'node:path';

import { expect, test, vi, beforeAll } from 'vitest';

import { DotLottie } from '../src';

beforeAll(() => {
  const wasmBase64 = fs.readFileSync(path.resolve(__dirname, '../src/core/dotlottie-player.wasm')).toString('base64');
  const wasmDataUri = `data:application/wasm;base64,${wasmBase64}`;

  DotLottie.setWasmUrl(wasmDataUri);
});

test('should render correctly in node', async () => {
  const lottieData = fs.readFileSync(path.resolve(__dirname, './__fixtures__/test.json')).toString();
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

  expect(dotLottie.buffer).toBeInstanceOf(Uint8ClampedArray);
  expect(dotLottie.buffer).toHaveLength(dotLottie.canvas.width * dotLottie.canvas.height * 4);

  const frameCount = dotLottie.totalFrames;

  for (let i = 0; i < frameCount; i += 1) {
    dotLottie.setFrame(i);
    expect(dotLottie.buffer?.toString()).toMatchFileSnapshot(`./__snapshots__/frame-buffer-${i}.txt`, `frame ${i}`);
    await vi.waitFor(() => {
      expect(onFrame).toHaveBeenNthCalledWith(i + 1, {
        type: 'frame',
        currentFrame: i,
      });
    });
    await vi.waitFor(() => {
      expect(onRender).toHaveBeenNthCalledWith(i + 1, {
        type: 'render',
        currentFrame: i,
      });
    });
  }

  dotLottie.destroy();
});
