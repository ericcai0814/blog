export function formatDate(dateStr: string, includeYear = true): string {
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  const day = d.getDate()
  if (includeYear) {
    return `${d.getFullYear()} 年 ${month} 月 ${day} 日`
  }
  return `${month} 月 ${day} 日`
}
