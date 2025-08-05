# Docsify Count Plugin

docsify 的字数统计插件，显示文章字数和阅读时间。

## 版本信息

- **来源**: docsify-count@0.1.3
- **文件**: countable.min.js
- **大小**: 50B
- **功能**: 字数统计、阅读时间估算

## 配置

```javascript
window.$docsify = {
  count: {
    countable: true,         // 启用字数统计
    position: 'top',         // 位置
    margin: '10px',          // 边距
    float: 'right',          // 浮动位置
    fontsize: '0.9em',       // 字体大小
    color: 'rgb(90,90,90)',  // 颜色
    language: 'chinese',     // 语言
    localization: {          // 本地化
      words: '字',
      minute: '分钟'
    },
    isExpected: true         // 显示预期阅读时间
  }
}
```

## 特性

- 实时字数统计
- 阅读时间估算
- 中文语言支持
- 可自定义位置和样式
- 支持多种语言本地化 
