# 核心特性

`create-app` 是一个专为现代 Web 开发设计的强大脚手架工具，提供了丰富的功能和灵活的配置选项。

## ⚡ 快速项目创建

基于 npx 的零配置使用，无需全局安装：

```bash
# 一键创建项目
npx @e.fe/create-app@latest my-project

# 指定模板创建
npx @e.fe/create-app@latest my-project -T @e.fe/template-react
```

## 🎨 模板包自由组合

支持多个模板包的组合使用，创建复杂的项目结构：

```bash
# 创建 React 项目
npx @e.fe/create-app@latest my-project -T @e.fe/template-react

# 向现有项目添加标准配置
npx @e.fe/create-app@latest -T @e.fe/template-standard --mixin
```

## 🔄 混合模式支持

可以向现有项目添加配置，无需重新创建项目：

```bash
# 向现有项目添加开发工具配置
npx @e.fe/create-app@latest -T @e.fe/template-standard --mixin

# 使用本地模板包
npx @e.fe/create-app@latest -T file:./my-template --mixin
```

## 🚀 内存组装，一次性写入

所有模板在内存中组装完成后再写入磁盘，确保文件一致性：

```bash
# 创建包含多个模板的复杂项目
npx @e.fe/create-app@latest -T @e.fe/template-monorepo
cd my-monorepo
npx @e.fe/create-app@latest -T @e.fe/template-react --mixin
npx @e.fe/create-app@latest -T @e.fe/template-standard --mixin
```

## 🛠️ 灵活的渲染引擎

基于 EJS 的强大模板引擎，支持动态内容生成：

- **文本文件 EJS 处理**：所有文本文件都会经过 EJS 处理，支持动态内容生成
- **条件渲染**：根据用户选择动态生成内容
- **变量注入**：自动注入项目名称、作者等信息
- **文件重命名**：支持动态文件名生成（`_` → `.`）
- **智能合并**：自动合并 package.json 等配置文件

### 条件渲染示例

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

## 📦 丰富的模板包生态

基于独立的 npm 包系统，每个模板都是可独立发布和维护的包：

- **官方模板包**：提供常用的项目模板和配置
- **第三方模板包**：支持使用社区贡献的模板
- **本地模板包**：支持使用本地开发的模板
- **GitHub 模板包**：支持直接从 GitHub 仓库使用模板

### 支持的模板包来源

```bash
# npm 包
npx @e.fe/create-app@latest -T my-template-package

# 本地路径
npx @e.fe/create-app@latest -T file:./local-template
```
