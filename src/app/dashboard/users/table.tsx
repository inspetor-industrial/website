'use client'

import { User } from '@inspetor/@types/models/user'
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
import { useServerAction } from 'zsa-react'

import { deleteAuthUser } from './actions'
import { columns } from './columns'

export function UserTable() {
  const [name] = useQueryState('name', parseAsString.withDefault(''))
  const [currentPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { execute } = useServerAction(deleteAuthUser)

  const session = useSession()

  const { data, isPending, refetch } = useQuery<{
    total: number
    users: User[]
  }>({
    queryKey: ['users', name, currentPage],
    throwOnError: SentryReactQueryCatcher,
    queryFn: async () => {
      const coll = collection(firestore, firebaseModels.users)
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
          ),
          orderBy('rowNumber'),
        ),
      )
      const users = await getDocs(q)

      return {
        total: total.data().count,
        users: users.docs.map((doc) => {
          const data = doc.data() as User
          return {
            ...data,
            id: doc.id,
          }
        }),
      }
    },
  })

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const startProgressBar = useProgress()
  const router = useRouter()

  useEffect(() => {
    function handleNavigateToRegisterPage() {
      startProgressBar()

      router.push('/dashboard/users/new')
    }

    function handleNavigateToDetailPage(event: Event) {
      const { userId } = (event as CustomEvent).detail

      startProgressBar()

      router.push(`/dashboard/users/${userId}?detail=true`)
    }

    function handleNavigateToUpdatePage(event: Event) {
      const { userId } = (event as CustomEvent).detail

      startProgressBar()

      router.push(`/dashboard/users/${userId}`)
    }

    async function handleDeleteUser(event: Event) {
      const { user } = (event as CustomEvent).detail

      try {
        const [deleteResult, deleteError] = await execute({ userId: user.id })
        if (!deleteResult?.success || deleteError) {
          toast({
            title: 'Erro ao deletar usuário!',
            variant: 'destructive',
          })

          return
        }

        const coll = collection(firestore, firebaseModels.users)

        const docRef = doc(coll, user.id)
        await deleteDoc(docRef)

        queryClient.invalidateQueries({
          queryKey: ['users'],
          type: 'all',
        })

        refetch()

        toast({
          title: `Usuário ${user.name} deletado com sucesso!`,
          variant: 'success',
        })
      } catch {
        toast({
          title: 'Erro ao deletar usuário!',
          variant: 'destructive',
        })
      }
    }

    window.addEventListener(
      events.models.users.navigate.to.register,
      handleNavigateToRegisterPage,
    )

    window.addEventListener(
      events.models.users.navigate.to.detail,
      handleNavigateToDetailPage,
    )

    window.addEventListener(
      events.models.users.navigate.to.update,
      handleNavigateToUpdatePage,
    )

    window.addEventListener(events.models.users.delete, handleDeleteUser)

    return () => {
      window.removeEventListener(
        events.models.users.navigate.to.register,
        handleNavigateToRegisterPage,
      )

      window.removeEventListener(
        events.models.users.navigate.to.detail,
        handleNavigateToDetailPage,
      )

      window.removeEventListener(
        events.models.users.navigate.to.update,
        handleNavigateToUpdatePage,
      )

      window.removeEventListener(events.models.users.delete, handleDeleteUser)
    }
  }, [
    execute,
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
