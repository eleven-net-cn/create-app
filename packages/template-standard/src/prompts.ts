import { group, multiselect, select } from '@clack/prompts';

export default () =>
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
