import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'

const presetOptions: preset.PresetOptions = {
  entries: [
    {
      // entries with '.tsx' extension will have `solid` export condition generated
      entry: 'src/index.ts',
      // will generate a separate development entry
      dev_entry: true,
    },
  ],
  // Set to `true` to remove all `console.*` calls and `debugger` statements in prod builds
  drop_console: true,
  // Set to `true` to generate a CommonJS build alongside ESM
  // cjs: true,
}

export default defineConfig(config => {
  const watching = !!config.watch

  const parsedOptions = preset.parsePresetOptions(presetOptions, watching)

  if (!watching) {
    const package_fields = preset.generatePackageExports(parsedOptions)

    // will update ./package.json with the correct export fields
    preset.writePackageJson(package_fields)
  }

  return preset.generateTsupOptions(parsedOptions)
})
