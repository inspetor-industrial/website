export async function runSafety(fn: () => void | Promise<void>) {
  try {
    return await fn()
  } catch (error) {
    console.log(error)
  }
}
