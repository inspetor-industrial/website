import { Title } from '@inspetor/components/title'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { getFirebaseApps } from '@inspetor/lib/firebase/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CompanyFormView } from './form'

interface CompanyViewProps {
  params: Promise<{ companyId: string }>
  searchParams: Promise<{ detail: boolean }>
}

export const metadata: Metadata = {
  title: 'Empresa',
}

export default async function CompanyView({
  params,
  searchParams,
}: CompanyViewProps) {
  const { companyId } = await params
  const { detail } = await searchParams

  const isDetailAction = String(detail) === 'true'
  const action = isDetailAction ? 'Visualizar' : 'Editar'

  const firebase = getFirebaseApps()
  const companyRef = await firebase?.firestore
    .collection(firebaseModels.companies)
    .doc(companyId)
    .get()

  if (!companyRef || !companyRef.exists) {
    return notFound()
  }

  const company = companyRef.data()
  const companyName = company?.name || `#${companyId}`

  return (
    <main>
      <Title>
        {action} empresa: {companyName}
      </Title>

      <CompanyFormView isDetail={isDetailAction} />
    </main>
  )
}
