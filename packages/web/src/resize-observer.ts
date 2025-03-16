import type { DotLottie } from './dotlottie';
import type { DotLottieWorker } from './worker/dotlottie';

export const RESIZE_DEBOUNCE_TIME = 100;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CanvasResizeObserver {
  private static _observer: ResizeObserver | null = null;

  private static readonly _observedCanvases = new Map<HTMLCanvasElement, [DotLottie | DotLottieWorker, number]>();

  private static _initializeObserver(): void {
    if (this._observer) return;

    const resizeHandler = (entries: ResizeObserverEntry[]): void => {
      entries.forEach((entry) => {
        const element = this._observedCanvases.get(entry.target as HTMLCanvasElement);

        if (!element) return;

        const [dotLottieInstance, timeout] = element;

        clearTimeout(timeout);

        const newTimeout = setTimeout(() => {
          dotLottieInstance.resize();
        }, RESIZE_DEBOUNCE_TIME) as unknown as number;

        this._observedCanvases.set(entry.target as HTMLCanvasElement, [dotLottieInstance, newTimeout]);
      });
    };

    this._observer = new ResizeObserver(resizeHandler);
  }

  public static observe(canvas: HTMLCanvasElement, dotLottieInstance: DotLottie | DotLottieWorker): void {
    this._initializeObserver();

    if (this._observedCanvases.has(canvas)) return;

    this._observedCanvases.set(canvas, [dotLottieInstance, 0]);
    this._observer?.observe(canvas);
  }

  public static unobserve(canvas: HTMLCanvasElement): void {
    const element = this._observedCanvases.get(canvas);

    if (element) {
      const timeoutId = element[1];

      if (timeoutId) clearTimeout(timeoutId);
    }

    this._observer?.unobserve(canvas);
    this._observedCanvases.delete(canvas);

    if (!this._observedCanvases.size && this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}
