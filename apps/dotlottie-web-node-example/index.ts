/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable no-secrets/no-secrets */

import fs from 'node:fs';
import path from 'node:path';

import { DotLottie } from '@lottiefiles/dotlottie-web';
import type { FrameEvent } from '@lottiefiles/dotlottie-web/src';
import { createCanvas } from '@napi-rs/canvas';
import GIFEncoder from 'gif-encoder';

const wasmFilePath = path.resolve('node_modules/@lottiefiles/dotlottie-web/dist/renderer.wasm');
const wasmBuffer = fs.readFileSync(wasmFilePath);
const wasmDataUri = `data:application/octet-stream;base64,${wasmBuffer.toString('base64')}`;

// Use the wasm data uri to load the wasm module
DotLottie.setWasmUrl(wasmDataUri);

const width = 200;
const height = 200;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const dotLottie = new DotLottie({
  canvas: canvas as unknown as HTMLCanvasElement,
  // src: 'https://lottie.host/2be14383-bf47-4fcc-81e9-ef62213a0623/1vdONaaG7Y.lottie',
  src: 'https://lottie.host/91a17227-a537-4568-8cc9-040e5e1459a2/H3PuhOxRjg.json',
  // data: fs.readFileSync(path.resolve('dragon.json'), 'utf-8'),
  autoplay: true,
});

const gif = new GIFEncoder(width, height);

const frameBuffer: Uint8ClampedArray[] = [];

dotLottie.addEventListener('load', () => {
  // create out directory if not exist
  if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
  }

  const file = fs.createWriteStream('output/dragon.gif');

  gif.pipe(file);

  gif.setRepeat(0);
  gif.setFrameRate(60);
});

dotLottie.addEventListener('play', () => {
  console.log('Start recording gif');

  gif.writeHeader();
});

dotLottie.addEventListener('frame', (event: FrameEvent) => {
  const frame = Math.round(event.currentFrame);

  console.log(`Recording frame ${frame}`);

  frameBuffer.push(ctx.getImageData(0, 0, width, height).data);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
dotLottie.addEventListener('complete', async () => {
  for (const frame of frameBuffer) {
    await new Promise((resolve) => setTimeout(resolve));

    gif.addFrame(frame);
  }

  gif.finish();

  console.log('Finish recording gif');
});
