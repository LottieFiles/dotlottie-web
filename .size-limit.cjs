module.exports = [
  {
    name: '@lottiefiles/dotlottie-web',
    path: 'packages/web/dist/index.js',
    import: '{ DotLottie }',
  },
  {
    name: '@lottiefiles/dotlottie-web/webgpu',
    path: 'packages/web/dist/webgpu/index.js',
    import: '{ DotLottie }',
  },
  {
    name: '@lottiefiles/dotlottie-web/webgl',
    path: 'packages/web/dist/webgl/index.js',
    import: '{ DotLottie }',
  },
  {
    name: '@lottiefiles/dotlottie-web WASM (WebGL)',
    path: 'packages/web/dist/webgl/*.wasm',
    modifyWebpackConfig: (config) => {
      config.experiments = {
        asyncWebAssembly: true,
      };
    },
  },
  {
    name: '@lottiefiles/dotlottie-web WASM (WebGPU)',
    path: 'packages/web/dist/webgpu/*.wasm',
    modifyWebpackConfig: (config) => {
      config.experiments = {
        asyncWebAssembly: true,
      };
    },
  },
  {
    name: '@lottiefiles/dotlottie-web WASM (Software)',
    path: 'packages/web/dist/*.wasm',
    modifyWebpackConfig: (config) => {
      config.experiments = {
        asyncWebAssembly: true,
      };
    },
  },
  {
    name: '@lottiefiles/dotlottie-react',
    path: 'packages/react/dist/index.js',
    import: '*',
  },
  {
    name: '@lottiefiles/dotlottie-vue',
    path: 'packages/vue/dist/index.js',
    import: '*',
  },
  {
    name: '@lottiefiles/dotlottie-wc',
    path: 'packages/wc/dist/index.js',
    import: '*',
  },
  {
    name: '@lottiefiles/dotlottie-svelte',
    path: 'packages/svelte/dist/index.js',
    import: '*',
    modifyWebpackConfig: (config) => {
      config.module.rules.push({
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
        },
      });

      return config;
    },
  },
  {
    name: '@lottiefiles/dotlottie-solid',
    path: 'packages/solid/dist/index.js',
    import: '*',
  },
];
