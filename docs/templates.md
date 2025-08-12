# 模板系统

`create-app` 的模板系统基于独立的 npm 包实现，每个模板都是一个完整的包，通过 `defineTemplate()` 函数定义渲染逻辑。这种设计实现了高度的模块化和可扩展性。

## 模板设计

### 模板包结构

一个标准的模板包包含以下结构：

```bash
@e.fe/template-xxx/
├── src/              # 模板脚本
│   ├── index.ts          # 模板主逻辑（使用 defineTemplate）
│   ├── prompts.ts        # 命令行交互
│   └── types.ts          # 类型定义
├── template/         # 模板文件目录
│   ├── _gitignore        # Git 忽略文件（会被重命名为 .gitignore）
│   ├── ...               # 各类模板文件或预置
│   └── package.json
├── README.md
└── package.json
```

### 企业级模板设计

```bash
@e.fe/template-xxx/
├── src/              # 模板脚本
│   ├── index.ts
│   ├── prompts.ts
│   └── types.ts
├── template/         # 模板文件目录
│   ├── base/             # 基础项目文件
│   ├── preset/           # 预置的各类解决方案（如：埋点上报、异常监控、登录 SDK、JSBridge 等）
│   └── solution/         # 业务解决方案（如：C 端模板、Admin 管理后台等），允许预置 preset 中的若干配置方案
├── README.md
└── package.json
```

## 核心概念

### defineTemplate()

`defineTemplate()` 是模板系统的核心函数，用于定义模板的渲染逻辑：

```typescript
import { defineTemplate } from '@e.fe/create-app-helper';

export default defineTemplate(async context => {
  const { cwd, projectName, render, prompts } = context;

  // 模板渲染逻辑
  render('template/');

  return {
    skipInstallNow: true,
    skipSelectPackageManager: true,
  };
});
```

### 模板上下文 (TplContext)

`defineTemplate` 接收一个上下文对象，包含：

```typescript
interface TplContext {
  cwd: string; // 当前工作目录
  rootDir: string; // 生成项目的根目录
  projectName: string; // 项目名称
  projectDesc: string; // 项目描述
  argv: Record<string, any>; // 命令行参数
  options: Options; // 用户输入选项
  render: RenderFn; // 渲染函数
  prompts?: Record<string, unknown>; // 传递给模板的提示数据
}
```

### render() 函数

`render()` 函数用于将模板文件渲染到目标目录，支持多种渲染策略：

```typescript
// 渲染整个目录
render('template/');

// 渲染单个文件
render('template/package.json.ejs');

// 带数据的渲染
render('template/src/', {
  useTypeScript: true,
  framework: 'react'
});

// 复杂渲染选项
render({
  src: 'template/config/',
  dest: 'config/',
  data: { environment: 'production' },
  toAppend: ['.gitignore'], // 追加到现有文件
  toMerge: ['package.json'] // 合并到现有文件
});

// 分步渲染（内存中处理）
render2Memory('template/', { projectName: 'my-app' });
// ... 其他操作
await commit({ environment: 'production' });
```

**渲染特性**：
- **双重渲染机制**：文本文件直接 EJS 渲染，.ejs 文件由 .data.mjs 提供数据
- **智能文件处理**：自动重命名（`_` → `.`）、JSON 合并、文件追加
- **内存操作**：所有文件操作在内存中完成，最后一次性写入磁盘
- **类型安全**：完整的 TypeScript 类型支持

## 模板内的命令行交互

每个模板可以定义自己的交互式提示，收集用户输入：

```typescript
import { group, multiselect, select, text } from '@clack/prompts';

export default () =>
  group(
    {
      framework: () => select({
        message: '选择框架:',
        options: [
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
          { label: 'Vanilla', value: 'vanilla' }
        ]
      }),
      features: () => multiselect({
        message: '选择功能:',
        options: [
          { label: 'TypeScript', value: 'typescript' },
          { label: 'ESLint', value: 'eslint' },
          { label: 'Prettier', value: 'prettier' }
        ]
      }),
      projectName: () => text({
        message: '项目名称:',
        validate: value => {
          if (!/^[a-z0-9-]+$/.test(value)) {
            return '项目名称只能包含小写字母、数字和连字符';
          }
        }
      })
    },
    {
      onCancel() {
        process.exit(0);
      }
    }
  );
```

## 模板文件处理

### 文件重命名

以 `_` 开头的文件会被自动重命名：

```
_gitignore → .gitignore
_env.local → .env.local
```

### 条件渲染

使用 EJS 语法进行条件渲染：

```ejs
<% if (useTypeScript) { %>
// TypeScript 配置
{
  "compilerOptions": {
    "strict": true
  }
}
<% } else { %>
// JavaScript 配置
{
  "type": "module"
}
<% } %>
```

### 文件合并策略

- **toAppend**：追加到现有文件末尾
- **toMerge**：智能合并（如 package.json 的依赖）

### *.data.mjs 文件处理

支持 `.data.mjs` 文件为 `.ejs` 模板提供动态数据：

```typescript
// main.ts.ejs
<%_ for(const block of blocks) { _%>
<%- block %>
<%_ } _%>

// main.ts.data.mjs
import { deepMerge } from '@e.fe/create-app-helper';

export default ({ oldData, options }) => {
  return deepMerge(oldData, {
    blocks: ['block 1', 'block 2'],
    timestamp: new Date().toISOString()
  });
};
```

**多数据文件支持**：
```typescript
// main.ts.data.mjs - 基础配置
export default ({ oldData, options }) => ({
  ...oldData,
  baseConfig: options.baseConfig
});

// main.ts.config.data.mjs - 环境配置
export default ({ oldData, options }) => ({
  ...oldData,
  environment: options.environment
});

// main.ts.features.data.mjs - 功能配置
export default ({ oldData, options }) => ({
  ...oldData,
  features: options.features || []
});
```

**数据合并机制**：
- 多个 `.data.mjs` 文件按顺序执行
- 每个函数接收 `oldData`（之前函数的结果）和 `options`
- 通过 `deepMerge` 函数递归合并数据
- 最终为 `.ejs` 文件提供完整的数据上下文

## 模板组合机制

模板可以通过 `renderStandard()` 函数组合使用：

```typescript
import renderStandard from '@e.fe/template-standard';

export default defineTemplate(async context => {
  // 自定义逻辑
  render('template/');

  // 应用标准配置
  await renderStandard({
    ...context,
    prompts: {
      features: ['eslint', 'commitlint', 'husky']
    }
  });
});
```
