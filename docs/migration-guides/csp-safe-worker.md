# Migrating to CSP-Safe Worker

This guide explains how to migrate from blob-based workers to static worker files for Content Security Policy (CSP) compliance.

## Overview

Starting from this version, `DotLottieWorker` and all framework worker components require a `workerUrl` parameter. This change removes blob-based worker instantiation to comply with strict Content Security Policy requirements that disallow `worker-src blob:`.

## Breaking Changes

* **`workerUrl` parameter is now required** for `DotLottieWorker` in `@lottiefiles/dotlottie-web`
* **`workerUrl` prop is now required** for all framework worker components:
  * React: `DotLottieWorkerReact`
  * Vue: `DotLottieWorker` composable
  * Svelte: `DotLottieWorker` component
  * Solid: `DotLottieWorker` primitive
  * Web Components: `dotlottie-worker-wc`
* Attempting to instantiate a worker without `workerUrl` will throw an error with helpful instructions

## Benefits

* ✅ Compliance with strict Content Security Policies
* ✅ No more `worker-src blob:` CSP violations
* ✅ Improved security posture
* ✅ Better control over worker file serving and caching
* ✅ Support for CDN hosting of worker files

## Migration Steps

### Step 1: Serve the Worker File

You need to make the worker file available to your application. Choose one of the following approaches:

#### Option A: Copy to Public Directory (Recommended for Production)

Copy the worker file to your public/static directory during your build process:

```bash
# Manual copy
cp node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-worker.js public/workers/

# Or add to your build script in package.json
{
  "scripts": {
    "postinstall": "mkdir -p public/workers && cp node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-worker.js public/workers/"
  }
}
```

#### Option B: Use Bundler Asset Handling (Recommended for Development)

Modern bundlers can handle the worker import automatically:

**Vite:**

```typescript
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';
```

**Webpack 5:**

```typescript
import workerUrl from '@lottiefiles/dotlottie-web/worker';
```

### Step 2: Update Your Code

Update your code to provide the `workerUrl` parameter:

#### Core JavaScript/TypeScript

**Before:**

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottieWorker({
  canvas: document.querySelector('canvas'),
  src: 'animation.lottie',
  autoplay: true,
});
```

**After (with static path):**

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottieWorker({
  canvas: document.querySelector('canvas'),
  src: 'animation.lottie',
  workerUrl: '/workers/dotlottie-worker.js', // Required
  autoplay: true,
});
```

**After (with bundler import):**

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

const dotLottie = new DotLottieWorker({
  canvas: document.querySelector('canvas'),
  src: 'animation.lottie',
  workerUrl, // Required
  autoplay: true,
});
```

#### React

**Before:**

```tsx
import { DotLottieWorkerReact } from '@lottiefiles/dotlottie-react';

function App() {
  return (
    <DotLottieWorkerReact
      src="animation.lottie"
      autoplay
      loop
    />
  );
}
```

**After:**

```tsx
import { DotLottieWorkerReact } from '@lottiefiles/dotlottie-react';
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

function App() {
  return (
    <DotLottieWorkerReact
      src="animation.lottie"
      workerUrl={workerUrl} // Required
      autoplay
      loop
    />
  );
}
```

#### Vue

**Before:**

```vue
<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref } from 'vue';
import { useDotLottieWorker } from '@lottiefiles/dotlottie-vue';

const canvasRef = ref(null);

useDotLottieWorker({
  canvas: canvasRef,
  src: 'animation.lottie',
  autoplay: true,
});
</script>
```

**After:**

```vue
<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref } from 'vue';
import { useDotLottieWorker } from '@lottiefiles/dotlottie-vue';
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

const canvasRef = ref(null);

useDotLottieWorker({
  canvas: canvasRef,
  src: 'animation.lottie',
  workerUrl, // Required
  autoplay: true,
});
</script>
```

#### Svelte

**Before:**

```svelte
<script>
  import { DotLottieWorker } from '@lottiefiles/dotlottie-svelte';

  let canvas;
</script>

<DotLottieWorker
  bind:canvas
  src="animation.lottie"
  autoplay={true}
  loop={true}
/>
```

**After:**

```svelte
<script>
  import { DotLottieWorker } from '@lottiefiles/dotlottie-svelte';
  import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

  let canvas;
</script>

<DotLottieWorker
  bind:canvas
  src="animation.lottie"
  {workerUrl}
  autoplay={true}
  loop={true}
/>
```

#### Solid

**Before:**

```tsx
import { DotLottieWorker } from '@lottiefiles/dotlottie-solid';

function App() {
  let canvas;

  createDotLottieWorker({
    canvas,
    src: 'animation.lottie',
    autoplay: true,
  });

  return <canvas ref={canvas} />;
}
```

**After:**

```tsx
import { DotLottieWorker } from '@lottiefiles/dotlottie-solid';
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

function App() {
  let canvas;

  createDotLottieWorker({
    canvas,
    src: 'animation.lottie',
    workerUrl, // Required
    autoplay: true,
  });

  return <canvas ref={canvas} />;
}
```

#### Web Components

**Before:**

```html
<dotlottie-worker-wc
  src="animation.lottie"
  autoplay
  loop>
</dotlottie-worker-wc>
```

**After:**

```html
<dotlottie-worker-wc
  src="animation.lottie"
  workerUrl="/workers/dotlottie-worker.js"
  autoplay
  loop>
</dotlottie-worker-wc>
```

### Step 3: Update Content Security Policy

Update your CSP headers to allow workers from your own origin:

**Before (unsafe):**

```
Content-Security-Policy: worker-src blob:;
```

**After (secure):**

```
Content-Security-Policy: worker-src 'self';
```

**For CDN hosting:**

```
Content-Security-Policy: worker-src 'self' https://cdn.example.com;
```

**For stricter policies (recommended):**

```
Content-Security-Policy:
  default-src 'self';
  worker-src 'self';
  script-src 'self';
  connect-src 'self' https://lottie.host;
```

## Troubleshooting

### Error: "workerUrl is required for CSP-compliant worker initialization"

This error means you're trying to create a `DotLottieWorker` instance without providing the required `workerUrl` parameter.

**Solution:** Add the `workerUrl` parameter to your configuration:

```typescript
const dotLottie = new DotLottieWorker({
  canvas,
  src: 'animation.lottie',
  workerUrl: '/workers/dotlottie-worker.js', // Add this
});
```

### Worker file not found (404 error)

This means the worker file is not being served at the path you specified.

**Solution:** Verify the worker file exists at the path:

1. Check your public directory contains the worker file
2. Verify the path in your `workerUrl` matches the file location
3. For bundler imports, ensure your bundler configuration supports asset imports

### CSP violations still occurring

This means your Content Security Policy still has restrictions.

**Solution:** Update your CSP headers to allow workers from your domain:

```
Content-Security-Policy: worker-src 'self';
```

### Worker file is too large

The worker file is approximately 500KB minified. If this is a concern:

**Solution:** Consider these optimizations:

1. Serve the worker file with gzip compression (reduces to \~150KB)
2. Use a CDN with good caching headers
3. Implement code splitting in your application
4. Only load the worker component when needed (lazy loading)

## Frequently Asked Questions

### Why was this change necessary?

Strict Content Security Policies (CSP) are a critical security feature that helps prevent XSS attacks. The old blob-based worker approach required `worker-src blob:` in the CSP, which is considered unsafe. This change enables full CSP compliance.

### Can I still use the old approach?

No, the blob-based worker instantiation has been removed. The `workerUrl` parameter is now required for all worker-based components.

### Do I need to change my non-worker code?

No, if you're using `DotLottie` (without worker), no changes are required. This only affects `DotLottieWorker` and framework worker components.

### Can I host the worker on a CDN?

Yes! You can host the worker file on a CDN and reference it via URL:

```typescript
const dotLottie = new DotLottieWorker({
  canvas,
  src: 'animation.lottie',
  workerUrl: 'https://cdn.example.com/dotlottie-worker.js',
});
```

Make sure to update your CSP to allow the CDN origin.

### What about cross-origin worker restrictions?

Workers must be served from the same origin as your application, or from an origin allowed by your CSP `worker-src` directive. If hosting on a CDN, ensure CORS headers are properly configured.

## Additional Resources

* [Content Security Policy (CSP) Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
* [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
* [DotLottie Web Documentation](https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/)

## Getting Help

If you encounter issues during migration:

1. Check the error message carefully - it often contains helpful hints
2. Review the code examples in this guide
3. Check the README files in each package for framework-specific examples
4. Open an issue on [GitHub](https://github.com/LottieFiles/dotlottie-web/issues) with:
   * Your framework and version
   * The error message
   * Your code snippet
   * Your CSP configuration (if relevant)
