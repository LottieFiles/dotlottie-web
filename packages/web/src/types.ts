export interface RenderConfig {
  autoResize?: boolean;
  devicePixelRatio?: number;
  freezeOnOffscreen?: boolean;
}

export type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

export type Data = string | ArrayBuffer | Record<string, unknown>;

export type Fit = 'contain' | 'cover' | 'fill' | 'none' | 'fit-width' | 'fit-height';

export interface Layout {
  align: [number, number];
  fit: Fit;
}

export type OpenUrlMode = 'allow' | 'deny' | 'interaction';

export interface OpenUrl {
  mode: OpenUrlMode;
  whitelist: string[];
}

export interface Config {
  autoplay?: boolean;
  backgroundColor?: string;
  canvas: HTMLCanvasElement;
  data?: Data;
  layout?: Layout;
  loop?: boolean;
  marker?: string;
  mode?: Mode;
  renderConfig?: RenderConfig;
  segment?: [number, number];
  speed?: number;
  src?: string;
  stateMachineId?: string;
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
