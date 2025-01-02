import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ManometerCalibrationForm } from './form'

interface ManometerViewProps {
  params: Promise<{ manometerId: string }>
  searchParams: Promise<{ detail: boolean }>
}

export const metadata: Metadata = {
  title: 'Manômetro',
}

export default async function ManometerView({
  params,
  searchParams,
}: ManometerViewProps) {
  const { manometerId } = await params
  const { detail } = await searchParams

  const isDetailAction = String(detail) === 'true'
  const action = isDetailAction ? 'Visualizar' : 'Editar'

  return (
    <main>
      <Title>
        {action} agendamento: #{manometerId}
      </Title>

      <ManometerCalibrationForm isDetail={isDetailAction} />
    </main>
  )
}
