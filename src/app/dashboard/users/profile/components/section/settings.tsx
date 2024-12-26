'use client'

import { CardHeader, CardTitle } from '@inspetor/components/ui/card'
import { cn } from '@inspetor/lib/utils'
import { parseAsString, useQueryState } from 'nuqs'

export function SettingsSection() {
  const [currentSection] = useQueryState(
    'section',
    parseAsString.withDefault('personal'),
  )

  return (
    <section className={cn('hidden', currentSection === 'settings' && 'flex')}>
      <CardHeader className="px-0">
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
    </section>
  )
}
