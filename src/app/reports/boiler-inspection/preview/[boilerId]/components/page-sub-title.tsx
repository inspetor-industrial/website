import { cn } from '@inspetor/lib/utils'
import { ComponentProps } from 'react'

interface PageSubTitleProps extends ComponentProps<'h1'> {}

export async function PageSubTitle({ className, ...rest }: PageSubTitleProps) {
  return (
    <h2
      className={cn('w-full text-left font-bold text-lg uppercase', className)}
      {...rest}
    />
  )
}
