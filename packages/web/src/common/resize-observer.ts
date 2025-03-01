export const RESIZE_DEBOUNCE_TIME = 100;

// Interface for any object that has a resize method
export interface ResizableInstance {
  resize(): void | Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CanvasResizeObserver {
  private static _observer: ResizeObserver | null = null;

  private static readonly _observedCanvases = new Map<HTMLCanvasElement, [ResizableInstance, number]>();

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

  public static observe<T extends ResizableInstance>(canvas: HTMLCanvasElement, dotLottieInstance: T): void {
    this._initializeObserver();

    if (this._observedCanvases.has(canvas)) return;

    this._observedCanvases.set(canvas, [dotLottieInstance, 0]);
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
