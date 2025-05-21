import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { cancel, confirm, group, select, text } from '@clack/prompts';

import colors from 'picocolors';
import { argv } from './argv';
import { App, app } from './app';

const whenCreateByCmd = (appType: App, createType: string) => {
  const createTypes = app[appType];
  const { command } = createTypes.find(item => item.value === createType);
  return command !== undefined;
};

export default () =>
  group(
    {
      appType: () => select({
        message: 'Select app type:',
        options: [
          {
            label: 'React App',
            value: App.React,
          },
          {
            label: 'Vue App',
            value: App.Vue,
          },
          {
            label: 'Library（SDK）',
            value: App.Library,
          },
          {
            label: 'Monorepo（packages/apps）',
            value: App.Monorepo,
          },
        ],
      }),
      createType: ({ results: { appType } }) => {
        const createTypes = app[appType];

        if (createTypes.length <= 1) {
          return Promise.resolve(createTypes[0]?.value);
        }

        return select<string>({
          message: 'Please Select:',
          options: createTypes.map(item => ({
            hint: item.command || item.template,
            ...item,
          })),
        });
      },
      projectName: ({ results: { appType, createType } }) => {
        if (whenCreateByCmd(appType, createType as string)) return null;

        return text({
          message: `Enter project name${colors.gray(' (lowercase letters, numbers, connected by hyphens)')}:`,
          validate(value: string) {
            // lowercase letters, numbers, connected by hyphens
            // eslint-disable-next-line regexp/no-unused-capturing-group
            const regComponentName = /^[a-z0-9]+(-[a-z0-9]+)*$/;

            if (!regComponentName.test(value)) {
              return colors.yellow(
                `Invalid format${colors.cyan(' (lowercase letters, numbers, connected by hyphens)')}`,
              );
            }
          },
        });
      },
      shouldOverwrite: ({ results: { appType, createType, projectName } }) => {
        if (whenCreateByCmd(appType, createType as string)) return null;

        const cwd = argv.cwd || process.cwd();
        const projectRootDir = join(cwd, projectName as string);

        if (!existsSync(projectRootDir)) return null;
        if (argv.overwrite !== undefined) return Promise.resolve(argv.overwrite);

        return confirm({
          message: `${colors.green(projectRootDir)} already exists, overwrite?`,
          initialValue: false,
          active: `Yes (${colors.yellow(
            `${colors.bold('Note:')} Existing directory ${colors.green(
              basename(projectRootDir),
            )} will be cleared and overwritten!`,
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
      projectDesc: ({ results: { appType, createType } }) => {
        if (whenCreateByCmd(appType, createType as string)) return null;

        return text({
          message: `Enter project description${colors.gray(' (optional, press Enter to skip)')}:`,
          initialValue: '',
        });
      },
    },
    {
      onCancel() {
        process.exit(0);
      },
    },
  );
