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
  // Worker bundle
  {
    entry: {
      'dotlottie-worker': './src/worker/dotlottie.worker.ts',
    },
    outDir: './dist',
    format: ['iife'],
    globalName: 'DotLottieWorker',
    minify: true,
    sourcemap: true,
    platform: 'browser',
    target: ['es2020'],
    bundle: true,
    treeshake: true,
    outExtension() {
      return {
        js: '.js',
      };
    },
  },
]);
