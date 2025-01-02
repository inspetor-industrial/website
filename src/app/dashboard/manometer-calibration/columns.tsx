import { Manometer } from '@inspetor/@types/models/manometer'
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
import { status } from '@inspetor/constants/status'
import { dayjsApi } from '@inspetor/lib/dayjs'
import { parseAsString } from '@inspetor/lib/parsers/string'
import { copyToClipboard } from '@inspetor/utils/copy-to-clipboard'
import { dispatchEvent } from '@inspetor/utils/dispatch-event'
import { ColumnDef } from '@tanstack/react-table'
import {
  Copy,
  Ellipsis,
  FileSearch,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react'

export const columns: ColumnDef<Manometer>[] = [
  {
    accessorFn: (row) => row.certificateNumber,
    header: 'N° de certificado',
    id: 'certificateNumber',
  },
  {
    accessorFn: (row) => row.hirer.name,
    header: 'Contratante',
    id: 'hirer',
  },
  {
    accessorFn: (row) => row.manufacturer,
    header: 'Fabricante',
    id: 'manufacture',
  },
  {
    accessorFn: (row) => status[row.status as keyof typeof status],
    header: 'Status',
    id: 'status',
  },
  {
    accessorFn: (row) =>
      dayjsApi(new Date(row.nextCalibrationDate)).format('YYYY-MM'),
    header: 'Próxima calibração',
    id: 'nextCalibrationDate',
  },
  {
    accessorFn: (row) =>
      dayjsApi(new Date(row.createdAt)).format('DD/MM/YYYY HH:mm'),
    header: 'Criado em',
    id: 'createdAt',
  },
  {
    accessorFn: (row) =>
      dayjsApi(new Date(row.updatedAt)).format('DD/MM/YYYY HH:mm'),
    header: 'Atualizado em',
    id: 'updatedAt',
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
              dispatchEvent(events.models.manometers.navigate.to.update, {
                manometerId: original.id,
              })
            }
          >
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              dispatchEvent(events.models.manometers.navigate.to.detail, {
                manometerId: original.id,
              })
            }
          >
            <Search className="size-4" />
            Visualizar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              dispatchEvent(events.models.manometers.navigate.to.preview, {
                manometerId: original.id,
              })
            }
          >
            <FileSearch className="size-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Copy className="size-4" />
              Copiar
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={8}>
                <DropdownMenuItem
                  onClick={async () =>
                    await copyToClipboard(original.manufacturer)
                  }
                >
                  Copiar Fabricante
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () =>
                    await copyToClipboard(original.serialNumber)
                  }
                >
                  Copiar n° de série
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () =>
                    await copyToClipboard(original.certificateNumber)
                  }
                >
                  Copiar n° do certificado
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
              dispatchEvent(events.models.manometers.delete, {
                manometer: original,
              })
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
