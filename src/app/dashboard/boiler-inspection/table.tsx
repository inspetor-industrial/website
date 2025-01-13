'use client'

import { BoilerInspection } from '@inspetor/@types/models/boiler-inspection'
import { Pagination } from '@inspetor/components/table/pagination'
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

import { columns } from './columns'

export function BoilerInspectionTable() {
  const [search] = useQueryState('search', parseAsString.withDefault(''))
  const [currentPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const session = useSession()

  const { data, isPending, refetch } = useQuery<{
    total: number
    boilerInspections: BoilerInspection[]
  }>({
    queryKey: ['boiler-inspection', search, currentPage],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const coll = collection(firestore, firebaseModels.boilerInspection)
      const q = query(
        coll,
        and(
          where(
            'rowNumber',
            '>=',
            (currentPage - 1) * appConfigs.limitOfQueries,
          ),
          where(
            appConfigs.firestore.permissions.byCompanyPropertyName,
            '==',
            session.data?.user?.companyId ?? '',
          ),
          where('search', 'array-contains-any', [
            normalizeText(search) || appConfigs.firestore.emptyString,
          ]),
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
            where(
              appConfigs.firestore.permissions.byCompanyPropertyName,
              '==',
              session.data?.user?.companyId ?? '',
            ),
            where('search', 'array-contains-any', [
              normalizeText(search) || appConfigs.firestore.emptyString,
            ]),
          ),
          orderBy('rowNumber'),
        ),
      )
      const boilerInspections = await getDocs(q)

      return {
        total: total.data().count,
        boilerInspections: boilerInspections.docs.map((doc) => {
          const data = doc.data() as BoilerInspection
          return {
            ...data,
            id: doc.id,
          }
        }),
      }
    },
    enabled: !!session.data?.user?.companyId,
  })

  const table = useReactTable({
    data: data?.boilerInspections ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const startProgressBar = useProgress()
  const router = useRouter()

  useEffect(() => {
    function handleNavigateToPreviewPage(event: Event) {
      const { boilerInspectionId } = (event as CustomEvent).detail

      startProgressBar()

      router.push(`/reports/boiler-inspection/preview/${boilerInspectionId}`)
    }

    async function handleDeleteManometer(event: Event) {
      const { boilerInspection } = (event as CustomEvent).detail

      try {
        const coll = collection(firestore, firebaseModels.boilerInspection)
        const docRef = doc(coll, boilerInspection.id)

        await deleteDoc(docRef)

        toast({
          title: 'Inspeção deletada com sucesso!',
          variant: 'success',
        })

        refetch()
      } catch {
        toast({
          title: 'Erro ao deletar inspeção!',
          variant: 'destructive',
        })
      }
    }

    window.addEventListener(
      events.models.boilerInspection.navigate.to.preview,
      handleNavigateToPreviewPage,
    )

    window.addEventListener(
      events.models.boilerInspection.delete,
      handleDeleteManometer,
    )

    return () => {
      window.removeEventListener(
        events.models.boilerInspection.delete,
        handleDeleteManometer,
      )

      window.removeEventListener(
        events.models.boilerInspection.navigate.to.preview,
        handleNavigateToPreviewPage,
      )
    }
  }, [
    refetch,
    router,
    session.data?.user?.email,
    session.data?.user.id,
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
