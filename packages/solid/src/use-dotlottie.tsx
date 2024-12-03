import { type Config, DotLottie } from '@lottiefiles/dotlottie-web';
import type { Accessor, ComponentProps, JSX } from 'solid-js';
import { on, createEffect, createSignal, onCleanup } from 'solid-js';

interface DotLottieComponentProps {
  setCanvasRef: (el: HTMLCanvasElement) => void;
  setContainerRef: (el: HTMLDivElement) => void;
}

function DotLottieComponent({
  children,
  class: className,
  setCanvasRef,
  setContainerRef,
  style,
  ...rest
}: DotLottieComponentProps & ComponentProps<'canvas'>): JSX.Element {
  const containerStyle = {
    width: '100%',
    height: '100%',
    ...(style as JSX.CSSProperties),
  };

  return (
    <div ref={setContainerRef} class={className} {...{ style: containerStyle }}>
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

export type DotLottieConfig = Omit<Config, 'canvas'> &
  Partial<{
    animationId?: string;
    playOnHover: boolean;
    themeData?: string;
    themeId?: string;
  }>;

export interface UseDotLottieReturn {
  DotLottieComponent: (props: ComponentProps<'canvas'>) => JSX.Element;
  canvas: HTMLCanvasElement | null;
  container: HTMLDivElement | null;
  dotLottie: Accessor<DotLottie | null>;
  setCanvasRef: (el: HTMLCanvasElement) => void;
  setContainerRef: (el: HTMLDivElement) => void;
}

export const useDotLottie = (config: DotLottieConfig): UseDotLottieReturn => {
  const [dotLottie, setDotLottie] = createSignal<DotLottie | null>(null);

  let canvasRef: HTMLCanvasElement | null = null;
  let containerRef: HTMLDivElement | null = null;

  const hoverHandler = (event: MouseEvent): void => {
    const dotLottieInstance = dotLottie();

    if (!config.playOnHover || !dotLottieInstance) return;

    if (event.type === 'mouseenter') {
      dotLottieInstance.play();
    } else if (event.type === 'mouseleave') {
      dotLottieInstance.pause();
    }
  };

  const setCanvasRef = (canvas: HTMLCanvasElement | null): void => {
    if (canvas) {
      const dotLottieInstance = new DotLottie({
        ...config,
        canvas,
      });

      setDotLottie(dotLottieInstance);

      canvas.addEventListener('mouseenter', hoverHandler);
      canvas.addEventListener('mouseleave', hoverHandler);
    } else {
      dotLottie()?.destroy();
    }

    canvasRef = canvas;
  };

  const setContainerRef = (el: HTMLDivElement | null): void => {
    containerRef = el;
  };

  const Component = (props: ComponentProps<'canvas'>): JSX.Element => {
    return <DotLottieComponent setContainerRef={setContainerRef} setCanvasRef={setCanvasRef} {...props} />;
  };

  onCleanup(() => {
    dotLottie()?.destroy();
    setDotLottie(null);
    if (canvasRef) {
      canvasRef.removeEventListener('mouseenter', hoverHandler);
      canvasRef.removeEventListener('mouseleave', hoverHandler);
    }
  });

  // Reactivities
  // speed
  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    if (typeof config.speed === 'number' && config.speed !== dotLottieInstance.speed && dotLottieInstance.isLoaded) {
      dotLottieInstance.setSpeed(config.speed);
    }
  });
  // mode
  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    if (typeof config.mode === 'string' && config.mode !== dotLottieInstance.mode && dotLottieInstance.isLoaded) {
      dotLottieInstance.setMode(config.mode);
    }
  });
  // loop
  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    if (typeof config.loop === 'boolean' && config.loop !== dotLottieInstance.loop && dotLottieInstance.isLoaded) {
      dotLottieInstance.setLoop(config.loop);
    }
  });
  // useFrameInterpolation
  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    if (
      typeof config.useFrameInterpolation === 'boolean' &&
      config.useFrameInterpolation !== dotLottieInstance.useFrameInterpolation &&
      dotLottieInstance.isLoaded
    ) {
      dotLottieInstance.setUseFrameInterpolation(config.useFrameInterpolation);
    }
  });
  // segment
  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    if (typeof config.segment === 'object' && Array.isArray(config.segment) && dotLottieInstance.isLoaded) {
      const startFrame = config.segment[0];
      const endFrame = config.segment[1];

      dotLottieInstance.setSegment(startFrame, endFrame);
    }
  });
  // background color
  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    if (
      typeof config.backgroundColor === 'string' &&
      config.backgroundColor !== dotLottieInstance.backgroundColor &&
      dotLottieInstance.isLoaded
    ) {
      dotLottieInstance.setBackgroundColor(config.backgroundColor);
    }
  });
  // render config
  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    if (typeof config.renderConfig === 'object') {
      dotLottieInstance.setRenderConfig(config.renderConfig);
    }
  });
  // data
  createEffect(
    on(
      () => config.data,
      () => {
        const dotLottieInstance = dotLottie();

        if (!dotLottieInstance) return;

        if (typeof config.data === 'string') {
          dotLottieInstance.load({
            data: config.data,
            ...config,
          });
        }
      },
    ),
  );
  // src
  createEffect(
    on(
      () => config.src,
      () => {
        const dotLottieInstance = dotLottie();

        if (!dotLottieInstance) return;

        if (typeof config.src === 'string') {
          dotLottieInstance.load({
            src: config.src,
            ...config,
          });
        }
      },
    ),
  );
  // marker
  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    if (typeof config.marker === 'string') {
      dotLottieInstance.setMarker(config.marker);
    }
  });

  // animationId reactivity
  createEffect(
    on(
      () => config.animationId,
      () => {
        const dotLottieInstance = dotLottie();

        if (!dotLottieInstance) return;

        if (
          dotLottieInstance.isLoaded &&
          config.animationId &&
          dotLottieInstance.activeAnimationId !== config.animationId
        ) {
          dotLottieInstance.loadAnimation(config.animationId);
        }
      },
    ),
  );

  // themeId reactivity
  createEffect(
    on(
      () => config.themeId,
      () => {
        const dotLottieInstance = dotLottie();

        if (!dotLottieInstance) return;

        if (dotLottieInstance.isLoaded && dotLottieInstance.activeThemeId !== config.themeId) {
          dotLottieInstance.setTheme(config.themeId || '');
        }
      },
    ),
  );

  // themeData reactivity
  createEffect(
    on(
      () => config.themeData,
      () => {
        const dotLottieInstance = dotLottie();

        if (!dotLottieInstance) return;

        if (dotLottieInstance.isLoaded) {
          dotLottieInstance.setThemeData(config.themeData || '');
        }
      },
    ),
  );

  return {
    dotLottie,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef,
    container: containerRef,
    DotLottieComponent: Component,
  };
};

export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
};
