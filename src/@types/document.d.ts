export type Document = {
  downloadUrl: string
  name: string
  size: number

  type: string

  id: string

  configs?: {
    position: {
      x: number
      y: number
    }
    zoom: number
  }

  legend?: string

  createdAt: number
  updatedAt: number
  createdBy: string
  updatedBy: string

  companyOfUser: string
}
