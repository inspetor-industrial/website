import { Title } from '@inspetor/components/title'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

  const firebase = getFirebaseApps()
  const instrumentRef = await firebase?.firestore
    .collection(firebaseModels.instruments)
    .doc(instrumentId)
    .get()

  if (!instrumentRef || !instrumentRef.exists) {
    return notFound()
  }

  const instrument = instrumentRef.data()
  const instrumentSerialNumber = instrument?.serialNumber || `#${instrumentId}`

  return (
    <main>
      <Title>
        {action} instrumento: {instrumentSerialNumber}
      </Title>

      <InstrumentForm isDetail={isDetailAction} />
    </main>
  )
}
