import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Eric',
  description: '記錄技術探索與人生成長的點滴旅程',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'theme-color', content: '#121212', media: '(prefers-color-scheme: dark)' }],
  ],

  themeConfig: {
    siteTitle: 'Eric',

    nav: [
      { text: 'Blog', link: '/' },
      { text: 'About', link: '/2025-10-08-about-this-blog' },
    ],

    sidebar: [
      {
        text: '序',
        collapsed: false,
        link: '/2025-10-08-about-this-blog',
      },
      {
        text: 'React',
        collapsed: true,
        items: [
          { text: '基本元件', link: '/2025-10-08-react-basic-component' },
        ],
      },
      {
        text: 'JavaScript',
        collapsed: true,
        items: [
          { text: 'pass by value、pass by reference 還是 pass by sharing', link: '/2025-10-11-javascript-pass-by-value-pass-by-reference-or-pass-by-sharing' },
        ],
      },
      {
        text: 'Shell',
        collapsed: true,
        items: [
          { text: 'Shell 變數作用域與狀態管理', link: '/2026-02-06-shell-variable-scope-and-state-management' },
        ],
      },
    ],

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    lastUpdated: {
      text: '最後更新',
    },

    outline: {
      label: '目錄',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜尋', buttonAriaLabel: '搜尋' },
          modal: {
            noResultsText: '沒有找到相關結果',
            resetButtonTitle: '清除搜尋條件',
            footer: { selectText: '選擇', navigateText: '切換', closeText: '關閉' },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ericcai0814' },
    ],
  },
})
