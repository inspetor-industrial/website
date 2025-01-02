import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ManometerCalibrationForm } from './form'

export const metadata: Metadata = {
  title: 'Cadastrar manômetro',
}

export default function RegisterManometer() {
  return (
    <main>
      <Title>Cadastrar uma novo manômetro</Title>

      <ManometerCalibrationForm />
    </main>
  )
}
