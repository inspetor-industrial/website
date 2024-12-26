import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ScheduleForm } from './form'

interface ScheduleViewProps {
  params: Promise<{ scheduleId: string }>
  searchParams: Promise<{ detail: boolean }>
}

export const metadata: Metadata = {
  title: 'Agendamento',
}

export default async function ScheduleView({
  params,
  searchParams,
}: ScheduleViewProps) {
  const { scheduleId } = await params
  const { detail } = await searchParams

  const isDetailAction = String(detail) === 'true'
  const action = isDetailAction ? 'Visualizar' : 'Editar'

  return (
    <main>
      <Title>
        {action} agendamento: #{scheduleId}
      </Title>

      <ScheduleForm isDetail={isDetailAction} />
    </main>
  )
}
