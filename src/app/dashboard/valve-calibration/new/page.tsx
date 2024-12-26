import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ValveCalibrationForm } from './form'

export const metadata: Metadata = {
  title: 'Cadastrar válvula',
}

export default function RegisterClient() {
  return (
    <main>
      <Title>Cadastrar uma nova válvula</Title>

      <ValveCalibrationForm />
    </main>
  )
}
