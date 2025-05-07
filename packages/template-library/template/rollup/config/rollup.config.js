import { fileURLToPath } from 'node:url';
import { DEFAULTS, nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import builtins from 'rollup-plugin-node-builtins';
import url from '@rollup/plugin-url';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import replace from '@rollup/plugin-replace';
import camelcase from 'camelcase';
// import { version as runtimeCoreJsVersion } from '@babel/runtime-corejs3/package.json' assert { type: 'json'};

const libraryNamePascalCase = camelcase('<%= globalName %>', { pascalCase: true });
const isProd = process.env.NODE_ENV === 'production';

/**
 * Create Rollup Config
 * @param {string} module 'es' | 'cjs' | 'umd'
 */
export default function (module) {
  const config = {
    input: `src/index.ts`,
    watch: {
      include: 'src/**',
    },
    plugins: [
      /**
       * https://github.com/rollup/plugins/tree/master/packages/eslint
       */
      builtins(),
      url(),
      nodeResolve({
        extensions: [...DEFAULTS.extensions, '.jsx', '.ts', '.tsx'],
        mainFields: ['browser', 'jsnext:main', 'module', 'main'],
      }),
      commonjs(),
      alias({
        entries: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      }),
      json(),
      replace({
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        },
        preventAssignment: true,
      }),
      babel({
        babelHelpers: 'runtime',
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
        /**
         * https://github.com/zloirock/core-js/issues/514
         * https://github.com/rails/webpacker/pull/2031
         */
        exclude: [/node_modules/, /node_modules[\\/]core-js/],
        assumptions: {
          /**
           * https://babeljs.io/docs/en/assumptions#setpublicclassfields
           *
           * https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy
           */
          setPublicClassFields: true,
        },
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: false,
              // Exclude transforms that make all code slower
              exclude: ['transform-typeof-symbol'],
              // https://babeljs.io/docs/en/babel-preset-env#modules
              modules: false,
            },
          ],
          '@babel/preset-typescript',
          [
            '@babel/preset-react',
            {
              // react 17+
              runtime: 'automatic',
            },
          ],
        ],
        plugins: [
          'babel-plugin-macros',
          'babel-plugin-annotate-pure-calls',
          [
            '@babel/plugin-transform-runtime',
            {
              corejs: {
                version: 3,
                proposals: true,
              },
              // version: runtimeCoreJsVersion,
            },
          ],
          [
            '@babel/plugin-proposal-decorators',
            {
              legacy: true,
            },
          ],
          ['@babel/plugin-proposal-class-properties'],
        ],
      }),
      isProd && filesize(),
      /**
       * https://github.com/pmowrer/rollup-plugin-peer-deps-external#readme
       */
      peerDepsExternal({
        includeDependencies: module !== 'umd',
      }),
      isProd
      && module === 'umd'
      && terser({
        parse: {
          // we want terser to parse ecma 8 code. However, we don't want it
          // to apply any minfication steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
          // Disabled because of an issue with Terser breaking valid code:
          // https://github.com/facebook/create-react-app/issues/5250
          // Pending futher investigation:
          // https://github.com/terser-js/terser/issues/120
          inline: 2,
          drop_debugger: true,
          drop_console: false,
        },
        mangle: {
          safari10: true,
        },
        output: {
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true,
          beautify: false,
        },
      }),
    ].filter(Boolean),
  };

  switch (module) {
    case 'es':
      config.output = {
        file: 'dist/index.js',
        format: 'es',
        exports: 'named',
        sourcemap: true,
      };
      break;
    case 'cjs':
      config.output = {
        file: 'dist/index.cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      };
      break;
    case 'umd':
      config.output = {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: libraryNamePascalCase,
        // https://www.rollupjs.org/guide/en/#outputglobals
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          axios: 'axios',
        },
        exports: 'named',
        sourcemap: true,
      };
      break;
    default:
      break;
  }

  return config;
}
