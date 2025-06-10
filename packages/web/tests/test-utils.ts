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

const CSP_POLICY = "script-src 'self' 'wasm-unsafe-eval'";

export const addWasmCSPPolicy = (): (() => void) => {
  const meta = document.createElement('meta');

  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = CSP_POLICY;

  document.head.appendChild(meta);

  return (): void => {
    meta.remove();
  };
};
