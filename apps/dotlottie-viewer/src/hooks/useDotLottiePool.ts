import { useCallback, useEffect, useRef, useState } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

export interface UseDotLottiePoolReturn {
  registerCanvas: (index: number, canvas: HTMLCanvasElement | null, animationUrl: string) => void;
  activeCount: number;
}

export const useDotLottiePool = (): UseDotLottiePoolReturn => {
  const instancesRef = useRef<Map<number, DotLottie>>(new Map());
  const [activeCount, setActiveCount] = useState(0);

  const registerCanvas = useCallback((index: number, canvas: HTMLCanvasElement | null, animationUrl: string) => {
    const instances = instancesRef.current;

    if (canvas) {
      if (instances.has(index)) return;

      const instance = new DotLottie({
        canvas,
        src: animationUrl,
        autoplay: true,
        loop: true,
        useFrameInterpolation: false,
        renderConfig: {
          autoResize: false,
        },
      });

      instances.set(index, instance);
      setActiveCount(instances.size);
    } else {
      const instance = instances.get(index);
      if (instance) {
        instance.destroy();
        instances.delete(index);
        setActiveCount(instances.size);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      const instances = instancesRef.current;
      for (const instance of instances.values()) {
        instance.destroy();
      }
      instances.clear();
    };
  }, []);

  return {
    registerCanvas,
    activeCount,
  };
};
