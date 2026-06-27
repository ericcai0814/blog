export const siteConfig = {
  name: "Eric Tsai",
  title: "Eric Tsai",
  description:
    "蔡樹鈞 Eric 的個人站：前端工程、spec-driven AI development 與技術筆記。",
  url: "https://erictree.me",
  email: "d4070707@gmail.com",
  author: {
    name: "Eric Tsai",
    email: "d4070707@gmail.com",
  },
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString()
}

export const rssAlternates = {
  "application/rss+xml": absoluteUrl("/rss.xml"),
}
