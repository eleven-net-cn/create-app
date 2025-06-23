import { group, select, text } from '@clack/prompts';
import colors from 'picocolors';

export default () =>
  group(
    {
      type: () =>
        select({
          message: 'Please select:',
          initialValue: 'unbuild',
          options: [
            { label: 'unbuild', value: 'unbuild', hint: 'https://github.com/unjs/unbuild' },
            { label: 'vite', value: 'vite', hint: 'https://vite.dev/' },
            { label: 'tsup', value: 'tsup', hint: 'https://github.com/egoist/tsup' },
            { label: 'rollup', value: 'rollup', hint: 'https://rollupjs.org/' },
            // { label: 'rsbuild', value: 'rsbuild', hint: 'https://rsbuild.dev/' },
            // { label: 'esbuild', value: 'esbuild', hint: 'https://esbuild.github.io/' },
          ],
        }),
      globalName: ({ results: { type } }) => {
        if (type !== 'rollup') {
          return null;
        }

        return text({
          message: `Enter library global name, for iife/umd ${colors.gray(' (optional, press Enter to skip)')}`,
          validate(value) {
            if (!value) {
              return 'global name is required';
            }
          },
        });
      },
    },
    {
      onCancel() {
        process.exit(0);
      },
    },
  );
