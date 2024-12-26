import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { InstrumentForm } from './form'

export const metadata: Metadata = {
  title: 'Cadastrar instrumento',
}

export default function RegisterClient() {
  return (
    <main>
      <Title>Cadastrar um novo instrumento</Title>

      <InstrumentForm />
    </main>
  )
}
