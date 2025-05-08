import { writeFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import assetsPlugin from '@laynezh/vite-plugin-lib-assets';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import getBabelOutputPlugin from '@rollup/plugin-babel';
import dts from 'vite-plugin-dts';
import { preserveDirectives } from 'rollup-plugin-preserve-directives';

export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      plugins: [
        preserveDirectives({}),
        /**
         * The peerDependencies, will be automatically added to external.
         *  https://github.com/pmowrer/rollup-plugin-peer-deps-external#readme
         */
        peerDepsExternal({
          includeDependencies: true,
        }),
        /**
         * Running Babel on the generated code:
         *  https://github.com/rollup/plugins/blob/master/packages/babel/README.md#running-babel-on-the-generated-code
         *
         * Transforming ES6+ syntax to ES5 is not supported yet, there are two ways to do:
         *  https://github.com/evanw/esbuild/issues/1010#issuecomment-803865232
         * We choose to run Babel on the output files after esbuild.
         *
         * @vitejs/plugin-legacy does not support library mode:
         *  https://github.com/vitejs/vite/issues/1639
         */
        getBabelOutputPlugin({
          babelHelpers: 'runtime',
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: false, // Default：false
                // Exclude transforms that make all code slower
                exclude: ['transform-typeof-symbol'],
                // https://babeljs.io/docs/en/babel-preset-env#modules
                modules: false,
              },
            ],
          ],
          plugins: [
            /**
             * Extract helper function when compile npm dest.
             */
            [
              '@babel/plugin-transform-runtime',
              {
                corejs: {
                  version: 3,
                  proposals: true,
                },
                // version: require('@babel/runtime').version,
              },
            ],
          ],
        }),
      ],
    },
    /**
     * About esbuild target:
     *  https://esbuild.github.io/content-types/
     *  https://esbuild.github.io/api/#target
     *
     * Transforming ES6+ syntax to ES5 is not supported yet,
     *  you should still set the target to es5.
     * This prevents esbuild from introducing ES6 syntax into your ES5 code.
     *  https://esbuild.github.io/content-types/#es5
     *  https://github.com/evanw/esbuild/issues/297#issuecomment-670311519
     */
    // target: ['es5'],
    // https://cn.vitejs.dev/config/build-options.html#build-csstarget
    cssTarget: ['chrome61'],
    chunkSizeWarningLimit: 500, // Unit: KB
  },
  plugins: [
    checker({}),
    assetsPlugin({
      name: '[name].[contenthash:8].[ext]',
      limit: 1024 * 8,
      publicUrl: undefined,
    }),
    command === 'build' && dts({
      beforeWriteFile: (filePath, content) => {
        writeFileSync(filePath.replace('.d.ts', '.d.cts'), content);
        return { filePath, content };
      },
    }),
  ],
}));
