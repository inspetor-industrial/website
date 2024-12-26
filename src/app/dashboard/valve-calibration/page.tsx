import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { ValveCalibrationTable } from './table'
import { Toolbar } from './toolbar'

export const metadata: Metadata = {
  title: 'Calibração de válvula',
}

export default function Users() {
  return (
    <PageContainer>
      <Title>Lista de válvulas</Title>

      <div>
        <div id="toolbar">
          <Toolbar />
        </div>
        <ValveCalibrationTable />
      </div>
    </PageContainer>
  )
}
