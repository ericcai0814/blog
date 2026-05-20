type Locale = "zh" | "en"

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear()
  const text = locale === "zh" ? `© ${year} Eric` : `© ${year} Eric Tsai`

  return (
    <footer className="border-t border-border/40">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center text-xs text-muted-foreground font-mono">
        {text}
      </div>
    </footer>
  )
}
