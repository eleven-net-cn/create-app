# 模板系统

`create-app` 的模板系统基于独立的 npm 包实现，每个模板都是一个完整的包，通过 `defineTemplate()` 函数定义渲染逻辑。这种设计实现了高度的模块化和可扩展性。

## 架构设计

### 模板包结构

一个标准的模板包包含以下结构：

```
@e.fe/template-xxx/
├── package.json          # 模板包配置
├── src/
│   ├── index.ts          # 模板主逻辑（使用 defineTemplate）
│   ├── prompts.ts        # 交互式提示配置
│   └── types.ts          # 类型定义
├── template/             # 模板文件目录
│   ├── _gitignore        # Git 忽略文件（会被重命名为 .gitignore）
│   ├── package.json.ejs  # 项目配置文件模板
│   └── src/              # 源代码模板
└── dist/                 # 构建输出目录
```

### 核心设计原则

1. **独立性**：每个模板包都是独立的 npm 包，可以单独发布和维护
2. **可组合性**：模板包之间可以相互引用和组合
3. **类型安全**：完整的 TypeScript 支持，提供类型检查和智能提示
4. **可扩展性**：支持自定义渲染逻辑和文件处理策略

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

## 交互式提示系统

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

## 企业级特性

### 类型安全

完整的 TypeScript 支持，提供编译时类型检查：

```typescript
interface TemplatePrompts {
  framework: 'react' | 'vue' | 'vanilla';
  features: string[];
  projectName: string;
}

export default defineTemplate(async context => {
  const { prompts: injectPrompts } = context;
  const userPrompts = injectPrompts as TemplatePrompts;

  // 类型安全的模板逻辑
  if (userPrompts.framework === 'react') {
    render('template/react/');
  }
});
```

### 错误处理

完善的错误处理机制：

```typescript
export default defineTemplate(async context => {
  try {
    const { render, projectName } = context;

    if (!projectName) {
      throw new Error('项目名称是必需的');
    }

    render('template/');
  } catch (error) {
    console.error('模板渲染失败:', error.message);
    process.exit(1);
  }
});
```

### 生命周期钩子

支持模板渲染的生命周期管理：

```typescript
export default defineTemplate(async context => {
  // 渲染逻辑
  render('template/');

  return {
    skipInstallNow: false,
    afterRender: async () => {
      // 后处理逻辑
      console.log('✅ 项目创建完成！');
    }
  };
});
```

## 扩展性设计

### 自定义渲染逻辑

支持复杂的自定义渲染逻辑：

```typescript
export default defineTemplate(async context => {
  const { render, prompts: injectPrompts } = context;
  const { framework, features } = injectPrompts ?? await prompts();

  // 条件渲染
  render([
    'template/base/',
    framework === 'react' && 'template/react/',
    framework === 'vue' && 'template/vue/',
    features.includes('typescript') && 'template/typescript/',
    features.includes('testing') && 'template/testing/'
  ].filter(Boolean));
});
```

### 数据驱动渲染

支持数据驱动的模板渲染：

```typescript
export default defineTemplate(async context => {
  const { render } = context;

  // 从配置文件读取渲染数据
  const config = await loadConfig();

  render('template/', {
    ...config,
    timestamp: new Date().toISOString()
  });
});
```

这种设计使 `create-app` 的模板系统既灵活又强大，每个模板都是独立的包，可以自由组合和扩展，同时保持高度的类型安全性和可维护性。
