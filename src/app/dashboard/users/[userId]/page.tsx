import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

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

  return (
    <main>
      <Title>
        {action} usuário: #{userId}
      </Title>

      <UserFormView isDetail={isDetailAction} />
    </main>
  )
}
