# Docsify Search Plugin

docsify 的全文搜索插件，支持中文搜索。

## 版本信息

- **来源**: docsify@4
- **文件**: search.min.js
- **大小**: 8.2KB
- **功能**: 全文搜索、搜索高亮、搜索历史

## 配置

```javascript
window.$docsify = {
  search: {
    maxAge: 86400000,        // 缓存时间
    paths: 'auto',           // 自动检测路径
    placeholder: '搜索文档...', // 搜索框占位符
    noData: '找不到结果',     // 无结果提示
    depth: 6                 // 搜索深度
  }
}
```

## 特性

- 支持中文搜索
- 实时搜索高亮
- 搜索历史记录
- 智能路径检测
- 可配置搜索深度 
