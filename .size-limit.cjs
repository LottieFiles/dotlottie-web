const modifyWebpackConfig = (config) => {
  config.module.rules.push({
    test: /\.m?js/, // fix:issue: https://github.com/webpack/webpack/issues/11467
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};

module.exports = [
  {
    name: '@lottiefiles/dotlottie-web',
    path: 'packages/web/dist/index.js',
    import: '{ DotLottie }',
    modifyWebpackConfig,
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
    modifyWebpackConfig,
  },
  {
    name: '@lottiefiles/dotlottie-vue',
    path: 'packages/vue/dist/index.js',
    import: '*',
    modifyWebpackConfig,
  },
  {
    name: '@lottiefiles/dotlottie-wc',
    path: 'packages/wc/dist/index.js',
    import: '*',
  },
];
