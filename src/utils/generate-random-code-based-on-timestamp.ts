export function generateRandomCodeBasedOnTimestamp(
  length: number,
  defaultDate: Date = new Date(),
): string {
  const now = new Date(defaultDate).getTime().toString()
  return now.slice(now.length - length)
}
