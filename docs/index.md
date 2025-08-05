## 快速开始

### 创建新项目

```bash
# 使用默认模板创建项目
npm create @e.fe/app@latest my-project

# 使用指定模板创建项目
npm create @e.fe/app@latest my-project -T @e.fe/template-react

# 使用本地模板
npm create @e.fe/app@latest my-project -T file:./my-template

# 指定包管理器
npm create @e.fe/app@latest my-project -P npm

# 允许覆盖已存在的目录
npm create @e.fe/app@latest my-project --overwrite

# 指定工作目录
npm create @e.fe/app@latest my-project --cwd /path/to/directory
```

### 向现有项目添加配置

```bash
# 向现有项目添加开发工具配置
npx @e.fe/create-app@latest -T @e.fe/template-standard --mixin

# 使用本地模板包
npx @e.fe/create-app@latest -T file:./my-template --mixin

# 指定包管理器
npx @e.fe/create-app@latest -T @e.fe/template-standard --mixin -P yarn
```

## 命令行选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `-V, --version` | - | - | 显示版本信息 |
| `--cwd <path>` | string | 当前目录 | 指定工作目录 |
| `--overwrite` | boolean | false | 允许覆盖已存在的目录 |
| `-P, --packageManager` | string | pnpm | 指定包管理器 (pnpm/npm/yarn) |
| `-T, --template` | string | - | 指定模板包 |
| `--mixin` | boolean | false | 混合模式，应用到现有项目 |
| `-h, --help` | - | - | 显示帮助信息 |

### 子命令

| 命令 | 别名 | 描述 |
|------|------|------|
| `tiged <src>` | `from-repo` | 从目标仓库生成新项目 |

## 使用第三方模板包

```bash
# 使用 npm 包
npm create @e.fe/app@latest -T my-template-package

# 使用本地路径
npm create @e.fe/app@latest -T file:./local-template

# 从 GitHub 仓库生成项目
npm create @e.fe/app@latest tiged username/repo-name

# 从 GitHub 仓库生成项目（使用别名）
npm create @e.fe/app@latest from-repo username/repo-name
```

## 为什么开发 create-app

流行的脚手架工具存在各种问题，最重要的有以下几点：

1. **基本都不能热更新调试模板**，模板的测试较为浪费时间
2. **有的不能自由组合模板**，而仅仅从固定模板创建或从仓库下载，当我们有多个模板时持续维护较为困难

工作中，我需要为团队开发一款更棒的脚手架工具，这是最初写代码的起点。
