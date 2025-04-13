# create-app

Create app/library from the specified repository.

## Engines

1. 确保已安装 [Volta](https://volta.sh/)，将自动切换开发工具（NodeJS、pnpm）版本

2. [pnpm support with volta](https://docs.volta.sh/advanced/pnpm)

   系统环境变量中设置 `VOLTA_FEATURE_PNPM`，以确保开启 pnpm 支持

   在 `~/.zshrc` 中设置示例：

   ```zsh
   export VOLTA_HOME="$HOME/.volta" # 通常是安装 Volta 时自动设置
   export PATH="$VOLTA_HOME/bin:$PATH" # 通常是安装 Volta 时自动设置
   + export VOLTA_FEATURE_PNPM=1 # 手动新增，开启 pnpm 支持
   ```

   > 注意修改配置后重启终端或 `source ~/.zshrc` 使配置生效。

## Command

```zsh
# Testing CLI
# I lik to run and debug using VSCode launch mode, you can use the shortcurt F5 to start quickly.
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
