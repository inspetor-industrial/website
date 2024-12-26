export type Valve = {
  certificateNumber: string
  seal: string
  hirer: {
    id: string
    name: string
    cnpjOrCpf: string
  }

  serialNumber: string
  nominalGauge: string
  manufacturer: string
  operation: string

  type: string
  tag: string

  lever: boolean
  workingFluid: string
  workingRange: string

  instrument: {
    id: string
    serialNumber: string
  }

  temperatureParameter: string
  openingPressureParameter: string
  closingPressureParameter: string

  openingPressureTest: string
  allowablePressure: string

  p1: string
  p2: string
  p3: string

  testDescription: string
  test1: string
  test2: string
  test3: string

  calibrationDate: number
  nextCalibrationDate: number

  status: string

  // internal fields
  createdAt: number
  updatedAt: number
  createdBy: string
  updatedBy: string

  companyOfUser: string

  id: string
}
