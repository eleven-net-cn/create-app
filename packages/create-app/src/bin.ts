import type { Answers, CliOptions } from './types';
import { Command } from 'commander';
import leven from 'leven';

import colors from 'picocolors';
import { version } from '../package.json';
import { extraCmdOptions } from './argv';
import { create } from './create';
import prompts from './prompts';

const program = new Command();

program.version(version, '-V, --version').description('@e.fe/create-app');

program.option('-R, --repo <url>', 'Generate new project from target repository');
program.option('--cwd <path>', 'Specify working directory');

extraCmdOptions.forEach(item => {
  const { name, label, alias, bracket, type } = item ?? {};
  const _bracket = type === 'boolean' ? '' : ` <${bracket ?? 'value'}>`;
  const flags = alias ? `-${alias}, --${name}${_bracket}` : `--${name}${_bracket}`;
  program.option(flags, label);
});

program.action(async (options: CliOptions) => {
  const answers = await prompts() as Answers;
  await create({
    ...answers,
    ...options,
  });
});

program.on('command:*', ([unknownCommand]) => {
  program.outputHelp();
  console.log(colors.red(`\nUnknown command ${colors.yellow(unknownCommand)}.\n`));

  let suggestion: string = '';

  program.commands
    .map((cmd: any) => cmd._name)
    .forEach(cmd => {
      const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);

      if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
        suggestion = cmd;
      }
    });

  if (suggestion) {
    console.log(colors.red(`Did you mean ${colors.yellow(suggestion)}?\n`));
  }

  process.exit(1);
});

program.parse();
