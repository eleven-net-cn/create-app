# @e.fe/template-renderer

Render templates to disk.

## Usage

```typescript
import { fileURLToPath } from 'node:url';

import { render } from '@e.fe/template-renderer';

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

import { commit, render2memory } from '@e.fe/template-renderer';

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

## Types

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
