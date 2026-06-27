import { HomePage } from "@/components/shared/HomePage"
import { getAllPosts } from "@/lib/blog"

export default function Home() {
  return <HomePage locale="zh" posts={getAllPosts()} />
}
