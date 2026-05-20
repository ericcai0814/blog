"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function LangToggle() {
  const pathname = usePathname() ?? "/"
  const isEn = pathname === "/en" || pathname.startsWith("/en/")

  const targetHref = isEn
    ? pathname.replace(/^\/en/, "") || "/"
    : pathname === "/"
      ? "/en"
      : `/en${pathname}`

  return (
    <Link
      href={targetHref}
      className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
      aria-label={isEn ? "切換到中文" : "Switch to English"}
    >
      {isEn ? "中" : "EN"}
    </Link>
  )
}
