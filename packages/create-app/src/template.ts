export enum Template {
  Library = '@e.fe/template-library',
  Monorepo = '@e.fe/template-monorepo',
}

export const templates = [
  { label: 'Library（SDK 类库）', value: Template.Library },
  { label: 'Monorepo（多包/多应用）', value: Template.Monorepo },
];
