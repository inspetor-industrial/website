import { PageContainer } from '@inspetor/components/page-container'
import { Title } from '@inspetor/components/title'
import { Metadata } from 'next'

import { RequestSupportForm } from './form'

export const metadata: Metadata = {
  title: 'Suporte',
}

export default function Users() {
  return (
    <PageContainer>
      <Title>Suporte</Title>

      <RequestSupportForm />
    </PageContainer>
  )
}
