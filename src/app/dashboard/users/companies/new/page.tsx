import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { AddNewCompany } from './form'

export const metadata: Metadata = {
  title: 'Adicionar empresa',
}

export default function RegisterClient() {
  return (
    <main>
      <Title>Adicionar nova empresa</Title>

      <AddNewCompany />
    </main>
  )
}
