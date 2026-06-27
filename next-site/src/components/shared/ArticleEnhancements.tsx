"use client"

import { useEffect } from "react"
import mediumZoom from "medium-zoom"

export function ArticleEnhancements() {
  useEffect(() => {
    const zoom = mediumZoom(".article-content img", {
      background: "oklch(0.145 0 0 / 94%)",
      margin: 24,
      scrollOffset: 48,
    })

    return () => {
      zoom.detach()
    }
  }, [])

  return null
}
