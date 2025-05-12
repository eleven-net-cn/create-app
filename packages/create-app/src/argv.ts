import type { Answers, ExtraCmdOption, UserArgv } from './types';
import minimist from 'minimist';

export const extraCmdOptions: ExtraCmdOption<keyof UserArgv>[] = [
  {
    name: 'overwrite',
    label: 'allow overwriting if directory exists',
    type: 'boolean',
  },
  {
    name: 'packageManager',
    label: 'package manager',
    alias: 'P',
    bracket: 'pnpm/npm/yarn',
  },
  {
    name: 'template',
    label: 'generate new project from specified template',
    alias: 'T',
    bracket: '@scope/template-pkg-name',
  },
];

export const argv = minimist<Answers>(process.argv.slice(2), {
  alias: extraCmdOptions.reduce((acc: Record<string, string>, option) => {
    if (option.alias) {
      if (option.alias.length > 1) {
        throw new Error('alias length must be 1');
      }
      acc[option.alias] = option.name;
    }
    return acc;
  }, {}),
});
