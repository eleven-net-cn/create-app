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

## Documentation

https://create-app.eleven.net.cn/

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
npx @e.fe/create-app@latest from-repo <url>

# From Template
npx @e.fe/create-app@latest -T <template>

# Mixin Mode - Apply template logic to current directory
npx @e.fe/create-app@latest -T <template> --mixin
```

## Mixin Mode

Apply template logic to your current directory without creating a new project.

```bash
# Apply template to current directory
npx @e.fe/create-app --template @e.fe/template-standard --mixin

# Use local template file
npx @e.fe/create-app --template file:./local-template --mixin
```

Useful for:
- Adding new modules to existing projects
- Applying configuration templates
- Integrating development tools or scripts

## Why

Popular scaffolding tools have various issues, with the most important ones being:

1. Most cannot hot-reload debug templates, making template testing time-consuming

2. Some don't allow free combination of templates, only creating from fixed templates or downloading from repositories, making it difficult to maintain when we have multiple templates

At work, I needed to develop a better scaffolding tool for the team, which was the initial motivation for writing this code.
