// Interface for any object that has freeze and unfreeze methods
export interface FreezableInstance {
  freeze(): void | Promise<void>;
  unfreeze(): void | Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class OffscreenObserver {
  private static _observer: IntersectionObserver | null = null;

  private static readonly _observedCanvases = new Map<HTMLCanvasElement, FreezableInstance>();

  private static _initializeObserver(): void {
    if (this._observer) return;

    const intersectionObserverCallback = (entries: IntersectionObserverEntry[]): void => {
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
    };

    this._observer = new IntersectionObserver(intersectionObserverCallback, {
      threshold: 0,
    });
  }

  public static observe<T extends FreezableInstance>(canvas: HTMLCanvasElement, dotLottieInstance: T): void {
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
