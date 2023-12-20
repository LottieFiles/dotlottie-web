module.exports = [
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
  {
    name: '@lottiefiles/dotlottie-react',
    path: 'packages/react/dist/index.js',
    import: '*',
    modifyWebpackConfig: (config) => {
      config.module.rules.push({
        test: /\.m?js/, // fix:issue: https://github.com/webpack/webpack/issues/11467
        resolve: {
          fullySpecified: false,
        },
      });

      return config;
    },
  },
  {
    name: '@lottiefiles/dotlottie-wc',
    path: 'packages/wc/dist/index.js',
    import: '*',
  },
];
