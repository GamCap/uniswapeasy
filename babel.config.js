module.exports = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      [
        'module-resolver',
        {
          root: ['src'], 
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
    ],
  };
  