'use client'

import { Button } from '@inspetor/components/ui/button'
import { appConfigs } from '@inspetor/constants/configs'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  //   ChevronsLeft,
  //   ChevronsRight,
} from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'

interface PaginationProps {
  total: number
}

export function Pagination({ total }: PaginationProps) {
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1),
  )

  const totalPages = Math.ceil(total / appConfigs.limitOfQueries)

  function handlePreviousPage() {
    if (currentPage === 1 || currentPage <= 0) {
      setCurrentPage(1)
      return
    }

    setCurrentPage((prev) => prev - 1)
  }

  function handleNextPage() {
    setCurrentPage((prev) => prev + 1)
  }

  function handleFirstPage() {
    setCurrentPage(1)
  }

  function handleLastPage() {
    setCurrentPage(totalPages)
  }

  return (
    <div className="w-full flex justify-between items-center mt-2">
      <div className="text-sm text-gray-500">
        Página {currentPage} de {totalPages || 1}, total de {total} registro(s)
      </div>
      <div className="space-x-1">
        <Button
          disabled={currentPage === 1 || currentPage <= 0}
          onClick={handleFirstPage}
          variant="outline"
          size="icon"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          disabled={currentPage === 1 || currentPage <= 0}
          onClick={handlePreviousPage}
          variant="outline"
          size="icon"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          disabled={totalPages >= currentPage || totalPages === 0}
          onClick={handleNextPage}
          variant="outline"
          size="icon"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          disabled={totalPages >= currentPage || totalPages === 0}
          onClick={handleLastPage}
          variant="outline"
          size="icon"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
