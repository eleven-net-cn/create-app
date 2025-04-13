export interface RenderOptions<Data = Record<string, unknown>> {
  /** Source directory or file path */
  src: string;
  /** Destination directory or file path, Default: target project root dir */
  dest?: string;
  /** Template data to be passed to the ejs template */
  data?: Data;
  /**
   * Files that should be appended to existing files, relative to the root dir or absolute path
   *
   * Default:
   * - `.gitignore`
   * - `env.d.ts`
   *
   * If filename starts with `_`, please use `.filename` instead.
   *
   * e.g. `_gitignore` -> `.gitignore`
   */
  toAppend?: string[];
  /**
   * Files that should be merged with existing files, relative to the root dir or absolute path
   *
   * Default:
   * - `package.json`
   * - `.vscode/extensions.json`
   * - `.vscode/settings.json`
   */
  toMerge?: string[];
}

export type RenderFn = ((src: string, data?: Record<string, unknown>, options?: Omit<RenderOptions, 'src' | 'data'>) => void) &
  ((args: (string | RenderOptions)[]) => void) & ((options: RenderOptions) => void);

export interface TplContext<Options = Record<string, unknown>> {
  /** Current working directory */
  cwd: string;
  /** The root directory of the generated app */
  rootDir: string;
  /** The name of the generated app */
  projectName: string;
  /** Command line arguments from user input */
  argv: Record<string, any>;
  /** User prompt answers, only available in prompts */
  options: Options;
  /** Render the specified directory to the generated app root directory */
  render: RenderFn;
  /** Pass to template prompts, will skip user prompts */
  prompts?: Record<string, unknown>;
}

export interface TemplateFnReturnType<Prompts = Record<string, unknown>> {
  prompts: Prompts;
  afterRender?: () => Promise<void> | void;
}

export type TemplateFn<Prompts = Record<string, unknown>> = (ctx: TplContext) => Promise<TemplateFnReturnType<Prompts> | void> | TemplateFnReturnType<Prompts> | void;

export default function defineTemplate<Prompts = Record<string, unknown>>(fn: TemplateFn<Prompts>) {
  return fn;
}
