export interface CliOptions extends Required<UserArgv> {
  /** Current working directory */
  cwd: string;
  /** Create a new project with the specified repository */
  repo: string;
}

export interface ExtraCmdOption<Name = string> {
  /** parameter name */
  name: Name;
  /** discriptor in the cmd */
  label: string;
  /** shortcut option in the cmd, must be 1 character */
  alias?: string;
  /** declared with angle brackets like --expect <value> */
  bracket?: string;
  /** whether the parameter is boolean */
  type?: 'boolean';
}

export type PackageManager = 'pnpm' | 'npm' | 'yarn';

/**
 *
 */
export interface UserArgv {
  /** Whether to overwrite the existing directory */
  overwrite?: boolean;
  /** Template name, @scope/template-*, or local directory path */
  template?: string;
  /** Package Manager */
  packageManager?: PackageManager;
}

export interface Answers extends Required<Omit<UserArgv, 'overwrite'>> {
  /** Project Name */
  projectName: string;
  /** Project Description */
  projectDesc: string;
  /** Whether to overwrite the existing project */
  shouldOverwrite: boolean;
}

export interface CreateOptions extends CliOptions, Answers {
  mode?: 'debug';
  prompts?: Record<string, unknown>;
}
