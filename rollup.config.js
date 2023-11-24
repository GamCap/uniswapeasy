/**
 * Bundles the widgets library, which is released independently of the interface application.
 * This library lives in src/lib, but shares code with the interface application.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { babel } = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const inject = require('@rollup/plugin-inject')
const json = require('@rollup/plugin-json')
const { nodeResolve: resolve } = require('@rollup/plugin-node-resolve')
const { default: dts } = require('rollup-plugin-dts')
const url = require('@rollup/plugin-url')

const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']


const transpile = {
  input: 'src/index.tsx',
  external: (source) => {
    // @ethersproject/* modules are provided by ethers
    return source.startsWith('@ethersproject/')
  },
  plugins: [
    // Dependency resolution
    resolve({ extensions: EXTENSIONS }), // resolves third-party modules within node_modules/

    // Source code transformation
    json(), // imports json as ES6; doing so enables module resolution
    url({ include: ['**/*.png', '**/*.svg'], limit: Infinity }), // imports assets as data URIs
    commonjs(), // transforms cjs dependencies into tree-shakeable ES modules

    babel({
      babelHelpers: 'runtime',
      extensions: EXTENSIONS,
    }),
    inject({ React: 'react' }), // imports React (on the top-level, un-renamed), for the classic runtime
  ],
  onwarn: (warning, warn) => {
    // This pipeline is for transpilation - checking is done through tsc.
    if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return

    warn(warning)
    console.log(warning.loc, '\n')
  },
}

const esm = {
  ...transpile,
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: false,
  },
}

const cjs = {
  ...transpile,
  output: {
    dir: 'dist/cjs',
    entryFileNames: '[name].cjs',
    chunkFileNames: '[name]-[hash].cjs',
    format: 'cjs',
    sourcemap: false,
  },
  watch: false,
}

const types = {
  input: 'dts/index.d.ts',
  output: { file: 'dist/index.d.ts' },
  external: (source) => source.endsWith('.scss') || source.endsWith('/external.d.ts'),
  plugins: [dts({ compilerOptions: { baseUrl: 'dts' } })],
  watch: false,
}


const assets = [
  {
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
    },
  },
]

const config = [esm, cjs, types]
config.config = { ...esm, output: { ...esm.output, sourcemap: true } }
config.assets = assets
module.exports = config