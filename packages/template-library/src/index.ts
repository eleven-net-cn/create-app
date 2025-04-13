import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { group, select } from '@clack/prompts';
import { defineTemplate } from '@e.fe/create-app-helper';

const prompts = () => group(
  {
    type: () => {
      return select({
        message: '请选择：',
        initialValue: 'unbuild',
        options: [
          { label: 'unbuild', value: 'unbuild', hint: '' },
          { label: 'vite', value: 'vite' },
          { label: 'tsup', value: 'tsup' },
          { label: 'rsbuild', value: 'rsbuild' },
          { label: 'esbuild', value: 'esbuild' },
        ],
      });
    },
  },
  {
    onCancel() {
      process.exit(0);
    },
  },
);

export default defineTemplate(async context => {
  const { prompts: injectPrompts, render } = context;
  const { type } = injectPrompts ?? await prompts();

  const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../template');
  const resolveDir = (dir: string) => resolve(templateDir, dir);

  render(resolveDir(type as string));
});
