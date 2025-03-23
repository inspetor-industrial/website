import { PageBreak } from '@inspetor/app/reports/components/page-break'
import { cn } from '@inspetor/lib/utils'
import { ComponentProps } from 'react'

interface PageContainerProps extends ComponentProps<'div'> {
  breakPage?: boolean | null
  isReport?: string
}

export async function PageContainer({
  className,
  children,
  breakPage = true,
  isReport,
  ...rest
}: PageContainerProps) {
  return (
    <>
      {breakPage && <PageBreak />}
      <div
        className={cn(
          'overflow-x-hidden w-full px-20 flex flex-col justify-start items-center space-y-8',
          !isReport && 'mt-20',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </>
  )
}
