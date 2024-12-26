import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { UserTable } from './table'
import { Toolbar } from './toolbar'

export const metadata: Metadata = {
  title: 'Agendamentos',
}

export default function Users() {
  return (
    <PageContainer>
      <Title>Lista de agendamentos</Title>

      <div>
        <div id="toolbar">
          <Toolbar />
        </div>
        <UserTable />
      </div>
    </PageContainer>
  )
}
