'use client'

import { cn } from '@inspetor/lib/utils'
import { type ComponentProps, useEffect, useRef, useState } from 'react'

type AsideProps = ComponentProps<'div'>

export function Aside({ className, ...props }: AsideProps) {
  const [heightOfParent, setHeightOfParent] = useState<number | string>(
    'h-screen',
  )
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const heightOfParent =
          containerRef.current.parentElement?.getClientRects()[0]
        setHeightOfParent(heightOfParent?.height ?? 'h-screen')
      }
    }

    if (containerRef.current) {
      const heightOfParent =
        containerRef.current.parentElement?.getClientRects()[0]
      setHeightOfParent(heightOfParent?.height ?? 'h-screen')
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ height: heightOfParent }}
      className={cn(
        'w-52 flex flex-col items-center justify-between py-6 h-screen bg-inspetor-dark-blue-700',
        className,
      )}
      {...props}
    />
  )
}
