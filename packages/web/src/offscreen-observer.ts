import type { DotLottie } from './dotlottie';
import type { DotLottieWorker } from './worker/dotlottie';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class OffscreenObserver {
  private static _observer: IntersectionObserver | null = null;

  private static readonly _observedCanvases = new Map<HTMLCanvasElement, DotLottie | DotLottieWorker>();

  private static _initializeObserver(): void {
    if (OffscreenObserver._observer) return;

    const intersectionObserverCallback = (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry) => {
        const instance = OffscreenObserver._observedCanvases.get(entry.target as HTMLCanvasElement);

        if (instance) {
          if (entry.isIntersecting) {
            instance.unfreeze();
          } else {
            instance.freeze();
          }
        }
      });
    };

    OffscreenObserver._observer = new IntersectionObserver(intersectionObserverCallback, {
      threshold: 0,
    });
  }

  public static observe(canvas: HTMLCanvasElement, dotLottieInstance: DotLottie | DotLottieWorker): void {
    OffscreenObserver._initializeObserver();

    if (OffscreenObserver._observedCanvases.has(canvas)) return;

    OffscreenObserver._observedCanvases.set(canvas, dotLottieInstance);
    OffscreenObserver._observer?.observe(canvas);
  }

  public static unobserve(canvas: HTMLCanvasElement): void {
    OffscreenObserver._observer?.unobserve(canvas);
    OffscreenObserver._observedCanvases.delete(canvas);

    if (OffscreenObserver._observedCanvases.size === 0) {
      OffscreenObserver._observer?.disconnect();
      OffscreenObserver._observer = null;
    }
  }
}
