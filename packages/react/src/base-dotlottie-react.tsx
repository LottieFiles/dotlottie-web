/* eslint-disable no-warning-comments */
'use client';

import type { Config, DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { type ComponentProps, type ReactNode, type RefCallback, useCallback, useEffect, useRef } from 'react';

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
  loopCount,
  mode,
  playOnHover,
  renderConfig,
  segment,
  speed,
  src,
  stateMachineConfig,
  stateMachineId,
  style,
  themeData,
  themeId,
  useFrameInterpolation,
  workerId,
  ...props
}: BaseDotLottieProps<T> & {
  createDotLottie: (config: T extends DotLottieWorker ? Config & { workerId?: string } : Config) => T;
}): ReactNode => {
  const dotLottieRef = useRef<T | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotLottieRefCallbackRef = useRef<RefCallback<T | null> | undefined>(dotLottieRefCallback);
  const pendingDestroyRef = useRef<{
    canvas: HTMLCanvasElement;
    instance: T;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);

  const config: Omit<Config, 'canvas'> & {
    workerId?: T extends DotLottieWorker ? string : undefined;
  } = {
    speed,
    mode,
    loop,
    loopCount,
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
    animationId,
    stateMachineConfig,
    stateMachineId,
  };

  const configRef = useRef<Omit<BaseDotLottieProps<T>, 'createDotLottie' | 'dotLottieRefCallback'> | undefined>(config);

  dotLottieRefCallbackRef.current = dotLottieRefCallback;
  configRef.current = config;

  // biome-ignore lint/correctness/useExhaustiveDependencies: DotLottie instance must only be created once per canvas mount
  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;

    if (canvas) {
      const pending = pendingDestroyRef.current;

      if (pending && pending.canvas === canvas) {
        // StrictMode detach → reattach on the same canvas: reclaim the live instance
        clearTimeout(pending.timer);
        pendingDestroyRef.current = null;
        dotLottieRef.current = pending.instance;
      } else if (dotLottieRef.current?.canvas !== canvas) {
        dotLottieRef.current = createDotLottie({
          ...configRef.current,
          canvas,
        });
      }
      // else: React 19 StrictMode double attach without detach — reuse the live instance
    } else if (dotLottieRef.current) {
      const instance = dotLottieRef.current;
      const instanceCanvas = instance.canvas;

      dotLottieRef.current = null;

      if (instanceCanvas instanceof HTMLCanvasElement) {
        // Defer destroy one macrotask so a StrictMode remount (which runs synchronously
        // within the commit) can reclaim the instance.
        pendingDestroyRef.current = {
          canvas: instanceCanvas,
          instance,
          timer: setTimeout(() => {
            if (pendingDestroyRef.current?.instance === instance) {
              pendingDestroyRef.current = null;
            }
            instance.destroy();
          }, 0),
        };
      } else {
        instance.destroy();
      }
    }

    dotLottieRefCallbackRef.current?.(dotLottieRef.current);
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
    dotLottieRef.current?.setSpeed(speed ?? 1);
  }, [speed]);

  useEffect(() => {
    dotLottieRef.current?.setMode(mode ?? 'forward');
  }, [mode]);

  useEffect(() => {
    dotLottieRef.current?.setLoop(loop ?? false);
  }, [loop]);

  useEffect(() => {
    dotLottieRef.current?.setLoopCount(loopCount ?? 0);
  }, [loopCount]);

  useEffect(() => {
    dotLottieRef.current?.setUseFrameInterpolation(useFrameInterpolation ?? true);
  }, [useFrameInterpolation]);

  useEffect(() => {
    if (typeof segment?.[0] === 'number' && typeof segment[1] === 'number') {
      dotLottieRef.current?.setSegment(segment[0], segment[1]);
    } else {
      dotLottieRef.current?.resetSegment();
    }
  }, [segment]);

  useEffect(() => {
    dotLottieRef.current?.setBackgroundColor(backgroundColor ?? '');
  }, [backgroundColor]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional deep comparison via JSON.stringify
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
    if (dotLottieRef.current?.isLoaded && dotLottieRef.current.activeAnimationId !== animationId) {
      dotLottieRef.current.loadAnimation(animationId ?? '');
    }
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: granular property deps avoid unnecessary setLayout calls when layout object reference changes
  useEffect(() => {
    dotLottieRef.current?.setLayout(layout ?? {});
  }, [layout?.fit, layout?.align?.[0], layout?.align?.[1]]);

  useEffect(() => {
    if (dotLottieRef.current?.isLoaded) {
      if (typeof stateMachineId === 'string' && stateMachineId) {
        const smLoaded = dotLottieRef.current.stateMachineLoad(stateMachineId);

        if (smLoaded) {
          dotLottieRef.current.stateMachineStart();
        }
      } else {
        dotLottieRef.current.stateMachineStop();
      }
    }
  }, [stateMachineId]);

  useEffect(() => {
    dotLottieRef.current?.stateMachineSetConfig(stateMachineConfig ?? null);
  }, [stateMachineConfig]);

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
