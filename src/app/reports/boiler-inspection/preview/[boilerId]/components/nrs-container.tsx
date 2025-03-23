import { cn } from '@inspetor/lib/utils'
import { ComponentProps } from 'react'

interface NrsProps extends ComponentProps<'span'> {}

interface NrsContainerProps extends ComponentProps<'div'> {}

export async function NrsContainer({ className, ...rest }: NrsContainerProps) {
  return (
    <div
      className={cn(
        'w-full space-y-2 flex flex-col items-start justify-start gap-2',
        className,
      )}
      {...rest}
    />
  )
}

export async function Nrs({ className, children, ...rest }: NrsProps) {
  return (
    <span
      className={cn('text-left w-full text-sm font-medium my-1', className)}
      dangerouslySetInnerHTML={{ __html: String(children) }}
      {...rest}
    />
  )
}
