import type { Option } from '@clack/prompts';
import { Template } from './template';

export enum App {
  React = 'react-app',
  Vue = 'vue-app',
  Library = 'library',
  Monorepo = 'monorepo',
}

interface AppOption extends Option<string> {
  /** create app by command */
  command?: string;
  /** create app from template */
  template?: Template;
}

export const app: Record<App, AppOption[]> = {
  [App.React]: [
    {
      label: 'Create Next App',
      value: 'create-next-app',
      command: 'npm create next-app@latest',
    },
    {
      label: 'Create Vite',
      value: 'create-vite',
      command: 'npm create vite@latest',
    },
    {
      label: 'Create Vite Extra',
      value: 'create-vite-extra',
      command: 'npm create vite-extra@latest',
    },
    {
      label: 'Create React Router',
      value: 'create-react-router',
      command: 'npm create react-router@latest',
    },
  ],
  [App.Vue]: [
    {
      label: 'Create Vue',
      value: 'create-vue',
      command: 'npm create vue@latest',
    },
    {
      label: 'Create Vite',
      value: 'create-vite',
      command: 'npm create vite@latest',
    },
    {
      label: 'Create Vite Extra',
      value: 'create-vite-extra',
      command: 'npm create vite-extra@latest',
    },
    {
      label: 'Create Nuxt',
      value: 'create-nuxt',
      command: 'npm create nuxt@latest',
    },
    {
      label: 'Create Vue - Vue 2',
      value: 'create-vue__legacy',
      command: 'npm create vue@legacy',
    },
  ],
  [App.Library]: [
    {
      label: 'Library（SDK）',
      value: 'from-template',
      template: Template.Library,
    },
  ],
  [App.Monorepo]: [
    {
      label: 'Monorepo（packages/apps）',
      value: 'from-template',
      template: Template.Monorepo,
    },
  ],
};
