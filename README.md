# create-app

<p align='center'>
Efficient Modern Scaffolding
</p>

<div align='center'>
  <a href="https://deepwiki.com/eleven-net-cn/create-app"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</div>

<p align='center'>
<b>English</b> | <a href="./README.zh-CN.md">简体中文</a>
</p>

## Features

- :zap: Local hot-reload template debugging
- :art: Free combination of modules within templates
- :recycle: Templates can call each other
- :rocket: Assemble templates in memory and write to disk at once

## Usage

```zsh
npm create @e.fe/app@latest

# OR

npx @e.fe/create-app@latest
```

![Usage](./usage.svg)

### More

```zsh
# From Repo
npm create @e.fe/app@latest from-repo https://github.com/xxx/xxx.git

# From Template
npm create @e.fe/app@latest -T @scope/template-xxx
```

## Why

Popular scaffolding tools have various issues, with the most important ones being:

1. Most cannot hot-reload debug templates, making template testing time-consuming

2. Some don't allow free combination of templates, only creating from fixed templates or downloading from repositories, making it difficult to maintain when we have multiple templates

At work, I needed to develop a better scaffolding tool for the team, which was the initial motivation for writing this code.

I often need to quickly create various types of projects, so I developed this project with the following goals:

- [x] Maintain commonly used project templates and workflows

- [x] Converge standard code specifications with `@e.fe/template-standard`

- [x] Support direct calls to excellent community scaffolding tools like React, Vue, etc.

  Maintaining our own work templates is the basic goal, but excellent community tools are also in our arsenal

- [x] Support creating new projects from any project repository

  Inherited from [tiged](https://github.com/tiged/tiged), with additional features

  ```zsh
  # Create a new project from https://github.com/xxx/xxx.git
  npm create @e.fe/app@latest from-repo https://github.com/xxx/xxx.git
  ```

- [x] `create-app` has capabilities similar to [yeoman](https://yeoman.io/)

  template-xxx is equivalent to [yeoman generator](https://yeoman.io/authoring/), they both rely on capabilities provided by the upper layer

  Templates can be created and published independently, maintained in separate repositories

  ```zsh
  # Create my-app from generator-xxx
  yo [xxx] my-app

  # They work in a similar way

  # Create my-app from @scope/template-xxx
  npm create @e.fe/app@latest -T [@scope/template-xxx]
  ```
