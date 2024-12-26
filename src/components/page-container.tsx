import { cn } from '@inspetor/lib/utils'
import { ComponentProps } from 'react'

type PageContainerProps = ComponentProps<'main'>

export function PageContainer({ className, ...props }: PageContainerProps) {
  return <main className={cn('space-y-10', className)} {...props} />
}
