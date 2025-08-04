# 快速开始

## 基本使用

### 创建新项目

```bash
# 使用默认模板创建项目
npx @e.fe/create-app@latest my-project

# 使用指定模板创建项目
npx @e.fe/create-app@latest my-project -T @e.fe/template-react

# 使用本地模板
npx @e.fe/create-app@latest my-project -T file:./my-template
```

### 向现有项目添加配置

```bash
# 向现有项目添加开发工具配置
npx @e.fe/create-app@latest -T @e.fe/template-standard --mixin

# 使用本地模板包
npx @e.fe/create-app@latest -T file:./my-template --mixin
```

## 命令行选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `-T, --template` | string | - | 指定模板包 |
| `--mixin` | boolean | false | 混合模式，应用到现有项目 |
| `--yes` | boolean | false | 跳过交互式提示 |
| `--help` | boolean | false | 显示帮助信息 |

## 常用模板包

### 使用第三方模板包

```bash
# 使用 npm 包
npx @e.fe/create-app@latest -T my-template-package

# 使用 GitHub 仓库
npx @e.fe/create-app@latest -T github:username/repo

# 使用本地路径
npx @e.fe/create-app@latest -T file:./local-template
```

### 向现有项目添加工具配置

```bash
# 进入现有项目
cd my-existing-project

# 添加标准开发工具配置
npx @e.fe/create-app@latest -T @e.fe/template-standard --mixin

# 安装新添加的依赖
pnpm install
```

## 下一步

- 了解 [核心特性](/guide/features) 了解更多功能
- 学习 [渲染引擎](/core/rendering) 了解技术原理
- 查看 [模板系统](/core/templates) 学习如何开发自定义模板
