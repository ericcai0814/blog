import Link from "next/link"
import { LangToggle } from "./LangToggle"

type Locale = "zh" | "en"

const labels: Record<Locale, { blog: string }> = {
  zh: { blog: "Blog" },
  en: { blog: "Blog" },
}

export function Nav({ locale }: { locale: Locale }) {
  const prefix = locale === "zh" ? "" : "/en"

  return (
    <nav className="border-b border-border/40">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-5">
        <Link
          href={`${prefix}/`}
          className="font-mono font-semibold tracking-tight text-foreground hover:text-brand transition-colors"
        >
          erictree.me
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href={`${prefix}/blog`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {labels[locale].blog}
          </Link>
          <LangToggle />
        </div>
      </div>
    </nav>
  )
}
