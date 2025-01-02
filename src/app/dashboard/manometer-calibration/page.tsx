import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ManometerCalibrationTable } from './table'
import { Toolbar } from './toolbar'

export const metadata: Metadata = {
  title: 'Calibração de manômetro',
}

export default function Users() {
  return (
    <PageContainer>
      <Title>Lista de manômetros</Title>

      <div>
        <div id="toolbar">
          <Toolbar />
        </div>
        <ManometerCalibrationTable />
      </div>
    </PageContainer>
  )
}
