import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { RegisterClientForm } from './form'

export const metadata: Metadata = {
  title: 'Cadastrar cliente',
}

export default function RegisterClient() {
  return (
    <main>
      <Title>Cadastrar novo cliente</Title>

      <RegisterClientForm />
    </main>
  )
}
