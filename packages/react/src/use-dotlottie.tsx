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

export type DotLottieConfig = Omit<Config, 'canvas'> & {
  animationId?: string;
  autoResizeCanvas?: boolean;
  playOnHover?: boolean;
  themeData?: string;
  themeId?: string;
};

export interface UseDotLottieResult {
  DotLottieComponent: (props: ComponentProps<'canvas'>) => JSX.Element;
  canvas: HTMLCanvasElement | null;
  container: HTMLDivElement | null;
  dotLottie: DotLottie | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLDivElement>;
}

const isServerSide = (): boolean => typeof window === 'undefined';

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
      return <DotLottieComponent setContainerRef={setContainerRef} setCanvasRef={setCanvasRef} {...props} />;
    },
    [setCanvasRef, setContainerRef],
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    let dotLottieInstance: DotLottie | null = null;

    if (canvas) {
      dotLottieInstance = new DotLottie({
        ...configRef.current,
        canvas,
      });

      if (config?.autoResizeCanvas) {
        resizeObserver?.observe(canvas);
      }
      canvas.addEventListener('mouseenter', hoverHandler);
      canvas.addEventListener('mouseleave', hoverHandler);

      setDotLottie(dotLottieInstance);
    }

    return () => {
      dotLottieInstance?.destroy();
      setDotLottie(null);
      resizeObserver?.disconnect();
      canvas?.removeEventListener('mouseenter', hoverHandler);
      canvas?.removeEventListener('mouseleave', hoverHandler);
    };
  }, [resizeObserver, hoverHandler]);

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

    const startFrame = config?.segment?.[0];
    const endFrame = config?.segment?.[1];

    if (typeof startFrame === 'number' && typeof endFrame === 'number') {
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
