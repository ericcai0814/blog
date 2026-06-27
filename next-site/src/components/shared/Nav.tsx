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
    <nav className="border-b border-border/50">
      <div className="mx-auto flex max-w-[720px] items-center justify-between px-6 py-5">
        <Link
          href={`${prefix}/`}
          className="font-mono text-sm font-semibold text-foreground transition-colors hover:text-brand"
        >
          erictree.me
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link
            href={`${prefix}/blog`}
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {labels[locale].blog}
          </Link>
          <LangToggle />
        </div>
      </div>
    </nav>
  )
}
