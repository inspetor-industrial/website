export type Schedule = {
  service: string
  clientId: string
  client: {
    id: string
    name: string
  }

  responsible: string

  scheduledAt: number
  local: string

  comments: string

  // internal fields
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string

  companyOfUser: string

  id: string
}
