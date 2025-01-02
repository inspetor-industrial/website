'use client'

import { LogType } from '@inspetor/constants/log-type'
import { axiosApi } from '@inspetor/lib/api'
import { cn } from '@inspetor/lib/utils'
import { AxiosError } from 'axios'
import { Loader2, Triangle } from 'lucide-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

type Props = {}

type Log = {
  type: LogType
  message: string
}

type ReportType = 'valve' | 'manometer' | 'boiler'
export type ProgressDownloadDialogRef = {
  open: () => void
  close: () => void
  generatePDF: (reportId: string, reportType: ReportType) => Promise<void>
}

const ProgressDownloadDialog = forwardRef(function ProgressDownloadDialog(
  props: Props,
  ref,
) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [logs, setLogs] = useState<Log[]>([])

  const [downloadLink, setDownloadLink] = useState<string | undefined>(
    undefined,
  )

  const [cancelSignal, setCancelSignal] = useState<AbortController | undefined>(
    undefined,
  )

  function handleOpenDialog() {
    setIsDialogOpened(true)
  }

  function handleCloseDialog() {
    setIsDialogOpened(false)
  }

  function handleDownloadPDF() {
    if (downloadLink) {
      window.open(downloadLink, '_blank')
    }
  }

  async function handleGeneratePDF(reportId: string, reportType: ReportType) {
    setLogs([
      {
        type: LogType.INFO,
        message: `${new Date().toISOString()}: [${LogType.INFO}] Gerando PDF do relatório ${reportType} com ID ${reportId}.`,
      },
      {
        type: LogType.INFO,
        message: `${new Date().toISOString()}: [${LogType.INFO}] Gerando PDF do relatório ${reportType} com ID ${reportId}.`,
      },
    ])

    const signalController = new AbortController()
    setCancelSignal(signalController)

    try {
      setIsGeneratingPDF(true)
      const response = await axiosApi.get(
        `/generate/calibration/pdf?report_id=${reportId}&calibration_type=${reportType}`,
        {
          signal: signalController.signal,
        },
      )

      setLogs((prevLogs) => [
        ...prevLogs,
        {
          type: LogType.SUCCESS,
          message: `${new Date().toISOString()}: [${LogType.SUCCESS}] PDF gerado com sucesso.`,
        },
        {
          type: LogType.SUCCESS,
          message: `${new Date().toISOString()}: [${LogType.SUCCESS}] Detalhes: ${JSON.stringify(response.data)}`,
        },
        {
          type: LogType.SUCCESS,
          message: `${new Date().toISOString()}: [${LogType.SUCCESS}] URL para download: ${response.data.url}`,
        },
      ])

      setDownloadLink(response.data.url)
      setCancelSignal(undefined)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setLogs((prevLogs) => [
            ...prevLogs,
            {
              type: LogType.ERROR,
              message: `${new Date().toISOString()}: [${LogType.ERROR}] Erro ao gerar PDF: ${error.response?.data.details}`,
            },
          ])
        } else {
          setLogs((prevLogs) => [
            ...prevLogs,
            {
              type: LogType.ERROR,
              message: `${new Date().toISOString()}: [${LogType.ERROR}] Erro ao gerar PDF: ${error}`,
            },
          ])
        }
      }

      setLogs((prevLogs) => [
        ...prevLogs,
        {
          type: LogType.ERROR,
          message: `${new Date().toISOString()}: [${LogType.ERROR}] Erro ao gerar PDF: ${error}`,
        },
      ])
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  async function handleCancelPDFGeneration() {
    if (cancelSignal) {
      cancelSignal.abort()

      setLogs((prevLogs) => [
        ...prevLogs,
        {
          type: LogType.WARN,
          message: `${new Date().toISOString()}: [${LogType.WARN}] Geração do PDF cancelada.`,
        },
      ])

      setCancelSignal(undefined)
    }

    setTimeout(() => {
      handleCloseDialog()
    }, 300)
  }

  useImperativeHandle<unknown, ProgressDownloadDialogRef>(ref, () => {
    return {
      open: handleOpenDialog,
      close: handleCloseDialog,
      generatePDF: handleGeneratePDF,
    }
  })

  return (
    <AlertDialog open={isDialogOpened}>
      <AlertDialogContent className="rounded">
        <AlertDialogHeader>
          <AlertDialogTitle>Progresso</AlertDialogTitle>

          <AlertDialogDescription>
            Seu download está sendo preparado. Aguarde alguns instantes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Collapsible className="rounded overflow-hidden shadow">
          <CollapsibleTrigger className="group py-2 bg-zinc-200 w-full px-2">
            <div className="flex items-center">
              <Triangle className="size-2 fill-black rotate-90 group-data-[state=open]:rotate-180 transition-transform" />
              <span className="ml-2 text-sm">Logs</span>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-zinc-950 p-2 text-white">
            {logs.length === 0 && (
              <p className="text-xs text-center">Nenhum log disponível.</p>
            )}
            <ScrollArea className="h-40">
              {logs.map((log, index) => (
                <p
                  key={index}
                  className={cn(
                    'text-xs',
                    log.type === LogType.INFO && '!text-blue-500',
                    log.type === LogType.WARN && '!text-yellow-500',
                    log.type === LogType.ERROR && '!text-red-500',
                    log.type === LogType.SUCCESS && '!text-green-500',
                  )}
                >
                  {log.message}
                </p>
              ))}

              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>

        <AlertDialogFooter className="">
          <AlertDialogAction
            variant="outline"
            onClick={handleCancelPDFGeneration}
          >
            {cancelSignal ? 'Cancelar' : 'Fechar'}
          </AlertDialogAction>
          <AlertDialogAction
            disabled={isGeneratingPDF || !downloadLink}
            onClick={handleDownloadPDF}
            className=""
          >
            {isGeneratingPDF ? (
              <div className="items-center flex">
                <Loader2 className="size-4 animate-spin" />
                <span className="ml-2">Gerando PDF</span>
              </div>
            ) : (
              'Visualizar PDF'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

export { ProgressDownloadDialog }
