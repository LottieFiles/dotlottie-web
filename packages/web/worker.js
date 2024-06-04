/**
 * Copyright 2024 Design Barn Inc.
 */

import { DotLottie } from './dist/index.js';

const dotLottiesMap = new Map();

// eslint-disable-next-line no-restricted-globals, no-undef
self.onmessage = (event) => {
  const { action, canvasId, payload } = event.data;
  const dotLottie = dotLottiesMap.get(Number(canvasId));

  if (dotLottie && action === 'resize') {
    const canvas = dotLottie.canvas;

    canvas.width = payload.width;
    canvas.height = payload.height;

    dotLottie.resize();
  } else if (dotLottie && action === 'play') {
    dotLottie.play();
  } else if (dotLottie && action === 'pause') {
    dotLottie.pause();
  } else if (dotLottie && action === 'freeze') {
    dotLottie.freeze();
  } else if (dotLottie && action === 'unfreeze') {
    dotLottie.unfreeze();
  } else if (!dotLottie && action === 'create') {
    const dotLottieInstance = new DotLottie(payload);

    dotLottiesMap.set(Number(canvasId), dotLottieInstance);
  } else {
    console.log('Unknown action', action);
  }
};
