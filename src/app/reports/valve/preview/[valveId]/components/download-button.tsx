'use client'

import {
  ProgressDownloadDialog,
  ProgressDownloadDialogRef,
} from '@inspetor/components/progress-download-dialog'
import { Button } from '@inspetor/components/ui/button'
import { DownloadCloud } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useRef } from 'react'

export function DownloadButton() {
  const { valveId } = useParams<{ valveId: string }>()
  const progressDownloadDialogRef = useRef<ProgressDownloadDialogRef | null>(
    null,
  )

  async function generatePDF() {
    progressDownloadDialogRef.current?.open()

    await progressDownloadDialogRef.current?.generatePDF(valveId, 'valve')
  }

  return (
    <>
      <Button variant="inspetor-blue" onClick={generatePDF}>
        Baixar Relatório <DownloadCloud className="size-4" />
      </Button>
      <ProgressDownloadDialog ref={progressDownloadDialogRef} />
    </>
  )
}
