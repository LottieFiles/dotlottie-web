import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import type React from 'react';
import { useCallback, useState, useEffect, useRef } from 'react';

export type DotLottieConfig = Omit<Config, 'canvas'> & {
  animationId?: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  playOnHover?: boolean;
  themeData?: string;
  themeId?: string;
};

export interface UseDotLottieResult {
  dotLottie: DotLottie | null;
}

export const useDotLottie = (config: DotLottieConfig): UseDotLottieResult => {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  const dotLottieRef = useRef<DotLottie | null>(null);
  const configRef = useRef<DotLottieConfig | undefined>(config);

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
    let dotLottieInstance: DotLottie | null = null;

    if (config.canvasRef.current) {
      // wait for canvas to be ready before initializing dotLottie
      const interval = setInterval(() => {
        if (
          config.canvasRef.current &&
          config.canvasRef.current.offsetWidth > 0 &&
          config.canvasRef.current.offsetHeight > 0
        ) {
          clearInterval(interval);
          dotLottieInstance = new DotLottie({
            ...config,
            canvas: config.canvasRef.current,
          });
          setDotLottie(dotLottieInstance);
        }
      }, 1);
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
