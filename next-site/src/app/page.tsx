import { Nav } from "@/components/shared/Nav"
import { Footer } from "@/components/shared/Footer"

export default function Home() {
  return (
    <>
      <Nav locale="zh" />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight mb-6">蔡樹鈞 Eric</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          前端工程師,延伸到 spec-driven AI development。
        </p>
        <p className="text-sm text-muted-foreground font-mono">
          (Phase 3 佔位內容 — 之後會填入 positioning doc §4 軟版 + 三條 value
          props。)
        </p>
      </main>
      <Footer locale="zh" />
    </>
  )
}
