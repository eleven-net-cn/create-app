import type { MixinOptions } from './types';
import {
  existsSync,
  readFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

import type {
  TemplateFnReturnType,
  TplContext,
} from '@e.fe/create-app-helper';
import colors from 'picocolors';
import { installPackage } from '@antfu/install-pkg';
import { commit } from '@e.fe/create-app-renderer';

import { argv } from './argv';
import { renderFactory } from './render';

const require = createRequire(import.meta.url);

export async function mixin(options: MixinOptions) {
  const {
    cwd: _cwd,
    template,
    prompts,
  } = options;

  if (!template) {
    throw new Error('Template is required for mixin mode');
  }

  const cwd = _cwd || process.cwd();
  const createAppDir = dirname(require.resolve('@e.fe/create-app/package.json'));

  let templatePackage = template;

  // Support file: protocol, work locally
  if (templatePackage.match(/^file:/)) {
    // eslint-disable-next-line regexp/no-useless-quantifier
    const localTemplatePath = resolve(process.cwd(), templatePackage.match(/^file:(.*)?$/)?.[1] ?? '');
    const { module, main } = JSON.parse(readFileSync(resolve(localTemplatePath, 'package.json'), 'utf-8'));
    const entry = module || main || 'index.js';
    templatePackage = resolve(localTemplatePath, entry);
  }

  const templatePackagePaths = [
    resolve(createAppDir, '../..', templatePackage),
    resolve(createAppDir, 'node_modules', templatePackage),
    // 添加 workspace 包路径支持
    resolve(createAppDir, '../..', 'packages', templatePackage.replace('@e.fe/', ''), 'dist/index.js'),
  ];
  const existsTemplatePackage = templatePackagePaths.some(tplPath => existsSync(tplPath));

  if (!existsTemplatePackage) {
    console.log(`\nInstalling template package: ${templatePackage}\n`);
    await installPackage(templatePackage, {
      cwd: createAppDir,
    });
  }

  // 找到实际的模板包路径
  let actualTemplatePackage = templatePackage;
  for (const tplPath of templatePackagePaths) {
    if (existsSync(tplPath)) {
      actualTemplatePackage = tplPath;
      break;
    }
  }

  const { default: tplFn } = await import(actualTemplatePackage);

  if (typeof tplFn !== 'function') {
    throw new TypeError(`${templatePackage} must to export a render function`);
  }

  const render = renderFactory({ rootDir: cwd, options });

  console.log(colors.cyan(`\n🔧 Running mixin mode with template: ${templatePackage}`));

  const tplFnRes: TemplateFnReturnType
    = (await tplFn({
      cwd,
      rootDir: cwd,
      projectName: '', // mixin 模式下不需要项目名
      projectDesc: '', // mixin 模式下不需要项目描述
      argv,
      options,
      render,
      prompts,
    } satisfies TplContext<MixinOptions>)) ?? {};

  await commit({
    options: {
      ...options,
      tplFnRes,
      prompts: tplFnRes?.prompts ?? {},
    },
  });

  if (typeof tplFnRes?.afterRender === 'function') {
    await tplFnRes.afterRender();
  }

  console.log();
  console.log(colors.green('✅ Mixin completed successfully!'));
  console.log();
}
