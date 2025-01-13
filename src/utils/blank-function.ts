export function blankFunction(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('This function is blank', args)
  }
}
