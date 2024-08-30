import type { DotLottie } from './dotlottie';
import type { DotLottieWorker } from './worker/dotlottie';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CanvasResizeObserver {
  private static _observer: ResizeObserver | null = null;

  private static readonly _observedCanvases = new Map<HTMLCanvasElement, DotLottie | DotLottieWorker>();

  private static _initializeObserver(): void {
    if (this._observer) return;

    const resizeHandler = (entries: ResizeObserverEntry[]): void => {
      entries.forEach((entry) => {
        this._observedCanvases.get(entry.target as HTMLCanvasElement)?.resize();
      });
    };

    this._observer = new ResizeObserver(resizeHandler);
  }

  public static observe(canvas: HTMLCanvasElement, dotLottieInstance: DotLottie | DotLottieWorker): void {
    this._initializeObserver();

    if (this._observedCanvases.has(canvas)) return;

    this._observedCanvases.set(canvas, dotLottieInstance);
    this._observer?.observe(canvas);
  }

  public static unobserve(canvas: HTMLCanvasElement): void {
    this._observer?.unobserve(canvas);
    this._observedCanvases.delete(canvas);

    if (this._observedCanvases.size === 0) {
      this._observer?.disconnect();
      this._observer = null;
    }
  }
}
