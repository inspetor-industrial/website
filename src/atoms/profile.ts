import { atom } from 'jotai'

type Profile = {
  id: string
  name: string
  email: string
  username: string
  crea: string
  companyId: string
  backgroundPhoto?: string
  profession:
    | 'engenheiro (a)'
    | 'técnico (a)'
    | 'secretário (a)'
    | 'administrador (a)'
  nationalRegister: string
  specialty: string
  authUserId: string
  updatedAt: number
  updatedBy: string
}

export const profileAtom = atom<Profile | null>(null)
export const isLoadingProfileAtom = atom(true)
