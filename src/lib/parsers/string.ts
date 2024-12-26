interface ParseAsStringOptions {
  asJson?: boolean
  asCsv?: boolean
  separator?: string
}

export function parseAsString(text: any, options?: ParseAsStringOptions) {
  const { asJson, asCsv, separator } = options ?? {}
  const isObject = (text: any) => typeof text === 'object'

  if (isObject(text) && asJson) {
    return JSON.stringify(text, null, 2)
  }

  if (isObject(text) && asCsv) {
    return Object.values(text)
      .filter((text) => !isObject(text))
      .join(separator ?? '\t')
  }

  console.log(Object.values(text))
  return String(text)
}
