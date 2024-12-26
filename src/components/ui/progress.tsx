'use client'

import { cn } from '@inspetor/lib/utils'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <div className="flex flex-row-reverse items-center gap-2">
    <span className="text-sm">{value || 0}%</span>
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-inspetor-dark-blue-700 transition-all animate-pulse"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
