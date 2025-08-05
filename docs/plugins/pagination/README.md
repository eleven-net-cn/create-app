# Docsify Pagination Plugin

docsify 的分页导航插件，提供章节间快速跳转。

## 版本信息

- **来源**: docsify-pagination
- **文件**: docsify-pagination.min.js
- **大小**: 6.6KB
- **功能**: 分页导航、章节跳转

## 配置

```javascript
window.$docsify = {
  pagination: {
    previousText: '上一章节',    // 上一页文本
    nextText: '下一章节',        // 下一页文本
    crossChapter: true,         // 跨章节导航
    crossChapterText: true      // 显示章节文本
  }
}
```

## 特性

- 章节间快速跳转
- 跨章节导航支持
- 可自定义导航文本
- 智能章节检测
- 响应式导航按钮 
