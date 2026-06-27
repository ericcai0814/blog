import { Feed } from "feed"
import { getAllPosts } from "@/lib/blog"
import { absoluteUrl, siteConfig } from "@/lib/site"

export const dynamic = "force-static"

function absolutizeHtml(html: string) {
  return html
    .replaceAll('href="/', `href="${siteConfig.url}/`)
    .replaceAll('src="/', `src="${siteConfig.url}/`)
}

export function GET() {
  const posts = getAllPosts()
  const updated = posts[0] ? new Date(posts[0].date) : new Date()
  const feed = new Feed({
    title: siteConfig.title,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: "zh-TW",
    feedLinks: {
      rss: absoluteUrl("/rss.xml"),
    },
    author: siteConfig.author,
    copyright: `All rights reserved ${siteConfig.author.name}`,
    updated,
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: absoluteUrl(post.href),
      link: absoluteUrl(post.href),
      date: new Date(post.date),
      description: post.description,
      content: absolutizeHtml(post.body),
      author: [siteConfig.author],
    })
  })

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
