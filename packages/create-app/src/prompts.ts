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
          message: `Enter project name${colors.gray(' (lowercase letters, numbers, connected by hyphens)')}:`,
          validate(value: string) {
            // lowercase letters, numbers, connected by hyphens
            // eslint-disable-next-line regexp/no-unused-capturing-group
            const regComponentName = /^[a-z0-9]+(-[a-z0-9]+)*$/;

            if (!regComponentName.test(value)) {
              return colors.yellow(`Invalid format${colors.cyan(' (lowercase letters, numbers, connected by hyphens)')}`);
            }
          },
        }),
      shouldOverwrite: ({ results: { projectName } }) => {
        const cwd = argv.cwd || process.cwd();
        const projectRootDir = join(cwd, projectName);

        if (!existsSync(projectRootDir)) return null;
        if (argv.overwrite !== undefined) return argv.overwrite;

        return confirm({
          message: `${colors.green(projectRootDir)} already exists, overwrite?`,
          initialValue: false,
          active: `Yes (${colors.yellow(
            `${colors.bold('Note:')} Existing directory ${colors.green(basename(projectRootDir))} will be cleared and overwritten!`,
          )})`,
          inactive: 'No',
        }).then(overwrite => {
          if (!overwrite) {
            cancel(colors.yellow('Please enter a different project name'));
            process.exit(0);
          }
          return overwrite;
        });
      },
      projectDesc: () =>
        text({
          message: `Enter project description${colors.gray(' (optional, press Enter to skip)')}:`,
          initialValue: '',
        }),
      template: async () => {
        if (argv.template) {
          return argv.template;
        }

        if (templates.length <= 1) return null;

        return select({
          message: 'Please select:',
          initialValue: 'library',
          options: templates,
        });
      },
      packageManager: async () => {
        if (argv.packageManager) {
          return argv.packageManager;
        }

        return select<PackageManager>({
          message: 'Select package manager:',
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
      installNow: async () => confirm({
        message: 'Do you want to install now?',
        initialValue: true,
      }),
    },
    {
      onCancel() {
        process.exit(0);
      },
    },
  );
