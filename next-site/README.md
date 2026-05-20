# next-site (erictree.me migration)

This is the Next.js 16 rewrite of `erictree.me`. Lives in this branch
`migrate-to-nextjs` alongside the existing VitePress site (`../doc/`) which
remains the production deploy until Phase 4 cuts over.

## Stack

- Next.js 16 + App Router + TypeScript
- React 19
- Tailwind 4 + shadcn/ui (base-nova style, neutral base, terminal green accent)
- velite — type-safe markdown loader (content lives in `./content/`)
- next-themes — dark default
- @giscus/react, medium-zoom, feed, next-sitemap, pagefind — deferred to Phase 1
- @cloudflare/next-on-pages — deferred to Phase 4

## Routing (asymmetric bilingual)

- `/` → 中文(default)
- `/en` → English
- `/blog` → blog list (zh)
- `/en/blog` → blog list (en, optional in Phase 1)
- LangToggle in nav switches between mirror routes

## Phase progress

- ✅ Phase 0: scaffold (Next.js + shadcn + velite + bilingual layout skeleton)
- ⏳ Phase 1: migrate 4 blog posts + RSS + sitemap + giscus + medium-zoom + search
- ⏳ Phase 3: fill `/` with positioning doc §4 soft bio + three value props
- ⏳ Phase 4: deploy via @cloudflare/next-on-pages, DNS cutover

(Phase 2 = meetup section was removed; meetup content goes to separate
`harness-training` repo. See conversation thread for context.)

## Dev

```bash
pnpm install
pnpm dev        # runs `velite && next dev`
```

For content-only watch (in another terminal):

```bash
pnpm content:watch
```

## Migration notes (for future me)

- Original VitePress site is at `../doc/`, do not delete until Phase 4
  preview deploy is validated.
- `velite generate` produces `.velite/` (gitignored). Schemas in
  `velite.config.ts`.
- Brand accent `oklch(0.77 0.18 159)` ≈ `#00d97e` (terminal green per
  positioning doc §8 default choice).
- Phase 1 will swap intro / blog content to real data; this skeleton is
  intentionally placeholder-only.
