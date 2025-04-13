import process from 'node:process';
import { execSilent } from './utils';

export const PLAT_NPM_USER_NAME = execSilent('npm whoami');

export const GIT_USER_NAME = execSilent('git config user.name');

export const GIT_USER_EMAIL = execSilent('git config user.email');

export const NODE_VERSION = process.versions.node;

export const NPM_VERSION = execSilent('npm -v');

export const YARN_VERSION = execSilent('yarn -v');

export const PNPM_VERSION = execSilent('pnpm -v');

export const PACKAGE_MANAGER: Record<'pnpm' | 'npm' | 'yarn', string> = {
  npm: NPM_VERSION,
  yarn: YARN_VERSION,
  pnpm: PNPM_VERSION,
} as const;
