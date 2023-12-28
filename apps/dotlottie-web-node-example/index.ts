/**
 * Copyright 2023 Design Barn Inc.
 */

import fs from 'node:fs';
import path from 'node:path';

import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { createCanvas } from '@napi-rs/canvas';
import GIFEncoder from 'gif-encoder';
import minimist from 'minimist';

const wasmBase64 = fs
  .readFileSync('./node_modules/@lottiefiles/dotlottie-web/dist/wasm/renderer.wasm')
  .toString('base64');
const wasmDataUri = `data:application/octet-stream;base64,${wasmBase64}`;

// This is only required for testing the local version of the renderer
DotLottie.setWasmUrl(wasmDataUri);

const rawArgs = minimist(process.argv.slice(2));

interface Args {
  fps: number;
  height: number;
  input: string;
  quality: 'high' | 'mid' | 'low';
  repeat: number;
  speed: number;
  width: number;
}

const qualityMap = {
  high: 1,
  low: 20,
  mid: 10,
};

const args: Args = {
  width: Number(rawArgs['width']) || 200,
  height: Number(rawArgs['height']) || 200,
  fps: Number(rawArgs['fps']) || 60,
  repeat: Number(rawArgs['repeat']) || 0,
  input: rawArgs['input'] || 'https://lottie.host/195549aa-ad39-4c51-80ee-a8899c2264ee/cWdgpn8n7B.lottie',
  speed: Number(rawArgs['speed']) || 1,
  quality: rawArgs['quality'] || 'mid',
};

if (!args.input) {
  console.error('No input file provided. Use --input to specify the Lottie animation file.');
  process.exit(1);
}

const canvas = createCanvas(args.width, args.height);
const ctx = canvas.getContext('2d');

const dotLottieConfig: Config = {
  speed: args.speed,
  canvas: canvas as unknown as HTMLCanvasElement,
  autoplay: true,
  useFrameInterpolation: false,
};

if (args.input.startsWith('http://') || args.input.startsWith('https://')) {
  dotLottieConfig.src = args.input;
} else {
  const filePath = path.resolve(args.input);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  dotLottieConfig.data = fs.readFileSync(filePath, 'utf-8');
}

const gif = new GIFEncoder(args.width, args.height);

const dotLottie = new DotLottie(dotLottieConfig);

const outputPath = path.resolve('./output');

dotLottie.addEventListener('load', () => {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const file = fs.createWriteStream(path.resolve(outputPath, 'animation.gif'));

  gif.pipe(file);

  gif.setRepeat(args.repeat);
  gif.setFrameRate(args.fps);
  gif.setTransparent(0x00000000);
  gif.setQuality(qualityMap[args.quality]);

  gif.writeHeader();

  const frameRateAdjustedForSpeed = args.fps / dotLottie.speed;
  const delay = 1 / frameRateAdjustedForSpeed;

  console.info(
    `
      Recording GIF with the following settings:
      - Width: ${args.width}
      - Height: ${args.height}
      - FPS: ${args.fps}
      - Repeat: ${args.repeat}
      - Animation Speed: ${args.speed}
      - Quality: ${args.quality}
      - Delay: ${delay}
      - Total Frames: ${dotLottie.totalFrames}
      - Duration: ${dotLottie.duration}
      - Output Path: ${outputPath}
    `,
  );
});

dotLottie.addEventListener('frame', (event) => {
  const frame = ctx.getImageData(0, 0, args.width, args.height).data;

  if (event.currentFrame >= dotLottie.totalFrames - 1) {
    console.log('Finished recording GIF');
    gif.finish();
  } else {
    gif.addFrame(frame);
    gif._read(1);
  }
});
