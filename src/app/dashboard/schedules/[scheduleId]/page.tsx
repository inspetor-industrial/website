import { Title } from '@inspetor/components/title'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

  const firebase = getFirebaseApps()
  const scheduleRef = await firebase?.firestore
    .collection(firebaseModels.schedules)
    .doc(scheduleId)
    .get()

  if (!scheduleRef || !scheduleRef.exists) {
    return notFound()
  }

  const schedule = scheduleRef.data()
  const scheduleClientName = schedule?.client.name || `#${scheduleId}`

  return (
    <main>
      <Title>
        {action} agendamento: {scheduleClientName}
      </Title>

      <ScheduleForm isDetail={isDetailAction} />
    </main>
  )
}
