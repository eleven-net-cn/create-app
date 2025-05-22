# create-app

<p align='center'>
<a href="./README.md">English</a> | <b>简体中文</b>
</p>

高效的现代脚手架

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
npm create @e.fe/app@latest from-repo https://github.com/xxx/xxx.git

# 从模板创建
npm create @e.fe/app@latest -T @scope/template-xxx
```

## 为什么

流行的脚手架工具存在各种问题，最重要的有以下几点：

1. 基本都不能热更新调试模板，模板的测试较为浪费时间

2. 有的不能自由组合模板，而仅仅从固定模板创建或从仓库下载，当我们有多个模板时持续维护较为困难

工作中，我需要为团队开发一款更棒的脚手架工具，这是最初写代码的起点。

我常常需要迅速创建各类项目，因此，我开发了这个项目，主要达成了以下目标：

- [x] 维护常用的项目模板和工作方式

- [x] 收敛标准的代码规范 `@e.fe/template-standard`

- [x] 支持直接调用社区优秀的 React、Vue 等脚手架工具创建项目

  维护自己的工作模板是基础目标，但是，社区优秀的工具也在我的武器库中

- [x] 支持从任意项目仓库创建新的项目

  继承自 [tiged](https://github.com/tiged/tiged)，并增加额外的功能

  ```zsh
  # 从 https://github.com/xxx/xxx.git 创建新项目
  npm create @e.fe/app@latest from-repo https://github.com/xxx/xxx.git
  ```

- [x] `create-app` 具有 [yeoman](https://yeoman.io/) 类似的能力

  template-xxx 相当于 [yeoman generator](https://yeoman.io/authoring/)，它们都依靠上层下发的能力工作

  模板可以独立创建、发布，维护在独立的仓库

  ```zsh
  # 从 generator-xxx 创建 my-app
  yo [xxx] my-app

  # 它们是类似的工作方式

  # 从 @scope/template-xxx 创建 my-app
  npm create @e.fe/app@latest -T [@scope/template-xxx]
  ``` 
