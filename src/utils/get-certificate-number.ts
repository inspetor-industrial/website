export function getCertificateNumber(digitCounts: number = 6): string {
  const charset = '0123456789'
  let randomCode = ''

  for (let i = 0; i < digitCounts; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    randomCode += charset.charAt(randomIndex)
  }

  return randomCode
}
