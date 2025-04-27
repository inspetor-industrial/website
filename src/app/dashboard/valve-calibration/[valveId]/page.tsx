import { Title } from '@inspetor/components/title'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

  const firebase = getFirebaseApps()
  const valveRef = await firebase?.firestore
    .collection(firebaseModels.valves)
    .doc(valveId)
    .get()

  if (!valveRef || !valveRef.exists) {
    return notFound()
  }

  const valve = valveRef.data()
  const valveSerialNumber = valve?.serialNumber || `#${valveId}`

  return (
    <main>
      <Title>
        {action} válvula: {valveSerialNumber}
      </Title>

      <ValveCalibrationForm isDetail={isDetailAction} />
    </main>
  )
}
