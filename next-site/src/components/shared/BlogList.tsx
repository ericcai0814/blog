import Link from "next/link"
import type { BlogPost } from "@/lib/blog"

type BlogListProps = {
  groups: Record<string, BlogPost[]>
  prefix?: string
}

export function BlogList({ groups, prefix = "" }: BlogListProps) {
  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="space-y-12">
      {years.map((year) => (
        <section className="grid gap-4 sm:grid-cols-[88px_1fr]" key={year}>
          <h2 className="font-mono text-sm text-brand">{year}</h2>
          <div className="divide-y divide-border/70 border-t border-border/70">
            {groups[year].map((post) => (
              <Link
                className="group grid gap-2 py-5 transition-colors sm:grid-cols-[112px_1fr_auto] sm:items-baseline sm:gap-5"
                href={`${prefix}${post.href}`}
                key={post.slug}
              >
                <time className="font-mono text-xs text-muted-foreground">
                  {post.displayDate}
                </time>
                <span className="text-base text-foreground transition-colors group-hover:text-brand">
                  {post.title}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {post.readingTime}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
