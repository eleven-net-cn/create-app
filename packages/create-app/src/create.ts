import type { CreateOptions } from './types';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { EOL } from 'node:os';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

import {
  GIT_USER_EMAIL,
  GIT_USER_NAME,
  NODE_VERSION,
  PACKAGE_MANAGER,
  postOrderDirectoryTraverse,
  type RenderFn,
  type TemplateFnReturnType,
  type TplContext,
  tryGitCommit,
  tryGitInit,
} from '@e.fe/create-app-helper';
import colors from 'picocolors';
import { commit, render2Memory } from '@e.fe/template-renderer';

import { argv } from './argv';
import { Template } from './template';

export async function create(options: CreateOptions) {
  // TODO: 检测限制 nodejs 版本

  const {
    mode,
    cwd: _cwd,
    projectName,
    projectDesc = '',
    shouldOverwrite = false,
    template = Template.Library,
    installNow,
    packageManager = 'pnpm',
    prompts,
  } = options;

  if (!projectName) return;

  const isDebug = mode === 'debug';
  const cwd = _cwd || process.cwd();
  const projectRootDir = resolve(cwd, projectName);
  const pkgJsonPath = join(projectRootDir, 'package.json');

  let templatePackage = template;

  const basePkgJson: Record<string, unknown> = {
    author: `${GIT_USER_NAME} <${GIT_USER_EMAIL}>`,
    maintainers: [`${GIT_USER_NAME} <${GIT_USER_EMAIL}>`],
    description: projectDesc,
    volta: {
      node: NODE_VERSION,
      [packageManager]: PACKAGE_MANAGER[packageManager],
    },
  };

  // INFO: isDebug will be true when developing locally, should skip to empty the target dir.
  if (!isDebug && existsSync(projectRootDir) && shouldOverwrite) {
    postOrderDirectoryTraverse(
      projectRootDir,
      dir => rmdirSync(dir),
      file => unlinkSync(file),
    );
  } else if (!existsSync(projectRootDir)) {
    mkdirSync(projectRootDir, { recursive: true });
  }

  if (!existsSync(pkgJsonPath)) {
    writeFileSync(pkgJsonPath, JSON.stringify(basePkgJson, null, 2) + EOL);
  }

  // Support file: protocol, work locally
  if (templatePackage.match(/^file:/)) {
    // eslint-disable-next-line regexp/no-useless-quantifier
    const localTemplatePath = resolve(cwd, templatePackage.match(/^file:(.*)?$/)?.[1] ?? '');
    const { module, main } = JSON.parse(readFileSync(resolve(localTemplatePath, 'package.json'), 'utf-8'));
    const entry = module || main || 'index.js';
    templatePackage = resolve(localTemplatePath, entry);
  }

  const render: RenderFn = (...args) => {
    const [args1] = args;

    if (Array.isArray(args1)) {
      args1.filter(Boolean).forEach(item => {
        if (typeof item === 'string') {
          render2Memory({
            rootDir: projectRootDir,
            src: item,
            dest: projectRootDir,
            data: { ...options },
          });
        } else {
          const { src, dest, data = {}, ...restRenderOptions } = item || {};
          render2Memory({
            ...restRenderOptions,
            rootDir: projectRootDir,
            src,
            dest: dest ?? projectRootDir,
            data: { ...options, ...data },
          });
        }
      });
    } else if (typeof args1 === 'object') {
      const { src, dest, data = {}, ...restRenderOptions } = args1 ?? {};
      render2Memory({
        ...restRenderOptions,
        rootDir: projectRootDir,
        src,
        dest: dest ?? projectRootDir,
        data: { ...options, ...data },
      });
    } else {
      const [src, data = {}, renderOptions = {}] = args;
      const { dest, ...restRenderOptions } = renderOptions;
      render2Memory({
        ...restRenderOptions,
        rootDir: projectRootDir,
        src,
        dest: dest ?? projectRootDir,
        data: { ...options, ...data },
      });
    }
  };

  // TODO: install specified template package
  const { default: tplFn } = await import(templatePackage);

  if (typeof tplFn !== 'function') {
    throw new TypeError(`${templatePackage} must to export a render function`);
  }

  const tplFnRes: TemplateFnReturnType
    = (await tplFn({
      cwd,
      rootDir: projectRootDir,
      projectName,
      projectDesc,
      argv,
      options,
      render,
      prompts,
    } satisfies TplContext<CreateOptions>)) ?? {};

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

  if (!isDebug && installNow) {
    console.log(`\nInstalling by ${packageManager}...\n`);
    // Auto install
    execSync(`${packageManager} install`, {
      cwd: projectRootDir,
      stdio: 'inherit',
    });
  }

  try {
    // Auto lint fix
    execSync('npx eslint . --fix', {
      cwd: projectRootDir,
      stdio: 'ignore',
    });
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error: unknown) {
    // unnecessary
  }

  // Git Init
  let initializedGit = false;
  if (tryGitInit('main', { cwd: projectRootDir })) {
    initializedGit = true;
  }
  // Git commit
  if (initializedGit) {
    tryGitCommit(projectRootDir, 'chore: Initialize using @e.fe/create-app', { cwd: projectRootDir });
  }

  console.log();
  console.log(`Success! Created ${colors.green(projectName)} at ${colors.green(projectRootDir)}`);
  console.log();
  console.log('Now you can start the development:');
  console.log();
  console.log(`  ${colors.cyan('cd')} ${colors.green(projectName)}`);
  console.log(`  ${colors.cyan('npm start')}`);
  console.log();
}
