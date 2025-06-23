import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineTemplate } from '@e.fe/create-app-helper';
import renderStandard from '@e.fe/template-standard';
import camelcase from 'camelcase';
import prompts from './prompts';
import type { TemplatePrompts } from './types';

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
