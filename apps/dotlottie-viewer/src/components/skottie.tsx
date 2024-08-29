import { useEffect, useRef, useState } from 'react';
import { CanvasKit } from 'canvaskit-wasm';
import { v4 as uuidv4 } from 'uuid';

let canvasKit: CanvasKit | undefined = undefined;
export const setCanvasKit = (ck: CanvasKit) => {
  if (canvasKit) {
    return;
  }
  canvasKit = ck;
};

interface Props {
  lottieURL: string;
  width: number;
  height: number;
}

export function Skottie({ lottieURL, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [id, setId] = useState<string>('');
  let initialized = false;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    if (initialized || !canvasKit) {
      return;
    }
    initialized = true;

    const id = uuidv4();
    setId(id);

    const dpr = window.devicePixelRatio || 1;

    const data = await fetch(lottieURL);
    const lottieJSON = await data.text();

    const animation = canvasKit.MakeManagedAnimation(lottieJSON);
    const bounds = canvasKit!.LTRBRect(0, 0, width * dpr, height * dpr);
    canvasRef.current!.width = width * dpr;
    canvasRef.current!.height = height * dpr;

    let beginTime = Date.now() / 1000;
    let surface = canvasKit!.MakeSWCanvasSurface(id);
    let canvas = surface!.getCanvas();

    const damageRect = Float32Array.of(0, 0, 0, 0);
    const clearColor = canvasKit.TRANSPARENT;
    function drawFrame() {
      let currentTime = Date.now() / 1000;
      let currentFrame = (currentTime - beginTime) / animation.duration();

      if (currentFrame > 1) {
        currentFrame = 0;
        beginTime = currentTime;
      }

      let damage = animation.seek(currentFrame, damageRect);
      if (damage[2] > damage[0] && damage[3] > damage[1]) {
        canvas.clear(clearColor);
        animation.render(canvas, bounds);
        surface?.flush();
      }
      window.requestAnimationFrame(drawFrame);
    }

    window.requestAnimationFrame(drawFrame);
  };

  return <canvas id={id} ref={canvasRef} style={{ width, height }} />;
}
