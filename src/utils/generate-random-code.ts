export function generateRandomCode(
  length: number,
  withLetters: boolean = false,
): string {
  let charset = '0123456789'
  let randomCode = ''

  if (withLetters) {
    charset = charset.concat(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    )
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    randomCode += charset.charAt(randomIndex)
  }

  return randomCode
}
