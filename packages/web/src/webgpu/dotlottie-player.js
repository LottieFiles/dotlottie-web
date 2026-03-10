
let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc_command_export();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store_command_export(idx);
    }
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedFloat32ArrayMemory0 = null;

function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
 * Register a font globally (static, not tied to a player instance).
 * @param {string} name
 * @param {Uint8Array} data
 * @returns {boolean}
 */
export function register_font(name, data) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.register_font(ptr0, len0, ptr1, len1);
    return ret !== 0;
}

/**
 * Playback direction / bounce mode.
 * @enum {0 | 1 | 2 | 3}
 */
export const Mode = Object.freeze({
    Forward: 0, "0": "Forward",
    Reverse: 1, "1": "Reverse",
    Bounce: 2, "2": "Bounce",
    ReverseBounce: 3, "3": "ReverseBounce",
});

const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];

const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];

const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];

const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];

const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];

const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];

const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];

const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];

const __wbindgen_enum_GpuLoadOp = ["load", "clear"];

const __wbindgen_enum_GpuMipmapFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];

const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];

const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];

const __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];

const __wbindgen_enum_GpuStoreOp = ["store", "discard"];

const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];

const __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];

const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];

const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];

const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];

const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];

const DotLottiePlayerWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dotlottieplayerwasm_free(ptr >>> 0, 1));

export class DotLottiePlayerWasm {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DotLottiePlayerWasmFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dotlottieplayerwasm_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.dotlottieplayerwasm_new();
        this.__wbg_ptr = ret >>> 0;
        DotLottiePlayerWasmFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Store the WebGPU device.  Call before `set_webgpu_surface` and `load_animation`.
     * @param {GPUDevice} device
     */
    set_webgpu_device(device) {
        wasm.dotlottieplayerwasm_set_webgpu_device(this.__wbg_ptr, device);
    }
    /**
     * Store the WebGPU canvas context (surface).  Call before `load_animation`.
     * @param {GPUCanvasContext} surface
     */
    set_webgpu_surface(surface) {
        wasm.dotlottieplayerwasm_set_webgpu_surface(this.__wbg_ptr, surface);
    }
    /**
     * Load a Lottie JSON animation.  Sets up the rendering target automatically.
     * @param {string} data
     * @param {number} width
     * @param {number} height
     * @returns {boolean}
     */
    load_animation(data, width, height) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_load_animation(this.__wbg_ptr, ptr0, len0, width, height);
        return ret !== 0;
    }
    /**
     * Load a .lottie archive from raw bytes.
     * @param {Uint8Array} data
     * @param {number} width
     * @param {number} height
     * @returns {boolean}
     */
    load_dotlottie_data(data, width, height) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_load_dotlottie_data(this.__wbg_ptr, ptr0, len0, width, height);
        return ret !== 0;
    }
    /**
     * Load an animation from an already-loaded .lottie archive by its ID.
     * @param {string} id
     * @param {number} width
     * @param {number} height
     * @returns {boolean}
     */
    load_animation_from_id(id, width, height) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_load_animation_from_id(this.__wbg_ptr, ptr0, len0, width, height);
        return ret !== 0;
    }
    /**
     * Advance time and render.  Call once per `requestAnimationFrame`.
     * @returns {boolean}
     */
    tick() {
        const ret = wasm.dotlottieplayerwasm_tick(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Render the current frame without advancing time.
     * @returns {boolean}
     */
    render() {
        const ret = wasm.dotlottieplayerwasm_render(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Clear the canvas to the background colour.
     */
    clear() {
        wasm.dotlottieplayerwasm_clear(this.__wbg_ptr);
    }
    /**
     * Resize the canvas.  For the SW renderer this also resizes the pixel buffer.
     * @param {number} width
     * @param {number} height
     * @returns {boolean}
     */
    resize(width, height) {
        const ret = wasm.dotlottieplayerwasm_resize(this.__wbg_ptr, width, height);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    play() {
        const ret = wasm.dotlottieplayerwasm_play(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    pause() {
        const ret = wasm.dotlottieplayerwasm_pause(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    stop() {
        const ret = wasm.dotlottieplayerwasm_stop(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_playing() {
        const ret = wasm.dotlottieplayerwasm_is_playing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_paused() {
        const ret = wasm.dotlottieplayerwasm_is_paused(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_stopped() {
        const ret = wasm.dotlottieplayerwasm_is_stopped(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_loaded() {
        const ret = wasm.dotlottieplayerwasm_is_loaded(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_complete() {
        const ret = wasm.dotlottieplayerwasm_is_complete(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_tweening() {
        const ret = wasm.dotlottieplayerwasm_is_tweening(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    current_frame() {
        const ret = wasm.dotlottieplayerwasm_current_frame(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    total_frames() {
        const ret = wasm.dotlottieplayerwasm_total_frames(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    request_frame() {
        const ret = wasm.dotlottieplayerwasm_request_frame(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} no
     * @returns {boolean}
     */
    set_frame(no) {
        const ret = wasm.dotlottieplayerwasm_set_frame(this.__wbg_ptr, no);
        return ret !== 0;
    }
    /**
     * @param {number} no
     * @returns {boolean}
     */
    seek(no) {
        const ret = wasm.dotlottieplayerwasm_seek(this.__wbg_ptr, no);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    duration() {
        const ret = wasm.dotlottieplayerwasm_duration(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    segment_duration() {
        const ret = wasm.dotlottieplayerwasm_segment_duration(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    current_loop_count() {
        const ret = wasm.dotlottieplayerwasm_current_loop_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    reset_current_loop_count() {
        wasm.dotlottieplayerwasm_reset_current_loop_count(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    width() {
        const ret = wasm.dotlottieplayerwasm_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    height() {
        const ret = wasm.dotlottieplayerwasm_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * `[width, height]` of the animation in its native coordinate space.
     * @returns {Float32Array}
     */
    animation_size() {
        const ret = wasm.dotlottieplayerwasm_animation_size(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Mode}
     */
    mode() {
        const ret = wasm.dotlottieplayerwasm_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Mode} mode
     */
    set_mode(mode) {
        wasm.dotlottieplayerwasm_set_mode(this.__wbg_ptr, mode);
    }
    /**
     * @returns {number}
     */
    speed() {
        const ret = wasm.dotlottieplayerwasm_speed(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} speed
     */
    set_speed(speed) {
        wasm.dotlottieplayerwasm_set_speed(this.__wbg_ptr, speed);
    }
    /**
     * @returns {boolean}
     */
    loop_animation() {
        const ret = wasm.dotlottieplayerwasm_loop_animation(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} v
     */
    set_loop(v) {
        wasm.dotlottieplayerwasm_set_loop(this.__wbg_ptr, v);
    }
    /**
     * @returns {number}
     */
    loop_count() {
        const ret = wasm.dotlottieplayerwasm_loop_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} n
     */
    set_loop_count(n) {
        wasm.dotlottieplayerwasm_set_loop_count(this.__wbg_ptr, n);
    }
    /**
     * @returns {boolean}
     */
    autoplay() {
        const ret = wasm.dotlottieplayerwasm_autoplay(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} v
     */
    set_autoplay(v) {
        wasm.dotlottieplayerwasm_set_autoplay(this.__wbg_ptr, v);
    }
    /**
     * @returns {boolean}
     */
    use_frame_interpolation() {
        const ret = wasm.dotlottieplayerwasm_use_frame_interpolation(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} v
     */
    set_use_frame_interpolation(v) {
        wasm.dotlottieplayerwasm_set_use_frame_interpolation(this.__wbg_ptr, v);
    }
    /**
     * @returns {number}
     */
    background_color() {
        const ret = wasm.dotlottieplayerwasm_background_color(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Set background colour (`0xAARRGGBB`).
     * @param {number} color
     * @returns {boolean}
     */
    set_background_color(color) {
        const ret = wasm.dotlottieplayerwasm_set_background_color(this.__wbg_ptr, color);
        return ret !== 0;
    }
    /**
     * Clear the background colour (transparent).
     * @returns {boolean}
     */
    clear_background_color() {
        const ret = wasm.dotlottieplayerwasm_clear_background_color(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} quality
     * @returns {boolean}
     */
    set_quality(quality) {
        const ret = wasm.dotlottieplayerwasm_set_quality(this.__wbg_ptr, quality);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    has_segment() {
        const ret = wasm.dotlottieplayerwasm_has_segment(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    segment_start() {
        const ret = wasm.dotlottieplayerwasm_segment_start(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    segment_end() {
        const ret = wasm.dotlottieplayerwasm_segment_end(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} start
     * @param {number} end
     * @returns {boolean}
     */
    set_segment(start, end) {
        const ret = wasm.dotlottieplayerwasm_set_segment(this.__wbg_ptr, start, end);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    clear_segment() {
        const ret = wasm.dotlottieplayerwasm_clear_segment(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Set the layout.
     *
     * `fit` is one of `"contain"`, `"fill"`, `"cover"`, `"fit-width"`,
     * `"fit-height"`, `"none"`.  `align_x` / `align_y` are in [0, 1].
     * @param {string} fit
     * @param {number} align_x
     * @param {number} align_y
     * @returns {boolean}
     */
    set_layout(fit, align_x, align_y) {
        const ptr0 = passStringToWasm0(fit, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_layout(this.__wbg_ptr, ptr0, len0, align_x, align_y);
        return ret !== 0;
    }
    /**
     * @returns {string}
     */
    layout_fit() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dotlottieplayerwasm_layout_fit(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free_command_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    layout_align_x() {
        const ret = wasm.dotlottieplayerwasm_layout_align_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    layout_align_y() {
        const ret = wasm.dotlottieplayerwasm_layout_align_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {boolean}
     */
    set_viewport(x, y, w, h) {
        const ret = wasm.dotlottieplayerwasm_set_viewport(this.__wbg_ptr, x, y, w, h);
        return ret !== 0;
    }
    /**
     * Set a color slot (`r`, `g`, `b` in [0, 1]).
     * @param {string} id
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @returns {boolean}
     */
    set_color_slot(id, r, g, b) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_color_slot(this.__wbg_ptr, ptr0, len0, r, g, b);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @param {number} value
     * @returns {boolean}
     */
    set_scalar_slot(id, value) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_scalar_slot(this.__wbg_ptr, ptr0, len0, value);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @param {string} text
     * @returns {boolean}
     */
    set_text_slot(id, text) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(text, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_text_slot(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    set_vector_slot(id, x, y) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_vector_slot(this.__wbg_ptr, ptr0, len0, x, y);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    set_position_slot(id, x, y) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_position_slot(this.__wbg_ptr, ptr0, len0, x, y);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    clear_slots() {
        const ret = wasm.dotlottieplayerwasm_clear_slots(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @returns {boolean}
     */
    clear_slot(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_clear_slot(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Set multiple slots at once from a JSON string.
     * @param {string} json
     * @returns {boolean}
     */
    set_slots_str(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_slots_str(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Set a single slot by ID from a JSON value string.
     * @param {string} id
     * @param {string} json
     * @returns {boolean}
     */
    set_slot_str(id, json) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(json, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_slot_str(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret !== 0;
    }
    /**
     * Get the JSON value of a single slot by ID, or `undefined` if not found.
     * @param {string} id
     * @returns {string | undefined}
     */
    get_slot_str(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_get_slot_str(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free_command_export(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * Get all slots as a JSON object string.
     * @returns {string}
     */
    get_slots_str() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dotlottieplayerwasm_get_slots_str(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free_command_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get all slot IDs as a JS array.
     * @returns {any}
     */
    get_slot_ids() {
        const ret = wasm.dotlottieplayerwasm_get_slot_ids(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the type string of a slot, or `undefined` if not found.
     * @param {string} id
     * @returns {string | undefined}
     */
    get_slot_type(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_get_slot_type(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free_command_export(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * Reset a slot to its default value from the animation.
     * @param {string} id
     * @returns {boolean}
     */
    reset_slot(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_reset_slot(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Reset all slots to their default values from the animation.
     * @returns {boolean}
     */
    reset_slots() {
        const ret = wasm.dotlottieplayerwasm_reset_slots(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} layer_name
     * @returns {boolean}
     */
    intersect(x, y, layer_name) {
        const ptr0 = passStringToWasm0(layer_name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_intersect(this.__wbg_ptr, x, y, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Returns `[x, y, width, height]` of the layer's bounding box.
     * @param {string} layer_name
     * @returns {Float32Array}
     */
    get_layer_bounds(layer_name) {
        const ptr0 = passStringToWasm0(layer_name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_get_layer_bounds(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Returns the current affine transform as a flat `Float32Array`.
     * @returns {Float32Array}
     */
    get_transform() {
        const ret = wasm.dotlottieplayerwasm_get_transform(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Float32Array} data
     * @returns {boolean}
     */
    set_transform(data) {
        const ptr0 = passArrayF32ToWasm0(data, wasm.__wbindgen_malloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_transform(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Tween to `to` frame.  `duration` in seconds; pass `undefined` for default.
     * @param {number} to
     * @param {number | null} [duration]
     * @returns {boolean}
     */
    tween(to, duration) {
        const ret = wasm.dotlottieplayerwasm_tween(this.__wbg_ptr, to, isLikeNone(duration) ? 0x100000001 : Math.fround(duration));
        return ret !== 0;
    }
    /**
     * Tween with a cubic-bezier easing (`e0..e3`).
     * @param {number} to
     * @param {number | null | undefined} duration
     * @param {number} e0
     * @param {number} e1
     * @param {number} e2
     * @param {number} e3
     * @returns {boolean}
     */
    tween_with_easing(to, duration, e0, e1, e2, e3) {
        const ret = wasm.dotlottieplayerwasm_tween_with_easing(this.__wbg_ptr, to, isLikeNone(duration) ? 0x100000001 : Math.fround(duration), e0, e1, e2, e3);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    tween_stop() {
        const ret = wasm.dotlottieplayerwasm_tween_stop(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number | null} [progress]
     * @returns {boolean}
     */
    tween_update(progress) {
        const ret = wasm.dotlottieplayerwasm_tween_update(this.__wbg_ptr, isLikeNone(progress) ? 0x100000001 : Math.fround(progress));
        return ret !== 0;
    }
    /**
     * @param {string} marker
     * @param {number | null} [duration]
     * @returns {boolean}
     */
    tween_to_marker(marker, duration) {
        const ptr0 = passStringToWasm0(marker, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_tween_to_marker(this.__wbg_ptr, ptr0, len0, isLikeNone(duration) ? 0x100000001 : Math.fround(duration));
        return ret !== 0;
    }
    /**
     * Returns an array of `{ name, time, duration }` objects.
     * @returns {any}
     */
    markers() {
        const ret = wasm.dotlottieplayerwasm_markers(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns an array of marker name strings.
     * @returns {any}
     */
    marker_names() {
        const ret = wasm.dotlottieplayerwasm_marker_names(this.__wbg_ptr);
        return ret;
    }
    /**
     * Name of the currently active marker, or `undefined` if none.
     * @returns {string | undefined}
     */
    current_marker() {
        const ret = wasm.dotlottieplayerwasm_current_marker(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free_command_export(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string} name
     */
    set_marker(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.dotlottieplayerwasm_set_marker(this.__wbg_ptr, ptr0, len0);
    }
    clear_marker() {
        wasm.dotlottieplayerwasm_clear_marker(this.__wbg_ptr);
    }
    /**
     * Poll the next player event.  Returns `null` if the queue is empty,
     * otherwise a plain JS object with a `type` string field and optional
     * payload fields (`frameNo`, `loopCount`).
     * @returns {any}
     */
    poll_event() {
        const ret = wasm.dotlottieplayerwasm_poll_event(this.__wbg_ptr);
        return ret;
    }
    emit_on_loop() {
        wasm.dotlottieplayerwasm_emit_on_loop(this.__wbg_ptr);
    }
    /**
     * @param {string} name
     * @param {Uint8Array} data
     * @returns {boolean}
     */
    load_font(name, data) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc_command_export);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_load_font(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret !== 0;
    }
    /**
     * @param {string} name
     * @returns {boolean}
     */
    static unload_font(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_unload_font(ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @returns {boolean}
     */
    set_theme(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_theme(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    reset_theme() {
        const ret = wasm.dotlottieplayerwasm_reset_theme(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {string} data
     * @returns {boolean}
     */
    set_theme_data(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_set_theme_data(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @returns {string | undefined}
     */
    theme_id() {
        const ret = wasm.dotlottieplayerwasm_theme_id(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free_command_export(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    animation_id() {
        const ret = wasm.dotlottieplayerwasm_animation_id(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free_command_export(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Returns the animation manifest as a JSON string, or empty string if unavailable.
     * @returns {string}
     */
    manifest_string() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dotlottieplayerwasm_manifest_string(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free_command_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Returns the raw JSON definition of a state machine by ID, or `undefined`.
     * @param {string} id
     * @returns {string | undefined}
     */
    get_state_machine(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_get_state_machine(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free_command_export(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * Returns the ID of the currently active state machine, or `undefined`.
     * @returns {string | undefined}
     */
    state_machine_id() {
        const ret = wasm.dotlottieplayerwasm_state_machine_id(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free_command_export(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Load a state machine from a JSON definition string.  Returns `true` on
     * success.  The engine is kept alive inside the player and interacted
     * with via the `sm_*` methods.
     * @param {string} definition
     * @returns {boolean}
     */
    state_machine_load(definition) {
        const ptr0 = passStringToWasm0(definition, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_state_machine_load(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Load a state machine from a .lottie archive by state-machine ID.
     * @param {string} id
     * @returns {boolean}
     */
    state_machine_load_from_id(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_state_machine_load_from_id(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Unload the active state machine.
     */
    state_machine_unload() {
        wasm.dotlottieplayerwasm_state_machine_unload(this.__wbg_ptr);
    }
    /**
     * Fire a named event into the state machine.
     * @param {string} event
     * @returns {boolean}
     */
    sm_fire(event) {
        const ptr0 = passStringToWasm0(event, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_fire(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} key
     * @param {number} value
     * @returns {boolean}
     */
    sm_set_numeric_input(key, value) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_set_numeric_input(this.__wbg_ptr, ptr0, len0, value);
        return ret !== 0;
    }
    /**
     * @param {string} key
     * @returns {number | undefined}
     */
    sm_get_numeric_input(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_get_numeric_input(this.__wbg_ptr, ptr0, len0);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    sm_set_string_input(key, value) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(value, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_set_string_input(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret !== 0;
    }
    /**
     * @param {string} key
     * @returns {string | undefined}
     */
    sm_get_string_input(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_get_string_input(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free_command_export(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} key
     * @param {boolean} value
     * @returns {boolean}
     */
    sm_set_boolean_input(key, value) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_set_boolean_input(this.__wbg_ptr, ptr0, len0, value);
        return ret !== 0;
    }
    /**
     * @param {string} key
     * @returns {boolean | undefined}
     */
    sm_get_boolean_input(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_get_boolean_input(this.__wbg_ptr, ptr0, len0);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {string} key
     */
    sm_reset_input(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.dotlottieplayerwasm_sm_reset_input(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Poll the next state machine event.  Returns `null` if the queue is empty,
     * otherwise a JS object with a `type` field and optional payload.
     * @returns {any}
     */
    sm_poll_event() {
        const ret = wasm.dotlottieplayerwasm_sm_poll_event(this.__wbg_ptr);
        return ret;
    }
    /**
     * Start the state machine with an open-URL policy.
     * @param {boolean} require_user_interaction
     * @param {any[]} whitelist
     * @returns {boolean}
     */
    sm_start(require_user_interaction, whitelist) {
        const ptr0 = passArrayJsValueToWasm0(whitelist, wasm.__wbindgen_malloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_start(this.__wbg_ptr, require_user_interaction, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Stop the state machine.
     * @returns {boolean}
     */
    sm_stop() {
        const ret = wasm.dotlottieplayerwasm_sm_stop(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the current status of the state machine as a string.
     * @returns {string}
     */
    sm_status() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dotlottieplayerwasm_sm_status(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free_command_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the name of the current state.
     * @returns {string}
     */
    sm_current_state() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dotlottieplayerwasm_sm_current_state(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free_command_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Override the current state.
     * @param {string} state
     * @param {boolean} immediate
     * @returns {boolean}
     */
    sm_override_current_state(state, immediate) {
        const ptr0 = passStringToWasm0(state, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_override_current_state(this.__wbg_ptr, ptr0, len0, immediate);
        return ret !== 0;
    }
    /**
     * Returns the framework setup listeners as a JS array of strings.
     * @returns {any}
     */
    sm_framework_setup() {
        const ret = wasm.dotlottieplayerwasm_sm_framework_setup(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns all state machine inputs as a JS array of strings.
     * @returns {any}
     */
    sm_get_inputs() {
        const ret = wasm.dotlottieplayerwasm_sm_get_inputs(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    sm_post_click(x, y) {
        wasm.dotlottieplayerwasm_sm_post_click(this.__wbg_ptr, x, y);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    sm_post_pointer_down(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_down(this.__wbg_ptr, x, y);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    sm_post_pointer_up(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_up(this.__wbg_ptr, x, y);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    sm_post_pointer_move(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_move(this.__wbg_ptr, x, y);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    sm_post_pointer_enter(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_enter(this.__wbg_ptr, x, y);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    sm_post_pointer_exit(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_exit(this.__wbg_ptr, x, y);
    }
    /**
     * Poll the next state machine internal event.  Returns `null` if the
     * queue is empty, otherwise a JS object `{ type: "Message", message }`.
     * @returns {any}
     */
    sm_poll_internal_event() {
        const ret = wasm.dotlottieplayerwasm_sm_poll_internal_event(this.__wbg_ptr);
        return ret;
    }
    /**
     * Advance the state machine by one tick.  Returns `false` if no state machine
     * is loaded, otherwise `true` (even if the machine is stopped or errored).
     * @returns {boolean}
     */
    sm_tick() {
        const ret = wasm.dotlottieplayerwasm_sm_tick(this.__wbg_ptr);
        return ret !== 0;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_beginComputePass_ce58248c78ea4f0b = function(arg0, arg1) {
        const ret = arg0.beginComputePass(arg1);
        return ret;
    };
    imports.wbg.__wbg_beginRenderPass_509df70c967b895c = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.beginRenderPass(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_configure_7e2130842707feff = function() { return handleError(function (arg0, arg1) {
        arg0.configure(arg1);
    }, arguments) };
    imports.wbg.__wbg_copyTextureToTexture_8b0d14b8089f3036 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyTextureToTexture(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_createBindGroupLayout_5f799ca8bc5aa1fc = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createBindGroupLayout(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBindGroup_ddd3bb343cf271fb = function(arg0, arg1) {
        const ret = arg0.createBindGroup(arg1);
        return ret;
    };
    imports.wbg.__wbg_createBuffer_826176fb72deecbf = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createBuffer(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createCommandEncoder_579fe7e60b87a1c4 = function(arg0, arg1) {
        const ret = arg0.createCommandEncoder(arg1);
        return ret;
    };
    imports.wbg.__wbg_createComputePipeline_5f91c9fb81d570e7 = function(arg0, arg1) {
        const ret = arg0.createComputePipeline(arg1);
        return ret;
    };
    imports.wbg.__wbg_createPipelineLayout_b1406687fd03f870 = function(arg0, arg1) {
        const ret = arg0.createPipelineLayout(arg1);
        return ret;
    };
    imports.wbg.__wbg_createRenderPipeline_24a0e9be53ed468e = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createRenderPipeline(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createSampler_381b4ade52f53f68 = function(arg0, arg1) {
        const ret = arg0.createSampler(arg1);
        return ret;
    };
    imports.wbg.__wbg_createShaderModule_035719b95e2aae80 = function(arg0, arg1) {
        const ret = arg0.createShaderModule(arg1);
        return ret;
    };
    imports.wbg.__wbg_createTexture_6947ba7853a1d055 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createTexture(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createView_7f08b4f77746d573 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createView(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_destroy_911c8640ffed5684 = function(arg0) {
        arg0.destroy();
    };
    imports.wbg.__wbg_destroy_c1bd9f1fd447bebf = function(arg0) {
        arg0.destroy();
    };
    imports.wbg.__wbg_dispatchWorkgroups_6b7a05edf9c2b474 = function(arg0, arg1, arg2, arg3) {
        arg0.dispatchWorkgroups(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_drawIndexed_0d27b49d3d541ca9 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
    };
    imports.wbg.__wbg_draw_afac1827162db569 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_end_5f3989c200fa79e9 = function(arg0) {
        arg0.end();
    };
    imports.wbg.__wbg_end_e9ed158432136036 = function(arg0) {
        arg0.end();
    };
    imports.wbg.__wbg_finish_5d6bd1bf9cca88b0 = function(arg0, arg1) {
        const ret = arg0.finish(arg1);
        return ret;
    };
    imports.wbg.__wbg_finish_a3819bcf098c1f84 = function(arg0) {
        const ret = arg0.finish();
        return ret;
    };
    imports.wbg.__wbg_format_cb1ef2f3b44b306a = function(arg0) {
        const ret = arg0.format;
        return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1;
    };
    imports.wbg.__wbg_getCurrentTexture_cf3b91d12114ffcb = function() { return handleError(function (arg0) {
        const ret = arg0.getCurrentTexture();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_height_a1cdc6189018a9b3 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_5e0be73521bc8c17 = function() {
        const ret = new Map();
        return ret;
    };
    imports.wbg.__wbg_new_78feb108b6472713 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_5a5efe313cfd59f1 = function(arg0) {
        const ret = new Float32Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_now_807e54c39636c349 = function() {
        const ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_queue_712d25576063d2fc = function(arg0) {
        const ret = arg0.queue;
        return ret;
    };
    imports.wbg.__wbg_setBindGroup_03656750a7c9f7c6 = function(arg0, arg1, arg2) {
        arg0.setBindGroup(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_setBindGroup_438462565faaa01c = function(arg0, arg1, arg2) {
        arg0.setBindGroup(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_setBindGroup_8ec97340dd95cb9c = function(arg0, arg1, arg2, arg3) {
        arg0.setBindGroup(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_setBindGroup_beb777273edc100f = function(arg0, arg1, arg2, arg3) {
        arg0.setBindGroup(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_setIndexBuffer_1e94798fafd75b38 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
    };
    imports.wbg.__wbg_setPipeline_4cd9468d332cf0cb = function(arg0, arg1) {
        arg0.setPipeline(arg1);
    };
    imports.wbg.__wbg_setPipeline_a48ed1de5bcb914a = function(arg0, arg1) {
        arg0.setPipeline(arg1);
    };
    imports.wbg.__wbg_setScissorRect_d69fa46fa55e5d29 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_setStencilReference_d21fe89ea5f39f77 = function(arg0, arg1) {
        arg0.setStencilReference(arg1 >>> 0);
    };
    imports.wbg.__wbg_setVertexBuffer_31b4fff2767922a0 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_set_8fc6bf8a5b1071d1 = function(arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_seta_aa2e87786f1942f7 = function(arg0, arg1) {
        arg0.a = arg1;
    };
    imports.wbg.__wbg_setaccess_86057694fc60b7f2 = function(arg0, arg1) {
        arg0.access = __wbindgen_enum_GpuStorageTextureAccess[arg1];
    };
    imports.wbg.__wbg_setaddressmodeu_f4d9eced9e9a9499 = function(arg0, arg1) {
        arg0.addressModeU = __wbindgen_enum_GpuAddressMode[arg1];
    };
    imports.wbg.__wbg_setaddressmodev_cb577d2f98afac7c = function(arg0, arg1) {
        arg0.addressModeV = __wbindgen_enum_GpuAddressMode[arg1];
    };
    imports.wbg.__wbg_setaddressmodew_0e9a9aa668e91f34 = function(arg0, arg1) {
        arg0.addressModeW = __wbindgen_enum_GpuAddressMode[arg1];
    };
    imports.wbg.__wbg_setalpha_789b6ecd7c06e5f3 = function(arg0, arg1) {
        arg0.alpha = arg1;
    };
    imports.wbg.__wbg_setalphatocoverageenabled_8862a1b7a0f204c6 = function(arg0, arg1) {
        arg0.alphaToCoverageEnabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setarraylayercount_cd3d3ab55145805f = function(arg0, arg1) {
        arg0.arrayLayerCount = arg1 >>> 0;
    };
    imports.wbg.__wbg_setarraystride_84800a5d0f5fa40b = function(arg0, arg1) {
        arg0.arrayStride = arg1;
    };
    imports.wbg.__wbg_setaspect_71ab7bc27f22254c = function(arg0, arg1) {
        arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
    };
    imports.wbg.__wbg_setaspect_df168d4e18afc498 = function(arg0, arg1) {
        arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
    };
    imports.wbg.__wbg_setattributes_340843a4c4217777 = function(arg0, arg1) {
        arg0.attributes = arg1;
    };
    imports.wbg.__wbg_setb_4a958fe161746e0b = function(arg0, arg1) {
        arg0.b = arg1;
    };
    imports.wbg.__wbg_setbasearraylayer_66b527b8665953c2 = function(arg0, arg1) {
        arg0.baseArrayLayer = arg1 >>> 0;
    };
    imports.wbg.__wbg_setbasemiplevel_8b05bec34091257b = function(arg0, arg1) {
        arg0.baseMipLevel = arg1 >>> 0;
    };
    imports.wbg.__wbg_setbeginningofpasswriteindex_449cbd524b33366d = function(arg0, arg1) {
        arg0.beginningOfPassWriteIndex = arg1 >>> 0;
    };
    imports.wbg.__wbg_setbeginningofpasswriteindex_645ab3ba9029ac4a = function(arg0, arg1) {
        arg0.beginningOfPassWriteIndex = arg1 >>> 0;
    };
    imports.wbg.__wbg_setbindgrouplayouts_b74aac632f5e0cd3 = function(arg0, arg1) {
        arg0.bindGroupLayouts = arg1;
    };
    imports.wbg.__wbg_setbinding_524d68995acbd9d8 = function(arg0, arg1) {
        arg0.binding = arg1 >>> 0;
    };
    imports.wbg.__wbg_setbinding_5fb23ecf62d3bb68 = function(arg0, arg1) {
        arg0.binding = arg1 >>> 0;
    };
    imports.wbg.__wbg_setblend_fc955738a0ea479e = function(arg0, arg1) {
        arg0.blend = arg1;
    };
    imports.wbg.__wbg_setbuffer_90ac1c7477e1bc4f = function(arg0, arg1) {
        arg0.buffer = arg1;
    };
    imports.wbg.__wbg_setbuffer_f4026154d4c607c4 = function(arg0, arg1) {
        arg0.buffer = arg1;
    };
    imports.wbg.__wbg_setbuffers_72c10dde80619dfb = function(arg0, arg1) {
        arg0.buffers = arg1;
    };
    imports.wbg.__wbg_setbytesperrow_27937d232b087985 = function(arg0, arg1) {
        arg0.bytesPerRow = arg1 >>> 0;
    };
    imports.wbg.__wbg_setclearvalue_245c9baef9ca9f40 = function(arg0, arg1) {
        arg0.clearValue = arg1;
    };
    imports.wbg.__wbg_setcode_e3412dedece095a3 = function(arg0, arg1, arg2) {
        arg0.code = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setcolor_2fcb4c98d73b4a08 = function(arg0, arg1) {
        arg0.color = arg1;
    };
    imports.wbg.__wbg_setcolorattachments_315a32a9447c8143 = function(arg0, arg1) {
        arg0.colorAttachments = arg1;
    };
    imports.wbg.__wbg_setcompare_1eeae8f049314765 = function(arg0, arg1) {
        arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
    };
    imports.wbg.__wbg_setcompare_392fd4fe47194005 = function(arg0, arg1) {
        arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
    };
    imports.wbg.__wbg_setcompute_5b54088b8639edd0 = function(arg0, arg1) {
        arg0.compute = arg1;
    };
    imports.wbg.__wbg_setconstants_08df997e38e4da58 = function(arg0, arg1) {
        arg0.constants = arg1;
    };
    imports.wbg.__wbg_setconstants_8fdb7b4cac7ebe8c = function(arg0, arg1) {
        arg0.constants = arg1;
    };
    imports.wbg.__wbg_setconstants_a7158f4f0eb335b7 = function(arg0, arg1) {
        arg0.constants = arg1;
    };
    imports.wbg.__wbg_setcount_f0218523e435fe27 = function(arg0, arg1) {
        arg0.count = arg1 >>> 0;
    };
    imports.wbg.__wbg_setcullmode_d07f4cca149fc8fd = function(arg0, arg1) {
        arg0.cullMode = __wbindgen_enum_GpuCullMode[arg1];
    };
    imports.wbg.__wbg_setdepthbias_d0a6693d6a8ab87e = function(arg0, arg1) {
        arg0.depthBias = arg1;
    };
    imports.wbg.__wbg_setdepthbiasclamp_256485c28643d20d = function(arg0, arg1) {
        arg0.depthBiasClamp = arg1;
    };
    imports.wbg.__wbg_setdepthbiasslopescale_b7ec92a9bda5e232 = function(arg0, arg1) {
        arg0.depthBiasSlopeScale = arg1;
    };
    imports.wbg.__wbg_setdepthclearvalue_e427925fb817bffc = function(arg0, arg1) {
        arg0.depthClearValue = arg1;
    };
    imports.wbg.__wbg_setdepthcompare_3d414508518d2332 = function(arg0, arg1) {
        arg0.depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
    };
    imports.wbg.__wbg_setdepthfailop_bb45e35727206b07 = function(arg0, arg1) {
        arg0.depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1];
    };
    imports.wbg.__wbg_setdepthloadop_6e7ed58390bcb472 = function(arg0, arg1) {
        arg0.depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
    };
    imports.wbg.__wbg_setdepthorarraylayers_f883a5503c92fcbe = function(arg0, arg1) {
        arg0.depthOrArrayLayers = arg1 >>> 0;
    };
    imports.wbg.__wbg_setdepthreadonly_ec5f87de25f955c6 = function(arg0, arg1) {
        arg0.depthReadOnly = arg1 !== 0;
    };
    imports.wbg.__wbg_setdepthslice_4c2d15e75ec01602 = function(arg0, arg1) {
        arg0.depthSlice = arg1 >>> 0;
    };
    imports.wbg.__wbg_setdepthstencil_ab24ec143b022ff9 = function(arg0, arg1) {
        arg0.depthStencil = arg1;
    };
    imports.wbg.__wbg_setdepthstencilattachment_8abbf392d55551bd = function(arg0, arg1) {
        arg0.depthStencilAttachment = arg1;
    };
    imports.wbg.__wbg_setdepthstoreop_c529093252e36c11 = function(arg0, arg1) {
        arg0.depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
    };
    imports.wbg.__wbg_setdepthwriteenabled_a97b018ec8906115 = function(arg0, arg1) {
        arg0.depthWriteEnabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setdimension_2892b665919c0e54 = function(arg0, arg1) {
        arg0.dimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    };
    imports.wbg.__wbg_setdimension_c14e0b4f680f2a14 = function(arg0, arg1) {
        arg0.dimension = __wbindgen_enum_GpuTextureDimension[arg1];
    };
    imports.wbg.__wbg_setdstfactor_04b172f73540aabf = function(arg0, arg1) {
        arg0.dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
    };
    imports.wbg.__wbg_setendofpasswriteindex_6923ba50f58bb0df = function(arg0, arg1) {
        arg0.endOfPassWriteIndex = arg1 >>> 0;
    };
    imports.wbg.__wbg_setendofpasswriteindex_832ce3e1b3972fae = function(arg0, arg1) {
        arg0.endOfPassWriteIndex = arg1 >>> 0;
    };
    imports.wbg.__wbg_setentries_545836ca7979d0c3 = function(arg0, arg1) {
        arg0.entries = arg1;
    };
    imports.wbg.__wbg_setentries_99398ac8873772cf = function(arg0, arg1) {
        arg0.entries = arg1;
    };
    imports.wbg.__wbg_setentrypoint_40d651c49abeabef = function(arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setentrypoint_78553a4419def0b5 = function(arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setentrypoint_9de314a2c2570802 = function(arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setfailop_3b7d50b0a4f08e69 = function(arg0, arg1) {
        arg0.failOp = __wbindgen_enum_GpuStencilOperation[arg1];
    };
    imports.wbg.__wbg_setformat_01f82498bb7aa545 = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_3dd749532151c43e = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_5106903c3bec7f29 = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_984f8b09308d0584 = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_c0f2655a6b8dae1a = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_d474115239036438 = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuVertexFormat[arg1];
    };
    imports.wbg.__wbg_setfragment_1f67ab59aff99617 = function(arg0, arg1) {
        arg0.fragment = arg1;
    };
    imports.wbg.__wbg_setfrontface_1875a91bf87e5bad = function(arg0, arg1) {
        arg0.frontFace = __wbindgen_enum_GpuFrontFace[arg1];
    };
    imports.wbg.__wbg_setg_a62d6aa648d4cd4c = function(arg0, arg1) {
        arg0.g = arg1;
    };
    imports.wbg.__wbg_sethasdynamicoffset_78853235cc49b8ea = function(arg0, arg1) {
        arg0.hasDynamicOffset = arg1 !== 0;
    };
    imports.wbg.__wbg_setheight_1e158913ddc793af = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_setindex_4e73afdcd9bb95cd = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_setlayout_44fc85f3dd4d8fd6 = function(arg0, arg1) {
        arg0.layout = arg1;
    };
    imports.wbg.__wbg_setlayout_74172b78828c84fe = function(arg0, arg1) {
        arg0.layout = arg1;
    };
    imports.wbg.__wbg_setlayout_a9e58d0996412dfa = function(arg0, arg1) {
        arg0.layout = arg1;
    };
    imports.wbg.__wbg_setloadop_f1ccd5d15b52ca5d = function(arg0, arg1) {
        arg0.loadOp = __wbindgen_enum_GpuLoadOp[arg1];
    };
    imports.wbg.__wbg_setlodmaxclamp_2c14826867287557 = function(arg0, arg1) {
        arg0.lodMaxClamp = arg1;
    };
    imports.wbg.__wbg_setlodminclamp_90c60cc7e8baa95b = function(arg0, arg1) {
        arg0.lodMinClamp = arg1;
    };
    imports.wbg.__wbg_setmagfilter_064b565970422154 = function(arg0, arg1) {
        arg0.magFilter = __wbindgen_enum_GpuFilterMode[arg1];
    };
    imports.wbg.__wbg_setmappedatcreation_5b22281a9edff7fa = function(arg0, arg1) {
        arg0.mappedAtCreation = arg1 !== 0;
    };
    imports.wbg.__wbg_setmask_2007e390b35587d6 = function(arg0, arg1) {
        arg0.mask = arg1 >>> 0;
    };
    imports.wbg.__wbg_setmaxanisotropy_d90cbfc49f762cf1 = function(arg0, arg1) {
        arg0.maxAnisotropy = arg1;
    };
    imports.wbg.__wbg_setminbindingsize_b6106c56d37c8a84 = function(arg0, arg1) {
        arg0.minBindingSize = arg1;
    };
    imports.wbg.__wbg_setminfilter_712d4dcd764a0d5e = function(arg0, arg1) {
        arg0.minFilter = __wbindgen_enum_GpuFilterMode[arg1];
    };
    imports.wbg.__wbg_setmiplevel_5fa33ce523901448 = function(arg0, arg1) {
        arg0.mipLevel = arg1 >>> 0;
    };
    imports.wbg.__wbg_setmiplevelcount_836d12b93ef02836 = function(arg0, arg1) {
        arg0.mipLevelCount = arg1 >>> 0;
    };
    imports.wbg.__wbg_setmiplevelcount_da876250f18dd0e7 = function(arg0, arg1) {
        arg0.mipLevelCount = arg1 >>> 0;
    };
    imports.wbg.__wbg_setmipmapfilter_9cac92abe21b7816 = function(arg0, arg1) {
        arg0.mipmapFilter = __wbindgen_enum_GpuMipmapFilterMode[arg1];
    };
    imports.wbg.__wbg_setmodule_7b8dd93fefd91a73 = function(arg0, arg1) {
        arg0.module = arg1;
    };
    imports.wbg.__wbg_setmodule_e1281341685bf91a = function(arg0, arg1) {
        arg0.module = arg1;
    };
    imports.wbg.__wbg_setmodule_e7a882363768bf73 = function(arg0, arg1) {
        arg0.module = arg1;
    };
    imports.wbg.__wbg_setmultisample_95fbbb44e36714e3 = function(arg0, arg1) {
        arg0.multisample = arg1;
    };
    imports.wbg.__wbg_setmultisampled_f7f0562151e1ff91 = function(arg0, arg1) {
        arg0.multisampled = arg1 !== 0;
    };
    imports.wbg.__wbg_setocclusionqueryset_a2a4abf338fb3441 = function(arg0, arg1) {
        arg0.occlusionQuerySet = arg1;
    };
    imports.wbg.__wbg_setoffset_1bf2826ce181376a = function(arg0, arg1) {
        arg0.offset = arg1;
    };
    imports.wbg.__wbg_setoffset_f6f822a44e88af7e = function(arg0, arg1) {
        arg0.offset = arg1;
    };
    imports.wbg.__wbg_setoffset_fe9f09cc240192d0 = function(arg0, arg1) {
        arg0.offset = arg1;
    };
    imports.wbg.__wbg_setoperation_de3d845bdac61eb3 = function(arg0, arg1) {
        arg0.operation = __wbindgen_enum_GpuBlendOperation[arg1];
    };
    imports.wbg.__wbg_setorigin_9d2dbc71ffaae355 = function(arg0, arg1) {
        arg0.origin = arg1;
    };
    imports.wbg.__wbg_setpassop_8767e1a56e3c30da = function(arg0, arg1) {
        arg0.passOp = __wbindgen_enum_GpuStencilOperation[arg1];
    };
    imports.wbg.__wbg_setprimitive_491591635926383f = function(arg0, arg1) {
        arg0.primitive = arg1;
    };
    imports.wbg.__wbg_setqueryset_0351509707c5cd51 = function(arg0, arg1) {
        arg0.querySet = arg1;
    };
    imports.wbg.__wbg_setqueryset_c4a0351a777cdfbd = function(arg0, arg1) {
        arg0.querySet = arg1;
    };
    imports.wbg.__wbg_setr_732e149cd5493a75 = function(arg0, arg1) {
        arg0.r = arg1;
    };
    imports.wbg.__wbg_setresolvetarget_56e82fe32d6e757b = function(arg0, arg1) {
        arg0.resolveTarget = arg1;
    };
    imports.wbg.__wbg_setresource_261b30a085bc9a72 = function(arg0, arg1) {
        arg0.resource = arg1;
    };
    imports.wbg.__wbg_setrowsperimage_5d58ebd56fa65231 = function(arg0, arg1) {
        arg0.rowsPerImage = arg1 >>> 0;
    };
    imports.wbg.__wbg_setsamplecount_ecdebb2cba9265c0 = function(arg0, arg1) {
        arg0.sampleCount = arg1 >>> 0;
    };
    imports.wbg.__wbg_setsampler_5d1ee8efc1fd14d3 = function(arg0, arg1) {
        arg0.sampler = arg1;
    };
    imports.wbg.__wbg_setsampletype_afa82d0d8ad6e2d7 = function(arg0, arg1) {
        arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
    };
    imports.wbg.__wbg_setshaderlocation_315967bfde4427a8 = function(arg0, arg1) {
        arg0.shaderLocation = arg1 >>> 0;
    };
    imports.wbg.__wbg_setsize_021142f0cf8b49c2 = function(arg0, arg1) {
        arg0.size = arg1;
    };
    imports.wbg.__wbg_setsize_4f9d7203f06fc54a = function(arg0, arg1) {
        arg0.size = arg1;
    };
    imports.wbg.__wbg_setsize_a2662ec0e7f16cc9 = function(arg0, arg1) {
        arg0.size = arg1;
    };
    imports.wbg.__wbg_setsrcfactor_5aea25a9f1933072 = function(arg0, arg1) {
        arg0.srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
    };
    imports.wbg.__wbg_setstencilback_1b6b2643a15d5066 = function(arg0, arg1) {
        arg0.stencilBack = arg1;
    };
    imports.wbg.__wbg_setstencilclearvalue_ef82d3b767ad806f = function(arg0, arg1) {
        arg0.stencilClearValue = arg1 >>> 0;
    };
    imports.wbg.__wbg_setstencilfront_4e2eaace01795028 = function(arg0, arg1) {
        arg0.stencilFront = arg1;
    };
    imports.wbg.__wbg_setstencilloadop_6e7bc3186a01330e = function(arg0, arg1) {
        arg0.stencilLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
    };
    imports.wbg.__wbg_setstencilreadmask_99287c6b013f0ae2 = function(arg0, arg1) {
        arg0.stencilReadMask = arg1 >>> 0;
    };
    imports.wbg.__wbg_setstencilreadonly_00d790631a8e4330 = function(arg0, arg1) {
        arg0.stencilReadOnly = arg1 !== 0;
    };
    imports.wbg.__wbg_setstencilstoreop_22d01da4d35271b2 = function(arg0, arg1) {
        arg0.stencilStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
    };
    imports.wbg.__wbg_setstencilwritemask_30cfa473ca5600c7 = function(arg0, arg1) {
        arg0.stencilWriteMask = arg1 >>> 0;
    };
    imports.wbg.__wbg_setstepmode_ac000a7f17d3b87d = function(arg0, arg1) {
        arg0.stepMode = __wbindgen_enum_GpuVertexStepMode[arg1];
    };
    imports.wbg.__wbg_setstoragetexture_c17314bf4e104ece = function(arg0, arg1) {
        arg0.storageTexture = arg1;
    };
    imports.wbg.__wbg_setstoreop_571e86638124baba = function(arg0, arg1) {
        arg0.storeOp = __wbindgen_enum_GpuStoreOp[arg1];
    };
    imports.wbg.__wbg_setstripindexformat_9ec52f6405d7985b = function(arg0, arg1) {
        arg0.stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1];
    };
    imports.wbg.__wbg_settargets_591e8613a4896aac = function(arg0, arg1) {
        arg0.targets = arg1;
    };
    imports.wbg.__wbg_settexture_62c91e1557d1310a = function(arg0, arg1) {
        arg0.texture = arg1;
    };
    imports.wbg.__wbg_settexture_a8c8df2623f6e670 = function(arg0, arg1) {
        arg0.texture = arg1;
    };
    imports.wbg.__wbg_settimestampwrites_65e353db5011b652 = function(arg0, arg1) {
        arg0.timestampWrites = arg1;
    };
    imports.wbg.__wbg_settimestampwrites_c48f0b3db52a9119 = function(arg0, arg1) {
        arg0.timestampWrites = arg1;
    };
    imports.wbg.__wbg_settopology_35540552af8ad12e = function(arg0, arg1) {
        arg0.topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
    };
    imports.wbg.__wbg_settype_51c2819925b5e0a6 = function(arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
    };
    imports.wbg.__wbg_settype_a275611edc111d26 = function(arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
    };
    imports.wbg.__wbg_setunclippeddepth_43cbbb9961b4b705 = function(arg0, arg1) {
        arg0.unclippedDepth = arg1 !== 0;
    };
    imports.wbg.__wbg_setusage_7836ddf40e55971a = function(arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    };
    imports.wbg.__wbg_setusage_7e9a6c2f119cab96 = function(arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    };
    imports.wbg.__wbg_setusage_97670aee3d9bbf16 = function(arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    };
    imports.wbg.__wbg_setvertex_602fd330026bc0be = function(arg0, arg1) {
        arg0.vertex = arg1;
    };
    imports.wbg.__wbg_setview_2eb28c0fa8228e7c = function(arg0, arg1) {
        arg0.view = arg1;
    };
    imports.wbg.__wbg_setview_451a1441471a69db = function(arg0, arg1) {
        arg0.view = arg1;
    };
    imports.wbg.__wbg_setviewdimension_d632693fb1d12b24 = function(arg0, arg1) {
        arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    };
    imports.wbg.__wbg_setviewdimension_dc868215e54cbbba = function(arg0, arg1) {
        arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    };
    imports.wbg.__wbg_setviewformats_6c89940ba38f64ff = function(arg0, arg1) {
        arg0.viewFormats = arg1;
    };
    imports.wbg.__wbg_setvisibility_1f6371439759b513 = function(arg0, arg1) {
        arg0.visibility = arg1 >>> 0;
    };
    imports.wbg.__wbg_setwidth_6cc268cef8245a36 = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_setwritemask_4ea635b0719187be = function(arg0, arg1) {
        arg0.writeMask = arg1 >>> 0;
    };
    imports.wbg.__wbg_size_84ca9c23c7989256 = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_submit_3bf51baf36de553b = function(arg0, arg1) {
        arg0.submit(arg1);
    };
    imports.wbg.__wbg_unconfigure_64b5f267287f6b71 = function(arg0) {
        arg0.unconfigure();
    };
    imports.wbg.__wbg_usage_d2a45c8d889f9c63 = function(arg0) {
        const ret = arg0.usage;
        return ret;
    };
    imports.wbg.__wbg_width_684e9aa31cbda8b8 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_writeBuffer_b5be14e621130604 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.writeBuffer(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_writeTexture_ff0b4f87c3efd0dc = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.writeTexture(arg1, getArrayU8FromWasm0(arg2, arg3), arg4, arg5);
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        throw new Error('WASM module URL must be provided via DotLottieWasmLoader or setWasmUrl().');
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
