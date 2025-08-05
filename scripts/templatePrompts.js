import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  // testing-library ☞ nr start
  // type: 'rollup',
  // packageManager: 'pnpm',
  // installNow: false,

  // nr start --react (testing-react-app)
  type: 'create-next-app',
  cwd: resolve(__dirname, '../.playground'),
  packageManager: 'pnpm',
  installNow: false,

  // nr start --vue (testing-vue-app)
  // type: 'create-nuxt',
  // cwd: resolve(__dirname, '../.playground'),
  // packageManager: 'pnpm',
  // installNow: false,
};
