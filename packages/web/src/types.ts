export interface RenderConfig {
  autoResize?: boolean;
  devicePixelRatio?: number;
}

export type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

export type Data = string | ArrayBuffer | Record<string, unknown>;

export type Fit = 'contain' | 'cover' | 'fill' | 'none' | 'fit-width' | 'fit-height';

export interface Layout {
  align: [number, number];
  fit: Fit;
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
  useFrameInterpolation?: boolean;
}

export interface Manifest {
  activeAnimationId?: string;
  animations: Array<{
    autoplay?: boolean;
    defaultTheme?: string;
    direction?: 1 | -1;
    hover?: boolean;
    id: string;
    intermission?: number;
    loop?: boolean | number;
    playMode?: 'bounce' | 'normal';
    speed?: number;
    themeColor?: string;
  }>;
  author?: string;
  custom?: Record<string, unknown>;
  description?: string;
  generator?: string;
  keywords?: string;
  revision?: number;
  states?: string[];
  themes?: Array<{ animations: string[]; id: string }>;
  version?: string;
}
