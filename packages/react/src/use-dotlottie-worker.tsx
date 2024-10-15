import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
import type React from 'react';
import { useCallback, useState, useEffect, useRef } from 'react';

export type DotLottieWorkerConfig = Omit<Config, 'canvas'> & {
  animationId?: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  playOnHover?: boolean;
  themeData?: string;
  themeId?: string;
  workerId?: string;
};

export interface UseDotLottieWorkerResult {
  dotLottie: DotLottieWorker | null;
}

export const useDotLottieWorker = (config: DotLottieWorkerConfig): UseDotLottieWorkerResult => {
  const [dotLottie, setDotLottie] = useState<DotLottieWorker | null>(null);

  const dotLottieRef = useRef<DotLottieWorker | null>(null);
  const configRef = useRef<DotLottieWorkerConfig | undefined>(config);

  dotLottieRef.current = dotLottie;
  configRef.current = config;

  const hoverHandler = useCallback((event: MouseEvent) => {
    if (!configRef.current?.playOnHover || !dotLottieRef.current?.isLoaded) return;

    if (event.type === 'mouseenter') {
      dotLottieRef.current.play();
    } else if (event.type === 'mouseleave') {
      dotLottieRef.current.pause();
    }
  }, []);

  // initialize dotLottie
  useEffect(() => {
    let dotLottieInstance: DotLottieWorker | null = null;

    if (config.canvasRef.current) {
      dotLottieInstance = new DotLottieWorker({
        ...config,
        canvas: config.canvasRef.current,
      });

      setDotLottie(dotLottieInstance);
    }

    return () => {
      if (dotLottieInstance) {
        dotLottieInstance.destroy();
        setDotLottie(null);
      }
    };
  }, [config.canvasRef]);

  // hover reactivity
  useEffect(() => {
    if (config.canvasRef.current) {
      config.canvasRef.current.addEventListener('mouseenter', hoverHandler);
      config.canvasRef.current.addEventListener('mouseleave', hoverHandler);
    }
  }, [config.canvasRef, hoverHandler]);

  // hover reactivity
  useEffect(() => {
    if (config.canvasRef.current) {
      config.canvasRef.current.addEventListener('mouseenter', hoverHandler);
      config.canvasRef.current.addEventListener('mouseleave', hoverHandler);
    }

    return () => {
      if (config.canvasRef.current) {
        config.canvasRef.current.removeEventListener('mouseenter', hoverHandler);
        config.canvasRef.current.removeEventListener('mouseleave', hoverHandler);
      }
    };
  }, [config.canvasRef]);

  // speed reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config.speed === 'number' && config.speed !== dotLottieRef.current.speed) {
      dotLottieRef.current.setSpeed(config.speed);
    }
  }, [config.speed]);

  // mode reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config.mode === 'string' && config.mode !== dotLottieRef.current.mode) {
      dotLottieRef.current.setMode(config.mode);
    }
  }, [config.mode]);

  // loop reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config.loop === 'boolean' && config.loop !== dotLottieRef.current.loop) {
      dotLottieRef.current.setLoop(config.loop);
    }
  }, [config.loop]);

  // useFrameInterpolation reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (
      typeof config.useFrameInterpolation === 'boolean' &&
      config.useFrameInterpolation !== dotLottieRef.current.useFrameInterpolation
    ) {
      dotLottieRef.current.setUseFrameInterpolation(config.useFrameInterpolation);
    }
  }, [config.useFrameInterpolation]);

  // segment reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    const startFrame = config.segment?.[0];
    const endFrame = config.segment?.[1];

    if (typeof startFrame === 'number' && typeof endFrame === 'number') {
      dotLottieRef.current.setSegment(startFrame, endFrame);
    }
  }, [config.segment]);

  // background color reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config.backgroundColor === 'string' && config.backgroundColor !== dotLottieRef.current.backgroundColor) {
      dotLottieRef.current.setBackgroundColor(config.backgroundColor);
    }
  }, [config.backgroundColor]);

  // render config reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config.renderConfig === 'object') {
      dotLottieRef.current.setRenderConfig(config.renderConfig);
    }
  }, [JSON.stringify(config.renderConfig)]);

  // data reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config.data === 'string' || config.data instanceof ArrayBuffer) {
      dotLottieRef.current.load({
        data: config.data,
        ...(configRef.current || {}),
      });
    }
  }, [config.data]);

  // src reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config.src === 'string') {
      dotLottieRef.current.load({
        src: config.src,
        ...(configRef.current || {}),
      });
    }
  }, [config.src]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config.marker === 'string') {
      dotLottieRef.current.setMarker(config.marker);
    }
  }, [config.marker]);

  // animationId reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (
      dotLottieRef.current.isLoaded &&
      config.animationId &&
      dotLottieRef.current.activeAnimationId !== config.animationId
    ) {
      dotLottieRef.current.loadAnimation(config.animationId);
    }
  }, [config.animationId]);

  // themeId reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (dotLottieRef.current.isLoaded && dotLottieRef.current.activeThemeId !== config.themeId) {
      dotLottieRef.current.loadTheme(config.themeId || '');
    }
  }, [config.themeId]);

  // themeData reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (dotLottieRef.current.isLoaded) {
      dotLottieRef.current.loadThemeData(config.themeData || '');
    }
  }, [config.themeData]);

  return {
    dotLottie,
  };
};
