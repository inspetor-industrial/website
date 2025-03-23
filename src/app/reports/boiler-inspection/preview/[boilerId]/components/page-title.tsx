import { cn } from '@inspetor/lib/utils'
import { ComponentProps } from 'react'

interface PageTitleProps extends ComponentProps<'h1'> {}

export async function PageTitle({ className, ...rest }: PageTitleProps) {
  return (
    <h1
      className={cn(
        'w-full bg-inspetor-dark-blue-700/75 text-center font-bold text-xl uppercase underline py-0.5',
        className,
      )}
      {...rest}
    />
  )
}
