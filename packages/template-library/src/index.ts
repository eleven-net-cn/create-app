import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { group, select, text } from '@clack/prompts';
import { defineTemplate } from '@e.fe/create-app-helper';
import camelcase from 'camelcase';
import type { TemplatePrompts } from './types';

const prompts = () => group(
  {
    type: () => select({
      message: '请选择：',
      initialValue: 'unbuild',
      options: [
        { label: 'unbuild', value: 'unbuild', hint: '' },
        { label: 'vite', value: 'vite' },
        { label: 'tsup', value: 'tsup' },
        { label: 'rsbuild', value: 'rsbuild' },
        { label: 'esbuild', value: 'esbuild' },
      ],
    }),
    scopeName: () => text({
      message: '请输入包名（scopeName，示例：@scope/xxx）',
      validate: value => {
        if (!value) {
          return '请输入包名';
        }
        if (!/^@[^/]+\/[^/]+$/.test(value)) {
          return '包名格式不正确';
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
      },
    },
    {
      src: resolveDir(type as string),
      data: {
        scopeName,
        globalName,
        projectDesc,
      },
    },
    {
      src: resolveDir('standard'),
      data: {},
    },
  ]);
});
