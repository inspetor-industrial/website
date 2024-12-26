export type User = {
  name: string
  email: string

  authUserId: string
  companyId: string

  preferences?: Record<string, any>

  role: string

  profession:
    | 'engenheiro (a)'
    | 'técnico (a)'
    | 'secretário (a)'
    | 'administrador (a)'
  crea: string
  specialty: string
  username: string

  nationalRegister: string

  backgroundPhoto?: string

  // internal fields
  createdAt: number
  updatedAt: number
  createdBy: string
  updatedBy: string

  id: string
}
