import type { PackageManager } from './types';

import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { cancel, confirm, group, select, text } from '@clack/prompts';

import colors from 'picocolors';
import { argv } from './argv';
import { templates } from './template';

export default () =>
  group(
    {
      projectName: () =>
        text({
          message: `请输入项目名称${colors.gray('（小写字母、数字，中划线连接）')}：`,
          validate(value: string) {
            // 小写字母、数字，中划线连接
            // eslint-disable-next-line regexp/no-unused-capturing-group
            const regComponentName = /^[a-z0-9]+(-[a-z0-9]+)*$/;

            if (!regComponentName.test(value)) {
              return colors.yellow(`格式错误${colors.cyan('（小写字母、数字，中划线连接）')}`);
            }
          },
        }),
      shouldOverwrite: ({ results: { projectName } }) => {
        const cwd = argv.cwd || process.cwd();
        const projectRootDir = join(cwd, projectName);

        if (!existsSync(projectRootDir)) return null;
        if (argv.overwrite !== undefined) return argv.overwrite;

        return confirm({
          message: `已存在 ${colors.green(projectRootDir)}，是否覆盖？`,
          initialValue: false,
          active: `是（${colors.yellow(
            `${colors.bold('注意：')}已存在的目录 ${colors.green(basename(projectRootDir))} 会被清空覆盖！`,
          )}）`,
          inactive: '否',
        }).then(overwrite => {
          if (!overwrite) {
            cancel(colors.yellow('请输入其它项目名称'));
            process.exit(0);
          }
          return overwrite;
        });
      },
      projectDesc: () =>
        text({
          message: `请输入项目描述${colors.gray('（非必填，Enter 跳过）')}：`,
          initialValue: '',
        }),
      template: async () => {
        if (argv.template) {
          return argv.template;
        }

        if (templates.length <= 1) return null;

        return select({
          message: '请选择：',
          initialValue: 'library',
          options: templates,
        });
      },
      packageManager: async () => {
        if (argv.packageManager) {
          return argv.packageManager;
        }

        return select<PackageManager>({
          message: '请选择包管理器：',
          initialValue: 'pnpm',
          options: [
            {
              label: 'pnpm',
              value: 'pnpm',
            },
            {
              label: 'npm',
              value: 'npm',
            },
            {
              label: 'yarn',
              value: 'yarn',
            },
          ],
        });
      },
    },
    {
      onCancel() {
        process.exit(0);
      },
    },
  );
