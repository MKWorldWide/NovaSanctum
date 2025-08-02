module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: {
        node: 'current',
        browsers: ['>0.25%', 'not ie 11', 'not op_mini all']
      },
      useBuiltIns: 'usage',
      corejs: 3,
      modules: false, // Enable tree-shaking
      debug: false
    }],
    ['@babel/preset-react', { 
      runtime: 'automatic',
      importSource: '@emotion/react'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      regenerator: true
    }],
    // Enable class properties and private methods
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    // Module resolver for cleaner imports
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@utils': './src/utils',
          '@styles': './src/styles',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@types': './src/types'
        }
      }
    ]
  ],
  // Only include the polyfills and code needed for the target browsers
  exclude: ['node_modules/**']
};
