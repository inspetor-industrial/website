import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ValveCalibrationForm } from './form'

interface ScheduleViewProps {
  params: Promise<{ valveId: string }>
  searchParams: Promise<{ detail: boolean }>
}

export const metadata: Metadata = {
  title: 'Válvula',
}

export default async function ScheduleView({
  params,
  searchParams,
}: ScheduleViewProps) {
  const { valveId } = await params
  const { detail } = await searchParams

  const isDetailAction = String(detail) === 'true'
  const action = isDetailAction ? 'Visualizar' : 'Editar'

  return (
    <main>
      <Title>
        {action} agendamento: #{valveId}
      </Title>

      <ValveCalibrationForm isDetail={isDetailAction} />
    </main>
  )
}
