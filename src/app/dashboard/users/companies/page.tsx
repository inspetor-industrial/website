import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { CompanyTable } from './table'
import { Toolbar } from './toolbar'

export const metadata: Metadata = {
  title: 'Empresas',
}

export default function Companies() {
  return (
    <PageContainer>
      <Title>Empresas</Title>

      <div>
        <div id="toolbar">
          <Toolbar />
        </div>
        <CompanyTable />
      </div>
    </PageContainer>
  )
}
