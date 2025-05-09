import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { group, select, text } from '@clack/prompts';
import { defineTemplate } from '@e.fe/create-app-helper';
import renderStandard from '@e.fe/template-standard';
import colors from 'picocolors';
import camelcase from 'camelcase';
import type { TemplatePrompts } from './types';

const prompts = () =>
  group(
    {
      type: () =>
        select({
          message: 'Please select:',
          initialValue: 'unbuild',
          options: [
            { label: 'unbuild', value: 'unbuild', hint: 'https://github.com/unjs/unbuild' },
            { label: 'vite', value: 'vite', hint: 'https://vite.dev/' },
            { label: 'tsup', value: 'tsup', hint: 'https://github.com/egoist/tsup' },
            { label: 'rollup', value: 'rollup', hint: 'https://rollupjs.org/' },
            // { label: 'rsbuild', value: 'rsbuild', hint: 'https://rsbuild.dev/' },
            // { label: 'esbuild', value: 'esbuild', hint: 'https://esbuild.github.io/' },
          ],
        }),
      globalName: ({ results: { type } }) => {
        if (type !== 'rollup') {
          return null;
        }

        return text({
          message: `Enter library global name, for iife/umd ${colors.gray(' (optional, press Enter to skip)')}`,
          validate(value) {
            if (!value) {
              return 'global name is required';
            }
          },
        });
      },
    },
    {
      onCancel() {
        process.exit(0);
      },
    },
  );

export default defineTemplate<TemplatePrompts>(async context => {
  const { prompts: injectPrompts, render, projectDesc } = context;
  const { type, globalName: _globalName = '' } = (injectPrompts as unknown as TemplatePrompts) ?? await prompts();

  const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../template');
  const resolveDir = (dir: string) => resolve(templateDir, dir);

  const globalName = camelcase(_globalName as string, { pascalCase: true });

  render([
    {
      src: resolveDir('base'),
      data: {
        globalName,
        projectDesc,
      },
    },
    {
      src: resolveDir(type as string),
      data: {
        globalName,
      },
    },
  ]);

  await renderStandard({
    ...context,
    prompts: {
      features: [
        'eslint',
        'commitlint',
        'commitizen',
        'lint-staged',
      ],
    },
  });
});
