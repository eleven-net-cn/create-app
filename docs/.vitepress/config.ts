import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'create-app',
  description: '一个强大而灵活的项目脚手架工具',
  lang: 'zh-CN',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [],

    // 侧边栏
    sidebar: {
      '/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: '核心特性', link: '/guide/features' },
          ],
        },
        {
          text: '核心概念',
          items: [
            { text: '概述', link: '/core/' },
            { text: '渲染引擎', link: '/core/rendering' },
            { text: '模板系统', link: '/core/templates' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/eleven-net-cn/create-app' },
    ],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present create-app',
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/eleven-net-cn/create-app/edit/main/docs/:path',
    },
  },

  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
  ],

  // 外观配置
  appearance: true,

  // 最后更新时间
  lastUpdated: true,
});
