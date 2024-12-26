import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ScheduleForm } from './form'

export const metadata: Metadata = {
  title: 'Agendar Inspeção',
}

export default function RegisterClient() {
  return (
    <main>
      <Title>Agendar uma nova inspeção</Title>

      <ScheduleForm />
    </main>
  )
}
