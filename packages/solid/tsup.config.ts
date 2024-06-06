/**
 * Copyright 2024 Design Barn Inc.
 */

import { defineConfig } from 'tsup';
// eslint-disable-next-line import/no-namespace
import * as preset from 'tsup-preset-solid';

const presetOptions: preset.PresetOptions = {
  entries: [
    {
      // entries with '.tsx' extension will have `solid` export condition generated
      entry: 'src/index.ts',
      // will generate a separate development entry
      // eslint-disable-next-line @typescript-eslint/naming-convention
      dev_entry: true,
    },
  ],
  // Set to `true` to remove all `console.*` calls and `debugger` statements in prod builds
  // eslint-disable-next-line @typescript-eslint/naming-convention
  drop_console: true,
  // Set to `true` to generate a CommonJS build alongside ESM
  // cjs: true,
};

export default defineConfig((config) => {
  const watching = Boolean(config.watch);

  const parsedOptions = preset.parsePresetOptions(presetOptions, watching);

  if (!watching) {
    const packageFields = preset.generatePackageExports(parsedOptions);

    // will update ./package.json with the correct export fields
    preset.writePackageJson(packageFields);
  }

  return preset.generateTsupOptions(parsedOptions);
});
