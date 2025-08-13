module.exports = [
  {
    name: '@lottiefiles/dotlottie-web',
    path: 'packages/web/dist/index.js',
    import: '*',
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
