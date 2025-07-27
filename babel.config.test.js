module.exports = {
  presets: [
    ['next/babel', {
      'preset-react': {
        runtime: 'automatic',
      },
    }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      corejs: 3,
    }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-transform-modules-commonjs', { loose: true }],
  ],
};
