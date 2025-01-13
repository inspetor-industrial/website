import { cn } from '@inspetor/lib/utils'
import { ComponentProps, PropsWithChildren } from 'react'

type DivProps = ComponentProps<'div'>
type FormGroupProps = PropsWithChildren<DivProps> & {
  gridCols?: number
  title?: string
}

export function FormGroup({
  children,
  className,
  gridCols = 3,
  title,
  ...props
}: FormGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
      <div
        className={cn(`grid grid-cols-${gridCols} w-full gap-4`, className)}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
