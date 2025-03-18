export async function runSafety(
  fn: () => void | Promise<void>,
  callback?: () => any,
) {
  try {
    return await fn()
  } catch (error) {
    console.log(error)
    return callback?.()
  }
}
