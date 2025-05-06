import process from 'node:process';

import { create as createMemFs } from 'mem-fs';
import { create as createEditor } from 'mem-fs-editor';
import ejs from 'ejs';

import renderTemplate, { type Options as RenderTemplateOptions } from './renderTemplate';

export interface Options<Data = Record<string, unknown>> extends Pick<RenderTemplateOptions, 'toMerge' | 'toAppend'> {
  /** Root directory, Default: current working directory */
  rootDir: string;
  /** Source directory or file path */
  src: string;
  /** Destination directory or file path, Default: current working directory */
  dest?: string;
  /** Template data to be passed to the ejs template */
  data?: Data;
}

const store = createMemFs();
const callbacks = []; // will be executed after all of the template files are created

export const memFs = createEditor(store);

/**
 * Render templates to disk
 */
export async function render(array: Options[]): Promise<void>;
export async function render(options: Options): Promise<void>;
export async function render(src: string, data?: Record<string, unknown>, options?: Omit<Options, 'src' | 'data'>): Promise<void>;
export async function render(...args: [Options[]] | [Options] | [string, Record<string, unknown>?, Omit<Options, 'src' | 'data'>?]): Promise<void> {
  render2Memory.apply(this, args);
  await commit();
}

/**
 * Render files in memory, only write to disk after calling commit.
 */
export function render2Memory(array: Options[]): void;
export function render2Memory(options: Options): void;
export function render2Memory(src: string, data?: Record<string, unknown>, options?: Omit<Options, 'src' | 'data'>): void;
export function render2Memory(...args: [Options[]] | [Options] | [string, Record<string, unknown>?, Omit<Options, 'src' | 'data'>?]): void {
  const [args1] = args;

  const _options: RenderTemplateOptions = {
    rootDir: process.cwd(),
    src: undefined,
    dest: process.cwd(),
    data: {},
    callbacks,
    memFs,
  };

  if (Array.isArray(args1)) {
    args1.filter(Boolean).forEach(item => {
      const { dest, rootDir } = item;

      renderTemplate({
        ..._options,
        ...item,
        dest: dest ?? rootDir,
      });
    });
  } else if (typeof args1 === 'object') {
    const { dest, rootDir } = args1 ?? {};

    renderTemplate({
      ..._options,
      ...args1,
      dest: dest ?? rootDir,
    });
  } else {
    const [src, data = {}, options = {}] = args as [string, Record<string, unknown>, Omit<Options, 'src' | 'data'>];
    const { dest, rootDir, ...restOptions } = options as Omit<Options, 'src' | 'data'>;

    renderTemplate({
      ..._options,
      ...restOptions,
      src,
      dest: dest ?? rootDir,
      data,
    });
  }
}

/**
 * Write files to disk after rendering.
 *
 * @param ejsFnExtraData - The extra data to be passed to the ejs data function (*.data.mjs)
 */
export async function commit(ejsFnExtraData: Record<string, unknown> = {}): Promise<void> {
  // An external data store for callbacks to share data
  const ejsDataStore = {};
  // Process callbacks
  for (const cb of callbacks) {
    await cb({
      dataStore: ejsDataStore,
      ...ejsFnExtraData,
    });
  }

  // EJS template rendering
  store.each(file => {
    if (file.path.endsWith('.ejs')) {
      const template = memFs.read(file.path);
      const dest = file.path.replace(/\.ejs$/, '');
      const content = ejs.render(template, ejsDataStore[dest]);

      memFs.delete(file.path);
      memFs.write(dest, content);
    }
  });

  // TODO: AST 解析部分文件依赖，合并、去重
  await memFs.commit();
}
