/**
 * Copyright 2023 Design Barn Inc.
 */

import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import React, { useCallback } from 'react';
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

export type DotLottieConfig = Omit<Config, 'canvas'>;

export interface UseDotLottieResult {
  DotLottieComponent: (props: ComponentProps<'canvas'>) => JSX.Element;
  canvas: HTMLCanvasElement | null;
  container: HTMLDivElement | null;
  dotLottie: DotLottie | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLDivElement>;
}

export const useDotLottie = (dotLottieConfig?: DotLottieConfig): UseDotLottieResult => {
  const [dotLottie, setDotLottie] = React.useState<DotLottie | null>(null);

  const dotLottieRef = React.useRef<DotLottie | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  dotLottieRef.current = dotLottie;

  const [intersectionObserver] = React.useState(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dotLottieRef.current?.unfreeze();
          } else {
            dotLottieRef.current?.freeze();
          }
        });
      },
      {
        threshold: 0,
      },
    );

    return observer;
  });

  const [resizeObserver] = React.useState(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        dotLottieRef.current?.resize();
      });
    });

    return observer;
  });

  const setCanvasRef = React.useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (canvas) {
        const dotLottieInstance = new DotLottie({
          ...dotLottieConfig,
          canvas,
        });

        setDotLottie(dotLottieInstance);

        intersectionObserver.observe(canvas);
        resizeObserver.observe(canvas);
      } else {
        dotLottieRef.current?.destroy();
        intersectionObserver.disconnect();
        resizeObserver.disconnect();
      }

      canvasRef.current = canvas;
    },
    [intersectionObserver, resizeObserver],
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
    function onVisibilityChange(): void {
      if (document.hidden) {
        dotLottieRef.current?.freeze();
      } else {
        dotLottieRef.current?.unfreeze();
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (!dotLottie) return;

      dotLottie.destroy();
      setDotLottie(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return {
    dotLottie,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef.current,
    container: containerRef.current,
    DotLottieComponent: Component,
  };
};
