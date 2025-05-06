import colors from 'picocolors';
import { watch } from 'rollup';
import configFactory from '../config/rollup.config.js';
import { printError, registerShutdown, relativePath } from '../config/utils.js';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const configs = ['umd', 'cjs', 'es'].map(module => configFactory(module));
const watcher = watch(configs);

watcher.on('event', event => {
  switch (event.code) {
    case 'START':
      break;
    case 'BUNDLE_START':
      console.log();
      console.log(`Compiling ${event.output.map(relativePath).join(', ')}...`);
      break;
    case 'BUNDLE_END':
      console.log(colors.green(`Compiled successfully in ${colors.bold(`${event.duration}ms`)}`));
      break;
    case 'END':
      console.log(
        `\n[${new Date()
          .toLocaleString('zh-CN', { hour12: false })
          .replace(',', '')}] Waiting for changes...`,
      );
      break;
    case 'ERROR':
      printError(event.error);
      break;
    default:
      break;
  }
});

// when the process ends
registerShutdown(() => watcher.close());
