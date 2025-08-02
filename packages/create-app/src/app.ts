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
      label: 'React App',
      value: 'from-template',
      template: Template.React,
    },
  ],
  [App.Vue]: [
    {
      label: 'Vue App',
      value: 'from-template',
      template: Template.Vue,
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
