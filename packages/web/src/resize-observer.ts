import type { DotLottie } from './dotlottie';
import type { DotLottieWorker } from './worker/dotlottie';

export const RESIZE_DEBOUNCE_TIME = 100;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CanvasResizeObserver {
  private static _observer: ResizeObserver | null = null;

  private static readonly _observedCanvases = new Map<HTMLCanvasElement, [DotLottie | DotLottieWorker, number]>();

  private static _initializeObserver(): void {
    if (CanvasResizeObserver._observer) return;

    const resizeHandler = (entries: ResizeObserverEntry[]): void => {
      entries.forEach((entry) => {
        const element = CanvasResizeObserver._observedCanvases.get(entry.target as HTMLCanvasElement);

        if (!element) return;

        const [dotLottieInstance, timeout] = element;

        clearTimeout(timeout);

        const newTimeout = setTimeout(() => {
          dotLottieInstance.resize();
        }, RESIZE_DEBOUNCE_TIME) as unknown as number;

        CanvasResizeObserver._observedCanvases.set(entry.target as HTMLCanvasElement, [dotLottieInstance, newTimeout]);
      });
    };

    CanvasResizeObserver._observer = new ResizeObserver(resizeHandler);
  }

  public static observe(canvas: HTMLCanvasElement, dotLottieInstance: DotLottie | DotLottieWorker): void {
    CanvasResizeObserver._initializeObserver();

    if (CanvasResizeObserver._observedCanvases.has(canvas)) return;

    CanvasResizeObserver._observedCanvases.set(canvas, [dotLottieInstance, 0]);
    CanvasResizeObserver._observer?.observe(canvas);
  }

  public static unobserve(canvas: HTMLCanvasElement): void {
    const element = CanvasResizeObserver._observedCanvases.get(canvas);

    if (element) {
      const timeoutId = element[1];

      if (timeoutId) clearTimeout(timeoutId);
    }

    CanvasResizeObserver._observer?.unobserve(canvas);
    CanvasResizeObserver._observedCanvases.delete(canvas);

    if (!CanvasResizeObserver._observedCanvases.size && CanvasResizeObserver._observer) {
      CanvasResizeObserver._observer.disconnect();
      CanvasResizeObserver._observer = null;
    }
  }
}
