export function makeOptionValue(
  optionValue: Record<string, string>,
  keysBySequence: string[] = [],
) {
  if (keysBySequence.length) {
    return keysBySequence
      .map((key) => optionValue[key] || '')
      .filter((opt) => opt)
      .join('|')
  }

  return Object.keys(optionValue)
    .map((key) => {
      return `${optionValue[key]}`
    })
    .join('|')
}

export function makeOptionObject(optionValue: string, keys: string[]) {
  const values = optionValue.split('|')
  return keys.reduce(
    (acc, key, index) => {
      acc[key] = values[index]
      return acc
    },
    {} as Record<string, string>,
  )
}
