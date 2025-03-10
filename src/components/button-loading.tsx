import { cn } from '@inspetor/lib/utils'
import { Loader } from 'lucide-react'

import { Button, type ButtonProps } from './ui/button'

type ButtonLoadingProps = ButtonProps & {
  isLoading?: boolean
}

export function ButtonLoading({
  className,
  children,
  isLoading,
  ...props
}: ButtonLoadingProps) {
  return (
    <Button className={cn('', className)} {...props}>
      {isLoading ? <Loader className="size-4 animate-spin" /> : children}
    </Button>
  )
}
