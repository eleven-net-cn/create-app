export type Feature = 'commitlint' | 'lint-staged';

export interface TemplatePrompts {
  appType: 'app' | 'lib';
  features: Feature[];
}
