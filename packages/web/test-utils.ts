/**
 * Copyright 2023 Design Barn Inc.
 */

export const sleep = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const createCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');

  canvas.style.width = '200px';
  canvas.style.height = '200px';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.right = '0';

  return canvas;
};
