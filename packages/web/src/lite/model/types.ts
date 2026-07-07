/**
 * Shared types for the dotLottieLitePlayer runtime.
 */
export interface Point {
  x: number;
  y: number;
}
export interface Size {
  width: number;
  height: number;
}
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}
/**
 * Resolved transform for a single frame.
 */
export interface Transform {
  position: Point;
  anchor: Point;
  scale: Point;
  rotation: number;
  opacity: number;
  skew?: number;
  skewAxis?: number;
  /**
   * Exact affine matrix for resolved parent-transform chains. When present,
   * renderers should use this matrix instead of reconstructing one from the
   * decomposed position/scale/rotation fields.
   */
  matrix?: { a: number; b: number; c: number; d: number; e: number; f: number };
}
/**
 * Transform with animated properties.
 */
export interface AnimatedTransform {
  position: PointAnimatable;
  anchor: PointAnimatable;
  scale: PointAnimatable;
  rotation: Animatable<number>;
  opacity: Animatable<number>;
  skew?: Animatable<number>;
  skewAxis?: Animatable<number>;
}
export interface ThreeDRotation {
  x: Animatable<number>;
  y: Animatable<number>;
}
export interface Keyframe<T> {
  time: number;
  value: T;
  outTangent?: Point;
  inTangent?: Point;
  hold?: boolean;
  to?: Point;
  ti?: Point;
}
export interface ExpressionContext {
  frame: number;
  time: number;
  value: unknown;
}
export interface ExpressionEvaluator {
  evaluate(expression: string, context: ExpressionContext): unknown;
}
export interface AnimatedProperty<T> {
  keyframes: Keyframe<T>[];
  expression?: string;
}
export type Animatable<T> = T | AnimatedProperty<T>;
/**
 * Independent X/Y animation curves used by Lottie "separate dimensions".
 * This preserves per-axis easing, which would be lost if the curves were
 * flattened into a single set of point keyframes.
 */
export interface SeparatePointAnimatable {
  x: Animatable<number>;
  y: Animatable<number>;
}
export type PointAnimatable = Point | AnimatedProperty<Point> | SeparatePointAnimatable;
export type Fill = SolidFill | GradientFill;
export interface SolidFill {
  type: 'solid';
  color: Animatable<Color>;
  opacity?: Animatable<number>;
  fillRule?: 'nonzero' | 'evenodd';
}
export interface GradientFill {
  type: 'gradient';
  gradientType: 'linear' | 'radial';
  start: PointAnimatable;
  end: PointAnimatable;
  colors: Animatable<ColorStop[]>;
  highlightLength?: number;
  highlightAngle?: number;
  opacity?: Animatable<number>;
  fillRule?: 'nonzero' | 'evenodd';
}
export interface ColorStop {
  offset: number;
  color: Color;
}
export interface SolidStroke {
  type: 'solid';
  color: Animatable<Color>;
  width: Animatable<number>;
  opacity: Animatable<number>;
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'miter' | 'round' | 'bevel';
  miterLimit: number;
  dash?: Animatable<number>[];
  dashOffset?: Animatable<number>;
}
export interface GradientStroke {
  type: 'gradient';
  gradientType: 'linear' | 'radial';
  start: PointAnimatable;
  end: PointAnimatable;
  colors: Animatable<ColorStop[]>;
  width: Animatable<number>;
  opacity: Animatable<number>;
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'miter' | 'round' | 'bevel';
  miterLimit: number;
  dash?: Animatable<number>[];
  dashOffset?: Animatable<number>;
  highlightLength?: number;
  highlightAngle?: number;
}
export type Stroke = SolidStroke | GradientStroke;
export interface PathData {
  vertices: Point[];
  inTangents: Point[];
  outTangents: Point[];
  closed: boolean;
}
export interface TrimPath {
  start: Animatable<number>;
  end: Animatable<number>;
  offset: Animatable<number>;
  mode: 'simultaneous' | 'individual';
  /**
   * Identifier shared by all shapes that inherit the same trim-path modifier
   * in the source group. Used by renderers to apply simultaneous trims across
   * the combined path length of the group.
   */
  groupId?: string;
}
export interface Shape {
  id: string;
  type: 'rect' | 'ellipse' | 'path' | 'polystar' | 'merge' | 'group';
  fill?: Fill;
  stroke?: Stroke | Stroke[];
  trim?: TrimPath;
  trims?: TrimPath[];
  offset?: Animatable<number>;
  offsetLineJoin?: 'miter' | 'round' | 'bevel';
  offsetMiterLimit?: number;
  transform?: Transform;
  /**
   * Animatable shape transform. When present, the renderer/scene builder will
   * evaluate it per frame and compose it with the static `transform`.
   */
  animatedTransform?: AnimatedTransform;
  /**
   * Compensation factor for stroke width. Canvas strokes scale with the current
   * transform, but Lottie strokes defined in an ancestor group should only be
   * scaled by the transforms of groups that own the stroke. This value is the
   * ratio of the path-transform scale to the stroke-transform scale; renderers
   * should divide the stroke width by it before calling `ctx.stroke()`.
   */
  strokeWidthScale?: number;
  /**
   * Paint order for shapes that carry both fill and stroke styles. When omitted,
   * renderers keep the legacy stroke-then-fill order.
   */
  paintOrder?: 'fill-stroke';
  /**
   * Shared id for consecutive sibling paths that are filled by a single Lottie
   * fill node. Such paths form one compound path (lottie-web/ThorVG combine their
   * geometry and fill once), so an opposite-wound inner contour cuts a hole
   * (outlines, rings, letter "O"). Renderers must fill same-id runs together
   * rather than one path at a time, or the inner contour fills solid.
   */
  compoundFillId?: number;
  /**
   * Lottie shape direction (`d`): `3` means the geometry is authored with
   * reversed (counter-clockwise) winding. Reversed winding is what lets an inner
   * contour cut a hole out of an outer one under non-zero fill (e.g. a window
   * cut out of a wall). Builders must emit reversed geometry when this is set,
   * or the contour fills solid instead of cutting.
   */
  reversed?: boolean;
  repeaterCount?: Animatable<number>;
  repeaterIndex?: number;
  /**
   * Static per-copy matrix from a repeater (rotate/scale about the repeater
   * anchor, offset per index). Composed with the shape's OWN per-frame transform
   * at scene-eval time so an animated group transform is honoured.
   */
  repeaterMatrix?: { a: number; b: number; c: number; d: number; e: number; f: number };
  repeaterOpacityMult?: number;
}
export interface RectShape extends Shape {
  type: 'rect';
  rect: Rect;
  position: PointAnimatable;
  size: PointAnimatable;
  cornerRadius: Animatable<number>;
}
export interface EllipseShape extends Shape {
  type: 'ellipse';
  center: PointAnimatable;
  radius: PointAnimatable;
}
export interface PathShape extends Shape {
  type: 'path';
  path: Animatable<PathData>;
  /**
   * Corner radius from a Lottie round-corners (rd) modifier. When present, the
   * path's sharp corners are replaced with rounded arcs at evaluation time.
   */
  cornerRadius?: Animatable<number>;
}
export interface PolystarShape extends Shape {
  type: 'polystar';
  center: Point;
  starType: 'star' | 'polygon';
  points: number;
  outerRadius: number;
  innerRadius: number;
  outerRoundness: number;
  innerRoundness: number;
  rotation: number;
  cornerRadius?: Animatable<number>;
  animatedProperties?: {
    center?: PointAnimatable;
    points?: Animatable<number>;
    outerRadius?: Animatable<number>;
    innerRadius?: Animatable<number>;
    outerRoundness?: Animatable<number>;
    innerRoundness?: Animatable<number>;
    rotation?: Animatable<number>;
    cornerRadius?: Animatable<number>;
  };
}
export interface MergeShape extends Shape {
  type: 'merge';
  mode: 'merge' | 'add' | 'subtract' | 'intersect' | 'exclude';
  shapes: Shape[];
}
export interface GroupShape extends Shape {
  type: 'group';
  children: Shape[];
}
export type MaskMode = 'add' | 'subtract' | 'intersect' | 'difference';
export interface MaskDefinition {
  path: Animatable<PathData>;
  mode: MaskMode;
  inverted: boolean;
  opacity: Animatable<number>;
  expansion?: number;
}
export interface ResolvedMask {
  path: PathData;
  mode: MaskMode;
  inverted: boolean;
  opacity: number;
  expansion?: number;
}
/**
 * Resolved layer state for a single frame.
 */
export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  index: number;
  inPoint: number;
  outPoint: number;
  transform: Transform;
  shapes: Shape[];
  image?: ImageSource;
  masks?: ResolvedMask[];
  trackMatte?: 'alpha' | 'alpha-inverted' | 'luma' | 'luma-inverted';
  isMatte?: boolean;
  /**
   * Layer index (`ind`) after flattening; used to resolve explicit matte
   * source references.
   */
  ind?: number;
  /**
   * Explicit matte source reference (`tp`): the `ind` of the layer providing
   * this layer's track matte. When absent, the matte is the nearest
   * matte-source layer above in the stack.
   */
  matteParentInd?: number;
  blendMode?: string;
  text?: TextDocument;
  startTime?: number;
  stretch?: number;
  timeRemap?: Animatable<number>;
  effects?: ResolvedEffect[];
  audio?: AudioSource;
  matteChildren?: Layer[];
  /**
   * Frame used for inPoint/outPoint visibility checks. For precomp children this
   * is the source precomp timeline frame; for top-level layers it equals the
   * composition frame.
   */
  timelineFrame?: number;
  /**
   * Internal flattening marker for descendants that are present in an ancestor
   * flattened list only for transform resolution. They already render through
   * their owning masked/matted precomp composite and must not be drawn again by
   * ancestor composites.
   */
  hiddenByPrecompComposite?: boolean;
  /**
   * True for layers whose shapes/masks live on a precomp timeline.
   */
  isPrecompChildContent?: boolean;
  threeDRotation?: ThreeDRotation;
  visible: boolean;
}
export interface TextDocument {
  text: string;
  fontFamily: string;
  size: number;
  color: Color;
  tracking?: number;
  justification?: 'left' | 'center' | 'right';
  lineHeight?: number;
  rangeSelectorScale?: PointAnimatable;
  rangeSelectorEnd?: Animatable<number>;
  rangeSelectorShape?: number;
  textPath?: {
    path: Animatable<PathData>;
    firstMargin: Animatable<number>;
  };
  glyphs?: Record<string, TextGlyph>;
}
export interface TextGlyph {
  width: number;
  size: number;
  paths: PathData[];
}
export interface FillEffect {
  type: 'fill';
  color: Animatable<Color>;
  opacity: Animatable<number>;
}
export interface ResolvedFillEffect {
  type: 'fill';
  color: Color;
  opacity: number;
}
export interface DropShadowEffect {
  type: 'drop-shadow';
  color: Animatable<Color>;
  opacity: Animatable<number>;
  angle: number;
  distance: number;
  softness: number;
}
export interface ResolvedDropShadowEffect {
  type: 'drop-shadow';
  color: Color;
  opacity: number;
  angle: number;
  distance: number;
  softness: number;
}
export interface GaussianBlurEffect {
  type: 'gaussian-blur';
  blurriness: Animatable<number>;
}
export interface ResolvedGaussianBlurEffect {
  type: 'gaussian-blur';
  blurriness: number;
}
export interface TintEffect {
  type: 'tint';
  color: Animatable<Color>;
  whiteColor?: Animatable<Color>;
  amount: Animatable<number>;
}
export interface ResolvedTintEffect {
  type: 'tint';
  color: Color;
  whiteColor?: Color;
  amount: number;
}
export type Effect = FillEffect | DropShadowEffect | GaussianBlurEffect | TintEffect;
export type ResolvedEffect =
  | ResolvedFillEffect
  | ResolvedDropShadowEffect
  | ResolvedGaussianBlurEffect
  | ResolvedTintEffect;
export type LayerType = 'precomp' | 'solid' | 'image' | 'shape' | 'text' | 'audio' | 'null';
/**
 * Layer definition with animated properties.
 */
export interface LayerDefinition {
  id: string;
  name: string;
  type: LayerType;
  index: number;
  ind: number;
  inPoint: number;
  outPoint: number;
  startTime?: number;
  /**
   * Time offset used to evaluate this layer's own transform. It equals the sum
   * of ancestor precomp startTimes (excluding this layer's own startTime), so a
   * precomp layer is placed in its parent composition timeline while its
   * contents are evaluated on the precomp timeline.
   */
  transformStartTime?: number;
  refId?: string;
  parentId?: number;
  transform: AnimatedTransform;
  /**
   * Additional opacity multipliers inherited from ancestor precomp layers.
   * Each entry carries the animatable opacity and the timing context (start
   * time and stretch) of the ancestor precomp instance so it can be evaluated
   * on the correct frame.
   */
  groupOpacity?: GroupOpacityEntry[];
  shapes: Shape[];
  image?: ImageSource;
  masks?: MaskDefinition[];
  trackMatte?: 'alpha' | 'alpha-inverted' | 'luma' | 'luma-inverted';
  isMatte?: boolean;
  /**
   * Explicit matte source reference (`tp` in Lottie JSON): the `ind` of the
   * layer that provides this layer's track matte. When absent, the matte is
   * the nearest matte-source layer above in the stack.
   */
  matteParentInd?: number;
  blendMode?: string;
  text?: TextDocument;
  stretch?: number;
  timeRemap?: Animatable<number>;
  /**
   * Time remapping inherited from the parent precomp instance. When present,
   * the layer's transform and the precomp contents are evaluated on the
   * remapped parent timeline instead of the global timeline.
   */
  parentTimeRemap?: Animatable<number>;
  /**
   * When true, inPoint/outPoint are source-precomp windows and should be
   * checked against the remapped source frame instead of the parent comp frame.
   */
  remappedSourceWindow?: boolean;
  /**
   * Start time of the parent precomp instance that owns this layer. Used with
   * `parentTimeRemap` to convert the remapped parent frame into this layer's
   * local source-precomp frame.
   */
  parentStartTime?: number;
  /**
   * Optional parent composition visibility window for top-level time-remapped
   * precomp children whose own inPoint/outPoint are source-precomp windows.
   */
  sourceWindowParentInPoint?: number;
  sourceWindowParentOutPoint?: number;
  effects?: Effect[];
  audio?: AudioSource;
  matteChildren?: LayerDefinition[];
  /**
   * True for layers whose shapes/masks live on a precomp timeline. Their
   * contents are evaluated relative to the precomp placement; top-level layer
   * contents are evaluated on the composition timeline.
   */
  isPrecompChildContent?: boolean;
  /**
   * Synthetic precomp layers keep their placement transform on the parent
   * composition timeline, but masks copied from a nested precomp layer are
   * authored on that nested precomp's source timeline.
   */
  masksUseContentFrame?: boolean;
  hiddenByPrecompComposite?: boolean;
  threeDRotation?: ThreeDRotation;
  visible: boolean;
}
export interface GroupOpacityEntry {
  opacity: Animatable<number>;
  startTime: number;
  stretch: number;
}
export interface SlotValue {
  a: 0 | 1;
  k: unknown;
}
export interface Slot {
  p: SlotValue;
}
export type Slots = Record<string, Slot>;
export interface MarkerDefinition {
  name: string;
  time: number;
  duration: number;
}
export interface Animation {
  version: string;
  frameRate: number;
  inPoint: number;
  outPoint: number;
  duration: number;
  width: number;
  height: number;
  layers: LayerDefinition[];
  markers?: MarkerDefinition[];
  slots?: Slots;
  expressionEvaluator?: ExpressionEvaluator;
  /**
   * Vendor-prefixed extension blocks from the source Lottie JSON (keys
   * containing a dot, e.g. `com.lottiefiles.shaders`). These are preserved
   * verbatim so renderers and tooling can opt into experimental features
   * without polluting the core animation model.
   */
  extensions?: Record<string, unknown>;
}
export interface ImageSource {
  src: string;
  width: number;
  height: number;
}
export interface AudioSource {
  src: string;
  inPoint: number;
  outPoint: number;
  startTime?: number;
  levels?: Animatable<number>;
}
/**
 * Action executed by the state machine runtime.
 */
export type StateMachineAction =
  | {
      type: 'play';
    }
  | {
      type: 'pause';
    }
  | {
      type: 'stop';
    }
  | {
      type: 'seek';
      frame: number;
    }
  | {
      type: 'setLoop';
      loop: boolean | number;
    }
  | {
      type: 'setSpeed';
      speed: number;
    };
/**
 * Transition between states triggered by a named event.
 */
export interface StateMachineTransition {
  event: string;
  target: string;
  guard?: string;
  actions?: StateMachineAction[];
}
/**
 * A single state in a declarative state machine.
 */
export interface StateMachineState {
  name: string;
  onEnter?: StateMachineAction[];
  transitions?: StateMachineTransition[];
}
/**
 * Declarative state machine definition.
 */
export interface StateMachineDefinition {
  initial: string;
  states: StateMachineState[];
}
export interface PlayerConfig {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  src?: string;
  animationData?: object;
  loop?: boolean | number;
  autoplay?: boolean;
  backgroundColor?: string;
  speed?: number;
  bounce?: boolean;
  reverse?: boolean;
  slotOverrides?: Slots;
  stateMachine?: StateMachineDefinition;
  /**
   * Optional listener registered before the initial load/render path runs.
   * Use this when constructor-time `load` or first-frame `render` events must
   * be observed without delaying initial paint.
   */
  initialEventListener?: PlayerEventListener;
  /**
   * Accessible title and description for the animation.
   */
  title?: string;
  description?: string;
  ariaLabel?: string;
  /**
   * Respect `prefers-reduced-motion`. When `'auto'`, playback will not start
   * automatically if the user has requested reduced motion. Defaults to `'auto'`.
   */
  reducedMotion?: 'auto' | 'play' | 'pause';
  /**
   * Pause playback while the target canvas is outside the viewport and resume
   * only if playback was requested before it left view. This uses
   * IntersectionObserver when the player owns an HTML canvas; OffscreenCanvas
   * worker proxies must handle observation on the main thread.
   */
  autoPauseWhenOffscreen?:
    | boolean
    | {
        rootMargin?: string;
        threshold?: number;
      };
  /**
   * Pause playback while the owning page is hidden and resume only if playback
   * was requested before the tab was backgrounded. Applies to HTML canvas
   * players on the main thread; worker proxies mirror this on the main thread.
   */
  autoPauseWhenDocumentHidden?: boolean;
  /**
   * Canvas2D context attributes for browser-level rendering tradeoffs.
   * Keep `willReadFrequently` off for normal render canvases because it can
   * force a software path; use it only for diagnostic canvases that read pixels.
   */
  canvasContext?: {
    alpha?: boolean;
    desynchronized?: boolean;
    willReadFrequently?: boolean;
  };
  /**
   * Optional expression evaluator for Pro-tier expressions. When provided,
   * properties with an expression override are evaluated at runtime.
   */
  expressions?: ExpressionEvaluator;
  /**
   * Optional audio controller for Pro-tier audio playback. When provided,
   * the player will keep it synchronised with play/pause/seek/loop events.
   */
  audio?: AudioController;
}
export interface Renderer {
  /**
   * Optional one-time async setup. The player awaits this before the first
   * render. Should return true if the backend is ready, or false/throw to
   * indicate the backend cannot be used.
   */
  init?(canvas: HTMLCanvasElement | OffscreenCanvas): Promise<boolean>;

  /**
   * Optional pre-load step for animation-specific renderer resources (image
   * uploads, texture preparation, etc.).
   */
  preload?(animation: Animation): Promise<void>;

  render(animation: Animation, frame: number, canvas: HTMLCanvasElement | OffscreenCanvas): void | Promise<void>;
  resize?(width: number, height: number): void;
  dispose?(): void;
}
export type PlayerEvent =
  | {
      type: 'load';
    }
  | {
      type: 'play';
    }
  | {
      type: 'pause';
    }
  | {
      type: 'complete';
    }
  | {
      type: 'enterFrame';
      frame: number;
    }
  | {
      type: 'render';
      frame: number;
    }
  | {
      type: 'error';
      error: unknown;
    };
export type PlayerEventListener = (event: PlayerEvent) => void;
/**
 * Subset of the Player API exposed to audio controllers for synchronisation.
 */
export interface AudioPlayer {
  play(): void;
  pause(): void;
  stop(): void;
  seek(frame: number): void;
  addEventListener(listener: PlayerEventListener): void;
  removeEventListener(listener: PlayerEventListener): void;
}
/**
 * Pro-tier audio controller that the core player drives during playback.
 */
export interface AudioController {
  attach(player: AudioPlayer, animation: Animation): void;
  detach(): void;
  play(): void;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  setSpeed?(speed: number): void;
  destroy(): void;
}
