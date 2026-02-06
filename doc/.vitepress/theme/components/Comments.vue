<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import Giscus from '@giscus/vue'

const { isDark } = useData()

const giscusTheme = computed(() => (isDark.value ? 'dark' : 'light'))
</script>

<template>
  <div class="comments">
    <Giscus
      repo="ericcai0814/blog"
      repo-id="R_kgDOOmuUUg"
      category="Announcements"
      category-id="DIC_kwDOOmuUUs4C18mm"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      :theme="giscusTheme"
      lang="zh-TW"
      crossorigin="anonymous"
    />
  </div>
</template>

<style scoped>
.comments {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
