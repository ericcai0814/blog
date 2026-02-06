import { defineConfig } from 'vitepress'
import { genFeed } from './genFeed'

const hostname = 'https://erictree.me'

export default defineConfig({
  title: 'Eric',
  description: '記錄技術探索與人生成長的點滴旅程',
  lang: 'zh-TW',
  cleanUrls: true,
  lastUpdated: true,

  sitemap: {
    hostname,
  },

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: 'Eric\'s Blog', href: '/feed.xml' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'theme-color', content: '#121212', media: '(prefers-color-scheme: dark)' }],
  ],

  transformPageData(pageData) {
    const pageUrl = `${hostname}/${pageData.relativePath.replace(/(?:index)?\.md$/, '')}`
    const title = pageData.frontmatter.title ?? pageData.title
    const description = pageData.frontmatter.description ?? '記錄技術探索與人生成長的點滴旅程'
    const isArticle = Boolean(pageData.frontmatter.date)

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: pageUrl }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: pageUrl }],
      ['meta', { property: 'og:type', content: isArticle ? 'article' : 'website' }],
      ['meta', { property: 'og:site_name', content: 'Eric\'s Blog' }],
      ['meta', { property: 'og:locale', content: 'zh_TW' }],
      ['meta', { property: 'og:image', content: `${hostname}/og-image.png` }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: `${hostname}/og-image.png` }],
    )

    if (isArticle) {
      pageData.frontmatter.head.push(
        ['meta', { property: 'article:published_time', content: new Date(pageData.frontmatter.date).toISOString() }],
        ['meta', { property: 'article:author', content: 'Eric' }],
      )
    }
  },

  async buildEnd(siteConfig) {
    await genFeed(siteConfig)
  },

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
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93z"/></svg>',
        },
        link: '/feed.xml',
      },
    ],
  },
})
