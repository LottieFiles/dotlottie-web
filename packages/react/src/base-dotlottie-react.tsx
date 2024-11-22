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

/**
 * A base component for rendering and playing animations using `DotLottie` or `DotLottieWorker`.
 * The component provides a `dotLottieRefCallback` to access the `DotLottie` instance and control playback.
 * The `createDotLottie` function is used to create the `DotLottie` or `DotLottieWorker` instance.
 */
export const BaseDotLottieReact = <T extends DotLottie | DotLottieWorker>({
  createDotLottie,
  dotLottieRefCallback,
  ...props
}: BaseDotLottieProps<T> & {
  createDotLottie: (config: T extends DotLottieWorker ? Config & { workerId?: string } : Config) => T;
}): JSX.Element => {
  const [dotLottie, setDotLottie] = useState<T | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotLottieRef = useRef<T | null>(null);
  const dotLottieRefCallbackRef = useRef<RefCallback<T | null> | undefined>(dotLottieRefCallback);
  const configRef = useRef<Omit<BaseDotLottieProps<T>, 'createDotLottie' | 'dotLottieRefCallback'> | undefined>(props);

  dotLottieRefCallbackRef.current = dotLottieRefCallback;
  dotLottieRef.current = dotLottie;
  configRef.current = props;

  useEffect(() => {
    if (typeof dotLottieRefCallbackRef.current === 'function') {
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
    if (!dotLottieRef.current || typeof props.speed !== 'number') return;

    dotLottieRef.current.setSpeed(props.speed);
  }, [props.speed]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.mode !== 'string') return;

    dotLottieRef.current.setMode(props.mode);
  }, [props.mode]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.loop !== 'boolean') return;

    dotLottieRef.current.setLoop(props.loop);
  }, [props.loop]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.useFrameInterpolation !== 'boolean') return;

    dotLottieRef.current.setUseFrameInterpolation(props.useFrameInterpolation);
  }, [props.useFrameInterpolation]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.segment !== 'object') return;

    const startFrame = props.segment[0];
    const endFrame = props.segment[1];

    dotLottieRef.current.setSegment(startFrame, endFrame);
  }, [props.segment]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.backgroundColor !== 'string') return;

    dotLottieRef.current.setBackgroundColor(props.backgroundColor);
  }, [props.backgroundColor]);

  const renderConfig = useMemo(() => {
    if (typeof props.renderConfig !== 'object') return undefined;

    return props.renderConfig;
  }, [props.renderConfig?.autoResize, props.renderConfig?.devicePixelRatio, props.renderConfig?.freezeOnOffscreen]);

  useEffect(() => {
    if (!dotLottieRef.current || !renderConfig) return;

    dotLottieRef.current.setRenderConfig(renderConfig);
  }, [renderConfig]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.data !== 'string' || typeof props.data !== 'object') return;

    dotLottieRef.current.load({
      data: props.data,
      ...(configRef.current || {}),
    });
  }, [props.data]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.src !== 'string') return;

    dotLottieRef.current.load({
      src: props.src,
      ...(configRef.current || {}),
    });
  }, [props.src]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.marker !== 'string') return;

    dotLottieRef.current.setMarker(props.marker);
  }, [props.marker]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.animationId !== 'string') return;

    dotLottieRef.current.loadAnimation(props.animationId);
  }, [props.animationId]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.themeId !== 'string') return;

    dotLottieRef.current.setTheme(props.themeId);
  }, [props.themeId]);

  useEffect(() => {
    if (!dotLottieRef.current || typeof props.themeData !== 'string') return;

    dotLottieRef.current.setThemeData(props.themeData);
  }, [props.themeData]);

  return (
    <div style={{ width: '100%', height: '100%', lineHeight: 0, ...props.style }}>
      <canvas ref={setCanvasRef} {...props} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
