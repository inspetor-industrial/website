import '@inspetor/polyfills/string'

export type valueToCalculateAutomaticMirrorProps = {
  always_length?: string // p
  boiler_maximum_pressure?: string // P
  admissibleVoltage?: number // S
  additionOfCorrosion?: number // C
  value?: number // Result
}

export function valueToCalculateAutomaticMirror({
  always_length = '0',
  boiler_maximum_pressure = '0',
}: valueToCalculateAutomaticMirrorProps) {
  let alwaysLength = 0
  if (always_length?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    alwaysLength = eval(always_length?.toString())
  } else if (
    always_length?.toString().includes(',') ||
    always_length.toString().isDigit()
  ) {
    alwaysLength = Number(always_length?.toString().replace(',', '.'))
  }

  let boilerMaximumPressure = 0
  if (boiler_maximum_pressure?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    boilerMaximumPressure = eval(boiler_maximum_pressure?.toString())
  } else if (
    boiler_maximum_pressure?.toString().includes(',') ||
    boiler_maximum_pressure.toString().isDigit()
  ) {
    boilerMaximumPressure = Number(
      boiler_maximum_pressure?.toString().replace(',', '.'),
    )
  }

  alwaysLength = Number((alwaysLength / 25.4).toFixed(2))
  boilerMaximumPressure = Number((boilerMaximumPressure * 14.22).toFixed(2))

  // eslint-disable-next-line
  return ((alwaysLength * (Math.sqrt(boilerMaximumPressure / (13_300 * 2.22)))) + (2 / 25.4)) * 25.4;
}
