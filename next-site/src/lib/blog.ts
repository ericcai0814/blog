import { blog } from "../../.velite"
import type { Blog } from "../../.velite"

export type BlogPost = Blog & {
  href: string
  year: string
  displayDate: string
  readingTime: string
}

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

function stripLeadingH1(html: string) {
  return html.replace(/^<h1>.*?<\/h1>\n?/, "")
}

export function getAllPosts(): BlogPost[] {
  return blog
    .map((post) => {
      const date = new Date(post.date)
      const slug = post.slug.replace(/^blog\//, "")
      const minutes = post.metadata.readingTime ?? 1

      return {
        ...post,
        body: stripLeadingH1(post.body),
        href: `/blog/${slug}`,
        year: String(date.getFullYear()),
        displayDate: dateFormatter.format(date),
        readingTime: post.duration ?? `${Math.max(1, Math.round(minutes))} min`,
      }
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.href === `/blog/${slug}`)
}

export function getPostsByYear() {
  return getAllPosts().reduce<Record<string, BlogPost[]>>((groups, post) => {
    groups[post.year] ??= []
    groups[post.year].push(post)
    return groups
  }, {})
}
