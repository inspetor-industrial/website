export function makeOptionValue(optionValue: Record<string, string>) {
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
