import { DotLottie } from '@lottiefiles/dotlottie-web';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const wasmUrl = new URL('../web/src/core/dotlottie-player.wasm?url', import.meta.url).href;

DotLottie.setWasmUrl(wasmUrl);
