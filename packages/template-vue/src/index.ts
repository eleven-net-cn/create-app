import { execSync } from 'node:child_process';
import { defineTemplate } from '@e.fe/create-app-helper';
import renderStandard from '@e.fe/template-standard';
import prompts from './prompts';
import type { TemplatePrompts } from './types';

const frameworkCommands: Record<TemplatePrompts['type'], (projectName: string) => string> = {
  'create-vue': (projectName: string) => `npm create vue@latest ${projectName}`,
  'create-vite': (projectName: string) => `npm create vite@latest ${projectName} -- --no-install`,
  'create-vite-extra': (projectName: string) => `npm create vite-extra@latest ${projectName} -- --no-install`,
  'create-nuxt': (projectName: string) => `npm create nuxt@latest ${projectName} -- --no-install`,
  'create-vue-legacy': (projectName: string) => `npm create vue@legacy ${projectName}`,
};

export default defineTemplate(async context => {
  const { cwd, projectName, prompts: injectPrompts } = context;
  const { type } = (injectPrompts as unknown as TemplatePrompts) ?? await prompts();

  // The community has done excellent work, so we will use their project generators first.
  const commandFn = frameworkCommands[type];
  if (commandFn) {
    try {
      const command = commandFn(projectName);
      execSync(command, {
        stdio: 'inherit',
        cwd: cwd || process.cwd(),
      });
    // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      process.exit(1);
    }
  }

  // Render the code-standard
  await renderStandard({
    ...context,
    prompts: {
      features: [
        'commitlint',
        'commitizen',
        'husky',
        'lint-staged',
      ],
    },
  });
});
