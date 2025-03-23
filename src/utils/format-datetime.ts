export function formatDate(timestamp: number) {
  const dateObject = new Date(timestamp)
  return dateObject.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
