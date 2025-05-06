import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import colors from 'picocolors';
import { rollup } from 'rollup';
import spawn from 'cross-spawn';
import configFactory from '../config/rollup.config.js';
import { ensureArray, printError, relativePath } from '../config/utils.js';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

const configs = ['umd', 'cjs', 'es'].map(module => configFactory(module));
const distDir = fileURLToPath(new URL('../dist', import.meta.url));

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

build();

async function build() {
  try {
    const startAt = Date.now();

    for (const config of configs) {
      const output = ensureArray(config.output);
      const outputFiles = output.map(o => relativePath(o.file));
      console.log(
        colors.cyan(`\n${colors.bold(config.input)} → ${colors.bold(outputFiles.join(', '))}...`),
      );
      const bundle = await rollup(config);
      await Promise.all(output.map(bundle.write));
      const time = ((Date.now() - startAt) / 1000).toFixed(2);

      console.log(
        colors.green(`Created ${colors.bold(outputFiles.join(', '))} in ${colors.bold(`${time}s`)}`),
      );
    }

    console.log();
    emitTypes();
  } catch (error) {
    printError(error);
  }
}

function emitTypes() {
  const startAt = Date.now();
  const proc = spawn.sync('tsc', ['--noEmit', 'false', '--declaration', '--emitDeclarationOnly', '--declarationDir', 'dist'], {
    stdio: 'inherit',
  });

  if (proc.status !== 0) {
    console.log('\nError: emit types failed\n');
    return;
  }

  console.log(
    colors.green(
      `Emit ${colors.bold('types')} in ${colors.bold(
        `${((Date.now() - startAt) / 1000).toFixed(2)}s`,
      )}`,
    ),
  );
}
