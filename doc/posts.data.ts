import { createContentLoader } from 'vitepress'
import { formatDate } from './.vitepress/theme/utils'

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
      .map((page) => ({
        title: page.frontmatter.title ?? '',
        url: page.url,
        date: page.frontmatter.date,
        dateFormatted: formatDate(page.frontmatter.date, false),
        duration: page.frontmatter.duration,
      }))
  },
})
