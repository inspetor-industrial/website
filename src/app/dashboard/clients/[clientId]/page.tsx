import { Title } from '@inspetor/components/title'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ClientFormView } from './form'

interface ClientViewProps {
  params: Promise<{ clientId: string }>
  searchParams: Promise<{ detail: boolean }>
}

export const metadata: Metadata = {
  title: 'Cliente',
}

export default async function ClientView({
  params,
  searchParams,
}: ClientViewProps) {
  const { clientId } = await params
  const { detail } = await searchParams

  const isDetailAction = String(detail) === 'true'
  const action = isDetailAction ? 'Visualizar' : 'Editar'

  const firebase = getFirebaseApps()
  const clientRef = await firebase?.firestore
    .collection(firebaseModels.clients)
    .doc(clientId)
    .get()

  if (!clientRef || !clientRef.exists) {
    return notFound()
  }

  const client = clientRef.data()
  const clientName = client?.name || `#${clientId}`

  return (
    <main>
      <Title>
        {action} cliente: {clientName}
      </Title>

      <ClientFormView isDetail={isDetailAction} />
    </main>
  )
}
