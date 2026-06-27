import type { Metadata } from "next"
import { BlogList } from "@/components/shared/BlogList"
import { Footer } from "@/components/shared/Footer"
import { Nav } from "@/components/shared/Nav"
import { getPostsByYear } from "@/lib/blog"
import { absoluteUrl, rssAlternates } from "@/lib/site"

export const metadata: Metadata = {
  title: "Blog",
  description: "Eric's technical notes, mostly in Traditional Chinese.",
  alternates: {
    canonical: absoluteUrl("/en/blog"),
    types: rssAlternates,
  },
}

export default function BlogPageEn() {
  return (
    <>
      <Nav locale="en" />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-6 py-16 sm:py-24">
        <header className="mb-14 space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-brand">
            notes
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Blog
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground">
            Technical notes, debugging trails, and explanations written until
            the idea is clear enough to keep.
          </p>
        </header>
        <BlogList groups={getPostsByYear()} prefix="/en" />
      </main>
      <Footer locale="en" />
    </>
  )
}
