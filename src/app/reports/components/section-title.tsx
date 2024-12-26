import { cn } from '@inspetor/lib/utils'
import { ComponentProps } from 'react'

type SectionTitleProps = ComponentProps<'h3'>

export function SectionTitle({ className, ...props }: SectionTitleProps) {
  return (
    <div className="flex w-full justify-center items-center py-8">
      <h3
        className={cn(
          'w-full bg-inspetor-dark-blue-700/75 text-center font-bold text-xl uppercase underline py-0.5',
          className,
        )}
        {...props}
      />
    </div>
  )
}
