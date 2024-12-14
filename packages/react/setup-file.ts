// eslint-disable-next-line import/no-unassigned-import
import 'vitest-browser-react';
import { setWasmUrl } from './src';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const wasmUrl = new URL('../web/src/core/dotlottie-player.wasm?url', import.meta.url).href;

setWasmUrl(wasmUrl);
