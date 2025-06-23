import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineTemplate } from '@e.fe/create-app-helper';
import renderStandard from '@e.fe/template-standard';
import prompts from './prompts';
import type { TemplatePrompts } from './types';

export default defineTemplate(async context => {
  const { prompts: injectPrompts, render } = context;
  const { dirs } = (injectPrompts as unknown as TemplatePrompts) ?? await prompts();

  const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../template');
  const resolveDir = (dir: string) => resolve(templateDir, dir);

  const needsPackages = dirs.includes('packages');
  const needsApps = dirs.includes('apps');

  render([
    needsPackages && {
      src: resolveDir('base/package'),
      data: {},
    },
    needsApps && resolveDir('base/app'),
    resolveDir('turbo'),
    resolveDir('workspace/pnpm-workspace'),
    resolveDir('lerna'),
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
