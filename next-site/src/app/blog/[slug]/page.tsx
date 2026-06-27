import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleEnhancements } from "@/components/shared/ArticleEnhancements"
import { Footer } from "@/components/shared/Footer"
import { GiscusComments } from "@/components/shared/GiscusComments"
import { Nav } from "@/components/shared/Nav"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { absoluteUrl, rssAlternates } from "@/lib/site"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.href.replace("/blog/", ""),
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post not found",
    }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: absoluteUrl(post.href),
      types: rssAlternates,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: absoluteUrl(post.href),
      type: "article",
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <Nav locale="zh" />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-6 py-14 sm:py-20">
        <article>
          <header className="mb-12 border-b border-border/70 pb-8">
            <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
              <time>{post.displayDate}</time>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {post.title}
            </h1>
            {post.description ? (
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                {post.description}
              </p>
            ) : null}
          </header>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
          <ArticleEnhancements />
          <GiscusComments locale="zh" />
        </article>
      </main>
      <Footer locale="zh" />
    </>
  )
}
