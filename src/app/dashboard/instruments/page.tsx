import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { InstrumentsTable } from './table'
import { Toolbar } from './toolbar'

export const metadata: Metadata = {
  title: 'Instrumentos',
}

export default function Users() {
  return (
    <PageContainer>
      <Title>Lista de instrumentos</Title>

      <div>
        <div id="toolbar">
          <Toolbar />
        </div>
        <InstrumentsTable />
      </div>
    </PageContainer>
  )
}
