export interface RenderConfig {
  autoResize?: boolean;
  devicePixelRatio?: number;
  freezeOnOffscreen?: boolean;
}

export type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

export type Data = string | ArrayBuffer | Record<string, unknown>;

export type Fit = 'contain' | 'cover' | 'fill' | 'none' | 'fit-width' | 'fit-height';

export type OpenUrlMode = 'deny' | 'allow';

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
   * Security configuration for URL opening in animations.
   *
   * @example
   * ```typescript
   * // Block all URLs
   * openUrl: { mode: 'deny' }
   *
   * // Allow specific domains only
   * openUrl: {
   *   mode: 'allow',
   *   whitelist: ["https://example.com"]
   * }
   * ```
   */
  openUrl?: {
    mode: OpenUrlMode;
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
