/* tslint:disable */
/* eslint-disable */
/**
 * Register a font globally (static, not tied to a player instance).
 */
export function register_font(name: string, data: Uint8Array): boolean;
/**
 * Playback direction / bounce mode.
 */
export enum Mode {
  Forward = 0,
  Reverse = 1,
  Bounce = 2,
  ReverseBounce = 3,
}
export class DotLottiePlayerWasm {
  free(): void;
  constructor();
  /**
   * Store the WebGL2 context.  Call before `load_animation`.
   * Each player instance owns its own context, enabling multiple
   * WebGL canvases simultaneously.
   */
  set_webgl_context(ctx: WebGL2RenderingContext): void;
  /**
   * Load a Lottie JSON animation.  Sets up the rendering target automatically.
   */
  load_animation(data: string, width: number, height: number): boolean;
  /**
   * Load a .lottie archive from raw bytes.
   */
  load_dotlottie_data(data: Uint8Array, width: number, height: number): boolean;
  /**
   * Load an animation from an already-loaded .lottie archive by its ID.
   */
  load_animation_from_id(id: string, width: number, height: number): boolean;
  /**
   * Advance time and render.  Call once per `requestAnimationFrame`.
   */
  tick(): boolean;
  /**
   * Render the current frame without advancing time.
   */
  render(): boolean;
  /**
   * Clear the canvas to the background colour.
   */
  clear(): void;
  /**
   * Resize the canvas.  For the SW renderer this also resizes the pixel buffer.
   */
  resize(width: number, height: number): boolean;
  play(): boolean;
  pause(): boolean;
  stop(): boolean;
  is_playing(): boolean;
  is_paused(): boolean;
  is_stopped(): boolean;
  is_loaded(): boolean;
  is_complete(): boolean;
  is_tweening(): boolean;
  current_frame(): number;
  total_frames(): number;
  request_frame(): number;
  set_frame(no: number): boolean;
  seek(no: number): boolean;
  duration(): number;
  segment_duration(): number;
  current_loop_count(): number;
  reset_current_loop_count(): void;
  width(): number;
  height(): number;
  /**
   * `[width, height]` of the animation in its native coordinate space.
   */
  animation_size(): Float32Array;
  mode(): Mode;
  set_mode(mode: Mode): void;
  speed(): number;
  set_speed(speed: number): void;
  loop_animation(): boolean;
  set_loop(v: boolean): void;
  loop_count(): number;
  set_loop_count(n: number): void;
  autoplay(): boolean;
  set_autoplay(v: boolean): void;
  use_frame_interpolation(): boolean;
  set_use_frame_interpolation(v: boolean): void;
  background_color(): number;
  /**
   * Set background colour (`0xAARRGGBB`).
   */
  set_background_color(color: number): boolean;
  /**
   * Clear the background colour (transparent).
   */
  clear_background_color(): boolean;
  set_quality(quality: number): boolean;
  has_segment(): boolean;
  segment_start(): number;
  segment_end(): number;
  set_segment(start: number, end: number): boolean;
  clear_segment(): boolean;
  /**
   * Set the layout.
   *
   * `fit` is one of `"contain"`, `"fill"`, `"cover"`, `"fit-width"`,
   * `"fit-height"`, `"none"`.  `align_x` / `align_y` are in [0, 1].
   */
  set_layout(fit: string, align_x: number, align_y: number): boolean;
  layout_fit(): string;
  layout_align_x(): number;
  layout_align_y(): number;
  set_viewport(x: number, y: number, w: number, h: number): boolean;
  /**
   * Set a color slot (`r`, `g`, `b` in [0, 1]).
   */
  set_color_slot(id: string, r: number, g: number, b: number): boolean;
  set_scalar_slot(id: string, value: number): boolean;
  set_text_slot(id: string, text: string): boolean;
  set_vector_slot(id: string, x: number, y: number): boolean;
  set_position_slot(id: string, x: number, y: number): boolean;
  clear_slots(): boolean;
  clear_slot(id: string): boolean;
  /**
   * Set multiple slots at once from a JSON string.
   */
  set_slots_str(json: string): boolean;
  /**
   * Set a single slot by ID from a JSON value string.
   */
  set_slot_str(id: string, json: string): boolean;
  /**
   * Get the JSON value of a single slot by ID, or `undefined` if not found.
   */
  get_slot_str(id: string): string | undefined;
  /**
   * Get all slots as a JSON object string.
   */
  get_slots_str(): string;
  /**
   * Get all slot IDs as a JS array.
   */
  get_slot_ids(): any;
  /**
   * Get the type string of a slot, or `undefined` if not found.
   */
  get_slot_type(id: string): string | undefined;
  /**
   * Reset a slot to its default value from the animation.
   */
  reset_slot(id: string): boolean;
  /**
   * Reset all slots to their default values from the animation.
   */
  reset_slots(): boolean;
  intersect(x: number, y: number, layer_name: string): boolean;
  /**
   * Returns `[x, y, width, height]` of the layer's bounding box.
   */
  get_layer_bounds(layer_name: string): Float32Array;
  /**
   * Returns the current affine transform as a flat `Float32Array`.
   */
  get_transform(): Float32Array;
  set_transform(data: Float32Array): boolean;
  /**
   * Tween to `to` frame.  `duration` in seconds; pass `undefined` for default.
   */
  tween(to: number, duration?: number | null): boolean;
  /**
   * Tween with a cubic-bezier easing (`e0..e3`).
   */
  tween_with_easing(
    to: number,
    duration: number | null | undefined,
    e0: number,
    e1: number,
    e2: number,
    e3: number,
  ): boolean;
  tween_stop(): boolean;
  tween_update(progress?: number | null): boolean;
  tween_to_marker(marker: string, duration?: number | null): boolean;
  /**
   * Returns an array of `{ name, time, duration }` objects.
   */
  markers(): any;
  /**
   * Returns an array of marker name strings.
   */
  marker_names(): any;
  /**
   * Name of the currently active marker, or `undefined` if none.
   */
  current_marker(): string | undefined;
  set_marker(name: string): void;
  clear_marker(): void;
  /**
   * Poll the next player event.  Returns `null` if the queue is empty,
   * otherwise a plain JS object with a `type` string field and optional
   * payload fields (`frameNo`, `loopCount`).
   */
  poll_event(): any;
  emit_on_loop(): void;
  load_font(name: string, data: Uint8Array): boolean;
  static unload_font(name: string): boolean;
  set_theme(id: string): boolean;
  reset_theme(): boolean;
  set_theme_data(data: string): boolean;
  theme_id(): string | undefined;
  animation_id(): string | undefined;
  /**
   * Returns the animation manifest as a JSON string, or empty string if unavailable.
   */
  manifest_string(): string;
  /**
   * Returns the raw JSON definition of a state machine by ID, or `undefined`.
   */
  get_state_machine(id: string): string | undefined;
  /**
   * Returns the ID of the currently active state machine, or `undefined`.
   */
  state_machine_id(): string | undefined;
  /**
   * Load a state machine from a JSON definition string.  Returns `true` on
   * success.  The engine is kept alive inside the player and interacted
   * with via the `sm_*` methods.
   */
  state_machine_load(definition: string): boolean;
  /**
   * Load a state machine from a .lottie archive by state-machine ID.
   */
  state_machine_load_from_id(id: string): boolean;
  /**
   * Unload the active state machine.
   */
  state_machine_unload(): void;
  /**
   * Fire a named event into the state machine.
   */
  sm_fire(event: string): boolean;
  sm_set_numeric_input(key: string, value: number): boolean;
  sm_get_numeric_input(key: string): number | undefined;
  sm_set_string_input(key: string, value: string): boolean;
  sm_get_string_input(key: string): string | undefined;
  sm_set_boolean_input(key: string, value: boolean): boolean;
  sm_get_boolean_input(key: string): boolean | undefined;
  sm_reset_input(key: string): void;
  /**
   * Poll the next state machine event.  Returns `null` if the queue is empty,
   * otherwise a JS object with a `type` field and optional payload.
   */
  sm_poll_event(): any;
  /**
   * Start the state machine with an open-URL policy.
   */
  sm_start(require_user_interaction: boolean, whitelist: any[]): boolean;
  /**
   * Stop the state machine.
   */
  sm_stop(): boolean;
  /**
   * Get the current status of the state machine as a string.
   */
  sm_status(): string;
  /**
   * Get the name of the current state.
   */
  sm_current_state(): string;
  /**
   * Override the current state.
   */
  sm_override_current_state(state: string, immediate: boolean): boolean;
  /**
   * Returns the framework setup listeners as a JS array of strings.
   */
  sm_framework_setup(): any;
  /**
   * Returns all state machine inputs as a JS array of strings.
   */
  sm_get_inputs(): any;
  sm_post_click(x: number, y: number): void;
  sm_post_pointer_down(x: number, y: number): void;
  sm_post_pointer_up(x: number, y: number): void;
  sm_post_pointer_move(x: number, y: number): void;
  sm_post_pointer_enter(x: number, y: number): void;
  sm_post_pointer_exit(x: number, y: number): void;
  /**
   * Poll the next state machine internal event.  Returns `null` if the
   * queue is empty, otherwise a JS object `{ type: "Message", message }`.
   */
  sm_poll_internal_event(): any;
  /**
   * Advance the state machine by one tick.  Returns `false` if no state machine
   * is loaded, otherwise `true` (even if the machine is stopped or errored).
   */
  sm_tick(): boolean;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly modff: (a: number, b: number) => number;
  readonly realloc: (a: number, b: number) => number;
  readonly calloc: (a: number, b: number) => number;
  readonly _Znam: (a: number) => number;
  readonly _ZdaPvm: (a: number, b: number) => void;
  readonly _ZdaPv: (a: number) => void;
  readonly atoi: (a: number) => number;
  readonly __cxa_pure_virtual: () => void;
  readonly __cxa_atexit: (a: number, b: number, c: number) => number;
  readonly abort: () => void;
  readonly __assert_fail: (a: number, b: number, c: number, d: number) => void;
  readonly strchr: (a: number, b: number) => number;
  readonly strdup: (a: number) => number;
  readonly strcmp: (a: number, b: number) => number;
  readonly strcpy: (a: number, b: number) => number;
  readonly strcat: (a: number, b: number) => number;
  readonly strstr: (a: number, b: number) => number;
  readonly bsearch: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly strncmp: (a: number, b: number, c: number) => number;
  readonly isspace: (a: number) => number;
  readonly rand: () => number;
  readonly strtol: (a: number, b: number, c: number) => number;
  readonly _ZNSt3__212__next_primeEm: (a: number) => number;
  readonly glDeleteTextures: (a: number, b: number) => void;
  readonly glBindFramebuffer: (a: number, b: number) => void;
  readonly glDeleteFramebuffers: (a: number, b: number) => void;
  readonly glDeleteRenderbuffers: (a: number, b: number) => void;
  readonly glGenFramebuffers: (a: number, b: number) => void;
  readonly glGenRenderbuffers: (a: number, b: number) => void;
  readonly glBindRenderbuffer: (a: number, b: number) => void;
  readonly glRenderbufferStorageMultisample: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly glFramebufferRenderbuffer: (a: number, b: number, c: number, d: number) => void;
  readonly glGenTextures: (a: number, b: number) => void;
  readonly glBindTexture: (a: number, b: number) => void;
  readonly glTexImage2D: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number,
  ) => void;
  readonly glTexParameteri: (a: number, b: number, c: number) => void;
  readonly glFramebufferTexture2D: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly glBufferData: (a: number, b: number, c: number, d: number) => void;
  readonly glGenBuffers: (a: number, b: number) => void;
  readonly glBindBuffer: (a: number, b: number) => void;
  readonly glDeleteBuffers: (a: number, b: number) => void;
  readonly glGenVertexArrays: (a: number, b: number) => void;
  readonly glBindVertexArray: (a: number) => void;
  readonly glDeleteVertexArrays: (a: number, b: number) => void;
  readonly glGetIntegerv: (a: number, b: number) => void;
  readonly glCreateShader: (a: number) => number;
  readonly glShaderSource: (a: number, b: number, c: number, d: number) => void;
  readonly glCompileShader: (a: number) => void;
  readonly glGetShaderiv: (a: number, b: number, c: number) => void;
  readonly glGetShaderInfoLog: (a: number, b: number, c: number, d: number) => void;
  readonly glDeleteShader: (a: number) => void;
  readonly glCreateProgram: () => number;
  readonly glAttachShader: (a: number, b: number) => void;
  readonly glLinkProgram: (a: number) => void;
  readonly glGetProgramiv: (a: number, b: number, c: number) => void;
  readonly glGetProgramInfoLog: (a: number, b: number, c: number, d: number) => void;
  readonly glDeleteProgram: (a: number) => void;
  readonly glUseProgram: (a: number) => void;
  readonly glGetUniformLocation: (a: number, b: number) => number;
  readonly glGetUniformBlockIndex: (a: number, b: number) => number;
  readonly glUniform1iv: (a: number, b: number, c: number) => void;
  readonly glEnableVertexAttribArray: (a: number) => void;
  readonly glDisableVertexAttribArray: (a: number) => void;
  readonly glVertexAttribPointer: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly glActiveTexture: (a: number) => void;
  readonly glUniformBlockBinding: (a: number, b: number, c: number) => void;
  readonly glBindBufferRange: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly glDrawElements: (a: number, b: number, c: number, d: number) => void;
  readonly glEnable: (a: number) => void;
  readonly glDisable: (a: number) => void;
  readonly glViewport: (a: number, b: number, c: number, d: number) => void;
  readonly glClearColor: (a: number, b: number, c: number, d: number) => void;
  readonly glClearStencil: (a: number) => void;
  readonly glClearDepthf: (a: number) => void;
  readonly glDepthMask: (a: number) => void;
  readonly glClear: (a: number) => void;
  readonly glBlitFramebuffer: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number,
    j: number,
  ) => void;
  readonly glBlendFunc: (a: number, b: number) => void;
  readonly glBlendEquation: (a: number) => void;
  readonly glCullFace: (a: number) => void;
  readonly glFrontFace: (a: number) => void;
  readonly glDepthFunc: (a: number) => void;
  readonly glInvalidateFramebuffer: (a: number, b: number, c: number) => void;
  readonly glUniform1f: (a: number, b: number) => void;
  readonly glUniformMatrix3fv: (a: number, b: number, c: number, d: number) => void;
  readonly glScissor: (a: number, b: number, c: number, d: number) => void;
  readonly glStencilFunc: (a: number, b: number, c: number) => void;
  readonly glStencilOp: (a: number, b: number, c: number) => void;
  readonly glStencilFuncSeparate: (a: number, b: number, c: number, d: number) => void;
  readonly glStencilOpSeparate: (a: number, b: number, c: number, d: number) => void;
  readonly glColorMask: (a: number, b: number, c: number, d: number) => void;
  readonly emscripten_webgl_get_current_context: () => number;
  readonly emscripten_webgl_make_context_current: (a: number) => number;
  readonly __wbg_dotlottieplayerwasm_free: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_new: () => number;
  readonly dotlottieplayerwasm_set_webgl_context: (a: number, b: any) => void;
  readonly dotlottieplayerwasm_load_animation: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_load_dotlottie_data: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_load_animation_from_id: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
  ) => number;
  readonly dotlottieplayerwasm_tick: (a: number) => number;
  readonly dotlottieplayerwasm_render: (a: number) => number;
  readonly dotlottieplayerwasm_clear: (a: number) => void;
  readonly dotlottieplayerwasm_resize: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_play: (a: number) => number;
  readonly dotlottieplayerwasm_pause: (a: number) => number;
  readonly dotlottieplayerwasm_stop: (a: number) => number;
  readonly dotlottieplayerwasm_is_playing: (a: number) => number;
  readonly dotlottieplayerwasm_is_paused: (a: number) => number;
  readonly dotlottieplayerwasm_is_stopped: (a: number) => number;
  readonly dotlottieplayerwasm_is_loaded: (a: number) => number;
  readonly dotlottieplayerwasm_is_complete: (a: number) => number;
  readonly dotlottieplayerwasm_is_tweening: (a: number) => number;
  readonly dotlottieplayerwasm_current_frame: (a: number) => number;
  readonly dotlottieplayerwasm_total_frames: (a: number) => number;
  readonly dotlottieplayerwasm_request_frame: (a: number) => number;
  readonly dotlottieplayerwasm_set_frame: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_seek: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_duration: (a: number) => number;
  readonly dotlottieplayerwasm_segment_duration: (a: number) => number;
  readonly dotlottieplayerwasm_current_loop_count: (a: number) => number;
  readonly dotlottieplayerwasm_reset_current_loop_count: (a: number) => void;
  readonly dotlottieplayerwasm_width: (a: number) => number;
  readonly dotlottieplayerwasm_height: (a: number) => number;
  readonly dotlottieplayerwasm_animation_size: (a: number) => any;
  readonly dotlottieplayerwasm_mode: (a: number) => number;
  readonly dotlottieplayerwasm_set_mode: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_speed: (a: number) => number;
  readonly dotlottieplayerwasm_set_speed: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_loop_animation: (a: number) => number;
  readonly dotlottieplayerwasm_set_loop: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_loop_count: (a: number) => number;
  readonly dotlottieplayerwasm_set_loop_count: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_autoplay: (a: number) => number;
  readonly dotlottieplayerwasm_set_autoplay: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_use_frame_interpolation: (a: number) => number;
  readonly dotlottieplayerwasm_set_use_frame_interpolation: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_background_color: (a: number) => number;
  readonly dotlottieplayerwasm_set_background_color: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_clear_background_color: (a: number) => number;
  readonly dotlottieplayerwasm_set_quality: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_has_segment: (a: number) => number;
  readonly dotlottieplayerwasm_segment_start: (a: number) => number;
  readonly dotlottieplayerwasm_segment_end: (a: number) => number;
  readonly dotlottieplayerwasm_set_segment: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_clear_segment: (a: number) => number;
  readonly dotlottieplayerwasm_set_layout: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_layout_fit: (a: number) => [number, number];
  readonly dotlottieplayerwasm_layout_align_x: (a: number) => number;
  readonly dotlottieplayerwasm_layout_align_y: (a: number) => number;
  readonly dotlottieplayerwasm_set_viewport: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_color_slot: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => number;
  readonly dotlottieplayerwasm_set_scalar_slot: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_set_text_slot: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_vector_slot: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_position_slot: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_clear_slots: (a: number) => number;
  readonly dotlottieplayerwasm_clear_slot: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_set_slots_str: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_set_slot_str: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_get_slot_str: (a: number, b: number, c: number) => [number, number];
  readonly dotlottieplayerwasm_get_slots_str: (a: number) => [number, number];
  readonly dotlottieplayerwasm_get_slot_ids: (a: number) => any;
  readonly dotlottieplayerwasm_get_slot_type: (a: number, b: number, c: number) => [number, number];
  readonly dotlottieplayerwasm_reset_slot: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_reset_slots: (a: number) => number;
  readonly dotlottieplayerwasm_intersect: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_get_layer_bounds: (a: number, b: number, c: number) => any;
  readonly dotlottieplayerwasm_get_transform: (a: number) => any;
  readonly dotlottieplayerwasm_set_transform: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_tween: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_tween_with_easing: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
  ) => number;
  readonly dotlottieplayerwasm_tween_stop: (a: number) => number;
  readonly dotlottieplayerwasm_tween_update: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_tween_to_marker: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_markers: (a: number) => any;
  readonly dotlottieplayerwasm_marker_names: (a: number) => any;
  readonly dotlottieplayerwasm_current_marker: (a: number) => [number, number];
  readonly dotlottieplayerwasm_set_marker: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_clear_marker: (a: number) => void;
  readonly dotlottieplayerwasm_poll_event: (a: number) => any;
  readonly dotlottieplayerwasm_emit_on_loop: (a: number) => void;
  readonly dotlottieplayerwasm_load_font: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_unload_font: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_set_theme: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_reset_theme: (a: number) => number;
  readonly dotlottieplayerwasm_set_theme_data: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_theme_id: (a: number) => [number, number];
  readonly dotlottieplayerwasm_animation_id: (a: number) => [number, number];
  readonly dotlottieplayerwasm_manifest_string: (a: number) => [number, number];
  readonly dotlottieplayerwasm_get_state_machine: (a: number, b: number, c: number) => [number, number];
  readonly dotlottieplayerwasm_state_machine_id: (a: number) => [number, number];
  readonly dotlottieplayerwasm_state_machine_load: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_state_machine_load_from_id: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_state_machine_unload: (a: number) => void;
  readonly dotlottieplayerwasm_sm_fire: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_sm_set_numeric_input: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_sm_get_numeric_input: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_sm_set_string_input: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_sm_get_string_input: (a: number, b: number, c: number) => [number, number];
  readonly dotlottieplayerwasm_sm_set_boolean_input: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_sm_get_boolean_input: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_sm_reset_input: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_poll_event: (a: number) => any;
  readonly dotlottieplayerwasm_sm_start: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_sm_stop: (a: number) => number;
  readonly dotlottieplayerwasm_sm_status: (a: number) => [number, number];
  readonly dotlottieplayerwasm_sm_current_state: (a: number) => [number, number];
  readonly dotlottieplayerwasm_sm_override_current_state: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_sm_framework_setup: (a: number) => any;
  readonly dotlottieplayerwasm_sm_get_inputs: (a: number) => any;
  readonly dotlottieplayerwasm_sm_post_click: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_down: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_up: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_move: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_enter: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_exit: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_poll_internal_event: (a: number) => any;
  readonly dotlottieplayerwasm_sm_tick: (a: number) => number;
  readonly register_font: (a: number, b: number, c: number, d: number) => number;
  readonly free: (a: number) => void;
  readonly malloc: (a: number) => number;
  readonly _ZdlPvm: (a: number, b: number) => void;
  readonly __externref_table_alloc_command_export: () => number;
  readonly __wbindgen_export_1: WebAssembly.Table;
  readonly __wbindgen_exn_store_command_export: (a: number) => void;
  readonly __wbindgen_malloc_command_export: (a: number, b: number) => number;
  readonly __wbindgen_realloc_command_export: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free_command_export: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>,
): Promise<InitOutput>;
