'use client'

import { Button } from '@inspetor/components/ui/button'
import { Input } from '@inspetor/components/ui/input'
import { Search, UserPlus2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import { Link } from 'react-transition-progress/next'

export function Toolbar() {
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''))
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        className="!h-9 !w-96"
        placeholder="Pesquise pelo nome do usuário ou seu email.."
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <div className="space-x-2">
        <Button variant="inspetor-blue" onClick={() => router.refresh()}>
          <Search className="size-4" />
          Pesquisar
        </Button>
        <Button variant="inspetor-blue" asChild>
          <Link href="/dashboard/users/new">
            <UserPlus2 className="size-4" />
            Adicionar Usuário
          </Link>
        </Button>
      </div>
    </div>
  )
}
