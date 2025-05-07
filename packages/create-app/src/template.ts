export enum Template {
  Library = '@e.fe/template-library',
  Monorepo = '@e.fe/template-monorepo',
}

export const templates = [
  { label: 'Library（SDK）', value: Template.Library },
  { label: 'Monorepo（packages/apps）', value: Template.Monorepo },
];
