import Link from "next/link"
import { Footer } from "@/components/shared/Footer"
import { Nav } from "@/components/shared/Nav"

export default function NotFound() {
  return (
    <>
      <Nav locale="zh" />
      <main className="mx-auto grid w-full max-w-[720px] flex-1 content-center px-6 py-20">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-brand">
          404
        </p>
        <h1 className="mb-5 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          找不到這一頁
        </h1>
        <p className="mb-8 max-w-xl text-base leading-8 text-muted-foreground">
          這個連結可能已經移動，或還沒被寫成一篇真正的筆記。
        </p>
        <div className="flex flex-wrap gap-5 font-mono text-sm">
          <Link className="site-link" href="/">
            回首頁
          </Link>
          <Link className="site-link" href="/blog">
            看文章
          </Link>
        </div>
      </main>
      <Footer locale="zh" />
    </>
  )
}
