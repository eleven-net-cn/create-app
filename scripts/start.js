import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import chokidar from 'chokidar';
import minimist from 'minimist';
import colors from 'picocolors';

import templatePrompts from './templatePrompts.js';

const cwd = process.cwd();
const argv = minimist(process.argv.slice(2));
const __dirname = dirname(fileURLToPath(import.meta.url));
const playgroundDir = join(__dirname, '../.playground');
const packagesDir = join(__dirname, '../packages');
const packages = readdirSync(packagesDir).filter(file => {
  const stat = statSync(join(packagesDir, file));
  return stat.isDirectory();
});
const targetTemplateDir
  = packages.find(pkg => {
    const trueKeys = Object.entries(argv).filter(([_, value]) => value === true);
    return trueKeys.some(([key]) => pkg.endsWith(key));
  }) || 'template-library';
const targetTemplatePkg = `@e.fe/${targetTemplateDir}`;
const debugAppName = targetTemplateDir.replace('template-', '');
const debugAppDir = join(playgroundDir, debugAppName);

const watchPaths = [
  join(__dirname, '../packages/create-app/src'),
  join(__dirname, '../packages/create-app-helper/src'),
  join(__dirname, '../packages/create-app-renderer/src'),
  targetTemplateDir && join(__dirname, `../packages/${targetTemplateDir}`), // waiting for compiled
].filter(Boolean);

mkdirSync(debugAppDir, { recursive: true });

/**
 * 本地调试时，为了避免阻断调试而不清空生成目录，所以，部分 append 叠加内容的文件需手动清空。
 */
const emptyFiles = () => {
  const files = ['.gitignore', 'env.d.ts'];

  files.forEach(file => {
    const filepath = join(debugAppDir, file);
    if (existsSync(filepath)) {
      unlinkSync(filepath);
    }
  });
};

const prepareCreateApp = () => {
  execSync('pnpm build --filter @e.fe/create-app', { stdio: 'inherit' }); // Caching with turbo
};

const createApp = async () => {
  const { create } = await import(`../packages/create-app/dist/index.js?t=${Date.now()}`);

  await create({
    mode: 'debug',
    cwd: playgroundDir,
    projectName: debugAppName,
    shouldOverwrite: true,
    template: targetTemplatePkg,
    packageManager: 'pnpm',
    prompts: templatePrompts,
  });
};

const watcher = chokidar.watch(watchPaths, {
  persistent: true,
  awaitWriteFinish: true,
  ignoreInitial: true,
  ignored: [/node_modules/, /\.turbo/, /dist/],
  interval: 300,
});

watcher.on('ready', async () => {
  prepareCreateApp();
  emptyFiles();
  await createApp();

  console.log(colors.blue(`Now, Debug using: ${colors.magenta(targetTemplatePkg)}`));

  console.log();
  console.log(colors.blue('Template Prompts: '));
  console.log(templatePrompts);
  console.log();

  if (watchPaths.length > 0) {
    console.log();
    console.log(colors.blue('Watching: '));
    watchPaths.forEach(filePath => {
      console.log(colors.blueBright(` ${colors.cyanBright(relative(cwd, filePath))}`));
    });
    console.log();
  }
});

watcher.on('change', async filePath => {
  console.log(colors.greenBright(`Changed ${colors.cyanBright(relative(cwd, filePath))}`));

  emptyFiles();

  const shouldRecompileCreateApp
    = filePath.includes('packages/create-app') || filePath.includes('packages/create-app-helper');
  const shouldRecompileTpl = filePath.includes(`packages/${targetTemplateDir}/src`);

  if (shouldRecompileCreateApp) {
    prepareCreateApp();
  }

  if (shouldRecompileTpl) {
    execSync(`pnpm build --filter ${targetTemplatePkg}`, { stdio: 'inherit' }); // Caching with turbo
  }
  await createApp();
});
