'use client'

import { Client } from '@inspetor/@types/models/clients'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@inspetor/components/ui/table'
import { appConfigs } from '@inspetor/constants/configs'
import { events } from '@inspetor/constants/events'
import { firebaseModels } from '@inspetor/constants/firebase-models'
import { toast } from '@inspetor/hooks/use-toast'
import { firestore } from '@inspetor/lib/firebase/client'
import { queryClient } from '@inspetor/lib/query'
import { SentryReactQueryCatcher } from '@inspetor/lib/sentry/react-query/catcher'
import { normalizeText } from '@inspetor/utils/normalize-text'
import { useQuery } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  and,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useProgress } from 'react-transition-progress'

import { Pagination } from '../../../components/table/pagination'
import { columns } from './columns'

export function ClientTable() {
  const [name] = useQueryState('name', parseAsString.withDefault(''))
  const [currentPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const session = useSession()

  const { data, isPending, refetch } = useQuery<{
    total: number
    clients: Client[]
  }>({
    queryKey: ['clients', name, currentPage],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const coll = collection(firestore, firebaseModels.clients)
      const q = query(
        coll,
        and(
          where(
            'rowNumber',
            '>=',
            (currentPage - 1) * appConfigs.limitOfQueries,
          ),
          where('search', 'array-contains-any', [
            normalizeText(name) || appConfigs.firestore.emptyString,
          ]),
          where(
            appConfigs.firestore.permissions.byCompanyPropertyName,
            '==',
            session.data?.user?.companyId,
          ),
        ),
        orderBy('rowNumber'),
        limit(appConfigs.limitOfQueries),
      )

      const total = await getCountFromServer(
        query(
          coll,
          and(
            where(
              'rowNumber',
              '>=',
              (currentPage - 1) * appConfigs.limitOfQueries,
            ),
            where('search', 'array-contains-any', [
              normalizeText(name) || appConfigs.firestore.emptyString,
            ]),
            where(
              appConfigs.firestore.permissions.byCompanyPropertyName,
              '==',
              session.data?.user?.companyId,
            ),
          ),
          orderBy('rowNumber'),
        ),
      )
      const clients = await getDocs(q)

      return {
        total: total.data().count,
        clients: clients.docs.map((doc) => {
          const data = doc.data() as Client
          return {
            ...data,
            id: doc.id,
          }
        }),
      }
    },
    retry: 4,
    enabled: !!session.data?.user?.companyId,
  })

  const table = useReactTable({
    data: data?.clients ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const startProgressBar = useProgress()
  const router = useRouter()

  useEffect(() => {
    function handleNavigateToRegisterPage() {
      startProgressBar()

      router.push('/dashboard/clients/register')
    }

    function handleNavigateToDetailPage(event: Event) {
      const { clientId } = (event as CustomEvent).detail

      startProgressBar()

      router.push(`/dashboard/clients/${clientId}?detail=true`)
    }

    function handleNavigateToUpdatePage(event: Event) {
      const { clientId } = (event as CustomEvent).detail

      startProgressBar()

      router.push(`/dashboard/clients/${clientId}`)
    }

    async function handleDeleteClient(event: Event) {
      const { client } = (event as CustomEvent).detail

      try {
        const coll = collection(firestore, firebaseModels.clients)

        const docRef = doc(coll, client.id)
        await deleteDoc(docRef)

        queryClient.invalidateQueries({
          queryKey: ['clients'],
          type: 'all',
        })

        refetch()

        toast({
          title: `Cliente ${client.name} deletado com sucesso!`,
          variant: 'success',
        })
      } catch {
        toast({
          title: 'Erro ao deletar cliente!',
          variant: 'destructive',
        })
      }
    }

    window.addEventListener(
      events.models.client.navigate.to.register,
      handleNavigateToRegisterPage,
    )

    window.addEventListener(
      events.models.client.navigate.to.detail,
      handleNavigateToDetailPage,
    )

    window.addEventListener(
      events.models.client.navigate.to.update,
      handleNavigateToUpdatePage,
    )

    window.addEventListener(events.models.client.delete, handleDeleteClient)

    return () => {
      window.removeEventListener(
        events.models.client.navigate.to.register,
        handleNavigateToRegisterPage,
      )

      window.removeEventListener(
        events.models.client.navigate.to.detail,
        handleNavigateToDetailPage,
      )

      window.removeEventListener(
        events.models.client.navigate.to.update,
        handleNavigateToUpdatePage,
      )

      window.removeEventListener(
        events.models.client.delete,
        handleDeleteClient,
      )
    }
  }, [
    refetch,
    router,
    session.data?.user?.email,
    session.data?.user?.name,
    startProgressBar,
  ])

  return (
    <>
      <div id="table" className="shadow-md rounded-md border border-gray-200">
        <Table>
          <TableHeader className="bg-white rounded-t-md h-14">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id} className="rounded-t-md">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="first:rounded-tl-md last:rounded-tr-md"
                      >
                        {header.placeholderId
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-56 text-center bg-white/50"
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Loader2 className="size-4 animate-spin" /> Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="odd:bg-gray-50 even:bg-white last:rounded-b-md"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="first:rounded-bl-md last:rounded-br-md"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-56 text-center bg-white/50"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination total={data?.total ?? 0} />
    </>
  )
}
