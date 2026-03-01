import 'vitest-browser-svelte';
import { setWasmUrl } from './src/lib/index.js';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const wasmUrl = new URL('../web/src/core/dotlottie-player.wasm?url', import.meta.url).href;

setWasmUrl(wasmUrl);
