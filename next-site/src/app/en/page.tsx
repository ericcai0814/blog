import type { Metadata } from "next"
import { HomePage } from "@/components/shared/HomePage"
import { getAllPosts } from "@/lib/blog"
import { absoluteUrl, rssAlternates } from "@/lib/site"

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/en"),
    types: rssAlternates,
  },
}

export default function HomeEn() {
  return <HomePage locale="en" posts={getAllPosts()} />
}
