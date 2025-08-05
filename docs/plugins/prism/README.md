# Prism.js Code Highlighting

Prism.js 代码高亮插件，支持多种编程语言的语法高亮。

## 版本信息

- **来源**: prismjs@1.29.0
- **主题**: prism-tomorrow.min.css
- **支持语言**: bash, javascript, typescript, json, yaml, markdown

## 文件列表

- `prism-tomorrow.min.css` - 暗色主题样式 (1.3KB)
- `prism-bash.min.js` - Bash 语法支持 (6.1KB)
- `prism-javascript.min.js` - JavaScript 语法支持 (4.6KB)
- `prism-typescript.min.js` - TypeScript 语法支持 (1.3KB)
- `prism-json.min.js` - JSON 语法支持 (449B)
- `prism-yaml.min.js` - YAML 语法支持 (2.0KB)
- `prism-markdown.min.js` - Markdown 语法支持 (5.1KB)

## 配置

```javascript
window.$docsify = {
  highlight: [
    'bash', 'javascript', 'typescript', 
    'json', 'yaml', 'markdown'
  ]
}
```

## 特性

- 暗色主题，护眼设计
- 支持多种编程语言
- 语法高亮准确
- 轻量级实现
- 易于扩展新语言 
