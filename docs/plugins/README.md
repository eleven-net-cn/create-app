# Docsify 插件总览

本目录包含所有 docsify 插件的本地化文件，按插件维度组织，避免依赖外部 CDN。

## 插件目录结构

```
plugins/
├── docsify/           # docsify 核心文件
│   └── docsify.min.js
├── search/            # 搜索插件
│   ├── search.min.js
│   └── README.md
├── count/             # 字数统计插件
│   ├── countable.min.js
│   └── README.md
├── copy-code/         # 代码复制插件
│   ├── docsify-copy-code.min.js
│   └── README.md
├── pagination/        # 分页导航插件
│   ├── docsify-pagination.min.js
│   └── README.md
├── prism/             # 代码高亮插件
│   ├── prism-tomorrow.min.css
│   ├── prism-bash.min.js
│   ├── prism-javascript.min.js
│   ├── prism-typescript.min.js
│   ├── prism-json.min.js
│   ├── prism-yaml.min.js
│   ├── prism-markdown.min.js
│   └── README.md
└── themes/            # 主题样式
    └── vue.css
```

## 插件统计

| 插件 | 大小 | 功能 |
|------|------|------|
| docsify-core | 157KB | 核心功能 |
| search | 8.2KB | 全文搜索 |
| count | 50B | 字数统计 |
| copy-code | 3.6KB | 代码复制 |
| pagination | 6.6KB | 分页导航 |
| prism | 20.8KB | 代码高亮 |
| themes | 13KB | 主题样式 |
| **总计** | **209.2KB** | **所有功能** |

## 优势

### 🚀 性能优势
- **无网络依赖**: 所有资源本地化，加载速度更快
- **离线可用**: 不依赖外部 CDN，支持离线访问
- **版本稳定**: 固定版本，避免 CDN 版本变化影响

### 🔧 维护优势
- **版本可控**: 明确知道使用的插件版本
- **易于更新**: 可以手动更新特定插件
- **调试方便**: 本地文件便于调试和修改

### 🛡️ 安全优势
- **无外部依赖**: 避免 CDN 安全风险
- **内容可控**: 确保加载的内容安全可靠
- **隐私保护**: 不向外部服务发送请求

## 更新插件

如需更新插件，请：

1. 下载新版本的插件文件
2. 替换对应的 `.min.js` 文件
3. 更新对应目录下的 `README.md` 版本信息
4. 测试功能是否正常

## 添加新插件

如需添加新插件，请：

1. 在 `plugins/` 下创建新的插件目录
2. 下载插件文件到该目录
3. 创建 `README.md` 说明文档
4. 在 `docs/index.html` 中引入插件
5. 更新本 `README.md` 文件

## 注意事项

- 所有插件文件都是压缩版本，用于生产环境
- 如需调试，可以下载非压缩版本
- 插件版本信息记录在各自的 `README.md` 中
- 建议定期检查插件更新 
