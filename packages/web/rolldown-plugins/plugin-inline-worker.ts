import path from 'node:path';

import * as esbuild from 'esbuild';

const WORKER_SUFFIX = '?worker&inline';
const NAMESPACE = '\0inline-worker:';

interface RolldownPlugin {
  name: string;
  resolveId?: (source: string, importer: string | undefined) => { id: string; moduleSideEffects: boolean } | null;
  load?: (id: string) => Promise<{ code: string; moduleSideEffects: boolean } | null> | null;
}

export function pluginInlineWorker(pkg: { name: string; version: string }): RolldownPlugin {
  return {
    name: 'inline-worker',

    resolveId(source: string, importer: string | undefined) {
      if (source.endsWith(WORKER_SUFFIX)) {
        const cleanPath = source.replace(WORKER_SUFFIX, '');
        const resolvedPath = importer ? path.resolve(path.dirname(importer), cleanPath) : cleanPath;

        return { id: `${NAMESPACE}${resolvedPath}`, moduleSideEffects: false };
      }

      return null;
    },

    async load(id: string) {
      if (!id.startsWith(NAMESPACE)) return null;

      const workerPath = id.slice(NAMESPACE.length);

      const candidates = [workerPath, `${workerPath}.ts`, `${workerPath}.js`];

      for (const candidate of candidates) {
        try {
          const { outputFiles } = await esbuild.build({
            entryPoints: [candidate],
            bundle: true,
            write: false,
            format: 'iife',
            minify: true,
            target: ['es2020'],
            outdir: '.tmp',
            define: {
              __PACKAGE_NAME__: JSON.stringify(pkg.name),
              __PACKAGE_VERSION__: JSON.stringify(pkg.version),
            },
          });

          if (outputFiles.length !== 1) {
            throw new Error('Too many files built for worker bundle.');
          }

          const { text } = outputFiles[0]!;

          // Two constraints on the emitted code:
          // - Keep the worker source a single string literal. Encoding it as a
          //   Uint8Array byte literal creates one AST node per byte, slowing consumer
          //   builds and bloating bundles (#344).
          // - Pass `new Worker()` a variable, not a string/data-URL literal. Parcel
          //   statically analyzes literal Worker() arguments and fails the build (#333).
          return {
            code: `
              "use client";
              const workerCode = ${JSON.stringify(text)};
              class InlineWorker {
                constructor() {
                  if (typeof Worker === 'undefined') {
                    throw new Error('Worker is not supported in this environment.');
                  }
                  const blob = new Blob([workerCode], { type: 'application/javascript' });
                  const url = URL.createObjectURL(blob);
                  const worker = new Worker(url);
                  URL.revokeObjectURL(url);
                  return worker;
                }
              }
              export default InlineWorker;
            `,
            moduleSideEffects: false,
          };
        } catch {
          if (candidate === candidates[candidates.length - 1]) {
            throw new Error(`Failed to build worker from any of: ${candidates.join(', ')}`);
          }
        }
      }

      return null;
    },
  };
}
