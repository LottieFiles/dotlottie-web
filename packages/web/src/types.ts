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

/**
 * Bezier easing handle for keyframe interpolation
 */
export interface BezierHandle {
  x: number | number[];
  y: number | number[];
}

/**
 * Keyframe in Lottie native format
 * The value type (Color, Vector, number, etc.)
 */
export interface Keyframe<T> {
  /** Hold keyframe - no interpolation to next keyframe */
  h?: 0 | 1;
  /** Incoming bezier handle (optional, for easing) */
  i?: BezierHandle;
  /** Outgoing bezier handle (optional, for easing) */
  o?: BezierHandle;
  /** Start value at this keyframe */
  s: T;
  /** Time (frame number) */
  t: number;
}

/**
 * Color as RGB or RGBA array with values normalized to [0, 1]
 * @example [1, 0, 0] // red
 * @example [1, 0, 0, 0.5] // red with 50% opacity
 */
export type Color = [number, number, number] | [number, number, number, number];

/**
 * Color slot value - static color or array of keyframes
 * @example Static: [1, 0, 0, 1] // red
 * @example Animated: [\{ t: 0, s: [1, 0, 0, 1] \}, \{ t: 60, s: [0, 0, 1, 1] \}]
 */
export type ColorSlotValue = Color | Array<Keyframe<Color>>;

/**
 * Scalar slot value - static number or array of keyframes (rotation, opacity, etc.)
 * @example Static: 45
 * @example Animated: [\{ t: 0, s: 0 \}, \{ t: 60, s: 360 \}]
 */
export type ScalarSlotValue = number | Array<Keyframe<number>>;

/**
 * Vector as 2D or 3D point
 * @example [100, 100] // 2D vector
 * @example [100, 100, 0] // 3D vector
 */
export type Vector = [number, number] | [number, number, number];

/**
 * Vector slot value - static vector or array of keyframes
 * Used for both "vector" and "position" slot types
 * @example Static: [100, 100]
 * @example Animated: [\{ t: 0, s: [0, 0] \}, \{ t: 60, s: [100, 100] \}]
 */
export type VectorSlotValue = Vector | Array<Keyframe<Vector>>;

/**
 * Gradient as raw Lottie flat array format
 * Color stops: [offset, r, g, b, offset, r, g, b, ...]
 * With opacity: [...color stops, offset, opacity, offset, opacity, ...]
 * All values are in [0, 1] range
 * @example [0, 1, 0, 0, 1, 0, 0, 1] // red to blue gradient
 */
export type Gradient = number[];

/**
 * Gradient slot value - static gradient or array of keyframes
 * @example Static: [0, 1, 0, 0, 1, 0, 0, 1]
 * @example Animated: [\{ t: 0, s: [0, 1, 0, 0, 1, 0, 0, 1] \}]
 */
export type GradientSlotValue = Gradient | Array<Keyframe<Gradient>>;

/**
 * Text document properties
 * @see https://lottiefiles.github.io/lottie-docs/text/#text-document
 */
export interface TextDocument {
  /** Font family */
  f?: string;
  /** Fill color [r, g, b] or [r, g, b, a] in [0, 1] range */
  fc?: Color;
  /** Justify: 0=left, 1=right, 2=center */
  j?: 0 | 1 | 2;
  /** Line height */
  lh?: number;
  /** Font size */
  s?: number;
  /** Stroke color [r, g, b] or [r, g, b, a] in [0, 1] range */
  sc?: Color;
  /** Stroke width */
  sw?: number;
  /** Text content (newlines encoded with carriage return) */
  t?: string;
  /** Tracking (letter spacing) */
  tr?: number;
}

/**
 * Text slot value - always static (text documents don't support animation)
 * @example \{ t: 'Hello', s: 24, fc: [0,0,0,1] \}
 */
export type TextSlotValue = TextDocument;

/**
 * Slot type string as returned by the core
 */
export type SlotType = 'color' | 'gradient' | 'image' | 'text' | 'scalar' | 'vector';

// =============================================================================
// THEME TYPES (dotLottie v2.0 Specification)
// =============================================================================

/**
 * Base properties shared by all theme keyframes.
 */
export interface ThemeBaseKeyframe {
  /** Timeline position in animation frames */
  frame: number;
  /** When true, holds value without interpolation until next keyframe */
  hold?: boolean;
  /** Incoming Bézier handle for easing into this keyframe */
  inTangent?: BezierHandle;
  /** Outgoing Bézier handle for easing out of this keyframe */
  outTangent?: BezierHandle;
}

/**
 * Color keyframe for animated color transitions.
 */
export interface ThemeColorKeyframe extends ThemeBaseKeyframe {
  /** Color value as normalized RGB or RGBA (0-1 range) */
  value: Color;
}

/**
 * Scalar keyframe for animated numeric properties.
 */
export interface ThemeScalarKeyframe extends ThemeBaseKeyframe {
  /** Numeric value at this keyframe */
  value: number;
}

/**
 * Position keyframe for animated position properties.
 */
export interface ThemePositionKeyframe extends ThemeBaseKeyframe {
  /** Position as 2D or 3D coordinates */
  value: Vector;
  /** Incoming tangent for spatial interpolation (curved paths) */
  valueInTangent?: number[];
  /** Outgoing tangent for spatial interpolation (curved paths) */
  valueOutTangent?: number[];
}

/**
 * Vector keyframe for animated vector properties (scale, size, etc.).
 */
export interface ThemeVectorKeyframe extends ThemeBaseKeyframe {
  /** Vector value as [x, y] or [x, y, z] */
  value: Vector;
}

/**
 * Gradient color stop definition.
 */
export interface ThemeGradientStop {
  /** Color as RGB or RGBA (0-1 range) */
  color: Color;
  /** Position along gradient line (0-1) */
  offset: number;
}

/**
 * Gradient keyframe for animated gradient transitions.
 */
export interface ThemeGradientKeyframe extends ThemeBaseKeyframe {
  /** Array of gradient stops at this keyframe */
  value: ThemeGradientStop[];
}

/**
 * Text justification options.
 */
export type ThemeTextJustify =
  | 'Left'
  | 'Right'
  | 'Center'
  | 'JustifyLastLeft'
  | 'JustifyLastRight'
  | 'JustifyLastCenter'
  | 'JustifyLastFull';

/**
 * Text capitalization styles.
 */
export type ThemeTextCaps = 'Regular' | 'AllCaps' | 'SmallCaps';

/**
 * Text document properties for theme text rules.
 * Uses descriptive property names as per dotLottie v2.0 spec.
 * @see https://dotlottie.io/spec/2.0/#text-document
 */
export interface ThemeTextDocument {
  /** Vertical baseline offset in pixels */
  baselineShift?: number;
  /** Fill color as RGB or RGBA (0-1 range) */
  fillColor?: Color;
  /** Font family name */
  fontName?: string;
  /** Font size in points */
  fontSize?: number;
  /** Text alignment and justification */
  justify?: ThemeTextJustify;
  /** Line height spacing multiplier */
  lineHeight?: number;
  /** Stroke color as RGB or RGBA (0-1 range) */
  strokeColor?: Color;
  /** When true, stroke renders over fill */
  strokeOverFill?: boolean;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Text content to display */
  text?: string;
  /** Text capitalization style */
  textCaps?: ThemeTextCaps;
  /** Letter spacing in 1/1000 em units */
  tracking?: number;
  /** Text wrap box position [x, y] */
  wrapPosition?: [number, number];
  /** Text wrap bounding box [width, height] */
  wrapSize?: [number, number];
}

/**
 * Text keyframe for animated text document properties.
 */
export interface ThemeTextKeyframe {
  /** Timeline position in animation frames */
  frame: number;
  /** Text document configuration at this keyframe */
  value: ThemeTextDocument;
}

/**
 * Image value for theme image rules.
 */
export interface ThemeImageValue {
  /** Display height in pixels */
  height?: number;
  /** Reference to image in dotLottie package (i/ folder) */
  id?: string;
  /** External URL or data URI (fallback if id not found) */
  url?: string;
  /** Display width in pixels */
  width?: number;
}

/**
 * Base properties shared by all theme rules.
 */
export interface ThemeBaseRule {
  /** Limit rule to specific animations (omit to apply to all) */
  animations?: string[];
  /** Lottie expression for dynamic values */
  expression?: string;
  /** Slot ID in the Lottie animation (case-sensitive) */
  id: string;
}

/**
 * Color rule for overriding color properties (fill, stroke, text color).
 */
export interface ThemeColorRule extends ThemeBaseRule {
  /** Animated color keyframes */
  keyframes?: ThemeColorKeyframe[];
  type: 'Color';
  /** Static color value (RGB or RGBA, 0-1 range) */
  value?: Color;
}

/**
 * Scalar rule for overriding numeric properties (opacity, stroke width, rotation).
 */
export interface ThemeScalarRule extends ThemeBaseRule {
  /** Animated scalar keyframes */
  keyframes?: ThemeScalarKeyframe[];
  type: 'Scalar';
  /** Static numeric value */
  value?: number;
}

/**
 * Position rule for overriding position properties.
 */
export interface ThemePositionRule extends ThemeBaseRule {
  /** Animated position keyframes */
  keyframes?: ThemePositionKeyframe[];
  type: 'Position';
  /** Static position (2D or 3D coordinates) */
  value?: Vector;
}

/**
 * Vector rule for overriding vector properties (scale, size).
 */
export interface ThemeVectorRule extends ThemeBaseRule {
  /** Animated vector keyframes */
  keyframes?: ThemeVectorKeyframe[];
  type: 'Vector';
  /** Static vector value */
  value?: Vector;
}

/**
 * Gradient rule for overriding gradient properties.
 */
export interface ThemeGradientRule extends ThemeBaseRule {
  /** Animated gradient keyframes */
  keyframes?: ThemeGradientKeyframe[];
  type: 'Gradient';
  /** Static gradient (array of color stops) */
  value?: ThemeGradientStop[];
}

/**
 * Image rule for overriding image assets.
 */
export interface ThemeImageRule extends ThemeBaseRule {
  type: 'Image';
  /** Image replacement configuration (required for Image rules) */
  value: ThemeImageValue;
}

/**
 * Text rule for overriding text document properties.
 */
export interface ThemeTextRule extends ThemeBaseRule {
  /** Animated text keyframes */
  keyframes?: ThemeTextKeyframe[];
  type: 'Text';
  /** Static text document configuration */
  value?: ThemeTextDocument;
}

/**
 * Union of all theme rule types.
 */
export type ThemeRule =
  | ThemeColorRule
  | ThemeScalarRule
  | ThemePositionRule
  | ThemeVectorRule
  | ThemeGradientRule
  | ThemeImageRule
  | ThemeTextRule;

/**
 * Theme definition for customizing Lottie animation properties.
 * Themes override animated properties mapped to Lottie Slots.
 * @see https://dotlottie.io/spec/2.0/#themes
 *
 * @example
 * ```typescript
 * const theme: Theme = {
 *   rules: [
 *     {
 *       id: 'background_color',
 *       type: 'Color',
 *       value: [0.2, 0.4, 0.8] // Blue
 *     },
 *     {
 *       id: 'title_text',
 *       type: 'Text',
 *       value: {
 *         text: 'Hello World',
 *         fontSize: 48,
 *         fillColor: [1, 1, 1]
 *       }
 *     }
 *   ]
 * };
 *
 * dotLottie.setThemeData(theme);
 * ```
 */
export interface Theme {
  /** Array of rules defining property overrides */
  rules: ThemeRule[];
}
