# create-app

An efficient modular template management scaffold

## Why

Existing scaffolding tools in the community each have their own issues, such as: inability to debug locally in real-time (like [create-vue](https://github.com/vuejs/create-vue) etc.), lack of support for modular assembly and only generating from a repository or directory (like [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) etc.).

The [yeoman](https://yeoman.io/) generator is a good approach to scaffold development and can achieve modular template assembly, however, it also cannot support local hot-reload development templates.

Therefore, I developed create-app to meet my expectations for a scaffolding tool.

## Features

- Modular and flexible template assembly with clear logic separation, maintaining similar functionality in one place
- Template assembly completed in memory, then written to disk at the end
- Local hot-reload development templates

## Usage

```zsh
npx @e.fe/create-app@latest

# OR

pnpm dlx @e.fe/create-app@latest
```

![Usage](./usage.svg)

## Contribution

### Engines

1. Make sure [Volta](https://volta.sh/) is installed, it will automatically switch development tools (NodeJS, pnpm) versions

2. [pnpm support with volta](https://docs.volta.sh/advanced/pnpm)

   Set `VOLTA_FEATURE_PNPM` in system environment variables to ensure pnpm support is enabled

   Example settings in `~/.zshrc`:

   ```zsh
   export VOLTA_HOME="$HOME/.volta" # Usually set automatically during Volta installation
   export PATH="$VOLTA_HOME/bin:$PATH" # Usually set automatically during Volta installation
   + export VOLTA_FEATURE_PNPM=1 # Manually added to enable pnpm support
   ```

   > Note: After modifying the configuration, restart the terminal or run `source ~/.zshrc` to apply the changes.

### Command

```zsh
# Testing CLI
# I like to run and debug using VSCode launch mode, you can use the shortcut F5 to start quickly.
pnpm start:cli          # Start CLI, without ts compilation (Better in VSCode JavaScript Debug Terminal)

# Testing Template
pnpm start              # Default: @e.fe/template-library

# Watching
pnpm watch              # Watching all packages, Cache with turbo
pnpm watch --filter @e.fe/xxx              # Watching a specific package and its dependencies (by turbo)
pnpm -F @e.fe/xxx start   # Watching a specific package (Only for @e.fe/xxx)

# Build
pnpm build              # Build all packages, Cache with turbo
```
