<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  date: string
  duration?: string
}>()

const formattedDate = computed(() => {
  const d = new Date(props.date)
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
})
</script>

<template>
  <div class="article-header">
    <span class="date">{{ formattedDate }}</span>
    <span v-if="duration" class="separator">&middot;</span>
    <span v-if="duration" class="duration">{{ duration }}</span>
  </div>
</template>

<style scoped>
.article-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

.separator {
  color: var(--vp-c-text-3);
}
</style>
