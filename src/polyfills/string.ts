declare global {
  interface String {
    toNumber(): number | null
    isDigit(): boolean
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

if (!String.prototype.isDigit) {
  String.prototype.isDigit = function (): boolean {
    return /^\d+$/.test(this.toString())
  }
}

export {}
