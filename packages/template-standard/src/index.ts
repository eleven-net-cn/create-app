import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineTemplate } from '@e.fe/create-app-helper';
import { group, multiselect, select } from '@clack/prompts';
import type { TemplatePrompts } from './types';

const prompts = () =>
  group(
    {
      appType: () => select({
        message: 'Application type:',
        initialValue: 'app',
        options: [
          { label: 'App', value: 'app' },
          { label: 'Library', value: 'lib' },
        ],
      }),
      features: () =>
        multiselect({
          message: 'Please select:',
          options: [
            { label: 'eslint', value: 'eslint', hint: 'https://eslint.org/' },
            { label: 'commitlint', value: 'commitlint', hint: 'https://commitlint.js.org/' },
            { label: 'commitizen', value: 'commitizen', hint: 'https://github.com/commitizen/cz-cli' },
            { label: 'lint-staged', value: 'lint-staged', hint: 'https://github.com/lint-staged/lint-staged' },
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
  const { appType, features } = (injectPrompts as unknown as TemplatePrompts) ?? await prompts();

  const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../template');
  const resolveDir = (dir: string) => resolve(templateDir, dir);

  const needsHusky = true;
  const needsEslint = features.includes('eslint');
  const needsAntfuEslintConfig = true;
  const needsCommitlint = features.includes('commitlint');
  const needsCommitizen = features.includes('commitizen');
  const needsLintStaged = features.includes('lint-staged');
  const needsVscodeConfig = true;

  render([
    needsHusky && resolveDir('husky/base'),
    needsHusky && needsCommitlint && {
      src: resolveDir('husky/commitlint'),
      toAppend: ['.husky/commit-msg'],
    },
    needsHusky && needsLintStaged && {
      src: resolveDir('husky/lint-staged'),
      toAppend: ['.husky/pre-commit'],
    },
    needsEslint && resolveDir('eslint/base'),
    needsAntfuEslintConfig && {
      src: resolveDir('eslint/antfu/base'),
      data: {
        appType,
      },
    },
    needsEslint && resolveDir('eslint/lint-staged'),
    needsCommitlint && resolveDir('commitlint'),
    needsCommitizen && resolveDir('commitizen'),
    needsVscodeConfig && resolveDir('vscode-config'),
  ]);
});
