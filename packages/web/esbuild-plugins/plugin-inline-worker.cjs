const path = require('path');

const esbuild = require('esbuild');

/**
 * @param {Pick<import('esbuild').BuildOptions, 'minify' | 'format' | 'plugins' | 'target' | 'loader'>} [opt]
 * @param {RegExp} [filter=/\?worker&inline$/u]
 * @return {import('esbuild').Plugin}
 */
const PluginInlineWorker = (opt = {}, filter = /\?worker&inline$/u) => {
  const namespace = 'inline-worker';

  return {
    name: namespace,
    setup(build) {
      build.onResolve({ filter }, (args) => {
        return {
          path: path.resolve(args.resolveDir, args.path.replace(filter, '')),
          namespace,
        };
      });

      build.onLoad({ filter: /.*/u, namespace }, async (args) => {
        const { outputFiles } = await esbuild.build({
          entryPoints: [args.path],
          bundle: true,
          write: false,
          format: opt.format || 'iife',
          minify: opt.minify || false,
          target: opt.target || build.initialOptions.target,
          loader: opt.loader || build.initialOptions.loader,
          plugins: [...(build.initialOptions.plugins || []), ...(opt.plugins || [])],
          outdir: '.tmp',
        });

        if (outputFiles.length !== 1) {
          throw new Error('Too many files built for worker bundle.');
        }

        const { contents } = outputFiles[0];
        const uint8Array = new Uint8Array(contents);

        return {
          loader: 'js',
          contents: `
            "use client";
            class InlineWorker {
              constructor() {
                if (typeof Worker === 'undefined') {
                  throw new Error('Worker is not supported in this environment.');
                }
                const blob = new Blob([new Uint8Array([${uint8Array.join(',')}])], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                const worker = new Worker(url);
                URL.revokeObjectURL(url);
                return worker;
              }
            }
            export default InlineWorker;
          `,
        };
      });
    },
  };
};

module.exports = { PluginInlineWorker };
