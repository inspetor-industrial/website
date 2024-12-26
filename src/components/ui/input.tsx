import { cn } from '@inspetor/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

export const inputVariants = cva(
  'flex focus:border-input h-10 w-full rounded-md border-2 border-transparent bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-not-allowed read-only:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default:
          'bg-inspetor-gray-300 text-inspetor-gray-foreground border-inspetor-gray-300 rounded-md',
        profile:
          'bg-gray-100 text-inspetor-gray-foreground border-gray-100 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface InputProps
  extends React.ComponentProps<'input'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(className, inputVariants({ variant }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
