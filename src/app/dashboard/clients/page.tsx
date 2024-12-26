import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ClientTable } from './table'
import { Toolbar } from './toolbar'

export const metadata: Metadata = {
  title: 'Clientes',
}

export default function ClientsPage() {
  return (
    <PageContainer>
      <Title>Lista de clientes</Title>

      <div>
        <div id="toolbar">
          <Toolbar />
        </div>
        <ClientTable />
      </div>
    </PageContainer>
  )
}
