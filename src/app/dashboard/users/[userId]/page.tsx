import { Title } from '@inspetor/components/title'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { UserFormView } from './form'

interface UserViewProps {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ detail: boolean }>
}

export const metadata: Metadata = {
  title: 'Usuário',
}

export default async function UserView({
  params,
  searchParams,
}: UserViewProps) {
  const { userId } = await params
  const { detail } = await searchParams

  const isDetailAction = String(detail) === 'true'
  const action = isDetailAction ? 'Visualizar' : 'Editar'

  const firebase = getFirebaseApps()
  const userRef = await firebase?.firestore
    .collection(firebaseModels.users)
    .doc(userId)
    .get()

  if (!userRef || !userRef.exists) {
    return notFound()
  }

  const user = userRef.data()
  const userName = user?.name || `#${userId}`

  return (
    <main>
      <Title>
        {action} usuário: {userName}
      </Title>

      <UserFormView isDetail={isDetailAction} />
    </main>
  )
}
