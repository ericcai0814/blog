import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { BlogPost } from "@/lib/blog"
import { Footer } from "@/components/shared/Footer"
import { Nav } from "@/components/shared/Nav"

type Locale = "zh" | "en"

const copy = {
  zh: {
    name: "蔡樹鈞 Eric",
    eyebrow: "erictree.me / field notes",
    lead:
      "我做 Vue 3 design system 與元件庫起家，最近把工作延伸到 spec-driven AI development：我寫規格、AI 實作，我 review、推回、整合。",
    bio:
      "這裡是我整理技術筆記與學習路徑的地方。主題通常落在前端工程、AI tooling、shell、以及那些真正把工具落地時才會遇到的細節。",
    note: "soft personal site, not a job-hunt landing page",
    valuesTitle: "What I keep practicing",
    recentTitle: "Recent notes",
    allPosts: "全部文章",
    github: "GitHub",
    email: "Email",
    values: [
      {
        title: "Frontend foundation",
        body: "三年 Vue 3 design systems / Vuetify 整合 / Framework First 推動，把 CSS !important 從 114 降到 0。",
      },
      {
        title: "Spec-driven AI development",
        body: "Spec 是主要技能，AI 實作，我 review、推回、整合。工具跨 Rust / TypeScript / Python / shell。",
      },
      {
        title: "Cross-functional translation",
        body: "在工程、設計、PM、非技術人之間翻譯模糊需求，讓 framework、design system、AI tooling 真的落地。",
      },
    ],
  },
  en: {
    name: "Eric Tsai",
    eyebrow: "erictree.me / field notes",
    lead:
      "I started with Vue 3 design systems and component libraries, and have extended into spec-driven AI development: I author specs, AI implements, I review, push back, and integrate.",
    bio:
      "This site is where I keep technical notes and learning trails. Most notes orbit frontend engineering, AI tooling, shell, and the practical details that only show up when tools need to land in real work.",
    note: "soft personal site, not a job-hunt landing page",
    valuesTitle: "What I keep practicing",
    recentTitle: "Recent notes",
    allPosts: "All posts",
    github: "GitHub",
    email: "Email",
    values: [
      {
        title: "Frontend foundation",
        body: "Three years in Vue 3 design systems, Vuetify integration, and Framework First adoption, including reducing CSS !important usage from 114 to 0.",
      },
      {
        title: "Spec-driven AI development",
        body: "Specs are the primary artifact. AI implements; I review, push back, and integrate across Rust, TypeScript, Python, and shell.",
      },
      {
        title: "Cross-functional translation",
        body: "I translate ambiguous needs across engineering, design, PM, and non-technical stakeholders so tooling actually lands.",
      },
    ],
  },
} satisfies Record<Locale, Record<string, unknown>>

type HomePageProps = {
  locale: Locale
  posts: BlogPost[]
}

export function HomePage({ locale, posts }: HomePageProps) {
  const content = copy[locale]
  const prefix = locale === "zh" ? "" : "/en"

  return (
    <>
      <Nav locale={locale} />
      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-6">
        <section className="grid content-center gap-10 py-14 sm:py-16">
          <div className="space-y-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-brand">
              {content.eyebrow}
            </p>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold leading-[0.98] text-foreground sm:text-7xl">
                {content.name}
              </h1>
              <p className="max-w-2xl text-xl leading-8 text-foreground/88 sm:text-2xl sm:leading-9">
                {content.lead}
              </p>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                {content.bio}
              </p>
            </div>
          </div>

          <div className="grid gap-4 border-y border-border/70 py-5 font-mono text-xs text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-center">
            <span>{content.note}</span>
            <div className="flex gap-5">
              <Link className="site-link" href="https://github.com/ericcai0814">
                {content.github}
              </Link>
              <Link className="site-link" href="mailto:d4070707@gmail.com">
                {content.email}
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-16">
          <h2 className="mb-8 font-mono text-sm text-brand">
            {content.valuesTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.values.map((item) => (
              <article
                className="border border-border/70 p-5 transition-colors hover:border-brand/70"
                key={item.title}
              >
                <h3 className="mb-4 text-base font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-20 pt-10 sm:pb-28">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-mono text-sm text-brand">
              {content.recentTitle}
            </h2>
            <Link
              href={`${prefix}/blog`}
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
            >
              {content.allPosts}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="divide-y divide-border/70 border-y border-border/70">
            {posts.slice(0, 3).map((post) => (
              <Link
                className="group grid gap-2 py-5 transition-colors hover:text-brand sm:grid-cols-[116px_1fr_auto] sm:items-baseline sm:gap-5"
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
      </main>
      <Footer locale={locale} />
    </>
  )
}
