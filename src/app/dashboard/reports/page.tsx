import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'

import { ReportTable } from './table'
import { Toolbar } from './toolbar'

export default function ReportsPage() {
  return (
    <PageContainer>
      <Title>Lista de relatórios gerados</Title>

      <div>
        <div id="toolbar">
          <Toolbar />
        </div>
        <ReportTable />
      </div>
    </PageContainer>
  )
}
