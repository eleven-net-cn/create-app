import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { group, select, text } from '@clack/prompts';
import { defineTemplate } from '@e.fe/create-app-helper';
import renderStandard from '@e.fe/template-standard';
import camelcase from 'camelcase';
import type { TemplatePrompts } from './types';

const prompts = () => group(
  {
    type: () => select({
      message: 'Please select:',
      initialValue: 'unbuild',
      options: [
        { label: 'unbuild', value: 'unbuild', hint: 'https://github.com/unjs/unbuild' },
        { label: 'vite', value: 'vite', hint: 'https://vite.dev/' },
        { label: 'tsup', value: 'tsup', hint: 'https://github.com/egoist/tsup' },
        { label: 'rsbuild', value: 'rsbuild', hint: 'https://rsbuild.dev/' },
        { label: 'esbuild', value: 'esbuild', hint: 'https://esbuild.github.io/' },
      ],
    }),
    scopeName: () => text({
      message: 'Please enter package name (scopeName, example: @scope/xxx)',
      validate: value => {
        if (!value) {
          return 'Please enter package name';
        }
        if (!/^@[^/]+\/[^/]+$/.test(value)) {
          return 'Invalid package name format';
        }
      },
    }),
  },
  {
    onCancel() {
      process.exit(0);
    },
  },
);

export default defineTemplate(async context => {
  console.log('context: ', context);
  const { prompts: injectPrompts, render, projectDesc } = context;
  const { type, scopeName } = (injectPrompts as unknown as TemplatePrompts) ?? await prompts();

  const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../template');
  const resolveDir = (dir: string) => resolve(templateDir, dir);

  const [, withoutScopeName] = scopeName.split('/');
  const globalName = camelcase(withoutScopeName, { pascalCase: true });

  render([
    {
      src: resolveDir('base'),
      data: {
        scopeName,
        globalName,
        projectDesc,
      },
    },
    {
      src: resolveDir(type as string),
      data: {
        scopeName,
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
