import { Schedule } from '@inspetor/@types/models/schedule'
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
import { services } from '@inspetor/constants/services'
import { dayjsApi } from '@inspetor/lib/dayjs'
import { parseAsString } from '@inspetor/lib/parsers/string'
import { copyToClipboard } from '@inspetor/utils/copy-to-clipboard'
import { dispatchEvent } from '@inspetor/utils/dispatch-event'
import { ColumnDef } from '@tanstack/react-table'
import { Copy, Ellipsis, Pencil, Search, Trash2 } from 'lucide-react'

export const columns: ColumnDef<Schedule>[] = [
  {
    accessorFn: (row) => services[row.service as keyof typeof services],
    header: 'Serviço',
    id: 'service',
  },
  {
    accessorFn: (row) => row.client.name,
    header: 'Cliente',
    id: 'client',
  },
  {
    accessorFn: (row) => row.responsible,
    header: 'Resposável',
    id: 'responsible',
  },
  {
    accessorFn: (row) =>
      dayjsApi(new Date(row.scheduledAt)).format('DD/MM/YYYY'),
    header: 'Data',
    id: 'scheduleAtDate',
  },
  {
    accessorFn: (row) => dayjsApi(new Date(row.scheduledAt)).format('HH:mm'),
    header: 'Horário',
    id: 'scheduleAtHour',
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
              dispatchEvent(events.models.schedules.navigate.to.update, {
                serviceId: original.id,
              })
            }
          >
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              dispatchEvent(events.models.schedules.navigate.to.detail, {
                serviceId: original.id,
              })
            }
          >
            <Search className="size-4" />
            Visualizar
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
                    await copyToClipboard(original.client.name)
                  }
                >
                  Copiar cliente
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () =>
                    await copyToClipboard(original.responsible)
                  }
                >
                  Copiar responsável
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
              dispatchEvent(events.models.schedules.delete, {
                schedule: original,
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
