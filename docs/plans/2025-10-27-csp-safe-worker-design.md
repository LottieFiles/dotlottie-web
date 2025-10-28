# CSP-Safe Worker Implementation Design

**Date:** 2025-10-27
**Issue:** [#579](https://github.com/LottieFiles/dotlottie-web/issues/579)
**Status:** Approved Design

## Problem Statement

The current `DotLottieWorker` implementation violates Content Security Policy (CSP) requirements by using blob URLs to instantiate workers. This requires users to add `worker-src: blob:` to their CSP policy, which is equivalent to `unsafe-eval` per W3C specs and is blocked by many security teams.

### Current Implementation

* Worker code is inlined as a Uint8Array via `plugin-inline-worker.cjs`
* Worker is instantiated using `new Worker(URL.createObjectURL(blob))`
* Requires CSP: `worker-src: blob:`

### Security Impact

* Blob workers are equivalent to `unsafe-eval` in CSP context
* Many enterprise security policies forbid this
* Blocks adoption for security-conscious organizations

## Design Decisions

### Architecture Choice: Instance Config Option

**Selected approach:** Add `workerUrl` parameter to constructor config

**Rationale:**

* Simple and explicit per-instance configuration
* Allows different worker URLs for different instances if needed
* Follows common pattern in web worker libraries
* Clear migration path for users

**Alternatives considered:**

1. Global static method (like `setWasmUrl`) - less flexible
2. Bundler-native approach (pass Worker instance) - too complex, inconsistent across bundlers

### Distribution Strategy: Separate File

**Selected approach:** Build and distribute standalone worker file

**Rationale:**

* Users can serve worker file from their own domain
* Compatible with all bundlers
* Enables proper CSP configuration with specific origins
* Standard practice for worker libraries

**Build output:**

* `dist/dotlottie-worker.js` (IIFE format for direct Worker consumption)
* `dist/dotlottie-worker.js.map` (source map)

## Architecture

### Build System Changes

#### 1. Remove Blob-Based Plugin

**File to delete:** `packages/web/esbuild-plugins/plugin-inline-worker.cjs`

This plugin currently:

* Bundles worker code at build time
* Converts to Uint8Array
* Generates InlineWorker class that creates blob URLs

#### 2. Add Standalone Worker Build

**Update:** `packages/web/tsup.config.cjs`

Add second build configuration:

```javascript
module.exports = defineConfig([
  // Main bundle (existing)
  {
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: ['esm', 'cjs'],
    // ... existing config
    esbuildPlugins: [
      // REMOVE: PluginInlineWorker()
      replace({
        __PACKAGE_VERSION__: pkg.version,
        __PACKAGE_NAME__: pkg.name,
      }),
    ],
  },
  // Worker bundle (NEW)
  {
    entry: ['./src/worker/dotlottie.worker.ts'],
    outDir: './dist',
    format: ['iife'],
    name: 'DotLottieWorker',
    minify: true,
    sourcemap: true,
    platform: 'browser',
    target: ['es2020'],
  }
]);
```

#### 3. Update Package Distribution

**Update:** `packages/web/package.json`

```json
{
  "files": [
    "dist"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./worker": "./dist/dotlottie-worker.js"
  }
}
```

### Core API Changes

#### 1. Config Type Extension

**File:** `packages/web/src/types.ts`

```typescript
export interface Config {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  workerUrl: string;  // NEW: Required URL to worker file
  src?: string;
  // ... existing fields
}
```

#### 2. WorkerManager Updates

**File:** `packages/web/src/worker/worker-manager.ts`

```typescript
// REMOVE: import DotLottieWebWorker from './dotlottie.worker?worker&inline';

export class WorkerManager {
  private readonly _workers = new Map<string, Worker>();
  private readonly _animationWorkerMap = new Map<string, string>();

  // MODIFIED: Accept workerUrl parameter
  public getWorker(workerId: string, workerUrl: string): Worker {
    if (!this._workers.has(workerId)) {
      this._workers.set(workerId, new Worker(workerUrl));
    }
    return this._workers.get(workerId) as Worker;
  }

  // ... rest unchanged
}
```

#### 3. DotLottieWorker Constructor

**File:** `packages/web/src/worker/dotlottie.ts` (line 118)

```typescript
public constructor(config: Config & { workerId?: string }) {
  // NEW: Validate workerUrl
  if (!config.workerUrl) {
    throw new Error(
      'workerUrl is required. Please provide the path to dotlottie-worker.js. ' +
      'Example: { workerUrl: "/workers/dotlottie-worker.js" }'
    );
  }

  this._canvas = config.canvas;
  this._id = `dotlottie-${generateUniqueId()}`;
  const workerId = config.workerId || 'defaultWorker';

  // MODIFIED: Pass workerUrl to getWorker
  this._worker = DotLottieWorker._workerManager.getWorker(
    workerId,
    config.workerUrl
  );

  // ... rest unchanged
}
```

### Framework Wrapper Updates

All framework wrappers must be updated to accept and pass through `workerUrl`.

#### React (`packages/react/`)

**Files to update:**

* `src/use-dotlottie-worker.ts`
* Type definitions

```typescript
interface DotLottieWorkerConfig {
  workerUrl: string;  // NEW required prop
  canvas: HTMLCanvasElement | null;
  autoplay?: boolean;
  // ... existing props
}

export function useDotLottieWorker(config: DotLottieWorkerConfig) {
  // Pass workerUrl to core
  dotLottieWorkerInstance = new DotLottieWorker({
    canvas,
    workerUrl: config.workerUrl,
    // ... other config
  });
}
```

#### Vue (`packages/vue/`)

**Files to update:**

* Composables
* Component prop definitions

```typescript
const props = defineProps<{
  workerUrl: string;  // NEW required prop
  src?: string;
  // ... existing props
}>();
```

#### Solid (`packages/solid/`)

**Files to update:**

* Primitives and components

#### Svelte (`packages/svelte/`)

**Files to update:**

* Component scripts

```svelte
<script lang="ts">
  export let workerUrl: string;  // NEW required prop
  export let src: string | undefined = undefined;
  // ... existing props
</script>
```

#### Web Components (`packages/wc/`)

**Files to update:**

* `src/dotlottie-worker-wc.ts`

```typescript
@property({ type: String })
workerUrl: string = '';  // NEW required attribute

connectedCallback() {
  if (!this.workerUrl) {
    throw new Error('workerUrl attribute is required');
  }
  // ...
}
```

## Migration Guide

### For Library Users

#### 1. Serve Worker File

**Option A: Copy to public directory**

```bash
# Copy worker to public assets
cp node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-worker.js public/workers/
```

**Option B: Use bundler's static assets**

Vite:

```typescript
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';
```

Webpack:

```typescript
import workerUrl from 'file-loader!@lottiefiles/dotlottie-web/dist/dotlottie-worker.js';
```

#### 2. Update Code

**Before:**

```typescript
new DotLottieWorker({
  canvas: myCanvas,
  src: 'animation.lottie'
});
```

**After:**

```typescript
new DotLottieWorker({
  canvas: myCanvas,
  src: 'animation.lottie',
  workerUrl: '/workers/dotlottie-worker.js'  // NEW required
});
```

**React example:**

```tsx
<DotLottie
  workerUrl="/workers/dotlottie-worker.js"
  src="animation.lottie"
  autoplay
/>
```

#### 3. Update CSP Policy

**Before:**

```
Content-Security-Policy: worker-src: blob:
```

**After:**

```
Content-Security-Policy: worker-src: 'self'
```

Or for CDN usage:

```
Content-Security-Policy: worker-src: 'self' https://cdn.example.com
```

### Breaking Changes

This is a **MAJOR version change** (semver BREAKING):

1. `workerUrl` is now required in config
2. Blob-based worker instantiation removed
3. All framework wrappers require `workerUrl` prop
4. Plugin `plugin-inline-worker.cjs` removed

### Version Bump

* Core package: `@lottiefiles/dotlottie-web` → next major version
* All framework packages → next major version (peer dependency update)

## Testing Strategy

### Unit Tests

1. **WorkerManager tests:**
   * Test worker creation with URL
   * Test worker reuse for same workerId
   * Test error handling for invalid URLs

2. **DotLottieWorker tests:**
   * Test constructor throws without workerUrl
   * Test worker initialization with valid URL
   * Test existing functionality still works

### Integration Tests

1. **Browser tests:**
   * Test worker loads from static URL
   * Test worker loads from blob URL (should fail)
   * Test CSP compliance with `worker-src: 'self'`

2. **Framework tests:**
   * Update all framework wrapper tests to include workerUrl
   * Test error messages for missing workerUrl

### CSP Validation

Create test environment with strict CSP:

```html
<meta http-equiv="Content-Security-Policy"
      content="worker-src 'self'; script-src 'self'">
```

Verify:

* Worker loads successfully
* No CSP violations in console
* Animations render correctly

## Documentation Updates

### Files to Update

1. **README.md** - Add workerUrl to quick start examples
2. **API documentation** - Document new required parameter
3. **Migration guide** - Create dedicated migration document
4. **Examples** - Update all example projects
5. **Framework docs** - Update React/Vue/Svelte/Solid docs

### Example Documentation

#### Bundler-Specific Guides

**Vite:**

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'workers/[name].[hash][extname]'
      }
    }
  }
}

// Usage
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';
new DotLottieWorker({ canvas, workerUrl });
```

**Next.js:**

```typescript
// public/workers/dotlottie-worker.js (copy manually)

// Usage
new DotLottieWorker({
  canvas,
  workerUrl: '/workers/dotlottie-worker.js'
});
```

**Webpack:**

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        type: 'asset/resource',
        generator: {
          filename: 'workers/[name][ext]'
        }
      }
    ]
  }
}
```

## Implementation Checklist

### Core Package (`packages/web/`)

* [ ] Remove `esbuild-plugins/plugin-inline-worker.cjs`
* [ ] Update `tsup.config.cjs` with worker build config
* [ ] Update `package.json` exports
* [ ] Add `workerUrl` to Config type
* [ ] Update WorkerManager.getWorker() signature
* [ ] Update DotLottieWorker constructor
* [ ] Remove `?worker&inline` import syntax
* [ ] Add validation and error messages
* [ ] Update unit tests
* [ ] Add CSP integration tests

### Framework Wrappers

* [ ] React: Add workerUrl prop
* [ ] Vue: Add workerUrl prop
* [ ] Solid: Add workerUrl prop
* [ ] Svelte: Add workerUrl prop
* [ ] Web Components: Add workerUrl attribute
* [ ] Update all framework tests
* [ ] Update framework examples

### Documentation

* [ ] Create migration guide
* [ ] Update main README
* [ ] Update API documentation
* [ ] Add bundler-specific guides
* [ ] Update all examples
* [ ] Update framework-specific docs
* [ ] Add CSP configuration guide

### Release

* [ ] Bump major version (all packages)
* [ ] Update CHANGELOG with breaking changes
* [ ] Create GitHub release notes
* [ ] Update npm package descriptions
* [ ] Communicate breaking change to users

## Success Criteria

1. ✅ Worker loads without blob URLs
2. ✅ No CSP violations with `worker-src: 'self'`
3. ✅ All existing functionality preserved
4. ✅ Clear error messages for missing workerUrl
5. ✅ All framework wrappers updated
6. ✅ Comprehensive migration documentation
7. ✅ All tests passing
8. ✅ Examples updated and working

## Risks and Mitigation

### Risk: User Confusion

**Risk:** Users may not understand how to serve the worker file.

**Mitigation:**

* Comprehensive bundler-specific guides
* Clear error messages with examples
* Multiple example implementations
* Copy-paste ready code snippets

### Risk: Breaking Change Impact

**Risk:** Existing users' applications will break.

**Mitigation:**

* Major version bump (clear signal)
* Detailed migration guide
* Helpful error messages
* Blog post explaining changes
* Support window for questions

### Risk: Bundler Compatibility

**Risk:** Worker file handling varies across bundlers.

**Mitigation:**

* Test with major bundlers (Vite, Webpack, Rollup, esbuild)
* Document each bundler's approach
* Provide fallback to simple static file approach
* Offer multiple distribution methods

## Future Enhancements

### Backward Compatibility Layer (Optional)

If needed, could add deprecation period:

```typescript
public constructor(config: Config & { workerId?: string }) {
  if (!config.workerUrl) {
    console.warn(
      'DEPRECATED: workerUrl will be required in next major version. ' +
      'Falling back to blob-based worker (CSP unsafe).'
    );
    // Fallback to old blob approach
  }
}
```

**Decision:** Not implementing - clean break is better than maintaining two code paths.

### Auto-Detection (Future)

Could explore auto-detecting worker URL based on package location, but complexity outweighs benefit.

## References

* [Issue #579](https://github.com/LottieFiles/dotlottie-web/issues/579)
* [W3C CSP Spec - Blob URLs](https://www.w3.org/TR/CSP2/#source-list-guid-matching)
* [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
* [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
