'use client'

import { Button } from '@inspetor/components/ui/button'
import { Input } from '@inspetor/components/ui/input'
import { CirclePlus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import { Link } from 'react-transition-progress/next'

export function Toolbar() {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        className="!h-9 !w-96"
        placeholder="Pesquisar por número de certificado ou o contratante..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="space-x-2">
        <Button variant="inspetor-blue" onClick={() => router.refresh()}>
          <Search className="size-4" />
          Pesquisar
        </Button>
        <Button variant="inspetor-blue" asChild>
          <Link href="/dashboard/valve-calibration/new">
            <CirclePlus className="size-4" />
            Cadastrar
          </Link>
        </Button>
      </div>
    </div>
  )
}
