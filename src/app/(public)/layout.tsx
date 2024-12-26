import { InspetorLoading } from '@inspetor/components/inspetor-loading'
import { Navbar } from '@inspetor/components/navbar'
import { Suspense } from 'react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <InspetorLoading />
        </div>
      }
    >
      <div className="h-screen overflow-hidden">
        <Navbar />
        <div id="public-layout" />
        {children}
      </div>
    </Suspense>
  )
}
