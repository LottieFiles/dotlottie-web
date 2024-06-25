export interface RenderConfig {
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

// export interface IDotLottie {
//   activeAnimationId: string | undefined;
//   activeThemeId: string | undefined;
//   addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void;
//   autoplay: boolean;
//   backgroundColor: string;
//   canvas: HTMLCanvasElement | OffscreenCanvas;
//   currentFrame: number;
//   destroy(): void;
//   duration: number;
//   freeze(): void;
//   isFrozen: boolean;
//   isLoaded: boolean;
//   isPaused: boolean;
//   isPlaying: boolean;
//   isStopped: boolean;
//   layout: Layout | undefined;
//   load(config: Omit<Config, 'canvas'>): void;
//   loadAnimation(animationId: string): void;
//   loadTheme(themeId: string): boolean;
//   loadThemeData(themeData: string): boolean;
//   loop: boolean;
//   loopCount: number;
//   manifest: Manifest | null;
//   marker: string | undefined;
//   markers(): Marker[];
//   mode: Mode;
//   pause(): void;
//   play(): void;
//   removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void;
//   renderConfig: RenderConfig;
//   resize(): void;
//   segment: [number, number] | undefined;
//   segmentDuration: number;
//   setBackgroundColor(color: string): void;
//   setFrame(frame: number): void;
//   setLayout(layout: Layout): void;
//   setLoop(loop: boolean): void;
//   setMarker(marker: string): void;
//   setMode(mode: Mode): void;
//   setRenderConfig(config: RenderConfig): void;
//   setSegment(startFrame: number, endFrame: number): void;
//   setSpeed(speed: number): void;
//   setUseFrameInterpolation(useFrameInterpolation: boolean): void;
//   setViewport(x: number, y: number, width: number, height: number): boolean;
//   speed: number;
//   stop(): void;
//   totalFrames: number;
//   unfreeze(): void;
//   useFrameInterpolation: boolean;
// }
