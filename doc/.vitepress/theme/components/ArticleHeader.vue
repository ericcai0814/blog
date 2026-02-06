<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { formatDate, estimateReadingTime } from '../utils'

const props = defineProps<{
  date: string
  duration?: string
}>()

const formattedDate = computed(() => formatDate(props.date))

const readingTime = ref(props.duration ?? '')

onMounted(() => {
  if (!props.duration) {
    const content = document.querySelector('.vp-doc')?.textContent ?? ''
    readingTime.value = estimateReadingTime(content)
  }
})
</script>

<template>
  <div class="article-header">
    <span class="date">{{ formattedDate }}</span>
    <span v-if="readingTime" class="separator">&middot;</span>
    <span v-if="readingTime" class="duration">{{ readingTime }}</span>
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
</style>
