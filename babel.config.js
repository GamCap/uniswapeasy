module.exports = {
  compact:false,
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      'macros',
      [
        'module-resolver',
        {
          root: ['src'], 
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
    ],
  };
  