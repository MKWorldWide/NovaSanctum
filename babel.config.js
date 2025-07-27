module.exports = (api) => {
  const isTest = api.env('test');
  
  return {
    presets: [
      [
        'next/babel',
        {
          'preset-env': {
            modules: isTest ? 'commonjs' : false,
            targets: isTest ? { node: 'current' } : undefined,
            useBuiltIns: 'usage',
            corejs: 3,
          },
          'preset-react': {
            runtime: 'automatic',
          },
        },
      ],
      ['@babel/preset-typescript', { 
        allExtensions: true, 
        isTSX: true 
      }],
    ],
    plugins: [
      ['@babel/plugin-transform-runtime', {
        regenerator: true,
        corejs: 3,
      }],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      isTest && ['@babel/plugin-transform-modules-commonjs', { loose: true }],
    ].filter(Boolean),
  };
};
