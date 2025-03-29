'use client'

import {
  ProgressDownloadDialog,
  ProgressDownloadDialogRef,
} from '@inspetor/components/progress-download-dialog'
import { Button } from '@inspetor/components/ui/button'
import { DownloadCloud } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useRef } from 'react'

type DownloadButtonProps = {
  type: 'boiler' | 'manometer' | 'valve'
}

export function DownloadButton({ type: reportType }: DownloadButtonProps) {
  const { boilerId } = useParams<{ boilerId: string }>()
  const progressDownloadDialogRef = useRef<ProgressDownloadDialogRef | null>(
    null,
  )

  async function generatePDF() {
    progressDownloadDialogRef.current?.open()

    await progressDownloadDialogRef.current?.generatePDF(boilerId, reportType)
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
