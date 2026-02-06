import path from 'node:path'
import { writeFileSync } from 'node:fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

const hostname = 'https://ericcai0814.github.io/blog'

export async function genFeed(config: SiteConfig): Promise<void> {
  const feed = new Feed({
    title: 'Eric',
    description: '記錄技術探索與人生成長的點滴旅程',
    id: hostname,
    link: hostname,
    language: 'zh-TW',
    favicon: `${hostname}/favicon.ico`,
    copyright: `CC BY-NC-SA 4.0 © ${new Date().getFullYear()} Eric`,
  })

  const posts = await createContentLoader('*.md', {
    render: true,
  }).load()

  const sortedPosts = posts
    .filter((post) => post.frontmatter.date)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    )

  for (const post of sortedPosts) {
    const { frontmatter, url, html } = post
    feed.addItem({
      title: frontmatter.title ?? '',
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: frontmatter.description ?? '',
      content: html ?? '',
      date: new Date(frontmatter.date),
    })
  }

  writeFileSync(path.join(config.outDir, 'feed.xml'), feed.atom1())
}
