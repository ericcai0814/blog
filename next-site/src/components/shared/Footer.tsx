type Locale = "zh" | "en"

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear()
  const text = locale === "zh" ? `© ${year} Eric` : `© ${year} Eric Tsai`

  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-[720px] flex-col gap-3 px-6 py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{text}</span>
        <span>field notes from Taipei</span>
      </div>
    </footer>
  )
}
