'use client'

import { Button } from '@inspetor/components/ui/button'
import { DownloadCloud } from 'lucide-react'

export function DownloadButton() {
  return (
    <Button variant="inspetor-blue">
      Baixar Relatório <DownloadCloud className="size-4" />
    </Button>
  )
}
