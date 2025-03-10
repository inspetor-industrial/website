import '@inspetor/polyfills/string'

export type valueToCalculateAutomaticBoilerBodyProps = {
  boiler_maximum_pressure?: string | number
  body_diameter?: string | number
  AdmissibleVoltage?: number
  SolderingEfficiency?: number
  TemperatureCoefficient?: number
  CorrosionAddition?: number
  tube_diameter?: string | number
  values?: number
  furnace_types?: string
  bodyDiameter?: number
  aquatubular_tube_diameter: string
  isFurnaceForm?: boolean
}

export function valueToCalculateAutomaticBoilerBody({
  boiler_maximum_pressure = '0', // P
  body_diameter = '0', // D
  tube_diameter = '0',
  AdmissibleVoltage = 13300, // S
  SolderingEfficiency = 0.9, // E
  TemperatureCoefficient = 0.4, // Y
  CorrosionAddition = 1.6, // C
  furnace_types,
  aquatubular_tube_diameter,
  isFurnaceForm = false,
}: valueToCalculateAutomaticBoilerBodyProps): number {
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
  } else {
    boilerMaximumPressure = Number(boiler_maximum_pressure)
  }

  let tubeDiameter = 0

  if (tube_diameter?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    tubeDiameter = eval(tube_diameter?.toString())
  } else if (
    tube_diameter?.toString().includes(',') ||
    tube_diameter.toString().isDigit()
  ) {
    tubeDiameter = Number(tube_diameter?.toString().replace(',', '.'))
  } else {
    tubeDiameter = Number(tube_diameter)
  }

  let bodyDiameter = 0
  if (body_diameter?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    bodyDiameter = eval(body_diameter?.toString())
  } else if (
    body_diameter?.toString().includes(',') ||
    body_diameter.toString().isDigit()
  ) {
    bodyDiameter = Number(body_diameter?.toString().replace(',', '.'))
  } else {
    bodyDiameter = Number(body_diameter)
  }

  if (isFurnaceForm && furnace_types?.toLowerCase().includes('watertube')) {
    if (aquatubular_tube_diameter?.toString().includes('/')) {
      // eslint-disable-next-line no-eval
      tubeDiameter = eval(aquatubular_tube_diameter?.toString())
    } else if (
      aquatubular_tube_diameter?.toString().includes(',') ||
      aquatubular_tube_diameter.toString().isDigit()
    ) {
      tubeDiameter = Number(
        aquatubular_tube_diameter?.toString().replace(',', '.'),
      )
    } else {
      tubeDiameter = Number(aquatubular_tube_diameter)
    }

    bodyDiameter = tubeDiameter

    return (
      (((bodyDiameter / 25.4) * (boilerMaximumPressure * 14.22)) /
        (2 * 13300 * 0.9 + 2 * 0.4 * (boilerMaximumPressure * 14.22)) +
        0.04) *
      25.4
    )
  }

  boilerMaximumPressure = Number(
    (Number(boilerMaximumPressure) * 14.22).toFixed(2),
  )
  bodyDiameter = Number((Number(bodyDiameter) / 25.4).toFixed(2))
  tubeDiameter = Number((Number(tubeDiameter) / 25.4).toFixed(2))

  return (
    ((boilerMaximumPressure * bodyDiameter) /
      (2 * AdmissibleVoltage * SolderingEfficiency +
        2 * TemperatureCoefficient * boilerMaximumPressure) +
      CorrosionAddition / 25.4) *
    25.4
  )
}
