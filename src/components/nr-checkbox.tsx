import { cn } from '@inspetor/lib/utils'
import type { ClassValue } from 'clsx'
import { memo, useState } from 'react'
import { v4 } from 'uuid'

import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

export interface NrCheckboxProps {
  value?: boolean | null
  onChangeValue: (value: boolean) => void
  label: string
  labelClassName?: ClassValue
}

const NrCheckboxComponent = ({
  value,
  onChangeValue,
  label,
  labelClassName,
}: NrCheckboxProps) => {
  const [checked, setChecked] = useState(value ?? false)
  const nrCheckboxId = `nrCheckbox-${v4()}`

  return (
    <div className="cursor-pointer flex items-start justify-start gap-2">
      <Checkbox
        className="border-zinc-950 bg-zinc-800 data-[state=checked]:bg-blue-800"
        checked={checked}
        onClick={() => {
          setChecked((state) => !state)
          onChangeValue(!checked)
        }}
        id={nrCheckboxId}
      />
      <Label
        className={cn(
          'uppercase cursor-pointer text-white -mt-1.5',
          labelClassName,
        )}
        htmlFor={nrCheckboxId}
      >
        {label}
      </Label>
    </div>
  )
}

export const NrCheckbox = memo(NrCheckboxComponent)
