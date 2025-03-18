const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

export function buildTimeDate(timestring: string) {
  if (!timeRegex.test(timestring)) {
    return new Date()
  }

  const now = new Date()
  const [hours, minutes] = timestring.split(':').map(Number)
  now.setHours(hours)
  now.setMinutes(minutes)

  return now
}
