import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Eric Blog",
  description: "這裡是我的個人領域，記錄著技術探索與人生成長的點滴旅程。\n Here is my personal domain, documenting the journey of technical exploration and personal growth.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ericcai0814' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/eric-cai-0814/' },
      { icon: 'instagram', link: 'https://www.instagram.com/ericcai0814/' },
      { icon: 'facebook', link: 'https://www.facebook.com/ericcai0814/' },
      { icon: 'discord', link: 'https://discord.gg/ericcai0814' },
      { icon: 'cake', link: 'https://www.cakeresume.com/eric-cai' },
    ]
  }
})
