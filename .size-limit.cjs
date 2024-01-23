module.exports = [
  {
    name: '@lottiefiles/dotlottie-web',
    path: 'packages/web/dist/index.js',
    import: '{ DotLottie }',
  },
  {
    name: '@lottiefiles/dotlottie-web WASM',
    path: 'packages/web/dist/wasm/*.wasm',
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
];
