# 渲染引擎

`create-app` 的核心是 `create-app-renderer` 包，它提供了强大而灵活的文件渲染能力，支持内存中的文件操作和智能的文件处理策略。

## 核心特性

### 内存文件系统

渲染引擎使用 `mem-fs` 和 `mem-fs-editor` 在内存中处理所有文件操作，确保文件一致性：

```typescript
import { create as createMemFs } from 'mem-fs';
import { create as createEditor } from 'mem-fs-editor';

const store = createMemFs();
const memFs = createEditor(store);
```

### 双重渲染机制

#### 1. 文本文件 EJS 处理

所有文本类型的文件都会经过 EJS 处理，支持动态内容生成：

```ejs
// package.json.ejs
{
  "name": "<%= projectName %>",
  "version": "1.0.0",
  "description": "<%= description %>",
  "main": "<%= useTypeScript ? 'dist/index.js' : 'src/index.js' %>",
  "scripts": {
    "dev": "<%= bundler === 'vite' ? 'vite' : 'rollup -c -w' %>",
    "build": "<%= bundler === 'vite' ? 'vite build' : 'rollup -c' %>"
  }
}
```

**智能检测**：通过 `isEjsProcessable()` 函数检测文件是否包含 EJS 语法 (`<% %>`)，只有包含 EJS 语法的文件才会进行模板渲染。

#### 2. 特殊 .ejs 文件处理

`.ejs` 后缀的文件有特殊的处理流程：

- 由同名的 `.data.mjs` 文件提供渲染数据
- 支持多个 `.data.mjs` 文件按顺序执行并合并数据
- 在最后执行 `.ejs` 文件渲染时提供最终的数据

### *.data.mjs 文件处理

支持 `.data.mjs` 文件作为数据提供者，为 EJS 模板提供动态数据：

```javascript
// config.data.mjs
import { deepMerge } from '@e.fe/create-app-helper';

export default function getData({ oldData, options }) {
  return deepMerge(oldData, {
    environment: options.environment || 'development',
    features: options.features || [],
    timestamp: new Date().toISOString()
  });
}
```

**数据合并策略**：
- 多个 `.data.mjs` 文件按顺序执行
- 每个函数接收 `oldData`（之前函数的结果）和 `options`
- 通过 `deepMerge` 函数递归合并数据
- 最终为 `.ejs` 文件提供完整的数据上下文

**示例**：
```typescript
// main.ts.ejs
<%_ for(const block of blocks) { _%>
<%- block %>
<%_ } _%>

// main.ts.data.mjs
export default ({ oldData, options }) => {
  return {
    ...oldData,
    blocks: ['block 1', 'block 2'],
  };
};
```

## 文件处理策略

### 文件重命名

以 `_` 开头的文件会被自动重命名：

```
_gitignore → .gitignore
_env.local → .env.local
_vscode/settings.json → .vscode/settings.json
```

### 智能文件合并

支持多种文件合并策略：

#### JSON 文件合并

`package.json`、`.vscode/extensions.json`、`.vscode/settings.json` 等文件会进行递归合并：

```typescript
// 自动合并依赖和配置
const existing = JSON.parse(memFs.read(dest));
const newJson = JSON.parse(newContent);
const mergedJson = deepMerge(existing, newJson);

// package.json 还会自动排序依赖
if (toSortJson.includes(dest)) {
  mergedJson = sortDependencies(mergedJson);
}
```

#### 文件追加

`.gitignore` 等文件会追加到现有文件末尾：

```typescript
// 追加内容而不是覆盖
const existing = memFs.read(dest);
newContent = `${existing}\n${newContent}`;
```

### 二进制文件处理

自动识别二进制文件（图片、视频、音频等），直接复制而不进行模板渲染：

```typescript
import { isText } from 'istextorbinary';

const shouldCopy = !isText(src, fs.readFileSync(src, 'utf8')) && !memFs.exists(dest);
if (shouldCopy) {
  memFs.copy(src, dest);
}
```

## 渲染流程

### 1. 内存渲染阶段

```typescript
// 在内存中处理所有文件
render2Memory('template/', { projectName: 'my-app' });
render2Memory('config/', { environment: 'production' });

// 或者批量处理
render2Memory([
  {
    src: 'template/base',
    data: { projectName: 'my-app' }
  },
  {
    src: 'template/jest',
    data: { useJest: true }
  }
]);
```

**处理过程**：
- 递归遍历源目录
- 跳过 `node_modules` 目录
- 处理文件重命名（`_` → `.`）
- 执行 EJS 模板渲染（对于包含 EJS 语法的文件）
- 处理 JSON 文件合并和文件追加
- 收集 `.data.mjs` 文件回调函数

### 2. 数据文件回调处理

执行所有 `.data.mjs` 文件定义的回调函数：

```typescript
// 处理数据文件回调
for (const cb of callbacks) {
  await cb({
    dataStore: ejsDataStore,
    ...ejsFnExtraData,
  });
}
```

**回调机制**：
- 每个 `.data.mjs` 文件导出的函数会被添加到回调数组
- 回调函数按顺序执行，支持异步操作
- 通过 `dataStore` 共享数据，以目标文件路径为键
- 支持传递额外的数据参数

### 3. EJS 模板渲染

处理所有 `.ejs` 文件：

```typescript
// 渲染 EJS 模板
store.each(file => {
  if (file.path.endsWith('.ejs')) {
    const template = memFs.read(file.path);
    const dest = file.path.replace(/\.ejs$/, '');
    const content = ejs.render(template, ejsDataStore[dest]);

    memFs.delete(file.path);
    memFs.write(dest, content);
  }
});
```

**渲染过程**：
- 遍历内存文件系统中的所有 `.ejs` 文件
- 从对应的 `dataStore` 中获取渲染数据
- 使用 EJS 引擎渲染模板
- 删除原始的 `.ejs` 文件
- 写入渲染后的内容到目标文件

### 4. 写入磁盘

最后将所有文件写入磁盘：

```typescript
await memFs.commit();
```

## 使用方式

### 直接渲染到磁盘

```typescript
import { render } from '@e.fe/create-app-renderer';

// 渲染单个模板
await render('template/', { projectName: 'my-app' });

// 渲染多个模板
await render([
  {
    src: 'template/base',
    data: { projectName: 'my-app' }
  },
  {
    src: 'template/jest',
    data: { useJest: true }
  }
]);
```

### 分步渲染

```typescript
import { commit, render2Memory } from '@e.fe/create-app-renderer';

// 在内存中渲染
render2Memory('template/', { projectName: 'my-app' });

// 执行其他操作...

// 提交到磁盘
await commit({ environment: 'production' });
```

## 高级功能

### 条件渲染

通过 EJS 的条件语句实现动态内容：

```ejs
<% if (useTypeScript) { %>
// TypeScript 配置
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020"
  }
}
<% } else { %>
// JavaScript 配置
{
  "type": "module"
}
<% } %>
```

### 循环渲染

支持数组和对象的循环渲染：

```ejs
<% dependencies.forEach(function(dep) { %>
import <%= dep.name %> from '<%= dep.package %>';
<% }); %>

<% Object.keys(scripts).forEach(function(script) { %>
"<%= script %>": "<%= scripts[script] %>",
<% }); %>
```

### 自定义助手函数

可以注册自定义的 EJS 助手函数：

```typescript
import ejs from 'ejs';

ejs.filters.uppercase = function (str) {
  return str.toUpperCase();
};

ejs.filters.kebabCase = function (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
```

### 多数据文件支持

支持为同一个 `.ejs` 文件提供多个 `.data.mjs` 文件：

```typescript
// main.ts.data.mjs
export default ({ oldData, options }) => ({
  ...oldData,
  baseConfig: options.baseConfig
});

// main.ts.config.data.mjs
export default ({ oldData, options }) => ({
  ...oldData,
  environment: options.environment
});

// main.ts.features.data.mjs
export default ({ oldData, options }) => ({
  ...oldData,
  features: options.features || []
});
```
