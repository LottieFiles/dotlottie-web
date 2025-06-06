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
  themeId?: string;
  useFrameInterpolation?: boolean;
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
