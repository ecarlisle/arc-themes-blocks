module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  env: {
    test: {
      plugins: [
        ['@babel/plugin-proposal-decorators', {
          legacy: true,
        }],
        ['module-resolver', {
          alias: {
            'fusion:themes': './jest/mocks/themes.js',
            'fusion:context': './jest/mocks/context.js',
            'fusion:consumer': './jest/mocks/consumer.js',
          },
        }],
      ],
    },
  },
};
