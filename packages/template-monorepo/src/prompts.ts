import { group, multiselect } from '@clack/prompts';

export default () => group(
  {
    dirs: () => multiselect({
      message: 'Please select:',
      options: [
        {
          label: 'packages',
          value: 'packages',
        },
        {
          label: 'apps',
          value: 'apps',
        },
      ],
    }),
  },
  {
    onCancel() {
      process.exit(0);
    },
  },
);
