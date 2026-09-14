export * from './dotlottie-wc';
export * from './dotlottie-worker-wc';
// Explicit: the per-entry setWasmUrl/setWorkerUrl exports conflict under `export *`; these set both players.
export { setWasmUrl } from './set-wasm-url';
export { setWorkerUrl } from './set-worker-url';
