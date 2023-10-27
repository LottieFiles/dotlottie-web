/**
 * Copyright 2022 Design Barn Inc.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const { defineConfig } = require('tsup');

module.exports = defineConfig((options) => ({
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
  entry: ['./src/*.ts'],
  format: ['esm'],
  target: ['es2020'],
  tsconfig: 'tsconfig.build.json',
  onSuccess: () => {
    if (options.watch) {
      exec('serve . -l 3000');

      console.log(`
        🚀 Development server running at:
        
        - http://localhost:3000
      
      `);
    }
    fs.copyFileSync(
      path.resolve(__dirname, './src/renderer-wasm/bin/renderer.wasm'),
      path.resolve(__dirname, './dist/renderer.wasm'),
    );
  },
}));
