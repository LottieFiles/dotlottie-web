/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable no-secrets/no-secrets */

import fs from 'node:fs';
import path from 'node:path';

import { DotLottie } from '@lottiefiles/dotlottie-web';
import type { FrameEvent } from '@lottiefiles/dotlottie-web';
import { createCanvas } from '@napi-rs/canvas';
import GIFEncoder from 'gif-encoder';

const wasmBase64 = fs.readFileSync('./node_modules/@lottiefiles/dotlottie-web/dist/renderer.wasm').toString('base64');
const wasmDataUri = `data:application/octet-stream;base64,${wasmBase64}`;

// This is only required for testing the local version of the renderer
DotLottie.setWasmUrl(wasmDataUri);

const width = 200;
const height = 200;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const dotLottie = new DotLottie({
  canvas: canvas as unknown as HTMLCanvasElement,
  // src: 'https://lottie.host/2be14383-bf47-4fcc-81e9-ef62213a0623/1vdONaaG7Y.lottie',
  // src: 'https://lottie.host/91a17227-a537-4568-8cc9-040e5e1459a2/H3PuhOxRjg.json',
  data: fs.readFileSync(path.resolve('dragon.json'), 'utf-8'),
  autoplay: true,
});

const gif = new GIFEncoder(width, height);

dotLottie.addEventListener('load', () => {
  if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
  }

  const file = fs.createWriteStream('output/dragon.gif');

  gif.pipe(file);

  gif.setRepeat(0);
  gif.setTransparent(0);
  gif.setFrameRate(dotLottie.totalFrames / dotLottie.duration);
});

dotLottie.addEventListener('play', () => {
  console.log('Started recording gif');

  gif.writeHeader();
});

dotLottie.addEventListener('frame', (event: FrameEvent) => {
  const { currentFrame } = event;

  console.log(`Recording frame ${currentFrame}`);

  const data = ctx.getImageData(0, 0, width, height).data;

  gif.addFrame(data);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
dotLottie.addEventListener('complete', async () => {
  gif.finish();

  console.log('Finished recording gif');
});
