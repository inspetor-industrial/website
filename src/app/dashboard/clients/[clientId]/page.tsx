import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

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

  return (
    <main>
      <Title>
        {action} cliente: #{clientId}
      </Title>

      <ClientFormView isDetail={isDetailAction} />
    </main>
  )
}
