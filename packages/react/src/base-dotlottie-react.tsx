/* eslint-disable no-warning-comments */
'use client';

import type { Config, DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { useEffect, useCallback, useRef, type ComponentProps, type RefCallback } from 'react';
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
     * const dotLottieRef = useRef<DotLottie | null>(null);
     *
     * <DotLottieReact
     *   dotLottieRefCallback={(instance) => dotLottieRef.current = instance}
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
  themeData,
  themeId,
  useFrameInterpolation,
  workerId,
  ...props
}: BaseDotLottieProps<T> & {
  createDotLottie: (config: T extends DotLottieWorker ? Config & { workerId?: string } : Config) => T;
}): JSX.Element => {
  const dotLottieRef = useRef<T | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  configRef.current = config;

  const setContainerRef = useCallback((container: HTMLDivElement | null) => {
    containerRef.current = container;

    if (container) {
      const canvas = document.createElement('canvas');

      // Set the canvas to the same size as the container
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      container.appendChild(canvas);

      const dotLottieInstance = createDotLottie({
        ...configRef.current,
        canvas,
      });

      dotLottieRef.current = dotLottieInstance as T;

      if (typeof dotLottieRefCallback === 'function') {
        dotLottieRefCallback(dotLottieInstance as T);
      }
    } else {
      dotLottieRef.current?.destroy();
      (dotLottieRef.current?.canvas as HTMLCanvasElement).remove();
      dotLottieRef.current = null;

      if (typeof dotLottieRefCallback === 'function') {
        dotLottieRefCallback(null);
      }
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

    containerRef.current?.addEventListener('mouseenter', handlePlayOnHover);
    containerRef.current?.addEventListener('mouseleave', handlePlayOnHover);

    return () => {
      containerRef.current?.removeEventListener('mouseenter', handlePlayOnHover);
      containerRef.current?.removeEventListener('mouseleave', handlePlayOnHover);
    };
  }, [playOnHover]);

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
    dotLottieRef.current?.setLayout(layout ?? {});
  }, [layout?.fit, layout?.align && layout.align[0], layout?.align && layout.align[1]]);

  return (
    <div
      ref={setContainerRef}
      style={{
        width: '100%',
        height: '100%',
        lineHeight: 0,
      }}
      {...props}
    />
  );
};
