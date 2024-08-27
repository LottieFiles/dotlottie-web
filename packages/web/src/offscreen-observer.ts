import type { DotLottie } from './dotlottie';
import type { DotLottieWorker } from './worker/dotlottie';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class OffscreenObserver {
  private static _observer: IntersectionObserver | null = null;

  private static readonly _observedCanvases = new Map<HTMLCanvasElement, DotLottie | DotLottieWorker>();

  private static _initializeObserver(): void {
    if (this._observer) return;

    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const instance = this._observedCanvases.get(entry.target as HTMLCanvasElement);

          if (instance) {
            if (entry.isIntersecting) {
              instance.unfreeze();
            } else {
              instance.freeze();
            }
          }
        });
      },
      { threshold: 0 },
    );
  }

  public static observe(canvas: HTMLCanvasElement, dotLottieInstance: DotLottie | DotLottieWorker): void {
    this._initializeObserver();
    this._observedCanvases.set(canvas, dotLottieInstance);
    this._observer?.observe(canvas);
  }

  public static unobserve(canvas: HTMLCanvasElement): void {
    this._observer?.unobserve(canvas);
    this._observedCanvases.delete(canvas);
  }
}
