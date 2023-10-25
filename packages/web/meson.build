project('thorvgLottieRenderer', 'cpp')

cc = meson.get_compiler('cpp')

if cc.get_id() == 'emscripten'
    thorvg_wasm_lib_path = join_paths(meson.current_source_dir(), 'thorvg', 'build_wasm', 'src')
    thorvg_wasm_lib = cc.find_library('thorvg', dirs: thorvg_wasm_lib_path)

    headers = include_directories('thorvg/inc')

    thorvg_wasm_dep = declare_dependency(dependencies: thorvg_wasm_lib, include_directories: headers)

    executable('renderer',
        'cpp/renderer.cpp',
        include_directories: headers,
        dependencies: [thorvg_wasm_dep],
    )
else
    message('The compiler is not Emscripten.')
endif
