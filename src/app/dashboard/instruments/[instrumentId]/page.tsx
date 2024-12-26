import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { InstrumentForm } from './form'

interface ScheduleViewProps {
  params: Promise<{ instrumentId: string }>
  searchParams: Promise<{ detail: boolean }>
}

export const metadata: Metadata = {
  title: 'Instrumento',
}

export default async function ScheduleView({
  params,
  searchParams,
}: ScheduleViewProps) {
  const { instrumentId } = await params
  const { detail } = await searchParams

  const isDetailAction = String(detail) === 'true'
  const action = isDetailAction ? 'Visualizar' : 'Editar'

  return (
    <main>
      <Title>
        {action} agendamento: #{instrumentId}
      </Title>

      <InstrumentForm isDetail={isDetailAction} />
    </main>
  )
}
