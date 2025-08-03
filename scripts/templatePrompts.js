import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  // testing-library ☞ nr start
  // type: 'rollup',
  // packageManager: 'pnpm',
  // installNow: false,

  // testing-react-app ☞ nr start --react
  type: 'create-next-app',
  cwd: resolve(__dirname, '../.playground'),
  packageManager: 'pnpm',
  installNow: false,

  // testing-vue-app ☞ nr start --vue
  // type: 'create-nuxt',
  // cwd: resolve(__dirname, '../.playground'),
  // packageManager: 'pnpm',
  // installNow: false,
};
