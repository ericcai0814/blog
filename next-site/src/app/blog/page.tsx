import type { Metadata } from "next"
import { BlogList } from "@/components/shared/BlogList"
import { Footer } from "@/components/shared/Footer"
import { Nav } from "@/components/shared/Nav"
import { getPostsByYear } from "@/lib/blog"
import { absoluteUrl, rssAlternates } from "@/lib/site"

export const metadata: Metadata = {
  title: "Blog",
  description: "Eric 的中文技術筆記。",
  alternates: {
    canonical: absoluteUrl("/blog"),
    types: rssAlternates,
  },
}

export default function BlogPage() {
  return (
    <>
      <Nav locale="zh" />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-6 py-16 sm:py-24">
        <header className="mb-14 space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-brand">
            notes
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Blog
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground">
            技術筆記、踩坑整理、以及把概念講到自己真正懂為止的練習。
          </p>
        </header>
        <BlogList groups={getPostsByYear()} />
      </main>
      <Footer locale="zh" />
    </>
  )
}
