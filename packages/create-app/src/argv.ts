import type { Answers, ExtraCmdOption, UserArgv } from './types';
import minimist from 'minimist';
import { templates } from './template';

export const extraCmdOptions: ExtraCmdOption<keyof UserArgv>[] = [
  {
    name: 'overwrite',
    label: '若目录已存在允许覆盖',
    type: 'boolean',
  },
  {
    name: 'packageManager',
    label: '包管理器',
    alias: 'P',
    bracket: 'pnpm/npm/yarn',
  },
  {
    name: 'template',
    label: '从指定模板生成新项目',
    alias: 'T',
    bracket: templates.map(({ value }) => value).join(','),
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
