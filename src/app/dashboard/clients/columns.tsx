import { Client } from '@inspetor/@types/models/clients'
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
import { parseAsString } from '@inspetor/lib/parsers/string'
import { copyToClipboard } from '@inspetor/utils/copy-to-clipboard'
import { dispatchEvent } from '@inspetor/utils/dispatch-event'
import { ColumnDef } from '@tanstack/react-table'
import { Copy, Ellipsis, Pencil, Search, Trash2 } from 'lucide-react'

export const columns: ColumnDef<Client>[] = [
  {
    accessorFn: (row) => row.name,
    header: 'Empresa',
    id: 'name',
  },
  {
    accessorFn: (row) => row.cnpjOrCpf,
    header: 'CNPJ/CPF',
    id: 'cnpjOrCpf',
  },
  {
    accessorFn: (row) => row.address.state,
    header: 'Estado',
    id: 'state',
  },
  {
    accessorFn: (row) => row.phoneNumber,
    header: 'Telefone',
    id: 'phoneNumber',
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
              dispatchEvent(events.models.client.navigate.to.update, {
                clientId: original.id,
              })
            }
          >
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              dispatchEvent(events.models.client.navigate.to.detail, {
                clientId: original.id,
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
                  onClick={async () => await copyToClipboard(original.name)}
                >
                  Copiar empresa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () =>
                    await copyToClipboard(original.cnpjOrCpf)
                  }
                >
                  Copiar CNPJ/CPF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () =>
                    await copyToClipboard(original.phoneNumber)
                  }
                >
                  Copiar telefone
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
              dispatchEvent(events.models.client.delete, { client: original })
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
