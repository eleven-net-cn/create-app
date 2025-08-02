# create-app

<p align='center'>
高效的现代脚手架
</p>

<div align='center'>
  <a href="https://deepwiki.com/eleven-net-cn/create-app"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</div>

<p align='center'>
<a href="./README.md">English</a> | <b>简体中文</b>
</p>

## 特性

- :zap: 本地热更新调试模板
- :art: 模板内的模块自由组合
- :recycle: 模板相互可调用
- :rocket: 在内存中拼装模板，一次性写入硬盘

## 使用方法

```zsh
npm create @e.fe/app@latest

# 或者

npx @e.fe/create-app@latest
```

![Usage](./usage.svg)

### 更多用法

```zsh
# 从仓库创建
npm create @e.fe/app@latest from-repo <url>

# 从模板创建
npm create @e.fe/app@latest -T <template>

# Mixin 模式 - 在当前目录应用模板逻辑
npm create @e.fe/app@latest -T <template> --mixin
```

## Mixin 模式

在当前目录中应用模板包的逻辑，无需创建新项目。

```bash
# 在当前目录应用模板
npx @e.fe/create-app --template @e.fe/template-standard --mixin

# 使用本地模板文件
npx @e.fe/create-app --template file:./local-template --mixin
```

适用于：
- 向现有项目添加新的功能模块
- 应用配置模板到当前项目
- 在现有项目中集成特定的开发工具或脚本

## 为什么

流行的脚手架工具存在各种问题，最重要的有以下几点：

1. 基本都不能热更新调试模板，模板的测试较为浪费时间

2. 有的不能自由组合模板，而仅仅从固定模板创建或从仓库下载，当我们有多个模板时持续维护较为困难

工作中，我需要为团队开发一款更棒的脚手架工具，这是最初写代码的起点。
