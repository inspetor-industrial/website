'use client'

import { Button } from '@inspetor/components/ui/button'
import { Calendar } from '@inspetor/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@inspetor/components/ui/popover'
import { dayjsApi } from '@inspetor/lib/dayjs'
import { cn } from '@inspetor/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

interface DatePickerProps {
  value?: number
  disabled?: boolean
  onChange: (value: number) => void
}

export function DatePicker({
  onChange,
  value,
  disabled = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined,
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          key={value}
          className={cn(
            'w-full h-10 bg-inspetor-gray-300 hover:!bg-inspetor-gray-300 justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? (
            dayjsApi(new Date(value)).format('DD/MM/YYYY')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          // @ts-expect-error [ignore]
          selected={date || value ? new Date(value) : undefined}
          disabled={(date) => date < new Date(Date.now() - 24 * 60 * 60 * 1000)}
          onSelect={(date) => {
            setDate(date)
            onChange(date?.getTime() ?? 0)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
