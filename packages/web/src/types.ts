export interface RenderConfig {
  autoResize?: boolean;
  devicePixelRatio?: number;
  freezeOnOffscreen?: boolean;
}

export type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

export type Data = string | ArrayBuffer | Record<string, unknown>;

export type Fit = 'contain' | 'cover' | 'fill' | 'none' | 'fit-width' | 'fit-height';

export interface Layout {
  align?: [number, number];
  fit?: Fit;
}

export interface Config {
  animationId?: string;
  autoplay?: boolean;
  backgroundColor?: string;
  canvas: HTMLCanvasElement | OffscreenCanvas;
  data?: Data;
  layout?: Layout;
  loop?: boolean;
  marker?: string;
  mode?: Mode;
  renderConfig?: RenderConfig;
  segment?: [number, number];
  speed?: number;
  src?: string;
  stateMachineConfig?: StateMachineConfig;
  stateMachineId?: string;
  themeId?: string;
  useFrameInterpolation?: boolean;
}

export interface StateMachineConfig {
  /**
   * Controls whether and which URLs can be opened by a state machine.
   *
   * - requireUserInteraction: When true, URLs open only after an explicit user action
   *   (e.g., click/pointer down) on the animation.
   * - whitelist: List of allowed URL patterns. An empty list blocks all URLs. Use
   *   "*" to allow all URLs. Wildcards are supported in host and path (e.g.,
   *   "*.example.com/*").
   *
   * @example
   * ```typescript
   * // Require user interaction before opening any URL
   * openUrlPolicy: { requireUserInteraction: true, whitelist: ["*"] }
   *
   * // Block all URLs
   * openUrlPolicy: { whitelist: [] }
   *
   * // Allow all URLs
   * openUrlPolicy: { whitelist: ["*"] }
   *
   * // Allow a specific domain only
   * openUrlPolicy: { whitelist: ["https://example.com"] }
   *
   * // Allow subdomains and any path under lottiefiles.com
   * openUrlPolicy: { whitelist: ["*.lottiefiles.com/*"] }
   * ```
   *
   * By default, URLs are denied and require user interaction.
   */
  openUrlPolicy?: {
    requireUserInteraction?: boolean;
    whitelist?: string[];
  };
}

export interface Manifest {
  animations: Array<{
    background?: string;
    id: string;
    initialTheme?: string;
    themes?: string[];
  }>;
  generator?: string;
  stateMachines?: Array<{ id: string }>;
  themes?: Array<{ id: string }>;
  version?: string;
}
