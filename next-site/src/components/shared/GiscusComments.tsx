"use client"

import Giscus from "@giscus/react"
import type { Repo } from "@giscus/react"

type GiscusCommentsProps = {
  locale: "zh" | "en"
}

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

export function GiscusComments({ locale }: GiscusCommentsProps) {
  if (!repo || !repoId || !category || !categoryId) {
    return null
  }

  return (
    <section className="mt-16 border-t border-border/70 pt-10">
      <h2 className="mb-6 font-mono text-sm text-brand">
        {locale === "zh" ? "Comments" : "Comments"}
      </h2>
      <Giscus
        repo={repo as Repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="noborder_dark"
        lang={locale === "zh" ? "zh-TW" : "en"}
        loading="lazy"
      />
    </section>
  )
}
