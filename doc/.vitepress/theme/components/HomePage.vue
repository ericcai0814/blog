<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../../posts.data'

interface Post {
  title: string
  url: string
  date: string
  dateFormatted: string
  duration?: string
}

interface YearGroup {
  year: number
  posts: Post[]
}

const groupedPosts = computed<YearGroup[]>(() => {
  const groups = posts.reduce<Record<number, Post[]>>((acc, post) => {
    const year = new Date(post.date).getFullYear()
    return {
      ...acc,
      [year]: [...(acc[year] ?? []), post],
    }
  }, {})

  return Object.entries(groups)
    .map(([year, yearPosts]) => ({
      year: Number(year),
      posts: yearPosts,
    }))
    .sort((a, b) => b.year - a.year)
})
</script>

<template>
  <div class="home-page">
    <section class="intro">
      <h1 class="name">Hey, I'm Eric</h1>
      <p class="bio">
        前端工程師，記錄技術探索與人生成長的點滴旅程。
      </p>
      <p class="quote">
        <em>We are what we repeatedly do. Excellence, then, is not an act but a habit.</em>
      </p>
    </section>

    <section class="posts">
      <div v-for="group in groupedPosts" :key="group.year" class="year-group">
        <h2 class="year-title">{{ group.year }}</h2>
        <ul class="post-list">
          <li v-for="post in group.posts" :key="post.url" class="post-item">
            <a :href="post.url" class="post-link">
              <span class="post-title">{{ post.title }}</span>
              <span class="post-meta">
                <span class="post-date">{{ post.dateFormatted }}</span>
                <span v-if="post.duration" class="post-duration">&middot; {{ post.duration }}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

/* --- Intro --- */
.intro {
  margin-bottom: 3rem;
}

.name {
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
}

.bio {
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.quote {
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
}

/* --- Posts --- */
.year-group {
  margin-bottom: 2rem;
}

.year-title {
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
  border: none;
  padding: 0;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  margin-bottom: 0.25rem;
}

.post-link {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 0.5rem 0;
  text-decoration: none;
  border-bottom: none;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.post-link:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-title {
  font-size: 1rem;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
}

.post-meta {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  flex-shrink: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
</style>
