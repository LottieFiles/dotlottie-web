const dotLottieWebConfig = [
  {
    name: '@lottiefiles/dotlottie-web',
    path: 'packages/web/dist/index.js',
    import: '{ DotLottie }',
  },
  {
    name: '@lottiefiles/dotlottie-web WASM',
    path: 'packages/web/dist/*.wasm',
    modifyWebpackConfig: (config) => {
      config.experiments = {
        asyncWebAssembly: true,
      };
    },
  },
];

module.exports = [...dotLottieWebConfig];
