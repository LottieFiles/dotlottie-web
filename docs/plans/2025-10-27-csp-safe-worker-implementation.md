# CSP-Safe Worker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace blob-based worker instantiation with static worker file distribution to comply with strict Content Security Policy requirements.

**Architecture:** Remove `plugin-inline-worker.cjs` that creates blob URLs, build worker as separate IIFE bundle in `dist/dotlottie-worker.js`, add required `workerUrl` config parameter to all DotLottieWorker instances, update all framework wrappers to pass through workerUrl.

**Tech Stack:** TypeScript, tsup, pnpm, Vite, Turbo, Vitest

**Related Design Doc:** `docs/plans/2025-10-27-csp-safe-worker-design.md`

---

## Task 1: Update Build Configuration for Standalone Worker

**Goal:** Configure tsup to build worker as separate IIFE bundle instead of inlining as blob.

**Files:**

* Modify: `packages/web/tsup.config.cjs`
* Delete: `packages/web/esbuild-plugins/plugin-inline-worker.cjs`

**Step 1: Update tsup config to build worker separately**

Edit `packages/web/tsup.config.cjs`:

```javascript
const fs = require('fs');
const path = require('path');

const { replace } = require('esbuild-plugin-replace');
const { defineConfig } = require('tsup');

const pkg = require('./package.json');

function copyFileSync(src, dest) {
  const readStream = fs.createReadStream(src);
  const writeStream = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    readStream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('close', resolve);
    readStream.pipe(writeStream);
  });
}

module.exports = defineConfig([
  // Main bundle
  {
    bundle: true,
    metafile: false,
    splitting: false,
    treeshake: true,
    clean: true,
    dts: true,
    minify: true,
    sourcemap: true,
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: ['esm', 'cjs'],
    platform: 'neutral',
    target: ['es2020', 'node18'],
    tsconfig: 'tsconfig.build.json',
    esbuildPlugins: [
      // REMOVED: PluginInlineWorker()
      replace({
        __PACKAGE_VERSION__: pkg.version,
        __PACKAGE_NAME__: pkg.name,
      }),
    ],
    onSuccess: async () => {
      await copyFileSync(
        path.resolve(__dirname, 'src/core/dotlottie-player.wasm'),
        path.resolve(__dirname, 'dist/dotlottie-player.wasm'),
      );
    },
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
    bundle: true,
    treeshake: true,
  }
]);
```

**Step 2: Delete the inline worker plugin**

```bash
rm packages/web/esbuild-plugins/plugin-inline-worker.cjs
```

**Step 3: Test build**

```bash
cd packages/web
pnpm run build
```

Expected output:

* `dist/dotlottie-worker.js` should be created
* `dist/dotlottie-worker.js.map` should be created
* Main bundle should still build successfully

**Step 4: Verify worker file exists**

```bash
ls -lh packages/web/dist/dotlottie-worker.js
```

Expected: File exists and is \~500KB

**Step 5: Commit**

```bash
git add packages/web/tsup.config.cjs
git rm packages/web/esbuild-plugins/plugin-inline-worker.cjs
git add packages/web/dist/dotlottie-worker.js packages/web/dist/dotlottie-worker.js.map
git commit -m "build: configure standalone worker bundle

- Remove blob-based inline worker plugin
- Add separate IIFE build for worker file
- Output to dist/dotlottie-worker.js for CSP compliance

Related to #579"
```

---

## Task 2: Update Package Exports

**Goal:** Add worker file to package exports and files array for proper distribution.

**Files:**

* Modify: `packages/web/package.json`

**Step 1: Update package.json exports**

Edit `packages/web/package.json`, update the `exports` field:

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./worker": "./dist/dotlottie-worker.js",
    "./package.json": "./package.json"
  }
}
```

**Step 2: Verify package.json is valid**

```bash
cd packages/web
pnpm run build
```

Expected: Build succeeds

**Step 3: Commit**

```bash
git add packages/web/package.json
git commit -m "build: add worker to package exports

Expose worker file at @lottiefiles/dotlottie-web/worker
for users to import and serve statically.

Related to #579"
```

---

## Task 3: Add workerUrl to Config Type

**Goal:** Add required `workerUrl` parameter to Config interface.

**Files:**

* Modify: `packages/web/src/types.ts`

**Step 1: Locate Config interface**

The Config interface should be around line 100-200 in `packages/web/src/types.ts`.

**Step 2: Add workerUrl to Config**

Find the `Config` interface and add `workerUrl` as a required field:

```typescript
export interface Config {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  src?: string;
  data?: string | ArrayBuffer | Record<string, unknown>;
  autoplay?: boolean;
  loop?: boolean;
  mode?: Mode;
  speed?: number;
  segment?: [number, number];
  backgroundColor?: string;
  renderConfig?: RenderConfig;
  useFrameInterpolation?: boolean;
  marker?: string;
  layout?: Layout;
  // Add workerUrl field - REQUIRED for DotLottieWorker
  workerUrl?: string; // Optional in base Config since DotLottie doesn't use it
}
```

**Step 3: Build to check for type errors**

```bash
cd packages/web
pnpm run type-check
```

Expected: No type errors

**Step 4: Commit**

```bash
git add packages/web/src/types.ts
git commit -m "feat: add workerUrl to Config type

Add optional workerUrl field to support static worker loading.
Required for DotLottieWorker, optional for DotLottie.

Related to #579"
```

---

## Task 4: Update WorkerManager to Accept workerUrl

**Goal:** Modify WorkerManager to instantiate workers from URLs instead of inline class.

**Files:**

* Modify: `packages/web/src/worker/worker-manager.ts`

**Step 1: Remove inline worker import**

Edit `packages/web/src/worker/worker-manager.ts`, line 2:

Remove:

```typescript
import DotLottieWebWorker from './dotlottie.worker?worker&inline';
```

**Step 2: Update getWorker method signature**

Replace the `getWorker` method:

```typescript
export class WorkerManager {
  private readonly _workers = new Map<string, Worker>();

  private readonly _animationWorkerMap = new Map<string, string>();

  public getWorker(workerId: string, workerUrl: string): Worker {
    if (!this._workers.has(workerId)) {
      this._workers.set(workerId, new Worker(workerUrl));
    }

    return this._workers.get(workerId) as Worker;
  }

  public assignAnimationToWorker(animationId: string, workerId: string): void {
    this._animationWorkerMap.set(animationId, workerId);
  }

  public unassignAnimationFromWorker(animationId: string): void {
    this._animationWorkerMap.delete(animationId);
  }

  public sendMessage(workerId: string, message: RpcRequest<keyof MethodParamsMap>, transfer?: Transferable[]): void {
    // Note: This assumes workerUrl was already provided when worker was created
    // This method doesn't need changes as it uses the already-created worker
    const worker = this._workers.get(workerId);
    if (worker) {
      worker.postMessage(message, transfer || []);
    }
  }

  public terminateWorker(workerId: string): void {
    const worker = this._workers.get(workerId);

    if (worker) {
      worker.terminate();
      this._workers.delete(workerId);
    }
  }
}
```

**Step 3: Type check**

```bash
cd packages/web
pnpm run type-check
```

Expected: Type errors in files that call `getWorker()` (we'll fix those next)

**Step 4: Commit**

```bash
git add packages/web/src/worker/worker-manager.ts
git commit -m "refactor: accept workerUrl in WorkerManager

Update getWorker to accept workerUrl parameter instead of
using blob-based inline worker import.

Related to #579"
```

---

## Task 5: Update DotLottieWorker Constructor

**Goal:** Make workerUrl required and pass it to WorkerManager.

**Files:**

* Modify: `packages/web/src/worker/dotlottie.ts`

**Step 1: Update constructor signature and validation**

Edit `packages/web/src/worker/dotlottie.ts`, around line 118 in the constructor:

```typescript
public constructor(config: Config & { workerId?: string; workerUrl: string }) {
  // Validate workerUrl is provided
  if (!config.workerUrl) {
    throw new Error(
      'workerUrl is required for CSP-compliant worker initialization. ' +
      'Please provide the path to dotlottie-worker.js. ' +
      'Example: { workerUrl: "/workers/dotlottie-worker.js" } ' +
      'or import from package: import workerUrl from "@lottiefiles/dotlottie-web/worker"'
    );
  }

  this._canvas = config.canvas;

  this._id = `dotlottie-${generateUniqueId()}`;
  const workerId = config.workerId || 'defaultWorker';

  // Pass workerUrl to getWorker
  this._worker = DotLottieWorker._workerManager.getWorker(workerId, config.workerUrl);

  DotLottieWorker._workerManager.assignAnimationToWorker(this._id, workerId);

  if (DotLottieWorker._wasmUrl) {
    this._sendMessage('setWasmUrl', { url: DotLottieWorker._wasmUrl });
  }

  this._create({
    ...config,
    renderConfig: {
      ...config.renderConfig,
      devicePixelRatio: config.renderConfig?.devicePixelRatio || getDefaultDPR(),
      freezeOnOffscreen: config.renderConfig?.freezeOnOffscreen ?? true,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  this._worker.addEventListener('message', this._handleWorkerEvent.bind(this));
}
```

**Step 2: Type check**

```bash
cd packages/web
pnpm run type-check
```

Expected: Type errors in test files and framework wrappers (will fix next)

**Step 3: Commit**

```bash
git add packages/web/src/worker/dotlottie.ts
git commit -m "feat: require workerUrl in DotLottieWorker constructor

Make workerUrl required with helpful error message.
Pass workerUrl to WorkerManager for URL-based worker creation.

BREAKING CHANGE: workerUrl is now required for DotLottieWorker

Related to #579"
```

---

## Task 6: Update DotLottieWorker Tests

**Goal:** Update tests to provide workerUrl parameter.

**Files:**

* Modify: `packages/web/tests/dotlottie.test.ts`

**Step 1: Add test worker URL constant**

At the top of `packages/web/tests/dotlottie.test.ts`, after imports, add:

```typescript
// Mock worker URL for tests
const TEST_WORKER_URL = '/dist/dotlottie-worker.js';
```

**Step 2: Find all DotLottieWorker instantiations**

Search for `new DotLottieWorker` in the test file and add `workerUrl` to each:

Example transformation:

```typescript
// Before
const player = new DotLottieWorker({
  canvas: canvas,
  src: 'https://example.com/animation.lottie',
});

// After
const player = new DotLottieWorker({
  canvas: canvas,
  src: 'https://example.com/animation.lottie',
  workerUrl: TEST_WORKER_URL,
});
```

**Step 3: Add test for missing workerUrl**

Add a new test in the 'DotLottieWorker' describe block:

```typescript
describe('DotLottieWorker', () => {
  // ... existing tests

  it('throws error when workerUrl is not provided', () => {
    const canvas = document.createElement('canvas');

    expect(() => {
      // @ts-expect-error Testing runtime error
      new DotLottieWorker({
        canvas: canvas,
        src: 'https://example.com/animation.lottie',
      });
    }).toThrow('workerUrl is required');
  });

  // ... rest of tests
});
```

**Step 4: Run tests**

```bash
cd packages/web
pnpm run test
```

Expected: Tests should pass (may have some unrelated failures)

**Step 5: Commit**

```bash
git add packages/web/tests/dotlottie.test.ts
git commit -m "test: update DotLottieWorker tests for workerUrl

Add workerUrl parameter to all test instantiations.
Add test for missing workerUrl validation.

Related to #579"
```

---

## Task 7: Update React Package

**Goal:** Add workerUrl prop to React hooks and components.

**Files:**

* Modify: `packages/react/src/use-dotlottie-worker.ts`

**Step 1: Add workerUrl to hook config type**

Edit `packages/react/src/use-dotlottie-worker.ts`:

```typescript
export interface UseDotLottieWorkerConfig
  extends Omit<Config, 'canvas'> {
  canvas: RefObject<HTMLCanvasElement> | null;
  workerId?: string;
  workerUrl: string; // NEW: Required field
}
```

**Step 2: Pass workerUrl to DotLottieWorker**

In the same file, find where `new DotLottieWorker` is called and ensure workerUrl is passed:

```typescript
dotLottieWorkerInstance = new DotLottieWorker({
  canvas,
  workerUrl: config.workerUrl, // NEW: Pass through workerUrl
  autoplay: config.autoplay,
  loop: config.loop,
  mode: config.mode,
  speed: config.speed,
  data: config.data,
  src: config.src,
  segment: config.segment,
  backgroundColor: config.backgroundColor,
  renderConfig: config.renderConfig,
  useFrameInterpolation: config.useFrameInterpolation,
  marker: config.marker,
  layout: config.layout,
  workerId: config.workerId,
});
```

**Step 3: Build package**

```bash
cd packages/react
pnpm run build
```

Expected: Build succeeds

**Step 4: Update React tests**

Edit `packages/react/__tests__/use-dotlottie-worker.test.tsx`, add workerUrl to test configs:

```typescript
const TEST_WORKER_URL = '/dist/dotlottie-worker.js';

// Update all test configs to include workerUrl
const config = {
  workerUrl: TEST_WORKER_URL,
  // ... rest of config
};
```

**Step 5: Run tests**

```bash
cd packages/react
pnpm run test
```

Expected: Tests pass

**Step 6: Commit**

```bash
git add packages/react/src/use-dotlottie-worker.ts packages/react/__tests__/
git commit -m "feat(react): add required workerUrl prop

Add workerUrl to UseDotLottieWorkerConfig and pass through
to DotLottieWorker constructor.

BREAKING CHANGE: workerUrl prop is now required

Related to #579"
```

---

## Task 8: Update Vue Package

**Goal:** Add workerUrl prop to Vue composables.

**Files:**

* Modify: `packages/vue/src/use-dotlottie-worker.ts`

**Step 1: Add workerUrl to config type**

Edit `packages/vue/src/use-dotlottie-worker.ts`:

```typescript
export interface UseDotLottieWorkerConfig extends Omit<Config, 'canvas'> {
  canvas: Ref<HTMLCanvasElement | null>;
  workerId?: string;
  workerUrl: string; // NEW: Required field
}
```

**Step 2: Pass workerUrl to DotLottieWorker**

Find the `new DotLottieWorker` instantiation and add workerUrl:

```typescript
dotLottieInstance.value = new DotLottieWorker({
  canvas: config.canvas.value,
  workerUrl: config.workerUrl, // NEW: Pass through
  // ... rest of config
});
```

**Step 3: Build package**

```bash
cd packages/vue
pnpm run build
```

Expected: Build succeeds

**Step 4: Commit**

```bash
git add packages/vue/src/use-dotlottie-worker.ts
git commit -m "feat(vue): add required workerUrl prop

Add workerUrl to UseDotLottieWorkerConfig and pass through
to DotLottieWorker constructor.

BREAKING CHANGE: workerUrl prop is now required

Related to #579"
```

---

## Task 9: Update Solid Package

**Goal:** Add workerUrl prop to Solid primitives.

**Files:**

* Modify: `packages/solid/src/primitives.ts`

**Step 1: Add workerUrl to config type**

Edit `packages/solid/src/primitives.ts`, find the config interface:

```typescript
export interface DotLottieWorkerConfig extends Omit<Config, 'canvas'> {
  canvas: HTMLCanvasElement | null;
  workerId?: string;
  workerUrl: string; // NEW: Required field
}
```

**Step 2: Pass workerUrl to DotLottieWorker**

Find where `new DotLottieWorker` is called:

```typescript
const instance = new DotLottieWorker({
  canvas: config.canvas,
  workerUrl: config.workerUrl, // NEW: Pass through
  // ... rest of config
});
```

**Step 3: Build package**

```bash
cd packages/solid
pnpm run build
```

Expected: Build succeeds

**Step 4: Commit**

```bash
git add packages/solid/src/primitives.ts
git commit -m "feat(solid): add required workerUrl prop

Add workerUrl to DotLottieWorkerConfig and pass through
to DotLottieWorker constructor.

BREAKING CHANGE: workerUrl prop is now required

Related to #579"
```

---

## Task 10: Update Svelte Package

**Goal:** Add workerUrl prop to Svelte components.

**Files:**

* Modify: `packages/svelte/src/lib/DotLottieWorker.svelte`

**Step 1: Add workerUrl prop**

Edit `packages/svelte/src/lib/DotLottieWorker.svelte`:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
  import type { Config } from '@lottiefiles/dotlottie-web';

  // NEW: Required prop
  export let workerUrl: string;

  // Existing props
  export let canvas: HTMLCanvasElement | undefined = undefined;
  export let src: string | undefined = undefined;
  // ... rest of props

  onMount(() => {
    if (canvas) {
      dotLottieInstance = new DotLottieWorker({
        canvas,
        workerUrl, // NEW: Pass through
        src,
        // ... rest of config
      });
    }
  });

  // ... rest of component
</script>
```

**Step 2: Build package**

```bash
cd packages/svelte
pnpm run build
```

Expected: Build succeeds

**Step 3: Commit**

```bash
git add packages/svelte/src/lib/DotLottieWorker.svelte
git commit -m "feat(svelte): add required workerUrl prop

Add workerUrl prop to DotLottieWorker component and pass
through to DotLottieWorker constructor.

BREAKING CHANGE: workerUrl prop is now required

Related to #579"
```

---

## Task 11: Update Web Components Package

**Goal:** Add workerUrl attribute to web components.

**Files:**

* Modify: `packages/wc/src/dotlottie-worker-wc.ts`

**Step 1: Add workerUrl property**

Edit `packages/wc/src/dotlottie-worker-wc.ts`, add property decorator:

```typescript
@property({ type: String })
workerUrl: string = '';  // NEW: Required attribute

connectedCallback(): void {
  super.connectedCallback();

  // Validate workerUrl
  if (!this.workerUrl) {
    console.error('dotlottie-worker-wc: workerUrl attribute is required');
    return;
  }

  this._initializeDotLottie();
}
```

**Step 2: Pass workerUrl to DotLottieWorker**

Find the `_initializeDotLottie` method or where `new DotLottieWorker` is called:

```typescript
private _initializeDotLottie(): void {
  if (!this.canvas || !this.workerUrl) return;

  this._dotLottie = new DotLottieWorker({
    canvas: this.canvas,
    workerUrl: this.workerUrl, // NEW: Pass through
    // ... rest of config
  });
}
```

**Step 3: Build package**

```bash
cd packages/wc
pnpm run build
```

Expected: Build succeeds

**Step 4: Commit**

```bash
git add packages/wc/src/dotlottie-worker-wc.ts
git commit -m "feat(wc): add required workerUrl attribute

Add workerUrl attribute to dotlottie-worker-wc element
and pass through to DotLottieWorker constructor.

BREAKING CHANGE: workerUrl attribute is now required

Related to #579"
```

---

## Task 12: Update Example Applications

**Goal:** Update all example apps to provide workerUrl.

**Files:**

* Modify: `apps/dotlottie-react-example/src/App.tsx` (if uses worker)
* Modify: `apps/dotlottie-vue-example/src/App.vue` (if uses worker)
* Modify: `apps/dotlottie-solid-example/src/App.tsx` (if uses worker)
* Modify: Other example apps that use DotLottieWorker

**Step 1: Check which examples use DotLottieWorker**

```bash
grep -r "DotLottieWorker" apps/*/src --include="*.tsx" --include="*.vue" --include="*.svelte"
```

**Step 2: Update each example**

For each file found, add workerUrl prop. Example for React:

```tsx
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

function App() {
  return (
    <DotLottieWorker
      workerUrl={workerUrl}
      src="https://example.com/animation.lottie"
      autoplay
    />
  );
}
```

For static path:

```tsx
<DotLottieWorker
  workerUrl="/dotlottie-worker.js"
  src="https://example.com/animation.lottie"
  autoplay
/>
```

**Step 3: Test examples build**

```bash
pnpm run build
```

Expected: All examples build successfully

**Step 4: Commit**

```bash
git add apps/
git commit -m "docs: update examples with workerUrl

Add workerUrl prop to all example applications using
DotLottieWorker.

Related to #579"
```

---

## Task 13: Update Documentation

**Goal:** Add usage documentation for workerUrl parameter.

**Files:**

* Modify: `packages/web/README.md`
* Modify: `packages/react/README.md`
* Modify: `packages/vue/README.md`
* Modify: `packages/solid/README.md`
* Modify: `packages/svelte/README.md`
* Modify: `packages/wc/README.md`
* Create: `docs/migration-guides/csp-safe-worker.md`

**Step 1: Update web package README**

Edit `packages/web/README.md`, add workerUrl to usage examples:

````markdown
### Using DotLottieWorker

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

const canvas = document.querySelector('canvas');

const dotLottie = new DotLottieWorker({
  canvas,
  workerUrl: '/workers/dotlottie-worker.js', // Required: Path to worker file
  src: 'https://lottie.host/path/to/animation.lottie',
  autoplay: true,
});
````

#### Serving the Worker File

**Option 1: Copy to public directory**

```bash
cp node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-worker.js public/workers/
```

**Option 2: Import with bundler**

For Vite:

```typescript
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

const dotLottie = new DotLottieWorker({
  canvas,
  workerUrl,
  src: 'animation.lottie',
});
```

#### Content Security Policy

With this approach, you can use strict CSP without blob workers:

```
Content-Security-Policy: worker-src 'self';
```

````

**Step 2: Update framework package READMEs**

Add similar documentation to each framework package README.

**Step 3: Create migration guide**

Create `docs/migration-guides/csp-safe-worker.md`:

```markdown
# Migrating to CSP-Safe Worker

This guide explains how to migrate from blob-based workers to static worker files.

## Breaking Changes

- `workerUrl` parameter is now **required** for `DotLottieWorker`
- All framework components require `workerUrl` prop

## Migration Steps

### 1. Serve the Worker File

Choose one approach:

**A. Copy to public directory:**
```bash
cp node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-worker.js public/workers/
````

**B. Use bundler's asset handling** (Vite example):

```typescript
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';
```

### 2. Update Code

**Before:**

```typescript
new DotLottieWorker({
  canvas,
  src: 'animation.lottie',
});
```

**After:**

```typescript
new DotLottieWorker({
  canvas,
  src: 'animation.lottie',
  workerUrl: '/workers/dotlottie-worker.js',
});
```

### 3. Update CSP Policy

**Before:**

```
Content-Security-Policy: worker-src blob:;
```

**After:**

```
Content-Security-Policy: worker-src 'self';
```

Or for CDN usage:

```
Content-Security-Policy: worker-src 'self' https://cdn.example.com;
```

## Framework-Specific Examples

### React

```tsx
import { DotLottieWorker } from '@lottiefiles/dotlottie-react';
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

function App() {
  return (
    <DotLottieWorker
      workerUrl={workerUrl}
      src="animation.lottie"
      autoplay
    />
  );
}
```

### Vue

```vue
<template>
  <DotLottieWorker
    :workerUrl="workerUrl"
    src="animation.lottie"
    :autoplay="true"
  />
</template>

<script setup>
import { DotLottieWorker } from '@lottiefiles/dotlottie-vue';
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';
</script>
```

### Svelte

```svelte
<script>
  import { DotLottieWorker } from '@lottiefiles/dotlottie-svelte';
  import workerUrl from '@lottiefiles/dotlottie-web/worker?url';
</script>

<DotLottieWorker
  {workerUrl}
  src="animation.lottie"
  autoplay={true}
/>
```

### Solid

```tsx
import { DotLottieWorker } from '@lottiefiles/dotlottie-solid';
import workerUrl from '@lottiefiles/dotlottie-web/worker?url';

function App() {
  return (
    <DotLottieWorker
      workerUrl={workerUrl}
      src="animation.lottie"
      autoplay
    />
  );
}
```

### Web Components

```html
<dotlottie-worker-wc
  workerUrl="/workers/dotlottie-worker.js"
  src="animation.lottie"
  autoplay
></dotlottie-worker-wc>
```

````

**Step 4: Commit**

```bash
git add packages/*/README.md docs/migration-guides/
git commit -m "docs: add workerUrl documentation and migration guide

Add usage examples for workerUrl parameter across all packages.
Create migration guide for CSP-safe worker transition.

Related to #579"
````

---

## Task 14: Run Full Test Suite

**Goal:** Verify all tests pass with the changes.

**Step 1: Run all tests**

```bash
pnpm run test
```

Expected: All tests pass (or only pre-existing flaky tests fail)

**Step 2: If tests fail, debug and fix**

For each failing test:

1. Read the error message
2. Identify if it's missing workerUrl
3. Add workerUrl to the test
4. Re-run test

**Step 3: Type check all packages**

```bash
pnpm run type-check
```

Expected: No type errors

**Step 4: Build all packages**

```bash
pnpm run build
```

Expected: All packages build successfully

**Step 5: Commit any fixes**

```bash
git add .
git commit -m "test: fix remaining test failures

Ensure all tests provide required workerUrl parameter.

Related to #579"
```

---

## Task 15: Update CHANGELOG

**Goal:** Document breaking changes in CHANGELOG files.

**Files:**

* Modify: `CHANGELOG.md` (root)
* Modify: `packages/web/CHANGELOG.md`
* Modify: `packages/react/CHANGELOG.md`
* Modify: `packages/vue/CHANGELOG.md`
* Modify: `packages/solid/CHANGELOG.md`
* Modify: `packages/svelte/CHANGELOG.md`
* Modify: `packages/wc/CHANGELOG.md`

**Step 1: Add entry to root CHANGELOG**

Edit `CHANGELOG.md`:

```markdown
## [Unreleased]

### Breaking Changes

- **CSP-Safe Worker Implementation**: `workerUrl` parameter is now required for `DotLottieWorker` and all framework worker components. This removes blob-based worker instantiation to comply with strict Content Security Policy requirements. See migration guide: `docs/migration-guides/csp-safe-worker.md`

### Added

- Standalone worker file at `dist/dotlottie-worker.js`
- Worker export at `@lottiefiles/dotlottie-web/worker`
- Migration guide for CSP-safe worker transition

### Removed

- Blob-based inline worker plugin
- Automatic blob URL generation for workers

### Fixed

- CSP violations from blob worker instantiation (#579)
```

**Step 2: Add entries to package CHANGELOGs**

Add similar entries to each package's CHANGELOG.md file.

**Step 3: Commit**

```bash
git add CHANGELOG.md packages/*/CHANGELOG.md
git commit -m "docs: update CHANGELOG for CSP-safe worker

Document breaking changes and migration path.

Related to #579"
```

---

## Task 16: Final Verification

**Goal:** Comprehensive verification before creating PR.

**Step 1: Clean build**

```bash
pnpm run clean
pnpm install
pnpm run build
```

Expected: Clean build succeeds

**Step 2: Run full test suite**

```bash
pnpm run test
```

Expected: Tests pass

**Step 3: Check bundle sizes**

```bash
pnpm run size
```

Expected: Main bundle size decreased (no inline worker), worker file \~500KB

**Step 4: Verify worker file**

```bash
ls -lh packages/web/dist/dotlottie-worker.js
cat packages/web/dist/dotlottie-worker.js | head -20
```

Expected: Worker file exists and contains IIFE wrapper

**Step 5: Test CSP compliance manually** (if possible)

Create test HTML with strict CSP:

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Security-Policy"
        content="worker-src 'self'; script-src 'self' 'unsafe-inline'">
</head>
<body>
  <canvas id="canvas"></canvas>
  <script type="module">
    import { DotLottieWorker } from './node_modules/@lottiefiles/dotlottie-web/dist/index.js';

    const dotLottie = new DotLottieWorker({
      canvas: document.getElementById('canvas'),
      workerUrl: './node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-worker.js',
      src: 'https://lottie.host/4db68bbd-31f6-4cd8-b6ff-2e8ff4f8a8a5/9dNbD7S7nL.json',
      autoplay: true,
    });
  </script>
</body>
</html>
```

Expected: No CSP violations in console, animation loads

**Step 6: Review all commits**

```bash
git log --oneline
```

Expected: Clear commit history with good messages

**Step 7: Commit final verification**

If any issues were found and fixed:

```bash
git add .
git commit -m "chore: final verification and cleanup

Related to #579"
```

---

## Success Criteria

* ✅ Worker builds as standalone `dist/dotlottie-worker.js` file
* ✅ `workerUrl` parameter required in all Worker constructors
* ✅ All framework wrappers updated with `workerUrl` prop
* ✅ All tests updated and passing
* ✅ Documentation updated with usage examples
* ✅ Migration guide created
* ✅ CHANGELOG entries added
* ✅ No CSP violations with `worker-src: 'self'`
* ✅ Examples updated and working
* ✅ Clean build with no errors

## Next Steps After Implementation

1. Create pull request with title: "feat!: CSP-safe worker implementation (#579)"
2. Request review from maintainers
3. Address review feedback
4. Prepare release notes for major version bump
5. Coordinate release communication to users

## Notes

* This is a BREAKING CHANGE requiring major version bump
* All users must update their code to provide `workerUrl`
* Clear migration path provided in documentation
* Security improvement justifies breaking change
