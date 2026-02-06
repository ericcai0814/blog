<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import ArticleHeader from './components/ArticleHeader.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import Comments from './components/Comments.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #layout-top>
      <ReadingProgress v-if="frontmatter.date" />
    </template>

    <template #doc-before>
      <ArticleHeader
        v-if="frontmatter.date"
        :date="frontmatter.date"
        :duration="frontmatter.duration"
      />
    </template>

    <template #doc-after>
      <Comments v-if="frontmatter.date" />
    </template>

    <template #layout-bottom>
      <footer class="custom-footer">
        <p>
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >CC BY-NC-SA 4.0</a>
          &copy; {{ new Date().getFullYear() }} Eric
        </p>
      </footer>
    </template>
  </Layout>
</template>

<style scoped>
.custom-footer {
  text-align: center;
  padding: 2rem 1rem 3rem;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

.custom-footer a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-bottom: 1px dashed var(--vp-c-text-3);
  transition: border-bottom-style 0.2s ease;
}

.custom-footer a:hover {
  border-bottom-style: solid;
}
</style>
