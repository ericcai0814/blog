import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  dateFormatted: string
  duration?: string
}

declare const data: Post[]
export { data }

export default createContentLoader('*.md', {
  includeSrc: false,
  transform(rawData) {
    return rawData
      .filter((page) => page.frontmatter.date)
      .sort((a, b) => {
        return (
          new Date(b.frontmatter.date).getTime() -
          new Date(a.frontmatter.date).getTime()
        )
      })
      .map((page) => {
        const d = new Date(page.frontmatter.date)
        return {
          title: page.frontmatter.title ?? '',
          url: page.url,
          date: page.frontmatter.date,
          dateFormatted: `${d.getMonth() + 1} 月 ${d.getDate()} 日`,
          duration: page.frontmatter.duration,
        }
      })
  },
})
