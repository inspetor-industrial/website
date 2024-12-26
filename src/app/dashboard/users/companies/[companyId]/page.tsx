import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

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

  return (
    <main>
      <Title>
        {action} empresa: #{companyId}
      </Title>

      <CompanyFormView isDetail={isDetailAction} />
    </main>
  )
}
