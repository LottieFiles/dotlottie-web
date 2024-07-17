import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
import debounce from 'debounce';
import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { ComponentProps, RefCallback } from 'react';

interface DotLottieWorkerComponentProps {
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLElement>;
}

function DotLottieWorkerComponent({
  children,
  className = '',
  setCanvasRef,
  setContainerRef,
  style,
  ...rest
}: DotLottieWorkerComponentProps & ComponentProps<'canvas'>): JSX.Element {
  const containerStyle = {
    width: '100%',
    height: '100%',
    lineHeight: 0,
    ...style,
  };

  return (
    <div ref={setContainerRef} className={className} {...(!className && { style: containerStyle })}>
      <canvas
        ref={setCanvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
        {...rest}
      >
        {children}
      </canvas>
    </div>
  );
}

export type DotLottieWorkerConfig = Omit<Config, 'canvas'> & {
  animationId?: string;
  autoResizeCanvas?: boolean;
  playOnHover?: boolean;
  themeData?: string;
  themeId?: string;
  workerId?: string;
};

export interface UseDotLottieWorkerResult {
  DotLottieComponent: (props: ComponentProps<'canvas'>) => JSX.Element;
  canvas: HTMLCanvasElement | null;
  container: HTMLDivElement | null;
  dotLottie: DotLottieWorker | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLDivElement>;
}

const isServerSide = (): boolean => typeof window === 'undefined';

const getCanvasViewport = (
  canvas: HTMLCanvasElement,
  dpr: number,
): { height: number; width: number; x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const visibleLeft = Math.max(0, -rect.left);
  const visibleTop = Math.max(0, -rect.top);
  const visibleRight = Math.min(rect.width, windowWidth - rect.left);
  const visibleBottom = Math.min(rect.height, windowHeight - rect.top);

  const x = visibleLeft * dpr;
  const y = visibleTop * dpr;
  const width = (visibleRight - visibleLeft) * dpr;
  const height = (visibleBottom - visibleTop) * dpr;

  return { x, y, width, height };
};

export const useDotLottieWorker = (config?: DotLottieWorkerConfig): UseDotLottieWorkerResult => {
  const [dotLottie, setDotLottie] = useState<DotLottieWorker | null>(null);

  const dotLottieRef = useRef<DotLottieWorker | null>(null);
  const configRef = useRef<DotLottieWorkerConfig | undefined>(config);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const updateViewport = useCallback(() => {
    if (!dotLottieRef.current) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const dpr = configRef.current?.renderConfig?.devicePixelRatio || window.devicePixelRatio || 1;

    const { height, width, x, y } = getCanvasViewport(canvas, dpr);

    dotLottieRef.current.setViewport(x, y, width, height);
  }, []);

  const intersectionObserver = useMemo(() => {
    if (isServerSide()) return null;

    const observerCallback = (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          dotLottieRef.current?.unfreeze();
        } else {
          dotLottieRef.current?.freeze();
        }
      });
    };

    return new IntersectionObserver(observerCallback, {
      threshold: 0,
    });
  }, []);

  const resizeObserver = useMemo(() => {
    if (isServerSide()) return null;

    const observerCallback = debounce(() => {
      if (configRef.current?.autoResizeCanvas) {
        dotLottieRef.current?.resize();
      }
    }, 150);

    return new ResizeObserver(observerCallback);
  }, []);

  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  }, []);

  const setContainerRef = useCallback((container: HTMLDivElement | null) => {
    containerRef.current = container;
  }, []);

  const Component = useCallback(
    (props: ComponentProps<'canvas'>): JSX.Element => {
      return <DotLottieWorkerComponent setContainerRef={setContainerRef} setCanvasRef={setCanvasRef} {...props} />;
    },
    [setCanvasRef, setContainerRef],
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    let dotLottieInstance: DotLottieWorker | null = null;

    if (canvas) {
      dotLottieInstance = new DotLottieWorker({
        ...configRef.current,
        canvas,
      });

      // Check if the canvas is initially in view
      const initialEntry = canvas.getBoundingClientRect();

      if (
        initialEntry.top >= 0 &&
        initialEntry.left >= 0 &&
        initialEntry.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        initialEntry.right <= (window.innerWidth || document.documentElement.clientWidth)
      ) {
        dotLottieInstance.unfreeze();
      } else {
        dotLottieInstance.freeze();
      }

      intersectionObserver?.observe(canvas);

      if (config?.autoResizeCanvas) {
        resizeObserver?.observe(canvas);
      }
      canvas.addEventListener('mouseenter', hoverHandler);
      canvas.addEventListener('mouseleave', hoverHandler);
      dotLottieInstance.addEventListener('frame', updateViewport);

      updateViewport();
      setDotLottie(dotLottieInstance);
    }

    return () => {
      dotLottieInstance?.destroy();
      setDotLottie(null);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      canvas?.removeEventListener('mouseenter', hoverHandler);
      canvas?.removeEventListener('mouseleave', hoverHandler);
    };
  }, [intersectionObserver, resizeObserver, hoverHandler, updateViewport]);

  // speed reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config?.speed === 'number' && config.speed !== dotLottieRef.current.speed) {
      dotLottieRef.current.setSpeed(config.speed);
    }
  }, [config?.speed]);

  // mode reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config?.mode === 'string' && config.mode !== dotLottieRef.current.mode) {
      dotLottieRef.current.setMode(config.mode);
    }
  }, [config?.mode]);

  // loop reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config?.loop === 'boolean' && config.loop !== dotLottieRef.current.loop) {
      dotLottieRef.current.setLoop(config.loop);
    }
  }, [config?.loop]);

  // useFrameInterpolation reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (
      typeof config?.useFrameInterpolation === 'boolean' &&
      config.useFrameInterpolation !== dotLottieRef.current.useFrameInterpolation
    ) {
      dotLottieRef.current.setUseFrameInterpolation(config.useFrameInterpolation);
    }
  }, [config?.useFrameInterpolation]);

  // segment reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (
      typeof config?.segment === 'object' &&
      Array.isArray(config.segment) &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      config.segment.length === 2
    ) {
      const startFrame = config.segment[0];
      const endFrame = config.segment[1];

      dotLottieRef.current.setSegment(startFrame, endFrame);
    }
  }, [config?.segment]);

  // background color reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (
      typeof config?.backgroundColor === 'string' &&
      config.backgroundColor !== dotLottieRef.current.backgroundColor
    ) {
      dotLottieRef.current.setBackgroundColor(config.backgroundColor);
    }
  }, [config?.backgroundColor]);

  // render config reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config?.renderConfig === 'object') {
      dotLottieRef.current.setRenderConfig(config.renderConfig);
    }
  }, [JSON.stringify(config?.renderConfig)]);

  // data reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config?.data === 'string' || config?.data instanceof ArrayBuffer) {
      dotLottieRef.current.load({
        data: config.data,
        ...(configRef.current || {}),
      });
    }
  }, [config?.data]);

  // src reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config?.src === 'string') {
      dotLottieRef.current.load({
        src: config.src,
        ...(configRef.current || {}),
      });
    }
  }, [config?.src]);

  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (typeof config?.marker === 'string') {
      dotLottieRef.current.setMarker(config.marker);
    }
  }, [config?.marker]);

  useEffect(() => {
    if (!resizeObserver) return;

    if (config?.autoResizeCanvas && canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    } else {
      resizeObserver.disconnect();
    }
  }, [config?.autoResizeCanvas, resizeObserver]);

  // animationId reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (
      dotLottieRef.current.isLoaded &&
      config?.animationId &&
      dotLottieRef.current.activeAnimationId !== config.animationId
    ) {
      dotLottieRef.current.loadAnimation(config.animationId);
    }
  }, [config?.animationId]);

  // themeId reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (dotLottieRef.current.isLoaded && dotLottieRef.current.activeThemeId !== config?.themeId) {
      dotLottieRef.current.loadTheme(config?.themeId || '');
    }
  }, [config?.themeId]);

  // themeData reactivity
  useEffect(() => {
    if (!dotLottieRef.current) return;

    if (dotLottieRef.current.isLoaded) {
      dotLottieRef.current.loadThemeData(config?.themeData || '');
    }
  }, [config?.themeData]);

  return {
    dotLottie,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef.current,
    container: containerRef.current,
    DotLottieComponent: Component,
  };
};
