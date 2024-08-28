import type { DotLottie } from './dotlottie';
import type { DotLottieWorker } from './worker/dotlottie';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CanvasResizeObserver {
  private static _observer: ResizeObserver | null = null;

  private static readonly _observedCanvases = new Map<HTMLCanvasElement, DotLottie | DotLottieWorker>();

  private static _initializeObserver(): void {
    if (!this._observer) {
      const resizeHandler = (entries: ResizeObserverEntry[]): void => {
        entries.forEach((entry) => {
          this._observedCanvases.get(entry.target as HTMLCanvasElement)?.resize();
        });
      };

      this._observer = new ResizeObserver(resizeHandler);
    }
  }

  public static observe(element: HTMLCanvasElement, dotLottieInstance: DotLottie | DotLottieWorker): void {
    this._initializeObserver();

    if (this._observedCanvases.has(element)) return;

    this._observedCanvases.set(element, dotLottieInstance);
    this._observer?.observe(element);
  }

  public static unobserve(element: HTMLCanvasElement): void {
    this._observedCanvases.delete(element);
    this._observer?.unobserve(element);

    if (this._observedCanvases.size === 0) {
      this._observer?.disconnect();
      this._observer = null;
    }
  }
}
