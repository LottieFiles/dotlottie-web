const fs = require('fs');
const path = require('path');

const { replace } = require('esbuild-plugin-replace');
const { defineConfig } = require('tsup');

const { PluginInlineWorker } = require('./esbuild-plugins/plugin-inline-worker.cjs');
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

module.exports = defineConfig({
  bundle: true,
  metafile: false,
  splitting: false,
  treeshake: true,
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
  entry: ['./src/index.ts', 'src/webgl/index.ts', 'src/webgpu/index.ts'],
  outDir: './dist',
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: ['es2015', 'node18'],
  tsconfig: 'tsconfig.build.json',
  esbuildPlugins: [
    // This plugin is used to inline the workers as base64 strings in the output bundle
    PluginInlineWorker(),
    replace({
      __PACKAGE_VERSION__: pkg.version,
      __PACKAGE_NAME__: pkg.name,
    }),
  ],
  onSuccess: async () => {
    await copyFileSync(
      path.resolve(__dirname, 'src/software/wasm/dotlottie-player.wasm'),
      path.resolve(__dirname, 'dist/dotlottie-player.wasm'),
    );
    await copyFileSync(
      path.resolve(__dirname, 'src/webgpu/wasm/dotlottie-player.wasm'),
      path.resolve(__dirname, 'dist/webgpu/dotlottie-player.wasm'),
    );
    await copyFileSync(
      path.resolve(__dirname, 'src/webgl/wasm/dotlottie-player.wasm'),
      path.resolve(__dirname, 'dist/webgl/dotlottie-player.wasm'),
    );
  },
});
