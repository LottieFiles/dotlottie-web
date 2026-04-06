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
  clear_slot(id: string): boolean;
  is_playing(): boolean;
  is_stopped(): boolean;
  layout_fit(): string;
  loop_count(): number;
  /**
   * Poll the next player event.  Returns `null` if the queue is empty,
   * otherwise a plain JS object with a `type` string field and optional
   * payload fields (`frameNo`, `loopCount`).
   */
  poll_event(): any;
  /**
   * Reset a slot to its default value from the animation.
   */
  reset_slot(id: string): boolean;
  /**
   * Set the layout.
   *
   * `fit` is one of `"contain"`, `"fill"`, `"cover"`, `"fit-width"`,
   * `"fit-height"`, `"none"`.  `align_x` / `align_y` are in [0, 1].
   */
  set_layout(fit: string, align_x: number, align_y: number): boolean;
  set_marker(name: string): void;
  clear_slots(): boolean;
  has_segment(): boolean;
  is_complete(): boolean;
  is_tweening(): boolean;
  /**
   * Reset all slots to their default values from the animation.
   */
  reset_slots(): boolean;
  reset_theme(): boolean;
  segment_end(): number;
  set_quality(quality: number): boolean;
  set_segment(start: number, end: number): boolean;
  static unload_font(name: string): boolean;
  animation_id(): string | undefined;
  clear_marker(): void;
  emit_on_loop(): void;
  /**
   * Get all slot IDs as a JS array.
   */
  get_slot_ids(): any;
  /**
   * Get the JSON value of a single slot by ID, or `undefined` if not found.
   */
  get_slot_str(id: string): string | undefined;
  /**
   * Returns an array of marker name strings.
   */
  marker_names(): any;
  set_autoplay(v: boolean): void;
  /**
   * Set a single slot by ID from a JSON value string.
   */
  set_slot_str(id: string, json: string): boolean;
  set_viewport(x: number, y: number, w: number, h: number): boolean;
  total_frames(): number;
  clear_segment(): boolean;
  current_frame(): number;
  /**
   * Get the type string of a slot, or `undefined` if not found.
   */
  get_slot_type(id: string): string | undefined;
  /**
   * Get all slots as a JSON object string.
   */
  get_slots_str(): string;
  /**
   * Returns the current affine transform as a flat `Float32Array`.
   */
  get_transform(): Float32Array;
  request_frame(): number;
  segment_start(): number;
  /**
   * Set multiple slots at once from a JSON string.
   */
  set_slots_str(json: string): boolean;
  set_text_slot(id: string, text: string): boolean;
  set_transform(data: Float32Array): boolean;
  /**
   * Returns all state machine inputs as a JS array of strings.
   */
  sm_get_inputs(): any;
  /**
   * Poll the next state machine event.  Returns `null` if the queue is empty,
   * otherwise a JS object with a `type` field and optional payload.
   */
  sm_poll_event(): any;
  sm_post_click(x: number, y: number): void;
  /**
   * `[width, height]` of the animation in its native coordinate space.
   */
  animation_size(): Float32Array;
  /**
   * Name of the currently active marker, or `undefined` if none.
   */
  current_marker(): string | undefined;
  layout_align_x(): number;
  layout_align_y(): number;
  /**
   * Load a Lottie JSON animation.  Sets up the rendering target automatically.
   */
  load_animation(data: string, width: number, height: number): boolean;
  loop_animation(): boolean;
  /**
   * Set a color slot (`r`, `g`, `b` in [0, 1]).
   */
  set_color_slot(id: string, r: number, g: number, b: number): boolean;
  set_loop_count(n: number): void;
  set_theme_data(data: string): boolean;
  sm_reset_input(key: string): void;
  /**
   * Returns the animation manifest as a JSON string, or empty string if unavailable.
   */
  manifest_string(): string;
  set_scalar_slot(id: string, value: number): boolean;
  set_vector_slot(id: string, x: number, y: number): boolean;
  background_color(): number;
  /**
   * Returns `[x, y, width, height]` of the layer's bounding box.
   */
  get_layer_bounds(layer_name: string): Float32Array;
  segment_duration(): number;
  /**
   * Get the name of the current state.
   */
  sm_current_state(): string;
  /**
   * Returns the ID of the currently active state machine, or `undefined`.
   */
  state_machine_id(): string | undefined;
  /**
   * Returns the raw JSON definition of a state machine by ID, or `undefined`.
   */
  get_state_machine(id: string): string | undefined;
  set_position_slot(id: string, x: number, y: number): boolean;
  /**
   * Store the WebGPU device.  Call before `set_webgpu_surface` and `load_animation`.
   */
  set_webgpu_device(device: GPUDevice): void;
  current_loop_count(): number;
  /**
   * Store the WebGPU canvas context (surface).  Call before `load_animation`.
   */
  set_webgpu_surface(surface: GPUCanvasContext): void;
  /**
   * Returns the framework setup listeners as a JS array of strings.
   */
  sm_framework_setup(): any;
  sm_post_pointer_up(x: number, y: number): void;
  /**
   * Load a state machine from a JSON definition string.  Returns `true` on
   * success.  The engine is kept alive inside the player and interacted
   * with via the `sm_*` methods.
   */
  state_machine_load(definition: string): boolean;
  /**
   * Load a .lottie archive from raw bytes.
   */
  load_dotlottie_data(data: Uint8Array, width: number, height: number): boolean;
  sm_get_string_input(key: string): string | undefined;
  sm_set_string_input(key: string, value: string): boolean;
  /**
   * Set background colour (`0xAARRGGBB`).
   */
  set_background_color(color: number): boolean;
  sm_get_boolean_input(key: string): boolean | undefined;
  sm_get_numeric_input(key: string): number | undefined;
  sm_post_pointer_down(x: number, y: number): void;
  sm_post_pointer_exit(x: number, y: number): void;
  sm_post_pointer_move(x: number, y: number): void;
  sm_set_boolean_input(key: string, value: boolean): boolean;
  sm_set_numeric_input(key: string, value: number): boolean;
  /**
   * Unload the active state machine.
   */
  state_machine_unload(): void;
  sm_post_pointer_enter(x: number, y: number): void;
  /**
   * Clear the background colour (transparent).
   */
  clear_background_color(): boolean;
  /**
   * Load an animation from an already-loaded .lottie archive by its ID.
   */
  load_animation_from_id(id: string, width: number, height: number): boolean;
  /**
   * Poll the next state machine internal event.  Returns `null` if the
   * queue is empty, otherwise a JS object `{ type: "Message", message }`.
   */
  sm_poll_internal_event(): any;
  use_frame_interpolation(): boolean;
  reset_current_loop_count(): void;
  /**
   * Override the current state.
   */
  sm_override_current_state(state: string, immediate: boolean): boolean;
  /**
   * Load a state machine from a .lottie archive by state-machine ID.
   */
  state_machine_load_from_id(id: string): boolean;
  set_use_frame_interpolation(v: boolean): void;
  constructor();
  mode(): Mode;
  play(): boolean;
  seek(no: number): boolean;
  stop(): boolean;
  /**
   * Advance time and render.  Call once per `requestAnimationFrame`.
   */
  tick(): boolean;
  /**
   * Clear the canvas to the background colour.
   */
  clear(): void;
  pause(): boolean;
  speed(): number;
  width(): number;
  height(): number;
  /**
   * Render the current frame without advancing time.
   */
  render(): boolean;
  /**
   * Resize the canvas.  For the SW renderer this also resizes the pixel buffer.
   */
  resize(width: number, height: number): boolean;
  /**
   * Returns an array of `{ name, time, duration }` objects.
   */
  markers(): any;
  /**
   * Fire a named event into the state machine.
   */
  sm_fire(event: string): boolean;
  /**
   * Stop the state machine.
   */
  sm_stop(): boolean;
  /**
   * Advance the state machine by one tick.  Returns `false` if no state machine
   * is loaded, otherwise `true` (even if the machine is stopped or errored).
   */
  sm_tick(): boolean;
  autoplay(): boolean;
  duration(): number;
  set_loop(v: boolean): void;
  set_mode(mode: Mode): void;
  /**
   * Start the state machine with an open-URL policy.
   */
  sm_start(require_user_interaction: boolean, whitelist: any[]): boolean;
  theme_id(): string | undefined;
  intersect(x: number, y: number, layer_name: string): boolean;
  is_loaded(): boolean;
  is_paused(): boolean;
  load_font(name: string, data: Uint8Array): boolean;
  set_frame(no: number): boolean;
  set_speed(speed: number): void;
  set_theme(id: string): boolean;
  /**
   * Get the current status of the state machine as a string.
   */
  sm_status(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly _ZNSt3__212__next_primeEm: (a: number) => number;
  readonly _ZNSt3__25mutex4lockEv: (a: number) => void;
  readonly _ZNSt3__25mutexD1Ev: (a: number) => number;
  readonly _ZdaPvm: (a: number, b: number) => void;
  readonly __assert_fail: (a: number, b: number, c: number, d: number) => void;
  readonly __cxa_atexit: (a: number, b: number, c: number) => number;
  readonly __cxa_pure_virtual: () => void;
  readonly __wbg_dotlottieplayerwasm_free: (a: number, b: number) => void;
  readonly abort: () => void;
  readonly acosh: (a: number) => number;
  readonly asinh: (a: number) => number;
  readonly atanh: (a: number) => number;
  readonly atoi: (a: number) => number;
  readonly bsearch: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly calloc: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_animation_id: (a: number) => [number, number];
  readonly dotlottieplayerwasm_animation_size: (a: number) => any;
  readonly dotlottieplayerwasm_autoplay: (a: number) => number;
  readonly dotlottieplayerwasm_background_color: (a: number) => number;
  readonly dotlottieplayerwasm_clear: (a: number) => void;
  readonly dotlottieplayerwasm_clear_background_color: (a: number) => number;
  readonly dotlottieplayerwasm_clear_marker: (a: number) => void;
  readonly dotlottieplayerwasm_clear_segment: (a: number) => number;
  readonly dotlottieplayerwasm_clear_slot: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_clear_slots: (a: number) => number;
  readonly dotlottieplayerwasm_current_frame: (a: number) => number;
  readonly dotlottieplayerwasm_current_loop_count: (a: number) => number;
  readonly dotlottieplayerwasm_current_marker: (a: number) => [number, number];
  readonly dotlottieplayerwasm_duration: (a: number) => number;
  readonly dotlottieplayerwasm_emit_on_loop: (a: number) => void;
  readonly dotlottieplayerwasm_get_layer_bounds: (a: number, b: number, c: number) => any;
  readonly dotlottieplayerwasm_get_slot_ids: (a: number) => any;
  readonly dotlottieplayerwasm_get_slot_str: (a: number, b: number, c: number) => [number, number];
  readonly dotlottieplayerwasm_get_slot_type: (a: number, b: number, c: number) => [number, number];
  readonly dotlottieplayerwasm_get_slots_str: (a: number) => [number, number];
  readonly dotlottieplayerwasm_get_state_machine: (a: number, b: number, c: number) => [number, number];
  readonly dotlottieplayerwasm_get_transform: (a: number) => any;
  readonly dotlottieplayerwasm_has_segment: (a: number) => number;
  readonly dotlottieplayerwasm_height: (a: number) => number;
  readonly dotlottieplayerwasm_intersect: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_is_complete: (a: number) => number;
  readonly dotlottieplayerwasm_is_loaded: (a: number) => number;
  readonly dotlottieplayerwasm_is_paused: (a: number) => number;
  readonly dotlottieplayerwasm_is_playing: (a: number) => number;
  readonly dotlottieplayerwasm_is_stopped: (a: number) => number;
  readonly dotlottieplayerwasm_is_tweening: (a: number) => number;
  readonly dotlottieplayerwasm_layout_align_x: (a: number) => number;
  readonly dotlottieplayerwasm_layout_align_y: (a: number) => number;
  readonly dotlottieplayerwasm_layout_fit: (a: number) => [number, number];
  readonly dotlottieplayerwasm_load_animation: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_load_animation_from_id: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
  ) => number;
  readonly dotlottieplayerwasm_load_dotlottie_data: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_load_font: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_loop_animation: (a: number) => number;
  readonly dotlottieplayerwasm_loop_count: (a: number) => number;
  readonly dotlottieplayerwasm_manifest_string: (a: number) => [number, number];
  readonly dotlottieplayerwasm_marker_names: (a: number) => any;
  readonly dotlottieplayerwasm_markers: (a: number) => any;
  readonly dotlottieplayerwasm_mode: (a: number) => number;
  readonly dotlottieplayerwasm_new: () => number;
  readonly dotlottieplayerwasm_pause: (a: number) => number;
  readonly dotlottieplayerwasm_play: (a: number) => number;
  readonly dotlottieplayerwasm_poll_event: (a: number) => any;
  readonly dotlottieplayerwasm_render: (a: number) => number;
  readonly dotlottieplayerwasm_request_frame: (a: number) => number;
  readonly dotlottieplayerwasm_reset_current_loop_count: (a: number) => void;
  readonly dotlottieplayerwasm_reset_slot: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_reset_slots: (a: number) => number;
  readonly dotlottieplayerwasm_reset_theme: (a: number) => number;
  readonly dotlottieplayerwasm_resize: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_seek: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_segment_duration: (a: number) => number;
  readonly dotlottieplayerwasm_segment_end: (a: number) => number;
  readonly dotlottieplayerwasm_segment_start: (a: number) => number;
  readonly dotlottieplayerwasm_set_autoplay: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_set_background_color: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_set_color_slot: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => number;
  readonly dotlottieplayerwasm_set_frame: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_set_layout: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_loop: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_set_loop_count: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_set_marker: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_set_mode: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_set_position_slot: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_quality: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_set_scalar_slot: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_set_segment: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_set_slot_str: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_slots_str: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_set_speed: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_set_text_slot: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_theme: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_set_theme_data: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_set_transform: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_set_use_frame_interpolation: (a: number, b: number) => void;
  readonly dotlottieplayerwasm_set_vector_slot: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_viewport: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_set_webgpu_device: (a: number, b: any) => void;
  readonly dotlottieplayerwasm_set_webgpu_surface: (a: number, b: any) => void;
  readonly dotlottieplayerwasm_sm_current_state: (a: number) => [number, number];
  readonly dotlottieplayerwasm_sm_fire: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_sm_framework_setup: (a: number) => any;
  readonly dotlottieplayerwasm_sm_get_boolean_input: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_sm_get_inputs: (a: number) => any;
  readonly dotlottieplayerwasm_sm_get_numeric_input: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_sm_get_string_input: (a: number, b: number, c: number) => [number, number];
  readonly dotlottieplayerwasm_sm_override_current_state: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_sm_poll_event: (a: number) => any;
  readonly dotlottieplayerwasm_sm_poll_internal_event: (a: number) => any;
  readonly dotlottieplayerwasm_sm_post_click: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_down: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_enter: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_exit: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_move: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_post_pointer_up: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_reset_input: (a: number, b: number, c: number) => void;
  readonly dotlottieplayerwasm_sm_set_boolean_input: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_sm_set_numeric_input: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_sm_set_string_input: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly dotlottieplayerwasm_sm_start: (a: number, b: number, c: number, d: number) => number;
  readonly dotlottieplayerwasm_sm_status: (a: number) => [number, number];
  readonly dotlottieplayerwasm_sm_stop: (a: number) => number;
  readonly dotlottieplayerwasm_sm_tick: (a: number) => number;
  readonly dotlottieplayerwasm_speed: (a: number) => number;
  readonly dotlottieplayerwasm_state_machine_id: (a: number) => [number, number];
  readonly dotlottieplayerwasm_state_machine_load: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_state_machine_load_from_id: (a: number, b: number, c: number) => number;
  readonly dotlottieplayerwasm_state_machine_unload: (a: number) => void;
  readonly dotlottieplayerwasm_stop: (a: number) => number;
  readonly dotlottieplayerwasm_theme_id: (a: number) => [number, number];
  readonly dotlottieplayerwasm_tick: (a: number) => number;
  readonly dotlottieplayerwasm_total_frames: (a: number) => number;
  readonly dotlottieplayerwasm_unload_font: (a: number, b: number) => number;
  readonly dotlottieplayerwasm_use_frame_interpolation: (a: number) => number;
  readonly dotlottieplayerwasm_width: (a: number) => number;
  readonly free: (a: number) => void;
  readonly isdigit: (a: number) => number;
  readonly isspace: (a: number) => number;
  readonly longjmp: (a: number, b: number) => void;
  readonly malloc: (a: number) => number;
  readonly modff: (a: number, b: number) => number;
  readonly nextafter: (a: number, b: number) => number;
  readonly rand: () => number;
  readonly realloc: (a: number, b: number) => number;
  readonly register_font: (a: number, b: number, c: number, d: number) => number;
  readonly setjmp: (a: number) => number;
  readonly strcat: (a: number, b: number) => number;
  readonly strchr: (a: number, b: number) => number;
  readonly strcmp: (a: number, b: number) => number;
  readonly strcpy: (a: number, b: number) => number;
  readonly strdup: (a: number) => number;
  readonly strncmp: (a: number, b: number, c: number) => number;
  readonly strstr: (a: number, b: number) => number;
  readonly strtol: (a: number, b: number, c: number) => number;
  readonly tolower: (a: number) => number;
  readonly wgpuAdapterRelease: (a: number) => void;
  readonly wgpuAdapterRequestDevice: (a: number, b: number) => number;
  readonly wgpuBufferDestroy: (a: number) => void;
  readonly wgpuBufferGetSize: (a: number) => bigint;
  readonly wgpuCommandEncoderBeginComputePass: (a: number, b: number) => number;
  readonly wgpuCommandEncoderBeginRenderPass: (a: number, b: number) => number;
  readonly wgpuCommandEncoderCopyTextureToTexture: (a: number, b: number, c: number, d: number) => void;
  readonly wgpuCommandEncoderFinish: (a: number, b: number) => number;
  readonly wgpuComputePassEncoderDispatchWorkgroups: (a: number, b: number, c: number, d: number) => void;
  readonly wgpuComputePassEncoderEnd: (a: number) => void;
  readonly wgpuComputePassEncoderSetBindGroup: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpuComputePassEncoderSetPipeline: (a: number, b: number) => void;
  readonly wgpuCreateInstance: (a: number) => number;
  readonly wgpuDeviceCreateBindGroup: (a: number, b: number) => number;
  readonly wgpuDeviceCreateBindGroupLayout: (a: number, b: number) => number;
  readonly wgpuDeviceCreateBuffer: (a: number, b: number) => number;
  readonly wgpuDeviceCreateCommandEncoder: (a: number, b: number) => number;
  readonly wgpuDeviceCreateComputePipeline: (a: number, b: number) => number;
  readonly wgpuDeviceCreatePipelineLayout: (a: number, b: number) => number;
  readonly wgpuDeviceCreateRenderPipeline: (a: number, b: number) => number;
  readonly wgpuDeviceCreateSampler: (a: number, b: number) => number;
  readonly wgpuDeviceCreateShaderModule: (a: number, b: number) => number;
  readonly wgpuDeviceCreateTexture: (a: number, b: number) => number;
  readonly wgpuDeviceGetQueue: (a: number) => number;
  readonly wgpuQueueSubmit: (a: number, b: number, c: number) => void;
  readonly wgpuQueueWriteBuffer: (a: number, b: number, c: bigint, d: number, e: number) => void;
  readonly wgpuQueueWriteTexture: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly wgpuRenderPassEncoderDraw: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpuRenderPassEncoderDrawIndexed: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly wgpuRenderPassEncoderEnd: (a: number) => void;
  readonly wgpuRenderPassEncoderSetBindGroup: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpuRenderPassEncoderSetIndexBuffer: (a: number, b: number, c: number, d: bigint, e: bigint) => void;
  readonly wgpuRenderPassEncoderSetPipeline: (a: number, b: number) => void;
  readonly wgpuRenderPassEncoderSetScissorRect: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wgpuRenderPassEncoderSetStencilReference: (a: number, b: number) => void;
  readonly wgpuRenderPassEncoderSetVertexBuffer: (a: number, b: number, c: number, d: bigint, e: bigint) => void;
  readonly wgpuSurfaceConfigure: (a: number, b: number) => void;
  readonly wgpuSurfaceGetCurrentTexture: (a: number, b: number) => void;
  readonly wgpuSurfaceUnconfigure: (a: number) => void;
  readonly wgpuTextureCreateView: (a: number, b: number) => number;
  readonly wgpuTextureDestroy: (a: number) => void;
  readonly wgpuTextureGetFormat: (a: number) => number;
  readonly wgpuTextureGetHeight: (a: number) => number;
  readonly wgpuTextureGetWidth: (a: number) => number;
  readonly _ZdlPvm: (a: number, b: number) => void;
  readonly _ZNSt3__25mutex6unlockEv: (a: number) => void;
  readonly wgpuBindGroupLayoutRelease: (a: number) => void;
  readonly wgpuBindGroupRelease: (a: number) => void;
  readonly wgpuBufferRelease: (a: number) => void;
  readonly wgpuCommandBufferRelease: (a: number) => void;
  readonly wgpuCommandEncoderRelease: (a: number) => void;
  readonly wgpuComputePassEncoderRelease: (a: number) => void;
  readonly wgpuComputePipelineRelease: (a: number) => void;
  readonly wgpuPipelineLayoutRelease: (a: number) => void;
  readonly wgpuQueueRelease: (a: number) => void;
  readonly wgpuRenderPassEncoderRelease: (a: number) => void;
  readonly wgpuRenderPipelineRelease: (a: number) => void;
  readonly wgpuSamplerRelease: (a: number) => void;
  readonly wgpuShaderModuleRelease: (a: number) => void;
  readonly wgpuTextureRelease: (a: number) => void;
  readonly wgpuTextureViewRelease: (a: number) => void;
  readonly __wbindgen_exn_store_command_export: (a: number) => void;
  readonly __externref_table_alloc_command_export: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free_command_export: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc_command_export: (a: number, b: number) => number;
  readonly __wbindgen_realloc_command_export: (a: number, b: number, c: number, d: number) => number;
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
