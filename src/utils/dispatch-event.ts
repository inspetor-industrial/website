export function dispatchEvent(name: string, detail?: any) {
  const event = new CustomEvent(name, { detail })
  window.dispatchEvent(event)
}
