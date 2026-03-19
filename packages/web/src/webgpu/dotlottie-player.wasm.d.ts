/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const modff: (a: number, b: number) => number;
export const malloc: (a: number) => number;
export const free: (a: number) => void;
export const realloc: (a: number, b: number) => number;
export const calloc: (a: number, b: number) => number;
export const _ZdaPvm: (a: number, b: number) => void;
export const atoi: (a: number) => number;
export const __cxa_pure_virtual: () => void;
export const __cxa_atexit: (a: number, b: number, c: number) => number;
export const abort: () => void;
export const __assert_fail: (a: number, b: number, c: number, d: number) => void;
export const strchr: (a: number, b: number) => number;
export const strdup: (a: number) => number;
export const strcmp: (a: number, b: number) => number;
export const strcpy: (a: number, b: number) => number;
export const strcat: (a: number, b: number) => number;
export const strstr: (a: number, b: number) => number;
export const bsearch: (a: number, b: number, c: number, d: number, e: number) => number;
export const strncmp: (a: number, b: number, c: number) => number;
export const isspace: (a: number) => number;
export const rand: () => number;
export const strtol: (a: number, b: number, c: number) => number;
export const _ZNSt3__212__next_primeEm: (a: number) => number;
export const wgpuCreateInstance: (a: number) => number;
export const wgpuAdapterRequestDevice: (a: number, b: number) => number;
export const wgpuAdapterRelease: (a: number) => void;
export const wgpuBufferDestroy: (a: number) => void;
export const wgpuBufferGetSize: (a: number) => bigint;
export const wgpuCommandEncoderBeginComputePass: (a: number, b: number) => number;
export const wgpuCommandEncoderBeginRenderPass: (a: number, b: number) => number;
export const wgpuCommandEncoderCopyTextureToTexture: (a: number, b: number, c: number, d: number) => void;
export const wgpuCommandEncoderFinish: (a: number, b: number) => number;
export const wgpuComputePassEncoderDispatchWorkgroups: (a: number, b: number, c: number, d: number) => void;
export const wgpuComputePassEncoderEnd: (a: number) => void;
export const wgpuComputePassEncoderSetBindGroup: (a: number, b: number, c: number, d: number, e: number) => void;
export const wgpuComputePassEncoderSetPipeline: (a: number, b: number) => void;
export const wgpuDeviceCreateBindGroup: (a: number, b: number) => number;
export const wgpuDeviceCreateBindGroupLayout: (a: number, b: number) => number;
export const wgpuDeviceCreateBuffer: (a: number, b: number) => number;
export const wgpuDeviceCreateCommandEncoder: (a: number, b: number) => number;
export const wgpuDeviceCreateComputePipeline: (a: number, b: number) => number;
export const wgpuDeviceCreatePipelineLayout: (a: number, b: number) => number;
export const wgpuDeviceCreateRenderPipeline: (a: number, b: number) => number;
export const wgpuDeviceCreateSampler: (a: number, b: number) => number;
export const wgpuDeviceCreateShaderModule: (a: number, b: number) => number;
export const wgpuDeviceCreateTexture: (a: number, b: number) => number;
export const wgpuDeviceGetQueue: (a: number) => number;
export const wgpuQueueSubmit: (a: number, b: number, c: number) => void;
export const wgpuQueueWriteBuffer: (a: number, b: number, c: bigint, d: number, e: number) => void;
export const wgpuQueueWriteTexture: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
export const wgpuRenderPassEncoderDraw: (a: number, b: number, c: number, d: number, e: number) => void;
export const wgpuRenderPassEncoderDrawIndexed: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => void;
export const wgpuRenderPassEncoderEnd: (a: number) => void;
export const wgpuRenderPassEncoderSetBindGroup: (a: number, b: number, c: number, d: number, e: number) => void;
export const wgpuRenderPassEncoderSetIndexBuffer: (a: number, b: number, c: number, d: bigint, e: bigint) => void;
export const wgpuRenderPassEncoderSetPipeline: (a: number, b: number) => void;
export const wgpuRenderPassEncoderSetScissorRect: (a: number, b: number, c: number, d: number, e: number) => void;
export const wgpuRenderPassEncoderSetStencilReference: (a: number, b: number) => void;
export const wgpuRenderPassEncoderSetVertexBuffer: (a: number, b: number, c: number, d: bigint, e: bigint) => void;
export const wgpuSurfaceConfigure: (a: number, b: number) => void;
export const wgpuSurfaceGetCurrentTexture: (a: number, b: number) => void;
export const wgpuSurfaceUnconfigure: (a: number) => void;
export const wgpuTextureCreateView: (a: number, b: number) => number;
export const wgpuTextureDestroy: (a: number) => void;
export const wgpuTextureGetFormat: (a: number) => number;
export const wgpuTextureGetHeight: (a: number) => number;
export const wgpuTextureGetWidth: (a: number) => number;
export const __wbg_dotlottieplayerwasm_free: (a: number, b: number) => void;
export const dotlottieplayerwasm_new: () => number;
export const dotlottieplayerwasm_set_webgpu_device: (a: number, b: any) => void;
export const dotlottieplayerwasm_set_webgpu_surface: (a: number, b: any) => void;
export const dotlottieplayerwasm_load_animation: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_load_dotlottie_data: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_load_animation_from_id: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
) => number;
export const dotlottieplayerwasm_tick: (a: number) => number;
export const dotlottieplayerwasm_render: (a: number) => number;
export const dotlottieplayerwasm_clear: (a: number) => void;
export const dotlottieplayerwasm_resize: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_play: (a: number) => number;
export const dotlottieplayerwasm_pause: (a: number) => number;
export const dotlottieplayerwasm_stop: (a: number) => number;
export const dotlottieplayerwasm_is_playing: (a: number) => number;
export const dotlottieplayerwasm_is_paused: (a: number) => number;
export const dotlottieplayerwasm_is_stopped: (a: number) => number;
export const dotlottieplayerwasm_is_loaded: (a: number) => number;
export const dotlottieplayerwasm_is_complete: (a: number) => number;
export const dotlottieplayerwasm_is_tweening: (a: number) => number;
export const dotlottieplayerwasm_current_frame: (a: number) => number;
export const dotlottieplayerwasm_total_frames: (a: number) => number;
export const dotlottieplayerwasm_request_frame: (a: number) => number;
export const dotlottieplayerwasm_set_frame: (a: number, b: number) => number;
export const dotlottieplayerwasm_seek: (a: number, b: number) => number;
export const dotlottieplayerwasm_duration: (a: number) => number;
export const dotlottieplayerwasm_segment_duration: (a: number) => number;
export const dotlottieplayerwasm_current_loop_count: (a: number) => number;
export const dotlottieplayerwasm_reset_current_loop_count: (a: number) => void;
export const dotlottieplayerwasm_width: (a: number) => number;
export const dotlottieplayerwasm_height: (a: number) => number;
export const dotlottieplayerwasm_animation_size: (a: number) => any;
export const dotlottieplayerwasm_mode: (a: number) => number;
export const dotlottieplayerwasm_set_mode: (a: number, b: number) => void;
export const dotlottieplayerwasm_speed: (a: number) => number;
export const dotlottieplayerwasm_set_speed: (a: number, b: number) => void;
export const dotlottieplayerwasm_loop_animation: (a: number) => number;
export const dotlottieplayerwasm_set_loop: (a: number, b: number) => void;
export const dotlottieplayerwasm_loop_count: (a: number) => number;
export const dotlottieplayerwasm_set_loop_count: (a: number, b: number) => void;
export const dotlottieplayerwasm_autoplay: (a: number) => number;
export const dotlottieplayerwasm_set_autoplay: (a: number, b: number) => void;
export const dotlottieplayerwasm_use_frame_interpolation: (a: number) => number;
export const dotlottieplayerwasm_set_use_frame_interpolation: (a: number, b: number) => void;
export const dotlottieplayerwasm_background_color: (a: number) => number;
export const dotlottieplayerwasm_set_background_color: (a: number, b: number) => number;
export const dotlottieplayerwasm_clear_background_color: (a: number) => number;
export const dotlottieplayerwasm_set_quality: (a: number, b: number) => number;
export const dotlottieplayerwasm_has_segment: (a: number) => number;
export const dotlottieplayerwasm_segment_start: (a: number) => number;
export const dotlottieplayerwasm_segment_end: (a: number) => number;
export const dotlottieplayerwasm_set_segment: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_clear_segment: (a: number) => number;
export const dotlottieplayerwasm_set_layout: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_layout_fit: (a: number) => [number, number];
export const dotlottieplayerwasm_layout_align_x: (a: number) => number;
export const dotlottieplayerwasm_layout_align_y: (a: number) => number;
export const dotlottieplayerwasm_set_viewport: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_set_color_slot: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => number;
export const dotlottieplayerwasm_set_scalar_slot: (a: number, b: number, c: number, d: number) => number;
export const dotlottieplayerwasm_set_text_slot: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_set_vector_slot: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_set_position_slot: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_clear_slots: (a: number) => number;
export const dotlottieplayerwasm_clear_slot: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_set_slots_str: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_set_slot_str: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_get_slot_str: (a: number, b: number, c: number) => [number, number];
export const dotlottieplayerwasm_get_slots_str: (a: number) => [number, number];
export const dotlottieplayerwasm_get_slot_ids: (a: number) => any;
export const dotlottieplayerwasm_get_slot_type: (a: number, b: number, c: number) => [number, number];
export const dotlottieplayerwasm_reset_slot: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_reset_slots: (a: number) => number;
export const dotlottieplayerwasm_intersect: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_get_layer_bounds: (a: number, b: number, c: number) => any;
export const dotlottieplayerwasm_get_transform: (a: number) => any;
export const dotlottieplayerwasm_set_transform: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_tween: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_tween_with_easing: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  g: number,
) => number;
export const dotlottieplayerwasm_tween_stop: (a: number) => number;
export const dotlottieplayerwasm_tween_update: (a: number, b: number) => number;
export const dotlottieplayerwasm_tween_to_marker: (a: number, b: number, c: number, d: number) => number;
export const dotlottieplayerwasm_markers: (a: number) => any;
export const dotlottieplayerwasm_marker_names: (a: number) => any;
export const dotlottieplayerwasm_current_marker: (a: number) => [number, number];
export const dotlottieplayerwasm_set_marker: (a: number, b: number, c: number) => void;
export const dotlottieplayerwasm_clear_marker: (a: number) => void;
export const dotlottieplayerwasm_poll_event: (a: number) => any;
export const dotlottieplayerwasm_emit_on_loop: (a: number) => void;
export const dotlottieplayerwasm_load_font: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_unload_font: (a: number, b: number) => number;
export const dotlottieplayerwasm_set_theme: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_reset_theme: (a: number) => number;
export const dotlottieplayerwasm_set_theme_data: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_theme_id: (a: number) => [number, number];
export const dotlottieplayerwasm_animation_id: (a: number) => [number, number];
export const dotlottieplayerwasm_manifest_string: (a: number) => [number, number];
export const dotlottieplayerwasm_get_state_machine: (a: number, b: number, c: number) => [number, number];
export const dotlottieplayerwasm_state_machine_id: (a: number) => [number, number];
export const dotlottieplayerwasm_state_machine_load: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_state_machine_load_from_id: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_state_machine_unload: (a: number) => void;
export const dotlottieplayerwasm_sm_fire: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_sm_set_numeric_input: (a: number, b: number, c: number, d: number) => number;
export const dotlottieplayerwasm_sm_get_numeric_input: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_sm_set_string_input: (a: number, b: number, c: number, d: number, e: number) => number;
export const dotlottieplayerwasm_sm_get_string_input: (a: number, b: number, c: number) => [number, number];
export const dotlottieplayerwasm_sm_set_boolean_input: (a: number, b: number, c: number, d: number) => number;
export const dotlottieplayerwasm_sm_get_boolean_input: (a: number, b: number, c: number) => number;
export const dotlottieplayerwasm_sm_reset_input: (a: number, b: number, c: number) => void;
export const dotlottieplayerwasm_sm_poll_event: (a: number) => any;
export const dotlottieplayerwasm_sm_start: (a: number, b: number, c: number, d: number) => number;
export const dotlottieplayerwasm_sm_stop: (a: number) => number;
export const dotlottieplayerwasm_sm_status: (a: number) => [number, number];
export const dotlottieplayerwasm_sm_current_state: (a: number) => [number, number];
export const dotlottieplayerwasm_sm_override_current_state: (a: number, b: number, c: number, d: number) => number;
export const dotlottieplayerwasm_sm_framework_setup: (a: number) => any;
export const dotlottieplayerwasm_sm_get_inputs: (a: number) => any;
export const dotlottieplayerwasm_sm_post_click: (a: number, b: number, c: number) => void;
export const dotlottieplayerwasm_sm_post_pointer_down: (a: number, b: number, c: number) => void;
export const dotlottieplayerwasm_sm_post_pointer_up: (a: number, b: number, c: number) => void;
export const dotlottieplayerwasm_sm_post_pointer_move: (a: number, b: number, c: number) => void;
export const dotlottieplayerwasm_sm_post_pointer_enter: (a: number, b: number, c: number) => void;
export const dotlottieplayerwasm_sm_post_pointer_exit: (a: number, b: number, c: number) => void;
export const dotlottieplayerwasm_sm_poll_internal_event: (a: number) => any;
export const dotlottieplayerwasm_sm_tick: (a: number) => number;
export const register_font: (a: number, b: number, c: number, d: number) => number;
export const wgpuBindGroupRelease: (a: number) => void;
export const wgpuBindGroupLayoutRelease: (a: number) => void;
export const wgpuBufferRelease: (a: number) => void;
export const wgpuCommandBufferRelease: (a: number) => void;
export const wgpuCommandEncoderRelease: (a: number) => void;
export const wgpuComputePassEncoderRelease: (a: number) => void;
export const wgpuComputePipelineRelease: (a: number) => void;
export const wgpuPipelineLayoutRelease: (a: number) => void;
export const wgpuQueueRelease: (a: number) => void;
export const wgpuRenderPassEncoderRelease: (a: number) => void;
export const wgpuRenderPipelineRelease: (a: number) => void;
export const wgpuSamplerRelease: (a: number) => void;
export const wgpuShaderModuleRelease: (a: number) => void;
export const wgpuTextureRelease: (a: number) => void;
export const wgpuTextureViewRelease: (a: number) => void;
export const _ZdlPvm: (a: number, b: number) => void;
export const __wbindgen_exn_store_command_export: (a: number) => void;
export const __externref_table_alloc_command_export: () => number;
export const __wbindgen_export_2: WebAssembly.Table;
export const __wbindgen_malloc_command_export: (a: number, b: number) => number;
export const __wbindgen_realloc_command_export: (a: number, b: number, c: number, d: number) => number;
export const __wbindgen_free_command_export: (a: number, b: number, c: number) => void;
export const __wbindgen_start: () => void;
