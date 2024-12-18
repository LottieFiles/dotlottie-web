/* eslint-disable no-warning-comments */
'use client';

import type { Config, DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { useState, useEffect, useCallback, useRef, type ComponentProps, type RefCallback } from 'react';
import type { JSX } from 'react';

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
  animationId,
  autoplay,
  backgroundColor,
  className,
  createDotLottie,
  data,
  dotLottieRefCallback,
  layout,
  loop,
  mode,
  playOnHover,
  renderConfig,
  segment,
  speed,
  src,
  style,
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
    layout,
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
      if (!playOnHover) return;

      if (event.type === 'mouseenter') {
        dotLottieRef.current?.play();
      }

      if (event.type === 'mouseleave') {
        dotLottieRef.current?.pause();
      }
    };

    canvasRef.current?.addEventListener('mouseenter', handlePlayOnHover);
    canvasRef.current?.addEventListener('mouseleave', handlePlayOnHover);

    return () => {
      canvasRef.current?.removeEventListener('mouseenter', handlePlayOnHover);
      canvasRef.current?.removeEventListener('mouseleave', handlePlayOnHover);
    };
  }, [playOnHover]);

  useEffect(() => {
    return () => {
      if (dotLottie) {
        dotLottie.destroy();
        setDotLottie(null);
      }
    };
  }, [dotLottie]);

  useEffect(() => {
    dotLottieRef.current?.setSpeed(speed ?? 1);
  }, [speed]);

  useEffect(() => {
    dotLottieRef.current?.setMode(mode ?? 'forward');
  }, [mode]);

  useEffect(() => {
    dotLottieRef.current?.setLoop(loop ?? false);
  }, [loop]);

  useEffect(() => {
    dotLottieRef.current?.setUseFrameInterpolation(useFrameInterpolation ?? true);
  }, [useFrameInterpolation]);

  useEffect(() => {
    if (typeof segment?.[0] === 'number' && typeof segment[1] === 'number') {
      dotLottieRef.current?.setSegment(segment[0], segment[1]);
    } else {
      // TODO: implement it for worker
      // dotLottieRef.current?.resetSegment();
    }
  }, [segment]);

  useEffect(() => {
    dotLottieRef.current?.setBackgroundColor(backgroundColor ?? '');
  }, [backgroundColor]);

  useEffect(() => {
    dotLottieRef.current?.setRenderConfig(renderConfig ?? {});
  }, [JSON.stringify(renderConfig)]);

  useEffect(() => {
    if (typeof data !== 'string' && typeof data !== 'object') return;

    dotLottieRef.current?.load({
      data,
      ...configRef.current,
    });
  }, [data]);

  useEffect(() => {
    if (typeof src !== 'string') return;

    dotLottieRef.current?.load({
      src,
      ...configRef.current,
    });
  }, [src]);

  useEffect(() => {
    dotLottieRef.current?.setMarker(props.marker ?? '');
  }, [props.marker]);

  useEffect(() => {
    dotLottieRef.current?.loadAnimation(animationId ?? '');
  }, [animationId]);

  useEffect(() => {
    if (typeof themeId === 'string') {
      dotLottieRef.current?.setTheme(themeId);
    } else {
      // TODO: implement it for worker
      // dotLottieRef.current?.resetTheme();
    }
  }, [themeId]);

  useEffect(() => {
    dotLottieRef.current?.setThemeData(themeData ?? '');
  }, [themeData]);

  useEffect(() => {
    dotLottieRef.current?.setLayout({
      align: layout?.align ?? [0.5, 0.5],
      fit: layout?.fit ?? 'contain',
    });
  }, [layout?.align[0], layout?.align[1], layout?.fit]);

  return (
    <div
      className={className}
      {...(!className && {
        style: {
          width: '100%',
          height: '100%',
          lineHeight: 0,
          ...style,
        },
      })}
    >
      <canvas
        ref={setCanvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
        {...props}
      />
    </div>
  );
};
