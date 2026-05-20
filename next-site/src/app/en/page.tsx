import { Nav } from "@/components/shared/Nav"
import { Footer } from "@/components/shared/Footer"

export default function HomeEn() {
  return (
    <>
      <Nav locale="en" />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight mb-6">Eric Tsai</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          Frontend engineer extending into spec-driven AI development.
        </p>
        <p className="text-sm text-muted-foreground font-mono">
          (Phase 3 placeholder — soft version of positioning doc §4 + three value
          props goes here.)
        </p>
      </main>
      <Footer locale="en" />
    </>
  )
}
