'use client'

import { Button } from '@inspetor/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@inspetor/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@inspetor/components/ui/popover'
import { appConfigs } from '@inspetor/constants/configs'
import { SentryReactQueryCatcher } from '@inspetor/lib/sentry/react-query/catcher'
import { cn } from '@inspetor/lib/utils'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Check, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'

type Option = { value: string; label: string }
type GetOptionRequest = {
  page: number
  limit: number
  companyId: string
  filters: { search: string }
}

export interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  doubleChevronIcon?: boolean
  entityKey: string
  queryFn: (params: GetOptionRequest) => Promise<any>
  label?: ReactNode
  triggerClassName?: string
}

export function Combobox({
  entityKey,
  queryFn,
  onChange,
  value: defaultValue,
  disabled = false,
  doubleChevronIcon = false,
  label: ComponentLabel,
  triggerClassName,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchOption, setSearchOption] = useState<string>('')

  const session = useSession()

  const {
    data: pages,
    isPending: isLoadingData,
    fetchNextPage,
  } = useInfiniteQuery<Array<Option>>({
    queryKey: ['options', entityKey],
    throwOnError: SentryReactQueryCatcher,
    getNextPageParam: (_, pages) => {
      const lastPage = pages[pages.length - 1]
      if (lastPage.length < appConfigs.limitOfQueries) {
        return undefined
      }

      return pages.length + 1
    },
    queryFn: async ({ pageParam = 1 }) => {
      const response = await queryFn({
        page: pageParam as number,
        limit: appConfigs.limitOfQueries,
        companyId: session.data!.user.companyId,
        filters: { search: searchOption },
      })
      return response
    },
    initialPageParam: 1,
    enabled: !!session.data?.user.companyId,
  })

  const lastOptionRef = useRef<HTMLElement | null>(null)
  const { entry, ref } = useIntersection({
    root: lastOptionRef.current,
    threshold: 1,
  })

  const ChevronIcon = doubleChevronIcon ? ChevronsUpDown : ChevronDown
  const options: Option[] = (pages?.pages.flatMap((page) => page) ||
    []) as Option[]

  const popoverContentId = useMemo(
    () => `popover-content-${entityKey}`,
    [entityKey],
  )
  const popoverTriggerId = useMemo(
    () => `popover-trigger-${entityKey}`,
    [entityKey],
  )

  function handleResizePopoverContent() {
    const popoverTrigger = document.getElementById(popoverTriggerId)
    const popoverContent = document.getElementById(popoverContentId)

    if (popoverTrigger && popoverContent) {
      popoverContent.style.setProperty(
        'width',
        `${popoverTrigger.offsetWidth}px`,
      )
    }
  }

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  return (
    <Popover
      open={open}
      onOpenChange={(openState) => {
        if (openState) {
          setTimeout(handleResizePopoverContent, 10)
        }

        setOpen(openState)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={popoverTriggerId}
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full h-9 justify-between bg-valeiot-surface px-3 text-sm disabled:!opacity-50',
            triggerClassName,
          )}
        >
          {ComponentLabel}
          {defaultValue
            ? options.find((option) => option.value === defaultValue)?.label
            : ''}
          {isLoadingData ? (
            <Loader2 className="animate-spin size-4 self-end" />
          ) : (
            <ChevronIcon className="size-4 shrink-0 opacity-50 ml-auto" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0" id={popoverContentId}>
        <Command>
          <CommandInput
            value={searchOption}
            onValueChange={setSearchOption}
            placeholder=""
          />
          <CommandList className="no-scrollbar">
            {!isLoadingData && <CommandEmpty>No items found.</CommandEmpty>}
            <CommandGroup>
              {isLoadingData && (
                <div className="flex w-full items-center justify-center p-2 gap-2">
                  <Loader2 className="animate-spin size-4" />
                  <span>Loading Data</span>
                </div>
              )}
              {options.map((option, optionIndex) => {
                if (optionIndex === options.length - 1) {
                  return (
                    <CommandItem
                      ref={ref}
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onChange(
                          currentValue === defaultValue ? '' : currentValue,
                        )
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 size-4',
                          defaultValue === option.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  )
                }

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(
                        currentValue === defaultValue ? '' : currentValue,
                      )
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        defaultValue === option.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
