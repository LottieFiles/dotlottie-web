import type { DotLottie } from './dotlottie';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class OffscreenObserver {
  private static _observer: IntersectionObserver | null = null;

  private static readonly _observedCanvases: Map<HTMLCanvasElement, DotLottie> = new Map();

  private static _initializeObserver(): void {
    if (!this._observer) {
      this._observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach((entry) => {
            const dotLottieInstance = this._observedCanvases.get(entry.target as HTMLCanvasElement);

            if (dotLottieInstance) {
              if (entry.isIntersecting) {
                dotLottieInstance.unfreeze();
              } else {
                dotLottieInstance.freeze();
              }
            }
          });
        },
        {
          threshold: 0,
        },
      );
    }
  }

  public static observe(canvas: HTMLCanvasElement, dotLottieInstance: DotLottie): void {
    this._initializeObserver();

    this._observedCanvases.set(canvas, dotLottieInstance);
    this._observer?.observe(canvas);
  }

  public static unobserve(canvas: HTMLCanvasElement): void {
    if (this._observer) {
      this._observer.unobserve(canvas);
      this._observedCanvases.delete(canvas);
    }
  }
}
