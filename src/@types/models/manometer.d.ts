import { Document } from '../document'

export type TableTests = {
  rowId: string
  standardValue: string
  cycleOneAscending: string
  cycleOneDescending: string
  cycleTwoAscending: string
  cycleTwoDescending: string
}

export type Manometer = {
  certificateNumber: string
  seal: string
  hirer: {
    id: string
    name: string
    cnpjOrCpf: string
  }

  serialNumber: string
  manufacturer: string

  dialDiameter: string

  class: string
  scale: string

  type: string
  tag: string

  instrument: {
    id: string
    serialNumber: string
  }

  calibrationDate: number
  nextCalibrationDate: number

  status: string
  observations: string

  tableTests: TableTests[]
  documents: Array<Document>

  // internal fields
  createdAt: number
  updatedAt: number
  createdBy: string
  updatedBy: string

  companyOfUser: string

  id: string
}
