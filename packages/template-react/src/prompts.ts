import { group, select } from '@clack/prompts';

export default () =>
  group(
    {
      type: () =>
        select({
          message: 'Please Select:',
          initialValue: 'create-next-app',
          options: [
            { label: 'Create Next App', value: 'create-next-app', hint: 'https://nextjs.org/' },
            { label: 'Create Vite', value: 'create-vite', hint: 'https://vite.dev/' },
            { label: 'Create Vite Extra', value: 'create-vite-extra', hint: 'https://github.com/antfu/vite-extra' },
            { label: 'Create React Router', value: 'create-react-router', hint: 'https://reactrouter.com/' },
          ],
        }),
    },
    {
      onCancel() {
        process.exit(0);
      },
    },
  );
