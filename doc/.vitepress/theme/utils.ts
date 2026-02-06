const CJK_RANGE = /[\u4e00-\u9fff\u3400-\u4dbf]/g
const WORD_RANGE = /[a-zA-Z]+/g
const CJK_WPM = 350
const EN_WPM = 200

export function estimateReadingTime(text: string): string {
  const cjkCount = (text.match(CJK_RANGE) ?? []).length
  const enCount = (text.match(WORD_RANGE) ?? []).length
  const minutes = Math.max(1, Math.round(cjkCount / CJK_WPM + enCount / EN_WPM))
  return `${minutes} min`
}

export function formatDate(dateStr: string, includeYear = true): string {
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  const day = d.getDate()
  if (includeYear) {
    return `${d.getFullYear()} 年 ${month} 月 ${day} 日`
  }
  return `${month} 月 ${day} 日`
}
