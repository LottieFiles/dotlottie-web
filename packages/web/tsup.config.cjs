const fs = require('fs');
const path = require('path');

const { defineConfig } = require('tsup');

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
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: ['es2020', 'node18'],
  tsconfig: 'tsconfig.build.json',
  onSuccess: () => {
    copyFileSync(
      path.resolve(__dirname, 'src/core/dotlottie-player.wasm'),
      path.resolve(__dirname, 'dist/dotlottie-player.wasm'),
    ).catch((err) => {
      console.error('Error copying file:', err);
    });
  },
});
