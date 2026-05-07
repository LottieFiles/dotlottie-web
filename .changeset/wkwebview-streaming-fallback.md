---
"@lottiefiles/dotlottie-web": patch
---

Fall back to buffered `WebAssembly.instantiate` when streaming instantiation fails on both CDN URLs. Some iOS WKWebView builds reject `WebAssembly.instantiateStreaming` for otherwise valid `Response` objects, which previously surfaced as `WASM loading failed from all sources.` and a blank canvas. The loader now retries by fetching the bytes itself and passing an `ArrayBuffer` to `init`, bypassing the streaming code path.
