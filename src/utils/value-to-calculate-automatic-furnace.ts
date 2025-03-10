import '@inspetor/polyfills/string'

export type valueToCalculateAutomaticFurnaceProps = {
  outerDiameterOfFurnace?: number // D0 Diametro externo da fornalha
  thicknessAllowedInTheProject?: number // t0 Espessura admitida no projeto
  factorA285C?: number // B fator A285C a 500oF
  values?: number
  furnace_types?: string
  bodyDiameter?: number
  tube_diameter?: number
  staysWidth?: string
  furnaceTypeInfo?: string
  boiler_maximum_pressure?: number | string // PMTA
  aquatubular_tube_diameter: string
}

export function valueToCalculateAutomaticFurnace({
  bodyDiameter = 0,
  tube_diameter = 0,
  boiler_maximum_pressure = 0,
  aquatubular_tube_diameter,
  staysWidth = '0',
  furnaceTypeInfo = 'da',
}: valueToCalculateAutomaticFurnaceProps) {
  let bodyDiameterConverted = 0
  if (bodyDiameter?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    bodyDiameterConverted = eval(bodyDiameter?.toString())
  } else if (
    bodyDiameter?.toString().includes(',') ||
    bodyDiameter.toString().isDigit()
  ) {
    bodyDiameterConverted = Number(bodyDiameter?.toString().replace(',', '.'))
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
  }

  let aquatubularTubeDiameter = 0
  if (aquatubular_tube_diameter?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    aquatubularTubeDiameter = eval(aquatubular_tube_diameter?.toString())
  } else if (
    aquatubular_tube_diameter?.toString().includes(',') ||
    aquatubular_tube_diameter.toString().isDigit()
  ) {
    aquatubularTubeDiameter = Number(
      aquatubular_tube_diameter?.toString().replace(',', '.'),
    )
  }

  let pmta = 0
  if (boiler_maximum_pressure?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    pmta = eval(boiler_maximum_pressure?.toString())
  } else if (
    boiler_maximum_pressure?.toString().includes(',') ||
    boiler_maximum_pressure.toString().isDigit()
  ) {
    pmta = Number(boiler_maximum_pressure?.toString().replace(',', '.'))
  } else {
    pmta = Number(boiler_maximum_pressure)
  }

  let stays = 0
  if (staysWidth?.toString().includes('/')) {
    // eslint-disable-next-line no-eval
    stays = eval(staysWidth?.toString())
  } else if (
    staysWidth?.toString().includes(',') ||
    staysWidth.toString().isDigit()
  ) {
    stays = Number(staysWidth?.toString().replace(',', '.'))
  } else {
    stays = Number(staysWidth)
  }

  let result = 0

  if (furnaceTypeInfo !== 'cal') {
    const firstPart = pmta * 14.22 * 3 * (bodyDiameter / 25.4)
    const secondPart = firstPart / (4 * 7200)

    // eslint-disable-next-line
    result = secondPart * 25.4
  } else {
    const firstPart = stays / 25.4
    const secondPart = Math.sqrt((pmta * 14.22) / (13300 * 2.2))

    const thirdPart = 2 / 25.4
    const fourthPart = firstPart * secondPart + thirdPart

    result = fourthPart * 25.4
  }

  return result
}
