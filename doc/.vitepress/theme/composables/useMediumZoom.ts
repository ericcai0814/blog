import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

export function useMediumZoom(): void {
  const route = useRoute()

  const initZoom = (): void => {
    mediumZoom('.vp-doc img:not(a img)', {
      background: 'var(--vp-c-bg)',
    })
  }

  onMounted(initZoom)

  watch(
    () => route.path,
    () => nextTick(initZoom),
  )
}
