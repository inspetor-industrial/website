'use client'

import { Button } from '@inspetor/components/ui/button'
import { DownloadCloud } from 'lucide-react'

export function DownloadButton() {
  async function generatePDF() {}

  return (
    <Button variant="inspetor-blue" onClick={generatePDF}>
      Baixar Relatório <DownloadCloud className="size-4" />
    </Button>
  )
}
