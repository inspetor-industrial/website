import '@inspetor/polyfills/string'

export type valueToCalculateAutomaticBoilerUsedBodyProps = {
  boiler_maximum_pressure?: string | number
  body_diameter?: string | number
  AdmissibleVoltage?: number
  SolderingEfficiency?: number
  TemperatureCoefficient?: number
  CorrosionAddition?: number
  body_thickness?: string | number
  values?: number
  determinedAverage?: string | number
  furnaceType?: string

  aquatubular_tube_diameter: string
}

export function valueToCalculateAutomaticBoilerUsedBody({
  boiler_maximum_pressure = 0, // P
  body_diameter = 0, // D
  body_thickness = 0, // t
  aquatubular_tube_diameter,
}: valueToCalculateAutomaticBoilerUsedBodyProps) {
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

  let bodyThickness = 0
  if (body_thickness?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    const fractionResult = eval(body_thickness?.toString())

    bodyThickness = fractionResult
  } else if (
    body_thickness?.toString().includes(',') ||
    body_thickness.toString().isDigit()
  ) {
    bodyThickness = Number(body_thickness?.toString().replace(',', '.'))
  } else {
    bodyThickness = Number(body_thickness)
  }

  let tubeDiameter = 0
  if (body_thickness?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    const fractionResult = eval(aquatubular_tube_diameter?.toString())

    tubeDiameter = fractionResult
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

  const firstPart = boilerMaximumPressure / 10.19
  const secondPart =
    (0.5 * bodyDiameter - (bodyThickness - 1.6)) / (0.8 * 95 * 0.7)
  const thirdParty = 0.6 * (10 / 10.19)

  return firstPart * secondPart + thirdParty
}
