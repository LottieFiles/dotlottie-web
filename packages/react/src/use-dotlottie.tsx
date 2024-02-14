/**
 * Copyright 2023 Design Barn Inc.
 */

import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import React, { useCallback } from 'react';
import type { ComponentProps, RefCallback } from 'react';

import { debounce } from './utils';

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
  const [dotLottie, setDotLottie] = React.useState<DotLottie | null>(null);

  const dotLottieRef = React.useRef<DotLottie | null>(null);
  const configRef = React.useRef<DotLottieConfig | undefined>(config);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  dotLottieRef.current = dotLottie;
  configRef.current = config;

  const hoverHandler = React.useCallback((event: MouseEvent) => {
    if (!configRef.current?.playOnHover || !dotLottieRef.current?.isLoaded) return;

    if (event.type === 'mouseenter') {
      dotLottieRef.current.play();
    } else if (event.type === 'mouseleave') {
      dotLottieRef.current.pause();
    }
  }, []);

  const [intersectionObserver] = React.useState(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        debounce(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              dotLottieRef.current?.unfreeze();
            } else {
              dotLottieRef.current?.freeze();
            }
          });
        }, 100)();
      },
      {
        threshold: 0,
      },
    );

    return observer;
  });

  const setCanvasRef = React.useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (canvas) {
        const dotLottieInstance = new DotLottie({
          ...config,
          canvas,
        });

        setDotLottie(dotLottieInstance);

        intersectionObserver.observe(canvas);
        canvas.addEventListener('mouseenter', hoverHandler);
        canvas.addEventListener('mouseleave', hoverHandler);
      } else {
        dotLottieRef.current?.destroy();
        intersectionObserver.disconnect();
      }

      canvasRef.current = canvas;
    },
    [intersectionObserver, hoverHandler],
  );

  const setContainerRef = React.useCallback((container: HTMLDivElement | null) => {
    containerRef.current = container;
  }, []);

  const Component = useCallback(
    (props: ComponentProps<'canvas'>): JSX.Element => {
      return <DotLottieComponent setContainerRef={setContainerRef} setCanvasRef={setCanvasRef} {...props} />;
    },
    [setCanvasRef, setContainerRef],
  );

  React.useEffect(() => {
    return () => {
      if (!dotLottie) return;

      dotLottie.destroy();
      setDotLottie(null);
      intersectionObserver.disconnect();
      canvasRef.current?.removeEventListener('mouseenter', hoverHandler);
      canvasRef.current?.removeEventListener('mouseleave', hoverHandler);
    };
  }, []);

  // speed reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.speed === 'number' && config.speed !== dotLottie.speed && dotLottie.isLoaded) {
      dotLottie.setSpeed(config.speed);
    }
  }, [config?.speed]);

  // mode reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.mode === 'string' && config.mode !== dotLottie.mode && dotLottie.isLoaded) {
      dotLottie.setMode(config.mode);
    }
  }, [config?.mode]);

  // loop reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.loop === 'boolean' && config.loop !== dotLottie.loop && dotLottie.isLoaded) {
      dotLottie.setLoop(config.loop);
    }
  }, [config?.loop]);

  // useFrameInterpolation reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (
      typeof config?.useFrameInterpolation === 'boolean' &&
      config.useFrameInterpolation !== dotLottie.useFrameInterpolation &&
      dotLottie.isLoaded
    ) {
      dotLottie.setUseFrameInterpolation(config.useFrameInterpolation);
    }
  }, [config?.useFrameInterpolation]);

  // segments reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (
      typeof config?.segments === 'object' &&
      Array.isArray(config.segments) &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      config.segments.length === 2 &&
      dotLottie.isLoaded
    ) {
      const startFrame = config.segments[0];
      const endFrame = config.segments[1];

      dotLottie.setSegments(startFrame, endFrame);
    }
  }, [config?.segments]);

  // background color reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.backgroundColor === 'string' && config.backgroundColor !== dotLottie.backgroundColor) {
      dotLottie.setBackgroundColor(config.backgroundColor);
    }
  }, [config?.backgroundColor]);

  // render config reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.renderConfig === 'object') {
      dotLottie.setRenderConfig(config.renderConfig);
    }
  }, [config?.renderConfig]);

  // data reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.data === 'string' || config?.data instanceof ArrayBuffer) {
      dotLottie.load({
        data: config.data,
        ...(configRef.current || {}),
      });
    }
  }, [config?.data]);

  // src reactivity
  React.useEffect(() => {
    if (!dotLottie) return;

    if (typeof config?.src === 'string') {
      dotLottie.load({
        src: config.src,
        ...(configRef.current || {}),
      });
    }
  }, [config?.src]);

  return {
    dotLottie,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef.current,
    container: containerRef.current,
    DotLottieComponent: Component,
  };
};
