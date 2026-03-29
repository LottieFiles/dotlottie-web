let wasm;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc_command_export();
    wasm.__wbindgen_export_1.set(idx, obj);
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store_command_export(idx);
    }
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

let cachedInt32ArrayMemory0 = null;

function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedFloat32ArrayMemory0 = null;

function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
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

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
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
     * @returns {boolean}
     */
    is_playing() {
        const ret = wasm.dotlottieplayerwasm_is_playing(this.__wbg_ptr);
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
    loop_count() {
        const ret = wasm.dotlottieplayerwasm_loop_count(this.__wbg_ptr);
        return ret >>> 0;
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
     * @param {string} name
     */
    set_marker(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.dotlottieplayerwasm_set_marker(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {boolean}
     */
    tween_stop() {
        const ret = wasm.dotlottieplayerwasm_tween_stop(this.__wbg_ptr);
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
     * @returns {boolean}
     */
    has_segment() {
        const ret = wasm.dotlottieplayerwasm_has_segment(this.__wbg_ptr);
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
     * Reset all slots to their default values from the animation.
     * @returns {boolean}
     */
    reset_slots() {
        const ret = wasm.dotlottieplayerwasm_reset_slots(this.__wbg_ptr);
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
     * @returns {number}
     */
    segment_end() {
        const ret = wasm.dotlottieplayerwasm_segment_end(this.__wbg_ptr);
        return ret;
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
     * @param {number} start
     * @param {number} end
     * @returns {boolean}
     */
    set_segment(start, end) {
        const ret = wasm.dotlottieplayerwasm_set_segment(this.__wbg_ptr, start, end);
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
    clear_marker() {
        wasm.dotlottieplayerwasm_clear_marker(this.__wbg_ptr);
    }
    emit_on_loop() {
        wasm.dotlottieplayerwasm_emit_on_loop(this.__wbg_ptr);
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
     * Returns an array of marker name strings.
     * @returns {any}
     */
    marker_names() {
        const ret = wasm.dotlottieplayerwasm_marker_names(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean} v
     */
    set_autoplay(v) {
        wasm.dotlottieplayerwasm_set_autoplay(this.__wbg_ptr, v);
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
     * @returns {number}
     */
    total_frames() {
        const ret = wasm.dotlottieplayerwasm_total_frames(this.__wbg_ptr);
        return ret;
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
     * @returns {boolean}
     */
    clear_segment() {
        const ret = wasm.dotlottieplayerwasm_clear_segment(this.__wbg_ptr);
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
     * Returns the current affine transform as a flat `Float32Array`.
     * @returns {Float32Array}
     */
    get_transform() {
        const ret = wasm.dotlottieplayerwasm_get_transform(this.__wbg_ptr);
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
     * @returns {number}
     */
    segment_start() {
        const ret = wasm.dotlottieplayerwasm_segment_start(this.__wbg_ptr);
        return ret;
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
     * Returns all state machine inputs as a JS array of strings.
     * @returns {any}
     */
    sm_get_inputs() {
        const ret = wasm.dotlottieplayerwasm_sm_get_inputs(this.__wbg_ptr);
        return ret;
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
     * @param {number} x
     * @param {number} y
     */
    sm_post_click(x, y) {
        wasm.dotlottieplayerwasm_sm_post_click(this.__wbg_ptr, x, y);
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
     * @returns {boolean}
     */
    loop_animation() {
        const ret = wasm.dotlottieplayerwasm_loop_animation(this.__wbg_ptr);
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
     * @param {number} n
     */
    set_loop_count(n) {
        wasm.dotlottieplayerwasm_set_loop_count(this.__wbg_ptr, n);
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
     * @param {string} key
     */
    sm_reset_input(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.dotlottieplayerwasm_sm_reset_input(this.__wbg_ptr, ptr0, len0);
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
     * @returns {number}
     */
    background_color() {
        const ret = wasm.dotlottieplayerwasm_background_color(this.__wbg_ptr);
        return ret >>> 0;
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
     * @returns {number}
     */
    segment_duration() {
        const ret = wasm.dotlottieplayerwasm_segment_duration(this.__wbg_ptr);
        return ret;
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
     * Store the WebGL2 context.  Call before `load_animation`.
     * Each player instance owns its own context, enabling multiple
     * WebGL canvases simultaneously.
     * @param {WebGL2RenderingContext} ctx
     */
    set_webgl_context(ctx) {
        wasm.dotlottieplayerwasm_set_webgl_context(this.__wbg_ptr, ctx);
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
     * @returns {number}
     */
    current_loop_count() {
        const ret = wasm.dotlottieplayerwasm_current_loop_count(this.__wbg_ptr);
        return ret >>> 0;
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
     * @param {number} x
     * @param {number} y
     */
    sm_post_pointer_up(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_up(this.__wbg_ptr, x, y);
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
     * Set background colour (`0xAARRGGBB`).
     * @param {number} color
     * @returns {boolean}
     */
    set_background_color(color) {
        const ret = wasm.dotlottieplayerwasm_set_background_color(this.__wbg_ptr, color);
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
     * @returns {number | undefined}
     */
    sm_get_numeric_input(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dotlottieplayerwasm_sm_get_numeric_input(this.__wbg_ptr, ptr0, len0);
        return ret === 0x100000001 ? undefined : ret;
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
    sm_post_pointer_exit(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_exit(this.__wbg_ptr, x, y);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    sm_post_pointer_move(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_move(this.__wbg_ptr, x, y);
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
     * Unload the active state machine.
     */
    state_machine_unload() {
        wasm.dotlottieplayerwasm_state_machine_unload(this.__wbg_ptr);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    sm_post_pointer_enter(x, y) {
        wasm.dotlottieplayerwasm_sm_post_pointer_enter(this.__wbg_ptr, x, y);
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
     * Poll the next state machine internal event.  Returns `null` if the
     * queue is empty, otherwise a JS object `{ type: "Message", message }`.
     * @returns {any}
     */
    sm_poll_internal_event() {
        const ret = wasm.dotlottieplayerwasm_sm_poll_internal_event(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    use_frame_interpolation() {
        const ret = wasm.dotlottieplayerwasm_use_frame_interpolation(this.__wbg_ptr);
        return ret !== 0;
    }
    reset_current_loop_count() {
        wasm.dotlottieplayerwasm_reset_current_loop_count(this.__wbg_ptr);
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
     * @param {boolean} v
     */
    set_use_frame_interpolation(v) {
        wasm.dotlottieplayerwasm_set_use_frame_interpolation(this.__wbg_ptr, v);
    }
    constructor() {
        const ret = wasm.dotlottieplayerwasm_new();
        this.__wbg_ptr = ret >>> 0;
        DotLottiePlayerWasmFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Mode}
     */
    mode() {
        const ret = wasm.dotlottieplayerwasm_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    play() {
        const ret = wasm.dotlottieplayerwasm_play(this.__wbg_ptr);
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
     * @returns {boolean}
     */
    stop() {
        const ret = wasm.dotlottieplayerwasm_stop(this.__wbg_ptr);
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
     * Clear the canvas to the background colour.
     */
    clear() {
        wasm.dotlottieplayerwasm_clear(this.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    pause() {
        const ret = wasm.dotlottieplayerwasm_pause(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    speed() {
        const ret = wasm.dotlottieplayerwasm_speed(this.__wbg_ptr);
        return ret;
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
     * Render the current frame without advancing time.
     * @returns {boolean}
     */
    render() {
        const ret = wasm.dotlottieplayerwasm_render(this.__wbg_ptr);
        return ret !== 0;
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
     * Returns an array of `{ name, time, duration }` objects.
     * @returns {any}
     */
    markers() {
        const ret = wasm.dotlottieplayerwasm_markers(this.__wbg_ptr);
        return ret;
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
     * Stop the state machine.
     * @returns {boolean}
     */
    sm_stop() {
        const ret = wasm.dotlottieplayerwasm_sm_stop(this.__wbg_ptr);
        return ret !== 0;
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
    /**
     * @returns {boolean}
     */
    autoplay() {
        const ret = wasm.dotlottieplayerwasm_autoplay(this.__wbg_ptr);
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
     * @param {boolean} v
     */
    set_loop(v) {
        wasm.dotlottieplayerwasm_set_loop(this.__wbg_ptr, v);
    }
    /**
     * @param {Mode} mode
     */
    set_mode(mode) {
        wasm.dotlottieplayerwasm_set_mode(this.__wbg_ptr, mode);
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
     * @returns {boolean}
     */
    is_loaded() {
        const ret = wasm.dotlottieplayerwasm_is_loaded(this.__wbg_ptr);
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
     * @param {number} no
     * @returns {boolean}
     */
    set_frame(no) {
        const ret = wasm.dotlottieplayerwasm_set_frame(this.__wbg_ptr, no);
        return ret !== 0;
    }
    /**
     * @param {number} speed
     */
    set_speed(speed) {
        wasm.dotlottieplayerwasm_set_speed(this.__wbg_ptr, speed);
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
    imports.wbg.__wbg_activeTexture_460f2e367e813fb0 = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_attachShader_3d4eb6af9e3e7bd1 = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_bindBufferRange_454f90f2b1781982 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.bindBufferRange(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_bindBuffer_309c9a6c21826cf5 = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindFramebuffer_e48e83c0f973944d = function(arg0, arg1, arg2) {
        arg0.bindFramebuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindRenderbuffer_55e205fecfddbb8c = function(arg0, arg1, arg2) {
        arg0.bindRenderbuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_a6e795697f49ebd1 = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindVertexArray_6b4b88581064b71f = function(arg0, arg1) {
        arg0.bindVertexArray(arg1);
    };
    imports.wbg.__wbg_blendEquation_c23d111ad6d268ff = function(arg0, arg1) {
        arg0.blendEquation(arg1 >>> 0);
    };
    imports.wbg.__wbg_blendFunc_c3b74be5a39c665f = function(arg0, arg1, arg2) {
        arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blitFramebuffer_7303bdff77cfe967 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.blitFramebuffer(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0);
    };
    imports.wbg.__wbg_bufferData_463178757784fcac = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_c97b729d560cf60d = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.bufferData(arg1 >>> 0, getArrayU8FromWasm0(arg2, arg3), arg4 >>> 0);
    };
    imports.wbg.__wbg_clearColor_d39507085c98a678 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_clearDepth_670d19914a501259 = function(arg0, arg1) {
        arg0.clearDepth(arg1);
    };
    imports.wbg.__wbg_clearStencil_4323424f1acca0df = function(arg0, arg1) {
        arg0.clearStencil(arg1);
    };
    imports.wbg.__wbg_clear_62b9037b892f6988 = function(arg0, arg1) {
        arg0.clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_colorMask_5e7c60b9c7a57a2e = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_compileShader_0ad770bbdbb9de21 = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_createBuffer_9886e84a67b68c89 = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createFramebuffer_c8d70ebc4858051e = function(arg0) {
        const ret = arg0.createFramebuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createProgram_da203074cafb1038 = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createRenderbuffer_d88aa9403faa38ea = function(arg0) {
        const ret = arg0.createRenderbuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createShader_983150fb1243ee56 = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_bfaa54c0cd22e367 = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createVertexArray_e435029ae2660efd = function(arg0) {
        const ret = arg0.createVertexArray();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_cullFace_187079e6e20a464d = function(arg0, arg1) {
        arg0.cullFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_deleteBuffer_7ed96e1bf7c02e87 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteFramebuffer_66853fb7101488cb = function(arg0, arg1) {
        arg0.deleteFramebuffer(arg1);
    };
    imports.wbg.__wbg_deleteProgram_71a133c6d053e272 = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteRenderbuffer_59f4369653485031 = function(arg0, arg1) {
        arg0.deleteRenderbuffer(arg1);
    };
    imports.wbg.__wbg_deleteShader_8d42f169deda58ac = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteTexture_bb82c9fec34372ba = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_deleteVertexArray_77fe73664a3332ae = function(arg0, arg1) {
        arg0.deleteVertexArray(arg1);
    };
    imports.wbg.__wbg_depthFunc_f34449ae87cc4e3e = function(arg0, arg1) {
        arg0.depthFunc(arg1 >>> 0);
    };
    imports.wbg.__wbg_depthMask_76688a8638b2f321 = function(arg0, arg1) {
        arg0.depthMask(arg1 !== 0);
    };
    imports.wbg.__wbg_disableVertexAttribArray_452cc9815fced7e4 = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_disable_2702df5b5da5dd21 = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_drawElements_65cb4b099bd7d4ac = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_enableVertexAttribArray_93c3d406a41ad6c7 = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_enable_51114837e05ee280 = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free_command_export(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_framebufferRenderbuffer_8b88592753b54715 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_framebufferTexture2D_ed855d0b097c557a = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_frontFace_289c9d7a8569c4f2 = function(arg0, arg1) {
        arg0.frontFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_getParameter_e3429f024018310f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getProgramInfoLog_a998105a680059db = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getProgramParameter_360f95ff07ac068d = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getShaderInfoLog_f59c3112acc6e039 = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getShaderParameter_511b5f929074fa31 = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getUniformBlockIndex_288fdc31528171ca = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformBlockIndex(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getUniformLocation_657a2b6d102bd126 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_invalidateFramebuffer_83f643d2a4936456 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.invalidateFramebuffer(arg1 >>> 0, arg2);
    }, arguments) };
    imports.wbg.__wbg_linkProgram_067ee06739bdde81 = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_78feb108b6472713 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_newwithlength_5a5efe313cfd59f1 = function(arg0) {
        const ret = new Float32Array(arg0 >>> 0);
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
    imports.wbg.__wbg_renderbufferStorageMultisample_13fbd5e58900c6fe = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_scissor_e917a332f67a5d30 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setindex_4e73afdcd9bb95cd = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_shaderSource_72d3e8597ef85b67 = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_stencilFuncSeparate_c1a6fa2005ca0aaf = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
    };
    imports.wbg.__wbg_stencilFunc_115c92784472048b = function(arg0, arg1, arg2, arg3) {
        arg0.stencilFunc(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_stencilOpSeparate_ff6683bbe3838ae6 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_stencilOp_b794f03cef95238e = function(arg0, arg1, arg2, arg3) {
        arg0.stencilOp(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_texImage2D_06281e677e3f6909 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm0(arg9, arg10));
    }, arguments) };
    imports.wbg.__wbg_texParameteri_8112b26b3c360b7e = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_uniform1f_dc009a0e7f7e5977 = function(arg0, arg1, arg2) {
        arg0.uniform1f(arg1, arg2);
    };
    imports.wbg.__wbg_uniform1i_ed95b6129dce4d84 = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform1iv_337c4a74e31ddc15 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform1iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniformBlockBinding_18117f4bda07115b = function(arg0, arg1, arg2, arg3) {
        arg0.uniformBlockBinding(arg1, arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_uniformMatrix3fv_3df529aab93cf902 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_useProgram_9b2660f7bb210471 = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_vertexAttrib4f_2a47cb701d647eeb = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.vertexAttrib4f(arg1 >>> 0, arg2, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_vertexAttribPointer_550dc34903e3d1ea = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_viewport_e615e98f676f2d39 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_1;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
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
    cachedInt32ArrayMemory0 = null;
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
