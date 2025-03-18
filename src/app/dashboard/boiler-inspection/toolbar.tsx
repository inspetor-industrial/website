'use client'

import { Button } from '@inspetor/components/ui/button'
import { Input } from '@inspetor/components/ui/input'
import { CirclePlus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import { useRef } from 'react'

import { BoilerInspectionModal, BoilerInspectionModalRef } from './modal'

export function Toolbar() {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )
  const router = useRouter()

  const modalRef = useRef<BoilerInspectionModalRef | null>(null)

  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        className="!h-9 !w-96"
        placeholder="Pesquisar por serviço ou cliente..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="space-x-2">
        <Button variant="inspetor-blue" onClick={() => router.refresh()}>
          <Search className="size-4" />
          Pesquisar
        </Button>
        <Button
          variant="inspetor-blue"
          onClick={() => modalRef.current?.open()}
        >
          <CirclePlus className="size-4" />
          Cadastrar
        </Button>
      </div>

      <BoilerInspectionModal isInToolbar ref={modalRef} />
    </div>
  )
}
