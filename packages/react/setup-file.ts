/* eslint-disable node/no-unsupported-features/node-builtins */
// eslint-disable-next-line import/no-unassigned-import
import 'vitest-browser-react';
import { setWasmUrl } from './src';
import { setWasmUrl as setWebGLWasmUrl } from './src/webgl';
import { setWasmUrl as setWebGPUWasmUrl } from './src/webgpu';

const wasmUrl = new URL('../web/src/software/wasm/dotlottie-player.wasm?url', import.meta.url).href;
const webGLWasmUrl = new URL('../web/src/webgl/wasm/dotlottie-player.wasm?url', import.meta.url).href;
const webGPUWasmUrl = new URL('../web/src/webgpu/wasm/dotlottie-player.wasm?url', import.meta.url).href;

setWasmUrl(wasmUrl);
setWebGLWasmUrl(webGLWasmUrl);
setWebGPUWasmUrl(webGPUWasmUrl);
