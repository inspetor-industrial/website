export function sanitizeNumber(value: string) {
  if (typeof value !== 'string') {
    throw new TypeError('O valor deve ser uma string.')
  }

  let sanitized = value.replace(/[^0-9,.-]/g, '')
  if (sanitized.includes('-')) {
    sanitized = '-' + sanitized.replace(/-/g, '')
  }

  return sanitized
}
