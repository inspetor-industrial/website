export function replaceUndefinedValues(obj: any, defaultValue: any = ''): any {
  // If obj is exactly undefined, return the default value immediately.
  if (obj === undefined) return defaultValue

  // If it's null or not an object, just return it as is.
  if (obj === null || typeof obj !== 'object') return obj

  // If it's an array, iterate through each element.
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] === undefined) {
        obj[i] = defaultValue
      } else {
        // Recursively update nested arrays or objects.
        obj[i] = replaceUndefinedValues(obj[i], defaultValue)
      }
    }
    return obj
  }

  // For plain objects, iterate over its keys.
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === undefined) {
        obj[key] = defaultValue
      } else {
        // Recursively update nested objects.
        obj[key] = replaceUndefinedValues(obj[key], defaultValue)
      }
    }
  }
  return obj
}
