# @e.fe/create-app-renderer

Render templates to disk.

## Usage

```typescript
import { fileURLToPath } from 'node:url';

import { render } from '@e.fe/create-app-renderer';

const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../template');
const resolveDir = (dir: string) => resolve(templateDir, dir);

// Render templates to disk
await render([
  {
    src: resolveDir('template/base'),
  },
  neededJest && {
    src: resolveDir('template/jest'),
  },
  ...
]);
```

Or, render to disk step by step:

```typescript
import { fileURLToPath } from 'node:url';

import { commit, render2memory } from '@e.fe/create-app-renderer';

const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../template');
const resolveDir = (dir: string) => resolve(templateDir, dir);

// Render templates in memory
render2memory([
  {
    src: resolveDir('template/base'),
  },
  neededJest && {
    src: resolveDir('template/jest'),
  },
  ...
]);

// do anything...

// Commit changes to disk
await commit();
```

## Template Rules

- Incrementally write files to the target folder (rootDir), files with the same name will be overwritten (except for some explicitly specified files)

- Files that will be automatically merged

  - `/package.json`
  - `/.vscode/extensions.json`
  - `/.vscode/settings.json`

  If you have additional files to merge, pass their relative paths through `toMerge`

- Files that will be automatically appended to:

  - `.gitignore`

  If you have additional files to append to, pass their relative paths through `toAppend`

- `_filename` should be renamed to `.filename`

- Fields in `package.json` should be recursively merged

- every text file (not binary, .eg. image, video, audio, etc.) will be rendered with EJS

- If the file has a `.ejs` suffix, it will be rendered with EJS at the end, data comes from the file with the same name and `.data.mjs` suffix

  For example:

  - `main.ts.ejs`

    ```typescript
    <%_ for(const block of blocks) { _%>
    <%- block %>
    <%_ } _%>
    ```

  - `main.ts.data.mjs`

    ```typescript
    export default ({ oldData, options }) => {
      return {
        blocks: ['block 1', 'block 2'],
      };
    };
    ```

## DTS

```typescript
/**
 * Render templates to disk
 */
declare function render(array: Options[]): Promise<void>;
declare function render(options: Options): Promise<void>;
declare function render(
  src: string,
  data?: Record<string, unknown>,
  options?: Omit<Options, 'src' | 'data'>
): Promise<void>;

/**
 * Render files in memory, only write to disk after calling commit.
 */
declare function render2Memory(array: Options[]): void;
declare function render2Memory(options: Options): void;
declare function render2Memory(
  src: string,
  data?: Record<string, unknown>,
  options?: Omit<Options, 'src' | 'data'>
): void;

/**
 * Write files to disk after rendering.
 *
 * @param ejsFnExtraData - The extra data to be passed to the ejs data function (*.data.mjs)
 */
declare function commit(ejsFnExtraData?: Record<string, unknown>): Promise<void>;
```
