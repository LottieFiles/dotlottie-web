export const sleep = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const createCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');

  canvas.style.width = '200px';
  canvas.style.height = '200px';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.right = '0';

  document.body.appendChild(canvas);

  return canvas;
};

export const addCSPPolicy = (content: string[]): (() => void) => {
  const meta = document.createElement('meta');

  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = content.join('; ');

  document.head.appendChild(meta);

  return (): void => {
    document.head.removeChild(meta);
  };
};
