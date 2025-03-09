declare global {
  interface String {
    toNumber(): number | null
  }
}

if (!String.prototype.toNumber) {
  String.prototype.toNumber = function (): number | null {
    const parsedValue = Number(this.toString())

    if (isNaN(parsedValue)) {
      return null
    }

    return parsedValue
  }
}

export {}
