// The workspace build of dotlottie-web, served by this app. In dev the Vite
// server transforms the TS module on demand; in prod it's a stable-named entry
// chunk (see vite.config.ts).
const LOCAL_DOTLOTTIE_MODULE_URL = import.meta.env.DEV
  ? '/src/playground/local-dotlottie.ts'
  : `${import.meta.env.BASE_URL}playground-local-dotlottie.js?v=${__PLAYGROUND_RUNTIME_VERSION__}`;

// <head> snippet for preview/embed srcdocs: maps dotlottie-web imports to the
// workspace build and exposes its exports as globals before user code runs.
export const PLAYGROUND_RUNTIME_HEAD = `<script type="importmap">
    {
      "imports": {
        "@lottiefiles/dotlottie-web": "${LOCAL_DOTLOTTIE_MODULE_URL}",
        "https://esm.sh/@lottiefiles/dotlottie-web": "${LOCAL_DOTLOTTIE_MODULE_URL}"
      }
    }
  </script>
  <script type="module">
    // Expose the local dotlottie-web build globally — example code can use
    // DotLottie (etc.) directly, no import needed. Module scripts run in
    // document order, so globals are set before user code executes.
    import * as dotLottieWeb from '@lottiefiles/dotlottie-web';
    for (const [key, value] of Object.entries(dotLottieWeb)) {
      if (!(key in window)) window[key] = value;
    }
  </script>`;
