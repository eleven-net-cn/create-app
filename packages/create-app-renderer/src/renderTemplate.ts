import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import type { MemFsEditor } from 'mem-fs-editor';
import ejs from 'ejs';
import { deepMerge, isEjsProcessable, sortDependencies } from './helper';
// @ts-expect-error no types
import { isText } from 'istextorbinary';

export interface Options<Data = Record<string, unknown>> {
  rootDir: string;
  src: string;
  dest: string;
  data: Data;
  callbacks: ((dataSource: any) => Promise<void>)[];
  memFs: MemFsEditor;
  /**
   * Files that should be appended to existing files, relative to the root dir or absolute path
   *
   * Default:
   * - `.gitignore`
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

/**
 * Renders a template folder/file to the memory file system (mem-fs-editor), write all files to the file system at the end.
 *
 * with the following exception:
 *   - `_filename` should be renamed to `.filename`
 *   - Fields in `package.json` should be recursively merged
 *   - every text file (not binary, .eg. image, video, audio, etc.) will be rendered with EJS
 *   - If the file has a `.ejs` suffix, it will be rendered with EJS at the end
 *   - If the file has a `.data.mjs` suffix, it will be exported as a function and called at the end, provide the data to the EJS file template
 */
export default function renderTemplate<Data = Record<string, unknown>>(options: Options<Data>): void {
  const {
    rootDir,
    src,
    dest: _dest,
    callbacks,
    data = {},
    memFs,
    toAppend: toAppendExtra = [],
    toMerge: toMergeExtra = [],
  } = options ?? {};
  const stats = fs.statSync(src);

  let dest = _dest;

  if (stats.isDirectory()) {
    // skip node_module
    if (path.basename(src) === 'node_modules') {
      return;
    }

    // if it's a directory, render its subdirectories and files recursively
    for (const file of fs.readdirSync(src)) {
      renderTemplate({ ...options, src: path.resolve(src, file), dest: path.resolve(dest, file) });
    }
    return;
  }

  const filename = path.basename(src);
  // If the.ejs suffix, the conversion is traversed at the end
  const shouldEjsTransform = !filename.endsWith('.ejs') && isEjsProcessable(src);

  const toAbsolutePath = (arr: string[]) => arr.map(item => {
    if (path.isAbsolute(item)) {
      return item;
    }

    if (!rootDir) {
      throw new Error('rootDir is required');
    }

    // ensure absolute path, even if rootDir is relative
    return path.resolve(rootDir, item);
  });

  const toMergeJson = toAbsolutePath([
    'package.json',
    '.vscode/extensions.json',
    '.vscode/settings.json',
    ...toMergeExtra,
  ]);
  const toSortJson = toAbsolutePath(['package.json']);
  const toAppend = toAbsolutePath([
    '.gitignore',
    ...toAppendExtra,
  ]);

  let newContent = shouldEjsTransform ? ejs.render(fs.readFileSync(src, 'utf8'), data) : fs.readFileSync(src, 'utf8');

  // rename `_file` to `.file`
  if (filename.startsWith('_')) {
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, '.'));
  }

  const shouldMergeJson = toMergeJson.includes(dest) && memFs.exists(dest);
  // merge instead of overwriting
  if (shouldMergeJson) {
    // merge instead of overwriting
    const existing = JSON.parse(memFs.read(dest));
    const newJson = JSON.parse(newContent);

    let mergedJson = deepMerge(existing, newJson);

    if (toSortJson.includes(dest)) {
      mergedJson = sortDependencies(mergedJson);
    }

    newContent = `${JSON.stringify(mergedJson, null, 2)}\n`;
  }

  const shouldAppend = toAppend.includes(dest) && memFs.exists(dest);
  // append to existing
  if (shouldAppend) {
    const existing = memFs.read(dest);
    newContent = `${existing}\n${newContent}`;
  }

  // data file for EJS templates
  //  only push the callback to the array for late usage, and skip copying the `.data.mjs` file.
  if (filename.endsWith('.data.mjs')) {
    // use dest path as key for the data store
    dest = dest.replace(/\.data\.mjs$/, '');

    // Add a callback to the array for late usage when template files are being processed
    callbacks.push(async ({ dataStore, options = {} }) => {
      const ejsDataFn = (await import(`${pathToFileURL(src).toString()}?t=${Date.now()}`)).default;

      // Though current `getData` are all sync, we still retain the possibility of async
      dataStore[dest] = await ejsDataFn({
        oldData: dataStore[dest] || {},
        options,
      });
    });

    return; // skip writing the file (*.data.mjs)
  }

  const shouldCopy = !isText(src, fs.readFileSync(src, 'utf8')) && !memFs.exists(dest);

  if (shouldCopy) {
    memFs.copy(src, dest);
    return;
  }

  const existingContent = memFs.exists(dest) ? memFs.read(dest) : undefined;
  const shouldWrite = existingContent !== newContent;

  if (shouldWrite) {
    memFs.write(dest, newContent);
  }
}
