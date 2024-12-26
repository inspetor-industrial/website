import { cn } from '@inspetor/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { ComponentProps } from 'react'

const titleVariants = cva('font-semibold', {
  variants: {
    variant: {
      xl: 'text-5xl',
      lg: 'text-4xl',
      md: 'text-3xl',
      sm: 'text-2xl',
      xs: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'lg',
  },
})

interface TitleProps
  extends ComponentProps<'h1'>,
    VariantProps<typeof titleVariants> {}

export async function Title({
  className,
  variant = 'lg',
  ...rest
}: TitleProps) {
  return <h1 className={cn(titleVariants({ variant }), className)} {...rest} />
}
