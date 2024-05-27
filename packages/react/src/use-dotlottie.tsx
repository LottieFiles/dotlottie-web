/**
 * Copyright 2023 Design Barn Inc.
 */

import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import debounce from 'debounce';
import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { ComponentProps, RefCallback } from 'react';

interface DotLottieComponentProps {
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLElement>;
}

function DotLottieComponent({
  children,
  className = '',
  setCanvasRef,
  setContainerRef,
  style,
  ...rest
}: DotLottieComponentProps & ComponentProps<'canvas'>): JSX.Element {
  const containerStyle = {
    width: '100%',
    height: '100%',
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

export type DotLottieConfig = Omit<Config, 'canvas'> & {
  autoResizeCanvas?: boolean;
  playOnHover?: boolean;
};

export interface UseDotLottieResult {
  DotLottieComponent: (props: ComponentProps<'canvas'>) => JSX.Element;
  canvas: HTMLCanvasElement | null;
  container: HTMLDivElement | null;
  dotLottie: DotLottie | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLDivElement>;
}

export const useDotLottie = (config?: DotLottieConfig): UseDotLottieResult => {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  const dotLottieRef = useRef<DotLottie | null>(null);
  const configRef = useRef<DotLottieConfig | undefined>(config);

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

  const isServerSide: () => boolean = () => typeof window === 'undefined';

  const intersectionObserver = useMemo(() => {
    if (isServerSide()) return null;

    const observerCallback = debounce((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          dotLottieRef.current?.unfreeze();
        } else {
          dotLottieRef.current?.freeze();
        }
      });
    }, 150);

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

  const setCanvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!resizeObserver || !intersectionObserver) return;

      if (canvas) {
        const dotLottieInstance = new DotLottie({
          ...config,
          canvas,
        });

        setDotLottie(dotLottieInstance);

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

        intersectionObserver.observe(canvas);
        if (config?.autoResizeCanvas) {
          resizeObserver.observe(canvas);
        }
        canvas.addEventListener('mouseenter', hoverHandler);
        canvas.addEventListener('mouseleave', hoverHandler);
      } else {
        dotLottieRef.current?.destroy();
        intersectionObserver.disconnect();
        resizeObserver.disconnect();
      }

      canvasRef.current = canvas;
    },
    [intersectionObserver, resizeObserver, hoverHandler],
  );

  const setContainerRef = useCallback((container: HTMLDivElement | null) => {
    containerRef.current = container;
  }, []);

  const Component = useCallback(
    (props: ComponentProps<'canvas'>): JSX.Element => {
      return <DotLottieComponent setContainerRef={setContainerRef} setCanvasRef={setCanvasRef} {...props} />;
    },
    [setCanvasRef, setContainerRef],
  );

  useEffect(() => {
    return () => {
      if (!dotLottie || !resizeObserver || !intersectionObserver) return;

      dotLottie.destroy();
      setDotLottie(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvasRef.current?.removeEventListener('mouseenter', hoverHandler);
      canvasRef.current?.removeEventListener('mouseleave', hoverHandler);
    };
  }, []);

  // speed reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.speed === 'number' && config.speed !== dotLottie.speed && dotLottie.isLoaded) {
      dotLottie.setSpeed(config.speed);
    }
  }, [config?.speed]);

  // mode reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.mode === 'string' && config.mode !== dotLottie.mode && dotLottie.isLoaded) {
      dotLottie.setMode(config.mode);
    }
  }, [config?.mode]);

  // loop reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.loop === 'boolean' && config.loop !== dotLottie.loop && dotLottie.isLoaded) {
      dotLottie.setLoop(config.loop);
    }
  }, [config?.loop]);

  // useFrameInterpolation reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (
      typeof config?.useFrameInterpolation === 'boolean' &&
      config.useFrameInterpolation !== dotLottie.useFrameInterpolation &&
      dotLottie.isLoaded
    ) {
      dotLottie.setUseFrameInterpolation(config.useFrameInterpolation);
    }
  }, [config?.useFrameInterpolation]);

  // segment reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (
      typeof config?.segment === 'object' &&
      Array.isArray(config.segment) &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      config.segment.length === 2 &&
      dotLottie.isLoaded
    ) {
      const startFrame = config.segment[0];
      const endFrame = config.segment[1];

      dotLottie.setSegment(startFrame, endFrame);
    }
  }, [config?.segment]);

  // background color reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.backgroundColor === 'string' && config.backgroundColor !== dotLottie.backgroundColor) {
      dotLottie.setBackgroundColor(config.backgroundColor);
    }
  }, [config?.backgroundColor]);

  // render config reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.renderConfig === 'object') {
      dotLottie.setRenderConfig(config.renderConfig);
    }
  }, [config?.renderConfig]);

  // data reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.data === 'string' || config?.data instanceof ArrayBuffer) {
      dotLottie.load({
        data: config.data,
        ...(configRef.current || {}),
      });
    }
  }, [config?.data]);

  // src reactivity
  useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.src === 'string') {
      dotLottie.load({
        src: config.src,
        ...(configRef.current || {}),
      });
    }
  }, [config?.src]);

  useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.marker === 'string') {
      dotLottie.setMarker(config.marker);
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

  return {
    dotLottie,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef.current,
    container: containerRef.current,
    DotLottieComponent: Component,
  };
};

export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
};
