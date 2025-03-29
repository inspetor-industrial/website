'use client'

import type { GeneratedReport } from '@inspetor/@types/models/generated-reports'
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
import { firestore, storage } from '@inspetor/lib/firebase/client'
import { queryClient } from '@inspetor/lib/query'
import { SentryReactQueryCatcher } from '@inspetor/lib/sentry/react-query/catcher'
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
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useProgress } from 'react-transition-progress'

import { columns } from './columns'

export function ReportTable() {
  const [reportType] = useQueryState('type', parseAsString.withDefault(''))

  const session = useSession()

  const { data, isPending, refetch } = useQuery<{
    total: number
    reports: GeneratedReport[]
  }>({
    queryKey: ['reports', reportType],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const coll = collection(firestore, firebaseModels.reports)
      const q = query(
        coll,
        and(
          where('createdBy', '==', session.data?.user?.id),
          where('type', '==', reportType),
        ),
      )

      const reports = await getDocs(q)
      const total = reports.docs.length

      return {
        total,
        reports: reports.docs.map((doc) => {
          const data = doc.data() as GeneratedReport
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
    data: data?.reports ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const startProgressBar = useProgress()
  const router = useRouter()

  useEffect(() => {
    async function handleDownloadReport(event: Event) {
      const { reportUrl } = (event as CustomEvent).detail

      window.open(reportUrl, '_blank')
    }

    async function handleDeleteReport(event: Event) {
      const { report } = (event as CustomEvent).detail

      try {
        const coll = collection(firestore, firebaseModels.reports)

        const docRef = doc(coll, report.id)
        await deleteDoc(docRef)

        const storageRef = ref(
          storage,
          report.url.replace(
            'https://storage.googleapis.com/inspetor-database-eb605.appspot.com/',
            '',
          ),
        )
        await deleteObject(storageRef)

        queryClient.invalidateQueries({
          queryKey: ['reports'],
          type: 'all',
        })

        refetch()

        toast({
          title: `Relatório ${report.name} deletado com sucesso!`,
          variant: 'success',
        })
      } catch {
        toast({
          title: 'Erro ao deletar relatório!',
          variant: 'destructive',
        })
      }
    }

    window.addEventListener(events.models.reports.delete, handleDeleteReport)
    window.addEventListener(
      events.models.reports.download,
      handleDownloadReport,
    )

    return () => {
      window.removeEventListener(
        events.models.reports.delete,
        handleDeleteReport,
      )

      window.removeEventListener(
        events.models.reports.download,
        handleDownloadReport,
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
    </>
  )
}
