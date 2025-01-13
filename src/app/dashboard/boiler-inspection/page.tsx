import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { BoilerInspectionModal } from './modal'
import { BoilerInspectionTable } from './table'
import { Toolbar } from './toolbar'

export const metadata: Metadata = {
  title: 'Inspeção de Caldeiras',
}

export default function Users() {
  return (
    <PageContainer>
      <Title>Lista de inspeções</Title>

      <div>
        <div id="toolbar">
          <Toolbar />
        </div>
        <BoilerInspectionTable />
      </div>

      <BoilerInspectionModal />
    </PageContainer>
  )
}
