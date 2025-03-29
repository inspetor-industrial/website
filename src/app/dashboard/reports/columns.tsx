import { Client } from '@inspetor/@types/models/clients'
import type { GeneratedReport } from '@inspetor/@types/models/generated-reports'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@inspetor/components/ui/dropdown-menu'
import { events } from '@inspetor/constants/events'
import { dayjsApi } from '@inspetor/lib/dayjs'
import { parseAsString } from '@inspetor/lib/parsers/string'
import { copyToClipboard } from '@inspetor/utils/copy-to-clipboard'
import { dispatchEvent } from '@inspetor/utils/dispatch-event'
import { formatReportType } from '@inspetor/utils/format-report-type'
import { ColumnDef } from '@tanstack/react-table'
import { Copy, Download, Ellipsis, Pencil, Search, Trash2 } from 'lucide-react'

export const columns: ColumnDef<GeneratedReport>[] = [
  {
    accessorFn: (row) => row.name,
    header: 'Relatório',
    id: 'name',
  },
  {
    accessorFn: (row) => row.createdAt,
    header: 'Data de geração',
    id: 'createdAt',
    cell: ({ row: { original } }) => {
      return (
        <span>
          {dayjsApi(original.createdAt).format('DD/MM/YYYY HH:mm:ss')}
        </span>
      )
    },
  },
  {
    accessorFn: (row) => row.type,
    header: 'Tipo de relatório',
    id: 'type',
    cell: ({ row: { original } }) => {
      return <span>{formatReportType(original.type)}</span>
    },
  },
  {
    accessorFn: (row) => row.size,
    header: 'Tamanho',
    id: 'size',
    cell: ({ row: { original } }) => {
      return <span>{original.size.toFixed(2)} MB</span>
    },
  },
  {
    accessorFn: (row) => row,
    header: 'Ações',
    id: 'actions',
    cell: ({ row: { original } }) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-muted p-1 px-1.5 rounded-md border border-gray-200 hover:bg-gray-100">
          <Ellipsis className="size-5 text-zinc-700" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() =>
              dispatchEvent(events.models.reports.download, {
                reportUrl: original.url,
              })
            }
          >
            <Download className="size-4" />
            Download
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Copy className="size-4" />
              Copiar
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={8}>
                <DropdownMenuItem
                  onClick={async () => await copyToClipboard(original.name)}
                >
                  Copiar nome do relatório
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => await copyToClipboard(original)}
                >
                  Copiar como objeto
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () =>
                    await copyToClipboard(original, {
                      parser: (text: any) =>
                        parseAsString(text, {
                          asCsv: true,
                        }),
                    })
                  }
                >
                  Copiar como texto
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            className="text-red-500 hover:!text-red-500"
            onClick={() =>
              dispatchEvent(events.models.reports.delete, { report: original })
            }
          >
            <Trash2 className="size-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
