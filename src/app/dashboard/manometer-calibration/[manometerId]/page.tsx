import { Title } from '@inspetor/components/title'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

  const firebase = getFirebaseApps()
  const manometerRef = await firebase?.firestore
    .collection(firebaseModels.manometers)
    .doc(manometerId)
    .get()

  if (!manometerRef || !manometerRef.exists) {
    return notFound()
  }

  const manometer = manometerRef.data()
  const manometerCertificateNumber =
    manometer?.certificateNumber || `#${manometerId}`

  return (
    <main>
      <Title>
        {action} manômetro: {manometerCertificateNumber}
      </Title>

      <ManometerCalibrationForm isDetail={isDetailAction} />
    </main>
  )
}
