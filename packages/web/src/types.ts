/**
 * 3x3 transformation matrix for the entire animation on the canvas.
 * Represented as a flattened 9-element tuple in row-major order: [m00, m01, m02, m10, m11, m12, m20, m21, m22].
 * Used for affine transformations (translation, rotation, scale, skew) applied to the whole animation.
 */
export type Transform = [number, number, number, number, number, number, number, number, number];

/**
 * Configuration for canvas rendering behavior.
 * Controls how the animation is rendered and when rendering is optimized.
 */
export interface RenderConfig {
  /**
   * Automatically resize canvas when container size changes.
   * Set to true to maintain responsiveness without manual resize calls.
   */
  autoResize?: boolean;
  /**
   * Pixel density multiplier for high-DPI displays.
   * Higher values increase quality but use more memory. Defaults to window.devicePixelRatio.
   */
  devicePixelRatio?: number;
  /**
   * Pause rendering when canvas is outside the viewport.
   * Set to true (default) to improve performance when animation isn't visible.
   */
  freezeOnOffscreen?: boolean;
  /**
   * Rendering quality level (0-100).
   * Lower values reduce quality but improve performance on resource-constrained devices.
   */
  quality?: number;
}

/**
 * Animation playback direction mode.
 * Determines how frames are sequenced: forward, reverse, or alternating (bounce) modes.
 */
export type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

/**
 * Animation data format accepted by the player.
 * Can be a JSON string, binary ArrayBuffer, or parsed JSON object.
 */
export type Data = string | ArrayBuffer | Record<string, unknown>;

/**
 * Layout fit mode determining how animation scales to canvas.
 * Controls scaling behavior similar to CSS object-fit property.
 */
export type Fit = 'contain' | 'cover' | 'fill' | 'none' | 'fit-width' | 'fit-height';

/**
 * Layout configuration for positioning and scaling animations within the canvas.
 * Determines how the animation fits and aligns within the available space.
 */
export interface Layout {
  /**
   * Alignment position as [x, y] coordinates in 0-1 range.
   * [0.5, 0.5] centers the animation, [0, 0] is top-left, [1, 1] is bottom-right.
   */
  align?: [number, number];
  /**
   * Fit mode controlling how animation scales to canvas dimensions.
   * Defaults to 'contain' to show the full animation without cropping.
   */
  fit?: Fit;
}

/**
 * Dimensions of a rendering surface for custom canvas implementations.
 * Used when providing a custom render surface instead of HTMLCanvasElement.
 */
export interface RenderSurface {
  /** Height of the render surface in pixels */
  height: number;
  /** Width of the render surface in pixels */
  width: number;
}

/**
 * Main configuration object for initializing a DotLottie player.
 * Specifies the animation source, playback behavior, rendering options, and canvas target.
 */
export interface Config {
  /**
   * ID of the specific animation to play from a multi-animation dotLottie file.
   * Leave undefined for single-animation files or to play the default animation.
   */
  animationId?: string;
  /**
   * Automatically start playback once the animation is loaded.
   * Set to true for animations that should play immediately without user interaction.
   */
  autoplay?: boolean;
  /**
   * Background color as a CSS color string (e.g., '#FFFFFF' or 'transparent').
   * Applied to the canvas element or as a fill behind the animation.
   */
  backgroundColor?: string;
  /**
   * Target canvas element for rendering.
   * Can be HTMLCanvasElement, OffscreenCanvas, or custom RenderSurface with dimensions.
   */
  canvas?: HTMLCanvasElement | OffscreenCanvas | RenderSurface;
  /**
   * Animation data to load directly.
   * Use this to load from a string, ArrayBuffer, or parsed JSON instead of fetching from src.
   */
  data?: Data;
  /**
   * Layout configuration for positioning and scaling the animation.
   * Controls fit mode and alignment within the canvas.
   */
  layout?: Layout;
  /**
   * Enable continuous looping of the animation.
   * Set to true to repeat indefinitely, or use loopCount for a specific number of loops.
   */
  loop?: boolean;
  /**
   * Number of additional times to replay the animation after the first play.
   * Requires `loop` to be true. A value of 0 means infinite replays; a positive value `n` means
   * the animation plays a total of `n + 1` times (initial play + `n` replays).
   */
  loopCount?: number;
  /**
   * Named marker to use as the playback segment.
   * Plays only the portion of the animation defined by this marker instead of the full animation.
   */
  marker?: string;
  /**
   * Playback direction mode.
   * Controls whether animation plays forward, reverse, or alternates (bounce).
   */
  mode?: Mode;
  /**
   * Rendering configuration controlling canvas behavior.
   * Includes autoResize, devicePixelRatio, freezeOnOffscreen, and quality settings.
   */
  renderConfig?: RenderConfig;
  /**
   * Frame range to play as [startFrame, endFrame].
   * Restricts playback to a specific portion of the animation instead of the full sequence.
   */
  segment?: [number, number];
  /**
   * Playback speed multiplier.
   * 1 is normal speed, 2 is double speed, 0.5 is half speed.
   */
  speed?: number;
  /**
   * URL to fetch the animation from.
   * Use this to load .lottie or .json files from a remote or local path.
   */
  src?: string;
  /**
   * State machine security configuration.
   * Controls URL opening policies for state machine-driven animations.
   */
  stateMachineConfig?: StateMachineConfig;
  /**
   * ID of the state machine to load and activate.
   * State machines enable interactive, event-driven animation behaviors.
   */
  stateMachineId?: string;
  /**
   * ID of the theme to apply to the animation.
   * Themes modify colors and visual properties defined in the dotLottie manifest.
   */
  themeId?: string;
  /**
   * Enable frame interpolation for smoother playback.
   * Set to true (default) for smoother animation, false for exact frame-by-frame playback.
   */
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

/**
 * dotLottie manifest containing metadata about available animations, themes, and state machines.
 * Included in .lottie files to describe the contents and relationships between components.
 */
export interface Manifest {
  /**
   * List of animations available in this dotLottie file.
   * Each animation can have its own ID, themes, and background color.
   */
  animations: Array<{
    /** Background color for this animation */
    background?: string;
    /** Unique identifier for this animation */
    id: string;
    /** Default theme to apply when this animation loads */
    initialTheme?: string;
    /** List of theme IDs compatible with this animation */
    themes?: string[];
  }>;
  /** Tool or application that created this dotLottie file */
  generator?: string;
  /** List of available state machines for interactive behavior */
  stateMachines?: Array<{ id: string }>;
  /** List of available themes that can modify animation appearance */
  themes?: Array<{ id: string }>;
  /** dotLottie specification version */
  version?: string;
}
