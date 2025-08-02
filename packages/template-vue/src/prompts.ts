import { group, select } from '@clack/prompts';

export default () =>
  group(
    {
      type: () =>
        select({
          message: 'Please Select:',
          initialValue: 'create-vue',
          options: [
            { label: 'Create Vue', value: 'create-vue', hint: 'https://vuejs.org/' },
            { label: 'Create Vite', value: 'create-vite', hint: 'https://vite.dev/' },
            { label: 'Create Vite Extra', value: 'create-vite-extra', hint: 'https://github.com/antfu/vite-extra' },
            { label: 'Create Nuxt', value: 'create-nuxt', hint: 'https://nuxt.com/' },
            { label: 'Create Vue - Vue 2', value: 'create-vue-legacy', hint: 'https://vuejs.org/v2/' },
          ],
        }),
    },
    {
      onCancel() {
        process.exit(0);
      },
    },
  );
