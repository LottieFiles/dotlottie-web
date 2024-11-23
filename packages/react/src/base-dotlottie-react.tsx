'use client';

import type { Config, DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { useState, useEffect, useCallback, useRef, type ComponentProps, type RefCallback, useMemo } from 'react';

export type BaseDotLottieProps<T extends DotLottie | DotLottieWorker> = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> & {
    animationId?: string;
    /**
     * A function that creates a `DotLottie` or `DotLottieWorker` instance.
     */
    createDotLottie: (config: T extends DotLottieWorker ? Config & { workerId?: string } : Config) => T;
    /**
     * A callback function that receives the `DotLottie` or `DotLottieWorker` instance.
     *
     * @example
     * ```tsx
     * const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
     *
     * <DotLottieReact
     *   dotLottieRefCallback={setDotLottie}
     * />
     * ```
     */
    dotLottieRefCallback?: RefCallback<T | null>;
    /**
     * @deprecated The `playOnHover` property is deprecated.
     * Instead, use the `onMouseEnter` and `onMouseLeave` events to control animation playback.
     * Utilize the `dotLottieRefCallback` to access the `DotLottie` instance and invoke the `play` and `pause` methods.
     *
     * Example usage:
     * ```tsx
     * const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
     *
     * <DotLottieReact
     *   dotLottieRefCallback={setDotLottie}
     *   onMouseEnter={() => dotLottie?.play()}
     *   onMouseLeave={() => dotLottie?.pause()}
     * />
     * ```
     */
    playOnHover?: boolean;
    themeData?: string;
    workerId?: T extends DotLottieWorker ? string : undefined;
  };

export const BaseDotLottieReact = <T extends DotLottie | DotLottieWorker>({
  autoplay,
  backgroundColor,
  createDotLottie,
  data,
  dotLottieRefCallback,
  loop,
  mode,
  playOnHover,
  renderConfig,
  segment,
  speed,
  src,
  themeData,
  themeId,
  useFrameInterpolation,
  workerId,
  ...props
}: BaseDotLottieProps<T> & {
  createDotLottie: (config: T extends DotLottieWorker ? Config & { workerId?: string } : Config) => T;
}): JSX.Element => {
  const [dotLottie, setDotLottie] = useState<T | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotLottieRef = useRef<T | null>(null);
  const dotLottieRefCallbackRef = useRef<RefCallback<T | null> | undefined>(dotLottieRefCallback);

  const config: Omit<Config, 'canvas'> & {
    workerId?: T extends DotLottieWorker ? string : undefined;
  } = {
    speed,
    mode,
    loop,
    useFrameInterpolation,
    segment,
    backgroundColor,
    autoplay,
    themeId,
    workerId,
    src,
    data,
    renderConfig,
  };

  const configRef = useRef<Omit<BaseDotLottieProps<T>, 'createDotLottie' | 'dotLottieRefCallback'> | undefined>(config);

  dotLottieRefCallbackRef.current = dotLottieRefCallback;
  dotLottieRef.current = dotLottie;
  configRef.current = config;

  useEffect(() => {
    if (typeof dotLottieRefCallbackRef.current === 'function' && dotLottie) {
      dotLottieRefCallbackRef.current(dotLottie);
    }
  }, [dotLottie]);

  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;

    if (canvas) {
      const dotLottieInstance = createDotLottie({
        ...configRef.current,
        canvas,
      });

      setDotLottie(dotLottieInstance as T);
    } else {
      dotLottie?.destroy();
      setDotLottie(null);
    }
  }, []);

  useEffect(() => {
    const handlePlayOnHover = (event: MouseEvent): void => {
      if (!configRef.current?.playOnHover || !dotLottieRef.current?.isLoaded) return;

      if (event.type === 'mouseenter') {
        dotLottieRef.current.play();
      } else if (event.type === 'mouseleave') {
        dotLottieRef.current.pause();
      }
    };

    canvasRef.current?.addEventListener('mouseenter', handlePlayOnHover);
    canvasRef.current?.addEventListener('mouseleave', handlePlayOnHover);

    return () => {
      canvasRef.current?.removeEventListener('mouseenter', handlePlayOnHover);
      canvasRef.current?.removeEventListener('mouseleave', handlePlayOnHover);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dotLottie) {
        dotLottie.destroy();
        setDotLottie(null);
      }
    };
  }, [dotLottie]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    dotLottieRef.current.setSpeed(speed ?? 1);
  }, [speed]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    dotLottieRef.current.setMode(mode ?? 'forward');
  }, [mode]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    dotLottieRef.current.setLoop(loop ?? false);
  }, [loop]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    dotLottieRef.current.setUseFrameInterpolation(useFrameInterpolation ?? true);
  }, [useFrameInterpolation]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof segment !== 'object') return;

    const startFrame = segment[0];
    const endFrame = segment[1];

    dotLottieRef.current.setSegment(startFrame, endFrame);
  }, [segment]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    dotLottieRef.current.setBackgroundColor(backgroundColor ?? '');
  }, [backgroundColor]);

  const memoizedRenderConfig = useMemo(() => {
    if (typeof renderConfig !== 'object') return undefined;

    return renderConfig;
  }, [renderConfig?.autoResize, renderConfig?.devicePixelRatio, renderConfig?.freezeOnOffscreen]);

  useEffect(() => {
    if (!dotLottieRef.current || !memoizedRenderConfig) return;

    dotLottieRef.current.setRenderConfig(memoizedRenderConfig);
  }, [memoizedRenderConfig]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof data !== 'string' || typeof data !== 'object') return;

    dotLottieRef.current.load({
      data,
      ...(configRef.current || {}),
    });
  }, [data]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof src !== 'string') return;

    dotLottieRef.current.load({
      src,
      ...(configRef.current || {}),
    });
  }, [src]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    dotLottieRef.current.setMarker(props.marker ?? '');
  }, [props.marker]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    dotLottieRef.current.loadAnimation(props.animationId ?? '');
  }, [props.animationId]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof themeId === 'string') {
      dotLottieRef.current.setTheme(themeId);
    } else {
      dotLottieRef.current.resetTheme();
    }
  }, [themeId]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    dotLottieRef.current.setThemeData(themeData ?? '');
  }, [themeData]);

  return (
    <div className={props.className} style={{ width: '100%', height: '100%', lineHeight: 0, ...props.style }}>
      <canvas ref={setCanvasRef} {...props} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
