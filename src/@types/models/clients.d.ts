export type Client = {
  name: string
  address: {
    street: string
    city: string
    state: string
  }
  cnpjOrCpf: string
  stateInscription: string
  cep: string
  phoneNumber: string

  // internal fields
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string

  companyOfUser: string

  id: string
}
