import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { group, multiselect } from '@clack/prompts';
import { defineTemplate } from '@e.fe/create-app-helper';
import renderStandard from '@e.fe/template-standard';
import type { TemplatePrompts } from './types';

const prompts = () => group(
  {
    dirs: () => multiselect({
      message: 'Please select:',
      options: [
        {
          label: 'packages',
          value: 'packages',
        },
        {
          label: 'apps',
          value: 'apps',
        },
      ],
    }),
  },
  {
    onCancel() {
      process.exit(0);
    },
  },
);

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
