import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { AddNewUser } from './form'

export const metadata: Metadata = {
  title: 'Adicionar usuário',
}

export default function RegisterClient() {
  return (
    <main>
      <Title>Adicionar novo usuário</Title>

      <AddNewUser />
    </main>
  )
}
