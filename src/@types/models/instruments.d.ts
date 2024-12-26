import { Document } from '../document'

export type Instrument = {
  type: string
  serialNumber: string
  manufacturer: string
  certificateNumber: string

  validationDate: number

  documents: Array<Document>

  // internal fields
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string

  companyOfUser: string

  id: string
}
