# Template Generator

这个目录包含了用于生成新的 template-* 包的 plop 模板文件。

## 使用方法

运行以下命令来创建新的 template 包：

```bash
pnpm create:template
```

## 模板结构

生成的 template 包将包含以下文件结构：

```
packages/template-{name}/
├── package.json          # 包配置文件
├── src/
│   ├── index.ts         # 主入口文件，包含基础的 export 函数结构
│   ├── prompts.ts       # 交互式提示配置
│   └── types.ts         # TypeScript 类型定义
├── template/            # 模板文件目录
│   └── .gitkeep        # 保持目录结构
└── README.md
```

## 模板特点

- 自动填充 package.json 中的包名和描述
- 保留基础的 export 函数结构和 `resolveDir` 代码
- 包含完整的 TypeScript 类型定义
- 提供标准的交互式提示配置
- 创建空的 template 目录供后续使用

## 自定义

生成后，你可以根据需要修改：
1. `src/index.ts` 中的模板逻辑
2. `src/prompts.ts` 中的交互选项
3. `src/types.ts` 中的类型定义
4. `template/` 目录中的实际模板文件
