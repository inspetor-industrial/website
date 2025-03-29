'use client'

import { Button } from '@inspetor/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@inspetor/components/ui/select'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'

export function Toolbar() {
  const [reportType, setReportType] = useQueryState(
    'type',
    parseAsString.withDefault(''),
  )
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-4">
      <Select
        onValueChange={(value) => setReportType(value)}
        value={reportType}
      >
        <SelectTrigger className="!h-9 !w-96">
          <SelectValue placeholder="Selecione o tipo de relatório" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="boiler">Caldeira</SelectItem>
          <SelectItem value="manometer">Manômetro</SelectItem>
          <SelectItem value="valve">Válvula</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-x-2">
        <Button variant="inspetor-blue" onClick={() => router.refresh()}>
          <Search className="size-4" />
          Pesquisar
        </Button>
      </div>
    </div>
  )
}
