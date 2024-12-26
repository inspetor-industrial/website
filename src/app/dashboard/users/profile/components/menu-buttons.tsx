'use client'

import { Button } from '@inspetor/components/ui/button'
import { cn } from '@inspetor/lib/utils'
import { Briefcase, CircleUserRound } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'

export function MenuButtons() {
  const [currentSection, setCurrentSection] = useQueryState(
    'section',
    parseAsString.withDefault('personal'),
  )

  return (
    <div className="flex flex-col gap-2 w-full px-6">
      <Button
        variant="outline"
        className={cn(
          'text-left justify-start',
          currentSection === 'personal' &&
            'bg-inspetor-gray-300 text-inspetor-gray-foreground',
        )}
        onClick={() => {
          setCurrentSection('personal')
        }}
        type="button"
      >
        <CircleUserRound className="size-4" />
        <span className="text-sm">Informações Pessoais</span>
      </Button>
      <Button
        variant="outline"
        className={cn(
          'text-left justify-start',
          currentSection === 'professional' &&
            'bg-inspetor-gray-300 text-inspetor-gray-foreground',
        )}
        onClick={() => {
          setCurrentSection('professional')
        }}
        type="button"
      >
        <Briefcase className="size-4" />
        <span className="text-sm">Informações Profissionais</span>
      </Button>
      {/* <Button
        variant="outline"
        className={cn(
          'text-left justify-start',
          currentSection === 'settings' &&
            'bg-inspetor-gray-300 text-inspetor-gray-foreground',
        )}
        onClick={() => {
          setCurrentSection('settings')
        }}
        type="button"
      >
        <Cog className="size-4" />
        <span className="text-sm">Configurações</span>
      </Button> */}
    </div>
  )
}
