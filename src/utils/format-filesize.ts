export function formatFileSize(raw: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let size = raw
  let unit = 0
  while (size > 1024) {
    size /= 1024
    unit += 1
  }

  return `${size.toFixed(2)} ${units[unit]}`
}
