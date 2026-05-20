import { defineCollection, defineConfig, s } from "velite"

const intro = defineCollection({
  name: "Intro",
  pattern: "intro/*.md",
  schema: s.object({
    locale: s.enum(["zh", "en"]),
    body: s.markdown(),
  }),
})

const blog = defineCollection({
  name: "Blog",
  pattern: "blog/*.md",
  schema: s.object({
    title: s.string(),
    date: s.isodate(),
    description: s.string().optional(),
    duration: s.string().optional(),
    slug: s.path(),
    body: s.markdown(),
    metadata: s.metadata(),
  }),
})

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: { intro, blog },
})
